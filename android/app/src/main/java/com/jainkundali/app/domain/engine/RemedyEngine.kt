// Remedy engine — generates karma-specific sadhana, dasha remedy, and Bhaktamar
// shloka prescription from the user's dominant karma + dasha lord.
//
// Sources:
//  - Karma sadhana assignments: references/sources.md (Codex MP-§F1-§F3).
//  - Bhaktamar Stotra shloka mapping: Research Report §5-§7 + BKT-1 (Manatunga Acharya).
//  - Panch Samvay Pursharth principle: Research Report §1 + Tattvarthasutra ch. 5.
package com.jainkundali.app.domain.engine

import com.jainkundali.app.domain.models.CombinedRemedy
import com.jainkundali.app.domain.models.UserProfile
import com.jainkundali.app.domain.data.getKarmaSadhana
import com.jainkundali.app.domain.data.getDashaSadhana
import com.jainkundali.app.domain.data.getBhaktamarForKarma

object RemedyEngine {

    fun generateRemedies(profile: UserProfile): CombinedRemedy {
        val karmaSadhana = getKarmaSadhana(profile.dominantKarmaEn)
        val dashaSadhana = getDashaSadhana(profile.currentDasha.lord)

        // Bhaktamar shloka lookup — first match for dominant karma.
        // Source: Research Report §5-§7 + BKT-1.
        val bhaktamarShlokas = getBhaktamarForKarma(profile.dominantKarmaEn)
        val primary = bhaktamarShlokas.firstOrNull()

        val bhaktamarShloka = if (primary != null)
            "भक्तामर स्तोत्र श्लोक ${primary.shlokaNumber} — ${primary.name}: ${primary.targetAffliction}"
        else
            "भक्तामर स्तोत्र का सम्पूर्ण पाठ प्रातःकाल — सर्व कर्म-निर्जरा का परम उपाय।"

        val bhaktamarMantra = if (primary != null)
            "ऋद्धि मंत्र: ${primary.riddhiMantra} (${primary.repetitionRiddhi} बार) | साधना मंत्र: ${primary.remedialMantra} (${primary.repetitionMantra} बार) | श्लोक: ${primary.repetitionShloka} बार"
        else
            "णमो अरहंताणं — भक्तामर के प्रत्येक श्लोक से पूर्व ११ बार।"

        val bhaktamarProtocol = if (primary != null)
            "दिशा: ${primary.direction} | समय: ${primary.timeWindow} | ${primary.somaticProtocol} | आहार: ${primary.dietaryRestrictions} | अवधि: ${primary.timelineDays} दिन"
        else
            "ईशान कोण में मुख करके, प्रातः ४ से ७ बजे, शुद्ध वातावरण में।"

        return CombinedRemedy(
            primarySadhana = "श्री ${profile.tirthankarAffinityHindi} भगवान का स्मरण करते हुए ${karmaSadhana.primaryMantra.text} का ${karmaSadhana.primaryMantra.count} बार जाप।",
            dashaRemedy = dashaSadhana.dashaSadhana,
            karmaRemedy = karmaSadhana.visheshUpaya,
            recommendedTithi = "${dashaSadhana.bestTithi} (दशा अनुसार) तथा ${karmaSadhana.shubhaTithi.joinToString(", ")} तिथियाँ (कर्म अनुसार)",
            yantraRecommendation = "${karmaSadhana.yantra.name}: ${karmaSadhana.yantra.effect} (${karmaSadhana.yantra.installation})",
            tapasyaRecommendation = "${karmaSadhana.tapasya.name}: ${karmaSadhana.tapasya.description}",
            bhaktamarShloka = bhaktamarShloka,
            bhaktamarMantra = bhaktamarMantra,
            bhaktamarProtocol = bhaktamarProtocol
        )
    }
}
