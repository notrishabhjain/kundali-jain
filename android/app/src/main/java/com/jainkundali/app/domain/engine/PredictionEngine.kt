package com.jainkundali.app.domain.engine

import com.jainkundali.app.domain.models.LifeDomainPrediction
import com.jainkundali.app.domain.models.UserProfile
import com.jainkundali.app.domain.data.KARMA_SADHANA

object PredictionEngine {

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

        val predictions = mutableListOf<LifeDomainPrediction>()

        // 1. Spiritual
        val spiritualBlocked = dominantKarma == "Darshanavaraniya" || dominantKarma == "Gyanavaraniya"
        val spiritualMoha = dominantKarma == "Mohaniya"

        val spirPred = when {
            spiritualBlocked && gunasthana <= 2 ->
                "$nakshatraHi नक्षत्र में $dominantHi कर्म का बोझ है। $dashaHi दशा और $antarHi अंतर्दशा में यह अवरोध और प्रबल हो रहा है — शास्त्र-ज्ञान और तीर्थ-दर्शन में बाधा अनुभव होगी। ${sadhana.primaryMantra.text} का नित्य ${sadhana.primaryMantra.count} बार जाप करें।"
            spiritualMoha && gunasthana <= 3 ->
                "$dominantHi कर्म के उदय में सत्य की पहचान होते हुए भी आचरण में उतारना कठिन रहेगा। $dashaHi दशा इस द्वंद्व को और तीव्र करती है। क्षमापना और मार्दव धर्म से कषाय को मंद करें।"
            gunasthana >= 4 ->
                "$nakshatraHi नक्षत्र की आध्यात्मिक प्रकृति और $dashaHi दशा का संयोग आपकी साधना के लिए श्रेष्ठ काल है। $antarHi अंतर्दशा में विशेष पूजन और स्वाध्याय से गुणस्थान में प्रगति संभव है।"
            else ->
                "$dashaHi दशा में आध्यात्मिक चेतना मिश्र स्थिति में है। $dominantHi कर्म की कुछ मात्रा है किंतु $nakshatraHi नक्षत्र की ऊर्जा आपको साधना-मार्ग की ओर खींचती है। नियमित देव-दर्शन से लाभ होगा।"
        }
        predictions.add(LifeDomainPrediction("Spiritual", "आध्यात्मिक यात्रा", spirPred, gunasthana >= 3 && !spiritualBlocked))

        // 2. Health
        val vedaniyaActive = dominantKarma == "Vedaniya" || dashaLord == "Vedaniya" || antarLord == "Vedaniya"
        val naamActive = dominantKarma == "Naam" || dashaLord == "Naam"
        val healthPred = when {
            vedaniyaActive && dominantKarma == "Vedaniya" ->
                "असाता वेदनीय का तीव्र उदय — $dashaHi दशा और $antarHi अंतर्दशा का संयोग शरीर में कष्ट या रोग प्रवण स्थिति बना सकता है। दवाओं के साथ-साथ ${sadhana.samanyaUpaya} को नित्य-नियम बनाएं।"
            naamActive ->
                "अशुभ नाम कर्म के प्रभाव से शरीर की बाहरी सुंदरता या सामाजिक छवि पर दबाव आ सकता है। $dashaHi दशा में यह कर्म प्रकट होने पर इसे कर्म-निर्जरा का अवसर जानें।"
            dashaLord == "Ayushya" ->
                "आयुष्य दशा में स्वास्थ्य के प्रति विशेष सचेत रहना आवश्यक है। $nakshatraHi नक्षत्र में आयुष्य कर्म का प्रभाव देह-शक्ति पर सीधा पड़ता है। नियमित दिनचर्या और अहिंसक आहार से रक्षण करें।"
            else ->
                "वर्तमान $dashaHi दशा और $nakshatraHi नक्षत्र में साता वेदनीय का क्षयोपशम है — स्वास्थ्य अनुकूल रहेगा। इस शरीर को धर्म-साधना का यंत्र जानकर इसका सदुपयोग करें।"
        }
        predictions.add(LifeDomainPrediction("Health", "स्वास्थ्य एवं शरीर", healthPred, !vedaniyaActive && !naamActive))

