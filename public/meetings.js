'use strict';
// Live meetings and notifications. Uses esc, api, modal, toast, guard, confirmBox, shell, ico, me from app.js; t/addStrings from i18n.js

addStrings({
  en: {
    'meet.until_m': '{m} min', 'meet.until_h': '{h} h', 'meet.until_hm': '{h} h {r} min', 'meet.until_d': '{d} d', 'meet.until_dh': '{d} d {h} h',
    'meet.live_now': '● LIVE now', 'meet.starts_in': 'Starts in {t}', 'meet.ended_rec': 'Ended · has recording', 'meet.ended': 'Ended',
    'meet.join': 'Join meeting', 'meet.join_hint': 'The button unlocks when the meeting starts.',
    'meet.watch_recorded': 'Watch recorded meeting', 'meet.is_over': 'Meeting has ended', 'meet.no_rec_yet': 'The teacher hasn\'t uploaded a recording yet.',
    'meet.open_meeting': 'Open meeting', 'meet.open_link': 'Open link', 'meet.edit': 'Change time / details',
    'meet.change_rec': 'Replace recording', 'meet.upload_rec': 'Upload recording', 'meet.watch_rec': 'Watch recording',
    'meet.link': 'Link:', 'meet.passcode': 'Passcode:',
    'meet.heading': 'Live meetings',
    'meet.sub_manage': 'Schedule a meeting; students get a notification and a reminder 30 minutes before.',
    'meet.sub_student': 'Live classes for this lesson.',
    'meet.new': '+ New meeting', 'meet.none': 'No meetings yet',
    'meet.none_manage': 'Click "New meeting" to schedule a live class.',
    'meet.none_student': 'When the teacher schedules a meeting you\'ll get a notification here.',
    'meet.past': 'Past meetings',
    'meet.confirm_del_ended': 'Delete "{title}" and its recording?',
    'meet.confirm_del': 'Delete "{title}"? All students will be notified that the meeting was cancelled.',
    'meet.deleted': 'Meeting deleted',
    'meet.form_edit': 'Change meeting', 'meet.form_new': 'New meeting',
    'meet.f_title': 'Meeting title', 'meet.f_title_ph': 'e.g. Live class: Parts of a computer',
    'meet.f_link': 'Meeting link (Zoom, Google Meet, Teams...)', 'meet.f_passcode': 'Passcode (if any)',
    'meet.f_start': 'Starts', 'meet.f_end': 'Ends', 'meet.f_desc': 'Description (optional)',
    'meet.f_time_note': 'If you change the time, all students will be notified of the new time.',
    'meet.f_save': 'Save changes', 'meet.f_schedule': 'Schedule meeting',
    'meet.err_dates': 'Enter a date and time', 'meet.err_order': 'The end time must be after the start time',
    'meet.saved_updated': 'Meeting updated, students notified', 'meet.saved_new': 'Meeting scheduled, students notified',
    'meet.passcode_is': 'Meeting passcode:', 'meet.no_passcode': 'This meeting has no passcode.',
    'meet.copy_passcode': 'Copy passcode', 'meet.passcode_copied': 'Passcode copied', 'meet.copy_manual': 'Copy the passcode manually',
    'meet.upload_title': 'Upload recording', 'meet.upload_hint': '{title} · an MP4 video (H.264/AAC) plays on all devices.',
    'meet.upload': 'Upload', 'meet.uploading': 'Uploading...', 'meet.upload_fail': 'Upload failed', 'meet.network_lost': 'Network connection lost',
    'meet.rec_uploaded': 'Recording uploaded, students notified',
    'notif.created': 'New meeting', 'notif.reminder': 'Reminder', 'notif.rescheduled': 'Time changed', 'notif.updated': 'Updated',
    'notif.cancelled': 'Cancelled', 'notif.recording': 'Recording', 'notif.generic': 'Notification',
    'notif.heading': 'Notifications', 'notif.sub': 'New meetings, reminders and time changes.',
    'notif.enable_browser': 'Enable browser notifications', 'notif.mark_all': 'Mark all as read',
    'notif.none': 'No notifications yet', 'notif.none_hint': 'You\'ll get notifications here when a teacher schedules a meeting.'
  },
  sw: {
    'meet.until_m': 'dakika {m}', 'meet.until_h': 'saa {h}', 'meet.until_hm': 'saa {h} na dakika {r}', 'meet.until_d': 'siku {d}', 'meet.until_dh': 'siku {d} na saa {h}',
    'meet.live_now': '● LIVE sasa', 'meet.starts_in': 'Inaanza baada ya {t}', 'meet.ended_rec': 'Imeisha · ina recording', 'meet.ended': 'Imeisha',
    'meet.join': 'Jiunge na meeting', 'meet.join_hint': 'Kitufe kitafunguka muda wa meeting ukifika.',
    'meet.watch_recorded': 'Angalia recorded meeting', 'meet.is_over': 'Meeting imeisha', 'meet.no_rec_yet': 'Mwalimu bado hajapakia recording.',
    'meet.open_meeting': 'Fungua meeting', 'meet.open_link': 'Fungua kiungo', 'meet.edit': 'Badilisha muda / taarifa',
    'meet.change_rec': 'Badilisha recording', 'meet.upload_rec': 'Pakia recording', 'meet.watch_rec': 'Angalia recording',
    'meet.link': 'Kiungo:', 'meet.passcode': 'Passcode:',
    'meet.heading': 'Meetings za live',
    'meet.sub_manage': 'Panga meeting, wanafunzi wanapata arifa na kikumbusho dakika 30 kabla.',
    'meet.sub_student': 'Madarasa ya moja kwa moja ya somo hili.',
    'meet.new': '+ Meeting mpya', 'meet.none': 'Hakuna meeting bado',
    'meet.none_manage': 'Bofya "Meeting mpya" kupanga darasa la live.',
    'meet.none_student': 'Mwalimu akipanga meeting utapata arifa hapa.',
    'meet.past': 'Zilizopita',
    'meet.confirm_del_ended': 'Futa "{title}" na recording yake?',
    'meet.confirm_del': 'Futa "{title}"? Wanafunzi wote watapata arifa kwamba meeting imefutwa.',
    'meet.deleted': 'Meeting imefutwa',
    'meet.form_edit': 'Badilisha meeting', 'meet.form_new': 'Meeting mpya',
    'meet.f_title': 'Kichwa cha meeting', 'meet.f_title_ph': 'mf. Darasa la live: Sehemu za kompyuta',
    'meet.f_link': 'Kiungo cha meeting (Zoom, Google Meet, Teams...)', 'meet.f_passcode': 'Passcode (kama ipo)',
    'meet.f_start': 'Inaanza', 'meet.f_end': 'Inaisha', 'meet.f_desc': 'Maelezo (hiari)',
    'meet.f_time_note': 'Ukibadilisha muda, wanafunzi wote watapata arifa ya muda mpya.',
    'meet.f_save': 'Hifadhi mabadiliko', 'meet.f_schedule': 'Panga meeting',
    'meet.err_dates': 'Weka tarehe na muda', 'meet.err_order': 'Muda wa kuisha lazima uwe baada ya muda wa kuanza',
    'meet.saved_updated': 'Meeting imesasishwa, wanafunzi wamearifiwa', 'meet.saved_new': 'Meeting imepangwa, wanafunzi wamearifiwa',
    'meet.passcode_is': 'Passcode ya meeting:', 'meet.no_passcode': 'Meeting hii haina passcode.',
    'meet.copy_passcode': 'Nakili passcode', 'meet.passcode_copied': 'Passcode imenakiliwa', 'meet.copy_manual': 'Nakili passcode wewe mwenyewe',
    'meet.upload_title': 'Pakia recording', 'meet.upload_hint': '{title} · video ya MP4 (H.264/AAC) inacheza kwenye vifaa vyote.',
    'meet.upload': 'Pakia', 'meet.uploading': 'Inapakia...', 'meet.upload_fail': 'Imeshindwa kupakia', 'meet.network_lost': 'Mtandao umekatika',
    'meet.rec_uploaded': 'Recording imepakiwa, wanafunzi wamearifiwa',
    'notif.created': 'Meeting mpya', 'notif.reminder': 'Kikumbusho', 'notif.rescheduled': 'Muda umebadilika', 'notif.updated': 'Imesasishwa',
    'notif.cancelled': 'Imefutwa', 'notif.recording': 'Recording', 'notif.generic': 'Arifa',
    'notif.heading': 'Arifa', 'notif.sub': 'Meeting mpya, vikumbusho na mabadiliko ya muda.',
    'notif.enable_browser': 'Washa arifa za kivinjari', 'notif.mark_all': 'Weka zote kama zimesomwa',
    'notif.none': 'Hakuna arifa bado', 'notif.none_hint': 'Utapata arifa hapa mwalimu akipanga meeting.'
  }
});

