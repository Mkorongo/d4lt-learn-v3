// Nyaraka za somo: faili yoyote ya ofisi/PDF inabadilishwa na seva kuwa kurasa za picha,
// na mwanafunzi anaziona ndani ya system (si kama PDF ya kivinjari, bila vitufe vyake).
// Faili asili haitolewi kwa wanafunzi.
//
// Zana zinazohitajika kwenye seva:
//   - LibreOffice (soffice): Word/PowerPoint/Excel/ODF/RTF/TXT/CSV -> PDF
//   - poppler (pdftoppm):    PDF -> kurasa za JPEG
// Bila poppler, PDF inaonyeshwa kwa njia mbadala ya kivinjari ("raw"). Bila LibreOffice, aina za ofisi zinakataliwa.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');
const { pathToFileURL } = require('url');

const DOC_EXT = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.odt', '.odp', '.ods', '.rtf', '.txt', '.csv'];
const MAX_PAGES = Math.max(1, Number(process.env.DOC_MAX_PAGES) || 400);
const MAX_DOC_BYTES = 100 * 1024 * 1024;
const PAGE_WIDTH = Math.min(2400, Math.max(800, Number(process.env.DOC_PAGE_WIDTH) || 1400));

function run(cmd, args, timeout) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { timeout, killSignal: 'SIGKILL', windowsHide: true, maxBuffer: 8 * 1024 * 1024 }, (e, stdout, stderr) => {
      if (e) return reject(Object.assign(e, { stderr: String(stderr || '') }));
      resolve({ stdout: String(stdout || ''), stderr: String(stderr || '') });
    });
  });
}

// Hitilafu za ubadilishaji zinahifadhiwa kama funguo ('@...') na kutafsiriwa wakati wa kusoma (lugha ya ombi).
const ERR_TEXT = {
  '@convert': ['Waraka haukuweza kubadilishwa. Hakikisha faili ni halali na haijafungwa kwa nenosiri.', 'The document could not be converted. Make sure the file is valid and not password-protected.'],
  '@nopages': ['Hakuna kurasa zilizopatikana kwenye waraka huu.', 'No pages were found in this document.'],
  '@timeout': ['Ubadilishaji umechukua muda mrefu mno.', 'The conversion took too long.'],
  '@notools': ['Seva haina zana za kubadilisha waraka huu.', 'The server has no tools to convert this document.'],
  '@unknown': ['Hitilafu isiyojulikana', 'Unknown error']
};
const errText = (e, lang) => {
  if (!e) return e;
  const x = ERR_TEXT[e];
  return x ? (lang === 'sw' ? x[0] : x[1]) : e;
};

