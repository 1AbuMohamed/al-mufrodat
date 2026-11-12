/* Overlay: geluiden (juist/fout/streak) + zinsontleding tip */
(function () {
  'use strict';

  var audioCtx = null;
  var unlocked = false;
  var lastGood = null;
  var lastWrong = null;
  var lastFinish = null;

  var LABEL_INFO = {
    'moebtada': { ar: '\u0645\u0628\u062A\u062F\u0623', mean: 'onderwerp (van de nominale zin)' },
    'khabar': { ar: '\u062E\u0628\u0631', mean: 'gezegde / wat over het onderwerp gezegd wordt' },
    "fi'l": { ar: '\u0641\u0639\u0644', mean: 'werkwoord' },
    'ism': { ar: '\u0627\u0633\u0645', mean: 'naamwoord' },
    'harf': { ar: '\u062D\u0631\u0641', mean: 'partikel (klein functiewoordje)' },
    "faa'il": { ar: '\u0641\u0627\u0639\u0644', mean: 'onderwerp bij een werkwoord' },
    "maf'ool": { ar: '\u0645\u0641\u0639\u0648\u0644', mean: 'lijdend voorwerp' },
    'jaar': { ar: '\u062C\u0627\u0631', mean: 'voorzetsel (met madjroer)' },
    "na't": { ar: '\u0646\u0639\u062A', mean: 'bijvoeglijke bepaling' },
    'mudaaf': { ar: '\u0645\u0636\u0627\u0641', mean: 'eerste deel van een idafa-constructie' },
    'damiir': { ar: '\u0636\u0645\u064A\u0631', mean: 'voornaamwoord' }
  };

  function muted() {
    try {
      var s = JSON.parse(localStorage.getItem('alm_grammar_test_settings_v1') || '{}');
      return s.sound === false;
    } catch (e) {
      return false;
    }
  }

  function ensureAudio() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      unlocked = true;
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  function tone(freq, start, dur, type, gain) {
    if (muted()) return;
    var ctx = ensureAudio();
    if (!ctx) return;
    try {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, ctx.currentTime + start);
      var vol = gain == null ? 0.22 : gain;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      g.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + start + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(ctx.currentTime + start);
      o.stop(ctx.currentTime + start + dur + 0.03);
    } catch (e) {}
  }

  function sfxCorrect() {
    tone(523.25, 0, 0.14, 'sine', 0.28);
    tone(659.25, 0.09, 0.16, 'sine', 0.24);
    tone(783.99, 0.18, 0.2, 'triangle', 0.2);
  }
  function sfxWrong() {
    tone(200, 0, 0.2, 'sawtooth', 0.16);
    tone(150, 0.14, 0.24, 'sawtooth', 0.14);
  }
  function sfxCombo(n) {
    var base = 600 + Math.min(n, 10) * 40;
    tone(base, 0, 0.12, 'triangle', 0.2);
    tone(base * 1.25, 0.09, 0.14, 'triangle', 0.18);
    tone(base * 1.5, 0.18, 0.18, 'sine', 0.16);
  }
  function sfxStreak() {
    tone(392, 0, 0.12, 'triangle', 0.2);
    tone(523.25, 0.12, 0.14, 'triangle', 0.2);
    tone(659.25, 0.24, 0.16, 'triangle', 0.2);
    tone(783.99, 0.38, 0.24, 'sine', 0.22);
  }
  function sfxPerfect() {
    tone(523.25, 0, 0.14, 'sine', 0.22);
    tone(659.25, 0.12, 0.14, 'sine', 0.22);
    tone(783.99, 0.24, 0.14, 'sine', 0.22);
    tone(1046.5, 0.38, 0.3, 'triangle', 0.26);
  }
  function sfxClick() {
    tone(880, 0, 0.04, 'sine', 0.08);
  }


  function sfxMascotChirp() {
    tone(880, 0, 0.08, 'sine', 0.16);
    tone(1175, 0.07, 0.1, 'sine', 0.14);
  }
  function sfxMascotWhoosh() {
    tone(420, 0, 0.18, 'triangle', 0.1);
    tone(280, 0.05, 0.22, 'sine', 0.08);
    tone(180, 0.12, 0.2, 'triangle', 0.06);
  }
  function sfxMascotPop() {
    tone(660, 0, 0.07, 'sine', 0.14);
    tone(990, 0.05, 0.09, 'sine', 0.12);
  }
  window.playLabSfx = {
    correct: sfxCorrect,
    mascotChirp: sfxMascotChirp,
    mascotWhoosh: sfxMascotWhoosh,
    mascotPop: sfxMascotPop,
    wrong: sfxWrong,
    combo: sfxCombo,
    streak: sfxStreak,
    perfect: sfxPerfect,
    click: sfxClick,
    unlock: ensureAudio
  };

  function showLabelTip(lab) {
    var info = LABEL_INFO[lab];
    if (!info) return;
    var host = document.querySelector('.gd-parse-labels') || document.querySelector('.gd-task-main');
    if (!host) return;
    var tip = document.querySelector('.gd-label-tip');
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'gd-label-tip';
      tip.setAttribute('role', 'status');
      host.insertAdjacentElement('afterend', tip);
    }
    tip.innerHTML =
      '<strong>' +
      lab +
      '</strong> <span lang="ar" dir="rtl" class="gd-label-tip-ar">' +
      info.ar +
      '</span><span class="gd-label-tip-mean"> \u2014 ' +
      info.mean +
      '</span>';
  }

  function fixFeedbackDOM() {
    var sheet = document.querySelector('.gd-feedback-sheet.review .gd-feedback-inner');
    if (!sheet) return;
    var strong = sheet.querySelector('strong');
    if (!strong) return;
    if (strong.textContent.trim() === 'Fout') return;
    // Alleen herschrijven als het geen duidelijke fout-kop is
    var t = strong.textContent.trim();
    if (/juist|goed|prima|uitstekend/i.test(t)) return;
    if (/^juiste antwoord/i.test(t)) {
      strong.textContent = 'Fout';
      var label = sheet.querySelector('.gd-feedback-correct-label');
      if (!label) {
        label = document.createElement('p');
        label.className = 'gd-feedback-correct-label';
        label.textContent = 'Dit is het juiste antwoord:';
        strong.insertAdjacentElement('afterend', label);
      }
    }
  }

  function scanFeedback() {
    fixFeedbackDOM();
    var good = document.querySelector('.gd-feedback-sheet.good');
    var bad = document.querySelector('.gd-feedback-sheet.review');
    var finish = document.querySelector('.gd-finish');

    if (good && good !== lastGood) {
      lastGood = good;
      lastWrong = null;
      var comboEl = good.querySelector('.gd-combo');
      var combo = 0;
      if (comboEl) {
        var m = comboEl.textContent.match(/(\d+)/);
        if (m) combo = parseInt(m[1], 10);
      }
      if (combo >= 3 && combo % 3 === 0) sfxCombo(combo);
      else sfxCorrect();
      if (combo === 5 || combo === 10) sfxStreak();
    } else if (bad && bad !== lastWrong) {
      lastWrong = bad;
      lastGood = null;
      sfxWrong();
    }

    if (finish && finish !== lastFinish) {
      lastFinish = finish;
      var hearts = document.querySelectorAll('.gd-bar-hearts .on, .gd-hearts .alive');
      if (hearts.length >= 5) sfxPerfect();
      else sfxStreak();
    }

    if (!good) lastGood = null;
    if (!bad) lastWrong = null;
    if (!finish) lastFinish = null;
  }

  function watchSession() {
    var app = document.getElementById('gd-app');
    if (!app) return;

    var mo = new MutationObserver(function () {
      scanFeedback();
    });
    mo.observe(app, { childList: true, subtree: true });

    // Extra: na CONTROLEER / next even scannen
    app.addEventListener(
      'click',
      function (e) {
        ensureAudio();
        var btn = e.target.closest
          ? e.target.closest('[data-action="check"], [data-action="next"], .gd-primary, .gd-option, .gd-parse-lab')
          : null;
        if (!btn) return;
        var lab = (btn.getAttribute('data-value') || btn.textContent || '').trim();
        if (LABEL_INFO[lab]) showLabelTip(lab);
        setTimeout(scanFeedback, 30);
        setTimeout(scanFeedback, 120);
      },
      true
    );
  }

  function unlock() {
    ensureAudio();
  }

  document.addEventListener('pointerdown', unlock, { passive: true, capture: true });
  document.addEventListener('keydown', unlock, { passive: true, capture: true });
  document.addEventListener('touchstart', unlock, { passive: true, capture: true });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watchSession);
  else watchSession();
})();
