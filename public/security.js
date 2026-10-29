'use strict';
// Client-side security helpers. Uses esc, api, modal, toast, guard, shell, me, $app from app.js
// (The server has the final say on every rule; this is only to help the user.)

addStrings({
  en: {
    'sec.pw_len': 'At least 10 characters', 'sec.pw_lower': 'Lowercase letter (a-z)', 'sec.pw_upper': 'Uppercase letter (A-Z)',
    'sec.pw_digit': 'Number (0-9)', 'sec.pw_symbol': 'Special character (! @ # $ %)',
    'sec.weak_msg': 'Password is too weak. Create a strong password: 10+ characters with upper and lower case letters, a number and a special character.',
    'sec.pw_toggle_aria': 'Show or hide password',
    'sec.pw_weak_lbl': 'Weak password. Create a stronger one.', 'sec.pw_strong_lbl': 'Strong password',
    'sec.terms_date': '16 October 2026',
    'sec.terms_title': 'Terms of Use and Privacy Policy', 'sec.terms_short': 'Terms and Privacy Policy',
    'sec.terms_gate_intro': 'To continue, please read and accept these terms.',
    'sec.terms_check': 'I have read and accept the Terms of Use and Privacy Policy',
    'sec.accept_continue': 'Accept and continue',
    'sec.change_pw_title': 'Change your password',
    'sec.change_pw_intro': 'Your password is temporary or too weak. Create a strong password to continue.',
    'sec.current_pw': 'Current password', 'sec.new_pw': 'New password', 'sec.confirm_new_pw': 'Confirm new password',
    'sec.save_pw': 'Save password', 'sec.pw_mismatch': 'The new password and the confirmation do not match',
    'sec.pw_changed': 'Password changed',
    'sec.audit_title': 'Security', 'sec.audit_sub': 'Last 300 events: sign-ins, password changes, codes and student removals. Deleted after 180 days.',
    'sec.col_time': 'Time', 'sec.col_event': 'Event', 'sec.col_user': 'User', 'sec.col_detail': 'Details', 'sec.col_ip': 'IP',
    'sec.no_events': 'No events yet',
    'sec.a_login_ok': 'Signed in', 'sec.a_login_failed': 'Sign-in failed', 'sec.a_register': 'Registered', 'sec.a_password_changed': 'Changed password',
    'sec.a_password_reset_by_admin': 'Admin reset password', 'sec.a_teacher_created': 'Teacher registered', 'sec.a_user_deleted': 'Account deleted',
    'sec.a_terms_accepted': 'Accepted terms', 'sec.a_invites_created': 'Codes created', 'sec.a_invite_revoked': 'Code revoked',
    'sec.a_student_removed': 'Student removed from course', 'sec.a_joined': 'Joined a course', 'sec.a_join_failed': 'Join code rejected',
    'sec.terms_html': `
<p class="muted">Version of {date}. Please read carefully before using D4LT Learn.</p>
<h3>1. Accepting the terms</h3>
<p>By registering or signing in to D4LT Learn, you accept these terms. If you do not accept them, please do not use this system.</p>
<h3>2. Account and password security</h3>
<p>Your account is yours alone. Use a strong password (10 or more characters, with upper and lower case letters, numbers and symbols), do not share it with anyone, and do not reuse it on other services. You are responsible for everything done through your account. If you think your account has been compromised, change your password immediately and tell your teacher or the administrator.</p>
<h3>3. Course join code</h3>
<p>Each student is given a personal code by the teacher. A code can be used once only and it expires. Do not give your code to anyone else. Each code is recorded against the name of the student it was issued to, so the teacher knows who is in the class.</p>
<h3>4. Acceptable use</h3>
<p>Use the system for learning only. It is not allowed to: harass or insult others in class or in live meetings; share a meeting link, passcode or class code with people who are not part of the class; record, photograph or distribute videos, PDFs, quizzes, exams or recordings without the teacher's permission; try to access other people's accounts or break the system's protections; or upload illegal, sexual, hateful or malicious content. If you break these terms, the teacher or administrator may remove you from the class and/or suspend your account.</p>
<h3>5. Content and copyright</h3>
<p>Videos, PDFs, questions and recordings posted by teachers belong to the teachers or the school/college concerned, and are provided only for the learning use of enrolled students. Teachers who upload content confirm that they have the right to do so.</p>
<h3>6. Information we collect</h3>
<p>We collect: your name, your email address, your password (stored only as a hash, so we cannot read it), the lessons you have completed, your quiz and exam scores, and security logs (sign-in times, failed attempts and IP address). If live meetings are recorded, the recording may show your voice and image if you turn on your microphone or camera.</p>
<h3>7. How information is used and shared</h3>
<p>Information is used to run lessons, track progress and protect the system. The course teacher and the administrator can see your name, email address, progress and scores for their course. We do not sell your information, we do not show ads, and we do not give your information to anyone else unless the law requires it.</p>
<h3>8. Students under 18</h3>
<p>If you are under 18, your school or college is responsible for making sure a parent or guardian has been informed and has allowed you to use this system, where the law or school policy requires it.</p>
<h3>9. Retention and deletion</h3>
<p>Your information is kept for as long as your account exists. You can ask the administrator to delete your account. Security logs are deleted automatically after 180 days.</p>
<h3>10. Security</h3>
<p>We use protections such as hashed passwords, sign-in attempt limits, file protection for authorised users only, and security logs. However, no system is 100% secure. If you notice a security problem, report it to the administrator straight away.</p>
<h3>11. Changes to the terms</h3>
<p>If the terms change, you will be asked to accept them again before you continue using the system.</p>
<h3>12. Contact</h3>
<p>For questions about these terms or your information, contact the D4LT Learn administrator at your school or college.</p>`
  },
  sw: {
    'sec.pw_len': 'Angalau herufi 10', 'sec.pw_lower': 'Herufi ndogo (a-z)', 'sec.pw_upper': 'Herufi kubwa (A-Z)',
    'sec.pw_digit': 'Namba (0-9)', 'sec.pw_symbol': 'Alama maalum (! @ # $ %)',
    'sec.weak_msg': 'Nenosiri ni dhaifu. Tengeneza nenosiri imara: herufi 10 au zaidi, herufi kubwa na ndogo, namba na alama maalum.',
    'sec.pw_toggle_aria': 'Onyesha au ficha nenosiri',
    'sec.pw_weak_lbl': 'Nenosiri dhaifu. Tengeneza nenosiri imara.', 'sec.pw_strong_lbl': 'Nenosiri imara',
    'sec.terms_date': '16 Oktoba 2026',
    'sec.terms_title': 'Masharti ya Matumizi na Sera ya Faragha', 'sec.terms_short': 'Masharti na Sera ya Faragha',
    'sec.terms_gate_intro': 'Ili kuendelea, soma na ukubali masharti haya.',
    'sec.terms_check': 'Nimesoma na nakubali Masharti ya Matumizi na Sera ya Faragha',
    'sec.accept_continue': 'Kubali na endelea',
    'sec.change_pw_title': 'Badilisha nenosiri lako',
    'sec.change_pw_intro': 'Nenosiri lako ni la muda au ni dhaifu. Tengeneza nenosiri imara ili kuendelea.',
    'sec.current_pw': 'Nenosiri la sasa', 'sec.new_pw': 'Nenosiri jipya', 'sec.confirm_new_pw': 'Thibitisha nenosiri jipya',
    'sec.save_pw': 'Hifadhi nenosiri', 'sec.pw_mismatch': 'Nenosiri jipya na la kuthibitisha hayafanani',
    'sec.pw_changed': 'Nenosiri limebadilishwa',
    'sec.audit_title': 'Usalama', 'sec.audit_sub': 'Matukio 300 ya mwisho: kuingia, mabadiliko ya nenosiri, code na kutoa wanafunzi. Hufutwa baada ya siku 180.',
    'sec.col_time': 'Wakati', 'sec.col_event': 'Tukio', 'sec.col_user': 'Mtumiaji', 'sec.col_detail': 'Maelezo', 'sec.col_ip': 'IP',
    'sec.no_events': 'Hakuna matukio bado',
    'sec.a_login_ok': 'Ameingia', 'sec.a_login_failed': 'Kuingia kumeshindwa', 'sec.a_register': 'Amejisajili', 'sec.a_password_changed': 'Amebadilisha nenosiri',
    'sec.a_password_reset_by_admin': 'Msimamizi amebadilisha nenosiri', 'sec.a_teacher_created': 'Mwalimu amesajiliwa', 'sec.a_user_deleted': 'Akaunti imefutwa',
    'sec.a_terms_accepted': 'Amekubali masharti', 'sec.a_invites_created': 'Code zimetengenezwa', 'sec.a_invite_revoked': 'Code imefutwa',
    'sec.a_student_removed': 'Mwanafunzi ametolewa darasani', 'sec.a_joined': 'Amejiunga na somo', 'sec.a_join_failed': 'Code ya kujiunga imekataliwa',
    'sec.terms_html': `
<p class="muted">Toleo la {date}. Soma kwa makini kabla ya kutumia D4LT Learn.</p>
<h3>1. Kukubali masharti</h3>
<p>Ukijisajili au kuingia kwenye D4LT Learn, unakubali masharti haya. Kama huyakubali, usitumie mfumo huu.</p>
<h3>2. Akaunti na usalama wa nenosiri</h3>
<p>Akaunti ni yako peke yako. Weka nenosiri imara (herufi 10 au zaidi, herufi kubwa na ndogo, namba na alama), usilishiriki na mtu yeyote, na usitumie nenosiri hilo hilo kwenye huduma nyingine. Unawajibika kwa kila kinachofanyika kupitia akaunti yako. Ukihisi akaunti yako imeingiliwa, badilisha nenosiri mara moja na umjulishe mwalimu au msimamizi.</p>
<h3>3. Code ya kujiunga na somo</h3>
<p>Kila mwanafunzi hupewa code yake binafsi na mwalimu. Code inatumika mara moja tu na inaisha muda. Usimpe mtu mwingine code yako. Code hukumbukwa kwa jina la mwanafunzi aliyepewa, ili mwalimu ajue nani yupo darasani.</p>
<h3>4. Matumizi yanayokubalika</h3>
<p>Tumia mfumo kwa kujifunza tu. Hairuhusiwi: kusumbua au kutukana wengine darasani au kwenye meeting za live; kushiriki kiungo, passcode au code ya darasa na watu wasiohusika; kurekodi, kupiga picha au kusambaza video, PDF, quiz, mitihani au recording bila ruhusa ya mwalimu; kujaribu kuingia kwenye akaunti za wengine au kuvunja ulinzi wa mfumo; kupakia maudhui haramu, ya ngono, ya chuki au yenye programu hasidi. Ukivunja masharti haya, mwalimu au msimamizi anaweza kukutoa darasani na/au kusimamisha akaunti yako.</p>
<h3>5. Maudhui na hakimiliki</h3>
<p>Video, PDF, maswali na recording zinazowekwa na walimu ni mali ya walimu au shule/chuo husika, na zinatolewa kwa matumizi ya kujifunzia ya wanafunzi walioandikishwa tu. Walimu wanaopakia maudhui wanathibitisha kuwa wana haki ya kufanya hivyo.</p>
<h3>6. Taarifa tunazokusanya</h3>
<p>Tunakusanya: jina lako, barua pepe, nenosiri (linahifadhiwa likiwa limefichwa kwa njia ya hash, hatuwezi kulisoma), masomo uliyomaliza, alama za quiz na mtihani, na kumbukumbu za usalama (muda wa kuingia, majaribio yaliyoshindwa na anwani ya IP). Meeting za live zikirekodiwa, recording inaweza kuonyesha sauti na picha yako ukiwasha maikrofoni au kamera.</p>
<h3>7. Taarifa zinavyotumika na kushirikiwa</h3>
<p>Taarifa hutumika kuendesha masomo, kufuatilia maendeleo na kulinda mfumo. Mwalimu wa somo na msimamizi wanaona jina, barua pepe, maendeleo na alama zako za somo husika. Hatuuzi taarifa zako, hatuonyeshi matangazo, na hatuzitoi kwa mtu mwingine isipokuwa kama sheria inahitaji.</p>
<h3>8. Wanafunzi walio chini ya miaka 18</h3>
<p>Kama una chini ya miaka 18, shule au chuo chako ndicho kinachopaswa kuhakikisha mzazi au mlezi amejulishwa na kuruhusu matumizi ya mfumo huu, ikiwa sheria au sera ya shule inahitaji.</p>
<h3>9. Uhifadhi na kufuta taarifa</h3>
<p>Taarifa zako zinahifadhiwa maadamu akaunti yako ipo. Unaweza kuomba msimamizi afute akaunti yako. Kumbukumbu za usalama hufutwa kiotomatiki baada ya siku 180.</p>
<h3>10. Usalama</h3>
<p>Tunatumia hatua za ulinzi kama nenosiri lililofichwa, vikomo vya majaribio ya kuingia, ulinzi wa faili kwa walioruhusiwa tu na kumbukumbu za usalama. Hata hivyo hakuna mfumo salama kwa asilimia 100. Ukiona tatizo la usalama, ripoti kwa msimamizi mara moja.</p>
<h3>11. Mabadiliko ya masharti</h3>
<p>Masharti yakibadilika, utaombwa kuyakubali upya kabla ya kuendelea kutumia mfumo.</p>
<h3>12. Mawasiliano</h3>
<p>Kwa maswali kuhusu masharti haya au taarifa zako, wasiliana na msimamizi wa D4LT Learn wa shule au chuo chako.</p>`
  }
});

