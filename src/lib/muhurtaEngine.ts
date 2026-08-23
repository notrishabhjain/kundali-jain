// Personalized Shubha-Muhurta scanning engine.
//
// Source: PARITY-REPORT-2026 §"Web Port: Personalized Muhurta Scanning Engine"
// (UnifiedMuhurtaEngine) — with two fidelity upgrades the report itself mandates
// elsewhere (Gap E): the report's mock linear ephemeris is replaced by the real
// Sun/Moon longitudes, and the karma-shubhaTithi personalization from the Android
// native engine is kept as an additive signal.
//
// Scoring model (report):
//  - base score 100
//  - Rikta tithis (4, 9, 14) — excluded class: −40
//  - personal Antarāya level: −(antaraya/100 × 30)
//  - personal Mohaniya level: −(mohaniya/100 × 15)
//  - tiers: ≥75 EXCELLENT, <50 UNSUITABLE (filtered out), else ORDINARY

import { toJulianDay, getSunLongitude, getMoonTropicalLongitude } from './calendarEngine';
import { getKarmaSadhana } from '../data/sadhana';

function normDeg(d: number): number { return ((d % 360) + 360) % 360; }

export interface MuhurtaWindow {
  dateString: string;        // YYYY-MM-DD
  tithiRaw: number;          // 0–29 within the lunar month
  tithiIndex: number;        // 1–15 within the paksha
  tithiName: string;         // e.g. "शुक्ल पंचमी"
  personalizedScore: number; // 0–100
  suitability: 'EXCELLENT' | 'ORDINARY' | 'UNSUITABLE';
  activity: string;          // recommended activity for this tithi
  isKarmaShubhaTithi: boolean;
}

// Rikta (empty) tithis — inauspicious for new undertakings.
// Source: PARITY-REPORT-2026 EXCLUDED_TITHIS.
const RIKTA_TITHIS = [4, 9, 14];

const TITHI_NAMES_HINDI = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा'
];

// Tithi → recommended activity (karma-personalized native mapping, retained).
function getActivityForTithi(tithiRaw: number): string {
  if ([2, 3, 7, 8].includes(tithiRaw)) return 'यंत्र स्थापना';
  if ([0, 1, 5, 6, 15, 16, 20, 21].includes(tithiRaw)) return 'साधना आरंभ';
  if ([4, 9, 10, 19, 24, 25].includes(tithiRaw)) return 'पूजा';
  if ([13, 14, 28, 29].includes(tithiRaw)) return 'व्रत';
  return 'साधना आरंभ';
}

/**
 * Scans the next [daysAhead] days and returns personalized Shubha-Muhurta windows,
 * scored against the user's Antarāya (obstacle) and Mohaniya (delusion) levels.
 * UNSUITABLE windows are filtered out per the report.
 *
 * Source: PARITY-REPORT-2026 scanPersonalizedMuhurtas.
 *
 * @param dominantKarmaEn    user's dominant karma (for shubha-tithi personalization)
 * @param antarayaIntensity  0–100 from KarmaEngine
 * @param mohaniyaIntensity  0–100 from KarmaEngine
 */
