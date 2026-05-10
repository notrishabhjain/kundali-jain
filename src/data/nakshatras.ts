export type NakshatraNature = 'param_shubha' | 'shubha' | 'mishra' | 'ashubha';
export type KarmaType = 'Gyanavaraniya' | 'Darshanavaraniya' | 'Vedaniya' | 'Mohaniya' | 'Ayushya' | 'Naam' | 'Gotra' | 'Antaraya' | 'Charitra Mohaniya' | 'Sarva karma kshay';

export interface Nakshatra {
  index: number;            // 0-based (0 = Ashvini)
  name: string;             // English transliteration
  hindi_name: string;       // Devanagari
  start_deg: number;        // Sidereal start degree (0 = Ashvini = 0°)
  end_deg: number;
  nature: NakshatraNature;
  karma_type: KarmaType;
  tirthankaras_born: string[];  // e.g. ["Kunthunatha (17)", "Naminatha (21)"]
  ruling_jyotishi_dev: string;  // Jain ruling deity (not Vedic)
  spiritual_traits: string;     // used in narrative generation
  karma_manifestation: string;  // how the karma type manifests in daily life
  sadhana: string;              // remedy with count + timing
  deity_note: string;           // shown in UI to clarify Jain vs Vedic
}

// Each nakshatra = 13°20' = 13.333...°
// 27 nakshatras cover 360°; Abhijit is a secondary star at 276°40' – 280°53'20"
export const NAKSHATRAS: Nakshatra[] = [
  {
    index: 0, name: "Ashvini", hindi_name: "अश्विनी",
    start_deg: 0, end_deg: 13.333,
    nature: "shubha", karma_type: "Gyanavaraniya",
    tirthankaras_born: ["कुन्थुनाथ (17)", "नमिनाथ (21)"],
    ruling_jyotishi_dev: "अश्विनी ज्योतिषी देव",
    spiritual_traits: "गति, आरोग्य, नई शुरुआत, चिकित्सा ज्ञान",
    karma_manifestation: "ज्ञानावरणीय कर्म: नई बातें सीखने में बाधा, उचित निर्णय लेने में विलंब",
    sadhana: "प्रतिदिन प्रातः 108 बार णमोकार मंत्र + स्वाध्याय 20 मिनट",
    deity_note: "जैन ज्योतिष में वैदिक अश्विनी कुमार नहीं — इस नक्षत्र के ज्योतिषी देव कुन्थुनाथ और नमिनाथ तीर्थंकरों से संबंधित हैं।"
  },
  {
    index: 1, name: "Bharani", hindi_name: "भरणी",
    start_deg: 13.333, end_deg: 26.667,
    nature: "mishra", karma_type: "Vedaniya",
    tirthankaras_born: ["शान्तिनाथ (16)"],
    ruling_jyotishi_dev: "भरणी ज्योतिषी देव",
    spiritual_traits: "परिवर्तन, समाप्ति, नया जन्म, न्याय",
    karma_manifestation: "वेदनीय कर्म: भावनात्मक उतार-चढ़ाव, दुःख और सुख का तीव्र अनुभव",
    sadhana: "उत्तम मार्दव भावना का ध्यान 10 मिनट + एकासन व्रत सोमवार को",
    deity_note: "जैन ज्योतिष में वैदिक यम देव नहीं — शान्तिनाथ तीर्थंकर का जन्म नक्षत्र होने से यह मिश्र स्वभाव का है।"
  },
  {
    index: 2, name: "Krittika", hindi_name: "कृत्तिका",
    start_deg: 26.667, end_deg: 40,
    nature: "mishra", karma_type: "Naam",
    tirthankaras_born: ["सुमतिनाथ (5)"],
    ruling_jyotishi_dev: "कृत्तिका ज्योतिषी देव",
    spiritual_traits: "शुद्धि, तेज, कड़ी मेहनत, परिष्कार",
    karma_manifestation: "नाम कर्म: शरीर और रूप से संबंधित चिंताएँ, पहचान की अनिश्चितता",
    sadhana: "देव-दर्शन प्रतिदिन + शुक्रवार को विशेष पंचामृत अभिषेक",
    deity_note: "जैन ज्योतिष में वैदिक अग्नि देव नहीं — सुमतिनाथ तीर्थंकर का जन्म नक्षत्र।"
  },
  {
    index: 3, name: "Rohini", hindi_name: "रोहिणी",
    start_deg: 40, end_deg: 53.333,
    nature: "param_shubha", karma_type: "Gyanavaraniya",
    tirthankaras_born: ["अजितनाथ (2)"],
    ruling_jyotishi_dev: "रोहिणी ज्योतिषी देव",
    spiritual_traits: "उर्वरता, समृद्धि, स्थिरता, सौंदर्य, प्रेम",
    karma_manifestation: "ज्ञानावरणीय कर्म का विशेष क्षय: ज्ञान की प्राप्ति में सहायता मिलती है",
    sadhana: "अजितनाथ भगवान का स्मरण 108 बार + प्रतिदिन शास्त्र-श्रवण",
    deity_note: "परम शुभ नक्षत्र — अजितनाथ (द्वितीय तीर्थंकर) का जन्म, दीक्षा, केवलज्ञान और निर्वाण सभी इसी नक्षत्र में।"
  },
  {
    index: 4, name: "Mrigashirsha", hindi_name: "मृगशिरा",
    start_deg: 53.333, end_deg: 66.667,
    nature: "shubha", karma_type: "Mohaniya",
    tirthankaras_born: ["सम्भवनाथ (3)"],
    ruling_jyotishi_dev: "मृगशिरा ज्योतिषी देव",
    spiritual_traits: "खोज, यात्रा, जिज्ञासा, संवेदनशीलता",
    karma_manifestation: "मोहनीय कर्म: नई वस्तुओं और संबंधों की लालसा, मन की चंचलता",
    sadhana: "वैराग्य भावना 15 मिनट + सम्भवनाथ का स्मरण 27 बार",
    deity_note: "जैन ज्योतिष में वैदिक सोम देव नहीं — सम्भवनाथ तीर्थंकर का जन्म नक्षत्र।"
  },
  {
    index: 5, name: "Ardra", hindi_name: "आर्द्रा",
    start_deg: 66.667, end_deg: 80,
    nature: "ashubha", karma_type: "Mohaniya",
    tirthankaras_born: [],
    ruling_jyotishi_dev: "आर्द्रा ज्योतिषी देव",
    spiritual_traits: "तूफान, आँसू, परिवर्तन, भावनात्मक तीव्रता",
    karma_manifestation: "मोहनीय कर्म: तीव्र भावनात्मक दुःख, क्रोध के बाद पश्चाताप, नशे की प्रवृत्ति",
    sadhana: "उत्तम क्षमा भावना प्रतिदिन + रात को सोने से पूर्व 108 णमोकार",
    deity_note: "जैन ज्योतिष में वैदिक रुद्र नहीं — अशुभ नक्षत्र, मोहनीय कर्म का प्रबल उदय।"
  },
  {
    index: 6, name: "Punarvasu", hindi_name: "पुनर्वसु",
    start_deg: 80, end_deg: 93.333,
    nature: "shubha", karma_type: "Naam",
    tirthankaras_born: ["अभिनन्दननाथ (4)"],
    ruling_jyotishi_dev: "पुनर्वसु ज्योतिषी देव",
    spiritual_traits: "पुनः वापसी, उपचार, बहुमुखी प्रतिभा, उदारता",
    karma_manifestation: "नाम कर्म: शरीर के अंगों से संबंधित समस्याएँ, रूप-सौंदर्य की चिंता",
    sadhana: "अभिनन्दननाथ का पूजन + प्रतिदिन अष्टद्रव्य चढ़ाना",
    deity_note: "जैन ज्योतिष में वैदिक अदिति नहीं — अभिनन्दननाथ तीर्थंकर का जन्म नक्षत्र।"
  },
  {
    index: 7, name: "Pushya", hindi_name: "पुष्य",
    start_deg: 93.333, end_deg: 106.667,
    nature: "shubha", karma_type: "Gyanavaraniya",
    tirthankaras_born: [],
    ruling_jyotishi_dev: "पुष्य ज्योतिषी देव",
    spiritual_traits: "पोषण, सुरक्षा, धर्म-कार्य, शांति",
    karma_manifestation: "ज्ञानावरणीय कर्म: शिक्षा में बाधा, धर्म ग्रंथों का अर्थ न समझ पाना",
    sadhana: "गुरुवार को विशेष स्वाध्याय + 16 बार णमोकार",
    deity_note: "जैन ज्योतिष में वैदिक बृहस्पति नहीं — शुभ नक्षत्र, ज्ञानावरणीय कर्म निर्जरा में सहायक।"
  },
  {
    index: 8, name: "Ashlesha", hindi_name: "आश्लेषा",
    start_deg: 106.667, end_deg: 120,
    nature: "ashubha", karma_type: "Mohaniya",
    tirthankaras_born: [],
    ruling_jyotishi_dev: "आश्लेषा ज्योतिषी देव",
    spiritual_traits: "आसक्ति, रहस्य, कुंडलिनी शक्ति, गहरी भावनाएँ",
    karma_manifestation: "मोहनीय कर्म: किसी व्यक्ति या वस्तु से अत्यधिक आसक्ति, छोड़ने में कठिनाई",
    sadhana: "अनाशक्ति भावना + सप्ताह में एक बार उपवास",
    deity_note: "जैन ज्योतिष में वैदिक नाग देव नहीं — अशुभ नक्षत्र, मोहनीय कर्म का तीव्र उदय।"
  },
  {
    index: 9, name: "Magha", hindi_name: "मघा",
    start_deg: 120, end_deg: 133.333,
    nature: "mishra", karma_type: "Gotra",
    tirthankaras_born: [],
    ruling_jyotishi_dev: "मघा ज्योतिषी देव",
    spiritual_traits: "पूर्वजों का आशीर्वाद, कुल-गौरव, नेतृत्व, उत्तराधिकार",
    karma_manifestation: "गोत्र कर्म: कुल से संबंधित बाधाएँ, पारिवारिक गौरव की चिंता",
    sadhana: "पितर-तर्पण (जैन विधि से) + मल्लिनाथ का स्मरण",
    deity_note: "जैन ज्योतिष में वैदिक पितृ देव नहीं — गोत्र कर्म से संबंधित मिश्र नक्षत्र।"
  },
  {
    index: 10, name: "Purva Phalguni", hindi_name: "पूर्व फाल्गुनी",
    start_deg: 133.333, end_deg: 146.667,
    nature: "mishra", karma_type: "Vedaniya",
    tirthankaras_born: [],
    ruling_jyotishi_dev: "पूर्व फाल्गुनी ज्योतिषी देव",
    spiritual_traits: "विश्राम, सृजन, प्रेम, कला, आनंद",
    karma_manifestation: "वेदनीय कर्म: भौतिक सुखों में अत्यधिक आसक्ति, सुख-विरह का तीव्र दुःख",
    sadhana: "परिग्रह-परिमाण व्रत + शुक्रवार को पद्मप्रभु भगवान की पूजा",
    deity_note: "जैन ज्योतिष में वैदिक भग देव नहीं — वेदनीय कर्म का प्रबल प्रभाव।"
  },
  {
    index: 11, name: "Uttara Phalguni", hindi_name: "उत्तर फाल्गुनी",
    start_deg: 146.667, end_deg: 160,
    nature: "param_shubha", karma_type: "Gyanavaraniya",
    tirthankaras_born: ["महावीर स्वामी (24)", "विमलनाथ (13)"],
    ruling_jyotishi_dev: "उत्तर फाल्गुनी ज्योतिषी देव",
    spiritual_traits: "सेवा, संगठन, उत्तरदायित्व, सामाजिक न्याय",
    karma_manifestation: "ज्ञानावरणीय कर्म निर्जरा: ज्ञान की विशेष प्राप्ति, सेवा से पुण्यबंध",
    sadhana: "महावीर स्वामी का स्मरण + 'ॐ ह्रीं श्री महावीर स्वामिने नमः' 108 बार",
    deity_note: "परम शुभ नक्षत्र — भगवान महावीर और विमलनाथ का जन्म नक्षत्र।"
  },
  {
    index: 12, name: "Hasta", hindi_name: "हस्त",
    start_deg: 160, end_deg: 173.333,
    nature: "shubha", karma_type: "Antaraya",
    tirthankaras_born: [],
    ruling_jyotishi_dev: "हस्त ज्योतिषी देव",
    spiritual_traits: "कुशलता, सटीकता, चिकित्सा, हस्त-कला",
    karma_manifestation: "अंतराय कर्म: कार्य में अचानक बाधा, मेहनत के बाद भी फल न मिलना",
    sadhana: "सम्भवनाथ का पूजन + 'ॐ ह्रीं श्री सम्भवनाथाय नमः' 27 बार",
    deity_note: "जैन ज्योतिष में वैदिक सूर्य देव नहीं — अंतराय कर्म निवारण में सहायक शुभ नक्षत्र।"
  },
  {
    index: 13, name: "Chitra", hindi_name: "चित्रा",
    start_deg: 173.333, end_deg: 186.667,
    nature: "shubha", karma_type: "Naam",
    tirthankaras_born: ["पद्मप्रभु (6)", "नेमिनाथ (22)"],
    ruling_jyotishi_dev: "चित्रा ज्योतिषी देव",
    spiritual_traits: "सौंदर्य, कला, रचनात्मकता, विविधता",
    karma_manifestation: "नाम कर्म: शारीरिक सौंदर्य की तीव्र इच्छा, दिखावे की प्रवृत्ति",
    sadhana: "पद्मप्रभु की पूजा + नेमिनाथ का स्मरण, पशु-दया का अभ्यास",
    deity_note: "जैन ज्योतिष में वैदिक विश्वकर्मा नहीं — पद्मप्रभु और नेमिनाथ का जन्म नक्षत्र।"
  },
  {
    index: 14, name: "Swati", hindi_name: "स्वाति",
    start_deg: 186.667, end_deg: 200,
    nature: "shubha", karma_type: "Darshanavaraniya",
    tirthankaras_born: [],
    ruling_jyotishi_dev: "स्वाति ज्योतिषी देव",
    spiritual_traits: "स्वतंत्रता, लचीलापन, व्यापार, गति",
    karma_manifestation: "दर्शनावरणीय कर्म: आत्म-साक्षात्कार में बाधा, सम्यक् दर्शन का अभाव",
    sadhana: "तत्त्वार्थसूत्र का पाठ + 'सम्यक् दर्शन' भावना 10 मिनट",
    deity_note: "जैन ज्योतिष में वैदिक वायु देव नहीं — दर्शनावरणीय कर्म निर्जरा का शुभ नक्षत्र।"
  },
  {
    index: 15, name: "Vishakha", hindi_name: "विशाखा",
    start_deg: 200, end_deg: 213.333,
    nature: "param_shubha", karma_type: "Charitra Mohaniya",
    tirthankaras_born: ["सुपार्श्वनाथ (7)", "शीतलनाथ (10)", "पार्श्वनाथ (23)"],
    ruling_jyotishi_dev: "विशाखा ज्योतिषी देव",
    spiritual_traits: "लक्ष्य-प्राप्ति, दृढ़ता, दोहरी प्रकृति, परिवर्तन",
    karma_manifestation: "चारित्र मोहनीय कर्म: सही आचरण जानते हुए भी न करना, संकल्प टूटना",
    sadhana: "पार्श्वनाथ का अभिषेक + 'उवसग्गहरं पास' स्तोत्र का पाठ प्रतिदिन",
    deity_note: "परम शुभ नक्षत्र — सुपार्श्वनाथ, शीतलनाथ और पार्श्वनाथ का जन्म नक्षत्र।"
  },
  {
    index: 16, name: "Anuradha", hindi_name: "अनुराधा",
    start_deg: 213.333, end_deg: 226.667,
    nature: "shubha", karma_type: "Darshanavaraniya",
    tirthankaras_born: ["चन्द्रप्रभु (8)"],
    ruling_jyotishi_dev: "अनुराधा ज्योतिषी देव",
    spiritual_traits: "मित्रता, सहयोग, भक्ति, सफलता की राह",
    karma_manifestation: "दर्शनावरणीय कर्म: आँखों की समस्याएँ, आत्म-ज्ञान में बाधा",
    sadhana: "चन्द्रप्रभु का पूजन + नेत्र-रोग हेतु 'ॐ ह्रीं श्री चन्द्रप्रभाय नमः' 108 बार",
    deity_note: "जैन ज्योतिष में वैदिक मित्र देव नहीं — चन्द्रप्रभु का जन्म नक्षत्र।"
  },
  {
    index: 17, name: "Jyeshtha", hindi_name: "ज्येष्ठा",
    start_deg: 226.667, end_deg: 240,
    nature: "ashubha", karma_type: "Antaraya",
    tirthankaras_born: [],
    ruling_jyotishi_dev: "ज्येष्ठा ज्योतिषी देव",
    spiritual_traits: "वरिष्ठता, सुरक्षा, गोपनीयता, संघर्ष",
    karma_manifestation: "अंतराय कर्म: दान में बाधा, उचित लाभ से वंचित होना, प्रयास व्यर्थ जाना",
    sadhana: "अष्टद्रव्य पूजा + 'सम्भवनाथाय नमः' 27 बार, बुधवार को उपवास",
    deity_note: "जैन ज्योतिष में वैदिक इंद्र देव नहीं — अशुभ नक्षत्र, अंतराय कर्म का प्रबल उदय।"
  },
  {
    index: 18, name: "Mula", hindi_name: "मूला",
    start_deg: 240, end_deg: 253.333,
    nature: "ashubha", karma_type: "Mohaniya",
    tirthankaras_born: ["सुविधिनाथ (9)"],
    ruling_jyotishi_dev: "मूला ज्योतिषी देव",
    spiritual_traits: "जड़ों की खोज, विनाश-पुनर्निर्माण, गहराई",
    karma_manifestation: "मोहनीय कर्म: मूलभूत आसक्तियाँ जो छोड़ना कठिन है",
    sadhana: "सुविधिनाथ का स्मरण + शनिवार को सूर्यास्त से पूर्व उपवास",
    deity_note: "जैन ज्योतिष में वैदिक निऋति देव नहीं — सुविधिनाथ का जन्म नक्षत्र होने पर भी अशुभ प्रकृति।"
  },
  {
    index: 19, name: "Purva Ashadha", hindi_name: "पूर्वाषाढ़ा",
    start_deg: 253.333, end_deg: 266.667,
    nature: "mishra", karma_type: "Gotra",
    tirthankaras_born: ["मल्लिनाथ (19)"],
    ruling_jyotishi_dev: "पूर्वाषाढ़ा ज्योतिषी देव",
    spiritual_traits: "अजेय शक्ति, जल-तत्व, शुद्धि, विजय की ओर",
    karma_manifestation: "गोत्र कर्म: कुल-परंपरा से संघर्ष, सामाजिक प्रतिष्ठा की चिंता",
    sadhana: "मल्लिनाथ का पूजन + गुरुवार को कुल-देव दर्शन",
    deity_note: "जैन ज्योतिष में वैदिक अपः देव नहीं — मल्लिनाथ का जन्म नक्षत्र।"
  },
  {
    index: 20, name: "Uttara Ashadha", hindi_name: "उत्तराषाढ़ा",
    start_deg: 266.667, end_deg: 280,
    nature: "param_shubha", karma_type: "Gyanavaraniya",
    tirthankaras_born: ["ऋषभनाथ (1)", "अरनाथ (18)"],
    ruling_jyotishi_dev: "उत्तराषाढ़ा ज्योतिषी देव",
    spiritual_traits: "अंतिम विजय, धर्म की स्थापना, सत्य, अखंड संकल्प",
    karma_manifestation: "ज्ञानावरणीय कर्म निर्जरा: स्थायी ज्ञान-प्राप्ति, आत्म-साक्षात्कार की ओर",
    sadhana: "ऋषभदेव की विशेष पूजा + भक्तामर स्तोत्र के 48 श्लोक",
    deity_note: "परम शुभ नक्षत्र — प्रथम तीर्थंकर ऋषभनाथ और अरनाथ का जन्म नक्षत्र।"
  },
  {
    index: 21, name: "Shravana", hindi_name: "श्रवण",
    start_deg: 280, end_deg: 293.333,
    nature: "shubha", karma_type: "Gyanavaraniya",
    tirthankaras_born: ["श्रेयांसनाथ (11)", "मुनिसुव्रत (20)"],
    ruling_jyotishi_dev: "श्रवण ज्योतिषी देव",
    spiritual_traits: "श्रवण, शिक्षा, धर्म-सेवा, समर्पण",
    karma_manifestation: "ज्ञानावरणीय कर्म: श्रुत-ज्ञान में बाधा, गुरु के वचन न सुन पाना",
    sadhana: "श्रेयांसनाथ और मुनिसुव्रत का स्मरण + शास्त्र-श्रवण प्रतिदिन 30 मिनट",
    deity_note: "जैन ज्योतिष में वैदिक विष्णु नहीं — श्रेयांसनाथ और मुनिसुव्रत का जन्म नक्षत्र।"
  },
  {
    index: 22, name: "Dhanishtha", hindi_name: "धनिष्ठा",
    start_deg: 293.333, end_deg: 306.667,
    nature: "mishra", karma_type: "Naam",
    tirthankaras_born: [],
    ruling_jyotishi_dev: "धनिष्ठा ज्योतिषी देव",
    spiritual_traits: "धन, संगीत, ताल, समृद्धि, मंगल-कार्य",
    karma_manifestation: "नाम कर्म: भौतिक समृद्धि की तीव्र इच्छा, शरीर के प्रति अत्यधिक आसक्ति",
    sadhana: "परिग्रह-परिमाण व्रत + मंगलवार को विशेष जाप",
    deity_note: "जैन ज्योतिष में वैदिक अष्टवसु नहीं — नाम कर्म से जुड़ा मिश्र नक्षत्र।"
  },
  {
    index: 23, name: "Shatabhisha", hindi_name: "शतभिषा",
    start_deg: 306.667, end_deg: 320,
    nature: "mishra", karma_type: "Vedaniya",
    tirthankaras_born: ["वासुपूज्य (12)"],
    ruling_jyotishi_dev: "शतभिषा ज्योतिषी देव",
    spiritual_traits: "चिकित्सा, एकांत, रहस्य, अनुसंधान",
    karma_manifestation: "वेदनीय कर्म: छिपे हुए दुःख, लंबी बीमारी, एकाकीपन",
    sadhana: "वासुपूज्य का पूजन + सोमवार को उपवास, आयुर्वेदिक दिनचर्या",
    deity_note: "जैन ज्योतिष में वैदिक वरुण देव नहीं — वासुपूज्य का जन्म नक्षत्र।"
  },
  {
    index: 24, name: "Purva Bhadrapada", hindi_name: "पूर्व भाद्रपद",
    start_deg: 320, end_deg: 333.333,
    nature: "ashubha", karma_type: "Mohaniya",
    tirthankaras_born: [],
    ruling_jyotishi_dev: "पूर्व भाद्रपद ज्योतिषी देव",
    spiritual_traits: "अग्नि-तत्व, परिवर्तन, उग्रता, साहस",
    karma_manifestation: "मोहनीय कर्म: उग्र स्वभाव, क्रोध-लोभ का तीव्र उदय",
    sadhana: "उत्तम क्षमा + उत्तम सत्य भावना, मंगलवार को 108 णमोकार",
    deity_note: "जैन ज्योतिष में वैदिक अजैकपाद नहीं — अशुभ नक्षत्र, मोहनीय कर्म का प्रबल उदय।"
  },
  {
    index: 25, name: "Uttara Bhadrapada", hindi_name: "उत्तर भाद्रपद",
    start_deg: 333.333, end_deg: 346.667,
    nature: "shubha", karma_type: "Charitra Mohaniya",
    tirthankaras_born: ["धर्मनाथ (15)"],
    ruling_jyotishi_dev: "उत्तर भाद्रपद ज्योतिषी देव",
    spiritual_traits: "गहरा ज्ञान, जल-तत्व, समाधि, पूर्णता",
    karma_manifestation: "चारित्र मोहनीय कर्म: व्रत और नियम तोड़ने की प्रवृत्ति",
    sadhana: "धर्मनाथ का पूजन + गुरुवार को संपूर्ण व्रत-पालन",
    deity_note: "जैन ज्योतिष में वैदिक अहिर्बुध्न्य नहीं — धर्मनाथ का जन्म नक्षत्र।"
  },
  {
    index: 26, name: "Revati", hindi_name: "रेवती",
    start_deg: 346.667, end_deg: 360,
    nature: "shubha", karma_type: "Mohaniya",
    tirthankaras_born: ["अनन्तनाथ (14)"],
    ruling_jyotishi_dev: "रेवती ज्योतिषी देव",
    spiritual_traits: "यात्रा की समाप्ति, पोषण, करुणा, आध्यात्मिक पूर्णता",
    karma_manifestation: "मोहनीय कर्म: संसार-यात्रा का बोध, परंतु जाने का भय",
    sadhana: "अनन्तनाथ का स्मरण + संसार-भावना 15 मिनट, रात को प्रतिक्रमण",
    deity_note: "जैन ज्योतिष में वैदिक पूषा नहीं — अनन्तनाथ का जन्म नक्षत्र।"
  }
];

