export interface Ara {
  id: number;
  name: string;
  hindi_name: string;
  aka: string;
  nature: 'param_shubh' | 'shubh' | 'mishra_shubh' | 'mishra_ashubh' | 'ashubh' | 'param_ashubh';
  duration: string;
  max_lifespan_description: string;
  height_description: string;
  food_interval: string;
  moral_quality: string;
  spiritual_potential: string;
  tirthankaras_born: number;
  tirthankaras_detail?: string;
  sadhana_note?: string;
  current_ara?: boolean;
  notes: string;
}

export const ARAS: Ara[] = [
  {
    id: 1,
    name: "Susham-Susham",
    hindi_name: "सुषम-सुषम",
    aka: "Sushama Sushama — Age of Supreme Happiness",
    nature: "param_shubh",
    duration: "4 करोड़ करोड़ सागरोपम",
    max_lifespan_description: "3 पल्योपम वर्ष — तीन पल्योपम तक जीवित रहते थे",
    height_description: "6 कोस (लगभग 6 मील) — छह मील की ऊँचाई",
    food_interval: "हर चौथे दिन (कल्पवृक्ष सब कुछ देते थे)",
    moral_quality: "क्रोध, मान, माया, लोभ से पूर्णतः रहित",
    spiritual_potential: "शून्य — धर्म और त्याग की आवश्यकता नहीं",
    tirthankaras_born: 0,
    notes: "परम सुख का युग। कोई दुःख, बीमारी, या पाप नहीं। मोक्ष की ज़रूरत feel नहीं होती।"
  },
  {
    id: 2,
    name: "Susham",
    hindi_name: "सुषम",
    aka: "Sushama — Age of Happiness",
    nature: "shubh",
    duration: "3 करोड़ करोड़ सागरोपम",
    max_lifespan_description: "2 पल्योपम वर्ष",
    height_description: "4 कोस (लगभग 4 मील)",
    food_interval: "हर तीसरे दिन",
    moral_quality: "प्रधानतः सुख, बहुत थोड़ा दुःख",
    spiritual_potential: "नगण्य — अभी भी सुख चक्र",
    tirthankaras_born: 0,
    notes: "थोड़ा कम सुख, थोड़ी सी कमी शुरू। फिर भी बहुत अच्छा युग।"
  },
  {
    id: 3,
    name: "Susham-Dusham",
    hindi_name: "सुषम-दुःषम",
    aka: "Sushama Dushama — Age of More Happiness than Sorrow",
    nature: "mishra_shubh",
    duration: "2 करोड़ करोड़ सागरोपम",
    max_lifespan_description: "1 पल्योपम वर्ष",
    height_description: "2 कोस (लगभग 2 मील)",
    food_interval: "हर दूसरे दिन",
    moral_quality: "सुख दुःख से अधिक",
    spiritual_potential: "कम — युग के अंत में ऋषभदेव का जन्म और प्रथम धर्म",
    tirthankaras_born: 1,
    tirthankaras_detail: "ऋषभदेव (प्रथम तीर्थंकर) इस अरे के अंत में जन्मे। उन्होंने खेती, वाणिज्य, कला और पहली सामाजिक व्यवस्था की स्थापना की।",
    notes: "इस युग के अंत में पहले तीर्थंकर ऋषभदेव का जन्म हुआ और उन्होंने मानव सभ्यता की नींव रखी।"
  },
  {
    id: 4,
    name: "Dusham-Susham",
    hindi_name: "दुःषम-सुषम",
    aka: "Dushama Sushama — Age of More Sorrow than Happiness",
    nature: "mishra_ashubh",
    duration: "1 करोड़ करोड़ सागरोपम (minus 42,000 वर्ष)",
    max_lifespan_description: "1 करोड़ पूर्व से घटते हुए 1 लाख पूर्व तक",
    height_description: "500 धनुष से घटते हुए 7 हाथ तक",
    food_interval: "प्रतिदिन",
    moral_quality: "मिश्रित — धर्म, त्याग, और मोक्ष सब संभव",
    spiritual_potential: "सर्वोच्च — शेष 23 तीर्थंकर इसी अरे में जन्मे",
    tirthankaras_born: 23,
    tirthankaras_detail: "तीर्थंकर 2 से 24 (अजितनाथ से महावीर) सभी इसी अरे में जन्मे। चक्रवर्ती, बलभद्र, और नारायण भी इसी में प्रकट हुए।",
    notes: "धर्म का स्वर्णिम युग। सारे तीर्थंकर, चक्रवर्ती इस युग में प्रकट हुए। मोक्ष सबसे सुलभ था।"
  },
  {
    id: 5,
    name: "Dusham",
    hindi_name: "दुःषम",
    aka: "Dushama — Age of Sorrow (Pancham Kaal)",
    nature: "ashubh",
    duration: "21,000 वर्ष (लगभग 525 ईसापूर्व से प्रारंभ, ~20,476 ई. में समाप्त)",
    max_lifespan_description: "अधिकतम 125 वर्ष — इस अरे के अंत में 20 वर्ष तक घट जाएगी",
    height_description: "लगभग 6 फीट — सामान्य मानव ऊँचाई",
    food_interval: "दिन में कई बार",
    moral_quality: "प्रधानतः दुःख, नैतिक पतन",
    spiritual_potential: "इस अरे में मोक्ष संभव नहीं। परंतु सम्यक्दर्शन, पुण्यबंध, और देव-गति प्राप्ति साधना से संभव है।",
    tirthankaras_born: 0,
    tirthankaras_detail: "कोई तीर्थंकर, चक्रवर्ती, या बलभद्र नहीं। अरे के अंत तक जैन धर्म भी लुप्त हो जाएगा।",
    sadhana_note: "इस अरे में भी: सम्यक्दर्शन प्राप्य है। देव-गति प्राप्य है। अगले अनुकूल जन्म के लिए उच्च पुण्य संभव है।",
    current_ara: true,
    notes: "हम अभी इस युग में हैं। मोक्ष नहीं, लेकिन सम्यक्दर्शन, पुण्यबंध, और देव-गति प्राप्त करना संभव है। साधना का बहुत महत्व है।"
  },
  {
    id: 6,
    name: "Dusham-Dusham",
    hindi_name: "दुःषम-दुःषम",
    aka: "Dushama Dushama — Age of Extreme Suffering",
    nature: "param_ashubh",
    duration: "21,000 वर्ष",
    max_lifespan_description: "केवल 16 से 20 वर्ष — अत्यंत अल्प आयु",
    height_description: "1 हाथ (लगभग 18 इंच) — बौनी काया",
    food_interval: "दिन में कई बार — अभावग्रस्त भोजन",
    moral_quality: "अत्यंत दुःख, कोई धर्म नहीं, संपूर्ण नैतिक पतन",
    spiritual_potential: "शून्य — कोई धर्म नहीं, कोई साधना संभव नहीं",
    tirthankaras_born: 0,
    notes: "सबसे बुरा युग। जैन धर्म बिल्कुल नहीं रहेगा। भयंकर कष्ट। हमारे लिए इस युग की कोई चिंता नहीं — हम 5वें अरे में हैं।"
  }
];

export const CURRENT_ARA = ARAS[4]; // Dusham (Pancham Kaal)
