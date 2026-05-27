package com.jainkundali.app

import android.app.Activity
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.os.Bundle
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast

/**
 * Last-resort error surface. Runs in its own ":crash" process and uses only platform Views (no
 * Compose, no app theme), so it can display an exception even when the crash originated in the
 * Compose/theme layer itself. The global handler in [JainKundaliApplication] launches this with the
 * full stack trace so the user can copy it and report the exact cause instead of the app silently
 * dying to the launcher.
 */
class CrashActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val trace = intent.getStringExtra(EXTRA_TRACE) ?: "अज्ञात त्रुटि (no trace)"

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.parseColor("#FFF8F0"))
            setPadding(40, 64, 40, 40)
        }

        val title = TextView(this).apply {
            text = "क्षमा करें — कुछ त्रुटि हुई"
            textSize = 20f
            setTextColor(Color.parseColor("#7A1F1F"))
            setTypeface(typeface, Typeface.BOLD)
        }

        val subtitle = TextView(this).apply {
            text = "कृपया नीचे का विवरण कॉपी करके डेवलपर को भेजें ताकि इसे स्थायी रूप से ठीक किया जा सके।"
            textSize = 14f
            setTextColor(Color.parseColor("#333333"))
            setPadding(0, 20, 0, 20)
        }

        val traceView = TextView(this).apply {
            text = trace
            textSize = 11f
            setTextColor(Color.parseColor("#222222"))
            setTextIsSelectable(true)
            typeface = Typeface.MONOSPACE
        }
        val scroll = ScrollView(this).apply { addView(traceView) }

        val copyButton = Button(this).apply {
            text = "विवरण कॉपी करें"
            setOnClickListener {
                val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                clipboard.setPrimaryClip(ClipData.newPlainText("JainKundali crash", trace))
                Toast.makeText(this@CrashActivity, "कॉपी हो गया", Toast.LENGTH_SHORT).show()
            }
        }

        val restartButton = Button(this).apply {
            text = "ऐप पुनः प्रारंभ करें"
            setOnClickListener {
                val launch = packageManager.getLaunchIntentForPackage(packageName)
                if (launch != null) {
                    launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
                    startActivity(launch)
                }
                finish()
                Runtime.getRuntime().exit(0)
            }
        }

        val buttonRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(0, 20, 0, 0)
            addView(copyButton)
            addView(restartButton)
        }

        root.addView(title)
        root.addView(subtitle)
        root.addView(
            scroll,
            LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f)
        )
        root.addView(buttonRow)

        setContentView(root)
    }

    companion object {
        const val EXTRA_TRACE = "extra_trace"
    }
}
