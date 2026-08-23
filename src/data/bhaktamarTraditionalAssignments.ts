// Bhaktamar Stotra — traditional Digambar healing assignments for shlokas 25–47.
//
// Fills the gap left by BHAKTAMAR_SHLOKAS in sadhana.ts, which carries full
// remedial-matrix entries for shlokas 1–24, 45 and 48 only.
//
// Source: GAP_CLOSING_RESEARCH GR.1 — traditional lineage-dependent assignments
// (Manatunga Acharya, ~7th c. CE; NOT Agamic — devotional tradition).
// Confidence: PARTIAL. Shloka-level Sanskrit first-lines for 25–44 are
// [REQUIRES_RESEARCH] (needs OCR of a standard Digambar edition, e.g. Pt. Ratanlal
// Jain's "Bhaktamar Swadhyay") and are therefore intentionally NOT included here —
// this file never fabricates verse text. Once extracted, promote these rows into
// full BhaktamarShloka entries in sadhana.ts.

export interface TraditionalBhaktamarAssignment {
  shlokaNumber: number;
  name: string;                    // Hindi theme name
  targetKarma: string[];           // karma types addressed
  targetAffliction: string;        // Hindi affliction description
  riddhiKey?: string;              // traditional riddhi vibration key (only where attested)
  repetitionShloka: number;        // default jaap count (Digambar tradition: 108)
  direction: string;
  timeWindow: string;
  /** true until the Sanskrit first-line is OCR-verified from a print edition */
  sanskritVersePending: boolean;
}

const DAWN = 'प्रातःकाल ब्रह्म-मुहूर्त के पश्चात';
const EAST = 'पूर्व';

