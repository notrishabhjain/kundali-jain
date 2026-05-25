import React, { useState } from 'react';
import JaapSadhana from './JaapSadhana';
import YantraSadhana from './YantraSadhana';
import ViseshPujas from './ViseshPujas';
import TantraSadhana from './TantraSadhana';
import { BookOpen, Layers, Flower2, Flame, ShieldCheck } from 'lucide-react';
import { UserProfile, getTodayContext } from '../lib/engineFacade';
import { UserProfile } from '../lib/engineFacade';
import { getKarmaSadhana } from '../data/sadhana';
import { generateRemedies } from '../lib/remedyEngine';
import { calculateRuleScore } from '../lib/intelligence/ruleScoring';
import { composeNarrativeBundle } from '../lib/narrativeComposer';
import DecisionTraceCard from './DecisionTraceCard';

type RemedySubTab = 'samanya' | 'jaap' | 'yantra' | 'puja' | 'tantra';

interface RemedyTabProps {
  profile: UserProfile;
}

export default function RemedyTab({ profile }: RemedyTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<RemedySubTab>('samanya');

  const getBtnClass = (tab: RemedySubTab) => 
    `flex-1 py-2 px-3 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-colors ${
      activeSubTab === tab 
        ? 'bg-white text-orange-900 shadow-sm border border-orange-200' 
        : 'text-orange-700 hover:bg-orange-100/80'
    }`;

  const today = getTodayContext();
  const decision = calculateRuleScore(profile, today, profile.dominantKarma);
  const narrative = composeNarrativeBundle(profile, today, decision);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Sub Navigation */}
      <div className="bg-orange-100/50 p-2 rounded-xl flex flex-wrap gap-2">
        <button onClick={() => setActiveSubTab('samanya')} className={getBtnClass('samanya')}>
          <ShieldCheck className="w-4 h-4" /> सामान्य उपाय
        </button>
        <button onClick={() => setActiveSubTab('jaap')} className={getBtnClass('jaap')}>
          <BookOpen className="w-4 h-4" /> जाप साधना
        </button>
        <button onClick={() => setActiveSubTab('yantra')} className={getBtnClass('yantra')}>
          <Layers className="w-4 h-4" /> यंत्र साधना
        </button>
        <button onClick={() => setActiveSubTab('puja')} className={getBtnClass('puja')}>
          <Flower2 className="w-4 h-4" /> विशेष पूजा
        </button>
        <button onClick={() => setActiveSubTab('tantra')} className={getBtnClass('tantra')}>
          <Flame className="w-4 h-4" /> महा-साधना
        </button>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
        {activeSubTab === 'samanya' && (() => {
          const sadhana = getKarmaSadhana(profile.dominantKarmaEn);
          const combined = generateRemedies(profile);
          const today = getTodayContext();
  const decision = calculateRuleScore(profile, today, profile.dominantKarma);
  const narrative = composeNarrativeBundle(profile, today, decision);

  return (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-orange-900 border-b border-orange-200 pb-2">दैनिक जैन जीवन-चर्या (आपके प्रबळ कर्म अनुसार)</h3>
              <p className="text-gray-700">
                सामान्य उपाय कोई चमत्कार नहीं हैं, बल्कि ये आपके उदय में आए <strong>{profile.dominantKarma}</strong> कर्म की तीव्रता को कम करने के लिए दैनिक जीवन-शैली में सुधार हैं। {sadhana.dailyManifestation}
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100">
                  <span className="block text-sm font-bold text-gray-500 mb-1">प्रातःकालीन नियम</span>
                  <p className="text-gray-800 text-sm leading-relaxed">{sadhana.pratahNiyam}</p>
                </div>

                <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100">
                  <span className="block text-sm font-bold text-gray-500 mb-1">सायं-नियम</span>
                  <p className="text-gray-800 text-sm leading-relaxed">{sadhana.saayamNiyam}</p>
                </div>
              </div>

              <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                <span className="block text-sm font-bold text-amber-700 uppercase mb-2">सामान्य उपाय (कर्म अनुसार)</span>
                <p className="text-gray-800 text-sm leading-relaxed">{sadhana.samanyaUpaya}</p>
              </div>

              <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                <span className="block text-sm font-bold text-blue-700 uppercase mb-2">दशा उपाय ({profile.currentDasha.lord_hindi} अनुसार)</span>
                <p className="text-gray-800 text-sm leading-relaxed">{combined.dashaRemedy}</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm">
                <span className="block text-sm font-bold text-rose-600 uppercase mb-2">विशेष व्यक्तिगत उपाय ({profile.dominantKarma} कर्म शमन हेतु)</span>
                <p className="text-gray-800 font-medium text-sm leading-relaxed">{combined.karmaRemedy}</p>
                <p className="text-rose-800 text-sm mt-2">{narrative.karmaManifestation}</p>
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                    <span className="block text-[11px] font-bold text-rose-500 uppercase mb-1">यंत्र / मंडल स्थापना</span>
                    <p className="text-rose-900 text-sm font-medium">{combined.yantraRecommendation}</p>
                  </div>
                  <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                    <span className="block text-[11px] font-bold text-rose-500 uppercase mb-1">तपस्या / उपवास</span>
                    <p className="text-rose-900 text-sm font-medium">{combined.tapasyaRecommendation}</p>
                  </div>
                </div>
                <p className="text-rose-700 font-medium text-sm mt-4 pt-3 border-t border-rose-100">
                  <strong>सर्वोत्तम तिथियाँ:</strong> {combined.recommendedTithi}
                </p>
              </div>

              <DecisionTraceCard decision={decision} compact />
            </div>
          );
        })()}
        {activeSubTab === 'jaap' && <JaapSadhana profile={profile} />}
        {activeSubTab === 'yantra' && <YantraSadhana profile={profile} />}
        {activeSubTab === 'puja' && <ViseshPujas profile={profile} />}
        {activeSubTab === 'tantra' && <TantraSadhana profile={profile} />}
      </div>
    </div>
  );
}
