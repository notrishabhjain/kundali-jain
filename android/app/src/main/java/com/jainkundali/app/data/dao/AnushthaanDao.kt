package com.jainkundali.app.data.dao

import androidx.room.*
import com.jainkundali.app.data.entities.AnushthaanEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface AnushthaanDao {
    @Insert
    suspend fun insert(anushthaan: AnushthaanEntity): Long

    @Update
    suspend fun update(anushthaan: AnushthaanEntity)

    @Delete
    suspend fun delete(anushthaan: AnushthaanEntity)

    @Query("SELECT * FROM anushthaans WHERE profileId = :profileId ORDER BY startDate DESC")
    fun getByProfileId(profileId: Long): Flow<List<AnushthaanEntity>>

    @Query("SELECT * FROM anushthaans WHERE profileId = :profileId AND status = 'active'")
    suspend fun getActiveByProfileId(profileId: Long): List<AnushthaanEntity>

    @Query("UPDATE anushthaans SET completedDays = completedDays + 1, lastCompletedDate = :date, status = CASE WHEN completedDays + 1 >= totalDays THEN 'completed' ELSE status END WHERE id = :id")
    suspend fun markDayCompleted(id: Long, date: String)
}
