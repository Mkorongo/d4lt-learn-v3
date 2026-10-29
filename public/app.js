'use strict';
const $app = document.getElementById('app');
const COLORS = ['#4f46e5', '#0e8f93', '#10a36b', '#e08a00', '#e5484d', '#8b5cf6', '#d6409f', '#0ea5e9'];
let me = null;
const lastLesson = {};   // somo lililofunguliwa mwisho kwa kila kozi
let pendingQuiz = null;  // quiz ya kufunguliwa baada ya kupakia upya ukurasa

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
addStrings({
  en: {
    'app.role_admin': 'Administrator', 'app.role_teacher': 'Teacher', 'app.role_student': 'Student',
    'app.hero_title': 'Learn computing step by step.',
    'app.hero_text': 'Videos, documents and all your class lessons in one place. Sign in, enter your lesson code and start learning.',
    'app.sign_in': 'Sign in', 'app.register': 'Register', 'app.create_account': 'Create account',
    'app.full_name': 'Full name', 'app.email': 'Email', 'app.password': 'Password', 'app.confirm_password': 'Confirm password',
    'app.accept_prefix': 'I have read and accept the', 'app.terms_link': 'Terms of Use and Privacy Policy',
    'app.err_name': 'Enter your full name', 'app.err_pw_mismatch': 'The password and the confirmation do not match',
    'app.err_terms': 'You must accept the Terms of Use and Privacy Policy',
    'app.menu': 'Main menu', 'app.nav_courses': 'Courses', 'app.nav_teachers': 'Teachers', 'app.nav_students': 'Students',
    'app.nav_security': 'Security', 'app.nav_notifications': 'Notifications', 'app.nav_account': 'Account',
    'app.course': 'Course', 'app.progress_aria': 'Progress {pct}%', 'app.lessons_n': '{n} lessons', 'app.pct_done': '{pct}% completed', 'app.students_n': '{n} students',
    'app.stat_students': 'Students', 'app.stat_teachers': 'Teachers', 'app.stat_courses': 'Courses', 'app.stat_lessons': 'Videos and documents',
    'app.have_code': 'Do you have a course code?', 'app.have_code_sub': 'Your teacher will give you your personal code (it works once only, do not share it).',
    'app.code_aria': 'Course code', 'app.join': 'Join',
    'app.h_my_courses': 'My courses', 'app.h_teaching': 'Courses I teach', 'app.h_all_courses': 'All courses',
    'app.access': 'Access', 'app.access_free_hint': 'anyone joins in one click, all material free', 'app.access_vip_hint': 'students pay online or use a token',
    'app.price_label': 'Price (TZS)', 'app.price_hint': 'At least 500. Leave 0 for token-only access.',
    'app.welcome': 'Welcome, {name}.', 'app.new_course': '+ New course',
    'app.empty_student': 'You have not joined any course yet', 'app.empty_teacher': 'You have not been assigned a course yet', 'app.empty_admin': 'No courses yet',
    'app.empty_student_sub': 'Enter the code your teacher gave you above.', 'app.empty_admin_sub': 'Click "New course" to start.', 'app.empty_teacher_sub': 'The administrator will assign you a course to teach.',
    'app.joined': 'You have joined {title}',
    'app.edit_course': 'Edit course', 'app.course_title': 'Course name', 'app.course_title_ph': 'e.g. Computer Basics',
    'app.class_group': 'Class / group', 'app.class_ph': 'e.g. Form 1, Year 1', 'app.short_desc': 'Short description',
    'app.course_teacher': 'Course teacher', 'app.not_assigned': '— Not assigned yet —', 'app.colour': 'Colour',
    'app.allow_dl': 'Students can download these files', 'app.download': 'Download', 'app.dl_on': 'Allow download', 'app.dl_off': 'Disable download',
    'app.materials_n': '{n} materials', 'app.add_materials': 'Add materials', 'app.add_materials_h': 'Add materials to this topic',
    'app.remove_material': 'Remove this material', 'app.confirm_remove_material': 'Remove "{name}" from this topic? The file will be deleted permanently.',
    'app.or_links': 'Or links, one per line (e.g. YouTube)', 'app.pick_hint': 'You can choose several files at once, and choose again to add more (max 20 per topic).',
    'app.remove_file': 'Remove', 'app.upload_topic': 'Upload topic', 'app.materials_added': 'Materials added', 'app.mat_default': '{kind} {n}',
    'app.uploading_pct': 'Uploading... {pct}%', 'app.nothing_picked': 'Choose at least one file or enter a link',
    'app.lessons_h': 'Lessons ({n})', 'app.no_lessons': 'No lessons yet.',
    'app.k_video': 'Video', 'app.k_doc': 'Document', 'app.k_link': 'Link',
    'app.teacher_lbl': 'Teacher: {name}',
    'app.no_lesson_title': 'No lesson to show', 'app.no_lesson_add': 'Add a video or document below.', 'app.no_lesson_student': 'The teacher has not added lessons yet.',
    'app.open_link': 'Open link', 'app.done_undo': 'Finished ✓ (click to undo)', 'app.mark_done': "I've finished this lesson",
    'app.quiz_btn': 'Quiz ({n}/10)', 'app.delete_lesson': 'Delete lesson',
    'app.congrats': 'Congratulations! Lesson completed', 'app.confirm_delete_lesson': 'Delete "{title}"? The file will be deleted permanently.', 'app.deleted': 'Deleted',
    'app.add_lesson': 'Add a lesson', 'app.lesson_title': 'Lesson title', 'app.lesson_title_ph': 'e.g. Parts of a computer',
    'app.optional_desc': 'Description (optional)', 'app.file_label': 'Videos (MP4/WebM) and documents (PDF, Word, PowerPoint, Excel...)',
    'app.file_note': 'The document is converted by the system and opens inside the system (without PDF buttons). Limit 100 MB.',
    'app.or_link': 'Or enter a link (e.g. YouTube)', 'app.upload_lesson': 'Upload topic', 'app.uploading': 'Uploading...',
    'app.upload_failed': 'Upload failed', 'app.network_lost': 'Network connection lost', 'app.lesson_uploaded': 'Lesson uploaded',
    'app.students_h': 'Students ({n})', 'app.col_name': 'Name', 'app.col_code': 'Their code', 'app.col_lessons': 'Lessons', 'app.col_quiz': 'Quiz', 'app.col_exam': 'Exam',
    'app.remove_student': 'Remove from class', 'app.no_students': 'Nobody has joined yet. Generate student codes below.',
    'app.confirm_remove_student': 'Remove this student from the class? Their code will be revoked and they will not be able to return without a new code from the teacher.',
    'app.confirm_delete_course': 'The whole course, its lessons and its files will be deleted permanently.',
    'app.t_title': 'Teachers', 'app.t_sub': 'Register teachers, then assign them to courses from each course.', 'app.new_teacher': '+ New teacher',
    'app.col_email': 'Email', 'app.col_username': 'Username', 'app.col_courses': 'Courses', 'app.set_pw': 'Set new password', 'app.no_teachers': 'No teachers yet', 'app.no_teachers_sub': 'Click "New teacher" to register the first one.',
    'app.new_teacher_h': 'New teacher', 'app.start_pw': 'Starting password',
    'app.start_pw_hint': 'A temporary password. Make it strong (10+ characters, upper and lower case, number and symbol). The teacher will change it when they first sign in.',
    'app.register_btn': 'Register', 'app.teacher_registered': 'Teacher registered',
    'app.s_title': 'Students', 'app.s_sub': '{n} registered students.', 'app.no_students_yet': 'No students yet', 'app.no_students_sub': 'Students register themselves on the sign-in page.',
    'app.confirm_delete_user': 'This account will be deleted permanently.',
    'app.new_pw_h': 'New password', 'app.temp_pw': 'Temporary password',
    'app.temp_pw_hint': 'Strong: 10+ characters, upper and lower case, number and symbol. They will change it when they sign in, and all their devices will be signed out.',
    'app.pw_changed': 'Password changed',
    'app.account_h': 'My account', 'app.change_pw_h': 'Change password', 'app.current_pw': 'Current password', 'app.new_pw': 'New password', 'app.confirm_new_pw': 'Confirm new password',
    'app.pw_other_devices': 'If you change your password, your other signed-in devices will be signed out.',
    'app.terms_h': 'Terms and privacy', 'app.terms_sub': 'Read the terms of use and how your information is used.', 'app.read_terms': 'Read the Terms of Use and Privacy Policy',
    'app.err_new_pw_mismatch': 'The new password and the confirmation do not match', 'app.saved': 'Saved'
  },
  sw: {
    'app.role_admin': 'Msimamizi', 'app.role_teacher': 'Mwalimu', 'app.role_student': 'Mwanafunzi',
    'app.hero_title': 'Jifunze kompyuta hatua kwa hatua.',
    'app.hero_text': 'Video, nyaraka na masomo yote ya darasa lako mahali pamoja. Ingia, weka code yako ya somo, anza kujifunza.',
    'app.sign_in': 'Ingia', 'app.register': 'Jisajili', 'app.create_account': 'Fungua akaunti',
    'app.full_name': 'Jina kamili', 'app.email': 'Barua pepe', 'app.password': 'Nenosiri', 'app.confirm_password': 'Thibitisha nenosiri',
    'app.accept_prefix': 'Nimesoma na nakubali', 'app.terms_link': 'Masharti ya Matumizi na Sera ya Faragha',
    'app.err_name': 'Weka jina lako kamili', 'app.err_pw_mismatch': 'Nenosiri na uthibitisho havifanani',
    'app.err_terms': 'Lazima ukubali Masharti ya Matumizi na Sera ya Faragha',
    'app.menu': 'Menyu kuu', 'app.nav_courses': 'Masomo', 'app.nav_teachers': 'Walimu', 'app.nav_students': 'Wanafunzi',
    'app.nav_security': 'Usalama', 'app.nav_notifications': 'Arifa', 'app.nav_account': 'Akaunti',
    'app.course': 'Somo', 'app.progress_aria': 'Maendeleo {pct}%', 'app.lessons_n': '{n} masomo', 'app.pct_done': '{pct}% umekamilisha', 'app.students_n': '{n} wanafunzi',
    'app.stat_students': 'Wanafunzi', 'app.stat_teachers': 'Walimu', 'app.stat_courses': 'Masomo', 'app.stat_lessons': 'Video na nyaraka',
    'app.have_code': 'Una code ya somo?', 'app.have_code_sub': 'Mwalimu wako atakupa code yako binafsi (inatumika mara moja tu, usimpe mtu mwingine).',
    'app.code_aria': 'Code ya somo', 'app.join': 'Jiunge',
    'app.h_my_courses': 'Masomo yangu', 'app.h_teaching': 'Masomo ninayofundisha', 'app.h_all_courses': 'Masomo yote',
    'app.access': 'Upatikanaji', 'app.access_free_hint': 'yeyote anajiunga kwa kubofya mara moja, material yote bure', 'app.access_vip_hint': 'wanafunzi wanalipa mtandaoni au wanatumia token',
    'app.price_label': 'Bei (TZS)', 'app.price_hint': 'Kuanzia 500. Acha 0 kwa token tu.',
    'app.welcome': 'Karibu, {name}.', 'app.new_course': '+ Somo jipya',
    'app.empty_student': 'Bado hujajiunga na somo lolote', 'app.empty_teacher': 'Hujapewa somo bado', 'app.empty_admin': 'Hakuna somo bado',
    'app.empty_student_sub': 'Weka code uliyopewa na mwalimu hapo juu.', 'app.empty_admin_sub': 'Bofya "Somo jipya" kuanza.', 'app.empty_teacher_sub': 'Msimamizi atakupangia somo la kufundisha.',
    'app.joined': 'Umejiunga na {title}',
    'app.edit_course': 'Hariri somo', 'app.course_title': 'Jina la somo', 'app.course_title_ph': 'mf. Misingi ya Kompyuta',
    'app.class_group': 'Darasa / kundi', 'app.class_ph': 'mf. Form 1, Mwaka wa 1', 'app.short_desc': 'Maelezo mafupi',
    'app.course_teacher': 'Mwalimu wa somo', 'app.not_assigned': '— Bado hajapangiwa —', 'app.colour': 'Rangi',
    'app.allow_dl': 'Wanafunzi wanaweza kupakua faili hizi', 'app.download': 'Pakua', 'app.dl_on': 'Ruhusu kupakua', 'app.dl_off': 'Zuia kupakua',
    'app.materials_n': 'Vitu {n}', 'app.add_materials': 'Ongeza materials', 'app.add_materials_h': 'Ongeza materials kwenye topic hii',
    'app.remove_material': 'Ondoa material hii', 'app.confirm_remove_material': 'Ondoa "{name}" kwenye topic hii? Faili litafutwa kabisa.',
    'app.or_links': 'Au viungo, kimoja kwa kila mstari (mf. YouTube)', 'app.pick_hint': 'Unaweza kuchagua faili nyingi kwa mara moja, na kuchagua tena kuongeza (upeo 20 kwa topic).',
    'app.remove_file': 'Ondoa', 'app.upload_topic': 'Pakia topic', 'app.materials_added': 'Materials zimeongezwa', 'app.mat_default': '{kind} {n}',
    'app.uploading_pct': 'Inapakia... {pct}%', 'app.nothing_picked': 'Chagua angalau faili moja au weka kiungo',
    'app.lessons_h': 'Masomo ({n})', 'app.no_lessons': 'Hakuna masomo bado.',
    'app.k_video': 'Video', 'app.k_doc': 'Waraka', 'app.k_link': 'Kiungo',
    'app.teacher_lbl': 'Mwalimu: {name}',
    'app.no_lesson_title': 'Hakuna somo la kuonyesha', 'app.no_lesson_add': 'Ongeza video au waraka hapa chini.', 'app.no_lesson_student': 'Mwalimu bado hajaweka masomo.',
    'app.open_link': 'Fungua kiungo', 'app.done_undo': 'Umemaliza ✓ (bofya kutengua)', 'app.mark_done': 'Nimemaliza somo hili',
    'app.quiz_btn': 'Quiz ({n}/10)', 'app.delete_lesson': 'Futa somo',
    'app.congrats': 'Hongera! Somo limekamilika', 'app.confirm_delete_lesson': 'Futa "{title}"? Faili litafutwa kabisa.', 'app.deleted': 'Limefutwa',
    'app.add_lesson': 'Ongeza somo', 'app.lesson_title': 'Kichwa cha somo', 'app.lesson_title_ph': 'mf. Sehemu za kompyuta',
    'app.optional_desc': 'Maelezo (hiari)', 'app.file_label': 'Video (MP4/WebM) na nyaraka (PDF, Word, PowerPoint, Excel...)',
    'app.file_note': 'Waraka unabadilishwa na mfumo na kufunguka ndani ya system (bila vitufe vya PDF). Kikomo MB 100.',
    'app.or_link': 'Au weka kiungo (mf. YouTube)', 'app.upload_lesson': 'Pakia topic', 'app.uploading': 'Inapakia...',
    'app.upload_failed': 'Imeshindwa kupakia', 'app.network_lost': 'Mtandao umekatika', 'app.lesson_uploaded': 'Somo limepakiwa',
    'app.students_h': 'Wanafunzi ({n})', 'app.col_name': 'Jina', 'app.col_code': 'Code yake', 'app.col_lessons': 'Masomo', 'app.col_quiz': 'Quiz', 'app.col_exam': 'Mtihani',
    'app.remove_student': 'Mtoe darasani', 'app.no_students': 'Bado hakuna aliyejiunga. Tengeneza code za wanafunzi hapa chini.',
    'app.confirm_remove_student': 'Mtoe mwanafunzi huyu darasani? Code yake itafutwa na hataweza kurudi bila code mpya kutoka kwa mwalimu.',
    'app.confirm_delete_course': 'Somo lote, masomo yake na faili zake vitafutwa kabisa.',
    'app.t_title': 'Walimu', 'app.t_sub': 'Sajili walimu kisha uwapangie masomo kwenye kila somo.', 'app.new_teacher': '+ Mwalimu mpya',
    'app.col_email': 'Barua pepe', 'app.col_username': 'Username', 'app.col_courses': 'Masomo', 'app.set_pw': 'Weka nenosiri jipya', 'app.no_teachers': 'Hakuna mwalimu bado', 'app.no_teachers_sub': 'Bofya "Mwalimu mpya" kusajili wa kwanza.',
    'app.new_teacher_h': 'Mwalimu mpya', 'app.start_pw': 'Nenosiri la kuanzia',
    'app.start_pw_hint': 'Nenosiri la muda. Liwe imara (herufi 10+, kubwa, ndogo, namba na alama). Mwalimu atalibadilisha akiingia kwanza.',
    'app.register_btn': 'Sajili', 'app.teacher_registered': 'Mwalimu amesajiliwa',
    'app.s_title': 'Wanafunzi', 'app.s_sub': 'Wanafunzi {n} waliojisajili.', 'app.no_students_yet': 'Hakuna mwanafunzi bado', 'app.no_students_sub': 'Wanafunzi hujisajili wenyewe kupitia ukurasa wa kuingia.',
    'app.confirm_delete_user': 'Akaunti hii itafutwa kabisa.',
    'app.new_pw_h': 'Nenosiri jipya', 'app.temp_pw': 'Nenosiri la muda',
    'app.temp_pw_hint': 'Imara: herufi 10+, kubwa, ndogo, namba na alama. Atalibadilisha akiingia, na vifaa vyake vyote vitatolewa.',
    'app.pw_changed': 'Nenosiri limebadilishwa',
    'app.account_h': 'Akaunti yangu', 'app.change_pw_h': 'Badilisha nenosiri', 'app.current_pw': 'Nenosiri la sasa', 'app.new_pw': 'Nenosiri jipya', 'app.confirm_new_pw': 'Thibitisha nenosiri jipya',
    'app.pw_other_devices': 'Ukibadilisha nenosiri, vifaa vingine vilivyoingia vitatolewa.',
    'app.terms_h': 'Masharti na faragha', 'app.terms_sub': 'Soma masharti ya matumizi na jinsi taarifa zako zinavyotumika.', 'app.read_terms': 'Soma Masharti na Sera ya Faragha',
    'app.err_new_pw_mismatch': 'Nenosiri jipya na uthibitisho havifanani', 'app.saved': 'Imehifadhiwa'
  }
});

