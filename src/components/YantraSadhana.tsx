import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CircleDot, Info, CheckCircle2, Star } from 'lucide-react';
import { UserProfile } from '../lib/analysisSynthesizer';
import { getKarmaSadhana } from '../data/sadhana';

interface YantraData {
  id: string;
  title: string;
  subtitle: string;
  structure: {
    name: string;
    description: string;
    items: string[];
  }[];
  pratishtha: {
    timing: string;
    bestDays: string;
    bestNakshatra: string;
    steps: {
      name: string;
      action: string;
      mantra?: string;
    }[];
  };
  dailyPuja: {
    duration: string;
    steps: string[];
    special: string;
  };
  sadhanaPlan: {
    title: string;
    timing: string;
    routine: string;
    schedule: { day: string; target: string; karma: string }[];
    historical: string;
  };
  karmaConnections: { pad: string; karma: string }[];
}

interface YantraSadhanaProps {
  profile: UserProfile;
  part?: 1 | 2;
}

const siddhachakraYantra: YantraData = {
  id: 'siddhachakra',
  title: 'सिद्धचक्र महायंत्र साधना',
  subtitle: 'सर्व कर्म विलय एवं नवपद आराधना',
  structure: [
    {
      name: 'नव पद (Nine Positions)',
      description: 'दिगम्बर परंपरा में: पाँच परमेष्ठी + रत्नत्रय + तप = नव पद',
      items: [
        'केंद्र: अरिहंत (Center — highest position)',
        'ऊपर: सिद्ध (Top — North)',
        'दाहिने: आचार्य (Right — East)',
        'नीचे: उपाध्याय (Bottom — South)',
        'बाएँ: साधु (Left — West)',
        'ऊपर-दाहिना कोना: सम्यग्दर्शन (Right Vision)',
        'नीचे-दाहिना कोना: सम्यग्ज्ञान (Right Knowledge)',
        'नीचे-बाँया कोना: सम्यक्चारित्र (Right Conduct)',
        'ऊपर-बाँया कोना: सम्यक्तप (Right Penance)'
      ]
    },
    {
      name: 'यंत्र की परतें (Circles/Valaya)',
      description: 'यंत्र का बाह्य आवरण और आध्यात्मिक सुरक्षा घेरा',
      items: [
        '१. केंद्र: नव पद',
        '२. प्रथम पंखुड़ियाँ: 8 अष्टमंगल (शुभ चिह्न)',
        '३. द्वितीय वलय: 24 तीर्थंकर',
        '४. तृतीय वलय: 24 तीर्थंकर के यक्ष',
        '५. चतुर्थ वलय: 24 तीर्थंकर की यक्षिणियाँ',
        '६. पंचम वलय: 8 गुरु-पादुका',
        '७. षष्ठ वलय: 8 देवियाँ (अष्ट दिशाओं की)',
        '८. सप्तम वलय: 16 पंखुड़ियाँ — 16 अधिष्ठायक देव',
        '९. कलश: बाहरी आवरण — संपूर्ण ब्रह्मांड का प्रतीक'
      ]
    }
  ],
  pratishtha: {
    timing: 'पंचमी, दशमी, पूर्णिमा (शुक्ल पक्ष में), कोई तीर्थंकर कल्याणक की तिथि, पर्युषण / दस लक्षण काल',
    bestDays: 'सोमवार, बुधवार, शुक्रवार',
    bestNakshatra: 'रोहिणी, उत्तरा फाल्गुनी, उत्तराषाढ़ा',
    steps: [
      {
        name: 'पूर्व तैयारी',
        action: 'स्वयं स्नान करें, श्वेत वस्त्र धारण करें। पूजन स्थान को गंगाजल (या शुद्ध जल) से शुद्ध करें। यंत्र को नए लाल/पीले वस्त्र पर रखें।'
      },
      {
        name: 'आह्वान (Invocation)',
        action: 'तीन लौंग दोनों हथेलियों के बीच बंद कमल की आकृति में लेकर आकाश से आह्वान करें और लौंगों को यंत्र पर रखें।',
        mantra: 'ॐ ह्रीं नव-पद-परमेष्ठि-रूप-सिद्धचक्र-यंत्राय आगच्छ आगच्छ नमः'
      },
      {
        name: 'स्थापना (Establishment)',
        action: 'यंत्र को ऊँचे आसन पर स्थापित करें।',
        mantra: 'ॐ ह्रीं सिद्धचक्र-यंत्र-महायंत्राय स्थापनाय नमः'
      },
      {
        name: 'सन्निधिकरण (Presence)',
        action: 'यह भाव करें कि यंत्र अब आपके हृदय में भी स्थापित हो गया।',
        mantra: 'ॐ ह्रीं सिद्धचक्र-महायंत्राय सन्निधानाय नमः'
      },
      {
        name: 'अष्ट-दव्य पूजन',
        action: 'जल, चंदन, अक्षत, पुष्प, नैवेद्य, दीप, धूप, फल से क्रमशः पूजन करें।',
        mantra: 'ॐ ह्रीं जलं/चंदनं निर्वपामि स्वाहा'
      },
      {
        name: 'नव पद को अर्घ्य',
        action: 'प्रत्येक पद के लिए अलग अर्घ्य अर्पित करें।',
        mantra: 'ॐ ह्रीं अरिहंताय/सिद्धाय अर्घ्यं निर्वपामि नमः'
      },
      {
        name: 'पूर्णार्घ्य और जयमाल',
        action: 'सिद्धचक्र की गुणमाल (जयमाला) गाएँ और पूर्णार्घ्य चढ़ाएँ।'
      },
      {
        name: 'क्षमापना',
        action: 'जो भी चूक हुई हो, क्षमा करें। णमोकार मंत्र तीन बार बोलें और प्रणाम करें।'
      }
    ]
  },
  dailyPuja: {
    duration: '20-30 मिनट',
    steps: [
      'स्नान के बाद शुद्ध वस्त्र में यंत्र के सामने बैठें',
      'तीन बार णमोकार मंत्र',
      'चंदन और जल से यंत्र का संक्षिप्त अभिषेक',
      'धूप और दीप प्रज्वलित करें',
      'नव पदों को प्रणाम करते हुए मंत्र बोलें: "ॐ ह्रीं णमो अरिहंताणं सिद्धाणं आयरियाणं उवज्झायाणं सव्वसाहूणं सम्यग्दर्शन-ज्ञान-चारित्र-तपेभ्यो नमः"',
      '108 बार णमोकार मंत्र जाप यंत्र के सामने करें',
      'सिद्धचक्र स्तवन (यदि जानते हों)',
      'क्षमापना और प्रणाम'
    ],
    special: 'प्रत्येक पंचमी को (पाँचों नव-पद पद में "पाँच" का महत्व देखते हुए) विशेष पूजा करें।'
  },
  sadhanaPlan: {
    title: 'नवपद / ओली साधना (Special 9-Day Practice)',
    timing: 'वर्ष में दो बार: चैत्र और अश्विन माह की षष्ठी से चतुर्दशी तक (9 दिन)',
    routine: 'आयम्बिल (एक बार भोजन, बिना नमक-मसाले-तेल के), सिद्धचक्र की पूजा, प्रत्येक दिन एक नव-पद को विशेष भाव से पूजें।',
    schedule: [
      { day: 'दिन १', target: 'अरिहंत पद', karma: 'ज्ञानावरणीय कर्म निर्जरा' },
      { day: 'दिन २', target: 'सिद्ध पद', karma: 'दर्शनावरणीय कर्म निर्जरा' },
      { day: 'दिन ३', target: 'आचार्य पद', karma: 'चारित्र मोहनीय कर्म निर्जरा' },
      { day: 'दिन ४', target: 'उपाध्याय पद', karma: 'ज्ञानावरणीय कर्म निर्जरा' },
      { day: 'दिन ५', target: 'साधु पद', karma: 'अंतराय कर्म निर्जरा' },
      { day: 'दिन ६', target: 'सम्यग्दर्शन पद', karma: 'दर्शनावरणीय कर्म निर्जरा' },
      { day: 'दिन ७', target: 'सम्यग्ज्ञान पद', karma: 'ज्ञानावरणीय कर्म निर्जरा' },
      { day: 'दिन ८', target: 'सम्यक्चारित्र पद', karma: 'मोहनीय कर्म निर्जरा' },
      { day: 'दिन ९', target: 'सम्यक्तप पद', karma: 'सर्व कर्म निर्जरा (सामूहिक)' }
    ],
    historical: 'ऐतिहासिक महत्व: राजा श्रीपाल कुष्ठ रोगी थे। महारानी मयनासुंदरी ने उन्हें सिद्धचक्र की नवपद ओली का उपदेश दिलाया। नौ दिन की ओली से श्रीपाल और 700 कुष्ठ रोगियों का रोग दूर हो गया।'
  },
  karmaConnections: [
    { pad: 'अरिहंत पद', karma: 'ज्ञानावरणीय + दर्शनावरणीय' },
    { pad: 'सिद्ध पद', karma: 'आयुष्य + गोत्र (अगले जन्म पर प्रभाव)' },
    { pad: 'आचार्य पद', karma: 'चारित्र मोहनीय' },
    { pad: 'उपाध्याय पद', karma: 'ज्ञानावरणीय' },
    { pad: 'साधु पद', karma: 'अंतराय' },
    { pad: 'सम्यग्दर्शन', karma: 'दर्शनावरणीय' },
    { pad: 'सम्यग्ज्ञान', karma: 'ज्ञानावरणीय' },
    { pad: 'सम्यक्चारित्र', karma: 'मोहनीय' },
    { pad: 'सम्यक्तप', karma: 'वेदनीय' }
  ]
};

