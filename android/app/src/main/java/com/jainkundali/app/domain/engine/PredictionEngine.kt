package com.jainkundali.app.domain.engine

import com.jainkundali.app.domain.models.LifeDomainPrediction
import com.jainkundali.app.domain.models.UserProfile
import com.jainkundali.app.domain.data.KARMA_SADHANA

/**
 * Life-domain predictions (7 domains: Spiritual, Health, Wealth, Family, Career, Character,
 * After-death trajectory) — derived from the user's nakshatra, dominant karma, current dashā,
 * antardashā, and gunasthāna.
 *
 * Sources (see references/sources.md):
 *  - Domain decomposition (the 7 life areas): MP-§E2 + MP-§D5 (predictionEngine.ts contract).
 *  - "No false promises" voice: Codex constraint G2-C2.
 *  - Pancham-Kāla honesty (no mokṣa; best = Vaimanik dev-gati for Saudharma-Ishan kalpas):
 *    Codex constraint G2-C3 + MP-§C3.
 *  - Karma-domain wiring: MP-§C1 + MP-§D4.
 *  - Ratnatraya framing (Samyag Darshan/Gyan/Charitra): TLP-1 ch. 7 + MP-§B2.
 *  - Vedaniya sub-types (Sata/Asata) + 6 bāhya tapasya: SKD Book-1 + MP-§F3.
 *  - Antaraya 5 sub-types (Labha, Dana, Bhoga, Upabhoga, Virya): TLP-1 ch. 3 + MP-§C1.
 *  - Kashayas 4-level intensity ladder: Tiloyapannatti + MP-§D4.
 *  - Dev-gati tiers (Bhavanavasi/Jyotishi/Vyantar/Vaimanik): Trilokasara + MP-§C3.
 *  - Compound ghātiyā warning (≥2 simultaneous): MP-§D5.
 *  - Voice rules — always 'आप', karma manifestation + count + timing: MP-§G1 R1-R5.
 */
object PredictionEngine {

    private val GHATIYA = setOf("Gyanavaraniya", "Darshanavaraniya", "Mohaniya", "Antaraya")

    private fun isGhatiya(karma: String) = karma in GHATIYA

    private fun countActiveGhatiya(dominantKarma: String, dashaLord: String, antarLord: String): Int {
        val active = mutableSetOf<String>()
        if (isGhatiya(dominantKarma)) active.add(dominantKarma)
        if (isGhatiya(dashaLord)) active.add(dashaLord)
        if (antarLord.isNotEmpty() && isGhatiya(antarLord)) active.add(antarLord)
        return active.size
    }

    private fun getDominantKashaya(
        dominantKarma: String,
        dashaLord: String,
        gunasthana: Int
    ): String {
        val mohaActive = dominantKarma == "Mohaniya" || dashaLord == "Mohaniya"
        if (!mohaActive) return "none"
        return if (dashaLord == "Mohaniya") {
            when {
                gunasthana <= 1 -> "krodha"
                gunasthana == 2 -> "mana"
                gunasthana == 3 -> "maya"
                else -> "lobha"
            }
        } else {
            when {
                gunasthana <= 2 -> "krodha"
                gunasthana == 3 -> "mana"
                else -> "lobha"
            }
        }
    }