const roleName = r => t('app.role_' + r);

const I = {
  home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
  teacher: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  students: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M17 4.5a3.5 3.5 0 010 7M22 20c0-2.6-1.7-4.3-4-5"/>',
  user: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/>',
  video: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5v5l4.5-2.5z"/>',
  pdf: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
  link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  bell: '<path d="M6 17V11a6 6 0 0112 0v6l2 2H4zM10 21a2 2 0 004 0"/>',
  card: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>'
};
const ico = n => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;

async function api(path, opts = {}) {
  const o = { credentials: 'same-origin', ...opts };
  o.headers = { ...LANG_HEADERS(), ...(o.headers || {}) };
  if (o.body && !(o.body instanceof FormData)) {
    o.headers['Content-Type'] = 'application/json';
    o.body = JSON.stringify(o.body);
  }
  const r = await fetch(path, o);
  let data = {};
  try { data = await r.json(); } catch {}
  if (!r.ok) {
    if (r.status === 401 && me) { me = null; render(); }
    if (r.status === 403 && data.code === 'gate' && me && !(me.needs && me.needs.length)) { me = null; render(); }
    throw new Error(data.error || t('common.error'));
  }
  return data;
}

function toast(msg, bad) {
  const el = document.createElement('div');
  el.className = 'toast' + (bad ? ' bad' : '');
  el.textContent = msg;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => el.remove(), 3800);
}
const guard = fn => async (...a) => { try { await fn(...a); } catch (e) { toast(e.message, true); } };

