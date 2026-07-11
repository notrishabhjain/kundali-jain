package com.jainkundali.app.domain.engine

import kotlin.math.*

/**
 * Apparent sunrise/sunset engine — Meeus Chapter 15 method.
 *
 * Source: PARITY-REPORT-2026 §"Jean Meeus Chapter 15 Sunrise and Sunset Calculation"
 * (primary). Replaces the deprecated cosine seasonal approximation.
 *
 * Apparent sunrise = Sun's centre at altitude h = −0.8333° − 0.0293°·√H
 * (refraction + solar semi-diameter + height-induced horizon dip).
 */
object SunriseEngine {

    data class ApparentSunTimes(
        val sunriseLocalHours: Double,
        val sunsetLocalHours: Double,
        val sunriseHHMM: String,
        val sunsetHHMM: String,
        val polarDay: Boolean,
        val polarNight: Boolean
    )

    private fun norm360(d: Double) = ((d % 360.0) + 360.0) % 360.0

    private fun jdAtUTCMidnight(dateStr: String): Double {
        val parts = dateStr.split("-").map { it.toInt() }
        var y = parts[0]; var m = parts[1]; val d = parts[2]
        if (m <= 2) { y -= 1; m += 12 }
        val a = y / 100
        val b = 2 - a + a / 4
        return floor(365.25 * (y + 4716)) + floor(30.6001 * (m + 1)) + d + b - 1524.5
    }

    private fun fmtHHMM(hours: Double): String {
        val h24 = ((hours % 24.0) + 24.0) % 24.0
        var hh = floor(h24).toInt()
        var mm = ((h24 - hh) * 60.0).roundToInt()
        if (mm == 60) { hh += 1; mm = 0 }
        return "${(hh % 24).toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}"
    }

    /**
     * Apparent sunrise/sunset for a calendar date at coordinates.
     * Source: PARITY-REPORT-2026 Meeus Ch. 15 steps 1–7.
     * [longitude] is positive EAST; [utcOffsetHours] defaults to IST (+5.5).
     */
    fun calculateApparentSunTimes(
        dateStr: String,
        latitude: Double,
        longitude: Double,
        elevationM: Double = 0.0,
        utcOffsetHours: Double = 5.5
    ): ApparentSunTimes {
        val phi = latitude
        val lw = -longitude // west-positive per the algorithm's convention

        val jdMidnight = jdAtUTCMidnight(dateStr)
        val n = (jdMidnight - 2451545.0009 - lw / 360.0).roundToInt()
        val jStar = 2451545.0009 + lw / 360.0 + n

        // Step 2: mean anomaly. Source: PARITY-REPORT-2026.
        val m = norm360(357.5291 + 0.98560028 * (jStar - 2451545.0))
        // Step 3: equation of the center.
        val c = 1.9148 * sin(Math.toRadians(m)) + 0.0200 * sin(Math.toRadians(2 * m)) +
                0.0003 * sin(Math.toRadians(3 * m))
        // Step 4: ecliptic longitude.
        val lambda = norm360(m + c + 180.0 + 102.9372)
        // Solar transit with equation-of-time corrections.
        val jTransit = jStar + 0.0053 * sin(Math.toRadians(m)) - 0.0069 * sin(Math.toRadians(2 * lambda))
        // Step 5: mean obliquity with secular drift.
        val epsilon = 23.4393 - 0.00000036 * (jTransit - 2451545.0)
        // Step 6: declination.
        val delta = Math.toDegrees(asin(sin(Math.toRadians(lambda)) * sin(Math.toRadians(epsilon))))
        // Step 7: hour angle at adjusted altitude h = −0.8333 − 0.0293√H.
        val h = -0.8333 - 0.0293 * sqrt(max(0.0, elevationM))
        val cosH0 = (sin(Math.toRadians(h)) - sin(Math.toRadians(phi)) * sin(Math.toRadians(delta))) /
                (cos(Math.toRadians(phi)) * cos(Math.toRadians(delta)))

        if (cosH0 > 1.0) return ApparentSunTimes(Double.NaN, Double.NaN, "--:--", "--:--", polarDay = false, polarNight = true)
        if (cosH0 < -1.0) return ApparentSunTimes(Double.NaN, Double.NaN, "--:--", "--:--", polarDay = true, polarNight = false)

        val h0 = Math.toDegrees(acos(cosH0))
        val jRise = jTransit - h0 / 360.0
        val jSet = jTransit + h0 / 360.0

        fun toLocalHours(jd: Double) = ((((jd + 0.5) % 1.0) * 24.0 + utcOffsetHours) % 24.0 + 24.0) % 24.0

        val riseH = toLocalHours(jRise)
        val setH = toLocalHours(jSet)
        return ApparentSunTimes(riseH, setH, fmtHHMM(riseH), fmtHHMM(setH), polarDay = false, polarNight = false)
    }

    /** Sunrise as HH:MM, with a 06:00 fallback for unparsable coordinates / polar cases. */
    fun apparentSunriseHHMM(latStr: String, lngStr: String, dob: String): String {
        val lat = latStr.toDoubleOrNull() ?: return "06:00"
        val lng = lngStr.toDoubleOrNull() ?: return "06:00"
        return try {
            val t = calculateApparentSunTimes(dob, lat, lng)
            if (t.polarDay || t.polarNight) "06:00" else t.sunriseHHMM
        } catch (e: Exception) {
            "06:00"
        }
    }
}
