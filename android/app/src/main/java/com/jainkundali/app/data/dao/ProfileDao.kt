package com.jainkundali.app.data.dao

import androidx.room.*
import com.jainkundali.app.data.entities.ProfileEntity
import kotlinx.coroutines.flow.Flow

@Dao
abstract class ProfileDao {

    // IGNORE (not REPLACE): on a unique-key conflict we must NOT delete+reinsert, because that
    // would mint a new id and orphan AppPreferences.selectedProfileId / linked anushthaans.
    @Insert(onConflict = OnConflictStrategy.IGNORE)
    abstract suspend fun insertIgnore(profile: ProfileEntity): Long

    @Update
    abstract suspend fun update(profile: ProfileEntity)

    @Query("UPDATE profiles SET deletedAt = :timestamp WHERE id = :id")
    abstract suspend fun softDelete(id: Long, timestamp: Long)

    // Active profiles only — soft-deleted rows are hidden everywhere in the UI.
    @Query("SELECT * FROM profiles WHERE deletedAt IS NULL ORDER BY createdAt DESC")
    abstract fun getAll(): Flow<List<ProfileEntity>>

    @Query("SELECT * FROM profiles WHERE id = :id AND deletedAt IS NULL")
    abstract suspend fun getById(id: Long): ProfileEntity?

    // Natural-key lookup deliberately ignores deletedAt so a re-created person revives their row
    // instead of colliding with the unique index.
    @Query("SELECT * FROM profiles WHERE name = :name AND dateOfBirth = :dob AND birthPlace = :place LIMIT 1")
    abstract suspend fun findByNaturalKey(name: String, dob: String, place: String): ProfileEntity?

    @Query("SELECT COUNT(*) FROM profiles WHERE deletedAt IS NULL")
    abstract suspend fun getCount(): Int

    /**
     * Single source of truth for persisting a profile. Atomic: the find + insert/update run inside
     * one transaction, so two concurrent callers can never produce two rows for the same person.
     * Returns the id of the canonical row.
     *
     * Declared in abstract class (not interface) so Room's @Transaction suspend wrapper generates
     * correctly — interface default suspend methods have unreliable code-gen in Room 2.6.x.
     */
    @Transaction
    open suspend fun findOrCreate(profile: ProfileEntity): Long {
        val existing = findByNaturalKey(profile.name, profile.dateOfBirth, profile.birthPlace)
        if (existing != null) {
            // Refresh the mutable details (time/coords/gender) and revive if it was soft-deleted.
            update(
                existing.copy(
                    birthTime = profile.birthTime,
                    latitude = profile.latitude,
                    longitude = profile.longitude,
                    gender = profile.gender,
                    deletedAt = null
                )
            )
            return existing.id
        }
        val id = insertIgnore(profile)
        if (id != -1L) return id
        // Lost an insert race with another transaction — return the row it created.
        return findByNaturalKey(profile.name, profile.dateOfBirth, profile.birthPlace)?.id ?: 0L
    }
}
