// Rule-first deterministic scorer for daily sādhana priority.
//
// Sources (see references/sources.md):
//  - Signal design contract: REFERENCE.md §3 "Signal Scoring" (positive × (1 − negative)).
//  - Ghātiyā karma set (Gyanavaraniya, Darshanavaraniya, Mohaniya, Antaraya): SKD + MP-§C1.
//  - Compound ghātiyā doctrine (simultaneous udaya of 2+ ghātiyā = critical): SKD + MP-§D4.
//  - Kashayas (4 passions under Mohaniya) raising sādhana urgency: SKD + MP-§C1.
//  - Ratnatraya (Samyag Darshan + Gyan + Charitra) as the positive triad: TRK + MP-§C3.
//  - Tithi Pravāh (birth-tithi peaks / nirjarā days): MP-§D2 L2.
//  - Pancham Kāla karma-environment intensification: MP-§D2 L3.
import type { DayContext, UserProfile } from '../engineFacade';
import type { IntelligenceDecision, IntelligenceSignal } from './types';

const GHATIYA = new Set(['Gyanavaraniya', 'Darshanavaraniya', 'Mohaniya', 'Antaraya']);
const AGHATIYA = new Set(['Vedaniya', 'Ayushya', 'Naam', 'Gotra']);

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

// Count distinct ghātiyā karmas in active udaya across dominant, dasha, antardasha.
// "Compound ghātiyā" (≥ 2 distinct) is doctrinally critical: SKD compound-prakṛti chapter.
function countActiveGhatiya(dominantKarmaEn: string, dashaLord: string, antarLord: string): number {
  const active = new Set<string>();
  if (GHATIYA.has(dominantKarmaEn)) active.add(dominantKarmaEn);
  if (dominantKarmaEn === 'Charitra Mohaniya') active.add('Mohaniya');
  if (GHATIYA.has(dashaLord)) active.add(dashaLord);
  if (GHATIYA.has(antarLord)) active.add(antarLord);
  return active.size;
}

