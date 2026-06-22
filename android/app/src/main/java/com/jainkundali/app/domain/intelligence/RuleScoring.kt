package com.jainkundali.app.domain.intelligence

import com.jainkundali.app.domain.engine.DashaEngine
import com.jainkundali.app.domain.models.DayContext
import com.jainkundali.app.domain.models.UserProfile

/**
 * Deterministic rule scorer. Separate positive and negative signal pools combined as:
 *     score = min(1, Σ positiveWeights) × max(0, 1 − Σ negativeWeights)
 *
 * Sources (see references/sources.md):
 *  - Signal design contract: REFERENCE.md §3 "Signal Scoring".
 *  - Ghātiyā karma set (Gyanavaraniya, Darshanavaraniya, Mohaniya, Antaraya): SKD + MP-§C1.
 *  - Compound ghātiyā doctrine (≥2 simultaneous ghātiyā in Udaya = critical): SKD + MP-§D4.
 *  - Kashayas (4 passions under Charitra Mohaniya) raising urgency: SKD + MP-§C1.
 *  - Ratnatraya (Samyag Darshan + Gyan + Charitra) as protective triad: TRK + MP-§C3.
 *  - Tithi Pravāh (birth-tithi peaks / nirjarā days): MP-§D2 L2.
 *  - Pancham Kāla karma-environment intensification: MP-§D2 L3.
 */
object RuleScoring {

    private val GHATIYA = setOf("Gyanavaraniya", "Darshanavaraniya", "Mohaniya", "Antaraya")
    private val AGHATIYA = setOf("Vedaniya", "Ayushya", "Naam", "Gotra")

    // Count distinct ghātiyā karmas active simultaneously across dominant, dasha, antardasha.
    // Compound udaya (≥2) creates confluent jñāna + darśana + cāritra obscuration. Source: SKD.
    private fun countActiveGhatiya(dominantKarmaEn: String, dashaLord: String, antarLord: String): Int {
        val active = mutableSetOf<String>()
        val effective = if (dominantKarmaEn == "Charitra Mohaniya") "Mohaniya" else dominantKarmaEn
        if (effective in GHATIYA) active.add(effective)
        if (dashaLord in GHATIYA) active.add(dashaLord)
        if (antarLord in GHATIYA) active.add(antarLord)
        return active.size
    }

