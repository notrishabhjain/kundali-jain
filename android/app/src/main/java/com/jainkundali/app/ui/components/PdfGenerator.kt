package com.jainkundali.app.ui.components

import android.content.Context
import android.content.Intent
import android.graphics.Paint
import android.graphics.pdf.PdfDocument
import android.net.Uri
import androidx.core.content.FileProvider
import com.jainkundali.app.domain.data.getKarmaSadhana
import com.jainkundali.app.domain.data.getDashaSadhana
import com.jainkundali.app.domain.models.*
import java.io.File
import java.io.FileOutputStream

object PdfGenerator {

    private const val PAGE_WIDTH = 595  // A4 width in points
    private const val PAGE_HEIGHT = 842 // A4 height in points
    private const val MARGIN = 50f
    private const val LINE_HEIGHT = 20f

    fun generateKundaliPdf(
        context: Context,
        profile: UserProfile,
        karmaStates: List<KarmaState>,
        predictions: List<LifeDomainPrediction>,
        remedy: CombinedRemedy?
    ): File? {
        return try {
            val document = PdfDocument()

            // Page 1: Header and birth details
            drawPage1(document, profile)

            // Page 2: Karma profile
            drawPage2(document, karmaStates)

            // Page 3: Predictions
            drawPage3(document, predictions)

            // Page 4: Remedies
            if (remedy != null) {
                drawPage4(document, remedy)
            }

            // Page 5: Dasha details
            drawPage5(document, profile.currentDasha)

            // Page 6: Yantra-Mantra-Tantra prescription
            val karmaSadhana = getKarmaSadhana(profile.dominantKarmaEn)
            drawPage6YantraPrescription(document, karmaSadhana)

            // Page 7: Personalized Sadhana Calendar
            drawPage7SadhanaCalendar(document, karmaSadhana, profile)

            val file = File(context.cacheDir, "kundali_${profile.name.replace(" ", "_")}.pdf")
            FileOutputStream(file).use { outputStream ->
                document.writeTo(outputStream)
            }
            document.close()
            file
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    fun sharePdf(context: Context, file: File) {
        try {
            val uri: Uri = FileProvider.getUriForFile(
                context,
                "${context.packageName}.fileprovider",
                file
            )
            val intent = Intent(Intent.ACTION_SEND).apply {
                type = "application/pdf"
                putExtra(Intent.EXTRA_STREAM, uri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            context.startActivity(Intent.createChooser(intent, "कुंडली शेयर करें"))
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun drawPage1(document: PdfDocument, profile: UserProfile) {
        val pageInfo = PdfDocument.PageInfo.Builder(PAGE_WIDTH, PAGE_HEIGHT, 1).create()
        val page = document.startPage(pageInfo)
        val canvas = page.canvas

        val titlePaint = Paint().apply {
            textSize = 24f
            isFakeBoldText = true
            textAlign = Paint.Align.CENTER
        }

        val headerPaint = Paint().apply {
            textSize = 16f
            isFakeBoldText = true
        }

        val bodyPaint = Paint().apply {
            textSize = 13f
        }

        var y = MARGIN + 40f

        canvas.drawText("जैन कुंडली", PAGE_WIDTH / 2f, y, titlePaint)
        y += 30f
        canvas.drawText("दिगम्बर जैन ज्योतिष", PAGE_WIDTH / 2f, y, titlePaint.apply { textSize = 14f })
        y += 50f

        headerPaint.textSize = 16f
        canvas.drawText("जन्म विवरण", MARGIN, y, headerPaint)
        y += 30f

        val details = listOf(
            "नाम: ${profile.name}",
            "जन्म तिथि: ${profile.formData.dob}",
            "जन्म समय: ${profile.formData.time}",
            "जन्म स्थान: ${profile.formData.place}",
            "लिंग: ${profile.gender}",
            "",
            "नक्षत्र: ${profile.birthNakshatraHindi}",
            "पाद: ${profile.nakshatraPada}",
            "राशि: ${profile.birthRashi}",
            "प्रकृति: ${profile.nakshatraNatureHindi}",
            "कर्म प्रकार: ${profile.dominantKarma}",
            "तीर्थंकर संबंध: ${profile.tirthankarAffinityHindi}",
            "गुणस्थान: ${profile.gunasthana}",
            "चन्द्र अंश: ${profile.moonLongitude}"
        )

        details.forEach { line ->
            canvas.drawText(line, MARGIN, y, bodyPaint)
            y += LINE_HEIGHT
        }

        document.finishPage(page)
    }

    private fun drawPage2(document: PdfDocument, karmaStates: List<KarmaState>) {
        val pageInfo = PdfDocument.PageInfo.Builder(PAGE_WIDTH, PAGE_HEIGHT, 2).create()
        val page = document.startPage(pageInfo)
        val canvas = page.canvas

        val headerPaint = Paint().apply {
            textSize = 18f
            isFakeBoldText = true
        }

        val subHeaderPaint = Paint().apply {
            textSize = 14f
            isFakeBoldText = true
        }

        val bodyPaint = Paint().apply {
            textSize = 12f
        }

        var y = MARGIN + 30f

        canvas.drawText("अष्ट कर्म प्रोफ़ाइल", MARGIN, y, headerPaint)
        y += 40f

        karmaStates.forEach { karma ->
            val stateLabel = when (karma.state) {
                "Udaya" -> "उदय"
                "Satta" -> "सत्ता"
                "Nirjara" -> "निर्जरा"
                else -> karma.state
            }
            canvas.drawText("${karma.karmaHindi} - तीव्रता: ${karma.intensity}% ($stateLabel)", MARGIN, y, subHeaderPaint)
            y += LINE_HEIGHT

            // Draw simple bar
            val barWidth = (PAGE_WIDTH - 2 * MARGIN) * karma.intensity / 100f
            val barPaint = Paint().apply { color = android.graphics.Color.rgb(255, 153, 51) }
            canvas.drawRect(MARGIN, y, MARGIN + barWidth, y + 8f, barPaint)
            y += 15f

            canvas.drawText(karma.manifestation.take(80), MARGIN + 10f, y, bodyPaint)
            y += LINE_HEIGHT + 10f
        }

        document.finishPage(page)
    }

    private fun drawPage3(document: PdfDocument, predictions: List<LifeDomainPrediction>) {
        val pageInfo = PdfDocument.PageInfo.Builder(PAGE_WIDTH, PAGE_HEIGHT, 3).create()
        val page = document.startPage(pageInfo)
        val canvas = page.canvas

        val headerPaint = Paint().apply {
            textSize = 18f
            isFakeBoldText = true
        }

        val subHeaderPaint = Paint().apply {
            textSize = 13f
            isFakeBoldText = true
        }

        val bodyPaint = Paint().apply {
            textSize = 11f
        }

        var y = MARGIN + 30f

        canvas.drawText("जीवन क्षेत्र भविष्यफल", MARGIN, y, headerPaint)
        y += 40f

        predictions.forEach { prediction ->
            val icon = if (prediction.isFavorable) "+" else "-"
            canvas.drawText("$icon ${prediction.hindiDomain}", MARGIN, y, subHeaderPaint)
            y += LINE_HEIGHT

            // Wrap long text into multiple lines
            val maxCharsPerLine = 70
            val text = prediction.prediction
            var startIdx = 0
            while (startIdx < text.length) {
                val endIdx = minOf(startIdx + maxCharsPerLine, text.length)
                canvas.drawText(text.substring(startIdx, endIdx), MARGIN + 10f, y, bodyPaint)
                y += LINE_HEIGHT - 4f
                startIdx = endIdx
            }
            y += 10f
        }

        document.finishPage(page)
    }

    private fun drawPage4(document: PdfDocument, remedy: CombinedRemedy) {
        val pageInfo = PdfDocument.PageInfo.Builder(PAGE_WIDTH, PAGE_HEIGHT, 4).create()
        val page = document.startPage(pageInfo)
        val canvas = page.canvas

        val headerPaint = Paint().apply {
            textSize = 18f
            isFakeBoldText = true
        }

        val subHeaderPaint = Paint().apply {
            textSize = 13f
            isFakeBoldText = true
        }

        val bodyPaint = Paint().apply {
            textSize = 12f
        }

        var y = MARGIN + 30f

        canvas.drawText("उपाय एवं साधना", MARGIN, y, headerPaint)
        y += 40f

        val sections = listOf(
            "प्रमुख साधना" to remedy.primarySadhana,
            "दशा उपाय" to remedy.dashaRemedy,
            "कर्म उपाय" to remedy.karmaRemedy,
            "यंत्र" to remedy.yantraRecommendation,
            "तपस्या" to remedy.tapasyaRecommendation,
            "शुभ तिथि" to remedy.recommendedTithi
        )

        sections.forEach { (title, content) ->
            canvas.drawText(title, MARGIN, y, subHeaderPaint)
            y += LINE_HEIGHT

            val maxCharsPerLine = 70
            var startIdx = 0
            while (startIdx < content.length) {
                val endIdx = minOf(startIdx + maxCharsPerLine, content.length)
                canvas.drawText(content.substring(startIdx, endIdx), MARGIN + 10f, y, bodyPaint)
                y += LINE_HEIGHT - 2f
                startIdx = endIdx
            }
            y += 15f
        }

        document.finishPage(page)
    }

    private fun drawPage5(document: PdfDocument, dasha: DashaInfo) {
        val pageInfo = PdfDocument.PageInfo.Builder(PAGE_WIDTH, PAGE_HEIGHT, 5).create()
        val page = document.startPage(pageInfo)
        val canvas = page.canvas

        val headerPaint = Paint().apply {
            textSize = 18f
            isFakeBoldText = true
        }

        val subHeaderPaint = Paint().apply {
            textSize = 14f
            isFakeBoldText = true
        }

        val bodyPaint = Paint().apply {
            textSize = 12f
        }

        var y = MARGIN + 30f

        canvas.drawText("दशा विवरण", MARGIN, y, headerPaint)
        y += 40f

        canvas.drawText("महादशा", MARGIN, y, subHeaderPaint)
        y += LINE_HEIGHT
        canvas.drawText("स्वामी: ${dasha.lordHindi}", MARGIN + 10f, y, bodyPaint)
        y += LINE_HEIGHT
        canvas.drawText("कुल वर्ष: ${dasha.yearsTotal}", MARGIN + 10f, y, bodyPaint)
        y += LINE_HEIGHT
        canvas.drawText("आरम्भ: ${dasha.startDate}", MARGIN + 10f, y, bodyPaint)
        y += LINE_HEIGHT
        canvas.drawText("समाप्ति: ${dasha.endDate}", MARGIN + 10f, y, bodyPaint)
        y += LINE_HEIGHT
        canvas.drawText("शेष वर्ष: ${String.format("%.1f", dasha.yearsRemaining)}", MARGIN + 10f, y, bodyPaint)
        y += 30f

        canvas.drawText("अंतर्दशा", MARGIN, y, subHeaderPaint)
        y += LINE_HEIGHT
        canvas.drawText("स्वामी: ${dasha.antardashaInfo.lordHindi}", MARGIN + 10f, y, bodyPaint)
        y += LINE_HEIGHT
        canvas.drawText("कुल वर्ष: ${String.format("%.1f", dasha.antardashaInfo.yearsTotal)}", MARGIN + 10f, y, bodyPaint)
        y += LINE_HEIGHT
        canvas.drawText("आरम्भ: ${dasha.antardashaInfo.startDate}", MARGIN + 10f, y, bodyPaint)
        y += LINE_HEIGHT
        canvas.drawText("समाप्ति: ${dasha.antardashaInfo.endDate}", MARGIN + 10f, y, bodyPaint)
        y += LINE_HEIGHT
        canvas.drawText("शेष वर्ष: ${String.format("%.1f", dasha.antardashaInfo.yearsRemaining)}", MARGIN + 10f, y, bodyPaint)
        y += 30f

        canvas.drawText("प्रत्यन्तर्दशा", MARGIN, y, subHeaderPaint)
        y += LINE_HEIGHT
        canvas.drawText("स्वामी: ${dasha.pratyantardasha.lordHindi}", MARGIN + 10f, y, bodyPaint)
        y += LINE_HEIGHT
        canvas.drawText("आरम्भ: ${dasha.pratyantardasha.startDate}", MARGIN + 10f, y, bodyPaint)
        y += LINE_HEIGHT
        canvas.drawText("समाप्ति: ${dasha.pratyantardasha.endDate}", MARGIN + 10f, y, bodyPaint)
        y += LINE_HEIGHT
        canvas.drawText("शेष दिन: ${dasha.pratyantardasha.daysRemaining}", MARGIN + 10f, y, bodyPaint)

        document.finishPage(page)
    }

    private fun drawPage6YantraPrescription(document: PdfDocument, sadhana: KarmaSadhana) {
        val pageInfo = PdfDocument.PageInfo.Builder(PAGE_WIDTH, PAGE_HEIGHT, 6).create()
        val page = document.startPage(pageInfo)
        val canvas = page.canvas

        val titlePaint = Paint().apply {
            textSize = 20f
            isFakeBoldText = true
            textAlign = Paint.Align.CENTER
        }

        val headerPaint = Paint().apply {
            textSize = 15f
            isFakeBoldText = true
        }

        val subHeaderPaint = Paint().apply {
            textSize = 13f
            isFakeBoldText = true
        }

        val bodyPaint = Paint().apply {
            textSize = 11f
        }

        var y = MARGIN + 30f

        canvas.drawText("यंत्र-मंत्र-तंत्र विधान", PAGE_WIDTH / 2f, y, titlePaint)
        y += 40f

        // Section 1: Yantra Vidhan
        canvas.drawText("यंत्र विधान", MARGIN, y, headerPaint)
        y += LINE_HEIGHT + 5f

        val yantraDetails = listOf(
            "नाम: ${sadhana.yantra.name}",
            "सामग्री: ${sadhana.yantra.material}",
            "स्थापना: ${sadhana.yantra.installation}",
            "माप: ${sadhana.yantra.dimension}",
            "प्रभाव: ${sadhana.yantra.effect}"
        )

        yantraDetails.forEach { line ->
            val maxCharsPerLine = 70
            var startIdx = 0
            while (startIdx < line.length) {
                val endIdx = minOf(startIdx + maxCharsPerLine, line.length)
                canvas.drawText(line.substring(startIdx, endIdx), MARGIN + 10f, y, bodyPaint)
                y += LINE_HEIGHT - 4f
                startIdx = endIdx
            }
            y += 4f
        }
        y += 15f

        // Section 2: Mantra Vidhan
        canvas.drawText("मंत्र विधान", MARGIN, y, headerPaint)
        y += LINE_HEIGHT + 5f

        val mantraDetails = listOf(
            "मंत्र: ${sadhana.primaryMantra.text}",
            "जाप संख्या: ${sadhana.primaryMantra.count}",
            "समय: ${sadhana.primaryMantra.timing}",
            "माला: ${sadhana.primaryMantra.maala}",
            "कर्म प्रभाव: ${sadhana.primaryMantra.karmaEffect}"
        )

        mantraDetails.forEach { line ->
            val maxCharsPerLine = 70
            var startIdx = 0
            while (startIdx < line.length) {
                val endIdx = minOf(startIdx + maxCharsPerLine, line.length)
                canvas.drawText(line.substring(startIdx, endIdx), MARGIN + 10f, y, bodyPaint)
                y += LINE_HEIGHT - 4f
                startIdx = endIdx
            }
            y += 4f
        }
        y += 15f

        // Section 3: Secondary Mantra
        canvas.drawText("द्वितीयक मंत्र", MARGIN, y, headerPaint)
        y += LINE_HEIGHT + 5f

        val shlokaText = if (sadhana.secondaryMantra.shloka.length > 60) {
            sadhana.secondaryMantra.shloka.substring(0, 60) + "..."
        } else {
            sadhana.secondaryMantra.shloka
        }

        val secondaryDetails = listOf(
            "स्तोत्र: ${sadhana.secondaryMantra.stotraName}",
            "श्लोक: $shlokaText",
            "जाप संख्या: ${sadhana.secondaryMantra.count}",
            "समय: ${sadhana.secondaryMantra.timing}"
        )

        secondaryDetails.forEach { line ->
            val maxCharsPerLine = 70
            var startIdx = 0
            while (startIdx < line.length) {
                val endIdx = minOf(startIdx + maxCharsPerLine, line.length)
                canvas.drawText(line.substring(startIdx, endIdx), MARGIN + 10f, y, bodyPaint)
                y += LINE_HEIGHT - 4f
                startIdx = endIdx
            }
            y += 4f
        }

        document.finishPage(page)
    }

    private fun drawPage7SadhanaCalendar(document: PdfDocument, sadhana: KarmaSadhana, profile: UserProfile) {
        val pageInfo = PdfDocument.PageInfo.Builder(PAGE_WIDTH, PAGE_HEIGHT, 7).create()
        val page = document.startPage(pageInfo)
        val canvas = page.canvas

        val titlePaint = Paint().apply {
            textSize = 20f
            isFakeBoldText = true
            textAlign = Paint.Align.CENTER
        }

        val headerPaint = Paint().apply {
            textSize = 15f
            isFakeBoldText = true
        }

        val subHeaderPaint = Paint().apply {
            textSize = 13f
            isFakeBoldText = true
        }

        val bodyPaint = Paint().apply {
            textSize = 11f
        }

        var y = MARGIN + 30f

        canvas.drawText("व्यक्तिगत साधना कैलेंडर", PAGE_WIDTH / 2f, y, titlePaint)
        y += 40f

        // Section 1: Shubha Tithis
        canvas.drawText("शुभ तिथियाँ", MARGIN, y, headerPaint)
        y += LINE_HEIGHT + 5f

        val tithiDescriptions = sadhana.shubhaTithi.map { tithi ->
            when {
                tithi <= 15 -> "शुक्ल $tithi"
                else -> "कृष्ण ${tithi - 15}"
            }
        }
        val tithiLine = "तिथि: ${tithiDescriptions.joinToString(", ")}"
        val maxCharsPerLine = 70
        var startIdx = 0
        while (startIdx < tithiLine.length) {
            val endIdx = minOf(startIdx + maxCharsPerLine, tithiLine.length)
            canvas.drawText(tithiLine.substring(startIdx, endIdx), MARGIN + 10f, y, bodyPaint)
            y += LINE_HEIGHT - 4f
            startIdx = endIdx
        }
        y += 15f

        // Section 2: Pratah Niyam
        canvas.drawText("प्रातः नियम", MARGIN, y, headerPaint)
        y += LINE_HEIGHT + 5f

        startIdx = 0
        while (startIdx < sadhana.pratahNiyam.length) {
            val endIdx = minOf(startIdx + maxCharsPerLine, sadhana.pratahNiyam.length)
            canvas.drawText(sadhana.pratahNiyam.substring(startIdx, endIdx), MARGIN + 10f, y, bodyPaint)
            y += LINE_HEIGHT - 4f
            startIdx = endIdx
        }
        y += 15f

        // Section 3: Saayam Niyam
        canvas.drawText("सायं नियम", MARGIN, y, headerPaint)
        y += LINE_HEIGHT + 5f

        startIdx = 0
        while (startIdx < sadhana.saayamNiyam.length) {
            val endIdx = minOf(startIdx + maxCharsPerLine, sadhana.saayamNiyam.length)
            canvas.drawText(sadhana.saayamNiyam.substring(startIdx, endIdx), MARGIN + 10f, y, bodyPaint)
            y += LINE_HEIGHT - 4f
            startIdx = endIdx
        }
        y += 15f

        // Section 4: Vishesh Upaya
        canvas.drawText("विशेष उपाय", MARGIN, y, headerPaint)
        y += LINE_HEIGHT + 5f

        startIdx = 0
        while (startIdx < sadhana.visheshUpaya.length) {
            val endIdx = minOf(startIdx + maxCharsPerLine, sadhana.visheshUpaya.length)
            canvas.drawText(sadhana.visheshUpaya.substring(startIdx, endIdx), MARGIN + 10f, y, bodyPaint)
            y += LINE_HEIGHT - 4f
            startIdx = endIdx
        }
        y += 15f

        // Section 5: Dasha Sadhana
        canvas.drawText("दशा साधना", MARGIN, y, headerPaint)
        y += LINE_HEIGHT + 5f

        val dashaSadhana = getDashaSadhana(profile.currentDasha.lord)
        val dashaSadhanaText = dashaSadhana.dashaSadhana
        startIdx = 0
        while (startIdx < dashaSadhanaText.length) {
            val endIdx = minOf(startIdx + maxCharsPerLine, dashaSadhanaText.length)
            canvas.drawText(dashaSadhanaText.substring(startIdx, endIdx), MARGIN + 10f, y, bodyPaint)
            y += LINE_HEIGHT - 4f
            startIdx = endIdx
        }
        y += 4f
        canvas.drawText("श्रेष्ठ तिथि: ${dashaSadhana.bestTithi}", MARGIN + 10f, y, bodyPaint)
        y += 15f + LINE_HEIGHT

        // Section 6: Puja Vidhan
        canvas.drawText("पूजा विधान", MARGIN, y, headerPaint)
        y += LINE_HEIGHT + 5f

        val pujaDetails = listOf(
            "पूजा: ${sadhana.puja.name}",
            "तीर्थंकर: ${sadhana.puja.tirthankara}",
            "तिथि: ${sadhana.puja.tithi}"
        )

        pujaDetails.forEach { line ->
            canvas.drawText(line, MARGIN + 10f, y, bodyPaint)
            y += LINE_HEIGHT
        }

        document.finishPage(page)
    }
}
