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
if(!P||typeof P!=='object') P = {lessons:{}, mistakes:[], unlockAll:false, autoAdvance:true, sfx:true, inlineIrab:false};
if(!P.lessons) P.lessons={};
if(!Array.isArray(P.mistakes)) P.mistakes=[];
if(P.autoAdvance===undefined) P.autoAdvance=true;
if(P.sfx===undefined) P.sfx=true;
if(P.inlineIrab===undefined) P.inlineIrab=false;
function save(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(P)); }catch(e){} }
function lp(n){ if(!P.lessons[n]) P.lessons[n]={steps:{},vocab:false,book:null,test:null,review:false}; return P.lessons[n]; }

/* ---------- helpers ---------- */
const E = s => (typeof esc==='function'?esc(s):String(s??''));
const AR_RE = /[\u0600-\u06FF]/;
function isAr(s){ s=String(s||''); return AR_RE.test(s) && !/[a-zA-Z]{2,}/.test(s); }
function isSpeakable(s){
  if(!s) return false;
  const str=String(s).trim();
  const arabicLetters=str.match(/[\u0621-\u063A\u0641-\u064A\u0671-\u06D3]/g);
  return !!arabicLetters && arabicLetters.length>=1;
}
function arHtml(s){ return (typeof markAr==='function') ? markAr(String(s),'plain') : E(s); }
function mix(s){ return (typeof glMix==='function') ? glMix(String(s||'')) : E(s); }
function shuf(a){ return (typeof shuffle==='function') ? shuffle(a) : a.slice().sort(()=>Math.random()-.5); }
function spk(text, label){
  if(!isSpeakable(text)) return '';
  return `<button type="button" class="g2-spk" data-act="speak-text" data-text="${E(text)}" title="Beluister" aria-label="Beluister">${label||ICO.spk}</button>`;
}

/* ---------- Geluidseffecten (Web Audio API) ---------- */
let _g2AudioCtx = null;
function playSfx(ok) {
  if (!ok || P.sfx === false) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!_g2AudioCtx) _g2AudioCtx = new AudioCtx();
    if (_g2AudioCtx.state === 'suspended') _g2AudioCtx.resume();
    const ctx = _g2AudioCtx;
    const now = ctx.currentTime;

    // Aangenaam belletje bij juist antwoord: D5 (587Hz) -> D6 (1174Hz)
    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = 'sine';
    o1.frequency.setValueAtTime(587.33, now);
    o1.frequency.exponentialRampToValueAtTime(880, now + 0.1);
    g1.gain.setValueAtTime(0.14, now);
    g1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    o1.connect(g1);
    g1.connect(ctx.destination);
    o1.start(now);
    o1.stop(now + 0.28);

    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = 'sine';
    o2.frequency.setValueAtTime(880, now + 0.08);
    o2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.2);
    g2.gain.setValueAtTime(0.001, now);
    g2.gain.setValueAtTime(0.18, now + 0.08);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    o2.connect(g2);
    g2.connect(ctx.destination);
    o2.start(now + 0.08);
    o2.stop(now + 0.45);
  } catch (e) {}
}
window.sfx = playSfx;
const ICO = {
  spk:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>',
  lock:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  check:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>',
  book:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z"/><path d="M6.5 17A2.5 2.5 0 0 0 4 19.5 2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>'
};

function shortTitle(t){
  const OV={"Examenstof Deel 2":"Examen: Aanwijzende voornaamwoorden","Overzichtstabel van de vier":"Overzicht aanwijzers","De tegengestelde geslachtsregel":"Geslachtsregel bij getallen","Getallen 3 t/m 10 bij vrouwelijke":"Getallen bij vrouwelijke woorden","Wat optreedt als vervanger":"Vervangers van het bijwoord","Aanwijzende voornaamwoorden in het tweevoud":"Aanwijzers in het tweevoud","Voortzetting van les 16":"Meervoud van حِمَارٌ","Nieuw patroon van het gebroken":"Nieuw gebroken meervoud","Voorzetsels فِي (in) en عَلَى":"Voorzetsels فِي en عَلَى","Aanwijzend voornaamwoord ver meervoud":"Aanwijzer ver, meervoud"};
  for(const k in OV){ if(String(t||'').startsWith(k)) return OV[k]; }
  let s=String(t||'').trim(), pre='';
  const m=s.match(/^Examenstof Deel \d+:\s*/); if(m){ pre='Examen: '; s=s.slice(m[0].length); }
  s=s.replace(/\s*\((?:Les \d+[abc])\)/gi,'').replace(/\s*·\s*Les \d+[abc]\s*$/i,'');
  const cutAt=(str,seps)=>{ for(const sp of seps){ const i=str.indexOf(sp); if(i>8) return str.slice(0,i); } return str; };
  s=cutAt(s,[' · ',' — ',': ']);
  if(s.length>34) s=s.replace(/\s*\([^)]*\)/g,'');
  if(s.length>34) s=cutAt(s,[' en ',' & ',', ',' tegenover ',' vs. ']);
  return (pre+s).trim();
}

/* ---------- lesstructuur ---------- */
// nodes: review? · step 0..k · vocab · book · test

/* ---------- Interactieve MVP Zinsontleder (Iʿrāb Coach & Studio) ---------- */
const IRAB_ROLES = [
  { id: 'mubtada', ar: 'مُبْتَدَأ', nl: 'Moebtada (Onderwerp)' },
  { id: 'mubtada_mudaf', ar: 'مُبْتَدَأ (مُضَاف)', nl: 'Moebtada & Moedaf' },
  { id: 'khabar', ar: 'خَبَر', nl: 'Gabr / Khabar (Gezegde)' },
  { id: 'harf_jarr', ar: 'حَرْف جَرّ', nl: 'Harf Djarr (Voorzetsel)' },
  { id: 'ism_majroor', ar: 'اِسْم مَجْرُور', nl: 'Ism Madjroer (Na voorz.)' },
  { id: 'mudaf_ilayhi', ar: 'مُضَاف إِلَيْهِ', nl: 'Moedaf Ilayh (Bezitter)' },
  { id: 'naat', ar: 'نَعْت', nl: 'Naʿt (Bijv. nw.)' },
  { id: 'badal', ar: 'بَدَل', nl: 'Badal (Bepaling na هَذَا/ذَلِكَ)' }
];

const IRAB_STATUSES = [
  { id: 'marfoo', ar: 'مَرْفُوع', nl: 'Nominatief (u/un)' },
  { id: 'majroor', ar: 'مَجْرُور', nl: 'Genitief (i/in/a)' },
  { id: 'mabnee', ar: 'مَبْنِيّ', nl: 'Onveranderlijk' }
];

const IRAB_MARKS = [
  { id: 'dammah', ar: 'ضَمَّة (ـُ)', nl: 'Enkele dammah' },
  { id: 'tanween_damm', ar: 'تَنْوِين ضَمّ (ـٌ)', nl: 'Tanwīn dammah' },
  { id: 'kasrah', ar: 'كَسْرَة (ـِ)', nl: 'Enkele kasrah' },
  { id: 'tanween_kasr', ar: 'تَنْوِين كَسْر (ـٍ)', nl: 'Tanwīn kasrah' },
  { id: 'fathah', ar: 'فَتْحَة (ـَ)', nl: 'Fathah (diptoot)' },
  { id: 'none', ar: '—', nl: 'Geen / onveranderlijk' }
];

