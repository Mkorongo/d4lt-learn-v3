'use strict';
// Teacher profile: username, phone, bio and social links (edited by the teacher in "Account",
// shown to students on the course page). Uses esc, api, toast, guard, safeUrl, me from app.js / security.js

addStrings({
  en: {
    'prof.title': 'My teacher profile', 'prof.sub': 'Your students see this on every course you teach. All fields except the username are optional.',
    'prof.username': 'Username', 'prof.username_hint': '3-30 characters: a-z, 0-9, dot or underscore. Students will see it as @username.',
    'prof.phone': 'Phone number', 'prof.phone_ph': '+255 7XX XXX XXX', 'prof.bio': 'About me', 'prof.bio_ph': 'Your qualifications, experience and what you teach...',
    'prof.links': 'Social networks and links', 'prof.link_name': 'Name (e.g. LinkedIn)', 'prof.link_url': 'https://...', 'prof.add_link': '+ Add link',
    'prof.remove_link': 'Remove link', 'prof.saved': 'Profile saved', 'prof.save': 'Save profile', 'prof.max_links': 'You can add up to 8 links',
    'prof.banner_title': 'Complete your teacher profile', 'prof.banner_text': 'Add your username, phone number, bio and links so your students know who is teaching them.',
    'prof.banner_btn': 'Complete profile',
    'prof.teacher': 'Your teacher', 'prof.call': 'Call', 'prof.uploaded_by': 'Teacher: {name}',
    'prof.no_username': 'No username yet'
  },
  sw: {
    'prof.title': 'Wasifu wangu wa mwalimu', 'prof.sub': 'Wanafunzi wako wanauona kwenye kila somo unalofundisha. Sehemu zote ni hiari isipokuwa username.',
    'prof.username': 'Username', 'prof.username_hint': 'Herufi 3-30: a-z, 0-9, nukta au mstari chini. Wanafunzi wataiona kama @username.',
    'prof.phone': 'Namba ya simu', 'prof.phone_ph': '+255 7XX XXX XXX', 'prof.bio': 'Kuhusu mimi', 'prof.bio_ph': 'Elimu yako, uzoefu na unachofundisha...',
    'prof.links': 'Mitandao ya kijamii na viungo', 'prof.link_name': 'Jina (mf. LinkedIn)', 'prof.link_url': 'https://...', 'prof.add_link': '+ Ongeza kiungo',
    'prof.remove_link': 'Ondoa kiungo', 'prof.saved': 'Wasifu umehifadhiwa', 'prof.save': 'Hifadhi wasifu', 'prof.max_links': 'Unaweza kuongeza hadi viungo 8',
    'prof.banner_title': 'Kamilisha wasifu wako wa mwalimu', 'prof.banner_text': 'Weka username, namba ya simu, bio na viungo vyako ili wanafunzi wajue nani anawafundisha.',
    'prof.banner_btn': 'Kamilisha wasifu',
    'prof.teacher': 'Mwalimu wako', 'prof.call': 'Piga simu', 'prof.uploaded_by': 'Mwalimu: {name}',
    'prof.no_username': 'Bado hana username'
  }
});

