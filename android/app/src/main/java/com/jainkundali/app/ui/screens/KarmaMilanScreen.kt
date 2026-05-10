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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KarmaMilanScreen(
    profileRepository: ProfileRepository,
    onNavigateBack: () -> Unit
) {
    val profiles by profileRepository.allProfiles.collectAsState(initial = emptyList())
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

    // Karma affinity (same or complementary): +25
    val sameKarma = profile1.dominantKarmaEn == profile2.dominantKarmaEn
    val complementary = if (karma1 != null && karma2 != null) {
        karma1.isGhatiya != karma2.isGhatiya
    } else false

    if (sameKarma) {
        score += 25
        val sadhana = getKarmaSadhana(profile1.dominantKarmaEn)
        sharedSadhana.add("${sadhana.karmaHindi} कर्म की साझा साधना: ${sadhana.samanyaUpaya}")
    } else if (complementary) {
        score += 25
        if (karma1 != null && karma2 != null) {
            sharedSadhana.add("पूरक कर्म संयोग: ${karma1.karmaHindi} (${if (karma1.isGhatiya) "घातिया" else "अघातिया"}) + ${karma2.karmaHindi} (${if (karma2.isGhatiya) "घातिया" else "अघातिया"})")
        }
    }
    details.add(
        MilanDetail(
            label = "कर्म सामंजस्य",
            value = if (sameKarma) "+25 (समान)" else if (complementary) "+25 (पूरक)" else "भिन्न कर्म",
            matched = sameKarma || complementary
        )
    )

    // Same mahadasha lord: +25
    val sameDasha = profile1.currentDasha.lord == profile2.currentDasha.lord
    if (sameDasha) {
        score += 25
    }
    details.add(
        MilanDetail(
            label = "दशा तुल्यता",
            value = if (sameDasha) "+25" else "भिन्न दशा",
            matched = sameDasha
        )
    )

    // Same nakshatra nature: +25
    val sameNature = profile1.nakshatraNature == profile2.nakshatraNature
    if (sameNature) {
        score += 25
    }
    details.add(
        MilanDetail(
            label = "नक्षत्र अनुकूलता",
            value = if (sameNature) "+25" else "भिन्न प्रकृति",
            matched = sameNature
        )
    )

    // Shared shubha tithi: +25
    val sharedTithi = if (karma1 != null && karma2 != null) {
        karma1.shubhaTithi.intersect(karma2.shubhaTithi.toSet()).isNotEmpty()
    } else false
    if (sharedTithi) {
        score += 25
        if (karma1 != null && karma2 != null) {
            val common = karma1.shubhaTithi.intersect(karma2.shubhaTithi.toSet())
            sharedSadhana.add("साझा शुभ तिथि: ${common.joinToString(", ")}")
        }
    }
    details.add(
        MilanDetail(
            label = "शुभ तिथि मेल",
            value = if (sharedTithi) "+25" else "भिन्न तिथि",
            matched = sharedTithi
        )
    )

    // Shared sadhana from different karmas
    if (!sameKarma && karma1 != null && karma2 != null) {
        sharedSadhana.add("प्रथम व्यक्ति: ${karma1.karmaHindi} - ${karma1.pratahNiyam}")
        sharedSadhana.add("द्वितीय व्यक्ति: ${karma2.karmaHindi} - ${karma2.pratahNiyam}")
    }

    val overallMessage = when {
        score >= 75 -> "उत्तम अनुकूलता - साझा साधना से दोनों को लाभ"
        score >= 50 -> "मध्यम अनुकूलता - परस्पर सहयोग से उन्नति संभव"
        score >= 25 -> "सामान्य अनुकूलता - व्यक्तिगत साधना पर ध्यान दें"
        else -> "न्यून अनुकूलता - स्वतंत्र साधना मार्ग उचित"
    }

    return MilanResult(
        score = score,
        overallMessage = overallMessage,
        details = details,
        sharedSadhana = sharedSadhana
    )
}