// ---------- Time ----------
function fmtDT(iso) {
  const d = new Date(iso);
  try {
    return new Intl.DateTimeFormat(locale(), { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
  } catch { return d.toLocaleString(); }
}
function fmtClock(iso) {
  return new Date(iso).toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit', hour12: false });
}
// ISO (UTC) -> value for <input type="datetime-local"> in device time
function toLocalInput(iso) {
  const d = new Date(iso), p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
function untilText(ms) {
  const m = Math.max(1, Math.ceil(ms / 60000));
  if (m < 60) return t('meet.until_m', { m });
  const h = Math.floor(m / 60), r = m % 60;
  if (h < 24) return r ? t('meet.until_hm', { h, r }) : t('meet.until_h', { h });
  const d = Math.floor(h / 24);
  return h % 24 ? t('meet.until_dh', { d, h: h % 24 }) : t('meet.until_d', { d });
}

// ---------- Meetings list inside a course ----------
let meetTimer = null;

async function drawMeetings(courseId, manage) {
  const host = document.getElementById('meetings');
  if (!host) return;
  const data = await api(`/api/courses/${courseId}/meetings`);
  const offset = data.now - Date.now();          // difference between server clock and device clock
  const list = data.meetings;

  // State is computed with the server clock, and the server verifies again on click
  const stateOf = m => {
    const now = Date.now() + offset;
    if (now < Date.parse(m.start_at)) return 'upcoming';
    if (now < Date.parse(m.end_at)) return 'live';
    return 'ended';
  };

  function card(m) {
    const st = stateOf(m);
    const now = Date.now() + offset;
    const badge = st === 'live' ? `<span class="badge live">${t('meet.live_now')}</span>`
      : st === 'upcoming' ? `<span class="badge soon">${t('meet.starts_in', { t: untilText(Date.parse(m.start_at) - now) })}</span>`
      : m.has_recording ? `<span class="badge ok">${t('meet.ended_rec')}</span>` : `<span class="badge no">${t('meet.ended')}</span>`;

    let acts = '';
    if (!manage) {
      if (st === 'live') acts = `<button class="btn sun" data-join="${m.id}">${t('meet.join')}</button>`;
      else if (st === 'upcoming') acts = `<button class="btn" disabled>${t('meet.join')}</button><small class="muted">${t('meet.join_hint')}</small>`;
      else if (m.has_recording) acts = `<button class="btn" data-rec="${m.id}">${t('meet.watch_recorded')}</button>`;
      else acts = `<button class="btn" disabled>${t('meet.is_over')}</button><small class="muted">${t('meet.no_rec_yet')}</small>`;
    } else {
      acts = `<a class="btn ${st === 'live' ? 'sun' : 'ghost'} sm" href="${esc(safeUrl(m.link))}" target="_blank" rel="noopener">${st === 'live' ? t('meet.open_meeting') : t('meet.open_link')}</a>`;
      if (st !== 'ended') acts += `<button class="btn ghost sm" data-edit="${m.id}">${t('meet.edit')}</button>`;
      if (st === 'ended') acts += `<button class="btn ${m.has_recording ? 'ghost' : ''} sm" data-up="${m.id}">${m.has_recording ? t('meet.change_rec') : t('meet.upload_rec')}</button>`;
      if (m.has_recording) acts += `<button class="btn ghost sm" data-rec="${m.id}">${t('meet.watch_rec')}</button>`;
      acts += `<button class="btn danger sm" data-del="${m.id}">${t('common.delete')}</button>`;
    }
    return `<article class="meet ${st}" data-mid="${m.id}">
      <div class="meet-main">
        <div class="meet-top"><h3>${esc(m.title)}</h3>${badge}</div>
        <p class="meet-time">${esc(fmtDT(m.start_at))} – ${esc(fmtClock(m.end_at))}</p>
        ${m.description ? `<p class="muted" style="margin:0 0 .4rem">${esc(m.description)}</p>` : ''}
        ${manage ? `<p class="meet-link"><small class="muted">${t('meet.link')} ${esc(m.link)}${m.passcode ? ` · ${t('meet.passcode')} <b>${esc(m.passcode)}</b>` : ''}</small></p>` : ''}
      </div>
      <div class="meet-acts">${acts}</div>
    </article>`;
  }

  function paint() {
    const upcoming = list.filter(m => stateOf(m) !== 'ended').sort((a, b) => Date.parse(a.start_at) - Date.parse(b.start_at));
    const past = list.filter(m => stateOf(m) === 'ended');
    host.innerHTML = `<section class="panel meetings">
      <div class="page-head" style="margin-bottom:.8rem"><div><h2 style="margin:0">${t('meet.heading')}</h2>
        <p class="muted" style="margin:0">${manage ? t('meet.sub_manage') : t('meet.sub_student')}</p></div>
        ${manage ? `<button class="btn" id="newmeet">${t('meet.new')}</button>` : ''}</div>
      ${list.length ? '' : `<div class="empty"><b>${t('meet.none')}</b>${manage ? t('meet.none_manage') : t('meet.none_student')}</div>`}
      ${upcoming.length ? `<div class="meet-list">${upcoming.map(card).join('')}</div>` : ''}
      ${past.length ? `<h3 style="margin:1.1rem 0 .5rem">${t('meet.past')}</h3><div class="meet-list">${past.map(card).join('')}</div>` : ''}
    </section>`;
    bind();
  }

  const find = id => list.find(m => m.id === +id);
  const refresh = () => drawMeetings(courseId, manage);

  function bind() {
    const nm = document.getElementById('newmeet');
    if (nm) nm.onclick = () => meetingForm(courseId, null, refresh);
    host.querySelectorAll('[data-join]').forEach(b => b.onclick = guard(async () => {
      b.disabled = true;
      try {
        const r = await api(`/api/meetings/${b.dataset.join}/join`, { method: 'POST' });
        joinModal(find(b.dataset.join), r);
      } finally { b.disabled = false; }
    }));
    host.querySelectorAll('[data-rec]').forEach(b => b.onclick = () => recordingModal(find(b.dataset.rec)));
    host.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => meetingForm(courseId, find(b.dataset.edit), refresh));
    host.querySelectorAll('[data-up]').forEach(b => b.onclick = () => uploadRecording(find(b.dataset.up), refresh));
    host.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
      const m = find(b.dataset.del);
      const msg = stateOf(m) === 'ended' ? t('meet.confirm_del_ended', { title: m.title }) : t('meet.confirm_del', { title: m.title });
      confirmBox(msg, async () => { await api('/api/meetings/' + m.id, { method: 'DELETE' }); toast(t('meet.deleted')); refresh(); });
    });
  }

  paint();

  // Every 15s: if the state of any meeting changed (e.g. started or ended), redraw
  clearInterval(meetTimer);
  const snapshot = () => list.map(stateOf).join(',');
  let last = snapshot();
  let lastLang = getLang();
  meetTimer = setInterval(() => {
    if (!document.body.contains(host) || document.querySelector('.overlay')) return;
    const now = snapshot();
    if (now !== last || lastLang !== getLang()) { last = now; lastLang = getLang(); paint(); }
    else host.querySelectorAll('.badge.soon').forEach((el, i) => {
      const up = list.filter(m => stateOf(m) === 'upcoming').sort((a, b) => Date.parse(a.start_at) - Date.parse(b.start_at))[i];
      if (up) el.textContent = t('meet.starts_in', { t: untilText(Date.parse(up.start_at) - (Date.now() + offset)) });
    });
  }, 15000);
}

