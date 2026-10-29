/* =====================================================================
   Grammatica v2 · "Regel → Zien → Doen → Toetsen"
   Bron: Grammaticaboek Medina-methode Deel 1 (Les 0–23) en
         Dr. V. Abdur Rahim – Madinah Arabic Reader 8 (Les 24).
   Data: window.G2_LESSONS (lessons_v2.js). Alle inhoud letterlijk uit de pdf's.
   Dit script vervangt renderBook() en renderBookLesson() van de app.
   ===================================================================== */
(function(){
'use strict';
const L = window.G2_LESSONS || {};
const KEYS = Object.keys(L).map(Number).sort((a,b)=>a-b);
const PASS = 0.8;            // eindtoets: 80% nodig
const TEST_N = 12;           // aantal vragen in de eindtoets
const LS_KEY = 'alm_g2_v1';

/* ---------- opslag ---------- */
let P;
try{ P = JSON.parse(localStorage.getItem(LS_KEY)||'null'); }catch(e){ P=null; }
if(!P||typeof P!=='object') P = {lessons:{}, mistakes:[], unlockAll:false};
if(!P.lessons) P.lessons={};
if(!Array.isArray(P.mistakes)) P.mistakes=[];
function save(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(P)); }catch(e){} }
function lp(n){ if(!P.lessons[n]) P.lessons[n]={steps:{},vocab:false,book:null,test:null,review:false}; return P.lessons[n]; }

/* ---------- helpers ---------- */
const E = s => (typeof esc==='function'?esc(s):String(s??''));
const AR_RE = /[\u0600-\u06FF]/;
function isAr(s){ s=String(s||''); return AR_RE.test(s) && !/[a-zA-Z]{2,}/.test(s); }
function arHtml(s){ return (typeof markAr==='function') ? markAr(String(s),'plain') : E(s); }
function mix(s){ return (typeof glMix==='function') ? glMix(String(s||'')) : E(s); }
function shuf(a){ return (typeof shuffle==='function') ? shuffle(a) : a.slice().sort(()=>Math.random()-.5); }
function spk(text, label){
  return `<button type="button" class="g2-spk" data-act="speak-text" data-text="${E(text)}" title="Beluister" aria-label="Beluister">${label||ICO.spk}</button>`;
}
const ICO = {
  spk:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>',
  lock:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  check:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>',
  book:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z"/><path d="M6.5 17A2.5 2.5 0 0 0 4 19.5 2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>'
};

