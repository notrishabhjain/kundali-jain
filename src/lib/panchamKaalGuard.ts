// Pancham Kaal (5th Ara) doctrinal ceiling. Moksha is not attainable in this
// Ara; samyak-darshan, punya-bandha and deva-gati are. The practical gunasthana
// ceiling is 5 (deshavirata) on the Digambar strict view.
// Source: TLP-3 (time-cycle / aras); Sarvarthasiddhi §9-10; Codex constraint C4.
// Pancham Kāla (5th Ara) doctrinal constraints and guidance.
//
// Sources (see references/sources.md):
//  - 6 Aras of Avasarpini (Pancham Kāla = 5th, duration ~21,000 years): TLP-3 time-cycle
//    chapter; TRK cosmology; MP-§C3 distillation.
//  - Pancham Kāla began ~525 BCE, ends ~20,476 CE (total ~21,000 years): TLP-3 + MP-§C3.
//  - Max lifespan in Pancham Kāla = 125 years: TLP-3; MP-§C3.
//  - Moksha NOT possible in Pancham Kāla (no 13th–14th gunasthana attainability for
//    householders; muni-diksha is also not achievable in Dushamā): Codex constraint G2-C3.
//  - Achievable in Pancham Kāla: Samyag Darshan (4th gunasthana), Deshavirat-shravak
//    (5th gunasthana), Uttam Dev-gati or Uttam Manushya-gati bandh: MP-§C3.
//  - Ratnatraya (Samyag Darshan + Gyan + Charitra) remains the transformative triad
//    even in Pancham Kāla: TRK; MP-§C3.

export interface PanchamKaalAssertion {
  isPanchamKaal: true;
  mokshaPossible: false;
  allowedGoals: string[];
  statement: string;
  detailedGuidance: string;
}

export function getPanchamKaalAssertion(): PanchamKaalAssertion {
  return {
    isPanchamKaal: true,
    mokshaPossible: false,
    allowedGoals: ['सम्यग्दर्शन (चतुर्थ गुणस्थान)', 'देशविरत श्रावक (पंचम गुणस्थान)', 'उत्तम देव-गति बंध', 'पुण्य बंध', 'कर्म-निर्जरा'],
    statement:
      'हम पंचम काल (दुषम) में हैं — लगभग ५२५ ई.पू. से आरम्भ, लगभग २०,४७६ ई. तक। इस काल में मोक्ष और मुनि-दीक्षा संभव नहीं। किन्तु सम्यग्दर्शन, देशविरत श्रावकव्रत और उत्तम देव-गति बंध के लिए यह काल भी पर्याप्त है।',
    detailedGuidance:
      'पंचम काल में श्रावक का लक्ष्य: (१) चतुर्थ गुणस्थान — सम्यग्दर्शन की प्राप्ति (मिथ्यात्व और अनंतानुबंधी कषाय का क्षयोपशम), (२) पंचम गुणस्थान — अणुव्रत-पालन से देशविरत-श्रावक की स्थिति, (३) शुभ आयुष्य बंध — सौधर्म-ईशान देवलोक की देव-गति। तप, स्वाध्याय, जिन-भक्ति और क्षमा-धर्म इस काल के सर्वश्रेष्ठ साधन हैं।',
  };
}

// Returns a short in-text Pancham Kāla note suitable for inserting in predictions.
// Use this at the end of the "After-death trajectory" domain.
export function getPanchamKaalNote(): string {
  return 'स्मरण रहे — पंचम काल में मोक्ष संभव नहीं। लक्ष्य है: सम्यग्दर्शन की दृढ़ता, देशव्रत-पालन, और सौधर्म-ईशान देवलोक की उत्तम देव-गति का बंध।';
}
