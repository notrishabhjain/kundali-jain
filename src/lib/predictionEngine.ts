// Life-domain predictions (7 domains: Spiritual, Health, Wealth, Family, Career, Character,
// After-death trajectory).
//
// Sources (see references/sources.md):
//  - Domain decomposition: MP-§E2 + MP-§D5.
//  - "No false promises" voice — every domain frames outcomes as "creates conditions for"
//    rather than guaranteed: Codex constraint G2-C2.
//  - Pancham-Kāla honesty in After-death trajectory (no mokṣa; uttam dev-gati / manuṣya-gati
//    is the achievable goal): Codex constraint G2-C3 + MP-§C3.
//  - Karma-domain wiring (Mohaniya → Family/Character, Antaraya → Wealth/Career,
//    Vedaniya → Health, Gyānāvaraṇīya → Career/Spiritual, Gotra → Family): MP-§C1 + MP-§D4.
//  - Ratnatraya framing (Samyag Darshan → Samyag Gyan → Samyag Charitra): TLP-1 ch. 7 + MP-§B2.
//  - Vedaniya sub-types (Sata/Asata) + 6 bāhya tapasya: Shatkhandagama Book-1 + MP-§F3.
//  - Antaraya 5 sub-types (Labha, Dana, Bhoga, Upabhoga, Virya): TLP-1 ch. 3 + MP-§C1.
//  - Kashaya 4-fold intensity ladder (Anantanubandhi → Apratyakhyana → Pratyakhyana →
//    Sanjvalana): Tiloyapannatti + MP-§D4.
//  - Dev-gati tiers (Bhavanavasi → Jyotishi → Vyantar → Vaimanik): Trilokasara + MP-§C3.
//  - Compound ghātiyā warning: MP-§D5 (two or more ghātiyā karmas rising simultaneously).
//  - Voice rules — always 'आप', every karma statement carries daily-life manifestation,
//    every remedy has count + timing + karma-connection: MP-§G1 R1-R5.

import { UserProfile } from './analysisSynthesizer';
import { KARMA_SADHANA } from '../data/sadhana';

export interface LifeDomainPrediction {
  domain: string;
  hindiDomain: string;
  prediction: string;
  isFavorable: boolean;
}

// ─── Helper: Ghātiyā karma classifier ────────────────────────────────────────
// Source: TLP-1 ch. 3 — 4 ghātiyā (soul-obscuring) vs 4 aghātiyā karmas.
export function isGhatiya(karma: string): boolean {
  return ['Gyanavaraniya', 'Darshanavaraniya', 'Mohaniya', 'Antaraya'].includes(karma);
}

// ─── Helper: Count distinct active ghātiyā karmas ────────────────────────────
// Source: MP-§D5 — simultaneous rise of multiple ghātiyā creates compounded obstruction.
export function countActiveGhatiya(
  dominantKarma: string,
  dashaLord: string,
  antarLord: string
): number {
  const active = new Set<string>();
  if (isGhatiya(dominantKarma)) active.add(dominantKarma);
  if (isGhatiya(dashaLord))     active.add(dashaLord);
  if (antarLord && isGhatiya(antarLord)) active.add(antarLord);
  return active.size;
}

// ─── Helper: Dominant kashaya detection ──────────────────────────────────────
// Source: Tiloyapannatti + MP-§D4 — Mohaniya manifests as one of 4 kashayas;
// lower gunasthana = more severe / Anantanubandhi intensity.
export function getDominantKashaya(
  dominantKarma: string,
  dashaLord: string,
  gunasthana: number
): 'krodha' | 'mana' | 'maya' | 'lobha' | 'none' {
  const mohaActive = dominantKarma === 'Mohaniya' || dashaLord === 'Mohaniya';
  if (!mohaActive) return 'none';

  // At gunasthana 1 the most gross kashayas dominate; as it rises subtler ones persist.
  // Pattern inference from dasha lord when available.
  if (dashaLord === 'Mohaniya') {
    if (gunasthana <= 1) return 'krodha';   // most intense, blocks everything
    if (gunasthana === 2) return 'mana';    // pride holds one in wrong belief
    if (gunasthana === 3) return 'maya';    // deceit/mixed-right-view
    return 'lobha';                         // subtle greed persists even at 4+
  }
  // dominantKarma is Mohaniya but dasha lord differs — use gunasthana alone
  if (gunasthana <= 2) return 'krodha';
  if (gunasthana === 3) return 'mana';
  return 'lobha';
}

