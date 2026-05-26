package com.jainkundali.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.jainkundali.app.domain.data.getDashaSadhana
import com.jainkundali.app.domain.data.getKarmaSadhana
import com.jainkundali.app.domain.data.getNakshatraByName
import com.jainkundali.app.domain.intelligence.DecisionPriority
import com.jainkundali.app.domain.intelligence.IntelligenceDecision
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
    val intelligence by viewModel.intelligence.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val context = LocalContext.current

    var selectedTab by remember { mutableStateOf(0) }
    val tabs = listOf("वर्तमान", "जन्म कुंडली", "कर्म प्रोफ़ाइल", "भविष्य", "उपाय", "दशा", "यंत्र-मंत्र", "अनुष्ठान", "कर्म संक्रमण", "व्रत")

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

            // Horizontal swipe moves between tabs (REFERENCE.md §7). detectHorizontalDragGestures
            // waits for horizontal touch-slop, so each tab's vertical scroll is unaffected.
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .pointerInput(selectedTab, tabs.size) {
                        var totalDrag = 0f
                        detectHorizontalDragGestures(
                            onDragStart = { totalDrag = 0f },
                            onHorizontalDrag = { _, dragAmount -> totalDrag += dragAmount },
                            onDragEnd = {
                                if (totalDrag < -60f && selectedTab < tabs.size - 1) selectedTab += 1
                                else if (totalDrag > 60f && selectedTab > 0) selectedTab -= 1
                            }
                        )
                    }
            ) {
                userProfile?.let { profile ->
                    when (selectedTab) {
                        0 -> VartamanTab(todaysMessage, profile, intelligence)
                        1 -> BirthChartTab(profile)
                        2 -> KarmaProfileTab(karmaProfile)
                        3 -> PredictionsTab(predictions)
                        4 -> RemediesTab(remedies, profile)
                        5 -> DashaTab(profile.currentDasha)
                        6 -> YantraMantraTab(profile)
                        7 -> AnushthaanTab(profile)
                        8 -> KarmaTransitTab(profile)
                        9 -> VratTab(profile)
                    }
                } ?: Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    if (isLoading) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            CircularProgressIndicator()
                            Spacer(modifier = Modifier.height(16.dp))
                            Text("कुंडली बन रही है...")
                        }
                    } else {
                        Text("कुंडली उपलब्ध नहीं है। कृपया पहले कुंडली बनाएं।")
                    }
                }
            }
        }
    }
}