/* ---------- lesstructuur ---------- */
// nodes: review? · step 0..k · vocab · book · test
function nodes(n){
  const g=L[n]; if(!g) return [];
  const out=[];
  if(dueMistakes(n).length) out.push({k:'review', t:'Herhaling', s:'Fouten uit eerdere lessen'});
  (g.steps||[]).forEach((s,i)=>out.push({k:'step', i, t:s.title, s:'blz. '+(s.page||g.pages||'')}));
  if((g.vocab||[]).length) out.push({k:'vocab', t:'Woordenlijst', s:g.vocab.length+' woorden uit de les'});
  if(bookItems(n).length) out.push({k:'book', t:'Oefeningen uit het boek', s:bookItems(n).length+' opdrachten'});
  if(testPool(n).length) out.push({k:'test', t:'Eindtoets', s:'80% nodig om af te ronden'});
  return out;
}
function nodeDone(n,nd){
  const p=lp(n);
  if(nd.k==='review') return !!p.review;
  if(nd.k==='step') return !!p.steps[nd.i];
  if(nd.k==='vocab') return !!p.vocab;
  if(nd.k==='book') return !!(p.book&&p.book.done);
  if(nd.k==='test') return !!(p.test&&p.test.passed);
  return false;
}
function nodeOpen(n,idx){
  if(P.unlockAll) return true;
  const ns=nodes(n);
  for(let j=0;j<idx;j++){ if(ns[j].k==='review') continue; if(!nodeDone(n,ns[j])) return false; }
  return true;
}
function lessonPassed(n){ const p=lp(n); return !!(p.test&&p.test.passed) || (!testPool(n).length && nodes(n).every(nd=>nodeDone(n,nd))); }
function lessonOpen(n){
  if(P.unlockAll) return true;
  const i=KEYS.indexOf(Number(n));
  return i<=0 || lessonPassed(KEYS[i-1]);
}
function lessonPct(n){
  const ns=nodes(n).filter(x=>x.k!=='review'); if(!ns.length) return 0;
  return Math.round(100*ns.filter(nd=>nodeDone(n,nd)).length/ns.length);
}
function bookItems(n){
  const out=[]; (L[n].bookExercises||[]).forEach((ex,e)=>(ex.items||[]).forEach((it,i)=>out.push({d:it, ref:n+':b:'+e+':'+i, instr:ex.instr, page:ex.page})));
  return out.filter(x=>validDrill(x.d));
}
function stepDrills(n,si){
  const s=(L[n].steps||[])[si]; if(!s) return [];
  return (s.drills||[]).map((d,i)=>({d, ref:n+':s:'+si+':'+i, page:s.page})).filter(x=>validDrill(x.d));
}
function testPool(n){
  const all=[]; (L[n].steps||[]).forEach((s,si)=>all.push(...stepDrills(n,si)));
  all.push(...bookItems(n));
  return all;
}
function validDrill(d){
  if(!d||!d.type) return false;
  if(d.type==='order') return Array.isArray(d.words)&&d.words.length>=2;
  return Array.isArray(d.options)&&d.options.length>=2&&typeof d.answer==='number'&&d.answer>=0&&d.answer<d.options.length;
}
function findDrill(ref){
  const [n,kind,a,b,c]=ref.split(':');
  const g=L[n]; if(!g) return null;
  if(kind==='s'){ const s=g.steps&&g.steps[a]; const d=s&&s.drills&&s.drills[b]; return d?{d,ref,page:s.page}:null; }
  const ex=g.bookExercises&&g.bookExercises[a]; const d=ex&&ex.items&&ex.items[b];
  return d?{d,ref,instr:ex.instr,page:ex.page}:null;
}
/* gespreide herhaling: fout → na 1 les terug, daarna na 3 lessen */
function addMistake(ref){
  const n=Number(ref.split(':')[0]);
  const m=P.mistakes.find(x=>x.ref===ref);
  if(m){ m.due=n+1; m.lvl=0; } else P.mistakes.push({ref, due:n+1, lvl:0});
  save();
}
function dueMistakes(n){ return P.mistakes.filter(m=>m.due<=n && Number(m.ref.split(':')[0])<n).slice(0,6); }
function resolveMistake(ref, ok, n){
  const m=P.mistakes.find(x=>x.ref===ref); if(!m) return;
  if(ok){ if(m.lvl>=1) P.mistakes=P.mistakes.filter(x=>x!==m); else { m.lvl=1; m.due=n+3; } }
  else { m.due=n+1; m.lvl=0; }
  save();
}

/* ---------- sessie (state.g2) ---------- */
function S(){ if(!state.g2) state.g2={}; return state.g2; }
function startNode(n, idx){
  const nd=nodes(n)[idx]; if(!nd) return;
  const s=S(); Object.assign(s,{n:Number(n), node:idx, kind:nd.k, phase:'rule', qi:0, ans:null, built:[], score:0, hideNl:false});
  if(nd.k==='step'){ s.si=nd.i; s.queue=stepDrills(n,nd.i).map(x=>x.ref); s.retry={}; s.phase='rule'; }
  if(nd.k==='book'){ s.queue=bookItems(n).map(x=>x.ref); s.retry={}; s.phase='do'; }
  if(nd.k==='test'){ s.queue=shuf(testPool(n)).slice(0,TEST_N).map(x=>x.ref); s.phase='do'; s.total=s.queue.length; }
  if(nd.k==='review'){ s.queue=dueMistakes(n).map(m=>m.ref); s.phase='do'; s.total=s.queue.length; }
  if(nd.k==='vocab'){ s.phase='see'; }
  s.total = s.total || (s.queue?s.queue.length:0);
  s.view='node';
  prepDrill();
}
function prepDrill(){
  const s=S(); s.ans=null; s.built=[];
  const ref=s.queue&&s.queue[0]; if(!ref){ s.cur=null; return; }
  const x=findDrill(ref); s.cur=x;
  if(x&&x.d.type==='order') s.bank=shuf(x.d.words.map((w,i)=>({w,i})));
  if(x&&x.d.type!=='order') s.optOrder=x.d.options.map((_,i)=>i);
}

