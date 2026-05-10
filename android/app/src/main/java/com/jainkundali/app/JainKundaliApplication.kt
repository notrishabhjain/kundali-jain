package com.jainkundali.app

import android.app.Application
import com.jainkundali.app.di.AppContainer

class JainKundaliApplication : Application() {
    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
    }
}
