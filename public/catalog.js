'use strict';
// Upande wa mwanafunzi: madarasa yote na topics zake. Maudhui yamefungwa hadi ajiunge kwa code.
// Inatumia esc, api, toast, guard, modal, shell, ico, courseCard, me kutoka app.js

addStrings({
  en: {
    'cat.kind_video': 'Video', 'cat.kind_pdf': 'Document', 'cat.kind_link': 'Link',
    'cat.wa_course': 'Hello, I would like to join the class "{course}" on D4LT Learn. Please send me the payment instructions and a join code. My name is {name}.',
    'cat.wa_generic': 'Hello, I would like to join a class on D4LT Learn. Please send me the payment instructions and a join code. My name is {name}.',
    'cat.locked': 'This class content is locked.', 'cat.locked_msg': 'Pay or contact the admin on WhatsApp',
    'cat.locked_msg2': 'to get a code to join this class.',
    'cat.contact_wa': 'Contact the admin on WhatsApp', 'cat.have_code': 'If you already have a code, enter it here to join',
    'cat.code_aria': 'Join code', 'cat.join_class': 'Join class', 'cat.joined': 'You have joined {title}',
    'cat.class': 'Class', 'cat.topics_n': '{n} topics', 'cat.needs_code': 'Needs a code', 'cat.view_topics': 'View topics',
    'cat.welcome': 'Welcome, {name}', 'cat.welcome_sub': 'Browse all classes and their topics. Join with a code to unlock the content.',
    'cat.have_class_code': 'Do you have a class code?', 'cat.join_here': 'Enter it here to join. No code? Pay or contact the admin on WhatsApp',
    'cat.class_code_aria': 'Class code', 'cat.join': 'Join', 'cat.whatsapp': 'WhatsApp',
    'cat.my_courses': 'My courses', 'cat.other_classes': 'Other classes', 'cat.all_classes': 'All available classes',
    'cat.joined_all': 'You have joined all classes', 'cat.no_classes': 'No classes yet', 'cat.no_classes_sub': 'Classes will appear here once they are added.',
    'cat.all_classes_back': '← All classes', 'cat.teacher': 'Teacher: {name}', 'cat.topics_of': 'Topics in this class ({n})',
    'cat.locked_aria': '{title}, locked', 'cat.locked_title': 'Locked',
    'cat.no_topics': 'The teacher has not added topics yet', 'cat.come_back': 'Come back later.',
    'cat.join_this': 'Join this class',
    'cat.free_h': 'This class is free', 'cat.free_p': 'Join with one click and get all the material for free.', 'cat.join_free': 'Join for free',
    'cat.vip_h': 'VIP class', 'cat.vip_p': 'Pay online to join, or use a token if you have one.', 'cat.pay_btn': 'Pay {price} online',
    'cat.no_price': 'This class has no online price. Use a token or contact the admin.', 'cat.have_token': 'Have a token? Enter it here',
    'cat.token_full': 'Token is full', 'cat.redirecting': 'Taking you to the secure payment page…',
    'cat.pay_off': 'Online payment is not available yet. Use a token or contact the admin.',
    'cat.free_pill': 'Free — join now', 'cat.vip_pill': 'VIP',
  },
  sw: {
    'cat.kind_video': 'Video', 'cat.kind_pdf': 'Waraka', 'cat.kind_link': 'Kiungo',
    'cat.wa_course': 'Habari, nataka kujiunga na darasa la "{course}" kwenye D4LT Learn. Naomba maelekezo ya malipo na code ya kujiunga. Jina langu ni {name}.',
    'cat.wa_generic': 'Habari, nataka kujiunga na darasa kwenye D4LT Learn. Naomba maelekezo ya malipo na code ya kujiunga. Jina langu ni {name}.',
    'cat.locked': 'Maudhui ya darasa hili yamefungwa.', 'cat.locked_msg': 'Lipia au wasiliana na admin kwa WhatsApp',
    'cat.locked_msg2': 'kupata code ya kujiunga na darasa hili.',
    'cat.contact_wa': 'Wasiliana na admin kwa WhatsApp', 'cat.have_code': 'Kama umeshapata code, jaza hapa kujiunga',
    'cat.code_aria': 'Code ya kujiunga', 'cat.join_class': 'Jiunge na darasa', 'cat.joined': 'Umejiunga na {title}',
    'cat.class': 'Darasa', 'cat.topics_n': '{n} topics', 'cat.needs_code': 'Inahitaji code', 'cat.view_topics': 'Angalia topics',
    'cat.welcome': 'Karibu, {name}', 'cat.welcome_sub': 'Angalia madarasa yote na topics zake. Jiunge kwa code ili kufungua maudhui.',
    'cat.have_class_code': 'Una code ya darasa?', 'cat.join_here': 'Jaza hapa kujiunga. Huna code? Lipia au wasiliana na admin kwa WhatsApp',
    'cat.class_code_aria': 'Code ya darasa', 'cat.join': 'Jiunge', 'cat.whatsapp': 'WhatsApp',
    'cat.my_courses': 'Masomo yangu', 'cat.other_classes': 'Madarasa mengine', 'cat.all_classes': 'Madarasa yote yanayopatikana',
    'cat.joined_all': 'Umejiunga na madarasa yote', 'cat.no_classes': 'Hakuna madarasa bado', 'cat.no_classes_sub': 'Madarasa yakiongezwa yataonekana hapa.',
    'cat.all_classes_back': '← Madarasa yote', 'cat.teacher': 'Mwalimu: {name}', 'cat.topics_of': 'Topics za darasa hili ({n})',
    'cat.locked_aria': '{title}, imefungwa', 'cat.locked_title': 'Imefungwa',
    'cat.no_topics': 'Mwalimu bado hajaweka topics', 'cat.come_back': 'Rudi baadaye.',
    'cat.join_this': 'Jiunge na darasa hili',
    'cat.free_h': 'Darasa hili ni la bure', 'cat.free_p': 'Jiunge kwa kubofya mara moja na upate material yote bure.', 'cat.join_free': 'Jiunge bure',
    'cat.vip_h': 'Darasa la VIP', 'cat.vip_p': 'Lipia mtandaoni kujiunga, au tumia token kama unayo.', 'cat.pay_btn': 'Lipa {price} mtandaoni',
    'cat.no_price': 'Darasa hili halina bei ya mtandaoni. Tumia token au wasiliana na admin.', 'cat.have_token': 'Una token? Jaza hapa',
    'cat.token_full': 'Token imejaa', 'cat.redirecting': 'Tunakupeleka kwenye ukurasa salama wa malipo…',
    'cat.pay_off': 'Malipo ya mtandaoni bado hayapatikani. Tumia token au wasiliana na admin.',
    'cat.free_pill': 'Bure — jiunge sasa', 'cat.vip_pill': 'VIP',
  }
});

