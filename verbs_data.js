/* Werkwoorden: eerst STAM + betekenis, dan verleden/heden, dan zinnen.
 * Stam = basisbetekenis (gaan, komen…). Arabische citatievorm = 3e p. verleden (فَعَلَ).
 */
window.AL_VERBS = {
  lessons: [
    {
      n: 1,
      title: 'Stammen: gaan & komen',
      focus: 'stem',
      tip: 'Leer eerst de stam: de basisbetekenis. ذَهَبَ hoort bij “gaan”. Later komt hij ging / hij gaat.',
      verbs: [
        { id: 'v1a', ar: 'ذَهَبَ', stem: 'gaan', nl: 'gaan', tense: 'stem' },
        { id: 'v1b', ar: 'جَاءَ', stem: 'komen', nl: 'komen', tense: 'stem' },
        { id: 'v1c', ar: 'خَرَجَ', stem: 'naar buiten gaan', nl: 'naar buiten gaan', tense: 'stem' },
        { id: 'v1d', ar: 'دَخَلَ', stem: 'binnenkomen', nl: 'binnenkomen', tense: 'stem' }
      ],
      sentences: []
    },
    {
      n: 2,
      title: 'Stammen: lopen & rusten',
      focus: 'stem',
      tip: 'Nog vier stammen. Onthoud: Arabisch toont hier de basisvorm (verleden “hij …”), betekenis = de stam.',
      verbs: [
        { id: 'v2a', ar: 'مَشَى', stem: 'lopen', nl: 'lopen', tense: 'stem' },
        { id: 'v2b', ar: 'جَلَسَ', stem: 'zitten', nl: 'zitten', tense: 'stem' },
        { id: 'v2c', ar: 'قَامَ', stem: 'opstaan', nl: 'opstaan', tense: 'stem' },
        { id: 'v2d', ar: 'نَامَ', stem: 'slapen', nl: 'slapen', tense: 'stem' }
      ],
      sentences: []
    },
    {
      n: 3,
      title: 'Stammen: doen',
      focus: 'stem',
      tip: 'Schrijven, lezen, openen, eten — eerst de stam, nog geen zinnen.',
      verbs: [
        { id: 'v3a', ar: 'كَتَبَ', stem: 'schrijven', nl: 'schrijven', tense: 'stem' },
        { id: 'v3b', ar: 'قَرَأَ', stem: 'lezen', nl: 'lezen', tense: 'stem' },
        { id: 'v3c', ar: 'فَتَحَ', stem: 'openen', nl: 'openen', tense: 'stem' },
        { id: 'v3d', ar: 'أَكَلَ', stem: 'eten', nl: 'eten', tense: 'stem' },
        { id: 'v3e', ar: 'شَرِبَ', stem: 'drinken', nl: 'drinken', tense: 'stem' }
      ],
      sentences: []
    },
    {
      n: 4,
      title: 'Verleden: hij ging',
      focus: 'past',
      tip: 'Nu de verleden tijd: ذَهَبَ = hij ging. Zelfde vorm als de stam, nu met “hij …”.',
      verbs: [
        { id: 'v4a', ar: 'ذَهَبَ', stem: 'gaan', nl: 'hij ging', tense: 'past' },
        { id: 'v4b', ar: 'جَاءَ', stem: 'komen', nl: 'hij kwam', tense: 'past' },
        { id: 'v4c', ar: 'خَرَجَ', stem: 'naar buiten gaan', nl: 'hij ging naar buiten', tense: 'past' },
        { id: 'v4d', ar: 'دَخَلَ', stem: 'binnenkomen', nl: 'hij kwam binnen', tense: 'past' }
      ],
      sentences: [
        { id: 's4a', ar: 'ذَهَبَ مُحَمَّدٌ.', nl: 'Mohammed ging.', words: ['ذَهَبَ', 'مُحَمَّدٌ'] },
        { id: 's4b', ar: 'جَاءَ الْوَلَدُ.', nl: 'De jongen kwam.', words: ['جَاءَ', 'الْوَلَدُ'] },
        { id: 's4c', ar: 'خَرَجَ الطَّالِبُ.', nl: 'De student ging naar buiten.', words: ['خَرَجَ', 'الطَّالِبُ'] },
        { id: 's4d', ar: 'ذَهَبَ مُحَمَّدٌ إِلَى الْمَسْجِدِ.', nl: 'Mohammed ging naar de moskee.', words: ['ذَهَبَ', 'مُحَمَّدٌ', 'إِلَى', 'الْمَسْجِدِ'] }
      ]
    },
    {
      n: 5,
      title: 'Verleden: zitten & slapen',
      focus: 'past',
      tip: 'Verleden tijd van lopen, zitten, opstaan, slapen.',
      verbs: [
        { id: 'v5a', ar: 'مَشَى', stem: 'lopen', nl: 'hij liep', tense: 'past' },
        { id: 'v5b', ar: 'جَلَسَ', stem: 'zitten', nl: 'hij zat', tense: 'past' },
        { id: 'v5c', ar: 'قَامَ', stem: 'opstaan', nl: 'hij stond op', tense: 'past' },
        { id: 'v5d', ar: 'نَامَ', stem: 'slapen', nl: 'hij sliep', tense: 'past' }
      ],
      sentences: [
        { id: 's5a', ar: 'جَلَسَ الطَّالِبُ.', nl: 'De student zat.', words: ['جَلَسَ', 'الطَّالِبُ'] },
        { id: 's5b', ar: 'قَامَ الْوَلَدُ.', nl: 'De jongen stond op.', words: ['قَامَ', 'الْوَلَدُ'] },
        { id: 's5c', ar: 'نَامَ الطِّفْلُ.', nl: 'Het kind sliep.', words: ['نَامَ', 'الطِّفْلُ'] },
        { id: 's5d', ar: 'جَلَسَ مُحَمَّدٌ عَلَى الْكُرْسِيِّ.', nl: 'Mohammed zat op de stoel.', words: ['جَلَسَ', 'مُحَمَّدٌ', 'عَلَى', 'الْكُرْسِيِّ'] }
      ]
    },
    {
      n: 6,
      title: 'Verleden: schrijven & eten',
      focus: 'past',
      tip: 'Verleden + voorwerp: hij schreef de les, hij opende de deur.',
      verbs: [
        { id: 'v6a', ar: 'كَتَبَ', stem: 'schrijven', nl: 'hij schreef', tense: 'past' },
        { id: 'v6b', ar: 'قَرَأَ', stem: 'lezen', nl: 'hij las', tense: 'past' },
        { id: 'v6c', ar: 'فَتَحَ', stem: 'openen', nl: 'hij opende', tense: 'past' },
        { id: 'v6d', ar: 'أَكَلَ', stem: 'eten', nl: 'hij at', tense: 'past' },
        { id: 'v6e', ar: 'شَرِبَ', stem: 'drinken', nl: 'hij dronk', tense: 'past' }
      ],
      sentences: [
        { id: 's6a', ar: 'كَتَبَ الطَّالِبُ الدَّرْسَ.', nl: 'De student schreef de les.', words: ['كَتَبَ', 'الطَّالِبُ', 'الدَّرْسَ'] },
        { id: 's6b', ar: 'قَرَأَ مُحَمَّدٌ الْكِتَابَ.', nl: 'Mohammed las het boek.', words: ['قَرَأَ', 'مُحَمَّدٌ', 'الْكِتَابَ'] },
        { id: 's6c', ar: 'فَتَحَ الْوَلَدُ الْبَابَ.', nl: 'De jongen opende de deur.', words: ['فَتَحَ', 'الْوَلَدُ', 'الْبَابَ'] },
        { id: 's6d', ar: 'شَرِبَ مُحَمَّدٌ مَاءً.', nl: 'Mohammed dronk water.', words: ['شَرِبَ', 'مُحَمَّدٌ', 'مَاءً'] }
      ]
    },
    {
      n: 7,
      title: 'Heden: hij gaat',
      focus: 'present',
      tip: 'Heden: يَذْهَبُ = hij gaat. Zelfde stam “gaan”, andere vorm.',
      verbs: [
        { id: 'v7a', ar: 'يَذْهَبُ', stem: 'gaan', nl: 'hij gaat', tense: 'present' },
        { id: 'v7b', ar: 'يَجِيءُ', stem: 'komen', nl: 'hij komt', tense: 'present' },
        { id: 'v7c', ar: 'يَخْرُجُ', stem: 'naar buiten gaan', nl: 'hij gaat naar buiten', tense: 'present' },
        { id: 'v7d', ar: 'يَدْخُلُ', stem: 'binnenkomen', nl: 'hij komt binnen', tense: 'present' }
      ],
      pairs: [
        { past: 'ذَهَبَ', present: 'يَذْهَبُ', nl: 'gaan' },
        { past: 'جَاءَ', present: 'يَجِيءُ', nl: 'komen' },
        { past: 'خَرَجَ', present: 'يَخْرُجُ', nl: 'naar buiten gaan' },
        { past: 'دَخَلَ', present: 'يَدْخُلُ', nl: 'binnenkomen' }
      ],
      sentences: [
        { id: 's7a', ar: 'يَذْهَبُ مُحَمَّدٌ إِلَى الْمَسْجِدِ.', nl: 'Mohammed gaat naar de moskee.', words: ['يَذْهَبُ', 'مُحَمَّدٌ', 'إِلَى', 'الْمَسْجِدِ'] },
        { id: 's7b', ar: 'يَخْرُجُ الْوَلَدُ مِنَ الْبَيْتِ.', nl: 'De jongen gaat uit het huis.', words: ['يَخْرُجُ', 'الْوَلَدُ', 'مِنَ', 'الْبَيْتِ'] },
        { id: 's7c', ar: 'يَدْخُلُ الطَّالِبُ الْفَصْلَ.', nl: 'De student komt de klas binnen.', words: ['يَدْخُلُ', 'الطَّالِبُ', 'الْفَصْلَ'] }
      ]
    },
    {
      n: 8,
      title: 'Heden: hij schrijft',
      focus: 'present',
      tip: 'Heden van schrijven, lezen, openen, zitten.',
      verbs: [
        { id: 'v8a', ar: 'يَكْتُبُ', stem: 'schrijven', nl: 'hij schrijft', tense: 'present' },
        { id: 'v8b', ar: 'يَقْرَأُ', stem: 'lezen', nl: 'hij leest', tense: 'present' },
        { id: 'v8c', ar: 'يَفْتَحُ', stem: 'openen', nl: 'hij opent', tense: 'present' },
        { id: 'v8d', ar: 'يَجْلِسُ', stem: 'zitten', nl: 'hij zit', tense: 'present' }
      ],
      pairs: [
        { past: 'كَتَبَ', present: 'يَكْتُبُ', nl: 'schrijven' },
        { past: 'قَرَأَ', present: 'يَقْرَأُ', nl: 'lezen' },
        { past: 'فَتَحَ', present: 'يَفْتَحُ', nl: 'openen' },
        { past: 'جَلَسَ', present: 'يَجْلِسُ', nl: 'zitten' }
      ],
      sentences: [
        { id: 's8a', ar: 'يَكْتُبُ الطَّالِبُ الدَّرْسَ.', nl: 'De student schrijft de les.', words: ['يَكْتُبُ', 'الطَّالِبُ', 'الدَّرْسَ'] },
        { id: 's8b', ar: 'يَقْرَأُ مُحَمَّدٌ الْكِتَابَ.', nl: 'Mohammed leest het boek.', words: ['يَقْرَأُ', 'مُحَمَّدٌ', 'الْكِتَابَ'] },
        { id: 's8c', ar: 'يَفْتَحُ الْوَلَدُ الْبَابَ.', nl: 'De jongen opent de deur.', words: ['يَفْتَحُ', 'الْوَلَدُ', 'الْبَابَ'] },
        { id: 's8d', ar: 'يَجْلِسُ مُحَمَّدٌ عَلَى الْكُرْسِيِّ.', nl: 'Mohammed zit op de stoel.', words: ['يَجْلِسُ', 'مُحَمَّدٌ', 'عَلَى', 'الْكُرْسِيِّ'] }
      ]
    },
    {
      n: 9,
      title: 'Stam → verleden of heden',
      focus: 'contrast',
      tip: 'Je kent de stam. Kies nu: verleden (hij ging) of heden (hij gaat).',
      verbs: [
        { id: 'v9a', ar: 'ذَهَبَ', stem: 'gaan', nl: 'hij ging', tense: 'past' },
        { id: 'v9b', ar: 'يَذْهَبُ', stem: 'gaan', nl: 'hij gaat', tense: 'present' },
        { id: 'v9c', ar: 'كَتَبَ', stem: 'schrijven', nl: 'hij schreef', tense: 'past' },
        { id: 'v9d', ar: 'يَكْتُبُ', stem: 'schrijven', nl: 'hij schrijft', tense: 'present' }
      ],
      pairs: [
        { past: 'ذَهَبَ', present: 'يَذْهَبُ', nl: 'gaan' },
        { past: 'كَتَبَ', present: 'يَكْتُبُ', nl: 'schrijven' },
        { past: 'جَلَسَ', present: 'يَجْلِسُ', nl: 'zitten' },
        { past: 'قَرَأَ', present: 'يَقْرَأُ', nl: 'lezen' }
      ],
      sentences: [
        { id: 's9a', ar: 'ذَهَبَ مُحَمَّدٌ إِلَى السُّوقِ.', nl: 'Mohammed ging naar de markt.', words: ['ذَهَبَ', 'مُحَمَّدٌ', 'إِلَى', 'السُّوقِ'] },
        { id: 's9b', ar: 'يَذْهَبُ مُحَمَّدٌ إِلَى السُّوقِ.', nl: 'Mohammed gaat naar de markt.', words: ['يَذْهَبُ', 'مُحَمَّدٌ', 'إِلَى', 'السُّوقِ'] },
        { id: 's9c', ar: 'كَتَبَ الطَّالِبُ رِسَالَةً.', nl: 'De student schreef een brief.', words: ['كَتَبَ', 'الطَّالِبُ', 'رِسَالَةً'] },
        { id: 's9d', ar: 'يَكْتُبُ الطَّالِبُ رِسَالَةً.', nl: 'De student schrijft een brief.', words: ['يَكْتُبُ', 'الطَّالِبُ', 'رِسَالَةً'] }
      ]
    },
    {
      n: 10,
      title: 'Herhaling',
      focus: 'mixed',
      tip: 'Alles door elkaar: stam herkennen, tijd kiezen, zin begrijpen.',
      verbs: [
        { id: 'v10a', ar: 'سَمِعَ', stem: 'horen', nl: 'hij hoorde', tense: 'past' },
        { id: 'v10b', ar: 'يَسْمَعُ', stem: 'horen', nl: 'hij hoort', tense: 'present' },
        { id: 'v10c', ar: 'قَالَ', stem: 'zeggen', nl: 'hij zei', tense: 'past' },
        { id: 'v10d', ar: 'يَقُولُ', stem: 'zeggen', nl: 'hij zegt', tense: 'present' }
      ],
      pairs: [
        { past: 'سَمِعَ', present: 'يَسْمَعُ', nl: 'horen' },
        { past: 'قَالَ', present: 'يَقُولُ', nl: 'zeggen' },
        { past: 'ذَهَبَ', present: 'يَذْهَبُ', nl: 'gaan' }
      ],
      sentences: [
        { id: 's10a', ar: 'سَمِعَ الطَّالِبُ الدَّرْسَ.', nl: 'De student hoorde de les.', words: ['سَمِعَ', 'الطَّالِبُ', 'الدَّرْسَ'] },
        { id: 's10b', ar: 'يَسْمَعُ الطَّالِبُ الْقُرْآنَ.', nl: 'De student hoort de Koran.', words: ['يَسْمَعُ', 'الطَّالِبُ', 'الْقُرْآنَ'] },
        { id: 's10c', ar: 'قَالَ مُحَمَّدٌ الْحَقَّ.', nl: 'Mohammed zei de waarheid.', words: ['قَالَ', 'مُحَمَّدٌ', 'الْحَقَّ'] },
        { id: 's10d', ar: 'ذَهَبَتْ فَاطِمَةُ إِلَى الْجَامِعَةِ.', nl: 'Fatima ging naar de universiteit.', words: ['ذَهَبَتْ', 'فَاطِمَةُ', 'إِلَى', 'الْجَامِعَةِ'] }
      ]
    }
  ]
};
