import React, { useState } from 'react';
import { MapPin, Star, Navigation, Shield, Mountain, Heart } from 'lucide-react';
import { UserProfile } from '../lib/analysisSynthesizer';
import { TIRTHANKARAS } from '../data/tirthankaras';

const KARMA_EN_TO_HI: Record<string, string> = {
  Gyanavaraniya:    'ज्ञानावरणीय',
  Darshanavaraniya: 'दर्शनावरणीय',
  Vedaniya:         'वेदनीय',
  Mohaniya:         'मोहनीय',
  Ayushya:          'आयुष्य',
  Naam:             'नाम',
  Gotra:            'गोत्र',
  Antaraya:         'अंतराय',
};

interface TirthaYatraProps {
  profile: UserProfile;
  forExport?: boolean;
  part?: 1 | 2;
}

interface TirthaKshetra {
  id: string;
  nameHindi: string;
  location: string;
  tirthankaraNames: string[];
  karmasAddressed: string[];
  significance: string;
  sadhana: string;
  bestTiming: string;
  priority: 'param' | 'ati' | 'sadharana';
}

const TIRTHA_KSHETRAS: TirthaKshetra[] = [
  {
    id: 'sammeta',
    nameHindi: 'सम्मेद शिखर (शिखरजी)',
    location: 'झारखंड',
    tirthankaraNames: ['अजितनाथ', 'संभवनाथ', 'सुमतिनाथ', 'सुपार्श्वनाथ', 'चन्द्रप्रभ', 'सीतलनाथ', 'पुष्पदंत', 'शीतलनाथ', 'श्रेयांसनाथ', 'वासुपूज्य', 'विमलनाथ', 'अनंतनाथ', 'धर्मनाथ', 'शांतिनाथ', 'कुंथुनाथ', 'अरनाथ', 'मल्लिनाथ', 'मुनिसुव्रतनाथ', 'नमिनाथ', 'नेमिनाथ', 'पारसनाथ'],
    karmasAddressed: ['Gyanavaraniya', 'Darshanavaraniya', 'Mohaniya', 'Antaraya'],
    significance: '२० तीर्थंकरों की मोक्ष-भूमि। यहाँ जाना केवल तीर्थ नहीं — यह सीधे मोक्ष-ऊर्जा में स्नान है। २७ किमी परिक्रमा नंगे पाँव करना जीवन का सबसे बड़ा तप है।',
    sadhana: 'परिक्रमा के दौरान प्रत्येक टोंक पर "णमो सिद्धाणं" का उच्चारण। मौन व्रत रखें। पूरी परिक्रमा में णमोकार मंत्र का मानसिक जाप करते रहें।',
    bestTiming: 'कार्तिक, माघ, चैत्र माह; तीर्थंकर कल्याणक तिथि',
    priority: 'param'
  },
  {
    id: 'shravanabelagola',
    nameHindi: 'श्रवणबेलगोल (गोम्मटेश्वर)',
    location: 'कर्नाटक',
    tirthankaraNames: ['बाहुबली (ऋषभदेव के पुत्र)'],
    karmasAddressed: ['Mohaniya', 'Charitra Mohaniya', 'Antaraya'],
    significance: '५७ फुट की एकाश्म बाहुबली प्रतिमा। बाहुबली ने एक वर्ष ध्यान में खड़े रहकर मोहनीय कर्म को जीता। इस दर्शन से मोहनीय कर्म पर सर्वोच्च प्रहार होता है।',
    sadhana: 'प्रतिमा दर्शन नीचे से ऊपर — पाँव से शिखर तक — वैराग्य भावना के साथ करें। "बाहुबली भगवान जैसी वैराग्य शक्ति मुझे मिले" — यह भावना रखें।',
    bestTiming: 'महामस्तकाभिषेक वर्ष (प्रत्येक १२ वर्ष); या माघ-चैत्र माह',
    priority: 'param'
  },
  {
    id: 'pawapuri',
    nameHindi: 'पावापुरी (जल मंदिर)',
    location: 'बिहार',
    tirthankaraNames: ['भगवान महावीर'],
    karmasAddressed: ['Ayushya', 'Naam', 'Gotra'],
    significance: 'भगवान महावीर की निर्वाण-भूमि। जल के बीच स्थित मंदिर में उनके पदचिह्नों का दर्शन अत्यंत शुभ। यहाँ आत्मा को मोक्ष-ऊर्जा का स्पर्श होता है।',
    sadhana: 'जल मंदिर में प्रवेश के समय पूर्ण मौन। "णमो सिद्धाणं" का मानसिक जाप। भगवान महावीर का निर्वाण-कल्याणक स्मरण।',
    bestTiming: 'कार्तिक कृष्ण प्रतिपदा (महावीर निर्वाण / दीपावली)',
    priority: 'param'
  },
  {
    id: 'girnar',
    nameHindi: 'गिरनार',
    location: 'गुजरात',
    tirthankaraNames: ['नेमिनाथ (२२वें तीर्थंकर)'],
    karmasAddressed: ['Mohaniya', 'Charitra Mohaniya', 'Vedaniya'],
    significance: 'नेमिनाथ भगवान ने विवाह त्यागकर वैराग्य लिया और गिरनार पर मोक्ष पाया। तीव्र वैराग्य और मोहनीय कर्म की निर्जरा का उत्तम स्थान।',
    sadhana: 'पर्वत चढ़ाई करते हुए णमोकार मंत्र। शिखर पर नेमिनाथ मंदिर में ध्यान। नेमिनाथ दीक्षा-कल्याणक का स्मरण।',
    bestTiming: 'श्रावण माह; नेमिनाथ कल्याणक तिथियाँ',
    priority: 'ati'
  },
  {
    id: 'kshatriyakund',
    nameHindi: 'क्षत्रियकुण्ड / वैशाली',
    location: 'बिहार',
    tirthankaraNames: ['भगवान महावीर (जन्मभूमि)'],
    karmasAddressed: ['Naam', 'Gotra', 'Vedaniya'],
    significance: 'भगवान महावीर की जन्मभूमि। जहाँ तीर्थंकर आत्मा अवतरित हुई — यहाँ उच्च-गोत्र ऊर्जा प्रबल है। जन्म कल्याणक का स्मरण नाम कर्म को शुद्ध करता है।',
    sadhana: 'जन्म स्थल पर ध्यान। "ॐ ह्रीं श्री महावीरस्वामिने नमः" — १०८ बार जाप। महावीर जन्म-कल्याणक का मानसिक अनुभव।',
    bestTiming: 'चैत्र शुक्ल त्रयोदशी (महावीर जयंती)',
    priority: 'ati'
  },
  {
    id: 'hastinapur',
    nameHindi: 'हस्तिनापुर',
    location: 'उत्तर प्रदेश',
    tirthankaraNames: ['शांतिनाथ', 'कुंथुनाथ', 'अरनाथ'],
    karmasAddressed: ['Gyanavaraniya', 'Darshanavaraniya'],
    significance: 'तीन तीर्थंकरों की जन्मभूमि। जैन जम्बूद्वीप रचना और सुमेरु मंदिर स्थित है। ज्ञानावरणीय और दर्शनावरणीय कर्म की निर्जरा हेतु उत्तम।',
    sadhana: 'जम्बूद्वीप में सुमेरु की परिक्रमा। सिद्धायतन में ध्यान। श्रुत पंचमी पर विशेष पूजा।',
    bestTiming: 'भादों शुक्ल पंचमी (श्रुत पंचमी)',
    priority: 'ati'
  },
  {
    id: 'kundalpur',
    nameHindi: 'कुण्डलपुर (नैनागिरि)',
    location: 'मध्य प्रदेश',
    tirthankaraNames: ['ऋषभदेव (बड़े बाबा)'],
    karmasAddressed: ['Naam', 'Gotra', 'Darshanavaraniya'],
    significance: 'विशाल ऋषभदेव प्रतिमा। दिगम्बर मुनियों की प्रमुख विहार-भूमि। बड़े बाबा का दर्शन गोत्र कर्म की निर्जरा में सहायक है।',
    sadhana: 'प्रातः अभिषेक का साक्षी बनें। "ॐ ह्रीं श्री ऋषभदेवाय नमः" — १०८ बार। स्थिर ध्यान।',
    bestTiming: 'चैत्र व अश्विन माह (ओली)',
    priority: 'sadharana'
  },
  {
    id: 'champapuri',
    nameHindi: 'चंपापुरी',
    location: 'बिहार',
    tirthankaraNames: ['वासुपूज्य (१२वें तीर्थंकर)'],
    karmasAddressed: ['Antaraya', 'Vedaniya'],
    significance: 'वासुपूज्य भगवान की जन्मभूमि। अंतराय और वेदनीय कर्म के क्षय के लिए विशेष निमित्त।',
    sadhana: '"ॐ ह्रीं श्री वासुपूज्यस्वामिने नमः" — १०८ बार। वासुपूज्य मंदिर में ध्यान।',
    bestTiming: 'फाल्गुन शुक्ल चतुर्दशी (वासुपूज्य जन्म)',
    priority: 'sadharana'
  }
];

