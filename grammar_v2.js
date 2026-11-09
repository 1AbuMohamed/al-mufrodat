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
      <h1 class="gram-lesson-title">Grammatica</h1>
    </div>
    <div class="gram-list">
      ${rows}
    </div>
  </div>`;
}

/* ---------- 2. Lespagina (Één pagina, scrollen, geen tabbladen) ---------- */
function renderLesson(n){
  const G = window.GRAMMATICA || {};
  const les = G[n];
  if(!les){
    return `<div class="gram-wrap">
      <h1 class="gram-lesson-title">Les niet gevonden</h1>
      <p><a href="#/grammatica" class="btn btn-secondary">‹ Terug naar overzicht</a></p>
    </div>`;
  }

  const isDone = !!doneLessons[n];
  const keys = Object.keys(G).filter(k => k !== '24').map(Number).sort((a,b) => a - b);
  const curIdx = keys.indexOf(Number(n));
  const prevLesson = curIdx > 0 ? keys[curIdx - 1] : null;
  const nextLesson = curIdx >= 0 && curIdx < keys.length - 1 ? keys[curIdx + 1] : null;

  // 1. Titel: precies één titel, heel simpel: alleen "Les N" (of "Reader 8 (Aanvulling)" voor Les 24)
  const pageTitle = les.is_aanvulling ? 'Reader 8 (Aanvulling)' : ('Les ' + n);
  
  // 2. Boektekst in boekvolgorde
  let contentHtml = '';
  const inhoud = les.inhoud || [];
  
  inhoud.forEach(item => {
    if(item.type === 'tekst'){
      const isBold = !!item.vet;
      contentHtml += `<p class="gram-p ${isBold ? 'is-bold' : ''}">${formatDutchText(item.tekst)}</p>`;
    }
    else if(item.type === 'regel'){
      contentHtml += `<p class="gram-p gram-rule">${formatDutchText(item.tekst)}</p>`;
    }
    else if(item.type === 'voorbeeld'){
      const arPart = item.ar ? `<span class="gram-ar" lang="ar" dir="rtl">${E(item.ar)}</span>` : '';
      const nlPart = item.nl ? `<span class="gram-nl">${formatDutchText(item.nl)}</span>` : '';
      contentHtml += `<div class="gram-ex-row">
        ${nlPart}
        ${arPart}
      </div>`;
    }
    else if(item.type === 'tabel'){
      let thead = '';
      if(item.kop && item.kop.length){
        thead = `<thead><tr>${item.kop.map(k => `<th>${formatDutchText(k)}</th>`).join('')}</tr></thead>`;
      }
      let tbody = '';
      (item.rijen || []).forEach(row => {
        tbody += `<tr>${row.map(cell => {
          const isCellAr = /[\u0600-\u06FF]/.test(cell);
          return `<td ${isCellAr ? 'class="gram-cell-ar" lang="ar" dir="rtl"' : ''}>${formatDutchText(cell)}</td>`;
        }).join('')}</tr>`;
      });
      contentHtml += `<div class="gram-tbl-wrap"><table class="gram-tbl">${thead}<tbody>${tbody}</tbody></table></div>`;
    }
    else if(item.type === 'voetnoot'){
      contentHtml += `<p class="gram-footnote">${formatDutchText(item.tekst)}</p>`;
    }
  });

  // Als het Reader 8 (les 24) is, render de bewaarde Reader 8 stappen als referentie
  if(les.is_aanvulling && les.reader8_data && les.reader8_data.steps){
    les.reader8_data.steps.forEach(st => {
      contentHtml += `<div class="gram-reader8-sec">
        <p class="gram-p is-bold">${formatDutchText(st.title)}</p>`;
      (st.text || []).forEach(t => {
        contentHtml += `<p class="gram-p">${formatDutchText(t)}</p>`;
      });
      if(st.table){
        let thead = `<thead><tr>${(st.table.headers||[]).map(h => `<th>${formatDutchText(h)}</th>`).join('')}</tr></thead>`;
        let tbody = (st.table.rows||[]).map(r => `<tr>${r.map(c => `<td>${formatDutchText(c)}</td>`).join('')}</tr>`).join('');
        contentHtml += `<div class="gram-tbl-wrap"><table class="gram-tbl">${thead}<tbody>${tbody}</tbody></table></div>`;
      }
      (st.examples || []).forEach(ex => {
        contentHtml += `<div class="gram-ex-row">
          <span class="gram-ar" lang="ar" dir="rtl">${E(ex.ar)}</span>
          <span class="gram-sep">—</span>
          <span class="gram-nl">${formatDutchText(ex.nl)}</span>
        </div>`;
      });
      contentHtml += `</div>`;
    });
  }

  // 3. Tweede sectie: Oefeningen (100% letterlijk uit Madina_Book1_Arabic_Text.pdf)
  let exercisesHtml = '';
  const oefeningen = les.oefeningen || [];
  if(oefeningen.length > 0){
    exercisesHtml += `<section class="gram-section gram-sec-exercises">
      <h2 class="gram-sec-title">Oefeningen</h2>
      <div class="gram-exercises">`;
    
    oefeningen.forEach((oef, idx) => {
      const exNrLabel = oef.nr ? `Oefening ${oef.nr}` : `Oefening ${idx + 1}`;
      
      exercisesHtml += `<div class="gram-exercise">
        <div class="gram-ex-nr">${E(exNrLabel)}</div>
        <div class="gram-ex-card">
          <img src="${E(oef.beeld)}" 
               alt="${E(oef.alt || ('Les ' + n + ', ' + exNrLabel))}" 
               width="${oef.breedte || ''}" 
               height="${oef.hoogte || ''}" 
               loading="lazy" 
               class="gram-ex-img" 
               data-act="gram-zoom" 
               tabindex="0" 
               role="button" 
               aria-label="Vergroot ${E(exNrLabel)}">
        </div>
      </div>`;
    });
    
    exercisesHtml += `</div>
    </section>`;
  }

  // 4. Onderaan, klein: "Les afgerond" + navigatie
  let navHtml = `<div class="gram-bottom-nav">
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

  return `<div class="gram-wrap gram-lesson-wrap">
    <h1 class="gram-lesson-title">${pageTitle}</h1>
    
    <section class="gram-section gram-sec-theory">
      <h2 class="gram-sec-title">Grammaticatheorie</h2>
      <div class="gram-content">
        ${contentHtml}
      </div>
    </section>

    ${exercisesHtml}

    ${navHtml}
  </div>`;
}