// ---------- Form to schedule / change a meeting ----------
function meetingForm(courseId, m, done) {
  const now = new Date();
  const start = m ? toLocalInput(m.start_at) : toLocalInput(new Date(Math.ceil((now.getTime() + 3600e3) / 36e5) * 36e5));
  const end = m ? toLocalInput(m.end_at) : toLocalInput(new Date(Math.ceil((now.getTime() + 3600e3) / 36e5) * 36e5 + 3600e3));
  const o = modal(`<h2>${m ? t('meet.form_edit') : t('meet.form_new')}</h2>
    <form id="mf">
      <div class="field"><label for="mt">${t('meet.f_title')}</label><input id="mt" type="text" required value="${esc(m ? m.title : '')}" placeholder="${t('meet.f_title_ph')}"></div>
      <div class="field"><label for="ml">${t('meet.f_link')}</label><input id="ml" type="url" required value="${esc(m ? m.link : '')}" placeholder="https://"></div>
      <div class="field"><label for="mp">${t('meet.f_passcode')}</label><input id="mp" type="text" autocomplete="off" value="${esc(m ? m.passcode : '')}"></div>
      <div class="two" style="gap:.8rem">
        <div class="field"><label for="ms">${t('meet.f_start')}</label><input id="ms" type="datetime-local" required value="${start}"></div>
        <div class="field"><label for="me2">${t('meet.f_end')}</label><input id="me2" type="datetime-local" required value="${end}"></div>
      </div>
      <div class="field"><label for="md">${t('meet.f_desc')}</label><textarea id="md" style="min-height:64px">${esc(m ? m.description : '')}</textarea></div>
      ${m ? `<p class="muted" style="font-size:.9rem">${t('meet.f_time_note')}</p>` : ''}
      <div class="row"><button type="button" class="btn ghost" data-x>${t('common.cancel')}</button><button class="btn">${m ? t('meet.f_save') : t('meet.f_schedule')}</button></div>
    </form>`);
  o.querySelector('[data-x]').onclick = () => o.remove();
  o.querySelector('#mf').onsubmit = guard(async e => {
    e.preventDefault();
    const s = new Date(o.querySelector('#ms').value), en = new Date(o.querySelector('#me2').value);
    if (isNaN(s) || isNaN(en)) throw new Error(t('meet.err_dates'));
    if (en <= s) throw new Error(t('meet.err_order'));
    const body = {
      title: o.querySelector('#mt').value, link: o.querySelector('#ml').value, passcode: o.querySelector('#mp').value,
      description: o.querySelector('#md').value, start_at: s.toISOString(), end_at: en.toISOString()
    };
    if (m) await api('/api/meetings/' + m.id, { method: 'PUT', body });
    else await api(`/api/courses/${courseId}/meetings`, { method: 'POST', body });
    o.remove(); toast(m ? t('meet.saved_updated') : t('meet.saved_new')); done();
  });
}

