'use strict';
// Free / VIP labels, price formatting, payment return page and the admin Payments page.
// Uses esc, api, toast, guard, shell, ico, fmtDT from the other scripts.

addStrings({
  en: {
    'pay.free': 'Free', 'pay.vip': 'VIP', 'pay.price_tzs': 'TZS {n}', 'pay.token_only': 'Token only',
    'pay.return_h': 'Payment', 'pay.checking': 'Checking your payment…',
    'pay.ok_h': 'Payment received', 'pay.ok_p': 'You now have access to {title}.', 'pay.open_class': 'Open the class',
    'pay.pending_h': 'Waiting for the payment', 'pay.pending_p': 'If you have already paid, this page updates by itself. It can take a minute.',
    'pay.failed_h': 'Payment did not go through', 'pay.failed_p': 'No money was taken for this attempt. You can try again.',
    'pay.try_again': 'Try again', 'pay.back_class': 'Back to the class',
    'pay.mock_note': 'Test mode: no real money moves. Choose what the payment should do.',
    'pay.mock_ok': 'Simulate successful payment', 'pay.mock_fail': 'Simulate failed payment',
    'pay.nav': 'Payments', 'pay.admin_h': 'Payments', 'pay.total': 'Total received', 'pay.count': '{n} completed payments',
    'pay.not_set': 'Online payments are not set up yet. Set SNIPPE_API_KEY, SNIPPE_WEBHOOK_SECRET and PUBLIC_URL on the server (see README).',
    'pay.mock_on': 'Test mode is ON (SNIPPE_MOCK=1). Turn it off before going live.',
    'pay.col_date': 'Date', 'pay.col_student': 'Student', 'pay.col_class': 'Class', 'pay.col_amount': 'Amount', 'pay.col_status': 'Status',
    'pay.st_pending': 'Pending', 'pay.st_completed': 'Paid', 'pay.st_failed': 'Failed', 'pay.st_expired': 'Expired', 'pay.st_voided': 'Voided',
    'pay.none': 'No payments yet', 'pay.none_sub': 'Payments made by students will appear here.'
  },
  sw: {
    'pay.free': 'Bure', 'pay.vip': 'VIP', 'pay.price_tzs': 'TZS {n}', 'pay.token_only': 'Token tu',
    'pay.return_h': 'Malipo', 'pay.checking': 'Inakagua malipo yako…',
    'pay.ok_h': 'Malipo yamepokelewa', 'pay.ok_p': 'Sasa unaweza kufikia {title}.', 'pay.open_class': 'Fungua darasa',
    'pay.pending_h': 'Tunasubiri malipo', 'pay.pending_p': 'Kama umeshalipa, ukurasa huu utajisasisha wenyewe. Inaweza kuchukua dakika moja.',
    'pay.failed_h': 'Malipo hayakukamilika', 'pay.failed_p': 'Hakuna pesa iliyokatwa kwa jaribio hili. Unaweza kujaribu tena.',
    'pay.try_again': 'Jaribu tena', 'pay.back_class': 'Rudi kwenye darasa',
    'pay.mock_note': 'Hali ya majaribio: hakuna pesa halisi inayosogea. Chagua malipo yafanye nini.',
    'pay.mock_ok': 'Igiza malipo yaliyofanikiwa', 'pay.mock_fail': 'Igiza malipo yaliyoshindwa',
    'pay.nav': 'Malipo', 'pay.admin_h': 'Malipo', 'pay.total': 'Jumla iliyopokelewa', 'pay.count': 'Malipo {n} yaliyokamilika',
    'pay.not_set': 'Malipo ya mtandaoni bado hayajawekwa. Weka SNIPPE_API_KEY, SNIPPE_WEBHOOK_SECRET na PUBLIC_URL kwenye server (angalia README).',
    'pay.mock_on': 'Hali ya majaribio IMEWASHWA (SNIPPE_MOCK=1). Izime kabla ya kuanza kutumia kweli.',
    'pay.col_date': 'Tarehe', 'pay.col_student': 'Mwanafunzi', 'pay.col_class': 'Darasa', 'pay.col_amount': 'Kiasi', 'pay.col_status': 'Hali',
    'pay.st_pending': 'Inasubiri', 'pay.st_completed': 'Imelipwa', 'pay.st_failed': 'Imeshindwa', 'pay.st_expired': 'Imeisha muda', 'pay.st_voided': 'Imebatilishwa',
    'pay.none': 'Hakuna malipo bado', 'pay.none_sub': 'Malipo ya wanafunzi yataonekana hapa.'
  }
});

