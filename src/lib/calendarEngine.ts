// Jain Panchang Engine
// Calculates Tithi, Masa, Paksha, and Jain specific Vrat/Festivals

import { getNakshatraByDegree } from '../data/nakshatras';

function toRad(deg: number): number { return (deg * Math.PI) / 180; }
function normDeg(d: number): number { return ((d % 360) + 360) % 360; }

export function toJulianDay(dateStr: string, timeStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);
  const utcHour = (hh + mm / 60 - 5.5 + 24) % 24;

  let Y = year, M = month;
  if (M <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + utcHour / 24 + B - 1524.5;
}

export function getSunLongitude(jde: number): number {
  const T = (jde - 2451545) / 36525;
  const L0 = normDeg(280.46646 + 36000.76983 * T);   // mean longitude
  const M  = normDeg(357.52911 + 35999.05029 * T - 0.0001537 * T * T);  // mean anomaly
  // Equation of center (Meeus Ch. 25) — unified with analysisSynthesizer so both
  // panchang paths agree. Source: PARITY-REPORT-2026 §"Linear Ayanamsa versus
  // Lahiri Formulation" (deprecates simplified inline models).
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(toRad(M))
          + (0.019993 - 0.000101 * T) * Math.sin(toRad(2 * M))
          + 0.000289 * Math.sin(toRad(3 * M));
  return normDeg(L0 + C);
}

export function getMoonTropicalLongitude(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  let L = 218.3164477 + 481267.88123421 * T;
  const M = normDeg(357.5291092 + 35999.0502909 * T);
  const Mm = normDeg(134.9633964 + 477198.8675055 * T);
  const D = normDeg(297.8501921 + 445267.1114034 * T);
  const F = normDeg(93.2720950 + 483202.0175233 * T);

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
    0.045758 * Math.sin(toRad(2 * D - M));

  return normDeg(L + sigma);
}

// High-precision Lahiri (Chitra Paksha) ayanamsa.
// θ = 23°51′25.532″ + 5029.0966″·T + 1.11161″·T² − 0.000113″·T³
// Source: PARITY-REPORT-2026 §"Linear Ayanamsa versus Lahiri Formulation" —
// replaces the deprecated linear model.
export function getLahiriAyanamsa(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  return (23 * 3600 + 51 * 60 + 25.532
        + 5029.0966 * T
        + 1.11161 * T * T
        - 0.000113 * T * T * T) / 3600;
}

export function getSiderealLongitude(jde: number): number {
  const tropical = getMoonTropicalLongitude(jde);
  const ayanamsa = getLahiriAyanamsa(jde);
  return normDeg(tropical - ayanamsa);
}

// ─── Gandant detection (GP.7) ─────────────────────────────────────────────────
// Source: GAP_CLOSING_RESEARCH GP.7 — VERIFIED.
//   Gandant = junction of water-sign nakshatra END and fire-sign nakshatra BEGIN:
//   Ashlesha→Magha, Jyeshtha→Mula, Revati→Ashvini (Abhijit excluded).
//   Standard danger span: 1 ghati BEFORE and 1 ghati AFTER the junction
//   (2 ghatis total ≈ 48 minutes). Some traditions widen to 4 ghatis — we use
//   the 2-ghati Muhurta-Chintamani-derived standard that Jain panchang follows.
// Geometry: the Moon traverses ~13°11' of sidereal longitude per day, so
//   1 ghati (24 min) of lunar motion ≈ 13.17639/60 × 0.4 ≈ 0.22°.
const GANDANT_JUNCTIONS: { endDeg: number; endHindi: string; startHindi: string }[] = [
  { endDeg: 3 * (360 / 27),  endHindi: 'अश्लेषा', startHindi: 'मघा' },    // 40°
  { endDeg: 9 * (360 / 27),  endHindi: 'ज्येष्ठा', startHindi: 'मूल' },    // 120°
  { endDeg: 360,             endHindi: 'रेवती',   startHindi: 'अश्विनी' } // 0°/360°
];

export const GANDANT_ARC_DEGREES_PER_GHATI = 13.17639 / 60; // sidereal Moon deg per 24 min

export interface GandantStatus {
  inGandant: boolean;
  junctionHindi: string;       // "अश्लेषा → मघा" etc.
  /** absolute distance from the junction, in ghatis */
  distanceGhatis: number;
}

export function getGandantStatus(siderealDeg: number): GandantStatus {
  const d = normDeg(siderealDeg);
  let best: GandantStatus | null = null;
  for (const j of GANDANT_JUNCTIONS) {
    // circular distance to the junction point on the 360° ring
    let diff = Math.abs(d - (j.endDeg % 360));
    if (diff > 180) diff = 360 - diff;
    const distGhatis = diff / GANDANT_ARC_DEGREES_PER_GHATI;
    const status: GandantStatus = {
      inGandant: distGhatis <= 1.0,
      junctionHindi: `${j.endHindi} → ${j.startHindi}`,
      distanceGhatis: Math.round(distGhatis * 100) / 100
    };
    if (!best || status.distanceGhatis < best.distanceGhatis) best = status;
  }
  return best as GandantStatus;
}

