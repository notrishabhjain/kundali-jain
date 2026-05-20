package com.jainkundali.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.jainkundali.app.domain.models.MantraEntry
import com.jainkundali.app.ui.viewmodels.MantraViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MantraListScreen(
    viewModel: MantraViewModel,
    onNavigateBack: () -> Unit,
    onStartJaap: (MantraEntry) -> Unit
) {
    val mantras by viewModel.mantras.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("मंत्र एवं पूजा") },
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
        ) {
            // Search
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { viewModel.search(it) },
                label = { Text("खोजें...") },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                singleLine = true
            )

            // Category filter chips
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(viewModel.categories) { category ->
                    FilterChip(
                        selected = selectedCategory == category,
                        onClick = { viewModel.filterByCategory(category) },
                        label = { Text(category) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Mantra list
            LazyColumn(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(mantras) { mantra ->
                    MantraCard(mantra = mantra, onStartJaap = { onStartJaap(mantra) })
                }
            }
        }
    }
}

@Composable
private fun MantraCard(mantra: MantraEntry, onStartJaap: () -> Unit) {
    var expanded by remember { mutableStateOf(false) }

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
                    text = mantra.category,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.weight(1f)
                )
                Text(
                    text = if (expanded) "▲" else "▼ पूरा देखें",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Always show full mantra text — no truncation. Collapsed view limits lines visually.
            Text(
                text = mantra.text,
                style = MaterialTheme.typography.bodySmall,
                maxLines = if (expanded) Int.MAX_VALUE else 3
            )

            AnimatedVisibility(visible = expanded) {
                Column {
                    if (mantra.meaning.isNotBlank()) {
                        Spacer(modifier = Modifier.height(10.dp))
                        @Suppress("DEPRECATION")
                        Divider()
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "हिंदी अर्थ",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = mantra.meaning,
                            style = MaterialTheme.typography.bodySmall
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    @Suppress("DEPRECATION")
                    Divider()
                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "जाप संख्या: ${mantra.recommendedCount}",
                        style = MaterialTheme.typography.labelMedium
                    )
                    Text(
                        text = "समय: ${mantra.timing}",
                        style = MaterialTheme.typography.labelMedium
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = "कर्म-प्रभाव: ${mantra.karmaEffect}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.75f)
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    FilledTonalButton(
                        onClick = onStartJaap,
                        modifier = Modifier.align(Alignment.End)
                    ) {
                        Text("जाप शुरू करें")
                    }
                }
            }
        }
    }
}