const KIND_LABEL = k => ({ video: t('cat.kind_video'), pdf: t('cat.kind_pdf'), link: t('cat.kind_link') }[k] || k);

function waLink(contact, course) {
  const msg = course ? t('cat.wa_course', { course: course.title, name: me.name }) : t('cat.wa_generic', { name: me.name });
  return `https://wa.me/${encodeURIComponent(contact.whatsapp)}?text=${encodeURIComponent(msg)}`;
}

// Ujumbe wa kufungua + kitufe cha WhatsApp + sanduku la code
function unlockHTML(course, contact, payOn) {
  if (isFree(course)) return `<div class="unlock"><p class="unlock-msg"><b>${t('cat.free_h')}</b> ${t('cat.free_p')}</p>
    <button type="button" class="btn sun" data-free style="width:100%">${t('cat.join_free')}</button></div>`;
  const canPay = payOn && course.price >= 500;
  return `<div class="unlock">
    <p class="unlock-msg"><b>${t('cat.vip_h')}</b> ${accessBadge(course)} ${t('cat.vip_p')}</p>
    ${canPay ? `<button type="button" class="btn sun" data-pay style="width:100%">${t('cat.pay_btn', { price: priceText(course) })}</button>`
      : `<p class="muted">${course.price >= 500 ? t('cat.pay_off') : t('cat.no_price')}</p>`}
    <div class="unlock-or"><span>${t('cat.have_token')}</span></div>
    <form class="unlock-form" data-course="${course.id}">
      <input name="code" maxlength="9" placeholder="ABCD-EFGH" aria-label="${t('cat.code_aria')}" autocomplete="off" autocapitalize="characters" required>
      <button class="btn sun">${t('cat.join_class')}</button>
    </form>
    <p class="unlock-err" role="alert" hidden></p>
    <div class="unlock-or"><span>${t('cat.locked_msg')} ${esc(contact.display)}</span></div>
    <a class="btn wa" href="${esc(waLink(contact, course))}" target="_blank" rel="noopener">${ico('chat')} ${t('cat.contact_wa')}</a></div>`;
}

