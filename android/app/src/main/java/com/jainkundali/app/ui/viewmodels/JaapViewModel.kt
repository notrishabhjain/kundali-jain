package com.jainkundali.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.jainkundali.app.data.entities.JaapSessionEntity
import com.jainkundali.app.data.repository.SadhanaRepository
import com.jainkundali.app.domain.models.MantraEntry
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class JaapViewModel(
    private val sadhanaRepository: SadhanaRepository
) : ViewModel() {

    private val _currentCount = MutableStateFlow(0)
    val currentCount: StateFlow<Int> = _currentCount.asStateFlow()

    private val _targetCount = MutableStateFlow(108)
    val targetCount: StateFlow<Int> = _targetCount.asStateFlow()

    private val _selectedMantra = MutableStateFlow<MantraEntry?>(null)
    val selectedMantra: StateFlow<MantraEntry?> = _selectedMantra.asStateFlow()

    private val _isActive = MutableStateFlow(false)
    val isActive: StateFlow<Boolean> = _isActive.asStateFlow()

    private val _shouldVibrate = MutableStateFlow(false)
    val shouldVibrate: StateFlow<Boolean> = _shouldVibrate.asStateFlow()

    private val _malaCompleted = MutableStateFlow(false)
    val malaCompleted: StateFlow<Boolean> = _malaCompleted.asStateFlow()

    private val _totalHistoricalCount = MutableStateFlow(0)
    val totalHistoricalCount: StateFlow<Int> = _totalHistoricalCount.asStateFlow()

    val sessionHistory = sadhanaRepository.getRecentJaapSessions(20)

    private var sessionStartTime: Long = 0L

    val malasCompleted: Int
        get() = _currentCount.value / 108

    val isComplete: Boolean
        get() = _currentCount.value >= _targetCount.value

    init {
        viewModelScope.launch {
            _totalHistoricalCount.value = sadhanaRepository.getTotalJaapCount()
        }
    }

    fun selectMantra(mantra: MantraEntry) {
        _selectedMantra.value = mantra
        _targetCount.value = mantra.recommendedCount
    }

    fun increment() {
        if (!_isActive.value) {
            _isActive.value = true
            sessionStartTime = System.currentTimeMillis()
        }

        _currentCount.value++
        _shouldVibrate.value = true

        if (_currentCount.value % 108 == 0) {
            _malaCompleted.value = true
        }
    }

    fun consumeVibration() {
        _shouldVibrate.value = false
    }

    fun consumeMalaCompleted() {
        _malaCompleted.value = false
    }

    fun reset() {
        _currentCount.value = 0
        _isActive.value = false
        _malaCompleted.value = false
        sessionStartTime = 0L
    }

    fun setTarget(target: Int) {
        _targetCount.value = target
    }

    fun saveSession(profileId: Long = 0L) {
        val mantra = _selectedMantra.value ?: return
        if (_currentCount.value == 0) return

        viewModelScope.launch {
            val session = JaapSessionEntity(
                profileId = profileId,
                mantraName = mantra.category,
                mantraText = mantra.text.take(100),
                targetCount = _targetCount.value,
                completedCount = _currentCount.value,
                malasCompleted = _currentCount.value / 108,
                startTime = sessionStartTime,
                endTime = System.currentTimeMillis(),
                date = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE)
            )
            sadhanaRepository.saveJaapSession(session)
            _totalHistoricalCount.value = sadhanaRepository.getTotalJaapCount()
            reset()
        }
    }
}
