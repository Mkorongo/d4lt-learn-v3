'use strict';
// Quiz and exam UI. Uses esc, api, modal, toast, guard, confirmBox, me from app.js; t/addStrings from i18n.js

addStrings({
  en: {
    'quiz.type_mcq': 'Multiple choice', 'quiz.type_match': 'Matching', 'quiz.type_short': 'Short answer',
    'quiz.lesson_quiz': 'Quiz for this lesson',
    'quiz.questions_n': 'Questions: {n}',
    'quiz.unlock_hint': 'Click "I\'ve finished this lesson" to unlock it.',
    'quiz.not_taken': 'You haven\'t taken it yet.',
    'quiz.best_score': 'Your best score: {pct}',
    'quiz.passed': 'Passed', 'quiz.below_pass': 'Still below 50%',
    'quiz.start': 'Start quiz', 'quiz.retake': 'Retake quiz',
    'quiz.type_points': '{type} · {n} points',
    'quiz.answer_for': 'Answer for {x}', 'quiz.choose': '— choose —', 'quiz.type_answer': 'Type your answer',
    'quiz.congrats': 'Congratulations, you passed!', 'quiz.not_reached': 'You haven\'t reached {pass}% yet',
    'quiz.result_sub': '{title} · {right} correct out of {count}',
    'quiz.missed': 'Questions you missed ({n})', 'quiz.your_answer': 'Your answer', 'quiz.correct_answer': 'Correct answer',
    'quiz.earned': 'You earned {a} out of {b}', 'quiz.all_correct': 'You answered every question correctly.',
    'quiz.title': 'Quiz: {title}', 'quiz.need_pass': 'Questions: {n}. You need at least {pass}% to pass.',
    'quiz.later': 'I\'ll do it later', 'quiz.submit': 'Submit answers',
    'quiz.confirm_unanswered': 'You have {n} unanswered question(s). Submit anyway?',
    'quiz.results': 'Quiz results',
    'quiz.exam_title': 'Final exam: {title}',
    'quiz.exam_intro': 'Questions: {n}. Make sure you have answered everything before submitting. If you close this window, you can continue this same exam later.',
    'quiz.close_for_now': 'Close for now', 'quiz.submit_exam': 'Submit exam',
    'quiz.confirm_exam_unanswered': 'You have {n} unanswered question(s). Submit the exam now? You cannot change it afterwards.',
    'quiz.confirm_exam': 'Submit the exam now? You cannot change it afterwards.',
    'quiz.exam_results': 'Exam results', 'quiz.can_retry': 'You have another chance to take the exam.',
    'quiz.final_exam': 'Final exam',
    'quiz.exam_not_ready': 'The teacher hasn\'t prepared the final exam yet.',
    'quiz.exam_unlock_after': 'The exam will unlock once you complete the following:',
    'quiz.unlimited': 'unlimited', 'quiz.left_n': '{n} left',
    'quiz.exam_open': 'The exam is open. Questions: {n}. Attempts: {left}.',
    'quiz.exam_continue': 'Continue exam', 'quiz.exam_again': 'Take exam again', 'quiz.exam_start': 'Start exam',
    'quiz.exam_all_used': 'You have used all attempts for this exam.',
    'quiz.bank_count': 'Questions in the bank:', 'quiz.each_gets': 'Each student gets:', 'quiz.all': 'all',
    'quiz.attempts': 'Attempts:', 'quiz.manage_exam': 'Manage exam',
    'quiz.edit_question': 'Edit question', 'quiz.new_question': 'New question',
    'quiz.q_type': 'Question type', 'quiz.q_points': 'Points for this question', 'quiz.q_text': 'Question',
    'quiz.save_question': 'Save question', 'quiz.correct_aria': 'Correct answer', 'quiz.option_n': 'Option {n}',
    'quiz.options_label': 'Options (mark the correct answer with the circle)', 'quiz.add_option': '+ Add option',
    'quiz.pairs_label': 'Matching pairs (left and right). The student will see the right side shuffled.',
    'quiz.add_pair': '+ Add pair',
    'quiz.accepted_label': 'Accepted answers (one answer per line)',
    'quiz.accepted_ph': 'e.g.&#10;RAM&#10;Random Access Memory',
    'quiz.accepted_hint': 'Upper/lower case and punctuation don\'t matter.',
    'quiz.item_ph': 'Item', 'quiz.match_ph': 'Matching answer',
    'quiz.max_options': 'Maximum 6 options', 'quiz.max_pairs': 'Maximum 8 pairs', 'quiz.min_two': 'At least two are required',
    'quiz.no_questions': 'No questions yet', 'quiz.click_new': 'Click "+ New question".',
    'quiz.edit': 'Edit',
    'quiz.editor_intro': 'Shown to students after they click "I\'ve finished this lesson". Questions: {n} of {max}. Passing is {pass}% or more.',
    'quiz.new_q_btn': '+ New question', 'quiz.max_reached': 'You have reached the maximum of 10 questions.',
    'quiz.q_added': 'Question added', 'quiz.q_saved': 'Saved', 'quiz.delete_q': 'Delete this question?',
    'quiz.exam_editor_title': 'Course final exam',
    'quiz.exam_editor_intro': 'Unlocks for a student once they complete all lessons and score at least 50% on every quiz. The bank has {n} questions.',
    'quiz.exam_count_label': 'Number of questions per student',
    'quiz.exam_count_hint': '0 = all questions. A number smaller than the bank picks questions at random.',
    'quiz.exam_attempts_label': 'Number of exam attempts',
    'quiz.exam_attempts_hint': '0 = unlimited. Default is 1.',
    'quiz.save_settings': 'Save settings', 'quiz.settings_saved': 'Settings saved',
    'quiz.type_essay': 'Essay / explanation',
    'quiz.essay_files': 'Files for the student', 'quiz.essay_files_hint': 'Optional. Up to 5 files of any type (zip, PDF, Word…), 100 MB each. Students can download them.',
    'quiz.essay_current': 'Current files (tick to remove)', 'quiz.essay_points': 'Total marks for this question',
    'quiz.essay_points_hint': 'A student who scores {half} or more (half of the marks) passes. Below that, they must try again.',
    'quiz.essay_files_n': '{n} file(s)', 'quiz.uploading': 'Uploading…',
    'quiz.essay_download': 'Download files', 'quiz.essay_your': 'Your answer',
    'quiz.essay_write': 'Write your answer', 'quiz.essay_upload': 'Or upload your answer file (any type, up to 50 MB)',
    'quiz.essay_submit': 'Submit answer', 'quiz.essay_resubmit': 'Submit new answer', 'quiz.essay_sent': 'Answer submitted',
    'quiz.essay_need': 'Write your answer or choose a file',
    'quiz.st_notmarked': 'Not marked', 'quiz.st_marked': 'Marked', 'quiz.st_passed': 'Passed', 'quiz.st_failed': 'Failed',
    'quiz.essay_wait': 'Waiting for your teacher to mark it.',
    'quiz.essay_score': 'Score: {a} / {b} (pass mark {c})', 'quiz.essay_retry': 'You did not reach the pass mark. Please try this question again.',
    'quiz.essay_feedback': 'Teacher\'s comment', 'quiz.essay_pass_hint': 'Pass mark: {c} or more.',
    'quiz.essay_note': 'Essay questions are marked by your teacher. Submit each one on its own card.',
    'quiz.essay_summary': 'Essay questions: {passed}/{total} passed{pending}', 'quiz.essay_pending_n': ' · {n} waiting to be marked',
    'quiz.close': 'Close', 'quiz.open': 'Open', 'quiz.download': 'Download', 'quiz.hide': 'Hide', 'quiz.no_preview': 'This file type cannot be opened here. Please download it.',
    'quiz.loading': 'Loading…', 'quiz.truncated': '(Only the first part is shown. Download the file to read all of it.)', 'quiz.preview_fail': 'The file could not be opened here. Please download it.',
    'quiz.ess_title': 'Essay answers to mark', 'quiz.ess_pending': '{n} waiting',
    'quiz.ess_none': 'No answers yet', 'quiz.ess_none_sub': 'Essay answers from students will appear here.',
    'quiz.ess_student': 'Student', 'quiz.ess_question': 'Question', 'quiz.ess_when': 'Submitted', 'quiz.ess_status': 'Status',
    'quiz.ess_mark': 'Mark', 'quiz.ess_view': 'View / edit marks', 'quiz.ess_text': 'Written answer', 'quiz.ess_nofile': 'No file uploaded',
    'quiz.ess_file': 'Answer file', 'quiz.ess_notext': '(no written answer)', 'quiz.ess_score': 'Marks (out of {n})',
    'quiz.ess_feedback': 'Comment for the student (optional)', 'quiz.ess_save': 'Save marks', 'quiz.ess_saved': 'Marks saved',
    'quiz.ess_old': 'The student has sent a newer answer. Close this and open the latest one.',
    'quiz.ess_allmarked': 'All answers are marked', 'quiz.ess_all': 'Show all', 'quiz.ess_only_pending': 'Show only not marked'
  },
  sw: {
    'quiz.type_mcq': 'Chaguo nyingi', 'quiz.type_match': 'Linganisha', 'quiz.type_short': 'Jibu fupi',
    'quiz.lesson_quiz': 'Quiz ya somo hili',
    'quiz.questions_n': 'Maswali {n}',
    'quiz.unlock_hint': 'Bofya "Nimemaliza somo hili" ili kuifungua.',
    'quiz.not_taken': 'Bado hujaifanya.',
    'quiz.best_score': 'Alama yako bora: {pct}',
    'quiz.passed': 'Umefaulu', 'quiz.below_pass': 'Bado chini ya 50%',
    'quiz.start': 'Anza quiz', 'quiz.retake': 'Rudia quiz',
    'quiz.type_points': '{type} · alama {n}',
    'quiz.answer_for': 'Jibu la {x}', 'quiz.choose': '— chagua —', 'quiz.type_answer': 'Andika jibu lako',
    'quiz.congrats': 'Hongera, umefaulu!', 'quiz.not_reached': 'Bado hujafikia {pass}%',
    'quiz.result_sub': '{title} · umejibu sahihi {right} kati ya {count}',
    'quiz.missed': 'Maswali uliyokosa ({n})', 'quiz.your_answer': 'Jibu lako', 'quiz.correct_answer': 'Jibu sahihi',
    'quiz.earned': 'Umepata {a} kati ya {b}', 'quiz.all_correct': 'Umejibu maswali yote kwa usahihi.',
    'quiz.title': 'Quiz: {title}', 'quiz.need_pass': 'Maswali {n}. Unahitaji angalau {pass}% kupita.',
    'quiz.later': 'Nitafanya baadaye', 'quiz.submit': 'Wasilisha majibu',
    'quiz.confirm_unanswered': 'Hujajibu swali {n}. Unataka kuwasilisha hivyo hivyo?',
    'quiz.results': 'Matokeo ya quiz',
    'quiz.exam_title': 'Mtihani wa mwisho: {title}',
    'quiz.exam_intro': 'Maswali {n}. Hakikisha umejibu yote kabla ya kuwasilisha. Ukifunga dirisha, unaweza kuendelea na mtihani huu huu baadaye.',
    'quiz.close_for_now': 'Funga kwa sasa', 'quiz.submit_exam': 'Wasilisha mtihani',
    'quiz.confirm_exam_unanswered': 'Hujajibu swali {n}. Wasilisha mtihani sasa? Huwezi kubadilisha baada ya hapo.',
    'quiz.confirm_exam': 'Wasilisha mtihani sasa? Huwezi kubadilisha baada ya hapo.',
    'quiz.exam_results': 'Matokeo ya mtihani', 'quiz.can_retry': 'Una nafasi ya kufanya mtihani tena.',
    'quiz.final_exam': 'Mtihani wa mwisho',
    'quiz.exam_not_ready': 'Mwalimu bado hajaandaa mtihani wa mwisho.',
    'quiz.exam_unlock_after': 'Mtihani utafunguka ukikamilisha yafuatayo:',
    'quiz.unlimited': 'bila kikomo', 'quiz.left_n': '{n} yamebaki',
    'quiz.exam_open': 'Mtihani umefunguka. Maswali {n}. Majaribio: {left}.',
    'quiz.exam_continue': 'Endelea na mtihani', 'quiz.exam_again': 'Fanya mtihani tena', 'quiz.exam_start': 'Anza mtihani',
    'quiz.exam_all_used': 'Umemaliza majaribio yote ya mtihani huu.',
    'quiz.bank_count': 'Maswali kwenye bank:', 'quiz.each_gets': 'Kila mwanafunzi anapata:', 'quiz.all': 'yote',
    'quiz.attempts': 'Majaribio:', 'quiz.manage_exam': 'Simamia mtihani',
    'quiz.edit_question': 'Hariri swali', 'quiz.new_question': 'Swali jipya',
    'quiz.q_type': 'Aina ya swali', 'quiz.q_points': 'Alama za swali', 'quiz.q_text': 'Swali',
    'quiz.save_question': 'Hifadhi swali', 'quiz.correct_aria': 'Jibu sahihi', 'quiz.option_n': 'Chaguo {n}',
    'quiz.options_label': 'Chaguo (weka alama kwenye duara la jibu sahihi)', 'quiz.add_option': '+ Ongeza chaguo',
    'quiz.pairs_label': 'Jozi zinazolingana (kushoto na kulia). Mwanafunzi ataona upande wa kulia umechanganywa.',
    'quiz.add_pair': '+ Ongeza jozi',
    'quiz.accepted_label': 'Majibu yanayokubalika (jibu moja kila mstari)',
    'quiz.accepted_ph': 'mf.&#10;RAM&#10;Random Access Memory',
    'quiz.accepted_hint': 'Herufi kubwa/ndogo na alama za uandishi hazijalishi.',
    'quiz.item_ph': 'Kipengele', 'quiz.match_ph': 'Jibu linalolingana',
    'quiz.max_options': 'Chaguo ni 6 kwa upeo', 'quiz.max_pairs': 'Jozi ni 8 kwa upeo', 'quiz.min_two': 'Angalau mbili zinahitajika',
    'quiz.no_questions': 'Hakuna maswali bado', 'quiz.click_new': 'Bofya "+ Swali jipya".',
    'quiz.edit': 'Hariri',
    'quiz.editor_intro': 'Inaonekana kwa mwanafunzi baada ya kubofya "Nimemaliza somo hili". Maswali {n} kati ya {max}. Kupita ni {pass}% au zaidi.',
    'quiz.new_q_btn': '+ Swali jipya', 'quiz.max_reached': 'Umefikia upeo wa maswali 10.',
    'quiz.q_added': 'Swali limeongezwa', 'quiz.q_saved': 'Limehifadhiwa', 'quiz.delete_q': 'Futa swali hili?',
    'quiz.exam_editor_title': 'Mtihani wa mwisho wa kozi',
    'quiz.exam_editor_intro': 'Unafunguka kwa mwanafunzi akikamilisha masomo yote na kupata angalau 50% kwenye kila quiz. Bank ina maswali {n}.',
    'quiz.exam_count_label': 'Idadi ya maswali kwa kila mwanafunzi',
    'quiz.exam_count_hint': '0 = maswali yote. Namba ndogo kuliko bank huchagua maswali kwa nasibu.',
    'quiz.exam_attempts_label': 'Mara za kufanya mtihani',
    'quiz.exam_attempts_hint': '0 = bila kikomo. Kawaida ni 1.',
    'quiz.save_settings': 'Hifadhi mipangilio', 'quiz.settings_saved': 'Mipangilio imehifadhiwa',
    'quiz.type_essay': 'Essay / maelezo',
    'quiz.essay_files': 'Faili za mwanafunzi', 'quiz.essay_files_hint': 'Si lazima. Hadi faili 5 za aina yoyote (zip, PDF, Word…), MB 100 kila moja. Wanafunzi wanaweza kuzipakua.',
    'quiz.essay_current': 'Faili zilizopo (weka tiki kuondoa)', 'quiz.essay_points': 'Alama zote za swali hili',
    'quiz.essay_points_hint': 'Mwanafunzi anayepata {half} au zaidi (nusu ya alama) amefaulu. Chini ya hapo anarudia swali.',
    'quiz.essay_files_n': 'Faili {n}', 'quiz.uploading': 'Inapakia…',
    'quiz.essay_download': 'Pakua faili', 'quiz.essay_your': 'Jibu lako',
    'quiz.essay_write': 'Andika jibu lako', 'quiz.essay_upload': 'Au pakia faili la majibu (aina yoyote, hadi MB 50)',
    'quiz.essay_submit': 'Wasilisha jibu', 'quiz.essay_resubmit': 'Wasilisha jibu jipya', 'quiz.essay_sent': 'Jibu limewasilishwa',
    'quiz.essay_need': 'Andika jibu lako au chagua faili',
    'quiz.st_notmarked': 'Halijasahihishwa', 'quiz.st_marked': 'Limesahihishwa', 'quiz.st_passed': 'Umefaulu', 'quiz.st_failed': 'Umefeli',
    'quiz.essay_wait': 'Subiri mwalimu alisahihishe.',
    'quiz.essay_score': 'Alama: {a} / {b} (kufaulu ni {c})', 'quiz.essay_retry': 'Hujafikia alama za kufaulu. Rudia swali hili tena.',
    'quiz.essay_feedback': 'Maoni ya mwalimu', 'quiz.essay_pass_hint': 'Kufaulu: {c} au zaidi.',
    'quiz.essay_note': 'Maswali ya essay yanasahihishwa na mwalimu. Wasilisha kila moja kwenye kadi yake.',
    'quiz.essay_summary': 'Maswali ya essay: {passed}/{total} yamefaulu{pending}', 'quiz.essay_pending_n': ' · {n} yanasubiri kusahihishwa',
    'quiz.close': 'Funga', 'quiz.open': 'Fungua', 'quiz.download': 'Pakua', 'quiz.hide': 'Ficha', 'quiz.no_preview': 'Aina hii ya faili haifunguki hapa. Tafadhali ipakue.',
    'quiz.loading': 'Inapakia…', 'quiz.truncated': '(Sehemu ya kwanza tu ndiyo inaonyeshwa. Pakua faili kusoma yote.)', 'quiz.preview_fail': 'Faili halikuweza kufunguliwa hapa. Tafadhali lipakue.',
    'quiz.ess_title': 'Majibu ya essay ya kusahihisha', 'quiz.ess_pending': '{n} yanasubiri',
    'quiz.ess_none': 'Hakuna majibu bado', 'quiz.ess_none_sub': 'Majibu ya essay ya wanafunzi yataonekana hapa.',
    'quiz.ess_student': 'Mwanafunzi', 'quiz.ess_question': 'Swali', 'quiz.ess_when': 'Aliwasilisha', 'quiz.ess_status': 'Hali',
    'quiz.ess_mark': 'Sahihisha', 'quiz.ess_view': 'Angalia / badili alama', 'quiz.ess_text': 'Jibu lililoandikwa', 'quiz.ess_nofile': 'Hakupakia faili',
    'quiz.ess_file': 'Faili la majibu', 'quiz.ess_notext': '(hakuandika jibu)', 'quiz.ess_score': 'Alama (kati ya {n})',
    'quiz.ess_feedback': 'Maoni kwa mwanafunzi (si lazima)', 'quiz.ess_save': 'Hifadhi alama', 'quiz.ess_saved': 'Alama zimehifadhiwa',
    'quiz.ess_old': 'Mwanafunzi ametuma jibu jipya. Funga hii ufungue la hivi karibuni.',
    'quiz.ess_allmarked': 'Majibu yote yamesahihishwa', 'quiz.ess_all': 'Onyesha yote', 'quiz.ess_only_pending': 'Onyesha ambayo hayajasahihishwa tu'
  }
});

