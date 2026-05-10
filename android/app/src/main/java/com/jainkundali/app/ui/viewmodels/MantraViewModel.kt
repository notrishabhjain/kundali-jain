package com.jainkundali.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import com.jainkundali.app.domain.data.MANTRAS
import com.jainkundali.app.domain.data.KARMA_SADHANA
import com.jainkundali.app.domain.data.TIRTHANKARAS
import com.jainkundali.app.domain.models.MantraEntry
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class MantraViewModel : ViewModel() {

    private val allMantras: List<MantraEntry> = buildFullMantraList()

    private val _mantras = MutableStateFlow(allMantras)
    val mantras: StateFlow<List<MantraEntry>> = _mantras.asStateFlow()

    private val _selectedCategory = MutableStateFlow("सभी")
    val selectedCategory: StateFlow<String> = _selectedCategory.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    val categories = listOf("सभी", "कर्म मंत्र", "तीर्थंकर मंत्र", "हिंदू मंत्र", "नवग्रह मंत्र")

    fun filterByCategory(category: String) {
        _selectedCategory.value = category
        applyFilters()
    }

    fun search(query: String) {
        _searchQuery.value = query
        applyFilters()
    }

    private fun applyFilters() {
        var result = allMantras

        if (_selectedCategory.value != "सभी") {
            result = result.filter { mantra ->
                when (_selectedCategory.value) {
                    "कर्म मंत्र" -> mantra.category.contains("कर्म") || KARMA_SADHANA.keys.any { mantra.category.contains(it) }
                    "तीर्थंकर मंत्र" -> mantra.category.contains("तीर्थंकर")
                    "हिंदू मंत्र" -> mantra.category.contains("गायत्री") || mantra.category.contains("गणेश") || mantra.category.contains("हनुमान") || mantra.category.contains("मृत्युंजय")
                    "नवग्रह मंत्र" -> mantra.category.contains("नवग्रह")
                    else -> true
                }
            }
        }

        if (_searchQuery.value.isNotBlank()) {
            val q = _searchQuery.value.lowercase()
            result = result.filter {
                it.category.lowercase().contains(q) ||
                    it.text.lowercase().contains(q) ||
                    it.karmaEffect.lowercase().contains(q)
            }
        }

        _mantras.value = result
    }

    private fun buildFullMantraList(): List<MantraEntry> {
        val list = mutableListOf<MantraEntry>()

        // Add mantras from MANTRAS data
        list.addAll(MANTRAS)

        // Add karma sadhana mantras
        KARMA_SADHANA.values.forEach { sadhana ->
            list.add(
                MantraEntry(
                    text = sadhana.primaryMantra.text,
                    recommendedCount = sadhana.primaryMantra.count,
                    timing = sadhana.primaryMantra.timing,
                    category = "कर्म मंत्र - ${sadhana.karmaHindi}",
                    karmaEffect = sadhana.primaryMantra.karmaEffect
                )
            )
        }

        // Add Tirthankara mantras
        TIRTHANKARAS.forEach { tirthankara ->
            list.add(
                MantraEntry(
                    text = tirthankara.mantra,
                    recommendedCount = 108,
                    timing = "प्रातःकाल देव-दर्शन के समय",
                    category = "तीर्थंकर मंत्र - ${tirthankara.hindiName}",
                    karmaEffect = tirthankara.pujaBenefit
                )
            )
        }

        return list.distinctBy { it.text }
    }
}
