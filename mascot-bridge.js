/* Mascot: feedback + buddy die rondvliegt, zwaait en geluid maakt */
(function () {
  var root = null;
  var scheduled = 0;
  var flying = false;
  var goneUntil = 0;
  var lastSpot = -1;
  var roamTimer = null;
  var emoTimer = null;
  var moods = ['happy', 'wave', 'proud', 'wave', 'happy'];

  function img(kind, cls) {
    if (!window.AL_MASCOT || !AL_MASCOT.img) return '';
    if (AL_MASCOT.preload) AL_MASCOT.preload(kind);
    return AL_MASCOT.img(kind, cls || 'gd-mascot');
  }

  function sfx(name) {
    try {
      if (window.playLabSfx && typeof playLabSfx[name] === 'function') playLabSfx[name]();
    } catch (_e) {}
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

  function injectEmpty() {
    var nodes = (root || document).querySelectorAll('.lh-empty');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.querySelector('.lh-empty-mascot')) continue;
      var wrap = document.createElement('div');
      wrap.className = 'lh-empty-mascot';
      wrap.setAttribute('aria-hidden', 'true');
      wrap.innerHTML = img('happy', 'gd-mascot gd-mascot-md');
      var icon = el.querySelector('.lh-empty-ic');
      if (icon) icon.replaceWith(wrap);
      else el.insertBefore(wrap, el.firstChild);
    }
  }

  function onHome() {
    var lh = document.querySelector('.lh');
    return !!(lh && !document.querySelector('.gd-play, .gd-shell.gd-play'));
  }

  function randomSpot() {
    /* vermijd linker kolom (nav) — vooral desktop */
    var wide = (typeof window !== 'undefined' && window.innerWidth >= 900);
    var spots = wide ? [
      { t: 10, l: 55 }, { t: 10, l: 80 },
      { t: 22, l: 58 }, { t: 22, l: 78 },
      { t: 36, l: 52 }, { t: 36, l: 82 },
      { t: 50, l: 56 }, { t: 50, l: 78 },
      { t: 64, l: 54 }, { t: 64, l: 74 }
    ] : [
      { t: 10, l: 8 }, { t: 10, l: 78 },
      { t: 22, l: 10 }, { t: 22, l: 75 },
      { t: 36, l: 8 }, { t: 36, l: 80 },
      { t: 50, l: 10 }, { t: 50, l: 76 },
      { t: 64, l: 12 }, { t: 64, l: 72 }
    ];
    var i = Math.floor(Math.random() * spots.length);
    if (spots.length > 1 && i === lastSpot) {
      i = (i + 1 + Math.floor(Math.random() * (spots.length - 1))) % spots.length;
    }
    lastSpot = i;
    var s = spots[i];
    return {
      top: Math.max(6, Math.min(74, s.t + (Math.random() * 5 - 2.5))),
      left: Math.max(3, Math.min(84, s.l + (Math.random() * 5 - 2.5)))
    };
  }

  function clearBuddyTimers() {
    if (roamTimer) { clearTimeout(roamTimer); roamTimer = null; }
    if (emoTimer) { clearTimeout(emoTimer); emoTimer = null; }
  }

  function setMood(btn, kind) {
    if (!btn || !window.AL_MASCOT || !AL_MASCOT.setKind) return;
    var visual = SRC_KIND(kind);
    AL_MASCOT.setKind(btn, visual);
    btn.classList.remove('is-waving', 'is-bob');
    if (kind === 'wave') {
      btn.classList.add('is-waving');
    } else {
      btn.classList.add('is-bob');
    }
  }
  function SRC_KIND(kind) {
    if (kind === 'wave' || kind === 'proud' || kind === 'sad' || kind === 'happy') return kind;
    return 'happy';
  }



  function scheduleMood(btn) {
    if (emoTimer) clearTimeout(emoTimer);
    emoTimer = setTimeout(function () {
      if (!btn.isConnected || flying) return;
      var k = moods[Math.floor(Math.random() * moods.length)];
      setMood(btn, k);
      scheduleMood(btn);
    }, 2800 + Math.random() * 3200);
  }

  function glideTo(btn, spot, withSound) {
    if (!btn || !btn.isConnected || flying) return;
    btn.classList.add('is-gliding');
    btn.style.top = spot.top + 'vh';
    btn.style.left = spot.left + 'vw';
    var dirX = spot.left < 40 ? -1 : 1;
    var dirY = spot.top < 40 ? -1 : 1;
    btn.style.setProperty('--fly-x', (dirX * (70 + Math.random() * 50)) + 'vw');
    btn.style.setProperty('--fly-y', (dirY * (45 + Math.random() * 35)) + 'vh');
    setTimeout(function () {
      if (btn.isConnected) btn.classList.remove('is-gliding');
    }, 1200);
  }

  function scheduleRoam(btn) {
    if (roamTimer) clearTimeout(roamTimer);
    roamTimer = setTimeout(function () {
      if (!btn.isConnected || flying || !onHome()) return;
      glideTo(btn, randomSpot());
      // soms zwaaien bij aankomst
      setTimeout(function () {
        if (btn.isConnected && !flying && Math.random() < 0.55) setMood(btn, 'wave');
      }, 900);
      scheduleRoam(btn);
    }, 60000 + Math.random() * 60000);
  }

  function placeBuddy(btn, animateIn) {
    var s = randomSpot();
    btn.style.top = s.top + 'vh';
    btn.style.left = s.left + 'vw';
    btn.style.right = 'auto';
    btn.style.bottom = 'auto';
    var dirX = s.left < 40 ? -1 : 1;
    var dirY = s.top < 40 ? -1 : 1;
    btn.style.setProperty('--fly-x', (dirX * (70 + Math.random() * 50)) + 'vw');
    btn.style.setProperty('--fly-y', (dirY * (45 + Math.random() * 35)) + 'vh');
    if (animateIn) {
      btn.classList.add('is-arrive');
      setTimeout(function () {
        if (btn.isConnected) btn.classList.remove('is-arrive');
      }, 600);
    }
  }

  function ensureBuddy() {
    if (Date.now() < goneUntil) return;
    if (flying) return;
    if (!onHome()) {
      clearBuddyTimers();
      var existing = document.getElementById('al-mascot-buddy');
      if (existing) existing.remove();
      return;
    }
    if (document.getElementById('al-mascot-buddy')) return;
    if (!window.AL_MASCOT || !AL_MASCOT.img) return;
    if (AL_MASCOT.preloadAll) AL_MASCOT.preloadAll();
    else if (AL_MASCOT.preload) AL_MASCOT.preload('happy');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'al-mascot-buddy';
    btn.className = 'al-mascot-buddy is-bob';
    btn.setAttribute('aria-label', 'Mascotte, tik om te laten wegvliegen');
    btn.innerHTML = img('happy', 'gd-mascot gd-mascot-buddy');
    placeBuddy(btn, true);
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      flyAway(btn);
    });
    document.body.appendChild(btn);
    scheduleRoam(btn);
    scheduleMood(btn);
  }

  function flyAway(btn) {
    if (flying || !btn || !btn.isConnected) return;
    flying = true;
    clearBuddyTimers();
    btn.classList.remove('is-bob', 'is-waving', 'is-gliding', 'is-arrive');
    btn.classList.add('is-flying');
    btn.disabled = true;
    sfx('mascotWhoosh');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ms = reduce ? 150 : 2000;
    setTimeout(function () {
      if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
      flying = false;
      goneUntil = Date.now() + 2800;
      setTimeout(ensureBuddy, 2900);
    }, ms);
  }

  function inject() {
    scheduled = 0;
    try {
      document.querySelectorAll('.lh-streak-mascot').forEach(function (n) { n.remove(); });
      injectFeedback();
      injectFinish();
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