const QTYPE = () => ({ mcq: t('quiz.type_mcq'), match: t('quiz.type_match'), short: t('quiz.type_short'), essay: t('quiz.type_essay') });
const fsize = n => n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
const fdate = d => { try { return new Date(d.replace(' ', 'T') + 'Z').toLocaleString(); } catch { return d || ''; } };
const fmt = n => (Math.round(n * 100) / 100).toString();

// ---------- Quiz box under the player ----------
function quizBox(l) {
  if (!l.quiz_count || me.role !== 'student') return '';
  if (!l.done) return `<div class="quizbox"><b>${t('quiz.lesson_quiz')}</b><p class="muted">${t('quiz.questions_n', { n: l.quiz_count })}. ${t('quiz.unlock_hint')}</p></div>`;
  const e = l.essays || { total: 0, passed: 0, pending: 0, submitted: 0 };
  const badge = l.passed ? `<span class="badge ok">${t('quiz.passed')}</span>` : (l.has_auto && l.best != null) ? `<span class="badge no">${t('quiz.below_pass')}</span>` : '';
  let st = l.has_auto ? (l.best == null ? t('quiz.not_taken') : t('quiz.best_score', { pct: `<b>${Math.round(l.best)}%</b>` })) : '';
  if (e.total) st += ` ${t('quiz.essay_summary', { passed: e.passed, total: e.total, pending: e.pending ? t('quiz.essay_pending_n', { n: e.pending }) : '' })}.`;
  else if (!st) st = t('quiz.not_taken');
  const tried = l.best != null || e.submitted > 0;
  return `<div class="quizbox"><div><b>${t('quiz.lesson_quiz')}</b><p class="muted" style="margin:0">${t('quiz.questions_n', { n: l.quiz_count })}. ${st} ${badge}</p></div>
    <button class="btn sun" id="qstart">${tried ? t('quiz.retake') : t('quiz.start')}</button></div>`;
}

