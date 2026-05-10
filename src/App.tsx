/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Kundali from './components/Kundali';
import BirthDataForm from './components/BirthDataForm';
import { generateUserProfile } from './lib/analysisSynthesizer';
import { useKundali } from './context/KundaliContext';

export default function App() {
  const { profile, setProfile } = useKundali();

  if (!profile) {
    return <BirthDataForm onSubmit={(data) => setProfile(generateUserProfile(data))} />;
  }

  return (
    <div className="print:bg-white print:p-0 min-h-screen bg-orange-50/30 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <header className="print:hidden mb-8 border-b border-gray-200 pb-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-amber-900 mb-2 font-serif">दिगम्बर जैन ज्योतिष साधना केंद्र</h1>
            <p className="text-amber-800/80 text-lg md:text-xl font-medium tracking-wide">आत्म-निरीक्षण और कर्म-निर्जरा का मार्ग</p>
          </div>
          <button
            onClick={() => setProfile(null)}
            className="px-4 py-2 border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-100 transition shadow-sm text-sm font-semibold"
          >
            नया आरंभ (Reset Profile)
          </button>
        </header>
        <main>
          <Kundali profile={profile} />
        </main>
      </div>
    </div>
  );
}
