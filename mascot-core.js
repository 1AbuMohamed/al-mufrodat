/* Mascot — originele AI-vogel (blij / trots / verdrietig / zwaai) */
window.AL_MASCOT = window.AL_MASCOT || {};
(function (M) {
  var BASE = 'assets/mascot/';
  var SRC = {
    happy: BASE + 'happy.webp',
    proud: BASE + 'proud.webp',
    sad: BASE + 'sad.webp',
    wave: BASE + 'wave.webp'
  };
  M.happy = SRC.happy;
  M.proud = SRC.proud;
  M.sad = SRC.sad;
  M.wave = SRC.wave;
  M.img = function (kind, cls) {
    var k = SRC[kind] ? kind : 'happy';
    var c = (cls || 'gd-mascot') + ' gd-mascot--' + k;
    return '<img class="' + c + '" src="' + SRC[k] + '" alt="" width="96" height="104" decoding="async" loading="lazy" draggable="false">';
  };
  M.setKind = function (el, kind) {
    if (!el) return;
    var img = el.tagName === 'IMG' ? el : el.querySelector('img');
    if (!img) return;
    var k = SRC[kind] ? kind : 'happy';
    img.src = SRC[k];
    img.className = (img.className || '').replace(/gd-mascot--\w+/g, '').trim() + ' gd-mascot gd-mascot--' + k;
  };
  M.preload = function (kind) {
    var k = SRC[kind] ? kind : 'happy';
    M._pre = M._pre || {};
    if (M._pre[k]) return;
    M._pre[k] = 1;
    var im = new Image();
    im.decoding = 'async';
    im.src = SRC[k];
  };
  M.preloadAll = function () {
    ['happy', 'proud', 'sad', 'wave'].forEach(function (k) { M.preload(k); });
  };
})(window.AL_MASCOT);
