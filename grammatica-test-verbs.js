/* Werkwoorden-pad: verleden → heden → contrast, met correcte zinnen */
(function () {
  'use strict';
  var K_PROG = 'alm_verbs_v1';
  var K_SET = 'alm_grammar_test_settings_v1';
  var K_XP = 'alm_vocab_xp';
  var MASTERY = 2;
  var MAX_HEARTS = 5;
  var ROUND = 10;
  var app = null, S = null, bound = false, fastTimer = 0;

  function data() { return (window.AL_VERBS && AL_VERBS.lessons) || []; }
  function lesson(n) { return data().filter(function (l) { return l.n === n; })[0] || null; }
  function esc(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function jget(k, d) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : d; } catch (_e) { return d; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_e) {} }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function getP(map, id) { return map[id] || { box: 0, seen: 0, correct: 0 }; }
  function speedMode() {
    var s = jget(K_SET, {});
    if (s.speed === 'super' || s.speed === 'fast' || s.speed === 'off') return s.speed;
    return s.fast === true ? 'fast' : 'off';
  }
  function fastOn() { return speedMode() !== 'off'; }
  function superOn() { return speedMode() === 'super'; }
  function cycleSpeed() {
    var cur = speedMode(), nxt = cur === 'off' ? 'fast' : (cur === 'fast' ? 'super' : 'off');
    var s = jget(K_SET, {}); s.speed = nxt; s.fast = nxt !== 'off'; jset(K_SET, s);
  }
  function scheduleAutoNext(ok) {
    clearTimeout(fastTimer);
    if (!fastOn()) return;
    fastTimer = setTimeout(function () {
      if (S && S.fb && S.screen === 'play') next();
    }, superOn() ? 250 : (ok ? 500 : 1000));
  }
  function icon(name) {
    var p = {
      heart: '<path fill="currentColor" d="M20 5a5 5 0 0 0-7 0l-1 1-1-1a5 5 0 0 0-7 7l8 9 8-9a5 5 0 0 0 0-7Z"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>',
      crown: '<path d="m2 7 5 4 5-8 5 8 5-4-2 12H4Z"/>'
    };
    return '<svg class="gd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" aria-hidden="true">' + (p[name] || '') + '</svg>';
  }

  function stats(n, map) {
    map = map || jget(K_PROG, {});
    var L = lesson(n);
    if (!L) return { total: 0, mastered: 0, seen: 0 };
    var items = (L.verbs || []).concat(L.sentences || []);
    var mastered = 0, seen = 0;
    items.forEach(function (it) {
      var p = getP(map, it.id);
      if (p.seen) seen++;
      if (p.box >= MASTERY) mastered++;
    });
    return { total: items.length, mastered: mastered, seen: seen };
  }

  function plan() {
    var map = jget(K_PROG, {});
    var list = data().map(function (L) {
      var st = stats(L.n, map);
      var done = st.total > 0 && st.mastered >= st.total;
      var crowns = done ? 5 : Math.min(4, Math.round(5 * st.mastered / Math.max(1, st.total)));
      var state = done ? 'mastered' : (st.seen > 0 || st.mastered > 0 ? 'going' : 'none');
      return {
        n: L.n, kind: 'verbs', sub: L.title, focus: L.focus,
        total: st.total, mastered: st.mastered, m: crowns, state: state,
        pct: done ? 100 : (state === 'none' ? 0 : Math.max(10, Math.round(100 * st.mastered / Math.max(1, st.total))))
      };
    });
    var cur = list.filter(function (o) { return o.state !== 'mastered'; })[0] || list[0];
    return { list: list, cur: cur };
  }

  function totals() {
    var map = jget(K_PROG, {}), t = 0, m = 0;
    data().forEach(function (L) {
      var s = stats(L.n, map);
      t += s.total; m += s.mastered;
    });
    return { total: t, mastered: m };
  }

  function bump(id, ok) {
    var map = jget(K_PROG, {});
    var p = getP(map, id);
    p.seen = (p.seen || 0) + 1;
    if (ok) { p.correct = (p.correct || 0) + 1; p.box = Math.min(5, (p.box || 0) + 1); }
    else p.box = Math.max(0, (p.box || 0) - 1);
    map[id] = p;
    jset(K_PROG, map);
  }

  function distractVerbs(correct, pool) {
    var opts = [correct];
    shuffle(pool).forEach(function (v) {
      if (opts.length >= 4) return;
      if (v.ar !== correct.ar && opts.every(function (o) { return o.ar !== v.ar; })) opts.push(v);
    });
    while (opts.length < 4 && pool.length) {
      var x = pool[Math.floor(Math.random() * pool.length)];
      if (opts.every(function (o) { return o.ar !== x.ar; })) opts.push(x);
      else break;
    }
    return shuffle(opts).slice(0, 4);
  }

  function allVerbs() {
    var out = [];
    data().forEach(function (L) { (L.verbs || []).forEach(function (v) { out.push(v); }); });
    return out;
  }

  function qVerb(v, dir) {
    var pool = allVerbs();
    var opts = distractVerbs(v, pool);
    return {
      type: 'verb', dir: dir, id: v.id,
      prompt: dir === 'ar2nl' ? v.ar : v.nl,
      promptAr: dir === 'ar2nl',
      answer: dir === 'ar2nl' ? v.nl : v.ar,
      answerAr: dir !== 'ar2nl',
      opts: opts.map(function (o) { return dir === 'ar2nl' ? o.nl : o.ar; }),
      optsAr: dir !== 'ar2nl',
      correct: dir === 'ar2nl' ? v.nl : v.ar,
      tense: v.tense
    };
  }

  function qSentence(s) {
    var pool = [];
    data().forEach(function (L) { (L.sentences || []).forEach(function (x) { pool.push(x); }); });
    var opts = [s.nl];
    shuffle(pool).forEach(function (x) {
      if (opts.length >= 4) return;
      if (x.nl !== s.nl) opts.push(x.nl);
    });
    return {
      type: 'sentence', id: s.id,
      prompt: s.ar, promptAr: true,
      opts: shuffle(opts).slice(0, 4),
      optsAr: false,
      correct: s.nl,
      answer: s.nl
    };
  }

  function qTense(pair) {
    var askPast = Math.random() < 0.5;
    var prompt = askPast
      ? ('Wat is de verleden tijd van “' + pair.nl + '”?')
      : ('Wat is de tegenwoordige tijd van “' + pair.nl + '”?');
    var correct = askPast ? pair.past : pair.present;
    var wrong = askPast ? pair.present : pair.past;
    var extras = allVerbs().map(function (v) { return v.ar; }).filter(function (a) { return a !== correct && a !== wrong; });
    var opts = shuffle([correct, wrong].concat(shuffle(extras).slice(0, 2))).slice(0, 4);
    if (opts.indexOf(correct) < 0) opts[0] = correct;
    return {
      type: 'tense', id: 't-' + pair.past,
      prompt: prompt, promptAr: false,
      opts: shuffle(opts), optsAr: true,
      correct: correct, answer: correct
    };
  }

  function qFill(s) {
    if (!s.words || s.words.length < 2) return null;
    var gap = 0;
    var opts = [s.words[gap]];
    allVerbs().forEach(function (v) {
      if (opts.length >= 4) return;
      if (opts.indexOf(v.ar) < 0) opts.push(v.ar);
    });
    var shown = s.words.map(function (w, i) { return i === gap ? '……' : w; }).join(' ');
    return {
      type: 'fill', id: s.id + '-f',
      prompt: shown, promptAr: true,
      opts: shuffle(opts).slice(0, 4), optsAr: true,
      correct: s.words[gap], answer: s.words[gap],
      full: s.ar, nl: s.nl
    };
  }

  function build(n) {
    var L = lesson(n);
    if (!L) return [];
    var verbs = L.verbs || [];
    var verbQs = [];
    var tenseQs = [];
    var sentQs = [];
    /* 1) Eerst werkwoorden leren (Arabisch→NL en NL→Arabisch) */
    verbs.forEach(function (v) { verbQs.push(qVerb(v, 'ar2nl')); });
    verbs.forEach(function (v) { verbQs.push(qVerb(v, 'nl2ar')); });
    /* 2) Daarna tijden (verleden ↔ heden), als de les die heeft */
    (L.pairs || []).forEach(function (p) { tenseQs.push(qTense(p)); });
    /* 3) Pas daarna zinnen — niet in pure vocab-lessen */
    if (L.focus !== 'verbs_only') {
      shuffle(L.sentences || []).forEach(function (s) {
        sentQs.push(qSentence(s));
        var f = qFill(s);
        if (f) sentQs.push(f);
      });
    }
    /* Volgorde vast: werkwoorden → tijden → zinnen (geen shuffle van die blokken) */
    var qs = verbQs.concat(tenseQs).concat(sentQs);
    if (qs.length > ROUND) {
      /* behoud alle werkwoordvragen zoveel mogelijk */
      var keep = verbQs.slice(0, Math.min(verbQs.length, ROUND));
      var room = ROUND - keep.length;
      qs = keep.concat(tenseQs.concat(sentQs).slice(0, room));
    }
    while (qs.length < ROUND && verbs.length) {
      qs.push(qVerb(verbs[qs.length % verbs.length], qs.length % 2 ? 'nl2ar' : 'ar2nl'));
    }
    return qs.slice(0, ROUND);
  }

  function open(n, mode) {
    clearTimeout(fastTimer);
    n = Number(n);
    var L = lesson(n);
    if (!L) return;
    app = document.getElementById('gd-app');
    if (!app) return;
    bind();
    S = {
      n: n, title: L.title, tip: L.tip || '', focus: L.focus,
      screen: mode === 'intro' ? 'intro' : 'play',
      qs: [], i: 0, hearts: MAX_HEARTS, correct: 0, attempts: 0,
      xp: 0, chosen: -1, fb: null, committed: false, perfect: true
    };
    if (S.screen === 'play') S.qs = build(n);
    render();
  }

  function commitXp() {
    if (!S || S.committed || !S.xp) return;
    S.committed = true;
    try {
      var cur = Math.max(0, parseInt(localStorage.getItem(K_XP) || '0', 10) || 0);
      localStorage.setItem(K_XP, String(cur + S.xp));
    } catch (_e) {}
    try {
      if (window.GrammarLabEngine && GrammarLabEngine.addXp) GrammarLabEngine.addXp(S.xp, !!S.perfect);
    } catch (_e2) {}
    try {
      if (window.GrammarLabLeaderboard && GrammarLabLeaderboard.publish) GrammarLabLeaderboard.publish();
    } catch (_e3) {}
  }

  function leave() {
    clearTimeout(fastTimer);
    commitXp();
    S = null;
    var home = window.GrammarLabHome;
    if (home && home.enter) { try { home.enter(); } catch (_e) {} }
    if (window.GrammarLabEngine && window.GrammarLabEngine.refresh) {
      try { window.GrammarLabEngine.refresh(); } catch (_e2) {}
    }
    if (window.scrollTo) window.scrollTo(0, 0);
  }

  function current() { return S && S.qs[S.i]; }

  function check() {
    var q = current();
    if (!q || S.fb || S.chosen < 0) return;
    var pick = q.opts[S.chosen];
    var ok = pick === q.correct;
    S.attempts++;
    if (q.id) bump(q.id, ok);
    if (ok) { S.correct++; S.xp += 10; }
    else { S.hearts = Math.max(0, S.hearts - 0.5); S.perfect = false; }
    S.fb = { ok: ok };
    render();
    scheduleAutoNext(ok);
  }

  function next() {
    clearTimeout(fastTimer);
    if (!S) return;
    if (S.hearts <= 0) { S.screen = 'fail'; S.fb = null; render(); return; }
    S.i++;
    S.chosen = -1;
    S.fb = null;
    if (S.i >= S.qs.length) { S.screen = 'done'; commitXp(); }
    render();
  }

  function bar(label, pct) {
    var hearts = '', k;
    for (k = 0; k < MAX_HEARTS; k++) {
      var rem = S.hearts - k;
      hearts += '<span class="' + (rem >= 1 ? 'alive' : (rem >= 0.5 ? 'half' : 'lost')) + '">' + icon('heart') + '</span>';
    }
    var m = speedMode();
    var lbl = m === 'super' ? '⚡⚡ Supersnel' : '⚡ Snel';
    var cls = 'gd-fast' + (m !== 'off' ? ' on' : '') + (m === 'super' ? ' super' : '');
    return '<div class="gd-lesson-bar">' +
      '<button type="button" class="vl-exit" data-vb="exit" aria-label="Terug">' + icon('close') + '</button>' +
      '<div class="gd-progress-wrap"><div class="gd-progress-title"><strong>Werkwoorden</strong><span>' + esc(label) + '</span></div>' +
      '<div class="gd-progress" role="progressbar" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div></div>' +
      '<button type="button" class="' + cls + '" data-vb="fast" aria-pressed="' + (m !== 'off') + '">' + lbl + '</button>' +
      '<div class="gd-bar-hearts">' + hearts + '</div></div>';
  }

  function introScreen() {
    var L = lesson(S.n);
    var verbs = (L.verbs || []).map(function (v) {
      return '<li><span lang="ar" dir="rtl">' + esc(v.ar) + '</span> — ' + esc(v.nl) +
        ' <em class="vb-tense">' + (v.tense === 'present' ? 'heden' : 'verleden') + '</em></li>';
    }).join('');
    return '<div class="gd-shell gd-play vl vb">' +
      '<div class="gd-lesson-bar"><button type="button" class="vl-exit" data-vb="exit">' + icon('close') + '</button>' +
      '<div class="gd-progress-wrap"><div class="gd-progress-title"><strong>Les ' + S.n + '</strong><span>' + esc(S.title) + '</span></div></div></div>' +
      '<div class="gd-card"><h1>Werkwoorden · les ' + S.n + '</h1>' +
      (S.tip ? '<p class="vb-tip">' + esc(S.tip) + '</p>' : '') +
      '<ul class="vb-list">' + verbs + '</ul>' +
      '<button type="button" class="gd-primary gd-full" data-vb="start">Start oefenen</button></div></div>';
  }

  function playScreen() {
    var q = current(), total = S.qs.length, pct = Math.round(100 * S.i / Math.max(1, total));
    if (!q) return doneScreen();
    var prompt = q.promptAr
      ? '<div class="vb-prompt ar" lang="ar" dir="rtl">' + esc(q.prompt) + '</div>'
      : '<div class="vb-prompt">' + esc(q.prompt) + '</div>';
    var title = q.type === 'tense' ? 'Kies de juiste tijd' : (q.type === 'fill' ? 'Welk werkwoord past?' : (q.type === 'sentence' ? 'Wat betekent deze zin?' : 'Wat betekent dit?'));
    var body = '<h2 class="gd-task-title">' + title + '</h2>' + prompt +
      '<div class="gd-options">' + q.opts.map(function (o, k) {
        var mark = '';
        if (S.fb) mark = o === q.correct ? ' correct' : (S.chosen === k ? ' wrong' : '');
        return '<button type="button" class="gd-option' + (q.optsAr ? ' gd-option-ar' : '') + (S.chosen === k ? ' selected' : '') + mark +
          '" data-vb="pick" data-i="' + k + '" ' + (S.fb ? 'disabled ' : '') +
          (q.optsAr ? ' lang="ar" dir="rtl"' : '') + '>' + esc(o) + '</button>';
      }).join('') + '</div>' +
      '<div class="gd-task-actions"><button type="button" class="gd-primary gd-full" data-vb="check" ' +
        (S.chosen >= 0 && !S.fb ? '' : 'disabled') + '>Controleer</button></div>';
    var fb = '';
    if (S.fb) {
      var good = S.fb.ok;
      var headline = good ? (['Goed!', 'Prima!', 'Uitstekend!'][S.i % 3]) : 'Juiste antwoord:';
      fb = '<section class="gd-feedback gd-feedback-sheet ' + (good ? 'good' : 'review') + (superOn() ? ' gd-feedback-super' : '') + '" role="status" aria-live="assertive">' +
        '<div class="gd-feedback-inner"><strong>' + headline + '</strong>' +
        (superOn() ? '' : ('<p class="gd-correct-answer"' + (q.optsAr || q.promptAr ? ' lang="ar" dir="rtl"' : '') + '>' + esc(q.correct) + '</p>' +
          (q.full ? '<p lang="ar" dir="rtl">' + esc(q.full) + '</p>' : '') +
          (q.nl ? '<p>' + esc(q.nl) + '</p>' : ''))) +
        (fastOn() ? '<div class="gd-autonext" aria-hidden="true"><i></i></div>' : '') +
        '<button type="button" class="gd-primary gd-full" data-vb="next">Verder</button></div></section>';
    }
    return '<div class="gd-shell gd-play vl vb">' + bar('Vraag ' + (S.i + 1) + ' / ' + total, pct) +
      '<div class="gd-card gd-task">' + body + '</div>' + fb + '</div>';
  }

  function doneScreen() {
    var pct = S.attempts ? Math.round(100 * S.correct / S.attempts) : 0;
    return '<div class="gd-shell gd-play vl vb">' + bar('Klaar', 100) +
      '<div class="gd-card gd-finish"><h1>Les ' + S.n + ' klaar</h1>' +
      '<div class="gd-result-grid"><span><strong>' + S.xp + '</strong><small>XP</small></span>' +
      '<span><strong>' + pct + '%</strong><small>goed</small></span></div>' +
      '<div class="gd-finish-actions">' +
      '<button type="button" class="gd-primary gd-full" data-vb="again">Nog een keer</button>' +
      '<button type="button" class="gd-secondary gd-full" data-vb="exit">Terug naar pad</button></div></div></div>';
  }

  function failScreen() {
    commitXp();
    return '<div class="gd-shell gd-play vl vb">' + bar('Gestopt', Math.round(100 * S.i / Math.max(1, S.qs.length))) +
      '<div class="gd-card gd-finish"><h1>Geen hartjes meer</h1>' +
      '<button type="button" class="gd-primary gd-full" data-vb="again">Opnieuw</button>' +
      '<button type="button" class="gd-secondary gd-full" data-vb="exit">Terug</button></div></div>';
  }

  function render() {
    if (!app || !S) return;
    var html = S.screen === 'intro' ? introScreen()
      : S.screen === 'fail' ? failScreen()
      : S.screen === 'done' ? doneScreen()
      : playScreen();
    app.innerHTML = html;
  }

  function onClick(e) {
    var t = e.target.closest ? e.target.closest('[data-vb]') : null;
    if (!t || !S) return;
    e.stopPropagation();
    var a = t.getAttribute('data-vb');
    if (a === 'exit') return leave();
    if (a === 'start') { S.screen = 'play'; S.qs = build(S.n); S.i = 0; S.chosen = -1; S.fb = null; render(); return; }
    if (a === 'fast') { cycleSpeed(); if (!fastOn()) clearTimeout(fastTimer); render(); return; }
    if (a === 'pick') {
      if (!S.fb) {
        S.chosen = Number(t.getAttribute('data-i'));
        if (fastOn()) check(); else render();
      }
      return;
    }
    if (a === 'check') return check();
    if (a === 'next') return next();
    if (a === 'again') { var n = S.n; commitXp(); S = null; return open(n, 'play'); }
  }

  function bind() {
    if (bound) return;
    bound = true;
    document.addEventListener('click', onClick, true);
  }

  window.GrammarLabVerbs = {
    open: open,
    plan: plan,
    totals: totals,
    leave: leave
  };
})();
