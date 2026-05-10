package com.jainkundali.app.domain.data

import com.jainkundali.app.domain.models.Nakshatra
import com.jainkundali.app.domain.models.NakshatraNature
import com.jainkundali.app.domain.models.KarmaType

val NAKSHATRAS: List<Nakshatra> = listOf(
    Nakshatra(
        index = 0, name = "Ashvini", hindiName = "अश्विनी",
        startDeg = 0.0, endDeg = 13.333,
        nature = NakshatraNature.SHUBHA,
        karmaType = KarmaType.GYANAVARANIYA,
        tirthankarasBorn = listOf("कुन्थुनाथ (17)", "नमिनाथ (21)"),
        rulingJyotishiDev = "अश्विनी ज्योतिषी देव",
        spiritualTraits = "गति, आरोग्य, नई शुरुआत, चिकित्सा ज्ञान",
        karmaManifestation = "ज्ञानावरणीय कर्म: नई बातें सीखने में बाधा, उचित निर्णय लेने में विलंब",
        sadhana = "प्रतिदिन प्रातः 108 बार णमोकार मंत्र + स्वाध्याय 20 मिनट",
        deityNote = "जैन ज्योतिष में वैदिक अश्विनी कुमार नहीं — इस नक्षत्र के ज्योतिषी देव कुन्थुनाथ और नमिनाथ तीर्थंकरों से संबंधित हैं।"
    ),
    Nakshatra(
        index = 1, name = "Bharani", hindiName = "भरणी",
        startDeg = 13.333, endDeg = 26.667,
        nature = NakshatraNature.MISHRA,
        karmaType = KarmaType.VEDANIYA,
        tirthankarasBorn = listOf("शान्तिनाथ (16)"),
        rulingJyotishiDev = "भरणी ज्योतिषी देव",
        spiritualTraits = "परिवर्तन, समाप्ति, नया जन्म, न्याय",
        karmaManifestation = "वेदनीय कर्म: भावनात्मक उतार-चढ़ाव, दुःख और सुख का तीव्र अनुभव",
        sadhana = "उत्तम मार्दव भावना का ध्यान 10 मिनट + एकासन व्रत सोमवार को",
        deityNote = "जैन ज्योतिष में वैदिक यम देव नहीं — शान्तिनाथ तीर्थंकर का जन्म नक्षत्र होने से यह मिश्र स्वभाव का है।"
    ),
    Nakshatra(
        index = 2, name = "Krittika", hindiName = "कृत्तिका",
        startDeg = 26.667, endDeg = 40.0,
        nature = NakshatraNature.MISHRA,
        karmaType = KarmaType.NAAM,
        tirthankarasBorn = listOf("सुमतिनाथ (5)"),
        rulingJyotishiDev = "कृत्तिका ज्योतिषी देव",
        spiritualTraits = "शुद्धि, तेज, कड़ी मेहनत, परिष्कार",
        karmaManifestation = "नाम कर्म: शरीर और रूप से संबंधित चिंताएँ, पहचान की अनिश्चितता",
        sadhana = "देव-दर्शन प्रतिदिन + शुक्रवार को विशेष पंचामृत अभिषेक",
        deityNote = "जैन ज्योतिष में वैदिक अग्नि देव नहीं — सुमतिनाथ तीर्थंकर का जन्म नक्षत्र।"
    ),
    Nakshatra(
        index = 3, name = "Rohini", hindiName = "रोहिणी",
        startDeg = 40.0, endDeg = 53.333,
        nature = NakshatraNature.PARAM_SHUBHA,
        karmaType = KarmaType.GYANAVARANIYA,
        tirthankarasBorn = listOf("अजितनाथ (2)"),
        rulingJyotishiDev = "रोहिणी ज्योतिषी देव",
        spiritualTraits = "उर्वरता, समृद्धि, स्थिरता, सौंदर्य, प्रेम",
        karmaManifestation = "ज्ञानावरणीय कर्म का विशेष क्षय: ज्ञान की प्राप्ति में सहायता मिलती है",
        sadhana = "अजितनाथ भगवान का स्मरण 108 बार + प्रतिदिन शास्त्र-श्रवण",
        deityNote = "परम शुभ नक्षत्र — अजितनाथ (द्वितीय तीर्थंकर) का जन्म, दीक्षा, केवलज्ञान और निर्वाण सभी इसी नक्षत्र में।"
    ),
    Nakshatra(
        index = 4, name = "Mrigashirsha", hindiName = "मृगशिरा",
        startDeg = 53.333, endDeg = 66.667,
        nature = NakshatraNature.SHUBHA,
        karmaType = KarmaType.MOHANIYA,
        tirthankarasBorn = listOf("सम्भवनाथ (3)"),
        rulingJyotishiDev = "मृगशिरा ज्योतिषी देव",
        spiritualTraits = "खोज, यात्रा, जिज्ञासा, संवेदनशीलता",
        karmaManifestation = "मोहनीय कर्म: नई वस्तुओं और संबंधों की लालसा, मन की चंचलता",
        sadhana = "वैराग्य भावना 15 मिनट + सम्भवनाथ का स्मरण 27 बार",
        deityNote = "जैन ज्योतिष में वैदिक सोम देव नहीं — सम्भवनाथ तीर्थंकर का जन्म नक्षत्र।"
    ),
    Nakshatra(
        index = 5, name = "Ardra", hindiName = "आर्द्रा",
        startDeg = 66.667, endDeg = 80.0,
        nature = NakshatraNature.ASHUBHA,
        karmaType = KarmaType.MOHANIYA,
        tirthankarasBorn = listOf(),
        rulingJyotishiDev = "आर्द्रा ज्योतिषी देव",
        spiritualTraits = "तूफान, आँसू, परिवर्तन, भावनात्मक तीव्रता",
        karmaManifestation = "मोहनीय कर्म: तीव्र भावनात्मक दुःख, क्रोध के बाद पश्चाताप, नशे की प्रवृत्ति",
        sadhana = "उत्तम क्षमा भावना प्रतिदिन + रात को सोने से पूर्व 108 णमोकार",
        deityNote = "जैन ज्योतिष में वैदिक रुद्र नहीं — अशुभ नक्षत्र, मोहनीय कर्म का प्रबल उदय।"
    ),
    Nakshatra(
        index = 6, name = "Punarvasu", hindiName = "पुनर्वसु",
        startDeg = 80.0, endDeg = 93.333,
        nature = NakshatraNature.SHUBHA,
        karmaType = KarmaType.NAAM,
        tirthankarasBorn = listOf("अभिनन्दननाथ (4)"),
        rulingJyotishiDev = "पुनर्वसु ज्योतिषी देव",
        spiritualTraits = "पुनः वापसी, उपचार, बहुमुखी प्रतिभा, उदारता",
        karmaManifestation = "नाम कर्म: शरीर के अंगों से संबंधित समस्याएँ, रूप-सौंदर्य की चिंता",
        sadhana = "अभिनन्दननाथ का पूजन + प्रतिदिन अष्टद्रव्य चढ़ाना",
        deityNote = "जैन ज्योतिष में वैदिक अदिति नहीं — अभिनन्दननाथ तीर्थंकर का जन्म नक्षत्र।"
    ),
    Nakshatra(
        index = 7, name = "Pushya", hindiName = "पुष्य",
        startDeg = 93.333, endDeg = 106.667,
        nature = NakshatraNature.SHUBHA,
        karmaType = KarmaType.GYANAVARANIYA,
        tirthankarasBorn = listOf(),
        rulingJyotishiDev = "पुष्य ज्योतिषी देव",
        spiritualTraits = "पोषण, सुरक्षा, धर्म-कार्य, शांति",
        karmaManifestation = "ज्ञानावरणीय कर्म: शिक्षा में बाधा, धर्म ग्रंथों का अर्थ न समझ पाना",
        sadhana = "गुरुवार को विशेष स्वाध्याय + 16 बार णमोकार",
        deityNote = "जैन ज्योतिष में वैदिक बृहस्पति नहीं — शुभ नक्षत्र, ज्ञानावरणीय कर्म निर्जरा में सहायक।"
    ),
    Nakshatra(
        index = 8, name = "Ashlesha", hindiName = "आश्लेषा",
        startDeg = 106.667, endDeg = 120.0,
        nature = NakshatraNature.ASHUBHA,
        karmaType = KarmaType.MOHANIYA,
        tirthankarasBorn = listOf(),
        rulingJyotishiDev = "आश्लेषा ज्योतिषी देव",
        spiritualTraits = "आसक्ति, रहस्य, कुंडलिनी शक्ति, गहरी भावनाएँ",
        karmaManifestation = "मोहनीय कर्म: किसी व्यक्ति या वस्तु से अत्यधिक आसक्ति, छोड़ने में कठिनाई",
        sadhana = "अनाशक्ति भावना + सप्ताह में एक बार उपवास",
        deityNote = "जैन ज्योतिष में वैदिक नाग देव नहीं — अशुभ नक्षत्र, मोहनीय कर्म का तीव्र उदय।"
    ),
    Nakshatra(
        index = 9, name = "Magha", hindiName = "मघा",
        startDeg = 120.0, endDeg = 133.333,
        nature = NakshatraNature.MISHRA,
        karmaType = KarmaType.GOTRA,
        tirthankarasBorn = listOf(),
        rulingJyotishiDev = "मघा ज्योतिषी देव",
        spiritualTraits = "पूर्वजों का आशीर्वाद, कुल-गौरव, नेतृत्व, उत्तराधिकार",
        karmaManifestation = "गोत्र कर्म: कुल से संबंधित बाधाएँ, पारिवारिक गौरव की चिंता",
        sadhana = "पितर-तर्पण (जैन विधि से) + मल्लिनाथ का स्मरण",
        deityNote = "जैन ज्योतिष में वैदिक पितृ देव नहीं — गोत्र कर्म से संबंधित मिश्र नक्षत्र।"
    ),
    Nakshatra(
        index = 10, name = "Purva Phalguni", hindiName = "पूर्व फाल्गुनी",
        startDeg = 133.333, endDeg = 146.667,
        nature = NakshatraNature.MISHRA,
        karmaType = KarmaType.VEDANIYA,
        tirthankarasBorn = listOf(),
        rulingJyotishiDev = "पूर्व फाल्गुनी ज्योतिषी देव",
        spiritualTraits = "विश्राम, सृजन, प्रेम, कला, आनंद",
        karmaManifestation = "वेदनीय कर्म: भौतिक सुखों में अत्यधिक आसक्ति, सुख-विरह का तीव्र दुःख",
        sadhana = "परिग्रह-परिमाण व्रत + शुक्रवार को पद्मप्रभु भगवान की पूजा",
        deityNote = "जैन ज्योतिष में वैदिक भग देव नहीं — वेदनीय कर्म का प्रबल प्रभाव।"
    ),
    Nakshatra(
        index = 11, name = "Uttara Phalguni", hindiName = "उत्तर फाल्गुनी",
        startDeg = 146.667, endDeg = 160.0,
        nature = NakshatraNature.PARAM_SHUBHA,
        karmaType = KarmaType.GYANAVARANIYA,
        tirthankarasBorn = listOf("महावीर स्वामी (24)", "विमलनाथ (13)"),
        rulingJyotishiDev = "उत्तर फाल्गुनी ज्योतिषी देव",
        spiritualTraits = "सेवा, संगठन, उत्तरदायित्व, सामाजिक न्याय",
        karmaManifestation = "ज्ञानावरणीय कर्म निर्जरा: ज्ञान की विशेष प्राप्ति, सेवा से पुण्यबंध",
        sadhana = "महावीर स्वामी का स्मरण + 'ॐ ह्रीं श्री महावीर स्वामिने नमः' 108 बार",
        deityNote = "परम शुभ नक्षत्र — भगवान महावीर और विमलनाथ का जन्म नक्षत्र।"
    ),
    Nakshatra(
        index = 12, name = "Hasta", hindiName = "हस्त",
        startDeg = 160.0, endDeg = 173.333,
        nature = NakshatraNature.SHUBHA,
        karmaType = KarmaType.ANTARAYA,
        tirthankarasBorn = listOf(),
        rulingJyotishiDev = "हस्त ज्योतिषी देव",
        spiritualTraits = "कुशलता, सटीकता, चिकित्सा, हस्त-कला",
        karmaManifestation = "अंतराय कर्म: कार्य में अचानक बाधा, मेहनत के बाद भी फल न मिलना",
        sadhana = "सम्भवनाथ का पूजन + 'ॐ ह्रीं श्री सम्भवनाथाय नमः' 27 बार",
        deityNote = "जैन ज्योतिष में वैदिक सूर्य देव नहीं — अंतराय कर्म निवारण में सहायक शुभ नक्षत्र।"
    ),
    Nakshatra(
        index = 13, name = "Chitra", hindiName = "चित्रा",
        startDeg = 173.333, endDeg = 186.667,
        nature = NakshatraNature.SHUBHA,
        karmaType = KarmaType.NAAM,
        tirthankarasBorn = listOf("पद्मप्रभु (6)", "नेमिनाथ (22)"),
        rulingJyotishiDev = "चित्रा ज्योतिषी देव",
        spiritualTraits = "सौंदर्य, कला, रचनात्मकता, विविधता",
        karmaManifestation = "नाम कर्म: शारीरिक सौंदर्य की तीव्र इच्छा, दिखावे की प्रवृत्ति",
        sadhana = "पद्मप्रभु की पूजा + नेमिनाथ का स्मरण, पशु-दया का अभ्यास",
        deityNote = "जैन ज्योतिष में वैदिक विश्वकर्मा नहीं — पद्मप्रभु और नेमिनाथ का जन्म नक्षत्र।"
    ),
    Nakshatra(
        index = 14, name = "Swati", hindiName = "स्वाति",
        startDeg = 186.667, endDeg = 200.0,
        nature = NakshatraNature.SHUBHA,
        karmaType = KarmaType.DARSHANAVARANIYA,
        tirthankarasBorn = listOf(),
        rulingJyotishiDev = "स्वाति ज्योतिषी देव",
        spiritualTraits = "स्वतंत्रता, लचीलापन, व्यापार, गति",
        karmaManifestation = "दर्शनावरणीय कर्म: आत्म-साक्षात्कार में बाधा, सम्यक् दर्शन का अभाव",
        sadhana = "तत्त्वार्थसूत्र का पाठ + 'सम्यक् दर्शन' भावना 10 मिनट",
        deityNote = "जैन ज्योतिष में वैदिक वायु देव नहीं — दर्शनावरणीय कर्म निर्जरा का शुभ नक्षत्र।"
    ),
    Nakshatra(
        index = 15, name = "Vishakha", hindiName = "विशाखा",
        startDeg = 200.0, endDeg = 213.333,
        nature = NakshatraNature.PARAM_SHUBHA,
        karmaType = KarmaType.CHARITRA_MOHANIYA,
        tirthankarasBorn = listOf("सुपार्श्वनाथ (7)", "शीतलनाथ (10)", "पार्श्वनाथ (23)"),
        rulingJyotishiDev = "विशाखा ज्योतिषी देव",
        spiritualTraits = "लक्ष्य-प्राप्ति, दृढ़ता, दोहरी प्रकृति, परिवर्तन",
        karmaManifestation = "चारित्र मोहनीय कर्म: सही आचरण जानते हुए भी न करना, संकल्प टूटना",
        sadhana = "पार्श्वनाथ का अभिषेक + 'उवसग्गहरं पास' स्तोत्र का पाठ प्रतिदिन",
        deityNote = "परम शुभ नक्षत्र — सुपार्श्वनाथ, शीतलनाथ और पार्श्वनाथ का जन्म नक्षत्र।"
    ),
    Nakshatra(
        index = 16, name = "Anuradha", hindiName = "अनुराधा",
        startDeg = 213.333, endDeg = 226.667,
        nature = NakshatraNature.SHUBHA,
        karmaType = KarmaType.DARSHANAVARANIYA,
        tirthankarasBorn = listOf("चन्द्रप्रभु (8)"),
        rulingJyotishiDev = "अनुराधा ज्योतिषी देव",
        spiritualTraits = "मित्रता, सहयोग, भक्ति, सफलता की राह",
        karmaManifestation = "दर्शनावरणीय कर्म: आँखों की समस्याएँ, आत्म-ज्ञान में बाधा",
        sadhana = "चन्द्रप्रभु का पूजन + नेत्र-रोग हेतु 'ॐ ह्रीं श्री चन्द्रप्रभाय नमः' 108 बार",
        deityNote = "जैन ज्योतिष में वैदिक मित्र देव नहीं — चन्द्रप्रभु का जन्म नक्षत्र।"
    ),
    Nakshatra(
        index = 17, name = "Jyeshtha", hindiName = "ज्येष्ठा",
        startDeg = 226.667, endDeg = 240.0,
        nature = NakshatraNature.ASHUBHA,
        karmaType = KarmaType.ANTARAYA,
        tirthankarasBorn = listOf(),
        rulingJyotishiDev = "ज्येष्ठा ज्योतिषी देव",
        spiritualTraits = "वरिष्ठता, सुरक्षा, गोपनीयता, संघर्ष",
        karmaManifestation = "अंतराय कर्म: दान में बाधा, उचित लाभ से वंचित होना, प्रयास व्यर्थ जाना",
        sadhana = "अष्टद्रव्य पूजा + 'सम्भवनाथाय नमः' 27 बार, बुधवार को उपवास",
        deityNote = "जैन ज्योतिष में वैदिक इंद्र देव नहीं — अशुभ नक्षत्र, अंतराय कर्म का प्रबल उदय।"
    ),
    Nakshatra(
        index = 18, name = "Mula", hindiName = "मूला",
        startDeg = 240.0, endDeg = 253.333,
        nature = NakshatraNature.ASHUBHA,
        karmaType = KarmaType.MOHANIYA,
        tirthankarasBorn = listOf("सुविधिनाथ (9)"),
        rulingJyotishiDev = "मूला ज्योतिषी देव",
        spiritualTraits = "जड़ों की खोज, विनाश-पुनर्निर्माण, गहराई",
        karmaManifestation = "मोहनीय कर्म: मूलभूत आसक्तियाँ जो छोड़ना कठिन है",
        sadhana = "सुविधिनाथ का स्मरण + शनिवार को सूर्यास्त से पूर्व उपवास",
        deityNote = "जैन ज्योतिष में वैदिक निऋति देव नहीं — सुविधिनाथ का जन्म नक्षत्र होने पर भी अशुभ प्रकृति।"
    ),
    Nakshatra(
        index = 19, name = "Purva Ashadha", hindiName = "पूर्वाषाढ़ा",
        startDeg = 253.333, endDeg = 266.667,
        nature = NakshatraNature.MISHRA,
        karmaType = KarmaType.GOTRA,
        tirthankarasBorn = listOf("मल्लिनाथ (19)"),
        rulingJyotishiDev = "पूर्वाषाढ़ा ज्योतिषी देव",
        spiritualTraits = "अजेय शक्ति, जल-तत्व, शुद्धि, विजय की ओर",
        karmaManifestation = "गोत्र कर्म: कुल-परंपरा से संघर्ष, सामाजिक प्रतिष्ठा की चिंता",
        sadhana = "मल्लिनाथ का पूजन + गुरुवार को कुल-देव दर्शन",
        deityNote = "जैन ज्योतिष में वैदिक अपः देव नहीं — मल्लिनाथ का जन्म नक्षत्र।"
    ),
    Nakshatra(
        index = 20, name = "Uttara Ashadha", hindiName = "उत्तराषाढ़ा",
        startDeg = 266.667, endDeg = 280.0,
        nature = NakshatraNature.PARAM_SHUBHA,
        karmaType = KarmaType.GYANAVARANIYA,
        tirthankarasBorn = listOf("ऋषभनाथ (1)", "अरनाथ (18)"),
        rulingJyotishiDev = "उत्तराषाढ़ा ज्योतिषी देव",
        spiritualTraits = "अंतिम विजय, धर्म की स्थापना, सत्य, अखंड संकल्प",
        karmaManifestation = "ज्ञानावरणीय कर्म निर्जरा: स्थायी ज्ञान-प्राप्ति, आत्म-साक्षात्कार की ओर",
        sadhana = "ऋषभदेव की विशेष पूजा + भक्तामर स्तोत्र के 48 श्लोक",
        deityNote = "परम शुभ नक्षत्र — प्रथम तीर्थंकर ऋषभनाथ और अरनाथ का जन्म नक्षत्र।"
    ),
    Nakshatra(
        index = 21, name = "Shravana", hindiName = "श्रवण",
        startDeg = 280.0, endDeg = 293.333,
        nature = NakshatraNature.SHUBHA,
        karmaType = KarmaType.GYANAVARANIYA,
        tirthankarasBorn = listOf("श्रेयांसनाथ (11)", "मुनिसुव्रत (20)"),
        rulingJyotishiDev = "श्रवण ज्योतिषी देव",
        spiritualTraits = "श्रवण, शिक्षा, धर्म-सेवा, समर्पण",
        karmaManifestation = "ज्ञानावरणीय कर्म: श्रुत-ज्ञान में बाधा, गुरु के वचन न सुन पाना",
        sadhana = "श्रेयांसनाथ और मुनिसुव्रत का स्मरण + शास्त्र-श्रवण प्रतिदिन 30 मिनट",
        deityNote = "जैन ज्योतिष में वैदिक विष्णु नहीं — श्रेयांसनाथ और मुनिसुव्रत का जन्म नक्षत्र।"
    ),
    Nakshatra(
        index = 22, name = "Dhanishtha", hindiName = "धनिष्ठा",
        startDeg = 293.333, endDeg = 306.667,
        nature = NakshatraNature.MISHRA,
        karmaType = KarmaType.NAAM,
        tirthankarasBorn = listOf(),
        rulingJyotishiDev = "धनिष्ठा ज्योतिषी देव",
        spiritualTraits = "धन, संगीत, ताल, समृद्धि, मंगल-कार्य",
        karmaManifestation = "नाम कर्म: भौतिक समृद्धि की तीव्र इच्छा, शरीर के प्रति अत्यधिक आसक्ति",
        sadhana = "परिग्रह-परिमाण व्रत + मंगलवार को विशेष जाप",
        deityNote = "जैन ज्योतिष में वैदिक अष्टवसु नहीं — नाम कर्म से जुड़ा मिश्र नक्षत्र।"
    ),
    Nakshatra(
        index = 23, name = "Shatabhisha", hindiName = "शतभिषा",
        startDeg = 306.667, endDeg = 320.0,
        nature = NakshatraNature.MISHRA,
        karmaType = KarmaType.VEDANIYA,
        tirthankarasBorn = listOf("वासुपूज्य (12)"),
        rulingJyotishiDev = "शतभिषा ज्योतिषी देव",
        spiritualTraits = "चिकित्सा, एकांत, रहस्य, अनुसंधान",
        karmaManifestation = "वेदनीय कर्म: छिपे हुए दुःख, लंबी बीमारी, एकाकीपन",
        sadhana = "वासुपूज्य का पूजन + सोमवार को उपवास, आयुर्वेदिक दिनचर्या",
        deityNote = "जैन ज्योतिष में वैदिक वरुण देव नहीं — वासुपूज्य का जन्म नक्षत्र।"
    ),
    Nakshatra(
        index = 24, name = "Purva Bhadrapada", hindiName = "पूर्व भाद्रपद",
        startDeg = 320.0, endDeg = 333.333,
        nature = NakshatraNature.ASHUBHA,
        karmaType = KarmaType.MOHANIYA,
        tirthankarasBorn = listOf(),
        rulingJyotishiDev = "पूर्व भाद्रपद ज्योतिषी देव",
        spiritualTraits = "अग्नि-तत्व, परिवर्तन, उग्रता, साहस",
        karmaManifestation = "मोहनीय कर्म: उग्र स्वभाव, क्रोध-लोभ का तीव्र उदय",
        sadhana = "उत्तम क्षमा + उत्तम सत्य भावना, मंगलवार को 108 णमोकार",
        deityNote = "जैन ज्योतिष में वैदिक अजैकपाद नहीं — अशुभ नक्षत्र, मोहनीय कर्म का प्रबल उदय।"
    ),
    Nakshatra(
        index = 25, name = "Uttara Bhadrapada", hindiName = "उत्तर भाद्रपद",
        startDeg = 333.333, endDeg = 346.667,
        nature = NakshatraNature.SHUBHA,
        karmaType = KarmaType.CHARITRA_MOHANIYA,
        tirthankarasBorn = listOf("धर्मनाथ (15)"),
        rulingJyotishiDev = "उत्तर भाद्रपद ज्योतिषी देव",
        spiritualTraits = "गहरा ज्ञान, जल-तत्व, समाधि, पूर्णता",
        karmaManifestation = "चारित्र मोहनीय कर्म: व्रत और नियम तोड़ने की प्रवृत्ति",
        sadhana = "धर्मनाथ का पूजन + गुरुवार को संपूर्ण व्रत-पालन",
        deityNote = "जैन ज्योतिष में वैदिक अहिर्बुध्न्य नहीं — धर्मनाथ का जन्म नक्षत्र।"
    ),
    Nakshatra(
        index = 26, name = "Revati", hindiName = "रेवती",
        startDeg = 346.667, endDeg = 360.0,
        nature = NakshatraNature.SHUBHA,
        karmaType = KarmaType.MOHANIYA,
        tirthankarasBorn = listOf("अनन्तनाथ (14)"),
        rulingJyotishiDev = "रेवती ज्योतिषी देव",
        spiritualTraits = "यात्रा की समाप्ति, पोषण, करुणा, आध्यात्मिक पूर्णता",
        karmaManifestation = "मोहनीय कर्म: संसार-यात्रा का बोध, परंतु जाने का भय",
        sadhana = "अनन्तनाथ का स्मरण + संसार-भावना 15 मिनट, रात को प्रतिक्रमण",
        deityNote = "जैन ज्योतिष में वैदिक पूषा नहीं — अनन्तनाथ का जन्म नक्षत्र।"
    ),
)

