package com.jainkundali.app.data.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "profiles")
data class ProfileEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val dateOfBirth: String,    // YYYY-MM-DD
    val birthTime: String,      // HH:MM
    val birthPlace: String,
    val latitude: Double,
    val longitude: Double,
    val gender: String,
    val createdAt: Long = System.currentTimeMillis()
)