function bindUnlock(root, course) {
  root.querySelectorAll('.unlock-form').forEach(f => f.onsubmit = async e => {
    e.preventDefault();
    const err = f.parentNode.querySelector('.unlock-err');
    if (err) err.hidden = true;
    try {
      const r = await api('/api/join', { method: 'POST', body: { code: f.code.value, course_id: course.id } });
      document.querySelectorAll('.overlay').forEach(o => o.remove());
      toast(t('cat.joined', { title: r.course.title }));
      location.hash = '#/course/' + r.course.id;
    } catch (er) { if (err) { err.textContent = er.message; err.hidden = false; } else toast(er.message, true); }
  });
  root.querySelectorAll('[data-free]').forEach(b => b.onclick = guard(async () => {
    const r = await api(`/api/courses/${course.id}/join-free`, { method: 'POST' });
    document.querySelectorAll('.overlay').forEach(o => o.remove());
    toast(t('cat.joined', { title: r.course.title }));
    location.hash = '#/course/' + r.course.id;
  }));
  root.querySelectorAll('[data-pay]').forEach(b => b.onclick = guard(async () => {
    b.disabled = true;
    try {
      const r = await api(`/api/courses/${course.id}/pay`, { method: 'POST' });
      if (r.enrolled) { location.hash = '#/course/' + course.id; return; }
      toast(t('cat.redirecting'));
      if (r.mock) location.hash = '#/pay/' + r.payment_id; else location.href = r.checkout_url;
    } finally { b.disabled = false; }
  }));
}

function lockModal(course, contact, topic, payOn) {
  const o = modal(`<h2>${ico('lock')} ${esc(topic || course.title)}</h2>
    ${unlockHTML(course, contact, payOn)}
    <div class="row"><button class="btn ghost" data-x>${t('common.close')}</button></div>`);
  o.querySelector('[data-x]').onclick = () => o.remove();
  bindUnlock(o, course);
}

const catalogCard = c => `<a class="course" href="#/browse/${c.id}" style="--c:${esc(c.color)}">
  <div class="course-top"><span>${esc(c.class_name || t('cat.class'))}</span></div>
  <div class="course-body">
    <h3>${esc(c.title)}</h3>
    <p>${esc(c.description).slice(0, 140)}</p>
    <div class="meta"><span>${t('cat.topics_n', { n: c.lesson_count })}</span>${c.teacher_name ? `<span>${esc(c.teacher_name)}</span>` : ''}
      ${isFree(c) ? `<span class="badge ok">${t('cat.free_pill')}</span>` : `<span class="lockpill">${ico('lock')} ${accessBadge(c)}</span>`}</div>
    <span class="btn ghost sm" style="align-self:flex-start;margin-top:.5rem">${t('cat.view_topics')}</span>
  </div></a>`;