/* ---------- renderers ---------- */
function head(n, sub){
  const g=L[n]||{};
  return `<div class="g2-top">
    <button class="back" data-act="g2-hub" style="margin:0"><span>←</span> Alle lessen</button>
    <span class="grow"></span>
    ${typeof wordsFor==='function'&&wordsFor(n).length?`<button class="btn btn-secondary btn-sm" data-act="start-learn" data-l="${n}">Woorden oefenen</button>`:''}
  </div>
  <div class="g2-head">
    <div class="g2-eyebrow">${n===24?'Madinah Arabic Reader 8':'Medina Deel 1'} · ${n===0?'Inleiding':'Les '+n} · blz. ${E(g.pages||'')}</div>
    <h1>${E(g.title||'')}</h1>
    ${g.titleAr?`<div class="g2-titlear ar" lang="ar">${arHtml(g.titleAr)}</div>`:''}
    ${sub||''}
  </div>`;
}

const PILLARS = [
  { id: 'p1', name: 'Basiszinnen & Aanwijzers', lessons: [0, 1, 2, 3], desc: 'Klinkers · هَذَا · ذَلِكَ · اَلْمَعْرِفَة' },
  { id: 'p2', name: 'Voorzetsels & Plaats', lessons: [4, 8], desc: 'فِي · عَلَى · مِنْ · إِلَى · أَمَامَ · خَلْفَ' },
  { id: 'p3', name: 'Idāfah (Bezit) & Pronouns', lessons: [5, 10], desc: 'مُضَاف · مُضَاف إِلَيْهِ · الضَّمَائِر' },
  { id: 'p4', name: 'Vrouwelijk & Na\'t', lessons: [6, 7, 9, 12], desc: 'هَذِهِ · تِلْكَ · نَعْت وَمَنْعُوت · أَنْتِ' },
  { id: 'p5', name: 'Meervoud & Tweevoud', lessons: [13, 14, 15, 16, 17, 18], desc: 'جَمْع مُذَكَّر/مُؤَنَّث/تَكْسِير · مُثَنَّى' },
  { id: 'p6', name: 'Getallen 3–10', lessons: [19, 20], desc: 'تَمْيِيز الْعَدَد (mannelijk & vrouwelijk)' },
  { id: 'p7', name: 'Diptoten (Zonder Tanwīn)', lessons: [22, 23], desc: 'مَمْنُوع مِنَ الصَّرْف (Fathah i.p.v. Kasrah)' },
  { id: 'p8', name: 'Madinah Reader 8', lessons: [24], desc: 'الْمَفْعُولُ فِيهِ · لَوْ الشَّرْطِيَّةُ · قَبْلُ' }
];

function pillarPct(p){
  const sum = p.lessons.reduce((acc, n) => acc + lessonPct(n), 0);
  return Math.round(sum / p.lessons.length);
}

