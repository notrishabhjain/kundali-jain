export interface Tirthankara {
  id: number;
  name: string;
  hindi_name: string;
  aka?: string;
  father: string;
  mother: string;
  birth_place: string;
  birth_nakshatra: string;
  birth_rashi: string;
  birth_tithi: string;
  nirvana_place: string;
  varna: string;
  hindi_varna: string;
  symbol: string;
  hindi_symbol: string;
  height: string;
  lifespan: string;
  yaksha: string;
  yakshini: string;
  tree: string;
  karma_addressed: string;
  puja_benefit: string;
  mantra: string;
  stotra: string;
  notes?: string;
}

export const TIRTHANKARAS: Tirthankara[] = [
  {
    id: 1, name: "Rishabhanatha", hindi_name: "ऋषभनाथ", aka: "Adinatha, Adishvara",
    father: "Nabhi Raja", mother: "Marudevi", birth_place: "विनिता (अयोध्या)",
    birth_nakshatra: "Uttara Ashadha", birth_rashi: "Dhanu (Sagittarius)",
    birth_tithi: "Chaitra Krishnapaksha 9", nirvana_place: "अष्टापद (कैलाश पर्वत)",
    varna: "Golden", hindi_varna: "सुवर्ण (स्वर्णिम)",
    symbol: "Bull", hindi_symbol: "बैल (वृषभ)",
    height: "1500 मीटर (500 धनुष)", lifespan: "84 लाख पूर्व",
    yaksha: "Gomukha", yakshini: "Chakreshvari",
    tree: "वट (बरगद)", karma_addressed: "Darshanavaraniya, Mohaniya",
    puja_benefit: "सम्यक् दर्शन की जागृति के लिए निमित्त, मोहनीय कर्म की निर्जरा",
    mantra: "ॐ ह्रीं श्री ऋषभदेवाय नमः",
    stotra: "Rishabha Jinastavan",
    notes: "प्रथम तीर्थंकर। मानव सभ्यता के संस्थापक। 72 पुरुष कलाओं और 64 स्त्री कलाओं के प्रवर्तक।"
  },
  {
    id: 2, name: "Ajitanatha", hindi_name: "अजितनाथ",
    father: "Jitashatru", mother: "Vijaya", birth_place: "अयोध्या",
    birth_nakshatra: "Rohini", birth_rashi: "Vrishabha (Taurus)",
    birth_tithi: "Magha Shukla 8", nirvana_place: "शिखरजी (सम्मेद शिखर)",
    varna: "Golden", hindi_varna: "सुवर्ण",
    symbol: "Elephant", hindi_symbol: "हाथी (गज)",
    height: "1350 मीटर (450 धनुष)", lifespan: "72 लाख पूर्व",
    yaksha: "Mahayaksha", yakshini: "Rohini (Ajitabala)",
    tree: "शाल (Shorea robusta)", karma_addressed: "Gyanavaraniya",
    puja_benefit: "ज्ञानावरण कर्म के क्षयोपशम में निमित्त, श्रुतज्ञान की वृद्धि",
    mantra: "ॐ ह्रीं श्री अजितनाथाय नमः", stotra: "Ajita Jinastavan"
  },
  {
    id: 3, name: "Sambhavanatha", hindi_name: "सम्भवनाथ",
    father: "Jitari", mother: "Sena", birth_place: "श्रावस्ती",
    birth_nakshatra: "Mrigashirsha", birth_rashi: "Mithuna (Gemini)",
    birth_tithi: "Margashirsha Shukla 14", nirvana_place: "शिखरजी",
    varna: "Golden", hindi_varna: "सुवर्ण",
    symbol: "Horse", hindi_symbol: "घोड़ा (अश्व)",
    height: "1200 मीटर (400 धनुष)", lifespan: "60 लाख पूर्व",
    yaksha: "Trimukha", yakshini: "Duritari (Prajnapti)",
    tree: "Prayala", karma_addressed: "Antaraya",
    puja_benefit: "अंतराय कर्म के क्षयोपशम हेतु उत्तम निमित्त, साधना में विघ्नों की निर्जरा",
    mantra: "ॐ ह्रीं श्री सम्भवनाथाय नमः", stotra: "Sambhava Jinastavan"
  },
  {
    id: 4, name: "Abhinandananatha", hindi_name: "अभिनन्दननाथ",
    father: "Samvara", mother: "Siddhartha Devi", birth_place: "अयोध्या",
    birth_nakshatra: "Punarvasu", birth_rashi: "Karkata (Cancer)",
    birth_tithi: "Vaishakha Shukla 2", nirvana_place: "शिखरजी",
    varna: "Golden", hindi_varna: "सुवर्ण",
    symbol: "Monkey", hindi_symbol: "बन्दर (वानर)",
    height: "1050 मीटर (350 धनुष)", lifespan: "50 लाख पूर्व",
    yaksha: "Yaksheshvara", yakshini: "Vajrashrinkhala",
    tree: "Priyangu", karma_addressed: "Naam karma",
    puja_benefit: "अशुभ नाम कर्म की निर्जरा, साता वेदनीय कर्मबंध के उत्तम निमित्त",
    mantra: "ॐ ह्रीं श्री अभिनन्दननाथाय नमः", stotra: "Abhinandana Jinastavan"
  },
  {
    id: 5, name: "Sumatinatha", hindi_name: "सुमतिनाथ",
    father: "Megharatha", mother: "Mangala", birth_place: "अयोध्या",
    birth_nakshatra: "Krittika", birth_rashi: "Vrishabha (Taurus)",
    birth_tithi: "Vaishakha Shukla 11", nirvana_place: "शिखरजी",
    varna: "Golden", hindi_varna: "सुवर्ण",
    symbol: "Goose", hindi_symbol: "हंस",
    height: "900 मीटर (300 धनुष)", lifespan: "40 लाख पूर्व",
    yaksha: "Tumburu", yakshini: "Mahakali",
    tree: "शाल", karma_addressed: "Gyanavaraniya",
    puja_benefit: "मतिज्ञानावरण कर्म के क्षयोपशम में सहायक, विवेक और आत्मज्ञान की जागृति",
    mantra: "ॐ ह्रीं श्री सुमतिनाथाय नमः", stotra: "Sumati Jinastavan"
  },
  {
    id: 6, name: "Padmaprabhu", hindi_name: "पद्मप्रभु",
    father: "Shridhara", mother: "Susima", birth_place: "कौशाम्बी",
    birth_nakshatra: "Chitra", birth_rashi: "Kanya / Tula",
    birth_tithi: "Kartika Krishna 13", nirvana_place: "शिखरजी",
    varna: "Red", hindi_varna: "लाल (रक्त वर्ण)",
    symbol: "Lotus", hindi_symbol: "कमल",
    height: "750 मीटर (250 धनुष)", lifespan: "30 लाख पूर्व",
    yaksha: "Kusuma", yakshini: "Shyama",
    tree: "Chhatra", karma_addressed: "Vedaniya",
    puja_benefit: "असाता वेदनीय कर्म की निर्जरा, कषायों की मंदता हेतु निमित्त",
    mantra: "ॐ ह्रीं श्री पद्मप्रभाय नमः", stotra: "Padmaprabha Jinastavan"
  },
  {
    id: 7, name: "Suparshvanatha", hindi_name: "सुपार्श्वनाथ",
    father: "Supratishtha", mother: "Prithvi", birth_place: "वाराणसी",
    birth_nakshatra: "Vishakha", birth_rashi: "Tula (Libra)",
    birth_tithi: "Jyeshtha Shukla 12", nirvana_place: "शिखरजी",
    varna: "Golden", hindi_varna: "सुवर्ण",
    symbol: "Swastika", hindi_symbol: "स्वस्तिक",
    height: "600 मीटर (200 धनुष)", lifespan: "20 लाख पूर्व",
    yaksha: "Matanga", yakshini: "Shanta",
    tree: "Shirisha", karma_addressed: "Mohaniya (charitra moha)",
    puja_benefit: "चारित्र मोहनीय कर्म की निर्जरा, वैराग्य और समता भाव की जागृति",
    mantra: "ॐ ह्रीं श्री सुपार्श्वनाथाय नमः", stotra: "Suparshva Jinastavan"
  },
  {
    id: 8, name: "Chandraprabhu", hindi_name: "चन्द्रप्रभु",
    father: "Mahasena", mother: "Lakshmana", birth_place: "चन्द्रावती",
    birth_nakshatra: "Anuradha", birth_rashi: "Vrischika (Scorpio)",
    birth_tithi: "Phalgun Krishna 12", nirvana_place: "शिखरजी",
    varna: "White", hindi_varna: "श्वेत (सफ़ेद)",
    symbol: "Crescent Moon", hindi_symbol: "चन्द्र (अर्धचन्द्र)",
    height: "450 मीटर (150 धनुष)", lifespan: "10 लाख पूर्व",
    yaksha: "Vijaya", yakshini: "Bhrikuti",
    tree: "Naga", karma_addressed: "Darshanavaraniya (chakshu darshan)",
    puja_benefit: "दर्शनावरण कर्म की निर्जरा, आत्म-प्रकाश की प्राप्ति हेतु निमित्त",
    mantra: "ॐ ह्रीं श्री चन्द्रप्रभाय नमः", stotra: "Chandraprabha Jinastavan"
  },
  {
    id: 9, name: "Suvidhinatha", hindi_name: "सुविधिनाथ", aka: "Pushpadanta",
    father: "Sugriva", mother: "Rama", birth_place: "काकंदी",
    birth_nakshatra: "Mula", birth_rashi: "Dhanu (Sagittarius)",
    birth_tithi: "Margashirsha Shukla 5", nirvana_place: "शिखरजी",
    varna: "White", hindi_varna: "श्वेत",
    symbol: "Crocodile", hindi_symbol: "मकर (घड़ियाल)",
    height: "300 मीटर (100 धनुष)", lifespan: "2 लाख पूर्व",
    yaksha: "Ajita", yakshini: "Sutaraka",
    tree: "शाल", karma_addressed: "Gyanavaraniya (sarvavadhi gyan)",
    puja_benefit: "ज्ञानवरण कर्म के क्षयोपशम, आत्मिक अंतर्ज्ञान में निमित्त",
    mantra: "ॐ ह्रीं श्री सुविधिनाथाय नमः", stotra: "Suvdhinath Jinastavan"
  },
  {
    id: 10, name: "Shitalanatha", hindi_name: "शीतलनाथ",
    father: "Dridharatha", mother: "Nanda", birth_place: "भद्दिलपुर",
    birth_nakshatra: "Vishakha", birth_rashi: "Tula",
    birth_tithi: "Magha Krishna 12", nirvana_place: "शिखरजी",
    varna: "Golden", hindi_varna: "सुवर्ण",
    symbol: "Kalpavriksha", hindi_symbol: "कल्पवृक्ष",
    height: "270 मीटर (90 धनुष)", lifespan: "1 लाख पूर्व",
    yaksha: "Brahma", yakshini: "Ashoka",
    tree: "Priyangu", karma_addressed: "Antaraya (labha-antaraya)",
    puja_benefit: "लाभ-अंतराय कर्म के क्षयोपशम, साधना में स्थिरता हेतु निमित्त",
    mantra: "ॐ ह्रीं श्री शीतलनाथाय नमः", stotra: "Shitala Jinastavan"
  },
  {
    id: 11, name: "Shreyansanatha", hindi_name: "श्रेयांसनाथ",
    father: "Vishnuraja", mother: "Vishnu", birth_place: "सिंहपुरी",
    birth_nakshatra: "Shravana", birth_rashi: "Makara (Capricorn)",
    birth_tithi: "Vaishakha Shukla 3", nirvana_place: "शिखरजी",
    varna: "Golden", hindi_varna: "सुवर्ण",
    symbol: "Rhinoceros", hindi_symbol: "गैंडा",
    height: "240 मीटर (80 धनुष)", lifespan: "84 लाख वर्ष",
    yaksha: "Yaksheta", yakshini: "Manavi",
    tree: "Tanduka", karma_addressed: "Gyanavaraniya (shrutan gyan)",
    puja_benefit: "श्रुतज्ञानावरण कर्म के क्षयोपशम, शास्त्र स्वाध्याय में विशुद्धि हेतु निमित्त",
    mantra: "ॐ ह्रीं श्री श्रेयांसनाथाय नमः", stotra: "Shreyansa Jinastavan"
  },
  {
    id: 12, name: "Vasupujya", hindi_name: "वासुपूज्य",
    father: "Vasupujya Sr.", mother: "Jaya", birth_place: "चम्पापुरी",
    birth_nakshatra: "Shatabhisha", birth_rashi: "Kumbha (Aquarius)",
    birth_tithi: "Phalgun Krishna 14", nirvana_place: "चम्पापुरी (जन्मस्थान पर ही निर्वाण)",
    varna: "Red", hindi_varna: "लाल (रक्त)",
    symbol: "Buffalo", hindi_symbol: "भैंसा (महिष)",
    height: "210 मीटर (70 धनुष)", lifespan: "72 लाख वर्ष",
    yaksha: "Kumara", yakshini: "Chandra",
    tree: "Patala", karma_addressed: "Vedaniya (asata vedaniya)",
    puja_benefit: "असाता वेदनीय कर्म के उदय को समता से सहने का आत्मबल",
    mantra: "ॐ ह्रीं श्री वासुपूज्याय नमः", stotra: "Vasupujya Jinastavan"
  },
  {
    id: 13, name: "Vimalanatha", hindi_name: "विमलनाथ",
    father: "Kritavarma", mother: "Shyama", birth_place: "कम्पिल्यपुर",
    birth_nakshatra: "Uttara Phalguni", birth_rashi: "Kanya (Virgo)",
    birth_tithi: "Bhadrapada Shukla 6", nirvana_place: "शिखरजी",
    varna: "Golden", hindi_varna: "सुवर्ण",
    symbol: "Boar", hindi_symbol: "सूअर (वराह)",
    height: "180 मीटर (60 धनुष)", lifespan: "60 लाख वर्ष",
    yaksha: "Shanmukha", yakshini: "Vidita",
    tree: "Jambu", karma_addressed: "Darshanavaraniya",
    puja_benefit: "दर्शन मोह और दर्शनावरण की निर्जरा, आत्मिक निर्मलता की वृद्धि",
    mantra: "ॐ ह्रीं श्री विमलनाथाय नमः", stotra: "Vimala Jinastavan"
  },
  {
    id: 14, name: "Anantanatha", hindi_name: "अनन्तनाथ",
    father: "Simhasena", mother: "Suyasha", birth_place: "अयोध्या",
    birth_nakshatra: "Revati", birth_rashi: "Meena (Pisces)",
    birth_tithi: "Vaishakha Shukla 13", nirvana_place: "शिखरजी",
    varna: "Golden", hindi_varna: "सुवर्ण",
    symbol: "Porcupine", hindi_symbol: "साही",
    height: "150 मीटर (50 धनुष)", lifespan: "30 लाख वर्ष",
    yaksha: "Patala", yakshini: "Ankusha",
    tree: "Ashoka", karma_addressed: "Mohaniya",
    puja_benefit: "संसार से वैराग्य की उत्पत्ति, मोहनीय कर्म के क्षय में निमित्त",
    mantra: "ॐ ह्रीं श्री अनन्तनाथाय नमः", stotra: "Ananta Jinastavan"
  },
  {
    id: 15, name: "Dharmanatha", hindi_name: "धर्मनाथ",
    father: "Bhanu", mother: "Suvrata", birth_place: "रत्नपुरी",
    birth_nakshatra: "Uttara Bhadrapada", birth_rashi: "Meena (Pisces)",
    birth_tithi: "Margashirsha Shukla 3", nirvana_place: "शिखरजी",
    varna: "Golden", hindi_varna: "सुवर्ण",
    symbol: "Vajra", hindi_symbol: "वज्र",
    height: "135 मीटर (45 धनुष)", lifespan: "10 लाख वर्ष",
    yaksha: "Kinnara", yakshini: "Kandarpa",
    tree: "Dadhiparna", karma_addressed: "Charitra Mohaniya",
    puja_benefit: "धर्म में स्थिरता, चारित्र मोहनीय कर्म की निर्जरा में सहायक",
    mantra: "ॐ ह्रीं श्री धर्मनाथाय नमः", stotra: "Dharmanath Jinastavan"
  },
  {
    id: 16, name: "Shantinatha", hindi_name: "शान्तिनाथ",
    father: "Vishvasena", mother: "Achira", birth_place: "हस्तिनापुर",
    birth_nakshatra: "Bharani", birth_rashi: "Mesha (Aries)",
    birth_tithi: "Jyeshtha Krishna 14", nirvana_place: "शिखरजी",
    varna: "Golden", hindi_varna: "सुवर्ण",
    symbol: "Deer", hindi_symbol: "हिरण (मृग)",
    height: "120 मीटर (40 धनुष)", lifespan: "1 लाख वर्ष",
    yaksha: "Garuda", yakshini: "Nirvani",
    tree: "Nandi", karma_addressed: "Mohaniya (krodha shaman)",
    puja_benefit: "क्रोध कषाय का उपशम, आत्मा में शांति स्वरूप की जागृति",
    mantra: "ॐ ह्रीं श्री शान्तिनाथाय नमः", stotra: "Shantinath Stavana",
    notes: "चक्रवर्ती सम्राट भी। पारिवारिक शांति और कानूनी विवादों के लिए विशेष पूजनीय।"
  },
  {
    id: 17, name: "Kunthunatha", hindi_name: "कुन्थुनाथ",
    father: "Suraraja", mother: "Shridevi", birth_place: "हस्तिनापुर",
    birth_nakshatra: "Ashvini", birth_rashi: "Mesha (Aries)",
    birth_tithi: "Vaishakha Shukla 14", nirvana_place: "शिखरजी",
    varna: "Golden", hindi_varna: "सुवर्ण",
    symbol: "Goat", hindi_symbol: "बकरा (अज)",
    height: "105 मीटर (35 धनुष)", lifespan: "95,000 वर्ष",
    yaksha: "Gandharva", yakshini: "Bala",
    tree: "Vata", karma_addressed: "Gyanavaraniya",
    puja_benefit: "सूक्ष्म ज्ञान की प्राप्ति, अज्ञानता का शमन",
    mantra: "ॐ ह्रीं श्री कुन्थुनाथाय नमः", stotra: "Kunthunath Jinastavan"
  },
  {
    id: 18, name: "Aranatha", hindi_name: "अरनाथ",
    father: "Sudarshana", mother: "Devi", birth_place: "हस्तिनापुर",
    birth_nakshatra: "Uttara Ashadha", birth_rashi: "Makara (Capricorn)",
    birth_tithi: "Margashirsha Shukla 10", nirvana_place: "शिखरजी",
    varna: "Golden", hindi_varna: "सुवर्ण",
    symbol: "Fish", hindi_symbol: "मछली (मत्स्य)",
    height: "90 मीटर (30 धनुष)", lifespan: "84,000 वर्ष",
    yaksha: "Yaksheta", yakshini: "Dhana",
    tree: "Amba (Mango)", karma_addressed: "Ayushya karma",
    puja_benefit: "आयुष्य कर्म के उदय में समभाव, संयमपूर्ण जीवन की प्रेरणा",
    mantra: "ॐ ह्रीं श्री अरनाथाय नमः", stotra: "Aranath Jinastavan"
  },
  {
    id: 19, name: "Mallinatha", hindi_name: "मल्लिनाथ",
    father: "Kumbharaja", mother: "Prabhavati", birth_place: "मिथिला",
    birth_nakshatra: "Purva Ashadha", birth_rashi: "Dhanu (Sagittarius)",
    birth_tithi: "Margashirsha Shukla 11", nirvana_place: "शिखरजी",
    varna: "Blue", hindi_varna: "नील (नीला)",
    symbol: "Kalasha", hindi_symbol: "कलश",
    height: "75 मीटर (25 धनुष)", lifespan: "55,000 वर्ष",
    yaksha: "Kubera", yakshini: "Dharanapriya",
    tree: "Ashoka", karma_addressed: "Gotra karma",
    puja_benefit: "नीच गोत्र कर्म की निर्जरा, मान कषाय का शमन",
    mantra: "ॐ ह्रीं श्री मल्लिनाथाय नमः", stotra: "Mallinath Jinastavan",
    notes: "दिगम्बर परंपरा: मल्लिनाथ पुरुष हैं (श्वेताम्बर से भिन्न)।"
  },
  {
    id: 20, name: "Munisuvrata", hindi_name: "मुनिसुव्रत",
    father: "Sumitraraja", mother: "Padmavati", birth_place: "राजगृह",
    birth_nakshatra: "Shravana", birth_rashi: "Makara (Capricorn)",
    birth_tithi: "Vaishakha Krishna 8", nirvana_place: "शिखरजी",
    varna: "Black", hindi_varna: "श्याम (काला)",
    symbol: "Tortoise", hindi_symbol: "कछुआ (कूर्म)",
    height: "60 मीटर (20 धनुष)", lifespan: "30,000 वर्ष",
    yaksha: "Varuna", yakshini: "Naradatta",
    tree: "Champaka", karma_addressed: "Charitra Mohaniya",
    puja_benefit: "इंद्रिय निग्रह की शक्ति, चारित्र मोहनीय कर्म के शमन में निमित्त",
    mantra: "ॐ ह्रीं श्री मुनिसुव्रताय नमः", stotra: "Munisuvrata Jinastavan"
  },
  {
    id: 21, name: "Naminatha", hindi_name: "नमिनाथ",
    father: "Vijayaraja", mother: "Vapra", birth_place: "मिथिला",
    birth_nakshatra: "Ashvini", birth_rashi: "Mesha (Aries)",
    birth_tithi: "Shravana Krishna 8", nirvana_place: "शिखरजी (सम्मेद शिखर)",
    varna: "Golden", hindi_varna: "सुवर्ण",
    symbol: "Blue Water Lily", hindi_symbol: "नीलकमल",
    height: "45 मीटर (15 धनुष)", lifespan: "10,000 वर्ष",
    yaksha: "Bhrikuti", yakshini: "Gandhari",
    tree: "Bakula", karma_addressed: "Darshanavaraniya",
    puja_benefit: "माया कषाय का नाश, सम्यक् दर्शन की उत्पत्ति हेतु निमित्त",
    mantra: "ॐ ह्रीं श्री नमिनाथाय नमः", stotra: "Naminath Jinastavan"
  },
  {
    id: 22, name: "Neminatha", hindi_name: "नेमिनाथ", aka: "Aristanemi",
    father: "Samudravijaya", mother: "Shivadevi", birth_place: "सौरिपुर (द्वारका)",
    birth_nakshatra: "Chitra", birth_rashi: "Kanya / Tula",
    birth_tithi: "Shravana Krishna 5", nirvana_place: "गिरनार (उज्जयंत पर्वत)",
    varna: "Black", hindi_varna: "श्याम (काला)",
    symbol: "Conch", hindi_symbol: "शंख",
    height: "30 मीटर (10 धनुष)", lifespan: "1,000 वर्ष",
    yaksha: "Gomedha", yakshini: "Ambika",
    tree: "Vetasa", karma_addressed: "Mohaniya (vairagya)",
    puja_benefit: "प्राणी मात्र पर दया भाव, राग-द्वेष का शमन, वैराग्य की दृढ़ता",
    mantra: "ॐ ह्रीं श्री नेमिनाथाय नमः", stotra: "Neminath Jinastavan",
    notes: "कृष्ण के चचेरे भाई। अपने विवाह पर ही त्याग किया। पशु कल्याण के संरक्षक।"
  },
  {
    id: 23, name: "Parshvanatha", hindi_name: "पार्श्वनाथ",
    father: "Ashvasena", mother: "Vama Devi", birth_place: "वाराणसी (काशी)",
    birth_nakshatra: "Vishakha", birth_rashi: "Tula (Libra)",
    birth_tithi: "Paush Krishna 10", nirvana_place: "शिखरजी (सम्मेद शिखर)",
    varna: "Green", hindi_varna: "हरित (हरा)",
    symbol: "Serpent", hindi_symbol: "नाग (साँप)",
    height: "4.1 मीटर (9 हाथ)", lifespan: "100 वर्ष",
    yaksha: "Dharanendra", yakshini: "Padmavati",
    tree: "Dhataki", karma_addressed: "सभी 4 घाति कर्म, विशेषतः मोहनीय",
    puja_benefit: "उपसर्गों में समता धारण करने की शक्ति, मोहनीय कर्म की तीव्र निर्जरा",
    mantra: "ॐ ह्रीं श्री पार्श्वनाथाय नमः", stotra: "Parshvanath Stavana, Parshvanath Ashtaka",
    notes: "23वें तीर्थंकर। ऐतिहासिक व्यक्तित्व ~872–772 ई.पू.। महावीर के बाद सर्वाधिक पूजनीय।"
  },
  {
    id: 24, name: "Mahavira", hindi_name: "महावीर स्वामी", aka: "Vardhamana, Vira, Ativira",
    father: "Siddhartha Raja", mother: "Trishala Devi",
    birth_place: "क्षत्रियकुण्ड (वैशाली, बिहार)",
    birth_nakshatra: "Uttara Phalguni", birth_rashi: "Kanya (Virgo)",
    birth_tithi: "Chaitra Shukla 13", nirvana_place: "पावापुरी (बिहार)",
    varna: "Golden", hindi_varna: "सुवर्ण (पीतांबर)",
    symbol: "Lion", hindi_symbol: "सिंह",
    height: "1.8 मीटर (2 हाथ — सामान्य मानव)", lifespan: "72 वर्ष",
    yaksha: "Matanga", yakshini: "Siddhayika",
    tree: "Teak", karma_addressed: "सभी 8 कर्म — सर्व कर्म विजेता",
    puja_benefit: "सर्व कर्मों की निर्जरा, मोक्ष मार्ग में अप्रतिहत गति हेतु निमित्त",
    mantra: "ॐ ह्रीं श्री महावीर स्वामिने नमः",
    stotra: "Mahavira Stavana, Uvasagharam Stotra",
    notes: "24वें और अंतिम तीर्थंकर। उनके निर्वाण के 3 वर्ष 8.5 माह बाद पंचम काल (5वाँ अरा) प्रारंभ हुआ।"
  }
];

export function getTirthankaraByNakshatra(nakshatra: string): Tirthankara[] {
  return TIRTHANKARAS.filter(t =>
    t.birth_nakshatra.toLowerCase().replace(/\s+/g, ' ') === nakshatra.toLowerCase().replace(/\s+/g, ' ')
  );
}
