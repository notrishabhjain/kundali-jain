import { NAKSHATRAS, getNakshatraByDegree, getNakshatraPada } from '../data/nakshatras';
import { VIMSHOTTARI_ORDER, VIMSHOTTARI_YEARS, VIMSHOTTARI_HINDI } from '../data/grahas';

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
  currentDasha: DashaInfo;
  dominantKarma: string;          // Hindi karma name
  dominantKarmaEn: string;        // English karma name for comparisons
  gunasthana: number;             // 1–14, estimated
  formData: BirthFormData;
  // Legacy fields kept for backward compatibility with existing components
  birthNakshatraLegacy?: string;  // same as birthNakshatra
  currentDashaLegacy?: string;    // same as currentDasha.lord_hindi
}

// ─── Astronomical calculations ───────────────────────────────────────────────

function toRad(deg: number): number { return (deg * Math.PI) / 180; }
function normDeg(d: number): number { return ((d % 360) + 360) % 360; }

function toJulianDay(dateStr: string, timeStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);
  // IST = UTC+5:30, so subtract 5.5h to get UTC
  const utcHour = (hh + mm / 60 - 5.5 + 24) % 24;

  let Y = year, M = month;
  if (M <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + utcHour / 24 + B - 1524.5;
}

// Simplified Moon longitude (Meeus Ch. 47, major terms only)
// Accurate to ~0.5° — sufficient for nakshatra identification
function getMoonTropicalLongitude(jde: number): number {
  const T = (jde - 2451545.0) / 36525;

  // Mean elements
  let L  = 218.3164477 + 481267.88123421 * T;   // mean longitude
  const M  = normDeg(357.5291092 + 35999.0502909 * T);  // sun anomaly
  const Mm = normDeg(134.9633964 + 477198.8675055 * T); // moon anomaly
  const D  = normDeg(297.8501921 + 445267.1114034 * T); // elongation
  const F  = normDeg(93.2720950  + 483202.0175233 * T); // lat argument

  // Longitude corrections (major terms, degrees)
  const sigma =
    6.288774 * Math.sin(toRad(Mm)) +
    1.274027 * Math.sin(toRad(2 * D - Mm)) +
    0.658314 * Math.sin(toRad(2 * D)) +
    0.213618 * Math.sin(toRad(2 * Mm)) -
    0.185116 * Math.sin(toRad(M)) -
    0.114332 * Math.sin(toRad(2 * F)) +
    0.058793 * Math.sin(toRad(2 * D - 2 * Mm)) +
    0.057066 * Math.sin(toRad(2 * D - M - Mm)) +
    0.053322 * Math.sin(toRad(2 * D + Mm)) +
    0.045758 * Math.sin(toRad(2 * D - M)) -
    0.040923 * Math.sin(toRad(M - Mm)) -
    0.034720 * Math.sin(toRad(D)) -
    0.030383 * Math.sin(toRad(M + Mm)) +
    0.015327 * Math.sin(toRad(2 * D - 2 * F)) -
    0.012528 * Math.sin(toRad(Mm + 2 * F)) +
    0.010980 * Math.sin(toRad(Mm - 2 * F));

  return normDeg(L + sigma);
}

// Lahiri ayanamsa (cubic approximation per IAU/Lahiri)
function getLahiriAyanamsa(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  return 23.85048 + 1.396971 * T + 0.000308 * T * T + 0.000002 * T * T * T;
}

function getSiderealLongitude(jde: number): number {
  const tropical = getMoonTropicalLongitude(jde);
  const ayanamsa = getLahiriAyanamsa(jde);
  return normDeg(tropical - ayanamsa);
}

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

// ─── Gunasthana estimate ──────────────────────────────────────────────────────

