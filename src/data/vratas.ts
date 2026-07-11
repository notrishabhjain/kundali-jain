// Source: PARITY-REPORT-2026 §"12 Shravaka Vratas"
// 12 Śrāvaka Vratas — the complete householder code of conduct.
// 5 Aṇuvratas + 3 Guṇavratas + 4 Śikṣāvratas.
// Doctrine: Tattvartha Sutra ch. 7; Ratnakaranda Shravakachara (Samantabhadra);
//           Sarvarthasiddhi §7.1-7.35.

export type VrataCategory = 'Anuvrata' | 'Gunavrata' | 'Shikshavrata';

export interface VrataAtichara {
  hindi: string;    // what infringement looks like in daily life
}

export interface Vrata {
  id: number;
  /** Sequential vow number 1-12. Source: Master Engineering Specification §2.1 */
  vowNumber: number;
  categoryEn: VrataCategory;
  categoryHindi: string;
  /** Vrata class with diacritics (Aṇuvrata/Guṇavrata/Śikṣāvrata). Source: Master Engineering Spec §2.1 */
  vrataClass: string;
  nameHindi: string;
  nameEn: string;
  /** Romanized Sanskrit name. Source: Master Engineering Specification §2.1 sravaka_vratas.json */
  sanskritName: string;
  /** English name. Source: Master Engineering Specification §2.1 */
  englishName: string;
  /** English description of the vow. Source: Master Engineering Specification §2.1 */
  description: string;
  descriptionHindi: string;     // what the vow entails
  dailyPracticeHindi: string;   // concrete daily observance
  aticharas: VrataAtichara[];   // 5 aticharas (partial infractions) for each
  karmaReduced: string[];       // which karmas this weakens (Devanagari)
  gunasthanaRequired: number;   // minimum gunasthana to take this vow
}