const ALL_IRAB_SENTENCES = [
  {
    id: 'off_1',
    category: 'official',
    categoryTitle: 'Officieel Examen · Vraag 7.1',
    sentence: 'الْإِمَامُ فِي الْمَسْجِدِ',
    nl: 'De imam is in de moskee.',
    ruleSummary: 'Nominale zin (الْجُمْلَةُ الِاسْمِيَّةُ) met een voorzetselgroep (شِبْهُ جُمْلَةٍ) als gezegde.',
    words: [
      { ar: 'الْإِمَامُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الْإِمَامُ» is het onderwerp (مُبْتَدَأ) van de nominale zin: nominatief (مَرْفُوع met één ضَمَّة).' },
      { ar: 'فِي', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«فِي» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'الْمَسْجِدِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«الْمَسْجِدِ» volgt na een voorzetsel (اِسْم مَجْرُور): genitief (مَجْرُور met كَسْرَة). Samen vormt «فِي الْمَسْجِدِ» de Gabr (شِبْه جُمْلَة).' }
    ]
  },
  {
    id: 'off_2',
    category: 'official',
    categoryTitle: 'Officieel Examen · Vraag 7.2',
    sentence: 'حَقِيبَةُ الطَّالِبِ عَلَى السَّرِيرِ',
    nl: 'De tas van de student ligt op het bed.',
    ruleSummary: 'Bezitsconstructie (الْإِضَافَةُ · Les 5) als onderwerp, gevolgd door een voorzetselgroep (Les 4).',
    words: [
      { ar: 'حَقِيبَةُ', role: 'mubtada_mudaf', status: 'marfoo', mark: 'dammah', explain: '«حَقِيبَةُ» is het onderwerp (مُبْتَدَأ) én bezit (مُضَاف): nominatief (مَرْفُوع met één ضَمَّة, geen tanwīn en geen الْ).' },
      { ar: 'الطَّالِبِ', role: 'mudaf_ilayhi', status: 'majroor', mark: 'kasrah', explain: '«الطَّالِبِ» is de bezitter (مُضَاف إِلَيْهِ): altijd genitief (مَجْرُور met كَسْرَة).' },
      { ar: 'عَلَى', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«عَلَى» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'السَّرِيرِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«السَّرِيرِ» is een zelfstandig naamwoord na een voorzetsel (اِسْم مَجْرُور): genitief (مَجْرُور met كَسْرَة).' }
    ]
  },
  {
    id: 'off_3',
    category: 'official',
    categoryTitle: 'Officieel Examen · Vraag 7.3',
    sentence: 'قَمِيصُ الْوَلَدِ الصَّغِيرِ فِي الْغُرْفَةِ',
    nl: 'Het hemd van de kleine jongen is in de kamer.',
    ruleSummary: 'Combinatie van Idāfah (مُضَاف + مُضَاف إِلَيْهِ) met een bijvoeglijk naamwoord (نَعْت · Les 9) bij de bezitter.',
    words: [
      { ar: 'قَمِيصُ', role: 'mubtada_mudaf', status: 'marfoo', mark: 'dammah', explain: '«قَمِيصُ» is مُبْتَدَأ وَهُوَ مُضَاف: nominatief (مَرْفُوع met één ضَمَّة).' },
      { ar: 'الْوَلَدِ', role: 'mudaf_ilayhi', status: 'majroor', mark: 'kasrah', explain: '«الْوَلَدِ» is de bezitter (مُضَاف إِلَيْهِ): altijd genitief (مَجْرُور met كَسْرَة).' },
      { ar: 'الصَّغِيرِ', role: 'naat', status: 'majroor', mark: 'kasrah', explain: '«الصَّغِيرِ» is het bijvoeglijk naamwoord (نَعْت) bij الْوَلَدِ: volgt in de genitief (مَجْرُور met كَسْرَة).' },
      { ar: 'فِي', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«فِي» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'الْغُرْفَةِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«الْغُرْفَةِ» is een اِسْم مَجْرُور na فِي: genitief (مَجْرُور met كَسْرَة).' }
    ]
  },
  {
    id: 'off_4',
    category: 'official',
    categoryTitle: 'Officieel Examen · Vraag 7.4',
    sentence: 'الْفَلَّاحُ الْغَنِيُّ مِنَ السُّوقِ',
    nl: 'De rijke boer komt van de markt.',
    ruleSummary: 'Onderwerp (مُبْتَدَأ) met bijvoeglijk naamwoord (نَعْت) in de nominatief, gevolgd door voorzetsel + Ism Majrūr.',
    words: [
      { ar: 'الْفَلَّاحُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الْفَلَّاحُ» is het onderwerp (مُبْتَدَأ): nominatief (مَرْفُوع met ضَمَّة).' },
      { ar: 'الْغَنِيُّ', role: 'naat', status: 'marfoo', mark: 'dammah', explain: '«الْغَنِيُّ» is een bijvoeglijk naamwoord (نَعْت) bij الْفَلَّاحُ: volgt in de nominatief (مَرْفُوع met ضَمَّة).' },
      { ar: 'مِنَ', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«مِنَ» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'السُّوقِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«السُّوقِ» is een zelfstandig naamwoord na een voorzetsel (اِسْم مَجْرُور): genitief (مَجْرُور met كَسْرَة).' }
    ]
  },
  {
    id: 'prac_1',
    category: 'practice',
    categoryTitle: 'Oefenexamen · Vraag 7.1',
    sentence: 'كِتَابُ الطَّالِبِ جَدِيدٌ',
    nl: 'Het boek van de student is nieuw.',
    ruleSummary: 'Bezitsconstructie (مُضَاف + مُضَاف إِلَيْهِ) als onderwerp met een onbepaald gezegde (خَبَر).',
    words: [
      { ar: 'كِتَابُ', role: 'mubtada_mudaf', status: 'marfoo', mark: 'dammah', explain: '«كِتَابُ» is het onderwerp (مُبْتَدَأ) én bezit (مُضَاف): nominatief (مَرْفُوع met één ضَمَّة, geen tanwīn).' },
      { ar: 'الطَّالِبِ', role: 'mudaf_ilayhi', status: 'majroor', mark: 'kasrah', explain: '«الطَّالِبِ» is de bezitter (مُضَاف إِلَيْهِ): genitief (مَجْرُور met كَسْرَة).' },
      { ar: 'جَدِيدٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«جَدِيدٌ» is het onbepaalde gezegde (خَبَر): nominatief (مَرْفُوع met تَنْوِين ضَمّ).' }
    ]
  },
  {
    id: 'prac_2',
    category: 'practice',
    categoryTitle: 'Oefenexamen · Vraag 7.2',
    sentence: 'قَلَمُ الْأُسْتَاذِ عَلَى الطَّاوِلَةِ',
    nl: 'De pen van de leraar ligt op de tafel.',
    ruleSummary: 'Bezitsconstructie (الْإِضَافَةُ) gevolgd door voorzetsel عَلَى + Ism Majrūr.',
    words: [
      { ar: 'قَلَمُ', role: 'mubtada_mudaf', status: 'marfoo', mark: 'dammah', explain: '«قَلَمُ» is مُبْتَدَأ وَهُوَ مُضَاف: nominatief (مَرْفُوع met één ضَمَّة).' },
      { ar: 'الْأُسْتَاذِ', role: 'mudaf_ilayhi', status: 'majroor', mark: 'kasrah', explain: '«الْأُسْتَاذِ» is de bezitter (مُضَاف إِلَيْهِ): genitief (مَجْرُور met كَسْرَة).' },
      { ar: 'عَلَى', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«عَلَى» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'الطَّاوِلَةِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«الطَّاوِلَةِ» is een اِسْم مَجْرُور na عَلَى: genitief (مَجْرُور met كَسْرَة).' }
    ]
  },
  {
    id: 'prac_3',
    category: 'practice',
    categoryTitle: 'Oefenexamen · Vraag 7.3',
    sentence: 'كِتَابُ الطَّالِبِ الْجَدِيدِ عَلَى الْمَكْتَبِ',
    nl: 'Het boek van de nieuwe student ligt op het bureau.',
    ruleSummary: 'Idāfah met een bijvoeglijk naamwoord (نَعْت) dat met الطَّالِبِ meebuigt in de genitief (-i).',
    words: [
      { ar: 'كِتَابُ', role: 'mubtada_mudaf', status: 'marfoo', mark: 'dammah', explain: '«كِتَابُ» is مُبْتَدَأ وَهُوَ مُضَاف: nominatief (مَرْفُوع met één ضَمَّة).' },
      { ar: 'الطَّالِبِ', role: 'mudaf_ilayhi', status: 'majroor', mark: 'kasrah', explain: '«الطَّالِبِ» is de bezitter (مُضَاف إِلَيْهِ): genitief (مَجْرُور met كَسْرَة).' },
      { ar: 'الْجَدِيدِ', role: 'naat', status: 'majroor', mark: 'kasrah', explain: '«الْجَدِيدِ» is een bijvoeglijk naamwoord (نَعْت) bij الطَّالِبِ (de nieuwe student): genitief (مَجْرُور met كَسْرَة).' },
      { ar: 'عَلَى', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«عَلَى» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'الْمَكْتَبِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«الْمَكْتَبِ» is een اِسْم مَجْرُور na عَلَى: genitief (مَجْرُور met كَسْرَة).' }
    ]
  },
  {
    id: 'prac_4',
    category: 'practice',
    categoryTitle: 'Oefenexamen · Vraag 7.4',
    sentence: 'الطَّالِبُ مُجْتَهِدٌ',
    nl: 'De student is ijverig.',
    ruleSummary: 'Basis nominale zin (Les 3): bepaald onderwerp (مُبْتَدَأ) + onbepaald gezegde (خَبَر).',
    words: [
      { ar: 'الطَّالِبُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الطَّالِبُ» is het bepaalde onderwerp (مُبْتَدَأ): nominatief (مَرْفُوع met één ضَمَّة).' },
      { ar: 'مُجْتَهِدٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«مُجْتَهِدٌ» is het onbepaalde gezegde (خَبَر): nominatief (مَرْفُوع met تَنْوِين ضَمّ).' }
    ]
  },
  {
    id: 'med_1',
    category: 'medina',
    categoryTitle: 'Medina Les 1 · Aanwijzer هَذَا',
    sentence: 'هَذَا كِتَابٌ',
    nl: 'Dit is een boek.',
    ruleSummary: 'Les 1: «هَذَا» (dit) is een aanwijzend voornaamwoord (اِسْمُ إِشَارَةٍ) dat fungeert als Moebtada, gevolgd door een onbepaalde Gabr.',
    words: [
      { ar: 'هَذَا', role: 'mubtada', status: 'mabnee', mark: 'none', explain: '«هَذَا» is een aanwijzend voornaamwoord dat fungeert als het onderwerp (مُبْتَدَأ). Aanwijzers zijn onveranderlijk (مَبْنِيّ).' },
      { ar: 'كِتَابٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«كِتَابٌ» is het onbepaalde gezegde (خَبَر): nominatief (مَرْفُوع met تَنْوِين ضَمّ).' }
    ]
  },
  {
    id: 'med_2',
    category: 'medina',
    categoryTitle: 'Medina Les 1 · Nominale Zin',
    sentence: 'هَذَا مَسْجِدٌ',
    nl: 'Dit is een moskee.',
    ruleSummary: 'Les 1: Aanwijzend voornaamwoord هَذَا (Moebtada) + onbepaald naamwoord met tanwīn dammah (Gabr).',
    words: [
      { ar: 'هَذَا', role: 'mubtada', status: 'mabnee', mark: 'none', explain: '«هَذَا» is het onderwerp (مُبْتَدَأ): een onveranderlijk aanwijzend voornaamwoord (مَبْنِيّ).' },
      { ar: 'مَسْجِدٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«مَسْجِدٌ» is het gezegde (خَبَر): onbepaald en nominatief (مَرْفُوع met تَنْوِين ضَمّ).' }
    ]
  },
  {
    id: 'med_3',
    category: 'medina',
    categoryTitle: 'Medina Les 2 · Aanwijzer ذَلِكَ',
    sentence: 'ذَلِكَ نَجْمٌ',
    nl: 'Dat is een ster.',
    ruleSummary: 'Les 2: «ذَلِكَ» (dat, voor veraf mannelijk) is de Moebtada; «نَجْمٌ» is de Gabr met tanwīn dammah (-un).',
    words: [
      { ar: 'ذَلِكَ', role: 'mubtada', status: 'mabnee', mark: 'none', explain: '«ذَلِكَ» is een aanwijzend voornaamwoord voor veraf en fungeert als onderwerp (مُبْتَدَأ, مَبْنِيّ).' },
      { ar: 'نَجْمٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«نَجْمٌ» is het gezegde (خَبَر): nominatief (مَرْفُوع met تَنْوِين ضَمّ).' }
    ]
  },
  {
    id: 'med_4',
    category: 'medina',
    categoryTitle: 'Medina Les 3 · Lidwoord الْ',
    sentence: 'الْبَيْتُ مَفْتُوحٌ',
    nl: 'Het huis is open.',
    ruleSummary: 'Les 3: Een woord met الْ krijgt géén tanwīn (slechts één dammah -u) en vormt de Moebtada; het onbepaalde woord (-un) is de Gabr.',
    words: [
      { ar: 'الْبَيْتُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الْبَيْتُ» is het bepaalde onderwerp (مُبْتَدَأ): nominatief (مَرْفُوع met één ضَمَّة vanwege الْ).' },
      { ar: 'مَفْتُوحٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«مَفْتُوحٌ» is het onbepaalde gezegde (خَبَر): nominatief (مَرْفُوع met تَنْوِين ضَمّ).' }
    ]
  },
  {
    id: 'med_5',
    category: 'medina',
    categoryTitle: 'Medina Les 3 · Maan- en Zonneletters',
    sentence: 'التَّاجِرُ غَنِيٌّ',
    nl: 'De handelaar is rijk.',
    ruleSummary: 'Les 3: De ت is een zonneletter (حَرْف شَمْسِيّ). «التَّاجِرُ» is bepaald (Moebtada, -u) en «غَنِيٌّ» is onbepaald (Gabr, -un).',
    words: [
      { ar: 'التَّاجِرُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«التَّاجِرُ» is het onderwerp (مُبْتَدَأ): nominatief (مَرْفُوع met één ضَمَّة).' },
      { ar: 'غَنِيٌّ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«غَنِيٌّ» is het gezegde (خَبَر): nominatief (مَرْفُوع met تَنْوِين ضَمّ).' }
    ]
  },
  {
    id: 'med_6',
    category: 'medina',
    categoryTitle: 'Medina Les 3 · Nominale Zin',
    sentence: 'الْمَاءُ بَارِدٌ',
    nl: 'Het water is koud.',
    ruleSummary: 'Les 3: Klassieke nominale zin: Moebtada met الْ (-u) + Gabr zonder الْ (-un).',
    words: [
      { ar: 'الْمَاءُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الْمَاءُ» is het bepaalde onderwerp (مُبْتَدَأ): nominatief (مَرْفُوع met één ضَمَّة).' },
      { ar: 'بَارِدٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«بَارِدٌ» is het onbepaalde gezegde (خَبَر): nominatief (مَرْفُوع met تَنْوِين ضَمّ).' }
    ]
  },
  {
    id: 'med_7',
    category: 'medina',
    categoryTitle: 'Medina Les 4 · Voorzetsel فِي',
    sentence: 'الطَّالِبُ فِي الْفَصْلِ',
    nl: 'De student is in het klaslokaal.',
    ruleSummary: 'Les 4: Na een voorzetsel (حَرْفُ جَرٍّ zoals فِي) staat het zelfstandig naamwoord altijd in de genitief (مَجْرُور met kasrah -i).',
    words: [
      { ar: 'الطَّالِبُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الطَّالِبُ» is het onderwerp (مُبْتَدَأ): nominatief (مَرْفُوع met ضَمَّة).' },
      { ar: 'فِي', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«فِي» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'الْفَصْلِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«الْفَصْلِ» is een اِسْم مَجْرُور na فِي: genitief (مَجْرُور met كَسْرَة).' }
    ]
  },
  {
    id: 'med_8',
    category: 'medina',
    categoryTitle: 'Medina Les 4 · Voorzetsel عَلَى',
    sentence: 'السَّاعَةُ عَلَى السَّرِيرِ',
    nl: 'Het horloge ligt op het bed.',
    ruleSummary: 'Les 4: Vrouwelijk onderwerp (السَّاعَةُ) in Marfūʿ (-u) gevolgd door عَلَى + Ism Majrūr (-i).',
    words: [
      { ar: 'السَّاعَةُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«السَّاعَةُ» is het onderwerp (مُبْتَدَأ): nominatief (مَرْفُوع met ضَمَّة).' },
      { ar: 'عَلَى', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«عَلَى» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'السَّرِيرِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«السَّرِيرِ» volgt op عَلَى (اِسْم مَجْرُور): genitief (مَجْرُور met كَسْرَة).' }
    ]
  },
  {
    id: 'med_9',
    category: 'medina',
    categoryTitle: 'Medina Les 4 · Diptoot Plaatsnaam',
    sentence: 'الرَّسُولُ مِنْ مَكَّةَ',
    nl: 'De Boodschapper komt uit Mekka.',
    ruleSummary: 'Les 4 & 22: Plaatsnaam مَكَّةَ is een diptoot (مَمْنُوعٌ مِنَ الصَّرْفِ) en krijgt na مِنْ een fathah (-a) i.p.v. een kasrah!',
    words: [
      { ar: 'الرَّسُولُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الرَّسُولُ» is het onderwerp (مُبْتَدَأ): nominatief (مَرْفُوع met ضَمَّة).' },
      { ar: 'مِنْ', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«مِنْ» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'مَكَّةَ', role: 'ism_majroor', status: 'majroor', mark: 'fathah', explain: '«مَكَّةَ» is een diptoot (مَمْنُوع مِنَ الصَّرْف) en krijgt in de genitief een fatha (ـَ) in plaats van een kasrah!' }
    ]
  },
  {
    id: 'med_10',
    category: 'medina',
    categoryTitle: 'Medina Les 5 · Idāfah (Bezit)',
    sentence: 'بَابُ الْمَسْجِدِ مَفْتُوحٌ',
    nl: 'De deur van de moskee is open.',
    ruleSummary: 'Les 5: De Moedaf («بَابُ») heeft géén الْ en géén tanwīn; de Moedaf Ilayh («الْمَسْجِدِ») staat in Majrūr (-i); «مَفْتُوحٌ» is de Gabr (-un).',
    words: [
      { ar: 'بَابُ', role: 'mubtada_mudaf', status: 'marfoo', mark: 'dammah', explain: '«بَابُ» is het onderwerp (مُبْتَدَأ) én het bezit (مُضَاف): nominatief met één ضَمَّة (geen tanwīn).' },
      { ar: 'الْمَسْجِدِ', role: 'mudaf_ilayhi', status: 'majroor', mark: 'kasrah', explain: '«الْمَسْجِدِ» is de bezitter (مُضَاف إِلَيْهِ): altijd genitief (مَجْرُور met كَسْرَة).' },
      { ar: 'مَفْتُوحٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«مَفْتُوحٌ» is het gezegde (خَبَر) bij بَابُ: nominatief (مَرْفُوع met تَنْوِين ضَمّ).' }
    ]
  },
  {
    id: 'med_11',
    category: 'medina',
    categoryTitle: 'Medina Les 5 · Idāfah met Eigennaam',
    sentence: 'بَيْتُ حَامِدٍ قَرِيبٌ',
    nl: 'Het huis van Hāmid is dichtbij.',
    ruleSummary: 'Les 5: Mannelijke eigennaam «حَامِدٍ» als Moedaf Ilayh krijgt tanwīn kasrah (-in).',
    words: [
      { ar: 'بَيْتُ', role: 'mubtada_mudaf', status: 'marfoo', mark: 'dammah', explain: '«بَيْتُ» is مُبْتَدَأ وَهُوَ مُضَاف: nominatief met één ضَمَّة.' },
      { ar: 'حَامِدٍ', role: 'mudaf_ilayhi', status: 'majroor', mark: 'tanween_kasr', explain: '«حَامِدٍ» is de bezitter (مُضَاف إِلَيْهِ): genitief (مَجْرُور met تَنْوِين كَسْر).' },
      { ar: 'قَرِيبٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«قَرِيبٌ» is het gezegde (خَبَر): nominatief (مَرْفُوع met تَنْوِين ضَمّ).' }
    ]
  },
  {
    id: 'med_12',
    category: 'medina',
    categoryTitle: 'Medina Les 5 · Idāfah + Voorzetsel',
    sentence: 'مِفْتَاحُ السَّيَّارَةِ عَلَى الْمَكْتَبِ',
    nl: 'De sleutel van de auto ligt op het bureau.',
    ruleSummary: 'Les 5: «مِفْتَاحُ السَّيَّارَةِ» is een Idāfah-constructie als onderwerp, gevolgd door voorzetsel عَلَى + Ism Majrūr.',
    words: [
      { ar: 'مِفْتَاحُ', role: 'mubtada_mudaf', status: 'marfoo', mark: 'dammah', explain: '«مِفْتَاحُ» is مُبْتَدَأ وَهُوَ مُضَاف: nominatief met één ضَمَّة.' },
      { ar: 'السَّيَّارَةِ', role: 'mudaf_ilayhi', status: 'majroor', mark: 'kasrah', explain: '«السَّيَّارَةِ» is de bezitter (مُضَاف إِلَيْهِ): genitief met كَسْرَة.' },
      { ar: 'عَلَى', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«عَلَى» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'الْمَكْتَبِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«الْمَكْتَبِ» volgt na عَلَى (اِسْم مَجْرُور): genitief met كَسْرَة.' }
    ]
  },
  {
    id: 'med_13',
    category: 'medina',
    categoryTitle: 'Medina Les 6 · Vrouwelijk (هَذِهِ & ة)',
    sentence: 'هَذِهِ سَيَّارَةُ الطَّبِيبِ',
    nl: 'Dit is de auto van de arts.',
    ruleSummary: 'Les 6: Vrouwelijke aanwijzer «هَذِهِ» als Moebtada; «سَيَّارَةُ» is de Gabr én tegelijk Moedaf voor «الطَّبِيبِ».',
    words: [
      { ar: 'هَذِهِ', role: 'mubtada', status: 'mabnee', mark: 'none', explain: '«هَذِهِ» is het vrouwelijke aanwijzend voornaamwoord en fungeert als onderwerp (مُبْتَدَأ, مَبْنِيّ).' },
      { ar: 'سَيَّارَةُ', role: 'khabar', status: 'marfoo', mark: 'dammah', explain: '«سَيَّارَةُ» is het gezegde (خَبَر) én bezit (مُضَاف): nominatief met één ضَمَّة.' },
      { ar: 'الطَّبِيبِ', role: 'mudaf_ilayhi', status: 'majroor', mark: 'kasrah', explain: '«الطَّبِيبِ» is de bezitter (مُضَاف إِلَيْهِ): genitief met كَسْرَة.' }
    ]
  },
  {
    id: 'med_14',
    category: 'medina',
    categoryTitle: 'Medina Les 6 · Vrouwelijk Gezegde',
    sentence: 'الْغُرْفَةُ صَغِيرَةٌ',
    nl: 'De kamer is klein.',
    ruleSummary: 'Les 6: Als de Moebtada vrouwelijk is (الْغُرْفَةُ met ة), moet de Gabr ook vrouwelijk zijn (صَغِيرَةٌ met ة).',
    words: [
      { ar: 'الْغُرْفَةُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الْغُرْفَةُ» is een vrouwelijk onderwerp (مُبْتَدَأ): nominatief met ضَمَّة.' },
      { ar: 'صَغِيرَةٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«صَغِيرَةٌ» is het vrouwelijke gezegde (خَبَر): nominatief met تَنْوِين ضَمّ.' }
    ]
  },
  {
    id: 'med_15',
    category: 'medina',
    categoryTitle: 'Medina Les 6 · Lichaamsdelen in Paren',
    sentence: 'الْعَيْنُ جَمِيلَةٌ',
    nl: 'Het oog is mooi.',
    ruleSummary: 'Les 6: Lichaamsdelen die in paren voorkomen (zoals الْعَيْنُ, الْيَدُ, الرِّجْلُ) zijn vrouwelijk en krijgen dus een vrouwelijke Gabr met ة.',
    words: [
      { ar: 'الْعَيْنُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الْعَيْنُ» (het oog) is vrouwelijk en fungeert als onderwerp (مُبْتَدَأ): nominatief met ضَمَّة.' },
      { ar: 'جَمِيلَةٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«جَمِيلَةٌ» is het vrouwelijke gezegde (خَبَر): nominatief met تَنْوِين ضَمّ.' }
    ]
  },
  {
    id: 'med_16',
    category: 'medina',
    categoryTitle: 'Medina Les 7 · Aanwijzer تِلْكَ',
    sentence: 'تِلْكَ مُمَرِّضَةٌ',
    nl: 'Dat is een verpleegster.',
    ruleSummary: 'Les 7: «تِلْكَ» is het aanwijzend voornaamwoord voor veraf vrouwelijk (Moebtada, مَبْنِيّ).',
    words: [
      { ar: 'تِلْكَ', role: 'mubtada', status: 'mabnee', mark: 'none', explain: '«تِلْكَ» is een vrouwelijk aanwijzend voornaamwoord voor veraf en fungeert als onderwerp (مُبْتَدَأ, مَبْنِيّ).' },
      { ar: 'مُمَرِّضَةٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«مُمَرِّضَةٌ» is het gezegde (خَبَر): nominatief met تَنْوِين ضَمّ.' }
    ]
  },
  {
    id: 'med_17',
    category: 'medina',
    categoryTitle: 'Medina Les 7 · Vrouwelijk + Naʿt',
    sentence: 'السَّاعَةُ الْجَدِيدَةُ جَمِيلَةٌ',
    nl: 'Het nieuwe horloge is mooi.',
    ruleSummary: 'Les 7 & 9: Vrouwelijk onderwerp (السَّاعَةُ) + vrouwelijk bijvoeglijk naamwoord (الْجَدِيدَةُ, Naʿt) + vrouwelijk gezegde (جَمِيلَةٌ, Gabr).',
    words: [
      { ar: 'السَّاعَةُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«السَّاعَةُ» is het onderwerp (مُبْتَدَأ): nominatief met ضَمَّة.' },
      { ar: 'الْجَدِيدَةُ', role: 'naat', status: 'marfoo', mark: 'dammah', explain: '«الْجَدِيدَةُ» is een bijvoeglijk naamwoord (نَعْت) bij السَّاعَةُ: volgt in vrouwelijk, الْ en ضَمَّة.' },
      { ar: 'جَمِيلَةٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«جَمِيلَةٌ» (zonder الْ) is het gezegde (خَبَر): nominatief met تَنْوِين ضَمّ.' }
    ]
  },
  {
    id: 'med_18',
    category: 'medina',
    categoryTitle: 'Medina Les 8 · Aanwijzer met الْ (Badal)',
    sentence: 'هَذَا التَّاجِرُ غَنِيٌّ',
    nl: 'Deze handelaar is rijk.',
    ruleSummary: 'Les 8: Als direct na «هَذَا» een woord mét الْ volgt («التَّاجِرُ»), vormt dat één geheel ("deze handelaar"): «التَّاجِرُ» is een Badal (بَدَل).',
    words: [
      { ar: 'هَذَا', role: 'mubtada', status: 'mabnee', mark: 'none', explain: '«هَذَا» is het aanwijzend voornaamwoord als onderwerp (مُبْتَدَأ, مَبْنِيّ).' },
      { ar: 'التَّاجِرُ', role: 'badal', status: 'marfoo', mark: 'dammah', explain: '«التَّاجِرُ» heeft الْ direct na هَذَا en is daarom een Badal (بَدَل): volgt de Moebtada in de nominatief (ضَمَّة).' },
      { ar: 'غَنِيٌّ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«غَنِيٌّ» is het onbepaalde gezegde (خَبَر): nominatief met تَنْوِين ضَمّ.' }
    ]
  },
  {
    id: 'med_19',
    category: 'medina',
    categoryTitle: 'Medina Les 8 · ذَلِكَ + Badal',
    sentence: 'ذَلِكَ الرَّجُلُ مُدَرِّسٌ',
    nl: 'Die man is een leraar.',
    ruleSummary: 'Les 8: «ذَلِكَ الرَّجُلُ» ("die man") = Moebtada + Badal; «مُدَرِّسٌ» (zonder الْ) = Gabr.',
    words: [
      { ar: 'ذَلِكَ', role: 'mubtada', status: 'mabnee', mark: 'none', explain: '«ذَلِكَ» is het onderwerp (مُبْتَدَأ, مَبْنِيّ).' },
      { ar: 'الرَّجُلُ', role: 'badal', status: 'marfoo', mark: 'dammah', explain: '«الرَّجُلُ» heeft الْ na ذَلِكَ en is een Badal (بَدَل): nominatief met ضَمَّة.' },
      { ar: 'مُدَرِّسٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«مُدَرِّسٌ» is het gezegde (خَبَر): nominatief met تَنْوِين ضَمّ.' }
    ]
  },
  {
    id: 'med_20',
    category: 'medina',
    categoryTitle: 'Medina Les 9 · Naʿt & Manʿūt (Bepaald)',
    sentence: 'الطَّالِبُ الْجَدِيدُ فِي الْفَصْلِ',
    nl: 'De nieuwe student is in het klaslokaal.',
    ruleSummary: 'Les 9: «الْجَدِيدُ» heeft الْ net als «الطَّالِبُ» en is dus een bijvoeglijk naamwoord (نَعْت), géén Gabr! De Gabr is «فِي الْفَصْلِ».',
    words: [
      { ar: 'الطَّالِبُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الطَّالِبُ» is het onderwerp (مُبْتَدَأ): nominatief met ضَمَّة.' },
      { ar: 'الْجَدِيدُ', role: 'naat', status: 'marfoo', mark: 'dammah', explain: '«الْجَدِيدُ» is een bijvoeglijk naamwoord (نَعْت) bij الطَّالِبُ: volgt in bepaaldheid (الْ) en nominatief (ضَمَّة).' },
      { ar: 'فِي', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«فِي» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'الْفَصْلِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«الْفَصْلِ» volgt na فِي (اِسْم مَجْرُور): genitief met كَسْرَة.' }
    ]
  },
  {
    id: 'med_21',
    category: 'medina',
    categoryTitle: 'Medina Les 9 · Naʿt & Manʿūt (Onbepaald)',
    sentence: 'هَذَا بَيْتٌ كَبِيرٌ',
    nl: 'Dit is een groot huis.',
    ruleSummary: 'Les 9: «بَيْتٌ» is een onbepaalde Gabr; «كَبِيرٌ» volgt als onbepaalde Naʿt met tanwīn dammah (-un).',
    words: [
      { ar: 'هَذَا', role: 'mubtada', status: 'mabnee', mark: 'none', explain: '«هَذَا» is het onderwerp (مُبْتَدَأ, مَبْنِيّ).' },
      { ar: 'بَيْتٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«بَيْتٌ» is het gezegde (خَبَر): nominatief met تَنْوِين ضَمّ.' },
      { ar: 'كَبِيرٌ', role: 'naat', status: 'marfoo', mark: 'tanween_damm', explain: '«كَبِيرٌ» is een bijvoeglijk naamwoord (نَعْت) bij بَيْتٌ: volgt in onbepaaldheid en تَنْوِين ضَمّ.' }
    ]
  },
  {
    id: 'med_22',
    category: 'medina',
    categoryTitle: 'Medina Les 9 · Naʿt in de Genitief',
    sentence: 'الْعُصْفُورُ عَلَى الشَّجَرَةِ الْكَبِيرَةِ',
    nl: 'De mus zit op de grote boom.',
    ruleSummary: 'Les 9: Omdat «الشَّجَرَةِ» na عَلَى in de genitief staat (-i), krijgt het bijvoeglijk naamwoord «الْكَبِيرَةِ» óók een kasrah (-i).',
    words: [
      { ar: 'الْعُصْفُورُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الْعُصْفُورُ» is het onderwerp (مُبْتَدَأ): nominatief met ضَمَّة.' },
      { ar: 'عَلَى', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«عَلَى» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'الشَّجَرَةِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«الشَّجَرَةِ» volgt op عَلَى (اِسْم مَجْرُور): genitief met كَسْرَة.' },
      { ar: 'الْكَبِيرَةِ', role: 'naat', status: 'majroor', mark: 'kasrah', explain: '«الْكَبِيرَةِ» is een bijvoeglijk naamwoord (نَعْت) bij الشَّجَرَةِ: volgt in vrouwelijk, الْ en كَسْرَة.' }
    ]
  },
  {
    id: 'med_23',
    category: 'medina',
    categoryTitle: 'Medina Les 9 · Diptoot Bijvoeglijk Naamwoord',
    sentence: 'الْمِنْدِيلُ وَسِخٌ وَالْوَلَدُ كَسْلَانُ',
    nl: 'De zakdoek is vies.',
    ruleSummary: 'Les 9: Bijvoeglijke naamwoorden op ـَانُ (zoals كَسْلَانُ, جَوْعَانُ, عَطْشَانُ) zijn diptoten en krijgen géén tanwīn (slechts één dammah).',
    words: [
      { ar: 'الْوَلَدُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الْوَلَدُ» is het onderwerp (مُبْتَدَأ): nominatief met ضَمَّة.' },
      { ar: 'كَسْلَانُ', role: 'khabar', status: 'marfoo', mark: 'dammah', explain: '«كَسْلَانُ» (lui) is het gezegde (خَبَر). Woorden op ـَانُ zijn diptoot en krijgen één ضَمَّة zonder tanwīn!' }
    ]
  },
  {
    id: 'med_24',
    category: 'medina',
    categoryTitle: 'Medina Les 10 · Idāfah & Naʿt',
    sentence: 'لُغَةُ الْقُرْآنِ سَهْلَةٌ',
    nl: 'De taal van de Koran is makkelijk.',
    ruleSummary: 'Les 10: Omdat de Moedaf «لُغَةُ» vrouwelijk is, moet het gezegde «سَهْلَةٌ» ook vrouwelijk zijn.',
    words: [
      { ar: 'لُغَةُ', role: 'mubtada_mudaf', status: 'marfoo', mark: 'dammah', explain: '«لُغَةُ» is het vrouwelijke onderwerp (مُبْتَدَأ) én bezit (مُضَاف): nominatief met één ضَمَّة.' },
      { ar: 'الْقُرْآنِ', role: 'mudaf_ilayhi', status: 'majroor', mark: 'kasrah', explain: '«الْقُرْآنِ» is de bezitter (مُضَاف إِلَيْهِ): genitief met كَسْرَة.' },
      { ar: 'سَهْلَةٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«سَهْلَةٌ» is het vrouwelijke gezegde (خَبَر) bij لُغَةُ: nominatief met تَنْوِين ضَمّ.' }
    ]
  },
  {
    id: 'med_25',
    category: 'medina',
    categoryTitle: 'Medina Les 11 · Voorzetsel + Naʿt',
    sentence: 'الطَّبِيبُ فِي الْمُسْتَشْفَى الْكَبِيرِ',
    nl: 'De arts is in het grote ziekenhuis.',
    ruleSummary: 'Les 11: «الْكَبِيرِ» beschrijft «الْمُسْتَشْفَى» (Ism Majrūr) en staat daarom zichtbaar in de genitief met kasrah (-i).',
    words: [
      { ar: 'الطَّبِيبُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الطَّبِيبُ» is het onderwerp (مُبْتَدَأ): nominatief met ضَمَّة.' },
      { ar: 'فِي', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«فِي» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'الْمُسْتَشْفَى', role: 'ism_majroor', status: 'majroor', mark: 'none', explain: '«الْمُسْتَشْفَى» eindigt op alif maqṣūrah (ى) en heeft daardoor een onzichtbare kasrah in de genitief (مَجْرُور).' },
      { ar: 'الْكَبِيرِ', role: 'naat', status: 'majroor', mark: 'kasrah', explain: '«الْكَبِيرِ» is een bijvoeglijk naamwoord (نَعْت) bij الْمُسْتَشْفَى: genitief met een zichtbare كَسْرَة.' }
    ]
  },
  {
    id: 'med_26',
    category: 'medina',
    categoryTitle: 'Medina Les 12 · Vrouwelijk + Idāfah',
    sentence: 'بِنْتُ الْمُدَرِّسِ فِي الْمَدْرَسَةِ',
    nl: 'De dochter van de leraar is op school.',
    ruleSummary: 'Les 12: «بِنْتُ الْمُدَرِّسِ» is een bezitsconstructie (Moedaf + Moedaf Ilayh) gevolgd door فِي + Ism Majrūr.',
    words: [
      { ar: 'بِنْتُ', role: 'mubtada_mudaf', status: 'marfoo', mark: 'dammah', explain: '«بِنْتُ» is مُبْتَدَأ وَهُوَ مُضَاف: nominatief met één ضَمَّة.' },
      { ar: 'الْمُدَرِّسِ', role: 'mudaf_ilayhi', status: 'majroor', mark: 'kasrah', explain: '«الْمُدَرِّسِ» is de bezitter (مُضَاف إِلَيْهِ): genitief met كَسْرَة.' },
      { ar: 'فِي', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«فِي» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'الْمَدْرَسَةِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«الْمَدْرَسَةِ» volgt na فِي (اِسْم مَجْرُور): genitief met كَسْرَة.' }
    ]
  },
  {
    id: 'med_27',
    category: 'medina',
    categoryTitle: 'Medina Les 13 · Meervoud Mensen (الْجَمْعُ)',
    sentence: 'التُّجَّارُ الْكِبَارُ فِي السُّوقِ',
    nl: 'De grote handelaren zijn op de markt.',
    ruleSummary: 'Les 13: Gebroken meervoud voor mensen («التُّجَّارُ») krijgt een meervoudig bijvoeglijk naamwoord («الْكِبَارُ»).',
    words: [
      { ar: 'التُّجَّارُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«التُّجَّارُ» (de handelaren) is het onderwerp (مُبْتَدَأ): nominatief met ضَمَّة.' },
      { ar: 'الْكِبَارُ', role: 'naat', status: 'marfoo', mark: 'dammah', explain: '«الْكِبَارُ» is het meervoudige bijvoeglijk naamwoord (نَعْت) bij التُّجَّارُ: nominatief met ضَمَّة.' },
      { ar: 'فِي', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«فِي» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'السُّوقِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«السُّوقِ» volgt na فِي (اِسْم مَجْرُور): genitief met كَسْرَة.' }
    ]
  },
  {
    id: 'med_28',
    category: 'medina',
    categoryTitle: 'Medina Les 13 · Vrouwelijk Meervoud (-āt)',
    sentence: 'الطَّالِبَاتُ مُجْتَهِدَاتٌ',
    nl: 'De vrouwelijke studenten zijn ijverig.',
    ruleSummary: 'Les 13: Regelmatig vrouwelijk meervoud (جَمْعُ الْمُؤَنَّثِ السَّالِمُ op ـَات) krijgt in de nominatief een dammah (-u / -un).',
    words: [
      { ar: 'الطَّالِبَاتُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الطَّالِبَاتُ» is het onderwerp (مُبْتَدَأ): nominatief met één ضَمَّة.' },
      { ar: 'مُجْتَهِدَاتٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«مُجْتَهِدَاتٌ» is het gezegde (خَبَر): nominatief met تَنْوِين ضَمّ.' }
    ]
  },
  {
    id: 'med_29',
    category: 'medina',
    categoryTitle: 'Medina Les 14 · Idāfah met Meervoud',
    sentence: 'بَيْتُ الْمُدَرِّسِ بَعِيدٌ',
    nl: 'Het huis van de leraar is ver.',
    ruleSummary: 'Les 14: Het gezegde («بَعِيدٌ») richt zich altijd naar de Moedaf («بَيْتُ»), niet naar de Moedaf Ilayh.',
    words: [
      { ar: 'بَيْتُ', role: 'mubtada_mudaf', status: 'marfoo', mark: 'dammah', explain: '«بَيْتُ» is مُبْتَدَأ وَهُوَ مُضَاف: nominatief met één ضَمَّة.' },
      { ar: 'الْمُدَرِّسِ', role: 'mudaf_ilayhi', status: 'majroor', mark: 'kasrah', explain: '«الْمُدَرِّسِ» is de bezitter (مُضَاف إِلَيْهِ): genitief met كَسْرَة.' },
      { ar: 'بَعِيدٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«بَعِيدٌ» is het gezegde (خَبَر) bij بَيْتُ: nominatief met تَنْوِين ضَمّ.' }
    ]
  },
  {
    id: 'med_30',
    category: 'medina',
    categoryTitle: 'Medina Les 16 · Niet-menselijk Meervoud',
    sentence: 'الْبُيُوتُ كَبِيرَةٌ',
    nl: 'De huizen zijn groot.',
    ruleSummary: 'Les 16 Kernregel: Elk meervoud van niet-menselijke zaken (الْجَمْعُ لِغَيْرِ الْعَاقِلِ, zoals الْبُيُوتُ) wordt grammaticaal behandeld als vrouwelijk enkelvoud (كَبِيرَةٌ)!',
    words: [
      { ar: 'الْبُيُوتُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الْبُيُوتُ» (de huizen, niet-menselijk meervoud) is het onderwerp (مُبْتَدَأ): nominatief met ضَمَّة.' },
      { ar: 'كَبِيرَةٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«كَبِيرَةٌ» is het gezegde (خَبَر) in vrouwelijk enkelvoud omdat الْبُيُوتُ een niet-menselijk meervoud is!' }
    ]
  },
  {
    id: 'med_31',
    category: 'medina',
    categoryTitle: 'Medina Les 16 · Niet-menselijk Meervoud + Naʿt',
    sentence: 'الْكُتُبُ الْجَدِيدَةُ عَلَى الْمَكْتَبِ',
    nl: 'De nieuwe boeken liggen op het bureau.',
    ruleSummary: 'Les 16: «الْكُتُبُ» (boeken = niet-menselijk meervoud) krijgt een vrouwelijk enkelvoudig bijvoeglijk naamwoord («الْجَدِيدَةُ»).',
    words: [
      { ar: 'الْكُتُبُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الْكُتُبُ» (de boeken) is het onderwerp (مُبْتَدَأ): nominatief met ضَمَّة.' },
      { ar: 'الْجَدِيدَةُ', role: 'naat', status: 'marfoo', mark: 'dammah', explain: '«الْجَدِيدَةُ» is een bijvoeglijk naamwoord (نَعْت) in vrouwelijk enkelvoud bij het niet-menselijke meervoud الْكُتُبُ.' },
      { ar: 'عَلَى', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«عَلَى» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'الْمَكْتَبِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«الْمَكْتَبِ» volgt na عَلَى (اِسْم مَجْرُور): genitief met كَسْرَة.' }
    ]
  },
  {
    id: 'med_32',
    category: 'medina',
    categoryTitle: 'Medina Les 17 · Niet-menselijk Meervoud',
    sentence: 'أَبْوَابُ الْمَسْجِدِ مَفْتُوحَةٌ',
    nl: 'De deuren van de moskee zijn open.',
    ruleSummary: 'Les 17: «أَبْوَابُ» (deuren = niet-menselijk meervoud) is Moedaf, waardoor het gezegde «مَفْتُوحَةٌ» vrouwelijk enkelvoud is.',
    words: [
      { ar: 'أَبْوَابُ', role: 'mubtada_mudaf', status: 'marfoo', mark: 'dammah', explain: '«أَبْوَابُ» is مُبْتَدَأ وَهُوَ مُضَاف: nominatief met één ضَمَّة.' },
      { ar: 'الْمَسْجِدِ', role: 'mudaf_ilayhi', status: 'majroor', mark: 'kasrah', explain: '«الْمَسْجِدِ» is de bezitter (مُضَاف إِلَيْهِ): genitief met كَسْرَة.' },
      { ar: 'مَفْتُوحَةٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«مَفْتُوحَةٌ» is het gezegde (خَبَر) in vrouwelijk enkelvoud bij het niet-menselijke meervoud أَبْوَابُ.' }
    ]
  },
  {
    id: 'med_33',
    category: 'medina',
    categoryTitle: 'Medina Les 21 · Uitgebreide Nominale Zin',
    sentence: 'الْمَدْرَسَةُ قَرِيبَةٌ مِنَ الْمَسْجِدِ',
    nl: 'De school is dicht bij de moskee.',
    ruleSummary: 'Les 21: Vrouwelijk onderwerp (الْمَدْرَسَةُ) + vrouwelijk gezegde (قَرِيبَةٌ) + voorzetselgroep (مِنَ الْمَسْجِدِ).',
    words: [
      { ar: 'الْمَدْرَسَةُ', role: 'mubtada', status: 'marfoo', mark: 'dammah', explain: '«الْمَدْرَسَةُ» is het vrouwelijke onderwerp (مُبْتَدَأ): nominatief met ضَمَّة.' },
      { ar: 'قَرِيبَةٌ', role: 'khabar', status: 'marfoo', mark: 'tanween_damm', explain: '«قَرِيبَةٌ» is het vrouwelijke gezegde (خَبَر): nominatief met تَنْوِين ضَمّ.' },
      { ar: 'مِنَ', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«مِنَ» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'الْمَسْجِدِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«الْمَسْجِدِ» volgt na مِنَ (اِسْم مَجْرُور): genitief met كَسْرَة.' }
    ]
  },
  {
    id: 'med_34',
    category: 'medina',
    categoryTitle: 'Medina Les 23 · Diptoot in de Genitief',
    sentence: 'كِتَابُ أَحْمَدَ فِي الْحَقِيبَةِ',
    nl: 'Het boek van Ahmad zit in de tas.',
    ruleSummary: 'Les 22 & 23: De eigennaam «أَحْمَدَ» (patroon أَفْعَلُ) is een diptoot (مَمْنُوعٌ مِنَ الصَّرْفِ) en krijgt als Moedaf Ilayh een fathah (-a) i.p.v. een kasrah!',
    words: [
      { ar: 'كِتَابُ', role: 'mubtada_mudaf', status: 'marfoo', mark: 'dammah', explain: '«كِتَابُ» is مُبْتَدَأ وَهُوَ مُضَاف: nominatief met één ضَمَّة.' },
      { ar: 'أَحْمَدَ', role: 'mudaf_ilayhi', status: 'majroor', mark: 'fathah', explain: '«أَحْمَدَ» is de bezitter (مُضَاف إِلَيْهِ). Omdat أَحْمَدَ een diptoot is, staat hij in de genitief met een فَتْحَة (-a)!' },
      { ar: 'فِي', role: 'harf_jarr', status: 'mabnee', mark: 'none', explain: '«فِي» is een voorzetsel (حَرْف جَرّ): onveranderlijk (مَبْنِيّ).' },
      { ar: 'الْحَقِيبَةِ', role: 'ism_majroor', status: 'majroor', mark: 'kasrah', explain: '«الْحَقِيبَةِ» volgt na فِي (اِسْم مَجْرُور): genitief met كَسْرَة.' }
    ]
  }
];