const SOCIAL = ['LinkedIn', 'X (Twitter)', 'Facebook', 'Instagram', 'GitHub', 'YouTube', 'TikTok', 'WhatsApp', 'Website'];
const initials = n => String(n || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();

// ---------- What students see ----------
function teacherCardHTML(tc) {
  if (!tc) return '';
  const links = (tc.links || []).map(l => `<a class="btn ghost sm" href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a>`).join('');
  const phone = tc.phone ? `<a class="btn ghost sm" href="tel:${esc(tc.phone.replace(/[^\d+]/g, ''))}">${ico('phone')} ${esc(tc.phone)}</a>` : '';
  return `<section class="tcard" aria-label="${t('prof.teacher')}">
    <div class="tav" aria-hidden="true">${esc(initials(tc.name))}</div>
    <div class="tinfo">
      <small class="muted">${t('prof.teacher')}</small>
      <h3>${esc(tc.name)}${tc.username ? ` <span class="tuser">@${esc(tc.username)}</span>` : ''}</h3>
      ${tc.bio ? `<p class="tbio">${esc(tc.bio)}</p>` : ''}
      ${phone || links ? `<div class="tlinks">${phone}${links}</div>` : ''}
    </div></section>`;
}

// ---------- The teacher's own form (Account page) ----------
function profilePanelHTML() {
  return `<section class="panel" style="max-width:640px" id="profpanel"><h2>${t('prof.title')}</h2>
    <p class="muted">${t('prof.sub')}</p>
    <form id="proff" novalidate>
      <div id="proferr"></div>
      <div class="field"><label for="pf_user">${t('prof.username')}</label><input id="pf_user" type="text" maxlength="30" autocomplete="username" autocapitalize="none" spellcheck="false"><small class="muted">${t('prof.username_hint')}</small></div>
      <div class="field"><label for="pf_phone">${t('prof.phone')}</label><input id="pf_phone" type="text" maxlength="20" inputmode="tel" placeholder="${esc(t('prof.phone_ph'))}"></div>
      <div class="field"><label for="pf_bio">${t('prof.bio')}</label><textarea id="pf_bio" maxlength="600" placeholder="${esc(t('prof.bio_ph'))}"></textarea></div>
      <div class="field"><label>${t('prof.links')}</label><div id="pf_links"></div>
        <button type="button" class="btn ghost sm" id="pf_add">${t('prof.add_link')}</button></div>
      <datalist id="pf_social">${SOCIAL.map(x => `<option value="${esc(x)}">`).join('')}</datalist>
      <button class="btn">${t('prof.save')}</button>
    </form></section>`;
}

async function bindProfilePanel() {
  const form = document.getElementById('proff');
  if (!form) return;
  const rows = document.getElementById('pf_links');
  const addRow = (l = { label: '', url: '' }) => {
    if (rows.children.length >= 8) return toast(t('prof.max_links'), true);
    const d = document.createElement('div');
    d.className = 'erow';
    d.innerHTML = `<input type="text" data-ll list="pf_social" maxlength="30" placeholder="${esc(t('prof.link_name'))}" value="${esc(l.label)}" style="max-width:190px">
      <input type="url" data-lu maxlength="300" placeholder="${esc(t('prof.link_url'))}" value="${esc(l.url)}">
      <button type="button" class="btn ghost sm" data-rl aria-label="${t('prof.remove_link')}">×</button>`;
    d.querySelector('[data-rl]').onclick = () => d.remove();
    rows.appendChild(d);
  };
  document.getElementById('pf_add').onclick = () => addRow();
  try {
    const p = await api('/api/me/profile');
    pf_user.value = p.username; pf_phone.value = p.phone; pf_bio.value = p.bio;
    p.links.forEach(addRow);
  } catch (e) { toast(e.message, true); }
  form.onsubmit = async e => {
    e.preventDefault();
    const links = [...rows.children].map(r => ({ label: r.querySelector('[data-ll]').value, url: r.querySelector('[data-lu]').value }));
    try {
      await api('/api/me/profile', { method: 'PUT', body: { username: pf_user.value, phone: pf_phone.value, bio: pf_bio.value, links } });
      document.getElementById('proferr').innerHTML = '';
      me = await api('/api/me');
      toast(t('prof.saved'));
    } catch (er) { document.getElementById('proferr').innerHTML = `<div class="err">${esc(er.message)}</div>`; }
  };
}

// Shown on a teacher's dashboard until a username exists
const profileBannerHTML = () => (me.role === 'teacher' && !me.username)
  ? `<div class="join" style="align-items:center"><div><h2>${t('prof.banner_title')}</h2><p>${t('prof.banner_text')}</p></div><a class="btn sun" href="#/account">${t('prof.banner_btn')}</a></div>` : '';
