/* Overlay: geluiden + zinsontleding tip (fonetisch + NL betekenis) */
(function(){
  'use strict';
  var audioCtx = null;
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
  function ensureAudio(){
    try{
      if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
      if(audioCtx.state==='suspended') audioCtx.resume();
    }catch(e){ audioCtx=null; }
    return audioCtx;
  }
  function tone(freq, start, dur, type, gain){
    var ctx=ensureAudio(); if(!ctx) return;
    var o=ctx.createOscillator(), g=ctx.createGain();
    o.type=type||'sine';
    o.frequency.value=freq;
    g.gain.setValueAtTime(0.0001, ctx.currentTime+start);
    g.gain.exponentialRampToValueAtTime(gain||0.12, ctx.currentTime+start+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+start+dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(ctx.currentTime+start);
    o.stop(ctx.currentTime+start+dur+0.02);
  }
  function sfxCorrect(){ tone(523.25,0,0.12,'sine',0.14); tone(659.25,0.08,0.14,'sine',0.12); tone(783.99,0.16,0.18,'triangle',0.10); }
  function sfxWrong(){ tone(180,0,0.18,'sawtooth',0.08); tone(140,0.12,0.22,'sawtooth',0.07); }
  function sfxCombo(n){ var base=600+Math.min(n,10)*40; tone(base,0,0.1,'triangle',0.1); tone(base*1.25,0.08,0.12,'triangle',0.09); tone(base*1.5,0.16,0.16,'sine',0.08); }
  function sfxStreak(){ tone(392,0,0.1,'triangle',0.1); tone(523.25,0.1,0.12,'triangle',0.1); tone(659.25,0.2,0.14,'triangle',0.1); tone(783.99,0.32,0.22,'sine',0.11); }
  function sfxPerfect(){ tone(523.25,0,0.12,'sine',0.12); tone(659.25,0.1,0.12,'sine',0.12); tone(783.99,0.2,0.12,'sine',0.12); tone(1046.5,0.32,0.28,'triangle',0.14); }

  function showLabelTip(lab){
    var info = LABEL_INFO[lab];
    if(!info) return;
    var host = document.querySelector('.gd-parse-labels') || document.querySelector('.gd-task-main');
    if(!host) return;
    var tip = document.querySelector('.gd-label-tip');
    if(!tip){
      tip = document.createElement('div');
      tip.className = 'gd-label-tip';
      tip.setAttribute('role','status');
      host.insertAdjacentElement('afterend', tip);
    }
    tip.innerHTML = '<strong>'+lab+'</strong> <span lang="ar" dir="rtl" class="gd-label-tip-ar">'+info.ar+'</span><span class="gd-label-tip-mean"> \u2014 '+info.mean+'</span>';
  }

  function fixFeedbackDOM(){
    var sheet = document.querySelector('.gd-feedback-sheet.review .gd-feedback-inner');
    if(!sheet) return;
    var strong = sheet.querySelector('strong');
    if(!strong) return;
    if(strong.textContent.trim() === 'Fout') return;
    strong.textContent = 'Fout';
    var label = sheet.querySelector('.gd-feedback-correct-label');
    if(!label){
      label = document.createElement('p');
      label.className = 'gd-feedback-correct-label';
      label.textContent = 'Dit is het juiste antwoord:';
      strong.insertAdjacentElement('afterend', label);
    }
  }

  var lastGood = null, lastWrong = null;
  function watchSession(){
    var app = document.getElementById('gd-app');
    if(!app) return;
    var mo = new MutationObserver(function(){
      fixFeedbackDOM();
      var good = document.querySelector('.gd-feedback-sheet.good');
      var bad = document.querySelector('.gd-feedback-sheet.review');
      var finish = document.querySelector('.gd-finish');
      if(good && good !== lastGood){
        lastGood = good;
        lastWrong = null;
        var comboEl = good.querySelector('.gd-combo');
        var combo = 0;
        if(comboEl){
          var m = comboEl.textContent.match(/(\d+)/);
          if(m) combo = parseInt(m[1],10);
        }
        if(combo >= 3 && combo % 3 === 0) sfxCombo(combo);
        else sfxCorrect();
        if(combo === 5 || combo === 10) sfxStreak();
      } else if(bad && bad !== lastWrong){
        lastWrong = bad;
        lastGood = null;
        sfxWrong();
      }
      if(finish && !finish.dataset.sfxDone){
        finish.dataset.sfxDone = '1';
        var hearts = document.querySelectorAll('.gd-hearts .alive');
        if(hearts.length === 5) sfxPerfect();
        else sfxStreak();
      }
      if(!good) lastGood = null;
      if(!bad) lastWrong = null;
    });
    mo.observe(app, {childList:true, subtree:true});

    app.addEventListener('click', function(e){
      var btn = e.target.closest('.gd-parse-lab, .gd-option');
      if(!btn) return;
      var lab = (btn.getAttribute('data-value') || btn.textContent || '').trim();
      if(LABEL_INFO[lab]) showLabelTip(lab);
    }, true);
  }

  document.addEventListener('click', function(){ ensureAudio(); }, {passive:true});
  document.addEventListener('keydown', function(){ ensureAudio(); }, {passive:true});

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watchSession);
  else watchSession();
})();
