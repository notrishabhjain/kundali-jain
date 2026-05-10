package com.jainkundali.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import com.jainkundali.app.data.preferences.AppPreferences
import com.jainkundali.app.ui.theme.JainKundaliTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val appPreferences = AppPreferences(this)

        setContent {
            val isDarkMode by appPreferences.isDarkMode.collectAsState(initial = false)
            JainKundaliTheme(darkTheme = isDarkMode) {
                JainKundaliApp()
            }
        }
    }
}
