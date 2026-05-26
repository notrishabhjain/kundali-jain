package com.jainkundali.app.domain.engine

import com.jainkundali.app.domain.models.BirthFormData
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class ProfileEngineTest {

    private fun form() = BirthFormData(
        fullName = "परीक्षा जातक",
        dob = "1990-05-15",
        time = "08:30",
        place = "इंदौर",
        lat = "22.7196",
        lng = "75.8577",
        gender = "पुरुष"
    )

    @Test
    fun generatesValidProfile() {
        val p = ProfileEngine.generateUserProfile(form())
        assertTrue(p.birthNakshatraHindi.isNotBlank())
        assertTrue("pada in 1..4", p.nakshatraPada in 1..4)
        assertTrue("gunasthana in 1..4", p.gunasthana in 1..4)
        assertTrue(p.dominantKarmaEn.isNotBlank())
        assertTrue("moon longitude normalised", p.moonLongitude in 0.0..360.0)
    }

    @Test
    fun isDeterministic() {
        val a = ProfileEngine.generateUserProfile(form())
        val b = ProfileEngine.generateUserProfile(form())
        assertEquals(a.birthNakshatra, b.birthNakshatra)
        assertEquals(a.dominantKarmaEn, b.dominantKarmaEn)
        assertEquals(a.moonLongitude, b.moonLongitude, 0.0001)
        assertEquals(a.currentDasha.lord, b.currentDasha.lord)
        assertEquals(a.gunasthana, b.gunasthana)
    }

    @Test
    fun dominantKarmaIsAKnownJainKarma() {
        val known = setOf(
            "Gyanavaraniya", "Darshanavaraniya", "Vedaniya", "Mohaniya", "Charitra Mohaniya",
            "Ayushya", "Naam", "Gotra", "Antaraya", "Sarva karma kshay"
        )
        assertTrue(ProfileEngine.generateUserProfile(form()).dominantKarmaEn in known)
    }
}
