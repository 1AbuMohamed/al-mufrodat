/* Al-Mufrodat · Grammatica Lab: woordenschat-leerpad en oefenrondes.
 * - Woorden komen uit vocab_words.js (afgeleid van BASE_WORDS in app_core.js).
 * - Voortgang staat in dezelfde sleutel als de gewone woordenschat (alm_progress),
 *   zodat beide kanten van de site dezelfde beheersing tonen.
 * - XP en streak gaan naar de XP van het Grammatica Lab (+ Leaderboard).
 * - Didactische opbouw met echte foto's (img/), 2x2 foto-keuze (ar2img),
 *   beeldherkenning (img2ar / img2nl), kleurstalen, conceptbadges, uitspraak
 *   en herhaling van fouten aan het eind van de ronde.
 * Er worden geen woorden of vertalingen verzonnen.
 */
(function () {
  'use strict';

  var K_PROG = 'alm_progress';
  var K_XP = 'alm_vocab_xp';
  var K_SET = 'alm_grammar_test_settings_v1';
  var MASTERY = 2;      // zelfde drempel als de gewone woordenschat (box >= 2)
  var MAX_HEARTS = 5;
  var TITLES = {
    1: 'Huis & Voorwerpen', 2: 'Dit & Dat op Afstand', 3: 'Eigenschappen & Tegenstellingen', 4: 'Plekken & Kamers',
    5: 'Bezit & Familie', 6: 'Lichaamsdelen & Vrouwelijk', 7: 'Dieren & Verwijzingen', 8: 'Beroepen & Plaatsen',
    9: 'Beschrijvingen & Talen', 10: 'Relaties & Gezin', 11: 'In het Huis', 12: 'Vrouwelijke Personen & Familie',
    13: 'Mensen & Meervouden', 14: 'Faculteiten & Beroepen', 15: 'Dames & Tijdstippen', 16: 'Reizen & Gebouwen',
    17: 'Bedrijf & Handel', 18: 'Tijd & School', 19: 'Reizen & Getallen (m)', 20: 'Kamers & Getallen (v)',
    21: 'Mijn School', 22: 'Kleuren & Sleutels', 23: 'Steden & Landen', 24: 'Reader · Tijd & Handelingen'
  };

  var app = null, S = null, bound = false, fastTimer = 0;

  /* ---------- hulpfuncties ---------- */
  function speedMode() {
    if (window.GrammarLabParse && window.GrammarLabParse.speedMode) return window.GrammarLabParse.speedMode();
    var s = jget(K_SET, {});
    if (s.speed === 'super' || s.speed === 'fast' || s.speed === 'off') return s.speed;
    return s.fast === true ? 'fast' : 'off';
  }
  function fastOn() { return speedMode() !== 'off'; }
  function superOn() { return speedMode() === 'super'; }
  function cycleSpeed() {
    if (window.GrammarLabParse && window.GrammarLabParse.cycleSpeed) return window.GrammarLabParse.cycleSpeed();
    var cur = speedMode(), nxt = cur === 'off' ? 'fast' : (cur === 'fast' ? 'super' : 'off');
    var s = jget(K_SET, {}); s.speed = nxt; s.fast = (nxt !== 'off'); jset(K_SET, s);
    return nxt;
  }
  function scheduleFastNext(ok) {
    clearTimeout(fastTimer);
    if (!fastOn()) return;
    fastTimer = setTimeout(function () { if (S && S.fb && S.screen === 'play') next(); }, superOn() ? 250 : (ok ? 500 : 1000));
  }
  function esc(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function jget(key, def) {
    try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : def; } catch (_e) { return def; }
  }
  function jset(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_e) {} }
  function shuffle(list) {
    var a = list.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function words() { return Array.isArray(window.AL_VOCAB) ? window.AL_VOCAB : []; }
  function wordsFor(n) { return words().filter(function (w) { return w.lesson === n; }); }
  function lessonNums() {
    var seen = {};
    words().forEach(function (w) { seen[w.lesson] = true; });
    return Object.keys(seen).map(Number).filter(function (n) { return n >= 1; }).sort(function (a, b) { return a - b; });
  }
  function getP(map, id) { return map[id] || { box: 0, seen: 0, correct: 0 }; }

  function speak(text) {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    } catch (_e) {}
  }

  function icon(name) {
    var paths = {
      heart: '<path fill="currentColor" stroke="currentColor" d="M20 5a5 5 0 0 0-7 0l-1 1-1-1a5 5 0 0 0-7 7l8 9 8-9a5 5 0 0 0 0-7Z"/>',
      heartHalf: '<path fill="currentColor" stroke="none" d="M11.3 6.2 11 5a5 5 0 0 0-7 7l7.4 8.5.8-5.3-2.4-3 1.9-3.2Z"/><path fill="currentColor" stroke="none" opacity=".16" transform="translate(1.2 .6)" d="M13 5a5 5 0 0 1 7 7l-7.4 8.4 1-5.4-2.4-3 1.9-3.2Z"/>',
      heartBroken: '<path fill="currentColor" stroke="none" d="M11.3 6.2 11 5a5 5 0 0 0-7 7l7.4 8.5.8-5.3-2.4-3 1.9-3.2Z"/><path fill="currentColor" stroke="none" opacity=".65" transform="translate(1.2 .6)" d="M13 5a5 5 0 0 1 7 7l-7.4 8.4 1-5.4-2.4-3 1.9-3.2Z"/>',
      crown: '<path d="m2 7 5 4 5-8 5 8 5-4-2 12H4Z"/>',
      home: '<path d="m3 10 9-7 9 7v11H3Z"/><path d="M9 21v-8h6v8"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>',
      speaker: '<path d="M4 9v6h4l5 4V5L8 9Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/>',
      camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>'
    };
    return '<svg class="gd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || '') + '</svg>';
  }

  /* ---------- visuele ondersteuning (foto's, kleuren & badges) ---------- */
  function norm(s) {
    return String(s || '').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim();
  }

  var PHOTO_MAP = {
    'بيت': 'img/house.jpg', 'بيوت': 'img/house.jpg', 'مسجد': 'img/mosque.jpg', 'مساجد': 'img/mosque.jpg',
    'باب': 'img/door.jpg', 'ابواب': 'img/door.jpg', 'كتاب': 'img/book.jpg', 'كتب': 'img/book.jpg',
    'قلم': 'img/pen.jpg', 'اقلام': 'img/pen.jpg', 'مفتاح': 'img/key.jpg', 'مفاتيح': 'img/key.jpg',
    'مكتب': 'img/desk.jpg', 'مكاتب': 'img/desk.jpg', 'سرير': 'img/bed.jpg', 'سرر': 'img/bed.jpg',
    'كرسي': 'img/chair.jpg', 'كراسي': 'img/chair.jpg', 'نجم': 'img/star.jpg', 'نجوم': 'img/star.jpg',
    'قميص': 'img/shirt.jpg', 'قمصان': 'img/shirt.jpg', 'طبيب': 'img/doctor.jpg', 'اطباء': 'img/doctor.jpg',
    'طبيبه': 'img/doctor.jpg', 'طبيبات': 'img/doctor.jpg', 'ولد': 'img/boy.jpg', 'اولاد': 'img/boy.jpg',
    'طالب': 'img/student.jpg', 'طلاب': 'img/student.jpg', 'طالبه': 'img/student.jpg', 'طالبات': 'img/student.jpg',
    'رجل': 'img/man.jpg', 'رجال': 'img/man.jpg', 'تاجر': 'img/merchant.jpg', 'تجار': 'img/merchant.jpg',
    'كلب': 'img/dog.jpg', 'كلاب': 'img/dog.jpg', 'قط': 'img/cat.jpg', 'قطط': 'img/cat.jpg',
    'حمار': 'img/donkey.jpg', 'حمير': 'img/donkey.jpg', 'حمر': 'img/donkey.jpg', 'حصان': 'img/horse.jpg',
    'احصنه': 'img/horse.jpg', 'خيل': 'img/horse.jpg', 'فرس': 'img/horse.jpg', 'جمل': 'img/camel.jpg',
    'جمال': 'img/camel.jpg', 'ناقه': 'img/camel.jpg', 'ديك': 'img/rooster.jpg', 'ديوك': 'img/rooster.jpg',
    'مدرس': 'img/teacher.jpg', 'مدرسون': 'img/teacher.jpg', 'مدرسه': 'img/school.jpg', 'مدارس': 'img/school.jpg',
    'استاذ': 'img/teacher.jpg', 'اساتذه': 'img/teacher.jpg', 'منديل': 'img/handkerchief.jpg', 'مناديل': 'img/handkerchief.jpg',
    'امام': 'img/imam.jpg', 'ائمه': 'img/imam.jpg', 'حجر': 'img/stone.jpg', 'احجار': 'img/stone.jpg',
    'سكر': 'img/sugar.jpg', 'لبن': 'img/milk.jpg', 'حليب': 'img/milk.jpg', 'ورق': 'img/paper.jpg',
    'اوراق': 'img/paper.jpg', 'ماء': 'img/water.jpg', 'مياه': 'img/water.jpg', 'تفاح': 'img/apple.jpg',
    'دكان': 'img/shop.jpg', 'دكاكين': 'img/shop.jpg', 'شمس': 'img/sun.jpg', 'قمر': 'img/moon.jpg',
    'غرفه': 'img/room.jpg', 'غرف': 'img/room.jpg', 'سماء': 'img/sky.jpg', 'سموات': 'img/sky.jpg',
    'حمام': 'img/bathroom.jpg', 'حمامات': 'img/bathroom.jpg', 'فصل': 'img/classroom.jpg', 'فصول': 'img/classroom.jpg',
    'مطبخ': 'img/kitchen.jpg', 'مطابخ': 'img/kitchen.jpg', 'مرحاض': 'img/bathroom.jpg', 'مراحيض': 'img/bathroom.jpg',
    'جامعه': 'img/university.jpg', 'جامعات': 'img/university.jpg', 'سوق': 'img/shop.jpg', 'اسواق': 'img/shop.jpg',
    'مدير': 'img/teacher.jpg', 'يابان': 'img/city.jpg', 'صين': 'img/city.jpg', 'هند': 'img/city.jpg',
    'فلبين': 'img/city.jpg', 'شارع': 'img/city.jpg', 'شوارع': 'img/city.jpg', 'سياره': 'img/car.jpg',
    'سيارات': 'img/car.jpg', 'حقيبه': 'img/bag.jpg', 'حقائب': 'img/bag.jpg', 'اخت': 'img/girl.jpg',
    'اخوات': 'img/girl.jpg', 'بنت': 'img/girl.jpg', 'بنات': 'img/girl.jpg', 'قدر': 'img/kitchen.jpg',
    'ملعقه': 'img/spoon.jpg', 'ملاعق': 'img/spoon.jpg', 'بقره': 'img/cow.jpg', 'بقر': 'img/cow.jpg',
    'فلاح': 'img/man.jpg', 'فلاحون': 'img/man.jpg', 'ام': 'img/mother.jpg', 'امهات': 'img/mother.jpg',
    'اب': 'img/man.jpg', 'اباء': 'img/man.jpg', 'شاي': 'img/tea.jpg', 'قهوه': 'img/coffee.jpg',
    'مشرق': 'img/sun.jpg', 'مغرب': 'img/sun.jpg', 'دراجه': 'img/bike.jpg', 'دراجات': 'img/bike.jpg',
    'بيضه': 'img/egg.jpg', 'بيض': 'img/egg.jpg', 'مؤذن': 'img/imam.jpg', 'مؤذنون': 'img/imam.jpg',
    'بطه': 'img/duck.jpg', 'بط': 'img/duck.jpg', 'دجاجه': 'img/chicken.jpg', 'دجاج': 'img/chicken.jpg',
    'مستشفي': 'img/hospital.jpg', 'مستشفيات': 'img/hospital.jpg', 'سكين': 'img/knife.jpg', 'سكاكين': 'img/knife.jpg',
    'طائر': 'img/bird.jpg', 'طيور': 'img/bird.jpg', 'عصفور': 'img/bird.jpg', 'عصافير': 'img/bird.jpg',
    'مدينه': 'img/city.jpg', 'مدن': 'img/city.jpg', 'قاهره': 'img/city.jpg', 'زميل': 'img/student.jpg',
    'زملاء': 'img/student.jpg', 'زوج': 'img/man.jpg', 'زوجه': 'img/girl.jpg', 'طفل': 'img/child.jpg',
    'اطفال': 'img/child.jpg', 'كويت': 'img/city.jpg', 'اخ': 'img/boy.jpg', 'اخوه': 'img/boy.jpg',
    'شجره': 'img/tree.jpg', 'اشجار': 'img/tree.jpg', 'حديقه': 'img/tree.jpg', 'حدائق': 'img/tree.jpg',
    'مهندس': 'img/man.jpg', 'مهندسون': 'img/man.jpg', 'حاج': 'img/man.jpg', 'حجاج': 'img/man.jpg',
    'فندق': 'img/city.jpg', 'فنادق': 'img/city.jpg', 'طائره': 'img/sky.jpg', 'طائرات': 'img/sky.jpg',
    'بحر': 'img/water.jpg', 'بحار': 'img/water.jpg', 'شركه': 'img/city.jpg', 'شركات': 'img/city.jpg',
    'ساعه': 'img/clock.jpg', 'ساعات': 'img/clock.jpg', 'فنجان': 'img/cup.jpg', 'فناجين': 'img/cup.jpg',
    'بغداد': 'img/city.jpg', 'جده': 'img/city.jpg', 'مكه': 'img/city.jpg', 'دمشق': 'img/city.jpg',
    'رياض': 'img/city.jpg', 'اصطنبول': 'img/city.jpg', 'طائف': 'img/city.jpg', 'واشنطن': 'img/city.jpg',
    'مكتبه': 'img/library.jpg', 'مكتبات': 'img/library.jpg', 'فاكهه': 'img/fruit.jpg', 'فواكه': 'img/fruit.jpg',
    'سمك': 'img/fish.jpg', 'اسماك': 'img/fish.jpg', 'ثلاجه': 'img/fridge.jpg', 'ثلاجات': 'img/fridge.jpg',
    'نافذه': 'img/window.jpg', 'نوافذ': 'img/window.jpg', 'زهور': 'img/flower.jpg', 'زهره': 'img/flower.jpg',
    'ازهار': 'img/flower.jpg'
  };

  var NL_PHOTO_MAP = [
    ['theekopje', 'img/cup.jpg'], ['klaslokaal', 'img/classroom.jpg'], ['universiteit', 'img/university.jpg'],
    ['bibliotheek', 'img/library.jpg'], ['ziekenhuis', 'img/hospital.jpg'], ['handelaar', 'img/merchant.jpg'],
    ['badkamer', 'img/bathroom.jpg'], ['koelkast', 'img/fridge.jpg'], ['zakdoek', 'img/handkerchief.jpg'],
    ['horloge', 'img/clock.jpg'], ['yoghurt', 'img/milk.jpg'], ['sleutel', 'img/key.jpg'],
    ['student', 'img/student.jpg'], ['moskee', 'img/mosque.jpg'], ['bureau', 'img/desk.jpg'],
    ['dokter', 'img/doctor.jpg'], ['jongen', 'img/boy.jpg'], ['meisje', 'img/girl.jpg'],
    ['kameel', 'img/camel.jpg'], ['leraar', 'img/teacher.jpg'], ['docent', 'img/teacher.jpg'],
    ['suiker', 'img/sugar.jpg'], ['papier', 'img/paper.jpg'], ['winkel', 'img/shop.jpg'],
    ['toilet', 'img/bathroom.jpg'], ['keuken', 'img/kitchen.jpg'], ['school', 'img/school.jpg'],
    ['koffie', 'img/coffee.jpg'], ['moeder', 'img/mother.jpg'], ['bloem', 'img/flower.jpg'],
    ['vogel', 'img/bird.jpg'], ['fruit', 'img/fruit.jpg'], ['kopje', 'img/cup.jpg'],
    ['lepel', 'img/spoon.jpg'], ['fiets', 'img/bike.jpg'], ['markt', 'img/shop.jpg'],
    ['hemel', 'img/sky.jpg'], ['lucht', 'img/sky.jpg'], ['kamer', 'img/room.jpg'],
    ['appel', 'img/apple.jpg'], ['water', 'img/water.jpg'], ['steen', 'img/stone.jpg'],
    ['paard', 'img/horse.jpg'], ['stoel', 'img/chair.jpg'], ['huis', 'img/house.jpg'],
    ['deur', 'img/door.jpg'], ['boek', 'img/book.jpg'], ['ster', 'img/star.jpg'],
    ['hemd', 'img/shirt.jpg'], ['kind', 'img/child.jpg'], ['hond', 'img/dog.jpg'],
    ['ezel', 'img/donkey.jpg'], ['haan', 'img/rooster.jpg'], ['imam', 'img/imam.jpg'],
    ['melk', 'img/milk.jpg'], ['maan', 'img/moon.jpg'], ['auto', 'img/car.jpg'],
    ['thee', 'img/tea.jpg'], ['eend', 'img/duck.jpg'], ['stad', 'img/city.jpg'],
    ['boom', 'img/tree.jpg'], ['raam', 'img/window.jpg'], ['klok', 'img/clock.jpg'],
    ['pen', 'img/pen.jpg'], ['bed', 'img/bed.jpg'], ['man', 'img/man.jpg'],
    ['kat', 'img/cat.jpg'], ['zon', 'img/sun.jpg'], ['tas', 'img/bag.jpg'],
    ['koe', 'img/cow.jpg'], ['kip', 'img/chicken.jpg'], ['mes', 'img/knife.jpg'],
    ['mus', 'img/bird.jpg'], ['vis', 'img/fish.jpg']
  ];

  var COLOR_MAP = {
    'ابيض': { color: '#FFFFFF', border: '#D0D0D0', name: 'wit' },
    'اسود': { color: '#1F2937', border: '#111827', name: 'zwart' },
    'احمر': { color: '#EF4444', border: '#DC2626', name: 'rood' },
    'اصفر': { color: '#FACC15', border: '#EAB308', name: 'geel' },
    'اخضر': { color: '#22C55E', border: '#16A34A', name: 'groen' },
    'ازرق': { color: '#3B82F6', border: '#2563EB', name: 'blauw' }
  };

  var BADGE_MAP = {
    'بارد': '❄️', 'حار': '🔥', 'طويل': '📏', 'قصير': '📐', 'كبير': '🐘', 'صغير': '🐜',
    'غني': '💰', 'فقير': '🪙', 'جديد': '✨', 'قديم': '⏳', 'نظيف': '🧼', 'وسخ': '🫧',
    'خفيف': '🪶', 'ثقيل': '🏋️', 'مفتوح': '🔓', 'مكسور': '🔨', 'حلو': '🍯', 'مريض': '🩹',
    'جميل': '🌸', 'قريب': '📍', 'بعيد': '🔭', 'واسع': '↔️', 'شكرا': '🙏', 'سؤال': '❓',
    'يوم': '📅', 'دقيقه': '⏱️', 'مجله': '📰', 'درس': '📚', 'حرف': '🔤', 'كلمه': '💬',
    'كلمات': '💬', 'لون': '🎨', 'الوان': '🎨', 'جالس': '🪑', 'واقف': '🚶', 'كريم': '🎁',
    'ذهب': '🚶‍♂️', 'خرج': '🚪🚶', 'دخل': '🚪👈', 'جلس': '🪑', 'قال': '🗣️', 'قالت': '🗣️',
    'سافر': '✈️', 'ساعد': '🤝', 'امس': '⏪', 'البارحه': '🌙', 'في': '📥', 'علي': '📦',
    'تحت': '⬇️', 'امام': '➡️', 'خلف': '⬅️', 'واحد': '1️⃣', 'اثنان': '2️⃣', 'ثلاثه': '3️⃣',
    'اربعه': '4️⃣', 'خمسه': '5️⃣', 'سته': '6️⃣', 'سبعه': '7️⃣', 'ثمانيه': '8️⃣', 'تسعه': '9️⃣',
    'عشره': '🔟'
  };

  function getVisual(w) {
    if (!w) return null;
    var ar = norm(w.ar);
    for (var ck in COLOR_MAP) {
      if (ar.indexOf(ck) >= 0) return { type: 'color', color: COLOR_MAP[ck].color, border: COLOR_MAP[ck].border, name: COLOR_MAP[ck].name };
    }
    for (var pk in PHOTO_MAP) {
      if (ar.indexOf(pk) >= 0) return { type: 'photo', src: PHOTO_MAP[pk] };
    }
    var nl = String(w.nl || '').toLowerCase().trim().replace(/^(een|de|het)\s+/, '');
    for (var i = 0; i < NL_PHOTO_MAP.length; i++) {
      if (nl.indexOf(NL_PHOTO_MAP[i][0]) >= 0) return { type: 'photo', src: NL_PHOTO_MAP[i][1] };
    }
    for (var bk in BADGE_MAP) {
      if (ar.indexOf(bk) >= 0) return { type: 'badge', icon: BADGE_MAP[bk] };
    }
    return null;
  }

  function picUrl(w) {
    var v = getVisual(w);
    return v && v.type === 'photo' ? v.src : null;
  }

  function renderVisual(w, mode) {
    var v = getVisual(w);
    if (!v) {
      if (mode === 'thumb') return '<div class="vl-thumb-box fallback"><span class="vl-badge-letter" lang="ar">' + esc(w && w.ar ? w.ar.charAt(0) : '؟') + '</span></div>';
      if (mode === 'feedback') return '<div class="vl-fb-visual fallback"><span class="vl-badge-letter" lang="ar">' + esc(w && w.ar ? w.ar.charAt(0) : '؟') + '</span></div>';
      return '';
    }
    if (mode === 'hero') {
      if (v.type === 'photo') {
        return '<div class="vl-hero-visual"><img src="' + esc(v.src) + '" alt="' + esc((w && w.nl) || 'Afbeelding') + '" class="vl-hero-img" loading="eager" decoding="async"></div>';
      }
      if (v.type === 'color') {
        return '<div class="vl-hero-color" style="border-color:' + (v.border || 'var(--line)') + '">' +
          '<span class="vl-hero-swatch" style="background:' + v.color + ';border:2px solid ' + (v.border || 'transparent') + '"></span>' +
          '<strong class="vl-hero-color-name">' + esc(v.name || (w && w.nl) || '') + '</strong></div>';
      }
      return '<div class="vl-hero-badge"><span class="vl-hero-emoji">' + v.icon + '</span><span class="vl-hero-badgelb">' + esc((w && w.nl) || '') + '</span></div>';
    }
    if (mode === 'question') {
      if (v.type === 'photo') return '<div class="vl-q-photo"><img src="' + esc(v.src) + '" alt="' + esc((w && w.nl) || '') + '" loading="lazy" decoding="async"></div>';
      if (v.type === 'color') return '<div class="vl-q-color"><span class="vl-swatch-dot" style="background:' + v.color + ';border:1px solid ' + (v.border || 'transparent') + '"></span></div>';
      return '<div class="vl-q-badge"><span class="vl-emoji">' + v.icon + '</span></div>';
    }
    if (mode === 'thumb') {
      if (v.type === 'photo') return '<div class="vl-thumb-box"><img src="' + esc(v.src) + '" class="vl-thumb-img" alt="' + esc((w && w.nl) || '') + '" loading="lazy" decoding="async"></div>';
      if (v.type === 'color') return '<div class="vl-thumb-box"><span class="vl-color-dot" style="background:' + v.color + ';border:1px solid ' + (v.border || 'transparent') + '"></span></div>';
      return '<div class="vl-thumb-box"><span class="vl-badge-emoji">' + v.icon + '</span></div>';
    }
    if (mode === 'feedback') {
      if (v.type === 'photo') return '<div class="vl-fb-visual"><img src="' + esc(v.src) + '" alt="' + esc((w && w.nl) || '') + '" loading="lazy" decoding="async"></div>';
      if (v.type === 'color') return '<div class="vl-fb-visual"><span class="vl-color-dot" style="background:' + v.color + ';border:1px solid ' + (v.border || 'transparent') + '"></span></div>';
      return '<div class="vl-fb-visual"><span class="vl-badge-emoji">' + v.icon + '</span></div>';
    }
    if (mode === 'mini') {
      if (v.type === 'photo') return '<span class="vl-tile-mini"><img src="' + esc(v.src) + '" alt="" loading="lazy" decoding="async"></span>';
      if (v.type === 'color') return '<span class="vl-tile-mini"><span class="vl-swatch-dot" style="background:' + v.color + ';border:1px solid ' + (v.border || 'transparent') + '"></span></span>';
      return '<span class="vl-tile-mini-emoji">' + v.icon + '</span>';
    }
    return '';
  }

  /* ---------- leerpad (zelfde vorm als het grammatica-plan) ---------- */
  function stats(n, map) {
    var ws = wordsFor(n), total = ws.length, mastered = 0, seen = 0;
    ws.forEach(function (w) {
      var p = getP(map, w.id);
      if (p.box >= MASTERY) mastered++;
      if (p.seen > 0 || p.box > 0) seen++;
    });
    return { total: total, mastered: mastered, seen: seen };
  }
  function plan() {
    var map = jget(K_PROG, {});
    var list = lessonNums().map(function (n) {
      var st = stats(n, map);
      var done = st.total > 0 && st.mastered >= st.total;
      var crowns = done ? 5 : Math.min(4, Math.round(5 * st.mastered / Math.max(1, st.total)));
      var state = done ? 'mastered' : (st.seen > 0 || st.mastered > 0 ? 'going' : 'none');
      return {
        n: n, kind: 'vocab', has: true, read: false, weak: false, sub: TITLES[n] || '', page: st.total + ' woorden',
        total: st.total, mastered: st.mastered, m: crowns, state: state,
        pct: done ? 100 : (state === 'none' ? 0 : Math.max(10, Math.round(100 * st.mastered / Math.max(1, st.total))))
      };
    });
    var cur = list.filter(function (o) { return o.state !== 'mastered'; })[0] || list[0];
    return { kind: 'vocab', list: list, weak: [], cur: cur };
  }
  function totals() {
    var map = jget(K_PROG, {}), all = words(), m = 0;
    all.forEach(function (w) { if (getP(map, w.id).box >= MASTERY) m++; });
    return { total: all.length, mastered: m };
  }

  /* ---------- vragen & didactische strategie ---------- */
  function distractors(word, n, field, count) {
    var pool = wordsFor(n).filter(function (w) { return w.id !== word.id; });
    var extra = words().filter(function (w) { return w.lesson !== n && Math.abs(w.lesson - n) <= 3; });
    var out = [], used = {};
    used[word[field]] = true;
    shuffle(pool).concat(shuffle(extra)).concat(shuffle(words())).forEach(function (w) {
      if (out.length >= count || used[w[field]]) return;
      used[w[field]] = true; out.push(w[field]);
    });
    return out;
  }
  function choice(word, n, type) {
    var field = (type === 'ar2nl' || type === 'img2nl') ? 'nl' : 'ar';
    var options = shuffle([word[field]].concat(distractors(word, n, field, 3)));
    return { type: type, word: word, answer: word[field], options: options };
  }
  function choiceImgGrid(word, n) {
    var url0 = picUrl(word);
    var pool = wordsFor(n).filter(function (w) { var u = picUrl(w); return w.id !== word.id && u && u !== url0; });
    if (pool.length < 3) {
      var more = words().filter(function (w) { var u = picUrl(w); return w.id !== word.id && u && u !== url0; });
      pool = pool.concat(shuffle(more));
    }
    var picked = [], seenUrl = {};
    if (url0) seenUrl[url0] = true;
    shuffle(pool).forEach(function (w) {
      var u = picUrl(w);
      if (picked.length >= 3 || !u || seenUrl[u]) return;
      seenUrl[u] = true;
      picked.push(w);
    });
    if (picked.length < 3) return choice(word, n, 'ar2nl');
    var opts = shuffle([word].concat(picked));
    return { type: 'ar2img', word: word, answer: word.id, options: opts };
  }
  function build(n) {
    var map = jget(K_PROG, {});
    var ws = wordsFor(n).sort(function (a, b) {
      return getP(map, a.id).box - getP(map, b.id).box || Math.random() - 0.5;
    });
    var targets = shuffle(ws.slice(0, 8));
    var qs = [];

    // Strategie voor makkelijk leren (van herkennen naar produceren):
    // 1. Eerst visuele herkenning & begrip (ar2img: 2x2 foto-keuze, of ar2nl met plaatje)
    // 2. Daarna actieve productie (pic2ar: foto -> Arabisch, of nl2ar met plaatje)
    // 3. Koppelspel (match) halverwege voor snelle automatisering
    targets.forEach(function (w, i) {
      var hasPhoto = !!picUrl(w);
      var box = getP(map, w.id).box || 0;
      if (hasPhoto && (i % 3 === 0 || (box === 0 && i < 2))) {
        qs.push(i % 2 === 0 ? choice(w, n, 'pic2ar') : choiceImgGrid(w, n));
      } else if (i % 2 === 0) {
        qs.push(choice(w, n, 'ar2nl'));
      } else {
        qs.push(choice(w, n, 'nl2ar'));
      }
    });

    if (qs.length < 5) {
      targets.forEach(function (w, i) {
        if (qs.length < 6) qs.push(choice(w, n, i % 2 ? 'ar2nl' : 'nl2ar'));
      });
    }

    if (ws.length >= 3) {
      var pairs = shuffle(ws.slice(0, Math.min(ws.length, 8))).slice(0, Math.min(4, ws.length));
      var match = {
        type: 'match', words: pairs,
        left: shuffle(pairs.map(function (w) { return w.id; })),
        right: shuffle(pairs.map(function (w) { return w.id; })),
        done: {}, sel: null, wrong: null, slipped: {}
      };
      qs.splice(Math.min(3, qs.length), 0, match);
    }
    return qs.slice(0, 10);
  }

  /* ---------- sessie ---------- */
  function open(n, mode) {
    clearTimeout(fastTimer);
    n = Number(n);
    if (!wordsFor(n).length) return;
    app = document.getElementById('gd-app');
    if (!app) return;
    bind();
    S = { n: n, screen: mode === 'words' ? 'words' : 'play', qs: [], i: 0, hearts: MAX_HEARTS, correct: 0, attempts: 0,
      xp: 0, chosen: -1, fb: null, committed: false, wrongIds: {}, missed: [], queued: false, perfect: true };
    if (S.screen === 'play') S.qs = build(n);
    document.body.classList.remove('lh-on');
    document.body.classList.add('lh-skin');
    render();
  }
  function wordById(id) { return words().filter(function (w) { return w.id === id; })[0]; }

  function bump(id, ok) {
    var map = jget(K_PROG, {}), p = getP(map, id);
    p = { box: p.box | 0, seen: (p.seen | 0) + 1, correct: p.correct | 0 };
    if (ok) { p.box = Math.min(MASTERY, p.box + 1); p.correct++; }
    else p.box = Math.max(0, p.box - 1);
    map[id] = p;
    jset(K_PROG, map);
  }
  function score(ok, id, xp) {
    S.attempts++;
    if (ok) { S.correct++; S.xp += xp == null ? 10 : xp; }
    else { S.hearts = Math.max(0, S.hearts - 0.5); S.perfect = false; }
    if (id) bump(id, ok);
  }
  function commitXp() {
    if (!S || S.committed) return;
    S.committed = true;
    var bonus = S.perfect && S.attempts > 0 && S.i >= S.qs.length ? 5 : 0;
    S.xp += bonus;
    if (S.xp <= 0) return;
    try { jset(K_XP, Math.max(0, parseInt(localStorage.getItem(K_XP) || '0', 10) || 0) + S.xp); } catch (_e) {}
    try { if (window.GrammarLabLeaderboard && window.GrammarLabLeaderboard.publish) window.GrammarLabLeaderboard.publish(); } catch (_e2) {}
    if (window.GrammarLabEngine && window.GrammarLabEngine.addXp) {
      window.GrammarLabEngine.addXp(S.xp, S.perfect && S.attempts > 0 && S.i >= S.qs.length);
    }
  }
  function leave() {
    clearTimeout(fastTimer);
    commitXp();
    S = null;
    var home = window.GrammarLabHome;
    if (home && home.enter) { try { home.enter(); } catch (_e) {} }
    if (window.GrammarLabEngine && window.GrammarLabEngine.refresh) window.GrammarLabEngine.refresh();
    if (window.scrollTo) window.scrollTo(0, 0);
  }

  function current() { return S && S.qs[S.i]; }
  function answered() {
    var q = current();
    if (!q) return false;
    return q.type === 'match' ? false : S.chosen >= 0;
  }
  function check() {
    var q = current();
    if (!q || S.fb || q.type === 'match' || S.chosen < 0) return;
    var pick = q.options[S.chosen];
    var ok = q.type === 'ar2img' ? (pick && pick.id === q.answer) : (pick === q.answer);
    score(ok, q.word.id);
    if (!ok) {
      S.wrongIds[q.word.id] = true;
      if (!S.queued) S.missed.push(choice(q.word, S.n, picUrl(q.word) ? 'pic2ar' : 'nl2ar'));
    }
    S.fb = { ok: ok };
    render();
    scheduleFastNext(ok);
  }
  function next() {
    clearTimeout(fastTimer);
    if (!S) return;
    if (S.hearts <= 0) { S.screen = 'fail'; S.fb = null; render(); return; }
    S.i++; S.chosen = -1; S.fb = null;
    // Herhaal gemiste woorden als de leerling nog hartjes heeft
    if (S.i >= S.qs.length && S.hearts > 0 && !S.queued && S.missed.length) {
      S.queued = true;
      S.qs = S.qs.concat(S.missed.slice());
    }
    if (S.i >= S.qs.length) { S.screen = 'done'; commitXp(); }
    render();
  }
  function matchTap(side, id) {
    var q = current();
    if (!q || q.type !== 'match' || S.fb || q.done[id] || q.wrong) return;
    if (!q.sel || q.sel.side === side) { q.sel = { side: side, id: id }; render(); return; }
    var okPair = q.sel.id === id;
    if (okPair) {
      q.done[id] = true; q.sel = null;
      if (!q.slipped[id]) score(true, id, 5);
      if (Object.keys(q.done).length >= q.words.length) {
        S.fb = { ok: true, match: true };
        render();
        scheduleFastNext(true);
        return;
      }
      render();
      return;
    }
    // fout paar: kost een half hartje; de twee woorden worden als fout geteld
    var a = q.sel.id, b = id;
    q.wrong = { a: a, b: b, side: side };
    S.hearts = Math.max(0, S.hearts - 0.5); S.perfect = false;
    [a, b].forEach(function (x) { if (!q.slipped[x]) { q.slipped[x] = true; S.attempts++; bump(x, false); } });
    render();
    setTimeout(function () {
      if (!S || current() !== q) return;
      q.wrong = null; q.sel = null;
      if (S.hearts <= 0) { S.screen = 'fail'; }
      render();
    }, 650);
  }

  /* ---------- weergave ---------- */
  function bar(label, pct) {
    var hearts = '';
    for (var i = 0; i < MAX_HEARTS; i++) {
      var rem = S.hearts - i;
      var cls = rem >= 1 ? 'alive' : rem >= 0.5 ? 'half' : 'lost';
      var ic = rem >= 1 ? 'heart' : rem >= 0.5 ? 'heartHalf' : 'heartBroken';
      hearts += '<span class="' + cls + '">' + icon(ic) + '</span>';
    }
    return '<div class="gd-lesson-bar">' +
      '<button type="button" class="vl-exit" data-vl="exit" aria-label="Terug naar het leerpad">' + icon('close') + '</button>' +
      '<div class="gd-progress-wrap"><div class="gd-progress-title"><strong>Woordenschat · Les ' + S.n + '</strong><span>' + esc(label) + '</span></div>' +
      '<div class="gd-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div></div>' +
      '<div class="gd-bar-hearts" aria-label="' + String(S.hearts).replace('.', ',') + ' van ' + MAX_HEARTS + ' hartjes">' + hearts + '</div>' +
      '<button type="button" class="gd-fast' + (fastOn() ? ' on' : '') + (superOn() ? ' super' : '') + '" data-vl="fast" aria-pressed="' + fastOn() + '" title="' + (superOn() ? 'Supersnel: toont alleen juist/fout en gaat meteen door' : (fastOn() ? 'Snelle modus · klik nogmaals voor Supersnel' : 'Normaal · klik voor Snel of Supersnel')) + '">' + (superOn() ? '⚡⚡ Supersnel' : '⚡ Snel') + '</button></div>';
  }

  function wordsScreen() {
    var ws = wordsFor(S.n), map = jget(K_PROG, {});
    var totalMastered = ws.filter(function (w) { return getP(map, w.id).box >= MASTERY; }).length;
    var pct = ws.length ? Math.round((100 * totalMastered) / ws.length) : 0;
    return '<div class="gd-shell gd-play vl">' +
      '<div class="gd-lesson-bar"><button type="button" class="vl-exit" data-vl="exit" aria-label="Terug naar het leerpad">' + icon('close') + '</button>' +
      '<div class="gd-progress-wrap"><div class="gd-progress-title"><strong>Woordenschat · Les ' + S.n + '</strong><span>' + ws.length + ' woorden</span></div>' +
      '<div class="gd-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div></div></div>' +
      '<div class="gd-card"><div class="gd-stage-tag">Eerst bekijken</div><h1>' + esc(TITLES[S.n] || 'Les ' + S.n) + '</h1>' +
      '<p class="gd-support">Bekijk de woorden met hun afbeeldingen. Klik op het luidsprekertje om de uitspraak te horen en start daarna de oefening.</p>' +
      '<div class="vl-words-meta"><span class="vl-words-count">📚 ' + ws.length + ' woorden</span><span class="vl-mastery-count">✓ ' + totalMastered + ' beheerst</span></div>' +
      '<ul class="vl-words">' + ws.map(function (w) {
        var box = getP(map, w.id).box || 0;
        var status = box >= MASTERY ? 'known' : (box === 1 ? 'learning' : 'new');
        var statusLabel = box >= MASTERY ? '✓ Beheerst' : (box === 1 ? 'In oefening' : 'Nieuw');
        var thumb = renderVisual(w, 'thumb');
        return '<li class="vl-word ' + status + '">' +
          '<div class="vl-word-lead">' + thumb +
            '<div class="vl-word-body">' +
              '<span class="vl-word-ar" lang="ar" dir="rtl">' + esc(w.ar) + '</span>' +
              '<span class="vl-word-nl">' + esc(w.nl) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="vl-word-actions">' +
            '<button type="button" class="vl-speak-btn" data-vl="speak" data-ar="' + esc(w.ar) + '" aria-label="Beluister ' + esc(w.ar) + '">' + icon('speaker') + '</button>' +
            '<span class="vl-status-chip ' + status + '">' + statusLabel + '</span>' +
          '</div>' +
        '</li>';
      }).join('') + '</ul>' +
      '<div class="gd-finish-actions"><button type="button" class="gd-primary gd-full" data-vl="start">Start oefenen</button></div></div></div>';
  }

  function matchBody(q) {
    function tile(side, id) {
      var w = wordById(id), done = q.done[id];
      var sel = q.sel && q.sel.side === side && q.sel.id === id;
      var bad = q.wrong && ((q.wrong.a === id && q.wrong.side !== side) || (q.wrong.b === id && q.wrong.side === side) ||
        (q.wrong.a === id && q.wrong.side === side) || (q.wrong.b === id && q.wrong.side !== side)) && !done;
      var cls = 'vl-tile' + (side === 'l' ? ' ar' : ' nl') + (done ? ' done' : '') + (sel ? ' selected' : '') + (bad ? ' bad' : '');
      var mini = (side === 'r') ? renderVisual(w, 'mini') : '';
      return '<button type="button" class="' + cls + '" data-vl="tile" data-side="' + side + '" data-id="' + esc(id) + '" ' +
        (done || S.fb ? 'disabled ' : '') + 'aria-pressed="' + !!sel + '"' + (side === 'l' ? ' lang="ar" dir="rtl"' : '') + '>' +
        mini + '<span class="vl-tile-text">' + esc(side === 'l' ? w.ar : w.nl) + '</span>' +
        (done ? '<span class="vl-tile-check" aria-hidden="true">✓</span>' : '') +
        '</button>';
    }
    return '<div class="vl-task-header"><span class="vl-task-tag">Koppelspel</span>' +
      '<h2 class="gd-task-title">Maak de juiste paren</h2>' +
      '<p class="gd-subinstruction">Tik een Arabisch woord en daarna de bijbehorende vertaling.</p></div>' +
      '<div class="vl-match"><div class="vl-col">' + q.left.map(function (id) { return tile('l', id); }).join('') + '</div>' +
      '<div class="vl-col">' + q.right.map(function (id) { return tile('r', id); }).join('') + '</div></div>';
  }

  function playScreen() {
    var q = current(), total = S.qs.length, pct = Math.round(100 * S.i / Math.max(1, total));
    var body;
    if (q.type === 'match') body = matchBody(q);
    else if (q.type === 'ar2img') {
      body = '<div class="vl-task-header"><span class="vl-task-tag">Beeldkeuze</span>' +
        '<h2 class="gd-task-title">Kies het juiste plaatje</h2></div>' +
        '<div class="vl-question-box"><div class="gd-ar-question gd-arabic" lang="ar" dir="rtl">' + esc(q.word.ar) +
        '<button type="button" class="vl-speak-btn vl-speak-inline" data-vl="speak" data-ar="' + esc(q.word.ar) + '" aria-label="Beluister">' + icon('speaker') + '</button></div></div>' +
        '<div class="gd-options vl-pic-grid">' + q.options.map(function (w, i) {
          var picked = S.chosen === i;
          var mark = '';
          if (S.fb) mark = w.id === q.answer ? ' correct' : (picked ? ' wrong' : '');
          var url = picUrl(w) || 'img/generic.jpg';
          return '<button type="button" class="gd-option vl-pic-opt' + (picked ? ' selected' : '') + mark +
            '" data-vl="pick" data-i="' + i + '" ' + (S.fb ? 'disabled ' : '') + 'aria-pressed="' + picked +
            '" aria-label="' + esc(w.nl) + '"><img src="' + esc(url) + '" alt="' + esc(w.nl) + '" loading="lazy" decoding="async"/>' +
            '<span class="vl-pic-opt-lbl">' + esc(w.nl) + '</span></button>';
        }).join('') + '</div>' +
        '<div class="gd-task-actions"><button type="button" class="gd-primary gd-full" data-vl="check" ' + (answered() && !S.fb ? '' : 'disabled') + '>Controleer</button></div>';
    } else if (q.type === 'pic2ar' || q.type === 'img2ar' || q.type === 'img2nl') {
      var arOpt = q.type !== 'img2nl';
      var v = getVisual(q.word);
      body = '<div class="vl-task-header"><span class="vl-task-tag">Beeldherkenning</span>' +
        '<h2 class="gd-task-title">' + (arOpt ? 'Wat zie je op de afbeelding?' : 'Wat betekent dit plaatje?') + '</h2></div>' +
        (v ? renderVisual(q.word, 'hero') : '') +
        '<div class="gd-options">' + q.options.map(function (o, i) {
          var picked = S.chosen === i;
          var mark = '';
          if (S.fb) mark = o === q.answer ? ' correct' : (picked ? ' wrong' : '');
          return '<button type="button" class="gd-option' + (arOpt ? ' gd-option-ar gd-option-wide' : '') + (picked ? ' selected' : '') + mark +
            '" data-vl="pick" data-i="' + i + '" ' + (S.fb ? 'disabled ' : '') + 'aria-pressed="' + picked + '"' +
            (arOpt ? ' lang="ar" dir="rtl"' : '') + '>' + esc(o) + '</button>';
        }).join('') + '</div>' +
        '<div class="gd-task-actions"><button type="button" class="gd-primary gd-full" data-vl="check" ' + (answered() && !S.fb ? '' : 'disabled') + '>Controleer</button></div>';
    } else {
      var ar = q.type === 'nl2ar';
      var vHtml = renderVisual(q.word, 'question');
      body = '<div class="vl-task-header"><span class="vl-task-tag">' + (ar ? 'Nederlands naar Arabisch' : 'Betekenis') + '</span>' +
        '<h2 class="gd-task-title">' + (ar ? 'Kies het juiste Arabische woord' : 'Wat betekent dit woord?') + '</h2></div>' +
        '<div class="vl-question-box">' + vHtml +
          (ar ? '<div class="gd-nl-question">' + esc(q.word.nl) + '</div>'
              : '<div class="gd-ar-question gd-arabic" lang="ar" dir="rtl">' + esc(q.word.ar) +
                '<button type="button" class="vl-speak-btn vl-speak-inline" data-vl="speak" data-ar="' + esc(q.word.ar) + '" aria-label="Beluister">' + icon('speaker') + '</button></div>') +
        '</div>' +
        '<div class="gd-options">' + q.options.map(function (o, i) {
          var picked = S.chosen === i;
          var mark = '';
          if (S.fb) mark = o === q.answer ? ' correct' : (picked ? ' wrong' : '');
          return '<button type="button" class="gd-option' + (ar ? ' gd-option-ar gd-option-wide' : '') + (picked ? ' selected' : '') + mark +
            '" data-vl="pick" data-i="' + i + '" ' + (S.fb ? 'disabled ' : '') + 'aria-pressed="' + picked + '"' +
            (ar ? ' lang="ar" dir="rtl"' : '') + '>' + esc(o) + '</button>';
        }).join('') + '</div>' +
        '<div class="gd-task-actions"><button type="button" class="gd-primary gd-full" data-vl="check" ' + (answered() && !S.fb ? '' : 'disabled') + '>Controleer</button></div>';
    }
    var fb = '';
    if (S.fb) {
      var good = S.fb.ok, w = q.word;
      if (superOn()) {
        fb = '<section class="gd-feedback gd-feedback-sheet gd-feedback-super ' + (good ? 'good' : 'review') + '" role="status" aria-live="assertive">' +
          '<div class="gd-feedback-inner"><strong>' + (good ? 'Juist!' : 'Fout!') + '</strong>' +
          '<div class="gd-autonext" aria-hidden="true"><i></i></div></div></section>';
      } else {
        var headline = good ? ['Goed!', 'Prima!', 'Uitstekend!'][S.i % 3] : 'Juiste antwoord:';
        var fbVis = renderVisual(w, 'feedback');
        var detail = S.fb.match ? '<p class="gd-correct-answer">Alle paren gevonden! Goed gedaan.</p>'
          : '<div class="vl-fb-card">' + fbVis +
              '<div class="vl-fb-info">' +
                '<p class="vl-fb-ar" lang="ar" dir="rtl">' + esc(w.ar) + '</p>' +
                '<p class="vl-fb-nl">' + esc(w.nl) + '</p>' +
              '</div>' +
              '<button type="button" class="vl-speak-btn" data-vl="speak" data-ar="' + esc(w.ar) + '" aria-label="Beluister">' + icon('speaker') + '</button>' +
            '</div>';
        fb = '<section class="gd-feedback gd-feedback-sheet ' + (good ? 'good' : 'review') + '" role="status" aria-live="assertive">' +
          '<div class="gd-feedback-inner"><strong>' + headline + '</strong>' + detail +
          (fastOn() ? '<div class="gd-autonext" aria-hidden="true"><i></i></div>' : '') +
          '<button type="button" class="gd-primary gd-full" data-vl="next">Verder</button></div></section>';
      }
    }
    return '<div class="gd-shell gd-play vl">' + bar(Math.min(total, S.i + 1) + ' / ' + total, pct) +
      '<div class="gd-card gd-task">' + body + '</div>' + fb + '</div>';
  }

  function doneScreen() {
    var accuracy = S.attempts ? Math.round(100 * S.correct / S.attempts) : 0;
    var st = stats(S.n, jget(K_PROG, {}));
    return '<div class="gd-shell gd-play vl">' + bar('Afgerond', 100) +
      '<div class="gd-card gd-finish"><span class="gd-finish-icon">' + icon('crown') + '</span>' +
      '<h1>Les ' + S.n + ' · ' + esc(TITLES[S.n] || 'Woordenschat') + '</h1>' +
      '<div class="gd-result-grid"><span><strong>' + S.xp + '</strong><small>XP</small></span>' +
      '<span><strong>' + accuracy + '%</strong><small>Nauwkeurigheid</small></span>' +
      '<span><strong>' + st.mastered + '/' + st.total + '</strong><small>Beheerst</small></span></div>' +
      '<p>' + S.correct + ' van de ' + S.attempts + ' antwoorden juist.</p>' +
      '<div class="gd-finish-actions"><button type="button" class="gd-primary gd-full" data-vl="continue">Doorgaan</button>' +
      '<button type="button" class="gd-soft gd-full" data-vl="again">Nog een ronde</button>' +
      '<button type="button" class="gd-soft gd-full" data-vl="exit">Terug naar het leerpad</button></div></div></div>';
  }
  function failScreen() {
    commitXp();
    return '<div class="gd-shell gd-play vl">' + bar('Afgebroken', Math.round(100 * S.i / Math.max(1, S.qs.length))) +
      '<div class="gd-card gd-finish"><span class="gd-finish-icon">' + icon('heart') + '</span>' +
      '<h1>Geen hartjes meer</h1><p>Je voortgang van deze ronde is bewaard. Probeer het zo nog een keer.</p>' +
      '<div class="gd-finish-actions"><button type="button" class="gd-primary gd-full" data-vl="again">Opnieuw proberen</button>' +
      '<button type="button" class="gd-soft gd-full" data-vl="exit">Terug naar het leerpad</button></div></div></div>';
  }

  function render() {
    if (!app || !S) return;
    app.innerHTML = S.screen === 'words' ? wordsScreen() : S.screen === 'done' ? doneScreen() :
      S.screen === 'fail' ? failScreen() : playScreen();
    if (window.scrollTo) window.scrollTo(0, 0);
  }

  /* ---------- events ---------- */
  function onClick(e) {
    if (!S) return;
    var t = e.target.closest ? e.target.closest('[data-vl]') : null;
    if (!t) return;
    e.stopPropagation();
    var a = t.getAttribute('data-vl');
    if (a === 'exit') return leave();
    if (a === 'fast') { cycleSpeed(); if (!fastOn()) clearTimeout(fastTimer); render(); return; }
    if (a === 'start') { clearTimeout(fastTimer); S.screen = 'play'; S.qs = build(S.n); S.i = 0; render(); return; }
    if (a === 'continue') {
      clearTimeout(fastTimer);
      var nums = lessonNums(), cur = S.n, follow = nums.filter(function (x) { return x > cur; })[0];
      if (follow === undefined) return leave();
      var started = stats(follow, jget(K_PROG, {})).seen > 0;
      commitXp(); S = null;
      return open(follow, started ? 'play' : 'words');
    }
    if (a === 'again') { clearTimeout(fastTimer); var n = S.n; commitXp(); S = null; return open(n, 'play'); }
    if (a === 'speak') {
      var arTxt = t.getAttribute('data-ar') || '';
      speak(arTxt);
      return;
    }
    if (a === 'pick') {
      if (!S.fb) {
        S.chosen = Number(t.getAttribute('data-i'));
        if (fastOn()) check(); else render();
      }
      return;
    }
    if (a === 'check') return check();
    if (a === 'next') return next();
    if (a === 'tile') return matchTap(t.getAttribute('data-side'), t.getAttribute('data-id'));
  }
  function onKey(e) {
    if (!S || S.screen !== 'play' || e.ctrlKey || e.altKey || e.metaKey) return;
    var q = current();
    if (!q) return;
    if (S.fb && e.key === 'Enter') { e.preventDefault(); return next(); }
    if (q.type === 'match') return;
    if (/^[1-4]$/.test(e.key) && !S.fb && q.options && Number(e.key) <= q.options.length) {
      S.chosen = Number(e.key) - 1;
      if (fastOn()) check(); else render();
    }
    else if (e.key === 'Enter' && !S.fb && answered()) { e.preventDefault(); check(); }
  }
  function bind() {
    if (bound || !app) return;
    bound = true;
    app.addEventListener('click', onClick, true);   // vóór de handlers van de startpagina
    document.addEventListener('keydown', onKey);
  }

  window.GrammarLabVocab = {
    plan: plan, totals: totals, open: open, active: function () { return !!S; },
    titles: TITLES
  };
})();
