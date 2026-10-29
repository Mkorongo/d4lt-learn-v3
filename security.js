// Zana za usalama zinazotumika na server.js, invites.js na meetings.js
// Lugha: kila ujumbe wa mtumiaji unarudi kwa lugha ya ombi (header X-Lang: en|sw; chaguo-msingi ni Kiingereza).
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Toleo la Masharti na Sera ya Faragha. Ukibadilisha maandishi ya masharti, badilisha tarehe hii:
// kila mtumiaji ataombwa kukubali upya kabla ya kuendelea.
const TERMS_VERSION = '2026-10-16';

// ---------- Lugha ----------
const langOf = req => (req && (req.lang === 'sw' || (req.get && req.get('X-Lang') === 'sw')) ? 'sw' : 'en');
// L(req | 'sw'|'en', kiswahili, english)
const L = (r, sw, en) => ((typeof r === 'string' ? r : langOf(r)) === 'sw' ? sw : en);

// ---------- Siri ya JWT (inabaki ile ile seva ikiwashwa upya) ----------
function loadSecret(dir) {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 24) return process.env.JWT_SECRET;
  if (process.env.JWT_SECRET) console.warn('WARNING: JWT_SECRET is too short (under 24 characters). Ignoring it and using the file secret instead.');
  const f = path.join(dir, '.jwt_secret');
  try {
    const s = fs.readFileSync(f, 'utf8').trim();
    if (s.length >= 48) return s;
  } catch { /* haipo bado */ }
  const s = crypto.randomBytes(48).toString('hex');
  fs.writeFileSync(f, s, { mode: 0o600 });
  return s;
}

// ---------- Nenosiri imara ----------
const SUBSTR = ['password', 'passw0rd', 'qwerty', 'asdfgh', 'zxcvbn', '123456', '654321', '111111', '000000', 'abcdef',
  'iloveyou', 'administrator', 'admin', 'welcome', 'letmein', 'football', 'student', 'teacher',
  'tanzania', 'kilimanjaro', 'zanzibar', 'nenosiri', 'kiswahili', 'swahili', 'mwalimu', 'mwanafunzi', 'karibu',
  'd4lt', 'ruaha', 'iringa'];

function hasSequence(s, n = 5) {
  const x = s.toLowerCase();
  for (let i = 0; i + n <= x.length; i++) {
    let up = true, down = true;
    for (let j = 1; j < n; j++) {
      const d = x.charCodeAt(i + j) - x.charCodeAt(i + j - 1);
      if (d !== 1) up = false;
      if (d !== -1) down = false;
    }
    if (up || down) return true;
  }
  return false;
}

// Inarudisha ujumbe (kwa lugha ya `lang`) kama nenosiri ni dhaifu, au null kama ni imara.
function passwordProblem(pw, ctx = {}, lang = 'en') {
  pw = typeof pw === 'string' ? pw : '';
  const bad = [];
  if (pw.length < 10) bad.push(L(lang, 'angalau herufi 10', 'at least 10 characters'));
  if (Buffer.byteLength(pw) > 72) bad.push(L(lang, 'lisizidi herufi 72', 'no more than 72 characters'));
  if (!/[a-z]/.test(pw)) bad.push(L(lang, 'herufi ndogo (a-z)', 'a lowercase letter (a-z)'));
  if (!/[A-Z]/.test(pw)) bad.push(L(lang, 'herufi kubwa (A-Z)', 'an uppercase letter (A-Z)'));
  if (!/[0-9]/.test(pw)) bad.push(L(lang, 'namba (0-9)', 'a number (0-9)'));
  if (!/[^A-Za-z0-9]/.test(pw)) bad.push(L(lang, 'alama maalum (! @ # $ % n.k.)', 'a special character (! @ # $ % etc.)'));
  const missing = bad.length ? L(lang, `Nenosiri liwe na: ${bad.join(', ')}.`, `The password must have: ${bad.join(', ')}.`) : '';

  const extra = [];
  const low = pw.toLowerCase();
  if (SUBSTR.some(w => low.includes(w))) extra.push(L(lang, 'Lina neno au namba rahisi kubashiri (mf. password, 123456, admin)', 'It contains an easy-to-guess word or number (e.g. password, 123456, admin)'));
  if (/(.)\1{3,}/.test(pw)) extra.push(L(lang, 'Lina herufi ileile mara nyingi mfululizo', 'It repeats the same character many times in a row'));
  if (hasSequence(pw)) extra.push(L(lang, 'Lina mfuatano rahisi (mf. abcde, 12345)', 'It contains a simple sequence (e.g. abcde, 12345)'));
  const personal = [];
  if (ctx.email) personal.push(String(ctx.email).split('@')[0]);
  if (ctx.name) personal.push(...String(ctx.name).split(/[^\p{L}\p{N}]+/u));
  if (personal.some(t => t && t.length >= 4 && low.includes(t.toLowerCase())))
    extra.push(L(lang, 'Lina jina lako au barua pepe yako', 'It contains your name or email'));

  if (!missing && !extra.length) return null;
  return L(lang, 'Nenosiri ni dhaifu. Tengeneza nenosiri imara (create a strong password). ', 'The password is weak. Create a strong password. ') +
    [missing, ...extra.map(e => e + '.')].filter(Boolean).join(' ');
}

