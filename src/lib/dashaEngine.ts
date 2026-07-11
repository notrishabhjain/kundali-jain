// Jain dashā engine. Uses the 8-karma cycle (NOT Vedic Vimśottarī) with a 3-level
// decomposition: Mahādaśā → Antardaśā → Pratyantardaśā.
//
// Sources (see references/sources.md — PARITY-REPORT-2026 is PRIMARY per user directive):
//  - 8-karma dashā ordering: MP-§D2 + Codex constraint G2-C1 (zero Vedic mixing).
//  - Per-lord year allotments: PARITY-REPORT-2026 §"Web Port: Layer 2 and Layer 3"
//    (STANDARD_DASHA_YEARS — supersedes the earlier MP-§D2 distillation values).
//  - LAYER 2 "Tithi Pravāh" phase coefficient: PARITY-REPORT-2026 — Shukla paksha
//    amplifies durations up to +15%, Krishna paksha contracts up to −15%, scaled by
//    the birth Moon-Sun elongation.
//  - LAYER 3 "Pancham Kāla Position Modifier": PARITY-REPORT-2026 — the two destructive
//    karmas (Mohaniya, Antaraya) run 1.4× longer dashā periods in the 5th Ara.
//  - Antardaśā / Pratyantardaśā proportional sub-allocation: standard Jain treatment, MP-§D2.
//  - Birth-nakshatra → starting-lord mapping (nakshatra-index mod 8): MP-§D2's "Nakshatra
//    Pravāh Daśā" layer (LAYER 1) — not contradicted by the report, retained.
import { getNakshatraByDegree } from '../data/nakshatras';

export const JAIN_DASHA_ORDER = [
  'Gyanavaraniya', 'Darshanavaraniya', 'Vedaniya', 'Mohaniya',
  'Ayushya', 'Naam', 'Gotra', 'Antaraya'
];

// Source: PARITY-REPORT-2026 STANDARD_DASHA_YEARS (primary; sums to 100).
export const JAIN_DASHA_YEARS: Record<string, number> = {
  Gyanavaraniya: 15, Darshanavaraniya: 9, Vedaniya: 10, Mohaniya: 28,
  Ayushya: 4, Naam: 12, Gotra: 8, Antaraya: 14
};

// ── LAYER 3: Pancham Kāla position modifier ─────────────────────────────────
// Source: PARITY-REPORT-2026 — PANCHAM_KALA_MULTIPLIER applied to the durations of
// the destructive karmas (Mohaniya, Antaraya) while the 5th Ara runs.
export const PANCHAM_KAAL_DASHA_MULTIPLIER = 1.4;
const PANCHAM_KAAL_DESTRUCTIVE_LORDS = new Set(['Mohaniya', 'Antaraya']);

// ── LAYER 2: Tithi Pravāh phase coefficient ─────────────────────────────────
// Source: PARITY-REPORT-2026 — birth Moon-Sun elongation shifts every dashā duration:
// Shukla paksha (elongation < 180°) expands up to +15%, Krishna paksha contracts
// up to −15%. Elongation −1 (unknown) yields a neutral 1.0 coefficient.
export function tithiPravahPhaseCoefficient(moonElongation: number): number {
  if (moonElongation < 0 || moonElongation >= 360) return 1.0;
  return moonElongation < 180
    ? 1.0 + (moonElongation / 360.0) * 0.15
    : 1.0 - ((moonElongation - 180.0) / 360.0) * 0.15;
}

/** Effective mahādaśā duration for a lord after Layer 3 + Layer 2 modifiers.
 *  Source: PARITY-REPORT-2026 computeDynamicDashas. */
export function effectiveDashaYears(lord: string, phaseCoefficient: number): number {
  let years = JAIN_DASHA_YEARS[lord];
  if (PANCHAM_KAAL_DESTRUCTIVE_LORDS.has(lord)) {
    years *= PANCHAM_KAAL_DASHA_MULTIPLIER;
  }
  return years * phaseCoefficient;
}

export const JAIN_DASHA_HINDI: Record<string, string> = {
  Gyanavaraniya: 'ज्ञानावरणीय', Darshanavaraniya: 'दर्शनावरणीय', Vedaniya: 'वेदनीय', Mohaniya: 'मोहनीय',
  Ayushya: 'आयुष्य', Naam: 'नाम', Gotra: 'गोत्र', Antaraya: 'अंतराय'
};

export interface AntardashaInfo {
  lord: string;
  lord_hindi: string;
  yearsTotal: number;
  startDate: string;
  endDate: string;
  yearsRemaining: number;
}

