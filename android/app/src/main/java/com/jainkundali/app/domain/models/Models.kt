package com.jainkundali.app.domain.models

enum class NakshatraNature(val key: String) {
    PARAM_SHUBHA("param_shubha"),
    SHUBHA("shubha"),
    MISHRA("mishra"),
    ASHUBHA("ashubha")
}

enum class KarmaType(val key: String) {
    GYANAVARANIYA("Gyanavaraniya"),
    DARSHANAVARANIYA("Darshanavaraniya"),
    VEDANIYA("Vedaniya"),
    MOHANIYA("Mohaniya"),
    AYUSHYA("Ayushya"),
    NAAM("Naam"),
    GOTRA("Gotra"),
    ANTARAYA("Antaraya"),
    CHARITRA_MOHANIYA("Charitra Mohaniya"),
    SARVA_KARMA_KSHAY("Sarva karma kshay")
}

data class Tirthankara(
    val id: Int,
    val name: String,
    val hindiName: String,
    val aka: String? = null,
    val father: String,
    val mother: String,
    val birthPlace: String,
    val birthNakshatra: String,
    val birthRashi: String,
    val birthTithi: String,
    val nirvanaPlace: String,
    val varna: String,
    val hindiVarna: String,
    val symbol: String,
    val hindiSymbol: String,
    val height: String,
    val lifespan: String,
    val yaksha: String,
    val yakshini: String,
    val tree: String,
    val karmaAddressed: String,
    val pujaBenefit: String,
    val mantra: String,
    val stotra: String,
    val notes: String? = null
)

data class Nakshatra(
    val index: Int,
    val name: String,
    val hindiName: String,
    val startDeg: Double,
    val endDeg: Double,
    val nature: NakshatraNature,
    val karmaType: KarmaType,
    val tirthankarasBorn: List<String>,
    val rulingJyotishiDev: String,
    val spiritualTraits: String,
    val karmaManifestation: String,
    val sadhana: String,
    val deityNote: String
)

data class Ara(
    val id: Int,
    val name: String,
    val hindiName: String,
    val aka: String,
    val nature: String,
    val duration: String,
    val maxLifespanDescription: String,
    val heightDescription: String,
    val foodInterval: String,
    val moralQuality: String,
    val spiritualPotential: String,
    val tirthankarasBorn: Int,
    val tirthankarasDetail: String? = null,
    val sadhanaNote: String? = null,
    val currentAra: Boolean = false,
    val notes: String
)

data class Graha(
    val id: Int,
    val name: String,
    val hindiName: String,
    val color: String,
    val nature: String,
    val vimshottariYears: Int,
    val speedDescription: String,
    val jyotishiDevType: String,
    val karmaConnection: String,
    val sadhana: String,
    val jainDescription: String? = null
)

data class PrimaryMantra(
    val text: String,
    val meaning: String = "",
    val count: Int,
    val timing: String,
    val maala: String,
    val karmaEffect: String
)

data class SecondaryMantra(
    val stotraName: String,
    val shloka: String,
    val meaning: String = "",
    val count: Int,
    val timing: String
)

data class Yantra(
    val name: String,
    val material: String,
    val installation: String,
    val dimension: String,
    val effect: String
)

data class Puja(
    val name: String,
    val tirthankara: String,
    val vidhi: String,
    val benefit: String,
    val tithi: String,
    val stotra: String
)

data class Tapasya(
    val name: String,
    val description: String,
    val tithi: String,
    val anusthana: String
)

data class KarmaSadhana(
    val karmaEn: String,
    val karmaHindi: String,
    val isGhatiya: Boolean,
    val dailyManifestation: String,
    val statusWhenDominant: String,
    val statusWhenNormal: String,
    val samanyaUpaya: String,
    val visheshUpaya: String,
    val pratahNiyam: String,
    val saayamNiyam: String,
    val primaryMantra: PrimaryMantra,
    val secondaryMantra: SecondaryMantra,
    val yantra: Yantra,
    val puja: Puja,
    val tapasya: Tapasya,
    val shubhaTithi: List<Int>
)

data class DashaSadhana(
    val lord: String,
    val lordHindi: String,
    val natureDescription: String,
    val dashaEffect: String,
    val dashaSadhana: String,
    val bestTithi: String
)

data class JainFestival(
    val name: String,
    val tithiShuklaKrishna: String,
    val tithiNum: Int,
    val approxMonth: String,
    val karmaBenefit: String,
    val sadhana: String,
    val color: String
)

data class AntardashaInfo(
    val lord: String,
    val lordHindi: String,
    val yearsTotal: Double,
    val startDate: String,
    val endDate: String,
    val yearsRemaining: Double
)

data class PratyantardashInfo(
    val lord: String,
    val lordHindi: String,
    val startDate: String,
    val endDate: String,
    val daysRemaining: Int
)

