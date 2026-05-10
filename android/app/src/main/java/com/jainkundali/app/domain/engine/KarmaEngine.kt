package com.jainkundali.app.domain.engine

import com.jainkundali.app.domain.models.KarmaState
import com.jainkundali.app.domain.data.KARMA_SADHANA
import kotlin.math.max
import kotlin.math.min

object KarmaEngine {

    private data class KarmaBase(val en: String, val hi: String, val base: Int)

    private val ALL_KARMAS = listOf(
        KarmaBase("Gyanavaraniya", "ज्ञानावरणीय", 45),
        KarmaBase("Darshanavaraniya", "दर्शनावरणीय", 40),
        KarmaBase("Vedaniya", "वेदनीय", 50),
        KarmaBase("Mohaniya", "मोहनीय", 65),
        KarmaBase("Ayushya", "आयुष्य", 30),
        KarmaBase("Naam", "नाम", 45),
        KarmaBase("Gotra", "गोत्र", 20),
        KarmaBase("Antaraya", "अंतराय", 60)
    )

    fun calculateKarmaProfile(dominantKarmaEn: String, dashaLord: String, gunasthana: Int): List<KarmaState> {
        return ALL_KARMAS.map { karma ->
            val sadhana = KARMA_SADHANA[karma.en]
            var intensity = karma.base
            var state = "Satta"

            if (karma.en == dominantKarmaEn) {
                intensity += 30
                state = "Udaya"
            }

            if (karma.en == dashaLord) {
                intensity += 20
                state = "Udaya"
            }

            if (gunasthana > 1) {
                intensity -= (gunasthana - 1) * 5
                if (intensity < 40) state = "Nirjara"
            }

            intensity = max(10, min(100, intensity))

            val manifestation = if (sadhana != null) {
                if (intensity >= 70) sadhana.statusWhenDominant else sadhana.statusWhenNormal
            } else {
                karma.hi
            }

            val nirjaraPractice = if (sadhana != null) {
                "${sadhana.primaryMantra.count} बार ${sadhana.primaryMantra.text} (${sadhana.primaryMantra.timing})। ${sadhana.samanyaUpaya}"
            } else {
                "णमोकार मंत्र का जाप।"
            }

            KarmaState(
                id = karma.en.lowercase().replace(Regex("\\s+"), "_"),
                karmaEn = karma.en,
                karmaHindi = karma.hi,
                intensity = intensity,
                state = state,
                manifestation = manifestation,
                nirjaraPractice = nirjaraPractice
            )
        }
    }
}
