// Source: PARITY-REPORT-2026 §"Six Leshyas (Aura States)"
// Six leshyās — vibrational tints of the soul. They reflect the soul's current
// karma-anuranjanatā (degree of karmic coloration) and kashaya state.
// Doctrine: Uttaradhyayana Sutra ch. 34; Gommatsar Jivakanda §94-115.

export interface Leshya {
  id: number;
  nameHindi: string;
  nameEn: string;
  color: string;            // CSS color approximation for UI
  colorNameHindi: string;
  descriptionHindi: string;
  kashayaLevel: 'extreme' | 'high' | 'moderate' | 'low' | 'very_low' | 'none';
  moralQuality: 'अशुभ' | 'शुभ';
  gunasthanaRange: [number, number]; // min–max gunasthana where this leshya predominates
  durationSymbol: string;           // symbolic example from scripture
}

export const LESHYAS: Leshya[] = [
  {
    id: 1,
    nameHindi: 'कृष्ण लेश्या',
    nameEn: 'Krishna Leshya',
    color: '#1a1a2e',
    colorNameHindi: 'काली',
    descriptionHindi:
      'आत्मा में क्रोध, मान, माया और लोभ की अत्यधिक तीव्रता होती है। हिंसा, असत्य और परिग्रह में आसक्ति प्रबल रहती है। यह लेश्या नरक गति की ओर आत्मा को ले जाती है।',
    kashayaLevel: 'extreme',
    moralQuality: 'अशुभ',
    gunasthanaRange: [1, 1],
    durationSymbol: 'तिल के समान अल्प-पुण्य'
  },
  {
    id: 2,
    nameHindi: 'नील लेश्या',
    nameEn: 'Neel Leshya',
    color: '#0d3b6e',
    colorNameHindi: 'नीली',
    descriptionHindi:
      'आत्मा में तीव्र कषाय तो है किंतु कृष्ण लेश्या से कुछ कम। लोभ और माया की प्रधानता रहती है। तिर्यंच गति की ओर प्रवृत्ति होती है।',
    kashayaLevel: 'high',
    moralQuality: 'अशुभ',
    gunasthanaRange: [1, 2],
    durationSymbol: 'कोयले की कालिमा'
  },
  {
    id: 3,
    nameHindi: 'कापोत लेश्या',
    nameEn: 'Kapot Leshya',
    color: '#6b7280',
    colorNameHindi: 'धुएँ जैसी/कबूतर-वर्ण',
    descriptionHindi:
      'क्रोध और मान की प्रधानता है। आत्मा मानवीय गति में भटकती है। धर्म की ओर झुकाव तो है परंतु कषाय की पकड़ अभी भी मजबूत है।',
    kashayaLevel: 'moderate',
    moralQuality: 'अशुभ',
    gunasthanaRange: [1, 3],
    durationSymbol: 'धुएँ की छाया'
  },
  {
    id: 4,
    nameHindi: 'तेजो लेश्या',
    nameEn: 'Tejo Leshya',
    color: '#d97706',
    colorNameHindi: 'अग्नि-वर्ण/पीतल',
    descriptionHindi:
      'आत्मा शुभ भावों की ओर अग्रसर होती है। कषाय कमजोर पड़ने लगती हैं। देव-गति और देश-विरति की प्राप्ति की संभावना बनती है।',
    kashayaLevel: 'low',
    moralQuality: 'शुभ',
    gunasthanaRange: [2, 5],
    durationSymbol: 'तप्त सोने की आभा'
  },
  {
    id: 5,
    nameHindi: 'पद्म लेश्या',
    nameEn: 'Padma Leshya',
    color: '#ec4899',
    colorNameHindi: 'कमल-वर्ण/गुलाबी',
    descriptionHindi:
      'आत्मा में संयम और शुद्धता बढ़ती है। मोह का क्षय हो रहा है। यह लेश्या उच्च देव-गति और संयम की साधना में सहायक होती है।',
    kashayaLevel: 'very_low',
    moralQuality: 'शुभ',
    gunasthanaRange: [4, 7],
    durationSymbol: 'खिले कमल की प्रभा'
  },
  {
    id: 6,
    nameHindi: 'शुक्ल लेश्या',
    nameEn: 'Shukla Leshya',
    color: '#f0fdf4',
    colorNameHindi: 'श्वेत/निर्मल',
    descriptionHindi:
      'आत्मा में कषाय का पूर्णतः क्षय हो जाता है। यह परम शुद्ध अवस्था है। यह लेश्या केवलज्ञान और मोक्ष की प्राप्ति की अवस्था में होती है।',
    kashayaLevel: 'none',
    moralQuality: 'शुभ',
    gunasthanaRange: [11, 14],
    durationSymbol: 'स्फटिक की निर्मलता'
  }
];

export function getLeshyaById(id: number): Leshya | undefined {
  return LESHYAS.find(l => l.id === id);
}

/** Estimate predominant leshya from gunasthana number. */
export function getLeshyaForGunasthana(gunasthana: number): Leshya {
  if (gunasthana <= 1) return LESHYAS[0];
  if (gunasthana <= 3) return LESHYAS[2];
  if (gunasthana <= 5) return LESHYAS[3];
  if (gunasthana <= 7) return LESHYAS[4];
  return LESHYAS[5];
}