// ---------- Joining: passcode + link ----------
function joinModal(m, r) {
  const o = modal(`<h2>${esc(m.title)}</h2>
    ${r.passcode ? `<p>${t('meet.passcode_is')}</p><div class="code" style="margin-bottom:1rem" id="pcode">${esc(r.passcode)}</div>` : `<p class="muted">${t('meet.no_passcode')}</p>`}
    <div class="row" style="justify-content:flex-start;flex-wrap:wrap">
      <a class="btn sun" href="${esc(safeUrl(r.link))}" target="_blank" rel="noopener" data-go>${t('meet.open_meeting')}</a>
      ${r.passcode ? `<button class="btn ghost" data-copy>${t('meet.copy_passcode')}</button>` : ''}
      <button class="btn ghost" data-x>${t('common.close')}</button>
    </div>`);
  o.querySelector('[data-x]').onclick = () => o.remove();
  const cp = o.querySelector('[data-copy]');
  if (cp) cp.onclick = async () => {
    try { await navigator.clipboard.writeText(r.passcode); toast(t('meet.passcode_copied')); } catch { toast(t('meet.copy_manual'), true); }
  };
}

// ---------- Watching a recording ----------
function recordingModal(m) {
  const o = modal(`<h2>${esc(m.title)}</h2>
    <p class="muted">${esc(fmtDT(m.start_at))}</p>
    <video controls playsinline preload="metadata" controlslist="nodownload" src="/meeting-files/${m.id}" style="width:100%;max-height:70vh;background:#000;border-radius:12px"></video>
    <div class="row"><button class="btn ghost" data-x>${t('common.close')}</button></div>`, 'wide');
  o.querySelector('[data-x]').onclick = () => { o.querySelector('video').pause(); o.remove(); };
}

