package com.jainkundali.app.domain.engine

import com.jainkundali.app.domain.models.DashaInfo
import com.jainkundali.app.domain.models.AntardashaInfo
import com.jainkundali.app.domain.models.PratyantardashInfo
import com.jainkundali.app.domain.data.getNakshatraByDegree
import kotlin.math.*

/**
 * Jain dashā engine. Uses the 8-karma cycle (Gyānāvaraṇīya → Antarāya, not Vedic Vimśottarī)
 * with a 3-level decomposition: Mahādaśā → Antardaśā → Pratyantardaśā.
 *
 * Sources (see references/sources.md — PARITY-REPORT-2026 is PRIMARY per user directive):
 *  - 8-karma dashā ordering: MP-§D2 + Codex constraint G2-C1 (zero Vedic mixing).
 *  - Per-lord year allotments (Mohaniya 28, Gyānāvaraṇīya 15, Antaraya 14, Naam 12,
 *    Vedaniya 10, Darśanāvaraṇīya 9, Gotra 8, Āyuṣya 4): PARITY-REPORT-2026
 *    STANDARD_DASHA_YEARS — supersedes the earlier MP-§D2 distillation values.
 *  - LAYER 2 "Tithi Pravāh" phase coefficient (Shukla up to +15%, Krishna up to −15%
 *    of every dashā duration, scaled by birth Moon-Sun elongation): PARITY-REPORT-2026.
 *    The daily karma-peak / nirjarā status layer (MP-§D2 L2) is retained as an
 *    additional, non-conflicting output.
 *  - LAYER 3 "Pancham Kāla Position Modifier" (1.4× duration on the destructive
 *    karmas Mohaniya + Antaraya): PARITY-REPORT-2026.
 *  - Antardaśā / Pratyantardaśā proportional sub-allocation (lord-years / 100 × parent-years):
 *    standard Jain treatment, MP-§D2.
 *  - Birth-nakshatra → starting-lord mapping (nakshatra-index mod 8): MP-§D2's "Nakshatra
 *    Pravāh Daśā" layer (LAYER 1) — not contradicted by the report, retained.
 */
object DashaEngine {

    // Destructive karmas whose dashā durations stretch 1.4× in the 5th Ara.
    // Source: PARITY-REPORT-2026 computeDynamicDashas (Layer 3 modifier).
    private val PANCHAM_KAAL_DESTRUCTIVE_LORDS = setOf("Mohaniya", "Antaraya")

    /**
     * LAYER 2 Tithi Pravāh phase coefficient from the birth Moon-Sun elongation.
     * Shukla paksha (elongation < 180°) expands durations up to +15%; Krishna paksha
     * contracts up to −15%. Negative/invalid elongation → neutral 1.0.
     * Source: PARITY-REPORT-2026.
     */
    fun tithiPravahPhaseCoefficient(moonElongation: Double): Double {
        if (moonElongation < 0.0 || moonElongation >= 360.0) return 1.0
        return if (moonElongation < 180.0)
            1.0 + (moonElongation / 360.0) * 0.15
        else
            1.0 - ((moonElongation - 180.0) / 360.0) * 0.15
    }

    /** Effective mahādaśā duration after Layer 3 + Layer 2 modifiers.
     *  Source: PARITY-REPORT-2026 computeDynamicDashas. */
    fun effectiveDashaYears(lord: String, phaseCoefficient: Double): Double {
        var years = (JAIN_DASHA_YEARS[lord] ?: 10).toDouble()
        if (lord in PANCHAM_KAAL_DESTRUCTIVE_LORDS) {
            years *= PANCHAM_KAAL_KARMA_FACTOR
        }
        return years * phaseCoefficient
    }

    // ── LAYER 3: Pancham Kāla position modifier ─────────────────────────────────────────────
    // Source: MP-§D2 L3 — "We are ~2,550 years into the 21,000-year 5th Ara. Apply 1.4x karma
    // environment factor to all predictions. Max achievable: Gunasthana 4 (Samyak Darshan)."
    const val PANCHAM_KAAL_TOTAL_YEARS = 21000
    const val PANCHAM_KAAL_ELAPSED_YEARS = 2550
    const val PANCHAM_KAAL_KARMA_FACTOR = 1.4
    const val PANCHAM_KAAL_MAX_GUNASTHANA = 4

