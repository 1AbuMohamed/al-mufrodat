(function () {
'use strict';
var DATA = window.GRAMMATICA || {};
var SAVE_KEY = 'alm_grammar_test_v2';
var OLD_KEY = 'alm_grammar_test_scores_v1';
var MAX_TASKS = 10;
var app = null;
var session = {
lesson: null, stage: 'overview', tasks: [], index: 0, theoryCards: [], theoryIndex: 0, parseAnswers: {},
chosen: -1, ordered: [], feedback: null,
correct: 0, missed: [], review: false, hearts: 5, combo: 0, xp: 0, wrong: 0, attempts: 0, lastMissed: [], queued: false
};
function plain(value) { return String(value == null ? '' : value).trim(); }
function esc(value) {
return plain(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
.replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function isExample(item) {
return item && item.type === 'voorbeeld' && plain(item.ar) && plain(item.nl) &&
!/^(?:-|voorbeeld\s*:|enkelvoud\s*:|meervoud\s*:)$/i.test(plain(item.nl));
}
function getExamples(n) {
var lesson = DATA[n];
if (!lesson) return [];
var found = new Set();
return (lesson.inhoud || []).filter(isExample).filter(function (item) {
var key = plain(item.ar) + '\u0000' + plain(item.nl);
if (found.has(key)) return false;
found.add(key); return true;
});
}
function getRules(n) {
var lesson = DATA[n];
if (!lesson) return [];
return (lesson.inhoud || []).filter(function (item) {
return ['tekst', 'regel', 'kop'].indexOf(item.type) >= 0 &&
plain(item.tekst).length >= 35 &&
!/^Woordenlijst van les\b/i.test(plain(item.tekst));
}).slice(0, 3).map(function (item) { return plain(item.tekst); });
}
function getTheoryBits(n) {
var lesson = DATA[n];
if (!lesson) return [];
return (lesson.inhoud || []).filter(function (item) {
return ['tekst', 'regel', 'kop'].indexOf(item.type) >= 0 &&
plain(item.tekst).length >= 20 &&
!/^Woordenlijst van les\b/i.test(plain(item.tekst));
}).map(function (item) { return plain(item.tekst); });
}
function lessonTextBlob(n) {
var lesson = DATA[n];
if (!lesson) return '';
return (lesson.inhoud || []).map(function (item) {
return plain(item.tekst || '') + ' ' + plain(item.ar || '') + ' ' + plain(item.nl || '');
}).join(' ');
}
function termsForLesson(n) {
var blob = lessonTextBlob(n);
var catalog = [
{ label: 'مبتدأ', re: /مبتدأ/ },
{ label: 'خبر', re: /خبر/ },
{ label: 'فعل', re: /فعل/ },
{ label: 'اسم', re: /اسم|Ism|ism/ },
{ label: 'حرف', re: /حرف/ },
{ label: 'فاعل', re: /فاعل/ },
{ label: 'مفعول', re: /مفعول/ },
{ label: 'جار', re: /جار|مجرور|Madjroer/ },
{ label: 'نعت', re: /نعت/ },
{ label: 'مضاف', re: /مضاف|Moedaaf/ },
{ label: 'naamwoord', re: /naamwoord/i },
{ label: 'werkwoord', re: /werkwoord/i },
{ label: 'voornaamwoord', re: /voornaamwoord/i },
{ label: 'onderwerp', re: /onderwerp/i },
{ label: 'gezegde', re: /gezegde/i },
{ label: 'partikel', re: /partikel/i },
{ label: 'bijvoeglijk naamwoord', re: /bijvoeglijk naamwoord/i }
];
return catalog.filter(function (t) { return t.re.test(blob); }).map(function (t) { return t.label; });
}
function highlightKey(ar) {
var words = splitArabic(ar);
if (!words.length) return esc(ar);
var idx = 0;
if (words.length > 1 && /^(هٰ?ذَا|هٰ?ذِهِ|ذٰ?لِكَ|تِلْكَ|هٰ?ؤُلَاءِ|مَا|مَنْ|هَلْ|أَ)/.test(words[0])) idx = Math.min(1, words.length - 1);
else idx = words.length - 1;
return words.map(function (w, i) {
return i === idx ? '<mark class="gd-mark">' + esc(w) + '</mark>' : esc(w);
}).join(' ');
}
function buildTheoryCards(n) {
var bits = getTheoryBits(n);
var examples = getExamples(n);
var cards = [];
var i;
for (i = 0; i < bits.length && cards.length < 4; i++) {
cards.push({ k
