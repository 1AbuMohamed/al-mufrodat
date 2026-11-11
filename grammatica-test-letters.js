/* Al-Mufrodat · Grammatica Lab: Arabisch alfabet (28 letters).
 * - Eigen leerpad naast Grammatica en Woordenschat: tegels per letter met voortgang,
 *   een kennismakingsscherm (letter, naam, klank en de vier vormen) en korte oefenrondes.
 * - Voortgang staat in `alm_letters_v1`; XP en streak gaan naar het Grammatica Lab.
 * - Letternamen en klanken zijn vereenvoudigd en komen niet letterlijk uit het Medina-boek.
 */
(function () {
  'use strict';

  var K_PROG = 'alm_letters_v1';
  var MASTERY = 2;       // zelfde drempel als woordenschat: box >= 2 = beheerst
  var MAX_HEARTS = 5;
  var ROUND = 10;
  var TAT = '\u0640';   // schrijfstreep (tatweel): laat de begin-, midden- en eindvorm herkenbaar zien

  // [letter, Arabische naam, Nederlandse naam, klank, verbindt met volgende letter]
  var L = [
    ['ا', 'ألف', 'alif', 'lange aa', 0],
    ['ب', 'باء', 'bā’', 'b', 1],
    ['ت', 'تاء', 'tā’', 't', 1],
    ['ث', 'ثاء', 'thā’', 'th (Engels “think”)', 1],
    ['ج', 'جيم', 'jīm', 'dzj (Engels “jam”)', 1],
    ['ح', 'حاء', 'ḥā’', 'h diep uit de keel', 1],
    ['خ', 'خاء', 'khā’', 'ch (zoals in “toch”)', 1],
    ['د', 'دال', 'dāl', 'd', 0],
    ['ذ', 'ذال', 'dhāl', 'dh (Engels “this”)', 0],
    ['ر', 'راء', 'rā’', 'r (gerold)', 0],
    ['ز', 'زاي', 'zāy', 'z', 0],
    ['س', 'سين', 'sīn', 's', 1],
    ['ش', 'شين', 'shīn', 'sj', 1],
    ['ص', 'صاد', 'ṣād', 'zware s', 1],
    ['ض', 'ضاد', 'ḍād', 'zware d', 1],
    ['ط', 'طاء', 'ṭā’', 'zware t', 1],
    ['ظ', 'ظاء', 'ẓā’', 'zware dh', 1],
    ['ع', 'عين', 'ʿayn', 'keelklank ʿ', 1],
    ['غ', 'غين', 'ghayn', 'gh (keel-r)', 1],
    ['ف', 'فاء', 'fā’', 'f', 1],
    ['ق', 'قاف', 'qāf', 'q (diepe k)', 1],
    ['ك', 'كاف', 'kāf', 'k', 1],
    ['ل', 'لام', 'lām', 'l', 1],
    ['م', 'ميم', 'mīm', 'm', 1],
    ['ن', 'نون', 'nūn', 'n', 1],
    ['ه', 'هاء', 'hā’', 'zachte h', 1],
    ['و', 'واو', 'wāw', 'w (of lange oe)', 0],
    ['ي', 'ياء', 'yā’', 'j (of lange ie)', 1]
  ];
  // Letters met dezelfde basisvorm horen bij elkaar (zo leer je ze samen herkennen).
  var G = [[0], [1, 2, 3], [4, 5, 6], [7, 8], [9, 10], [11, 12], [13, 14], [15, 16], [17, 18], [19, 20], [21, 22], [23, 24], [25, 26, 27]];

  var app = null, S = null, bound = false;

  /* ---------- hulpfuncties ---------- */
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
  function groupOf(i) { for (var g = 0; g < G.length; g++) if (G[g].indexOf(i) >= 0) return g; return 0; }
  function glyph(i) { return L[i][0]; }
  function forms(i) {
    var c = L[i][0], j = L[i][4];
    return { iso: c, ini: j ? c + TAT : c, med: j ? TAT + c + TAT : TAT + c, fin: TAT + c };
  }
  function getP(map, i) { return map[L[i][0]] || { box: 0, seen: 0, correct: 0 }; }
  function icon(name) {
    var paths = {
      heart: '<path d="M20 5a5 5 0 0 0-7 0l-1 1-1-1a5 5 0 0 0-7 7l8 9 8-9a5 5 0 0 0 0-7Z"/>',
      crown: '<path d="m2 7 5 4 5-8 5 8 5-4-2 12H4Z"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>',
      speaker: '<path d="M4 9v6h4l5 4V5L8 9Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/>'
    };
    return '<svg class="gd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || '') + '</svg>';
  }
  function ar(text, cls) {
    return '<span class="' + (cls || '') + '" lang="ar" dir="rtl">' + esc(text) + '</span>';
  }

  /* ---------- geluid ---------- */
  // 1) Eigen opname: audio/letters/01.mp3 t/m 28.mp3 (als die bestaat).
  // 2) Anders de Arabische stem van het toestel: eerst de naam van de letter, dan de klank (letter + fatha, bijv. بَ).
  var FATHA = '\u064E';
  var fileOk = {};
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function note(text) {
    if (!app) return;
    var els = app.querySelectorAll('.ll-note'), k;
    for (k = 0; k < els.length; k++) els[k].textContent = text || '';
  }
  function arVoice() {
    try {
      var v = window.speechSynthesis.getVoices(), k;
      for (k = 0; k < v.length; k++) if (/^ar/i.test(v[k].lang)) return v[k];
    } catch (_e) {}
    return null;
  }
  function say(text, rate) {
    var u = new window.SpeechSynthesisUtterance(text), v = arVoice();
    u.lang = v ? v.lang : 'ar-SA';
    if (v) u.voice = v;
    u.rate = rate || 0.8;
    window.speechSynthesis.speak(u);
  }
  function speakTts(i) {
    var ss = window.speechSynthesis;
    if (!ss || !window.SpeechSynthesisUtterance) {
      note('Dit apparaat kan geen geluid afspelen. Je kunt eigen opnames toevoegen in de map audio/letters.');
      return;
    }
    try {
      ss.cancel();
      var voices = ss.getVoices();
      if (voices.length && !arVoice()) note('Geen Arabische stem op dit apparaat: het geluid kan afwijken.');
      say(L[i][1], 0.75);
      if (i !== 0) say(L[i][0] + FATHA, 0.7);
    } catch (_e) {}
  }
  function speakLetter(i) {
    note('');
    var failed = false;
    function fail() { if (failed) return; failed = true; fileOk[i] = false; speakTts(i); }
    if (fileOk[i] === false) return speakTts(i);
    try {
      var a = new Audio('audio/letters/' + pad(i + 1) + '.mp3');
      a.onerror = fail;
      a.onplaying = function () { fileOk[i] = true; };
      var pr = a.play();
      if (pr && pr.catch) pr.catch(function () { if (fileOk[i] !== true) fail(); });
    } catch (_e) { fail(); }
  }
  function speakBtn(i, label) {
    return '<button type="button" class="ll-speak" data-ll="speak" data-i="' + i + '" aria-label="Luister naar de letter ' + esc(L[i][2]) + '">' +
      icon('speaker') + (label ? '<span>' + label + '</span>' : '') + '</button>';
  }

  /* ---------- voortgang en leerpad ---------- */
  function state(i, map) {
    var p = getP(map, i);
    if (p.box >= MASTERY) return { s: 'mastered', pct: 100 };
    if (p.seen > 0) return { s: 'going', pct: Math.max(12, Math.round(100 * p.box / MASTERY)) };
    return { s: 'new', pct: 0 };
  }
  function totals() {
    var map = jget(K_PROG, {}), m = 0, seen = 0, i;
    for (i = 0; i < L.length; i++) { var p = getP(map, i); if (p.box >= MASTERY) m++; if (p.seen > 0) seen++; }
    return { mastered: m, total: L.length, seen: seen };
  }
  // Een groep met minstens 3 letters: kleine groepen krijgen de volgende groep erbij.
  function focusFromGroup(g) {
    var out = G[g].slice(), k = g + 1;
    while (out.length < 3 && k < G.length) { out = out.concat(G[k]); k++; }
    return out.slice(0, 4);
  }
  function nextFocus() {
    var map = jget(K_PROG, {}), g, i;
    for (g = 0; g < G.length; g++) {
      for (i = 0; i < G[g].length; i++) {
        if (getP(map, G[g][i]).box < MASTERY) return focusFromGroup(g);
      }
    }
    return null;
  }
  function reviewFocus() { return shuffle(L.map(function (_l, i) { return i; })).slice(0, 4); }

  /* ---------- vragen ---------- */
  function distract(i, n) {
    var g = groupOf(i);
    var near = shuffle(G[g].filter(function (x) { return x !== i; }));
    var far = shuffle(L.map(function (_l, k) { return k; }).filter(function (k) { return k !== i && G[g].indexOf(k) < 0; }));
    return near.concat(far).slice(0, n);
  }
  function makeQ(i, type) {
    var q = { type: type, i: i, opts: shuffle([i].concat(distract(i, 3))) };
    if (type === 'f2n') {
      var f = forms(i), pickN = L[i][4] ? ['ini', 'med', 'fin'][Math.floor(Math.random() * 3)] : 'fin';
      q.form = f[pickN];
      q.pos = pickN === 'ini' ? 'begin van een woord' : pickN === 'med' ? 'midden in een woord' : 'eind van een woord';
    }
    return q;
  }
  function build(focus) {
    var types = ['g2n', 'n2g', 'f2n', 's2g'], qs = [], order = shuffle(focus), i;
    for (i = 0; i < ROUND; i++) {
      qs.push(makeQ(order[(i + Math.floor(i / 4)) % order.length], types[i % types.length]));
    }
    return shuffle(qs);
  }

  /* ---------- openen en afsluiten ---------- */
  function open(focus, screen) {
    if (!focus || !focus.length) return;
    app = document.getElementById('gd-app');
    if (!app) return;
    bind();
    S = { focus: focus, screen: screen === 'play' ? 'play' : 'intro', qs: [], i: 0, hearts: MAX_HEARTS, correct: 0, attempts: 0,
      xp: 0, chosen: -1, fb: null, committed: false, perfect: true, retries: 0 };
    if (S.screen === 'play') S.qs = build(focus);
    document.body.classList.remove('lh-on');
    document.body.classList.add('lh-skin');
    render();
  }
  function commitXp() {
    if (!S || S.committed) return;
    S.committed = true;
    var perfect = S.perfect && S.attempts > 0 && S.i >= S.qs.length;
    if (perfect) S.xp += 5;
    if (S.xp > 0 && window.GrammarLabEngine && window.GrammarLabEngine.addXp) window.GrammarLabEngine.addXp(S.xp, perfect);
  }
  function leave() {
    commitXp();
    S = null;
    var home = window.GrammarLabHome;
    if (home && home.enter) { try { home.enter(); } catch (_e) {} }
    if (window.GrammarLabEngine && window.GrammarLabEngine.refresh) window.GrammarLabEngine.refresh();
    if (window.scrollTo) window.scrollTo(0, 0);
  }
  function bump(i, ok) {
    var map = jget(K_PROG, {}), p = getP(map, i);
    p = { box: p.box | 0, seen: (p.seen | 0) + 1, correct: p.correct | 0 };
    if (ok) { p.box = Math.min(MASTERY, p.box + 1); p.correct++; } else p.box = Math.max(0, p.box - 1);
    map[L[i][0]] = p;
    jset(K_PROG, map);
  }
  function current() { return S && S.qs[S.i]; }
  function check() {
    var q = current();
    if (!q || S.fb || S.chosen < 0) return;
    var ok = q.opts[S.chosen] === q.i;
    S.attempts++;
    bump(q.i, ok);
    if (ok) { S.correct++; S.xp += 10; }
    else {
      S.hearts--; S.perfect = false;
      if (S.retries < 3) { S.retries++; S.qs.push(makeQ(q.i, q.type)); }
    }
    S.fb = { ok: ok };
    render();
  }
  function next() {
    if (!S) return;
    if (S.hearts <= 0) { S.screen = 'fail'; S.fb = null; render(); return; }
    S.i++; S.chosen = -1; S.fb = null;
    if (S.i >= S.qs.length) { S.screen = 'done'; commitXp(); }
    render();
  }

  /* ---------- schermen ---------- */
  function formsRow(i) {
    var f = forms(i);
    function cell(label, text) {
      return '<span class="ll-form"><span class="ll-form-ch" lang="ar" dir="rtl">' + esc(text) + '</span><small>' + label + '</small></span>';
    }
    return '<div class="ll-forms">' + cell('los', f.iso) + cell('begin', f.ini) + cell('midden', f.med) + cell('eind', f.fin) + '</div>';
  }
  function bar(label, pct) {
    var hearts = '';
    for (var k = 0; k < MAX_HEARTS; k++) hearts += '<span class="' + (k < S.hearts ? 'alive' : 'lost') + '">' + icon('heart') + '</span>';
    return '<div class="gd-lesson-bar">' +
      '<button type="button" class="vl-exit" data-ll="exit" aria-label="Terug naar het leerpad">' + icon('close') + '</button>' +
      '<div class="gd-progress-wrap"><div class="gd-progress-title"><strong>Arabisch alfabet</strong><span>' + esc(label) + '</span></div>' +
      '<div class="gd-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div></div>' +
      '<div class="gd-bar-hearts" aria-label="' + S.hearts + ' van ' + MAX_HEARTS + ' hartjes">' + hearts + '</div></div>';
  }
  function introScreen() {
    return '<div class="gd-shell gd-play vl ll">' +
      '<div class="gd-lesson-bar"><button type="button" class="vl-exit" data-ll="exit" aria-label="Terug naar het leerpad">' + icon('close') + '</button>' +
      '<div class="gd-progress-wrap"><div class="gd-progress-title"><strong>Arabisch alfabet</strong><span>' + S.focus.length + ' letters</span></div></div></div>' +
      '<div class="gd-card"><div class="gd-stage-tag">Eerst bekijken</div><h1>Maak kennis met deze letters</h1>' +
      '<p class="gd-support">Arabisch lees je van rechts naar links. Veel letters veranderen van vorm, afhankelijk van hun plek in het woord.</p>' +
      '<p class="ll-note" role="status" aria-live="polite"></p><ul class="ll-intro">' + S.focus.map(function (i) {
        return '<li class="ll-intro-item"><div class="ll-intro-head">' + ar(glyph(i), 'll-intro-ch') +
          '<div><strong>' + esc(L[i][2]) + '</strong> ' + ar(L[i][1], 'll-name-ar') + '<small>klinkt als: ' + esc(L[i][3]) + '</small>' +
          (L[i][4] ? '' : '<small>Verbindt niet met de volgende letter.</small>') + '</div>' + speakBtn(i) + '</div>' + formsRow(i) + '</li>';
      }).join('') + '</ul>' +
      '<div class="gd-finish-actions"><button type="button" class="gd-primary gd-full" data-ll="start">Start oefenen</button></div></div></div>';
  }
  function playScreen() {
    var q = current(), total = S.qs.length, pct = Math.round(100 * S.i / Math.max(1, total));
    var asGlyph = q.type === 'n2g' || q.type === 's2g', prompt, title;
    if (q.type === 'g2n') { title = 'Hoe heet deze letter?'; prompt = ar(glyph(q.i), 'll-big'); }
    else if (q.type === 'n2g') { title = 'Welke letter is dit?'; prompt = '<div class="gd-nl-question">' + esc(L[q.i][2]) + '</div>' + speakBtn(q.i); }
    else if (q.type === 'f2n') { title = 'Welke letter zit hierin?'; prompt = ar(q.form, 'll-big') + '<p class="ll-hint">Deze vorm staat aan het ' + q.pos + '.</p>'; }
    else { title = 'Welke letter klinkt zo?'; prompt = '<div class="gd-nl-question">' + esc(L[q.i][3]) + '</div>' + speakBtn(q.i); }
    var fb = '';
    var body = '<h2 class="gd-task-title">' + title + '</h2>' + '<div class="ll-prompt">' + prompt + '</div><p class="ll-note" role="status" aria-live="polite"></p>' +
      '<div class="gd-options ll-options">' + q.opts.map(function (o, k) {
        var picked = S.chosen === k, mark = '';
        if (S.fb) mark = o === q.i ? ' correct' : (picked ? ' wrong' : '');
        return '<button type="button" class="gd-option' + (asGlyph ? ' gd-option-ar ll-opt-glyph' : '') + (picked ? ' selected' : '') + mark +
          '" data-ll="pick" data-i="' + k + '" ' + (S.fb ? 'disabled ' : '') + 'aria-pressed="' + picked + '"' +
          (asGlyph ? ' lang="ar" dir="rtl"' : '') + '>' + esc(asGlyph ? glyph(o) : L[o][2]) + '</button>';
      }).join('') + '</div>' +
      '<div class="gd-task-actions"><button type="button" class="gd-primary gd-full" data-ll="check" ' + (S.chosen >= 0 && !S.fb ? '' : 'disabled') + '>Controleer</button></div>';
    if (S.fb) {
      var good = S.fb.ok, headline = good ? ['Goed!', 'Prima!', 'Uitstekend!'][S.i % 3] : 'Juiste antwoord:';
      fb = '<section class="gd-feedback gd-feedback-sheet ' + (good ? 'good' : 'review') + '" role="status" aria-live="assertive">' +
        '<div class="gd-feedback-inner"><strong>' + headline + '</strong>' +
        '<p class="gd-correct-answer"><span class="ll-fb-ch" lang="ar" dir="rtl">' + esc(glyph(q.i)) + '</span> ' + esc(L[q.i][2]) + '</p>' +
        '<p>klinkt als: ' + esc(L[q.i][3]) + '</p>' + speakBtn(q.i, 'Luister') +
        '<button type="button" class="gd-primary gd-full" data-ll="next">Verder</button></div></section>';
    }
    return '<div class="gd-shell gd-play vl ll">' + bar(Math.min(total, S.i + 1) + ' / ' + total, pct) +
      '<div class="gd-card gd-task">' + body + '</div>' + fb + '</div>';
  }
  function doneScreen() {
    var accuracy = S.attempts ? Math.round(100 * S.correct / S.attempts) : 0, t = totals();
    return '<div class="gd-shell gd-play vl ll">' + bar('Afgerond', 100) +
      '<div class="gd-card gd-finish"><span class="gd-finish-icon">' + icon('crown') + '</span><h1>Goed gedaan!</h1>' +
      '<div class="gd-result-grid"><span><strong>' + S.xp + '</strong><small>XP</small></span>' +
      '<span><strong>' + accuracy + '%</strong><small>Nauwkeurigheid</small></span>' +
      '<span><strong>' + t.mastered + '/' + t.total + '</strong><small>Letters beheerst</small></span></div>' +
      '<p>' + S.correct + ' van de ' + S.attempts + ' antwoorden juist.</p>' +
      '<div class="gd-finish-actions"><button type="button" class="gd-primary gd-full" data-ll="continue">Doorgaan</button>' +
      '<button type="button" class="gd-soft gd-full" data-ll="again">Nog een ronde</button>' +
      '<button type="button" class="gd-soft gd-full" data-ll="exit">Terug naar het leerpad</button></div></div></div>';
  }
  function failScreen() {
    commitXp();
    return '<div class="gd-shell gd-play vl ll">' + bar('Afgebroken', Math.round(100 * S.i / Math.max(1, S.qs.length))) +
      '<div class="gd-card gd-finish"><span class="gd-finish-icon">' + icon('heart') + '</span>' +
      '<h1>Geen hartjes meer</h1><p>Je voortgang van deze ronde is bewaard. Probeer het zo nog een keer.</p>' +
      '<div class="gd-finish-actions"><button type="button" class="gd-primary gd-full" data-ll="again">Opnieuw proberen</button>' +
      '<button type="button" class="gd-soft gd-full" data-ll="exit">Terug naar het leerpad</button></div></div></div>';
  }
  function render() {
    if (!app || !S) return;
    app.innerHTML = S.screen === 'intro' ? introScreen() : S.screen === 'done' ? doneScreen() : S.screen === 'fail' ? failScreen() : playScreen();
    if (window.scrollTo) window.scrollTo(0, 0);
  }

  /* ---------- paneel op de startpagina ---------- */
  function panel() {
    app = document.getElementById('gd-app') || app;
    bind();
    var map = jget(K_PROG, {}), t = totals();
    var tiles = L.map(function (l, i) {
      var st = state(i, map);
      var label = 'Letter ' + l[2] + ', ' + (st.s === 'mastered' ? 'beheerst' : st.s === 'going' ? 'bezig' : 'nog niet gestart');
      return '<button type="button" class="ll-tile ' + st.s + '" data-ll="tile" data-i="' + i + '" aria-label="' + esc(label) + '">' +
        '<span class="ll-ch" lang="ar" dir="rtl">' + esc(l[0]) + '</span><span class="ll-nm">' + esc(l[2]) + '</span>' +
        '<span class="ll-pill"><i style="width:' + st.pct + '%"></i></span></button>';
    }).join('');
    var nf = nextFocus();
    var banner = '<div class="lh-banner"><div><small>ALFABET</small><strong>' + (nf ? 'Volgende letters: ' + nf.map(function (i) { return L[i][2]; }).join(', ') : 'Alle letters beheerst') +
      '</strong></div><button type="button" class="btn btn-white" data-ll="go">START</button></div>';
    return banner + '<div class="lh-hero ll-hero"><h1>Laten we het Arabisch alfabet leren!</h1>' +
      '<p class="lh-sub">' + (t.mastered >= t.total ? 'Alle letters beheerst' : t.mastered + ' van ' + t.total + ' letters beheerst') + '</p>' +
      '<button type="button" class="btn btn-blue lh-go" data-ll="go">LEER DE LETTERS</button></div>' +
      '<div class="ll-grid" role="list">' + tiles + '</div>';
  }

  /* ---------- events ---------- */
  function onClick(e) {
    var t = e.target.closest ? e.target.closest('[data-ll]') : null;
    if (!t) return;
    var a = t.getAttribute('data-ll');
    if (!S) {
      if (a === 'go') { e.stopPropagation(); return open(nextFocus() || reviewFocus(), 'intro'); }
      if (a === 'tile') { e.stopPropagation(); return open(focusFromGroup(groupOf(Number(t.getAttribute('data-i')))), 'intro'); }
      return;
    }
    e.stopPropagation();
    if (a === 'speak') return speakLetter(Number(t.getAttribute('data-i')));
    if (a === 'exit') return leave();
    if (a === 'start') { S.screen = 'play'; S.qs = build(S.focus); S.i = 0; render(); return; }
    if (a === 'continue') {
      var nf = nextFocus();
      commitXp(); S = null;
      return nf ? open(nf, 'intro') : leave();
    }
    if (a === 'again') { var f = S.focus; commitXp(); S = null; return open(f, 'play'); }
    if (a === 'pick') { if (!S.fb) { S.chosen = Number(t.getAttribute('data-i')); render(); } return; }
    if (a === 'check') return check();
    if (a === 'next') return next();
  }
  function onKey(e) {
    if (!S || S.screen !== 'play' || e.ctrlKey || e.altKey || e.metaKey) return;
    var q = current();
    if (!q) return;
    if (S.fb && e.key === 'Enter') { e.preventDefault(); return next(); }
    if (/^[1-4]$/.test(e.key) && !S.fb && Number(e.key) <= q.opts.length) { S.chosen = Number(e.key) - 1; render(); }
    else if (e.key === 'Enter' && !S.fb && S.chosen >= 0) { e.preventDefault(); check(); }
  }
  function bind() {
    if (bound || !app) return;
    bound = true;
    app.addEventListener('click', onClick, true);   // vóór de handlers van de startpagina
    document.addEventListener('keydown', onKey);
  }

  window.GrammarLabLetters = { panel: panel, totals: totals, open: open, active: function () { return !!S; }, letters: L };
})();
