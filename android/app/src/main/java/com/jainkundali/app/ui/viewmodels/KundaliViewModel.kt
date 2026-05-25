package com.jainkundali.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.jainkundali.app.data.entities.ProfileEntity
import com.jainkundali.app.data.preferences.AppPreferences
import com.jainkundali.app.data.repository.ProfileRepository
import com.jainkundali.app.domain.engine.*
import com.jainkundali.app.domain.models.*
import com.jainkundali.app.domain.data.CITIES
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class KundaliViewModel(
    private val profileRepository: ProfileRepository,
    private val appPreferences: AppPreferences
) : ViewModel() {

    val savedProfiles: StateFlow<List<ProfileEntity>> = profileRepository.allProfiles
        .stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

    private val _fullName = MutableStateFlow("")
    val fullName: StateFlow<String> = _fullName.asStateFlow()

    private val _dob = MutableStateFlow("")
    val dob: StateFlow<String> = _dob.asStateFlow()

    private val _time = MutableStateFlow("")
    val time: StateFlow<String> = _time.asStateFlow()

    private val _place = MutableStateFlow("")
    val place: StateFlow<String> = _place.asStateFlow()

    private val _gender = MutableStateFlow("पुरुष")
    val gender: StateFlow<String> = _gender.asStateFlow()

    private val _selectedCity = MutableStateFlow<City?>(null)
    val selectedCity: StateFlow<City?> = _selectedCity.asStateFlow()

    private val _userProfile = MutableStateFlow<UserProfile?>(null)
    val userProfile: StateFlow<UserProfile?> = _userProfile.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _karmaProfile = MutableStateFlow<List<KarmaState>>(emptyList())
    val karmaProfile: StateFlow<List<KarmaState>> = _karmaProfile.asStateFlow()

    private val _predictions = MutableStateFlow<List<LifeDomainPrediction>>(emptyList())
    val predictions: StateFlow<List<LifeDomainPrediction>> = _predictions.asStateFlow()

    private val _remedies = MutableStateFlow<CombinedRemedy?>(null)
    val remedies: StateFlow<CombinedRemedy?> = _remedies.asStateFlow()

    private val _todaysMessage = MutableStateFlow("")
    val todaysMessage: StateFlow<String> = _todaysMessage.asStateFlow()

    private val _citySearchResults = MutableStateFlow<List<City>>(emptyList())
    val citySearchResults: StateFlow<List<City>> = _citySearchResults.asStateFlow()

    fun updateFullName(name: String) {
        _fullName.value = name
    }

    fun updateDob(date: String) {
        _dob.value = date
    }

    fun updateTime(t: String) {
        _time.value = t
    }

    fun updatePlace(p: String) {
        _place.value = p
        searchCities(p)
    }

    fun updateGender(g: String) {
        _gender.value = g
    }

    fun selectCity(city: City) {
        _selectedCity.value = city
        _place.value = city.hindiName
        _citySearchResults.value = emptyList()
    }

    fun searchCities(query: String) {
        if (query.length < 2) {
            _citySearchResults.value = emptyList()
            return
        }
        _citySearchResults.value = CITIES.filter { city ->
            city.hindiName.contains(query) || city.name.contains(query, ignoreCase = true)
        }.take(10)
    }

    // Guards against the same generation running twice (double tap / recomposition),
    // which previously produced duplicate profile rows.
    private var generateJob: Job? = null

    fun generateKundali() {
        val city = _selectedCity.value ?: return
        if (generateJob?.isActive == true) return

        _isLoading.value = true
        generateJob = viewModelScope.launch {
            try {
                val formData = BirthFormData(
                    fullName = _fullName.value.trim(),
                    dob = _dob.value,
                    time = _time.value,
                    place = city.hindiName,
                    lat = city.latitude.toString(),
                    lng = city.longitude.toString(),
                    gender = _gender.value
                )

                val profile = ProfileEngine.generateUserProfile(formData)
                _userProfile.value = profile

                _karmaProfile.value = KarmaEngine.calculateKarmaProfile(
                    profile.dominantKarmaEn,
                    profile.currentDasha.lord,
                    profile.gunasthana
                )

                _predictions.value = PredictionEngine.generatePredictions(profile)
                _remedies.value = RemedyEngine.generateRemedies(profile)

                val dayContext = ProfileEngine.getTodayContext()
                _todaysMessage.value = AnalysisSynthesizer.generateTodaysMessage(profile, dayContext)

                // Single, atomic, idempotent persist — the repository de-duplicates in one
                // transaction so this can never create a second row for the same person.
                persistCurrentProfile(city)
            } finally {
                _isLoading.value = false
            }
        }
    }

    private suspend fun persistCurrentProfile(city: City) {
        val entity = ProfileEntity(
            name = _fullName.value.trim(),
            dateOfBirth = _dob.value,
            birthTime = _time.value,
            birthPlace = city.hindiName,
            latitude = city.latitude,
            longitude = city.longitude,
            gender = _gender.value
        )
        val id = profileRepository.upsert(entity)
        appPreferences.setSelectedProfileId(id)
    }

    private fun populateFromEntity(entity: ProfileEntity) {
        _fullName.value = entity.name
        _dob.value = entity.dateOfBirth
        _time.value = entity.birthTime
        _place.value = entity.birthPlace
        _gender.value = entity.gender

        val city = CITIES.find { it.hindiName == entity.birthPlace }
            ?: City(entity.birthPlace, entity.birthPlace, "", entity.latitude, entity.longitude)
        _selectedCity.value = city
    }

    fun loadProfileFromEntity(entity: ProfileEntity) {
        populateFromEntity(entity)
        generateKundali()
    }

    fun fillFromProfile(entity: ProfileEntity) {
        populateFromEntity(entity)
    }
}
