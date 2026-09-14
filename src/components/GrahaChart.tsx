// Nine grahas, lagna and whole-sign bhavas.
//
// The frame this is presented in matters as much as the numbers. Per CLAUDE.md
// rule 1 and the header of grahas.ts, the grahas are Jyotishi Devs and they are
// NIMITTA — indicative, never causal. A graha does not cause a karma; it marks
// one already bound. So this surface reports positions and says what they are;
// it does not predict from them, does not read aspects or yogas, and does not
// prescribe gemstones.
import { GRAHAS } from '../data/grahas';
import type { UserProfile } from '../lib/engineFacade';
import FieldInfo from './FieldInfo';

const RASHI_HINDI = [
  'मेष', 'वृष', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

const NAKSHATRA_HINDI = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा',
  'मघा', 'पूर्व फाल्गुनी', 'उत्तर फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
  'मूला', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्व भाद्रपद', 'उत्तर भाद्रपद', 'रेवती',
];

const GRAHA_HINDI: Record<string, string> = {
  Surya: 'सूर्य', Chandra: 'चन्द्र', Mangal: 'मंगल', Budha: 'बुध',
  Guru: 'गुरु', Shukra: 'शुक्र', Shani: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

/** Degrees as "12° 34'". */
function dms(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.round((deg - d) * 60);
  return m === 60 ? `${d + 1}° 00'` : `${d}° ${String(m).padStart(2, '0')}'`;
}

export default function GrahaChart({ profile }: { profile: UserProfile }) {
  const chart = profile.grahaChart;
  if (!chart) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-900">
        जन्म-स्थान के अक्षांश/देशांतर के बिना ग्रह-स्थिति की गणना संभव नहीं है। कृपया जन्म-विवरण में स्थान पुनः भरें।
      </div>
    );
  }

  const { grahas, bhava } = chart;
  const byBhava = (n: number) => grahas.filter((g) => bhava.grahaBhava[g.key] === n);
  const anyPadaUnsure = grahas.some((g) => !g.padaConfident);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-xl font-bold text-slate-900">ग्रह-स्थिति एवं लग्न कुण्डली</h3>
          <p className="text-sm text-slate-600 mt-1">
            निरयण (सायन नहीं) — लाहिड़ी अयनांश के अनुसार
            <FieldInfo field="grahaPositions" className="ml-1" />
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-300 text-sm">
          <span className="font-bold text-slate-900">लग्न: {RASHI_HINDI[bhava.lagnaRashiIndex]}</span>
          <span className="text-slate-600 ml-2">{dms(bhava.lagnaLongitude % 30)}</span>
          <span className="block text-xs text-slate-500 mt-0.5">
            {NAKSHATRA_HINDI[bhava.lagnaNakshatraIndex]} पाद {bhava.lagnaPada}
          </span>
        </div>
      </div>

      {/* ── Doctrinal frame. Stated before the numbers, not after them. ─────── */}
      <div className="bg-indigo-50 border-l-4 border-indigo-400 px-4 py-3 rounded-r-lg">
        <span className="block text-xs font-bold text-indigo-700 uppercase mb-1">सिद्धांत-स्थिति</span>
        <p className="text-sm text-indigo-900 leading-relaxed">
          जैन ज्योतिष में ग्रह <strong>ज्योतिषी देव</strong> हैं — वैदिक देवता नहीं — और वे <strong>निमित्त</strong> मात्र हैं,
          कारण नहीं। ग्रह किसी कर्म को उत्पन्न नहीं करता; वह पहले से बँधे कर्म के उदय-काल का सूचक है।
          अतः यहाँ केवल स्थिति दर्शाई गई है — इनसे कोई फलादेश, दृष्टि-योग अथवा रत्न-विधान नहीं निकाला गया।
          आपका पुरुषार्थ इन स्थितियों से बँधा नहीं है।
        </p>
      </div>

      {/* ── Twelve bhavas, whole-sign ───────────────────────────────────────── */}
      <div>
        <span className="block text-sm font-bold text-slate-700 uppercase mb-3">
          द्वादश भाव (पूर्ण-राशि पद्धति)
          <FieldInfo field="bhavaSystem" className="ml-1.5" />
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {bhava.houses.map((rashiIndex, i) => {
            const occupants = byBhava(i + 1);
            return (
              <div
                key={i}
                className={`rounded-xl border p-3 min-h-[76px] ${
                  i === 0 ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-500">भाव {i + 1}</span>
                  <span className="text-xs font-bold text-slate-800">{RASHI_HINDI[rashiIndex]}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {occupants.length === 0 ? (
                    <span className="text-[11px] text-slate-400">—</span>
                  ) : (
                    occupants.map((g) => (
                      <span
                        key={g.key}
                        className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200"
                      >
                        {GRAHA_HINDI[g.key]}{g.retrograde ? ' (व)' : ''}
                      </span>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Positions table ─────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3 font-bold">ग्रह</th>
              <th className="py-2 pr-3 font-bold">राशि</th>
              <th className="py-2 pr-3 font-bold">अंश</th>
              <th className="py-2 pr-3 font-bold">नक्षत्र / पाद</th>
              <th className="py-2 pr-3 font-bold">भाव</th>
              <th className="py-2 font-bold">गति</th>
            </tr>
          </thead>
          <tbody>
            {grahas.map((g) => {
              const meta = GRAHAS.find((x) => x.name === g.key);
              return (
                <tr key={g.key} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-3 font-bold text-slate-900">
                    {GRAHA_HINDI[g.key]}
                    {meta && <span className="block text-[11px] font-normal text-slate-500">{meta.jyotishi_dev_type}</span>}
                  </td>
                  <td className="py-2 pr-3 text-slate-800">{RASHI_HINDI[g.rashiIndex]}</td>
                  <td className="py-2 pr-3 text-slate-800 tabular-nums">{dms(g.degreeInRashi)}</td>
                  <td className="py-2 pr-3 text-slate-800">
                    {NAKSHATRA_HINDI[g.nakshatraIndex]}
                    <span className="text-slate-500"> / {g.pada}</span>
                    {!g.padaConfident && (
                      <span className="ml-1 text-[10px] text-amber-700 font-bold" title="पाद-संधि के निकट">≈</span>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-slate-800">{bhava.grahaBhava[g.key]}</td>
                  <td className="py-2 text-slate-700">{g.retrograde ? 'वक्री' : 'मार्गी'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Accuracy, stated rather than implied ────────────────────────────── */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <span className="block text-xs font-bold text-slate-600 uppercase mb-1">गणना-परिशुद्धि</span>
        <p className="text-xs text-slate-700 leading-relaxed">
          सूर्य एवं चन्द्र की गणना पूर्ण मीयस श्रेणी से की गई है। शेष ग्रहों हेतु स्टैण्डिश/जे०पी०एल० कक्षा-तत्त्वों
          का प्रयोग है, जिनकी प्रकाशित अधिकतम त्रुटि १८००–२०५० ई० में इस प्रकार है — बुध १५″, शुक्र २१″, मंगल २५″,
          गुरु १००″, शनि २००″। यह त्रुटि राशि (३०°) एवं नक्षत्र (१३°२०′) के लिए नगण्य है।
          {anyPadaUnsure
            ? ' आपकी कुण्डली में कुछ ग्रह पाद-संधि के इतने निकट हैं कि उनका पाद निश्चित रूप से नहीं कहा जा सकता — ऐसे ग्रह ≈ चिह्न से अंकित हैं।'
            : ' आपकी कुण्डली में कोई भी ग्रह पाद-संधि के इतने निकट नहीं है कि उसका पाद संदिग्ध हो।'}
        </p>
      </div>
    </div>
  );
}
