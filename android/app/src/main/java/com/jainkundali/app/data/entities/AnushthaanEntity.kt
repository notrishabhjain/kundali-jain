package com.jainkundali.app.data.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "anushthaans")
data class AnushthaanEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val profileId: Long,
    val type: String,           // "40-day", "21-day", "9-day"
    val totalDays: Int,
    val completedDays: Int,
    val startDate: String,
    val mantraText: String,
    val mantraCount: Int,
    val status: String,         // "active", "completed", "missed"
    val lastCompletedDate: String? = null
)