export function scanPersonalizedMuhurtas(
  dominantKarmaEn: string,
  antarayaIntensity: number,
  mohaniyaIntensity: number,
  daysAhead: number = 90
): MuhurtaWindow[] {
  const sadhana = getKarmaSadhana(dominantKarmaEn);
  const shubhaTithis = new Set(sadhana.shubhaTithi);

  const obstacleFactor = Math.max(0, Math.min(100, antarayaIntensity)) / 100.0;
  const delusionFactor = Math.max(0, Math.min(100, mohaniyaIntensity)) / 100.0;

  const windows: MuhurtaWindow[] = [];
  const today = new Date();
  let prevTithiRaw = -1;

  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    let tithiRaw: number;
    let elongation: number;
    try {
      const jde = toJulianDay(dateStr, '06:00');
      elongation = normDeg(getMoonTropicalLongitude(jde) - getSunLongitude(jde));
      tithiRaw = Math.floor(elongation / 12);
    } catch {
      continue;
    }

    // One window per tithi — skip repeated days of the same tithi (Vriddhi).
    if (tithiRaw === prevTithiRaw) continue;
    prevTithiRaw = tithiRaw;

    const tithiIndex = tithiRaw < 15 ? tithiRaw + 1 : tithiRaw - 14;
    const paksha = elongation < 180 ? 'शुक्ल' : 'कृष्ण';
    const baseName = tithiRaw === 29 ? 'अमावस्या'
      : tithiRaw === 14 ? 'पूर्णिमा'
      : (TITHI_NAMES_HINDI[tithiIndex - 1] || 'तिथि');

    // Scoring per PARITY-REPORT-2026.
    const isRikta = RIKTA_TITHIS.includes(tithiIndex);
    const isKarmaShubha = shubhaTithis.has(tithiRaw) || shubhaTithis.has(tithiIndex);
    let score = 100.0;
    if (isRikta) score -= 40.0;
    score -= obstacleFactor * 30.0 + delusionFactor * 15.0;
    // Additive personalization: the user's karma-specific shubha tithis get a lift
    // (native-engine signal retained alongside the report's scoring).
    if (isKarmaShubha) score += 10.0;
    score = Math.max(0, Math.min(100, score));

    const suitability: MuhurtaWindow['suitability'] =
      score >= 75.0 ? 'EXCELLENT' : score < 50.0 ? 'UNSUITABLE' : 'ORDINARY';

    windows.push({
      dateString: dateStr,
      tithiRaw,
      tithiIndex,
      tithiName: `${paksha} ${baseName}`,
      personalizedScore: Math.round(score * 10) / 10,
      suitability,
      activity: getActivityForTithi(tithiRaw),
      isKarmaShubhaTithi: isKarmaShubha
    });
  }

  // UNSUITABLE windows are filtered out. Source: PARITY-REPORT-2026.
  return windows.filter(w => w.suitability !== 'UNSUITABLE');
}

// ─── Fixed daily windows (GG.5) ───────────────────────────────────────────────
// Sources: GAP_CLOSING_RESEARCH GG.5 (Abhijit/Brahma) + A.6 (Gulika/Durmuhurta).
//  - Abhijit Muhurta (~11:48–12:12 IST): universally auspicious; Abhijit is
//    Adinatha's birth nakshatra → ideal for Navkar initiation.
//  - Brahma Muhurta (96 minutes before sunrise): ideal for Samayika,
//    Pratikramana, mantra recitation.
//  - Gulika/Durmuhurta: divide the local Dinamaan into 8 equal khandas; lords
//    assigned sequentially from the day's ruler (Varadipati) following the
//    weekday order. The Saturn-ruled khanda = Gulika Kaal; the Mars-ruled
//    khanda = Durmuhurta (both varjit for new undertakings).

export interface FixedMuhurtaWindow {
  key: 'abhijit' | 'brahma' | 'gulika' | 'durmuhurta';
  hindiName: string;
  startHHMM: string;
  endHHMM: string;
  qualityHindi: string;
  guidance: string;
}

const WEEKDAY_LORDS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const LORD_HINDI: Record<string, string> = {
  Sun: 'सूर्य', Moon: 'चन्द्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि'
};

