package com.jainkundali.app

import android.app.ActivityManager
import android.app.Application
import android.content.Context
import android.content.Intent
import android.os.Process
import android.util.Log
import com.jainkundali.app.di.AppContainer
import java.io.PrintWriter
import java.io.StringWriter
import kotlin.system.exitProcess

class JainKundaliApplication : Application() {
    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()

        // The dedicated crash process must not re-install the handler or open the database — it only
        // hosts CrashActivity to display the trace from the (now dead) main process.
        if (isCrashProcess()) return

        installCrashHandler()
        container = AppContainer(this)
    }

    private fun installCrashHandler() {
        val default = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
            Log.e("JainKundali", "Uncaught exception in thread ${thread.name}", throwable)
            try {
                val writer = StringWriter()
                throwable.printStackTrace(PrintWriter(writer))
                val header = "${throwable.javaClass.name}: ${throwable.message}\n\nThread: ${thread.name}\n\n"

                val intent = Intent(this, CrashActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
                    putExtra(CrashActivity.EXTRA_TRACE, header + writer.toString())
                }
                startActivity(intent)
            } catch (t: Throwable) {
                // If we somehow can't show the screen, fall back to the system handler so the crash
                // is at least recorded normally.
                Log.e("JainKundali", "Failed to launch CrashActivity", t)
                default?.uncaughtException(thread, throwable)
            } finally {
                Process.killProcess(Process.myPid())
                exitProcess(10)
            }
        }
    }

    private fun isCrashProcess(): Boolean {
        return try {
            val am = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            val name = am.runningAppProcesses?.firstOrNull { it.pid == Process.myPid() }?.processName
            name?.endsWith(":crash") == true
        } catch (_: Throwable) {
            false
        }
    }
}
