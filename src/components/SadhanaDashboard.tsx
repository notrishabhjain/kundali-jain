import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trophy, Target, Flame, BookOpen, Shield } from 'lucide-react';
import { UserProfile } from '../lib/analysisSynthesizer';
import { getKarmaSadhana } from '../data/sadhana';

interface SadhanaDashboardProps {
  profile: UserProfile;
  forExport?: boolean;
  part?: 1 | 2;
}

type Category = 'mantra' | 'vrat' | 'svadhyay' | 'tapasya' | 'sevaa';
type Month = 1 | 2 | 3;

interface SadhanaTask {
  id: string;
  month: Month;
  category: Category;
  title: string;
  description: string;
  karmaEffect: string;
}

const CATEGORY_META: Record<Category, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  mantra:   { label: 'मंत्र जाप',    color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   icon: Flame },
  vrat:     { label: 'व्रत',          color: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-200',    icon: Target },
  svadhyay: { label: 'स्वाध्याय',    color: 'text-indigo-700',  bg: 'bg-indigo-50',  border: 'border-indigo-200',  icon: BookOpen },
  tapasya:  { label: 'तपस्या',       color: 'text-orange-700',  bg: 'bg-orange-50',  border: 'border-orange-200',  icon: Flame },
  sevaa:    { label: 'सेवा',          color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: Shield },
};

const MONTH_LABELS: Record<Month, string> = {
  1: 'माह १: भूमि-शोधन',
  2: 'माह २: मंत्र-आरोहण',
  3: 'माह ३: तपस्या',
};

