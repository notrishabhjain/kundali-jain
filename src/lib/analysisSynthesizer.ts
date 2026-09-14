// Narrative synthesizer — weaves nakshatra, three-layer dashā, dominant karma, gunasthāna,
// today's pañcāṅga, and prescribed sādhana into one personal reading.
//
// Sources (see references/sources.md):
//  - Output contract (200-300 word personalized daily briefing): MP-§D1 + MP-§E3 (Section P1).
//  - Voice rules — always 'आप', never generic, every karma statement must carry a daily-life
//    manifestation, every remedy must have count + timing + karma-connection: MP-§G1 R1-R5.
//  - Pancham-Kāla doctrinal scrub (no mokṣa promise — only samyak-darśana / dev-gati / punya
//    bandha): Codex constraint G2-C3.
//  - Three-layer dashā synthesis (mahā → antar → pratyantar): MP-§D2.
//  - Tirthankara affinity weaving: MP-§C1 + MP-§C2.
//
import { computeGrahaChart, type GrahaChart } from './planets';
import {
  NAKSHATRAS, getNakshatraByDegree, getNakshatraPada,
  getBirthSanctity, getBirthSanctityHindi, describeNakshatraStanding,
  type BirthSanctity
} from '../data/nakshatras';
import { calculateIshtakaal, calculateJainZodiacProjection, type IshtakaalResult, type JainZodiacProjection } from '../data/jainCosmology';
import { calculateApparentSunTimes } from './sunriseEngine';
import { resolveShadGhatiTithi, getGandantStatus } from './calendarEngine';
// Single source of astronomical truth — see src/lib/astronomy.ts. This file
// previously carried its own 16-term lunar truncation that disagreed with
// calendarEngine's 10-term one by up to 8.8 arcmin.
import {
  toJulianDay,
  getSunLongitude,
  getMoonTropicalLongitude,
  getLahiriAyanamsa,
  getMoonSiderealLongitude as getSiderealLongitude,
} from './astronomy';

export interface BirthFormData {
  fullName: string;
  dob: string;       // YYYY-MM-DD
  time: string;      // HH:MM
  place: string;
  lat: string;
  lng: string;
  gender: string;
}

// Re-export from dashaEngine so components can import from analysisSynthesizer
export type { AntardashaInfo, PratyantardashInfo, DashaInfo } from './dashaEngine';
import { calculateDasha } from './dashaEngine';
import type { DashaInfo } from './dashaEngine';
import { estimateGunasthana } from './gunasthanaClassifier';
import { calculateKarmaProfile } from './karmaEngine';
import { generatePredictions } from './predictionEngine';
import { generateRemedies } from './remedyEngine';

export interface UserProfile {
  name: string;
  gender: string;
  birthNakshatra: string;         // English name, e.g. "Rohini"
  birthNakshatraHindi: string;    // Hindi: "रोहिणी"
  nakshatraPada: number;          // 1–4
  birthRashi: string;             // Rashi (approximate from nakshatra)
  moonLongitude: number;          // sidereal degrees
  tirthankarAffinity: string;     // Primary tirthankara to worship
  tirthankarAffinityHindi: string;
  nakshatraKarmaType: string;     // dominant karma type for this nakshatra
  nakshatraNature: string;        // param_shubha / shubha / mishra / ashubha
  nakshatraNatureHindi: string;
  // Birth sanctity — the SECOND, independent claim. `nakshatraNature` above is a
  // Sanjna-derived muhurta grade; these say whether a Tirthankara was born in
  // the star. Neither is computed from the other, and for seven nakshatras they
  // point different ways. See the header of src/data/nakshatras.ts.
  // Source: MP-§C2 + CLAUDE.md rule 4.
  nakshatraBirthSanctity: BirthSanctity;
  nakshatraBirthSanctityHindi: string;
  /** Both claims stated together; says so plainly where they diverge. */
  nakshatraStanding: string;
  currentDasha: DashaInfo;
  dominantKarma: string;          // Hindi karma name
  dominantKarmaEn: string;        // English karma name for comparisons
  gunasthana: number;             // 1–14, estimated
  formData: BirthFormData;
  // Jain high-precision temporal coordinate (Surya Prajnapti + Research Report §2).
  // The mathematical anchor is umbilical cord severance. Source: Research Report §2.
  ishtakaal: IshtakaalResult;
  // Jain sidereal zodiac projection (unequal muhurta spans from Surya Prajnapti).
  // Source: Research Report §4 + SP-1.
  jainZodiacProjection: JainZodiacProjection;
  // Nine grahas, lagna and whole-sign bhavas. Positions only — the grahas are
  // Jyotishi Devs and NIMITTA (indicative), never causal; see src/lib/planets.ts
  // for why computing them does not breach G2-C1, and grahas.ts for the frame
  // they are read in. Undefined when the birth coordinates are unparsable.
  grahaChart?: GrahaChart;
  // Legacy fields kept for backward compatibility with existing components
  birthNakshatraLegacy?: string;  // same as birthNakshatra
  currentDashaLegacy?: string;    // same as currentDasha.lord_hindi
  /** Set when the birth Moon sits in a Gandant junction (blueprint §B.7) */
  gandantWarning?: string;
}

