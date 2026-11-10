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
    lesson: null, stage: 'overview', tasks: [], index: 0, theoryCards: [], theoryIndex: 0, parseAnswers: {},
    chosen: -1, ordered: [], feedback: null,
    correct: 0, missed: [], review: false, hearts: 5, combo: 0, xp: 0, wrong: 0, attempts: 0, lastMissed: [], queued: false
  };

  function plain(value) { return String(value == null ? '' : value).trim(); }
  function esc(value) {
    return plain(value).replace(/&/g, '&').replace(/</g, '<')
      .replace(/>/g, '>').replace(/"/g, '"').replace(/'/g, '&#39;');
  }

  var _audioCtx = null;
  function playSfx(kind) {
    try {
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!_audioCtx) _audioCtx = new AC();
      if (_audioCtx.state === 'suspended') _audioCtx.resume();
      var t0 = _audioCtx.currentTime;
      function tone(freq, start, dur, type, gain) {
        var o = _audioCtx.createOscillator();
        var g = _audioCtx.createGain();
        o.type = type || 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, t0 + start);
        g.gain.exponentialRampToValueAtTime(gain || 0.14, t0 + start + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + dur);
        o.connect(g); g.connect(_audioCtx.destination);
        o.start(t0 + start); o.stop(t0 + start + dur + 0.03);
      }
      if (kind === 'ok') { tone(660, 0, 0.11); tone(880, 0.09, 0.15); }
      else if (kind === 'bad') { tone(220, 0, 0.16, 'square', 0.07); tone(160, 0.11, 0.2, 'square', 0.05); }
      else if (kind === 'combo') { tone(523, 0, 0.09); tone(659, 0.09, 0.09); tone(784, 0.18, 0.16); }
      else if (kind === 'streak') { tone(440, 0, 0.07); tone(554, 0.07, 0.07); tone(659, 0.14, 0.07); tone(880, 0.21, 0.18); }
    } catch (e) {}
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

  function getTheoryBits(n) {
    var lesson = DATA[n];
    if (!lesson) return [];
    return (lesson.inhoud || []).filter(function (item) {
      return ['tekst', 'regel', 'kop'].indexOf(item.type) >= 0 &&
        plain(item.tekst).length >= 20 &&
        !/^Woordenlijst van les\b/i.test(plain(item.tekst));
    }).map(function (item) { return plain(item.tekst); });
  }
  function lessonTextBlob(n) {
    var lesson = DATA[n];
    if (!lesson) return '';
    return (lesson.inhoud || []).map(function (item) {
      return plain(item.tekst || '') + ' ' + plain(item.ar || '') + ' ' +
