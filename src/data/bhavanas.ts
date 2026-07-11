// Source: PARITY-REPORT-2026 §"12 Bhavanas (Anuprekshas)"
// 12 Bhāvanās (Anuprekshas) — contemplations that purify the soul's disposition
// and weaken kashāyas. Doctrine: Tattvartha Sutra 9.7; Samayasara §248-259.

export interface Bhavana {
  id: number;
  nameHindi: string;
  nameEn: string;
  contemplationHindi: string;  // core insight to contemplate
  karmaEffect: string;         // which karma/kashaya it weakens (Hindi)
  practiceHindi: string;       // how to practice this bhavana
}

export const BHAVANAS: Bhavana[] = [
  {
    id: 1,
    nameHindi: 'अनित्य भावना',
    nameEn: 'Anitya Bhavana',
    contemplationHindi: 'संसार की समस्त वस्तुएँ — शरीर, संपत्ति, सम्बन्ध — क्षणभंगुर हैं। इनमें स्थायित्व की भावना मिथ्यात्व है।',
    karmaEffect: 'मोहनीय कर्म (विशेषतः माया और लोभ) का शमन',
    practiceHindi: 'प्रतिदिन सूर्यास्त के समय पाँच मिनट विचार करें — आज मुझे जो कुछ भी प्रिय लगा, वह कल नहीं रहेगा।'
  },
  {
    id: 2,
    nameHindi: 'अशरण भावना',
    nameEn: 'Asharana Bhavana',
    contemplationHindi: 'जन्म, जरा, मृत्यु और कर्म-फल में कोई भी बाहरी सत्ता शरण नहीं दे सकती। एकमात्र सम्यक्-ज्ञान और धर्म ही शरण है।',
    karmaEffect: 'दर्शनावरणीय और मोहनीय कर्म का शमन',
    practiceHindi: 'बीमारी, कठिनाई या भय के समय स्मरण करें — केवल आत्मा का शुद्ध स्वभाव ही स्थायी आश्रय है।'
  },
  {
    id: 3,
    nameHindi: 'संसार भावना',
    nameEn: 'Samsara Bhavana',
    contemplationHindi: 'आत्मा अनादि काल से चार गतियों में भटक रही है। इस परिभ्रमण का कारण कर्म-बन्धन है। संसार से विरक्ति ही मुक्ति का द्वार है।',
    karmaEffect: 'आयुष्य और नाम कर्म की आसक्ति का शमन',
    practiceHindi: 'प्रतिदिन यह चिंतन करें — मैं कितने जन्म ले चुका हूँ, और अभी तक आत्मा का शोधन नहीं हुआ।'
  },
  {
    id: 4,
    nameHindi: 'एकत्व भावना',
    nameEn: 'Ekatva Bhavana',
    contemplationHindi: 'प्रत्येक आत्मा अकेले ही जन्मती है, अकेले ही कर्म भोगती है, और अकेले ही मरती है। कोई भी सुख-दुःख में साथी नहीं।',
    karmaEffect: 'मोहनीय कर्म (परिग्रह-आसक्ति) का शमन',
    practiceHindi: 'संबंधों में आसक्ति के क्षण में स्मरण करें — कर्म-फल भोगते समय मैं सर्वथा एकाकी हूँ।'
  },
  {
    id: 5,
    nameHindi: 'अन्यत्व भावना',
    nameEn: 'Anyatva Bhavana',
    contemplationHindi: 'शरीर, परिवार, संपत्ति — ये सब मैं नहीं हूँ। मेरा स्वरूप शुद्ध, ज्ञानमय, अमूर्त आत्मा है।',
    karmaEffect: 'ज्ञानावरणीय और दर्शनावरणीय कर्म का शमन',
    practiceHindi: 'दर्पण में देखते समय विचार करें — यह देह अन्य है; मैं इसका ज्ञाता-द्रष्टा मात्र हूँ।'
  },
  {
    id: 6,
    nameHindi: 'अशुचि भावना',
    nameEn: 'Asuci Bhavana',
    contemplationHindi: 'यह शरीर अपवित्र पदार्थों से बना है। इसमें सौंदर्य की भ्रांति मोह का कारण है। वास्तव में यह केवल कर्म-फल भोगने का साधन है।',
    karmaEffect: 'मोहनीय कर्म (स्त्री/पुरुष वेद) का शमन',
    practiceHindi: 'शरीर-सौंदर्य में आसक्ति हो तो विचार करें — इसके भीतर क्या है और यह अंततः किसमें परिवर्तित होगा।'
  },
  {
    id: 7,
    nameHindi: 'आस्रव भावना',
    nameEn: 'Asrava Bhavana',
    contemplationHindi: 'मन, वचन और काय की प्रत्येक क्रिया जिसमें कषाय है, वह नए कर्मों का आस्रव (प्रवाह) है। यह जानकर प्रमाद छोड़ना चाहिए।',
    karmaEffect: 'अन्तराय और मोहनीय कर्म के नए बन्ध का शमन',
    practiceHindi: 'हर कार्य से पहले एक क्षण रुककर विचार करें — क्या इस क्रिया में कषाय है? यदि हाँ, तो इसे सावधानी से करें।'
  },
  {
    id: 8,
    nameHindi: 'संवर भावना',
    nameEn: 'Samvara Bhavana',
    contemplationHindi: 'जिन साधनों से आस्रव रुकता है — समिति, गुप्ति, धर्म, अनुप्रेक्षा, परिषह-जय, चारित्र — वे सब संवर हैं। इनका अभ्यास मोक्ष का मार्ग है।',
    karmaEffect: 'नए कर्म-बन्ध को रोकता है; समस्त कर्मों का परोक्ष शमन',
    practiceHindi: 'प्रतिदिन समिति (सावधान गतिविधि) का एक नियम लें — जैसे वाणी पर नियंत्रण या अहिंसक आहार।'
  },
  {
    id: 9,
    nameHindi: 'निर्जरा भावना',
    nameEn: 'Nirjara Bhavana',
    contemplationHindi: 'तप, साधना और समभाव से पुराने कर्म झड़ते हैं। यह निर्जरा ही आत्मा को हल्का करती है और मोक्ष के निकट ले जाती है।',
    karmaEffect: 'संचित घातिया कर्मों का क्षय',
    practiceHindi: 'कठिनाइयों और दुःख को समभाव से स्वीकार करते समय जानें — यह कर्म-निर्जरा है, शिकायत का अवसर नहीं।'
  },
  {
    id: 10,
    nameHindi: 'लोक भावना',
    nameEn: 'Loka Bhavana',
    contemplationHindi: 'जैन ब्रह्माण्ड — अधोलोक, मध्यलोक, ऊर्ध्वलोक — की विशालता का चिंतन। इस असीम लोक में मनुष्य-भव अत्यंत दुर्लभ है।',
    karmaEffect: 'अहंकार और नाम-कर्म का शमन',
    practiceHindi: 'रात्रि में आकाश देखकर विचार करें — यह ब्रह्माण्ड कितना विशाल है; उसमें मेरी स्थिति कितनी क्षणिक है।'
  },
  {
    id: 11,
    nameHindi: 'बोधिदुर्लभ भावना',
    nameEn: 'Bodhidurlabha Bhavana',
    contemplationHindi: 'सम्यक्-ज्ञान, सम्यक्-दर्शन और सम्यक्-चारित्र (रत्नत्रय) की प्राप्ति अत्यंत दुर्लभ है। यह मानव-जन्म इसीलिए सर्वाधिक मूल्यवान है।',
    karmaEffect: 'दर्शनावरणीय कर्म और मिथ्यात्व-मोहनीय का शमन',
    practiceHindi: 'प्रतिदिन कम से कम एक जैन सिद्धांत का अध्ययन करें और उसे जीवन में उतारने का प्रयास करें।'
  },
  {
    id: 12,
    nameHindi: 'धर्म भावना',
    nameEn: 'Dharma Bhavana',
    contemplationHindi: 'दश-धर्म (क्षमा, मार्दव, आर्जव, शौच, सत्य, संयम, तप, त्याग, आकिंचन्य, ब्रह्मचर्य) ही परम रक्षक हैं। इनका आचरण ही सच्चा धर्म है।',
    karmaEffect: 'समस्त कर्मों का सामान्य शमन; पुण्य-बन्ध की वृद्धि',
    practiceHindi: 'अपने दिन के किसी एक कार्य में दश-धर्म में से किसी एक गुण को जानबूझकर प्रयोग करें।'
  }
];

export function getBhavanaById(id: number): Bhavana | undefined {
  return BHAVANAS.find(b => b.id === id);
}