function modal(html, cls = '', sticky = false) {
  const o = document.createElement('div');
  o.className = 'overlay';
  o.innerHTML = `<div class="modal ${cls}" role="dialog" aria-modal="true">${html}</div>`;
  if (!sticky) {
    o.addEventListener('mousedown', e => { if (e.target === o) o.remove(); });
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { o.remove(); document.removeEventListener('keydown', k); } });
  }
  document.body.appendChild(o);
  const f = o.querySelector('input,select,textarea'); if (f) f.focus();
  return o;
}
function confirmBox(text, yes) {
  const m = modal(`<h2>${t('common.are_you_sure')}</h2><p>${esc(text)}</p><div class="row"><button class="btn ghost" data-x>${t('common.cancel')}</button><button class="btn danger" data-y>${t('common.yes_continue')}</button></div>`);
  m.querySelector('[data-x]').onclick = () => m.remove();
  m.querySelector('[data-y]').onclick = guard(async () => { await yes(); m.remove(); });
}

// ---------- Auth screen ----------
function authView(keep) {
  $app.innerHTML = `
  <div class="auth">
    <section class="auth-hero">
      <div class="brand"><span class="logo">D4</span> D4LT Learn</div>
      <div>
        <h1>${t('app.hero_title')}</h1>
        <p>${t('app.hero_text')}</p>
      </div>
      <div class="foot">D4LT Computer Studies</div>
    </section>
    <section class="auth-panel">
      ${prefsHTML('float')}
      <div class="auth-card">
        <div class="tabs" role="tablist">
          <button role="tab" aria-selected="true" data-t="login">${t('app.sign_in')}</button>
          <button role="tab" aria-selected="false" data-t="reg">${t('app.register')}</button>
        </div>
        <form id="af" autocomplete="on" novalidate>
          <div id="aerr"></div>
          <div class="field hidden" id="nf"><label for="an">${t('app.full_name')}</label><input id="an" type="text" autocomplete="name" maxlength="80"></div>
          <div class="field"><label for="ae">${t('app.email')}</label><input id="ae" type="email" autocomplete="email" required maxlength="254"></div>
          ${pwField('ap', t('app.password'), 'current-password')}
          <div class="hidden" id="rg">
            ${pwMeterHTML('apm')}
            ${pwField('ap2', t('app.confirm_password'), 'new-password')}
            <label class="chk"><input type="checkbox" id="aterms"> <span>${t('app.accept_prefix')} <a href="#" data-terms>${t('app.terms_link')}</a></span></label>
          </div>
          <button class="btn sun" style="width:100%;margin-top:.6rem" id="asub">${t('app.sign_in')}</button>
        </form>
      </div>
    </section>
  </div>`;
  let mode = 'login';
  bindPwMeter(document.getElementById('ap'), document.getElementById('apm'));
  const setMode = m => {
    mode = m;
    document.querySelectorAll('.tabs button').forEach(x => x.setAttribute('aria-selected', x.dataset.t === mode));
    document.getElementById('nf').classList.toggle('hidden', mode === 'login');
    document.getElementById('rg').classList.toggle('hidden', mode === 'login');
    document.getElementById('asub').textContent = mode === 'login' ? t('app.sign_in') : t('app.create_account');
    document.getElementById('ap').autocomplete = mode === 'login' ? 'current-password' : 'new-password';
    document.getElementById('aerr').innerHTML = '';
  };
  document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => setMode(b.dataset.t));
  if (keep) {   // language switched: restore what the person had typed
    setMode(keep.mode);
    ['an', 'ae', 'ap', 'ap2'].forEach(id => { document.getElementById(id).value = keep[id] || ''; });
    document.getElementById('aterms').checked = !!keep.aterms;
    document.getElementById('ap').dispatchEvent(new Event('input'));
  }
  document.getElementById('af').onsubmit = async e => {
    e.preventDefault();
    const err = x => { document.getElementById('aerr').innerHTML = `<div class="err">${esc(x)}</div>`; };
    const body = { email: ae.value, password: ap.value };
    if (mode === 'reg') {
      if (an.value.trim().length < 2) return err(t('app.err_name'));
      if (!pwOk(ap.value)) return err(weakMsg());
      if (ap.value !== ap2.value) return err(t('app.err_pw_mismatch'));
      if (!aterms.checked) return err(t('app.err_terms'));
      body.name = an.value; body.accept_terms = true;
    }
    try {
      await api(mode === 'login' ? '/api/login' : '/api/register', { method: 'POST', body });
      me = await api('/api/me');
      location.hash = '#/';
      render();
    } catch (er) {
      err(er.message);
    }
  };
}
function authState() {
  const g = id => (document.getElementById(id) || {}).value || '';
  const sel = document.querySelector('.tabs button[aria-selected=true]');
  return { mode: sel ? sel.dataset.t : 'login', an: g('an'), ae: g('ae'), ap: g('ap'), ap2: g('ap2'), aterms: (document.getElementById('aterms') || {}).checked };
}

