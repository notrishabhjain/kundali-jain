package com.jainkundali.app.domain.engine

/**
 * Digambar doctrinal guard. The app must never promise mokṣa in the present Pancham Kaal (5th ara,
 * दुषमा). This is the single source of truth for that doctrine and a scrubber that strips any
 * accidental mokṣa-promising phrasing from generated narrative text.
 */
object PanchamKaalGuard {

    val allowedGoals: List<String> = listOf("सम्यग्दर्शन", "पुण्य बन्ध", "देव-गति")

    val statement: String =
        "हम पंचम काल (दुषमा) में हैं। इस काल में मोक्ष सम्भव नहीं है, किन्तु सम्यग्दर्शन, " +
            "पुण्य-बन्ध और देव-गति (शुभ गति) का मार्ग सम्भव है। आपकी साधना का लक्ष्य यही है।"

    /**
     * Defensive scrub: rewrites any phrase that claims mokṣa/nirvana is attainable now into the
     * doctrinally correct "samyag-darshan / shubh-gati" framing. Safe to run on any narrative string.
     */
    fun sanitizeNarrative(text: String): String {
        if (text.isBlank()) return text
        var out = text
        // "मोक्ष की प्राप्ति/मोक्ष प्राप्त होगा" style claims → shubh-gati framing
        out = out.replace(Regex("मोक्ष\\s*(की\\s*प्राप्ति|प्राप्त\\s*होगा|प्राप्त\\s*होगी|मिलेगा|मिलेगी)"),
            "सम्यग्दर्शन एवं शुभ गति का बन्ध")
        out = out.replace(Regex("निर्वाण\\s*(की\\s*प्राप्ति|प्राप्त\\s*होगा|प्राप्त\\s*होगी)"),
            "शुभ गति का बन्ध")
        return out
    }
}
