// Source: PARITY-REPORT-2026 §"14 Gunasthana Ladder"
// Doctrinal basis: Sarvarthasiddhi (Pujyapada Devanandi), Gommatsar Jivakanda (Nemichandra Siddhanta Chakravarti)
// The 14 Gunasthanas represent the sequential stages of the soul's ascent from full bondage (mithyatva)
// to complete liberation (moksha), measuring the progressive reduction of Mohaniya karma's grip.

export interface Gunasthana {
  id: number;
  /** Alias for id — matches Master Engineering Specification schema key "stage". */
  stage: number;
  /** Sanskrit/Prakrit name in Devanagari */
  nameHindi: string;
  /** Romanized Sanskrit/Prakrit name. Source: Master Engineering Spec §2.1 gunasthanas.json */
  sanskritName: string;
  /** Roman transliteration (legacy field kept for backward compat) */
  nameEn: string;
  /** English translation. Source: Master Engineering Spec §2.1 */
  englishName: string;
  /** 2-3 sentences in Hindi (Devanagari) describing the soul's state, active karmas, and what is possible. */
  descriptionHindi: string;
  /** Karmic condition in English. Source: Master Engineering Spec §2.1 */
  karmicState: string;
  /** Classical duration expression. Source: Master Engineering Spec §2.1 */
  durationLimit: string;
  /** Key characteristics of this stage (English). Source: Master Engineering Spec §2.1 */
  attributes: string[];
  /**
   * Whether this stage is attainable in the current Pancham Kaal (5th Ara).
   * Strict Digambar view (Sarvarthasiddhi): maximum gunasthana possible in Pancham Kaal is 5 (Deshavirati).
   * Stages 1-5 = true; 6-14 = false.
   */
  possibleInPanchamKal: boolean;
  /**
   * State of Mohaniya karma at this stage:
   * - 'active'     : Mohaniya in full or near-full udaya (stages 1-4)
   * - 'reduced'    : Mohaniya udaya weakening; Anantanubandhi absent but Apratyakhyan/Pratyakhyan/Sanjwalan present (stages 5-7)
   * - 'suppressed' : Mohaniya undergoing upasham (suppression) or intense kshaya on shreni (stages 8-11)
   * - 'destroyed'  : Mohaniya completely kshaya'd (stages 12-14)
   */
  mohaniyaState: 'active' | 'reduced' | 'suppressed' | 'destroyed';
  /**
   * Which of the 8 karmas can still be freshly bound (nava-bandha) at this stage.
   * Names given in Devanagari matching the 8 mula-karma categories.
   * Empty array means no new karma is bound (nirjara only).
   */
  karmasBound: string[];
}

