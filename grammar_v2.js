/* Al-Mufrodat · Grammatica (compact, inhoud-aware) */
(function(){
'use strict';

const LS_DONE_KEY = 'alm_gram_done_v2';
let doneLessons = {};
try { doneLessons = JSON.parse(localStorage.getItem(LS_DONE_KEY) || '{}'); } catch(e){}
function saveDone(){ try { localStorage.setItem(LS_DONE_KEY, JSON.stringify(doneLessons)); } catch(e){} }

const E = s => {
  if(s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
};
function formatDutchText(text){
  if(text == null) return '';
  return E(text).replace(/«([^»]+)»/g, '<span class="ar-inline" lang="ar" dir="rtl">«$1»</span>');
}

function renderOverview(){
  const G = window.GRAMMATICA || {};
  const keys = Object.keys(G).map(Number).sort((a,b)=>a-b);
  let rows = '';
  keys.forEach(n => {
    const item = G[n];
    if(!item) return;
    const isDone = !!doneLessons[n];
    const label = 'Les ' + n;
    rows += `<a href="#/grammatica/${n}" class="gram-list-item ${isDone?'is-done':''}" data-act="open-book" data-l="${n}">
      <span class="gram-list-label">${label}</span>
      <span class="gram-list-status">${isDone?'<span class="gram-check">✓</span>':'<span class="gram-chevron">›</span>'}</span>
    </a>`;
  });
  return `<div class="gram-wrap gram-overview-wrap">
    <div class="gram-overview-header"><h1 class="gram-title">Grammatica</h1>
      <p class="gram-sub">Medina-methode · Deel 1 · Les 0–23</p></div>
    <div class="gram-list">${rows}</div>
  </div>`;
}

function renderInhoud(inhoud){
  let html = '';
  (inhoud || []).forEach(item => {
    if(item.type === 'tekst'){
      html += `<p class="gram-p ${item.vet?'is-bold':''}">${formatDutchText(item.tekst)}</p>`;
    } else if(item.type === 'regel'){
      html += `<p class="gram-p gram-rule">${formatDutchText(item.tekst)}</p>`;
    } else if(item.type === 'voorbeeld'){
      const ar = item.ar ? `<span class="gram-ar" lang="ar" dir="rtl">${E(item.ar)}</span>` : '';
      const nl = item.nl ? `<span class="gram-nl">${formatDutchText(item.nl)}</span>` : '';
      html += `<div class="gram-ex-row">${nl}${ar}</div>`;
    } else if(item.type === 'tabel'){
      let thead = '';
      if(item.kop && item.kop.length){
        thead = `<thead><tr>${item.kop.map(k=>`<th>${formatDutchText(k)}</th>`).join('')}</tr></thead>`;
      }
      let tbody = '';
      (item.rijen||[]).forEach(row=>{
        tbody += `<tr>${row.map(cell=>{
          const isAr = /[\u0600-\u06FF]/.test(cell);
          return `<td${isAr?' class="gram-cell-ar" lang="ar" dir="rtl"':''}>${formatDutchText(cell)}</td>`;
        }).join('')}</tr>`;
      });
      html += `<div class="gram-tbl-wrap"><table class="gram-tbl">${thead}<tbody>${tbody}</tbody></table></div>`;
    } else if(item.type === 'voetnoot'){
      html += `<p class="gram-footnote">${formatDutchText(item.tekst)}</p>`;
    } else if(item.type === 'kop'){
      html += `<h3 class="gram-h">${E(item.tekst||'')}</h3>`;
    } else if(item.tekst){
      html += `<p class="gram-p">${formatDutchText(item.tekst)}</p>`;
    }
  });
  return html;
}

function renderLesson(n){
  n = Number(n);
  const G = window.GRAMMATICA || {};
  const les = G[n];
  if(!les){
    return `<div class="gram-wrap"><p class="empty">Les niet gevonden.</p>
      <a href="#/grammatica" class="btn btn-secondary" data-act="nav" data-v="book">← Overzicht</a></div>`;
  }
  const isDone = !!doneLessons[n];
  const pageTitle = 'Les ' + n;
  const contentHtml = renderInhoud(les.inhoud);

  const keys = Object.keys(G).map(Number).sort((a,b)=>a-b);
  const idx = keys.indexOf(n);
  const prevLesson = idx > 0 ? keys[idx-1] : null;
  const nextLesson = idx < keys.length-1 ? keys[idx+1] : null;

  const nav = `<div class="gram-top-nav">
    <div class="gram-nav-prev">${prevLesson!==null?`<a href="#/grammatica/${prevLesson}" class="btn btn-secondary btn-sm" data-act="open-book" data-l="${prevLesson}">‹ Les ${prevLesson}</a>`:''}</div>
    <div class="gram-nav-center">
      <a href="#/grammatica" class="gram-overview-link" data-act="nav" data-v="book">Overzicht</a>
      <label class="gram-done-toggle"><input type="checkbox" id="gram-done-cb" data-l="${n}" ${isDone?'checked':''}><span>Les afgerond</span></label>
    </div>
    <div class="gram-nav-next">${nextLesson!==null?`<a href="#/grammatica/${nextLesson}" class="btn btn-primary btn-sm" data-act="open-book" data-l="${nextLesson}">Les ${nextLesson} ›</a>`:''}</div>
  </div>`;

  return `<div class="gram-wrap gram-lesson-wrap">
    ${nav}
    <h1 class="gram-lesson-title">${pageTitle}</h1>
    <section class="gram-section gram-sec-theory">
      <div class="gram-content">${contentHtml}</div>
    </section>
    ${nav}
  </div>`;
}

document.addEventListener('change', function(e){
  const t = e.target;
  if(t && t.id === 'gram-done-cb'){
    const n = t.getAttribute('data-l');
    if(n == null) return;
    doneLessons[n] = !!t.checked;
    saveDone();
  }
});

function handleHashRoute(){
  const h = window.location.hash || '';
  if(!h.startsWith('#/grammatica')) return false;
  const parts = h.slice(1).split('/').filter(Boolean);
  if(parts[0] === 'grammatica' && window.state){
    window.state.path = 'grammar';
    if(parts.length >= 2){
      const lesNr = parseInt(parts[1], 10);
      if (!Number.isInteger(lesNr) || lesNr < 0 || lesNr > 23) {
        window.state.view = 'book';
        window.state.bookLesson = null;
      } else {
        window.state.view = 'book-lesson';
        window.state.bookLesson = lesNr;
      }
    } else {
      window.state.view = 'book';
      window.state.bookLesson = null;
    }
    if(typeof window.render === 'function'){ window.render(); window.scrollTo(0,0); }
    return true;
  }
  return false;
}
window.addEventListener('hashchange', handleHashRoute);
window.addEventListener('DOMContentLoaded', handleHashRoute);

function g2RenderBook(){
  if(!window.location.hash || !window.location.hash.startsWith('#/grammatica')){
    try { history.replaceState(null, '', '#/grammatica'); } catch(e){}
  }
  return renderOverview();
}
function g2RenderBookLesson(){
  let n = (window.state && window.state.bookLesson != null) ? Number(window.state.bookLesson) : 1;
  if (!Number.isInteger(n) || n < 0 || n > 23) n = 1;
  const targetHash = '#/grammatica/' + n;
  if(window.location.hash !== targetHash){
    try { history.replaceState(null, '', targetHash); } catch(e){}
  }
  return renderLesson(n);
}
window.renderBook = g2RenderBook;
window.renderBookLesson = g2RenderBookLesson;

const shortTitles = {};
for(let i=0;i<=23;i++) shortTitles[i] = 'Les '+i;
window.G2 = {
  L: window.GRAMMATICA || {},
  SHORT_TITLES: shortTitles,
  lessonPassed: function(n){ return !!doneLessons[n]; },
  lessonDone: function(n){ return !!doneLessons[n]; }
};

function rebindRenderBook(){
  window.renderBook = g2RenderBook;
  window.renderBookLesson = g2RenderBookLesson;
  try { renderBook = g2RenderBook; renderBookLesson = g2RenderBookLesson; } catch(e){}
}
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', rebindRenderBook);
else rebindRenderBook();
setTimeout(rebindRenderBook, 0);
setTimeout(rebindRenderBook, 50);
setTimeout(handleHashRoute, 60);
})();
