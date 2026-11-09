/* Al-Mufrodat · Oefeningen + zinsontleding (toggle + slepen) */
(function(){
'use strict';
const LS_DONE='alm_ex_done_v1', LS_PARSE='alm_ex_parse_on_v1';
let done={}; try{done=JSON.parse(localStorage.getItem(LS_DONE)||'{}')}catch(e){}
function saveDone(){try{localStorage.setItem(LS_DONE,JSON.stringify(done))}catch(e){}}
let parseOn=false; try{parseOn=localStorage.getItem(LS_PARSE)==='1'}catch(e){}
function saveParse(){try{localStorage.setItem(LS_PARSE,parseOn?'1':'0')}catch(e){}}
const E=s=>{if(s==null)return'';return String(s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"')};

const IMGS={1:['les01-oef1.webp','les01-oef2.webp','les01-oef3.webp','les01-oef4.webp'],2:['les02-oef1.webp'],3:['les03-oef1.webp','les03-oef2.webp','les03-oef3.webp','les03-oef4.webp','les03-oef5.webp','les03-oef6.webp','les03-oef7.webp','les03-oef8.webp','les03-oef9.webp'],4:['les04-oef4a-1.webp','les04-oef4a-2.webp','les04-oef4a-3.webp','les04-oef4a-4.webp','les04-oef4b-1.webp','les04-oef4b-2.webp','les04-oef4b-3.webp','les04-oef4b-4.webp'],5:['les05-oef1.webp','les05-oef2.webp','les05-oef3.webp','les05-oef4.webp','les05-oef5.webp','les05-oef6.webp','les05-oef7.webp','les05-oef8.webp','les05-oef9.webp'],6:['les06-oef1.webp','les06-oef2.webp','les06-oef3.webp','les06-oef4.webp','les06-oef5.webp'],7:['les07-oef1.webp','les07-oef2.webp'],8:['les08-oef1.webp','les08-oef2.webp','les08-oef3.webp','les08-oef4.webp','les08-oef5.webp','les08-oef6.webp'],9:['les09-oef9a-1.webp','les09-oef9a-2.webp','les09-oef9a-3.webp','les09-oef9a-4.webp','les09-oef9b-1.webp','les09-oef9b-2.webp','les09-oef9b-3.webp'],10:['les10-oef1.webp','les10-oef2.webp','les10-oef3.webp','les10-oef4.webp','les10-oef5.webp','les10-oef6.webp','les10-oef7.webp','les10-oef8.webp','les10-oef9.webp'],11:['les11-oef1.webp','les11-oef2.webp'],12:['les12-oef1.webp','les12-oef2.webp','les12-oef3.webp','les12-oef4.webp','les12-oef5.webp','les12-oef6.webp'],13:['les13-oef13a-1.webp','les13-oef13a-2.webp','les13-oef13a-3.webp','les13-oef13a-4.webp','les13-oef13a-5.webp','les13-oef13a-6.webp','les13-oef13b-1.webp','les13-oef13b-2.webp','les13-oef13b-3.webp','les13-oef13b-4.webp','les13-oef13b-5.webp','les13-oef13b-6.webp','les13-oef13c-1.webp','les13-oef13c-2.webp','les13-oef13c-3.webp','les13-oef13c-4.webp'],14:['les14-oef1.webp','les14-oef2.webp','les14-oef3.webp','les14-oef4.webp','les14-oef5.webp','les14-oef6.webp'],15:['les15-oef1.webp','les15-oef2.webp','les15-oef3.webp','les15-oef4.webp','les15-oef5.webp','les15-oef6.webp','les15-oef7.webp'],16:['les16-oef1.webp','les16-oef2.webp','les16-oef3.webp','les16-oef4.webp'],17:['les17-oef1.webp','les17-oef2.webp','les17-oef3.webp','les17-oef4.webp'],18:['les18-oef1.webp','les18-oef2.webp','les18-oef3.webp','les18-oef4.webp','les18-oef5.webp','les18-oef6.webp'],19:['les19-oef1.webp','les19-oef2.webp','les19-oef3.webp','les19-oef4.webp'],20:['les20-oef1.webp','les20-oef2.webp','les20-oef3.webp','les20-oef4.webp','les20-oef5.webp'],21:['les21-oef1.webp','les21-oef2.webp','les21-oef3.webp'],22:['les22-oef1.webp'],23:['les23-oef1.webp','les23-oef2.webp','les23-oef3.webp','les23-oef4.webp']};
const TITLES={1:['1. مَا هَذَا؟','2. أَهَذَا…؟','3. إِقْرَأْ وَاكْتُبْ','4. إِقْرَأْ وَاكْتُبْ'],2:['1. إِقْرَأْ وَاكْتُبْ'],3:['1. Maanletters','2. Lees/schrijf','3. Vul in','4. Vul in','5. Zonneletters','6. Vul in','7. Kolommen','8. Lezen','9. Tabel'],4:['أ 1. Vragen','أ 2. Uitgang','أ 3. Lees','أ 4. Namen','ب 1. Vragen','ب 2. Uitgang','ب 3. Lees','ب 4. Voorzetsels'],5:['1. Vragen','2. Iḍāfa','3. Uitgang','4. Lees','5. Vul in','6. Corrigeer','7. Vocatief','8. Afbeeldingen','9. همزة الوصل'],6:['1. Lees','2. مَا هَذَا/هَذِهِ','3. ♂→♀','4. Corrigeer','5. لِـ'],7:['1. Lees','2. ذَلِكَ/تِلْكَ'],8:['1. Vragen','2. Lees','3. Badal','4. Afbeeldingen','5. Voorbeelden','6. Extra'],9:['أ 1. Lees','أ 2. Naʿt','أ 3. Manʿūt','أ 4. Diptota','ب 1. Lees','ب 2. Naʿt+ال','ب 3. الَّذِي'],10:['1. Vragen','2. ه/هَا','3. Ja','4. Nee','5. Bezitsachtervoegsels','6. لِي','7. مَعَ','8. أَب/أَخ','9. Namen']};

const EX={};
for(let n=1;n<=23;n++){
  const files=IMGS[n]||[], titles=TITLES[n]||[];
  EX[n]={title:'Les '+n,exercises:files.map((f,i)=>({title:titles[i]||((i+1)+'. Oefening'),img:'img/oefeningen/'+f}))};
}

function renderOverview(){
  const keys=Object.keys(EX).map(Number).sort((a,b)=>a-b);
  let rows='';
  keys.forEach(n=>{
    const isDone=!!done[n], count=(EX[n].exercises||[]).length;
    rows+=`<a href="#/oefeningen/${n}" class="gram-list-item ${isDone?'is-done':''}" data-act="open-ex" data-l="${n}">
      <span class="gram-list-label">Les ${n}</span>
      <span class="gram-list-status" style="display:flex;gap:8px;align-items:center">
        <span style="font-size:12px;color:var(--muted)">${count} oef.</span>
        ${isDone?'<span class="gram-check">✓</span>':'<span class="gram-chevron">›</span>'}
      </span></a>`;
  });
  return `<div class="gram-wrap gram-overview-wrap"><div class="gram-overview-header">
    <h1 class="gram-lesson-title">Oefeningen</h1>
    <p class="gram-overview-subtitle">Oefeningen uit het Medina-lesboek (deel 1). Kies een les:</p>
  </div><div class="gram-list">${rows}</div></div>`;
}

function openExLightbox(src,alt){
  let lb=document.getElementById('ex-lightbox');
  if(!lb){
    lb=document.createElement('div'); lb.id='ex-lightbox'; lb.className='gram-lightbox';
    lb.innerHTML=`<div class="gram-lightbox-inner"><button type="button" class="gram-lightbox-close" aria-label="Sluiten">✕</button><img src="" alt="" class="gram-lightbox-img"></div>`;
    document.body.appendChild(lb);
    lb.addEventListener('click',e=>{if(e.target===lb||e.target.closest('.gram-lightbox-close'))lb.classList.remove('open')});
  }
  const img=lb.querySelector('.gram-lightbox-img'); img.src=src; img.alt=alt||''; lb.classList.add('open');
}

function PD(){ return window.PARSE_DATA || {ROLES:{},SENTENCES:{},rolesForLesson:()=>[]}; }

function renderParseBlock(lessonN){
  const data=PD();
  const sentences=data.SENTENCES[lessonN]||[];
  if(!sentences.length) return '';
  const roleKeys=data.rolesForLesson(lessonN);
  const ROLES=data.ROLES;
  let palette=roleKeys.map(k=>{
    const r=ROLES[k]; if(!r) return '';
    return `<span class="parse-chip" draggable="true" data-role="${k}" style="background:${r.color}18;border:1.5px solid ${r.color};color:${r.color}" title="${E(r.nl)}">${E(r.ar)}</span>`;
  }).join('');
  let sents='';
  sentences.forEach((s,si)=>{
    const words=s.tokens.map((tok,ti)=>`<span class="parse-word" data-si="${si}" data-ti="${ti}" data-correct="${tok.r}" lang="ar" dir="rtl">${E(tok.t)}</span>`).join(' ');
    sents+=`<div class="parse-sentence" data-si="${si}"><div class="parse-words" dir="rtl">${words}</div>
      <div class="parse-feedback" id="parse-fb-${si}" style="display:none;margin-top:6px;font-size:13px"></div></div>`;
  });
  return `<section class="parse-section card" style="margin:20px 0;padding:16px 18px;border:1px solid var(--line);border-radius:12px;background:var(--surface)">
    <div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:12px">
      <h2 style="margin:0;font-size:17px">Zinsontleding</h2>
      <span style="font-size:12.5px;color:var(--muted)">Sleep label op woord · of tik woord om rol te wisselen</span>
    </div>
    <div class="parse-palette" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px">${palette}</div>
    <div class="parse-sentences" style="display:flex;flex-direction:column;gap:18px">${sents}</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px">
      <button type="button" class="btn btn-primary btn-sm" data-act="parse-check">Controleer</button>
      <button type="button" class="btn btn-secondary btn-sm" data-act="parse-reset">Opnieuw</button>
      <button type="button" class="btn btn-secondary btn-sm" data-act="parse-reveal">Toon oplossing</button>
    </div>
  </section>`;
}

function bindParseUI(){
  const section=document.querySelector('.parse-section');
  if(!section) return;
  const ROLES=PD().ROLES;
  let dragRole=null;

  function assignRole(el,role){
    const r=ROLES[role]; if(!r) return;
    el.dataset.assigned=role;
    el.style.background=r.color+'22';
    el.style.borderBottom='3px solid '+r.color;
    el.title=r.nl+' · '+r.ar;
    let badge=el.querySelector('.role-badge');
    if(!badge){ badge=document.createElement('span'); badge.className='role-badge';
      badge.style.cssText='display:block;font-size:10px;font-weight:700;margin-top:2px;opacity:.9'; el.appendChild(badge); }
    badge.textContent=r.ar; badge.style.color=r.color;
  }

  section.querySelectorAll('.parse-chip').forEach(chip=>{
    chip.addEventListener('dragstart',e=>{ dragRole=chip.dataset.role; e.dataTransfer.setData('text/plain',dragRole); e.dataTransfer.effectAllowed='copy'; });
    chip.addEventListener('click',()=>{
      section.querySelectorAll('.parse-chip').forEach(c=>c.classList.remove('selected'));
      chip.classList.add('selected'); dragRole=chip.dataset.role;
    });
  });

  const lessonN=(window.state&&window.state.exLesson)||1;
  section.querySelectorAll('.parse-word').forEach(w=>{
    w.addEventListener('dragover',e=>{e.preventDefault();w.classList.add('drag-over')});
    w.addEventListener('dragleave',()=>w.classList.remove('drag-over'));
    w.addEventListener('drop',e=>{
      e.preventDefault(); w.classList.remove('drag-over');
      const role=e.dataTransfer.getData('text/plain')||dragRole;
      if(role) assignRole(w,role);
    });
    w.addEventListener('click',()=>{
      if(dragRole){ assignRole(w,dragRole); return; }
      const keys=PD().rolesForLesson(lessonN);
      const cur=w.dataset.assigned||'';
      const idx=keys.indexOf(cur);
      assignRole(w, keys[(idx+1)%keys.length]);
    });
  });

  const checkBtn=section.querySelector('[data-act="parse-check"]');
  if(checkBtn) checkBtn.addEventListener('click',()=>{
    section.querySelectorAll('.parse-sentence').forEach(sent=>{
      const si=sent.dataset.si; let ok=0,total=0;
      sent.querySelectorAll('.parse-word').forEach(w=>{
        total++;
        if(w.dataset.assigned===w.dataset.correct){ ok++; w.style.outline='2px solid #16a34a'; }
        else w.style.outline='2px solid #dc2626';
      });
      const fb=document.getElementById('parse-fb-'+si);
      if(fb){ fb.style.display='block';
        fb.innerHTML=ok===total?'<span style="color:#16a34a;font-weight:600">✓ Alles juist</span>'
          :`<span style="color:#dc2626">${ok}/${total} juist</span>`;
      }
    });
  });

  const resetBtn=section.querySelector('[data-act="parse-reset"]');
  if(resetBtn) resetBtn.addEventListener('click',()=>{
    section.querySelectorAll('.parse-word').forEach(w=>{
      delete w.dataset.assigned; w.style.background=''; w.style.borderBottom=''; w.style.outline=''; w.title='';
      const b=w.querySelector('.role-badge'); if(b) b.remove();
    });
    section.querySelectorAll('.parse-feedback').forEach(f=>{f.style.display='none';f.innerHTML=''});
    dragRole=null; section.querySelectorAll('.parse-chip').forEach(c=>c.classList.remove('selected'));
  });

  const revealBtn=section.querySelector('[data-act="parse-reveal"]');
  if(revealBtn) revealBtn.addEventListener('click',()=>{
    section.querySelectorAll('.parse-word').forEach(w=>{ assignRole(w,w.dataset.correct); w.style.outline='2px solid #16a34a'; });
    section.querySelectorAll('.parse-feedback').forEach(f=>{f.style.display='block';f.innerHTML='<span style="color:var(--muted)">Oplossing getoond</span>'});
  });
}

function renderLesson(n){
  const les=EX[n];
  if(!les) return `<div class="gram-wrap"><p class="empty">Les niet gevonden.</p><p><a href="#/oefeningen" data-act="open-ex-hub">← Alle oefeningen</a></p></div>`;
  const prev=n>1?n-1:null, next=n<23?n+1:null;
  let body='';
  (les.exercises||[]).forEach(ex=>{
    body+=`<section class="ex-block card" style="margin-bottom:16px;padding:16px 18px">
      <h3 style="margin:0 0 8px;font-size:16px">${E(ex.title)}</h3>
      <div class="gram-ex-card"><img src="${E(ex.img)}" alt="${E(ex.title)}" loading="lazy" class="gram-ex-img"
        data-act="ex-zoom" tabindex="0" role="button" style="max-width:100%;height:auto;border-radius:8px;cursor:zoom-in;border:1px solid var(--line)"></div>
    </section>`;
  });
  const isDone=!!done[n];
  const parseHtml=parseOn?renderParseBlock(n):'';
  return `<div class="gram-wrap" data-l="${n}">
    <div class="gram-lesson-nav" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:14px">
      <a class="btn btn-secondary btn-sm" href="#/oefeningen" data-act="open-ex-hub">← Alle lessen</a>
      <span class="grow"></span>
      <label style="display:flex;align-items:center;gap:6px;font-size:13.5px;cursor:pointer;user-select:none">
        <input type="checkbox" id="ex-parse-toggle" ${parseOn?'checked':''}>
        <span>Zinsontleding</span>
      </label>
      ${prev?`<a class="btn btn-secondary btn-sm" href="#/oefeningen/${prev}" data-act="open-ex" data-l="${prev}">‹ Les ${prev}</a>`:''}
      ${next?`<a class="btn btn-secondary btn-sm" href="#/oefeningen/${next}" data-act="open-ex" data-l="${next}">Les ${next} ›</a>`:''}
    </div>
    <h1 class="gram-lesson-title">${E(les.title)}</h1>
    <p style="color:var(--muted);font-size:13.5px;margin:-4px 0 16px">Medina-lesboek deel 1 · Originele oefeningen</p>
    ${body}${parseHtml}
    <label style="display:flex;align-items:center;gap:8px;margin-top:12px;font-size:14px">
      <input type="checkbox" id="ex-done-cb" data-l="${n}" ${isDone?'checked':''}> Les afgerond
    </label>
  </div>`;
}

function handleHash(){
  const hash=location.hash||'';
  if(!hash.startsWith('#/oefeningen')) return false;
  const parts=hash.slice(1).split('/').filter(Boolean);
  if(typeof window.state!=='object') return false;
  window.state.path='exercises';
  if(parts.length>=2){ const n=parseInt(parts[1],10); window.state.view='ex-lesson'; window.state.exLesson=isNaN(n)?1:n; }
  else { window.state.view='ex'; window.state.exLesson=null; }
  if(typeof window.sbMenuState==='object') window.sbMenuState.ex=true;
  if(typeof window.render==='function'){ window.render(); if(window.__scrollPageTop) window.__scrollPageTop(); else window.scrollTo(0,0); }
  setTimeout(bindParseUI,30);
  return true;
}

function renderExHub(){
  if(!location.hash.startsWith('#/oefeningen')){ try{history.replaceState(null,'','#/oefeningen')}catch(e){} }
  return renderOverview();
}
function renderExLesson(){
  const n=(window.state&&window.state.exLesson!=null)?Number(window.state.exLesson):1;
  const h='#/oefeningen/'+n;
  if(location.hash!==h){ try{history.replaceState(null,'',h)}catch(e){} }
  const html=renderLesson(n);
  setTimeout(bindParseUI,40);
  return html;
}

window.renderExercises=renderExHub;
window.renderExerciseLesson=renderExLesson;
window.EX2={L:EX,lessonDone:n=>!!done[n]};

window.addEventListener('hashchange',handleHash);
window.addEventListener('DOMContentLoaded',handleHash);

document.addEventListener('click',e=>{
  const t=e.target;
  if(t&&t.id==='ex-done-cb'){ const n=parseInt(t.dataset.l,10); done[n]=t.checked; saveDone();
    if(typeof renderSidebar==='function'){ const host=document.getElementById('sidebar-host'); if(host) host.innerHTML=renderSidebar(); } }
  if(t&&t.id==='ex-parse-toggle'){ parseOn=!!t.checked; saveParse(); if(window.render) window.render(); setTimeout(bindParseUI,40); }
  const zoom=t&&t.closest&&t.closest('[data-act="ex-zoom"]');
  if(zoom){ e.preventDefault(); openExLightbox(zoom.src,zoom.alt); return; }
  const open=t&&t.closest&&t.closest('[data-act="open-ex"]');
  if(open){ const n=parseInt(open.getAttribute('data-l'),10);
    if(!isNaN(n)&&window.state){ window.state.path='exercises'; window.state.view='ex-lesson'; window.state.exLesson=n;
      if(window.sbMenuState) window.sbMenuState.ex=true;
      try{history.pushState(null,'','#/oefeningen/'+n)}catch(e){}
      if(window.render) window.render(); if(window.__scrollPageTop) window.__scrollPageTop(); else window.scrollTo(0,0);
      setTimeout(bindParseUI,40); e.preventDefault(); } }
  const hub=t&&t.closest&&t.closest('[data-act="open-ex-hub"]');
  if(hub&&window.state){ window.state.path='exercises'; window.state.view='ex'; window.state.exLesson=null;
    if(window.sbMenuState) window.sbMenuState.ex=true;
    try{history.pushState(null,'','#/oefeningen')}catch(e){}
    if(window.render) window.render(); if(window.__scrollPageTop) window.__scrollPageTop(); else window.scrollTo(0,0); e.preventDefault(); }
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ const lb=document.getElementById('ex-lightbox'); if(lb&&lb.classList.contains('open')) lb.classList.remove('open'); }
});

const parseStyle=document.createElement('style');
parseStyle.textContent=`.parse-chip{display:inline-flex;align-items:center;padding:5px 10px;border-radius:999px;font-size:13px;font-weight:600;cursor:grab;user-select:none}
.parse-chip.selected{box-shadow:0 0 0 3px rgba(0,0,0,.12);transform:scale(1.05)}
.parse-word{display:inline-block;padding:6px 10px;margin:3px 2px;border-radius:8px;font-size:18px;line-height:1.4;cursor:pointer;border:1.5px solid transparent;vertical-align:top;text-align:center}
.parse-word.drag-over{border-color:var(--gold,#c9a227);background:rgba(201,162,39,.12)}
.parse-words{line-height:2.1}
.parse-sentence{padding:12px;border-radius:10px;background:var(--paper-deep,rgba(0,0,0,.03))}`;
document.head.appendChild(parseStyle);
setTimeout(handleHash,60);
})();
