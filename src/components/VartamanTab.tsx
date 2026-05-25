import React from 'react';
import { AnalysisSynthesizer, UserProfile, getTodayContext } from '../lib/engineFacade';
import { KarmaAshtadal, KarmaPetalData } from './KarmaAshtadal';
import { KARMA_SADHANA } from '../data/sadhana';

import { calculateKarmaProfile } from '../lib/karmaEngine';

const GUNASTHANA_DATA: Record<number, { name: string; description: string; advice: string }> = {
  1: {
    name: 'प्रथम गुणस्थान (मिथ्यादृष्टि)',
    description: 'आत्मा अभी सत्य और असत्य के बीच भेद नहीं कर पा रही। मिथ्यात्व कर्म का प्रबल उदय है।',
    advice: 'सत्संग, स्वाध्याय और तत्त्व-चिंतन से मिथ्यात्व को दूर करने का प्रयास करें। णमोकार मंत्र का नियमित जाप करें।'
  },
  2: {
    name: 'द्वितीय गुणस्थान (सासादन सम्यग्दृष्टि)',
    description: 'सम्यग्दर्शन की एक झलक मिली है किंतु कर्म-उदय के कारण वह स्थिर नहीं है। यह एक संक्रमण काल है।',
    advice: 'इस अस्थिरता को स्वीकार करें। तीर्थ-दर्शन और शास्त्र-श्रवण से सम्यक् श्रद्धान को पुनः स्थिर करें।'
  },
  3: {
    name: 'तृतीय गुणस्थान (मिश्र)',
    description: 'सम्यग्दर्शन और मिथ्यादर्शन दोनों का मिश्रण है। आत्मा सत्य की ओर उन्मुख है लेकिन संशय बना रहता है।',
    advice: 'संदेह को दूर करने के लिए जिनवाणी का गहन अध्ययन करें। गुरु की शरण में जाएँ।'
  },
  4: {
    name: 'चतुर्थ गुणस्थान (अविरत सम्यग्दृष्टि)',
    description: 'सम्यग्दर्शन प्राप्त है — सत्य और असत्य का बोध है। परंतु "अविरत" होने के कारण संयम अभी पूरी तरह नहीं आया।',
    advice: 'श्रद्धा को आचरण में उतारें। छोटे-छोटे त्याग और अणुव्रतों को अपनाएँ।'
  }
};

function GunasthanaDescription({ name, gunasthana, dominantKarma, dashaLord }: { name: string; gunasthana: number; dominantKarma: string; dashaLord: string }) {
  const g = Math.max(1, Math.min(4, gunasthana));
  const data = GUNASTHANA_DATA[g];
  return (
    <p>
      {name} जी, शास्त्रों के आलोक में आपकी वर्तमान कर्म स्थिति को देखते हुए, आप <strong>{data.name}</strong> की भूमिका में विचरण कर रहे हैं।{' '}
      {data.description}{' '}
      <strong>{dominantKarma}</strong> कर्म का उदय और वर्तमान <strong>{dashaLord} दशा</strong> इस स्थिति को प्रभावित कर रहे हैं।{' '}
      <span className="block mt-3 text-base text-orange-800"><strong>मार्गदर्शन:</strong> {data.advice}</span>
    </p>
  );
}

interface VartamanTabProps {
  profile: UserProfile;
  part?: 1 | 2;
  forExport?: boolean;
}