// ---------- Safe links ----------
function safeUrl(u) {
  try {
    const x = new URL(String(u || ''), location.origin);
    return x.protocol === 'http:' || x.protocol === 'https:' ? x.href : '#';
  } catch { return '#'; }
}

// ---------- Strong passwords ----------
const PW_RULES = [
  ['sec.pw_len', p => p.length >= 10],
  ['sec.pw_lower', p => /[a-z]/.test(p)],
  ['sec.pw_upper', p => /[A-Z]/.test(p)],
  ['sec.pw_digit', p => /[0-9]/.test(p)],
  ['sec.pw_symbol', p => /[^A-Za-z0-9]/.test(p)]
];
const pwOk = p => PW_RULES.every(r => r[1](p));
const weakMsg = () => t('sec.weak_msg');

function pwField(id, label, auto) {
  return `<div class="field"><label for="${id}">${label}</label>
    <div class="pwwrap"><input id="${id}" type="password" autocomplete="${auto}" required>
    <button type="button" class="pwshow" data-for="${id}" aria-label="${t('sec.pw_toggle_aria')}">${t('common.show')}</button></div></div>`;
}
const pwMeterHTML = id => `<div class="pwm" id="${id}" aria-live="polite">
  <div class="pwbar"><i></i></div>
  <ul>${PW_RULES.map(r => `<li>${t(r[0])}</li>`).join('')}</ul>
  <p class="pwlbl"></p></div>`;

