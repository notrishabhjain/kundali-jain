package com.jainkundali.app.domain.engine

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class PanchamKaalGuardTest {

    @Test
    fun stripsMokshaClaimFromNarrative() {
        val out = PanchamKaalGuard.sanitizeNarrative("इस साधना से मोक्ष की प्राप्ति होगी।")
        assertFalse("must not promise moksha", out.contains("मोक्ष की प्राप्ति"))
        assertTrue("must reframe to allowed goal", out.contains("सम्यग्दर्शन") || out.contains("शुभ गति"))
    }

    @Test
    fun leavesDoctrinallyCorrectTextUntouched() {
        val ok = "सम्यग्दर्शन और देव-गति का बन्ध सम्भव है।"
        assertEquals(ok, PanchamKaalGuard.sanitizeNarrative(ok))
    }

    @Test
    fun statementDeniesMokshaInPanchamKaal() {
        assertTrue(PanchamKaalGuard.statement.contains("मोक्ष"))
        assertTrue(PanchamKaalGuard.statement.contains("सम्भव नहीं"))
    }

    @Test
    fun exposesExactlyThreeAllowedGoals() {
        assertEquals(3, PanchamKaalGuard.allowedGoals.size)
        assertTrue(PanchamKaalGuard.allowedGoals.contains("सम्यग्दर्शन"))
    }
}
