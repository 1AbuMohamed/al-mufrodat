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
   - *Les 24 (Madinah Arabic Reader 8)* staat niet in Boek 1 en is netjes bewaard als afzonderlijke referentie (*Reader 8 Aanvulling*).

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