function bindPwMeter(input, host) {
  const upd = () => {
    const p = input.value;
    let n = 0;
    host.querySelectorAll('li').forEach((li, i) => { const ok = PW_RULES[i][1](p); li.classList.toggle('ok', ok); if (ok) n++; });
    const bar = host.querySelector('.pwbar i');
    bar.style.width = (n * 20) + '%';
    bar.className = n <= 2 ? 'weak' : n < 5 ? 'mid' : 'strong';
    const l = host.querySelector('.pwlbl');
    l.textContent = !p ? '' : n < 5 ? t('sec.pw_weak_lbl') : t('sec.pw_strong_lbl');
    l.className = 'pwlbl ' + (n < 5 ? 'bad' : 'good');
  };
  input.addEventListener('input', upd);
  upd();
}
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('.pwshow');
  if (!b) return;
  const i = document.getElementById(b.dataset.for);
  if (!i) return;
  const show = i.type === 'password';
  i.type = show ? 'text' : 'password';
  b.textContent = show ? t('common.hide') : t('common.show');
});

// ---------- Terms of Use and Privacy Policy ----------
const termsHTML = () => t('sec.terms_html', { date: t('sec.terms_date') });

function termsModal() {
  const m = modal(`<h2>${t('sec.terms_title')}</h2><div class="terms">${termsHTML()}</div>
    <div class="row"><button class="btn" data-x>${t('common.close')}</button></div>`, 'wide');
  m.querySelector('[data-x]').onclick = () => m.remove();
}
document.addEventListener('click', e => {
  if (e.target.closest && e.target.closest('[data-terms]')) { e.preventDefault(); termsModal(); }
});

