import React from 'react';
import { Scale, Info, Zap, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../lib/analysisSynthesizer';
import { KARMA_SADHANA } from '../data/sadhana';

interface KarmaProfileProps {
  profile: UserProfile;
}

export default function KarmaProfile({ profile }: KarmaProfileProps) {
  const ghatiyaKarmas = [
    { karmaEn: 'Gyanavaraniya',    name: 'ज्ञानावरणीय', color: 'bg-amber-100 border-amber-300 text-amber-900' },
    { karmaEn: 'Darshanavaraniya', name: 'दर्शनावरणीय', color: 'bg-blue-100 border-blue-300 text-blue-900' },
    { karmaEn: 'Mohaniya',         name: 'मोहनीय',       color: 'bg-rose-100 border-rose-400 text-rose-900 font-bold' },
    { karmaEn: 'Antaraya',         name: 'अंतराय',       color: 'bg-slate-100 border-slate-300 text-slate-900' },
  ].map(k => {
    const isDominant = k.karmaEn === profile.dominantKarmaEn;
    const sadhana = KARMA_SADHANA[k.karmaEn];
    const status = sadhana
      ? (isDominant ? sadhana.statusWhenDominant : sadhana.statusWhenNormal)
      : (isDominant ? 'प्रबल उदय' : 'सामान्य');
    return { ...k, isDominant, status };
  });

  const aghatiyaKarmas = [
    { karmaEn: 'Vedaniya', name: 'वेदनीय', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
    { karmaEn: 'Ayushya',  name: 'आयु',    color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
    { karmaEn: 'Naam',     name: 'नाम',    color: 'bg-purple-50 border-purple-200 text-purple-800' },
    { karmaEn: 'Gotra',    name: 'गोत्र',  color: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800' },
  ].map(k => {
    const isDominant = k.karmaEn === profile.dominantKarmaEn;
    const sadhana = KARMA_SADHANA[k.karmaEn];
    const status = sadhana
      ? (isDominant ? sadhana.statusWhenDominant : sadhana.statusWhenNormal)
      : (isDominant ? 'प्रबल उदय' : 'सामान्य उदय');
    return { ...k, isDominant, status };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-rose-50 p-6 rounded-xl border border-rose-200 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-rose-900 mb-2 flex items-center justify-center sm:justify-start gap-2">
          <Scale className="w-6 h-6 text-rose-600" /> अष्ट-कर्म मण्डला (आपका संचित कर्म-चक्र)
        </h2>
        <p className="text-rose-800">
          जैन दर्शन के अनुसार आत्मा अनन्त शक्तिशाली है, किंतु वह ८ प्रकार के कर्मों से आच्छादित है। 
          आपकी कुण्डली के अनुसार <strong>{profile.dominantKarma}</strong> कर्म की इस समय प्रबलता है। 
          आपके कर्मों की वर्तमान स्थिति नीचे अष्टदल मण्डला में दर्शाई गई है।
        </p>
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
                <Zap className="w-3 h-3" /> मोहनीय (घाती)
              </div>
              {/* Bottom - Antaray */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                अंतराय (घाती)
              </div>
              {/* Left - Gyanavaraniya */}
              <div className="absolute left-0 top-1/2 -translate-x-1/4 -translate-y-1/2 bg-amber-400 text-amber-950 text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                ज्ञानावरणीय
              </div>
              {/* Right - Darshanavaraniya */}
              <div className="absolute right-0 top-1/2 translate-x-1/4 -translate-y-1/2 bg-blue-400 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                दर्शनावरणीय
              </div>

              {/* Aghatiya Corners */}
              <div className="absolute top-[10%] left-[10%] bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md border border-emerald-200">
                वेदनीय
              </div>
              <div className="absolute top-[10%] right-[10%] bg-indigo-100 text-indigo-800 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md border border-indigo-200">
                आयु
              </div>
              <div className="absolute bottom-[10%] left-[10%] bg-purple-100 text-purple-800 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md border border-purple-200">
                नाम
              </div>
              <div className="absolute bottom-[10%] right-[10%] bg-fuchsia-100 text-fuchsia-800 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md border border-fuchsia-200">
                गोत्र
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500 uppercase tracking-widest font-medium">
            प्रतीकात्मक कर्म स्वरूप
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
                <div key={i} className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${k.color} ${k.isDominant ? 'shadow-md ring-2 ring-rose-400 ring-offset-1' : ''}`}>
                  <span className="font-bold min-w-[100px] flex items-center gap-1.5">
                    {k.isDominant && <Zap className="w-4 h-4" />}
                    {k.name}
                  </span>
                  <span className="text-sm opacity-90">{k.status}</span>
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
                <div key={i} className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${k.color} ${k.isDominant ? 'ring-2 ring-indigo-400 ring-offset-1 shadow-md' : ''}`}>
                  <span className="font-bold min-w-[100px] flex items-center gap-1.5">
                    {k.isDominant && <Zap className="w-4 h-4" />}
                    {k.name}
                  </span>
                  <span className="text-sm opacity-90">{k.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