// ---------- Uploading a recording (teacher) ----------
function uploadRecording(m, done) {
  const o = modal(`<h2>${t('meet.upload_title')}</h2>
    <p class="muted">${t('meet.upload_hint', { title: esc(m.title) })}</p>
    <form id="rf">
      <div class="field"><div class="drop"><input id="rfile" type="file" accept=".mp4,.webm,.mov,.m4v,video/*" required></div></div>
      <div class="prog hidden" id="rpg"><i></i></div>
      <div class="row"><button type="button" class="btn ghost" data-x>${t('common.cancel')}</button><button class="btn" id="rsub">${t('meet.upload')}</button></div>
    </form>`, '', true);
  o.querySelector('[data-x]').onclick = () => o.remove();
  o.querySelector('#rf').onsubmit = e => {
    e.preventDefault();
    const f = o.querySelector('#rfile').files[0];
    if (!f) return;
    const fd = new FormData(); fd.append('file', f);
    const pg = o.querySelector('#rpg'), bar = pg.querySelector('i'), btn = o.querySelector('#rsub');
    pg.classList.remove('hidden'); btn.disabled = true; btn.textContent = t('meet.uploading');
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = ev => { if (ev.lengthComputable) bar.style.width = (100 * ev.loaded / ev.total) + '%'; };
    xhr.onload = () => {
      let r = {}; try { r = JSON.parse(xhr.responseText); } catch {}
      if (xhr.status === 200) { o.remove(); toast(t('meet.rec_uploaded')); done(); }
      else { toast(r.error || t('meet.upload_fail'), true); btn.disabled = false; btn.textContent = t('meet.upload'); pg.classList.add('hidden'); }
    };
    xhr.onerror = () => { toast(t('meet.network_lost'), true); btn.disabled = false; btn.textContent = t('meet.upload'); };
    xhr.open('POST', `/api/meetings/${m.id}/recording`);
    const h = LANG_HEADERS(); for (const k in h) xhr.setRequestHeader(k, h[k]);
    xhr.send(fd);
  };
}

