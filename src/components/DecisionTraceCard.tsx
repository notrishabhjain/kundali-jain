import React from 'react';
import type { IntelligenceDecision } from '../lib/intelligence/types';
import { getPriorityChip } from '../theme/tokens';

interface DecisionTraceCardProps {
  decision: IntelligenceDecision;
  compact?: boolean;
}

export default function DecisionTraceCard({ decision, compact }: DecisionTraceCardProps) {
  const title = compact ? 'निर्णय-ट्रेस' : 'बुद्धिमान निर्णय-ट्रेस';
  const chip = getPriorityChip(decision.priority);
  return (
    <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
      <div className="flex items-center justify-between mb-2"><h3 className="text-lg font-bold text-blue-900">{title}</h3><span className={`text-xs px-2 py-1 border rounded ${chip.bg} ${chip.text} ${chip.border}`}>{decision.priority}</span></div>
      <p className="text-sm text-blue-800 mb-2">
        अंतिम स्कोर: {(decision.finalScore * 100).toFixed(0)}% • आधार: {decision.fallbackUsed ? 'नियम-आधारित' : 'नियम + मॉडल'}
      </p>
      <p className="text-xs text-blue-700">
        संकेत: {decision.reasonCodes.length > 0 ? decision.reasonCodes.join(', ') : 'कोई विशेष संकेत नहीं'}
      </p>
    </div>
  );
}
