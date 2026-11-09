# Audit Grammatica (§4.1) — Vergelijking `G2_LESSONS` (`lessons_v2.js`) vs. `01a_Grammaticaboek_Medina_methode_deel_1 (1).pdf`

## 1. Algemene bevindingen & structurele afwijkingen

De huidige grammatica- en lesdata in [`lessons_v2.js`](file:///c:/Users/Younes/Desktop/mufridat/lessons_v2.js) (`window.G2_LESSONS`, gegenereerd met de kopregel `/* Auto-bundled Medina Deel 1 (Les 0-23) + Madinah Arabic Reader 8 (Les 24) + Al-Manarah Examenstof */`) wijkt zowel **structureel** als **inhoudelijk** sterk af van het brondocument `01a_Grammaticaboek_Medina_methode_deel_1 (1).pdf` (vertaald door Mohammed Ahmad Khan, Uitgeverij al-Qalam, 99 pagina's):

1. **Samengevoegde deellessen (4a/4b, 9a/9b, 13a/13b/13c):**
   - In het grammaticaboek zijn **Les 4a** (blz. 21–24) en **Les 4b** (blz. 25–26), **Les 9a** (blz. 39–42) en **Les 9b** (blz. 43–44), en **Les 13a** (blz. 55–60), **Les 13b** (blz. 61–63) en **Les 13c** (blz. 64) aparte hoofdstukken met eigen uitleg en eigen woordenlijsten.
   - In `G2_LESSONS` zijn deze telkens op één hoop gegooid onder één lesnummer (`Les 4`, `Les 9`, `Les 13`), waarbij grote delen van de uitleg én tientallen woorden uit de woordenlijsten zijn weggevallen.
2. **Twee verschillende schrijfstijlen door elkaar (letterlijk vs. geparafraseerd + Al-Manarah examenstof):**
   - Slechts een klein aantal lessen in `G2_LESSONS` (**Les 0, 1, 2, 6, 11, 12, 16, 17**) volgt de Nederlandse brontekst van het boek grotendeels (zij het opgeknipt in verzonnen `steps` en aangevuld met extra theorie).
   - Alle overige lessen (**Les 3, 4, 5, 7, 8, 9, 10, 13, 14, 15, 18, 19, 20, 21, 22, 23**) zijn **volledig herschreven en samengevat** in een andere bewoording, met andere voorbeeldzinnen en gemengd met externe **Al-Manarah examenstof** (zoals zinsontledingstabellen voor *"Deel 7 van het examen"*, diptoten-theorie in Les 4, en bijvoeglijke naamwoorden al in Les 7 terwijl het boek dat pas in Les 9 behandelt).
3. **Structureel toegevoegde elementen in ELKE les die NIET in het grammaticaboek staan:**
   - **Verzonnen lestitels en `steps`-titels:** Het boek gebruikt uitsluitend `Les 1`, `Les 2`, `Les 4a`, etc. zonder ondertitels of stap-titels.
   - **Interactieve `drills` per stap (`mc`, `fill`, `order`, `transform`) en `parse` (iʿrāb-zinsontleding):** Geen enkele meerkeuzevraag, invuloefening of iʿrāb-ontledingsopdracht komt uit het grammaticaboek.
   - **`bookExercises` in `lessons_v2.js`:** Elke les in `lessons_v2.js` bevat een array `bookExercises` met het label `"Boekoefening blz. X"`. In werkelijkheid bevat het Nederlandstalige grammaticaboek **geen enkele oefening** (en ook geen sectie *"Vertaling van de vragen die in de oefeningssectie voorkomen"* — die komt pas in latere delen voor; Deel 1 bevat enkel grammatica-uitleg + woordenlijsten + een trefwoordenregister op blz. 94–99). De `bookExercises` in `lessons_v2.js` zijn verzonnen meerkeuze-, invul- en volgordevragen.
4. **Systematisch ontbrekende boekonderdelen:**
   - **Voetnoten (1 t/m 56 + woordenlijstvoetnoten `*`):** In de geparafraseerde lessen (Les 3–5, 7–10, 13–15, 18–23) zijn vrijwel alle 56 genummerde voetnoten én de `*`-voetnoten onderaan de woordenlijsten weggelaten. In Les 1, 2, 6, 11, 12 en 16 zijn voetnoten midden in de lopende tekst geplakt als `"Voetnoot X: ..."`.
   - **Fonetische transcripties:** Het boek geeft stelselmatig Nederlandse uitspraaktranscripties (`kitaaboe-n`, `al-bait-oe`, `fie l-bait-ie`, `oelaa-ieka`, etc.) om assimilatie, klinkerverkorters en naamvallen hoorbaar te maken. In `G2_LESSONS` ontbreken deze in bijna alle lessen vanaf Les 3.
   - **Kleurcodering van stamletters en uitgangen:** Het boek gebruikt rode, blauwe en paarse letters (bijv. in Les 4a, Les 13a blz. 57 en Les 16 blz. 74). In Les 16 kopieert `G2_LESSONS` zelfs blind de zin *"Opmerking: de rode letter representeert de eerste stamletter, de blauwe letter representeert de tweede stamletter en de paarse letter representeert de derde stamletter"*, terwijl de tekst in de app volledig ongekleurd is.
   - **Register (blz. 94–99):** Het zes pagina's tellende alfabetische trefwoordenregister achterin het grammaticaboek ontbreekt volledig.

---

## 2. Detailvergelijking per les (Les 0 t/m Les 24)

### Les 0 — Uitleg van bepaalde grammaticale termen en symbolen
1. **Paginaverwijzing in het boek:** Blz. 11 (`page_011.png`; blz. 12 is blanco).
2. **Ontbrekende onderdelen:**
   - Geen inhoudelijke tekstregels ontbreken; wel gebruikt het boek op blz. 11 een gestippelde cirkel `◌` onder/boven de klinkertekens, terwijl `G2_LESSONS` een tatweel/kashida `«ـَ»` gebruikt.
3. **Toegevoegde onderdelen (niet in het boek):**
   - Opgeknipt in 2 verzonnen `steps`: *"Klinkertekens: fathah, kasrah, dammah"* en *"Soekoen en shaddah"*.
   - **2 verzonnen samenvattingstabellen** (`['Naam', 'Teken', 'Klank']` en `['Naam', 'Teken', 'Betekenis']`).
   - **5 meerkeuze-`drills`** en een verzonnen **`bookExercises`-blok** met 5 meerkeuzevragen (*"Boekoefening blz. 11: Identificeer de juiste grammaticale term en klinkerteken"*), terwijl blz. 11 geen oefeningen bevat.
4. **Tekstverschillen:**
   - De 5 genummerde definities (1. Fathah t/m 5. Shaddah) komen verder woordelijk overeen met blz. 11.

---

### Les 1
1. **Paginaverwijzing in het boek:** Blz. 13 (`page_013.png`, uitleg) en blz. 14 (`page_014.png`, *Woordenlijst van les 1* met 24 woorden).
2. **Ontbrekende onderdelen:**
   - De tweekolomslay-out van het boek (links Nederlands, rechts Arabisch) voor de voorbeelden en de *"Voorbeeld:"*-vergelijking onderaan punt 4 (`هٰذَا بَيْتٌ. / Dit is een huis.` vs. `أَهٰذَا بَيْتٌ؟ / Is dit een huis?`).
3. **Toegevoegde onderdelen (niet in het boek):**
   - Verzonnen lestitel (`Les 1 · Nominale Zin & Aanwijzer هَذَا`) en 4 verzonnen `steps`-titels.
   - In Step 3 zijn 3 losse woorden als voorbeeldblokken (`EX`) toegevoegd (`كِتَابٌ`, `بَيْتٌ`, `مَسْجِدٌ`) met toegevoegde uitleg `"(onbepaald, eindigt op -oen)"`.
   - **Step 4 bevat 3 volledige alinea's verzonnen iʿrāb-theorie** die totaal niet in Les 1 van het boek staan: `الْجُمْلَةُ الاِسْمِيَّةُ (al-djoemlatoe l-ismiyyah)`, `إِعْرَاب (i'raab)`, `مُبْتَدَأ (moebtada')`, `مَبْنِيّ (mabnie)`, `خَبَر (khabar)`, `مَرْفُوع (marfoe')`, inclusief een `parse`-zinsontledingstaak.
   - **11 `drills`** en **3 verzonnen `bookExercises`** op "blz. 14" (blz. 14 is in werkelijkheid uitsluitend de woordenlijst).
4. **Tekstverschillen:**
   - Voetnoot 1 (`Het woord «هٰذَا» betekent: "dit" of "deze".`) is als platte tekstregel (`Voetnoot 1: ...`) midden in Step 2 geplakt.
   - In de titel staat `هَذَا` (met gewone fathah) i.p.v. `هٰذَا` (met dagger-alif zoals in het boek).

---

### Les 2
1. **Paginaverwijzing in het boek:** Blz. 15 (`page_015.png`, uitleg) en blz. 16 (`page_016.png`, *Woordenlijst van les 2* met 4 woorden).
2. **Ontbrekende onderdelen:** Geen grammaticapunten ontbreken.
3. **Toegevoegde onderdelen (niet in het boek):**
   - Verzonnen lestitel (`Les 2 · Aanwijzer ذَلِكَ (Dat) & Voegwoord وَ`) en 2 verzonnen `steps`-titels.
   - Extra los voorbeeld `وَذٰلِكَ مَسْجِدٌ -> En dat is een moskee.` in Step 2 (in het boek staat alleen de volledige zin `هٰذَا بَيْتٌ، وَذٰلِكَ مَسْجِدٌ.`).
   - **5 `drills`** en verzonnen **`bookExercises`**.
4. **Tekstverschillen:**
   - Voetnoot 2 (`Met andere woorden: er komt geen spatie na het woord «وَ».`) is als platte tekstregel in Step 2 geplakt.

---

### Les 3
1. **Paginaverwijzing in het boek:** Blz. 17–18 (`page_017.png`–`page_018.png`, uitleg), blz. 19 (`page_019.png`, overzichtstabel *De Maanletters en de Zonneletters*), en blz. 20 (`page_020.png`, *Woordenlijst van les 3* met 25 woorden + voetnoot `*`).
2. **Ontbrekende onderdelen:**
   - **De letterlijke Nederlandse uitleg van blz. 17–18** over hoe de 14 zonneletters met het puntje van de tong worden uitgesproken (voorbeelden `t`, `n`, `r`, `s` vs. maanletters `b`, `w`, `m`, `k`).
   - **De 4 fonetische assimilatievoorbeelden onderaan blz. 17:**
     - `اَلنَّجْمُ (al-Nadjmoe)` wordt `اَلنَّجْمُ (an-Nadjmoe)` "de ster"
     - `اَلرَّجُلُ (al-Radjoeloe)` wordt `اَلرَّجُلُ (ar-Radjoeloe)` "de man"
     - `اَلدِّيْكُ (al-Diekoe)` wordt `اَلدِّيْكُ (ad-Diekoe)` "de haan"
     - `اَلسَّمَكُ (al-Samakoe)` wordt `اَلسَّمَكُ (as-Samakoe)` "de vis"
   - **Voetnoot 3 op blz. 18** bij het Hamzatoel Wasl-teken `ٱ`: *"Merk op dat het niet verplicht is om dit teken boven de Hamzah te plaatsen. In dit boek zal dit teken ook niet telkens boven de Hamzah worden geplaatst."*
   - **De expliciete regel onderaan blz. 18:** *"Merk op dat wij in les 1 hebben geleerd dat de Tanwien hetzelfde betekent als het onbepaald lidwoord 'een', zoals: «بَيْتٌ» 'een huis'. Dit is echter niet van toepassing op bijvoeglijke naamwoorden, zoals «مَفْتُوْحٌ» 'open' en «مَكْسُوْرٌ» 'gebroken'."*
   - **De voetnoot onderaan de woordenlijst op blz. 20:** `* Het x-tekentje geeft aan dat de woorden op dezelfde regel elkaars antoniem zijn.`
3. **Toegevoegde onderdelen (niet in het boek):**
   - Volledig herschreven in **5 verzonnen `steps`**.
   - Verzonnen tabel in Step 1 met `كِتَابٌ`, `قَلَمٌ`, `جَمَلٌ`.
   - Tientallen voorbeeldzinnen uit het Arabische lesboek die NIET in de Nederlandse grammatica-uitleg van Les 3 staan (`الْوَلَدُ جَالِسٌ وَالْمُدَرِّسُ وَاقِفٌ`, `الْحِصَانُ كَبِيرٌ وَالْحِمَارُ صَغِيرٌ`, `النَّجْمُ بَعِيدٌ`, `السُّكَّرُ حُلْوٌ`, `الرَّجُلُ غَنِيٌّ`, `الْمَاءُ بَارِدٌ`, `التُّفَّاحُ لَذِيذٌ`).
   - In de tabel van blz. 19 zijn in Step 3 en 4 Nederlandse vertalingen achter alle 28 Arabische woorden geplakt die niet op blz. 19 staan.
   - **Step 5 (*"Zon & Maan in de Praktijk"*) is 100% verzonnen/externe examenstof** met woorden die nog helemaal niet in Les 1–3 zijn behandeld (`سُوقٌ`, `حَدِيقَةٌ`, `دَرَّاجَةٌ`, `كَعْبَةٌ`, `طَالِبٌ`, `سَيَّارَةٌ`).
   - **17 `drills`** (incl. `parse`) en verzonnen **`bookExercises`**.
4. **Tekstverschillen:**
   - Geen enkele zin in `G2_LESSONS[3]` gebruikt de originele tekst van blz. 17–18; alles is geparafraseerd.

---

### Les 4 (In het boek: Les 4a én Les 4b)
1. **Paginaverwijzing in het boek:**
   - **Les 4a:** Blz. 21–23 (`page_021.png`–`page_023.png`, uitleg) en blz. 24 (`page_024.png`, *Woordenlijst van les 4a* met 9 woorden).
   - **Les 4b:** Blz. 25 (`page_025.png`, uitleg) en blz. 26 (`page_026.png`, *Woordenlijst van les 4b* met 10 woorden).
2. **Ontbrekende onderdelen:**
   - **Splitsing 4a / 4b ontbreekt:** Beide deellessen zijn samengevoegd tot één les, waarbij de woordenlijst in `G2_LESSONS[4]` slechts **15 woorden** telt i.p.v. de **19 woorden** (9 + 10) in het boek.
   - **Alle 8 voetnoten uit Les 4a en 4b (Voetnoot 4 t/m 11) ontbreken:**
     - Voetnoot 4 (voorzetsel = `حَرْفُ جَرٍّ` / mv. `حُرُوْفُ الْجَرِّ`).
     - Voetnoot 5 (rood gemarkeerde uitgangen in de Arabische tekst en hun transcriptie).
     - Voetnoot 6 (uitspraakregel: lange klinker `fie` wordt verkort tot `fi` vóór een letter met Soekoen: `fiel-baitie -> fil-baitie`).
     - Voetnoot 7 (aankondiging dat in les 22 alle naamwoorden worden behandeld die geen Tanwien krijgen).
     - Voetnoot 8 & 9 (letterlijke betekenis van `ذَهَبَ` en `خَرَجَ` in de verleden tijd, in het Nederlands vaak vertaald als tegenwoordige tijd: *"Waar is Bilaal? Hij is naar de moskee gegaan."*).
     - Voetnoot 10 & 11 (uitleg bij `ذَهَبَ إِلَى الْمَسْجِدِ` vs. `ذَهَبَ بِلَالٌ إِلَى الْمَسْجِدِ`).
   - **Alle fonetische transcriptie-paren op blz. 21** (`al-bait-oe` -> `fie l-bait-ie`, `bait-oe-n` -> `fie bait-ie-n`, `al-maktab-oe` -> `'ala l-maktab-ie`).
   - **De volledige sectie *"Merk op:"* op blz. 23 (Les 4a):**
     1. Dat mannelijke eigennamen wel een Tanwien krijgen (`حَامِدٌ`, `بِلَالٌ`), maar dat dit natuurlijk niet "een Haamied" betekent.
     2. Dat vrouwelijke eigennamen géén Tanwien krijgen (`آمِنَةُ، زَيْنَبُ، فَاطِمَةُ` — *"Dus niet: `آمِنَةٌ، زَيْنَبٌ، فَاطِمَةٌ`"*). *(In `G2_LESSONS[4]` is dit vervangen door een verzonnen examen-stap over diptoten met `مَكَّةُ` en `مِصْرُ`!).*
   - **Punt 2 van Les 4b (blz. 25): Voornaamwoorden `أَنَا` ("ik", m/v: `أَنَا مُحَمَّدٌ.`, `أَنَا آمِنَةُ.`) en `أَنْتَ` ("jij", m. enk.: `مِنْ أَيْنَ أَنْتَ؟`).** Dit hele onderdeel uit Les 4b is volledig vergeten in `G2_LESSONS[4]`!
   - **De belangrijke grammaticale regel onderaan blz. 25 (Les 4b):** Dat in `ذَهَبَ` ("hij ging") het voornaamwoord "hij" vervalt zodra het onderwerp erachter wordt genoemd (`ذَهَبَ بِلَالٌ إِلَى الْمَسْجِدِ.` = "Bilaal ging naar de moskee", en dus niet *"Hij Bilaal ging"*).
   - **De opmerking in de woordenlijst van Les 4b (blz. 26):** Dat de Soekoen van `مِنْ` verandert in een Fathah (`مِنَ`) vóór `اَلْ` (`مِنَ الْبَيْتِ`).
