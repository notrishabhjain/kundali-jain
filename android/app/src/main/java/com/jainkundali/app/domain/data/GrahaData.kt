package com.jainkundali.app.domain.data

import com.jainkundali.app.domain.models.Graha

val GRAHAS: List<Graha> = listOf(
    Graha(
        id = 1, name = "Ketu", hindiName = "केतु",
        color = "धूम्र-पांडु (Ashen-white)", nature = "ashubha",
        vimshottariYears = 7,
        speedDescription = "राहु के विपरीत — सदा 180° के अंतर पर",
        jyotishiDevType = "छाया ग्रह (Shadow body — Jyotishi Dev नहीं)",
        karmaConnection = "पूर्वजन्म के संचित कर्मों का अकस्मात उदय",
        sadhana = "नवकार मंत्र का 108 बार जाप, वैराग्य भावना",
        jainDescription = "जैन ज्योतिष में केतु धूमकेतु जैसा पिंड है। अकस्मात घटनाएँ और पूर्वजन्म के कर्म का उदय इसकी पहचान है।"
    ),
    Graha(
        id = 2, name = "Shukra", hindiName = "शुक्र",
        color = "श्वेत-धवल (White)", nature = "shubha",
        vimshottariYears = 20,
        speedDescription = "शीघ्र गति — सूर्य के पीछे, ~225 दिन का चक्र",
        jyotishiDevType = "तारग्रह (Jyotishi Dev)",
        karmaConnection = "वेदनीय कर्म (सुख-वेदना) — भौतिक सुख और आसक्ति",
        sadhana = "उत्तम त्याग भावना, परिग्रह का संयम",
        jainDescription = null
    ),
    Graha(
        id = 3, name = "Surya", hindiName = "सूर्य",
        color = "स्वर्णिम-ताम्र (Golden-Copper)", nature = "mishra",
        vimshottariYears = 6,
        speedDescription = "मध्यम गति — वार्षिक नक्षत्र भ्रमण, 365 दिन",
        jyotishiDevType = "ज्योतिषी देव (Surya Dev — principal Jyotishi Dev)",
        karmaConnection = "दर्शनावरणीय कर्म — आत्म-साक्षात्कार और आत्मबल",
        sadhana = "सूर्योदय पूर्व जागरण, देव-दर्शन, णमोकार स्मरण",
        jainDescription = null
    ),
    Graha(
        id = 4, name = "Chandra", hindiName = "चन्द्र",
        color = "श्वेत-रजत (Silver-White)", nature = "shubha",
        vimshottariYears = 10,
        speedDescription = "शीघ्रतम गति — 27.3 दिन में सम्पूर्ण नक्षत्र चक्र",
        jyotishiDevType = "ज्योतिषी देव (Chandra Dev — नक्षत्रों का अधिपति)",
        karmaConnection = "मोहनीय कर्म (स्नेह-मोह) — भावनात्मक आसक्ति",
        sadhana = "एकासन, एकादशी व्रत, भक्तामर स्तोत्र",
        jainDescription = null
    ),
    Graha(
        id = 5, name = "Mangal", hindiName = "मंगल",
        color = "रक्त (Red)", nature = "ashubha",
        vimshottariYears = 7,
        speedDescription = "मध्यम गति — नक्षत्र चक्र लगभग 687 दिन",
        jyotishiDevType = "तारग्रह (Jyotishi Dev)",
        karmaConnection = "अंतराय कर्म — क्रोध और बाधाएँ",
        sadhana = "उत्तम क्षमा भावना, क्षमापना, 9 बार णमोकार",
        jainDescription = "जैन ज्योतिष में मंगल 80 योजन ऊपर स्थित है। इसकी रक्त वर्ण और त्रिकोण आकृति अंतराय-कर्म से जुड़ी है।"
    ),
    Graha(
        id = 6, name = "Rahu", hindiName = "राहु",
        color = "धूम्र-श्याम (Smoky-dark)", nature = "chaya",
        vimshottariYears = 18,
        speedDescription = "वक्री गति — अन्य ग्रहों के विपरीत दिशा में, 18 वर्ष का चक्र",
        jyotishiDevType = "छाया ग्रह (Shadow body — Jyotishi Dev नहीं)",
        karmaConnection = "ज्ञानावरणीय कर्म — भ्रम, भटकाव, और भ्रांत धारणाएँ",
        sadhana = "सम्यक्दर्शन की साधना, तत्त्वार्थसूत्र श्रवण",
        jainDescription = "जैन ग्रंथों (चंद्रप्रज्ञप्ति) में राहु चंद्रमा को ग्रहण लगाता है। यह एक विशाल अंधकारमय पिंड है — ज्योतिषी देव नहीं।"
    ),
    Graha(
        id = 7, name = "Guru", hindiName = "गुरु",
        color = "पीत (Yellow)", nature = "shubha",
        vimshottariYears = 16,
        speedDescription = "मंद गति — 12 वर्ष का नक्षत्र चक्र",
        jyotishiDevType = "तारग्रह (Jyotishi Dev)",
        karmaConnection = "ज्ञानावरणीय कर्म निर्जरा — गुरु दीक्षा और शास्त्र ज्ञान",
        sadhana = "गुरु-वंदना, शास्त्र-श्रवण, स्वाध्याय",
        jainDescription = null
    ),
    Graha(
        id = 8, name = "Shani", hindiName = "शनि",
        color = "कृष्ण-नील (Black-Blue)", nature = "ashubha",
        vimshottariYears = 19,
        speedDescription = "अति-मंद गति — सबसे धीमा, ~30 वर्ष का चक्र",
        jyotishiDevType = "तारग्रह (Jyotishi Dev)",
        karmaConnection = "गोत्र और आयुष्य कर्म — कर्मफल और कर्म-बंधन",
        sadhana = "तप, परीषह-सहन, कर्म-झड़ाने की भावना",
        jainDescription = "जैन ज्योतिष में शनि सर्वोच्च तारग्रह है — 800 योजन ऊपर। मंद गति के कारण दीर्घकालिक कर्म-फल का सूचक।"
    ),
    Graha(
        id = 9, name = "Budha", hindiName = "बुध",
        color = "हरित-पीत (Green-Yellow)", nature = "mishra",
        vimshottariYears = 17,
        speedDescription = "शीघ्र गति — सूर्य के निकट, ~88 दिन का चक्र",
        jyotishiDevType = "तारग्रह (Jyotishi Dev)",
        karmaConnection = "ज्ञानावरणीय कर्म (मति-ज्ञान) — विवेक और तर्कशक्ति",
        sadhana = "स्वाध्याय, प्रतिक्रमण, सत्य-वचन का अभ्यास",
        jainDescription = null
    ),
)

val VIMSHOTTARI_ORDER: List<String> = listOf(
    "Ketu", "Shukra", "Surya", "Chandra", "Mangal", "Rahu", "Guru", "Shani", "Budha"
)

val VIMSHOTTARI_YEARS: Map<String, Int> = mapOf(
    "Ketu" to 7, "Shukra" to 20, "Surya" to 6, "Chandra" to 10,
    "Mangal" to 7, "Rahu" to 18, "Guru" to 16, "Shani" to 19, "Budha" to 17
)

val VIMSHOTTARI_HINDI: Map<String, String> = mapOf(
    "Ketu" to "केतु", "Shukra" to "शुक्र", "Surya" to "सूर्य", "Chandra" to "चन्द्र",
    "Mangal" to "मंगल", "Rahu" to "राहु", "Guru" to "गुरु", "Shani" to "शनि", "Budha" to "बुध"
)