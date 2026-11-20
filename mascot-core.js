/* Mascotte voor het Grammatica Lab: één SVG-figuur met poses die via CSS (mascot.css) bewegen.
 * Poses: happy, idle, cheer, proud, sad, think, wave.
 * AL_MASCOT.html(pose, extraClass) geeft markup terug; AL_MASCOT.pose(el, pose) wisselt van pose.
 */
(function () {
  'use strict';
  var uid = 0;

  function svg() {
    var n = ++uid, b = 'amB' + n, l = 'amL' + n;
    return '' +
'<svg class="am-svg" viewBox="0 0 160 190" aria-hidden="true" focusable="false">' +
'<defs>' +
'<linearGradient id="' + b + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4BD6C5"/><stop offset="1" stop-color="#19A59D"/></linearGradient>' +
'<linearGradient id="' + l + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDF9F2"/><stop offset="1" stop-color="#B0EADD"/></linearGradient>' +
'</defs>' +
'<ellipse class="am-shadow" cx="80" cy="183" rx="38" ry="6"/>' +
'<g class="am-fig">' +
  '<g class="am-feet"><ellipse cx="60" cy="173" rx="14" ry="7"/><ellipse cx="100" cy="173" rx="14" ry="7"/></g>' +
  '<g class="am-body">' +
    '<g class="am-wing am-wing-l"><path d="M42 90 C18 90 6 118 15 142 C19 152 31 151 38 142 C48 128 52 106 48 92Z"/>' +
      '<path class="am-wing-hi" d="M20 126 C22 136 28 142 34 140" /></g>' +
    '<g class="am-wing am-wing-r"><path d="M118 90 C142 90 154 118 145 142 C141 152 129 151 122 142 C112 128 108 106 112 92Z"/>' +
      '<path class="am-wing-hi" d="M140 126 C138 136 132 142 126 140" /></g>' +
    '<g class="am-tuft"><path d="M80 48 C70 32 72 16 80 8 C88 16 90 32 80 48Z"/>' +
      '<path d="M66 50 C53 40 50 28 55 18 C64 24 71 36 72 50Z"/><path d="M94 50 C107 40 110 28 105 18 C96 24 89 36 88 50Z"/></g>' +
    '<ellipse class="am-torso" cx="80" cy="108" rx="53" ry="65" fill="url(#' + b + ')"/>' +
    '<ellipse class="am-belly" cx="80" cy="132" rx="34" ry="37" fill="url(#' + l + ')"/>' +
    '<path class="am-feather" d="M62 124 q6 7 12 0 M86 124 q6 7 12 0 M74 140 q6 7 12 0"/>' +
    '<g class="am-face">' +
      '<ellipse class="am-cheek" cx="45" cy="106" rx="9" ry="6"/><ellipse class="am-cheek" cx="115" cy="106" rx="9" ry="6"/>' +
      '<g class="eyes-open">' +
        '<g class="am-eye"><circle class="am-white" cx="62" cy="88" r="15"/><g class="am-look"><circle class="am-pupil" cx="63" cy="90" r="7.6"/><circle class="am-glint" cx="66" cy="86.5" r="2.6"/></g><ellipse class="am-lid" cx="62" cy="88" rx="16" ry="16"/></g>' +
        '<g class="am-eye"><circle class="am-white" cx="98" cy="88" r="15"/><g class="am-look"><circle class="am-pupil" cx="97" cy="90" r="7.6"/><circle class="am-glint" cx="100" cy="86.5" r="2.6"/></g><ellipse class="am-lid" cx="98" cy="88" rx="16" ry="16"/></g>' +
      '</g>' +
      '<g class="e-arc"><path d="M48 92 Q62 72 76 92"/><path d="M84 92 Q98 72 112 92"/></g>' +
      '<g class="brows"><path d="M46 76 L74 66"/><path d="M114 76 L86 66"/></g>' +
      '<path class="tear" d="M44 100 q-5 8 0 11 q5 -3 0 -11Z"/>' +
      '<g class="m-open"><path class="mouth-in" d="M69 101 Q80 130 91 101Z"/><path class="tongue" d="M74 114 Q80 121 86 114 Q80 110 74 114Z"/></g>' +
      '<path class="m-smile" d="M71 107 Q80 116 89 107"/>' +
      '<path class="m-sad" d="M71 112 Q80 103 89 112"/>' +
      '<ellipse class="m-o" cx="80" cy="110" rx="4" ry="5"/>' +
      '<path class="am-beak" d="M69 99 Q80 89 91 99 Q80 111 69 99Z"/>' +
    '</g>' +
  '</g>' +
  '<g class="am-sparkles">' +
    '<path class="sp s1" d="M24 44 l2.6 6.4 6.4 2.6 -6.4 2.6 -2.6 6.4 -2.6 -6.4 -6.4 -2.6 6.4 -2.6Z"/>' +
    '<path class="sp s2" d="M138 34 l2.2 5.4 5.4 2.2 -5.4 2.2 -2.2 5.4 -2.2 -5.4 -5.4 -2.2 5.4 -2.2Z"/>' +
    '<path class="sp s3" d="M14 100 l1.8 4.4 4.4 1.8 -4.4 1.8 -1.8 4.4 -1.8 -4.4 -4.4 -1.8 4.4 -1.8Z"/>' +
    '<path class="sp s4" d="M146 92 l2.4 5.8 5.8 2.4 -5.8 2.4 -2.4 5.8 -2.4 -5.8 -5.8 -2.4 5.8 -2.4Z"/>' +
  '</g>' +
'</g></svg>';
  }

  function html(pose, extra) {
    return '<span class="am ' + (extra || '') + '" data-pose="' + (pose || 'happy') + '" aria-hidden="true">' + svg() + '</span>';
  }
  function setPose(el, pose) {
    if (el && el.getAttribute('data-pose') !== pose) el.setAttribute('data-pose', pose);
  }
  // Korte reactie: spring (juist), schud (fout) of hupje; de klasse verdwijnt vanzelf weer.
  function react(el, kind) {
    if (!el) return;
    var cls = kind === 'sad' ? 'am-shake' : kind === 'hop' ? 'am-hop' : 'am-jump';
    el.classList.remove('am-jump', 'am-shake', 'am-hop');
    void el.offsetWidth;
    el.classList.add(cls);
    setTimeout(function () { el.classList.remove(cls); }, 1400);
  }
  function confetti(host) {
    if (!host || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    var colors = ['#FFC800', '#FF4B4B', '#1CB0F6', '#58CC02', '#CE82FF', '#FF9600'], out = '';
    for (var i = 0; i < 22; i++) {
      out += '<i style="left:' + Math.round(Math.random() * 100) + '%;background:' + colors[i % colors.length] +
        ';animation-delay:' + (Math.random() * 0.5).toFixed(2) + 's;animation-duration:' + (1.6 + Math.random() * 1.2).toFixed(2) + 's"></i>';
    }
    var box = document.createElement('div');
    box.className = 'am-confetti'; box.setAttribute('aria-hidden', 'true'); box.innerHTML = out;
    host.appendChild(box);
    setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 3400);
  }

  window.AL_MASCOT = { html: html, pose: setPose, react: react, confetti: confetti };
})();
