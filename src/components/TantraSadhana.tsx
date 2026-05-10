import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Target, CalendarDays, ShieldAlert, Zap, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../lib/analysisSynthesizer';
import { getKarmaSadhana } from '../data/sadhana';

interface SadhanaPhase {
  days: string;
  title: string;
  goal: string;
  jaap: string;
  details: string[];
  additional?: string;
}

interface TantraSadhanaProps {
  profile: UserProfile;
}


export default function TantraSadhana({ profile }: TantraSadhanaProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const sadhana = getKarmaSadhana(profile.dominantKarmaEn);

  const sadhanaPhases: SadhanaPhase[] = [
    {
      days: 'दिन १-१०',
      title: 'Foundation — नींव',
      goal: 'दैनिक 108 जाप की आदत बनाना',
      jaap: '108 बार णमोकार मंत्र, माला पर',
      details: [
        'समय: प्रातःकाल, स्नान के बाद, निश्चित समय पर',
        'ध्यान: केवल मंत्र के शब्दों पर ध्यान केंद्रित करें'
      ],
      additional: 'दिन का एक नशा/बुराई छोड़ें'
    },
    {
      days: 'दिन ११-२०',
      title: 'Deepening — गहराई',
      goal: 'अर्थ के साथ जाप',
      jaap: '108 बार — प्रत्येक पद के अर्थ पर ध्यान दें',
      details: [
        '"णमो अरिहंताणं" — अरिहंत के गुणों की भावना',
        '"णमो सिद्धाणं" — सिद्ध-लोक का ध्यान',
        'इसी प्रकार प्रत्येक पद के साथ'
      ],
      additional: 'कोई एक बुराई और छोड़ें'
    },
    {
      days: 'दिन २१-३३',
      title: 'Integration — अनुभव',
      goal: 'मानसिक जाप जोड़ें',
      jaap: '108 वाचिक + 108 मानसिक (होंठ बिना हिलाए)',
      details: [
        `${sadhana.karmaHindi} कर्म की भावना जोड़ें: "${sadhana.primaryMantra.karmaEffect}"`,
        `${sadhana.pratahNiyam}`
      ],
      additional: 'एकासन का प्रयास करें'
    },
    {
      days: 'दिन ३४-४०',
      title: 'First Milestone — प्रथम सोपान',
      goal: 'जाप की सघनता बढ़ाना',
      jaap: `${sadhana.primaryMantra.count} × 3 = ${sadhana.primaryMantra.count * 3} (तीन बैठकों में)`,
      details: [
        '40वें दिन: उपवास रखें',
        `विशेष मंत्र: ${sadhana.primaryMantra.text} — ${sadhana.primaryMantra.count * 9} बार`,
        'मूल्यांकन: क्या परिवर्तन अनुभव हुए?'
      ]
    },
    {
      days: 'दिन ४१-६७',
      title: 'Continuity — निरंतरता',
      goal: `${sadhana.karmaHindi} कर्म-उदय का प्रतिकार`,
      jaap: `प्रतिदिन ${sadhana.primaryMantra.count} (न्यूनतम)`,
      details: [
        `भावना: "${sadhana.primaryMantra.karmaEffect}"`,
        `स्तोत्र: ${sadhana.secondaryMantra.stotraName} — ${sadhana.secondaryMantra.count} बार (${sadhana.secondaryMantra.timing})`
      ],
      additional: `इस काल में: ${sadhana.visheshUpaya}`
    },
    {
      days: 'दिन ६८-८१',
      title: 'Deepening — आगे',
      goal: 'उर्ध्वारोहण',
      jaap: `प्रतिदिन ${sadhana.primaryMantra.count}`,
      details: [
        `हर 7वें दिन 9 × ${sadhana.primaryMantra.count} = ${9 * sadhana.primaryMantra.count} जाप का प्रयास`,
        '81वें दिन: उपवास',
        `विशेष: ${sadhana.puja.name} — ${sadhana.puja.vidhi}`
      ]
    },
    {
      days: 'दिन ८२-१०७',
      title: 'Final Stretch — अंतिम चरण',
      goal: 'पूर्ण समर्पण',
      jaap: `प्रतिदिन ${sadhana.primaryMantra.count} वाचिक + ${sadhana.primaryMantra.count} मानसिक (अनिवार्य)`,
      details: [
        `${sadhana.secondaryMantra.stotraName} और णमोकार महामंत्र दोनों जोड़ें`,
        `${sadhana.saayamNiyam}`
      ],
      additional: 'इस काल में: किसी जरूरतमंद को दान दें (अपनी शक्ति अनुसार)'
    },
    {
      days: 'दिन १०८',
      title: 'समापन — Completion',
      goal: 'साधना की पूर्णता',
      jaap: `${sadhana.primaryMantra.count * 9} बार ${sadhana.primaryMantra.text}`,
      details: [
        `${sadhana.tapasya.name} (${sadhana.tapasya.description})`,
        `${sadhana.puja.name} — जिन-मंदिर में श्री ${profile.tirthankarAffinity} भगवान की विशेष पूजा`,
        'संकल्प: "यह साधना मेरी नित्य साधना का हिस्सा बनी रहेगी"'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="mb-6 text-gray-800 leading-relaxed bg-red-50/50 p-6 rounded-xl border border-red-100">
        <h2 className="text-xl font-bold text-red-900 mb-3">जैन महा-साधना अनुष्ठान</h2>
        <p>
          दिगम्बर परंपरा में साधना मोक्ष-मार्ग की ओर त्वरित गति से अग्रसर होने का नाम है। यह उन श्रावकों के लिए है 
          जो अपने प्रचंड कर्म-उदयों (जैसे तीव्र {profile.dominantKarma} या ज्ञानावरणीय) को तोड़ने के लिए दृढ़-संकल्पित हैं। 
          यहाँ प्रस्तुत 108-दिवसीय नवकार साधना एक तीव्र, अनुशासित और आध्यात्मिक रूप से गहन प्रक्रिया है।
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-red-200 overflow-hidden shadow-md">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 flex justify-between items-center text-left"
        >
          <div>
            <h3 className="text-2xl font-bold text-white tracking-wide">108-दिन की नवकार मंत्र महा-साधना</h3>
            <p className="text-red-100 font-medium">गहन कर्म-निर्जरा का सघन अनुष्ठान</p>
          </div>
          {isExpanded ? <ChevronUp className="text-white w-6 h-6" /> : <ChevronDown className="text-white w-6 h-6" />}
        </button>

        {isExpanded && (
          <div className="p-6 md:p-8 space-y-10">
            
            {/* Overview & Preparation */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-rose-50 p-6 rounded-xl border border-rose-100 flex flex-col items-start">
                <Target className="w-10 h-10 text-rose-500 mb-3" />
                <h4 className="text-lg font-bold text-rose-900 mb-2">उद्देश्य एवं महत्व</h4>
                <p className="text-gray-700 mb-3">
                  यह साधना उन श्रावकों के लिए है जो किसी विशेष कर्म की तीव्र निर्जरा चाहते हैं।
                </p>
                <div className="bg-white px-3 py-2 rounded border border-rose-100 text-sm font-medium text-rose-800 w-full">
                  108 का रहस्य: 108 = 1 × 2 × 4 × 27<br/>
                  (चार कर्म-उदय × 27 नक्षत्र)
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 flex flex-col items-start">
                <CalendarDays className="w-10 h-10 text-orange-500 mb-3" />
                <h4 className="text-lg font-bold text-orange-900 mb-2">प्रारंभ की तैयारी</h4>
                <div className="space-y-3 w-full">
                  <div className="flex gap-2">
                    <span className="font-bold text-orange-800 shrink-0">शुभ तिथि:</span>
                    <span className="text-gray-700">पंचमी, दशमी, पूर्णिमा या तीर्थंकर कल्याणक</span>
                  </div>
                  <div className="flex gap-2 bg-white p-3 rounded border border-orange-200">
                    <span className="font-bold text-orange-800 shrink-0">संकल्प:</span>
                    <span className="text-orange-900 italic">"मैं [दिनांक] से [दिनांक] तक 108 दिन अखंड णमोकार साधना करूँगा।"</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Timeline */}
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-2">
                <Clock className="text-red-500" />
                साधना क्रम (Day-by-Day Progression)
              </h4>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-red-200 before:via-rose-300 before:to-red-200">
                
                {sadhanaPhases.map((phase, idx) => (
                  <div key={idx} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                    
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-red-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <span className="text-xs font-bold">{idx + 1}</span>
                    </div>

                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-red-300 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded inline-block">{phase.days}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">{phase.title}</span>
                      </div>
                      
                      <h5 className="font-bold text-lg text-gray-900 mb-3">{phase.goal}</h5>
                      
                      <div className="mb-3">
                        <span className="text-xs font-bold text-gray-500 block mb-1 uppercase">जाप/अनुष्ठान</span>
                        <div className="bg-rose-50 text-rose-900 font-medium p-2 rounded text-sm border border-rose-100">
                          {phase.jaap}
                        </div>
                      </div>

                      <ul className="space-y-2 mb-3">
                        {phase.details.map((detail, dIdx) => (
                          <li key={dIdx} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-rose-400 mt-1">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>

                      {phase.additional && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
                          <span className="font-bold text-rose-700 mr-2">संकल्प:</span>
                          <span className="text-gray-600 italic">{phase.additional}</span>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Rules & Outcomes */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShieldAlert className="text-rose-500" /> आचार-नियम (Conduct)
                </h4>
                <ul className="space-y-3">
                  {[
                    'सात्विक भोजन (प्याज-लहसुन रहित)',
                    'ब्रह्मचर्य पालन का प्रयास',
                    'टीवी/मनोरंजन में समय कम करें',
                    'किसी का बुरा न सोचें, न कहें',
                    'प्रतिदिन सायंकाल प्रतिक्रमण',
                    'एक बुराई प्रत्येक माह छोड़ें'
                  ].map((rule, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-2" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                <h4 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <Zap className="text-emerald-500" /> प्रगति के संकेत (Indicators)
                </h4>
                <p className="text-sm text-emerald-800 mb-4 font-medium">
                  ये जैन परंपरा में वर्णित ज्ञानावरणीय और मोहनीय कर्म के क्षयोपशम के प्रत्यक्ष संकेत हैं:
                </p>
                <ul className="space-y-3">
                  {[
                    'मन अधिक शांत होगा',
                    'क्रोध के आवेगों में कमी आएगी',
                    'निर्णय क्षमता और स्पष्टता बढ़ेगी',
                    'सांसारिक प्रलोभनों से वैराग्य बढ़ेगा',
                    'सम्यग्दर्शन की दिशा में दृढ़ता आएगी'
                  ].map((sign, idx) => (
                    <li key={idx} className="flex gap-3 text-emerald-950">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Dynamic Tantra Content */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm md:col-span-2">
          <h3 className="font-bold text-xl text-gray-900 mb-4 border-b border-gray-100 pb-2">पंच परमेष्ठी ध्यान (गहन अंतर्दृष्टि साधना)</h3>
          <p className="text-sm text-gray-700 mb-6">जैन ध्यान-पद्धति (पदस्थ ध्यान) में पंच परमेष्ठी के वर्ण (रंग) और उनके गुणों का ध्यान अतीव फलदायी है:</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <strong className="text-slate-800 flex items-center gap-2 mb-2"><span className="w-3 h-3 rounded-full bg-white border border-gray-300"></span> १. अरिहंत पद (श्वेत वर्ण)</strong>
              <p className="text-xs text-slate-600"><strong>ध्यान केंद्र:</strong> मस्तिष्क के मध्य (आज्ञा चक्र)।<br/><strong>भावना:</strong> चंद्र-समान श्वेत रश्मियाँ निकलकर मेरे ज्ञानावरणीय और दर्शनावरणीय कर्म के अंधकार को नष्ट कर रही हैं।</p>
            </div>
            
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
              <strong className="text-rose-800 flex items-center gap-2 mb-2"><span className="w-3 h-3 rounded-full bg-red-600"></span> २. सिद्ध पद (रक्त वर्ण)</strong>
              <p className="text-xs text-rose-600"><strong>ध्यान केंद्र:</strong> ललाट का ऊपरी भाग।<br/><strong>भावना:</strong> सूर्य-समान लाल किरणें मेरे आयुष्य व गोत्र कर्म को शुद्ध कर, आत्मा को ऊर्ध्वगामी बना रही हैं।</p>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <strong className="text-amber-800 flex items-center gap-2 mb-2"><span className="w-3 h-3 rounded-full bg-yellow-400"></span> ३. आचार्य पद (स्वर्ण/पीत वर्ण)</strong>
              <p className="text-xs text-amber-700"><strong>ध्यान केंद्र:</strong> कंठ।<br/><strong>भावना:</strong> स्वर्णिम प्रकाश मेरे कंठ में प्रवाहित होकर चारित्र मोहनीय कर्म को शिथिल कर रहा है। मेरा आचरण संयमित हो रहा है।</p>
            </div>
            
            <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
              <strong className="text-teal-800 flex items-center gap-2 mb-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> ४. उपाध्याय पद (हरित वर्ण)</strong>
              <p className="text-xs text-teal-700"><strong>ध्यान केंद्र:</strong> हृदय कमल।<br/><strong>भावना:</strong> पन्ना-समान हरी किरणें मेरे हृदय को अज्ञान के क्षयोपशम और श्रुतज्ञान के प्रकाश से भर रही हैं।</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-300 md:col-span-2">
              <strong className="text-gray-800 flex items-center gap-2 mb-2"><span className="w-3 h-3 rounded-full bg-gray-900"></span> ५. साधु पद (श्याम/कृष्ण वर्ण)</strong>
              <p className="text-xs text-gray-600"><strong>ध्यान केंद्र:</strong> नाभि।<br/><strong>भावना:</strong> काजल-समान गहरी किरणें मेरे अंतराय कर्म (विघ्नों) को भस्म कर वीतराग भाव की ओर प्रेरित कर रही हैं।</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-5 rounded-xl border border-red-200">
          <h3 className="font-bold text-red-900 mb-2">४०-दिन {sadhana.karmaHindi}-विशिष्ट अनुष्ठान</h3>
          <p className="text-sm text-red-800 mb-3">{sadhana.dailyManifestation}</p>
          <ul className="text-xs text-red-900 space-y-2 list-disc pl-4">
            <li><strong>मुख्य मंत्र:</strong> {sadhana.primaryMantra.text} — {sadhana.primaryMantra.count} बार ({sadhana.primaryMantra.timing}), {sadhana.primaryMantra.maala} माला।</li>
            <li><strong>पूजा:</strong> {sadhana.puja.name} — श्री {profile.tirthankarAffinity} भगवान। {sadhana.puja.benefit}</li>
            <li><strong>विशेष उपाय:</strong> {sadhana.visheshUpaya}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