const KARMA_TIRTHA_PRIORITY: Record<string, string[]> = {
  'Gyanavaraniya':    ['sammeta', 'hastinapur'],
  'Darshanavaraniya': ['sammeta', 'shravanabelagola'],
  'Mohaniya':         ['shravanabelagola', 'girnar'],
  'Charitra Mohaniya':['shravanabelagola', 'girnar'],
  'Vedaniya':         ['kshatriyakund', 'champapuri'],
  'Antaraya':         ['sammeta', 'champapuri'],
  'Naam':             ['pawapuri', 'kshatriyakund'],
  'Gotra':            ['pawapuri', 'kundalpur'],
  'Ayushya':          ['pawapuri', 'kshatriyakund'],
};

const PRIORITY_STYLE = {
  param:     { label: 'परम तीर्थ',   badge: 'bg-amber-100 text-amber-800 border-amber-300',  card: 'border-amber-200' },
  ati:       { label: 'अति पवित्र', badge: 'bg-orange-100 text-orange-800 border-orange-300', card: 'border-orange-200' },
  sadharana: { label: 'तीर्थ',       badge: 'bg-blue-50 text-blue-700 border-blue-200',       card: 'border-gray-200' },
};

export default function TirthaYatra({ profile, forExport, part }: TirthaYatraProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const recommendedIds = new Set<string>(KARMA_TIRTHA_PRIORITY[profile.dominantKarmaEn] || ['sammeta']);

  // Find tirthankaras sharing the user's birth nakshatra
  const nakshatraTirthankaras = TIRTHANKARAS.filter(
    t => t.birth_nakshatra.toLowerCase().includes(profile.birthNakshatra.toLowerCase().split(' ')[0])
  );

  const priorityOrder = { param: 0, ati: 1, sadharana: 2 };
  const sorted = [...TIRTHA_KSHETRAS].sort((a, b) => {
    const aRec = recommendedIds.has(a.id) ? 0 : 1;
    const bRec = recommendedIds.has(b.id) ? 0 : 1;
    if (aRec !== bRec) return aRec - bRec;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const sortedPart1 = sorted.slice(0, 4);
  const sortedPart2 = sorted.slice(4);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Header — only on first part */}
      {(!part || part === 1) && (
        <>
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-900 mb-2 flex items-center gap-2">
              <Mountain className="w-6 h-6 text-emerald-600" /> तीर्थ यात्रा मार्गदर्शन
            </h2>
            <p className="text-emerald-800 leading-relaxed">
              {profile.name} जी, आपके <strong>{profile.dominantKarma}</strong> कर्म और <strong>श्री {profile.tirthankarAffinity}</strong> की भक्ति के आधार पर नीचे तीर्थ-क्षेत्रों की प्राथमिकता निर्धारित की गई है।
              दिगम्बर परंपरा में तीर्थ यात्रा केवल पर्यटन नहीं — यह कर्म-भूमि की ऊर्जा में आत्मा को डुबोना है।
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">आपके लिए विशेष अनुशंसित:</span>
            {[...recommendedIds].map(id => {
              const t = TIRTHA_KSHETRAS.find(k => k.id === id);
              return t ? (
                <span key={id} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold border border-amber-300">
                  {t.nameHindi.split('(')[0].trim()}
                </span>
              ) : null;
            })}
          </div>
        </>
      )}
      {part === 2 && (
        <div className="bg-emerald-50 px-5 py-3 rounded-xl border border-emerald-100">
          <h2 className="font-bold text-emerald-900">तीर्थ यात्रा मार्गदर्शन (जारी) — अन्य तीर्थ-क्षेत्र</h2>
        </div>
      )}

      {/* Main grid — split by part */}
      <div className="grid md:grid-cols-2 gap-4">
        {(part === 2 ? sortedPart2 : part === 1 ? sortedPart1 : sorted).map(kshetra => {
          const isRec = recommendedIds.has(kshetra.id);
          const isSel = forExport ? true : selectedId === kshetra.id;
          const style = PRIORITY_STYLE[kshetra.priority];

          return (
            <div
              key={kshetra.id}
              onClick={forExport ? undefined : () => setSelectedId(isSel ? null : kshetra.id)}
              className={`rounded-xl border-2 overflow-hidden bg-white ${forExport ? '' : 'cursor-pointer transition-all'} ${
                isSel ? 'border-emerald-500 shadow-lg' :
                isRec ? 'border-amber-300 hover:border-amber-500' :
                `${style.card} hover:border-gray-300`
              }`}
            >
              <div className={`px-4 py-3 flex items-start justify-between gap-3 ${isSel ? 'bg-emerald-50' : isRec ? 'bg-amber-50/50' : 'bg-gray-50'}`}>
                <div className="flex items-start gap-3">
                  <MapPin className={`w-5 h-5 mt-0.5 shrink-0 ${isRec ? 'text-amber-600' : 'text-gray-400'}`} />
                  <div>
                    <h3 className="font-bold text-gray-900 text-base leading-tight">{kshetra.nameHindi}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{kshetra.location}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${style.badge}`}>{style.label}</span>
                  {isRec && <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">अनुशंसित</span>}
                </div>
              </div>

              <div className="px-4 py-2 border-t border-gray-100">
                <p className="text-xs text-orange-700 font-medium truncate">
                  <Star className="w-3 h-3 inline mr-1 text-orange-500" />
                  {kshetra.tirthankaraNames.slice(0, 3).join(', ')}{kshetra.tirthankaraNames.length > 3 ? ` +${kshetra.tirthankaraNames.length - 3}` : ''}
                </p>
              </div>

              {isSel && (
                <div className="px-4 pb-4 pt-2 space-y-3 border-t border-emerald-200">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide block mb-1">महत्व</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{kshetra.significance}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                    <span className="text-xs font-bold text-orange-700 uppercase block mb-1">साधना विधि</span>
                    <p className="text-sm text-orange-900 font-medium">{kshetra.sadhana}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Navigation className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-800"><strong>शुभ समय:</strong> {kshetra.bestTiming}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {kshetra.karmasAddressed.map(k => (
                      <span key={k} className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100 font-medium">{KARMA_EN_TO_HI[k] || k}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nakshatra-based tirthankara tirthas — part 2 only */}
      {(!part || part === 2) && nakshatraTirthankaras.length > 0 && (
        <div className="bg-white rounded-xl border border-indigo-200 overflow-hidden">
          <div className="bg-indigo-50 px-5 py-3 border-b border-indigo-100 flex items-center gap-2">
            <Heart className="text-indigo-600 w-5 h-5" />
            <h3 className="font-bold text-indigo-900">{profile.birthNakshatraHindi || profile.birthNakshatra} नक्षत्र के तीर्थंकर — उनकी तीर्थ-भूमियाँ</h3>
          </div>
          <div className="p-4 grid sm:grid-cols-2 gap-3">
            {nakshatraTirthankaras.map(t => (
              <div key={t.id} className="bg-indigo-50/40 p-3 rounded-lg border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-2">भगवान {t.hindi_name}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">जन्मभूमि:</span><span className="font-medium text-gray-800">{t.birth_place}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">निर्वाण:</span><span className="font-medium text-gray-800">{t.nirvana_place}</span></div>
                  <div className="mt-2 text-xs text-indigo-700 font-medium">{t.puja_benefit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3-year plan — part 2 only */}
      {(!part || part === 2) && <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-emerald-600 w-6 h-6" />
          <h3 className="text-xl font-bold text-gray-900">आपका ३-वर्षीय तीर्थ-संकल्प</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          {sorted.slice(0, 3).map((kshetra, i) => (
            <div key={kshetra.id} className={`p-4 rounded-lg border ${i === 0 ? 'bg-amber-50 border-amber-100' : i === 1 ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'}`}>
              <span className={`text-xs font-bold block mb-1 uppercase ${i === 0 ? 'text-amber-700' : i === 1 ? 'text-orange-700' : 'text-blue-700'}`}>वर्ष {i + 1}</span>
              <p className="font-bold text-gray-900">{kshetra.nameHindi.split('(')[0].trim()}</p>
              <p className={`text-xs mt-1 ${i === 0 ? 'text-amber-700' : i === 1 ? 'text-orange-700' : 'text-blue-700'}`}>{kshetra.bestTiming}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          <strong>ध्यान दें:</strong> यात्रा से पूर्व संयम, मौन और मानसिक शुद्धि अनिवार्य है। यात्रा के दौरान मांस, अंडे, प्याज, लहसुन का सेवन न करें।
        </p>
      </div>}

    </div>
  );
}
