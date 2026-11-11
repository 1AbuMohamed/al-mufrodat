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
  },

  "11": {
    "uitleg": [
      {
        "kop": "“Erin”: فِيْهِ en فِيْهَا",
        "tekst": [
          "**فِيْهِ** betekent “erin” of “in hem”, **فِيْهَا** betekent “erin” of “in haar”. Het zijn het voorzetsel فِيْ (**Harf Djarr**) met een achtervoegsel (**Dhamier**) eraan.",
          "Gebruik فِيْهِ als het woord waarnaar je verwijst mannelijk is, en فِيْهَا als het vrouwelijk is (bijvoorbeeld de kamer: اَلْغُرْفَةُ)."
        ],
        "vb": [["مَنْ فِي الْبَيْتِ؟", "Wie is in het huis?"], ["فِيْهِ أَبِيْ وَأُمِّيْ.", "Mijn vader en mijn moeder zijn erin."], ["فِيْهَا أَخِيْ.", "Mijn broer is erin."]]
      },
      {
        "kop": "“Ik houd van”: أُحِبُّ",
        "tekst": [
          "**أُحِبُّ** is een **Fi‘l** en betekent “ik houd van”. In het Arabisch herhaal je het woord **وَ** (“en”) steeds opnieuw, ook in een opsomming."
        ],
        "vb": [["أُحِبُّ أَبِيْ وَأُمِّيْ وَأَخِيْ وَأُخْتِيْ.", "Ik houd van mijn vader, moeder, broer en zus."]],
        "tip": "In het Nederlands zet je “en” alleen voor het laatste woord. In het Arabisch voor elk woord."
      },
      {
        "kop": "Het lijdend voorwerp: Maf‘oel bih en Mansoeb",
        "tekst": [
          "Het lijdend voorwerp van een werkwoord heet **Maf‘oel bih**. Het staat in de **Mansoeb** (accusatief) en eindigt daarom op **-a** (Fathah).",
          "Bij een woord met het achtervoegsel “mijn” (ـيْ) zie je deze -a niet terug."
        ],
        "vb": [["أُحِبُّ اللّٰهَ.", "Ik houd van Allah."], ["أُحِبُّ الرَّسُوْلَ.", "Ik houd van de Boodschapper."], ["أُحِبُّ اللُّغَةَ الْعَرَبِيَّةَ.", "Ik houd van de Arabische taal."]],
        "tip": "Nu ken je alle drie de naamvallen: Marfoe‘ (-oe), Madjroer (-ie) en Mansoeb (-a)."
      },
      {
        "kop": "“Jij houdt van”: تُحِبُّ",
        "tekst": [
          "**تُحِبُّ** betekent “jij houdt van” (mannelijk). Met een vraagpartikel of vraagwoord erbij maak je er een vraag van."
        ],
        "vb": [["أَتُحِبُّ اللّٰهَ؟", "Houd jij van Allah?"], ["مَنْ تُحِبُّ؟", "Van wie houd jij?"], ["مَاذَا تُحِبُّ؟", "Waar houd je van?"]]
      }
    ],
    "vragen": [
      { "v": "Wat betekent فِيْهَا?", "o": ["erin, in haar", "erin, in hem", "van haar", "met haar"], "g": 0, "u": "فِيْهَا = in + haar (vrouwelijk)." },
      { "v": "Wat betekent أُحِبُّ?", "o": ["ik houd van", "jij houdt van", "ik ging", "ik ben"], "g": 0, "u": "أُحِبُّ = ik houd van." },
      { "v": "Hoe heet het lijdend voorwerp in het Arabisch?", "o": ["Maf‘oel bih", "Faa‘il", "Chabar", "Moedaaf"], "g": 0, "u": "Wat het werkwoord ondergaat, is het Maf‘oel bih." },
      { "v": "Welke naamval heeft het lijdend voorwerp?", "o": ["Mansoeb", "Marfoe‘", "Madjroer", "Geen"], "g": 0, "u": "Het lijdend voorwerp is Mansoeb: uitgang -a." },
      { "v": "Welke uitgang hoort bij Mansoeb?", "o": ["-a (Fathah)", "-oe (Dammah)", "-ie (Kasrah)", "-n"], "g": 0, "u": "Mansoeb = accusatief = -a." },
      { "v": "Welke zin betekent “Ik houd van Allah.”?", "o": ["أُحِبُّ اللّٰهَ.", "أَتُحِبُّ اللّٰهَ؟", "مَنْ تُحِبُّ؟", "أُحِبُّ أَبِيْ."], "g": 0, "u": "أُحِبُّ + اللّٰهَ (Mansoeb)." },
      { "v": "Wat betekent مَنْ تُحِبُّ؟", "o": ["Van wie houd jij?", "Wie houdt van jou?", "Waar houd je van?", "Houd jij van Allah?"], "g": 0, "u": "مَنْ = wie, تُحِبُّ = jij houdt van." },
      { "v": "Hoe vaak gebruik je وَ in een opsomming “vader, moeder, broer en zus”?", "o": ["Voor elk woord", "Alleen voor het laatste woord", "Nooit", "Alleen voor het eerste woord"], "g": 0, "u": "Het Arabisch herhaalt وَ elke keer." }
    ],
    "ontleding": [
      { "ar": "أُحِبُّ اللّٰهَ.", "nl": "Ik houd van Allah.", "woorden": [["أُحِبُّ", "Fi‘l", "", "", ""], ["اللّٰهَ.", "Ism", "", "Maf‘oel bih", "Mansoeb"]] },
      { "ar": "أُحِبُّ الرَّسُوْلَ.", "nl": "Ik houd van de Boodschapper.", "woorden": [["أُحِبُّ", "Fi‘l", "", "", ""], ["الرَّسُوْلَ.", "Ism", "", "Maf‘oel bih", "Mansoeb"]] },
      { "ar": "أُحِبُّ اللُّغَةَ الْعَرَبِيَّةَ.", "nl": "Ik houd van de Arabische taal.", "woorden": [["أُحِبُّ", "Fi‘l", "", "", ""], ["اللُّغَةَ", "Ism", "", "Maf‘oel bih", "Mansoeb"], ["الْعَرَبِيَّةَ.", "Ism", "", "Na‘t", "Mansoeb"]] },
      { "ar": "مَنْ تُحِبُّ؟", "nl": "Van wie houd jij?", "woorden": [["مَنْ", "Ism", "Ism Istifhaam", "Maf‘oel bih", ""], ["تُحِبُّ؟", "Fi‘l", "", "", ""]] },
      { "ar": "فِيْهَا أَخِيْ.", "nl": "Mijn broer is erin.", "woorden": [["فِيْهَا", "Harf", "Harf Djarr", "", "", "فِيْ = Harf Djarr · هَا = Dhamier, Madjroer", 1], ["أَخِيْ.", "Ism", "", "Moebtada", "Marfoe‘"]] }
    ]
  },

  "12": {
    "uitleg": [
      {
        "kop": "Jij (vrouwelijk): أَنْتِ en ـكِ",
        "tekst": [
          "Voor “jij” tegen een vrouw gebruik je **أَنْتِ**, met een Kasrah op de laatste letter. Het bijbehorende achtervoegsel voor “jouw” is **ـكِ** (-kie). Vergelijk: jij (m.) = أَنْتَ, jouw (m.) = ـكَ."
        ],
        "vb": [["مِنْ أَيْنَ أَنْتِ يَا آمِنَةُ؟", "Waar kom jij vandaan, o Aaminah?"], ["أَيْنَ بَيْتُكِ يَا مَرْيَمُ؟", "Waar is jouw huis, o Maryam?"], ["أَيْنَ بَيْتُكَ يَا بِلَالُ؟", "Waar is jouw huis, o Bilaal?"]]
      },
      {
        "kop": "“Zij ging”: ذَهَبَتْ",
        "tekst": [
          "De vrouwelijke vorm van ذَهَبَ is **ذَهَبَتْ** (“zij ging”). Er komt een **تْ** met Soekoen achter. Wordt het onderwerp genoemd, dan valt het voornaamwoord “zij” weg en blijft het werkwoord enkelvoud.",
          "Volgt er een woord met اَلْ, dan wordt de Soekoen een **Kasrah**: ذَهَبَتِ الْبِنْتُ."
        ],
        "vb": [["ذَهَبَتْ إِلَى الْجَامِعَةِ.", "Zij ging naar de universiteit."], ["ذَهَبَتْ مَرْيَمُ إِلَى الْمَدْرَسَةِ.", "Maryam ging naar school."], ["ذَهَبَتِ الْبِنْتُ.", "Het meisje ging."]],
        "tip": "Het werkwoord staat vóór de Faa‘il en past zich in geslacht aan: ذَهَبَ بِلَالٌ, maar ذَهَبَتْ مَرْيَمُ."
      },
      {
        "kop": "Vrouwelijk “die”: اَلَّتِيْ",
        "tekst": [
          "Je kent **اَلَّذِيْ** (mannelijk). De vrouwelijke vorm is **اَلَّتِيْ**. Beide zijn een **Ism Mawsoel**, een betrekkelijk voornaamwoord. Het past in geslacht bij het woord ervoor."
        ],
        "vb": [["اَلسَّاعَةُ الَّتِيْ عَلَى الْمَكْتَبِ لِلْمُدَرِّسِ.", "Het horloge dat op de tafel is, is van de leraar."]]
      },
      {
        "kop": "Nadruk leggen",
        "tekst": [
          "Wil je benadrukken van wie iets is, dan voeg je achter het naamwoord het losse voornaamwoord toe: هٰذَا كِتَابُكَ أَنْتَ (“dit is jóúw boek”). Dat doe je bij twijfel of bij een geschil."
        ],
        "vb": [["هٰذَا كِتَابُكَ أَنْتَ", "Dit is jóúw boek"]]
      }
    ],
    "vragen": [
      { "v": "Welk woord betekent “jij” tegen een vrouw?", "o": ["أَنْتِ", "أَنْتَ", "أَنَا", "هِيَ"], "g": 0, "u": "أَنْتِ (met Kasrah) = jij, vrouwelijk." },
      { "v": "Wat betekent ـكِ?", "o": ["jouw (vrouwelijk)", "jouw (mannelijk)", "zijn", "haar"], "g": 0, "u": "ـكِ is het achtervoegsel voor een vrouw." },
      { "v": "Wat betekent ذَهَبَتْ?", "o": ["zij ging", "hij ging", "ik ging", "jij ging"], "g": 0, "u": "ذَهَبَتْ is de vrouwelijke enkelvoudsvorm." },
      { "v": "Wat gebeurt er met de Soekoen van ذَهَبَتْ voor اَلْ?", "o": ["Hij wordt een Kasrah", "Hij blijft", "Hij wordt een Dammah", "Hij valt weg"], "g": 0, "u": "ذَهَبَتِ الْبِنْتُ: de Soekoen wordt een Kasrah." },
      { "v": "Welke van de twee is vrouwelijk: اَلَّذِيْ of اَلَّتِيْ?", "o": ["اَلَّتِيْ", "اَلَّذِيْ"], "g": 0, "u": "اَلَّتِيْ is de vrouwelijke vorm." },
      { "v": "Hoe heet het betrekkelijk voornaamwoord?", "o": ["Ism Mawsoel", "Ism Isjaarah", "Dhamier", "Harf Djarr"], "g": 0, "u": "Ism Mawsoel = betrekkelijk voornaamwoord." },
      { "v": "Wat is de Faa‘il in ذَهَبَتْ مَرْيَمُ إِلَى الْمَدْرَسَةِ?", "o": ["مَرْيَمُ", "الْمَدْرَسَةِ", "إِلَى", "ذَهَبَتْ"], "g": 0, "u": "Maryam voert de handeling uit." },
      { "v": "Waarom staat أَنْتَ in هٰذَا كِتَابُكَ أَنْتَ?", "o": ["Voor nadruk", "Als werkwoord", "Als voorzetsel", "Voor een vraag"], "g": 0, "u": "Het voornaamwoord wordt toegevoegd om te benadrukken." }
    ],
    "ontleding": [
      { "ar": "ذَهَبَتْ إِلَى الْجَامِعَةِ.", "nl": "Zij ging naar de universiteit.", "woorden": [["ذَهَبَتْ", "Fi‘l", "", "", ""], ["إِلَى", "Harf", "Harf Djarr", "", ""], ["الْجَامِعَةِ.", "Ism", "", "", "Madjroer"]] },
      { "ar": "ذَهَبَتْ مَرْيَمُ إِلَى الْمَدْرَسَةِ.", "nl": "Maryam ging naar school.", "woorden": [["ذَهَبَتْ", "Fi‘l", "", "", ""], ["مَرْيَمُ", "Ism", "", "Faa‘il", "Marfoe‘"], ["إِلَى", "Harf", "Harf Djarr", "", ""], ["الْمَدْرَسَةِ.", "Ism", "", "", "Madjroer"]] },
      { "ar": "ذَهَبَتِ الْبِنْتُ.", "nl": "Het meisje ging.", "woorden": [["ذَهَبَتِ", "Fi‘l", "", "", ""], ["الْبِنْتُ.", "Ism", "", "Faa‘il", "Marfoe‘"]] },
      { "ar": "مِنْ أَيْنَ أَنْتِ يَا آمِنَةُ؟", "nl": "Waar kom jij vandaan, o Aaminah?", "woorden": [["مِنْ", "Harf", "Harf Djarr", "", ""], ["أَيْنَ", "Ism", "Ism Istifhaam", "", ""], ["أَنْتِ", "Ism", "Dhamier", "Moebtada", ""], ["يَا", "Harf", "Harf an-Nidaa’", "", ""], ["آمِنَةُ؟", "Ism", "", "", "", "", 1]] },
      { "ar": "اَلسَّاعَةُ الَّتِيْ عَلَى الْمَكْتَبِ لِلْمُدَرِّسِ.", "nl": "Het horloge dat op de tafel is, is van de leraar.", "woorden": [["اَلسَّاعَةُ", "Ism", "", "Moebtada", "Marfoe‘"], ["الَّتِيْ", "Ism", "Ism Mawsoel", "", ""], ["عَلَى", "Harf", "Harf Djarr", "", ""], ["الْمَكْتَبِ", "Ism", "", "", "Madjroer"], ["لِلْمُدَرِّسِ.", "Harf", "Harf Djarr", "", "", "لِ = Harf Djarr · الْمُدَرِّسِ = Madjroer", 1]] }
    ]
  },

  "13": {
    "uitleg": [
      {
        "kop": "Twee soorten meervoud",
        "tekst": [
          "In het Arabisch hebben ook bijvoeglijke naamwoorden een meervoud. Er zijn twee soorten meervoud: het **ongebroken meervoud** (de oorspronkelijke vorm blijft behouden, er komt iets bij) en het **gebroken meervoud** (de vorm van het woord verandert zelf).",
          "In het Nederlands lijkt dit op “boek → boeken” (ongebroken) tegenover “epos → epen” (gebroken)."
        ]
      },
      {
        "kop": "Ongebroken meervoud",
        "tekst": [
          "Mannelijk: einde **-oena** (ـُوْنَ). Vrouwelijk: einde **-aat-oe-n** (ـَاتٌ). Bij het vrouwelijke meervoud verandert de Taa’ Marboetah ة in een gewone ت, en de “a” ervoor wordt lang."
        ],
        "vb": [["مُدَرِّسٌ → مُدَرِّسُوْنَ", "een leraar → leraren"], ["مُسْلِمَةٌ → مُسْلِمَاتٌ", "een moslima → moslima’s"], ["مُهَنْدِسَةٌ → مُهَنْدِسَاتٌ", "een ingenieur (v.) → ingenieurs (v.)"]],
        "tip": "Het enige verschil in uitspraak tussen moeslimat-oe-n en moeslimaat-oe-n is de lengte van de “a”."
      },
      {
        "kop": "Gebroken meervoud: leer het per woord",
        "tekst": [
          "Het gebroken meervoud wordt in het Arabisch heel vaak gebruikt. Er zijn meer dan twintig patronen; je leert er in deze les acht. Het beste is om bij elk nieuw woord het meervoud mee te leren."
        ],
        "vb": [["نَجْمٌ → نُجُوْمٌ", "een ster → sterren"], ["كِتَابٌ → كُتُبٌ", "een boek → boeken"], ["جَبَلٌ → جِبَالٌ", "een berg → bergen"], ["تَاجِرٌ → تُجَّارٌ", "een handelaar → handelaren"], ["قَلَمٌ → أَقْلَامٌ", "een pen → pennen"]]
      },
      {
        "kop": "Meervoudige voornaamwoorden",
        "tekst": [
          "**هٰؤُلَاءِ** is het meervoud van هٰذَا en هٰذِهِ (“deze”), meestal voor mensen. **هُمْ** (“zij”, m.) en **ـهُمْ** (“hun”) zijn de meervouden van هُوَ en ـهُ. **هُنَّ** (“zij”, v.) en **ـهُنَّ** (“hun”, v.) zijn de meervouden van هِيَ en ـهَا. **أُولٰئِكَ** is het meervoud van ذٰلِكَ en تِلْكَ (“die”)."
        ],
        "vb": [["هٰذَا تَاجِرٌ → هٰؤُلَاءِ تُجَّارٌ", "Dit is een handelaar → Deze zijn handelaren"], ["هُوَ مُدَرِّسٌ → هُمْ مُدَرِّسُوْنَ", "Hij is een leraar → Zij zijn leraren"]]
      },
      {
        "kop": "“Zij gingen”: ذَهَبُوْا en ذَهَبْنَ",
        "tekst": [
          "Mannelijk meervoud: **ذَهَبُوْا** (er staat een Alief aan het einde die je niet uitspreekt). Vrouwelijk meervoud: **ذَهَبْنَ**."
        ],
        "vb": [["ذَهَبُوْا إِلَى الْجَامِعَةِ.", "Zij gingen naar de universiteit."], ["ذَهَبْنَ إِلَى الْمَكْتَبَةِ.", "Zij gingen naar de bibliotheek."]]
      },
      {
        "kop": "Onregelmatige meervouden",
        "tekst": [
          "Een paar vrouwelijke woorden hebben een meervoud van een andere stam: بِنْتٌ → بَنَاتٌ, أُخْتٌ → أَخَوَاتٌ, فَتَاةٌ → فَتَيَاتٌ."
        ]
      }
    ],
    "vragen": [
      { "v": "Hoe heet het meervoud waarbij de vorm van het woord zelf verandert?", "o": ["Gebroken meervoud", "Ongebroken meervoud", "Tweevoud", "Enkelvoud"], "g": 0, "u": "Bij het gebroken meervoud wordt het woord zelf gebroken." },
      { "v": "Welk einde heeft het mannelijk ongebroken meervoud?", "o": ["-oena (ـُوْنَ)", "-aat (ـَاتٌ)", "-aan", "-ie"], "g": 0, "u": "مُدَرِّسٌ → مُدَرِّسُوْنَ." },
      { "v": "Wat is het meervoud van مُسْلِمَةٌ?", "o": ["مُسْلِمَاتٌ", "مُسْلِمُوْنَ", "مُسْلِمٌ", "مُسْلِمَانِ"], "g": 0, "u": "Vrouwelijk ongebroken meervoud: -aat." },
      { "v": "Wat is het meervoud van كِتَابٌ?", "o": ["كُتُبٌ", "كِتَابُوْنَ", "كِتَابَاتٌ", "أَكْتَابٌ"], "g": 0, "u": "كِتَابٌ → كُتُبٌ is een gebroken meervoud." },
      { "v": "Wat is het meervoud van قَلَمٌ?", "o": ["أَقْلَامٌ", "قَلَمُوْنَ", "قُلُمٌ", "قَلَمَاتٌ"], "g": 0, "u": "قَلَمٌ → أَقْلَامٌ." },
      { "v": "Welk woord betekent “deze” (meervoud, mensen)?", "o": ["هٰؤُلَاءِ", "أُولٰئِكَ", "هٰذِهِ", "هُمْ"], "g": 0, "u": "هٰؤُلَاءِ is het meervoud van هٰذَا en هٰذِهِ." },
      { "v": "Welk woord betekent “die” (meervoud)?", "o": ["أُولٰئِكَ", "هٰؤُلَاءِ", "تِلْكَ", "هُنَّ"], "g": 0, "u": "أُولٰئِكَ is het meervoud van ذٰلِكَ en تِلْكَ." },
      { "v": "Wat is het meervoud van هِيَ?", "o": ["هُنَّ", "هُمْ", "أَنْتُمْ", "نَحْنُ"], "g": 0, "u": "هُنَّ = zij (vrouwelijk meervoud)." },
      { "v": "Wat betekent ذَهَبْنَ?", "o": ["zij gingen (v.)", "zij gingen (m.)", "wij gingen", "jullie gingen"], "g": 0, "u": "ذَهَبْنَ is het vrouwelijk meervoud." },
      { "v": "Wat is het meervoud van بِنْتٌ?", "o": ["بَنَاتٌ", "بِنْتَاتٌ", "بِنْتُوْنَ", "أَبْنَاتٌ"], "g": 0, "u": "بِنْتٌ → بَنَاتٌ is onregelmatig." }
    ],
    "ontleding": [
      { "ar": "هٰؤُلَاءِ تُجَّارٌ", "nl": "Deze zijn handelaren", "woorden": [["هٰؤُلَاءِ", "Ism", "Ism Isjaarah", "Moebtada", ""], ["تُجَّارٌ", "Ism", "", "Chabar", "Marfoe‘"]] },
      { "ar": "هُمْ مُدَرِّسُوْنَ", "nl": "Zij zijn leraren", "woorden": [["هُمْ", "Ism", "Dhamier", "Moebtada", ""], ["مُدَرِّسُوْنَ", "Ism", "", "Chabar", "Marfoe‘"]] },
      { "ar": "ذَهَبُوْا إِلَى الْجَامِعَةِ.", "nl": "Zij gingen naar de universiteit.", "woorden": [["ذَهَبُوْا", "Fi‘l", "", "", ""], ["إِلَى", "Harf", "Harf Djarr", "", ""], ["الْجَامِعَةِ.", "Ism", "", "", "Madjroer"]] },
      { "ar": "ذَهَبْنَ إِلَى الْمَكْتَبَةِ.", "nl": "Zij gingen naar de bibliotheek.", "woorden": [["ذَهَبْنَ", "Fi‘l", "", "", ""], ["إِلَى", "Harf", "Harf Djarr", "", ""], ["الْمَكْتَبَةِ.", "Ism", "", "", "Madjroer"]] },
      { "ar": "أَيْنَ إِخْوَتُكَ؟", "nl": "Waar zijn jouw broers?", "woorden": [["أَيْنَ", "Ism", "Ism Istifhaam", "", ""], ["إِخْوَتُكَ؟", "Ism", "", "Moebtada", "Marfoe‘", "إِخْوَةُ = Moedaaf · كَ = Dhamier, Moedaaf Ilaih", 1]] }
    ]
  },

  "14": {
    "uitleg": [
      {
        "kop": "Jullie en wij",
        "tekst": [
          "**أَنْتُمْ** is “jullie” (mannelijk meervoud); het achtervoegsel is **ـكُمْ**. **نَحْنُ** is “wij” (mannelijk én vrouwelijk); het achtervoegsel is **ـنَا** (“ons”). Alle vier zijn een **Dhamier**."
        ],
        "vb": [["مَنْ أَنْتُمْ؟", "Wie zijn jullie?"], ["نَحْنُ مُسْلِمُوْنَ.", "Wij zijn moslims."], ["اللّٰهُ رَبُّنَا.", "Allah is onze Heer."], ["الْإِسْلَامُ دِيْنُنَا.", "Islam is onze religie."]]
      },
      {
        "kop": "Werkwoorden: jullie en wij gingen",
        "tekst": [
          "**ذَهَبْتُمْ** betekent “jullie gingen” en **ذَهَبْنَا** “wij gingen”. Let op het verschil met ذَهَبْنَ (“zij gingen”, vrouwelijk): daar is de laatste “a” kort, bij ذَهَبْنَا is hij lang."
        ],
        "vb": [["أَيْنَ ذَهَبْتُمْ يَا أَبْنَائِيْ؟", "Waar gingen jullie, o mijn zonen?"]]
      },
      {
        "kop": "Eigennamen zonder Tanwien",
        "tekst": [
          "Ook niet-Arabische eigennamen krijgen geen Tanwien, zoals وِلْيَمُ (“Willem”), بَاكِسْتَانُ (“Pakistan”), لَنْدَنُ (“Londen”) en de meeste namen van de Profeten (إِبْرَاهِيْمُ, إِسْمَاعِيْلُ, إِسْحَاقُ, يَعْقُوْبُ).",
          "Een uitzondering: een mannelijke niet-Arabische naam van precies drie letters met een Soekoen op de tweede letter krijgt wél een Tanwien, bijvoorbeeld خَانٌ, لُوْطٌ en نُوْحٌ."
        ]
      },
      {
        "kop": "Een Na‘t bij een Moedaaf",
        "tekst": [
          "De Moedaaf is bepaald door zijn positie. Daarom is een bijvoeglijk naamwoord bij een Moedaaf ook bepaald (met اَلْ).",
          "Let op het verschil: in بَيْتُ الْإِمَامِ الْجَدِيْدُ hoort الْجَدِيْدُ bij بَيْتُ (“het nieuwe huis van de imam”). In بَيْتُ الْإِمَامِ الْجَدِيْدِ hoort het bij الْإِمَامِ (“het huis van de nieuwe imam”). De uitgang laat zien bij welk woord het hoort."
        ],
        "vb": [["بَيْتُ الْإِمَامِ الْجَدِيْدُ.", "Het nieuwe huis van de imam."], ["بَيْتُ الْإِمَامِ الْجَدِيْدِ.", "Het huis van de nieuwe imam."]],
        "tip": "Kijk naar de uitgang van de Na‘t. -oe hoort bij de Moedaaf (Marfoe‘), -ie bij de Moedaaf Ilaih (Madjroer)."
      },
      {
        "kop": "“Welk”: أَيٌّ",
        "tekst": [
          "**أَيٌّ** betekent “welk(e)” en werkt als een **Moedaaf**: het naamwoord erna is Moedaaf Ilaih en eindigt op -ie. Na een voorzetsel is أَيٌّ zelf Madjroer (أَيِّ); soms is het Mansoeb (أَيَّ)."
        ],
        "vb": [["أَيُّ بَيْتٍ هٰذَا؟", "Welk huis is dit?"], ["فِيْ أَيِّ فَصْلٍ جَلَسْتَ؟", "In welke klas zat jij?"], ["أَيَّ لُغَةٍ تُحِبُّ؟", "Welke taal heb je lief?"]]
      }
    ],
    "vragen": [
      { "v": "Wat betekent أَنْتُمْ?", "o": ["jullie (m.)", "wij", "jij", "zij (m.)"], "g": 0, "u": "أَنْتُمْ = jullie." },
      { "v": "Wat betekent نَحْنُ?", "o": ["wij", "jullie", "ik", "zij"], "g": 0, "u": "نَحْنُ is het meervoud van أَنَا." },
      { "v": "Wat betekent بَيْتُنَا?", "o": ["ons huis", "mijn huis", "jullie huis", "hun huis"], "g": 0, "u": "ـنَا = ons." },
      { "v": "Wat betekent ذَهَبْنَا?", "o": ["wij gingen", "zij gingen (v.)", "jullie gingen", "ik ging"], "g": 0, "u": "ذَهَبْنَا met lange -aa = wij gingen." },
      { "v": "Wat is het verschil tussen ذَهَبْنَ en ذَهَبْنَا?", "o": ["Korte of lange laatste a", "Geen verschil", "Eerste letter", "Er is geen verschil in betekenis"], "g": 0, "u": "ذَهَبْنَ = zij (v.), ذَهَبْنَا = wij." },
      { "v": "Welke naam krijgt géén Tanwien?", "o": ["إِبْرَاهِيْمُ", "خَانٌ", "لُوْطٌ", "نُوْحٌ"], "g": 0, "u": "Niet-Arabische namen krijgen geen Tanwien, behalve driefletterige met Soekoen op de tweede letter." },
      { "v": "Waarom is de Na‘t in بَيْتُ الْإِمَامِ الْجَدِيْدُ Marfoe‘?", "o": ["Hij hoort bij بَيْتُ", "Hij hoort bij الْإِمَامِ", "Hij is een Fi‘l", "Hij is een Harf"], "g": 0, "u": "Dezelfde naamval als het Man‘oet: بَيْتُ is Marfoe‘." },
      { "v": "Wat betekent بَيْتُ الْإِمَامِ الْجَدِيْدِ?", "o": ["Het huis van de nieuwe imam", "Het nieuwe huis van de imam", "Het nieuwe huis", "De nieuwe imam"], "g": 0, "u": "الْجَدِيْدِ (Madjroer) hoort bij الْإِمَامِ." },
      { "v": "Wat betekent أَيٌّ?", "o": ["welk(e)", "wie", "waar", "wat"], "g": 0, "u": "أَيٌّ = welk(e)." },
      { "v": "Welke uitgang heeft het naamwoord ná أَيٌّ?", "o": ["-ie (Madjroer)", "-oe (Marfoe‘)", "-a (Mansoeb)", "geen"], "g": 0, "u": "أَيٌّ is Moedaaf, dus het volgende woord is Moedaaf Ilaih." }
    ],
    "ontleding": [
      { "ar": "نَحْنُ مُسْلِمُوْنَ.", "nl": "Wij zijn moslims.", "woorden": [["نَحْنُ", "Ism", "Dhamier", "Moebtada", ""], ["مُسْلِمُوْنَ.", "Ism", "", "Chabar", "Marfoe‘"]] },
      { "ar": "اللّٰهُ رَبُّنَا.", "nl": "Allah is onze Heer.", "woorden": [["اللّٰهُ", "Ism", "", "Moebtada", "Marfoe‘"], ["رَبُّنَا.", "Ism", "", "Chabar", "Marfoe‘", "رَبُّ = Moedaaf · نَا = Dhamier, Moedaaf Ilaih"]] },
      { "ar": "بَيْتُ الْإِمَامِ الْجَدِيْدُ.", "nl": "Het nieuwe huis van de imam.", "woorden": [["بَيْتُ", "Ism", "", "Moedaaf", "Marfoe‘"], ["الْإِمَامِ", "Ism", "", "Moedaaf Ilaih", "Madjroer"], ["الْجَدِيْدُ.", "Ism", "", "Na‘t", "Marfoe‘"]] },
      { "ar": "بَيْتُ الْإِمَامِ الْجَدِيْدِ.", "nl": "Het huis van de nieuwe imam.", "woorden": [["بَيْتُ", "Ism", "", "Moedaaf", "Marfoe‘"], ["الْإِمَامِ", "Ism", "", "Man‘oet", "Madjroer"], ["الْجَدِيْدِ.", "Ism", "", "Na‘t", "Madjroer"]] },
      { "ar": "أَيُّ بَيْتٍ هٰذَا؟", "nl": "Welk huis is dit?", "woorden": [["أَيُّ", "Ism", "Ism Istifhaam", "Moedaaf", "Marfoe‘"], ["بَيْتٍ", "Ism", "", "Moedaaf Ilaih", "Madjroer"], ["هٰذَا؟", "Ism", "Ism Isjaarah", "Moebtada", ""]] },
      { "ar": "فِيْ أَيِّ فَصْلٍ جَلَسْتَ؟", "nl": "In welke klas zat jij?", "woorden": [["فِيْ", "Harf", "Harf Djarr", "", ""], ["أَيِّ", "Ism", "Ism Istifhaam", "Moedaaf", "Madjroer"], ["فَصْلٍ", "Ism", "", "Moedaaf Ilaih", "Madjroer"], ["جَلَسْتَ؟", "Fi‘l", "", "", ""]] }
    ]
  },

  "15": {
    "uitleg": [
      {
        "kop": "Jullie (vrouwen): أَنْتُنَّ en ـكُنَّ",
        "tekst": [
          "Het meervoud van أَنْتِ (“jij”, v.) is **أَنْتُنَّ** (“jullie”, v.). Het achtervoegsel is **ـكُنَّ**. Zo heb je nu voor “jullie” twee vormen: أَنْتُمْ voor mannen en أَنْتُنَّ voor vrouwen."
        ],
        "vb": [["مَنْ أَنْتُنَّ يَا أَخَوَاتِيْ؟", "Wie zijn jullie, o mijn zussen?"], ["أَيْنَ بَيْتُكُنَّ يَا سَيِّدَاتُ؟", "Waar is jullie huis, o dames?"]]
      },
      {
        "kop": "Het werkwoord: jullie (v.) gingen",
        "tekst": [
          "Bij het werkwoord hoort ook een vorm voor “jullie” (vrouwelijk): **ذَهَبْتُنَّ**. Naast ذَهَبْتِ (“jij ging”, v.) en ذَهَبْتُمْ (“jullie gingen”, m.) heb je nu bijna de hele reeks. Alles samen zijn het **Fi‘l**-vormen."
        ],
        "vb": [["أَيْنَ ذَهَبْتُنَّ يَا أَخَوَاتُ؟", "Waar gingen jullie, o zusters?"], ["أَيْنَ ذَهَبْتُمْ يَا إِخْوَانُ؟", "Waar gingen jullie, o broeders?"]]
      },
      {
        "kop": "“Voor” en “na”: قَبْلَ en بَعْدَ",
        "tekst": [
          "**قَبْلَ** betekent “vóór” en **بَعْدَ** betekent “na” (in de tijd). Het zijn plaats- en tijdwoorden (**Zarf**) die altijd een **Moedaaf** zijn. Het woord erna is dus **Moedaaf Ilaih** en eindigt op -ie (Madjroer)."
        ],
        "vb": [["بَعْدَ الدَّرْسِ", "Na de les"], ["قَبْلَ الصَّلَاةِ", "Vóór het gebed"]]
      },
      {
        "kop": "“Hij keerde terug”: رَجَعَ",
        "tekst": [
          "**رَجَعَ** is een **Fi‘l** en betekent “hij keerde terug”. Je gebruikt het met مِنْ (“van”) of إِلَى (“naar”)."
        ],
        "vb": [["أَرَجَعَ الْإِمَامُ مِنَ الْمَسْجِدِ؟", "Keerde de imam terug van de moskee?"], ["ذَهَبْتُ إِلَى الْمَسْجِدِ قَبْلَ الْأَذَانِ وَرَجَعْتُ بَعْدَ الصَّلَاةِ.", "Ik ging naar de moskee vóór de Adhaan en ik keerde terug na het gebed."]]
      }
    ],
    "vragen": [
      { "v": "Wat betekent أَنْتُنَّ?", "o": ["jullie (v.)", "jullie (m.)", "zij (v.)", "wij"], "g": 0, "u": "أَنْتُنَّ is het vrouwelijk meervoud van “jij”." },
      { "v": "Wat betekent ـكُنَّ?", "o": ["jullie (v.)", "jullie (m.)", "jouw (v.)", "onze"], "g": 0, "u": "ـكُنَّ is het achtervoegsel bij أَنْتُنَّ." },
      { "v": "Wat betekent ذَهَبْتُنَّ?", "o": ["jullie (v.) gingen", "jullie (m.) gingen", "wij gingen", "zij gingen"], "g": 0, "u": "ذَهَبْتُنَّ hoort bij أَنْتُنَّ." },
      { "v": "Wat betekent قَبْلَ?", "o": ["vóór", "na", "met", "bij"], "g": 0, "u": "قَبْلَ = vóór, بَعْدَ = na." },
      { "v": "Wat betekent بَعْدَ الدَّرْسِ?", "o": ["Na de les", "Vóór de les", "In de les", "Met de les"], "g": 0, "u": "بَعْدَ = na." },
      { "v": "Welke naamval heeft het woord na قَبْلَ?", "o": ["Madjroer", "Marfoe‘", "Mansoeb", "Geen"], "g": 0, "u": "Het is Moedaaf Ilaih, dus Madjroer." },
      { "v": "Welke functie hebben قَبْلَ en بَعْدَ?", "o": ["Moedaaf", "Moedaaf Ilaih", "Faa‘il", "Chabar"], "g": 0, "u": "Ze zijn altijd Moedaaf." },
      { "v": "Wat betekent رَجَعَ?", "o": ["hij keerde terug", "hij ging", "hij zat", "hij at"], "g": 0, "u": "رَجَعَ = hij keerde terug." }
    ],
    "ontleding": [
      { "ar": "بَعْدَ الدَّرْسِ", "nl": "Na de les", "woorden": [["بَعْدَ", "Ism", "Zarf", "Moedaaf", ""], ["الدَّرْسِ", "Ism", "", "Moedaaf Ilaih", "Madjroer"]] },
      { "ar": "قَبْلَ الصَّلَاةِ", "nl": "Vóór het gebed", "woorden": [["قَبْلَ", "Ism", "Zarf", "Moedaaf", ""], ["الصَّلَاةِ", "Ism", "", "Moedaaf Ilaih", "Madjroer"]] },
      { "ar": "نَحْنُ بَنَاتُ الْإِمَامِ.", "nl": "Wij zijn de dochters van de imam.", "woorden": [["نَحْنُ", "Ism", "Dhamier", "Moebtada", ""], ["بَنَاتُ", "Ism", "", "Moedaaf", "Marfoe‘"], ["الْإِمَامِ.", "Ism", "", "Moedaaf Ilaih", "Madjroer"]] },
      { "ar": "بَيْتُنَا قَرِيْبٌ مِنَ الْمَسْجِدِ.", "nl": "Ons huis is dicht bij de moskee.", "woorden": [["بَيْتُنَا", "Ism", "", "Moebtada", "Marfoe‘", "بَيْتُ = Moedaaf · نَا = Dhamier, Moedaaf Ilaih"], ["قَرِيْبٌ", "Ism", "", "Chabar", "Marfoe‘"], ["مِنَ", "Harf", "Harf Djarr", "", ""], ["الْمَسْجِدِ.", "Ism", "", "", "Madjroer"]] },
      { "ar": "أَرَجَعَ الْإِمَامُ مِنَ الْمَسْجِدِ؟", "nl": "Keerde de imam terug van de moskee?", "woorden": [["أَرَجَعَ", "Fi‘l", "", "", "", "أَ = Harf Istifhaam · رَجَعَ = Fi‘l", 1], ["الْإِمَامُ", "Ism", "", "Faa‘il", "Marfoe‘"], ["مِنَ", "Harf", "Harf Djarr", "", ""], ["الْمَسْجِدِ؟", "Ism", "", "", "Madjroer"]] }
    ]
  },

  "16": {
    "uitleg": [
      {
        "kop": "Met verstand en zonder verstand",
        "tekst": [
          "Het Arabisch verdeelt naamwoorden in twee groepen. **Rationeel** (met verstand, **عَاقِلٌ**): mensen, engelen, duivels. **Irrationeel** (zonder verstand, **غَيْرُ عَاقِلٍ**): dingen, dieren en begrippen.",
          "In het enkelvoud maakt dit geen verschil. In het meervoud wel."
        ]
      },
      {
        "kop": "De hoofdregel voor het meervoud",
        "tekst": [
          "Een meervoud van **mensen** gedraagt zich als meervoud: je gebruikt هُمْ, هٰؤُلَاءِ en een meervoudswerkwoord (خَرَجُوْا).",
          "Een meervoud van **dingen en dieren** gedraagt zich als **vrouwelijk enkelvoud**: je gebruikt هِيَ, هٰذِهِ en een vrouwelijk enkelvoudswerkwoord (خَرَجَتْ)."
        ],
        "vb": [["هٰؤُلَاءِ طُلَّابٌ جُدُدٌ، هُمْ صِغَارٌ.", "Deze zijn nieuwe studenten, zij zijn klein."], ["هٰذِهِ كُتُبٌ جَدِيْدَةٌ، هِيَ صَغِيْرَةٌ.", "Dit zijn nieuwe boeken, ze zijn klein."], ["الطُّلَّابُ خَرَجُوْا.", "De studenten zijn naar buiten gegaan."], ["الْكِلَابُ خَرَجَتْ.", "De honden zijn naar buiten gegaan."]],
        "tip": "Meervoud van dingen = vrouwelijk enkelvoud. Dat geldt voor het voornaamwoord, het bijvoeglijk naamwoord én het werkwoord."
      },
      {
        "kop": "Een nieuw meervoudspatroon: مَفَاعِلُ",
        "tekst": [
          "Een patroon dat je vaak tegenkomt is **مَفَاعِلُ**. Dit patroon krijgt **geen Tanwien**."
        ],
        "vb": [["مَسْجِدٌ → مَسَاجِدُ", "een moskee → moskeeën"], ["دَفْتَرٌ → دَفَاتِرُ", "een schrift → schriften"]],
        "tip": "Er zijn uitzonderingen op de hoofdregel; die komen in een latere les."
      }
    ],
    "vragen": [
      { "v": "Hoe heet “met verstand” in het Arabisch?", "o": ["عَاقِلٌ", "غَيْرُ عَاقِلٍ", "مَنْعُوْتٌ", "مُبْتَدَأٌ"], "g": 0, "u": "عَاقِلٌ = rationeel (mensen)." },
      { "v": "Wat is het meervoud van irrationele naamwoorden grammaticaal?", "o": ["Vrouwelijk enkelvoud", "Mannelijk meervoud", "Tweevoud", "Mannelijk enkelvoud"], "g": 0, "u": "Dingen en dieren in het meervoud gedragen zich als vrouwelijk enkelvoud." },
      { "v": "Welk voornaamwoord gebruik je voor “boeken”?", "o": ["هِيَ", "هُمْ", "هُنَّ", "هُوَ"], "g": 0, "u": "Meervoud van dingen = هِيَ." },
      { "v": "Welk voornaamwoord gebruik je voor “studenten”?", "o": ["هُمْ", "هِيَ", "هُوَ", "هُمَا"], "g": 0, "u": "Rationeel meervoud: هُمْ." },
      { "v": "Welke zin is correct?", "o": ["الْكِلَابُ خَرَجَتْ.", "الْكِلَابُ خَرَجُوْا.", "الْكِلَابُ خَرَجَ.", "الْكِلَابُ خَرَجْنَ."], "g": 0, "u": "Honden zijn irrationeel: vrouwelijk enkelvoud (خَرَجَتْ)." },
      { "v": "Welke zin is correct?", "o": ["الطُّلَّابُ خَرَجُوْا.", "الطُّلَّابُ خَرَجَتْ.", "الطُّلَّابُ خَرَجَ.", "الطُّلَّابُ خَرَجَا."], "g": 0, "u": "Studenten zijn mensen: meervoudswerkwoord." },
      { "v": "Wat is het meervoud van مَسْجِدٌ?", "o": ["مَسَاجِدُ", "مَسْجِدُوْنَ", "مَسْجِدَاتٌ", "مَسَاجِدٌ"], "g": 0, "u": "مَفَاعِلُ krijgt geen Tanwien." },
      { "v": "Wat is bijzonder aan het patroon مَفَاعِلُ?", "o": ["Het krijgt geen Tanwien", "Het is altijd vrouwelijk", "Het heeft altijd -oena", "Het kan alleen voor mensen"], "g": 0, "u": "Dit patroon heeft geen Tanwien." }
    ],
    "ontleding": [
      { "ar": "هٰذَا كِتَابٌ جَدِيْدٌ، هُوَ صَغِيْرٌ.", "nl": "Dit is een nieuw boek, het is klein.", "woorden": [["هٰذَا", "Ism", "Ism Isjaarah", "Moebtada", ""], ["كِتَابٌ", "Ism", "", "Man‘oet", "Marfoe‘"], ["جَدِيْدٌ،", "Ism", "", "Na‘t", "Marfoe‘"], ["هُوَ", "Ism", "Dhamier", "Moebtada", ""], ["صَغِيْرٌ.", "Ism", "", "Chabar", "Marfoe‘"]] },
      { "ar": "هٰذِهِ كُتُبٌ جَدِيْدَةٌ، هِيَ صَغِيْرَةٌ.", "nl": "Dit zijn nieuwe boeken, ze zijn klein.", "woorden": [["هٰذِهِ", "Ism", "Ism Isjaarah", "Moebtada", ""], ["كُتُبٌ", "Ism", "", "Man‘oet", "Marfoe‘"], ["جَدِيْدَةٌ،", "Ism", "", "Na‘t", "Marfoe‘"], ["هِيَ", "Ism", "Dhamier", "Moebtada", ""], ["صَغِيْرَةٌ.", "Ism", "", "Chabar", "Marfoe‘"]] },
      { "ar": "الطُّلَّابُ خَرَجُوْا.", "nl": "De studenten zijn naar buiten gegaan.", "woorden": [["الطُّلَّابُ", "Ism", "", "Moebtada", "Marfoe‘"], ["خَرَجُوْا.", "Fi‘l", "", "", ""]] },
      { "ar": "الْكِلَابُ خَرَجَتْ.", "nl": "De honden zijn naar buiten gegaan.", "woorden": [["الْكِلَابُ", "Ism", "", "Moebtada", "Marfoe‘"], ["خَرَجَتْ.", "Fi‘l", "", "", ""]] }
    ]
  },

  "18": {
    "uitleg": [
      {
        "kop": "Het tweevoud",
        "tekst": [
          "Het Arabisch heeft drie getallen: enkelvoud, **tweevoud** (precies twee) en meervoud (meer dan twee). Het tweevoud eindigt op **-aani** (ـَانِ)."
        ],
        "vb": [["بَيْتٌ → بَيْتَانِ", "een huis → twee huizen"], ["يَدٌ → يَدَانِ", "een hand → twee handen"]]
      },
      {
        "kop": "Tweevoud van de voornaamwoorden",
        "tekst": [
          "Het tweevoud van هٰذَا is **هٰذَانِ** en van هٰذِهِ is **هَاتَانِ**. Het tweevoud van هُوَ en هِيَ is **هُمَا** (“zij twee”, voor mannelijk en vrouwelijk)."
        ],
        "vb": [["هٰذَانِ كِتَابَانِ", "Dit zijn twee boeken."], ["هَاتَانِ سَيَّارَتَانِ", "Dit zijn twee auto’s."], ["هُمَا طَالِبَانِ جَدِيْدَانِ.", "Zij zijn twee nieuwe studenten."]],
        "tip": "Het bijvoeglijk naamwoord bij een tweevoud staat zelf ook in het tweevoud: طَالِبَانِ جَدِيْدَانِ."
      },
      {
        "kop": "“Hoeveel?”: كَمْ",
        "tekst": [
          "**كَمْ** betekent “hoeveel”. Het naamwoord erna staat in het **enkelvoud** en is **Mansoeb** (-a)."
        ],
        "vb": [["كَمْ كِتَابًا؟", "Hoeveel boeken?"], ["كَمْ سَيَّارَةً؟", "Hoeveel auto’s?"]]
      },
      {
        "kop": "De Alief bij -an",
        "tekst": [
          "Een naamwoord met Tanwien in de Mansoeb krijgt er een **Alief** bij: كِتَابًا. Die Alief spreek je niet uit als je doorleest. Een naamwoord op een Taa’ Marboetah krijgt die Alief niet: سَيَّارَةً."
        ],
        "vb": [["كِتَابٌ - كِتَابٍ - كِتَابًا", "Marfoe‘ - Madjroer - Mansoeb"]]
      }
    ],
    "vragen": [
      { "v": "Welke uitgang heeft het tweevoud?", "o": ["-aani (ـَانِ)", "-oena", "-aat", "-ie"], "g": 0, "u": "بَيْتٌ → بَيْتَانِ." },
      { "v": "Wat betekent هٰذَانِ كِتَابَانِ?", "o": ["Dit zijn twee boeken.", "Dit is een boek.", "Dit zijn boeken.", "Wat zijn dit?"], "g": 0, "u": "Tweevoud van هٰذَا + tweevoud van كِتَابٌ." },
      { "v": "Welk woord is het tweevoud van هٰذِهِ?", "o": ["هَاتَانِ", "هٰذَانِ", "هُمَا", "هٰؤُلَاءِ"], "g": 0, "u": "هَاتَانِ = deze twee (v.)." },
      { "v": "Wat is het tweevoud van هُوَ en هِيَ?", "o": ["هُمَا", "هُمْ", "هُنَّ", "نَحْنُ"], "g": 0, "u": "هُمَا = zij twee." },
      { "v": "Wat betekent كَمْ?", "o": ["hoeveel", "welk", "waar", "wie"], "g": 0, "u": "كَمْ = hoeveel." },
      { "v": "In welke vorm staat het naamwoord na كَمْ?", "o": ["Enkelvoud, Mansoeb", "Meervoud, Madjroer", "Tweevoud, Marfoe‘", "Enkelvoud, Marfoe‘"], "g": 0, "u": "كَمْ كِتَابًا: enkelvoud en Mansoeb." },
      { "v": "Hoe wordt كِتَابٌ in de Mansoeb?", "o": ["كِتَابًا", "كِتَابٍ", "كِتَابُ", "كِتَابِ"], "g": 0, "u": "Tanwien + Alief: كِتَابًا." },
      { "v": "Krijgt سَيَّارَةً een Alief?", "o": ["Nee, bij ة komt geen Alief", "Ja, altijd", "Alleen in het meervoud", "Alleen na كَمْ"], "g": 0, "u": "Naamwoorden op ة krijgen die Alief niet." }
    ],
    "ontleding": [
      { "ar": "هٰذَانِ كِتَابَانِ", "nl": "Dit zijn twee boeken.", "woorden": [["هٰذَانِ", "Ism", "Ism Isjaarah", "Moebtada", "Marfoe‘"], ["كِتَابَانِ", "Ism", "", "Chabar", "Marfoe‘"]] },
      { "ar": "هُمَا طَالِبَانِ جَدِيْدَانِ.", "nl": "Zij zijn twee nieuwe studenten.", "woorden": [["هُمَا", "Ism", "Dhamier", "Moebtada", ""], ["طَالِبَانِ", "Ism", "", "Man‘oet", "Marfoe‘"], ["جَدِيْدَانِ.", "Ism", "", "Na‘t", "Marfoe‘"]] },
      { "ar": "كَمْ كِتَابًا؟", "nl": "Hoeveel boeken?", "woorden": [["كَمْ", "Ism", "Ism Istifhaam", "", ""], ["كِتَابًا؟", "Ism", "", "", "Mansoeb"]] },
      { "ar": "كَمْ سَيَّارَةً؟", "nl": "Hoeveel auto’s?", "woorden": [["كَمْ", "Ism", "Ism Istifhaam", "", ""], ["سَيَّارَةً؟", "Ism", "", "", "Mansoeb"]] },
      { "ar": "أَيْنَ الْأُخْتَانِ؟", "nl": "Waar zijn de twee zusters?", "woorden": [["أَيْنَ", "Ism", "Ism Istifhaam", "", ""], ["الْأُخْتَانِ؟", "Ism", "", "Moebtada", "Marfoe‘"]] }
    ]
  },

  "19": {
    "uitleg": [
      {
        "kop": "Eén en twee volgen het naamwoord",
        "tekst": [
          "**وَاحِدٌ** (“één”) en **اِثْنَانِ** (“twee”) staan ná het naamwoord, als een **Na‘t**: كِتَابٌ وَاحِدٌ, كِتَابَانِ اثْنَانِ.",
          "اِثْنَانِ laat je meestal weg, omdat het tweevoud al “twee” betekent. Je gebruikt het alleen voor nadruk."
        ],
        "vb": [["كِتَابٌ وَاحِدٌ", "Eén boek"], ["كِتَابَانِ اثْنَانِ", "Twee boeken"]]
      },
      {
        "kop": "De getallen 3 t/m 10: Moedaaf + Ma‘doed",
        "tekst": [
          "De getallen 3 t/m 10 zijn een **Moedaaf**. Het geteld woord erna is de **Ma‘doed** (het getelde): meervoud én **Madjroer**, want het is de Moedaaf Ilaih.",
          "Je hoort dus: drie boeken = “drie van boeken”."
        ],
        "vb": [["ثَلَاثَةُ كُتُبٍ", "Drie boeken"], ["أَرْبَعَةُ بُيُوْتٍ", "Vier huizen"], ["خَمْسَةُ أَقْلَامٍ", "Vijf pennen"], ["عَشَرَةُ رِجَالٍ", "Tien mannen"]],
        "tip": "In deze les telt het getal een mannelijk naamwoord."
      },
      {
        "kop": "Het getal zelf past zich aan de zin aan",
        "tekst": [
          "Het getal (de Moedaaf) kan in elke naamval staan, afhankelijk van zijn rol in de zin. De Ma‘doed blijft altijd Madjroer."
        ],
        "vb": [["خَرَجَ ثَلَاثَةُ طُلَّابٍ.", "Drie studenten gingen naar buiten."], ["فِيْ أَرْبَعَةِ بُيُوْتٍ.", "In vier huizen."], ["رَأَيْتُ خَمْسَةَ رِجَالٍ.", "Ik zag vijf mannen."]]
      },
      {
        "kop": "De prijs vragen",
        "tekst": [
          "In كَمْ ثَمَنُ هٰذَا؟ (“Wat is de prijs hiervan?”) is een woord weggelaten, namelijk een muntnaam zoals رِيَالًا. De volledige zin is كَمْ رِيَالًا ثَمَنُ هٰذَا؟"
        ]
      }
    ],
    "vragen": [
      { "v": "Waar staat وَاحِدٌ ten opzichte van het naamwoord?", "o": ["Erachter", "Ervoor", "Los aan het begin", "Aan het einde van de zin"], "g": 0, "u": "كِتَابٌ وَاحِدٌ: het getal werkt als Na‘t." },
      { "v": "Waarom laat je اِثْنَانِ meestal weg?", "o": ["Het tweevoud betekent al “twee”", "Het bestaat niet", "Het is een Harf", "Het is te lang"], "g": 0, "u": "اِثْنَانِ gebruik je voor nadruk." },
      { "v": "Welke functie hebben de getallen 3 t/m 10?", "o": ["Moedaaf", "Moedaaf Ilaih", "Faa‘il", "Na‘t"], "g": 0, "u": "Ze zijn de Moedaaf; het getelde is de Moedaaf Ilaih." },
      { "v": "Hoe heet het getelde woord?", "o": ["Ma‘doed", "Man‘oet", "Maf‘oel bih", "Moebtada"], "g": 0, "u": "Ma‘doed = het getelde." },
      { "v": "In welke vorm staat de Ma‘doed bij 3 t/m 10?", "o": ["Meervoud en Madjroer", "Enkelvoud en Mansoeb", "Tweevoud en Marfoe‘", "Enkelvoud en Madjroer"], "g": 0, "u": "ثَلَاثَةُ كُتُبٍ: meervoud en Madjroer." },
      { "v": "Welke zin betekent “Vier huizen”?", "o": ["أَرْبَعَةُ بُيُوْتٍ", "ثَلَاثَةُ كُتُبٍ", "خَمْسَةُ أَقْلَامٍ", "عَشَرَةُ رِجَالٍ"], "g": 0, "u": "أَرْبَعَةُ = vier, بُيُوْتٌ = huizen." },
      { "v": "In رَأَيْتُ خَمْسَةَ رِجَالٍ is خَمْسَةَ …", "o": ["Mansoeb", "Marfoe‘", "Madjroer", "Moebtada"], "g": 0, "u": "Het is het lijdend voorwerp: Mansoeb." },
      { "v": "In فِيْ أَرْبَعَةِ بُيُوْتٍ is أَرْبَعَةِ …", "o": ["Madjroer", "Marfoe‘", "Mansoeb", "Faa‘il"], "g": 0, "u": "Na een voorzetsel is het Madjroer." }
    ],
    "ontleding": [
      { "ar": "كِتَابٌ وَاحِدٌ", "nl": "Eén boek", "woorden": [["كِتَابٌ", "Ism", "", "Man‘oet", "Marfoe‘"], ["وَاحِدٌ", "Ism", "", "Na‘t", "Marfoe‘"]] },
      { "ar": "ثَلَاثَةُ كُتُبٍ", "nl": "Drie boeken", "woorden": [["ثَلَاثَةُ", "Ism", "", "Moedaaf", ""], ["كُتُبٍ", "Ism", "", "Ma‘doed", "Madjroer"]] },
      { "ar": "عَشَرَةُ رِجَالٍ", "nl": "Tien mannen", "woorden": [["عَشَرَةُ", "Ism", "", "Moedaaf", ""], ["رِجَالٍ", "Ism", "", "Ma‘doed", "Madjroer"]] },
      { "ar": "خَرَجَ ثَلَاثَةُ طُلَّابٍ.", "nl": "Drie studenten gingen naar buiten.", "woorden": [["خَرَجَ", "Fi‘l", "", "", ""], ["ثَلَاثَةُ", "Ism", "", "Faa‘il", "Marfoe‘"], ["طُلَّابٍ.", "Ism", "", "Ma‘doed", "Madjroer"]] },
      { "ar": "رَأَيْتُ خَمْسَةَ رِجَالٍ.", "nl": "Ik zag vijf mannen.", "woorden": [["رَأَيْتُ", "Fi‘l", "", "", ""], ["خَمْسَةَ", "Ism", "", "Maf‘oel bih", "Mansoeb"], ["رِجَالٍ.", "Ism", "", "Ma‘doed", "Madjroer"]] }
    ]
  }
};
