/* Al-Mufrodat · Grammatica Lab — aanvullende leerlaag.
 *
 * lessons_v2.js (het boek) blijft ongewijzigd. Dit bestand voegt per les toe:
 *   uitleg    uitgebreide theorie in kleine kaarten (eerst lezen)
 *   vragen    meerkeuzevragen over die theorie
 *   ontleding zinsontleding (iʿrāb) met uitsluitend Arabische termen,
 *             Nederlands gespeld zoals in het boek (Moedaaf, Madjroer, Harf Djarr…)
 *
 * Alle Arabische zinnen komen letterlijk uit het boek (gecontroleerd door
 * scripts/test_lab_content.cjs). Eigen uitleg staat in gewone Nederlandse woorden.
 *
 * Opmaak ontleding: woorden = [woord, soort, naam, functie, naamval, (weergave), (geen vraag)]
 *   soort    Ism | Fi‘l | Harf
 *   naam     specifieker label (bv. Ism Isjaarah, Harf Djarr) of '' als gelijk aan soort
 *   functie  Moebtada | Chabar | Faa‘il | Moedaaf | Moedaaf Ilaih | … of ''
 *   naamval  Marfoe‘ | Mansoeb | Madjroer of ''
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
        "kop": "Zinsontleding: Moebtada en Chabar",
        "tekst": [
          "Een zin zonder werkwoord bestaat uit twee delen. Het eerste deel is waar het over gaat: de **Moebtada**. Het tweede deel zegt er iets over: de **Chabar**.",
          "In هٰذَا كِتَابٌ is هٰذَا de Moebtada (waar het over gaat) en كِتَابٌ de Chabar (wat we erover zeggen). Het woord هٰذَا zelf is een **Ism Isjaarah**, een aanwijzend naamwoord. Een Ism is elk naamwoord; een Harf is een klein partikel zoals أَ; een Fi‘l is een werkwoord."
        ]
      }
    ],
    "vragen": [
      { "v": "Wat betekent هٰذَا?", "o": ["dit / deze", "dat / die", "en", "wie"], "g": 0, "u": "هٰذَا wijst naar iets dichtbij: “dit” of “deze”." },
      { "v": "Welke zin betekent “Dit is een huis.”?", "o": ["هٰذَا بَيْتٌ.", "أَهٰذَا بَيْتٌ؟", "مَا هٰذَا؟", "مَنْ هٰذَا؟"], "g": 0, "u": "Een gewone mededeling zonder vraagteken. De andere zinnen zijn vragen." },
      { "v": "Welk Nederlands woord heeft het Arabisch níet nodig in “Dit is een boek”?", "o": ["“is” en “een”", "“dit”", "“boek”", "geen enkel woord"], "g": 0, "u": "Er is geen koppelwerkwoord en geen apart woord voor “een”. De Tanwien vervangt “een”." },
      { "v": "Hoe heet de n-klank aan het einde van كِتَابٌ?", "o": ["Tanwien", "Shaddah", "Soekoen", "Hamzah"], "g": 0, "u": "De Tanwien is het onbepaalde lidwoord “een”." },
      { "v": "Je wilt weten wie iemand is. Welk vraagwoord gebruik je?", "o": ["مَنْ", "مَا", "نَعَمْ", "لَا"], "g": 0, "u": "مَنْ = wie (personen). مَا = wat (dingen)." },
      { "v": "Welk partikel maakt van een zin een ja/nee-vraag?", "o": ["أَ", "وَ", "لَا", "مَنْ"], "g": 0, "u": "أَ komt aan het begin van de zin: أَهٰذَا بَيْتٌ؟" },
      { "v": "Hoe zeg je “Nee, dit is een moskee.”?", "o": ["لَا، هٰذَا مَسْجِدٌ.", "نَعَمْ، هٰذَا بَيْتٌ.", "أَهٰذَا بَيْتٌ؟", "مَا هٰذَا؟"], "g": 0, "u": "لَا betekent “nee”." },
      { "v": "Hoe wordt هٰذَا uitgesproken?", "o": ["هَاذَا (haadhaa)", "هُذَا (hoedhaa)", "هِذَا (hiedhaa)", "هَذْ (hadh)"], "g": 0, "u": "Het streepje boven de ه staat voor een lange “aa”." }
    ],
    "ontleding": [
      { "ar": "هٰذَا كِتَابٌ.", "nl": "Dit is een boek.", "woorden": [["هٰذَا", "Ism", "Ism Isjaarah", "Moebtada", ""], ["كِتَابٌ", "Ism", "", "Chabar", ""]] },
      { "ar": "أَهٰذَا بَيْتٌ؟", "nl": "Is dit een huis?", "woorden": [["أَ", "Harf", "Harf Istifhaam", "", ""], ["هٰذَا", "Ism", "Ism Isjaarah", "Moebtada", ""], ["بَيْتٌ", "Ism", "", "Chabar", ""]] },
      { "ar": "مَنْ هٰذَا؟", "nl": "Wie is dit?", "woorden": [["مَنْ", "Ism", "Ism Istifhaam", "", ""], ["هٰذَا", "Ism", "Ism Isjaarah", "", ""]] }
    ]
  },

  "2": {
    "uitleg": [
      {
        "kop": "Dichtbij en veraf: هٰذَا en ذٰلِكَ",
        "tekst": [
          "In les 1 leerde je هٰذَا (“dit”). Nu leer je het woord voor iets dat verder weg is: **ذٰلِكَ**, “die” of “dat”.",
          "Nederlands doet hetzelfde: “dit” is dichtbij, “dat” is veraf. Beide woorden zijn een **Ism Isjaarah**."
        ],
        "vb": [["هٰذَا بَيْتٌ، وَذٰلِكَ مَسْجِدٌ.", "Dit is een huis en dat is een moskee."]]
      },
      {
        "kop": "Het woordje وَ (“en”)",
        "tekst": [
          "Met **وَ** verbind je twee woorden of zinnen. Het is een **Harf**, een klein partikel dat een eigen betekenis heeft (“en”) maar geen zelfstandige zin kan vormen.",
          "Belangrijk voor het schrift: وَ staat niet los, maar wordt vastgeschreven aan het volgende woord. Je schrijft dus وَذٰلِكَ en niet وَ ذٰلِكَ."
        ],
        "tip": "Het Arabisch noemt dit verbindende partikel een Harf Atf: een partikel dat twee delen aan elkaar koppelt."
      },
      {
        "kop": "Uitspraak van ذٰلِكَ",
        "tekst": [
          "Net als bij هٰذَا schrijf je de lange klank als dagger-alif. Je zegt **ذَالِكَ** (dhaalika). Een zin als هٰذَا بَيْتٌ، وَذٰلِكَ مَسْجِدٌ bestaat uit twee kleine zinnen, elk met een Moebtada en een Chabar."
        ]
      }
    ],
    "vragen": [
      { "v": "Wat betekent ذٰلِكَ?", "o": ["die / dat", "dit / deze", "en", "wie"], "g": 0, "u": "ذٰلِكَ wijst naar iets dat verder weg is." },
      { "v": "Wat betekent وَ?", "o": ["en", "nee", "wat", "in"], "g": 0, "u": "وَ verbindt woorden of zinnen: “en”." },
      { "v": "Hoe schrijf je وَ?", "o": ["Vast aan het volgende woord", "Los, met een spatie erna", "Alleen aan het einde van een zin", "Boven het volgende woord"], "g": 0, "u": "Na وَ komt geen spatie: وَذٰلِكَ." },
      { "v": "Welke zin betekent “Dit is een huis en dat is een moskee.”?", "o": ["هٰذَا بَيْتٌ، وَذٰلِكَ مَسْجِدٌ.", "هٰذَا كِتَابٌ.", "أَهٰذَا بَيْتٌ؟", "لَا، هٰذَا مَسْجِدٌ."], "g": 0, "u": "Eerst “dit” (هٰذَا), dan “en dat” (وَذٰلِكَ)." },
      { "v": "Welke is het woord voor iets dat dichtbij is?", "o": ["هٰذَا", "ذٰلِكَ", "وَ", "مَنْ"], "g": 0, "u": "هٰذَا = dit (dichtbij); ذٰلِكَ = dat (veraf)." }
    ],
    "ontleding": [
      { "ar": "هٰذَا بَيْتٌ، وَذٰلِكَ مَسْجِدٌ.", "nl": "Dit is een huis en dat is een moskee.", "woorden": [["هٰذَا", "Ism", "Ism Isjaarah", "Moebtada", ""], ["بَيْتٌ،", "Ism", "", "Chabar", ""], ["وَذٰلِكَ", "Harf", "Harf Atf", "", "", "وَ + ذٰلِكَ (Ism Isjaarah, Moebtada)", 1], ["مَسْجِدٌ.", "Ism", "", "Chabar", ""]] }
    ]
  },

  "3": {
    "uitleg": [
      {
        "kop": "Het bepaalde lidwoord اَلْ (“al”)",
        "tekst": [
          "Het Arabisch heeft één bepaald lidwoord voor “de” én “het”: **اَلْ** (al). Het wordt vóór het naamwoord geschreven: بَيْتٌ → اَلْبَيْتُ.",
          "Kijk goed wat er gebeurt: de Tanwien (de n-klank) verdwijnt. Een naamwoord kan nooit tegelijk een lidwoord én een Tanwien hebben. Het onbepaalde “-n” is dus weg."
        ],
        "vb": [["بَيْتٌ → اَلْبَيْتُ", "baitoe-n → al-baitoe"]]
      },
      {
        "kop": "Zonneletters en maanletters",
        "tekst": [
          "Het alfabet heeft 28 letters, verdeeld in twee groepen van 14: de **zonneletters** en de **maanletters**.",
          "Bij zonneletters (zoals t, n, r, s) gebruik je de punt van je tong. Bij maanletters (zoals b, w, m, k) speelt de tongpunt geen rol. Welke groep het is, bepaalt hoe je اَلْ uitspreekt."
        ],
        "tip": "Het woord voor “zon”, اَلشَّمْسُ, begint met een zonneletter. Het woord voor “maan”, اَلْقَمَرُ, begint met een maanletter. Zo onthoud je de namen."
      },
      {
        "kop": "Voor een zonneletter: assimilatie",
        "tekst": [
          "Begint het naamwoord met een zonneletter, dan wordt de **l** van al niet uitgesproken. De l “smelt samen” met de zonneletter. Je spreekt اَلشَّمْسُ dus uit als ash-shamsoe, niet als al-shamsoe.",
          "In het schrift verandert niets, maar je herkent de assimilatie aan de **Shaddah** (◌ّ) op de eerste letter van het naamwoord."
        ],
        "vb": [["اَلنَّجْمُ", "an-Nadjmoe"], ["اَلرَّجُلُ", "ar-Radjoeloe"], ["اَلدِّيْكُ", "ad-Diekoe"], ["اَلسَّمَكُ", "as-Samakoe"]]
      },
      {
        "kop": "Voor een maanletter: geen assimilatie",
        "tekst": [
          "Begint het naamwoord met een maanletter, dan hoor je de l gewoon: اَلْقَمَرُ wordt al-Qamaroe. Er staat dan een **Soekoen** (◌ْ) op de l en geen Shaddah op de volgende letter."
        ]
      },
      {
        "kop": "De “a” van al verdwijnt soms: Hamzatoel Wasl",
        "tekst": [
          "De a aan het begin van al spreek je alleen uit als er niets voor staat. Gaat er een ander woord aan vooraf, zoals وَ (“en”), dan vervalt die a in de uitspraak: wal-baitoe en niet wa al-baitoe.",
          "Die weggevallen beginklinker heet **Hamzatoel Wasl** (“Hamzah van de verbinding”). Voor het gemak staat het teken ٱ soms boven de Hamzah, maar het is niet verplicht."
        ],
        "vb": [["اَلْبَابُ مَفْتُوْحٌ.", "De deur is open."], ["اَلْقَلَمُ مَكْسُوْرٌ.", "De pen is gebroken."]],
        "tip": "Bijvoeglijke naamwoorden zoals مَفْتُوْحٌ (“open”) krijgen wél een Tanwien, maar die vertaal je niet als “een”."
      },
      {
        "kop": "Zinsontleding met een bijvoeglijk naamwoord",
        "tekst": [
          "In اَلْبَابُ مَفْتُوْحٌ is اَلْبَابُ de **Moebtada** en مَفْتُوْحٌ de **Chabar**. Het is dus niet alleen een naamwoord dat een Chabar kan zijn: ook een eigenschap als “open” of “gebroken” kan die rol hebben."
        ]
      }
    ],
    "vragen": [
      { "v": "Welk woord vertaalt “de” en “het”?", "o": ["اَلْ", "وَ", "أَ", "مَنْ"], "g": 0, "u": "اَلْ is het bepaalde lidwoord." },
      { "v": "Wat verdwijnt van بَيْتٌ wanneer je اَلْ ervoor zet?", "o": ["De Tanwien", "De Alief", "De Shaddah", "De Hamzah"], "g": 0, "u": "Lidwoord en Tanwien sluiten elkaar uit: بَيْتٌ → اَلْبَيْتُ." },
      { "v": "Hoeveel zonneletters zijn er?", "o": ["14", "10", "28", "7"], "g": 0, "u": "28 letters in totaal: 14 zonneletters en 14 maanletters." },
      { "v": "Hoe spreek je اَلشَّمْسُ uit?", "o": ["ash-shamsoe", "al-shamsoe", "al-samsoe", "ash-samsoe"], "g": 0, "u": "Bij een zonneletter assimileert de l: ash-shamsoe." },
      { "v": "Waaraan zie je in het schrift dat de l assimileert?", "o": ["Aan de Shaddah op de eerste letter van het naamwoord", "Aan een Soekoen op de l", "Aan een extra Alief", "Je ziet het niet"], "g": 0, "u": "De Shaddah (◌ّ) markeert de assimilatie." },
      { "v": "Welk woord begint met een maanletter, zodat je de l hoort?", "o": ["اَلْقَمَرُ", "اَلشَّمْسُ", "اَلنَّجْمُ", "اَلرَّجُلُ"], "g": 0, "u": "ق is een maanletter. De drie andere beginnen met een zonneletter." },
      { "v": "Hoe wordt وَٱلْبَيْتُ uitgesproken?", "o": ["wal-baitoe", "wa al-baitoe", "wab-baitoe", "wal-aitoe"], "g": 0, "u": "De a van al vervalt na wa: de Hamzatoel Wasl." },
      { "v": "Hoe heet de beginklinker die in de uitspraak wegvalt?", "o": ["Hamzatoel Wasl", "Taa’ Marboetah", "Tanwien", "Soekoen"], "g": 0, "u": "Hamzatoel Wasl = de Hamzah van de verbinding." },
      { "v": "Wat betekent اَلْبَابُ مَفْتُوْحٌ.?", "o": ["De deur is open.", "Een deur.", "De pen is gebroken.", "Wat is dit?"], "g": 0, "u": "بَابٌ = deur, مَفْتُوْحٌ = open." }
    ],
    "ontleding": [
      { "ar": "اَلْبَابُ مَفْتُوْحٌ.", "nl": "De deur is open.", "woorden": [["اَلْبَابُ", "Ism", "", "Moebtada", "Marfoe‘"], ["مَفْتُوْحٌ.", "Ism", "", "Chabar", "Marfoe‘"]] },
      { "ar": "اَلْقَلَمُ مَكْسُوْرٌ.", "nl": "De pen is gebroken.", "woorden": [["اَلْقَلَمُ", "Ism", "", "Moebtada", "Marfoe‘"], ["مَكْسُوْرٌ.", "Ism", "", "Chabar", "Marfoe‘"]] }
    ]
  },

  "4": {
    "uitleg": [
      {
        "kop": "Naamwoorden hebben een uitgang",
        "tekst": [
          "Aan het einde van een Arabisch naamwoord hoor je een korte klinker. Die uitgang laat zien welke rol het woord in de zin heeft. De gewone uitgang is **-oe** (Dammah ◌ُ), zoals in اَلْبَيْتُ جَدِيْدٌ.",
          "Een naamwoord met deze uitgang heet **Marfoe‘** (nominatief). Tot nu toe waren alle woorden die je zag Marfoe‘."
        ],
        "vb": [["اَلْبَيْتُ جَدِيْدٌ.", "Het huis is nieuw."]]
      },
      {
        "kop": "Het voorzetsel: Harf Djarr en Madjroer",
        "tekst": [
          "Een voorzetsel heet in het Arabisch een **Harf Djarr** (meervoud: Hoeroef al-Djarr). Voorbeelden zijn فِيْ (“in”) en عَلَى (“op”).",
          "Na een Harf Djarr verandert de uitgang van het naamwoord van -oe naar **-ie** (Kasrah ◌ِ). Zo’n naamwoord heet **Madjroer** (genitief)."
        ],
        "vb": [["اَلْبَيْتُ", "het huis"], ["فِي الْبَيْتِ", "in het huis"], ["بَيْتٌ", "een huis"], ["فِيْ بَيْتٍ", "in een huis"], ["عَلَى الْمَكْتَبِ", "op het bureau"]],
        "tip": "Let op فِيْ: bij een volgend اَلْ wordt de lange “ie” kort. Daarom schrijf je فِي الْبَيْتِ."
      },
      {
        "kop": "Hij en zij: هُوَ en هِيَ",
        "tekst": [
          "Elk Arabisch naamwoord is mannelijk of vrouwelijk, ook voor dieren en dingen. Voor mannelijk gebruik je **هُوَ** (“hij”, “het”), voor vrouwelijk **هِيَ** (“zij”, “het”). Zo’n voornaamwoord heet een **Dhamier**.",
          "De meeste vrouwelijke naamwoorden eindigen op de **Taa’ Marboetah** (ة). Er zijn ook uitzonderingen zonder die uitgang."
        ],
        "vb": [["أَيْنَ الْكِتَابُ؟", "Waar is het boek?"], ["هُوَ عَلَى الْمَكْتَبِ.", "Het is op het bureau."], ["أَيْنَ السَّاعَةُ؟", "Waar is het horloge?"], ["هِيَ عَلَى السَّرِيْرِ.", "Het is op het bed."]]
      },
      {
        "kop": "Eigennamen: geen Tanwien",
        "tekst": [
          "Eigennamen betekenen niet “een Haamied”, dus ze krijgen geen Tanwien als lidwoord. Vrouwelijke eigennamen zoals آمِنَةُ en فَاطِمَةُ krijgen helemaal geen Tanwien."
        ],
        "vb": [["آمِنَةُ", "Aaminah (niet آمِنَةٌ)"], ["زَيْنَبُ", "Zainab (niet زَيْنَبٌ)"]]
      },
      {
        "kop": "Ik en jij: أَنَا en أَنْتَ",
        "tekst": [
          "**أَنَا** betekent “ik” (mannelijk én vrouwelijk) en **أَنْتَ** betekent “jij” (alleen mannelijk enkelvoud). Ook dit zijn Dhamier-woorden.",
          "Nieuwe voorzetsels: **مِنْ** (“van”, “uit”) en **إِلَى** (“naar”)."
        ],
        "vb": [["أَنَا مُحَمَّدٌ.", "Ik ben Mohammed."], ["أَنَا آمِنَةُ.", "Ik ben Aaminah."]]
      },
      {
        "kop": "Het werkwoord: Fi‘l en Faa‘il",
        "tekst": [
          "Een werkwoord heet een **Fi‘l**. **ذَهَبَ** betekent “hij ging” en **خَرَجَ** “hij ging naar buiten”.",
          "Staat er na het werkwoord een naamwoord dat zegt wie het doet, dan vervalt “hij”. Die persoon of zaak heet de **Faa‘il** (dader/onderwerp van het werkwoord) en is altijd Marfoe‘."
        ],
        "vb": [["ذَهَبَ إِلَى الْمَسْجِدِ.", "Hij ging naar de moskee."], ["ذَهَبَ بِلَالٌ إِلَى الْمَسْجِدِ.", "Bilaal ging naar de moskee."]],
        "tip": "Het werkwoord staat in het Arabisch meestal vooraan in de zin."
      }
    ],
    "vragen": [
      { "v": "Hoe heet een voorzetsel in het Arabisch?", "o": ["Harf Djarr", "Fi‘l", "Moebtada", "Tanwien"], "g": 0, "u": "Harf Djarr = voorzetsel (letterlijk “partikel dat genitief veroorzaakt”)." },
      { "v": "Welke uitgang krijgt een naamwoord na een Harf Djarr?", "o": ["-ie (Kasrah)", "-oe (Dammah)", "-a (Fathah)", "geen"], "g": 0, "u": "Na een voorzetsel is het naamwoord Madjroer: uitgang -ie." },
      { "v": "Welke term hoort bij een naamwoord met de gewone uitgang -oe?", "o": ["Marfoe‘", "Madjroer", "Moedaaf", "Harf"], "g": 0, "u": "Marfoe‘ = nominatief, de basisuitgang -oe." },
      { "v": "Welke term hoort bij het woord الْبَيْتِ in فِي الْبَيْتِ?", "o": ["Madjroer", "Marfoe‘", "Faa‘il", "Fi‘l"], "g": 0, "u": "Het naamwoord volgt een voorzetsel, dus Madjroer." },
      { "v": "Wat betekent هِيَ?", "o": ["zij, het (vrouwelijk)", "hij, het (mannelijk)", "ik", "jij"], "g": 0, "u": "هِيَ is voor vrouwelijke naamwoorden, ook voor dingen." },
      { "v": "Welk voornaamwoord past bij اَلْكِتَابُ (het boek)?", "o": ["هُوَ", "هِيَ", "أَنَا", "أَنْتَ"], "g": 0, "u": "كِتَابٌ is mannelijk, dus هُوَ." },
      { "v": "Hoe heet de uitgang ة van de meeste vrouwelijke naamwoorden?", "o": ["Taa’ Marboetah", "Hamzatoel Wasl", "Tanwien", "Shaddah"], "g": 0, "u": "De Taa’ Marboetah ة kenmerkt veel vrouwelijke naamwoorden." },
      { "v": "Welke is de juiste schrijfwijze van de naam Aaminah?", "o": ["آمِنَةُ", "آمِنَةٌ", "آمِنَةٍ", "آمِنَةً"], "g": 0, "u": "Vrouwelijke eigennamen krijgen geen Tanwien." },
      { "v": "Hoe heet de dader van een werkwoord (in ذَهَبَ بِلَالٌ)?", "o": ["Faa‘il", "Chabar", "Moedaaf", "Harf Djarr"], "g": 0, "u": "Wie de handeling doet, is de Faa‘il. Hij is Marfoe‘." },
      { "v": "Welke zin betekent “Ik ben Aaminah.”?", "o": ["أَنَا آمِنَةُ.", "أَنَا مُحَمَّدٌ.", "هِيَ فِي الْبَيْتِ.", "أَنْتَ مُحَمَّدٌ."], "g": 0, "u": "أَنَا = ik, آمِنَةُ = Aaminah." }
    ],
    "ontleding": [
      { "ar": "هُوَ فِي الْمَسْجِدِ.", "nl": "Hij is in de moskee.", "woorden": [["هُوَ", "Ism", "Dhamier", "Moebtada", "Marfoe‘"], ["فِي", "Harf", "Harf Djarr", "", ""], ["الْمَسْجِدِ.", "Ism", "", "", "Madjroer"]] },
      { "ar": "هِيَ عَلَى السَّرِيْرِ.", "nl": "Het is op het bed.", "woorden": [["هِيَ", "Ism", "Dhamier", "Moebtada", "Marfoe‘"], ["عَلَى", "Harf", "Harf Djarr", "", ""], ["السَّرِيْرِ.", "Ism", "", "", "Madjroer"]] },
      { "ar": "أَنَا مُحَمَّدٌ.", "nl": "Ik ben Mohammed.", "woorden": [["أَنَا", "Ism", "Dhamier", "Moebtada", "Marfoe‘"], ["مُحَمَّدٌ.", "Ism", "", "Chabar", "Marfoe‘"]] },
      { "ar": "ذَهَبَ إِلَى الْمَسْجِدِ.", "nl": "Hij ging naar de moskee.", "woorden": [["ذَهَبَ", "Fi‘l", "", "", ""], ["إِلَى", "Harf", "Harf Djarr", "", ""], ["الْمَسْجِدِ.", "Ism", "", "", "Madjroer"]] },
      { "ar": "ذَهَبَ بِلَالٌ إِلَى الْمَسْجِدِ.", "nl": "Bilaal ging naar de moskee.", "woorden": [["ذَهَبَ", "Fi‘l", "", "", ""], ["بِلَالٌ", "Ism", "", "Faa‘il", "Marfoe‘"], ["إِلَى", "Harf", "Harf Djarr", "", ""], ["الْمَسْجِدِ.", "Ism", "", "", "Madjroer"]] }
    ]
  },

  "5": {
    "uitleg": [
      {
        "kop": "Bezit uitdrukken: Moedaaf en Moedaaf Ilaih",
        "tekst": [
          "Hoe zeg je “het boek van Bilaal”? Je zet de twee woorden naast elkaar: **كِتَابُ بِلَالٍ**. Het Arabisch heeft geen woordje “van”.",
          "Het eerste woord is het bezit: de **Moedaaf**. Het tweede woord is de bezitter: de **Moedaaf Ilaih**. Samen vormen ze een bezitsverbinding."
        ],
        "vb": [["كِتَابُ بِلَالٍ", "Het boek van Bilaal"], ["بَيْتُ الْإِمَامِ", "Het huis van de imam"]]
      },
      {
        "kop": "Drie regels voor de Moedaaf",
        "tekst": [
          "**1.** De Moedaaf krijgt géén lidwoord en géén Tanwien. Je zegt niet كِتَابٌ بِلَالٍ en ook niet اَلْكِتَابُ بِلَالٍ. De Moedaaf is al bepaald door zijn positie.",
          "**2.** De Moedaaf Ilaih is altijd **Madjroer** (uitgang -ie). Hij mag een Tanwien (بِلَالٍ) of اَلْ (الْإِمَامِ) hebben.",
          "**3.** De Moedaaf zelf heeft de uitgang die past bij zijn rol in de zin, bijvoorbeeld -oe als hij Marfoe‘ is."
        ],
        "vb": [["بِلَالٌ → بَيْتُ بِلَالٍ", "Bilaal → het huis van Bilaal"], ["اَلْإِمَامُ → بَيْتُ الْإِمَامِ", "de imam → het huis van de imam"]],
        "tip": "Een naamwoord kan Madjroer zijn om twee redenen: na een Harf Djarr, of omdat het een Moedaaf Ilaih is."
      },
      {
        "kop": "Onverbuigbare naamwoorden",
        "tekst": [
          "Sommige naamwoorden veranderen nooit van uitgang. Zo’n woord is onverbuigbaar. Een voorbeeld is **مَنْ** (“wie”): in كِتَابُ مَنْ؟ (“Wiens boek?”) blijft مَنْ gewoon مَنْ, ook al is het de Moedaaf Ilaih."
        ]
      },
      {
        "kop": "Twee rollen tegelijk",
        "tekst": [
          "Een woord kan door twee dingen Madjroer worden. In **عَلَى مَكْتَبِ الْمُدَرِّسِ** is مَكْتَبِ Madjroer vanwege het voorzetsel عَلَى (Harf Djarr). Maar الْمُدَرِّسِ is Madjroer omdat het de Moedaaf Ilaih van مَكْتَبِ is."
        ]
      },
      {
        "kop": "“Onder”, “O” en twee bijzondere woorden",
        "tekst": [
          "**تَحْتَ** betekent “onder”. Het woord erna is Madjroer, omdat het de Moedaaf Ilaih van تَحْتَ is.",
          "**يَا** is het aanroeppartikel (“o”), een **Harf an-Nidaa’**. Het naamwoord erna krijgt maar één Dammah: يَا بِلَالُ, niet يَا بِلَالٌ.",
          "De woorden **اِسْمٌ** (“naam”) en **اِبْنٌ** (“zoon”) beginnen met een Hamzatoel Wasl: de beginklank valt weg als er een woord voor staat."
        ],
        "vb": [["تَحْتَ الْكِتَابِ", "Onder het boek"], ["يَا أُسْتَاذُ", "O leraar"], ["اِبْنُ الْمُدَرِّسِ طَبِيْبٌ", "De zoon van de leraar is dokter."]]
      }
    ],
    "vragen": [
      { "v": "Wat is de Moedaaf in كِتَابُ بِلَالٍ?", "o": ["كِتَابُ", "بِلَالٍ", "beide woorden", "geen van beide"], "g": 0, "u": "De Moedaaf is het bezit (het boek)." },
      { "v": "Wat is de Moedaaf Ilaih in كِتَابُ بِلَالٍ?", "o": ["بِلَالٍ", "كِتَابُ", "beide woorden", "geen van beide"], "g": 0, "u": "De Moedaaf Ilaih is de bezitter (Bilaal)." },
      { "v": "Welke naamval heeft de Moedaaf Ilaih altijd?", "o": ["Madjroer", "Marfoe‘", "Mansoeb", "Geen naamval"], "g": 0, "u": "De Moedaaf Ilaih is altijd Madjroer (uitgang -ie)." },
      { "v": "Welke Moedaaf is correct?", "o": ["بَيْتُ بِلَالٍ", "اَلْبَيْتُ بِلَالٍ", "بَيْتٌ بِلَالٍ", "بَيْتٍ بِلَالٍ"], "g": 0, "u": "De Moedaaf krijgt geen اَلْ en geen Tanwien." },
      { "v": "Welk woordje gebruik je in het Arabisch voor “van” in een bezitsverbinding?", "o": ["Geen: je zet de woorden naast elkaar", "مِنْ", "وَ", "فِيْ"], "g": 0, "u": "De Moedaaf Ilaih in de Madjroer-vorm drukt het bezit al uit." },
      { "v": "In عَلَى مَكْتَبِ الْمُدَرِّسِ: waarom is الْمُدَرِّسِ Madjroer?", "o": ["Omdat het de Moedaaf Ilaih is", "Omdat het na عَلَى staat", "Omdat het een Fi‘l is", "Omdat het een Tanwien heeft"], "g": 0, "u": "عَلَى maakt مَكْتَبِ Madjroer. الْمُدَرِّسِ is Madjroer als Moedaaf Ilaih." },
      { "v": "Wat betekent تَحْتَ?", "o": ["onder", "boven", "in", "naar"], "g": 0, "u": "تَحْتَ = onder, beneden." },
      { "v": "Hoe schrijf je “O leraar”?", "o": ["يَا أُسْتَاذُ", "يَا أُسْتَاذٌ", "يَا أُسْتَاذٍ", "يَا الْأُسْتَاذُ"], "g": 0, "u": "Na يَا krijgt het naamwoord één Dammah, geen Tanwien." },
      { "v": "Hoe heet het aanroeppartikel يَا?", "o": ["Harf an-Nidaa’", "Harf Djarr", "Harf Atf", "Harf Istifhaam"], "g": 0, "u": "Het vocatief-partikel is de Harf an-Nidaa’." },
      { "v": "Waarom is مَنْ in كِتَابُ مَنْ؟ niet Madjroer?", "o": ["Omdat het onverbuigbaar is", "Omdat het een Fi‘l is", "Omdat het een lidwoord heeft", "Omdat het Marfoe‘ is"], "g": 0, "u": "مَنْ verandert nooit van uitgang." }
    ],
    "ontleding": [
      { "ar": "كِتَابُ بِلَالٍ", "nl": "Het boek van Bilaal", "woorden": [["كِتَابُ", "Ism", "", "Moedaaf", ""], ["بِلَالٍ", "Ism", "", "Moedaaf Ilaih", "Madjroer"]] },
      { "ar": "بَيْتُ الْإِمَامِ", "nl": "Het huis van de imam", "woorden": [["بَيْتُ", "Ism", "", "Moedaaf", ""], ["الْإِمَامِ", "Ism", "", "Moedaaf Ilaih", "Madjroer"]] },
      { "ar": "تَحْتَ الْكِتَابِ", "nl": "Onder het boek", "woorden": [["تَحْتَ", "Ism", "", "Moedaaf", ""], ["الْكِتَابِ", "Ism", "", "Moedaaf Ilaih", "Madjroer"]] },
      { "ar": "يَا أُسْتَاذُ", "nl": "O leraar", "woorden": [["يَا", "Harf", "Harf an-Nidaa’", "", ""], ["أُسْتَاذُ", "Ism", "", "", "", "", 1]] },
      { "ar": "اِبْنُ الْمُدَرِّسِ طَبِيْبٌ", "nl": "De zoon van de leraar is dokter.", "woorden": [["اِبْنُ", "Ism", "", "Moedaaf", "Marfoe‘"], ["الْمُدَرِّسِ", "Ism", "", "Moedaaf Ilaih", "Madjroer"], ["طَبِيْبٌ", "Ism", "", "Chabar", "Marfoe‘"]] }
    ]
  }
};
