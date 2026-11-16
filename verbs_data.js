/* Werkwoorden-leerpad — Medina-stijl, correcte zinnen.
 * Strategie:
 *  1) Verleden (ماضي) 3e persoon m.: basisvorm leren
 *  2) Zinnen met subject (± object / voorzetsel)
 *  3) Tegenwoordige tijd (مضارع) introduceren
 *  4) Contrast verleden ↔ heden
 *  5) Korte dialoogzinnen herhalen
 */
window.AL_VERBS = {
  lessons: [
    {
      n: 1,
      title: 'Gaan (verleden)',
      focus: 'past',
      tip: 'In het Arabisch begint een zin vaak met het werkwoord. ذَهَبَ = hij ging (verleden).',
      verbs: [
        { id: 'v1a', ar: 'ذَهَبَ', nl: 'hij ging', tense: 'past' },
        { id: 'v1b', ar: 'خَرَجَ', nl: 'hij ging naar buiten', tense: 'past' },
        { id: 'v1c', ar: 'دَخَلَ', nl: 'hij kwam binnen', tense: 'past' }
      ],
      sentences: [
        { id: 's1a', ar: 'ذَهَبَ مُحَمَّدٌ.', nl: 'Mohammed ging.', words: ['ذَهَبَ', 'مُحَمَّدٌ'] },
        { id: 's1b', ar: 'خَرَجَ الْوَلَدُ.', nl: 'De jongen ging naar buiten.', words: ['خَرَجَ', 'الْوَلَدُ'] },
        { id: 's1c', ar: 'دَخَلَ الطَّالِبُ.', nl: 'De student kwam binnen.', words: ['دَخَلَ', 'الطَّالِبُ'] },
        { id: 's1d', ar: 'ذَهَبَ مُحَمَّدٌ إِلَى الْمَسْجِدِ.', nl: 'Mohammed ging naar de moskee.', words: ['ذَهَبَ', 'مُحَمَّدٌ', 'إِلَى', 'الْمَسْجِدِ'] }
      ]
    },
    {
      n: 2,
      title: 'Zitten en opstaan',
      focus: 'past',
      tip: 'Nog meer verleden tijd: جَلَسَ (hij zat) en قَامَ (hij stond op).',
      verbs: [
        { id: 'v2a', ar: 'جَلَسَ', nl: 'hij zat', tense: 'past' },
        { id: 'v2b', ar: 'قَامَ', nl: 'hij stond op', tense: 'past' },
        { id: 'v2c', ar: 'نَامَ', nl: 'hij sliep', tense: 'past' }
      ],
      sentences: [
        { id: 's2a', ar: 'جَلَسَ الطَّالِبُ.', nl: 'De student zat.', words: ['جَلَسَ', 'الطَّالِبُ'] },
        { id: 's2b', ar: 'قَامَ الْوَلَدُ.', nl: 'De jongen stond op.', words: ['قَامَ', 'الْوَلَدُ'] },
        { id: 's2c', ar: 'جَلَسَ مُحَمَّدٌ عَلَى الْكُرْسِيِّ.', nl: 'Mohammed zat op de stoel.', words: ['جَلَسَ', 'مُحَمَّدٌ', 'عَلَى', 'الْكُرْسِيِّ'] },
        { id: 's2d', ar: 'نَامَ الطِّفْلُ.', nl: 'Het kind sliep.', words: ['نَامَ', 'الطِّفْلُ'] }
      ]
    },
    {
      n: 3,
      title: 'Openen en sluiten',
      focus: 'past',
      tip: 'Werkwoord + lijdend voorwerp: فَتَحَ الْبَابَ = hij opende de deur.',
      verbs: [
        { id: 'v3a', ar: 'فَتَحَ', nl: 'hij opende', tense: 'past' },
        { id: 'v3b', ar: 'أَغْلَقَ', nl: 'hij sloot', tense: 'past' },
        { id: 'v3c', ar: 'كَسَرَ', nl: 'hij brak', tense: 'past' }
      ],
      sentences: [
        { id: 's3a', ar: 'فَتَحَ الْوَلَدُ الْبَابَ.', nl: 'De jongen opende de deur.', words: ['فَتَحَ', 'الْوَلَدُ', 'الْبَابَ'] },
        { id: 's3b', ar: 'أَغْلَقَ مُحَمَّدٌ الْبَابَ.', nl: 'Mohammed sloot de deur.', words: ['أَغْلَقَ', 'مُحَمَّدٌ', 'الْبَابَ'] },
        { id: 's3c', ar: 'فَتَحَ الطَّالِبُ الْكِتَابَ.', nl: 'De student opende het boek.', words: ['فَتَحَ', 'الطَّالِبُ', 'الْكِتَابَ'] },
        { id: 's3d', ar: 'كَسَرَ الْوَلَدُ الْقَلَمَ.', nl: 'De jongen brak de pen.', words: ['كَسَرَ', 'الْوَلَدُ', 'الْقَلَمَ'] }
      ]
    },
    {
      n: 4,
      title: 'Schrijven en lezen',
      focus: 'past',
      tip: 'كَتَبَ en قَرَأَ: vaak met een object (brief, les, boek).',
      verbs: [
        { id: 'v4a', ar: 'كَتَبَ', nl: 'hij schreef', tense: 'past' },
        { id: 'v4b', ar: 'قَرَأَ', nl: 'hij las', tense: 'past' },
        { id: 'v4c', ar: 'فَهِمَ', nl: 'hij begreep', tense: 'past' }
      ],
      sentences: [
        { id: 's4a', ar: 'كَتَبَ الطَّالِبُ الدَّرْسَ.', nl: 'De student schreef de les.', words: ['كَتَبَ', 'الطَّالِبُ', 'الدَّرْسَ'] },
        { id: 's4b', ar: 'قَرَأَ مُحَمَّدٌ الْكِتَابَ.', nl: 'Mohammed las het boek.', words: ['قَرَأَ', 'مُحَمَّدٌ', 'الْكِتَابَ'] },
        { id: 's4c', ar: 'كَتَبَ الْمُدَرِّسُ عَلَى السَّبُّورَةِ.', nl: 'De leraar schreef op het bord.', words: ['كَتَبَ', 'الْمُدَرِّسُ', 'عَلَى', 'السَّبُّورَةِ'] },
        { id: 's4d', ar: 'فَهِمَ الطَّالِبُ الدَّرْسَ.', nl: 'De student begreep de les.', words: ['فَهِمَ', 'الطَّالِبُ', 'الدَّرْسَ'] }
      ]
    },
    {
      n: 5,
      title: 'Eten en drinken',
      focus: 'past',
      tip: 'أَكَلَ (at) en شَرِبَ (dronk) — klassieke werkwoorden uit de lessen.',
      verbs: [
        { id: 'v5a', ar: 'أَكَلَ', nl: 'hij at', tense: 'past' },
        { id: 'v5b', ar: 'شَرِبَ', nl: 'hij dronk', tense: 'past' },
        { id: 'v5c', ar: 'أَخَذَ', nl: 'hij nam', tense: 'past' }
      ],
      sentences: [
        { id: 's5a', ar: 'أَكَلَ الْوَلَدُ تُفَّاحًا.', nl: 'De jongen at een appel.', words: ['أَكَلَ', 'الْوَلَدُ', 'تُفَّاحًا'] },
        { id: 's5b', ar: 'شَرِبَ مُحَمَّدٌ مَاءً.', nl: 'Mohammed dronk water.', words: ['شَرِبَ', 'مُحَمَّدٌ', 'مَاءً'] },
        { id: 's5c', ar: 'أَخَذَ الطَّالِبُ الْكِتَابَ.', nl: 'De student nam het boek.', words: ['أَخَذَ', 'الطَّالِبُ', 'الْكِتَابَ'] },
        { id: 's5d', ar: 'شَرِبَ الْوَلَدُ الْحَلِيبَ.', nl: 'De jongen dronk de melk.', words: ['شَرِبَ', 'الْوَلَدُ', 'الْحَلِيبَ'] }
      ]
    },
    {
      n: 6,
      title: 'Heden: hij gaat',
      focus: 'present',
      tip: 'Tegenwoordige tijd: يَذْهَبُ = hij gaat. Let op de يَـ aan het begin.',
      verbs: [
        { id: 'v6a', ar: 'يَذْهَبُ', nl: 'hij gaat', tense: 'present' },
        { id: 'v6b', ar: 'يَخْرُجُ', nl: 'hij gaat naar buiten', tense: 'present' },
        { id: 'v6c', ar: 'يَدْخُلُ', nl: 'hij komt binnen', tense: 'present' }
      ],
      pairs: [
        { past: 'ذَهَبَ', present: 'يَذْهَبُ', nl: 'gaan' },
        { past: 'خَرَجَ', present: 'يَخْرُجُ', nl: 'naar buiten gaan' },
        { past: 'دَخَلَ', present: 'يَدْخُلُ', nl: 'binnenkomen' }
      ],
      sentences: [
        { id: 's6a', ar: 'يَذْهَبُ مُحَمَّدٌ إِلَى الْمَسْجِدِ.', nl: 'Mohammed gaat naar de moskee.', words: ['يَذْهَبُ', 'مُحَمَّدٌ', 'إِلَى', 'الْمَسْجِدِ'] },
        { id: 's6b', ar: 'يَخْرُجُ الْوَلَدُ مِنَ الْبَيْتِ.', nl: 'De jongen gaat uit het huis.', words: ['يَخْرُجُ', 'الْوَلَدُ', 'مِنَ', 'الْبَيْتِ'] },
        { id: 's6c', ar: 'يَدْخُلُ الطَّالِبُ الْفَصْلَ.', nl: 'De student komt de klas binnen.', words: ['يَدْخُلُ', 'الطَّالِبُ', 'الْفَصْلَ'] }
      ]
    },
    {
      n: 7,
      title: 'Heden: doen',
      focus: 'present',
      tip: 'يَكْتُبُ / يَقْرَأُ / يَفْتَحُ — dezelfde wortels als in de verleden tijd.',
      verbs: [
        { id: 'v7a', ar: 'يَكْتُبُ', nl: 'hij schrijft', tense: 'present' },
        { id: 'v7b', ar: 'يَقْرَأُ', nl: 'hij leest', tense: 'present' },
        { id: 'v7c', ar: 'يَفْتَحُ', nl: 'hij opent', tense: 'present' }
      ],
      pairs: [
        { past: 'كَتَبَ', present: 'يَكْتُبُ', nl: 'schrijven' },
        { past: 'قَرَأَ', present: 'يَقْرَأُ', nl: 'lezen' },
        { past: 'فَتَحَ', present: 'يَفْتَحُ', nl: 'openen' }
      ],
      sentences: [
        { id: 's7a', ar: 'يَكْتُبُ الطَّالِبُ الدَّرْسَ.', nl: 'De student schrijft de les.', words: ['يَكْتُبُ', 'الطَّالِبُ', 'الدَّرْسَ'] },
        { id: 's7b', ar: 'يَقْرَأُ مُحَمَّدٌ الْكِتَابَ.', nl: 'Mohammed leest het boek.', words: ['يَقْرَأُ', 'مُحَمَّدٌ', 'الْكِتَابَ'] },
        { id: 's7c', ar: 'يَفْتَحُ الْوَلَدُ الْبَابَ.', nl: 'De jongen opent de deur.', words: ['يَفْتَحُ', 'الْوَلَدُ', 'الْبَابَ'] }
      ]
    },
    {
      n: 8,
      title: 'Verleden of heden?',
      focus: 'contrast',
      tip: 'Zie je يَـ vooraan? Dan is het meestal heden. Zonder يَـ en met a-klanken: vaak verleden.',
      verbs: [
        { id: 'v8a', ar: 'ذَهَبَ', nl: 'hij ging', tense: 'past' },
        { id: 'v8b', ar: 'يَذْهَبُ', nl: 'hij gaat', tense: 'present' },
        { id: 'v8c', ar: 'كَتَبَ', nl: 'hij schreef', tense: 'past' },
        { id: 'v8d', ar: 'يَكْتُبُ', nl: 'hij schrijft', tense: 'present' }
      ],
      pairs: [
        { past: 'ذَهَبَ', present: 'يَذْهَبُ', nl: 'gaan' },
        { past: 'كَتَبَ', present: 'يَكْتُبُ', nl: 'schrijven' },
        { past: 'جَلَسَ', present: 'يَجْلِسُ', nl: 'zitten' },
        { past: 'قَرَأَ', present: 'يَقْرَأُ', nl: 'lezen' }
      ],
      sentences: [
        { id: 's8a', ar: 'ذَهَبَ مُحَمَّدٌ إِلَى السُّوقِ.', nl: 'Mohammed ging naar de markt.', words: ['ذَهَبَ', 'مُحَمَّدٌ', 'إِلَى', 'السُّوقِ'] },
        { id: 's8b', ar: 'يَذْهَبُ مُحَمَّدٌ إِلَى السُّوقِ.', nl: 'Mohammed gaat naar de markt.', words: ['يَذْهَبُ', 'مُحَمَّدٌ', 'إِلَى', 'السُّوقِ'] },
        { id: 's8c', ar: 'كَتَبَ الطَّالِبُ رِسَالَةً.', nl: 'De student schreef een brief.', words: ['كَتَبَ', 'الطَّالِبُ', 'رِسَالَةً'] },
        { id: 's8d', ar: 'يَكْتُبُ الطَّالِبُ رِسَالَةً.', nl: 'De student schrijft een brief.', words: ['يَكْتُبُ', 'الطَّالِبُ', 'رِسَالَةً'] }
      ]
    },
    {
      n: 9,
      title: 'Meer contrast',
      focus: 'contrast',
      tip: 'Kies de juiste tijd bij de Nederlandse zin: “ging” → verleden, “gaat” → heden.',
      verbs: [
        { id: 'v9a', ar: 'خَرَجَ', nl: 'hij ging naar buiten', tense: 'past' },
        { id: 'v9b', ar: 'يَخْرُجُ', nl: 'hij gaat naar buiten', tense: 'present' },
        { id: 'v9c', ar: 'فَتَحَ', nl: 'hij opende', tense: 'past' },
        { id: 'v9d', ar: 'يَفْتَحُ', nl: 'hij opent', tense: 'present' }
      ],
      pairs: [
        { past: 'خَرَجَ', present: 'يَخْرُجُ', nl: 'naar buiten gaan' },
        { past: 'فَتَحَ', present: 'يَفْتَحُ', nl: 'openen' },
        { past: 'شَرِبَ', present: 'يَشْرَبُ', nl: 'drinken' },
        { past: 'أَكَلَ', present: 'يَأْكُلُ', nl: 'eten' }
      ],
      sentences: [
        { id: 's9a', ar: 'خَرَجَ الْمُدَرِّسُ مِنَ الْفَصْلِ.', nl: 'De leraar ging uit de klas.', words: ['خَرَجَ', 'الْمُدَرِّسُ', 'مِنَ', 'الْفَصْلِ'] },
        { id: 's9b', ar: 'يَخْرُجُ الْمُدَرِّسُ مِنَ الْفَصْلِ.', nl: 'De leraar gaat uit de klas.', words: ['يَخْرُجُ', 'الْمُدَرِّسُ', 'مِنَ', 'الْفَصْلِ'] },
        { id: 's9c', ar: 'فَتَحَتْ فَاطِمَةُ الْبَابَ.', nl: 'Fatima opende de deur.', words: ['فَتَحَتْ', 'فَاطِمَةُ', 'الْبَابَ'] },
        { id: 's9d', ar: 'تَفْتَحُ فَاطِمَةُ الْبَابَ.', nl: 'Fatima opent de deur.', words: ['تَفْتَحُ', 'فَاطِمَةُ', 'الْبَابَ'] }
      ]
    },
    {
      n: 10,
      title: 'Zinnen in context',
      focus: 'mixed',
      tip: 'Alles door elkaar: kies de juiste vorm en begrijp de hele zin.',
      verbs: [
        { id: 'v10a', ar: 'ذَهَبَ', nl: 'hij ging', tense: 'past' },
        { id: 'v10b', ar: 'يَذْهَبُ', nl: 'hij gaat', tense: 'present' },
        { id: 'v10c', ar: 'كَتَبَ', nl: 'hij schreef', tense: 'past' },
        { id: 'v10d', ar: 'يَقْرَأُ', nl: 'hij leest', tense: 'present' }
      ],
      pairs: [
        { past: 'ذَهَبَ', present: 'يَذْهَبُ', nl: 'gaan' },
        { past: 'كَتَبَ', present: 'يَكْتُبُ', nl: 'schrijven' },
        { past: 'قَرَأَ', present: 'يَقْرَأُ', nl: 'lezen' }
      ],
      sentences: [
        { id: 's10a', ar: 'ذَهَبَ الطُّلَّابُ إِلَى الْمَدْرَسَةِ.', nl: 'De studenten gingen naar school.', words: ['ذَهَبَ', 'الطُّلَّابُ', 'إِلَى', 'الْمَدْرَسَةِ'] },
        { id: 's10b', ar: 'يَقْرَأُ الْوَلَدُ فِي الْمَكْتَبَةِ.', nl: 'De jongen leest in de bibliotheek.', words: ['يَقْرَأُ', 'الْوَلَدُ', 'فِي', 'الْمَكْتَبَةِ'] },
        { id: 's10c', ar: 'كَتَبَتْ مَرْيَمُ عَلَى السَّبُّورَةِ.', nl: 'Maryam schreef op het bord.', words: ['كَتَبَتْ', 'مَرْيَمُ', 'عَلَى', 'السَّبُّورَةِ'] },
        { id: 's10d', ar: 'يَجْلِسُ مُحَمَّدٌ عَلَى الْكُرْسِيِّ.', nl: 'Mohammed zit op de stoel.', words: ['يَجْلِسُ', 'مُحَمَّدٌ', 'عَلَى', 'الْكُرْسِيِّ'] }
      ]
    },
    {
      n: 11,
      title: 'Herhaling: verleden',
      focus: 'past',
      tip: 'Extra oefening op de verleden tijd — de basis van Arabische werkwoorden.',
      verbs: [
        { id: 'v11a', ar: 'سَمِعَ', nl: 'hij hoorde', tense: 'past' },
        { id: 'v11b', ar: 'نَظَرَ', nl: 'hij keek', tense: 'past' },
        { id: 'v11c', ar: 'قَالَ', nl: 'hij zei', tense: 'past' }
      ],
      sentences: [
        { id: 's11a', ar: 'سَمِعَ الطَّالِبُ الدَّرْسَ.', nl: 'De student hoorde de les.', words: ['سَمِعَ', 'الطَّالِبُ', 'الدَّرْسَ'] },
        { id: 's11b', ar: 'نَظَرَ الْوَلَدُ إِلَى اللَّوْحِ.', nl: 'De jongen keek naar het bord.', words: ['نَظَرَ', 'الْوَلَدُ', 'إِلَى', 'اللَّوْحِ'] },
        { id: 's11c', ar: 'قَالَ الْمُدَرِّسُ: اِجْلِسْ.', nl: 'De leraar zei: ga zitten.', words: ['قَالَ', 'الْمُدَرِّسُ'] },
        { id: 's11d', ar: 'سَمِعَ مُحَمَّدٌ الْأَذَانَ.', nl: 'Mohammed hoorde de adhan.', words: ['سَمِعَ', 'مُحَمَّدٌ', 'الْأَذَانَ'] }
      ]
    },
    {
      n: 12,
      title: 'Herhaling: gemengd',
      focus: 'mixed',
      tip: 'Laatste ronde: werkwoorden en zinnen in verleden én heden door elkaar.',
      verbs: [
        { id: 'v12a', ar: 'يَسْمَعُ', nl: 'hij hoort', tense: 'present' },
        { id: 'v12b', ar: 'قَالَ', nl: 'hij zei', tense: 'past' },
        { id: 'v12c', ar: 'يَقُولُ', nl: 'hij zegt', tense: 'present' },
        { id: 'v12d', ar: 'ذَهَبَ', nl: 'hij ging', tense: 'past' }
      ],
      pairs: [
        { past: 'سَمِعَ', present: 'يَسْمَعُ', nl: 'horen' },
        { past: 'قَالَ', present: 'يَقُولُ', nl: 'zeggen' },
        { past: 'ذَهَبَ', present: 'يَذْهَبُ', nl: 'gaan' }
      ],
      sentences: [
        { id: 's12a', ar: 'يَسْمَعُ الطَّالِبُ الْقُرْآنَ.', nl: 'De student hoort de Koran.', words: ['يَسْمَعُ', 'الطَّالِبُ', 'الْقُرْآنَ'] },
        { id: 's12b', ar: 'قَالَ مُحَمَّدٌ الْحَقَّ.', nl: 'Mohammed zei de waarheid.', words: ['قَالَ', 'مُحَمَّدٌ', 'الْحَقَّ'] },
        { id: 's12c', ar: 'يَقُولُ الْمُدَرِّسُ الدَّرْسَ.', nl: 'De leraar zegt de les.', words: ['يَقُولُ', 'الْمُدَرِّسُ', 'الدَّرْسَ'] },
        { id: 's12d', ar: 'ذَهَبَتْ فَاطِمَةُ إِلَى الْجَامِعَةِ.', nl: 'Fatima ging naar de universiteit.', words: ['ذَهَبَتْ', 'فَاطِمَةُ', 'إِلَى', 'الْجَامِعَةِ'] }
      ]
    }
  ]
};
