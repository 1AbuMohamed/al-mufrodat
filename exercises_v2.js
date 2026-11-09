/* =====================================================================
   Al-Mufrodat · Oefeningen Medina Lesboek Deel 1
   Bron: Madina_Book1_Arabic_Text.pdf → img/oefeningen/
   Alle oefeningen als PDF-scans (geen verzonnen antwoorden)
   Hash: #/oefeningen , #/oefeningen/:nr
   ===================================================================== */
(function(){
'use strict';

const LS_DONE = 'alm_ex_done_v1';
let done = {};
try { done = JSON.parse(localStorage.getItem(LS_DONE) || '{}'); } catch(e){}
function saveDone(){ try { localStorage.setItem(LS_DONE, JSON.stringify(done)); } catch(e){} }

const E = s => {
  if(s == null) return '';
  return String(s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
};

// Bestandsnamen per les (img/oefeningen/)
const IMGS = {
  1: ['les01-oef1.webp','les01-oef2.webp','les01-oef3.webp','les01-oef4.webp'],
  2: ['les02-oef1.webp'],
  3: ['les03-oef1.webp','les03-oef2.webp','les03-oef3.webp','les03-oef4.webp','les03-oef5.webp','les03-oef6.webp','les03-oef7.webp','les03-oef8.webp','les03-oef9.webp'],
  4: ['les04-oef4a-1.webp','les04-oef4a-2.webp','les04-oef4a-3.webp','les04-oef4a-4.webp','les04-oef4b-1.webp','les04-oef4b-2.webp','les04-oef4b-3.webp','les04-oef4b-4.webp'],
  5: ['les05-oef1.webp','les05-oef2.webp','les05-oef3.webp','les05-oef4.webp','les05-oef5.webp','les05-oef6.webp','les05-oef7.webp','les05-oef8.webp','les05-oef9.webp'],
  6: ['les06-oef1.webp','les06-oef2.webp','les06-oef3.webp','les06-oef4.webp','les06-oef5.webp'],
  7: ['les07-oef1.webp','les07-oef2.webp'],
  8: ['les08-oef1.webp','les08-oef2.webp','les08-oef3.webp','les08-oef4.webp','les08-oef5.webp','les08-oef6.webp'],
  9: ['les09-oef9a-1.webp','les09-oef9a-2.webp','les09-oef9a-3.webp','les09-oef9a-4.webp','les09-oef9b-1.webp','les09-oef9b-2.webp','les09-oef9b-3.webp'],
  10: ['les10-oef1.webp','les10-oef2.webp','les10-oef3.webp','les10-oef4.webp','les10-oef5.webp','les10-oef6.webp','les10-oef7.webp','les10-oef8.webp','les10-oef9.webp'],
  11: ['les11-oef1.webp','les11-oef2.webp'],
  12: ['les12-oef1.webp','les12-oef2.webp','les12-oef3.webp','les12-oef4.webp','les12-oef5.webp','les12-oef6.webp'],
  13: ['les13-oef13a-1.webp','les13-oef13a-2.webp','les13-oef13a-3.webp','les13-oef13a-4.webp','les13-oef13a-5.webp','les13-oef13a-6.webp','les13-oef13b-1.webp','les13-oef13b-2.webp','les13-oef13b-3.webp','les13-oef13b-4.webp','les13-oef13b-5.webp','les13-oef13b-6.webp','les13-oef13c-1.webp','les13-oef13c-2.webp','les13-oef13c-3.webp','les13-oef13c-4.webp'],
  14: ['les14-oef1.webp','les14-oef2.webp','les14-oef3.webp','les14-oef4.webp','les14-oef5.webp','les14-oef6.webp'],
  15: ['les15-oef1.webp','les15-oef2.webp','les15-oef3.webp','les15-oef4.webp','les15-oef5.webp','les15-oef6.webp','les15-oef7.webp'],
  16: ['les16-oef1.webp','les16-oef2.webp','les16-oef3.webp','les16-oef4.webp'],
  17: ['les17-oef1.webp','les17-oef2.webp','les17-oef3.webp','les17-oef4.webp'],
  18: ['les18-oef1.webp','les18-oef2.webp','les18-oef3.webp','les18-oef4.webp','les18-oef5.webp','les18-oef6.webp'],
  19: ['les19-oef1.webp','les19-oef2.webp','les19-oef3.webp','les19-oef4.webp'],
  20: ['les20-oef1.webp','les20-oef2.webp','les20-oef3.webp','les20-oef4.webp','les20-oef5.webp'],
  21: ['les21-oef1.webp','les21-oef2.webp','les21-oef3.webp'],
  22: ['les22-oef1.webp'],
  23: ['les23-oef1.webp','les23-oef2.webp','les23-oef3.webp','les23-oef4.webp']
};

// Korte NL-titels (uit KOPPELING)
const TITLES = {
  1: ['1. مَا هَذَا؟','2. أَهَذَا…؟','3. إِقْرَأْ وَاكْتُبْ','4. إِقْرَأْ وَاكْتُبْ'],
  2: ['1. إِقْرَأْ وَاكْتُبْ'],
  3: ['1. Maanletters — uitgang','2. Lees en schrijf','3. Vul in','4. Vul in','5. Zonneletters — uitgang','6. Vul in','7. Kolommen أ/ب','8. Maan-/zonneletters lezen','9. Tabel'],
  4: ['Deel أ · 1. Vragen','Deel أ · 2. Uitgang','Deel أ · 3. Lees/schrijf','Deel أ · 4. Eigennamen','Deel ب · 1. Vragen','Deel ب · 2. Uitgang','Deel ب · 3. Lees/schrijf','Deel ب · 4. Voorzetsels'],
  5: ['1. Vragen','2. Iḍāfa','3. Uitgang','4. Lees','5. Vul in','6. Corrigeer','7. Vocatief يَا','8. Vragen bij afbeeldingen','9. همزة الوصل'],
  6: ['1. Lees/schrijf','2. مَا هَذَا / هَذِهِ؟','3. ♂ → ♀','4. Corrigeer','5. لِـ / لِمَنْ'],
  7: ['1. Lees/schrijf','2. ذَلِكَ / تِلْكَ'],
  8: ['1. Vragen','2. Lees/schrijf','3. Badal','4. Vragen bij afbeeldingen','5. Voorbeelden','6. Extra'],
  9: ['Deel أ · 1. Lees/schrijf','Deel أ · 2. Naʿt invullen','Deel أ · 3. Manʿūt invullen','Deel أ · 4. Diptota -ān','Deel ب · 1. Lees/schrijf','Deel ب · 2. Naʿt + ال','Deel ب · 3. الَّذِي'],
  10: ['1. Vragen','2. ه / هَا','3. Vragen (ja)','4. Vragen (nee)','5. Bezitsachtervoegsels','6. لِي / لَكَ / لَهُ','7. مَعَ','8. أَبٌ / أَخٌ','9. Namen op -atu'],
  19: ['1. Telwoorden ♂','2. Lees/schrijf','3. Antwoord met getal','4. Getallen 3–10'],
  20: ['1. Telwoorden ♀','2. Lees/schrijf','3. Antwoord met getal','4. Cijfers voluit','5. Getallen 3–10 ♀'],
  22: ['1. الممنوع من الصرف'],
  23: ['1. Voorbeelden محمد / زينب','2. Lees/schrijf','3. Uitgang','4. Getallen 3–10']
};

const EX = {};
for (let n = 1; n <= 23; n++) {
  const files = IMGS[n] || [];
  const titles = TITLES[n] || [];
  EX[n] = {
    title: 'Les ' + n,
    exercises: files.map((f, i) => ({
      title: titles[i] || ((i + 1) + '. Oefening'),
      img: 'img/oefeningen/' + f
    }))
  };
}

function renderOverview(){
  const keys = Object.keys(EX).map(Number).sort((a,b)=>a-b);
  let rows = '';
  keys.forEach(n => {
    const isDone = !!done[n];
    const count = (EX[n].exercises || []).length;
    rows += `<a href="#/oefeningen/${n}" class="gram-list-item ${isDone?'is-done':''}" data-act="open-ex" data-l="${n}">
      <span class="gram-list-label">Les ${n}</span>
      <span class="gram-list-status" style="display:flex;gap:8px;align-items:center">
        <span style="font-size:12px;color:var(--muted)">${count} oef.</span>
        ${isDone ? '<span class="gram-check">✓</span>' : '<span class="gram-chevron">›</span>'}
      </span>
    </a>`;
  });
  return `<div class="gram-wrap gram-overview-wrap">
    <div class="gram-overview-header">
      <h1 class="gram-lesson-title">Oefeningen</h1>
      <p class="gram-overview-subtitle">Oefeningen uit het Medina-lesboek (deel 1). Kies een les:</p>
    </div>
    <div class="gram-list">${rows}</div>
  </div>`;
}

function openExLightbox(src, alt){
  let lb = document.getElementById('ex-lightbox');
  if(!lb){
    lb = document.createElement('div');
    lb.id = 'ex-lightbox';
    lb.className = 'gram-lightbox';
    lb.innerHTML = `<div class="gram-lightbox-inner">
      <button type="button" class="gram-lightbox-close" aria-label="Sluiten">✕</button>
      <img src="" alt="" class="gram-lightbox-img">
    </div>`;
    document.body.appendChild(lb);
    lb.addEventListener('click', e => {
      if(e.target === lb || e.target.closest('.gram-lightbox-close')) lb.classList.remove('open');
    });
  }
  const img = lb.querySelector('.gram-lightbox-img');
  img.src = src; img.alt = alt || '';
  lb.classList.add('open');
}

function renderLesson(n){
  const les = EX[n];
  if(!les){
    return `<div class="gram-wrap"><p class="empty">Les niet gevonden.</p>
      <p><a href="#/oefeningen" data-act="open-ex-hub">← Alle oefeningen</a></p></div>`;
  }
  const prev = n > 1 ? n - 1 : null;
  const next = n < 23 ? n + 1 : null;
  let body = '';
  (les.exercises || []).forEach(ex => {
    body += `<section class="ex-block card" style="margin-bottom:16px;padding:16px 18px">
      <h3 style="margin:0 0 8px;font-size:16px">${E(ex.title)}</h3>
      <div class="gram-ex-card">
        <img src="${E(ex.img)}" alt="${E(ex.title)}" loading="lazy" class="gram-ex-img"
             data-act="ex-zoom" tabindex="0" role="button" aria-label="Vergroot ${E(ex.title)}"
             style="max-width:100%;height:auto;border-radius:8px;cursor:zoom-in;border:1px solid var(--line)">
      </div>
    </section>`;
  });
  const isDone = !!done[n];
  return `<div class="gram-wrap">
    <div class="gram-lesson-nav" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:14px">
      <a class="btn btn-secondary btn-sm" href="#/oefeningen" data-act="open-ex-hub">← Alle lessen</a>
      <span class="grow"></span>
      ${prev ? `<a class="btn btn-secondary btn-sm" href="#/oefeningen/${prev}" data-act="open-ex" data-l="${prev}">‹ Les ${prev}</a>` : ''}
      ${next ? `<a class="btn btn-secondary btn-sm" href="#/oefeningen/${next}" data-act="open-ex" data-l="${next}">Les ${next} ›</a>` : ''}
    </div>
    <h1 class="gram-lesson-title">${E(les.title)}</h1>
    <p style="color:var(--muted);font-size:13.5px;margin:-4px 0 16px">Medina-lesboek deel 1 · Originele oefeningen</p>
    ${body}
    <label style="display:flex;align-items:center;gap:8px;margin-top:12px;font-size:14px">
      <input type="checkbox" id="ex-done-cb" data-l="${n}" ${isDone?'checked':''}>
      Les afgerond
    </label>
  </div>`;
}

function handleHash(){
  const hash = location.hash || '';
  if(!hash.startsWith('#/oefeningen')) return false;
  const parts = hash.slice(1).split('/').filter(Boolean);
  if(typeof window.state !== 'object') return false;
  window.state.path = 'exercises';
  if(parts.length >= 2){
    const n = parseInt(parts[1], 10);
    window.state.view = 'ex-lesson';
    window.state.exLesson = isNaN(n) ? 1 : n;
  } else {
    window.state.view = 'ex';
    window.state.exLesson = null;
  }
  if(typeof window.sbMenuState === 'object') window.sbMenuState.ex = true;
  if(typeof window.render === 'function'){
    window.render();
    if(window.__scrollPageTop) window.__scrollPageTop();
    else window.scrollTo(0,0);
  }
  return true;
}

function renderExHub(){
  if(!location.hash.startsWith('#/oefeningen')){
    try { history.replaceState(null,'','#/oefeningen'); } catch(e){}
  }
  return renderOverview();
}
function renderExLesson(){
  const n = (window.state && window.state.exLesson != null) ? Number(window.state.exLesson) : 1;
  const h = '#/oefeningen/' + n;
  if(location.hash !== h){ try { history.replaceState(null,'',h); } catch(e){} }
  return renderLesson(n);
}

window.renderExercises = renderExHub;
window.renderExerciseLesson = renderExLesson;
window.EX2 = { L: EX, lessonDone: n => !!done[n] };

window.addEventListener('hashchange', handleHash);
window.addEventListener('DOMContentLoaded', handleHash);

document.addEventListener('click', e => {
  const t = e.target;
  if(t && t.id === 'ex-done-cb'){
    const n = parseInt(t.dataset.l, 10);
    done[n] = t.checked;
    saveDone();
    if(typeof renderSidebar === 'function'){
      const host = document.getElementById('sidebar-host');
      if(host) host.innerHTML = renderSidebar();
    }
  }
  const zoom = t && t.closest && t.closest('[data-act="ex-zoom"]');
  if(zoom){ e.preventDefault(); openExLightbox(zoom.src, zoom.alt); return; }
  const open = t && t.closest && t.closest('[data-act="open-ex"]');
  if(open){
    const n = parseInt(open.getAttribute('data-l'), 10);
    if(!isNaN(n) && window.state){
      window.state.path = 'exercises';
      window.state.view = 'ex-lesson';
      window.state.exLesson = n;
      if(window.sbMenuState) window.sbMenuState.ex = true;
      try { history.pushState(null,'','#/oefeningen/'+n); } catch(e){}
      if(window.render) window.render();
      if(window.__scrollPageTop) window.__scrollPageTop();
      else window.scrollTo(0,0);
      e.preventDefault();
    }
  }
  const hub = t && t.closest && t.closest('[data-act="open-ex-hub"]');
  if(hub && window.state){
    window.state.path = 'exercises';
    window.state.view = 'ex';
    window.state.exLesson = null;
    if(window.sbMenuState) window.sbMenuState.ex = true;
    try { history.pushState(null,'','#/oefeningen'); } catch(e){}
    if(window.render) window.render();
    if(window.__scrollPageTop) window.__scrollPageTop();
    else window.scrollTo(0,0);
    e.preventDefault();
  }
});

document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    const lb = document.getElementById('ex-lightbox');
    if(lb && lb.classList.contains('open')) lb.classList.remove('open');
  }
});

setTimeout(handleHash, 60);
})();
