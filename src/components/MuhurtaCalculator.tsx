import React, { useMemo } from 'react';
import { Calendar, Clock, Star, AlertCircle, Sun } from 'lucide-react';
import { UserProfile, getUpcomingVratDates, UpcomingVrat } from '../lib/analysisSynthesizer';
import { getKarmaSadhana } from '../data/sadhana';
import { NAKSHATRAS } from '../data/nakshatras';

interface MuhurtaCalculatorProps {
  profile: UserProfile;
}

const HINDI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const HINDI_MONTHS = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्तूबर', 'नवंबर', 'दिसंबर'];
const WEEKDAYS_HINDI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

function toHindiNum(n: number): string {
  return String(n).split('').map(d => HINDI_DIGITS[parseInt(d)]).join('');
}

function formatHindiDate(d: Date): string {
  return `${WEEKDAYS_HINDI[d.getDay()]}, ${toHindiNum(d.getDate())} ${HINDI_MONTHS[d.getMonth()]}`;
}

type Quality = 'uttam' | 'shubha' | 'samanya';

interface Muhurta {
  date: Date;
  vatType: UpcomingVrat['vratType'];
  title: string;
  sadhanaRecommended: string;
  timing: string;
  quality: Quality;
}

const VRAT_META: Record<UpcomingVrat['vratType'], { title: string; quality: Quality; timing: string }> = {
  ekadashi:    { title: 'एकादशी',      quality: 'uttam',   timing: 'ब्रह्म-मुहूर्त प्रातः ४:३०–६:०० बजे' },
  chaturdashi: { title: 'चतुर्दशी',    quality: 'uttam',   timing: 'प्रातः ५:०० या सांयकाल ५:३०–७:०० बजे' },
  purnima:     { title: 'पूर्णिमा',    quality: 'shubha',  timing: 'चन्द्रोदय के साथ — सांय ६:०० बजे+' },
  amavasya:    { title: 'अमावस्या',    quality: 'shubha',  timing: 'प्रातःकाल ५:००–८:०० बजे' },
  nakshatra:   { title: 'जन्म-नक्षत्र', quality: 'uttam',  timing: 'प्रातः ५:०० से ८:०० (या दोपहर)' },
};

