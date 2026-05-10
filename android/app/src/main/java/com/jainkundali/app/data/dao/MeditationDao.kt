package com.jainkundali.app.data.dao

import androidx.room.*
import com.jainkundali.app.data.entities.MeditationSessionEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface MeditationDao {
    @Insert
    suspend fun insert(session: MeditationSessionEntity): Long

    @Query("SELECT * FROM meditation_sessions WHERE profileId = :profileId ORDER BY startTime DESC")
    fun getByProfileId(profileId: Long): Flow<List<MeditationSessionEntity>>

    @Query("SELECT * FROM meditation_sessions ORDER BY startTime DESC")
    fun getAll(): Flow<List<MeditationSessionEntity>>

    @Query("SELECT * FROM meditation_sessions ORDER BY startTime DESC LIMIT :limit")
    fun getRecent(limit: Int = 20): Flow<List<MeditationSessionEntity>>

    @Query("SELECT DISTINCT date FROM meditation_sessions WHERE completed = 1 ORDER BY date DESC")
    suspend fun getCompletedDates(): List<String>

    @Query("SELECT * FROM meditation_sessions WHERE date BETWEEN :startDate AND :endDate ORDER BY startTime")
    fun getSessionsForDateRange(startDate: String, endDate: String): Flow<List<MeditationSessionEntity>>

    @Query("SELECT SUM(actualDurationSeconds) FROM meditation_sessions WHERE completed = 1")
    suspend fun getTotalMeditationSeconds(): Long?
}
