'use strict';
// ============================================================
//  D4LT Learn — i18n (English default, Kiswahili). The app is dark-theme only.
//  Loaded FIRST (in <head>, no defer) so the language is applied before first paint.
//
//  API (globals):
//    t(key, params)        -> translated string; {name} placeholders filled from params.
//                             Falls back to English, then to the key itself.
//    addStrings({en:{}, sw:{}})  -> each module registers its own keys (prefix them: quiz.*, meet.*, ...)
//    getLang() / setLang('en'|'sw')
//    locale()              -> 'en-GB' | 'sw-TZ'   (for Intl / toLocale* date formatting)
//    prefsHTML(cls)        -> markup of the language switch
//    LANG_HEADERS()        -> { 'X-Lang': 'en'|'sw' }   (sent to the server so it answers in the same language)
//  Event: document 'langchange' is fired after the language changes (app.js re-renders).
// ============================================================
(function () {
  const KL = 'd4lt.lang';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } }
  };

  let lang = store.get(KL) === 'sw' ? 'sw' : 'en';          // default: English

  const STR = { en: {}, sw: {} };
  window.addStrings = function (d) {
    Object.assign(STR.en, d.en || {});
    Object.assign(STR.sw, d.sw || {});
  };

  window.t = function (key, params) {
    let s = STR[lang][key];
    if (s === undefined) s = STR.en[key];
    if (s === undefined) return key;
    if (params) s = s.replace(/\{(\w+)\}/g, (m, k) => (params[k] === undefined || params[k] === null ? m : params[k]));
    return s;
  };

  window.getLang = () => lang;
  window.locale = () => (lang === 'sw' ? 'sw-TZ' : 'en-GB');
  window.LANG_HEADERS = () => ({ 'X-Lang': lang });

  function applyLangAttr() {
    document.documentElement.lang = lang;
  }
  window.setLang = l => {
    l = l === 'sw' ? 'sw' : 'en';
    if (l === lang) return;
    lang = l; store.set(KL, lang); applyLangAttr();
    document.querySelectorAll('.prefs').forEach(el => { el.outerHTML = window.prefsHTML(el.dataset.cls || ''); });
    document.dispatchEvent(new CustomEvent('langchange'));
  };

  window.prefsHTML = function (cls) {
    return `<div class="prefs ${cls || ''}" data-cls="${cls || ''}">
      <div class="seg" role="group" aria-label="${t('pref.language')}">
        <button type="button" data-lang="en" aria-pressed="${lang === 'en'}" title="English" lang="en">EN</button>
        <button type="button" data-lang="sw" aria-pressed="${lang === 'sw'}" title="Kiswahili" lang="sw">SW</button>
      </div>
    </div>`;
  };

  document.addEventListener('click', e => {
    const lb = e.target.closest && e.target.closest('[data-lang]');
    if (lb) window.setLang(lb.dataset.lang);
  });

  // ---------- common strings (shared by all modules) ----------
  window.addStrings({
    en: {
      'pref.language': 'Language',
      'common.cancel': 'Cancel', 'common.close': 'Close', 'common.save': 'Save', 'common.delete': 'Delete',
      'common.back': 'Back', 'common.copy': 'Copy', 'common.loading': 'Loading...', 'common.logout': 'Log out',
      'common.show': 'Show', 'common.hide': 'Hide', 'common.error': 'Something went wrong',
      'common.are_you_sure': 'Are you sure?', 'common.yes_continue': 'Yes, continue', 'common.saved': 'Saved',
      'common.deleted': 'Deleted', 'common.none': '—'
    },
    sw: {
      'pref.language': 'Lugha',
      'common.cancel': 'Ghairi', 'common.close': 'Funga', 'common.save': 'Hifadhi', 'common.delete': 'Futa',
      'common.back': 'Rudi', 'common.copy': 'Nakili', 'common.loading': 'Inapakia...', 'common.logout': 'Toka',
      'common.show': 'Onyesha', 'common.hide': 'Ficha', 'common.error': 'Hitilafu imetokea',
      'common.are_you_sure': 'Una uhakika?', 'common.yes_continue': 'Ndiyo, endelea', 'common.saved': 'Imehifadhiwa',
      'common.deleted': 'Imefutwa', 'common.none': '—'
    }
  });

  applyLangAttr();
})();
