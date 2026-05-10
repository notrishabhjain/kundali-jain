package com.jainkundali.app.domain.engine

import com.jainkundali.app.domain.models.CombinedRemedy
import com.jainkundali.app.domain.models.UserProfile
import com.jainkundali.app.domain.data.getKarmaSadhana
import com.jainkundali.app.domain.data.getDashaSadhana

object RemedyEngine {

    fun generateRemedies(profile: UserProfile): CombinedRemedy {
        val karmaSadhana = getKarmaSadhana(profile.dominantKarmaEn)
        val dashaSadhana = getDashaSadhana(profile.currentDasha.lord)

        return CombinedRemedy(
            primarySadhana = "श्री ${profile.tirthankarAffinityHindi} भगवान का स्मरण करते हुए ${karmaSadhana.primaryMantra.text} का ${karmaSadhana.primaryMantra.count} बार जाप।",
            dashaRemedy = dashaSadhana.dashaSadhana,
            karmaRemedy = karmaSadhana.visheshUpaya,
            recommendedTithi = "${dashaSadhana.bestTithi} (दशा अनुसार) तथा ${karmaSadhana.shubhaTithi.joinToString(", ")} तिथियाँ (कर्म अनुसार)",
            yantraRecommendation = "${karmaSadhana.yantra.name}: ${karmaSadhana.yantra.effect} (${karmaSadhana.yantra.installation})",
            tapasyaRecommendation = "${karmaSadhana.tapasya.name}: ${karmaSadhana.tapasya.description}"
        )
    }
}
