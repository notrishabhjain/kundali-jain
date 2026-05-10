package com.jainkundali.app.data.preferences

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "jain_kundali_prefs")

class AppPreferences(private val context: Context) {

    companion object {
        private val IS_DARK_MODE = booleanPreferencesKey("is_dark_mode")
        private val SELECTED_PROFILE_ID = longPreferencesKey("selected_profile_id")
        private val LAST_OPENED_SCREEN = stringPreferencesKey("last_opened_screen")
    }

    val isDarkMode: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[IS_DARK_MODE] ?: false
    }

    val selectedProfileId: Flow<Long?> = context.dataStore.data.map { preferences ->
        preferences[SELECTED_PROFILE_ID]
    }

    val lastOpenedScreen: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[LAST_OPENED_SCREEN] ?: "home"
    }

    suspend fun setDarkMode(isDark: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[IS_DARK_MODE] = isDark
        }
    }

    suspend fun setSelectedProfileId(profileId: Long) {
        context.dataStore.edit { preferences ->
            preferences[SELECTED_PROFILE_ID] = profileId
        }
    }

    suspend fun setLastOpenedScreen(screen: String) {
        context.dataStore.edit { preferences ->
            preferences[LAST_OPENED_SCREEN] = screen
        }
    }
}
