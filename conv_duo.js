/* Dialogen · Duo-style path + clean chat bubbles */
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
        '<span class="duo-node-body"><strong>' + escLocal(c.titleNl || ('Eenheid ' + n)) + '</strong>' +
        '<span>' + nDlg + (nDlg === 1 ? ' scène' : ' scènes') + (isDone ? ' · gelezen' : '') + '</span></span>' +
        '<span class="duo-node-cta">' + cta + ' ›</span>' +
      '</button></div>';
  });
  return '<div class="desktop-page">' +
    '<div style="margin-bottom:8px"><h1 style="font-size:24px;font-weight:800;letter-spacing:-.02em;margin:0 0 4px">Dialogen</h1>' +
    '<p style="margin:0;color:var(--muted);font-size:14px">Lees gesprekken · tik op een zin voor de vertaling</p></div>' +
    '<div class="duo-head">' +
      '<div class="duo-stat"><span class="k">Eenheden</span><span class="v">' + units.length + '</span></div>' +
      '<div class="duo-stat gold"><span class="k">Gelezen</span><span class="v">' + doneN + '/' + units.length + '</span></div>' +
    '</div>' +
    '<div class="duo-conv-path">' + path + '</div>' +
  '</div>';
};

window.renderConvUnit = function renderConvUnit(){
  if (typeof state === 'undefined') return '<div class="empty">Laden…</div>';
  if (state.convShowAll === undefined) state.convShowAll = true;
  const n = String(state.convUnit || '');
  const c = (CONVERSATIONS && (CONVERSATIONS[n] || CONVERSATIONS[Number(n)])) || null;
  if (!c) return '<div class="empty">Dialoog niet gevonden.</div>';
  const dark = typeof darkMode !== 'undefined' && darkMode;
  const palette = dark
    ? ['#68D391','#63B3ED','#F6AD55','#B794F4','#F687B3','#F6E05E']
    : ['#1F4F45','#2B6CB0','#C45C26','#6B3FA0','#8B2942','#B8860B'];
  const dialogs = c.dialogues || [];
  const total = dialogs.length;
  if (!total) return '<div class="empty">Geen scènes in deze eenheid.</div>';
  let di = state.convDi | 0;
  if (di < 0) di = 0;
  if (di >= total) di = total - 1;
  state.convDi = di;
  const d = dialogs[di];
  const colorMap = {};
  const spkList = [];
  (d.lines || []).forEach(function(l){
    if (l.who && spkList.indexOf(l.who) < 0) spkList.push(l.who);
  });

  let chat = '';
  (d.lines || []).forEach(function(line, li){
    const id = di + '-' + li;
    const open = !!(state.convOpen && state.convOpen[id]) || !!state.convShowAll;
    const spk = line.who || ('s' + li);
    if (!colorMap[spk]) colorMap[spk] = palette[Object.keys(colorMap).length % palette.length];
    const col = colorMap[spk];
    const spkIdx = spkList.indexOf(line.who);
    const role = (spkIdx >= 0 ? spkIdx : li) % 2 === 0 ? 'a' : 'b';
    const initial = (line.who || '').replace(/[\u064B-\u065F\u0670\u0640\s]/g,'').charAt(0) || String(li + 1);
    const arHtml = (typeof markAr === 'function') ? markAr(line.ar, 'plain') : escLocal(line.ar);
    chat += '<div class="chat-row spk-' + role + '">' +
      '<div class="chat-av" style="background:' + col + '">' + escLocal(initial) + '</div>' +
      '<div class="chat-bubble ' + (open ? '' : 'hide-nl') + '" data-act="toggle-line" data-id="' + id + '">' +
        '<div class="who"><span class="ar" lang="ar">' + escLocal(line.who || '') + '</span></div>' +
        '<div class="ar-line ar ar-mark" lang="ar">' + arHtml + '</div>' +
        '<div class="nl-line">' + escLocal(line.nl || '') + '</div>' +
      '</div></div>';
  });

  let pills = '';
  if (total > 1) {
    pills = '<div class="scene-pills">';
    for (let i = 0; i < total; i++) {
      pills += '<button type="button" class="scene-pill ' + (i === di ? 'on' : '') + '" data-act="conv-di" data-dir="set" data-i="' + i + '">Scène ' + (i + 1) + '</button>';
    }
    pills += '</div>';
  }

  const isDone = !!(window.__convDone && window.__convDone[n]);
  const sceneTitle = (d.titleNl || '')
    .replace(/^(?:Hoofdstuk|Les)\s*\d+\s*[—\-–]\s*/i, '')
    .replace(/^Dialoog\s*\d+\s*[—\-–]\s*/i, '')
    .trim();

  return '<div class="desktop-narrow">' +
    '<div class="learn-hud" style="margin-bottom:14px">' +
      '<button class="back" data-act="nav" data-v="conv" style="margin:0"><span>←</span></button>' +
      '<span class="learn-count">Eenheid ' + escLocal(n) + ' · ' + (di + 1) + '/' + total + '</span>' +
    '</div>' +
    '<p class="conv-mini-title">Dialoog</p>' +
    '<h1 class="conv-unit-title">' + escLocal(sceneTitle || c.titleNl || ('Eenheid ' + n)) + '</h1>' +
    '<div class="conv-unit-ar ar" lang="ar">' + escLocal(c.titleAr || '') + '</div>' +
    pills +
    '<div class="chat-tools">' +
      '<button type="button" class="btn btn-sm ' + (state.convShowAll ? 'btn-primary' : 'btn-secondary') + '" data-act="toggle-all-trans">' +
        (state.convShowAll ? 'Vertaling aan' : 'Vertaling uit') +
      '</button>' +
      '<span class="grow"></span>' +
      '<button type="button" class="btn btn-sm btn-secondary" data-act="conv-di" data-dir="prev" ' + (di <= 0 ? 'disabled' : '') + '>‹</button>' +
      '<button type="button" class="btn btn-sm btn-secondary" data-act="conv-di" data-dir="next" ' + (di >= total - 1 ? 'disabled' : '') + '>›</button>' +
    '</div>' +
    '<div class="chat-stack">' + chat + '</div>' +
    '<div class="conv-done-bar">' +
      '<label style="display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer;user-select:none">' +
        '<input type="checkbox" id="conv-done-cb" data-u="' + escLocal(n) + '" ' + (isDone ? 'checked' : '') + '> Gelezen</label>' +
      '<span class="grow"></span>' +
      (di < total - 1
        ? '<button type="button" class="btn btn-primary btn-sm" data-act="conv-di" data-dir="next">Volgende scène →</button>'
        : '<button type="button" class="btn btn-primary btn-sm" data-act="nav" data-v="conv">Klaar · overzicht</button>') +
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

// CSS for chat + path
const style = document.createElement('style');
style.textContent = `
.duo-conv-path{display:flex;flex-direction:column;align-items:center;gap:0;max-width:440px;margin:0 auto;padding:4px 0 28px}
.duo-conv-path .duo-connector{width:4px;height:18px;background:var(--line);border-radius:4px}
.chat-stack{display:flex;flex-direction:column;gap:12px;margin:8px 0 16px}
.chat-row{display:flex;gap:10px;align-items:flex-end;max-width:100%}
.chat-row.spk-b{flex-direction:row-reverse}
.chat-av{width:36px;height:36px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;font-weight:800;font-size:14px;color:#fff;border:2px solid var(--surface);box-shadow:0 2px 0 rgba(0,0,0,.08)}
.chat-bubble{max-width:min(100%,340px);padding:12px 14px;border-radius:18px 18px 18px 6px;background:var(--surface);border:2px solid var(--line);box-shadow:0 2px 0 var(--line);cursor:pointer;transition:transform .12s,border-color .12s}
.chat-row.spk-b .chat-bubble{border-radius:18px 18px 6px 18px}
.chat-bubble:hover{border-color:var(--gold);transform:translateY(-1px)}
.chat-bubble .who{font-size:11px;font-weight:700;color:var(--muted);margin-bottom:4px}
.chat-bubble .who .ar{font-size:13px;color:var(--forest)}
.chat-bubble .ar-line{font-family:var(--ar);font-size:22px;line-height:1.55;direction:rtl;text-align:right;font-weight:700;color:var(--ink)}
.chat-bubble .nl-line{font-size:13.5px;color:var(--ink-soft);margin-top:6px;line-height:1.4;padding-top:6px;border-top:1px dashed var(--line)}
.chat-bubble.hide-nl .nl-line{display:none}
.chat-tools{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0 6px}
.chat-tools .grow{flex:1}
.scene-pills{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 4px}
.scene-pill{border:2px solid var(--line);background:var(--surface);border-radius:999px;padding:8px 14px;font-weight:700;font-size:13px;cursor:pointer;color:inherit;font:inherit;box-shadow:0 2px 0 var(--line);transition:transform .12s,border-color .12s,box-shadow .12s}
.scene-pill:hover{transform:translateY(-1px);border-color:var(--gold)}
.scene-pill.on{border-color:var(--forest);background:var(--forest);color:var(--on-forest);box-shadow:0 2px 0 var(--forest-dark,#0a2527)}
.conv-done-bar{display:flex;align-items:center;gap:10px;margin-top:14px;padding-top:12px;border-top:1px solid var(--line)}
.conv-mini-title{font-size:13px;color:var(--muted);margin:0 0 2px}
.conv-unit-title{font-size:20px;font-weight:800;margin:0 0 2px;letter-spacing:-.02em}
.conv-unit-ar{font-family:var(--ar);font-size:26px;font-weight:700;direction:rtl;text-align:right;margin:0 0 10px;color:var(--forest)}
`;
document.head.appendChild(style);
})();
