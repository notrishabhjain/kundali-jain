package com.jainkundali.app.data.repository

import com.jainkundali.app.data.dao.JaapDao
import com.jainkundali.app.data.dao.MeditationDao
import com.jainkundali.app.data.entities.JaapSessionEntity
import com.jainkundali.app.data.entities.MeditationSessionEntity
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class SadhanaRepository(
    private val jaapDao: JaapDao,
    private val meditationDao: MeditationDao
) {
    // Jaap
    val allJaapSessions: Flow<List<JaapSessionEntity>> = jaapDao.getAll()

    fun getRecentJaapSessions(limit: Int = 20): Flow<List<JaapSessionEntity>> = jaapDao.getRecent(limit)

    suspend fun saveJaapSession(session: JaapSessionEntity): Long {
        return jaapDao.insert(session)
    }

    suspend fun getTotalJaapCount(): Int {
        return jaapDao.getTotalJaapCount() ?: 0
    }

    suspend fun getTotalMalas(): Int {
        return jaapDao.getTotalMalas() ?: 0
    }

    suspend fun getTotalCountByMantra(mantraName: String): Int {
        return jaapDao.getTotalCountByMantra(mantraName) ?: 0
    }

    // Meditation
    val allMeditationSessions: Flow<List<MeditationSessionEntity>> = meditationDao.getAll()

    fun getRecentMeditationSessions(limit: Int = 20): Flow<List<MeditationSessionEntity>> = meditationDao.getRecent(limit)

    suspend fun saveMeditationSession(session: MeditationSessionEntity): Long {
        return meditationDao.insert(session)
    }

    suspend fun getTotalMeditationMinutes(): Long {
        return (meditationDao.getTotalMeditationSeconds() ?: 0L) / 60
    }

    suspend fun getMeditationStreak(): Int {
        val completedDates = meditationDao.getCompletedDates()
        if (completedDates.isEmpty()) return 0

        val formatter = DateTimeFormatter.ISO_LOCAL_DATE
        val today = LocalDate.now()
        var streak = 0
        var checkDate = today

        for (dateStr in completedDates) {
            val date = LocalDate.parse(dateStr, formatter)
            if (date == checkDate || date == checkDate.minusDays(1)) {
                streak++
                checkDate = date.minusDays(1)
            } else {
                break
            }
        }
        return streak
    }
}
