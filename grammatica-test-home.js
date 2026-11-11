/* Al-Mufrodat · Grammatica Lab: startpagina (leerpad, lessen, missies, profiel).
 * Leest uitsluitend window.GRAMMATICA (via GrammarLabCore) en eigen localStorage-sleutels.
 * Verzint geen Arabische zinnen, vertalingen of termen.
 */
(function () {
  'use strict';

  var K_PROG = 'alm_grammar_test_v2';
  var K_SET = 'alm_grammar_test_settings_v1';
  var K_SCORE = 'alm_grammar_test_scores_v1';
  var EXPORT_TAG = 'al-mufrodat-grammatica-lab';
  var INTERVALS = [1, 2, 4, 8, 16];
  var OFFSETS = [0, -40, -64, -40, 0, 40, 64, 40];
  var ITEM_H = 120;

  var app = null, engine = null, bound = false;
  var snap = null;
  var ui = {
    section: 'leer', pop: null, sheet: null, more: false, tip: null,
    needScroll: true, bump: null, msg: null, refocus: null, opener: null
  };

  /* ---------- hulpfuncties ---------- */
  function esc(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function jget(key, def) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v && typeof v === 'object' ? v : def;
    } catch (_e) { return def; }
  }
  function jset(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_e) {}
  }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function dkey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return dkey(new Date()); }
  function addDays(key, n) {
    var p = key.split('-');
    return dkey(new Date(+p[0], +p[1] - 1, +p[2] + n));
  }
  function reduced() {
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch (_e) { return false; }
  }
  function core() { return window.GrammarLabCore; }
  function vocab() { return window.GrammarLabVocab && window.AL_VOCAB ? window.GrammarLabVocab : null; }
  function isVocab() { return !!vocab() && settings().path === 'vocab'; }
  function data() { return window.GRAMMATICA || {}; }

  /* ---------- opslag ---------- */
  function settings() {
    var s = jget(K_SET, {});
    return {
      sound: s.sound !== false,
      goal: [20, 30, 50].indexOf(s.goal) >= 0 ? s.goal : 20,
      theme: ['dark', 'light'].indexOf(s.theme) >= 0 ? s.theme : 'system',
      tab: s.tab === 'lessons' ? 'lessons' : 'path',
      path: s.path === 'vocab' ? 'vocab' : 'grammatica'
    };
  }
  function saveSettings(patch) {
    var s = settings();
    for (var k in patch) s[k] = patch[k];
    jset(K_SET, s);
    applyTheme();
  }
  function applyTheme() {
    var t = settings().theme, root = document.documentElement;
    if (!root || !root.setAttribute) return;
    if (t === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', t);
  }
  function prog() {
    var p = jget(K_PROG, {});
    if (typeof p.xp !== 'number') p.xp = 0;
    if (!p.items || typeof p.items !== 'object') p.items = {};
    if (!p.days || typeof p.days !== 'object') p.days = {};
    if (!Array.isArray(p.hit)) p.hit = [];
    if (!p.perfectDay || typeof p.perfectDay !== 'object') p.perfectDay = {};
    if (typeof p.best !== 'number') p.best = 0;
    return p;
  }
  function item(n, p) {
    var it = p.items[n];
    if (it) return it;
    var s = jget(K_SCORE, {})[n];
    if (s && s.total) {
      return { m: s.correct === s.total ? 1 : 0, last: s.date, ratio: s.correct / s.total, rounds: 1, legacy: true };
    }
    return null;
  }
  function streak(p) {
    var t = today(), d = p.hit.indexOf(t) >= 0 ? t : addDays(t, -1), c = 0;
    while (p.hit.indexOf(d) >= 0) { c++; d = addDays(d, -1); }
    return c;
  }
  function hasProgress(p) {
    return p.xp > 0 || Object.keys(p.items).length > 0 || Object.keys(jget(K_SCORE, {})).length > 0;
  }

  function record(res) {
    var p = prog(), t = today(), goal = settings().goal;
    var xp = Math.max(0, res.xp | 0);
    p.xp += xp;
    p.days[t] = (p.days[t] || 0) + xp;
    if (p.days[t] >= goal && p.hit.indexOf(t) < 0) p.hit.push(t);
    if (res.total > 0 && res.correct === res.total) p.perfectDay[t] = true;
    var it = item(res.lesson, p) || { m: 0, rounds: 0 };
    delete it.legacy;
    if (!res.review && res.total > 0) {
      var perfect = res.correct === res.total;
      if (perfect) it.m = Math.min(5, (it.m | 0) + 1);
      else if (res.correct / res.total < 0.5) it.m = Math.max(0, (it.m | 0) - 1);
      it.last = t;
      it.ratio = res.correct / res.total;
      it.rounds = (it.rounds | 0) + 1;
    } else if (!it.last) {
      it.last = t;
    }
    p.items[res.lesson] = it;
    p.last = res.lesson;
    p.best = Math.max(p.best, streak(p));
    jset(K_PROG, p);
  }
  function markRead(n) {
    var p = prog(), it = p.items[n] || { m: 0, rounds: 0 };
    if (it.read) return;
    it.read = true; it.last = today();
    p.items[n] = it;
    jset(K_PROG, p);
  }

  /* ---------- lesinformatie ---------- */
  function subtitle(n) {
    var l = data()[n];
    var t = l && String(l.titel || '').trim();
    return t && !/^Les\s*\d+$/i.test(t) ? t : '';
  }
  function pageLabel(n) {
    var l = data()[n];
    return l && l.boekpagina ? 'blz. ' + l.boekpagina : '';
  }
  function info(n, p) {
    var has = core() && core().getExamples(n).length > 0;
    var it = item(n, p);
    var o = { n: n, has: has, sub: subtitle(n), page: pageLabel(n), m: 0, state: 'none', pct: 0, weak: false };
    if (!has) {
      o.read = true;
      if (it && it.read) { o.state = 'mastered'; o.pct = 100; }
      return o;
    }
    if (!it) return o;
    o.m = Math.max(0, Math.min(5, it.m | 0));
    if (o.m >= 1 && it.last && today() >= addDays(it.last, INTERVALS[o.m - 1])) {
      o.state = 'weak'; o.weak = true;
    } else {
      o.state = o.m >= 5 ? 'mastered' : 'going';
    }
    o.pct = o.m >= 5 ? 100 : Math.max(o.m * 20, 10);
    return o;
  }
  function plan(p) {
    var keys = Object.keys(data()).map(Number).sort(function (a, b) { return a - b; });
    var list = keys.map(function (n) { return info(n, p); });
    var weak = list.filter(function (o) { return o.weak; });
    var cur = weak[0] || list.filter(function (o) { return o.state !== 'mastered'; })[0] || list[0];
    return { list: list, weak: weak, cur: cur };
  }
  function statusText(o, isCur) {
    if (o.kind === 'vocab') return o.state === 'mastered' ? 'alle woorden beheerst' : o.state === 'going' ? o.mastered + ' van ' + o.total + ' woorden beheerst' : (isCur ? 'huidige les' : 'nog niet gestart');
    if (o.read) return o.state === 'mastered' ? 'gelezen' : 'alleen theorie';
    if (o.weak) return 'herhalen';
    if (o.state === 'mastered') return 'beheerst, 5 van 5';
    if (o.state === 'going') return 'beheersing ' + o.m + ' van 5';
    return isCur ? 'huidige les' : 'nog niet gestart';
  }

  /* ---------- iconen (inline SVG, 2px lijn) ---------- */
  var ICONS = {
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>',
    star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    crown: '<path d="M3 19h18M4 17 3 7l5 4 4-7 4 7 5-4-1 10z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    home: '<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-7h6v7"/>',
    chest: '<path d="M3 11h18v9H3z"/><path d="M4 11a8 5 0 0 1 16 0"/><path d="M12 14v3"/>',
    chestopen: '<path d="M3 12h18v8H3z"/><path d="M4 12l1-6 14-2 1 8"/><path d="M12 15v2"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    lock: '<path d="M5 11h14v10H5z"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    warn: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    dots: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'
  };
  function ic(name, size, fill) {
    var s = size || 24;
    return '<svg class="lh-ic" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="' + (fill ? 'currentColor' : 'none') +
      '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      ICONS[name] + '</svg>';
  }

  /* ---------- onderdelen ---------- */
  var NAV = [
    ['leer', 'home', 'LEER'], ['oefen', 'target', 'OEFEN'], ['missies', 'chest', 'MISSIES'],
    ['profiel', 'user', 'PROFIEL'], ['more', 'dots', 'MEER']
  ];

  function nav() {
    return '<nav class="lh-nav" aria-label="Hoofdmenu">' +
      '<button type="button" class="lh-logo" data-h="nav" data-v="leer" data-f="logo" aria-label="Al-Mufrodat, terug naar Leer">' +
      '<img src="assets/al-mufrodat-logo.svg" alt="" height="32"></button>' +
      NAV.map(function (n) {
        var more = n[0] === 'more', on = !more && ui.section === n[0];
        return '<button type="button" class="lh-navitem' + (on ? ' on' : '') + '" data-h="' + (more ? 'more' : 'nav') +
          '" data-v="' + n[0] + '" data-f="nav-' + n[0] + '" aria-label="' + n[2].charAt(0) + n[2].slice(1).toLowerCase() +
          '" title="' + n[2].charAt(0) + n[2].slice(1).toLowerCase() + '"' + (on ? ' aria-current="page"' : '') +
          (more ? ' aria-haspopup="true" aria-expanded="' + ui.more + '"' : '') + '>' +
          '<span class="lh-navic">' + ic(n[1], 28) + '</span><span class="lh-navlb">' + n[2] + '</span></button>';
      }).join('') + '</nav>';
  }

  function chip(kind, icon, value, label, extra) {
    return '<button type="button" class="lh-chip ' + kind + (extra || '') + '" data-h="tip" data-v="' + kind +
      '" data-f="chip-' + kind + '" aria-label="' + esc(label) + '" aria-expanded="' + (ui.tip === kind) + '">' +
      ic(icon, 28, true) + '<span>' + value + '</span></button>';
  }
  var TIPS = {
    flame: 'Streak: dagen op rij waarop je je dagdoel haalde',
    bolt: 'XP: je punten',
    heart: 'Hartjes: je mag 5 fouten per ronde maken'
  };
  function topbar(p) {
    var st = streak(p), todayXp = p.days[today()] || 0;
    var b = ui.bump || {};
    return '<header class="lh-top"><div class="lh-chips">' +
      chip('flame', 'flame', st, 'Streak: ' + st + ' dagen', (st === 0 ? ' zero' : '') + (b.streak ? ' bump' : '')) +
      chip('bolt', 'bolt', p.xp, 'XP: ' + p.xp + ' totaal, ' + todayXp + ' vandaag', b.xp ? ' bump' : '') +
      chip('heart', 'heart', 5, 'Hartjes: 5', '') +
      (ui.tip ? '<div class="lh-tip" role="status">' + esc(TIPS[ui.tip]) + '</div>' : '') +
      '</div></header>';
  }

  function crowns(m) {
    var out = '';
    for (var i = 0; i < 5; i++) out += '<span class="lh-crown' + (i < m ? ' on' : '') + '">' + ic('crown', 20, i < m) + '</span>';
    return '<span class="lh-crowns" role="img" aria-label="Beheersing ' + m + ' van 5">' + out + '</span>';
  }
  function lessonCard(o) {
    if (o.kind === 'vocab') {
      return '<h3 class="lh-pop-title">Les ' + o.n + '</h3>' +
        (o.sub ? '<p class="lh-pop-sub">' + esc(o.sub) + '</p>' : '') +
        crowns(o.m) + '<p class="lh-pop-note">' + o.mastered + ' van ' + o.total + ' woorden beheerst</p>' +
        '<div class="lh-pop-btns"><button type="button" class="btn btn-ghost" data-h="vwords" data-v="' + o.n + '">WOORDEN</button>' +
        '<button type="button" class="btn btn-blue" data-h="vstart" data-v="' + o.n + '">' + (o.state === 'mastered' ? 'HERHAAL' : 'START') + '</button></div>';
    }
    var btns;
    if (o.read) {
      btns = '<button type="button" class="btn btn-blue" data-h="theory" data-v="' + o.n + '">LEES LES</button>';
    } else {
      btns = '<button type="button" class="btn btn-ghost" data-h="theory" data-v="' + o.n + '">THEORIE</button>' +
        '<button type="button" class="btn ' + (o.weak ? 'btn-green' : 'btn-blue') + '" data-h="start" data-v="' + o.n + '">' +
        (o.weak ? 'HERHAAL' : 'START') + '</button>';
    }
    return '<h3 class="lh-pop-title">Les ' + o.n + '</h3>' +
      (o.sub ? '<p class="lh-pop-sub">' + esc(o.sub) + '</p>' : (o.page ? '<p class="lh-pop-sub">' + esc(o.page) + '</p>' : '')) +
      (o.read ? '<p class="lh-pop-note">Alleen theorie, geen oefenvoorbeelden' + (o.state === 'mastered' ? ' · gelezen' : '') + '</p>'
        : crowns(o.m) + '<p class="lh-pop-note">Beheersing ' + o.m + ' / 5' +
          (o.weak ? ' · <strong class="lh-warn">tijd om te herhalen</strong>' : '') + '</p>') +
      '<div class="lh-pop-btns">' + btns + '</div>';
  }

  function nodeHtml(o, i, isCur, blockLast, nextX) {
    var x = OFFSETS[i % 8];
    var cls = 'lh-node ' + o.state + (isCur && !o.weak ? ' cur' : '') + (o.weak ? ' weak' : '') +
      (ui.bump && ui.bump.lesson === o.n ? ' pop' : '');
    var ring = o.state === 'going' || (isCur && !o.weak) ? ' style="--p:' + (isCur && o.state === 'none' ? 0 : o.pct) + '%"' : '';
    var inner;
    if (o.read) inner = ic('book', 32);
    else if (o.state === 'mastered' && !o.weak) inner = ic('crown', 30, true) + '<b class="lh-dig">' + o.m + '</b>';
    else if (o.weak) inner = ic('crown', 26, o.m >= 1) + '<b class="lh-dig">' + o.m + '</b>' + '<span class="lh-badge">' + ic('warn', 16) + '</span>';
    else inner = '<b class="lh-num">' + o.n + '</b>';
    var conn = '';
    if (!blockLast) {
      var dx = nextX - x, len = Math.sqrt(dx * dx + ITEM_H * ITEM_H), ang = Math.atan2(ITEM_H, dx) * 180 / Math.PI;
      conn = '<span class="lh-conn" aria-hidden="true" style="left:calc(50% + ' + x + 'px);top:' + (ITEM_H / 2) +
        'px;width:' + len.toFixed(1) + 'px;transform:rotate(' + ang.toFixed(2) + 'deg)"></span>';
    }
    var bubble = '';
    if (isCur && ui.pop !== o.n) {
      bubble = '<button type="button" class="lh-bubble" data-h="' + (o.kind === 'vocab' ? 'vstart' : 'start') + '" data-v="' + o.n + '" data-f="bubble">' +
        (o.weak ? 'HERHAAL' : 'START') + '</button>';
    }
    var pop = ui.pop === o.n
      ? '<div class="lh-pop" role="dialog" aria-label="Les ' + o.n + '" style="--ax:' + x + 'px">' + lessonCard(o) + '</div>' : '';
    return '<div class="lh-item" style="height:' + ITEM_H + 'px">' + conn +
      '<div class="lh-nodewrap" style="transform:translateX(' + x + 'px)"' + (isCur ? ' data-cur="1"' : '') + '>' + bubble +
      '<button type="button" class="' + cls + '"' + ring + ' data-h="node" data-v="' + o.n + '" data-f="node-' + o.n +
      '" aria-haspopup="dialog" aria-expanded="' + (ui.pop === o.n) + '" aria-label="Les ' + o.n +
      (o.sub ? ', ' + esc(o.sub) : '') + ', ' + statusText(o, isCur) + '"><span class="disc">' + inner + '</span></button>' +
      '</div>' + pop + '</div>';
  }

  function pathHtml(pl) {
    var out = '', i = 0, block = 0;
    var cur = pl.cur ? pl.cur.n : -1;
    for (var start = 0; start < pl.list.length; start += 6) {
      block++;
      out += '<div class="lh-block" role="separator"><span>BLOK ' + block + '</span></div>';
      var chunk = pl.list.slice(start, start + 6);
      chunk.forEach(function (o, k) {
        var last = k === chunk.length - 1;
        out += nodeHtml(o, start + k, o.n === cur, last, OFFSETS[(start + k + 1) % 8]);
      });
    }
    return '<div class="lh-path" id="lh-panel-path" role="tabpanel" aria-labelledby="lh-tab-path">' + out + '</div>';
  }

  function tilesHtml(pl) {
    var cur = pl.cur ? pl.cur.n : -1;
    return '<div class="lh-tiles" id="lh-panel-lessons" role="tabpanel" aria-labelledby="lh-tab-lessons">' +
      pl.list.map(function (o) {
        var cls = 'lh-tile ' + o.state + (o.n === cur ? ' cur' : '');
        var t = o.sub || o.page || '';
        return '<button type="button" class="' + cls + '" data-h="tile" data-v="' + o.n + '" data-f="tile-' + o.n +
          '" aria-label="Les ' + o.n + (o.sub ? ', ' + esc(o.sub) : '') + ', ' + statusText(o, o.n === cur) + '">' +
          (o.read ? '<span class="lh-tile-ic">' + ic('book', 16) + '</span>' : '') +
          (o.state === 'mastered' && !o.read ? '<span class="lh-tile-ic gold">' + ic('crown', 16, true) + '</span>' : '') +
          '<b class="lh-tile-num">' + o.n + '</b>' +
          '<span class="lh-tile-title">' + esc(t) + '</span>' +
          '<span class="lh-pill ' + o.state + '"><i style="width:' + o.pct + '%"></i></span></button>';
      }).join('') + '</div>';
  }

  function tabs(s) {
    function tab(id, label) {
      var on = s.tab === id;
      return '<button type="button" role="tab" class="lh-tab' + (on ? ' on' : '') + '" id="lh-tab-' + id + '" data-h="tab" data-v="' + id +
        '" data-f="tab-' + id + '" aria-selected="' + on + '" aria-controls="lh-panel-' + (id === 'path' ? 'path' : 'lessons') +
        '" tabindex="' + (on ? 0 : -1) + '">' + label + '</button>';
    }
    return '<div class="lh-tabs" role="tablist" aria-label="Weergave">' + tab('path', 'LEERPAD') + tab('lessons', 'LESSEN') + '</div>';
  }

  function pathSwitch(s) {
    if (!vocab()) return '';
    function b(id, label) {
      var on = (s.path === 'vocab' ? 'vocab' : 'grammatica') === id;
      return '<button type="button" role="tab" class="lh-pswitch' + (on ? ' on' : '') + '" data-h="path" data-v="' + id + '" data-f="path-' + id +
        '" aria-selected="' + on + '">' + label + '</button>';
    }
    return '<div class="lh-pathswitch" role="tablist" aria-label="Leerpad">' + b('grammatica', 'GRAMMATICA') + b('vocab', 'WOORDENSCHAT') + '</div>';
  }
  function vocabMain(s, pl) {
    var cur = pl.cur, t = vocab().totals();
    var banner = cur ? '<div class="lh-banner vocab"><div><small>LES ' + cur.n + '</small><strong>' +
      esc(cur.sub || 'Woordenschat') + '</strong></div>' +
      '<button type="button" class="btn btn-white" data-h="vwords" data-v="' + cur.n + '">WOORDEN</button></div>' : '';
    return pathSwitch(s) + banner + tabs(s) +
      '<div class="lh-hero"><h1>Woordenschat oefenen</h1><p class="lh-sub">' + t.mastered + ' van ' + t.total + ' woorden beheerst' +
      (cur ? ' · Les ' + cur.n : '') + '</p>' +
      '<button type="button" class="btn btn-blue lh-go" data-h="vgo" data-f="go">GA VERDER</button></div>' +
      (s.tab === 'lessons' ? tilesHtml(pl) : pathHtml(pl));
  }
  function leerMain(p, s, pl) {
    if (isVocab()) return vocabMain(s, vocab().plan());
    var cur = pl.cur;
    var returning = hasProgress(p);
    var sub = returning && cur ? 'Les ' + cur.n + (cur.sub ? ' · ' + esc(cur.sub) : '') : 'Maak kennis met de Medina-grammatica';
    var banner = cur ? '<div class="lh-banner"><div><small>LES ' + cur.n + '</small><strong>' +
      esc(cur.sub || 'Medina-grammatica') + '</strong></div>' +
      '<button type="button" class="btn btn-white" data-h="theory" data-v="' + cur.n + '">THEORIE</button></div>' : '';
    return pathSwitch(s) + banner + tabs(s) +
      '<div class="lh-hero"><h1>Laten we Arabisch leren!</h1><p class="lh-sub">' + sub + '</p>' +
      '<button type="button" class="btn btn-blue lh-go" data-h="go" data-f="go">GA VERDER</button></div>' +
      (s.tab === 'lessons' ? tilesHtml(pl) : pathHtml(pl));
  }

  function bar(pct, label, extra) {
    return '<div class="lh-bar' + (extra || '') + '" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct +
      '"><i style="width:' + pct + '%"></i><span>' + label + '</span></div>';
  }
  function cardMissions(p, s) {
    var t = today(), xp = Math.min(p.days[t] || 0, s.goal), pct = Math.round(100 * xp / s.goal);
    var done = xp >= s.goal, perfect = !!p.perfectDay[t];
    return '<section class="lh-card"><div class="lh-card-head"><h2>Dagelijkse missies</h2>' +
      (ui.section === 'missies' ? '' : '<button type="button" class="lh-link" data-h="seeall">BEKIJK ALLE</button>') + '</div>' +
      '<div class="lh-mission"><span class="lh-mic gold">' + ic('bolt', 36, true) + '</span><div class="lh-mbody"><strong>Verdien ' + s.goal + ' XP</strong><div class="lh-mrow">' +
      bar(pct, xp + ' / ' + s.goal, ' gold') + '<span class="lh-chest' + (done ? ' open' : '') + '">' + ic(done ? 'chestopen' : 'chest', 32) + '</span></div></div></div>' +
      '<div class="lh-mission"><span class="lh-mic green">' + ic('star', 36, true) + '</span><div class="lh-mbody"><strong>Maak een ronde zonder fouten</strong><div class="lh-mrow">' +
      bar(perfect ? 100 : 0, (perfect ? 1 : 0) + ' / 1', ' green') + '<span class="lh-chest' + (perfect ? ' open' : '') + '">' + ic(perfect ? 'check' : 'chest', 32) + '</span></div></div></div></section>';
  }
  function cardStreak(p) {
    var st = streak(p), best = Math.max(p.best, st), t = new Date();
    var wd = (t.getDay() + 6) % 7, monday = addDays(dkey(t), -wd);
    var names = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
    var dots = names.map(function (nm, i) {
      var k = addDays(monday, i), on = p.hit.indexOf(k) >= 0;
      return '<span class="lh-day' + (on ? ' on' : '') + (k === dkey(t) ? ' today' : '') + '"><span class="lh-dot">' + (on ? ic('check', 14) : '') +
        '</span><small>' + nm + '</small></span>';
    }).join('');
    return '<section class="lh-card"><div class="lh-card-head"><h2>Streak</h2></div><div class="lh-streak">' +
      '<span class="lh-streak-ic' + (st === 0 ? ' zero' : '') + '">' + ic('flame', 44, true) + '</span>' +
      '<div><strong class="lh-big">' + st + '</strong> <span>' + (st === 1 ? 'dag' : 'dagen') + ' op rij</span><p>Beste streak: ' + best + '</p></div></div>' +
      '<div class="lh-days">' + dots + '</div></section>';
  }
  function cardWeak(pl) {
    if (!pl.weak.length) return '';
    var n = pl.weak.length;
    return '<section class="lh-card"><div class="lh-card-head"><h2>Zwakke punten</h2></div>' +
      '<p class="lh-card-text">' + n + (n === 1 ? ' onderdeel' : ' onderdelen') + ' om te herhalen</p>' +
      '<button type="button" class="btn btn-green lh-full" data-h="weak">OEFEN NU</button></section>';
  }
  function cardSave() {
    return '<section class="lh-card"><div class="lh-card-head"><h2>Bewaar je voortgang</h2></div>' +
      '<p class="lh-card-text">Je voortgang staat alleen in deze browser. Maak een back-up of zet hem op een ander apparaat.</p>' +
      (ui.msg ? '<p class="lh-msg ' + ui.msg.kind + '" role="status">' + esc(ui.msg.text) + '</p>' : '') +
      '<div class="lh-btnstack"><button type="button" class="btn btn-green lh-full" data-h="export">EXPORTEER</button>' +
      '<button type="button" class="btn btn-blue lh-full" data-h="import">IMPORTEER</button></div></section>';
  }
  function cardStats(p, pl) {
    var mastered = pl.list.filter(function (o) { return o.state === 'mastered' && !o.weak; }).length;
    var started = pl.list.filter(function (o) { return o.state !== 'none'; }).length;
    function row(label, val) { return '<li><span>' + label + '</span><strong>' + val + '</strong></li>'; }
    return '<section class="lh-card"><div class="lh-card-head"><h2>Statistieken</h2></div><ul class="lh-stats">' +
      row('XP totaal', p.xp) + row('Streak', streak(p) + ' dagen') + row('Beste streak', Math.max(p.best, streak(p)) + ' dagen') +
      row('Lessen gestart', started + ' / ' + pl.list.length) + row('Lessen beheerst', mastered + ' / ' + pl.list.length) + '</ul></section>';
  }

  function railCards(p, s, pl) {
    return cardMissions(p, s) + cardStreak(p) + cardWeak(pl) + cardSave();
  }

  function oefenMain(pl) {
    var rows = pl.weak.map(function (o) {
      return '<li class="lh-weakrow"><div><strong>Les ' + o.n + '</strong><small>' + (o.sub ? esc(o.sub) + ' · ' : '') + 'beheersing ' + o.m + ' / 5</small></div>' +
        '<button type="button" class="btn btn-green" data-h="start" data-v="' + o.n + '">HERHAAL</button></li>';
    }).join('');
    return '<div class="lh-pagehead"><h1>Oefen</h1><p class="lh-sub">Herhaal wat je bijna vergeten bent.</p></div>' +
      (pl.weak.length
        ? '<section class="lh-card"><div class="lh-card-head"><h2>Zwakke punten</h2></div><ul class="lh-weaklist">' + rows + '</ul>' +
          '<button type="button" class="btn btn-green lh-full" data-h="weak">OEFEN NU</button></section>'
        : '<section class="lh-card lh-empty"><span class="lh-empty-ic">' + ic('check', 40) + '</span><h2>Niets om te herhalen</h2>' +
          '<p class="lh-card-text">Je hebt geen achterstallige lessen. Ga verder met het leerpad.</p>' +
          '<button type="button" class="btn btn-blue lh-full" data-h="go">GA VERDER</button></section>');
  }
  function missiesMain(p, s) {
    return '<div class="lh-pagehead"><h1>Missies</h1><p class="lh-sub">Haal elke dag je dagdoel.</p></div>' +
      cardMissions(p, s) + cardStreak(p);
  }
  function profielMain(p, s, pl) {
    return '<div class="lh-pagehead"><h1>Profiel</h1><p class="lh-sub">Je voortgang in dit Grammatica Lab.</p></div>' +
      cardStats(p, pl) + cardWeak(pl) + cardSave();
  }

  function seg(label, setting, options, current) {
    return '<div class="lh-setting"><span class="lh-setlabel" id="lh-set-' + setting + '">' + label + '</span>' +
      '<div class="lh-seg" role="group" aria-labelledby="lh-set-' + setting + '">' + options.map(function (o) {
        return '<button type="button" class="lh-segbtn' + (String(current) === String(o[0]) ? ' on' : '') + '" data-h="set-' + setting +
          '" data-v="' + o[0] + '" aria-pressed="' + (String(current) === String(o[0])) + '">' + o[1] + '</button>';
      }).join('') + '</div></div>';
  }
  function moreHtml(s) {
    return '<div class="lh-more" role="dialog" aria-label="Meer">' +
      '<div class="lh-setting"><span class="lh-setlabel">Geluid</span>' +
      '<button type="button" class="lh-switch' + (s.sound ? ' on' : '') + '" data-h="set-sound" role="switch" aria-checked="' + s.sound +
      '"><span class="lh-knob"></span><span class="lh-sr">Geluid ' + (s.sound ? 'aan' : 'uit') + '</span></button></div>' +
      seg('Dagdoel', 'goal', [[20, '20 XP'], [30, '30 XP'], [50, '50 XP']], s.goal) +
      seg('Thema', 'theme', [['system', 'Systeem'], ['dark', 'Donker'], ['light', 'Licht']], s.theme) +
      '<a class="lh-morelink" href="index.html#/grammatica">Originele grammatica</a>' +
      '<button type="button" class="lh-morelink danger" data-h="reset">Voortgang wissen</button></div>';
  }

  function view() {
    var p = prog(), s = settings(), pl = plan(p);
    applyTheme();
    if (!snap) snap = { xp: p.xp, streak: streak(p) };
    var sec = ui.section, main, rail = '';
    if (sec === 'oefen') main = oefenMain(pl);
    else if (sec === 'missies') main = missiesMain(p, s);
    else if (sec === 'profiel') main = profielMain(p, s, pl);
    else main = leerMain(p, s, pl);
    if (sec === 'leer' || sec === 'oefen') rail = '<aside class="lh-rail" aria-label="Overzicht">' + railCards(p, s, pl) + '</aside>';
    var sheet = '';
    if (ui.sheet != null) {
      var o = (isVocab() ? vocab().plan() : pl).list.filter(function (x) { return x.n === ui.sheet; })[0];
      if (o) sheet = '<div class="lh-scrim" data-h="close"></div><div class="lh-sheet" role="dialog" aria-modal="true" aria-label="Les ' + o.n +
        '">' + lessonCard(o) + '<button type="button" class="lh-sheetclose" data-h="close" aria-label="Sluiten">×</button></div>';
    }
    return '<div class="lh" data-section="' + sec + '">' + nav() + topbar(p) +
      '<div class="lh-main">' + main + '</div>' + rail + (ui.more ? moreHtml(s) : '') + sheet +
      '<div class="lh-sr" aria-live="polite">XP ' + p.xp + ', streak ' + streak(p) + ' dagen</div>' +
      '<input type="file" class="lh-file" accept=".json,application/json" data-h-file="1" tabindex="-1" aria-hidden="true"></div>';
  }

  /* ---------- gedrag ---------- */
  function rerender() { if (engine) engine.refresh(); }
  function focusKey() {
    var a = document.activeElement;
    return a && a.getAttribute ? a.getAttribute('data-f') : null;
  }
  function closeAll() { ui.pop = null; ui.sheet = null; ui.more = false; ui.tip = null; }
  function go(n, mode) { closeAll(); engine.open(n, mode); }

  function afterRender() {
    var key = ui.refocus;
    ui.refocus = null;
    var root = app;
    if (key && root && root.querySelector) {
      var el = root.querySelector('[data-f="' + key + '"]');
      if (el && el.focus) { try { el.focus({ preventScroll: true }); } catch (_e) { el.focus(); } }
    }
    ui.bump = null;
    if (ui.needScroll && ui.section === 'leer' && settings().tab === 'path' && root && root.querySelector) {
      var cur = root.querySelector('[data-cur]');
      if (cur && cur.scrollIntoView) {
        cur.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
      }
      ui.needScroll = false;
    }
  }

  function doExport() {
    var data = {};
    [K_SCORE, K_PROG, K_SET].forEach(function (k) {
      var v = jget(k, null);
      if (v) data[k] = v;
    });
    var blob = new Blob([JSON.stringify({ app: EXPORT_TAG, versie: 1, datum: today(), data: data }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'grammatica-lab-voortgang-' + today() + '.json';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    ui.msg = { kind: 'ok', text: 'Back-up gedownload.' };
    rerender();
  }
  function validate(obj) {
    if (!obj || obj.app !== EXPORT_TAG || !obj.data || typeof obj.data !== 'object') return 'Dit is geen back-up van het Grammatica Lab.';
    var keys = Object.keys(obj.data);
    if (!keys.length) return 'Het bestand bevat geen voortgang.';
    for (var i = 0; i < keys.length; i++) {
      if ([K_SCORE, K_PROG, K_SET].indexOf(keys[i]) < 0) return 'Onbekende gegevens in het bestand.';
      var v = obj.data[keys[i]];
      if (!v || typeof v !== 'object' || Array.isArray(v)) return 'De gegevens in het bestand zijn ongeldig.';
    }
    var pr = obj.data[K_PROG];
    if (pr && ((pr.xp != null && typeof pr.xp !== 'number') || (pr.items != null && typeof pr.items !== 'object') ||
      (pr.hit != null && !Array.isArray(pr.hit)))) return 'De voortgang in het bestand is ongeldig.';
    return null;
  }
  function doImport(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var obj = null;
      try { obj = JSON.parse(String(reader.result)); } catch (_e) {}
      var err = obj ? validate(obj) : 'Dit bestand is geen geldige JSON.';
      if (err) { ui.msg = { kind: 'err', text: 'Importeren mislukt: ' + err }; return rerender(); }
      if (!window.confirm('Je huidige voortgang in het Grammatica Lab wordt overschreven. Doorgaan?')) return;
      Object.keys(obj.data).forEach(function (k) { jset(k, obj.data[k]); });
      ui.msg = { kind: 'ok', text: 'Voortgang geïmporteerd.' };
      snap = null; ui.needScroll = true;
      rerender();
    };
    reader.onerror = function () { ui.msg = { kind: 'err', text: 'Het bestand kon niet worden gelezen.' }; rerender(); };
    reader.readAsText(file);
  }

  function onClick(e) {
    var t = e.target.closest ? e.target.closest('[data-h]') : null;
    if (!t) {
      if (e.target.closest && e.target.closest('.lh-pop,.lh-more,.lh-sheet')) return;
      if (ui.pop != null || ui.more || ui.tip != null) { closeAll(); rerender(); }
      return;
    }
    var h = t.getAttribute('data-h'), v = t.getAttribute('data-v');
    var n = v != null && /^\d+$/.test(v) ? Number(v) : null;
    var p = prog();
    switch (h) {
      case 'nav':
        closeAll(); ui.section = v; ui.refocus = 'nav-' + v;
        if (v === 'leer') ui.needScroll = true;
        window.scrollTo && window.scrollTo(0, 0);
        return rerender();
      case 'more':
        var open = !ui.more; closeAll(); ui.more = open; ui.refocus = 'nav-more'; return rerender();
      case 'tip':
        var was = ui.tip === v; closeAll(); ui.tip = was ? null : v; ui.refocus = 'chip-' + v; return rerender();
      case 'tab':
        closeAll(); saveSettings({ tab: v }); if (v === 'path') ui.needScroll = true; ui.refocus = 'tab-' + v; return rerender();
      case 'node':
        var same = ui.pop === n; closeAll(); ui.pop = same ? null : n; ui.refocus = 'node-' + n; return rerender();
      case 'tile':
        closeAll(); ui.sheet = n; ui.opener = 'tile-' + n; return rerender();
      case 'close':
        var op = ui.opener; closeAll(); ui.refocus = op; return rerender();
      case 'path':
        closeAll(); saveSettings({ path: v === 'vocab' ? 'vocab' : 'grammatica' }); ui.needScroll = true; ui.refocus = 'path-' + v;
        window.scrollTo && window.scrollTo(0, 0);
        return rerender();
      case 'vstart': closeAll(); return vocab() && vocab().open(n, 'play');
      case 'vwords': closeAll(); return vocab() && vocab().open(n, 'words');
      case 'vgo': var vp = vocab() && vocab().plan(); closeAll(); return vp && vp.cur && vocab().open(vp.cur.n, 'play');
      case 'theory': return go(n, 'theory');
      case 'start': return go(n, 'start');
      case 'go': var pl = plan(p); return pl.cur && go(pl.cur.n, 'theory');
      case 'weak': var pw = plan(p); return pw.weak[0] && go(pw.weak[0].n, 'start');
      case 'seeall': closeAll(); ui.section = 'missies'; window.scrollTo && window.scrollTo(0, 0); return rerender();
      case 'set-sound': saveSettings({ sound: !settings().sound }); ui.refocus = null; return rerender();
      case 'set-goal': saveSettings({ goal: Number(v) }); return rerender();
      case 'set-theme': saveSettings({ theme: v }); return rerender();
      case 'reset':
        if (window.confirm('Alle voortgang van het Grammatica Lab wissen? Dit kan niet ongedaan worden gemaakt.')) {
          [K_SCORE, K_PROG].forEach(function (k) { try { localStorage.removeItem(k); } catch (_e) {} });
          snap = null; closeAll(); ui.section = 'leer'; ui.needScroll = true;
          ui.msg = { kind: 'ok', text: 'Voortgang gewist.' };
          rerender();
        }
        return;
      case 'export': return doExport();
      case 'import':
        var f = app.querySelector('.lh-file');
        if (f) { f.value = ''; f.click(); }
        return;
    }
  }

  function onKey(e) {
    if (!app || !engine || !engine.isHome()) return;
    if (e.key === 'Escape' && (ui.pop != null || ui.sheet != null || ui.more || ui.tip != null)) {
      var op = ui.pop != null ? 'node-' + ui.pop : ui.sheet != null ? ui.opener : ui.more ? 'nav-more' : 'chip-' + ui.tip;
      closeAll(); ui.refocus = op; e.preventDefault(); return rerender();
    }
    var tab = e.target.closest ? e.target.closest('[role="tab"]') : null;
    if (tab && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End')) {
      e.preventDefault();
      var next = (e.key === 'ArrowRight' || e.key === 'End') ? 'lessons' : 'path';
      closeAll(); saveSettings({ tab: next }); if (next === 'path') ui.needScroll = true;
      ui.refocus = 'tab-' + next; rerender();
    }
  }

  function mount(el, eng) {
    app = el; engine = eng;
    applyTheme();
    if (bound) return;
    bound = true;
    el.addEventListener('click', function (e) { if (engine.isHome()) onClick(e); });
    el.addEventListener('change', function (e) {
      if (e.target && e.target.getAttribute && e.target.getAttribute('data-h-file') && e.target.files && e.target.files[0]) {
        doImport(e.target.files[0]);
      }
    });
    document.addEventListener('keydown', onKey);
  }

  function enter() {
    var p = prog(), cur = { xp: p.xp, streak: streak(p) };
    if (snap) ui.bump = { xp: cur.xp !== snap.xp, streak: cur.streak !== snap.streak, lesson: p.last };
    snap = cur;
    ui.needScroll = true; ui.section = 'leer'; closeAll();
  }

  window.GrammarLabHome = {
    mount: mount, view: view, afterRender: afterRender, enter: enter, record: record, markRead: markRead,
    soundOn: function () { return settings().sound; },
    _internals: { info: info, plan: plan, streak: streak, prog: prog }
  };
})();