// Nenosiri la nasibu lenye nguvu (kwa admin wa kwanza)
function randomPassword() {
  const L = 'abcdefghjkmnpqrstuvwxyz', U = 'ABCDEFGHJKLMNPQRSTUVWXYZ', D = '23456789', S = '!@#$%^&*-_=+?';
  const pick = set => set[crypto.randomInt(set.length)];
  const all = L + U + D + S;
  const out = [pick(L), pick(U), pick(D), pick(S)];
  while (out.length < 18) out.push(pick(all));
  for (let i = out.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [out[i], out[j]] = [out[j], out[i]]; }
  return out.join('');
}

// ---------- Rate limiter (kumbukumbu ya seva) ----------
function limiter({ windowMs, max, blockMs }) {
  const m = new Map();
  const tick = setInterval(() => {
    const now = Date.now();
    for (const [k, e] of m) if ((!e.until || e.until < now) && e.hits.every(t => now - t > windowMs)) m.delete(k);
  }, 60 * 1000);
  tick.unref();
  return {
    // sekunde za kusubiri kama imezuiwa, vinginevyo 0
    wait(key) {
      const e = m.get(key);
      if (e && e.until && e.until > Date.now()) return Math.ceil((e.until - Date.now()) / 1000);
      return 0;
    },
    fail(key) {
      const now = Date.now();
      const e = m.get(key) || { hits: [], until: 0 };
      e.hits = e.hits.filter(t => now - t < windowMs);
      e.hits.push(now);
      if (e.hits.length >= max) { e.until = now + blockMs; e.hits = []; }
      m.set(key, e);
      return this.wait(key);
    },
    reset(key) { m.delete(key); }
  };
}
const waitText = (s, lang = 'en') => L(lang,
  `Umejaribu mara nyingi mno. Subiri ${s >= 120 ? Math.ceil(s / 60) + ' dakika' : s + ' sekunde'} kisha ujaribu tena.`,
  `Too many attempts. Please wait ${s >= 120 ? Math.ceil(s / 60) + ' minutes' : s + ' seconds'} and try again.`);

// ---------- Headers za usalama ----------
function headers(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  if (req.secure) res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  // PDF na video zinaonyeshwa ndani ya iframe/video, CSP kali inaweza kuvunja kicheza PDF cha kivinjari
  if (!req.path.startsWith('/files/') && !req.path.startsWith('/meeting-files/')) {
    res.setHeader('Content-Security-Policy', [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data:",
      "media-src 'self' blob:",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'"
    ].join('; '));
  }
  if (req.path.startsWith('/api/')) res.setHeader('Cache-Control', 'no-store');
  next();
}

// Inazuia maombi ya kubadilisha data yanayotoka tovuti nyingine (CSRF)
function sameOrigin(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const o = req.headers.origin;
  if (o) {
    let host = '';
    try { host = new URL(o).host; } catch { /* batili */ }
    if (host !== req.headers.host) return res.status(403).json({ error: L(req, 'Ombi limekataliwa (asili si sahihi)', 'Request rejected (invalid origin)') });
  }
  next();
}

// ---------- URL salama (http/https tu; inazuia javascript: n.k.) ----------
function safeHttpUrl(v) {
  const s = String(v || '').trim();
  if (!s || s.length > 2000) return null;
  try {
    const u = new URL(s);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    if (u.username || u.password) return null;
    return u.href;
  } catch { return null; }
}

// ---------- Ukaguzi wa maudhui halisi ya faili (si jina tu) ----------
function validUpload(file, kind) {
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    const b = Buffer.alloc(16);
    const n = fs.readSync(fd, b, 0, 16, 0);
    if (n < 8) return false;
    if (kind === 'pdf') return b.slice(0, 4).toString('latin1') === '%PDF';
    const isMp4 = b.slice(4, 8).toString('latin1') === 'ftyp';
    const isWebm = b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3;
    return isMp4 || isWebm;
  } catch { return false; } finally { if (fd !== undefined) try { fs.closeSync(fd); } catch { /* sawa */ } }
}

// Hakikisha maudhui ya waraka yanalingana na aina yake (PDF, ZIP-based ya ofisi, OLE ya zamani, RTF, maandishi)
function validDocument(file, ext) {
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    const b = Buffer.alloc(4096);
    const n = fs.readSync(fd, b, 0, 4096, 0);
    if (n < 4) return false;
    const head = b.slice(0, 8);
    const isPdf = head.slice(0, 4).toString('latin1') === '%PDF';
    const isZip = head[0] === 0x50 && head[1] === 0x4b && head[2] === 0x03 && head[3] === 0x04;
    const isOle = head.equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
    const isRtf = head.slice(0, 5).toString('latin1') === '{\\rtf';
    if (ext === '.pdf') return isPdf;
    if (['.docx', '.pptx', '.xlsx', '.odt', '.odp', '.ods'].includes(ext)) return isZip;
    if (['.doc', '.ppt', '.xls'].includes(ext)) return isOle || isZip || isRtf;
    if (ext === '.rtf') return isRtf;
    if (ext === '.txt' || ext === '.csv') return !b.slice(0, n).includes(0);
    return false;
  } catch { return false; } finally { if (fd !== undefined) try { fs.closeSync(fd); } catch { /* sawa */ } }
}

module.exports = { L, langOf, TERMS_VERSION, loadSecret, passwordProblem, randomPassword, limiter, waitText, headers, sameOrigin, safeHttpUrl, validUpload, validDocument };
