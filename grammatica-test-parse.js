/* Grammatica Lab · Duolingo-stijl zinsontleding (slepen of tikken) & snelle modus.
 * Combineert authentieke zinnen uit lab_content.js (GRAMMATICA_LAB) en parse_data.js
 * (PARSE_DATA). Ondersteunt meerdere woordsoorten per woord (1, 2 of 3) en woordgroepen
 * waarin 2 woorden samen één zinsdeel vormen. Alle woordsoorten worden fonetisch getoond.
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
    badal: ['badal', 'bijstelling (volgt en verduidelijkt het woord ervoor)'],
    mubdal: ['moebdal minhoe', 'woord waarop een bijstelling (badal) slaat'],
    fail: ["faa'il", 'onderwerp (dader) van een werkwoord'],
    fiil: ["fi'l", 'werkwoord'],
    mafool: ["maf'oel bihi", 'lijdend voorwerp'],
    damir: ['damier', 'persoonlijk of bezittelijk voornaamwoord'],
    zarf: ['zarf', 'bijwoord van plaats of tijd (staat als moedaaf)'],
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
    'Badal': 'badal',
    'Moebdal minhoe': 'mubdal',
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
  var LAB_TERMS_SORTED = Object.keys(LAB_MAP).sort(function (a, b) { return b.length - a.length; });

  function esc(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function PD() { return window.PARSE_DATA || { SENTENCES: {}, ROLES: {} }; }
  function LAB() { return window.GRAMMATICA_LAB || {}; }
  function name(k) { return k === '__group__' ? 'Woordgroep (samen)' : (PH[k] || [k])[0]; }
  function meaning(k) {
    if (k === '__group__') return 'Welk zinsdeel vormen deze gekoppelde woorden samen als één geheel?';
    return (PH[k] || ['', ''])[1];
  }

  /* ---------- instellingen ---------- */
  function settings() {
    try { return JSON.parse(localStorage.getItem(K_SET) || '{}') || {}; } catch (_e) { return {}; }
  }
  function fastOn() { return settings().fast === true; }
  function setFast(on) {
    var s = settings(); s.fast = !!on;
    try { localStorage.setItem(K_SET, JSON.stringify(s)); } catch (_e) {}
  }

  /* ---------- rollen & woordgroepen afleiden ---------- */
  function uniqRoles(list) {
    var out = [];
    list.forEach(function (k) { if (PH[k] && out.indexOf(k) < 0) out.push(k); });
    return out.slice(0, 3);
  }
  function hasRole(tok, roleKey) {
    return (tok.roles || [tok.r]).indexOf(roleKey) >= 0;
  }
  function extractNoteRoles(note) {
    if (!note) return [];
    var hits = [];
    var scan = note;
    // Match langste termen eerst zodat "Moedaaf Ilaih" niet dubbel matched met "Moedaaf".
    LAB_TERMS_SORTED.forEach(function (term) {
      var idx = scan.indexOf(term);
      if (idx >= 0) {
        hits.push({ idx: idx, key: LAB_MAP[term] });
        scan = scan.slice(0, idx) + term.replace(/./g, ' ') + scan.slice(idx + term.length);
      }
    });
    hits.sort(function (a, b) { return a.idx - b.idx; });
    return uniqRoles(hits.map(function (h) { return h.key; }));
  }

  function mapLabWordRoles(w, lessonNr) {
    var list = [];
    if (w[5]) {
      // Samengesteld woord in 1 geschreven vorm (bijv. وَذٰلِكَ, لِبِلَالٍ, بَيْتُنَا, أَرَجَعَ).
      var noteRoles = extractNoteRoles(w[5]);
      if (w[3] && LAB_MAP[w[3]] && noteRoles.indexOf(LAB_MAP[w[3]]) < 0) {
        list.push(LAB_MAP[w[3]]);
      }
      if (w[2] && LAB_MAP[w[2]] && noteRoles.indexOf(LAB_MAP[w[2]]) < 0) {
        list.push(LAB_MAP[w[2]]);
      }
      list = list.concat(noteRoles);
      if (list.length) return uniqRoles(list);
    }
    if (w[2] && LAB_MAP[w[2]]) list.push(LAB_MAP[w[2]]);
    if (w[3] && LAB_MAP[w[3]]) list.push(LAB_MAP[w[3]]);
    // Voeg Madjroer / Mansoeb toe wanneer die naamval hier grammaticaal onderscheidend is.
    if (w[4] === 'Madjroer' && lessonNr >= 4) list.push('majrur');
    else if (w[4] === 'Mansoeb' && lessonNr >= 11 &&
      (!w[3] || w[3] === 'Maf‘oel bih' || w[3] === 'Na‘t')) list.push('mansub');
    if (!list.length && w[4] && LAB_MAP[w[4]]) list.push(LAB_MAP[w[4]]);
    if (!list.length && w[1] && LAB_MAP[w[1]]) list.push(LAB_MAP[w[1]]);
    if (!list.length) list.push('ism');
    return uniqRoles(list);
  }

  function enrichPdTokens(rawTokens, lessonNr) {
    var toks = rawTokens.map(function (t, i) {
      var roles = [t.r], bare = stripDiac(t.t);
      if (t.r === 'harf' && bare === 'و') {
        roles = ['harf_atf'];
      } else if (t.r === 'ishara') {
        var nxt = rawTokens[i + 1];
        if (nxt && nxt.r === 'badal') roles = ['ishara', 'mubdal'];
        else if (i === 0 || (rawTokens[i - 1] && rawTokens[i - 1].r === 'harf')) roles = ['ishara', 'mubtada'];
      } else if (t.r === 'damir' && (i === 0 || (rawTokens[i - 1] && rawTokens[i - 1].r === 'harf'))) {
        roles = ['damir', 'mubtada'];
      } else if (t.r === 'mudaaf_ilayh' && lessonNr >= 5) {
        roles = ['mudaaf_ilayh', 'majrur'];
      } else if (t.r === 'mubtada' && lessonNr >= 10 && /^(كتابي|قلمك|بيته)$/.test(bare)) {
        roles = ['mubtada', 'mudaaf', 'damir'];
      }
      roles = uniqRoles(roles);
      return { t: t.t, r: roles[0], roles: roles };
    });
    return toks;
  }

  function stripDiac(s) { return String(s || '').replace(/[\u064b-\u065f\u0670\u06d6-\u06ed]/g, ''); }

  function detectGroups(tokens) {
    var groups = [], taken = {};
    function claim(start, end, roleKey, why) {
      for (var k = start; k <= end; k++) if (taken[k]) return false;
      for (var k2 = start; k2 <= end; k2++) taken[k2] = true;
      groups.push({ id: 'g' + groups.length, start: start, end: end, r: roleKey, why: why });
      return true;
    }

    var hasFiil = tokens.some(function (t) { return hasRole(t, 'fiil'); });
    var hasSeparateKhabar = function (fromIdx, toIdx) {
      return tokens.some(function (t, idx) {
        return (idx < fromIdx || idx > toIdx) && hasRole(t, 'khabar');
      });
    };

    // 1. Aanwijzend voornaamwoord + badal/naamwoord (هٰذَا الْكِتَابُ جَدِيْدٌ -> samen moebtada)
    for (var i = 0; i + 2 < tokens.length; i++) {
      var t0 = tokens[i], t1 = tokens[i + 1], t2 = tokens[i + 2];
      if ((hasRole(t0, 'mubdal') || (hasRole(t0, 'ishara') && hasRole(t1, 'badal'))) && hasRole(t2, 'khabar')) {
        t0.roles = uniqRoles(['ishara', 'mubdal']);
        t0.r = t0.roles[0];
        t1.roles = uniqRoles(['badal']);
        t1.r = t1.roles[0];
        claim(i, i + 1, 'mubtada', t0.t + ' + ' + t1.t + ' vormen samen de moebtada.');
      } else if (i === 0 && hasRole(t0, 'ishara') && hasRole(t1, 'mubtada') &&
        tokens.some(function (x, xi) { return xi >= 2 && hasRole(x, 'khabar'); })) {
        // Bv. هٰذَا الْكِتَابُ جَدِيْدٌ in lab_content.js
        t0.roles = uniqRoles(['ishara', 'mubdal']);
        t0.r = t0.roles[0];
        t1.roles = uniqRoles(['badal']);
        t1.r = t1.roles[0];
        claim(i, i + 1, 'mubtada', t0.t + ' + ' + t1.t + ' vormen samen de moebtada.');
      }
    }

    // 2. Naamwoordelijke zin: (moedaaf + moedaaf ilayh) of (man'oet + na't) aan begin met khabar erna
    if (!hasFiil && tokens.length >= 3) {
      var a = tokens[0], b = tokens[1];
      if (!taken[0] && !taken[1] && hasRole(a, 'mudaaf') && !hasRole(a, 'zarf') &&
        hasRole(b, 'mudaaf_ilayh') && hasSeparateKhabar(0, 1)) {
        a.roles = uniqRoles(a.roles.filter(function (k) { return k !== 'mubtada'; }));
        if (!a.roles.length) a.roles = ['mudaaf'];
        a.r = a.roles[0];
        claim(0, 1, 'mubtada', a.t + ' + ' + b.t + ' (bezitsconstructie) vormen samen de moebtada.');
      } else if (!taken[0] && !taken[1] && hasRole(a, 'manuut') && hasRole(b, 'naat') &&
        (hasSeparateKhabar(0, 1) || (tokens[2] && hasRole(tokens[2], 'jar')))) {
        claim(0, 1, 'mubtada', a.t + ' + ' + b.t + ' (naamwoord + na‘t) vormen samen de moebtada.');
      }
    }

    // 3. Gezegde-groepen in een naamwoordelijke zin zonder los khabar-woord:
    //    - harf djarr + madjroer (الْكِتَابُ عَلَى الْمَكْتَبِ)
    //    - zarf + moedaaf ilayh (اَلْبَيْتُ خَلْفَ الْمَسْجِدِ)
    //    - moedaaf + moedaaf ilayh na moebtada (هٰذَا مِفْتَاحُ الْبَيْتِ)
    //    - man'oet + na't na moebtada (هٰذَا كِتَابٌ جَدِيدٌ)
    if (!hasFiil && tokens.length >= 3 && !hasSeparateKhabar(-1, -1)) {
      var hasSubject = groups.some(function (g) { return g.r === 'mubtada'; }) ||
        tokens.some(function (t, idx) { return idx === 0 && hasRole(t, 'mubtada'); });
      if (hasSubject) {
        for (var j = 1; j + 1 < tokens.length; j++) {
          if (taken[j] || taken[j + 1]) continue;
          var x = tokens[j], y = tokens[j + 1];
          if (hasRole(x, 'jar') && hasRole(y, 'majrur') && j + 2 === tokens.length) {
            claim(j, j + 1, 'khabar', x.t + ' + ' + y.t + ' vormen samen de khabar (gezegde).');
          } else if (hasRole(x, 'zarf') && hasRole(y, 'mudaaf_ilayh') && j + 2 === tokens.length) {
            claim(j, j + 1, 'khabar', x.t + ' + ' + y.t + ' vormen samen de khabar (gezegde).');
          } else if (j === 1 && hasRole(x, 'mudaaf') && hasRole(y, 'mudaaf_ilayh') && j + 2 === tokens.length) {
            claim(j, j + 1, 'khabar', x.t + ' + ' + y.t + ' vormen samen de khabar.');
          } else if (j === 1 && hasRole(x, 'manuut') && hasRole(y, 'naat') && j + 2 === tokens.length) {
            claim(j, j + 1, 'khabar', x.t + ' + ' + y.t + ' vormen samen de khabar.');
          }
        }
      }
    }

    // 4. Werkwoordelijke zin: twee woorden samen faa'il of maf'oel bihi (bijv. خَرَجَ ثَلَاثَةُ طُلَّابٍ)
    if (hasFiil && tokens.length >= 3) {
      for (var v = 0; v + 2 < tokens.length; v++) {
        if (!hasRole(tokens[v], 'fiil')) continue;
        var w1 = tokens[v + 1], w2 = tokens[v + 2];
        if (taken[v + 1] || taken[v + 2]) continue;
        if ((hasRole(w1, 'fail') && (hasRole(w2, 'madud') || hasRole(w2, 'mudaaf_ilayh')))) {
          w1.roles = uniqRoles(['mudaaf', 'marfu']);
          w1.r = w1.roles[0];
          claim(v + 1, v + 2, 'fail', w1.t + ' + ' + w2.t + ' vormen samen de faa‘il (onderwerp).');
        } else if (hasRole(w1, 'mafool') && (hasRole(w2, 'madud') || hasRole(w2, 'mudaaf_ilayh') || hasRole(w2, 'naat'))) {
          w1.roles = uniqRoles([hasRole(w2, 'naat') ? 'manuut' : 'mudaaf', 'mansub']);
          w1.r = w1.roles[0];
          claim(v + 1, v + 2, 'mafool', w1.t + ' + ' + w2.t + ' vormen samen het maf‘oel bihi (lijdend voorwerp).');
        }
      }
    }

    return groups;
  }

  function stripAr(s) {
    return String(s || '').replace(/[\u064b-\u065f\u0670\u06d6-\u06ed\u0640\s.,!?؟،؛]/g, '');
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
        var tokens = s.woorden.map(function (w) {
          var roles = mapLabWordRoles(w, l);
          return { t: w[0], r: roles[0], roles: roles };
        });
        var key = stripAr(tokens.map(function (t) { return t.t; }).join(''));
        if (seen[key]) return;
        seen[key] = true;
        var groups = detectGroups(tokens);
        out.push({
          lesson: l, idx: 'lab-' + i, nl: s.nl || '', tokens: tokens, groups: groups,
          diff: tokens.length + groups.length + l / 10
        });
      });
    });
    Object.keys(S).map(Number).sort(function (a, b) { return a - b; }).forEach(function (l) {
      if (l > n) return;
      (S[l] || []).forEach(function (s, i) {
        if (!s || !s.tokens || !s.tokens.length) return;
        var key = stripAr(s.tokens.map(function (t) { return t.t; }).join(''));
        if (seen[key]) return;
        seen[key] = true;
        var tokens = enrichPdTokens(s.tokens, l);
        var groups = detectGroups(tokens);
        out.push({
          lesson: l, idx: 'pd-' + i, nl: '', tokens: tokens, groups: groups,
          diff: tokens.length + groups.length + l / 10
        });
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
    sentence.tokens.forEach(function (t) {
      (t.roles || [t.r]).forEach(function (r) { if (PH[r] && base.indexOf(r) < 0) base.push(r); });
    });
    (sentence.groups || []).forEach(function (g) {
      if (PH[g.r] && base.indexOf(g.r) < 0) base.push(g.r);
    });
    return ORDER.filter(function (k) { return base.indexOf(k) >= 0; });
  }

  function makeTask(n, s) {
    return {
      type: 'zinsontleding',
      lesson: s.lesson,
      nl: s.nl || '',
      tokens: s.tokens,
      groups: s.groups || [],
      labels: labelsFor(n, s),
      example: { ar: s.tokens.map(function (t) { return t.t; }).join(' '), nl: s.nl || '' },
      concept: 'zinsontleding:' + s.lesson + ':' + s.idx
    };
  }
  function build(n, count) {
    if (!available(n)) return [];
    return pick(n, count).map(function (s) { return makeTask(n, s); });
  }

  /* ---------- slot helpers (multi-rol + woordgroepen) ---------- */
  function getSlot(parseObj, key) {
    var v = parseObj && parseObj[String(key)];
    if (!v) return [];
    return Array.isArray(v) ? v.slice() : [v];
  }
  function expectedForSlot(task, key) {
    var s = String(key);
    if (s.charAt(0) === 'g') {
      var g = (task.groups || []).find(function (x) { return x.id === s; });
      return g ? [g.r] : [];
    }
    var tok = task.tokens[Number(s)];
    return tok ? (tok.roles || [tok.r]) : [];
  }
  function applySlot(task, parseObj, slotKey, roleKey) {
    var k = String(slotKey), cur = getSlot(parseObj, k);
    var need = Math.max(1, expectedForSlot(task, k).length);
    if (cur.indexOf(roleKey) >= 0) return;
    if (cur.length < need) cur.push(roleKey);
    else if (need === 1) cur = [roleKey];
    else cur[cur.length - 1] = roleKey;
    parseObj[k] = cur;
  }
  function unsetSlot(parseObj, slotKey, roleKey) {
    var k = String(slotKey), cur = getSlot(parseObj, k).filter(function (r) { return r !== roleKey; });
    if (cur.length) parseObj[k] = cur;
    else delete parseObj[k];
  }
  function matchSet(got, expected) {
    return got.length === expected.length && expected.every(function (r) { return got.indexOf(r) >= 0; });
  }

  /* ---------- weergave ---------- */
  function renderWordSlot(tok, i, st, fb) {
    var got = getSlot(st.parse, i), exp = tok.roles || [tok.r], need = exp.length;
    var filledAll = got.length >= need;
    var ok = fb && matchSet(got, exp);
    var missing = fb ? exp.filter(function (r) { return got.indexOf(r) < 0; }) : [];
    var cls = 'gd-pslot' + (got.length ? ' filled' : '') + (filledAll ? ' full' : '') +
      (need > 1 ? ' multi' : '') + (fb ? (ok ? ' ok' : ' bad') : '') +
      (String(st.parseFocus) === String(i) ? ' focus' : '');
    var placeholder = !got.length ? (need > 1 ? 'kies ' + need + ' rollen' : 'sleep hierheen') :
      (got.length < need ? '+ nog ' + (need - got.length) + ' rol' : '');
    var chips = got.map(function (rk) {
      var chipCls = 'gd-pchip' + (fb ? (exp.indexOf(rk) >= 0 ? ' ok' : ' bad') : '');
      return '<button type="button" class="' + chipCls + '" data-action="punset" data-slot="' + i +
        '" data-role="' + rk + '"' + (fb ? ' disabled' : '') +
        ' aria-label="Verwijder ' + esc(name(rk)) + '">' + esc(name(rk)) +
        (fb ? '' : ' <span aria-hidden="true">×</span>') + '</button>';
    }).join('');

    return '<div class="' + cls + '" data-drop="' + i + '">' +
      '<button type="button" class="gd-pslot-hit" data-action="pslot" data-value="' + i + '"' +
      (fb ? ' disabled' : '') + ' aria-label="Woord ' + (i + 1) + ': ' + esc(tok.t) +
      (need > 1 ? ' (' + need + ' rollen)' : '') +
      (got.length ? ', gekozen: ' + esc(got.map(name).join(' + ')) : ', nog leeg') + '">' +
      '<span class="gd-pword" lang="ar" dir="rtl">' + esc(tok.t) + '</span>' +
      (need > 1 ? '<span class="gd-pcount">' + need + ' rollen</span>' : '') +
      (placeholder ? '<span class="gd-pdrop"><i>' + esc(placeholder) + '</i></span>' : '') +
      '</button>' +
      (chips ? '<div class="gd-pchips">' + chips + '</div>' : '') +
      (fb && missing.length ? '<span class="gd-pfix">+ ' + esc(missing.map(name).join(' · ')) + '</span>' : '') +
      '</div>';
  }

  function renderGroupSlot(group, tokens, st, fb) {
    var got = getSlot(st.parse, group.id), exp = [group.r];
    var ok = fb && matchSet(got, exp);
    var cls = 'gd-pslot gd-gslot' + (got.length ? ' filled full' : '') +
      (fb ? (ok ? ' ok' : ' bad') : '') + (String(st.parseFocus) === group.id ? ' focus' : '');
    var spanWords = group.end - group.start + 1;
    var chips = got.map(function (rk) {
      var chipCls = 'gd-pchip' + (fb ? (rk === group.r ? ' ok' : ' bad') : '');
      return '<button type="button" class="' + chipCls + '" data-action="punset" data-slot="' + group.id +
        '" data-role="' + rk + '"' + (fb ? ' disabled' : '') +
        ' aria-label="Verwijder groepsrol ' + esc(name(rk)) + '">' + esc(name(rk)) +
        (fb ? '' : ' <span aria-hidden="true">×</span>') + '</button>';
    }).join('');

    return '<div class="' + cls + '" data-drop="' + group.id + '">' +
      '<button type="button" class="gd-pslot-hit" data-action="pslot" data-value="' + group.id + '"' +
      (fb ? ' disabled' : '') + ' aria-label="' + spanWords + ' woorden samen: ' +
      esc(tokens.slice(group.start, group.end + 1).map(function (t) { return t.t; }).join(' ')) +
      (got.length ? ', gekozen: ' + esc(name(got[0])) : ', nog leeg') + '">' +
      '<span class="gd-glabel">' + spanWords + ' woorden samen</span>' +
      (!got.length ? '<span class="gd-pdrop"><i>sleep hierheen</i></span>' : '') +
      '</button>' +
      (chips ? '<div class="gd-pchips">' + chips + '</div>' : '') +
      (fb && !ok ? '<span class="gd-pfix">' + esc(name(group.r)) + '</span>' : '') +
      '</div>';
  }

  function body(task, st) {
    var fb = st.feedback, groups = task.groups || [], parts = [];
    for (var i = 0; i < task.tokens.length; i++) {
      var grp = groups.find(function (g) { return g.start === i; });
      if (grp) {
        var inner = [];
        for (var k = grp.start; k <= grp.end; k++) inner.push(renderWordSlot(task.tokens[k], k, st, fb));
        parts.push('<div class="gd-pgroup"><div class="gd-pgroup-words">' + inner.join('') + '</div>' +
          renderGroupSlot(grp, task.tokens, st, fb) + '</div>');
        i = grp.end;
      } else {
        parts.push(renderWordSlot(task.tokens[i], i, st, fb));
      }
    }

    var used = {};
    Object.keys(st.parse).forEach(function (k) {
      getSlot(st.parse, k).forEach(function (r) { used[r] = true; });
    });
    var bank = task.labels.map(function (k) {
      return '<button type="button" class="gd-plab' + (st.parsePick === k ? ' sel' : '') + (used[k] ? ' used' : '') +
        '" data-action="plab" data-value="' + k + '"' + (fb ? ' disabled' : '') +
        ' aria-pressed="' + (st.parsePick === k) + '">' + esc(name(k)) + '</button>';
    }).join('');
    var hasMulti = task.tokens.some(function (t) { return (t.roles || [t.r]).length > 1; });
    var hintParts = [];
    if (hasMulti) hintParts.push('Woorden met een badge hebben 2 of 3 rollen');
    if (groups.length) hintParts.push('onder een blauw vak kies je wat 2 woorden samen zijn');
    var tipKey = st.parsePick || (String(st.parseFocus).charAt(0) === 'g' ? '__group__' : st.parseTip);
    var tip = tipKey ? '<p class="gd-ptip" role="status"><strong>' + esc(name(tipKey)) + '</strong> — ' + esc(meaning(tipKey)) + '</p>' : '';

    return (task.nl ? '<p class="gd-gap-hint">' + esc(task.nl) + '</p>' : '') +
      '<div class="gd-psentence" dir="rtl">' + parts.join('') + '</div>' +
      '<p class="gd-subinstruction">Sleep een woordsoort naar elk woord (of tik en kies).' +
      (hintParts.length ? ' ' + hintParts.join(' · ') + '.' : '') + '</p>' +
      '<div class="gd-pbank">' + bank + '</div>' + tip;
  }

  function complete(task, st) {
    var wordsDone = task.tokens.every(function (t, i) {
      return getSlot(st.parse, i).length >= (t.roles || [t.r]).length;
    });
    var groupsDone = (task.groups || []).every(function (g) {
      return getSlot(st.parse, g.id).length >= 1;
    });
    return wordsDone && groupsDone;
  }

  function grade(task, st) {
    var wordsOk = task.tokens.every(function (t, i) {
      return matchSet(getSlot(st.parse, i), t.roles || [t.r]);
    });
    var groupsOk = (task.groups || []).every(function (g) {
      return matchSet(getSlot(st.parse, g.id), [g.r]);
    });
    return wordsOk && groupsOk;
  }

  function solution(task) {
    var words = task.tokens.map(function (t) {
      var rs = (t.roles || [t.r]).map(name).join(' + ');
      return '<span class="gd-psol"><b lang="ar" dir="rtl">' + esc(t.t) + '</b><small>' + esc(rs) + '</small></span>';
    }).join('');
    var groups = (task.groups || []).map(function (g) {
      var phrase = task.tokens.slice(g.start, g.end + 1).map(function (t) { return t.t; }).join(' ');
      return '<span class="gd-psol gd-psol-group"><b lang="ar" dir="rtl">' + esc(phrase) +
        '</b><small>samen: ' + esc(name(g.r)) + '</small></span>';
    }).join('');
    return '<div class="gd-psols" dir="rtl">' + words + groups + '</div>';
  }

  /* ---------- slepen (muis en touch) ---------- */
  var drag = null;
  function clearOver() {
    document.querySelectorAll('.gd-pslot.over').forEach(function (el) { el.classList.remove('over'); });
  }
  function parseDropKey(raw) {
    return /^\d+$/.test(raw) ? Number(raw) : raw;
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
      if (slot) onDrop(d.key, parseDropKey(slot.getAttribute('data-drop')));
    }
    document.addEventListener('pointerup', end);
    document.addEventListener('pointercancel', function () {
      if (drag && drag.ghost) drag.ghost.remove();
      drag = null; clearOver(); document.body.classList.remove('gd-dragging');
    });
  }

  window.GrammarLabParse = {
    available: available, build: build, body: body, complete: complete, grade: grade,
    solution: solution, bindDrag: bindDrag, applySlot: applySlot, unsetSlot: unsetSlot,
    getSlot: getSlot, fastOn: fastOn, setFast: setFast, name: name, PH: PH
  };
})();
