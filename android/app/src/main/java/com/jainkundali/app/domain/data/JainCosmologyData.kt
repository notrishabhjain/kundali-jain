package com.jainkundali.app.domain.data

import com.jainkundali.app.domain.models.IshtakaalResult
import com.jainkundali.app.domain.models.JainZodiacProjection
import kotlin.math.floor

/**
 * Jain Cosmological and Astrological Framework
 *
 * Sources (see references/sources.md):
 *  - Panch Samvay (Five-fold Causality): Tattvarthasutra ch. 5 + Research Report §1.
 *  - Planetary → karma mapping: Research Report §1 (karma-graha table).
 *    [REQUIRES_RESEARCH] verse-level OCR from Bhadrabahu Samhita pending.
 *  - Jain sidereal geometry: Surya Prajnapti (SP-1) + Jambudvipa Prajnapti (JP-1);
 *    distilled in Research Report §3-§4.
 *  - 28 nakshatra model with unequal muhurta spans: SP-1 ch. 3;
 *    Research Report §4 (Sidereal Geometry table).
 *  - Bhadrabahu Samhita transit rules: BDS-1; Research Report §5.
 *    [REQUIRES_RESEARCH] full BDS-1 OCR pending.
 */

// ─── Panch Samvay (Five-fold Causality Matrix) ───────────────────────────────
// Governs all worldly occurrences. The kundali engine treats the first four vectors
// as a fixed coordinate system; Pursharth (free will) is the open interface for remedies.
// Source: Tattvarthasutra ch. 5 + Research Report §1.
data class PanchSamvayVector(
    val name: String,
    val hindiName: String,
    val description: String,
    val engineRole: String
)

val PANCH_SAMVAY = listOf(
    PanchSamvayVector(
        name = "Kaal", hindiName = "काल",
        description = "The chronological dimension — current Ara (Pancham Kaal), tithi, nakshatra, and dasha period.",
        engineRole = "Fixed input: birth time, Pancham Kaal factor (1.4×), current panchang state."
    ),
    PanchSamvayVector(
        name = "Swabhav", hindiName = "स्वभाव",
        description = "Intrinsic disposition of the soul — nakshatra nature, gunasthana level.",
        engineRole = "Fixed input: nakshatra nature classification, birth karma type."
    ),
    PanchSamvayVector(
        name = "Purakrit", hindiName = "पूरकृत",
        description = "Feedback loops from past karmic acquisitions — 8 karmas in Udaya/Satta/Nirjara state.",
        engineRole = "Fixed input: dominant karma, karma intensity scores from KarmaEngine."
    ),
    PanchSamvayVector(
        name = "Niyati", hindiName = "नियति",
        description = "Inevitable progression of cosmological laws — planetary positions, dasha sequences, cosmic time cycles.",
        engineRole = "Fixed input: dasha lord, antardasha lord, birth chart coordinates."
    ),
    PanchSamvayVector(
        name = "Pursharth", hindiName = "पुरुषार्थ",
        description = "Conscious human exertion and free will — the only dynamic variable that can neutralize karmic configurations.",
        engineRole = "Open interface: sadhana, remedies, vratas, tapasya prescribed by RemedyEngine."
    )
)

// ─── Planetary → Karma Mapping ────────────────────────────────────────────────
// Planets are Nimitta Gyana (indicative science), NOT causal agents.
// Source: Research Report §1 + [REQUIRES_RESEARCH] BDS-1.
data class GrahaKarmaMapping(
    val graha: String,
    val grahaHindi: String,
    val indicatedKarma: String,
    val karmaHindi: String,
    val afflictionIndicator: String
)

