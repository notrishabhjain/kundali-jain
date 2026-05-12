package com.jainkundali.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.jainkundali.app.data.entities.AnushthaanEntity
import com.jainkundali.app.data.preferences.AppPreferences
import com.jainkundali.app.data.repository.ProfileRepository
import com.jainkundali.app.domain.data.getKarmaSadhana
import com.jainkundali.app.domain.engine.ProfileEngine
import com.jainkundali.app.domain.models.*
import com.jainkundali.app.ui.viewmodels.AnushthaanViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AnushthaanScreen(
    viewModel: AnushthaanViewModel,
    profileRepository: ProfileRepository,
    appPreferences: AppPreferences,
    onNavigateBack: () -> Unit
) {
    var userProfile by remember { mutableStateOf<UserProfile?>(null) }
    var sadhana by remember { mutableStateOf<KarmaSadhana?>(null) }
    var profileId by remember { mutableStateOf<Long?>(null) }
    var showNewDialog by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(true) }

    val activeAnushthaans by viewModel.activeAnushthaans.collectAsState()
    val completedAnushthaans by viewModel.completedAnushthaans.collectAsState()

    LaunchedEffect(Unit) {
        try {
            val selectedId = appPreferences.selectedProfileId.firstOrNull()
            if (selectedId != null && selectedId > 0L) {
                profileId = selectedId
                viewModel.setProfileId(selectedId)
                val entity = withContext(Dispatchers.IO) {
                    profileRepository.getById(selectedId)
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
                    val profile = withContext(Dispatchers.Default) {
                        ProfileEngine.generateUserProfile(formData)
                    }
                    userProfile = profile
                    sadhana = getKarmaSadhana(profile.dominantKarmaEn)
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
                title = { Text("अनुष्ठान") },
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
        },
        floatingActionButton = {
            if (userProfile != null) {
                FloatingActionButton(onClick = { showNewDialog = true }) {
                    Icon(Icons.Default.Add, contentDescription = "नया अनुष्ठान")
                }
            }
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
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp)
            ) {
                // Active Anushthaans
                Text(
                    text = "सक्रिय अनुष्ठान",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))

                if (activeAnushthaans.isEmpty()) {
                    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "कोई सक्रिय अनुष्ठान नहीं",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "नया अनुष्ठान शुरू करने के लिए + बटन दबाएं",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                            )
                        }
                    }
                } else {
                    activeAnushthaans.forEach { anushthaan ->
                        AnushthaanCard(
                            anushthaan = anushthaan,
                            onMarkCompleted = { viewModel.markDayCompleted(anushthaan) }
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Completed Anushthaans
                if (completedAnushthaans.isNotEmpty()) {
                    Text(
                        text = "पूर्ण अनुष्ठान",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    completedAnushthaans.forEach { anushthaan ->
                        CompletedAnushthaanCard(anushthaan)
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }
            }
        }
    }

    if (showNewDialog && sadhana != null && profileId != null) {
        NewAnushthaanDialog(
            sadhana = sadhana!!,
            onDismiss = { showNewDialog = false },
            onStartAnushthaan = { type, mantraText, mantraCount ->
                viewModel.startNewAnushthaan(profileId!!, type, mantraText, mantraCount)
                showNewDialog = false
            }
        )
    }
}

@Composable
private fun AnushthaanCard(
    anushthaan: AnushthaanEntity,
    onMarkCompleted: () -> Unit
) {
    val progress = if (anushthaan.totalDays > 0) {
        anushthaan.completedDays.toFloat() / anushthaan.totalDays.toFloat()
    } else 0f

    val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
    val alreadyCompletedToday = anushthaan.lastCompletedDate == todayStr

    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = anushthaan.mantraText,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        maxLines = 2
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "${anushthaan.type} | ${anushthaan.mantraCount} बार",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }
                if (!alreadyCompletedToday) {
                    FilledTonalButton(onClick = onMarkCompleted) {
                        Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("आज पूर्ण")
                    }
                } else {
                    Text(
                        text = "आज पूर्ण",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
            Spacer(modifier = Modifier.height(12.dp))

            @Suppress("DEPRECATION")
            LinearProgressIndicator(
                progress = progress,
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.primary,
                trackColor = MaterialTheme.colorScheme.surfaceVariant
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "${anushthaan.completedDays}/${anushthaan.totalDays} दिन पूर्ण",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )

            // Prayaschitta note if missed days
            val daysSinceStart = try {
                val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
                val start = sdf.parse(anushthaan.startDate)
                if (start != null) {
                    val diffMs = System.currentTimeMillis() - start.time
                    (diffMs / (1000 * 60 * 60 * 24)).toInt()
                } else 0
            } catch (e: Exception) { 0 }

            if (daysSinceStart > anushthaan.completedDays && daysSinceStart > 0) {
                val missed = daysSinceStart - anushthaan.completedDays
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "$missed दिन छूटे - प्रायश्चित्त: छूटे दिनों की संख्या जितने अतिरिक्त जाप करें",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.error
                )
            }
        }
    }
}

@Composable
private fun CompletedAnushthaanCard(anushthaan: AnushthaanEntity) {
    ElevatedCard(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.elevatedCardColors(
            containerColor = MaterialTheme.colorScheme.secondaryContainer
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = anushthaan.mantraText,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold,
                maxLines = 2,
                color = MaterialTheme.colorScheme.onSecondaryContainer
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "${anushthaan.type} | ${anushthaan.totalDays} दिन पूर्ण",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.7f)
            )
        }
    }
}

@Composable
private fun NewAnushthaanDialog(
    sadhana: KarmaSadhana,
    onDismiss: () -> Unit,
    onStartAnushthaan: (type: String, mantraText: String, mantraCount: Int) -> Unit
) {
    var selectedType by remember { mutableStateOf("40-day") }
    val types = listOf("40-day" to "40 दिन", "21-day" to "21 दिन", "9-day" to "9 दिन")
    val mantraText = sadhana.primaryMantra.text
    val mantraCount = sadhana.primaryMantra.count

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("नया अनुष्ठान आरंभ करें") },
        text = {
            Column {
                Text(
                    text = "मंत्र: $mantraText",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "प्रतिदिन ${mantraCount} बार जाप",
                    style = MaterialTheme.typography.bodySmall
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "अवधि चुनें:",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium
                )
                Spacer(modifier = Modifier.height(8.dp))
                types.forEach { (value, label) ->
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(vertical = 4.dp)
                    ) {
                        RadioButton(
                            selected = selectedType == value,
                            onClick = { selectedType = value }
                        )
                        Text(text = label, modifier = Modifier.padding(start = 8.dp))
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = { onStartAnushthaan(selectedType, mantraText, mantraCount) }) {
                Text("आरंभ करें")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("रद्द करें")
            }
        }
    )
}
