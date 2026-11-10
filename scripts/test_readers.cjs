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
const transChange = listeners.change.find(fn => fn.toString().includes('gram-trans-toggle'));
assert(transChange, 'De aan/uit-schakelaar is niet bedraad');
let toggleClass = '';
transChange({target: {
  id: 'gram-trans-toggle',
  checked: false,
  closest: () => ({classList: {toggle(name, bool) {toggleClass = name + ':' + bool;}}})
}});
assert.equal(store.get('alm_gram_show_translations_v1'), '0');
assert.equal(toggleClass, 'gram-trans-off:true');
assert.match(grammarHtml(), /gram-lesson-wrap gram-trans-off/);
transChange({target: {
  id:'gram-trans-toggle', checked:true,
  closest: () => ({classList:{toggle(){}}})
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