function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
function minutesToHHMM(mins: number): string {
  const wrapped = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Returns the [start,end] HHMM of the 8-part khanda ruled by `lord` during daytime. */
function findLordKhanda(
  lordEn: 'Mars' | 'Saturn',
  startLordIdx: number,
  riseMin: number,
  setMin: number
): { startHHMM: string; endHHMM: string } | null {
  if (!(setMin > riseMin)) return null;
  const partLen = (setMin - riseMin) / 8;
  for (let i = 0; i < 8; i++) {
    const lord = WEEKDAY_LORDS[(startLordIdx + i) % 7];
    if (lord === lordEn) {
      return {
        startHHMM: minutesToHHMM(riseMin + i * partLen),
        endHHMM: minutesToHHMM(riseMin + (i + 1) * partLen)
      };
    }
  }
  return null;
}

/**
 * Night-side khandas — FINAL RULING (ultimate blueprint §2): Khanda-1 lord is
 * the UPCOMING day's Varadipati (next-day's ruler), sequence continues in
 * weekday order across the 8 parts.
 */
function findNightLordKhanda(
  lordEn: 'Mars' | 'Saturn',
  date: Date,
  sunsetHHMM: string,
  nextSunriseHHMM: string
): { startHHMM: string; endHHMM: string } | null {
  const setMin = hhmmToMinutes(sunsetHHMM);
  let riseNext = hhmmToMinutes(nextSunriseHHMM);
  if (riseNext <= setMin) riseNext += 1440; // crosses midnight
  const nightLordIdx = (date.getDay() + 1) % 7; // upcoming weekday
  const partLen = (riseNext - setMin) / 8;
  for (let i = 0; i < 8; i++) {
    const lord = WEEKDAY_LORDS[(nightLordIdx + i) % 7];
    if (lord === lordEn) {
      return {
        startHHMM: minutesToHHMM(setMin + i * partLen),
        endHHMM: minutesToHHMM(setMin + (i + 1) * partLen)
      };
    }
  }
  return null;
}

export function getFixedDailyWindows(
  sunriseHHMM = '06:00',
  sunsetHHMM = '18:00',
  date: Date = new Date(),
  nextSunriseHHMM?: string
): FixedMuhurtaWindow[] {
  // Brahma Muhurta = 96 minutes before sunrise (per GG.5).
  const brahmaStart = minutesToHHMM(hhmmToMinutes(sunriseHHMM) - 96);

  // Day khandas start from the day's Varadipati.
  const gulikaDay = findLordKhanda('Saturn', date.getDay(), hhmmToMinutes(sunriseHHMM), hhmmToMinutes(sunsetHHMM));
  const durmuhurtaDay = findLordKhanda('Mars', date.getDay(), hhmmToMinutes(sunriseHHMM), hhmmToMinutes(sunsetHHMM));

  const windows: FixedMuhurtaWindow[] = [
    {
      key: 'brahma',
      hindiName: 'ब्रह्म मुहूर्त',
      startHHMM: brahmaStart,
      endHHMM: sunriseHHMM,
      qualityHindi: 'अति शुभ',
      guidance: 'सामायिक, प्रतिक्रमण और णमोकार जाप के लिए सर्वोत्तम समय।'
    },
    {
      key: 'abhijit',
      hindiName: 'अभीजीत मुहूर्त',
      startHHMM: '11:48',
      endHHMM: '12:12',
      qualityHindi: 'सर्व-शुभ',
      guidance: 'णमोकार मंत्र का उपनयन/संकल्प हेतु आदर्श — अभीजित आदिनाथ भगवान का जन्म-नक्षत्र है।'
    }
  ];

  if (gulikaDay) {
    windows.push({
      key: 'gulika',
      hindiName: 'गुलिक काल (दिन)',
      startHHMM: gulikaDay.startHHMM,
      endHHMM: gulikaDay.endHHMM,
      qualityHindi: 'परिहार्य',
      guidance: 'दिन का शनि-अधीन अष्टम-भाग — शुभ कार्यों का आरंभ वर्जित है।'
    });
  }
  if (durmuhurtaDay) {
    windows.push({
      key: 'durmuhurta',
      hindiName: 'दुर्मुहूर्त (दिन)',
      startHHMM: durmuhurtaDay.startHHMM,
      endHHMM: durmuhurtaDay.endHHMM,
      qualityHindi: 'परिहार्य',
      guidance: 'दिन का मंगल-अधीन अष्टम-भाग — नवारंभ परिहार्य।'
    });
  }

  // Night khandas — ruled from the NEXT day's Varadipati (final ruling).
  const nextRise = nextSunriseHHMM ?? sunriseHHMM;
  const gulikaNight = findNightLordKhanda('Saturn', date, sunsetHHMM, nextRise);
  const durmuhurtaNight = findNightLordKhanda('Mars', date, sunsetHHMM, nextRise);
  if (gulikaNight) {
    windows.push({
      key: 'gulika',
      hindiName: 'गुलिक काल (रात्रि)',
      startHHMM: gulikaNight.startHHMM,
      endHHMM: gulikaNight.endHHMM,
      qualityHindi: 'परिहार्य',
      guidance: 'रात्रि का शनि-अधीन खंड — रात्रि-मुहूर्त में शुभारंभ वर्जित।'
    });
  }
  if (durmuhurtaNight) {
    windows.push({
      key: 'durmuhurta',
      hindiName: 'दुर्मुहूर्त (रात्रि)',
      startHHMM: durmuhurtaNight.startHHMM,
      endHHMM: durmuhurtaNight.endHHMM,
      qualityHindi: 'परिहार्य',
      guidance: 'रात्रि का मंगल-अधीन खंड — रात्रि-नवारंभ परिहार्य।'
    });
  }

  return windows;
}
