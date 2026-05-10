package com.jainkundali.app.domain.engine

import com.jainkundali.app.domain.models.*
import com.jainkundali.app.domain.data.*
import java.util.Calendar
import kotlin.math.roundToInt

object ProfileEngine {

    private val KARMA_HINDI: Map<String, String> = mapOf(
        "Gyanavaraniya" to "ज्ञानावरणीय",
        "Darshanavaraniya" to "दर्शनावरणीय",
        "Vedaniya" to "वेदनीय",
        "Mohaniya" to "मोहनीय",
        "Charitra Mohaniya" to "चारित्र मोहनीय",
        "Ayushya" to "आयुष्य",
        "Naam" to "नाम",
        "Gotra" to "गोत्र",
        "Antaraya" to "अंतराय",
        "Sarva karma kshay" to "सर्व कर्म क्षय"
    )

    private val NATURE_HINDI: Map<String, String> = mapOf(
        "param_shubha" to "परम शुभ",
        "shubha" to "शुभ",
        "mishra" to "मिश्र",
        "ashubha" to "अशुभ"
    )

    private val TIRTHANKAR_HI_TO_EN: Map<String, String> = mapOf(
        "ऋषभदेव" to "Rishabhdev", "आदिनाथ" to "Adinatha", "अजितनाथ" to "Ajitnatha",
        "संभवनाथ" to "Sambhavanatha", "अभिनन्दननाथ" to "Abhinandananatha",
        "सुमतिनाथ" to "Sumatinatha", "पद्मप्रभु" to "Padmaprabhu",
        "सुपार्श्वनाथ" to "Suparshvanatha", "चन्द्रप्रभु" to "Chandraprabhu",
        "सुविधिनाथ" to "Suvidhinate", "शीतलनाथ" to "Shitalnatha",
        "श्रेयांसनाथ" to "Shreyamsanatha", "वासुपूज्यनाथ" to "Vasupujyanatha",
        "विमलनाथ" to "Vimalnatha", "अनंतनाथ" to "Anantnatha",
        "धर्मनाथ" to "Dharmanatha", "शान्तिनाथ" to "Shantinatha",
        "कुन्थुनाथ" to "Kunthunatha", "अरनाथ" to "Aranatha",
        "मल्लिनाथ" to "Mallinatha", "मुनिसुव्रतनाथ" to "Munisuvratanatha",
        "नमिनाथ" to "Naminatha", "नेमिनाथ" to "Neminatha",
        "पार्श्वनाथ" to "Parshvanatha", "महावीर स्वामी" to "Mahavira"
    )

    fun getTirthankarAffinity(nakshatra: Nakshatra): Pair<String, String> {
        if (nakshatra.tirthankarasBorn.isNotEmpty()) {
            val first = nakshatra.tirthankarasBorn[0]
            val hi = first.replace(Regex("\\([^)]*\\)"), "").trim()
            val en = TIRTHANKAR_HI_TO_EN[hi] ?: hi
            return Pair(en, hi)
        }
        val defaults: Map<String, Pair<String, String>> = mapOf(
            "Gyanavaraniya" to Pair("Kunthunatha", "कुन्थुनाथ"),
            "Darshanavaraniya" to Pair("Naminatha", "नमिनाथ"),
            "Mohaniya" to Pair("Parshvanatha", "पार्श्वनाथ"),
            "Charitra Mohaniya" to Pair("Dharmanatha", "धर्मनाथ"),
            "Vedaniya" to Pair("Padmaprabhu", "पद्मप्रभु"),
            "Antaraya" to Pair("Sambhavanatha", "सम्भवनाथ"),
            "Naam" to Pair("Abhinandananatha", "अभिनन्दननाथ"),
            "Gotra" to Pair("Mallinatha", "मल्लिनाथ"),
            "Ayushya" to Pair("Aranatha", "अरनाथ")
        )
        return defaults[nakshatra.karmaType.key] ?: Pair("Mahavira", "महावीर स्वामी")
    }

    fun estimateGunasthana(nakshatraNature: String, dashaLord: String): Int {
        var base = when (nakshatraNature) {
            "param_shubha" -> 4
            "shubha" -> 3
            "mishra" -> 2
            else -> 1
        }
        if (dashaLord == "Mohaniya" || dashaLord == "Darshanavaraniya") {
            base = maxOf(1, base - 1)
        }
        if (dashaLord == "Gyanavaraniya") {
            base = maxOf(1, base - 1)
        }
        if (dashaLord == "Vedaniya" && base > 2) {
            base = maxOf(2, base - 1)
        }
        return base
    }

