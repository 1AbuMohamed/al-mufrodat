/* Mascot bridge: zet de mascotte op de startpagina, naast de vragen, in de feedbackbalk en op het eindscherm.
 * De app bouwt schermen steeds opnieuw op; daarom onthoudt deze bridge wat al is getoond, zodat de mascotte
 * alleen bij een nieuw scherm binnenvliegt of springt en niet bij elke klik opnieuw begint.
 */
(function () {
  'use strict';
  var M = window.AL_MASCOT;
  if (!M) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var last = { task: '', fb: '', hero: 0, theory: '', finish: null };
  var busy = false, queued = false;

  function mk(pose, cls) { return M.html(pose, cls); }
  function rand() { return (Math.random() * -4).toFixed(2) + 's'; }
  function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstChild; }
  function txt(node) { return node ? (node.textContent || '').replace(/\s+/g, ' ').trim() : ''; }

  /* ---------- naast de vraag ---------- */
  function sheetState() {
    var s = document.querySelector('.gd-feedback-sheet, .gd-feedback');
    if (!s) return '';
    return s.classList.contains('good') ? 'good' : (s.classList.contains('review') ? 'bad' : '');
  }
  function injectCoach() {
    document.querySelectorAll('.gd-card .gd-task-title').forEach(function (title) {
      var card = title.closest('.gd-card');
      if (!card || card.querySelector('.am-coach')) return;
      var tag = txt(card.querySelector('.gd-stage-tag')), sig = tag + '|' + txt(title);
      var isNew = sig !== last.task; last.task = sig;
      var fb = sheetState(), key = fb ? sig + '|' + fb : '';
      var pose = fb === 'good' ? (document.querySelector('.gd-combo') ? 'proud' : 'cheer') : fb === 'bad' ? 'sad'
        : (card.querySelector('.gd-option.selected, [aria-pressed="true"]') ? 'think' : 'happy');
      var first = /\b1\s*\/\s*\d+/.test(tag) || /\b1\b/.test(tag) && !last.firstSeen;
      var coach = el('<div class="am-coach">' + mk(pose, '') + '<div class="am-bubble" aria-hidden="true">' + title.innerHTML + '</div></div>');
      var m = coach.querySelector('.am');
      m.style.setProperty('--am-d', rand());
      if (!reduce && isNew) m.classList.add(first && !last.flown ? 'am-fly' : 'am-pop');
      if (first && isNew) last.flown = true;
      title.classList.add('am-title-hidden');
      title.parentNode.insertBefore(coach, title);
      if (key && key !== last.fb) M.react(m, fb === 'good' ? 'jump' : 'sad');
      last.fb = key;
    });
    if (!document.querySelector('.gd-feedback-sheet, .gd-feedback')) last.fb = '';
    if (!document.querySelector('.gd-task-title')) { last.task = ''; }
  }

  /* ---------- theoriekaarten: korte aanmoediging ---------- */
  var TIPS = ['Lees de uitleg rustig door. Daarna gaan we oefenen!', 'Goed bezig, nog een stukje!', 'Snap je dit? Dan oefenen we zo.', 'Je bent er bijna klaar voor!'];
  function injectTheory() {
    document.querySelectorAll('.gd-card').forEach(function (card) {
      if (card.querySelector('.am-coach') || card.querySelector('.gd-task-title')) return;
      var tag = card.querySelector('.gd-stage-tag');
      if (!tag || !/theorie/i.test(tag.textContent) || !document.querySelector('[data-action="theory-next"],[data-action="theory-start"]')) return;
      var t = txt(tag), isNew = t !== last.theory; last.theory = t;
      var n = parseInt((/kaart\s+(\d+)/i.exec(t) || [0, 1])[1], 10) || 1;
      var coach = el('<div class="am-coach am-tip">' + mk('happy', '') + '<div class="am-bubble" aria-hidden="true">' +
        TIPS[(n - 1) % TIPS.length].replace(/&/g, '&amp;') + '</div></div>');
      var m = coach.querySelector('.am'); m.style.setProperty('--am-d', rand());
      if (!reduce && isNew) m.classList.add(n === 1 ? 'am-fly' : 'am-pop');
      tag.insertAdjacentElement('afterend', coach);
    });
    if (!document.querySelector('.gd-stage-tag')) last.theory = '';
  }

  /* ---------- feedbackbalk ---------- */
  function injectFeedback() {
    // De mascotte naast de vraag reageert al; alleen zonder die mascotte komt er een in de balk.
    if (document.querySelector('.am-coach')) return;
    document.querySelectorAll('.gd-feedback-inner').forEach(function (inner) {
      if (inner.querySelector('.am')) return;
      var sheet = inner.closest('.gd-feedback'), good = sheet && sheet.classList.contains('good');
      var head = el('<div class="gd-feedback-head">' + mk(good ? (document.querySelector('.gd-combo') ? 'proud' : 'cheer') : 'sad', '') + '</div>');
      var strong = inner.querySelector('strong');
      if (strong) { head.appendChild(strong.cloneNode(true)); strong.replaceWith(head); } else inner.insertBefore(head, inner.firstChild);
      var m = head.querySelector('.am'); m.style.setProperty('--am-d', rand());
      if (!reduce) M.react(m, good ? 'jump' : 'sad');
    });
  }

  /* ---------- eindscherm ---------- */
  function injectFinish() {
    document.querySelectorAll('.gd-finish').forEach(function (fin) {
      if (fin.querySelector('.gd-finish-mascot')) return;
      var accEl = fin.querySelector('.gd-result-grid span:nth-child(2) strong');
      var acc = accEl ? parseInt(accEl.textContent, 10) : NaN;
      var failed = /geen hartjes|afgebroken/i.test(txt(fin));
      var pose = failed ? 'sad' : (isNaN(acc) || acc >= 80 ? 'cheer' : acc >= 50 ? 'happy' : 'sad');
      var wrap = el('<div class="gd-finish-mascot">' + mk(pose, '') + '</div>');
      var m = wrap.querySelector('.am'); m.style.setProperty('--am-d', rand());
      var old = fin.querySelector('.gd-finish-icon'); if (old) old.style.display = 'none';
      fin.insertBefore(wrap, fin.firstChild);
      if (!reduce) { m.classList.add('am-pop'); if (pose === 'cheer') { M.react(m, 'jump'); M.confetti(document.body); } }
    });
  }

  /* ---------- startpagina ---------- */
  function greet() {
    var h = new Date().getHours();
    return h < 12 ? 'Goedemorgen! Klaar om te leren?' : h < 18 ? 'Hoi! Zullen we oefenen?' : 'Goedenavond! Nog even oefenen?';
  }
  var CHAT = ['Elke dag een beetje, dan kom je er!', 'Jij kunt dit!', 'Kleine stapjes tellen ook.', 'Zullen we een les doen?', 'Bismillah, we beginnen!'];
  function injectHero() {
    document.querySelectorAll('.lh-hero').forEach(function (hero) {
      if (hero.querySelector('.am-hero')) return;
      var old = hero.querySelector('.lh-hero-mascot'); if (old) old.remove();
      var now = Date.now(), fresh = now - last.hero > 45000; last.hero = now;
      var box = el('<div class="am-hero">' + mk('wave', 'am-click') + '<div class="am-bubble" aria-hidden="true">' + greet() + '</div></div>');
      var m = box.querySelector('.am'); m.style.setProperty('--am-d', rand());
      if (!reduce && fresh) m.classList.add('am-fly');
      hero.insertBefore(box, hero.firstChild);
    });
  }
  document.addEventListener('click', function (e) {
    var m = e.target.closest && e.target.closest('.am-click');
    if (!m) return;
    M.react(m, 'hop');
    var b = m.parentNode && m.parentNode.querySelector('.am-bubble');
    if (b) { b.textContent = CHAT[Math.floor(Math.random() * CHAT.length)]; b.style.animation = 'none'; void b.offsetWidth; b.style.animation = ''; }
  });

  /* ---------- streak en lege toestanden ---------- */
  function injectStreak() {
    document.querySelectorAll('.lh-streak').forEach(function (card) {
      if (card.querySelector('.lh-streak-mascot')) return;
      var zero = !!card.querySelector('.lh-streak-ic.zero');
      var wrap = el('<div class="lh-streak-mascot">' + mk(zero ? 'sad' : 'proud', '') + '</div>');
      wrap.firstChild.style.setProperty('--am-d', rand());
      var ic = card.querySelector('.lh-streak-ic');
      if (ic && ic.parentNode === card) ic.insertAdjacentElement('afterend', wrap); else card.insertBefore(wrap, card.firstChild);
    });
  }
  function injectEmpty() {
    document.querySelectorAll('.lh-empty').forEach(function (box) {
      if (box.querySelector('.lh-empty-mascot')) return;
      var wrap = el('<div class="lh-empty-mascot">' + mk('proud', '') + '</div>');
      var ic = box.querySelector('.lh-empty-ic');
      if (ic) ic.replaceWith(wrap); else box.insertBefore(wrap, box.firstChild);
    });
  }

  function run() {
    busy = true;
    try { injectCoach(); injectTheory(); injectFeedback(); injectFinish(); injectHero(); injectStreak(); injectEmpty(); } catch (_e) {}
    if (obs) obs.takeRecords();
    busy = false;
  }
  function schedule() {
    if (busy || queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; run(); });
  }
  var obs = new MutationObserver(schedule);
  function start() { run(); if (document.body) obs.observe(document.body, { childList: true, subtree: true }); }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
