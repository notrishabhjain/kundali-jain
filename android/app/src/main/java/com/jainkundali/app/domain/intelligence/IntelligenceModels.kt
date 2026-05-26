package com.jainkundali.app.domain.intelligence

/**
 * Rule-first decision layer (see REFERENCE.md §3 "AI / ML Decisions").
 *
 * The kundali domain is deterministic — a chart must be reproducible — so "intelligence" here is a
 * transparent, rule-first scorer, never a black-box model. The model is an OPTIONAL enhancer; the
 * app must work at 100% capability with rules alone (graceful degradation).
 */

enum class DecisionPriority { URGENT, HIGH, MEDIUM, LOW }

/** A single interpretable rule signal. polarity = +1 raises sādhana priority, -1 lowers it. */
data class IntelligenceSignal(
    val key: String,
    val label: String,        // Devanagari label shown in the decision trace
    val weight: Double,       // 0..1 contribution magnitude
    val polarity: Int,        // +1 positive (karmic intensity), -1 negative (favourable)
    val matched: Boolean,
    val detail: String        // why this signal fired, in Hindi
)

/**
 * The auditable output. Mirrors the web app's IntelligenceDecision so both codebases stay
 * conceptually parallel.
 */
data class IntelligenceDecision(
    val ruleScore: Double,
    val modelScore: Double?,      // null when no model contributed
    val finalScore: Double,
    val fallbackUsed: Boolean,    // true = rules only (no model)
    val reasonCodes: List<String>,
    val signals: List<IntelligenceSignal>,
    val priority: DecisionPriority
) {
    val matchedSignals: List<IntelligenceSignal> get() = signals.filter { it.matched }
}
