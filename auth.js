/* Google (Gmail) login via Google Identity Services — client-side sessie */
(function () {
  'use strict';
  var KEY = 'alm_auth_user_v1';
  var listeners = [];
  var user = null;

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      user = raw ? JSON.parse(raw) : null;
    } catch (_e) { user = null; }
    return user;
  }
  function save(u) {
    user = u;
    try {
      if (u) localStorage.setItem(KEY, JSON.stringify(u));
      else localStorage.removeItem(KEY);
    } catch (_e) {}
    listeners.forEach(function (fn) { try { fn(user); } catch (_e2) {} });
  }
  function cfg() {
    return (window.AL_AUTH_CONFIG && window.AL_AUTH_CONFIG.clientId) || '';
  }
  function parseJwt(token) {
    try {
      var p = token.split('.')[1];
      var json = atob(p.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(json.split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')));
    } catch (_e) { return null; }
  }
  function onCredential(resp) {
    if (!resp || !resp.credential) return;
    var payload = parseJwt(resp.credential);
    if (!payload || !payload.email) return;
    save({
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture || '',
      sub: payload.sub || '',
      at: Date.now()
    });
  }
  function ensureGis(cb) {
    if (window.google && google.accounts && google.accounts.id) return cb();
    var s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = function () { cb(); };
    s.onerror = function () { cb(new Error('Google login script kon niet laden')); };
    document.head.appendChild(s);
  }
  function init(cb) {
    load();
    var id = cfg();
    if (!id) { if (cb) cb(new Error('no-client-id')); return; }
    ensureGis(function (err) {
      if (err) { if (cb) cb(err); return; }
      try {
        google.accounts.id.initialize({
          client_id: id,
          callback: onCredential,
          auto_select: false,
          cancel_on_tap_outside: true
        });
        if (cb) cb(null);
      } catch (e) { if (cb) cb(e); }
    });
  }
  function login() {
    var id = cfg();
    if (!id) {
      alert('Gmail-login is nog niet geconfigureerd.\n\nMaak een Google OAuth Client ID aan en zet die in auth-config.js.');
      return;
    }
    init(function (err) {
      if (err) {
        alert('Login kon niet starten. Controleer je internetverbinding en Client ID.');
        return;
      }
      // One Tap of popup
      try {
        google.accounts.id.prompt(function (n) {
          if (n && n.isNotDisplayed && n.isNotDisplayed()) {
            // Fallback: render tijdelijke knop en klik
            var host = document.getElementById('al-auth-btn-host');
            if (!host) {
              host = document.createElement('div');
              host.id = 'al-auth-btn-host';
              host.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden';
              document.body.appendChild(host);
            }
            host.innerHTML = '';
            google.accounts.id.renderButton(host, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              shape: 'pill',
              logo_alignment: 'left'
            });
            var btn = host.querySelector('div[role="button"]');
            if (btn) btn.click();
          }
        });
      } catch (_e) {
        alert('Google login is geblokkeerd in deze browser.');
      }
    });
  }
  function logout() {
    save(null);
    try {
      if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
      }
    } catch (_e) {}
  }
  function current() { return user || load(); }
  function onChange(fn) { if (typeof fn === 'function') listeners.push(fn); }

  // Publieke API
  window.AL_AUTH = {
    current: current,
    login: login,
    logout: logout,
    onChange: onChange,
    init: init,
    configured: function () { return !!cfg(); }
  };

  // Start: sessie herstellen
  load();
  if (cfg()) {
    // GIS lazy init zodat One Tap later kan
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { init(function () {}); });
    } else {
      setTimeout(function () { init(function () {}); }, 0);
    }
  }
})();