function renderHub(){
  const done=KEYS.filter(lessonPassed).length;
  const pct=KEYS.length?Math.round(100*done/KEYS.length):0;
  let nextN=KEYS.find(n=>!lessonPassed(n)); if(nextN===undefined) nextN=KEYS[KEYS.length-1];
  const items=KEYS.map(n=>{
    const g=L[n], open=lessonOpen(n), passed=lessonPassed(n), p=lessonPct(n);
    const cls=passed?'done':!open?'locked':p>0?'busy':'new';
    const lbl=passed?'Afgerond':!open?'Vergrendeld':p>0?p+'%':'Nieuw';
    return `<button type="button" class="g2-lesson ${cls} ${n===nextN?'next':''}" data-act="g2-open" data-l="${n}" ${open?'':'aria-disabled="true"'}>
      <span class="g2-num">${passed?ICO.check:!open?ICO.lock:String(n).padStart(2,'0')}</span>
      <span class="g2-lbody">
        <span class="g2-lmeta">${n===0?'Inleiding':n===24?'Reader 8':'Les '+n} · blz. ${E(g.pages||'')} · ${lbl}</span>
        <span class="g2-ltitle">${E(g.title||'')}</span>
        <span class="g2-lbar"><i style="width:${p}%"></i></span>
      </span>
    </button>`;
  }).join('');
  return `<div class="desktop-page g2">
    <div class="g2-hero">
      <div>
        <div class="g2-eyebrow">Grammatica · leerpad</div>
        <h1>Medina Deel 1 + Reader 8</h1>
        <p>Elke les volgt het boek letterlijk, regel voor regel: <b>lees de regel</b>, <b>bekijk de voorbeelden</b>, <b>pas hem meteen toe</b>, maak daarna <b>de oefeningen uit het boek</b> en sluit af met een <b>eindtoets</b>. Fouten komen in latere lessen terug als herhaling.</p>
      </div>
      <div class="g2-hero-stat"><b>${done}</b><span>/ ${KEYS.length} lessen</span><div class="g2-lbar"><i style="width:${pct}%"></i></div></div>
    </div>
    ${nextN!==undefined?`<button type="button" class="g2-resume" data-act="g2-open" data-l="${nextN}"><span>Ga verder</span><b>${nextN===0?'Inleiding':'Les '+nextN} · ${E(L[nextN].title)}</b><span>→</span></button>`:''}
    <div class="g2-pillars">
      <div class="g2-pillar-head">
        <h3>Voortgang per grammaticale pijler</h3>
        <span>${PILLARS.filter(p => pillarPct(p) === 100).length} / 8 pijlers beheerst</span>
      </div>
      <div class="g2-pillar-grid">
        ${PILLARS.map(p => {
          const pct = pillarPct(p);
          const isDone = pct === 100;
          return `<div class="g2-pillar-card ${isDone ? 'done' : pct > 0 ? 'busy' : ''}">
            <div class="g2-pillar-top">
              <span class="g2-pillar-name">${E(p.name)}</span>
              <span class="g2-pillar-pct">${isDone ? ICO.check : pct + '%'}</span>
            </div>
            <div class="g2-pillar-desc">${E(p.desc)}</div>
            <div class="g2-lbar"><i style="width:${pct}%"></i></div>
          </div>`;
        }).join('')}
      </div>
    </div>
    <div class="g2-list">${items}</div>
    <label class="g2-unlock"><input type="checkbox" data-act="g2-unlock" ${P.unlockAll?'checked':''}> Alle lessen en stappen vrij openen (zonder volgorde)</label>
  </div>`;
}

function renderLessonMap(n){
  const ns=nodes(n);
  const rows=ns.map((nd,i)=>{
    const done=nodeDone(n,nd), open=nodeOpen(n,i);
    const cls=done?'done':open?'open':'locked';
    return `<button type="button" class="g2-node ${cls} k-${nd.k}" data-act="g2-node" data-i="${i}" ${open?'':'disabled'}>
      <span class="g2-dot">${done?ICO.check:!open?ICO.lock:(nd.k==='step'?nd.i+1:nd.k==='book'?ICO.book:nd.k==='test'?'T':nd.k==='vocab'?'W':'H')}</span>
      <span class="g2-ntext"><b>${E(nd.t)}</b><small>${E(nd.s)}</small></span>
    </button>`;
  }).join('');
  const p=lp(n);
  const testInfo=p.test?`<div class="g2-note">Beste score eindtoets: <b>${Math.round(100*p.test.best)}%</b>${p.test.passed?' · afgerond':''}</div>`:'';
  const i=KEYS.indexOf(n), nx=KEYS[i+1];
  return `<div class="desktop-page g2">
    ${head(n, `<div class="g2-lbar big"><i style="width:${lessonPct(n)}%"></i></div>`)}
    ${testInfo}
    <div class="g2-path">${rows}</div>
    ${lessonPassed(n)&&nx!==undefined?`<button class="btn btn-primary" data-act="g2-open" data-l="${nx}">Volgende les →</button>`:''}
  </div>`;
}

function renderTable(t){
  if(!t||!t.rows||!t.rows.length) return '';
  const th=(t.headers||[]).map(h=>`<th>${mix(h)}</th>`).join('');
  const tr=t.rows.map(r=>'<tr>'+r.map(c=>{
    const s=String(c??'');
    return isAr(s)?`<td class="ar-cell"><span class="ar" lang="ar">${arHtml(s)}</span>${spk(s)}</td>`:`<td>${mix(s)}</td>`;
  }).join('')+'</tr>').join('');
  return `<div class="g2-table-wrap"><table class="g2-table">${th?`<thead><tr>${th}</tr></thead>`:''}<tbody>${tr}</tbody></table></div>`;
}

