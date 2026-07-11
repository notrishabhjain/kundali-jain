// Source: Master Engineering Specification §8.2 "Concrete Activation of the Model Layer"
// DoctrinalEnhancer — replaces the permanently-null enhancer.ts with a rule-based
// decision engine that evaluates active dasha, gunasthana, karma profile, and Venus
// transits to return non-null real-time guidance.

export interface KarmaProfile {
  jnanavaraniya: number;   // 0-100 intensity
  darshanavaraniya: number;
  vedaniya: number;
  mohaniya: number;
  ayushya: number;
  nama: number;
  gotra: number;
  antaraya: number;
}

export interface DashaSpan {
  karmaName: keyof KarmaProfile;
  startJD: number;
  endJD: number;
  durationYears: number;
}

export interface UnifiedModelResponse {
  isModelAssistantActive: boolean;
  alertLevel: 'LOW' | 'MEDIUM' | 'URGENT';
  doctrinalDirectives: string[];
  recommendedShlokaIndex: number;
  riddhiVibrationKey: string;
}

export class DoctrinalEnhancer {
  /**
   * Evaluates the active user state to return personalized, non-null guidance.
   * Source: Master Engineering Specification §8.2
   */
  public evaluateSystemState(
    currentGunasthana: number,
    activeDasha: DashaSpan,
    karmas: KarmaProfile,
    isVenusAfflicted: boolean
  ): UnifiedModelResponse {
    const directives: string[] = [];
    let alertLevel: 'LOW' | 'MEDIUM' | 'URGENT' = 'LOW';

    // Rule 1: High Mohaniya in lower Gunasthanas = acute delusion risk
    if (currentGunasthana === 1 && karmas.mohaniya > 80) {
      alertLevel = 'URGENT';
      directives.push(
        'गहन मिथ्यात्व का प्रकटन हो रहा है। प्रतिदिन अन्यत्व और अशुचि भावना का अभ्यास करें ताकि सक्रिय कषायें शांत हों।'
      );
    }

    // Rule 2: Venus affliction during Mohaniya dasha → relationship focus
    if (isVenusAfflicted && activeDasha.karmaName === 'mohaniya') {
      if (alertLevel !== 'URGENT') alertLevel = 'MEDIUM';
      directives.push(
        'शुक्र एक कठिन मण्डल में संक्रमण कर रहे हैं और मोहनीय दशा सक्रिय है। द्वितीय अणुव्रत (सत्य) का पालन करके पारिवारिक सामंजस्य की रक्षा करें।'
      );
    }

    // Rule 3: Gunasthana 5 — householder vow consolidation
    if (currentGunasthana === 5) {
      directives.push(
        'आत्मिक प्रगति की पुष्टि हो रही है (देशविरति)। तीन गुणव्रतों को जीवन में दृढ़ करें ताकि वर्तमान गुणस्थान स्थिर रहे।'
      );
    }

    // Rule 4: High Antaraya — obstacle clearing focus
    if (karmas.antaraya > 70) {
      if (alertLevel === 'LOW') alertLevel = 'MEDIUM';
      directives.push(
        'अन्तराय कर्म का प्रबल उदय है। भक्तामर स्तोत्र के 8वें श्लोक का 108 बार जप करें — यह जीवन में आने वाली बाधाओं को दूर करता है।'
      );
    }

    // Rule 5: High Gyanavaraniya — knowledge focus
    if (karmas.jnanavaraniya > 75) {
      directives.push(
        'ज्ञानावरणीय कर्म की तीव्रता है। प्रतिदिन श्रुतज्ञान का अभ्यास करें — श्रुतपंचमी पर विशेष स्वाध्याय लाभकारी है।'
      );
    }

    // Select Bhaktamar shloka recommendation
    let recommendedShlokaIndex = 1;
    let riddhiVibrationKey = 'Om Hreem Arham Namo Jinaanam';

    if (karmas.jnanavaraniya > 75) {
      recommendedShlokaIndex = 6;
      riddhiVibrationKey = 'Om Hreem Arham Namo Shrutajinaanam';
    } else if (isVenusAfflicted) {
      recommendedShlokaIndex = 3;
      riddhiVibrationKey = 'Om Hreem Arham Namo Paramohijinaanam';
    } else if (karmas.antaraya > 70) {
      recommendedShlokaIndex = 8;
      riddhiVibrationKey = 'Om Hreem Arham Namo Mahatapojinaanam';
    } else if (karmas.mohaniya > 80) {
      recommendedShlokaIndex = 4;
      riddhiVibrationKey = 'Om Hreem Arham Namo Anantohijinaanam';
    } else if (currentGunasthana >= 4) {
      recommendedShlokaIndex = 15;
      riddhiVibrationKey = 'Om Hreem Arham Namo Mangalajinaanam';
    }

    if (directives.length === 0) {
      directives.push(
        'आपकी साधना निरंतर है। नवकार मंत्र का जप और सामायिक आत्मा की विशुद्धि बनाए रखें।'
      );
    }

    return {
      isModelAssistantActive: true,
      alertLevel,
      doctrinalDirectives: directives,
      recommendedShlokaIndex,
      riddhiVibrationKey,
    };
  }
}

/** Singleton instance for convenience. */
export const doctrinalEnhancer = new DoctrinalEnhancer();