val GRAHA_KARMA_MAPPINGS = listOf(
    GrahaKarmaMapping("Mercury", "बुध", "Gyanavaraniya", "ज्ञानावरणीय",
        "बुध की पीड़ा — ज्ञानावरणीय कर्म का सूचक; बुद्धि, स्मृति, वाणी में बाधा"),
    GrahaKarmaMapping("Jupiter", "बृहस्पति", "Gyanavaraniya", "ज्ञानावरणीय",
        "बृहस्पति की पीड़ा — श्रुत-ज्ञान और गुरु-भक्ति में बाधा का सूचक"),
    GrahaKarmaMapping("Sun", "सूर्य", "Darshanavaraniya", "दर्शनावरणीय",
        "सूर्य की पीड़ा — दर्शनावरणीय कर्म, सम्यग्-दृष्टि में अस्थिरता का सूचक"),
    GrahaKarmaMapping("Moon", "चन्द्र", "Darshanavaraniya", "दर्शनावरणीय",
        "चन्द्र की पीड़ा — दर्शन-बाधा और वेदनीय (सुख-दुःख) दोनों का सूचक"),
    GrahaKarmaMapping("Venus", "शुक्र", "Mohaniya", "मोहनीय",
        "शुक्र की पीड़ा — मोहनीय कर्म (कषाय, आसक्ति, वैवाहिक कलह) का सूचक"),
    GrahaKarmaMapping("Mars", "मंगल", "Mohaniya", "मोहनीय",
        "मंगल की पीड़ा — चारित्र-मोहनीय, क्रोध-कषाय का तीव्र सूचक"),
    GrahaKarmaMapping("Saturn", "शनि", "Antaraya", "अंतराय",
        "शनि की पीड़ा — अंतराय कर्म (लाभ-दान-भोग-उपभोग-वीर्य-अंतराय) का सूचक"),
    GrahaKarmaMapping("Moon (Transit)", "चन्द्र (गोचर)", "Vedaniya", "वेदनीय",
        "गोचर चन्द्र — वेदनीय कर्म के उदय-काल का सूचक; सुख-दुःख का ज्वार"),
    GrahaKarmaMapping("Ascendant (Lagna)", "लग्न", "Naam", "नाम",
        "लग्न-दुर्बलता — नाम कर्म का शरीर-रचना पक्ष, रूप-सम्बन्धी चिंताओं का सूचक"),
    GrahaKarmaMapping("Sun (9th/10th)", "सूर्य (नवम/दशम)", "Gotra", "गोत्र",
        "नवम-दशम सूर्य-पीड़ा — गोत्र कर्म, कुल-प्रतिष्ठा और सामाजिक स्थान का सूचक"),
    GrahaKarmaMapping("Saturn (longevity)", "शनि (आयु-कारक)", "Ayushya", "आयुष्य",
        "आयु-कारक शनि की स्थिति — आयुष्य कर्म की दीर्घायु या अल्पायु का सूचक")
)

// ─── Jain Sidereal Geometry — Nakshatra Span Classes ─────────────────────────
// Source: Surya Prajnapti (SP-1) + Research Report §3-§4.
// Total zodiacal circumference: 819 + 11/67 muhurtas ≈ 819.164179 muhurtas.
// Verification: (1 × 9+11/67) + (6 × 15) + (6 × 45) + (15 × 30) = 819 + 11/67 ✓

const val JAIN_ZODIAC_TOTAL_MUHURTAS = 819.0 + 11.0 / 67.0

data class JainNakshatraSpan(
    val name: String,
    val spanClass: String,           // "abhijit" | "short_span" | "long_span" | "standard_span"
    val zodiacStretchMuhurtas: Double,
    val solarConjunctionDays: Int,
    val solarConjunctionMuhurtas: Int
)

// Shravana-first ordering per SP-1 (epoch ~500 BCE).
// Source: Research Report §4 + SP-1 ch. 3.
val JAIN_NAKSHATRAS_ORDERED = listOf(
    JainNakshatraSpan("Shravana",         "standard_span", 30.0, 13, 12),
    JainNakshatraSpan("Dhanistha",        "standard_span", 30.0, 13, 12),
    JainNakshatraSpan("Satabhisha",       "short_span",    15.0, 6,  21),
    JainNakshatraSpan("Purvabhadrapada",  "standard_span", 30.0, 13, 12),
    JainNakshatraSpan("Uttarabhadrapada", "long_span",     45.0, 20, 3),
    JainNakshatraSpan("Revati",           "standard_span", 30.0, 13, 12),
    JainNakshatraSpan("Ashwini",          "standard_span", 30.0, 13, 12),
    JainNakshatraSpan("Bharani",          "short_span",    15.0, 6,  21),
    JainNakshatraSpan("Krittika",         "standard_span", 30.0, 13, 12),
    JainNakshatraSpan("Rohini",           "long_span",     45.0, 20, 3),
    JainNakshatraSpan("Mrigashira",       "standard_span", 30.0, 13, 12),
    JainNakshatraSpan("Ardra",            "short_span",    15.0, 6,  21),
    JainNakshatraSpan("Punarvasu",        "long_span",     45.0, 20, 3),
    JainNakshatraSpan("Pushya",           "standard_span", 30.0, 13, 12),
    JainNakshatraSpan("Aslesha",          "short_span",    15.0, 6,  21),
    JainNakshatraSpan("Magha",            "standard_span", 30.0, 13, 12),
    JainNakshatraSpan("Purvaphalguni",    "standard_span", 30.0, 13, 12),
    JainNakshatraSpan("Uttaraphalguni",   "long_span",     45.0, 20, 3),
    JainNakshatraSpan("Hasta",            "standard_span", 30.0, 13, 12),
    JainNakshatraSpan("Chitra",           "standard_span", 30.0, 13, 12),
    JainNakshatraSpan("Svati",            "short_span",    15.0, 6,  21),
    JainNakshatraSpan("Vishakha",         "long_span",     45.0, 20, 3),
    JainNakshatraSpan("Anuradha",         "standard_span", 30.0, 13, 12),
    JainNakshatraSpan("Jyestha",          "short_span",    15.0, 6,  21),
    JainNakshatraSpan("Mula",             "standard_span", 30.0, 13, 12),
    JainNakshatraSpan("Poorvashadha",     "standard_span", 30.0, 13, 12),
    JainNakshatraSpan("Uttarashadha",     "long_span",     45.0, 20, 3),
    JainNakshatraSpan("Abhijit",          "abhijit",       9.0 + 11.0 / 67.0, 4, 6)
)

