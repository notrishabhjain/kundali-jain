// Jain Panchang Engine
// Calculates Tithi, Masa, Paksha, and Jain specific Vrat/Festivals

import { getNakshatraByDegree } from '../data/nakshatras';

// All solar/lunar position now comes from src/lib/astronomy.ts — a single
// high-precision implementation (full 60-term Meeus ch.47 lunar theory).
// Previously this file carried its own 10-term truncation while
// analysisSynthesizer.ts carried a 16-term one; over 3,000 births they diverged
// by up to 8.8 arcmin, flipping the nakshatra for 0.30% of charts and the pada
// for 1.10%.
export {
  toJulianDay,
  getSunLongitude,
  getMoonTropicalLongitude,
  getLahiriAyanamsa,
  getSunSiderealLongitude,
  getElongation,
  lastNewMoonBefore,
  nextNewMoonAfter,
  sankrantiInInterval,
} from './astronomy';


import {
  getMoonSiderealLongitude,
  getSunLongitude,
  getMoonTropicalLongitude,
  getElongation,
  toJulianDay,
  lastNewMoonBefore,
  nextNewMoonAfter,
  sankrantiInInterval,
  normDeg,
} from './astronomy';

function toRad(deg: number): number { return (deg * Math.PI) / 180; }

/** Sidereal (nirayana) lunar longitude. */
export function getSiderealLongitude(jde: number): number {
  return getMoonSiderealLongitude(jde);
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
  /** half-tithi (GP.2) — Vishti/Bhadra is varjit for new undertakings */
  karanaHindi: string;
  isVishtiKarana: boolean;
  /** numeric tithi within the paksha (1–15) for varjit/siddha lookups */
  tithiNum: number;
  /** weekday index 0=रवि … 6=शनि */
  varaIndex: number;
}

