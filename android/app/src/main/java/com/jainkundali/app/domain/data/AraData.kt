package com.jainkundali.app.domain.data

import com.jainkundali.app.domain.models.Ara

val ARAS: List<Ara> = listOf(
    Ara(
        id = 1, name = "Susham-Susham", hindiName = "सुषम-सुषम",
        aka = "Sushama Sushama — Age of Supreme Happiness",
        nature = "param_shubh",
        duration = "4 करोड़ करोड़ सागरोपम",
        maxLifespanDescription = "3 पल्योपम वर्ष — तीन पल्योपम तक जीवित रहते थे",
        heightDescription = "6 कोस (लगभग 6 मील) — छह मील की ऊँचाई",
        foodInterval = "हर चौथे दिन (कल्पवृक्ष सब कुछ देते थे)",
        moralQuality = "क्रोध, मान, माया, लोभ से पूर्णतः रहित",
        spiritualPotential = "शून्य — धर्म और त्याग की आवश्यकता नहीं",
        tirthankarasBorn = 0,
        tirthankarasDetail = null,
        sadhanaNote = null,
        currentAra = false,
        notes = "परम सुख का युग। कोई दुःख, बीमारी, या पाप नहीं। मोक्ष की ज़रूरत feel नहीं होती।"
    ),
    Ara(
        id = 2, name = "Susham", hindiName = "सुषम",
        aka = "Sushama — Age of Happiness",
        nature = "shubh",
        duration = "3 करोड़ करोड़ सागरोपम",
        maxLifespanDescription = "2 पल्योपम वर्ष",
        heightDescription = "4 कोस (लगभग 4 मील)",
        foodInterval = "हर तीसरे दिन",
        moralQuality = "प्रधानतः सुख, बहुत थोड़ा दुःख",
        spiritualPotential = "नगण्य — अभी भी सुख चक्र",
        tirthankarasBorn = 0,
        tirthankarasDetail = null,
        sadhanaNote = null,
        currentAra = false,
        notes = "थोड़ा कम सुख, थोड़ी सी कमी शुरू। फिर भी बहुत अच्छा युग।"
    ),
    Ara(
        id = 3, name = "Susham-Dusham", hindiName = "सुषम-दुःषम",
        aka = "Sushama Dushama — Age of More Happiness than Sorrow",
        nature = "mishra_shubh",
        duration = "2 करोड़ करोड़ सागरोपम",
        maxLifespanDescription = "1 पल्योपम वर्ष",
        heightDescription = "2 कोस (लगभग 2 मील)",
        foodInterval = "हर दूसरे दिन",
        moralQuality = "सुख दुःख से अधिक",
        spiritualPotential = "कम — युग के अंत में ऋषभदेव का जन्म और प्रथम धर्म",
        tirthankarasBorn = 1,
        tirthankarasDetail = "ऋषभदेव (प्रथम तीर्थंकर) इस अरे के अंत में जन्मे। उन्होंने खेती, वाणिज्य, कला और पहली सामाजिक व्यवस्था की स्थापना की।",
        sadhanaNote = null,
        currentAra = false,
        notes = "इस युग के अंत में पहले तीर्थंकर ऋषभदेव का जन्म हुआ और उन्होंने मानव सभ्यता की नींव रखी।"
    ),
    Ara(
        id = 4, name = "Dusham-Susham", hindiName = "दुःषम-सुषम",
        aka = "Dushama Sushama — Age of More Sorrow than Happiness",
        nature = "mishra_ashubh",
        duration = "1 करोड़ करोड़ सागरोपम (minus 42,000 वर्ष)",
        maxLifespanDescription = "1 करोड़ पूर्व से घटते हुए 1 लाख पूर्व तक",
        heightDescription = "500 धनुष से घटते हुए 7 हाथ तक",
        foodInterval = "प्रतिदिन",
        moralQuality = "मिश्रित — धर्म, त्याग, और मोक्ष सब संभव",
        spiritualPotential = "सर्वोच्च — शेष 23 तीर्थंकर इसी अरे में जन्मे",
        tirthankarasBorn = 23,
        tirthankarasDetail = "तीर्थंकर 2 से 24 (अजितनाथ से महावीर) सभी इसी अरे में जन्मे। चक्रवर्ती, बलभद्र, और नारायण भी इसी में प्रकट हुए।",
        sadhanaNote = null,
        currentAra = false,
        notes = "धर्म का स्वर्णिम युग। सारे तीर्थंकर, चक्रवर्ती इस युग में प्रकट हुए। मोक्ष सबसे सुलभ था।"
    ),
    Ara(
        id = 5, name = "Dusham", hindiName = "दुःषम",
        aka = "Dushama — Age of Sorrow (Pancham Kaal)",
        nature = "ashubh",
        duration = "21,000 वर्ष (लगभग 525 ईसापूर्व से प्रारंभ, ~20,476 ई. में समाप्त)",
        maxLifespanDescription = "अधिकतम 125 वर्ष — इस अरे के अंत में 20 वर्ष तक घट जाएगी",
        heightDescription = "लगभग 6 फीट — सामान्य मानव ऊँचाई",
        foodInterval = "दिन में कई बार",
        moralQuality = "प्रधानतः दुःख, नैतिक पतन",
        spiritualPotential = "इस अरे में मोक्ष संभव नहीं। परंतु सम्यक्दर्शन, पुण्यबंध, और देव-गति प्राप्ति साधना से संभव है।",
        tirthankarasBorn = 0,
        tirthankarasDetail = "कोई तीर्थंकर, चक्रवर्ती, या बलभद्र नहीं। अरे के अंत तक जैन धर्म भी लुप्त हो जाएगा।",
        sadhanaNote = "इस अरे में भी: सम्यक्दर्शन प्राप्य है। देव-गति प्राप्य है। अगले अनुकूल जन्म के लिए उच्च पुण्य संभव है।",
        currentAra = true,
        notes = "हम अभी इस युग में हैं। मोक्ष नहीं, लेकिन सम्यक्दर्शन, पुण्यबंध, और देव-गति प्राप्त करना संभव है। साधना का बहुत महत्व है।"
    ),
    Ara(
        id = 6, name = "Dusham-Dusham", hindiName = "दुःषम-दुःषम",
        aka = "Dushama Dushama — Age of Extreme Suffering",
        nature = "param_ashubh",
        duration = "21,000 वर्ष",
        maxLifespanDescription = "केवल 16 से 20 वर्ष — अत्यंत अल्प आयु",
        heightDescription = "1 हाथ (लगभग 18 इंच) — बौनी काया",
        foodInterval = "दिन में कई बार — अभावग्रस्त भोजन",
        moralQuality = "अत्यंत दुःख, कोई धर्म नहीं, संपूर्ण नैतिक पतन",
        spiritualPotential = "शून्य — कोई धर्म नहीं, कोई साधना संभव नहीं",
        tirthankarasBorn = 0,
        tirthankarasDetail = null,
        sadhanaNote = null,
        currentAra = false,
        notes = "सबसे बुरा युग। जैन धर्म बिल्कुल नहीं रहेगा। भयंकर कष्ट। हमारे लिए इस युग की कोई चिंता नहीं — हम 5वें अरे में हैं।"
    ),
)

val CURRENT_ARA: Ara = ARAS[4] // Dusham (Pancham Kaal)