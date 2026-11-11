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
    var seen=new Set();
    return ((DATA[n] && DATA[n].inhoud)||[]).filter(function(r){
      var k=plain(r.ar)+'|'+plain(r.nl);
      if(r.type!=='voorbeeld' || !plain(r.ar) || /^(?:\-|voorbeeld:?)$/i.test(plain(r.ar)) || seen.has(k))return false;
      seen.add(k);return true;
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
    // Les 0: diakritische tekens worden letterlijk uit de vijf bronregels gebruikt.
    if(n===0){
      var symbols=rules.map(function(r){
        var m=/«([^»]*◌[^»]*)»/.exec(r),label=/^\d+\.\s*([^\s]+)/.exec(r);
        return m&&label?{symbol:m[1],label:label[1],rule:r}:null;
      }).filter(Boolean);
      symbols.forEach(function(t,i){
        var opts=makeOptions(t.symbol,symbols.map(function(s){return s.symbol;}),seed+i*19,4);
        tasks.push({type:'theory',lesson:n,prompt:'Welk teken hoort bij '+t.label+'?',context:t.label,
          answer:t.symbol,options:opts,rule:t.rule,concept:'teken:'+t.label});
      });
    }
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
    // Waarom-vragen met specifieke Arabische woorden: het antwoord is
    // letterlijk de onderbouwende regel uit de betreffende Medina-les.
    var reasonsByLesson={
      4:[['Na een voorzetsel (Harf Djarr)','Waarom verandert de uitgang na een voorzetsel in een kasrah?','فِي الْبَيْتِ','voorzetsel']],
      5:[['b. De Moedaaf Ilaih is genitief','Waarom is بِلَالٍ Madjroer in كِتَابُ بِلَالٍ?','كِتَابُ بِلَالٍ','Moedaaf Ilaih']],
      8:[['Het verandert in een “-ie”','Waarom verandert een naamwoord na een voorzetsel naar de -ie-uitgang?','بِلَالٌ فِي الْبَيْتِ.','naamval']],
      9:[['Het bijvoeglijk naamwoord heeft dezelfde naamval','Waarom krijgt جَدِيْدٍ dezelfde naamval als بَيْتٍ?','أَنَا فِيْ بَيْتٍ جَدِيْدٍ.','Na‘t']],
      11:[['Het lijdend voorwerp van een werkwoord is accusatief','Waarom eindigt het lijdend voorwerp in أُحِبُّ اللّٰهَ op een -a?','أُحِبُّ اللّٰهَ.','lijdend voorwerp']],
      15:[['Ze zijn altijd Moedaaf','Waarom is الدَّرْسِ genitief na بَعْدَ?','بَعْدَ الدَّرْسِ','Moedaaf Ilaih']],
      18:[['Merk op dat het naamwoord dat na «كَمْ» komt','Waarom staat كِتَابًا na كَمْ in de accusatief?','كَمْ كِتَابًا؟','Mansoeb']],
      19:[['Merk op dat de Ma‘doed in het meervoud staat','Waarom is كُتُبٍ genitief bij ثَلَاثَةُ?','ثَلَاثَةُ كُتُبٍ','Ma‘doed']],
      20:[['Nu, als de Ma‘doed vrouwelijk is','Waarom valt de Taa’ Marboetah weg bij het getal voor een vrouwelijke Ma‘doed?','عَشْرُ نِسَاءٍ','Ma‘doed']],
      23:[['Merk op dat een diptoot in deze twee situaties','Waarom krijgt een diptoot Fathah in plaats van Kasrah in de genitief?',null,'diptoten']]
    };
    (reasonsByLesson[n]||[]).forEach(function(spec){
      var proof=rules.find(function(r){return r.includes(spec[0]);});
      if(!proof)return;
      var ex=spec[2] ? sourceExamples(n).find(function(e){return plain(e.ar)===spec[2];}) : null;
      candidates.unshift({rule:proof,prompt:spec[1],context:ex?plain(ex.ar):'Les '+n,
        example:ex||null,answer:proof,concept:'waarom:'+spec[3]});
    });
    // Alle afleiders zijn ook authentieke, elders aangehaalde regels of redenen.
    var all=Object.keys(DATA).map(Number).flatMap(function(k){return theoryPool(k);});
    var reasons=candidates.map(function(c){return c.answer;}).concat(all.filter(function(x){return x.length>22&&x.length<310;}));
    return seededShuffle(candidates,seed).map(function(c,i){
      return {type:'why',lesson:n,prompt:c.prompt,context:c.context,example:c.example||null,answer:c.answer,
        options:makeOptions(c.answer,reasons,seed+i*19,3),rule:c.rule,concept:c.concept};
    }).filter(function(t){return t.options.length>=2;});
  }
  function sourceParse(n,seed) {
    var rows=sourceExamples(n), rules=theoryPool(n),tasks=[];
    function roleTask(ex,word,role,proof,concept) {
      if(!proof)return;
      var parts=splitArabic(ex.ar);
      var index=parts.findIndex(function(t){return plain(t)===plain(word);});
      if(index<0)index=parts.findLastIndex(function(t){return normalizeArabic(t)===normalizeArabic(word);});
      if(index<0)return;
      var roles=['Moedaaf','Moedaaf Ilaih','Harf Djarr','Na‘t','Man‘oet','Ma‘doed','Madjroer','Marfoe‘','Mansoeb','predicaat','lijdend voorwerp','vrouwelijk enkelvoud'];
      tasks.push({type:'parse',lesson:n,example:ex,wordIndex:index,word:parts[index],
        prompt:role==='vrouwelijk enkelvoud'?'Welke vorm heeft dit woord bij het irrationele meervoud?':(['Mansoeb','Madjroer','Marfoe‘'].includes(role)?'Welke naamval heeft het gemarkeerde woord?':'Welke grammaticale functie heeft het gemarkeerde woord?'),answer:role,
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
          if(['في','فيْ','من','على','إلى'].includes(normalizeArabic(w)))roleTask(ex,w,'Harf Djarr',proof,'Harf Djarr');
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

    if(n===8 && rules.some(function(r){return r.includes('predicaat') && r.includes('هٰذَا الْكِتَابُ');})){
      var proof=sourceRule(n,'predicaat');
      rows.filter(function(ex){return plain(ex.ar)==='هٰذَا الْكِتَابُ جَدِيْدٌ.';}).forEach(function(ex){
        roleTask(ex,'جَدِيْدٌ.','predicaat',proof,'predicaat');
      });
    }
    if(n===11 && rules.some(function(r){return r.includes('lijdend voorwerp')&&r.includes('accusatief');})){
      var proof=sourceRule(n,'Het lijdend voorwerp');
      rows.filter(function(ex){
        return ['أُحِبُّ اللّٰهَ.','أُحِبُّ الرَّسُوْلَ.','أَتُحِبُّ اللّٰهَ؟','أَتُحِبُّ لُغَتَكَ؟'].includes(plain(ex.ar));
      }).forEach(function(ex){
        var words=splitArabic(ex.ar);if(words.length===2)roleTask(ex,words[1],'lijdend voorwerp',proof,'lijdend voorwerp');
      });
    }
    if(n===14 && rules.some(function(r){return r.includes('«بَيْتُ» de Moedaaf');})){
      var proof=sourceRule(n,'«بَيْتُ» de Moedaaf');
      rows.filter(function(ex){return plain(ex.ar)==='بَيْتُ الْإِمَامِ الْجَدِيْدُ.';}).forEach(function(ex){
        roleTask(ex,'بَيْتُ','Moedaaf',proof,'Moedaaf');
      });
    }
    if(n===15 && rules.some(function(r){return r.includes('«قَبْلَ»')&&r.includes('Moedaaf');})){
      var proof=sourceRule(n,'«قَبْلَ»');
      rows.filter(function(ex){return ['بَعْدَ الدَّرْسِ','قَبْلَ الصَّلَاةِ'].includes(plain(ex.ar));}).forEach(function(ex){
        var words=splitArabic(ex.ar);
        if(words.length===2){
          roleTask(ex,words[0],'Moedaaf',proof,'Moedaaf');
          roleTask(ex,words[1],'Madjroer',proof,'Madjroer');
        }
      });
    }
    if(n===18 && rules.some(function(r){return r.includes('na «كَمْ»')&&r.includes('Mansoeb');})){
      var proof=sourceRule(n,'na «كَمْ»');
      rows.filter(function(ex){return ['كَمْ كِتَابًا؟','كَمْ سَيَّارَةً؟'].includes(plain(ex.ar));}).forEach(function(ex){
        var words=splitArabic(ex.ar);if(words.length===2)roleTask(ex,words[1],'Mansoeb',proof,'Mansoeb');
      });
    }
    if(n===19 && rules.some(function(r){return r.includes('Ma‘doed')&&r.includes('Moedaaf Ilaih');})){
      var proof=sourceRule(n,'Merk op dat de Ma‘doed'),proofNumber=sourceRule(n,'De getallen 3 t/m 10');
      rows.filter(function(ex){return ['ثَلَاثَةُ كُتُبٍ','أَرْبَعَةُ بُيُوْتٍ','خَمْسَةُ أَقْلَامٍ','عَشَرَةُ رِجَالٍ'].includes(plain(ex.ar));}).forEach(function(ex){
        var words=splitArabic(ex.ar);
        if(words.length===2){
          roleTask(ex,words[1],'Ma‘doed',proof,'Ma‘doed');
          roleTask(ex,words[0],'Moedaaf',proofNumber,'Moedaaf');
        }
      });
    }
    if(n===20 && rules.some(function(r){return r.includes('vrouwelijke Ma‘doed');})){
      var proof=sourceRule(n,'vrouwelijke Ma‘doed');
      rows.filter(function(ex){return plain(ex.ar)==='عَشْرُ نِسَاءٍ';}).forEach(function(ex){
        roleTask(ex,'نِسَاءٍ','Ma‘doed',proof,'Ma‘doed');
      });
    }
    if(n===16 && rules.some(function(r){return r.includes('irrationele naamwoorden wordt behandeld als vrouwelijk enkelvoud');})){
      var proof=sourceRule(n,'meervoud van irrationele naamwoorden wordt behandeld');
      rows.filter(function(ex){return plain(ex.ar)==='هٰذِهِ كُتُبٌ جَدِيْدَةٌ، هِيَ صَغِيْرَةٌ.';}).forEach(function(ex){
        roleTask(ex,'هٰذِهِ','vrouwelijk enkelvoud',proof,'irrationeel meervoud');
      });
    }
    if(n===23 && rules.some(function(r){return r.includes('Moedaaf Ilaih');})){
      var proof=sourceRule(n,'Moedaaf Ilaih');
      rows.filter(function(ex){return ['بِلَالٌ → بِنْتُ بِلَالٍ','الْمُدَرِّسُ → كِتَابُ الْمُدَرِّسِ'].includes(plain(ex.ar));}).forEach(function(ex){
        var words=splitArabic(ex.ar),target=words[words.length-1];
        roleTask(ex,target,'Moedaaf Ilaih',proof,'Moedaaf Ilaih');
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
          if(index<0)index=words.findIndex(function(w){
            var nw=normalizeArabic(w),nq=normalizeArabic(q);
            return nw==='و'+nq || nw==='ف'+nq;
          });
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
    var other=seededShuffle(legacy.filter(function(t){return t.type!=='reflect';}),seed+577).map(function(t){return Object.assign({lesson:n,concept:'voorbeeld:'+plain(t.example.ar)},t);});
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
    buildParsingTasks: sourceParse,
    buildWhyTasks: buildWhyTasks,
    buildFindTasks: buildFindTasks,
    buildStudyTasks: buildStudyTasks
  };


  // Gescheiden leerdata: de echte app en het originele Medina-materiaal zijn read-only.
  function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function addDays(day,amount){var p=day.split('-').map(Number),d=new Date(p[0],p[1]-1,p[2]+amount);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function weekOf(day){var p=day.split('-').map(Number),d=new Date(p[0],p[1]-1,p[2]);d.setDate(d.getDate()-(d.getDay()+6)%7);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function readSave(){
    var d={items:{},concepts:{},daily:{},xp:0,goal:20,streak:0,freezeWeeks:{},lastGoalDay:''};
    try {
      var raw=JSON.parse(localStorage.getItem(SAVE_KEY_V2)||'null');
      if(raw && typeof raw==='object')Object.assign(d,raw);
      else {
        d.legacyScores=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')||{};
        localStorage.setItem(SAVE_KEY_V2,JSON.stringify(d));
      }
    } catch(_err){}
    d.items=d.items&&typeof d.items==='object'?d.items:{};
    d.concepts=d.concepts&&typeof d.concepts==='object'?d.concepts:{};
    d.daily=d.daily&&typeof d.daily==='object'?d.daily:{};
    // Neem XP-dagen uit de oude startpagina over wanneer de nieuwe opslag nog leeg is.
    if(!Object.keys(d.daily).length && d.days && typeof d.days==='object')d.daily=Object.assign({},d.days);
    d.freezeWeeks=d.freezeWeeks&&typeof d.freezeWeeks==='object'?d.freezeWeeks:{};
    d.goal=[20,30,50].includes(Number(d.goal))?Number(d.goal):20;
    try{
      var homeSettings=JSON.parse(localStorage.getItem('alm_grammar_test_settings_v1')||'{}');
      if([20,30,50].includes(Number(homeSettings.goal)))d.goal=Number(homeSettings.goal);
    }catch(_err){}
    return d;
  }
  function syncLegacyHome(d){
    // De originele startpagina verwacht lesvoortgang, dagen en hit-dagen in
    // dezelfde v2-opslag. Laat de nieuwe per-woord- en conceptdata intact.
    d.items=d.items||{};
    d.days=Object.assign({},d.days||{},d.daily||{});
    d.hit=Array.isArray(d.hit)?d.hit:[];
    Object.keys(d.days).forEach(function(day){
      if(d.days[day]>=d.goal && !d.hit.includes(day))d.hit.push(day);
    });
    d.hit.sort();
    d.perfectDay=d.perfectDay||{};
    d.best=Math.max(Number(d.best)||0,Number(d.streak)||0);
    Object.keys(DATA).forEach(function(key){
      var n=Number(key),current=d.items[key]||{m:0,rounds:0};
      var level=lessonCrowns(n,d);
      if(level>Number(current.m||0))current.m=level;
      if(current.m>0 && !current.last)current.last=today();
      d.items[key]=current;
    });
  }
  function writeSave(d){
    syncLegacyHome(d);
    try{localStorage.setItem(SAVE_KEY_V2,JSON.stringify(d));}catch(_err){}
  }
  function exampleKey(n,ar){return n+'|'+plain(ar);}
  function conceptKey(t){return t.lesson+'|'+plain(t.concept || t.type);}
  function scoreItem(task,data){
    var key=task.example && plain(task.example.ar) ? exampleKey(task.lesson,task.example.ar) : null;
    return key?(data.items[key]||null):(data.concepts[conceptKey(task)]||null);
  }
  function updateMastery(task,good,data){
    var id=task.example && plain(task.example.ar) ? exampleKey(task.lesson,task.example.ar) : null;
    var bucket=id?data.items:data.concepts;
    var k=id||conceptKey(task),old=bucket[k]||{level:0,misses:0};
    var level=Math.max(0,Math.min(5,(Number(old.level)||0)+(good?1:-1)));
    var intervals=[0,1,3,7,14,30];
    bucket[k]={level:level,due:addDays(today(),good?intervals[level]:0),misses:(old.misses||0)+(good?0:1),last:today()};
    if(task.concept){
      var ck=conceptKey(task),previous=data.concepts[ck]||{level:0,misses:0};
      var cl=Math.max(0,Math.min(5,(Number(previous.level)||0)+(good?1:-1)));
      data.concepts[ck]={level:cl,due:addDays(today(),good?intervals[cl]:0),misses:(previous.misses||0)+(good?0:1),last:today()};
    }
  }
  function refreshStreak(d){
    var days=Object.keys(d.daily).filter(function(x){return d.daily[x]>=d.goal;}).sort();
    var last=days[days.length-1];
    if(!last){d.streak=0;d.lastGoalDay='';return;}
    var count=1,cur=last;
    for(var i=days.length-2;i>=0;i--){
      if(days[i]===addDays(cur,-1)){count++;cur=days[i];continue;}
      var skipped=addDays(cur,-1),wk=weekOf(skipped);
      // Eén gratis gemiste dag per ISO-week, zonder extra streakdag.
      if(days[i]===addDays(cur,-2) && (!d.freezeWeeks[wk]||d.freezeWeeks[wk]===skipped)){
        d.freezeWeeks[wk]=skipped;count++;cur=days[i];continue;
      }
      break;
    }
    d.lastGoalDay=last;
    d.streak=(last===today()||last===addDays(today(),-1))?count:0;
  }
  function lessonCrowns(n,d){
    var examples=getExamples(n);
    var list=examples.map(function(e){return Number((d.items[exampleKey(n,e.ar)]||{}).level)||0;});
    if(!list.length){
      list=Object.keys(d.concepts).filter(function(k){return k.indexOf(n+'|')===0;})
        .map(function(k){return Number(d.concepts[k].level)||0;});
    }
    return list.length ? Math.min(5,Math.round(list.reduce(function(a,b){return a+b;},0)/list.length)) : 0;
  }
  function weakened(n,d){
    return Object.keys(d.items).some(function(k){return k.indexOf(n+'|')===0 && d.items[k].due && d.items[k].due<=today();}) ||
      Object.keys(d.concepts).some(function(k){return k.indexOf(n+'|')===0 && d.concepts[k].due && d.concepts[k].due<=today();});
  }
  function nextLesson(d){
    var keys=Object.keys(DATA).map(Number).sort(function(a,b){return a-b;});
    return keys.find(function(n){return lessonCrowns(n,d)===0;}) ?? keys[0];
  }
  function recordAnswer(task,good){
    var d=readSave();updateMastery(task,good,d);
    session.attempts++;
    if(good){session.correct++;session.combo++;session.bestCombo=Math.max(session.combo,session.bestCombo);
      session.xp+=10;d.xp=(d.xp||0)+10;d.daily[today()]=(d.daily[today()]||0)+10;
    }else{session.combo=0;session.wrong++;session.hearts=Math.max(0,session.hearts-1);
      session.missed.push(task);
    }
    refreshStreak(d);writeSave(d);
  }
  function finishRound(){
    session.stage='done';
    session.lastMissed=session.missed.slice();
    if(session.attempts>0 && session.wrong===0){
      var d=readSave();session.xp+=5;d.xp=(d.xp||0)+5;
      d.daily[today()]=(d.daily[today()]||0)+5;refreshStreak(d);writeSave(d);
    }
    // Het oude leerpad bewaart kronen en leestheorie naast onze nieuwe kenniskaart.
    if(session.lesson!==null){
      var d=readSave(),key=String(session.lesson),it=d.items[key]||{m:0,rounds:0};
      it.m=Math.max(Number(it.m)||0,lessonCrowns(session.lesson,d));
      it.last=today();
      if(!getExamples(session.lesson).length)it.read=true;
      if(!session.review)it.rounds=(Number(it.rounds)||0)+1;
      it.ratio=session.attempts?session.correct/session.attempts:0;
      d.items[key]=it;
      if(!session.wrong&&session.attempts>0)d.perfectDay=Object.assign({},d.perfectDay||{[today()]:true});
      if(!session.wrong&&session.attempts>0)d.perfectDay[today()]=true;
      d.last=session.lesson;
      writeSave(d);
    }
    // Houd het bestaande testcontract van v1 als historische score in stand.
    if(session.lesson!==null){
      try{
        var scores=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')||{};
        scores[session.lesson]={correct:session.correct,total:session.attempts,reviewed:session.review,date:today()};
        localStorage.setItem(SAVE_KEY,JSON.stringify(scores));
      }catch(_err){}
    }
  }
  function lessonUrl(n){return 'index.html#/grammatica/'+n;}
  function svgIcon(name){
    var paths={
      flame:'<path d="M12 22c5 0 8-4 8-8 0-3-2-5-4-7 0 3-2 4-3 5C13 7 11 4 8 2c0 5-4 8-4 12 0 5 3 8 8 8Z"/>',
      star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
      crown:'<path d="m2 7 5 4 5-8 5 8 5-4-2 12H4Z"/>',
      heart:'<path d="M20 5a5 5 0 0 0-7 0l-1 1-1-1a5 5 0 0 0-7 7l8 9 8-9a5 5 0 0 0 0-7Z"/>',
      check:'<path d="m4 12 5 5L20 6"/>',
      book:'<path d="M12 6C9 4 6 4 2 5v15c4-1 7-1 10 1 3-2 6-2 10-1V5c-4-1-7-1-10 1Z"/><path d="M12 6v15"/>',
      home:'<path d="m3 10 9-7 9 7v11H3Z"/><path d="M9 21v-8h6v8"/>'
    };
    return '<svg class="gd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[name]+'</svg>';
  }
  function soundEnabled(){
    try{return JSON.parse(localStorage.getItem('alm_grammar_test_settings_v1')||'{}').sound!==false;}
    catch(_err){return true;}
  }
  function toggleSound(){
    try{
      var key='alm_grammar_test_settings_v1',settings=JSON.parse(localStorage.getItem(key)||'{}');
      settings.sound=!soundEnabled();localStorage.setItem(key,JSON.stringify(settings));
    }catch(_err){}
    render();
  }
  function overview(){
    var d=readSave();refreshStreak(d);
    var pct=Math.min(100,Math.round(100*(d.daily[today()]||0)/d.goal)),current=nextLesson(d);
    var keys=Object.keys(DATA).map(Number).sort(function(a,b){return a-b;});
    return '<div class="gd-shell gd-overview"><div class="gd-stats">'+
      '<span class="gd-stat gd-fire">'+svgIcon('flame')+'<span>'+d.streak+'</span></span>'+
      '<span class="gd-stat gd-xp">'+svgIcon('star')+'<span>'+(d.xp||0)+' XP</span></span>'+
      '<label class="gd-goal"><span class="gd-ring" style="--fill:'+pct+'%">'+pct+'%</span>'+
      '<select aria-label="Dagdoel" data-goal><option value="20"'+(d.goal===20?' selected':'')+'>20 XP</option>'+
      '<option value="30"'+(d.goal===30?' selected':'')+'>30 XP</option>'+
      '<option value="50"'+(d.goal===50?' selected':'')+'>50 XP</option></select></label></div>'+
      '<nav class="gd-path" aria-label="Leerpad">'+keys.map(function(n,i){
        var crowns=lessonCrowns(n,d),weak=weakened(n,d),reading=!getExamples(n).length;
        var cls=reading?'reading':weak?'weak':crowns?'complete':n===current?'current':'open';
        return '<div class="gd-path-row offset-'+(i%4)+'"><a href="grammatica-test.html?les='+n+'" class="gd-node '+cls+(n===current?' active':'')+'" aria-label="Les '+n+', '+crowns+' van 5 kronen">'+
          (n===current?'<span class="gd-start-bubble">START</span>':'')+
          '<span class="gd-node-symbol">'+(reading?svgIcon('book'):crowns?svgIcon('crown'):weak?'◌':svgIcon('star'))+'</span>'+
          '<span class="gd-node-name">Les '+n+'</span>'+
          (crowns?'<span class="gd-crown-count">'+crowns+'/5</span>':'')+
          (reading?'<span class="gd-node-sub">Lees les</span>':'')+'</a></div>';
      }).join('')+'</nav><button type="button" class="gd-weak-button" data-action="weak">Oefen zwakke punten</button>'+
      '<p class="gd-alert" id="gd-home-message" aria-live="polite"></p>'+
      '<button type="button" class="gd-sound-toggle" data-action="sound-toggle" aria-pressed="'+soundEnabled()+'">'+(soundEnabled()?'🔊 Geluid aan':'🔇 Geluid uit')+'</button>'+ 
      '<button type="button" class="gd-reset" data-action="reset">Reset testvoortgang</button>'+
      '<div class="gd-fixed-continue"><a class="gd-primary" href="grammatica-test.html?les='+current+'">Ga verder</a></div></div>';
  }

  function theoryCards(n){
    var items=(DATA[n]&&DATA[n].inhoud)||[],notes=[],cards=[];
    items.forEach(function(item,i){
      var t=plain(item.tekst);
      if(['regel','tekst','kop'].includes(item.type)&&t.length>10 &&
        !/^(?:voorbeelden?:?|merk op:?|les \d+[a-z]?|in deze les leren we het volgende:?|woordenlijst van les)/i.test(t)){
        notes.push({kind:'rule',text:t,index:i});
      }
    });
    for(var i=0;i<notes.length;i+=2){
      var group=notes.slice(i,i+2),card=group.map(function(r){return {kind:'rule',text:r.text};});
      var near=items.map(function(item,j){return {item:item,index:j};}).filter(function(pair){
        return pair.item.type==='voorbeeld'&&plain(pair.item.ar);
      });
      if(near.length){
        var words=quoteTokens(group.map(function(x){return x.text;}).join(' '));
        near.sort(function(x,y){
          function rank(p){
            var same=words.some(function(q){
              return splitArabic(p.item.ar).some(function(w){return normalizeArabic(w)===normalizeArabic(q);});
            });
            return Math.abs(p.index-group[0].index)+(same?-20:0);
          }
          return rank(x)-rank(y);
        });
        card.push({kind:'example',ar:plain(near[0].item.ar),nl:plain(near[0].item.nl)});
      }
      cards.push(card);
    }
    if(!cards.length){
      var examples=sourceExamples(n);
      examples.forEach(function(ex){cards.push([{kind:'example',ar:plain(ex.ar),nl:plain(ex.nl)}]);});
    }
    return cards;
  }
  
    function bar(){
    var theory=session.stage==='theory',end=session.stage==='done';
    var length=theory?Math.max(1,session.theoryCards.length):Math.max(1,session.tasks.length);
    var completed=theory?session.theoryIndex:end?length:session.index;
    var pct=Math.round(100*completed/length);
    return '<div class="gd-lesson-bar">'+
      '<button type="button" data-action="overview" class="gd-home" aria-label="Naar het leerpad">'+svgIcon('home')+'</button>'+
      '<div class="gd-progress-wrap"><div class="gd-progress-title"><strong>Les '+(session.lesson===null?'herhaling':session.lesson)+'</strong>'+
      '<span>'+(theory?'Theorie '+Math.min(length,completed+1)+' / '+length:end?'Afgerond':Math.min(length,completed+1)+' / '+length)+'</span></div>'+
      '<div class="gd-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><span style="width:'+pct+'%"></span></div></div>'+
      '<div class="gd-bar-hearts" aria-label="'+session.hearts+' van 5 hartjes">'+
      Array.from({length:5},function(_,i){return '<span class="'+(i<session.hearts?'alive':'lost')+'">'+svgIcon('heart')+'</span>';}).join('')+'</div></div>';
  }
  function intro(){
    var n=session.lesson,cards=session.theoryCards,p=session.theoryIndex,rows=cards[p]||[];
    var final=p>=cards.length-1;
    return '<div class="gd-shell gd-play">'+bar()+
      '<div class="gd-card gd-intro"><div class="gd-stage-tag">Eerst lezen</div><h1>Les '+n+'</h1>'+
      '<div class="gd-source-box gd-theory-reading">'+rows.map(function(r){
        return r.kind==='example'?
          '<div class="gd-theory-example"><p class="gd-arabic" lang="ar" dir="rtl">'+esc(r.ar)+'</p>'+
          (r.nl&&r.nl!=='-'?'<p>'+esc(r.nl)+'</p>':'')+'</div>':
          '<p class="gd-source-rule">'+esc(r.text)+'</p>';
      }).join('')+'</div>'+
      '<div class="gd-theory-actions">'+(p?'<button class="gd-soft" data-action="theory-prev">Vorige</button>':'')+
      '<button class="gd-primary" data-action="theory-next">'+(final?'Start oefenen':'Verder')+'</button></div>'+
      '<a class="gd-outline-link" href="'+lessonUrl(n)+'">Volledige originele les</a>'+
      '</div></div>';
  }
  function currentTask(){return session.tasks[session.index];}
  function optionsHtml(task,arabic){
    return '<div class="gd-options">'+task.options.map(function(option,i){
      var selected=session.chosen===i;
      return '<button type="button" class="gd-option'+(selected?' selected':'')+'" data-action="select" data-value="'+i+'" aria-pressed="'+selected+'"'+(session.feedback?' disabled':'')+
        (arabic?' lang="ar" dir="rtl"':'')+'><span>'+(i+1)+'.</span> '+esc(option)+'</button>';
    }).join('')+'</div>';
  }
  function sentenceButtons(task){
    return '<div class="gd-sentence-words" lang="ar" dir="rtl" role="group" aria-label="Kies een woord uit de zin">'+
      splitArabic(task.example.ar).map(function(word,i){
        var selected=session.chosenWord===i;
        return '<button type="button" class="gd-word-button'+(selected?' selected':'')+
          '" data-action="word" data-value="'+i+'" aria-pressed="'+selected+'"'+(session.feedback?' disabled':'')+
          '>'+esc(word)+'</button>';
      }).join('')+'</div>';
  }
  function taskBody(task){
    if(['theory','rule','why'].includes(task.type)){
      return (task.context?'<p class="gd-theory-question">'+esc(task.context)+'</p>':'')+optionsHtml(task,task.type==='theory');
    }
    if(task.type==='find'){
      return '<p class="gd-theory-question">'+esc(task.context)+'</p>'+sentenceButtons(task);
    }
    if(task.type==='parse'){
      return '<p class="gd-subinstruction">Kies het woord <span lang="ar" dir="rtl" class="gd-arabic-inline">'+esc(task.word)+'</span> en de juiste functie.</p>'+
        sentenceButtons(task)+optionsHtml(task,false);
    }
    var ex=task.example||{};
    if(task.type==='choice')return '<div class="gd-ar-question gd-arabic" lang="ar" dir="rtl">'+esc(ex.ar)+'</div>'+optionsHtml(task,false);
    if(task.type==='reverse')return '<div class="gd-translation-cue">'+esc(ex.nl)+'</div>'+optionsHtml(task,true);
    if(task.type==='gap'){
      var sentence=task.words.map(function(w,i){return i===task.missing?'______':esc(w);}).join(' ');
      return '<div class="gd-ar-question gd-arabic" lang="ar" dir="rtl">'+sentence+'</div>'+optionsHtml(task,true);
    }
    if(task.type==='order'){
      var built=session.ordered.map(function(id){
        return '<button class="gd-tile placed" data-action="remove" data-value="'+id+'" lang="ar" dir="rtl"'+(session.feedback?' disabled':'')+'>'+esc(task.words[id])+'</button>';
      }).join('');
      var bank=task.bank.map(function(id){
        var used=session.ordered.includes(id);
        return '<button class="gd-tile'+(used?' used':'')+'" data-action="tile" data-value="'+id+'" lang="ar" dir="rtl"'+(used||session.feedback?' disabled':'')+'>'+esc(task.words[id])+'</button>';
      }).join('');
      return '<p class="gd-order-prompt">'+esc(ex.nl)+'</p><div class="gd-order-slots" dir="rtl">'+(built||'Tik op de woorden')+'</div><div class="gd-bank" dir="rtl">'+bank+'</div>';
    }
    return '<p class="gd-ar-question gd-arabic" lang="ar" dir="rtl">'+esc(ex.ar)+'</p>';
  }
  function answered(){
    var t=currentTask();
    if(!t)return false;
    if(t.type==='order')return session.ordered.length===t.words.length;
    if(t.type==='find')return session.chosenWord>=0;
    if(t.type==='parse')return session.chosenWord>=0 && session.chosen>=0;
    if(t.type==='reflect')return true;
    return session.chosen>=0;
  }
  function taskFeedback(task){
    if(!session.feedback)return '';
    var good=session.feedback.correct,headline=good?['Goed!','Prima!','Uitstekend!'][session.index%3]:'Juiste antwoord:';
    var answer=task.type==='parse'?task.word+' — '+task.answer:task.type==='find'?task.word:
      task.type==='order'?plain(task.example.ar):task.type==='gap'?task.answer:task.answer||task.example&&task.example.nl||'';
    return '<section class="gd-feedback gd-feedback-sheet '+(good?'good':'review')+'" role="status" aria-live="assertive">'+
      '<div class="gd-feedback-inner"><strong>'+headline+'</strong>'+
      (session.combo>=3?'<span class="gd-combo">'+session.combo+'× combo</span>':'')+
      '<p class="gd-correct-answer">'+esc(answer)+'</p>'+
      (task.example?'<p class="gd-arabic" lang="ar" dir="rtl">'+esc(task.example.ar)+'</p>'+
      (plain(task.example.nl)&&plain(task.example.nl)!=='-'?'<p>'+esc(task.example.nl)+'</p>':''):'')+
      (task.rule?'<p class="gd-theory-explanation">'+esc(task.rule)+'</p>':'')+
      '<button type="button" class="gd-primary gd-full" data-action="next">Verder</button></div></section>';
  }

  // Offline leshulp: geen externe AI, geen verzonnen grammatica en geen dataverkeer.
  var helper={open:false,history:[],question:''};
  function helperReset(){helper.open=false;helper.history=[];helper.question='';}
  function helperRule(task){
    if(task.rule)return plain(task.rule);
    var rows=theoryRows(task.lesson);
    var needle=plain(task.word||task.example&&task.example.ar||'');
    var match=rows.find(function(r){return needle&&plain(r.tekst).includes(needle);});
    return plain((match||rows[0]||{}).tekst);
  }
  function helperReply(task,question){
    var q=plain(question).toLowerCase(),rule=helperRule(task),answer=plain(task.answer||
      (task.type==='choice'&&task.example&&task.example.nl)||
      (task.type==='reverse'&&task.example&&task.example.ar)||'');
    var ex=task.example,exText=ex&&plain(ex.ar),exNl=ex&&plain(ex.nl);
    if(/(antwoord|oplossing|welke is juist|juiste)/.test(q)){
      return {text:'Het antwoord is: '+(task.type==='find'?plain(task.word):task.type==='order'?exText:answer)+
        (rule?' De bijbehorende regel: '+rule:''),source:true};
    }
    if(/(woord|zin|ontled|functie|moedaaf|madjroer|kasrah|naamval|waarom)/.test(q)){
      if(rule)return {text:(exText?'We kijken naar: '+exText+'. ':'')+
        'Volgens de regel uit Les '+task.lesson+': '+rule+
        (task.type==='parse'?' Het gemarkeerde woord is '+plain(task.word)+'.':''),
        source:true};
    }
    if(/(vertaal|beteken|nederlands)/.test(q)&&exNl&&exNl!=='-'){
      return {text:'De betekenis van de voorbeeldzin is: '+exNl+
        (exText?' ('+exText+')':''),source:true};
    }
    if(/(voorbeeld|toon|laat zien)/.test(q)&&exText){
      return {text:'Voorbeeld uit Les '+task.lesson+': '+exText+
        (exNl&&exNl!=='-'?' — '+exNl:'')+(rule?'. Regel: '+rule:''),source:true};
    }
    if(rule)return {text:'Dit is de relevante uitleg uit Les '+task.lesson+': '+rule+
      ' Vraag gerust naar de betekenis, het voorbeeld of het juiste antwoord.',source:true};
    return {text:'In Les '+task.lesson+' heb ik bij deze vraag geen extra uitleg uit de oorspronkelijke les gevonden. Bekijk de volledige les via de link hieronder.',source:false};
  }
  function helperUI(task){
    return '<div class="gd-help-wrap"><button type="button" class="gd-help-trigger" data-action="help-toggle" aria-expanded="'+helper.open+'" aria-controls="gd-helper-panel">'+
      '<span class="gd-help-avatar" aria-hidden="true">✦</span><span>Ik begrijp het niet</span><span class="gd-help-chevron" aria-hidden="true">'+(helper.open?'−':'+')+'</span></button>'+
      (helper.open?'<section id="gd-helper-panel" class="gd-helper-panel" aria-label="Hulp bij deze vraag">'+
      '<div class="gd-helper-heading"><span class="gd-help-avatar" aria-hidden="true">✦</span><div><strong>Grammatica-hulp</strong><small>Gebaseerd op Les '+task.lesson+' · werkt offline</small></div></div>'+
      '<p class="gd-helper-intro">Stel een vraag over deze oefening. Ik gebruik de oorspronkelijke Medina-uitleg.</p>'+
      '<div class="gd-helper-messages" aria-live="polite">'+helper.history.map(function(m){
        return '<div class="gd-helper-msg '+(m.who==='user'?'from-user':'from-help')+'">'+esc(m.text)+'</div>';
      }).join('')+'</div>'+
      '<div class="gd-helper-suggestions">'+
      '<button type="button" data-action="help-suggest" data-value="Waarom is dit zo?">Waarom is dit zo?</button>'+
      '<button type="button" data-action="help-suggest" data-value="Leg de grammaticale functie uit">Leg de functie uit</button>'+
      '<button type="button" data-action="help-suggest" data-value="Toon een voorbeeld">Toon een voorbeeld</button></div>'+
      '<form class="gd-helper-form" data-helper-form><label for="gd-helper-question" class="gd-visually-hidden">Jouw vraag</label>'+
      '<input id="gd-helper-question" name="question" maxlength="300" autocomplete="off" placeholder="Wat begrijp je niet?" value="'+esc(helper.question)+'">'+
      '<button type="submit" aria-label="Vraag stellen">Stuur</button></form>'+
      '<p class="gd-helper-note">Dit is een lesassistent, geen live AI-chat. Antwoorden komen uit het lesmateriaal.</p>'+
      '<a href="'+lessonUrl(task.lesson)+'" class="gd-helper-link">Bekijk de volledige les</a>'+
      '</section>':'')+'</div>';
  }
  function helperAsk(question){
    var task=currentTask(),q=plain(question).slice(0,300);
    if(!task||!q)return;
    helper.history.push({who:'user',text:q});
    helper.history.push({who:'help',text:helperReply(task,q).text});
    helper.question='';helper.open=true;
    render();
    var box=app.querySelector('.gd-helper-messages');
    if(box)box.scrollTop=box.scrollHeight;
    var input=app.querySelector('#gd-helper-question');
    if(input)input.focus({preventScroll:true});
  }

  function taskScreen(){
    var t=currentTask();if(!t)return finished();
    return '<div class="gd-shell gd-play">'+bar()+
      '<div class="gd-card gd-task"><div class="gd-stage-tag">Oefening '+(session.index+1)+' / '+session.tasks.length+'</div>'+
      '<h1>Les '+t.lesson+'</h1><h2 class="gd-task-title">'+esc(t.prompt || (
        t.type==='choice'?'Wat betekent deze zin?':
        t.type==='reverse'?'Kies de Arabische zin.':
        t.type==='gap'?'Welk woord ontbreekt?':
        t.type==='order'?'Zet de woorden op volgorde.':'Beantwoord de vraag.'))+'</h2>'+
      taskBody(t)+helperUI(t)+
      '<div class="gd-task-actions"><button type="button" class="gd-primary gd-full" data-action="check"'+(answered()?'':' disabled')+'>Controleren</button></div>'+
      '</div>'+taskFeedback(t)+'</div>';
  }
  function finished(){
    var d=readSave(),accuracy=session.attempts?Math.round(100*session.correct/session.attempts):0;
    return '<div class="gd-shell gd-play">'+bar()+
      '<div class="gd-card gd-finish"><span class="gd-finish-icon">'+svgIcon('crown')+'</span>'+
      '<h1>Les '+(session.lesson===null?'herhaling':session.lesson)+'</h1>'+
      '<div class="gd-result-grid"><span><strong class="gd-countup" data-target="'+session.xp+'">0</strong><small>XP</small></span>'+
      '<span><strong>'+accuracy+'%</strong><small>Nauwkeurigheid</small></span>'+
      '<span><strong>'+d.streak+'</strong><small>Streak</small></span>'+
      '<span><strong>'+(session.lesson===null?'—':lessonCrowns(session.lesson,d)+'/5')+'</strong><small>Kronen</small></span></div>'+
      '<p>'+session.correct+' van de '+session.attempts+' antwoorden juist.</p>'+
      '<div class="gd-finish-actions"><button class="gd-primary gd-full" data-action="continue">Doorgaan</button>'+
      '<button class="gd-soft gd-full" data-action="retry"'+(session.lastMissed.length?'':' disabled')+'>Herhaal fouten ('+session.lastMissed.length+')</button></div></div></div>';
  }
  function render(){
    if(!app)return;
    var home=session.stage==='overview',oldHome=window.GrammarLabHome;
    if(document.body&&document.body.classList){
      document.body.classList.toggle('lh-on',home&&!!oldHome);
      document.body.classList.toggle('lh-skin',!home&&!!oldHome);
    }
    if(home&&oldHome){
      var d=readSave();syncLegacyHome(d);writeSave(d);
      app.innerHTML=oldHome.view();
      oldHome.afterRender();
    } else {
      app.innerHTML=home?overview():session.stage==='theory'?intro():session.stage==='done'?finished():taskScreen();
    }
    if(session.stage==='done'){
      var counter=app.querySelector('.gd-countup');
      if(counter){
        var target=Number(counter.dataset.target);
        if(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches)counter.textContent=target;
        else {
          var started=performance.now();
          function tick(now){if(!counter.isConnected)return;var p=Math.min(1,(now-started)/650);counter.textContent=Math.round(target*p);if(p<1)requestAnimationFrame(tick);}
          requestAnimationFrame(tick);
        }
      }
    }
    if(session.feedback){
      var next=app.querySelector('[data-action="next"]');
      if(next)next.focus({preventScroll:true});
    } else if(session.stage==='play'){
      var selected=app.querySelector('[data-action="word"][aria-pressed="true"]') ||
        app.querySelector('[data-action="select"][aria-pressed="true"]');
      if(selected)selected.focus({preventScroll:true});
    }
  }
  function startSession(lesson,tasks,mode){
    session.lesson=lesson;session.tasks=tasks;session.index=0;session.stage=mode==='weak'?'play':'theory';
    session.theoryCards=lesson===null?[]:theoryCards(lesson);session.theoryIndex=0;
    session.chosen=-1;session.chosenWord=-1;session.ordered=[];
    helperReset();
    session.feedback=null;session.correct=0;session.wrong=0;session.attempts=0;session.hearts=5;
    session.combo=0;session.bestCombo=0;session.xp=0;session.missed=[];session.lastMissed=[];
    session.review=mode==='weak';session.queued=false;
    if(!session.theoryCards.length && mode!=='weak')session.stage='play';
    render();
  }
  function setLesson(n){
    if(!Object.prototype.hasOwnProperty.call(DATA,n)){session.stage='overview';render();return;}
    var seed=(Math.random()*0xffffffff)>>>0;
    startSession(Number(n),buildStudyTasks(Number(n),seed,{count:10}),'normal');
    try{if(history.replaceState)history.replaceState(null,'','grammatica-test.html?les='+n);}catch(_err){}
  }

  function weakRound(onlyLesson){
    var d=readSave(),due=[],seen=new Set();
    Object.keys(DATA).map(Number).filter(function(n){return onlyLesson==null||n===onlyLesson;}).forEach(function(n){
      var seed=(Math.random()*0xffffffff)>>>0;
      var pool=sourceParse(n,seed+1).concat(buildFindTasks(n,seed+2),buildWhyTasks(n,seed+3),
        buildTheoryTasks(n,seed+4),buildStudyTasks(n,seed+5,{count:10}));
      pool.forEach(function(t){
        var eKey=t.example&&plain(t.example.ar)?exampleKey(n,t.example.ar):null;
        var item=eKey?d.items[eKey]:null,concept=d.concepts[conceptKey(t)];
        if((item&&item.due&&item.due<=today())||(concept&&concept.due&&concept.due<=today())){
          var sig=t.lesson+'|'+t.type+'|'+t.concept+'|'+plain(t.word);
          if(!seen.has(sig)){due.push(t);seen.add(sig);}
        }
      });
    });
    if(!due.length){
      if(onlyLesson!=null){setLesson(onlyLesson);return;}
      var note=app.querySelector('#gd-home-message');
      if(note)note.textContent='Nog geen herhalingen nodig.';
      return;
    }
    startSession(null,seededShuffle(due,(Math.random()*0xffffffff)>>>0).slice(0,10),'weak');
  }
  
    function check(){
    if(!answered()||session.feedback)return;
    var t=currentTask(),good=false;
    if(['theory','rule','why','choice','reverse','gap'].includes(t.type))good=t.options[session.chosen]===(
      t.type==='choice'?plain(t.example.nl):t.type==='reverse'?plain(t.example.ar):t.type==='gap'?t.answer:t.answer);
    if(t.type==='find')good=session.chosenWord===t.wordIndex;
    if(t.type==='parse')good=session.chosenWord===t.wordIndex && t.options[session.chosen]===t.answer;
    if(t.type==='order')good=session.ordered.map(function(i){return t.words[i];}).join(' ')===t.words.join(' ');
    recordAnswer(t,good);session.feedback={correct:good};render();
  }
  function next(){
    session.index++;session.chosen=-1;session.chosenWord=-1;session.ordered=[];session.feedback=null;
    helperReset();
    if(session.index>=session.tasks.length && session.hearts>0 && !session.queued && session.missed.length){
      session.queued=true;session.tasks=session.tasks.concat(session.missed.slice());
    }
    if(session.hearts===0 || session.index>=session.tasks.length)finishRound();
    render();
  }
  function onClick(event){
    var node=event.target.closest('[data-action]');if(!node)return;
    var action=node.getAttribute('data-action');
    if(action==='overview'){
      session.stage='overview';if(window.GrammarLabHome)window.GrammarLabHome.enter();
      try{if(history.replaceState)history.replaceState(null,'','grammatica-test.html');}catch(_err){}
      return render();
    }
    if(action==='reset'){
      if(window.confirm('Alleen de testvoortgang wissen?')){
        try{localStorage.removeItem(SAVE_KEY_V2);localStorage.removeItem(SAVE_KEY);}catch(_err){}
        session.stage='overview';render();
      }
      return;
    }
    if(action==='help-toggle'&&session.stage==='play'){
      helper.open=!helper.open;render();
      var focus=app.querySelector(helper.open?'#gd-helper-question':'[data-action="help-toggle"]');
      if(focus)focus.focus({preventScroll:true});
      return;
    }
    if(action==='help-suggest'&&session.stage==='play')return helperAsk(node.dataset.value);
    if(action==='sound-toggle')return toggleSound();
    if(action==='weak')return weakRound();
    if(action==='theory-prev'){session.theoryIndex=Math.max(0,session.theoryIndex-1);return render();}
    if(action==='theory-next'){
      if(session.theoryIndex<session.theoryCards.length-1)session.theoryIndex++;
      else session.stage='play';
      return render();
    }
    if(session.stage==='play'&&!session.feedback){
      if(action==='select'){session.chosen=Number(node.dataset.value);return render();}
      if(action==='word'){session.chosenWord=Number(node.dataset.value);return render();}
      if(action==='tile'){var id=Number(node.dataset.value);if(!session.ordered.includes(id))session.ordered.push(id);return render();}
      if(action==='remove'){session.ordered=session.ordered.filter(function(id){return id!==Number(node.dataset.value);});return render();}
      if(action==='check')return check();
    }
    if(action==='next'&&session.feedback)return next();
    if(action==='retry'&&session.lastMissed.length){
      return startSession(session.lesson,session.lastMissed.slice(),'weak');
    }
    if(action==='continue'){
      session.stage='overview';if(window.GrammarLabHome)window.GrammarLabHome.enter();
      try{if(history.replaceState)history.replaceState(null,'','grammatica-test.html');}catch(_err){}
      return render();
    }
  }
  function init(){
    app=document.getElementById('gd-app');
    if(!app)return;
    app.addEventListener('click',onClick);
    if(window.GrammarLabHome){
      window.GrammarLabHome.mount(app,window.GrammarLabEngine);
    }
    app.addEventListener('submit',function(e){
      if(!e.target.matches('[data-helper-form]'))return;
      e.preventDefault();
      var field=e.target.querySelector('[name="question"]');
      if(field)helperAsk(field.value);
    });
    app.addEventListener('change',function(e){
      if(e.target.matches('[data-goal]')){var d=readSave();d.goal=Number(e.target.value);refreshStreak(d);writeSave(d);render();}
    });
    document.addEventListener('keydown',function(e){
      if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName) || e.ctrlKey||e.altKey||e.metaKey)return;
      if(session.stage==='theory' && e.key==='Enter'){e.preventDefault();var button=app.querySelector('[data-action="theory-next"]');if(button)button.click();return;}
      if(session.stage!=='play')return;
      if(session.feedback && e.key==='Enter'){e.preventDefault();next();return;}
      var t=currentTask();
      if(!t)return;
      if(/^[1-4]$/.test(e.key) && !session.feedback && t.options){
        var idx=Number(e.key)-1;if(idx<t.options.length){session.chosen=idx;render();}
      }else if(e.key==='Enter'&&!session.feedback&&answered()){e.preventDefault();check();}
    });
    var requested=new URLSearchParams(location.search).get('les');
    if(requested!==null && /^\d+$/.test(requested) && Object.prototype.hasOwnProperty.call(DATA,requested))setLesson(Number(requested));
    else render();
  }
  window.GrammarLabEngine={
    open:function(n,mode){
      if(mode==='start'&&weakened(Number(n),readSave()))return weakRound(Number(n));
      setLesson(n);
    },
    refresh:render,
    isHome:function(){return session.stage==='overview';}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

})();
