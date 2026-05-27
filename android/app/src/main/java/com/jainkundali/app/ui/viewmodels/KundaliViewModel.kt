package com.jainkundali.app.ui.viewmodels

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.jainkundali.app.data.entities.ProfileEntity
import com.jainkundali.app.data.preferences.AppPreferences
import com.jainkundali.app.data.repository.ProfileRepository
import com.jainkundali.app.domain.engine.*
import com.jainkundali.app.domain.intelligence.FinalDecision
import com.jainkundali.app.domain.intelligence.IntelligenceDecision
import com.jainkundali.app.domain.models.*
import com.jainkundali.app.domain.data.CITIES
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class KundaliViewModel(
    private val profileRepository: ProfileRepository,
    private val appPreferences: AppPreferences
) : ViewModel() {

    val savedProfiles: StateFlow<List<ProfileEntity>> = profileRepository.allProfiles
        .catch { e -> Log.e("KundaliViewModel", "Loading saved profiles failed", e); emit(emptyList()) }
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

    // Rule-first intelligence decision + trace for the current chart (null until generated).
    private val _intelligence = MutableStateFlow<IntelligenceDecision?>(null)
    val intelligence: StateFlow<IntelligenceDecision?> = _intelligence.asStateFlow()

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

                // The compute pipeline must never crash the app. Every engine already has an
                // internal fallback, but we wrap the orchestration too so an unforeseen throw in
                // any one layer still yields a renderable chart instead of an uncaught exception.
                val profile = ProfileEngine.generateUserProfile(formData)
                _userProfile.value = profile

                _karmaProfile.value = runCatching {
                    KarmaEngine.calculateKarmaProfile(
                        profile.dominantKarmaEn,
                        profile.currentDasha.lord,
                        profile.gunasthana
                    )
                }.getOrDefault(emptyList())

                _predictions.value = runCatching {
                    PredictionEngine.generatePredictions(profile)
                }.getOrDefault(emptyList())

                _remedies.value = runCatching { RemedyEngine.generateRemedies(profile) }.getOrNull()

                val dayContext = ProfileEngine.getTodayContext()
                val message = runCatching {
                    val rawMessage = AnalysisSynthesizer.generateTodaysMessage(profile, dayContext)
                    // Doctrinal scrub: never let a mokṣa-promising phrase reach the user in Pancham Kaal.
                    PanchamKaalGuard.sanitizeNarrative(rawMessage)
                }.getOrDefault("जय जिनेंद्र। आपकी कुंडली तैयार है।")
                _todaysMessage.value = message

                // Rule-first intelligence: transparent signal scoring + graceful model fallback.
                _intelligence.value = runCatching {
                    FinalDecision.build(profile, dayContext, message)
                }.getOrNull()

                // Persisting is isolated: a DB / preferences failure must not blank the chart the
                // user just generated, so its failure is logged rather than propagated.
                persistCurrentProfile(city)
            } catch (t: Throwable) {
                Log.e("KundaliViewModel", "Kundali generation failed", t)
                if (_userProfile.value == null) {
                    // Last-resort fallback so the result screen always has something to render.
                    _userProfile.value = runCatching {
                        ProfileEngine.generateUserProfile(
                            BirthFormData(
                                fullName = _fullName.value.trim().ifEmpty { "जातक" },
                                dob = _dob.value.ifEmpty { "2000-01-01" },
                                time = _time.value.ifEmpty { "12:00" },
                                place = city.hindiName,
                                lat = city.latitude.toString(),
                                lng = city.longitude.toString(),
                                gender = _gender.value
                            )
                        )
                    }.getOrNull()
                }
            } finally {
                _isLoading.value = false
            }
        }
    }

    private suspend fun persistCurrentProfile(city: City) {
        runCatching {
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
        }.onFailure { Log.e("KundaliViewModel", "Persisting profile failed", it) }
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
