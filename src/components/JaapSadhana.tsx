import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Info, CheckCircle2, RotateCcw } from 'lucide-react';
import { UserProfile } from '../lib/analysisSynthesizer';
import { getKarmaSadhana } from '../data/sadhana';

interface MantraData {
  id: string;
  title: string;
  subtitle: string;
  prakritText: string[];
  romanization: string[];
  meaningTitle: string;
  meaningParts: {
    pada: string;
    literal: string;
    deep: string;
    karma: string;
    dhyan: string;
  }[];
  falashruti?: {
    text: string;
    meaning: string;
  }[];
  speciality: string[];
  practice: {
    minimum: string;
    optimal: string;
    mahaSadhana: string;
    vidhi: string[];
    specialRoutine: string;
  };
}

const navkarMantra: MantraData = {
  id: 'navkar',
  title: 'णमोकार महामंत्र',
  subtitle: 'सर्व कर्मों की निर्जरा का मूल',
  prakritText: [
    'णमो अरिहंताणं',
    'णमो सिद्धाणं',
    'णमो आयरियाणं',
    'णमो उवज्झायाणं',
    'णमो लोए सव्वसाहूणं',
    '',
    'एसो पंच णमोक्कारो',
    'सव्वपावप्पणासणो',
    'मंगलाणं च सव्वेसिं',
    'पढमं हवइ मंगलं'
  ],
  romanization: [
    'ṇamo arihantāṇaṃ',
    'ṇamo siddhāṇaṃ',
    'ṇamo āyariyāṇaṃ',
    'ṇamo uvajjhāyāṇaṃ',
    'ṇamo loe savvasāhūṇaṃ',
    '',
    'eso paṃca ṇamokkāro',
    'savvapāvappaṇāsaṇo',
    'maṃgalāṇaṃ ca savvesiṃ',
    'paḍhamaṃ havai maṃgalaṃ'
  ],
  meaningTitle: 'पाँचों पद — गहन अर्थ एवं कर्म-निर्जरा विज्ञान',
  meaningParts: [
    {
      pada: 'णमो अरिहंताणं',
      literal: 'अरिहंतों को मेरा नमस्कार (अरि = आंतरिक शत्रु जैसे क्रोध, मान, माया, लोभ; हंत = नाश करने वाले)',
      deep: 'अरिहंत वे दिव्य आत्माएँ हैं जो अभी इस भौतिक संसार में देह सहित हैं, किन्तु चार घातिया कर्मों — ज्ञानावरणीय, दर्शनावरणीय, मोहनीय, और अंतराय — का सर्वथा क्षय कर चुके हैं। वे केवलज्ञानी हैं — अनंत काल में तीनों लोकों में जो कुछ भी हुआ, हो रहा है, और होगा — वह सब एक साथ उनके ज्ञान में विद्यमान है।',
      karma: 'यह पद विशेषतः ज्ञानावरणीय और दर्शनावरणीय कर्म को झाड़ता है। जब आप "णमो अरिहंताणं" बोलते हैं और मन में अरिहंत के गुणों का स्मरण करते हैं, तब आपकी आत्मा उस गुणात्मक अवस्था की ओर अभिमुख होती है — और इस अभिमुखता से ज्ञानावरण का क्षय होता है।',
      dhyan: 'जैसे अरिहंत ने क्रोध-मान-माया-लोभ को जीता, वैसे ही मेरी आत्मा में भी यह शक्ति है। मैं उसी आत्मशक्ति को नमस्कार करता हूँ।'
    },
    {
      pada: 'णमो सिद्धाणं',
      literal: 'सिद्धों को मेरा नमस्कार (सिद्ध = समस्त आठों कर्मों का सर्वथा क्षय कर मोक्ष प्राप्त आत्माएँ)',
      deep: 'सिद्ध देह-रहित हैं। वे लोकाग्र (ब्रह्मांड के शिखर) पर अनंत ज्ञान, अनंत दर्शन, अनंत सुख, और अनंत वीर्य से परिपूर्ण होकर अनंतकाल तक स्थित हैं। वे न किसी की सहायता कर सकते हैं, न किसी पर क्रुद्ध हो सकते हैं — वे परम निराकांक्षी हैं।',
      karma: 'यह पद आयुष्य कर्म और नाम कर्म पर प्रभाव डालता है। सिद्ध अवस्था का स्मरण आत्मा में वैराग्य जगाता है — जो देह से ऊपर उठने की मूल प्रेरणा है।',
      dhyan: 'सिद्ध लोक में अनंत सिद्ध आत्माएँ हैं — प्रत्येक अपने-आप में पूर्ण। मेरी आत्मा भी उसी स्वरूप की है। मैं उस स्वरूप को नमस्कार करता हूँ।'
    },
    {
      pada: 'णमो आयरियाणं',
      literal: 'आचार्यों को मेरा नमस्कार',
      deep: 'आचार्य पाँच प्रकार के आचारों के पालक हैं: ज्ञानाचार, दर्शनाचार, चारित्राचार, तपाचार, वीर्याचार। वे अपने शिष्यों को धर्ममार्ग पर चलाते हैं। वे 36 मूल गुणों के धारक हैं।',
      karma: 'यह पद चारित्र मोहनीय कर्म पर प्रभाव डालता है। आचार्य की भक्ति से व्यक्ति में अनुशासन और संयम का बीज पड़ता है।',
      dhyan: 'आचार्य परमेष्ठी के समान मेरा जीवन भी संयम और सदाचार से युक्त हो।'
    },
    {
      pada: 'णमो उवज्झायाणं',
      literal: 'उपाध्यायों को मेरा नमस्कार',
      deep: 'उपाध्याय विशेषतः धर्मशास्त्रों के अध्ययन और अध्यापन में रत हैं। वे 25 मूल गुणों के धारक हैं और ज्ञान की परंपरा के रक्षक हैं।',
      karma: 'यह पद विशेषतः ज्ञानावरणीय कर्म को झाड़ता है। उपाध्याय की भक्ति से ज्ञान-प्राप्ति में आने वाली बाधाएँ दूर होती हैं।',
      dhyan: 'मेरी आत्मा श्रुतज्ञान के अभ्यास से अज्ञान के अंधकार को मिटाए।'
    },
    {
      pada: 'णमो लोए सव्वसाहूणं',
      literal: 'सम्पूर्ण लोक में सर्व साधुओं को मेरा नमस्कार',
      deep: 'साधु 28 मूल गुणों के धारक हैं। वे पाँच महाव्रतों के पालक हैं: अहिंसा, सत्य, अचौर्य, ब्रह्मचर्य, अपरिग्रह। "सव्व" = सर्व — इसका अर्थ है कि यह नमस्कार किसी एक व्यक्ति को नहीं, बल्कि साधु-गुण-धारी समस्त आत्माओं को है।',
      karma: 'यह पद अंतराय कर्म और गोत्र कर्म पर प्रभाव डालता है। साधु की भक्ति से वाणी-शुद्धि और संयम का मार्ग खुलता है।',
      dhyan: 'सर्व परिग्रह का त्याग कर, मैं भी वीतराग मार्ग का पथिक बनूँ।'
    }
  ],
  falashruti: [
    { text: 'एसो पंच णमोक्कारो', meaning: 'ये पाँच नमस्कार' },
    { text: 'सव्वपावप्पणासणो', meaning: 'सर्व पापों का नाश करने वाले हैं' },
    { text: 'मंगलाणं च सव्वेसिं', meaning: 'सम्पूर्ण मंगलों में' },
    { text: 'पढमं हवइ मंगलं', meaning: 'यह प्रथम एवं सर्वोच्च मंगल है' }
  ],
  speciality: [
    'मंत्र की भाषा: अर्धमागधी प्राकृत',
    'कुल अक्षर: 68',
    'पहली बार लिपिबद्ध: आचार्य पुष्पदन्तजी ने षट्खण्डागम में (2री शताब्दी)',
    'विशेषता: यह किसी व्यक्ति को नहीं — पाँच परम अवस्थाओं को नमस्कार है। इसलिए यह अनादि और शाश्वत मंत्र है।'
  ],
  practice: {
    minimum: '108 बार',
    optimal: '1008 बार (विशेष अवसर पर)',
    mahaSadhana: '10,008 बार (40-दिन की विशेष साधना में)',
    vidhi: [
      'प्रातःकाल स्नान के पश्चात शुद्ध वस्त्र धारण करें।',
      'शुद्ध आसन पर पूर्व दिशा की ओर मुख करके बैठें।',
      'माला: स्फटिक (सर्वोत्तम), चंदन, या साधारण 108-मनकों की सूती माला उपयोग करें।',
      'प्रत्येक पद धीरे-धीरे उच्चारित करें — अर्थ और परम अवस्थाओं का भाव मन में उभरने दें।',
      'मानसिक जाप (ओष्ठ बिना हिलाए सर्वोत्तम है): शुद्ध चेतना का शुद्ध चेतना को नमस्कार।',
      'जाप के अंत में एक बार पूरा मंत्र मन में बिना माला के पुनः दोहराएँ और संकल्प लें।'
    ],
    specialRoutine: '40-दिन की अखंड साधना: प्रतिदिन 108 जाप एक ही नियत समय पर करें। 40वें दिन एकासन या उपवास रखें। इससे आपके ज्ञानावरणीय और मोहनीय कर्म की कठोर परतें टूटेंगी।'
  }
};

function PracticeTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  React.useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => { setIsActive(false); setSeconds(0); };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-200 shadow-sm text-center flex flex-col items-center justify-center">
      <h3 className="text-xl font-bold text-indigo-900 mb-2">डिजिटल ध्यान टाइमर</h3>
      <p className="text-sm text-indigo-700 mb-4">जाप और ध्यान के लिए समय निर्धारित करें।</p>
      <div className="text-4xl font-mono font-bold text-indigo-800 mb-6 bg-white px-6 py-3 rounded-xl border border-indigo-100 shadow-inner">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-4">
        <button onClick={toggle} className={`px-6 py-2 rounded-full font-bold transition-all ${isActive ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
          {isActive ? 'रोकें (Pause)' : 'प्रारंभ (Start)'}
        </button>
        <button onClick={reset} className="px-6 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-full font-bold hover:bg-indigo-50 transition-all">
          रीसेट (Reset)
        </button>
      </div>
    </div>
  );
}

function DigitalMala() {
  const [count, setCount] = useState(0);

  const handleBeadClick = () => {
    if (count < 108) setCount(c => c + 1);
  };

  const resetMala = () => setCount(0);

  return (
    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 shadow-sm text-center">
      <h3 className="text-xl font-bold text-amber-900 mb-2">डिजिटल जाप माला (108 मोती)</h3>
      <p className="text-sm text-amber-700 mb-6">प्रत्येक जाप के बाद नीचे मोती पर टैप करें।</p>
      
      <div className="mb-8">
        <button 
          onClick={handleBeadClick}
          disabled={count >= 108}
          className={`w-32 h-32 mx-auto rounded-full flex flex-col items-center justify-center border-4 shadow-lg transition-all transform active:scale-95 ${
            count >= 108 
              ? 'bg-emerald-100 border-emerald-500 text-emerald-700' 
              : 'bg-gradient-to-br from-amber-400 to-orange-500 border-orange-200 text-white cursor-pointer hover:shadow-orange-500/30'
          }`}
        >
          <span className="text-4xl font-bold">{count}</span>
          <span className="text-sm font-medium opacity-80">/ 108</span>
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
        {Array.from({ length: 108 }).map((_, i) => (
          <div 
            key={i} 
            className={`w-3 h-3 rounded-full transition-colors ${
              i < count ? 'bg-orange-600 shadow-[0_0_5px_rgba(234,88,12,0.5)]' : 'bg-orange-200/50'
            }`}
          />
        ))}
      </div>

      {count > 0 && (
        <button 
          onClick={resetMala}
          className="mt-6 flex items-center gap-2 mx-auto text-amber-800 text-sm font-bold bg-amber-100 px-4 py-2 rounded-full hover:bg-amber-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> पुनः प्रारंभ करें
        </button>
      )}

      {count === 108 && (
        <div className="mt-4 text-emerald-700 font-bold bg-emerald-100 p-3 rounded-xl inline-block">
          आपका एक माला जाप पूर्ण हुआ। अनुमोदना!
        </div>
      )}
    </div>
  );
}

interface JaapSadhanaProps {
  profile: UserProfile;
  part?: 1 | 2;
}

export default function JaapSadhana({ profile, part }: JaapSadhanaProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const karmaSadhana = getKarmaSadhana(profile.dominantKarmaEn);
  const dashaLordEn = profile.currentDasha?.lord || '';
  const dashaSadhana = getKarmaSadhana(dashaLordEn);

  return (
    <div className="space-y-8">
      {(!part || part === 1) && (
        <>
          <div className="mb-6 text-gray-800 leading-relaxed bg-orange-50/50 p-6 rounded-xl border border-orange-100">
            <h2 className="text-xl font-bold text-orange-900 mb-3">जाप साधना: अध्यात्म विज्ञान</h2>
            <p>
              जैन दर्शन में जाप केवल शब्दों का उच्चारण नहीं है, बल्कि अपनी चेतना को उन शब्दों के अर्थ-रूप में परिणत करना है। 
              जब आप किसी मंत्र का जाप करते हैं, तो ध्वनि-तरंगों से अधिक आपके <span className="font-semibold text-orange-800">भावों की विशुद्धि</span> कार्य करती है। 
              {profile.dominantKarma} कर्म की सघनता को तोड़ने के लिए आपके लिए विशिष्ट साधनाओं का विधान किया गया है।
              सटीक विधि, समय और भावना के साथ किया गया जाप आपके सघन कर्मों में कंपन उत्पन्न कर उन्हें तोड़ने का सामर्थ्य रखता है।
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <DigitalMala />
            <PracticeTimer />
          </div>

          {/* Navkar Mantra Card */}
          <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-md">
            {/* Header */}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 flex justify-between items-center text-left"
            >
              <div>
                <h3 className="text-2xl font-bold text-white tracking-wide">{navkarMantra.title}</h3>
                <p className="text-amber-100 font-medium">{navkarMantra.subtitle}</p>
              </div>
              {isExpanded ? <ChevronUp className="text-white w-6 h-6" /> : <ChevronDown className="text-white w-6 h-6" />}
            </button>

            {/* Content */}
            {isExpanded && (
              <div className="p-6 md:p-8 space-y-10">
                
                {/* Mantra Text & Romanization */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-amber-50 p-6 rounded-xl border border-amber-100/50 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-5">
                      <BookOpen size={100} />
                    </div>
                    <h4 className="text-lg font-bold text-amber-900 mb-4 border-b border-amber-200 pb-2">पूर्ण पाठ (प्राकृत)</h4>
                    <div className="text-2xl font-medium text-gray-900 leading-10 font-serif">
                      {navkarMantra.prakritText.map((line, idx) => (
                        <div key={idx} className={line === '' ? 'h-6' : ''}>{line}</div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100/50">
                    <h4 className="text-lg font-bold text-orange-900 mb-4 border-b border-orange-200 pb-2">Romanization (IAST)</h4>
                    <div className="text-xl text-gray-700 leading-9 font-mono tracking-tight">
                      {navkarMantra.romanization.map((line, idx) => (
                        <div key={idx} className={line === '' ? 'h-4' : ''}>{line}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {(!part || part === 2) && (
        <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-md">
          <div className="p-6 md:p-8 space-y-10">
            {/* Deep Meaning & Karma Science */}
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Info className="text-amber-500" /> 
                {navkarMantra.meaningTitle}
              </h4>
              <div className="space-y-6">
                {navkarMantra.meaningParts.map((part, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-amber-300 transition-colors shadow-sm">
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                      <span className="text-xl font-bold text-amber-800">{part.pada}</span>
                    </div>
                    <div className="p-5 space-y-4 text-gray-800">
                      <div>
                        <span className="font-bold text-gray-900">शाब्दिक अर्थ: </span>
                        {part.literal}
                      </div>
                      <div className="bg-blue-50/30 p-4 rounded-lg border border-blue-100/50">
                        <span className="font-bold text-blue-900">गहन विवेचन: </span>
                        <span className="text-gray-700 leading-relaxed">{part.deep}</span>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                        <span className="font-bold text-orange-900 uppercase tracking-widest text-xs mb-1 block">कर्म-निर्जरा रहस्य</span>
                        <span className="text-orange-950 font-medium">{part.karma}</span>
                      </div>
                      <div className="bg-emerald-50/60 p-4 rounded-lg border border-emerald-100 italic text-emerald-900">
                        <span className="font-bold mr-2 not-italic text-emerald-800">ध्यान-भावना:</span>
                        "{part.dhyan}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Falashruti & Speciality Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">फलश्रुति (अंतिम चार पंक्तियाँ)</h4>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-3">
                  {navkarMantra.falashruti?.map((fala, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                      <span className="font-bold text-amber-800 shrink-0 sm:w-1/2">{fala.text}</span>
                      <span className="text-gray-700">{fala.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">जैन दर्शन से विशेषता</h4>
                <ul className="space-y-3">
                  {navkarMantra.speciality.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Practice Instructions */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 md:p-8 rounded-xl border border-amber-200">
              <h4 className="text-2xl font-bold text-amber-900 mb-6 text-center border-b border-amber-200/50 pb-4">सटीक जाप साधना विधि</h4>
              
              <div className="flex flex-wrap gap-4 mb-8 justify-center">
                <div className="bg-white px-4 py-2 rounded-lg border border-amber-100 shadow-sm text-center">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">न्यूनतम दैनिक जाप</span>
                  <span className="text-lg font-bold text-amber-700">{navkarMantra.practice.minimum}</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-amber-100 shadow-sm text-center flex-1 sm:flex-none">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">उत्तम जाप</span>
                  <span className="text-lg font-bold text-amber-700">{navkarMantra.practice.optimal}</span>
                </div>
                <div className="bg-amber-600 px-4 py-2 rounded-lg shadow-sm text-center w-full sm:w-auto">
                  <span className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">महा-साधना अनुष्ठान</span>
                  <span className="text-lg font-bold text-white">{navkarMantra.practice.mahaSadhana}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h5 className="font-bold text-amber-900 mb-4 px-2">दैनिक विधि:</h5>
                  <ul className="space-y-3">
                    {navkarMantra.practice.vidhi.map((step, idx) => (
                      <li key={idx} className="flex gap-3 bg-white/60 p-3 rounded-lg border border-white">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-200 text-amber-800 font-bold shrink-0 text-sm">
                          {idx + 1}
                        </span>
                        <span className="text-gray-800 font-medium">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-100/50 p-6 rounded-xl border border-amber-300 relative">
                  <div className="absolute -top-3 -right-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider animate-pulse">विशेष</span>
                  </div>
                  <h5 className="text-lg font-bold text-amber-900 mb-3">40-दिन की अखंड साधना</h5>
                  <p className="text-amber-950 font-medium leading-relaxed">
                    {navkarMantra.practice.specialRoutine}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
      
      {(!part || part === 2) && (
      <div className="space-y-6">
        {/* Primary karma-specific mantra */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200 shadow-sm">
          <h3 className="text-2xl font-bold text-amber-900 mb-1">{profile.dominantKarma} कर्म — विशेष मंत्र साधना</h3>
          <p className="text-sm text-amber-700 mb-5">आपके प्रबल कर्म की निर्जरा हेतु शास्त्र-सम्मत व्यक्तिगत मंत्र</p>
          <div className="bg-white p-5 rounded-xl border-2 border-amber-300 font-serif text-xl font-bold text-center text-amber-950 mb-4 shadow-inner leading-10">
            {karmaSadhana.primaryMantra.text}
          </div>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-white rounded-lg border border-amber-100 p-3">
              <span className="text-xs font-bold text-amber-600 uppercase block mb-1">जाप संख्या</span>
              <span className="font-bold text-gray-800">{karmaSadhana.primaryMantra.count}</span>
            </div>
            <div className="bg-white rounded-lg border border-amber-100 p-3">
              <span className="text-xs font-bold text-amber-600 uppercase block mb-1">समय</span>
              <span className="font-medium text-gray-700">{karmaSadhana.primaryMantra.timing}</span>
            </div>
            <div className="bg-white rounded-lg border border-amber-100 p-3">
              <span className="text-xs font-bold text-amber-600 uppercase block mb-1">माला</span>
              <span className="font-medium text-gray-700">{karmaSadhana.primaryMantra.maala}</span>
            </div>
          </div>
          <div className="mt-3 bg-orange-100 rounded-lg p-3 text-sm text-orange-900 border border-orange-200">
            <strong>कर्म प्रभाव:</strong> {karmaSadhana.primaryMantra.karmaEffect}
          </div>
        </div>

        {/* Secondary stotra */}
        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
          <h3 className="text-xl font-bold text-blue-900 mb-1">{karmaSadhana.secondaryMantra.stotraName}</h3>
          <p className="text-sm text-blue-700 mb-4">{profile.dominantKarma} कर्म शांति हेतु द्वितीय स्तोत्र</p>
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 text-center">
            <p className="text-lg font-serif text-gray-800 leading-9 whitespace-pre-line">{karmaSadhana.secondaryMantra.shloka}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-blue-800">
            <span><strong>जाप:</strong> {karmaSadhana.secondaryMantra.count}</span>
            <span><strong>समय:</strong> {karmaSadhana.secondaryMantra.timing}</span>
          </div>
        </div>

        {/* Dasha-specific mantra */}
        {profile.currentDasha?.lord && profile.currentDasha.lord !== profile.dominantKarmaEn && (
          <div className="bg-white p-6 rounded-xl border border-rose-200 shadow-sm">
            <h3 className="text-xl font-bold text-rose-900 mb-1">{profile.currentDasha.lord_hindi} दशा — दशा मंत्र</h3>
            <p className="text-sm text-rose-700 mb-4">वर्तमान दशा की शांति हेतु विशेष साधना</p>
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 font-serif text-lg font-bold text-center text-rose-900 mb-3">
              {dashaSadhana.primaryMantra.text}
            </div>
            <p className="text-sm text-rose-800"><strong>जाप:</strong> {dashaSadhana.primaryMantra.count} | <strong>समय:</strong> {dashaSadhana.primaryMantra.timing}</p>
          </div>
        )}

        {/* Tirthankar personal mantra */}
        <div className="bg-white p-6 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm">
          <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">इष्ट तीर्थंकर मंत्र</h3>
          <p className="text-sm text-amber-800 mb-4 text-center">जन्म-नक्षत्र ({profile.birthNakshatraHindi || profile.birthNakshatra}) आधारित आपके इष्ट तीर्थंकर:</p>
          <div className="bg-white p-5 rounded-xl border-2 border-amber-300 font-serif text-lg font-bold text-center text-amber-950 mb-3 shadow-inner">
            ॐ ह्रीं श्री {profile.tirthankarAffinity} भगवतो दीक्षा-कल्याणकाय अर्घ्यं निर्वपामि नमः
          </div>
          <p className="text-sm font-medium text-amber-700 text-center">इसे प्रतिदिन अपनी मुख्य पूजा में अवश्य सम्मिलित करें।</p>
        </div>
      </div>
      )}
    </div>
  );
}
