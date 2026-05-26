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
    fun priorityThresholdsAreStable() {
        assertEquals(DecisionPriority.URGENT, RuleScoring.priorityFor(0.80))
        assertEquals(DecisionPriority.HIGH, RuleScoring.priorityFor(0.60))
        assertEquals(DecisionPriority.MEDIUM, RuleScoring.priorityFor(0.40))
        assertEquals(DecisionPriority.LOW, RuleScoring.priorityFor(0.10))
    }
}
