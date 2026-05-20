package com.jainkundali.app.ui.components

import android.content.Context
import android.content.Intent
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import android.graphics.pdf.PdfDocument
import android.net.Uri
import android.text.Layout
import android.text.StaticLayout
import android.text.TextPaint
import androidx.core.content.FileProvider
import com.jainkundali.app.domain.data.getDashaSadhana
import com.jainkundali.app.domain.data.getKarmaSadhana
import com.jainkundali.app.domain.models.*
import java.io.File
import java.io.FileOutputStream

/**
 * PDF generator that:
 *  - Uses TextPaint + StaticLayout so Devanagari conjuncts are shaped correctly and lines
 *    wrap by actual glyph width (no more `substring(start, end)` mid-grapheme breaks).
 *  - Auto-spills onto a new page when content exceeds the current page height.
 *  - Outputs every section the user can see in the app (नक्षत्र, राशि, तीर्थंकर, अष्ट कर्म,
 *    भविष्यफल, उपाय, दशा, यंत्र-मंत्र-तंत्र, अनुष्ठान, पंचम काल).
 */
object PdfGenerator {

    private const val PAGE_WIDTH = 595   // A4 width in points
    private const val PAGE_HEIGHT = 842  // A4 height in points
    private const val MARGIN_X = 40f
    private const val MARGIN_Y = 50f

    private val contentWidth: Int get() = (PAGE_WIDTH - 2 * MARGIN_X).toInt()

