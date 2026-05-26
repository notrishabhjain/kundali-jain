package com.jainkundali.app.domain.intelligence

import com.jainkundali.app.domain.models.DayContext
import com.jainkundali.app.domain.models.UserProfile
import kotlinx.coroutines.withTimeoutOrNull

/**
 * Combines the rule score with an optional model score (REFERENCE.md §3):
 *
 *     finalScore = (ruleScore × 0.7 + modelScore × 0.3) / (0.7 + 0.3)
 *
 * The model call is bounded by a hard 500 ms timeout; on timeout / null / failure we fall back to
 * the rule-only decision so the app never blocks or fails because of the optional layer.
 */
object FinalDecision {

    private const val RULE_WEIGHT = 0.7
    private const val MODEL_WEIGHT = 0.3
    private const val MODEL_TIMEOUT_MS = 500L

    suspend fun build(profile: UserProfile, day: DayContext, message: String): IntelligenceDecision {
        val base = RuleScoring.calculate(profile, day, message)

        val modelScore: Double? = try {
            withTimeoutOrNull(MODEL_TIMEOUT_MS) {
                Enhancer.optionalModelScore(profile, day, message)
            }
        } catch (e: Exception) {
            null
        }

        if (modelScore == null || modelScore.isNaN()) {
            return base
        }

        val finalScore =
            (base.ruleScore * RULE_WEIGHT + modelScore * MODEL_WEIGHT) / (RULE_WEIGHT + MODEL_WEIGHT)

        return base.copy(
            modelScore = modelScore,
            finalScore = finalScore,
            fallbackUsed = false,
            priority = RuleScoring.priorityFor(finalScore)
        )
    }
}