3. **Toegevoegde onderdelen (niet in het boek):**
   - **Step 5 (*"Diptoten & Voorzetsel مَعَ"*) is 100% verzonnen examenstof:** Verwijst expliciet naar *"In het examen van Les 1 t/m 7 komen we ook vrouwelijke eigennamen en plaatsnamen tegen..."* en introduceert `مَكَّةُ`, `مِصْرُ`, het voorzetsel `مَعَ` (pas in Les 10 van het boek!), `الْفَلَّاحُ` en `الدَّجَاجَةُ`.
   - **15 `drills`** (incl. `parse`) en verzonnen **`bookExercises`**.
4. **Tekstverschillen:**
   - Volledig herschreven en samengevatte tekst; de voorbeeldzinnen in Step 2 en Step 3 wijken af van die op blz. 22 en blz. 25.

---

### Les 5
1. **Paginaverwijzing in het boek:** Blz. 27–28 (`page_027.png`–`page_028.png`, uitleg) en blz. 29 (`page_029.png`, *Woordenlijst van les 5* met 13 woorden).
2. **Ontbrekende onderdelen:**
   - **Voetnoten 12, 13 en 14** (over de letterlijke Engelse weergave *"Bilal's book"*, `Harf an-Nidaa' «حَرْفُ النِّدَاءِ»`).
   - **Punt 1c op blz. 27:** `«كِتَابُ مَنْ؟» "Wiens boek?" / "Het boek van wie?". Merk op dat «مَنْ» niet in de positie van genitief (Madjroer) staat, omdat het onverbuigbaar is; d.w.z. dat de klinker op de laatste letter niet verandert.`
   - **Punt 1d op blz. 27:** `«عَلَى مَكْتَبِ الْمُدَرِّسِ». Merk op dat «مَكْتَبِ» in de positie van genitief (Madjroer) staat vanwege het voorzetsel «عَلَى», en dat «الْمُدَرِّسِ» in de positie van genitief (Madjroer) staat omdat het Moedaaf Ilaih is.`
   - **De 5 originele voorbeelden met fonetische transcriptie bij punt 4 (`اِسْمٌ` en `اِبْنٌ`) op blz. 28:**
     - `اِسْمُ الْوَلَدِ بِلَالٌ، وَاسْمُ الْبِنْتِ آمِنَةُ.` (`ismoe l-waladie Bilaaloen, wasmoe l-bintie Aaminatoe`)
     - `اِبْنُ الْمُدَرِّسِ طَبِيْبٌ، وَابْنُ الْإِمَامِ تَاجِرٌ.` (`ibnoe l-moedarrisie tabieboen, wabnoe l-imaamie taadjiroen`)
     - `أَيْنَ ابْنُ حَامِدٍ؟` (`aina bnoe Haamidien?`)
