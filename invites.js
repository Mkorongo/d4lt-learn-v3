// Code za kujiunga na somo: kila mwanafunzi ana code yake, inatumika mara moja, inaisha muda.
// Mwalimu anahifadhi code ni ya nani, hivyo anaweza kumtoa mwanafunzi darasani na code yake kufa.
const crypto = require('crypto');
const { limiter, waitText } = require('./security');

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // bila 0/O/1/I
const MAX_BATCH = 100;

module.exports = function init({ app, db, auth, need, canManageCourse, audit, L }) {
  db.exec(`
  CREATE TABLE IF NOT EXISTS invites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    used_at TEXT,
    revoked_at TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_invites_course ON invites(course_id);`);
  try { db.exec('ALTER TABLE enrollments ADD COLUMN invite_id INTEGER'); } catch { /* tayari ipo */ }
  // Bulk tokens: one code shared by up to max_uses students; admin's message is shown when it is full.
  for (const col of ['max_uses INTEGER', 'used_count INTEGER NOT NULL DEFAULT 0', 'limit_message TEXT']) {
    try { db.exec('ALTER TABLE invites ADD COLUMN ' + col); } catch { /* tayari ipo */ }
  }
  db.exec(`CREATE TABLE IF NOT EXISTS invite_uses (
    invite_id INTEGER NOT NULL REFERENCES invites(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    used_at TEXT NOT NULL,
    PRIMARY KEY (invite_id, user_id)
  )`);

  // Shared by token / free / paid joins. Idempotent.
  function enroll(userId, courseId, inviteId = null) {
    db.prepare('INSERT OR IGNORE INTO enrollments(user_id,course_id,invite_id) VALUES(?,?,?)').run(userId, courseId, inviteId);
  }

  const joinFails = limiter({ windowMs: 15 * 60e3, max: 8, blockMs: 15 * 60e3 });

  const fmt = c => c.slice(0, 4) + '-' + c.slice(4);
  const norm = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  function genCode() {
    for (;;) {
      let c = '';
      for (let i = 0; i < 8; i++) c += ALPHABET[crypto.randomInt(ALPHABET.length)];
      if (!db.prepare('SELECT 1 FROM invites WHERE code=?').get(c)) return c;
    }
  }
  function statusOf(i, now = Date.now()) {
    if (i.revoked_at) return i.used_at ? 'removed' : 'revoked';
    if (i.max_uses) {
      if (Date.parse(i.expires_at) <= now) return 'expired';
      return i.used_count >= i.max_uses ? 'full' : 'active';
    }
    if (i.used_at) return 'used';
    if (Date.parse(i.expires_at) <= now) return 'expired';
    return 'active';
  }
  const row = i => ({
    id: i.id, label: i.label, code: fmt(i.code), status: statusOf(i), created_at: i.created_at, expires_at: i.expires_at,
    used_at: i.used_at, user_name: i.user_name || null, user_email: i.user_email || null,
    bulk: !!i.max_uses, max_uses: i.max_uses || null, used_count: i.used_count || 0, limit_message: i.limit_message || '',
    members: i.members || undefined
  });

  // Orodha ya code za somo
  app.get('/api/courses/:id/invites', auth, (req, res) => {
    const cid = +req.params.id;
    if (!canManageCourse(req.user, cid)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    const rows = db.prepare(`SELECT i.*, u.name AS user_name, u.email AS user_email
      FROM invites i LEFT JOIN users u ON u.id=i.used_by WHERE i.course_id=? ORDER BY i.id DESC`).all(cid);
    const mem = db.prepare(`SELECT u.name, u.email, x.used_at FROM invite_uses x JOIN users u ON u.id=x.user_id WHERE x.invite_id=? ORDER BY x.used_at`);
    res.json(rows.map(r => row(r.max_uses ? { ...r, members: mem.all(r.id) } : r)));
  });

  // Bulk token (admin): one code for up to `capacity` students, VIP courses only
  app.post('/api/courses/:id/tokens', auth, need('admin'), (req, res) => {
    const cid = +req.params.id;
    const c = db.prepare('SELECT id,access FROM courses WHERE id=?').get(cid);
    if (!c) return res.status(404).json({ error: L(req, 'Darasa halipo', 'Class not found') });
    if (c.access === 'free') return res.status(400).json({ error: L(req, 'Darasa la bure halihitaji token', 'A free class does not need a token') });
    const b = req.body || {};
    const capacity = Math.floor(Number(b.capacity));
    if (!(capacity >= 2 && capacity <= 10000)) return res.status(400).json({ error: L(req, 'Idadi ya watu iwe kati ya 2 na 10000', 'Capacity must be between 2 and 10000 people') });
    const label = String(b.label || '').trim().replace(/\s+/g, ' ').slice(0, 80) || L(req, 'Token ya kundi', 'Group token');
    const message = String(b.message || '').trim().slice(0, 300);
    const days = Math.min(365, Math.max(1, Math.floor(Number(b.days)) || 30));
    const now = new Date(), exp = new Date(now.getTime() + days * 864e5);
    const code = genCode();
    const r = db.prepare('INSERT INTO invites(course_id,code,label,created_by,created_at,expires_at,max_uses,limit_message) VALUES(?,?,?,?,?,?,?,?)')
      .run(cid, code, label, req.user.id, now.toISOString(), exp.toISOString(), capacity, message);
    audit(req, req.user.id, 'bulk_token_created', `course ${cid}: "${label}" for ${capacity} people`);
    res.json({ id: r.lastInsertRowid, code: fmt(code), capacity });
  });

  // Free class: one-click join
  app.post('/api/courses/:id/join-free', auth, need('student'), (req, res) => {
    const c = db.prepare('SELECT id,title,access FROM courses WHERE id=?').get(+req.params.id);
    if (!c) return res.status(404).json({ error: L(req, 'Darasa halipo', 'Class not found') });
    if (c.access !== 'free') return res.status(403).json({ error: L(req, 'Hili ni darasa la VIP. Lipia au tumia token.', 'This is a VIP class. Pay or use a token.') });
    enroll(req.user.id, c.id);
    audit(req, req.user.id, 'joined_free', `course ${c.id}`);
    res.json({ ok: true, course: { id: c.id, title: c.title } });
  });

  // Tengeneza code kwa majina mengi (jina moja = code moja)
  app.post('/api/courses/:id/invites', auth, (req, res) => {
    const cid = +req.params.id;
    if (!canManageCourse(req.user, cid)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    const b = req.body || {};
    const names = [...new Set((Array.isArray(b.names) ? b.names : [])
      .map(n => String(n || '').trim().replace(/\s+/g, ' ').slice(0, 80)).filter(Boolean))];
    if (!names.length) return res.status(400).json({ error: L(req, 'Weka angalau jina moja la mwanafunzi', 'Enter at least one student name') });
    if (names.length > MAX_BATCH) return res.status(400).json({ error: L(req, `Tengeneza code zisizozidi ${MAX_BATCH} kwa mara moja`, `Create no more than ${MAX_BATCH} codes at a time`) });
    const days = Math.min(60, Math.max(1, Math.floor(Number(b.days)) || 14));
    const now = new Date(), exp = new Date(now.getTime() + days * 864e5);
    const ins = db.prepare('INSERT INTO invites(course_id,code,label,created_by,created_at,expires_at) VALUES(?,?,?,?,?,?)');
    const out = db.transaction(() => names.map(n => {
      const code = genCode();
      const r = ins.run(cid, code, n, req.user.id, now.toISOString(), exp.toISOString());
      return { id: r.lastInsertRowid, label: n, code: fmt(code), expires_at: exp.toISOString() };
    }))();
    audit(req, req.user.id, 'invites_created', `course ${cid}: ${out.length} codes`);
    res.json({ created: out });
  });

  // Futa code ambayo haijatumika, AU mtoe mwanafunzi aliyetumia code hii darasani (code inakufa)
  app.post('/api/invites/:id/revoke', auth, (req, res) => {
    const i = db.prepare('SELECT * FROM invites WHERE id=?').get(req.params.id);
    if (!i) return res.status(404).json({ error: L(req, 'Code haipo', 'Code not found') });
    if (!canManageCourse(req.user, i.course_id)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    if (i.revoked_at) return res.json({ ok: true });
    if (i.max_uses) { // bulk: stop new joins; optionally remove those who joined with it
      const remove = !!(req.body || {}).remove;
      db.transaction(() => {
        db.prepare('UPDATE invites SET revoked_at=? WHERE id=?').run(new Date().toISOString(), i.id);
        if (remove) db.prepare('DELETE FROM enrollments WHERE invite_id=?').run(i.id);
      })();
      audit(req, req.user.id, 'invite_revoked', `course ${i.course_id}, bulk token "${i.label}"${remove ? ' + members removed' : ''}`);
      return res.json({ ok: true, removed: remove });
    }
    db.transaction(() => {
      db.prepare('UPDATE invites SET revoked_at=? WHERE id=?').run(new Date().toISOString(), i.id);
      if (i.used_by) db.prepare('DELETE FROM enrollments WHERE course_id=? AND user_id=?').run(i.course_id, i.used_by);
    })();
    audit(req, req.user.id, i.used_by ? 'student_removed' : 'invite_revoked', `course ${i.course_id}, code for "${i.label}"` + (i.used_by ? `, user ${i.used_by}` : ''));
    res.json({ ok: true, removed: !!i.used_by });
  });

  // Mwanafunzi anajiunga kwa code yake
  app.post('/api/join', auth, need('student'), (req, res) => {
    const key = 'u' + req.user.id + '|' + req.ip;
    const w = joinFails.wait(key);
    if (w) return res.status(429).json({ error: waitText(w, req.lang) });
    const code = norm((req.body || {}).code);
    const i = code.length === 8 ? db.prepare('SELECT * FROM invites WHERE code=?').get(code) : null;
    const want = (req.body || {}).course_id; // ikitumwa kutoka ukurasa wa darasa, code lazima iwe ya darasa hilo
    const nowIso = new Date().toISOString();
    if (i && i.max_uses && statusOf(i) === 'full' && (!want || i.course_id === +want)) {
      const already = db.prepare('SELECT 1 FROM enrollments WHERE user_id=? AND course_id=?').get(req.user.id, i.course_id);
      if (already) return res.json({ ok: true, course: db.prepare('SELECT id,title FROM courses WHERE id=?').get(i.course_id) });
      return res.status(409).json({ full: true, error: i.limit_message || L(req, 'Token hii imejaa — idadi ya watu imefikiwa. Wasiliana na admin.', 'This token is full — its capacity has been reached. Contact the admin.') });
    }
    if (!i || statusOf(i) !== 'active' || (want && i.course_id !== +want)) {
      const wait = joinFails.fail(key);
      audit(req, req.user.id, 'join_failed', '');
      return res.status(wait ? 429 : 404).json({ error: wait ? waitText(wait, req.lang) : L(req, 'Code si sahihi, imeisha muda, imefutwa, tayari imetumika, au si ya darasa hili. Wasiliana na admin kupata code sahihi.', 'The code is invalid, expired, revoked, already used, or not for this class. Contact the admin to get a valid code.') });
    }
    const course = db.prepare('SELECT id,title FROM courses WHERE id=?').get(i.course_id);
    if (db.prepare('SELECT 1 FROM enrollments WHERE user_id=? AND course_id=?').get(req.user.id, i.course_id))
      return res.json({ ok: true, course }); // tayari yupo; code haitumiki
    const ok = db.transaction(() => {
      if (i.max_uses) {
        const r = db.prepare('UPDATE invites SET used_count=used_count+1 WHERE id=? AND revoked_at IS NULL AND used_count<max_uses').run(i.id);
        if (r.changes !== 1) return false;
        db.prepare('INSERT INTO invite_uses(invite_id,user_id,used_at) VALUES(?,?,?)').run(i.id, req.user.id, nowIso);
      } else {
        const r = db.prepare('UPDATE invites SET used_by=?, used_at=? WHERE id=? AND used_at IS NULL AND revoked_at IS NULL')
          .run(req.user.id, nowIso, i.id);
        if (r.changes !== 1) return false;
      }
      enroll(req.user.id, i.course_id, i.id);
      return true;
    })();
    if (!ok) return res.status(i.max_uses ? 409 : 404).json({ full: !!i.max_uses, error: i.max_uses && i.limit_message ? i.limit_message : L(req, 'Code hii tayari imetumika.', 'This code has already been used.') });
    joinFails.reset(key);
    audit(req, req.user.id, 'joined', `course ${i.course_id}, code for "${i.label}"`);
    res.json({ ok: true, course });
  });
  return enroll;
};
