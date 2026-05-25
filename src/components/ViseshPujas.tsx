import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Droplets, Flame, Flower2, Sparkles, Wind } from 'lucide-react';
import { UserProfile } from '../lib/engineFacade';
import { getKarmaSadhana } from '../data/sadhana';

interface Kalyanak {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  karma: string;
  arghya: string;
}

interface ViseshPujasProps {
  profile: UserProfile;
  part?: 1 | 2;
}

const panchKalyanaks: Kalyanak[] = [
  {
    id: 'chyavana',
    name: 'च्यवन कल्याणक',
    icon: Flame, // Symbolizes descent of soul/energy
    description: 'तीर्थंकर की आत्मा अपने पूर्व जन्म के देव-विमान से च्यवन (descent) करके माता के गर्भ में आती है। माता को 14 स्वप्न आते हैं (दिगम्बर मत)।',
    karma: 'इस क्षण का स्मरण नाम कर्म (उच्च-गोत्र) के बंध का कारण बनता है।',
    arghya: 'ॐ ह्रीं [तीर्थंकर नाम] भगवतो च्यवन-कल्याणकाय अर्घ्यं निर्वपामि नमः'
  },
  {
    id: 'janma',
    name: 'जन्म कल्याणक',
    icon: Droplets, // Symbolizes Abhishek
    description: 'इंद्र स्वयं मेरु पर्वत पर 1008 कलशों से अभिषेक करते हैं। स्वर्ग में उत्सव होता है। इस पूजा में स्नात्र पूजा (तीर्थंकर-शिशु का अभिषेक) की जाती है।',
    karma: 'दर्शनावरणीय और ज्ञानावरणीय कर्म के क्षयोपशम का स्मरण।',
    arghya: 'ॐ ह्रीं [तीर्थंकर नाम] भगवतो जन्म-कल्याणकाय अर्घ्यं निर्वपामि नमः'
  },
  {
    id: 'diksha',
    name: 'दीक्षा कल्याणक',
    icon: Wind, // Symbolizes renunciation, shedding
    description: 'तीर्थंकर सर्व परिग्रह का त्याग करते हैं। पाँच मुट्ठी बालों का लोंच करते हैं। नग्न दिगम्बर मुनि बनते हैं।',
    karma: 'यह क्षण मोहनीय कर्म के विजय का प्रतीक है। इस क्षण का ध्यान मोहनीय कर्म की निर्जरा करता है।',
    arghya: 'ॐ ह्रीं [तीर्थंकर नाम] भगवतो दीक्षा-कल्याणकाय अर्घ्यं निर्वपामि नमः'
  },
  {
    id: 'kevalgyan',
    name: 'केवलज्ञान कल्याणक',
    icon: Sparkles, // Symbolizes absolute knowledge
    description: 'चार घातिया कर्मों का पूर्ण क्षय। अनंत ज्ञान, अनंत दर्शन, अनंत सुख, अनंत वीर्य की प्राप्ति। समवसरण की स्थापना।',
    karma: 'यह पूजा ज्ञानावरणीय कर्म की निर्जरा का सर्वोच्च माध्यम है।',
    arghya: 'ॐ ह्रीं [तीर्थंकर नाम] भगवतो केवलज्ञान-कल्याणकाय अर्घ्यं निर्वपामि नमः'
  },
  {
    id: 'nirvana',
    name: 'निर्वाण कल्याणक',
    icon: Flower2, // Symbolizes ultimate blossoming/liberation
    description: 'चार अघातिया कर्मों का पूर्ण क्षय। आत्मा सदा के लिए मोक्ष में जाती है। इंद्र अंतिम अभिषेक और पूजन करते हैं।',
    karma: 'यह आयुष्य और नाम कर्म के अंत का स्मरण है।',
    arghya: 'ॐ ह्रीं [तीर्थंकर नाम] भगवतो निर्वाण-कल्याणकाय अर्घ्यं निर्वपामि नमः'
  }
];

const importantDates = [
  { date: 'Kartik Krishna 1', name: 'Mahavira', event: 'Nirvana (Diwali)' },
  { date: 'Kartik Krishna 13', name: 'Mahavira', event: 'Diksha' },
  { date: 'Chaitra Shukla 13', name: 'Mahavira', event: 'Janma (Mahavir Jayanti)' },
  { date: 'Paush Krishna 10', name: 'Parshvanatha', event: 'Janma (Paush Dashmi)' },
  { date: 'Chaitra Krishna 4', name: 'Parshvanatha', event: 'Diksha + Kevalgyan' },
  { date: 'Jyeshtha Shukla 5', name: 'Shantinatha', event: 'Nirvana' },
  { date: 'Margashirsha Shukla 11', name: 'Multiple', event: '(Maun Agiyaras)' },
  { date: 'Vaishakha Shukla 3', name: 'Rishabhdev', event: 'Akshaya Tritiya' },
];