3. **Toegevoegde onderdelen (niet in het boek):**
   - **Step 5 (*"Idāfah Zinnen & Ontleden"*) is 100% externe examenstof** met een tabel van 10 complexe zinnen (`قَمِيصُ الْوَلَدِ`, `حَقِيبَةُ الطَّالِبَةِ الْكَبِيرَةِ`, etc.) en vervroegde uitleg over voorzetselzinnen als `شِبْهُ جُمْلَةٍ`.
   - In Step 4 zijn de boekvoorbeelden voor `اِسْمٌ`/`اِبْنٌ` vervangen door andere zinnen over `خَالِدٌ`, `خَدِيجَةُ` en `مَحْمُودٌ`.
   - **17 `drills`** en verzonnen **`bookExercises`**.
4. **Tekstverschillen:**
   - Geheel geparafraseerd; gebruikt andere spelling (`Idāfah`, `muḍāf`, `muḍāf ilayh`, `ḥarf nidāʾ`, `munādā`) dan het boek (`Moedaaf`, `Moedaaf Ilaih`, `Harf an-Nidaa'`).

---

### Les 6
1. **Paginaverwijzing in het boek:** Blz. 30–32 (`page_030.png`–`page_032.png`, uitleg) en blz. 33 (`page_033.png`, *Woordenlijst van les 6* met 21 woorden + voetnoot `*`).
2. **Ontbrekende onderdelen:**
   - **De voetnoot onderaan de woordenlijst op blz. 33:** `* Dit woord is vrouwelijk.` bij `الْقِدْرُ *` ("de kookpot").
3. **Toegevoegde onderdelen (niet in het boek):**
   - Opgeknipt in 5 `steps` met verzonnen titels; voorbeelden van punt 2 (`مُدَرِّسٌ -> مُدَرِّسَةٌ` etc.) zijn omgezet in een extra tabel.
   - **15 `drills`** (incl. `parse`) en verzonnen **`bookExercises`**.
4. **Tekstverschillen:**
   - De lopende tekst van Les 6 volgt het boek vrijwel woordelijk, maar Voetnoot 15 (`Het woord «هٰذِهِ» betekent: "dit" of "deze".`) en Voetnoot 16 (`Je schrijft dus niet: «لِاللهِ».`) zijn als platte tekstregels midden in de stappen geplakt.

---

### Les 7
1. **Paginaverwijzing in het boek:** Blz. 34 (`page_034.png`, uitleg) en blz. 35 (`page_035.png`, *Woordenlijst van les 7* met 6 woorden).
2. **Ontbrekende onderdelen:**
   - De twee originele voorbeeldzinnen van blz. 34 (`هٰذَا بِلَالٌ، وَذٰلِكَ حَامِدٌ.` en `هٰذِهِ آمِنَةُ، وَتِلْكَ مَرْيَمُ.`) ontbreken (zijn vervangen door zinnen over een moskee/school en arts/verpleegster).
   - In de woordenlijst van `G2_LESSONS[7]` staan slechts **5 woorden** i.p.v. de **6 woorden** op blz. 35.
