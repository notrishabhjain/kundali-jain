package com.jainkundali.app.data.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "meditation_sessions")
data class MeditationSessionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val profileId: Long,
    val durationMinutes: Int,
    val actualDurationSeconds: Long,
    val type: String,           // "silent", "mantra", "breath", "guided"
    val startTime: Long,
    val endTime: Long,
    val date: String,           // YYYY-MM-DD
    val completed: Boolean
)
