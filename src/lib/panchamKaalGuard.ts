export interface PanchamKaalAssertion {
  isPanchamKaal: true;
  mokshaPossible: false;
  allowedGoals: string[];
  statement: string;
}

export function getPanchamKaalAssertion(): PanchamKaalAssertion {
  return {
    isPanchamKaal: true,
    mokshaPossible: false,
    allowedGoals: ['सम्यग्दर्शन', 'पुण्य बन्ध', 'देव-गति'],
    statement:
      'हम पंचम काल (दुषम) में हैं। इस काल में मोक्ष संभव नहीं है, किन्तु सम्यग्दर्शन, पुण्य बन्ध और देव-गति का मार्ग संभव है।',
  };
}
