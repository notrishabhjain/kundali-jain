package com.jainkundali.app.di

import android.content.Context
import com.jainkundali.app.data.AppDatabase
import com.jainkundali.app.data.preferences.AppPreferences
import com.jainkundali.app.data.repository.ProfileRepository
import com.jainkundali.app.data.repository.SadhanaRepository

class AppContainer(context: Context) {
    private val database = AppDatabase.getInstance(context)

    val profileRepository = ProfileRepository(database.profileDao())
    val sadhanaRepository = SadhanaRepository(database.jaapDao(), database.meditationDao())
    val appPreferences = AppPreferences(context)
}
