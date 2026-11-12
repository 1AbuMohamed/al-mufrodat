/* Mascot bridge: injects mascot into feedback, finish, hero, streak, empty states */
(function () {
  function img(kind, cls) {
    if (!window.AL_MASCOT || !AL_MASCOT.img) return '';
    return AL_MASCOT.img(kind, cls || 'gd-mascot');
  }

  function injectFeedback() {
    document.querySelectorAll('.gd-feedback-inner').forEach(function (el) {
      if (el.querySelector('.gd-mascot')) return;
      var good = el.closest('.gd-feedback') && el.closest('.gd-feedback').classList.contains('good');
      var kind = good ? (document.querySelector('.gd-combo') ? 'proud' : 'happy') : 'sad';
      var head = document.createElement('div');
      head.className = 'gd-feedback-head';
      head.innerHTML = img(kind, 'gd-mascot');
      var strong = el.querySelector('strong');
      if (strong) {
        head.appendChild(strong.cloneNode(true));
        strong.replaceWith(head);
      } else {
        el.insertBefore(head, el.firstChild);
      }
    });
  }

  function injectFinish() {
    document.querySelectorAll('.gd-finish').forEach(function (el) {
      if (el.querySelector('.gd-finish-mascot')) return;
      var acc = 50;
      var accEl = el.querySelector('.gd-result-grid span:nth-child(2) strong');
      if (accEl) acc = parseInt(accEl.textContent, 10) || 50;
      var kind = acc >= 80 ? 'proud' : (acc >= 50 ? 'happy' : 'sad');
      var wrap = document.createElement('div');
      wrap.className = 'gd-finish-mascot';
      wrap.innerHTML = img(kind, 'gd-mascot');
      el.insertBefore(wrap, el.firstChild);
    });
  }

  function injectHero() {
    document.querySelectorAll('.lh-hero').forEach(function (el) {
      if (el.querySelector('.lh-hero-mascot')) return;
      var wrap = document.createElement('div');
      wrap.className = 'lh-hero-mascot';
      wrap.innerHTML = img('happy', 'gd-mascot gd-mascot-lg');
      wrap.setAttribute('aria-hidden', 'true');
      el.insertBefore(wrap, el.firstChild);
    });
  }

  function injectStreak() {
    document.querySelectorAll('.lh-streak').forEach(function (el) {
      if (el.querySelector('.lh-streak-mascot')) return;
      var zero = !!el.querySelector('.lh-streak-ic.zero');
      var kind = zero ? 'sad' : 'proud';
      var wrap = document.createElement('div');
      wrap.className = 'lh-streak-mascot';
      wrap.innerHTML = img(kind, 'gd-mascot gd-mascot-sm');
      wrap.setAttribute('aria-hidden', 'true');
      var ic = el.querySelector('.lh-streak-ic');
      if (ic && ic.parentNode === el) {
        ic.insertAdjacentElement('afterend', wrap);
      } else {
        el.insertBefore(wrap, el.firstChild);
      }
    });
  }

  function injectEmpty() {
    document.querySelectorAll('.lh-empty').forEach(function (el) {
      if (el.querySelector('.lh-empty-mascot')) return;
      var wrap = document.createElement('div');
      wrap.className = 'lh-empty-mascot';
      wrap.innerHTML = img('proud', 'gd-mascot gd-mascot-md');
      wrap.setAttribute('aria-hidden', 'true');
      var icon = el.querySelector('.lh-empty-ic');
      if (icon) {
        icon.replaceWith(wrap);
      } else {
        el.insertBefore(wrap, el.firstChild);
      }
    });
  }

  function inject() {
    try {
      injectFeedback();
      injectFinish();
      injectHero();
      injectStreak();
      injectEmpty();
    } catch (_e) {}
  }

  var obs = new MutationObserver(function () { inject(); });
  function start() {
    inject();
    if (document.body) obs.observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();
