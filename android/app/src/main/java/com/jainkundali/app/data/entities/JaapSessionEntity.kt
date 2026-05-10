package com.jainkundali.app.data.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "jaap_sessions")
data class JaapSessionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val profileId: Long,
    val mantraName: String,
    val mantraText: String,
    val targetCount: Int,
    val completedCount: Int,
    val malasCompleted: Int,    // completedCount / 108
    val startTime: Long,
    val endTime: Long,
    val date: String            // YYYY-MM-DD
)
