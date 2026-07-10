package com.jainkundali.app.domain.engine

import com.jainkundali.app.domain.data.getKarmaSadhana
import java.util.Calendar
import kotlin.math.floor
import kotlin.math.max
import kotlin.math.min
import kotlin.math.round

// Personalized Shubha-Muhurta scanning engine.
// Source: PARITY-REPORT-2026 §"Web Port: Personalized Muhurta Scanning Engine"
// (UnifiedMuhurtaEngine).
//
// Scoring model (report):
//  - base score 100
//  - Rikta tithis (4, 9, 14) — excluded class: −40
//  - personal Antarāya level: −(antaraya/100 × 30)
//  - personal Mohaniya level: −(mohaniya/100 × 15)
//  - tiers: ≥75 EXCELLENT, <50 UNSUITABLE (filtered out), else ORDINARY

enum class MuhurtaSuitability { EXCELLENT, ORDINARY, UNSUITABLE }

data class PersonalizedMuhurta(
    val date: Long,
    val dateString: String,
    val tithiRaw: Int,
    val tithiIndex: Int,
    val tithiName: String,
    val activity: String,
    val personalizedScore: Double,
    val suitability: MuhurtaSuitability,
    val isKarmaShubhaTithi: Boolean
)

object MuhurtaEngine {

    private val TITHI_NAMES_HINDI = listOf(
        "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी",
        "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
        "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा"
    )

    // Rikta (empty) tithis — inauspicious for new undertakings.
    // Source: PARITY-REPORT-2026 EXCLUDED_TITHIS.
    private val RIKTA_TITHIS = setOf(4, 9, 14)

    /**
     * Scans the next [daysAhead] days and returns personalized Shubha-Muhurta windows,
     * scored against the user's Antarāya and Mohaniya levels.
     * UNSUITABLE windows are filtered out per PARITY-REPORT-2026.
     *
     * Source: PARITY-REPORT-2026 scanPersonalizedMuhurtas.
     */
    fun getPersonalizedMuhurtas(
        dominantKarmaEn: String,
        antarayaIntensity: Double = 0.0,
        mohaniyaIntensity: Double = 0.0,
        daysAhead: Int = 90
    ): List<PersonalizedMuhurta> {
        val sadhana = getKarmaSadhana(dominantKarmaEn)
        val shubhaTithis = sadhana.shubhaTithi.toSet()
        val today = Calendar.getInstance()
        val results = mutableListOf<PersonalizedMuhurta>()

        val obstacleFactor = max(0.0, min(100.0, antarayaIntensity)) / 100.0
        val delusionFactor = max(0.0, min(100.0, mohaniyaIntensity)) / 100.0

        var prevTithiRaw = -1

        for (i in 0 until daysAhead) {
            try {
                val d = Calendar.getInstance()
                d.set(today.get(Calendar.YEAR), today.get(Calendar.MONTH), today.get(Calendar.DAY_OF_MONTH) + i)
                val dateStr = "${d.get(Calendar.YEAR)}-${(d.get(Calendar.MONTH) + 1).toString().padStart(2, '0')}-${d.get(Calendar.DAY_OF_MONTH).toString().padStart(2, '0')}"
                val jde = AstronomyUtils.toJulianDay(dateStr, "06:00")

                val moonTropical = AstronomyUtils.getMoonTropicalLongitude(jde)
                val sunLong = AstronomyUtils.getSunLongitude(jde)
                val elongation = AstronomyUtils.normDeg(moonTropical - sunLong)
                val tithiRaw = floor(elongation / 12.0).toInt()

                // One window per tithi — skip repeated days of the same tithi (Vriddhi).
                if (tithiRaw == prevTithiRaw) continue
                prevTithiRaw = tithiRaw

                val tithiIndex = if (tithiRaw < 15) tithiRaw + 1 else tithiRaw - 14
                val paksha = if (elongation < 180) "शुक्ल" else "कृष्ण"
                val baseName = when {
                    tithiRaw == 29 -> "अमावस्या"
                    tithiRaw == 14 -> "पूर्णिमा"
                    else -> TITHI_NAMES_HINDI.getOrElse(tithiIndex - 1) { "तिथि" }
                }

                // Scoring per PARITY-REPORT-2026.
                val isRikta = RIKTA_TITHIS.contains(tithiIndex)
                val isKarmaShubha = shubhaTithis.contains(tithiRaw) || shubhaTithis.contains(tithiIndex)

                var score = 100.0
                if (isRikta) score -= 40.0
                score -= obstacleFactor * 30.0 + delusionFactor * 15.0
                if (isKarmaShubha) score += 10.0
                score = max(0.0, min(100.0, score))

                val suitability = when {
                    score >= 75.0 -> MuhurtaSuitability.EXCELLENT
                    score < 50.0 -> MuhurtaSuitability.UNSUITABLE
                    else -> MuhurtaSuitability.ORDINARY
                }

                results.add(
                    PersonalizedMuhurta(
                        date = d.timeInMillis,
                        dateString = dateStr,
                        tithiRaw = tithiRaw,
                        tithiIndex = tithiIndex,
                        tithiName = "$paksha $baseName",
                        activity = getActivityForTithi(tithiRaw),
                        personalizedScore = round(score * 10) / 10.0,
                        suitability = suitability,
                        isKarmaShubhaTithi = isKarmaShubha
                    )
                )
            } catch (_: Exception) {
                // Skip this day if computation fails
            }
        }

        // UNSUITABLE windows are filtered out. Source: PARITY-REPORT-2026.
        return results.filter { it.suitability != MuhurtaSuitability.UNSUITABLE }
    }

    fun getMuhurtaForActivity(activity: String, karmaEn: String, antarayaIntensity: Double = 0.0, mohaniyaIntensity: Double = 0.0): PersonalizedMuhurta? {
        return getPersonalizedMuhurtas(karmaEn, antarayaIntensity, mohaniyaIntensity, 90)
            .firstOrNull { it.activity == activity }
    }

    private fun getActivityForTithi(tithiRaw: Int): String {
        return when {
            tithiRaw in listOf(2, 3, 7, 8) -> "यंत्र स्थापना"
            tithiRaw in listOf(0, 1, 5, 6, 15, 16, 20, 21) -> "साधना आरंभ"
            tithiRaw in listOf(4, 9, 10, 19, 24, 25) -> "पूजा"
            tithiRaw in listOf(13, 14, 28, 29) -> "व्रत"
            else -> "साधना आरंभ"
        }
    }
}
