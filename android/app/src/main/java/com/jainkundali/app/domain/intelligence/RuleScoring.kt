package com.jainkundali.app.domain.intelligence

import com.jainkundali.app.domain.models.DayContext
import com.jainkundali.app.domain.models.UserProfile

/**
 * Deterministic rule scorer. Separate positive and negative signal pools combined per
 * REFERENCE.md §3 "Signal Scoring":
 *
 *     score = min(1, Σ positiveWeights) × max(0, 1 − Σ negativeWeights)
 *
 * Positive signals = conditions that raise today's sādhana priority (karmic intensity / instability).
 * Negative signals = favourable conditions that lower it (spiritual stability, auspicious timing).
 */
object RuleScoring {

    // The four ghātiyā (soul-obscuring) karmas. Their udaya — as mahādaśā or as the running
    // antardaśā — raises sādhana priority because they directly veil jñāna / darśana / cāritra.
    private val GHATIYA = setOf("Gyanavaraniya", "Darshanavaraniya", "Mohaniya", "Antaraya")
    private val AGHATIYA = setOf("Vedaniya", "Ayushya", "Naam", "Gotra")

    fun calculate(profile: UserProfile, day: DayContext, message: String): IntelligenceDecision {
        val dashaLord = profile.currentDasha.lord
        val antarLord = profile.currentDasha.antardashaInfo.lord
        val gunasthana = profile.gunasthana
        val nature = profile.nakshatraNature

        val signals = listOf(
            // ── Positive: karmic intensity raises priority ─────────────────────────────
            IntelligenceSignal(
                key = "mohaniya_dasha", label = "मोहनीय महादशा", weight = 0.28, polarity = 1,
                matched = dashaLord == "Mohaniya",
                detail = "मोहनीय महादशा में राग-द्वेष और निर्णय-अस्थिरता प्रबल रहती है।"
            ),
            IntelligenceSignal(
                key = "darshanavaraniya_dasha", label = "दर्शनावरणीय दशा", weight = 0.20, polarity = 1,
                matched = dashaLord == "Darshanavaraniya",
                detail = "दर्शनावरणीय दशा में श्रद्धा डोलती है, स्पष्टता घटती है।"
            ),
            IntelligenceSignal(
                key = "antaraya_dasha", label = "अंतराय दशा", weight = 0.16, polarity = 1,
                matched = dashaLord == "Antaraya",
                detail = "अंतराय दशा में शुभ कार्यों में विघ्न आते हैं।"
            ),
            IntelligenceSignal(
                key = "low_gunasthana", label = "निम्न गुणस्थान", weight = 0.22, polarity = 1,
                matched = gunasthana <= 2,
                detail = "निम्न गुणस्थान में स्थिरता हेतु अतिरिक्त अनुशासन आवश्यक है।"
            ),
            IntelligenceSignal(
                key = "ashubha_nakshatra", label = "अशुभ नक्षत्र प्रकृति", weight = 0.14, polarity = 1,
                matched = nature == "ashubha",
                detail = "अशुभ नक्षत्र प्रकृति में कषाय-उदय की प्रवृत्ति अधिक होती है।"
            ),
            IntelligenceSignal(
                key = "krishna_paksha", label = "कृष्ण पक्ष", weight = 0.10, polarity = 1,
                matched = day.paksha == "कृष्ण",
                detail = "कृष्ण पक्ष में अंतर्मुख साधना पर अधिक बल उपयोगी माना गया है।"
            ),
            IntelligenceSignal(
                key = "intense_karma_narrative", label = "तीव्र कर्म-संकेत", weight = 0.18, polarity = 1,
                matched = Regex("विशेष प्रभाव|प्रकट होता है|चंचलता|तीव्र").containsMatchIn(message),
                detail = "कर्म-उदय संकेतक वाक्यों से आज की साधना-प्राथमिकता बढ़ती है।"
            ),
            IntelligenceSignal(
                key = "ghatiya_antardasha", label = "घातिया अंतर्दशा", weight = 0.14, polarity = 1,
                matched = antarLord in GHATIYA && antarLord != dashaLord,
                detail = "चल रही अंतर्दशा घातिया कर्म की है — महादशा के भीतर अतिरिक्त कषाय-उभार का काल।"
            ),
            IntelligenceSignal(
                key = "karma_dasha_resonance", label = "कर्म-दशा अनुनाद", weight = 0.16, polarity = 1,
                matched = profile.dominantKarmaEn == dashaLord ||
                    (profile.dominantKarmaEn == "Charitra Mohaniya" && dashaLord == "Mohaniya"),
                detail = "जन्म का प्रबल कर्म ही वर्तमान महादशा का स्वामी है — उसी कर्म का प्रबल उदय (अनुनाद)।"
            ),

            // ── Negative: favourable conditions lower priority ─────────────────────────
            IntelligenceSignal(
                key = "high_gunasthana", label = "उच्च गुणस्थान", weight = 0.30, polarity = -1,
                matched = gunasthana >= 4,
                detail = "चतुर्थ+ गुणस्थान में सम्यग्दर्शन की स्थिरता है — आधार दृढ़ है।"
            ),
            IntelligenceSignal(
                key = "param_shubha_nakshatra", label = "परम शुभ नक्षत्र", weight = 0.22, polarity = -1,
                matched = nature == "param_shubha",
                detail = "परम शुभ (तीर्थंकर-जन्म) नक्षत्र साधना के लिए विशेष अनुकूल है।"
            ),
            IntelligenceSignal(
                key = "shubha_nakshatra", label = "शुभ नक्षत्र", weight = 0.12, polarity = -1,
                matched = nature == "shubha",
                detail = "शुभ नक्षत्र प्रकृति साधना के लिए अनुकूल आधार देती है।"
            ),
            IntelligenceSignal(
                key = "aghatiya_dasha", label = "अघातिया दशा", weight = 0.18, polarity = -1,
                matched = dashaLord in AGHATIYA,
                detail = "अघातिया-कर्म दशा में आत्म-गुणों का सीधा घात नहीं होता — साधना सहज रहती है।"
            ),
        )

        val positiveSum = signals.filter { it.matched && it.polarity > 0 }.sumOf { it.weight }
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
