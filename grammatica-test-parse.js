/* Grammatica Lab · Duolingo-stijl zinsontleding (slepen of tikken) & snelle modus.
 * Combineert authentieke zinnen uit lab_content.js (GRAMMATICA_LAB) en parse_data.js
 * (PARSE_DATA). Alle woordsoorten worden uitsluitend fonetisch weergegeven.
 */
(function () {
  'use strict';

  var K_SET = 'alm_grammar_test_settings_v1';

  // Fonetische woordsoorten (Nederlandse uitspraak) + korte betekenis.
  var PH = {
    mubtada: ['moebtada', 'onderwerp van een naamwoordelijke zin'],
    khabar: ['khabar', 'gezegde: wat over de moebtada gezegd wordt'],
    ishara: ['ism ishaara', 'aanwijzend voornaamwoord (dit, dat)'],
    jar: ['harf djarr', 'voorzetsel (maakt het volgende woord madjroer)'],
    majrur: ['madjroer', 'woord dat in de -i-naamval (genitief) staat'],
    mudaaf: ['moedaaf', 'eerste deel van een bezitsconstructie'],
    mudaaf_ilayh: ['moedaaf ilayh', 'tweede deel van een bezitsconstructie (madjroer)'],
    naat: ["na't", 'bijvoeglijk naamwoord (beschrijving)'],
    manuut: ["man'oet", 'het woord dat beschreven wordt'],
    badal: ['badal', 'bijstelling'],
    mubdal: ['moebdal minhoe', 'woord waarop de bijstelling slaat'],
    fail: ["faa'il", 'onderwerp (dader) van een werkwoord'],
    fiil: ["fi'l", 'werkwoord'],
    mafool: ["maf'oel bihi", 'lijdend voorwerp'],
    damir: ['damier', 'persoonlijk voornaamwoord'],
    zarf: ['zarf', 'bijwoord van plaats of tijd (meestal mansoeb)'],
    madud: ["ma'doed", 'het getelde naamwoord na een telwoord'],
    ism_istifham: ['ism istifhaam', 'vraagwoord (naamwoord zoals wie, wat, waar)'],
    harf_istifham: ['harf istifhaam', 'vraagpartikel (zoals a- of hal)'],
    harf_atf: ['harf atf', 'voegwoord (zoals wa = en)'],
    harf_nafie: ['harf nafie', 'ontkenningspartikel (zoals laa / maa)'],
    harf_nidaa: ["harf an-nidaa'", 'roeppartikel (yaa = o)'],
    harf_jawab: ['harf djawaab', 'antwoordwoord (na‘am = ja, laa = nee)'],
    ism_mawsul: ['ism mawsoel', 'betrekkelijk voornaamwoord (alladhie / allatie)'],
    marfu: ["marfoe'", 'nominatief (-oe / -oen)'],
    mansub: ['mansoeb', 'accusatief (-a / -an)'],
    ism: ['ism', 'naamwoord (zelfstandig naamwoord of naam)'],
    harf: ['harf', 'partikel (klein functiewoord)']
  };
  var ORDER = Object.keys(PH);

  // Koppeling van lab_content.js-termen naar uniforme fonetische sleutels.
  var LAB_MAP = {
    'Moebtada': 'mubtada', "Moebtada'": 'mubtada',
    'Chabar': 'khabar', 'khabar': 'khabar', 'predicaat': 'khabar',
    'Ism Isjaarah': 'ishara',
    'Harf Djarr': 'jar',
    'Madjroer': 'majrur',
    'Moedaaf': 'mudaaf',
    'Moedaaf Ilaih': 'mudaaf_ilayh', 'Moedaaf ilaih': 'mudaaf_ilayh',
    'Na‘t': 'naat', "Na't": 'naat',
    'Man‘oet': 'manuut', "Man'oet": 'manuut',
    'Faa‘il': 'fail', "Faa'il": 'fail',
    'Fi‘l': 'fiil', "Fi'l": 'fiil',
    'Maf‘oel bih': 'mafool', "Maf'oel bih": 'mafool', 'lijdend voorwerp': 'mafool',
    'Dhamier': 'damir',
    'Zarf': 'zarf',
    'Ma‘doed': 'madud', "Ma'doed": 'madud',
    'Ism Istifhaam': 'ism_istifham',
    'Harf Istifhaam': 'harf_istifham',
    'Harf Atf': 'harf_atf',
    'Harf Nafie': 'harf_nafie',
    'Harf an-Nidaa’': 'harf_nidaa',
    'Harf Djawaab': 'harf_jawab',
    'Ism Mawsoel': 'ism_mawsul',
    'Marfoe‘': 'marfu',
    'Mansoeb': 'mansub',
    'Ism': 'ism',
    'Harf': 'harf'
  };

  function esc(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function PD() { return window.PARSE_DATA || { SENTENCES: {}, ROLES: {} }; }
  function LAB() { return window.GRAMMATICA_LAB || {}; }
  function name(k) { return (PH[k] || [k])[0]; }
  function meaning(k) { return (PH[k] || ['', ''])[1]; }

  /* ---------- instellingen ---------- */
  function settings() {
    try { return JSON.parse(localStorage.getItem(K_SET) || '{}') || {}; } catch (_e) { return {}; }
  }
  function fastOn() { return settings().fast === true; }
  function setFast(on) {
    var s = settings(); s.fast = !!on;
    try { localStorage.setItem(K_SET, JSON.stringify(s)); } catch (_e) {}
  }

  /* ---------- zinnen verzamelen & schalen op niveau ---------- */
  function stripAr(s) {
    return String(s || '').replace(/[\u064b-\u065f\u0670\u06d6-\u06ed\u0640\s.,!?؟،؛]/g, '');
  }
  function mapLabWord(w) {
    // Voorkeur: functie (w[3]) > Madjroer (w[4]) > naam (w[2]) > soort (w[1])
    var raw = w[3] || (w[4] === 'Madjroer' ? 'Madjroer' : '') || w[2] || w[4] || w[1];
    return LAB_MAP[raw] || LAB_MAP[w[1]] || 'ism';
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pool(n) {
    var out = [], seen = {}, L = LAB(), S = PD().SENTENCES || {};
    Object.keys(L).map(Number).sort(function (a, b) { return a - b; }).forEach(function (l) {
      if (l > n) return;
      ((L[l] && L[l].ontleding) || []).forEach(function (s, i) {
        if (!s || !s.woorden || !s.woorden.length) return;
        var tokens = s.woorden.map(function (w) { return { t: w[0], r: mapLabWord(w) }; });
        var key = stripAr(tokens.map(function (t) { return t.t; }).join(''));
        if (seen[key]) return;
        seen[key] = true;
        out.push({ lesson: l, idx: 'lab-' + i, nl: s.nl || '', tokens: tokens, diff: tokens.length + l / 10 });
      });
    });
    Object.keys(S).map(Number).sort(function (a, b) { return a - b; }).forEach(function (l) {
      if (l > n) return;
      (S[l] || []).forEach(function (s, i) {
        if (!s || !s.tokens || !s.tokens.length) return;
        var key = stripAr(s.tokens.map(function (t) { return t.t; }).join(''));
        if (seen[key]) return;
        seen[key] = true;
        out.push({ lesson: l, idx: 'pd-' + i, nl: '', tokens: s.tokens, diff: s.tokens.length + l / 10 });
      });
    });
    return out;
  }
  function available(n) { return n >= 1 && pool(n).length > 0; }

  // Moeilijker naar gelang de les: eerst zinnen uit het huidige lesniveau,
  // daarna langere/latere zinnen uit eerdere lessen, telkens random geschud.
  function pick(n, count) {
    var all = pool(n);
    if (!all.length) return [];
    var maxL = Math.max.apply(null, all.map(function (s) { return s.lesson; }));
    var current = shuffle(all.filter(function (s) { return s.lesson === maxL; }));
    var rest = all.filter(function (s) { return current.indexOf(s) < 0; })
      .sort(function (a, b) { return b.diff - a.diff; });
    var hard = shuffle(rest.slice(0, Math.max(3, Math.ceil(rest.length / 2))));
    var easy = shuffle(rest.slice(hard.length));
    var order = current.concat(hard, easy), out = [];
    while (out.length < count) {
      for (var i = 0; i < order.length && out.length < count; i++) out.push(order[i]);
      order = shuffle(all);
    }
    return out;
  }

  function labelsFor(n, sentence) {
    var base = ['mubtada', 'khabar'];
    try {
      (PD().rolesForLesson(Math.min(n, 23)) || []).forEach(function (k) {
        if (PH[k] && base.indexOf(k) < 0) base.push(k);
      });
    } catch (_e) {}
    sentence.tokens.forEach(function (t) { if (PH[t.r] && base.indexOf(t.r) < 0) base.push(t.r); });
    return ORDER.filter(function (k) { return base.indexOf(k) >= 0; });
  }

  function makeTask(n, s) {
    return {
      type: 'zinsontleding',
      lesson: s.lesson,
      nl: s.nl || '',
      tokens: s.tokens,
      labels: labelsFor(n, s),
      example: { ar: s.tokens.map(function (t) { return t.t; }).join(' '), nl: s.nl || '' },
      concept: 'zinsontleding:' + s.lesson + ':' + s.idx
    };
  }
  function build(n, count) {
    if (!available(n)) return [];
    return pick(n, count).map(function (s) { return makeTask(n, s); });
  }

  /* ---------- weergave ---------- */
  function body(task, st) {
    var fb = st.feedback;
    var words = task.tokens.map(function (tok, i) {
      var got = st.parse[i], ok = fb && got === tok.r;
      var cls = 'gd-pslot' + (got ? ' filled' : '') + (fb ? (ok ? ' ok' : ' bad') : '') +
        (st.parseFocus === i ? ' focus' : '');
      return '<button type="button" class="' + cls + '" data-action="pslot" data-value="' + i + '" data-drop="' + i + '"' +
        (fb ? ' disabled' : '') + ' aria-label="Woord ' + (i + 1) + ': ' + esc(tok.t) + (got ? ', ' + esc(name(got)) : ', nog leeg') + '">' +
        '<span class="gd-pword" lang="ar" dir="rtl">' + esc(tok.t) + '</span>' +
        '<span class="gd-pdrop">' + (got ? esc(name(got)) : '<i aria-hidden="true">sleep hierheen</i>') + '</span>' +
        (fb && !ok ? '<span class="gd-pfix">' + esc(name(tok.r)) + '</span>' : '') +
        '</button>';
    }).join('');
    var used = {};
    Object.keys(st.parse).forEach(function (k) { used[st.parse[k]] = true; });
    var bank = task.labels.map(function (k) {
      return '<button type="button" class="gd-plab' + (st.parsePick === k ? ' sel' : '') + (used[k] ? ' used' : '') +
        '" data-action="plab" data-value="' + k + '"' + (fb ? ' disabled' : '') +
        ' aria-pressed="' + (st.parsePick === k) + '">' + esc(name(k)) + '</button>';
    }).join('');
    var tipKey = st.parsePick || st.parseTip;
    var tip = tipKey ? '<p class="gd-ptip" role="status"><strong>' + esc(name(tipKey)) + '</strong> — ' + esc(meaning(tipKey)) + '</p>' : '';
    return (task.nl ? '<p class="gd-gap-hint">' + esc(task.nl) + '</p>' : '') +
      '<div class="gd-psentence" dir="rtl">' + words + '</div>' +
      '<p class="gd-subinstruction">Sleep een woordsoort naar elk woord (of tik op een woordsoort en daarna op het woord).</p>' +
      '<div class="gd-pbank">' + bank + '</div>' + tip;
  }

  function complete(task, st) {
    return task.tokens.every(function (_t, i) { return !!st.parse[i]; });
  }
  function grade(task, st) {
    return task.tokens.every(function (t, i) { return st.parse[i] === t.r; });
  }
  function solution(task) {
    return '<div class="gd-psols" dir="rtl">' + task.tokens.map(function (t) {
      return '<span class="gd-psol"><b lang="ar" dir="rtl">' + esc(t.t) + '</b><small>' + esc(name(t.r)) + '</small></span>';
    }).join('') + '</div>';
  }

  /* ---------- slepen (muis en touch) ---------- */
  var drag = null;
  function clearOver() {
    document.querySelectorAll('.gd-pslot.over').forEach(function (el) { el.classList.remove('over'); });
  }
  function bindDrag(onDrop) {
    document.addEventListener('pointerdown', function (e) {
      window.__gdSuppressClick = 0;
      var chip = e.target.closest && e.target.closest('.gd-plab:not([disabled])');
      if (!chip || e.button > 0) return;
      drag = { key: chip.getAttribute('data-value'), x: e.clientX, y: e.clientY, moved: false, ghost: null, chip: chip };
    });
    document.addEventListener('pointermove', function (e) {
      if (!drag) return;
      if (!drag.moved && Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < 8) return;
      if (!drag.moved) {
        drag.moved = true;
        var g = document.createElement('div');
        g.className = 'gd-pghost'; g.textContent = name(drag.key);
        document.body.appendChild(g); drag.ghost = g;
        document.body.classList.add('gd-dragging');
      }
      e.preventDefault();
      drag.ghost.style.left = e.clientX + 'px';
      drag.ghost.style.top = e.clientY + 'px';
      var over = document.elementFromPoint(e.clientX, e.clientY);
      clearOver();
      var slot = over && over.closest && over.closest('[data-drop]');
      if (slot) slot.classList.add('over');
    }, { passive: false });
    function end(e) {
      if (!drag) return;
      var d = drag; drag = null;
      clearOver();
      document.body.classList.remove('gd-dragging');
      if (d.ghost) d.ghost.remove();
      if (!d.moved) return;
      window.__gdSuppressClick = Date.now();
      var over = document.elementFromPoint(e.clientX, e.clientY);
      var slot = over && over.closest && over.closest('[data-drop]');
      if (slot) onDrop(d.key, Number(slot.getAttribute('data-drop')));
    }
    document.addEventListener('pointerup', end);
    document.addEventListener('pointercancel', function () {
      if (drag && drag.ghost) drag.ghost.remove();
      drag = null; clearOver(); document.body.classList.remove('gd-dragging');
    });
  }

  window.GrammarLabParse = {
    available: available, build: build, body: body, complete: complete, grade: grade,
    solution: solution, bindDrag: bindDrag, fastOn: fastOn, setFast: setFast, name: name, PH: PH
  };
})();