function renderExamples(list, hideNl){
  return `<div class="g2-ex">${list.map((e,i)=>`<div class="g2-exrow">
      ${spk(e.ar)}
      <span class="g2-exar ar" lang="ar">${arHtml(e.ar)}</span>
      <span class="g2-exnl ${hideNl?'hid':''}" ${hideNl?`data-act="g2-reveal" data-i="${i}"`:''}>${hideNl?'tik om te tonen':mix(e.nl||'')}</span>
    </div>`).join('')}</div>`;
}

function phaseBar(s){
  const ph=['rule','see','do']; const lbl={rule:'1 · Regel',see:'2 · Zien',do:'3 · Doen'};
  const cur=ph.indexOf(s.phase);
  return `<div class="g2-phases">${ph.map((p,i)=>`<span class="${i===cur?'on':i<cur?'done':''}">${lbl[p]}</span>`).join('')}</div>`;
}

function renderStep(n){
  const s=S(), st=L[n].steps[s.si];
  const nTot=L[n].steps.length;
  let body='';
  if(s.phase==='rule'){
    body=`<div class="g2-card">
      <div class="g2-kicker">Regel ${s.si+1} van ${nTot} · blz. ${E(st.page||'')}</div>
      <h2>${E(st.title)}</h2>
      ${(st.text||[]).map(p=>isAr(p)?`<p class="g2-arp ar" lang="ar">${arHtml(p)}</p>`:`<p>${mix(p)}</p>`).join('')}
      ${renderTable(st.table)}
      <div class="g2-actions"><button class="btn btn-primary" data-act="g2-phase" data-p="${(st.examples||[]).length?'see':'do'}" data-gl="next">${(st.examples||[]).length?'Bekijk de voorbeelden →':'Pas de regel toe →'}</button></div>
    </div>`;
  }else if(s.phase==='see'){
    const ex=st.examples||[];
    body=`<div class="g2-card">
      <div class="g2-kicker">Voorbeelden uit het boek · blz. ${E(st.page||'')}</div>
      <h2>${E(st.title)}</h2>
      <p class="g2-hint">Lees hardop en luister. Verberg de vertaling om jezelf te testen.</p>
      <div class="g2-tools"><button class="btn btn-ghost btn-sm" data-act="g2-hide">${s.hideNl?'Toon vertalingen':'Verberg vertalingen'}</button></div>
      ${renderExamples(ex, s.hideNl)}
      <div class="g2-actions">
        <button class="btn btn-secondary" data-act="g2-phase" data-p="rule">← Regel</button>
        <button class="btn btn-primary" data-act="g2-phase" data-p="do" data-gl="next">${s.queue.length?'Pas de regel toe →':'Stap afronden →'}</button>
      </div>
    </div>`;
  }else{
    body = s.queue.length ? renderDrill(s, `Toepassen · regel ${s.si+1}`) : `<div class="g2-card g2-center">
      <div class="g2-kicker">Regel ${s.si+1} beheerst</div>
      <h2>${E(st.title)}</h2>
      <div class="g2-actions"><button class="btn btn-primary" data-act="g2-finish" data-gl="next">Verder in de les →</button></div>
    </div>`;
  }
  return `<div class="desktop-narrow g2">
    ${head(n)}
    ${phaseBar(s)}
    ${body}
  </div>`;
}

