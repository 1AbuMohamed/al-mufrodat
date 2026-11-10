# Al-Mufrodat – Medina Arabisch Deel 1

Interactieve Nederlandstalige leeromgeving bij *Durūs al-Lughah al-ʿArabiyyah li-Ghayr an-Nāṭiqīna bihā* (Medina-boek Deel 1) van dr. V. Abdur Rahim, met letterlijke Nederlandse grammatica-uitleg uit de officiële methode en de authentieke Arabische oefeningen inclusief illustraties.

---

## Belangrijkste onderdelen

1. **Grammatica (Letterlijk naar het boek)**
   - **Bron:** *Grammaticaboek Medina-methode Deel 1* (Mohammed Ahmad Khan, Uitgeverij al-Qalam, Les 0–23).
   - Alle Nederlandse grammaticaregels, toelichtingen, tabellen en voorbeelden zijn **100% letterlijk (verbatim)** overgenomen in de exacte volgorde van het boek.
   - Arabische teksten met alle originele harakāt (klinkertekens en dagger-alifs).
   - Rustige, afleidingsvrije weergave: per lespagina **precies één titel** (`Les N`), geen geforceerde stappen, geen toetsdrempels of lesvergrendelingen.
   - Eenvoudig voortgangsvinkje per les (*Les afgerond*), lokaal opgeslagen.

2. **Oefeningen (Letterlijk met illustraties)**
   - **Bron:** *Madina Book 1 Arabic Text* (`Madina_Book1_Arabic_Text.pdf`).
   - Alle 128 oefeningen zijn als haarscherpe afbeeldingen (`.webp`) rechtstreeks uit de Arabische bronpagina's gesneden, inclusief alle bijbehorende tekeningen en illustraties.
   - Weergegeven op een lichte kaart voor optimale leesbaarheid in zowel de lichte als de donkere modus.
   - Tik of klik op een afbeelding om deze in een schermvullende lightbox te vergroten; pinch-to-zoom wordt volledig ondersteund op mobiele apparaten.
   - Optioneel lokaal notitievak (*Mijn antwoord*) per oefening.

3. **Woordenschat & Dialogen**
   - Interactieve woordentraining (flashcards, verkennen, herkennen, typen) en gesprekken uit het boek.
   - Doeltreffend, snel en zonder afleiding.

---

## Woordenlijsten als PDF (nieuw)

- De afzonderlijke woordenlijsten worden **niet meer onder Grammatica getoond**.
  Alle eigenlijke grammaticaregels, voorbeelden en inhoudelijke tabellen blijven wel zichtbaar.
- Bij de lessen onder **Woordenschat** staat een directe knop **Woordenlijst PDF**;
  ook vanuit de flashcards van de betreffende les is deze beschikbaar.
- Er zijn **22 downloadbare les-PDF's**, op basis van **25 oorspronkelijke lijsten**.
  Les 4a/4b, 9a/9b en 13a/13b zijn per les samengevoegd.
- De bron in `lessons_v2.js` blijft volledig behouden, inclusief Arabische tekens,
  Nederlandse vertalingen en voetnoten. Les 11 en de Reader-8-aanvulling hebben
  in de grammatica-bron geen zelfstandige woordenlijst en dus geen aparte PDF.
- PDF-bestanden staan in `pdf/woordenlijst-les-NN.pdf` en worden reproduceerbaar
  gegenereerd via `python scripts/generate_wordlists.py` (vereist `weasyprint`).
  GitHub Actions bouwt en commit ze bij wijzigingen in de inhoud of generator.
- Het nieuwe logo staat in `assets/al-mufrodat-logo.svg`; de basisapp wordt lokaal
  geladen uit `app_core.js` in plaats van via een externe GitHub Raw-URL.

---

## Didactische leeslaag (zonder inhoudelijke wijzigingen)

De grammaticale brontekst, Arabische voorbeelden, oorspronkelijke vertalingen,
woorden, dialogen, zinsontleding, oefendata en de Medina-lesvolgorde blijven
exact zoals ze zijn. Deze uitbreiding past alleen weergave en leerknoppen aan:

- **Rustige kleuren per inhoudsvorm:** groen voor uitlegregels, goud voor
  oorspronkelijke voorbeelden, blauw voor tabellen/schema's. De tekst zelf krijgt
  geen automatisch (mogelijk onjuist) woordsoortlabel.
- **Arabisch eerst:** originele voorbeeldzinnen staan boven hun Nederlandse
  vertaling; harakāt blijven behouden.
- **Actief oefenen:** zet vertalingen uit en onthul de originele Nederlandse
  vertaling per voorbeeld. Geen gewijzigde zinnen, antwoorden of lesinhoud.
- **Per les verdergaan:** vanuit grammatica direct naar de bijbehorende
  woordenschatkaartjes en bestaande grammaticaoefeningen; in Woordenschat
  per les een aparte oefenknop naast de bestaande PDF-download.
