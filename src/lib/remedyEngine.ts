import { getKarmaSadhana, getDashaSadhana } from '../data/sadhana';
import { UserProfile } from './analysisSynthesizer';

export interface CombinedRemedy {
  primarySadhana: string;
  dashaRemedy: string;
  karmaRemedy: string;
  recommendedTithi: string;
  yantraRecommendation: string;
  tapasyaRecommendation: string;
}

export function generateRemedies(profile: UserProfile): CombinedRemedy {
  const karmaSadhana = getKarmaSadhana(profile.dominantKarmaEn);
  const dashaSadhana = getDashaSadhana(profile.currentDasha.lord);

  return {
    primarySadhana: `श्री ${profile.tirthankarAffinityHindi} भगवान का स्मरण करते हुए ${karmaSadhana.primaryMantra.text} का ${karmaSadhana.primaryMantra.count} बार जाप।`,
    dashaRemedy: dashaSadhana.dashaSadhana,
    karmaRemedy: karmaSadhana.visheshUpaya,
    recommendedTithi: `${dashaSadhana.bestTithi} (दशा अनुसार) तथा ${karmaSadhana.shubhaTithi.join(', ')} तिथियाँ (कर्म अनुसार)`,
    yantraRecommendation: `${karmaSadhana.yantra.name}: ${karmaSadhana.yantra.effect} (${karmaSadhana.yantra.installation})`,
    tapasyaRecommendation: `${karmaSadhana.tapasya.name}: ${karmaSadhana.tapasya.description}`
  };
}
