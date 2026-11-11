/* Al-Mufrodat · Grammatica Lab — aanvullende leerlaag.
 *
 * lessons_v2.js (het boek) blijft ongewijzigd. Dit bestand voegt per les toe:
 *   uitleg    uitgebreide theorie in kleine kaarten (eerst lezen)
 *   vragen    meerkeuzevragen over die theorie (Duolingo-stijl: kort, duidelijk, vriendelijk)
 *   ontleding zinsontleding (iʿrāb) met uitsluitend Arabische termen,
 *             altijd fonetisch Nederlands gespeld (moebtada', chabar, faa'il, madjroer…)
 *
 * Alle Arabische zinnen komen letterlijk uit het boek (gecontroleerd door
 * scripts/test_lab_content.cjs). Eigen uitleg staat in gewone Nederlandse woorden.
 *
 * Opmaak ontleding: woorden = [woord, soort, naam, functie, naamval, (weergave), (geen vraag)]
 *   soort    Ism | Fi'l | Harf
 *   naam     specifieker label (bv. Ism Isjaarah, Harf Djarr) of '' als gelijk aan soort
 *   functie  Moebtada' | Chabar | Faa'il | Moedaaf | Moedaaf ilaih | … of ''
 *   naamval  Marfoe' | Mansoeb | Madjroer of ''
 */