3. **Toegevoegde onderdelen (niet in het boek):**
   - **Meer dan 90% van `G2_LESSONS[7]` is verzonnen/externe examenstof!** In het boek bestaat Les 7 op blz. 34 uit exact **twee regels uitleg** (*"In deze les leren we «تِلْكَ» 'dat'. Dit is de vrouwelijke vorm van «ذٰلِكَ» 'dat'."*) plus twee voorbeeldzinnen.
   - In `G2_LESSONS[7]` zijn daar **5 uitgebreide stappen** van gemaakt:
     - Step 2 & Step 3: Verzonnen overzichtstabellen en beslissingsregels (*"De 4 Aanwijzers Vergeleken"*).
     - **Step 4 (*"Bijvoeglijk Naamwoord (Na't)"*):** Behandelt alvast `نَعْتٌ` en `مَنْعُوتٌ` omdat dat in het Al-Manarah examen van Les 1–7 zit, terwijl het boek dit pas in **Les 9a** introduceert!
     - **Step 5 (*"Complexe Zinsontleding (I'rāb)"*):** Een tabel met 14 zinnen speciaal voor *"Deel 7 van het examen (Les 1 t/m 7)"*.
   - **17 `drills`** en verzonnen **`bookExercises`**.
4. **Tekstverschillen:** Volledig herschreven.

---

### Les 8
1. **Paginaverwijzing in het boek:** Blz. 36–37 (`page_036.png`–`page_037.png`, uitleg) en blz. 38 (`page_038.png`, *Woordenlijst van les 8* met 8 woorden + voetnoot `*`).
2. **Ontbrekende onderdelen:**
   - **Eerste deel van punt 2 op blz. 36–37 (met Voetnoot 17):** De herhaling dat de uitgang `-oe` verandert in `-ie` na een voorzetsel én als Moedaaf Ilaih, met de 3 voorbeelden (`الْبَيْتُ جَمِيْلٌ.`, `بِلَالٌ فِي الْبَيْتِ.`, `هٰذَا مِفْتَاحُ الْبَيْتِ.`).
   - **De 3 originele voorbeelden met `أَمْرِيْكَا` op blz. 37:** `هٰذَا أَمْرِيْكَا.`, `أَنَا مِنْ أَمْرِيْكَا.`, `هُوَ رَئِيْسُ أَمْرِيْكَا.` (vervangen door verzonnen zinnen met `الْمُسْتَشْفَى`).
   - **Het volledige punt 4 op blz. 37 (met Voetnoot 18 en 19):** De introductie van het werkwoord `جَلَسَ` ("hij zat") met de voorbeelden `أَيْنَ جَلَسَ مُحَمَّدٌ؟` en `جَلَسَ أَمَامَ الْمُدَرِّسِ.`!
   - **De voetnoot onderaan de woordenlijst op blz. 38:** `* Merk op dat er geen stippen zijn onder de «ى» die als een Alief wordt uitgesproken. Dus «فِيْ» is fie en «عَلَى» is 'alaa.`
3. **Toegevoegde onderdelen (niet in het boek):**
   - Introduceert de grammaticale termen `بَدَل (badal - bijstelling)` en `ظَرْفُ مَكَانٍ`, die het Nederlandstalige grammaticaboek in Les 8 **niet** gebruikt.
   - Verzonnen vergelijkingstabel in Step 1 en **9 `drills`** + **`bookExercises`**.
4. **Tekstverschillen:** Volledig herschreven en geparafraseerd.

---

### Les 9 (In het boek: Les 9a én Les 9b)
1. **Paginaverwijzing in het boek:**
   - **Les 9a:** Blz. 39–41 (`page_039.png`–`page_041.png`, uitleg) en blz. 42 (`page_042.png`, *Woordenlijst van les 9a* met 15 woorden).
   - **Les 9b:** Blz. 43 (`page_043.png`, uitleg) en blz. 44 (`page_044.png`, *Woordenlijst van les 9b* met 12 woorden).
2. **Ontbrekende onderdelen:**
   - **Splitsing 9a / 9b ontbreekt:** Samengevoegd tot één les; de woordenlijst in `G2_LESSONS[9]` bevat slechts **18 woorden** i.p.v. de **27 woorden** (15 + 12) in het boek (**9 woorden ontbreken!**).
   - **De gestructureerde voorbeelden per overeenkomstpunt (a. Geslacht, b. Bepaald of onbepaald, c. Naamval met transcripties, d. Aantal met enkelvoud/tweevoud/meervoud `مُدَرِّسٌ جَدِيْدٌ / مُدَرِّسَانِ جَدِيْدَانِ / مُدَرِّسُوْنَ جُدُدٌ`) op blz. 39–40.**
   - **Het onderscheid bij `الَّذِيْ` op blz. 43 (Les 9b):** Dat `الَّذِيْ` voor een mens *"die", "dat", "wie"* betekent en voor een dier of ding *"die", "dat", "welk"*.
   - **Punt 3 van Les 9b (blz. 43):** `Merk op dat wanneer «لِ» voor een zelfstandig naamwoord komt die «اَلْ» heeft, de Hamzah van «اَلْ» wegvalt:` `اَلْإِمَامُ -> لِلْإِمَامِ`, `اَلْمُدَرِّسُ -> لِلْمُدَرِّسِ`.
3. **Toegevoegde onderdelen (niet in het boek):**
   - Voegt Arabische vaktermen toe die niet in het boek staan (`صِفَة`, `فَعْلَانُ`, `مَمْنُوعٌ مِنَ الصَّرْفِ` — in het boek pas in Les 22 genoemd! —, `الِاسْمُ الْمَوْصُولُ`, `صِلَةُ الْمَوْصُولِ`, `ظَرْف`).
   - Verzonnen voorbeeldzinnen in de tabel van Step 2 (`أَنَا لَسْتُ بِكَسْلَانَ` met `لَسْتُ` dat pas in Deel 2 wordt geleerd!).
   - **10 `drills`** en verzonnen **`bookExercises`**.
4. **Tekstverschillen:** Volledig herschreven en samengevat.

---

### Les 10
1. **Paginaverwijzing in het boek:** Blz. 45–48 (`page_045.png`–`page_048.png`, uitleg met 9 genummerde punten) en blz. 49 (`page_049.png`, *Woordenlijst van les 10* met 5 woorden).
2. **Ontbrekende onderdelen (zeer ernstig — bijna de helft van Les 10 ontbreekt!):**
   - **Uit punt 1 (blz. 45):** De fonetische uitleg waarom `كِتَابِيْ` (`kitaab-ie`) geen `-oe-` meer heeft (`kitaab-oe-ie -> kitaab-ie`).
   - **Uit punt 2 (blz. 46):** Dat `أَبٌ` en `أَخٌ` óók een extra Waaw `و` krijgen wanneer ze Moedaaf zijn vóór een zelfstandig naamwoord (`أَبُوْ مُحَمَّدٍ`, `أَخُوْ مُحَمَّدٍ`), én de vermelding dat er in het Arabisch **vijf zulke woorden** zijn waarvan je er nu twee leert.
   - **Uit punt 4 (blz. 46):** Dat het voorzetsel `لِ` een **Fathah** krijgt wanneer het gekoppeld wordt aan een bezittelijk voornaamwoord (`لَكَ` "voor jou", `لَهُ` "voor hem", `لَهَا` "voor haar"), maar een **Kasrah** bij `لِيْ` ("voor mij"), én dat `لِيْ` ook voor lichaamsdelen wordt gebruikt (`لِيْ فَمٌ` "Ik heb een mond") omdat relaties en lichaamsdelen niet scheidbaar zijn van de persoon.
   - **Voetnoten 20, 21, 22 en 23** (blz. 47).
   - **Volledig Punt 6 (blz. 47) ontbreekt:** Dat vrouwelijke eigennamen (`آمِنَةُ`, `مَرْيَمُ`) én **mannelijke eigennamen die eindigen op een Taa' Marboetah `ة`** (`مُعَاوِيَةُ`, `أُسَامَةُ`, `حَمْزَةُ`) géén Tanwien krijgen!
   - **Volledig Punt 7 (blz. 47–48) ontbreekt:** Het betekenisverschil tussen `عِنْدَ` en `مَعَ`: `الْمُدَرِّسُ عِنْدَ الْمُدِيْرِ` betekent dat de leraar *bij de directeur in zijn kantoor* is, terwijl `الْمُدَرِّسُ مَعَ الْمُدِيْرِ` betekent dat de leraar *met de directeur* is op elke willekeurige plek (en dat het znw na `مَعَ` op `-ie` eindigt).
   - **Volledig Punt 8 (blz. 48) ontbreekt:** `بِالْجَامِعَةِ` ("in de universiteit"): uitleg van het voorzetsel `بِ` ("bij" of "in") en het voorbeeld `الْجَامِعَةُ الْإِسْلَامِيَّةُ بِالْمَدِيْنَةِ الْمُنَوَّرَةِ` ("De Islamitische Universiteit in Medina").
   - **Volledig Punt 9 (blz. 48) ontbreekt:** Dat `مَا` in les 1 voor "wat" werd gebruikt, maar hier een **ontkennend partikel** is: `مَا عِنْدِيْ سَيَّارَةٌ.` ("Ik heb geen auto.").