export const BHAKTAMAR_TRADITIONAL_ASSIGNMENTS: TraditionalBhaktamarAssignment[] = [
  {
    shlokaNumber: 25,
    name: 'शत्रु-विजय श्लोक',
    targetKarma: ['Antaraya'],
    targetAffliction: 'शत्रु-बाधा, प्रतिस्पर्धा-भय, अंतराय का वीर्य-अवरोध पक्ष',
    riddhiKey: 'ॐ ह्रीं अहं णमो शत्रु-विजयाय',
    repetitionShloka: 108,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 26,
    name: 'वन-देवता सुरक्षा श्लोक',
    targetKarma: ['Naam', 'Vedaniya'],
    targetAffliction: 'वन्य-प्राणी/यात्रा-भय, नाम-कर्म का असुरक्षा पक्ष',
    repetitionShloka: 108,
    direction: EAST,
    timeWindow: 'प्रवास से पूर्व',
    sanskritVersePending: true
  },
  {
    shlokaNumber: 27,
    name: 'अस्त्र-शस्त्र शमन श्लोक',
    targetKarma: ['Antaraya', 'Vedaniya'],
    targetAffliction: 'संघर्ष/न्यायालय/विवाद-जन्य संकट',
    repetitionShloka: 108,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 28,
    name: 'जल-यात्रा सुरक्षा श्लोक',
    targetKarma: ['Ayushya'],
    targetAffliction: 'समुद्र/जल-यात्रा के आयुष्य-संकट',
    repetitionShloka: 21,
    direction: EAST,
    timeWindow: 'जल-यात्रा से पूर्व',
    sanskritVersePending: true
  },
  {
    shlokaNumber: 29,
    name: 'अग्नि-शमन श्लोक',
    targetKarma: ['Vedaniya', 'Ayushya'],
    targetAffliction: 'अग्नि-संकट, दाह-जन्य ज्वर, असाता वेदनीय का उदय',
    riddhiKey: 'ॐ ह्रीं अहं णमो अग्नि-नाशकाय',
    repetitionShloka: 108,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 30,
    name: 'सर्प-विष निवारण श्लोक',
    targetKarma: ['Vedaniya', 'Ayushya'],
    targetAffliction: 'सर्प-दंश, विष-संक्रमण (२१ बार जल पर फुँककर पेय)',
    riddhiKey: 'ॐ ह्रीं अहं णमो विष-नाशकाय',
    repetitionShloka: 21,
    direction: EAST,
    timeWindow: 'आवश्यकता-क्षण में + दैनिक रक्षा हेतु प्रातःकाल',
    sanskritVersePending: true
  },
  {
    shlokaNumber: 31,
    name: 'बंधन-मुक्ति श्लोक',
    targetKarma: ['Antaraya', 'Gotra'],
    targetAffliction: 'कारागार/वैधिक बंधन, गोत्र-कर्म का नीच पक्ष',
    repetitionShloka: 108,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 32,
    name: 'सर्व-रोग निवारण श्लोक',
    targetKarma: ['Vedaniya', 'Naam'],
    targetAffliction: 'चिकित्सा-अपेक्षित सर्व-रोग, असाता वेदनीय का शारीरिक उदय',
    riddhiKey: 'ॐ ह्रीं अहं णमो रोग-नाशकाय',
    repetitionShloka: 108,
    direction: EAST,
    timeWindow: 'प्रातःकाल (सूर्योदय के साथ)',
    sanskritVersePending: true
  },
  {
    shlokaNumber: 33,
    name: 'दारिद्र्य-नाश श्लोक',
    targetKarma: ['Gotra', 'Antaraya'],
    targetAffliction: 'दारिद्र्य, ऋण, लाभ-अंतराय (दीपावली पखवाड़े में पाठ विशेष)',
    repetitionShloka: 108,
    direction: EAST,
    timeWindow: 'दीपावली-पखवाड़ा प्रातःकाल',
    sanskritVersePending: true
  },
  {
    shlokaNumber: 34,
    name: 'त्रिलोक-संकट हरण श्लोक',
    targetKarma: ['Mohaniya', 'Ayushya'],
    targetAffliction: 'तीनों लोकों की परिधि-जन्य सर्व-संकट, सर्व-आवरण',
    repetitionShloka: 108,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 35,
    name: 'ऋद्धि-सिद्धि प्रार्थना (क्रम १) — समृद्धि',
    targetKarma: ['Gotra'],
    targetAffliction: 'उच्च-गोत्र पुण्य-बंध, सांसारिक समृद्धि',
    repetitionShloka: 27,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 36,
    name: 'ऋद्धि-सिद्धि प्रार्थना (क्रम २) — सफलता',
    targetKarma: ['Antaraya'],
    targetAffliction: 'कार्य-सफलता में बाधक अंतराय',
    repetitionShloka: 27,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 37,
    name: 'ऋद्धि-सिद्धि प्रार्थना (क्रम ३) — यश',
    targetKarma: ['Naam'],
    targetAffliction: 'अयशःकीर्ति नाम-प्रकृति → यशःकीर्ति बंध',
    repetitionShloka: 27,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 38,
    name: 'ऋद्धि-सिद्धि प्रार्थना (क्रम ४) — संतान',
    targetKarma: ['Naam', 'Ayushya'],
    targetAffliction: 'संतान-संबंधी नाम/आयुष्य-बाधा',
    repetitionShloka: 27,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 39,
    name: 'ऋद्धि-सिद्धि प्रार्थना (क्रम ५) — वाणी-सिद्धि',
    targetKarma: ['Gyanavaraniya'],
    targetAffliction: 'वाणी-अड़चन, श्रुत-ज्ञानावरणीय',
    repetitionShloka: 27,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 40,
    name: 'ऋद्धि-सिद्धि प्रार्थना (क्रम ६) — समग्र कल्याण',
    targetKarma: ['Sarva karma kshay'],
    targetAffliction: 'समग्र कर्म-शमन एवं कुशल-मंगल',
    repetitionShloka: 27,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 41,
    name: 'मोक्ष-मार्ग निरूपण (क्रम १) — रत्नत्रय प्रेरणा',
    targetKarma: ['Mohaniya'],
    targetAffliction: 'मिथ्यात्व पक्ष — सम्यग्दर्शन का सुदृढ़ीकरण',
    repetitionShloka: 9,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 42,
    name: 'मोक्ष-मार्ग निरूपण (क्रम २) — तत्त्व-स्मरण',
    targetKarma: ['Gyanavaraniya', 'Darshanavaraniya'],
    targetAffliction: 'तत्त्व-विस्मृति, ज्ञान-दर्शन आवरण',
    repetitionShloka: 9,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 43,
    name: 'मोक्ष-मार्ग निरूपण (क्रम ३) — वीतराग आदर्श',
    targetKarma: ['Charitra Mohaniya'],
    targetAffliction: 'राग-द्वेष कषाय का उदीरण-प्रतिरोध',
    repetitionShloka: 9,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 44,
    name: 'मोक्ष-मार्ग निरूपण (क्रम ४) — अंतिम शुद्धि',
    targetKarma: ['Sarva karma kshay'],
    targetAffliction: 'सिद्धि-गति की ओर उन्मुख कर्म-क्षय भाव',
    repetitionShloka: 9,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 46,
    name: 'कवि-विनय श्लोक (क्रम १) — दास्य-भाव',
    targetKarma: ['Mohaniya'],
    targetAffliction: 'अहंकार (मान कषाय) का शमन',
    repetitionShloka: 9,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  },
  {
    shlokaNumber: 47,
    name: 'कवि-विनय श्लोक (क्रम २) — भक्ति सुदृढ़ीकरण',
    targetKarma: ['Darshanavaraniya'],
    targetAffliction: 'भक्ति-भाव में विघ्नकारी दर्शनावरणीय',
    repetitionShloka: 9,
    direction: EAST,
    timeWindow: DAWN,
    sanskritVersePending: true
  }
];

