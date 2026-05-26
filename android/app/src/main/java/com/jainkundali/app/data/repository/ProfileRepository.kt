package com.jainkundali.app.data.repository

import com.jainkundali.app.data.dao.ProfileDao
import com.jainkundali.app.data.entities.ProfileEntity
import kotlinx.coroutines.flow.Flow

class ProfileRepository(private val profileDao: ProfileDao) {

    val allProfiles: Flow<List<ProfileEntity>> = profileDao.getAll()

    /**
     * Idempotent persist. Returns the canonical profile id whether the person already existed
     * or was newly created. Safe to call repeatedly / concurrently — never duplicates.
     */
    suspend fun upsert(profile: ProfileEntity): Long {
        return profileDao.findOrCreate(profile)
    }

    suspend fun update(profile: ProfileEntity) {
        profileDao.update(profile)
    }

    /** Soft delete — preserves the row so history and re-creation (revive) keep working. */
    suspend fun delete(profile: ProfileEntity) {
        profileDao.softDelete(profile.id, System.currentTimeMillis())
    }

    suspend fun getById(id: Long): ProfileEntity? {
        return profileDao.getById(id)
    }

    suspend fun getCount(): Int {
        return profileDao.getCount()
    }
}
