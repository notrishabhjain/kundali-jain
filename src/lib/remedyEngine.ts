// Remedy engine — generates karma-specific sadhana, dasha remedy, and Bhaktamar
// shloka prescription from the user's dominant karma + dasha lord.
//
// Sources:
//  - Karma sadhana assignments: references/sources.md (Codex MP-§F1-§F3).
//  - Bhaktamar Stotra shloka mapping: Research Report §5-§7 + BKT-1 (Manatunga Acharya).
//  - Panch Samvay Pursharth principle: Research Report §1 + Tattvarthasutra ch. 5.
import { getKarmaSadhana, getDashaSadhana, getBhaktamarForKarma } from '../data/sadhana';
import { getNakshatraByName } from '../data/nakshatras';
import { selectBhaktamarForBirth, type BhaktamarCandidate } from './bhaktamarSelector';
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
  // The shloka allotted to THIS birth, and every other shloka the tradition
  // holds eligible for the same karma. The engine used to compute the eligible
  // set and then discard all but its first element, which left 8 distinct
  // shlokas reachable out of 48. See src/lib/bhaktamarSelector.ts for which part
  // of this is attested and which is this engine's own allotment.
  bhaktamarPrimary?: BhaktamarCandidate;
  bhaktamarAlternates: BhaktamarCandidate[];
  /** States plainly that eligibility is traditional and the allotment is not. */
  bhaktamarProvenance: string;
}

export function generateRemedies(profile: UserProfile): CombinedRemedy {
  const karmaSadhana = getKarmaSadhana(profile.dominantKarmaEn);
  const dashaSadhana = getDashaSadhana(profile.currentDasha.lord);

  // Bhaktamar selection, driven by the birth nakshatra rather than by taking the
  // first element of the eligible set. Eligibility is traditional (BKT-1 via
  // GR.1); the allotment within it is sankalita and labelled as such.
  // Source: Research Report §5-§7 + BKT-1 (Manatunga Acharya).
  const birthNakshatra = getNakshatraByName(profile.birthNakshatra);
  const selection = birthNakshatra
    ? selectBhaktamarForBirth(birthNakshatra, profile.dominantKarmaEn)
    : undefined;

  // The legacy karma-first lookup is retained as the fallback for a nakshatra
  // name the table cannot resolve, so this path never regresses.
  const bhaktamarShlokas = getBhaktamarForKarma(profile.dominantKarmaEn);
  const primaryBhaktamar = selection?.primary?.full ?? bhaktamarShlokas[0];
  const allotted = selection?.primary;
  const bhaktamarShloka = allotted
    ? `भक्तामर स्तोत्र श्लोक ${allotted.shlokaNumber} — ${allotted.name}: ${allotted.targetAffliction}`
    : primaryBhaktamar
    ? `भक्तामर स्तोत्र श्लोक ${primaryBhaktamar.shlokaNumber} — ${primaryBhaktamar.name}: ${primaryBhaktamar.targetAffliction}`
    : 'भक्तामर स्तोत्र का सम्पूर्ण पाठ प्रातःकाल — सर्व कर्म-निर्जरा का परम उपाय।';

  const bhaktamarMantra = allotted?.traditional?.riddhiKey
    ? `ऋद्धि मंत्र: ${allotted.traditional.riddhiKey} | श्लोक: ${allotted.repetitionShloka} बार`
    : primaryBhaktamar
    ? `ऋद्धि मंत्र: ${primaryBhaktamar.riddhiMantra} (${primaryBhaktamar.repetitionRiddhi} बार) | साधना मंत्र: ${primaryBhaktamar.remedialMantra} (${primaryBhaktamar.repetitionMantra} बार) | श्लोक: ${primaryBhaktamar.repetitionShloka} बार`
    : 'णमो अरहंताणं — भक्तामर के प्रत्येक श्लोक से पूर्व ११ बार।';

  // A 'traditional' row (shlokas 25-47) has direction, timing and a jaap count
  // but no somatic/dietary protocol — those await OCR of a print edition. The
  // count and timing that CLAUDE.md requires of every remedy are still present.
  const bhaktamarProtocol = allotted?.full
    ? `दिशा: ${allotted.full.direction} | समय: ${allotted.full.timeWindow} | ${allotted.full.somaticProtocol} | आहार: ${allotted.full.dietaryRestrictions} | अवधि: ${allotted.full.timelineDays} दिन`
    : allotted
    ? `दिशा: ${allotted.direction} | समय: ${allotted.timeWindow} | जाप: ${allotted.repetitionShloka} बार | विस्तृत सोमैटिक विधि हेतु मुद्रित संस्करण अपेक्षित`
    : primaryBhaktamar
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
    bhaktamarProtocol,
    bhaktamarPrimary: allotted,
    bhaktamarAlternates: selection?.alternates ?? [],
    bhaktamarProvenance: selection?.provenanceHindi ?? ''
  };
}
