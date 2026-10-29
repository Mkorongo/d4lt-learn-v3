// Quiz za masomo na mtihani wa mwisho wa kozi
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const os = require('os');
const { execFile } = require('child_process');
const { pathToFileURL } = require('url');

const PASS = 50;       // asilimia ya kufaulu quiz (50% au zaidi)
const MAX_QUIZ = 10;   // upeo wa maswali kwenye quiz moja
const MAX_EXAM = 500;  // upeo wa maswali kwenye bank ya mtihani
const MAX_ATTACH = 5;                       // faili za mwalimu kwa swali moja la essay
const MAX_ATTACH_BYTES = 100 * 1024 * 1024; // MB 100 kwa faili la mwalimu
const MAX_ANSWER_BYTES = 50 * 1024 * 1024;  // MB 50 kwa faili la majibu ya mwanafunzi
const MAX_ANSWER_TEXT = 20000;              // herufi za jibu lililoandikwa

module.exports = function init({ app, db, auth, need, canAccessCourse, canManageCourse, UPLOAD_DIR, getSoffice, L }) {
  // Faili za essay (za mwalimu na za wanafunzi) ziko folda yake. Majina ni ya nasibu bila extension,
  // na zinatolewa tu kupitia njia zenye ulinzi kama "attachment", kwa hiyo faili la aina yoyote ni salama kupokelewa.
  const ESSAY_DIR = path.join(UPLOAD_DIR, 'essay');
  fs.mkdirSync(ESSAY_DIR, { recursive: true });

  const QUESTIONS_SQL = name => `
  CREATE TABLE IF NOT EXISTS ${name} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    scope TEXT NOT NULL CHECK(scope IN ('quiz','exam')),
    type TEXT NOT NULL CHECK(type IN ('mcq','match','short','essay')),
    text TEXT NOT NULL,
    points REAL NOT NULL DEFAULT 1,
    data TEXT NOT NULL,
    position INTEGER DEFAULT 0
  );`;
  db.exec(QUESTIONS_SQL('questions'));
  // Hifadhidata ya zamani ina CHECK isiyojua 'essay': jenga upya jedwali mara moja (data inanakiliwa kama ilivyo)
  const qdef = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='questions'").get();
  if (qdef && !/'essay'/.test(qdef.sql)) {
    const fk = db.pragma('foreign_keys', { simple: true });
    db.pragma('foreign_keys = OFF');
    try {
      db.transaction(() => {
        db.exec(QUESTIONS_SQL('questions_new'));
        db.exec('INSERT INTO questions_new(id,course_id,lesson_id,scope,type,text,points,data,position) SELECT id,course_id,lesson_id,scope,type,text,points,data,position FROM questions');
        db.exec('DROP TABLE questions');
        db.exec('ALTER TABLE questions_new RENAME TO questions');
      })();
    } finally { db.pragma('foreign_keys = ' + (fk ? 'ON' : 'OFF')); }
  }
  db.exec(`
  CREATE TABLE IF NOT EXISTS question_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    stored TEXT NOT NULL,
    size INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS essay_subs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL DEFAULT '',
    file_name TEXT,
    stored TEXT,
    size INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    score REAL,
    feedback TEXT NOT NULL DEFAULT '',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    marked_at TEXT
  );
  CREATE INDEX IF NOT EXISTS essay_subs_q ON essay_subs(question_id, user_id);
  CREATE INDEX IF NOT EXISTS essay_subs_course ON essay_subs(course_id, status);`);
  db.exec(`
  CREATE TABLE IF NOT EXISTS attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    scope TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    question_ids TEXT NOT NULL DEFAULT '[]',
    score REAL DEFAULT 0,
    total REAL DEFAULT 0,
    pct REAL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    submitted_at TEXT
  );`);
  for (const col of ['exam_count INTEGER DEFAULT 0', 'exam_attempts INTEGER DEFAULT 1']) {
    try { db.exec('ALTER TABLE courses ADD COLUMN ' + col); } catch { /* tayari ipo */ }
  }

  // ---------- Helpers ----------
  const r2 = n => Math.round(n * 100) / 100;
  const parseQ = q => ({ ...q, data: JSON.parse(q.data) });
  const norm = s => String(s ?? '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const bad = (lang, sw, en) => Object.assign(new Error(L(lang, sw, en)), { status: 400 });

  function clean(b, lang) {
    b = b || {};
    const type = b.type;
    const text = String(b.text || '').trim();
    if (!['mcq', 'match', 'short', 'essay'].includes(type)) throw bad(lang, 'Chagua aina ya swali', 'Choose a question type');
    if (!text) throw bad(lang, 'Andika swali', 'Enter the question');
    if (text.length > (type === 'essay' ? 5000 : 1000)) throw bad(lang, 'Swali ni refu mno', 'The question is too long');
    let points = Number(b.points);
    if (!(points > 0) || points > 100) points = 1;
    points = r2(points);
    let data;
    if (type === 'essay') {
      data = {}; // viambatisho viko kwenye question_files; alama zote za swali ni points
    } else if (type === 'mcq') {
      const raw = Array.isArray(b.options) ? b.options.slice(0, 6).map(o => String(o ?? '').trim()) : [];
      const c = Number(b.correct);
      if (!Number.isInteger(c) || !raw[c]) throw bad(lang, 'Chagua jibu sahihi (lazima liwe na maandishi)', 'Choose the correct answer (it must have text)');
      const kept = [];
      let correct = -1;
      raw.forEach((o, i) => { if (o) { if (i === c) correct = kept.length; kept.push(o); } });
      if (kept.length < 2) throw bad(lang, 'Weka angalau chaguo mbili', 'Enter at least two options');
      data = { options: kept, correct };
    } else if (type === 'match') {
      const pairs = (Array.isArray(b.pairs) ? b.pairs : []).slice(0, 8)
        .map(p => ({ l: String((p || {}).l ?? '').trim(), r: String((p || {}).r ?? '').trim() }))
        .filter(p => p.l && p.r);
      if (pairs.length < 2) throw bad(lang, 'Weka angalau jozi mbili kamili', 'Enter at least two complete pairs');
      data = { pairs };
    } else {
      const answers = (Array.isArray(b.answers) ? b.answers : []).map(a => String(a ?? '').trim()).filter(Boolean).slice(0, 10);
      if (!answers.length) throw bad(lang, 'Weka angalau jibu moja sahihi', 'Enter at least one correct answer');
      data = { answers };
    }
    return { type, text, points, data };
  }

  // ---------- Essay: faili na majibu ----------
  const fixName = n => { try { return Buffer.from(String(n), 'latin1').toString('utf8'); } catch { return String(n); } };
  const cleanFileName = n => (fixName(n).replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '_').trim().slice(0, 150)) || 'file';
  const unlink = stored => { if (stored) fs.unlink(path.join(ESSAY_DIR, stored), () => {}); };
  const dropUploaded = req => (req.files || (req.file ? [req.file] : [])).forEach(f => unlink(f.filename));
  const passMark = points => r2(points * PASS / 100);
  const filesOf = qid => db.prepare('SELECT id,name,size FROM question_files WHERE question_id=? ORDER BY id').all(qid);
  const latestSub = (uid, qid) => db.prepare('SELECT * FROM essay_subs WHERE user_id=? AND question_id=? ORDER BY id DESC LIMIT 1').get(uid, qid);
  const subPassed = (s, points) => !!s && s.status === 'marked' && s.score >= passMark(points);
  const subOut = (s, points) => !s ? null : ({
    id: s.id, status: s.status, text: s.text, file_name: s.file_name, size: s.size, score: s.score, feedback: s.feedback,
    created_at: s.created_at, marked_at: s.marked_at, passed: subPassed(s, points), pass_mark: passMark(points)
  });
  const isEssay = q => q.type === 'essay';

  const attachUpload = multer({
    storage: multer.diskStorage({ destination: ESSAY_DIR, filename: (req, file, cb) => cb(null, crypto.randomBytes(16).toString('hex')) }),
    limits: { fileSize: MAX_ATTACH_BYTES, files: MAX_ATTACH }
  });
  const answerUpload = multer({
    storage: multer.diskStorage({ destination: ESSAY_DIR, filename: (req, file, cb) => cb(null, crypto.randomBytes(16).toString('hex')) }),
    limits: { fileSize: MAX_ANSWER_BYTES, files: 1 }
  });
  // Maswali ya kawaida yanakuja kama JSON; swali la essay linaweza kuja kama multipart (lenye faili)
  const maybeAttach = (req, res, next) => (req.is('multipart/form-data') ? attachUpload.array('files', MAX_ATTACH)(req, res, next) : next());

  // Inahifadhi viambatisho vipya na kufuta vilivyochaguliwa kuondolewa. Inarudisha kosa (string) au null.
  function saveAttachments(req, qid) {
    const up = req.files || [];
    let drop = [];
    try { drop = JSON.parse((req.body || {}).remove || '[]'); } catch { drop = []; }
    drop = Array.isArray(drop) ? drop.map(Number).filter(Number.isInteger) : [];
    const have = filesOf(qid).filter(f => !drop.includes(f.id)).length;
    if (have + up.length > MAX_ATTACH) {
      dropUploaded(req);
      return L(req, `Faili zisizidi ${MAX_ATTACH} kwa swali`, `At most ${MAX_ATTACH} files per question`);
    }
    for (const id of drop) {
      const f = db.prepare('SELECT * FROM question_files WHERE id=? AND question_id=?').get(id, qid);
      if (f) { unlink(f.stored); db.prepare('DELETE FROM question_files WHERE id=?').run(f.id); }
    }
    for (const f of up) db.prepare('INSERT INTO question_files(question_id,name,stored,size) VALUES(?,?,?,?)').run(qid, cleanFileName(f.originalname), f.filename, f.size);
    return null;
  }
  function purgeQuestion(qid) {
    db.prepare('SELECT stored FROM question_files WHERE question_id=?').all(qid).forEach(f => unlink(f.stored));
    db.prepare('SELECT stored FROM essay_subs WHERE question_id=? AND stored IS NOT NULL').all(qid).forEach(f => { unlink(f.stored); unlink(f.stored + '.txt'); });
  }
  function purgeLesson(lid) { db.prepare('SELECT id FROM questions WHERE lesson_id=?').all(lid).forEach(q => purgeQuestion(q.id)); }
  // Faili zisizotajwa kwenye hifadhidata (mfano baada ya kufuta kozi au mtumiaji) zinafutwa wakati seva inapoanza
  function sweep() {
    const keep = new Set([
      ...db.prepare('SELECT stored FROM question_files').all().map(r => r.stored),
      ...db.prepare('SELECT stored FROM essay_subs WHERE stored IS NOT NULL').all().flatMap(r => [r.stored, r.stored + '.txt'])
    ]);
    fs.readdir(ESSAY_DIR, (err, list) => { if (!err) list.filter(f => !keep.has(f)).forEach(f => unlink(f)); });
  }
  sweep();

  // Hali ya essay za somo kwa mwanafunzi mmoja
  function essayStats(uid, lid) {
    const qs = db.prepare("SELECT id,points FROM questions WHERE scope='quiz' AND lesson_id=? AND type='essay'").all(lid);
    let passed = 0, pending = 0, submitted = 0;
    for (const q of qs) {
      const s = latestSub(uid, q.id);
      if (s) submitted++;
      if (s && s.status === 'pending') pending++;
      if (subPassed(s, q.points)) passed++;
    }
    return { total: qs.length, passed, pending, submitted };
  }
  // Somo limefaulu: sehemu ya kawaida ≥ PASS (ikiwepo) na essay zote zimefaulu
  function lessonPassed(uid, lid) {
    const autoN = db.prepare("SELECT COUNT(*) n FROM questions WHERE scope='quiz' AND lesson_id=? AND type!='essay'").get(lid).n;
    if (autoN) {
      const b = db.prepare("SELECT MAX(pct) p FROM attempts WHERE user_id=? AND lesson_id=? AND scope='quiz' AND status='done'").get(uid, lid).p;
      if (!((b ?? -1) >= PASS)) return false;
    }
    const e = essayStats(uid, lid);
    return e.passed === e.total;
  }

  // Mwanafunzi haoni majibu sahihi
  function sanitize(q, uid) {
    const out = { id: q.id, type: q.type, text: q.text, points: q.points };
    if (q.type === 'essay') {
      out.files = filesOf(q.id);
      const s = uid ? latestSub(uid, q.id) : null;
      out.sub = subOut(s, q.points);
      out.can_submit = !s || (s.status === 'marked' && !subPassed(s, q.points));
      out.pass_mark = passMark(q.points);
    }
    if (q.type === 'mcq') out.options = q.data.options;
    if (q.type === 'match') {
      out.lefts = q.data.pairs.map(p => p.l);
      out.rights = shuffle(q.data.pairs.map(p => p.r));
    }
    return out;
  }

  function gradeOne(q, ans, lang) {
    const none = L(lang, '(hukujibu)', '(no answer)');
    const d = q.data;
    if (q.type === 'mcq') {
      const i = ans === null || ans === undefined || ans === '' ? -1 : Number(ans);
      const full = i === d.correct;
      return { earned: full ? q.points : 0, full, yours: [d.options[i] ?? none], correct: [d.options[d.correct]] };
    }
    if (q.type === 'match') {
      const a = Array.isArray(ans) ? ans : [];
      let ok = 0;
      d.pairs.forEach((p, i) => { if (String(a[i] ?? '').trim() === p.r) ok++; });
      return {
        earned: r2(q.points * ok / d.pairs.length), full: ok === d.pairs.length,
        yours: d.pairs.map((p, i) => `${p.l} → ${a[i] ? a[i] : '—'}`),
        correct: d.pairs.map(p => `${p.l} → ${p.r}`)
      };
    }
    const n = norm(ans);
    const full = !!n && d.answers.some(x => norm(x) === n);
    return { earned: full ? q.points : 0, full, yours: [String(ans ?? '').trim() || none], correct: [d.answers.join('  /  ')] };
  }

  function gradeSet(questions, answers, lang) {
    answers = answers && typeof answers === 'object' ? answers : {};
    let score = 0, total = 0, right = 0;
    const wrong = [];
    for (const q of questions) {
      const g = gradeOne(q, answers[q.id], lang);
      score += g.earned; total += q.points;
      if (g.full) right++;
      else wrong.push({ id: q.id, type: q.type, text: q.text, points: q.points, earned: g.earned, yours: g.yours, correct: g.correct });
    }
    score = r2(score); total = r2(total);
    const pct = total ? Math.round(1000 * score / total) / 10 : 0;
    return { score, total, pct, count: questions.length, right, wrong, passed: pct >= PASS };
  }

  const lessonOf = id => db.prepare('SELECT * FROM lessons WHERE id=?').get(id);
  const isDone = (uid, lid) => !!db.prepare('SELECT 1 FROM progress WHERE user_id=? AND lesson_id=?').get(uid, lid);
  const quizQs = lid => db.prepare("SELECT * FROM questions WHERE scope='quiz' AND lesson_id=? ORDER BY position,id").all(lid).map(parseQ);
  const examQs = cid => db.prepare("SELECT * FROM questions WHERE scope='exam' AND course_id=? ORDER BY position,id").all(cid).map(parseQ);
  const route = fn => (req, res, next) => {
    try { fn(req, res, next); } catch (e) {
      dropUploaded(req); // faili zilizopakiwa kwenye ombi lililoshindwa hazibaki
      if (e.status) return res.status(e.status).json({ error: e.message });
      console.error(e);
      res.status(500).json({ error: L(req, 'Hitilafu ya seva', 'Server error') });
    }
  };

  // ---------- Hali ya mtihani wa mwanafunzi ----------
  function examStatus(uid, cid, lang) {
    const course = db.prepare('SELECT exam_count,exam_attempts FROM courses WHERE id=?').get(cid);
    const lessons = db.prepare('SELECT id,title FROM lessons WHERE course_id=? AND parent_id IS NULL ORDER BY position,id').all(cid);
    const done = new Set(db.prepare('SELECT lesson_id FROM progress WHERE user_id=?').all(uid).map(r => r.lesson_id));
    const withQuiz = new Set(db.prepare("SELECT DISTINCT lesson_id FROM questions WHERE course_id=? AND scope='quiz'").all(cid).map(r => r.lesson_id));
    const notDone = lessons.filter(l => !done.has(l.id));
    const failing = lessons.filter(l => withQuiz.has(l.id) && !lessonPassed(uid, l.id));
    const qn = db.prepare("SELECT COUNT(*) n FROM questions WHERE scope='exam' AND course_id=?").get(cid).n;
    const reasons = [];
    if (!lessons.length) reasons.push(L(lang, 'Hakuna masomo kwenye kozi hii bado', 'There are no lessons in this course yet'));
    if (notDone.length) reasons.push(L(lang, `Maliza masomo ${notDone.length} yaliyobaki`, `Finish the ${notDone.length} remaining ${notDone.length === 1 ? 'lesson' : 'lessons'}`));
    if (failing.length) reasons.push(L(lang, `Pata angalau ${PASS}% kwenye quiz za: ${failing.map(l => l.title).join(', ')} (na essay zilizosahihishwa zifaulu)`, `Score at least ${PASS}% on the quizzes for: ${failing.map(l => l.title).join(', ')} (and pass any marked essay questions)`));
    const unlocked = lessons.length > 0 && !notDone.length && !failing.length;
    const used = db.prepare("SELECT COUNT(*) n FROM attempts WHERE user_id=? AND course_id=? AND scope='exam' AND status='done'").get(uid, cid).n;
    const open = db.prepare("SELECT id FROM attempts WHERE user_id=? AND course_id=? AND scope='exam' AND status='open'").get(uid, cid);
    const bestExam = db.prepare("SELECT MAX(pct) p FROM attempts WHERE user_id=? AND course_id=? AND scope='exam' AND status='done'").get(uid, cid).p;
    const allowed = course.exam_attempts ?? 1;
    const canStart = qn > 0 && unlocked && (!!open || allowed === 0 || used < allowed);
    return {
      questions: qn, per_attempt: course.exam_count > 0 ? Math.min(course.exam_count, qn) : qn,
      attempts_allowed: allowed, attempts_used: used, unlocked, reasons, can_start: canStart,
      resume: !!open, best: bestExam, passed: bestExam != null && bestExam >= PASS
    };
  }

  // Inaongeza taarifa za quiz/mtihani kwenye GET /api/courses/:id
  function decorate(user, cid, out, lang) {
    const counts = Object.fromEntries(db.prepare("SELECT lesson_id, COUNT(*) n FROM questions WHERE course_id=? AND scope='quiz' GROUP BY lesson_id").all(cid).map(r => [r.lesson_id, r.n]));
    out.lessons.forEach(l => (l.quiz_count = counts[l.id] || 0));
    const autoCounts = Object.fromEntries(db.prepare("SELECT lesson_id, COUNT(*) n FROM questions WHERE course_id=? AND scope='quiz' AND type!='essay' GROUP BY lesson_id").all(cid).map(r => [r.lesson_id, r.n]));
    out.lessons.forEach(l => { l.has_auto = (autoCounts[l.id] || 0) > 0; });
    if (user.role === 'student') {
      const best = Object.fromEntries(db.prepare(`SELECT lesson_id, MAX(pct) p FROM attempts
        WHERE user_id=? AND course_id=? AND scope='quiz' AND status='done' GROUP BY lesson_id`).all(user.id, cid).map(r => [r.lesson_id, r.p]));
      out.lessons.forEach(l => {
        l.best = best[l.id] ?? null;
        l.essays = l.quiz_count ? essayStats(user.id, l.id) : { total: 0, passed: 0, pending: 0, submitted: 0 };
        l.passed = l.quiz_count ? lessonPassed(user.id, l.id) : false;
      });
      out.exam = examStatus(user.id, cid, lang);
    } else {
      const c = db.prepare('SELECT exam_count,exam_attempts FROM courses WHERE id=?').get(cid);
      out.exam = { questions: examQs(cid).length, count: c.exam_count, attempts: c.exam_attempts };
      out.essays_pending = db.prepare("SELECT COUNT(*) n FROM essay_subs s WHERE s.course_id=? AND s.status='pending' AND s.id=(SELECT MAX(id) FROM essay_subs x WHERE x.user_id=s.user_id AND x.question_id=s.question_id)").get(cid).n;
      const quizLessons = out.lessons.filter(l => l.quiz_count).length;
      const quizIds = out.lessons.filter(l => l.quiz_count).map(l => l.id);
      (out.students || []).forEach(s => {
        s.quiz_total = quizLessons;
        s.quiz_passed = quizIds.filter(lid => lessonPassed(s.id, lid)).length;
        s.exam_best = db.prepare("SELECT MAX(pct) p FROM attempts WHERE user_id=? AND course_id=? AND scope='exam' AND status='done'").get(s.id, cid).p;
      });
    }
  }

  // ---------- Quiz ya somo ----------
  app.get('/api/lessons/:id/quiz', auth, route((req, res) => {
    const l = lessonOf(req.params.id);
    if (!l || !canAccessCourse(req.user, l.course_id)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    const qs = quizQs(l.id);
    if (req.user.role === 'student') {
      if (!isDone(req.user.id, l.id)) return res.status(403).json({ error: L(req, 'Maliza somo kwanza (bofya "Nimemaliza somo hili") ili kufungua quiz', 'Finish the lesson first (click "I\'ve finished this lesson") to unlock the quiz') });
      if (!qs.length) return res.status(404).json({ error: L(req, 'Somo hili halina quiz', 'This lesson has no quiz') });
      return res.json({ lesson: { id: l.id, title: l.title }, pass: PASS, questions: qs.map(q => sanitize(q, req.user.id)) });
    }
    res.json({ lesson: { id: l.id, title: l.title }, max: MAX_QUIZ, questions: qs.map(q => (isEssay(q) ? { ...q, files: filesOf(q.id) } : q)) });
  }));

  // Swali jipya la quiz. Swali la essay linaweza kuja kama multipart pamoja na viambatisho (field "files").
  app.post('/api/lessons/:id/questions', auth, maybeAttach, route((req, res) => {
    const l = lessonOf(req.params.id);
    if (!l) { dropUploaded(req); return res.status(404).json({ error: L(req, 'Somo halipo', 'Lesson not found') }); }
    if (!canManageCourse(req.user, l.course_id)) { dropUploaded(req); return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') }); }
    if (quizQs(l.id).length >= MAX_QUIZ) { dropUploaded(req); return res.status(400).json({ error: L(req, `Quiz haiwezi kuzidi maswali ${MAX_QUIZ}`, `A quiz cannot have more than ${MAX_QUIZ} questions`) }); }
    const q = clean(req.body, req.lang);
    if (q.type !== 'essay') dropUploaded(req);
    const pos = db.prepare("SELECT COALESCE(MAX(position),0)+1 p FROM questions WHERE scope='quiz' AND lesson_id=?").get(l.id).p;
    const r = db.prepare("INSERT INTO questions(course_id,lesson_id,scope,type,text,points,data,position) VALUES(?,?,'quiz',?,?,?,?,?)")
      .run(l.course_id, l.id, q.type, q.text, q.points, JSON.stringify(q.data), pos);
    if (q.type === 'essay') saveAttachments(req, r.lastInsertRowid);
    res.json({ id: r.lastInsertRowid });
  }));

  app.post('/api/lessons/:id/quiz/submit', auth, need('student'), route((req, res) => {
    const l = lessonOf(req.params.id);
    if (!l || !canAccessCourse(req.user, l.course_id)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    if (!isDone(req.user.id, l.id)) return res.status(403).json({ error: L(req, 'Maliza somo kwanza', 'Finish the lesson first') });
    const all = quizQs(l.id);
    if (!all.length) return res.status(404).json({ error: L(req, 'Somo hili halina quiz', 'This lesson has no quiz') });
    // Maswali ya essay yanawasilishwa moja moja na kusahihishwa na mwalimu; hapa yanasahihishwa yale ya kawaida tu
    const qs = all.filter(q => !isEssay(q));
    if (!qs.length) return res.status(400).json({ error: L(req, 'Quiz hii ina maswali ya essay tu: wasilisha kila jibu kwenye swali lake', 'This quiz only has essay questions: submit each answer on its own question') });
    const g = gradeSet(qs, (req.body || {}).answers, req.lang);
    db.prepare("INSERT INTO attempts(user_id,course_id,lesson_id,scope,status,question_ids,score,total,pct,submitted_at) VALUES(?,?,?,'quiz','done',?,?,?,?,CURRENT_TIMESTAMP)")
      .run(req.user.id, l.course_id, l.id, JSON.stringify(qs.map(q => q.id)), g.score, g.total, g.pct);
    const best = db.prepare("SELECT MAX(pct) p FROM attempts WHERE user_id=? AND lesson_id=? AND scope='quiz' AND status='done'").get(req.user.id, l.id).p;
    res.json({ ...g, pass: PASS, best, essays: essayStats(req.user.id, l.id) });
  }));

  // ---------- Maswali (hariri / futa) kwa quiz na mtihani ----------
  app.put('/api/questions/:id', auth, maybeAttach, route((req, res) => {
    const old = db.prepare('SELECT * FROM questions WHERE id=?').get(req.params.id);
    if (!old) { dropUploaded(req); return res.status(404).json({ error: L(req, 'Swali halipo', 'Question not found') }); }
    if (!canManageCourse(req.user, old.course_id)) { dropUploaded(req); return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') }); }
    const q = clean(req.body, req.lang);
    if (isEssay(old) !== isEssay(q)) throw bad(req.lang, 'Huwezi kubadilisha swali kuwa essay (au kutoka essay). Tengeneza swali jipya.', 'You cannot change a question to or from an essay. Create a new question instead.');
    if (isEssay(q)) {
      const err = saveAttachments(req, old.id);
      if (err) return res.status(400).json({ error: err });
    } else dropUploaded(req);
    db.prepare('UPDATE questions SET type=?,text=?,points=?,data=? WHERE id=?').run(q.type, q.text, q.points, JSON.stringify(q.data), old.id);
    res.json({ ok: true });
  }));

  app.delete('/api/questions/:id', auth, route((req, res) => {
    const old = db.prepare('SELECT * FROM questions WHERE id=?').get(req.params.id);
    if (!old) return res.status(404).json({ error: L(req, 'Swali halipo', 'Question not found') });
    if (!canManageCourse(req.user, old.course_id)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    purgeQuestion(old.id);
    db.prepare('DELETE FROM questions WHERE id=?').run(old.id);
    res.json({ ok: true });
  }));

  // ---------- Essay: viambatisho vya swali, majibu ya mwanafunzi, kusahihisha ----------
  const sendDownload = (res, stored, name) => {
    res.setHeader('Content-Disposition', "attachment; filename*=UTF-8''" + encodeURIComponent(name));
    res.type('application/octet-stream');
    res.sendFile(path.join(ESSAY_DIR, stored));
  };
  const essayQuestion = id => {
    const q = db.prepare("SELECT * FROM questions WHERE id=? AND scope='quiz' AND type='essay'").get(id);
    return q ? parseQ(q) : null;
  };

  // Faili alilopewa mwanafunzi na mwalimu (swali la essay)
  app.get('/api/questions/:id/files/:fid', auth, route((req, res) => {
    const q = essayQuestion(req.params.id);
    const f = q && db.prepare('SELECT * FROM question_files WHERE id=? AND question_id=?').get(req.params.fid, q.id);
    if (!f || !canAccessCourse(req.user, q.course_id)) return res.status(403).send(L(req, 'Huruhusiwi', 'Not allowed'));
    if (req.user.role === 'student' && !isDone(req.user.id, q.lesson_id)) return res.status(403).send(L(req, 'Huruhusiwi', 'Not allowed'));
    sendDownload(res, f.stored, f.name);
  }));

  // Mwanafunzi anawasilisha jibu la essay: maandishi na/au faili la aina yoyote
  app.post('/api/questions/:id/essay', auth, need('student'), answerUpload.single('file'), route((req, res) => {
    const q = essayQuestion(req.params.id);
    if (!q || !canAccessCourse(req.user, q.course_id)) { dropUploaded(req); return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') }); }
    if (!isDone(req.user.id, q.lesson_id)) { dropUploaded(req); return res.status(403).json({ error: L(req, 'Maliza somo kwanza', 'Finish the lesson first') }); }
    const text = String((req.body || {}).text || '').trim();
    if (text.length > MAX_ANSWER_TEXT) throw bad(req.lang, 'Jibu ni refu mno', 'The answer is too long');
    if (!text && !req.file) throw bad(req.lang, 'Andika jibu lako au pakia faili', 'Write your answer or upload a file');
    const last = latestSub(req.user.id, q.id);
    if (last && last.status === 'pending') throw bad(req.lang, 'Jibu lako bado halijasahihishwa. Subiri mwalimu.', 'Your answer has not been marked yet. Please wait for the teacher.');
    if (last && subPassed(last, q.points)) throw bad(req.lang, 'Tayari umefaulu swali hili', 'You have already passed this question');
    const f = req.file;
    const r = db.prepare('INSERT INTO essay_subs(question_id,course_id,lesson_id,user_id,text,file_name,stored,size) VALUES(?,?,?,?,?,?,?,?)')
      .run(q.id, q.course_id, q.lesson_id, req.user.id, text, f ? cleanFileName(f.originalname) : null, f ? f.filename : null, f ? f.size : 0);
    res.json({ sub: subOut(db.prepare('SELECT * FROM essay_subs WHERE id=?').get(r.lastInsertRowid), q.points) });
  }));

  // Faili la jibu: mwenyewe au mwalimu wa kozi
  const subFor = req => {
    const s = db.prepare('SELECT * FROM essay_subs WHERE id=?').get(req.params.id);
    return s && s.stored && (s.user_id === req.user.id || canManageCourse(req.user, s.course_id)) ? s : null;
  };
  const isPdfFile = stored => { try { const fd = fs.openSync(path.join(ESSAY_DIR, stored), 'r'); const b = Buffer.alloc(5); fs.readSync(fd, b, 0, 5, 0); fs.closeSync(fd); return b.toString() === '%PDF-'; } catch { return false; } };
  app.get('/api/essay-subs/:id/file', auth, route((req, res) => {
    const s = subFor(req);
    if (!s) return res.status(403).send(L(req, 'Huruhusiwi', 'Not allowed'));
    // "Open" on a PDF shows it inside the system (only when the content really is a PDF); everything else is a download
    if (req.query.inline === '1' && path.extname(s.file_name || '').toLowerCase() === '.pdf' && isPdfFile(s.stored)) {
      res.setHeader('Content-Disposition', 'inline');
      res.type('application/pdf');
      return res.sendFile(path.join(ESSAY_DIR, s.stored));
    }
    sendDownload(res, s.stored, s.file_name || 'answer');
  }));

  // Preview ya faili la jibu ndani ya system: maandishi wazi, Word/ODT/RTF (kwa kubadilishwa kuwa maandishi) na PDF.
  const PREVIEW_MAX = 300 * 1024;
  const TEXT_EXT = new Set(['.txt', '.md', '.csv', '.tsv', '.json', '.log', '.xml', '.html', '.htm', '.css', '.js', '.py', '.java', '.c', '.h', '.cpp', '.cs', '.php', '.sql', '.yml', '.yaml', '.ini', '.sh', '.bat', '.ps1']);
  const CONVERT_EXT = new Set(['.doc', '.docx', '.odt', '.rtf']);
  const converting = new Map();
  function toText(stored, ext) {
    const out = path.join(ESSAY_DIR, stored + '.txt');
    if (fs.existsSync(out)) return Promise.resolve(out);
    if (converting.has(stored)) return converting.get(stored);
    const so = getSoffice && getSoffice();
    if (!so) return Promise.resolve(null);
    const work = fs.mkdtempSync(path.join(os.tmpdir(), 'd4lt-ans-'));
    // soffice names its output after the input, so work on a copy with the right extension
    const src = path.join(work, 'answer' + ext);
    fs.copyFileSync(path.join(ESSAY_DIR, stored), src);
    const pr = new Promise(resolve => {
      execFile(so, ['--headless', '--norestore', '--nolockcheck', '--nodefault', '--nofirststartwizard',
        `-env:UserInstallation=${pathToFileURL(path.join(work, 'profile')).href}`,
        '--convert-to', 'txt:Text', '--outdir', work, src], { timeout: 120000, killSignal: 'SIGKILL', windowsHide: true }, () => {
        const made = path.join(work, 'answer.txt');
        try { if (fs.existsSync(made)) { fs.copyFileSync(made, out); resolve(out); } else resolve(null); } catch { resolve(null); }
        fs.rm(work, { recursive: true, force: true }, () => {});
      });
    }).finally(() => converting.delete(stored));
    converting.set(stored, pr);
    return pr;
  }
  const readText = file => {
    const fd = fs.openSync(file, 'r');
    try {
      const size = fs.fstatSync(fd).size;
      const buf = Buffer.alloc(Math.min(size, PREVIEW_MAX));
      fs.readSync(fd, buf, 0, buf.length, 0);
      if (buf.includes(0)) return null; // binary file
      return { text: buf.toString('utf8'), truncated: size > PREVIEW_MAX };
    } finally { fs.closeSync(fd); }
  };
  app.get('/api/essay-subs/:id/preview', auth, route(async (req, res) => {
    const s = subFor(req);
    if (!s) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    const ext = path.extname(s.file_name || '').toLowerCase();
    try {
      if (ext === '.pdf') return res.json({ kind: isPdfFile(s.stored) ? 'pdf' : 'none' });
      if (TEXT_EXT.has(ext)) { const r = readText(path.join(ESSAY_DIR, s.stored)); return res.json(r ? { kind: 'text', ...r } : { kind: 'none' }); }
      if (CONVERT_EXT.has(ext)) {
        const f = await toText(s.stored, ext);
        const r = f && readText(f);
        return res.json(r ? { kind: 'text', ...r } : { kind: 'none' });
      }
    } catch (e) { console.error('essay preview failed:', e.message); }
    res.json({ kind: 'none' });
  }));

  // Mwalimu: orodha ya majibu (ya hivi karibuni kwa kila mwanafunzi na swali), yasiyosahihishwa kwanza
  app.get('/api/courses/:id/essays', auth, route((req, res) => {
    const cid = +req.params.id;
    if (!canManageCourse(req.user, cid)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    const rows = db.prepare(`SELECT s.id,s.question_id,s.status,s.score,s.created_at,s.marked_at,s.file_name,s.size,(s.text<>'') AS has_text,
        u.id AS student_id,u.name AS student_name,u.email AS student_email,q.text AS question,q.points,l.title AS lesson_title
      FROM essay_subs s JOIN users u ON u.id=s.user_id JOIN questions q ON q.id=s.question_id LEFT JOIN lessons l ON l.id=s.lesson_id
      WHERE s.course_id=? AND s.id=(SELECT MAX(id) FROM essay_subs x WHERE x.user_id=s.user_id AND x.question_id=s.question_id)
      ORDER BY (s.status='pending') DESC, s.created_at DESC LIMIT 500`).all(cid);
    res.json(rows.map(r => ({ ...r, has_text: !!r.has_text, pass_mark: passMark(r.points), passed: r.status === 'marked' && r.score >= passMark(r.points) })));
  }));

  // Mwalimu: jibu kamili la mwanafunzi
  app.get('/api/essay-subs/:id', auth, route((req, res) => {
    const s = db.prepare('SELECT s.*,u.name AS student_name,q.text AS question,q.points FROM essay_subs s JOIN users u ON u.id=s.user_id JOIN questions q ON q.id=s.question_id WHERE s.id=?').get(req.params.id);
    if (!s || !canManageCourse(req.user, s.course_id)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    res.json({ ...subOut(s, s.points), student_name: s.student_name, question: s.question, points: s.points,
      files: filesOf(s.question_id), latest: s.id === db.prepare('SELECT MAX(id) m FROM essay_subs WHERE user_id=? AND question_id=?').get(s.user_id, s.question_id).m });
  }));

  // Mwalimu: kutoa alama (na maoni mafupi). Mwanafunzi akipata nusu au zaidi ya alama za swali amefaulu.
  app.post('/api/essay-subs/:id/mark', auth, route((req, res) => {
    const s = db.prepare('SELECT s.*,q.points FROM essay_subs s JOIN questions q ON q.id=s.question_id WHERE s.id=?').get(req.params.id);
    if (!s || !canManageCourse(req.user, s.course_id)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    const lastId = db.prepare('SELECT MAX(id) m FROM essay_subs WHERE user_id=? AND question_id=?').get(s.user_id, s.question_id).m;
    if (s.id !== lastId) throw bad(req.lang, 'Mwanafunzi ameshawasilisha jibu jipya; sahihisha la hivi karibuni', 'The student has submitted a newer answer; mark the latest one');
    const raw = (req.body || {}).score;
    const score = Number(raw);
    if (raw === '' || raw === null || raw === undefined || !Number.isFinite(score) || score < 0 || score > s.points)
      throw bad(req.lang, `Alama lazima ziwe kati ya 0 na ${s.points}`, `The score must be between 0 and ${s.points}`);
    const feedback = String((req.body || {}).feedback || '').trim().slice(0, 2000);
    db.prepare("UPDATE essay_subs SET status='marked',score=?,feedback=?,marked_at=CURRENT_TIMESTAMP WHERE id=?").run(r2(score), feedback, s.id);
    res.json({ ok: true, score: r2(score), passed: r2(score) >= passMark(s.points) });
  }));

  // ---------- Mtihani wa mwisho ----------
  app.get('/api/courses/:id/exam/questions', auth, route((req, res) => {
    const cid = +req.params.id;
    if (!canManageCourse(req.user, cid)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    const c = db.prepare('SELECT exam_count,exam_attempts FROM courses WHERE id=?').get(cid);
    res.json({ questions: examQs(cid), exam_count: c.exam_count, exam_attempts: c.exam_attempts });
  }));

  app.post('/api/courses/:id/exam/questions', auth, route((req, res) => {
    const cid = +req.params.id;
    if (!canManageCourse(req.user, cid)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    if (examQs(cid).length >= MAX_EXAM) return res.status(400).json({ error: L(req, `Bank ya mtihani imejaa (maswali ${MAX_EXAM})`, `The exam bank is full (${MAX_EXAM} questions)`) });
    const q = clean(req.body, req.lang);
    if (q.type === 'essay') throw bad(req.lang, 'Swali la essay linaruhusiwa kwenye quiz za masomo tu', 'Essay questions are only allowed in lesson quizzes');
    const pos = db.prepare("SELECT COALESCE(MAX(position),0)+1 p FROM questions WHERE scope='exam' AND course_id=?").get(cid).p;
    const r = db.prepare("INSERT INTO questions(course_id,lesson_id,scope,type,text,points,data,position) VALUES(?,NULL,'exam',?,?,?,?,?)")
      .run(cid, q.type, q.text, q.points, JSON.stringify(q.data), pos);
    res.json({ id: r.lastInsertRowid });
  }));

  app.put('/api/courses/:id/exam/settings', auth, route((req, res) => {
    const cid = +req.params.id;
    if (!canManageCourse(req.user, cid)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    const n = Math.floor(Number((req.body || {}).exam_count));
    const a = Math.floor(Number((req.body || {}).exam_attempts));
    if (!(n >= 0) || n > MAX_EXAM) return res.status(400).json({ error: L(req, 'Idadi ya maswali si sahihi', 'Invalid number of questions') });
    if (!(a >= 0) || a > 20) return res.status(400).json({ error: L(req, 'Idadi ya majaribio si sahihi (0 hadi 20)', 'Invalid number of attempts (0 to 20)') });
    db.prepare('UPDATE courses SET exam_count=?, exam_attempts=? WHERE id=?').run(n, a, cid);
    res.json({ ok: true });
  }));

  app.post('/api/courses/:id/exam/start', auth, need('student'), route((req, res) => {
    const cid = +req.params.id;
    if (!canAccessCourse(req.user, cid)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    const st = examStatus(req.user.id, cid, req.lang);
    if (!st.questions) return res.status(400).json({ error: L(req, 'Mwalimu bado hajaandaa mtihani', 'The teacher has not prepared the exam yet') });
    if (!st.unlocked) return res.status(403).json({ error: L(req, 'Mtihani bado umefungwa: ', 'The exam is still locked: ') + st.reasons.join('; ') });
    let at = db.prepare("SELECT * FROM attempts WHERE user_id=? AND course_id=? AND scope='exam' AND status='open'").get(req.user.id, cid);
    if (!at) {
      if (!st.can_start) return res.status(403).json({ error: L(req, 'Umemaliza majaribio yote ya mtihani huu', 'You have used all attempts for this exam') });
      const all = shuffle(examQs(cid));
      const c = db.prepare('SELECT exam_count FROM courses WHERE id=?').get(cid);
      const pick = c.exam_count > 0 ? all.slice(0, c.exam_count) : all;
      const r = db.prepare("INSERT INTO attempts(user_id,course_id,scope,status,question_ids) VALUES(?,?,'exam','open',?)")
        .run(req.user.id, cid, JSON.stringify(pick.map(q => q.id)));
      at = db.prepare('SELECT * FROM attempts WHERE id=?').get(r.lastInsertRowid);
    }
    const ids = JSON.parse(at.question_ids);
    const qs = ids.map(id => db.prepare("SELECT * FROM questions WHERE id=? AND scope='exam'").get(id)).filter(Boolean).map(parseQ);
    res.json({ attempt: at.id, pass: PASS, questions: qs.map(q => sanitize(q)) });
  }));

  app.post('/api/exam/:attempt/submit', auth, need('student'), route((req, res) => {
    const at = db.prepare("SELECT * FROM attempts WHERE id=? AND user_id=? AND scope='exam'").get(req.params.attempt, req.user.id);
    if (!at) return res.status(404).json({ error: L(req, 'Jaribio halipo', 'Attempt not found') });
    if (at.status !== 'open') return res.status(400).json({ error: L(req, 'Mtihani huu tayari umewasilishwa', 'This exam has already been submitted') });
    const ids = JSON.parse(at.question_ids);
    const qs = ids.map(id => db.prepare("SELECT * FROM questions WHERE id=? AND scope='exam'").get(id)).filter(Boolean).map(parseQ);
    const g = gradeSet(qs, (req.body || {}).answers, req.lang);
    db.prepare("UPDATE attempts SET status='done',score=?,total=?,pct=?,submitted_at=CURRENT_TIMESTAMP WHERE id=?").run(g.score, g.total, g.pct, at.id);
    const st = examStatus(req.user.id, at.course_id, req.lang);
    res.json({ ...g, pass: PASS, can_retry: st.can_start, best: st.best });
  }));

  return { decorate, PASS, purgeLesson };
};