function estimateGunasthana(nakshatraNature: string, dashaLord: string): number {
  // Base from nakshatra nature (most people in Pancham Kaal are in 1st-4th)
  let base = 1;
  if (nakshatraNature === 'param_shubha') base = 4;
  else if (nakshatraNature === 'shubha') base = 3;
  else if (nakshatraNature === 'mishra') base = 2;

  // Mohaniya or Darshanavaraniya dasha suppresses clarity — lower by 1
  if (dashaLord === 'Mohaniya' || dashaLord === 'Darshanavaraniya') {
    base = Math.max(1, base - 1);
  }
  // Gyanavaraniya dasha slightly obscures knowledge
  if (dashaLord === 'Gyanavaraniya') {
    base = Math.max(1, base - 1);
  }
  // Vedaniya in Udaya can distract from spiritual clarity
  if (dashaLord === 'Vedaniya' && base > 2) {
    base = Math.max(2, base - 1);
  }

  return base;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateUserProfile(data: BirthFormData): UserProfile {
  let siderealDeg: number;

  try {
    const jde = toJulianDay(data.dob, data.time || '12:00');
    siderealDeg = getSiderealLongitude(jde);
  } catch {
    // Fallback to hash-based if date parsing fails
    let hash = 0;
    for (let i = 0; i < data.fullName.length; i++) {
      hash = data.fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    siderealDeg = Math.abs(hash) % 360;
  }

  const nakshatra = getNakshatraByDegree(siderealDeg);
  const pada = getNakshatraPada(siderealDeg);
  const rashi = getRashi(siderealDeg);
  const dasha = calculateDasha(siderealDeg, data.dob);
  const tirthankar = getTirthankarAffinity(nakshatra);
  const gunasthana = estimateGunasthana(nakshatra.nature, dasha.lord);

  const karmaType = nakshatra.karma_type;
  const dominantKarmaHindi = KARMA_HINDI[karmaType] || karmaType;

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
    currentDasha: dasha,
    dominantKarma: dominantKarmaHindi,
    dominantKarmaEn: karmaType,
    gunasthana,
    formData: data,
    // Legacy compatibility
    birthNakshatraLegacy: nakshatra.hindi_name,
    currentDashaLegacy: dasha.lord_hindi
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
}

const TITHI_NAMES_HINDI = [
  'प्रतिपदा','द्वितीया','तृतीया','चतुर्थी','पंचमी',
  'षष्ठी','सप्तमी','अष्टमी','नवमी','दशमी',
  'एकादशी','द्वादशी','त्रयोदशी','चतुर्दशी','पूर्णिमा'
];

function getSunLongitude(jde: number): number {
  const T = (jde - 2451545) / 36525;
  const L0 = normDeg(280.46646 + 36000.76983 * T);   // mean longitude
  const M  = normDeg(357.52911 + 35999.05029 * T - 0.0001537 * T * T);  // mean anomaly
  // Equation of center (Meeus Ch.25)
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(toRad(M))
          + (0.019993 - 0.000101 * T) * Math.sin(toRad(2 * M))
          + 0.000289 * Math.sin(toRad(3 * M));
  return normDeg(L0 + C);
}

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

    // Tithi-based vrats — record when tithi changes to a special value
    if (tithiRaw !== prevTithiRaw && SPECIAL_TITHIS.has(tithiRaw)) {
      let vratType: VratType;
      let name: string;
      if (tithiRaw === 10)  { vratType = 'ekadashi';    name = 'शुक्ल एकादशी'; }
      else if (tithiRaw === 25) { vratType = 'ekadashi'; name = 'कृष्ण एकादशी'; }
      else if (tithiRaw === 13) { vratType = 'chaturdashi'; name = 'शुक्ल चतुर्दशी'; }
      else if (tithiRaw === 28) { vratType = 'chaturdashi'; name = 'कृष्ण चतुर्दशी'; }
      else if (tithiRaw === 14) { vratType = 'purnima';  name = 'पूर्णिमा'; }
      else                       { vratType = 'amavasya'; name = 'अमावस्या'; }
      results.push({ date: new Date(d), tithiRaw, paksha, tithiNum, tithiHindi, nakshatraIndex: nakshatraIdx, vratType, name });
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
