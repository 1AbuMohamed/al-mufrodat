# Changelog – Al-Mufrodat

Alle wijzigingen in het kader van het herstel en de herbouw van de grammatica, de oefeningen en de interface naar de officiële bronnen.

---

## [Grammatica Lab: leerlaag met theorie, vragen en zinsontleding] – 2026-11-11

- **Nieuw `lab_content.js`:** per les uitgebreide theorie in kleine kaarten (eerst lezen), meerkeuzevragen over die theorie en zinsontleding. Het boek (`lessons_v2.js`) is niet gewijzigd.
- **Zinsontleding uitsluitend met Arabische termen** (Nederlands gespeld zoals in het boek): Ism, Fi‘l, Harf, Ism Isjaarah, Harf Djarr, Dhamier, Moebtada, Chabar, Faa‘il, Moedaaf, Moedaaf Ilaih, Marfoe‘, Madjroer, Mansoeb.
- **Alle Arabische zinnen** in de ontleding komen letterlijk uit het boek; `scripts/test_lab_content.cjs` controleert dat.
- **Opmaak:** groene/rode feedbackbalk, gemarkeerd woord bij ontleden, volledige ontleding met gekleurde labels, rustigere theoriekaarten (`grammatica-test-lab.css`).
- **Dekking:** les 1 t/m 16, 18, 19, 20, 22 en 23. Les 0, 17 en 21 (geen eigen regels) blijven bij de bestaande brongebonden oefeningen.

## [Gebruikersverfijningen & Didactische Vereenvoudiging] – 2026-11-09

### 1. Grammaticales zonder drie lagen tabs (Punt 1 & 2)
- **Één doorlopende pagina per les:** Alle drie de tabbladlagen (Overzicht / Regel 1 / Regel 2 en Uitleg / Voorbeelden / Oefenen) en de 5 bovenste knoppen (Les 1, Alle lessen, Ontleden, Auto, Geluid) zijn definitief verwijderd.
- **Precies één titel:** Elke lespagina begint direct met de titel `Les N` (of `Reader 8 (Aanvulling)`), met daaronder de uitleg, de regels, de tabellen, de voorbeelden en de boek-oefeningen overzichtelijk onder elkaar gestapeld.
- **Eenvoudig overzicht:** Het grammatica-overzicht is één rustige, kale lijst van Les 0 t/m Les 23 + Reader 8, zonder groepen, zonder zoekbalk, zonder filters en zonder overbodige kaarten erboven.
- **Opruiming oude code:** De oude 310 KB `GRAMMAR`-datastructuur en 950 regels dode stepper-/toetscode in `index.html` zijn verwijderd.

### 2. Actief herinneren in de woordenschat (Punt 3)
- **Geen passieve verkenningsfase meer:** Fase 01 (Verkennen met "Begrepen · volgende") is geschrapt. De student wordt vanaf de allereerste kaart meteen geprikkeld om het woord zelf te raden, te herkennen of te typen (active recall).
- **Direct antwoord controleren:** Elke kaart toont direct een knop "weet ik niet · toon antwoord", waarna het woord met vertaling en transcriptie wordt onthuld.
- **Rustige stappenteller:** De 4-fasen voortgangsbalk is vervangen door één heldere teller: `Vraag X van Y`.
- **Gestandaardiseerde academische transcriptie:** Alle 364 basiswoorden gebruiken nu het officiële academische Medina-systeem met macrons (`ā`, `ī`, `ū`) en consonanten met onderpunt (`ḥ`, `ṣ`, `ḍ`, `ṭ`, `ẓ`, `ʿ`, `ʾ`), bijvoorbeeld `ḥiṣānun` in plaats van het informele `hisaanun`.

