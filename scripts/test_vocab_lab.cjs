// Controleert dat het woordenschat-leerpad van het Grammatica Lab alleen bestaande woorden gebruikt.
const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

const core = fs.readFileSync('app_core.js', 'utf8').split('\n')[1];
const m = core.match(/^const BASE_WORDS = (\[.*\]);?\s*$/);
assert(m, 'BASE_WORDS niet gevonden in app_core.js');
const base = JSON.parse(m[1]);

const sandbox = { window: {}, localStorage: { getItem() { return null; }, setItem() {} }, document: { getElementById() { return null; }, addEventListener() {}, body: { classList: { add() {}, remove() {} } } } };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('vocab_words.js', 'utf8'), sandbox);
vm.runInContext(fs.readFileSync('grammatica-test-vocab.js', 'utf8'), sandbox);
const words = sandbox.AL_VOCAB;
const lab = sandbox.GrammarLabVocab;

assert.strictEqual(words.length, base.length, 'Aantal woorden wijkt af van BASE_WORDS');
const byId = new Map(base.map(w => [w.id, w]));
words.forEach(w => {
  const src = byId.get(w.id);
  assert(src, 'Onbekend woord ' + w.id);
  assert.strictEqual(w.ar, src.ar); assert.strictEqual(w.nl, src.nl); assert.strictEqual(w.lesson, src.lesson);
});
assert.strictEqual(new Set(words.map(w => w.id)).size, words.length, 'Dubbele id\'s');

const plan = lab.plan();
assert.strictEqual(plan.kind, 'vocab');
assert(plan.list.length >= 20, 'Te weinig lessen in het woordenschatpad');
plan.list.forEach(o => {
  assert(o.total > 0 && o.kind === 'vocab' && o.m >= 0 && o.m <= 5);
  assert(['none', 'going', 'mastered'].includes(o.state));
});
assert(plan.cur && plan.cur.n >= 1);
console.log('OK: ' + words.length + ' woorden in ' + plan.list.length + ' lessen; alle woorden afkomstig uit BASE_WORDS.');