// ---------- Shell ----------
function shell(active, inner) {
  const nav = [['#/', 'home', t('app.nav_courses')]];
  if (me.role === 'admin') nav.push(['#/teachers', 'teacher', t('app.nav_teachers')], ['#/students', 'students', t('app.nav_students')], ['#/payments', 'card', t('pay.nav')], ['#/audit', 'shield', t('app.nav_security')]);
  nav.push(['#/notifications', 'bell', t('app.nav_notifications')], ['#/account', 'user', t('app.nav_account')]);
  $app.innerHTML = `
  <div class="topbar"><div class="brand"><span class="logo">D4</span> D4LT Learn</div><div class="tb-r">${prefsHTML('dk compact')}<button id="lo2">${t('common.logout')}</button></div></div>
  <div class="shell">
    <aside class="side">
      <div class="brand"><span class="logo">D4</span> D4LT Learn</div>
      <nav aria-label="${t('app.menu')}">${nav.map(n => `<a href="${n[0]}" ${n[0] === active ? 'aria-current="page"' : ''}>${ico(n[1])}<span>${n[2]}</span>${n[0] === '#/notifications' ? '<em class="nbadge hidden"></em>' : ''}</a>`).join('')}</nav>
      ${prefsHTML('dk')}
      <div class="me"><b>${esc(me.name)}</b><span class="role">${roleName(me.role)}</span><button id="lo">${t('common.logout')}</button></div>
    </aside>
    <main class="main" id="main">${inner}</main>
  </div>`;
  const out = guard(async () => { await api('/api/logout', { method: 'POST' }); me = null; resetNotifications(); render(); });
  document.getElementById('lo').onclick = out;
  document.getElementById('lo2').onclick = out;
  updateBadge();
}

function courseCard(c) {
  const pct = c.lesson_count ? Math.round(100 * (c.done_count || 0) / c.lesson_count) : 0;
  return `<a class="course" href="#/course/${c.id}" style="--c:${esc(c.color)}">
    <div class="course-top"><span>${esc(c.class_name || t('app.course'))}</span>${accessBadge(c)}</div>
    <div class="course-body">
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.description).slice(0, 110)}</p>
      ${me.role === 'student' ? `<div class="bar" aria-label="${t('app.progress_aria', { pct })}"><i style="width:${pct}%"></i></div>` : ''}
      <div class="meta">
        <span>${t('app.lessons_n', { n: c.lesson_count })}</span>
        ${me.role === 'student' ? `<span>${t('app.pct_done', { pct })}</span>` : `<span>${t('app.students_n', { n: c.student_count })}</span>`}
        ${c.teacher_name && me.role !== 'teacher' ? `<span>${esc(c.teacher_name)}</span>` : ''}
      </div>
    </div></a>`;
}

