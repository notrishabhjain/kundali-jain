package com.jainkundali.app.domain.engine

import com.jainkundali.app.domain.data.getKarmaSadhana
import java.util.Calendar
import kotlin.math.floor

data class PersonalizedMuhurta(
    val date: Long,
    val dateString: String,
    val tithiName: String,
    val tithiRaw: Int,
    val activity: String
)

object MuhurtaEngine {

    private val TITHI_NAMES_HINDI = listOf(
        "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी",
        "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
        "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा"
    )

    fun getPersonalizedMuhurtas(dominantKarmaEn: String, daysAhead: Int = 90): List<PersonalizedMuhurta> {
        val sadhana = getKarmaSadhana(dominantKarmaEn)
        val shubhaTithis = sadhana.shubhaTithi
        val today = Calendar.getInstance()
        val results = mutableListOf<PersonalizedMuhurta>()

        var prevTithiRaw = -1

        for (i in 0 until daysAhead) {
            val d = Calendar.getInstance()
            d.set(today.get(Calendar.YEAR), today.get(Calendar.MONTH), today.get(Calendar.DAY_OF_MONTH) + i)
            val dateStr = "${d.get(Calendar.YEAR)}-${(d.get(Calendar.MONTH) + 1).toString().padStart(2, '0')}-${d.get(Calendar.DAY_OF_MONTH).toString().padStart(2, '0')}"
            val jde = AstronomyUtils.toJulianDay(dateStr, "06:00")

            val moonTropical = AstronomyUtils.getMoonTropicalLongitude(jde)
            val sunLong = AstronomyUtils.getSunLongitude(jde)
            val elongation = AstronomyUtils.normDeg(moonTropical - sunLong)
            val tithiRaw = floor(elongation / 12.0).toInt()

            if (tithiRaw != prevTithiRaw && tithiRaw in shubhaTithis) {
                val tithiNum = if (tithiRaw < 15) tithiRaw + 1 else tithiRaw - 14
                val tithiName = when {
                    tithiRaw == 29 -> "अमावस्या"
                    tithiRaw == 14 -> "पूर्णिमा"
                    else -> TITHI_NAMES_HINDI.getOrElse(tithiNum - 1) { "तिथि" }
                }
                val paksha = if (elongation < 180) "शुक्ल" else "कृष्ण"
                val fullTithiName = "$paksha $tithiName"

                val activity = getActivityForTithi(tithiRaw)

                results.add(
                    PersonalizedMuhurta(
                        date = d.timeInMillis,
                        dateString = dateStr,
                        tithiName = fullTithiName,
                        tithiRaw = tithiRaw,
                        activity = activity
                    )
                )
            }
            prevTithiRaw = tithiRaw
        }

        return results.sortedBy { it.date }
    }

    fun getMuhurtaForActivity(activity: String, karmaEn: String): PersonalizedMuhurta? {
        val allMuhurtas = getPersonalizedMuhurtas(karmaEn, 90)
        return allMuhurtas.firstOrNull { it.activity == activity }
    }

    private fun getActivityForTithi(tithiRaw: Int): String {
        return when {
            tithiRaw in listOf(2, 3, 7, 8) -> "यंत्र स्थापना"
            tithiRaw in listOf(0, 1, 5, 6, 15, 16, 20, 21) -> "साधना आरंभ"
            tithiRaw in listOf(4, 9, 10, 19, 24, 25) -> "पूजा"
            tithiRaw in listOf(13, 14, 28, 29) -> "व्रत"
            else -> "साधना आरंभ"
        }
    }
}
