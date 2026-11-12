/* Al-Mufrodat mascotte — bestand-gebaseerd + CSS-animaties */
window.AL_MASCOT = window.AL_MASCOT || {};
(function () {
  var BASE = 'assets/mascot/';
  var MAP = {
    happy: BASE + 'happy.webp',
    proud: BASE + 'proud.webp',
    sad: BASE + 'sad.webp',
    wave: BASE + 'wave.webp'
  };
  // Fallbacks als webp niet laadt
  AL_MASCOT.happy = MAP.happy;
  AL_MASCOT.proud = MAP.proud;
  AL_MASCOT.sad = MAP.sad;
  AL_MASCOT.wave = MAP.wave;

  AL_MASCOT.img = function (kind, cls) {
    var k = (kind && MAP[kind]) ? kind : 'happy';
    var src = MAP[k];
    var c = (cls || 'gd-mascot') + ' gd-mascot--' + k;
    // anim class alleen als gevraagd in cls, of standaard bij feedback
    if (c.indexOf('gd-mascot-anim') === -1 && c.indexOf('no-anim') === -1) {
      /* stil tenzij bridge anim toevoegt */
    }
    return '<img class="' + c + '" src="' + src + '" alt="" width="96" height="144" decoding="async" draggable="false">';
  };
})();
