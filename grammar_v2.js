/* =====================================================================
   Al-Mufrodat · Grammatica Medina Boek 1 (Opdracht A & C)
   Bron: 01a_Grammaticaboek_Medina_methode_deel_1 (1).pdf (Les 0–23)
   Oefeningen: Madina_Book1_Arabic_Text.pdf
   - 100% letterlijk naar het boek
   - Geen verzonnen stappen, drills, scores of vergrendeling
   - Precies één titel per les: "Les N"
   - Eenvoudige hash-routing (#/grammatica, #/grammatica/:nr)
   ===================================================================== */
(function(){
'use strict';

const LS_DONE_KEY = 'alm_gram_done_v2';
const LS_NOTES_KEY = 'alm_gram_notes_v2';

let doneLessons = {};
try { doneLessons = JSON.parse(localStorage.getItem(LS_DONE_KEY) || '{}'); } catch(e){}

let userNotes = {};
try { userNotes = JSON.parse(localStorage.getItem(LS_NOTES_KEY) || '{}'); } catch(e){}

function saveDone(){
  try { localStorage.setItem(LS_DONE_KEY, JSON.stringify(doneLessons)); } catch(e){}
}
function saveNotes(){
  try { localStorage.setItem(LS_NOTES_KEY, JSON.stringify(userNotes)); } catch(e){}
}

const E = s => {
  if(s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

function formatArabicLine(text){
  return E(text);
}

function formatDutchText(text){
  if(text === null || text === undefined) return '';
  const escaped = E(text);
  return escaped.replace(/«([^»]+)»/g, '<span class="ar-inline" lang="ar" dir="rtl">«$1»</span>');
}

/* ---------- 1. Lessenoverzicht (Grammatica-startpagina) ---------- */
function renderOverview(){
  const G = window.GRAMMATICA || {};
  const keys = Object.keys(G).map(Number).sort((a,b) => a - b);
  
  let rows = '';
  keys.forEach(n => {
    const item = G[n];
    if(!item) return;
    const isDone = !!doneLessons[n];
    const isReader8 = !!item.is_aanvulling || n === 24;
    const label = isReader8 ? 'Reader 8 (Aanvulling)' : ('Les ' + n);
    
    rows += `<a href="#/grammatica/${n}" class="gram-list-item ${isDone ? 'is-done' : ''} ${isReader8 ? 'is-extra' : ''}" data-act="open-book" data-l="${n}">
      <span class="gram-list-label">${label}</span>
      <span class="gram-list-status">
        ${isDone ? '<span class="gram-check" title="Afgerond">✓</span>' : '<span class="gram-chevron">›</span>'}
      </span>
    </a>`;
  });

  return `<div class="gram-wrap gram-overview-wrap">
    <div class="gram-overview-header">
      <h1 class="gram-title">Grammatica</h1>
      <p class="gram-sub">Medina-methode · Deel 1 · Les 0–23</p>
    </div>
    <div class="gram-list">
      ${rows}
    </div>
  </div>`;
}

/* ---------- 2. Lesweergave ---------- */
function renderLesson(n){
  n = Number(n);
  const G = window.GRAMMATICA || {};
  const item = G[n];
  if(!item){
    return `<div class="gram-wrap"><p class="empty">Les niet gevonden.</p>
      <a href="#/grammatica" class="btn btn-secondary" data-act="nav" data-v="book">← Overzicht</a></div>`;
  }

  const isDone = !!doneLessons[n];
  const isReader8 = !!item.is_aanvulling || n === 24;
  const pageTitle = isReader8 ? 'Reader 8 (Aanvulling)' : ('Les ' + n);

  // Content HTML (theorie)
  let contentHtml = '';
  if(item.html){
    contentHtml = item.html;
  } else if(item.blocks && Array.isArray(item.blocks)){
    contentHtml = item.blocks.map(b => {
      if(b.type === 'ar') return `<div class="gram-ar ar" lang="ar" dir="rtl">${formatArabicLine(b.text)}</div>`;
      if(b.type === 'nl') return `<div class="gram-nl">${formatDutchText(b.text)}</div>`;
      if(b.type === 'h') return `<h3 class="gram-h">${E(b.text)}</h3>`;
      if(b.type === 'img') return `<figure class="gram-fig"><img src="${E(b.src)}" alt="${E(b.alt||'')}" loading="lazy" class="gram-img" data-act="gram-zoom" data-src="${E(b.src)}"></figure>`;
      return '';
    }).join('');
  } else if(item.text){
    contentHtml = `<div class="gram-nl">${formatDutchText(item.text)}</div>`;
  }

  // Exercises section (if any)
  let exercisesHtml = '';
  if(item.exercises && item.exercises.length){
    exercisesHtml = `<section class="gram-section gram-sec-ex">
      <h2 class="gram-sec-title">Oefeningen</h2>
      <div class="gram-content">${item.exercises}</div>
    </section>`;
  }

  // Nav prev/next
  const keys = Object.keys(G).map(Number).sort((a,b)=>a-b);
  const idx = keys.indexOf(n);
  const prevLesson = idx > 0 ? keys[idx-1] : null;
  const nextLesson = idx < keys.length-1 ? keys[idx+1] : null;

  const topNavHtml = `<div class="gram-top-nav">
    <div class="gram-nav-prev">
      ${prevLesson !== null ? `<a href="#/grammatica/${prevLesson}" class="btn btn-secondary btn-sm" data-act="open-book" data-l="${prevLesson}">‹ Les ${prevLesson}</a>` : ''}
    </div>
    <div class="gram-nav-center">
      <a href="#/grammatica" class="gram-overview-link" data-act="nav" data-v="book">Overzicht</a>
      <label class="gram-done-toggle">
        <input type="checkbox" id="gram-done-cb" data-l="${n}" ${isDone ? 'checked' : ''}>
        <span>Les afgerond</span>
      </label>
    </div>
    <div class="gram-nav-next">
      ${nextLesson !== null ? `<a href="#/grammatica/${nextLesson}" class="btn btn-primary btn-sm" data-act="open-book" data-l="${nextLesson}">Les ${nextLesson} ›</a>` : ''}
    </div>
  </div>`;

  const navHtml = topNavHtml;

  return `<div class="gram-wrap gram-lesson-wrap">
    ${topNavHtml}
    <h1 class="gram-lesson-title">${pageTitle}</h1>
    
    <section class="gram-section gram-sec-theory">
      <div class="gram-content">
        ${contentHtml}
      </div>
    </section>

    ${exercisesHtml}

    ${navHtml}
  </div>`;
}

/* ---------- 3. Lightbox ---------- */
function openLightbox(src, alt){
  let lb = document.getElementById('gram-lightbox');
  if(!lb){
    lb = document.createElement('div');
    lb.id = 'gram-lightbox';
    lb.className = 'gram-lightbox';
    lb.innerHTML = `<div class="gram-lightbox-inner">
      <button type="button" class="gram-lightbox-close" aria-label="Sluiten">✕</button>
      <img src="" alt="" class="gram-lightbox-img">
    </div>`;
    document.body.appendChild(lb);
    lb.addEventListener('click', function(e){
      if(e.target === lb || e.target.classList.contains('gram-lightbox-close')){
        lb.classList.remove('open');
      }
    });
  }
  const img = lb.querySelector('.gram-lightbox-img');
  img.src = src;
  img.alt = alt || '';
  lb.classList.add('open');
}

/* ---------- 4. Events ---------- */
document.addEventListener('change', function(e){
  const t = e.target;
  if(t && t.id === 'gram-done-cb'){
    const n = t.getAttribute('data-l');
    if(n == null) return;
    doneLessons[n] = !!t.checked;
    saveDone();
  }
});

document.addEventListener('click', function(e){
  const zoom = e.target && e.target.closest && e.target.closest('[data-act="gram-zoom"]');
  if(zoom){
    e.preventDefault();
    openLightbox(zoom.getAttribute('data-src') || zoom.src, zoom.alt);
  }
});

/* ---------- 5. Hash routing ---------- */
function handleHashRoute(){
  const h = window.location.hash || '';
  if(!h.startsWith('#/grammatica')) return false;
  const parts = h.slice(1).split('/').filter(Boolean);
  if(parts[0] === 'grammatica'){
    if(window.state){
      window.state.path = 'grammar';
      if(parts.length >= 2){
        const lesNr = parseInt(parts[1], 10);
        window.state.view = 'book-lesson';
        window.state.bookLesson = isNaN(lesNr) ? 1 : lesNr;
      } else {
        window.state.view = 'book';
        window.state.bookLesson = null;
      }
      if(typeof window.render === 'function'){
        window.render();
        window.scrollTo(0, 0);
      }
    }
    return true;
  }
  return false;
}

window.addEventListener('hashchange', handleHashRoute);
window.addEventListener('DOMContentLoaded', handleHashRoute);

/* ---------- 6. Koppeling aan de applicatie ---------- */
function g2RenderBook(){
  if(!window.location.hash || !window.location.hash.startsWith('#/grammatica')){
    try { history.replaceState(null, '', '#/grammatica'); } catch(e){}
  }
  return renderOverview();
}

function g2RenderBookLesson(){
  const n = (window.state && window.state.bookLesson !== null && window.state.bookLesson !== undefined)
    ? Number(window.state.bookLesson)
    : 1;
  const targetHash = '#/grammatica/' + n;
  if(window.location.hash !== targetHash){
    try { history.replaceState(null, '', targetHash); } catch(e){}
  }
  return renderLesson(n);
}

window.renderBook = g2RenderBook;
window.renderBookLesson = g2RenderBookLesson;

const shortTitles = {};
for(let i = 0; i <= 23; i++) shortTitles[i] = 'Les ' + i;
shortTitles[24] = 'Reader 8 (Aanvulling)';

window.G2 = {
  L: window.GRAMMATICA || {},
  SHORT_TITLES: shortTitles,
  lessonPassed: function(n){ return !!doneLessons[n]; },
  lessonDone: function(n){ return !!doneLessons[n]; }
};

function rebindRenderBook(){
  window.renderBook = g2RenderBook;
  window.renderBookLesson = g2RenderBookLesson;
  try {
    renderBook = g2RenderBook;
    renderBookLesson = g2RenderBookLesson;
  } catch(e){}
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', rebindRenderBook);
} else {
  rebindRenderBook();
}
setTimeout(rebindRenderBook, 0);
setTimeout(rebindRenderBook, 50);
setTimeout(handleHashRoute, 60);
})();