const isFree = c => c.access === 'free';
const priceText = c => (c.price >= 500 ? t('pay.price_tzs', { n: Number(c.price).toLocaleString(locale()) }) : t('pay.token_only'));
const accessBadge = c => isFree(c)
  ? `<span class="badge ok">${t('pay.free')}</span>`
  : `<span class="badge vip">${t('pay.vip')} · ${esc(priceText(c))}</span>`;

// Return page after Snippe checkout (#/pay/:id). Polls the server, which re-checks with Snippe itself.
let payTimer = null;
async function payView(id) {
  clearTimeout(payTimer);
  const draw = (inner) => shell('#/', `<div class="panel payret" role="status" aria-live="polite">${inner}</div>`);
  draw(`<h1>${t('pay.return_h')}</h1><p class="muted">${t('pay.checking')}</p>`);
  const p = await api('/api/payments/' + id);
  if (p.status === 'completed') {
    return draw(`<h1>${ico('check')} ${t('pay.ok_h')}</h1><p>${esc(t('pay.ok_p', { title: p.title }))}</p>
      <a class="btn" href="#/course/${p.course_id}">${t('pay.open_class')}</a>`);
  }
  if (['failed', 'expired', 'voided'].includes(p.status)) {
    return draw(`<h1>${t('pay.failed_h')}</h1><p class="muted">${t('pay.failed_p')}</p>
      <a class="btn" href="#/browse/${p.course_id}">${t('pay.try_again')}</a>`);
  }
  draw(`<h1>${t('pay.pending_h')}</h1><p class="muted">${t('pay.pending_p')}</p>
    ${p.mock ? `<p class="muted">${t('pay.mock_note')}</p><div class="row" style="justify-content:flex-start">
      <button class="btn" id="mok">${t('pay.mock_ok')}</button><button class="btn ghost" id="mno">${t('pay.mock_fail')}</button></div>` : ''}
    <a class="backlink" href="#/browse/${p.course_id}">${t('pay.back_class')}</a>`);
  const mk = fail => guard(async () => { await api(`/api/payments/${id}/mock-complete`, { method: 'POST', body: { fail } }); payView(id); });
  const ok = document.getElementById('mok'), no = document.getElementById('mno');
  if (ok) { ok.onclick = mk(false); no.onclick = mk(true); }
  payTimer = setTimeout(() => { if (location.hash.startsWith('#/pay/' + id)) payView(id).catch(() => {}); }, 4000);
}

// Admin: all payments
async function paymentsView() {
  const d = await api('/api/payments');
  const ST = { pending: 'soon', completed: 'ok', failed: 'no', expired: 'no', voided: 'no' };
  shell('#/payments', `
    <div class="page-head"><div><h1>${t('pay.admin_h')}</h1>
      <p class="muted">${t('pay.total')}: <b>${esc(t('pay.price_tzs', { n: Number(d.total).toLocaleString(locale()) }))}</b> · ${t('pay.count', { n: d.count })}</p></div></div>
    ${!d.enabled ? `<div class="notice">${t('pay.not_set')}</div>` : ''}
    ${d.mock ? `<div class="notice">${t('pay.mock_on')}</div>` : ''}
    ${d.payments.length ? `<div class="table-wrap"><table><thead><tr><th>${t('pay.col_date')}</th><th>${t('pay.col_student')}</th><th>${t('pay.col_class')}</th><th>${t('pay.col_amount')}</th><th>${t('pay.col_status')}</th></tr></thead><tbody>
      ${d.payments.map(p => `<tr><td>${esc(fmtDT(p.created_at))}</td><td>${esc(p.user_name)}<br><small class="muted">${esc(p.user_email)}</small></td>
        <td>${esc(p.course_title)}</td><td>${esc(t('pay.price_tzs', { n: Number(p.amount).toLocaleString(locale()) }))}</td>
        <td><span class="badge ${ST[p.status] || ''}">${t('pay.st_' + p.status)}</span></td></tr>`).join('')}</tbody></table></div>`
      : `<div class="empty"><b>${t('pay.none')}</b>${t('pay.none_sub')}</div>`}`);
}
