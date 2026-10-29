const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const sec = require('./security');
const { L } = sec;

const PORT = process.env.PORT || 3000;
const SECRET = sec.loadSecret(__dirname);
const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const db = new Database(path.join(__dirname, 'lms.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin','teacher','student')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  class_name TEXT DEFAULT '',
  code TEXT NOT NULL UNIQUE,
  teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  color TEXT DEFAULT '#4f46e5',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS enrollments (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, course_id)
);
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  kind TEXT NOT NULL CHECK(kind IN ('video','pdf','link')),
  file TEXT,
  url TEXT,
  position INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS progress (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  done_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, lesson_id)
);
`);

// ---------- Teacher profile: username, phone, bio, social links ----------
for (const col of ['username TEXT', 'phone TEXT', 'bio TEXT', 'links TEXT']) {
  try { db.exec('ALTER TABLE users ADD COLUMN ' + col); } catch { /* already exists */ }
}
db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username) WHERE username IS NOT NULL');

// ---------- Free / VIP courses ----------
// access: 'free' (anyone joins in one click) or 'vip' (paid online or token). price is whole TZS.
// Courses that existed before this feature become VIP (token-only until the admin sets a price).
for (const col of ["access TEXT NOT NULL DEFAULT 'vip'", 'price INTEGER NOT NULL DEFAULT 0']) {
  try { db.exec('ALTER TABLE courses ADD COLUMN ' + col); } catch { /* already exists */ }
}

// ---------- Several materials per topic ----------
// A topic is a top-level row in `lessons` (parent_id IS NULL). Extra materials of the same topic are
// rows with parent_id = topic id, so file serving, document conversion and access checks work unchanged.
for (const col of ['parent_id INTEGER', 'name TEXT', 'downloadable INTEGER NOT NULL DEFAULT 0']) {
  try { db.exec('ALTER TABLE lessons ADD COLUMN ' + col); } catch { /* already exists */ }
}
db.exec('CREATE INDEX IF NOT EXISTS idx_lessons_parent ON lessons(parent_id)');

// ---------- Usalama: safu mpya, kumbukumbu ----------
for (const col of ['must_change INTEGER NOT NULL DEFAULT 0', 'token_version INTEGER NOT NULL DEFAULT 0', 'terms_version TEXT', 'terms_at TEXT']) {
  try { db.exec('ALTER TABLE users ADD COLUMN ' + col); } catch { /* tayari ipo */ }
}
db.exec(`CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL,
  user_id INTEGER,
  action TEXT NOT NULL,
  detail TEXT DEFAULT '',
  ip TEXT
);`);
db.prepare('DELETE FROM audit_log WHERE at < ?').run(new Date(Date.now() - 180 * 864e5).toISOString());
function audit(req, userId, action, detail = '') {
  try {
    db.prepare('INSERT INTO audit_log(at,user_id,action,detail,ip) VALUES(?,?,?,?,?)')
      .run(new Date().toISOString(), userId || null, action, String(detail).slice(0, 300), req && req.ip ? req.ip : null);
  } catch { /* kumbukumbu zisivunje ombi */ }
}

// Admin wa kwanza: nenosiri la nasibu (au ADMIN_PASSWORD), na lazima abadilishe kwa kuingia kwanza
if (!db.prepare("SELECT 1 FROM users WHERE role='admin'").get()) {
  const email = (process.env.ADMIN_EMAIL || 'admin@d4lt.local').trim().toLowerCase();
  let pass = process.env.ADMIN_PASSWORD, generated = false;
  if (!pass) { pass = sec.randomPassword(); generated = true; }
  const weak = sec.passwordProblem(pass, { email, name: 'D4LT Admin' });
  db.prepare('INSERT INTO users(name,email,password,role,must_change) VALUES(?,?,?,?,?)')
    .run('D4LT Admin', email, bcrypt.hashSync(pass, 12), 'admin', generated || weak ? 1 : 0);
  if (generated) console.log(`\nAdmin account created.\n  Email: ${email}\n  First password: ${pass}\n(Shown only once. You will be asked to change it after logging in.)\n`);
  else if (weak) console.warn('WARNING: ADMIN_PASSWORD is weak. You will be asked to change it after logging in.');
}

const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (;;) {
    let c = '';
    for (let i = 0; i < 6; i++) c += chars[crypto.randomInt(chars.length)];
    if (!db.prepare('SELECT 1 FROM courses WHERE code=?').get(c)) return c;
  }
}

const app = express();
app.disable('x-powered-by');
if (process.env.TRUST_PROXY) app.set('trust proxy', /^\d+$/.test(process.env.TRUST_PROXY) ? +process.env.TRUST_PROXY : process.env.TRUST_PROXY === 'true' ? true : process.env.TRUST_PROXY);
app.use(sec.headers);
app.use((req, res, next) => { req.lang = req.get('X-Lang') === 'sw' ? 'sw' : 'en'; next(); });
app.use(express.json({ limit: '200kb', verify: (req, res, buf) => { if (req.url.startsWith('/api/payments/webhook')) req.rawBody = buf; } }));
app.use(cookieParser());
app.use(sec.sameOrigin);

// ---------- Auth ----------
const SESSION_HOURS = Math.max(1, Number(process.env.SESSION_HOURS) || 24);
const BCRYPT_COST = 12;
const DUMMY_HASH = bcrypt.hashSync('nenosiri-bandia-kwa-muda', BCRYPT_COST); // kuzuia kupima muda wa majibu
const loginByEmail = sec.limiter({ windowMs: 15 * 60e3, max: 5, blockMs: 15 * 60e3 });
const loginByIp = sec.limiter({ windowMs: 15 * 60e3, max: 100, blockMs: 15 * 60e3 });
const registerByIp = sec.limiter({ windowMs: 60 * 60e3, max: 60, blockMs: 60 * 60e3 });
const pwGuess = sec.limiter({ windowMs: 15 * 60e3, max: 5, blockMs: 15 * 60e3 });
const GATE_OK = new Set(['/api/me', '/api/me/password', '/api/me/accept-terms']);

const clip = (s, n) => String(s ?? '').trim().slice(0, n);
const cleanName = s => clip(s, 80).replace(/\s+/g, ' ');
const goodEmail = e => e.length <= 254 && /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/.test(e);
const goodColor = c => (/^#[0-9a-fA-F]{6}$/.test(c || '') ? c : null);

function sign(u) {
  return jwt.sign({ id: u.id, tv: u.token_version || 0 }, SECRET, { expiresIn: SESSION_HOURS + 'h', algorithm: 'HS256' });
}
const needsOf = u => [
  ...(u.terms_version !== sec.TERMS_VERSION ? ['terms'] : []),
  ...(u.must_change ? ['password'] : [])
];
function auth(req, res, next) {
  let u;
  try {
    const t = req.cookies.token;
    if (!t) throw new Error('no token');
    const p = jwt.verify(t, SECRET, { algorithms: ['HS256'] });
    u = db.prepare('SELECT id,name,email,role,username,must_change,token_version,terms_version FROM users WHERE id=?').get(p.id);
    if (!u || (u.token_version || 0) !== (p.tv || 0)) throw new Error('bad session');
  } catch {
    return res.status(401).json({ error: L(req, 'Tafadhali ingia kwanza', 'Please log in first') });
  }
  req.user = { id: u.id, name: u.name, email: u.email, role: u.role, username: u.username || null, needs: needsOf(u) };
  // Mpaka akubali masharti / abadilishe nenosiri dhaifu, hawezi kutumia sehemu nyingine za mfumo
  if (req.user.needs.length && !GATE_OK.has(req.path))
    return res.status(403).json({ error: L(req, 'Kamilisha hatua za usalama kwanza', 'Complete the security steps first'), code: 'gate', needs: req.user.needs });
  next();
}
const need = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ error: L(req, 'Huruhusiwi kufanya hili', 'You are not allowed to do this') });

function setCookie(req, res, u) {
  res.cookie('token', sign(u), {
    httpOnly: true, sameSite: 'lax', secure: req.secure || process.env.COOKIE_SECURE === '1', maxAge: SESSION_HOURS * 3600e3
  });
}

app.post('/api/register', (req, res) => {
  const w = registerByIp.wait(req.ip);
  if (w) return res.status(429).json({ error: sec.waitText(w, req.lang) });
  const { name, email, password, accept_terms } = req.body || {};
  const nm = cleanName(name), em = String(email || '').trim().toLowerCase();
  if (nm.length < 2) return res.status(400).json({ error: L(req, 'Weka jina lako kamili', 'Enter your full name') });
  if (!goodEmail(em)) return res.status(400).json({ error: L(req, 'Weka barua pepe sahihi', 'Enter a valid email address') });
  if (accept_terms !== true) return res.status(400).json({ error: L(req, 'Lazima ukubali Masharti na Sera ya Faragha ili kujisajili', 'You must accept the Terms and Privacy Policy to register') });
  const weak = sec.passwordProblem(password, { email: em, name: nm }, req.lang);
  if (weak) return res.status(400).json({ error: weak });
  registerByIp.fail(req.ip);
  try {
    const now = new Date().toISOString();
    const r = db.prepare('INSERT INTO users(name,email,password,role,terms_version,terms_at) VALUES(?,?,?,?,?,?)')
      .run(nm, em, bcrypt.hashSync(password, BCRYPT_COST), 'student', sec.TERMS_VERSION, now);
    audit(req, r.lastInsertRowid, 'register', em);
    setCookie(req, res, { id: r.lastInsertRowid, token_version: 0 });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: L(req, 'Barua pepe hii tayari imesajiliwa', 'This email is already registered') });
  }
});

app.post('/api/login', (req, res) => {
  const email = clip((req.body || {}).email, 254).toLowerCase();
  const password = String((req.body || {}).password || '').slice(0, 200);
  const wait = Math.max(loginByIp.wait(req.ip), loginByEmail.wait(email));
  if (wait) return res.status(429).json({ error: sec.waitText(wait, req.lang) });
  const u = db.prepare('SELECT * FROM users WHERE email=?').get(email);
  const ok = bcrypt.compareSync(password, u ? u.password : DUMMY_HASH) && !!u;
  if (!ok) {
    loginByIp.fail(req.ip);
    const w = loginByEmail.fail(email);
    audit(req, u && u.id, 'login_failed', email);
    return res.status(w ? 429 : 400).json({ error: w ? sec.waitText(w, req.lang) : L(req, 'Barua pepe au nenosiri si sahihi', 'Incorrect email or password') });
  }
  loginByEmail.reset(email);
  // Nenosiri la zamani lisilofikia viwango vipya: lazima libadilishwe baada ya kuingia
  if (sec.passwordProblem(password, { email: u.email, name: u.name })) {
    db.prepare('UPDATE users SET must_change=1 WHERE id=?').run(u.id, req.lang);
  }
  audit(req, u.id, 'login_ok', '');
  setCookie(req, res, u);
  res.json({ ok: true });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

app.get('/api/me', auth, (req, res) => {
  const { id, name, email, role, username, needs } = req.user;
  res.json({ id, name, email, role, username, needs });
});

// ---------- Teacher profile ----------
const parseLinks = v => { try { const a = JSON.parse(v || '[]'); return Array.isArray(a) ? a : []; } catch { return []; } };
const profileOf = id => {
  const u = db.prepare('SELECT username,phone,bio,links FROM users WHERE id=?').get(id) || {};
  return { username: u.username || '', phone: u.phone || '', bio: u.bio || '', links: parseLinks(u.links) };
};
app.get('/api/me/profile', auth, need('teacher', 'admin'), (req, res) => res.json(profileOf(req.user.id)));
app.put('/api/me/profile', auth, need('teacher', 'admin'), (req, res) => {
  const b = req.body || {};
  const username = String(b.username || '').trim().toLowerCase().replace(/^@/, '');
  if (!/^[a-z0-9._]{3,30}$/.test(username))
    return res.status(400).json({ error: L(req, 'Username iwe herufi 3-30: a-z, namba 0-9, nukta (.) au mstari chini (_)', 'Username must be 3-30 characters: a-z, 0-9, dot (.) or underscore (_)') });
  const phone = clip(b.phone, 20);
  if (phone && !/^[+0-9 ()-]{6,20}$/.test(phone))
    return res.status(400).json({ error: L(req, 'Namba ya simu si sahihi (mf. +255 7XX XXX XXX)', 'The phone number is not valid (e.g. +255 7XX XXX XXX)') });
  const bio = clip(b.bio, 600);
  const links = [];
  for (const x of Array.isArray(b.links) ? b.links.slice(0, 8) : []) {
    const label = clip(x && x.label, 30), raw = clip(x && x.url, 300);
    if (!label && !raw) continue;
    const url = sec.safeHttpUrl(raw);
    if (!label || !url) return res.status(400).json({ error: L(req, 'Kila kiungo kinahitaji jina na anwani inayoanza na http:// au https://', 'Each link needs a name and an address starting with http:// or https://') });
    links.push({ label, url });
  }
  try {
    db.prepare('UPDATE users SET username=?, phone=?, bio=?, links=? WHERE id=?').run(username, phone || null, bio || null, JSON.stringify(links), req.user.id);
  } catch {
    return res.status(400).json({ error: L(req, 'Username hii tayari imechukuliwa', 'That username is already taken') });
  }
  res.json({ ok: true });
});
// What students may see about the teacher of a course
const teacherCard = id => {
  if (!id) return null;
  const u = db.prepare("SELECT id,name,username,phone,bio,links FROM users WHERE id=? AND role='teacher'").get(id);
  return u ? { id: u.id, name: u.name, username: u.username || '', phone: u.phone || '', bio: u.bio || '', links: parseLinks(u.links) } : null;
};

app.post('/api/me/accept-terms', auth, (req, res) => {
  if ((req.body || {}).accept !== true) return res.status(400).json({ error: L(req, 'Lazima ukubali masharti ili kuendelea', 'You must accept the terms to continue') });
  db.prepare('UPDATE users SET terms_version=?, terms_at=? WHERE id=?').run(sec.TERMS_VERSION, new Date().toISOString(), req.user.id);
  audit(req, req.user.id, 'terms_accepted', sec.TERMS_VERSION);
  res.json({ ok: true });
});

app.post('/api/me/password', auth, (req, res) => {
  const { current, next: nw } = req.body || {};
  const key = 'pw' + req.user.id;
  const w = pwGuess.wait(key);
  if (w) return res.status(429).json({ error: sec.waitText(w, req.lang) });
  const u = db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id);
  if (!bcrypt.compareSync(String(current || '').slice(0, 200), u.password)) {
    const x = pwGuess.fail(key);
    return res.status(400).json({ error: x ? sec.waitText(x, req.lang) : L(req, 'Nenosiri la sasa si sahihi', 'The current password is incorrect') });
  }
  pwGuess.reset(key);
  if (nw === current) return res.status(400).json({ error: L(req, 'Nenosiri jipya lazima liwe tofauti na la sasa', 'The new password must be different from the current one') });
  const weak = sec.passwordProblem(nw, u, req.lang);
  if (weak) return res.status(400).json({ error: weak });
  // token_version inaongezeka: vifaa vingine vilivyoingia vinatolewa, kifaa hiki kinabaki
  db.prepare('UPDATE users SET password=?, must_change=0, token_version=token_version+1 WHERE id=?')
    .run(bcrypt.hashSync(nw, BCRYPT_COST), u.id);
  setCookie(req, res, { id: u.id, token_version: (u.token_version || 0) + 1 });
  audit(req, u.id, 'password_changed', '');
  res.json({ ok: true });
});

app.get('/api/audit', auth, need('admin'), (req, res) => {
  res.json(db.prepare(`SELECT a.id,a.at,a.action,a.detail,a.ip,u.name AS user_name,u.email AS user_email
    FROM audit_log a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.id DESC LIMIT 300`).all());
});

// ---------- Helpers ----------
function canAccessCourse(user, courseId) {
  if (user.role === 'admin') return true;
  if (user.role === 'teacher')
    return !!db.prepare('SELECT 1 FROM courses WHERE id=? AND teacher_id=?').get(courseId, user.id);
  return !!db.prepare('SELECT 1 FROM enrollments WHERE user_id=? AND course_id=?').get(user.id, courseId);
}
function canManageCourse(user, courseId) {
  if (user.role === 'admin') return true;
  if (user.role === 'teacher')
    return !!db.prepare('SELECT 1 FROM courses WHERE id=? AND teacher_id=?').get(courseId, user.id);
  return false;
}

const quiz = require('./quiz')({ app, db, auth, need, canAccessCourse, canManageCourse, UPLOAD_DIR, getSoffice: () => docs.caps.soffice, L });
const meetings = require('./meetings')({ app, db, auth, canAccessCourse, canManageCourse, UPLOAD_DIR, L });
const enroll = require('./invites')({ app, db, auth, need, canManageCourse, audit, L });
const pay = require('./payments')({ app, db, auth, need, audit, L, enroll });
const docs = require('./docs')({ app, db, auth, canAccessCourse, canManageCourse, UPLOAD_DIR, L });

// ---------- Courses ----------
const courseSelect = `
SELECT c.*, u.name AS teacher_name, u.username AS teacher_username,
 (SELECT COUNT(*) FROM lessons l WHERE l.course_id=c.id AND l.parent_id IS NULL) AS lesson_count,
 (SELECT COUNT(*) FROM enrollments e WHERE e.course_id=c.id) AS student_count