3. **Toegevoegde onderdelen (niet in het boek):**
   - Verzonnen vaktermen (`ضَمَائِرُ الْمِلْكِيَّةِ الْمُتَّصِلَةُ`, `الْأَسْمَاءُ الْخَمْسَةُ`, `الْفِعْلُ الْمَاضِي`), **10 `drills`** en verzonnen **`bookExercises`**.
4. **Tekstverschillen:** Volledig herschreven en ingekort van 9 punten naar 4 stappen.

---

### Les 11
1. **Paginaverwijzing in het boek:** Blz. 50–51 (`page_050.png`–`page_051.png`, uitleg; Les 11 heeft in het grammaticaboek géén aparte woordenlijst-pagina).
2. **Ontbrekende onderdelen:** Geen grammaticapunten ontbreken.
3. **Toegevoegde onderdelen (niet in het boek):**
   - Opgeknipt in 4 `steps` met verzonnen titels; 5 woorden toegevoegd aan `vocab`; **11 `drills`** (incl. `parse`) en verzonnen **`bookExercises`**.
4. **Tekstverschillen:**
   - De tekst volgt blz. 50–51 woordelijk, maar Voetnoten 24, 25 en 26 zijn als platte tekstregels (`Voetnoot 24: ...`) midden in Step 3 en Step 4 geplakt.

---

### Les 12
1. **Paginaverwijzing in het boek:** Blz. 52–53 (`page_052.png`–`page_053.png`, uitleg) en blz. 54 (`page_054.png`, *Woordenlijst van les 12* met 24 items).
2. **Ontbrekende onderdelen:** Geen grammaticapunten ontbreken.
3. **Toegevoegde onderdelen (niet in het boek):**
   - Opgeknipt in 6 `steps` met verzonnen titels; **13 `drills`** (incl. `parse`) en verzonnen **`bookExercises`**.
4. **Tekstverschillen:**
   - De tekst volgt blz. 52–53 woordelijk, maar Voetnoten 27 t/m 31 zijn als platte tekstregels (`Voetnoot 27: ...`) in de stappen geplakt.

---

### Les 13 (In het boek: Les 13a, Les 13b én Les 13c)
1. **Paginaverwijzing in het boek:**
   - **Les 13a:** Blz. 55–59 (`page_055.png`–`page_059.png`, uitleg) en blz. 60 (`page_060.png`, *Woordenlijst van les 13a* met 18 woorden).
   - **Les 13b:** Blz. 61–62 (`page_061.png`–`page_062.png`, uitleg) en blz. 63 (`page_063.png`, *Woordenlijst van les 13b* met 7 woorden + voetnoot `*`).
   - **Les 13c:** Blz. 64 (`page_064.png`, uitleg; geen aparte woordenlijst).
