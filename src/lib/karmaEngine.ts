import { KARMA_SADHANA } from '../data/sadhana';
import type { KarmaInsight } from '../types/karmaInsights';

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

export function calculateKarmaProfile(dominantKarmaEn: string, dashaLord: string, gunasthana: number): KarmaState[] {
  return ALL_KARMAS.map(karma => {
    const sadhana = KARMA_SADHANA[karma.en];
    let intensity = karma.base;
    let state: 'Udaya' | 'Satta' | 'Nirjara' = 'Satta';

    if (karma.en === dominantKarmaEn) {
      intensity += 30;
      state = 'Udaya';
    }

    // dashaLord is a Jain karma name (e.g. 'Mohaniya') — directly boost the active dasha karma
    if (karma.en === dashaLord) {
      intensity += 20;
      state = 'Udaya';
    }

    // Higher gunasthana reduces intensity
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
