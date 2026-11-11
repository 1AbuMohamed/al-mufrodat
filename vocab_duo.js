/* Woordenschat: Duolingo-stijl leerpad + flashcards (geen fonetische tekst) */
(function () {
  'use strict';

  var TITLES = {
    1: 'Huis & Voorwerpen',
    2: 'Dit & Dat op Afstand',
    3: 'Eigenschappen & Tegenstellingen',
    4: 'Plekken & Kamers',
    5: 'Bezit & Familie',
    6: 'Lichaamsdelen & Vrouwelijk',
    7: 'Dieren & Verwijzingen',
    8: 'Beroepen & Plaatsen',
    9: 'Beschrijvingen & Talen',
    10: 'Relaties & Gezin',
    11: 'In het Huis',
    12: 'Vrouwelijke Personen & Familie',
    13: 'Mensen & Meervouden',
    14: 'Faculteiten & Beroepen',
    15: 'Dames & Tijdstippen',
    16: 'Reizen & Gebouwen',
    17: 'Bedrijf & Handel',
    18: 'Tijd & School',
    19: 'Reizen & Getallen (m)',
    20: 'Kamers & Getallen (v)',
    21: 'Mijn School',
    22: 'Kleuren & Sleutels',
    23: 'Steden & Landen',
    24: 'Reader · Tijd & Handelingen'
  };

  var ui = { pop: null };
  var XP_KEY = 'alm_vocab_xp';
  var STREAK_KEY = 'alm_streak';

  function escLocal(s) {
    if (typeof esc === 'function') return esc(s);
    if (s == null) return '';
    return String(s).replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');
  }

  function picHtml(w) {
    try {
      if (typeof showPics !== 'undefined' && !showPics) return '';
      if (typeof wordPic === 'function') return wordPic(w) || '';
    } catch (e) {}
    return '';
  }

  function lessonKey() {
    try {
      if (typeof state !== 'undefined' && state.lesson != null) return state.lesson;
    } catch (e) {}
    return 'all';
  }

  function readXp() {
    try { return Math.max(0, parseInt(localStorage.getItem(XP_KEY) || '0', 10) || 0); } catch (e) { return 0; }
  }

  function readStreak() {
    try {
      var raw = localStorage.getItem(STREAK_KEY);
      if (!raw) return 0;
      var o = JSON.parse(raw);
      return o.days || o.count || o.streak || (typeof o === 'number' ? o : 0);
    } catch (e) { return 0; }
  }

  function lessonStats(n) {
    var ws = typeof wordsFor === 'function' ? wordsFor(n) : [];
    var total = ws.length;
    var m = typeof mastered === 'function' ? mastered(ws) : 0;
    var seen = 0;
    if (typeof getP === 'function') {
      ws.forEach(function (w) {
        var p = getP(w.id);
        if (p.seen > 0 || p.box > 0) seen++;
      });
    }
    var crowns = total ? Math.min(5, Math.round((m / total) * 5)) : 0;
    var pct = total ? Math.round((100 * m) / total) : 0;
    return { total: total, mastered: m, seen: seen, crowns: crowns, pct: pct };
  }

  function allLessons() {
    if (typeof lessonNums === 'function') return lessonNums().filter(function (n) { return n >= 1; });
    return Object.keys(TITLES).map(Number).sort(function (a, b) { return a - b; });
  }

  function currentLesson() {
    var nums = allLessons();
    for (var i = 0; i < nums.length; i++) {
      if (lessonStats(nums[i]).pct < 100) return nums[i];
    }
    return nums[0] || 1;
  }

  function blocks() {
    var nums = allLessons();
    var out = [], size = 5;
    for (var i = 0; i < nums.length; i += size) out.push(nums.slice(i, i + size));
    return out;
  }

  function crownsHtml(n) {
    var s = '';
    for (var i = 0; i < 5; i++) s += '<span class="vp-crown' + (i < n ? ' on' : '') + '" aria-hidden="true">♛</span>';
    return s;
  }

  function nodeClass(st, isCur) {
    if (st.pct >= 100) return 'done';
    if (st.seen > 0 || st.mastered > 0) return 'busy';
    if (isCur) return 'cur';
    return 'new';
  }

  function pathView() {
    var cur = currentLesson();
    var xp = readXp();
    var streak = readStreak();
    var totalW = typeof ALL !== 'undefined' ? ALL.length : 0;
    var mastW = typeof mastered === 'function' && typeof ALL !== 'undefined' ? mastered(ALL) : 0;
    var bl = blocks();
    var html = '';

    html += '<div class="vp-shell">';
    html += '<div class="vp-topbar">';
    html += '<div class="vp-stat flame" title="Streak"><span aria-hidden="true">🔥</span><strong>' + streak + '</strong></div>';
    html += '<div class="vp-stat xp" title="XP"><span aria-hidden="true">⭐</span><strong>' + xp + ' XP</strong></div>';
    html += '<div class="vp-stat words" title="Beheerst"><span aria-hidden="true">📚</span><strong>' + mastW + '/' + totalW + '</strong></div>';
    html += '</div>';

    html += '<div class="vp-hero">';
    html += '<h1>Woordenschat-leerpad</h1>';
    html += '<p>Leer de Medina-woorden stap voor stap — korte rondes op een pad.</p>';
    html += '<button type="button" class="vp-go" data-act="start-learn" data-l="' + cur + '">GA VERDER · Les ' + cur + '</button>';
    html += '</div>';

    bl.forEach(function (group, gi) {
      html += '<section class="vp-block"><div class="vp-block-label">BLOK ' + (gi + 1) + '</div><div class="vp-path">';
      group.forEach(function (n, ni) {
        var st = lessonStats(n);
        var isCur = n === cur;
        var cls = nodeClass(st, isCur);
        var side = ni % 2 === 0 ? 'left' : 'right';
        var title = TITLES[n] || ('Les ' + n);
        var open = ui.pop === n;

        html += '<div class="vp-row ' + side + '">';
        html += '<button type="button" class="vp-node ' + cls + (isCur ? ' is-cur' : '') + '" data-vp="node" data-l="' + n + '" aria-label="Les ' + n + ': ' + escLocal(title) + '">';
        html += '<span class="vp-node-num">' + n + '</span>';
        html += '<span class="vp-node-meta">' + st.mastered + '/' + st.total + '</span>';
        html += '</button>';

        if (open) {
          html += '<div class="vp-pop" role="dialog" aria-label="Les ' + n + '">';
          html += '<div class="vp-pop-title">Les ' + n + '</div>';
          html += '<div class="vp-pop-sub">' + escLocal(title) + '</div>';
          html += '<div class="vp-pop-crowns">' + crownsHtml(st.crowns) + '</div>';
          html += '<div class="vp-pop-pct">Beheersing ' + st.pct + '% · ' + st.mastered + '/' + st.total + ' woorden</div>';
          html += '<div class="vp-pop-actions">';
          html += '<button type="button" class="vp-btn ghost" data-act="start-flash" data-l="' + n + '">KAARTEN</button>';
          html += '<button type="button" class="vp-btn solid" data-act="start-learn" data-l="' + n + '">OEFENEN</button>';
          html += '</div></div>';
        }
        html += '</div>';
      });
      html += '</div></section>';
    });

    html += '<div class="vp-foot"><button type="button" class="vp-link" data-act="nav" data-v="words">Volledige woordenlijst</button></div>';
    html += '</div>';
    return html;
  }

  window.renderFlash = function renderFlash() {
    if (typeof state === 'undefined') return '<div class="empty">Laden…</div>';
    var pool = state.pool || [];
    if (!pool.length) {
      return '<div class="desktop-narrow"><button class="back" data-act="nav" data-v="vocab"><span>←</span></button><p class="empty">Geen woorden.</p></div>';
    }
    if (state.idx == null || state.idx < 0) state.idx = 0;
    if (state.idx >= pool.length) state.idx = pool.length - 1;
    var w = pool[state.idx];
    var f = !!state.flipped;
    var dir = typeof flashDir !== 'undefined' ? flashDir : 'ar2nl';
    var arFirst = dir !== 'nl2ar';
    var pct = pool.length ? Math.round((100 * (state.idx + 1)) / pool.length) : 0;
    var arHtml = typeof wrapTash === 'function' ? wrapTash(w.ar, 'plain') : escLocal(w.ar);
    var pic = picHtml(w);
    var last = state.idx >= pool.length - 1;
    var les = lessonKey();
    var n = Number(les);
    var listLink = Number.isInteger(n) && n >= 1 && n <= 23 && n !== 11
      ? '<a class="vf-pdf-link" href="pdf/woordenlijst-les-' + String(n).padStart(2, '0') + '.pdf" download="Al-Mufrodat-woordenlijst-les-' + String(n).padStart(2, '0') + '.pdf" aria-label="Woordenlijst van les ' + n + ' als PDF downloaden">↓ Woordenlijst PDF</a>'
      : '';

    var main, sub;
    if (!f) {
      if (arFirst) {
        main = (pic ? '<div class="vf-pic">' + pic + '</div>' : '') + '<div class="vf-ar ar ar-mark" lang="ar">' + arHtml + '</div>';
        sub = '';
      } else {
        main = (pic ? '<div class="vf-pic">' + pic + '</div>' : '') + '<div class="vf-nl">' + escLocal(w.nl) + '</div>';
        sub = '';
      }
    } else {
      if (arFirst) {
        main = '<div class="vf-nl">' + escLocal(w.nl) + '</div>';
        sub = (pic ? '<div class="vf-pic vf-pic-sm">' + pic + '</div>' : '') + '<div class="vf-ar-sm ar" lang="ar">' + arHtml + '</div>';
      } else {
        main = '<div class="vf-ar ar ar-mark" lang="ar">' + arHtml + '</div>';
        sub = (pic ? '<div class="vf-pic vf-pic-sm">' + pic + '</div>' : '') + '<div class="vf-nl-sm">' + escLocal(w.nl) + '</div>';
      }
    }

    var nextBtn = last
      ? '<button type="button" class="btn btn-primary vf-next" data-act="start-learn" data-l="' + escLocal(String(les)) + '">Quiz ›</button>'
      : '<button type="button" class="btn btn-primary vf-next" data-act="flash-next">Volgende ›</button>';

    return '<div class="desktop-narrow vf-wrap">' +
      '<div class="vf-top">' +
      '<button class="back" data-act="nav" data-v="vocab" style="margin:0"><span>←</span></button>' +
      '<div class="vf-prog"><i style="width:' + pct + '%"></i></div>' +
      '<span class="vf-count">' + (state.idx + 1) + '/' + pool.length + '</span></div>' +
      '<div class="vf-tools">' +
      '<button type="button" class="vf-chip' + (arFirst ? ' on' : '') + '" data-act="set-flash-dir" data-d="ar2nl">AR</button>' +
      '<button type="button" class="vf-chip' + (!arFirst ? ' on' : '') + '" data-act="set-flash-dir" data-d="nl2ar">NL</button></div>' +
      listLink +
      '<div class="vf-card' + (f ? ' is-flipped' : '') + (arFirst ? ' vf-ar-side' : '') + '" id="vf-card" data-act="flip" role="button" tabindex="0">' +
      main + sub + (!f ? '<div class="vf-tap">tik voor vertaling</div>' : '') + '</div>' +
      '<div class="vf-nav">' +
      '<button type="button" class="btn btn-secondary" data-act="flash-prev"' + (state.idx === 0 ? ' disabled' : '') + '>‹</button>' +
      nextBtn + '</div></div>';
  };

  function duoVocabHub() { return pathView(); }

  function installHub() {
    if (typeof render !== 'function') return false;
    window.renderVocabHub = duoVocabHub;
    try { renderVocabHub = duoVocabHub; } catch (e) {}
    return true;
  }

  function onPathClick(e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-vp]') : null;
    if (!t) return;
    if (t.getAttribute('data-vp') !== 'node') return;
    var n = parseInt(t.getAttribute('data-l'), 10);
    if (!n) return;
    e.preventDefault();
    e.stopPropagation();
    ui.pop = ui.pop === n ? null : n;
    if (typeof render === 'function') render();
  }

  function wire() {
    if (!installHub()) return false;
    document.addEventListener('click', onPathClick, true);
    if (typeof state !== 'undefined' && state.view === 'vocab' && typeof render === 'function') render();
    return true;
  }

  function boot() {
    if (wire()) return;
    var n = 0;
    var t = setInterval(function () {
      n += 1;
      if (wire() || n > 80) clearInterval(t);
    }, 50);
  }

  var style = document.createElement('style');
  style.textContent =
    '.vp-shell{max-width:560px;margin:0 auto;padding:12px 14px 40px}' +
    '.vp-topbar{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:14px}' +
    '.vp-stat{display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:6px 12px;border-radius:14px;background:var(--surface,#fff);border:2px solid var(--line,#e5e5e5);font-weight:800;font-size:14px;color:var(--ink,#3c3c3c)}' +
    '.vp-stat.flame strong{color:#ff4b4b}.vp-stat.xp strong{color:#ffc800}.vp-stat.words strong{color:var(--forest,#58cc02)}' +
    '.vp-hero{text-align:center;margin:8px 0 22px}' +
    '.vp-hero h1{font-size:clamp(22px,5vw,28px);font-weight:800;margin:0 0 6px;letter-spacing:-.02em}' +
    '.vp-hero p{margin:0 0 14px;color:var(--muted,#777);font-size:15px;line-height:1.4}' +
    '.vp-go{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 28px;border:0;border-radius:16px;background:#1cb0f6;color:#fff;font:800 15px system-ui,sans-serif;letter-spacing:.04em;text-transform:uppercase;box-shadow:0 4px 0 #1899d6;cursor:pointer}' +
    '.vp-go:active{transform:translateY(3px);box-shadow:0 1px 0 #1899d6}' +
    '.vp-block{margin:22px 0 8px}' +
    '.vp-block-label{text-align:center;font:800 12px system-ui,sans-serif;letter-spacing:.12em;color:var(--muted,#888);margin-bottom:14px}' +
    '.vp-path{display:flex;flex-direction:column;gap:18px;position:relative;padding:8px 0}' +
    '.vp-path:before{content:"";position:absolute;left:50%;top:8px;bottom:8px;width:4px;margin-left:-2px;background:var(--line,#e5e5e5);border-radius:4px;z-index:0}' +
    '.vp-row{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;min-height:84px}' +
    '.vp-row.left{padding-right:22%}.vp-row.right{padding-left:22%}' +
    '.vp-node{position:relative;width:72px;height:72px;border-radius:50%;border:3px solid var(--line,#ddd);background:#f0f0f0;color:#777;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 0 #cfcfcf;font:800 16px system-ui,sans-serif;padding:0}' +
    '.vp-node-num{font-size:18px;line-height:1}.vp-node-meta{font-size:10px;opacity:.85;margin-top:2px}' +
    '.vp-node.cur,.vp-node.is-cur{background:#1cb0f6;border-color:#1899d6;color:#fff;box-shadow:0 4px 0 #1899d6}' +
    '.vp-node.busy{background:#ffc800;border-color:#e5a800;color:#3c3c3c;box-shadow:0 4px 0 #e5a800}' +
    '.vp-node.done{background:#58cc02;border-color:#46a302;color:#fff;box-shadow:0 4px 0 #46a302}' +
    '.vp-node:active{transform:translateY(3px);box-shadow:0 1px 0 #cfcfcf}' +
    '.vp-pop{position:absolute;top:50%;left:50%;transform:translate(-50%,-110%);width:min(240px,78vw);background:#dff2ff;border:2px solid #1cb0f6;border-radius:18px;padding:14px 14px 12px;box-shadow:0 8px 24px rgba(0,0,0,.12);text-align:center;z-index:5}' +
    '.vp-pop-title{font:800 18px system-ui,sans-serif}.vp-pop-sub{font-size:13px;color:#555;margin:2px 0 8px}' +
    '.vp-pop-crowns{letter-spacing:2px;margin-bottom:6px}.vp-crown{opacity:.25;font-size:14px}.vp-crown.on{opacity:1;color:#ffc800}' +
    '.vp-pop-pct{font-size:12px;font-weight:700;color:#555;margin-bottom:10px}' +
    '.vp-pop-actions{display:flex;gap:8px}' +
    '.vp-btn{flex:1;min-height:42px;border-radius:12px;border:2px solid transparent;font:800 12px system-ui,sans-serif;letter-spacing:.04em;cursor:pointer}' +
    '.vp-btn.ghost{background:#fff;border-color:#1cb0f6;color:#1cb0f6}.vp-btn.solid{background:#1cb0f6;color:#fff;border-color:#1899d6;box-shadow:0 3px 0 #1899d6}' +
    '.vp-foot{text-align:center;margin-top:28px}' +
    '.vp-link{background:none;border:0;color:#1cb0f6;font:800 13px system-ui,sans-serif;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;min-height:44px}' +
    '.vf-wrap{padding-bottom:24px}' +
    '.vf-top{display:flex;align-items:center;gap:10px;margin-bottom:12px}' +
    '.vf-prog{flex:1;height:12px;border-radius:8px;background:var(--line,#e5e5e5);overflow:hidden}' +
    '.vf-prog i{display:block;height:100%;background:#58cc02;border-radius:8px}' +
    '.vf-count{font:800 13px system-ui,sans-serif;color:var(--muted,#777);min-width:3em;text-align:right}' +
    '.vf-tools{display:flex;gap:8px;margin-bottom:10px}' +
    '.vf-chip{border:2px solid var(--line,#ddd);background:var(--surface,#fff);border-radius:999px;padding:6px 14px;font-weight:800;font-size:13px;cursor:pointer;color:var(--muted,#777)}' +
    '.vf-chip.on{border-color:var(--forest,#58cc02);background:var(--forest,#58cc02);color:#fff}' +
    '.vf-card{background:var(--surface,#fff);border:2px solid var(--line,#e5e5e5);border-radius:22px;min-height:240px;padding:16px 18px 28px;display:flex;flex-direction:column;align-items:center;text-align:center;cursor:pointer;box-shadow:0 3px 0 var(--line,#e5e5e5);user-select:none;touch-action:pan-y;justify-content:flex-start;padding-top:14px}' +
    '.vf-card.is-flipped{border-color:#ffc800;box-shadow:0 3px 0 #ffc800}' +
    '.vf-pic{display:flex;justify-content:center;margin:0 0 2px;order:-1}' +
    '.vf-pic .pic-frame,.vf-pic img{max-height:100px;width:auto;border-radius:12px}' +
    '.vf-pic-sm{margin-top:10px}.vf-pic-sm .pic-frame,.vf-pic-sm img{max-height:64px}' +
    '.vf-ar{font-family:var(--ar,Amiri,serif);font-size:clamp(28px,7.5vw,40px);font-weight:700;line-height:1.5;direction:rtl;margin-top:22px}' +
    '.vf-ar-sm{font-family:var(--ar,Amiri,serif);font-size:clamp(22px,6vw,30px);font-weight:700;direction:rtl;margin-top:12px;color:var(--forest,#58cc02)}' +
    '.vf-nl{font-size:26px;font-weight:800;line-height:1.3;margin-top:12px}' +
    '.vf-nl-sm{font-size:16px;font-weight:600;color:var(--muted,#777);margin-top:10px}' +
    '.vf-tap{margin-top:auto;padding-top:16px;font-size:12px;font-weight:700;color:var(--muted,#777);opacity:.65}' +
    '.vf-pdf-link{display:inline-flex;align-items:center;min-height:40px;padding:7px 12px;margin:-3px 0 12px;border:1px solid var(--line,#ddd);border-radius:10px;background:var(--surface,#fff);color:var(--forest,#58cc02);font-size:13px;font-weight:750;text-decoration:none}' +
    '.vf-nav{display:flex;gap:10px;margin-top:16px}.vf-nav .btn{flex:1}.vf-next{flex:2!important}' +
    '.qcard .qar,.qcard .big-ar,.qcard .flash-mushaf{font-size:clamp(26px,7vw,38px)!important;line-height:1.45!important;margin-top:8px!important}' +
    '.flash-card .hint,.flash-card .tag,.flash-card .translit,.card .translit,.vf-ph,.translit{display:none!important}';
  document.head.appendChild(style);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', function () {
    setTimeout(boot, 100);
    setTimeout(boot, 500);
  });
})();
