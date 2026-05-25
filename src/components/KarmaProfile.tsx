import React from 'react';
import { Scale, Info, Zap, ShieldAlert, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../lib/engineFacade';
import { KARMA_SADHANA } from '../data/sadhana';
import { calculateKarmaProfile, KarmaState } from '../lib/karmaEngine';

interface KarmaProfileProps {
  profile: UserProfile;
}

interface KarmaRow {
  karmaEn: string;
  name: string;
  color: string;
  barColor: string;
  intensity: number;
  state: 'Udaya' | 'Satta' | 'Nirjara';
  status: string;
  isDominant: boolean;
  isDashaActive: boolean;
}

function buildRow(
  karmaEn: string,
  name: string,
  color: string,
  barColor: string,
  ks: KarmaState | undefined,
  profile: UserProfile
): KarmaRow {
  const intensity = ks?.intensity ?? 30;
  const state = ks?.state ?? 'Satta';
  const sadhana = KARMA_SADHANA[karmaEn];
  const isDominant = karmaEn === profile.dominantKarmaEn;
  const isDashaActive = karmaEn === profile.currentDasha?.lord;

  // Build a dynamic status that reflects intensity + dasha + dominance
  let status: string;
  if (sadhana) {
    if (intensity >= 80) {
      status = `तीव्र उदय (${intensity}%) — ${sadhana.statusWhenDominant}`;
    } else if (intensity >= 60) {
      status = `प्रबल उदय (${intensity}%) — ${sadhana.statusWhenDominant}`;
    } else if (intensity >= 40) {
      status = `मध्यम सत्ता (${intensity}%) — ${sadhana.statusWhenNormal}`;
    } else {
      status = `निर्जरा-मुख (${intensity}%) — ${sadhana.statusWhenNormal}`;
    }
  } else {
    status = `${intensity}% सत्ता`;
  }

  return { karmaEn, name, color, barColor, intensity, state, status, isDominant, isDashaActive };
}

export default function KarmaProfile({ profile }: KarmaProfileProps) {
  // Dynamic computation: intensity reflects dasha + dominance + gunasthana
  const karmaStates = calculateKarmaProfile(
    profile.dominantKarmaEn,
    profile.currentDasha?.lord || 'Mohaniya',
    profile.gunasthana || 1
  );
  const findKs = (en: string) => karmaStates.find(k => k.karmaEn === en);

  const ghatiyaKarmas: KarmaRow[] = [
    buildRow('Gyanavaraniya',    'ज्ञानावरणीय', 'bg-amber-100 border-amber-300 text-amber-900', 'bg-amber-500', findKs('Gyanavaraniya'),    profile),
    buildRow('Darshanavaraniya', 'दर्शनावरणीय', 'bg-blue-100 border-blue-300 text-blue-900',     'bg-blue-500',  findKs('Darshanavaraniya'), profile),
    buildRow('Mohaniya',         'मोहनीय',       'bg-rose-100 border-rose-400 text-rose-900',     'bg-rose-500',  findKs('Mohaniya'),         profile),
    buildRow('Antaraya',         'अंतराय',       'bg-slate-100 border-slate-300 text-slate-900',   'bg-slate-500', findKs('Antaraya'),         profile),
  ];

  const aghatiyaKarmas: KarmaRow[] = [
    buildRow('Vedaniya', 'वेदनीय', 'bg-emerald-50 border-emerald-200 text-emerald-800',  'bg-emerald-500',  findKs('Vedaniya'), profile),
    buildRow('Ayushya',  'आयुष्य',  'bg-indigo-50 border-indigo-200 text-indigo-800',    'bg-indigo-500',   findKs('Ayushya'),  profile),
    buildRow('Naam',     'नाम',    'bg-purple-50 border-purple-200 text-purple-800',     'bg-purple-500',   findKs('Naam'),     profile),
    buildRow('Gotra',    'गोत्र',   'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800', 'bg-fuchsia-500',  findKs('Gotra'),    profile),
  ];

  const allKarmas = [...ghatiyaKarmas, ...aghatiyaKarmas];
  const totalIntensity = allKarmas.reduce((s, k) => s + k.intensity, 0);
  const avgIntensity = Math.round(totalIntensity / allKarmas.length);
  const dominantRow = allKarmas.find(k => k.isDominant);
  const dashaRow = allKarmas.find(k => k.isDashaActive);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-rose-50 p-6 rounded-xl border border-rose-200 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-rose-900 mb-2 flex items-center justify-center sm:justify-start gap-2">
          <Scale className="w-6 h-6 text-rose-600" /> अष्ट-कर्म मण्डला (आपका संचित कर्म-चक्र)
        </h2>
        <p className="text-rose-800 mb-3">
          जैन दर्शन के अनुसार आत्मा अनन्त शक्तिशाली है, किंतु वह ८ प्रकार के कर्मों से आच्छादित है।
          आपकी जन्म-कुण्डली, वर्तमान <strong>{profile.currentDasha?.lord_hindi}</strong> दशा एवं
          <strong> गुणस्थान {profile.gunasthana}</strong> के संयोग से प्रत्येक कर्म की सघनता निम्न प्रकार है।
        </p>
        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          <div className="bg-white p-3 rounded-lg border border-rose-100">
            <span className="text-[10px] font-bold text-rose-500 uppercase block mb-1">प्रबल कर्म (जन्म आधारित)</span>
            <span className="text-base font-bold text-rose-800">{profile.dominantKarma}</span>
            <span className="block text-xs text-rose-600 mt-0.5">{dominantRow?.intensity}% सघनता</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-rose-100">
            <span className="text-[10px] font-bold text-rose-500 uppercase block mb-1">वर्तमान दशा कर्म</span>
            <span className="text-base font-bold text-rose-800">{profile.currentDasha?.lord_hindi || '-'}</span>
            <span className="block text-xs text-rose-600 mt-0.5">{dashaRow?.intensity || '-'}% सघनता</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-rose-100">
            <span className="text-[10px] font-bold text-rose-500 uppercase block mb-1">कुल कर्म-भार (औसत)</span>
            <span className="text-base font-bold text-rose-800">{avgIntensity}%</span>
            <span className="block text-xs text-rose-600 mt-0.5">गुणस्थान {profile.gunasthana} पर</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Visual Mandala */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center relative min-h-[400px]">
          {/* A simple pure CSS mandala using grid/flex & absolute positioning */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Aghatiya Outer Ring */}
            <div className="absolute inset-0 bg-blue-50 rounded-full border border-dashed border-blue-200 animate-[spin_120s_linear_infinite]" />
            <div className="absolute inset-2 sm:inset-4 bg-orange-50/50 rounded-full border border-orange-100 animate-[spin_80s_linear_infinite_reverse]" />

            {/* Ghatiya Inner Core */}
            <div className="z-10 bg-white w-32 h-32 sm:w-40 sm:h-40 rounded-full shadow-lg border-4 border-rose-100 flex items-center justify-center relative">
              <div className="text-center">
                <span className="block text-xl sm:text-2xl font-bold text-rose-600">आत्मा</span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium">चेतन स्वरूप</span>
              </div>
            </div>

            {/* Labels - positioned around */}
            <div className="absolute w-full h-full inset-0 z-20">
              {/* Top - Mohaniya */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 bg-rose-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 z-30">
                <Zap className="w-3 h-3" /> मोहनीय ({findKs('Mohaniya')?.intensity}%)
              </div>
              {/* Bottom - Antaray */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                अंतराय ({findKs('Antaraya')?.intensity}%)
              </div>
              {/* Left - Gyanavaraniya */}
              <div className="absolute left-0 top-1/2 -translate-x-1/4 -translate-y-1/2 bg-amber-400 text-amber-950 text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                ज्ञान ({findKs('Gyanavaraniya')?.intensity}%)
              </div>
              {/* Right - Darshanavaraniya */}
              <div className="absolute right-0 top-1/2 translate-x-1/4 -translate-y-1/2 bg-blue-400 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                दर्शन ({findKs('Darshanavaraniya')?.intensity}%)
              </div>

              {/* Aghatiya Corners */}
              <div className="absolute top-[10%] left-[10%] bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md border border-emerald-200">
                वेदनीय {findKs('Vedaniya')?.intensity}%
              </div>
              <div className="absolute top-[10%] right-[10%] bg-indigo-100 text-indigo-800 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md border border-indigo-200">
                आयु {findKs('Ayushya')?.intensity}%
              </div>
              <div className="absolute bottom-[10%] left-[10%] bg-purple-100 text-purple-800 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md border border-purple-200">
                नाम {findKs('Naam')?.intensity}%
              </div>
              <div className="absolute bottom-[10%] right-[10%] bg-fuchsia-100 text-fuchsia-800 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md border border-fuchsia-200">
                गोत्र {findKs('Gotra')?.intensity}%
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500 uppercase tracking-widest font-medium">
            अष्ट-कर्म वर्तमान सघनता
          </div>
        </div>

        {/* Detailed Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
            <div className="bg-rose-50/80 border-b border-rose-100 p-4">
              <h3 className="font-bold text-rose-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" /> घाती कर्म (आत्म-घातक)
              </h3>
              <p className="text-xs text-rose-700 mt-1">ये कर्म आत्मा के मूल गुणों (ज्ञान, दर्शन, सुख, वीर्य) का घात करते हैं। इन्हें नष्ट करना मुख्य ध्येय है।</p>
            </div>
            <div className="p-4 grid gap-3">
              {ghatiyaKarmas.map((k, i) => (
                <div key={i} className={`p-3 rounded-xl border ${k.color} ${k.isDominant ? 'shadow-md ring-2 ring-rose-400 ring-offset-1' : ''}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="font-bold flex items-center gap-1.5 flex-wrap">
                      {k.isDominant && <Zap className="w-4 h-4 text-rose-600" />}
                      {k.name}
                      {k.isDashaActive && <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">वर्तमान दशा</span>}
                    </span>
                    <span className="text-sm font-bold flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider opacity-70">{k.state === 'Udaya' ? 'उदय' : k.state === 'Nirjara' ? 'निर्जरा' : 'सत्ता'}</span>
                      <span className="bg-white px-2 py-0.5 rounded-full border border-current/20 text-sm">{k.intensity}%</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden border border-current/10 mb-2">
                    <div className={`h-full ${k.barColor} rounded-full transition-all duration-700`} style={{ width: `${k.intensity}%` }} />
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{k.status}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
            <div className="bg-indigo-50/80 border-b border-indigo-100 p-4">
              <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-600" /> अघाती कर्म (शारीरिक / बाह्य)
              </h3>
              <p className="text-xs text-indigo-700 mt-1">ये कर्म केवल शरीर, आयु, सुख-सुविधाओं का निर्धारण करते हैं। ज्ञानी इनसे प्रभावित नहीं होते।</p>
            </div>
            <div className="p-4 grid gap-3">
              {aghatiyaKarmas.map((k, i) => (
                <div key={i} className={`p-3 rounded-xl border ${k.color} ${k.isDominant ? 'ring-2 ring-indigo-400 ring-offset-1 shadow-md' : ''}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="font-bold flex items-center gap-1.5 flex-wrap">
                      {k.isDominant && <Zap className="w-4 h-4 text-indigo-600" />}
                      {k.name}
                      {k.isDashaActive && <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">वर्तमान दशा</span>}
                    </span>
                    <span className="text-sm font-bold flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider opacity-70">{k.state === 'Udaya' ? 'उदय' : k.state === 'Nirjara' ? 'निर्जरा' : 'सत्ता'}</span>
                      <span className="bg-white px-2 py-0.5 rounded-full border border-current/20 text-sm">{k.intensity}%</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden border border-current/10 mb-2">
                    <div className={`h-full ${k.barColor} rounded-full transition-all duration-700`} style={{ width: `${k.intensity}%` }} />
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{k.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Pancham Kaal reminder — Digambar Jain rule */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-xl">
        <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" /> पंचम काल का सिद्धान्त (दिगम्बर मान्यता)
        </h4>
        <p className="text-amber-950 text-sm leading-relaxed">
          हम वर्तमान में <strong>पंचम काल (दुषमा)</strong> में हैं, जो ईस्वी पूर्व 525 के लगभग आरम्भ हुआ और लगभग
          21,000 वर्षों तक रहेगा। इस काल में <strong>मोक्ष असम्भव है</strong>, क्योंकि चारित्र मोहनीय कर्म का
          सर्वथा क्षय सम्भव नहीं। तथापि — <strong>सम्यग्दर्शन</strong>, <strong>पुण्य-बन्ध</strong> और
          <strong> देव-गति का बन्ध</strong> इस काल में भी सम्भव है। आपकी साधना का लक्ष्य यही तीन हैं —
          मोक्ष नहीं, अपितु सम्यक्त्व और शुभ गति का बन्ध।
        </p>
      </div>
    </div>
  );
}