// ─── Astronomical calculations ───────────────────────────────────────────────

function toRad(deg: number): number { return (deg * Math.PI) / 180; }
function normDeg(d: number): number { return ((d % 360) + 360) % 360; }


// Simplified Moon longitude (Meeus Ch. 47, major terms only)
// Accurate to ~0.5° — sufficient for nakshatra identification

// Lahiri ayanamsa (cubic approximation per IAU/Lahiri)


// ─── Rashi from sidereal longitude ───────────────────────────────────────────

const RASHI_NAMES = [
  'मेष (Aries)', 'वृष (Taurus)', 'मिथुन (Gemini)', 'कर्क (Cancer)',
  'सिंह (Leo)', 'कन्या (Virgo)', 'तुला (Libra)', 'वृश्चिक (Scorpio)',
  'धनु (Sagittarius)', 'मकर (Capricorn)', 'कुंभ (Aquarius)', 'मीन (Pisces)'
];

function getRashi(siderealDeg: number): string {
  return RASHI_NAMES[Math.floor(normDeg(siderealDeg) / 30)];
}

// ─── Vimshottari dasha calculation moved to dashaEngine.ts ───────────────

// ─── Karma mapping ────────────────────────────────────────────────────────────

const KARMA_HINDI: Record<string, string> = {
  'Gyanavaraniya':    'ज्ञानावरणीय',
  'Darshanavaraniya': 'दर्शनावरणीय',
  'Vedaniya':         'वेदनीय',
  'Mohaniya':         'मोहनीय',
  'Charitra Mohaniya':'चारित्र मोहनीय',
  'Ayushya':          'आयुष्य',
  'Naam':             'नाम',
  'Gotra':            'गोत्र',
  'Antaraya':         'अंतराय',
  'Sarva karma kshay':'सर्व कर्म क्षय'
};

const NATURE_HINDI: Record<string, string> = {
  'param_shubha': 'परम शुभ',
  'shubha':       'शुभ',
  'mishra':       'मिश्र',
  'ashubha':      'अशुभ'
};

// ─── Tirthankara affinity ─────────────────────────────────────────────────────

const TIRTHANKAR_HI_TO_EN: Record<string, string> = {
  'ऋषभदेव': 'Rishabhdev', 'आदिनाथ': 'Adinatha', 'अजितनाथ': 'Ajitnatha', 'संभवनाथ': 'Sambhavanatha',
  'अभिनन्दननाथ': 'Abhinandananatha', 'सुमतिनाथ': 'Sumatinatha', 'पद्मप्रभु': 'Padmaprabhu',
  'सुपार्श्वनाथ': 'Suparshvanatha', 'चन्द्रप्रभु': 'Chandraprabhu', 'सुविधिनाथ': 'Suvidhinate',
  'शीतलनाथ': 'Shitalnatha', 'श्रेयांसनाथ': 'Shreyamsanatha', 'वासुपूज्यनाथ': 'Vasupujyanatha',
  'विमलनाथ': 'Vimalnatha', 'अनंतनाथ': 'Anantnatha', 'धर्मनाथ': 'Dharmanatha',
  'शान्तिनाथ': 'Shantinatha', 'कुन्थुनाथ': 'Kunthunatha', 'अरनाथ': 'Aranatha',
  'मल्लिनाथ': 'Mallinatha', 'मुनिसुव्रतनाथ': 'Munisuvratanatha', 'नमिनाथ': 'Naminatha',
  'नेमिनाथ': 'Neminatha', 'पार्श्वनाथ': 'Parshvanatha', 'महावीर स्वामी': 'Mahavira'
};