// ─── Coordinate Transformation: Standard Longitude → Jain Zodiac ─────────────
// Source: Research Report §4 algorithm + SP-1.
fun calculateJainZodiacProjection(standardLongitude: Double): JainZodiacProjection {
    val normalized = ((standardLongitude % 360.0) + 360.0) % 360.0
    val gradMuhurtas = normalized / 360.0 * JAIN_ZODIAC_TOTAL_MUHURTAS

    var accumulated = 0.0
    for (n in JAIN_NAKSHATRAS_ORDERED) {
        val end = accumulated + n.zodiacStretchMuhurtas
        if (gradMuhurtas >= accumulated && gradMuhurtas < end) {
            return JainZodiacProjection(
                graduatedMuhurtas = gradMuhurtas,
                activeNakshatra = n.name,
                balanceWithinNakshatraMuhurtas = end - gradMuhurtas,
                spanClass = n.spanClass
            )
        }
        accumulated = end
    }
    val last = JAIN_NAKSHATRAS_ORDERED.last()
    return JainZodiacProjection(gradMuhurtas, last.name, 0.0, last.spanClass)
}

// ─── Ishtakaal Calculation ────────────────────────────────────────────────────
// Elapsed time from the APPARENT astronomical sunrise (Meeus Ch. 15 — see
// SunriseEngine) to the precise birth moment.
// Source: PARITY-REPORT-2026 §"Precise Ishtakaal Conversion" (primary; supersedes
// the earlier RESEARCH-REPORT-2025 Ucchvasa/Stoka/Lava hierarchy).
//
// Unit hierarchy: 1 Ghati = 24 min = 60 Palas; 1 Pala = 24 s = 60 Vipalas (Prāṇas);
// 1 Prāṇa = 7 Stokas; 1 Stoka = 7 Lavas; 1 Lava = innumerable Āvalis.
fun calculateIshtakaal(birthTimeHHMM: String, sunriseTimeHHMM: String): IshtakaalResult {
    fun toDecimalHours(hhmm: String): Double {
        val parts = hhmm.split(":").mapNotNull { it.toDoubleOrNull() }
        return (parts.getOrNull(0) ?: 0.0) + (parts.getOrNull(1) ?: 0.0) / 60.0 +
                (parts.getOrNull(2) ?: 0.0) / 3600.0
    }

    val birthH = toDecimalHours(birthTimeHHMM.ifEmpty { "12:00" })
    val sunriseH = toDecimalHours(sunriseTimeHHMM.ifEmpty { "06:00" })
    // Birth before sunrise belongs to the preceding astronomical day.
    val deltaT = if (birthH >= sunriseH) birthH - sunriseH else (birthH + 24.0) - sunriseH

    val ishtakaalGhatis = deltaT * 2.5
    val g = floor(ishtakaalGhatis).toInt()
    val p = floor((ishtakaalGhatis - g) * 60.0).toInt()
    val v = floor(((ishtakaalGhatis - g) * 60.0 - p) * 60.0).toInt()
    val equivalentMuhurtas = ishtakaalGhatis / 2.0

    // Sub-Vipala: fractional Vipala → Stokas (×7) → Lavas (×7).
    val vipalaFrac = ((ishtakaalGhatis - g) * 60.0 - p) * 60.0 - v
    val stokas = floor(vipalaFrac * 7.0).toInt()
    val lavas = floor((vipalaFrac * 7.0 - stokas) * 7.0).toInt()

    return IshtakaalResult(
        ghatis = g,
        palas = p,
        vipalas = v,
        equivalentMuhurtas = Math.round(equivalentMuhurtas * 100.0) / 100.0,
        stokaMicro = stokas,
        lavaMicro = lavas,
        formatted = "$g घटी $p पल $v विपल (${Math.round(equivalentMuhurtas * 10.0) / 10.0} मुहूर्त)"
    )
}

