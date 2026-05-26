package com.jainkundali.app.domain.engine

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class KarmaEngineTest {

    @Test
    fun returnsEightKarmasInRange() {
        val list = KarmaEngine.calculateKarmaProfile("Mohaniya", "Mohaniya", 1)
        assertEquals(8, list.size)
        list.forEach { assertTrue("intensity ${it.intensity} in 10..100", it.intensity in 10..100) }
    }

    @Test
    fun dominantKarmaIsInUdaya() {
        val list = KarmaEngine.calculateKarmaProfile("Mohaniya", "Naam", 1)
        val mohaniya = list.first { it.karmaEn == "Mohaniya" }
        assertEquals("Udaya", mohaniya.state)
    }

    @Test
    fun higherGunasthanaReducesIntensity() {
        fun gotra(g: Int) =
            KarmaEngine.calculateKarmaProfile("Naam", "Naam", g).first { it.karmaEn == "Gotra" }.intensity
        assertTrue("higher gunasthana must not raise karmic load", gotra(4) <= gotra(1))
    }

    @Test
    fun everyKarmaHasNonBlankNirjaraPractice() {
        KarmaEngine.calculateKarmaProfile("Antaraya", "Antaraya", 2).forEach {
            assertTrue("${it.karmaEn} must carry a remedy", it.nirjaraPractice.isNotBlank())
        }
    }
}
