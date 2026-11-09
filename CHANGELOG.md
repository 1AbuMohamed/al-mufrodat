# Changelog – Al-Mufrodat

Alle wijzigingen in het kader van het herstel en de herbouw van de grammatica, de oefeningen en de interface naar de officiële bronnen.

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
