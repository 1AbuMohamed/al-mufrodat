/* Vul ontbrekende lessen met lab-stijl kaarten uit het boek (zelfde vibe als Les 3) */
(function fillMissingLabTheory() {
  'use strict';
  var DATA = window.GRAMMATICA || {};
  var LAB = window.GRAMMATICA_LAB = window.GRAMMATICA_LAB || {};

  function plain(s) {
    return String(s || '').replace(/\s+/g, ' ').trim();
  }
  function makeKop(text, fallback) {
    var line = plain(text).split(/[.!?\n]/)[0].trim();
    if (line.length > 4 && line.length <= 80) return line;
    return fallback || 'Onthoud dit';
  }

  Object.keys(DATA).forEach(function (key) {
    var n = key;
    if (LAB[n] && LAB[n].uitleg && LAB[n].uitleg.length) return;
    var items = (DATA[n] && DATA[n].inhoud) || [];
    if (!items.length) return;

    var notes = [];
    var examples = [];
    items.forEach(function (item, i) {
      var t = plain(item.tekst);
      if (['regel', 'tekst', 'kop'].indexOf(item.type) >= 0 && t.length > 10 &&
          !/^(?:voorbeelden?:?|merk op:?|les \d+[a-z]?|in deze les leren we het volgende:?|woordenlijst van les)/i.test(t)) {
        notes.push({ text: t, index: i, type: item.type });
      }
      if (item.type === 'voorbeeld' && plain(item.ar)) {
        examples.push({ ar: plain(item.ar), nl: plain(item.nl || ''), index: i });
      }
    });

    function pickExamples(around, take) {
      var ranked = examples.slice().sort(function (a, b) {
        return Math.abs(a.index - around) - Math.abs(b.index - around);
      });
      var out = [], seen = {};
      for (var i = 0; i < ranked.length && out.length < (take || 2); i++) {
        if (seen[ranked[i].ar]) continue;
        seen[ranked[i].ar] = 1;
        out.push([ranked[i].ar, ranked[i].nl || '']);
      }
      return out;
    }

    var uitleg = [];
    notes.forEach(function (note, idx) {
      var body = note.text;
      var kop = note.type === 'kop' ? body : makeKop(body, 'Regel ' + (idx + 1));
      var tekst = note.type === 'kop' ? [] : [body];
      uitleg.push({
        kop: kop,
        tekst: tekst,
        vb: pickExamples(note.index, 2)
      });
    });

    if (!uitleg.length && examples.length) {
      examples.slice(0, 4).forEach(function (ex, i) {
        uitleg.push({
          kop: 'Voorbeeld ' + (i + 1),
          tekst: ['Bekijk deze zin uit de les en let op de vorm.'],
          vb: [[ex.ar, ex.nl]]
        });
      });
    }

    if (!uitleg.length) return;
    if (uitleg.length > 6) uitleg = uitleg.slice(0, 6);
    LAB[n] = LAB[n] || {};
    LAB[n].uitleg = uitleg;
  });
})();