val ABHIJIT: Nakshatra = Nakshatra(
    index = 27, name = "Abhijit", hindiName = "अभिजित",
    startDeg = 276.667, endDeg = 280.889,
    nature = NakshatraNature.PARAM_SHUBHA,
    karmaType = KarmaType.SARVA_KARMA_KSHAY,
    tirthankarasBorn = listOf("ऋषभनाथ (1) — निर्वाण नक्षत्र"),
    rulingJyotishiDev = "अभिजित ज्योतिषी देव (मोक्ष नक्षत्र)",
    spiritualTraits = "मोक्ष, सर्वकर्म क्षय, आत्मा की परम शुद्धि",
    karmaManifestation = "सर्व कर्मों का क्षय — यह नक्षत्र मोक्ष का द्योतक है",
    sadhana = "भगवान ऋषभदेव की पूजा + षट्खंडागम श्रवण",
    deityNote = "परम शुभ मोक्ष-नक्षत्र — ऋषभनाथ भगवान का निर्वाण इसी नक्षत्र में हुआ।"
)

fun getNakshatraByDegree(siderealDeg: Double): Nakshatra {
    val normalized = ((siderealDeg % 360.0) + 360.0) % 360.0
    val index = (normalized / 13.333333).toInt().coerceAtMost(26)
    return NAKSHATRAS[index]
}

fun getNakshatraPada(siderealDeg: Double): Int {
    val normalized = ((siderealDeg % 360.0) + 360.0) % 360.0
    val posInNakshatra = normalized % 13.333333
    return (posInNakshatra / 3.333333).toInt() + 1
}

fun getNakshatraByName(name: String): Nakshatra? {
    return NAKSHATRAS.find {
        it.name.equals(name, ignoreCase = true) || it.hindiName == name
    }
}