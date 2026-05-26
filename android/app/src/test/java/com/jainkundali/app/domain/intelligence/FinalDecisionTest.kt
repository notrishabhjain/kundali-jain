package com.jainkundali.app.domain.intelligence

import com.jainkundali.app.domain.engine.ProfileEngine
import com.jainkundali.app.domain.models.BirthFormData
import com.jainkundali.app.domain.models.DayContext
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class FinalDecisionTest {

    @Test
    fun fallsBackToRulesWhenNoModel() = runBlocking {
        val profile = ProfileEngine.generateUserProfile(
            BirthFormData("जातक", "1990-05-15", "08:30", "इंदौर", "22", "75", "पुरुष")
        )
        val day = DayContext("शुक्ल प्रतिपदा", "सोमवार", "रोहिणी", "शुक्ल")

        val decision = FinalDecision.build(profile, day, "संदेश")

        // No model is bundled — must degrade gracefully to the rule score.
        assertTrue(decision.fallbackUsed)
        assertNull(decision.modelScore)
        assertEquals(decision.ruleScore, decision.finalScore, 0.0001)
    }
}