@Composable
private fun DecisionTraceCard(decision: IntelligenceDecision) {
    val (label, container, onContainer) = when (decision.priority) {
        DecisionPriority.URGENT -> Triple("अति-प्राथमिक", MaterialTheme.colorScheme.errorContainer, MaterialTheme.colorScheme.onErrorContainer)
        DecisionPriority.HIGH -> Triple("उच्च", MaterialTheme.colorScheme.tertiaryContainer, MaterialTheme.colorScheme.onTertiaryContainer)
        DecisionPriority.MEDIUM -> Triple("मध्यम", MaterialTheme.colorScheme.secondaryContainer, MaterialTheme.colorScheme.onSecondaryContainer)
        DecisionPriority.LOW -> Triple("सामान्य", MaterialTheme.colorScheme.surfaceVariant, MaterialTheme.colorScheme.onSurfaceVariant)
    }
    var expanded by remember { mutableStateOf(false) }

    ElevatedCard(
        modifier = Modifier.fillMaxWidth().clickable { expanded = !expanded },
        colors = CardDefaults.elevatedCardColors(containerColor = container)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "आज की साधना-प्राथमिकता",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = onContainer
                )
                AssistChip(
                    onClick = { expanded = !expanded },
                    label = { Text(label, style = MaterialTheme.typography.labelMedium) }
                )
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = "स्कोर: ${(decision.finalScore * 100).toInt()}% • आधार: ${if (decision.fallbackUsed) "नियम-आधारित" else "नियम + मॉडल"}",
                style = MaterialTheme.typography.bodySmall,
                color = onContainer
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = if (expanded) "▲ संकेत छिपाएँ" else "▼ कारण देखें (पारदर्शी निर्णय-ट्रेस)",
                style = MaterialTheme.typography.labelSmall,
                color = onContainer
            )

            if (expanded) {
                Spacer(modifier = Modifier.height(8.dp))
                val active = decision.matchedSignals
                if (active.isEmpty()) {
                    Text(
                        text = "कोई विशेष संकेत सक्रिय नहीं — नियमित साधना निरंतर रखें।",
                        style = MaterialTheme.typography.bodySmall,
                        color = onContainer
                    )
                } else {
                    active.forEach { signal ->
                        val sign = if (signal.polarity > 0) "▲" else "▼"
                        Text(
                            text = "$sign ${signal.label} — ${signal.detail}",
                            style = MaterialTheme.typography.bodySmall,
                            color = onContainer,
                            modifier = Modifier.padding(vertical = 2.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun VartamanTab(message: String, profile: UserProfile, intelligence: IntelligenceDecision?) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // Rule-first intelligence: transparent "why" trace for today's priority.
        intelligence?.let {
            DecisionTraceCard(it)
            Spacer(modifier = Modifier.height(16.dp))
        }

        // Pancham Kaal context banner — Digambar Jain doctrinal frame
        ElevatedCard(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.elevatedCardColors(
                containerColor = MaterialTheme.colorScheme.tertiaryContainer
            )
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Text(
                    text = "पंचम काल (दिगम्बर मान्यता)",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onTertiaryContainer
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "हम वर्तमान में पंचम काल (दुषमा) में हैं। दिगम्बर परम्परा के अनुसार इस काल में मोक्ष असम्भव है — परन्तु आपके लिए सम्यग्दर्शन, पुण्य-बन्ध और देव-गति का बन्ध सम्भव है। यही आपकी इस कुंडली का लक्ष्य है।",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onTertiaryContainer
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

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

        Spacer(modifier = Modifier.height(16.dp))

        // Nakshatra Details Card
        val nakshatra = getNakshatraByName(profile.birthNakshatra)
        if (nakshatra != null) {
            ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "नक्षत्र विस्तृत विवरण",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "आध्यात्मिक गुण",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = nakshatra.spiritualTraits,
                        style = MaterialTheme.typography.bodySmall
                    )

                    Spacer(modifier = Modifier.height(8.dp))
                    @Suppress("DEPRECATION")
                    Divider()
                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "कर्म प्रभाव",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = nakshatra.karmaManifestation,
                        style = MaterialTheme.typography.bodySmall
                    )

                    Spacer(modifier = Modifier.height(8.dp))
                    @Suppress("DEPRECATION")
                    Divider()
                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "साधना",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = nakshatra.sadhana,
                        style = MaterialTheme.typography.bodySmall
                    )

                    Spacer(modifier = Modifier.height(8.dp))
                    @Suppress("DEPRECATION")
                    Divider()
                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "जैन ज्योतिषी देव",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = nakshatra.deityNote,
                        style = MaterialTheme.typography.bodySmall
                    )

                    if (nakshatra.tirthankarasBorn.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(8.dp))
                        @Suppress("DEPRECATION")
                        Divider()
                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "इस नक्षत्र में जन्मे तीर्थंकर",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold
                        )
                        nakshatra.tirthankarasBorn.forEach { t ->
                            Text(
                                text = "• $t",
                                style = MaterialTheme.typography.bodySmall
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
        }

        // Tirthankara Connection Card
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "तीर्थंकर संबंध",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = profile.tirthankarAffinityHindi,
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Rashi Card
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "राशि विवरण",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "आपकी राशि ${profile.birthRashi} है। यह राशि चन्द्र अंश ${String.format("%.2f", profile.moonLongitude)}° पर आधारित है।",
                    style = MaterialTheme.typography.bodyMedium
                )
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

    var expanded by remember { mutableStateOf(false) }
    val karmaSadhana = getKarmaSadhana(karma.karmaEn)

    ElevatedCard(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { expanded = !expanded }
    ) {
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
                Row(verticalAlignment = Alignment.CenterVertically) {
                    AssistChip(
                        onClick = {},
                        label = { Text(stateLabel, style = MaterialTheme.typography.labelSmall) }
                    )
                    Icon(
                        imageVector = if (expanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                        contentDescription = if (expanded) "संक्षिप्त" else "विस्तार"
                    )
                }
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

            AnimatedVisibility(visible = expanded) {
                Column {
                    Spacer(modifier = Modifier.height(8.dp))
                    @Suppress("DEPRECATION")
                    Divider()
                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "दैनिक अभिव्यक्ति",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = karmaSadhana.dailyManifestation,
                        style = MaterialTheme.typography.bodySmall
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "वर्तमान स्थिति",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = if (karma.intensity >= 70) karmaSadhana.statusWhenDominant else karmaSadhana.statusWhenNormal,
                        style = MaterialTheme.typography.bodySmall
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "सामान्य उपाय",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = karmaSadhana.samanyaUpaya,
                        style = MaterialTheme.typography.bodySmall
                    )

                    if (karma.intensity >= 70) {
                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "प्रातः नियम",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.error
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = karmaSadhana.pratahNiyam,
                            style = MaterialTheme.typography.bodySmall
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "सायं नियम",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.error
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = karmaSadhana.saayamNiyam,
                            style = MaterialTheme.typography.bodySmall
                        )
                    }
                }
            }
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
private fun RemediesTab(remedies: CombinedRemedy?, profile: UserProfile) {
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

        val karmaSadhana = getKarmaSadhana(profile.dominantKarmaEn)
        val dashaSadhana = getDashaSadhana(profile.currentDasha.lord)

        Text(
            text = "उपाय एवं साधना",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(12.dp))

        // Primary Mantra Card
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = "प्रमुख मंत्र",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = karmaSadhana.primaryMantra.text,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Bold
                )
                if (karmaSadhana.primaryMantra.meaning.isNotBlank()) {
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "हिंदी अर्थ",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = karmaSadhana.primaryMantra.meaning,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                InfoRow("जाप संख्या", "${karmaSadhana.primaryMantra.count} बार")
                InfoRow("समय", karmaSadhana.primaryMantra.timing)
                InfoRow("माला", karmaSadhana.primaryMantra.maala)
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = karmaSadhana.primaryMantra.karmaEffect,
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }
        Spacer(modifier = Modifier.height(8.dp))

        // Secondary Mantra Card
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = "गौण मंत्र / स्तोत्र",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                InfoRow("स्तोत्र", karmaSadhana.secondaryMantra.stotraName)
                Text(
                    text = karmaSadhana.secondaryMantra.shloka,
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = FontWeight.Medium
                )
                if (karmaSadhana.secondaryMantra.meaning.isNotBlank()) {
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "हिंदी अर्थ",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = karmaSadhana.secondaryMantra.meaning,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                InfoRow("जाप संख्या", "${karmaSadhana.secondaryMantra.count} बार")
                InfoRow("समय", karmaSadhana.secondaryMantra.timing)
            }
        }
        Spacer(modifier = Modifier.height(8.dp))

        // Yantra Card
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = "यंत्र",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                InfoRow("नाम", karmaSadhana.yantra.name)
                InfoRow("सामग्री", karmaSadhana.yantra.material)
                InfoRow("स्थापना", karmaSadhana.yantra.installation)
                InfoRow("आकार", karmaSadhana.yantra.dimension)
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "प्रभाव: ${karmaSadhana.yantra.effect}",
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }
        Spacer(modifier = Modifier.height(8.dp))

        // Puja Card
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = "पूजा",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                InfoRow("पूजा", karmaSadhana.puja.name)
                InfoRow("तीर्थंकर", karmaSadhana.puja.tirthankara)
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "विधि: ${karmaSadhana.puja.vidhi}",
                    style = MaterialTheme.typography.bodySmall
                )
                Spacer(modifier = Modifier.height(4.dp))
                InfoRow("लाभ", karmaSadhana.puja.benefit)
                InfoRow("तिथि", karmaSadhana.puja.tithi)
                InfoRow("स्तोत्र", karmaSadhana.puja.stotra)
            }
        }
        Spacer(modifier = Modifier.height(8.dp))

        // Tapasya Card
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = "तपस्या",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                InfoRow("नाम", karmaSadhana.tapasya.name)
                Text(
                    text = karmaSadhana.tapasya.description,
                    style = MaterialTheme.typography.bodySmall
                )
                Spacer(modifier = Modifier.height(4.dp))
                InfoRow("तिथि", karmaSadhana.tapasya.tithi)
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "अनुष्ठान: ${karmaSadhana.tapasya.anusthana}",
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }
        Spacer(modifier = Modifier.height(8.dp))

        // Dasha Remedy Card
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = "दशा उपाय",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                InfoRow("वर्तमान दशा", dashaSadhana.lordHindi)
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = dashaSadhana.dashaSadhana,
                    style = MaterialTheme.typography.bodySmall
                )
                Spacer(modifier = Modifier.height(4.dp))
                InfoRow("श्रेष्ठ तिथि", dashaSadhana.bestTithi)
            }
        }
        Spacer(modifier = Modifier.height(8.dp))

        // Shubha Tithi Card
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = "शुभ तिथि",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "इस कर्म की साधना हेतु शुभ तिथियाँ:",
                    style = MaterialTheme.typography.bodySmall
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = karmaSadhana.shubhaTithi.joinToString(", ") { "तिथि $it" },
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}

