/* Vult ontbrekende lessen (Les 0, 17, 21 en eventuele toekomstige lessen) met
 * heldere theoriekaarten en duidelijke Duolingo-stijl vragen op basis van lessons_v2.js. */
(function fillMissingLabTheory() {
  'use strict';
  var DATA = window.GRAMMATICA || {};
  var LAB = window.GRAMMATICA_LAB = window.GRAMMATICA_LAB || {};

  function plain(s) {
    return String(s || '').replace(/\s+/g, ' ').trim();
  }
  function makeKop(text, fallback) {
    var line = plain(text).split(/[.!?\n]/)[0].trim();
    if (line.length > 4 && line.length <= 80) return line;
    return fallback || 'Onthoud dit';
  }

  // Handgeschreven heldere kaarten en vragen voor Les 0, 17 en 21 (die in lab_content.js
  // geen volledige lesstof of zinsontledingszinnen hebben).
  var EXTRA = {
    '0': {
      uitleg: [
        {
          kop: 'De drie korte klinkers',
          tekst: [
            'In het Arabisch schrijf je korte klinkers als kleine tekens **boven** of **onder** een medeklinker.',
            'Zo zie je direct hoe je een woord uitspreekt én welke naamval (uitgang) een woord heeft.'
          ],
          vb: [
            ['بَ — بِ — بُ', 'ba (Fathah) · bie (Kasrah) · boe (Dammah)']
          ],
          tip: 'Let steeds op het laatste klinkerteken van een woord: daaraan herken je de grammaticale rol in de zin.'
        },
        {
          kop: '1. Fathah (◌َ) · de a-klank',
          tekst: [
            'De **Fathah** is een schuin streepje **boven** de letter en klinkt als een korte **a**.',
            'Komt een Fathah op het einde van een naamwoord (Mansoeb)? Dan wijst dat vaak op een lijdend voorwerp of bijwoord.'
          ],
          vb: [
            ['كَتَبَ', 'ka-ta-ba (drie letters, allemaal met een Fathah)']
          ]
        },
        {
          kop: '2. Kasrah (◌ِ) · de ie-klank',
          tekst: [
            'De **Kasrah** is het enige korte klinkerteken dat **onder** de letter staat. Je spreekt het uit als een korte **ie**.',
            'Op het einde van een naamwoord (Madjroer) zie je Kasrah meestal na een voorzetsel (Harf Djarr) of bij bezit (Moedaaf Ilayh).'
          ],
          vb: [
            ['بِ — فِي الْبَيْتِ', 'bie · fie l-bayt-ie (Kasrah op de laatste t)']
          ]
        },
        {
          kop: '3. Dammah (◌ُ) · de oe-klank',
          tekst: [
            'De **Dammah** lijkt op een kleine lus of komma **boven** de letter en klinkt als een korte **oe**.',
            'Een zelfstandig naamwoord heeft standaard een Dammah (Marfoe‘) aan het einde, bijvoorbeeld als onderwerp (Moebtada) of gezegde (Khabar).'
          ],
          vb: [
            ['بَيْتٌ / الْبَيْتُ', 'bayt-oen (Tanwien -oen) · al-bayt-oe (enkele Dammah)']
          ]
        },
        {
          kop: '4 & 5. Soekoen (◌ْ) en Shaddah (◌ّ)',
          tekst: [
            '**Soekoen** (◌ْ) is een klein rondje boven de letter en betekent: **geen klinker**. De medeklinker sluit de lettergreep af.',
            '**Shaddah** (◌ّ) lijkt op een kleine w boven de letter en verdubbelt die letter: je spreekt hem krachtig en dubbel lang uit.'
          ],
          vb: [
            ['مِنْ · مُدَرِّسٌ', 'm-i-n (Soekoen op n) · moe-dar-ris-oen (dubbele r door Shaddah)']
          ],
          tip: 'Een Shaddah en een Kasrah kunnen samen staan: de Kasrah staat dan óf onder de letter óf direct onder de Shaddah.'
        }
      ],
      vragen: [
        { v: 'Welk klinkerteken geeft een korte a-klank en staat boven de letter?', o: ['Fathah (◌َ)', 'Kasrah (◌ِ)', 'Dammah (◌ُ)', 'Soekoen (◌ْ)'], g: 0, u: 'Fathah (◌َ) is een schuin streepje boven de letter en geeft de korte a-klank.' },
        { v: 'Welk korte klinkerteken staat altijd ONDER de letter?', o: ['Kasrah (◌ِ)', 'Fathah (◌َ)', 'Dammah (◌ُ)', 'Shaddah (◌ّ)'], g: 0, u: 'De Kasrah (◌ِ) staat onder de letter en klinkt als een korte ie.' },
        { v: 'Welke klank hoort bij de Dammah (◌ُ)?', o: ['De korte oe-klank', 'De korte ie-klank', 'De korte a-klank', 'Geen klinker'], g: 0, u: 'Dammah (◌ُ) klinkt als een korte oe, zoals aan het einde van الْبَيْتُ (al-baytoe).' },
        { v: 'Wat geeft het rondje Soekoen (◌ْ) boven een letter aan?', o: ['Dat er geen klinker na die letter komt', 'Dat de letter dubbel lang is', 'Een lange aa-klank', 'Een korte oe-klank'], g: 0, u: 'Soekoen (◌ْ) betekent de afwezigheid van een klinker: de letter sluit de klank direct af.' },
        { v: 'Wat betekent de Shaddah (◌ّ) boven een letter, zoals in مُدَرِّسٌ?', o: ['Je verdubbelt die letter in de uitspraak', 'Je spreekt de letter helemaal niet uit', 'Het woord wordt meervoud', 'Er komt een a-klank bij'], g: 0, u: 'Shaddah (◌ّ) geeft verdubbeling aan: مُدَرِّسٌ spreek je uit als moe-dar-ris-oen (met twee r-klanken).' },
        { v: 'Hoe herken je de ie-klank in schrift?', o: ['Een streepje onder de letter: Kasrah (◌ِ)', 'Een streepje boven de letter: Fathah (◌َ)', 'Een klein rondje boven de letter: Soekoen (◌ْ)', 'Een krul boven de letter: Dammah (◌ُ)'], g: 0, u: 'Fathah staat boven (a), Dammah boven (oe) en Kasrah als streepje onder de letter (ie).' }
      ]
    },
    '17': {
      uitleg: [
        {
          kop: 'Herhaling: dingen en dieren in het meervoud',
          tekst: [
            'Les 17 bouwt direct voort op Les 16 en introduceert geen nieuwe grammaticale constructie.',
            'De belangrijkste regel om vast te houden: het meervoud van woorden **zonder verstand** (dingen, plaatsen en dieren) wordt grammaticaal behandeld als **vrouwelijk enkelvoud**.'
          ],
          vb: [
            ['هٰذِهِ حَمِيْرٌ صَغِيْرَةٌ.', 'Dit zijn kleine ezels. (letterlijk: deze-v. ezels kleine-v.)']
          ],
          tip: 'Gebruik bij het meervoud van dingen of dieren dus altijd هٰذِهِ / تِلْكَ / هِيَ en een bijvoeglijk naamwoord met ة!'
        },
        {
          kop: 'Twee meervouden voor “ezel” (حِمَارٌ)',
          tekst: [
            'In deze les leer je dat het enkelvoud **حِمَارٌ** (“ezel”) twee gebroken meervouden kent: **حُمُرٌ** en **حَمِيْرٌ** (“ezels”).',
            'Omdat dieren geen verstand hebben (ghayr ‘aaqil), gedragen beide meervouden zich in een zin als vrouwelijk enkelvoud.'
          ],
          vb: [
            ['حِمَارٌ → حُمُرٌ / حَمِيْرٌ', 'een ezel → ezels']
          ]
        }
      ],
      vragen: [
        { v: 'Wat leer je voor nieuws in Les 17 qua grammatica?', o: ['Geen nieuwe constructie: het verdiept de regel uit Les 16', 'Hoe je de verleden tijd vervoegt', 'Hoe je getallen boven de tien gebruikt', 'Nieuwe voorzetsels (Harf Djarr)'], g: 0, u: 'Les 17 is een vervolg- en oefenles op het irrationele meervoud uit Les 16.' },
        { v: 'Wat zijn de twee meervoudsvormen van حِمَارٌ (ezel)?', o: ['حُمُرٌ en حَمِيْرٌ', 'حِمَارُوْنَ en حِمَارَاتٌ', 'أَحْمِرَةٌ en حَمَارُ', 'بُيُوْتٌ en كُتُبٌ'], g: 0, u: 'حِمَارٌ heeft twee gebroken meervouden: حُمُرٌ en حَمِيْرٌ (ezels).' },
        { v: 'Welk aanwijzend voornaamwoord past bij حَمِيْرٌ (“ezels”, dichtbij)?', o: ['هٰذِهِ', 'هٰذَا', 'هٰؤُلَاءِ', 'ذٰلِكَ'], g: 0, u: 'Dieren vallen onder het irrationeel meervoud; daarom gebruik je vrouwelijk enkelvoud: هٰذِهِ.' },
        { v: 'Welk persoonlijk voornaamwoord gebruik je voor een meervoud van dieren?', o: ['هِيَ (vrouwelijk enkelvoud)', 'هُمْ (mannelijk meervoud)', 'هُنَّ (vrouwelijk meervoud)', 'هُوَ (mannelijk enkelvoud)'], g: 0, u: 'Het meervoud van dingen en dieren wordt altijd als vrouwelijk enkelvoud (هِيَ) behandeld.' }
      ]
    },
    '21': {
      uitleg: [
        {
          kop: 'ذَاكَ is hetzelfde als ذٰلِكَ',
          tekst: [
            'Les 21 is een oefenles zonder nieuwe grammaticaregel, maar met zes handige nieuwe woorden.',
            'Zo kom je **ذَاكَ** tegen: dit betekent precies hetzelfde als **ذٰلِكَ** (“dat / die” veraf, mannelijk). Het is simpelweg een kortere variant.'
          ],
          vb: [
            ['ذَاكَ = ذٰلِكَ', 'die / dat (veraf, mannelijk · Ism Ishaara)']
          ]
        },
        {
          kop: 'Werkwoord met aangehecht voornaamwoord: نُحِبُّ en نُحِبُّهُ',
          tekst: [
            'Je kent al أُحِبُّ (“ik houd van”). In deze les leer je **نُحِبُّ**: “wij houden van”.',
            'Plak je daar **ـهُ** (“hem / het”) achter, dan krijg je **نُحِبُّهُ**: “wij houden van hem”. Het stukje ـهُ is een **Damier** in de rol van **Maf‘oel bihi** (lijdend voorwerp).'
          ],
          vb: [
            ['نُحِبُّ → نُحِبُّهُ', 'wij houden van → wij houden van hem']
          ],
          tip: 'In één Arabisch woord kunnen dus het werkwoord (Fi‘l), het onderwerp (“wij”, Faa‘il) én het lijdend voorwerp (ـهُ, Maf‘oel bihi) zitten!'
        },
        {
          kop: 'Drie nuttige woorden: وَاسِعٌ, آسِيَا, اللَّوْنُ',
          tekst: [
            '**وَاسِعٌ** betekent “ruim” of “wijd” (bijv. voor een kamer of klaslokaal).',
            '**آسِيَا** is “Azië” en **اللَّوْنُ** betekent “de kleur” (meervoud: **أَلْوَانٌ**).'
          ],
          vb: [
            ['اللَّوْنُ → أَلْوَانٌ', 'de kleur → kleuren'],
            ['وَاسِعٌ · آسِيَا', 'ruim / wijd · Azië']
          ]
        }
      ],
      vragen: [
        { v: 'Wat betekent ذَاكَ, en waar lijkt het op?', o: ['“dat / die” — het is hetzelfde als ذٰلِكَ', '“dit / deze” — het is hetzelfde als هٰذِهِ', '“en” — het is hetzelfde als وَ', '“wij houden van” — net als نُحِبُّ'], g: 0, u: 'ذَاكَ en ذٰلِكَ betekenen allebei “dat / die” (aanwijzend voornaamwoord voor iets veraf).' },
        { v: 'Wat betekent نُحِبُّهُ precies?', o: ['Wij houden van hem', 'Ik houd van hem', 'Hij houdt van ons', 'Jij houdt van haar'], g: 0, u: 'نُحِبُّ betekent “wij houden van” en het aangehechte achtervoegsel ـهُ betekent “hem”.' },
        { v: 'Welke functie heeft het achtervoegsel ـهُ in نُحِبُّهُ?', o: ['Maf‘oel bihi (lijdend voorwerp)', 'Moebtada (onderwerp van de zin)', 'Harf Djarr (voorzetsel)', 'Na‘t (bijvoeglijk naamwoord)'], g: 0, u: 'ـهُ (“hem”) geeft aan van wie wordt gehouden: dat is de Maf‘oel bihi (het lijdend voorwerp).' },
        { v: 'Wat is het meervoud van اللَّوْنُ (de kleur)?', o: ['أَلْوَانٌ', 'لَوْنُوْنَ', 'لَوْنَاتٌ', 'مَلَاوِنُ'], g: 0, u: 'اللَّوْنُ heeft een gebroken meervoud: أَلْوَانٌ (kleuren).' },
        { v: 'Wat betekent وَاسِعٌ?', o: ['Ruim / wijd', 'Kleur', 'Azië', 'Klein'], g: 0, u: 'وَاسِعٌ betekent “ruim” of “wijd”, bijvoorbeeld gebruikt voor een groot lokaal of huis.' }
      ]
    }
  };

  Object.keys(EXTRA).forEach(function (k) {
    LAB[k] = LAB[k] || {};
    if (!LAB[k].uitleg || LAB[k].uitleg.length < 2) LAB[k].uitleg = EXTRA[k].uitleg;
    if (!LAB[k].vragen || !LAB[k].vragen.length) LAB[k].vragen = EXTRA[k].vragen;
  });

  // Algemene fallback voor eventuele lessen zonder lab_content.
  Object.keys(DATA).forEach(function (key) {
    var n = key;
    if (LAB[n] && LAB[n].uitleg && LAB[n].uitleg.length) return;
    var items = (DATA[n] && DATA[n].inhoud) || [];
    if (!items.length) return;

    var notes = [];
    var examples = [];
    items.forEach(function (item, i) {
      var t = plain(item.tekst);
      if (['regel', 'tekst', 'kop'].indexOf(item.type) >= 0 && t.length > 10 &&
          !/^(?:voorbeelden?:?|merk op:?|les \d+[a-z]?|in deze les leren we het volgende:?|woordenlijst van les)/i.test(t)) {
        notes.push({ text: t, index: i, type: item.type });
      }
      if (item.type === 'voorbeeld' && plain(item.ar)) {
        examples.push({ ar: plain(item.ar), nl: plain(item.nl || ''), index: i });
      }
    });

    function pickExamples(around, take) {
      var ranked = examples.slice().sort(function (a, b) {
        return Math.abs(a.index - around) - Math.abs(b.index - around);
      });
      var out = [], seen = {};
      for (var i = 0; i < ranked.length && out.length < (take || 2); i++) {
        if (seen[ranked[i].ar]) continue;
        seen[ranked[i].ar] = 1;
        out.push([ranked[i].ar, ranked[i].nl || '']);
      }
      return out;
    }

    var uitleg = [];
    notes.forEach(function (note, idx) {
      var body = note.text;
      var kop = note.type === 'kop' ? body : makeKop(body, 'Regel ' + (idx + 1));
      var tekst = note.type === 'kop' ? [] : [body];
      uitleg.push({
        kop: kop,
        tekst: tekst,
        vb: pickExamples(note.index, 2)
      });
    });

    if (!uitleg.length && examples.length) {
      examples.slice(0, 4).forEach(function (ex, i) {
        uitleg.push({
          kop: 'Voorbeeld ' + (i + 1),
          tekst: ['Bekijk deze zin uit de les en let op de vorm.'],
          vb: [[ex.ar, ex.nl]]
        });
      });
    }

    if (!uitleg.length) return;
    if (uitleg.length > 6) uitleg = uitleg.slice(0, 6);
    LAB[n] = LAB[n] || {};
    LAB[n].uitleg = uitleg;
  });
})();