/* ---------- Inline Classroom Zinsontleder (Moebtada / Gabr / Moedaf / etc.) ---------- */
function cleanWordForIrab(w) {
  return String(w || '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[.,،؟?!:;"'«»\[\]←→–—]/g, '')
    .trim();
}

function stripHarakatForIrab(s) {
  return String(s || '')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا');
}

function getEndingInfoForIrab(rawWord) {
  const w = cleanWordForIrab(rawWord);
  for (let i = w.length - 1; i >= 0; i--) {
    const c = w.charCodeAt(i);
    if (c === 0x064C) return { mark: 'tanween_damm', markAr: 'تَنْوِين ضَمّ (ـٌ)', status: 'marfoo', statusAr: 'مَرْفُوع' };
    if (c === 0x064D) return { mark: 'tanween_kasr', markAr: 'تَنْوِين كَسْر (ـٍ)', status: 'majroor', statusAr: 'مَجْرُور' };
    if (c === 0x064B) return { mark: 'tanween_fath', markAr: 'تَنْوِين فَتْح (ـً)', status: 'mansoob', statusAr: 'مَنْصُوب' };
    if (c === 0x064F) return { mark: 'dammah', markAr: 'ضَمَّة (ـُ)', status: 'marfoo', statusAr: 'مَرْفُوع' };
    if (c === 0x0650) return { mark: 'kasrah', markAr: 'كَسْرَة (ـِ)', status: 'majroor', statusAr: 'مَجْرُور' };
    if (c === 0x064E) return { mark: 'fathah', markAr: 'فَتْحَة (ـَ)', status: 'mansoob', statusAr: 'مَنْصُوب' };
    if (c === 0x0652) return { mark: 'sukoon', markAr: 'سُكُون (ـْ)', status: 'mabnee', statusAr: 'مَبْنِيّ' };
    if (c >= 0x0621 && c <= 0x064A && c !== 0x0627 && c !== 0x0648 && c !== 0x064A && c !== 0x0649) {
      break;
    }
  }
  return { mark: 'none', markAr: '—', status: 'mabnee', statusAr: 'مَبْنِيّ' };
}

const _DEM_SET = new Set(['هذا', 'هذه', 'ذلك', 'تلك', 'هؤلاء', 'اولئك']);
const _DUAL_DEM_SET = new Set(['هذان', 'هاتان']);
const _PRON_SET = new Set(['هو', 'هي', 'انا', 'انت', 'نحن', 'انتم', 'انتن', 'هم', 'هن']);
const _PREP_SET = new Set(['في', 'على', 'الى', 'عن']);
const _ZARF_SET = new Set(['تحت', 'امام', 'خلف', 'فوق', 'عند', 'قبل', 'بعد', 'مع']);
const _Q_SET = new Set(['ما', 'اين', 'كيف', 'متى', 'كم', 'اي', 'لمن', 'لماذا']);
const _PARTICLES_SET = new Set(['نعم', 'لا', 'ايضا', 'جدا', 'الان', 'هنا', 'هناك', 'قط', 'امس', 'ثم', 'ثمة', 'اليس', 'الم', 'فقط', 'بلى']);
const _VERB_SET = new Set([
  'ذهب', 'ذهبت', 'ذهبوا', 'ذهبنا', 'ذهبن',
  'خرج', 'خرجت', 'خرجوا', 'خرجنا', 'خرجن',
  'جلس', 'جلست', 'جلسوا', 'جلسنا',
  'دخل', 'دخلت', 'رجع', 'رجعت',
  'احب', 'تحب', 'نحب', 'اتحب', 'سافرنا', 'تسافر', 'اسافر',
  'وصلت', 'بقيت', 'اجلس', 'افاجلس', 'شئت', 'مشيت', 'لبثت', 'عرفت', 'تاتي', 'لاستقبلتك', 'اكله', 'لمرضوا', 'رايت', 'سمعت', 'قرات', 'كتبت', 'شربت', 'اكلت'
]);
const _DIPTOTE_SET = new Set([
  'مكة', 'مصر', 'امنة', 'فاطمة', 'خديجة', 'عائشة', 'مريم', 'زينب', 'سعاد',
  'ابراهيم', 'اسماعيل', 'اسحاق', 'يعقوب', 'يوسف', 'وليم', 'لندن', 'باريس',
  'باكستان', 'بغداد', 'دمشق', 'جدة', 'كسلان', 'جوعان', 'عطشان', 'غضبان',
  'ملان', 'تعبان', 'احمر', 'ابيض', 'اسود', 'اخضر', 'ازرق', 'اصفر', 'مساجد', 'دفاتر', 'فنادق', 'مكاتب', 'مدارس', 'كراسي', 'دقائق', 'زملاء', 'اطباء', 'اغنياء', 'فقراء', 'وزراء', 'علماء', 'اصدقاء', 'اقوياء', 'انكلترا', 'اندونيسيا', 'امريكا', 'المانيا', 'سويسرا', 'فرنسا'
]);

function analyzeArabicSentence(rawSentence) {
  if (!rawSentence) return null;
  if (/[←→+]/.test(rawSentence)) return null;

  const cleanedSent = String(rawSentence)
    .replace(/\([^)]*\)/g, '')
    .trim();

  const rawChunks = cleanedSent.split(/\s+/).filter(Boolean);
  const rawTokens = rawChunks.map(t => cleanWordForIrab(t)).filter(Boolean);
  if (rawTokens.length < 2) return null;

  // Special case 1: Indefinite vs Definite contrast pair like "مَسْجِدٌ وَالْمَسْجِدُ"
  if (rawTokens.length === 2) {
    const b0 = stripHarakatForIrab(rawTokens[0]);
    const b1 = stripHarakatForIrab(rawTokens[1]).replace(/^و/, '');
    if (!b0.startsWith('ال') && b1 === 'ال' + b0) {
      return {
        words: [
          {
            ar: rawTokens[0],
            role: 'mubtada',
            roleAr: 'اِسْم نَكِرَة (مَرْفُوع)',
            roleNl: 'Onbepaald naamwoord (met tanwīn)',
            status: 'marfoo',
            statusAr: 'مَرْفُوع',
            mark: 'tanween_damm',
            markAr: 'تَنْوِين ضَمّ (ـٌ)',
            explain: `«${rawTokens[0]}» heeft géén الـ en is dus onbepaald (نَكِرَة): het eindigt op tanwīn dammah (ـٌ).`
          },
          {
            ar: rawTokens[1],
            role: 'khabar',
            roleAr: 'اِسْم مَعْرِفَة (بِالْـ)',
            roleNl: 'Bepaald naamwoord (met الْـ)',
            status: 'marfoo',
            statusAr: 'مَرْفُوع',
            mark: 'dammah',
            markAr: 'ضَمَّة (ـُ) zonder tanwīn',
            explain: `«${rawTokens[1]}» heeft het lidwoord الـ en is dus bepaald (مَعْرِفَة): de tanwīn vervalt en er blijft één dammah (ـُ) over.`
          }
        ],
        note: 'Uitleg leerkracht: Vergelijking tussen onbepaald (نَكِرَة met tanwīn ـٌ) en bepaald (مَعْرِفَة met الْـ en één dammah ـُ).'
      };
    }
  }

  // Special case 2: Contrast between standalone noun and prepositional phrase like "الْمَسْجِدُ، فِي الْمَسْجِدِ"
  if (rawTokens.length === 3 && /[،,]/.test(rawChunks[0])) {
    const b1 = stripHarakatForIrab(rawTokens[1]);
    if (_PREP_SET.has(b1) || b1 === 'من') {
      return {
        words: [
          {
            ar: rawTokens[0],
            role: 'mubtada',
            roleAr: 'اِسْم مَرْفُوع (الأَصْل)',
            roleNl: 'Los naamwoord (Standaardvorm)',
            status: 'marfoo',
            statusAr: 'مَرْفُوع',
            mark: 'dammah',
            markAr: 'ضَمَّة (ـُ)',
            explain: `Zonder voorzetsel staat «${rawTokens[0]}» standaard in de nominatief (مَرْفُوع met dammah ـُ).`
          },
          {
            ar: rawTokens[1],
            role: 'harf_jarr',
            roleAr: 'حَرْف جَرّ',
            roleNl: 'Harf Djarr (Voorzetsel)',
            status: 'mabnee',
            statusAr: 'مَبْنِيّ',
            mark: 'none',
            markAr: '—',
            explain: `«${rawTokens[1]}» is een voorzetsel (حَرْف جَرّ) en zorgt ervoor dat het woord erna een kasrah krijgt.`
          },
          {
            ar: rawTokens[2],
            role: 'ism_majroor',
            roleAr: 'اِسْم مَجْرُور',
            roleNl: 'Ism Madjroer (Na voorzetsel)',
            status: 'majroor',
            statusAr: 'مَجْرُور',
            mark: 'kasrah',
            markAr: 'كَسْرَة (ـِ)',
            explain: `Door het voorzetsel «${rawTokens[1]}» verandert de uitgang van «${rawTokens[2]}» van dammah (ـُ) naar kasrah (ـِ): اِسْم مَجْرُور.`
          }
        ],
        note: 'Uitleg leerkracht: Vergelijking tussen de standaardvorm met dammah (ـُ) en de vorm ná een voorzetsel (حَرْف جَرّ + اِسْم مَجْرُور met kasrah ـِ).'
      };
    }
  }

  const words = [];
  let hasMubtada = false;
  let hasKhabar = false;
  let hasVerb = false;
  let hasPrepPhraseAfterMubtada = false;
  let prevRole = null;
  let clauseStart = true;

  for (let i = 0; i < rawTokens.length; i++) {
    let tok = rawTokens[i];
    const origChunk = rawChunks[i] || '';
    const prevOrigChunk = i > 0 ? (rawChunks[i - 1] || '') : '';

    if (i > 0 && /[.,،؟?!;]/.test(prevOrigChunk)) {
      clauseStart = true;
      hasMubtada = false;
      hasKhabar = false;
      hasVerb = false;
      prevRole = null;
    }

    let base = stripHarakatForIrab(tok);
    const nextTok = rawTokens[i + 1] || '';
    const nextBase = stripHarakatForIrab(nextTok);
    const nextEnd = nextTok ? getEndingInfoForIrab(nextTok) : null;
    const end = getEndingInfoForIrab(tok);

    if (base.length > 2 && tok.startsWith('وَ') && !['وَلَدٌ', 'وَاقِفٌ', 'وَاحِدٌ', 'وَرَقٌ', 'وَسِخٌ', 'وَجْهٌ', 'وَلِيمُ', 'وُزَرَاءُ', 'وَصَلْتُ', 'وَرْدَةٌ'].includes(tok)) {
      const strippedWa = base.slice(1);
      base = strippedWa;
      clauseStart = true;
      hasMubtada = false;
      hasKhabar = false;
      hasVerb = false;
      prevRole = null;
    }

    if ((i === 0 || clauseStart) && tok.startsWith('أَ') && base.length > 2 && !['انا', 'انت', 'انتم', 'انتن', 'انف', 'امام', 'امس', 'اين', 'اي', 'اب', 'اخ', 'ام', 'اخت', 'اذن', 'اولئك', 'امريكا', 'المانيا', 'احب', 'احمد', 'انكلترا', 'اربعة', 'اربع', 'اقلام', 'ابواب', 'ايام', 'اصدقاء', 'اطباء', 'اغنياء', 'اقوياء', 'امم', 'امهات', 'اهلا'].includes(base)) {
      base = base.slice(1);
    }

    // 1. Vocative يا
    if (base === 'يا') {
      words.push({
        ar: tok, role: 'harf', roleAr: 'حَرْف نِدَاء', roleNl: 'Roeppartikel (Yā)',
        status: 'mabnee', statusAr: 'مَبْنِيّ', mark: 'none', markAr: '—',
        explain: `«${tok}» is een roeppartikel (حَرْف نِدَاء). Het woord erna (مُنَادَى) krijgt één dammah zonder tanwīn.`
      });
      prevRole = 'harf_nida';
      continue;
    }
    if (prevRole === 'harf_nida') {
      words.push({
        ar: tok, role: 'munada', roleAr: 'مُنَادَى', roleNl: 'Moenādā (Aangesprokene)',
        status: 'mabnee', statusAr: 'مَبْنِيّ عَلَى الضَّمّ', mark: 'dammah', markAr: 'ضَمَّة (ـُ)',
        explain: `Na «يَا» is «${tok}» de aangesprokene (مُنَادَى) met één dammah zonder tanwīn.`
      });
      prevRole = null;
      clauseStart = true;
      continue;
    }

    // 2. Yes/No/Adverb particles
    if (_PARTICLES_SET.has(base)) {
      words.push({
        ar: tok, role: 'harf', roleAr: 'حَرْف / ظَرْف', roleNl: 'Partikel / Bijwoord',
        status: 'mabnee', statusAr: 'مَبْنِيّ', mark: 'none', markAr: '—',
        explain: `«${tok}» is een onveranderlijk partikel of bijwoord (مَبْنِيّ).`
      });
      continue;
    }

    // 3. Distinguish مِنْ / مِنَ (preposition) vs مَنْ (question word "wie")
    if (base === 'من') {
      const isPrepMin = tok.startsWith('مِ') || prevRole === 'fil' || prevRole === 'khabar' || (hasMubtada && !clauseStart && prevRole !== 'mudaf' && prevRole !== 'mubtada_mudaf');
      if (isPrepMin) {
        words.push({
          ar: tok, role: 'harf_jarr', roleAr: 'حَرْف جَرّ', roleNl: 'Harf Djarr (Voorzetsel)',
          status: 'mabnee', statusAr: 'مَبْنِيّ', mark: 'none', markAr: '—',
          explain: `«${tok}» is een voorzetsel (حَرْف جَرّ = uit/van); het woord erna wordt اِسْم مَجْرُور met kasrah.`
        });
        prevRole = 'harf_jarr';
        if (hasMubtada && !hasKhabar) hasPrepPhraseAfterMubtada = true;
        continue;
      } else if (prevRole === 'mubtada_mudaf' || prevRole === 'mudaf') {
        words.push({
          ar: tok, role: 'mudaf_ilayhi', roleAr: 'مُضَاف إِلَيْهِ', roleNl: 'Moedaf Ilayh ("van wie")',
          status: 'mabnee', statusAr: 'مَبْنِيّ فِي مَحَلِّ جَرّ', mark: 'none', markAr: '—',
          explain: `«${tok}» (wie) staat hier als tweede deel van de bezitsconstructie (مُضَاف إِلَيْهِ).`
        });
        prevRole = 'mudaf_ilayhi';
        continue;
      } else {
        words.push({
          ar: tok, role: 'khabar', roleAr: 'خَبَر مُقَدَّم (اِسْم اِسْتِفْهَام)', roleNl: 'Gabr / Khabar (Vraagwoord "Wie")',
          status: 'mabnee', statusAr: 'مَبْنِيّ فِي مَحَلِّ رَفْع', mark: 'none', markAr: '—',
          explain: `«${tok}» (wie?) is een vraagwoord en vormt hier het vooropgeplaatste gezegde (خَبَر مُقَدَّم / Gabr).`
        });
        hasKhabar = true;
        prevRole = 'istifham';
        continue;
      }
    }

    // 4. Prepositions (فِي، عَلَى، إِلَى، عَنْ)
    if (_PREP_SET.has(base)) {
      words.push({
        ar: tok, role: 'harf_jarr', roleAr: 'حَرْف جَرّ', roleNl: 'Harf Djarr (Voorzetsel)',
        status: 'mabnee', statusAr: 'مَبْنِيّ', mark: 'none', markAr: '—',
        explain: `«${tok}» is een voorzetsel (حَرْف جَرّ); het woord erna staat in de genitief (اِسْم مَجْرُور).`
      });
      prevRole = 'harf_jarr';
      if (hasMubtada && !hasKhabar) hasPrepPhraseAfterMubtada = true;
      continue;
    }

    // 5. Question words (مَا، أَيْنَ، كَمْ، لِمَنْ، أَيُّ، كَيْفَ، مَتَى)
    if (_Q_SET.has(base)) {
      if (base === 'لمن') {
        words.push({
          ar: tok, role: 'khabar', roleAr: 'خَبَر مُقَدَّم (جَارّ وَمَجْرُور)', roleNl: 'Gabr / Khabar ("Van wie")',
          status: 'mabnee', statusAr: 'فِي مَحَلِّ رَفْع', mark: 'none', markAr: '—',
          explain: `«${tok}» (لِ + مَنْ = van wie?) vormt het vooropgeplaatste gezegde (خَبَر مُقَدَّم / Gabr).`
        });
        hasKhabar = true;
        prevRole = 'khabar_muqaddam';
        continue;
      }
      if (base === 'اي') {
        words.push({
          ar: tok, role: 'mubtada_mudaf', roleAr: 'اِسْم اِسْتِفْهَام (مُضَاف)', roleNl: 'Vraagwoord & Moedaf ("Welke")',
          status: 'marfoo', statusAr: 'مَرْفُوع', mark: 'dammah', markAr: 'ضَمَّة (ـُ)',
          explain: `«${tok}» is een vraagwoord én مُضَاف (Moedaf); het woord erna is altijd مُضَاف إِلَيْهِ met kasrah.`
        });
        prevRole = 'mudaf';
        continue;
      }
      if (prevRole === 'harf_jarr') {
        words.push({
          ar: tok, role: 'ism_majroor', roleAr: 'اِسْم مَجْرُور (اِسْتِفْهَام)', roleNl: 'Ism Madjroer (Vraagwoord na voorzetsel)',
          status: 'mabnee', statusAr: 'مَبْنِيّ فِي مَحَلِّ جَرّ', mark: 'none', markAr: '—',
          explain: `«${tok}» volgt op het voorzetsel مِنْ («waarvandaan?»). Samen vormen zij het vooropgeplaatste gezegde (خَبَر مُقَدَّم / Gabr).`
        });
        hasKhabar = true;
        prevRole = 'istifham';
        continue;
      }
      words.push({
        ar: tok, role: 'khabar', roleAr: 'خَبَر مُقَدَّم (اِسْم اِسْتِفْهَام)', roleNl: 'Gabr / Khabar (Vraagwoord)',
        status: 'mabnee', statusAr: 'مَبْنِيّ فِي مَحَلِّ رَفْع', mark: 'none', markAr: '—',
        explain: `«${tok}» is een vraagwoord en vormt hier het vooropgeplaatste gezegde (خَبَر مُقَدَّم / Gabr).`
      });
      hasKhabar = true;
      prevRole = 'istifham';
      continue;
    }

    // 6. Attached preposition لِـ or preposition+pronoun (like لِبِلَالٍ، لِلَّهِ، لِي، لَكَ، عَلَيْكُمْ، فِيهِ، فِيهَا، مِنْهُ، بِهِ)
    const isPrepPronoun = ['لي', 'لك', 'له', 'لها', 'لنا', 'لكم', 'عليكم', 'عليك', 'عليه', 'عليها', 'فيه', 'فيها', 'منه', 'منها', 'اليه', 'اليها', 'به', 'بها', 'بك', 'بكم'].includes(base);
    if ((tok.startsWith('لِ') && base.length > 2 && !['لبثت', 'لذيذ', 'لذيذة', 'لقاء'].includes(base)) || isPrepPronoun) {
      const isStart = (i === 0 || clauseStart);
      words.push({
        ar: tok,
        role: isStart ? 'khabar' : 'ism_majroor',
        roleAr: isStart ? 'جَارّ وَمَجْرُور (خَبَر مُقَدَّم)' : 'جَارّ وَمَجْرُور (خَبَر)',
        roleNl: isStart ? 'Gabr / Khabar (Voorzetselgroep)' : 'Gabr / Khabar (Voorzetsel + Naamwoord)',
        status: isPrepPronoun ? 'mabnee' : 'majroor',
        statusAr: isPrepPronoun ? 'فِي مَحَلِّ رَفْع خَبَر' : 'مَجْرُور / فِي مَحَلِّ رَفْع',
        mark: isPrepPronoun ? 'none' : (end.mark === 'none' ? 'kasrah' : end.mark),
        markAr: isPrepPronoun ? '— (مَبْنِيّ · Voornaamwoord)' : (end.markAr === '—' ? 'كَسْرَة (ـِ)' : end.markAr),
        explain: `«${tok}» bestaat uit een voorzetsel + ${isPrepPronoun ? 'vastgehecht voornaamwoord (ضَمِير مُتَّصِل)' : 'naamwoord'} (جَارّ وَمَجْرُور). Samen vormt dit het gezegde (خَبَر / Gabr).`
      });
      if (isStart) hasKhabar = true;
      else { hasKhabar = true; hasPrepPhraseAfterMubtada = true; }
      prevRole = 'ism_majroor';
      continue;
    }

    // 7. Word after preposition -> ism_majroor
    if (prevRole === 'harf_jarr') {
      const isDip = _DIPTOTE_SET.has(base) && !base.startsWith('ال');
      const m = isDip ? 'fathah' : (end.mark === 'tanween_kasr' ? 'tanween_kasr' : 'kasrah');
      const mAr = isDip ? 'فَتْحَة (ـَ) · diptoot' : (m === 'tanween_kasr' ? 'تَنْوِين كَسْر (ـٍ)' : 'كَسْرَة (ـِ)');
      words.push({
        ar: tok, role: 'ism_majroor', roleAr: 'اِسْم مَجْرُور', roleNl: 'Ism Madjroer (Na voorzetsel)',
        status: 'majroor', statusAr: 'مَجْرُور', mark: m, markAr: mAr,
        explain: isDip
          ? `«${tok}» staat na een voorzetsel (اِسْم مَجْرُور), maar krijgt als diptoot (مَمْنُوع مِنَ الصَّرْف) een fathah i.p.v. kasrah!`
          : `«${tok}» volgt op een voorzetsel en staat daarom in de genitief (اِسْم مَجْرُور met كَسْرَة).`
      });
      prevRole = 'ism_majroor';
      continue;
    }

    // 8. Adverbs of place/time
    if (_ZARF_SET.has(base) || ['عندي', 'عندك', 'عنده', 'عندها', 'عندنا'].includes(base)) {
      if (['عندي', 'عندك', 'عنده', 'عندها', 'عندنا'].includes(base)) {
        const isStart = (i === 0 || clauseStart);
        words.push({
          ar: tok,
          role: isStart ? 'khabar' : 'zarf',
          roleAr: isStart ? 'ظَرْف (خَبَر مُقَدَّم)' : 'ظَرْف (خَبَر)',
          roleNl: isStart ? 'Gabr / Khabar ("Bij mij / ik heb")' : 'Zarf & Gabr (Plaatsbepaling)',
          status: 'mansoob',
          statusAr: 'فِي مَحَلِّ رَفْع خَبَر',
          mark: 'none',
          markAr: '—',
          explain: `«${tok}» bestaat uit عِنْدَ (bij) + voornaamwoord en vormt hier het gezegde (خَبَر / Gabr).`
        });
        hasKhabar = true;
        prevRole = 'khabar_muqaddam';
        continue;
      }
      words.push({
        ar: tok, role: 'zarf', roleAr: 'ظَرْف (وَهُوَ مُضَاف)', roleNl: 'Zarf & Moedaf (Plaats/tijd)',
        status: 'mansoob', statusAr: 'مَنْصُوب', mark: 'fathah', markAr: 'فَتْحَة (ـَ)',
        explain: `«${tok}» is een plaats-/tijdsbepaling (ظَرْف) en werkt als Moedaf (مُضَاف): het woord erna krijgt een kasrah.`
      });
      prevRole = 'zarf';
      if (hasMubtada && !hasKhabar) hasPrepPhraseAfterMubtada = true;
      continue;
    }

    // 9. Word after zarf or mudaf -> mudaf_ilayhi
    if (prevRole === 'zarf' || prevRole === 'mudaf' || prevRole === 'mubtada_mudaf' || prevRole === 'khabar_mudaf') {
      const isDip = _DIPTOTE_SET.has(base) && !base.startsWith('ال');
      const m = isDip ? 'fathah' : (end.mark === 'tanween_kasr' ? 'tanween_kasr' : 'kasrah');
      const mAr = isDip ? 'فَتْحَة (ـَ) · diptoot' : (m === 'tanween_kasr' ? 'تَنْوِين كَسْر (ـٍ)' : 'كَسْرَة (ـِ)');
      words.push({
        ar: tok, role: 'mudaf_ilayhi', roleAr: 'مُضَاف إِلَيْهِ', roleNl: 'Moedaf Ilayh (Bezitter)',
        status: 'majroor', statusAr: 'مَجْرُور', mark: m, markAr: mAr,
        explain: `«${tok}» is het tweede deel van de bezitsconstructie (مُضَاف إِلَيْهِ / Moedaf Ilayh) en staat altijd in de genitief (مَجْرُور).`
      });
      prevRole = 'mudaf_ilayhi';
      continue;
    }

    // 10. Verbs
    if (_VERB_SET.has(base)) {
      words.push({
        ar: tok, role: 'fil', roleAr: 'فِعْل', roleNl: 'Fiʿl (Werkwoord)',
        status: 'mabnee', statusAr: 'مَبْنِيّ', mark: end.mark, markAr: end.markAr,
        explain: `«${tok}» is een werkwoord (فِعْل).`
      });
      hasVerb = true;
      prevRole = 'fil';
      continue;
    }

    if (prevRole === 'fil') {
      if (end.status === 'mansoob') {
        words.push({
          ar: tok, role: 'mafool', roleAr: 'مَفْعُول بِهِ', roleNl: 'Mafʿoel Bihi (Lijdend voorwerp)',
          status: 'mansoob', statusAr: 'مَنْصُوب', mark: 'fathah', markAr: 'فَتْحَة (ـَ)',
          explain: `«${tok}» is het lijdend voorwerp (مَفْعُول بِهِ) van het werkwoord en staat in de accusatief (مَنْصُوب met fathah).`
        });
        prevRole = 'mafool';
        continue;
      }
      words.push({
        ar: tok, role: 'fail', roleAr: 'فَاعِل', roleNl: 'Fāʿil (Onderwerp van werkwoord)',
        status: 'marfoo', statusAr: 'مَرْفُوع', mark: end.mark === 'none' ? 'dammah' : end.mark, markAr: end.markAr === '—' ? 'ضَمَّة (ـُ)' : end.markAr,
        explain: `«${tok}» verricht de handeling van het werkwoord en is dus de Fāʿil (فَاعِل · nominatief met dammah).`
      });
      prevRole = 'fail';
      continue;
    }

    // 11. Demonstratives
    if (_DEM_SET.has(base) || _DUAL_DEM_SET.has(base)) {
      const isDelayedMubtada = hasKhabar && !hasMubtada;
      const role = (!hasMubtada) ? 'mubtada' : 'khabar';
      if (role === 'mubtada') hasMubtada = true;
      words.push({
        ar: tok,
        role: role,
        roleAr: isDelayedMubtada ? 'مُبْتَدَأ مُؤَخَّر (اِسْم إِشَارَة)' : (role === 'mubtada' ? 'مُبْتَدَأ (اِسْم إِشَارَة)' : 'خَبَر (اِسْم إِشَارَة)'),
        roleNl: isDelayedMubtada ? 'Moebtada (Achtergeplaatst Onderwerp)' : (role === 'mubtada' ? 'Moebtada (Onderwerp · Aanwijzer)' : 'Gabr / Khabar (Gezegde)'),
        status: _DUAL_DEM_SET.has(base) ? 'marfoo' : 'mabnee',
        statusAr: _DUAL_DEM_SET.has(base) ? 'مَرْفُوع بِالْأَلِف' : 'مَبْنِيّ فِي مَحَلِّ رَفْع',
        mark: 'none',
        markAr: '— (Onveranderlijk)',
        explain: `«${tok}» is een aanwijzend voornaamwoord (اِسْم إِشَارَة) dat hier de functie van ${role === 'mubtada' ? 'Moebtada (مُبْتَدَأ · onderwerp)' : 'Gabr / Khabar (خَبَر · gezegde)'} vervult.`
      });
      prevRole = 'dem_' + role;
      clauseStart = false;
      continue;
    }

    // 12. Personal Pronouns
    if (_PRON_SET.has(base)) {
      words.push({
        ar: tok,
        role: 'mubtada',
        roleAr: hasKhabar && !hasMubtada ? 'مُبْتَدَأ مُؤَخَّر (ضَمِير)' : 'مُبْتَدَأ (ضَمِير)',
        roleNl: 'Moebtada (Onderwerp · Voornaamwoord)',
        status: 'mabnee',
        statusAr: 'مَبْنِيّ فِي مَحَلِّ رَفْع',
        mark: 'none',
        markAr: '— (Onveranderlijk)',
        explain: `«${tok}» is een los persoonlijk voornaamwoord (ضَمِير مُنْفَصِل) en vormt de Moebtada (مُبْتَدَأ · het onderwerp).`
      });
      hasMubtada = true;
      prevRole = 'mubtada';
      clauseStart = false;
      continue;
    }

    // 13. Definite noun immediately after a Demonstrative -> Badal (بَدَل)
    if ((prevRole === 'dem_mubtada' || prevRole === 'dem_khabar') && base.startsWith('ال')) {
      words.push({
        ar: tok,
        role: 'badal',
        roleAr: 'بَدَل (مُطَابِق)',
        roleNl: 'Badal (Bepaling na aanwijzer)',
        status: 'marfoo',
        statusAr: 'مَرْفُوع',
        mark: 'dammah',
        markAr: 'ضَمَّة (ـُ)',
        explain: `Omdat «${tok}» het lidwoord الـ heeft direct na een aanwijzend voornaamwoord, vormt het een Badal (بَدَل · verduidelijking van het onderwerp) met dammah.`
      });
      prevRole = 'badal';
      continue;
    }

    // 14. Check for Na't (bijvoeglijk naamwoord)
    const prevWordObj = words[words.length - 1];
    const prevWasDef = prevWordObj && stripHarakatForIrab(prevWordObj.ar).replace(/^و/, '').startsWith('ال');
    if (prevWordObj && prevWasDef && base.startsWith('ال') && ['mubtada', 'khabar', 'ism_majroor', 'mudaf_ilayhi', 'badal'].includes(prevWordObj.role)) {
      const st = prevWordObj.status === 'majroor' ? 'majroor' : 'marfoo';
      const stAr = st === 'majroor' ? 'مَجْرُور' : 'مَرْفُوع';
      const mk = st === 'majroor' ? 'kasrah' : 'dammah';
      const mkAr = st === 'majroor' ? 'كَسْرَة (ـِ)' : 'ضَمَّة (ـُ)';
      words.push({
        ar: tok,
        role: 'naat',
        roleAr: 'نَعْت (صِفَة)',
        roleNl: `Naʿt (Bijv. nw. bij ${prevWordObj.ar})`,
        status: st,
        statusAr: stAr,
        mark: mk,
        markAr: mkAr,
        explain: `«${tok}» is een Naʿt (نَعْت · bijvoeglijk naamwoord) bij «${prevWordObj.ar}» en volgt in bepaaldheid (الـ), geslacht én naamval (${stAr} met ${mkAr}).`
      });
      prevRole = 'naat';
      continue;
    }

    if (prevWordObj && prevWordObj.role === 'khabar' && !prevWasDef && !base.startsWith('ال') && (end.mark === 'tanween_damm' || end.mark === 'dammah')) {
      words.push({
        ar: tok,
        role: 'naat',
        roleAr: 'نَعْت (صِفَة)',
        roleNl: `Naʿt (Bijv. nw. bij ${prevWordObj.ar})`,
        status: 'marfoo',
        statusAr: 'مَرْفُوع',
        mark: end.mark,
        markAr: end.markAr,
        explain: `«${tok}» is een onbepaald bijvoeglijk naamwoord (نَعْت / Naʿt) dat «${prevWordObj.ar}» beschrijft en meegaat in de nominatief (مَرْفُوع).`
      });
      prevRole = 'naat';
      continue;
    }

    // 15. Check for Idāfah (Mudaf)
    const isMudafCandidate = !base.startsWith('ال') && end.mark === 'dammah' && !_DIPTOTE_SET.has(base) && nextTok && (nextEnd.status === 'majroor' || nextBase.startsWith('ال') || _DIPTOTE_SET.has(nextBase) || nextBase === 'من');
    if (isMudafCandidate) {
      if (!hasMubtada) {
        hasMubtada = true;
        words.push({
          ar: tok,
          role: 'mubtada_mudaf',
          roleAr: 'مُبْتَدَأ وَهُوَ مُضَاف',
          roleNl: 'Moebtada & Moedaf (Onderwerp & Bezit)',
          status: 'marfoo',
          statusAr: 'مَرْفُوع',
          mark: 'dammah',
          markAr: 'ضَمَّة (ـُ) zonder tanwīn',
          explain: `«${tok}» is de Moebtada (مُبْتَدَأ · onderwerp) én Moedaf (مُضَاف · eerste deel van bezitsconstructie): één dammah zonder tanwīn en geen الـ.`
        });
        prevRole = 'mubtada_mudaf';
      } else {
        hasKhabar = true;
        words.push({
          ar: tok,
          role: 'khabar',
          roleAr: 'خَبَر وَهُوَ مُضَاف',
          roleNl: 'Gabr / Khabar & Moedaf (Gezegde & Bezit)',
          status: 'marfoo',
          statusAr: 'مَرْفُوع',
          mark: 'dammah',
          markAr: 'ضَمَّة (ـُ) zonder tanwīn',
          explain: `«${tok}» is de Gabr / Khabar (خَبَر · gezegde) én Moedaf (مُضَاف · bezit): één dammah zonder tanwīn.`
        });
        prevRole = 'khabar_mudaf';
      }
      clauseStart = false;
      continue;
    }

    // 16. Standard Mubtada' vs Khabar
    if (!hasMubtada) {
      hasMubtada = true;
      const isDelayed = hasKhabar;
      const mk = end.mark === 'none' ? 'dammah' : end.mark;
      const mkAr = end.markAr === '—' ? 'ضَمَّة (ـُ)' : end.markAr;
      words.push({
        ar: tok,
        role: 'mubtada',
        roleAr: isDelayed ? 'مُبْتَدَأ مُؤَخَّر' : 'مُبْتَدَأ',
        roleNl: isDelayed ? 'Moebtada (Achtergeplaatst Onderwerp)' : 'Moebtada (Onderwerp)',
        status: 'marfoo',
        statusAr: 'مَرْفُوع',
        mark: mk,
        markAr: mkAr,
        explain: `«${tok}» is de Moebtada (مُبْتَدَأ · het onderwerp waar de zin over gaat) en staat in de nominatief (مَرْفُوع).`
      });
      prevRole = 'mubtada';
      clauseStart = false;
      continue;
    }

    if (!hasKhabar) {
      hasKhabar = true;
      const isDip = _DIPTOTE_SET.has(base) && !base.startsWith('ال');
      const mk = end.mark === 'none' ? (isDip ? 'dammah' : 'tanween_damm') : end.mark;
      const mkAr = end.markAr === '—' ? (isDip ? 'ضَمَّة (ـُ)' : 'تَنْوِين ضَمّ (ـٌ)') : end.markAr;
      words.push({
        ar: tok,
        role: 'khabar',
        roleAr: 'خَبَر',
        roleNl: 'Gabr / Khabar (Gezegde)',
        status: 'marfoo',
        statusAr: 'مَرْفُوع',
        mark: mk,
        markAr: mkAr,
        explain: `«${tok}» vertelt iets over het onderwerp en is dus de Gabr / Khabar (خَبَر · het gezegde), in de nominatief (مَرْفُوع).`
      });
      prevRole = 'khabar';
      continue;
    }

    words.push({
      ar: tok,
      role: end.status === 'majroor' ? 'ism_majroor' : 'khabar',
      roleAr: end.status === 'majroor' ? 'مَجْرُور' : 'خَبَر / تَابِع',
      roleNl: end.status === 'majroor' ? 'Ism Madjroer (Genitief)' : 'Gabr / Khabar (Aanvulling)',
      status: end.status,
      statusAr: end.statusAr,
      mark: end.mark,
      markAr: end.markAr,
      explain: `«${tok}» staat in status ${end.statusAr} met ${end.markAr}.`
    });
  }

  let note = '';
  if (hasMubtada && !hasKhabar && hasPrepPhraseAfterMubtada) {
    note = 'Uitleg leerkracht: De voorzetselgroep / plaatsbepaling (شِبْهُ جُمْلَة) vormt hier samen de Gabr / Khabar (خَبَر · het gezegde) van de zin.';
  }

  return { words, note };
}