        // 3. Wealth
        val antarayaActive = dominantKarma == "Antaraya" || dashaLord == "Antaraya" || antarLord == "Antaraya"
        val wealthPred = when {
            dominantKarma == "Antaraya" && dashaLord == "Antaraya" ->
                "अंतराय कर्म का दोहरा उदय — महादशा और प्रबल कर्म दोनों में अंतराय है। धन-लाभ और उद्यम में बाधाएं बार-बार आएंगी। प्रत्येक विघ्न को जिन-भक्ति की परीक्षा मानकर सहें और ${sadhana.primaryMantra.text} का जाप करें।"
            antarayaActive ->
                "$dashaHi दशा या $antarHi अंतर्दशा में अंतराय कर्म का उदय है — प्रयासों का पूरा फल मिलने में देरी या रुकावट संभव है। लाभ के बजाय कर्तव्य पर ध्यान दें।"
            dominantKarma == "Gotra" && gunasthana <= 2 ->
                "अशुभ गोत्र कर्म के कारण समाज में प्रतिष्ठा पर दबाव रह सकता है, जो अप्रत्यक्ष रूप से आजीविका को प्रभावित करता है। $nakshatraHi नक्षत्र में जन्म के कारण परिश्रम से उचित मार्ग मिलेगा।"
            else ->
                "$dashaHi दशा और $nakshatraHi नक्षत्र में अंतराय कर्म का क्षयोपशम है — परिश्रम का उचित फल मिलेगा। धन-लाभ होने पर दान का संकल्प अवश्य लें, ताकि भविष्य के अंतराय का बंध न हो।"
        }
        predictions.add(LifeDomainPrediction("Wealth", "धन एवं आजीविका", wealthPred, !antarayaActive))

        // 4. Family
        val mohaActive = dominantKarma == "Mohaniya" || dashaLord == "Mohaniya" || antarLord == "Mohaniya"
        val gotraActive = dominantKarma == "Gotra" || dashaLord == "Gotra"
        val familyPred = when {
            mohaActive && dominantKarma == "Mohaniya" ->
                "$dominantHi कर्म और $dashaHi दशा का संयोग पारिवारिक संबंधों में तीव्र राग-द्वेष उत्पन्न कर सकता है। $antarHi अंतर्दशा में विशेष सावधानी रखें — आवेश में लिया निर्णय कष्टदायक होगा। क्षमापना नित्य करें।"
            gotraActive ->
                "गोत्र कर्म के उदय से परिवार में कुल-मान या सामाजिक प्रतिष्ठा से जुड़ी स्थितियां उत्पन्न हो सकती हैं। $nakshatraHi नक्षत्र में आत्म-विनय का अभ्यास इस कर्म को मंद करेगा।"
            mohaActive ->
                "$dashaHi दशा में मोहनीय का आंशिक उदय पारिवारिक आसक्ति को बढ़ा सकता है। यह आध्यात्मिक प्रगति में अवरोध बन सकता है। परिवार के प्रति उत्तरदायित्व निभाएं, किंतु वैराग्य भाव बनाए रखें।"
            else ->
                "$nakshatraHi नक्षत्र और $dashaHi दशा में पारिवारिक जीवन में स्थिरता और सामंजस्य रहेगा। यह परिजनों के साथ मिलकर धर्म-मार्ग अपनाने का उत्तम काल है।"
        }
        predictions.add(LifeDomainPrediction("Family", "परिवार एवं संबंध", familyPred, !mohaActive && !gotraActive))