// ─── Verified Sanskrit first-lines, shlokas 25–44 (v3 §2 + final resolution) ──
// Source: blueprint-v2 §2 (dedup pass) + final truncation resolution (37/39).
export const BHAKTAMAR_VERIFIED_LINES: Record<number, string> = {
  25: 'किं शर्वरीषु शशिनाह्नि विवस्वता वा',
  26: 'मन्ये वरं हरिहरादय एव दृष्टाः',
  27: 'ज्ञानं यथा त्वयि विभाति कृतावकाशं',
  28: 'बुद्धस्त्वमेव विबुधाचितबुद्धिबोधात्',
  29: 'त्वामामनन्ति मुनयः परमं पुमांसम्',
  30: 'त्वं पावनं सुविमलं परिचिन्त्य रूपं',
  31: 'द्योतान्तरं तव वपुः प्रविभक्तभासम्',
  32: 'स्वर्गापवर्ग-गम-मार्ग-विमार्गणेष्टः',
  33: 'छत्रत्रयं तव विभाति शशाङ्ककान्तम्',
  34: 'गम्भीरतारवरशब्दमनोहरं ते',
  35: 'मन्दारसुन्दरनमेरुसुपर्णपुष्पैः',
  36: 'पादौ पदानि तव यत्र जिनेन्द्र जातानि',
  37: 'श्यामावदातयमुनोदरवारिभङ्गयोग्याभिरासु तरलास्विव जाह्नवीषु',
  38: 'छत्रत्रयेण तव चारुशशाङ्ककान्तम्',
  39: 'उन्मग्नभीमभुजङ्गोदरदीप्तरत्नद्युतिव्यतिकरशबलप्रभामयूखम्',
  40: 'यस्मिन्निह्नत शिखिनोऽप्यनुकूलवाता',
  41: 'रक्ताश्रुसिक्तवपुषो द्रुतमापतन्तः',
  42: 'वज्रं किमत्र यदि ते त्रिदशाङ्गनाभिः',
  43: 'त्वत्कीर्तनेन मनुजा मनुजत्वमेव',
  44: 'आक्रान्तभीमभुजङ्गमुच्छ्रितशिखं'
};

export function getBhaktamarAssignment(shlokaNumber: number): TraditionalBhaktamarAssignment | undefined {
  return BHAKTAMAR_TRADITIONAL_ASSIGNMENTS.find(s => s.shlokaNumber === shlokaNumber);
}

// ─── Planetary remedy mapping (blueprint §B.4) ────────────────────────────────
// Traditional shloka ↔ graha assignments wired as a FALLBACK layer — full
// BhaktamarShloka entries in sadhana.ts always take precedence.
export interface BhaktamarSadhana {
  shlokaNumber: number;
  shlokaFirstLine: string;
  planetaryTarget: string;   // graha name or 'All'
  remedyTarget: string;
  jaapCount: number;
}

