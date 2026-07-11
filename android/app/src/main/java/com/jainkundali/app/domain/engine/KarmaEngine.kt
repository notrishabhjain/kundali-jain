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
 *  - Compound ghātiyā (≥2 ghātiyā in simultaneous Udaya): SKD compound-prakṛti treatment;
 *    MP-§D4 "concurrent obscuration" clause — adds 15 intensity pts per additional ghātiyā.
 *    [REQUIRES_RESEARCH] verse-level OCR pending.
 *  - Kashayas (4 passions × 4 intensities under Charitra Mohaniya): SKD; MP-§C1.
 *  - 5 Karma-Bandha factors (Mithyatva, Avirati, Pramada, Kashaya, Yoga): SKD. [REQUIRES_RESEARCH].
 */
object KarmaEngine {

    private val GHATIYA_SET = setOf("Gyanavaraniya", "Darshanavaraniya", "Mohaniya", "Antaraya")

    // Destructive karmas receiving the 1.4× Pancham Kāla multiplier while in dashā transit.
    // Source: PARITY-REPORT-2026 (Karma Multiplier parity row).
    private val PANCHAM_KAAL_DESTRUCTIVE = setOf("Mohaniya", "Antaraya")

    /** Count distinct ghātiyā karmas in simultaneous Udaya. Compound (≥2) creates confluent
     *  obscuration of jñāna + darśana + cāritra. Source: SKD + MP-§D4. */
    fun countCompoundGhatiya(dominantKarmaEn: String, dashaLord: String, antarLord: String): Int {
        val active = mutableSetOf<String>()
        val effective = if (dominantKarmaEn == "Charitra Mohaniya") "Mohaniya" else dominantKarmaEn
        if (effective in GHATIYA_SET) active.add(effective)
        if (dashaLord in GHATIYA_SET) active.add(dashaLord)
        if (antarLord.isNotEmpty() && antarLord in GHATIYA_SET) active.add(antarLord)
        return active.size
    }

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

    fun calculateKarmaProfile(dominantKarmaEn: String, dashaLord: String, gunasthana: Int, antarLord: String = ""): List<KarmaState> {
        // "Charitra Mohaniya" is a sub-type of Mohaniya — it does not appear among the 8
        // primary karmas. Map it onto Mohaniya so the प्रबल-boost still lands.
        val effectiveDominant = if (dominantKarmaEn == "Charitra Mohaniya") "Mohaniya" else dominantKarmaEn

        // Gunasthāna is capped at 4 in Pancham Kāla (Samyak Darshan is the ceiling — no muni
        // gunasthānas attainable). Source: MP-§D2 L3 + Codex constraint G2-C3.
        val effectiveGunasthana = gunasthana.coerceIn(1, DashaEngine.PANCHAM_KAAL_MAX_GUNASTHANA)

        // Compound ghātiyā bonus: each additional active ghātiyā beyond the first adds 15 pts
        // to ghātiyā-karma intensity (confluent obscuration). Source: SKD + MP-§D4.
        val compoundCount = countCompoundGhatiya(dominantKarmaEn, dashaLord, antarLord)
        val compoundBonus = maxOf(0, (compoundCount - 1) * 15)

        return ALL_KARMAS.map { karma ->
            val sadhana = KARMA_SADHANA[karma.en]
            // Pancham Kāla 1.4× multiplier applies to the DESTRUCTIVE karmas (Mohaniya,
            // Antaraya) when in dashā transit — not blanket to all karmas.
            // Source: PARITY-REPORT-2026 Karma Multiplier parity row (primary; supersedes
            // the earlier blanket MP-§D2 L3 reading).
            var intensity = if (karma.en in PANCHAM_KAAL_DESTRUCTIVE && karma.en == dashaLord) {
                (karma.base * DashaEngine.PANCHAM_KAAL_KARMA_FACTOR).toInt()
            } else {
                karma.base
            }
            var state = "Satta"

            if (karma.en == effectiveDominant) {
                intensity += 30
                state = "Udaya"
            }

            if (karma.en == dashaLord) {
                intensity += 20
                state = "Udaya"
            }

            // Apply compound ghātiyā bonus to ghātiyā karmas in Udaya
            if (karma.en in GHATIYA_SET && state == "Udaya") {
                intensity += compoundBonus
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
