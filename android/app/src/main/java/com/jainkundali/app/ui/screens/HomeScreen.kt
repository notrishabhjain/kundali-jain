package com.jainkundali.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.jainkundali.app.domain.engine.CalendarEngine
import com.jainkundali.app.domain.models.JainPanchang
import com.jainkundali.app.ui.theme.NeoPopCard
import java.util.Calendar
import java.util.Date

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigateToKundaliForm: () -> Unit,
    onNavigateToJaap: () -> Unit,
    onNavigateToMeditation: () -> Unit,
    onNavigateToMantras: () -> Unit,
    onNavigateToProfiles: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onNavigateToKarmaMilan: () -> Unit
) {
    val panchang = remember {
        try {
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
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("जैन कुंडली", fontWeight = FontWeight.Bold) },
                actions = {
                    IconButton(onClick = onNavigateToSettings) {
                        Icon(Icons.Default.Settings, contentDescription = "सेटिंग्स")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    actionIconContentColor = MaterialTheme.colorScheme.onPrimary
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
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Greeting
            Text(
                text = "जय जिनेंद्र",
                style = MaterialTheme.typography.headlineLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "दिगम्बर जैन ज्योतिष कुंडली",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Panchang Card
            PanchangCard(panchang)

            Spacer(modifier = Modifier.height(20.dp))

            // Quick Actions
            Text(
                text = "साधना मार्ग",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                QuickActionCard(
                    title = "कुंडली बनाएं",
                    emoji = "\uD83D\uDD2E",
                    onClick = onNavigateToKundaliForm,
                    modifier = Modifier.weight(1f)
                )
                QuickActionCard(
                    title = "जाप",
                    emoji = "\uD83D\uDCFF",
                    onClick = onNavigateToJaap,
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                QuickActionCard(
                    title = "ध्यान",
                    emoji = "\uD83E\uDDD8",
                    onClick = onNavigateToMeditation,
                    modifier = Modifier.weight(1f)
                )
                QuickActionCard(
                    title = "मंत्र",
                    emoji = "\uD83D\uDCDC",
                    onClick = onNavigateToMantras,
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                QuickActionCard(
                    title = "प्रोफ़ाइल",
                    emoji = "\uD83D\uDC64",
                    onClick = onNavigateToProfiles,
                    modifier = Modifier.weight(1f)
                )
                QuickActionCard(
                    title = "कर्म मिलान",
                    emoji = "\uD83E\uDD1D",
                    onClick = onNavigateToKarmaMilan,
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

@Composable
private fun PanchangCard(panchang: JainPanchang) {
    NeoPopCard(
        modifier = Modifier.fillMaxWidth(),
        backgroundColor = MaterialTheme.colorScheme.primaryContainer
    ) {
        Text(
            text = "आज का पंचांग",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onPrimaryContainer
        )
        Spacer(modifier = Modifier.height(12.dp))

        PanchangRow("तिथि", panchang.tithi)
        PanchangRow("वार", panchang.vara)
        PanchangRow("नक्षत्र", panchang.nakshatra)
        PanchangRow("पक्ष", panchang.paksha)
        PanchangRow("मास", panchang.masa)

        panchang.jainFestival?.let { festival ->
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = festival,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Composable
private fun PanchangRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f)
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onPrimaryContainer
        )
    }
}

@Composable
private fun QuickActionCard(
    title: String,
    emoji: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    NeoPopCard(modifier = modifier, onClick = onClick) {
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = emoji,
                fontSize = 32.sp,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                textAlign = TextAlign.Center
            )
        }
    }
}