// ---------- Dashboard ----------
async function dashboard() {
  if (me.role === 'student') return studentHome();
  const courses = await api('/api/courses');
  let stats = '';
  if (me.role === 'admin') {
    const s = await api('/api/stats');
    stats = `<div class="stats">
      <div class="stat"><b>${s.students}</b><span>${t('app.stat_students')}</span></div>
      <div class="stat"><b>${s.teachers}</b><span>${t('app.stat_teachers')}</span></div>
      <div class="stat"><b>${s.courses}</b><span>${t('app.stat_courses')}</span></div>
      <div class="stat"><b>${s.lessons}</b><span>${t('app.stat_lessons')}</span></div></div>`;
  }
  const joinBox = me.role === 'student' ? `
    <div class="join"><div><h2>${t('app.have_code')}</h2><p>${t('app.have_code_sub')}</p></div>
    <form id="jf"><input id="jc" maxlength="9" placeholder="ABCD-EFGH" aria-label="${t('app.code_aria')}" autocomplete="off" autocapitalize="characters" required><button class="btn sun">${t('app.join')}</button></form></div>` : '';
  const head = `<div class="page-head"><div><h1>${me.role === 'student' ? t('app.h_my_courses') : me.role === 'teacher' ? t('app.h_teaching') : t('app.h_all_courses')}</h1>
    <p class="muted">${t('app.welcome', { name: esc(me.name.split(' ')[0]) })}</p></div>
    ${me.role === 'admin' ? `<button class="btn" id="newc">${t('app.new_course')}</button>` : ''}</div>`;
  const list = courses.length ? `<div class="grid">${courses.map(courseCard).join('')}</div>` :
    `<div class="empty"><b>${me.role === 'student' ? t('app.empty_student') : me.role === 'teacher' ? t('app.empty_teacher') : t('app.empty_admin')}</b>
     ${me.role === 'student' ? t('app.empty_student_sub') : me.role === 'admin' ? t('app.empty_admin_sub') : t('app.empty_teacher_sub')}</div>`;
  shell('#/', head + profileBannerHTML() + stats + joinBox + list);

  const jf = document.getElementById('jf');
  if (jf) jf.onsubmit = guard(async e => {
    e.preventDefault();
    const r = await api('/api/join', { method: 'POST', body: { code: jc.value } });
    toast(t('app.joined', { title: r.course.title }));
    location.hash = '#/course/' + r.course.id;
  });
  const nc = document.getElementById('newc');
  if (nc) nc.onclick = () => courseForm();
}

async function courseForm(existing) {
  const teachers = await api('/api/teachers');
  const c = existing || { title: '', description: '', class_name: '', teacher_id: '', color: COLORS[1], access: 'free', price: 0 };
  const m = modal(`<h2>${existing ? t('app.edit_course') : t('app.new_course').replace(/^\+\s*/, '')}</h2>
    <form id="cf">
      <div class="field"><label>${t('app.course_title')}</label><input type="text" id="ct" value="${esc(c.title)}" required placeholder="${esc(t('app.course_title_ph'))}"></div>
      <div class="field"><label>${t('app.class_group')}</label><input type="text" id="cc" value="${esc(c.class_name)}" placeholder="${esc(t('app.class_ph'))}"></div>
      <div class="field"><label>${t('app.short_desc')}</label><textarea id="cd">${esc(c.description)}</textarea></div>
      <div class="field"><label>${t('app.course_teacher')}</label><select id="cte"><option value="">${t('app.not_assigned')}</option>
        ${teachers.map(u => `<option value="${u.id}" ${u.id === c.teacher_id ? 'selected' : ''}>${esc(u.name)}</option>`).join('')}</select></div>
      <div class="field"><label>${t('app.access')}</label>
        <div class="seg2" role="radiogroup"><label><input type="radio" name="acc" value="free" ${c.access !== 'vip' ? 'checked' : ''}> ${t('pay.free')} — ${t('app.access_free_hint')}</label>
        <label><input type="radio" name="acc" value="vip" ${c.access === 'vip' ? 'checked' : ''}> ${t('pay.vip')} — ${t('app.access_vip_hint')}</label></div></div>
      <div class="field" id="pricef" ${c.access === 'vip' ? '' : 'hidden'}><label for="cpr">${t('app.price_label')}</label>
        <input type="number" id="cpr" min="0" step="500" value="${c.price || ''}" placeholder="10000"><small class="muted">${t('app.price_hint')}</small></div>
      <div class="field"><label>${t('app.colour')}</label><div class="swatches">${COLORS.map(k => `<label><input type="radio" name="col" value="${k}" ${k === c.color ? 'checked' : ''}><span style="background:${k}"></span></label>`).join('')}</div></div>
      <div class="row"><button type="button" class="btn ghost" data-x>${t('common.cancel')}</button><button class="btn">${t('common.save')}</button></div>
    </form>`);
  m.querySelectorAll('input[name=acc]').forEach(r => r.onchange = () => { m.querySelector('#pricef').hidden = m.querySelector('input[name=acc]:checked').value !== 'vip'; });
  m.querySelector('[data-x]').onclick = () => m.remove();
  m.querySelector('#cf').onsubmit = guard(async e => {
    e.preventDefault();
    const body = { title: ct.value, class_name: cc.value, description: cd.value, teacher_id: cte.value || null,
      color: (m.querySelector('input[name=col]:checked') || {}).value,
      access: m.querySelector('input[name=acc]:checked').value, price: +(m.querySelector('#cpr').value || 0) };
    if (existing) await api('/api/courses/' + existing.id, { method: 'PUT', body });
    else await api('/api/courses', { method: 'POST', body });
    m.remove(); toast(t('common.saved')); render();
  });
}

// ---------- Course view ----------
function ytEmbed(u) {
  const m = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? 'https://www.youtube.com/embed/' + m[1] : null;
}

// ---------- Several materials per topic: file picker + uploader ----------
const MAT_ACCEPT = '.mp4,.webm,.mov,.m4v,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.odt,.odp,.ods,.rtf,.txt,.csv,video/*';
const fmtSize = n => n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
function matFields(p) {
  return `<div class="field"><label for="${p}file">${t('app.file_label')}</label>
      <div class="drop"><input id="${p}file" type="file" multiple accept="${MAT_ACCEPT}"></div>
      <ul class="filelist" id="${p}list"></ul>
      <small class="muted">${t('app.pick_hint')} ${t('app.file_note')}</small>
      <label class="chk"><input type="checkbox" id="${p}dl"> ${t('app.allow_dl')}</label></div>
    <div class="field"><label for="${p}urls">${t('app.or_links')}</label><textarea id="${p}urls" placeholder="https://" style="min-height:64px"></textarea></div>`;
}
// Keeps the chosen files in a list so people can pick in several steps; returns { files(), urls() }
function bindMatFields(root, p) {
  let files = [];
  const input = root.querySelector('#' + p + 'file'), list = root.querySelector('#' + p + 'list');
  const draw = () => {
    list.innerHTML = files.map((f, i) => `<li><span class="fn">${esc(f.name)}</span><span class="muted">${fmtSize(f.size)}</span><button type="button" class="btn ghost sm" data-rf="${i}" aria-label="${t('app.remove_file')}">×</button></li>`).join('');
    list.querySelectorAll('[data-rf]').forEach(b => b.onclick = () => { files.splice(+b.dataset.rf, 1); draw(); });
  };
  input.onchange = () => {
    [...input.files].forEach(f => { if (!files.some(x => x.name === f.name && x.size === f.size)) files.push(f); });
    input.value = ''; draw();
  };
  return { files: () => files, urls: () => root.querySelector('#' + p + 'urls').value, download: () => root.querySelector('#' + p + 'dl').checked };
}
// Sends the chosen files + links. onProgress(pct) is called while uploading. Resolves with the JSON answer.
function sendMaterials(url, picker, extra, onProgress) {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    Object.entries(extra || {}).forEach(([k, v]) => fd.append(k, v));
    picker.files().forEach(f => fd.append('files', f));
    if (picker.urls().trim()) fd.append('urls', picker.urls());
    if (picker.download && picker.download()) fd.append('downloadable', '1');
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = ev => { if (ev.lengthComputable) onProgress(Math.round(100 * ev.loaded / ev.total)); };
    xhr.onload = () => {
      let r = {}; try { r = JSON.parse(xhr.responseText); } catch {}
      if (xhr.status === 200) resolve(r); else reject(new Error(r.error || t('app.upload_failed')));
    };
    xhr.onerror = () => reject(new Error(t('app.network_lost')));
    xhr.open('POST', url);
    const lh = LANG_HEADERS(); for (const k in lh) xhr.setRequestHeader(k, lh[k]);
    xhr.send(fd);
  });
}
const kindLabel = k => (k === 'video' ? t('app.k_video') : k === 'pdf' ? t('app.k_doc') : t('app.k_link'));
const itemName = (it, i) => it.name || t('app.mat_default', { kind: kindLabel(it.kind), n: i + 1 });
const curItem = {};   // selected material per topic