    fun calculate(profile: UserProfile, day: DayContext, message: String): IntelligenceDecision {
        val dashaLord = profile.currentDasha.lord
        val antarLord = profile.currentDasha.antardashaInfo.lord
        val gunasthana = profile.gunasthana
        val nature = profile.nakshatraNature
        val dominantEn = profile.dominantKarmaEn
        val activeGhatiya = countActiveGhatiya(dominantEn, dashaLord, antarLord)

        val pravah = DashaEngine.tithiPravah(profile.birthTithiNum, day.tithiNum)

        val signals = listOf(
            // ── Positive: karmic intensity raises sādhana priority ─────────────────────
            IntelligenceSignal(
                key = "mohaniya_dasha", label = "मोहनीय महादशा", weight = 0.28, polarity = 1,
                matched = dashaLord == "Mohaniya",
                detail = "मोहनीय महादशा में राग-द्वेष और कषाय-उदय प्रबल — सम्यग्दर्शन हेतु विशेष सावधानी।"
            ),
            IntelligenceSignal(
                key = "darshanavaraniya_dasha", label = "दर्शनावरणीय दशा", weight = 0.20, polarity = 1,
                matched = dashaLord == "Darshanavaraniya",
                detail = "दर्शनावरणीय दशा में श्रद्धा डोलती है — जिन-भक्ति से सम्यक्-दृष्टि स्थिर करें।"
            ),
            IntelligenceSignal(
                key = "antaraya_dasha", label = "अंतराय दशा", weight = 0.16, polarity = 1,
                matched = dashaLord == "Antaraya",
                detail = "अंतराय दशा में शुभ कार्यों में विघ्न — दान और जिन-भक्ति से अंतराय क्षय करें।"
            ),
            IntelligenceSignal(
                key = "low_gunasthana", label = "निम्न गुणस्थान", weight = 0.22, polarity = 1,
                matched = gunasthana <= 2,
                detail = "प्रथम-द्वितीय गुणस्थान में मिथ्यात्व या अविरति प्रबल — सम्यग्दर्शन की दिशा में सचेत प्रयास करें।"
            ),
            IntelligenceSignal(
                key = "ashubha_nakshatra", label = "अशुभ नक्षत्र प्रकृति", weight = 0.14, polarity = 1,
                matched = nature == "ashubha",
                detail = "अशुभ नक्षत्र प्रकृति में कषाय-उदय की प्रवृत्ति अधिक रहती है।"
            ),
            IntelligenceSignal(
                key = "krishna_paksha", label = "कृष्ण पक्ष", weight = 0.10, polarity = 1,
                matched = day.paksha == "कृष्ण",
                detail = "कृष्ण पक्ष में तप और अंतर्मुख साधना अधिक फलदायी मानी गई है।"
            ),
            IntelligenceSignal(
                key = "intense_karma_narrative", label = "तीव्र कर्म-संकेत", weight = 0.18, polarity = 1,
                matched = Regex("विशेष प्रभाव|प्रकट होता है|चंचलता|तीव्र|उदय").containsMatchIn(message),
                detail = "कर्म-उदय संकेतक वाक्यों से आज की साधना-प्राथमिकता बढ़ती है।"
            ),
            IntelligenceSignal(
                key = "ghatiya_antardasha", label = "घातिया अंतर्दशा", weight = 0.14, polarity = 1,
                matched = antarLord in GHATIYA && antarLord != dashaLord,
                detail = "चल रही अंतर्दशा घातिया कर्म की है — महादशा के भीतर अतिरिक्त कषाय-उभार का काल।"
            ),
            IntelligenceSignal(
                key = "karma_dasha_resonance", label = "कर्म-दशा अनुनाद", weight = 0.16, polarity = 1,
                matched = dominantEn == dashaLord ||
                        (dominantEn == "Charitra Mohaniya" && dashaLord == "Mohaniya"),
                detail = "जन्म का प्रबल कर्म ही वर्तमान महादशा का स्वामी — कर्म-दशा अनुनाद से उसी कर्म का प्रबलतम उदय।"
            ),
            // Source: MP-§D2 L2 — birth tithi / +5 / +10 are karma-udaya peak days.
            IntelligenceSignal(
                key = "tithi_karma_peak", label = "तिथि-प्रवाह: कर्म-शिखर दिवस", weight = 0.16, polarity = 1,
                matched = pravah.status == DashaEngine.TithiPravahStatus.KARMA_PEAK,
                detail = "आज की तिथि जन्म-तिथि से कर्म-उदय शिखर पर — संयम में विशेष सजगता आवश्यक।"
            ),
            // Source: MP-§D2 L2 — +6 / +11 / +16 from birth tithi are nirjarā-opportunity days.
            IntelligenceSignal(
                key = "tithi_nirjara_day", label = "तिथि-प्रवाह: निर्जरा दिवस", weight = 0.12, polarity = 1,
                matched = pravah.status == DashaEngine.TithiPravahStatus.NIRJARA,
                detail = "आज निर्जरा-तिथि है — तप और स्वाध्याय का फल कई गुना, अवसर न चूकें।"
            ),
            // Compound ghātiyā: 2+ distinct ghātiyā karmas in simultaneous Udaya.
            // Doctrinally critical — confluent obscuration of jñāna + darśana + cāritra.
            // Source: SKD compound-prakṛti chapter; MP-§D4.
            IntelligenceSignal(
                key = "compound_ghatiya", label = "यौगिक घातिया उदय", weight = 0.22, polarity = 1,
                matched = activeGhatiya >= 2,
                detail = "${activeGhatiya} घातिया कर्मों का एक साथ उदय — ज्ञान, दर्शन और चारित्र तीनों पर एकसाथ दबाव; अत्यंत सावधानी और तीव्र साधना का काल।"
            ),
            // Kashayas (Krodh/Mana/Maya/Lobha) are sub-prakṛtis of Charitra Mohaniya.
            // Active in Udaya when Mohaniya is both dominant karma AND current dasha/antardasha.
            // Source: SKD + MP-§C1.
            IntelligenceSignal(
                key = "kashayas_inflamed", label = "कषाय-प्रज्वलन", weight = 0.14, polarity = 1,
                matched = (dominantEn == "Mohaniya" || dominantEn == "Charitra Mohaniya") &&
                        (dashaLord == "Mohaniya" || antarLord == "Mohaniya"),
                detail = "मोहनीय कर्म का बहु-स्तरीय उदय — कषाय (क्रोध/मान/माया/लोभ) अत्यंत प्रबल; क्षमापना और मार्दव धर्म अनिवार्य।"
            ),

            // ── Negative: favourable conditions lower sādhana urgency ──────────────────
            IntelligenceSignal(
                key = "high_gunasthana", label = "उच्च गुणस्थान", weight = 0.30, polarity = -1,
                matched = gunasthana >= 4,
                detail = "चतुर्थ+ गुणस्थान — सम्यग्दर्शन की स्थिरता है; रत्नत्रय का आधार दृढ़ है।"
            ),
            IntelligenceSignal(
                key = "param_shubha_nakshatra", label = "परम शुभ नक्षत्र", weight = 0.22, polarity = -1,
                matched = nature == "param_shubha",
                detail = "परम शुभ (तीर्थंकर-जन्म) नक्षत्र — विशेष पुण्य-प्रभाव और साधना के लिए अतिरिक्त अनुकूलता।"
            ),
            IntelligenceSignal(
                key = "shubha_nakshatra", label = "शुभ नक्षत्र", weight = 0.12, polarity = -1,
                matched = nature == "shubha",
                detail = "शुभ नक्षत्र प्रकृति साधना के लिए अनुकूल आधार देती है।"
            ),
            IntelligenceSignal(
                key = "aghatiya_dasha", label = "अघातिया दशा", weight = 0.18, polarity = -1,
                matched = dashaLord in AGHATIYA,
                detail = "अघातिया-कर्म दशा में आत्म-गुणों (ज्ञान/दर्शन/चारित्र) का सीधा घात नहीं — साधना सहज रहती है।"
            ),
            // Ratnatraya alignment: Samyag Darshan (gunasthana 4+) + shubha/param_shubha
            // nakshatra + non-ghātiyā dasha = the protective triad reduces karma-bandha rate.
            // Source: TRK + MP-§C3.
            IntelligenceSignal(
                key = "ratnatraya_aligned", label = "रत्नत्रय अनुकूलता", weight = 0.14, polarity = -1,
                matched = gunasthana >= 4 && nature != "ashubha" && dashaLord !in GHATIYA,
                detail = "रत्नत्रय की सम्यक् दिशा में — सम्यग्दर्शन, ज्ञान और चारित्र के अनुकूल स्थिति; कर्म-बंध की दर कम होती है।"
            ),
        )

        val positiveKeys = setOf(
            "mohaniya_dasha", "darshanavaraniya_dasha", "antaraya_dasha", "low_gunasthana",
            "ashubha_nakshatra", "krishna_paksha", "intense_karma_narrative",
            "ghatiya_antardasha", "karma_dasha_resonance", "tithi_karma_peak",
            "tithi_nirjara_day", "compound_ghatiya", "kashayas_inflamed"
        )
        val positiveSum = signals.filter { it.matched && it.key in positiveKeys }.sumOf { it.weight }
        val negativeSum = signals.filter { it.matched && it.polarity < 0 }.sumOf { it.weight }

        val ruleScore = minOf(1.0, positiveSum) * maxOf(0.0, 1.0 - negativeSum)

        return IntelligenceDecision(
            ruleScore = ruleScore,
            modelScore = null,
            finalScore = ruleScore,
            fallbackUsed = true,
            reasonCodes = signals.filter { it.matched }.map { it.key },
            signals = signals,
            priority = priorityFor(ruleScore)
        )
    }

    fun priorityFor(score: Double): DecisionPriority = when {
        score >= 0.75 -> DecisionPriority.URGENT
        score >= 0.55 -> DecisionPriority.HIGH
        score >= 0.35 -> DecisionPriority.MEDIUM
        else -> DecisionPriority.LOW
    }
}
