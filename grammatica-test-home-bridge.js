/* Bridge: koppelt GrammarLabHome (Duolingo-startpagina) weer aan grammatica-test.js
 * Vangt ook interne render() af die eng.refresh omzeilt (bijv. knop Home). */
(function () {
  'use strict';

  var wired = false;

  function showHome(app) {
    if (!window.GrammarLabHome || !app) return;
    try {
      if (document.body && document.body.classList) {
        document.body.classList.add('lh-on', 'lh-skin');
      }
      if (window.GrammarLabHome.enter) {
        try { window.GrammarLabHome.enter(); } catch (_e) {}
      }
      app.innerHTML = window.GrammarLabHome.view();
      if (window.GrammarLabHome.afterRender) window.GrammarLabHome.afterRender();
    } catch (e) {
      console.warn('[home-bridge]', e);
    }
  }

  function isOverviewDom(app) {
    return !!(app && app.querySelector && app.querySelector('.gd-overview'));
  }

  function isHomeStage() {
    try {
      return !!(window.GrammarLabEngine && typeof window.GrammarLabEngine.isHome === 'function' && window.GrammarLabEngine.isHome());
    } catch (_e) {
      return false;
    }
  }

  function wire() {
    if (wired) return true;
    if (!window.GrammarLabEngine || !window.GrammarLabHome) return false;
    var eng = window.GrammarLabEngine;
    var app = document.getElementById('gd-app');
    if (!app) return false;

    try { window.GrammarLabHome.mount(app, eng); } catch (e) { console.warn(e); }

    // Wrap eng.refresh (sommige paden gebruiken dit)
    var prevRefresh = eng.refresh;
    eng.refresh = function () {
      if (typeof prevRefresh === 'function') prevRefresh();
      if (isHomeStage() || isOverviewDom(app)) showHome(app);
    };

    var prevOpen = eng.open;
    eng.open = function (n, mode) {
      if (typeof prevOpen === 'function') prevOpen(n, mode);
      else if (typeof prevRefresh === 'function') prevRefresh();
    };

    // Vang interne render() af: zodra .gd-overview verschijnt → vervang door Home
    var obs = new MutationObserver(function () {
      if (isOverviewDom(app)) showHome(app);
    });
    obs.observe(app, { childList: true, subtree: false });

    // Extra vangnet na klik op home / overview
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('[data-action="overview"], .gd-home, [data-h-act="go"]') : null;
      if (!t) return;
      setTimeout(function () {
        if (isHomeStage() || isOverviewDom(app)) showHome(app);
      }, 0);
    }, true);

    // Eerste paint
    try {
      if (isHomeStage() || isOverviewDom(app) || !app.querySelector('.gd-card, .gd-play')) {
        showHome(app);
      }
    } catch (e) { console.warn(e); }

    wired = true;
    return true;
  }

  function boot() {
    if (wire()) return;
    var n = 0;
    var t = setInterval(function () {
      n += 1;
      if (wire() || n > 50) clearInterval(t);
    }, 40);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