// ---------- Render questions for the student ----------
function renderQuestions(qs) {
  return qs.map((q, n) => {
    let body = '';
    if (q.type === 'mcq') {
      body = `<div class="opts">${q.options.map((o, i) => `<label class="opt"><input type="radio" name="q${q.id}" value="${i}"><span>${esc(o)}</span></label>`).join('')}</div>`;
    } else if (q.type === 'match') {
      body = `<div class="matchrows">${q.lefts.map((lf, i) => `<div class="mrow"><span>${esc(lf)}</span>
        <select data-q="${q.id}" data-i="${i}" aria-label="${t('quiz.answer_for', { x: esc(lf) })}"><option value="">${t('quiz.choose')}</option>${q.rights.map(r => `<option>${esc(r)}</option>`).join('')}</select></div>`).join('')}</div>`;
    } else if (q.type === 'essay') {
      body = essayBody(q);
    } else {
      body = `<input type="text" data-short="${q.id}" placeholder="${t('quiz.type_answer')}" autocomplete="off">`;
    }
    return `<fieldset class="qcard${q.type === 'essay' ? ' essay' : ''}" ${q.type === 'essay' ? `data-essay="${q.id}"` : ''}><legend><span class="qn">${n + 1}</span> <small class="muted">${t('quiz.type_points', { type: QTYPE()[q.type], n: fmt(q.points) })}</small></legend>
      <p class="qtext">${esc(q.text)}</p>${body}</fieldset>`;
  }).join('');
}