function getTirthankarAffinity(nakshatra: typeof NAKSHATRAS[0]): { en: string; hi: string } {
  if (nakshatra.tirthankaras_born.length > 0) {
    const first = nakshatra.tirthankaras_born[0];
    // Extract Hindi name from "नमिनाथ (21)" style
    const match = first.match(/^([^\(]+)/);
    const hi = match ? match[1].trim() : first;
    const en = TIRTHANKAR_HI_TO_EN[hi] || hi;
    return { en, hi };
  }
  // Default by karma type
  const defaults: Record<string, { en: string; hi: string }> = {
    'Gyanavaraniya':    { en: 'Kunthunatha', hi: 'कुन्थुनाथ' },
    'Darshanavaraniya': { en: 'Naminatha',   hi: 'नमिनाथ' },
    'Mohaniya':         { en: 'Parshvanatha',hi: 'पार्श्वनाथ' },
    'Charitra Mohaniya':{ en: 'Dharmanatha', hi: 'धर्मनाथ' },
    'Vedaniya':         { en: 'Padmaprabhu', hi: 'पद्मप्रभु' },
    'Antaraya':         { en: 'Sambhavanatha',hi: 'सम्भवनाथ' },
    'Naam':             { en: 'Abhinandananatha', hi: 'अभिनन्दननाथ' },
    'Gotra':            { en: 'Mallinatha',  hi: 'मल्लिनाथ' },
    'Ayushya':          { en: 'Aranatha',    hi: 'अरनाथ' }
  };
  return defaults[nakshatra.karma_type] || { en: 'Mahavira', hi: 'महावीर स्वामी' };
}

// ─── Ishtakaal: apparent sunrise (Meeus Ch. 15) ──────────────────────────────
// Source: PARITY-REPORT-2026 §"Jean Meeus Chapter 15" — the cosine seasonal
// approximation is deprecated; sunrise now comes from the astronomical horizon
// transit algorithm in sunriseEngine.ts. Falls back to 06:00 only when the
// coordinates are unparsable or the location is in polar day/night.
function apparentSunriseHHMM(latStr: string, lngStr: string, dob: string): string {
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return '06:00';
  const times = calculateApparentSunTimes(dob, lat, lng);
  if (times.polarDay || times.polarNight) return '06:00';
  return times.sunriseHHMM;
}

// ─── Gunasthana estimate (Sarvarthasiddhi classifier) ────────────────────────
// Source: PARITY-REPORT-2026 §"GunasthanaClassifier (Sarvarthasiddhi Criteria)"
// Replaces the former 4-branch nakshatra-bucket heuristic.
// estimateGunasthana() now lives in gunasthanaClassifier.ts; imported above.

// ─── Main export ──────────────────────────────────────────────────────────────

// Raised when the birth date/time cannot be parsed into a valid ephemeris epoch.
// Source: Master Engineering Specification §1.6 — fallback name-hash chart removed;
// parsing failures must be fatal and explicit.
export class InvalidEphemerisEpochException extends Error {
  constructor(
    message: string,
    public readonly metadata: Record<string, unknown> = {}
  ) {
    super(`[Ephemeris Engine] Date/coordinate parsing failed: ${message}`);
    this.name = 'InvalidEphemerisEpochException';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
/** @deprecated Use InvalidEphemerisEpochException */
export const InvalidEphemerisEpochError = InvalidEphemerisEpochException;

export function generateUserProfile(data: BirthFormData): UserProfile {
  let siderealDeg: number;
  let birthMoonElongation = -1;

  try {
    const jde = toJulianDay(data.dob, data.time || '12:00');
    siderealDeg = getSiderealLongitude(jde);
    if (!Number.isFinite(siderealDeg)) {
      throw new Error('non-finite longitude');
    }
    // Birth Moon-Sun elongation feeds the LAYER 2 Tithi Pravāh phase coefficient.
    // Source: PARITY-REPORT-2026 computeDynamicDashas(moonElongation).
    birthMoonElongation = normDeg(getMoonTropicalLongitude(jde) - getSunLongitude(jde));
  } catch {
    // Source: PARITY-REPORT-2026 — no fabricated chart on parse failure.
    throw new InvalidEphemerisEpochError(
      'जन्म तिथि या समय अमान्य है। कृपया जन्म-विवरण (YYYY-MM-DD और HH:MM) पुनः जाँच कर भरें — बिना सही जन्म-क्षण के प्रामाणिक कुंडली की गणना संभव नहीं है।'
    );
  }

  const nakshatra = getNakshatraByDegree(siderealDeg);
  const pada = getNakshatraPada(siderealDeg);
  const rashi = getRashi(siderealDeg);
  const dasha = calculateDasha(siderealDeg, data.dob, birthMoonElongation);
  const tirthankar = getTirthankarAffinity(nakshatra);
  const gunasthana = estimateGunasthana(nakshatra.nature, dasha.lord);

  const karmaType = nakshatra.karma_type;
  const dominantKarmaHindi = KARMA_HINDI[karmaType] || karmaType;

  // Ishtakaal: elapsed time from the APPARENT astronomical sunrise to birth,
  // in ghati/pala/vipala units. Source: PARITY-REPORT-2026 (Meeus Ch. 15 sunrise
  // + Precise Ishtakaal Conversion).
  const sunriseTime = apparentSunriseHHMM(data.lat, data.lng, data.dob);
  const ishtakaal = calculateIshtakaal(data.time || '12:00', sunriseTime);

  // Jain sidereal zodiac projection — unequal muhurta spans from Surya Prajnapti.
  // Source: Research Report §4 + SP-1.
  const jainZodiacProjection = calculateJainZodiacProjection(siderealDeg);

  // Nine grahas + lagna. Never allowed to block profile generation: the karma
  // reading is the primary output and must survive a coordinate it cannot parse.
  let grahaChart: GrahaChart | undefined;
  try {
    const lat = parseFloat(data.lat);
    const lng = parseFloat(data.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      grahaChart = computeGrahaChart(data.dob, data.time || '12:00', lat, lng);
    }
  } catch {
    grahaChart = undefined;
  }

  // Gandant birth warning (blueprint §B.7) — Moon within ±10′ of a water→fire
  // sign junction (Ashlesha→Magha, Jyeshtha→Mula, Revati→Ashvini).
  let gandantWarning: string | undefined;
  try {
    const g = getGandantStatus(siderealDeg);
    if (g.inGandant) {
      gandantWarning = `गंडांत-क्षेत्र जन्म (${g.junctionHindi} संधि, ${g.distanceGhatis} घटी दूरी): मूल-शांति के रूप में णमोकार महामंत्र का विशेष जाप नियत करें।`;
    }
  } catch {
    // never block profile generation on the advisory path
  }

  return {
    name: data.fullName,
    gender: data.gender,
    birthNakshatra: nakshatra.name,
    birthNakshatraHindi: nakshatra.hindi_name,
    nakshatraPada: pada,
    birthRashi: rashi,
    moonLongitude: Math.round(siderealDeg * 100) / 100,
    tirthankarAffinity: tirthankar.hi,
    tirthankarAffinityHindi: tirthankar.hi,
    nakshatraKarmaType: karmaType,
    nakshatraNature: nakshatra.nature,
    nakshatraNatureHindi: NATURE_HINDI[nakshatra.nature] || nakshatra.nature,
    nakshatraBirthSanctity: getBirthSanctity(nakshatra),
    nakshatraBirthSanctityHindi: getBirthSanctityHindi(nakshatra),
    nakshatraStanding: describeNakshatraStanding(nakshatra),
    currentDasha: dasha,
    dominantKarma: dominantKarmaHindi,
    dominantKarmaEn: karmaType,
    gunasthana,
    formData: data,
    ishtakaal,
    jainZodiacProjection,
    grahaChart,
    // Legacy compatibility
    birthNakshatraLegacy: nakshatra.hindi_name,
    currentDashaLegacy: dasha.lord_hindi,
    gandantWarning
  };
}

// ─── Day context (today's panchang stub) ──────────────────────────────────────

export interface DayContext {
  tithi: string;
  vara: string;
  nakshatra: string;
  paksha: string;
}

export function getTodayContext(): DayContext {
  const now = new Date();

  // Vara (day of week in Hindi)
  const varas = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const vara = varas[now.getDay()];

  // Approximate Moon nakshatra for today
  const jde = toJulianDay(
    `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`,
    `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
  );
  const todaySidereal = getSiderealLongitude(jde);
  const todayNakshatra = getNakshatraByDegree(todaySidereal);

  // Approximate tithi (lunar day) — use equation-of-center corrected Sun longitude
  const sunLong = getSunLongitude(jde);
  const moonLong = getMoonTropicalLongitude(jde);
  const elongation = normDeg(moonLong - sunLong);
  const tithiNum = Math.floor(elongation / 12) + 1;
  const paksha = elongation < 180 ? 'शुक्ल' : 'कृष्ण';
  const tithiNames = ['', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा/अमावस्या'];
  const tithiIndex = tithiNum > 15 ? tithiNum - 15 : tithiNum;
  const tithi = `${paksha} ${tithiNames[tithiIndex] || 'एकादशी'}`;

  return {
    tithi,
    vara,
    nakshatra: todayNakshatra.hindi_name,
    paksha
  };
}

// ─── Upcoming vrat dates computation ─────────────────────────────────────────

export type VratType = 'ekadashi' | 'chaturdashi' | 'purnima' | 'amavasya' | 'nakshatra';

export interface UpcomingVrat {
  date: Date;
  tithiRaw: number;        // 0-29 (raw floor(elongation/12))
  paksha: 'shukla' | 'krishna';
  tithiNum: number;        // 1-15 within paksha
  tithiHindi: string;
  nakshatraIndex: number;  // 0-26
  vratType: VratType;
  name: string;
  /** true when the Shad-Ghati rule moved this vrat to the preceding civil day */
  shadGhatiAdjusted?: boolean;
  /** present when a Kshaya (lost) tithi was detected around this date */
  kshayaNote?: string;
}

const TITHI_NAMES_HINDI = [
  'प्रतिपदा','द्वितीया','तृतीया','चतुर्थी','पंचमी',
  'षष्ठी','सप्तमी','अष्टमी','नवमी','दशमी',
  'एकादशी','द्वादशी','त्रयोदशी','चतुर्दशी','पूर्णिमा'
];


export function getUpcomingVratDates(birthNakshatraIndex: number, daysAhead = 60): UpcomingVrat[] {
  const SPECIAL_TITHIS = new Set([10, 13, 14, 25, 28, 29]);
  const today = new Date();
  const results: UpcomingVrat[] = [];

  let prevTithiRaw = -1;
  let prevNakshatraIdx = -1;

  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const jde = toJulianDay(dateStr, '06:00');

    const moonTropical = getMoonTropicalLongitude(jde);
    const sunLong = getSunLongitude(jde);
    const elongation = normDeg(moonTropical - sunLong);
    const tithiRaw = Math.floor(elongation / 12);   // 0-29
    const paksha: 'shukla' | 'krishna' = elongation < 180 ? 'shukla' : 'krishna';
    const tithiNum = tithiRaw < 15 ? tithiRaw + 1 : tithiRaw - 14;
    const tithiHindi = tithiRaw === 29
      ? 'अमावस्या'
      : (TITHI_NAMES_HINDI[tithiNum - 1] || 'एकादशी');

    const sidereal = getSiderealLongitude(jde);
    const nakshatraIdx = Math.min(Math.floor(normDeg(sidereal) / 13.333333), 26);

    // Tithi-based vrats — record when tithi changes to a special value.
    // Shad-Ghati rule (GAP_CLOSING_RESEARCH GP.8/GP.9 — Jain panchang parva-nirnay):
    // a tithi present at sunrise must survive ≥6 ghatis after sunrise; otherwise the
    // vrat is observed on the PRECEDING day. Kshaya (lost) tithi also shifts earlier.
    if (tithiRaw !== prevTithiRaw && SPECIAL_TITHIS.has(tithiRaw)) {
      const resolution = resolveShadGhatiTithi(dateStr, '06:00', i > 0 ? prevTithiRaw : undefined);
      const shadGhatiAdjusted = !resolution.shadGhatiValid;

      let vratType: VratType;
      let name: string;
      if (tithiRaw === 10)  { vratType = 'ekadashi';    name = 'शुक्ल एकादशी'; }
      else if (tithiRaw === 25) { vratType = 'ekadashi'; name = 'कृष्ण एकादशी'; }
      else if (tithiRaw === 13) { vratType = 'chaturdashi'; name = 'शुक्ल चतुर्दशी'; }
      else if (tithiRaw === 28) { vratType = 'chaturdashi'; name = 'कृष्ण चतुर्दशी'; }
      else if (tithiRaw === 14) { vratType = 'purnima';  name = 'पूर्णिमा'; }
      else                       { vratType = 'amavasya'; name = 'अमावस्या'; }

      if (shadGhatiAdjusted) {
        name += ' (षड्-घटि: पूर्व दिन संपन्न)';
      }

      // Under the Shad-Ghati shift the vrat belongs to the preceding civil day.
      const eventDate = shadGhatiAdjusted ? new Date(d.getTime() - 24 * 60 * 60 * 1000) : new Date(d);

      results.push({
        date: eventDate,
        tithiRaw, paksha, tithiNum, tithiHindi,
        nakshatraIndex: nakshatraIdx,
        vratType, name,
        shadGhatiAdjusted,
        kshayaNote: resolution.kshayaDetected
          ? 'क्षय तिथि — तिथि सूर्योदय के मध्य ही समाप्त; व्रत पूर्व दिन अथवा इसी दिन प्रातः संपन्न करें।'
          : undefined
      });
    }

    // Nakshatra-based vrat — record when moon enters birth nakshatra
    if (nakshatraIdx === birthNakshatraIndex && prevNakshatraIdx !== birthNakshatraIndex) {
      results.push({ date: new Date(d), tithiRaw, paksha, tithiNum, tithiHindi, nakshatraIndex: nakshatraIdx, vratType: 'nakshatra', name: 'जन्म नक्षत्र व्रत' });
    }

    prevTithiRaw = tithiRaw;
    prevNakshatraIdx = nakshatraIdx;
  }

  return results.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// ─── Narrative generator ──────────────────────────────────────────────────────

export class AnalysisSynthesizer {
  static generateTodaysMessage(profile: UserProfile, day: DayContext): string {
    const greeting = `जय जिनेंद्र।\n\n`;

    const tithiOpening = `आज ${day.tithi} की पावन तिथि है, वार ${day.vara} है। आत्म-निरीक्षण और इंद्रिय-संयम का यह विशेष अवसर है। `;

    const astrologicalContext = `आपका जन्म ${profile.birthNakshatraHindi} नक्षत्र (${profile.nakshatraNatureHindi} प्रकृति, पाद ${profile.nakshatraPada}) में हुआ है। यह ${profile.birthRashi} का नक्षत्र है। वर्तमान में आप ${profile.currentDasha.lord_hindi} महादशा में हैं (शेष ${profile.currentDasha.yearsRemaining} वर्ष)। ${profile.currentDasha.antardasha_hindi} अंतर्दशा चल रही है।\n\n`;

    // Fetch dynamic karma narrative from engines
    const karmaProfile = calculateKarmaProfile(profile.dominantKarmaEn, profile.currentDasha.lord, profile.gunasthana);
    const dominant = karmaProfile.find(k => k.karmaEn === profile.dominantKarmaEn) || karmaProfile[0];
    
    const karmaNarrative = `${profile.birthNakshatraHindi} नक्षत्र में जन्मे जातकों में ${dominant.karmaHindi} कर्म का विशेष प्रभाव रहता है। ${profile.currentDasha.lord_hindi} दशा में यह कर्म इस रूप में प्रकट होता है: ${dominant.manifestation}\n\n`;

    const remedies = generateRemedies(profile);
    const prescription = `${day.tithi} की इस ऊर्जा में आज आपके लिए विशेष साधना है: ${remedies.primarySadhana}\n\nआज ${profile.currentDasha.lord_hindi} दशा की चंचलता को सम्यग्दर्शन की दृढ़ता में बदलने का अवसर है। ${remedies.dashaRemedy}`;

    return greeting + tithiOpening + astrologicalContext + karmaNarrative + prescription;
  }
}
