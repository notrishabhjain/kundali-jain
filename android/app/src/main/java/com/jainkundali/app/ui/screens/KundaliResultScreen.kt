package com.jainkundali.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.jainkundali.app.domain.models.*
import com.jainkundali.app.ui.components.KarmaAshtadal
import com.jainkundali.app.ui.components.PdfGenerator
import com.jainkundali.app.ui.viewmodels.KundaliViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KundaliResultScreen(
    viewModel: KundaliViewModel,
    onNavigateBack: () -> Unit
) {
    val userProfile by viewModel.userProfile.collectAsState()
    val karmaProfile by viewModel.karmaProfile.collectAsState()
    val predictions by viewModel.predictions.collectAsState()
    val remedies by viewModel.remedies.collectAsState()
    val todaysMessage by viewModel.todaysMessage.collectAsState()
    val context = LocalContext.current

    var selectedTab by remember { mutableIntStateOf(0) }
    val tabs = listOf("वर्तमान", "जन्म कुंडली", "कर्म प्रोफ़ाइल", "भविष्य", "उपाय", "दशा")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("कुंडली फल") },
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
            userProfile?.let { profile ->
                FloatingActionButton(
                    onClick = {
                        val file = PdfGenerator.generateKundaliPdf(
                            context, profile, karmaProfile, predictions, remedies
                        )
                        if (file != null) {
                            PdfGenerator.sharePdf(context, file)
                        }
                    }
                ) {
                    Icon(Icons.Default.Share, contentDescription = "PDF शेयर करें")
                }
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            ScrollableTabRow(
                selectedTabIndex = selectedTab,
                edgePadding = 8.dp
            ) {
                tabs.forEachIndexed { index, title ->
                    Tab(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        text = { Text(title) }
                    )
                }
            }

            userProfile?.let { profile ->
                when (selectedTab) {
                    0 -> VartamanTab(todaysMessage, profile)
                    1 -> BirthChartTab(profile)
                    2 -> KarmaProfileTab(karmaProfile)
                    3 -> PredictionsTab(predictions)
                    4 -> RemediesTab(remedies)
                    5 -> DashaTab(profile.currentDasha)
                }
            } ?: Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text("कुंडली उपलब्ध नहीं है। कृपया पहले कुंडली बनाएं।")
            }
        }
    }
}

@Composable
private fun VartamanTab(message: String, profile: UserProfile) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "आज का संदेश",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = message,
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "वर्तमान दशा",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text("महादशा: ${profile.currentDasha.lordHindi}")
                Text("अंतर्दशा: ${profile.currentDasha.antardashaHindi}")
                Text("शेष वर्ष: ${String.format("%.1f", profile.currentDasha.yearsRemaining)}")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
        KarmaAshtadal(profile = profile)
    }
}

@Composable
private fun BirthChartTab(profile: UserProfile) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "जन्म कुंडली विवरण",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(12.dp))

                InfoRow("नाम", profile.name)
                InfoRow("नक्षत्र", profile.birthNakshatraHindi)
                InfoRow("पाद", profile.nakshatraPada.toString())
                InfoRow("प्रकृति", profile.nakshatraNatureHindi)
                InfoRow("कर्म प्रकार", profile.dominantKarma)
                InfoRow("राशि", profile.birthRashi)
                InfoRow("चन्द्र अंश", "${profile.moonLongitude}")
                InfoRow("तीर्थंकर संबंध", profile.tirthankarAffinityHindi)
                InfoRow("गुणस्थान", profile.gunasthana.toString())
            }
        }
    }
}

@Composable
private fun KarmaProfileTab(karmaProfile: List<KarmaState>) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            text = "अष्ट कर्म प्रोफ़ाइल",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(12.dp))

        karmaProfile.forEach { karma ->
            KarmaCard(karma)
            Spacer(modifier = Modifier.height(8.dp))
        }
    }
}

