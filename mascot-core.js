window.AL_MASCOT = window.AL_MASCOT || {};
window.AL_MASCOT.img = function (kind, cls) {
  var src = this[kind] || this.happy || '';
  var k = kind || 'happy';
  var c = (cls || 'gd-mascot') + ' gd-mascot--' + k;
  return src
    ? '<img class="' + c + '" src="' + src + '" alt="" width="96" height="144" decoding="async">'
    : '';
};