// ─── Main prediction generator ────────────────────────────────────────────────
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

  const activeGhatiya = countActiveGhatiya(dominantKarma, dashaLord, antarLord);
  const compoundWarning = activeGhatiya >= 2
    ? ' दो से अधिक घातिया कर्मों का एक साथ उदय — यह अत्यंत सावधानी का काल है।'
    : '';

  const kashaya = getDominantKashaya(dominantKarma, dashaLord, gunasthana);
  const kashayaMap: Record<string, string> = {
    krodha: 'क्रोध कषाय',
    mana:   'मान कषाय',
    maya:   'माया कषाय',
    lobha:  'लोभ कषाय',
  };
  const kashayaHi = kashaya !== 'none' ? kashayaMap[kashaya] : '';

  const predictions: LifeDomainPrediction[] = [];

  // ── 1. Spiritual — Ratnatraya framing ────────────────────────────────────────
  // Source: TLP-1 ch. 7 — right faith (samyag darshan) is the first jewel; without it
  // samyag charitra (12 vratas) cannot take root. Pancham Kaal: moksha not possible.
  // Source: MP-§B2 — Dharma Dhyana (9-tattva contemplation) vs Arta/Raudra Dhyana.
  const darshanaBlocked = dominantKarma === 'Darshanavaraniya' || dashaLord === 'Darshanavaraniya';
  const gyanBlocked     = dominantKarma === 'Gyanavaraniya'    || dashaLord === 'Gyanavaraniya';
  const mohaSpiritual   = dominantKarma === 'Mohaniya'         || dashaLord === 'Mohaniya';

  let spirPred: string;

  if (gunasthana >= 4) {
    // Ratnatraya frame: Samyag Darshan already present, push for Samyag Charitra
    spirPred = `${nakshatraHi} नक्षत्र और ${dasha_hi} दशा में आपको सम्यग्दर्शन की प्राप्ति का लाभ है। रत्नत्रय में आगे बढ़ने के लिए — सम्यग्दर्शन ✓, सम्यग्ज्ञान को शास्त्र-स्वाध्याय से दृढ़ करें, और सम्यग्चारित्र के लिए 12 व्रतों का संकल्प लें। ${antar_hi} अंतर्दशा में धर्म-ध्यान (नव-तत्त्व चिंतन) का अभ्यास करें — आर्त-ध्यान (शोक-चिंतन) और रौद्र-ध्यान (द्वेष-विचार) से बचें।`
      + (activeGhatiya >= 2 ? compoundWarning : '');
  } else if (darshanaBlocked) {
    // Darshanavaraniya veils the capacity for right faith (Darshan Mohaniya)
    // Source: Shatkhandagama Book-1 — darshan-mohaniya causes mithyatva
    spirPred = `${dominantHi} कर्म का उदय सम्यग्दर्शन के मार्ग में सीधा आवरण डालता है — यह कर्म आत्मा की सच्ची श्रद्धा को ढक देता है, जिससे जिन-वचन में रुचि और विश्वास कम अनुभव होता है। ${dasha_hi} दशा में लक्ष्य स्पष्ट है: चतुर्थ गुणस्थान (सम्यग्दर्शन) की प्राप्ति। सिद्ध-भक्ति और जिन-दर्शन प्रतिदिन करें; ${sadhana.primaryMantra.text} का ${sadhana.primaryMantra.count} बार जाप ${sadhana.primaryMantra.timing} करें।`
      + compoundWarning;
  } else if (gyanBlocked && gunasthana <= 3) {
    spirPred = `ज्ञानावरणीय कर्म के उदय में शास्त्र-वचन मन में नहीं टिकते — पुस्तक पढ़ने पर भी अर्थ स्पष्ट नहीं होता। ${dasha_hi} दशा में स्वाध्याय कठिन लग सकता है, किंतु यही साधना ज़रूरी है। उपाध्याय परमेष्ठी की भक्ति और प्रतिदिन 20 मिनट स्वाध्याय से ज्ञानावरणीय कर्म की परत पतली होती है। धर्म-ध्यान (9 तत्त्वों का चिंतन) को रौद्र-ध्यान से अलग रखें।`
      + compoundWarning;
  } else if (mohaSpiritual && gunasthana <= 3) {
    spirPred = `मोहनीय कर्म के उदय में सत्य दिखता है, किंतु उसमें स्थिर रहना कठिन है। ${dasha_hi} दशा में ${kashayaHi || 'कषाय'} की प्रबलता आत्म-दर्शन में बाधा डालती है। सम्यग्दर्शन (चतुर्थ गुणस्थान) का लक्ष्य रखें — क्षमापना नित्य करें, आर्त-ध्यान और रौद्र-ध्यान से बचें, और धर्म-ध्यान (नव-तत्त्व चिंतन) को अपना नित्य-कर्म बनाएं।`
      + compoundWarning;
  } else {
    spirPred = `${dasha_hi} दशा में आध्यात्मिक चेतना मिश्र स्थिति में है — ${nakshatraHi} नक्षत्र की ऊर्जा आपको साधना-मार्ग की ओर खींचती है। नियमित देव-दर्शन, स्वाध्याय और धर्म-ध्यान (जीव-अजीव-पाप-पुण्य आदि 9 तत्त्वों का चिंतन) से गुणस्थान में प्रगति संभव है।`;
  }

  predictions.push({
    domain: 'Spiritual',
    hindiDomain: 'आध्यात्मिक यात्रा',
    prediction: spirPred,
    isFavorable: gunasthana >= 3 && !darshanaBlocked && !gyanBlocked,
  });

  // ── 2. Health — Vedaniya sub-analysis + 6 bāhya tapasya ─────────────────────
  // Source: Shatkhandagama Book-1 — Sata Vedaniya = pleasant body experience;
  //         Asata Vedaniya = painful, illness-prone. Both are aghātiyā but body-governing.
  // Source: MP-§F3 — 6 bāhya tapasya: Anasan, Unodari, Vritti-sankshep, Rasa-tyag,
  //         Kaya-klesha, Vivikta-shayyasana. Primary Vedaniya reducer = Kaya-klesha.
  const vedaniyaDominant = dominantKarma === 'Vedaniya';
  const vedaniyaDasha    = dashaLord === 'Vedaniya';
  const vedaniyaAntar    = antarLord === 'Vedaniya';
  const naamActive       = dominantKarma === 'Naam' || dashaLord === 'Naam';
  const ayushyaDasha     = dashaLord === 'Ayushya';

  let healthPred: string;

  if (vedaniyaDominant) {
    // Most intense: Asata Vedaniya dominant
    healthPred = `असाता वेदनीय का तीव्र उदय — ${dasha_hi} दशा में यह कर्म शरीर में दर्द, रोग या असुविधा के रूप में प्रकट होता है; रात में नींद न आना, शरीर में जकड़न, या पुराना रोग उभरना इसके दैनिक लक्षण हैं। षट् बाह्य तपस्या में से काया-क्लेश (सहन-शीलता से कष्ट को स्वीकारना) इस कर्म का प्रमुख निर्जरक है। साथ में रस-त्याग (मिठाई/तेल छोड़ना) और उनोदरी (हल्का भोजन) का अभ्यास करें। ${sadhana.primaryMantra.text} का ${sadhana.primaryMantra.count} बार जाप ${sadhana.primaryMantra.timing} करें।`
      + compoundWarning;
  } else if (vedaniyaDasha || vedaniyaAntar) {
    healthPred = `${dasha_hi} दशा या ${antar_hi} अंतर्दशा में वेदनीय कर्म का उदय है। असाता वेदनीय = शरीर में कष्ट; साता वेदनीय = शारीरिक सुख। वर्तमान काल में शरीर संवेदनशील है — इसे कर्म-निर्जरा का अवसर जानें। काया-क्लेश तप (ठंड-गर्मी सहना, आसन-स्थिरता) और अनशन (एकाशन या उपवास) से वेदनीय का बंध रुकता है।`;
  } else if (naamActive) {
    healthPred = `अशुभ नाम कर्म के प्रभाव से शरीर की बाह्य स्थिति या सामाजिक छवि पर दबाव आ सकता है। ${dasha_hi} दशा में यह कर्म प्रकट होने पर इसे निर्जरा का अवसर जानें — वृत्ति-संक्षेप (जीवन-शैली सरल बनाना) और विविक्त-शय्यासन (एकांत विश्राम) से नाम कर्म मंद होता है।`;
  } else if (ayushyaDasha) {
    healthPred = `${dasha_hi} दशा में आयुष्य कर्म सक्रिय है — देह की शक्ति और आयु दोनों पर सीधा प्रभाव पड़ता है। ${nakshatraHi} नक्षत्र में नियमित दिनचर्या, अहिंसक आहार, और साता वेदनीय के बंध के लिए प्राणियों के प्रति करुणा-भाव रखें।`;
  } else {
    healthPred = `वर्तमान ${dasha_hi} दशा और ${nakshatraHi} नक्षत्र में साता वेदनीय का क्षयोपशम है — स्वास्थ्य अनुकूल रहेगा। इस शरीर को धर्म-साधना का यंत्र जानकर इसका सदुपयोग करें। रस-त्याग (मिठाई-नमक का संयम) से भविष्य के असाता वेदनीय बंध को रोकें।`;
  }

  predictions.push({
    domain: 'Health',
    hindiDomain: 'स्वास्थ्य एवं शरीर',
    prediction: healthPred,
    isFavorable: !vedaniyaDominant && !naamActive,
  });

  // ── 3. Wealth — Antaraya 5 sub-types ─────────────────────────────────────────
  // Source: TLP-1 ch. 3 — Antaraya karma has 5 sub-types:
  //   1. Labha-antaraya   = obstacle to receiving / gaining
  //   2. Dana-antaraya    = obstacle to giving / donation
  //   3. Bhoga-antaraya   = obstacle to single-use consumption (food/pleasures)
  //   4. Upabhoga-antaraya = obstacle to repeat-use items (clothing/home)
  //   5. Virya-antaraya   = obstacle to energy / effort manifestation
  // Primary remedy for Antaraya = Dana (charity), especially dana-antaraya.
  const antarayaDominant = dominantKarma === 'Antaraya';
  const antarayaDasha    = dashaLord === 'Antaraya';
  const antarayaAntar    = antarLord === 'Antaraya';
  const antarayaActive   = antarayaDominant || antarayaDasha || antarayaAntar;

  // Heuristic: dominant karma = likely Labha or Virya; dasha only = Bhoga/Upabhoga;
  // antar only = Dana-antaraya pattern (smaller, intermittent blocks).
  let antarayaSubType = '';
  if (antarayaDominant && antarayaDasha) {
    antarayaSubType = 'लाभ-अंतराय और वीर्य-अंतराय (प्राप्ति और पुरुषार्थ दोनों में बाधा)';
  } else if (antarayaDominant) {
    antarayaSubType = 'लाभ-अंतराय (प्राप्य धन या वस्तु मिलते-मिलते रुक जाती है)';
  } else if (antarayaDasha) {
    antarayaSubType = 'भोग-अंतराय (सुख-सामग्री होते हुए भी उपभोग में बाधा)';
  } else if (antarayaAntar) {
    antarayaSubType = 'दान-अंतराय (देने की इच्छा होने पर भी देने में कोई विघ्न)';
  }

  let wealthPred: string;

  if (antarayaDominant && antarayaDasha) {
    wealthPred = `अंतराय कर्म का दोहरा उदय — ${antarayaSubType}। प्रत्येक विघ्न को जिन-भक्ति की परीक्षा जानें। दान-अंतराय को तोड़ने का सर्वोत्तम उपाय है — यथाशक्ति दान (अन्न-दान, औषध-दान, ज्ञान-दान) प्रतिदिन करें; यह दान कर्म का बंध रोकता और अंतराय की निर्जरा करता है। ${sadhana.primaryMantra.text} का ${sadhana.primaryMantra.count} बार जाप ${sadhana.primaryMantra.timing} करें।`
      + compoundWarning;
  } else if (antarayaActive) {
    wealthPred = `${dasha_hi} दशा में ${antarayaSubType || 'अंतराय'} कर्म का उदय — प्रयासों का पूरा फल मिलने में देरी या रुकावट होगी। लाभ के बजाय कर्तव्य पर ध्यान दें। दान-क्रिया (विशेषतः ${antar_hi || 'इस'} अंतर्दशा में प्रतिदिन कुछ न कुछ दान) से अंतराय की परत कमज़ोर होती है।`;
  } else if (dominantKarma === 'Gotra' && gunasthana <= 2) {
    wealthPred = `अशुभ गोत्र कर्म के कारण समाज में प्रतिष्ठा पर दबाव रह सकता है, जो अप्रत्यक्ष रूप से आजीविका को प्रभावित करता है। ${nakshatraHi} नक्षत्र में जन्म के कारण परिश्रम से उचित मार्ग मिलेगा।`;
  } else {
    wealthPred = `${dasha_hi} दशा और ${nakshatraHi} नक्षत्र में अंतराय कर्म का क्षयोपशम है — परिश्रम का उचित फल मिलेगा। धन-लाभ होने पर दान का संकल्प अवश्य लें, ताकि भविष्य के लाभ-अंतराय और दान-अंतराय का बंध न हो।`;
  }

  predictions.push({
    domain: 'Wealth',
    hindiDomain: 'धन एवं आजीविका',
    prediction: wealthPred,
    isFavorable: !antarayaActive,
  });

  // ── 4. Family — specific kashaya from Mohaniya ───────────────────────────────
  // Source: Tiloyapannatti + MP-§D4 — Mohaniya's 4 kashayas manifest distinctly:
  //   Lobha  → money disputes, possessiveness in family
  //   Mana   → ego / status-comparison in relationships
  //   Krodha → reactive anger, communication breakdown
  //   Maya   → deceit, hidden agendas in relationships
  const mohaFamily  = dominantKarma === 'Mohaniya' || dashaLord === 'Mohaniya' || antarLord === 'Mohaniya';
  const gotraFamily = dominantKarma === 'Gotra'    || dashaLord === 'Gotra';

  let kashayaFamilyAdvice = '';
  if (mohaFamily) {
    if (kashaya === 'lobha') {
      kashayaFamilyAdvice = 'लोभ कषाय के उदय में परिवार में धन-संपत्ति या साधनों पर अधिकार-भावना से विवाद हो सकते हैं — संतोष धर्म और अपरिग्रह से इसे मंद करें।';
    } else if (kashaya === 'mana') {
      kashayaFamilyAdvice = 'मान कषाय के उदय में परिजनों के प्रति "मेरा कद उनसे बड़ा है" की भावना रिश्तों को दूर करती है — मार्दव धर्म (विनम्रता) और क्षमापना से इस कषाय को घटाएं।';
    } else if (kashaya === 'krodha') {
      kashayaFamilyAdvice = 'क्रोध कषाय के उदय में परिवार में छोटी-छोटी बात पर तीव्र प्रतिक्रिया होती है, जो दीर्घकालीन संबंधों को क्षतिग्रस्त करती है — क्षमा धर्म का नित्य अभ्यास अनिवार्य है।';
    } else if (kashaya === 'maya') {
      kashayaFamilyAdvice = 'माया कषाय के उदय में रिश्तों में छुपाव, अर्धसत्य या हेरफेर की प्रवृत्ति बन सकती है — आर्जव धर्म (सरलता) और सत्य-भाव से इसे क्षीण करें।';
    } else {
      kashayaFamilyAdvice = 'मोहनीय कर्म के उदय में राग-द्वेष पारिवारिक जीवन को प्रभावित करेगा — क्षमापना नित्य करें।';
    }
  }

  let familyPred: string;

  if (mohaFamily && dominantKarma === 'Mohaniya') {
    familyPred = `${dominantHi} कर्म और ${dasha_hi} दशा का संयोग पारिवारिक संबंधों में तीव्र कषाय उत्पन्न कर सकता है। ${kashayaFamilyAdvice} ${antar_hi} अंतर्दशा में विशेष सावधानी रखें — आवेश में लिया निर्णय दीर्घकाल तक कष्ट देगा।`
      + compoundWarning;
  } else if (mohaFamily) {
    familyPred = `${dasha_hi} दशा में मोहनीय का आंशिक उदय है। ${kashayaFamilyAdvice || 'पारिवारिक आसक्ति में संतुलन रखें।'} परिवार के प्रति उत्तरदायित्व निभाएं, किंतु वैराग्य-भाव बनाए रखें।`;
  } else if (gotraFamily) {
    familyPred = `गोत्र कर्म के उदय से परिवार में कुल-मान या सामाजिक प्रतिष्ठा से जुड़ी स्थितियां उत्पन्न हो सकती हैं। ${nakshatraHi} नक्षत्र में आत्म-विनय का अभ्यास और जाति-अभिमान छोड़ने से इस कर्म को मंद करें।`;
  } else {
    familyPred = `${nakshatraHi} नक्षत्र और ${dasha_hi} दशा में पारिवारिक जीवन में स्थिरता और सामंजस्य रहेगा। यह परिजनों के साथ मिलकर धर्म-मार्ग अपनाने का उत्तम काल है।`;
  }

  predictions.push({
    domain: 'Family',
    hindiDomain: 'परिवार एवं संबंध',
    prediction: familyPred,
    isFavorable: !mohaFamily && !gotraFamily,
  });

  // ── 5. Career — Virya Achar + Gyanchar ───────────────────────────────────────
  // Source: MP-§C1 — Virya-antaraya blocks energy/effort manifestation;
  //         remedy = Virya Achar (right conduct of effort — persistent, unhurried action).
  // Source: MP-§D4 — Gyanavaraniya blocks decision-making clarity;
  //         remedy = Gyanchar (right knowledge conduct — structured learning before acting).
  const careerAntaraya = dominantKarma === 'Antaraya' || dashaLord === 'Antaraya';
  const careerGyana    = dominantKarma === 'Gyanavaraniya' || dashaLord === 'Gyanavaraniya';
  const careerBlocked  = careerAntaraya || careerGyana;

  let careerPred: string;

  if (antarayaDominant && antarayaDasha) {
    careerPred = `कार्यक्षेत्र में अत्यंत संघर्षपूर्ण काल — वीर्य-अंतराय के उदय से पुरुषार्थ (वीर्य) प्रकट नहीं हो पाता; योजना और परिश्रम के बावजूद विघ्न बार-बार आते हैं। उपाय: वीर्याचार (Virya Achar) — निरंतर, सुस्थिर प्रयास बिना हड़बड़ाहट के। ${nakshatraHi} नक्षत्र की ऊर्जा का उपयोग पुराने कार्यों को पूरा करने में करें।`
      + compoundWarning;
  } else if (dominantKarma === 'Gyanavaraniya' && (dashaLord === 'Gyanavaraniya' || antarLord === 'Gyanavaraniya')) {
    careerPred = `ज्ञानावरणीय कर्म के उदय में बौद्धिक कार्य, जटिल निर्णय या अध्ययन में कठिनाई होती है — पुस्तक पढ़ने पर भी अर्थ नहीं ग्रहण होता, बैठकों में उचित बात मुँह से नहीं निकलती। ज्ञानाचार (Gyanchar) — कार्य से पूर्व व्यवस्थित अध्ययन और गुरु-परामर्श — इस कर्म का सीधा उपाय है। उपाध्याय परमेष्ठी की भक्ति से ज्ञानावरणीय की परत पतली होती है।`
      + compoundWarning;
  } else if (careerAntaraya) {
    careerPred = `${dasha_hi} दशा में वीर्य-अंतराय या लाभ-अंतराय का आंशिक उदय कार्यक्षेत्र में विलंब ला सकता है। वीर्याचार का अभ्यास करें — प्रत्येक कार्य को पूरी शक्ति से, बिना परिणाम की चिंता के करें। यह ही अंतराय का तोड़ है।`;
  } else if (careerGyana) {
    careerPred = `${dasha_hi} दशा में ज्ञानावरणीय का प्रभाव निर्णय-शक्ति पर आ सकता है। ज्ञानाचार को अपनाएं — नई परियोजना शुरू करने से पूर्व पूरी जानकारी जुटाएं, अनुमान पर न चलें।`;
  } else {
    careerPred = `${dasha_hi} दशा और ${nakshatraHi} नक्षत्र का संयोग कार्यक्षेत्र में प्रगति के अवसर बनाता है। आपकी बुद्धि और विवेक का सम्मान होगा। ${antar_hi} अंतर्दशा में नया उत्तरदायित्व मिल सकता है — वीर्याचार से पूरी शक्ति लगाएं।`;
  }

  predictions.push({
    domain: 'Career',
    hindiDomain: 'कार्यक्षेत्र एवं यश',
    prediction: careerPred,
    isFavorable: !careerBlocked,
  });

  // ── 6. Character — Kashaya suppression ladder ────────────────────────────────
  // Source: Tiloyapannatti + MP-§D4 — 4 intensity levels of kashaya:
  //   Anantanubandhi  (gunasthana 1)   = blocks Samyag Darshan; deepest; cannot take vows
  //   Apratyakhyana   (gunasthana 2-3) = blocks any vow-taking (shravakvrat)
  //   Pratyakhyana    (gunasthana 4-5) = allows partial vows but blocks complete vows
  //   Sanjvalana      (gunasthana 6-7) = subtle; manageable with consistent effort
  let kashayaIntensity = '';
  let kashayaPractice  = '';

  if (gunasthana <= 1) {
    kashayaIntensity = 'अनंतानुबंधी कषाय (सर्वाधिक तीव्र) — यह कषाय सम्यग्दर्शन को ही अवरुद्ध करती है। व्रत लेना संभव नहीं।';
    kashayaPractice  = 'एकमात्र उपाय: मिथ्यात्व को पहचानना और जिन-वचन में श्रद्धा जगाना — नमोकार मंत्र का प्रतिदिन 108 बार जाप और जिनालय में नित्य दर्शन।';
  } else if (gunasthana <= 3) {
    kashayaIntensity = 'अप्रत्याख्यान कषाय — यह कषाय श्रावक-व्रत ग्रहण को रोकती है; आप सच्चाई जानते हैं किंतु व्रत में टिकना कठिन लगता है।';
    kashayaPractice  = 'सामायिक (28 मिनट की ध्यान-साधना) प्रतिदिन करें — यह अप्रत्याख्यान से प्रत्याख्यान स्तर की ओर ले जाती है। क्षमापना रात्रि को नित्य करें।';
  } else if (gunasthana <= 5) {
    kashayaIntensity = 'प्रत्याख्यान कषाय — आप अणुव्रत ले सकते हैं, किंतु महाव्रत अभी संभव नहीं। इस कषाय में व्रत-पालन कभी-कभी टूटता है।';
    kashayaPractice  = '12 व्रतों में से प्राथमिक 5 अणुव्रत (अहिंसा, सत्य, अस्तेय, ब्रह्मचर्य, अपरिग्रह) का संकल्प लें। नित्य प्रतिक्रमण से टूटे व्रत की शुद्धि करें।';
  } else {
    kashayaIntensity = 'संज्वलन कषाय (सूक्ष्मतम) — यह कषाय श्रावक के लिए साध्य है; सतत प्रयास से इसे दबाया जा सकता है।';
    kashayaPractice  = 'आत्म-चिंतन (20 मिनट प्रतिदिन), प्रतिक्रमण और शास्त्र-स्वाध्याय से संज्वलन कषाय को प्रतिदिन घटाएं।';
  }

  const charBlocked = dominantKarma === 'Mohaniya' || dashaLord === 'Mohaniya';
  let charPred: string;

  if (dominantKarma === 'Mohaniya' && dashaLord === 'Mohaniya') {
    charPred = `मोहनीय कर्म का सर्वाधिक तीव्र काल। ${kashayaIntensity} ${kashayaPractice} प्रतिदिन ${sadhana.primaryMantra.count} बार ${sadhana.primaryMantra.text} का जाप ${sadhana.primaryMantra.timing} करें।`
      + compoundWarning;
  } else if (charBlocked) {
    charPred = `${dominantHi} कर्म के उदय से ${dasha_hi} दशा में कषाय हावी हो सकती हैं। ${kashayaIntensity} ${kashayaPractice}`
      + compoundWarning;
  } else {
    charPred = `${dasha_hi} दशा और ${nakshatraHi} नक्षत्र में कषायों की मंदता है — आपका आचरण धर्म-अनुकूल और प्रेरणादायक रहेगा। वर्तमान काल में ${kashayaIntensity.split('—')[0].trim()} की स्थिति है। ${kashayaPractice}`;
  }

  predictions.push({
    domain: 'Character',
    hindiDomain: 'चरित्र एवं आचरण',
    prediction: charPred,
    isFavorable: !charBlocked,
  });

  // ── 7. After-death trajectory — specific dev-gati tiers ─────────────────────
  // Source: Trilokasara + MP-§C3 — Dev-gati has 4 tiers:
  //   Bhavanavasi  = lowest; achieved by punya without samyag darshan
  //   Jyotishi dev = middle; achievable by punya-heavy lay person without samyag darshan
  //   Vyantar      = intermediate; mixed punya
  //   Vaimanik     = highest; Saudharma-Ishan kalpas achievable for Pancham Kaal layperson
  //                  WITH samyag darshan + vratas
  // IMPORTANT: Pancham Kaal — no moksha possible (no kevala-gyana, no siddha-gati).
  //            Best = Vaimanik dev-gati → future better manusha birth → eventual moksha in
  //            next time cycle. Source: Codex constraint G2-C3.
  const tiryanchRisk = (dominantKarma === 'Mohaniya' || dashaLord === 'Mohaniya') && gunasthana <= 1;
  const vaimanikPossible = gunasthana >= 4;
  const jyotishiPossible = gunasthana >= 2 && !tiryanchRisk;
  const ayushyaEffect   = dominantKarma === 'Ayushya'
    ? 'आपके प्रबल आयुष्य कर्म के आधार पर'
    : `${dasha_hi} दशा और ${nakshatraHi} नक्षत्र के संयोग से`;

  let afterPred: string;

  if (tiryanchRisk) {
    afterPred = `${dominantHi} कर्म और ${dasha_hi} दशा के संयोग में — गुणस्थान 1 में कषाय और भोग की ओर झुकाव तिर्यंच-गति का बंध बना सकता है। यह पंचम काल की कठोर वास्तविकता है। नित्य संथारा-भावना और नमोकार मंत्र का 108 बार जाप अनिवार्य है। मोक्ष इस काल में संभव नहीं, किंतु तिर्यंच-गति से रक्षा के लिए शुभ-भाव और जिन-भक्ति ही एकमात्र मार्ग है।`
      + compoundWarning;
  } else if (vaimanikPossible) {
    afterPred = `${ayushyaEffect} आप वैमानिक देव-गति (सौधर्म-ईशान कल्पों तक) के आयुष्य-बंध के योग्य परिस्थितियां बना रहे हैं — यह पंचम काल के श्रावक के लिए सर्वोत्तम उपलब्धि है। सम्यग्दर्शन की दृढ़ता और 12 व्रत-पालन से यह बंध और शुभ होगा। स्मरण रहे: मोक्ष इस पंचम काल में संभव नहीं — किंतु वैमानिक-गति से अगले जन्म में मोक्ष-मार्ग के समीप जन्म मिलेगा।`;
  } else if (jyotishiPossible) {
    afterPred = `${ayushyaEffect} ज्योतिषी देव-गति का बंध इस काल में संभव है — यह सम्यग्दर्शन के बिना भी पुण्य-बहुल जीवन से प्राप्त होती है। यदि आप सम्यग्दर्शन (चतुर्थ गुणस्थान) प्राप्त कर लें, तो वैमानिक-गति का बंध संभव होगा। पुण्य के साथ-साथ शुभ-परिणामों का संकल्प करें। पंचम काल में मोक्ष नहीं, किंतु उत्तम देव-गति से अगले काल में मुक्ति का मार्ग खुलता है।`;
  } else if (dominantKarma === 'Ayushya') {
    afterPred = `आयुष्य कर्म की प्रबलता के कारण जीवन की गति और परिस्थितियां तेज़ी से बदल सकती हैं। ${dasha_hi} दशा में शुभ भावों का संकल्प अत्यंत महत्वपूर्ण है — वे ही अगले जन्म का बंध करते हैं। भवनवासी देव-गति से ऊपर उठने के लिए जिन-भक्ति और अहिंसा व्रत को दृढ़ करें।`;
  } else {
    afterPred = `${ayushyaEffect} परलोक की स्थिति वर्तमान भावों पर निर्भर है। ${nakshatraHi} नक्षत्र में धर्म-साधना से मनुष्य-गति या ज्योतिषी देव-गति का बंध होगा। ${sadhana.samanyaUpaya} को नित्य-नियम बनाएं। पंचम काल की सीमा याद रखें — मोक्ष इस काल में नहीं; किंतु शुभ गति से अगले जन्म में मोक्ष-पथ के समीप होंगे।`;
  }

  predictions.push({
    domain: 'After-death Trajectory',
    hindiDomain: 'आगामी गति (परलोक)',
    prediction: afterPred,
    isFavorable: !tiryanchRisk && gunasthana >= 2,
  });

  return predictions;
}
