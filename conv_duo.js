/* Dialogen · clean chat, vertaling alleen op klik */
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

  const dark = typeof darkMode !== 'undefined' && darkMode;
  const palette = dark
    ? ['#68D391','#63B3ED','#F6AD55','#B794F4','#F687B3','#F6E05E']
    : ['#1F4F45','#2B6CB0','#C45C26','#6B3FA0','#8B2942','#B8860B'];

  const dialogs = c.dialogues || [];
  const total = dialogs.length;
  if (!total) return '<div class="empty">Geen scènes.</div>';

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
    const open = !!(state.convOpen && state.convOpen[id]);
    const spk = line.who || ('s' + li);
    if (!colorMap[spk]) colorMap[spk] = palette[Object.keys(colorMap).length % palette.length];
    const col = colorMap[spk];
    const spkIdx = spkList.indexOf(line.who);
    const role = (spkIdx >= 0 ? spkIdx : li) % 2 === 0 ? 'a' : 'b';
    const initial = (line.who || '').replace(/[\u064B-\u065F\u0670\u0640\s]/g,'').charAt(0) || String(li + 1);
    const arHtml = (typeof markAr === 'function') ? markAr(line.ar, 'plain') : escLocal(line.ar);

    chat += '<div class="chat-row spk-' + role + '">' +
      '<div class="chat-av" style="background:' + col + '">' + escLocal(initial) + '</div>' +
      '<div class="chat-bubble' + (open ? ' is-open' : '') + '" data-act="toggle-line" data-id="' + id + '">' +
        '<div class="who"><span class="ar" lang="ar">' + escLocal(line.who || '') + '</span></div>' +
        '<div class="ar-line ar ar-mark" lang="ar">' + arHtml + '</div>' +
        (open
          ? '<div class="nl-line">' + escLocal(line.nl || '') + '</div>'
          : '<div class="tap-hint">tik voor vertaling</div>') +
      '</div></div>';
  });

  let pills = '';
  if (total > 1) {
    pills = '<div class="scene-pills">';
    for (let i = 0; i < total; i++) {
      pills += '<button type="button" class="scene-pill' + (i === di ? ' on' : '') + '" data-act="conv-di" data-dir="set" data-i="' + i + '">' + (i + 1) + '</button>';
    }
    pills += '</div>';
  }

  const isDone = !!(window.__convDone && window.__convDone[n]);
  const sceneTitle = (d.titleNl || '')
    .replace(/^(?:Hoofdstuk|Les)\s*\d+\s*[—\-–]\s*/i, '')
    .replace(/^Dialoog\s*\d+\s*[—\-–]\s*/i, '')
    .trim();

  return '<div class="desktop-narrow conv-clean">' +
    '<div class="conv-bar">' +
      '<button class="back" data-act="nav" data-v="conv" style="margin:0"><span>←</span></button>' +
      '<span class="conv-bar-meta">Eenheid ' + escLocal(n) + (total > 1 ? ' · ' + (di + 1) + '/' + total : '') + '</span>' +
      '<label class="conv-done-mini"><input type="checkbox" id="conv-done-cb" data-u="' + escLocal(n) + '"' + (isDone ? ' checked' : '') + '> Gelezen</label>' +
    '</div>' +
    '<h1 class="conv-unit-title">' + escLocal(sceneTitle || c.titleNl || ('Eenheid ' + n)) + '</h1>' +
    (c.titleAr ? '<div class="conv-unit-ar ar" lang="ar">' + escLocal(c.titleAr) + '</div>' : '') +
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
.conv-unit-title{font-size:20px;font-weight:800;margin:0 0 4px;letter-spacing:-.02em}
.conv-unit-ar{font-family:var(--ar);font-size:24px;font-weight:700;direction:rtl;text-align:right;margin:0 0 12px;color:var(--forest)}
.scene-pills{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px}
.scene-pill{width:36px;height:36px;border:2px solid var(--line);background:var(--surface);border-radius:50%;font-weight:800;font-size:13px;cursor:pointer;color:inherit;font:inherit;box-shadow:0 2px 0 var(--line);display:grid;place-items:center;padding:0}
.scene-pill:hover{border-color:var(--gold)}
.scene-pill.on{border-color:var(--forest);background:var(--forest);color:var(--on-forest);box-shadow:0 2px 0 var(--forest-dark,#0a2527)}
.chat-stack{display:flex;flex-direction:column;gap:12px;margin:4px 0 18px}
.chat-row{display:flex;gap:10px;align-items:flex-end;max-width:100%}
.chat-row.spk-b{flex-direction:row-reverse}
.chat-av{width:34px;height:34px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;font-weight:800;font-size:13px;color:#fff;border:2px solid var(--surface)}
.chat-bubble{max-width:min(100%,340px);padding:12px 14px;border-radius:18px 18px 18px 6px;background:var(--surface);border:2px solid var(--line);box-shadow:0 2px 0 var(--line);cursor:pointer;transition:border-color .12s,transform .12s}
.chat-row.spk-b .chat-bubble{border-radius:18px 18px 6px 18px}
.chat-bubble:hover{border-color:var(--gold)}
.chat-bubble.is-open{border-color:var(--gold)}
.chat-bubble .who{font-size:11px;font-weight:700;color:var(--muted);margin-bottom:4px}
.chat-bubble .who .ar{font-size:13px;color:var(--forest)}
.chat-bubble .ar-line{font-family:var(--ar);font-size:22px;line-height:1.5;direction:rtl;text-align:right;font-weight:700}
.chat-bubble .nl-line{font-size:14px;color:var(--ink-soft);margin-top:8px;line-height:1.4;padding-top:8px;border-top:1px solid var(--line)}
.chat-bubble .tap-hint{font-size:11px;color:var(--muted);margin-top:6px;font-weight:600;opacity:.7}
.conv-nav-simple{display:flex;justify-content:space-between;gap:10px;margin-top:4px}
`;
document.head.appendChild(style);
})();