export default function YantraSadhana({ profile, part }: YantraSadhanaProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const karmaSadhana = getKarmaSadhana(profile.dominantKarmaEn);

  return (
    <div className="space-y-8">
      {(!part || part === 1) && (
        <>
          <div className="mb-6 text-gray-800 leading-relaxed bg-orange-50/50 p-6 rounded-xl border border-orange-100">
        <h2 className="text-xl font-bold text-orange-900 mb-3">यंत्र साधना: आध्यात्मिक ऊर्जा का केंद्र</h2>
        <p>
          जैन धर्म में यंत्र कोई तांत्रिक जादू-टोना नहीं है। यह आध्यात्मिक शक्तियों की ज्यामितीय संरचना (Geometric Structure) है। 
          यंत्र में प्रतिष्ठित परमेष्ठी और गुण आपके अंतरंग गुणों को जागृत करने के लिए एक आलंबन (Support) का कार्य करते हैं। 
          सिद्धचक्र यंत्र दिगम्बर परंपरा का सर्वोच्च यंत्र है, जो सीधे आपके अष्ट-कर्मों (विशेषकर {profile.dominantKarma}) पर प्रहार कर आत्म-विशुद्धि का मार्ग प्रशस्त करता है।
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-md">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 flex justify-between items-center text-left"
        >
          <div>
            <h3 className="text-2xl font-bold text-white tracking-wide">{siddhachakraYantra.title}</h3>
            <p className="text-amber-100 font-medium">{siddhachakraYantra.subtitle}</p>
          </div>
          {isExpanded ? <ChevronUp className="text-white w-6 h-6" /> : <ChevronDown className="text-white w-6 h-6" />}
        </button>

        {isExpanded && (
          <div className="p-6 md:p-8 space-y-10">
            
            {/* What it IS: Structure */}
            <div className="grid md:grid-cols-2 gap-8">
              {siddhachakraYantra.structure.map((struct, idx) => (
                <div key={idx} className="bg-amber-50 p-6 rounded-xl border border-amber-100/50 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 opacity-5">
                    <CircleDot size={100} />
                  </div>
                  <h4 className="text-lg font-bold text-amber-900 mb-2 border-b border-amber-200 pb-2">{struct.name}</h4>
                  <p className="text-amber-700 text-sm font-medium mb-4">{struct.description}</p>
                  <ul className="space-y-2">
                    {struct.items.map((item, i) => (
                      <li key={i} className="flex gap-2 text-gray-800 text-sm">
                        <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Why it works: Karma Connections */}
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Info className="text-amber-500" /> 
                नव-पद एवं कर्म-निर्जरा (Why it works)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {siddhachakraYantra.karmaConnections.map((conn, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:border-amber-300 transition-colors">
                    <span className="font-bold text-lg text-amber-800 mb-2">{conn.pad}</span>
                    <span className="bg-orange-50 text-orange-900 text-sm font-medium px-3 py-1 rounded inline-block border border-orange-100">
                      {conn.karma}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )}

  {(!part || part === 2) && (
        <>
          <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-md">
            {part === 2 && (
              <div className="w-full px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 flex justify-between items-center text-left">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-wide">{siddhachakraYantra.title} (क्रमशः)</h3>
                </div>
              </div>
            )}
            {isExpanded && (
              <div className="p-6 md:p-8 space-y-10">
                {/* Pratishtha Procedure */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h4 className="text-xl font-bold text-amber-900">प्रतिष्ठा विधि (Step-by-Step Installation)</h4>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-amber-50 px-4 py-2 rounded-lg border border-amber-100 flex-1">
                    <span className="block text-xs font-bold text-amber-600 uppercase mb-1">शुभ तिथियाँ</span>
                    <span className="text-sm font-medium text-gray-800">{siddhachakraYantra.pratishtha.timing}</span>
                  </div>
                  <div className="bg-amber-50 px-4 py-2 rounded-lg border border-amber-100 flex-1">
                    <span className="block text-xs font-bold text-amber-600 uppercase mb-1">शुभ वार व नक्षत्र</span>
                    <span className="text-sm font-medium text-gray-800">{siddhachakraYantra.pratishtha.bestDays} | {siddhachakraYantra.pratishtha.bestNakshatra}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {siddhachakraYantra.pratishtha.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <div className="flex-1 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <h5 className="font-bold text-gray-900">{step.name}</h5>
                        <p className="text-gray-700 mt-1">{step.action}</p>
                        {step.mantra && (
                          <div className="mt-2 bg-orange-50/50 p-2 rounded border border-orange-100 font-medium text-orange-800 text-sm">
                            मंत्र: {step.mantra}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Puja & Sadhana Plan */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">नित्य पूजा विधि</h4>
                <div className="bg-gradient-to-br from-white to-amber-50/30 p-5 rounded-xl border border-gray-200 h-full">
                  <div className="mb-4 inline-block bg-white px-3 py-1 rounded-full border border-gray-200 text-xs font-bold text-amber-700 uppercase">
                    अवधि: {siddhachakraYantra.dailyPuja.duration}
                  </div>
                  <ul className="space-y-3">
                    {siddhachakraYantra.dailyPuja.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-700">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span className={step.includes('ॐ ह्रीं') ? 'font-medium text-orange-800' : ''}>{step}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 bg-orange-100/50 p-3 rounded border border-orange-200 text-sm font-medium text-orange-900">
                    <span className="font-bold mr-1">विशेष:</span> {siddhachakraYantra.dailyPuja.special}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">90-दिन / 9-दिन विशेष साधना</h4>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-200 h-full">
                  <h5 className="font-bold text-amber-900 mb-2">{siddhachakraYantra.sadhanaPlan.title}</h5>
                  <p className="text-sm text-amber-800 mb-4 font-medium">{siddhachakraYantra.sadhanaPlan.timing}</p>
                  
                  <div className="bg-white p-3 rounded-lg border border-amber-100 mb-4 text-gray-800 text-sm">
                    <span className="font-bold text-amber-700 mr-2">नियम:</span>
                    {siddhachakraYantra.sadhanaPlan.routine}
                  </div>

                  <div className="space-y-2 mb-4">
                    {siddhachakraYantra.sadhanaPlan.schedule.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex text-xs bg-white border border-amber-100 rounded overflow-hidden">
                        <div className="bg-amber-100 font-bold px-2 py-1 text-amber-900 w-16 text-center">{item.day}</div>
                        <div className="px-2 py-1 font-medium border-r border-amber-50 w-24">{item.target}</div>
                        <div className="px-2 py-1 text-gray-600 truncate">{item.karma}</div>
                      </div>
                    ))}
                    <div className="text-center text-xs text-amber-600 font-bold py-1">... इसी प्रकार 9 दिनों तक</div>
                  </div>

                  <div className="bg-emerald-50 p-3 rounded border border-emerald-100 text-xs text-emerald-900 mt-auto">
                    <span className="font-bold block mb-1">लक्षण / ऐतिहासिक प्रमाण:</span>
                    {siddhachakraYantra.sadhanaPlan.historical}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
          </div>

          {/* Karma-specific yantra from sadhana data */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 overflow-hidden shadow-sm">
            <div className="bg-amber-600 px-6 py-4">
              <h4 className="text-xl font-bold text-white">आपका व्यक्तिगत कर्म-यंत्र: {karmaSadhana.yantra.name}</h4>
              <p className="text-amber-100 text-sm mt-1">{profile.dominantKarma} कर्म की निर्जरा हेतु विशेष यंत्र</p>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-5">
              <div className="space-y-3">
                <div className="bg-white rounded-lg border border-amber-100 p-4">
                  <span className="text-xs font-bold text-amber-600 uppercase block mb-1">सामग्री</span>
                  <span className="font-medium text-gray-800">{karmaSadhana.yantra.material}</span>
                </div>
                <div className="bg-white rounded-lg border border-amber-100 p-4">
                  <span className="text-xs font-bold text-amber-600 uppercase block mb-1">आकार</span>
                  <span className="font-medium text-gray-800">{karmaSadhana.yantra.dimension}</span>
                </div>
                <div className="bg-white rounded-lg border border-amber-100 p-4">
                  <span className="text-xs font-bold text-amber-600 uppercase block mb-1">प्रतिष्ठा विधि</span>
                  <span className="font-medium text-gray-800">{karmaSadhana.yantra.installation}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-orange-100 rounded-lg border border-orange-200 p-4">
                  <span className="text-xs font-bold text-orange-700 uppercase block mb-1">कर्म प्रभाव</span>
                  <span className="font-medium text-orange-900">{karmaSadhana.yantra.effect}</span>
                </div>
                <div className="bg-white rounded-lg border border-amber-100 p-4">
                  <span className="text-xs font-bold text-amber-600 uppercase block mb-1">जन्म-नक्षत्र तीर्थंकर यंत्र</span>
                  <p className="text-sm text-gray-700">
                    श्री <strong>{profile.tirthankarAffinity}</strong> भगवान का यंत्र। भोजपत्र पर अष्टगंध से निर्माण।
                    वर्तमान <strong>{profile.currentDasha?.lord_hindi}</strong> दशा में रक्षण हेतु।
                  </p>
                </div>
              </div>
            </div>
          </div>
    </>
  )}
    </div>
  );
}