// ---------- Mandatory steps: accept the terms / replace a weak password ----------
function gateLogout() {
  api('/api/logout', { method: 'POST' }).finally(() => { me = null; resetNotifications(); render(); });
}

function gateView() {
  document.querySelectorAll('.overlay').forEach(o => o.remove());
  $app.innerHTML = '<div class="gate-bg"></div>' + prefsHTML('dk fixed');
  if (me.needs.includes('terms')) return termsGate();
  if (me.needs.includes('password')) return passwordGate();
}

function termsGate() {
  const m = modal(`<h2>${t('sec.terms_short')}</h2>
    <p class="muted">${t('sec.terms_gate_intro')}</p>
    <div class="terms">${termsHTML()}</div>
    <label class="chk"><input type="checkbox" id="tg"> ${t('sec.terms_check')}</label>
    <div class="row"><button class="btn ghost" id="tgo">${t('common.logout')}</button><button class="btn" id="tgy" disabled>${t('sec.accept_continue')}</button></div>`, 'wide', true);
  const chk = m.querySelector('#tg'), yes = m.querySelector('#tgy');
  chk.onchange = () => { yes.disabled = !chk.checked; };
  m.querySelector('#tgo').onclick = gateLogout;
  yes.onclick = guard(async () => {
    await api('/api/me/accept-terms', { method: 'POST', body: { accept: true } });
    m.remove();
    me = await api('/api/me');
    render();
  });
}

