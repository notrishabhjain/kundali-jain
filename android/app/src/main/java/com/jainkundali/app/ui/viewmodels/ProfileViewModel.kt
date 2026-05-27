package com.jainkundali.app.ui.viewmodels

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.jainkundali.app.data.entities.ProfileEntity
import com.jainkundali.app.data.preferences.AppPreferences
import com.jainkundali.app.data.repository.ProfileRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class ProfileViewModel(
    private val profileRepository: ProfileRepository,
    private val appPreferences: AppPreferences
) : ViewModel() {

    // A DB read error must never crash the UI collecting this flow — degrade to an empty list.
    val profiles: Flow<List<ProfileEntity>> = profileRepository.allProfiles
        .catch { e -> Log.e("ProfileViewModel", "Loading profiles failed", e); emit(emptyList()) }

    val selectedProfileId: StateFlow<Long?> = appPreferences.selectedProfileId
        .catch { emit(null) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    fun selectProfile(profileId: Long) {
        viewModelScope.launch {
            runCatching { appPreferences.setSelectedProfileId(profileId) }
                .onFailure { Log.e("ProfileViewModel", "Selecting profile failed", it) }
        }
    }

    fun deleteProfile(profile: ProfileEntity) {
        viewModelScope.launch {
            runCatching { profileRepository.delete(profile) }
                .onFailure { Log.e("ProfileViewModel", "Deleting profile failed", it) }
        }
    }

    fun getActiveProfile(): Flow<ProfileEntity?> {
        return selectedProfileId.flatMapLatest { id ->
            if (id != null) {
                flow { emit(profileRepository.getById(id)) }
            } else {
                flowOf(null)
            }
        }
    }
}
