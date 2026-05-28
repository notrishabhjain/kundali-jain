package com.jainkundali.app.ui.screens

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.jainkundali.app.data.entities.ProfileEntity
import com.jainkundali.app.domain.models.City
import com.jainkundali.app.ui.components.JainLoadingSpinner
import com.jainkundali.app.ui.viewmodels.KundaliViewModel
import java.util.Calendar

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KundaliFormScreen(
    viewModel: KundaliViewModel,
    onNavigateBack: () -> Unit,
    onNavigateToResult: () -> Unit
) {
    val fullName by viewModel.fullName.collectAsState()
    val dob by viewModel.dob.collectAsState()
    val time by viewModel.time.collectAsState()
    val place by viewModel.place.collectAsState()
    val gender by viewModel.gender.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val citySearchResults by viewModel.citySearchResults.collectAsState()
    val selectedCity by viewModel.selectedCity.collectAsState()
    val savedProfiles by viewModel.savedProfiles.collectAsState()

    val context = LocalContext.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("कुंडली बनाएं") },
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
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Saved profiles section
            if (savedProfiles.isNotEmpty()) {
                Text(
                    text = "सेव किए गए प्रोफ़ाइल",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                ElevatedCard(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column {
                        savedProfiles.forEach { profile ->
                            Surface(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { viewModel.fillFromProfile(profile) }
                            ) {
                                Row(
                                    modifier = Modifier.padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = profile.name,
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontWeight = FontWeight.Medium
                                    )
                                    Spacer(modifier = Modifier.weight(1f))
                                    Text(
                                        text = profile.birthPlace,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                    )
                                }
                            }
                            @Suppress("DEPRECATION")
                            Divider()
                        }
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
            }

            Text(
                text = "जन्म विवरण भरें",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )

            // Name field
            OutlinedTextField(
                value = fullName,
                onValueChange = { viewModel.updateFullName(it) },
                label = { Text("पूरा नाम") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            // Date of Birth
            OutlinedTextField(
                value = dob,
                onValueChange = {},
                label = { Text("जन्म तिथि") },
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable {
                        val cal = Calendar.getInstance()
                        DatePickerDialog(
                            context,
                            { _, year, month, day ->
                                val dateStr = "$year-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}"
                                viewModel.updateDob(dateStr)
                            },
                            cal.get(Calendar.YEAR) - 30,
                            cal.get(Calendar.MONTH),
                            cal.get(Calendar.DAY_OF_MONTH)
                        ).show()
                    },
                readOnly = true,
                enabled = false,
                colors = OutlinedTextFieldDefaults.colors(
                    disabledTextColor = MaterialTheme.colorScheme.onSurface,
                    disabledBorderColor = MaterialTheme.colorScheme.outline,
                    disabledLabelColor = MaterialTheme.colorScheme.onSurfaceVariant
                )
            )

            // Time of Birth
            OutlinedTextField(
                value = time,
                onValueChange = {},
                label = { Text("जन्म समय") },
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable {
                        TimePickerDialog(
                            context,
                            { _, hour, minute ->
                                val timeStr = "${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}"
                                viewModel.updateTime(timeStr)
                            },
                            12, 0, true
                        ).show()
                    },
                readOnly = true,
                enabled = false,
                colors = OutlinedTextFieldDefaults.colors(
                    disabledTextColor = MaterialTheme.colorScheme.onSurface,
                    disabledBorderColor = MaterialTheme.colorScheme.outline,
                    disabledLabelColor = MaterialTheme.colorScheme.onSurfaceVariant
                )
            )

            // City search
            Column {
                OutlinedTextField(
                    value = place,
                    onValueChange = { viewModel.updatePlace(it) },
                    label = { Text("जन्म स्थान") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )

                if (citySearchResults.isNotEmpty()) {
                    ElevatedCard(
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column {
                            citySearchResults.forEach { city ->
                                CityItem(city = city) {
                                    viewModel.selectCity(city)
                                }
                            }
                        }
                    }
                }
            }

            // Gender selector
            Text(
                text = "लिंग",
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium
            )
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    RadioButton(
                        selected = gender == "पुरुष",
                        onClick = { viewModel.updateGender("पुरुष") }
                    )
                    Text("पुरुष")
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    RadioButton(
                        selected = gender == "स्त्री",
                        onClick = { viewModel.updateGender("स्त्री") }
                    )
                    Text("स्त्री")
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Submit button
            Button(
                onClick = {
                    // generateKundali() persists the profile atomically itself — do not also
                    // call saveProfile() here, that double-save was creating duplicate rows.
                    viewModel.generateKundali()
                    onNavigateToResult()
                },
                modifier = Modifier.fillMaxWidth(),
                enabled = fullName.isNotBlank() && dob.isNotBlank() && selectedCity != null && !isLoading
            ) {
                if (isLoading) {
                    JainLoadingSpinner(
                        size = 20.dp,
                        strokeWidth = 2.dp,
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                }
                Text("कुंडली बनाएं", style = MaterialTheme.typography.titleMedium)
            }
        }
    }
}

@Composable
private fun CityItem(city: City, onClick: () -> Unit) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "${city.hindiName} (${city.name})",
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.weight(1f))
            Text(
                text = city.state,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )
        }
    }
}