2. **Ontbrekende onderdelen (zeer ernstig — 10 pagina's boektekst gereduceerd tot 3 korte stappen!):**
   - **Splitsing 13a / 13b / 13c ontbreekt:** Alles is samengevoegd in één les; de woordenlijst in `G2_LESSONS[13]` telt slechts **11 woorden** i.p.v. de **25 woorden** (18 + 7) in het boek (**14 woorden ontbreken!**), plus de voetnoot op blz. 63 (`* Dit is het meervoud van een andere stam.` bij `النِّسَاءُ (v. اِمْرَأَةٌ)`).
   - **De volledige tabel met de 8 patronen van het gebroken meervoud op blz. 57 (Les 13a) ontbreekt:**
     1. `فُعُوْلٌ` (`نَجْمٌ -> نُجُوْمٌ`)
     2. `فُعُلٌ` (`كِتَابٌ -> كُتُبٌ`)
     3. `فِعَالٌ` (`جَبَلٌ -> جِبَالٌ`)
     4. `فُعَّالٌ` (`تَاجِرٌ -> تُجَّارٌ`)
     5. `أَفْعَالٌ` (`قَلَمٌ -> أَقْلَامٌ`)
     6. `فُعَلَاءُ` (`زَمِيْلٌ -> زُمَلَاءُ`)
     7. `أَفْعِلَاءُ` (`صَدِيْقٌ -> أَصْدِقَاءُ`)
     8. `فِعْلَةٌ` (`أَخٌ -> إِخْوَةٌ`)
     Inclusief de uitleg van de gekleurde stamletters (rood = 1e, blauw = 2e, paars = 3e stamletter) en het ontbreken van Tanwien bij patroon 6 en 7!
   - **De Nederlandse vergelijking op blz. 55** tussen ongebroken meervoud (*Boek -> Boeken*) en gebroken meervoud (*Epos -> Epen*, *Genius -> Genieën*).
   - **De bezittelijke voornaamwoorden `ـهُمْ` ("hun" m. mv., blz. 58) en `ـهُنَّ` ("hun" vr. mv., blz. 61)** met de voorbeelden (`أَيْنَ بَيْتُهُمْ؟`, `أَبُوْهُمْ تَاجِرٌ شَهِيْرٌ.`, `هُنَّ زَمِيْلَاتِيْ، وَهٰذَا بَيْتُهُنَّ.`) én de opmerking dat het voornaamwoord voor *"zij"* en *"hun"* dezelfde vorm (`هُمْ` resp. `هُنَّ`) heeft!
   - **De spellingsregel op blz. 58 (punt 4) bij `ذَهَبُوْا`** (met Voetnoten 32–33): *"Merk op dat er aan het eind van het woord een Alief staat die niet uitgesproken wordt."*
   - **Volledig Punt 5 van Les 13a (blz. 59) ontbreekt:** Het gebruik van `بَعْضٌ` ("sommige(n)", "enkele(n)"): `بَعْضُهُمْ مُدَرِّسُوْنَ، وَبَعْضُهُمْ مُهَنْدِسُوْنَ.` ("Sommigen van hen zijn leraren en sommigen van hen zijn ingenieurs.").
   - **Punt 4 van Les 13b (blz. 62):** De fonetische uitleg van `-at-oe-n` -> `-aat-oe-n` en de 3 onregelmatige vrouwelijke meervouden (`بِنْتٌ -> بَنَاتٌ`, `أُخْتٌ -> أَخَوَاتٌ`, `فَتَاةٌ -> فَتَيَاتٌ`).
   - **De uitspraakregel van Les 13c (blz. 64):** Dat in `أُولٰئِكَ` (`oelaa-ieka`) de Waaw `و` **niet** wordt uitgesproken!
3. **Toegevoegde onderdelen (niet in het boek):**
   - Verzonnen vaktermen (`جَمْعُ الْمُذَكَّرِ السَّالِمُ`, `جَمْعُ الْمُؤَنَّثِ السَّالِمُ`, `جَمْعُ التَّكْسِيرِ`, `الْعَاقِلُ`), **8 `drills`** en verzonnen **`bookExercises`**.
4. **Tekstverschillen:** Volledig herschreven en sterk uitgekleed.

---

### Les 14
1. **Paginaverwijzing in het boek:** Blz. 65–68 (`page_065.png`–`page_068.png`, uitleg met 7 genummerde punten) en blz. 69 (`page_069.png`, *Woordenlijst van les 14* met 21 woorden).
2. **Ontbrekende onderdelen (zeer ernstig):**
   - **In de woordenlijst van `G2_LESSONS[14]` staan slechts 11 woorden i.p.v. 21 woorden** op blz. 69 (**10 woorden ontbreken!**).
   - **Het uitspraakverschil op blz. 66 (punt 4, met Voetnoten 36–41):** Dat `"zij gingen"` (vr. mv.) `ذَهَبْنَ` (`dhahabna`, korte "a") is en `"wij gingen"` `ذَهَبْنَا` (`dhahabnaa`, lange "a").
   - **De cruciale uitzonderingsregel op blz. 67 (punt 5, plus Voetnoot 43):**
     - Voetnoot 43 met de overige niet-Arabische namen (`إِدْرِيْسُ`, `يُوْنُسُ`, `دَاوُدُ`, `سُلَيْمَانُ`, `أَيُّوْبُ`, `فِرْعَوْنُ`, `إِصْطَنْبُوْلُ`, `مِيْكَائِيْلُ`, `جِبْرَائِيْلُ`).
     - **De 3-letterregel op blz. 67:** *"Maar als een niet-Arabische eigennaam mannelijk is én slechts uit drie letters bestaat waarbij de tweede letter Saakien is, dan krijgt het wel een Tanwien."* Met de 4 voorbeelden: `خَانٌ` ("Khan"), `جُرْجٌ` ("George"), `لُوْطٌ` ("Loet"), `نُوْحٌ` ("Noeh")!
   - **Volledig Punt 6 (blz. 67–68) ontbreekt:** Dat de Moedaaf bepaald is door zijn positie, waardoor een bijvoeglijk naamwoord dat bij de Moedaaf hoort **bepaald** (`اَلْ`) moet zijn én **achter de Moedaaf Ilaih** komt:
     - `بَيْتُ الْإِمَامِ الْجَدِيْدُ` ("Het nieuwe huis van de imam" — `-oe` op `الْجَدِيْدُ` omdat `بَيْتُ` Marfoe' is)
     - vs. `بَيْتُ الْإِمَامِ الْجَدِيْدِ` ("Het huis van de nieuwe imam" — `-ie` op `الْجَدِيْدِ` omdat `الْإِمَامِ` Madjroer is)
     - en met een bezittelijk voornaamwoord: `بَيْتُهُ الْجَدِيْدُ` ("Zijn nieuwe huis", en dus niet `بَيْتُهُ جَدِيْدٌ`, want dat betekent *"Zijn huis is nieuw."*).
   - **De accusatiefvorm van `أَيُّ` op blz. 68 (punt 7):** `أَيَّ لُغَةٍ تُحِبُّ؟` ("Welke taal heb jij lief?", met Fathah op `أَيَّ` omdat het lijdend voorwerp is).
3. **Toegevoegde onderdelen (niet in het boek):**
   - **7 `drills`** en verzonnen **`bookExercises`**.
4. **Tekstverschillen:** Volledig herschreven en samengevat.

---

### Les 15
1. **Paginaverwijzing in het boek:** Blz. 70–71 (`page_070.png`–`page_071.png`, uitleg) en blz. 72 (`page_072.png`, *Woordenlijst van les 15* met 5 woorden).
2. **Ontbrekende onderdelen:**
   - **Punt 5 op blz. 71 (met Voetnoten 49–51):** De expliciete behandeling van het werkwoord `رَجَعَ` ("hij keerde terug") met de voorbeelden `أَرَجَعَ الْإِمَامُ مِنَ الْمَسْجِدِ؟` en `ذَهَبْتُ إِلَى الْمَسْجِدِ قَبْلَ الْأَذَانِ وَرَجَعْتُ بَعْدَ الصَّلَاةِ.`.
   - Voetnoten 45 t/m 48 (over `ذَهَبْتُنَّ`).
3. **Toegevoegde onderdelen (niet in het boek):**
   - Verzonnen overzichtstabel van alle 2e-persoonsvormen in Step 1, **6 `drills`** en verzonnen **`bookExercises`**.
4. **Tekstverschillen:** Volledig herschreven; de voorbeeldzinnen uit het boek (`أَيْنَ ذَهَبْتُنَّ يَا أَخَوَاتُ؟`, `أَيْنَ بَيْتُكُنَّ يَا بَنَاتُ؟`, `مَتَى ذَهَبْتَ إِلَى الْمَدْرَسَةِ؟`) zijn vervangen door andere zinnen.

---

### Les 16
1. **Paginaverwijzing in het boek:** Blz. 73–74 (`page_073.png`–`page_074.png`, uitleg) en blz. 75 (`page_075.png`, *Woordenlijst van les 16* met 4 woorden).
2. **Ontbrekende onderdelen:**
   - **De daadwerkelijke kleurcodering (rood/blauw/paars) op blz. 74** bij het patroon `مَفَاعِلُ` (`مَسْجِدٌ -> مَسَاجِدُ`, `دَفْتَرٌ -> دَفَاتِرُ`, `فُنْدُقٌ -> فَنَادِقُ`, `مَكْتَبٌ -> مَكَاتِبُ`). De app neemt de opmerking over de rode, blauwe en paarse letter wel letterlijk over in Step 5, maar toont alle letters in één kleur!
3. **Toegevoegde onderdelen (niet in het boek):**
   - Opgeknipt in 5 `steps` met verzonnen titels; de voorbeelden van rationeel vs. irrationeel zijn in Step 2 en Step 3 dubbel opgenomen (zowel als tekst/voorbeeld als in een tabel); **13 `drills`** en verzonnen **`bookExercises`**.
4. **Tekstverschillen:**
   - Volgt de boektekst woordelijk; Voetnoten 52 en 53 zijn als platte tekstregels in Step 3 geplakt.

---

### Les 17
1. **Paginaverwijzing in het boek:** Blz. 76 (`page_076.png`, uitleg) en blz. 77 (`page_077.png`, *Woordenlijst van les 17* met 5 woorden).
2. **Ontbrekende onderdelen:** Geen.
3. **Toegevoegde onderdelen (niet in het boek):**
   - Verzonnen lestitel en staptitel, **3 `drills`** en verzonnen **`bookExercises`**.
4. **Tekstverschillen:** De 3 zinnen in Step 1 komen woordelijk overeen met blz. 76.

---

### Les 18
1. **Paginaverwijzing in het boek:** Blz. 78–79 (`page_078.png`–`page_079.png`, uitleg) en blz. 80 (`page_080.png`, *Woordenlijst van les 18* met 9 woorden + voetnoot `*`).
2. **Ontbrekende onderdelen:**
   - **De opmerking op blz. 79 (met Voetnoot 54):** *"Merk op dat het bijvoeglijk naamwoord dat een tweevoud beschrijft ook in het tweevoud staat."* (bij `هٰذَانِ طَالِبَانِ جَدِيْدَانِ.` en `هَاتَانِ طَالِبَتَانِ جَدِيْدَتَانِ.`).
   - **De volledige spel- en uitspraakregel onderaan blz. 79 over de accusatief-Alief:**
     *"Merk op dat een naamwoord met een Tanwien in de positie van accusatief (Mansoeb) een Alief krijgt die niet uitgesproken wordt als je doorleest. Indien je stopt op dat woord, dan spreek je het woord wel met de Alief uit, zonder de Tanwien. Voorbeeld: `كِتَابٌ - كِتَابٍ - كِتَابًا`. Maar een naamwoord dat eindigt op een Taa' Marboetah «ة» krijgt deze Alief niet. Voorbeeld: `سَيَّارَةٌ - سَيَّارَةٍ - سَيَّارَةً`."*
   - **De voetnoot onderaan de woordenlijst op blz. 80:** `* Merk op dat de letter Kaaf «ك» in het enkelvoud een Soekoen heeft en in het meervoud een Fathah.` bij `الرَّكْعَةُ (mv. رَكَعَاتٌ)`.
3. **Toegevoegde onderdelen (niet in het boek):**
   - Introduceert termen als `الْمُثَنَّى` en `تَمْيِيزٌ مَنْصُوبٌ` (niet in het boek), verzonnen tabellen, **8 `drills`** en verzonnen **`bookExercises`**.
4. **Tekstverschillen:** Volledig herschreven; de originele voorbeeldzinnen op blz. 78–79 zijn grotendeels vervangen.

---

### Les 19
1. **Paginaverwijzing in het boek:** Blz. 81–82 (`page_081.png`–`page_082.png`, uitleg) en blz. 83 (`page_083.png`, *Woordenlijst van les 19* met 17 woorden).
2. **Ontbrekende onderdelen (zeer ernstig — teruggebracht tot slechts 1 stap!):**
   - **In de woordenlijst van `G2_LESSONS[19]` staan slechts 11 woorden i.p.v. 17 woorden** op blz. 83 (**6 woorden ontbreken!**).
   - **Bullet 1 en Bullet 2 op blz. 81 ontbreken volledig:**
     - Dat het getal 1 (`وَاحِدٌ`) het naamwoord opvolgt als een bijvoeglijk naamwoord: `كِتَابٌ وَاحِدٌ` ("één boek").
     - Dat het getal 2 (`اِثْنَانِ`) het naamwoord óók opvolgt als een bijvoeglijk naamwoord (`كِتَابَانِ اثْنَانِ` "twee boeken"), maar meestal wordt weggelaten omdat het tweevoud al voldoende is en `اِثْنَانِ` alleen voor benadrukking wordt gebruikt.
   - **De uitleg en 3 voorbeelden op blz. 82** dat het getal zelf (3 t/m 10) in elke naamval kan staan afhankelijk van de zinsfunctie:
     - Nominatief: `خَرَجَ ثَلَاثَةُ طُلَّابٍ.` ("Er gingen drie studenten naar buiten.")
     - Genitief: `فِيْ أَرْبَعَةِ بُيُوْتٍ.` ("In vier huizen.")
     - Accusatief: `رَأَيْتُ خَمْسَةَ رِجَالٍ.` ("Ik zag vijf mannen.")
   - **De tweede *"Merk op"* op blz. 82 (met Voetnoot 55) ontbreekt volledig:**
     *"Merk op dat er in de zin «كَمْ ثَمَنُ هٰذَا؟» 'Wat is de prijs van dit?' een weglating is. Het woord dat is weggelaten is «رِيَالًا», of elk ander woord dat een munteenheid aanduidt. De volledige zin is dus: «كَمْ رِيَالًا ثَمَنُ هٰذَا؟»."*
3. **Toegevoegde onderdelen (niet in het boek):**
   - **4 `drills`** en verzonnen **`bookExercises`**.
4. **Tekstverschillen:** Volledig herschreven en gehalveerd.

---

### Les 20
1. **Paginaverwijzing in het boek:** Blz. 84–85 (`page_084.png`–`page_085.png`, uitleg) en blz. 86 (`page_086.png`, *Woordenlijst van les 20* met 7 woorden).
2. **Ontbrekende onderdelen (zeer ernstig — teruggebracht tot slechts 1 stap!):**
   - **De twee cruciale uitspraak-/vokalisatieregels onderaan blz. 84 ontbreken volledig:**
     1. *"Merk op dat «ثَمَانِيْ» een Soekoen heeft op de laatste letter."* (bij `ثَمَانِيْ بَنَاتٍ`).
     2. *"Merk op dat «عَشَرَةُ» een Fathah heeft op de Shien «ش» en «عَشْرُ» een Soekoen."* (`عَشَرَةُ رِجَالٍ` met `شَ` vs. `عَشْرُ نِسَاءٍ` met `شْ`!).
   - **De volledige blz. 85 ontbreekt:**
     *"De vrouwelijke vorm van «وَاحِدٌ» is: «وَاحِدَةٌ». En de vrouwelijke vorm van «اِثْنَانِ» is: «اِثْنَتَانِ». Voorbeelden: `لِيْ أُخْتٌ وَاحِدَةٌ.` 'Ik heb één zus.' / `لِيْ أُخْتَانِ اثْنَتَانِ.` 'Ik heb twee zussen.'"*
3. **Toegevoegde onderdelen (niet in het boek):**
   - **4 `drills`** en verzonnen **`bookExercises`**.
4. **Tekstverschillen:** Volledig herschreven; de vergelijkende tabel van blz. 84 (`ثَلَاثُ بَنَاتٍ` vs. `ثَلَاثَةُ أَبْنَاءٍ` t/m 8) is vervangen door een tabel met `طَالِبَاتٍ`, `غُرَفٍ`, `سَيَّارَاتٍ`, `أَخَوَاتٍ`, `بَقَرَاتٍ`, `مَجَلَّاتٍ`.

---

### Les 21
1. **Paginaverwijzing in het boek:** Blz. 87 (`page_087.png`, uitleg) en blz. 88 (`page_088.png`, *Woordenlijst van les 21* met 6 woorden).
2. **Ontbrekende onderdelen:**
   - Op blz. 87 staat expliciet: *"Dit is een oefenles. Het bevat geen nieuwe constructie. Er komen zes nieuwe woorden in voor. Deze zijn:"* gevolgd door de toelichting op die 6 woorden (`ذَاكَ` = hetzelfde als `ذٰلِكَ`, `وَاسِعٌ`, `آسِيَا`, `اللَّوْنُ (mv. أَلْوَانٌ)`, `نُحِبُّ`, `نُحِبُّهُ`). Deze toelichting (met name dat `ذَاكَ` synoniem is aan `ذٰلِكَ` en de ontleding van `نُحِبُّهُ`) ontbreekt in de staptekst van `G2_LESSONS[21]`.
3. **Toegevoegde onderdelen (niet in het boek):**
   - Vervangen door een verzonnen *"Tekstanalyse: مَدْرَسَتِي"* met 3 zinnen uit het Arabische tekstboek, **4 `drills`** en verzonnen **`bookExercises`** (en 8 woorden in `vocab` i.p.v. 6).
4. **Tekstverschillen:** Volledig herschreven.

---

### Les 22
1. **Paginaverwijzing in het boek:** Blz. 89–90 (`page_089.png`–`page_090.png`, uitleg) en blz. 91 (`page_091.png`, *Woordenlijst van les 22* met 14 woorden).
2. **Ontbrekende onderdelen (zeer ernstig):**
   - **De opening op blz. 89 (de 3 gevallen waarin een normaal woord geen Tanwien krijgt) ontbreekt:**
     - a. Wanneer het `اَلْ` heeft (`كِتَابٌ -> الْكِتَابُ`)
     - b. Wanneer het Moedaaf is (`كِتَابٌ -> كِتَابُ بِلَالٍ`)
     - c. Wanneer het vooraf wordt gegaan door `يَا` (`أُسْتَاذٌ -> يَا أُسْتَاذُ`)
   - **Groep 4 van de 8 diptotengroepen in het boek (blz. 89) is weggelaten in de tabel van `G2_LESSONS[22]`:**
     - Het boek onderscheidt **8 groepen** op blz. 89–90. `G2_LESSONS[22]` noemt zijn stap *"De 7 Groepen Diptoten"* en laat **Groep 4 (`Bijvoeglijke naamwoorden conform het patroon فَعْلَانُ, zoals: كَسْلَانُ ، مَلْآنُ`)** weg uit de tabel!
   - **In Groep 8 (gebroken meervoudspatronen, blz. 90) zijn 2 van de 4 patronen weggelaten:**
     - Het boek geeft **4 patronen**:
       - a) `أَفْعِلَاءُ` (`أَصْدِقَاءُ ، أَغْنِيَاءُ ، أَقْوِيَاءُ`)
       - b) `فُعَلَاءُ` (`فُقَرَاءُ ، زُمَلَاءُ ، وُزَرَاءُ`)
       - c) `مَفَاعِلُ` (`مَسَاجِدُ ، فَنَادِقُ ، مَكَاتِبُ`)
       - d) `مَفَاعِيْلُ` (`مَنَادِيْلُ ، مَفَاتِيْحُ ، فَنَاجِيْنُ`)
     - `G2_LESSONS[22]` noemt in zijn tabel rij 7 **uitsluitend** `مَفَاعِلُ` en `مَفَاعِيلُ` en laat `أَفْعِلَاءُ` en `فُعَلَاءُ` volledig weg!
   - **De belangrijke morfologische regel onderaan blz. 90 ontbreekt volledig:**
     *"Merk op dat «أَطِبَّاءُ» oorspronkelijk «أَطْبِبَاءُ» is, conform het patroon: «أَفْعِلَاءُ». De vorm is enigszins gewijzigd vanwege de assimilatie van de twee Baa's."*
