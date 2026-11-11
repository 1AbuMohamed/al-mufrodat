/* app_bootstrap.js — load app_core and start render */
(async function(){
  function scrollPageTop(){
    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      var app = document.getElementById('app');
      if (app) app.scrollTop = 0;
    } catch (e) {}
  }
  window.__scrollPageTop = scrollPageTop;
  try {
    var res = await fetch('app_core.js');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var inline = await res.text();
    if (!inline.includes('const BASE_WORDS') || !inline.includes('function render(')) {
      throw new Error('app_core ongeldig');
    }
    var s = document.createElement('script');
    s.textContent = inline;
    document.body.appendChild(s);
    if (typeof render === 'function') {
      try { render(); } catch (e) { console.error(e); }
    }
  } catch (err) {
    console.error(err);
    var el = document.getElementById('app');
    if (el) el.innerHTML = '<div style="padding:2rem;font-family:system-ui"><h1>Laden mislukt</h1><p>' + String(err.message || err) + '</p></div>';
  }
})();
