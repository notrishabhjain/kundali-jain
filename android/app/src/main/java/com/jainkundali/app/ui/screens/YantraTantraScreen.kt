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
import com.jainkundali.app.domain.engine.ProfileEngine
import com.jainkundali.app.domain.models.*
import com.jainkundali.app.ui.components.WithProfile
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.withContext

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun YantraTantraScreen(
    profileRepository: ProfileRepository,
    appPreferences: AppPreferences,
    onNavigateBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("यंत्र-तंत्र-मंत्र") },
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
            val karma = remember(profile) { getKarmaSadhana(profile.dominantKarmaEn) }

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp)
            ) {
                Text(
                    text = "${profile.name} - ${karma.karmaHindi} कर्म",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(16.dp))

                // Yantra Section
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "यंत्र",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        InfoRow("नाम", karma.yantra.name)
                        InfoRow("सामग्री", karma.yantra.material)
                        InfoRow("स्थापना", karma.yantra.installation)
                        InfoRow("आकार", karma.yantra.dimension)
                        InfoRow("प्रभाव", karma.yantra.effect)
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))

                // Primary Mantra Section
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "प्रमुख मंत्र",
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
                        Spacer(modifier = Modifier.height(8.dp))
                        InfoRow("जाप संख्या", "${karma.primaryMantra.count} बार")
                        InfoRow("समय", karma.primaryMantra.timing)
                        InfoRow("माला", karma.primaryMantra.maala)
                        InfoRow("कर्म प्रभाव", karma.primaryMantra.karmaEffect)
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))

                // Secondary Mantra Section
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "सहायक मंत्र/स्तोत्र",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        InfoRow("स्तोत्र", karma.secondaryMantra.stotraName)
                        Text(
                            text = karma.secondaryMantra.shloka,
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.padding(vertical = 4.dp)
                        )
                        InfoRow("जाप संख्या", "${karma.secondaryMantra.count} बार")
                        InfoRow("समय", karma.secondaryMantra.timing)
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))

                // Puja Section
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "पूजा विधान",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        InfoRow("पूजा", karma.puja.name)
                        InfoRow("तीर्थंकर", karma.puja.tirthankara)
                        InfoRow("विधि", karma.puja.vidhi)
                        InfoRow("लाभ", karma.puja.benefit)
                        InfoRow("तिथि", karma.puja.tithi)
                        InfoRow("स्तोत्र", karma.puja.stotra)
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
    Column(modifier = Modifier.padding(vertical = 4.dp)) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium
        )
    }
}