3. **Toegevoegde onderdelen (niet in het boek):**
   - Haalt de genitiefregel met Fathah (die in het boek pas het onderwerp van **Les 23** is!) al naar voren in Step 1 van Les 22.
   - **6 `drills`** en verzonnen **`bookExercises`**.
4. **Tekstverschillen:** Volledig herschreven.

---

### Les 23
1. **Paginaverwijzing in het boek:** Blz. 92 (`page_092.png`, uitleg) en blz. 93 (`page_093.png`, *Woordenlijst van les 23* met 3 woorden: `إِصْطَنْبُوْلُ`, `الطَّائِفُ`, `وَاشِنْطُنُ`).
2. **Ontbrekende onderdelen:**
   - De originele vergelijkingstabel op blz. 92 met `بِلَالٌ`, `أَحْمَدُ` en `إِبْرَاهِيْمُ` onder `Madjroer vanwege Harf Djarr` (`إِلَى بِلَالٍ / إِلَى أَحْمَدَ / إِلَى إِبْرَاهِيْمَ`) en `Madjroer vanwege Moedaaf Ilaih` (`كِتَابُ بِلَالٍ / كِتَابُ أَحْمَدَ / كِتَابُ إِبْرَاهِيْمَ`).
3. **Toegevoegde onderdelen (niet in het boek):**
   - **Step 2 (*"Wanneer toch Kasrah?"* — diptoten met `الْـ` of als `muḍāf` zoals `فِي الْمَسَاجِدِ` en `فِي مَسَاجِدِ الْمَدِينَةِ`) staat NIET in Les 23 van het Nederlandstalige grammaticaboek!**
   - **5 `drills`** en verzonnen **`bookExercises`**.
