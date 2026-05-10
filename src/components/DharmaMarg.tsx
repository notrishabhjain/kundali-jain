import React, { useState } from 'react';
import { Compass, Calendar as CalendarIcon, FileWarning, Route, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { UserProfile } from '../lib/analysisSynthesizer';
import { getKarmaSadhana } from '../data/sadhana';

interface DharmaMargProps {
  profile: UserProfile;
  forExport?: boolean;
  part?: 1 | 2;
}

export default function DharmaMarg({ profile, forExport, part }: DharmaMargProps) {
  const sadhana = getKarmaSadhana(profile.dominantKarmaEn);
  const dashaLord = profile.currentDasha?.lord_hindi || profile.currentDashaLegacy || 'दशा';
  const antardasha = profile.currentDasha?.antardashaInfo?.lord_hindi || profile.currentDasha?.antardasha_hindi || '';
  const nakshatraHindi = profile.birthNakshatraHindi || profile.birthNakshatra;

  const [expandedQuarter, setExpandedQuarter] = useState<number>(1);

  const quarters = [
    {
      q: 1,
      title: 'माह १-३: भूमि-शोधन एवं संकल्प',
      focus: 'सम्यग्दर्शन की तैयारी और कषाय मंदता',
      months: [
        { m: 'माह १', desc: `${sadhana.pratahNiyam} का दृढ़ संकल्प। रात्रि-भोजन और अभक्ष्य-भक्षण का सर्वथा त्याग।` },
        { m: 'माह २', desc: `दैनिक स्वाध्याय का प्रारंभ (१५ मिनट)। ${sadhana.primaryMantra.text} का ${sadhana.primaryMantra.count} बार नियमित जाप।` },
        { m: 'माह ३', desc: `${profile.dominantKarma} कर्म की निर्जरा हेतु सप्ताह में एक दिन ${sadhana.tapasya.anusthana} या एकासन।` }
      ]
    },
    {
      q: 2,
      title: 'माह ४-६: व्रत ग्रहण एवं स्थिरता',
      focus: '१२ भावनाओं का चिंतन एवं श्रावक के मूल गुण',
      months: [
        { m: 'माह ४', desc: `देव-दर्शन के साथ-साथ जिनालय में कुछ समय मौन बैठकर 'अनित्य भावना' का चिंतन।` },
        { m: 'माह ५', desc: `अहिंसा और सत्य अणुव्रत का आंशिक अभ्यास (स्थूल झूठ और संकल्पज हिंसा से पूर्ण विरक्ति)।` },
        { m: 'माह ६', desc: `${nakshatraHindi} नक्षत्र के दिन ${profile.tirthankarAffinity} भगवान का विशेष अभिषेक एवं ${sadhana.puja.name}।` }
      ]
    },
    {
      q: 3,
      title: 'माह ७-९: कर्म-निर्जरा अनुष्ठान',
      focus: 'तप और परीषह-जय',
      months: [
        { m: 'माह ७', desc: `इंद्रिय संयम: मास में एक दिन डिजिटल उपवास (स्क्रीन त्याग) और पूर्ण मौन।` },
        { m: 'माह ८', desc: `वैयावृत्य: किसी साधु, माताजी, या वयोवृद्ध श्रावक की निःस्वार्थ सेवा। अहंकार का विसर्जन।` },
        { m: 'माह ९', desc: `दस-लक्षण या अष्टान्हिका पर्व आने पर विशेष उपवास या ${sadhana.tapasya.name}।` }
      ]
    },
    {
      q: 4,
      title: 'माह १०-१२: आत्म-लीनता',
      focus: 'भेद-विज्ञान और ध्यान',
      months: [
        { m: 'माह १०', desc: `'मैं शरीर नहीं, त्रिकाली ध्रुव आत्मा हूँ' — इस भेद-विज्ञान का प्रतिदिन १५ मिनट अभ्यास।` },
        { m: 'माह ११', desc: `परिग्रह-परिमाण: अनावश्यक वस्तुओं और वस्त्रों का त्याग या दान।` },
        { m: 'माह १२', desc: `सल्लेखना (समाधि-मरण) की भावना भाना और अगले वर्ष के लिए उन्नत व्रतों का संकल्प।` }
      ]
    }
  ];

  return (
    <div className="space-y-10">
      {/* Opening Honest Assessment */}
      {(!part || part === 1) && <section className="bg-orange-50/70 p-6 md:p-10 rounded-2xl border border-orange-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Compass size={120} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-orange-900 mb-6 border-b border-orange-200 pb-4 relative z-10">
          आपका आध्यात्मिक मूल्यांकन (Honest Assessment)
        </h2>
        <div className="space-y-5 text-gray-800 leading-relaxed text-lg relative z-10">
          <p>
            {profile.name} जी, पंचम काल (दुषम काल) में हम पूर्ण मोक्ष प्राप्त नहीं कर सकते। किंतु सम्यग्दर्शन — जो मोक्ष की प्रथम सीढ़ी है — वह आज भी पूर्ण रूप से संभव है। 
          </p>
          <p>
            आपके कर्म-चित्र का अध्ययन स्पष्ट बताता है कि <strong>{sadhana.karmaHindi}</strong> कर्म की प्रबलता आपके जीवन में इस रूप में प्रकट होती है: <em>{sadhana.dailyManifestation}</em> 
            {nakshatraHindi} नक्षत्र और <strong>{dashaLord}</strong> दशा के संयोग में यह ऊर्जा विशिष्ट रूप लेती है।
          </p>
          <p>
            यह कोई चारित्रिक दोष नहीं है, यह केवल पूर्व संचित <strong>{profile.dominantKarma}</strong> कर्म का तीव्र उदय है। इसे तोड़ने के लिए १२-माह का रोडमैप और प्रायश्चित्त विधि नीचे दी गई है।
          </p>
        </div>
      </section>}

      {/* 12-Month Roadmap */}
      {(!part || part === 1) && <section className="bg-white p-6 md:p-10 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
          <Route className="text-amber-600 w-8 h-8" />
          <h2 className="text-2xl font-bold text-gray-900">१२-माह का आध्यात्मिक रोडमैप</h2>
        </div>

        <div className="space-y-4">
          {quarters.map((q) => (
            <div key={q.q} className="border border-gray-200 rounded-xl overflow-hidden">
              {forExport ? (
                <div className="bg-gray-50 px-6 py-4">
                  <h3 className="font-bold text-lg text-gray-900">{q.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">उद्देश्य: {q.focus}</p>
                  <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-100">
                    {q.months.map((m, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-lg shrink-0 text-sm">{m.m}</div>
                        <div className="text-gray-700 leading-relaxed pt-0.5">{m.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setExpandedQuarter(expandedQuarter === q.q ? 0 : q.q)}
                    className="w-full bg-gray-50 px-6 py-4 flex justify-between items-center hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-left">
                      <h3 className="font-bold text-lg text-gray-900">{q.title}</h3>
                      <p className="text-sm text-gray-500">उद्देश्य: {q.focus}</p>
                    </div>
                    {expandedQuarter === q.q ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                  </button>
                  {expandedQuarter === q.q && (
                    <div className="p-6 bg-white space-y-4 border-t border-gray-100">
                      {q.months.map((m, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-lg shrink-0 text-sm">{m.m}</div>
                          <div className="text-gray-700 leading-relaxed pt-0.5">{m.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </section>}

      {/* Deep Dive: Prayashchitta & 90-Day Plan & 12 Vratas */}
      {(!part || part === 2) && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 12 Vratas Contextualized */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
            <ShieldCheck className="text-emerald-600 w-6 h-6" />
            <h3 className="text-xl font-bold text-gray-900">१२ श्रावक व्रत विधान</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">{sadhana.karmaHindi} शमन हेतु आपके लिए मुख्य व्रत:</p>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <strong className="text-emerald-800 block mb-1">अहिंसा अणुव्रत:</strong>
              {profile.dominantKarmaEn === 'Mohaniya' || profile.dominantKarmaEn === 'Charitra Mohaniya' ? 'क्रोध पर विजय। मानसिक रूप से किसी का अहित न सोचना।' : 'जल और सूक्ष्म जीवों की रक्षा हेतु छानकर जल पीना और रात्रि-भोजन त्यागना।'}
            </li>
            <li className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <strong className="text-emerald-800 block mb-1">परिग्रह-परिमाण व्रत:</strong>
              {sadhana.samanyaUpaya}
            </li>
            <li className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <strong className="text-emerald-800 block mb-1">देशावकाशिक व्रत:</strong>
              दशानाथ {dashaLord} के प्रभाव को देखते हुए, मास में एक दिन अपनी सीमाओं (क्षेत्र/दूरी) को अत्यंत सीमित करना।
            </li>
          </ul>
        </div>

        {/* Deep Prayashchitta Guide */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
            <FileWarning className="text-rose-600 w-6 h-6" />
            <h3 className="text-xl font-bold text-gray-900">प्रायश्चित्त विधि (आगम आधारित)</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">यदि नियम टूट जाए या कषाय तीव्र हो जाए, तो आत्मा को शल्य-रहित करने की विधि:</p>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>
              <strong className="text-gray-900">१. आलोचना (Confession):</strong> गुरु के समक्ष या भगवान के सामने निश्छल भाव से अपना दोष स्वीकार करना। <em className="text-gray-500">"मुझसे यह त्रुटि हुई है।"</em>
            </li>
            <li>
              <strong className="text-gray-900">२. प्रतिक्रमण (Retreat):</strong> 'मिच्छामि दुक्कडं' कहकर उस पाप से स्वयं को अलग करना और भविष्य में न करने का संकल्प।
            </li>
            <li>
              <strong className="text-gray-900">३. कायोत्सर्ग:</strong> दोष की गंभीरता अनुसार १० से ३० मिनट तक स्थिर बैठकर 'उवसग्गहरं' या 'णमोकार' का ध्यान।
            </li>
            <li className="bg-rose-50 p-3 rounded-lg border border-rose-100 mt-2">
              <strong className="text-rose-800 block mb-1">विशिष्ट प्रायश्चित्त ({profile.dominantKarma}):</strong>
              जब {profile.dominantKarma} का उदय तीव्र हो, तब एक दिन एकासन कर {sadhana.primaryMantra.count} {sadhana.primaryMantra.text} का जाप प्रायश्चित्त स्वरूप करें।
            </li>
          </ul>
        </div>

        {/* 90-Day Action Plan */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm lg:col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
            <CalendarIcon className="text-amber-600 w-6 h-6" />
            <h3 className="text-xl font-bold text-gray-900">९०-दिवसीय एक्शन प्लान</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">तुरंत आरंभ करने योग्य कर्म-निर्जरा अनुष्ठान:</p>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-lg shrink-0 h-min text-xs mt-0.5">दिन १-३०</div>
              <div className="text-sm text-gray-700">
                <strong className="block text-gray-900 mb-1">नियंत्रण की स्थापना:</strong>
                {sadhana.pratahNiyam} इसे बिना एक भी दिन छोड़े ३० दिन तक करें।
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-lg shrink-0 h-min text-xs mt-0.5">दिन ३१-६०</div>
              <div className="text-sm text-gray-700">
                <strong className="block text-gray-900 mb-1">मंत्र साधना का उदय:</strong>
                {sadhana.primaryMantra.timing} पर {sadhana.primaryMantra.count} बार {sadhana.primaryMantra.text} जाप आरंभ करें।
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-orange-100 text-orange-800 font-bold px-3 py-1 rounded-lg shrink-0 h-min text-xs mt-0.5">दिन ६१-९०</div>
              <div className="text-sm text-gray-700">
                <strong className="block text-gray-900 mb-1">तप की अग्नि:</strong>
                इस अवधि में {sadhana.tapasya.description} और <strong>{sadhana.puja.name}</strong> का अनुष्ठान करें।
              </div>
            </div>
          </div>
          
        </div>

      </div>}
    </div>
  );
}
