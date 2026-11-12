/* Mascot: beweegt alleen bij feedback/finish; geen grote mascot midden op home */
(function () {
  function img(kind, cls) {
    if (!window.AL_MASCOT || !AL_MASCOT.img) return '';
    return AL_MASCOT.img(kind, cls || 'gd-mascot');
  }

  function injectFeedback() {
    document.querySelectorAll('.gd-feedback-inner').forEach(function (el) {
      if (el.querySelector('.gd-mascot')) return;
      var sheet = el.closest('.gd-feedback');
      var good = sheet && sheet.classList.contains('good');
      var kind = good ? (document.querySelector('.gd-combo') ? 'proud' : 'happy') : 'sad';
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
      wrap.setAttribute('aria-hidden', 'true');
      wrap.innerHTML = img(kind, 'gd-mascot gd-mascot-anim');
      el.insertBefore(wrap, el.firstChild);
      var icon = el.querySelector('.gd-finish-icon');
      if (icon) icon.style.display = 'none';
    });
  }

  function injectStreak() {
    /* Klein, stil in de hoek van de streak-kaart */
    document.querySelectorAll('.lh-streak').forEach(function (el) {
      if (el.querySelector('.lh-streak-mascot')) return;
      var zero = !!el.querySelector('.lh-streak-ic.zero');
      var kind = zero ? 'sad' : 'proud';
      var wrap = document.createElement('div');
      wrap.className = 'lh-streak-mascot';
      wrap.setAttribute('aria-hidden', 'true');
      wrap.innerHTML = img(kind, 'gd-mascot gd-mascot-sm');
      var ic = el.querySelector('.lh-streak-ic');
      if (ic && ic.parentNode === el) {
        ic.insertAdjacentElement('afterend', wrap);
      } else {
        el.appendChild(wrap);
      }
    });
  }

  function injectEmpty() {
    document.querySelectorAll('.lh-empty').forEach(function (el) {
      if (el.querySelector('.lh-empty-mascot')) return;
      var wrap = document.createElement('div');
      wrap.className = 'lh-empty-mascot';
      wrap.setAttribute('aria-hidden', 'true');
      wrap.innerHTML = img('proud', 'gd-mascot gd-mascot-md');
      var icon = el.querySelector('.lh-empty-ic');
      if (icon) icon.replaceWith(wrap);
      else el.insertBefore(wrap, el.firstChild);
    });
  }

  function inject() {
    try {
      injectFeedback();
      injectFinish();
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