function renderDrill(s, kicker){
  const x=s.cur; if(!x) return '';
  const d=x.d; const done=s.total-s.queue.length;
  const prog=`<div class="g2-qprog"><span>${E(kicker)}</span><span>${Math.min(done+1,s.total)} / ${s.total}</span></div><div class="g2-lbar"><i style="width:${s.total?Math.round(100*done/s.total):0}%"></i></div>`;
  const src = x.instr?`<div class="g2-src">${ICO.book} ${mix(x.instr)}${x.page?' · blz. '+E(x.page):''}</div>`:(x.page?`<div class="g2-src">Bron: blz. ${E(x.page)}</div>`:'');
  let q='', opts='';
  const answered = s.ans!==null;
  if(d.type==='order'){
    const builtWords=s.built.map(i=>s.bank[i]?s.bank[i].w:'').filter(Boolean);
    q=`<div class="g2-q">${d.nl?mix(d.nl):'Zet de woorden in de juiste volgorde'}</div>
      <div class="g2-build ar" lang="ar" dir="rtl">${builtWords.length?builtWords.map(w=>`<span>${arHtml(w)}</span>`).join(''):'<em>Tik de woorden in de juiste volgorde (van rechts naar links)</em>'}</div>
      <div class="g2-bank" dir="rtl">${s.bank.map((b,i)=>`<button class="g2-chip ar" lang="ar" data-act="g2-pick" data-i="${i}" ${s.built.includes(i)||answered?'disabled':''}>${arHtml(b.w)}</button>`).join('')}</div>
      ${answered?'':`<div class="g2-actions"><button class="btn btn-ghost btn-sm" data-act="g2-undo" ${s.built.length?'':'disabled'}>Wis laatste</button><button class="btn btn-primary" data-act="g2-check" ${s.built.length===s.bank.length?'':'disabled'}>Controleer</button></div>`}`;
  }else{
    let prompt='';
    if(d.type==='fill'){
      const parts=String(d.ar||'').split('_');
      prompt=`<div class="g2-fill ar" lang="ar" dir="rtl">${arHtml(parts[0]||'')}<span class="g2-gap">${answered?arHtml(d.options[d.answer]):'&nbsp;؟&nbsp;'}</span>${arHtml(parts.slice(1).join('_'))}</div>${d.nl?`<div class="g2-sub">${mix(d.nl)}</div>`:''}<div class="g2-q">Kies wat op de open plek hoort</div>`;
    }else if(d.type==='transform'){
      prompt=`<div class="g2-q">${mix(d.prompt||'')}</div><div class="g2-from ar" lang="ar">${arHtml(d.from||'')} ${spk(d.from||'')}</div>`;
    }else if(d.type==='parse'){
      const target=d.target||'';
      const sent=d.sentence||'';
      let sentHtml='';
      if(target && sent.includes(target)){
        const idx=sent.indexOf(target);
        sentHtml=`${arHtml(sent.slice(0,idx))}<mark class="g2-parse-target ar" lang="ar">${arHtml(target)}</mark>${arHtml(sent.slice(idx+target.length))}`;
      }else{
        sentHtml=arHtml(sent);
      }
      prompt=`<div class="g2-parse-badge">${ICO.check} Zinsontleding · I'rāb Coach</div>
        <div class="g2-parse-box">
          <div class="g2-parse-sent ar" lang="ar" dir="rtl">${sentHtml} ${spk(sent)}</div>
          <div class="g2-sub">Wat is de grammaticale rol (إعراب) van <b class="ar" lang="ar">«${arHtml(target)}»</b> in deze zin?</div>
        </div>`;
    }else{
      prompt=`<div class="g2-q">${mix(d.q||'')}</div>`;
    }
    opts=`<div class="g2-opts">${s.optOrder.map((oi,k)=>{
      const o=d.options[oi]; let c='g2-opt'+(isAr(o)?' ar':'');
      if(answered){ if(oi===d.answer) c+=' ok'; else if(oi===s.ans) c+=' bad'; }
      return `<button class="${c}" data-act="g2-ans" data-oi="${oi}" ${answered?'disabled':''}><span class="g2-key">${k+1}</span>${isAr(o)?`<span lang="ar">${arHtml(o)}</span>`:mix(o)}</button>`;
    }).join('')}</div>`;
    q=prompt+opts;
  }
  let fb='';
  if(answered){
    const ok=s.lastOk;
    const correct = d.type==='order' ? d.words.join(' ') : d.options[d.answer];
    fb=`<div class="g2-fb ${ok?'ok':'bad'}">
      <b>${ok?'Goed!':'Nog niet goed'}</b>
      ${ok?'':`<div class="g2-correct">Juist: <span class="ar" lang="ar">${isAr(correct)?arHtml(correct):mix(correct)}</span>${isAr(correct)?spk(correct):''}</div>`}
      ${d.explain?`<p>${mix(d.explain)}</p>`:''}
      ${!ok&&s.kind==='step'?'<p class="g2-hint">Deze vraag komt aan het einde van deze stap terug.</p>':''}
      <button class="btn btn-primary" data-act="g2-next" data-gl="next">Verder →</button>
    </div>`;
  }
  return `<div class="g2-card">${prog}${src}${q}${fb}</div>`;
}