export const BHAKTAMAR_SADHANA_CATALOG: BhaktamarSadhana[] = [
  {
    shlokaNumber: 2,
    shlokaFirstLine: 'यस्मात् स्वयं निपुणबुद्धिरपि प्रवृत्तः...',
    planetaryTarget: 'Mercury',
    remedyTarget: 'नेत्र-रोग शमन, बुद्धि-स्पष्टता',
    jaapCount: 108
  },
  {
    shlokaNumber: 7,
    shlokaFirstLine: 'उद्यदादित्यमिव प्रतापं...',
    planetaryTarget: 'Sun',
    remedyTarget: 'विष-मुक्ति, तेजोमय आभा',
    jaapCount: 108
  },
  {
    shlokaNumber: 15,
    shlokaFirstLine: 'चित्रं किमत्र यदि ते त्रिदशाङ्गनाभिः...',
    planetaryTarget: 'Mars',
    remedyTarget: 'भौम अरिष्ट शमन (दुर्घटना-रक्षा, क्रोध-निरोध)',
    jaapCount: 108
  },
  {
    shlokaNumber: 25,
    shlokaFirstLine: 'किं शर्वरीषु शशिनाह्नि विवस्वता वा...',
    planetaryTarget: 'Saturn',
    remedyTarget: 'शनि अरिष्ट शमन (दुःख, विलंब, दीर्घ वेदना)',
    jaapCount: 1008
  },
  {
    shlokaNumber: 36,
    shlokaFirstLine: 'पादौ पदानि तव यत्र जिनेन्द्र जातानि...',
    planetaryTarget: 'Rahu',
    remedyTarget: 'राहु अरिष्ट शमन (भय, मोह, मनो-अवरोध)',
    jaapCount: 108
  },
  {
    shlokaNumber: 44,
    shlokaFirstLine: 'आक्रान्तभीमभुजङ्गमुच्छ्रितशिखं...',
    planetaryTarget: 'All',
    remedyTarget: 'सर्व-रोग-निवारण (गंभीर शारीरिक विकार)',
    jaapCount: 1008
  },
  {
    shlokaNumber: 48,
    shlokaFirstLine: 'यः संस्तवं स्रग्धरामनुपम्यबुद्धिः...',
    planetaryTarget: 'All',
    remedyTarget: 'बंधन-मुक्ति (अवरोध-निवारण)',
    jaapCount: 108
  }
];

export function getBhaktamarForGraha(grahaEn: string): BhaktamarSadhana[] {
  const hits = BHAKTAMAR_SADHANA_CATALOG.filter(
    s => s.planetaryTarget === grahaEn || s.planetaryTarget === 'All'
  );
  // Exact-graha matches first, universal remedies after.
  return hits.sort((a, b) =>
    (a.planetaryTarget === 'All' ? 1 : 0) - (b.planetaryTarget === 'All' ? 1 : 0)
  );
}

// Additional graha-targeted rows from v3 §2 (completing the planetary map).
export const BHAKTAMAR_SADHANA_CATALOG_EXTENDED: BhaktamarSadhana[] = [
  { shlokaNumber: 26, shlokaFirstLine: BHAKTAMAR_VERIFIED_LINES[26], planetaryTarget: 'Mercury', remedyTarget: 'बुद्धि-विकास, धर्म-मार्ग स्पष्टता', jaapCount: 108 },
  { shlokaNumber: 31, shlokaFirstLine: BHAKTAMAR_VERIFIED_LINES[31], planetaryTarget: 'Sun', remedyTarget: 'ज्योति-प्रकाश — यश एवं सौर-तेज', jaapCount: 108 },
  { shlokaNumber: 33, shlokaFirstLine: BHAKTAMAR_VERIFIED_LINES[33], planetaryTarget: 'Moon', remedyTarget: 'चन्द्र अरिष्ट शमन, भावनात्मक स्थैर्य', jaapCount: 108 },
  { shlokaNumber: 35, shlokaFirstLine: BHAKTAMAR_VERIFIED_LINES[35], planetaryTarget: 'Venus', remedyTarget: 'समृद्धि एवं लौकिक शांति', jaapCount: 108 },
  { shlokaNumber: 40, shlokaFirstLine: BHAKTAMAR_VERIFIED_LINES[40], planetaryTarget: 'Ketu', remedyTarget: 'केतु अरिष्ट, त्वचा-रोग, अग्नि-रक्षा', jaapCount: 108 },
  { shlokaNumber: 41, shlokaFirstLine: BHAKTAMAR_VERIFIED_LINES[41], planetaryTarget: 'Mars', remedyTarget: 'भौम अरिष्ट (क्रोध, हिंसा, शल्य-कवच)', jaapCount: 108 }
];

/** Full graha lookup across base + extended catalogs. */
export function getBhaktamarForGrahaFull(grahaEn: string): BhaktamarSadhana[] {
  const all = [...BHAKTAMAR_SADHANA_CATALOG, ...BHAKTAMAR_SADHANA_CATALOG_EXTENDED];
  return all
    .filter(s => s.planetaryTarget === grahaEn || s.planetaryTarget === 'All')
    .sort((a, b) => (a.planetaryTarget === 'All' ? 1 : 0) - (b.planetaryTarget === 'All' ? 1 : 0));
}

/**
 * Returns the traditional assignment for any shloka 1–48 that lacks a full
 * BhaktamarShloka entry in sadhana.ts's remedial matrix. Full entries win —
 * this is the completion layer, never a replacement.
 */
export function getBhaktamarThemeFallback(shlokaNumber: number): TraditionalBhaktamarAssignment | undefined {
  return getBhaktamarAssignment(shlokaNumber);
}