    /** Fraction of the 5th Ara already elapsed (≈ 0.121). Source: MP-§D2 L3. */
    fun panchamKaalPosition(): Double =
        PANCHAM_KAAL_ELAPSED_YEARS.toDouble() / PANCHAM_KAAL_TOTAL_YEARS

    // ── LAYER 2: Tithi Pravāh (monthly tithi cycle vs. birth tithi) ─────────────────────────
    // Source: MP-§D2 L2 — karma PEAK days are the birth tithi and the 5th and 10th tithi from
    // it; karma NIRJARĀ days are the 6th, 11th and 16th tithi from it (offsets within the
    // 30-tithi lunar month).

    enum class TithiPravahStatus { KARMA_PEAK, NIRJARA, SAMANYA }

    data class TithiPravah(
        val status: TithiPravahStatus,
        // 0..29 — how many tithis today is ahead of the birth tithi in the lunar month.
        val offsetFromBirthTithi: Int,
        val detail: String
    )

    /**
     * Layer-2 status for today. [birthTithi] and [todayTithi] are 1..30 lunar-month tithi
     * numbers; returns SAMANYA when either is unknown (0). Source: MP-§D2 L2.
     */
    fun tithiPravah(birthTithi: Int, todayTithi: Int): TithiPravah {
        if (birthTithi !in 1..30 || todayTithi !in 1..30) {
            return TithiPravah(TithiPravahStatus.SAMANYA, -1, "तिथि-प्रवाह की गणना उपलब्ध नहीं है।")
        }
        val offset = ((todayTithi - birthTithi) % 30 + 30) % 30
        return when (offset) {
            // Source: MP-§D2 L2 — birth tithi, 5th and 10th from it = karma peak days.
            0, 5, 10 -> TithiPravah(
                TithiPravahStatus.KARMA_PEAK, offset,
                "आज की तिथि आपकी जन्म-तिथि से $offset स्थान पर है — कर्म-उदय का शिखर दिवस। आज संयम और साधना में विशेष सजगता रखें।"
            )
            // Source: MP-§D2 L2 — 6th, 11th and 16th from birth tithi = karma nirjarā days.
            6, 11, 16 -> TithiPravah(
                TithiPravahStatus.NIRJARA, offset,
                "आज की तिथि आपकी जन्म-तिथि से $offset स्थान पर है — कर्म-निर्जरा का विशेष अवसर। आज का तप, उपवास और स्वाध्याय कई गुना फलदायी है।"
            )
            else -> TithiPravah(
                TithiPravahStatus.SAMANYA, offset,
                "आज की तिथि आपकी जन्म-तिथि से $offset स्थान पर है — सामान्य प्रवाह। नित्य-नियम निरंतर रखें।"
            )
        }
    }

    val JAIN_DASHA_ORDER = listOf(
        "Gyanavaraniya", "Darshanavaraniya", "Vedaniya", "Mohaniya",
        "Ayushya", "Naam", "Gotra", "Antaraya"
    )

    // Source: PARITY-REPORT-2026 STANDARD_DASHA_YEARS (primary; sums to 100).
    val JAIN_DASHA_YEARS: Map<String, Int> = mapOf(
        "Gyanavaraniya" to 15, "Darshanavaraniya" to 9, "Vedaniya" to 10, "Mohaniya" to 28,
        "Ayushya" to 4, "Naam" to 12, "Gotra" to 8, "Antaraya" to 14
    )

    val JAIN_DASHA_HINDI: Map<String, String> = mapOf(
        "Gyanavaraniya" to "ज्ञानावरणीय",
        "Darshanavaraniya" to "दर्शनावरणीय",
        "Vedaniya" to "वेदनीय",
        "Mohaniya" to "मोहनीय",
        "Ayushya" to "आयुष्य",
        "Naam" to "नाम",
        "Gotra" to "गोत्र",
        "Antaraya" to "अंतराय"
    )

