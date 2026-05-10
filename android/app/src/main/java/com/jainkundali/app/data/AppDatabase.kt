package com.jainkundali.app.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.jainkundali.app.data.dao.JaapDao
import com.jainkundali.app.data.dao.MeditationDao
import com.jainkundali.app.data.dao.ProfileDao
import com.jainkundali.app.data.entities.JaapSessionEntity
import com.jainkundali.app.data.entities.MeditationSessionEntity
import com.jainkundali.app.data.entities.ProfileEntity

@Database(
    entities = [
        ProfileEntity::class,
        JaapSessionEntity::class,
        MeditationSessionEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun profileDao(): ProfileDao
    abstract fun jaapDao(): JaapDao
    abstract fun meditationDao(): MeditationDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "jain_kundali_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
