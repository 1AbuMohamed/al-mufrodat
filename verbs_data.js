/* Werkwoorden-leerpad — eerst woorden, dan zinnen, dan tijden.
 * Strategie:
 *  1) Losse werkwoorden (betekenis) — gaan, komen, slapen, …
 *  2) Eenvoudige zinnen met die werkwoorden
 *  3) Tegenwoordige tijd + contrast verleden/heden
 */
window.AL_VERBS = {
  lessons: [
    {
      n: 1,
      title: 'Gaan en komen',
      focus: 'verbs_only',
      tip: 'Leer eerst de betekenis. ذَهَبَ = hij ging. جَاءَ = hij kwam. Pas later maken we zinnen.',
      verbs: [
        { id: 'v1a', ar: 'ذَهَبَ', nl: 'hij ging', tense: 'past' },
        { id: 'v1b', ar: 'جَاءَ', nl: 'hij kwam', tense: 'past' },
        { id: 'v1c', ar: 'خَرَجَ', nl: 'hij ging naar buiten', tense: 'past' },
        { id: 'v1d', ar: 'دَخَلَ', nl: 'hij kwam binnen', tense: 'past' }
      ],
      sentences: []
    },
    {
      n: 2,
      title: 'Lopen, zitten, slapen',
      focus: 'verbs_only',
      tip: 'Nog meer basiswerkwoorden in de verleden tijd (hij …).',
      verbs: [
        { id: 'v2a', ar: 'مَشَى', nl: 'hij liep', tense: 'past' },
        { id: 'v2b', ar: 'جَلَسَ', nl: 'hij zat', tense: 'past' },
        { id: 'v2c', ar: 'قَامَ', nl: 'hij stond op', tense: 'past' },
        { id: 'v2d', ar: 'نَامَ', nl: 'hij sliep', tense: 'past' }
      ],
      sentences: []
    },
    {
      n: 3,
      title: 'Korte zinnen: gaan',
      focus: 'past',
      tip: 'Nu zinnen: werkwoord eerst, daarna wie. ذَهَبَ مُحَمَّدٌ = Mohammed ging.',
      verbs: [
        { id: 'v3a', ar: 'ذَهَبَ', nl: 'hij ging', tense: 'past' },
        { id: 'v3b', ar: 'جَاءَ', nl: 'hij kwam', tense: 'past' },
        { id: 'v3c', ar: 'خَرَجَ', nl: 'hij ging naar buiten', tense: 'past' }
      ],
      sentences: [
        { id: 's3a', ar: 'ذَهَبَ مُحَمَّدٌ.', nl: 'Mohammed ging.', words: ['ذَهَبَ', 'مُحَمَّدٌ'] },
        { id: 's3b', ar: 'جَاءَ الْوَلَدُ.', nl: 'De jongen kwam.', words: ['جَاءَ', 'الْوَلَدُ'] },
        { id: 's3c', ar: 'خَرَجَ الطَّالِبُ.', nl: 'De student ging naar buiten.', words: ['خَرَجَ', 'الطَّالِبُ'] },
        { id: 's3d', ar: 'ذَهَبَ مُحَمَّدٌ إِلَى الْمَسْجِدِ.', nl: 'Mohammed ging naar de moskee.', words: ['ذَهَبَ', 'مُحَمَّدٌ', 'إِلَى', 'الْمَسْجِدِ'] }
      ]
    },
    {
      n: 4,
      title: 'Zinnen: zitten en slapen',
      focus: 'past',
      tip: 'Zelfde patroon met جَلَسَ، قَامَ، نَامَ.',
      verbs: [
        { id: 'v4a', ar: 'جَلَسَ', nl: 'hij zat', tense: 'past' },
        { id: 'v4b', ar: 'قَامَ', nl: 'hij stond op', tense: 'past' },
        { id: 'v4c', ar: 'نَامَ', nl: 'hij sliep', tense: 'past' },
        { id: 'v4d', ar: 'مَشَى', nl: 'hij liep', tense: 'past' }
      ],
      sentences: [
        { id: 's4a', ar: 'جَلَسَ الطَّالِبُ.', nl: 'De student zat.', words: ['جَلَسَ', 'الطَّالِبُ'] },
        { id: 's4b', ar: 'قَامَ الْوَلَدُ.', nl: 'De jongen stond op.', words: ['قَامَ', 'الْوَلَدُ'] },
        { id: 's4c', ar: 'نَامَ الطِّفْلُ.', nl: 'Het kind sliep.', words: ['نَامَ', 'الطِّفْلُ'] },
        { id: 's4d', ar: 'جَلَسَ مُحَمَّدٌ عَلَى الْكُرْسِيِّ.', nl: 'Mohammed zat op de stoel.', words: ['جَلَسَ', 'مُحَمَّدٌ', 'عَلَى', 'الْكُرْسِيِّ'] }
      ]
    },
    {
      n: 5,
      title: 'Openen en sluiten',
      focus: 'past',
      tip: 'Werkwoord + voorwerp: فَتَحَ الْبَابَ = hij opende de deur.',
      verbs: [
        { id: 'v5a', ar: 'فَتَحَ', nl: 'hij opende', tense: 'past' },
        { id: 'v5b', ar: 'أَغْلَقَ', nl: 'hij sloot', tense: 'past' },
        { id: 'v5c', ar: 'كَسَرَ', nl: 'hij brak', tense: 'past' }
      ],
      sentences: [
        { id: 's5a', ar: 'فَتَحَ الْوَلَدُ الْبَابَ.', nl: 'De jongen opende de deur.', words: ['فَتَحَ', 'الْوَلَدُ', 'الْبَابَ'] },
        { id: 's5b', ar: 'أَغْلَقَ مُحَمَّدٌ الْبَابَ.', nl: 'Mohammed sloot de deur.', words: ['أَغْلَقَ', 'مُحَمَّدٌ', 'الْبَابَ'] },
        { id: 's5c', ar: 'فَتَحَ الطَّالِبُ الْكِتَابَ.', nl: 'De student opende het boek.', words: ['فَتَحَ', 'الطَّالِبُ', 'الْكِتَابَ'] },
        { id: 's5d', ar: 'كَسَرَ الْوَلَدُ الْقَلَمَ.', nl: 'De jongen brak de pen.', words: ['كَسَرَ', 'الْوَلَدُ', 'الْقَلَمَ'] }
      ]
    },
    {
      n: 6,
      title: 'Schrijven en lezen',
      focus: 'past',
      tip: 'كَتَبَ en قَرَأَ met een voorwerp (les, boek).',
      verbs: [
        { id: 'v6a', ar: 'كَتَبَ', nl: 'hij schreef', tense: 'past' },
        { id: 'v6b', ar: 'قَرَأَ', nl: 'hij las', tense: 'past' },
        { id: 'v6c', ar: 'فَهِمَ', nl: 'hij begreep', tense: 'past' }
      ],
      sentences: [
        { id: 's6a', ar: 'كَتَبَ الطَّالِبُ الدَّرْسَ.', nl: 'De student schreef de les.', words: ['كَتَبَ', 'الطَّالِبُ', 'الدَّرْسَ'] },
        { id: 's6b', ar: 'قَرَأَ مُحَمَّدٌ الْكِتَابَ.', nl: 'Mohammed las het boek.', words: ['قَرَأَ', 'مُحَمَّدٌ', 'الْكِتَابَ'] },
        { id: 's6c', ar: 'كَتَبَ الْمُدَرِّسُ عَلَى السَّبُّورَةِ.', nl: 'De leraar schreef op het bord.', words: ['كَتَبَ', 'الْمُدَرِّسُ', 'عَلَى', 'السَّبُّورَةِ'] },
        { id: 's6d', ar: 'فَهِمَ الطَّالِبُ الدَّرْسَ.', nl: 'De student begreep de les.', words: ['فَهِمَ', 'الطَّالِبُ', 'الدَّرْسَ'] }
      ]
    },
    {
      n: 7,
      title: 'Eten en drinken',
      focus: 'past',
      tip: 'أَكَلَ (at) en شَرِبَ (dronk).',
      verbs: [
        { id: 'v7a', ar: 'أَكَلَ', nl: 'hij at', tense: 'past' },
        { id: 'v7b', ar: 'شَرِبَ', nl: 'hij dronk', tense: 'past' },
        { id: 'v7c', ar: 'أَخَذَ', nl: 'hij nam', tense: 'past' }
      ],
      sentences: [
        { id: 's7a', ar: 'أَكَلَ الْوَلَدُ تُفَّاحًا.', nl: 'De jongen at een appel.', words: ['أَكَلَ', 'الْوَلَدُ', 'تُفَّاحًا'] },
        { id: 's7b', ar: 'شَرِبَ مُحَمَّدٌ مَاءً.', nl: 'Mohammed dronk water.', words: ['شَرِبَ', 'مُحَمَّدٌ', 'مَاءً'] },
        { id: 's7c', ar: 'أَخَذَ الطَّالِبُ الْكِتَابَ.', nl: 'De student nam het boek.', words: ['أَخَذَ', 'الطَّالِبُ', 'الْكِتَابَ'] },
        { id: 's7d', ar: 'شَرِبَ الْوَلَدُ الْحَلِيبَ.', nl: 'De jongen dronk de melk.', words: ['شَرِبَ', 'الْوَلَدُ', 'الْحَلِيبَ'] }
      ]
    },
    {
      n: 8,
      title: 'Heden: hij gaat',
      focus: 'present',
      tip: 'Tegenwoordige tijd: يَذْهَبُ = hij gaat. Let op يَـ vooraan.',
      verbs: [
        { id: 'v8a', ar: 'يَذْهَبُ', nl: 'hij gaat', tense: 'present' },
        { id: 'v8b', ar: 'يَجِيءُ', nl: 'hij komt', tense: 'present' },
        { id: 'v8c', ar: 'يَخْرُجُ', nl: 'hij gaat naar buiten', tense: 'present' },
        { id: 'v8d', ar: 'يَدْخُلُ', nl: 'hij komt binnen', tense: 'present' }
      ],
      pairs: [
        { past: 'ذَهَبَ', present: 'يَذْهَبُ', nl: 'gaan' },
        { past: 'جَاءَ', present: 'يَجِيءُ', nl: 'komen' },
        { past: 'خَرَجَ', present: 'يَخْرُجُ', nl: 'naar buiten gaan' },
        { past: 'دَخَلَ', present: 'يَدْخُلُ', nl: 'binnenkomen' }
      ],
      sentences: [
        { id: 's8a', ar: 'يَذْهَبُ مُحَمَّدٌ إِلَى الْمَسْجِدِ.', nl: 'Mohammed gaat naar de moskee.', words: ['يَذْهَبُ', 'مُحَمَّدٌ', 'إِلَى', 'الْمَسْجِدِ'] },
        { id: 's8b', ar: 'يَخْرُجُ الْوَلَدُ مِنَ الْبَيْتِ.', nl: 'De jongen gaat uit het huis.', words: ['يَخْرُجُ', 'الْوَلَدُ', 'مِنَ', 'الْبَيْتِ'] },
        { id: 's8c', ar: 'يَدْخُلُ الطَّالِبُ الْفَصْلَ.', nl: 'De student komt de klas binnen.', words: ['يَدْخُلُ', 'الطَّالِبُ', 'الْفَصْلَ'] }
      ]
    },
    {
      n: 9,
      title: 'Heden: doen',
      focus: 'present',
      tip: 'يَكْتُبُ / يَقْرَأُ / يَفْتَحُ — heden van schrijven, lezen, openen.',
      verbs: [
        { id: 'v9a', ar: 'يَكْتُبُ', nl: 'hij schrijft', tense: 'present' },
        { id: 'v9b', ar: 'يَقْرَأُ', nl: 'hij leest', tense: 'present' },
        { id: 'v9c', ar: 'يَفْتَحُ', nl: 'hij opent', tense: 'present' },
        { id: 'v9d', ar: 'يَجْلِسُ', nl: 'hij zit', tense: 'present' }
      ],
      pairs: [
        { past: 'كَتَبَ', present: 'يَكْتُبُ', nl: 'schrijven' },
        { past: 'قَرَأَ', present: 'يَقْرَأُ', nl: 'lezen' },
        { past: 'فَتَحَ', present: 'يَفْتَحُ', nl: 'openen' },
        { past: 'جَلَسَ', present: 'يَجْلِسُ', nl: 'zitten' }
      ],
      sentences: [
        { id: 's9a', ar: 'يَكْتُبُ الطَّالِبُ الدَّرْسَ.', nl: 'De student schrijft de les.', words: ['يَكْتُبُ', 'الطَّالِبُ', 'الدَّرْسَ'] },
        { id: 's9b', ar: 'يَقْرَأُ مُحَمَّدٌ الْكِتَابَ.', nl: 'Mohammed leest het boek.', words: ['يَقْرَأُ', 'مُحَمَّدٌ', 'الْكِتَابَ'] },
        { id: 's9c', ar: 'يَفْتَحُ الْوَلَدُ الْبَابَ.', nl: 'De jongen opent de deur.', words: ['يَفْتَحُ', 'الْوَلَدُ', 'الْبَابَ'] },
        { id: 's9d', ar: 'يَجْلِسُ مُحَمَّدٌ عَلَى الْكُرْسِيِّ.', nl: 'Mohammed zit op de stoel.', words: ['يَجْلِسُ', 'مُحَمَّدٌ', 'عَلَى', 'الْكُرْسِيِّ'] }
      ]
    },
    {
      n: 10,
      title: 'Verleden of heden?',
      focus: 'contrast',
      tip: 'يَـ vooraan ≈ heden. Zonder يَـ met a-klanken ≈ verleden.',
      verbs: [
        { id: 'v10a', ar: 'ذَهَبَ', nl: 'hij ging', tense: 'past' },
        { id: 'v10b', ar: 'يَذْهَبُ', nl: 'hij gaat', tense: 'present' },
        { id: 'v10c', ar: 'كَتَبَ', nl: 'hij schreef', tense: 'past' },
        { id: 'v10d', ar: 'يَكْتُبُ', nl: 'hij schrijft', tense: 'present' }
      ],
      pairs: [
        { past: 'ذَهَبَ', present: 'يَذْهَبُ', nl: 'gaan' },
        { past: 'كَتَبَ', present: 'يَكْتُبُ', nl: 'schrijven' },
        { past: 'جَلَسَ', present: 'يَجْلِسُ', nl: 'zitten' },
        { past: 'قَرَأَ', present: 'يَقْرَأُ', nl: 'lezen' }
      ],
      sentences: [
        { id: 's10a', ar: 'ذَهَبَ مُحَمَّدٌ إِلَى السُّوقِ.', nl: 'Mohammed ging naar de markt.', words: ['ذَهَبَ', 'مُحَمَّدٌ', 'إِلَى', 'السُّوقِ'] },
        { id: 's10b', ar: 'يَذْهَبُ مُحَمَّدٌ إِلَى السُّوقِ.', nl: 'Mohammed gaat naar de markt.', words: ['يَذْهَبُ', 'مُحَمَّدٌ', 'إِلَى', 'السُّوقِ'] },
        { id: 's10c', ar: 'كَتَبَ الطَّالِبُ رِسَالَةً.', nl: 'De student schreef een brief.', words: ['كَتَبَ', 'الطَّالِبُ', 'رِسَالَةً'] },
        { id: 's10d', ar: 'يَكْتُبُ الطَّالِبُ رِسَالَةً.', nl: 'De student schrijft een brief.', words: ['يَكْتُبُ', 'الطَّالِبُ', 'رِسَالَةً'] }
      ]
    },
    {
      n: 11,
      title: 'Meer contrast',
      focus: 'contrast',
      tip: 'Kies de tijd die bij de Nederlandse zin past.',
      verbs: [
        { id: 'v11a', ar: 'خَرَجَ', nl: 'hij ging naar buiten', tense: 'past' },
        { id: 'v11b', ar: 'يَخْرُجُ', nl: 'hij gaat naar buiten', tense: 'present' },
        { id: 'v11c', ar: 'فَتَحَ', nl: 'hij opende', tense: 'past' },
        { id: 'v11d', ar: 'يَفْتَحُ', nl: 'hij opent', tense: 'present' }
      ],
      pairs: [
        { past: 'خَرَجَ', present: 'يَخْرُجُ', nl: 'naar buiten gaan' },
        { past: 'فَتَحَ', present: 'يَفْتَحُ', nl: 'openen' },
        { past: 'شَرِبَ', present: 'يَشْرَبُ', nl: 'drinken' },
        { past: 'أَكَلَ', present: 'يَأْكُلُ', nl: 'eten' }
      ],
      sentences: [
        { id: 's11a', ar: 'خَرَجَ الْمُدَرِّسُ مِنَ الْفَصْلِ.', nl: 'De leraar ging uit de klas.', words: ['خَرَجَ', 'الْمُدَرِّسُ', 'مِنَ', 'الْفَصْلِ'] },
        { id: 's11b', ar: 'يَخْرُجُ الْمُدَرِّسُ مِنَ الْفَصْلِ.', nl: 'De leraar gaat uit de klas.', words: ['يَخْرُجُ', 'الْمُدَرِّسُ', 'مِنَ', 'الْفَصْلِ'] },
        { id: 's11c', ar: 'فَتَحَتْ فَاطِمَةُ الْبَابَ.', nl: 'Fatima opende de deur.', words: ['فَتَحَتْ', 'فَاطِمَةُ', 'الْبَابَ'] },
        { id: 's11d', ar: 'تَفْتَحُ فَاطِمَةُ الْبَابَ.', nl: 'Fatima opent de deur.', words: ['تَفْتَحُ', 'فَاطِمَةُ', 'الْبَابَ'] }
      ]
    },
    {
      n: 12,
      title: 'Herhaling: alles',
      focus: 'mixed',
      tip: 'Laatste ronde: werkwoorden en zinnen door elkaar, verleden én heden.',
      verbs: [
        { id: 'v12a', ar: 'سَمِعَ', nl: 'hij hoorde', tense: 'past' },
        { id: 'v12b', ar: 'يَسْمَعُ', nl: 'hij hoort', tense: 'present' },
        { id: 'v12c', ar: 'قَالَ', nl: 'hij zei', tense: 'past' },
        { id: 'v12d', ar: 'يَقُولُ', nl: 'hij zegt', tense: 'present' }
      ],
      pairs: [
        { past: 'سَمِعَ', present: 'يَسْمَعُ', nl: 'horen' },
        { past: 'قَالَ', present: 'يَقُولُ', nl: 'zeggen' },
        { past: 'ذَهَبَ', present: 'يَذْهَبُ', nl: 'gaan' }
      ],
      sentences: [
        { id: 's12a', ar: 'سَمِعَ الطَّالِبُ الدَّرْسَ.', nl: 'De student hoorde de les.', words: ['سَمِعَ', 'الطَّالِبُ', 'الدَّرْسَ'] },
        { id: 's12b', ar: 'يَسْمَعُ الطَّالِبُ الْقُرْآنَ.', nl: 'De student hoort de Koran.', words: ['يَسْمَعُ', 'الطَّالِبُ', 'الْقُرْآنَ'] },
        { id: 's12c', ar: 'قَالَ مُحَمَّدٌ الْحَقَّ.', nl: 'Mohammed zei de waarheid.', words: ['قَالَ', 'مُحَمَّدٌ', 'الْحَقَّ'] },
        { id: 's12d', ar: 'ذَهَبَتْ فَاطِمَةُ إِلَى الْجَامِعَةِ.', nl: 'Fatima ging naar de universiteit.', words: ['ذَهَبَتْ', 'فَاطِمَةُ', 'إِلَى', 'الْجَامِعَةِ'] }
      ]
    }
  ]
};