@Composable
private fun DashaTab(dasha: DashaInfo) {
    val dashaSadhana = getDashaSadhana(dasha.lord)

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

        // Dasha Nature & Sadhana Card
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "दशा का स्वभाव एवं साधना",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "दशा का स्वभाव",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = dashaSadhana.natureDescription,
                    style = MaterialTheme.typography.bodySmall
                )

                Spacer(modifier = Modifier.height(8.dp))
                @Suppress("DEPRECATION")
                Divider()
                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "आप पर प्रभाव",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = dashaSadhana.dashaEffect,
                    style = MaterialTheme.typography.bodySmall
                )

                Spacer(modifier = Modifier.height(8.dp))
                @Suppress("DEPRECATION")
                Divider()
                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "अनुशंसित साधना",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = dashaSadhana.dashaSadhana,
                    style = MaterialTheme.typography.bodySmall
                )

                Spacer(modifier = Modifier.height(8.dp))
                @Suppress("DEPRECATION")
                Divider()
                Spacer(modifier = Modifier.height(8.dp))

                InfoRow("श्रेष्ठ तिथि", dashaSadhana.bestTithi)
            }
        }

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
private fun YantraMantraTab(profile: UserProfile) {
    val sadhana = getKarmaSadhana(profile.dominantKarmaEn)
    Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp)) {
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("यंत्र विधान", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(8.dp))
                Text("यंत्र: ${sadhana.yantra.name}", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
                Text("सामग्री: ${sadhana.yantra.material}", style = MaterialTheme.typography.bodySmall)
                Text("स्थापना: ${sadhana.yantra.installation}", style = MaterialTheme.typography.bodySmall)
                Text("माप: ${sadhana.yantra.dimension}", style = MaterialTheme.typography.bodySmall)
                Text("प्रभाव: ${sadhana.yantra.effect}", style = MaterialTheme.typography.bodySmall)
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("प्रमुख मंत्र", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(8.dp))
                Text(sadhana.primaryMantra.text, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(4.dp))
                Text("जाप संख्या: ${sadhana.primaryMantra.count}", style = MaterialTheme.typography.bodySmall)
                Text("समय: ${sadhana.primaryMantra.timing}", style = MaterialTheme.typography.bodySmall)
                Text("माला: ${sadhana.primaryMantra.maala}", style = MaterialTheme.typography.bodySmall)
                Text("कर्म प्रभाव: ${sadhana.primaryMantra.karmaEffect}", style = MaterialTheme.typography.bodySmall)
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("द्वितीय मंत्र/स्तोत्र", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(8.dp))
                Text(sadhana.secondaryMantra.stotraName, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
                Text(sadhana.secondaryMantra.shloka, style = MaterialTheme.typography.bodyMedium)
                Text("${sadhana.secondaryMantra.count} बार, ${sadhana.secondaryMantra.timing}", style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}

@Composable
private fun AnushthaanTab(profile: UserProfile) {
    val sadhana = getKarmaSadhana(profile.dominantKarmaEn)
    Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp)) {
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("विशेष उपाय (अनुष्ठान)", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(8.dp))
                Text(sadhana.visheshUpaya, style = MaterialTheme.typography.bodyMedium)
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("तपस्या", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(8.dp))
                Text("नाम: ${sadhana.tapasya.name}", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
                Text(sadhana.tapasya.description, style = MaterialTheme.typography.bodySmall)
                Text("तिथि: ${sadhana.tapasya.tithi}", style = MaterialTheme.typography.bodySmall)
                Text("अनुष्ठान विधि: ${sadhana.tapasya.anusthana}", style = MaterialTheme.typography.bodySmall)
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("पूजा विधि", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(8.dp))
                Text("पूजा: ${sadhana.puja.name}", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
                Text("तीर्थंकर: ${sadhana.puja.tirthankara}", style = MaterialTheme.typography.bodySmall)
                Text("विधि: ${sadhana.puja.vidhi}", style = MaterialTheme.typography.bodySmall)
                Text("लाभ: ${sadhana.puja.benefit}", style = MaterialTheme.typography.bodySmall)
                Text("तिथि: ${sadhana.puja.tithi}", style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}

@Composable
private fun KarmaTransitTab(profile: UserProfile) {
    val dasha = profile.currentDasha
    val dashaSadhana = getDashaSadhana(dasha.lord)
    Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp)) {
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("वर्तमान दशा स्थिति", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(8.dp))
                Text("महादशा: ${dasha.lordHindi} (${dasha.yearsTotal} वर्ष)", style = MaterialTheme.typography.bodyMedium)
                Text("शेष: ${String.format("%.1f", dasha.yearsRemaining)} वर्ष", style = MaterialTheme.typography.bodySmall)
                Spacer(modifier = Modifier.height(4.dp))
                Text("अंतर्दशा: ${dasha.antardashaInfo.lordHindi}", style = MaterialTheme.typography.bodyMedium)
                Text("शेष: ${String.format("%.1f", dasha.antardashaInfo.yearsRemaining)} वर्ष", style = MaterialTheme.typography.bodySmall)
                Spacer(modifier = Modifier.height(4.dp))
                Text("प्रत्यंतर्दशा: ${dasha.pratyantardasha.lordHindi}", style = MaterialTheme.typography.bodyMedium)
                Text("शेष: ${dasha.pratyantardasha.daysRemaining} दिन", style = MaterialTheme.typography.bodySmall)
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("दशा का प्रभाव", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(8.dp))
                Text(dashaSadhana.natureDescription, style = MaterialTheme.typography.bodyMedium)
                Spacer(modifier = Modifier.height(4.dp))
                Text(dashaSadhana.dashaEffect, style = MaterialTheme.typography.bodySmall)
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("दशा साधना", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(8.dp))
                Text(dashaSadhana.dashaSadhana, style = MaterialTheme.typography.bodyMedium)
                Text("श्रेष्ठ तिथि: ${dashaSadhana.bestTithi}", style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}

@Composable
private fun VratTab(profile: UserProfile) {
    val sadhana = getKarmaSadhana(profile.dominantKarmaEn)
    Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp)) {
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("व्रत मार्गदर्शन", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(8.dp))
                Text("आपके ${sadhana.karmaHindi} कर्म के लिए:", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))
                Text("शुभ तिथियाँ: ${sadhana.shubhaTithi.joinToString(", ")}", style = MaterialTheme.typography.bodySmall)
                Spacer(modifier = Modifier.height(8.dp))
                Text("सामान्य उपाय:", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Medium)
                Text(sadhana.samanyaUpaya, style = MaterialTheme.typography.bodySmall)
                Spacer(modifier = Modifier.height(8.dp))
                Text("प्रातः नियम:", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Medium)
                Text(sadhana.pratahNiyam, style = MaterialTheme.typography.bodySmall)
                Spacer(modifier = Modifier.height(8.dp))
                Text("सायं नियम:", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Medium)
                Text(sadhana.saayamNiyam, style = MaterialTheme.typography.bodySmall)
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("तपस्या", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(8.dp))
                Text(sadhana.tapasya.name, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
                Text(sadhana.tapasya.description, style = MaterialTheme.typography.bodySmall)
                Text("तिथि: ${sadhana.tapasya.tithi}", style = MaterialTheme.typography.bodySmall)
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
