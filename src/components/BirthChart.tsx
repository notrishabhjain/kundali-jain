import React from 'react';
import { Moon, Orbit, Search, Sparkles, Clock } from 'lucide-react';
import { UserProfile } from '../lib/engineFacade';
import { getNakshatraByName } from '../data/nakshatras';
import { GRAHAS } from '../data/grahas';
import { generatePredictions } from '../lib/predictionEngine';
import { getKarmaSadhana } from '../data/sadhana';
import { GRAHA_KARMA_MAPPINGS } from '../data/jainCosmology';
import FieldInfo from './FieldInfo';

interface BirthChartProps {
  profile: UserProfile;
  part?: 1 | 2;
}

export default function BirthChart({ profile, part }: BirthChartProps) {
  const nakshatraData = getNakshatraByName(profile.birthNakshatra);
  const nakshatraHindi = profile.birthNakshatraHindi || profile.birthNakshatra;
  const nakshatraNatureHindi = profile.nakshatraNatureHindi || '';

  // Graha-karma mappings relevant to dominant karma
  const dominantKarmaGrahas = GRAHA_KARMA_MAPPINGS.filter(
    m => m.indicatedKarma === profile.dominantKarmaEn ||
         m.indicatedKarma === profile.dominantKarmaEn.replace('Charitra ', '')
  );

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
                  <p className="text-indigo-700 font-medium flex items-center gap-1.5 flex-wrap">
                    आपका जन्म-नक्षत्र: {nakshatraHindi}
                    <FieldInfo field="birthNakshatra" />
                    <span>(पाद {profile.nakshatraPada || 1})</span>
                    <FieldInfo field="nakshatraPada" />
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-1.5">
                <div className="bg-white px-4 py-1.5 rounded-full border border-indigo-200 text-sm font-bold text-indigo-800 uppercase tracking-wide">
                  {nakshatraHindi} / {nakshatraNatureHindi || 'शुभ'} स्वभाव
                  <FieldInfo field="nakshatraNature" className="ml-1.5" />
                </div>
                {/* Birth sanctity is a separate claim from the Sanjna grade above
                    and is shown as its own badge, never folded into it. */}
                {profile.nakshatraBirthSanctity === 'param_shubha_by_birth' && (
                  <div className="bg-amber-50 px-4 py-1.5 rounded-full border border-amber-300 text-sm font-bold text-amber-800 tracking-wide">
                    परम शुभ — तीर्थंकर जन्म-नक्षत्र
                    <FieldInfo field="nakshatraBirthSanctity" className="ml-1.5" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 md:p-8 flex-1">
              <div className="prose prose-indigo max-w-none text-gray-800 text-lg leading-relaxed">
                <p className="text-xl text-indigo-900 font-medium mb-4">
                  {profile.name} जी, आप <strong>{nakshatraHindi}</strong> नक्षत्र ({nakshatraNatureHindi} — पाद {profile.nakshatraPada || 1}) में जन्मे हैं। <br className="hidden sm:block" />
                  यह नक्षत्र भगवान <strong>{profile.tirthankarAffinity || profile.tirthankarAffinityHindi}</strong> से विशेष आत्मिक-सम्बन्ध रखता है।<FieldInfo field="tirthankarAffinity" className="ml-1" />
                  आपकी राशि <strong>{profile.birthRashi || ''}</strong> है।<FieldInfo field="birthRashi" className="ml-1" />
                </p>

                {/* Both claims, stated together. Where the Tirthankara-birth
                    sanctity and the Sanjna muhurta grade diverge, the sentence
                    says so rather than letting one override the other silently. */}
                {profile.nakshatraStanding && (
                  <p className="bg-indigo-50/60 border-l-4 border-indigo-300 px-4 py-3 rounded-r-lg text-base text-indigo-900">
                    {profile.nakshatraStanding}
                    <FieldInfo field="nakshatraBirthSanctity" className="ml-1" />
                  </p>
                )}

                <p>
                  {nakshatraData
                    ? `${nakshatraHindi} नक्षत्र के प्रभाव से आपमें ${nakshatraData.spiritual_traits} के गुण स्वाभाविक हैं। ${nakshatraData.karma_manifestation}`
                    : `इस नक्षत्र के प्रभाव से आपका स्वभाव स्थिर और आध्यात्मिक झुकाव वाला है।`
                  } {profile.dominantKarma} कर्म की उदीरणा आपके जीवन में अधिक होने से यह स्थिति और प्रबल हो जाती है।<FieldInfo field="dominantKarma" className="ml-1" />
                </p>
                
                <div className="mt-6 grid sm:grid-cols-2 gap-6">
                  <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-600 uppercase mb-2 block">आपकी सबसे बड़ी आध्यात्मिक संभावना</span>
                    <p className="text-emerald-900 font-medium tracking-wide">
                      {/* Previously this sentence read "<nature> आध्यात्मिक क्षमता",
                          splicing the Sanjna muhurta grade into a statement about
                          spiritual capacity — so a Bharani birth was told it had
                          "अशुभ आध्यात्मिक क्षमता" despite hosting शान्तिनाथ. The two
                          claims are now kept apart. */}
                      {nakshatraData?.tirthankaras_born.length
                        ? `${nakshatraHindi} नक्षत्र ${nakshatraData.tirthankaras_born.join(', ')} का जन्म-नक्षत्र है — यह परम शुभ जन्म-सान्निध्य है। इस नक्षत्र में जन्मे व्यक्ति की आध्यात्मिक संभावना ${nakshatraData.spiritual_traits} में निहित है।`
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

      {(!part || part === 1) && profile.ishtakaal && (
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Ishtakaal */}
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
            <div className="bg-amber-50 border-b border-amber-100 p-4 flex items-center gap-3">
              <Clock className="text-amber-600 w-5 h-5 shrink-0" />
              <h3 className="text-base font-bold text-amber-950">इष्टकाल (जन्म-समय निर्देशांक)</h3>
              <FieldInfo field="ishtakaal" />
            </div>
            <div className="p-5 space-y-3 text-sm text-gray-700">
              <p className="text-amber-900 font-bold text-lg">{profile.ishtakaal.formatted}</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                सूर्योदय से जन्म-क्षण तक का व्यतीत काल। स्रोत: सूर्यप्रज्ञप्ति + PARITY-REPORT-2026 §"Precise Ishtakaal Conversion"
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                  <span className="block text-xl font-bold text-amber-800">{profile.ishtakaal.ghatis}</span>
                  <span className="text-[10px] text-amber-600 uppercase">घटी</span>
                </div>
                <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                  <span className="block text-xl font-bold text-amber-800">{profile.ishtakaal.palas}</span>
                  <span className="text-[10px] text-amber-600 uppercase">पल</span>
                </div>
                <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                  <span className="block text-xl font-bold text-amber-800">{profile.ishtakaal.vipalas}</span>
                  <span className="text-[10px] text-amber-600 uppercase">विपल</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                समतुल्य मुहूर्त: <strong>{profile.ishtakaal.equivalentMuhurtas}</strong> मुहूर्त |
                स्तोक: {profile.ishtakaal.microState.stokas} | लव: {profile.ishtakaal.microState.lavas}
              </p>
            </div>
          </div>

          {/* Jain Zodiac Projection */}
          {profile.jainZodiacProjection && (
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
              <div className="bg-indigo-50 border-b border-indigo-100 p-4 flex items-center gap-3">
                <Orbit className="text-indigo-600 w-5 h-5 shrink-0" />
                <h3 className="text-base font-bold text-indigo-950">जैन राशि-प्रक्षेपण (अभिजित सहित)</h3>
                <FieldInfo field="jainZodiacProjection" />
              </div>
              <div className="p-5 space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-indigo-800">
                    {Math.round(profile.jainZodiacProjection.graduatedMuhurtas)} मुहूर्त
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  सूर्यप्रज्ञप्ति के असमान नक्षत्र-विस्तार के अनुसार जन्म-चंद्र का स्थान।
                  स्रोत: SP-1 अध्याय ३; PARITY-REPORT-2026 §"Sidereal Geometry"
                </p>
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100 space-y-1">
                  <p className="text-sm font-semibold text-indigo-900">
                    सक्रिय नक्षत्र: {profile.jainZodiacProjection.activeNakshatra}
                  </p>
                  <p className="text-xs text-indigo-700">
                    नक्षत्र-शेष: {Math.round(profile.jainZodiacProjection.balanceWithinNakshatraMuhurtas * 10) / 10} मुहूर्त
                  </p>
                  <p className="text-xs text-indigo-600">
                    विस्तार-वर्ग: {profile.jainZodiacProjection.spanClass === 'long_span' ? 'विस्तृत (Long Span)' : profile.jainZodiacProjection.spanClass === 'short_span' ? 'संकुचित (Short Span)' : profile.jainZodiacProjection.spanClass === 'abhijit' ? 'अभिजित' : 'मानक (Standard)'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {(!part || part === 1) && dominantKarmaGrahas.length > 0 && (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
          <div className="bg-rose-50 border-b border-rose-100 p-4">
            <h3 className="text-base font-bold text-rose-950">ग्रह-कर्म संकेतक ({profile.dominantKarma})</h3>
            <p className="text-xs text-rose-700 mt-1">भद्रबाहु संहिता — ग्रह निमित्तज्ञान (सूचक), कारण नहीं</p>
          </div>
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            {dominantKarmaGrahas.map((m, idx) => (
              <div key={idx} className="bg-rose-50/50 rounded-lg p-3 border border-rose-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-rose-800 text-sm">{m.grahaHindi} ({m.graha})</span>
                  <span className="text-[10px] text-rose-500 font-medium">{m.karmaHindi}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{m.afflictionIndicator}</p>
              </div>
            ))}
          </div>
        </div>
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