function renderSimpleRun(n, title){
  const s=S();
  if(s.queue.length) return `<div class="desktop-narrow g2">${head(n)}${renderDrill(s,title)}</div>`;
  // resultaat
  const pct=s.total?s.score/s.total:1;
  let msg='', extra='';
  if(s.kind==='test'){
    const passed=pct>=PASS;
    msg=passed?'Les afgerond':'Nog niet gehaald';
    extra=passed?'Je beheerst deze les. De volgende les is nu open.':`Je hebt ${Math.round(PASS*100)}% nodig. Herhaal de regels waar je fouten maakte en probeer opnieuw.`;
  }else if(s.kind==='book'){ msg='Boekoefeningen klaar'; extra='Foute antwoorden komen terug in de eindtoets en in latere herhaling.'; }
  else { msg='Herhaling klaar'; extra='Goed beantwoorde vragen komen later nog één keer terug; daarna zijn ze afgevinkt.'; }
  const i=KEYS.indexOf(n), nx=KEYS[i+1];
  return `<div class="desktop-narrow g2">${head(n)}<div class="g2-card g2-center">
    <div class="g2-kicker">${E(title)}</div>
    <div class="g2-score">${Math.round(pct*100)}%</div>
    <h2>${msg}</h2><p>${extra}</p>
    <div class="g2-actions">
      ${s.kind==='test'&&pct<PASS?`<button class="btn btn-secondary" data-act="g2-node" data-i="${s.node}">Opnieuw</button>`:''}
      <button class="btn btn-primary" data-act="g2-map" data-gl="next">Terug naar de les</button>
      ${s.kind==='test'&&pct>=PASS&&nx!==undefined?`<button class="btn btn-primary" data-act="g2-open" data-l="${nx}">Volgende les →</button>`:''}
    </div></div></div>`;
}

function renderVocab(n){
  const s=S(); const v=L[n].vocab||[];
  return `<div class="desktop-narrow g2">${head(n)}<div class="g2-card">
    <div class="g2-kicker">Woordenlijst uit de les</div>
    <p class="g2-hint">Luister naar elk woord en zeg het na. Verberg de vertaling om jezelf te overhoren. Oefen de woorden daarna in het woordenschat-leerpad.</p>
    <div class="g2-tools"><button class="btn btn-ghost btn-sm" data-act="g2-hide">${s.hideNl?'Toon vertalingen':'Verberg vertalingen'}</button></div>
    ${renderExamples(v, s.hideNl)}
    <div class="g2-actions"><button class="btn btn-primary" data-act="g2-finish" data-gl="next">Woordenlijst gezien →</button></div>
  </div></div>`;
}

function renderLesson(){
  const n=Number(state.bookLesson); const s=S();
  if(!L[n]) return `<div class="desktop-narrow"><div class="empty">Les niet gevonden.</div></div>`;
  if(s.n!==n || s.view!=='node') return renderLessonMap(n);
  if(s.kind==='step') return renderStep(n);
  if(s.kind==='vocab') return renderVocab(n);
  if(s.kind==='book') return renderSimpleRun(n,'Oefeningen uit het boek');
  if(s.kind==='test') return renderSimpleRun(n,'Eindtoets');
  if(s.kind==='review') return renderSimpleRun(n,'Herhaling');
  return renderLessonMap(n);
}

/* ---------- acties ---------- */
function answer(ok){
  const s=S(); s.lastOk=ok;
  const ref=s.queue[0];
  if(s.kind==='review') resolveMistake(ref, ok, s.n);
  else if(!ok) addMistake(ref);
  if(ok && !(s.retry&&s.retry[ref])) s.score++;
  if(typeof sfx==='function'){ try{ sfx(ok); }catch(e){} }
}
function next(){
  const s=S(); const ref=s.queue.shift();
  if(!s.lastOk && s.kind==='step'){ s.retry[ref]=true; s.queue.push(ref); }
  if(s.queue.length) prepDrill();
  else if(s.kind==='step'){ /* toont "beheerst" */ }
  else finishRun();
}
function finishRun(){
  const s=S(), p=lp(s.n);
  const pct=s.total?s.score/s.total:1;
  if(s.kind==='book') p.book={done:true, score:pct};
  if(s.kind==='test'){ const best=Math.max(pct,(p.test&&p.test.best)||0); p.test={best, passed:(p.test&&p.test.passed)||pct>=PASS}; }
  if(s.kind==='review') p.review=true;
  save();
}
function finishNode(){
  const s=S(), p=lp(s.n);
  if(s.kind==='step') p.steps[s.si]=true;
  if(s.kind==='vocab') p.vocab=true;
  save();
  // automatisch door naar de volgende open stap
  const ns=nodes(s.n); const ni=s.node+1;
  if(ns[ni] && nodeOpen(s.n,ni) && ns[ni].k==='step'){ startNode(s.n, ni); }
  else s.view='map';
}
function scrollTop(){ try{ (document.getElementById('app')||window).scrollTop=0; window.scrollTo(0,0); }catch(e){} }