- **Voortgang:** elke woordenschatles toont een visuele balk met dezelfde
  al opgeslagen beheersingspercentage. Er worden geen nieuwe leerscores verzonnen.
- **Rechtstreekse links:** grammatica-URL's openen betrouwbaar na
  het vertraagd laden van de basisapp.
- **Controles:** de mobiele Chromium-test controleert nu ook zelftesten,
  navigatie tussen leeronderdelen en de bestaande PDF's.

Het ontwerp gebruikt de principes *signaling* en *coherence* (Fiorella & Mayer,
*Cambridge Handbook of Multimedia Learning*, 2021) en *retrieval practice*
(Carpenter e.a., *Nature Reviews Psychology*, 2022). Het voegt geen alternatieve
grammaticaregels of woordlijsten toe.

---

## Leesinstellingen en dialogen

- **Grammatica:** in iedere les staat de schakelaar **Toon vertalingen**.
  Daarmee worden de Nederlandse vertalingen bij Arabische voorbeelden getoond of verborgen.
  De Nederlandstalige grammaticale uitleg, regels en grammaticatabellen blijven altijd zichtbaar.
  De keuze wordt lokaal onthouden, ook bij volgende bezoeken.
- **Dialogen:** schone leesweergave zonder foto's of avatars, met kleinere sprekerlabels,
  overzichtelijke afzonderlijke zinnen en Nederlandse vertalingen per zin of allemaal tegelijk.
  De 8 oorspronkelijke eenheden, 13 dialogen, 81 Arabische zinnen en Nederlandse vertalingen
  zijn ongewijzigd. De lijst met belangrijke zinnen en iʿrāb zijn behouden.
- **Technische correctie:** oudere functies voor dialogen en flashcards overschrijven niet
  langer de nieuwe renderers. Het omschakelen van dialogen bewaart nu de vertaalweergave.
- **Kleine verbeteringen:** toetsenbordfocus, mobiele leesbreedtes, knoppen en leescontrast.
  De gerichte stijlverbeteringen staan in `polish.css`.
- **Automatische sitecontrole:** `node scripts/test_readers.cjs`,
  `node scripts/test_bootstrap.cjs` en `python scripts/site_audit.py`
  controleren de bestaande data, renderer-voorkeuren, pagina-assets en PDF's.

---

## Geluid en Audio (Verwijderd voor overzicht)

Op verzoek van de gebruiker zijn **alle geluids- en spraakfuncties volledig verwijderd** (de audiomap, Text-to-Speech via externe bronnen en spraakherkenning) om de applicatie stil, snel en overzichtelijk te maken. Ook worden lettertypen (zoals het Arabische *Amiri*) nu lokaal geserveerd vanuit de map `fonts/` zonder afhankelijkheden van externe Google Fonts servers.

### Geluid terughalen via Git Tags

Mocht je in de toekomst de audiofunctionaliteit of specifieke audiobestanden willen herstellen, dan kan dat eenvoudig via de git-geschiedenis:

- **Tag `voor-geluid-verwijdering`**: Bevat de volledige oorspronkelijke staat van de repository inclusief de 355 mp3-audiobestanden en spraakfunctionaliteit.
  ```bash
  # Bekijk de repository van vóór de audioverwijdering:
  git checkout voor-geluid-verwijdering

  # Of haal alleen de audiomap terug naar je huidige branch:
  git checkout voor-geluid-verwijdering -- audio/
  ```
- **Tag `voor-grammatica-herbouw`**: Bevat de staat waarin het geluid al is verwijderd, maar vóórdat de grammatica opnieuw is opgebouwd.
- **Map `_archief/`**: Bevat kopieën van de oude `lessons_v2.js` en `grammar_v2.js`.

---

## Documentatie & Audits

- **`AUDIT-grammatica.md`**: Volledige audit per les (0–23) met vergelijking tussen het bronboek en de eerdere data.
- **`KOPPELING-oefeningen.md`**: Uitgebreide koppelingstabel tussen elke les en de oefeningen / paginanummers in `Madina_Book1_Arabic_Text.pdf`.
- **`CHANGELOG.md`**: Chronologisch overzicht van alle uitgevoerde aanpassingen.

---

## Bestandenstructuur

- `index.html` – Hoofdapplicatie (woordenschat, dialogen, navigatie, thema).
- `grammar_v2.js` – Rustige, eenduidige rendering van de grammaticalessen en oefeningen.
- `lessons_v2.js` – Databestand (`window.GRAMMATICA`) met letterlijke teksten, tabellen en oefeningkoppelingen.
- `styles.css` – Styling met lokale Amiri-lettertypes, dark-mode ondersteuning en afleidingsvrij design.
- `fonts/` – Lokale lettertypebestanden van Amiri (`.woff2`).
- `img/oefeningen/` – Haarscherpe uitsnedes van alle 128 oefeningen uit het Arabische tekstboek (`.webp`).
- `_archief/` – Veilig bewaarde eerdere versies van grammatica- en databestanden.

---

Live demo: https://1abumohamed.github.io/al-mufrodat/