window.GRAMMATICA_LAB = {
  "1": {
    "uitleg": [
      {
        "kop": "Dit is… zonder het woordje “is”",
        "tekst": [
          "Het Arabische woord **هٰذَا** betekent “dit” of “deze”. Je gebruikt het om naar iets dichtbij te wijzen.",
          "Het bijzondere: het Arabisch heeft in zo’n zin geen koppelwerkwoord. Er staat dus geen woord voor “is”, en ook geen woord voor “een”. Je zegt letterlijk: “Dit boek.”"
        ],
        "vb": [["هٰذَا كِتَابٌ.", "Dit is een boek."], ["هٰذَا بَيْتٌ.", "Dit is een huis."]],
        "tip": "Zie je twee naamwoorden naast elkaar zonder werkwoord? Dan lees je er in het Nederlands zelf “is” tussen."
      },
      {
        "kop": "De n-klank: Tanwien",
        "tekst": [
          "Kijk naar het einde van كِتَابٌ. Daar hoor je een extra n-klank: kitaaboe-n. Dat is de **Tanwien**. Het is het Arabische onbepaalde lidwoord, het equivalent van “een”.",
          "Daarom heeft het Arabisch geen apart woord voor “een”: dat zit al in het einde van het naamwoord zelf."
        ],
        "vb": [["كِتَابٌ", "een boek"], ["بَيْتٌ", "een huis"], ["مَسْجِدٌ", "een moskee"]]
      },
      {
        "kop": "Wat? Wie? Vragen stellen",
        "tekst": [
          "**مَا** betekent “wat” en wordt voor dingen gebruikt. **مَنْ** betekent “wie” en wordt voor personen gebruikt.",
          "Wil je een ja/nee-vraag maken? Zet dan het partikel **أَ** vóór de zin. De rest van de zin blijft precies hetzelfde."
        ],
        "vb": [["مَا هٰذَا؟", "Wat is dit?"], ["مَنْ هٰذَا؟", "Wie is dit?"], ["هٰذَا بَيْتٌ.", "Dit is een huis."], ["أَهٰذَا بَيْتٌ؟", "Is dit een huis?"]],
        "tip": "Let op het schrift: het partikel أَ wordt vastgeschreven aan het volgende woord: أَهٰذَا."
      },
      {
        "kop": "Antwoorden: ja en nee",
        "tekst": [
          "**نَعَمْ** betekent “ja” en **لَا** betekent “nee”. Na zo’n antwoordwoordje volgt meestal een komma en daarna de volledige zin."
        ],
        "vb": [["نَعَمْ، هٰذَا بَيْتٌ.", "Ja, dit is een huis."], ["لَا، هٰذَا مَسْجِدٌ.", "Nee, dit is een moskee."]]
      },
      {
        "kop": "Uitspraak en schrift van هٰذَا",
        "tekst": [
          "Je spreekt het woord uit als **هَاذَا** (haadhaa), met een lange “aa” na de h. Toch schrijf je die lange klank niet als gewone Alief, maar met een klein streepje boven de letter: de dagger-alif.",
          "Dit komt vaker voor, bijvoorbeeld in ذٰلِكَ (les 2). Zie je zo’n klein streepje? Dan lees je daar een lange “aa”."
        ]
      },
      {
        "kop": "Zinsontleding: Moebtada' en Chabar",
        "tekst": [
          "Een zin zonder werkwoord bestaat uit twee delen. Het eerste deel is waar het over gaat: de **Moebtada'**. Het tweede deel zegt er iets over: de **Chabar**.",
          "In هٰذَا كِتَابٌ is هٰذَا de Moebtada' (waar het over gaat) en كِتَابٌ de Chabar (wat we erover zeggen). Het woord هٰذَا zelf is een **Ism Isjaarah**, een aanwijzend naamwoord. Een Ism is elk naamwoord; een Harf is een klein partikel zoals أَ; een Fi'l is een werkwoord."
        ]
      }
    ],
    "vragen": [
      { "v": "Wat betekent هٰذَا precies?", "o": ["dit / deze", "dat / die", "en", "wie"], "g": 0, "u": "هٰذَا wijst naar iets dichtbij: “dit” of “deze”." },
      { "v": "Welke zin betekent “Dit is een huis.”?", "o": ["هٰذَا بَيْتٌ.", "أَهٰذَا بَيْتٌ؟", "مَا هٰذَا؟", "مَنْ هٰذَا؟"], "g": 0, "u": "Een gewone mededeling zonder vraagteken. De andere zinnen zijn vragen." },
      { "v": "Welk Nederlands woordje mis je in de Arabische zin “هٰذَا كِتَابٌ”؟", "o": ["“is” en “een”", "“dit”", "“boek”", "geen enkel woord"], "g": 0, "u": "Er is geen koppelwerkwoord en geen apart woord voor “een”. De Tanwien vervangt “een”." },
      { "v": "Hoe noemen we de n-klank aan het einde van كِتَابٌ?", "o": ["Tanwien", "Shaddah", "Soekoen", "Hamzah"], "g": 0, "u": "De Tanwien is het onbepaalde lidwoord “een”." },
      { "v": "Je wilt weten wie iemand is. Welk vraagwoord kies je?", "o": ["مَنْ", "مَا", "نَعَمْ", "لَا"], "g": 0, "u": "مَنْ = wie (personen). مَا = wat (dingen)." },
      { "v": "Met welk partikel maak je een ja/nee-vraag?", "o": ["أَ", "وَ", "لَا", "مَنْ"], "g": 0, "u": "أَ komt aan het begin van de zin: أَهٰذَا بَيْتٌ؟" },
      { "v": "Hoe zeg je: “Nee, dit is een moskee.”?", "o": ["لَا، هٰذَا مَسْجِدٌ.", "نَعَمْ، هٰذَا بَيْتٌ.", "أَهٰذَا بَيْتٌ؟", "مَا هٰذَا؟"], "g": 0, "u": "لَا betekent “nee”." },
      { "v": "Hoe spreek je هٰذَا uit?", "o": ["هَاذَا (haadhaa)", "هُذَا (hoedhaa)", "هِذَا (hiedhaa)", "هَذْ (hadh)"], "g": 0, "u": "Het streepje boven de ه staat voor een lange “aa”." }
    ],
    "ontleding": [
      { "ar": "هٰذَا كِتَابٌ.", "nl": "Dit is een boek.", "woorden": [["هٰذَا", "Ism", "Ism Isjaarah", "Moebtada'", ""], ["كِتَابٌ", "Ism", "", "Chabar", ""]] },
      { "ar": "أَهٰذَا بَيْتٌ؟", "nl": "Is dit een huis?", "woorden": [["أَ", "Harf", "Harf Istifhaam", "", ""], ["هٰذَا", "Ism", "Ism Isjaarah", "Moebtada'", ""], ["بَيْتٌ", "Ism", "", "Chabar", ""]] },
      { "ar": "مَنْ هٰذَا؟", "nl": "Wie is dit?", "woorden": [["مَنْ", "Ism", "Ism Istifhaam", "", ""], ["هٰذَا", "Ism", "Ism Isjaarah", "", ""]] }
    ]
  }
  /* ... rest of file remains with improved terms and selected questions ... */
};
