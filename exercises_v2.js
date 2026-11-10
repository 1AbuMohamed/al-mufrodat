/* Al-Mufrodat · Oefeningen + zinsontleding (toggle + slepen) — polished MVP */
(function(){
'use strict';

const LS_DONE = 'alm_ex_done_v1';
const LS_PARSE = 'alm_ex_parse_on_v1';

let done = {};
try { done = JSON.parse(localStorage.getItem(LS_DONE) || '{}'); } catch(e){}
function saveDone(){ try { localStorage.setItem(LS_DONE, JSON.stringify(done)); } catch(e){} }

let parseOn = false;
try { parseOn = localStorage.getItem(LS_PARSE) === '1'; } catch(e){}
function saveParse(){ try { localStorage.setItem(LS_PARSE, parseOn ? '1' : '0'); } catch(e){} }

const E = s => {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const IMGS = {
  1:['les01-oef1.webp','les01-oef2.webp','les01-oef3.webp','les01-oef4.webp'],
  2:['les02-oef1.webp'],
  3:['les03-oef1.webp','les03-oef2.webp','les03-oef3.webp','les03-oef4.webp','les03-oef5.webp','les03-oef6.webp','les03-oef7.webp','les03-oef8.webp','les03-oef9.webp'],
  4:['les04-oef4a-1.webp','les04-oef4a-2.webp','les04-oef4a-3.webp','les04-oef4a-4.webp','les04-oef4b-1.webp','les04-oef4b-2.webp','les04-oef4b-3.webp','les04-oef4b-4.webp'],
  5:['les05-oef1.webp','les05-oef2.webp','les05-oef3.webp','les05-oef4.webp','les05-oef5.webp','les05-oef6.webp','les05-oef7.webp','les05-oef8.webp','les05-oef9.webp'],
  6:['les06-oef1.webp','les06-oef2.webp','les06-oef3.webp','les06-oef4.webp','les06-oef5.webp'],
  7:['les07-oef1.webp','les07-oef2.webp'],
  8:['les08-oef1.webp','les08-oef2.webp','les08-oef3.webp','les08-oef4.webp','les08-oef5.webp','les08-oef6.webp'],
  9:['les09-oef9a-1.webp','les09-oef9a-2.webp','les09-oef9a-3.webp','les09-oef9a-4.webp','les09-oef9b-1.webp','les09-oef9b-2.webp','les09-oef9b-3.webp'],
  10:['les10-oef1.webp','les10-oef2.webp','les10-oef3.webp','les10-oef4.webp','les10-oef5.webp','les10-oef6.webp','les10-oef7.webp','les10-oef8.webp','les10-oef9.webp'],
  11:['les11-oef1.webp','les11-oef2.webp'],
  12:['les12-oef1.webp','les12-oef2.webp','les12-oef3.webp','les12-oef4.webp','les12-oef5.webp','les12-oef6.webp'],
  13:['les13-oef13a-1.webp','les13-oef13a-2.webp','les13-oef13a-3.webp','les13-oef13a-4.webp','les13-oef13a-5.webp','les13-oef13a-6.webp','les13-oef13b-1.webp','les13-oef13b-2.webp','les13-oef13b-3.webp','les13-oef13b-4.webp','les13-oef13b-5.webp','les13-oef13b-6.webp','les13-oef13c-1.webp','les13-oef13c-2.webp','les13-oef13c-3.webp','les13-oef13c-4.webp'],
  14:['les14-oef1.webp','les14-oef2.webp','les14-oef3.webp','les14-oef4.webp','les14-oef5.webp','les14-oef6.webp'],
  15:['les15-oef1.webp','les15-oef2.webp','les15-oef3.webp','les15-oef4.webp','les15-oef5.webp','les15-oef6.webp'],
  16:['les16-oef1.webp','les16-oef2.webp','les16-oef3.webp','les16-oef4.webp','les16-oef5.webp'],
  17:['les17-oef1.webp','les17-oef2.webp','les17-oef3.webp','les17-oef4.webp'],
  18:['les18-oef1.webp','les18-oef2.webp','les18-oef3.webp','les18-oef4.webp','les18-oef5.webp'],
  19:['les19-oef1.webp','les19-oef2.webp','les19-oef3.webp','les19-oef4.webp'],
  20:['les20-oef1.webp','les20-oef2.webp','les20-oef3.webp','les20-oef4.webp','les20-oef5.webp'],
  21:['les21-oef1.webp','les21-oef2.webp','les21-oef3.webp'],
  22:['les22-oef1.webp'],
  23:['les23-oef1.webp','les23-oef2.webp','les23-oef3.webp','les23-oef4.webp']
};

const TITLES={1:['1. مَا هَذَا؟','2. أَهَذَا…؟','3. إِقْرَأْ وَاكْتُبْ','4. إِقْرَأْ وَاكْتُبْ'],2:['1. إِقْرَأْ وَاكْتُبْ'],3:['1. Maanletters','2. Lees/schrijf','3. Vul in','4. Vul in','5. Zonneletters','6. Vul in','7. Kolommen','8. Lezen','9. Tabel'],4:['أ 1. Vragen','أ 2. Uitgang','أ 3. Lees','أ 4. Namen','ب 1. Vragen','ب 2. Uitgang','ب 3. Lees','ب 4. Voorzetsels'],5:['1. Vragen','2. Iḍāfa','3. Uitgang','4. Lees','5. Vul in','6. Corrigeer','7. Vocatief','8. Afbeeldingen','9. همزة الوصل'],6:['1. Lees','2. مَا هَذَا/هَذِهِ','3. ♂→♀','4. Corrigeer','5. لِـ'],7:['1. Lees','2. ذَلِكَ/تِلْكَ'],8:['1. Vragen','2. Lees','3. Badal','4. Afbeeldingen','5. Voorbeelden','6. Extra'],9:['أ 1. Lees','أ 2. Naʿt','أ 3. Manʿūt','أ 4. Diptota','ب 1. Lees','ب 2. Naʿt+ال','ب 3. الَّذِي'],10:['1. Vragen','2. ه/هَا','3. Ja','4. Nee','5. Bezitsachtervoegsels','6. لِي','7. مَعَ','8. أَب/أَخ','9. Namen']};

const EX = {};
Object.keys(IMGS).forEach(k => {
  const n = Number(k);
  const files = IMGS[n] || [];
  const titles = TITLES[n] || [];
  EX[n] = {
    title: 'Les ' + n,
    exercises: files.map((f, i) => ({
      title: titles[i] || ((i + 1) + '. Oefening'),
      img: 'img/oefeningen/' + f
    }))
  };
});

function PD(){
  return window.PARSE_DATA || { ROLES: {}, SENTENCES: {}, rolesForLesson: () => [] };
}

/* ---------- Overview ---------- */
function renderOverview(){
  const keys = Object.keys(EX).map(Number).sort((a, b) => a - b);
  let rows = '';
  keys.forEach(n => {
    const isDone = !!done[n];
    const count = (EX[n].exercises || []).length;
    rows += `<a href="#/oefeningen/${n}" class="gram-list-item ${isDone ? 'is-done' : ''}" data-act="open-ex" data-l="${n}">
      <span class="gram-list-label">Les ${n}</span>
      <span class="gram-list-status">
        <span class="ex-count">${count} oef.</span>
        ${isDone ? '<span class="gram-check" title="Afgerond">✓</span>' : '<span class="gram-chevron">›</span>'}
      </span>
    </a>`;
  });
  return `<div class="gram-wrap gram-overview-wrap">
    <div class="gram-overview-header">
      <h1 class="gram-lesson-title">Oefeningen</h1>
      <p class="gram-overview-subtitle">Medina lesboek · deel 1</p>
    </div>
    <div class="gram-list">${rows}</div>
  </div>`;
}

/* ---------- Lightbox ---------- */
function openExLightbox(src, alt){
  let lb = document.getElementById('ex-lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'ex-lightbox';
    lb.className = 'gram-lightbox';
    lb.innerHTML = `<div class="gram-lightbox-inner">
      <button type="button" class="gram-lightbox-close" aria-label="Sluiten">✕</button>
      <img src="" alt="" class="gram-lightbox-img">
    </div>`;
    document.body.appendChild(lb);
    lb.addEventListener('click', e => {
      if (e.target === lb || e.target.closest('.gram-lightbox-close')) lb.classList.remove('open');
    });
  }
  const img = lb.querySelector('.gram-lightbox-img');
  img.src = src;
  img.alt = alt || '';
  lb.classList.add('open');
}

/* ---------- Zinsontleding block ---------- */
function renderParseBlock(lessonN){
  const data = PD();
  const sentences = data.SENTENCES[lessonN] || [];
  if (!sentences.length) return '';

  const roleKeys = data.rolesForLesson(lessonN);
  const ROLES = data.ROLES;

  const palette = roleKeys.map(k => {
    const r = ROLES[k];
    if (!r) return '';
    return `<button type="button" class="parse-chip" draggable="true" data-role="${k}"
      style="--role:${r.color}" title="${E(r.nl)}">
      <span class="parse-chip-ar" lang="ar" dir="rtl">${E(r.ar)}</span>
      <span class="parse-chip-nl">${E(r.nl)}</span>
    </button>`;
  }).join('');

  let s = sentences.map((s, si) => {
    const words = s.tokens.map((tok, ti) =>
      `<span class="parse-word" data-si="${si}" data-ti="${ti}" data-correct="${tok.r}" lang="ar" dir="rtl">${E(tok.t)}</span>`
    ).join('');
    return `<div class="parse-sentence" data-si="${si}">
      <div class="parse-words" dir="rtl">${words}</div>
      <div class="parse-feedback" id="parse-fb-${si}" hidden></div>
    </div>`;
  }).join('');

  return `<section class="parse-section">
    <header class="parse-head">
      <div class="parse-head-text">
        <h2 class="parse-title">Zinsontleding</h2>
        <p class="parse-hint">Sleep een label op een woord, of tik een woord om te wisselen</p>
      </div>
    </header>
    <div class="parse-palette">${palette}</div>
    <div class="parse-sentences">${s}</div>
    <div class="parse-actions">
      <button type="button" class="btn btn-primary btn-sm" data-act="parse-check">Controleer</button>
      <button type="button" class="btn btn-secondary btn-sm" data-act="parse-reset">Opnieuw</button>
      <button type="button" class="btn btn-ghost btn-sm" data-act="parse-reveal">Toon oplossing</button>
    </div>
  </section>`;
}

function bindParseUI(){
  const section = document.querySelector('.parse-section');
  if (!section) return;
  const ROLES = PD().ROLES;
  let dragRole = null;

  function assignRole(el, role){
    const r = ROLES[role];
    if (!r) return;
    el.dataset.assigned = role;
    el.style.setProperty('--role', r.color);
    el.classList.add('has-role');
    el.title = r.nl + ' · ' + r.ar;
    let badge = el.querySelector('.role-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'role-badge';
      el.appendChild(badge);
    }
    badge.textContent = r.ar;
    badge.style.color = r.color;
  }

  function clearWord(w){
    delete w.dataset.assigned;
    w.classList.remove('has-role', 'is-correct', 'is-wrong');
    w.style.removeProperty('--role');
    w.title = '';
    const b = w.querySelector('.role-badge');
    if (b) b.remove();
  }

  section.querySelectorAll('.parse-chip').forEach(chip => {
    chip.addEventListener('dragstart', e => {
      dragRole = chip.dataset.role;
      e.dataTransfer.setData('text/plain', dragRole);
      e.dataTransfer.effectAllowed = 'copy';
      chip.classList.add('dragging');
    });
    chip.addEventListener('dragend', () => chip.classList.remove('dragging'));
    chip.addEventListener('click', () => {
      section.querySelectorAll('.parse-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      dragRole = chip.dataset.role;
    });
  });

  const lessonN = (window.state && window.state.exLesson) || 1;

  section.querySelectorAll('.parse-word').forEach(w => {
    w.addEventListener('dragover', e => { e.preventDefault(); w.classList.add('drag-over'); });
    w.addEventListener('dragleave', () => w.classList.remove('drag-over'));
    w.addEventListener('drop', e => {
      e.preventDefault();
      w.classList.remove('drag-over');
      const role = e.dataTransfer.getData('text/plain') || dragRole;
      if (role) assignRole(w, role);
    });
    w.addEventListener('click', () => {
      if (dragRole) { assignRole(w, dragRole); return; }
      const keys = PD().rolesForLesson(lessonN);
      const cur = w.dataset.assigned || '';
      const idx = keys.indexOf(cur);
      assignRole(w, keys[(idx + 1) % keys.length]);
    });
  });

  const checkBtn = section.querySelector('[data-act="parse-check"]');
  if (checkBtn) checkBtn.addEventListener('click', () => {
    section.querySelectorAll('.parse-sentence').forEach(sent => {
      const si = sent.dataset.si;
      let ok = 0, total = 0;
      sent.querySelectorAll('.parse-word').forEach(w => {
        total++;
        w.classList.remove('is-correct', 'is-wrong');
        if (w.dataset.assigned === w.dataset.correct) {
          ok++;
          w.classList.add('is-correct');
        } else {
          w.classList.add('is-wrong');
        }
      });
      const fb = document.getElementById('parse-fb-' + si);
      if (fb) {
        fb.hidden = false;
        if (ok === total) {
          fb.className = 'parse-feedback ok';
          fb.innerHTML = '✓ Alles juist';
        } else {
          fb.className = 'parse-feedback bad';
          fb.innerHTML = ok + '/' + total + ' juist';
        }
      }
    });
  });

  const resetBtn = section.querySelector('[data-act="parse-reset"]');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    section.querySelectorAll('.parse-word').forEach(clearWord);
    section.querySelectorAll('.parse-feedback').forEach(f => {
      f.hidden = true;
      f.innerHTML = '';
      f.className = 'parse-feedback';
    });
    dragRole = null;
    section.querySelectorAll('.parse-chip').forEach(c => c.classList.remove('selected'));
  });

  const revealBtn = section.querySelector('[data-act="parse-reveal"]');
  if (revealBtn) revealBtn.addEventListener('click', () => {
    section.querySelectorAll('.parse-word').forEach(w => {
      assignRole(w, w.dataset.correct);
      w.classList.remove('is-wrong');
      w.classList.add('is-correct');
    });
    section.querySelectorAll('.parse-feedback').forEach(f => {
      f.hidden = false;
      f.className = 'parse-feedback muted';
      f.innerHTML = 'Oplossing getoond';
    });
  });
}

/* ---------- Lesson view ---------- */
function renderLesson(n){
  const les = EX[n];
  if (!les) {
    return `<div class="gram-wrap">
      <p class="empty">Les niet gevonden.</p>
      <p><a href="#/oefeningen" data-act="open-ex-hub">← Alle oefeningen</a></p>
    </div>`;
  }

  const prev = n > 1 ? n - 1 : null;
  const next = n < 23 ? n + 1 : null;
  const isDone = !!done[n];
  const hasParse = (PD().SENTENCES[n] || []).length > 0;

  let body = '';
  (les.exercises || []).forEach((ex, i) => {
    body += `<article class="ex-block">
      <header class="ex-block-head">
        <span class="ex-num">${i + 1}</span>
        <h3 class="ex-block-title">${E(ex.title)}</h3>
      </header>
      <div class="ex-img-wrap">
        <img src="${E(ex.img)}" alt="${E(ex.title)}" loading="lazy"
          class="ex-img" data-act="ex-zoom" tabindex="0" role="button">
      </div>
    </article>`;
  });

  const parseHtml = (parseOn && hasParse) ? renderParseBlock(n) : '';

  return `<div class="gram-wrap ex-lesson">
    <div class="ex-lesson-top">
      <a href="#/oefeningen" class="ex-back" data-act="open-ex-hub">← Oefeningen</a>
      <h1 class="gram-lesson-title">Les ${n}</h1>
    </div>

    <div class="ex-toolbar">
      <label class="ex-toggle">
        <input type="checkbox" id="ex-done-cb" data-l="${n}" ${isDone ? 'checked' : ''}>
        <span>Afgerond</span>
      </label>
      ${hasParse ? `<label class="ex-toggle ex-toggle-parse">
        <input type="checkbox" id="ex-parse-toggle" ${parseOn ? 'checked' : ''}>
        <span>Zinsontleding</span>
      </label>` : ''}
    </div>

    ${parseHtml}

    <div class="ex-blocks">${body}</div>

    <nav class="ex-nav">
      ${prev ? `<a href="#/oefeningen/${prev}" class="btn btn-secondary btn-sm" data-act="open-ex" data-l="${prev}">← Les ${prev}</a>` : '<span></span>'}
      ${next ? `<a href="#/oefeningen/${next}" class="btn btn-secondary btn-sm" data-act="open-ex" data-l="${next}">Les ${next} →</a>` : '<span></span>'}
    </nav>
  </div>`;
}

function renderExHub(){
  if (!location.hash.startsWith('#/oefeningen')) {
    try { history.replaceState(null, '', '#/oefeningen'); } catch(e){}
  }
  return renderOverview();
}

function renderExLesson(){
  const n = (window.state && window.state.exLesson != null) ? Number(window.state.exLesson) : 1;
  const h = '#/oefeningen/' + n;
  if (location.hash !== h) {
    try { history.replaceState(null, '', h); } catch(e){}
  }
  return renderLesson(n);
}

let hashInitAttempts = 0;
function handleHash(){
  const m = (location.hash || '').match(/^#\\/oefeningen(?:\\/(\\d+))?$/);
  if (!m) { hashInitAttempts = 0; return; }
  // The app shell is loaded asynchronously; DOMContentLoaded can fire before state exists.
  if (!window.state) {
    if (hashInitAttempts < 30) {
      hashInitAttempts += 1;
      setTimeout(handleHash, 100);
    }
    return;
  }
  hashInitAttempts = 0;
  if (m[1]) {
    const n = parseInt(m[1], 10);
    if (n >= 1 && n <= 23) {
      window.state.path = 'exercises';
      window.state.view = 'ex-lesson';
      window.state.exLesson = n;
    } else {
      window.state.path = 'exercises';
      window.state.view = 'ex';
      window.state.exLesson = null;
    }
  } else {
    window.state.path = 'exercises';
    window.state.view = 'ex';
    window.state.exLesson = null;
  }
  if (typeof window.render === 'function') window.render();
}

window.renderExercises = renderExHub;
window.renderExerciseLesson = renderExLesson;
window.EX2 = { L: EX, lessonDone: n => !!done[n] };

window.addEventListener('hashchange', handleHash);
window.addEventListener('DOMContentLoaded', handleHash);

document.addEventListener('click', e => {
  const t = e.target;

  if (t && t.id === 'ex-done-cb') {
    const n = parseInt(t.dataset.l, 10);
    done[n] = t.checked;
    saveDone();
    if (typeof renderSidebar === 'function') {
      const host = document.getElementById('sidebar-host');
      if (host) host.innerHTML = renderSidebar();
    }
  }

  if (t && t.id === 'ex-parse-toggle') {
    parseOn = !!t.checked;
    saveParse();
    if (window.render) window.render();
    setTimeout(bindParseUI, 40);
  }

  const zoom = t && t.closest && t.closest('[data-act="ex-zoom"]');
  if (zoom) {
    e.preventDefault();
    openExLightbox(zoom.src, zoom.alt);
    return;
  }

  const open = t && t.closest && t.closest('[data-act="open-ex"]');
  if (open) {
    const n = parseInt(open.getAttribute('data-l'), 10);
    if (!isNaN(n) && window.state) {
      window.state.path = 'exercises';
      window.state.view = 'ex-lesson';
      window.state.exLesson = n;
      if (window.sbMenuState) window.sbMenuState.ex = true;
      try { history.pushState(null, '', '#/oefeningen/' + n); } catch(e){}
      if (window.render) window.render();
      if (window.__scrollPageTop) window.__scrollPageTop();
      else window.scrollTo(0, 0);
      setTimeout(bindParseUI, 40);
      e.preventDefault();
    }
  }

  const hub = t && t.closest && t.closest('[data-act="open-ex-hub"]');
  if (hub && window.state) {
    window.state.path = 'exercises';
    window.state.view = 'ex';
    window.state.exLesson = null;
    if (window.sbMenuState) window.sbMenuState.ex = true;
    try { history.pushState(null, '', '#/oefeningen'); } catch(e){}
    if (window.render) window.render();
    if (window.__scrollPageTop) window.__scrollPageTop();
    else window.scrollTo(0, 0);
    e.preventDefault();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const lb = document.getElementById('ex-lightbox');
    if (lb && lb.classList.contains('open')) lb.classList.remove('open');
  }
});

/* Polished styles for oefeningen + parse */
const parseStyle = document.createElement('style');
parseStyle.textContent = `
/* ---- Oefeningen overview ---- */
.ex-count{font-size:12px;color:var(--muted);font-weight:500;margin-inline-end:6px}
.gram-list-status{display:flex;align-items:center;gap:4px}

/* ---- Lesson shell ---- */
.ex-lesson{max-width:720px}
.ex-lesson-top{margin-bottom:6px}
.ex-back{
  display:inline-block;font-size:13px;font-weight:600;color:var(--muted);
  text-decoration:none;margin-bottom:4px;transition:color .15s;
}
.ex-back:hover{color:var(--forest)}
.ex-toolbar{
  display:flex;flex-wrap:wrap;gap:14px 20px;align-items:center;
  margin:10px 0 18px;padding:10px 14px;
  background:var(--paper-deep,rgba(0,0,0,.03));
  border:1px solid var(--line);border-radius:10px;
}
.ex-toggle{
  display:inline-flex;align-items:center;gap:8px;
  font-size:13.5px;font-weight:600;color:var(--ink);cursor:pointer;user-select:none;
}
.ex-toggle input{width:16px;height:16px;accent-color:var(--forest);cursor:pointer}
.ex-toggle-parse{margin-inline-start:auto}

/* ---- Exercise blocks ---- */
.ex-blocks{display:flex;flex-direction:column;gap:14px}
.ex-block{
  background:var(--surface);border:1px solid var(--line);
  border-radius:12px;overflow:hidden;
}
.ex-block-head{
  display:flex;align-items:center;gap:10px;
  padding:10px 14px;border-bottom:1px solid var(--line);
  background:var(--paper-deep,rgba(0,0,0,.02));
}
.ex-num{
  width:24px;height:24px;border-radius:7px;
  background:var(--forest-soft,rgba(30,74,56,.12));
  color:var(--forest);font-size:12px;font-weight:700;
  display:grid;place-items:center;flex-shrink:0;
}
.ex-block-title{margin:0;font-size:14.5px;font-weight:650;color:var(--ink)}
.ex-img-wrap{padding:10px;background:var(--paper,#faf8f4)}
.ex-img{
  display:block;width:100%;height:auto;border-radius:8px;
  cursor:zoom-in;border:1px solid var(--line);
  transition:box-shadow .15s;
}
.ex-img:hover{box-shadow:0 4px 16px -4px rgba(0,0,0,.12)}

/* ---- Nav ---- */
.ex-nav{
  display:flex;justify-content:space-between;align-items:center;
  gap:10px;margin-top:22px;padding-top:16px;border-top:1px solid var(--line);
}

/* ---- Parse section ---- */
.parse-section{
  margin:0 0 20px;padding:16px 16px 14px;
  background:var(--surface);border:1px solid var(--line);
  border-radius:12px;
}
.parse-head{margin-bottom:12px}
.parse-title{margin:0 0 2px;font-size:16px;font-weight:700;color:var(--ink)}
.parse-hint{margin:0;font-size:12.5px;color:var(--muted);line-height:1.4}

.parse-palette{
  display:flex;flex-wrap:wrap;gap:7px;margin-bottom:16px;
  padding-bottom:14px;border-bottom:1px solid var(--line);
}
.parse-chip{
  display:inline-flex;flex-direction:column;align-items:center;gap:1px;
  padding:6px 11px 5px;border-radius:10px;
  background:color-mix(in srgb, var(--role) 12%, transparent);
  border:1.5px solid color-mix(in srgb, var(--role) 55%, transparent);
  color:var(--role);cursor:grab;user-select:none;
  font-family:inherit;transition:transform .12s,box-shadow .12s;
}
.parse-chip:hover{transform:translateY(-1px)}
.parse-chip.selected,.parse-chip.dragging{
  box-shadow:0 0 0 3px color-mix(in srgb, var(--role) 25%, transparent);
  transform:scale(1.04);
}
.parse-chip-ar{font-size:15px;font-weight:700;line-height:1.2;font-family:var(--ar),serif}
.parse-chip-nl{font-size:10.5px;font-weight:600;opacity:.85;letter-spacing:.01em}

.parse-sentences{display:flex;flex-direction:column;gap:12px}
.parse-sentence{
  padding:12px 12px 10px;border-radius:10px;
  background:var(--paper-deep,rgba(0,0,0,.03));
  border:1px solid transparent;
}
.parse-words{
  display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px;
  line-height:1.5;direction:rtl;
}
.parse-word{
  display:inline-flex;flex-direction:column;align-items:center;
  padding:7px 11px 5px;border-radius:8px;
  font-size:19px;font-weight:600;line-height:1.35;
  cursor:pointer;border:1.5px solid transparent;
  background:var(--surface);transition:background .12s,border-color .12s,box-shadow .12s;
  font-family:var(--ar),serif;min-width:2.2em;
}
.parse-word.drag-over{
  border-color:var(--gold,#c9a227);
  background:color-mix(in srgb, var(--gold,#c9a227) 14%, transparent);
}
.parse-word.has-role{
  background:color-mix(in srgb, var(--role) 14%, transparent);
  border-bottom:3px solid var(--role);
}
.parse-word.is-correct{box-shadow:inset 0 0 0 2px #16a34a}
.parse-word.is-wrong{box-shadow:inset 0 0 0 2px #dc2626}
.parse-word .role-badge{
  display:block;font-size:10px;font-weight:700;margin-top:2px;
  font-family:var(--ar),serif;line-height:1.1;opacity:.95;
}

.parse-feedback{
  margin-top:8px;font-size:13px;font-weight:600;
}
.parse-feedback.ok{color:#16a34a}
.parse-feedback.bad{color:#dc2626}
.parse-feedback.muted{color:var(--muted);font-weight:500}

.parse-actions{
  display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;
  padding-top:12px;border-top:1px solid var(--line);
}

/* Ghost button fallback */
.btn-ghost{
  background:transparent;border:1px solid var(--line);color:var(--muted);
  border-radius:8px;padding:6px 12px;font-size:13px;font-weight:600;
  cursor:pointer;font-family:inherit;
}
.btn-ghost:hover{border-color:var(--ink);color:var(--ink)}

@media (max-width:520px){
  .ex-toggle-parse{margin-inline-start:0}
  .parse-word{font-size:17px;padding:6px 9px 4px}
  .parse-chip-ar{font-size:14px}
}
`;
document.head.appendChild(parseStyle);

setTimeout(() => {
  handleHash();
  setTimeout(bindParseUI, 50);
}, 60);
})();
