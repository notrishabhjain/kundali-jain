package com.jainkundali.app.domain.intelligence

import com.jainkundali.app.domain.models.DayContext
import com.jainkundali.app.domain.models.UserProfile

/**
 * Optional model enhancer (REFERENCE.md §3 "Rule-First, Model-Optional Architecture").
 *
 * No model is bundled in the APK — the kundali domain is deterministic and rules are authoritative.
 * This returns null so the final decision degrades gracefully to rule-only scoring. A future
 * downloadable weight file could populate this without any other code change.
 */
object Enhancer {
    suspend fun optionalModelScore(profile: UserProfile, day: DayContext, message: String): Double? {
        return null
    }
}
