/* Al-Mufrodat mascotte (inline WebP, klein). */
window.AL_MASCOT = {
  happy: 'data:image/webp;base64,PLACEHOLDER_HAPPY',
  proud: 'data:image/webp;base64,PLACEHOLDER_PROUD',
  sad: 'data:image/webp;base64,PLACEHOLDER_SAD',
  img: function (kind, cls) {
    var src = this[kind] || this.happy;
    return '<img class="' + (cls || 'gd-mascot') + '" src="' + src + '" alt="" width="96" height="144" decoding="async">';
  }
};