export const VRATAS: Vrata[] = [
  // ─── 5 Aṇuvratas ───────────────────────────────────────────────────────────
  {
    id: 1,
    vowNumber: 1,
    categoryEn: 'Anuvrata',
    categoryHindi: 'अणुव्रत',
    vrataClass: 'Aṇuvrata',
    nameHindi: 'अहिंसा अणुव्रत',
    nameEn: 'Ahimsa Anuvrata',
    sanskritName: 'Sthūla-Prāṇātipāta-Viramana',
    englishName: 'Lesser Vow of Non-violence',
    description: 'Refraining from intentionally injuring or killing two-to-five-sensed living beings.',
    descriptionHindi:
      'स्थूल (प्रत्यक्ष) हिंसा का त्याग। द्विइन्द्रिय से पञ्चेन्द्रिय जीवों की जान-बूझकर हिंसा नहीं करना।',
    dailyPracticeHindi:
      'माँस, मदिरा और मधु का पूर्ण त्याग। हिंसक व्यवसाय न करना। रात्रि-भोजन का परित्याग।',
    aticharas: [
      { hindi: 'बंध — जीव को अनावश्यक बाँधना' },
      { hindi: 'वध — प्रत्यक्ष हत्या' },
      { hindi: 'छविच्छेद — अंग-भंग करना' },
      { hindi: 'अतिभार — क्षमता से अधिक बोझ लादना' },
      { hindi: 'अन्नपान-निरोध — भोजन-जल से वंचित करना' }
    ],
    karmaReduced: ['मोहनीय', 'नाम', 'आयुष्य'],
    gunasthanaRequired: 5
  },
  {
    id: 2,
    vowNumber: 2,
    categoryEn: 'Anuvrata',
    categoryHindi: 'अणुव्रत',
    vrataClass: 'Aṇuvrata',
    nameHindi: 'सत्य अणुव्रत',
    nameEn: 'Satya Anuvrata',
    sanskritName: 'Sthūla-Mṛṣāvāda-Viramana',
    englishName: 'Lesser Vow of Truthfulness',
    description: 'Avoiding gross falsehoods, slander, and deceptive speech.',
    descriptionHindi:
      'स्थूल असत्य का त्याग। घर, जमीन, जीव या स्त्री के बारे में झूठ न बोलना।',
    dailyPracticeHindi:
      'व्यापार में माप-तौल में सत्यता। लालच या भय से असत्य न बोलना। अनावश्यक वचन का परिहार।',
    aticharas: [
      { hindi: 'मिथ्योपदेश — झूठी शिक्षा देना' },
      { hindi: 'रहस्याभ्याख्यान — गोपनीय बात उजागर करना' },
      { hindi: 'कूटलेखकरण — जाली दस्तावेज बनाना' },
      { hindi: 'न्यासापहार — अमानत में खयानत' },
      { hindi: 'साकारमन्त्रभेद — साथी का विश्वास तोड़ना' }
    ],
    karmaReduced: ['मोहनीय', 'ज्ञानावरणीय'],
    gunasthanaRequired: 5
  },
  {
    id: 3,
    vowNumber: 3,
    categoryEn: 'Anuvrata',
    categoryHindi: 'अणुव्रत',
    vrataClass: 'Aṇuvrata',
    nameHindi: 'अचौर्य अणुव्रत',
    nameEn: 'Achaurya Anuvrata',
    sanskritName: 'Sthūla-Adattādāna-Viramana',
    englishName: 'Lesser Vow of Non-stealing',
    description: 'Refraining from taking anything not explicitly given by its owner.',
    descriptionHindi:
      'स्थूल चोरी का त्याग। बिना अनुमति किसी की वस्तु न लेना।',
    dailyPracticeHindi:
      'सरकारी कर ईमानदारी से देना। मिलावट न करना। दूसरे की संपत्ति पर दृष्टि न रखना।',
    aticharas: [
      { hindi: 'स्तेनाहृत — चोर से माल खरीदना' },
      { hindi: 'तस्करद्रव्यहरण — तस्करी में सहयोग' },
      { hindi: 'विरुद्धराज्यातिक्रम — राज्य-नियम तोड़ना' },
      { hindi: 'कूटतुला-मान — नकली माप-तौल' },
      { hindi: 'तद्विरुद्धव्यवहार — अनुचित व्यापार' }
    ],
    karmaReduced: ['अन्तराय', 'मोहनीय'],
    gunasthanaRequired: 5
  },
  {
    id: 4,
    vowNumber: 4,
    categoryEn: 'Anuvrata',
    categoryHindi: 'अणुव्रत',
    vrataClass: 'Aṇuvrata',
    nameHindi: 'ब्रह्मचर्य अणुव्रत',
    nameEn: 'Brahmacharya Anuvrata',
    sanskritName: 'Sthūla-Maithuna-Viramana',
    englishName: 'Lesser Vow of Chastity',
    description: 'Absolute fidelity to spouse; sensory moderation and restraint.',
    descriptionHindi:
      'परस्त्री/परपुरुष से संबंध का त्याग। केवल विवाहित साथी के साथ संयमित सम्बन्ध।',
    dailyPracticeHindi:
      'परस्त्री-दर्शन और स्पर्श से बचना। वासनात्मक साहित्य और दृश्यों का परिहार।',
    aticharas: [
      { hindi: 'परविवाहकरण — दूसरों के विवाह में कामुकता' },
      { hindi: 'अनंगक्रीडा — कामोत्तेजक खेल' },
      { hindi: 'परगृहागमन — परनारी/पुरुष के घर अकारण जाना' },
      { hindi: 'कामतीव्राभिलाष — तीव्र कामेच्छा' },
      { hindi: 'परिग्रहीतागमन — गणिका-सम्पर्क' }
    ],
    karmaReduced: ['मोहनीय', 'वेदनीय'],
    gunasthanaRequired: 5
  },
  {
    id: 5,
    vowNumber: 5,
    categoryEn: 'Anuvrata',
    categoryHindi: 'अणुव्रत',
    vrataClass: 'Aṇuvrata',
    nameHindi: 'परिग्रह-परिमाण अणुव्रत',
    nameEn: 'Parigraha-Parimana Anuvrata',
    sanskritName: 'Sthūla-Parigraha-Parimana',
    englishName: 'Lesser Vow of Non-possession',
    description: 'Restricting wealth, physical assets, and properties to defined limits.',
    descriptionHindi:
      'संपत्ति, भूमि, धन, वस्तुओं और सम्बन्धों की एक सीमा निश्चित करना। उससे अधिक का लोभ त्यागना।',
    dailyPracticeHindi:
      'जरूरत से अधिक संचय न करना। दान का नियम बनाना। उपभोग में मितव्ययिता।',
    aticharas: [
      { hindi: 'क्षेत्रावास-परिमाण अतिक्रम — भूमि-सीमा उल्लंघन' },
      { hindi: 'हिरण्यसुवर्ण-परिमाण — धन-सीमा उल्लंघन' },
      { hindi: 'धान्य-परिमाण — अनाज-सीमा उल्लंघन' },
      { hindi: 'द्विपद-चतुष्पद-परिमाण — पशु-सीमा उल्लंघन' },
      { hindi: 'कुप्यभाण्ड-परिमाण — सामान-सीमा उल्लंघन' }
    ],
    karmaReduced: ['मोहनीय', 'अन्तराय'],
    gunasthanaRequired: 5
  },

  // ─── 3 Guṇavratas ──────────────────────────────────────────────────────────
  {
    id: 6,
    vowNumber: 6,
    categoryEn: 'Gunavrata',
    categoryHindi: 'गुणव्रत',
    vrataClass: 'Guṇavrata',
    nameHindi: 'दिग्व्रत',
    nameEn: 'Digvrata',
    sanskritName: 'Dig-Parimāna-Vrata',
    englishName: 'Directional Limitation Vow',
    description: 'Restricting physical travel limits in ten cardinal directions.',
    descriptionHindi:
      'दिशाओं में यात्रा और गतिविधि की सीमा निश्चित करना। इससे हिंसा का क्षेत्र स्वयं सीमित हो जाता है।',
    dailyPracticeHindi:
      'प्रतिदिन या सप्ताह की यात्रा-दिशा और दूरी का एक नियम निश्चित करना।',
    aticharas: [
      { hindi: 'ऊर्ध्व-सीमा उल्लंघन' },
      { hindi: 'अधः-सीमा उल्लंघन' },
      { hindi: 'तिर्यक्-सीमा उल्लंघन' },
      { hindi: 'क्षेत्र-विस्मृति' },
      { hindi: 'अतिक्रमण स्वीकृति' }
    ],
    karmaReduced: ['मोहनीय', 'आयुष्य'],
    gunasthanaRequired: 5
  },
  {
    id: 7,
    vowNumber: 7,
    categoryEn: 'Gunavrata',
    categoryHindi: 'गुणव्रत',
    vrataClass: 'Guṇavrata',
    nameHindi: 'देशव्रत (भोगोपभोग-परिमाण)',
    nameEn: 'Deshavrata',
    sanskritName: 'Bhogopabhoga-Parimana',
    englishName: 'Consumption Limitation Vow',
    description: 'Restricting consumer goods, garments, food items, and reusable assets.',
    descriptionHindi:
      'प्रतिदिन उपभोग की जाने वाली वस्तुओं की संख्या और प्रकार सीमित करना। अनावश्यक भोग का त्याग।',
    dailyPracticeHindi:
      'एक निश्चित समय पर एक बार भोजन। विशेष दिनों में उपवास अथवा एकाशन।',
    aticharas: [
      { hindi: 'सचित्त-आहार सेवन' },
      { hindi: 'सचित्त-सम्बद्ध-आहार' },
      { hindi: 'अपक्व-आहार' },
      { hindi: 'दुष्पक्व-आहार' },
      { hindi: 'तुच्छ-ओषधि-सेवन' }
    ],
    karmaReduced: ['वेदनीय', 'मोहनीय'],
    gunasthanaRequired: 5
  },
  {
    id: 8,
    vowNumber: 8,
    categoryEn: 'Gunavrata',
    categoryHindi: 'गुणव्रत',
    vrataClass: 'Guṇavrata',
    nameHindi: 'अनर्थदण्ड-विरमण',
    nameEn: 'Anarthadanda Viramana',
    sanskritName: 'Anartha-Danda-Viramana',
    englishName: 'Purposeless Harm Vow',
    description: 'Avoiding harmful actions that yield no spiritual or physical utility.',
    descriptionHindi:
      'बिना प्रयोजन हिंसा, वाणी-दोष और पापकारी कार्यों का त्याग। व्यर्थ के कार्यों से निवृत्ति।',
    dailyPracticeHindi:
      'मनोरंजन के नाम पर हिंसात्मक सामग्री न देखना। कटुवचन और निंदा का परिहार।',
    aticharas: [
      { hindi: 'कंदर्प — कामुक वचन' },
      { hindi: 'कौत्कुच्य — अश्लील हाव-भाव' },
      { hindi: 'मौखर्य — वाचालता' },
      { hindi: 'असमीक्ष्याधिकरण — बिना सोचे कार्य' },
      { hindi: 'उपभोग-परिभोग-अनर्थ — व्यर्थ उपभोग' }
    ],
    karmaReduced: ['मोहनीय', 'नाम'],
    gunasthanaRequired: 5
  },

  // ─── 4 Śikṣāvratas ─────────────────────────────────────────────────────────
  {
    id: 9,
    vowNumber: 9,
    categoryEn: 'Shikshavrata',
    categoryHindi: 'शिक्षाव्रत',
    vrataClass: 'Śikṣāvrata',
    nameHindi: 'सामायिक',
    nameEn: 'Samayika',
    sanskritName: 'Sāmāyika-Vrata',
    englishName: 'Equanimity Training Vow',
    description: 'Committing to a minimum of 48 minutes of peaceful meditation daily.',
    descriptionHindi:
      'प्रतिदिन 48 मिनट (एक मुहूर्त) समभाव-ध्यान में बैठना। इस समय मन, वचन और काय की गतिविधि पूर्णतः आत्मा में केन्द्रित होती है।',
    dailyPracticeHindi:
      'प्रातः-सायं एक-एक सामायिक। बैठकर नवकार मंत्र, स्वाध्याय और ध्यान।',
    aticharas: [
      { hindi: 'मन-दुष्प्रणिधान — अशुभ मन-प्रवृत्ति' },
      { hindi: 'वचन-दुष्प्रणिधान — अशुभ वचन' },
      { hindi: 'काय-दुष्प्रणिधान — अशुभ काय-प्रवृत्ति' },
      { hindi: 'अनादर — सामायिक में उपेक्षा' },
      { hindi: 'स्मृति-अनुपस्थान — विस्मरण' }
    ],
    karmaReduced: ['ज्ञानावरणीय', 'दर्शनावरणीय', 'मोहनीय'],
    gunasthanaRequired: 5
  },
  {
    id: 10,
    vowNumber: 10,
    categoryEn: 'Shikshavrata',
    categoryHindi: 'शिक्षाव्रत',
    vrataClass: 'Śikṣāvrata',
    nameHindi: 'देशावकाशिक',
    nameEn: 'Deshavakashika',
    sanskritName: 'Deśāvakāśika-Vrata',
    englishName: 'Despatialization Vow',
    description: 'Compressing geographic travel limits for shorter, specific periods.',
    descriptionHindi:
      'एक निश्चित समय के लिए स्थान और गतिविधि को और अधिक सीमित करना। दिग्व्रत का एक दिन या विशेष अवसर के लिए कठोर रूप।',
    dailyPracticeHindi:
      'पर्व के दिन या एकादशी पर घर से बाहर न जाने का नियम। पूजा-पाठ में सम्पूर्ण समय लगाना।',
    aticharas: [
      { hindi: 'आनयन — अनुचित लाना' },
      { hindi: 'प्रेषण — अनुचित भेजना' },
      { hindi: 'शब्दानुपात — इशारों से कार्य करवाना' },
      { hindi: 'रूपानुपात — संकेत से कार्य करवाना' },
      { hindi: 'पुद्गल-क्षेप — वस्तु फेंककर संपर्क' }
    ],
    karmaReduced: ['मोहनीय', 'अन्तराय'],
    gunasthanaRequired: 5
  },
  {
    id: 11,
    vowNumber: 11,
    categoryEn: 'Shikshavrata',
    categoryHindi: 'शिक्षाव्रत',
    vrataClass: 'Śikṣāvrata',
    nameHindi: 'पौषधोपवास',
    nameEn: 'Paushadhopavas',
    sanskritName: 'Pauṣadhopavāsa-Vrata',
    englishName: 'Ascetic Day Vow',
    description: 'Fasting and living as a monk for a 24-hour cycle twice a month.',
    descriptionHindi:
      'अष्टमी और चतुर्दशी (पक्ष में दो बार) पर मुनि-जीवन का अभ्यास। उपवास, सामायिक, स्वाध्याय और भूमि पर शयन।',
    dailyPracticeHindi:
      'महीने में कम से कम दो बार पौषध। सूर्योदय से अगले सूर्योदय तक भोजन का पूर्ण त्याग।',
    aticharas: [
      { hindi: 'शरीर-सत्कार — शरीर-श्रृंगार करना' },
      { hindi: 'अवलेखन — आयुधादि से सफाई' },
      { hindi: 'अन्योन्य-परिभोग — साझा उपभोग' },
      { hindi: 'स्पर्शन — स्नेह से स्पर्श' },
      { hindi: 'अनादर — पर्व की उपेक्षा' }
    ],
    karmaReduced: ['वेदनीय', 'मोहनीय', 'अन्तराय'],
    gunasthanaRequired: 5
  },
  {
    id: 12,
    vowNumber: 12,
    categoryEn: 'Shikshavrata',
    categoryHindi: 'शिक्षाव्रत',
    vrataClass: 'Śikṣāvrata',
    nameHindi: 'अतिथि-संविभाग',
    nameEn: 'Atithi-Sambhivibhaga',
    sanskritName: 'Atithi-Samvibhāga-Vrata',
    englishName: 'Hospitality Vow',
    description: 'Sharing food, medicine, shelter, and knowledge with worthy monks.',
    descriptionHindi:
      'मुनि, आर्यिका, श्रावक और श्राविका को यथायोग्य आहार-दान। इसी दान से पुण्य-बन्ध की श्रेष्ठ धारा बनती है।',
    dailyPracticeHindi:
      'यदि मुनि-दर्शन हो तो शुद्ध आहार-दान देना। अन्यथा ज्ञानी जनों को यथाशक्ति सेवा।',
    aticharas: [
      { hindi: 'सचित्त-निक्षेप — सजीव वस्तु देना' },
      { hindi: 'आच्छादन — वस्त्राच्छादित देना' },
      { hindi: 'परव्यपदेश — दूसरे के नाम पर' },
      { hindi: 'मत्सर — ईर्ष्या से देना' },
      { hindi: 'काल-अतिक्रमण — समय पर न देना' }
    ],
    karmaReduced: ['अन्तराय', 'मोहनीय', 'गोत्र'],
    gunasthanaRequired: 5
  }
];

export function getVratasByCategory(category: VrataCategory): Vrata[] {
  return VRATAS.filter(v => v.categoryEn === category);
}

export function getVrataById(id: number): Vrata | undefined {
  return VRATAS.find(v => v.id === id);
}
