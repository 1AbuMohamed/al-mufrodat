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
    var types = ['choice','order','gap','reverse','pairs','choice','order','gap','reverse','pairs'];
    var tasks = [], base = seed === undefined ? n*89+7 : seed;
    for (var i=0;i<MAX_TASKS;i++) {
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

  function storedScores() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}') || {}; }
    catch (_err) { return {}; }
  }
  function storeScore() {
    try {
      var scores = storedScores();
      scores[session.lesson] = {
        correct: session.correct, total: session.tasks.length,
        reviewed: session.review, date: new Date().toISOString().slice(0, 10)
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(scores));
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
      '<strong>Les ' + session.lesson + '</strong><span>' + (finished ? 'Afgerond' : intro ? 'Voorbereiding' : (completed + 1) + ' / ' + total) +
      '</span></div><div class="gd-progress" role="progressbar" aria-label="Voortgang oefenronde" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + percent + '">' +
      '<span style="width:' + percent + '%"></span></div></div>' +
      '<a class="gd-source-link" href="' + lessonUrl(session.lesson) + '">Originele les</a></div>';
  }
  function overview() {
    var scores = storedScores();
    var keys = Object.keys(DATA).map(Number).sort(function (a, b) { return a - b; });
    return '<div class="gd-shell gd-overview">' +
      '<div class="gd-hero"><div class="gd-eyebrow">Medina-methode · proefversie</div>' +
      '<h1>Leer grammatica door te doen</h1>' +
      '<p>Dezelfde Medina-lessen, nu in korte interactieve stappen. De bestaande grammatica verandert niet.</p>' +
      '<div class="gd-hero-key"><span>1. Bekijk een voorbeeld</span><span>2. Oefen</span><span>3. Herhaal fouten</span></div></div>' +
      '<div class="gd-overview-top"><h2>Kies een les</h2><p>Je kunt alle lessen uitproberen. Alleen de testresultaten worden apart op dit apparaat opgeslagen.</p></div>' +
      '<div class="gd-lesson-grid">' + keys.map(function (n) {
        var count = getExamples(n).length;
        var score = scores[n];
        var scoreLabel = score ? 'Laatst geoefend: ' + score.correct + '/' + score.total : count ? count + ' voorbeeld' + (count === 1 ? '' : 'en') : 'Alleen originele uitleg';
        return '<a class="gd-lesson-card" href="grammatica-test.html?les=' + n + '">' +
          '<span class="gd-lesson-number">' + n + '</span>' +
          '<span class="gd-lesson-detail"><strong>Les ' + n + '</strong><small>' + esc(scoreLabel) + '</small></span>' +
          '<span class="gd-card-arrow" aria-hidden="true">→</span></a>';
      }).join('') + '</div><p class="gd-privacy-note">Dit is een losse proefpagina. Je bestaande voortgang in Al-Mufrodat blijft ongewijzigd.</p></div>';
  }
  function intro() {
    var n = session.lesson;
    var exercises = session.tasks.length;
    return '<div class="gd-shell gd-play">' + topBar() +
      '<div class="gd-card gd-intro"><div class="gd-stage-tag">Stap 1 · begrijpen</div>' +
      '<h1>Les ' + n + ': eerst kijken, dan proberen</h1>' +
      '<p class="gd-support">Hieronder staat uitsluitend bestaande uitleg uit de Medina-les.</p>' +
      '<div class="gd-source-box">' + rulesHtml(n) + '</div>' + introSample(n) +
      (exercises ?
        '<p class="gd-intro-bottom">Nu volgen ' + exercises + ' korte oefening' + (exercises === 1 ? '' : 'en') + ' met de oorspronkelijke voorbeeldzinnen.</p>' +
        '<button type="button" class="gd-primary gd-full" data-action="start">Start oefenen <span aria-hidden="true">→</span></button>' :
        '<p class="gd-intro-bottom">Deze les heeft geen afzonderlijke Arabisch–Nederlandse voorbeelden om er betrouwbare automatische vragen van te maken. Er is daarom geen oefentoets verzonnen.</p>' +
        '<a class="gd-primary gd-full gd-as-link" href="' + lessonUrl(n) + '">Lees de oorspronkelijke les →</a>') +
      '</div></div>';
  }
  function currentTask() { return session.tasks[session.index]; }
  function renderTaskBody(task) {
    var type = task.type, ex = task.example;
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
  function taskHeading(type) {
    if (type === 'choice') return ['Begrijpen', 'Welke vertaling hoort bij deze zin?'];
    if (type === 'gap') return ['Aanvullen', 'Welk Arabisch woord ontbreekt?'];
    if (type === 'order') return ['Zinsbouw', 'Zet de woorden in de juiste volgorde'];
    return ['Zelfcontrole', 'Kun je dit voorbeeld begrijpen?'];
  }
  function answered() {
    var task = currentTask();
    if (!task) return false;
    if (task.type === 'order') return session.ordered.length === task.words.length;
    if (task.type === 'reflect') return true;
    return session.chosen >= 0;
  }
  function taskFeedback(task) {
    if (!session.feedback) return '';
    var isGood = session.feedback.correct;
    var text = task.type === 'reflect' ? 'Dit is de oorspronkelijke vertaling.' :
      isGood ? 'Goed gezien!' : 'Nog een keer oefenen helpt.';
    return '<section class="gd-feedback ' + (isGood ? 'good' : 'review') + '" role="status" aria-live="polite">' +
      '<strong>' + text + '</strong>' +
      '<span class="gd-feedback-label">Origineel voorbeeld uit Medina-les ' + session.lesson + '</span>' +
      '<p class="gd-arabic" lang="ar" dir="rtl">' + esc(task.example.ar) + '</p>' +
      '<p class="gd-feedback-nl">' + esc(task.example.nl) + '</p></section>';
  }
  function taskScreen() {
    var task = currentTask();
    if (!task) return finished();
    var headings = taskHeading(task.type);
    var isReflect = task.type === 'reflect';
    var action = session.feedback ? (
      isReflect && session.feedback.correct === null ?
        '<div class="gd-self-grade"><button type="button" class="gd-soft" data-action="rate" data-value="0">Nog oefenen</button>' +
        '<button type="button" class="gd-primary" data-action="rate" data-value="1">Ik wist het</button></div>' :
        '<button type="button" class="gd-primary gd-full" data-action="next">' +
        (session.index + 1 >= session.tasks.length ? 'Bekijk resultaat' : 'Verder') + ' <span aria-hidden="true">→</span></button>'
    ) : '<button type="button" class="gd-primary gd-full" data-action="' +
      (isReflect ? 'reveal' : 'check') + '"' + (answered() ? '' : ' disabled') + '>' +
      (isReflect ? 'Toon vertaling' : 'Controleren') + '</button>';

    return '<div class="gd-shell gd-play">' + topBar() +
      '<div class="gd-card gd-task">' +
      '<div class="gd-stage-tag">' + headings[0] + '</div>' +
      '<h1>' + headings[1] + '</h1><div class="gd-task-main">' + renderTaskBody(task) + '</div>' +
      '<details class="gd-guide"><summary>Bekijk de originele uitleg</summary><div>' + rulesHtml(session.lesson) + '</div></details>' +
      taskFeedback(task) + '<div class="gd-actions">' + action + '</div>' +
      '</div></div>';
  }
  function finished() {
    var total = session.tasks.length;
    var missed = session.missed.length;
    return '<div class="gd-shell gd-play">' + topBar() +
      '<div class="gd-card gd-finish"><span class="gd-finish-icon" aria-hidden="true">✓</span>' +
      '<div class="gd-stage-tag">Oefenronde afgerond</div>' +
      '<h1>Goed gewerkt met les ' + session.lesson + '</h1>' +
      '<p>Je hebt ' + session.correct + ' van de ' + total + ' opdrachten goed beantwoord.' +
      (session.review ? ' Dit was een herhalingsronde.' : '') + '</p>' +
      (missed ? '<div class="gd-remaining">' + missed + ' opdracht' + (missed === 1 ? '' : 'en') +
        ' om nog eens te proberen.</div>' : '<div class="gd-remaining done">Je hebt geen openstaande fouten in deze ronde.</div>') +
      '<div class="gd-finish-actions">' +
      (missed ? '<button type="button" class="gd-primary gd-full" data-action="retry">Herhaal mijn fouten</button>' : '') +
      '<button type="button" class="gd-soft gd-full" data-action="restart">Oefen les ' + session.lesson + ' opnieuw</button>' +
      '<a class="gd-outline-link" href="' + lessonUrl(session.lesson) + '">Naar de volledige grammaticales</a>' +
      '<button type="button" class="gd-link-button" data-action="overview">Alle lessen bekijken</button>' +
      '</div></div></div>';
  }
  function render() {
    if (!app) return;
    app.innerHTML = session.stage === 'overview' ? overview() :
      session.stage === 'intro' ? intro() :
      session.stage === 'done' ? finished() : taskScreen();
  }
  function setLesson(n) {
    if (!Object.prototype.hasOwnProperty.call(DATA, n)) { session.stage = 'overview'; render(); return; }
    session.lesson = Number(n);
    session.tasks = buildTasks(session.lesson);
    session.index = 0;
    session.correct = 0;
    session.missed = [];
    session.chosen = -1;
    session.ordered = [];
    session.feedback = null;
    session.review = false;
    session.stage = 'intro';
    render();
  }
  function check() {
    if (!answered() || session.feedback) return;
    var task = currentTask();
    var correct = false;
    if (task.type === 'choice') correct = task.options[session.chosen] === plain(task.example.nl);
    if (task.type === 'gap') correct = task.options[session.chosen] === task.answer;
    if (task.type === 'order') {
      correct = session.ordered.map(function (idx) { return task.words[idx]; }).join(' ') === task.words.join(' ');
    }
    session.feedback = { correct: correct };
    if (correct) session.correct++;
    else session.missed.push(task);
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
      if (good) session.correct++;
      else session.missed.push(currentTask());
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
    var requested = new URLSearchParams(location.search).get('les');
    if (requested !== null && /^\d+$/.test(requested) && Object.prototype.hasOwnProperty.call(DATA, requested)) {
      setLesson(Number(requested));
    } else render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