    fun generateKundaliPdf(
        context: Context,
        profile: UserProfile,
        karmaStates: List<KarmaState>,
        predictions: List<LifeDomainPrediction>,
        remedy: CombinedRemedy?
    ): File? {
        return try {
            val document = PdfDocument()
            val ctx = PdfContext(document)

            renderCoverPage(ctx, profile)
            renderBirthDetails(ctx, profile)
            renderKarmaProfile(ctx, karmaStates)
            renderPredictions(ctx, predictions)
            if (remedy != null) renderRemedies(ctx, remedy)
            renderDashaDetails(ctx, profile.currentDasha)
            renderYantraMantraTantra(ctx, profile)
            renderSadhanaCalendar(ctx, profile)
            renderPanchamKaalNote(ctx)

            ctx.finishCurrentPage()

            val safeName = profile.name.replace(Regex("[^\\p{L}\\p{N}]+"), "_").ifBlank { "Report" }
            val file = File(context.cacheDir, "kundali_${safeName}.pdf")
            FileOutputStream(file).use { document.writeTo(it) }
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

    // ─────────── Drawing primitives ─────────────────────────────────────────────

    /** Mutable rendering cursor — tracks current page, y position, and page-number. */
    private class PdfContext(val document: PdfDocument) {
        private var pageNum: Int = 0
        var page: PdfDocument.Page = newPage()
            private set
        var canvas: Canvas = page.canvas
            private set
        var y: Float = MARGIN_Y
            private set

        private val pageBottom: Float get() = PAGE_HEIGHT - MARGIN_Y - 20f // leave room for footer

        private fun newPage(): PdfDocument.Page {
            pageNum += 1
            val info = PdfDocument.PageInfo.Builder(PAGE_WIDTH, PAGE_HEIGHT, pageNum).create()
            return document.startPage(info)
        }

        fun finishCurrentPage() {
            drawFooter()
            document.finishPage(page)
        }

        fun startNewPage() {
            drawFooter()
            document.finishPage(page)
            page = newPage()
            canvas = page.canvas
            y = MARGIN_Y
        }

        fun ensureSpace(height: Float) {
            if (y + height > pageBottom) startNewPage()
        }

        fun advanceY(delta: Float) {
            y += delta
        }

        private fun drawFooter() {
            val footerPaint = TextPaint().apply {
                color = Color.GRAY
                textSize = 9f
                isAntiAlias = true
                typeface = devanagariTypeface()
            }
            canvas.drawText(
                "जैन कुंडली • पृष्ठ $pageNum",
                MARGIN_X,
                (PAGE_HEIGHT - 20f),
                footerPaint
            )
            canvas.drawText(
                "दिगम्बर परम्परा अनुसार",
                PAGE_WIDTH - MARGIN_X - 140f,
                (PAGE_HEIGHT - 20f),
                footerPaint
            )
        }
    }

    /** Best-effort Devanagari-capable typeface. `Typeface.DEFAULT` falls back to the
     *  device's system font which supports Devanagari on all modern Android (8.0+). */
    private fun devanagariTypeface(bold: Boolean = false): Typeface {
        return Typeface.create(Typeface.DEFAULT, if (bold) Typeface.BOLD else Typeface.NORMAL)
    }

    private fun titlePaint(size: Float = 22f) = TextPaint().apply {
        color = Color.rgb(180, 83, 9) // amber-700
        textSize = size
        isAntiAlias = true
        isFakeBoldText = true
        typeface = devanagariTypeface(bold = true)
        textAlign = Paint.Align.CENTER
    }

    private fun headerPaint(size: Float = 16f) = TextPaint().apply {
        color = Color.rgb(120, 53, 15) // amber-900
        textSize = size
        isAntiAlias = true
        isFakeBoldText = true
        typeface = devanagariTypeface(bold = true)
    }

    private fun subHeaderPaint(size: Float = 13f) = TextPaint().apply {
        color = Color.rgb(67, 20, 7) // orange-950
        textSize = size
        isAntiAlias = true
        isFakeBoldText = true
        typeface = devanagariTypeface(bold = true)
    }

    private fun bodyPaint(size: Float = 11.5f, color: Int = Color.rgb(40, 40, 40)) = TextPaint().apply {
        this.color = color
        textSize = size
        isAntiAlias = true
        typeface = devanagariTypeface()
    }

    /** Draw a text block that wraps to fit page width and spills onto next page if needed. */
    private fun drawWrappedText(
        ctx: PdfContext,
        text: String,
        paint: TextPaint,
        leftIndent: Float = 0f,
        bottomMargin: Float = 6f
    ) {
        if (text.isBlank()) return
        val width = (contentWidth - leftIndent.toInt()).coerceAtLeast(50)
        val layout = buildLayout(text, paint, width)
        // If layout fits, draw on current page; otherwise draw line-by-line spilling pages.
        if (ctx.y + layout.height + bottomMargin <= PAGE_HEIGHT - MARGIN_Y - 20f) {
            ctx.canvas.save()
            ctx.canvas.translate(MARGIN_X + leftIndent, ctx.y)
            layout.draw(ctx.canvas)
            ctx.canvas.restore()
            ctx.advanceY(layout.height + bottomMargin)
        } else {
            // Spill across pages: render line-by-line, breaking at line boundaries.
            for (lineIdx in 0 until layout.lineCount) {
                val lineHeight = (layout.getLineBottom(lineIdx) - layout.getLineTop(lineIdx)).toFloat()
                ctx.ensureSpace(lineHeight)
                val start = layout.getLineStart(lineIdx)
                val end = layout.getLineEnd(lineIdx)
                val line = text.substring(start, end).trimEnd('\n')
                ctx.canvas.drawText(line, MARGIN_X + leftIndent, ctx.y + paint.textSize, paint)
                ctx.advanceY(lineHeight)
            }
            ctx.advanceY(bottomMargin)
        }
    }

    @Suppress("DEPRECATION")
    private fun buildLayout(text: String, paint: TextPaint, width: Int): StaticLayout {
        return if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            StaticLayout.Builder.obtain(text, 0, text.length, paint, width)
                .setAlignment(Layout.Alignment.ALIGN_NORMAL)
                .setLineSpacing(2f, 1f)
                .setIncludePad(false)
                .build()
        } else {
            StaticLayout(text, paint, width, Layout.Alignment.ALIGN_NORMAL, 1f, 2f, false)
        }
    }

    private fun drawDivider(ctx: PdfContext) {
        ctx.ensureSpace(12f)
        val p = Paint().apply { color = Color.rgb(229, 231, 235); strokeWidth = 1f }
        ctx.canvas.drawLine(MARGIN_X, ctx.y, PAGE_WIDTH - MARGIN_X, ctx.y, p)
        ctx.advanceY(10f)
    }

    private fun drawSectionTitle(ctx: PdfContext, title: String) {
        ctx.ensureSpace(40f)
        ctx.advanceY(8f)
        val paint = headerPaint(15f)
        val width = paint.measureText(title)
        ctx.canvas.drawText(title, MARGIN_X, ctx.y + paint.textSize, paint)
        // underline accent
        val underline = Paint().apply { color = Color.rgb(217, 119, 6); strokeWidth = 1.5f }
        ctx.canvas.drawLine(
            MARGIN_X,
            ctx.y + paint.textSize + 3f,
            MARGIN_X + width.coerceAtMost(contentWidth.toFloat()),
            ctx.y + paint.textSize + 3f,
            underline
        )
        ctx.advanceY(paint.textSize + 14f)
    }

    private fun drawLabelValue(ctx: PdfContext, label: String, value: String) {
        val text = "$label: $value"
        drawWrappedText(ctx, text, bodyPaint(), leftIndent = 6f, bottomMargin = 4f)
    }

    private fun drawIntensityBar(ctx: PdfContext, intensity: Int) {
        val barHeight = 6f
        val maxWidth = contentWidth.toFloat() - 60f
        val fillWidth = maxWidth * intensity / 100f
        val barY = ctx.y
        val bgPaint = Paint().apply { color = Color.rgb(255, 237, 213) }
        val fillPaint = Paint().apply {
            color = when {
                intensity >= 70 -> Color.rgb(220, 38, 38) // red-600
                intensity >= 40 -> Color.rgb(234, 88, 12) // orange-600
                else -> Color.rgb(5, 150, 105) // emerald-600
            }
        }
        ctx.canvas.drawRect(MARGIN_X + 6f, barY, MARGIN_X + 6f + maxWidth, barY + barHeight, bgPaint)
        ctx.canvas.drawRect(MARGIN_X + 6f, barY, MARGIN_X + 6f + fillWidth, barY + barHeight, fillPaint)
        ctx.advanceY(barHeight + 6f)
    }

    // ─────────── Page sections ─────────────────────────────────────────────────

    private fun renderCoverPage(ctx: PdfContext, profile: UserProfile) {
        ctx.advanceY(60f)
        ctx.canvas.drawText("॥ जय जिनेन्द्र ॥", PAGE_WIDTH / 2f, ctx.y, titlePaint(16f))
        ctx.advanceY(30f)
        ctx.canvas.drawText("दिगम्बर जैन कुंडली", PAGE_WIDTH / 2f, ctx.y, titlePaint(26f))
        ctx.advanceY(30f)
        ctx.canvas.drawText("कर्म-विश्लेषण एवं साधना-मार्ग", PAGE_WIDTH / 2f, ctx.y, titlePaint(13f))
        ctx.advanceY(50f)

        val center = TextPaint().apply {
            color = Color.rgb(120, 53, 15); textSize = 14f; isAntiAlias = true
            typeface = devanagariTypeface(bold = true); textAlign = Paint.Align.CENTER
        }
        ctx.canvas.drawText(profile.name, PAGE_WIDTH / 2f, ctx.y, center)
        ctx.advanceY(22f)
        ctx.canvas.drawText(
            "${profile.formData.dob} • ${profile.formData.time} • ${profile.formData.place}",
            PAGE_WIDTH / 2f, ctx.y,
            TextPaint().apply {
                color = Color.rgb(120, 53, 15); textSize = 11f; isAntiAlias = true
                typeface = devanagariTypeface(); textAlign = Paint.Align.CENTER
            }
        )
        ctx.advanceY(40f)
        drawDivider(ctx)
        ctx.advanceY(10f)

        val note = "यह कुंडली ज्योतिषीय नहीं, अपितु आत्म-निरीक्षण और कर्म-निर्जरा का मार्गदर्शक है। दिगम्बर परम्परा अनुसार पंचम काल में मोक्ष असम्भव है, परन्तु सम्यग्दर्शन, पुण्य-बन्ध और देव-गति का बन्ध सम्भव है।"
        drawWrappedText(ctx, note, bodyPaint(11f, Color.rgb(120, 53, 15)), leftIndent = 30f, bottomMargin = 20f)

        ctx.startNewPage()
    }

    private fun renderBirthDetails(ctx: PdfContext, profile: UserProfile) {
        drawSectionTitle(ctx, "१. जन्म विवरण")
        drawLabelValue(ctx, "नाम", profile.name)
        drawLabelValue(ctx, "जन्म तिथि", profile.formData.dob)
        drawLabelValue(ctx, "जन्म समय", profile.formData.time)
        drawLabelValue(ctx, "जन्म स्थान", profile.formData.place)
        drawLabelValue(ctx, "लिंग", profile.gender)
        drawDivider(ctx)
        drawLabelValue(ctx, "जन्म नक्षत्र", profile.birthNakshatraHindi)
        drawLabelValue(ctx, "पाद", profile.nakshatraPada.toString())
        drawLabelValue(ctx, "राशि", profile.birthRashi)
        drawLabelValue(ctx, "नक्षत्र-प्रकृति", profile.nakshatraNatureHindi)
        drawLabelValue(ctx, "प्रबल कर्म", profile.dominantKarma)
        drawLabelValue(ctx, "इष्ट तीर्थंकर", profile.tirthankarAffinityHindi)
        drawLabelValue(ctx, "गुणस्थान", profile.gunasthana.toString())
        drawLabelValue(ctx, "चन्द्र अंश", String.format("%.2f°", profile.moonLongitude))
    }

    private fun renderKarmaProfile(ctx: PdfContext, karmaStates: List<KarmaState>) {
        drawSectionTitle(ctx, "२. अष्ट-कर्म प्रोफ़ाइल")
        drawWrappedText(
            ctx,
            "आत्मा पर छाए ८ कर्मों की वर्तमान सघनता एवं स्थिति। तीव्रता % आपकी जन्म-कुण्डली, वर्तमान दशा और गुणस्थान के संयोग से निकाली गई है।",
            bodyPaint(),
            leftIndent = 6f,
            bottomMargin = 10f
        )

        karmaStates.forEach { k ->
            val stateLabel = when (k.state) {
                "Udaya" -> "उदय"
                "Satta" -> "सत्ता"
                "Nirjara" -> "निर्जरा"
                else -> k.state
            }
            ctx.ensureSpace(60f)
            ctx.canvas.drawText(
                "${k.karmaHindi} — ${k.intensity}% ($stateLabel)",
                MARGIN_X + 6f, ctx.y + 12f, subHeaderPaint(12f)
            )
            ctx.advanceY(16f)
            drawIntensityBar(ctx, k.intensity)
            drawWrappedText(ctx, k.manifestation, bodyPaint(10.5f), leftIndent = 8f, bottomMargin = 8f)
        }
    }

    private fun renderPredictions(ctx: PdfContext, predictions: List<LifeDomainPrediction>) {
        ctx.startNewPage()
        drawSectionTitle(ctx, "३. जीवन-क्षेत्र भविष्यफल")

        predictions.forEach { p ->
            val marker = if (p.isFavorable) "✓ अनुकूल" else "✗ कर्म-परीक्षा"
            drawWrappedText(
                ctx,
                "${p.hindiDomain} ($marker)",
                subHeaderPaint(12f),
                leftIndent = 0f,
                bottomMargin = 4f
            )
            drawWrappedText(ctx, p.prediction, bodyPaint(), leftIndent = 10f, bottomMargin = 10f)
        }
    }

    private fun renderRemedies(ctx: PdfContext, remedy: CombinedRemedy) {
        ctx.startNewPage()
        drawSectionTitle(ctx, "४. उपाय एवं साधना")

        val sections = listOf(
            "प्रमुख साधना" to remedy.primarySadhana,
            "दशा-उपाय" to remedy.dashaRemedy,
            "कर्म-उपाय" to remedy.karmaRemedy,
            "यंत्र-स्थापना" to remedy.yantraRecommendation,
            "तपस्या" to remedy.tapasyaRecommendation,
            "शुभ तिथियाँ" to remedy.recommendedTithi
        )
        sections.forEach { (title, content) ->
            drawWrappedText(ctx, title, subHeaderPaint(12f), bottomMargin = 4f)
            drawWrappedText(ctx, content, bodyPaint(), leftIndent = 10f, bottomMargin = 10f)
        }
    }

    private fun renderDashaDetails(ctx: PdfContext, dasha: DashaInfo) {
        ctx.startNewPage()
        drawSectionTitle(ctx, "५. दशा विवरण")

        drawWrappedText(ctx, "महादशा", subHeaderPaint(12f), bottomMargin = 4f)
        drawLabelValue(ctx, "स्वामी", dasha.lordHindi)
        drawLabelValue(ctx, "कुल वर्ष", dasha.yearsTotal.toString())
        drawLabelValue(ctx, "आरम्भ", dasha.startDate)
        drawLabelValue(ctx, "समाप्ति", dasha.endDate)
        drawLabelValue(ctx, "शेष वर्ष", String.format("%.1f", dasha.yearsRemaining))
        drawDivider(ctx)

        drawWrappedText(ctx, "अंतर्दशा", subHeaderPaint(12f), bottomMargin = 4f)
        drawLabelValue(ctx, "स्वामी", dasha.antardashaInfo.lordHindi)
        drawLabelValue(ctx, "कुल वर्ष", String.format("%.1f", dasha.antardashaInfo.yearsTotal))
        drawLabelValue(ctx, "आरम्भ", dasha.antardashaInfo.startDate)
        drawLabelValue(ctx, "समाप्ति", dasha.antardashaInfo.endDate)
        drawLabelValue(ctx, "शेष वर्ष", String.format("%.1f", dasha.antardashaInfo.yearsRemaining))
        drawDivider(ctx)

        drawWrappedText(ctx, "प्रत्यन्तर्दशा", subHeaderPaint(12f), bottomMargin = 4f)
        drawLabelValue(ctx, "स्वामी", dasha.pratyantardasha.lordHindi)
        drawLabelValue(ctx, "आरम्भ", dasha.pratyantardasha.startDate)
        drawLabelValue(ctx, "समाप्ति", dasha.pratyantardasha.endDate)
        drawLabelValue(ctx, "शेष दिन", dasha.pratyantardasha.daysRemaining.toString())
    }

    private fun renderYantraMantraTantra(ctx: PdfContext, profile: UserProfile) {
        val sadhana = getKarmaSadhana(profile.dominantKarmaEn)
        ctx.startNewPage()
        drawSectionTitle(ctx, "६. यंत्र-मंत्र-तंत्र विधान")

        drawWrappedText(ctx, "यंत्र विधान", subHeaderPaint(12f), bottomMargin = 4f)
        drawLabelValue(ctx, "नाम", sadhana.yantra.name)
        drawLabelValue(ctx, "सामग्री", sadhana.yantra.material)
        drawLabelValue(ctx, "स्थापना", sadhana.yantra.installation)
        drawLabelValue(ctx, "माप", sadhana.yantra.dimension)
        drawLabelValue(ctx, "प्रभाव", sadhana.yantra.effect)
        drawDivider(ctx)

        drawWrappedText(ctx, "प्राथमिक मंत्र", subHeaderPaint(12f), bottomMargin = 4f)
        drawWrappedText(ctx, sadhana.primaryMantra.text, bodyPaint(12f, Color.rgb(120, 53, 15)), leftIndent = 10f, bottomMargin = 6f)
        if (sadhana.primaryMantra.meaning.isNotBlank()) {
            drawLabelValue(ctx, "हिंदी अर्थ", sadhana.primaryMantra.meaning)
        }
        drawLabelValue(ctx, "जाप संख्या", sadhana.primaryMantra.count.toString())
        drawLabelValue(ctx, "समय", sadhana.primaryMantra.timing)
        drawLabelValue(ctx, "माला", sadhana.primaryMantra.maala)
        drawLabelValue(ctx, "कर्म-प्रभाव", sadhana.primaryMantra.karmaEffect)
        drawDivider(ctx)

        drawWrappedText(ctx, "द्वितीयक स्तोत्र", subHeaderPaint(12f), bottomMargin = 4f)
        drawLabelValue(ctx, "स्तोत्र", sadhana.secondaryMantra.stotraName)
        drawWrappedText(ctx, sadhana.secondaryMantra.shloka, bodyPaint(11f, Color.rgb(120, 53, 15)), leftIndent = 10f, bottomMargin = 4f)
        if (sadhana.secondaryMantra.meaning.isNotBlank()) {
            drawLabelValue(ctx, "हिंदी अर्थ", sadhana.secondaryMantra.meaning)
        }
        drawLabelValue(ctx, "जाप संख्या", sadhana.secondaryMantra.count.toString())
        drawLabelValue(ctx, "समय", sadhana.secondaryMantra.timing)
    }

    private fun renderSadhanaCalendar(ctx: PdfContext, profile: UserProfile) {
        val sadhana = getKarmaSadhana(profile.dominantKarmaEn)
        ctx.startNewPage()
        drawSectionTitle(ctx, "७. व्यक्तिगत साधना कैलेंडर")

        val tithiDescriptions = sadhana.shubhaTithi.map { t -> if (t <= 15) "शुक्ल $t" else "कृष्ण ${t - 15}" }
        drawLabelValue(ctx, "शुभ तिथियाँ", tithiDescriptions.joinToString(", "))
        drawDivider(ctx)

        drawWrappedText(ctx, "प्रातः नियम", subHeaderPaint(12f), bottomMargin = 4f)
        drawWrappedText(ctx, sadhana.pratahNiyam, bodyPaint(), leftIndent = 10f, bottomMargin = 10f)

        drawWrappedText(ctx, "सायं नियम", subHeaderPaint(12f), bottomMargin = 4f)
        drawWrappedText(ctx, sadhana.saayamNiyam, bodyPaint(), leftIndent = 10f, bottomMargin = 10f)

        drawWrappedText(ctx, "सामान्य उपाय", subHeaderPaint(12f), bottomMargin = 4f)
        drawWrappedText(ctx, sadhana.samanyaUpaya, bodyPaint(), leftIndent = 10f, bottomMargin = 10f)

        drawWrappedText(ctx, "विशेष उपाय", subHeaderPaint(12f), bottomMargin = 4f)
        drawWrappedText(ctx, sadhana.visheshUpaya, bodyPaint(), leftIndent = 10f, bottomMargin = 10f)

        val dashaSadhana = getDashaSadhana(profile.currentDasha.lord)
        drawDivider(ctx)
        drawWrappedText(ctx, "दशा-साधना (${dashaSadhana.lordHindi})", subHeaderPaint(12f), bottomMargin = 4f)
        drawWrappedText(ctx, dashaSadhana.dashaEffect, bodyPaint(), leftIndent = 10f, bottomMargin = 6f)
        drawWrappedText(ctx, dashaSadhana.dashaSadhana, bodyPaint(), leftIndent = 10f, bottomMargin = 6f)
        drawLabelValue(ctx, "श्रेष्ठ तिथि", dashaSadhana.bestTithi)

        drawDivider(ctx)
        drawWrappedText(ctx, "पूजा विधान", subHeaderPaint(12f), bottomMargin = 4f)
        drawLabelValue(ctx, "पूजा", sadhana.puja.name)
        drawLabelValue(ctx, "तीर्थंकर", sadhana.puja.tirthankara)
        drawLabelValue(ctx, "तिथि", sadhana.puja.tithi)
        drawLabelValue(ctx, "लाभ", sadhana.puja.benefit)
        drawWrappedText(ctx, sadhana.puja.vidhi, bodyPaint(), leftIndent = 10f, bottomMargin = 10f)

        drawWrappedText(ctx, "तपस्या", subHeaderPaint(12f), bottomMargin = 4f)
        drawLabelValue(ctx, "नाम", sadhana.tapasya.name)
        drawLabelValue(ctx, "तिथि", sadhana.tapasya.tithi)
        drawWrappedText(ctx, sadhana.tapasya.description, bodyPaint(), leftIndent = 10f, bottomMargin = 6f)
        drawWrappedText(ctx, sadhana.tapasya.anusthana, bodyPaint(), leftIndent = 10f, bottomMargin = 10f)
    }

    private fun renderPanchamKaalNote(ctx: PdfContext) {
        ctx.startNewPage()
        drawSectionTitle(ctx, "८. पंचम काल का सिद्धान्त (दिगम्बर मान्यता)")
        val note = "हम वर्तमान में पंचम काल (दुषमा) में हैं, जो लगभग ई.पू. ५२५ के समय आरम्भ हुआ और लगभग २१,००० वर्षों तक रहेगा। दिगम्बर परम्परा के अनुसार इस काल में पूर्ण चारित्र-मोहनीय कर्म का क्षय असम्भव है — अतः मोक्ष भी असम्भव है। तथापि, सम्यग्दर्शन की प्राप्ति, पुण्य-कर्म का बन्ध, तथा देव-गति या उत्तम मनुष्य-गति का बन्ध इस काल में भी सम्भव है। आपकी साधना का लक्ष्य यही तीन हैं — मोक्ष नहीं, अपितु सम्यक्त्व और शुभ गति का बन्ध।\n\nइसी कारण इस कुंडली में दर्शाए गए समस्त उपाय, मंत्र, यंत्र, और तप — आपकी आत्मा को सम्यग्दर्शन की दिशा में अग्रसर करने और शुभ-कर्म-बन्ध करवाने के लिए हैं, मोक्ष-प्राप्ति का दावा नहीं करते।"
        drawWrappedText(ctx, note, bodyPaint(12f), leftIndent = 4f, bottomMargin = 10f)
    }
}