export interface PratyantardashInfo {
  lord: string;
  lord_hindi: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

export interface DashaInfo {
  lord: string;
  lord_hindi: string;
  yearsTotal: number;
  startDate: string;
  endDate: string;
  yearsRemaining: number;
  antardasha: string;
  antardasha_hindi: string;
  antardashaInfo: AntardashaInfo;
  pratyantardasha: PratyantardashInfo;
}

function yearToDateString(year: number): string {
  const y = Math.floor(year);
  const m = Math.floor((year - y) * 12) + 1;
  const d = Math.floor(((year - y) * 12 - (m - 1)) * 30) + 1;
  return `${y}-${String(m).padStart(2, '0')}-${String(Math.min(d, 28)).padStart(2, '0')}`;
}

export function calculateDasha(siderealDeg: number, dobStr: string, birthMoonElongation: number = -1): DashaInfo {
  const nakshatra = getNakshatraByDegree(siderealDeg);
  const nakshatraIndex = nakshatra.index; // 0 to 26

  // 27 nakshatras mapped to 8 karmas
  const startLordIndex = nakshatraIndex % 8;
  const posInNakshatra = ((siderealDeg % 360) + 360) % 360 - nakshatra.start_deg;
  const nakshatraSpan = 13.333333;
  const fractionElapsed = Math.max(0, Math.min(1, posInNakshatra / nakshatraSpan));

  // LAYER 2 + LAYER 3 modifiers on every duration. Source: PARITY-REPORT-2026.
  const phaseCoefficient = tithiPravahPhaseCoefficient(birthMoonElongation);

  const startLord = JAIN_DASHA_ORDER[startLordIndex];
  const startLordYears = effectiveDashaYears(startLord, phaseCoefficient);

  const elapsedYearsInFirstDasha = fractionElapsed * startLordYears;
  const remainingFirstDasha = startLordYears - elapsedYearsInFirstDasha;

  const dobParts = dobStr.split('-').map(Number);
  const dobYear = dobParts[0] + (dobParts[1] - 1) / 12 + (dobParts[2] - 1) / 365.25;

  const firstDashaStartYear = dobYear - elapsedYearsInFirstDasha;

  const today = new Date();
  const currentYear = today.getFullYear() + (today.getMonth()) / 12 + today.getDate() / 365.25;

  let dashaStartYear = firstDashaStartYear;
  let lordIndex = startLordIndex;

  for (let i = 0; i < 24; i++) {
    const lord = JAIN_DASHA_ORDER[lordIndex % 8];
    const years = effectiveDashaYears(lord, phaseCoefficient);
    const dashaEndYear = dashaStartYear + years;

    if (currentYear >= dashaStartYear && currentYear < dashaEndYear) {
      const yearsRemaining = Math.max(0, dashaEndYear - currentYear);

      let antardasha = JAIN_DASHA_ORDER[lordIndex % 8];
      let antardashaInfo: AntardashaInfo = {
        lord: antardasha, lord_hindi: JAIN_DASHA_HINDI[antardasha],
        yearsTotal: 0, startDate: yearToDateString(dashaStartYear),
        endDate: yearToDateString(dashaEndYear), yearsRemaining: 0
      };
      let pratyantardasha: PratyantardashInfo = {
        lord: antardasha, lord_hindi: JAIN_DASHA_HINDI[antardasha],
        startDate: yearToDateString(dashaStartYear), endDate: yearToDateString(dashaEndYear),
        daysRemaining: 0
      };

      let antarStart = dashaStartYear;
      for (let ai = 0; ai < 8; ai++) {
        const antarLord = JAIN_DASHA_ORDER[(lordIndex + ai) % 8];
        const antarYears = (JAIN_DASHA_YEARS[antarLord] / 100) * years;
        const antarEnd = antarStart + antarYears;

        if (currentYear >= antarStart && currentYear < antarEnd) {
          antardasha = antarLord;
          antardashaInfo = {
            lord: antarLord,
            lord_hindi: JAIN_DASHA_HINDI[antarLord],
            yearsTotal: Math.round(antarYears * 100) / 100,
            startDate: yearToDateString(antarStart),
            endDate: yearToDateString(antarEnd),
            yearsRemaining: Math.round(Math.max(0, antarEnd - currentYear) * 10) / 10
          };

          let pratStart = antarStart;
          for (let pi = 0; pi < 8; pi++) {
            const pratLord = JAIN_DASHA_ORDER[(lordIndex + ai + pi) % 8];
            const pratYears = (JAIN_DASHA_YEARS[pratLord] / 100) * antarYears;
            const pratEnd = pratStart + pratYears;

            if (currentYear >= pratStart && currentYear < pratEnd) {
              pratyantardasha = {
                lord: pratLord,
                lord_hindi: JAIN_DASHA_HINDI[pratLord],
                startDate: yearToDateString(pratStart),
                endDate: yearToDateString(pratEnd),
                daysRemaining: Math.round(Math.max(0, pratEnd - currentYear) * 365.25)
              };
              break;
            }
            pratStart = pratEnd;
          }
          break;
        }
        antarStart = antarEnd;
      }

      return {
        lord,
        lord_hindi: JAIN_DASHA_HINDI[lord],
        yearsTotal: Math.round(years * 10) / 10,
        startDate: yearToDateString(dashaStartYear),
        endDate: yearToDateString(dashaEndYear),
        yearsRemaining: Math.round(yearsRemaining * 10) / 10,
        antardasha,
        antardasha_hindi: JAIN_DASHA_HINDI[antardasha],
        antardashaInfo,
        pratyantardasha
      };
    }

    dashaStartYear = dashaEndYear;
    lordIndex++;
  }

  const lord = JAIN_DASHA_ORDER[startLordIndex];
  const fallbackAntar: AntardashaInfo = {
    lord, lord_hindi: JAIN_DASHA_HINDI[lord],
    yearsTotal: Math.round(startLordYears * 10) / 10, startDate: dobStr,
    endDate: yearToDateString(dobYear + remainingFirstDasha), yearsRemaining: 0
  };
  const fallbackPrat: PratyantardashInfo = {
    lord, lord_hindi: JAIN_DASHA_HINDI[lord],
    startDate: dobStr, endDate: yearToDateString(dobYear + remainingFirstDasha), daysRemaining: 0
  };
  return {
    lord,
    lord_hindi: JAIN_DASHA_HINDI[lord],
    yearsTotal: Math.round(startLordYears * 10) / 10,
    startDate: dobStr,
    endDate: yearToDateString(dobYear + remainingFirstDasha),
    yearsRemaining: Math.round(remainingFirstDasha * 10) / 10,
    antardasha: lord,
    antardasha_hindi: JAIN_DASHA_HINDI[lord],
    antardashaInfo: fallbackAntar,
    pratyantardasha: fallbackPrat
  };
}
