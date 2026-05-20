package com.jainkundali.app.domain.engine

import com.jainkundali.app.domain.models.JainPanchang
import com.jainkundali.app.domain.models.UpcomingVrat
import com.jainkundali.app.domain.data.getNakshatraByDegree
import java.util.Calendar
import kotlin.math.floor

object CalendarEngine {

    private val VARAS = listOf("रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार")
    private val TITHI_NAMES = listOf("", "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा/अमावस्या")
    private val MASAS = listOf("चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन")
    private val TITHI_NAMES_HINDI = listOf("प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा")

    fun getJainPanchang(date: java.util.Date): JainPanchang {
        return try {
            val cal = Calendar.getInstance()
            cal.time = date
            val dateStr = "${cal.get(Calendar.YEAR)}-${(cal.get(Calendar.MONTH) + 1).toString().padStart(2, '0')}-${cal.get(Calendar.DAY_OF_MONTH).toString().padStart(2, '0')}"
            val timeStr = "${cal.get(Calendar.HOUR_OF_DAY).toString().padStart(2, '0')}:${cal.get(Calendar.MINUTE).toString().padStart(2, '0')}"

            val jde = AstronomyUtils.toJulianDay(dateStr, timeStr)
            val sunLong = AstronomyUtils.getSunLongitude(jde)
            val moonLong = AstronomyUtils.getMoonTropicalLongitude(jde)
            val elongation = AstronomyUtils.normDeg(moonLong - sunLong)

            val tithiRaw = floor(elongation / 12.0).toInt()
            val paksha = if (elongation < 180) "शुक्ल" else "कृष्ण"
            val tithiNum = ((tithiRaw % 15) + 1).coerceIn(0, 14)

            val tithiName = when {
                tithiRaw == 14 -> "पूर्णिमा"
                tithiRaw == 29 -> "अमावस्या"
                else -> TITHI_NAMES.getOrElse(tithiNum) { "प्रतिपदा" }
            }
            val masaIndex = floor(sunLong / 30.0).toInt()
            val masa = MASAS[masaIndex % 12]

            val sidereal = AstronomyUtils.getSiderealLongitude(jde)
            val nak = getNakshatraByDegree(sidereal)

            // Jain Festivals — Digambar tradition only
            var jainFestival: String? = null
            // अष्टान्हिका: last 8 days (अष्टमी to पूर्णिमा) of चैत्र, आषाढ़, कार्तिक — सिद्धचक्र विधान
            if ((masa == "चैत्र" || masa == "आषाढ़" || masa == "कार्तिक") && paksha == "शुक्ल" && tithiNum in 8..15) {
                jainFestival = "अष्टान्हिका महापर्व (सिद्धचक्र विधान)"
            }
            // दशलक्षण: 10 days, भाद्रपद शुक्ल ५ से चतुर्दशी (Digambar only — स्थापना of दशलक्षण धर्म)
            else if (masa == "भाद्रपद" && paksha == "शुक्ल" && tithiNum in 5..14) {
                jainFestival = "दशलक्षण महापर्व (दिगम्बर पर्युषण — १० दिन के दस लक्षण धर्म)"
            }
            // क्षमावाणी: भाद्रपद शुक्ल पूर्णिमा (दिगम्बर) — closing day of दशलक्षण
            else if (masa == "भाद्रपद" && paksha == "शुक्ल" && tithiNum == 15) {
                jainFestival = "क्षमावाणी पर्व (दिगम्बर)"
            }
            // महावीर निर्वाण: कार्तिक कृष्ण अमावस्या (दीपावली)
            else if (masa == "कार्तिक" && paksha == "कृष्ण" && tithiRaw == 29) {
                jainFestival = "महावीर निर्वाण कल्याणक (दीपावली)"
            }
            // ज्ञान पंचमी: कार्तिक शुक्ल ५
            else if (masa == "कार्तिक" && paksha == "शुक्ल" && tithiNum == 5) {
                jainFestival = "ज्ञान पंचमी (श्रुत-ज्ञान आराधना)"
            }
            // महावीर जयंती: चैत्र शुक्ल त्रयोदशी
            else if (masa == "चैत्र" && paksha == "शुक्ल" && tithiNum == 13) {
                jainFestival = "महावीर जयन्ती (२४वें तीर्थंकर का जन्म-कल्याणक)"
            }
            // अक्षय तृतीया: वैशाख शुक्ल ३ (ऋषभदेव के प्रथम आहार-दान का दिन)
            else if (masa == "वैशाख" && paksha == "शुक्ल" && tithiNum == 3) {
                jainFestival = "अक्षय तृतीया (ऋषभदेव प्रथम आहार-दान)"
            }
            // मौन एकादशी: मार्गशीर्ष शुक्ल ११
            else if (masa == "मार्गशीर्ष" && paksha == "शुक्ल" && tithiNum == 11) {
                jainFestival = "मौन एकादशी"
            }

            JainPanchang(
                tithi = "$paksha $tithiName",
                vara = VARAS[cal.get(Calendar.DAY_OF_WEEK) - 1],
                nakshatra = nak.hindiName,
                paksha = paksha,
                masa = masa,
                jainFestival = jainFestival
            )
        } catch (_: Exception) {
            JainPanchang(
                tithi = "शुक्ल प्रतिपदा",
                vara = VARAS[Calendar.getInstance().get(Calendar.DAY_OF_WEEK) - 1],
                nakshatra = "अश्विनी",
                paksha = "शुक्ल",
                masa = "चैत्र",
                jainFestival = null
            )
        }
    }