document.addEventListener('click', e=>{
  const btn=e.target.closest&&e.target.closest('[data-act]'); if(!btn) return;
  const act=btn.dataset.act;
  if(act==='open-book'){
    e.stopImmediatePropagation();
    const n=parseInt(btn.dataset.l,10);
    if(!L[n]) return;
    state.path='grammar'; state.view='book-lesson'; state.bookLesson=n; S().view='map'; S().n=n;
    try{ lastGrammar=n; saveG(); }catch(err){}
    render(); scrollTop(); return;
  }
  if(!act.startsWith('g2-')) return;
  e.stopImmediatePropagation();
  const s=S();
  if(act==='g2-hub'){ state.view='book'; state.bookLesson=null; s.view='map'; render(); scrollTop(); return; }
  if(act==='g2-open'){
    const n=parseInt(btn.dataset.l,10);
    if(!lessonOpen(n)){ alert('Rond eerst de eindtoets van de vorige les af (of zet "Alle lessen vrij openen" aan).'); return; }
    state.path='grammar'; state.view='book-lesson'; state.bookLesson=n; s.n=n; s.view='map';
    try{ lastGrammar=n; saveG(); }catch(err){}
    render(); scrollTop(); return;
  }
  if(act==='g2-unlock'){ P.unlockAll=btn.checked; save(); render(); return; }
  if(act==='g2-map'){ s.view='map'; render(); scrollTop(); return; }
  if(act==='g2-node'){ startNode(state.bookLesson, +btn.dataset.i); render(); scrollTop(); return; }
  if(act==='g2-phase'){ s.phase=btn.dataset.p; s.hideNl=false; render(); scrollTop(); return; }
  if(act==='g2-hide'){ s.hideNl=!s.hideNl; s.shown={}; render(); return; }
  if(act==='g2-reveal'){ btn.classList.remove('hid'); btn.removeAttribute('data-act'); 
    const st=s.kind==='vocab'?L[s.n].vocab:L[s.n].steps[s.si].examples; const it=st[+btn.dataset.i]; if(it) btn.innerHTML=mix(it.nl||''); return; }
  if(act==='g2-ans'){ if(s.ans!==null) return; s.ans=+btn.dataset.oi; answer(s.ans===s.cur.d.answer); render(); return; }
  if(act==='g2-pick'){ if(s.ans!==null) return; s.built.push(+btn.dataset.i); render(); return; }
  if(act==='g2-undo'){ s.built.pop(); render(); return; }
  if(act==='g2-check'){
    if(s.ans!==null) return;
    const got=s.built.map(i=>s.bank[i]?s.bank[i].w:'').filter(Boolean).join(' ');
    s.ans=-1; answer(got===s.cur.d.words.join(' ')); render(); return;
  }
  if(act==='g2-next'){ next(); render(); scrollTop(); return; }
  if(act==='g2-finish'){ finishNode(); render(); scrollTop(); return; }
}, true);

document.addEventListener('keydown', e=>{
  if(state.view!=='book-lesson') return;
  if(e.target.matches&&e.target.matches('input,textarea,select')) return;
  if(['1','2','3','4','5','6'].includes(e.key)){
    const b=document.querySelectorAll('.g2-opt:not(:disabled)')[+e.key-1]; if(b){ e.preventDefault(); e.stopImmediatePropagation(); b.click(); }
  }
  if(e.key==='Enter'){
    const b=document.querySelector('.g2 [data-gl="next"]:not(:disabled)'); if(b){ e.preventDefault(); e.stopImmediatePropagation(); b.click(); }
  }
}, true);

/* ---------- koppelen aan de app ---------- */
window.renderBook = renderHub;
window.renderBookLesson = renderLesson;
try { renderBook = renderHub; renderBookLesson = renderLesson; } catch(e){}
window.G2 = {L, P, nodes, testPool, bookItems, stepDrills, startNode, lessonOpen, lessonPassed, save, S};
if(typeof render==='function') try{ render(); }catch(e){}
})();