// ================= NOTIFICATIONS =================
const KIND = () => ({ created: t('notif.created'), reminder: t('notif.reminder'), rescheduled: t('notif.rescheduled'), updated: t('notif.updated'), cancelled: t('notif.cancelled'), recording: t('notif.recording') });
let notif = { unread: 0, items: [] };
let lastSeenNotif = null;   // id of the last notification we saw (null = not loaded the first time yet)
let notifPoller = null;

function updateBadge() {
  document.querySelectorAll('.nbadge').forEach(el => {
    el.textContent = notif.unread > 99 ? '99+' : notif.unread;
    el.classList.toggle('hidden', !notif.unread);
  });
}

async function pollNotifications(quiet) {
  if (!me) return;
  let d;
  try { d = await api('/api/notifications'); } catch { return; }
  const maxId = d.items.length ? d.items[0].id : 0;
  if (lastSeenNotif === null) lastSeenNotif = maxId;       // first time: don't show toasts for old ones
  const fresh = d.items.filter(n => n.id > lastSeenNotif && !n.read_at).reverse();
  lastSeenNotif = Math.max(lastSeenNotif, maxId);
  notif = d;
  updateBadge();
  fresh.forEach(n => {
    toast(`${n.title} — ${n.body}`.slice(0, 160));
    if ('Notification' in window && Notification.permission === 'granted') {
      try { new Notification(n.title, { body: n.body }); } catch {}
    }
  });
  if (!quiet && fresh.length && location.hash === '#/notifications') notificationsView();
  // When a meeting is added/changed while a student is inside the course, refresh the list
  if (fresh.some(n => n.meeting_id !== undefined) && /^#\/course\//.test(location.hash) && !document.querySelector('.overlay')) {
    const id = +location.hash.split('/')[2];
    if (document.getElementById('meetings') && me) drawMeetings(id, me.role !== 'student').catch(() => {});
  }
}