const VARAS = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const TITHI_NAMES = ['', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा/अमावस्या'];
const MASAS = ['चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद', 'आश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन'];

/**
 * Name of the lunar month containing `jde`.
 *
 * Source: GAP_CLOSING_RESEARCH §GS.4. A lunar month is named for the rāśi the
 * Sun ENTERS during that lunation (Sun enters Meṣa → Chaitra). A lunation with
 * NO solar ingress is an adhika (intercalary) month.
 *
 * This replaces a same-day bucket of tropical solar longitude
 * (`Math.floor(sunLong / 30)`), which was wrong twice over: it used the tropical
 * frame where the sidereal one is required, and a lunar month is not a function
 * of the Sun's position on a single day at all. Substituting sidereal longitude
 * alone does NOT fix it — that yields Phālguna where Chaitra is correct.
 *
 * `scheme` selects the month-boundary convention:
 *   purnimanta — month ends at the full moon; a kṛṣṇa pakṣa carries the FOLLOWING
 *                month's name. Standard across North and Central India, which is
 *                where most Digambar Jain panchāngs are published, and the
 *                convention under which Dīpāvalī is "Kārtika Kṛṣṇa Amāvasyā".
 *   amanta     — month ends at the new moon. Used in Deccan/Karnataka Digambar
 *                communities.
 * Against the back-test corpus: purnimanta 9/9, amanta 7/9 (the two differing
 * rows are both Dīpāvalī, exactly where the conventions diverge).
 */
export type MasaScheme = 'purnimanta' | 'amanta';

export function getLunarMonth(
  jde: number,
  scheme: MasaScheme = 'purnimanta'
): { name: string; index: number; isAdhika: boolean } {
  const newMoonStart = lastNewMoonBefore(jde);
  const newMoonEnd = nextNewMoonAfter(newMoonStart);
  const ingress = sankrantiInInterval(newMoonStart, newMoonEnd);

  if (!ingress) {
    // No sankranti in the lunation — adhika masa. Named for the month it
    // precedes, per standard panchang practice.
    const following = sankrantiInInterval(newMoonEnd, nextNewMoonAfter(newMoonEnd));
    const idx = following ? following.rashi : 0;
    return { name: `अधिक ${MASAS[idx]}`, index: idx, isAdhika: true };
  }

  let index = ingress.rashi;
  if (scheme === 'purnimanta' && getElongation(jde) >= 180) {
    index = (index + 1) % 12;
  }
  return { name: MASAS[index], index, isAdhika: false };
}

export function getJainPanchang(date: Date, scheme: MasaScheme = 'purnimanta'): JainPanchang {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const jde = toJulianDay(
    dateStr,
    `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  );

  const elongation = getElongation(jde);

  const tithiRaw = Math.floor(elongation / 12);
  const paksha = elongation < 180 ? 'शुक्ल' : 'कृष्ण';
  const tithiNum = tithiRaw < 15 ? tithiRaw + 1 : tithiRaw - 14;

  let tithiName = tithiRaw === 29 ? 'अमावस्या' : (tithiRaw === 14 ? 'पूर्णिमा' : TITHI_NAMES[tithiNum]);
  const lunarMonth = getLunarMonth(jde, scheme);
  const masa = lunarMonth.name;

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
    jainFestival,
    tithiNum,
    varaIndex: date.getDay(),
    ...(() => {
      const degInto = elongation - tithiRaw * 12;
      const karana = calculateKarana(tithiNum, degInto >= 6);
      return { karanaHindi: karana.hindiName, isVishtiKarana: karana.isVishti };
    })()
  };
}

// ─── Karana (करण) — half-tithi (GP.2) ─────────────────────────────────────────
// Source: GAP_CLOSING_RESEARCH GP.2 — VERIFIED. Each tithi has 2 karanas
// (60 halves/lunar month). 4 Sthira (fixed): Kimstughna opens the month,
// Shakuni / Chatushpada / Naga close it; the remaining 56 halves cycle through
// the 7 Chara karanas. Vishti (= Bhadra) is inauspicious — no new undertakings.
const CHARA_KARANAS = [
  { en: 'Bava', hindi: 'बव' },
  { en: 'Balava', hindi: 'बालव' },
  { en: 'Kaulava', hindi: 'कौलव' },
  { en: 'Taitila', hindi: 'तैतिल' },
  { en: 'Gara', hindi: 'गर' },
  { en: 'Vanija', hindi: 'वणिज' },
  { en: 'Vishti', hindi: 'विष्टि (भद्रा)' }
] as const;

export function calculateKarana(
  tithiValue: number,       // 1–30 within the lunar month
  secondHalf: boolean
): { enName: string; hindiName: string; isVishti: boolean } {
  const halfIndex = (tithiValue - 1) * 2 + (secondHalf ? 1 : 0); // 0–59

  if (halfIndex === 0) return { enName: 'Kimstughna', hindiName: 'किंस्तुघ्न', isVishti: false };
  if (halfIndex === 57) return { enName: 'Shakuni', hindiName: 'शकुनि', isVishti: false };
  if (halfIndex === 58) return { enName: 'Chatushpada', hindiName: 'चतुष्पद', isVishti: false };
  if (halfIndex === 59) return { enName: 'Naga', hindiName: 'नाग', isVishti: false };

  // Halves 1–56 cycle the 7 chara karanas.
  const k = CHARA_KARANAS[(halfIndex - 1) % 7];
  return { enName: k.en, hindiName: k.hindi, isVishti: k.en === 'Vishti' };
}

// ─── Varjit-Kaal matrices — Dagdha / Visha / Hutashan (GP.3) ──────────────────
// Source: GAP_CLOSING_RESEARCH GP.3 (Shatabdi Panchang p.119 + Bharatiya Jyotish).
// Keyed by weekday index 0=रवि..6=शनि → prohibited tithi numbers (1–15 within a
// paksha). All auspicious work is varjit when these pairs coincide.
export const VARJIT_YOGAS: Record<number, { dagdha: number[]; visha: number[]; hutashan: number[] }> = {
  0: { dagdha: [12], visha: [4],      hutashan: [12] },
  1: { dagdha: [11], visha: [6],      hutashan: [6] },
  2: { dagdha: [5],  visha: [7],      hutashan: [7] },
  3: { dagdha: [3],  visha: [2],      hutashan: [8] },
  4: { dagdha: [6],  visha: [8],      hutashan: [9] },
  5: { dagdha: [8],  visha: [9],      hutashan: [10] },
  6: { dagdha: [9],  visha: [7],      hutashan: [11] }
};

export interface VarjitStatus {
  dagdha: boolean;
  visha: boolean;
  hutashan: boolean;
  /** Devanagari summary of all active prohibitions ('' when none) */
  summaryHindi: string;
}

export function getVarjitYogas(varaIndex0SunTo6Sat: number, tithiNum: number): VarjitStatus {
  const row = VARJIT_YOGAS[((varaIndex0SunTo6Sat % 7) + 7) % 7];
  const dagdha = row.dagdha.includes(tithiNum);
  const visha = row.visha.includes(tithiNum);
  const hutashan = row.hutashan.includes(tithiNum);
  const parts: string[] = [];
  if (dagdha) parts.push('दग्ध योग');
  if (visha) parts.push('विष योग');
  if (hutashan) parts.push('हुताशन योग');
  return { dagdha, visha, hutashan, summaryHindi: parts.join(' + ') };
}

// ─── Siddha combos (GP.4) ─────────────────────────────────────────────────────
// Weekday-tithi alignments that guarantee success and bypass minor afflictions.
// Source: GAP_CLOSING_RESEARCH GP.4 (no combos listed for Sunday/Monday).
export const SIDDHA_COMBOS: Record<number, number[]> = {
  2: [3, 8, 13],   // मंगलवार
  3: [2, 7, 12],   // बुधवार
  4: [5, 10, 15],  // गुरुवार
  5: [1, 6, 11],   // शुक्रवार
  6: [4, 9, 14]    // शनिवार
};

export function isSiddhaCombo(varaIndex0SunTo6Sat: number, tithiNum: number): boolean {
  const list = SIDDHA_COMBOS[((varaIndex0SunTo6Sat % 7) + 7) % 7];
  return Array.isArray(list) && list.includes(tithiNum);
}

// ─── Amavasya types — Sinivali / Darsha / Kuhu (GP.5) ─────────────────────────
// Source: GAP_CLOSING_RESEARCH GP.5.
//   Sinivali: amavasya prevails continuously from sunrise through the night.
//   Darsha:   amavasya contaminated (viddha) by Chaturdashi overlap at sunrise.
//   Kuhu:     amavasya joined with the upcoming Shukla Pratipada before day end.
export type AmavasyaType = 'sinivali' | 'darsha' | 'kuhu';

export function classifyAmavasya(elongAtSunriseDeg: number, elongAtSunsetDeg: number): AmavasyaType | null {
  const rawAtRise = Math.floor((normDeg(elongAtSunriseDeg) % 360) / 12);
  const rawAtSet = Math.floor((normDeg(elongAtSunsetDeg) % 360) / 12);
  const amavasyaAtRise = rawAtRise === 29;
  const amavasyaAtSet = rawAtSet === 29;

  if (amavasyaAtRise && amavasyaAtSet) return 'sinivali';
  if (!amavasyaAtRise && amavasyaAtSet) return 'darsha';   // began midday after chaturdashi morning
  if (amavasyaAtRise && !amavasyaAtSet) return 'kuhu';     // pratipada begins before sunset
  return null;                                             // no amavasya portion that day
}

// ─── Panchak status (GP.6) ────────────────────────────────────────────────────
// Sources: GAP_CLOSING_RESEARCH GP.6 + blueprint §A.5.C (latest supersedes).
// Blueprint fixes the Panchak zone at 296°40' → 360° sidereal (end of Dhanishtha's
// opening quarter through Revati). Prohibits construction, wood-gathering,
// bed-making, southern travel, and starting new fasts; death in this window
// requires the special Panchak cremation rites.
export const PANCHAK_ZONE_START_DEG = 296 + 40 / 60; // 296°40' ≈ 296.667

export interface PanchakStatus {
  inPanchak: boolean;
  noteHindi: string;
}

export function getPanchakStatus(siderealDeg: number): PanchakStatus {
  const d = normDeg(siderealDeg);
  // Zone spans the 296.667° → 360° arc with no wrap risk.
  const inPanchak = d >= PANCHAK_ZONE_START_DEG;
  return {
    inPanchak,
    noteHindi: inPanchak
      ? 'पंचक चल रहा है — निर्माण, लकड़ी-संग्रह, शय्या-निर्माण, नया व्रत और दक्षिण-यात्रा परिहार्य।'
      : ''
  };
}

/** Blueprint-compatible alias for calculateKarana (B.2 naming). */
export function calculateJainKarana(
  tithiValue: number,
  secondHalf = false
): { karanaName: string; isVishti: boolean } {
  const r = calculateKarana(tithiValue, secondHalf);
  return { karanaName: r.enName, isVishti: r.isVishti };
}

// ─── Saptashalaka Vedha grid (v3 §3A) ─────────────────────────────────────────
// 14 opposition lines covering all 28 nakshatras. A planet transiting either end
// pierces the other. Malefic → full nakshatra veddha for its entire transit;
// benefic → only the mirrored quarter is pierced (Q1→Q4, Q2→Q3, Q3→Q2, Q4→Q1).
export const SAPTASHALAKA_VEDHA_PAIRS: [string, string][] = [
  ['Krittika', 'Shravana'],
  ['Rohini', 'Abhijit'],
  ['Mrigashira', 'Uttara Ashadha'],
  ['Ardra', 'Purva Ashadha'],
  ['Punarvasu', 'Mula'],
  ['Pushya', 'Jyeshtha'],
  ['Ashlesha', 'Anuradha'],
  ['Magha', 'Vishakha'],
  ['Purva Phalguni', 'Swati'],
  ['Uttara Phalguni', 'Chitra'],
  ['Hasta', 'Uttara Bhadrapada'],
  ['Bharani', 'Dhanishtha'],
  ['Ashvini', 'Shatabhisha'],
  ['Revati', 'Purva Bhadrapada']
];

export interface VedhaStatus {
  veddhaNakshatra: string;
  /** true = whole star blocked (malefic transit); false = single quarter pierced */
  fullVeddha: boolean;
  piercedQuarter?: 1 | 2 | 3 | 4;
}

/**
 * Vedha triggered ON `natalNakshatraName` by a planet currently transiting
 * `transitNakshatraName`.
 */
export function getSaptashalakaVedha(
  natalNakshatraName: string,
  transitNakshatraName: string,
  isMalefic: boolean,
  transitQuarter?: 1 | 2 | 3 | 4
): VedhaStatus | null {
  const pair = SAPTASHALAKA_VEDHA_PAIRS.find(
    ([a, b]) =>
      (a === transitNakshatraName && b === natalNakshatraName) ||
      (b === transitNakshatraName && a === natalNakshatraName)
  );
  if (!pair) return null;
  const opposite = pair[0] === transitNakshatraName ? pair[1] : pair[0];
  if (isMalefic) {
    return { veddhaNakshatra: opposite, fullVeddha: true };
  }
  // Benefic: quarter-piercing only — Q1→Q4, Q2→Q3, Q3→Q2, Q4→Q1.
  const q = transitQuarter ?? 1;
  const pierced = (5 - q) as 1 | 2 | 3 | 4;
  return { veddhaNakshatra: opposite, fullVeddha: false, piercedQuarter: pierced };
}

// ─── Baan Dosha triggers (v3 §3B) ─────────────────────────────────────────────
// Reference frame: Sun's degree WITHIN its current sign (`sunLong % 30`),
// matched on the integer degree.
export interface BaanRule {
  key: string;
  hindiName: string;
  degrees: number[];
  excludesHindi: string;
}

export const BAAN_RULES: BaanRule[] = [
  { key: 'mrityu', hindiName: 'मृत्यु बाण', degrees: [1, 10, 19, 28], excludesHindi: 'विवाह' },
  { key: 'agni',   hindiName: 'अग्नि बाण', degrees: [2, 11, 20, 29], excludesHindi: 'गृह-निर्माण / गृह-प्रवेश' },
  { key: 'nrip',   hindiName: 'नृप बाण',   degrees: [4, 13, 22],     excludesHindi: 'व्यवसाय/नौकरी प्रारंभ' },
  { key: 'chor',   hindiName: 'चौर बाण',   degrees: [6, 15, 24],     excludesHindi: 'दीर्घ यात्रा' },
  { key: 'rog',    hindiName: 'रोग बाण',   degrees: [8, 17, 26],     excludesHindi: 'व्रत-आरंभ / यज्ञोपवीत' }
];

export function getActiveBaanDoshas(sunLongitudeDeg: number): BaanRule[] {
  const degInSign = ((sunLongitudeDeg % 30) + 30) % 30;
  const intDeg = Math.floor(degInSign);
  if (intDeg < 1) return [];
  return BAAN_RULES.filter(r => r.degrees.includes(intDeg));
}

// ─── Patadosha / Bhujangpat (v3 §3C) ──────────────────────────────────────────
// Active when (Sun + Moon) mod 360 falls in the Shool (9th) yoga window:
// [106°40′, 120°]. Blocks marriages.
export function isPatadoshaActive(sunLongDeg: number, moonLongDeg: number): boolean {
  const sum = normDeg(sunLongDeg + moonLongDeg);
  return sum >= 106 + 40 / 60 && sum <= 120;
}

// ─── Yuti Dosha (M2 extraction + v2 §GP.11) ───────────────────────────────────
// Moon sharing a nakshatra with a malefic afflicts muhurtas. The web engine
// computes only Sun & Moon natively; pass any additional graha longitudes via
// `grahaLongitudes` when available (Rahu/Ketu pending node engine).
const YUTI_MALEFICS = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'] as const;

export function getYutiDosha(
  moonSiderealDeg: number,
  grahaLongitudes: Record<string, number> = {}
): { active: boolean; withGraha?: string } {
  const moonIdx = Math.floor(normDeg(moonSiderealDeg) / 13.333333);
  for (const g of YUTI_MALEFICS) {
    const lon = grahaLongitudes[g];
    if (typeof lon !== 'number') continue;
    if (Math.floor(normDeg(lon) / 13.333333) === moonIdx) {
      return { active: true, withGraha: g };
    }
  }
  // Moon conjunct Sun (same sign-degree proximity) is covered by Amavasya logic;
  // without external ephemerides we cannot extend further — documented limit.
  return { active: false };
}

// ─── 5-Year Yuga solstice table (Surya Prajnapti; final arbitration) ─────────
// Progression advances exactly +6 tithis per solstice, alternating Shravana
// (Summer/Dakshinayana-start) and Magha (Winter/Uttarayana-start).
export interface YugaSolsticeEntry {
  index: number;          // 1–10
  yugaYear: number;
  type: 'Summer' | 'Winter';
  typeHindi: string;
  monthHindi: string;
  tithiHindi: string;
  nakshatra: string;
}

export const YUGA_SOLSTICE_TABLE: YugaSolsticeEntry[] = [
  { index: 1,  yugaYear: 1, type: 'Summer', typeHindi: 'ग्रीष्म अयन', monthHindi: 'श्रावण', tithiHindi: 'कृष्ण प्रतिपदा', nakshatra: 'Abhijit' },
  { index: 2,  yugaYear: 1, type: 'Winter', typeHindi: 'शीत अयन', monthHindi: 'माघ',   tithiHindi: 'कृष्ण सप्तमी',   nakshatra: 'Hasta' },
  { index: 3,  yugaYear: 2, type: 'Summer', typeHindi: 'ग्रीष्म अयन', monthHindi: 'श्रावण', tithiHindi: 'कृष्ण त्रयोदशी', nakshatra: 'Mrigashira' },
  { index: 4,  yugaYear: 2, type: 'Winter', typeHindi: 'शीत अयन', monthHindi: 'माघ',   tithiHindi: 'शुक्ल चतुर्थी',  nakshatra: 'Shatabhisha' },
  { index: 5,  yugaYear: 3, type: 'Summer', typeHindi: 'ग्रीष्म अयन', monthHindi: 'श्रावण', tithiHindi: 'शुक्ल दशमी',    nakshatra: 'Vishakha' },
  { index: 6,  yugaYear: 3, type: 'Winter', typeHindi: 'शीत अयन', monthHindi: 'माघ',   tithiHindi: 'कृष्ण प्रतिपदा', nakshatra: 'Mula' },
  { index: 7,  yugaYear: 4, type: 'Summer', typeHindi: 'ग्रीष्म अयन', monthHindi: 'श्रावण', tithiHindi: 'कृष्ण सप्तमी',   nakshatra: 'Pushya' },
  { index: 8,  yugaYear: 4, type: 'Winter', typeHindi: 'शीत अयन', monthHindi: 'माघ',   tithiHindi: 'कृष्ण त्रयोदशी', nakshatra: 'Purva Phalguni' },
  { index: 9,  yugaYear: 5, type: 'Summer', typeHindi: 'ग्रीष्म अयन', monthHindi: 'श्रावण', tithiHindi: 'शुक्ल चतुर्थी',  nakshatra: 'Revati' },
  { index: 10, yugaYear: 5, type: 'Winter', typeHindi: 'शीत अयन', monthHindi: 'माघ',   tithiHindi: 'शुक्ल दशमी',    nakshatra: 'Rohini' }
];

// ─── Nakshatrodaya derivation (Bharatiya Jyotish p.69) ───────────────────────
// Nakshatrodayas = Civil days + Solar years = 1830 + 5 = 1835 risings per yuga.
export const NAKSHATRODAYA = {
  civilDaysPerYuga: 1830,
  solarYearsPerYuga: 5,
  totalStarRisings: 1835
} as const;
