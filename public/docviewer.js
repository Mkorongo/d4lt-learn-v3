'use strict';
// Kicheza cha nyaraka cha ndani ya system. Waraka (PDF/Word/PowerPoint/Excel...) umebadilishwa na seva kuwa kurasa za picha.
// Hakuna toolbar ya PDF, hakuna kupakua/kuchapisha, na mwanafunzi anaona alama ya jina lake juu ya kurasa.
// Inatumia esc, api, toast, me kutoka app.js

addStrings({
  en: {
    'doc.fullscreen': 'Full screen', 'doc.exit_fullscreen': 'Exit full screen', 'doc.unavailable': 'Document unavailable',
    'doc.preparing': 'Preparing the document...', 'doc.preparing_sub': 'This takes a few seconds. The page will open by itself.',
    'doc.failed': 'The document could not be prepared', 'doc.unknown_error': 'Unknown error', 'doc.tell_teacher': 'Please let the teacher know so they can fix it.',
    'doc.retry': 'Try again', 'doc.page_of': 'Page {n} / {total}', 'doc.zoom_out': 'Zoom out', 'doc.zoom_in': 'Zoom in', 'doc.fit': 'Fit width',
    'doc.pages_aria': 'Pages of the document {title}', 'doc.page_alt': 'Page {n}'
  },
  sw: {
    'doc.fullscreen': 'Skrini nzima', 'doc.exit_fullscreen': 'Funga skrini nzima', 'doc.unavailable': 'Waraka haupatikani',
    'doc.preparing': 'Waraka unaandaliwa...', 'doc.preparing_sub': 'Itachukua sekunde chache. Ukurasa utafunguka wenyewe.',
    'doc.failed': 'Waraka haukuweza kuandaliwa', 'doc.unknown_error': 'Hitilafu isiyojulikana', 'doc.tell_teacher': 'Mwalimu ajulishwe ili aurekebishe.',
    'doc.retry': 'Jaribu tena', 'doc.page_of': 'Ukurasa {n} / {total}', 'doc.zoom_out': 'Punguza', 'doc.zoom_in': 'Ongeza', 'doc.fit': 'Upana',
    'doc.pages_aria': 'Kurasa za waraka {title}', 'doc.page_alt': 'Ukurasa {n}'
  }
});

let docSeq = 0;

// Skrini nzima ndani ya ukurasa huohuo. Kivinjari kikisapoti (Fullscreen API) kinatumika;
// kama hakisapoti (mf. iPhone) tunatumia hali ya "skrini nzima ya ndani" inayojaza dirisha lote.
window.addEventListener('hashchange', () => document.body.classList.remove('docfs-lock'));

