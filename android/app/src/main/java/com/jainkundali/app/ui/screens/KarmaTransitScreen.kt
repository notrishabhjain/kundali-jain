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
import com.jainkundali.app.data.preferences.AppPreferences
import com.jainkundali.app.data.repository.ProfileRepository
import com.jainkundali.app.domain.data.getDashaSadhana
import com.jainkundali.app.domain.data.getKarmaSadhana
import com.jainkundali.app.domain.engine.MuhurtaEngine
import com.jainkundali.app.domain.engine.PersonalizedMuhurta
import com.jainkundali.app.domain.engine.ProfileEngine
import com.jainkundali.app.domain.models.*
import kotlinx.coroutines.flow.firstOrNull

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KarmaTransitScreen(
    profileRepository: ProfileRepository,
    appPreferences: AppPreferences,
    onNavigateBack: () -> Unit
) {
    var userProfile by remember { mutableStateOf<UserProfile?>(null) }
    var upcomingMuhurtas by remember { mutableStateOf<List<PersonalizedMuhurta>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        val profileId = appPreferences.selectedProfileId.firstOrNull()
        if (profileId != null) {
            val entity = profileRepository.getById(profileId)
            if (entity != null) {
                val formData = BirthFormData(
                    fullName = entity.name,
                    dob = entity.dateOfBirth,
                    time = entity.birthTime,
                    place = entity.birthPlace,
                    lat = entity.latitude.toString(),
                    lng = entity.longitude.toString(),
                    gender = entity.gender
                )
                val profile = ProfileEngine.generateUserProfile(formData)
                userProfile = profile
                upcomingMuhurtas = MuhurtaEngine.getPersonalizedMuhurtas(
                    profile.dominantKarmaEn, 90
                ).take(10)
            }
        }
        isLoading = false
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("कर्म संक्रमण") },
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
        if (isLoading) {
            Box(
                modifier = Modifier.fillMaxSize().padding(padding),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else if (userProfile == null) {
            Box(
                modifier = Modifier.fillMaxSize().padding(padding),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "कृपया पहले प्रोफ़ाइल बनाएं",
                    style = MaterialTheme.typography.bodyLarge
                )
            }
        } else {
            val profile = userProfile!!
            val dasha = profile.currentDasha

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp)
            ) {
                Text(
                    text = "${profile.name} - दशा संक्रमण विश्लेषण",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(16.dp))

                // Current Dasha Status
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "वर्तमान दशा स्थिति",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        TransitInfoRow("महादशा", "${dasha.lordHindi} (${dasha.yearsTotal} वर्ष)")
                        TransitInfoRow("महादशा समाप्ति", dasha.endDate)
                        TransitInfoRow("शेष", "${dasha.yearsRemaining} वर्ष")
                        Spacer(modifier = Modifier.height(8.dp))
                        Divider()
                        Spacer(modifier = Modifier.height(8.dp))
                        TransitInfoRow("अंतर्दशा", dasha.antardashaInfo.lordHindi)
                        TransitInfoRow("अंतर्दशा समाप्ति", dasha.antardashaInfo.endDate)
                        TransitInfoRow("शेष", "${dasha.antardashaInfo.yearsRemaining} वर्ष")
                        Spacer(modifier = Modifier.height(8.dp))
                        Divider()
                        Spacer(modifier = Modifier.height(8.dp))
                        TransitInfoRow("प्रत्यंतर्दशा", dasha.pratyantardasha.lordHindi)
                        TransitInfoRow("प्रत्यंतर्दशा समाप्ति", dasha.pratyantardasha.endDate)
                        TransitInfoRow("शेष", "${dasha.pratyantardasha.daysRemaining} दिन")
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))

                // Upcoming Transitions
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "आगामी दशा परिवर्तन",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "प्रत्यंतर्दशा परिवर्तन",
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = "${dasha.pratyantardasha.lordHindi} प्रत्यंतर्दशा ${dasha.pratyantardasha.daysRemaining} दिन में समाप्त होगी (${dasha.pratyantardasha.endDate})",
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.padding(vertical = 4.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "अंतर्दशा परिवर्तन",
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = "${dasha.antardashaInfo.lordHindi} अंतर्दशा ${dasha.antardashaInfo.yearsRemaining} वर्ष में समाप्त होगी (${dasha.antardashaInfo.endDate})",
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.padding(vertical = 4.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))

                // Power Days
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "कर्म शक्ति दिवस",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        val karmaSadhana = getKarmaSadhana(profile.dominantKarmaEn)
                        Text(
                            text = "आपकी शुभ तिथियाँ: ${karmaSadhana.shubhaTithi.joinToString(", ")}",
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.padding(vertical = 4.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        if (upcomingMuhurtas.isEmpty()) {
                            Text(
                                text = "कोई आगामी शक्ति दिवस नहीं मिला",
                                style = MaterialTheme.typography.bodyMedium
                            )
                        } else {
                            upcomingMuhurtas.forEachIndexed { index, muhurta ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "${index + 1}. ${muhurta.dateString}",
                                        style = MaterialTheme.typography.bodyMedium
                                    )
                                    Text(
                                        text = muhurta.tithiName,
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontWeight = FontWeight.Medium,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                }
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))

                // Preparation Sadhana
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "परिवर्तन की तैयारी",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        val nextAntarLord = dasha.antardashaInfo.lord
                        val dashaSadhana = getDashaSadhana(nextAntarLord)
                        Text(
                            text = "आगामी अंतर्दशा: ${dashaSadhana.lordHindi}",
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = dashaSadhana.natureDescription,
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.padding(vertical = 4.dp)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "साधना:",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                        Text(
                            text = dashaSadhana.dashaSadhana,
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.padding(vertical = 4.dp)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "श्रेष्ठ तिथि:",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                        Text(
                            text = dashaSadhana.bestTithi,
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Composable
private fun TransitInfoRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Medium
        )
    }
}