### 3. Eén duidelijke "Ga verder"-knop op het startscherm (Punt 4)
- **Slim hervatten:** Zowel op desktop als op mobiel staat nu één prominente "Ga verder"-knop die in `localStorage` onthoudt waar de student voor het laatst gebleven was (grammatica of woordenschat).
- **Logisch beginpunt:** Voor nieuwe gebruikers verwijst de knop direct naar `Les 0` (Inleiding · Klinkertekens & symbolen), zodat de grammaticale inleiding nooit wordt overgeslagen.

### 4. Eenvoudige taal en één uniforme naamgeving (Punt 5)
- **Overal "Les":** Alle wisselingen tussen "Hoofdstuk", "Les", "Inleiding" en "Fase" zijn gelijkgetrokken naar het uniforme `Les N`.
- **Geen verwarrend jargon meer:** Termen zoals "MVP", "Spiekkaart", "Iʿrāb Studio", "Fase 01/02/03/04" en "Ontleden: uit" zijn verwijderd. In dialoogvensters staat nu gewoon "Toon ontleding" / "Ontleding verbergen".

### 5. Arabische typografie en leesbaarheid (Punt 6)
- **Arabisch in lopende tekst:** Alle Arabische woorden tussen «...» in de Nederlandse theorie, regels, voetnoten en tabellen worden in `grammar_v2.js` automatisch gewrapped in `<span class="ar-inline" lang="ar" dir="rtl">...</span>`.
- **Ruime regelafstand & geen beknelling:** In `styles.css` is `.ar-inline` gedefinieerd met `font-size: max(24px, 1.32em)`, `line-height: 2.05`, `font-weight: 700`, `overflow: visible` en een opvallende accentkleur (`var(--forest)`).
- **Voorbeelden en tabellen:** `.gram-ar` vergroot naar 28px (25px mobiel) met `line-height: 2.05`; `.gram-cell-ar` vergroot naar 26px met `line-height: 2.05`, zodat fatḥah, kasrah, ḍammah, sukūn, shaddah en dagger-alifs overal haarscherp en ongeknepen ademen.

### 6. Basisgemak & Gebruikerservaring (Punt 7)
- **Pinch-zoom:** Volledig ontgrendeld met `touch-action: pan-y pinch-zoom;` op `html, body, #app`.
- **Telefoon-terugknop (History API):** Geïntegreerd via `history.pushState` en een `popstate`-listener. Het indrukken van de hardware- of swipe-terugknop op de telefoon navigeert nu soepel terug binnen de app in plaats van de browserpagina af te sluiten.
- **Voortgang Back-up & Herstel:** In het Profiel / Instellingenscherm is een volledige export- en importfunctie toegevoegd. Gebruikers kunnen hun voortgang als `.json`-bestand downloaden en later herstellen.

---

## [Herbouw Grammatica & Verwijdering Geluid] – 2026-11-09

### 1. Opdracht D: Volledige verwijdering van geluid en spraak (Stilte & Rust)
- **Audio-bestanden verwijderd:** De volledige map `audio/` (355 `.mp3`-bestanden, ~5.4 MB) is uit het repository verwijderd.
- **Spraak- en TTS-code verwijderd:** In `index.html` en `styles.css` zijn alle aanroepen naar Web Speech API, `speakWord`, `speakFile`, `speakProxy`, `AudioContext`, opnameknoppen, `startZeg`, `renderZeg` en microfoon-toestemmingen verwijderd (~1950 regels code opgeschoond).
- **Examendictees aangepast:** Dicteevragen die leunden op audio zijn omgezet naar schriftelijke klinkervragen (harakāt).
- **Git tag `voor-geluid-verwijdering`:** Aangemaakt op commit `8f0d697`, zodat audio en spraakfunctionaliteit te allen tijde eenvoudig kunnen worden teruggehaald.

