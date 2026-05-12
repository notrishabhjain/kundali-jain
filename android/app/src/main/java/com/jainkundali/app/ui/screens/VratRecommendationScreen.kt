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
import com.jainkundali.app.domain.engine.ProfileEngine
import com.jainkundali.app.domain.models.*
import com.jainkundali.app.ui.components.WithProfile
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.withContext

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VratRecommendationScreen(
    profileRepository: ProfileRepository,
    appPreferences: AppPreferences,
    onNavigateBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("व्रत मार्गदर्शन") },
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
                        text = "कृपया पहले प्रोफ़ाइल बनाएं",
                        style = MaterialTheme.typography.bodyLarge
                    )
                }
            }
        ) { loadResult ->
            val profile = loadResult.profile
            val karmaSadhana = remember(profile) { getKarmaSadhana(profile.dominantKarmaEn) }
            val dashaSadhana = remember(profile) { getDashaSadhana(profile.currentDasha.lord) }
            val dashaKarmaSadhana = remember(profile) {
                if (profile.currentDasha.lord != profile.dominantKarmaEn) {
                    getKarmaSadhana(profile.currentDasha.lord)
                } else null
            }

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp)
            ) {
                Text(
                    text = "${profile.name} - व्रत अनुशंसा",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "प्रमुख कर्म: ${karmaSadhana.karmaHindi} | दशा: ${profile.currentDasha.lordHindi}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
                Spacer(modifier = Modifier.height(16.dp))

                // Progression Path
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "व्रत प्रगति मार्ग",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "एकासन → बेला → आयंबिल → उपवास → अट्ठम",
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "धीरे-धीरे तप बढ़ाएं। पहले एकासन (एक बार भोजन) से आरंभ करें, फिर क्रमशः बेला (दो उपवास), आयंबिल (बिना नमक), उपवास (अन्न त्याग), और अट्ठम (3 दिन उपवास) की ओर बढ़ें।",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))

                // Primary Vrat - from dominant karma
                VratCard(
                    index = 1,
                    label = "प्राथमिक व्रत (प्रमुख कर्म आधारित)",
                    tapasya = karmaSadhana.tapasya,
                    karmaEffect = "आपके प्रमुख ${karmaSadhana.karmaHindi} कर्म की निर्जरा (क्षय) के लिए यह सर्वाधिक प्रभावी व्रत है। ${karmaSadhana.statusWhenDominant}",
                    shubhaTithi = karmaSadhana.shubhaTithi
                )
                Spacer(modifier = Modifier.height(16.dp))

                // Secondary Vrat - from dasha lord karma (if different)
                if (dashaKarmaSadhana != null) {
                    VratCard(
                        index = 2,
                        label = "द्वितीयक व्रत (दशा आधारित)",
                        tapasya = dashaKarmaSadhana.tapasya,
                        karmaEffect = "वर्तमान ${profile.currentDasha.lordHindi} दशा में ${dashaKarmaSadhana.karmaHindi} कर्म का उदय प्रबल है। ${dashaSadhana.dashaEffect}",
                        shubhaTithi = dashaKarmaSadhana.shubhaTithi
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                }

                // Dasha-specific best tithi
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "दशा-विशेष श्रेष्ठ तिथि",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "${profile.currentDasha.lordHindi} दशा की श्रेष्ठ तिथि:",
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = dashaSadhana.bestTithi,
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(vertical = 4.dp)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "दशा साधना: ${dashaSadhana.dashaSadhana}",
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
private fun VratCard(
    index: Int,
    label: String,
    tapasya: Tapasya,
    karmaEffect: String,
    shubhaTithi: List<Int>
) {
    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "$index. $label",
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = tapasya.name,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = tapasya.description,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(vertical = 4.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "यह व्रत क्यों लाभकारी है:",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )
            Text(
                text = karmaEffect,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(vertical = 4.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "अनुशंसित तिथि: ${tapasya.tithi}",
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "शुभ तिथि संख्या: ${shubhaTithi.joinToString(", ")}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )
            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "अनुष्ठान विधि:",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )
            Text(
                text = tapasya.anusthana,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(vertical = 4.dp)
            )
        }
    }
}