// Answer file with Open (in-system preview, only for readable types) and Download (always works)
const PREVIEW_EXT = new Set(['.txt', '.md', '.csv', '.tsv', '.json', '.log', '.xml', '.html', '.htm', '.css', '.js', '.py', '.java', '.c', '.h', '.cpp', '.cs', '.php', '.sql', '.yml', '.yaml', '.ini', '.sh', '.bat', '.ps1', '.doc', '.docx', '.odt', '.rtf', '.pdf']);
function answerFile(s) {
  if (!s.file_name) return '';
  const ext = ((s.file_name.match(/\.[^.]+$/) || [''])[0]).toLowerCase();
  const can = PREVIEW_EXT.has(ext);
  return `<div class="afw"><div class="afile"><span class="afn">📎 ${esc(s.file_name)} <small class="muted">(${fsize(s.size)})</small></span>
    <button type="button" class="btn ghost sm" data-eopen="${s.id}" ${can ? '' : `disabled title="${esc(t('quiz.no_preview'))}"`}>${t('quiz.open')}</button>
    <a class="btn ghost sm" href="/api/essay-subs/${s.id}/file" download>⬇ ${t('quiz.download')}</a></div><div class="apreview" hidden></div></div>`;
}
document.addEventListener('click', async e => {
  const b = e.target.closest && e.target.closest('[data-eopen]');
  if (!b || b.disabled) return;
  const box = b.closest('.afw').querySelector('.apreview');
  if (!box.hidden) { box.hidden = true; b.textContent = t('quiz.open'); return; }
  box.hidden = false; b.textContent = t('quiz.hide');
  box.innerHTML = `<p class="muted">${t('quiz.loading')}</p>`;
  try {
    const r = await api(`/api/essay-subs/${b.dataset.eopen}/preview`);
    if (r.kind === 'text') box.innerHTML = `<pre class="epre">${esc(r.text) || '—'}</pre>${r.truncated ? `<small class="muted">${t('quiz.truncated')}</small>` : ''}`;
    else if (r.kind === 'pdf') box.innerHTML = `<iframe class="epdf" src="/api/essay-subs/${b.dataset.eopen}/file?inline=1" title="PDF"></iframe>`;
    else box.innerHTML = `<p class="muted">${t('quiz.no_preview')}</p>`;
  } catch { box.innerHTML = `<p class="muted">${t('quiz.preview_fail')}</p>`; }
});

// Essay card body for the student: files from the teacher, then the answer form or the current status
function essayBody(q) {
  const files = (q.files || []).length
    ? `<div class="efiles"><small class="muted">${t('quiz.essay_download')}</small>${q.files.map(f => `<a class="btn ghost sm" href="/api/questions/${q.id}/files/${f.id}" download>⬇ ${esc(f.name)} <small>(${fsize(f.size)})</small></a>`).join('')}</div>` : '';
  const s = q.sub;
  let status = '';
  if (s) {
    const badge = s.status === 'pending' ? `<span class="badge soon">${t('quiz.st_notmarked')}</span>`
      : `<span class="badge ${s.passed ? 'ok' : 'no'}">${t('quiz.st_marked')} · ${s.passed ? t('quiz.st_passed') : t('quiz.st_failed')}</span>`;
    status = `<div class="estatus"><div>${badge} <small class="muted">${fdate(s.created_at)}</small></div>
      ${s.status === 'marked' ? `<p style="margin:.4rem 0 0"><b>${t('quiz.essay_score', { a: fmt(s.score), b: fmt(q.points), c: fmt(s.pass_mark) })}</b></p>` : `<p class="muted" style="margin:.4rem 0 0">${t('quiz.essay_wait')}</p>`}
      ${s.status === 'marked' && s.feedback ? `<p class="efb"><small class="muted">${t('quiz.essay_feedback')}</small><br>${esc(s.feedback)}</p>` : ''}
      ${s.status === 'marked' && !s.passed ? `<p class="muted" style="margin:.3rem 0 0">${t('quiz.essay_retry')}</p>` : ''}
      <details><summary>${t('quiz.essay_your')}</summary>${s.text ? `<p class="etext">${esc(s.text)}</p>` : ''}${answerFile(s)}</details></div>`;
  }
  const form = q.can_submit ? `<div class="eform"><label>${t('quiz.essay_write')}<textarea data-etext maxlength="20000"></textarea></label>
      <label>${t('quiz.essay_upload')}<input type="file" data-efile></label>
      <button type="button" class="btn sun sm" data-esend>${s ? t('quiz.essay_resubmit') : t('quiz.essay_submit')}</button></div>` : '';
  return files + status + form;
}