function startNotifPolling() {
  if (notifPoller) return;
  pollNotifications();
  notifPoller = setInterval(() => pollNotifications(), 20000);
}
function resetNotifications() { notif = { unread: 0, items: [] }; lastSeenNotif = null; updateBadge(); }

async function notificationsView() {
  await pollNotifications(true);
  const canPush = 'Notification' in window && Notification.permission === 'default';
  shell('#/notifications', `
    <div class="page-head"><div><h1>${t('notif.heading')}</h1><p class="muted">${t('notif.sub')}</p></div>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap">
        ${canPush ? `<button class="btn ghost" id="npush">${t('notif.enable_browser')}</button>` : ''}
        ${notif.unread ? `<button class="btn ghost" id="nread">${t('notif.mark_all')}</button>` : ''}
      </div></div>
    ${notif.items.length ? `<div class="nlist">${notif.items.map(n => `
      <a class="nitem ${n.read_at ? '' : 'unread'}" href="${n.course_id ? '#/course/' + n.course_id : '#/'}" data-nid="${n.id}">
        <span class="nkind ${esc(n.kind)}">${esc(KIND()[n.kind] || t('notif.generic'))}</span>
        <b>${esc(n.title)}</b>
        <span class="muted">${esc(n.body)}</span>
        <small class="muted">${esc(fmtDT(n.created_at))}</small>
      </a>`).join('')}</div>`
      : `<div class="empty"><b>${t('notif.none')}</b>${t('notif.none_hint')}</div>`}`);
  const rd = document.getElementById('nread');
  if (rd) rd.onclick = guard(async () => { await api('/api/notifications/read', { method: 'POST', body: {} }); await notificationsView(); });
  const ps = document.getElementById('npush');
  if (ps) ps.onclick = async () => { await Notification.requestPermission(); notificationsView(); };
  document.querySelectorAll('[data-nid]').forEach(a => a.addEventListener('click', () => {
    api('/api/notifications/read', { method: 'POST', body: { id: +a.dataset.nid } }).then(pollNotifications).catch(() => {});
  }));
}
