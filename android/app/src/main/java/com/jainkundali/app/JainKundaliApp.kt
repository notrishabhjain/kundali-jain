package com.jainkundali.app

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.jainkundali.app.ui.screens.*
import com.jainkundali.app.ui.viewmodels.*

@Composable
fun JainKundaliApp() {
    val context = LocalContext.current
    val application = context.applicationContext as JainKundaliApplication
    val container = application.container

    val kundaliViewModel = remember { KundaliViewModel(container.profileRepository) }
    val jaapViewModel = remember { JaapViewModel(container.sadhanaRepository) }
    val meditationViewModel = remember { MeditationViewModel(container.sadhanaRepository) }
    val mantraViewModel = remember { MantraViewModel() }
    val profileViewModel = remember { ProfileViewModel(container.profileRepository, container.appPreferences) }
    val anushthaanViewModel = remember { AnushthaanViewModel(container.anushthaanRepository) }

    val navController = rememberNavController()

    Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("home") {
                HomeScreen(
                    onNavigateToKundaliForm = { navController.navigate("kundali_form") },
                    onNavigateToJaap = { navController.navigate("jaap_counter") },
                    onNavigateToMeditation = { navController.navigate("meditation_timer") },
                    onNavigateToMantras = { navController.navigate("mantras") },
                    onNavigateToProfiles = { navController.navigate("profiles") },
                    onNavigateToSettings = { navController.navigate("settings") },
                    onNavigateToYantraTantra = { navController.navigate("yantra_tantra") },
                    onNavigateToDailyPrescription = { navController.navigate("daily_prescription") },
                    onNavigateToMuhurta = { navController.navigate("muhurta") },
                    onNavigateToAnushthaan = { navController.navigate("anushthaan") },
                    onNavigateToKarmaTransit = { navController.navigate("karma_transit") },
                    onNavigateToKarmaMilan = { navController.navigate("karma_milan") },
                    onNavigateToVratRecommendations = { navController.navigate("vrat_recommendations") }
                )
            }
            composable("kundali_form") {
                KundaliFormScreen(
                    viewModel = kundaliViewModel,
                    onNavigateBack = { navController.popBackStack() },
                    onNavigateToResult = { navController.navigate("kundali_result") }
                )
            }
            composable("kundali_result") {
                KundaliResultScreen(
                    viewModel = kundaliViewModel,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
            composable("mantras") {
                MantraListScreen(
                    viewModel = mantraViewModel,
                    onNavigateBack = { navController.popBackStack() },
                    onStartJaap = { mantra ->
                        jaapViewModel.selectMantra(mantra)
                        navController.navigate("jaap_counter")
                    }
                )
            }
            composable("jaap_counter") {
                JaapCounterScreen(
                    viewModel = jaapViewModel,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
            composable("meditation_timer") {
                MeditationTimerScreen(
                    viewModel = meditationViewModel,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
            composable("profiles") {
                ProfileScreen(
                    viewModel = profileViewModel,
                    onNavigateBack = { navController.popBackStack() },
                    onNavigateToForm = { navController.navigate("kundali_form") }
                )
            }
            composable("settings") {
                SettingsScreen(
                    appPreferences = container.appPreferences,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
            composable("yantra_tantra") {
                YantraTantraScreen(
                    profileRepository = container.profileRepository,
                    appPreferences = container.appPreferences,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
            composable("daily_prescription") {
                DailyPrescriptionScreen(
                    profileRepository = container.profileRepository,
                    appPreferences = container.appPreferences,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
            composable("muhurta") {
                MuhurtaScreen(
                    profileRepository = container.profileRepository,
                    appPreferences = container.appPreferences,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
            composable("anushthaan") {
                AnushthaanScreen(
                    viewModel = anushthaanViewModel,
                    profileRepository = container.profileRepository,
                    appPreferences = container.appPreferences,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
            composable("karma_transit") {
                KarmaTransitScreen(
                    profileRepository = container.profileRepository,
                    appPreferences = container.appPreferences,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
            composable("karma_milan") {
                KarmaMilanScreen(
                    profileRepository = container.profileRepository,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
            composable("vrat_recommendations") {
                VratRecommendationScreen(
                    profileRepository = container.profileRepository,
                    appPreferences = container.appPreferences,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
        }
    }
}