function getSolvedSentenceFromDrill(d) {
  if (!d) return '';
  if (d.type === 'parse') return d.sentence || '';
  if (d.type === 'order' && Array.isArray(d.words)) return d.words.join(' ');
  const ansOpt = (Array.isArray(d.options) && typeof d.answer === 'number') ? String(d.options[d.answer] || '') : '';
  if (d.type === 'fill' && d.ar) {
    const parts = String(d.ar).split('_');
    const optParts = ansOpt.includes(' / ') ? ansOpt.split(' / ') : [ansOpt, ansOpt, ansOpt, ansOpt];
    let out = '';
    parts.forEach((p, idx) => {
      if (idx < parts.length - 1) {
        let rep = (optParts[idx] || ansOpt).trim();
        if (/^ـ[\u064B-\u0652]+$/.test(rep)) {
          out += p.replace(/\s+$/, '') + rep.slice(1);
        } else {
          out += p + rep;
        }
      } else {
        out += p;
      }
    });
    return out.trim();
  }
  if (d.type === 'transform') {
    if (/[\u0600-\u06FF]/.test(ansOpt) && ansOpt.trim().split(/\s+/).length >= 2) return ansOpt.trim();
    if (d.from && d.from.trim().split(/\s+/).length >= 2 && !d.from.includes('+')) return d.from.trim();
  }
  if (d.type === 'mc') {
    if (/[\u0600-\u06FF]/.test(ansOpt) && !/[a-zA-Z]{3,}/.test(ansOpt) && ansOpt.trim().split(/\s+/).length >= 2) {
      return ansOpt.trim();
    }
    const m = String(d.q || '').match(/«([^»]*[\u0600-\u06FF][^»]*)»/);
    if (m && m[1].trim().split(/\s+/).length >= 2) return m[1].trim();
  }
  return '';
}

const CLASSROOM_ROLES = [
  { id: 'mubtada', ar: 'مُبْتَدَأ', nl: 'Moebtada · Onderwerp', core: true },
  { id: 'khabar', ar: 'خَبَر', nl: 'Gabr / Khabar · Gezegde', core: true },
  { id: 'harf_jarr', ar: 'حَرْف جَرّ', nl: 'Harf Djarr · Voorzetsel', core: true },
  { id: 'ism_majroor', ar: 'اِسْم مَجْرُور', nl: 'Ism Madjroer · Na voorz.', core: true },
  { id: 'mudaf', ar: 'مُضَاف', nl: 'Moedaf · Bezit', core: true },
  { id: 'mudaf_ilayhi', ar: 'مُضَاف إِلَيْهِ', nl: 'Moedaf Ilayh · Bezitter', core: true },
  { id: 'naat', ar: 'نَعْت', nl: 'Naʿt · Bijv. nw.', core: true },
  { id: 'badal', ar: 'بَدَل', nl: 'Badal · Bepaling na aanwijzer', core: false },
  { id: 'zarf', ar: 'ظَرْف', nl: 'Zarf · Plaats / tijd', core: false },
  { id: 'fil', ar: 'فِعْل', nl: 'Fiʿl · Werkwoord', core: false },
  { id: 'fail', ar: 'فَاعِل', nl: 'Fāʿil · Doener', core: false },
  { id: 'mafool', ar: 'مَفْعُول بِهِ', nl: 'Mafʿoel Bihi · Lijdend vw.', core: false },
  { id: 'munada', ar: 'مُنَادَى', nl: 'Moenādā · Aangesprokene', core: false },
  { id: 'harf', ar: 'حَرْف', nl: 'Harf · Partikel', core: false }
];

function matchClassroomRole(pickedId, wordObj) {
  if (!wordObj) return false;
  const target = wordObj.role;
  if (pickedId === target) return true;
  if (target === 'mubtada_mudaf' && (pickedId === 'mubtada' || pickedId === 'mudaf')) return true;
  if (target === 'khabar' && String(wordObj.roleAr || '').includes('مُضَاف') && pickedId === 'mudaf') return true;
  if (String(wordObj.roleAr || '').includes('جَارّ وَمَجْرُور') && (pickedId === 'khabar' || pickedId === 'ism_majroor' || pickedId === 'harf_jarr')) return true;
  if (target === 'zarf' && pickedId === 'mudaf') return true;
  return false;
}

function roleColorClass(role) {
  if (role === 'mubtada' || role === 'mubtada_mudaf') return 'rc-mubtada';
  if (role === 'khabar') return 'rc-khabar';
  if (role === 'harf_jarr' || role === 'ism_majroor') return 'rc-jarr';
  if (role === 'mudaf' || role === 'mudaf_ilayhi') return 'rc-idafah';
  if (role === 'naat' || role === 'badal') return 'rc-naat';
  return 'rc-other';
}

window._inlineIrabState = window._inlineIrabState || {};
function getInlineIrabSession(key, defaultMode) {
  if (!window._inlineIrabState[key]) {
    window._inlineIrabState[key] = {
      open: false,
      mode: defaultMode || 'view',
      wi: 0,
      done: {},
      fb: null,
      complete: false,
      selWord: null
    };
  }
  return window._inlineIrabState[key];
}

function renderInlineIrab(rawSentence, key, defaultMode) {
  const parsed = analyzeArabicSentence(rawSentence);
  if (!parsed || !parsed.words || parsed.words.length < 2) return '';
  const st = getInlineIrabSession(key, defaultMode || 'view');
  const words = parsed.words;
  if (st.wi >= words.length) st.wi = 0;

  const topBar = `<div class="iirab-top">
    <div class="iirab-title">
      <span class="iirab-badge-ar ar" lang="ar">إعراب</span>
      <span>Zinsontleding · <b>Moebtada &amp; Gabr</b></span>
    </div>
    <div class="iirab-modes">
      <button type="button" class="iirab-mode-btn ${st.mode === 'view' ? 'active' : ''}" data-act="iirab-mode" data-key="${E(key)}" data-mode="view">Overzicht</button>
      <button type="button" class="iirab-mode-btn ${st.mode === 'quiz' ? 'active' : ''}" data-act="iirab-mode" data-key="${E(key)}" data-mode="quiz">Zelf ontleden</button>
      <button type="button" class="iirab-close-btn" data-act="iirab-close" data-key="${E(key)}" title="Sluit ontleding" aria-label="Sluiten">×</button>
    </div>
  </div>`;

  if (st.mode === 'view') {
    const cardsHtml = words.map((w, idx) => {
      const isSel = st.selWord === idx;
      return `<button type="button" class="iirab-word-card ${roleColorClass(w.role)} ${isSel ? 'selected' : ''}" data-act="iirab-word-info" data-key="${E(key)}" data-wi="${idx}">
        <span class="iirab-w-ar ar" lang="ar">${arHtml(w.ar)}</span>
        <span class="iirab-w-role-ar ar" lang="ar">${arHtml(w.roleAr)}</span>
        <span class="iirab-w-role-nl">${E(w.roleNl)}</span>
        <span class="iirab-w-meta"><b class="ar" lang="ar">${arHtml(w.statusAr)}</b> · <span class="ar" lang="ar">${arHtml(w.markAr)}</span></span>
      </button>`;
    }).join('');

    const selW = (st.selWord !== null && words[st.selWord]) ? words[st.selWord] : null;
    const explainBox = selW
      ? `<div class="iirab-explain-box"><b>Uitleg bij «<span class="ar" lang="ar">${arHtml(selW.ar)}</span>»:</b> ${mix(selW.explain)}</div>`
      : `<div class="iirab-hint-line">Tik op een woordkaartje voor de uitgebreide uitleg van de leerkracht.</div>`;

    const noteHtml = parsed.note
      ? `<div class="iirab-teacher-note">${ICO.check} <span>${mix(parsed.note)}</span></div>`
      : '';

    return `<div class="inline-irab-box" data-key="${E(key)}">
      ${topBar}
      <div class="iirab-cards" dir="rtl">${cardsHtml}</div>
      ${explainBox}
      ${noteHtml}
    </div>`;
  }

  // Mode === 'quiz' (Zelf ontleden zoals met de leerkracht)
  const cardsHtml = words.map((w, idx) => {
    const isDone = !!st.done[idx];
    const isCur = idx === st.wi && !st.complete;
    if (isDone) {
      return `<button type="button" class="iirab-word-card ${roleColorClass(w.role)} done" data-act="iirab-select-quiz-w" data-key="${E(key)}" data-wi="${idx}">
        <span class="iirab-w-chk">✓</span>
        <span class="iirab-w-ar ar" lang="ar">${arHtml(w.ar)}</span>
        <span class="iirab-w-role-ar ar" lang="ar">${arHtml(w.roleAr)}</span>
        <span class="iirab-w-role-nl">${E(w.roleNl)}</span>
        <span class="iirab-w-meta"><b class="ar" lang="ar">${arHtml(w.statusAr)}</b> · <span class="ar" lang="ar">${arHtml(w.markAr)}</span></span>
      </button>`;
    }
    return `<button type="button" class="iirab-word-card quiz-pending ${isCur ? 'active-target' : ''}" data-act="iirab-select-quiz-w" data-key="${E(key)}" data-wi="${idx}">
      <span class="iirab-w-num">${idx + 1}</span>
      <span class="iirab-w-ar ar" lang="ar">${arHtml(w.ar)}</span>
      <span class="iirab-w-qbadge">${isCur ? 'Welke rol?' : 'Tik om te kiezen'}</span>
    </button>`;
  }).join('');

  const curW = words[st.wi] || words[0];
  const presentRoles = new Set(words.map(w => w.role));
  const roleChoices = CLASSROOM_ROLES.filter(r => r.core || presentRoles.has(r.id));

  let quizBody = '';
  if (!st.complete) {
    quizBody = `<div class="iirab-quiz-area">
      <div class="iirab-quiz-prompt">
        <span>Wat is de rol van <b class="ar" lang="ar">«${arHtml(curW.ar)}»</b> in deze zin?</span>
        <small>Woord ${st.wi + 1} van ${words.length}</small>
      </div>
      <div class="iirab-role-pills">
        ${roleChoices.map(r => `<button type="button" class="iirab-role-pill" data-act="iirab-pick-role" data-key="${E(key)}" data-sent="${E(rawSentence)}" data-role="${r.id}">
          <b class="ar" lang="ar">${r.ar}</b>
          <small>${E(r.nl)}</small>
        </button>`).join('')}
      </div>
      ${st.fb ? `<div class="iirab-fb ${st.fb.ok ? 'ok' : 'bad'}">${mix(st.fb.msg)}</div>` : ''}
    </div>`;
  } else {
    quizBody = `<div class="iirab-complete-bar">
      <div>${ICO.check} <b>Goed gedaan!</b> Alle woorden van deze zin zijn ontleed.</div>
      <button type="button" class="btn btn-secondary btn-sm" data-act="iirab-reset" data-key="${E(key)}">Opnieuw oefenen</button>
    </div>
    ${parsed.note ? `<div class="iirab-teacher-note">${ICO.check} <span>${mix(parsed.note)}</span></div>` : ''}`;
  }

  return `<div class="inline-irab-box mode-quiz" data-key="${E(key)}">
    ${topBar}
    <div class="iirab-cards" dir="rtl">${cardsHtml}</div>
    ${quizBody}
  </div>`;
}

window.analyzeArabicSentence = analyzeArabicSentence;
window.renderInlineIrab = renderInlineIrab;
window.getInlineIrabSession = getInlineIrabSession;

function checkRoleMatch(chosen, target){
  if(chosen === target) return true;
  if((chosen === 'mubtada' && target === 'mubtada_mudaf') || (chosen === 'mubtada_mudaf' && target === 'mubtada')) return true;
  return false;
}
function checkMarkMatch(chosen, target){
  if(chosen === target) return true;
  return false;
}

function getParseSession(key, words){
  const s = S();
  if(!s.parseState || s.parseState.key !== key){
    s.parseState = {
      key: key,
      wi: 0,
      selRole: null,
      selStatus: null,
      selMark: null,
      wordsDone: {},
      slots: {},
      slotStatus: {},
      tapRole: null,
      activeSlot: 0,
      dndMsg: null,
      feedback: null,
      complete: false
    };
  }
  return s.parseState;
}

