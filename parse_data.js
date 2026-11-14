/* Zinsontleding-data Medina Boek 1 — alleen grammaticale, gecontroleerde zinnen */
window.PARSE_DATA = {
  ROLES: {
    mubtada:      { ar: 'مُبْتَدَأٌ',        nl: 'mubtadaʾ',     color: '#2563eb' },
    khabar:       { ar: 'خَبَرٌ',          nl: 'khabar',       color: '#16a34a' },
    ishara:       { ar: 'اسْمُ إِشَارَةٍ', nl: 'ishāra',       color: '#7c3aed' },
    jar:          { ar: 'حَرْفُ جَرٍّ',    nl: 'ḥarf jar',     color: '#c2410c' },
    majrur:       { ar: 'مَجْرُورٌ',       nl: 'majrūr',       color: '#ea580c' },
    mudaaf:       { ar: 'مُضَافٌ',         nl: 'muḍāf',        color: '#0891b2' },
    mudaaf_ilayh: { ar: 'مُضَافٌ إِلَيْهِ', nl: 'muḍāf ilayh', color: '#0e7490' },
    naat:         { ar: 'نَعْتٌ',          nl: 'naʿt',         color: '#db2777' },
    manuut:       { ar: 'مَنْعُوتٌ',       nl: 'manʿūt',       color: '#be185d' },
    badal:        { ar: 'بَدَلٌ',          nl: 'badal',        color: '#9333ea' },
    mubdal:       { ar: 'مُبْدَلٌ مِنْهُ', nl: 'mubdal',       color: '#7e22ce' },
    fail:         { ar: 'فَاعِلٌ',         nl: 'fāʿil',        color: '#15803d' },
    fiil:         { ar: 'فِعْلٌ',          nl: 'fiʿl',         color: '#166534' },
    mafool:       { ar: 'مَفْعُولٌ بِهِ',  nl: 'mafʿūl',       color: '#854d0e' },
    harf:         { ar: 'حَرْفٌ',          nl: 'ḥarf',         color: '#64748b' },
    damir:        { ar: 'ضَمِيرٌ',         nl: 'ḍamīr',        color: '#475569' }
  },
  rolesForLesson: function (n) {
    var b = ['mubtada', 'khabar', 'ishara'];
    if (n >= 2) b.push('harf');
    if (n >= 4) b.push('jar', 'majrur', 'damir');
    if (n >= 5) b.push('mudaaf', 'mudaaf_ilayh');
    if (n >= 8) b.push('badal', 'mubdal');
    if (n >= 9) b.push('naat', 'manuut');
    if (n >= 11) b.push('fiil', 'fail', 'mafool');
    return b;
  },
  SENTENCES: {
    /* Les 1: هَذَا + ism nakira = mubtada (ishara) + khabar */
    1: [
      { tokens: [{ t: 'هَذَا', r: 'ishara' }, { t: 'كِتَابٌ', r: 'khabar' }] },
      { tokens: [{ t: 'هَذَا', r: 'ishara' }, { t: 'قَلَمٌ', r: 'khabar' }] },
      { tokens: [{ t: 'هَذَا', r: 'ishara' }, { t: 'بَيْتٌ', r: 'khabar' }] },
      { tokens: [{ t: 'هَذَا', r: 'ishara' }, { t: 'مَسْجِدٌ', r: 'khabar' }] }
    ],
    /* Les 2: ذَلِكَ + وَ */
    2: [
      { tokens: [{ t: 'ذَلِكَ', r: 'ishara' }, { t: 'مَسْجِدٌ', r: 'khabar' }] },
      { tokens: [{ t: 'ذَلِكَ', r: 'ishara' }, { t: 'بَيْتٌ', r: 'khabar' }] },
      { tokens: [{ t: 'هَذَا', r: 'ishara' }, { t: 'كِتَابٌ', r: 'khabar' }, { t: 'وَ', r: 'harf' }, { t: 'ذَلِكَ', r: 'ishara' }, { t: 'قَلَمٌ', r: 'khabar' }] }
    ],
    /* Les 3: mubtada maʿrifa + khabar nakira/sifa */
    3: [
      { tokens: [{ t: 'الْكِتَابُ', r: 'mubtada' }, { t: 'جَدِيدٌ', r: 'khabar' }] },
      { tokens: [{ t: 'الْمَسْجِدُ', r: 'mubtada' }, { t: 'كَبِيرٌ', r: 'khabar' }] },
      { tokens: [{ t: 'الْقَلَمُ', r: 'mubtada' }, { t: 'طَوِيلٌ', r: 'khabar' }] },
      { tokens: [{ t: 'الْبَيْتُ', r: 'mubtada' }, { t: 'مَفْتُوحٌ', r: 'khabar' }] }
    ],
    /* Les 4: mubtada + jar + majrur (khabar shibh jumlah) */
    4: [
      { tokens: [{ t: 'الْكِتَابُ', r: 'mubtada' }, { t: 'عَلَى', r: 'jar' }, { t: 'الْمَكْتَبِ', r: 'majrur' }] },
      { tokens: [{ t: 'مُحَمَّدٌ', r: 'mubtada' }, { t: 'فِي', r: 'jar' }, { t: 'الْغُرْفَةِ', r: 'majrur' }] },
      { tokens: [{ t: 'هُوَ', r: 'damir' }, { t: 'فِي', r: 'jar' }, { t: 'الْمَسْجِدِ', r: 'majrur' }] },
      { tokens: [{ t: 'الْقَلَمُ', r: 'mubtada' }, { t: 'فِي', r: 'jar' }, { t: 'الْحَقِيبَةِ', r: 'majrur' }] }
    ],
    /* Les 5: idafa (mudaaf + mudaaf ilayh) + khabar */
    5: [
      { tokens: [{ t: 'كِتَابُ', r: 'mudaaf' }, { t: 'مُحَمَّدٍ', r: 'mudaaf_ilayh' }, { t: 'جَدِيدٌ', r: 'khabar' }] },
      { tokens: [{ t: 'مَكْتَبُ', r: 'mudaaf' }, { t: 'الْمُدَرِّسِ', r: 'mudaaf_ilayh' }, { t: 'كَبِيرٌ', r: 'khabar' }] },
      { tokens: [{ t: 'بَابُ', r: 'mudaaf' }, { t: 'الْبَيْتِ', r: 'mudaaf_ilayh' }, { t: 'مَفْتُوحٌ', r: 'khabar' }] },
      { tokens: [{ t: 'قَلَمُ', r: 'mudaaf' }, { t: 'الطَّالِبِ', r: 'mudaaf_ilayh' }, { t: 'طَوِيلٌ', r: 'khabar' }] }
    ],
    /* Les 6: هَذِهِ (mu'annath) */
    6: [
      { tokens: [{ t: 'هَذِهِ', r: 'ishara' }, { t: 'مَدْرَسَةٌ', r: 'khabar' }] },
      { tokens: [{ t: 'هَذِهِ', r: 'ishara' }, { t: 'سَيَّارَةٌ', r: 'khabar' }] },
      { tokens: [{ t: 'هَذَا', r: 'ishara' }, { t: 'قَلَمٌ', r: 'khabar' }, { t: 'وَ', r: 'harf' }, { t: 'هَذِهِ', r: 'ishara' }, { t: 'مِلْعَقَةٌ', r: 'khabar' }] }
    ],
    /* Les 7: تِلْكَ / ذَلِكَ */
    7: [
      { tokens: [{ t: 'تِلْكَ', r: 'ishara' }, { t: 'جَامِعَةٌ', r: 'khabar' }] },
      { tokens: [{ t: 'تِلْكَ', r: 'ishara' }, { t: 'سَاعَةٌ', r: 'khabar' }] },
      { tokens: [{ t: 'ذَلِكَ', r: 'ishara' }, { t: 'حِمَارٌ', r: 'khabar' }, { t: 'وَ', r: 'harf' }, { t: 'تِلْكَ', r: 'ishara' }, { t: 'بَقَرَةٌ', r: 'khabar' }] }
    ],
    /* Les 8: badal — هذا الرجلُ تاجرٌ */
    8: [
      { tokens: [{ t: 'هَذَا', r: 'mubdal' }, { t: 'الرَّجُلُ', r: 'badal' }, { t: 'تَاجِرٌ', r: 'khabar' }] },
      { tokens: [{ t: 'ذَلِكَ', r: 'mubdal' }, { t: 'الْكِتَابُ', r: 'badal' }, { t: 'جَدِيدٌ', r: 'khabar' }] },
      { tokens: [{ t: 'هَذَا', r: 'mubdal' }, { t: 'الْوَلَدُ', r: 'badal' }, { t: 'طَالِبٌ', r: 'khabar' }] }
    ],
    /* Les 9: naʿt — manʿūt + naʿt (agreement) */
    9: [
      { tokens: [{ t: 'هَذَا', r: 'ishara' }, { t: 'كِتَابٌ', r: 'manuut' }, { t: 'جَدِيدٌ', r: 'naat' }] },
      { tokens: [{ t: 'الْبَيْتُ', r: 'mubtada' }, { t: 'الْكَبِيرُ', r: 'naat' }, { t: 'جَمِيلٌ', r: 'khabar' }] },
      { tokens: [{ t: 'هَذَا', r: 'ishara' }, { t: 'قَلَمٌ', r: 'manuut' }, { t: 'طَوِيلٌ', r: 'naat' }] },
      { tokens: [{ t: 'الطَّالِبُ', r: 'mubtada' }, { t: 'الْمُجْتَهِدُ', r: 'naat' }, { t: 'نَاجِحٌ', r: 'khabar' }] }
    ],
    /* Les 10: idafa with pronoun (connected) */
    10: [
      { tokens: [{ t: 'كِتَابِي', r: 'mubtada' }, { t: 'جَدِيدٌ', r: 'khabar' }] },
      { tokens: [{ t: 'قَلَمُكَ', r: 'mubtada' }, { t: 'طَوِيلٌ', r: 'khabar' }] },
      { tokens: [{ t: 'بَيْتُهُ', r: 'mubtada' }, { t: 'كَبِيرٌ', r: 'khabar' }] },
      { tokens: [{ t: 'مَدْرَسَتُهَا', r: 'mubtada' }, { t: 'جَمِيلَةٌ', r: 'khabar' }] }
    ],
    /* Les 11+: fiʿl + fāʿil (+ mafʿūl) — korte Medina-achtige zinnen */
    11: [
      { tokens: [{ t: 'ذَهَبَ', r: 'fiil' }, { t: 'مُحَمَّدٌ', r: 'fail' }] },
      { tokens: [{ t: 'جَلَسَ', r: 'fiil' }, { t: 'الطَّالِبُ', r: 'fail' }] },
      { tokens: [{ t: 'خَرَجَ', r: 'fiil' }, { t: 'الْمُدَرِّسُ', r: 'fail' }] }
    ],
    12: [
      { tokens: [{ t: 'فَتَحَ', r: 'fiil' }, { t: 'مُحَمَّدٌ', r: 'fail' }, { t: 'الْبَابَ', r: 'mafool' }] },
      { tokens: [{ t: 'كَتَبَ', r: 'fiil' }, { t: 'الطَّالِبُ', r: 'fail' }, { t: 'الدَّرْسَ', r: 'mafool' }] },
      { tokens: [{ t: 'قَرَأَ', r: 'fiil' }, { t: 'الْوَلَدُ', r: 'fail' }, { t: 'الْكِتَابَ', r: 'mafool' }] }
    ],
    13: [
      { tokens: [{ t: 'ذَهَبَ', r: 'fiil' }, { t: 'مُحَمَّدٌ', r: 'fail' }, { t: 'إِلَى', r: 'jar' }, { t: 'الْمَسْجِدِ', r: 'majrur' }] },
      { tokens: [{ t: 'جَلَسَ', r: 'fiil' }, { t: 'الطَّالِبُ', r: 'fail' }, { t: 'عَلَى', r: 'jar' }, { t: 'الْكُرْسِيِّ', r: 'majrur' }] }
    ],
    14: [
      { tokens: [{ t: 'هَذَا', r: 'ishara' }, { t: 'كِتَابٌ', r: 'khabar' }] },
      { tokens: [{ t: 'الْكِتَابُ', r: 'mubtada' }, { t: 'عَلَى', r: 'jar' }, { t: 'الْمَكْتَبِ', r: 'majrur' }] },
      { tokens: [{ t: 'فَتَحَ', r: 'fiil' }, { t: 'الْوَلَدُ', r: 'fail' }, { t: 'الْبَابَ', r: 'mafool' }] }
    ],
    15: [
      { tokens: [{ t: 'كِتَابُ', r: 'mudaaf' }, { t: 'الْمُدَرِّسِ', r: 'mudaaf_ilayh' }, { t: 'جَدِيدٌ', r: 'khabar' }] },
      { tokens: [{ t: 'الطَّالِبُ', r: 'mubtada' }, { t: 'الْمُجْتَهِدُ', r: 'naat' }, { t: 'فِي', r: 'jar' }, { t: 'الْفَصْلِ', r: 'majrur' }] }
    ],
    16: [
      { tokens: [{ t: 'هَذَا', r: 'mubdal' }, { t: 'الرَّجُلُ', r: 'badal' }, { t: 'تَاجِرٌ', r: 'khabar' }] },
      { tokens: [{ t: 'ذَهَبَ', r: 'fiil' }, { t: 'التَّاجِرُ', r: 'fail' }, { t: 'إِلَى', r: 'jar' }, { t: 'السُّوقِ', r: 'majrur' }] }
    ],
    17: [
      { tokens: [{ t: 'قَرَأَ', r: 'fiil' }, { t: 'مُحَمَّدٌ', r: 'fail' }, { t: 'كِتَابًا', r: 'mafool' }] },
      { tokens: [{ t: 'كَتَبَ', r: 'fiil' }, { t: 'الطَّالِبُ', r: 'fail' }, { t: 'رِسَالَةً', r: 'mafool' }] }
    ],
    18: [
      { tokens: [{ t: 'الْمُدَرِّسُ', r: 'mubtada' }, { t: 'فِي', r: 'jar' }, { t: 'الْمَدْرَسَةِ', r: 'majrur' }] },
      { tokens: [{ t: 'بَابُ', r: 'mudaaf' }, { t: 'الْمَسْجِدِ', r: 'mudaaf_ilayh' }, { t: 'مَفْتُوحٌ', r: 'khabar' }] }
    ],
    19: [
      { tokens: [{ t: 'هَذِهِ', r: 'ishara' }, { t: 'مَدْرَسَةٌ', r: 'manuut' }, { t: 'كَبِيرَةٌ', r: 'naat' }] },
      { tokens: [{ t: 'تِلْكَ', r: 'ishara' }, { t: 'سَيَّارَةٌ', r: 'manuut' }, { t: 'جَدِيدَةٌ', r: 'naat' }] }
    ],
    20: [
      { tokens: [{ t: 'كِتَابِي', r: 'mubtada' }, { t: 'عَلَى', r: 'jar' }, { t: 'الْمَكْتَبِ', r: 'majrur' }] },
      { tokens: [{ t: 'قَلَمُهُ', r: 'mubtada' }, { t: 'فِي', r: 'jar' }, { t: 'الْحَقِيبَةِ', r: 'majrur' }] }
    ],
    21: [
      { tokens: [{ t: 'خَرَجَ', r: 'fiil' }, { t: 'الطُّلَّابُ', r: 'fail' }, { t: 'مِنَ', r: 'jar' }, { t: 'الْفَصْلِ', r: 'majrur' }] },
      { tokens: [{ t: 'دَخَلَ', r: 'fiil' }, { t: 'الْمُدَرِّسُ', r: 'fail' }, { t: 'الْفَصْلَ', r: 'mafool' }] }
    ],
    22: [
      { tokens: [{ t: 'هَذَا', r: 'ishara' }, { t: 'كِتَابُ', r: 'mudaaf' }, { t: 'مُحَمَّدٍ', r: 'mudaaf_ilayh' }] },
      { tokens: [{ t: 'ذَلِكَ', r: 'ishara' }, { t: 'بَيْتُ', r: 'mudaaf' }, { t: 'الطَّالِبِ', r: 'mudaaf_ilayh' }] }
    ],
    23: [
      { tokens: [{ t: 'فَتَحَ', r: 'fiil' }, { t: 'الْوَلَدُ', r: 'fail' }, { t: 'الْبَابَ', r: 'mafool' }] },
      { tokens: [{ t: 'الْكِتَابُ', r: 'mubtada' }, { t: 'الْجَدِيدُ', r: 'naat' }, { t: 'عَلَى', r: 'jar' }, { t: 'الْمَكْتَبِ', r: 'majrur' }] },
      { tokens: [{ t: 'هَذَا', r: 'mubdal' }, { t: 'الرَّجُلُ', r: 'badal' }, { t: 'مُدَرِّسٌ', r: 'khabar' }] }
    ]
  }
};
