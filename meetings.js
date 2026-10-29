// Meetings za live (Zoom/Meet/Teams n.k.), arifa kwa wanafunzi na recording
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const sec = require('./security');

const TZ = process.env.TIMEZONE || 'Africa/Dar_es_Salaam';
const REMIND_MIN = 30;                 // kikumbusho dakika ngapi kabla ya kuanza
const CHECK_EVERY_MS = 30 * 1000;      // seva inakagua kila sekunde 30
const VIDEO_EXT = ['.mp4', '.webm', '.mov', '.m4v'];

module.exports = function init({ app, db, auth, canAccessCourse, canManageCourse, UPLOAD_DIR, L }) {
  db.exec(`
  CREATE TABLE IF NOT EXISTS meetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    link TEXT NOT NULL,
    passcode TEXT DEFAULT '',
    start_at TEXT NOT NULL,
    end_at TEXT NOT NULL,
    reminder_sent INTEGER NOT NULL DEFAULT 0,
    recording TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER,
    meeting_id INTEGER,
    kind TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    read_at TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id, id);
  CREATE INDEX IF NOT EXISTS idx_meet_course ON meetings(course_id, start_at);
  `);

  // Arifa zinahifadhiwa kwa lugha mbili: title/body = Kiswahili (safu za zamani), title_en/body_en = Kiingereza
  for (const col of ['title_en TEXT', 'body_en TEXT']) {
    try { db.exec('ALTER TABLE notifications ADD COLUMN ' + col); } catch { /* tayari ipo */ }
  }

  // ---------- Helpers ----------
  const nowIso = () => new Date().toISOString();
  const ms = iso => Date.parse(iso);

  function fmtTime(iso, lang = 'en') {
    const d = new Date(iso);
    try {
      return new Intl.DateTimeFormat(lang === 'sw' ? 'sw-TZ' : 'en-GB', {
        timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false
      }).format(d);
    } catch {
      return d.toLocaleString('en-GB', { timeZone: TZ });
    }
  }
  function fmtClock(iso) {
    try {
      return new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso));
    } catch { return iso; }
  }
  const range = (m, lang = 'en') => `${fmtTime(m.start_at, lang)} ${lang === 'sw' ? 'hadi' : 'to'} ${fmtClock(m.end_at)}`;

  function stateOf(m, now = Date.now()) {
    if (now < ms(m.start_at)) return 'upcoming';
    if (now < ms(m.end_at)) return 'live';
    return 'ended';
  }

  function courseStudents(courseId) {
    return db.prepare('SELECT user_id FROM enrollments WHERE course_id=?').all(courseId).map(r => r.user_id);
  }

  const insNotif = db.prepare(`INSERT INTO notifications(user_id,course_id,meeting_id,kind,title,body,created_at,title_en,body_en)
    VALUES(?,?,?,?,?,?,?,?,?)`);
  // build(lang) -> { title, body } kwa lugha hiyo; inahifadhiwa Kiswahili na Kiingereza pamoja
  function notifyStudents(courseId, meetingId, kind, build) {
    const t = nowIso();
    const sw = build('sw'), en = build('en');
    const tx = db.transaction(ids => ids.forEach(uid => insNotif.run(uid, courseId, meetingId, kind, sw.title, sw.body, t, en.title, en.body)));
    tx(courseStudents(courseId));
  }

  function courseTitle(id, lang = 'en') {
    const c = db.prepare('SELECT title FROM courses WHERE id=?').get(id);
    return c ? c.title : L(lang, 'Somo', 'Course');
  }

  function parseTimes(body, lang) {
    const s = new Date(body.start_at), e = new Date(body.end_at);
    if (isNaN(s) || isNaN(e)) return { error: L(lang, 'Weka tarehe na muda wa kuanza na kuisha', 'Enter the start and end date and time') };
    if (e <= s) return { error: L(lang, 'Muda wa kuisha lazima uwe baada ya muda wa kuanza', 'The end time must be after the start time') };
    return { start: s.toISOString(), end: e.toISOString() };
  }
  function parseLink(v, lang) {
    const link = sec.safeHttpUrl(v);
    if (!link) return { error: L(lang, 'Weka kiungo sahihi cha meeting kinachoanza na https://', 'Enter a valid meeting link starting with https://') };
    return { link };
  }

  function view(m, manage, now) {
    const o = {
      id: m.id, course_id: m.course_id, title: m.title, description: m.description,
      start_at: m.start_at, end_at: m.end_at, state: stateOf(m, now),
      has_recording: !!m.recording
    };
    if (manage) { o.link = m.link; o.passcode = m.passcode; }
    return o;
  }

  function getMeeting(req, res) {
    const m = db.prepare('SELECT * FROM meetings WHERE id=?').get(req.params.id);
    if (!m) { res.status(404).json({ error: L(req, 'Meeting haipo', 'Meeting not found') }); return null; }
    if (!canAccessCourse(req.user, m.course_id)) { res.status(403).json({ error: L(req, 'Huna ruhusa ya somo hili', 'You do not have access to this course') }); return null; }
    return m;
  }
  function getManaged(req, res) {
    const m = getMeeting(req, res);
    if (!m) return null;
    if (!canManageCourse(req.user, m.course_id)) { res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') }); return null; }
    return m;
  }

  // ---------- Meetings ----------
  app.get('/api/courses/:id/meetings', auth, (req, res) => {
    const cid = +req.params.id;
    if (!canAccessCourse(req.user, cid)) return res.status(403).json({ error: L(req, 'Huna ruhusa ya somo hili', 'You do not have access to this course') });
    const manage = canManageCourse(req.user, cid);
    const now = Date.now();
    const rows = db.prepare('SELECT * FROM meetings WHERE course_id=? ORDER BY start_at DESC').all(cid);
    res.json({ now, meetings: rows.map(m => view(m, manage, now)) });
  });

  app.post('/api/courses/:id/meetings', auth, (req, res) => {
    const cid = +req.params.id;
    if (!canManageCourse(req.user, cid)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    const b = req.body || {};
    if (!String(b.title || '').trim()) return res.status(400).json({ error: L(req, 'Weka kichwa cha meeting', 'Enter the meeting title') });
    b.title = String(b.title).trim().slice(0, 150); b.description = String(b.description || '').slice(0, 1000); b.passcode = String(b.passcode || '').slice(0, 100);
    const LK = parseLink(b.link, req.lang); if (LK.error) return res.status(400).json({ error: LK.error });
    const T = parseTimes(b, req.lang); if (T.error) return res.status(400).json({ error: T.error });
    if (ms(T.end) <= Date.now()) return res.status(400).json({ error: L(req, 'Muda wa meeting tayari umepita', 'The meeting time has already passed') });

    // Kama meeting inaanza ndani ya dakika 30, ujumbe wa kuundwa unatosha (hakuna kikumbusho cha pili)
    const soon = ms(T.start) - Date.now() <= REMIND_MIN * 60000 ? 1 : 0;
    const r = db.prepare(`INSERT INTO meetings(course_id,title,description,link,passcode,start_at,end_at,reminder_sent,created_by,created_at)
      VALUES(?,?,?,?,?,?,?,?,?,?)`)
      .run(cid, b.title.trim(), String(b.description || '').trim(), LK.link, String(b.passcode || '').trim(), T.start, T.end, soon, req.user.id, nowIso());
    const m = db.prepare('SELECT * FROM meetings WHERE id=?').get(r.lastInsertRowid);
    notifyStudents(cid, m.id, 'created', lg => ({
      title: L(lg, `Meeting mpya: ${m.title}`, `New meeting: ${m.title}`),
      body: L(lg, `${courseTitle(cid, lg)} — ${range(m, lg)}. Utapata kikumbusho dakika ${REMIND_MIN} kabla ya kuanza.`,
        `${courseTitle(cid, lg)} — ${range(m, lg)}. You will get a reminder ${REMIND_MIN} minutes before it starts.`)
    }));
    res.json({ id: m.id });
  });

  app.put('/api/meetings/:id', auth, (req, res) => {
    const m = getManaged(req, res); if (!m) return;
    const b = req.body || {};
    if (!String(b.title || '').trim()) return res.status(400).json({ error: L(req, 'Weka kichwa cha meeting', 'Enter the meeting title') });
    b.title = String(b.title).trim().slice(0, 150); b.description = String(b.description || '').slice(0, 1000); b.passcode = String(b.passcode || '').slice(0, 100);
    const LK = parseLink(b.link, req.lang); if (LK.error) return res.status(400).json({ error: LK.error });
    const T = parseTimes(b, req.lang); if (T.error) return res.status(400).json({ error: T.error });
    if (ms(T.end) <= Date.now()) return res.status(400).json({ error: L(req, 'Muda wa kuisha tayari umepita. Chagua muda ujao.', 'The end time has already passed. Choose a future time.') });

    const timeChanged = T.start !== m.start_at || T.end !== m.end_at;
    const soon = ms(T.start) - Date.now() <= REMIND_MIN * 60000 ? 1 : 0;
    db.prepare(`UPDATE meetings SET title=?,description=?,link=?,passcode=?,start_at=?,end_at=?,reminder_sent=? WHERE id=?`)
      .run(b.title.trim(), String(b.description || '').trim(), LK.link, String(b.passcode || '').trim(),
        T.start, T.end, timeChanged ? soon : m.reminder_sent, m.id);
    const nm = db.prepare('SELECT * FROM meetings WHERE id=?').get(m.id);

    if (timeChanged) {
      const dirKey = ms(T.start) > ms(m.start_at) ? 'later' : ms(T.start) < ms(m.start_at) ? 'earlier' : 'end';
      const DIR = {
        later: ['imesogezwa mbele (imeahirishwa)', 'moved later (postponed)'],
        earlier: ['imerudishwa nyuma (itaanza mapema zaidi)', 'moved earlier (it starts sooner)'],
        end: ['imebadilishwa muda wa kuisha', 'the end time was changed']
      }[dirKey];
      notifyStudents(m.course_id, m.id, 'rescheduled', lg => ({
        title: L(lg, `Muda wa meeting umebadilika: ${nm.title}`, `Meeting time changed: ${nm.title}`),
        body: L(lg, `${courseTitle(m.course_id, lg)} — ${DIR[0]}. Muda mpya: ${range(nm, lg)}.`,
          `${courseTitle(m.course_id, lg)} — ${DIR[1]}. New time: ${range(nm, lg)}.`)
      }));
    } else if (nm.link !== m.link || nm.passcode !== m.passcode || nm.title !== m.title) {
      notifyStudents(m.course_id, m.id, 'updated', lg => ({
        title: L(lg, `Meeting imesasishwa: ${nm.title}`, `Meeting updated: ${nm.title}`),
        body: L(lg, `${courseTitle(m.course_id, lg)} — mwalimu amebadilisha taarifa za meeting. ${range(nm, lg)}.`,
          `${courseTitle(m.course_id, lg)} — the teacher changed the meeting details. ${range(nm, lg)}.`)
      }));
    }
    res.json({ ok: true });
  });

  // Kufuta meeting: wanafunzi wanaarifiwa kama meeting haijaisha
  app.delete('/api/meetings/:id', auth, (req, res) => {
    const m = getManaged(req, res); if (!m) return;
    if (stateOf(m) !== 'ended') {
      notifyStudents(m.course_id, null, 'cancelled', lg => ({
        title: L(lg, `Meeting imefutwa: ${m.title}`, `Meeting cancelled: ${m.title}`),
        body: L(lg, `${courseTitle(m.course_id, lg)} — meeting ya ${range(m, lg)} imefutwa na mwalimu.`,
          `${courseTitle(m.course_id, lg)} — the meeting on ${range(m, lg)} was cancelled by the teacher.`)
      }));
    }
    if (m.recording) fs.unlink(path.join(UPLOAD_DIR, m.recording), () => {});
    db.prepare('DELETE FROM meetings WHERE id=?').run(m.id);
    res.json({ ok: true });
  });

  // Mwanafunzi anabofya "Jiunge": inafanya kazi tu ndani ya muda wa meeting (seva ndiyo inaamua)
  app.post('/api/meetings/:id/join', auth, (req, res) => {
    const m = getMeeting(req, res); if (!m) return;
    const manage = canManageCourse(req.user, m.course_id);
    if (!manage) {
      const st = stateOf(m);
      if (st === 'upcoming') return res.status(400).json({ error: L(req, `Meeting bado haijaanza. Itaanza ${fmtTime(m.start_at, 'sw')}.`, `The meeting has not started yet. It starts ${fmtTime(m.start_at, 'en')}.`) });
      if (st === 'ended') return res.status(400).json({ error: L(req, 'Meeting hii imeisha.', 'This meeting has ended.') });
    }
    res.json({ link: m.link, passcode: m.passcode });
  });

  // ---------- Recording ----------
  const uploadRec = multer({
    storage: multer.diskStorage({
      destination: UPLOAD_DIR,
      filename: (req, file, cb) => cb(null, 'rec-' + crypto.randomBytes(12).toString('hex') + path.extname(file.originalname).toLowerCase())
    }),
    limits: { fileSize: 4 * 1024 * 1024 * 1024 }, // 4GB (meeting ndefu)
    fileFilter: (req, file, cb) => cb(null, VIDEO_EXT.includes(path.extname(file.originalname).toLowerCase()))
  });

  app.post('/api/meetings/:id/recording', auth, (req, res, next) => {
    const m = getManaged(req, res); if (!m) return;
    if (stateOf(m) !== 'ended') return res.status(400).json({ error: L(req, 'Unaweza kupakia recording baada ya meeting kuisha.', 'You can upload a recording after the meeting has ended.') });
    req.meeting = m;
    next();
  }, uploadRec.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: L(req, 'Chagua video (MP4, WebM, MOV au M4V)', 'Choose a video (MP4, WebM, MOV or M4V)') });
    if (!sec.validUpload(path.join(UPLOAD_DIR, req.file.filename), 'video')) {
      fs.unlink(path.join(UPLOAD_DIR, req.file.filename), () => {});
      return res.status(400).json({ error: L(req, 'Faili si video halali', 'The file is not a valid video') });
    }
    const m = req.meeting;
    if (m.recording) fs.unlink(path.join(UPLOAD_DIR, m.recording), () => {});
    db.prepare('UPDATE meetings SET recording=? WHERE id=?').run(req.file.filename, m.id);
    if (!m.recording) {
      notifyStudents(m.course_id, m.id, 'recording', lg => ({
        title: L(lg, `Recording imepatikana: ${m.title}`, `Recording available: ${m.title}`),
        body: L(lg, `${courseTitle(m.course_id, lg)} — unaweza kuangalia recorded meeting sasa.`,
          `${courseTitle(m.course_id, lg)} — you can now watch the recorded meeting.`)
      }));
    }
    res.json({ ok: true });
  });

  app.get('/meeting-files/:id', auth, (req, res) => {
    const m = db.prepare('SELECT * FROM meetings WHERE id=?').get(req.params.id);
    if (!m || !m.recording || !canAccessCourse(req.user, m.course_id)) return res.status(403).send(L(req, 'Huruhusiwi', 'Not allowed'));
    if (!canManageCourse(req.user, m.course_id) && stateOf(m) !== 'ended') return res.status(403).send(L(req, 'Huruhusiwi', 'Not allowed'));
    res.type(path.extname(m.recording) === '.webm' ? 'video/webm' : 'video/mp4');
    res.sendFile(path.join(UPLOAD_DIR, m.recording));
  });

  // ---------- Arifa ----------
  app.get('/api/notifications', auth, (req, res) => {
    const items = db.prepare('SELECT * FROM notifications WHERE user_id=? ORDER BY id DESC LIMIT 60').all(req.user.id);
    const unread = db.prepare('SELECT COUNT(*) n FROM notifications WHERE user_id=? AND read_at IS NULL').get(req.user.id).n;
    // Kiingereza kikikosekana (arifa za zamani) tunarudisha Kiswahili kilichohifadhiwa
    const sw = req.lang === 'sw';
    res.json({ unread, items: items.map(({ title_en, body_en, ...n }) => (sw ? n : { ...n, title: title_en || n.title, body: body_en || n.body })) });
  });

  app.post('/api/notifications/read', auth, (req, res) => {
    const id = (req.body || {}).id;
    if (id) db.prepare('UPDATE notifications SET read_at=? WHERE id=? AND user_id=? AND read_at IS NULL').run(nowIso(), id, req.user.id);
    else db.prepare('UPDATE notifications SET read_at=? WHERE user_id=? AND read_at IS NULL').run(nowIso(), req.user.id);
    res.json({ ok: true });
  });

  // ---------- Kikumbusho cha dakika 30 kabla ----------
  function runReminders() {
    try {
      const now = Date.now();
      const rows = db.prepare('SELECT * FROM meetings WHERE reminder_sent=0').all();
      for (const m of rows) {
        if (now >= ms(m.end_at)) { db.prepare('UPDATE meetings SET reminder_sent=1 WHERE id=?').run(m.id); continue; }
        if (now >= ms(m.start_at) - REMIND_MIN * 60000) {
          const left = Math.ceil((ms(m.start_at) - now) / 60000);
          db.prepare('UPDATE meetings SET reminder_sent=1 WHERE id=?').run(m.id);
          notifyStudents(m.course_id, m.id, 'reminder', lg => {
            const when = left > 0 ? L(lg, `Itaanza baada ya dakika ${left}`, `Starts in ${left} ${left === 1 ? 'minute' : 'minutes'}`) : L(lg, 'Imeanza sasa', 'Started just now');
            return {
              title: L(lg, `Kikumbusho: ${m.title}`, `Reminder: ${m.title}`),
              body: L(lg, `${courseTitle(m.course_id, lg)} — ${when} (${fmtClock(m.start_at)}). Bofya "Jiunge" ndani ya somo muda ukifika.`,
                `${courseTitle(m.course_id, lg)} — ${when} (${fmtClock(m.start_at)}). Click "Join" inside the course when the time comes.`)
            };
          });
        }
      }
    } catch (e) { console.error('Reminder error:', e.message); }
  }
  runReminders();
  setInterval(runReminders, CHECK_EVERY_MS).unref();

  return {
    // Inaitwa kabla ya kufuta somo (course) ili faili za recording zifutwe
    removeCourseFiles(courseId) {
      db.prepare('SELECT recording FROM meetings WHERE course_id=? AND recording IS NOT NULL').all(courseId)
        .forEach(r => fs.unlink(path.join(UPLOAD_DIR, r.recording), () => {}));
    }
  };
};
