package com.jainkundali.app.data.repository

import com.jainkundali.app.data.dao.ProfileDao
import com.jainkundali.app.data.entities.ProfileEntity
import kotlinx.coroutines.flow.Flow

class ProfileRepository(private val profileDao: ProfileDao) {

    val allProfiles: Flow<List<ProfileEntity>> = profileDao.getAll()

    suspend fun insert(profile: ProfileEntity): Long {
        return profileDao.insert(profile)
    }

    suspend fun update(profile: ProfileEntity) {
        profileDao.update(profile)
    }

    suspend fun delete(profile: ProfileEntity) {
        profileDao.delete(profile)
    }

    suspend fun getById(id: Long): ProfileEntity? {
        return profileDao.getById(id)
    }

    suspend fun getCount(): Int {
        return profileDao.getCount()
    }
}