module.exports = function init({ app, db, auth, canAccessCourse, canManageCourse, UPLOAD_DIR, L }) {
  for (const col of ['doc_status TEXT', 'pages INTEGER NOT NULL DEFAULT 0', 'doc_error TEXT']) {
    try { db.exec('ALTER TABLE lessons ADD COLUMN ' + col); } catch { /* tayari ipo */ }
  }
  const DOCS_DIR = path.join(UPLOAD_DIR, 'docs');
  fs.mkdirSync(DOCS_DIR, { recursive: true });

  // ---------- Kutambua zana ----------
  const caps = { pdf: false, office: false, soffice: null, pdftoppm: null };

  async function detect() {
    const pp = process.env.PDFTOPPM_PATH || 'pdftoppm';
    try { await run(pp, ['-v'], 15000); caps.pdftoppm = pp; }
    catch (e) { if (e.code !== 'ENOENT' && /pdftoppm|poppler/i.test(e.stderr || '')) caps.pdftoppm = pp; }
    const cands = [process.env.SOFFICE_PATH, 'soffice', 'libreoffice',
      'C:\\Program Files\\LibreOffice\\program\\soffice.exe', 'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
      '/Applications/LibreOffice.app/Contents/MacOS/soffice'].filter(Boolean);
    for (const c of cands) {
      try { await run(c, ['--version'], 30000); caps.soffice = c; break; } catch { /* jaribu inayofuata */ }
    }
    caps.pdf = !!caps.pdftoppm;
    caps.office = !!(caps.pdftoppm && caps.soffice);
    console.log(`Documents: poppler ${caps.pdftoppm ? 'found' : 'NOT FOUND (PDFs will use the browser fallback viewer)'}, LibreOffice ${caps.soffice ? 'found' : 'NOT FOUND (Word/PowerPoint/Excel will be rejected)'}`);
  }

  // ---------- Foleni ya ubadilishaji (moja baada ya nyingine) ----------
  const queue = [];
  let busy = false;
  const pageDir = id => path.join(DOCS_DIR, String(Math.floor(Number(id))));
  const setStatus = (id, status, pages = 0, error = null) =>
    db.prepare('UPDATE lessons SET doc_status=?, pages=?, doc_error=? WHERE id=?').run(status, pages, error, id);

  async function convert(l) {
    const src = path.join(UPLOAD_DIR, l.file);
    const ext = path.extname(l.file).toLowerCase();
    const work = fs.mkdtempSync(path.join(os.tmpdir(), 'd4lt-doc-'));
    try {
      let pdf = src;
      if (ext !== '.pdf') {
        await run(caps.soffice, ['--headless', '--norestore', '--nolockcheck', '--nodefault', '--nofirststartwizard',
          `-env:UserInstallation=${pathToFileURL(path.join(work, 'profile')).href}`,
          '--convert-to', 'pdf', '--outdir', work, src], 240000);
        pdf = path.join(work, path.basename(src, ext) + '.pdf');
        if (!fs.existsSync(pdf)) throw new Error('@convert');
      }
      const out = pageDir(l.id);
      fs.rmSync(out, { recursive: true, force: true });
      fs.mkdirSync(out, { recursive: true });
      await run(caps.pdftoppm, ['-jpeg', '-jpegopt', 'quality=82', '-scale-to-x', String(PAGE_WIDTH), '-scale-to-y', '-1',
        '-l', String(MAX_PAGES), pdf, path.join(out, 'p')], 600000);
      const made = fs.readdirSync(out).map(f => ({ f, n: (/^p-(\d+)\.jpg$/.exec(f) || [])[1] })).filter(x => x.n)
        .sort((a, b) => Number(a.n) - Number(b.n));
      if (!made.length) throw new Error('@nopages');
      made.forEach((x, i) => fs.renameSync(path.join(out, x.f), path.join(out, `${i + 1}.jpg`)));
      setStatus(l.id, 'ready', made.length, null);
    } catch (e) {
      const msg = /timed out|SIGKILL/i.test(String(e.message)) || e.killed ? '@timeout' : String(e.message || '@unknown').slice(0, 200);
      console.error('Document conversion failed (lesson ' + l.id + '):', e.message, e.stderr || '');
      setStatus(l.id, 'failed', 0, msg);
    } finally {
      fs.rmSync(work, { recursive: true, force: true });
    }
  }

  async function pump() {
    if (busy) return;
    busy = true;
    try {
      while (queue.length) {
        const id = queue.shift();
        const l = db.prepare('SELECT * FROM lessons WHERE id=?').get(id);
        if (l && l.file && l.kind === 'pdf') await convert(l);
      }
    } finally { busy = false; }
  }
  function enqueue(id) {
    if (!queue.includes(id)) queue.push(id);
    setImmediate(pump);
  }

  const extOf = f => path.extname(String(f || '')).toLowerCase();
  const canConvert = ext => (ext === '.pdf' ? true : caps.office);

  // Inaitwa baada ya waraka kupakiwa. Inarudisha hali ya mwanzo.
  function register(lessonId, ext) {
    if (ext === '.pdf' && !caps.pdf) { setStatus(lessonId, 'raw'); return 'raw'; }
    setStatus(lessonId, 'processing');
    enqueue(lessonId);
    return 'processing';
  }

  function removeFiles(lessonId) {
    fs.rm(pageDir(lessonId), { recursive: true, force: true }, () => {});
  }

  // ---------- Njia (routes) ----------
  function lessonFor(req, res) {
    const l = db.prepare('SELECT * FROM lessons WHERE id=?').get(req.params.id);
    if (!l || l.kind !== 'pdf' || !canAccessCourse(req.user, l.course_id)) { res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') }); return null; }
    return l;
  }

  app.get('/api/lessons/:id/doc', auth, (req, res) => {
    const l = lessonFor(req, res); if (!l) return;
    res.json({ status: l.doc_status || 'processing', pages: l.pages || 0, error: canManageCourse(req.user, l.course_id) ? errText(l.doc_error, req.lang) : null });
  });

  app.get('/doc-pages/:id/:n', auth, (req, res) => {
    const id = Number(req.params.id), n = Number(req.params.n);
    const l = db.prepare('SELECT * FROM lessons WHERE id=?').get(id);
    if (!l || l.kind !== 'pdf' || !canAccessCourse(req.user, l.course_id)) return res.status(403).send(L(req, 'Huruhusiwi', 'Not allowed'));
    if (l.doc_status !== 'ready' || !Number.isInteger(n) || n < 1 || n > l.pages) return res.status(404).send(L(req, 'Ukurasa haupo', 'Page not found'));
    res.type('image/jpeg');
    res.setHeader('Cache-Control', 'private, max-age=3600');
    res.setHeader('Content-Disposition', 'inline');
    res.sendFile(path.join(pageDir(id), `${n}.jpg`), { dotfiles: 'allow' });
  });

  app.post('/api/lessons/:id/reconvert', auth, (req, res) => {
    const l = db.prepare('SELECT * FROM lessons WHERE id=?').get(req.params.id);
    if (!l || l.kind !== 'pdf' || !l.file) return res.status(404).json({ error: L(req, 'Waraka haupo', 'Document not found') });
    if (!canManageCourse(req.user, l.course_id)) return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    if (!canConvert(extOf(l.file))) return res.status(400).json({ error: L(req, 'Seva haina zana za kubadilisha waraka huu (LibreOffice).', 'The server has no tools to convert this document (LibreOffice).') });
    res.json({ status: register(l.id, extOf(l.file)) });
  });

  app.get('/api/doc-capabilities', auth, (req, res) => {
    if (req.user.role === 'student') return res.status(403).json({ error: L(req, 'Huruhusiwi', 'Not allowed') });
    res.json({ pdf: caps.pdf, office: caps.office, exts: DOC_EXT });
  });

  // ---------- Kuanza: tambua zana, kisha rudisha kazi zisizokamilika ----------
  const ready = detect().then(() => {
    const rows = db.prepare("SELECT id,file,doc_status FROM lessons WHERE kind='pdf' AND file IS NOT NULL").all();
    for (const r of rows) {
      const ext = extOf(r.file);
      const todo = !r.doc_status || r.doc_status === 'processing' || (r.doc_status === 'raw' && caps.pdf);
      if (todo && canConvert(ext)) register(r.id, ext);
      else if (!r.doc_status) setStatus(r.id, 'failed', 0, '@notools');
    }
  }).catch(e => console.error('Documents: startup error', e));

  return { ready, caps, DOC_EXT, MAX_DOC_BYTES, canConvert, register, removeFiles };
};
