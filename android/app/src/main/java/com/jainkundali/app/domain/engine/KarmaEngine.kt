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
        // "Charitra Mohaniya" is a sub-type of Mohaniya — it does not appear among the 8
        // primary karmas. Map it onto Mohaniya so the प्रबल-boost still lands.
        val effectiveDominant = if (dominantKarmaEn == "Charitra Mohaniya") "Mohaniya" else dominantKarmaEn

        return ALL_KARMAS.map { karma ->
            val sadhana = KARMA_SADHANA[karma.en]
            var intensity = karma.base
            var state = "Satta"

            if (karma.en == effectiveDominant) {
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

            // Use the user's actual dominant Hindi name (which may be "चारित्र मोहनीय") when
            // rendering the manifestation for the Mohaniya row — so the user sees their own kāraṇa.
            val effectiveSadhana = if (
                karma.en == "Mohaniya" && dominantKarmaEn == "Charitra Mohaniya"
            ) {
                KARMA_SADHANA["Charitra Mohaniya"] ?: sadhana
            } else sadhana

            val manifestation = if (effectiveSadhana != null) {
                if (intensity >= 70) effectiveSadhana.statusWhenDominant else effectiveSadhana.statusWhenNormal
            } else {
                karma.hi
            }

            val nirjaraPractice = if (effectiveSadhana != null) {
                "${effectiveSadhana.primaryMantra.count} बार ${effectiveSadhana.primaryMantra.text} (${effectiveSadhana.primaryMantra.timing})। ${effectiveSadhana.samanyaUpaya}"
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
