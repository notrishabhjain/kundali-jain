// Source: PARITY-REPORT-2026 §"16 Kashaya Sub-types"
// 16 Kashayas — 4 passions × 4 intensity levels.
// Doctrine: Gommatsar Jivakanda §§1-44; Panchasangraha §§2.1-2.44.
//
// 4 Passions: Krodha (anger), Mana (pride), Maya (deceit), Lobha (greed)
// 4 Intensities (ascending purity):
//   1. Anantanubandhi   — infinite-bonding; destroys right faith (samyak darshan)
//   2. Apratyakhyana    — non-renunciation; prevents taking of anuvratas (partial vows)
//   3. Pratyakhyana     — renunciation-preventing; allows anuvratas but blocks full vratas
//   4. Sanjvalana       — smouldering; present even in full monks; fades at gunasthana 10

export type KashayaIntensity =
  | 'Anantanubandhi'
  | 'Apratyakhyana'
  | 'Pratyakhyana'
  | 'Sanjvalana';

export type KashayaPassion = 'Krodha' | 'Mana' | 'Maya' | 'Lobha';

export interface Kashaya {
  id: number;                       // 1-16
  passionEn: KashayaPassion;
  intensityEn: KashayaIntensity;
  nameHindi: string;                // composite name in Devanagari
  passionHindi: string;
  intensityHindi: string;
  effectHindi: string;              // what this kashaya does to the soul
  maxGunasthana: number;            // highest gunasthana where this can be present
  karmaStrengthened: string[];      // karmas whose binding is intensified
}

const INTENSITIES: Array<{ en: KashayaIntensity; hindi: string; max: number }> = [
  { en: 'Anantanubandhi',  hindi: 'अनन्तानुबन्धी',  max: 1 },
  { en: 'Apratyakhyana',   hindi: 'अप्रत्याख्यान',   max: 4 },
  { en: 'Pratyakhyana',    hindi: 'प्रत्याख्यान',     max: 5 },
  { en: 'Sanjvalana',      hindi: 'संज्वलन',          max: 10 },
];

const PASSIONS: Array<{
  en: KashayaPassion;
  hindi: string;
  effectTemplate: (intensity: string) => string;
  karmas: string[];
}> = [
  {
    en: 'Krodha',
    hindi: 'क्रोध',
    effectTemplate: (i) =>
      `${i} क्रोध — आत्मा में रोष की तीव्रता से कर्म-बन्ध होता है। क्रोध के वशीभूत होकर अहितकारी वाणी और कार्य होते हैं।`,
    karmas: ['मोहनीय', 'नाम']
  },
  {
    en: 'Mana',
    hindi: 'मान',
    effectTemplate: (i) =>
      `${i} मान — अहंकार की भावना से सम्यक्-दर्शन और विनय का नाश होता है। दूसरों की अवहेलना से नाम-कर्म का अशुभ बन्ध होता है।`,
    karmas: ['मोहनीय', 'गोत्र']
  },
  {
    en: 'Maya',
    hindi: 'माया',
    effectTemplate: (i) =>
      `${i} माया — कपट और छल से मिथ्यात्व पुष्ट होता है। आत्मा का स्वभाव-विरुद्ध आचरण मोहनीय और अन्तराय कर्म बढ़ाता है।`,
    karmas: ['मोहनीय', 'अन्तराय']
  },
  {
    en: 'Lobha',
    hindi: 'लोभ',
    effectTemplate: (i) =>
      `${i} लोभ — परिग्रह की इच्छा से आत्मा नए कर्म बाँधती रहती है। लोभ सभी कषायों में सबसे अंत में शांत होता है।`,
    karmas: ['मोहनीय', 'आयुष्य', 'अन्तराय']
  }
];

export const KASHAYAS: Kashaya[] = [];
let _id = 1;
for (const intensity of INTENSITIES) {
  for (const passion of PASSIONS) {
    KASHAYAS.push({
      id: _id++,
      passionEn: passion.en,
      intensityEn: intensity.en,
      nameHindi: `${intensity.hindi} ${passion.hindi}`,
      passionHindi: passion.hindi,
      intensityHindi: intensity.hindi,
      effectHindi: passion.effectTemplate(intensity.hindi),
      maxGunasthana: intensity.max,
      karmaStrengthened: passion.karmas
    });
  }
}

export function getKashayasByPassion(passion: KashayaPassion): Kashaya[] {
  return KASHAYAS.filter(k => k.passionEn === passion);
}

export function getKashayasByIntensity(intensity: KashayaIntensity): Kashaya[] {
  return KASHAYAS.filter(k => k.intensityEn === intensity);
}

/** Returns kashayas still active at a given gunasthana (1-14). */
export function getActiveKashayasAtGunasthana(gunasthana: number): Kashaya[] {
  return KASHAYAS.filter(k => k.maxGunasthana >= gunasthana);
}

export function getKashayaById(id: number): Kashaya | undefined {
  return KASHAYAS.find(k => k.id === id);
}
