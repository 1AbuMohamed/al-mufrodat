/* Mascot — lichte bestanden i.p.v. base64-JS */
window.AL_MASCOT = window.AL_MASCOT || {};
(function (M) {
  var BASE = 'assets/mascot/';
  var SRC = {
    happy: BASE + 'happy.webp',
    proud: BASE + 'proud.webp',
    sad: BASE + 'sad.webp'
  };
  M.happy = SRC.happy;
  M.proud = SRC.proud;
  M.sad = SRC.sad;
  M.img = function (kind, cls) {
    var k = SRC[kind] ? kind : 'happy';
    var c = (cls || 'gd-mascot') + ' gd-mascot--' + k;
    return '<img class="' + c + '" src="' + SRC[k] + '" alt="" width="96" height="104" decoding="async" loading="lazy" draggable="false">';
  };
  /* Preload alleen bij eerste interactie / feedback */
  M.preload = function (kind) {
    var k = SRC[kind] ? kind : 'happy';
    if (M._pre && M._pre[k]) return;
    M._pre = M._pre || {};
    M._pre[k] = 1;
    var im = new Image();
    im.decoding = 'async';
    im.src = SRC[k];
  };
})(window.AL_MASCOT);
