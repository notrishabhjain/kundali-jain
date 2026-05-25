export interface IntelligenceSignal {
  key: string;
  weight: number;
  matched: boolean;
  detail: string;
}

export interface IntelligenceDecision {
  ruleScore: number;
  modelScore?: number;
  finalScore: number;
  fallbackUsed: boolean;
  reasonCodes: string[];
  signalsMatched: IntelligenceSignal[];
  priority: 'urgent' | 'high' | 'medium' | 'low';
}