@Composable
private fun KarmaCard(karma: KarmaState) {
    val stateLabel = when (karma.state) {
        "Udaya" -> "उदय"
        "Satta" -> "सत्ता"
        "Nirjara" -> "निर्जरा"
        else -> karma.state
    }

    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = karma.karmaHindi,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold
                )
                AssistChip(
                    onClick = {},
                    label = { Text(stateLabel, style = MaterialTheme.typography.labelSmall) }
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            @Suppress("DEPRECATION")
            LinearProgressIndicator(
                progress = karma.intensity / 100f,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(8.dp),
                color = when {
                    karma.intensity >= 70 -> MaterialTheme.colorScheme.error
                    karma.intensity >= 40 -> MaterialTheme.colorScheme.primary
                    else -> MaterialTheme.colorScheme.tertiary
                }
            )

            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "तीव्रता: ${karma.intensity}%",
                style = MaterialTheme.typography.labelSmall
            )

            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = karma.manifestation,
                style = MaterialTheme.typography.bodySmall
            )
        }
    }
}

@Composable
private fun PredictionsTab(predictions: List<LifeDomainPrediction>) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            text = "जीवन क्षेत्र भविष्यफल",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(12.dp))

        predictions.forEach { prediction ->
            PredictionCard(prediction)
            Spacer(modifier = Modifier.height(8.dp))
        }
    }
}

@Composable
private fun PredictionCard(prediction: LifeDomainPrediction) {
    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = if (prediction.isFavorable) "\u2705" else "\u26A0\uFE0F",
                )
                Text(
                    text = prediction.hindiDomain,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = prediction.prediction,
                style = MaterialTheme.typography.bodySmall
            )
        }
    }
}

@Composable
private fun RemediesTab(remedies: CombinedRemedy?) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        if (remedies == null) {
            Text("उपाय उपलब्ध नहीं है।")
            return@Column
        }

        Text(
            text = "उपाय एवं साधना",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(12.dp))

        RemedySection("प्रमुख साधना", remedies.primarySadhana)
        RemedySection("दशा उपाय", remedies.dashaRemedy)
        RemedySection("कर्म उपाय", remedies.karmaRemedy)
        RemedySection("यंत्र", remedies.yantraRecommendation)
        RemedySection("तपस्या", remedies.tapasyaRecommendation)
        RemedySection("शुभ तिथि", remedies.recommendedTithi)
    }
}

@Composable
private fun RemedySection(title: String, content: String) {
    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = content,
                style = MaterialTheme.typography.bodySmall
            )
        }
    }
    Spacer(modifier = Modifier.height(8.dp))
}

@Composable
private fun DashaTab(dasha: DashaInfo) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            text = "दशा विवरण",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(12.dp))

        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "महादशा",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                InfoRow("दशा स्वामी", dasha.lordHindi)
                InfoRow("कुल वर्ष", "${dasha.yearsTotal}")
                InfoRow("आरम्भ", dasha.startDate)
                InfoRow("समाप्ति", dasha.endDate)
                InfoRow("शेष वर्ष", String.format("%.1f", dasha.yearsRemaining))
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "अंतर्दशा",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                InfoRow("स्वामी", dasha.antardashaInfo.lordHindi)
                InfoRow("कुल वर्ष", String.format("%.1f", dasha.antardashaInfo.yearsTotal))
                InfoRow("आरम्भ", dasha.antardashaInfo.startDate)
                InfoRow("समाप्ति", dasha.antardashaInfo.endDate)
                InfoRow("शेष वर्ष", String.format("%.1f", dasha.antardashaInfo.yearsRemaining))
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "प्रत्यन्तर्दशा",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                InfoRow("स्वामी", dasha.pratyantardasha.lordHindi)
                InfoRow("आरम्भ", dasha.pratyantardasha.startDate)
                InfoRow("समाप्ति", dasha.pratyantardasha.endDate)
                InfoRow("शेष दिन", "${dasha.pratyantardasha.daysRemaining}")
            }
        }
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
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