// ─── Shad-Ghati (षड्-घटी) tithi resolution (GP.8/GP.9) ────────────────────────
// Source: GAP_CLOSING_RESEARCH GP.8 + GP.9 — VERIFIED (Jain panchang parva-nirnay):
//   A tithi prevailing at sunrise must run for AT LEAST 6 ghatis after sunrise;
//   otherwise its vrat/festival is observed on the PRECEDING day.
//   Kshaya (lost) tithi: begins+ends within one sunrise-to-sunrise span — both
//   neighbours share the day; vrat shifts earlier. Vriddhi (expanded): spans two
//   sunrises; vrat observed on the FIRST of the two days.

/** Mean elongation growth rate: Moon ~13.17639°/day − Sun ~0.9856°/day. */
const ELONGATION_RATE_DEG_PER_DAY = 13.17639 - 0.9856;

export interface ShadGhatiTithiResolution {
  /** raw tithi index 0–29 present at sunrise */
  tithiRawAtSunrise: number;
  paksha: 'शुक्ल' | 'कृष्ण';
  tithiNum: number;              // 1–15 within the paksha
  /** ghatis remaining of this tithi AFTER sunrise */
  ghatisRemainingAfterSunrise: number;
  /** true when the tithi survives ≥6 ghatis past sunrise → valid for today's vrat */
  shadGhatiValid: boolean;
  /** true when the previous day's tithi was skipped entirely between sunrises */
  kshayaDetected: boolean;
}

/**
 * Resolves the Shad-Ghati rule for a given civil date.
 * @param dateStr  YYYY-MM-DD
 * @param sunriseHHMM local apparent sunrise (defaults 06:00)
 * @param prevTithiRawAtSunrise tithi raw at YESTERDAY'S sunrise (for kshaya detection); omit to skip
 */
export function resolveShadGhatiTithi(
  dateStr: string,
  sunriseHHMM = '06:00',
  prevTithiRawAtSunrise?: number
): ShadGhatiTithiResolution {
  const jde = toJulianDay(dateStr, sunriseHHMM);
  const elongation = normDeg(getMoonTropicalLongitude(jde) - getSunLongitude(jde));
  const tithiRawAtSunrise = Math.floor(elongation / 12);

  // degrees remaining until the next 12° boundary → hours remaining → ghatis (1 ghati = 24 min)
  const degIntoTithi = elongation - tithiRawAtSunrise * 12;
  const degRemaining = Math.max(0, 12 - degIntoTithi);
  const daysRemaining = degRemaining / ELONGATION_RATE_DEG_PER_DAY;
  const ghatisRemainingAfterSunrise = daysRemaining * 60; // 1 day = 60 ghatis

  const kshayaDetected =
    typeof prevTithiRawAtSunrise === 'number'
      ? ((tithiRawAtSunrise - prevTithiRawAtSunrise + 30) % 30) >= 2
      : false;

  return {
    tithiRawAtSunrise,
    paksha: elongation < 180 ? 'शुक्ल' : 'कृष्ण',
    tithiNum: tithiRawAtSunrise < 15 ? tithiRawAtSunrise + 1 : tithiRawAtSunrise - 14,
    ghatisRemainingAfterSunrise: Math.round(ghatisRemainingAfterSunrise * 10) / 10,
    shadGhatiValid: ghatisRemainingAfterSunrise >= 6,
    kshayaDetected
  };
}

export interface JainPanchang {
  tithi: string;
  vara: string;
  nakshatra: string;
  paksha: string;
  masa: string;
  jainFestival: string | null;
}

const VARAS = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const TITHI_NAMES = ['', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा/अमावस्या'];
const MASAS = ['चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद', 'आश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन'];

export function getJainPanchang(date: Date): JainPanchang {
  const jde = toJulianDay(
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  );

  const sunLong = getSunLongitude(jde);
  const moonLong = getMoonTropicalLongitude(jde);
  const elongation = normDeg(moonLong - sunLong);
  
  const tithiRaw = Math.floor(elongation / 12);
  const paksha = elongation < 180 ? 'शुक्ल' : 'कृष्ण';
  const tithiNum = tithiRaw < 15 ? tithiRaw + 1 : tithiRaw - 14;
  
  let tithiName = tithiRaw === 29 ? 'अमावस्या' : (tithiRaw === 14 ? 'पूर्णिमा' : TITHI_NAMES[tithiNum]);
  const masaIndex = Math.floor(sunLong / 30); // simplified solar masa mapping to lunar
  const masa = MASAS[masaIndex % 12];

  // Jain Festivals & Vrats
  let jainFestival = null;
  if ((masa === 'चैत्र' || masa === 'आषाढ़' || masa === 'कार्तिक') && paksha === 'शुक्ल' && tithiNum >= 8 && tithiNum <= 15) {
    jainFestival = 'अष्टान्हिका महापर्व (सिद्धचक्र विधान)';
  } else if ((masa === 'चैत्र' || masa === 'भाद्रपद' || masa === 'माघ') && paksha === 'शुक्ल' && tithiNum >= 5 && tithiNum <= 14) {
    jainFestival = 'दशलक्षण महापर्व';
  } else if (paksha === 'शुक्ल' && tithiNum === 11) {
    jainFestival = 'निर्वाण/मोक्ष कल्याणक (अनेक तीर्थंकरों का)';
  }

  // Today's Moon nakshatra from the sidereal longitude (unified Lahiri ayanamsa).
  const todayNakshatra = getNakshatraByDegree(getSiderealLongitude(jde));

  return {
    tithi: `${paksha} ${tithiName}`,
    vara: VARAS[date.getDay()],
    nakshatra: todayNakshatra.hindi_name,
    paksha,
    masa,
    jainFestival
  };
}
