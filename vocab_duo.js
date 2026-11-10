/* Woordenschat flash · tik = vertaling, swipe / Volgende · foto boven, Arabisch kleiner */
(function(){
'use strict';

function escLocal(s){
  if (typeof esc === 'function') return esc(s);
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function picHtml(w){
  try {
    if (typeof showPics !== 'undefined' && !showPics) return '';
    if (typeof wordPic === 'function') return wordPic(w) || '';
  } catch(e){}
  return '';
}

window.renderFlash = function renderFlash(){
  if (typeof state === 'undefined') return '<div class="empty">Laden…</div>';
  var pool = state.pool || [];
  if (!pool.length) {
    return '<div class="desktop-narrow"><button class="back" data-act="nav" data-v="vocab"><span>←</span></button><p class="empty">Geen woorden.</p></div>';
  }
  if (state.idx == null || state.idx < 0) state.idx = 0;
  if (state.idx >= pool.length) state.idx = pool.length - 1;
  var w = pool[state.idx];
  var f = !!state.flipped;
  var dir = (typeof flashDir !== 'undefined') ? flashDir : 'ar2nl';
  var arFirst = dir !== 'nl2ar';
  var pct = pool.length ? Math.round(100 * (state.idx + 1) / pool.length) : 0;
  var arHtml = (typeof wrapTash === 'function') ? wrapTash(w.ar, 'plain') : escLocal(w.ar);
  var pic = picHtml(w);

  var main, sub;
  if (!f) {
    if (arFirst) {
      main = (pic ? '<div class="vf-pic">' + pic + '</div>' : '') +
             '<div class="vf-ar ar ar-mark" lang="ar">' + arHtml + '</div>';
      sub = '';
    } else {
      main = (pic ? '<div class="vf-pic">' + pic + '</div>' : '') +
             '<div class="vf-nl">' + escLocal(w.nl) + '</div>';
      sub = '';
    }
  } else {
    if (arFirst) {
      main = '<div class="vf-nl">' + escLocal(w.nl) + '</div>';
      sub = (pic ? '<div class="vf-pic vf-pic-sm">' + pic + '</div>' : '') +
            '<div class="vf-ar-sm ar ar-mark" lang="ar">' + arHtml + '</div>';
    } else {
      main = (pic ? '<div class="vf-pic">' + pic + '</div>' : '') +
             '<div class="vf-ar ar ar-mark" lang="ar">' + arHtml + '</div>';
      sub = '<div class="vf-nl-sm">' + escLocal(w.nl) + '</div>';
    }
  }

  return '<div class="desktop-narrow vf-wrap">' +
    '<div class="vf-top">' +
      '<button class="back" data-act="nav" data-v="vocab" style="margin:0"><span>←</span></button>' +
      '<div class="vf-prog"><i style="width:' + pct + '%"></i></div>' +
      '<span class="vf-count">' + (state.idx + 1) + '/' + pool.length + '</span>' +
    '</div>' +
    '<div class="vf-tools">' +
      '<button type="button" class="vf-chip' + (arFirst ? ' on' : '') + '" data-act="set-flash-dir" data-d="ar2nl">AR</button>' +
      '<button type="button" class="vf-chip' + (!arFirst ? ' on' : '') + '" data-act="set-flash-dir" data-d="nl2ar">NL</button>' +
    '</div>' +
    '<div class="vf-card' + (f ? ' is-flipped' : '') + '" id="vf-card" data-act="flip" role="button" tabindex="0">' +
      main + sub +
      (!f ? '<div class="vf-tap">tik voor vertaling</div>' : '') +
    '</div>' +
    '<div class="vf-nav">' +
      '<button type="button" class="btn btn-secondary" data-act="flash-prev"' + (state.idx === 0 ? ' disabled' : '') + '>‹</button>' +
      '<button type="button" class="btn btn-primary vf-next" data-act="flash-next"' + (state.idx >= pool.length - 1 ? ' disabled' : '') + '>Volgende ›</button>' +
    '</div>' +
  '</div>';
};

var sx = 0, sy = 0, tracking = false;
document.addEventListener('touchstart', function(e){
  var card = e.target && e.target.closest && e.target.closest('#vf-card');
  if (!card) return;
  var touch = e.changedTouches[0];
  sx = touch.clientX; sy = touch.clientY; tracking = true;
}, {passive: true});

document.addEventListener('touchend', function(e){
  if (!tracking) return;
  tracking = false;
  var card = e.target && e.target.closest && e.target.closest('#vf-card');
  if (!card) return;
  var touch = e.changedTouches[0];
  var dx = touch.clientX - sx;
  var dy = touch.clientY - sy;
  if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
  e.preventDefault();
  if (typeof state === 'undefined' || !state.pool) return;
  if (dx < 0) {
    if (state.idx < state.pool.length - 1) {
      state.idx++; state.flipped = false;
      if (typeof render === 'function') render();
    }
  } else {
    if (state.idx > 0) {
      state.idx--; state.flipped = false;
      if (typeof render === 'function') render();
    }
  }
}, {passive: false});

var style = document.createElement('style');
style.textContent = `
.vf-wrap{max-width:420px;margin:0 auto}
.vf-top{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.vf-prog{flex:1;height:8px;background:var(--paper-deep);border-radius:99px;overflow:hidden}
.vf-prog i{display:block;height:100%;background:linear-gradient(90deg,var(--gold),#e8c46a);border-radius:99px;transition:width .25s ease}
.vf-count{font-size:13px;font-weight:800;color:var(--muted);min-width:3em;text-align:end}
.vf-tools{display:flex;gap:8px;margin-bottom:14px;justify-content:center}
.vf-chip{border:2px solid var(--line);background:var(--surface);border-radius:999px;padding:6px 14px;font-weight:800;font-size:13px;cursor:pointer;color:var(--muted);font:inherit}
.vf-chip.on{border-color:var(--forest);background:var(--forest);color:var(--on-forest)}
.vf-card{
  background:var(--surface);border:2px solid var(--line);border-radius:22px;
  min-height:220px;padding:20px 18px 24px;display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;cursor:pointer;box-shadow:0 3px 0 var(--line);
  transition:border-color .15s,transform .12s;user-select:none;-webkit-user-select:none;
  touch-action:pan-y;gap:6px;
}
.vf-card:active{transform:scale(.99)}
.vf-card.is-flipped{border-color:var(--gold);box-shadow:0 3px 0 var(--gold)}
.vf-pic{display:flex;justify-content:center;margin:0 0 4px}
.vf-pic .pic-frame,.vf-pic img{max-height:110px;width:auto;border-radius:12px}
.vf-pic-sm .pic-frame,.vf-pic-sm img{max-height:72px}
.vf-ar{font-family:var(--ar);font-size:clamp(28px,7.5vw,40px);font-weight:700;line-height:1.45;direction:rtl;margin-top:6px}
.vf-ar-sm{font-family:var(--ar);font-size:clamp(22px,6vw,30px);font-weight:700;direction:rtl;margin-top:8px;color:var(--forest)}
.vf-nl{font-size:26px;font-weight:800;line-height:1.3;letter-spacing:-.02em}
.vf-nl-sm{font-size:16px;font-weight:600;color:var(--muted);margin-top:8px}
.vf-tap{margin-top:14px;font-size:12px;font-weight:700;color:var(--muted);opacity:.65}
.vf-nav{display:flex;gap:10px;margin-top:16px}
.vf-nav .btn{flex:1}
.vf-next{flex:2!important}
.qcard .q-pic{margin:0 0 10px;display:flex;justify-content:center}
.qcard .q-pic .pic-frame,.qcard .q-pic img{max-height:120px;width:auto;border-radius:12px}
.qcard .qar,.qcard .big-ar,.qcard .flash-mushaf{
  font-size:clamp(26px,7vw,38px)!important;
  line-height:1.45!important;
  margin-top:4px!important;
}
.flash-card .hint,.flash-card .tag,.flash-card .translit,.card .translit,.vf-ph{display:none!important}
`;
document.head.appendChild(style);
})();
