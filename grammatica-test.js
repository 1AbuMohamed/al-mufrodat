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
    choicesFor: choicesFor
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
        '<div class="gd-stage-tag">Stap 1 · begrijpen</div>' +
        '<h1>Les ' + n + ': eerst kijken, dan proberen</h1>' +
        '<p class="gd-support">Hieronder staat uitsluitend bestaande uitleg uit het Medina-boek.</p>' +
        '<div class="gd-source-box">' + rulesHtml(n) + '</div>' + introSample(n) +
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
    if (task.type === 'choice' || task.type === 'gap') return session.chosen >= 0;
    if (task.type === 'order') return session.ordered.length === task.words.length;
    return true;
  }

  function taskScreen() {
    var task = currentTask();
    if (!task) return finished();
    var canCheck = answered();
    var prompts = {
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
      '<strong>' + (good ? 'Goed beantwoord!' : 'Fout') + '</strong>' +
      (good ? '' : '<p class="gd-feedback-correct-label">Dit is het juiste antwoord:</p>') +
      '<p class="gd-arabic" lang="ar" dir="rtl">' + esc(task.example.ar) + '</p>' +
      '<p class="gd-dutch-answer">' + esc(task.example.nl) + '</p>' +
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
    session.tasks = buildTasks(session.lesson);
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