// Essay cards are submitted one by one (the teacher marks them); each card refreshes itself
function bindEssays(box, qs, lessonId, afterChange) {
  box.querySelectorAll('[data-essay]').forEach(card => {
    const btn = card.querySelector('[data-esend]');
    if (!btn) return;
    btn.onclick = guard(async () => {
      const text = card.querySelector('[data-etext]').value.trim();
      const file = card.querySelector('[data-efile]').files[0];
      if (!text && !file) return toast(t('quiz.essay_need'), true);
      const fd = new FormData();
      fd.append('text', text);
      if (file) fd.append('file', file);
      btn.disabled = true; const old = btn.textContent; btn.textContent = t('quiz.uploading');
      try {
        await api(`/api/questions/${card.dataset.essay}/essay`, { method: 'POST', body: fd });
      } catch (e) { btn.disabled = false; btn.textContent = old; throw e; }
      toast(t('quiz.essay_sent'));
      const d = await api(`/api/lessons/${lessonId}/quiz`);
      const q = d.questions.find(x => x.id === +card.dataset.essay);
      const idx = qs.findIndex(x => x.id === q.id); if (idx >= 0) qs[idx] = q;
      card.querySelectorAll('.efiles,.estatus,.eform').forEach(n => n.remove());
      card.insertAdjacentHTML('beforeend', essayBody(q));
      bindEssays(box, qs, lessonId, afterChange);
      afterChange();
    });
  });
}

function collectAnswers(root, qs) {
  const ans = {};
  qs.filter(q => q.type !== 'essay').forEach(q => {
    if (q.type === 'mcq') {
      const c = root.querySelector(`input[name="q${q.id}"]:checked`);
      ans[q.id] = c ? +c.value : null;
    } else if (q.type === 'match') {
      ans[q.id] = q.lefts.map((_, i) => (root.querySelector(`select[data-q="${q.id}"][data-i="${i}"]`) || {}).value || '');
    } else {
      ans[q.id] = (root.querySelector(`input[data-short="${q.id}"]`) || {}).value || '';
    }
  });
  return ans;
}

function unanswered(ans, qs) {
  return qs.filter(q => q.type !== 'essay').filter(q => {
    const a = ans[q.id];
    if (q.type === 'mcq') return a === null;
    if (q.type === 'match') return a.some(x => !x);
    return !String(a).trim();
  }).length;
}

// ---------- Results ----------
function resultHTML(r, title, actions) {
  const ok = r.pct >= r.pass;
  return `<div class="result ${ok ? 'good' : 'low'}">
      <div class="score"><b>${Math.round(r.pct)}%</b><span>${fmt(r.score)} / ${fmt(r.total)}</span></div>
      <div><h2 style="margin:0">${ok ? t('quiz.congrats') : t('quiz.not_reached', { pass: r.pass })}</h2>
      <p class="muted" style="margin:.2rem 0 0">${t('quiz.result_sub', { title: esc(title), right: r.right, count: r.count })}</p></div></div>
    ${r.wrong.length ? `<h3 style="margin-top:1.2rem">${t('quiz.missed', { n: r.wrong.length })}</h3>` + r.wrong.map(w => `
      <div class="wrongq"><p class="qtext">${esc(w.text)}</p>
        <div class="ans no"><small>${t('quiz.your_answer')}</small>${w.yours.map(y => `<div>${esc(y)}</div>`).join('')}</div>
        <div class="ans yes"><small>${t('quiz.correct_answer')}</small>${w.correct.map(y => `<div>${esc(y)}</div>`).join('')}</div>
        <small class="muted">${t('quiz.earned', { a: fmt(w.earned), b: fmt(w.points) })}</small></div>`).join('')
      : `<p style="margin-top:1rem"><b>${t('quiz.all_correct')}</b></p>`}
    <div class="row">${actions}</div>`;
}

// ---------- Student: take quiz ----------
async function openQuiz(lesson, courseId, onClose) {
  let data;
  try { data = await api(`/api/lessons/${lesson.id}/quiz`); } catch (e) { return toast(e.message, true); }
  const m = modal('', 'wide', true);
  const box = m.querySelector('.modal');
  const done = () => { m.remove(); if (onClose) onClose(); };

  function showForm() {
    const hasAuto = data.questions.some(q => q.type !== 'essay');
    const hasEssay = data.questions.some(q => q.type === 'essay');
    box.innerHTML = `<h2>${t('quiz.title', { title: esc(data.lesson.title) })}</h2>
      <p class="muted">${t('quiz.need_pass', { n: data.questions.length, pass: data.pass })}${hasEssay ? ' ' + t('quiz.essay_note') : ''}</p>
      <form id="qf">${renderQuestions(data.questions)}
      <div class="row"><button type="button" class="btn ghost" data-later>${hasAuto ? t('quiz.later') : t('common.close')}</button>${hasAuto ? `<button class="btn sun">${t('quiz.submit')}</button>` : ''}</div></form>`;
    box.querySelector('[data-later]').onclick = done;
    bindEssays(box, data.questions, lesson.id, () => {});
    box.querySelector('#qf').onsubmit = guard(async e => {
      e.preventDefault();
      const ans = collectAnswers(box, data.questions);
      const miss = unanswered(ans, data.questions);
      if (miss && !confirm(t('quiz.confirm_unanswered', { n: miss }))) return;
      const r = await api(`/api/lessons/${lesson.id}/quiz/submit`, { method: 'POST', body: { answers: ans } });
      box.innerHTML = `<h2>${t('quiz.results')}</h2>` + resultHTML(r, data.lesson.title,
        `<button class="btn ghost" data-close>${t('common.close')}</button><button class="btn sun" data-retry>${t('quiz.retake')}</button>`);
      box.scrollTop = 0;
      box.querySelector('[data-close]').onclick = done;
      box.querySelector('[data-retry]').onclick = async () => {
        try { data = await api(`/api/lessons/${lesson.id}/quiz`); showForm(); box.scrollTop = 0; } catch (er) { toast(er.message, true); }
      };
    });
  }
  showForm();
}

// ---------- Student: final exam ----------
async function takeExam(courseId, courseTitle, onClose) {
  let data;
  try { data = await api(`/api/courses/${courseId}/exam/start`, { method: 'POST' }); } catch (e) { return toast(e.message, true); }
  const m = modal('', 'wide', true);
  const box = m.querySelector('.modal');
  const done = () => { m.remove(); if (onClose) onClose(); };
  box.innerHTML = `<h2>${t('quiz.exam_title', { title: esc(courseTitle) })}</h2>
    <p class="muted">${t('quiz.exam_intro', { n: data.questions.length })}</p>
    <form id="ef">${renderQuestions(data.questions)}
    <div class="row"><button type="button" class="btn ghost" data-later>${t('quiz.close_for_now')}</button><button class="btn sun">${t('quiz.submit_exam')}</button></div></form>`;
  box.querySelector('[data-later]').onclick = done;
  box.querySelector('#ef').onsubmit = guard(async e => {
    e.preventDefault();
    const ans = collectAnswers(box, data.questions);
    const miss = unanswered(ans, data.questions);
    if (!confirm(miss ? t('quiz.confirm_exam_unanswered', { n: miss }) : t('quiz.confirm_exam'))) return;
    const r = await api(`/api/exam/${data.attempt}/submit`, { method: 'POST', body: { answers: ans } });
    box.innerHTML = `<h2>${t('quiz.exam_results')}</h2>` + resultHTML(r, courseTitle,
      `<button class="btn" data-close>${t('common.close')}</button>`) +
      (r.can_retry ? `<p class="muted">${t('quiz.can_retry')}</p>` : '');
    box.scrollTop = 0;
    box.querySelector('[data-close]').onclick = done;
  });
}