export default function SadhanaDashboard({ profile, forExport, part }: SadhanaDashboardProps) {
  const sadhana = getKarmaSadhana(profile.dominantKarmaEn);
  const nakshatraHindi = profile.birthNakshatraHindi || profile.birthNakshatra;
  const dashaLord = profile.currentDasha?.lord_hindi || profile.currentDashaLegacy || '-';
  const storageKey = `sadhana90_${profile.name}_${profile.dominantKarmaEn}`;

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [activeMonth, setActiveMonth] = useState<Month>(1);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setChecked(JSON.parse(saved));
    } catch { /* ignore */ }
  }, [storageKey]);

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const tasks: SadhanaTask[] = [
    // Month 1 — Foundation
    { id: 'm1_pratah',    month: 1, category: 'mantra',   title: 'प्रातः नियम स्थापित करें',            description: sadhana.pratahNiyam,                                               karmaEffect: `${profile.dominantKarma} कर्म की सतह कमजोर होगी` },
    { id: 'm1_jaap',      month: 1, category: 'mantra',   title: `${sadhana.primaryMantra.count} बार नित्य जाप`, description: `${sadhana.primaryMantra.text} — ${sadhana.primaryMantra.timing}, ${sadhana.primaryMantra.maala} माला`, karmaEffect: sadhana.primaryMantra.karmaEffect },
    { id: 'm1_sayam',     month: 1, category: 'vrat',     title: 'सायं-नियम का पालन',                  description: sadhana.saayamNiyam,                                               karmaEffect: 'नव कर्म-बंध में कमी' },
    { id: 'm1_maun',      month: 1, category: 'tapasya',  title: `${dashaLord} संयम — सप्ताह में एक दिन मौन`, description: `${dashaLord} दशा की ऊर्जा को संयम में लाने हेतु मौन व्रत`,   karmaEffect: 'मोहनीय कर्म की निर्जरा' },
    { id: 'm1_svadhyay',  month: 1, category: 'svadhyay', title: 'प्रतिदिन ५ मिनट जैन शास्त्र पाठ',   description: 'तत्त्वार्थसूत्र या दशवैकालिक सूत्र का पाठ',                         karmaEffect: 'ज्ञानावरणीय कर्म क्षयोपशम' },

    // Month 2 — Mantra Ascent
    { id: 'm2_stotra',    month: 2, category: 'mantra',   title: `${sadhana.secondaryMantra.stotraName} पाठ`, description: `${sadhana.secondaryMantra.count} बार — ${sadhana.secondaryMantra.timing}`, karmaEffect: `${profile.dominantKarma} कर्म की तीव्रता घटेगी` },
    { id: 'm2_ekadashi',  month: 2, category: 'vrat',     title: 'एकादशी व्रत',                         description: 'एकादशी पर उपवास और षट्आवश्यक क्रिया — सांयकाल प्रतिक्रमण',       karmaEffect: 'द्रव्य और भाव दोनों स्तर पर कर्म-क्षय' },
    { id: 'm2_nakshatra', month: 2, category: 'vrat',     title: `${nakshatraHindi} नक्षत्र व्रत`,      description: `${nakshatraHindi} नक्षत्र-दिन श्री ${profile.tirthankarAffinity} भगवान की विशेष पूजा`, karmaEffect: 'तीर्थंकर भक्ति से दर्शनावरणीय कर्म क्षय' },
    { id: 'm2_yantra',    month: 2, category: 'svadhyay', title: 'सिद्धचक्र यंत्र ध्यान',               description: 'नित्य यंत्र के सामने ५ मिनट — नव पदों का क्रमशः स्मरण',           karmaEffect: 'अष्ट कर्मों पर सर्वांगीण प्रहार' },
    { id: 'm2_seva',      month: 2, category: 'sevaa',    title: 'साधर्मी सेवा',                        description: 'किसी वृद्ध जैन श्रावक या साधु-संत की निःस्वार्थ सेवा',            karmaEffect: 'गोत्र कर्म और वेदनीय कर्म निर्जरा' },

    // Month 3 — Tapasya
    { id: 'm3_tapasya',   month: 3, category: 'tapasya',  title: sadhana.tapasya.name,                    description: sadhana.tapasya.description,                                       karmaEffect: `${profile.dominantKarma} कर्म पर सर्वोच्च प्रहार` },
    { id: 'm3_puja',      month: 3, category: 'mantra',   title: sadhana.puja.name,                        description: sadhana.puja.vidhi,                                               karmaEffect: sadhana.puja.benefit },
    { id: 'm3_anust',     month: 3, category: 'mantra',   title: '४०-दिवसीय अनुष्ठान',                   description: `प्रतिदिन ${sadhana.primaryMantra.count} बार — एक ही नियत समय। ४०वें दिन उपवास।`, karmaEffect: `${profile.dominantKarma} कर्म की कठोर परतें टूटेंगी` },
    { id: 'm3_vishesh',   month: 3, category: 'tapasya',  title: 'विशेष उपाय पूर्ण करें',                description: sadhana.visheshUpaya,                                              karmaEffect: `${profile.dominantKarma} की जड़ पर प्रहार` },
    { id: 'm3_prati',     month: 3, category: 'sevaa',    title: 'नित्य प्रतिक्रमण',                      description: 'सांयकाल प्रतिक्रमण — दिन के दोषों की क्षमा याचना',              karmaEffect: 'नव कर्म-बंध में कमी' },
  ];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => checked[t.id]).length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);
  const monthGoals: Record<Month, string> = {
    1: `${profile.dominantKarma} कर्म की सतह कमजोर करना`,
    2: sadhana.primaryMantra.karmaEffect,
    3: `${sadhana.tapasya.name} — संकल्प और चारित्र की नींव`,
  };

  const activeTasks = tasks.filter(t => t.month === activeMonth);

  if (forExport) {
    const monthsToShow: Month[] = !part ? [1, 2, 3] : part === 1 ? [1, 2] : [3];
    return (
      <div className="space-y-6">
        {(!part || part === 1) && (
          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-5 rounded-xl border border-indigo-200">
            <h2 className="text-xl font-bold text-indigo-900 mb-1">९०-दिवसीय साधना ट्रैकर — {profile.name} जी</h2>
            <p className="text-indigo-700 text-sm">{profile.dominantKarma} कर्म-निर्जरा अभियान • सम्पूर्ण कार्य-सूची</p>
          </div>
        )}
        {part === 2 && (
          <div className="bg-indigo-50 px-5 py-3 rounded-xl border border-indigo-100">
            <h2 className="font-bold text-indigo-900">साधना ट्रैकर — माह ३: तपस्या (जारी)</h2>
          </div>
        )}
        {monthsToShow.map(m => {
          const mTasks = tasks.filter(t => t.month === m);
          return (
            <div key={m} className="border border-indigo-200 rounded-xl overflow-hidden">
              <div className="bg-indigo-50 px-5 py-3 border-b border-indigo-100">
                <h3 className="font-bold text-indigo-900">{MONTH_LABELS[m]}</h3>
                <p className="text-xs text-indigo-600 mt-0.5">लक्ष्य: {monthGoals[m]}</p>
              </div>
              <div className="divide-y divide-gray-100">
                {mTasks.map(task => {
                  const cat = CATEGORY_META[task.category];
                  const CatIcon = cat.icon;
                  return (
                    <div key={task.id} className="flex items-start gap-3 px-5 py-3">
                      <div className="mt-0.5 shrink-0 text-gray-300"><Circle className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h4 className="font-bold text-gray-900 text-sm">{task.title}</h4>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${cat.bg} ${cat.border} ${cat.color}`}>
                            <CatIcon className="w-3 h-3" />{cat.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{task.description}</p>
                        <p className="text-xs mt-1 text-orange-700 font-medium">कर्म-प्रभाव: {task.karmaEffect}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {(!part || part === 2) && (
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
            <p className="text-orange-800 text-sm leading-relaxed text-center italic">
              "दैनिक नियम छोटे हो सकते हैं, लेकिन इनका निरंतर पालन बड़े से बड़े {profile.dominantKarma} कर्म के आवरण को भी नष्ट कर देता है।"
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Header + overall progress */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-6 rounded-xl border border-indigo-200">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-indigo-900 mb-1">९०-दिवसीय साधना ट्रैकर</h2>
            <p className="text-indigo-700">{profile.name} जी का व्यक्तिगत {profile.dominantKarma} कर्म-निर्जरा अभियान</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-4xl font-bold text-indigo-800">{progressPercent}%</div>
            <div className="text-sm text-indigo-600">{completedTasks}/{totalTasks} पूर्ण</div>
          </div>
        </div>
        <div className="mt-4 h-3 bg-indigo-100 rounded-full overflow-hidden border border-indigo-200">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
        {completedTasks === totalTasks && (
          <div className="mt-3 flex items-center gap-2 text-amber-700 font-bold">
            <Trophy className="w-5 h-5 text-amber-500" /> आपका ९०-दिन का साधना संकल्प पूर्ण हुआ। अनुमोदना!
          </div>
        )}
      </div>

      {/* Month selector */}
      <div className="grid grid-cols-3 gap-3">
        {([1, 2, 3] as Month[]).map(m => {
          const mTasks = tasks.filter(t => t.month === m);
          const mDone = mTasks.filter(t => checked[t.id]).length;
          return (
            <button
              key={m}
              onClick={() => setActiveMonth(m)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${activeMonth === m ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300'}`}
            >
              <div className="text-xs font-bold uppercase text-gray-500 mb-1 tracking-wide">माह {m}</div>
              <div className="font-bold text-gray-900 text-sm">{MONTH_LABELS[m].split(':')[1]?.trim()}</div>
              <div className={`text-xs mt-2 font-bold ${mDone === mTasks.length ? 'text-emerald-600' : 'text-gray-400'}`}>
                {mDone}/{mTasks.length} ✓
              </div>
            </button>
          );
        })}
      </div>

      {/* Active month goal */}
      <div className="bg-amber-50 px-5 py-3 rounded-xl border border-amber-200 flex items-center gap-3">
        <Target className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-900"><strong>लक्ष्य:</strong> {monthGoals[activeMonth]}</p>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {activeTasks.map(task => {
          const isDone = !!checked[task.id];
          const cat = CATEGORY_META[task.category];
          const CatIcon = cat.icon;
          return (
            <div
              key={task.id}
              onClick={() => toggle(task.id)}
              className={`cursor-pointer rounded-xl border-2 p-4 flex items-start gap-4 transition-all select-none ${
                isDone ? 'border-emerald-300 bg-emerald-50/50' : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
              }`}
            >
              <div className={`mt-0.5 shrink-0 ${isDone ? 'text-emerald-500' : 'text-gray-300'}`}>
                {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className={`font-bold ${isDone ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</h4>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${cat.bg} ${cat.border} ${cat.color}`}>
                    <CatIcon className="w-3 h-3" />{cat.label}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${isDone ? 'text-gray-400' : 'text-gray-600'}`}>{task.description}</p>
                {!isDone && (
                  <p className="text-xs mt-1.5 text-orange-700 font-medium">कर्म-प्रभाव: {task.karmaEffect}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Category summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        {(['mantra', 'vrat', 'tapasya'] as Category[]).map(cat => {
          const catTasks = tasks.filter(t => t.category === cat);
          const catDone = catTasks.filter(t => checked[t.id]).length;
          const meta = CATEGORY_META[cat];
          const CatIcon = meta.icon;
          const pct = catTasks.length ? (catDone / catTasks.length) * 100 : 0;
          return (
            <div key={cat} className={`p-4 rounded-xl border ${meta.bg} ${meta.border}`}>
              <div className="flex items-center gap-2 mb-2">
                <CatIcon className={`w-4 h-4 ${meta.color}`} />
                <span className={`font-bold text-sm ${meta.color}`}>{meta.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{catDone}/{catTasks.length}</div>
              <div className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div className={`h-full rounded-full transition-all ${cat === 'mantra' ? 'bg-amber-500' : cat === 'vrat' ? 'bg-rose-500' : 'bg-orange-500'}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspiration */}
      <div className="bg-orange-50 p-5 rounded-xl border border-orange-200">
        <p className="text-orange-800 text-sm leading-relaxed text-center italic">
          "दैनिक नियम छोटे हो सकते हैं, लेकिन इनका निरंतर पालन बड़े से बड़े {profile.dominantKarma} कर्म के आवरण को भी नष्ट कर देता है। जैसे पानी की बूँद पत्थर में छेद कर देती है।"
        </p>
      </div>

    </div>
  );
}