export default function ViseshPujas({ profile, part }: ViseshPujasProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const karmaSadhana = getKarmaSadhana(profile.dominantKarmaEn);

  return (
    <div className="space-y-8">
      {(!part || part === 1) && (
        <>
          <div className="mb-6 text-gray-800 leading-relaxed bg-blue-50/50 p-6 rounded-xl border border-blue-100">
            <h2 className="text-xl font-bold text-blue-900 mb-3">विशेष पूजाएँ: अष्ट-कर्म महायुद्ध</h2>
            <p>
              दिगम्बर परंपरा में पूजा कोई कर्मकांड नहीं है, बल्कि भगवान के वीतराग स्वरूप में स्वयं को स्थापित करने की प्रक्रिया है। 
              विशेष तिथियों पर की जाने वाली ये महा-पूजाएँ अचेतन कर्मों पर प्रचंड प्रहार करती हैं।
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-blue-200 overflow-hidden shadow-md">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center text-left"
            >
              <div>
                <h3 className="text-2xl font-bold text-white tracking-wide">पंच कल्याणक महापूजा</h3>
                <p className="text-blue-100 font-medium">तीर्थंकर के 5 महाशुभ क्षणों का अनुभव एवं कर्म-क्षय</p>
              </div>
              {isExpanded ? <ChevronUp className="text-white w-6 h-6" /> : <ChevronDown className="text-white w-6 h-6" />}
            </button>

        {isExpanded && (
          <div className="p-6 md:p-8 space-y-10">
            
            {/* Introduction */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-gray-800 text-lg">
              <p>
                पंच कल्याणक तीर्थंकर के जीवन के पाँच महाशुभ क्षण हैं। इन क्षणों का स्मरण और अनुभव हमारी आत्मा को उन 
                विशिष्ट कर्म-शक्तियों से जोड़ता है जो मोक्ष मार्ग में आवश्यक हैं। यह केवल एक ऐतिहासिक घटना का स्मरण नहीं, 
                बल्कि अपने भीतर उसी चैतन्य का प्रकटीकरण है।
              </p>
            </div>

            {/* The 5 Kalyanaks */}
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-6">पाँच महा-कल्याणक</h4>
              <div className="space-y-6">
                {panchKalyanaks.map((kalyanak, index) => {
                  const IconName = kalyanak.icon;
                  return (
                    <div key={kalyanak.id} className="bg-white border text-left border-gray-200 rounded-xl overflow-hidden shadow-sm hover:border-blue-300 transition-all flex flex-col md:flex-row">
                      <div className="bg-blue-50 w-full md:w-48 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 relative">
                        <div className="absolute top-2 left-2 text-blue-200 font-bold text-4xl">{index + 1}</div>
                        <IconName className="w-12 h-12 text-blue-600 mb-3 z-10" />
                        <span className="font-bold text-lg text-blue-900 text-center z-10">{kalyanak.name}</span>
                      </div>
                      <div className="p-6 flex-1 space-y-4">
                        <div>
                          <span className="text-xs font-bold text-gray-400 uppercase mb-1 block">क्या होता है</span>
                          <p className="text-gray-800">{kalyanak.description}</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg border-l-2 border-orange-400">
                          <span className="text-xs font-bold text-orange-800 uppercase mb-1 block">कर्म-निर्जरा रहस्य</span>
                          <p className="text-orange-900 font-medium">{kalyanak.karma}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <span className="text-xs font-bold text-blue-600 uppercase mb-1 block">सम्यक् महा-अर्घ्य</span>
                          <p className="text-gray-800 font-serif">{kalyanak.arghya}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simplified Sravak Vidhi */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 md:p-8 rounded-xl border border-indigo-100">
              <h4 className="text-xl font-bold text-indigo-900 mb-4 border-b border-indigo-200 pb-2">श्रावक के लिए पूजा विधि (Simplified Procedure)</h4>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h5 className="font-bold text-indigo-800 mb-3">सर्वोत्तम समय:</h5>
                  <p className="text-gray-700 bg-white p-3 rounded-lg border border-indigo-100 mb-4">
                    कोई भी तीर्थंकर कल्याणक की तिथि (वर्ष में 100+ तिथियाँ होती हैं)। 
                    जैसे: महावीर जयंती, दीपावली (महावीर निर्वाण), पौष दशमी (पार्श्वनाथ जन्म)।
                  </p>
                  
                  <h5 className="font-bold text-indigo-800 mb-3">कल्याणक तिथि सूची (प्रमुख):</h5>
                  <div className="bg-white rounded-lg border border-indigo-100 overflow-hidden text-sm">
                    {importantDates.map((item, i) => (
                      <div key={i} className="flex border-b border-gray-100 last:border-0 p-2 hover:bg-gray-50">
                        <div className="w-1/3 font-bold text-gray-700">{item.date}</div>
                        <div className="w-1/3 text-indigo-600 font-medium">{item.name}</div>
                        <div className="w-1/3 text-gray-600">{item.event}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-indigo-800 mb-3">चरणबद्ध विधि:</h5>
                  <ul className="space-y-3">
                    {[
                      'जिन-मंदिर में या घर में शुद्ध स्थान पर बैठें।',
                      'तीन बार णमोकार मंत्र का स्मरण करें।',
                      'पाँच कल्याणकों के क्रम में एक-एक का चिंतन करें (प्रत्येक पर 5 मिनट)।',
                      'प्रत्येक कल्याणक के साथ उपरोक्त अर्घ्य मंत्र बोलते हुए अष्ट-द्रव्य या जल चढ़ाएँ।',
                      'उस कल्याणक से संबंधित कर्म की निर्जरा का मानसिक संकल्प लें।',
                      'पंच कल्याणक स्तवन का पाठ करें।',
                      'पूर्णार्घ्य चढ़ाएं और क्षमापना करें।'
                    ].map((step, idx) => (
                      <li key={idx} className="flex gap-3 bg-white p-3 rounded-lg border border-indigo-50 shadow-sm">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold shrink-0 text-sm">
                          {idx + 1}
                        </span>
                        <span className="text-gray-800">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
      </>
      )}

       {(!part || part === 2) && (
       <div className="space-y-6">
        {/* Karma-specific puja from sadhana data */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 overflow-hidden shadow-sm">
          <div className="bg-blue-700 px-6 py-4">
            <h3 className="text-xl font-bold text-white">{karmaSadhana.puja.name}</h3>
            <p className="text-blue-100 text-sm mt-1">{profile.dominantKarma} कर्म की निर्जरा हेतु व्यक्तिगत पूजा</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-blue-100 p-4">
                <span className="text-xs font-bold text-blue-600 uppercase block mb-1">आराध्य तीर्थंकर</span>
                <span className="font-bold text-gray-800">{karmaSadhana.puja.tirthankara}</span>
              </div>
              <div className="bg-white rounded-lg border border-blue-100 p-4">
                <span className="text-xs font-bold text-blue-600 uppercase block mb-1">शुभ तिथि</span>
                <span className="font-medium text-gray-800">{karmaSadhana.puja.tithi}</span>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-blue-100 p-4">
              <span className="text-xs font-bold text-blue-600 uppercase block mb-2">पूजा विधि</span>
              <p className="text-gray-800 text-sm leading-relaxed">{karmaSadhana.puja.vidhi}</p>
            </div>
            <div className="bg-orange-50 rounded-lg border border-orange-100 p-4">
              <span className="text-xs font-bold text-orange-700 uppercase block mb-1">विशेष लाभ</span>
              <p className="font-medium text-orange-900">{karmaSadhana.puja.benefit}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 font-serif text-base text-blue-900 text-center">
              {karmaSadhana.puja.stotra}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">सोलहकारण पूजा</h3>
            <p className="text-sm text-gray-700 mb-3">तीर्थंकर नाम कर्म के 16 हेतु:</p>
            <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4">
              <li><strong>दर्शनविशुद्धि:</strong> सम्यग्दर्शन की निर्मलता।</li>
              <li><strong>विनयसंपन्नता:</strong> देव-शास्त्र-गुरु का आदर।</li>
              <li><strong>शीलव्रतेष्वनतिचार:</strong> व्रतों का निरतिचार पालन।</li>
            </ul>
          </div>
          <div className="bg-white p-5 rounded-xl border border-blue-200 bg-blue-50">
            <h3 className="font-bold text-blue-900 mb-2">वर्तमान दशा — पूजा संकल्प</h3>
            <p className="text-sm text-blue-800 mb-3">
              <strong>{profile.currentDasha?.lord_hindi || profile.currentDashaLegacy} दशा</strong> की शांति हेतु:
            </p>
            <ul className="text-xs text-blue-900 space-y-2 list-disc pl-4">
              <li><strong>प्रधान पूजा:</strong> श्री {profile.tirthankarAffinity} भगवान की अष्ट-द्रव्य पूजा।</li>
              <li><strong>शुभ तिथि:</strong> {karmaSadhana.puja.tithi}।</li>
              <li><strong>भाव:</strong> "हे प्रभो! मेरे {profile.dominantKarma} कर्म का क्षय हो।"</li>
            </ul>
          </div>
        </div>
       </div>
      )}
    </div>
  );
}
