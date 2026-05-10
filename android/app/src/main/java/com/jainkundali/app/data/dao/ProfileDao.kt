package com.jainkundali.app.data.dao

import androidx.room.*
import com.jainkundali.app.data.entities.ProfileEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ProfileDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(profile: ProfileEntity): Long

    @Update
    suspend fun update(profile: ProfileEntity)

    @Delete
    suspend fun delete(profile: ProfileEntity)

    @Query("SELECT * FROM profiles ORDER BY createdAt DESC")
    fun getAll(): Flow<List<ProfileEntity>>

    @Query("SELECT * FROM profiles WHERE id = :id")
    suspend fun getById(id: Long): ProfileEntity?

    @Query("SELECT COUNT(*) FROM profiles")
    suspend fun getCount(): Int
}
