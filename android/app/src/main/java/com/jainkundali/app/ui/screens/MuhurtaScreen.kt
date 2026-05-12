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
import com.jainkundali.app.domain.engine.MuhurtaEngine
import com.jainkundali.app.domain.engine.PersonalizedMuhurta
import com.jainkundali.app.domain.engine.ProfileEngine
import com.jainkundali.app.domain.models.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MuhurtaScreen(
    profileRepository: ProfileRepository,
    appPreferences: AppPreferences,
    onNavigateBack: () -> Unit
) {
    var userProfile by remember { mutableStateOf<UserProfile?>(null) }
    var muhurtas by remember { mutableStateOf<List<PersonalizedMuhurta>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        try {
            val profileId = appPreferences.selectedProfileId.firstOrNull()
            if (profileId != null && profileId > 0L) {
                val entity = withContext(Dispatchers.IO) {
                    profileRepository.getById(profileId)
                }
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
                    val computedProfile = withContext(Dispatchers.Default) {
                        ProfileEngine.generateUserProfile(formData)
                    }
                    val computedMuhurtas = withContext(Dispatchers.Default) {
                        MuhurtaEngine.getPersonalizedMuhurtas(computedProfile.dominantKarmaEn)
                    }
                    userProfile = computedProfile
                    muhurtas = computedMuhurtas
                }
            }
        } catch (_: Exception) {
            // Silently handle - will show "no profile" state
        } finally {
            isLoading = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("शुभ मुहूर्त") },
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
                    text = "कृपया पहले एक प्रोफ़ाइल चुनें",
                    style = MaterialTheme.typography.bodyLarge
                )
            }
        } else {
            val profile = userProfile!!
            val grouped = muhurtas.groupBy { it.activity }

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp)
            ) {
                Text(
                    text = "${profile.name} के शुभ मुहूर्त",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "कर्म: ${profile.dominantKarma}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
                Spacer(modifier = Modifier.height(16.dp))

                // Next Muhurta Countdown
                if (muhurtas.isNotEmpty()) {
                    val next = muhurtas.first()
                    val daysUntil = TimeUnit.MILLISECONDS.toDays(next.date - System.currentTimeMillis())
                    ElevatedCard(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.elevatedCardColors(
                            containerColor = MaterialTheme.colorScheme.tertiaryContainer
                        )
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "अगला शुभ मुहूर्त",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onTertiaryContainer
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "${next.tithiName} - ${next.activity}",
                                style = MaterialTheme.typography.bodyLarge,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onTertiaryContainer
                            )
                            Text(
                                text = "${formatDate(next.dateString)} (${daysUntil} दिन शेष)",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onTertiaryContainer.copy(alpha = 0.7f)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                }

                // Grouped by Activity
                val activityOrder = listOf("यंत्र स्थापना", "साधना आरंभ", "पूजा", "व्रत")
                for (activity in activityOrder) {
                    val items = grouped[activity] ?: continue
                    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = activity,
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            items.take(5).forEach { muhurta ->
                                val daysUntil = TimeUnit.MILLISECONDS.toDays(muhurta.date - System.currentTimeMillis())
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Column {
                                        Text(
                                            text = muhurta.tithiName,
                                            style = MaterialTheme.typography.bodyMedium,
                                            fontWeight = FontWeight.Medium
                                        )
                                        Text(
                                            text = formatDate(muhurta.dateString),
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                        )
                                    }
                                    Text(
                                        text = "${daysUntil} दिन",
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                }
                                if (items.indexOf(muhurta) < items.take(5).size - 1) {
                                    Divider(modifier = Modifier.padding(vertical = 2.dp))
                                }
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                }
            }
        }
    }
}

private fun formatDate(dateString: String): String {
    return try {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val outputFormat = SimpleDateFormat("dd MMM yyyy", Locale.getDefault())
        val date = inputFormat.parse(dateString)
        if (date != null) outputFormat.format(date) else dateString
    } catch (e: Exception) {
        dateString
    }
}
