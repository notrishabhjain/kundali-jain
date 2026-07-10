// 8-karma analysis engine — Digambar karma-siddhānta.
//
// Sources (see references/sources.md):
//  - The 8 karmas (4 ghātiyā + 4 aghātiyā): Shatkhandagama (SKD), distilled in MP-§G2/C and
//    MP-§F1 (Namokar's 5-pada → karma-pair mapping).
//  - State labels Udaya / Sattā / Nirjarā: SKD karma-prakṛti chapter; MP-§D4 engine contract.
//  - Intensity weights per karma: baseline from MP-§C1 (relative prabal-tā). Exact numeric
//    weights are [REQUIRES_RESEARCH] pending OCR of SKD verses.
//  - Gunasthāna damping: MP-§D4 + classical śloka "yathā-yathā gunasthāna-vṛddhi tathā tathā
//    karma-kṣaya".
//  - Compound ghātiyā (≥2 distinct ghātiyā in simultaneous Udaya): SKD compound-prakṛti
//    treatment; MP-§D4 "concurrent obscuration" clause — adds 15 intensity points per
//    additional ghātiyā beyond the first. [REQUIRES_RESEARCH] verse-level OCR pending.
//  - Kashayas (4 passions × 4 intensities under Charitra Mohaniya): SKD; MP-§C1.
//  - 5 Karma-Bandha factors (Mithyatva, Avirati, Pramada, Kashaya, Yoga): SKD. [REQUIRES_RESEARCH].
import { KARMA_SADHANA } from '../data/sadhana';
import type { KarmaInsight } from '../types/karmaInsights';

const GHATIYA_SET = new Set(['Gyanavaraniya', 'Darshanavaraniya', 'Mohaniya', 'Antaraya']);

// Returns the number of distinct ghātiyā karmas in simultaneous Udaya.
// Compound udaya of 2+ ghātiyā creates a confluent obscuration of jñāna + darśana + cāritra.
export function countCompoundGhatiya(dominantKarmaEn: string, dashaLord: string, antarLord: string): number {
  const active = new Set<string>();
  const effectiveDominant = dominantKarmaEn === 'Charitra Mohaniya' ? 'Mohaniya' : dominantKarmaEn;
  if (GHATIYA_SET.has(effectiveDominant)) active.add(effectiveDominant);
  if (GHATIYA_SET.has(dashaLord)) active.add(dashaLord);
  if (GHATIYA_SET.has(antarLord)) active.add(antarLord);
  return active.size;
}

export interface KarmaState {
  id: string;
  karmaEn: string;
  karmaHindi: string;
  intensity: number; // 0-100
  state: 'Udaya' | 'Satta' | 'Nirjara';
  manifestation: string;
  nirjaraPractice: string;
  insight: KarmaInsight;
}


const ALL_KARMAS = [
  { en: 'Gyanavaraniya', hi: 'ज्ञानावरणीय', base: 45 },
  { en: 'Darshanavaraniya', hi: 'दर्शनावरणीय', base: 40 },
  { en: 'Vedaniya', hi: 'वेदनीय', base: 50 },
  { en: 'Mohaniya', hi: 'मोहनीय', base: 65 },
  { en: 'Ayushya', hi: 'आयुष्य', base: 30 },
  { en: 'Naam', hi: 'नाम', base: 45 },
  { en: 'Gotra', hi: 'गोत्र', base: 20 },
  { en: 'Antaraya', hi: 'अंतराय', base: 60 }
];

// Pancham Kāla karma multiplier — the destructive karmas (Mohaniya, Antaraya) run
// intensified in the 5th Ara. Source: PARITY-REPORT-2026 §"Technical Parity" (Karma
// Multiplier row: "Applies a 1.4x factor"; parity action "Integrate multiplier checks
// into karmaEngine.ts").
export const PANCHAM_KAAL_KARMA_MULTIPLIER = 1.4;
const PANCHAM_KAAL_DESTRUCTIVE = new Set(['Mohaniya', 'Antaraya']);

export function calculateKarmaProfile(dominantKarmaEn: string, dashaLord: string, gunasthana: number, antarLord?: string): KarmaState[] {
  const effectiveDominant = dominantKarmaEn === 'Charitra Mohaniya' ? 'Mohaniya' : dominantKarmaEn;
  const compoundCount = countCompoundGhatiya(dominantKarmaEn, dashaLord, antarLord || '');
  const compoundBonus = Math.max(0, (compoundCount - 1) * 15); // +15 per additional ghātiyā beyond first

  return ALL_KARMAS.map(karma => {
    const sadhana = KARMA_SADHANA[karma.en];
    let intensity = karma.base;
    let state: 'Udaya' | 'Satta' | 'Nirjara' = 'Satta';

    // Pancham Kāla 1.4× multiplier on the destructive karmas when they are in transit
    // (dashā) — Source: PARITY-REPORT-2026 Karma Multiplier parity row.
    if (PANCHAM_KAAL_DESTRUCTIVE.has(karma.en) && karma.en === dashaLord) {
      intensity = Math.round(intensity * PANCHAM_KAAL_KARMA_MULTIPLIER);
    }

    if (karma.en === effectiveDominant) {
      intensity += 30;
      state = 'Udaya';
    }

    // dashaLord is a Jain karma name (e.g. 'Mohaniya') — directly boost the active dasha karma
    if (karma.en === dashaLord) {
      intensity += 20;
      state = 'Udaya';
    }

    // Compound ghātiyā bonus: every additional ghātiyā beyond the first adds confluent pressure
    if (GHATIYA_SET.has(karma.en) && state === 'Udaya') {
      intensity += compoundBonus;
    }

    // Higher gunasthana reduces intensity (Ratnatraya protective effect)
    if (gunasthana > 1) {
      intensity -= (gunasthana - 1) * 5;
      if (intensity < 40) state = 'Nirjara';
    }

    // Cap intensity
    intensity = Math.max(10, Math.min(100, intensity));

    const manifestation = sadhana
      ? `${sadhana.dailyManifestation} वर्तमान स्थिति: ${intensity >= 70 ? sadhana.statusWhenDominant : sadhana.statusWhenNormal}`
      : karma.hi;

    const nirjaraPractice = sadhana
      ? `${sadhana.primaryMantra.count} बार ${sadhana.primaryMantra.text} (${sadhana.primaryMantra.timing})। ${sadhana.samanyaUpaya}`
      : '108 बार णमोकार मंत्र का जाप (प्रातःकाल)।';

    const insight: KarmaInsight = sadhana
      ? {
          karmaNameDevanagari: sadhana.karmaHindi,
          dailyManifestation: sadhana.dailyManifestation,
          sadhanaName: sadhana.primaryMantra.text,
          count: sadhana.primaryMantra.count,
          timing: sadhana.primaryMantra.timing,
          whyThisReducesKarma: sadhana.primaryMantra.karmaEffect,
        }
      : {
          karmaNameDevanagari: karma.hi,
          dailyManifestation: 'दैनिक जीवन में यह कर्म निर्णय, संबंध और मानसिक स्थिरता को प्रभावित कर सकता है।',
          sadhanaName: 'णमोकार मंत्र',
          count: 108,
          timing: 'प्रातःकाल',
          whyThisReducesKarma: 'सम्यक् भावना के साथ नियमित जप से कर्म-निर्जरा का मार्ग प्रशस्त होता है।',
        };

    return {
      id: karma.en.toLowerCase().replace(/\s+/g, '_'),
      karmaEn: karma.en,
      karmaHindi: karma.hi,
      intensity,
      state,
      manifestation,
      nirjaraPractice,
      insight
    };
  });
}