4. **Tekstverschillen:** Volledig herschreven; tabelvoorbeelden zijn vervangen door `مِنْ بَيْتٍ / مِنْ مَكَّةَ`, `كِتَابُ عُثْمَانَ`, `فِي مَسَاجِدَ`.

---

### Aparte opmerking: Les 24 ("Madinah Arabic Reader 8")
- **Status:** In `G2_LESSONS["24"]` staat een volledige extra les getiteld `Les 24 · Madinah Arabic Reader 8 · الْمَفْعُولُ فِيهِ (الظُّرُوف) · الظُّرُوفُ الْمَبْنِيَّةُ · لَوْ الشَّرْطِيَّةُ · مِنْ قَبْلُ (pages=3-14)`.
- Deze les komt **geheel niet voor** in `01a_Grammaticaboek_Medina_methode_deel_1 (1).pdf` (dat eindigt na Les 23 op blz. 93, gevolgd door het Register op blz. 94–99) en ook **niet** in `Madina_Book1_Arabic_Text.pdf` (dat eveneens eindigt na Les 23). Het betreft lesstof uit *Madinah Arabic Reader Book 8* (overeenkomend met Medina Deel 3/4).

---

## 3. Conclusie & Advies (§4.1): Waarom volledig opnieuw opbouwen vanuit de PDF betrouwbaarder is dan lappen

Op basis van deze audit is **het patchen ("lappen") van het bestaande `lessons_v2.js` sterk af te raden**, en is een **schone, volledige heropbouw rechtstreeks vanuit `01a_Grammaticaboek_Medina_methode_deel_1 (1).pdf`** de enige betrouwbare route:

1. **16 van de 24 lessen zijn geen brontekst maar vrije samenvattingen:**
   In Les 3, 4, 5, 7, 8, 9, 10, 13, 14, 15, 18, 19, 20, 21, 22 en 23 is niet slechts hier en daar een zin vergeten, maar is de originele Nederlandse vertaling van Mohammed Ahmad Khan compleet vervangen door een geparafraseerde samenvatting met andere terminologie, andere voorbeelden en een andere volgorde. Patchen zou betekenen dat die 16 lessen alsnog regel voor regel herschreven moeten worden.
2. **Structurele vermenging met externe examenstof (Al-Manarah) en verzonnen theorie:**
   Door de hele dataset heen zijn lesonderwerpen uit latere lessen of externe cursussen door de lessen verweven (iʿrāb-theorie in Les 1, examenwoorden in Les 3, diptoten en `مَعَ` in Les 4, 10-rijige ontledingstabellen in Les 5, `Na't` en 14-rijige examentabellen in Les 7, `badal` in Les 8, diptote Kasrah-uitzonderingen in Les 23, en een compleet vreemde Reader 8-les als Les 24). Het handmatig uitfilteren van deze vervuiling is foutgevoeliger dan schoon opbouwen.
3. **Verlies van de originele a/b/c-structuur en incomplete woordenlijsten:**
   Het boek splitst Les 4 (4a/4b), Les 9 (9a/9b) en Les 13 (13a/13b/13c) bewust op. Door de samenvoeging in `G2_LESSONS` zijn niet alleen grammaticale secties gesneuveld, maar ontbreken ook **tientallen woorden** uit de bijbehorende woordenlijsten (bijv. 4 woorden in Les 4, 9 woorden in Les 9, 14 woorden in Les 13, 10 woorden in Les 14, 6 woorden in Les 19) én alle `*`-voetnoten bij die woordenlijsten.
4. **Cruciale grammaticale regels uit het boek zijn stilletjes weggelaten:**
   Essentiële leerpunten uit het boek — zoals de 8 patronen van het gebroken meervoud (Les 13a blz. 57), de punten 6 t/m 9 van Les 10 (`مُعَاوِيَةُ/حَمْزَةُ`, het verschil tussen `عِنْدَ` en `مَعَ`, `بِالْجَامِعَةِ`, ontkennend `مَا`), de 3-letterregel voor niet-Arabische namen (`نُوْحٌ`, `لُوْطٌ`) en het bijvoeglijk naamwoord bij een Moedaaf (`بَيْتُ الْإِمَامِ الْجَدِيْدُ`) in Les 14, de accusatief-Alief regel in Les 18, `وَاحِدٌ`/`اِثْنَانِ` en `كَمْ ثَمَنُ هٰذَا؟` in Les 19–20, en Groep 4 + de patronen `أَفْعِلَاءُ`/`فُعَلَاءُ` + `أَطِبَّاءُ` in Les 22 — ontbreken geheel in de huidige data.
5. **De PDF van het grammaticaboek is kort, kraakhelder en 100% gestructureerd:**
   De eigenlijke lesinhoud van `01a_Grammaticaboek_Medina_methode_deel_1 (1).pdf` beslaat slechts blz. 11 t/m 93 (83 zeer overzichtelijke pagina's met korte genummerde punten, duidelijke tabellen, 56 genummerde voetnoten en vaste woordenlijsten). Rechtstreekse extractie per pagina garandeert 100% tekstgetrouwheid, behoud van alle voetnoten en fonetische transcripties, en een zuivere scheiding tussen het Nederlandstalige grammaticaboek en het Arabische tekst-/oefeningenboek (`Madina_Book1_Arabic_Text.pdf`).
