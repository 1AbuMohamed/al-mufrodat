/* Dialogen · clean chat, vertaling op klik, korte scène-titels, iʿrāb */
(function(){
'use strict';

window.__convDone = (function(){
  try { return JSON.parse(localStorage.getItem('alm_conv_done')||'{}'); } catch(e){ return {}; }
})();
function saveConvDone(){
  try { localStorage.setItem('alm_conv_done', JSON.stringify(window.__convDone||{})); } catch(e){}
}

function escLocal(s){
  if (typeof esc === 'function') return esc(s);
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

window.renderConv = function renderConv(){
  const units = Object.entries(CONVERSATIONS || {});
  const doneMap = window.__convDone || {};
  let doneN = 0;
  units.forEach(function(pair){ if (doneMap[pair[0]]) doneN++; });
  let path = '';
  units.forEach(function(pair, i){
    const n = pair[0], c = pair[1];
    const nDlg = (c.dialogues || []).length;
    const isDone = !!doneMap[n];
    const stt = isDone ? 'done' : '';
    const bubble = isDone ? '✓' : String(n);
    const cta = isDone ? 'Herlees' : 'Start';
    if (i > 0) path += '<div class="duo-connector"></div>';
    path += '<div class="duo-node-wrap ' + stt + '">' +
      '<button type="button" class="duo-node ' + stt + '" data-act="open-conv" data-u="' + n + '">' +
        '<span class="duo-bubble">' + bubble + '</span>' +
        '<span class="duo-node-body"><strong>Eenheid ' + escLocal(n) + '</strong>' +
        '<span>' + nDlg + (nDlg === 1 ? ' scène' : ' scènes') + (isDone ? ' · gelezen' : '') + '</span></span>' +
        '<span class="duo-node-cta">' + cta + ' ›</span>' +
      '</button></div>';
  });
  return '<div class="desktop-page">' +
    '<div style="margin-bottom:10px">' +
      '<h1 style="font-size:24px;font-weight:800;letter-spacing:-.02em;margin:0 0 4px">Dialogen</h1>' +
      '<p style="margin:0;color:var(--muted);font-size:14px">Tik op een zin voor de vertaling</p>' +
    '</div>' +
    '<div class="duo-head">' +
      '<div class="duo-stat"><span class="k">Eenheden</span><span class="v">' + units.length + '</span></div>' +
      '<div class="duo-stat gold"><span class="k">Gelezen</span><span class="v">' + doneN + '/' + units.length + '</span></div>' +
    '</div>' +
    '<div class="duo-conv-path">' + path + '</div>' +
  '</div>';
};

window.renderConvUnit = function renderConvUnit(){
  if (typeof state === 'undefined') return '<div class="empty">Laden…</div>';
  if (state.convShowAll === undefined) state.convShowAll = false;
  if (!state.convOpen) state.convOpen = {};

  const n = String(state.convUnit || '');
  const c = (CONVERSATIONS && (CONVERSATIONS[n] || CONVERSATIONS[Number(n)])) || null;
  if (!c) return '<div class="empty">Dialoog niet gevonden.</div>';

  const dialogs = c.dialogues || [];
  const total = dialogs.length;
  if (!total) return '<div class="empty">Geen scènes.</div>';

  let di = state.convDi | 0;
  if (di < 0) di = 0;
  if (di >= total) di = total - 1;
  state.convDi = di;
  const d = dialogs[di];

  const spkList = [];
  (d.lines || []).forEach(function(l){
    if (l.who && spkList.indexOf(l.who) < 0) spkList.push(l.who);
  });

  let chat = '';
  (d.lines || []).forEach(function(line, li){
    const id = di + '-' + li;
    const open = !!(state.convOpen && state.convOpen[id]);
    const spkIdx = spkList.indexOf(line.who);
    const role = (spkIdx >= 0 ? spkIdx : li) % 2 === 0 ? 'a' : 'b';
    const arHtml = (typeof markAr === 'function') ? markAr(line.ar, 'plain') : escLocal(line.ar);

    const irabKey = 'conv_' + n + '_' + di + '_' + li;
    const canIrab = !!(window.analyzeArabicSentence && window.analyzeArabicSentence(line.ar));
    const irabSess = canIrab && window.getInlineIrabSession ? window.getInlineIrabSession(irabKey, 'view') : null;
    const irabOpen = !!(irabSess && irabSess.open);

    chat += '<div class="chat-row spk-' + role + '">' +
      '<div class="chat-bubble' + (open ? ' is-open' : '') + (irabOpen ? ' has-irab' : '') + '">' +
        '<div class="chat-top">' +
          '<span class="who ar" lang="ar">' + escLocal(line.who || '') + '</span>' +
          (canIrab
            ? '<button type="button" class="irab-btn' + (irabOpen ? ' on' : '') + '" data-act="iirab-toggle" data-key="' + escLocal(irabKey) + '" data-sent="' + escLocal(line.ar) + '" title="Zinsontleding">إعراب</button>'
            : '') +
        '</div>' +
        '<div class="ar-line ar ar-mark" lang="ar" data-act="toggle-line" data-id="' + id + '">' + arHtml + '</div>' +
        (open
          ? '<div class="nl-line" data-act="toggle-line" data-id="' + id + '">' + escLocal(line.nl || '') + '</div>'
          : '<div class="tap-hint" data-act="toggle-line" data-id="' + id + '">tik voor vertaling</div>') +
        (irabOpen && window.renderInlineIrab
          ? '<div class="irab-panel">' + window.renderInlineIrab(line.ar, irabKey, irabSess.mode) + '</div>'
          : '') +
      '</div></div>';
  });

  let pills = '';
  if (total > 1) {
    pills = '<div class="scene-pills">';
    for (let i = 0; i < total; i++) {
      pills += '<button type="button" class="scene-pill' + (i === di ? ' on' : '') + '" data-act="conv-di" data-dir="set" data-i="' + i + '">Scène ' + (i + 1) + '</button>';
    }
    pills += '</div>';
  }

  const isDone = !!(window.__convDone && window.__convDone[n]);

  return '<div class="desktop-narrow conv-clean">' +
    '<div class="conv-bar">' +
      '<button class="back" data-act="nav" data-v="conv" style="margin:0"><span>←</span></button>' +
      '<span class="conv-bar-meta">Eenheid ' + escLocal(n) + (total > 1 ? ' · ' + (di + 1) + '/' + total : '') + '</span>' +
      '<label class="conv-done-mini"><input type="checkbox" id="conv-done-cb" data-u="' + escLocal(n) + '"' + (isDone ? ' checked' : '') + '> Gelezen</label>' +
    '</div>' +
    '<h1 class="conv-unit-title">Scène ' + (di + 1) + '</h1>' +
    pills +
    '<div class="chat-stack">' + chat + '</div>' +
    '<div class="conv-nav-simple">' +
      '<button type="button" class="btn btn-secondary btn-sm" data-act="conv-di" data-dir="prev"' + (di <= 0 ? ' disabled' : '') + '>‹ Vorige</button>' +
      (di < total - 1
        ? '<button type="button" class="btn btn-primary btn-sm" data-act="conv-di" data-dir="next">Volgende ›</button>'
        : '<button type="button" class="btn btn-primary btn-sm" data-act="nav" data-v="conv">Klaar</button>') +
    '</div>' +
  '</div>';
};

document.addEventListener('change', function(e){
  const t = e.target;
  if (t && t.id === 'conv-done-cb') {
    const u = t.getAttribute('data-u');
    if (!u) return;
    window.__convDone = window.__convDone || {};
    window.__convDone[u] = !!t.checked;
    saveConvDone();
  }
});

const style = document.createElement('style');
style.textContent = `
.duo-conv-path{display:flex;flex-direction:column;align-items:center;gap:0;max-width:440px;margin:0 auto;padding:4px 0 28px}
.duo-conv-path .duo-connector{width:4px;height:18px;background:var(--line);border-radius:4px}
.conv-clean .conv-bar{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.conv-clean .conv-bar-meta{flex:1;font-size:13px;font-weight:700;color:var(--muted)}
.conv-done-mini{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;user-select:none}
.conv-unit-title{font-size:20px;font-weight:800;margin:0 0 12px;letter-spacing:-.02em}
.scene-pills{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px}
.scene-pill{border:2px solid var(--line);background:var(--surface);border-radius:999px;padding:7px 14px;font-weight:800;font-size:13px;cursor:pointer;color:inherit;font:inherit;box-shadow:0 2px 0 var(--line)}
.scene-pill:hover{border-color:var(--gold)}
.scene-pill.on{border-color:var(--forest);background:var(--forest);color:var(--on-forest);box-shadow:0 2px 0 var(--forest-dark,#0a2527)}
.chat-stack{display:flex;flex-direction:column;gap:12px;margin:4px 0 18px}
.chat-row{display:flex;gap:10px;align-items:flex-end;max-width:100%}
.chat-row.spk-b{flex-direction:row-reverse}
.chat-bubble{max-width:min(100%,380px);padding:12px 14px;border-radius:18px 18px 18px 6px;background:var(--surface);border:2px solid var(--line);box-shadow:0 2px 0 var(--line);transition:border-color .12s}
.chat-row.spk-b .chat-bubble{border-radius:18px 18px 6px 18px}
.chat-bubble.is-open,.chat-bubble.has-irab{border-color:var(--gold)}
.chat-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
.chat-bubble .who{font-size:13px;font-weight:700;color:var(--forest);font-family:var(--ar)}
.irab-btn{border:1.5px solid var(--line);background:var(--paper-deep);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700;cursor:pointer;color:var(--muted);font-family:var(--ar);line-height:1.2}
.irab-btn:hover,.irab-btn.on{border-color:var(--forest);color:var(--forest);background:var(--forest-soft,#e8f2ef)}
.chat-bubble .ar-line{font-family:var(--ar);font-size:22px;line-height:1.5;direction:rtl;text-align:right;font-weight:700;cursor:pointer}
.chat-bubble .nl-line{font-size:14px;color:var(--ink-soft);margin-top:8px;line-height:1.4;padding-top:8px;border-top:1px solid var(--line);cursor:pointer}
.chat-bubble .tap-hint{font-size:11px;color:var(--muted);margin-top:6px;font-weight:600;opacity:.7;cursor:pointer}
.irab-panel{margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}
.conv-nav-simple{display:flex;justify-content:space-between;gap:10px;margin-top:4px}
.conv-spk-avatar,.chat-av,.conv-spk-phon{display:none!important}
`;
document.head.appendChild(style);
})();
