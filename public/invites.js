'use strict';
// Code za kujiunga za kila mwanafunzi. Inatumia esc, api, toast, guard, confirmBox, fmtDT kutoka app.js/meetings.js

addStrings({
  en: {
    'inv.st_active': 'Not used', 'inv.st_used': 'Used', 'inv.st_expired': 'Expired', 'inv.st_revoked': 'Revoked', 'inv.st_removed': 'Removed',
    'inv.copied': 'Copied', 'inv.copy_manually': 'Copy it manually', 'inv.code_copied': 'Code copied', 'inv.all_copied': 'All codes copied',
    'inv.new_codes': 'New codes ({n})', 'inv.give_each': 'Give each student their own code. Each code can be used once only.',
    'inv.col_student': 'Student', 'inv.col_code': 'Code', 'inv.copy_all': 'Copy all', 'inv.csv': 'Download CSV',
    'inv.title': 'Join codes (one per student)',
    'inv.intro': 'Type the students\' names, one per line. Each one gets their own code, usable once and tied to their name. To remove a student, click "Remove from class": their code is revoked and they cannot return without a new code.',
    'inv.names_label': 'Student names', 'inv.names_ph': 'Asha Juma\nJohn Peter', 'inv.expires_after': 'Code expires after',
    'inv.days': '{n} days', 'inv.generate': 'Generate codes',
    'inv.all_codes': 'All codes ({n})', 'inv.col_name': 'Student name', 'inv.col_status': 'Status', 'inv.col_account': 'Account that used it',
    'inv.until': ' until {date}', 'inv.copy': 'Copy', 'inv.revoke': 'Revoke code', 'inv.remove': 'Remove from class',
    'inv.none': 'No codes yet', 'inv.none_sub': 'Add student names above, then click "Generate codes".',
    'inv.need_name': 'Enter at least one student name', 'inv.created': '{n} codes created',
    'inv.confirm_remove': 'Remove "{name}" from the class? Their code will be revoked and they will not be able to return without a new code from you.',
    'inv.confirm_revoke': 'Revoke the code for "{name}"? It will no longer be usable.',
    'inv.removed_toast': 'Student removed from class', 'inv.revoked_toast': 'Code revoked',
    'inv.csv_header': 'Name,Code', 'inv.csv_file': 'student-codes.csv',
    'inv.st_full': 'Full', 'inv.free_h': 'Free class', 'inv.free_p': 'Anyone can join this class in one click and all material is free, so no codes or tokens are needed. Change the class to VIP to use codes.',
    'inv.bulk_h': 'Bulk token (one code for many students)', 'inv.bulk_intro': 'One token that a limited number of students can use. When the limit is reached, students who try it see your message.',
    'inv.bulk_label': 'Name (e.g. Form Two group)', 'inv.bulk_cap': 'Number of people', 'inv.bulk_msg': 'Message when the token is full',
    'inv.bulk_msg_ph': 'This token is full. Contact the admin for a new one.', 'inv.bulk_make': 'Create token', 'inv.bulk_created': 'Token {code} created',
    'inv.bulk_need_cap': 'Enter the number of people (2 or more)', 'inv.used_of': '{used} / {max} used', 'inv.members': 'Joined: {names}',
    'inv.confirm_bulk': 'Revoke the token "{name}"? No one else will be able to use it. Students who already joined keep access.',
    'inv.bulk_list': 'Bulk tokens ({n})', 'inv.bulk_msg_label': 'Message when full:'
  },
  sw: {
    'inv.st_active': 'Haijatumika', 'inv.st_used': 'Imetumika', 'inv.st_expired': 'Imeisha muda', 'inv.st_revoked': 'Imefutwa', 'inv.st_removed': 'Ameondolewa',
    'inv.copied': 'Imenakiliwa', 'inv.copy_manually': 'Nakili mwenyewe', 'inv.code_copied': 'Code imenakiliwa', 'inv.all_copied': 'Code zote zimenakiliwa',
    'inv.new_codes': 'Code mpya ({n})', 'inv.give_each': 'Mpe kila mwanafunzi code yake peke yake. Kila code inatumika mara moja tu.',
    'inv.col_student': 'Mwanafunzi', 'inv.col_code': 'Code', 'inv.copy_all': 'Nakili zote', 'inv.csv': 'Pakua CSV',
    'inv.title': 'Code za kujiunga (kila mwanafunzi ana yake)',
    'inv.intro': 'Andika majina ya wanafunzi, mmoja kwa kila mstari. Kila mmoja anapata code yake, inayotumika mara moja na inayokumbuka jina lake. Ukitaka kumtoa mwanafunzi, bofya "Mtoe darasani": code yake inakufa na hawezi kurudi bila code mpya.',
    'inv.names_label': 'Majina ya wanafunzi', 'inv.names_ph': 'Asha Juma\nJohn Peter', 'inv.expires_after': 'Code inaisha baada ya',
    'inv.days': 'Siku {n}', 'inv.generate': 'Tengeneza code',
    'inv.all_codes': 'Code zote ({n})', 'inv.col_name': 'Jina la mwanafunzi', 'inv.col_status': 'Hali', 'inv.col_account': 'Akaunti iliyotumia',
    'inv.until': ' hadi {date}', 'inv.copy': 'Nakili', 'inv.revoke': 'Futa code', 'inv.remove': 'Mtoe darasani',
    'inv.none': 'Hakuna code bado', 'inv.none_sub': 'Weka majina ya wanafunzi hapo juu kisha bofya "Tengeneza code".',
    'inv.need_name': 'Weka angalau jina moja la mwanafunzi', 'inv.created': 'Code {n} zimetengenezwa',
    'inv.confirm_remove': 'Mtoe "{name}" darasani? Code yake itafutwa na hataweza kurudi bila code mpya kutoka kwako.',
    'inv.confirm_revoke': 'Futa code ya "{name}"? Haitaweza kutumika tena.',
    'inv.removed_toast': 'Mwanafunzi ametolewa darasani', 'inv.revoked_toast': 'Code imefutwa',
    'inv.csv_header': 'Jina,Code', 'inv.csv_file': 'code-za-wanafunzi.csv',
    'inv.st_full': 'Imejaa', 'inv.free_h': 'Darasa la bure', 'inv.free_p': 'Yeyote anaweza kujiunga na darasa hili kwa kubofya mara moja na material yote ni bure, hivyo hakuna code wala token. Badilisha darasa kuwa VIP ili kutumia code.',
    'inv.bulk_h': 'Token ya kundi (code moja kwa wanafunzi wengi)', 'inv.bulk_intro': 'Token moja ambayo idadi maalum ya wanafunzi wanaweza kuitumia. Idadi ikifikiwa, wanaojaribu wataona ujumbe wako.',
    'inv.bulk_label': 'Jina (mf. Kundi la Form Two)', 'inv.bulk_cap': 'Idadi ya watu', 'inv.bulk_msg': 'Ujumbe token ikijaa',
    'inv.bulk_msg_ph': 'Token hii imejaa. Wasiliana na admin kupata mpya.', 'inv.bulk_make': 'Tengeneza token', 'inv.bulk_created': 'Token {code} imetengenezwa',
    'inv.bulk_need_cap': 'Weka idadi ya watu (2 au zaidi)', 'inv.used_of': '{used} / {max} wametumia', 'inv.members': 'Waliojiunga: {names}',
    'inv.confirm_bulk': 'Futa token "{name}"? Hakuna mwingine atakayeweza kuitumia. Wanafunzi waliojiunga tayari wanabaki darasani.',
    'inv.bulk_list': 'Token za kundi ({n})', 'inv.bulk_msg_label': 'Ujumbe ikijaa:'
  }
});

