import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info } from 'lucide-react';

export interface KarmaPetalData {
  id: string;
  name: string;
  intensity: number; // 0-100 indicating karma load
  manifestation: string;
  nirjaraPractice: string;
}

interface KarmaAshtadalProps {
  karmas: KarmaPetalData[];
  gunasthana: number;
  forExport?: boolean;
}

export function KarmaAshtadal({ karmas, gunasthana, forExport }: KarmaAshtadalProps) {
  const [selectedKarma, setSelectedKarma] = useState<KarmaPetalData | null>(karmas[3] || null);

  if (forExport) {
    return (
      <div className="w-full space-y-3">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-orange-200">
          <div className="w-12 h-12 rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center shrink-0">
            <div className="text-center leading-tight">
              <div className="text-[9px] text-orange-600 font-bold">गुणस्थान</div>
              <div className="text-lg font-bold text-orange-900">{gunasthana}</div>
            </div>
          </div>
          <p className="text-sm text-gray-600">प्रत्येक कर्म की आवरण-सघनता (%) और आज के जीवन में प्रकटन नीचे दर्शाया गया है।</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {karmas.map(karma => (
            <div key={karma.id} className="border border-orange-200 rounded-xl p-3 bg-orange-50/40">
              <div className="flex justify-between items-center mb-1.5">
                <h4 className="font-bold text-orange-900 text-sm">{karma.name} कर्म</h4>
                <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">{karma.intensity}%</span>
              </div>
              <div className="w-full h-1.5 bg-orange-100 rounded-full mb-2">
                <div className="h-full bg-orange-400 rounded-full" style={{ width: `${karma.intensity}%` }} />
              </div>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="font-bold text-orange-600 uppercase tracking-wide text-[10px] block mb-0.5">वर्तमान प्रकटन:</span>
                  <p className="text-gray-700 leading-relaxed">{karma.manifestation}</p>
                </div>
                <div className="bg-white/70 p-2 rounded-lg border border-orange-100">
                  <span className="font-bold text-orange-700 uppercase tracking-wide text-[10px] block mb-0.5">निर्जरा मार्ग:</span>
                  <p className="text-orange-900 leading-relaxed font-medium">{karma.nirjaraPractice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-orange-50/30 rounded-2xl border border-orange-100/50 shadow-sm flex flex-col md:flex-row gap-8 items-center">
      
      {/* Visual Ashtadal Mandala */}
      <div className="w-full sm:w-80 h-80 relative flex items-center justify-center shrink-0">
        <div className="absolute inset-0 rounded-full border-2 border-orange-200/50 border-dashed animate-[spin_60s_linear_infinite]" />
        <div className="absolute inset-4 rounded-full border border-orange-300/30 border-dashed animate-[spin_40s_linear_infinite_reverse]" />
        
        {karmas.map((karma, index) => {
          const angle = (index * 360) / 8;
          const isSelected = selectedKarma?.id === karma.id;
          
          return (
            <motion.div
              key={karma.id}
              className={`absolute top-1/2 left-1/2 origin-left cursor-pointer outline-none transition-colors ${isSelected ? 'z-10' : 'z-0 hover:z-10'}`}
              style={{
                transform: `rotate(${angle}deg) translate(28px, -50%)`, // Push out from center
              }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedKarma(karma)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setSelectedKarma(karma); }}
              aria-label={`${karma.name} कर्म`}
            >
              {/* Petal Shape */}
              <div 
                className={`relative w-28 h-12 flex items-center justify-center transition-all duration-500
                  ${isSelected ? 'drop-shadow-md' : 'opacity-85 hover:opacity-100'}`}
                style={{
                  clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)', // Diamond/Petal shape
                  backgroundColor: isSelected ? 'rgba(234, 88, 12, 0.15)' : 'rgba(255, 237, 213, 0.4)',
                  border: isSelected ? '1px solid rgba(234, 88, 12, 0.8)' : '1px solid rgba(251, 146, 60, 0.5)',
                }}
              >
                {/* Intensity Fill */}
                <div 
                  className="absolute left-0 bottom-0 top-0 transition-all duration-1000 ease-out"
                  style={{
                    width: `${karma.intensity}%`,
                    backgroundColor: isSelected ? 'rgba(234, 88, 12, 0.4)' : 'rgba(251, 146, 60, 0.25)',
                  }}
                />
                
                {/* Text rotation correction so text remains largely readable or aligns with radius */}
                <span 
                  className={`relative z-10 text-xs sm:text-sm font-medium ${isSelected ? 'text-orange-900 font-bold' : 'text-orange-800'}`}
                  style={{ transform: angle > 90 && angle < 270 ? 'rotate(180deg)' : 'none' }}
                >
                  {karma.name}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Center: Gunasthana */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-orange-100 border-2 border-orange-500 shadow-md flex items-center justify-center z-20">
          <div className="text-center">
            <div className="text-[10px] text-orange-600 font-medium leading-tight">गुणस्थान</div>
            <div className="text-xl font-bold text-orange-900 leading-none">{gunasthana}</div>
          </div>
        </div>
      </div>

      {/* Description Panel */}
      <div className="flex-1 w-full min-h-[320px]">
        <AnimatePresence mode="wait">
          {selectedKarma ? (
            <motion.div
              key={selectedKarma.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col gap-4 bg-white/60 p-6 rounded-xl border border-orange-100"
            >
              <div className="flex justify-between items-start border-b border-orange-200 pb-3">
                <h3 className="text-xl font-bold text-orange-900 flex items-center gap-2">
                  <span className="w-2 h-6 bg-orange-500 rounded-full" />
                  {selectedKarma.name} कर्म
                </h3>
                <div className="flex items-center gap-2 bg-orange-100/80 px-3 py-1 rounded-full border border-orange-200">
                  <span className="text-xs font-semibold text-orange-800 uppercase tracking-widest">आवरण सघनता</span>
                  <span className="text-sm font-bold text-orange-700">{selectedKarma.intensity}%</span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="bg-orange-50/50 p-4 rounded-lg border-l-2 border-orange-300">
                  <h4 className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">वर्तमान जीवन में प्रकटीकरण</h4>
                  <p className="text-orange-900 leading-relaxed text-sm md:text-base">
                    {selectedKarma.manifestation}
                  </p>
                </div>

                <div className="bg-orange-600/5 p-4 rounded-lg border border-orange-600/10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Info size={40} className="text-orange-600" />
                  </div>
                  <h4 className="text-xs font-bold text-orange-700 uppercase tracking-widest mb-2 relative z-10 flex items-center gap-1.5">
                    निर्जरा / क्षयोपशम मार्ग
                  </h4>
                  <p className="text-orange-950 font-medium leading-relaxed text-sm md:text-base relative z-10">
                    {selectedKarma.nirjaraPractice}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-orange-400">
              विस्तार से जानने के लिए किसी भी कर्म की पंखुड़ी पर क्लिक करें।
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
