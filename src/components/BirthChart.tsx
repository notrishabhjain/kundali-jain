import React from 'react';
import { Moon, Orbit, Search, Sparkles } from 'lucide-react';
import { UserProfile } from '../lib/analysisSynthesizer';
import { getNakshatraByName } from '../data/nakshatras';
import { GRAHAS } from '../data/grahas';
import { generatePredictions } from '../lib/predictionEngine';
import { getKarmaSadhana } from '../data/sadhana';

interface BirthChartProps {
  profile: UserProfile;
  part?: 1 | 2;
}

export default function BirthChart({ profile, part }: BirthChartProps) {
  const nakshatraData = getNakshatraByName(profile.birthNakshatra);
  const nakshatraHindi = profile.birthNakshatraHindi || profile.birthNakshatra;
  const nakshatraNatureHindi = profile.nakshatraNatureHindi || '';

  // Karma → primary graha mapping (Jain framework)
  const KARMA_GRAHA_MAP: Record<string, string[]> = {
    'Gyanavaraniya':    ['Guru', 'Budha'],
    'Darshanavaraniya': ['Surya', 'Chandra'],
    'Mohaniya':         ['Shukra', 'Chandra'],
    'Charitra Mohaniya':['Shukra', 'Mangal'],
    'Vedaniya':         ['Shukra', 'Chandra'],
    'Antaraya':         ['Mangal', 'Shani'],
    'Naam':             ['Chandra', 'Shukra'],
    'Gotra':            ['Shani', 'Mangal'],
    'Ayushya':          ['Shani', 'Surya'],
  };

  // Build Jain karma-based graha cards.
  // The dasha lord IS a Jain karma name (e.g. 'Mohaniya') — look up its sadhana directly.
  // Also show the 2 grahas associated with the dominant karma for deeper context.
  const dashaKarmaEn = profile.currentDasha?.lord || profile.dominantKarmaEn;
  const dashaSadhana = getKarmaSadhana(dashaKarmaEn);
  const dominantSadhana = getKarmaSadhana(profile.dominantKarmaEn);
  const karmaGrahaNames = KARMA_GRAHA_MAP[profile.dominantKarmaEn] || ['Mangal', 'Shani'];

  // Card 1: Current dasha karma
  // Card 2 & 3: The vedic grahas linked to dominant karma (for supplementary context)
  const personalGrahas = [
    {
      name: `${profile.currentDasha?.lord_hindi || dashaKarmaEn} (वर्तमान महादशा कर्म)`,
      state: 'महादशाधिपति — प्रबल उदय काल',
      domain: dashaSadhana.karmaHindi || 'कर्म-उदय',
      effect: `${profile.currentDasha?.lord_hindi || dashaKarmaEn} कर्म का उदय: ${dashaSadhana.statusWhenDominant}`,
      karma: dashaSadhana.statusWhenDominant,
      remedy: `${dashaSadhana.primaryMantra.count} बार ${dashaSadhana.primaryMantra.text} (${dashaSadhana.primaryMantra.timing})`
    },
    ...karmaGrahaNames.slice(0, 2).map(gName => {
      const g = GRAHAS.find(gr => gr.name === gName);
      return {
        name: g ? `${g.hindi_name} (${g.name})` : gName,
        state: g?.nature === 'shubha' ? 'शुभ (Benefic)' : g?.nature === 'ashubha' ? 'अशुभ (Malefic)' : 'मिश्र (Mixed)',
        domain: g?.jyotishi_dev_type || 'ज्योतिषी ग्रह',
        effect: g?.karma_connection || profile.dominantKarma,
        karma: profile.dominantKarma,
        remedy: dominantSadhana.samanyaUpaya || g?.sadhana || 'णमोकार मंत्र का जाप'
      };
    })
  ];

  const predictions = generatePredictions(profile);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {(!part || part === 1) && (
        <>
          {/* Intro */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">कर्म अक्स (आपकी कुण्डली का आध्यात्मिक स्वरूप)</h2>
            <p className="text-slate-600">
              जैन ज्योतिष में कुण्डली भविष्य बताने का यंत्र नहीं है, बल्कि आपके द्वारा पिछले जन्मों में बाँधे गए कर्मों (पुर्वोपार्जित कर्म) का 'वर्तमान ब्लूप्रिंट' है। यह दर्शाती है कि आपकी आत्मा विकास के किस चरण में है।
            </p>
          </div>

          {/* Nakshatra Analysis */}
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-indigo-50 border-b border-indigo-100 p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                  <Moon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-950">जन्म-नक्षत्र विश्लेषण</h3>
                  <p className="text-indigo-700 font-medium">आपका जन्म-नक्षत्र: {nakshatraHindi} (पाद {profile.nakshatraPada || 1})</p>
                </div>
              </div>
              <div className="bg-white px-4 py-1.5 rounded-full border border-indigo-200 text-sm font-bold text-indigo-800 uppercase tracking-wide">
                {nakshatraHindi} / {nakshatraNatureHindi || 'शुभ'} स्वभाव
              </div>
            </div>
            
            <div className="p-6 md:p-8 flex-1">
              <div className="prose prose-indigo max-w-none text-gray-800 text-lg leading-relaxed">
                <p className="text-xl text-indigo-900 font-medium mb-4">
                  {profile.name} जी, आप <strong>{nakshatraHindi}</strong> नक्षत्र ({nakshatraNatureHindi} — पाद {profile.nakshatraPada || 1}) में जन्मे हैं। <br className="hidden sm:block" />
                  यह नक्षत्र भगवान <strong>{profile.tirthankarAffinity || profile.tirthankarAffinityHindi}</strong> से विशेष आत्मिक-सम्बन्ध रखता है।
                  आपकी राशि <strong>{profile.birthRashi || ''}</strong> है।
                </p>

                <p>
                  {nakshatraData
                    ? `${nakshatraHindi} नक्षत्र के प्रभाव से आपमें ${nakshatraData.spiritual_traits} के गुण स्वाभाविक हैं। ${nakshatraData.karma_manifestation}`
                    : `इस नक्षत्र के प्रभाव से आपका स्वभाव स्थिर और आध्यात्मिक झुकाव वाला है।`
                  } {profile.dominantKarma} कर्म की उदीरणा आपके जीवन में अधिक होने से यह स्थिति और प्रबल हो जाती है।
                </p>
                
                <div className="mt-6 grid sm:grid-cols-2 gap-6">
                  <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-600 uppercase mb-2 block">आपकी सबसे बड़ी आध्यात्मिक संभावना</span>
                    <p className="text-emerald-900 font-medium tracking-wide">
                      {nakshatraData?.tirthankaras_born.length
                        ? `${nakshatraHindi} नक्षत्र ${nakshatraData.tirthankaras_born.join(', ')} का जन्म-नक्षत्र है। इस नक्षत्र में जन्मे व्यक्ति में ${nakshatraNatureHindi} आध्यात्मिक क्षमता होती है।`
                        : `${nakshatraHindi} नक्षत्र की आध्यात्मिक संभावना ${nakshatraData?.spiritual_traits || 'ध्यान और साधना'} में निहित है।`
                      }
                    </p>
                  </div>
                  <div className="bg-rose-50/50 p-5 rounded-xl border border-rose-100">
                    <span className="text-xs font-bold text-rose-600 uppercase mb-2 block">प्रमुख कर्म-बाधा और साधना</span>
                    <p className="text-rose-900 font-medium tracking-wide">
                      {nakshatraData?.karma_manifestation || `${profile.dominantKarma} कर्म का उदय।`}
                      <span className="block mt-2 text-sm text-rose-700">
                        <strong>साधना:</strong> {nakshatraData?.sadhana}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {(!part || part === 2) && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Graha Avastha */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-emerald-50 border-b border-emerald-100 p-5 flex items-center gap-3">
            <Orbit className="text-emerald-600 w-6 h-6 shrink-0" />
            <h3 className="text-lg font-bold text-emerald-950">ग्रह अवस्था और कर्म-नैरेटिव</h3>
          </div>
          <div className="p-6 flex-1 space-y-6">
            {personalGrahas.map((graha, idx) => (
              <div key={idx} className="relative pl-4 border-l-2 border-emerald-200 hover:border-emerald-500 transition-colors">
                <p className="text-gray-800 leading-relaxed">
                  आपकी कुण्डली में <strong>{graha.name}</strong> की स्थिति <strong>{graha.state}</strong> है।<br/>
                  यह आपके <em>{graha.domain}</em> में <em>{graha.effect}</em>।
                </p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">इसका मूल</span>
                    <span className="font-medium text-gray-700">{graha.karma}</span>
                  </div>
                  <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-600/70 uppercase block mb-0.5">जैन उपाय</span>
                    <span className="font-medium text-emerald-800">{graha.remedy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictions Analysis */}
        <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-violet-50 border-b border-violet-100 p-5 flex items-center gap-3">
            <Search className="text-violet-600 w-6 h-6 shrink-0" />
            <h3 className="text-lg font-bold text-violet-950">जीवन के 7 क्षेत्र (Life Domain Predictions)</h3>
          </div>
          <div className="p-6 flex-1 space-y-6">
            {predictions.map((pred, idx) => (
              <div key={idx} className="bg-gray-50/50 p-5 rounded-xl border border-gray-200/60 transition-all hover:bg-white hover:shadow-md hover:border-violet-200">
                <div className="border-b border-gray-200 pb-3 mb-3">
                  <h4 className="text-lg font-bold text-violet-900 mb-1">{pred.hindiDomain} ({pred.domain})</h4>
                  <p className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 ${pred.isFavorable ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <Sparkles className="w-3 h-3" /> {pred.isFavorable ? 'अनुकूल स्थिति (Favorable)' : 'कर्म-परीक्षा काल (Testing Period)'}
                  </p>
                </div>
                <div className="space-y-4 text-sm mt-4">
                  <div>
                    <span className="font-bold text-gray-700 block mb-1">पूर्वानुमान:</span>
                    <p className="text-gray-600 leading-relaxed">{pred.prediction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}
      
    </div>
  );
}
