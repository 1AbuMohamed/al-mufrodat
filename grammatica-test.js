/* Al-Mufrodat · geïsoleerde interactieve grammaticaproef.
 * Leest uitsluitend window.GRAMMATICA uit lessons_v2.js.
 * Geen wijzigingen in het lesmateriaal of de voortgang van de echte app.
 */
(function () {
  'use strict';

  var DATA = window.GRAMMATICA || {};
  var SAVE_KEY = 'alm_grammar_test_v2';
  var OLD_KEY = 'alm_grammar_test_scores_v1';
  var MAX_TASKS = 10;
  var app = null;
  var session = {
    lesson: null, stage: 'overview', tasks: [], index: 0,
    chosen: -1, ordered: [], feedback: null,
    correct: 0, missed: [], review: false, hearts: 5, combo: 0, xp: 0, wrong: 0, attempts: 0, lastMissed: []
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
    return (lesson.inhoud || []).filter(function (item) {
      return ['tekst', 'regel', 'kop'].indexOf(item.type) >= 0 &&
        plain(item.tekst).length >= 35 &&
        !/^Woordenlijst van les\b/i.test(plain(item.tekst));
    }).slice(0, 3).map(function (item) { return plain(item.tekst); });
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
  function buildTasks(n, seed) {
    var examples = getExamples(n);
    if (!examples.length) return [];
    var types = seed === undefined ? ['choice','order','gap','choice','order','gap'] : ['choice','order','gap','reverse','pairs','choice','order','gap','reverse','pairs'];
    var tasks = [], base = seed === undefined ? n*89+7 : seed;
    for (var i=0;i<(seed === undefined ? 6 : MAX_TASKS);i++) {
      var type=types[i], pool=seededShuffle(examples,base+i*103), candidate=null;
      for(var j=0;j<pool.length;j++){
        var ex=pool[j], k=base+i*31+j;
        if(type==='choice'){
          var options=choicesFor(ex,examples,k);
          if(options)candidate={type:type,example:ex,options:options};
        }else if(type==='gap')candidate=makeGap(ex,examples,k);
        else if(type==='order')candidate=makeOrder(ex,k);
        else if(type==='reverse'){
          var others=[...new Set(examples.map(function(x){return plain(x.ar);}))].filter(function(x){return x!==plain(ex.ar);});
          if(others.length)candidate={type:type,example:ex,options:seededShuffle([plain(ex.ar)].concat(seededShuffle(others,k).slice(0,3)),k+9)};
        }else if(type==='pairs'){
          var pairs=[ex].concat(seededShuffle(examples.filter(function(x){return x.ar!==ex.ar&&x.nl!==ex.nl;}),k).slice(0,3));
          if(pairs.length>1)candidate={type:type,example:ex,pairs:pairs,options:seededShuffle(pairs.map(function(x){return plain(x.nl);}),k+17)};
        }
        if(candidate)break;
      }
      if(!candidate)candidate={type:'reflect',example:pool[0]};
      tasks.push(candidate);
    }
    return tasks;
  }

  // Beschikbaar voor tests, zonder de daadwerkelijke app-data te wijzigen.
  window.GrammarLabCore = {
    getExamples: getExamples, getRules: getRules, buildTasks: buildTasks,
    splitArabic: splitArabic, choicesFor: choicesFor
  };

  function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function addDays(day,n){var p=day.split('-').map(Number),d=new Date(p[0],p[1]-1,p[2]+n);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function weekOf(day){var p=day.split('-').map(Number),d=new Date(p[0],p[1]-1,p[2]);d.setDate(d.getDate()-(d.getDay()+6)%7);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function readSave(){
    var d={items:{},daily:{},goal:20,xp:0,streak:0,freezeWeek:'',lastGoalDay:''};
    try{
      var raw=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');
      if(raw&&typeof raw==='object')Object.assign(d,raw);
      else { d.legacy=JSON.parse(localStorage.getItem(OLD_KEY)||'{}'); try{localStorage.setItem(SAVE_KEY,JSON.stringify(d));}catch(_e){} }
    }catch(_e){}
    d.items=d.items||{};d.daily=d.daily||{};return d;
  }
  function writeSave(d){try{localStorage.setItem(SAVE_KEY,JSON.stringify(d));}catch(_e){}}
  function key(n,ar){return n+'|'+plain(ar);}
  function mastery(n,ar){return readSave().items[key(n,ar)]||{level:0,due:'',misses:0,last:''};}
  function crowns(n){var a=getExamples(n);return a.length?Math.max(0,Math.min(5,Math.round(a.reduce(function(t,e){return t+(mastery(n,e.ar).level||0);},0)/a.length))):0;}
  function weakened(n){return getExamples(n).some(function(e){var m=mastery(n,e.ar);return m.due&&m.due<=today();});}
  function firstNext(){var keys=Object.keys(DATA).map(Number).sort(function(a,b){return a-b;});return keys.find(function(n){return getExamples(n).length&&crowns(n)<1;})??keys[0];}
  function refreshStreak(d){
    var days=Object.keys(d.daily).filter(function(x){return d.daily[x]>=d.goal;}).sort();
    var last=days[days.length-1];if(!last){d.streak=0;return;}
    var count=1,used=false,cur=last;
    for(var i=days.length-2;i>=0;i--){
      if(days[i]===addDays(cur,-1)){count++;cur=days[i];continue;}
      var skipped=addDays(cur,-1);
      if(!used&&days[i]===addDays(cur,-2)&&d.freezeWeek!==weekOf(skipped)){
        used=true;d.freezeWeek=weekOf(skipped);count+=2;cur=days[i];continue;
      }
      break;
    }
    d.lastGoalDay=last;d.streak=(last===today()||last===addDays(today(),-1))?count:0;
  }
  function credit(task,good){
    var d=readSave(),n=task.lesson===undefined?session.lesson:task.lesson;
    var k=key(n,task.example.ar),old=d.items[k]||{level:0,misses:0};
    var level=Math.max(0,Math.min(5,(old.level||0)+(good?1:-1)));
    d.items[k]={level:level,due:addDays(today(),good?[0,1,3,7,14,30][level]:0),misses:(old.misses||0)+(good?0:1),last:today()};
    session.attempts++;
    if(good){session.correct++;session.combo++;session.xp+=10;d.xp+=10;d.daily[today()]=(d.daily[today()]||0)+10;}
    else{session.wrong++;session.combo=0;session.hearts=Math.max(0,session.hearts-1);session.missed.push(task);}
    refreshStreak(d);writeSave(d);
  }
  function finishRound(){
    session.lastMissed=session.missed.slice();session.stage='done';
    if(session.attempts&&session.wrong===0){
      var d=readSave();d.xp+=5;d.daily[today()]=(d.daily[today()]||0)+5;session.xp+=5;refreshStreak(d);writeSave(d);
    }
  }
  function icon(name){
    var paths={
      flame:'<path d="M12 22c5 0 8-4 8-8 0-3-2-5-4-7 0 3-2 4-3 5C13 7 11 4 8 2c0 5-4 8-4 12 0 5 3 8 8 8Z"/>',
      star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
      crown:'<path d="m2 7 5 4 5-8 5 8 5-4-2 12H4Z"/>',
      heart:'<path d="M20 5a5 5 0 0 0-7 0l-1 1-1-1a5 5 0 0 0-7 7l8 9 8-9a5 5 0 0 0 0-7Z"/>',
      check:'<path d="m4 12 5 5L20 6"/>',
      book:'<path d="M12 6C9 4 6 4 2 5v15c4-1 7-1 10 1 3-2 6-2 10-1V5c-4-1-7-1-10 1Z"/><path d="M12 6v15"/>'
    };
    return '<svg class="gd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[name]+'</svg>';
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
    if (!rules.length) return '<p>Bekijk de volledige theorie in de originele Medina-les.</p>';
    return rules.map(function (line) {
      return '<p class="gd-source-rule">' + esc(line) + '</p>';
    }).join('');
  }
  function topBar() {
    var finished = session.stage === 'done', intro = session.stage === 'intro';
    var total = Math.max(1, session.tasks.length);
    var completed = finished ? total : intro ? 0 : session.index;
    var percent = Math.round(100 * completed / total);
    return '<div class="gd-lesson-bar">' +
      '<button type="button" class="gd-close" data-action="overview" aria-label="Terug naar alle lessen">×</button>' +
      '<div class="gd-progress-wrap"><div class="gd-progress-title">' +
      '<strong>Les ' + (session.lesson===null?'herhaling':session.lesson) + '</strong><span>' + (finished ? 'Afgerond' : intro ? 'Voorbereiding' : (completed + 1) + ' / ' + total) +
      '</span></div><div class="gd-progress" role="progressbar" aria-label="Voortgang oefenronde" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + percent + '">' +
      '<span style="width:' + percent + '%"></span></div></div>' +
      '<a class="gd-source-link" href="' + (session.lesson===null?'index.html#/grammatica':lessonUrl(session.lesson)) + '">Grammatica</a></div>';
  }
  function overview(){
    var d=readSave();refreshStreak(d);
    var xp=d.daily[today()]||0,goal=d.goal||20,pct=Math.min(100,Math.round(100*xp/goal));
    var current=firstNext(),keys=Object.keys(DATA).map(Number).sort(function(a,b){return a-b;});
    return '<div class="gd-shell gd-overview"><div class="gd-stats">'+
      '<span class="gd-stat gd-fire">'+icon('flame')+d.streak+'</span>'+
      '<span class="gd-stat gd-xp">'+icon('star')+(d.xp||0)+' XP</span>'+
      '<label class="gd-goal"><span class="gd-ring" style="--fill:'+pct+'%">'+pct+'%</span>'+
      '<select data-goal aria-label="Dagdoel"><option value="20"'+(goal===20?' selected':'')+'>20 XP</option>'+
      '<option value="30"'+(goal===30?' selected':'')+'>30 XP</option>'+
      '<option value="50"'+(goal===50?' selected':'')+'>50 XP</option></select></label></div>'+
      '<nav class="gd-path" aria-label="Leerpad">'+keys.map(function(n,i){
        var c=crowns(n),weak=weakened(n),reading=!getExamples(n).length;
        var cls=reading?'reading':c?'complete':weak?'weak':n===current?'current':'open';
        return '<div class="gd-path-row offset-'+(i%4)+'"><a class="gd-node '+cls+(n===current?' active':'')+'" href="grammatica-test.html?les='+n+'" aria-label="Les '+n+'">'+
          (n===current?'<span class="gd-start-bubble">START</span>':'')+
          '<span class="gd-node-symbol">'+(reading?icon('book'):c?icon('crown'):weak?'◌':icon('star'))+'</span>'+
          '<span class="gd-node-name">Les '+n+'</span>'+
          (c?'<span class="gd-crown-count">'+c+'/5</span>':'')+
          (reading?'<span class="gd-node-sub">Lees les</span>':'')+'</a></div>';
      }).join('')+'</nav><button class="gd-weak-button" data-action="weak">Oefen zwakke punten</button>'+
      '<button class="gd-reset" data-action="reset">Reset testvoortgang</button>'+
      '<div class="gd-fixed-continue"><a class="gd-primary" href="grammatica-test.html?les='+current+'">Ga verder</a></div></div>';
  }
  function intro(){
    var n=session.lesson;
    return '<div class="gd-shell gd-play">'+topBar()+
      '<div class="gd-card gd-intro"><h1>Les '+n+'</h1><div class="gd-stage-tag">Eerst lezen</div>'+
      '<div class="gd-source-box">'+rulesHtml(n)+'</div>'+
      (session.tasks.length?'<button class="gd-primary gd-full" data-action="start">Start</button>':
      '<a class="gd-primary gd-full gd-as-link" href="'+lessonUrl(n)+'">Lees les</a>')+
      '</div></div>';
  }
  function currentTask() { return session.tasks[session.index]; }
  function renderTaskBody(task) {
    var type = task.type, ex = task.example;
    if (type === 'choice' || type === 'reverse' || type === 'pairs') {
      var cue=type==='reverse'?'<div class="gd-translation-cue">'+esc(ex.nl)+'</div>':
        '<div class="gd-ar-question gd-arabic" lang="ar" dir="rtl">'+esc(ex.ar)+'</div>';
      return cue+'<div class="gd-options">'+task.options.map(function(option,i){
        var selected=session.chosen===i;
        return '<button type="button" class="gd-option'+(selected?' selected':'')+'" data-action="select" data-value="'+i+'" aria-pressed="'+selected+'"'+(session.feedback?' disabled':'')+'>'+
          (type==='reverse'?'<span class="gd-arabic gd-ar-option" lang="ar" dir="rtl">'+esc(option)+'</span>':esc(option))+'</button>';
      }).join('')+'</div>';
    }
    if (false) {
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
        return i === task.missing ? '______' : esc(word);
      }).join(' ');
      return '<div class="gd-ar-question gd-arabic gd-gap-question" lang="ar" dir="rtl">' + sentence + '</div>' +
        '<p class="gd-subinstruction">Kies een woord dat de oorspronkelijke zin compleet maakt.</p>' +
        '<div class="gd-options gd-options-tiles">' + task.options.map(function (option, i) {
          var isPicked = session.chosen === i;
          return '<button type="button" class="gd-option gd-option-ar' + (isPicked ? ' selected' : '') +
            '" data-action="select" data-value="' + i + '" ' + (session.feedback ? 'disabled' : '') +
            ' aria-pressed="' + isPicked + '" lang="ar" dir="rtl">' + esc(option) + '</button>';
        }).join('') + '</div>';
    }
    if (type === 'order') {
      var built = session.ordered.map(function (index) {
        return '<button type="button" class="gd-word chosen" data-action="remove" data-value="' + index + '"' +
          (session.feedback ? ' disabled' : '') + ' lang="ar" dir="rtl">' + esc(task.words[index]) + '</button>';
      }).join('');
      var bank = task.bank.map(function (index) {
        return '<button type="button" class="gd-word" data-action="tile" data-value="' + index + '"' +
          (session.feedback || session.ordered.indexOf(index) >= 0 ? ' disabled' : '') +
          ' lang="ar" dir="rtl">' + esc(task.words[index]) + '</button>';
      }).join('');
      return '<div class="gd-translation-cue">' + esc(ex.nl) + '</div>' +
        '<div class="gd-answer-area" dir="rtl" aria-label="Jouw Arabische zin">' +
          (built || '<span class="gd-placeholder">Tik op de Arabische woordblokjes…</span>') + '</div>' +
        '<div class="gd-word-bank" dir="rtl" aria-label="Beschikbare woorden">' + bank + '</div>';
    }
    return '<div class="gd-ar-question gd-arabic" lang="ar" dir="rtl">' + esc(ex.ar) + '</div>' +
      '<p class="gd-subinstruction">Denk eerst zelf na. Onthul daarna de oorspronkelijke vertaling.</p>';
  }
  function taskHeading(type){
    if(type==='choice')return ['Vertaling','Kies de vertaling'];
    if(type==='reverse')return ['Arabisch','Kies het Arabisch'];
    if(type==='gap')return ['Aanvullen','Vul het woord in'];
    if(type==='order')return ['Zinsbouw','Bouw de zin'];
    if(type==='pairs')return ['Koppelen','Koppel de woorden'];
    return ['Lezen','Bekijk de vertaling'];
  }
  function answered() {
    var task = currentTask();
    if (!task) return false;
    if (task.type === 'order') return session.ordered.length === task.words.length;
    if (task.type === 'reflect') return true;
    return session.chosen >= 0;
  }
  function taskFeedback(task){
    if(!session.feedback)return '';
    var good=session.feedback.correct;
    return '<section class="gd-feedback gd-feedback-sheet '+(good?'good':'review')+'" role="status" aria-live="assertive">'+
      '<div class="gd-feedback-inner"><strong>'+(good?['Goed!','Prima!','Uitstekend!'][session.index%3]:'Juiste antwoord:')+'</strong>'+
      (session.combo>=3?'<span class="gd-combo">'+session.combo+'× combo</span>':'')+
      '<p class="gd-arabic" lang="ar" dir="rtl">'+esc(task.example.ar)+'</p>'+
      '<p>'+esc(task.example.nl)+'</p>'+
      '<button class="gd-primary" data-action="next">Verder</button></div></section>';
  }
  function taskScreen(){
    var task=currentTask();if(!task)return finished();
    var h=taskHeading(task.type),action=task.type==='reflect'?'reveal':'check';
    return '<div class="gd-shell gd-play">'+topBar()+
      '<div class="gd-hearts" aria-label="'+session.hearts+' van 5 hartjes">'+
      Array.from({length:5},function(_,i){return '<span class="'+(i<session.hearts?'alive':'lost')+'">'+icon('heart')+'</span>';}).join('')+
      '</div><div class="gd-card gd-task"><div class="gd-stage-tag">'+h[0]+'</div>'+
      '<h1>Les '+(task.lesson===undefined?session.lesson:task.lesson)+'</h1>'+
      '<p class="gd-task-prompt">'+h[1]+'</p><div class="gd-task-main">'+renderTaskBody(task)+'</div>'+
      '<details class="gd-guide"><summary>Uitleg</summary><div>'+rulesHtml(task.lesson===undefined?session.lesson:task.lesson)+'</div></details>'+
      '<div class="gd-actions"><button class="gd-primary gd-full" data-action="'+action+'"'+(answered()?'':' disabled')+'>'+
      (action==='reveal'?'Toon vertaling':'Controleren')+'</button></div></div>'+taskFeedback(task)+'</div>';
  }
  function finished(){
    var d=readSave(),acc=session.attempts?Math.round(100*session.correct/session.attempts):0,n=session.lesson;
    return '<div class="gd-shell gd-play">'+topBar()+
      '<div class="gd-card gd-finish"><span class="gd-finish-icon">'+icon('crown')+'</span>'+
      '<h1>Les '+(n===null?'herhaling':n)+'</h1>'+
      '<div class="gd-result-grid"><span><strong class="gd-countup" data-target="'+session.xp+'">0</strong><small>XP</small></span>'+
      '<span><strong>'+acc+'%</strong><small>Nauwkeurigheid</small></span>'+
      '<span><strong>'+d.streak+'</strong><small>Streak</small></span>'+
      '<span><strong>'+(n===null?'—':crowns(n)+'/5')+'</strong><small>Kronen</small></span></div>'+
      '<div class="gd-finish-actions"><button class="gd-primary gd-full" data-action="continue">Doorgaan</button>'+
      '<button class="gd-soft gd-full" data-action="retry"'+(session.lastMissed.length?'':' disabled')+'>Herhaal fouten</button></div></div></div>';
  }
  function render() {
    if (!app) return;
    app.innerHTML = session.stage === 'overview' ? overview() :
      session.stage === 'intro' ? intro() :
      session.stage === 'done' ? finished() : taskScreen();
    if(session.stage==='done'){
      var el=app.querySelector('.gd-countup');
      if(el){var target=Number(el.dataset.target),start=performance.now();
        function tick(now){if(!el.isConnected)return;var t=Math.min(1,(now-start)/650);el.textContent=Math.round(target*t);if(t<1)requestAnimationFrame(tick);}
        if(matchMedia('(prefers-reduced-motion: reduce)').matches)el.textContent=target;else requestAnimationFrame(tick);
      }
    }
  }
  function setLesson(n){
    if(!Object.prototype.hasOwnProperty.call(DATA,n)){session.stage='overview';render();return;}
    session.lesson=Number(n);session.tasks=buildTasks(session.lesson,(Math.random()*0xFFFFFFFF)>>>0);
    session.index=0;session.correct=0;session.missed=[];session.lastMissed=[];
    session.chosen=-1;session.ordered=[];session.feedback=null;session.review=false;
    session.hearts=5;session.combo=0;session.xp=0;session.wrong=0;session.attempts=0;
    session.stage='intro';render();
  }
  function setWeak(){
    var tasks=[];
    Object.keys(DATA).map(Number).forEach(function(n){
      getExamples(n).forEach(function(ex){
        var m=mastery(n,ex.ar);
        if(m.due&&m.due<=today()){
          var opts=choicesFor(ex,getExamples(n),n+Date.now());
          tasks.push(Object.assign({lesson:n},opts?{type:'choice',example:ex,options:opts}:{type:'reflect',example:ex}));
        }
      });
    });
    if(!tasks.length){session.stage='overview';render();return;}
    session.lesson=null;session.tasks=seededShuffle(tasks,(Math.random()*0xFFFFFFFF)>>>0).slice(0,10);
    session.index=0;session.correct=0;session.missed=[];session.lastMissed=[];
    session.chosen=-1;session.ordered=[];session.feedback=null;session.review=true;
    session.hearts=5;session.combo=0;session.xp=0;session.wrong=0;session.attempts=0;
    session.stage='play';render();
  }
  function check(){
    if(!answered()||session.feedback)return;
    var task=currentTask(),good=false;
    if(task.type==='choice')good=task.options[session.chosen]===plain(task.example.nl);
    if(task.type==='reverse')good=task.options[session.chosen]===plain(task.example.ar);
    if(task.type==='gap')good=task.options[session.chosen]===task.answer;
    if(task.type==='order')good=session.ordered.map(function(i){return task.words[i];}).join(' ')===task.words.join(' ');
    if(task.type==='pairs')good=task.options[session.chosen]===plain(task.pairs[0].nl);
    credit(task,good);session.feedback={correct:good};render();
  }
  function next(){
    session.index++;session.chosen=-1;session.ordered=[];session.feedback=null;
    if(session.hearts===0||session.index>=session.tasks.length)finishRound();
    render();
  }
  function onClick(event){
    var node=event.target.closest('[data-action]');if(!node)return;
    var action=node.getAttribute('data-action');
    if(action==='overview'){session.stage='overview';history.replaceState(null,'','grammatica-test.html');return render();}
    if(action==='start'){session.stage='play';return render();}
    if(action==='weak')return setWeak();
    if(action==='reset'){
      if(confirm('Alleen de testvoortgang wissen?')){
        try{localStorage.removeItem(SAVE_KEY);}catch(_e){}
        session.stage='overview';render();
      }
      return;
    }
    if(action==='select'&&!session.feedback){session.chosen=Number(node.dataset.value);return render();}
    if(action==='tile'&&!session.feedback){
      var idx=Number(node.dataset.value);
      if(session.ordered.indexOf(idx)<0)session.ordered.push(idx);
      return render();
    }
    if(action==='remove'&&!session.feedback){
      session.ordered=session.ordered.filter(function(x){return x!==Number(node.dataset.value);});return render();
    }
    if(action==='check')return check();
    if(action==='reveal'&&!session.feedback){
      credit(currentTask(),true);session.feedback={correct:true};return render();
    }
    if(action==='next'&&session.feedback)return next();
    if(action==='retry'){
      if(!session.lastMissed.length)return;
      session.tasks=session.lastMissed.slice();session.missed=[];session.lastMissed=[];
      session.correct=0;session.wrong=0;session.attempts=0;session.xp=0;
      session.hearts=5;session.combo=0;session.index=0;session.chosen=-1;session.ordered=[];
      session.feedback=null;session.review=true;session.stage='play';return render();
    }
    if(action==='continue'){session.stage='overview';history.replaceState(null,'','grammatica-test.html');return render();}
  }
  function init() {
    app = document.getElementById('gd-app');
    if (!app) return;
    app.addEventListener('click', onClick);
    app.addEventListener('change',function(e){
      if(e.target.matches('[data-goal]')){
        var d=readSave();d.goal=Number(e.target.value);refreshStreak(d);writeSave(d);render();
      }
    });
    document.addEventListener('keydown',function(e){
      if(session.stage!=='play'||e.altKey||e.ctrlKey||e.metaKey||e.target.matches('input,textarea,select'))return;
      if(session.feedback){if(e.key==='Enter'){e.preventDefault();next();}return;}
      if(/^[1-4]$/.test(e.key)){
        var task=currentTask(),i=Number(e.key)-1;
        if(task&&['choice','gap','reverse','pairs'].includes(task.type)&&i<task.options.length){
          session.chosen=i;render();
        }
      }else if(e.key==='Enter'&&answered()){e.preventDefault();check();}
    });
    var requested = new URLSearchParams(location.search).get('les');
    if (requested !== null && /^\d+$/.test(requested) && Object.prototype.hasOwnProperty.call(DATA, requested)) {
      setLesson(Number(requested));
    } else render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
