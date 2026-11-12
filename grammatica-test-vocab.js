/* Al-Mufrodat · Grammatica Lab: woordenschat-leerpad en oefenrondes.
 * - Woorden komen uit vocab_words.js (afgeleid van BASE_WORDS in app_core.js).
 * - Voortgang staat in dezelfde sleutel als de gewone woordenschat (alm_progress),
 *   zodat beide kanten van de site dezelfde beheersing tonen.
 * - XP en streak gaan naar de XP van het Grammatica Lab.
 * Er worden geen woorden of vertalingen verzonnen.
 */
(function () {
  'use strict';

  var K_PROG = 'alm_progress';
  var K_XP = 'alm_vocab_xp';
  var K_SET = 'alm_grammar_test_settings_v1';
  var MASTERY = 2;      // zelfde drempel als de gewone woordenschat (box >= 2)
  var MAX_HEARTS = 5;
  var TITLES = {
    1: 'Huis & Voorwerpen', 2: 'Dit & Dat op Afstand', 3: 'Eigenschappen & Tegenstellingen', 4: 'Plekken & Kamers',
    5: 'Bezit & Familie', 6: 'Lichaamsdelen & Vrouwelijk', 7: 'Dieren & Verwijzingen', 8: 'Beroepen & Plaatsen',
    9: 'Beschrijvingen & Talen', 10: 'Relaties & Gezin', 11: 'In het Huis', 12: 'Vrouwelijke Personen & Familie',
    13: 'Mensen & Meervouden', 14: 'Faculteiten & Beroepen', 15: 'Dames & Tijdstippen', 16: 'Reizen & Gebouwen',
    17: 'Bedrijf & Handel', 18: 'Tijd & School', 19: 'Reizen & Getallen (m)', 20: 'Kamers & Getallen (v)',
    21: 'Mijn School', 22: 'Kleuren & Sleutels', 23: 'Steden & Landen', 24: 'Reader · Tijd & Handelingen'
  };

  var app = null, S = null, bound = false, fastTimer = 0;

  /* ---------- hulpfuncties ---------- */
  function fastOn() {
    if (window.GrammarLabParse && window.GrammarLabParse.fastOn) return window.GrammarLabParse.fastOn();
    return jget(K_SET, {}).fast === true;
  }
  function setFast(on) {
    if (window.GrammarLabParse && window.GrammarLabParse.setFast) { window.GrammarLabParse.setFast(on); return; }
    var s = jget(K_SET, {}); s.fast = !!on; jset(K_SET, s);
  }
  function scheduleFastNext(ok) {
    clearTimeout(fastTimer);
    if (!fastOn()) return;
    fastTimer = setTimeout(function () { if (S && S.fb && S.screen === 'play') next(); }, ok ? 500 : 1000);
  }
  function esc(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function jget(key, def) {
    try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : def; } catch (_e) { return def; }
  }
  function jset(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_e) {} }
  function shuffle(list) {
    var a = list.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function words() { return Array.isArray(window.AL_VOCAB) ? window.AL_VOCAB : []; }
  function wordsFor(n) { return words().filter(function (w) { return w.lesson === n; }); }
  function lessonNums() {
    var seen = {};
    words().forEach(function (w) { seen[w.lesson] = true; });
    return Object.keys(seen).map(Number).filter(function (n) { return n >= 1; }).sort(function (a, b) { return a - b; });
  }
  function getP(map, id) { return map[id] || { box: 0, seen: 0, correct: 0 }; }
  function icon(name) {
    var paths = {
      heart: '<path fill="currentColor" stroke="currentColor" d="M20 5a5 5 0 0 0-7 0l-1 1-1-1a5 5 0 0 0-7 7l8 9 8-9a5 5 0 0 0 0-7Z"/>',
      heartHalf: '<path fill="currentColor" stroke="none" d="M11.3 6.2 11 5a5 5 0 0 0-7 7l7.4 8.5.8-5.3-2.4-3 1.9-3.2Z"/><path fill="currentColor" stroke="none" opacity=".16" transform="translate(1.2 .6)" d="M13 5a5 5 0 0 1 7 7l-7.4 8.4 1-5.4-2.4-3 1.9-3.2Z"/>',
      heartBroken: '<path fill="currentColor" stroke="none" d="M11.3 6.2 11 5a5 5 0 0 0-7 7l7.4 8.5.8-5.3-2.4-3 1.9-3.2Z"/><path fill="currentColor" stroke="none" opacity=".65" transform="translate(1.2 .6)" d="M13 5a5 5 0 0 1 7 7l-7.4 8.4 1-5.4-2.4-3 1.9-3.2Z"/>',
      crown: '<path d="m2 7 5 4 5-8 5 8 5-4-2 12H4Z"/>',
      home: '<path d="m3 10 9-7 9 7v11H3Z"/><path d="M9 21v-8h6v8"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>'
    };
    return '<svg class="gd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[name] + '</svg>';
  }

  /* ---------- leerpad (zelfde vorm als het grammatica-plan) ---------- */
  function stats(n, map) {
    var ws = wordsFor(n), total = ws.length, mastered = 0, seen = 0;
    ws.forEach(function (w) {
      var p = getP(map, w.id);
      if (p.box >= MASTERY) mastered++;
      if (p.seen > 0 || p.box > 0) seen++;
    });
    return { total: total, mastered: mastered, seen: seen };
  }
  function plan() {
    var map = jget(K_PROG, {});
    var list = lessonNums().map(function (n) {
      var st = stats(n, map);
      var done = st.total > 0 && st.mastered >= st.total;
      var crowns = done ? 5 : Math.min(4, Math.round(5 * st.mastered / Math.max(1, st.total)));
      var state = done ? 'mastered' : (st.seen > 0 || st.mastered > 0 ? 'going' : 'none');
      return {
        n: n, kind: 'vocab', has: true, read: false, weak: false, sub: TITLES[n] || '', page: st.total + ' woorden',
        total: st.total, mastered: st.mastered, m: crowns, state: state,
        pct: done ? 100 : (state === 'none' ? 0 : Math.max(10, Math.round(100 * st.mastered / Math.max(1, st.total))))
      };
    });
    var cur = list.filter(function (o) { return o.state !== 'mastered'; })[0] || list[0];
    return { kind: 'vocab', list: list, weak: [], cur: cur };
  }
  function totals() {
    var map = jget(K_PROG, {}), all = words(), m = 0;
    all.forEach(function (w) { if (getP(map, w.id).box >= MASTERY) m++; });
    return { total: all.length, mastered: m };
  }

  /* ---------- vragen ---------- */
  function distractors(word, n, field, count) {
    var pool = wordsFor(n).filter(function (w) { return w.id !== word.id; });
    var extra = words().filter(function (w) { return w.lesson !== n && Math.abs(w.lesson - n) <= 3; });
    var out = [], used = {};
    used[word[field]] = true;
    shuffle(pool).concat(shuffle(extra)).concat(shuffle(words())).forEach(function (w) {
      if (out.length >= count || used[w[field]]) return;
      used[w[field]] = true; out.push(w[field]);
    });
    return out;
  }
  function choice(word, n, type) {
    var field = type === 'ar2nl' ? 'nl' : 'ar';
    var options = shuffle([word[field]].concat(distractors(word, n, field, 3)));
    return { type: type, word: word, answer: word[field], options: options };
  }
  function build(n) {
    var map = jget(K_PROG, {});
    var ws = wordsFor(n).sort(function (a, b) {
      return getP(map, a.id).box - getP(map, b.id).box || Math.random() - 0.5;
    });
    var targets = shuffle(ws.slice(0, 8));
    var qs = targets.map(function (w, i) { return choice(w, n, i % 2 ? 'nl2ar' : 'ar2nl'); });
    if (targets.length < 5) {
      targets.forEach(function (w, i) { if (qs.length < 6) qs.push(choice(w, n, i % 2 ? 'ar2nl' : 'nl2ar')); });
    }
    if (ws.length >= 3) {
      var pairs = shuffle(ws.slice(0, Math.min(ws.length, 8))).slice(0, Math.min(4, ws.length));
      var match = {
        type: 'match', words: pairs,
        left: shuffle(pairs.map(function (w) { return w.id; })),
        right: shuffle(pairs.map(function (w) { return w.id; })),
        done: {}, sel: null, wrong: null, slipped: {}
      };
      qs.splice(Math.min(3, qs.length), 0, match);
    }
    return qs.slice(0, 10);
  }

  /* ---------- sessie ---------- */
  function open(n, mode) {
    clearTimeout(fastTimer);
    n = Number(n);
    if (!wordsFor(n).length) return;
    app = document.getElementById('gd-app');
    if (!app) return;
    bind();
    S = { n: n, screen: mode === 'words' ? 'words' : 'play', qs: [], i: 0, hearts: MAX_HEARTS, correct: 0, attempts: 0,
      xp: 0, chosen: -1, fb: null, committed: false, wrongIds: {}, perfect: true };
    if (S.screen === 'play') S.qs = build(n);
    document.body.classList.remove('lh-on');
    document.body.classList.add('lh-skin');
    render();
  }
  function wordById(id) { return words().filter(function (w) { return w.id === id; })[0]; }

  function bump(id, ok) {
    var map = jget(K_PROG, {}), p = getP(map, id);
    p = { box: p.box | 0, seen: (p.seen | 0) + 1, correct: p.correct | 0 };
    if (ok) { p.box = Math.min(MASTERY, p.box + 1); p.correct++; }
    else p.box = Math.max(0, p.box - 1);
    map[id] = p;
    jset(K_PROG, map);
  }
  function score(ok, id, xp) {
    S.attempts++;
    if (ok) { S.correct++; S.xp += xp == null ? 10 : xp; }
    else { S.hearts = Math.max(0, S.hearts - 0.5); S.perfect = false; }
    if (id) bump(id, ok);
  }
  function commitXp() {
    if (!S || S.committed) return;
    S.committed = true;
    var bonus = S.perfect && S.attempts > 0 && S.i >= S.qs.length ? 5 : 0;
    S.xp += bonus;
    if (S.xp <= 0) return;
    try { jset(K_XP, Math.max(0, parseInt(localStorage.getItem(K_XP) || '0', 10) || 0) + S.xp); } catch (_e) {}
    if (window.GrammarLabEngine && window.GrammarLabEngine.addXp) {
      window.GrammarLabEngine.addXp(S.xp, S.perfect && S.attempts > 0 && S.i >= S.qs.length);
    }
  }
  function leave() {
    clearTimeout(fastTimer);
    commitXp();
    S = null;
    var home = window.GrammarLabHome;
    if (home && home.enter) { try { home.enter(); } catch (_e) {} }
    if (window.GrammarLabEngine && window.GrammarLabEngine.refresh) window.GrammarLabEngine.refresh();
    if (window.scrollTo) window.scrollTo(0, 0);
  }

  function current() { return S && S.qs[S.i]; }
  function answered() {
    var q = current();
    if (!q) return false;
    return q.type === 'match' ? false : S.chosen >= 0;
  }
  function check() {
    var q = current();
    if (!q || S.fb || q.type === 'match' || S.chosen < 0) return;
    var ok = q.options[S.chosen] === q.answer;
    score(ok, q.word.id);
    if (!ok) S.wrongIds[q.word.id] = true;
    S.fb = { ok: ok };
    render();
    scheduleFastNext(ok);
  }
  function next() {
    clearTimeout(fastTimer);
    if (!S) return;
    if (S.hearts <= 0) { S.screen = 'fail'; S.fb = null; render(); return; }
    S.i++; S.chosen = -1; S.fb = null;
    if (S.i >= S.qs.length) { S.screen = 'done'; commitXp(); }
    render();
  }
  function matchTap(side, id) {
    var q = current();
    if (!q || q.type !== 'match' || S.fb || q.done[id] || q.wrong) return;
    if (!q.sel || q.sel.side === side) { q.sel = { side: side, id: id }; render(); return; }
    var okPair = q.sel.id === id;
    if (okPair) {
      q.done[id] = true; q.sel = null;
      if (!q.slipped[id]) score(true, id, 5);
      if (Object.keys(q.done).length >= q.words.length) {
        S.fb = { ok: true, match: true };
        render();
        scheduleFastNext(true);
        return;
      }
      render();
      return;
    }
    // fout paar: kost een half hartje; de twee woorden worden als fout geteld
    var a = q.sel.id, b = id;
    q.wrong = { a: a, b: b, side: side };
    S.hearts = Math.max(0, S.hearts - 0.5); S.perfect = false;
    [a, b].forEach(function (x) { if (!q.slipped[x]) { q.slipped[x] = true; S.attempts++; bump(x, false); } });
    render();
    setTimeout(function () {
      if (!S || current() !== q) return;
      q.wrong = null; q.sel = null;
      if (S.hearts <= 0) { S.screen = 'fail'; }
      render();
    }, 650);
  }

  /* ---------- weergave ---------- */
  function bar(label, pct) {
    var hearts = '';
    for (var i = 0; i < MAX_HEARTS; i++) {
      var rem = S.hearts - i;
      var cls = rem >= 1 ? 'alive' : rem >= 0.5 ? 'half' : 'lost';
      var ic = rem >= 1 ? 'heart' : rem >= 0.5 ? 'heartHalf' : 'heartBroken';
      hearts += '<span class="' + cls + '">' + icon(ic) + '</span>';
    }
    return '<div class="gd-lesson-bar">' +
      '<button type="button" class="vl-exit" data-vl="exit" aria-label="Terug naar het leerpad">' + icon('close') + '</button>' +
      '<div class="gd-progress-wrap"><div class="gd-progress-title"><strong>Woordenschat · Les ' + S.n + '</strong><span>' + esc(label) + '</span></div>' +
      '<div class="gd-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div></div>' +
      '<div class="gd-bar-hearts" aria-label="' + String(S.hearts).replace('.', ',') + ' van ' + MAX_HEARTS + ' hartjes">' + hearts + '</div>' +
      '<button type="button" class="gd-fast' + (fastOn() ? ' on' : '') + '" data-vl="fast" aria-pressed="' + fastOn() + '" title="Snelle modus: direct nakijken en automatisch door">⚡ Snel</button></div>';
  }

  function wordsScreen() {
    var ws = wordsFor(S.n), map = jget(K_PROG, {});
    return '<div class="gd-shell gd-play vl">' +
      '<div class="gd-lesson-bar"><button type="button" class="vl-exit" data-vl="exit" aria-label="Terug naar het leerpad">' + icon('close') + '</button>' +
      '<div class="gd-progress-wrap"><div class="gd-progress-title"><strong>Woordenschat · Les ' + S.n + '</strong><span>' + ws.length + ' woorden</span></div></div></div>' +
      '<div class="gd-card"><div class="gd-stage-tag">Eerst bekijken</div><h1>' + esc(TITLES[S.n] || 'Les ' + S.n) + '</h1>' +
      '<p class="gd-support">Bekijk de woorden en ga daarna oefenen.</p>' +
      '<ul class="vl-words">' + ws.map(function (w) {
        var m = getP(map, w.id).box >= MASTERY;
        return '<li class="vl-word' + (m ? ' known' : '') + '"><span class="vl-word-ar" lang="ar" dir="rtl">' + esc(w.ar) + '</span>' +
          '<span class="vl-word-nl">' + esc(w.nl) + '</span></li>';
      }).join('') + '</ul>' +
      '<div class="gd-finish-actions"><button type="button" class="gd-primary gd-full" data-vl="start">Start oefenen</button></div></div></div>';
  }

  function matchBody(q) {
    function tile(side, id) {
      var w = wordById(id), done = q.done[id];
      var sel = q.sel && q.sel.side === side && q.sel.id === id;
      var bad = q.wrong && ((q.wrong.a === id && q.wrong.side !== side) || (q.wrong.b === id && q.wrong.side === side) ||
        (q.wrong.a === id && q.wrong.side === side) || (q.wrong.b === id && q.wrong.side !== side)) && !done;
      var cls = 'vl-tile' + (side === 'l' ? ' ar' : '') + (done ? ' done' : '') + (sel ? ' selected' : '') + (bad ? ' bad' : '');
      return '<button type="button" class="' + cls + '" data-vl="tile" data-side="' + side + '" data-id="' + esc(id) + '" ' +
        (done || S.fb ? 'disabled ' : '') + 'aria-pressed="' + !!sel + '"' + (side === 'l' ? ' lang="ar" dir="rtl"' : '') + '>' +
        esc(side === 'l' ? w.ar : w.nl) + '</button>';
    }
    return '<h2 class="gd-task-title">Maak de juiste paren</h2><p class="gd-subinstruction">Tik een Arabisch woord en daarna de vertaling.</p>' +
      '<div class="vl-match"><div class="vl-col">' + q.left.map(function (id) { return tile('l', id); }).join('') + '</div>' +
      '<div class="vl-col">' + q.right.map(function (id) { return tile('r', id); }).join('') + '</div></div>';
  }

  function playScreen() {
    var q = current(), total = S.qs.length, pct = Math.round(100 * S.i / Math.max(1, total));
    var body;
    if (q.type === 'match') body = matchBody(q);
    else {
      var ar = q.type === 'nl2ar';
      body = '<h2 class="gd-task-title">' + (ar ? 'Kies het juiste Arabische woord' : 'Wat betekent dit woord?') + '</h2>' +
        (ar ? '<div class="gd-nl-question">' + esc(q.word.nl) + '</div>'
            : '<div class="gd-ar-question gd-arabic" lang="ar" dir="rtl">' + esc(q.word.ar) + '</div>') +
        '<div class="gd-options">' + q.options.map(function (o, i) {
          var picked = S.chosen === i;
          var mark = '';
          if (S.fb) mark = o === q.answer ? ' correct' : (picked ? ' wrong' : '');
          return '<button type="button" class="gd-option' + (ar ? ' gd-option-ar gd-option-wide' : '') + (picked ? ' selected' : '') + mark +
            '" data-vl="pick" data-i="' + i + '" ' + (S.fb ? 'disabled ' : '') + 'aria-pressed="' + picked + '"' +
            (ar ? ' lang="ar" dir="rtl"' : '') + '>' + esc(o) + '</button>';
        }).join('') + '</div>' +
        '<div class="gd-task-actions"><button type="button" class="gd-primary gd-full" data-vl="check" ' + (answered() && !S.fb ? '' : 'disabled') + '>Controleer</button></div>';
    }
    var fb = '';
    if (S.fb) {
      var good = S.fb.ok, w = q.word;
      var headline = good ? ['Goed!', 'Prima!', 'Uitstekend!'][S.i % 3] : 'Juiste antwoord:';
      var detail = S.fb.match ? '<p class="gd-correct-answer">Alle paren gevonden</p>'
        : '<p class="gd-correct-answer"' + (q.type === 'nl2ar' ? ' lang="ar" dir="rtl"' : '') + '>' + esc(q.answer) + '</p>' +
          (q.type === 'nl2ar' ? '<p>' + esc(w.nl) + '</p>' : '<p class="gd-arabic" lang="ar" dir="rtl">' + esc(w.ar) + '</p>');
      fb = '<section class="gd-feedback gd-feedback-sheet ' + (good ? 'good' : 'review') + '" role="status" aria-live="assertive">' +
        '<div class="gd-feedback-inner"><strong>' + headline + '</strong>' + detail +
        (fastOn() ? '<div class="gd-autonext" aria-hidden="true"><i></i></div>' : '') +
        '<button type="button" class="gd-primary gd-full" data-vl="next">Verder</button></div></section>';
    }
    return '<div class="gd-shell gd-play vl">' + bar(Math.min(total, S.i + 1) + ' / ' + total, pct) +
      '<div class="gd-card gd-task">' + body + '</div>' + fb + '</div>';
  }

  function doneScreen() {
    var accuracy = S.attempts ? Math.round(100 * S.correct / S.attempts) : 0;
    var st = stats(S.n, jget(K_PROG, {}));
    return '<div class="gd-shell gd-play vl">' + bar('Afgerond', 100) +
      '<div class="gd-card gd-finish"><span class="gd-finish-icon">' + icon('crown') + '</span>' +
      '<h1>Les ' + S.n + ' · ' + esc(TITLES[S.n] || 'Woordenschat') + '</h1>' +
      '<div class="gd-result-grid"><span><strong>' + S.xp + '</strong><small>XP</small></span>' +
      '<span><strong>' + accuracy + '%</strong><small>Nauwkeurigheid</small></span>' +
      '<span><strong>' + st.mastered + '/' + st.total + '</strong><small>Beheerst</small></span></div>' +
      '<p>' + S.correct + ' van de ' + S.attempts + ' antwoorden juist.</p>' +
      '<div class="gd-finish-actions"><button type="button" class="gd-primary gd-full" data-vl="continue">Doorgaan</button>' +
      '<button type="button" class="gd-soft gd-full" data-vl="again">Nog een ronde</button>' +
      '<button type="button" class="gd-soft gd-full" data-vl="exit">Terug naar het leerpad</button></div></div></div>';
  }
  function failScreen() {
    commitXp();
    return '<div class="gd-shell gd-play vl">' + bar('Afgebroken', Math.round(100 * S.i / Math.max(1, S.qs.length))) +
      '<div class="gd-card gd-finish"><span class="gd-finish-icon">' + icon('heart') + '</span>' +
      '<h1>Geen hartjes meer</h1><p>Je voortgang van deze ronde is bewaard. Probeer het zo nog een keer.</p>' +
      '<div class="gd-finish-actions"><button type="button" class="gd-primary gd-full" data-vl="again">Opnieuw proberen</button>' +
      '<button type="button" class="gd-soft gd-full" data-vl="exit">Terug naar het leerpad</button></div></div></div>';
  }

  function render() {
    if (!app || !S) return;
    app.innerHTML = S.screen === 'words' ? wordsScreen() : S.screen === 'done' ? doneScreen() :
      S.screen === 'fail' ? failScreen() : playScreen();
    if (window.scrollTo) window.scrollTo(0, 0);
  }

  /* ---------- events ---------- */
  function onClick(e) {
    if (!S) return;
    var t = e.target.closest ? e.target.closest('[data-vl]') : null;
    if (!t) return;
    e.stopPropagation();
    var a = t.getAttribute('data-vl');
    if (a === 'exit') return leave();
    if (a === 'fast') { setFast(!fastOn()); if (!fastOn()) clearTimeout(fastTimer); render(); return; }
    if (a === 'start') { clearTimeout(fastTimer); S.screen = 'play'; S.qs = build(S.n); S.i = 0; render(); return; }
    if (a === 'continue') {
      clearTimeout(fastTimer);
      var nums = lessonNums(), cur = S.n, follow = nums.filter(function (x) { return x > cur; })[0];
      if (follow === undefined) return leave();
      var started = stats(follow, jget(K_PROG, {})).seen > 0;
      commitXp(); S = null;
      return open(follow, started ? 'play' : 'words');
    }
    if (a === 'again') { clearTimeout(fastTimer); var n = S.n; commitXp(); S = null; return open(n, 'play'); }
    if (a === 'pick') {
      if (!S.fb) {
        S.chosen = Number(t.getAttribute('data-i'));
        if (fastOn()) check(); else render();
      }
      return;
    }
    if (a === 'check') return check();
    if (a === 'next') return next();
    if (a === 'tile') return matchTap(t.getAttribute('data-side'), t.getAttribute('data-id'));
  }
  function onKey(e) {
    if (!S || S.screen !== 'play' || e.ctrlKey || e.altKey || e.metaKey) return;
    var q = current();
    if (!q) return;
    if (S.fb && e.key === 'Enter') { e.preventDefault(); return next(); }
    if (q.type === 'match') return;
    if (/^[1-4]$/.test(e.key) && !S.fb && q.options && Number(e.key) <= q.options.length) {
      S.chosen = Number(e.key) - 1;
      if (fastOn()) check(); else render();
    }
    else if (e.key === 'Enter' && !S.fb && answered()) { e.preventDefault(); check(); }
  }
  function bind() {
    if (bound || !app) return;
    bound = true;
    app.addEventListener('click', onClick, true);   // vóór de handlers van de startpagina
    document.addEventListener('keydown', onKey);
  }

  window.GrammarLabVocab = {
    plan: plan, totals: totals, open: open, active: function () { return !!S; },
    titles: TITLES
  };
})();