// ---------- Exam section on the course page ----------
function drawExam(d, courseId, reload) {
  const el = document.getElementById('exam');
  if (!el) return;
  const c = d.course, x = d.exam;
  if (me.role === 'student') {
    let inner;
    if (!x.questions) {
      inner = `<p class="muted" style="margin:0">${t('quiz.exam_not_ready')}</p>`;
    } else if (!x.unlocked) {
      inner = `<p>${t('quiz.exam_unlock_after')}</p><ul class="reasons">${x.reasons.map(r => `<li>${esc(r)}</li>`).join('')}</ul>`;
    } else {
      const left = x.attempts_allowed === 0 ? t('quiz.unlimited') : t('quiz.left_n', { n: Math.max(0, x.attempts_allowed - x.attempts_used) });
      inner = `<p>${t('quiz.exam_open', { n: x.per_attempt, left })}</p>` +
        (x.best != null ? `<p>${t('quiz.best_score', { pct: `<b>${Math.round(x.best)}%</b>` })} ${x.passed ? `<span class="badge ok">${t('quiz.passed')}</span>` : `<span class="badge no">${t('quiz.below_pass')}</span>`}</p>` : '') +
        (x.can_start ? `<button class="btn sun" id="exstart">${x.resume ? t('quiz.exam_continue') : x.attempts_used ? t('quiz.exam_again') : t('quiz.exam_start')}</button>`
          : `<p class="muted" style="margin:0">${t('quiz.exam_all_used')}</p>`);
    }
    el.innerHTML = `<section class="panel exam ${x.unlocked && x.questions ? 'open' : 'locked'}"><h2>${t('quiz.final_exam')}</h2>${inner}</section>`;
    const b = document.getElementById('exstart');
    if (b) b.onclick = () => takeExam(courseId, c.title, reload);
  } else {
    el.innerHTML = `<section class="panel exam open"><div class="page-head" style="margin:0"><div><h2 style="margin:0">${t('quiz.final_exam')}</h2>
      <p class="muted">${t('quiz.bank_count')} <b>${x.questions}</b> · ${t('quiz.each_gets')} <b>${x.count > 0 ? Math.min(x.count, x.questions) : t('quiz.all')}</b> · ${t('quiz.attempts')} <b>${x.attempts === 0 ? t('quiz.unlimited') : x.attempts}</b></p></div>
      <button class="btn" id="exedit">${t('quiz.manage_exam')}</button></div></section>`;
    document.getElementById('exedit').onclick = () => examEditor(courseId, reload);
  }
}

