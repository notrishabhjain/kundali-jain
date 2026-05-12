package com.jainkundali.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.jainkundali.app.domain.data.getDashaSadhana
import com.jainkundali.app.domain.data.getKarmaSadhana
import com.jainkundali.app.domain.data.getNakshatraByName
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

    var selectedTab by remember { mutableStateOf(0) }
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
                    4 -> RemediesTab(remedies, profile)
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
                Spacer(modifier = Modifier.height(4.dp))
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
                Spacer(modifier = Modifier.height(4.dp))
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
