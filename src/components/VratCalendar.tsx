import React, { useMemo } from 'react';
import { Calendar, Moon, Sun, AlertCircle, Star } from 'lucide-react';
import { UserProfile, getUpcomingVratDates, UpcomingVrat } from '../lib/analysisSynthesizer';
import { NAKSHATRAS } from '../data/nakshatras';
import { JAIN_ANNUAL_FESTIVALS } from '../data/sadhana';

interface VratCalendarProps {
  profile: UserProfile;
}

const HINDI_DIGITS = ['०','१','२','३','४','५','६','७','८','९'];
const HINDI_MONTHS = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्तूबर','नवंबर','दिसंबर'];

function toHindiNum(n: number): string {
  return String(n).split('').map(c => HINDI_DIGITS[parseInt(c)] ?? c).join('');
}

function formatHindiDate(d: Date): string {
  return `${toHindiNum(d.getDate())} ${HINDI_MONTHS[d.getMonth()]} ${toHindiNum(d.getFullYear())}`;
}

function getTithiLabel(vrat: UpcomingVrat): string {
  const paksha = vrat.paksha === 'shukla' ? 'शुक्ल' : 'कृष्ण';
  return `${paksha} ${toHindiNum(vrat.tithiNum)} (${vrat.tithiHindi})`;
}

function getVratColor(type: UpcomingVrat['vratType']): string {
  switch (type) {
    case 'ekadashi':    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'chaturdashi': return 'bg-rose-100 text-rose-800 border-rose-200';
    case 'purnima':     return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'amavasya':    return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'nakshatra':   return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    default:            return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getVratTypeLabel(type: UpcomingVrat['vratType']): string {
  switch (type) {
    case 'ekadashi':    return 'एकादशी';
    case 'chaturdashi': return 'चतुर्दशी (पर्व तिथि)';
    case 'purnima':     return 'पूर्णिमा';
    case 'amavasya':    return 'अमावस्या';
    case 'nakshatra':   return 'नक्षत्र आधारित (व्यक्तिगत)';
    default:            return 'पर्व';
  }
}

export default function VratCalendar({ profile }: VratCalendarProps) {
  const birthNakshatraIndex = useMemo(() => {
    const idx = NAKSHATRAS.findIndex(n => n.name === profile.birthNakshatra);
    return idx >= 0 ? idx : 0;
  }, [profile.birthNakshatra]);

  const upcomingVrats = useMemo(
    () => getUpcomingVratDates(birthNakshatraIndex, 60).slice(0, 8),
    [birthNakshatraIndex]
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" /> व्रत एवं साधना कैलेंडर
        </h2>
        <p className="text-blue-800 mt-2">
          यह कैलेंडर आपके व्यक्तिगत जन्म-नक्षत्र ({profile.birthNakshatraHindi || profile.birthNakshatra}) और जैन पंचांग के अनुसार आगामी ६० दिनों की अनुकूल तिथियाँ प्रस्तुत करता है।
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center flex-wrap gap-4">
          <h3 className="text-xl font-bold text-gray-800">आगामी व्रत तिथियाँ</h3>
          <div className="flex gap-4 text-sm font-medium flex-wrap">
            <span className="flex items-center gap-1.5"><Moon className="w-4 h-4 text-indigo-500" /> नक्षत्र व्रत</span>
            <span className="flex items-center gap-1.5"><Sun className="w-4 h-4 text-rose-500" /> चतुर्दशी</span>
            <span className="flex items-center gap-1.5"><Sun className="w-4 h-4 text-emerald-500" /> एकादशी</span>
          </div>
        </div>

        <div className="p-6 divide-y divide-gray-100">
          {upcomingVrats.length === 0 ? (
            <p className="text-gray-500 text-center py-4">तिथियाँ गणना में त्रुटि — कृपया पुनः लोड करें।</p>
          ) : upcomingVrats.map((vrat, idx) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-bold text-lg text-gray-900">{vrat.name}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getVratColor(vrat.vratType)}`}>
                    {getVratTypeLabel(vrat.vratType)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <span>{formatHindiDate(vrat.date)}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <span>{getTithiLabel(vrat)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-900 mb-1">जैन पंचांग संदर्भ</h4>
          <p className="text-amber-800 text-sm leading-relaxed">
            जैन आगम के अनुसार प्रत्येक अष्टमी और चतुर्दशी को 'पर्व तिथि' माना जाता है। इन दिनों हरी सब्जी (सचित्त) का त्याग और ब्रह्मचर्य का पालन करना श्रावक का मूल कर्तव्य है। आपके '{profile.dominantKarma}' कर्म की प्रबलता को देखते हुए, इन पर्व तिथियों पर उपवास न कर सकें तो एकासन अवश्य करें।
          </p>
        </div>
      </div>

      {/* Annual Jain Festivals */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          <h3 className="text-xl font-bold text-gray-800">वार्षिक जैन पर्व-कैलेंडर</h3>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          {JAIN_ANNUAL_FESTIVALS.map((festival, idx) => (
            <div key={idx} className={`rounded-xl border p-4 ${festival.color}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-bold text-base">{festival.name}</h4>
                <span className="text-xs font-medium shrink-0 opacity-75">
                  {festival.approx_month} — {festival.tithi_shukla_krishna === 'shukla' ? 'शुक्ल' : 'कृष्ण'} {festival.tithi_num}
                </span>
              </div>
              <p className="text-xs font-semibold mb-1 opacity-90">{festival.karma_benefit}</p>
              <p className="text-xs opacity-75 leading-relaxed">{festival.sadhana}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