/* ---------- 3. Lightbox voor tik-om-te-vergroten ---------- */
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
    lb.addEventListener('click', e => {
      if(e.target === lb || e.target.closest('.gram-lightbox-close')){
        lb.classList.remove('open');
      }
    });
  }
  const img = lb.querySelector('.gram-lightbox-img');
  img.src = src;
  img.alt = alt || '';
  lb.classList.add('open');
}

/* ---------- 4. Event Listeners ---------- */
document.addEventListener('click', e => {
  // Zoom op oefeningafbeelding
  const zoomImg = e.target && e.target.closest && e.target.closest('[data-act="gram-zoom"]');
  if(zoomImg){
    e.preventDefault();
    openLightbox(zoomImg.src, zoomImg.alt);
    return;
  }

  // Checkbox "Les afgerond"
  if(e.target && e.target.id === 'gram-done-cb'){
    const lesNr = parseInt(e.target.dataset.l, 10);
    doneLessons[lesNr] = e.target.checked;
    saveDone();
    // Update eventuele teller of weergave
    if(typeof renderSidebar === 'function') {
      const host = document.getElementById('sidebar-host');
      if(host) host.innerHTML = renderSidebar();
    }
  }
});

document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    const lb = document.getElementById('gram-lightbox');
    if(lb && lb.classList.contains('open')){
      lb.classList.remove('open');
    }
  }
});

/* ---------- 5. Hash Routing (#/grammatica, #/grammatica/:n) ---------- */
function handleHashRoute(){
  const hash = window.location.hash || '';
  if(!hash.startsWith('#/grammatica')) return false;

  const parts = hash.slice(1).split('/').filter(Boolean); // ['grammatica'] of ['grammatica', '1']
  if(typeof window.state === 'object'){
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
    return true;
  }
  return false;
}

window.addEventListener('hashchange', handleHashRoute);
window.addEventListener('DOMContentLoaded', handleHashRoute);

/* ---------- 6. Koppeling aan de applicatie ---------- */
window.renderBook = function(){
  // Zorg dat de URL netjes #/grammatica is indien nog geen hash
  if(!window.location.hash || !window.location.hash.startsWith('#/grammatica')){
    try { history.replaceState(null, '', '#/grammatica'); } catch(e){}
  }
  return renderOverview();
};

window.renderBookLesson = function(){
  const n = (window.state && window.state.bookLesson !== null && window.state.bookLesson !== undefined)
    ? Number(window.state.bookLesson)
    : 1;
  const targetHash = '#/grammatica/' + n;
  if(window.location.hash !== targetHash){
    try { history.replaceState(null, '', targetHash); } catch(e){}
  }
  return renderLesson(n);
};

// Global helper voor voortgang & titels
const shortTitles = {};
for(let i = 0; i <= 23; i++) shortTitles[i] = 'Les ' + i;
shortTitles[24] = 'Reader 8 (Aanvulling)';

window.G2 = {
  L: window.GRAMMATICA || {},
  SHORT_TITLES: shortTitles,
  lessonPassed: function(n){ return !!doneLessons[n]; },
  lessonDone: function(n){ return !!doneLessons[n]; }
};

try {
  renderBook = window.renderBook;
  renderBookLesson = window.renderBookLesson;
} catch(e){}

// Start eventuele initiële hash-controle
setTimeout(handleHashRoute, 10);
})();