function addMaterialsModal(topic, done) {
  const m = modal(`<h2>${t('app.add_materials_h')}</h2><p class="muted">${esc(topic.title)}</p>
    <form id="amf">${matFields('am')}
      <div class="prog hidden" id="ampg"><i></i></div>
      <div class="row"><button type="button" class="btn ghost" data-x>${t('common.cancel')}</button><button class="btn" id="amsub">${t('app.add_materials')}</button></div></form>`, 'wide', true);
  const picker = bindMatFields(m, 'am');
  m.querySelector('[data-x]').onclick = () => m.remove();
  m.querySelector('#amf').onsubmit = async e => {
    e.preventDefault();
    if (!picker.files().length && !picker.urls().trim()) return toast(t('app.nothing_picked'), true);
    const btn = m.querySelector('#amsub'), pg = m.querySelector('#ampg'), bar = pg.querySelector('i');
    pg.classList.remove('hidden'); btn.disabled = true;
    try {
      await sendMaterials(`/api/lessons/${topic.id}/materials`, picker, {}, pct => { bar.style.width = pct + '%'; btn.textContent = t('app.uploading_pct', { pct }); });
      m.remove(); toast(t('app.materials_added')); done();
    } catch (er) { toast(er.message, true); btn.disabled = false; btn.textContent = t('app.add_materials'); pg.classList.add('hidden'); }
  };
}