function passwordGate() {
  const m = modal(`<h2>${t('sec.change_pw_title')}</h2>
    <p>${t('sec.change_pw_intro')}</p>
    <form id="gf" novalidate>
      <div id="gerr"></div>
      ${pwField('gc', t('sec.current_pw'), 'current-password')}
      ${pwField('gn', t('sec.new_pw'), 'new-password')}
      ${pwMeterHTML('gm')}
      ${pwField('gn2', t('sec.confirm_new_pw'), 'new-password')}
      <div class="row"><button type="button" class="btn ghost" id="glo">${t('common.logout')}</button><button class="btn">${t('sec.save_pw')}</button></div>
    </form>`, '', true);
  bindPwMeter(m.querySelector('#gn'), m.querySelector('#gm'));
  m.querySelector('#glo').onclick = gateLogout;
  m.querySelector('#gf').onsubmit = async e => {
    e.preventDefault();
    const err = x => { m.querySelector('#gerr').innerHTML = `<div class="err">${esc(x)}</div>`; };
    const nw = m.querySelector('#gn').value;
    if (!pwOk(nw)) return err(weakMsg());
    if (nw !== m.querySelector('#gn2').value) return err(t('sec.pw_mismatch'));
    try {
      await api('/api/me/password', { method: 'POST', body: { current: m.querySelector('#gc').value, next: nw } });
      m.remove();
      toast(t('sec.pw_changed'));
      me = await api('/api/me');
      render();
    } catch (er) { err(er.message); }
  };
}

// ---------- Security log (admin) ----------
const auditLabel = a => { const k = 'sec.a_' + a; const s = t(k); return s === k ? a : s; };
async function auditView() {
  const rows = await api('/api/audit');
  shell('#/audit', `
    <div class="page-head"><div><h1>${t('sec.audit_title')}</h1><p class="muted">${t('sec.audit_sub')}</p></div></div>
    ${rows.length ? `<div class="table-wrap"><table><thead><tr><th>${t('sec.col_time')}</th><th>${t('sec.col_event')}</th><th>${t('sec.col_user')}</th><th>${t('sec.col_detail')}</th><th>${t('sec.col_ip')}</th></tr></thead><tbody>
      ${rows.map(r => `<tr class="${r.action.includes('failed') ? 'warnrow' : ''}"><td>${esc(fmtDT(r.at))}</td><td>${esc(auditLabel(r.action))}</td>
      <td>${r.user_name ? esc(r.user_name) + '<br><small class="muted">' + esc(r.user_email) + '</small>' : '—'}</td><td>${esc(r.detail)}</td><td>${esc(r.ip || '')}</td></tr>`).join('')}</tbody></table></div>`
      : `<div class="empty"><b>${t('sec.no_events')}</b></div>`}`);
}
