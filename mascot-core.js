/* Mascot — altijd hetzelfde originele figuur (happy.webp) */
window.AL_MASCOT = window.AL_MASCOT || {};
(function (M) {
  var SRC = 'assets/mascot/happy.webp';
  M.happy = SRC;
  M.proud = SRC;
  M.sad = SRC;
  M.wave = SRC;
  M.img = function (kind, cls) {
    var k = kind || 'happy';
    var c = (cls || 'gd-mascot') + ' gd-mascot--' + k;
    return '<img class="' + c + '" src="' + SRC + '" alt="" width="96" height="104" decoding="async" loading="lazy" draggable="false">';
  };
  M.setKind = function (el, kind) {
    if (!el) return;
    var img = el.tagName === 'IMG' ? el : el.querySelector('img');
    if (!img) return;
    var k = kind || 'happy';
    /* zelfde plaatje; class alleen voor animatie */
    img.src = SRC;
    img.className = (img.className || '').replace(/gd-mascot--\w+/g, '').trim() + ' gd-mascot gd-mascot--' + k;
  };
  M.preload = function () {
    if (M._pre) return;
    M._pre = 1;
    var im = new Image();
    im.decoding = 'async';
    im.src = SRC;
  };
  M.preloadAll = function () { M.preload(); };
})(window.AL_MASCOT);
