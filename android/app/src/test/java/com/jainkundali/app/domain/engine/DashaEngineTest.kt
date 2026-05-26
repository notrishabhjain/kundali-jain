package com.jainkundali.app.domain.engine

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class DashaEngineTest {

    @Test
    fun returnsValidJainDasha() {
        val d = DashaEngine.calculateDasha(45.0, "1990-05-15")
        assertTrue("mahadasha lord is a Jain karma", d.lord in DashaEngine.JAIN_DASHA_ORDER)
        assertTrue("antardasha lord is a Jain karma", d.antardashaInfo.lord in DashaEngine.JAIN_DASHA_ORDER)
        assertTrue("pratyantardasha lord is a Jain karma", d.pratyantardasha.lord in DashaEngine.JAIN_DASHA_ORDER)
        assertTrue(d.yearsTotal > 0)
        assertTrue(d.yearsRemaining >= 0.0)
        assertTrue(d.pratyantardasha.daysRemaining >= 0)
    }

    @Test
    fun lordHindiMatchesMapping() {
        val d = DashaEngine.calculateDasha(120.0, "1985-01-01")
        assertEquals(DashaEngine.JAIN_DASHA_HINDI[d.lord], d.lordHindi)
    }

    @Test
    fun usesEightKarmaDashaSystemOnly() {
        // Digambar rule: dasha lords must be the 8 karmas, never Vedic grahas.
        assertEquals(8, DashaEngine.JAIN_DASHA_ORDER.size)
        assertTrue("Rahu" !in DashaEngine.JAIN_DASHA_ORDER)
        assertTrue("Shani" !in DashaEngine.JAIN_DASHA_ORDER)
    }
}
