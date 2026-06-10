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
        val out = DashaEngine.tithiPravah(birth = 28, today = 3)
        assertEquals(5, out.offsetFromBirthTithi)
        assertEquals(DashaEngine.TithiPravahStatus.KARMA_PEAK, out.status)
    }

    @Test
    fun layer2_returnsSamanyaWhenEitherTithiUnknown() {
        assertEquals(
            DashaEngine.TithiPravahStatus.SAMANYA,
            DashaEngine.tithiPravah(birth = 0, today = 5).status
        )
        assertEquals(
            DashaEngine.TithiPravahStatus.SAMANYA,
            DashaEngine.tithiPravah(birth = 5, today = 0).status
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
    fun layer3_karmaProfileAppliesPanchamKaalFactorAndGunasthanaCap() {
        // With the 1.4x factor, the Vedaniya intensity must be > the raw base (50).
        // Even with gunasthana capped at 4, Vedaniya base = 50 * 1.4 = 70, damping = 3*5 = 15 → 55.
        val states = KarmaEngine.calculateKarmaProfile("Mohaniya", "Naam", gunasthana = 99)
        val vedaniya = states.first { it.karmaEn == "Vedaniya" }
        assertTrue("PK factor applied: vedaniya=${vedaniya.intensity}", vedaniya.intensity > 50)
        assertTrue("gunasthana-4 cap applied: vedaniya<=70", vedaniya.intensity <= 70)
    }
}
