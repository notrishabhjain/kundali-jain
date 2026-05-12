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
import com.jainkundali.app.domain.data.getKarmaSadhana
import com.jainkundali.app.domain.engine.AstronomyUtils
import com.jainkundali.app.domain.engine.CalendarEngine
import com.jainkundali.app.domain.engine.ProfileEngine
import com.jainkundali.app.domain.models.*
import com.jainkundali.app.ui.components.WithProfile
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.withContext
import java.util.Calendar
import java.util.Date
import kotlin.math.floor

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DailyPrescriptionScreen(
    profileRepository: ProfileRepository,
    appPreferences: AppPreferences,
    onNavigateBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("आज का विधान") },
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
        WithProfile(
            profileRepository = profileRepository,
            appPreferences = appPreferences,
            loadingContent = {
                Box(
                    modifier = Modifier.fillMaxSize().padding(padding),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            },
            noProfileContent = {
                Box(
                    modifier = Modifier.fillMaxSize().padding(padding),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "कृपया पहले एक प्रोफ़ाइल चुनें",
                        style = MaterialTheme.typography.bodyLarge
                    )
                }
            }
        ) { loadResult ->
            val profile = loadResult.profile

            var sadhana by remember { mutableStateOf<KarmaSadhana?>(null) }
            var isPowerDay by remember { mutableStateOf(false) }
            var todayTithiRaw by remember { mutableStateOf(0) }
            var panchang by remember { mutableStateOf<JainPanchang?>(null) }
            var isComputing by remember { mutableStateOf(true) }

            LaunchedEffect(profile) {
                try {
                    panchang = try {
                        CalendarEngine.getJainPanchang(Date())
                    } catch (_: Exception) {
                        val varas = listOf("रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार")
                        JainPanchang(
                            tithi = "शुक्ल प्रतिपदा",
                            vara = varas[Calendar.getInstance().get(Calendar.DAY_OF_WEEK) - 1],
                            nakshatra = "अश्विनी",
                            paksha = "शुक्ल",
                            masa = "चैत्र",
                            jainFestival = null
                        )
                    }

                    val now = Calendar.getInstance()
                    val dateStr = "${now.get(Calendar.YEAR)}-${(now.get(Calendar.MONTH) + 1).toString().padStart(2, '0')}-${now.get(Calendar.DAY_OF_MONTH).toString().padStart(2, '0')}"
                    val jde = AstronomyUtils.toJulianDay(dateStr, "06:00")
                    val sunLong = AstronomyUtils.getSunLongitude(jde)
                    val moonLong = AstronomyUtils.getMoonTropicalLongitude(jde)
                    val elongation = AstronomyUtils.normDeg(moonLong - sunLong)
                    todayTithiRaw = floor(elongation / 12.0).toInt()

                    val karmaSadhana = getKarmaSadhana(profile.dominantKarmaEn)
                    sadhana = karmaSadhana
                    isPowerDay = todayTithiRaw in karmaSadhana.shubhaTithi
                } catch (_: Exception) {
                    // Keep defaults
                } finally {
                    isComputing = false
                }
            }

            if (isComputing) {
                Box(
                    modifier = Modifier.fillMaxSize().padding(padding),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            } else if (sadhana == null || panchang == null) {
                Box(
                    modifier = Modifier.fillMaxSize().padding(padding),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "कृपया पहले एक प्रोफ़ाइल चुनें",
                        style = MaterialTheme.typography.bodyLarge
                    )
                }
            } else {
                val karma = sadhana!!
                val panchangData = panchang!!

                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .verticalScroll(rememberScrollState())
                        .padding(16.dp)
                ) {
                    // Today's Panchang Card
                    ElevatedCard(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.elevatedCardColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer
                        )
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "आज का पंचांग",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            PrescriptionRow("तिथि", panchangData.tithi)
                            PrescriptionRow("वार", panchangData.vara)
                            PrescriptionRow("नक्षत्र", panchangData.nakshatra)
                            PrescriptionRow("मास", panchangData.masa)
                            panchangData.jainFestival?.let {
                                PrescriptionRow("पर्व", it)
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))

                    // Power Day Indicator
                    if (isPowerDay) {
                        ElevatedCard(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.elevatedCardColors(
                                containerColor = MaterialTheme.colorScheme.tertiaryContainer
                            )
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    text = "शुभ शक्ति दिवस",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onTertiaryContainer
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "आज की तिथि आपके ${karma.karmaHindi} कर्म के लिए विशेष शुभ है। आज की साधना का फल कई गुना होगा।",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onTertiaryContainer
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                    }

                    // User Profile Summary
                    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "आपकी कर्म स्थिति",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            PrescriptionRow("प्रमुख कर्म", karma.karmaHindi)
                            PrescriptionRow("वर्तमान दशा", profile.currentDasha.lordHindi)
                            PrescriptionRow("नक्षत्र", profile.birthNakshatraHindi)
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))

                    // Morning Prescription
                    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "प्रातः नियम",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = karma.pratahNiyam,
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))

                    // Evening Prescription
                    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "सायं नियम",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = karma.saayamNiyam,
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))

                    // Today's Mantra
                    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "आज का मंत्र",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = karma.primaryMantra.text,
                                style = MaterialTheme.typography.bodyLarge,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "${karma.primaryMantra.count} बार, ${karma.primaryMantra.timing}",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))

                    // Recommended Tirthankara
                    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "आज के तीर्थंकर",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = karma.puja.tirthankara,
                                style = MaterialTheme.typography.bodyLarge,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = karma.puja.benefit,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                }
            }
        }
    }
}

@Composable
private fun PrescriptionRow(label: String, value: String) {
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