### 2. Opdracht A: Grammatica 100% letterlijk naar het grammaticaboek
- **Bron:** `01a_Grammaticaboek_Medina_methode_deel_1 (1).pdf` (vertaling Mohammed Ahmad Khan, Uitgeverij al-Qalam).
- **Audit uitgevoerd:** Vergelijking per les (Les 0–23) tussen de eerdere app-data en het boek gedocumenteerd in `AUDIT-grammatica.md`.
- **Data herbouwd in `lessons_v2.js`:**
  - Alle Nederlandse grammaticalessen (Les 0 t/m Les 23) zijn exact verbatim overgenomen in boekvolgorde.
  - Arabische woorden, regels en voorbeelden bevatten alle authentieke harakāt (inclusief dagger-alifs).
  - Volledige tabellen (zoals zonne- en maanletters, voorzetsels, bezitsconstructies, meervoudsvormen, getallen 1–10) overgenomen met exacte indeling.
  - Voetnoten en uitzonderingen uit het boek letterlijk bewaard.
  - Verwijderd: Alle niet-authentieke invuloefeningen, drills, iʿrāb-puzzels, de geforceerde stappenstructuur (start/leren/luisteren/ontleden/oefenen/klaar) en de 80%-toetsdrempels.
  - Voortgang: Rustige checkbox "Les afgerond" per les, lokaal bewaard.
  - **Les 24 (Madinah Arabic Reader 8):** Behouden als afzonderlijke aanvulling buiten Boek 1 (*Reader 8 Aanvulling*).
- **Archivering:** Oude versies veiliggesteld in `_archief/`.
- **Git tag `voor-grammatica-herbouw`:** Aangemaakt op commit `f53e7f4`.

### 3. Opdracht B: Oefeningen letterlijk uit `Madina_Book1_Arabic_Text.pdf`
- **Bron:** `Madina_Book1_Arabic_Text.pdf` (Arabische tekst van Medina Boek 1, Dr. V. Abdur Rahim).
- **Uitsnedes als afbeeldingen:** Alle 120 pagina's zijn in hoge resolutie gerenderd. 128 oefeningen zijn nauwkeurig bijgesneden en opgeslagen als geoptimaliseerde `.webp`-afbeeldingen in `img/oefeningen/`.
- **Illustraties inbegrepen:** Alle originele tekeningen en afbeeldingen bij de oefeningen (zoals in Les 1, 4, 6 en 8) zijn integraal meegeknipt.
- **Koppeltabel:** Uitgewerkt in `KOPPELING-oefeningen.md` met controle van paginanummering, inclusief correctie van de gespiegelde scanvolgorde van pagina's 14 en 15 in de bron-PDF.
- **Lokaal notitievak:** Elke oefening heeft een inklapbaar tekstveld ("Mijn antwoord") waarin studenten eigen antwoorden lokaal kunnen noteren. Er worden geen antwoorden verzonnen (aangezien de bron geen antwoordsleutel bevat).

### 4. Opdracht C: Rustige, overzichtelijke weergave
- **Harde titelregel gehandhaafd:** Precies één titel per lespagina: `Les N`. Geen ondertitels, geen app-toegevoegde badges, geen sectiekoppen zoals "Uitleg", "Grammatica" of "Oefeningen".
- **Eenvoudig overzicht:** Lijst van Les 0 t/m Les 23 met nummer en afgerond-vinkje.
- **Subtiele scheiding:** Dunne scheidingslijn tussen de theorie en de bijbehorende oefeningen.
- **Navigatie:** Rustige balk onderaan elke les met `‹ Les N-1`, `Overzicht`, `[x] Les afgerond` en `Les N+1 ›`.
- **Donkere modus:** Oefeningkaarten behouden een schone, lichte achtergrond (`#ffffff !important`) zodat zwarte letters en tekeningen haarscherp leesbaar blijven zonder kleurinversie.
- **Vergroting & zoom:** Tikken of klikken op een oefening opent een schermvullende lightbox. Viewport-beperking (`maximum-scale=1`) verwijderd voor soepele pinch-to-zoom op mobiel.
- **Typografie & offline:** Amiri-lettertypebestanden (`.woff2`) lokaal toegevoegd aan `fonts/`; externe Google Fonts CDN-koppelingen verwijderd.