async function courseView(id) {
  const d = await api('/api/courses/' + id);
  const { course: c, lessons } = d;
  const manage = me.role !== 'student';
  let current = lessons.find(l => l.id === lastLesson[id])
    || (me.role === 'student' ? lessons.find(l => !l.done) : null) || lessons[0] || null;
  if (current) lastLesson[id] = current.id;

  shell('#/', `
    <a class="crumb" href="#/">${ico('back')} ${t('app.nav_courses')}</a>
    <section class="course-head" style="--c:${esc(c.color)}">
      <h1>${esc(c.title)}</h1>
      <p>${esc([c.class_name, c.teacher_name && t('app.teacher_lbl', { name: c.teacher_name })].filter(Boolean).join(' · '))}</p>
      ${c.description ? `<p style="margin-top:.5rem">${esc(c.description)}</p>` : ''}
    </section>
    ${teacherCardHTML(d.teacher)}
    <div id="meetings"></div>
    <div class="learn">
      <div class="player" id="player"></div>
      <aside class="lessons" id="lessons"></aside>
    </div>
    <div id="exam"></div>
    <div id="essays"></div>
    <div id="manage"></div>`);

  function drawLessons() {
    const el = document.getElementById('lessons');
    el.innerHTML = `<h3>${t('app.lessons_h', { n: lessons.length })}</h3>` + (lessons.length ? lessons.map(l => `
      <button class="lesson" data-id="${l.id}" ${current && current.id === l.id ? 'aria-current="true"' : ''}>
        <span class="k ${l.kind}">${ico(l.kind)}</span>
        <span class="t"><b>${esc(l.title)}</b><small>${l.items.length > 1 ? t('app.materials_n', { n: l.items.length }) : kindLabel(l.kind)}${l.quiz_count ? ` · Quiz${me.role === 'student' ? (l.best == null ? '' : ' ' + Math.round(l.best) + '%') : ' (' + l.quiz_count + ')'}` : ''}</small></span>
        ${me.role === 'student' ? `<span class="tick ${l.done ? 'on' : ''}">${l.done ? ico('check') : ''}</span>` : ''}
      </button>`).join('') : `<p class="muted" style="padding:.6rem">${t('app.no_lessons')}</p>`);
    el.querySelectorAll('.lesson').forEach(b => b.onclick = () => {
      current = lessons.find(l => l.id === +b.dataset.id);
      lastLesson[id] = current.id;
      drawLessons(); drawPlayer();
      if (window.innerWidth <= 1100) document.getElementById('player').scrollIntoView({ behavior: 'smooth' });
    });
  }

  function drawPlayer() {
    const p = document.getElementById('player');
    if (!current) {
      p.innerHTML = `<div class="screen" style="padding:2rem"><div><b class="t">${t('app.no_lesson_title')}</b><br>${manage ? t('app.no_lesson_add') : t('app.no_lesson_student')}</div></div>`;
      return;
    }
    const l = current;
    const items = l.items || [{ id: l.id, kind: l.kind, url: l.url, name: null }];
    const itIdx = Math.max(0, items.findIndex(x => x.id === curItem[l.id]));
    const it = items[itIdx];
    let screen;
    if (it.kind === 'video') screen = `<div class="screen"><video controls playsinline preload="metadata" controlslist="nodownload" src="/files/${it.id}"></video></div>`;
    else if (it.kind === 'pdf') screen = '<div class="screen doc" id="docscreen"></div>';
    else {
      const y = ytEmbed(it.url);
      screen = y ? `<div class="screen"><iframe src="${y}" allowfullscreen title="${esc(itemName(it, itIdx))}"></iframe></div>`
        : `<div class="screen" style="padding:2rem"><a class="btn sun" href="${esc(safeUrl(it.url))}" target="_blank" rel="noopener">${t('app.open_link')}</a></div>`;
    }
    const tabs = items.length > 1 ? `<div class="mats" role="tablist">${items.map((x, i) => `<button type="button" role="tab" class="mat" data-mi="${x.id}" aria-selected="${i === itIdx}"><span class="k ${x.kind}">${ico(x.kind)}</span><span class="mn">${esc(itemName(x, i))}</span></button>`).join('')}</div>` : '';
    const dlBtn = it.downloadable && me.role === 'student' ? `<a class="btn ghost" id="dlf" href="/files/${it.id}?download=1" download>${t('app.download')}</a>` : '';
    p.innerHTML = tabs + screen + `<div class="player-info"><div><h2>${esc(l.title)}</h2>${d.teacher ? `<p class="muted" style="margin:0 0 .2rem;font-size:.9rem">${esc(t('prof.uploaded_by', { name: d.teacher.name }))}${d.teacher.username ? ' (@' + esc(d.teacher.username) + ')' : ''}</p>` : ''}${l.description ? `<p class="muted" style="margin:0">${esc(l.description)}</p>` : ''}</div>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap">
        ${dlBtn}${manage && it.kind !== 'link' ? `<button class="btn ghost" id="dltg">${it.downloadable ? t('app.dl_off') : t('app.dl_on')}</button>` : ''}
        ${me.role === 'student' ? `<button class="btn ${l.done ? 'ghost' : ''}" id="dn">${l.done ? t('app.done_undo') : t('app.mark_done')}</button>` : ''}
        ${manage ? `<button class="btn ghost" id="am">${t('app.add_materials')}</button>${itIdx > 0 ? `<button class="btn danger" id="dm">${t('app.remove_material')}</button>` : ''}<button class="btn ghost" id="qe">${t('app.quiz_btn', { n: l.quiz_count })}</button><button class="btn danger" id="dl">${t('app.delete_lesson')}</button>` : ''}
      </div></div>` + quizBox(l);
    if (it.kind === 'pdf') drawDocViewer({ id: it.id, title: itemName(it, itIdx) });
    p.querySelectorAll('.mat').forEach(b => b.onclick = () => { curItem[l.id] = +b.dataset.mi; drawPlayer(); });
    const dltg = document.getElementById('dltg');
    if (dltg) dltg.onclick = guard(async () => { await api(`/api/lessons/${it.id}/downloadable`, { method: 'PUT', body: { downloadable: !it.downloadable } }); toast(t('common.saved')); render(); });
    const am = document.getElementById('am');
    if (am) am.onclick = () => addMaterialsModal(l, render);
    const dm = document.getElementById('dm');
    if (dm) dm.onclick = () => confirmBox(t('app.confirm_remove_material', { name: itemName(it, itIdx) }), async () => { await api('/api/lessons/' + it.id, { method: 'DELETE' }); toast(t('app.deleted')); delete curItem[l.id]; render(); });
    const dn = document.getElementById('dn');
    if (dn) dn.onclick = guard(async () => {
      await api(`/api/lessons/${l.id}/done`, { method: 'POST', body: { done: !l.done } });
      if (!l.done) {
        // Finished: open the quiz if there is one, otherwise move on to the next lesson
        if (l.quiz_count && !l.passed) pendingQuiz = l.id;
        else { const nx = lessons[lessons.indexOf(l) + 1]; if (nx) lastLesson[id] = nx.id; toast(t('app.congrats')); }
      }
      render();
    });
    const qb = document.getElementById('qstart');
    if (qb) qb.onclick = () => openQuiz(l, id, render);
    const qe = document.getElementById('qe');
    if (qe) qe.onclick = () => quizEditor(l, id, render);
    const dl = document.getElementById('dl');
    if (dl) dl.onclick = () => confirmBox(t('app.confirm_delete_lesson', { title: l.title }), async () => { await api('/api/lessons/' + l.id, { method: 'DELETE' }); toast(t('app.deleted')); render(); });
  }

  drawLessons(); drawPlayer();
  drawExam(d, id, render);
  drawMeetings(id, manage).catch(e => toast(e.message, true));
  if (manage) drawEssays(id).catch(e => toast(e.message, true));
  if (pendingQuiz) {
    const pl = lessons.find(x => x.id === pendingQuiz);
    pendingQuiz = null;
    if (pl) openQuiz(pl, id, render);
  }

  if (manage) {
    const st = d.students || [];
    document.getElementById('manage').innerHTML = `
    <div class="two">
      <section class="panel">
        <h2>${t('app.add_lesson')}</h2>
        <form id="lf">
          <div class="field"><label for="lt">${t('app.lesson_title')}</label><input id="lt" type="text" required placeholder="${esc(t('app.lesson_title_ph'))}"></div>
          <div class="field"><label for="ld">${t('app.optional_desc')}</label><textarea id="ld" style="min-height:64px"></textarea></div>
          ${matFields('l')}
          <div class="prog hidden" id="pg"><i></i></div>
          <button class="btn" id="lsub" style="margin-top:.8rem">${t('app.upload_lesson')}</button>
        </form>
      </section>
      <section class="panel">
        <h2>${t('app.students_h', { n: st.length })}</h2>
        ${st.length ? `<div class="table-wrap" style="border:0"><table><thead><tr><th>${t('app.col_name')}</th><th>${t('app.col_code')}</th><th>${t('app.col_lessons')}</th><th>${t('app.col_quiz')}</th><th>${t('app.col_exam')}</th><th></th></tr></thead><tbody>
          ${st.map(s => `<tr><td>${esc(s.name)}<br><small class="muted">${esc(s.email)}</small></td>
          <td>${s.invite_label ? esc(s.invite_label) + '<br><small class="muted">' + esc(fmtCode(s.invite_code)) + '</small>' : '<small class="muted">—</small>'}</td><td>${s.done}/${lessons.length}</td>
          <td>${s.quiz_passed}/${s.quiz_total}</td><td>${s.exam_best == null ? '—' : s.exam_best + '%'}</td>
          <td><button class="btn danger sm" data-rm="${s.id}">${t('app.remove_student')}</button></td></tr>`).join('')}</tbody></table></div>`
        : `<p class="muted">${t('app.no_students')}</p>`}
        ${me.role === 'admin' ? `<div style="margin-top:1rem;display:flex;gap:.5rem;flex-wrap:wrap">
          <button class="btn ghost sm" id="ec">${t('app.edit_course')}</button>
          <button class="btn danger sm" id="dc">${t('app.delete_lesson')}</button></div>` : ''}
      </section>
    </div>
    <div id="invites"></div>`;
    drawInvites(id, render, null, c).catch(e => toast(e.message, true));

    const topicPicker = bindMatFields(document.getElementById('lf'), 'l');
    document.getElementById('lf').onsubmit = async e => {
      e.preventDefault();
      if (!topicPicker.files().length && !topicPicker.urls().trim()) return toast(t('app.nothing_picked'), true);
      const pg = document.getElementById('pg'), bar = pg.querySelector('i'), btn = document.getElementById('lsub');
      pg.classList.remove('hidden'); btn.disabled = true; btn.textContent = t('app.uploading');
      try {
        await sendMaterials(`/api/courses/${id}/lessons`, topicPicker, { title: lt.value, description: ld.value }, pct => { bar.style.width = pct + '%'; btn.textContent = t('app.uploading_pct', { pct }); });
        toast(t('app.lesson_uploaded')); render();
      } catch (er) { toast(er.message, true); btn.disabled = false; btn.textContent = t('app.upload_lesson'); pg.classList.add('hidden'); }
    };
    document.querySelectorAll('[data-rm]').forEach(b => b.onclick = () =>
      confirmBox(t('app.confirm_remove_student'), async () => { await api(`/api/courses/${id}/students/${b.dataset.rm}`, { method: 'DELETE' }); render(); }));
    if (me.role === 'admin') {
      document.getElementById('ec').onclick = () => courseForm(c);
      document.getElementById('dc').onclick = () => confirmBox(t('app.confirm_delete_course'), async () => {
        await api('/api/courses/' + id, { method: 'DELETE' }); location.hash = '#/'; });
    }
  }
}