const QUALITY_STYLE: Record<Quality, { label: string; color: string; bg: string; border: string; dot: string }> = {
  uttam:   { label: 'उत्तम मुहूर्त', color: 'text-amber-800',   bg: 'bg-amber-50',   border: 'border-amber-200',   dot: 'bg-amber-400' },
  shubha:  { label: 'शुभ मुहूर्त',   color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-400' },
  samanya: { label: 'सामान्य',       color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    dot: 'bg-blue-300' },
};

// Auspicious days keyed by Jain karma names (dasha lord output from dashaEngine)
const DASHA_LORD_DAYS: Record<string, string> = {
  Gyanavaraniya:    'बुधवार, गुरुवार',
  Darshanavaraniya: 'रविवार, सोमवार',
  Vedaniya:         'शुक्रवार, बुधवार',
  Mohaniya:         'शनिवार, बुधवार',
  Ayushya:          'शनिवार, रविवार',
  Naam:             'सोमवार, शुक्रवार',
  Gotra:            'शनिवार, मंगलवार',
  Antaraya:         'मंगलवार, रविवार',
};

export default function MuhurtaCalculator({ profile }: MuhurtaCalculatorProps) {
  const sadhana = getKarmaSadhana(profile.dominantKarmaEn);
  const nakshatraHindi = profile.birthNakshatraHindi || profile.birthNakshatra;
  const dashaLord = profile.currentDasha?.lord_hindi || profile.currentDashaLegacy || '-';
  const dashaLordEn = profile.currentDasha?.lord || 'Guru';
  const birthNakshatraIdx = useMemo(() => {
    const idx = NAKSHATRAS.findIndex(n => n.name === profile.birthNakshatra);
    return idx >= 0 ? idx : 0;
  }, [profile.birthNakshatra]);

  const muhurtas: Muhurta[] = useMemo(() => {
    const vrats = getUpcomingVratDates(birthNakshatraIdx, 90);
    return vrats.slice(0, 12).map((v): Muhurta => {
      const base = VRAT_META[v.vratType];
      const sadhanaText =
        v.vratType === 'nakshatra'
          ? `${nakshatraHindi} नक्षत्र: श्री ${profile.tirthankarAffinity} भगवान की विशेष पूजा + ${sadhana.primaryMantra.count} बार ${sadhana.primaryMantra.text}`
          : v.vratType === 'ekadashi'
            ? `उपवास + ${sadhana.primaryMantra.count} बार ${sadhana.primaryMantra.text} (${sadhana.primaryMantra.timing})`
            : v.vratType === 'chaturdashi'
              ? `${sadhana.secondaryMantra.stotraName} — ${sadhana.secondaryMantra.count} बार पाठ`
              : v.vratType === 'purnima'
                ? `पूर्णिमा व्रत + सिद्धचक्र पूजा। ${sadhana.samanyaUpaya}`
                : `अमावस्या: णमोकार मंत्र १०८ बार + ${sadhana.samanyaUpaya}`;

      return {
        date: v.date,
        vatType: v.vratType,
        title: base.title + (v.tithiHindi && v.tithiHindi !== base.title ? ` (${v.tithiHindi})` : ''),
        sadhanaRecommended: sadhanaText,
        timing: base.timing,
        quality: base.quality,
      };
    });
  }, [birthNakshatraIdx, nakshatraHindi, profile.tirthankarAffinity, sadhana]);

  const featured = muhurtas.slice(0, 3);
  const rest = muhurtas.slice(3);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Header */}
      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
        <h2 className="text-2xl font-bold text-indigo-900 mb-2 flex items-center gap-2">
          <Clock className="w-6 h-6 text-indigo-600" /> मुहूर्त एवं शुभ काल
        </h2>
        <p className="text-indigo-800 leading-relaxed">
          {profile.name} जी, आपके <strong>{nakshatraHindi}</strong> नक्षत्र, <strong>{dashaLord} महादशा</strong> और <strong>{profile.dominantKarma}</strong> कर्म के आधार पर आगामी ९० दिनों के शुभ तिथि-काल यहाँ प्रस्तुत हैं।
          इन तिथियों पर किया गया जाप और साधना सामान्य दिनों से कई गुना अधिक फलदायी है।
        </p>
      </div>

      {/* Dasha note */}
      <div className="flex items-start gap-3 bg-rose-50 p-4 rounded-xl border border-rose-200">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <p className="text-sm text-rose-800">
          <strong>{dashaLord} महादशा</strong> में साधना संकल्प <strong>एकादशी, पूर्णिमा या {nakshatraHindi} नक्षत्र-दिन</strong> पर प्रारंभ करें।
          दशा स्वामी के <strong>अनुकूल वार:</strong> {DASHA_LORD_DAYS[dashaLordEn] || 'गुरुवार, सोमवार'}।
          {profile.currentDasha?.antardashaInfo?.lord_hindi && (
            <> वर्तमान <strong>{profile.currentDasha.antardashaInfo.lord_hindi} अंतर्दशा</strong> में इन तिथियों की ऊर्जा और प्रबल है।</>
          )}
        </p>
      </div>

      {/* Featured 3 */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" /> आगामी विशेष तिथियाँ
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {featured.map((m, idx) => {
            const qs = QUALITY_STYLE[m.quality];
            return (
              <div key={idx} className={`rounded-xl border-2 p-5 flex flex-col gap-3 ${qs.bg} ${qs.border}`}>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-gray-900">{m.title}</h4>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border shrink-0 ${qs.border} ${qs.color}`}>{qs.label}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 shrink-0 text-gray-400" />
                  <span className="text-sm font-medium">{formatHindiDate(m.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-xs">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                  <span>{m.timing}</span>
                </div>
                <div className={`text-xs font-medium p-2 rounded-lg border ${qs.border} bg-white/60 text-gray-800`}>
                  <span className="font-bold text-gray-900 block mb-0.5">साधना:</span>
                  {m.sadhanaRecommended}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rest as table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="font-bold text-gray-800 text-sm">आगामी तिथियाँ (पूर्ण सूची)</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {rest.map((m, idx) => {
            const qs = QUALITY_STYLE[m.quality];
            return (
              <div key={idx} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <span className={`w-2 h-2 rounded-full shrink-0 ${qs.dot}`} />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-900 text-sm">{m.title}</span>
                  <span className="text-gray-500 text-xs ml-2 hidden sm:inline">— {m.sadhanaRecommended.split('+')[0].split('।')[0].trim()}</span>
                </div>
                <span className="text-xs text-gray-500 shrink-0">{formatHindiDate(m.date)}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border shrink-0 ${qs.bg} ${qs.border} ${qs.color}`}>{qs.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special karma timing */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-amber-900">{profile.dominantKarma} कर्म का विशेष काल</h3>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>शुभ तिथि:</strong> {sadhana.tapasya?.tithi || 'एकादशी / पूर्णिमा'} — इस तिथि पर <strong>{sadhana.tapasya?.anusthana || sadhana.primaryMantra.text}</strong> का अनुष्ठान करें।
          </p>
        </div>
        <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-200">
          <h3 className="font-bold text-indigo-900 mb-2">महायोग</h3>
          <p className="text-sm text-indigo-800 leading-relaxed">
            जब <strong>{nakshatraHindi} नक्षत्र</strong> और <strong>एकादशी</strong> एक ही दिन पड़ें — वह दिन महा-अनुष्ठान का दिन है।
            उस दिन <strong>{sadhana.primaryMantra.count} × २</strong> बार जाप करें।
          </p>
        </div>
      </div>

    </div>
  );
}