export const GUNASTHANAS: Gunasthana[] = [
  {
    id: 1,
    stage: 1,
    nameHindi: 'मिथ्यादृष्टि',
    sanskritName: 'Mithyādṛṣṭi',
    nameEn: 'Mithyādrshti',
    englishName: 'Wrong Belief',
    karmicState: 'Intense fruition of Mithyātva and Anantānubandhī passions.',
    durationLimit: 'Anādi-ananta or Anādi-sānta',
    attributes: [
      'Absolute identification of the physical body with the soul.',
      'Inability to differentiate between Jīva and Ajīva.',
      'Deeply bound by passions, causing attachment and aversion.',
    ],
    descriptionHindi:
      'इस गुणस्थान में जीव मिथ्यात्व-मोहनीय कर्म के पूर्ण उदय में रहता है — सात तत्त्वों की यथार्थ श्रद्धा सर्वथा अनुपस्थित होती है। अनंतानुबंधी क्रोध, मान, माया और लोभ चारों कषाय प्रबल रूप से सक्रिय होती हैं, जिससे सम्यग्दर्शन का द्वार अवरुद्ध रहता है। आठों कर्मों का नवीन बंध अनवरत होता रहता है और जीव चतुर्गति-संसार में भटकता रहता है।',
    possibleInPanchamKal: true,
    mohaniyaState: 'active',
    karmasBound: [
      'ज्ञानावरणीय',
      'दर्शनावरणीय',
      'वेदनीय',
      'मोहनीय',
      'आयुष्य',
      'नाम',
      'गोत्र',
      'अंतराय',
    ],
  },
  {
    id: 2,
    stage: 2,
    nameHindi: 'सासादन सम्यग्दृष्टि',
    sanskritName: 'Sāsvādana-Samyagdṛṣṭi',
    nameEn: 'Sāsādana Samyagdrshti',
    englishName: 'Taste of Right Belief',
    karmicState: 'Fruition of Anantānubandhī passions during spiritual descent.',
    durationLimit: 'Minimum 1 instant; maximum 6 Avalis',
    attributes: [
      'A transient, fleeting phase of spiritual descent.',
      'Characterized by a brief, passing memory of truth.',
      'The soul inevitably falls back to the baseline 1st stage.',
    ],
    descriptionHindi:
      'इस गुणस्थान में जीव चतुर्थ गुणस्थान से च्युत होकर आता है; उसके परिणामों में सम्यग्दर्शन की रेखा अभी शेष है किंतु तीव्र गति से मिट रही है। यह अवस्था अत्यल्पकालीन (अंतर्मुहूर्त से भी कम) होती है — जीव या तो पुनः ऊपर उठता है या मिथ्यात्व में जा गिरता है। अनंतानुबंधी कषाय का उदय प्रारंभ होने से यह पतन-क्रम उत्पन्न होता है।',
    possibleInPanchamKal: true,
    mohaniyaState: 'active',
    karmasBound: [
      'ज्ञानावरणीय',
      'दर्शनावरणीय',
      'वेदनीय',
      'मोहनीय',
      'आयुष्य',
      'नाम',
      'गोत्र',
      'अंतराय',
    ],
  },
  {
    id: 3,
    stage: 3,
    nameHindi: 'मिश्रदृष्टि',
    sanskritName: 'Miśradṛṣṭi',
    nameEn: 'Samyak-Mithyādrshti (Mishrādrshti)',
    englishName: 'Mixed Belief',
    karmicState: 'Simultaneous fruition of Samyaktva and Mithyātva.',
    durationLimit: 'Maximum 1 Antarmuhūrta',
    attributes: [
      'An unstable, fluctuating state of faith and doubt.',
      'The soul oscillates between truth and false beliefs.',
      'Cannot commit to a steady path or take vows.',
    ],
    descriptionHindi:
      'इस गुणस्थान में जीव के परिणाम सम्यक्त्व और मिथ्यात्व के सम्मिश्रण में होते हैं — न वे पूर्णतः सम्यग्दृष्टि हैं, न पूर्णतः मिथ्यादृष्टि। मिश्र-मोहनीय कर्म के उदय से यह तृतीय अवस्था निर्मित होती है और यह भी अंतर्मुहूर्त-मात्र रहती है। इस गुणस्थान में अणुव्रत या महाव्रत ग्रहण करना सम्भव नहीं होता।',
    possibleInPanchamKal: true,
    mohaniyaState: 'active',
    karmasBound: [
      'ज्ञानावरणीय',
      'दर्शनावरणीय',
      'वेदनीय',
      'मोहनीय',
      'आयुष्य',
      'नाम',
      'गोत्र',
      'अंतराय',
    ],
  },
  {
    id: 4,
    stage: 4,
    nameHindi: 'अविरति सम्यग्दृष्टि',
    sanskritName: 'Avirata-Samyagdṛṣṭi',
    nameEn: 'Avirāti Samyagdrshti',
    englishName: 'Right Belief without Self-Control',
    karmicState: 'Destruction or suppression of Anantānubandhī passions.',
    durationLimit: 'Maximum 33 Sagaropamas',
    attributes: [
      'Right belief is firmly secured, but lacks self-control.',
      'Deeply understands the truth but is unable to implement vows.',
      'Protected from sliding back to the first stage.',
    ],
    descriptionHindi:
      'इस गुणस्थान में जीव को सम्यग्दर्शन स्थिर रूप से प्राप्त हो जाता है — जीव, अजीव, आश्रव, बंध, संवर, निर्जरा और मोक्ष की सच्ची श्रद्धा दृढ़ हो जाती है। अनंतानुबंधी कषाय शांत हो गई है, परंतु अप्रत्याख्यान कषाय के उदय से संयम ग्रहण अभी संभव नहीं। अविरति (व्रत-रहितता) के बावजूद यह आत्म-विकास का प्रथम स्थिर सोपान है।',
    possibleInPanchamKal: true,
    mohaniyaState: 'active',
    karmasBound: [
      'ज्ञानावरणीय',
      'दर्शनावरणीय',
      'वेदनीय',
      'मोहनीय',
      'आयुष्य',
      'नाम',
      'गोत्र',
      'अंतराय',
    ],
  },
  {
    id: 5,
    stage: 5,
    nameHindi: 'देशविरति',
    sanskritName: 'Deśavirata',
    nameEn: 'Deshavirati',
    englishName: 'Partial Self-Control',
    karmicState: 'Suppression or destruction of Apratyākhyāna passions.',
    durationLimit: 'Less than 1 Purvakoti',
    attributes: [
      'Active commitment to the householder vows (Layman\'s Śrāvaka Vratas).',
      'Partial self-restraint is established.',
      'The soul begins to thin the layers of obscuring karmas.',
    ],
    descriptionHindi:
      'इस गुणस्थान में जीव श्रावक-धर्म के पाँच अणुव्रत और सात शीलव्रत अंगीकार कर आंशिक संयम के पथ पर अग्रसर होता है। प्रत्याख्यान-आवरण कषाय शांत होती है किंतु संज्वलन कषाय अभी शेष है। दिगंबर परंपरा के सुनिश्चित सिद्धांत के अनुसार पंचम काल में अधिकतम यही गुणस्थान संभव है; इससे ऊपर के गुणस्थान इस काल में अप्राप्य हैं।',
    possibleInPanchamKal: true,
    mohaniyaState: 'reduced',
    karmasBound: [
      'ज्ञानावरणीय',
      'दर्शनावरणीय',
      'वेदनीय',
      'मोहनीय',
      'आयुष्य',
      'नाम',
      'गोत्र',
      'अंतराय',
    ],
  },
  {
    id: 6,
    stage: 6,
    nameHindi: 'प्रमत्त संयत',
    sanskritName: 'Pramatta-Samyata',
    nameEn: 'Pramatta Samyata',
    englishName: 'Complete Control with Carelessness',
    karmicState: 'Suppression or destruction of Pratyākhyāna passions with Pramāda.',
    durationLimit: 'Maximum 1 Antarmuhūrta',
    attributes: [
      'The transition to monastic life and great vows (Mahāvratas).',
      'Possesses complete self-control but suffers from occasional laxity.',
    ],
    descriptionHindi:
      'इस गुणस्थान में जीव मुनि-दीक्षा के अट्ठाईस मूलगुणों का पालन करता है, तथापि प्रमाद (निद्रा, विकथा, कषाय-जनित असावधानी) बना रहता है। संज्वलन कषाय के मंद-मंद उदय से चित्त की पूर्ण स्थिरता अभी उपलब्ध नहीं होती। यह गुणस्थान और सप्तम गुणस्थान बारी-बारी से प्रकट-अप्रकट होते रहते हैं।',
    possibleInPanchamKal: false,
    mohaniyaState: 'reduced',
    karmasBound: [
      'ज्ञानावरणीय',
      'दर्शनावरणीय',
      'वेदनीय',
      'मोहनीय',
      'आयुष्य',
      'नाम',
      'गोत्र',
      'अंतराय',
    ],
  },
  {
    id: 7,
    stage: 7,
    nameHindi: 'अप्रमत्त संयत',
    sanskritName: 'Apramatta-Samyata',
    nameEn: 'Apramatta Samyata',
    englishName: 'Complete Control without Carelessness',
    karmicState: 'Complete suppression of Pramāda; deep meditation.',
    durationLimit: 'Maximum 1 Antarmuhūrta',
    attributes: [
      'Perfect monastic discipline with deep meditation.',
      'Maintains flawless observance of vows without carelessness.',
    ],
    descriptionHindi:
      'इस गुणस्थान में जीव प्रमाद से रहित होकर पूर्ण संयम में स्थित रहता है — प्रत्येक क्षण आत्मा की जागृति परिपूर्ण होती है। संज्वलन कषाय अत्यंत मंद है और नए मोहनीय व आयुष्य-कर्म का बंध रुक जाता है। यहाँ से जीव उपशम-श्रेणी अथवा क्षपक-श्रेणी पर आरोहण का संकल्प करता है।',
    possibleInPanchamKal: false,
    mohaniyaState: 'reduced',
    karmasBound: [
      'ज्ञानावरणीय',
      'दर्शनावरणीय',
      'वेदनीय',
      'नाम',
      'गोत्र',
      'अंतराय',
    ],
  },
  {
    id: 8,
    stage: 8,
    nameHindi: 'अपूर्वकरण',
    sanskritName: 'Apūrva-Karaṇa',
    nameEn: 'Apūrvakarana',
    englishName: 'New Process',
    karmicState: 'Initiation of dynamic meditation processes; suppression of emotions.',
    durationLimit: 'Maximum 1 Antarmuhūrta',
    attributes: [
      'Experience of unique, unprecedented meditative states.',
      'Initiates the destruction of secondary passions (No-Kashayas).',
    ],
    descriptionHindi:
      'इस गुणस्थान में जीव की परिणाम-विशुद्धि प्रतिसमय बढ़ती जाती है और वह परिणाम अपूर्व (पहले कभी अनुभव न किए गए) होते हैं। उपशम-श्रेणी या क्षपक-श्रेणी पर आरोहण प्रारंभ होता है और मोहनीय कर्म की अनेक प्रकृतियों का उपशमन अथवा क्षय द्रुत गति से होने लगता है। इस श्रेणी पर एक साथ कई जीव हो सकते हैं, किंतु उन सभी के परिणाम भिन्न-भिन्न होते हैं।',
    possibleInPanchamKal: false,
    mohaniyaState: 'suppressed',
    karmasBound: [
      'ज्ञानावरणीय',
      'दर्शनावरणीय',
      'वेदनीय',
      'नाम',
      'गोत्र',
      'अंतराय',
    ],
  },
  {
    id: 9,
    stage: 9,
    nameHindi: 'अनिवृत्तिकरण',
    sanskritName: 'Anivṛtti-karaṇa',
    nameEn: 'Anivrttikarana',
    englishName: 'No-Return Process',
    karmicState: 'Advanced destruction of emotional passions.',
    durationLimit: 'Maximum 1 Antarmuhūrta',
    attributes: [
      'Impossible to slide back to lower states of consciousness.',
      'Systematic elimination of gross passions.',
    ],
    descriptionHindi:
      'इस गुणस्थान की विशेषता यह है कि एक ही समय में इस श्रेणी पर आरूढ़ समस्त जीवों के परिणाम तुल्य (एक-समान) रहते हैं — इसीलिए इसे अनिवृत्ति (अभेद) करण कहते हैं। मोहनीय की शेष प्रकृतियों का उपशमन या नाश तीव्र वेग से होता है और कषायों का नवीन बंध न्यूनतम हो जाता है। जीव की आत्मा अब उच्चतर विशुद्धि की ओर निर्बाध गति करती है।',
    possibleInPanchamKal: false,
    mohaniyaState: 'suppressed',
    karmasBound: [
      'ज्ञानावरणीय',
      'दर्शनावरणीय',
      'वेदनीय',
      'नाम',
      'गोत्र',
    ],
  },
  {
    id: 10,
    stage: 10,
    nameHindi: 'सूक्ष्म साम्पराय',
    sanskritName: 'Sūkṣma-Sāmparāya',
    nameEn: 'Sūkshma Sāmparāya',
    englishName: 'War with Subtle Passions',
    karmicState: 'Presence of only subtle, refined greed (Lobha).',
    durationLimit: 'Maximum 1 Antarmuhūrta',
    attributes: [
      'Only microscopic, refined greed remains.',
      'Final internal purification before absolute clarity.',
    ],
    descriptionHindi:
      'इस गुणस्थान में केवल सूक्ष्म संज्वलन-लोभ (अत्यंत मंद कषाय का अंतिम अवशेष) ही शेष रहता है — क्रोध, मान और माया सर्वथा उपशांत अथवा क्षीण हो चुकी हैं। यह मोहनीय-विजय का चरम बिंदु है; यहाँ से जीव या तो उपशांत-मोह (ग्यारहवाँ) में जाता है या क्षीण-मोह (बारहवाँ) में। नए कर्म-बंध अत्यल्प हैं।',
    possibleInPanchamKal: false,
    mohaniyaState: 'suppressed',
    karmasBound: [
      'ज्ञानावरणीय',
      'दर्शनावरणीय',
      'वेदनीय',
      'नाम',
    ],
  },
  {
    id: 11,
    stage: 11,
    nameHindi: 'उपशांत मोह',
    sanskritName: 'Upaśānta-Kaṣāya-Vītarāga',
    nameEn: 'Upashānta Moha',
    englishName: 'Delusion Pacified',
    karmicState: 'Complete temporary suppression of Mohaniya karmas.',
    durationLimit: 'Maximum 1 Antarmuhūrta',
    attributes: [
      'Perfect peace and absolute temporary tranquility.',
      'Delusion is temporarily pacified; a slide back is still possible.',
    ],
    descriptionHindi:
      'इस गुणस्थान में समस्त मोहनीय कर्म की प्रकृतियाँ उपशांत (दबी हुई) हैं — नष्ट नहीं। यह उपशम-श्रेणी का सर्वोच्च बिंदु है और स्वभावतः अस्थिर है; जब दबे हुए मोहनीय का पुनः उदय होता है, तो जीव सप्तम या उससे नीचे के गुणस्थान में पतित हो जाता है। इस अवस्था में कोई नया कर्म-बंध नहीं होता।',
    possibleInPanchamKal: false,
    mohaniyaState: 'suppressed',
    karmasBound: [],
  },
  {
    id: 12,
    stage: 12,
    nameHindi: 'क्षीण मोह',
    sanskritName: 'Kṣīṇa-Kaṣāya-Vītarāga',
    nameEn: 'Kshina Moha',
    englishName: 'Delusion Destroyed',
    karmicState: 'Permanent, complete destruction of Mohaniya karmas.',
    durationLimit: 'Maximum 1 Antarmuhūrta',
    attributes: [
      'Irreversible destruction of all delusion and passion.',
      'Perfect tranquility; prepared for complete omniscience.',
    ],
    descriptionHindi:
      'इस गुणस्थान में समस्त मोहनीय कर्म का सर्वथा क्षय (विनाश) हो जाता है — यह क्षपक-श्रेणी का शीर्ष है और यह प्राप्ति स्थायी है, पतन अब असंभव है। शेष तीन घाती कर्म (ज्ञानावरणीय, दर्शनावरणीय, अंतराय) का क्षय अगले ही क्षणों में होने वाला है। नए कर्म का बंध पूर्णतः रुक गया है।',
    possibleInPanchamKal: false,
    mohaniyaState: 'destroyed',
    karmasBound: [],
  },
  {
    id: 13,
    stage: 13,
    nameHindi: 'सयोगी केवली',
    sanskritName: 'Sayoga-Kevalin',
    nameEn: 'Sayogi Kevalin',
    englishName: 'Omniscient with Activity',
    karmicState: 'Permanent destruction of all Ghatiya (destructive) karmas.',
    durationLimit: 'Less than 1 Purvakoti',
    attributes: [
      'Attainment of infinite knowledge and perception (Kevalajñāna).',
      'Worldly activities of body, speech, and mind remain.',
    ],
    descriptionHindi:
      'इस गुणस्थान में चारों घाती कर्मों (ज्ञानावरणीय, दर्शनावरणीय, मोहनीय, अंतराय) का सम्पूर्ण क्षय होकर जीव को केवलज्ञान, केवलदर्शन, अनंत-सुख और अनंत-वीर्य एक साथ प्राप्त होते हैं। शरीर, वचन और मन की क्रिया (योग) अभी शेष है; यदि जीव ने पूर्व में तीर्थंकर-नाम-कर्म बाँधा हो तो वह तीर्थंकर-भगवान् के रूप में समवसरण में विराजते हैं। अघाती कर्म (वेदनीय, आयुष्य, नाम, गोत्र) का भोग होता रहता है किंतु कोई नया कर्म नहीं बँधता।',
    possibleInPanchamKal: false,
    mohaniyaState: 'destroyed',
    karmasBound: [],
  },
  {
    id: 14,
    stage: 14,
    nameHindi: 'अयोगी केवली',
    sanskritName: 'Ayoga-Kevalin',
    nameEn: 'Ayogi Kevalin',
    englishName: 'Omniscient without Activity',
    karmicState: 'Complete cessation of all activities; shedding remaining Aghatiya karmas.',
    durationLimit: 'Duration of chanting five short vowels',
    attributes: [
      'Ceases all physical and mental activity.',
      'The final moments before absolute liberation (Moksha).',
    ],
    descriptionHindi:
      'यह जीव का अंतिम गुणस्थान है जिसमें मन, वचन और काय — तीनों योगों की क्रिया पूर्णतः निरुद्ध हो जाती है। शेष चार अघाती कर्म (वेदनीय, आयुष्य, नाम, गोत्र) का समूल क्षय होते ही जीव मोक्ष-पद को प्राप्त होता है और लोक के अग्रभाग (सिद्धशिला) में अनंत काल के लिए विराजमान हो जाता है। यह अवस्था अत्यल्पकालीन है — कुछ ही समय में जीव सिद्ध-परमेष्ठी बन जाता है।',
    possibleInPanchamKal: false,
    mohaniyaState: 'destroyed',
    karmasBound: [],
  },
];

/**
 * Look up a Gunasthana by its ordinal id (1-14).
 * Returns undefined for any id outside that range.
 */
export function getGunasthanaById(id: number): Gunasthana | undefined {
  return GUNASTHANAS.find((g) => g.id === id);
}
