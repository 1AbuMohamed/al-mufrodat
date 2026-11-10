/* Kleine regressietest van de echte lesdata en de grammatica-/dialoogrenderers.
   Uitvoerbaar met: node scripts/test_readers.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const read = path => fs.readFileSync(path, 'utf8');
function parseAssignment(path, signature) {
  const source = read(path);
  const pos = source.indexOf(signature);
  assert(pos >= 0, "Ontbrekende databron: " + signature);
  const start = pos + signature.length;
  const end = source.indexOf(';\n', start);
  assert(end > start, "Einde databron niet gevonden");
  return JSON.parse(source.slice(start, end));
}

const G = parseAssignment('lessons_v2.js', 'window.GRAMMATICA = ');
const C = parseAssignment('app_core.js', 'const CONVERSATIONS = ');
assert.equal(Object.keys(G).length, 24, 'Grammatica moet les 0 t/m 23 behouden');
assert(Object.keys(C).length > 0, 'Dialogen ontbreken');

const store = new Map();
const listeners = {};
const localStorage = {
  getItem: key => store.has(key) ? store.get(key) : null,
  setItem: (key, value) => store.set(key, String(value))
};
const document = {
  readyState: 'loading',
  addEventListener(type, fn) { listeners[type] = listeners[type] || []; listeners[type].push(fn); }
};
const location = { hash: '#/grammatica/1' };
const window = { GRAMMATICA: G, location, state: { bookLesson: 1, view: 'book-lesson', path: 'grammar' }, addEventListener() {} };
const context = vm.createContext({
  window, document, location, localStorage,
  history: { replaceState() {} }, setTimeout() {}, console,
  CONVERSATIONS: C,
  state: { convUnit: '1', convDi: 0, convShowAll: false, convOpen: {} }
});

vm.runInContext(read('grammar_v2.js'), context, { filename: 'grammar_v2.js' });
const grammarHtml = () => window.renderBookLesson();
assert.match(grammarHtml(), /id="gram-trans-toggle"/);
assert.match(grammarHtml(), /class="gram-nl"/);
assert.doesNotMatch(grammarHtml(), /gram-trans-off/);

// Mobiele lesbalk: overzicht, status, vorige en volgende bij elkaar,
// en géén dubbele checkbox bij de onderste lesnavigatie.
window.state.bookLesson = 5;
let lesson5 = grammarHtml();
assert.match(lesson5, /class="gram-lesson-header"/);
assert.match(lesson5, /class="gram-lesson-pager"/);
assert.match(lesson5, /aria-label="Vorige les: les 4"/);
assert.match(lesson5, /aria-label="Volgende les: les 6"/);
assert.match(lesson5, /05 \/ 23/);
assert.equal((lesson5.match(/id="gram-done-cb"/g)||[]).length, 1, 'Afgerond niet herhalen');
assert.equal((lesson5.match(/id="gram-trans-toggle"/g)||[]).length, 1, 'Vertaaloptie niet herhalen');
assert.equal((lesson5.match(/class="gram-lesson-title"/g)||[]).length, 1, 'Eén lestitel');
assert.match(lesson5, /class="gram-reading-label">Vertalingen bij voorbeelden/);
assert.match(lesson5, /class="gram-trans-caption">Aan/);
assert.match(lesson5, /class="gram-next-steps"/, 'Lesroute moet beschikbaar zijn');
assert.match(lesson5, /data-act="start-flash" data-l="5"/, 'Woordenschat van huidige les');
assert.match(lesson5, /data-act="open-ex" data-l="5"/, 'Oefeningen van huidige les');
assert.match(lesson5, /class="gram-reveal-btn" aria-expanded="false">Vertaling tonen/, 'Zelftest op voorbeelden');
assert.match(lesson5, /class="gram-ex-row"><span class="gram-ar"/, 'Arabisch verschijnt vóór de Nederlandse vertaling');
const sourceExample = G[5].inhoud.find(row => row.type === 'voorbeeld' && row.ar && row.nl);
assert(sourceExample && lesson5.includes(sourceExample.ar), 'De originele Arabische tekst moet behouden blijven');
assert.doesNotMatch(lesson5, /gram-top-nav|gram-nav-center/, 'Geen oude verbrokkelde navigatie');
window.state.bookLesson = 0;
const lesson0 = grammarHtml();
assert.doesNotMatch(lesson0, /aria-label="Vorige les:/);
assert.match(lesson0, /aria-label="Volgende les: les 1"/);
window.state.bookLesson = 23;
const lesson23 = grammarHtml();
assert.match(lesson23, /aria-label="Vorige les: les 22"/);
assert.doesNotMatch(lesson23, /aria-label="Volgende les:/);
window.state.bookLesson = 5;

const transChange = listeners.change.find(fn => fn.toString().includes('gram-trans-toggle'));
assert(transChange, 'De aan/uit-schakelaar is niet bedraad');
let toggleClass = '';
transChange({target: {
  id: 'gram-trans-toggle',
  checked: false,
  closest: () => ({classList: {toggle(name, bool) {toggleClass = name + ':' + bool;}}, querySelector: () => ({textContent:'Aan'}), querySelectorAll: () => []})
}});
assert.equal(store.get('alm_gram_show_translations_v1'), '0');
assert.equal(toggleClass, 'gram-trans-off:true');
assert.match(grammarHtml(), /gram-lesson-wrap gram-trans-off/);
transChange({target: {
  id:'gram-trans-toggle', checked:true,
  closest: () => ({classList:{toggle(){}}, querySelector: () => ({textContent:'Uit'}), querySelectorAll: () => []})
}});
assert.doesNotMatch(grammarHtml(), /gram-lesson-wrap gram-trans-off/);

vm.runInContext(read('conv_duo.js'), context, { filename: 'conv_duo.js' });
const dialogues = C['1'].dialogues;
assert(dialogues.length > 0);
const firstLines = dialogues[0].lines || [];
let html = window.renderConvUnit();
assert.doesNotMatch(html, /<img\b|conv-spk-avatar|heroImg/);
assert.match(html, /conv-speaker/);
assert.equal((html.match(/class="conv-chat-row spk-/g) || []).length, firstLines.length);
assert.equal((html.match(/class="conv-nl-line"/g) || []).length, 0, 'Verborgen vertalingen');
context.state.convShowAll = true;
html = window.renderConvUnit();
assert.equal((html.match(/class="conv-nl-line"/g) || []).length, firstLines.length);
context.state.convOpen['0-0'] = false;
html = window.renderConvUnit();
assert.equal((html.match(/class="conv-nl-line"/g) || []).length, firstLines.length - 1);
const overview = window.renderConv();
assert.doesNotMatch(overview, /<img\b|conv-spk-avatar/);
assert.equal((overview.match(/class="conv-overview-card/g) || []).length, Object.keys(C).length);
console.log('OK: grammaticavertaling aan/uit, alle originele dialogen en afbeeldingen weg uit UI.');
