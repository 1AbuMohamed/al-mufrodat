/* Al-Mufrodat · Grammatica Lab (geïsoleerde interactieve Medina-grammaticaproef).
 * Leest uitsluitend window.GRAMMATICA uit lessons_v2.js.
 * Geen wijzigingen in de oorspronkelijke lessen of de voortgang van de hoofdapp.
 */
(function () {
  'use strict';

  var DATA = window.GRAMMATICA || {};
  var SAVE_KEY = 'alm_grammar_test_scores_v1';
  var SAVE_KEY_V2 = 'alm_grammar_test_v2';
  var MAX_TASKS = 6;
  var app = null;
  var session = {
    lesson: null,
    stage: 'overview',
    tasks: [],
    index: 0,
    theoryCards: [],
    theoryIndex: 0,
    chosen: -1,
    ordered: [],
    feedback: null,
    correct: 0,
    missed: [],
    lastMissed: [],
    review: false,
    hearts: 5,
    combo: 0,
    xp: 0
  };

  function plain(value) { return String(value == null ? '' : value).trim(); }
  function esc(value) {
    return plain(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function isExample(item) {
    return item && item.type === 'voorbeeld' && plain(item.ar) && plain(item.nl) &&
      !/^(?:-|voorbeeld\s*:|enkelvoud\s*:|meervoud\s*:)$/i.test(plain(item.nl));
  }

  function getExamples(n) {
    var lesson = DATA[n];
    if (!lesson) return [];
    var found = new Set();
    return (lesson.inhoud || []).filter(isExample).filter(function (item) {
      var key = plain(item.ar) + '\u0000' + plain(item.nl);
      if (found.has(key)) return false;
      found.add(key); return true;
    });
  }

  function getRules(n) {
    var lesson = DATA[n];
    if (!lesson) return [];
    return theoryRows(n).map(function(item){return plain(item.tekst);});
  }


  // De bron blijft lessons_v2.js. Oefeningen vragen uitsluitend naar exacte
  // bestaande voorbeeldwoorden, regelfragmenten en expliciet benoemde functies.
  function theoryRows(n) {
    return ((DATA[n] && DATA[n].inhoud) || []).filter(function (row) {
      var t=plain(row.tekst);
      return ['regel','tekst','kop'].indexOf(row.type)>=0 && t.length>10 &&
        !/^(?:voorbeelden?:?|merk op:?|in deze les leren we het volgende:?|les \d+[a-z]?|\d+\)|woordenlijst|[•\-\s]+)$/i.test(t);
    });
  }
  function quoted(text) {
    return Array.from(String(text).matchAll(/«([^»]+)»/g),function(m){return m[1];});
  }
  function quoteTokens(text) {
    return quoted(text).filter(function(x){return /[\u0621-\u064a]/.test(x) && !/[◌→]/.test(x);});
  }
  function normalizeArabic(t) {
    return plain(t).replace(/[\u064b-\u065f\u0670\u06d6-\u06ed]/g,'').replace(/[.,!?؟،؛()\[\]«»0-9]/g,'');
  }
  function sourceExamples(n) {
    return ((DATA[n] && DATA[n].inhoud)||[]).filter(function(r){
      return r.type==='voorbeeld' && plain(r.ar) && !/^(?:\-|voorbeeld:?)$/i.test(plain(r.ar));
    });
  }
  function sourceRule(n,term) {
    return getRules(n).find(function(r){return r.indexOf(term)>=0;})||'';
  }
  function makeOptions(answer,others,seed,limit) {
    var seen=new Set([answer]);
    var shuffled=seededShuffle(others.filter(function(x){return plain(x)&&x!==answer;}),seed);
    var out=[answer];
    shuffled.forEach(function(item){if(!seen.has(item)&&out.length<(limit||4)){out.push(item);seen.add(item);}});
    return seededShuffle(out,seed+53);
  }
  function theoryPool(n) {
    return theoryRows(n).map(function(r){return plain(r.tekst);});
  }
  function buildTheoryTasks(n,seed) {
    var rules=theoryPool(n),tasks=[],allQuotes=[];
    Object.keys(DATA).forEach(function(k){
      theoryPool(Number(k)).forEach(function(t){
        quoteTokens(t).forEach(function(q){if(!allQuotes.includes(q))allQuotes.push(q);});
      });
    });
    rules.forEach(function(rule,i){
      var words=quoteTokens(rule).filter(function(x){return x.length<24 && !x.includes(' ') && !x.includes('→');});
      if(words.length){
        var answer=words[0],needle='«'+answer+'»';
        var question=rule.replace(needle,'____');
        var pool=quoteTokens(rules.join(' ')).concat(allQuotes);
        var opts=makeOptions(answer,pool,seed+i*37,4);
        if(opts.length>=2)tasks.push({type:'theory',lesson:n,prompt:'Welk Arabisch woord hoort in deze regel?',context:question,answer:answer,options:opts,rule:rule,concept:'regel:'+i});
      }
    });
    // Meerdere authentieke regels als antwoordopties: ook geschikt voor les 0, 17 en 23.
    var across=Object.keys(DATA).map(Number).filter(function(x){return x!==n;})
      .flatMap(function(x){return theoryPool(x);}).filter(function(x){return x.length>27 && x.length<290;});
    rules.filter(function(r){return r.length>25 && r.length<330;}).forEach(function(rule,i){
      var wrong=rules.filter(function(r){return r!==rule && r.length>25 && r.length<330;}).concat(across);
      var opts=makeOptions(rule,wrong,seed+i*61,3);
      if(opts.length>=2)tasks.push({type:'rule',lesson:n,prompt:'Welke regel hoort bij Les '+n+'?',answer:rule,options:opts,rule:rule,concept:'regel:'+i});
    });
    return seededShuffle(tasks,seed);
  }
  function buildWhyTasks(n,seed) {
    var rules=theoryPool(n), candidates=[];
    var connector=/\b(omdat|vanwege|doordat|waardoor|zodat|aangezien|daarom)\b/i;
    rules.forEach(function(rule,i){
      var hit=connector.exec(rule);
      if(!hit || hit.index<20) return;
      var before=rule.slice(0,hit.index).trim(),reason=rule.slice(hit.index).trim();
      if(reason.length<20||reason.length>240)return;
      candidates.push({rule:rule,prompt:'Waarom? Wat is de reden bij deze regel?',context:before,answer:reason,concept:'waarom:'+i});
    });
    // Expliciete reden/voorwaarde die letterlijk in de bron staat.
    var conditional=rules.filter(function(rule){
      return /na een voorzetsel|vooraf wordt gegaan door|wanneer|als het|als de|in plaats van/i.test(rule) && rule.length>35 && rule.length<310;
    });
    conditional.forEach(function(rule,i){
      candidates.push({rule:rule,prompt:'Welke regel legt deze grammaticale verandering uit?',context:'Les '+n,answer:rule,concept:'waarom-voorwaarde:'+i});
    });
    // Alle afleiders zijn ook authentieke, elders aangehaalde regels of redenen.
    var all=Object.keys(DATA).map(Number).flatMap(function(k){return theoryPool(k);});
    var reasons=candidates.map(function(c){return c.answer;}).concat(all.filter(function(x){return x.length>22&&x.length<310;}));
    return seededShuffle(candidates,seed).map(function(c,i){
      return {type:'why',lesson:n,prompt:c.prompt,context:c.context,answer:c.answer,
        options:makeOptions(c.answer,reasons,seed+i*19,3),rule:c.rule,concept:c.concept};
    }).filter(function(t){return t.options.length>=2;});
  }
  function sourceParse(n,seed) {
    var rows=sourceExamples(n), rules=theoryPool(n),tasks=[];
    function roleTask(ex,word,role,proof,concept) {
      if(!proof)return;
      var parts=splitArabic(ex.ar);
      var index=parts.findIndex(function(t){return normalizeArabic(t)===normalizeArabic(word);});
      if(index<0)return;
      var roles=['Moedaaf','Moedaaf Ilaih','Harf Djarr','Na‘t','Man‘oet','Ma‘doed','Madjroer','Marfoe‘'];
      tasks.push({type:'parse',lesson:n,example:ex,wordIndex:index,word:parts[index],
        prompt:'Welke grammaticale functie heeft het gemarkeerde woord?',answer:role,
        options:makeOptions(role,roles,seed+tasks.length*17,4),rule:proof,concept:concept||'functie:'+role});
    }
    if(n===5 && rules.some(function(r){return r.includes('Moedaaf Ilaih')&&r.includes('كِتَابُ بِلَالٍ');})){
      var proof=sourceRule(n,'In «كِتَابُ بِلَالٍ»');
      rows.filter(function(e){return ['كِتَابُ بِلَالٍ','بَيْتُ الْإِمَامِ'].includes(plain(e.ar));}).forEach(function(ex){
        var words=splitArabic(ex.ar);if(words.length===2){
          roleTask(ex,words[0],'Moedaaf',proof,'Moedaaf');
          roleTask(ex,words[1],'Moedaaf Ilaih',proof,'Moedaaf Ilaih');
        }
      });
    }
    if(n===4||n===23){
      var proof=sourceRule(n,'Harf Djarr');
      if(proof) rows.forEach(function(ex){
        splitArabic(ex.ar).forEach(function(w){
          if(['فِي','مِنْ','عَلَى','إِلَى'].includes(normalizeArabic(w)))roleTask(ex,w,'Harf Djarr',proof,'Harf Djarr');
        });
      });
    }
    if(n===9 && rules.some(function(r){return r.includes('Na‘t')&&r.includes('Man‘oet');})){
      var proof=sourceRule(n,'Na‘t');
      rows.filter(function(ex){return plain(ex.ar)==='بَيْتٌ جَدِيْدٌ';}).forEach(function(ex){
        roleTask(ex,'بَيْتٌ','Man‘oet',proof,'Man‘oet');
        roleTask(ex,'جَدِيْدٌ','Na‘t',proof,'Na‘t');
      });
    }
    if(n===19 && rules.some(function(r){return r.includes('Ma‘doed')&&r.includes('Moedaaf Ilaih');})){
      var proof=sourceRule(n,'Merk op dat de Ma‘doed');
      rows.filter(function(ex){return ['ثَلَاثَةُ كُتُبٍ','أَرْبَعَةُ بُيُوْتٍ'].includes(plain(ex.ar));}).forEach(function(ex){
        var words=splitArabic(ex.ar);
        if(words.length===2)roleTask(ex,words[1],'Ma‘doed',proof,'Ma‘doed');
      });
    }
    return seededShuffle(tasks,seed);
  }
  function buildFindTasks(n,seed) {
    var rules=theoryPool(n),examples=sourceExamples(n),tasks=[];
    rules.forEach(function(rule,i){
      var qs=quoteTokens(rule);
      qs.forEach(function(q){
        examples.forEach(function(ex){
          var words=splitArabic(ex.ar),index=words.findIndex(function(w){return normalizeArabic(w)===normalizeArabic(q);});
          if(index<0)return;
          if(words.length<2||words.length>15)return;
          tasks.push({type:'find',lesson:n,example:ex,word:words[index],wordIndex:index,
            prompt:'Tik op het woord dat bij deze grammaticaregel hoort.',
            context:rule.replace('«'+q+'»','____'),answer:index,rule:rule,concept:'herkennen:'+i});
        });
      });
    });
    return seededShuffle(tasks,seed);
  }
  function buildStudyTasks(n,seed,options) {
    var sets={
      parse:sourceParse(n,seed+101),find:buildFindTasks(n,seed+211),
      why:buildWhyTasks(n,seed+331),theory:buildTheoryTasks(n,seed+449)
    };
    var translations=getExamples(n),legacy=buildTasks(n);
    var other=seededShuffle(legacy,seed+577).map(function(t){return Object.assign({lesson:n,concept:'voorbeeld:'+plain(t.example.ar)},t);});
    if(translations.length>1) translations.forEach(function(ex,i){
      var otherArabic=translations.map(function(e){return plain(e.ar);}).filter(function(a){return a!==plain(ex.ar);});
      if(otherArabic.length)other.push({type:'reverse',lesson:n,example:ex,prompt:'Kies de Arabische zin.',answer:plain(ex.ar),
        options:makeOptions(plain(ex.ar),otherArabic,seed+i*31,4),concept:'voorbeeld:'+plain(ex.ar)});
    });
    sets.why=seededShuffle(sets.why,seed+3);
    sets.theory=seededShuffle(sets.theory,seed+5);
    var pool=[sets.parse,sets.find,sets.why,sets.theory,other];
    var target=(options&&options.count)||10,used=new Set(),result=[];
    // Eerst leerinhoud; minstens 7/10 opdrachten behandelen regel of ontleding
    // wanneer de bron daarvoor voldoende verschillende opgaven levert.
    var order=[0,1,2,3,0,1,2,3,4,3,2,1,0,4,3,2,1,0,4];
    order.forEach(function(kind){
      if(result.length>=target)return;
      var choices=pool[kind], task;
      while(choices.length && !task){
        var probe=choices.shift();
        var sig=probe.type+'|'+probe.concept+'|'+plain(probe.word)+'|'+plain(probe.answer);
        if(!used.has(sig)){task=probe;used.add(sig);}
      }
      if(task)result.push(task);
    });
    var extra=seededShuffle(pool.flat(),seed+733);
    while(result.length<target&&extra.length){
      var t=extra.shift(),sig=t.type+'|'+t.concept+'|'+plain(t.word)+'|'+plain(t.answer);
      if(!used.has(sig)){result.push(t);used.add(sig);}
    }
    // Weinig nieuwe theorie (bv. les 7,17,21) = extra brongebonden herhaling.
    if(result.length<target){
      var base=seededShuffle(result.slice(),seed+901);
      var i=0;while(result.length<target && base.length){
        var t=Object.assign({},base[i%base.length],{repeat:i+1});
        result.push(t);i++;
      }
    }
    // Begin steeds met een regel of ontledingsvraag na de theorie.
    return result.slice(0,target);
  }

  function splitArabic(text) { return plain(text).split(/\s+/).filter(Boolean); }

  function seededShuffle(input, seed) {
    var values = input.slice();
    var number = ((seed || 17) >>> 0) || 1;
    for (var i = values.length - 1; i > 0; i--) {
      number = (Math.imul(number, 1664525) + 1013904223) >>> 0;
      var j = number % (i + 1);
      var swap = values[i]; values[i] = values[j]; values[j] = swap;
    }
    if (values.length > 1 && values.every(function (v, i) { return v === input[i]; })) {
      values.reverse();
    }
    return values;
  }

  function choicesFor(example, all, seed) {
    var others = [...new Set(all.map(function (x) { return plain(x.nl); }))]
      .filter(function (value) { return value !== plain(example.nl); });
    if (!others.length) return null;
    return seededShuffle([plain(example.nl)].concat(seededShuffle(others, seed).slice(0, 2)), seed + 19);
  }

  function makeGap(example, all, seed) {
    var words = splitArabic(example.ar);
    if (words.length < 2 || words.length > 11 || /→/.test(example.ar)) return null;
    var positions = words.map(function (word, i) { return /[\u0600-\u06ff]/.test(word) ? i : -1; })
      .filter(function (i) { return i >= 0; });
    if (!positions.length) return null;
    var missing = positions[(seed + 1) % positions.length];
    var answer = words[missing];
    var candidates = [...new Set(all.reduce(function (acc, x) { return acc.concat(splitArabic(x.ar)); }, []))]
      .filter(function (word) { return word !== answer && /[\u0600-\u06ff]/.test(word) && word.length > 1; });
    if (!candidates.length) return null;
    return {
      type: 'gap', example: example, words: words, missing: missing, answer: answer,
      options: seededShuffle([answer].concat(seededShuffle(candidates, seed + 8).slice(0, 2)), seed + 22)
    };
  }

  function makeOrder(example, seed) {
    var words = splitArabic(example.ar);
    if (words.length < 2 || words.length > 9 || /→/.test(example.ar)) return null;
    return {
      type: 'order', example: example, words: words,
      bank: seededShuffle(words.map(function (_word, i) { return i; }), seed + 13)
    };
  }

  function buildTasks(n) {
    var examples = getExamples(n);
    if (!examples.length) return [];
    var attempts = ['choice', 'order', 'gap', 'choice', 'order', 'gap'];
    var tasks = [], chosenExamples = new Set();
    attempts.forEach(function (kind, step) {
      var candidates = examples.slice();
      var rotated = candidates.slice(step % candidates.length).concat(candidates.slice(0, step % candidates.length));
      var possibilities = rotated.map(function (example, i) {
        var seed = n * 89 + step * 31 + i;
        if (kind === 'choice') {
          var options = choicesFor(example, examples, seed);
          return options ? { type: kind, example: example, options: options } : null;
        }
        if (kind === 'order') return makeOrder(example, seed);
        return makeGap(example, examples, seed);
      }).filter(Boolean);
      if (!possibilities.length) return;
      var picked = possibilities.find(function (task) {
        return !chosenExamples.has(task.example.ar + '\u0000' + task.example.nl);
      }) || possibilities[0];
      tasks.push(picked);
      chosenExamples.add(picked.example.ar + '\u0000' + picked.example.nl);
    });
    if (!tasks.length) tasks.push({ type: 'reflect', example: examples[0] });
    return tasks.slice(0, MAX_TASKS);
  }

  // Beschikbaar voor geautomatiseerde tests
  window.GrammarLabCore = {
    getExamples: getExamples,
    getRules: getRules,
    buildTasks: buildTasks,
    splitArabic: splitArabic,
    choicesFor: choicesFor,
    theoryRows: theoryRows,
    buildTheoryTasks: buildTheoryTasks,
    buildParsingTasks: buildParsingTasks,
    buildStudyTasks: buildStudyTasks
  };

  function storedScores() {
    try {
      return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}') || {};
    } catch (_err) {
      return {};
    }
  }

  function storeScore() {
    try {
      var scores = storedScores();
      scores[session.lesson] = {
        correct: session.correct,
        total: session.tasks.length,
        reviewed: session.review,
        date: new Date().toISOString().slice(0, 10)
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(scores));

      // Mirror naar v2 structuur
      // Dagvoortgang, streak en beheersing (startpagina)
      if (window.GrammarLabHome) {
        window.GrammarLabHome.record({
          lesson: session.lesson, correct: session.correct, total: session.tasks.length,
          xp: session.xp, review: session.review
        });
        session.xp = 0;
        return;
      }
      var v2 = JSON.parse(localStorage.getItem(SAVE_KEY_V2) || '{"items":{},"daily":{},"xp":0,"streak":1}');
      v2.xp = (v2.xp || 0) + session.xp;
      localStorage.setItem(SAVE_KEY_V2, JSON.stringify(v2));
    } catch (_err) {}
  }

  function lessonUrl(n) { return 'index.html#/grammatica/' + n; }

  function introSample(n) {
    var examples = getExamples(n);
    if (!examples.length) return '';
    var first = examples[0];
    return '<div class="gd-intro-example"><span class="gd-small-label">Voorbeeld uit de les</span>' +
      '<p class="gd-arabic" lang="ar" dir="rtl">' + esc(first.ar) + '</p>' +
      '<p class="gd-dutch">' + esc(first.nl) + '</p></div>';
  }

  function rulesHtml(n) {
    var rules = getRules(n);
    if (!rules.length) return '<p class="gd-source-rule">Bekijk de volledige theorie in de originele Medina-les.</p>';
    return rules.map(function (line) {
      return '<p class="gd-source-rule">' + esc(line) + '</p>';
    }).join('');
  }

  var HOUSE = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-7h6v7"/></svg>';

  function topBar() {
    var finished = session.stage === 'done', intro = session.stage === 'intro';
    var total = Math.max(1, session.tasks.length);
    var completed = finished ? total : intro ? 0 : session.index;
    var percent = Math.round(100 * completed / total);
    return '<div class="gd-lesson-bar">' +
      '<button type="button" class="gd-home" data-action="overview" aria-label="Naar het startscherm" title="Startscherm">' + HOUSE + '</button>' +
      '<div class="gd-progress-wrap"><div class="gd-progress-title">' +
      '<strong>Les ' + session.lesson + '</strong><span>' + (finished ? 'Afgerond' : intro ? 'Voorbereiding' : (completed + 1) + ' / ' + total) +
      '</span></div><div class="gd-progress" role="progressbar" aria-label="Voortgang oefenronde" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + percent + '">' +
      '<span style="width:' + percent + '%"></span></div></div>' +
      '<div class="gd-bar-hearts" aria-label="Harten">' + '❤️'.repeat(Math.max(1, session.hearts)) + '</div>' +
      '<a class="gd-source-link" href="' + lessonUrl(session.lesson) + '">Originele les</a></div>';
  }

  function overview() {
    return window.GrammarLabHome ? window.GrammarLabHome.view() : legacyOverview();
  }

  function legacyOverview() {
    var scores = storedScores();
    var keys = Object.keys(DATA).map(Number).sort(function (a, b) { return a - b; });
    var totalXP = 0;
    try {
      var v2 = JSON.parse(localStorage.getItem(SAVE_KEY_V2) || '{}');
      totalXP = v2.xp || 0;
    } catch (_e) {}

    return '<div class="gd-shell gd-overview">' +
      '<div class="gd-hero">' +
        '<div class="gd-eyebrow">Medina-methode · interactieve proefversie</div>' +
        '<h1>Grammatica Lab</h1>' +
        '<p>Oefen de Medina-grammatica in korte interactieve stappen met directe feedback en geluid.</p>' +
        '<div class="gd-hero-key">' +
          '<span>📖 1. Bekijk de regel</span>' +
          '<span>✍️ 2. Oefen de zin</span>' +
          '<span>🔄 3. Herhaal direct</span>' +
        '</div>' +
      '</div>' +
      '<div class="gd-overview-top">' +
        '<h2>Kies een les (Les 0 t/m 23)</h2>' +
        '<p>Elke les gebruikt uitsluitend de originele Medina-voorbeelden en regels.</p>' +
      '</div>' +
      '<div class="gd-lesson-grid">' + keys.map(function (n) {
        var count = getExamples(n).length;
        var score = scores[n];
        var scoreLabel = score ? 'Laatst geoefend: ' + score.correct + '/' + score.total : count ? count + ' voorbeeld' + (count === 1 ? '' : 'en') : 'Alleen originele uitleg';
        return '<a class="gd-lesson-card gd-node" href="grammatica-test.html?les=' + n + '">' +
          '<span class="gd-lesson-number">' + n + '</span>' +
          '<span class="gd-lesson-detail"><strong>Les ' + n + '</strong><small>' + esc(scoreLabel) + '</small></span>' +
          '<span class="gd-card-arrow" aria-hidden="true">→</span></a>';
      }).join('') + '</div>' +
      '<p class="gd-privacy-note">Dit is een losse proefpagina. Je bestaande voortgang in Al-Mufrodat blijft ongewijzigd.</p>' +
    '</div>';
  }

  function intro() {
    var n = session.lesson;
    var exercises = session.tasks.length;
    return '<div class="gd-shell gd-play">' + topBar() +
      '<div class="gd-card gd-intro">' +
        '<div class="gd-stage-tag">Eerst de theorie</div>' +
        '<h1>Les ' + n + '</h1>' +
        '<p class="gd-support">Lees de regels en bekijk het voorbeeld. Daarna oefen je de theorie en zinsontleding.</p>' +
        '<div class="gd-source-box gd-theory-reading">' + rulesHtml(n) + '</div>' + introSample(n) +
        (exercises ?
          '<p class="gd-intro-bottom">Nu volgen ' + exercises + ' korte oefening' + (exercises === 1 ? '' : 'en') + ' met de oorspronkelijke voorbeeldzinnen.</p>' +
          '<button type="button" class="gd-primary gd-full" data-action="start">Start oefenen <span aria-hidden="true">→</span></button>' :
          '<p class="gd-intro-bottom">Deze les heeft geen afzonderlijke Arabisch–Nederlandse voorbeelden om er betrouwbare automatische vragen van te maken. Er is daarom geen oefentoets verzonnen.</p>' +
          '<a class="gd-primary gd-full gd-as-link" href="' + lessonUrl(n) + '">Lees de oorspronkelijke les ' + n + ' →</a>') +
      '</div></div>';
  }

  function currentTask() { return session.tasks[session.index]; }

  function renderTaskBody(task) {
    var type = task.type, ex = task.example;
    if (type === 'theory' || type === 'parse') {
      return (type === 'parse' ? '<div class="gd-ar-question gd-arabic" lang="ar" dir="rtl">'+splitArabic(ex.ar).map(function(w){return w===task.word?'<mark class="gd-parse-word">'+esc(w)+'</mark>':esc(w);}).join(' ')+'</div><p class="gd-subinstruction">Welke grammaticale functie heeft het gemarkeerde woord?</p>' : '<p class="gd-theory-question">'+esc(task.prompt)+'</p>')+
        '<div class="gd-options">'+task.options.map(function(option,i){var picked=session.chosen===i;return '<button type="button" class="gd-option'+(picked?' selected':'')+'" data-action="select" data-value="'+i+'" aria-pressed="'+picked+'" '+(session.feedback?'disabled':'')+'>'+esc(option)+'</button>';}).join('')+'</div>';
    }
    if (type === 'choice') {
      return '<div class="gd-ar-question gd-arabic" lang="ar" dir="rtl">' + esc(ex.ar) + '</div>' +
        '<div class="gd-options">' + task.options.map(function (option, i) {
          var isPicked = session.chosen === i;
          return '<button type="button" class="gd-option' + (isPicked ? ' selected' : '') +
            '" data-action="select" data-value="' + i + '" ' + (session.feedback ? 'disabled' : '') +
            ' aria-pressed="' + isPicked + '">' + esc(option) + '</button>';
        }).join('') + '</div>';
    }
    if (type === 'gap') {
      var sentence = task.words.map(function (word, i) {
        return i === task.missing ? '<span class="gd-gap-slot">______</span>' : esc(word);
      }).join(' ');
      return '<div class="gd-ar-question gd-arabic gd-gap-question" lang="ar" dir="rtl">' + sentence + '</div>' +
        '<p class="gd-subinstruction">Kies het juiste ontbrekende woord:</p>' +
        '<div class="gd-options gd-options-tiles">' + task.options.map(function (option, i) {
          var isPicked = session.chosen === i;
          return '<button type="button" class="gd-option gd-option-ar' + (isPicked ? ' selected' : '') +
            '" data-action="select" data-value="' + i + '" ' + (session.feedback ? 'disabled' : '') +
            ' aria-pressed="' + isPicked + '" lang="ar" dir="rtl">' + esc(option) + '</button>';
        }).join('') + '</div>';
    }
    if (type === 'order') {
      var built = session.ordered.map(function (id) {
        return '<button type="button" class="gd-tile placed" data-action="remove" data-value="' + id + '" ' +
          (session.feedback ? 'disabled' : '') + ' lang="ar" dir="rtl">' + esc(task.words[id]) + '</button>';
      }).join('');
      var bank = task.bank.map(function (id) {
        var used = session.ordered.indexOf(id) >= 0;
        return '<button type="button" class="gd-tile' + (used ? ' used' : '') +
          '" data-action="tile" data-value="' + id + '" ' + (used || session.feedback ? 'disabled' : '') +
          ' lang="ar" dir="rtl">' + esc(task.words[id]) + '</button>';
      }).join('');
      return '<div class="gd-order-prompt">' + esc(ex.nl) + '</div>' +
        '<div class="gd-order-slots" lang="ar" dir="rtl">' + (built || '<span class="gd-placeholder">Tik op de woorden in de juiste volgorde…</span>') + '</div>' +
        '<div class="gd-bank" lang="ar" dir="rtl">' + bank + '</div>';
    }
    return '<div class="gd-ar-question gd-arabic" lang="ar" dir="rtl">' + esc(ex.ar) + '</div>' +
      '<div class="gd-reflect-reveal">' +
      (session.feedback ? '<p class="gd-revealed-text">' + esc(ex.nl) + '</p>' :
        '<button type="button" class="gd-secondary" data-action="reveal">Toon betekenis</button>') +
      '</div>';
  }

  function answered() {
    var task = currentTask();
    if (!task) return false;
    if (['choice','gap','theory','parse'].includes(task.type)) return session.chosen >= 0;
    if (task.type === 'order') return session.ordered.length === task.words.length;
    return true;
  }

  function taskScreen() {
    var task = currentTask();
    if (!task) return finished();
    var canCheck = answered();
    var prompts = {
      theory: 'Pas de grammaticaregel toe',
      parse: 'Ontleed de Arabische zin',
      choice: 'Wat betekent deze Arabische zin?',
      gap: 'Vul het ontbrekende woord in',
      order: 'Zet de woorden in de juiste volgorde',
      reflect: 'Probeer de zin zelf te begrijpen'
    };
    return '<div class="gd-shell gd-play">' + topBar() +
      '<div class="gd-card gd-task">' +
      '<div class="gd-stage-tag">' + (session.review ? 'Herhaling' : 'Oefening ' + (session.index + 1) + ' van ' + session.tasks.length) + '</div>' +
      '<h2 class="gd-task-title">' + (prompts[task.type] || 'Oefening') + '</h2>' +
      renderTaskBody(task) +
      '<div class="gd-task-actions">' +
      (!session.feedback && task.type !== 'reflect' ?
        '<button type="button" class="gd-primary gd-full" data-action="check" ' + (canCheck ? '' : 'disabled') + '>Controleer</button>' : '') +
      (!session.feedback && task.type === 'reflect' ?
        '<button type="button" class="gd-primary gd-full" data-action="reveal">Toon antwoord</button>' : '') +
      (session.feedback && task.type === 'reflect' && session.feedback.correct === null ?
        '<div class="gd-rate-row">' +
          '<button type="button" class="gd-soft" data-action="rate" data-value="0">Nog lastig</button>' +
          '<button type="button" class="gd-primary" data-action="rate" data-value="1">Ik wist het</button>' +
        '</div>' : '') +
      '</div>' +
      taskFeedback(task) +
      '</div></div>';
  }

  function taskFeedback(task) {
    if (!session.feedback || session.feedback.correct === null) return '';
    var good = session.feedback.correct;
    return '<section class="gd-feedback gd-feedback-sheet ' + (good ? 'good' : 'review') + '" role="status" aria-live="assertive">' +
      '<div class="gd-feedback-inner">' +
      '<strong>' + (good ? 'Goed!' : 'Juiste antwoord:') + '</strong>' +
      (good ? '' : '<p class="gd-feedback-correct-label">Dit is het juiste antwoord:</p>') +
      (task.example ? '<p class="gd-arabic" lang="ar" dir="rtl">' + esc(task.example.ar) + '</p>' : '') +
      (task.example ? '<p class="gd-dutch-answer">' + esc(task.example.nl) + '</p>' : '') +
      (task.rule ? '<p class="gd-theory-explanation">'+esc(task.rule)+'</p>' : '') +
      '<button type="button" class="gd-primary gd-full" data-action="next">Volgende <span aria-hidden="true">→</span></button>' +
      '</div></section>';
  }

  function finished() {
    var total = session.tasks.length;
    var missed = session.missed.length;
    var nextN = (session.lesson !== null && session.lesson < 23) ? session.lesson + 1 : null;
    return '<div class="gd-shell gd-play">' + topBar() +
      '<div class="gd-card gd-finish"><span class="gd-finish-icon" aria-hidden="true">🏆</span>' +
      '<div class="gd-stage-tag">Oefenronde afgerond</div>' +
      '<h1>Goed gewerkt met les ' + session.lesson + '</h1>' +
      '<p>Je hebt ' + session.correct + ' van de ' + total + ' opdrachten goed beantwoord.' +
      (session.review ? ' Dit was een herhalingsronde.' : '') + '</p>' +
      (missed ? '<div class="gd-remaining">' + missed + ' opdracht' + (missed === 1 ? '' : 'en') +
        ' om nog eens te proberen.</div>' : '<div class="gd-remaining done">Je hebt alle vragen van deze les correct beantwoord!</div>') +
      '<div class="gd-finish-actions">' +
      (missed ? '<button type="button" class="gd-primary gd-full" data-action="retry">Herhaal mijn fouten (' + missed + ')</button>' : '') +
      (nextN !== null ? '<a class="gd-primary gd-full gd-as-link" href="grammatica-test.html?les=' + nextN + '">Volgende: Les ' + nextN + ' →</a>' : '') +
      '<button type="button" class="gd-soft gd-full" data-action="restart">Oefen les ' + session.lesson + ' opnieuw</button>' +
      '<a class="gd-outline-link" href="' + lessonUrl(session.lesson) + '">Naar de volledige theorie van Les ' + session.lesson + '</a>' +
      '<button type="button" class="gd-link-button" data-action="overview">Alle lessen bekijken</button>' +
      '</div></div></div>';
  }

  function render() {
    if (!app) return;
    var home = session.stage === 'overview' && !!window.GrammarLabHome;
    if (document.body && document.body.classList) {
      document.body.classList.toggle('lh-on', home);
      document.body.classList.add('lh-skin');
    }
    app.innerHTML = session.stage === 'overview' ? overview() :
      session.stage === 'intro' ? intro() :
      session.stage === 'done' ? finished() : taskScreen();
    if (home) window.GrammarLabHome.afterRender();
    else if (window.scrollTo && session.stage !== 'play') { try { window.scrollTo(0, 0); } catch (_e) {} }
  }

  // Koppeling met de startpagina (grammatica-test-home.js)
  window.GrammarLabEngine = {
    refresh: render,
    isHome: function () { return session.stage === 'overview'; },
    open: function (n, mode) {
      setLesson(n);
      if (!session.tasks.length) {
        if (window.GrammarLabHome) window.GrammarLabHome.markRead(n);
      } else if (mode === 'start') {
        session.stage = 'play';
        render();
      }
    }
  };

  function setLesson(n) {
    if (!Object.prototype.hasOwnProperty.call(DATA, n)) { session.stage = 'overview'; render(); return; }
    session.lesson = Number(n);
    session.tasks = buildStudyTasks(session.lesson,(Math.random()*0xffffffff)>>>0);
    session.index = 0;
    session.correct = 0;
    session.missed = [];
    session.lastMissed = [];
    session.chosen = -1;
    session.ordered = [];
    session.feedback = null;
    session.review = false;
    session.xp = 0;
    session.stage = 'intro';
    render();
  }

  function check() {
    if (!answered() || session.feedback) return;
    var task = currentTask();
    var correct = false;
    if (task.type === 'theory' || task.type === 'parse') correct = task.options[session.chosen] === task.answer;
    if (task.type === 'choice') correct = task.options[session.chosen] === plain(task.example.nl);
    if (task.type === 'gap') correct = task.options[session.chosen] === task.answer;
    if (task.type === 'order') {
      correct = session.ordered.map(function (idx) { return task.words[idx]; }).join(' ') === task.words.join(' ');
    }
    session.feedback = { correct: correct };
    if (correct) {
      session.correct++;
      session.combo++;
      session.xp += 10;
    } else {
      session.combo = 0;
      session.hearts = Math.max(1, session.hearts - 1);
      session.missed.push(task);
    }
    render();
  }

  function next() {
    session.index++;
    session.chosen = -1;
    session.ordered = [];
    session.feedback = null;
    if (session.index >= session.tasks.length) {
      session.stage = 'done';
      storeScore();
    }
    render();
  }

  function onClick(event) {
    var node = event.target.closest('[data-action]');
    if (!node) return;
    var action = node.getAttribute('data-action');
    if (action === 'overview') {
      if (session.stage === 'play' && !window.confirm('Weet je het zeker? Je voortgang van deze ronde gaat verloren.')) return;
      if (window.GrammarLabHome) window.GrammarLabHome.enter();
      session.stage = 'overview';
      if (history.replaceState) history.replaceState(null, '', 'grammatica-test.html');
      return render();
    }
    if (action === 'start') { session.stage = 'play'; return render(); }
    if (action === 'select' && !session.feedback) {
      session.chosen = Number(node.getAttribute('data-value')); return render();
    }
    if (action === 'tile' && !session.feedback) {
      var idx = Number(node.getAttribute('data-value'));
      if (session.ordered.indexOf(idx) < 0) session.ordered.push(idx);
      return render();
    }
    if (action === 'remove' && !session.feedback) {
      session.ordered = session.ordered.filter(function (id) { return id !== Number(node.getAttribute('data-value')); });
      return render();
    }
    if (action === 'check') return check();
    if (action === 'reveal' && !session.feedback) {
      session.feedback = { correct: null }; return render();
    }
    if (action === 'rate' && session.feedback && session.feedback.correct === null) {
      var good = node.getAttribute('data-value') === '1';
      session.feedback.correct = good;
      if (good) {
        session.correct++;
        session.xp += 10;
      } else {
        session.missed.push(currentTask());
      }
      return render();
    }
    if (action === 'next' && session.feedback) return next();
    if (action === 'retry') {
      session.tasks = session.missed.slice();
      session.missed = [];
      session.correct = 0;
      session.index = 0;
      session.chosen = -1;
      session.ordered = [];
      session.feedback = null;
      session.review = true;
      session.stage = 'play';
      return render();
    }
    if (action === 'restart') return setLesson(session.lesson);
  }

  function init() {
    app = document.getElementById('gd-app');
    if (!app) return;
    app.addEventListener('click', onClick);
    if (window.GrammarLabHome) window.GrammarLabHome.mount(app, window.GrammarLabEngine);
    var requested = new URLSearchParams(location.search).get('les');
    if (requested !== null && /^\d+$/.test(requested) && Object.prototype.hasOwnProperty.call(DATA, requested)) {
      setLesson(Number(requested));
    } else render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
