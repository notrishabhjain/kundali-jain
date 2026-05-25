import type { DayContext, UserProfile } from '../engineFacade';
import { calculateRuleScore } from './ruleScoring';
import { getOptionalModelScore } from './enhancer';
import type { IntelligenceDecision } from './types';

const RULE_WEIGHT = 0.7;
const MODEL_WEIGHT = 0.3;

export async function buildIntelligenceDecision(profile: UserProfile, day: DayContext, message: string): Promise<IntelligenceDecision> {
  const base = calculateRuleScore(profile, day, message);

  try {
    const modelScore = await Promise.race([
      getOptionalModelScore({ profile, day, message }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 500)),
    ]);

    if (modelScore === null || Number.isNaN(modelScore)) {
      return base;
    }

    const finalScore = (base.ruleScore * RULE_WEIGHT + modelScore * MODEL_WEIGHT) / (RULE_WEIGHT + MODEL_WEIGHT);

    return {
      ...base,
      modelScore,
      finalScore,
      fallbackUsed: false,
      priority:
        finalScore >= 0.75 ? 'urgent' :
        finalScore >= 0.55 ? 'high' :
        finalScore >= 0.35 ? 'medium' : 'low',
    };
  } catch {
    return base;
  }
}
