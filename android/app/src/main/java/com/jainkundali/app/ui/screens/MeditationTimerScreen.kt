package com.jainkundali.app.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.jainkundali.app.ui.viewmodels.MeditationViewModel
import com.jainkundali.app.ui.viewmodels.TimerState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MeditationTimerScreen(
    viewModel: MeditationViewModel,
    onNavigateBack: () -> Unit
) {
    val timerState by viewModel.timerState.collectAsState()
    val totalSeconds by viewModel.totalSeconds.collectAsState()
    val elapsedSeconds by viewModel.elapsedSeconds.collectAsState()
    val selectedPreset by viewModel.selectedPreset.collectAsState()
    val intervalBellEnabled by viewModel.intervalBellEnabled.collectAsState()
    val streak by viewModel.streak.collectAsState()

    val remainingSeconds = totalSeconds - elapsedSeconds
    val progress = if (totalSeconds > 0) elapsedSeconds.toFloat() / totalSeconds.toFloat() else 0f

    val minutes = remainingSeconds / 60
    val seconds = remainingSeconds % 60
    val timeDisplay = "${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}"

    val primaryColor = MaterialTheme.colorScheme.primary
    val surfaceVariantColor = MaterialTheme.colorScheme.surfaceVariant

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("ध्यान साधना") },
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
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Streak display
            if (streak > 0) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "\uD83D\uDD25", fontSize = 20.sp)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "$streak दिन लगातार",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            // Circular progress timer
            Box(
                modifier = Modifier.size(250.dp),
                contentAlignment = Alignment.Center
            ) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val strokeWidth = 12.dp.toPx()
                    val arcSize = Size(size.width - strokeWidth, size.height - strokeWidth)
                    val topLeft = Offset(strokeWidth / 2, strokeWidth / 2)

                    // Background arc
                    drawArc(
                        color = surfaceVariantColor,
                        startAngle = -90f,
                        sweepAngle = 360f,
                        useCenter = false,
                        topLeft = topLeft,
                        size = arcSize,
                        style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
                    )

                    // Progress arc
                    drawArc(
                        color = primaryColor,
                        startAngle = -90f,
                        sweepAngle = progress * 360f,
                        useCenter = false,
                        topLeft = topLeft,
                        size = arcSize,
                        style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
                    )
                }

                // Time display
                Text(
                    text = timeDisplay,
                    fontSize = 40.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Preset buttons
            if (timerState == TimerState.IDLE) {
                Text(
                    text = "समय चुनें (मिनट)",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Medium
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(5, 10, 15, 30).forEach { preset ->
                        FilterChip(
                            selected = selectedPreset == preset,
                            onClick = { viewModel.setDuration(preset) },
                            label = { Text("$preset") }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Control buttons
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                when (timerState) {
                    TimerState.IDLE -> {
                        Button(onClick = { viewModel.start() }) {
                            Text("शुरू करें")
                        }
                    }
                    TimerState.RUNNING -> {
                        OutlinedButton(onClick = { viewModel.pause() }) {
                            Text("रोकें")
                        }
                        FilledTonalButton(onClick = { viewModel.stop() }) {
                            Text("समाप्त")
                        }
                    }
                    TimerState.PAUSED -> {
                        Button(onClick = { viewModel.resume() }) {
                            Text("जारी रखें")
                        }
                        FilledTonalButton(onClick = { viewModel.stop() }) {
                            Text("समाप्त")
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Interval bell toggle
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "अंतराल घंटी (5 मिनट)",
                    style = MaterialTheme.typography.bodyMedium
                )
                Switch(
                    checked = intervalBellEnabled,
                    onCheckedChange = { viewModel.toggleIntervalBell() }
                )
            }
        }
    }
}
