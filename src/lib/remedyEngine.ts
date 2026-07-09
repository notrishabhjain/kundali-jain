// Remedy engine — generates karma-specific sadhana, dasha remedy, and Bhaktamar
// shloka prescription from the user's dominant karma + dasha lord.
//
// Sources:
//  - Karma sadhana assignments: references/sources.md (Codex MP-§F1-§F3).
//  - Bhaktamar Stotra shloka mapping: Research Report §5-§7 + BKT-1 (Manatunga Acharya).
//  - Panch Samvay Pursharth principle: Research Report §1 + Tattvarthasutra ch. 5.
import { getKarmaSadhana, getDashaSadhana, getBhaktamarForKarma } from '../data/sadhana';
import { UserProfile } from './analysisSynthesizer';

export interface CombinedRemedy {
  primarySadhana: string;
  dashaRemedy: string;
  karmaRemedy: string;
  recommendedTithi: string;
  yantraRecommendation: string;
  tapasyaRecommendation: string;
  // Bhaktamar Stotra prescription — Pursharth (free will) layer from Panch Samvay.
  // Source: Research Report §1 (Pursharth vector) + §5-§7 (Bhaktamar matrix).
  bhaktamarShloka: string;
  bhaktamarMantra: string;
  bhaktamarProtocol: string;
}

export function generateRemedies(profile: UserProfile): CombinedRemedy {
  const karmaSadhana = getKarmaSadhana(profile.dominantKarmaEn);
  const dashaSadhana = getDashaSadhana(profile.currentDasha.lord);

  // Bhaktamar shloka lookup — first match for dominant karma.
  // Source: Research Report §5-§7 + BKT-1.
  const bhaktamarShlokas = getBhaktamarForKarma(profile.dominantKarmaEn);
  const primaryBhaktamar = bhaktamarShlokas[0];
  const bhaktamarShloka = primaryBhaktamar
    ? `भक्तामर स्तोत्र श्लोक ${primaryBhaktamar.shlokaNumber} — ${primaryBhaktamar.name}: ${primaryBhaktamar.targetAffliction}`
    : 'भक्तामर स्तोत्र का सम्पूर्ण पाठ प्रातःकाल — सर्व कर्म-निर्जरा का परम उपाय।';

  const bhaktamarMantra = primaryBhaktamar
    ? `ऋद्धि मंत्र: ${primaryBhaktamar.riddhiMantra} (${primaryBhaktamar.repetitionRiddhi} बार) | साधना मंत्र: ${primaryBhaktamar.remedialMantra} (${primaryBhaktamar.repetitionMantra} बार) | श्लोक: ${primaryBhaktamar.repetitionShloka} बार`
    : 'णमो अरहंताणं — भक्तामर के प्रत्येक श्लोक से पूर्व ११ बार।';

  const bhaktamarProtocol = primaryBhaktamar
    ? `दिशा: ${primaryBhaktamar.direction} | समय: ${primaryBhaktamar.timeWindow} | ${primaryBhaktamar.somaticProtocol} | आहार: ${primaryBhaktamar.dietaryRestrictions} | अवधि: ${primaryBhaktamar.timelineDays} दिन`
    : 'ईशान कोण में मुख करके, प्रातः ४ से ७ बजे, शुद्ध वातावरण में।';

  return {
    primarySadhana: `श्री ${profile.tirthankarAffinityHindi} भगवान का स्मरण करते हुए ${karmaSadhana.primaryMantra.text} का ${karmaSadhana.primaryMantra.count} बार जाप।`,
    dashaRemedy: dashaSadhana.dashaSadhana,
    karmaRemedy: karmaSadhana.visheshUpaya,
    recommendedTithi: `${dashaSadhana.bestTithi} (दशा अनुसार) तथा ${karmaSadhana.shubhaTithi.join(', ')} तिथियाँ (कर्म अनुसार)`,
    yantraRecommendation: `${karmaSadhana.yantra.name}: ${karmaSadhana.yantra.effect} (${karmaSadhana.yantra.installation})`,
    tapasyaRecommendation: `${karmaSadhana.tapasya.name}: ${karmaSadhana.tapasya.description}`,
    bhaktamarShloka,
    bhaktamarMantra,
    bhaktamarProtocol
  };
}
