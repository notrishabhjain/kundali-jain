export const NeoPopTokens = {
  depth: 4,
  borderWidth: 2,
  radius: 2,
} as const;

export type NeoPopPriority = 'urgent' | 'high' | 'medium' | 'low';

export function getPriorityChip(priority: NeoPopPriority): { bg: string; text: string; border: string } {
  if (priority === 'urgent') return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
  if (priority === 'high') return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' };
  if (priority === 'medium') return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' };
  return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
}
