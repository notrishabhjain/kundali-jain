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
// Source: GAP_CLOSING_RESEARCH GG.5 — VERIFIED (Shatabdi Panchang tradition).
//  - Abhijit Muhurta (~11:48–12:12 IST): universally auspicious; Abhijit is
//    Adinatha's birth nakshatra → ideal for Navkar initiation.
//  - Brahma Muhurta (96 minutes before sunrise): ideal for Samayika,
//    Pratikramana, mantra recitation.
//  - Durmuhurta: 2 inauspicious spans per day exist in the tradition; exact
//    per-day computation is [REQUIRES_RESEARCH] — not computed here.

export interface FixedMuhurtaWindow {
  key: 'abhijit' | 'brahma' | 'durmuhurta';
  hindiName: string;
  startHHMM: string;
  endHHMM: string;
  qualityHindi: string;
  guidance: string;
}

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

export function getFixedDailyWindows(sunriseHHMM = '06:00'): FixedMuhurtaWindow[] {
  // Brahma Muhurta = 96 minutes before sunrise (per GG.5).
  const brahmaStart = minutesToHHMM(hhmmToMinutes(sunriseHHMM) - 96);
  return [
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
    },
    {
      key: 'durmuhurta',
      hindiName: 'दुर्मुहूर्त',
      startHHMM: '--:--',
      endHHMM: '--:--',
      qualityHindi: 'परिहार्य',
      guidance: 'दिन में दो दुर्मुहूर्त होते हैं — नवारंभ परिहार्य। (सटीक स्पैन [REQUIRES_RESEARCH])'
    }
  ];
}
