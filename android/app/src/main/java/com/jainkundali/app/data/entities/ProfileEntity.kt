package com.jainkundali.app.data.entities

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "profiles",
    // Natural key: a person is uniquely identified by name + date + place of birth.
    // A unique index makes duplicate inserts impossible even under a race — the DB itself
    // rejects the second insert, so the find-or-create transaction can resolve to one row.
    indices = [
        Index(value = ["name", "dateOfBirth", "birthPlace"], unique = true)
    ]
)
data class ProfileEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val dateOfBirth: String,    // YYYY-MM-DD
    val birthTime: String,      // HH:MM
    val birthPlace: String,
    val latitude: Double,
    val longitude: Double,
    val gender: String,
    val createdAt: Long = System.currentTimeMillis(),
    // Soft delete: never hard-delete user data. Null = active, non-null = deleted-at timestamp.
    val deletedAt: Long? = null
)
