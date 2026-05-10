package com.jainkundali.app.domain.engine

import kotlin.math.*

object AstronomyUtils {

    fun toRad(deg: Double): Double = deg * PI / 180.0

    fun normDeg(d: Double): Double = ((d % 360.0) + 360.0) % 360.0

    fun toJulianDay(dateStr: String, timeStr: String): Double {
        val dateParts = dateStr.split("-").map { it.toInt() }
        val timeParts = timeStr.split(":").map { it.toInt() }
        val year0 = dateParts[0]
        val month0 = dateParts[1]
        val day = dateParts[2]
        val hh = timeParts[0]
        val mm = if (timeParts.size > 1) timeParts[1] else 0
        // IST = UTC+5:30
        val utcHour = ((hh + mm / 60.0 - 5.5) + 24.0) % 24.0

        var Y = year0
        var M = month0
        if (M <= 2) { Y -= 1; M += 12 }
        val A = Y / 100
        val B = 2 - A + A / 4
        return floor(365.25 * (Y + 4716)) + floor(30.6001 * (M + 1)) + day + utcHour / 24.0 + B - 1524.5
    }

    fun getMoonTropicalLongitude(jde: Double): Double {
        val T = (jde - 2451545.0) / 36525.0

        val L = 218.3164477 + 481267.88123421 * T
        val M = normDeg(357.5291092 + 35999.0502909 * T)
        val Mm = normDeg(134.9633964 + 477198.8675055 * T)
        val D = normDeg(297.8501921 + 445267.1114034 * T)
        val F = normDeg(93.2720950 + 483202.0175233 * T)

        val sigma =
            6.288774 * sin(toRad(Mm)) +
            1.274027 * sin(toRad(2 * D - Mm)) +
            0.658314 * sin(toRad(2 * D)) +
            0.213618 * sin(toRad(2 * Mm)) -
            0.185116 * sin(toRad(M)) -
            0.114332 * sin(toRad(2 * F)) +
            0.058793 * sin(toRad(2 * D - 2 * Mm)) +
            0.057066 * sin(toRad(2 * D - M - Mm)) +
            0.053322 * sin(toRad(2 * D + Mm)) +
            0.045758 * sin(toRad(2 * D - M)) -
            0.040923 * sin(toRad(M - Mm)) -
            0.034720 * sin(toRad(D)) -
            0.030383 * sin(toRad(M + Mm)) +
            0.015327 * sin(toRad(2 * D - 2 * F)) -
            0.012528 * sin(toRad(Mm + 2 * F)) +
            0.010980 * sin(toRad(Mm - 2 * F))

        return normDeg(L + sigma)
    }

    fun getLahiriAyanamsa(jde: Double): Double {
        val T = (jde - 2451545.0) / 36525.0
        return 23.85048 + 1.396971 * T + 0.000308 * T * T + 0.000002 * T * T * T
    }

    fun getSiderealLongitude(jde: Double): Double {
        val tropical = getMoonTropicalLongitude(jde)
        val ayanamsa = getLahiriAyanamsa(jde)
        return normDeg(tropical - ayanamsa)
    }

    fun getSunLongitude(jde: Double): Double {
        val T = (jde - 2451545.0) / 36525.0
        val L0 = normDeg(280.46646 + 36000.76983 * T)
        val M = normDeg(357.52911 + 35999.05029 * T - 0.0001537 * T * T)
        val C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(toRad(M)) +
                (0.019993 - 0.000101 * T) * sin(toRad(2 * M)) +
                0.000289 * sin(toRad(3 * M))
        return normDeg(L0 + C)
    }

    private val RASHI_NAMES = listOf(
        "मेष (Aries)", "वृष (Taurus)", "मिथुन (Gemini)", "कर्क (Cancer)",
        "सिंह (Leo)", "कन्या (Virgo)", "तुला (Libra)", "वृश्चिक (Scorpio)",
        "धनु (Sagittarius)", "मकर (Capricorn)", "कुंभ (Aquarius)", "मीन (Pisces)"
    )

    fun getRashi(siderealDeg: Double): String {
        return RASHI_NAMES[(normDeg(siderealDeg) / 30.0).toInt()]
    }
}