data class DashaInfo(
    val lord: String,
    val lordHindi: String,
    // Fractional after PARITY-REPORT-2026 Layer 2/3 duration modifiers.
    val yearsTotal: Double,
    val startDate: String,
    val endDate: String,
    val yearsRemaining: Double,
    val antardasha: String,
    val antardashaHindi: String,
    val antardashaInfo: AntardashaInfo,
    val pratyantardasha: PratyantardashInfo
)

data class KarmaState(
    val id: String,
    val karmaEn: String,
    val karmaHindi: String,
    val intensity: Int,
    val state: String,
    val manifestation: String,
    val nirjaraPractice: String
)

data class LifeDomainPrediction(
    val domain: String,
    val hindiDomain: String,
    val prediction: String,
    val isFavorable: Boolean
)

data class CombinedRemedy(
    val primarySadhana: String,
    val dashaRemedy: String,
    val karmaRemedy: String,
    val recommendedTithi: String,
    val yantraRecommendation: String,
    val tapasyaRecommendation: String,
    // Bhaktamar Stotra prescription — Pursharth (free will) layer from Panch Samvay.
    // Source: Research Report §1 (Pursharth vector) + §5-§7 (Bhaktamar remedial matrix).
    // Manatunga Acharya's 48-verse hymn mapped to planetary/karma afflictions.
    val bhaktamarShloka: String = "",
    val bhaktamarMantra: String = "",
    val bhaktamarProtocol: String = ""
)

// Ishtakaal — birth moment elapsed time in traditional Jain time units.
// Source: PARITY-REPORT-2026 §"Precise Ishtakaal Conversion" (primary).
// Hierarchy: 1 Ghati = 60 Palas; 1 Pala = 24s = 60 Vipalas (Prāṇas);
// 1 Prāṇa = 7 Stokas; 1 Stoka = 7 Lavas.
data class IshtakaalResult(
    val ghatis: Int,
    val palas: Int,
    val vipalas: Int,
    val equivalentMuhurtas: Double,
    val stokaMicro: Int,
    val lavaMicro: Int,
    val formatted: String
)

// Jain sidereal zodiac projection — unequal muhurta spans from Surya Prajnapti.
// Source: Research Report §4 + SP-1. Total circumference: 819 + 11/67 muhurtas.
data class JainZodiacProjection(
    val graduatedMuhurtas: Double,
    val activeNakshatra: String,
    val balanceWithinNakshatraMuhurtas: Double,
    val spanClass: String    // "abhijit" | "short_span" | "long_span" | "standard_span"
)

data class BirthFormData(
    val fullName: String,
    val dob: String,
    val time: String,
    val place: String,
    val lat: String,
    val lng: String,
    val gender: String
)

data class UserProfile(
    val name: String,
    val gender: String,
    val birthNakshatra: String,
    val birthNakshatraHindi: String,
    val nakshatraPada: Int,
    val birthRashi: String,
    val moonLongitude: Double,
    val tirthankarAffinity: String,
    val tirthankarAffinityHindi: String,
    val nakshatraKarmaType: String,
    val nakshatraNature: String,
    val nakshatraNatureHindi: String,
    val currentDasha: DashaInfo,
    val dominantKarma: String,
    val dominantKarmaEn: String,
    val gunasthana: Int,
    val formData: BirthFormData,
    // 1..30 tithi of the lunar month at birth; 0 = unknown. Drives the Tithi Pravāh
    // dashā layer (MP-§D2 L2) — karma peak / nirjarā day computation.
    val birthTithiNum: Int = 0,
    // Jain high-precision temporal coordinate. Source: Research Report §2 + SP-1.
    val ishtakaal: IshtakaalResult? = null,
    // Jain sidereal zodiac projection from unequal muhurta spans. Source: SP-1 + Research Report §4.
    val jainZodiacProjection: JainZodiacProjection? = null
)

data class City(
    val name: String,
    val hindiName: String,
    val state: String,
    val latitude: Double,
    val longitude: Double
)

data class JainPanchang(
    val tithi: String,
    val vara: String,
    val nakshatra: String,
    val paksha: String,
    val masa: String,
    val jainFestival: String?
)

data class UpcomingVrat(
    val date: Long,
    val tithiRaw: Int,
    val paksha: String,
    val tithiNum: Int,
    val tithiHindi: String,
    val nakshatraIndex: Int,
    val vratType: String,
    val name: String
)

data class DayContext(
    val tithi: String,
    val vara: String,
    val nakshatra: String,
    val paksha: String,
    // 1..30 lunar-month tithi number (1..15 śukla, 16..30 kṛṣṇa); 0 = unknown.
    // Needed for the Tithi Pravāh dashā layer (MP-§D2 L2).
    val tithiNum: Int = 0
)

data class MantraEntry(
    val text: String,
    val meaning: String,
    val recommendedCount: Int,
    val timing: String,
    val category: String,
    val karmaEffect: String
)
