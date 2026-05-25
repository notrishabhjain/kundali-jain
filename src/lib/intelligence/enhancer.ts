import type { DayContext, UserProfile } from '../engineFacade';

export interface EnhancerInput {
  profile: UserProfile;
  day: DayContext;
  message: string;
}

/**
 * Optional model enhancer placeholder.
 * Phase-2 rule-first design keeps app fully functional without this layer.
 */
export async function getOptionalModelScore(_: EnhancerInput): Promise<number | null> {
  return null;
}
