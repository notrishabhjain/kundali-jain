import { UserProfile } from './analysisSynthesizer';
import { KARMA_SADHANA } from '../data/sadhana';

export interface LifeDomainPrediction {
  domain: string;
  hindiDomain: string;
  prediction: string;
  isFavorable: boolean;
}

// Build a detailed, multi-factor prediction per domain.
// Uses nakshatra, dominant karma, current dasha lord, antardasha, and gunasthana
// so that every combination of inputs yields a distinct, specific result.
export function generatePredictions(profile: UserProfile): LifeDomainPrediction[] {
  const dashaLord     = profile.currentDasha.lord;
  const antarLord     = profile.currentDasha.antardashaInfo?.lord || '';
  const dominantKarma = profile.dominantKarmaEn;
  const gunasthana    = profile.gunasthana || 1;
  const nakshatraHi   = profile.birthNakshatraHindi || profile.birthNakshatra;
  const dasha_hi      = profile.currentDasha.lord_hindi;
  const antar_hi      = profile.currentDasha.antardashaInfo?.lord_hindi || '';
  const dominantHi    = profile.dominantKarma;
  const sadhana       = KARMA_SADHANA[dominantKarma] || KARMA_SADHANA['Mohaniya'];

  const predictions: LifeDomainPrediction[] = [];

  // ── 1. Spiritual ─────────────────────────────────────────────────────────────
  const spiritualBlocked = dominantKarma === 'Darshanavaraniya' || dominantKarma === 'Gyanavaraniya';
  const spiritualMoha    = dominantKarma === 'Mohaniya';
  const dashaHelps       = dashaLord === 'Gyanavaraniya' || dashaLord === 'Darshanavaraniya' ? false
                         : dashaLord === 'Ayushya' || dashaLord === 'Naam' ? true : true;

  let spirPred: string;
  if (spiritualBlocked && gunasthana <= 2) {
    spirPred = `${nakshatraHi} नक्षत्र में ${dominantHi} कर्म का बोझ है। ${dasha_hi} दशा और ${antar_hi} अंतर्दशा में यह अवरोध और प्रबल हो रहा है — शास्त्र-ज्ञान और तीर्थ-दर्शन में बाधा अनुभव होगी। ${sadhana.primaryMantra.text} का नित्य ${sadhana.primaryMantra.count} बार जाप करें।`;
  } else if (spiritualMoha && gunasthana <= 3) {
    spirPred = `${dominantHi} कर्म के उदय में सत्य की पहचान होते हुए भी आचरण में उतारना कठिन रहेगा। ${dasha_hi} दशा इस द्वंद्व को और तीव्र करती है। क्षमापना और मार्दव धर्म से कषाय को मंद करें।`;
  } else if (gunasthana >= 4 && dashaHelps) {
    spirPred = `${nakshatraHi} नक्षत्र की आध्यात्मिक प्रकृति और ${dasha_hi} दशा का संयोग आपकी साधना के लिए श्रेष्ठ काल है। ${antar_hi} अंतर्दशा में विशेष पूजन और स्वाध्याय से गुणस्थान में प्रगति संभव है।`;
  } else {
    spirPred = `${dasha_hi} दशा में आध्यात्मिक चेतना मिश्र स्थिति में है। ${dominantHi} कर्म की कुछ मात्रा है किंतु ${nakshatraHi} नक्षत्र की ऊर्जा आपको साधना-मार्ग की ओर खींचती है। नियमित देव-दर्शन से लाभ होगा।`;
  }
  predictions.push({ domain: 'Spiritual', hindiDomain: 'आध्यात्मिक यात्रा', prediction: spirPred, isFavorable: gunasthana >= 3 && !spiritualBlocked });

  // ── 2. Health ─────────────────────────────────────────────────────────────────
  const vedaniyaActive = dominantKarma === 'Vedaniya' || dashaLord === 'Vedaniya' || antarLord === 'Vedaniya';
  const naamActive     = dominantKarma === 'Naam' || dashaLord === 'Naam';
  let healthPred: string;
  if (vedaniyaActive && dominantKarma === 'Vedaniya') {
    healthPred = `असाता वेदनीय का तीव्र उदय — ${dasha_hi} दशा और ${antar_hi} अंतर्दशा का संयोग शरीर में कष्ट या रोग प्रवण स्थिति बना सकता है। दवाओं के साथ-साथ ${sadhana.samanyaUpaya} को नित्य-नियम बनाएं।`;
  } else if (naamActive) {
    healthPred = `अशुभ नाम कर्म के प्रभाव से शरीर की बाहरी सुंदरता या सामाजिक छवि पर दबाव आ सकता है। ${dasha_hi} दशा में यह कर्म प्रकट होने पर इसे कर्म-निर्जरा का अवसर जानें।`;
  } else if (dashaLord === 'Ayushya') {
    healthPred = `आयुष्य दशा में स्वास्थ्य के प्रति विशेष सचेत रहना आवश्यक है। ${nakshatraHi} नक्षत्र में आयुष्य कर्म का प्रभाव देह-शक्ति पर सीधा पड़ता है। नियमित दिनचर्या और अहिंसक आहार से रक्षण करें।`;
  } else {
    healthPred = `वर्तमान ${dasha_hi} दशा और ${nakshatraHi} नक्षत्र में साता वेदनीय का क्षयोपशम है — स्वास्थ्य अनुकूल रहेगा। इस शरीर को धर्म-साधना का यंत्र जानकर इसका सदुपयोग करें।`;
  }
  predictions.push({ domain: 'Health', hindiDomain: 'स्वास्थ्य एवं शरीर', prediction: healthPred, isFavorable: !vedaniyaActive && !naamActive });

  // ── 3. Wealth ─────────────────────────────────────────────────────────────────
  const antarayaActive = dominantKarma === 'Antaraya' || dashaLord === 'Antaraya' || antarLord === 'Antaraya';
  let wealthPred: string;
  if (dominantKarma === 'Antaraya' && dashaLord === 'Antaraya') {
    wealthPred = `अंतराय कर्म का दोहरा उदय — महादशा और प्रबल कर्म दोनों में अंतराय है। धन-लाभ और उद्यम में बाधाएं बार-बार आएंगी। प्रत्येक विघ्न को जिन-भक्ति की परीक्षा मानकर सहें और ${sadhana.primaryMantra.text} का जाप करें।`;
  } else if (antarayaActive) {
    wealthPred = `${dasha_hi} दशा या ${antar_hi} अंतर्दशा में अंतराय कर्म का उदय है — प्रयासों का पूरा फल मिलने में देरी या रुकावट संभव है। लाभ के बजाय कर्तव्य पर ध्यान दें।`;
  } else if (dominantKarma === 'Gotra' && gunasthana <= 2) {
    wealthPred = `अशुभ गोत्र कर्म के कारण समाज में प्रतिष्ठा पर दबाव रह सकता है, जो अप्रत्यक्ष रूप से आजीविका को प्रभावित करता है। ${nakshatraHi} नक्षत्र में जन्म के कारण परिश्रम से उचित मार्ग मिलेगा।`;
  } else {
    wealthPred = `${dasha_hi} दशा और ${nakshatraHi} नक्षत्र में अंतराय कर्म का क्षयोपशम है — परिश्रम का उचित फल मिलेगा। धन-लाभ होने पर दान का संकल्प अवश्य लें, ताकि भविष्य के अंतराय का बंध न हो।`;
  }
  predictions.push({ domain: 'Wealth', hindiDomain: 'धन एवं आजीविका', prediction: wealthPred, isFavorable: !antarayaActive });

  // ── 4. Family ─────────────────────────────────────────────────────────────────
  const mohaActive  = dominantKarma === 'Mohaniya' || dashaLord === 'Mohaniya' || antarLord === 'Mohaniya';
  const gotraActive = dominantKarma === 'Gotra' || dashaLord === 'Gotra';
  let familyPred: string;
  if (mohaActive && dominantKarma === 'Mohaniya') {
    familyPred = `${dominantHi} कर्म और ${dasha_hi} दशा का संयोग पारिवारिक संबंधों में तीव्र राग-द्वेष उत्पन्न कर सकता है। ${antar_hi} अंतर्दशा में विशेष सावधानी रखें — आवेश में लिया निर्णय कष्टदायक होगा। क्षमापना नित्य करें।`;
  } else if (gotraActive) {
    familyPred = `गोत्र कर्म के उदय से परिवार में कुल-मान या सामाजिक प्रतिष्ठा से जुड़ी स्थितियां उत्पन्न हो सकती हैं। ${nakshatraHi} नक्षत्र में आत्म-विनय का अभ्यास इस कर्म को मंद करेगा।`;
  } else if (mohaActive) {
    familyPred = `${dasha_hi} दशा में मोहनीय का आंशिक उदय पारिवारिक आसक्ति को बढ़ा सकता है। यह आध्यात्मिक प्रगति में अवरोध बन सकता है। परिवार के प्रति उत्तरदायित्व निभाएं, किंतु वैराग्य भाव बनाए रखें।`;
  } else {
    familyPred = `${nakshatraHi} नक्षत्र और ${dasha_hi} दशा में पारिवारिक जीवन में स्थिरता और सामंजस्य रहेगा। यह परिजनों के साथ मिलकर धर्म-मार्ग अपनाने का उत्तम काल है।`;
  }
  predictions.push({ domain: 'Family', hindiDomain: 'परिवार एवं संबंध', prediction: familyPred, isFavorable: !mohaActive && !gotraActive });

  // ── 5. Career ─────────────────────────────────────────────────────────────────
  const careerBlocked = dominantKarma === 'Antaraya' || dashaLord === 'Antaraya'
                     || dominantKarma === 'Gyanavaraniya' || dashaLord === 'Gyanavaraniya';
  let careerPred: string;
  if (dominantKarma === 'Antaraya' && dashaLord === 'Antaraya') {
    careerPred = `कार्यक्षेत्र में अत्यंत संघर्षपूर्ण काल। प्रयास, योजना और परिश्रम के बावजूद विघ्न बार-बार सामने आएंगे। ${nakshatraHi} नक्षत्र की ऊर्जा का उपयोग पुराने कार्यों को पूरा करने में करें, नए उद्यम बाद में शुरू करें।`;
  } else if (dominantKarma === 'Gyanavaraniya' && (dashaLord === 'Gyanavaraniya' || antarLord === 'Gyanavaraniya')) {
    careerPred = `ज्ञानावरणीय कर्म के उदय में बौद्धिक कार्यों, अध्ययन या निर्णय-लेने में कठिनाई आ सकती है। ${dasha_hi} दशा इसे और जटिल बनाती है। स्वाध्याय और उपाध्याय परमेष्ठी की भक्ति से इस दशा को पार करें।`;
  } else if (careerBlocked) {
    careerPred = `${dasha_hi} दशा कार्यक्षेत्र में कुछ बाधाएं ला रही है — धैर्य रखें। ${nakshatraHi} नक्षत्र की प्रकृति आपको अंतःशक्ति देती है। परिणाम पर नहीं, प्रक्रिया पर ध्यान दें।`;
  } else {
    careerPred = `${dasha_hi} दशा और ${nakshatraHi} नक्षत्र का संयोग कार्यक्षेत्र में प्रगति का सूचक है। आपकी बुद्धि और विवेक का सम्मान होगा। ${antar_hi} अंतर्दशा में नया उत्तरदायित्व मिल सकता है।`;
  }
  predictions.push({ domain: 'Career', hindiDomain: 'कार्यक्षेत्र एवं यश', prediction: careerPred, isFavorable: !careerBlocked });

  // ── 6. Character ─────────────────────────────────────────────────────────────
  const charBlocked = dominantKarma === 'Mohaniya' || dominantKarma === 'Charitra Mohaniya'
                   || dashaLord === 'Mohaniya';
  let charPred: string;
  if (dominantKarma === 'Mohaniya' && dashaLord === 'Mohaniya') {
    charPred = `मोहनीय कर्म का सर्वाधिक तीव्र काल। चारों कषायें — क्रोध, मान, माया, लोभ — इस दोहरे उदय में प्रबल रहेंगी। ${nakshatraHi} नक्षत्र की आध्यात्मिक ऊर्जा ही एकमात्र रक्षा है। प्रतिदिन ${sadhana.primaryMantra.count} बार ${sadhana.primaryMantra.text} का जाप करें।`;
  } else if (charBlocked) {
    charPred = `${dominantHi} कर्म के उदय से ${dasha_hi} दशा में कषाय हावी हो सकती हैं। ${antar_hi} अंतर्दशा में विशेष सावधानी रखें। क्षमा, मार्दव, आर्जव और संतोष धर्म का अभ्यास करें।`;
  } else {
    charPred = `${dasha_hi} दशा और ${nakshatraHi} नक्षत्र में कषायों की मंदता है — आपका आचरण धर्म-अनुकूल और प्रेरणादायक रहेगा। ${antar_hi} अंतर्दशा में यह विशेषता और प्रकट होगी।`;
  }
  predictions.push({ domain: 'Character', hindiDomain: 'चरित्र एवं आचरण', prediction: charPred, isFavorable: !charBlocked });

  // ── 7. After-death trajectory ─────────────────────────────────────────────────
  const ayushyaEffect = dominantKarma === 'Ayushya' ? `आपके प्रबल आयुष्य कर्म के आधार पर` : `${dasha_hi} दशा और ${nakshatraHi} नक्षत्र के संयोग से`;
  let afterPred: string;
  if (gunasthana >= 4 && !mohaActive) {
    afterPred = `${ayushyaEffect} आप शुभ देव-गति या उत्तम मनुष्य-गति के आयुष्य का बंध कर रहे हैं। सम्यग्दर्शन की दृढ़ता और व्रत-पालन से यह बंध और शुभ होगा।`;
  } else if (dominantKarma === 'Ayushya') {
    afterPred = `आयुष्य कर्म की प्रबलता के कारण जीवन की गति और परिस्थितियां तेज़ी से बदल सकती हैं। ${dasha_hi} दशा में शुभ भावों का संकल्प अत्यंत महत्वपूर्ण है — वे ही अगले जन्म का बंध करते हैं।`;
  } else if (mohaActive && gunasthana <= 2) {
    afterPred = `${dominantHi} कर्म और ${dasha_hi} दशा के संयोग में कषाय और भोग की ओर झुकाव हो सकता है। यदि भाव शुद्ध न रहे, तो तिर्यंच-गति का बंध संभव है। नित्य संथारा-भावना और नमोकार जाप अनिवार्य है।`;
  } else {
    afterPred = `${ayushyaEffect} परलोक की स्थिति वर्तमान भावों पर निर्भर है। ${nakshatraHi} नक्षत्र में धर्म-साधना से मनुष्य-गति या देव-गति का बंध होगा। ${sadhana.samanyaUpaya} को नित्य-नियम बनाएं।`;
  }
  predictions.push({ domain: 'After-death Trajectory', hindiDomain: 'आगामी गति (परलोक)', prediction: afterPred, isFavorable: gunasthana >= 3 && !mohaActive });

  return predictions;
}