// ---------- Teacher: question form ----------
function questionForm(q, onSave, opts = {}) {
  const type0 = q ? q.type : 'mcq';
  const m = modal('', 'wide', true);
  const box = m.querySelector('.modal');
  const d = q ? q.data : {};
  box.innerHTML = `<h2>${q ? t('quiz.edit_question') : t('quiz.new_question')}</h2>
    <form id="qfm">
      <div class="two" style="gap:1rem;margin-bottom:0">
        <div class="field"><label for="qt">${t('quiz.q_type')}</label><select id="qt">${Object.entries(QTYPE()).filter(([k]) => opts.essay || k !== 'essay').map(([k, v]) => `<option value="${k}" ${k === type0 ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
        <div class="field"><label for="qp">${t('quiz.q_points')}</label><input id="qp" type="number" min="0.5" max="100" step="0.5" value="${q ? q.points : 1}"></div>
      </div>
      <div class="field"><label for="qx">${t('quiz.q_text')}</label><textarea id="qx" required>${esc(q ? q.text : '')}</textarea></div>
      <div id="qsec"></div>
      <div class="row"><button type="button" class="btn ghost" data-x>${t('common.cancel')}</button><button class="btn">${t('quiz.save_question')}</button></div>
    </form>`;
  const sec = box.querySelector('#qsec');

  function mcqRow(txt, i, checked, canRemove) {
    return `<div class="erow"><input type="radio" name="corr" value="${i}" ${checked ? 'checked' : ''} aria-label="${t('quiz.correct_aria')}"><input type="text" data-opt value="${esc(txt)}" placeholder="${t('quiz.option_n', { n: i + 1 })}">${canRemove ? '<button type="button" class="btn ghost sm" data-rm>×</button>' : ''}</div>`;
  }
  function drawSection(type, init) {
    if (type === 'essay') {
      const old = q && q.files ? q.files : [];
      sec.innerHTML = `<div class="field"><label for="ef">${t('quiz.essay_files')}</label>
        ${old.length ? `<div class="efiles-edit"><small class="muted">${t('quiz.essay_current')}</small>${old.map(f => `<label class="chk"><input type="checkbox" data-rmfile="${f.id}"> ${esc(f.name)} <small class="muted">(${fsize(f.size)})</small></label>`).join('')}</div>` : ''}
        <input id="ef" type="file" multiple><small class="muted">${t('quiz.essay_files_hint')}</small></div>
        <p class="muted" id="ehint" style="margin:.2rem 0 .8rem"></p>`;
      const upd = () => { const v = Number(box.querySelector('#qp').value) || 0; box.querySelector('#ehint').textContent = t('quiz.essay_points_hint', { half: fmt(v / 2) }); };
      upd(); box.querySelector('#qp').oninput = upd;
      return;
    }
    if (type === 'mcq') {
      const opts = init && init.options ? init.options : ['', '', '', ''];
      const cor = init && init.options ? init.correct : 0;
      sec.innerHTML = `<label>${t('quiz.options_label')}</label><div id="rows">${opts.map((o, i) => mcqRow(o, i, i === cor, opts.length > 2)).join('')}</div>
        <button type="button" class="btn ghost sm" id="add">${t('quiz.add_option')}</button>`;
    } else if (type === 'match') {
      const pairs = init && init.pairs ? init.pairs : [{ l: '', r: '' }, { l: '', r: '' }, { l: '', r: '' }];
      sec.innerHTML = `<label>${t('quiz.pairs_label')}</label><div id="rows">${pairs.map(p => matchRow(p)).join('')}</div>
        <button type="button" class="btn ghost sm" id="add">${t('quiz.add_pair')}</button>`;
    } else {
      const ans = init && init.answers ? init.answers.join('\n') : '';
      sec.innerHTML = `<div class="field"><label for="sa">${t('quiz.accepted_label')}</label>
        <textarea id="sa" placeholder="${t('quiz.accepted_ph')}">${esc(ans)}</textarea>
        <small class="muted">${t('quiz.accepted_hint')}</small></div>`;
    }
  }
  function matchRow(p) {
    return `<div class="erow"><input type="text" data-l value="${esc(p.l)}" placeholder="${t('quiz.item_ph')}"><span>↔</span><input type="text" data-r value="${esc(p.r)}" placeholder="${t('quiz.match_ph')}"><button type="button" class="btn ghost sm" data-rm>×</button></div>`;
  }
  drawSection(type0, d);

  const typeSel = box.querySelector('#qt');
  if (q || !opts.essay) {
    // an existing question cannot be turned into an essay (or back): the other types stay switchable among themselves
    [...typeSel.options].forEach(o => { if ((o.value === 'essay') !== (q.type === 'essay')) o.remove(); });
  }
  typeSel.onchange = () => drawSection(typeSel.value, null);
  if (type0 === 'essay') box.querySelector('label[for=qp]').textContent = t('quiz.essay_points');
  box.addEventListener('click', e => {
    if (e.target.id === 'add') {
      const rows = box.querySelector('#rows');
      const n = rows.children.length;
      if (typeSel.value === 'mcq') {
        if (n >= 6) return toast(t('quiz.max_options'), true);
        rows.insertAdjacentHTML('beforeend', mcqRow('', n, false, true));
      } else {
        if (n >= 8) return toast(t('quiz.max_pairs'), true);
        rows.insertAdjacentHTML('beforeend', matchRow({ l: '', r: '' }));
      }
    }
    if (e.target.matches('[data-rm]')) {
      const rows = box.querySelector('#rows');
      if (rows.children.length <= 2) return toast(t('quiz.min_two'), true);
      e.target.closest('.erow').remove();
      if (typeSel.value === 'mcq') {  // renumber and make sure one answer stays selected
        [...rows.children].forEach((r, i) => { r.querySelector('input[type=radio]').value = i; });
        if (!rows.querySelector('input[type=radio]:checked')) rows.querySelector('input[type=radio]').checked = true;
      }
    }
  });
  box.querySelector('[data-x]').onclick = () => m.remove();
  box.querySelector('#qfm').onsubmit = guard(async e => {
    e.preventDefault();
    const type = typeSel.value;
    let body = { type, text: box.querySelector('#qx').value, points: box.querySelector('#qp').value };
    if (type === 'essay') {
      body = new FormData();
      body.append('type', type); body.append('text', box.querySelector('#qx').value); body.append('points', box.querySelector('#qp').value);
      body.append('remove', JSON.stringify([...box.querySelectorAll('[data-rmfile]:checked')].map(c => +c.dataset.rmfile)));
      [...box.querySelector('#ef').files].forEach(f => body.append('files', f));
      const sb = box.querySelector('#qfm button:not([type=button])'); if (sb) { sb.disabled = true; sb.textContent = t('quiz.uploading'); }
      try { await onSave(body); m.remove(); } catch (er) { if (sb) { sb.disabled = false; sb.textContent = t('quiz.save_question'); } throw er; }
      return;
    }
    if (type === 'mcq') {
      body.options = [...box.querySelectorAll('[data-opt]')].map(i => i.value);
      const c = box.querySelector('input[name=corr]:checked');
      body.correct = c ? +c.value : -1;
    } else if (type === 'match') {
      body.pairs = [...box.querySelectorAll('#rows .erow')].map(r => ({ l: r.querySelector('[data-l]').value, r: r.querySelector('[data-r]').value }));
    } else {
      body.answers = box.querySelector('#sa').value.split('\n');
    }
    await onSave(body);
    m.remove();
  });
}

function questionList(qs) {
  if (!qs.length) return `<div class="empty" style="padding:1.2rem"><b>${t('quiz.no_questions')}</b>${t('quiz.click_new')}</div>`;
  return qs.map((q, i) => `<div class="qrow"><div class="qrow-t"><b>${i + 1}.</b> ${esc(q.text).slice(0, 140)}<br><small class="muted">${t('quiz.type_points', { type: QTYPE()[q.type], n: fmt(q.points) })}${q.type === 'essay' && (q.files || []).length ? ' · ' + t('quiz.essay_files_n', { n: q.files.length }) : ''}</small></div>
    <div><button class="btn ghost sm" data-edit="${q.id}">${t('quiz.edit')}</button> <button class="btn danger sm" data-del="${q.id}">${t('common.delete')}</button></div></div>`).join('');
}

// ---------- Teacher: lesson quiz ----------
async function quizEditor(lesson, courseId, reload) {
  const m = modal('', 'wide', true);
  const box = m.querySelector('.modal');
  let changed = false;
  async function load() {
    const d = await api(`/api/lessons/${lesson.id}/quiz`);
    const full = d.questions.length >= d.max;
    box.innerHTML = `<h2>${t('quiz.title', { title: esc(lesson.title) })}</h2>
      <p class="muted">${t('quiz.editor_intro', { n: d.questions.length, max: d.max, pass: 50 })}</p>
      <div class="row" style="justify-content:flex-start;margin:0 0 1rem"><button class="btn" id="nq" ${full ? 'disabled' : ''}>${t('quiz.new_q_btn')}</button></div>
      ${full ? `<p class="muted">${t('quiz.max_reached')}</p>` : ''}
      <div>${questionList(d.questions)}</div>
      <div class="row"><button class="btn ghost" data-close>${t('common.close')}</button></div>`;
    box.querySelector('[data-close]').onclick = () => { m.remove(); if (changed) reload(); };
    box.querySelector('#nq').onclick = () => questionForm(null, async body => {
      await api(`/api/lessons/${lesson.id}/questions`, { method: 'POST', body }); changed = true; toast(t('quiz.q_added')); await load();
    }, { essay: true });
    box.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => {
      const q = d.questions.find(x => x.id === +b.dataset.edit);
      questionForm(q, async body => { await api('/api/questions/' + q.id, { method: 'PUT', body }); changed = true; toast(t('quiz.q_saved')); await load(); }, { essay: true });
    });
    box.querySelectorAll('[data-del]').forEach(b => b.onclick = () => confirmBox(t('quiz.delete_q'), async () => {
      await api('/api/questions/' + b.dataset.del, { method: 'DELETE' }); changed = true; await load();
    }));
  }
  try { await load(); } catch (e) { m.remove(); toast(e.message, true); }
}

// ---------- Teacher: essay answers to mark ----------
async function drawEssays(courseId) {
  const el = document.getElementById('essays');
  if (!el) return;
  let showAll = true; // marked answers stay listed so the teacher can review them any time
  async function load() {
    const rows = await api(`/api/courses/${courseId}/essays`);
    const pending = rows.filter(r => r.status === 'pending').length;
    const list = showAll ? rows : rows.filter(r => r.status === 'pending');
    el.innerHTML = `<section class="panel"><div class="page-head" style="margin:0 0 .8rem"><div><h2 style="margin:0">${t('quiz.ess_title')} ${pending ? `<span class="badge soon">${t('quiz.ess_pending', { n: pending })}</span>` : ''}</h2></div>
      ${rows.length ? `<button class="btn ghost sm" id="essall">${showAll ? t('quiz.ess_only_pending') : t('quiz.ess_all')}</button>` : ''}</div>
      ${list.length ? `<div class="table-wrap" style="border:0"><table><thead><tr><th>${t('quiz.ess_student')}</th><th>${t('quiz.ess_question')}</th><th>${t('quiz.ess_when')}</th><th>${t('quiz.ess_status')}</th><th></th></tr></thead><tbody>
        ${list.map(r => `<tr><td>${esc(r.student_name)}<br><small class="muted">${esc(r.student_email)}</small></td>
          <td>${esc(r.question).slice(0, 90)}<br><small class="muted">${esc(r.lesson_title || '')}</small></td><td><small>${fdate(r.created_at)}</small></td>
          <td>${r.status === 'pending' ? `<span class="badge soon">${t('quiz.st_notmarked')}</span>` : `<span class="badge ${r.passed ? 'ok' : 'no'}">${fmt(r.score)}/${fmt(r.points)} · ${r.passed ? t('quiz.st_passed') : t('quiz.st_failed')}</span>`}</td>
          <td><button class="btn ${r.status === 'pending' ? 'sun' : 'ghost'} sm" data-mark="${r.id}">${r.status === 'pending' ? t('quiz.ess_mark') : t('quiz.ess_view')}</button></td></tr>`).join('')}</tbody></table></div>`
      : rows.length ? `<div class="empty" style="padding:1.2rem"><b>${t('quiz.ess_allmarked')}</b></div>` : `<div class="empty" style="padding:1.2rem"><b>${t('quiz.ess_none')}</b>${t('quiz.ess_none_sub')}</div>`}</section>`;
    const all = document.getElementById('essall');
    if (all) all.onclick = () => { showAll = !showAll; load().catch(e => toast(e.message, true)); };
    el.querySelectorAll('[data-mark]').forEach(b => b.onclick = guard(async () => markEssay(+b.dataset.mark, () => load().catch(e => toast(e.message, true)))));
  }
  await load();
}

async function markEssay(subId, reload) {
  const s = await api('/api/essay-subs/' + subId);
  const m = modal('', 'wide', true);
  const box = m.querySelector('.modal');
  box.innerHTML = `<h2>${esc(s.student_name)}</h2>
    <p class="qtext">${esc(s.question)}</p>
    <h3>${t('quiz.ess_text')}</h3>${s.text ? `<p class="etext">${esc(s.text)}</p>` : `<p class="muted">${t('quiz.ess_notext')}</p>`}
    <h3>${t('quiz.ess_file')}</h3>${s.file_name ? answerFile(s) : `<p class="muted">${t('quiz.ess_nofile')}</p>`}
    ${s.latest ? `<form id="mf"><div class="two" style="gap:1rem;margin-bottom:0">
      <div class="field"><label for="ms">${t('quiz.ess_score', { n: fmt(s.points) })}</label><input id="ms" type="number" min="0" max="${s.points}" step="0.5" required value="${s.score ?? ''}"></div>
      <div class="field"><p class="muted" style="margin:1.6rem 0 0">${t('quiz.essay_pass_hint', { c: fmt(s.pass_mark) })}</p></div></div>
      <div class="field"><label for="mfb">${t('quiz.ess_feedback')}</label><textarea id="mfb" maxlength="2000">${esc(s.feedback || '')}</textarea></div>
      <div class="row"><button type="button" class="btn ghost" data-x>${t('common.cancel')}</button><button class="btn sun">${t('quiz.ess_save')}</button></div></form>`
    : `<p class="muted">${t('quiz.ess_old')}</p><div class="row"><button type="button" class="btn ghost" data-x>${t('common.close')}</button></div>`}`;
  box.querySelector('[data-x]').onclick = () => m.remove();
  const f = box.querySelector('#mf');
  if (f) f.onsubmit = guard(async e => {
    e.preventDefault();
    await api(`/api/essay-subs/${s.id}/mark`, { method: 'POST', body: { score: box.querySelector('#ms').value, feedback: box.querySelector('#mfb').value } });
    m.remove(); toast(t('quiz.ess_saved')); reload();
  });
}

// ---------- Teacher: final exam ----------
async function examEditor(courseId, reload) {
  const m = modal('', 'wide', true);
  const box = m.querySelector('.modal');
  let changed = false;
  async function load() {
    const d = await api(`/api/courses/${courseId}/exam/questions`);
    box.innerHTML = `<h2>${t('quiz.exam_editor_title')}</h2>
      <p class="muted">${t('quiz.exam_editor_intro', { n: d.questions.length })}</p>
      <form id="sf" class="panel" style="margin:0 0 1rem"><div class="two" style="gap:1rem;margin:0">
        <div class="field" style="margin:0"><label for="ec">${t('quiz.exam_count_label')}</label><input id="ec" type="number" min="0" max="500" value="${d.exam_count}">
          <small class="muted">${t('quiz.exam_count_hint')}</small></div>
        <div class="field" style="margin:0"><label for="ea">${t('quiz.exam_attempts_label')}</label><input id="ea" type="number" min="0" max="20" value="${d.exam_attempts}">
          <small class="muted">${t('quiz.exam_attempts_hint')}</small></div></div>
        <button class="btn sm" style="margin-top:.8rem">${t('quiz.save_settings')}</button></form>
      <div class="row" style="justify-content:flex-start;margin:0 0 1rem"><button class="btn" id="nq">${t('quiz.new_q_btn')}</button></div>
      <div>${questionList(d.questions)}</div>
      <div class="row"><button class="btn ghost" data-close>${t('common.close')}</button></div>`;
    box.querySelector('[data-close]').onclick = () => { m.remove(); if (changed) reload(); };
    box.querySelector('#sf').onsubmit = guard(async e => {
      e.preventDefault();
      await api(`/api/courses/${courseId}/exam/settings`, { method: 'PUT', body: { exam_count: ec.value, exam_attempts: ea.value } });
      changed = true; toast(t('quiz.settings_saved'));
    });
    box.querySelector('#nq').onclick = () => questionForm(null, async body => {
      await api(`/api/courses/${courseId}/exam/questions`, { method: 'POST', body }); changed = true; toast(t('quiz.q_added')); await load();
    });
    box.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => {
      const q = d.questions.find(x => x.id === +b.dataset.edit);
      questionForm(q, async body => { await api('/api/questions/' + q.id, { method: 'PUT', body }); changed = true; toast(t('quiz.q_saved')); await load(); });
    });
    box.querySelectorAll('[data-del]').forEach(b => b.onclick = () => confirmBox(t('quiz.delete_q'), async () => {
      await api('/api/questions/' + b.dataset.del, { method: 'DELETE' }); changed = true; await load();
    }));
  }
  try { await load(); } catch (e) { m.remove(); toast(e.message, true); }
}
