package com.jainkundali.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.jainkundali.app.data.entities.ProfileEntity
import com.jainkundali.app.data.repository.ProfileRepository
import com.jainkundali.app.domain.data.KARMA_SADHANA
import com.jainkundali.app.domain.data.getKarmaSadhana
import com.jainkundali.app.domain.engine.ProfileEngine
import com.jainkundali.app.domain.models.*
import kotlinx.coroutines.flow.catch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KarmaMilanScreen(
    profileRepository: ProfileRepository,
    onNavigateBack: () -> Unit
) {
    // A DB read error must not crash this screen — degrade to an empty profile list.
    val profilesFlow = remember { profileRepository.allProfiles.catch { emit(emptyList()) } }
    val profiles by profilesFlow.collectAsState(initial = emptyList())
    var selectedProfile1 by remember { mutableStateOf<ProfileEntity?>(null) }
    var selectedProfile2 by remember { mutableStateOf<ProfileEntity?>(null) }
    var expanded1 by remember { mutableStateOf(false) }
    var expanded2 by remember { mutableStateOf(false) }
    var compatibilityResult by remember { mutableStateOf<MilanResult?>(null) }

    LaunchedEffect(selectedProfile1, selectedProfile2) {
        if (selectedProfile1 != null && selectedProfile2 != null) {
            val formData1 = BirthFormData(
                fullName = selectedProfile1!!.name,
                dob = selectedProfile1!!.dateOfBirth,
                time = selectedProfile1!!.birthTime,
                place = selectedProfile1!!.birthPlace,
                lat = selectedProfile1!!.latitude.toString(),
                lng = selectedProfile1!!.longitude.toString(),
                gender = selectedProfile1!!.gender
            )
            val formData2 = BirthFormData(
                fullName = selectedProfile2!!.name,
                dob = selectedProfile2!!.dateOfBirth,
                time = selectedProfile2!!.birthTime,
                place = selectedProfile2!!.birthPlace,
                lat = selectedProfile2!!.latitude.toString(),
                lng = selectedProfile2!!.longitude.toString(),
                gender = selectedProfile2!!.gender
            )
            val profile1 = ProfileEngine.generateUserProfile(formData1)
            val profile2 = ProfileEngine.generateUserProfile(formData2)
            compatibilityResult = calculateCompatibility(profile1, profile2)
        } else {
            compatibilityResult = null
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("कर्म मिलान") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "वापस")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    navigationIconContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            if (profiles.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "कृपया पहले प्रोफ़ाइल बनाएं",
                        style = MaterialTheme.typography.bodyLarge
                    )
                }
            } else {
                // Profile 1 Selector
                Text(
                    text = "प्रथम व्यक्ति",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Medium
                )
                Spacer(modifier = Modifier.height(4.dp))
                ExposedDropdownMenuBox(
                    expanded = expanded1,
                    onExpandedChange = { expanded1 = it }
                ) {
                    OutlinedTextField(
                        value = selectedProfile1?.name ?: "प्रोफ़ाइल चुनें",
                        onValueChange = {},
                        readOnly = true,
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded1) },
                        modifier = Modifier.fillMaxWidth().menuAnchor()
                    )
                    ExposedDropdownMenu(
                        expanded = expanded1,
                        onDismissRequest = { expanded1 = false }
                    ) {
                        profiles.filter { it.id != selectedProfile2?.id }.forEach { profile ->
                            DropdownMenuItem(
                                text = { Text("${profile.name} (${profile.dateOfBirth})") },
                                onClick = {
                                    selectedProfile1 = profile
                                    expanded1 = false
                                }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Profile 2 Selector
                Text(
                    text = "द्वितीय व्यक्ति",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Medium
                )
                Spacer(modifier = Modifier.height(4.dp))
                ExposedDropdownMenuBox(
                    expanded = expanded2,
                    onExpandedChange = { expanded2 = it }
                ) {
                    OutlinedTextField(
                        value = selectedProfile2?.name ?: "प्रोफ़ाइल चुनें",
                        onValueChange = {},
                        readOnly = true,
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded2) },
                        modifier = Modifier.fillMaxWidth().menuAnchor()
                    )
                    ExposedDropdownMenu(
                        expanded = expanded2,
                        onDismissRequest = { expanded2 = false }
                    ) {
                        profiles.filter { it.id != selectedProfile1?.id }.forEach { profile ->
                            DropdownMenuItem(
                                text = { Text("${profile.name} (${profile.dateOfBirth})") },
                                onClick = {
                                    selectedProfile2 = profile
                                    expanded2 = false
                                }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Results
                compatibilityResult?.let { result ->
                    // Score Card
                    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "कर्म अनुकूलता अंक",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "${result.score}/100",
                                style = MaterialTheme.typography.headlineLarge,
                                fontWeight = FontWeight.Bold,
                                color = if (result.score >= 70)
                                    MaterialTheme.colorScheme.primary
                                else if (result.score >= 40)
                                    MaterialTheme.colorScheme.tertiary
                                else
                                    MaterialTheme.colorScheme.error
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = result.overallMessage,
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))

                    // Detailed Comparison
                    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "विस्तृत विश्लेषण",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            result.details.forEach { detail ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = detail.label,
                                        style = MaterialTheme.typography.bodyMedium
                                    )
                                    Text(
                                        text = if (detail.matched) "✓ ${detail.value}" else "✗ ${detail.value}",
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontWeight = FontWeight.Medium,
                                        color = if (detail.matched)
                                            MaterialTheme.colorScheme.primary
                                        else
                                            MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                    )
                                }
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))

                    // Shared Sadhana
                    if (result.sharedSadhana.isNotEmpty()) {
                        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    text = "साझा साधना अनुशंसा",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                result.sharedSadhana.forEach { sadhana ->
                                    Text(
                                        text = "• $sadhana",
                                        style = MaterialTheme.typography.bodyMedium,
                                        modifier = Modifier.padding(vertical = 2.dp)
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                    }
                }
            }
        }
    }
}

