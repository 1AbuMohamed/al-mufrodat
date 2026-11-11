/* Bridge: koppelt GrammarLabHome (Duolingo-startpagina) weer aan grammatica-test.js
 * - Toont Home i.p.v. oude .gd-overview
 * - Roept enter() alleen bij echte terugkeer naar home, niet bij elke re-render
 *   (anders verdwijnt de les-popup bij klik op 1/2/3 …)
 */
(function () {
  'use strict';

  var wired = false;
  var firstHome = true;

  function showHome(app, opts) {
    if (!window.GrammarLabHome || !app) return;
    opts = opts || {};
    try {
      if (document.body && document.body.classList) {
        document.body.classList.add('lh-on', 'lh-skin');
      }
      // enter() reset sectie + sluit popups — alleen bij eerste load of expliciete home-terugkeer
      if (opts.enter && window.GrammarLabHome.enter) {
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

    // engine.open: ondersteun mode 'theory' / 'start'
    var prevOpen = eng.open;
    eng.open = function (n, mode) {
      firstHome = true; // volgende home-terugkeer mag enter() weer doen
      if (typeof prevOpen === 'function') {
        prevOpen(n, mode);
      }
      // Als open alleen setLesson doet, zorg dat theory-stage ook werkt
      try {
        if (mode === 'theory' && typeof eng.refresh === 'function') {
          // setLesson start vaak direct play; theory wordt via stage gezet als engine dat ondersteunt
        }
      } catch (_e) {}
    };

    // Wrap eng.refresh
    var prevRefresh = eng.refresh;
    eng.refresh = function () {
      if (typeof prevRefresh === 'function') prevRefresh();
      if (isOverviewDom(app) || (isHomeStage() && !app.querySelector('.lh'))) {
        var doEnter = firstHome;
        firstHome = false;
        showHome(app, { enter: doEnter });
      } else if (isHomeStage()) {
        firstHome = false;
        if (document.body && document.body.classList) {
          document.body.classList.add('lh-on', 'lh-skin');
        }
      } else {
        // In les: volgende home-terugkeer is "echt"
        firstHome = true;
        if (document.body && document.body.classList) {
          document.body.classList.remove('lh-on');
          document.body.classList.add('lh-skin');
        }
      }
    };

    // Vang legacy overview DOM af
    var obs = new MutationObserver(function () {
      if (isOverviewDom(app)) {
        var doEnter = firstHome;
        firstHome = false;
        showHome(app, { enter: doEnter });
      }
    });
    obs.observe(app, { childList: true, subtree: false });

    // Expliciete home-knop: wel enter()
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest
        ? e.target.closest('[data-action="overview"], .gd-home')
        : null;
      if (!t) return;
      firstHome = true;
      setTimeout(function () {
        if (isHomeStage() || isOverviewDom(app)) showHome(app, { enter: true });
      }, 0);
    }, true);

    // Eerste paint
    try {
      if (isHomeStage() || isOverviewDom(app) || !app.querySelector('.gd-card, .gd-play')) {
        showHome(app, { enter: true });
        firstHome = false;
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
