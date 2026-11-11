/* Tests voor de geïsoleerde grammaticalab-proef. Geen inhoud wordt veranderd. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = vm.createContext({
  window: {},
  document: { readyState: 'loading', addEventListener() {} },
  localStorage: { getItem() { return null; }, setItem() {} },
  console
});
vm.runInContext(fs.readFileSync('lessons_v2.js', 'utf8'), context, { filename: 'lessons_v2.js' });
vm.runInContext(fs.readFileSync('grammatica-test.js', 'utf8'), context, { filename: 'grammatica-test.js' });

const data = context.window.GRAMMATICA;
const core = context.window.GrammarLabCore;
assert(core && typeof core.buildTasks === 'function');
assert.equal(Object.keys(data).length, 24, 'Alle 24 oorspronkelijke lessen moeten aanwezig blijven');

const text = value => String(value ?? '').trim();
let lessonCount = 0, availableTasks = 0;
for (const [key, lesson] of Object.entries(data)) {
  const n = Number(key);
  const tasks = core.buildTasks(n);
  const examples = core.getExamples(n);
  const rows = lesson.inhoud.filter(row => row.type === 'voorbeeld');
  assert(tasks.length <= 6, 'Een oefenronde bevat hooguit zes opdrachten');
  assert(examples.length <= rows.length);
  if (!examples.length) assert.equal(tasks.length, 0);
  if (examples.length) assert(tasks.length > 0);

  const original = new Set(rows.map(row => row.ar + '\u0000' + row.nl));
  const originalArabicWords = new Set(examples.flatMap(row => core.splitArabic(row.ar)));
  const originalDutch = new Set(examples.map(row => text(row.nl)));
  for (const task of tasks) {
    assert(['choice','gap','order','reflect'].includes(task.type));
    assert(original.has(task.example.ar + '\u0000' + task.example.nl),
      'Alle vragen moeten uit de exacte originele Medina-bron komen');
    if (task.type === 'choice') {
      assert(task.options.includes(text(task.example.nl)));
      assert(task.options.every(option => originalDutch.has(option)),
        'Vertaalopties mogen uitsluitend uit dezelfde les afkomstig zijn');
      assert(new Set(task.options).size === task.options.length);
    }
    if (task.type === 'gap') {
      assert.equal(task.words.join(' '), core.splitArabic(task.example.ar).join(' '));
      assert.equal(task.words[task.missing], task.answer);
      assert(task.options.includes(task.answer));
      assert(task.options.every(option => originalArabicWords.has(option)),
        'Woordopties mogen uitsluitend uit bestaande Arabische voorbeeldzinnen komen');
    }
    if (task.type === 'order') {
      assert.equal(task.words.join(' '), core.splitArabic(task.example.ar).join(' '));
      assert.equal(new Set(task.bank).size, task.words.length);
      assert(task.bank.every(i => Number.isInteger(i) && i >= 0 && i < task.words.length));
    }
    availableTasks++;
  }
  lessonCount++;
}
assert.equal(lessonCount, 24);
assert.equal(core.buildTasks(0).length, 0, 'Geen verzonnen Arabische oefening in les 0');
assert.equal(core.buildTasks(17).length, 0, 'Geen verzonnen Arabische oefening in les 17');
// Theorie en ontleding mogen alleen letterlijk uit de Medina-bron komen.
let authenticGrammar=0, parsingTasks=0;
for(let n=0;n<=23;n++){
  const rows=data[n].inhoud;
  const rules=new Set(rows.filter(x=>['regel','tekst','kop'].includes(x.type)).map(x=>x.tekst));
  const examples=new Set(rows.filter(x=>x.type==='voorbeeld').map(x=>x.ar));
  const cards=core.buildTheoryCards(n);
  assert(cards.length>0,'Elke les moet de originele theorie in stappen tonen');
  for(const card of cards){
    assert(card.length>0&&card.every(x=>rows.includes(x)),'Theoriestappen mogen niet worden verzonnen');
  }
  const tasks=core.buildStudyTasks(n,913+n);
  assert(tasks.length<=10,'Maximum tien vragen');
  let grammar=0;
  for(const task of tasks){
    if(!['theory','parse','why'].includes(task.type))continue;
    grammar++;authenticGrammar++;
    assert(task.rule&&rules.has(task.rule),'Les '+n+': uitleg staat niet letterlijk in de bron');
    assert(task.options.includes(task.answer),'Juiste antwoord ontbreekt');
    if(task.type==='theory'){
      assert.equal(task.prompt.replace('____',task.answer),task.rule,'Les '+n+': theorievraag is geen originele regel');
    }else{
      parsingTasks++;
      assert(task.example&&examples.has(task.example.ar),'Les '+n+': ontleding gebruikt geen origineel voorbeeld');
      assert(task.example.ar.includes(task.word),'Les '+n+': gemarkeerd woord ontbreekt in het Arabisch');
    }
  }
  if(n!==21&&tasks.length>=4)assert(grammar/tasks.length>=.7,'Les '+n+': te weinig grammatica: '+grammar+'/'+tasks.length);
}
assert(parsingTasks>=10,'Te weinig geverifieerde ontledingsvragen');
console.log('OK: '+authenticGrammar+' theorievragen, waarvan '+parsingTasks+' geverifieerde ontledings-/waaromvragen.');

console.log('OK: ' + lessonCount + ' Medina-lessen; ' + availableTasks +
  ' authentieke oefenopdrachten; geen nieuwe Arabische zinnen of vertalingen.');
