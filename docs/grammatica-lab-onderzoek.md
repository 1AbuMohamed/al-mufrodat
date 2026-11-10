# Grammatica Lab — research en proefversie

Deze losse proefpagina **vervangt de bestaande Grammatica niet**.
Open: `grammatica-test.html` of `grammatica-test.html?les=5`.

## Onderzoek: wat Duolingo doet

Gebaseerd op beschrijvingen van Duolingo zelf:

1. **Mini-uitleg voor het oefenen** — een korte tip, die tijdens de oefening terug
   te halen is. Bron: https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/
2. **Grammaticale patronen oefenen in echte zinnen**, niet alleen regels lezen.
   Bron: https://blog.duolingo.com/does-duolingo-teach-grammar/
3. **Eerst eenvoudige opdrachten, daarna actieve productie**:
   meerkeuze, lege plaatsen en woorden in de juiste volgorde zetten.
   Bron: https://blog.duolingo.com/language-rules-learning-grammar-on-duolingo/
4. **Direct feedback geven** en fouten later opnieuw oefenen.
   Bron: https://blog.duolingo.com/grammar-practice-tips/
5. **Herhaling en persoonlijke oefening** om zwakke onderdelen te versterken.
   Bronnen:
   https://blog.duolingo.com/spaced-repetition-for-learning/
   https://blog.duolingo.com/right-level-of-difficulty/

## Vertaling naar Al-Mufrodat

| Duolingo-principe | In dit Grammatica Lab |
| --- | --- |
| Korte tip | Exacte stukjes tekst uit de oorspronkelijke `lessons_v2.js` |
| Selecteer de vertaling | Keuzes uitsluitend uit de voorbeelden van dezelfde Medina-les |
| Vul het juiste woord in | Arabische woordvormen uitsluitend uit de bestaande voorbeeldzinnen |
| Zet woorden in de juiste volgorde | Aanklikbare blokjes met de originele Arabische zin |
| Direct feedback | Oorspronkelijke Arabische zin én Nederlandse vertaling letterlijk tonen |
| Fouten opnieuw oefenen | Afzonderlijke herhalingsronde aan het einde |
| Voortgang per les | Oefenbalk en optionele proefscore in eigen lokale opslag |
| Mini-lessen | Maximaal zes korte opdrachten per ronde |

De pagina gebruikt **eigen Al-Mufrodat-kleuren en identiteit**. Er is geen
Duolingo-logo, mascotte, geïmiteerde stem, illustratie of gekopieerde broncode.

## Inhoudelijke grenzen

- De gewone site en de bestanden `grammar_v2.js`, `lessons_v2.js`,
  `app_core.js`, `exercises_v2.js` en de bestaande pdf's worden niet aangepast.
- Iedere opgave gebruikt uitsluitend bestaande voorbeelden en bestaande
  vertalingen uit de overeenkomstige les. Ook de foute meerkeuze-opties zijn
  afkomstig uit dezelfde les; er worden geen foutieve nieuwe Arabische vormen
  verzonnen.
- De automatisch gekozen opdrachten zijn **oefenmechanieken**, geen
  inhoudelijke herinterpretatie van de Medina-grammatica.
- Les 0 en les 17 bevatten geen oorspronkelijke Arabisch–Nederlandse
  voorbeeldparen; daarom toont de demo bij deze lessen alleen bestaande uitleg
  plus een link naar de originele les, zonder een toets te verzinnen.
- Sommige oorspronkelijke vertalingen bevatten transliteratie of
  grammaticale opmerkingen. Die blijven letterlijk behouden. Voor een
  didactisch uitgewerkte productieversie zou een vakdocent per les de
  best passende vragen selecteren en nakijken.
- Deze versie heeft geen nagemaakte Duolingo-harten, streakdwang of claims
  over leerbeheersing. Er is geen audio geïmproviseerd.

## Techniek

- `grammatica-test.html` is een **zelfstandige URL**; de huidige
  grammaticapagina blijft ongewijzigd.
- Alleen leesgebruik van `window.GRAMMATICA` via `lessons_v2.js`.
- Proefresultaten worden lokaal bewaard onder
  `alm_grammar_test_scores_v1` en staan los van de echte voortgang.
- Geen externe API, account, tracking of nieuwe dependencies in de live
  proefpagina.

## Tests

- `node scripts/test_grammar_lab.cjs` controleert alle 24 lessen en dat
  de opgaven alleen originele Medina-teksten en vertalingen gebruiken.
- `python scripts/test_grammar_lab_browser.py` controleert de interactieve
  route, zes schermbreedtes, feedback, lesresultaten en de zelfstandige opslag.
- Een aparte GitHub Actions-workflow test de proefpagina automatisch.

## Mogelijke volgende stappen (pas na inhoudelijke beoordeling)

- Les-specifieke feedback bij een fout — letterlijk geciteerd uit de
  oorspronkelijke grammaticaregels, handmatig door een docent gekoppeld.
- Arabisch intypen als optionele moeilijkere modus, met betrouwbare
  harakāt- en spellingcontrole.
- Herhalingsmomenten voor eerdere Medina-lessen, op basis van opt-in en
  zonder nieuwe lesinhoud te introduceren.
