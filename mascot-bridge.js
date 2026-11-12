/* Mascot inject + klikbare buddy die wegvliegt */
(function () {
  var root = null;
  var scheduled = 0;
  var flying = false;
  var goneUntil = 0;

  function img(kind, cls) {
    if (!window.AL_MASCOT || !AL_MASCOT.img) return '';
    if (AL_MASCOT.preload) AL_MASCOT.preload(kind);
    return AL_MASCOT.img(kind, cls || 'gd-mascot');
  }

  function injectFeedback() {
    var nodes = (root || document).querySelectorAll('.gd-feedback-inner');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.querySelector('.gd-mascot')) continue;
      var sheet = el.closest('.gd-feedback') || el.closest('.gd-feedback-sheet');
      var good = sheet && (sheet.classList.contains('good') || sheet.classList.contains('ok'));
      var kind = good ? ((root || document).querySelector('.gd-combo') ? 'proud' : 'happy') : 'sad';
      var head = document.createElement('div');
      head.className = 'gd-feedback-head';
      head.innerHTML = img(kind, 'gd-mascot gd-mascot-anim');
      var strong = el.querySelector('strong');
      if (strong) {
        head.appendChild(strong.cloneNode(true));
        strong.replaceWith(head);
      } else {
        el.insertBefore(head, el.firstChild);
      }
    }
  }

  function injectFinish() {
    var nodes = (root || document).querySelectorAll('.gd-finish');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.querySelector('.gd-finish-mascot')) continue;
      var acc = 50;
      var accEl = el.querySelector('.gd-result-grid span:nth-child(2) strong');
      if (accEl) acc = parseInt(accEl.textContent, 10) || 50;
      var kind = acc >= 80 ? 'proud' : (acc >= 50 ? 'happy' : 'sad');
      var wrap = document.createElement('div');
      wrap.className = 'gd-finish-mascot';
      wrap.setAttribute('aria-hidden', 'true');
      wrap.innerHTML = img(kind, 'gd-mascot gd-mascot-anim');
      el.insertBefore(wrap, el.firstChild);
      var icon = el.querySelector('.gd-finish-icon');
      if (icon) icon.style.display = 'none';
    }
  }

  function injectStreak() {
    var nodes = (root || document).querySelectorAll('.lh-streak');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.querySelector('.lh-streak-mascot')) continue;
      var zero = !!el.querySelector('.lh-streak-ic.zero');
      var kind = zero ? 'sad' : 'proud';
      var wrap = document.createElement('div');
      wrap.className = 'lh-streak-mascot';
      wrap.setAttribute('aria-hidden', 'true');
      wrap.innerHTML = img(kind, 'gd-mascot gd-mascot-sm');
      var ic = el.querySelector('.lh-streak-ic');
      if (ic && ic.parentNode === el) ic.insertAdjacentElement('afterend', wrap);
      else el.appendChild(wrap);
    }
  }

  function injectEmpty() {
    var nodes = (root || document).querySelectorAll('.lh-empty');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.querySelector('.lh-empty-mascot')) continue;
      var wrap = document.createElement('div');
      wrap.className = 'lh-empty-mascot';
      wrap.setAttribute('aria-hidden', 'true');
      wrap.innerHTML = img('proud', 'gd-mascot gd-mascot-md');
      var icon = el.querySelector('.lh-empty-ic');
      if (icon) icon.replaceWith(wrap);
      else el.insertBefore(wrap, el.firstChild);
    }
  }

  /* Vaste buddy rechtsonder op home */
  function onHome() {
    var lh = document.querySelector('.lh');
    return !!(lh && !document.querySelector('.gd-play, .gd-shell.gd-play'));
  }

  function ensureBuddy() {
    if (Date.now() < goneUntil) return;
    if (flying) return;
    if (!onHome()) {
      var existing = document.getElementById('al-mascot-buddy');
      if (existing) existing.remove();
      return;
    }
    if (document.getElementById('al-mascot-buddy')) return;
    if (!window.AL_MASCOT || !AL_MASCOT.img) return;
    if (AL_MASCOT.preload) AL_MASCOT.preload('happy');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'al-mascot-buddy';
    btn.className = 'al-mascot-buddy';
    btn.setAttribute('aria-label', 'Mascotte, tik om te laten wegvliegen');
    btn.innerHTML = img('happy', 'gd-mascot gd-mascot-buddy');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      flyAway(btn);
    });
    document.body.appendChild(btn);
  }

  function flyAway(btn) {
    if (flying || !btn || !btn.isConnected) return;
    flying = true;
    btn.classList.add('is-flying');
    btn.disabled = true;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ms = reduce ? 120 : 1900;
    setTimeout(function () {
      if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
      flying = false;
      goneUntil = Date.now() + 12000; // 12s weg, dan terug
      setTimeout(ensureBuddy, 12100);
    }, ms);
  }

  function inject() {
    scheduled = 0;
    try {
      injectFeedback();
      injectFinish();
      injectStreak();
      injectEmpty();
      ensureBuddy();
    } catch (_e) {}
  }

  function schedule() {
    if (scheduled) return;
    scheduled = 1;
    if (window.requestAnimationFrame) requestAnimationFrame(inject);
    else setTimeout(inject, 32);
  }

  function start() {
    root = document.getElementById('gd-app') || document.body;
    inject();
    if (!root) return;
    var obs = new MutationObserver(schedule);
    obs.observe(root, { childList: true, subtree: true });
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();
