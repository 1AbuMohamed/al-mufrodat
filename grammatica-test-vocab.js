/* Al-Mufrodat · Grammatica Lab: woordenschat-leerpad, flashcards en oefenrondes.
 * - Woorden komen uit vocab_words.js (afgeleid van BASE_WORDS in app_core.js).
 * - Voortgang staat in dezelfde sleutel als de gewone woordenschat (alm_progress),
 *   zodat beide kanten van de site dezelfde beheersing tonen.
 * - XP en streak gaan naar de XP van het Grammatica Lab (+ Leaderboard).
 * - Didactische opbouw met strakke Duolingo-stijl vector-illustraties (img/duo/*.svg),
 *   interactieve flip-flashcards, 2x2 beeldkeuze (ar2img), beeldherkenning (pic2ar),
 *   snelle waar/niet-waar checks (tf), kleurstalen, uitspraak & herhaling van fouten.
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

  function speak(text, btn) {
    if (btn && btn.classList) {
      btn.classList.add('speaking');
      setTimeout(function () { if (btn && btn.classList) btn.classList.remove('speaking'); }, 800);
    }
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
      bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.4 1 2.3h6c0-.9.3-1.7 1-2.3A7 7 0 0 0 12 2Z"/>'
    };
    return '<svg class="gd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || '') + '</svg>';
  }

  /* ---------- visuele ondersteuning (exacte stam-koppeling zonder foutieve deelstrings) ---------- */
  function norm(s) {
    return String(s || '')
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .trim();
  }

  var PHOTO_EXACT = {
    'بيت': 'img/duo/house.svg', 'بيوت': 'img/duo/house.svg',
    'مسجد': 'img/duo/mosque.svg', 'مساجد': 'img/duo/mosque.svg',
    'باب': 'img/duo/door.svg', 'ابواب': 'img/duo/door.svg',
    'كتاب': 'img/duo/book.svg', 'كتب': 'img/duo/book.svg',
    'قلم': 'img/duo/pen.svg', 'اقلام': 'img/duo/pen.svg',
    'مفتاح': 'img/duo/key.svg', 'مفاتيح': 'img/duo/key.svg',
    'مكتب': 'img/duo/desk.svg', 'مكاتب': 'img/duo/desk.svg',
    'طاوله': 'img/duo/desk.svg',
    'سرير': 'img/duo/bed.svg', 'سرر': 'img/duo/bed.svg',
    'كرسي': 'img/duo/chair.svg', 'كراسي': 'img/duo/chair.svg',
    'نجم': 'img/duo/star.svg', 'نجوم': 'img/duo/star.svg',
    'قميص': 'img/duo/shirt.svg', 'قمصان': 'img/duo/shirt.svg',
    'طبيب': 'img/duo/doctor.svg', 'اطباء': 'img/duo/doctor.svg',
    'طبيبه': 'img/duo/doctor.svg', 'طبيبات': 'img/duo/doctor.svg',
    'ممرض': 'img/duo/doctor.svg', 'ممرضه': 'img/duo/doctor.svg',
    'ولد': 'img/duo/boy.svg', 'اولاد': 'img/duo/boy.svg',
    'ابن': 'img/duo/boy.svg', 'ابناء': 'img/duo/boy.svg',
    'اخ': 'img/duo/boy.svg', 'اخوه': 'img/duo/boy.svg',
    'طفل': 'img/duo/child.svg', 'اطفال': 'img/duo/child.svg',
    'طالب': 'img/duo/student.svg', 'طلاب': 'img/duo/student.svg',
    'طالبه': 'img/duo/student.svg', 'طالبات': 'img/duo/student.svg',
    'زميل': 'img/duo/student.svg', 'زملاء': 'img/duo/student.svg', 'زميله': 'img/duo/student.svg',
    'رجل': 'img/duo/man.svg', 'رجال': 'img/duo/man.svg',
    'اب': 'img/duo/man.svg', 'اباء': 'img/duo/man.svg',
    'عم': 'img/duo/man.svg', 'اعمام': 'img/duo/man.svg',
    'خال': 'img/duo/man.svg', 'فلاح': 'img/duo/man.svg', 'فلاحون': 'img/duo/man.svg',
    'زوج': 'img/duo/man.svg', 'حاج': 'img/duo/man.svg', 'حجاج': 'img/duo/man.svg',
    'مفتش': 'img/duo/man.svg', 'وزير': 'img/duo/man.svg', 'وزراء': 'img/duo/man.svg',
    'مهندس': 'img/duo/engineer.svg', 'مهندسون': 'img/duo/engineer.svg',
    'تاجر': 'img/duo/merchant.svg', 'تجار': 'img/duo/merchant.svg',
    'كلب': 'img/duo/dog.svg', 'كلاب': 'img/duo/dog.svg',
    'قط': 'img/duo/cat.svg', 'قطط': 'img/duo/cat.svg',
    'حمار': 'img/duo/donkey.svg', 'حمير': 'img/duo/donkey.svg', 'حمر': 'img/duo/donkey.svg',
    'حصان': 'img/duo/horse.svg', 'احصنه': 'img/duo/horse.svg', 'خيل': 'img/duo/horse.svg', 'فرس': 'img/duo/horse.svg',
    'جمل': 'img/duo/camel.svg', 'جمال': 'img/duo/camel.svg', 'ناقه': 'img/duo/camel.svg',
    'ديك': 'img/duo/rooster.svg', 'ديوك': 'img/duo/rooster.svg',
    'مدرس': 'img/duo/teacher.svg', 'مدرسون': 'img/duo/teacher.svg',
    'مدرسه': 'img/duo/school.svg', 'مدارس': 'img/duo/school.svg',
    'مدير': 'img/duo/teacher.svg',
    'استاذ': 'img/duo/teacher.svg', 'اساتذه': 'img/duo/teacher.svg',
    'منديل': 'img/duo/handkerchief.svg', 'مناديل': 'img/duo/handkerchief.svg',
    'امام': 'img/duo/imam.svg', 'ائمه': 'img/duo/imam.svg',
    'مؤذن': 'img/duo/imam.svg', 'مؤذنون': 'img/duo/imam.svg',
    'حجر': 'img/duo/stone.svg', 'احجار': 'img/duo/stone.svg',
    'سكر': 'img/duo/sugar.svg',
    'لبن': 'img/duo/milk.svg', 'حليب': 'img/duo/milk.svg',
    'ورق': 'img/duo/paper.svg', 'اوراق': 'img/duo/paper.svg',
    'ماء': 'img/duo/water.svg', 'مياه': 'img/duo/water.svg',
    'بحر': 'img/duo/water.svg', 'بحار': 'img/duo/water.svg', 'نهر': 'img/duo/water.svg', 'انهار': 'img/duo/water.svg',
    'تفاح': 'img/duo/apple.svg', 'تفاحه': 'img/duo/apple.svg',
    'فاكهه': 'img/duo/fruit.svg', 'فواكه': 'img/duo/fruit.svg',
    'دكان': 'img/duo/shop.svg', 'دكاكين': 'img/duo/shop.svg',
    'سوق': 'img/duo/shop.svg', 'اسواق': 'img/duo/shop.svg',
    'شمس': 'img/duo/sun.svg', 'مشرق': 'img/duo/sun.svg', 'شرق': 'img/duo/sun.svg', 'صباح': 'img/duo/sun.svg',
    'قمر': 'img/duo/moon.svg', 'مساء': 'img/duo/moon.svg', 'بارحه': 'img/duo/moon.svg',
    'غرفه': 'img/duo/room.svg', 'غرف': 'img/duo/room.svg',
    'سماء': 'img/duo/sky.svg', 'سموات': 'img/duo/sky.svg',
    'حمام': 'img/duo/bathroom.svg', 'حمامات': 'img/duo/bathroom.svg',
    'مرحاض': 'img/duo/bathroom.svg', 'مراحيض': 'img/duo/bathroom.svg',
    'فصل': 'img/duo/classroom.svg', 'فصول': 'img/duo/classroom.svg',
    'سبوره': 'img/duo/classroom.svg',
    'مطبخ': 'img/duo/kitchen.svg', 'مطابخ': 'img/duo/kitchen.svg', 'قدر': 'img/duo/kitchen.svg',
    'جامعه': 'img/duo/university.svg', 'جامعات': 'img/duo/university.svg', 'كليه': 'img/duo/university.svg',
    'شارع': 'img/duo/city.svg', 'شوارع': 'img/duo/city.svg',
    'مدينه': 'img/duo/city.svg', 'مدن': 'img/duo/city.svg', 'حي': 'img/duo/city.svg',
    'مكه': 'img/duo/mosque.svg', 'قاهره': 'img/duo/city.svg', 'بغداد': 'img/duo/city.svg',
    'جده': 'img/duo/city.svg', 'دمشق': 'img/duo/city.svg', 'رياض': 'img/duo/city.svg',
    'اصطنبول': 'img/duo/city.svg', 'طائف': 'img/duo/city.svg', 'واشنطن': 'img/duo/city.svg',
    'يابان': 'img/duo/globe.svg', 'صين': 'img/duo/globe.svg', 'هند': 'img/duo/globe.svg',
    'فلبين': 'img/duo/globe.svg', 'مصر': 'img/duo/globe.svg', 'باكستان': 'img/duo/globe.svg',
    'امريكا': 'img/duo/globe.svg', 'المانيا': 'img/duo/globe.svg', 'عراق': 'img/duo/globe.svg',
    'انكلترا': 'img/duo/globe.svg', 'سويسرا': 'img/duo/globe.svg', 'كويت': 'img/duo/globe.svg',
    'اندونيسيا': 'img/duo/globe.svg', 'اوروبا': 'img/duo/globe.svg', 'اسيا': 'img/duo/globe.svg',
    'بلد': 'img/duo/globe.svg', 'بلاد': 'img/duo/globe.svg',
    'سياره': 'img/duo/car.svg', 'سيارات': 'img/duo/car.svg',
    'طائره': 'img/duo/plane.svg', 'طائرات': 'img/duo/plane.svg',
    'مطار': 'img/duo/airport.svg',
    'فندق': 'img/duo/hotel.svg', 'فنادق': 'img/duo/hotel.svg',
    'شركه': 'img/duo/city.svg', 'شركات': 'img/duo/city.svg',
    'حقيبه': 'img/duo/bag.svg', 'حقائب': 'img/duo/bag.svg',
    'بنت': 'img/duo/girl.svg', 'بنات': 'img/duo/girl.svg',
    'اخت': 'img/duo/girl.svg', 'اخوات': 'img/duo/girl.svg',
    'فتاه': 'img/duo/girl.svg', 'زوجه': 'img/duo/girl.svg', 'عمه': 'img/duo/girl.svg', 'خاله': 'img/duo/girl.svg',
    'ام': 'img/duo/mother.svg', 'امهات': 'img/duo/mother.svg',
    'ملعقه': 'img/duo/spoon.svg', 'ملاعق': 'img/duo/spoon.svg',
    'بقره': 'img/duo/cow.svg', 'بقر': 'img/duo/cow.svg',
    'شاي': 'img/duo/tea.svg', 'قهوه': 'img/duo/coffee.svg',
    'فنجان': 'img/duo/cup.svg', 'فناجين': 'img/duo/cup.svg', 'كوب': 'img/duo/cup.svg', 'اكواب': 'img/duo/cup.svg',
    'دراجه': 'img/duo/bike.svg', 'دراجات': 'img/duo/bike.svg',
    'بيضه': 'img/duo/egg.svg', 'بيض': 'img/duo/egg.svg',
    'بطه': 'img/duo/duck.svg', 'بط': 'img/duo/duck.svg',
    'دجاجه': 'img/duo/chicken.svg', 'دجاج': 'img/duo/chicken.svg',
    'مستشفي': 'img/duo/hospital.svg', 'مستشفيات': 'img/duo/hospital.svg', 'مستوصف': 'img/duo/hospital.svg',
    'سكين': 'img/duo/knife.svg', 'سكاكين': 'img/duo/knife.svg',
    'طائر': 'img/duo/bird.svg', 'طيور': 'img/duo/bird.svg', 'عصفور': 'img/duo/bird.svg', 'عصافير': 'img/duo/bird.svg',
    'شجره': 'img/duo/tree.svg', 'اشجار': 'img/duo/tree.svg',
    'حديقه': 'img/duo/park.svg', 'حدائق': 'img/duo/park.svg',
    'ساعه': 'img/duo/clock.svg', 'ساعات': 'img/duo/clock.svg',
    'مكتبه': 'img/duo/library.svg', 'مكتبات': 'img/duo/library.svg',
    'دفتر': 'img/duo/notebook.svg', 'دفاتر': 'img/duo/notebook.svg',
    'اختبار': 'img/duo/exam.svg', 'امتحان': 'img/duo/exam.svg',
    'سمك': 'img/duo/fish.svg', 'سمكه': 'img/duo/fish.svg', 'اسماك': 'img/duo/fish.svg',
    'ثلاجه': 'img/duo/fridge.svg', 'ثلاجات': 'img/duo/fridge.svg',
    'نافذه': 'img/duo/window.svg', 'نوافذ': 'img/duo/window.svg',
    'زهره': 'img/duo/flower.svg', 'زهور': 'img/duo/flower.svg', 'ازهار': 'img/duo/flower.svg',
    'يد': 'img/duo/hand.svg', 'ايد': 'img/duo/hand.svg',
    'عين': 'img/duo/eye.svg', 'عيون': 'img/duo/eye.svg',
    'اذن': 'img/duo/ear.svg', 'اذان': 'img/duo/ear.svg'
  };

  var NL_PHOTO_WORDS = {
    'huis': 'img/duo/house.svg', 'moskee': 'img/duo/mosque.svg', 'deur': 'img/duo/door.svg',
    'boek': 'img/duo/book.svg', 'pen': 'img/duo/pen.svg', 'sleutel': 'img/duo/key.svg',
    'bureau': 'img/duo/desk.svg', 'tafel': 'img/duo/desk.svg', 'bed': 'img/duo/bed.svg',
    'stoel': 'img/duo/chair.svg', 'ster': 'img/duo/star.svg', 'hemd': 'img/duo/shirt.svg',
    'dokter': 'img/duo/doctor.svg', 'arts': 'img/duo/doctor.svg', 'verpleger': 'img/duo/doctor.svg',
    'verpleegster': 'img/duo/doctor.svg', 'jongen': 'img/duo/boy.svg', 'broer': 'img/duo/boy.svg',
    'zoon': 'img/duo/boy.svg', 'kind': 'img/duo/child.svg', 'baby': 'img/duo/child.svg',
    'meisje': 'img/duo/girl.svg', 'zus': 'img/duo/girl.svg', 'dochter': 'img/duo/girl.svg',
    'jongedame': 'img/duo/girl.svg', 'student': 'img/duo/student.svg', 'studente': 'img/duo/student.svg',
    'klasgenoot': 'img/duo/student.svg', 'klasgenoten': 'img/duo/student.svg',
    'man': 'img/duo/man.svg', 'vader': 'img/duo/man.svg', 'ingenieur': 'img/duo/engineer.svg',
    'handelaar': 'img/duo/merchant.svg', 'hond': 'img/duo/dog.svg', 'kat': 'img/duo/cat.svg',
    'ezel': 'img/duo/donkey.svg', 'paard': 'img/duo/horse.svg', 'kameel': 'img/duo/camel.svg',
    'haan': 'img/duo/rooster.svg', 'leraar': 'img/duo/teacher.svg', 'docent': 'img/duo/teacher.svg',
    'directeur': 'img/duo/teacher.svg', 'zakdoek': 'img/duo/handkerchief.svg', 'imam': 'img/duo/imam.svg',
    'steen': 'img/duo/stone.svg', 'suiker': 'img/duo/sugar.svg', 'melk': 'img/duo/milk.svg',
    'yoghurt': 'img/duo/milk.svg', 'papier': 'img/duo/paper.svg', 'water': 'img/duo/water.svg',
    'zee': 'img/duo/water.svg', 'rivier': 'img/duo/water.svg', 'appel': 'img/duo/apple.svg',
    'winkel': 'img/duo/shop.svg', 'markt': 'img/duo/shop.svg', 'zon': 'img/duo/sun.svg',
    'maan': 'img/duo/moon.svg', 'kamer': 'img/duo/room.svg', 'kamers': 'img/duo/room.svg',
    'hemel': 'img/duo/sky.svg', 'badkamer': 'img/duo/bathroom.svg', 'toilet': 'img/duo/bathroom.svg',
    'klaslokaal': 'img/duo/classroom.svg', 'schrijfbord': 'img/duo/classroom.svg', 'keuken': 'img/duo/kitchen.svg',
    'kookpot': 'img/duo/kitchen.svg', 'school': 'img/duo/school.svg', 'universiteit': 'img/duo/university.svg',
    'faculteit': 'img/duo/university.svg', 'straat': 'img/duo/city.svg', 'auto': 'img/duo/car.svg',
    'vliegtuig': 'img/duo/plane.svg', 'vliegveld': 'img/duo/airport.svg', 'luchthaven': 'img/duo/airport.svg',
    'hotel': 'img/duo/hotel.svg', 'tas': 'img/duo/bag.svg', 'moeder': 'img/duo/mother.svg',
    'moeders': 'img/duo/mother.svg', 'lepel': 'img/duo/spoon.svg', 'koe': 'img/duo/cow.svg',
    'thee': 'img/duo/tea.svg', 'koffie': 'img/duo/coffee.svg', 'kopje': 'img/duo/cup.svg',
    'theekopje': 'img/duo/cup.svg', 'beker': 'img/duo/cup.svg', 'glas': 'img/duo/cup.svg',
    'fiets': 'img/duo/bike.svg', 'ei': 'img/duo/egg.svg', 'eend': 'img/duo/duck.svg',
    'kip': 'img/duo/chicken.svg', 'ziekenhuis': 'img/duo/hospital.svg', 'kliniek': 'img/duo/hospital.svg',
    'mes': 'img/duo/knife.svg', 'fruit': 'img/duo/fruit.svg', 'vogel': 'img/duo/bird.svg',
    'mus': 'img/duo/bird.svg', 'stad': 'img/duo/city.svg', 'bibliotheek': 'img/duo/library.svg',
    'schrift': 'img/duo/notebook.svg', 'schriften': 'img/duo/notebook.svg',
    'examen': 'img/duo/exam.svg', 'toets': 'img/duo/exam.svg',
    'boom': 'img/duo/tree.svg', 'tuin': 'img/duo/park.svg', 'park': 'img/duo/park.svg',
    'klok': 'img/duo/clock.svg', 'horloge': 'img/duo/clock.svg', 'bloem': 'img/duo/flower.svg',
    'vis': 'img/duo/fish.svg', 'koelkast': 'img/duo/fridge.svg', 'raam': 'img/duo/window.svg',
    'hand': 'img/duo/hand.svg', 'oog': 'img/duo/eye.svg', 'oor': 'img/duo/ear.svg',
    'been': 'img/duo/foot.svg', 'voet': 'img/duo/foot.svg'
  };

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
    'غني': '💰', 'فقير': '🪙', 'جديد': '✨', 'قديم': '⏳', 'قدامي': '⏳', 'نظيف': '🧼', 'وسخ': '🫧',
    'خفيف': '🪶', 'ثقيل': '🏋️', 'مفتوح': '🔓', 'مكسور': '🔨', 'مغلق': '🔒',
    'حلو': '🍯', 'مريض': '🩹', 'جميل': '🌸', 'قريب': '📍', 'بعيد': '🔭', 'واسع': '↔️',
    'سريع': '⚡', 'سهل': '👍', 'صعب': '🧩', 'رخيص': '🏷️', 'جوعان': '🍽️', 'عطشان': '🥤',
    'غضبان': '😠', 'كسلان': '😴', 'ملان': '🥛', 'حاد': '✂️',
    'شكرا': '🙏', 'سؤال': '❓', 'يوم': '📅', 'اسبوع': '📆', 'شهر': '🗓️', 'سنه': '🗓️',
    'دقيقه': '⏱️', 'مجله': '📰', 'درس': '📚', 'دروس': '📚', 'حرف': '🔤', 'كلمه': '💬',
    'كلمات': '💬', 'لغه': '🗣️', 'لون': '🎨', 'الوان': '🎨', 'جالس': '🪑', 'واقف': '🧍', 'كريم': '🎁',
    'ذهب': '🚶', 'ذهبت': '🚶', 'ذهبوا': '🚶', 'ذهبن': '🚶', 'ذهبتم': '🚶', 'ذهبنا': '🚶',
    'خرج': '🚪', 'دخل': '🚪', 'رجع': '↩️', 'جلس': '🪑', 'قال': '🗣️', 'قالت': '🗣️',
    'سافر': '✈️', 'ساعد': '🤝', 'استقبل': '🤝', 'انتظر': '⏳', 'رحب': '👋',
    'امس': '⏪', 'اليوم': '📅', 'الان': '⏱️', 'قبل': '⏪',
    'في': '📥', 'علي': '📦', 'تحت': '⬇️', 'امام': '➡️', 'خلف': '⬅️',
    'حافله': '🚌', 'جيب': '👖', 'نقود': '🪙', 'قرش': '🪙', 'ريال': '🪙',
    'عجله': '⭕', 'مسطره': '📏', 'حفيد': '👦', 'كعبه': '🕋',
    'واحد': '1️⃣', 'اثنان': '2️⃣', 'ثلاثه': '3️⃣', 'اربعه': '4️⃣', 'خمسه': '5️⃣',
    'سته': '6️⃣', 'سبعه': '7️⃣', 'ثمانيه': '8️⃣', 'تسعه': '9️⃣', 'عشره': '🔟'
  };

  function getVisual(w) {
    if (!w) return null;
    // Homografen eerst onderscheiden op id / harakat (قَطُّ vs قِطٌّ, رِجْل vs رَجُل)
    if (w.id === 'l24-3' || /\u0642\u064e\u0637/.test(w.ar || '')) return { type: 'badge', icon: '🕰️' };
    if (w.id === 'l6-4' || /\u0631\u0650\u062c\u0652\u0644/.test(w.ar || '')) return { type: 'photo', src: 'img/duo/foot.svg' };
    if (w.id === 'l24-19') return { type: 'photo', src: 'img/duo/chair.svg' };

    var tokens = norm(w.ar).split(/\s+/).filter(Boolean);
    var i, tok, stem;
    for (i = 0; i < tokens.length; i++) {
      tok = tokens[i];
      stem = tok.indexOf('ال') === 0 && tok.length > 3 ? tok.slice(2) : tok;
      if (COLOR_MAP[tok] || COLOR_MAP[stem]) {
        var c = COLOR_MAP[tok] || COLOR_MAP[stem];
        return { type: 'color', color: c.color, border: c.border, name: c.name };
      }
      if (PHOTO_EXACT[tok]) return { type: 'photo', src: PHOTO_EXACT[tok] };
      if (PHOTO_EXACT[stem]) return { type: 'photo', src: PHOTO_EXACT[stem] };
    }

    // Arabische conceptbadge op exact woord
    for (i = 0; i < tokens.length; i++) {
      tok = tokens[i];
      stem = tok.indexOf('ال') === 0 && tok.length > 3 ? tok.slice(2) : tok;
      if (BADGE_MAP[tok]) return { type: 'badge', icon: BADGE_MAP[tok] };
      if (BADGE_MAP[stem]) return { type: 'badge', icon: BADGE_MAP[stem] };
    }

    // Nederlandse woordmatch alleen op hele kernwoorden (zonder toelichting tussen haakjes)
    var coreNl = String(w.nl || '').replace(/\([^)]*\)/g, ' ').toLowerCase();
    var nlWords = coreNl.split(/[^a-z\u00C0-\u017F]+/).filter(Boolean);
    for (i = 0; i < nlWords.length; i++) {
      if (NL_PHOTO_WORDS[nlWords[i]]) return { type: 'photo', src: NL_PHOTO_WORDS[nlWords[i]] };
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
      return '<div class="vl-hero-badge"><span class="vl-hero-emoji">' + v.icon + '</span></div>';
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
  function choiceTF(word, n) {
    var truth = Math.random() >= 0.45;
    var shownNl = truth ? word.nl : (distractors(word, n, 'nl', 1)[0] || word.nl);
    if (shownNl === word.nl) truth = true;
    return {
      type: 'tf',
      word: word,
      shownNl: shownNl,
      answer: truth ? 'Ja, klopt' : 'Nee, klopt niet',
      options: ['Ja, klopt', 'Nee, klopt niet']
    };
  }
  function build(n) {
    var map = jget(K_PROG, {});
    var ws = wordsFor(n).sort(function (a, b) {
      return getP(map, a.id).box - getP(map, b.id).box || Math.random() - 0.5;
    });
    var targets = shuffle(ws.slice(0, 8));
    var qs = [];

    // Didactische opbouw van herkennen -> koppelen -> produceren:
    // Fase 1 (eerste 3 opgaven): ar2img (2x2 beeldkeuze), tf (snelle stelling) of ar2nl (begrip)
    // Fase 2 (opgave 4): match (4-paren koppelspel)
    // Fase 3 (daarna): pic2ar (foto/kleur -> Arabisch) & nl2ar (actieve productie)
    var recog = [], prod = [];
    targets.forEach(function (w, i) {
      var vis = getVisual(w);
      var hasPhoto = vis && vis.type === 'photo';
      var hasColor = vis && vis.type === 'color';
      if (i < 4) {
        if (hasPhoto && i % 2 === 0) recog.push(choiceImgGrid(w, n));
        else if (i === 1 && ws.length >= 3) recog.push(choiceTF(w, n));
        else recog.push(choice(w, n, 'ar2nl'));
      } else {
        if ((hasPhoto || hasColor) && i % 2 === 0) prod.push(choice(w, n, 'pic2ar'));
        else prod.push(choice(w, n, 'nl2ar'));
      }
    });
    qs = recog.concat(prod);

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
    S = {
      n: n, screen: mode === 'words' ? 'words' : 'play', qs: [], i: 0, hearts: MAX_HEARTS,
      correct: 0, attempts: 0, xp: 0, combo: 0, chosen: -1, hintShown: false, fb: null,
      committed: false, wrongIds: {}, missed: [], queued: false, perfect: true,
      wordView: 'cards', cardIdx: 0, cardFlip: false, filterTodo: false
    };
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
    if (ok) { S.correct++; S.combo++; S.xp += xp == null ? 10 : xp; }
    else { S.combo = 0; S.hearts = Math.max(0, S.hearts - 0.5); S.perfect = false; }
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
      if (!S.queued) {
        var retryQ = choice(q.word, S.n, picUrl(q.word) ? 'pic2ar' : 'nl2ar');
        retryQ.retry = true;
        S.missed.push(retryQ);
      }
    }
    S.fb = { ok: ok };
    render();
    scheduleFastNext(ok);
  }
  function next() {
    clearTimeout(fastTimer);
    if (!S) return;
    if (S.hearts <= 0) { S.screen = 'fail'; S.fb = null; render(); return; }
    S.i++; S.chosen = -1; S.hintShown = false; S.fb = null;
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
    S.combo = 0; S.hearts = Math.max(0, S.hearts - 0.5); S.perfect = false;
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
      '<div class="gd-progress-wrap"><div class="gd-progress-title"><strong>Les ' + S.n + '</strong><span>' + esc(label) + '</span></div>' +
      '<div class="gd-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div></div>' +
      '<div class="gd-bar-hearts" aria-label="' + String(S.hearts).replace('.', ',') + ' van ' + MAX_HEARTS + ' hartjes">' + hearts + '</div>' +
      '<button type="button" class="gd-fast' + (fastOn() ? ' on' : '') + (superOn() ? ' super' : '') + '" data-vl="fast" aria-pressed="' + fastOn() + '" title="' + (superOn() ? 'Supersnel: toont alleen juist/fout en gaat meteen door' : (fastOn() ? 'Snelle modus · klik nogmaals voor Supersnel' : 'Normaal · klik voor Snel of Supersnel')) + '">' + (superOn() ? '⚡⚡ Supersnel' : '⚡ Snel') + '</button></div>';
  }

  function flashcardDeck(ws, map) {
    var idx = Math.max(0, Math.min(S.cardIdx | 0, ws.length - 1));
    var w = ws[idx];
    var box = getP(map, w.id).box || 0;
    var status = box >= MASTERY ? 'known' : (box === 1 ? 'learning' : 'new');
    var statusLabel = box >= MASTERY ? '✓ Beheerst' : (box === 1 ? 'In oefening' : 'Nieuw');
    var vis = getVisual(w);
    var heroVis = vis ? renderVisual(w, 'hero') : '';
    return '<div class="vl-deck">' +
      '<div class="vl-deck-head"><span>Kaart ' + (idx + 1) + ' van ' + ws.length + '</span><span class="vl-status-chip ' + status + '">' + statusLabel + '</span></div>' +
      '<div class="vl-flashcard' + (S.cardFlip ? ' flipped' : '') + '" role="button" tabindex="0" data-vl="flip" aria-pressed="' + !!S.cardFlip + '" aria-label="Tik om de betekenis te tonen">' +
        heroVis +
        '<div class="vl-flash-ar" lang="ar" dir="rtl">' + esc(w.ar) + '</div>' +
        '<div class="vl-flash-tools"><button type="button" class="vl-speak-btn vl-speak-pill" data-vl="speak" data-ar="' + esc(w.ar) + '" aria-label="Beluister ' + esc(w.ar) + '">' + icon('speaker') + '<span>Luister</span></button></div>' +
        (S.cardFlip
          ? '<div class="vl-flash-back"><strong>' + esc(w.nl) + '</strong>' +
              '<div class="vl-flash-rate">' +
                '<button type="button" class="vl-rate-btn" data-vl="mark" data-id="' + esc(w.id) + '" data-ok="0">Nog oefenen</button>' +
                '<button type="button" class="vl-rate-btn ok" data-vl="mark" data-id="' + esc(w.id) + '" data-ok="1">✓ Ken ik</button>' +
              '</div></div>'
          : '<div class="vl-flash-cue">Tik op de kaart voor de betekenis</div>') +
      '</div>' +
      '<div class="vl-deck-nav">' +
        '<button type="button" class="gd-soft" data-vl="cprev" ' + (idx === 0 ? 'disabled ' : '') + '>‹ Vorige</button>' +
        '<button type="button" class="gd-soft" data-vl="cnext" ' + (idx >= ws.length - 1 ? 'disabled ' : '') + '>Volgende ›</button>' +
      '</div></div>';
  }

  function wordsScreen() {
    var ws = wordsFor(S.n), map = jget(K_PROG, {});
    var totalMastered = ws.filter(function (w) { return getP(map, w.id).box >= MASTERY; }).length;
    var pct = ws.length ? Math.round((100 * totalMastered) / ws.length) : 0;
    var viewMode = S.wordView || 'list';
    var filtered = S.filterTodo ? ws.filter(function (w) { return getP(map, w.id).box < MASTERY; }) : ws;
    if (!filtered.length) filtered = ws;

    var switcher = '<div class="vl-view-switch" role="tablist" aria-label="Weergave">' +
      '<button type="button" role="tab" class="vl-vtab' + (viewMode === 'cards' ? ' on' : '') + '" data-vl="wview" data-v="cards" aria-selected="' + (viewMode === 'cards') + '">Kaarten</button>' +
      '<button type="button" role="tab" class="vl-vtab' + (viewMode === 'list' ? ' on' : '') + '" data-vl="wview" data-v="list" aria-selected="' + (viewMode === 'list') + '">Woordenlijst</button>' +
      '</div>';

    var listHtml = '<div class="vl-words-meta">' +
        '<span class="vl-words-count">' + ws.length + ' woorden · ' + totalMastered + ' beheerst</span>' +
        (totalMastered > 0 && totalMastered < ws.length
          ? '<button type="button" class="vl-filter-btn' + (S.filterTodo ? ' on' : '') + '" data-vl="ftodo">' + (S.filterTodo ? 'Alle tonen' : 'Nog te leren (' + (ws.length - totalMastered) + ')') + '</button>'
          : '') +
      '</div>' +
      '<ul class="vl-words">' + filtered.map(function (w) {
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
      }).join('') + '</ul>';

    return '<div class="gd-shell gd-play vl">' +
      '<div class="gd-lesson-bar"><button type="button" class="vl-exit" data-vl="exit" aria-label="Terug naar het leerpad">' + icon('close') + '</button>' +
      '<div class="gd-progress-wrap"><div class="gd-progress-title"><strong>Woordenschat · Les ' + S.n + '</strong><span>' + totalMastered + ' / ' + ws.length + ' beheerst</span></div>' +
      '<div class="gd-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div></div></div>' +
      '<div class="gd-card"><div class="gd-stage-tag">Eerst bekijken</div><h1>' + esc(TITLES[S.n] || 'Les ' + S.n) + '</h1>' +
      '<p class="gd-support">Oefen de woorden eerst met de kaarten of bekijk de lijst, en start daarna de ronde.</p>' +
      switcher +
      (viewMode === 'cards' ? flashcardDeck(ws, map) : listHtml) +
      '<div class="gd-finish-actions"><button type="button" class="gd-primary gd-full" data-vl="start">Start oefenen</button></div></div></div>';
  }

  function matchBody(q) {
    var doneCount = Object.keys(q.done).length;
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
    return '<div class="vl-task-header"><span class="vl-task-tag">Koppelspel · ' + doneCount + ' / ' + q.words.length + '</span>' +
      '<h2 class="gd-task-title">Maak de juiste paren</h2>' +
      '<p class="gd-subinstruction">Tik een Arabisch woord en daarna de bijbehorende vertaling.</p></div>' +
      '<div class="vl-match"><div class="vl-col">' + q.left.map(function (id) { return tile('l', id); }).join('') + '</div>' +
      '<div class="vl-col">' + q.right.map(function (id) { return tile('r', id); }).join('') + '</div></div>';
  }

  function optButton(o, i, arOpt, q) {
    var picked = S.chosen === i;
    var mark = '';
    if (S.fb) mark = o === q.answer ? ' correct' : (picked ? ' wrong' : '');
    return '<button type="button" class="gd-option vl-opt-row' + (arOpt ? ' gd-option-ar gd-option-wide' : '') + (picked ? ' selected' : '') + mark +
      '" data-vl="pick" data-i="' + i + '" ' + (S.fb ? 'disabled ' : '') + 'aria-pressed="' + picked + '"' +
      (arOpt ? ' lang="ar" dir="rtl"' : '') + '>' +
      '<span class="vl-opt-key" aria-hidden="true">' + (i + 1) + '</span>' +
      '<span class="vl-opt-lbl">' + esc(o) + '</span></button>';
  }

  function playScreen() {
    var q = current(), total = S.qs.length, pct = Math.round(100 * S.i / Math.max(1, total));
    var tagPrefix = q.retry ? 'Herhaling · ' : '';
    var body;
    if (q.type === 'match') body = matchBody(q);
    else if (q.type === 'ar2img') {
      body = '<div class="vl-task-header"><span class="vl-task-tag">' + tagPrefix + 'Beeldkeuze</span>' +
        '<h2 class="gd-task-title">Kies het juiste plaatje</h2></div>' +
        '<div class="vl-question-box"><div class="gd-ar-question gd-arabic" lang="ar" dir="rtl">' + esc(q.word.ar) +
        '<button type="button" class="vl-speak-btn vl-speak-inline" data-vl="speak" data-ar="' + esc(q.word.ar) + '" aria-label="Beluister">' + icon('speaker') + '</button></div></div>' +
        '<div class="gd-options vl-pic-grid' + (S.fb ? ' revealed' : '') + '">' + q.options.map(function (w, i) {
          var picked = S.chosen === i;
          var mark = '';
          if (S.fb) mark = w.id === q.answer ? ' correct' : (picked ? ' wrong' : '');
          var url = picUrl(w) || 'img/duo/generic.svg';
          return '<button type="button" class="gd-option vl-pic-opt' + (picked ? ' selected' : '') + mark +
            '" data-vl="pick" data-i="' + i + '" ' + (S.fb ? 'disabled ' : '') + 'aria-pressed="' + picked +
            '" aria-label="' + esc(w.nl) + '"><span class="vl-pic-num" aria-hidden="true">' + (i + 1) + '</span>' +
            '<img src="' + esc(url) + '" alt="' + esc(w.nl) + '" loading="lazy" decoding="async"/>' +
            (S.fb ? '<span class="vl-pic-opt-lbl">' + esc(w.nl) + '</span>' : '') + '</button>';
        }).join('') + '</div>' +
        '<div class="gd-task-actions"><button type="button" class="gd-primary gd-full" data-vl="check" ' + (answered() && !S.fb ? '' : 'disabled') + '>Controleer</button></div>';
    } else if (q.type === 'tf') {
      body = '<div class="vl-task-header"><span class="vl-task-tag">' + tagPrefix + 'Snelle check</span>' +
        '<h2 class="gd-task-title">Klopt deze vertaling?</h2></div>' +
        '<div class="vl-tf-card">' +
          '<div class="gd-ar-question gd-arabic" lang="ar" dir="rtl">' + esc(q.word.ar) +
            '<button type="button" class="vl-speak-btn vl-speak-inline" data-vl="speak" data-ar="' + esc(q.word.ar) + '" aria-label="Beluister">' + icon('speaker') + '</button>' +
          '</div>' +
          '<div class="vl-tf-eq" aria-hidden="true">=</div>' +
          '<div class="gd-nl-question">' + esc(q.shownNl) + '</div>' +
        '</div>' +
        '<div class="gd-options vl-tf-opts">' + q.options.map(function (o, i) { return optButton(o, i, false, q); }).join('') + '</div>' +
        '<div class="gd-task-actions"><button type="button" class="gd-primary gd-full" data-vl="check" ' + (answered() && !S.fb ? '' : 'disabled') + '>Controleer</button></div>';
    } else if (q.type === 'pic2ar' || q.type === 'img2ar' || q.type === 'img2nl') {
      var arOpt = q.type !== 'img2nl';
      var v = getVisual(q.word);
      body = '<div class="vl-task-header"><span class="vl-task-tag">' + tagPrefix + 'Beeldherkenning</span>' +
        '<h2 class="gd-task-title">' + (arOpt ? 'Wat zie je op de afbeelding?' : 'Wat betekent dit plaatje?') + '</h2></div>' +
        (v ? renderVisual(q.word, 'hero') : '') +
        '<div class="gd-options">' + q.options.map(function (o, i) { return optButton(o, i, arOpt, q); }).join('') + '</div>' +
        '<div class="gd-task-actions"><button type="button" class="gd-primary gd-full" data-vl="check" ' + (answered() && !S.fb ? '' : 'disabled') + '>Controleer</button></div>';
    } else {
      var ar = q.type === 'nl2ar';
      var hasVis = !!getVisual(q.word);
      var qVis = ar ? renderVisual(q.word, 'question') : (S.hintShown ? renderVisual(q.word, 'question') : '');
      var hintBtn = (!ar && hasVis && !S.hintShown && !S.fb)
        ? '<button type="button" class="vl-hint-btn" data-vl="hint">' + icon('bulb') + '<span>Plaatje als hint</span></button>'
        : '';
      body = '<div class="vl-task-header"><span class="vl-task-tag">' + tagPrefix + (ar ? 'Nederlands naar Arabisch' : 'Betekenis') + '</span>' +
        '<h2 class="gd-task-title">' + (ar ? 'Kies het juiste Arabische woord' : 'Wat betekent dit woord?') + '</h2></div>' +
        '<div class="vl-question-box">' + qVis +
          (ar ? '<div class="gd-nl-question">' + esc(q.word.nl) + '</div>'
              : '<div class="gd-ar-question gd-arabic" lang="ar" dir="rtl">' + esc(q.word.ar) +
                '<button type="button" class="vl-speak-btn vl-speak-inline" data-vl="speak" data-ar="' + esc(q.word.ar) + '" aria-label="Beluister">' + icon('speaker') + '</button></div>') +
          hintBtn +
        '</div>' +
        '<div class="gd-options">' + q.options.map(function (o, i) { return optButton(o, i, ar, q); }).join('') + '</div>' +
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
        var comboBadge = (good && S.combo >= 3) ? '<span class="gd-combo">' + S.combo + '× combo</span>' : '';
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
          '<div class="gd-feedback-inner"><strong>' + headline + '</strong>' + comboBadge + detail +
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
      '<button type="button" class="gd-soft gd-full" data-vl="review-words">Woorden bekijken</button>' +
      '<button type="button" class="gd-soft gd-full" data-vl="exit">Terug naar het leerpad</button></div></div></div>';
  }
  function failScreen() {
    commitXp();
    return '<div class="gd-shell gd-play vl">' + bar('Afgebroken', Math.round(100 * S.i / Math.max(1, S.qs.length))) +
      '<div class="gd-card gd-finish"><span class="gd-finish-icon">' + icon('heart') + '</span>' +
      '<h1>Geen hartjes meer</h1><p>Je voortgang van deze ronde is bewaard. Probeer het zo nog een keer.</p>' +
      '<div class="gd-finish-actions"><button type="button" class="gd-primary gd-full" data-vl="again">Opnieuw proberen</button>' +
      '<button type="button" class="gd-soft gd-full" data-vl="review-words">Woorden bekijken</button>' +
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
    if (a === 'start') { clearTimeout(fastTimer); S.screen = 'play'; S.qs = build(S.n); S.i = 0; S.chosen = -1; S.hintShown = false; S.fb = null; render(); return; }
    if (a === 'review-words') { clearTimeout(fastTimer); var wn = S.n; commitXp(); S = null; return open(wn, 'words'); }
    if (a === 'wview') { S.wordView = t.getAttribute('data-v') === 'cards' ? 'cards' : 'list'; S.cardFlip = false; render(); return; }
    if (a === 'ftodo') { S.filterTodo = !S.filterTodo; render(); return; }
    if (a === 'flip') { S.cardFlip = !S.cardFlip; render(); return; }
    if (a === 'cprev') { S.cardIdx = Math.max(0, (S.cardIdx | 0) - 1); S.cardFlip = false; render(); return; }
    if (a === 'cnext') { S.cardIdx = Math.min(wordsFor(S.n).length - 1, (S.cardIdx | 0) + 1); S.cardFlip = false; render(); return; }
    if (a === 'mark') {
      var mid = t.getAttribute('data-id'), mok = t.getAttribute('data-ok') === '1';
      bump(mid, mok);
      var wsLen = wordsFor(S.n).length;
      if (S.cardIdx < wsLen - 1) S.cardIdx++;
      S.cardFlip = false;
      render();
      return;
    }
    if (a === 'hint') { S.hintShown = true; render(); return; }
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
      speak(t.getAttribute('data-ar') || '', t);
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
    if (!S || e.ctrlKey || e.altKey || e.metaKey) return;
    if (S.screen === 'words' && (S.wordView || 'cards') === 'cards') {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); S.cardFlip = !S.cardFlip; render(); return; }
      if (e.key === 'ArrowRight') { S.cardIdx = Math.min(wordsFor(S.n).length - 1, (S.cardIdx | 0) + 1); S.cardFlip = false; render(); return; }
      if (e.key === 'ArrowLeft') { S.cardIdx = Math.max(0, (S.cardIdx | 0) - 1); S.cardFlip = false; render(); return; }
      return;
    }
    if (S.screen !== 'play') return;
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
