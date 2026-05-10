package com.jainkundali.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.jainkundali.app.data.entities.MeditationSessionEntity
import com.jainkundali.app.data.repository.SadhanaRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter

enum class TimerState {
    IDLE, RUNNING, PAUSED
}

class MeditationViewModel(
    private val sadhanaRepository: SadhanaRepository
) : ViewModel() {

    private val _timerState = MutableStateFlow(TimerState.IDLE)
    val timerState: StateFlow<TimerState> = _timerState.asStateFlow()

    private val _totalSeconds = MutableStateFlow(600) // default 10 min
    val totalSeconds: StateFlow<Int> = _totalSeconds.asStateFlow()

    private val _elapsedSeconds = MutableStateFlow(0)
    val elapsedSeconds: StateFlow<Int> = _elapsedSeconds.asStateFlow()

    private val _selectedPreset = MutableStateFlow(10)
    val selectedPreset: StateFlow<Int> = _selectedPreset.asStateFlow()

    private val _intervalBellEnabled = MutableStateFlow(false)
    val intervalBellEnabled: StateFlow<Boolean> = _intervalBellEnabled.asStateFlow()

    private val _intervalSeconds = MutableStateFlow(300) // 5 min interval
    val intervalSeconds: StateFlow<Int> = _intervalSeconds.asStateFlow()

    private val _shouldPlayBell = MutableStateFlow(false)
    val shouldPlayBell: StateFlow<Boolean> = _shouldPlayBell.asStateFlow()

    private val _streak = MutableStateFlow(0)
    val streak: StateFlow<Int> = _streak.asStateFlow()

    val sessionHistory = sadhanaRepository.getRecentMeditationSessions(20)

    private var timerJob: Job? = null
    private var sessionStartTime: Long = 0L

    val remainingSeconds: Int
        get() = _totalSeconds.value - _elapsedSeconds.value

    val progress: Float
        get() = if (_totalSeconds.value > 0) _elapsedSeconds.value.toFloat() / _totalSeconds.value.toFloat() else 0f

    init {
        viewModelScope.launch {
            _streak.value = sadhanaRepository.getMeditationStreak()
        }
    }

    fun setDuration(minutes: Int) {
        _selectedPreset.value = minutes
        _totalSeconds.value = minutes * 60
        _elapsedSeconds.value = 0
    }

    fun start() {
        _timerState.value = TimerState.RUNNING
        sessionStartTime = System.currentTimeMillis()
        startTimer()
    }

    fun pause() {
        _timerState.value = TimerState.PAUSED
        timerJob?.cancel()
    }

    fun resume() {
        _timerState.value = TimerState.RUNNING
        startTimer()
    }

    fun stop() {
        timerJob?.cancel()
        _timerState.value = TimerState.IDLE
        saveSession()
        _elapsedSeconds.value = 0
    }

    fun toggleIntervalBell() {
        _intervalBellEnabled.value = !_intervalBellEnabled.value
    }

    fun consumeBell() {
        _shouldPlayBell.value = false
    }

    private fun startTimer() {
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            while (isActive && _elapsedSeconds.value < _totalSeconds.value) {
                delay(1000L)
                _elapsedSeconds.value++

                if (_intervalBellEnabled.value && _elapsedSeconds.value % _intervalSeconds.value == 0 && _elapsedSeconds.value < _totalSeconds.value) {
                    _shouldPlayBell.value = true
                }

                if (_elapsedSeconds.value >= _totalSeconds.value) {
                    _shouldPlayBell.value = true
                    _timerState.value = TimerState.IDLE
                    saveSession()
                }
            }
        }
    }

    private fun saveSession(profileId: Long = 0L) {
        if (_elapsedSeconds.value == 0) return

        viewModelScope.launch {
            val session = MeditationSessionEntity(
                profileId = profileId,
                durationMinutes = _totalSeconds.value / 60,
                actualDurationSeconds = _elapsedSeconds.value.toLong(),
                type = "silent",
                startTime = sessionStartTime,
                endTime = System.currentTimeMillis(),
                date = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE),
                completed = _elapsedSeconds.value >= _totalSeconds.value
            )
            sadhanaRepository.saveMeditationSession(session)
            _streak.value = sadhanaRepository.getMeditationStreak()
        }
    }
}