FROM courses c LEFT JOIN users u ON u.id=c.teacher_id`;

app.get('/api/courses', auth, (req, res) => {
  let rows;
  if (req.user.role === 'admin') rows = db.prepare(courseSelect + ' ORDER BY c.id DESC').all();
  else if (req.user.role === 'teacher')
    rows = db.prepare(courseSelect + ' WHERE c.teacher_id=? ORDER BY c.id DESC').all(req.user.id);
  else
    rows = db.prepare(courseSelect + ' WHERE c.id IN (SELECT course_id FROM enrollments WHERE user_id=?) ORDER BY c.id DESC')
      .all(req.user.id);
  if (req.user.role === 'student') {
    const done = db.prepare(`SELECT l.course_id, COUNT(*) n FROM progress p JOIN lessons l ON l.id=p.lesson_id
      WHERE p.user_id=? AND l.parent_id IS NULL GROUP BY l.course_id`).all(req.user.id);
    const m = Object.fromEntries(done.map(d => [d.course_id, d.n]));
    rows.forEach(r => (r.done_count = m[r.id] || 0));
  }
  rows.forEach(r => delete r.code); // code ya zamani ya pamoja haitumiki tena
  res.json(rows);
});

const teacherIdOf = v => {
  const t = v ? db.prepare("SELECT id FROM users WHERE id=? AND role='teacher'").get(+v) : null;
  return t ? t.id : null;
};

const MIN_PRICE = 500; // Snippe minimum (TZS)
function accessPrice(req) {
  const b = req.body || {};
  const access = b.access === 'free' ? 'free' : 'vip';
  if (access === 'free') return { access, price: 0 };
  const price = Math.floor(Number(b.price) || 0);
  if (price !== 0 && (price < MIN_PRICE || price > 100000000))
    return { error: L(req, `Bei lazima iwe kuanzia TZS ${MIN_PRICE} (au 0 kwa token tu)`, `Price must be at least TZS ${MIN_PRICE} (or 0 for token-only access)`) };
  return { access, price };
}
app.post('/api/courses', auth, need('admin'), (req, res) => {
  const { title, description, class_name, teacher_id, color } = req.body || {};
  if (!clip(title, 120)) return res.status(400).json({ error: L(req, 'Weka jina la somo', 'Enter the course name') });
  const ap = accessPrice(req); if (ap.error) return res.status(400).json({ error: ap.error });
  const r = db.prepare('INSERT INTO courses(title,description,class_name,code,teacher_id,color,access,price) VALUES(?,?,?,?,?,?,?,?)')
    .run(clip(title, 120), clip(description, 1000), clip(class_name, 60), genCode(), teacherIdOf(teacher_id),
      goodColor(color) || COLORS[Math.floor(Math.random() * COLORS.length)], ap.access, ap.price);
  res.json({ id: r.lastInsertRowid });
});

app.put('/api/courses/:id', auth, need('admin'), (req, res) => {
  const { title, description, class_name, teacher_id, color } = req.body || {};
  if (!clip(title, 120)) return res.status(400).json({ error: L(req, 'Weka jina la somo', 'Enter the course name') });
  const ap = accessPrice(req); if (ap.error) return res.status(400).json({ error: ap.error });
  db.prepare('UPDATE courses SET title=?,description=?,class_name=?,teacher_id=?,color=?,access=?,price=? WHERE id=?')
    .run(clip(title, 120), clip(description, 1000), clip(class_name, 60), teacherIdOf(teacher_id), goodColor(color) || '#4f46e5', ap.access, ap.price, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/courses/:id', auth, need('admin'), (req, res) => {
  const files = db.prepare('SELECT file FROM lessons WHERE course_id=? AND file IS NOT NULL').all(req.params.id);
  files.forEach(f => fs.unlink(path.join(UPLOAD_DIR, f.file), () => {}));
  meetings.removeCourseFiles(+req.params.id);
  db.prepare('SELECT id FROM lessons WHERE course_id=?').all(+req.params.id).forEach(x => docs.removeFiles(x.id));
  db.prepare('DELETE FROM courses WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// Kujiunga na somo kunafanyika kwenye invites.js (code ya kila mwanafunzi)

app.get('/api/courses/:id', auth, (req, res) => {
  const id = +req.params.id;
  if (!canAccessCourse(req.user, id)) return res.status(403).json({ error: L(req, 'Huna ruhusa ya somo hili', 'You do not have access to this course') });
  const course = db.prepare(courseSelect + ' WHERE c.id=?').get(id);
  if (!course) return res.status(404).json({ error: L(req, 'Somo halipo', 'Course not found') });
  delete course.code;
  const lessons = db.prepare('SELECT id,title,description,kind,url,name,position,created_at,downloadable,(file IS NOT NULL) AS has_file FROM lessons WHERE course_id=? AND parent_id IS NULL ORDER BY position,id').all(id);
  const kids = db.prepare('SELECT id,parent_id,kind,url,name,downloadable,(file IS NOT NULL) AS has_file FROM lessons WHERE course_id=? AND parent_id IS NOT NULL ORDER BY position,id').all(id);
  lessons.forEach(l => {
    // items = every material of the topic, the first one being the topic's own row
    l.items = [{ id: l.id, kind: l.kind, url: l.url, name: l.name, downloadable: !!l.downloadable && !!l.has_file }, ...kids.filter(k => k.parent_id === l.id).map(k => ({ id: k.id, kind: k.kind, url: k.url, name: k.name, downloadable: !!k.downloadable && !!k.has_file }))];
    delete l.name;
  });
  const done = new Set(db.prepare('SELECT lesson_id FROM progress WHERE user_id=?').all(req.user.id).map(r => r.lesson_id));
  lessons.forEach(l => (l.done = done.has(l.id)));
  const out = { course, lessons, teacher: teacherCard(course.teacher_id) };
  if (canManageCourse(req.user, id))
    out.students = db.prepare(`SELECT u.id,u.name,u.email,e.joined_at,
      (SELECT i.label FROM invites i WHERE i.id=e.invite_id) AS invite_label,
      (SELECT i.code FROM invites i WHERE i.id=e.invite_id) AS invite_code,
      (SELECT COUNT(*) FROM progress p JOIN lessons l ON l.id=p.lesson_id WHERE p.user_id=u.id AND l.course_id=? AND l.parent_id IS NULL) AS done
      FROM enrollments e JOIN users u ON u.id=e.user_id WHERE e.course_id=? ORDER BY u.name`).all(id, id);
  quiz.decorate(req.user, id, out, req.lang);
  res.json(out);
});

app.delete('/api/courses/:id/students/:uid', auth, (req, res) => {
  if (!canManageCourse(req.user, +req.params.id)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
  const e = db.prepare('SELECT invite_id FROM enrollments WHERE course_id=? AND user_id=?').get(req.params.id, req.params.uid);
  db.transaction(() => {
    db.prepare('DELETE FROM enrollments WHERE course_id=? AND user_id=?').run(req.params.id, req.params.uid);
    // Code aliyotumia inafutwa ili asirudi bila code mpya kutoka kwa mwalimu
    if (e && e.invite_id) db.prepare('UPDATE invites SET revoked_at=? WHERE id=? AND revoked_at IS NULL AND max_uses IS NULL').run(new Date().toISOString(), e.invite_id);
  })();
  audit(req, req.user.id, 'student_removed', `course ${req.params.id}, user ${req.params.uid}`);
  res.json({ ok: true });
});

// ---------- Katalogi ya madarasa kwa wanafunzi (topics zinaonekana, maudhui yamefungwa hadi ajiunge) ----------
const WHATSAPP = String(process.env.ADMIN_WHATSAPP || '+255747878051').replace(/[^\d]/g, '');
const contactInfo = () => ({ whatsapp: WHATSAPP, display: '+' + WHATSAPP });
const catalogSelect = `SELECT c.id,c.title,c.description,c.class_name,c.color,c.teacher_id,c.access,c.price,u.name AS teacher_name,
  (SELECT COUNT(*) FROM lessons l WHERE l.course_id=c.id AND l.parent_id IS NULL) AS lesson_count,
  EXISTS(SELECT 1 FROM enrollments e WHERE e.course_id=c.id AND e.user_id=?) AS enrolled
  FROM courses c LEFT JOIN users u ON u.id=c.teacher_id`;

app.get('/api/catalog', auth, need('student'), (req, res) => {
  const rows = db.prepare(catalogSelect + ' ORDER BY c.id DESC').all(req.user.id);
  res.json({ contact: contactInfo(), pay_enabled: pay.enabled(), courses: rows.map(r => ({ ...r, enrolled: !!r.enrolled })) });
});

// Majina na maelezo ya topics tu. Faili na viungo vya maudhui havitolewi hapa.
app.get('/api/courses/:id/preview', auth, need('student'), (req, res) => {
  const c = db.prepare(catalogSelect + ' WHERE c.id=?').get(req.user.id, +req.params.id);
  if (!c) return res.status(404).json({ error: L(req, 'Darasa halipo', 'Class not found') });
  const lessons = db.prepare('SELECT id,title,description,kind FROM lessons WHERE course_id=? AND parent_id IS NULL ORDER BY position,id').all(c.id);
  res.json({ contact: contactInfo(), pay_enabled: pay.enabled(), course: { ...c, enrolled: !!c.enrolled }, lessons, teacher: teacherCard(c.teacher_id) });
});

// ---------- Lessons ----------
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => cb(null, crypto.randomBytes(12).toString('hex') + path.extname(file.originalname).toLowerCase())
  }),
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, ['.mp4', '.webm', '.mov', '.m4v', ...docs.DOC_EXT].includes(ext));
  }
});

const MAX_MATERIALS = 20;
const fixName = n => { try { return Buffer.from(String(n), 'latin1').toString('utf8'); } catch { return String(n); } };
const baseName = n => clip(path.basename(fixName(n), path.extname(String(n))), 120);

// Validates every uploaded file and every link of a request. Returns { mats } or { error }.
// Nothing is written to the database here; on error all uploaded files are removed.
function readMaterials(req) {
  const files = req.files || [];
  const drop = () => files.forEach(f => fs.unlink(f.path, () => {}));
  const mats = [];
  for (const f of files) {
    const ext = path.extname(f.filename).toLowerCase();
    const kind = docs.DOC_EXT.includes(ext) ? 'pdf' : 'video'; // 'pdf' = any document shown inside the system
    // make sure the content really is a document/video and not another file renamed
    const good = kind === 'pdf' ? sec.validDocument(f.path, ext) : sec.validUpload(f.path, 'video');
    const label = baseName(f.originalname);
    if (!good) { drop(); return { error: (kind === 'pdf' ? L(req, 'Faili si waraka halali', 'The file is not a valid document') : L(req, 'Faili si video halali', 'The file is not a valid video')) + ': ' + label }; }
    if (kind === 'pdf' && f.size > docs.MAX_DOC_BYTES) { drop(); return { error: L(req, 'Waraka ni mkubwa mno (kikomo MB 100)', 'The document is too large (limit 100 MB)') + ': ' + label }; }
    if (kind === 'pdf' && !docs.canConvert(ext)) { drop(); return { error: L(req, 'Seva haijawekwa kubadilisha aina hii ya waraka (inahitaji LibreOffice). Pakia PDF, au muone msimamizi wa mfumo.', 'The server is not set up to convert this type of document (LibreOffice is required). Upload a PDF, or contact the system administrator.') + ': ' + label }; }
    mats.push({ kind, file: f.filename, url: null, ext, name: label, dl: (req.body || {}).downloadable === '1' ? 1 : 0 });
  }
  const body = req.body || {};
  const raw = [].concat(body.urls || [], body.url || []).join('\n').split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  for (const u of raw) {
    const link = sec.safeHttpUrl(u); // blocks javascript: and other dangerous links
    if (!link) { drop(); return { error: L(req, 'Kiungo kinapaswa kuanza na http:// au https://', 'The link must start with http:// or https://') + ': ' + clip(u, 60) }; }
    let host = link; try { host = new URL(link).hostname.replace(/^www\./, ''); } catch { /* keep link */ }
    mats.push({ kind: 'link', file: null, url: link, ext: '', name: clip(host, 120), dl: 0 });
  }
  if (!mats.length) return { error: L(req, 'Chagua faili (video/PDF/Word/PowerPoint) au weka kiungo', 'Choose files (video/PDF/Word/PowerPoint) or enter a link') };
  if (mats.length > MAX_MATERIALS) { drop(); return { error: L(req, `Upeo ni vitu ${MAX_MATERIALS} kwa topic moja`, `A topic can have at most ${MAX_MATERIALS} materials`) }; }
  return { mats };
}

const insertMat = db.prepare('INSERT INTO lessons(course_id,title,description,kind,file,url,position,parent_id,name,downloadable) VALUES(?,?,?,?,?,?,?,?,?,?)');
const nextPos = courseId => db.prepare('SELECT COALESCE(MAX(position),0)+1 p FROM lessons WHERE course_id=?').get(courseId).p;
const finishDocs = (mats, ids) => mats.map((m, i) => (m.kind === 'pdf' ? docs.register(ids[i], m.ext) : null));

app.post('/api/courses/:id/lessons', auth, (req, res, next) => {
  if (!canManageCourse(req.user, +req.params.id)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
  next();
}, upload.array('files', MAX_MATERIALS), async (req, res) => {
  await docs.ready;
  const { title, description } = req.body || {};
  if (!clip(title, 150)) { (req.files || []).forEach(f => fs.unlink(f.path, () => {})); return res.status(400).json({ error: L(req, 'Weka kichwa cha somo', 'Enter the lesson title') }); }
  const r = readMaterials(req);
  if (r.error) return res.status(400).json({ error: r.error });
  const courseId = +req.params.id, ids = [];
  db.transaction(() => {
    const pos = nextPos(courseId);
    r.mats.forEach((m, i) => {
      // first material = the topic itself; the rest are its children
      const topic = i === 0;
      const row = insertMat.run(courseId, clip(title, 150), topic ? clip(description, 1000) : '', m.kind, m.file, m.url, topic ? pos : pos + i, topic ? null : ids[0], m.name, m.dl);
      ids.push(row.lastInsertRowid);
    });
  })();
  const st = finishDocs(r.mats, ids);
  res.json({ id: ids[0], count: ids.length, doc_status: st[0] });
});

// Add more materials to a topic that already exists
app.post('/api/lessons/:id/materials', auth, (req, res, next) => {
  const l = db.prepare('SELECT course_id,parent_id FROM lessons WHERE id=?').get(req.params.id);
  if (!l || l.parent_id) return res.status(404).json({ error: L(req, 'Halipo', 'Not found') });
  if (!canManageCourse(req.user, l.course_id)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
  next();
}, upload.array('files', MAX_MATERIALS), async (req, res) => {
  await docs.ready;
  const topic = db.prepare('SELECT id,course_id,title FROM lessons WHERE id=?').get(req.params.id);
  const have = db.prepare('SELECT COUNT(*) n FROM lessons WHERE parent_id=?').get(topic.id).n + 1;
  const r = readMaterials(req);
  if (r.error) return res.status(400).json({ error: r.error });
  if (have + r.mats.length > MAX_MATERIALS) {
    r.mats.forEach(m => m.file && fs.unlink(path.join(UPLOAD_DIR, m.file), () => {}));
    return res.status(400).json({ error: L(req, `Upeo ni vitu ${MAX_MATERIALS} kwa topic moja`, `A topic can have at most ${MAX_MATERIALS} materials`) });
  }
  const ids = [];
  db.transaction(() => {
    r.mats.forEach(m => ids.push(insertMat.run(topic.course_id, topic.title, '', m.kind, m.file, m.url, nextPos(topic.course_id), topic.id, m.name, m.dl).lastInsertRowid));
  })();
  finishDocs(r.mats, ids);
  res.json({ ok: true, count: ids.length });
});

const removeRow = l => {
  if (l.file) fs.unlink(path.join(UPLOAD_DIR, l.file), () => {});
  docs.removeFiles(l.id);
  db.prepare('DELETE FROM lessons WHERE id=?').run(l.id);
};
app.delete('/api/lessons/:id', auth, (req, res) => {
  const l = db.prepare('SELECT * FROM lessons WHERE id=?').get(req.params.id);
  if (!l) return res.status(404).json({ error: L(req, 'Halipo', 'Not found') });
  if (!canManageCourse(req.user, l.course_id)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
  if (!l.parent_id) {
    // deleting a topic deletes all of its materials (a child id removes only that one material)
    db.prepare('SELECT * FROM lessons WHERE parent_id=?').all(l.id).forEach(removeRow);
    quiz.purgeLesson(l.id); // faili za essay za somo hili
  }
  removeRow(l);
  res.json({ ok: true });
});

// Teacher: allow / forbid students to download one material
app.put('/api/lessons/:id/downloadable', auth, (req, res) => {
  const l = db.prepare('SELECT id,course_id,file FROM lessons WHERE id=?').get(req.params.id);
  if (!l) return res.status(404).json({ error: L(req, 'Halipo', 'Not found') });
  if (!canManageCourse(req.user, l.course_id)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
  if (!l.file) return res.status(400).json({ error: L(req, 'Viungo havipakuliwi', 'Links cannot be downloaded') });
  db.prepare('UPDATE lessons SET downloadable=? WHERE id=?').run((req.body || {}).downloadable ? 1 : 0, l.id);
  res.json({ ok: true });
});

app.post('/api/lessons/:id/done', auth, need('student'), (req, res) => {
  let l = db.prepare('SELECT * FROM lessons WHERE id=?').get(req.params.id);
  if (l && l.parent_id) l = db.prepare('SELECT * FROM lessons WHERE id=?').get(l.parent_id);
  if (!l || !canAccessCourse(req.user, l.course_id)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
  const { done } = req.body || {};
  if (done) db.prepare('INSERT OR IGNORE INTO progress(user_id,lesson_id) VALUES(?,?)').run(req.user.id, l.id);
  else db.prepare('DELETE FROM progress WHERE user_id=? AND lesson_id=?').run(req.user.id, l.id);
  res.json({ ok: true });
});

// Faili zinalindwa: ni wenye ruhusa tu. sendFile inasapoti Range (video seeking).
app.get('/files/:lessonId', auth, (req, res) => {
  const l = db.prepare('SELECT * FROM lessons WHERE id=?').get(req.params.lessonId);
  if (!l || !l.file || !canAccessCourse(req.user, l.course_id)) return res.status(403).send(L(req, 'Huruhusiwi', 'Not allowed'));
  // Wanafunzi hawapewi faili asili ya waraka (wanaiona ndani ya system kama kurasa). Walimu/admin wanapewa; PDF ya 'raw' ni njia mbadala bila poppler.
  const manager = canManageCourse(req.user, l.course_id);
  const wantDl = req.query.download === '1';
  // Students get the original file only when the teacher marked it downloadable (and only through the download button)
  if (wantDl && !manager && !l.downloadable) return res.status(403).send(L(req, 'Huruhusiwi', 'Not allowed'));
  if (l.kind === 'pdf' && l.doc_status !== 'raw' && !manager && !(wantDl && l.downloadable)) return res.status(403).send(L(req, 'Huruhusiwi', 'Not allowed'));
  if (wantDl) {
    const fn = (clip(l.name || l.title, 120).replace(/[\\/:*?"<>|\r\n]+/g, '_') || 'file') + path.extname(l.file).toLowerCase();
    res.setHeader('Content-Disposition', "attachment; filename*=UTF-8''" + encodeURIComponent(fn));
  }
  res.type(l.kind === 'pdf' ? (path.extname(l.file).toLowerCase() === '.pdf' ? 'application/pdf' : 'application/octet-stream') : path.extname(l.file) === '.webm' ? 'video/webm' : 'video/mp4');
  res.sendFile(path.join(UPLOAD_DIR, l.file));
});

// ---------- Admin: walimu na wanafunzi ----------
app.get('/api/teachers', auth, need('admin'), (req, res) => {
  res.json(db.prepare(`SELECT u.id,u.name,u.email,u.username,u.created_at,
    (SELECT COUNT(*) FROM courses c WHERE c.teacher_id=u.id) AS courses
    FROM users u WHERE role='teacher' ORDER BY name`).all());
});

app.post('/api/teachers', auth, need('admin'), (req, res) => {
  const { name, email, password } = req.body || {};
  const nm = cleanName(name), em = String(email || '').trim().toLowerCase();
  if (nm.length < 2 || !goodEmail(em)) return res.status(400).json({ error: L(req, 'Jaza jina kamili na barua pepe sahihi', 'Enter a full name and a valid email address') });
  const weak = sec.passwordProblem(password, { email: em, name: nm }, req.lang);
  if (weak) return res.status(400).json({ error: weak });
  try {
    // Nenosiri la kuanzia ni la muda: mwalimu atalibadilisha na kukubali masharti akiingia kwanza
    const r = db.prepare('INSERT INTO users(name,email,password,role,must_change) VALUES(?,?,?,?,1)')
      .run(nm, em, bcrypt.hashSync(password, BCRYPT_COST), 'teacher');
    audit(req, req.user.id, 'teacher_created', em);
    res.json({ id: r.lastInsertRowid });
  } catch {
    res.status(400).json({ error: L(req, 'Barua pepe hii tayari ipo', 'This email already exists') });
  }
});

app.get('/api/students', auth, need('admin'), (req, res) => {
  res.json(db.prepare(`SELECT u.id,u.name,u.email,u.created_at,
    (SELECT COUNT(*) FROM enrollments e WHERE e.user_id=u.id) AS courses
    FROM users u WHERE role='student' ORDER BY created_at DESC`).all());
});

app.post('/api/users/:id/reset', auth, need('admin'), (req, res) => {
  const t = db.prepare("SELECT id,name,email FROM users WHERE id=? AND role!='admin'").get(req.params.id);
  if (!t) return res.status(404).json({ error: L(req, 'Mtumiaji hapatikani', 'User not found') });
  const weak = sec.passwordProblem((req.body || {}).password, t, req.lang);
  if (weak) return res.status(400).json({ error: weak });
  // Nenosiri la muda: mtumiaji lazima alibadilishe, na vifaa vyake vyote vinatolewa
  db.prepare('UPDATE users SET password=?, must_change=1, token_version=token_version+1 WHERE id=?')
    .run(bcrypt.hashSync(req.body.password, BCRYPT_COST), t.id);
  audit(req, req.user.id, 'password_reset_by_admin', t.email);
  res.json({ ok: true });
});

app.delete('/api/users/:id', auth, need('admin'), (req, res) => {
  const t = db.prepare("SELECT email FROM users WHERE id=? AND role!='admin'").get(req.params.id);
  if (t) { db.prepare('DELETE FROM users WHERE id=?').run(req.params.id); audit(req, req.user.id, 'user_deleted', t.email); }
  res.json({ ok: true });
});

app.get('/api/stats', auth, need('admin'), (req, res) => {
  const n = q => db.prepare(q).get().n;
  res.json({
    students: n("SELECT COUNT(*) n FROM users WHERE role='student'"),
    teachers: n("SELECT COUNT(*) n FROM users WHERE role='teacher'"),
    courses: n('SELECT COUNT(*) n FROM courses'),
    lessons: n('SELECT COUNT(*) n FROM lessons')
  });
});

app.use(express.static(path.join(__dirname, 'public'), { dotfiles: 'ignore' }));
app.use((err, req, res, next) => {
  if (err && err.name === 'MulterError') return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? L(req, 'Faili ni kubwa mno', 'The file is too large') : L(req, 'Faili haikubaliki', 'The file is not accepted') });
  if (err && err.status && err.status < 500) return res.status(err.status).json({ error: L(req, 'Ombi si sahihi', 'Invalid request') });
  console.error(err);
  res.status(500).json({ error: L(req, 'Hitilafu ya seva', 'Server error') }); // usionyeshe maelezo ya ndani kwa mtumiaji
});

app.listen(PORT, '0.0.0.0', () => console.log(`D4LT Learn is running: http://localhost:${PORT}`));
