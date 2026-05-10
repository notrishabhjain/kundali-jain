import { getNakshatraByDegree } from '../data/nakshatras';

export const JAIN_DASHA_ORDER = [
  'Gyanavaraniya', 'Darshanavaraniya', 'Vedaniya', 'Mohaniya',
  'Ayushya', 'Naam', 'Gotra', 'Antaraya'
];

export const JAIN_DASHA_YEARS: Record<string, number> = {
  Gyanavaraniya: 12, Darshanavaraniya: 9, Vedaniya: 15, Mohaniya: 20,
  Ayushya: 8, Naam: 14, Gotra: 10, Antaraya: 12
};

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

export function calculateDasha(siderealDeg: number, dobStr: string): DashaInfo {
  const nakshatra = getNakshatraByDegree(siderealDeg);
  const nakshatraIndex = nakshatra.index; // 0 to 26

  // 27 nakshatras mapped to 8 karmas
  const startLordIndex = nakshatraIndex % 8;
  const posInNakshatra = ((siderealDeg % 360) + 360) % 360 - nakshatra.start_deg;
  const nakshatraSpan = 13.333333;
  const fractionElapsed = Math.max(0, Math.min(1, posInNakshatra / nakshatraSpan));

  const startLord = JAIN_DASHA_ORDER[startLordIndex];
  const startLordYears = JAIN_DASHA_YEARS[startLord];

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
    const years = JAIN_DASHA_YEARS[lord];
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
        yearsTotal: years,
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
    yearsTotal: JAIN_DASHA_YEARS[lord], startDate: dobStr,
    endDate: yearToDateString(dobYear + remainingFirstDasha), yearsRemaining: 0
  };
  const fallbackPrat: PratyantardashInfo = {
    lord, lord_hindi: JAIN_DASHA_HINDI[lord],
    startDate: dobStr, endDate: yearToDateString(dobYear + remainingFirstDasha), daysRemaining: 0
  };
  return {
    lord,
    lord_hindi: JAIN_DASHA_HINDI[lord],
    yearsTotal: JAIN_DASHA_YEARS[lord],
    startDate: dobStr,
    endDate: yearToDateString(dobYear + remainingFirstDasha),
    yearsRemaining: Math.round(remainingFirstDasha * 10) / 10,
    antardasha: lord,
    antardasha_hindi: JAIN_DASHA_HINDI[lord],
    antardashaInfo: fallbackAntar,
    pratyantardasha: fallbackPrat
  };
}
