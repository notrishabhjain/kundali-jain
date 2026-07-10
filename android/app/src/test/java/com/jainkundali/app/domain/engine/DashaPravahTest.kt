package com.jainkundali.app.domain.engine

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Doctrinal tests for the three-layer Jain dashā engine (MP-§D2):
 *  - Layer 2 (Tithi Pravāh): karma-peak / nirjarā / sāmānya status from today vs birth tithi.
 *  - Layer 3 (Pancham Kāla position modifier): 1.4× karma factor + Gunasthāna 4 ceiling.
 */
class DashaPravahTest {

    @Test
    fun layer2_peakDaysAreBirthTithiAndFifthAndTenthFromIt() {
        // Source: MP-§D2 L2 — birth tithi, +5, +10 are karma-udaya peak days.
        val birth = 7
        listOf(7, 12, 17).forEach { today ->
            val out = DashaEngine.tithiPravah(birth, today)
            assertEquals(
                "tithi $today must be KARMA_PEAK relative to birth $birth",
                DashaEngine.TithiPravahStatus.KARMA_PEAK, out.status
            )
        }
    }

    @Test
    fun layer2_nirjaraDaysAreSixthEleventhAndSixteenthFromBirthTithi() {
        // Source: MP-§D2 L2 — +6, +11, +16 from birth tithi are nirjarā-opportunity days.
        val birth = 3
        listOf(9, 14, 19).forEach { today ->
            val out = DashaEngine.tithiPravah(birth, today)
            assertEquals(
                "tithi $today must be NIRJARA relative to birth $birth",
                DashaEngine.TithiPravahStatus.NIRJARA, out.status
            )
        }
    }

    @Test
    fun layer2_wrapsAroundTheLunarMonth() {
        // birth = 28, today = 3 → offset (3 - 28 + 30) mod 30 = 5 → KARMA_PEAK.
        val out = DashaEngine.tithiPravah(birthTithi = 28, todayTithi = 3)
        assertEquals(5, out.offsetFromBirthTithi)
        assertEquals(DashaEngine.TithiPravahStatus.KARMA_PEAK, out.status)
    }

    @Test
    fun layer2_returnsSamanyaWhenEitherTithiUnknown() {
        assertEquals(
            DashaEngine.TithiPravahStatus.SAMANYA,
            DashaEngine.tithiPravah(birthTithi = 0, todayTithi = 5).status
        )
        assertEquals(
            DashaEngine.TithiPravahStatus.SAMANYA,
            DashaEngine.tithiPravah(birthTithi = 5, todayTithi = 0).status
        )
    }

    @Test
    fun layer3_panchamKaalConstantsMatchDoctrine() {
        // Source: MP-§D2 L3 — ~2,550 of 21,000 years of the 5th Ara elapsed; 1.4× karma factor;
        // gunasthāna ceiling at 4 (Samyak Darshan).
        assertEquals(21000, DashaEngine.PANCHAM_KAAL_TOTAL_YEARS)
        assertEquals(2550, DashaEngine.PANCHAM_KAAL_ELAPSED_YEARS)
        assertEquals(1.4, DashaEngine.PANCHAM_KAAL_KARMA_FACTOR, 0.0001)
        assertEquals(4, DashaEngine.PANCHAM_KAAL_MAX_GUNASTHANA)
        val pos = DashaEngine.panchamKaalPosition()
        assertTrue("position fraction in (0,1)", pos in 0.0..1.0)
    }

    @Test
    fun layer3_karmaMultiplierAppliesOnlyToDestructiveKarmasInTransit() {
        // Source: PARITY-REPORT-2026 Karma Multiplier row — 1.4× applies to Mohaniya /
        // Antaraya while in dashā transit, NOT blanket to all karmas.
        val states = KarmaEngine.calculateKarmaProfile("Naam", "Mohaniya", gunasthana = 1)
        val mohaniya = states.first { it.karmaEn == "Mohaniya" }
        val vedaniya = states.first { it.karmaEn == "Vedaniya" }
        // Mohaniya: 65 × 1.4 = 91 (+20 dashā boost, capped at 100) — well above unscaled 85.
        assertTrue("destructive transit scaled: mohaniya=${mohaniya.intensity}", mohaniya.intensity > 85)
        // Vedaniya keeps its raw base (50) — no blanket factor.
        assertEquals("non-transit karma unscaled", 50, vedaniya.intensity)
    }

    @Test
    fun layer3_gunasthanaCapStillHolds() {
        // Gunasthāna input beyond the Pancham Kāla ceiling (4) must be coerced.
        val capped = KarmaEngine.calculateKarmaProfile("Mohaniya", "Naam", gunasthana = 99)
        val atFour = KarmaEngine.calculateKarmaProfile("Mohaniya", "Naam", gunasthana = 4)
        capped.zip(atFour).forEach { (a, b) ->
            assertEquals("gunasthana caps at 4 for ${a.karmaEn}", b.intensity, a.intensity)
        }
    }

    @Test
    fun layer2_phaseCoefficientFollowsReportFormula() {
        // Source: PARITY-REPORT-2026 — Shukla expands up to +15%, Krishna contracts.
        assertEquals(1.0, DashaEngine.tithiPravahPhaseCoefficient(-1.0), 1e-9)   // unknown
        assertEquals(1.0, DashaEngine.tithiPravahPhaseCoefficient(0.0), 1e-9)    // new moon
        assertEquals(1.0 + (90.0 / 360.0) * 0.15, DashaEngine.tithiPravahPhaseCoefficient(90.0), 1e-9)
        assertEquals(1.0 - (90.0 / 360.0) * 0.15, DashaEngine.tithiPravahPhaseCoefficient(270.0), 1e-9)
    }

    @Test
    fun layer3_destructiveDashaDurationsStretch() {
        // Source: PARITY-REPORT-2026 — Mohaniya 28 × 1.4 = 39.2, Antaraya 14 × 1.4 = 19.6.
        assertEquals(39.2, DashaEngine.effectiveDashaYears("Mohaniya", 1.0), 1e-9)
        assertEquals(19.6, DashaEngine.effectiveDashaYears("Antaraya", 1.0), 1e-9)
        assertEquals(15.0, DashaEngine.effectiveDashaYears("Gyanavaraniya", 1.0), 1e-9)
    }
}
