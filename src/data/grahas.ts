export interface Graha {
  id: number;
  name: string;
  hindi_name: string;
  color: string;
  nature: 'shubha' | 'ashubha' | 'mishra' | 'chaya';
  vimshottari_years: number;
  speed_description: string;
  jyotishi_dev_type: string;
  karma_connection: string;
  sadhana: string;
  jain_description?: string;
}

export const GRAHAS: Graha[] = [
  {
    id: 1,
    name: "Ketu",
    hindi_name: "केतु",
    color: "धूम्र-पांडु (Ashen-white)",
    nature: "ashubha",
    vimshottari_years: 7,
    speed_description: "राहु के विपरीत — सदा 180° के अंतर पर",
    jyotishi_dev_type: "छाया ग्रह (Shadow body — Jyotishi Dev नहीं)",
    karma_connection: "पूर्वजन्म के संचित कर्मों का अकस्मात उदय",
    sadhana: "नवकार मंत्र का 108 बार जाप, वैराग्य भावना",
    jain_description: "जैन ज्योतिष में केतु धूमकेतु जैसा पिंड है। अकस्मात घटनाएँ और पूर्वजन्म के कर्म का उदय इसकी पहचान है।"
  },
  {
    id: 2,
    name: "Shukra",
    hindi_name: "शुक्र",
    color: "श्वेत-धवल (White)",
    nature: "shubha",
    vimshottari_years: 20,
    speed_description: "शीघ्र गति — सूर्य के पीछे, ~225 दिन का चक्र",
    jyotishi_dev_type: "तारग्रह (Jyotishi Dev)",
    karma_connection: "वेदनीय कर्म (सुख-वेदना) — भौतिक सुख और आसक्ति",
    sadhana: "उत्तम त्याग भावना, परिग्रह का संयम"
  },
  {
    id: 3,
    name: "Surya",
    hindi_name: "सूर्य",
    color: "स्वर्णिम-ताम्र (Golden-Copper)",
    nature: "mishra",
    vimshottari_years: 6,
    speed_description: "मध्यम गति — वार्षिक नक्षत्र भ्रमण, 365 दिन",
    jyotishi_dev_type: "ज्योतिषी देव (Surya Dev — principal Jyotishi Dev)",
    karma_connection: "दर्शनावरणीय कर्म — आत्म-साक्षात्कार और आत्मबल",
    sadhana: "सूर्योदय पूर्व जागरण, देव-दर्शन, णमोकार स्मरण"
  },
  {
    id: 4,
    name: "Chandra",
    hindi_name: "चन्द्र",
    color: "श्वेत-रजत (Silver-White)",
    nature: "shubha",
    vimshottari_years: 10,
    speed_description: "शीघ्रतम गति — 27.3 दिन में सम्पूर्ण नक्षत्र चक्र",
    jyotishi_dev_type: "ज्योतिषी देव (Chandra Dev — नक्षत्रों का अधिपति)",
    karma_connection: "मोहनीय कर्म (स्नेह-मोह) — भावनात्मक आसक्ति",
    sadhana: "एकासन, एकादशी व्रत, भक्तामर स्तोत्र"
  },
  {
    id: 5,
    name: "Mangal",
    hindi_name: "मंगल",
    color: "रक्त (Red)",
    nature: "ashubha",
    vimshottari_years: 7,
    speed_description: "मध्यम गति — नक्षत्र चक्र लगभग 687 दिन",
    jyotishi_dev_type: "तारग्रह (Jyotishi Dev)",
    karma_connection: "अंतराय कर्म — क्रोध और बाधाएँ",
    sadhana: "उत्तम क्षमा भावना, क्षमापना, 9 बार णमोकार",
    jain_description: "जैन ज्योतिष में मंगल 80 योजन ऊपर स्थित है। इसकी रक्त वर्ण और त्रिकोण आकृति अंतराय-कर्म से जुड़ी है।"
  },
  {
    id: 6,
    name: "Rahu",
    hindi_name: "राहु",
    color: "धूम्र-श्याम (Smoky-dark)",
    nature: "chaya",
    vimshottari_years: 18,
    speed_description: "वक्री गति — अन्य ग्रहों के विपरीत दिशा में, 18 वर्ष का चक्र",
    jyotishi_dev_type: "छाया ग्रह (Shadow body — Jyotishi Dev नहीं)",
    karma_connection: "ज्ञानावरणीय कर्म — भ्रम, भटकाव, और भ्रांत धारणाएँ",
    sadhana: "सम्यक्दर्शन की साधना, तत्त्वार्थसूत्र श्रवण",
    jain_description: "जैन ग्रंथों (चंद्रप्रज्ञप्ति) में राहु चंद्रमा को ग्रहण लगाता है। यह एक विशाल अंधकारमय पिंड है — ज्योतिषी देव नहीं।"
  },
  {
    id: 7,
    name: "Guru",
    hindi_name: "गुरु",
    color: "पीत (Yellow)",
    nature: "shubha",
    vimshottari_years: 16,
    speed_description: "मंद गति — 12 वर्ष का नक्षत्र चक्र",
    jyotishi_dev_type: "तारग्रह (Jyotishi Dev)",
    karma_connection: "ज्ञानावरणीय कर्म निर्जरा — गुरु दीक्षा और शास्त्र ज्ञान",
    sadhana: "गुरु-वंदना, शास्त्र-श्रवण, स्वाध्याय"
  },
  {
    id: 8,
    name: "Shani",
    hindi_name: "शनि",
    color: "कृष्ण-नील (Black-Blue)",
    nature: "ashubha",
    vimshottari_years: 19,
    speed_description: "अति-मंद गति — सबसे धीमा, ~30 वर्ष का चक्र",
    jyotishi_dev_type: "तारग्रह (Jyotishi Dev)",
    karma_connection: "गोत्र और आयुष्य कर्म — कर्मफल और कर्म-बंधन",
    sadhana: "तप, परीषह-सहन, कर्म-झड़ाने की भावना",
    jain_description: "जैन ज्योतिष में शनि सर्वोच्च तारग्रह है — 800 योजन ऊपर। मंद गति के कारण दीर्घकालिक कर्म-फल का सूचक।"
  },
  {
    id: 9,
    name: "Budha",
    hindi_name: "बुध",
    color: "हरित-पीत (Green-Yellow)",
    nature: "mishra",
    vimshottari_years: 17,
    speed_description: "शीघ्र गति — सूर्य के निकट, ~88 दिन का चक्र",
    jyotishi_dev_type: "तारग्रह (Jyotishi Dev)",
    karma_connection: "ज्ञानावरणीय कर्म (मति-ज्ञान) — विवेक और तर्कशक्ति",
    sadhana: "स्वाध्याय, प्रतिक्रमण, सत्य-वचन का अभ्यास"
  }
];

export const VIMSHOTTARI_ORDER = ['Ketu', 'Shukra', 'Surya', 'Chandra', 'Mangal', 'Rahu', 'Guru', 'Shani', 'Budha'];
export const VIMSHOTTARI_YEARS: Record<string, number> = {
  Ketu: 7, Shukra: 20, Surya: 6, Chandra: 10, Mangal: 7, Rahu: 18, Guru: 16, Shani: 19, Budha: 17
};
export const VIMSHOTTARI_HINDI: Record<string, string> = {
  Ketu: 'केतु', Shukra: 'शुक्र', Surya: 'सूर्य', Chandra: 'चन्द्र',
  Mangal: 'मंगल', Rahu: 'राहु', Guru: 'गुरु', Shani: 'शनि', Budha: 'बुध'
};
