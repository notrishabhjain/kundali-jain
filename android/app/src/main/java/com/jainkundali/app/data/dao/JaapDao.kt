package com.jainkundali.app.data.dao

import androidx.room.*
import com.jainkundali.app.data.entities.JaapSessionEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface JaapDao {
    @Insert
    suspend fun insert(session: JaapSessionEntity): Long

    @Query("SELECT * FROM jaap_sessions WHERE profileId = :profileId ORDER BY startTime DESC")
    fun getByProfileId(profileId: Long): Flow<List<JaapSessionEntity>>

    @Query("SELECT * FROM jaap_sessions ORDER BY startTime DESC")
    fun getAll(): Flow<List<JaapSessionEntity>>

    @Query("SELECT * FROM jaap_sessions ORDER BY startTime DESC LIMIT :limit")
    fun getRecent(limit: Int = 20): Flow<List<JaapSessionEntity>>

    @Query("SELECT SUM(completedCount) FROM jaap_sessions WHERE mantraName = :mantraName")
    suspend fun getTotalCountByMantra(mantraName: String): Int?

    @Query("SELECT * FROM jaap_sessions WHERE date = :date ORDER BY startTime DESC")
    fun getSessionsForDate(date: String): Flow<List<JaapSessionEntity>>

    @Query("SELECT SUM(completedCount) FROM jaap_sessions")
    suspend fun getTotalJaapCount(): Int?

    @Query("SELECT SUM(malasCompleted) FROM jaap_sessions")
    suspend fun getTotalMalas(): Int?
}
