package com.jainkundali.app.data.repository

import com.jainkundali.app.data.dao.AnushthaanDao
import com.jainkundali.app.data.entities.AnushthaanEntity
import kotlinx.coroutines.flow.Flow

class AnushthaanRepository(private val anushthaanDao: AnushthaanDao) {

    fun getByProfileId(profileId: Long): Flow<List<AnushthaanEntity>> {
        return anushthaanDao.getByProfileId(profileId)
    }

    suspend fun getActiveByProfileId(profileId: Long): List<AnushthaanEntity> {
        return anushthaanDao.getActiveByProfileId(profileId)
    }

    suspend fun insert(anushthaan: AnushthaanEntity): Long {
        return anushthaanDao.insert(anushthaan)
    }

    suspend fun update(anushthaan: AnushthaanEntity) {
        anushthaanDao.update(anushthaan)
    }

    suspend fun delete(anushthaan: AnushthaanEntity) {
        anushthaanDao.delete(anushthaan)
    }

    suspend fun markDayCompleted(id: Long, date: String) {
        anushthaanDao.markDayCompleted(id, date)
    }
}