        // 5. Career
        val careerBlocked = dominantKarma == "Antaraya" || dashaLord == "Antaraya" || dominantKarma == "Gyanavaraniya" || dashaLord == "Gyanavaraniya"
        val careerPred = when {
            dominantKarma == "Antaraya" && dashaLord == "Antaraya" ->
                "कार्यक्षेत्र में अत्यंत संघर्षपूर्ण काल। प्रयास, योजना और परिश्रम के बावजूद विघ्न बार-बार सामने आएंगे। $nakshatraHi नक्षत्र की ऊर्जा का उपयोग पुराने कार्यों को पूरा करने में करें, नए उद्यम बाद में शुरू करें।"
            dominantKarma == "Gyanavaraniya" && (dashaLord == "Gyanavaraniya" || antarLord == "Gyanavaraniya") ->
                "ज्ञानावरणीय कर्म के उदय में बौद्धिक कार्यों, अध्ययन या निर्णय-लेने में कठिनाई आ सकती है। $dashaHi दशा इसे और जटिल बनाती है। स्वाध्याय और उपाध्याय परमेष्ठी की भक्ति से इस दशा को पार करें।"
            careerBlocked ->
                "$dashaHi दशा कार्यक्षेत्र में कुछ बाधाएं ला रही है — धैर्य रखें। $nakshatraHi नक्षत्र की प्रकृति आपको अंतःशक्ति देती है। परिणाम पर नहीं, प्रक्रिया पर ध्यान दें।"
            else ->
                "$dashaHi दशा और $nakshatraHi नक्षत्र का संयोग कार्यक्षेत्र में प्रगति का सूचक है। आपकी बुद्धि और विवेक का सम्मान होगा। $antarHi अंतर्दशा में नया उत्तरदायित्व मिल सकता है।"
        }
        predictions.add(LifeDomainPrediction("Career", "कार्यक्षेत्र एवं यश", careerPred, !careerBlocked))

        // 6. Character
        val charBlocked = dominantKarma == "Mohaniya" || dominantKarma == "Charitra Mohaniya" || dashaLord == "Mohaniya"
        val charPred = when {
            dominantKarma == "Mohaniya" && dashaLord == "Mohaniya" ->
                "मोहनीय कर्म का सर्वाधिक तीव्र काल। चारों कषायें — क्रोध, मान, माया, लोभ — इस दोहरे उदय में प्रबल रहेंगी। $nakshatraHi नक्षत्र की आध्यात्मिक ऊर्जा ही एकमात्र रक्षा है। प्रतिदिन ${sadhana.primaryMantra.count} बार ${sadhana.primaryMantra.text} का जाप करें।"
            charBlocked ->
                "$dominantHi कर्म के उदय से $dashaHi दशा में कषाय हावी हो सकती हैं। $antarHi अंतर्दशा में विशेष सावधानी रखें। क्षमा, मार्दव, आर्जव और संतोष धर्म का अभ्यास करें।"
            else ->
                "$dashaHi दशा और $nakshatraHi नक्षत्र में कषायों की मंदता है — आपका आचरण धर्म-अनुकूल और प्रेरणादायक रहेगा। $antarHi अंतर्दशा में यह विशेषता और प्रकट होगी।"
        }
        predictions.add(LifeDomainPrediction("Character", "चरित्र एवं आचरण", charPred, !charBlocked))

        // 7. After-death trajectory
        val ayushyaEffect = if (dominantKarma == "Ayushya") "आपके प्रबल आयुष्य कर्म के आधार पर" else "$dashaHi दशा और $nakshatraHi नक्षत्र के संयोग से"
        val afterPred = when {
            gunasthana >= 4 && !mohaActive ->
                "$ayushyaEffect आप शुभ देव-गति या उत्तम मनुष्य-गति के आयुष्य का बंध कर रहे हैं। सम्यग्दर्शन की दृढ़ता और व्रत-पालन से यह बंध और शुभ होगा।"
            dominantKarma == "Ayushya" ->
                "आयुष्य कर्म की प्रबलता के कारण जीवन की गति और परिस्थितियां तेज़ी से बदल सकती हैं। $dashaHi दशा में शुभ भावों का संकल्प अत्यंत महत्वपूर्ण है — वे ही अगले जन्म का बंध करते हैं।"
            mohaActive && gunasthana <= 2 ->
                "$dominantHi कर्म और $dashaHi दशा के संयोग में कषाय और भोग की ओर झुकाव हो सकता है। यदि भाव शुद्ध न रहे, तो तिर्यंच-गति का बंध संभव है। नित्य संथारा-भावना और नमोकार जाप अनिवार्य है।"
            else ->
                "$ayushyaEffect परलोक की स्थिति वर्तमान भावों पर निर्भर है। $nakshatraHi नक्षत्र में धर्म-साधना से मनुष्य-गति या देव-गति का बंध होगा। ${sadhana.samanyaUpaya} को नित्य-नियम बनाएं।"
        }
        predictions.add(LifeDomainPrediction("After-death Trajectory", "आगामी गति (परलोक)", afterPred, gunasthana >= 3 && !mohaActive))

        return predictions
    }
}