function renderDndParseBlock(ps, sentObj, words, isStudio, s, sents){
  const allFilled = words.length > 0 && words.every((_, idx) => !!ps.slots[idx]);

  const wordColsHtml = words.map((w, idx) => {
    const placedRoleId = ps.slots[idx];
    const rObj = placedRoleId ? IRAB_ROLES.find(r => r.id === placedRoleId) : null;
    const st = ps.slotStatus && ps.slotStatus[idx];
    const isTarget = !ps.complete && ps.activeSlot === idx && !placedRoleId;
    let slotCls = 'g2-dnd-slot';
    if(rObj) slotCls += ' slot-filled';
    if(st === 'correct') slotCls += ' slot-correct';
    if(st === 'wrong') slotCls += ' slot-wrong g2-shake';
    if(ps.tapRole && !ps.complete) slotCls += ' slot-tap-ready';
    if(isTarget) slotCls += ' slot-dragover';

    let slotInner = '';
    if(rObj){
      slotInner = `
        <span class="ar slot-role-ar" lang="ar">${arHtml(rObj.ar)}</span>
        <span class="slot-role-nl">${E(rObj.nl)}</span>
        ${!ps.complete ? `<span class="slot-clear-hint">✕ wijzig</span>` : `<span class="slot-clear-hint">✓ juist</span>`}
      `;
    } else {
      slotInner = `<span class="slot-placeholder">${ps.tapRole ? 'Tik om hier te plaatsen' : (isTarget ? 'Kies of sleep rol hierheen' : 'Sleep of tik...')}</span>`;
    }

    return `<div class="g2-dnd-col">
      <div class="g2-dnd-word-box">
        <span class="ar g2-dnd-word-ar" lang="ar">${arHtml(w.ar)}</span>
        ${spk(w.ar)}
      </div>
      <div class="g2-dnd-arrow">↓</div>
      <div class="${slotCls}"
           data-act="g2-dnd-slot"
           data-wi="${idx}"
           data-studio="${isStudio ? '1' : '0'}"
           ondragover="window.g2IrabDragOver && window.g2IrabDragOver(event, ${idx})"
           ondragleave="window.g2IrabDragLeave && window.g2IrabDragLeave(event, ${idx})"
           ondrop="window.g2IrabDrop && window.g2IrabDrop(event, ${idx}, ${isStudio ? 'true' : 'false'})">
        ${slotInner}
      </div>
    </div>`;
  }).join('');

  const roleChipsHtml = IRAB_ROLES.map(r => {
    const isSelected = ps.tapRole === r.id;
    return `<div class="g2-dnd-chip ${isSelected ? 'chip-selected' : ''}"
                 draggable="true"
                 ondragstart="window.g2IrabDragStart && window.g2IrabDragStart(event, '${r.id}')"
                 data-act="g2-dnd-role"
                 data-role="${r.id}"
                 data-studio="${isStudio ? '1' : '0'}">
      <span class="ar chip-ar" lang="ar">${arHtml(r.ar)}</span>
      <span class="chip-nl">${E(r.nl)}</span>
    </div>`;
  }).join('');

  let statusHtml = '';
  if(ps.complete){
    statusHtml = `<span class="g2-dnd-status status-ok">MāshāʾAllāh! Helemaal juist ontleed! 🎉</span>`;
  } else if(ps.dndMsg){
    const cls = ps.dndMsg.type === 'warn' ? 'status-warn' : 'status-err';
    statusHtml = `<span class="g2-dnd-status ${cls}">${E(ps.dndMsg.text)}</span>`;
  }

  let explainHtml = '';
  if(ps.complete){
    explainHtml = `<div class="g2-dnd-explain-box">
      <div class="g2-dnd-explain-title">📖 Verklaring uit het Medina Grammaticaboek:</div>
      ${sentObj.ruleSummary ? `<p class="g2-dnd-rule-summary">${mix(sentObj.ruleSummary)}</p>` : ''}
      <ul class="g2-dnd-explain-list">
        ${words.map(w => {
          const rObj = IRAB_ROLES.find(r => r.id === w.role);
          const sObj = IRAB_STATUSES.find(st => st.id === w.status);
          const mObj = IRAB_MARKS.find(m => m.id === w.mark);
          return `<li>
            <span class="ar exp-word" lang="ar">«${arHtml(w.ar)}»</span>
            <span class="irab-badge role ar">${arHtml(rObj ? rObj.ar : w.role)}</span>
            <span class="irab-badge status ar">${arHtml(sObj ? sObj.ar : w.status)}</span>
            <span class="irab-badge mark ar">${arHtml(mObj ? mObj.ar : w.mark)}</span>
            — ${mix(w.explain || '')}
          </li>`;
        }).join('')}
      </ul>
      <div class="g2-actions" style="margin-top:14px;">
        ${isStudio ? `
          <button type="button" class="btn btn-secondary" data-act="g2-dnd-reset" data-studio="1">Opnieuw ontleden ↺</button>
          ${s.irabSentIdx + 1 < sents.length ? `
            <button type="button" class="btn btn-primary" data-act="g2-studio-next-sent">Volgende zin (${s.irabSentIdx + 2}/${sents.length}) →</button>
          ` : `
            <button type="button" class="btn btn-primary" data-act="g2-hub">Klaar · Terug naar lessen</button>
          `}
        ` : `
          <button type="button" class="btn btn-primary" data-act="g2-next" data-gl="next">${s.queue && s.queue.length > 1 ? 'Volgende vraag →' : 'Bekijk resultaat →'}</button>
        `}
      </div>
    </div>`;
  }

  return `<div class="g2-dnd-card">
    <div class="g2-dnd-sentence-bar">
      <div>
        <div class="g2-dnd-nl">"${E(sentObj.nl || '')}"</div>
        <div class="g2-dnd-Instruction">Sleep een grammaticale rol naar het juiste woord, of <b>tik op een rol</b> om het gemarkeerde vakje direct in te vullen:</div>
      </div>
      ${spk(sentObj.sentence)}
    </div>

    <div class="g2-dnd-words-row" dir="rtl">
      ${wordColsHtml}
    </div>

    ${!ps.complete ? `
      <div class="g2-dnd-tray">
        <div class="g2-dnd-tray-label">Beschikbare Grammaticale Rollen (sleep of tik):</div>
        <div class="g2-dnd-chips-wrap">
          ${roleChipsHtml}
        </div>
      </div>
    ` : ''}

    <div class="g2-dnd-actions">
      ${!ps.complete ? `
        <button type="button" class="btn btn-primary g2-dnd-check-btn" data-act="g2-dnd-check" data-studio="${isStudio ? '1' : '0'}">
          Controleer ✓
        </button>
        <button type="button" class="btn btn-secondary" data-act="g2-dnd-reset" data-studio="${isStudio ? '1' : '0'}">
          Herstel ↺
        </button>
      ` : ''}
      ${statusHtml}
    </div>

    ${explainHtml}
  </div>`;
}

