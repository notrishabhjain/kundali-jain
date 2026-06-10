package com.jainkundali.app.domain.engine

import com.jainkundali.app.domain.models.KarmaState
import com.jainkundali.app.domain.data.KARMA_SADHANA
import kotlin.math.max
import kotlin.math.min

/**
 * 8-karma analysis engine — Digambar karma-siddhānta.
 *
 * Sources (see references/sources.md):
 *  - The 8 karmas (4 ghātiyā + 4 aghātiyā): Shatkhandagama (SKD), distilled in MP-§G2/C and
 *    MP-§F1 (Namokar's 5-pada → karma-pair mapping).
 *  - State labels Udaya / Sattā / Nirjarā: SKD karma-prakṛti chapter — the three operative
 *    states of a karma-prakṛti at any instant; MP-§D4 for engine contract.
 *  - Intensity weights per karma (Mohaniya 65, Antaraya 60, Vedaniya 50, etc.): baseline
 *    derived from MP-§C1 (relative prabal-tā). Verse-level support for the exact numeric
 *    weights is pending OCR of SKD — flagged [REQUIRES_RESEARCH] until cited from a verse.
 *  - Gunasthāna damping (each step ≥ 2 reduces intensity): MP-§D4 + classical śloka
 *    "yathā-yathā gunasthāna-vṛddhi tathā tathā karma-kṣaya".
 *  - Charitra Mohaniya is a sub-prakṛti of Mohaniya — not a separate primary karma; the
 *    aliasing here matches MP-§C1's treatment.
 */
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

        // Gunasthāna is capped at 4 in Pancham Kāla (Samyak Darshan is the ceiling — no muni
        // gunasthānas attainable). Source: MP-§D2 L3 + Codex constraint G2-C3.
        val effectiveGunasthana = gunasthana.coerceIn(1, DashaEngine.PANCHAM_KAAL_MAX_GUNASTHANA)

        return ALL_KARMAS.map { karma ->
            val sadhana = KARMA_SADHANA[karma.en]
            // LAYER 3 modifier: the 5th-Ara karma environment intensifies every karma's
            // operative load by 1.4x before person-specific modifiers. Source: MP-§D2 L3.
            var intensity = (karma.base * DashaEngine.PANCHAM_KAAL_KARMA_FACTOR).toInt()
            var state = "Satta"

            if (karma.en == effectiveDominant) {
                intensity += 30
                state = "Udaya"
            }

            if (karma.en == dashaLord) {
                intensity += 20
                state = "Udaya"
            }

            if (effectiveGunasthana > 1) {
                intensity -= (effectiveGunasthana - 1) * 5
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
