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
  },

  "6": {
    "uitleg": [
      {
        "kop": "Vrouwelijk “dit”: هٰذِهِ",
        "tekst": [
          "**هٰذِهِ** is de vrouwelijke vorm van هٰذَا. Je spreekt het uit als هَاذِهِ (haadhihi), maar de lange “aa” schrijf je weer niet als gewone Alief.",
          "Gebruik هٰذَا bij mannelijke en هٰذِهِ bij vrouwelijke woorden."
        ],
        "vb": [["هٰذَا وَلَدٌ وَهٰذِهِ بِنْتٌ.", "Dit is een jongen en dit is een meisje."]]
      },
      {
        "kop": "Een woord vrouwelijk maken",
        "tekst": [
          "Zelfstandige en bijvoeglijke naamwoorden worden vrouwelijk door de **Taa’ Marboetah** (ة) aan het einde toe te voegen. De letter vóór de ة krijgt een **Fathah**.",
          "Een paar woorden hebben een eigen vrouwelijke vorm, die je gewoon moet leren."
        ],
        "vb": [["مُدَرِّسٌ → مُدَرِّسَةٌ", "een leraar → een lerares"], ["اِبْنٌ → بِنْتٌ", "een zoon → een dochter"], ["أَخٌ → أُخْتٌ", "een broer → een zus"]],
        "tip": "Leer bij elk nieuw naamwoord meteen het geslacht mee. Niet elk vrouwelijk woord eindigt op ة."
      },
      {
        "kop": "Lichaamsdelen",
        "tekst": [
          "Lichaamsdelen die je twee keer hebt, zijn meestal vrouwelijk (een hand, een oog, een oor, een been). Lichaamsdelen die je maar één keer hebt, zijn mannelijk (een hoofd, een neus, een mond)."
        ],
        "vb": [["يَدٌ", "een hand (vrouwelijk)"], ["عَيْنٌ", "een oog (vrouwelijk)"], ["رَأْسٌ", "een hoofd (mannelijk)"], ["فَمٌ", "een mond (mannelijk)"]]
      },
      {
        "kop": "Het voorzetsel لِ",
        "tekst": [
          "**لِ** is een voorzetsel (**Harf Djarr**) en betekent “behoort aan”, “van” of “voor”. Het schrijf je vast aan het woord erna, dat daardoor **Madjroer** wordt.",
          "Bij اَللّٰهُ valt alleen de Alief weg: لِلّٰهِ (“aan Allah”). Er komt geen extra Laam bij. Met het vraagwoord مَنْ krijg je **لِمَنْ** (“van wie?”). Staat er اَلْ achter, dan wordt مَنْ → مَنِ."
        ],
        "vb": [["هٰذَا لِبِلَالٍ، وَذٰلِكَ لِحَامِدٍ.", "Dit is van Bilaal en dat is van Haamid."], ["لِمَنِ الْكِتَابُ؟", "Van wie is het boek?"]]
      },
      {
        "kop": "“Ook” en “heel”",
        "tekst": [
          "**أَيْضًا** betekent “ook” en **جِدًّا** betekent “heel” of “zeer”. Je zet ze achter het woord waar ze bij horen: هٰذَا كَبِيْرٌ جِدًّا."
        ],
        "vb": [["هٰذَا جَمِيْلٌ، وَذٰلِكَ أَيْضًا جَمِيْلٌ.", "Dit is mooi, en dat is ook mooi."]]
      }
    ],
    "vragen": [
      { "v": "Wat is de vrouwelijke vorm van هٰذَا?", "o": ["هٰذِهِ", "ذٰلِكَ", "هُوَ", "هِيَ"], "g": 0, "u": "هٰذِهِ gebruik je bij vrouwelijke woorden." },
      { "v": "Hoe maak je مُدَرِّسٌ vrouwelijk?", "o": ["مُدَرِّسَةٌ", "مُدَرِّسٍ", "اَلْمُدَرِّسُ", "مُدَرِّسُ"], "g": 0, "u": "Voeg ة toe; de letter ervoor krijgt een Fathah." },
      { "v": "Welke klinker staat vóór de Taa’ Marboetah ة?", "o": ["Fathah", "Kasrah", "Dammah", "Soekoen"], "g": 0, "u": "De letter vóór ة krijgt altijd een Fathah." },
      { "v": "Wat is de vrouwelijke vorm van اِبْنٌ (zoon)?", "o": ["بِنْتٌ", "أُخْتٌ", "اِبْنَةٌ", "أُمٌّ"], "g": 0, "u": "Een zoon wordt een dochter: بِنْتٌ." },
      { "v": "Wat is de vrouwelijke vorm van أَخٌ (broer)?", "o": ["أُخْتٌ", "بِنْتٌ", "أَخَةٌ", "أُمٌّ"], "g": 0, "u": "Een broer wordt een zus: أُخْتٌ." },
      { "v": "Is يَدٌ (hand) mannelijk of vrouwelijk?", "o": ["vrouwelijk", "mannelijk"], "g": 0, "u": "Lichaamsdelen die je twee keer hebt, zijn meestal vrouwelijk." },
      { "v": "Welke term hoort bij لِ?", "o": ["Harf Djarr", "Fi‘l", "Moedaaf", "Harf an-Nidaa’"], "g": 0, "u": "لِ is een voorzetsel, dus een Harf Djarr." },
      { "v": "Hoe schrijf je “aan Allah”?", "o": ["لِلّٰهِ", "لِاللّٰهِ", "لِلّٰهُ", "لِلْلّٰهِ"], "g": 0, "u": "Alleen de Alief vervalt; er komt geen extra Laam bij." },
      { "v": "Wat betekent لِمَنْ هٰذَا؟", "o": ["Van wie is dit?", "Wie is dit?", "Wat is dit?", "Waar is dit?"], "g": 0, "u": "لِ + مَنْ = van wie." },
      { "v": "Wat betekent جِدًّا?", "o": ["heel", "ook", "waar", "nieuw"], "g": 0, "u": "جِدًّا = heel, zeer." }
    ],
    "ontleding": [
      { "ar": "هٰذَا لِبِلَالٍ، وَذٰلِكَ لِحَامِدٍ.", "nl": "Dit is van Bilaal en dat is van Haamid.", "woorden": [["هٰذَا", "Ism", "Ism Isjaarah", "Moebtada", ""], ["لِبِلَالٍ،", "Harf", "Harf Djarr", "", "", "لِ = Harf Djarr · بِلَالٍ = Madjroer", 1], ["وَذٰلِكَ", "Harf", "Harf Atf", "", "", "وَ = Harf Atf · ذٰلِكَ = Ism Isjaarah, Moebtada", 1], ["لِحَامِدٍ.", "Harf", "Harf Djarr", "", "", "لِ = Harf Djarr · حَامِدٍ = Madjroer", 1]] },
      { "ar": "لِمَنِ الْكِتَابُ؟", "nl": "Van wie is het boek?", "woorden": [["لِمَنِ", "Harf", "Harf Djarr", "", "", "لِ = Harf Djarr · مَنِ = Ism Istifhaam", 1], ["الْكِتَابُ؟", "Ism", "", "Moebtada", "Marfoe‘"]] },
      { "ar": "اَلْحَمْدُ لِلّٰهِ.", "nl": "Alle lof behoort aan Allah.", "woorden": [["اَلْحَمْدُ", "Ism", "", "Moebtada", "Marfoe‘"], ["لِلّٰهِ.", "Harf", "Harf Djarr", "", "", "لِ = Harf Djarr · اللّٰهِ = Madjroer", 1]] },
      { "ar": "هٰذَا كَبِيْرٌ جِدًّا.", "nl": "Dit is heel groot.", "woorden": [["هٰذَا", "Ism", "Ism Isjaarah", "Moebtada", ""], ["كَبِيْرٌ", "Ism", "", "Chabar", "Marfoe‘"], ["جِدًّا.", "Ism", "", "", "", "", 1]] }
    ]
  },

  "7": {
    "uitleg": [
      {
        "kop": "Veraf én vrouwelijk: تِلْكَ",
        "tekst": [
          "**تِلْكَ** betekent “dat” of “die” en is de vrouwelijke vorm van ذٰلِكَ. Je gebruikt het voor vrouwelijke woorden die ver weg zijn."
        ],
        "vb": [["هٰذِهِ آمِنَةُ، وَتِلْكَ مَرْيَمُ.", "Dit is Aaminah en dat is Maryam."]]
      },
      {
        "kop": "Het overzicht: vier aanwijzende woorden",
        "tekst": [
          "Alle vier zijn een **Ism Isjaarah**. Ze verschillen in twee dingen: dichtbij of veraf, en mannelijk of vrouwelijk.",
          "**Dichtbij:** هٰذَا (m.) en هٰذِهِ (v.). **Veraf:** ذٰلِكَ (m.) en تِلْكَ (v.)."
        ],
        "vb": [["هٰذَا بِلَالٌ، وَذٰلِكَ حَامِدٌ.", "Dit is Bilaal en dat is Haamied."]],
        "tip": "Eerst het geslacht van het woord bepalen, dan kiezen: dichtbij of veraf."
      }
    ],
    "vragen": [
      { "v": "Welk woord betekent “dat” bij een vrouwelijk woord?", "o": ["تِلْكَ", "ذٰلِكَ", "هٰذِهِ", "هٰذَا"], "g": 0, "u": "تِلْكَ is de vrouwelijke vorm van ذٰلِكَ." },
      { "v": "Welk woord gebruik je voor iets vrouwelijks dat dichtbij is?", "o": ["هٰذِهِ", "هٰذَا", "تِلْكَ", "ذٰلِكَ"], "g": 0, "u": "هٰذِهِ = dit (v.)." },
      { "v": "Hoe heet een aanwijzend voornaamwoord in het Arabisch?", "o": ["Ism Isjaarah", "Harf Djarr", "Dhamier", "Fi‘l"], "g": 0, "u": "Een Ism Isjaarah wijst iets aan." },
      { "v": "Welke zin betekent “Dit is Aaminah en dat is Maryam.”?", "o": ["هٰذِهِ آمِنَةُ، وَتِلْكَ مَرْيَمُ.", "هٰذَا بِلَالٌ، وَذٰلِكَ حَامِدٌ.", "هٰذَا كِتَابٌ.", "مَنْ هٰذَا؟"], "g": 0, "u": "Beide namen zijn vrouwelijk: هٰذِهِ en تِلْكَ." }
    ],
    "ontleding": [
      { "ar": "هٰذَا بِلَالٌ، وَذٰلِكَ حَامِدٌ.", "nl": "Dit is Bilaal en dat is Haamied.", "woorden": [["هٰذَا", "Ism", "Ism Isjaarah", "Moebtada", ""], ["بِلَالٌ،", "Ism", "", "Chabar", "Marfoe‘"], ["وَذٰلِكَ", "Harf", "Harf Atf", "", "", "وَ = Harf Atf · ذٰلِكَ = Ism Isjaarah, Moebtada", 1], ["حَامِدٌ.", "Ism", "", "Chabar", "Marfoe‘"]] },
      { "ar": "هٰذِهِ آمِنَةُ، وَتِلْكَ مَرْيَمُ.", "nl": "Dit is Aaminah en dat is Maryam.", "woorden": [["هٰذِهِ", "Ism", "Ism Isjaarah", "Moebtada", ""], ["آمِنَةُ،", "Ism", "", "Chabar", "Marfoe‘"], ["وَتِلْكَ", "Harf", "Harf Atf", "", "", "وَ = Harf Atf · تِلْكَ = Ism Isjaarah, Moebtada", 1], ["مَرْيَمُ.", "Ism", "", "Chabar", "Marfoe‘"]] }
    ]
  },

  "8": {
    "uitleg": [
      {
        "kop": "“Dit boek” is nog geen zin",
        "tekst": [
          "هٰذَا كِتَابٌ betekent “Dit is een boek” (een zin). Maar **هٰذَا الْكِتَابُ** betekent “dit boek”. Dat is nog geen zin, want er ontbreekt iets dat erover gezegd wordt.",
          "Voeg een **Chabar** toe, en je hebt een zin: هٰذَا الْكِتَابُ جَدِيْدٌ. Samen vormen هٰذَا en الْكِتَابُ hier de **Moebtada**."
        ],
        "vb": [["هٰذَا الْكِتَابُ جَدِيْدٌ.", "Dit boek is nieuw."], ["ذٰلِكَ الرَّجُلُ مُهَنْدِسٌ.", "Die man is een ingenieur."], ["هٰذِهِ السَّاعَةُ جَمِيْلَةٌ.", "Dit horloge is mooi."]],
        "tip": "Het naamwoord ná de Ism Isjaarah heeft altijd اَلْ. Zonder اَلْ is het een gewone zin: هٰذَا كِتَابٌ."
      },
      {
        "kop": "Wanneer wordt -oe een -ie?",
        "tekst": [
          "De normale uitgang is -oe (Marfoe‘). Je wisselt naar -ie (Madjroer) in twee gevallen: na een **Harf Djarr** of wanneer het woord een **Moedaaf Ilaih** is."
        ],
        "vb": [["بِلَالٌ فِي الْبَيْتِ.", "Bilaal is in het huis."], ["هٰذَا مِفْتَاحُ الْبَيْتِ.", "Dit is de sleutel van het huis."]]
      },
      {
        "kop": "Woorden die nooit veranderen",
        "tekst": [
          "Naamwoorden die eindigen op een lange **-aa**, zoals أَمْرِيْكَا, krijgen geen andere uitgang. Ze blijven in elke zin hetzelfde."
        ],
        "vb": [["هٰذَا أَمْرِيْكَا.", "Dit is Amerika."], ["أَنَا مِنْ أَمْرِيْكَا.", "Ik kom uit Amerika."], ["هُوَ رَئِيْسُ أَمْرِيْكَا.", "Hij is de president van Amerika."]]
      },
      {
        "kop": "Achter en voor: خَلْفَ en أَمَامَ",
        "tekst": [
          "**خَلْفَ** betekent “achter” en **أَمَامَ** betekent “voor”. Zulke plaatswoorden heten een **Zarf**. Ze werken als een Moedaaf: het naamwoord erna is **Moedaaf Ilaih** en eindigt dus op -ie."
        ],
        "vb": [["اَلْبَيْتُ خَلْفَ الْمَسْجِدِ.", "Het huis is achter de moskee."], ["حَامِدٌ أَمَامَ الْمُدَرِّسِ.", "Haamid is voor de leraar."]]
      },
      {
        "kop": "Het werkwoord جَلَسَ",
        "tekst": [
          "**جَلَسَ** betekent “hij zat”. Het is een **Fi‘l**. Komt er daarna een naamwoord dat zegt wie zat, dan is dat de **Faa‘il** (Marfoe‘).",
          "Een kleine spellingstip: een ى zonder stippen onder de letter is een lange “aa”. Daarom is فِيْ “fie” maar عَلَى “‘alaa”."
        ],
        "vb": [["أَيْنَ جَلَسَ مُحَمَّدٌ؟", "Waar zat Mohammed?"], ["جَلَسَ أَمَامَ الْمُدَرِّسِ.", "Hij zat voor de leraar."]]
      }
    ],
    "vragen": [
      { "v": "Welke Arabische tekst is een complete zin?", "o": ["هٰذَا الْكِتَابُ جَدِيْدٌ.", "هٰذَا الْكِتَابُ", "ذٰلِكَ الرَّجُلُ", "هٰذِهِ السَّاعَةُ"], "g": 0, "u": "Alleen de eerste heeft een Chabar (جَدِيْدٌ)." },
      { "v": "Wat betekent هٰذَا الْكِتَابُ (zonder rest)?", "o": ["dit boek", "dit is een boek", "dit boek is nieuw", "wat is dit"], "g": 0, "u": "Met اَلْ is het slechts een woordgroep: “dit boek”." },
      { "v": "Welke Moebtada hoort bij de Chabar مُهَنْدِسٌ in “Die man is een ingenieur”?", "o": ["ذٰلِكَ الرَّجُلُ", "هٰذِهِ السَّاعَةُ", "هٰذَا كِتَابٌ", "أَمَامَ الْمُدَرِّسِ"], "g": 0, "u": "“Die man” = ذٰلِكَ الرَّجُلُ." },
      { "v": "Wanneer verandert de uitgang -oe in -ie?", "o": ["Na een Harf Djarr of bij een Moedaaf Ilaih", "Alleen na وَ", "Alleen bij vrouwelijke woorden", "Nooit"], "g": 0, "u": "Beide gevallen maken het naamwoord Madjroer." },
      { "v": "Wat gebeurt er met naamwoorden die op een lange -aa eindigen, zoals أَمْرِيْكَا?", "o": ["Ze blijven onveranderd", "Ze krijgen -ie", "Ze krijgen -oe", "Ze krijgen Tanwien"], "g": 0, "u": "Ze hebben geen andere uitgangen." },
      { "v": "Wat betekent خَلْفَ?", "o": ["achter", "voor", "onder", "naast"], "g": 0, "u": "خَلْفَ = achter. أَمَامَ = voor." },
      { "v": "Welk woord betekent “voor” (ruimtelijk)?", "o": ["أَمَامَ", "خَلْفَ", "تَحْتَ", "عَلَى"], "g": 0, "u": "أَمَامَ = voor, tegenover." },
      { "v": "Welke uitgang heeft het naamwoord ná خَلْفَ?", "o": ["-ie (Madjroer)", "-oe (Marfoe‘)", "-a", "Tanwien"], "g": 0, "u": "Het is een Moedaaf Ilaih en dus Madjroer." },
      { "v": "Wat betekent جَلَسَ?", "o": ["hij zat", "hij ging", "hij ging naar buiten", "hij at"], "g": 0, "u": "جَلَسَ = hij zat." },
      { "v": "Hoe spreek je عَلَى uit?", "o": ["‘alaa", "‘alie", "‘aloe", "‘alay"], "g": 0, "u": "De ى zonder stippen is een lange “aa”." }
    ],
    "ontleding": [
      { "ar": "هٰذَا الْكِتَابُ جَدِيْدٌ.", "nl": "Dit boek is nieuw.", "woorden": [["هٰذَا", "Ism", "Ism Isjaarah", "Moebtada", ""], ["الْكِتَابُ", "Ism", "", "Moebtada", "Marfoe‘"], ["جَدِيْدٌ.", "Ism", "", "Chabar", "Marfoe‘"]] },
      { "ar": "هٰذَا مِفْتَاحُ الْبَيْتِ.", "nl": "Dit is de sleutel van het huis.", "woorden": [["هٰذَا", "Ism", "Ism Isjaarah", "Moebtada", ""], ["مِفْتَاحُ", "Ism", "", "Moedaaf", "Marfoe‘"], ["الْبَيْتِ.", "Ism", "", "Moedaaf Ilaih", "Madjroer"]] },
      { "ar": "اَلْبَيْتُ خَلْفَ الْمَسْجِدِ.", "nl": "Het huis is achter de moskee.", "woorden": [["اَلْبَيْتُ", "Ism", "", "Moebtada", "Marfoe‘"], ["خَلْفَ", "Ism", "Zarf", "Moedaaf", ""], ["الْمَسْجِدِ.", "Ism", "", "Moedaaf Ilaih", "Madjroer"]] },
      { "ar": "أَيْنَ جَلَسَ مُحَمَّدٌ؟", "nl": "Waar zat Mohammed?", "woorden": [["أَيْنَ", "Ism", "Ism Istifhaam", "", ""], ["جَلَسَ", "Fi‘l", "", "", ""], ["مُحَمَّدٌ؟", "Ism", "", "Faa‘il", "Marfoe‘"]] },
      { "ar": "جَلَسَ أَمَامَ الْمُدَرِّسِ.", "nl": "Hij zat voor de leraar.", "woorden": [["جَلَسَ", "Fi‘l", "", "", ""], ["أَمَامَ", "Ism", "Zarf", "Moedaaf", ""], ["الْمُدَرِّسِ.", "Ism", "", "Moedaaf Ilaih", "Madjroer"]] }
    ]
  },

  "9": {
    "uitleg": [
      {
        "kop": "Het bijvoeglijk naamwoord komt erachter: Na‘t en Man‘oet",
        "tekst": [
          "In het Arabisch staat het bijvoeglijk naamwoord **ná** het zelfstandig naamwoord, anders dan in het Nederlands: بَيْتٌ جَدِيْدٌ is letterlijk “een huis nieuw”.",
          "Het bijvoeglijk naamwoord heet **Na‘t**. Het zelfstandig naamwoord dat het beschrijft heet **Man‘oet**."
        ],
        "vb": [["بَيْتٌ جَدِيْدٌ", "Een nieuw huis"]]
      },
      {
        "kop": "De Na‘t past zich aan op vier punten",
        "tekst": [
          "**1. Geslacht.** Mannelijk bij mannelijk, vrouwelijk bij vrouwelijk.",
          "**2. Bepaaldheid.** Heeft het Man‘oet اَلْ, dan krijgt ook de Na‘t اَلْ. Heeft het Man‘oet een Tanwien, dan heeft de Na‘t ook een Tanwien.",
          "**3. Naamval.** Marfoe‘ blijft Marfoe‘; Madjroer blijft Madjroer.",
          "**4. Aantal.** Enkelvoud, tweevoud en meervoud moeten overeenkomen."
        ],
        "vb": [["وَلَدٌ صَغِيْرٌ → بِنْتٌ صَغِيْرَةٌ", "een kleine jongen → een kleine dochter"], ["اَلْمُدَرِّسُ الْجَدِيْدُ فِي الْفَصْلِ.", "De nieuwe leraar is in de klas."], ["أَنَا فِيْ بَيْتٍ جَدِيْدٍ.", "Ik ben in een nieuw huis."]],
        "tip": "Controleer altijd vier dingen: geslacht, bepaaldheid, naamval, aantal. Pas dan is de Na‘t goed."
      },
      {
        "kop": "Enkelvoud, tweevoud, meervoud",
        "tekst": [
          "Het Arabisch heeft een tweevoud (voor precies twee). Het bijvoeglijk naamwoord volgt hierin het zelfstandig naamwoord."
        ],
        "vb": [["مُدَرِّسٌ جَدِيْدٌ", "Een nieuwe leraar"], ["مُدَرِّسَانِ جَدِيْدَانِ", "Twee nieuwe leraren"], ["مُدَرِّسُوْنَ جُدُدٌ", "Nieuwe leraren"]]
      },
      {
        "kop": "Bijvoeglijke naamwoorden op -aan",
        "tekst": [
          "Bijvoeglijke naamwoorden die eindigen op **-aan** (ان) krijgen geen Tanwien. Voorbeelden: كَسْلَانُ (“lui”), جَوْعَانُ (“hongerig”), عَطْشَانُ (“dorstig”), غَضْبَانُ (“boos”), مَلْآنُ (“vol”)."
        ]
      },
      {
        "kop": "“Die” en “dat”: اَلَّذِيْ",
        "tekst": [
          "**اَلَّذِيْ** is een betrekkelijk voornaamwoord (**Ism Mawsoel**): “die”, “dat”, “wie” of “welk”. Het verbindt een naamwoord met een bijzin.",
          "Voor een mens vertaal je “die” of “wie”, voor een dier of ding “die”, “dat” of “welk”."
        ],
        "vb": [["اَلْبَيْتُ الَّذِيْ أَمَامَ الْمَسْجِدِ لِلْإِمَامِ.", "Het huis dat voor de moskee is, is van de imam."]]
      },
      {
        "kop": "لِ + اَلْ, en het woord عِنْدَ",
        "tekst": [
          "Gebruik je لِ vóór een woord met اَلْ, dan valt de Alief van اَلْ weg: اَلْإِمَامُ → لِلْإِمَامِ.",
          "**عِنْدَ** betekent “bij”. Het naamwoord erna is Moedaaf Ilaih en eindigt op -ie."
        ],
        "vb": [["اَلْمُدَرِّسُ عِنْدَ الْمُدِيْرِ.", "De leraar is bij de directeur."]]
      }
    ],
    "vragen": [
      { "v": "Waar staat het bijvoeglijk naamwoord in het Arabisch?", "o": ["Na het zelfstandig naamwoord", "Voor het zelfstandig naamwoord", "Los aan het begin van de zin", "Altijd aan het einde van de zin"], "g": 0, "u": "بَيْتٌ جَدِيْدٌ: eerst het huis, dan nieuw." },
      { "v": "Hoe heet het bijvoeglijk naamwoord?", "o": ["Na‘t", "Man‘oet", "Moedaaf", "Chabar"], "g": 0, "u": "Na‘t = bijvoeglijk naamwoord." },
      { "v": "Hoe heet het woord dat door de Na‘t wordt beschreven?", "o": ["Man‘oet", "Na‘t", "Faa‘il", "Moedaaf Ilaih"], "g": 0, "u": "Man‘oet = het beschreven naamwoord." },
      { "v": "Welke vier dingen moeten Na‘t en Man‘oet gemeen hebben?", "o": ["Geslacht, bepaaldheid, naamval, aantal", "Alleen geslacht", "Kleur, vorm, naamval, aantal", "Geslacht, tijd, naamval, plaats"], "g": 0, "u": "Dit zijn de vier punten van overeenstemming." },
      { "v": "Welke combinatie is correct voor “een nieuwe auto”?", "o": ["سَيَّارَةٌ جَدِيْدَةٌ", "سَيَّارَةٌ جَدِيْدٌ", "سَيَّارَةٌ الْجَدِيْدَةُ", "جَدِيْدَةٌ سَيَّارَةٌ"], "g": 0, "u": "Beide vrouwelijk, onbepaald, Marfoe‘ en enkelvoud." },
      { "v": "Welke combinatie is correct voor “de nieuwe leraar”?", "o": ["اَلْمُدَرِّسُ الْجَدِيْدُ", "اَلْمُدَرِّسُ جَدِيْدٌ", "مُدَرِّسٌ الْجَدِيْدُ", "اَلْمُدَرِّسِ الْجَدِيْدُ"], "g": 0, "u": "Beide met اَلْ en Marfoe‘." },
      { "v": "In فِي الْبَيْتِ الْجَدِيْدِ: welke naamval heeft الْجَدِيْدِ?", "o": ["Madjroer", "Marfoe‘", "Mansoeb", "Geen"], "g": 0, "u": "De Na‘t heeft dezelfde naamval als zijn Man‘oet." },
      { "v": "Welke uitgang geldt voor bijvoeglijke naamwoorden op -aan, zoals كَسْلَانُ?", "o": ["Geen Tanwien", "Altijd Tanwien", "Altijd -ie", "Altijd Taa’ Marboetah"], "g": 0, "u": "Woorden op -aan krijgen geen Tanwien." },
      { "v": "Hoe heet het betrekkelijk voornaamwoord اَلَّذِيْ?", "o": ["Ism Mawsoel", "Ism Isjaarah", "Dhamier", "Harf Djarr"], "g": 0, "u": "Een Ism Mawsoel verbindt een bijzin met het naamwoord." },
      { "v": "Wat wordt اَلْإِمَامُ na لِ?", "o": ["لِلْإِمَامِ", "لِالْإِمَامِ", "لِاَلْإِمَامِ", "لَإِمَامِ"], "g": 0, "u": "De Alief van اَلْ valt weg: لِلْإِمَامِ." },
      { "v": "Wat betekent عِنْدَ?", "o": ["bij", "met", "onder", "achter"], "g": 0, "u": "عِنْدَ = bij." }
    ],
    "ontleding": [
      { "ar": "بَيْتٌ جَدِيْدٌ", "nl": "Een nieuw huis", "woorden": [["بَيْتٌ", "Ism", "", "Man‘oet", "Marfoe‘"], ["جَدِيْدٌ", "Ism", "", "Na‘t", "Marfoe‘"]] },
      { "ar": "اَلْمُدَرِّسُ الْجَدِيْدُ فِي الْفَصْلِ.", "nl": "De nieuwe leraar is in de klas.", "woorden": [["اَلْمُدَرِّسُ", "Ism", "", "Man‘oet", "Marfoe‘"], ["الْجَدِيْدُ", "Ism", "", "Na‘t", "Marfoe‘"], ["فِي", "Harf", "Harf Djarr", "", ""], ["الْفَصْلِ.", "Ism", "", "", "Madjroer"]] },
      { "ar": "مَنْ فِي الْبَيْتِ الْجَدِيْدِ؟", "nl": "Wie is in het nieuwe huis?", "woorden": [["مَنْ", "Ism", "Ism Istifhaam", "Moebtada", ""], ["فِي", "Harf", "Harf Djarr", "", ""], ["الْبَيْتِ", "Ism", "", "Man‘oet", "Madjroer"], ["الْجَدِيْدِ؟", "Ism", "", "Na‘t", "Madjroer"]] },
      { "ar": "اَلْمُدَرِّسُ عِنْدَ الْمُدِيْرِ.", "nl": "De leraar is bij de directeur.", "woorden": [["اَلْمُدَرِّسُ", "Ism", "", "Moebtada", "Marfoe‘"], ["عِنْدَ", "Ism", "Zarf", "Moedaaf", ""], ["الْمُدِيْرِ.", "Ism", "", "Moedaaf Ilaih", "Madjroer"]] }
    ]
  },

  "10": {
    "uitleg": [
      {
        "kop": "Achtervoegsels voor “mijn”, “jouw”, “zijn”, “haar”",
        "tekst": [
          "De bezittelijke voornaamwoorden zijn geen losse woorden maar **achtervoegsels** die je vastmaakt aan het naamwoord: **ـكَ** (“jouw”, m.), **ـهُ** (“zijn”), **ـهَا** (“haar”), **ـيْ** (“mijn”). Zulke achtervoegsels zijn een **Dhamier**.",
          "Het naamwoord dat het achtervoegsel krijgt, is de **Moedaaf**. Het achtervoegsel is de **Moedaaf Ilaih**."
        ],
        "vb": [["كِتَابُكَ", "jouw boek"], ["كِتَابُهُ", "zijn boek"], ["كِتَابُهَا", "haar boek"], ["كِتَابِيْ", "mijn boek"]],
        "tip": "Bij “mijn” verandert de uitgang van de Moedaaf: kitaab-ie in plaats van kitaab-oe-ie."
      },
      {
        "kop": "De extra Waaw bij “vader” en “broer”",
        "tekst": [
          "Als أَبٌ (“vader”) of أَخٌ (“broer”) een Moedaaf is, komt er een extra **Waaw** (و) tussen de Moedaaf en de Moedaaf Ilaih: أَخُوْكَ (niet أَخُكَ) en أَبُوْهُ (niet أَبُهُ).",
          "Ook voor een naam geldt dit: أَبُوْ مُحَمَّدٍ en أَخُوْ مُحَمَّدٍ. Bij “mijn vader” en “mijn broer” komt géén Waaw: أَبِيْ en أَخِيْ."
        ],
        "tip": "Er zijn vijf woorden met deze extra Waaw. Je kent er nu twee; de andere drie volgen in een volgende les."
      },
      {
        "kop": "“Hebben” zeggen: عِنْدَ en لِ",
        "tekst": [
          "Het Arabisch heeft geen werkwoord “hebben”. Voor losse dingen gebruik je **عِنْدَ** (“bij”): أَعِنْدَكَ قَلَمٌ؟ = “Is er een pen bij jou?”.",
          "Voor familie en lichaamsdelen gebruik je **لِ**: لِيْ أَخٌ (“ik heb een broer”). Je zegt dus níet عِنْدِيْ أَخٌ. Het voorzetsel لِ krijgt vóór achtervoegsels een Fathah: لَكَ, لَهُ, لَهَا, maar bij “mij” blijft het لِيْ."
        ],
        "vb": [["أَعِنْدَكَ قَلَمٌ؟", "Heb jij een pen?"]]
      },
      {
        "kop": "“Ik ging” en “jij ging”",
        "tekst": [
          "Aan het werkwoord ذَهَبَ (“hij ging”) komen persoonsvormen: **ذَهَبْتَ** (“jij ging”, m.) en **ذَهَبْتُ** (“ik ging”). Het zijn allebei een **Fi‘l**."
        ],
        "vb": [["أَذَهَبْتَ إِلَى الْمَدْرَسَةِ الْيَوْمَ؟", "Ben jij vandaag naar school gegaan?"], ["نَعَمْ، ذَهَبْتُ.", "Ja, ik ben gegaan."]]
      },
      {
        "kop": "Namen op ة, “met” en “niet”",
        "tekst": [
          "Ook mannelijke eigennamen die op ة eindigen, krijgen geen Tanwien: مُعَاوِيَةُ, أُسَامَةُ, حَمْزَةُ.",
          "**مَعَ** betekent “met”. Het verschil met عِنْدَ: bij عِنْدَ ben je op de plek van die persoon, bij مَعَ mag je overal samen zijn. Het naamwoord erna eindigt op -ie.",
          "**بِ** betekent “bij” of “in”. En **مَا** is niet alleen “wat”: voor een zin is het ook de ontkenning, een **Harf Nafie**."
        ],
        "vb": [["اَلْمُدَرِّسُ مَعَ الْمُدِيْرِ.", "De leraar is met de directeur."]]
      }
    ],
    "vragen": [
      { "v": "Wat betekent كِتَابُكَ?", "o": ["jouw boek", "zijn boek", "haar boek", "mijn boek"], "g": 0, "u": "ـكَ = jouw (mannelijk)." },
      { "v": "Wat betekent كِتَابِيْ?", "o": ["mijn boek", "jouw boek", "zijn boek", "haar boek"], "g": 0, "u": "ـيْ = mijn." },
      { "v": "Wat is de Moedaaf in كِتَابُهَا?", "o": ["كِتَابُ", "هَا", "beide", "geen"], "g": 0, "u": "Het bezit (het boek) is de Moedaaf; هَا is de Moedaaf Ilaih." },
      { "v": "Welke vorm is correct voor “jouw broer”?", "o": ["أَخُوْكَ", "أَخُكَ", "أَخٌكَ", "أَخِكَ"], "g": 0, "u": "Een extra Waaw komt tussen Moedaaf en Moedaaf Ilaih." },
      { "v": "Welke vorm is correct voor “zijn vader”?", "o": ["أَبُوْهُ", "أَبُهُ", "أَبٌهُ", "أَبِهُ"], "g": 0, "u": "أَبٌ krijgt als Moedaaf een extra Waaw." },
      { "v": "Welke vorm is correct voor “mijn vader”?", "o": ["أَبِيْ", "أَبُوْيْ", "أَبُيْ", "أَبَيْ"], "g": 0, "u": "Bij “mijn” komt geen extra Waaw." },
      { "v": "Hoe zeg je “Ik heb een broer.”?", "o": ["لِيْ أَخٌ.", "عِنْدِيْ أَخٌ.", "أَنَا أَخٌ.", "مَعِيْ أَخٌ."], "g": 0, "u": "Voor familie gebruik je لِ, niet عِنْدَ." },
      { "v": "Wat betekent أَعِنْدَكَ قَلَمٌ؟", "o": ["Heb jij een pen?", "Is dit jouw pen?", "Waar is jouw pen?", "Wie heeft een pen?"], "g": 0, "u": "عِنْدَ drukt hier “hebben” uit." },
      { "v": "Welke vorm betekent “ik ging”?", "o": ["ذَهَبْتُ", "ذَهَبْتَ", "ذَهَبَ", "خَرَجَ"], "g": 0, "u": "ـتُ = ik; ـتَ = jij (m.)." },
      { "v": "Welk woord betekent “met”?", "o": ["مَعَ", "عِنْدَ", "مِنْ", "فِيْ"], "g": 0, "u": "مَعَ = met." },
      { "v": "Welke functie heeft مَا in مَا عِنْدِيْ سَيَّارَةٌ?", "o": ["Ontkenning (Harf Nafie)", "Vraagwoord", "Voorzetsel", "Bezit"], "g": 0, "u": "Hier betekent مَا “niet”: “Ik heb geen auto.”" }
    ],
    "ontleding": [
      { "ar": "أَعِنْدَكَ قَلَمٌ؟", "nl": "Heb jij een pen?", "woorden": [["أَ", "Harf", "Harf Istifhaam", "", ""], ["عِنْدَكَ", "Ism", "Zarf", "Moedaaf", "", "عِنْدَ = Zarf, Moedaaf · كَ = Dhamier, Moedaaf Ilaih", 1], ["قَلَمٌ؟", "Ism", "", "Moebtada", "Marfoe‘"]] },
      { "ar": "نَعَمْ، ذَهَبْتُ.", "nl": "Ja, ik ben gegaan.", "woorden": [["نَعَمْ،", "Harf", "Harf Djawaab", "", ""], ["ذَهَبْتُ.", "Fi‘l", "", "", ""]] },
      { "ar": "اَلْمُدَرِّسُ مَعَ الْمُدِيْرِ.", "nl": "De leraar is met de directeur.", "woorden": [["اَلْمُدَرِّسُ", "Ism", "", "Moebtada", "Marfoe‘"], ["مَعَ", "Ism", "Zarf", "Moedaaf", ""], ["الْمُدِيْرِ.", "Ism", "", "Moedaaf Ilaih", "Madjroer"]] },
      { "ar": "أَخُوْ مُحَمَّدٍ", "nl": "De broer van Mohammed", "woorden": [["أَخُوْ", "Ism", "", "Moedaaf", "Marfoe‘"], ["مُحَمَّدٍ", "Ism", "", "Moedaaf Ilaih", "Madjroer"]] },
      { "ar": "لِيْ أَخٌ", "nl": "Ik heb een broer.", "woorden": [["لِيْ", "Harf", "Harf Djarr", "", "", "لِ = Harf Djarr · يْ = Dhamier, Madjroer", 1], ["أَخٌ", "Ism", "", "Moebtada", "Marfoe‘"]] }
    ]
  }
};