    fun generatePredictions(profile: UserProfile): List<LifeDomainPrediction> {
        val dashaLord = profile.currentDasha.lord
        val antarLord = profile.currentDasha.antardashaInfo.lord
        val dominantKarma = profile.dominantKarmaEn
        val gunasthana = profile.gunasthana
        val nakshatraHi = profile.birthNakshatraHindi
        val dashaHi = profile.currentDasha.lordHindi
        val antarHi = profile.currentDasha.antardashaInfo.lordHindi
        val dominantHi = profile.dominantKarma
        val sadhana = KARMA_SADHANA[dominantKarma] ?: KARMA_SADHANA["Mohaniya"]!!

        val activeGhatiya = countActiveGhatiya(dominantKarma, dashaLord, antarLord)
        val compoundWarning = if (activeGhatiya >= 2)
            " दो से अधिक घातिया कर्मों का एक साथ उदय — यह अत्यंत सावधानी का काल है।"
        else ""

        val kashaya = getDominantKashaya(dominantKarma, dashaLord, gunasthana)
        val kashayaHi = mapOf(
            "krodha" to "क्रोध कषाय", "mana" to "मान कषाय",
            "maya" to "माया कषाय", "lobha" to "लोभ कषाय"
        )[kashaya] ?: ""

        val predictions = mutableListOf<LifeDomainPrediction>()

        // 1. Spiritual — Ratnatraya framing + Dharma Dhyana
        // Source: TLP-1 ch. 7 — Samyag Darshan is the first jewel; without it vratas cannot root.
        // Source: MP-§B2 — Dharma Dhyana (9-tattva contemplation) vs Arta/Raudra Dhyana.
        val darshanaBlocked = dominantKarma == "Darshanavaraniya" || dashaLord == "Darshanavaraniya"
        val gyanBlocked = dominantKarma == "Gyanavaraniya" || dashaLord == "Gyanavaraniya"
        val mohaSpiritual = dominantKarma == "Mohaniya" || dashaLord == "Mohaniya"

        val spirPred = when {
            gunasthana >= 4 ->
                "$nakshatraHi नक्षत्र और $dashaHi दशा में आपको सम्यग्दर्शन की प्राप्ति का लाभ है। रत्नत्रय में आगे बढ़ने के लिए — सम्यग्दर्शन ✓, सम्यग्ज्ञान को शास्त्र-स्वाध्याय से दृढ़ करें, और सम्यग्चारित्र के लिए 12 व्रतों का संकल्प लें। $antarHi अंतर्दशा में धर्म-ध्यान (नव-तत्त्व चिंतन) का अभ्यास करें — आर्त-ध्यान और रौद्र-ध्यान से बचें।" + (if (activeGhatiya >= 2) compoundWarning else "")
            darshanaBlocked ->
                "$dominantHi कर्म का उदय सम्यग्दर्शन के मार्ग में सीधा आवरण डालता है — जिन-वचन में रुचि और विश्वास कम अनुभव होता है। $dashaHi दशा में लक्ष्य: चतुर्थ गुणस्थान (सम्यग्दर्शन) की प्राप्ति। सिद्ध-भक्ति और जिन-दर्शन प्रतिदिन करें; ${sadhana.primaryMantra.text} का ${sadhana.primaryMantra.count} बार जाप ${sadhana.primaryMantra.timing} करें।" + compoundWarning
            gyanBlocked && gunasthana <= 3 ->
                "ज्ञानावरणीय कर्म के उदय में शास्त्र-वचन मन में नहीं टिकते। उपाध्याय परमेष्ठी की भक्ति और प्रतिदिन 20 मिनट स्वाध्याय से ज्ञानावरणीय कर्म की परत पतली होती है। धर्म-ध्यान (9 तत्त्वों का चिंतन) को रौद्र-ध्यान से अलग रखें।" + compoundWarning
            mohaSpiritual && gunasthana <= 3 ->
                "मोहनीय कर्म के उदय में सत्य दिखता है किंतु स्थिर रहना कठिन है। $dashaHi दशा में ${kashayaHi.ifEmpty { "कषाय" }} की प्रबलता आत्म-दर्शन में बाधा डालती है। सम्यग्दर्शन (चतुर्थ गुणस्थान) का लक्ष्य रखें — क्षमापना नित्य करें, धर्म-ध्यान को नित्य-कर्म बनाएं।" + compoundWarning
            else ->
                "$dashaHi दशा में आध्यात्मिक चेतना मिश्र स्थिति में है — $nakshatraHi नक्षत्र की ऊर्जा आपको साधना-मार्ग की ओर खींचती है। नित्य देव-दर्शन और धर्म-ध्यान (जीव-अजीव-पाप-पुण्य-आश्रव-संवर-निर्जरा-बंध-मोक्ष) से गुणस्थान में प्रगति संभव है।"
        }
        predictions.add(LifeDomainPrediction("Spiritual", "आध्यात्मिक यात्रा", spirPred, gunasthana >= 3 && !darshanaBlocked && !gyanBlocked))

        // 2. Health — Vedaniya sub-types + 6 bāhya tapasya
        // Source: SKD Book-1 — Sata Vedaniya = pleasant body experience; Asata = painful.
        // Source: MP-§F3 — Kaya-klesha is the primary Vedaniya reducer among 6 bāhya tapasya.
        val vedaniyaDominant = dominantKarma == "Vedaniya"
        val vedaniyaDasha = dashaLord == "Vedaniya"
        val vedaniyaAntar = antarLord == "Vedaniya"
        val naamActive = dominantKarma == "Naam" || dashaLord == "Naam"
        val ayushyaDasha = dashaLord == "Ayushya"

        val healthPred = when {
            vedaniyaDominant ->
                "असाता वेदनीय का तीव्र उदय — $dashaHi दशा में यह कर्म शरीर में दर्द, रोग या असुविधा के रूप में प्रकट होता है। षट् बाह्य तपस्या में से काया-क्लेश (सहन-शीलता से कष्ट को स्वीकारना) इस कर्म का प्रमुख निर्जरक है। साथ में रस-त्याग (मिठाई/तेल छोड़ना) और उनोदरी (हल्का भोजन) का अभ्यास करें। ${sadhana.primaryMantra.text} का ${sadhana.primaryMantra.count} बार जाप ${sadhana.primaryMantra.timing} करें।" + compoundWarning
            vedaniyaDasha || vedaniyaAntar ->
                "$dashaHi दशा में वेदनीय कर्म का उदय है — असाता वेदनीय = शरीर में कष्ट; साता वेदनीय = शारीरिक सुख। वर्तमान काल में शरीर संवेदनशील है। काया-क्लेश तप और अनशन (एकाशन या उपवास) से वेदनीय का बंध रुकता है।"
            naamActive ->
                "अशुभ नाम कर्म के प्रभाव से शरीर की बाह्य स्थिति पर दबाव आ सकता है। $dashaHi दशा में इसे निर्जरा का अवसर जानें — वृत्ति-संक्षेप और विविक्त-शय्यासन (एकांत विश्राम) से नाम कर्म मंद होता है।"
            ayushyaDasha ->
                "$dashaHi दशा में आयुष्य कर्म सक्रिय है — देह की शक्ति पर सीधा प्रभाव पड़ता है। नियमित दिनचर्या, अहिंसक आहार, और करुणा-भाव से साता वेदनीय का बंध होता है।"
            else ->
                "वर्तमान $dashaHi दशा और $nakshatraHi नक्षत्र में साता वेदनीय का क्षयोपशम है — स्वास्थ्य अनुकूल रहेगा। रस-त्याग (मिठाई-नमक का संयम) से भविष्य के असाता वेदनीय बंध को रोकें।"
        }
        predictions.add(LifeDomainPrediction("Health", "स्वास्थ्य एवं शरीर", healthPred, !vedaniyaDominant && !naamActive))

        // 3. Wealth — Antaraya 5 sub-types
        // Source: TLP-1 ch. 3 — Labha, Dana, Bhoga, Upabhoga, Virya antaraya.
        // Primary remedy: Dana (charity) breaks Labha-antaraya and Dana-antaraya cycles.
        val antarayaDominant = dominantKarma == "Antaraya"
        val antarayaDasha = dashaLord == "Antaraya"
        val antarayaAntar = antarLord == "Antaraya"
        val antarayaActive = antarayaDominant || antarayaDasha || antarayaAntar

        val antarayaSubType = when {
            antarayaDominant && antarayaDasha -> "लाभ-अंतराय और वीर्य-अंतराय (प्राप्ति और पुरुषार्थ दोनों में बाधा)"
            antarayaDominant -> "लाभ-अंतराय (प्राप्य धन या वस्तु मिलते-मिलते रुक जाती है)"
            antarayaDasha -> "भोग-अंतराय (सुख-सामग्री होते हुए भी उपभोग में बाधा)"
            antarayaAntar -> "दान-अंतराय (देने की इच्छा होने पर भी देने में विघ्न)"
            else -> ""
        }

        val wealthPred = when {
            antarayaDominant && antarayaDasha ->
                "अंतराय कर्म का दोहरा उदय — $antarayaSubType। दान-अंतराय तोड़ने का सर्वोत्तम उपाय: यथाशक्ति दान (अन्न-दान, औषध-दान, ज्ञान-दान) प्रतिदिन करें। ${sadhana.primaryMantra.text} का ${sadhana.primaryMantra.count} बार जाप करें।" + compoundWarning
            antarayaActive ->
                "$dashaHi दशा में ${antarayaSubType.ifEmpty { "अंतराय" }} कर्म का उदय — प्रयासों का पूरा फल मिलने में देरी। दान-क्रिया प्रतिदिन करें; यह अंतराय की परत कमज़ोर करती है।"
            dominantKarma == "Gotra" && gunasthana <= 2 ->
                "अशुभ गोत्र कर्म के कारण प्रतिष्ठा पर दबाव रह सकता है। $nakshatraHi नक्षत्र में परिश्रम से उचित मार्ग मिलेगा।"
            else ->
                "$dashaHi दशा और $nakshatraHi नक्षत्र में अंतराय कर्म का क्षयोपशम है — परिश्रम का उचित फल मिलेगा। धन-लाभ होने पर दान का संकल्प लें ताकि भविष्य के लाभ-अंतराय का बंध न हो।"
        }
        predictions.add(LifeDomainPrediction("Wealth", "धन एवं आजीविका", wealthPred, !antarayaActive))

        // 4. Family — specific kashaya from Mohaniya
        // Source: Tiloyapannatti + MP-§D4 — Lobha/Mana/Krodha/Maya manifest distinctly in family.
        val mohaFamily = dominantKarma == "Mohaniya" || dashaLord == "Mohaniya" || antarLord == "Mohaniya"
        val gotraFamily = dominantKarma == "Gotra" || dashaLord == "Gotra"

        val kashayaFamilyAdvice = if (mohaFamily) when (kashaya) {
            "lobha" -> "लोभ कषाय के उदय में परिवार में धन-संपत्ति पर अधिकार-भावना से विवाद हो सकते हैं — संतोष धर्म और अपरिग्रह से इसे मंद करें।"
            "mana"  -> "मान कषाय के उदय में परिजनों के प्रति श्रेष्ठता-भाव रिश्तों को दूर करती है — मार्दव धर्म (विनम्रता) और क्षमापना से इसे घटाएं।"
            "krodha" -> "क्रोध कषाय के उदय में परिवार में छोटी-छोटी बात पर तीव्र प्रतिक्रिया होती है — क्षमा धर्म का नित्य अभ्यास अनिवार्य है।"
            "maya"  -> "माया कषाय के उदय में रिश्तों में छुपाव या हेरफेर की प्रवृत्ति बन सकती है — आर्जव धर्म (सरलता) से इसे क्षीण करें।"
            else -> "मोहनीय कर्म के उदय में राग-द्वेष पारिवारिक जीवन को प्रभावित करेगा — क्षमापना नित्य करें।"
        } else ""

        val familyPred = when {
            mohaFamily && dominantKarma == "Mohaniya" ->
                "$dominantHi कर्म और $dashaHi दशा का संयोग पारिवारिक संबंधों में तीव्र कषाय उत्पन्न कर सकता है। $kashayaFamilyAdvice $antarHi अंतर्दशा में विशेष सावधानी रखें।" + compoundWarning
            mohaFamily ->
                "$dashaHi दशा में मोहनीय का आंशिक उदय है। ${kashayaFamilyAdvice.ifEmpty { "परिवार के प्रति उत्तरदायित्व निभाएं, किंतु वैराग्य-भाव बनाए रखें।" }}"
            gotraFamily ->
                "गोत्र कर्म के उदय से कुल-मान या सामाजिक प्रतिष्ठा से जुड़ी स्थितियां उत्पन्न हो सकती हैं। $nakshatraHi नक्षत्र में आत्म-विनय और जाति-अभिमान छोड़ने से इस कर्म को मंद करें।"
            else ->
                "$nakshatraHi नक्षत्र और $dashaHi दशा में पारिवारिक जीवन में स्थिरता और सामंजस्य रहेगा।"
        }
        predictions.add(LifeDomainPrediction("Family", "परिवार एवं संबंध", familyPred, !mohaFamily && !gotraFamily))

        // 5. Career — Virya Achar + Gyanchar
        // Source: MP-§C1 — Virya-antaraya blocks energy; remedy = Virya Achar (right use of effort).
        // Source: MP-§D4 — Gyanavaraniya blocks decision; remedy = Gyanchar (structured learning).
        val careerAntaraya = dominantKarma == "Antaraya" || dashaLord == "Antaraya"
        val careerGyana = dominantKarma == "Gyanavaraniya" || dashaLord == "Gyanavaraniya"
        val careerBlocked = careerAntaraya || careerGyana

        val careerPred = when {
            antarayaDominant && antarayaDasha ->
                "कार्यक्षेत्र में वीर्य-अंतराय के उदय से पुरुषार्थ प्रकट नहीं हो पाता। उपाय: वीर्याचार (Virya Achar) — निरंतर, सुस्थिर प्रयास बिना हड़बड़ाहट के। $nakshatraHi नक्षत्र की ऊर्जा का उपयोग पुराने कार्यों को पूरा करने में करें।" + compoundWarning
            dominantKarma == "Gyanavaraniya" && (dashaLord == "Gyanavaraniya" || antarLord == "Gyanavaraniya") ->
                "ज्ञानावरणीय कर्म के उदय में जटिल निर्णय में कठिनाई होती है। ज्ञानाचार (Gyanchar) — कार्य से पूर्व व्यवस्थित अध्ययन — इस कर्म का सीधा उपाय है। उपाध्याय परमेष्ठी की भक्ति से ज्ञानावरणीय की परत पतली होती है।" + compoundWarning
            careerAntaraya ->
                "$dashaHi दशा में वीर्य-अंतराय का आंशिक उदय विलंब ला सकता है। वीर्याचार का अभ्यास करें — प्रत्येक कार्य को पूरी शक्ति से करें।"
            careerGyana ->
                "$dashaHi दशा में ज्ञानावरणीय का प्रभाव निर्णय-शक्ति पर आ सकता है। ज्ञानाचार अपनाएं — नई परियोजना से पूर्व पूरी जानकारी जुटाएं।"
            else ->
                "$dashaHi दशा और $nakshatraHi नक्षत्र का संयोग कार्यक्षेत्र में प्रगति के अवसर बनाता है। $antarHi अंतर्दशा में नया उत्तरदायित्व मिल सकता है — वीर्याचार से पूरी शक्ति लगाएं।"
        }
        predictions.add(LifeDomainPrediction("Career", "कार्यक्षेत्र एवं यश", careerPred, !careerBlocked))

        // 6. Character — Kashaya suppression ladder
        // Source: Tiloyapannatti + MP-§D4 — 4 levels: Anantanubandhi/Apratyakhyana/Pratyakhyana/Sanjvalana.
        val kashayaIntensity = when {
            gunasthana <= 1 -> "अनंतानुबंधी कषाय (सर्वाधिक तीव्र) — सम्यग्दर्शन को ही अवरुद्ध करती है; व्रत लेना संभव नहीं।"
            gunasthana <= 3 -> "अप्रत्याख्यान कषाय — श्रावक-व्रत ग्रहण को रोकती है; सच्चाई जानते हैं किंतु व्रत में टिकना कठिन लगता है।"
            gunasthana <= 5 -> "प्रत्याख्यान कषाय — अणुव्रत संभव, किंतु महाव्रत अभी नहीं।"
            else -> "संज्वलन कषाय (सूक्ष्मतम) — सतत प्रयास से साध्य है।"
        }
        val kashayaPractice = when {
            gunasthana <= 1 -> "नमोकार मंत्र का 108 बार नित्य जाप और जिनालय में नित्य दर्शन — मिथ्यात्व को पहचानना ही पहला कदम है।"
            gunasthana <= 3 -> "सामायिक (28 मिनट) प्रतिदिन और रात्रि क्षमापना — अप्रत्याख्यान से प्रत्याख्यान स्तर की ओर ले जाती है।"
            gunasthana <= 5 -> "5 अणुव्रत (अहिंसा, सत्य, अस्तेय, ब्रह्मचर्य, अपरिग्रह) का संकल्प + नित्य प्रतिक्रमण।"
            else -> "आत्म-चिंतन (20 मिनट), प्रतिक्रमण और स्वाध्याय से संज्वलन कषाय को प्रतिदिन घटाएं।"
        }

        val charBlocked = dominantKarma == "Mohaniya" || dashaLord == "Mohaniya"
        val charPred = when {
            dominantKarma == "Mohaniya" && dashaLord == "Mohaniya" ->
                "मोहनीय कर्म का सर्वाधिक तीव्र काल। $kashayaIntensity $kashayaPractice प्रतिदिन ${sadhana.primaryMantra.count} बार ${sadhana.primaryMantra.text} का जाप ${sadhana.primaryMantra.timing} करें।" + compoundWarning
            charBlocked ->
                "$dominantHi कर्म के उदय से $dashaHi दशा में कषाय हावी हो सकती हैं। $kashayaIntensity $kashayaPractice" + compoundWarning
            else ->
                "$dashaHi दशा और $nakshatraHi नक्षत्र में कषायों की मंदता है — आपका आचरण धर्म-अनुकूल रहेगा। $kashayaIntensity $kashayaPractice"
        }
        predictions.add(LifeDomainPrediction("Character", "चरित्र एवं आचरण", charPred, !charBlocked))

        // 7. After-death trajectory — specific dev-gati tiers
        // Source: Trilokasara + MP-§C3 — Bhavanavasi/Jyotishi/Vyantar/Vaimanik (ascending).
        //         Vaimanik (Saudharma-Ishan) = best for Pancham Kaal layperson with Samyag Darshan.
        //         No moksha possible in Pancham Kaal (Codex constraint G2-C3).
        val tiryanchRisk = (dominantKarma == "Mohaniya" || dashaLord == "Mohaniya") && gunasthana <= 1
        val vaimanikPossible = gunasthana >= 4
        val jyotishiPossible = gunasthana >= 2 && !tiryanchRisk
        val mohaAfter = dominantKarma == "Mohaniya" || dashaLord == "Mohaniya" || antarLord == "Mohaniya"
        val ayushyaEffect = if (dominantKarma == "Ayushya")
            "आपके प्रबल आयुष्य कर्म के आधार पर"
        else "$dashaHi दशा और $nakshatraHi नक्षत्र के संयोग से"
        val panchamNote = "स्मरण रहे: पंचम काल में मोक्ष संभव नहीं — किंतु वैमानिक-गति से अगले जन्म में मोक्ष-पथ के समीप होंगे।"

        val afterPred = when {
            tiryanchRisk ->
                "$dominantHi कर्म और $dashaHi दशा के संयोग में — गुणस्थान 1 में कषाय और भोग की ओर झुकाव तिर्यंच-गति का बंध बना सकता है। नित्य संथारा-भावना और नमोकार मंत्र का 108 बार जाप अनिवार्य है। $panchamNote" + compoundWarning
            vaimanikPossible ->
                "$ayushyaEffect आप वैमानिक देव-गति (सौधर्म-ईशान कल्पों तक) के आयुष्य-बंध के योग्य परिस्थितियां बना रहे हैं — पंचम काल के श्रावक के लिए सर्वोत्तम उपलब्धि। सम्यग्दर्शन की दृढ़ता और 12 व्रत-पालन से यह बंध और शुभ होगा। $panchamNote"
            jyotishiPossible ->
                "$ayushyaEffect ज्योतिषी देव-गति का बंध इस काल में संभव है — पुण्य-बहुल जीवन से प्राप्त होती है। सम्यग्दर्शन प्राप्त करने पर वैमानिक-गति संभव होगी। $panchamNote"
            dominantKarma == "Ayushya" ->
                "आयुष्य कर्म की प्रबलता के कारण जीवन की परिस्थितियां तेज़ी से बदल सकती हैं। $dashaHi दशा में शुभ भावों का संकल्प अत्यंत महत्वपूर्ण है। भवनवासी देव-गति से ऊपर उठने के लिए जिन-भक्ति दृढ़ करें।"
            else ->
                "$ayushyaEffect परलोक की स्थिति वर्तमान भावों पर निर्भर है। $nakshatraHi नक्षत्र में धर्म-साधना से मनुष्य-गति या ज्योतिषी देव-गति का बंध होगा। ${sadhana.samanyaUpaya} को नित्य-नियम बनाएं। $panchamNote"
        }
        predictions.add(LifeDomainPrediction("After-death Trajectory", "आगामी गति (परलोक)", afterPred, !tiryanchRisk && gunasthana >= 2))

        return predictions
    }
}
