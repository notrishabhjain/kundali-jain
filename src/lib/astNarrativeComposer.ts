// Source: Master Engineering Specification §8.1 "TypeScript Ingestion of the Narrative AST"
// ASTNarrativeComposer — replaces static template concatenations in narrativeComposer.ts
// with a dynamic slot-filling rule tree.

export interface ASTNode {
  type: 'conditional' | 'text' | 'slot';
  conditionKey?: string;
  expectedValue?: unknown;
  textPayload?: string;
  slotKey?: string;
  children?: ASTNode[];
}

export class ASTNarrativeComposer {
  /**
   * Compiles the Abstract Syntax Tree (AST) into a customized personal narrative.
   * Source: Master Engineering Specification §8.1
   */
  public compile(ast: ASTNode[], context: Record<string, unknown>): string {
    return ast
      .map((node) => {
        if (node.type === 'text') {
          return node.textPayload ?? '';
        }
        if (node.type === 'slot' && node.slotKey) {
          return String(context[node.slotKey] ?? '');
        }
        if (node.type === 'conditional' && node.conditionKey && node.children) {
          const actualValue = context[node.conditionKey];
          if (actualValue === node.expectedValue) {
            return this.compile(node.children, context);
          }
        }
        return '';
      })
      .join('');
  }
}

// ── Pre-built AST templates ────────────────────────────────────────────────

/** Today's status narrative — slots: name, tithi, vara, dashaLord, antarLord, panchamAssertion */
export const VARTAMAN_SUMMARY_AST: ASTNode[] = [
  { type: 'text', textPayload: 'आज ' },
  { type: 'slot', slotKey: 'tithi' },
  { type: 'text', textPayload: ', ' },
  { type: 'slot', slotKey: 'vara' },
  { type: 'text', textPayload: ' के दिन आप ' },
  { type: 'slot', slotKey: 'dashaLord' },
  { type: 'text', textPayload: ' महादशा एवं ' },
  { type: 'slot', slotKey: 'antarLord' },
  { type: 'text', textPayload: ' अंतर्दशा में हैं। ' },
  { type: 'slot', slotKey: 'panchamAssertion' },
];

/** Karma manifestation — slots: karmaName, dailyManifestation */
export const KARMA_MANIFESTATION_AST: ASTNode[] = [
  { type: 'slot', slotKey: 'karmaName' },
  { type: 'text', textPayload: ' कर्म का दैनिक प्रकटन: ' },
  { type: 'slot', slotKey: 'dailyManifestation' },
];

/** Sadhana prescription — slots: sadhanaName, count, timing, dashaRemedy */
export const SADHANA_AST: ASTNode[] = [
  { type: 'slot', slotKey: 'sadhanaName' },
  { type: 'text', textPayload: ' का ' },
  { type: 'slot', slotKey: 'count' },
  { type: 'text', textPayload: ' बार जप (' },
  { type: 'slot', slotKey: 'timing' },
  { type: 'text', textPayload: ') करें। ' },
  { type: 'slot', slotKey: 'dashaRemedy' },
];

/** Urgent alert block — only rendered when alertLevel === 'URGENT' */
export const URGENT_ALERT_AST: ASTNode[] = [
  {
    type: 'conditional',
    conditionKey: 'alertLevel',
    expectedValue: 'URGENT',
    children: [
      { type: 'text', textPayload: '⚠ ' },
      { type: 'slot', slotKey: 'alertMessage' },
    ],
  },
];