private data class MilanDetail(
    val label: String,
    val value: String,
    val matched: Boolean
)

private data class MilanResult(
    val score: Int,
    val overallMessage: String,
    val details: List<MilanDetail>,
    val sharedSadhana: List<String>
)

private fun calculateCompatibility(profile1: UserProfile, profile2: UserProfile): MilanResult {
    var score = 0
    val details = mutableListOf<MilanDetail>()
    val sharedSadhana = mutableListOf<String>()

    val karma1 = KARMA_SADHANA[profile1.dominantKarmaEn]
    val karma2 = KARMA_SADHANA[profile2.dominantKarmaEn]
    val name1 = profile1.name.ifBlank { "प्रथम" }
    val name2 = profile2.name.ifBlank { "द्वितीय" }

    // ── Dimension 1: Karma sameness / complementarity (15 pts) ─────────────────
    val sameKarma = profile1.dominantKarmaEn == profile2.dominantKarmaEn
    val complementary = if (karma1 != null && karma2 != null) {
        karma1.isGhatiya != karma2.isGhatiya
    } else false
    val karmaPoints = when {
        sameKarma -> 15
        complementary -> 12
        else -> 5
    }
    score += karmaPoints
    if (sameKarma) {
        val sadhana = getKarmaSadhana(profile1.dominantKarmaEn)
        sharedSadhana.add("दोनों का प्रबल कर्म ${sadhana.karmaHindi} है — साझा साधना: ${sadhana.samanyaUpaya}")
    } else if (complementary && karma1 != null && karma2 != null) {
        sharedSadhana.add("पूरक कर्म: ${name1} (${karma1.karmaHindi}, ${if (karma1.isGhatiya) "घातिया" else "अघातिया"}) ↔ ${name2} (${karma2.karmaHindi}, ${if (karma2.isGhatiya) "घातिया" else "अघातिया"})")
    }
    details.add(MilanDetail("कर्म-सामंजस्य", "$karmaPoints/15 अंक — ${if (sameKarma) "समान" else if (complementary) "पूरक" else "भिन्न"}", karmaPoints >= 10))

    // ── Dimension 2: Mahadasha lord (12 pts) ──────────────────────────────────
    val sameDashaLord = profile1.currentDasha.lord == profile2.currentDasha.lord
    val dashaPoints = if (sameDashaLord) 12 else 4
    score += dashaPoints
    details.add(MilanDetail("दशा-तुल्यता", "$dashaPoints/12 — ${if (sameDashaLord) "समान महादशा (${profile1.currentDasha.lordHindi})" else "${profile1.currentDasha.lordHindi} ↔ ${profile2.currentDasha.lordHindi}"}", sameDashaLord))

    // ── Dimension 3: Antardasha overlap (8 pts) ───────────────────────────────
    val antarLord1 = profile1.currentDasha.antardashaInfo.lord
    val antarLord2 = profile2.currentDasha.antardashaInfo.lord
    val antarSame = antarLord1 == antarLord2
    val antarCross = antarLord1 == profile2.currentDasha.lord || antarLord2 == profile1.currentDasha.lord
    val antarPoints = when {
        antarSame -> 8
        antarCross -> 5
        else -> 2
    }
    score += antarPoints
    details.add(MilanDetail("अंतर्दशा-संयोग", "$antarPoints/8 — ${if (antarSame) "समान अंतर्दशा" else if (antarCross) "अन्तर्क्रिया" else "स्वतंत्र"}", antarPoints >= 5))

    // ── Dimension 4: Nakshatra nature (10 pts) ────────────────────────────────
    val nature1 = profile1.nakshatraNature
    val nature2 = profile2.nakshatraNature
    val natureScore = nakshatraNatureCompat(nature1, nature2)
    score += natureScore
    details.add(MilanDetail("नक्षत्र-प्रकृति", "$natureScore/10 — ${profile1.nakshatraNatureHindi} ↔ ${profile2.nakshatraNatureHindi}", natureScore >= 7))

    // ── Dimension 5: Same / sister nakshatra (10 pts) ─────────────────────────
    val sameNakshatra = profile1.birthNakshatra == profile2.birthNakshatra
    val sameKarmaTypeFromNakshatra = profile1.nakshatraKarmaType == profile2.nakshatraKarmaType
    val nakshatraPoints = when {
        sameNakshatra -> 10
        sameKarmaTypeFromNakshatra -> 6
        else -> 2
    }
    score += nakshatraPoints
    details.add(MilanDetail("नक्षत्र-मेल", "$nakshatraPoints/10 — ${if (sameNakshatra) "समान नक्षत्र (${profile1.birthNakshatraHindi})" else "${profile1.birthNakshatraHindi} ↔ ${profile2.birthNakshatraHindi}"}", nakshatraPoints >= 6))

    // ── Dimension 6: Gunasthana proximity (10 pts) ────────────────────────────
    val gunDiff = kotlin.math.abs(profile1.gunasthana - profile2.gunasthana)
    val gunPoints = when (gunDiff) {
        0 -> 10
        1 -> 7
        2 -> 4
        else -> 2
    }
    score += gunPoints
    details.add(MilanDetail("गुणस्थान-निकटता", "$gunPoints/10 — गुणस्थान ${profile1.gunasthana} ↔ ${profile2.gunasthana}", gunPoints >= 7))

    // ── Dimension 7: Shared shubha tithi (10 pts) ─────────────────────────────
    val tithiOverlap = if (karma1 != null && karma2 != null)
        karma1.shubhaTithi.intersect(karma2.shubhaTithi.toSet())
    else emptySet()
    val tithiPoints = when {
        tithiOverlap.size >= 3 -> 10
        tithiOverlap.size == 2 -> 7
        tithiOverlap.size == 1 -> 4
        else -> 0
    }
    score += tithiPoints
    if (tithiOverlap.isNotEmpty()) {
        sharedSadhana.add("साझा शुभ तिथियाँ (इन दिनों दोनों मिलकर साधना करें): ${tithiOverlap.sorted().joinToString(", ")}")
    }
    details.add(MilanDetail("शुभ-तिथि मेल", "$tithiPoints/10 — ${tithiOverlap.size} साझा तिथि", tithiPoints >= 4))

    // ── Dimension 8: Tirthankara affinity (8 pts) ─────────────────────────────
    val sameTirthankara = profile1.tirthankarAffinity == profile2.tirthankarAffinity
    val tirthankarPoints = if (sameTirthankara) 8 else 3
    score += tirthankarPoints
    details.add(MilanDetail("इष्ट तीर्थंकर", "$tirthankarPoints/8 — ${if (sameTirthankara) "एक ही (श्री ${profile1.tirthankarAffinityHindi})" else "श्री ${profile1.tirthankarAffinityHindi} ↔ श्री ${profile2.tirthankarAffinityHindi}"}", sameTirthankara))

    // ── Dimension 9: Same rashi (5 pts) ───────────────────────────────────────
    val sameRashi = profile1.birthRashi == profile2.birthRashi
    val rashiPoints = if (sameRashi) 5 else 1
    score += rashiPoints
    details.add(MilanDetail("राशि-मेल", "$rashiPoints/5 — ${if (sameRashi) "समान राशि" else "${profile1.birthRashi} ↔ ${profile2.birthRashi}"}", sameRashi))

    // ── Dimension 10: Same pada (mild — 4 pts) ────────────────────────────────
    val samePada = profile1.nakshatraPada == profile2.nakshatraPada
    val padaPoints = if (samePada) 4 else 1
    score += padaPoints
    details.add(MilanDetail("पाद-मेल", "$padaPoints/4 — पाद ${profile1.nakshatraPada} ↔ ${profile2.nakshatraPada}", samePada))

    // ── Dimension 11: Pratyantardasha freshness (8 pts) ───────────────────────
    val praty1 = profile1.currentDasha.pratyantardasha.lord
    val praty2 = profile2.currentDasha.pratyantardasha.lord
    val prSame = praty1 == praty2
    val prPoints = if (prSame) 8 else 3
    score += prPoints
    details.add(MilanDetail("प्रत्यन्तर्दशा", "$prPoints/8 — ${if (prSame) "समान" else "${profile1.currentDasha.pratyantardasha.lordHindi} ↔ ${profile2.currentDasha.pratyantardasha.lordHindi}"}", prSame))

    // Score is now out of 100 (15+12+8+10+10+10+10+8+5+4+8 = 100)
    score = score.coerceIn(0, 100)

    // ── Personalised shared-sadhana suggestions ───────────────────────────────
    if (karma1 != null && karma2 != null && !sameKarma) {
        sharedSadhana.add("${name1} (${karma1.karmaHindi} कर्म) के लिए: ${karma1.pratahNiyam}")
        sharedSadhana.add("${name2} (${karma2.karmaHindi} कर्म) के लिए: ${karma2.pratahNiyam}")
    }
    if (sameTirthankara) {
        sharedSadhana.add("एक ही इष्ट तीर्थंकर — दोनों मिलकर श्री ${profile1.tirthankarAffinityHindi} की प्रतिमा के समक्ष अभिषेक करें।")
    } else {
        sharedSadhana.add("भिन्न इष्ट तीर्थंकर — सम्मिलित अनुष्ठान में दोनों तीर्थंकरों (श्री ${profile1.tirthankarAffinityHindi} एवं श्री ${profile2.tirthankarAffinityHindi}) का अष्टद्रव्य पूजन एक साथ करें।")
    }
    if (gunDiff >= 2) {
        sharedSadhana.add("गुणस्थान अंतर ${gunDiff} है — उच्चतर साथी निम्नतर साथी को स्वाध्याय में मार्गदर्शन दें।")
    }
    if (sameDashaLord) {
        val dashaSadhana = com.jainkundali.app.domain.data.getDashaSadhana(profile1.currentDasha.lord)
        sharedSadhana.add("समान दशा (${profile1.currentDasha.lordHindi}) — दोनों के लिए: ${dashaSadhana.dashaSadhana}")
    }
    if (tithiOverlap.isEmpty() && karma1 != null && karma2 != null) {
        sharedSadhana.add("कोई साझा शुभ तिथि नहीं — दोनों के लिए सर्व-कल्याणक अष्टमी और चतुर्दशी पर सम्मिलित साधना करें।")
    }

    val overallMessage = when {
        score >= 80 -> "उत्तम कर्म-अनुकूलता — दोनों आत्माओं का साधना-संयोग बहुत बलवान है। साझा अनुष्ठान से दोनों को विशेष लाभ।"
        score >= 60 -> "अच्छी अनुकूलता — परस्पर सहयोग से कर्म-निर्जरा सम्भव है। साथ में दैनिक नियम पालन करें।"
        score >= 40 -> "मध्यम अनुकूलता — मूलभूत संयोग है, किंतु प्रत्येक की कर्म-स्थिति भिन्न है। व्यक्तिगत साधना के साथ सायं प्रतिक्रमण साझा करें।"
        score >= 25 -> "साधारण अनुकूलता — अधिकांश आयामों में भिन्नता है। स्वतंत्र साधना मार्ग उचित, संयुक्त धर्म-चर्चा से लाभ।"
        else -> "न्यून अनुकूलता — कर्म-स्थिति और दशा-पथ बहुत भिन्न हैं। प्रत्येक अपने मार्ग पर दृढ़ रहे, पर्व-दिन ही साथ साधना करें।"
    }

    return MilanResult(score = score, overallMessage = overallMessage, details = details, sharedSadhana = sharedSadhana)
}

/** Score 0–10 for compatibility of two nakshatra natures.
 *  param_shubha > shubha > mishra > ashubha. */
private fun nakshatraNatureCompat(n1: String, n2: String): Int {
    val rank = mapOf("param_shubha" to 4, "shubha" to 3, "mishra" to 2, "ashubha" to 1)
    val r1 = rank[n1] ?: 2
    val r2 = rank[n2] ?: 2
    return when {
        r1 == 4 && r2 == 4 -> 10
        r1 == r2 -> 8
        kotlin.math.abs(r1 - r2) == 1 -> 6
        kotlin.math.abs(r1 - r2) == 2 -> 4
        else -> 2
    }
}