// ---------- Walimu ----------
async function teachersView() {
  const rows = await api('/api/teachers');
  shell('#/teachers', `
    <div class="page-head"><div><h1>${t('app.t_title')}</h1><p class="muted">${t('app.t_sub')}</p></div><button class="btn" id="nt">${t('app.new_teacher')}</button></div>
    ${rows.length ? `<div class="table-wrap"><table><thead><tr><th>${t('app.col_name')}</th><th>${t('app.col_username')}</th><th>${t('app.col_email')}</th><th>${t('app.col_courses')}</th><th></th></tr></thead><tbody>
      ${rows.map(u => `<tr><td>${esc(u.name)}</td><td>${u.username ? '@' + esc(u.username) : '<small class="muted">' + t('prof.no_username') + '</small>'}</td><td>${esc(u.email)}</td><td>${u.courses}</td>
      <td><button class="btn ghost sm" data-pw="${u.id}">${t('app.set_pw')}</button><button class="btn danger sm" data-del="${u.id}">${t('common.delete')}</button></td></tr>`).join('')}</tbody></table></div>`
      : `<div class="empty"><b>${t('app.no_teachers')}</b>${t('app.no_teachers_sub')}</div>`}`);
  document.getElementById('nt').onclick = () => {
    const m = modal(`<h2>${t('app.new_teacher_h')}</h2><form id="tf">
      <div class="field"><label>${t('app.full_name')}</label><input type="text" id="tn" required></div>
      <div class="field"><label>${t('app.email')}</label><input type="email" id="te" required></div>
      <div class="field"><label>${t('app.start_pw')}</label><input type="text" id="tp" required minlength="10" autocomplete="off"><small class="muted">${t('app.start_pw_hint')}</small></div>
      <div class="row"><button type="button" class="btn ghost" data-x>${t('common.cancel')}</button><button class="btn">${t('app.register_btn')}</button></div></form>`);
    m.querySelector('[data-x]').onclick = () => m.remove();
    m.querySelector('#tf').onsubmit = guard(async e => {
      e.preventDefault();
      await api('/api/teachers', { method: 'POST', body: { name: tn.value, email: te.value, password: tp.value } });
      m.remove(); toast(t('app.teacher_registered')); render();
    });
  };
  bindUserActions();
}

async function studentsView() {
  const rows = await api('/api/students');
  shell('#/students', `
    <div class="page-head"><div><h1>${t('app.s_title')}</h1><p class="muted">${t('app.s_sub', { n: rows.length })}</p></div></div>
    ${rows.length ? `<div class="table-wrap"><table><thead><tr><th>${t('app.col_name')}</th><th>${t('app.col_email')}</th><th>${t('app.col_courses')}</th><th></th></tr></thead><tbody>
      ${rows.map(u => `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${u.courses}</td>
      <td><button class="btn ghost sm" data-pw="${u.id}">${t('app.set_pw')}</button><button class="btn danger sm" data-del="${u.id}">${t('common.delete')}</button></td></tr>`).join('')}</tbody></table></div>`
      : `<div class="empty"><b>${t('app.no_students_yet')}</b>${t('app.no_students_sub')}</div>`}`);
  bindUserActions();
}

function bindUserActions() {
  document.querySelectorAll('[data-del]').forEach(b => b.onclick = () =>
    confirmBox(t('app.confirm_delete_user'), async () => { await api('/api/users/' + b.dataset.del, { method: 'DELETE' }); render(); }));
  document.querySelectorAll('[data-pw]').forEach(b => b.onclick = () => {
    const m = modal(`<h2>${t('app.new_pw_h')}</h2><form id="pf"><div class="field"><label>${t('app.temp_pw')}</label><input type="text" id="np" required minlength="10" autocomplete="off"><small class="muted">${t('app.temp_pw_hint')}</small></div>
      <div class="row"><button type="button" class="btn ghost" data-x>${t('common.cancel')}</button><button class="btn">${t('common.save')}</button></div></form>`);
    m.querySelector('[data-x]').onclick = () => m.remove();
    m.querySelector('#pf').onsubmit = guard(async e => {
      e.preventDefault();
      await api(`/api/users/${b.dataset.pw}/reset`, { method: 'POST', body: { password: np.value } });
      m.remove(); toast(t('app.pw_changed'));
    });
  });
}

function accountView() {
  shell('#/account', `
    <div class="page-head"><div><h1>${t('app.account_h')}</h1><p class="muted">${esc(me.name)} · ${esc(me.email)} · ${roleName(me.role)}</p></div></div>
    <section class="panel" style="max-width:460px;margin-top:0"><h2>${t('app.change_pw_h')}</h2>
      <form id="pwf" novalidate>
        ${pwField('pc', t('app.current_pw'), 'current-password')}
        ${pwField('pn', t('app.new_pw'), 'new-password')}
        ${pwMeterHTML('pnm')}
        ${pwField('pn2', t('app.confirm_new_pw'), 'new-password')}
        <button class="btn">${t('common.save')}</button></form>
      <p class="muted" style="margin:1rem 0 0;font-size:.9rem">${t('app.pw_other_devices')}</p></section>
    ${me.role === 'teacher' ? profilePanelHTML() : ''}
    <section class="panel" style="max-width:460px"><h2>${t('app.terms_h')}</h2>
      <p class="muted">${t('app.terms_sub')}</p>
      <a href="#" class="btn ghost" data-terms>${t('app.read_terms')}</a></section>`);
  bindPwMeter(pn, document.getElementById('pnm'));
  bindProfilePanel();
  document.getElementById('pwf').onsubmit = guard(async e => {
    e.preventDefault();
    if (!pwOk(pn.value)) throw new Error(weakMsg());
    if (pn.value !== pn2.value) throw new Error(t('app.err_new_pw_mismatch'));
    await api('/api/me/password', { method: 'POST', body: { current: pc.value, next: pn.value } });
    toast(t('app.pw_changed')); e.target.reset(); bindPwMeter(pn, document.getElementById('pnm'));
  });
}

// ---------- Router ----------
async function render() {
  if (!me) {
    try { me = await api('/api/me'); } catch { return authView(); }
  }
  if (me.needs && me.needs.length) return gateView();
  startNotifPolling();
  const h = location.hash || '#/';
  try {
    let m;
    if ((m = h.match(/^#\/course\/(\d+)/))) await courseView(+m[1]);
    else if (me.role === 'student' && (m = h.match(/^#\/browse\/(\d+)/))) await browseView(+m[1]);
    else if (h === '#/teachers' && me.role === 'admin') await teachersView();
    else if (h === '#/students' && me.role === 'admin') await studentsView();
    else if (h === '#/notifications') await notificationsView();
    else if (me.role === 'student' && (m = h.match(/^#\/pay\/(\d+)/))) await payView(+m[1]);
    else if (h === '#/payments' && me.role === 'admin') await paymentsView();
    else if (h === '#/audit' && me.role === 'admin') await auditView();
    else if (h === '#/account') accountView();
    else await dashboard();
  } catch (e) {
    toast(e.message, true);
    if (h !== '#/') location.hash = '#/';
  }
}
window.addEventListener('hashchange', render);
// Language switch: redraw the current screen (keep what was typed on the sign-in form)
document.addEventListener('langchange', () => {
  if (!me && document.querySelector('.auth')) return authView(authState());
  render();
});
render();