    fun generateUserProfile(data: BirthFormData): UserProfile {
        val siderealDeg: Double = try {
            val jde = AstronomyUtils.toJulianDay(data.dob, data.time.ifEmpty { "12:00" })
            AstronomyUtils.getSiderealLongitude(jde)
        } catch (e: Exception) {
            var hash = 0
            for (c in data.fullName) {
                hash = c.code + ((hash shl 5) - hash)
            }
            (Math.abs(hash) % 360).toDouble()
        }

        val nakshatra = getNakshatraByDegree(siderealDeg)
        val pada = getNakshatraPada(siderealDeg)
        val rashi = AstronomyUtils.getRashi(siderealDeg)
        val dasha = DashaEngine.calculateDasha(siderealDeg, data.dob)
        val tirthankar = getTirthankarAffinity(nakshatra)
        val gunasthana = estimateGunasthana(nakshatra.nature.key, dasha.lord)

        val karmaType = nakshatra.karmaType.key
        val dominantKarmaHindi = KARMA_HINDI[karmaType] ?: karmaType

        return UserProfile(
            name = data.fullName,
            gender = data.gender,
            birthNakshatra = nakshatra.name,
            birthNakshatraHindi = nakshatra.hindiName,
            nakshatraPada = pada,
            birthRashi = rashi,
            moonLongitude = (siderealDeg * 100).roundToInt() / 100.0,
            tirthankarAffinity = tirthankar.second,
            tirthankarAffinityHindi = tirthankar.second,
            nakshatraKarmaType = karmaType,
            nakshatraNature = nakshatra.nature.key,
            nakshatraNatureHindi = NATURE_HINDI[nakshatra.nature.key] ?: nakshatra.nature.key,
            currentDasha = dasha,
            dominantKarma = dominantKarmaHindi,
            dominantKarmaEn = karmaType,
            gunasthana = gunasthana,
            formData = data
        )
    }

    fun getTodayContext(): DayContext {
        val now = Calendar.getInstance()
        val varas = listOf("रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार")
        val vara = varas[now.get(Calendar.DAY_OF_WEEK) - 1]

        val dateStr = "${now.get(Calendar.YEAR)}-${(now.get(Calendar.MONTH) + 1).toString().padStart(2, '0')}-${now.get(Calendar.DAY_OF_MONTH).toString().padStart(2, '0')}"
        val timeStr = "${now.get(Calendar.HOUR_OF_DAY).toString().padStart(2, '0')}:${now.get(Calendar.MINUTE).toString().padStart(2, '0')}"
        val jde = AstronomyUtils.toJulianDay(dateStr, timeStr)
        val todaySidereal = AstronomyUtils.getSiderealLongitude(jde)
        val todayNakshatra = getNakshatraByDegree(todaySidereal)

        val sunLong = AstronomyUtils.getSunLongitude(jde)
        val moonLong = AstronomyUtils.getMoonTropicalLongitude(jde)
        val elongation = AstronomyUtils.normDeg(moonLong - sunLong)
        val tithiNum = (elongation / 12.0).toInt() + 1
        val paksha = if (elongation < 180) "शुक्ल" else "कृष्ण"
        val tithiNames = listOf("", "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा/अमावस्या")
        val tithiIndex = if (tithiNum > 15) tithiNum - 15 else tithiNum
        val tithi = "$paksha ${tithiNames.getOrElse(tithiIndex) { "एकादशी" }}"

        return DayContext(
            tithi = tithi,
            vara = vara,
            nakshatra = todayNakshatra.hindiName,
            paksha = paksha
        )
    }
}

class AnalysisSynthesizer {
    companion object {
        fun generateTodaysMessage(profile: UserProfile, day: DayContext): String {
            val greeting = "जय जिनेंद्र।\n\n"

            val tithiOpening = "आज ${day.tithi} की पावन तिथि है, वार ${day.vara} है। आत्म-निरीक्षण और इंद्रिय-संयम का यह विशेष अवसर है। "

            val astrologicalContext = "आपका जन्म ${profile.birthNakshatraHindi} नक्षत्र (${profile.nakshatraNatureHindi} प्रकृति, पाद ${profile.nakshatraPada}) में हुआ है। यह ${profile.birthRashi} का नक्षत्र है। वर्तमान में आप ${profile.currentDasha.lordHindi} महादशा में हैं (शेष ${profile.currentDasha.yearsRemaining} वर्ष)। ${profile.currentDasha.antardashaHindi} अंतर्दशा चल रही है।\n\n"

            val karmaProfile = KarmaEngine.calculateKarmaProfile(profile.dominantKarmaEn, profile.currentDasha.lord, profile.gunasthana)
            val dominant = karmaProfile.find { it.karmaEn == profile.dominantKarmaEn } ?: karmaProfile[0]

            val karmaNarrative = "${profile.birthNakshatraHindi} नक्षत्र में जन्मे जातकों में ${dominant.karmaHindi} कर्म का विशेष प्रभाव रहता है। ${profile.currentDasha.lordHindi} दशा में यह कर्म इस रूप में प्रकट होता है: ${dominant.manifestation}\n\n"

            val remedies = RemedyEngine.generateRemedies(profile)
            val prescription = "${day.tithi} की इस ऊर्जा में आज आपके लिए विशेष साधना है: ${remedies.primarySadhana}\n\nआज ${profile.currentDasha.lordHindi} दशा की चंचलता को सम्यग्दर्शन की दृढ़ता में बदलने का अवसर है। ${remedies.dashaRemedy}"

            return greeting + tithiOpening + astrologicalContext + karmaNarrative + prescription
        }
    }
}
