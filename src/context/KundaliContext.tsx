import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, DayContext, getTodayContext } from '../lib/engineFacade';

interface KundaliContextValue {
  profile: UserProfile | null;
  setProfile: (p: UserProfile | null) => void;
  today: DayContext;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const KundaliContext = createContext<KundaliContextValue | null>(null);

export function KundaliProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('jain_kundali_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [today] = useState<DayContext>(() => getTodayContext());
  const [activeTab, setActiveTab] = useState('vartaman');

  const setProfile = (p: UserProfile | null) => {
    if (p) {
      localStorage.setItem('jain_kundali_profile', JSON.stringify(p));
    } else {
      localStorage.removeItem('jain_kundali_profile');
    }
    setProfileState(p);
  };

  return (
    <KundaliContext.Provider value={{ profile, setProfile, today, activeTab, setActiveTab }}>
      {children}
    </KundaliContext.Provider>
  );
}

export function useKundali(): KundaliContextValue {
  const ctx = useContext(KundaliContext);
  if (!ctx) throw new Error('useKundali must be used inside KundaliProvider');
  return ctx;
}

export default KundaliContext;