    fun getUpcomingVratDates(birthNakshatraIndex: Int, daysAhead: Int = 60): List<UpcomingVrat> {
        val specialTithis = setOf(10, 13, 14, 25, 28, 29)
        val today = Calendar.getInstance()
        val results = mutableListOf<UpcomingVrat>()

        var prevTithiRaw = -1
        var prevNakshatraIdx = -1

        for (i in 0 until daysAhead) {
            val d = Calendar.getInstance()
            d.set(today.get(Calendar.YEAR), today.get(Calendar.MONTH), today.get(Calendar.DAY_OF_MONTH) + i)
            val dateStr = "${d.get(Calendar.YEAR)}-${(d.get(Calendar.MONTH) + 1).toString().padStart(2, '0')}-${d.get(Calendar.DAY_OF_MONTH).toString().padStart(2, '0')}"
            val jde = AstronomyUtils.toJulianDay(dateStr, "06:00")

            val moonTropical = AstronomyUtils.getMoonTropicalLongitude(jde)
            val sunLong = AstronomyUtils.getSunLongitude(jde)
            val elongation = AstronomyUtils.normDeg(moonTropical - sunLong)
            val tithiRaw = floor(elongation / 12.0).toInt()
            val paksha = if (elongation < 180) "shukla" else "krishna"
            val tithiNum = ((tithiRaw % 15) + 1).coerceIn(0, 14)
            val tithiHindi = when {
                tithiRaw == 14 -> "पूर्णिमा"
                tithiRaw == 29 -> "अमावस्या"
                else -> TITHI_NAMES_HINDI[(tithiNum - 1).coerceIn(0, 14)]
            }

            val sidereal = AstronomyUtils.getSiderealLongitude(jde)
            val nakshatraIdx = minOf(floor(AstronomyUtils.normDeg(sidereal) / 13.333333).toInt(), 26)

            // Tithi-based vrats
            if (tithiRaw != prevTithiRaw && tithiRaw in specialTithis) {
                val (vratType, name) = when (tithiRaw) {
                    10 -> "ekadashi" to "शुक्ल एकादशी"
                    25 -> "ekadashi" to "कृष्ण एकादशी"
                    13 -> "chaturdashi" to "शुक्ल चतुर्दशी"
                    28 -> "chaturdashi" to "कृष्ण चतुर्दशी"
                    14 -> "purnima" to "पूर्णिमा"
                    else -> "amavasya" to "अमावस्या"
                }
                results.add(UpcomingVrat(d.timeInMillis, tithiRaw, paksha, tithiNum, tithiHindi, nakshatraIdx, vratType, name))
            }

            // Nakshatra-based vrat
            if (nakshatraIdx == birthNakshatraIndex && prevNakshatraIdx != birthNakshatraIndex) {
                results.add(UpcomingVrat(d.timeInMillis, tithiRaw, paksha, tithiNum, tithiHindi, nakshatraIdx, "nakshatra", "जन्म नक्षत्र व्रत"))
            }

            prevTithiRaw = tithiRaw
            prevNakshatraIdx = nakshatraIdx
        }

        return results.sortedBy { it.date }
    }
}