export default function VartamanTab({ profile, part, forExport }: VartamanTabProps) {
  const today = getTodayContext();
  const todaysMessage = AnalysisSynthesizer.generateTodaysMessage(profile, today);
  const dashaLord = profile.currentDasha?.lord_hindi || profile.currentDashaLegacy || 'अज्ञात';
  const nakshatraHindi = profile.birthNakshatraHindi || profile.birthNakshatra;

  const dynamicKarmas: KarmaPetalData[] = calculateKarmaProfile(
    profile.dominantKarmaEn,
    profile.currentDasha?.lord || 'Guru',
    profile.gunasthana || 4
  ).map(k => ({
    id: k.id,
    name: k.karmaHindi,
    intensity: k.intensity,
    manifestation: k.manifestation,
    nirjaraPractice: k.nirjaraPractice
  }));

  const dasha = profile.currentDasha;

  return (
    <div className="space-y-8">
      {(!part || part === 1) && (
        <>
          {/* SECTION 1: Personal Message */}
          <section className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm">
            <h2 className="text-2xl font-bold text-amber-900 mb-4 border-b border-amber-100 pb-2">आज का संदेश</h2>
            <div className="prose prose-amber max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
              {todaysMessage}
            </div>
          </section>

          {/* SECTION 2: 3-Layer Dasha Narrative */}
          <section className="bg-amber-50/50 p-6 rounded-xl border border-amber-100 shadow-sm">
            <h2 className="text-2xl font-bold text-amber-900 mb-4 border-b border-amber-200 pb-2">
              आपकी वर्तमान महादशा: {dashaLord} का काल
              {dasha?.yearsRemaining !== undefined && (
                <span className="text-base font-normal text-amber-700 ml-2">({dasha.yearsRemaining} वर्ष शेष)</span>
              )}
            </h2>

            {/* 3-layer dasha display */}
            {dasha && (
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-amber-100 rounded-xl p-4 border border-amber-200">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 block mb-1">महादशा</span>
                  <p className="text-xl font-bold text-amber-900">{dasha.lord_hindi}</p>
                  <p className="text-xs text-amber-700 mt-1">{dasha.startDate} — {dasha.endDate}</p>
                  <p className="text-xs font-medium text-amber-800 mt-1">{dasha.yearsRemaining} वर्ष शेष</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 block mb-1">अंतर्दशा</span>
                  <p className="text-xl font-bold text-orange-900">{dasha.antardashaInfo.lord_hindi}</p>
                  <p className="text-xs text-orange-700 mt-1">{dasha.antardashaInfo.startDate} — {dasha.antardashaInfo.endDate}</p>
                  <p className="text-xs font-medium text-orange-800 mt-1">{dasha.antardashaInfo.yearsRemaining} वर्ष शेष</p>
                </div>
                <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 block mb-1">प्रत्यंतर्दशा</span>
                  <p className="text-xl font-bold text-rose-900">{dasha.pratyantardasha.lord_hindi}</p>
                  <p className="text-xs text-rose-700 mt-1">{dasha.pratyantardasha.startDate} — {dasha.pratyantardasha.endDate}</p>
                  <p className="text-xs font-medium text-rose-800 mt-1">{dasha.pratyantardasha.daysRemaining} दिन शेष</p>
                </div>
              </div>
            )}

            <div className="space-y-4 text-gray-800 leading-relaxed">
              <p>
                आप इस समय <strong>{dashaLord} महादशा</strong> में <strong>{dasha?.antardashaInfo.lord_hindi} अंतर्दशा</strong> से गुजर रहे हैं
                {dasha?.pratyantardasha.lord_hindi && ` (${dasha.pratyantardasha.lord_hindi} प्रत्यंतर्दशा)`}।
                जैन ज्योतिष में, यह तीन स्तरीय दशा-काल आपके संचित कर्मों के पकने (उदय होने) का एक विशेष कालखंड है।
              </p>
              <p>
                <strong>{nakshatraHindi}</strong> नक्षत्र में आपका जन्म आपको विशेष स्वभाव की ओर खींचता है, किंतु <strong>{dashaLord}</strong> की वर्तमान दशा आपके भीतर <strong>{profile.dominantKarma}</strong> कर्म को बल दे रही है।
              </p>
              <p>
                इस कालखंड में आपको कोई भी बड़ा निर्णय जल्दबाज़ी में नहीं लेना चाहिए। यह समय बाह्य विस्तार का नहीं, बल्कि आतंरिक गहराई में जाने का है। <strong>{dashaLord}</strong> की इस ऊर्जा को शांत करने के लिए, अपना ध्यान एक लक्ष्य पर केंद्रित करें।
              </p>
            </div>
          </section>
        </>
      )}

      {(!part || part === 2) && (
        <>
          {/* SECTION 3: Karma Ashtadal */}
          <section className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm">
            <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">अष्ट-कर्म मंडल (Karma Ashtadal)</h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              यह अष्टदल आपकी आत्मा पर छाए 8 कर्मों के वर्तमान भार (सघनता) को दर्शाता है। प्रत्येक पंखुड़ी पर क्लिक करके जानें कि वह कर्म आज आपके जीवन में किस रूप में प्रकट हो रहा है और उसकी निर्जरा का सटीक मार्ग क्या है।
            </p>
            <KarmaAshtadal karmas={dynamicKarmas} gunasthana={profile.gunasthana || 4} forExport={forExport} />
          </section>

          {/* SECTION 4: Gunasthana */}
          <section className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200 shadow-sm">
            <h2 className="text-2xl font-bold text-orange-900 mb-4 border-b border-orange-200 pb-2">आपका गुणस्थान: एक आध्यात्मिक परामर्श</h2>
            <div className="text-gray-800 leading-relaxed text-lg">
              <GunasthanaDescription name={profile.name} gunasthana={profile.gunasthana || 1} dominantKarma={profile.dominantKarma} dashaLord={dasha?.lord_hindi || dashaLord} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