// ─── Bhaktamar Stotra Remedial Matrix ────────────────────────────────────────
// Source: Research Report §5-§7 + BKT-1 (Manatunga Acharya's 48-verse hymn).
// [REQUIRES_RESEARCH] Full BKT-1 verse OCR pending.
data class BhaktamarShloka(
    val shlokaNumber: Int,
    val name: String,
    val targetKarma: List<String>,
    val targetAffliction: String,
    val sanskritVerse: String,
    val riddhiMantra: String,
    val remedialMantra: String,
    val repetitionShloka: Int,
    val repetitionRiddhi: Int,
    val repetitionMantra: Int,
    val direction: String,
    val timeWindow: String,
    val somaticProtocol: String,
    val dietaryRestrictions: String,
    val timelineDays: Int,
    val karmaConnection: String
)

val BHAKTAMAR_SHLOKAS = listOf(
    BhaktamarShloka(3, "नेत्र-स्पष्टता श्लोक",
        listOf("Darshanavaraniya"),
        "नेत्र-रोग, दृष्टि-दोष, दर्शनावरणीय कर्म का उदय (सूर्य-चन्द्र-राहु प्रभाव)",
        "बुद्ध्या विनापि विबुधार्चित-पाद-पीठ! स्तोतुं समुद्यत-मतिर्विगतत्रपोऽहम्",
        "ॐ ह्रीं अहं णमो परमोहिजणाणं",
        "ॐ ह्रीं श्रीं क्लीं सिद्धेभ्यो बुद्धेभ्यः सर्व सिद्धि दायकेभ्यो नमः स्वाहा",
        27, 108, 108, "उत्तर-पूर्व (ईशान कोण)", "प्रातः ४:०० से ७:०० बजे",
        "साधना के समय सामने शुद्ध जल-पात्र रखें। जाप के बाद यह जल नेत्रों पर लगाएँ और प्रतिदिन पिएँ। यह क्रिया २१ दिन तक निरंतर करें।",
        "नमक-रहित आहार २१ दिन तक; हल्के रंग के वस्त्र धारण करें", 21,
        "दर्शनावरणीय कर्म के चक्षु-दर्शनावरण उप-प्रकृति का क्षयोपशम।"),

    BhaktamarShloka(5, "गम्भीर नेत्र-रोग निवारण श्लोक",
        listOf("Darshanavaraniya", "Vedaniya"),
        "मोतियाबिंद, रेटिना-अपक्षय, गम्भीर नेत्र-रोग (शुक्र-पीड़ा)",
        "सोऽहं तथापि तव भक्तिवशान्मुनीश! कर्तुं स्तवं विगतशक्तिरपि प्रवृत्तः",
        "ॐ ह्रीं अहं णमो अणंतोहिजणाणं",
        "ॐ ह्रीं श्रीं क्लीं क्रौं सर्व संकट निवारणेभ्यः सुपार्श्व यक्षेभ्यो नमो नमः स्वाहा",
        21, 108, 108, "पूर्व", "सायंकाल सूर्यास्त के बाद",
        "रोगी को दिन में उपवास रखवाएँ। सायंकाल साधक रोगी के नेत्रों के सामने बैठ कर यह मंत्र ठीक २१ बार पढ़े।",
        "रोगी हेतु एकाशन + तैलीय-मसालेदार भोजन का त्याग", 40,
        "असाता वेदनीय और दर्शनावरणीय का युगल उदय — श्लोक ५ इस युगल को तोड़ता है।"),

    BhaktamarShloka(6, "बुद्धि-विकास श्लोक",
        listOf("Gyanavaraniya"),
        "बुद्धि-मंदता, स्मृति-दोष, ज्ञानावरणीय कर्म (बुध-बृहस्पति पीड़ा)",
        "वक्तुं गुणान् गुणसमुद्र! शशाङ्कं-कान्तान् दास्यामि ते यदि वचोऽमृतमेव किञ्चित्",
        "ॐ ह्रीं अहं णमो लोगस्सुज्जोअगराणं",
        "ॐ ह्रीं श्रीं क्लीं सरस्वत्यै नमः स्वाहा",
        27, 108, 108, "उत्तर-पूर्व (ईशान कोण)", "प्रातः ४:०० से ७:०० बजे",
        "शास्त्र-ग्रंथ के सामने बैठ कर साधना करें। जाप के बाद १० मिनट स्वाध्याय अनिवार्य।",
        "मीठा भोजन; तामसिक पदार्थों का त्याग; ब्रह्मचर्य का पालन", 40,
        "ज्ञानावरणीय कर्म का मति-ज्ञानावरण उप-प्रकृति — श्लोक ६ से बुध-बृहस्पति के नकारात्मक प्रभाव शिथिल पड़ते हैं।"),

    BhaktamarShloka(12, "दाम्पत्य-सामंजस्य श्लोक",
        listOf("Mohaniya", "Charitra Mohaniya"),
        "वैवाहिक कलह, पारिवारिक विघटन, मोहनीय कर्म (शुक्र-मंगल पीड़ा)",
        "प्राप्तं मया तव विभो! तव भक्तियोगात् स्तोत्रं जिनेन्द्र! भवतो गुण-वर्णनाय",
        "ॐ ह्रीं अहं णमो णिव्वाणगमणस्स",
        "ॐ ह्रीं श्रीं क्लीं पार्श्वनाथाय नमः स्वाहा",
        12, 108, 108, "पूर्व", "शुक्रवार को प्रातःकाल",
        "दम्पती साथ में या अलग-अलग (पर एक ही समय पर) यह जाप करें। पार्श्वनाथ की प्रतिमा के सामने फूल अर्पित करें।",
        "एकाशन; मांस-मदिरा का सम्पूर्ण त्याग साधना-काल में", 21,
        "मोहनीय कर्म का चारित्र-मोहनीय पक्ष — कषाय (क्रोध-मान-माया-लोभ) को शान्त कर दाम्पत्य-सम्बन्ध सुधारता है।"),

    BhaktamarShloka(17, "स्वास्थ्य-उपचार श्लोक",
        listOf("Vedaniya"),
        "जठर-आँत रोग, पेट-समस्याएँ, असाता वेदनीय कर्म (बृहस्पति-शनि पीड़ा)",
        "आपादकण्ठमुरुशृङ्खलवेष्टिताङ्गः स्थित्वा चिरं निरवनौ निहितैकपार्श्वः",
        "ॐ ह्रीं अहं णमो सव्वसाहूणं",
        "ॐ ह्रीं श्रीं क्लीं आरोग्य प्रदायिने नमः स्वाहा",
        17, 108, 108, "उत्तर", "प्रातः ५:०० से ७:०० बजे खाली पेट",
        "जाप से पूर्व ताम्र-पात्र में जल रखें; जाप के बाद रोगी को पिलाएँ।",
        "उपवास (या एकाशन); ठंडे, हल्के, सुपाच्य भोजन का पालन", 21,
        "असाता वेदनीय का शरीर-पीड़ा पक्ष — श्लोक १७ की ध्वनि-तरंगें पाचन-तंत्र पर चिकित्सीय प्रभाव डालती हैं।"),

    BhaktamarShloka(18, "मानसिक-शान्ति श्लोक",
        listOf("Mohaniya"),
        "मानसिक अशान्ति, भ्रम-दर्शन, बाधक विचार, द्वादश-भाव का दबाव",
        "उद्भूतभीषणझषाशन-वक्त्र-दंष्ट्रा-निर्भिन्न-निर्जर-शिला-विकटोदराणाम्",
        "ॐ ह्रीं अहं णमो अरहंताणं",
        "ॐ ह्रीं श्रीं क्लीं मन:शुद्धि दायिने नमः स्वाहा",
        18, 108, 108, "उत्तर-पूर्व (ईशान कोण)", "रात्रि सोने से पूर्व",
        "सोने से पूर्व कपाल पर चन्दन का लेप करें। जाप के बाद ५ मिनट श्वास-ध्यान।",
        "उत्तेजक पदार्थों (चाय, कॉफी, तीखा) का त्याग; सात्विक भोजन", 27,
        "मोहनीय का मिथ्यात्व-मोहनीय पक्ष — मन की भटकन और मिथ्या-दृष्टि को शान्त करता है।"),

    BhaktamarShloka(19, "कार्य-सिद्धि श्लोक",
        listOf("Antaraya"),
        "करियर-बाधा, नौकरी-प्रोन्नति में रुकावट, अंतराय कर्म (दशम-भाव / सूर्य पीड़ा)",
        "स्थित्वा क्षणं च समवस्थित-रत्न-राशेस्त्वद्भक्तिभाजनमिदं त्वमसि स्वयम्भूः",
        "ॐ ह्रीं अहं णमो सिद्धाणं",
        "ॐ ह्रीं श्रीं क्लीं कार्य-सिद्धि दायकेभ्यो नमः स्वाहा",
        19, 108, 108, "पूर्व", "रविवार प्रातःकाल",
        "कार्य-क्षेत्र से सम्बन्धित कोई वस्तु साधना-स्थल पर रखें। जाप के बाद उसे माथे से लगाएँ।",
        "एकाशन; नमक का त्याग साधना के दिन", 19,
        "अंतराय कर्म का वीर्य-अंतराय और लाभ-अंतराय पक्ष — वीर्य-शक्ति को जागृत कर करियर-पथ के अवरोध हटाता है।"),

    BhaktamarShloka(45, "दीर्घ-रोग निवारण श्लोक",
        listOf("Ayushya", "Vedaniya"),
        "दीर्घकालीन/प्राण-घातक रोग, शनि-राहु पीड़ा",
        "यैः शान्तरागरुचिभिः परमाणुभिस्त्वं निर्मापितस्त्रिभुवनैकललाम-भूत!",
        "ॐ ह्रीं अहं णमो लोगस्सुज्जोअगराणं",
        "ॐ ह्रीं श्रीं क्लीं महा-रोग निवारणेभ्यः परमात्मने नमः स्वाहा",
        45, 108, 108, "उत्तर", "प्रातःकाल ब्रह्म-मुहूर्त (३:३० - ४:३०)",
        "रोगी की तस्वीर या नाम-पर्ची सामने रखें। जाप के बाद उसके सिर पर हाथ रखें और संकल्प लें।",
        "रोगी हेतु फलाहार या एकाशन; प्रसंस्कृत भोजन का त्याग", 45,
        "आयुष्य कर्म और असाता वेदनीय का दीर्घ-रोग पक्ष — शनि-राहु के कर्म-संचय को तोड़ने का सर्वोत्तम उपाय।"),

    BhaktamarShloka(48, "समृद्धि-मोक्ष-मार्ग श्लोक",
        listOf("Antaraya", "Gotra"),
        "आर्थिक कठिनाई, ऋण-मुक्ति, आध्यात्मिक उन्नति (बृहस्पति-शुक्र वित्त-बाधा)",
        "इत्थं यथा तव विभूतिरभूज्जिनेन्द्र! तच्चिन्तितं मम मनोगत-मेव सिद्धम्",
        "ॐ ह्रीं अहं णमो अरहंताणं",
        "ॐ ह्रीं श्रीं क्लीं धन-लक्ष्मी समृद्धि दायकेभ्यो नमः स्वाहा",
        48, 108, 108, "उत्तर-पूर्व (ईशान कोण)", "गुरुवार प्रातःकाल",
        "तुलसी/बेलपत्र + श्रीफल के साथ जाप। जाप के बाद आदिनाथ भगवान के चरणों में अर्पित करें।",
        "गुरुवार को एकाशन; मीठा भोजन ग्रहण योग्य", 48,
        "अंतराय का लाभ-अंतराय और दान-अंतराय पक्ष + गोत्र-कर्म का नीच-गोत्र पक्ष — दोनों एकसाथ हटाकर पुण्य-बंध का मार्ग खोलता है।")
)

// Karma → Bhaktamar shloka mapping
val KARMA_TO_BHAKTAMAR: Map<String, List<Int>> = mapOf(
    "Gyanavaraniya"     to listOf(6),
    "Darshanavaraniya"  to listOf(3, 5),
    "Mohaniya"          to listOf(12, 18),
    "Charitra Mohaniya" to listOf(12, 18),
    "Antaraya"          to listOf(19, 48),
    "Vedaniya"          to listOf(17),
    "Ayushya"           to listOf(45),
    "Naam"              to listOf(6),
    "Gotra"             to listOf(48)
)

fun getBhaktamarForKarma(karmaEn: String): List<BhaktamarShloka> {
    val numbers = KARMA_TO_BHAKTAMAR[karmaEn] ?: emptyList()
    return numbers.mapNotNull { n -> BHAKTAMAR_SHLOKAS.find { it.shlokaNumber == n } }
}
