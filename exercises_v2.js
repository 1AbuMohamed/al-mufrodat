/* =====================================================================
   Al-Mufrodat · Oefeningen Medina Lesboek Deel 1
   Bron: 01b_Lesboek_Medina_methode_deel_1.pdf
   - Oefeningen per les, met optionele antwoorden (uitwerkingen)
   - Hash-routing: #/oefeningen , #/oefeningen/:nr
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

const EX = {};

EX[1] = {
  title: 'Les 1',
  exercises: [
    {
      title: '1. Oefening — مَا هَذَا؟',
      nl: 'Kijk naar de afbeeldingen en zeg of schrijf: wat is dit?',
      answers: [
        'مَا هَذَا؟ هَذَا مِفْتَاحٌ.',
        'مَا هَذَا؟ هَذَا كِتَابٌ.',
        'مَا هَذَا؟ هَذَا قَلَمٌ.',
        'مَا هَذَا؟ هَذَا بَابٌ.',
        'مَا هَذَا؟ هَذَا كُرْسِيٌّ.',
        'مَا هَذَا؟ هَذَا بَيْتٌ.'
      ]
    },
    {
      title: '2. Oefening — أَهَذَا…؟',
      nl: 'Beantwoord de ja/nee-vragen bij de afbeeldingen.',
      answers: [
        'أَهَذَا بَيْتٌ؟ لَا، هَذَا مَسْجِدٌ.',
        'أَهَذَا مِفْتَاحٌ؟ لَا، هَذَا قَلَمٌ.',
        'أَهَذَا قَمِيصٌ؟ نَعَمْ، هَذَا قَمِيصٌ.'
      ]
    },
    {
      title: '3. Oefening — إِقْرَأْ وَاكْتُبْ',
      nl: 'Lees en schrijf.',
      items: [
        'هَذَا مَكْتَبٌ.','هَذَا مَسْجِدٌ.','هَذَا قَلَمٌ.','هَذَا سَرِيرٌ.',
        'أَهَذَا بَيْتٌ؟ لَا، هَذَا مَسْجِدٌ.'
      ]
    },
    {
      title: '4. Oefening — إِقْرَأْ وَاكْتُبْ',
      nl: 'Lees en schrijf.',
      items: [
        '(١) مَا هَذَا؟ هَذَا قَلَمٌ.',
        '(٢) هَذَا كَلْبٌ.',
        '(٣) مَنْ هَذَا؟ هَذَا طَبِيبٌ.',
        '(٤) هَذَا جَمَلٌ.',
        '(٥) أَهَذَا كَلْبٌ؟ لَا، هَذَا قِطٌّ.',
        '(٦) أَهَذَا دِيكٌ؟ نَعَمْ.',
        '(٧) أَهَذَا حِصَانٌ؟ لَا، هَذَا حِمَارٌ.',
        '(٨) هَذَا مِنْدِيلٌ.',
        '(٩) أَهَذَا وَلَدٌ؟ نَعَمْ.',
        '(١٠) مَنْ هَذَا؟ هَذَا رَجُلٌ.'
      ]
    }
  ]
};

EX[2] = {
  title: 'Les 2',
  exercises: [{
    title: '1. Oefening — إِقْرَأْ وَاكْتُبْ',
    nl: 'Lees en schrijf.',
    items: [
      '(١) هَذَا سُكَّرٌ وَذَلِكَ لَبَنٌ.',
      '(٢) مَنْ ذَلِكَ؟ ذَلِكَ إِمَامٌ.',
      '(٣) أَذَلِكَ قِطٌّ؟ لَا، ذَلِكَ كَلْبٌ.',
      '(٤) مَا هَذَا؟ هَذَا حَجَرٌ.'
    ]
  }]
};

EX[3] = {
  title: 'Les 3',
  exercises: [
    {
      title: '1. Lees en schrijf met juiste uitgang',
      nl: 'Let op tanwien vs. al-.',
      items: [
        'مَسْجِدٌ → الْمَسْجِدُ','مَاءٌ → الْمَاءُ','بَيْتٌ → الْبَيْتُ','قَلَمٌ → الْقَلَمُ',
        'كَلْبٌ → الْكَلْبُ','وَلَدٌ → الْوَلَدُ','حِمَارٌ → الْحِمَارُ','حِصَانٌ → الْحِصَانُ'
      ]
    },
    {
      title: '2. Lees en schrijf',
      items: [
        '(١) الْمَكْتَبُ مَكْسُورٌ.','(٢) الْمُدَرِّسُ جَدِيدٌ.','(٣) الْقَمِيصُ وَسِخٌ.',
        '(٤) اللَّبَنُ بَارِدٌ.','(٥) الْمَسْجِدُ مَفْتُوحٌ.','(٦) الْحَجَرُ كَبِيرٌ.',
        '(٧) اللَّبَنُ بَارِدٌ وَالْمَاءُ حَارٌّ.','(٨) الْإِمَامُ جَالِسٌ وَالْمُدَرِّسُ وَاقِفٌ.',
        '(٩) الْقَمَرُ بَعِيدٌ.','(١٠) الْمِنْدِيلُ نَظِيفٌ.'
      ]
    },
    {
      title: '3. Vul in',
      nl: 'جَمِيلٌ · وَسِخٌ · مَفْتُوحٌ · حَارٌّ · ثَقِيلٌ · خَفِيفٌ',
      answers: [
        '(١) الْحَجَرُ ثَقِيلٌ.','(٢) الْبَابُ مَفْتُوحٌ.','(٣) الْقَمَرُ جَمِيلٌ.',
        '(٤) الْوَرَقُ خَفِيفٌ.','(٥) الْمِنْدِيلُ وَسِخٌ.','(٦) اللَّبَنُ حَارٌّ.'
      ]
    },
    {
      title: '4. Vul in met al-',
      answers: [
        '(١) الْمِنْدِيلُ نَظِيفٌ.','(٢) الْكُرْسِيُّ مَكْسُورٌ.','(٣) الْمَاءُ بَارِدٌ.',
        '(٤) الْمَسْجِدُ قَرِيبٌ.','(٥) الْقَمَرُ بَعِيدٌ.','(٦) الْمُدَرِّسُ وَاقِفٌ.',
        '(٧) الْوَلَدُ جَالِسٌ.','(٨) الْبَيْتُ كَبِيرٌ.','(٩) الدَّفْتَرُ قَدِيمٌ.','(١٠) الْكِتَابُ جَدِيدٌ.'
      ]
    },
    {
      title: '5. Maan- en zonneletters',
      nl: 'Lees en schrijf met juiste uitspraak van ال.',
      items: [
        'الْبَيْتُ · الدِّيكُ · الْمُدَرِّسُ · الْبَابُ · الطَّالِبُ · السُّكَّرُ · الدَّفْتَرُ',
        'الْأَخُ · الرَّسُولُ · الْقُرْآنُ · الصَّلَاةُ · الْكَعْبَةُ · الْفَجْرُ · الظُّهْرُ · الْعَصْرُ'
      ]
    }
  ]
};

EX[4] = {
  title: 'Les 4',
  exercises: [
    {
      title: '1. Beantwoord de vragen (deel أ)',
      answers: [
        '(١) أَيْنَ الْكِتَابُ؟ هُوَ عَلَى الْمَكْتَبِ.',
        '(٢) أَيْنَ مُحَمَّدٌ؟ هُوَ فِي الْغُرْفَةِ.',
        '(٣) أَيْنَ السَّاعَةُ؟ هِيَ عَلَى السَّرِيرِ.',
        '(٤) أَيْنَ يَاسِرٌ؟ هُوَ فِي الْحَمَّامِ.',
        '(٥) أَيْنَ آمِنَةُ؟ هِيَ فِي الْمَطْبَخِ.',
        '(٦) أَآمِنَةُ فِي الْغُرْفَةِ؟ لَا.',
        '(٧) أَيَاسِرٌ فِي الْمَطْبَخِ؟ لَا.',
        '(٨) مَنْ فِي الْغُرْفَةِ؟ مُحَمَّدٌ.',
        '(٩) وَمَنْ فِي الْحَمَّامِ؟ يَاسِرٌ.',
        '(١٠) مَاذَا عَلَى الْمَكْتَبِ؟ الْكِتَابُ.',
        '(١١) مَاذَا عَلَى السَّرِيرِ؟ السَّاعَةُ.'
      ]
    },
    {
      title: '2. Lees en schrijf (zinnen)',
      items: [
        '(١) الطَّالِبُ فِي الْجَامِعَةِ.','(٢) الرَّجُلُ فِي الْمَسْجِدِ.',
        '(٣) أَيْنَ التَّاجِرُ؟ هُوَ فِي الدُّكَّانِ.','(٤) الْقَلَمُ عَلَى الْمَكْتَبِ.',
        '(٥) أَيْنَ زَيْنَبُ؟ هِيَ فِي الْغُرْفَةِ.','(٦) أَيْنَ الْمُدَرِّسُ؟ هُوَ فِي الْفَصْلِ.',
        '(٧) الشَّمْسُ وَالْقَمَرُ فِي السَّمَاءِ.'
      ]
    },
    {
      title: '3. Beantwoord (deel ب) — مِنْ / إِلَى',
      answers: [
        '(١) مِنْ أَيْنَ أَنْتَ؟ أَنَا مِنَ الْيَابَانِ.',
        '(٢) أَأَنْتَ مِنَ الْفِلِبِّينَ؟ لَا، أَنَا مِنَ الْيَابَانِ.',
        '(٣) مَنْ مِنَ الصِّينِ؟ عَمَّارٌ مِنَ الصِّينِ.',
        '(٤) مِنْ أَيْنَ حَامِدٌ؟ حَامِدٌ مِنَ الْهِنْدِ.',
        '(٥) أَيْنَ ذَهَبَ عَبَّاسٌ؟ ذَهَبَ إِلَى الْمُدِيرِ.',
        '(٦) أَذَهَبَ عَلِيٌّ إِلَى الْمُدِيرِ؟ لَا، ذَهَبَ إِلَى الْمِرْحَاضِ.'
      ]
    },
    {
      title: '4. Vul een voorzetsel in',
      nl: 'مِنْ · إِلَى · فِي · عَلَى',
      answers: [
        '(١) الْكِتَابُ عَلَى الْمَكْتَبِ.',
        '(٢) الطَّالِبُ فِي الْفَصْلِ.',
        '(٣) ذَهَبَ حَامِدٌ إِلَى الْجَامِعَةِ.',
        '(٤) خَرَجَ الْمُدِيرُ مِنَ الْمَدْرَسَةِ.',
        '(٥) ذَهَبَ مُحَمَّدٌ مِنَ الصِّينِ إِلَى الْيَابَانِ.'
      ]
    }
  ]
};

EX[5] = {
  title: 'Les 5',
  exercises: [
    {
      title: '1. Beantwoord de vragen',
      answers: [
        '(١) أَيْنَ كِتَابُ مُحَمَّدٍ؟ هُوَ عَلَى الْمَكْتَبِ هُنَاكَ.',
        '(٢) أَيْنَ دَفْتَرُ عَمَّارٍ؟ هُوَ عَلَى مَكْتَبِ الْمُدَرِّسِ.',
        '(٣) أَيْنَ حَقِيبَةُ الْمُدَرِّسِ؟ هِيَ تَحْتَ الْمَكْتَبِ.'
      ]
    },
    {
      title: '2. Maak de iḍāfa (bezitsconstructie)',
      answers: [
        'كِتَابُ مُحَمَّدٍ','مَكْتَبُ الْمُدَرِّسِ','قَلَمُ حَامِدٍ','مِفْتَاحُ الْبَيْتِ',
        'بَيْتُ عَبَّاسٍ','دُكَّانُ التَّاجِرِ','غُرْفَةُ عَلِيٍّ','كِتَابُ اللهِ'
      ]
    }
  ]
};

EX[6] = {
  title: 'Les 6',
  exercises: [
    {
      title: '1. Lees en schrijf',
      items: [
        '(١) هَذَا مَسْجِدٌ وَهَذِهِ مَدْرَسَةٌ.',
        '(٢) مَنْ هَذِهِ؟ هَذِهِ أُخْتُ عَبَّاسٍ.',
        '(٣) هَذَا دِيكٌ وَهَذِهِ دَجَاجَةٌ.',
        '(٤) هَذَا ابْنُ الْمُدِيرِ وَهَذِهِ بِنْتُ الْمُدَرِّسِ.',
        '(٥) هَذِهِ أُمُّ يَاسِرٍ.',
        '(٦) أَيْنَ قِدْرُ اللَّحْمِ؟ هِيَ فِي الثَّلَّاجَةِ.',
        '(٧) هَذَا بَابٌ وَهَذِهِ نَافِذَةٌ.'
      ]
    },
    {
      title: '2. مَا هَذَا وَمَا هَذِهِ؟',
      nl: 'Wat is dit (♂/♀)?',
      answers: ['هَذَا قَلَمٌ.','هَذَا كِتَابٌ.','هَذِهِ مِلْعَقَةٌ.','هَذِهِ سَاعَةٌ.','هَذَا بَابٌ.','هَذِهِ دَرَّاجَةٌ.']
    },
    {
      title: '3. Maak zinnen ♂ → ♀',
      answers: [
        'مُحَمَّدٌ طَالِبٌ → آمِنَةُ طَالِبَةٌ.',
        'حَامِدٌ طَبِيبٌ → فَاطِمَةُ طَبِيبَةٌ.',
        'هُوَ مُسْلِمٌ → هِيَ مُسْلِمَةٌ.',
        'الْبَابُ مُغْلَقٌ → النَّافِذَةُ مُغْلَقَةٌ.'
      ]
    }
  ]
};

EX[7] = {
  title: 'Les 7',
  exercises: [
    {
      title: '1. Lees en schrijf',
      items: [
        '(١) هَذِهِ مَدْرَسَةٌ وَتِلْكَ جَامِعَةٌ.',
        '(٢) ذَلِكَ حِمَارٌ وَتِلْكَ بَقَرَةٌ.',
        '(٣) أَذَلِكَ مَسْجِدٌ؟ لَا، تِلْكَ مَدْرَسَةٌ.',
        '(٤) هَذَا جَمَلٌ وَتِلْكَ نَاقَةٌ.',
        '(٥) هَذِهِ مُدَرِّسَةٌ وَتِلْكَ طَالِبَةٌ.'
      ]
    },
    {
      title: '2. Verwijs met ذَلِكَ / تِلْكَ',
      answers: ['تِلْكَ أُمٌّ.','ذَلِكَ أَبٌ.','ذَلِكَ قَلَمٌ.','تِلْكَ مِلْعَقَةٌ.','تِلْكَ بَقَرَةٌ.','ذَلِكَ مَكْتَبٌ.']
    }
  ]
};

EX[8] = {
  title: 'Les 8',
  exercises: [
    {
      title: '1. Beantwoord de vragen',
      answers: [
        '(١) هَذَا الرَّجُلُ تَاجِرٌ وَذَلِكَ الرَّجُلُ طَبِيبٌ.',
        '(٢) اسْمُ التَّاجِرِ مَحْمُودٌ.',
        '(٣) اسْمُ الطَّبِيبِ سَعِيدٌ.',
        '(٤) سَيَّارَةُ الطَّبِيبِ مِنَ الْيَابَانِ.',
        '(٥) سَيَّارَةُ التَّاجِرِ مِنْ أَمْرِيكَا.',
        '(٦) بَيْتُ التَّاجِرِ أَمَامَ الْمَسْجِدِ.',
        '(٧) بَيْتُ الطَّبِيبِ خَلْفَ الْمَدْرَسَةِ.'
      ]
    },
    {
      title: '2. Lees en schrijf',
      items: [
        '(١) هَذَا الْوَلَدُ خَالِدٌ وَذَلِكَ الْوَلَدُ مُحَمَّدٌ.',
        '(٢) هَذَا الرَّجُلُ مُدَرِّسٌ وَذَلِكَ الرَّجُلُ مُهَنْدِسٌ.',
        '(٣) هَذَا الْكِتَابُ جَدِيدٌ وَذَلِكَ الْكِتَابُ قَدِيمٌ.',
        '(٤) هَذِهِ السَّيَّارَةُ لِعَلِيٍّ وَتِلْكَ لِخَالِدٍ.'
      ]
    }
  ]
};

for (let n = 9; n <= 23; n++) {
  EX[n] = {
    title: 'Les ' + n,
    exercises: [{
      title: 'Oefeningen uit het lesboek',
      nl: 'De volledige oefeningen voor deze les worden nog overgenomen uit het Medina-lesboek. Les 1–8 zijn al compleet.',
      items: ['Binnenkort: alle تَمَارِينُ van les ' + n + '.']
    }]
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
    const items = (ex.items || []).map(t => `<li class="ar" lang="ar" dir="rtl">${E(t)}</li>`).join('');
    const ans = (ex.answers || []).map(t => `<li class="ar" lang="ar" dir="rtl">${E(t)}</li>`).join('');
    body += `<section class="ex-block card" style="margin-bottom:16px;padding:16px 18px">
      <h3 style="margin:0 0 6px;font-size:16px">${E(ex.title)}</h3>
      ${ex.nl ? `<p style="margin:0 0 10px;font-size:13.5px;color:var(--muted)">${E(ex.nl)}</p>` : ''}
      ${items ? `<ol class="ex-items" style="padding-right:1.2em;line-height:1.85">${items}</ol>` : ''}
      ${ans ? `<details class="ex-answers" style="margin-top:10px">
        <summary style="cursor:pointer;font-weight:600;font-size:13.5px">Toon uitwerking</summary>
        <ol style="padding-right:1.2em;line-height:1.85;margin-top:8px">${ans}</ol>
      </details>` : ''}
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
    <p style="color:var(--muted);font-size:13.5px;margin:-4px 0 16px">Medina-lesboek deel 1 · Oefeningen</p>
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
  if(typeof window.render === 'function'){
    window.render();
    window.scrollTo(0,0);
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
  }
  const open = t && t.closest && t.closest('[data-act="open-ex"]');
  if(open){
    const n = parseInt(open.getAttribute('data-l'), 10);
    if(!isNaN(n) && window.state){
      window.state.path = 'exercises';
      window.state.view = 'ex-lesson';
      window.state.exLesson = n;
      try { history.pushState(null,'','#/oefeningen/'+n); } catch(e){}
      if(window.render) window.render();
      window.scrollTo(0,0);
      e.preventDefault();
    }
  }
  const hub = t && t.closest && t.closest('[data-act="open-ex-hub"]');
  if(hub){
    if(window.state){
      window.state.path = 'exercises';
      window.state.view = 'ex';
      window.state.exLesson = null;
      try { history.pushState(null,'','#/oefeningen'); } catch(e){}
      if(window.render) window.render();
      window.scrollTo(0,0);
      e.preventDefault();
    }
  }
});

setTimeout(handleHash, 80);
})();
