package com.jainkundali.app.domain.intelligence

import com.jainkundali.app.domain.engine.ProfileEngine
import com.jainkundali.app.domain.models.BirthFormData
import com.jainkundali.app.domain.models.DayContext
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class RuleScoringTest {

    private fun baseProfile() = ProfileEngine.generateUserProfile(
        BirthFormData("जातक", "1990-05-15", "08:30", "इंदौर", "22.7", "75.8", "पुरुष")
    )

    private fun day(paksha: String) = DayContext("शुक्ल प्रतिपदा", "सोमवार", "रोहिणी", paksha)

    @Test
    fun scoreIsBoundedAndRuleOnly() {
        val d = RuleScoring.calculate(baseProfile(), day("शुक्ल"), "सामान्य संदेश")
        assertTrue("score in 0..1", d.finalScore in 0.0..1.0)
        assertTrue("rules-only baseline", d.fallbackUsed)
        assertNull(d.modelScore)
        assertEquals(d.ruleScore, d.finalScore, 0.0001)
    }

    @Test
    fun intenseChartScoresHigherThanFavourableChart() {
        val base = baseProfile()
        val intense = base.copy(
            nakshatraNature = "ashubha",
            gunasthana = 1,
            currentDasha = base.currentDasha.copy(lord = "Mohaniya")
        )
        val favourable = base.copy(
            nakshatraNature = "param_shubha",
            gunasthana = 4,
            currentDasha = base.currentDasha.copy(lord = "Vedaniya")
        )
        val intenseScore = RuleScoring.calculate(intense, day("कृष्ण"), "विशेष प्रभाव प्रकट होता है").finalScore
        val favourableScore = RuleScoring.calculate(favourable, day("शुक्ल"), "सामान्य").finalScore
        assertTrue("intense=$intenseScore favourable=$favourableScore", intenseScore > favourableScore)
    }

    @Test
    fun ghatiyaAntardashaIsScoredIndependentlyOfMahadasha() {
        val base = baseProfile()
        // Mahādaśā is aghātiyā (Vedaniya) but the running antardaśā is ghātiyā (Mohaniya):
        // the antardaśā signal must still fire so within-period turbulence is captured.
        val withGhatiyaAntar = base.copy(
            currentDasha = base.currentDasha.copy(
                lord = "Vedaniya",
                antardashaInfo = base.currentDasha.antardashaInfo.copy(lord = "Mohaniya")
            )
        )
        val d = RuleScoring.calculate(withGhatiyaAntar, day("शुक्ल"), "सामान्य")
        assertTrue("ghatiya antardasha signal fires", "ghatiya_antardasha" in d.reasonCodes)
    }

    @Test
    fun karmaResonanceFiresWhenDominantKarmaEqualsMahadasha() {
        val base = baseProfile()
        val resonant = base.copy(
            dominantKarmaEn = "Mohaniya",
            currentDasha = base.currentDasha.copy(lord = "Mohaniya")
        )
        val d = RuleScoring.calculate(resonant, day("शुक्ल"), "सामान्य")
        assertTrue("karma-dasha resonance fires", "karma_dasha_resonance" in d.reasonCodes)
    }

    @Test
    fun priorityThresholdsAreStable() {
        assertEquals(DecisionPriority.URGENT, RuleScoring.priorityFor(0.80))
        assertEquals(DecisionPriority.HIGH, RuleScoring.priorityFor(0.60))
        assertEquals(DecisionPriority.MEDIUM, RuleScoring.priorityFor(0.40))
        assertEquals(DecisionPriority.LOW, RuleScoring.priorityFor(0.10))
    }

    @Test
    fun compoundGhatiyaFiresWhenTwoDistinctGhatiyaActive() {
        val base = baseProfile()
        // dominantKarmaEn = Mohaniya (ghātiyā), dashaLord = Antaraya (ghātiyā) → 2 distinct → fires
        val compound = base.copy(
            dominantKarmaEn = "Mohaniya",
            currentDasha = base.currentDasha.copy(lord = "Antaraya")
        )
        val d = RuleScoring.calculate(compound, day("शुक्ल"), "सामान्य")
        assertTrue("compound_ghatiya fires for 2+ distinct ghātiyā", "compound_ghatiya" in d.reasonCodes)
    }

    @Test
    fun compoundGhatiyaDoesNotFireForSingleGhatiya() {
        val base = baseProfile()
        // dominantKarmaEn = Mohaniya, dashaLord = Mohaniya → same karma, count = 1 → does NOT fire
        val singleGhatiya = base.copy(
            dominantKarmaEn = "Mohaniya",
            currentDasha = base.currentDasha.copy(lord = "Mohaniya")
        )
        val d = RuleScoring.calculate(singleGhatiya, day("शुक्ल"), "सामान्य")
        assertTrue("compound_ghatiya must NOT fire for single ghātiyā", "compound_ghatiya" !in d.reasonCodes)
    }

    @Test
    fun kashayasInflamedFiresWhenMohaDominantAndMohaDasha() {
        val base = baseProfile()
        val inflamed = base.copy(
            dominantKarmaEn = "Mohaniya",
            currentDasha = base.currentDasha.copy(lord = "Mohaniya")
        )
        val d = RuleScoring.calculate(inflamed, day("शुक्ल"), "सामान्य")
        assertTrue("kashayas_inflamed fires", "kashayas_inflamed" in d.reasonCodes)
    }

    @Test
    fun ratnatrayaAlignedFiresWhenFavourable() {
        val base = baseProfile()
        val aligned = base.copy(
            nakshatraNature = "param_shubha",
            gunasthana = 4,
            currentDasha = base.currentDasha.copy(lord = "Vedaniya")
        )
        val d = RuleScoring.calculate(aligned, day("शुक्ल"), "सामान्य")
        assertTrue("ratnatraya_aligned fires for gunasthana 4 + shubha nakshatra + aghātiyā dasha",
            "ratnatraya_aligned" in d.reasonCodes)
    }
}
