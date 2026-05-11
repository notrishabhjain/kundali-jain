package com.jainkundali.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.jainkundali.app.data.entities.AnushthaanEntity
import com.jainkundali.app.data.repository.AnushthaanRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class AnushthaanViewModel(
    private val anushthaanRepository: AnushthaanRepository
) : ViewModel() {

    private val _profileId = MutableStateFlow<Long?>(null)

    val anushthaans: StateFlow<List<AnushthaanEntity>> = _profileId
        .filterNotNull()
        .flatMapLatest { id -> anushthaanRepository.getByProfileId(id) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val activeAnushthaans: StateFlow<List<AnushthaanEntity>> = anushthaans
        .map { list -> list.filter { it.status == "active" } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val completedAnushthaans: StateFlow<List<AnushthaanEntity>> = anushthaans
        .map { list -> list.filter { it.status == "completed" } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun setProfileId(profileId: Long) {
        _profileId.value = profileId
    }

    fun startNewAnushthaan(profileId: Long, type: String, mantraText: String, mantraCount: Int) {
        val totalDays = when (type) {
            "40-day" -> 40
            "21-day" -> 21
            "9-day" -> 9
            else -> 40
        }
        val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val today = dateFormat.format(Date())

        viewModelScope.launch {
            anushthaanRepository.insert(
                AnushthaanEntity(
                    profileId = profileId,
                    type = type,
                    totalDays = totalDays,
                    completedDays = 0,
                    startDate = today,
                    mantraText = mantraText,
                    mantraCount = mantraCount,
                    status = "active",
                    lastCompletedDate = null
                )
            )
        }
    }

    fun markDayCompleted(anushthaan: AnushthaanEntity) {
        val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val today = dateFormat.format(Date())

        viewModelScope.launch {
            anushthaanRepository.markDayCompleted(anushthaan.id, today)
        }
    }

    fun deleteAnushthaan(anushthaan: AnushthaanEntity) {
        viewModelScope.launch {
            anushthaanRepository.delete(anushthaan)
        }
    }
}
