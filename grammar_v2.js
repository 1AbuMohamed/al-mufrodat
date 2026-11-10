/* Al-Mufrodat · Grammatica (compact, inhoud-aware) */
(function(){
'use strict';

const LS_DONE_KEY = 'alm_gram_done_v2';
const LS_TRANS_KEY = 'alm_gram_show_translations_v1';
// Vertalingen worden standaard getoond en de keuze geldt voor alle lessen.
let showGrammarTranslations = true;
try { showGrammarTranslations = localStorage.getItem(LS_TRANS_KEY) !== '0'; } catch(e) {}
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
  // Toon de grammaticale uitleg, maar laat de zelfstandige woordenlijsten
  // (kop, woordentabel en bijbehorende *-voetnoot) weg uit deze sectie.
  // De oorspronkelijke data blijft behouden voor de PDF's bij Woordenschat.
  const rows = (inhoud || []).filter((item, i, all) => {
    const isGlossaryTitle = entry => entry && entry.type === 'tekst' &&
      /^Woordenlijst van les\b/i.test(String(entry.tekst || '').trim());
    if (isGlossaryTitle(item)) return false;
    if (item.type === 'tabel' && isGlossaryTitle(all[i - 1])) return false;
    if (item.type === 'regel' && /^\s*\*/.test(String(item.tekst || '')) &&
        all[i - 1] && all[i - 1].type === 'tabel' && isGlossaryTitle(all[i - 2])) return false;
    return true;
  });
  rows.forEach(item => {
    if(item.type === 'tekst'){
      html += `<p class="gram-p ${item.vet?'is-bold':''}">${formatDutchText(item.tekst)}</p>`;
    } else if(item.type === 'regel'){
      html += `<p class="gram-p gram-rule">${formatDutchText(item.tekst)}</p>`;
    } else if(item.type === 'voorbeeld'){
      const ar = item.ar ? `<span class="gram-ar" lang="ar" dir="rtl">${E(item.ar)}</span>` : '';
      const nl = item.nl ? `<span class="gram-nl">${formatDutchText(item.nl)}</span>` : '';
      // De lesdata blijft letterlijk gelijk. Alleen de presentatie verschuift
      // naar Arabisch eerst, daarna de vertaling; optioneel zelf op te vragen.
      const reveal = item.nl ? '<button type="button" class="gram-reveal-btn" aria-expanded="false">Vertaling tonen</button>' : '';
      html += `<div class="gram-ex-row">${ar}${nl}${reveal}</div>`;
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
  // Compacte lesbalk: geen knoppen meer die ongeordend om elkaar heen vouwen.
  const keys = Object.keys(G).map(Number).sort((a,b)=>a-b);
  const idx = keys.indexOf(n);
  const prevLesson = idx > 0 ? keys[idx-1] : null;
  const nextLesson = idx < keys.length-1 ? keys[idx+1] : null;

  const pager = `<nav class="gram-lesson-pager" aria-label="Bladeren tussen grammaticalessen">
    <div class="gram-pager-slot gram-pager-prev">
      ${prevLesson!==null ? `<a href="#/grammatica/${prevLesson}" class="gram-pager-btn gram-pager-outline" data-act="open-book" data-l="${prevLesson}" aria-label="Vorige les: les ${prevLesson}"><span aria-hidden="true">←</span> Les ${prevLesson}</a>` : ''}
    </div>
    <span class="gram-pager-count" aria-label="Les ${n} van 23">${String(n).padStart(2,'0')} / 23</span>
    <div class="gram-pager-slot gram-pager-next">
      ${nextLesson!==null ? `<a href="#/grammatica/${nextLesson}" class="gram-pager-btn gram-pager-primary" data-act="open-book" data-l="${nextLesson}" aria-label="Volgende les: les ${nextLesson}">Les ${nextLesson} <span aria-hidden="true">→</span></a>` : ''}
    </div>
  </nav>`;

  const header = `<header class="gram-lesson-header">
    <div class="gram-lesson-utility">
      <a href="#/grammatica" class="gram-overview-link" data-act="nav" data-v="book"><span aria-hidden="true">←</span> Alle lessen</a>
      <label class="gram-done-toggle"><input type="checkbox" id="gram-done-cb" data-l="${n}" ${isDone?'checked':''}><span>Afgerond</span></label>
    </div>
    <h1 class="gram-lesson-title">${pageTitle}</h1>
    ${pager}
  </header>`;

  const nextSteps = n >= 1 ? `<aside class="gram-next-steps" aria-label="Deze les verder oefenen">
    <strong>Verder oefenen met les ${n}</strong>
    <div class="gram-next-actions">
      <button type="button" class="gram-next-link gram-next-vocab" data-act="start-flash" data-l="${n}">Woorden oefenen <span aria-hidden="true">→</span></button>
      <button type="button" class="gram-next-link gram-next-exercise" data-act="open-ex" data-l="${n}">Grammatica oefenen <span aria-hidden="true">→</span></button>
    </div>
  </aside>` : '';

  const translationControl = `<div class="gram-reading-tools">
    <span class="gram-reading-label">Vertalingen bij voorbeelden</span>
    <label class="gram-trans-control">
      <input type="checkbox" id="gram-trans-toggle" role="switch"
        aria-label="Nederlandse vertalingen bij Arabische voorbeelden tonen"
        ${showGrammarTranslations?'checked':''}>
      <span class="gram-trans-track" aria-hidden="true"></span>
      <span class="gram-trans-caption">${showGrammarTranslations?'Aan':'Uit'}</span>
    </label>
  </div>`;

  return `<div class="gram-wrap gram-lesson-wrap ${showGrammarTranslations?'':'gram-trans-off'}">
    ${header}
    ${translationControl}
    <section class="gram-section gram-sec-theory">
      <div class="gram-content">${contentHtml}</div>
    </section>
    ${nextSteps}
    <footer class="gram-lesson-footer">
      ${pager}
      <a href="#/grammatica" class="gram-footer-overview" data-act="nav" data-v="book">Terug naar alle lessen</a>
    </footer>
  </div>`;
}

// Zelftest: met globale vertalingen UIT kan een student één voorbeeld
// onthullen en weer verbergen. De Arabische zin en vertaling zijn ongewijzigd.
document.addEventListener('click', function(e){
  const button = e.target && e.target.closest && e.target.closest('.gram-reveal-btn');
  if(!button) return;
  const example = button.closest('.gram-ex-row');
  const lesson = button.closest('.gram-lesson-wrap');
  if(!example || !lesson || !lesson.classList.contains('gram-trans-off')) return;
  const isRevealed = example.classList.toggle('is-revealed');
  button.setAttribute('aria-expanded', String(isRevealed));
  button.textContent = isRevealed ? 'Vertaling verbergen' : 'Vertaling tonen';
});

document.addEventListener('change', function(e){
  const t = e.target;
  if(t && t.id === 'gram-trans-toggle'){
    showGrammarTranslations = !!t.checked;
    try { localStorage.setItem(LS_TRANS_KEY, showGrammarTranslations ? '1' : '0'); } catch(e) {}
    const lesson = t.closest('.gram-lesson-wrap');
    if(lesson){
      lesson.classList.toggle('gram-trans-off', !showGrammarTranslations);
      lesson.querySelectorAll('.gram-ex-row.is-revealed').forEach(row => {
        row.classList.remove('is-revealed');
        const button = row.querySelector('.gram-reveal-btn');
        if(button){ button.textContent = 'Vertaling tonen'; button.setAttribute('aria-expanded', 'false'); }
      });
    }
    const caption = t.closest('.gram-trans-control')?.querySelector('.gram-trans-caption');
    if(caption) caption.textContent = showGrammarTranslations ? 'Aan' : 'Uit';
    return;
  }
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
// Laat de vertraagd geladen applicatie een directe leslink altijd opnieuw toepassen.
window.__applyGrammarDeepLink = handleHashRoute;
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