function bindFullscreen(host) {
  const box = host.querySelector('.docv'), btn = host.querySelector('[data-fs]');
  if (!box || !btn) return;
  document.body.classList.remove('docfs-lock');
  const nativeEl = () => document.fullscreenElement || document.webkitFullscreenElement;
  const isOn = () => nativeEl() === box || box.classList.contains('docfs');
  const label = () => { btn.textContent = isOn() ? t('doc.exit_fullscreen') : t('doc.fullscreen'); btn.setAttribute('aria-pressed', String(isOn())); };
  const exitInner = () => { box.classList.remove('docfs'); document.body.classList.remove('docfs-lock'); label(); };

  btn.onclick = async () => {
    if (isOn()) {
      if (box.classList.contains('docfs')) exitInner();
      else (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      return;
    }
    const req = box.requestFullscreen || box.webkitRequestFullscreen;
    try {
      if (!req) throw new Error('hakisapoti');
      await req.call(box);
    } catch {
      box.classList.add('docfs');
      document.body.classList.add('docfs-lock');
    }
    label();
  };

  const onChange = () => { if (!document.body.contains(box)) { document.removeEventListener('fullscreenchange', onChange); document.removeEventListener('webkitfullscreenchange', onChange); document.removeEventListener('keydown', onKey); return; } label(); };
  const onKey = e => {
    if (!document.body.contains(box)) return onChange();
    if (e.key === 'Escape' && box.classList.contains('docfs')) exitInner();
  };
  document.addEventListener('fullscreenchange', onChange);
  document.addEventListener('webkitfullscreenchange', onChange);
  document.addEventListener('keydown', onKey);
}

function docMsg(html) { return `<div class="docmsg">${html}</div>`; }

function watermarkImage() {
  const label = `${me.name} · ${me.email}`.replace(/[<>&"']/g, ' ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="260"><text x="30" y="150" font-size="16" font-family="sans-serif" fill="rgba(20,33,61,0.10)" transform="rotate(-24 210 130)">${label}</text></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

async function drawDocViewer(l) {
  const host = document.getElementById('docscreen');
  if (!host) return;
  const seq = ++docSeq;
  const alive = () => seq === docSeq && document.body.contains(host);
  const manage = me.role !== 'student';

  let d;
  try { d = await api(`/api/lessons/${l.id}/doc`); }
  catch (e) { if (alive()) host.innerHTML = docMsg(`<b>${t('doc.unavailable')}</b><span>${esc(e.message)}</span>`); return; }
  if (!alive()) return;

  if (d.status === 'processing') {
    host.innerHTML = docMsg(`<div class="spin"></div><b>${t('doc.preparing')}</b><span>${t('doc.preparing_sub')}</span>`);
    setTimeout(() => { if (alive()) drawDocViewer(l); }, 3000);
    return;
  }

  if (d.status === 'failed') {
    host.innerHTML = docMsg(`<b>${t('doc.failed')}</b>
      <span>${manage ? esc(d.error || t('doc.unknown_error')) : t('doc.tell_teacher')}</span>
      ${manage ? `<button class="btn sm" id="dretry">${t('doc.retry')}</button>` : ''}`);
    const b = document.getElementById('dretry');
    if (b) b.onclick = async () => {
      try { await api(`/api/lessons/${l.id}/reconvert`, { method: 'POST' }); drawDocViewer(l); }
      catch (e) { toast(e.message, true); }
    };
    return;
  }

  // Seva haina poppler: PDF inaonyeshwa kwa kivinjari (njia mbadala, vitufe vya kivinjari vinaweza kuonekana)
  if (d.status === 'raw') {
    host.innerHTML = `<div class="docv"><div class="doct"><span>${esc(l.title)}</span><span class="dz"><button type="button" data-fs aria-pressed="false">${t('doc.fullscreen')}</button></span></div>
      <div class="docbody"><iframe src="/files/${l.id}#toolbar=0&navpanes=0&scrollbar=1&view=FitH" title="${esc(l.title)}"></iframe></div></div>`;
    bindFullscreen(host);
    return;
  }

  // ----- Kicheza cha kurasa -----
  const n = d.pages;
  host.innerHTML = `<div class="docv">
    <div class="doct">
      <span class="dpage" aria-live="polite">${t('doc.page_of', { n: 1, total: n })}</span>
      <span class="dz"><button type="button" data-z="-" aria-label="${t('doc.zoom_out')}">−</button><span class="dzv">100%</span>
        <button type="button" data-z="+" aria-label="${t('doc.zoom_in')}">+</button><button type="button" data-z="1">${t('doc.fit')}</button>
        <button type="button" data-fs aria-pressed="false">${t('doc.fullscreen')}</button></span>
    </div>
    <div class="docbody">
      <div class="docpages" tabindex="0" aria-label="${esc(t('doc.pages_aria', { title: l.title }))}">
        ${Array.from({ length: n }, (_, i) => `<div class="dpg"><img draggable="false" alt="${t('doc.page_alt', { n: i + 1 })}" loading="lazy" src="/doc-pages/${l.id}/${i + 1}"></div>`).join('')}
      </div>
      ${manage ? '' : '<div class="docwm"></div>'}
    </div></div>`;

  const sc = host.querySelector('.docpages'), pg = host.querySelector('.dpage'), zv = host.querySelector('.dzv');
  const wm = host.querySelector('.docwm');
  if (wm) wm.style.backgroundImage = watermarkImage();
  const pages = [...sc.children];
  pages.forEach(p => { p.querySelector('img').onload = () => { p.style.aspectRatio = 'auto'; }; });

  let z = 1;
  const setZ = v => {
    z = Math.min(3, Math.max(0.5, v));
    sc.style.setProperty('--z', z);
    zv.textContent = Math.round(z * 100) + '%';
  };
  host.querySelectorAll('[data-z]').forEach(b => b.onclick = () => {
    const k = b.dataset.z;
    setZ(k === '+' ? z + 0.25 : k === '-' ? z - 0.25 : 1);
  });

  let ticking = false;
  sc.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const mid = sc.scrollTop + sc.clientHeight / 3;
      let cur = 0;
      for (let i = 0; i < pages.length; i++) { if (pages[i].offsetTop <= mid) cur = i; else break; }
      pg.textContent = t('doc.page_of', { n: cur + 1, total: n });
    });
  });

  bindFullscreen(host);

  // Hakuna "hifadhi picha kama" wala kuburuta picha
  host.addEventListener('contextmenu', e => e.preventDefault());
  host.addEventListener('dragstart', e => e.preventDefault());
}
