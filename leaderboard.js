/* Ranglijst: woordenschat XP — vrienden / land / wereld (wekelijkse league) */
(function () {
  'use strict';
  var K_LB = 'alm_lb_v1';
  var K_XP = 'alm_vocab_xp';
  var K_FRIENDS = 'alm_lb_friends_v1';
  var K_COUNTRY = 'alm_lb_country_v1';

  function jget(k, d) {
    try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (_e) { return d; }
  }
  function jset(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (_e) {}
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function weekId() {
    var d = new Date();
    var onejan = new Date(d.getFullYear(), 0, 1);
    var w = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return d.getFullYear() + '-W' + w;
  }
  function hash(s) {
    var h = 2166136261;
    s = String(s);
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function myXp() {
    try { return Math.max(0, parseInt(localStorage.getItem(K_XP) || '0', 10) || 0); } catch (_e) { return 0; }
  }
  function myUser() {
    var u = (window.AL_AUTH && AL_AUTH.current) ? AL_AUTH.current() : null;
    var name = u && u.name ? u.name.split(' ')[0] : 'Jij';
    var pic = u && u.picture ? u.picture : '';
    var id = u && u.sub ? u.sub : 'local';
    return { id: id, name: name, picture: pic, xp: myXp() };
  }
  function country() {
    var c = localStorage.getItem(K_COUNTRY);
    if (c) return c;
    var lang = (navigator.language || 'nl').toLowerCase();
    if (lang.indexOf('be') >= 0) return 'BE';
    if (lang.indexOf('nl') >= 0) return 'NL';
    if (lang.indexOf('de') >= 0) return 'DE';
    if (lang.indexOf('fr') >= 0) return 'FR';
    return (lang.split('-')[1] || 'NL').toUpperCase().slice(0, 2);
  }
  function setCountry(c) {
    try { localStorage.setItem(K_COUNTRY, String(c || 'NL').toUpperCase().slice(0, 2)); } catch (_e) {}
  }
  function friendCode(user) {
    var payload = { n: user.name, x: user.xp, c: country(), w: weekId(), i: user.id.slice(0, 12) };
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(payload)))).replace(/=+$/, '').slice(0, 24);
    } catch (_e) { return ''; }
  }
  function parseFriendCode(code) {
    try {
      var pad = code.length % 4 === 0 ? '' : '===='.slice(code.length % 4);
      var json = decodeURIComponent(escape(atob(code + pad)));
      var o = JSON.parse(json);
      if (!o || typeof o.x !== 'number') return null;
      return { id: o.i || code, name: o.n || 'Vriend', xp: Math.max(0, o.x | 0), country: o.c || '', picture: '', friend: true };
    } catch (_e) { return null; }
  }
  function friends() {
    return jget(K_FRIENDS, []);
  }
  function addFriend(code) {
    var f = parseFriendCode(String(code || '').trim());
    if (!f) return { ok: false, msg: 'Ongeldige vriendencode.' };
    var list = friends().filter(function (x) { return x.id !== f.id; });
    list.unshift(f);
    jset(K_FRIENDS, list.slice(0, 30));
    return { ok: true, msg: f.name + ' toegevoegd.' };
  }
  function removeFriend(id) {
    jset(K_FRIENDS, friends().filter(function (x) { return x.id !== id; }));
  }
  function board(scope) {
    var me = myUser();
    me.you = true;
    me.country = country();
    var list = [];
    /* alleen echte scores: jij + vrienden (geen nep-entries) */
    friends().forEach(function (f) {
      if (scope === 'land' && f.country && f.country !== country()) return;
      list.push({
        id: f.id,
        name: f.name,
        xp: f.xp | 0,
        picture: f.picture || '',
        friend: true,
        country: f.country || ''
      });
    });
    list = list.filter(function (x) { return x.id !== me.id; });
    list.push(me);
    list.sort(function (a, b) { return (b.xp | 0) - (a.xp | 0); });
    list.forEach(function (x, i) { x.rank = i + 1; });
    return list;
  }
  function medal(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return String(rank);
  }

  function render(scope, msg) {
    scope = scope || 'wereld';
    var me = myUser();
    var list = board(scope);
    var myRow = list.filter(function (x) { return x.you; })[0];
    var tabs = [
      ['vrienden', 'Vrienden'],
      ['land', 'Land'],
      ['wereld', 'Wereld']
    ];
    var tabHtml = '<div class="lb-tabs" role="tablist">' + tabs.map(function (t) {
      var on = t[0] === scope;
      return '<button type="button" class="lb-tab' + (on ? ' on' : '') + '" data-h="lb-tab" data-v="' + t[0] + '" role="tab" aria-selected="' + on + '">' + t[1] + '</button>';
    }).join('') + '</div>';

    var hero = '<div class="lb-hero">' +
      '<div class="lb-hero-rank">' + medal(myRow ? myRow.rank : '—') + '</div>' +
      '<div class="lb-hero-meta"><strong>' + esc(me.name) + '</strong>' +
      '<span>' + (me.xp | 0) + ' XP · woordenschat</span>' +
      '<span class="lb-week">Week ' + esc(weekId()) + ' · ' + esc(country()) + '</span></div></div>';

    var empty = list.length <= 1
      ? '<li class="lb-empty">Nog geen andere spelers. Deel je code onder <strong>Vrienden</strong>.</li>'
      : '';
    var rows = list.slice(0, 20).map(function (r) {
      var av = r.picture
        ? '<img class="lb-av" src="' + esc(r.picture) + '" alt="" width="36" height="36" referrerpolicy="no-referrer">'
        : '<span class="lb-av ph" aria-hidden="true">' + esc((r.name || '?').charAt(0).toUpperCase()) + '</span>';
      return '<li class="lb-row' + (r.you ? ' you' : '') + (r.rank <= 3 ? ' top' : '') + '">' +
        '<span class="lb-rank">' + medal(r.rank) + '</span>' + av +
        '<span class="lb-name">' + esc(r.name) + (r.you ? ' <em>(jij)</em>' : '') + '</span>' +
        '<span class="lb-xp">' + (r.xp | 0) + ' XP</span></li>';
    }).join('');

    var friendBox = '';
    if (scope === 'vrienden') {
      friendBox = '<div class="lb-friendbox">' +
        '<p class="lb-hint">Deel je code met vrienden. Zij plakken die hier om jouw score te zien.</p>' +
        '<div class="lb-code-row"><code class="lb-code" id="lb-my-code">' + esc(friendCode(me)) + '</code>' +
        '<button type="button" class="btn btn-ghost" data-h="lb-copy">Kopieer</button></div>' +
        '<div class="lb-add-row"><input class="lb-input" type="text" maxlength="32" placeholder="Vriendencode plakken" data-lb-input="1" aria-label="Vriendencode">' +
        '<button type="button" class="btn btn-blue" data-h="lb-add">Voeg toe</button></div>' +
        (msg ? '<p class="lb-msg" role="status">' + esc(msg) + '</p>' : '') +
        '</div>';
    }

    var note = scope === 'vrienden'
      ? '<p class="lb-note">Alleen echte scores van jou en vrienden via code. Geen valse namen.</p>'
      : '<p class="lb-note">Alleen echte scores. Voeg vrienden toe via code om hen hier te zien' + (scope === 'land' ? ' (zelfde land: ' + esc(country()) + ')' : '') + '.</p>';

    return '<div class="lh-pagehead"><h1>Ranglijst</h1><p class="lh-sub">Woordenschat · wie heeft de hoogste score?</p></div>' +
      hero + tabHtml + friendBox +
      '<section class="lh-card lb-card"><ol class="lb-list">' + rows + empty + '</ol></section>' + note;
  }

  function handle(action, value, inputEl) {
    if (action === 'lb-copy') {
      var code = friendCode(myUser());
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () {}, function () {});
      }
      return { scope: 'vrienden', msg: 'Code gekopieerd.' };
    }
    if (action === 'lb-add') {
      var raw = inputEl && inputEl.value ? inputEl.value : value;
      var res = addFriend(raw);
      return { scope: 'vrienden', msg: res.msg };
    }
    if (action === 'lb-tab') {
      return { scope: value || 'wereld', msg: '' };
    }
    return null;
  }

  // publiceer score lokaal bij updates
  function publish() {
    var st = jget(K_LB, {});
    var me = myUser();
    st.week = weekId();
    st.xp = me.xp;
    st.name = me.name;
    st.country = country();
    st.id = me.id;
    jset(K_LB, st);
  }

  window.GrammarLabLeaderboard = {
    render: render,
    handle: handle,
    publish: publish,
    board: board,
    country: country,
    setCountry: setCountry,
    weekId: weekId
  };
})();
