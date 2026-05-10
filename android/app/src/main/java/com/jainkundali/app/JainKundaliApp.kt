package com.jainkundali.app

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

@Composable
fun JainKundaliApp() {
    val navController = rememberNavController()

    Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("home") {
                PlaceholderScreen("Home")
            }
            composable("kundali_form") {
                PlaceholderScreen("Kundali Form")
            }
            composable("kundali_result") {
                PlaceholderScreen("Kundali Result")
            }
            composable("mantras") {
                PlaceholderScreen("Mantras")
            }
            composable("jaap_counter") {
                PlaceholderScreen("Jaap Counter")
            }
            composable("meditation_timer") {
                PlaceholderScreen("Meditation Timer")
            }
            composable("profiles") {
                PlaceholderScreen("Profiles")
            }
            composable("settings") {
                PlaceholderScreen("Settings")
            }
        }
    }
}

@Composable
fun PlaceholderScreen(screenName: String) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Text(text = screenName)
    }
}
