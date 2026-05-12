package com.jainkundali.app

import android.app.Application
import android.util.Log
import com.jainkundali.app.di.AppContainer

class JainKundaliApplication : Application() {
    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        val previousHandler = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
            Log.e("JainKundali", "Uncaught exception in thread ${thread.name}", throwable)
            // Chain to previous handler (system default) for proper crash reporting
            previousHandler?.uncaughtException(thread, throwable)
        }
        container = AppContainer(this)
    }
}
