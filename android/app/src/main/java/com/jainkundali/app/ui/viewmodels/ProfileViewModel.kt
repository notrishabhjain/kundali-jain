package com.jainkundali.app.ui.viewmodels

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

    val profiles: Flow<List<ProfileEntity>> = profileRepository.allProfiles

    val selectedProfileId: StateFlow<Long?> = appPreferences.selectedProfileId
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    fun selectProfile(profileId: Long) {
        viewModelScope.launch {
            appPreferences.setSelectedProfileId(profileId)
        }
    }

    fun deleteProfile(profile: ProfileEntity) {
        viewModelScope.launch {
            profileRepository.delete(profile)
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