    private fun yearToDateString(year: Double): String {
        val y = year.toInt()
        val m = ((year - y) * 12).toInt() + 1
        val d = (((year - y) * 12 - (m - 1)) * 30).toInt() + 1
        return "$y-${m.toString().padStart(2, '0')}-${d.coerceAtMost(28).toString().padStart(2, '0')}"
    }

    fun calculateDasha(siderealDeg: Double, dobStr: String, birthMoonElongation: Double = -1.0): DashaInfo {
        try {
            val nakshatra = getNakshatraByDegree(siderealDeg)
            val nakshatraIndex = nakshatra.index

            val startLordIndex = nakshatraIndex % 8
            val posInNakshatra = ((siderealDeg % 360.0) + 360.0) % 360.0 - nakshatra.startDeg
            val nakshatraSpan = 13.333333
            val fractionElapsed = (posInNakshatra / nakshatraSpan).coerceIn(0.0, 1.0)

            // LAYER 2 + LAYER 3 modifiers on every duration. Source: PARITY-REPORT-2026.
            val phaseCoefficient = tithiPravahPhaseCoefficient(birthMoonElongation)

            val startLord = JAIN_DASHA_ORDER[startLordIndex]
            val startLordYears = effectiveDashaYears(startLord, phaseCoefficient)

            val elapsedYearsInFirstDasha = fractionElapsed * startLordYears
            val remainingFirstDasha = startLordYears - elapsedYearsInFirstDasha

            val dobParts = dobStr.split("-").map { it.toInt() }
            val dobYear = dobParts[0] + (dobParts[1] - 1) / 12.0 + (dobParts[2] - 1) / 365.25

            val firstDashaStartYear = dobYear - elapsedYearsInFirstDasha

            val now = java.util.Calendar.getInstance()
            val currentYear = now.get(java.util.Calendar.YEAR) + now.get(java.util.Calendar.MONTH) / 12.0 + now.get(java.util.Calendar.DAY_OF_MONTH) / 365.25

            var dashaStartYear = firstDashaStartYear
            var lordIndex = startLordIndex

            for (i in 0 until 24) {
                val lord = JAIN_DASHA_ORDER[lordIndex % 8]
                val years = effectiveDashaYears(lord, phaseCoefficient)
                val dashaEndYear = dashaStartYear + years

                if (currentYear >= dashaStartYear && currentYear < dashaEndYear) {
                    val yearsRemaining = maxOf(0.0, dashaEndYear - currentYear)

                    var antardasha = JAIN_DASHA_ORDER[lordIndex % 8]
                    var antardashaInfo = AntardashaInfo(
                        lord = antardasha, lordHindi = JAIN_DASHA_HINDI[antardasha] ?: antardasha,
                        yearsTotal = 0.0, startDate = yearToDateString(dashaStartYear),
                        endDate = yearToDateString(dashaEndYear), yearsRemaining = 0.0
                    )
                    var pratyantardasha = PratyantardashInfo(
                        lord = antardasha, lordHindi = JAIN_DASHA_HINDI[antardasha] ?: antardasha,
                        startDate = yearToDateString(dashaStartYear), endDate = yearToDateString(dashaEndYear),
                        daysRemaining = 0
                    )

                    var antarStart = dashaStartYear
                    for (ai in 0 until 8) {
                        val antarLord = JAIN_DASHA_ORDER[(lordIndex + ai) % 8]
                        val antarYears = (JAIN_DASHA_YEARS[antarLord]!! / 100.0) * years
                        val antarEnd = antarStart + antarYears

                        if (currentYear >= antarStart && currentYear < antarEnd) {
                            antardasha = antarLord
                            antardashaInfo = AntardashaInfo(
                                lord = antarLord,
                                lordHindi = JAIN_DASHA_HINDI[antarLord] ?: antarLord,
                                yearsTotal = (antarYears * 100).roundToInt() / 100.0,
                                startDate = yearToDateString(antarStart),
                                endDate = yearToDateString(antarEnd),
                                yearsRemaining = (maxOf(0.0, antarEnd - currentYear) * 10).roundToInt() / 10.0
                            )

                            var pratStart = antarStart
                            for (pi in 0 until 8) {
                                val pratLord = JAIN_DASHA_ORDER[(lordIndex + ai + pi) % 8]
                                val pratYears = (JAIN_DASHA_YEARS[pratLord]!! / 100.0) * antarYears
                                val pratEnd = pratStart + pratYears

                                if (currentYear >= pratStart && currentYear < pratEnd) {
                                    pratyantardasha = PratyantardashInfo(
                                        lord = pratLord,
                                        lordHindi = JAIN_DASHA_HINDI[pratLord] ?: pratLord,
                                        startDate = yearToDateString(pratStart),
                                        endDate = yearToDateString(pratEnd),
                                        daysRemaining = (maxOf(0.0, pratEnd - currentYear) * 365.25).roundToInt()
                                    )
                                    break
                                }
                                pratStart = pratEnd
                            }
                            break
                        }
                        antarStart = antarEnd
                    }

                    return DashaInfo(
                        lord = lord,
                        lordHindi = JAIN_DASHA_HINDI[lord] ?: lord,
                        yearsTotal = (years * 10).roundToInt() / 10.0,
                        startDate = yearToDateString(dashaStartYear),
                        endDate = yearToDateString(dashaEndYear),
                        yearsRemaining = (yearsRemaining * 10).roundToInt() / 10.0,
                        antardasha = antardasha,
                        antardashaHindi = JAIN_DASHA_HINDI[antardasha] ?: antardasha,
                        antardashaInfo = antardashaInfo,
                        pratyantardasha = pratyantardasha
                    )
                }

                dashaStartYear = dashaEndYear
                lordIndex++
            }

            // Fallback
            val lord = JAIN_DASHA_ORDER[startLordIndex]
            val fallbackAntar = AntardashaInfo(
                lord = lord, lordHindi = JAIN_DASHA_HINDI[lord] ?: lord,
                yearsTotal = (startLordYears * 10).roundToInt() / 10.0, startDate = dobStr,
                endDate = yearToDateString(dobYear + remainingFirstDasha), yearsRemaining = 0.0
            )
            val fallbackPrat = PratyantardashInfo(
                lord = lord, lordHindi = JAIN_DASHA_HINDI[lord] ?: lord,
                startDate = dobStr, endDate = yearToDateString(dobYear + remainingFirstDasha), daysRemaining = 0
            )
            return DashaInfo(
                lord = lord,
                lordHindi = JAIN_DASHA_HINDI[lord] ?: lord,
                yearsTotal = (startLordYears * 10).roundToInt() / 10.0,
                startDate = dobStr,
                endDate = yearToDateString(dobYear + remainingFirstDasha),
                yearsRemaining = (remainingFirstDasha * 10).roundToInt() / 10.0,
                antardasha = lord,
                antardashaHindi = JAIN_DASHA_HINDI[lord] ?: lord,
                antardashaInfo = fallbackAntar,
                pratyantardasha = fallbackPrat
            )
        } catch (e: Exception) {
            // Safe fallback when any parsing or calculation fails
            val lord = "Mohaniya"
            val lordHindi = JAIN_DASHA_HINDI[lord] ?: "मोहनीय"
            val fallbackAntar = AntardashaInfo(
                lord = lord, lordHindi = lordHindi,
                yearsTotal = 28.0, startDate = "2020-01-01",
                endDate = "2040-01-01", yearsRemaining = 10.0
            )
            val fallbackPrat = PratyantardashInfo(
                lord = lord, lordHindi = lordHindi,
                startDate = "2024-01-01", endDate = "2025-01-01", daysRemaining = 180
            )
            return DashaInfo(
                lord = lord,
                lordHindi = lordHindi,
                yearsTotal = 28.0,
                startDate = "2020-01-01",
                endDate = "2040-01-01",
                yearsRemaining = 10.0,
                antardasha = lord,
                antardashaHindi = lordHindi,
                antardashaInfo = fallbackAntar,
                pratyantardasha = fallbackPrat
            )
        }
    }
}