// ---------- Ukurasa wa kwanza wa mwanafunzi ----------
async function studentHome() {
  const [mine, cat] = await Promise.all([api('/api/courses'), api('/api/catalog')]);
  const others = cat.courses.filter(c => !c.enrolled);
  shell('#/', `
    <div class="page-head"><div><h1>${t('cat.welcome', { name: esc(me.name.split(' ')[0]) })}</h1>
      <p class="muted">${t('cat.welcome_sub')}</p></div></div>
    <div class="join">
      <div><h2>${t('cat.have_class_code')}</h2>
        <p>${t('cat.join_here')} <b>${esc(cat.contact.display)}</b>.</p></div>
      <form id="jf"><input id="jc" maxlength="9" placeholder="ABCD-EFGH" aria-label="${t('cat.class_code_aria')}" autocomplete="off" autocapitalize="characters" required>
        <button class="btn sun">${t('cat.join')}</button></form>
      <a class="btn wa" href="${esc(waLink(cat.contact))}" target="_blank" rel="noopener">${ico('chat')} ${t('cat.whatsapp')}</a>
    </div>
    ${mine.length ? `<h2 class="sec">${t('cat.my_courses')}</h2><div class="grid">${mine.map(courseCard).join('')}</div>` : ''}
    <h2 class="sec">${mine.length ? t('cat.other_classes') : t('cat.all_classes')}</h2>
    ${others.length ? `<div class="grid">${others.map(catalogCard).join('')}</div>`
      : `<div class="empty"><b>${cat.courses.length ? t('cat.joined_all') : t('cat.no_classes')}</b>${cat.courses.length ? '' : t('cat.no_classes_sub')}</div>`}`);
  document.getElementById('jf').onsubmit = guard(async e => {
    e.preventDefault();
    const r = await api('/api/join', { method: 'POST', body: { code: jc.value } });
    toast(t('cat.joined', { title: r.course.title }));
    location.hash = '#/course/' + r.course.id;
  });
}

// ---------- Darasa moja: maelezo na topics (zimefungwa) ----------
async function browseView(id) {
  const d = await api(`/api/courses/${id}/preview`);
  const c = d.course;
  if (c.enrolled) { location.hash = '#/course/' + id; return; }
  shell('#/', `
    <a class="backlink" href="#/">${t('cat.all_classes_back')}</a>
    <section class="bhero" style="--c:${esc(c.color)}">
      <span class="pill">${esc(c.class_name || t('cat.class'))}</span>
      <h1>${esc(c.title)}</h1>
      <p>${esc(c.description)}</p>
      <div class="meta"><span>${t('cat.topics_n', { n: c.lesson_count })}</span>${c.teacher_name ? `<span>${esc(t('cat.teacher', { name: c.teacher_name }))}</span>` : ''}</div>
    </section>
    ${teacherCardHTML(d.teacher)}
    <div class="browse">
      <section>
        <h2 style="margin-top:0">${t('cat.topics_of', { n: d.lessons.length })}</h2>
        ${d.lessons.length ? `<ol class="topics">${d.lessons.map((l, i) => `
          <li class="topic" tabindex="0" role="button" data-lid="${l.id}" aria-label="${esc(t('cat.locked_aria', { title: l.title }))}">
            <span class="tno">${i + 1}</span>
            <div class="tbody"><div class="ttop"><b>${esc(l.title)}</b><span class="badge no">${esc(KIND_LABEL(l.kind))}</span></div>
              ${l.description ? `<p>${esc(l.description)}</p>` : ''}</div>
            <span class="tlock" title="${t('cat.locked_title')}">${ico('lock')}</span>
          </li>`).join('')}</ol>`
          : `<div class="empty"><b>${t('cat.no_topics')}</b>${t('cat.come_back')}</div>`}
      </section>
      <aside class="panel unlock-panel">
        <h2 style="margin-top:0">${t('cat.join_this')}</h2>
        ${unlockHTML(c, d.contact, d.pay_enabled)}
      </aside>
    </div>`);
  const page = document.querySelector('.browse');
  bindUnlock(page, c);
  page.querySelectorAll('.topic').forEach(li => {
    const open = () => lockModal(c, d.contact, d.lessons.find(l => l.id === +li.dataset.lid).title, d.pay_enabled);
    li.onclick = open;
    li.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
  });
}
