import type { DayContext, UserProfile } from '../engineFacade';
import type { IntelligenceDecision, IntelligenceSignal } from './types';

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function calculateRuleScore(profile: UserProfile, day: DayContext, message: string): IntelligenceDecision {
  const signals: IntelligenceSignal[] = [
    {
      key: 'mohaniya_dasha',
      weight: 0.28,
      matched: profile.currentDasha?.lord === 'Mohaniya',
      detail: 'मोहनीय महादशा में मनो-विक्षेप और निर्णय-अस्थिरता बढ़ सकती है।',
    },
    {
      key: 'darshanavaraniya_dasha',
      weight: 0.2,
      matched: profile.currentDasha?.lord === 'Darshanavaraniya',
      detail: 'दर्शनावरणीय दशा में स्पष्टता कम हो सकती है।',
    },
    {
      key: 'low_gunasthana',
      weight: 0.22,
      matched: (profile.gunasthana || 1) <= 2,
      detail: 'निम्न गुणस्थान में आध्यात्मिक स्थिरता के लिए अतिरिक्त अनुशासन आवश्यक होता है।',
    },
    {
      key: 'krishna_paksha',
      weight: 0.1,
      matched: day.paksha === 'कृष्ण',
      detail: 'कृष्ण पक्ष में अंतर्मुख साधना पर अधिक बल उपयोगी माना गया है।',
    },
    {
      key: 'intense_karma_narrative',
      weight: 0.18,
      matched: /विशेष प्रभाव|प्रकट होता है|चंचलता/.test(message),
      detail: 'कर्म-उदय संकेतक वाक्यों से आज की साधना-प्राथमिकता बढ़ती है।',
    },
  ];

  const positiveSum = signals.filter((s) => s.matched).reduce((sum, s) => sum + s.weight, 0);
  const ruleScore = clamp01(positiveSum);

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
