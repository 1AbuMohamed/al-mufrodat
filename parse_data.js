/* Zinsontleding-data Medina Boek 1 */
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
    if (n >= 4) b.push('jar', 'majrur', 'damir');
    if (n >= 5) b.push('mudaaf', 'mudaaf_ilayh');
    if (n >= 8) b.push('badal', 'mubdal');
    if (n >= 9) b.push('naat', 'manuut');
    if (n >= 11) b.push('fiil', 'fail', 'mafool', 'harf');
    return b;
  },
  SENTENCES: {
    1: [
      { tokens: [{ t: 'هَذَا', r: 'ishara' }, { t: 'كِتَابٌ', r: 'khabar' }] },
      { tokens: [{ t: 'هَذَا', r: 'ishara' }, { t: 'قَلَمٌ', r: 'khabar' }] },
      { tokens: [{ t: 'هَذَا', r: 'mubtada' }, { t: 'بَيْتٌ', r: 'khabar' }] }
    ],
    2: [
      { tokens: [{ t: 'ذَلِكَ', r: 'ishara' }, { t: 'مَسْجِدٌ', r: 'khabar' }] },
      { tokens: [{ t: 'هَذَا', r: 'ishara' }, { t: 'سُكَّرٌ', r: 'khabar' }, { t: 'وَ', r: 'harf' }, { t: 'ذَلِكَ', r: 'ishara' }, { t: 'لَبَنٌ', r: 'khabar' }] }
    ],
    3: [
      { tokens: [{ t: 'الْكِتَابُ', r: 'mubtada' }, { t: 'جَدِيدٌ', r: 'khabar' }] },
      { tokens: [{ t: 'الْمَسْجِدُ', r: 'mubtada' }, { t: 'كَبِيرٌ', r: 'khabar' }] },
      { tokens: [{ t: 'الْقَلَمُ', r: 'mubtada' }, { t: 'طَوِيلٌ', r: 'khabar' }] }
    ],
    4: [
      { tokens: [{ t: 'الْكِتَابُ', r: 'mubtada' }, { t: 'عَلَى', r: 'jar' }, { t: 'الْمَكْتَبِ', r: 'majrur' }] },
      { tokens: [{ t: 'مُحَمَّدٌ', r: 'mubtada' }, { t: 'فِي', r: 'jar' }, { t: 'الْغُرْفَةِ', r: 'majrur' }] },
      { tokens: [{ t: 'هُوَ', r: 'damir' }, { t: 'فِي', r: 'jar' }, { t: 'الْمَسْجِدِ', r: 'majrur' }] }
    ],
    5: [
      { tokens: [{ t: 'كِتَابُ', r: 'mudaaf' }, { t: 'مُحَمَّدٍ', r: 'mudaaf_ilayh' }, { t: 'جَدِيدٌ', r: 'khabar' }] },
      { tokens: [{ t: 'مَكْتَبُ', r: 'mudaaf' }, { t: 'الْمُدَرِّسِ', r: 'mudaaf_ilayh' }, { t: 'كَبِيرٌ', r: 'khabar' }] },
      { tokens: [{ t: 'بَابُ', r: 'mudaaf' }, { t: 'الْبَيْتِ', r: 'mudaaf_ilayh' }, { t: 'مَفْتُوحٌ', r: 'khabar' }] }
    ],
    6: [
      { tokens: [{ t: 'هَذِهِ', r: 'ishara' }, { t: 'مَدْرَسَةٌ', r: 'khabar' }] },
      { tokens: [{ t: 'هَذَا', r: 'ishara' }, { t: 'قَلَمٌ', r: 'khabar' }, { t: 'وَ', r: 'harf' }, { t: 'هَذِهِ', r: 'ishara' }, { t: 'مِلْعَقَةٌ', r: 'khabar' }] }
    ],
    7: [
      { tokens: [{ t: 'تِلْكَ', r: 'ishara' }, { t: 'جَامِعَةٌ', r: 'khabar' }] },
      { tokens: [{ t: 'ذَلِكَ', r: 'ishara' }, { t: 'حِمَارٌ', r: 'khabar' }, { t: 'وَ', r: 'harf' }, { t: 'تِلْكَ', r: 'ishara' }, { t: 'بَقَرَةٌ', r: 'khabar' }] }
    ],
    8: [
      { tokens: [{ t: 'هَذَا', r: 'mubdal' }, { t: 'الرَّجُلُ', r: 'badal' }, { t: 'تَاجِرٌ', r: 'khabar' }] },
      { tokens: [{ t: 'ذَلِكَ', r: 'mubdal' }, { t: 'الْكِتَابُ', r: 'badal' }, { t: 'جَدِيدٌ', r: 'khabar' }] }
    ],
    9: [
      { tokens: [{ t: 'هَذَا', r: 'ishara' }, { t: 'كِتَابٌ', r: 'manuut' }, { t: 'جَدِيدٌ', r: 'naat' }] },
      { tokens: [{ t: 'الْبَيْتُ', r: 'manuut' }, { t: 'الْكَبِيرُ', r: 'naat' }, { t: 'جَمِيلٌ', r: 'khabar' }] },
      { tokens: [{ t: 'طَالِبٌ', r: 'manuut' }, { t: 'مُجْتَهِدٌ', r: 'naat' }, { t: 'نَاجِحٌ', r: 'khabar' }] }
    ],
    10: [
      { tokens: [{ t: 'كِتَابِي', r: 'mubtada' }, { t: 'جَدِيدٌ', r: 'khabar' }] },
      { tokens: [{ t: 'قَلَمُكَ', r: 'mubtada' }, { t: 'طَوِيلٌ', r: 'khabar' }] },
      { tokens: [{ t: 'بَيْتُهُ', r: 'mubtada' }, { t: 'كَبِيرٌ', r: 'khabar' }] }
    ]
  }
};
// Alleen zinnen met een gecontroleerde leskoppeling opnemen.
// Voor lessen 11–23 is nog geen betrouwbare, lesgebonden ontleding beschikbaar;
// de UI verbergt het onderdeel daar automatisch in plaats van herhaalde voorbeeldzinnen te tonen.