export function calculateRuleScore(profile: UserProfile, day: DayContext, message: string): IntelligenceDecision {
  const dashaLord    = profile.currentDasha?.lord || '';
  const antarLord    = profile.currentDasha?.antardashaInfo?.lord || '';
  const dominantEn   = profile.dominantKarmaEn || '';
  const gunasthana   = profile.gunasthana || 1;
  const nature       = profile.nakshatraNature || 'mishra';
  const activeGhatiya = countActiveGhatiya(dominantEn, dashaLord, antarLord);

  const signals: IntelligenceSignal[] = [
    // ── Positive: karmic intensity raises sādhana priority ─────────────────────
    {
      key: 'mohaniya_dasha',
      weight: 0.28,
      matched: dashaLord === 'Mohaniya',
      detail: 'मोहनीय महादशा में राग-द्वेष और कषाय-उदय प्रबल रहते हैं — सम्यग्दर्शन हेतु विशेष सावधानी।',
    },
    {
      key: 'darshanavaraniya_dasha',
      weight: 0.20,
      matched: dashaLord === 'Darshanavaraniya',
      detail: 'दर्शनावरणीय दशा में श्रद्धा और सम्यक्-दृष्टि डोलती है — जिन-भक्ति से स्थिर करें।',
    },
    {
      key: 'antaraya_dasha',
      weight: 0.16,
      matched: dashaLord === 'Antaraya',
      detail: 'अंतराय दशा में शुभ कार्यों और साधना में विघ्न आते हैं — दान और जिन-भक्ति से अंतराय क्षय करें।',
    },
    {
      key: 'low_gunasthana',
      weight: 0.22,
      matched: gunasthana <= 2,
      detail: 'प्रथम-द्वितीय गुणस्थान में मिथ्यात्व या अविरति प्रबल — सम्यग्दर्शन की दिशा में सचेत प्रयास करें।',
    },
    {
      key: 'ashubha_nakshatra',
      weight: 0.14,
      matched: nature === 'ashubha',
      detail: 'अशुभ नक्षत्र प्रकृति में कषाय-उदय की प्रवृत्ति अधिक रहती है।',
    },
    {
      key: 'krishna_paksha',
      weight: 0.10,
      matched: day.paksha === 'कृष्ण',
      detail: 'कृष्ण पक्ष में तप और अंतर्मुख साधना अधिक फलदायी मानी गई है।',
    },
    {
      key: 'intense_karma_narrative',
      weight: 0.18,
      matched: /विशेष प्रभाव|प्रकट होता है|चंचलता|तीव्र|उदय/.test(message),
      detail: 'कर्म-उदय संकेतक वाक्यों से आज की साधना-प्राथमिकता बढ़ती है।',
    },
    {
      key: 'ghatiya_antardasha',
      weight: 0.14,
      matched: GHATIYA.has(antarLord) && antarLord !== dashaLord,
      detail: 'घातिया अंतर्दशा — महादशा के भीतर अतिरिक्त आत्म-गुण-घात का काल; अतिरिक्त संयम आवश्यक।',
    },
    {
      key: 'karma_dasha_resonance',
      weight: 0.16,
      matched: dominantEn === dashaLord ||
               (dominantEn === 'Charitra Mohaniya' && dashaLord === 'Mohaniya'),
      detail: 'जन्म का प्रबल कर्म ही वर्तमान महादशा का स्वामी है — कर्म-दशा अनुनाद से उसी कर्म का उदय प्रबलतम।',
    },
    // Source: SKD compound-prakṛti; MP-§D4 — two or more ghātiyā karmas in simultaneous
    // udaya create a confluent obscuration of jñāna + darśana + cāritra together.
    {
      key: 'compound_ghatiya',
      weight: 0.22,
      matched: activeGhatiya >= 2,
      detail: `${activeGhatiya} घातिया कर्मों का एक साथ उदय — ज्ञान, दर्शन और चारित्र तीनों पर एकसाथ दबाव; यह अत्यंत सावधानी और तीव्र साधना का काल है।`,
    },
    // Kashayas (4 passions = Krodh, Mana, Maya, Lobha) are sub-prakṛtis of Charitra Mohaniya.
    // Their active udaya directly raises kashaya-intensity. Source: SKD + MP-§C1.
    {
      key: 'kashayas_inflamed',
      weight: 0.14,
      matched: (dominantEn === 'Mohaniya' || dominantEn === 'Charitra Mohaniya') &&
               (dashaLord === 'Mohaniya' || antarLord === 'Mohaniya'),
      detail: 'मोहनीय कर्म का बहु-स्तरीय उदय — कषाय (क्रोध/मान/माया/लोभ) अत्यंत प्रबल; क्षमापना और मार्दव धर्म अनिवार्य।',
    },

    // ── Negative: favourable conditions lower sādhana urgency ──────────────────
    {
      key: 'high_gunasthana',
      weight: 0.30,
      matched: gunasthana >= 4,
      detail: 'चतुर्थ+ गुणस्थान — सम्यग्दर्शन की स्थिरता है; रत्नत्रय का आधार दृढ़ है।',
    },
    {
      key: 'param_shubha_nakshatra',
      weight: 0.22,
      matched: nature === 'param_shubha',
      detail: 'परम शुभ (तीर्थंकर-जन्म) नक्षत्र — विशेष पुण्य-प्रभाव और साधना के लिए अतिरिक्त अनुकूलता।',
    },
    {
      key: 'shubha_nakshatra',
      weight: 0.12,
      matched: nature === 'shubha',
      detail: 'शुभ नक्षत्र प्रकृति साधना के लिए अनुकूल आधार देती है।',
    },
    {
      key: 'aghatiya_dasha',
      weight: 0.18,
      matched: AGHATIYA.has(dashaLord),
      detail: 'अघातिया-कर्म दशा में आत्म-गुणों (ज्ञान/दर्शन/चारित्र) का सीधा घात नहीं — साधना सहज रहती है।',
    },
    // Source: MP-§C3 — Ratnatraya alignment (Samyag Darshan + Gyan + Charitra) is the
    // foundational protective triad that reduces karmic intensity across all domains.
    {
      key: 'ratnatraya_aligned',
      weight: 0.14,
      matched: gunasthana >= 4 && nature !== 'ashubha' && !GHATIYA.has(dashaLord),
      detail: 'रत्नत्रय की सम्यक् दिशा में — सम्यग्दर्शन, ज्ञान और चारित्र के अनुकूल स्थिति; कर्म-बंध कम होता है।',
    },
  ];

  const positiveSum = signals.filter((s) => s.matched && !['high_gunasthana', 'param_shubha_nakshatra', 'shubha_nakshatra', 'aghatiya_dasha', 'ratnatraya_aligned'].includes(s.key)).reduce((sum, s) => sum + s.weight, 0);
  const negativeSum = signals.filter((s) => s.matched && ['high_gunasthana', 'param_shubha_nakshatra', 'shubha_nakshatra', 'aghatiya_dasha', 'ratnatraya_aligned'].includes(s.key)).reduce((sum, s) => sum + s.weight, 0);

  const ruleScore = clamp01(clamp01(positiveSum) * Math.max(0, 1 - negativeSum));

  const priority: IntelligenceDecision['priority'] =
    ruleScore >= 0.75 ? 'urgent' :
    ruleScore >= 0.55 ? 'high' :
    ruleScore >= 0.35 ? 'medium' : 'low';

  return {
    ruleScore,
    finalScore: ruleScore,
    fallbackUsed: true,
    modelScore: undefined,
    reasonCodes: signals.filter((s) => s.matched).map((s) => s.key),
    signalsMatched: signals,
    priority,
  };
}