const fmtCode = c => { c = String(c || ''); return c.length === 8 ? c.slice(0, 4) + '-' + c.slice(4) : c; };
const INV_ST = {
  active: ['inv.st_active', 'soon'], used: ['inv.st_used', 'ok'], expired: ['inv.st_expired', 'no'],
  revoked: ['inv.st_revoked', 'no'], removed: ['inv.st_removed', 'no'], full: ['inv.st_full', 'no']
};

async function copyText(text, okMsg) {
  try { await navigator.clipboard.writeText(text); toast(okMsg || t('inv.copied')); } catch { toast(t('inv.copy_manually'), true); }
}
function csvCell(s) {
  s = String(s ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;      // kuzuia formula injection kwenye Excel
  return '"' + s.replace(/"/g, '""') + '"';
}

async function drawInvites(courseId, rerender, fresh, course) {
  const host = document.getElementById('invites');
  if (!host) return;
  if (course && course.access === 'free') {
    host.innerHTML = `<section class="panel"><h2>${t('inv.free_h')}</h2><p class="muted">${t('inv.free_p')}</p></section>`;
    return;
  }
  const all = await api(`/api/courses/${courseId}/invites`);
  const list = all.filter(i => !i.bulk), bulk = all.filter(i => i.bulk);
  const isAdmin = typeof me !== 'undefined' && me && me.role === 'admin';
  const bulkBlock = isAdmin ? `<section class="panel">
    <h2>${t('inv.bulk_h')}</h2><p class="muted">${t('inv.bulk_intro')}</p>
    <form id="bkf">
      <div class="field"><label for="bkl">${t('inv.bulk_label')}</label><input id="bkl" maxlength="80"></div>
      <div class="field" style="max-width:220px"><label for="bkc">${t('inv.bulk_cap')}</label><input type="number" id="bkc" min="2" max="10000" required></div>
      <div class="field"><label for="bkm">${t('inv.bulk_msg')}</label><textarea id="bkm" maxlength="300" placeholder="${esc(t('inv.bulk_msg_ph'))}" style="min-height:64px"></textarea></div>
      <div class="field" style="max-width:260px"><label for="bkd">${t('inv.expires_after')}</label>
        <select id="bkd"><option value="30">${t('inv.days', { n: 30 })}</option><option value="90">${t('inv.days', { n: 90 })}</option><option value="365">${t('inv.days', { n: 365 })}</option></select></div>
      <button class="btn">${t('inv.bulk_make')}</button>
    </form>
    ${bulk.length ? `<h3 style="margin:1.2rem 0 .5rem">${t('inv.bulk_list', { n: bulk.length })}</h3><div class="table-wrap"><table><thead><tr><th>${t('inv.col_name')}</th><th>${t('inv.col_code')}</th><th>${t('inv.col_status')}</th><th></th></tr></thead><tbody>
      ${bulk.map(i => { const st = INV_ST[i.status] || ['common.none', ''];
        return `<tr><td>${esc(i.label)}${i.members && i.members.length ? `<br><small class="muted">${esc(t('inv.members', { names: i.members.map(m => m.name).join(', ') }))}</small>` : ''}
          ${i.limit_message ? `<br><small class="muted">${t('inv.bulk_msg_label')} ${esc(i.limit_message)}</small>` : ''}</td>
          <td><span class="code code-sm">${esc(i.code)}</span></td>
          <td><span class="badge ${st[1]}">${t(st[0])}</span><br><small class="muted">${t('inv.used_of', { used: i.used_count, max: i.max_uses })}</small></td>
          <td>${i.status === 'revoked' || i.status === 'expired' ? '' : `<button class="btn ghost sm" data-cp="${esc(i.code)}">${t('inv.copy')}</button><button class="btn danger sm" data-bk="${i.id}">${t('inv.revoke')}</button>`}</td></tr>`; }).join('')}</tbody></table></div>` : ''}
  </section>` : '';

  const freshBlock = fresh && fresh.length ? `<div class="invnew">
    <h3>${t('inv.new_codes', { n: fresh.length })}</h3>
    <p class="muted">${t('inv.give_each')}</p>
    <div class="table-wrap" style="border:0"><table><thead><tr><th>${t('inv.col_student')}</th><th>${t('inv.col_code')}</th></tr></thead><tbody>
      ${fresh.map(c => `<tr><td>${esc(c.label)}</td><td><span class="code">${esc(c.code)}</span></td></tr>`).join('')}</tbody></table></div>
    <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.7rem">
      <button class="btn sm" id="invcopyall">${t('inv.copy_all')}</button>
      <button class="btn ghost sm" id="invcsv">${t('inv.csv')}</button></div></div>` : '';

  host.innerHTML = bulkBlock + `<section class="panel">
    <h2>${t('inv.title')}</h2>
    <p class="muted">${t('inv.intro')}</p>
    <form id="invf">
      <div class="field"><label for="invn">${t('inv.names_label')}</label><textarea id="invn" placeholder="${esc(t('inv.names_ph'))}" style="min-height:90px"></textarea></div>
      <div class="field" style="max-width:260px"><label for="invd">${t('inv.expires_after')}</label>
        <select id="invd"><option value="7">${t('inv.days', { n: 7 })}</option><option value="14" selected>${t('inv.days', { n: 14 })}</option><option value="30">${t('inv.days', { n: 30 })}</option></select></div>
      <button class="btn">${t('inv.generate')}</button>
    </form>
    ${freshBlock}
    ${list.length ? `<h3 style="margin:1.2rem 0 .5rem">${t('inv.all_codes', { n: list.length })}</h3>
    <div class="table-wrap"><table><thead><tr><th>${t('inv.col_name')}</th><th>${t('inv.col_code')}</th><th>${t('inv.col_status')}</th><th>${t('inv.col_account')}</th><th></th></tr></thead><tbody>
      ${list.map(i => {
        const st = INV_ST[i.status] || ['common.none', ''];
        const acct = i.user_name ? `${esc(i.user_name)}<br><small class="muted">${esc(i.user_email)}${i.used_at ? ' · ' + esc(fmtDT(i.used_at)) : ''}</small>` : '<small class="muted">—</small>';
        let act = '';
        if (i.status === 'active') act = `<button class="btn ghost sm" data-cp="${esc(i.code)}">${t('inv.copy')}</button><button class="btn danger sm" data-rv="${i.id}" data-k="del">${t('inv.revoke')}</button>`;
        else if (i.status === 'used') act = `<button class="btn danger sm" data-rv="${i.id}" data-k="rm">${t('inv.remove')}</button>`;
        return `<tr><td>${esc(i.label)}</td><td><span class="code code-sm">${esc(i.code)}</span></td>
          <td><span class="badge ${st[1]}">${t(st[0])}${i.status === 'active' ? esc(t('inv.until', { date: fmtDT(i.expires_at) })) : ''}</span></td><td>${acct}</td><td>${act}</td></tr>`;
      }).join('')}</tbody></table></div>`
      : `<div class="empty" style="margin-top:1rem"><b>${t('inv.none')}</b>${t('inv.none_sub')}</div>`}
  </section>`;

  document.getElementById('invf').onsubmit = guard(async e => {
    e.preventDefault();
    const names = document.getElementById('invn').value.split('\n').map(x => x.trim()).filter(Boolean);
    if (!names.length) throw new Error(t('inv.need_name'));
    const r = await api(`/api/courses/${courseId}/invites`, { method: 'POST', body: { names, days: +document.getElementById('invd').value } });
    toast(t('inv.created', { n: r.created.length }));
    await drawInvites(courseId, rerender, r.created, course);
  });
  const bf = document.getElementById('bkf');
  if (bf) bf.onsubmit = guard(async e => {
    e.preventDefault();
    const capacity = +document.getElementById('bkc').value;
    if (!(capacity >= 2)) throw new Error(t('inv.bulk_need_cap'));
    const r = await api(`/api/courses/${courseId}/tokens`, { method: 'POST', body: { label: document.getElementById('bkl').value, capacity,
      message: document.getElementById('bkm').value, days: +document.getElementById('bkd').value } });
    toast(t('inv.bulk_created', { code: r.code }));
    await drawInvites(courseId, rerender, null, course);
  });
  host.querySelectorAll('[data-bk]').forEach(b => b.onclick = () => {
    const i = bulk.find(x => x.id === +b.dataset.bk);
    confirmBox(t('inv.confirm_bulk', { name: i.label }), async () => {
      await api(`/api/invites/${i.id}/revoke`, { method: 'POST' });
      toast(t('inv.revoked_toast')); rerender();
    });
  });
  host.querySelectorAll('[data-cp]').forEach(b => b.onclick = () => copyText(b.dataset.cp, t('inv.code_copied')));
  host.querySelectorAll('[data-rv]').forEach(b => b.onclick = () => {
    const i = list.find(x => x.id === +b.dataset.rv);
    const msg = b.dataset.k === 'rm'
      ? t('inv.confirm_remove', { name: i.user_name || i.label })
      : t('inv.confirm_revoke', { name: i.label });
    confirmBox(msg, async () => {
      await api(`/api/invites/${i.id}/revoke`, { method: 'POST' });
      toast(b.dataset.k === 'rm' ? t('inv.removed_toast') : t('inv.revoked_toast'));
      rerender();
    });
  });
  const ca = document.getElementById('invcopyall');
  if (ca) ca.onclick = () => copyText(fresh.map(c => `${c.label} — ${c.code}`).join('\n'), t('inv.all_copied'));
  const cs = document.getElementById('invcsv');
  if (cs) cs.onclick = () => {
    const csv = t('inv.csv_header') + '\n' + fresh.map(c => csvCell(c.label) + ',' + csvCell(c.code)).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = t('inv.csv_file');
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
}
