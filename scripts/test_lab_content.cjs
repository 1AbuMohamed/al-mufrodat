/* Controleert de aanvullende leerlaag (lab_content.js) tegen het boek (lessons_v2.js). */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = vm.createContext({
  window: {}, document: { readyState: 'loading', addEventListener() {} },
  localStorage: { getItem() { return null; }, setItem() {} }, console
});
for (const f of ['lessons_v2.js', 'lab_content.js', 'grammatica-test.js']) {
  vm.runInContext(fs.readFileSync(f, 'utf8'), context, { filename: f });
}
const book = context.window.GRAMMATICA, lab = context.window.GRAMMATICA_LAB, core = context.window.GrammarLabCore;
const strip = s => String(s).replace(/[\u064b-\u065f\u0670\u06d6-\u06ed\u0640]/g, '');
const bookText = n => JSON.stringify(book[n]);
const allBook = Object.keys(book).map(bookText).join(' ');
const ARABIC_TERMS = new Set(['Ism','Fi‘l','Harf','Ism Isjaarah','Ism Istifhaam','Harf Istifhaam','Harf Atf','Harf Djarr','Harf an-Nidaa’','Dhamier',
  'Moebtada','Chabar','Faa‘il','Moedaaf','Moedaaf Ilaih','Na‘t','Man‘oet','Ma‘doed','Maf‘oel bih','Marfoe‘','Mansoeb','Madjroer','Zarf','Ism Mawsoel','Harf Nafie','Harf Djawaab','']);
let sentences = 0, questions = 0, cards = 0;
for (const [key, l] of Object.entries(lab)) {
  assert(book[key], `Les ${key} bestaat niet in het boek`);
  assert(l.uitleg && l.uitleg.length >= 2, `Les ${key}: minstens 2 theoriekaarten`);
  l.uitleg.forEach(c => { assert(c.kop && c.tekst && c.tekst.length, `Les ${key}: kaart zonder kop/tekst`); cards++; });
  for (const q of l.vragen) {
    assert(q.o.length >= 2 && q.o.length <= 4 && Number.isInteger(q.g) && q.g < q.o.length, `Les ${key}: ongeldige vraag ${q.v}`);
    assert.equal(new Set(q.o).size, q.o.length, `Les ${key}: dubbele opties in ${q.v}`);
    assert(q.u, `Les ${key}: vraag zonder uitleg`);
    questions++;
  }
  const bt = strip(bookText(key));
  for (const s of l.ontleding) {
    const clean = v => strip(v).replace(/[.،؟?,]/g, '').replace(/\s+/g, ' ').trim();
    assert(clean(bookText(key)).includes(clean(s.ar)), `Les ${key}: zin niet in het boek: ${s.ar}`);
    for (const w of s.woorden) {
      assert(s.ar.includes(w[0].replace(/[،.؟]$/, '')) || s.ar.includes(w[0]), `Les ${key}: woord ${w[0]} niet in zin`);
      assert(['Ism','Fi‘l','Harf'].includes(w[1]), `Les ${key}: onbekende soort ${w[1]}`);
      for (const t of [w[2], w[3], w[4]]) assert(ARABIC_TERMS.has(t), `Les ${key}: term buiten de Arabische lijst: ${t}`);
    }
    // de woorden samen vormen de zin
    assert.equal(strip(s.woorden.map(w => w[0]).join(' ')).replace(/[\s.،؟?,]/g, ''), strip(s.ar).replace(/[\s.،؟?,]/g, ''), `Les ${key}: woorden komen niet overeen met zin ${s.ar}`);
    sentences++;
  }
  const n = Number(key);
  const tasks = core.buildStudyTasks(n, 12345, { count: 10 });
  assert(tasks.length >= 10, `Les ${key}: te weinig oefeningen (${tasks.length})`);
  assert(tasks.some(t => t.type === 'ontleed'), `Les ${key}: geen ontleedopgave`);
  assert(tasks.some(t => t.type === 'lab'), `Les ${key}: geen theorievraag`);
  for (const t of tasks.filter(t => t.type === 'lab' || t.type === 'ontleed')) {
    assert(t.options.includes(t.answer), `Les ${key}: antwoord ontbreekt in opties`);
    assert.equal(new Set(t.options).size, t.options.length);
  }
}
console.log(`OK: ${Object.keys(lab).length} lessen met leerlaag; ${cards} theoriekaarten; ${questions} vragen; ${sentences} ontlede zinnen.`);
