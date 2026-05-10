package com.jainkundali.app.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = Saffron,
    secondary = Amber,
    tertiary = DeepMaroon,
    background = Cream,
    surface = Cream,
    onPrimary = Cream,
    onSecondary = DeepMaroon,
    onTertiary = Cream,
    onBackground = DeepMaroon,
    onSurface = DeepMaroon,
    primaryContainer = WarmGold,
    onPrimaryContainer = DeepMaroon
)

private val DarkColorScheme = darkColorScheme(
    primary = DarkWarmGold,
    secondary = DarkAmber,
    tertiary = LightGold,
    background = DeepNavy,
    surface = Charcoal,
    onPrimary = DeepNavy,
    onSecondary = DeepNavy,
    onTertiary = DeepNavy,
    onBackground = LightGold,
    onSurface = LightGold,
    primaryContainer = Charcoal,
    onPrimaryContainer = DarkAmber
)

@Composable
fun JainKundaliTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
