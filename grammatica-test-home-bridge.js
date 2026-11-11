/* Bridge: koppelt GrammarLabHome (Duolingo-startpagina) weer aan grammatica-test.js */
(function () {
  'use strict';
  function wire() {
    if (!window.GrammarLabEngine || !window.GrammarLabHome) return false;
    var eng = window.GrammarLabEngine;
    var app = document.getElementById('gd-app');
    if (!app) return false;

    try { window.GrammarLabHome.mount(app, eng); } catch (e) { console.warn(e); }

    var prevRefresh = eng.refresh;
    eng.refresh = function () {
      try {
        var isHome = typeof eng.isHome === 'function' && eng.isHome();
        if (document.body && document.body.classList) {
          document.body.classList.toggle('lh-on', !!isHome && !!window.GrammarLabHome);
          document.body.classList.add('lh-skin');
        }
      } catch (_e) {}
      if (typeof prevRefresh === 'function') prevRefresh();
      try {
        if (typeof eng.isHome === 'function' && eng.isHome() && window.GrammarLabHome) {
          app.innerHTML = window.GrammarLabHome.view();
          if (window.GrammarLabHome.afterRender) window.GrammarLabHome.afterRender();
        }
      } catch (e) { console.warn(e); }
    };

    var prevOpen = eng.open;
    eng.open = function (n, mode) {
      if (typeof prevOpen === 'function') prevOpen(n, mode);
      else if (typeof prevRefresh === 'function') prevRefresh();
    };

    try {
      if (window.GrammarLabHome.enter) window.GrammarLabHome.enter();
      eng.refresh();
    } catch (e) { console.warn(e); }
    return true;
  }

  function boot() {
    if (wire()) return;
    var n = 0;
    var t = setInterval(function () {
      n += 1;
      if (wire() || n > 40) clearInterval(t);
    }, 50);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