function renderInteractiveParse(s, kicker, x){
  const d = x.d;
  const words = d.words || [];
  const ps = getParseSession(x.ref || d.sentence, words);
  s.irabMode = s.irabMode || 'dnd';
  const doneCount = s.total - s.queue.length;
  const prog = `<div class="g2-qprog"><span>${E(kicker)}</span><span>${Math.min(doneCount+1,s.total)} / ${s.total}</span></div><div class="g2-lbar"><i style="width:${s.total?Math.round(100*doneCount/s.total):0}%"></i></div>`;

  const modeBar = `<div class="g2-irab-mode-bar">
    <div class="g2-parse-badge" style="margin:0">${ICO.check} Zinsontleding · Iʿrāb (${arHtml('إِعْرَاب')})</div>
    <div class="g2-irab-mode-switch">
      <button type="button" class="g2-mode-btn ${s.irabMode === 'dnd' ? 'active' : ''}" data-act="g2-irab-mode" data-mode="dnd">Sleep &amp; Plaats</button>
      <button type="button" class="g2-mode-btn ${s.irabMode === 'pillars' ? 'active' : ''}" data-act="g2-irab-mode" data-mode="pillars">3-Pijlers (Diep)</button>
    </div>
  </div>`;

  if(s.irabMode === 'dnd'){
    return `<div class="g2-card g2-parse-engine">
      ${prog}
      ${modeBar}
      ${renderDndParseBlock(ps, d, words, false, s, [])}
    </div>`;
  }

  const curWord = words[ps.wi] || words[0] || {};
  const canCheck = !!(ps.selRole && ps.selStatus && ps.selMark);

  // Woord-pillen bovenaan
  const wordTabsHtml = words.map((w, idx) => {
    const isDone = !!ps.wordsDone[idx];
    const isCur = idx === ps.wi && !ps.complete;
    return `<button type="button" class="g2-parse-tab ${isCur ? 'active' : ''} ${isDone ? 'done' : ''}" data-act="g2-parse-select-w" data-wi="${idx}">
      <span class="ptab-num">${idx + 1}</span>
      <span class="ar ptab-ar" lang="ar">${arHtml(w.ar)}</span>
      ${isDone ? '<span class="ptab-chk">✓</span>' : ''}
    </button>`;
  }).join('');

  // Zin weergave met highlights
  const sentenceDisplay = words.map((w, idx) => {
    const isDone = !!ps.wordsDone[idx];
    const isCur = idx === ps.wi && !ps.complete;
    return `<span class="g2-tok-pill ${isDone ? 'done' : ''} ${isCur ? 'active' : ''}">${arHtml(w.ar)}${isDone ? '<i class="tok-chk">✓</i>' : ''}</span>`;
  }).join(' ');

  // Analyzer block
  let analyzerBody = '';
  if(!ps.complete){
    analyzerBody = `<div class="g2-parse-card">
      <div class="g2-parse-focus-head">
        <div>
          <span class="focus-label">Ontleed woord <b>${ps.wi + 1}</b> van <b>${words.length}</b></span>
          <div class="ar focus-word" lang="ar">«${arHtml(curWord.ar)}»</div>
        </div>
        ${spk(curWord.ar)}
      </div>

      <div class="g2-parse-section">
        <div class="g2-parse-sec-title">1. Grammaticale Functie (الْوَظِيفَة النَّحْوِيَّة)</div>
        <div class="g2-parse-chips">
          ${IRAB_ROLES.map(r => `
            <button type="button" class="g2-parse-chip ${ps.selRole === r.id ? 'active' : ''}" data-act="g2-parse-pick" data-cat="role" data-val="${r.id}">
              <b class="ar" lang="ar">${r.ar}</b>
              <small>${r.nl}</small>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="g2-parse-section">
        <div class="g2-parse-sec-title">2. Naamvalsstatus (الْحَالَة الْإِعْرَابِيَّة)</div>
        <div class="g2-parse-chips">
          ${IRAB_STATUSES.map(st => `
            <button type="button" class="g2-parse-chip ${ps.selStatus === st.id ? 'active' : ''}" data-act="g2-parse-pick" data-cat="status" data-val="${st.id}">
              <b class="ar" lang="ar">${st.ar}</b>
              <small>${st.nl}</small>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="g2-parse-section">
        <div class="g2-parse-sec-title">3. Klinkerteken (الْعَلَامَة / الْحَرَكَة)</div>
        <div class="g2-parse-chips">
          ${IRAB_MARKS.map(m => `
            <button type="button" class="g2-parse-chip ${ps.selMark === m.id ? 'active' : ''}" data-act="g2-parse-pick" data-cat="mark" data-val="${m.id}">
              <b class="ar" lang="ar">${m.ar}</b>
              <small>${m.nl}</small>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="g2-parse-submit">
        <button type="button" class="btn btn-primary btn-block g2-parse-check-btn" data-act="g2-parse-check-word" ${canCheck ? '' : 'disabled'}>
          ${canCheck ? `Controleer «${arHtml(curWord.ar)}» ✓` : 'Kies functie, status én klinkerteken'}
        </button>
      </div>

      ${ps.feedback ? `
        <div class="g2-parse-fb ${ps.feedback.ok ? 'ok' : 'bad'}">
          <b>${ps.feedback.ok ? 'Goed!' : 'Nog niet juist:'}</b>
          <p>${mix(ps.feedback.msg)}</p>
        </div>
      ` : ''}
    </div>`;
  } else {
    analyzerBody = `<div class="g2-parse-card g2-parse-complete-card">
      <div class="parse-complete-badge">${ICO.check} Volledige zin correct ontleed!</div>
      <h3 class="ar" lang="ar" dir="rtl">${arHtml(d.sentence)}</h3>
      <p class="g2-sub">${mix(d.nl || '')}</p>
      <div class="g2-actions" style="margin-top:16px;">
        <button class="btn btn-primary" data-act="g2-next" data-gl="next">${s.queue.length > 1 ? 'Volgende vraag →' : 'Bekijk resultaat →'}</button>
      </div>
    </div>`;
  }

  // Live I'rab Table
  const liveTable = `<div class="g2-parse-table-card">
    <div class="g2-table-header">Live Iʿrāb-tabel van de zin:</div>
    <div class="g2-table-responsive">
      <table class="g2-irab-table">
        <thead>
          <tr>
            <th>Woord</th>
            <th>1. Functie</th>
            <th>2. Status</th>
            <th>3. Harakah</th>
          </tr>
        </thead>
        <tbody>
          ${words.map((w, idx) => {
            const done = ps.wordsDone[idx];
            const isCur = idx === ps.wi && !ps.complete;
            if(done){
              const rObj = IRAB_ROLES.find(x => x.id === done.role);
              const sObj = IRAB_STATUSES.find(x => x.id === done.status);
              const mObj = IRAB_MARKS.find(x => x.id === done.mark);
              return `<tr class="irab-row-done">
                <td class="ar cell-tok" lang="ar"><b>${arHtml(w.ar)}</b></td>
                <td><span class="irab-badge role ar">${arHtml(rObj ? rObj.ar : done.role)}</span></td>
                <td><span class="irab-badge status ar">${arHtml(sObj ? sObj.ar : done.status)}</span></td>
                <td><span class="irab-badge mark ar">${arHtml(mObj ? mObj.ar : done.mark)}</span></td>
              </tr>`;
            } else if(isCur){
              return `<tr class="irab-row-cur">
                <td class="ar cell-tok active" lang="ar"><strong>${arHtml(w.ar)}</strong></td>
                <td colspan="3" class="cell-status-cur">Bezig met ontleden...</td>
              </tr>`;
            } else {
              return `<tr class="irab-row-wait">
                <td class="ar cell-tok muted" lang="ar">${arHtml(w.ar)}</td>
                <td colspan="3" class="cell-status-wait">—</td>
              </tr>`;
            }
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;

  return `<div class="g2-card g2-parse-engine">
    ${prog}
    ${modeBar}
    <div class="g2-parse-sentence-card">
      <div class="g2-parse-sentence ar" lang="ar" dir="rtl">${sentenceDisplay} ${spk(d.sentence)}</div>
      <div class="g2-parse-sub">${mix(d.nl || '')}</div>
    </div>
    <div class="g2-parse-tabs">${wordTabsHtml}</div>
    ${analyzerBody}
    ${liveTable}
  </div>`;
}

function renderIrabStudio(){
  const s = S();
  s.irabCategory = s.irabCategory || 'all';
  s.irabSentIdx = typeof s.irabSentIdx === 'number' ? s.irabSentIdx : 0;
  s.irabMode = s.irabMode || 'dnd';
  P.irabDone = P.irabDone || {};

  let sents = ALL_IRAB_SENTENCES;
  if(s.irabCategory !== 'all'){
    sents = ALL_IRAB_SENTENCES.filter(item => item.category === s.irabCategory);
  }
  if(s.irabSentIdx >= sents.length) s.irabSentIdx = 0;
  const curSent = sents[s.irabSentIdx] || ALL_IRAB_SENTENCES[0];
  const words = curSent.words || [];

  const ps = getParseSession('studio_' + curSent.id, words);
  const doneTotal = Object.keys(P.irabDone).length;
  const totalSentCount = ALL_IRAB_SENTENCES.length;
  const medinaCount = ALL_IRAB_SENTENCES.filter(x => x.category === 'medina').length;
  const canCheck = !!(ps.selRole && ps.selStatus && ps.selMark);

  // Woord-pillen
  const wordTabsHtml = words.map((w, idx) => {
    const isDone = !!ps.wordsDone[idx];
    const isCur = idx === ps.wi && !ps.complete;
    return `<button type="button" class="g2-parse-tab ${isCur ? 'active' : ''} ${isDone ? 'done' : ''}" data-act="g2-studio-select-w" data-wi="${idx}">
      <span class="ptab-num">${idx + 1}</span>
      <span class="ar ptab-ar" lang="ar">${arHtml(w.ar)}</span>
      ${isDone ? '<span class="ptab-chk">✓</span>' : ''}
    </button>`;
  }).join('');

  // Zin weergave
  const sentenceDisplay = words.map((w, idx) => {
    const isDone = !!ps.wordsDone[idx];
    const isCur = idx === ps.wi && !ps.complete;
    return `<span class="g2-tok-pill ${isDone ? 'done' : ''} ${isCur ? 'active' : ''}">${arHtml(w.ar)}${isDone ? '<i class="tok-chk">✓</i>' : ''}</span>`;
  }).join(' ');

  const curWord = words[ps.wi] || words[0] || {};

  // Analyzer block for 3-pillars mode
  let analyzerBody = '';
  if(!ps.complete){
    analyzerBody = `<div class="g2-parse-card">
      <div class="g2-parse-focus-head">
        <div>
          <span class="focus-label">Ontleed woord <b>${ps.wi + 1}</b> van <b>${words.length}</b></span>
          <div class="ar focus-word" lang="ar">«${arHtml(curWord.ar)}»</div>
        </div>
        ${spk(curWord.ar)}
      </div>

      <div class="g2-parse-section">
        <div class="g2-parse-sec-title">1. Grammaticale Functie (الْوَظِيفَة النَّحْوِيَّة)</div>
        <div class="g2-parse-chips">
          ${IRAB_ROLES.map(r => `
            <button type="button" class="g2-parse-chip ${ps.selRole === r.id ? 'active' : ''}" data-act="g2-studio-pick" data-cat="role" data-val="${r.id}">
              <b class="ar" lang="ar">${r.ar}</b>
              <small>${r.nl}</small>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="g2-parse-section">
        <div class="g2-parse-sec-title">2. Naamvalsstatus (الْحَالَة الْإِعْرَابِيَّة)</div>
        <div class="g2-parse-chips">
          ${IRAB_STATUSES.map(st => `
            <button type="button" class="g2-parse-chip ${ps.selStatus === st.id ? 'active' : ''}" data-act="g2-studio-pick" data-cat="status" data-val="${st.id}">
              <b class="ar" lang="ar">${st.ar}</b>
              <small>${st.nl}</small>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="g2-parse-section">
        <div class="g2-parse-sec-title">3. Klinkerteken (الْعَلَامَة / الْحَرَكَة)</div>
        <div class="g2-parse-chips">
          ${IRAB_MARKS.map(m => `
            <button type="button" class="g2-parse-chip ${ps.selMark === m.id ? 'active' : ''}" data-act="g2-studio-pick" data-cat="mark" data-val="${m.id}">
              <b class="ar" lang="ar">${m.ar}</b>
              <small>${m.nl}</small>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="g2-parse-submit">
        <button type="button" class="btn btn-primary btn-block g2-parse-check-btn" data-act="g2-studio-check-word" ${canCheck ? '' : 'disabled'}>
          ${canCheck ? `Controleer «${arHtml(curWord.ar)}» ✓` : 'Kies functie, status én klinkerteken'}
        </button>
      </div>

      ${ps.feedback ? `
        <div class="g2-parse-fb ${ps.feedback.ok ? 'ok' : 'bad'}">
          <b>${ps.feedback.ok ? 'Goed!' : 'Nog niet juist:'}</b>
          <p>${mix(ps.feedback.msg)}</p>
        </div>
      ` : ''}
    </div>`;
  } else {
    analyzerBody = `<div class="g2-parse-card g2-parse-complete-card">
      <div class="parse-complete-badge">${ICO.check} Zin ${s.irabSentIdx + 1} compleet ontleed!</div>
      <h3 class="ar" lang="ar" dir="rtl">${arHtml(curSent.sentence)}</h3>
      <p class="g2-sub">${mix(curSent.nl || '')}</p>
      <div class="g2-actions" style="margin-top:16px;">
        <button type="button" class="btn btn-secondary" data-act="g2-studio-reset">Opnieuw ontleden</button>
        ${s.irabSentIdx + 1 < sents.length ? `
          <button type="button" class="btn btn-primary" data-act="g2-studio-next-sent">Volgende zin (${s.irabSentIdx + 2}/${sents.length}) →</button>
        ` : `
          <button type="button" class="btn btn-primary" data-act="g2-hub">Klaar · Terug naar lessen</button>
        `}
      </div>
    </div>`;
  }

  // Live Table
  const liveTable = `<div class="g2-parse-table-card">
    <div class="g2-table-header">Live Iʿrāb-tabel van de zin:</div>
    <div class="g2-table-responsive">
      <table class="g2-irab-table">
        <thead>
          <tr>
            <th>Woord</th>
            <th>1. Functie</th>
            <th>2. Status</th>
            <th>3. Harakah</th>
          </tr>
        </thead>
        <tbody>
          ${words.map((w, idx) => {
            const done = ps.wordsDone[idx];
            const isCur = idx === ps.wi && !ps.complete;
            if(done){
              const rObj = IRAB_ROLES.find(x => x.id === done.role);
              const sObj = IRAB_STATUSES.find(x => x.id === done.status);
              const mObj = IRAB_MARKS.find(x => x.id === done.mark);
              return `<tr class="irab-row-done">
                <td class="ar cell-tok" lang="ar"><b>${arHtml(w.ar)}</b></td>
                <td><span class="irab-badge role ar">${arHtml(rObj ? rObj.ar : done.role)}</span></td>
                <td><span class="irab-badge status ar">${arHtml(sObj ? sObj.ar : done.status)}</span></td>
                <td><span class="irab-badge mark ar">${arHtml(mObj ? mObj.ar : done.mark)}</span></td>
              </tr>`;
            } else if(isCur){
              return `<tr class="irab-row-cur">
                <td class="ar cell-tok active" lang="ar"><strong>${arHtml(w.ar)}</strong></td>
                <td colspan="3" class="cell-status-cur">Bezig met ontleden...</td>
              </tr>`;
            } else {
              return `<tr class="irab-row-wait">
                <td class="ar cell-tok muted" lang="ar">${arHtml(w.ar)}</td>
                <td colspan="3" class="cell-status-wait">—</td>
              </tr>`;
            }
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;

  return `<div class="desktop-narrow g2 irab-studio-wrap">
    <div class="g2-top">
      <button class="back" data-act="g2-hub" style="margin:0"><span>←</span> Alle lessen</button>
      <span class="grow"></span>
      <span class="g2-stat-pill"><b>${doneTotal}</b> / ${totalSentCount} zinnen ontleed</span>
    </div>

    <div class="g2-head">
      <div class="g2-eyebrow">Interactieve Zinsontleder (إِعْرَاب) · Medina Boek 1 &amp; Examen</div>
      <h1>Zinsontleder · Iʿrāb Studio</h1>
      <p>Sleep de juiste grammaticale rol (Moebtada, Gabr, Moedaf, Moedaf Ilayh, Harf Djarr, Ism Madjroer, Naʿt of Badal) onder elk woord van de ${ALL_IRAB_SENTENCES.length} authentieke zinnen uit het Medina Grammaticaboek en de examens.</p>
    </div>

    <!-- Category selector tabs -->
    <div class="g2-studio-cat-tabs">
      <button type="button" class="g2-tab ${s.irabCategory === 'all' ? 'active' : ''}" data-act="g2-studio-cat" data-cat="all">Alle (${ALL_IRAB_SENTENCES.length})</button>
      <button type="button" class="g2-tab ${s.irabCategory === 'official' ? 'active' : ''}" data-act="g2-studio-cat" data-cat="official">Officieel Examen (4)</button>
      <button type="button" class="g2-tab ${s.irabCategory === 'practice' ? 'active' : ''}" data-act="g2-studio-cat" data-cat="practice">Oefenexamen (4)</button>
      <button type="button" class="g2-tab ${s.irabCategory === 'medina' ? 'active' : ''}" data-act="g2-studio-cat" data-cat="medina">Medina Boek 1 (${medinaCount})</button>
    </div>

    <!-- Sentence Stepper list -->
    <div class="g2-studio-sentence-chips">
      ${sents.map((item, idx) => {
        const isDone = !!P.irabDone[item.id];
        const isSel = idx === s.irabSentIdx;
        return `<button type="button" class="g2-studio-sent-btn ${isSel ? 'active' : ''} ${isDone ? 'done' : ''}" data-act="g2-studio-select-sent" data-si="${idx}">
          <span class="sent-num">${idx + 1}</span>
          <span class="ar sent-ar" lang="ar">${arHtml(item.sentence)}</span>
          ${isDone ? '<span class="sent-chk">✓</span>' : ''}
        </button>`;
      }).join('')}
    </div>

    <!-- Main parse engine for selected sentence -->
    <div class="g2-card g2-parse-engine">
      <div class="g2-irab-mode-bar">
        <div class="g2-parse-badge" style="margin:0">${ICO.check} ${E(curSent.categoryTitle)}</div>
        <div class="g2-irab-mode-switch">
          <button type="button" class="g2-mode-btn ${s.irabMode === 'dnd' ? 'active' : ''}" data-act="g2-irab-mode" data-mode="dnd">Sleep &amp; Plaats (Snel)</button>
          <button type="button" class="g2-mode-btn ${s.irabMode === 'pillars' ? 'active' : ''}" data-act="g2-irab-mode" data-mode="pillars">3-Pijlers (Uitgebreid)</button>
        </div>
      </div>

      ${s.irabMode === 'dnd' ? `
        ${renderDndParseBlock(ps, curSent, words, true, s, sents)}
        ${liveTable}
      ` : `
        <div class="g2-parse-sentence-card">
          <div class="g2-parse-sentence ar" lang="ar" dir="rtl">${sentenceDisplay} ${spk(curSent.sentence)}</div>
          <div class="g2-parse-sub">${mix(curSent.nl || '')}</div>
        </div>
        <div class="g2-parse-tabs">${wordTabsHtml}</div>
        ${analyzerBody}
        ${liveTable}
      `}
    </div>
  </div>`;
}

function nodes(n){
  const g=L[n]; if(!g) return [];
  const out=[];
  if(dueMistakes(n).length) out.push({k:'review', t:'Herhaling', s:'Fouten uit eerdere lessen'});
  (g.steps||[]).forEach((s,i)=>out.push({k:'step', i, t:shortTitle(s.title), s:'blz. '+(s.page||g.pages||'')}));
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
  return true;
  if(P.unlockAll) return true;
  const ns=nodes(n);
  for(let j=0;j<idx;j++){ if(ns[j].k==='review') continue; if(!nodeDone(n,ns[j])) return false; }
  return true;
}
function lessonPassed(n){ const p=lp(n); return !!(p.test&&p.test.passed) || (!testPool(n).length && nodes(n).every(nd=>nodeDone(n,nd))); }
function lessonOpen(n){
  return true;
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
  if(d.type==='parse') return (Array.isArray(d.words)&&d.words.length>=1) || (Array.isArray(d.options)&&d.options.length>=2);
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
  clearG2AutoTimer();
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
  if(x && x.d.type!=='order' && Array.isArray(x.d.options)) s.optOrder=x.d.options.map((_,i)=>i);
}

/* ---------- renderers ---------- */
function renderLessonNavBar(n){
  const s = S();
  if(s.view !== 'node') return '';
  const ns = nodes(n);
  return `<nav class="g2-lnav" aria-label="Onderdelen van deze les">
    <button type="button" class="g2-lnav-pill ${s.view==='map'?'on':''}" data-act="g2-map">Overzicht</button>
    ${ns.map((nd, idx) => {
      const isCur = s.view === 'node' && s.node === idx;
      const isDone = nodeDone(n, nd);
      const shortLbl = nd.k === 'step' ? `Regel ${nd.i + 1}` : (nd.k === 'vocab' ? 'Woorden' : nd.k === 'book' ? 'Boekoef.' : nd.k === 'test' ? 'Eindtoets' : 'Herhaling');
      return `<button type="button" class="g2-lnav-pill ${isCur?'on':''} ${isDone?'done':''}" data-act="g2-node" data-i="${idx}" title="${E(nd.t)}">
        ${isDone && !isCur ? '<span class="lnav-chk">✓</span>' : ''}${E(shortLbl)}
      </button>`;
    }).join('')}
  </nav>`;
}

function head(n, sub){
  const g=L[n]||{};
  const s=S();
  const isNode = (s.n === Number(n) && s.view === 'node');
  const isDrillMode = isNode && (s.kind === 'book' || s.kind === 'test' || s.kind === 'review' || (s.kind === 'step' && s.phase === 'do'));
  const autoOn = P.autoAdvance !== false;
  const sfxOn = P.sfx !== false;
  const irabOn = !!P.inlineIrab;
  const i0 = KEYS.indexOf(Number(n));
  const prevL = i0 > 0 ? KEYS[i0 - 1] : undefined;
  const nextL = i0 >= 0 && i0 + 1 < KEYS.length ? KEYS[i0 + 1] : undefined;

  return `<div class="g2-top">
    ${isNode
      ? `<button type="button" class="back" data-act="g2-map" style="margin:0"><span>←</span> ${n===0?'Inleiding':'Les '+n}</button>
         <button type="button" class="g2-crumb-btn" data-act="g2-hub">Alle lessen</button>`
      : `<button type="button" class="back" data-act="g2-hub" style="margin:0"><span>←</span> Alle lessen</button>
         <div class="g2-prevnext-les">
           ${prevL!==undefined ? `<button type="button" class="g2-crumb-btn" data-act="g2-open" data-l="${prevL}">‹ ${prevL===0?'Inl.':'Les '+prevL}</button>` : ''}
           ${nextL!==undefined ? `<button type="button" class="g2-crumb-btn" data-act="g2-open" data-l="${nextL}">${nextL===24?'Reader 8':'Les '+nextL} ›</button>` : ''}
         </div>`
    }
    <span class="grow"></span>
    <button type="button" class="g2-pill-btn ${irabOn?'active':''}" data-act="g2-toggle-irab" title="Toon automatisch zinsontleding (Moebtada / Gabr) bij oefeningen">
      ${irabOn?'Ontleden: aan':'Ontleden: uit'}
    </button>
    <button type="button" class="g2-pill-btn ${autoOn?'active':''}" data-act="g2-toggle-auto" title="${autoOn?'Auto-doorgaan is actief — klik om handmatig te maken':'Auto-doorgaan staat uit — klik om aan te zetten'}">
      ${autoOn?'Auto: aan':'Auto: uit'}
    </button>
    <button type="button" class="g2-pill-btn ${sfxOn?'active':''}" data-act="g2-toggle-sfx" title="${sfxOn?'Geluidseffect staat aan — klik om te dempen':'Geluidseffect is gedempt — klik om aan te zetten'}">
      ${sfxOn?'Geluid: aan':'Geluid: uit'}
    </button>
  </div>
  <div class="g2-head ${isDrillMode?'g2-head-compact':''}">
    ${isDrillMode ? '' : `<div class="g2-head-row">
      <div>
        <div class="g2-eyebrow">${n===24?'Madinah Arabic Reader 8':'Medina Deel 1'} · ${n===0?'Inleiding':'Les '+n} · blz. ${E(g.pages||'')}</div>
        <h1>${E(SHORT_TITLES[n]||shortTitle(g.title||''))}</h1>
      </div>
      ${g.titleAr?`<div class="g2-titlear ar" lang="ar">${arHtml(g.titleAr)}</div>`:''}
    </div>
    ${sub||''}`}
    ${renderLessonNavBar(n)}
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
  { id: 'p8', name: 'Madinah Reader 8', lessons: [24], desc: 'الْمَفْعُولُ فِيهِ · لَوْ الشَّرْطِيَّةُ · قَبْلُ' },
  { id: 'p9', name: 'Toepassing', lessons: [11, 21], desc: 'فِيهِ · فِيهَا · مَدْرَسَتِي' }
];

function pillarPct(p){
  const sum = p.lessons.reduce((acc, n) => acc + lessonPct(n), 0);
  return Math.round(sum / p.lessons.length);
}

const SHORT_TITLES = {
  0: "Klinkertekens & Symbolen",
  1: "Nominale Zin & Aanwijzer هَذَا",
  2: "Aanwijzer ذَلِكَ & Voegwoord وَ",
  3: "Lidwoord الْ & Zonneletters",
  4: "Voorzetsels (حُرُوفُ الْجَرِّ)",
  5: "De Bezitsconstructie (Idāfah)",
  6: "Vrouwelijk (هَذِهِ & Taa' Marboetah)",
  7: "Aanwijzer تِلْكَ & Na't",
  8: "Aanwijzer met Bepaling (Badal)",
  9: "Bijvoeglijk Naamwoord (النَّعْت)",
  10: "Bezittelijke Voornaamwoorden",
  11: "In het Huis (فِيهِ / فِيهَا)",
  12: "Vrouwelijk Aanspreken (أَنْتِ)",
  13: "Het Meervoud (الْجَمْعُ)",
  14: "Meervoud Aanspreken (أَنْتُمْ)",
  15: "Vrouwelijk Meervoud (أَنْتُنَّ)",
  16: "Niet-menselijk Meervoud",
  17: "Toepassing Meervouden",
  18: "Het Tweevoud (الْمُثَنَّى)",
  19: "Getallen 3–10 (Mannelijk)",
  20: "Getallen 3–10 (Vrouwelijk)",
  21: "Mijn School (مَدْرَسَتِي)",
  22: "Diptoten (الْمَمْنُوعُ مِنَ الصَّرْفِ)",
  23: "Diptoten in de Genitief",
  24: "Bijwoorden van Tijd & Plaats"
};

function renderHub(){
  const s=S();
  if(s.view === 'irab_studio') return renderIrabStudio();
  const validPillars = PILLARS.map(p=>p.id);
  if(s.hubFilter!=='busy' && s.hubFilter!=='done' && !validPillars.includes(s.hubFilter)) s.hubFilter = 'all';
  s.hubSearch = s.hubSearch || '';

  const done=KEYS.filter(lessonPassed).length;
  const pct=KEYS.length?Math.round(100*done/KEYS.length):0;
  let nextN=KEYS.find(n=>!lessonPassed(n)); if(nextN===undefined) nextN=KEYS[KEYS.length-1];

  let filteredKeys = KEYS;
  if(s.hubFilter === 'done') filteredKeys = filteredKeys.filter(n => lessonPassed(n));
  else if(s.hubFilter === 'busy') filteredKeys = filteredKeys.filter(n => !lessonPassed(n));
  else if(validPillars.includes(s.hubFilter)){
    const plObj = PILLARS.find(p => p.id === s.hubFilter);
    if(plObj) filteredKeys = filteredKeys.filter(n => plObj.lessons.includes(n));
  }
  if(s.hubSearch){
    const q = s.hubSearch.toLowerCase().trim();
    filteredKeys = filteredKeys.filter(n => {
      const g = L[n] || {};
      const title = (SHORT_TITLES[n] || g.title || '').toLowerCase();
      const sum = (g.summary || '').toLowerCase();
      return title.includes(q) || sum.includes(q) || String(n) === q;
    });
  }

  const item = n => {
    const g=L[n], passed=lessonPassed(n), p=lessonPct(n);
    const cls=passed?'done':p>0?'busy':'new';
    const lbl=passed?'Afgerond':n===nextN?'Aanbevolen':p>0?p+'%':'Nieuw';
    const cleanTitle = SHORT_TITLES[n] || g.title || '';
    const stepCt = (g.steps||[]).length;
    const vocCt = (g.vocab||[]).length;
    return `<button type="button" class="g2-lesson ${cls} ${n===nextN&&!passed?'next':''}" data-act="g2-open" data-l="${n}">
      <span class="g2-num">${passed?ICO.check:String(n).padStart(2,'0')}</span>
      <span class="g2-lbody">
        <span class="g2-lmeta">${n===0?'Inleiding':n===24?'Reader 8':'Les '+n} · blz. ${E(g.pages||'')} · ${stepCt} ${stepCt===1?'regel':'regels'}${vocCt?' · '+vocCt+' woorden':''} · <b>${lbl}</b></span>
        <span class="g2-ltitle-row">
          <span class="g2-ltitle">${E(cleanTitle)}</span>
          ${g.titleAr?`<span class="g2-lar-badge ar" lang="ar">${arHtml(g.titleAr)}</span>`:''}
        </span>
        <span class="g2-lbar"><i style="width:${p}%"></i></span>
      </span>
      <span class="g2-nchev">›</span>
    </button>`;
  };

  const groups = PILLARS.map(pl=>{
    const ks = filteredKeys.filter(n=>pl.lessons.includes(n));
    if(!ks.length) return '';
    return `<section class="g2-group">
      <div class="g2-group-head">
        <div><h3>${E(pl.name)}</h3><span class="g2-group-desc ar" lang="ar">${E(pl.desc)}</span></div>
        <span class="g2-group-pct">${pillarPct(pl)}%</span>
      </div>
      <div class="g2-list">${ks.map(item).join('')}</div>
    </section>`;
  }).join('');

  const refSheet = `<details class="g2-ref-sheet" ${s.hubRefOpen?'open':''}>
    <summary class="g2-ref-summary" data-act="g2-toggle-ref">
      <div>
        <span class="g2-kicker" style="margin:0">Altijd bij de hand · Spiekkaart</span>
        <strong>De 6 Grammatica-Kernregels (Moebtada, Gabr, Idāfah, Voorzetsels, Naʿt &amp; Diptoot)</strong>
      </div>
      <span class="g2-ref-toggle-lbl">Overzicht tonen / sluiten ▾</span>
    </summary>
    <div class="g2-ref-grid">
      <div class="g2-ref-card rc-mubtada">
        <div class="g2-ref-top"><span class="ar" lang="ar">١. الْمُبْتَدَأ</span><b>Moebtada (Onderwerp)</b></div>
        <p>Het naamwoord waarmee een nominale zin begint. Is vrijwel altijd <b>bepaald</b> en staat in <b>Marfūʿ (-u)</b>.</p>
        <div class="g2-ref-ex"><span class="ar" lang="ar"><b>الْبَيْتُ</b> كَبِيرٌ</span><small>Het huis is groot</small></div>
      </div>
      <div class="g2-ref-card rc-khabar">
        <div class="g2-ref-top"><span class="ar" lang="ar">٢. الْخَبَر</span><b>Gabr / Khabar (Gezegde)</b></div>
        <p>Vertelt iets over de Moebtada (wat het onderwerp is). Is meestal <b>onbepaald</b> en staat in <b>Marfūʿ (-un)</b>.</p>
        <div class="g2-ref-ex"><span class="ar" lang="ar">الْبَيْتُ <b>كَبِيرٌ</b></span><small>krijgt tanwīn dammah (-un)</small></div>
      </div>
      <div class="g2-ref-card rc-idafah">
        <div class="g2-ref-top"><span class="ar" lang="ar">٣. الْإِضَافَة</span><b>Moedaf &amp; Moedaf Ilayh (Bezit)</b></div>
        <p>1e woord (<b>Moedaf</b>): géén <span class="ar" lang="ar">الْ</span> en géén tanwīn. 2e woord (<b>Moedaf Ilayh</b>): altijd <b>Majrūr (-i / -in)</b>.</p>
        <div class="g2-ref-ex"><span class="ar" lang="ar"><b>كِتَابُ</b> <b>الْمُدَرِّسِ</b></span><small>het boek van de leraar</small></div>
      </div>
      <div class="g2-ref-card rc-jarr">
        <div class="g2-ref-top"><span class="ar" lang="ar">٤. حَرْفُ جَرٍّ</span><b>Voorzetsel + Ism Majrūr</b></div>
        <p>Na voorzetsels (<span class="ar" lang="ar">فِي، عَلَى، مِنْ، إِلَى</span>) eindigt het woord erachter altijd op een <b>Kasrah (-i)</b>.</p>
        <div class="g2-ref-ex"><span class="ar" lang="ar">فِي <b>الْمَسْجِدِ</b></span><small>in de moskee (-i)</small></div>
      </div>
      <div class="g2-ref-card rc-naat">
        <div class="g2-ref-top"><span class="ar" lang="ar">٥. النَّعْت وَالْمَنْعُوت</span><b>Bijvoeglijk Naamwoord</b></div>
        <p>Het bijvoeglijk naamwoord (<b>Naʿt</b>) komt ná het zelfstandig naamwoord en volgt het in lidwoord, geslacht, getal én naamval.</p>
        <div class="g2-ref-ex"><span class="ar" lang="ar">بَيْتٌ <b>جَدِيدٌ</b> · الْبَيْتُ <b>الْجَدِيدُ</b></span><small>volgt in alles</small></div>
      </div>
      <div class="g2-ref-card rc-other">
        <div class="g2-ref-top"><span class="ar" lang="ar">٦. الْمَمْنُوعُ مِنَ الصَّرْفِ</span><b>Diptoot (Zonder Tanwīn)</b></div>
        <p>Bepaalde namen en meervouden krijgen <b>nooit tanwīn</b> en krijgen in de genitief een <b>Fathah (-a)</b> i.p.v. kasrah.</p>
        <div class="g2-ref-ex"><span class="ar" lang="ar">مِنْ <b>مَكَّةَ</b> · فِي <b>مَسَاجِدَ</b></span><small>fathah (-a) na voorzetsel</small></div>
      </div>
    </div>
  </details>`;

  return `<div class="desktop-page g2">
    <div class="g2-hero">
      <div>
        <div class="g2-eyebrow">Grammatica · leerpad</div>
        <h1>Medina Deel 1 + Reader 8</h1>
        <p>Per les: <b>1. Leer de regel</b>, <b>2. Bekijk &amp; ontleed voorbeelden</b>, <b>3. Oefen direct</b>, maak de <b>boekoefeningen</b> en sluit af met een <b>eindtoets</b>.</p>
      </div>
      <div class="g2-hero-stat"><b>${done}</b><span>/ ${KEYS.length} lessen afgerond</span><div class="g2-lbar"><i style="width:${pct}%"></i></div></div>
    </div>
    <div class="g2-cta-row">
      ${nextN!==undefined?`<button type="button" class="g2-cta primary" data-act="g2-open" data-l="${nextN}"><span>Ga verder</span><b>${nextN===0?'Inleiding':'Les '+nextN} · ${E(SHORT_TITLES[nextN] || L[nextN].title)}</b></button>`:''}
      <button type="button" class="g2-cta irab" data-act="g2-open-irab"><span>Interactief · MVP</span><b>Zinsontleder · Iʿrāb Studio</b></button>
      <button type="button" class="g2-cta" data-act="nav" data-v="exam"><span>Examen</span><b>Al-Manarah · Les 1 t/m 7 (100 pt)</b></button>
    </div>
    ${refSheet}
    <div class="g2-hub-toolbar">
      <div class="g2-hub-tabs">
        <button type="button" class="g2-tab ${s.hubFilter==='all'?'active':''}" data-act="g2-hub-filter" data-f="all">Alle (${KEYS.length})</button>
        <button type="button" class="g2-tab ${s.hubFilter==='busy'?'active':''}" data-act="g2-hub-filter" data-f="busy">Nog te doen (${KEYS.length-done})</button>
        <button type="button" class="g2-tab ${s.hubFilter==='done'?'active':''}" data-act="g2-hub-filter" data-f="done">Afgerond (${done})</button>
      </div>
      <div class="g2-hub-search-wrap">
        <input type="search" class="g2-search-input" placeholder="Zoek op les of onderwerp (bv. idafah, meervoud)..." value="${E(s.hubSearch||'')}" data-act="g2-hub-search">
        ${s.hubSearch ? `<button type="button" class="g2-search-clear" data-act="g2-hub-clear-search">×</button>` : ''}
      </div>
    </div>
    <div class="g2-pillar-bar">
      ${PILLARS.map(pl => `<button type="button" class="g2-pillar-chip ${s.hubFilter===pl.id?'active':''}" data-act="g2-pillar" data-pid="${pl.id}">${E(pl.name)} <small>(${pl.lessons.length})</small></button>`).join('')}
    </div>
    ${groups || `<div class="g2-empty-state"><p>Geen lessen gevonden voor deze selectie.</p><button type="button" class="btn btn-secondary btn-sm" data-act="g2-hub-reset">Toon alle lessen</button></div>`}
  </div>`;
}

function renderLessonMap(n){
  const g=L[n]||{};
  const ns=nodes(n);
  const real=ns.map((nd,i)=>({nd,i})).filter(x=>x.nd.k!=='review');
  const doneCt=real.filter(x=>nodeDone(n,x.nd)).length;
  const rec=real.find(x=>!nodeDone(n,x.nd));
  const passed=lessonPassed(n);
  const i0=KEYS.indexOf(n), nx=KEYS[i0+1];
  const p=lp(n);

  const row=x=>{
    const {nd,i}=x; const done=nodeDone(n,nd); const isRec=rec&&rec.i===i;
    const dot=done?ICO.check:(nd.k==='step'?nd.i+1:nd.k==='book'?ICO.book:nd.k==='test'?'T':nd.k==='vocab'?'W':'H');
    return `<button type="button" class="g2-node ${done?'done':''} ${isRec?'rec':''} k-${nd.k}" data-act="g2-node" data-i="${i}">
      <span class="g2-dot">${dot}</span>
      <span class="g2-ntext"><b>${E(nd.t)}</b><small>${E(nd.s)}${isRec?' · aanbevolen':''}</small></span>
      <span class="g2-nchev">›</span>
    </button>`;
  };
  const section=(title,sub,list)=>list.length?`<section class="g2-msec"><div class="g2-msec-head"><h3>${title}</h3><span>${sub}</span></div><div class="g2-path">${list.map(row).join('')}</div></section>`:'';

  const review=ns.map((nd,i)=>({nd,i})).filter(x=>x.nd.k==='review');
  const steps=real.filter(x=>x.nd.k==='step');
  const practice=real.filter(x=>x.nd.k==='vocab'||x.nd.k==='book');
  const test=real.filter(x=>x.nd.k==='test');
  const stepsDone=steps.filter(x=>nodeDone(n,x.nd)).length;

  const pctAll=lessonPct(n);
  const summary=`<div class="g2-lsum">
    <div class="g2-lsum-top"><div><b>${doneCt}</b> van <b>${real.length}</b> onderdelen klaar</div><span>${pctAll}%</span></div>
    <div class="g2-lbar big"><i style="width:${pctAll}%"></i></div>
    ${passed
      ? `<div class="g2-success-banner">${ICO.check} <div><b>Les afgerond.</b> Je beheerst deze les.</div>${nx!==undefined?`<button class="btn btn-primary btn-sm" data-act="g2-open" data-l="${nx}">Volgende les →</button>`:''}</div>`
      : rec ? `<button type="button" class="g2-cta primary" data-act="g2-node" data-i="${rec.i}"><span>${doneCt?'Ga verder':'Start deze les'}</span><b>${E(rec.nd.t)}</b></button>` : ''}
    ${p.test?`<div class="g2-note">Beste score eindtoets: <b>${Math.round(100*p.test.best)}%</b>${p.test.passed?' · gehaald':' · 80% nodig'}</div>`:''}
    ${typeof wordsFor==='function'&&wordsFor(n).length?`<button class="btn btn-secondary btn-sm" data-act="start-learn" data-l="${n}">Woorden van deze les oefenen</button>`:''}
  </div>`;

  return `<div class="desktop-page g2">
    ${head(n)}
    ${summary}
    ${section('Herhaling','fouten uit eerdere lessen',review)}
    ${section('1 · Leerstof',`${stepsDone} van ${steps.length} regels`,steps)}
    ${section('2 · Oefenen','woorden en boekoefeningen',practice)}
    ${section('3 · Eindtoets','80% nodig',test)}
    ${passed&&nx!==undefined?`<div style="text-align:center;margin-top:20px"><button class="btn btn-primary" data-act="g2-open" data-l="${nx}">Door naar les ${nx} →</button></div>`:''}
  </div>`;
}

function renderTable(t){
  if(!t||!t.rows||!t.rows.length) return '';
  const th=(t.headers||[]).map(h=>`<th>${mix(h)}</th>`).join('');
  const tr=t.rows.map(r=>'<tr>'+r.map(c=>{
    const s=String(c??'');
    const speakBtn = isSpeakable(s) ? spk(s) : '';
    return isAr(s)
      ? `<td class="ar-cell"><div class="g2-cell-wrap"><span class="ar" lang="ar" dir="rtl">${arHtml(s)}</span>${speakBtn}</div></td>`
      : `<td>${mix(s)}</td>`;
  }).join('')+'</tr>').join('');
  return `<div class="g2-table-wrap"><table class="g2-table">${th?`<thead><tr>${th}</tr></thead>`:''}<tbody>${tr}</tbody></table></div>`;
}

function renderExamples(list, hideNl, prefixKey){
  return `<div class="g2-ex">${list.map((e,i)=>{
    const itemKey = prefixKey ? `${prefixKey}_${i}` : '';
    const parsed = prefixKey ? analyzeArabicSentence(e.ar) : null;
    const st = parsed ? getInlineIrabSession(itemKey, 'view') : null;
    const isOpen = !!(st && st.open);
    return `<div class="g2-exitem ${isOpen?'irab-open':''}">
      <div class="g2-exrow">
        <div class="g2-ex-main">
          ${spk(e.ar)}
          <span class="g2-exar ar" lang="ar" dir="rtl">${arHtml(e.ar)}</span>
        </div>
        <div class="g2-ex-sub">
          <span class="g2-exnl ${hideNl?'hid':''}" ${hideNl?`data-act="g2-reveal" data-i="${i}"`:''}>${hideNl?'Tik om vertaling te tonen':mix(e.nl||'')}</span>
          ${parsed ? `<button type="button" class="g2-irab-btn ${isOpen?'active':''}" data-act="iirab-toggle" data-key="${E(itemKey)}" data-sent="${E(e.ar)}" title="Zinsontleding (Moebtada / Gabr)"><span class="ar" lang="ar">إعراب</span> <span>${isOpen?'Sluit':'Ontleed'}</span></button>` : ''}
        </div>
      </div>
      ${isOpen ? renderInlineIrab(e.ar, itemKey, st.mode) : ''}
    </div>`;
  }).join('')}</div>`;
}

function phaseBar(s, st){
  const hasEx = st && Array.isArray(st.examples) && st.examples.length > 0;
  const drillCt = stepDrills(s.n, s.si).length;
  const ph = hasEx ? ['rule','see','do'] : ['rule','do'];
  const lbl = {
    rule: '1 · Uitleg & Regel',
    see: `2 · Voorbeelden (${(st.examples||[]).length})`,
    do: `${hasEx?'3':'2'} · Oefenen (${drillCt})`
  };
  const cur = ph.indexOf(s.phase);
  return `<div class="g2-phases" style="grid-template-columns:repeat(${ph.length},1fr)">${ph.map((p,i)=>`<button type="button" class="g2-phase-btn ${i===cur?'on':i<cur?'done':''}" data-act="g2-phase" data-p="${p}">${lbl[p]}</button>`).join('')}</div>`;
}

function renderStructuredRuleText(st, n, si){
  let rawList = Array.isArray(st.text) ? st.text.slice() : [];
  if(Number(n) === 1 && si === 0 && rawList.length <= 1){
    rawList = [
      'In deze eerste les leer je korte Arabische nominale zinnen maken met het aanwijzend voornaamwoord «هٰذَا» (dit / deze) voor mannelijk enkelvoud dichtbij.',
      '1. «هٰذَا بَيْتٌ» (Dit is een huis): «هٰذَا» is het onderwerp (مُبْتَدَأ · Moebtada) en «بَيْتٌ» is het gezegde (خَبَر · Gabr/Khabar) met tanwīn dammah (-un).',
      '2. «مَا هٰذَا؟» (Wat is dit?): gebruik «مَا» om te vragen naar dingen of voorwerpen.',
      '3. «مَنْ هٰذَا؟» (Wie is dit?): gebruik «مَنْ» om te vragen naar personen.',
      '4. «أَهٰذَا بَيْتٌ؟» (Is dit een huis?): zet «أَ» vóór de zin om er een ja/nee-vraag van te maken. Antwoord met «نَعَمْ» (ja) of «لَا» (nee).'
    ];
  }

  const blocks = [];
  let leadUsed = false;
  let curSteps = [];
  let curBullets = [];

  const flushSteps = () => {
    if(curSteps.length){
      blocks.push(`<div class="g2-rule-steps">${curSteps.join('')}</div>`);
      curSteps = [];
    }
  };
  const flushBullets = () => {
    if(curBullets.length){
      blocks.push(`<div class="g2-rule-bullets">${curBullets.join('')}</div>`);
      curBullets = [];
    }
  };

  for(const raw of rawList){
    const p = String(raw || '').trim();
    if(!p) continue;
    if(/^(?:Merk op|Voorbeeld|Voorbeelden|In deze les leren we het volgende)\s*:?\s*$/i.test(p)) continue;

    if(isAr(p)){
      flushSteps(); flushBullets();
      blocks.push(`<div class="g2-arp ar" lang="ar" dir="rtl">${arHtml(p)} ${spk(p)}</div>`);
      continue;
    }

    const numMatch = p.match(/^(\d+)[.)]\s+([\s\S]+)$/);
    if(numMatch){
      flushBullets();
      curSteps.push(`<div class="g2-rule-step">
        <span class="g2-rstep-num">${E(numMatch[1])}</span>
        <div class="g2-rstep-body">${mix(numMatch[2])}</div>
      </div>`);
      continue;
    }

    const bulMatch = p.match(/^[•\-]\s*([\s\S]+)$/);
    if(bulMatch){
      flushSteps();
      curBullets.push(`<div class="g2-rule-bullet">
        <span class="g2-rbul-dot">◆</span>
        <div class="g2-rbul-body">${mix(bulMatch[1])}</div>
      </div>`);
      continue;
    }

    flushSteps(); flushBullets();

    if(/^(?:Voetnoot|Belangrijke regel|Let goed op|Let op)/i.test(p) || p.includes('NOOIT')){
      blocks.push(`<div class="g2-rule-callout">
        <span class="g2-callout-tag">Let op · Kernregel</span>
        <div class="g2-callout-body">${mix(p)}</div>
      </div>`);
      continue;
    }

    if(!leadUsed){
      leadUsed = true;
      blocks.push(`<div class="g2-rule-lead">${mix(p)}</div>`);
    } else {
      blocks.push(`<p class="g2-rule-p">${mix(p)}</p>`);
    }
  }
  flushSteps();
  flushBullets();
  return `<div class="g2-rule-content">${blocks.join('')}</div>`;
}

function renderStep(n){
  const s=S(), st=L[n].steps[s.si];
  const nTot=L[n].steps.length;
  const ex = st.examples || [];
  const drillCt = stepDrills(n, s.si).length;
  let body='';
  if(s.phase==='rule'){
    const showInlineEx = ex.length > 0;
    const previewEx = (st.table && ex.length > 3) ? ex.slice(0, 3) : ex;
    const hasMoreEx = ex.length > previewEx.length;
    const prefixKey = `rex_${n}_${s.si}`;
    body=`<div class="g2-card">
      <div class="g2-kicker">Regel ${s.si+1} van ${nTot} · blz. ${E(st.page||'')}</div>
      <h2>${E(shortTitle(st.title))}</h2>
      ${renderStructuredRuleText(st, n, s.si)}
      ${renderTable(st.table)}
      ${showInlineEx ? `<div class="g2-rule-ex-preview">
        <div class="g2-rule-ex-head">
          <div>
            <span class="g2-kicker" style="margin:0">Directe toepassing in zinnen</span>
            <h4>Voorbeelden bij deze regel ${hasMoreEx ? `(${previewEx.length} van ${ex.length})` : `(${ex.length})`}</h4>
          </div>
          ${hasMoreEx ? `<button type="button" class="btn btn-secondary btn-sm" data-act="g2-phase" data-p="see">Alle ${ex.length} voorbeelden →</button>` : ''}
        </div>
        ${renderExamples(previewEx, false, prefixKey)}
      </div>` : ''}
      <div class="g2-actions">
        ${ex.length ? `<button type="button" class="btn btn-secondary" data-act="g2-phase" data-p="see">Voorbeelden &amp; Zinsontleding (${ex.length})</button>` : ''}
        <button type="button" class="btn btn-primary" data-act="g2-phase" data-p="${drillCt?'do':(ex.length?'see':'do')}" data-gl="next">${drillCt?`Oefen deze regel (${drillCt} vragen) →`:(ex.length?'Bekijk voorbeelden →':'Stap afronden →')}</button>
      </div>
    </div>`;
  }else if(s.phase==='see'){
    const prefixKey = `ex_${n}_${s.si}`;
    const hasParseableEx = ex.some(e => !!analyzeArabicSentence(e.ar));
    body=`<div class="g2-card">
      <div class="g2-kicker">Voorbeelden &amp; Leesoefening · blz. ${E(st.page||'')}</div>
      <h2>${E(shortTitle(st.title))}</h2>
      <p class="g2-hint">Lees hardop, luister en ontleed de zinnen zoals in de les (Moebtada, Gabr/Khabar, Moedaf, Voorzetsel).</p>
      <div class="g2-tools">
        <button type="button" class="btn ${s.hideNl?'btn-primary':'btn-secondary'} btn-sm" data-act="g2-hide">${s.hideNl?'Toon vertalingen':'Verberg vertalingen'}</button>
        ${hasParseableEx ? `
          <button type="button" class="btn ${s.exIrabMode==='view'?'btn-primary':'btn-secondary'} btn-sm" data-act="g2-ex-irab-all" data-prefix="${E(prefixKey)}" data-mode="view"><span class="ar" lang="ar">إعراب</span> · ${s.exIrabMode==='view'?'Verberg ontledingen':'Toon alle ontledingen'}</button>
          <button type="button" class="btn ${s.exIrabMode==='quiz'?'btn-primary':'btn-secondary'} btn-sm" data-act="g2-ex-irab-all" data-prefix="${E(prefixKey)}" data-mode="quiz">Zelf ontleden (Oefenmodus)</button>
        ` : ''}
      </div>
      ${renderExamples(ex, s.hideNl, prefixKey)}
      <div class="g2-actions">
        <button class="btn btn-secondary" data-act="g2-phase" data-p="rule">← Terug naar uitleg</button>
        <button class="btn btn-primary" data-act="g2-phase" data-p="do" data-gl="next">${drillCt?`Oefen deze regel (${drillCt}) →`:'Stap afronden →'}</button>
      </div>
    </div>`;
  }else{
    body = s.queue.length ? renderDrill(s, `Toepassen · regel ${s.si+1}`) : `<div class="g2-card g2-center">
      <div class="g2-kicker">Regel ${s.si+1} beheerst</div>
      <h2>${E(shortTitle(st.title))}</h2>
      <div class="g2-actions"><button class="btn btn-primary" data-act="g2-finish" data-gl="next">Verder in de les →</button></div>
    </div>`;
  }
  return `<div class="desktop-narrow g2">
    ${head(n)}
    ${phaseBar(s, st)}
    ${body}
  </div>`;
}

const HARAKAH_MAP = {
  '\u064F': { sym: 'ـُ', name: 'Dammah (-u)', arName: 'ضَمَّة', hint: '1 dammah · zonder tanwīn' },
  '\u064C': { sym: 'ـٌ', name: 'Tanwīn dammah (-un)', arName: 'تَنْوِين ضَمّ', hint: '2 dammah\'s · onbepaald' },
  '\u0650': { sym: 'ـِ', name: 'Kasrah (-i)', arName: 'كَسْرَة', hint: '1 kasrah · genitief (majrūr)' },
  '\u064D': { sym: 'ـٍ', name: 'Tanwīn kasrah (-in)', arName: 'تَنْوِين كَسْر', hint: '2 kasrah\'s · onbepaald genitief' },
  '\u064E': { sym: 'ـَ', name: 'Fathah (-a)', arName: 'فَتْحَة', hint: '1 fathah' },
  '\u064B': { sym: 'ـً', name: 'Tanwīn fathah (-an)', arName: 'تَنْوِين فَتْح', hint: '2 fathah\'s · onbepaald' },
  '\u0652': { sym: 'ـْ', name: 'Sukūn', arName: 'سُكُون', hint: 'rustteken (geen klinker)' },
  '\u0651\u064E': { sym: 'ـَّ', name: 'Shaddah + Fathah (-a)', arName: 'شَدَّة وَفَتْحَة', hint: 'verdubbeling met -a' },
  '\u064E\u0651': { sym: 'ـَّ', name: 'Shaddah + Fathah (-a)', arName: 'شَدَّة وَفَتْحَة', hint: 'verdubbeling met -a' },
  '\u0651\u064F': { sym: 'ـُّ', name: 'Shaddah + Dammah (-u)', arName: 'شَدَّة وَضَمَّة', hint: 'verdubbeling met -u' },
  '\u064F\u0651': { sym: 'ـُّ', name: 'Shaddah + Dammah (-u)', arName: 'شَدَّة وَضَمَّة', hint: 'verdubbeling met -u' },
  '\u0651\u0650': { sym: 'ـِّ', name: 'Shaddah + Kasrah (-i)', arName: 'شَدَّة وَكَسْرَة', hint: 'verdubbeling met -i' },
  '\u0650\u0651': { sym: 'ـِّ', name: 'Shaddah + Kasrah (-i)', arName: 'شَدَّة وَكَسْرَة', hint: 'verdubbeling met -i' }
};

function isHarakahOnly(str){
  const s = String(str || '').trim();
  return s.length > 0 && /^[\u0640\u064B-\u0652\s\/]+$/.test(s);
}

function getHarakahItem(rawPart){
  const clean = String(rawPart || '').replace(/[\u0640\s]/g, '');
  return HARAKAH_MAP[clean] || { sym: 'ـ' + clean, name: clean, arName: '', hint: 'klinkerteken' };
}

function formatHarakahOption(o){
  const parts = String(o || '').split('/').map(x => x.trim()).filter(Boolean);
  if(parts.length === 1){
    const info = getHarakahItem(parts[0]);
    return `<span class="g2-harakah-opt">
      <span class="g2-harakah-sym ar" lang="ar">${arHtml(info.sym)}</span>
      <span class="g2-harakah-lbl">
        <b>${E(info.name)} ${info.arName ? `<span class="ar" lang="ar">· ${arHtml(info.arName)}</span>` : ''}</b>
        <small>${E(info.hint)}</small>
      </span>
    </span>`;
  }
  const items = parts.map(getHarakahItem);
  const symStr = items.map(it => it.sym).join(' / ');
  const nameStr = items.map((it, idx) => `${idx + 1}e woord: ${it.name}`).join(' · ');
  const subStr = items.map(it => it.arName || it.hint).join(' + ');
  return `<span class="g2-harakah-opt">
    <span class="g2-harakah-sym pair ar" lang="ar" dir="rtl">${arHtml(symStr)}</span>
    <span class="g2-harakah-lbl">
      <b>${E(nameStr)}</b>
      <small>${E(subStr)}</small>
    </span>
  </span>`;
}

function formatHarakahInline(o){
  const parts = String(o || '').split('/').map(x => x.trim()).filter(Boolean);
  const items = parts.map(getHarakahItem);
  return items.map(it => `<span class="ar" lang="ar">${arHtml(it.sym)}</span> (${E(it.name)})`).join(' / ');
}

function renderCheatSheetBox(s){
  const g = L[s.n];
  if(!g) return '';
  if(s.kind === 'step' && g.steps && g.steps[s.si]){
    const st = g.steps[s.si];
    return `<div class="g2-cheat-box">
      <div class="g2-cheat-head">
        <span>Spiekbriefje · Regel ${s.si + 1}: <b>${E(shortTitle(st.title))}</b></span>
        <button type="button" class="btn btn-ghost btn-sm" data-act="g2-toggle-cheat">Sluiten ×</button>
      </div>
      ${renderStructuredRuleText(st, s.n, s.si)}
      ${renderTable(st.table)}
    </div>`;
  }
  const steps = g.steps || [];
  return `<div class="g2-cheat-box">
    <div class="g2-cheat-head">
      <span>Spiekbriefje · Alle regels van ${s.n===0?'Inleiding':'Les '+s.n}</span>
      <button type="button" class="btn btn-ghost btn-sm" data-act="g2-toggle-cheat">Sluiten ×</button>
    </div>
    ${steps.map((st, idx) => `<div class="g2-cheat-sec">
      <h4>${idx + 1}. ${E(shortTitle(st.title))}</h4>
      ${renderStructuredRuleText(st, s.n, idx)}
      ${renderTable(st.table)}
    </div>`).join('')}
  </div>`;
}

function buildBookHarakahChoice(rawAr, opt){
  let base = String(rawAr || '').trim();
  if(base.includes('←')) base = base.split('←').pop().trim();
  const parts = base.split('_');
  const oParts = String(opt || '').includes('/')
    ? String(opt).split('/').map(s => s.replace(/[\u0640\s]/g, ''))
    : [String(opt || '').replace(/[\u0640\s]/g, '')];
  let out = '';
  for(let i = 0; i < parts.length; i++){
    let p = parts[i];
    const leadSp = /^\s/.test(p) ? ' ' : '';
    if(i < parts.length - 1){
      const h = oParts[i] || oParts[0] || '';
      const pClean = p.replace(/[\u064B-\u0652]+$/, '');
      if(parts[i + 1]) parts[i + 1] = parts[i + 1].replace(/^[\u064B-\u0652]+/, '');
      const m = pClean.trim().match(/^(.*?\s+)?(\S+)$/);
      if(m && m[1]){
        out += leadSp + arHtml(m[1].trim()) + ' ' + `<b class="g2-book-hl">${arHtml(m[2] + h)}</b>`;
      } else {
        out += leadSp + `<b class="g2-book-hl">${arHtml(pClean.trim() + h)}</b>`;
      }
    } else {
      const rest = p.replace(/\.$/, '').trim();
      if(rest) out += leadSp + arHtml(rest);
    }
  }
  return `<span class="ar g2-book-opt-ar" lang="ar" dir="rtl">${out.trim()}</span>`;
}

function buildBookHarakahPlain(rawAr, opt){
  let base = String(rawAr || '').trim();
  if(base.includes('←')) base = base.split('←').pop().trim();
  const parts = base.split('_');
  const oParts = String(opt || '').includes('/')
    ? String(opt).split('/').map(s => s.replace(/[\u0640\s]/g, ''))
    : [String(opt || '').replace(/[\u0640\s]/g, '')];
  let out = '';
  for(let i = 0; i < parts.length; i++){
    let p = parts[i];
    if(i < parts.length - 1){
      const h = oParts[i] || oParts[0] || '';
      const pClean = p.replace(/[\u064B-\u0652]+$/, '');
      if(parts[i + 1]) parts[i + 1] = parts[i + 1].replace(/^[\u064B-\u0652]+/, '');
      out += pClean + h;
    } else {
      out += p.replace(/\.$/, '');
    }
  }
  return out.trim();
}

function buildBookUnvocalizedPrompt(rawAr){
  const parts = String(rawAr || '').trim().split('_');
  let out = '';
  for(let i = 0; i < parts.length; i++){
    let p = parts[i];
    const leadSp = /^\s/.test(p) ? ' ' : '';
    if(i < parts.length - 1){
      const pClean = p.replace(/[\u064B-\u0652]+$/, '');
      if(parts[i + 1]) parts[i + 1] = parts[i + 1].replace(/^[\u064B-\u0652]+/, '');
      const m = pClean.trim().match(/^(.*?\s+)?(\S+)$/);
      if(m && m[1]){
        out += leadSp + arHtml(m[1].trim()) + ' ' + `<u class="g2-book-ul">${arHtml(m[2])}</u>`;
      } else {
        out += leadSp + `<u class="g2-book-ul">${arHtml(pClean.trim())}</u>`;
      }
    } else {
      const rest = p.replace(/\.$/, '').trim();
      if(rest) out += leadSp + arHtml(rest);
    }
  }
  return out.trim();
}

function parseBookInstr(x){
  const raw = String(x && x.instr || '').trim();
  if(!raw) return { badge: '', title: '' };
  const m = raw.match(/^([^:]+):\s*(.+)$/);
  if(m){
    const badge = m[1].trim();
    const title = m[2].replace(/\s*\(Iqra'[^)]*\)/i, '').trim();
    return { badge, title };
  }
  return { badge: '', title: raw };
}

function renderDrill(s, kicker){
  const x=s.cur; if(!x) return '';
  const d=x.d;
  if(d.type==='parse' && Array.isArray(d.words) && d.words.length){
    return renderInteractiveParse(s, kicker, x);
  }
  const done=s.total-s.queue.length;
  const canShowCheat = s.kind !== 'test';
  const { badge: instrBadge, title: instrTitle } = parseBookInstr(x);
  const topLabel = instrBadge || kicker;

  const prog=`<div class="g2-qprog">
      <span>${E(topLabel)}${x.page && !/blz/i.test(String(topLabel)) ? ' · blz. '+E(x.page) : ''}</span>
      <div class="g2-qprog-right">
        ${canShowCheat ? `<button type="button" class="g2-cheat-btn ${s.showCheat?'active':''}" data-act="g2-toggle-cheat">${s.showCheat?'Sluit uitleg':'Uitleg bij deze regel'}</button>` : ''}
        <span><b>${Math.min(done+1,s.total)}</b> / ${s.total}</span>
      </div>
    </div>
    <div class="g2-lbar"><i style="width:${s.total?Math.round(100*done/s.total):0}%"></i></div>
    ${canShowCheat && s.showCheat ? renderCheatSheetBox(s) : ''}`;

  let q='', opts='';
  const answered = s.ans!==null;
  if(d.type==='order'){
    const builtItems=s.built.map((bankIdx, bPos)=>s.bank[bankIdx]?{w:s.bank[bankIdx].w, bPos}:null).filter(Boolean);
    const mainTask = instrTitle || 'Zet de woorden in de juiste volgorde';
    q=`<div class="g2-opdracht-box">
        <span class="g2-opdracht-lbl">Opdracht</span>
        <div class="g2-opdracht-title">${mix(mainTask)}</div>
        ${d.nl ? `<div class="g2-opdracht-sub">Vertaal naar het Arabisch: <b>«${mix(d.nl)}»</b></div>` : ''}
      </div>
      <div class="g2-build ar" lang="ar" dir="rtl">${builtItems.length?builtItems.map(it=>`<button type="button" class="g2-built-word ar" lang="ar" data-act="g2-unpick" data-bi="${it.bPos}" ${answered?'disabled':''} title="Tik om dit woord weg te halen">${arHtml(it.w)}</button>`).join(''):'<em>Tik op de woorden hieronder (van rechts naar links)</em>'}</div>
      <div class="g2-bank" dir="rtl">${s.bank.map((b,i)=>`<button class="g2-chip ar" lang="ar" data-act="g2-pick" data-i="${i}" ${s.built.includes(i)||answered?'disabled':''}>${arHtml(b.w)}</button>`).join('')}</div>
      ${answered?'':`<div class="g2-actions"><button class="btn btn-ghost btn-sm" data-act="g2-undo" ${s.built.length?'':'disabled'}>Wis laatste</button><button class="btn btn-primary" data-act="g2-check" ${s.built.length===s.bank.length?'':'disabled'}>Controleer</button></div>`}`;
  }else{
    let prompt='';
    const allHarakahOpts = Array.isArray(d.options) && d.options.length > 0 && d.options.every(isHarakahOnly);
    if(d.type==='fill'){
      const solvedForAudio = getSolvedSentenceFromDrill(d);
      if(allHarakahOpts){
        const mainTask = instrTitle || 'Kies hoe je het onderstreepte woord in het boek leest (met het juiste klinkerteken):';
        const bookSent = answered
          ? arHtml(buildBookHarakahPlain(d.ar, d.options[d.answer]))
          : buildBookUnvocalizedPrompt(d.ar);
        prompt=`<div class="g2-opdracht-box">
            <span class="g2-opdracht-lbl">Opdracht · Lees met de juiste klinker</span>
            <div class="g2-opdracht-title">${mix(mainTask)}</div>
          </div>
          <div class="g2-book-paper">
            <div class="g2-fill ar" lang="ar" dir="rtl">${bookSent} ${answered && isSpeakable(solvedForAudio) ? spk(solvedForAudio) : ''}</div>
            ${d.nl?`<div class="g2-sub">${mix(d.nl)}</div>`:''}
          </div>`;
      } else {
        const parts=String(d.ar||'').split('_');
        const optText=answered?String(d.options[d.answer]||''):'';
        const optParts=optText.includes(' / ')?optText.split(' / '):[optText,optText,optText];
        let fillHtml='';
        parts.forEach((p,pIdx)=>{
          fillHtml+=arHtml(p);
          if(pIdx<parts.length-1){
            const rawVal = (optParts[pIdx]||optText).trim();
            const fillVal = answered ? arHtml(rawVal) : '......';
            fillHtml+=`<span class="g2-gap">${fillVal}</span>`;
          }
        });
        const mainTask = instrTitle || `Vul het ontbrekende woord in op de stippellijn:`;
        prompt=`<div class="g2-opdracht-box">
            <span class="g2-opdracht-lbl">Opdracht · Invullen</span>
            <div class="g2-opdracht-title">${mix(mainTask)}</div>
          </div>
          <div class="g2-book-paper">
            <div class="g2-fill ar" lang="ar" dir="rtl">${fillHtml} ${answered && isSpeakable(solvedForAudio) ? spk(solvedForAudio) : ''}</div>
            ${d.nl?`<div class="g2-sub">${mix(d.nl)}</div>`:''}
          </div>`;
      }
    }else if(d.type==='transform'){
      let cleanPrompt = String(d.prompt || '').trim();
      if(d.from && cleanPrompt.includes(d.from)){
        cleanPrompt = cleanPrompt.replace(d.from, '').replace(/:\s*$/, '').replace(/\bvan$/i, 'van deze woorden:').trim();
      }
      const mainTask = instrTitle || cleanPrompt || 'Pas de woorden aan volgens het voorbeeld uit het boek:';
      prompt=`<div class="g2-opdracht-box">
          <span class="g2-opdracht-lbl">Opdracht</span>
          <div class="g2-opdracht-title">${mix(mainTask)}</div>
        </div>
        <div class="g2-book-paper">
          <div class="g2-from ar" lang="ar" dir="rtl">${arHtml(d.from||'')} <span class="g2-book-arrow">⟵</span> <span class="g2-gap">......</span> ${spk(d.from||'')}</div>
        </div>`;
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
      prompt=`<div class="g2-opdracht-box">
          <span class="g2-opdracht-lbl">Opdracht · Zinsontleding (إعراب)</span>
          <div class="g2-opdracht-title">Wat is de grammaticale rol van <b class="ar" lang="ar">«${arHtml(target)}»</b> in deze zin?</div>
        </div>
        <div class="g2-book-paper">
          <div class="g2-parse-sent ar" lang="ar" dir="rtl">${sentHtml} ${spk(sent)}</div>
        </div>`;
    }else{
      const rawQ = String(d.q || '').trim();
      const arParenMatch = rawQ.match(/^([\u0600-\u06FF\s؟،.]+)\s*\(([^)]+)\)$/);
      if(arParenMatch){
        const arPart = arParenMatch[1].trim();
        const nlHint = arParenMatch[2].trim();
        const mainTask = instrTitle || 'Beantwoord de Arabische vraag:';
        prompt=`<div class="g2-opdracht-box">
            <span class="g2-opdracht-lbl">Opdracht</span>
            <div class="g2-opdracht-title">${mix(mainTask)}</div>
            <div class="g2-opdracht-sub">Aanwijzing: <b>${mix(nlHint)}</b></div>
          </div>
          <div class="g2-book-paper">
            <div class="g2-fill ar" lang="ar" dir="rtl">${arHtml(arPart)} ${spk(arPart)}</div>
          </div>`;
      } else {
        prompt=`<div class="g2-opdracht-box">
            <span class="g2-opdracht-lbl">${E(instrTitle || 'Vraag')}</span>
            <div class="g2-opdracht-title">${mix(rawQ)}</div>
          </div>`;
      }
    }
    opts=`<div class="g2-opts">${s.optOrder.map((oi,k)=>{
      const o=d.options[oi];
      const useBookHarakah = (d.type === 'fill' && allHarakahOpts);
      const harakahMode = !useBookHarakah && isHarakahOnly(o);
      let c='g2-opt'+((useBookHarakah || isAr(o))?' ar':'')+(harakahMode?' g2-opt-harakah':'');
      if(answered){ if(oi===d.answer) c+=' ok'; else if(oi===s.ans) c+=' bad'; }
      const inner = useBookHarakah
        ? buildBookHarakahChoice(d.ar, o)
        : (harakahMode ? formatHarakahOption(o) : (isAr(o)?`<span lang="ar">${arHtml(o)}</span>`:mix(o)));
      return `<button class="${c}" data-act="g2-ans" data-oi="${oi}" ${answered?'disabled':''}><span class="g2-key">${k+1}</span>${inner}</button>`;
    }).join('')}</div>`;
    q=prompt+opts;
  }
  let fb='';
  if(answered){
    const ok=s.lastOk;
    const allHarakahOpts = Array.isArray(d.options) && d.options.length > 0 && d.options.every(isHarakahOnly);
    const correct = d.type==='order'
      ? d.words.join(' ')
      : (d.type==='fill' && allHarakahOpts ? buildBookHarakahPlain(d.ar, d.options[d.answer]) : d.options[d.answer]);
    const correctDisplay = isHarakahOnly(correct)
      ? formatHarakahInline(correct)
      : `<span class="ar" lang="ar">${isAr(correct)?arHtml(correct):mix(correct)}</span>${isAr(correct)?spk(correct):''}`;
    fb=`<div class="g2-fb ${ok?'ok':'bad'}">
      <b>${ok?'Goed!':'Nog niet goed'}</b>
      ${ok?'':`<div class="g2-correct">Juist: ${correctDisplay}</div>`}
      ${d.explain?`<p>${mix(d.explain)}</p>`:''}
      ${!ok&&s.kind==='step'?'<p class="g2-hint">Deze vraag komt aan het einde van deze stap terug.</p>':''}
      <div class="g2-fb-actions">
        <button class="btn btn-primary" data-act="g2-next" data-gl="next">${s.queue.length>1?'Volgende vraag →':'Bekijk resultaat →'}</button>
      </div>
    </div>`;
  }

  let irabHtml = '';
  const solvedSent = getSolvedSentenceFromDrill(d);
  const parsedSent = analyzeArabicSentence(solvedSent);
  if(parsedSent && (answered || P.inlineIrab)){
    const dKey = 'drill_' + (x.ref || s.qi);
    const irabSt = getInlineIrabSession(dKey, 'view');
    const isIrabOpen = !!(irabSt.open || (answered && P.inlineIrab && irabSt.userClosed !== true));
    if(isIrabOpen) irabSt.open = true;
    irabHtml = `<div class="g2-drill-irab-wrap">
      ${!isIrabOpen ? `<div class="g2-drill-irab-bar">
        <div class="iirab-bar-lbl">
          <span class="iirab-badge-ar ar" lang="ar">إعراب</span>
          <span>Zinsontleding bekijken</span>
        </div>
        <div class="iirab-bar-btns">
          <button type="button" class="btn btn-sm btn-ghost" data-act="iirab-open" data-key="${E(dKey)}" data-sent="${E(solvedSent)}" data-mode="view">Toon ontleding</button>
        </div>
      </div>` : renderInlineIrab(solvedSent, dKey, irabSt.mode)}
    </div>`;
  }

  return `<div class="g2-card">${prog}${q}${irabHtml}${fb}</div>`;
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
  const hasLearnWords = typeof wordsFor==='function' && wordsFor(n).length > 0;
  const grid = `<div class="g2-vocab-grid">${v.map((item, i) => `
    <div class="g2-vocab-card">
      <div class="g2-vc-top">
        ${spk(item.ar)}
        <span class="g2-vc-ar ar" lang="ar" dir="rtl">${arHtml(item.ar)}</span>
      </div>
      <div class="g2-vc-nl ${s.hideNl?'hid':''}" ${s.hideNl?`data-act="g2-reveal" data-i="${i}"`:''}>${s.hideNl?'Tik om vertaling te tonen':mix(item.nl||'')}</div>
    </div>
  `).join('')}</div>`;
  return `<div class="desktop-narrow g2">${head(n)}<div class="g2-card">
    <div class="g2-vocab-head">
      <div>
        <div class="g2-kicker">Woordenlijst uit de les (${v.length} woorden)</div>
        <h2>Nieuwe woorden · ${n===0?'Inleiding':'Les '+n}</h2>
        <p class="g2-hint" style="margin:0">Luister naar elk woord en zeg het hardop na. Gebruik de overhoormodus om jezelf te testen.</p>
      </div>
      <div class="g2-tools" style="margin:0">
        <button type="button" class="btn ${s.hideNl?'btn-primary':'btn-secondary'} btn-sm" data-act="g2-hide">${s.hideNl?'Toon alle vertalingen':'Overhoormodus (verberg NL)'}</button>
      </div>
    </div>
    ${grid}
    <div class="g2-actions">
      ${hasLearnWords ? `<button type="button" class="btn btn-secondary" data-act="start-learn" data-l="${n}">Oefen met Flashcards &amp; Quiz</button>` : ''}
      <button type="button" class="btn btn-primary" data-act="g2-finish" data-gl="next">Woordenlijst afronden →</button>
    </div>
  </div></div>`;
}

function renderLesson(){
  const s=S();
  if(s.view === 'irab_studio') return renderIrabStudio();
  const n=Number(state.bookLesson);
  if(!L[n]) return `<div class="desktop-narrow"><div class="empty">Les niet gevonden.</div></div>`;
  if(s.n!==n || s.view!=='node') return renderLessonMap(n);
  if(s.kind==='step') return renderStep(n);
  if(s.kind==='vocab') return renderVocab(n);
  if(s.kind==='book') return renderSimpleRun(n,'Oefeningen uit het boek');
  if(s.kind==='test') return renderSimpleRun(n,'Eindtoets');
  if(s.kind==='review') return renderSimpleRun(n,'Herhaling');
  return renderLessonMap(n);
}

/* ---------- automatische timer & instellingen bij antwoord ---------- */
let _g2AutoTimer = null;
function clearG2AutoTimer(){
  if(_g2AutoTimer){
    clearTimeout(_g2AutoTimer);
    _g2AutoTimer = null;
  }
}
function scheduleG2AutoNext(ok){
  clearG2AutoTimer();
  const s = S();
  const dKey = s.cur ? ('drill_' + (s.cur.ref || s.qi)) : '';
  const irabOpen = !!(P.inlineIrab || (dKey && window._inlineIrabState && window._inlineIrabState[dKey] && window._inlineIrabState[dKey].open));
  if(irabOpen){
    s.timerPaused = true;
    return;
  }
  s.timerPaused = false;
  if(P.autoAdvance === false) return;
  const delay = ok ? 400 : 3500; // juist: direct op achtergrond door (400ms), fout: 3.5s of handmatig
  _g2AutoTimer = setTimeout(()=>{
    _g2AutoTimer = null;
    const curState = S();
    if(state.view === 'book-lesson' && curState.view === 'node' && curState.ans !== null && !curState.timerPaused){
      next();
      render();
      scrollTop();
    }
  }, delay);
}
function toggleInlineIrabPref(){
  P.inlineIrab = !P.inlineIrab;
  save();
  if(P.inlineIrab) clearG2AutoTimer();
  render();
}
function toggleAutoAdvance(){
  P.autoAdvance = (P.autoAdvance === false) ? true : false;
  save();
  if(!P.autoAdvance) clearG2AutoTimer();
  else {
    const s = S();
    if(s.ans !== null && s.lastOk !== undefined) scheduleG2AutoNext(s.lastOk);
  }
  render();
}
function toggleSfx(){
  P.sfx = (P.sfx === false) ? true : false;
  save();
  render();
}
function toggleDrillTimer(){
  const s = S();
  if(_g2AutoTimer && !s.timerPaused){
    clearTimeout(_g2AutoTimer);
    _g2AutoTimer = null;
    s.timerPaused = true;
  } else if(s.timerPaused && s.ans !== null){
    s.timerPaused = false;
    scheduleG2AutoNext(s.lastOk);
  }
  render();
}

/* ---------- acties ---------- */
function answer(ok){
  const s=S(); s.lastOk=ok;
  const ref=s.queue[0];
  if(s.kind==='review') resolveMistake(ref, ok, s.n);
  else if(!ok) addMistake(ref);
  if(ok && !(s.retry&&s.retry[ref])) s.score++;
  if(typeof sfx==='function'){ try{ sfx(ok); }catch(e){} }
  scheduleG2AutoNext(ok);
}
function next(){
  clearG2AutoTimer();
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
  clearG2AutoTimer();
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

function getCurrentIrabContext(isStudio){
  const s = S();
  if(isStudio || s.view === 'irab_studio'){
    const sents = s.irabCategory === 'all' ? ALL_IRAB_SENTENCES : ALL_IRAB_SENTENCES.filter(x => x.category === s.irabCategory);
    const curSent = sents[s.irabSentIdx] || ALL_IRAB_SENTENCES[0];
    if(!curSent) return null;
    const words = curSent.words || [];
    const ps = getParseSession('studio_' + curSent.id, words);
    return { s, sentObj: curSent, words, ps, isStudio: true };
  } else {
    const x = s.cur;
    if(!x || !x.d || !x.d.words) return null;
    const words = x.d.words || [];
    const ps = getParseSession(x.ref || x.d.sentence, words);
    return { s, sentObj: x.d, words, ps, isStudio: false };
  }
}

function advanceNextEmptySlot(ps, words, fromIdx){
  for(let k = 0; k < words.length; k++){
    const cand = (fromIdx + k) % words.length;
    if(!ps.slots[cand]){
      ps.activeSlot = cand;
      return;
    }
  }
  ps.activeSlot = null;
}

window.g2IrabDragStart = function(ev, roleId){
  try {
    ev.dataTransfer.setData('text/plain', roleId);
    ev.dataTransfer.effectAllowed = 'copyMove';
  } catch(e){}
};

window.g2IrabDragOver = function(ev, wi){
  ev.preventDefault();
  if(ev.currentTarget && ev.currentTarget.classList){
    ev.currentTarget.classList.add('slot-dragover');
  }
};

window.g2IrabDragLeave = function(ev, wi){
  if(ev.currentTarget && ev.currentTarget.classList){
    ev.currentTarget.classList.remove('slot-dragover');
  }
};

window.g2IrabDrop = function(ev, wi, isStudio){
  ev.preventDefault();
  if(ev.currentTarget && ev.currentTarget.classList){
    ev.currentTarget.classList.remove('slot-dragover');
  }
  let roleId = '';
  try { roleId = ev.dataTransfer.getData('text/plain'); } catch(e){}
  if(!roleId) return;
  const ctx = getCurrentIrabContext(isStudio);
  if(!ctx || ctx.ps.complete) return;
  const { ps, words } = ctx;
  ps.slots[wi] = roleId;
  if(ps.slotStatus) delete ps.slotStatus[wi];
  ps.tapRole = null;
  ps.dndMsg = null;
  advanceNextEmptySlot(ps, words, wi + 1);
  render();
};

document.addEventListener('click', e=>{
  const btn=e.target.closest&&e.target.closest('[data-act]'); if(!btn) return;
  const act=btn.dataset.act;
  if(act==='open-book'){
    clearG2AutoTimer();
    e.stopImmediatePropagation();
    const n=parseInt(btn.dataset.l,10);
    if(!L[n]) return;
    state.path='grammar'; state.view='book-lesson'; state.bookLesson=n; S().view='map'; S().n=n;
    try{ lastGrammar=n; saveG(); }catch(err){}
    render(); scrollTop(); return;
  }
  if(act.startsWith('iirab-')){
    clearG2AutoTimer();
    if(state.g2) state.g2.timerPaused = true;
    e.stopImmediatePropagation();
    const key = btn.dataset.key || '';
    const st = getInlineIrabSession(key, btn.dataset.mode || 'view');
    if(act === 'iirab-toggle'){
      st.open = !st.open;
      st.userClosed = !st.open;
      render(); return;
    }
    if(act === 'iirab-open'){
      const m = btn.dataset.mode || 'view';
      if(st.open && st.mode === m){
        st.open = false;
        st.userClosed = true;
      } else {
        st.open = true;
        st.userClosed = false;
        st.mode = m;
      }
      render(); return;
    }
    if(act === 'iirab-close'){
      st.open = false;
      st.userClosed = true;
      render(); return;
    }
    if(act === 'iirab-mode'){
      st.mode = btn.dataset.mode || 'view';
      st.fb = null;
      render(); return;
    }
    if(act === 'iirab-word-info'){
      const wi = +btn.dataset.wi;
      st.selWord = (st.selWord === wi) ? null : wi;
      render(); return;
    }
    if(act === 'iirab-select-quiz-w'){
      const wi = +btn.dataset.wi;
      st.wi = wi;
      st.fb = null;
      if(st.complete && !st.done[wi]) st.complete = false;
      render(); return;
    }
    if(act === 'iirab-pick-role'){
      const sent = btn.dataset.sent || '';
      const role = btn.dataset.role || '';
      const parsed = analyzeArabicSentence(sent);
      if(!parsed || !parsed.words) return;
      const w = parsed.words[st.wi];
      if(!w) return;
      if(matchClassroomRole(role, w)){
        st.done[st.wi] = true;
        try{ playSfx(true); }catch(err){}
        st.fb = { ok: true, msg: `Juist! ${w.explain}` };
        let nextWi = -1;
        for(let k = 0; k < parsed.words.length; k++){
          const cand = (st.wi + 1 + k) % parsed.words.length;
          if(!st.done[cand]){ nextWi = cand; break; }
        }
        if(nextWi >= 0){
          st.wi = nextWi;
        } else {
          st.complete = true;
        }
      } else {
        try{ playSfx(false); }catch(err){}
        st.fb = { ok: false, msg: `Let op: ${w.explain}` };
      }
      render(); return;
    }
    if(act === 'iirab-reset'){
      st.done = {};
      st.wi = 0;
      st.complete = false;
      st.fb = null;
      render(); return;
    }
    return;
  }
  if(!act.startsWith('g2-')) return;
  e.stopImmediatePropagation();
  const s=S();
  if(act==='g2-hub'){ clearG2AutoTimer(); state.view='book'; state.bookLesson=null; s.view='map'; render(); scrollTop(); return; }
  if(act==='g2-open-irab'){
    clearG2AutoTimer();
    state.path='grammar'; state.view='book'; S().view='irab_studio';
    render(); scrollTop(); return;
  }
  if(act==='g2-irab-mode'){
    S().irabMode = btn.dataset.mode || 'dnd';
    render(); return;
  }
  if(act==='g2-dnd-role'){
    const isStudio = btn.dataset.studio === '1';
    const roleId = btn.dataset.role;
    const ctx = getCurrentIrabContext(isStudio);
    if(!ctx || ctx.ps.complete) return;
    const { ps, words } = ctx;
    if(typeof ps.activeSlot === 'number' && ps.activeSlot >= 0 && ps.activeSlot < words.length && !ps.slots[ps.activeSlot]){
      const targetWi = ps.activeSlot;
      ps.slots[targetWi] = roleId;
      if(ps.slotStatus) delete ps.slotStatus[targetWi];
      ps.tapRole = null;
      ps.dndMsg = null;
      advanceNextEmptySlot(ps, words, targetWi + 1);
    } else {
      ps.tapRole = (ps.tapRole === roleId) ? null : roleId;
      ps.dndMsg = null;
    }
    render(); return;
  }
  if(act==='g2-dnd-slot'){
    const isStudio = btn.dataset.studio === '1';
    const wi = +btn.dataset.wi;
    const ctx = getCurrentIrabContext(isStudio);
    if(!ctx || ctx.ps.complete) return;
    const { ps, words } = ctx;
    if(ps.tapRole){
      ps.slots[wi] = ps.tapRole;
      if(ps.slotStatus) delete ps.slotStatus[wi];
      ps.tapRole = null;
      ps.dndMsg = null;
      advanceNextEmptySlot(ps, words, wi + 1);
    } else if(ps.slots[wi]){
      delete ps.slots[wi];
      if(ps.slotStatus) delete ps.slotStatus[wi];
      delete ps.wordsDone[wi];
      ps.activeSlot = wi;
      ps.dndMsg = null;
    } else {
      ps.activeSlot = wi;
      ps.dndMsg = null;
    }
    render(); return;
  }
  if(act==='g2-dnd-check'){
    const isStudio = btn.dataset.studio === '1';
    const ctx = getCurrentIrabContext(isStudio);
    if(!ctx) return;
    const { s, sentObj, words, ps } = ctx;
    const allFilled = words.every((_, idx) => !!ps.slots[idx]);
    if(!allFilled){
      ps.dndMsg = { type: 'warn', text: 'Vul eerst alle vakjes in voordat je controleert!' };
      try{ playSfx(false); }catch(err){}
      render(); return;
    }
    let allCorrect = true;
    words.forEach((w, idx) => {
      const chosen = ps.slots[idx];
      const ok = checkRoleMatch(chosen, w.role);
      ps.slotStatus[idx] = ok ? 'correct' : 'wrong';
      if(ok){
        ps.wordsDone[idx] = { role: w.role, status: w.status, mark: w.mark, ok: true };
      } else {
        allCorrect = false;
        delete ps.wordsDone[idx];
      }
    });
    if(allCorrect){
      ps.complete = true;
      ps.dndMsg = null;
      ps.tapRole = null;
      try{ playSfx(true); }catch(err){}
      if(ctx.isStudio){
        P.irabDone = P.irabDone || {};
        P.irabDone[sentObj.id] = true;
        save();
      } else {
        s.ans = 1;
        answer(true);
      }
    } else {
      ps.dndMsg = { type: 'err', text: 'Nog niet helemaal goed. De rode vakjes kloppen nog niet — tik op een rood vakje om het te verbeteren!' };
      try{ playSfx(false); }catch(err){}
    }
    render(); return;
  }
  if(act==='g2-dnd-reset'){
    const isStudio = btn.dataset.studio === '1';
    const s = S();
    delete s.parseState;
    render(); return;
  }
  if(act==='g2-studio-cat'){
    S().irabCategory = btn.dataset.cat;
    S().irabSentIdx = 0;
    delete S().parseState;
    render(); return;
  }
  if(act==='g2-studio-select-sent'){
    S().irabSentIdx = +btn.dataset.si;
    delete S().parseState;
    render(); return;
  }
  if(act==='g2-studio-select-w'){
    const ps = S().parseState;
    if(ps){ ps.wi = +btn.dataset.wi; ps.feedback = null; }
    render(); return;
  }
  if(act==='g2-studio-pick'){
    const ps = S().parseState;
    if(!ps) return;
    const cat = btn.dataset.cat, val = btn.dataset.val;
    if(cat==='role') ps.selRole = (ps.selRole===val ? null : val);
    if(cat==='status') ps.selStatus = (ps.selStatus===val ? null : val);
    if(cat==='mark') ps.selMark = (ps.selMark===val ? null : val);
    ps.feedback = null;
    render(); return;
  }
  if(act==='g2-studio-check-word'){
    const s = S();
    const curSent = (s.irabCategory==='all' ? ALL_IRAB_SENTENCES : ALL_IRAB_SENTENCES.filter(x=>x.category===s.irabCategory))[s.irabSentIdx];
    if(!curSent) return;
    const words = curSent.words;
    const ps = getParseSession('studio_' + curSent.id, words);
    const w = words[ps.wi];
    if(!w || !ps.selRole || !ps.selStatus || !ps.selMark) return;

    const rOk = checkRoleMatch(ps.selRole, w.role);
    const sOk = ps.selStatus === w.status;
    const mOk = checkMarkMatch(ps.selMark, w.mark);

    if(rOk && sOk && mOk){
      ps.wordsDone[ps.wi] = { role: ps.selRole, status: ps.selStatus, mark: ps.selMark, ok: true };
      ps.slots[ps.wi] = w.role;
      ps.slotStatus[ps.wi] = 'correct';
      try{ playSfx(true); }catch(e){}
      ps.selRole = null; ps.selStatus = null; ps.selMark = null; ps.feedback = null;
      if(ps.wi + 1 < words.length){
        ps.wi++;
      } else {
        ps.complete = true;
        P.irabDone = P.irabDone || {};
        P.irabDone[curSent.id] = true;
        save();
      }
    } else {
      let hint = '';
      if(!rOk) hint = 'Kijk goed naar de grammaticale rol (functie) van dit woord.';
      else if(!sOk) hint = 'Kijk goed naar de naamvalsstatus (nominatief of genitief).';
      else if(!mOk) hint = 'Kijk goed naar het juiste klinkerteken (harakah/tashkīl).';
      ps.feedback = { ok: false, msg: w.explain || hint };
      try{ playSfx(false); }catch(e){}
    }
    render(); return;
  }
  if(act==='g2-studio-reset'){
    const s = S();
    const curSent = (s.irabCategory==='all' ? ALL_IRAB_SENTENCES : ALL_IRAB_SENTENCES.filter(x=>x.category===s.irabCategory))[s.irabSentIdx];
    if(curSent) delete s.parseState;
    render(); return;
  }
  if(act==='g2-studio-next-sent'){
    const s = S();
    s.irabSentIdx++;
    delete s.parseState;
    render(); scrollTop(); return;
  }
  if(act==='g2-parse-select-w'){
    const ps = S().parseState;
    if(ps){ ps.wi = +btn.dataset.wi; ps.feedback = null; }
    render(); return;
  }
  if(act==='g2-parse-pick'){
    const ps = S().parseState;
    if(!ps) return;
    const cat = btn.dataset.cat, val = btn.dataset.val;
    if(cat==='role') ps.selRole = (ps.selRole===val ? null : val);
    if(cat==='status') ps.selStatus = (ps.selStatus===val ? null : val);
    if(cat==='mark') ps.selMark = (ps.selMark===val ? null : val);
    ps.feedback = null;
    render(); return;
  }
  if(act==='g2-parse-check-word'){
    const s = S();
    const x = s.cur;
    if(!x || !x.d || !x.d.words) return;
    const words = x.d.words;
    const ps = getParseSession(x.ref || x.d.sentence, words);
    const w = words[ps.wi];
    if(!w || !ps.selRole || !ps.selStatus || !ps.selMark) return;

    const rOk = checkRoleMatch(ps.selRole, w.role);
    const sOk = ps.selStatus === w.status;
    const mOk = checkMarkMatch(ps.selMark, w.mark);

    if(rOk && sOk && mOk){
      ps.wordsDone[ps.wi] = { role: ps.selRole, status: ps.selStatus, mark: ps.selMark, ok: true };
      try{ playSfx(true); }catch(e){}
      ps.selRole = null; ps.selStatus = null; ps.selMark = null; ps.feedback = null;
      if(ps.wi + 1 < words.length){
        ps.wi++;
      } else {
        ps.complete = true;
        s.ans = 1;
        answer(true);
      }
    } else {
      let hint = '';
      if(!rOk) hint = 'Kijk goed naar de grammaticale rol (functie) van dit woord.';
      else if(!sOk) hint = 'Kijk goed naar de naamvalsstatus (nominatief of genitief).';
      else if(!mOk) hint = 'Kijk goed naar het juiste klinkerteken (harakah/tashkīl).';
      ps.feedback = { ok: false, msg: w.explain || hint };
      try{ playSfx(false); }catch(e){}
    }
    render(); return;
  }
  if(act==='g2-open'){
    clearG2AutoTimer();
    const n=parseInt(btn.dataset.l,10);
    if(!lessonOpen(n)){ alert('Rond eerst de eindtoets van de vorige les af (of zet "Alle lessen vrij openen" aan).'); return; }
    state.path='grammar'; state.view='book-lesson'; state.bookLesson=n; s.n=n; s.view='map';
    try{ lastGrammar=n; saveG(); }catch(err){}
    render(); scrollTop(); return;
  }
  if(act==='g2-unlock'){ P.unlockAll=btn.checked; save(); render(); return; }
  if(act==='g2-pillar'){
    const pid = btn.dataset.pid;
    s.hubFilter = (s.hubFilter === pid) ? 'all' : pid;
    render(); return;
  }
  if(act==='g2-hub-filter'){
    s.hubFilter = btn.dataset.f;
    render(); return;
  }
  if(act==='g2-hub-clear-search'||act==='g2-hub-reset'){
    s.hubSearch = '';
    s.hubFilter = 'all';
    render(); return;
  }
  if(act==='g2-toggle-irab'){ toggleInlineIrabPref(); return; }
  if(act==='g2-ex-irab-all'){
    const mode = btn.dataset.mode || 'view';
    const prefix = btn.dataset.prefix || `ex_${s.n}_${s.si}`;
    const st = L[s.n] && L[s.n].steps && L[s.n].steps[s.si];
    const list = (st && st.examples) || [];
    if(s.exIrabMode === mode){
      s.exIrabMode = null;
      list.forEach((_, idx) => {
        const sess = getInlineIrabSession(`${prefix}_${idx}`, mode);
        sess.open = false;
      });
    } else {
      s.exIrabMode = mode;
      list.forEach((_, idx) => {
        const sess = getInlineIrabSession(`${prefix}_${idx}`, mode);
        sess.open = true;
        sess.mode = mode;
      });
    }
    render(); return;
  }
  if(act==='g2-toggle-auto'){ toggleAutoAdvance(); return; }
  if(act==='g2-toggle-sfx'){ toggleSfx(); return; }
  if(act==='g2-toggle-timer'){ toggleDrillTimer(); return; }
  if(act==='g2-toggle-cheat'){
    clearG2AutoTimer();
    s.showCheat = !s.showCheat;
    render(); return;
  }
  if(act==='g2-toggle-ref'){
    e.preventDefault();
    s.hubRefOpen = !s.hubRefOpen;
    render(); return;
  }
  if(act==='g2-map'){ clearG2AutoTimer(); s.view='map'; render(); scrollTop(); return; }
  if(act==='g2-node'){ clearG2AutoTimer(); startNode(state.bookLesson, +btn.dataset.i); render(); scrollTop(); return; }
  if(act==='g2-phase'){
    clearG2AutoTimer();
    const targetP = btn.dataset.p;
    if(targetP === 'do'){
      const drills = stepDrills(s.n, s.si);
      if(!drills.length){
        finishNode();
        render(); scrollTop(); return;
      }
      if(!s.queue || !s.queue.length){
        s.queue = drills.map(x => x.ref);
        s.total = s.queue.length;
        s.retry = {};
        prepDrill();
      }
    }
    s.phase = targetP;
    s.hideNl = false;
    render(); scrollTop(); return;
  }
  if(act==='g2-hide'){ s.hideNl=!s.hideNl; s.shown={}; render(); return; }
  if(act==='g2-reveal'){ btn.classList.remove('hid'); btn.removeAttribute('data-act'); 
    const st=s.kind==='vocab'?L[s.n].vocab:L[s.n].steps[s.si].examples; const it=st[+btn.dataset.i]; if(it) btn.innerHTML=mix(it.nl||''); return; }
  if(act==='g2-ans'){ if(s.ans!==null) return; s.ans=+btn.dataset.oi; answer(s.ans===s.cur.d.answer); render(); return; }
  if(act==='g2-pick'){ if(s.ans!==null) return; s.built.push(+btn.dataset.i); render(); return; }
  if(act==='g2-unpick'){
    if(s.ans!==null) return;
    const bi = +btn.dataset.bi;
    if(!isNaN(bi) && bi >= 0 && bi < s.built.length){
      s.built.splice(bi, 1);
      render();
    }
    return;
  }
  if(act==='g2-undo'){ s.built.pop(); render(); return; }
  if(act==='g2-check'){
    if(s.ans!==null) return;
    const got=s.built.map(i=>s.bank[i]?s.bank[i].w:'').filter(Boolean).join(' ');
    s.ans=-1; answer(got===s.cur.d.words.join(' ')); render(); return;
  }
  if(act==='g2-next'){ clearG2AutoTimer(); next(); render(); scrollTop(); return; }
  if(act==='g2-finish'){ clearG2AutoTimer(); finishNode(); render(); scrollTop(); return; }
}, true);

document.addEventListener('keydown', e=>{
  if(state.view!=='book-lesson') return;
  if(e.target.matches&&e.target.matches('input,textarea,select')) return;
  if(['1','2','3','4','5','6'].includes(e.key)){
    const b=document.querySelectorAll('.g2-opt:not(:disabled)')[+e.key-1]; if(b){ e.preventDefault(); e.stopImmediatePropagation(); b.click(); }
  }
  if(e.key==='Enter'){
    clearG2AutoTimer();
    const b=document.querySelector('.g2 [data-gl="next"]:not(:disabled)'); if(b){ e.preventDefault(); e.stopImmediatePropagation(); b.click(); }
  }
  if(e.key===' ' || e.code==='Space'){
    const tBtn = document.querySelector('[data-act="g2-toggle-timer"]');
    if(tBtn){ e.preventDefault(); e.stopImmediatePropagation(); tBtn.click(); }
  }
  if(e.key==='Escape'){
    const hub = document.querySelector('[data-act="g2-hub"]');
    if(hub){ e.preventDefault(); e.stopImmediatePropagation(); hub.click(); }
  }
}, true);

document.addEventListener('input', e=>{
  const inp = e.target.closest&&e.target.closest('[data-act="g2-hub-search"]');
  if(inp){
    const s = S();
    s.hubSearch = inp.value;
    const pos = inp.selectionStart;
    render();
    const newInp = document.querySelector('[data-act="g2-hub-search"]');
    if(newInp){
      newInp.focus();
      try{ newInp.setSelectionRange(pos, pos); }catch(err){}
    }
  }
}, true);

/* ---------- koppelen aan de app ---------- */
window.renderBook = renderHub;
window.renderBookLesson = renderLesson;
try { renderBook = renderHub; renderBookLesson = renderLesson; } catch(e){}
window.G2 = {L, P, SHORT_TITLES, nodes, testPool, bookItems, stepDrills, startNode, prepDrill, lessonOpen, lessonPassed, save, S};
if(typeof render==='function') try{ render(); }catch(e){}
})();