// Abhijit — special 28th star, between Uttara Ashadha and Shravana
export const ABHIJIT: Nakshatra = {
  index: 27, name: "Abhijit", hindi_name: "अभिजित",
  start_deg: 276.667, end_deg: 280.889,
  nature: "param_shubha", karma_type: "Sarva karma kshay",
  tirthankaras_born: ["ऋषभनाथ (1) — निर्वाण नक्षत्र"],
  ruling_jyotishi_dev: "अभिजित ज्योतिषी देव (मोक्ष नक्षत्र)",
  spiritual_traits: "मोक्ष, सर्वकर्म क्षय, आत्मा की परम शुद्धि",
  karma_manifestation: "सर्व कर्मों का क्षय — यह नक्षत्र मोक्ष का द्योतक है",
  sadhana: "भगवान ऋषभदेव की पूजा + षट्खंडागम श्रवण",
  deity_note: "परम शुभ मोक्ष-नक्षत्र — ऋषभनाथ भगवान का निर्वाण इसी नक्षत्र में हुआ।"
};

export function getNakshatraByDegree(siderealDeg: number): Nakshatra {
  const normalized = ((siderealDeg % 360) + 360) % 360;
  const index = Math.floor(normalized / 13.333333);
  return NAKSHATRAS[Math.min(index, 26)];
}

export function getNakshatraPada(siderealDeg: number): number {
  const normalized = ((siderealDeg % 360) + 360) % 360;
  const posInNakshatra = normalized % 13.333333;
  return Math.floor(posInNakshatra / 3.333333) + 1; // 1–4
}

export function getNakshatraByName(name: string): Nakshatra | undefined {
  return NAKSHATRAS.find(n =>
    n.name.toLowerCase() === name.toLowerCase() ||
    n.hindi_name === name
  );
}
