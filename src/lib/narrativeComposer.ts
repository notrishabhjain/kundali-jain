import type { UserProfile, DayContext } from './engineFacade';
import type { IntelligenceDecision } from './intelligence/types';
import { calculateKarmaProfile } from './karmaEngine';
import { generateRemedies } from './remedyEngine';
import { getPanchamKaalAssertion } from './panchamKaalGuard';

export interface NarrativeBundle {
  coreSummary: string;
  karmaManifestation: string;
  sadhanaPrescription: string;
}

export function composeNarrativeBundle(profile: UserProfile, day: DayContext, decision?: IntelligenceDecision): NarrativeBundle {
  const karmas = calculateKarmaProfile(profile.dominantKarmaEn, profile.currentDasha?.lord || 'Mohaniya', profile.gunasthana || 1);
  const dominant = karmas.find((k) => k.karmaEn === profile.dominantKarmaEn) || karmas[0];
  const remedies = generateRemedies(profile);

  const priorityHint = decision
    ? `आज की प्राथमिकता: ${decision.priority === 'urgent' ? 'अति-प्राथमिक' : decision.priority === 'high' ? 'उच्च' : decision.priority === 'medium' ? 'मध्यम' : 'सामान्य'}।`
    : 'आज की प्राथमिकता: नियम-आधारित साधना निरंतर रखें।';

  const pancham = getPanchamKaalAssertion();

  return {
    coreSummary: `आज ${day.tithi}, ${day.vara} के दिन आप ${profile.currentDasha.lord_hindi} महादशा एवं ${profile.currentDasha.antardashaInfo.lord_hindi} अंतर्दशा में हैं। ${priorityHint} ${pancham.statement}`,
    karmaManifestation: `${dominant.insight.karmaNameDevanagari} कर्म का दैनिक प्रकटन: ${dominant.insight.dailyManifestation}`,
    sadhanaPrescription: `${dominant.insight.sadhanaName} का ${dominant.insight.count} बार जप (${dominant.insight.timing}) करें। ${remedies.dashaRemedy}`,
  };
}
