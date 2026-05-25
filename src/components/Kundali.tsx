import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import VartamanTab from './VartamanTab';
import BirthChart from './BirthChart';
import KarmaProfile from './KarmaProfile';
import RemedyTab from './RemedyTab';
import DharmaMarg from './DharmaMarg';
import VratCalendar from './VratCalendar';
import PrintReport from './PrintReport';
import TirthaYatra from './TirthaYatra';
import MuhurtaCalculator from './MuhurtaCalculator';
import SadhanaDashboard from './SadhanaDashboard';
import { Compass, BarChart2, Scale, Sparkles, Map, Calendar, Printer, Mountain, Clock, Target, AlertCircle } from 'lucide-react';
import { UserProfile } from '../lib/engineFacade';
import { generateRemedies } from '../lib/remedyEngine';
import { getTodayContext } from '../lib/engineFacade';
import { calculateRuleScore } from '../lib/intelligence/ruleScoring';
import { composeNarrativeBundle } from '../lib/narrativeComposer';
import { useKundali } from '../context/KundaliContext';
import { NeoPopTokens, getPriorityChip } from '../theme/tokens';

type MainTab = 'vartaman' | 'kundali' | 'karma' | 'remedies' | 'dharma' | 'calendar' | 'tirtha' | 'muhurta' | 'sadhana' | 'report';

interface KundaliProps {
  profile: UserProfile;
}

const tabs: { id: MainTab; label: string; icon: React.ReactNode; color: string; bgLight: string }[] = [
  { id: 'vartaman', label: 'वर्तमान',       icon: <Compass className="w-5 h-5" />,  color: 'bg-amber-600',  bgLight: 'bg-amber-50 text-amber-700' },
  { id: 'kundali',  label: 'कुण्डली',    icon: <BarChart2 className="w-5 h-5" />, color: 'bg-indigo-600', bgLight: 'bg-indigo-50 text-indigo-700' },
  { id: 'karma',    label: 'कर्म',              icon: <Scale className="w-5 h-5" />,     color: 'bg-rose-600',   bgLight: 'bg-rose-50 text-rose-700' },
  { id: 'remedies', label: 'उपाय',           icon: <Sparkles className="w-5 h-5" />,  color: 'bg-orange-600', bgLight: 'bg-orange-50 text-orange-700' },
  { id: 'dharma',   label: 'धर्म मार्ग', icon: <Map className="w-5 h-5" />,       color: 'bg-emerald-600',bgLight: 'bg-emerald-50 text-emerald-700' },
  { id: 'calendar', label: 'कैलेंडर',        icon: <Calendar className="w-5 h-5" />,  color: 'bg-blue-600',   bgLight: 'bg-blue-50 text-blue-700' },
  { id: 'tirtha',   label: 'तीर्थ यात्रा', icon: <Mountain className="w-5 h-5" />,  color: 'bg-teal-600',   bgLight: 'bg-teal-50 text-teal-700' },
  { id: 'muhurta',  label: 'मुहूर्त',          icon: <Clock className="w-5 h-5" />,     color: 'bg-cyan-600',   bgLight: 'bg-cyan-50 text-cyan-700' },
  { id: 'sadhana',  label: 'ट्रैकर',        icon: <Target className="w-5 h-5" />,    color: 'bg-yellow-600', bgLight: 'bg-yellow-50 text-yellow-700' },
  { id: 'report',   label: 'रिपोर्ट',          icon: <Printer className="w-5 h-5" />,   color: 'bg-slate-600',  bgLight: 'bg-slate-50 text-slate-700' },
];

export default function Kundali({ profile }: KundaliProps) {
  const { activeTab: rawTab, setActiveTab } = useKundali();
  const activeTab = (rawTab as MainTab) || 'vartaman';
  
  const remedies = generateRemedies(profile);
  const today = getTodayContext();
  const intelligence = calculateRuleScore(profile, today, remedies.primarySadhana);
  const narrative = composeNarrativeBundle(profile, today, intelligence);

  const chip = getPriorityChip(intelligence.priority);

  return (
    <div className="space-y-6" style={{ borderRadius: NeoPopTokens.radius }}>

      {/* Priority Banner */}
      <div className="text-white p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full shrink-0">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className={`block text-xs font-bold uppercase tracking-wider mb-1 px-2 py-1 inline-block border ${chip.bg} ${chip.text} ${chip.border}`}>
              आज की प्राथमिकता साधना ({profile.dominantKarma} कर्म शमन • {intelligence.priority})
            </span>
            <span className="font-medium text-sm sm:text-base leading-snug block">
              {narrative.sadhanaPrescription}
            </span>
          </div>
        </div>
        <div className="flex gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <button 
            onClick={() => setActiveTab('sadhana')} 
            className="bg-white text-orange-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-50 transition-colors whitespace-nowrap"
          >
            ट्रैकर खोलें
          </button>
          <button 
            onClick={() => setActiveTab('report')} 
            className="bg-orange-800 text-orange-50 px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-900 transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> PDF डाउनलोड
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="print:hidden bg-white p-2 rounded-xl border border-gray-200 shadow-sm sticky top-4 z-50 overflow-x-auto hide-scrollbar">
        <nav className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-lg font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all whitespace-nowrap
                ${activeTab === tab.id ? `${tab.color} text-white shadow-md` : `text-gray-600 hover:${tab.bgLight}`}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Animated Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="pt-2"
        >
          {activeTab === 'vartaman'  && <VartamanTab profile={profile} />}
          {activeTab === 'kundali'   && <BirthChart profile={profile} />}
          {activeTab === 'karma'     && <KarmaProfile profile={profile} />}
          {activeTab === 'remedies'  && <RemedyTab profile={profile} />}
          {activeTab === 'dharma'    && <DharmaMarg profile={profile} />}
          {activeTab === 'calendar'  && <VratCalendar profile={profile} />}
          {activeTab === 'tirtha'    && <TirthaYatra profile={profile} />}
          {activeTab === 'muhurta'   && <MuhurtaCalculator profile={profile} />}
          {activeTab === 'sadhana'   && <SadhanaDashboard profile={profile} />}
          {activeTab === 'report'    && <PrintReport profile={profile} />}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
