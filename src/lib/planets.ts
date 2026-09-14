// Nine grahas and the lagna — sidereal positions.
//
// ─── Doctrinal standing of this file ─────────────────────────────────────────
// CLAUDE.md G2-C1 forbids mixing Vedic material into this engine. Computing
// where a planet was is not a Vedic act — it is astronomy, and Jain cosmology
// has its own long tradition of it (Surya Prajnapti, Chandra Prajnapti,
// Tiloyapannatti ch. 7, Ganita Sara Sangraha). What G2-C1 rules out is the
// interpretive apparatus: Vedic deities, planetary "ownership" of signs as
// causal agency, aspects, yogas and remedial gemstones.
//
// So this module computes positions and stops there. The Jain frame the
// positions are read in is the one already stated at the head of grahas.ts:
// the grahas are Jyotishi Devs, and they are NIMITTA — indicative, never
// causal. A graha does not cause a karma; it marks one already bound. Every
// surface that renders these numbers repeats that, and none of them turns a
// position into a prediction.
// Source: TLP-1 ch. 7 (Jyotishka order); CLAUDE.md rule 1; decision of 2026-09-14
// admitting lagna/bhava machinery by explicit choice.
//
// ─── Accuracy, stated rather than implied ────────────────────────────────────
// Planetary longitudes come from the Standish Keplerian elements with secular
// rates (JPL, "Approximate Positions of the Planets"), valid 1800-2050. The
// published maximum longitude errors over that span are:
//
//   Mercury 15"   Venus 21"   Mars 25"   Jupiter 100"   Saturn 200"
//
// 200" is 3.3 arcmin. That is comfortably inside a rashi (30 deg) and a
// nakshatra (13 deg 20'), and inside a pada (3 deg 20') except within a few
// arcmin of a pada boundary. checkPadaConfidence() below flags exactly that
// case rather than letting the reading assert a pada it cannot support.
//
// The Sun and Moon do NOT use this theory — they keep the full Meeus series
// already in astronomy.ts, which is an order of magnitude better.

import {
  normDeg, toJulianDay, julianCentury, getLahiriAyanamsa,
  getSunSiderealLongitude, getMoonSiderealLongitude,
} from './astronomy';

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

export type GrahaKey = 'Surya' | 'Chandra' | 'Mangal' | 'Budha' | 'Guru' | 'Shukra' | 'Shani' | 'Rahu' | 'Ketu';

/** Standish elements at J2000 and their per-century rates. */
interface KeplerElements {
  a: number; e: number; I: number; L: number; peri: number; node: number;
  aDot: number; eDot: number; IDot: number; LDot: number; periDot: number; nodeDot: number;
}

// Source: E.M. Standish, JPL — "Keplerian Elements for Approximate Positions of
// the Major Planets", table 1 (1800 AD – 2050 AD).
const ELEMENTS: Record<string, KeplerElements> = {
  Mercury: { a: 0.38709927, e: 0.20563593, I: 7.00497902, L: 252.25032350, peri: 77.45779628, node: 48.33076593,
             aDot: 0.00000037, eDot: 0.00001906, IDot: -0.00594749, LDot: 149472.67411175, periDot: 0.16047689, nodeDot: -0.12534081 },
  Venus:   { a: 0.72333566, e: 0.00677672, I: 3.39467605, L: 181.97909950, peri: 131.60246718, node: 76.67984255,
             aDot: 0.00000390, eDot: -0.00004107, IDot: -0.00078890, LDot: 58517.81538729, periDot: 0.00268329, nodeDot: -0.27769418 },
  Earth:   { a: 1.00000261, e: 0.01671123, I: -0.00001531, L: 100.46457166, peri: 102.93768193, node: 0.0,
             aDot: 0.00000562, eDot: -0.00004392, IDot: -0.01294668, LDot: 35999.37244981, periDot: 0.32327364, nodeDot: 0.0 },
  Mars:    { a: 1.52371034, e: 0.09339410, I: 1.84969142, L: -4.55343205, peri: -23.94362959, node: 49.55953891,
             aDot: 0.00001847, eDot: 0.00007882, IDot: -0.00813131, LDot: 19140.30268499, periDot: 0.44441088, nodeDot: -0.29257343 },
  Jupiter: { a: 5.20288700, e: 0.04838624, I: 1.30439695, L: 34.39644051, peri: 14.72847983, node: 100.47390909,
             aDot: -0.00011607, eDot: -0.00013253, IDot: -0.00183714, LDot: 3034.74612775, periDot: 0.21252668, nodeDot: 0.20469106 },
  Saturn:  { a: 9.53667594, e: 0.05386179, I: 2.48599187, L: 49.95424423, peri: 92.59887831, node: 113.66242448,
             aDot: -0.00125060, eDot: -0.00050991, IDot: 0.00193609, LDot: 1222.49362201, periDot: -0.41897216, nodeDot: -0.28867794 },
};

/** Published maximum longitude error, arcseconds, over 1800-2050 (Standish table 2). */
const MAX_ERROR_ARCSEC: Record<string, number> = {
  Mercury: 15, Venus: 21, Mars: 25, Jupiter: 100, Saturn: 200,
};

/** Heliocentric rectangular ecliptic coordinates (J2000), AU. */
function heliocentricJ2000(name: string, T: number): { x: number; y: number; z: number } {
  const el = ELEMENTS[name];
  const a = el.a + el.aDot * T;
  const e = el.e + el.eDot * T;
  const I = el.I + el.IDot * T;
  const L = el.L + el.LDot * T;
  const peri = el.peri + el.periDot * T;
  const node = el.node + el.nodeDot * T;

  const omega = peri - node;                 // argument of perihelion
  let M = L - peri;                          // mean anomaly
  M = ((M % 360) + 540) % 360 - 180;         // wrap to [-180, 180)

  // Kepler's equation, Newton-Raphson. e is small for every body here, so this
  // converges in a handful of iterations; the cap only guards pathological input.
  const eStar = toDeg(e);
  let E = M + eStar * Math.sin(toRad(M));
  for (let i = 0; i < 40; i++) {
    const dM = M - (E - eStar * Math.sin(toRad(E)));
    const dE = dM / (1 - e * Math.cos(toRad(E)));
    E += dE;
    if (Math.abs(dE) < 1e-9) break;
  }

  // Position in the orbital plane.
  const xp = a * (Math.cos(toRad(E)) - e);
  const yp = a * Math.sqrt(1 - e * e) * Math.sin(toRad(E));

  const cw = Math.cos(toRad(omega)), sw = Math.sin(toRad(omega));
  const cO = Math.cos(toRad(node)), sO = Math.sin(toRad(node));
  const cI = Math.cos(toRad(I)), sI = Math.sin(toRad(I));

  return {
    x: (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
    y: (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp,
    z: (sw * sI) * xp + (cw * sI) * yp,
  };
}

/**
 * General precession in ecliptic longitude from J2000 to the date, degrees.
 *
 * The Standish elements are referred to the J2000 ecliptic and equinox, but
 * Lahiri ayanamsa is measured from the equinox OF DATE. Without this term the
 * two are mismatched by about 1.4 degrees per century — enough to put a planet
 * in the wrong nakshatra for births far from 2000.
 * Source: Meeus, Astronomical Algorithms ch. 21 (p_A).
 */
function precessionFromJ2000(T: number): number {
  return (5029.0966 * T + 1.11113 * T * T - 0.000006 * T * T * T) / 3600;
}

/** Geocentric apparent ecliptic longitude of date, degrees (tropical). */
function geocentricLongitude(name: string, jde: number): number {
  const T = julianCentury(jde);
  const p = heliocentricJ2000(name, T);
  const earth = heliocentricJ2000('Earth', T);
  const x = p.x - earth.x;
  const y = p.y - earth.y;
  return normDeg(toDeg(Math.atan2(y, x)) + precessionFromJ2000(T));
}

/**
 * Mean ascending lunar node — Rahu. Ketu is taken 180 degrees opposite.
 * Already referred to the equinox of date, so no precession term is added.
 * Source: Meeus ch. 47 (Omega).
 */
export function getRahuLongitude(jde: number): number {
  const T = julianCentury(jde);
  return normDeg(125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000);
}

export interface GrahaPosition {
  key: GrahaKey;
  /** Sidereal (nirayana) ecliptic longitude, degrees. */
  siderealLongitude: number;
  /** 0-11, Mesha = 0. */
  rashiIndex: number;
  /** 0-26, Ashvini = 0. */
  nakshatraIndex: number;
  /** 1-4. */
  pada: number;
  /** Degrees elapsed within the rashi. */
  degreeInRashi: number;
  /** True when longitude is decreasing — vakri. Computed, not doctrinal. */
  retrograde: boolean;
  /** Published maximum error for this body, arcseconds. 0 for Sun/Moon/nodes. */
  maxErrorArcsec: number;
  /**
   * False when the body sits close enough to a pada boundary that its own error
   * bar spans the boundary. The reading must not assert a pada in that case.
   */
  padaConfident: boolean;
}

const NAKSHATRA_SPAN = 360 / 27;
const PADA_SPAN = NAKSHATRA_SPAN / 4;

function describe(key: GrahaKey, sidereal: number, retrograde: boolean, maxErrorArcsec: number): GrahaPosition {
  const lon = normDeg(sidereal);
  const nakIndex = Math.min(26, Math.floor(lon / NAKSHATRA_SPAN));
  const withinNak = lon - nakIndex * NAKSHATRA_SPAN;
  const pada = Math.min(4, Math.floor(withinNak / PADA_SPAN) + 1);

  // Distance to the nearer edge of the current pada, in arcseconds.
  const intoPada = withinNak - (pada - 1) * PADA_SPAN;
  const edgeDistArcsec = Math.min(intoPada, PADA_SPAN - intoPada) * 3600;

  return {
    key,
    siderealLongitude: lon,
    rashiIndex: Math.floor(lon / 30),
    nakshatraIndex: nakIndex,
    pada,
    degreeInRashi: lon % 30,
    retrograde,
    maxErrorArcsec,
    padaConfident: edgeDistArcsec > maxErrorArcsec,
  };
}

/** All nine grahas for an instant, sidereal. */
export function getAllGrahaPositions(jde: number): GrahaPosition[] {
  const ayan = getLahiriAyanamsa(jde);
  const dt = 1; // one day, for the retrograde test

  const planet = (name: string, key: GrahaKey): GrahaPosition => {
    const now = normDeg(geocentricLongitude(name, jde) - ayan);
    const next = normDeg(geocentricLongitude(name, jde + dt) - getLahiriAyanamsa(jde + dt));
    // Signed difference across the 0/360 wrap.
    const delta = ((next - now + 540) % 360) - 180;
    return describe(key, now, delta < 0, MAX_ERROR_ARCSEC[name]);
  };

  const rahu = normDeg(getRahuLongitude(jde) - ayan);

  return [
    describe('Surya', getSunSiderealLongitude(jde), false, 0),
    describe('Chandra', getMoonSiderealLongitude(jde), false, 0),
    planet('Mars', 'Mangal'),
    planet('Mercury', 'Budha'),
    planet('Jupiter', 'Guru'),
    planet('Venus', 'Shukra'),
    planet('Saturn', 'Shani'),
    // The nodes are always retrograde in mean motion. That is a statement about
    // the node's own motion, not an omen.
    describe('Rahu', rahu, true, 0),
    describe('Ketu', normDeg(rahu + 180), true, 0),
  ];
}

// ─── Lagna (ascendant) and whole-sign bhavas ─────────────────────────────────

/** Mean obliquity of the ecliptic, degrees. Source: Meeus ch. 22 (22.2). */
function meanObliquity(T: number): number {
  return 23.439291111 - 0.0130041667 * T - 1.638889e-7 * T * T + 5.036111e-7 * T * T * T;
}

/** Greenwich mean sidereal time in degrees. Source: Meeus ch. 12 (12.4). */
function gmstDegrees(jd: number): number {
  const T = julianCentury(jd);
  return normDeg(
    280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000
  );
}

/**
 * Sidereal ascendant, degrees.
 *
 * Asc = atan2( cos(RAMC), -(sin(RAMC)·cos(eps) + tan(phi)·sin(eps)) )
 *
 * Latitude is clamped just short of the poles: tan(phi) diverges at +/-90 and
 * above the polar circles the ascendant is not defined for part of the year.
 * Clamping keeps a birth at extreme latitude from producing NaN and silently
 * poisoning every downstream house.
 */
export function getLagna(jde: number, latDeg: number, lonDegEast: number): number {
  const T = julianCentury(jde);
  const eps = meanObliquity(T);
  const lst = normDeg(gmstDegrees(jde) + lonDegEast);
  const phi = Math.max(-89.5, Math.min(89.5, latDeg));

  const y = Math.cos(toRad(lst));
  const x = -(Math.sin(toRad(lst)) * Math.cos(toRad(eps)) + Math.tan(toRad(phi)) * Math.sin(toRad(eps)));
  const tropical = normDeg(toDeg(Math.atan2(y, x)));
  return normDeg(tropical - getLahiriAyanamsa(jde));
}

export interface BhavaChart {
  /** Sidereal ascendant longitude, degrees. */
  lagnaLongitude: number;
  /** 0-11. */
  lagnaRashiIndex: number;
  lagnaNakshatraIndex: number;
  lagnaPada: number;
  /** houses[i] is the rashi index occupying bhava i+1. Whole-sign. */
  houses: number[];
  /** Which bhava (1-12) each graha falls in. */
  grahaBhava: Record<string, number>;
}

/**
 * Whole-sign bhavas: the lagna's whole rashi is the first bhava, and each
 * following rashi is the next. Chosen over quadrant systems (Placidus, Sripati)
 * because it needs no further interpretive commitment and degenerates
 * gracefully at high latitudes, where quadrant houses become unstable or
 * undefined.
 */
export function buildBhavaChart(
  jde: number, latDeg: number, lonDegEast: number, grahas: GrahaPosition[]
): BhavaChart {
  const lagna = getLagna(jde, latDeg, lonDegEast);
  const lagnaRashi = Math.floor(lagna / 30);
  const houses = Array.from({ length: 12 }, (_, i) => (lagnaRashi + i) % 12);

  const grahaBhava: Record<string, number> = {};
  for (const g of grahas) {
    grahaBhava[g.key] = ((g.rashiIndex - lagnaRashi + 12) % 12) + 1;
  }

  const nakIndex = Math.min(26, Math.floor(lagna / NAKSHATRA_SPAN));
  return {
    lagnaLongitude: lagna,
    lagnaRashiIndex: lagnaRashi,
    lagnaNakshatraIndex: nakIndex,
    lagnaPada: Math.min(4, Math.floor((lagna - nakIndex * NAKSHATRA_SPAN) / PADA_SPAN) + 1),
    houses,
    grahaBhava,
  };
}

export interface GrahaChart {
  grahas: GrahaPosition[];
  bhava: BhavaChart;
  jde: number;
}

/** Whole chart from birth data. Latitude/longitude in degrees, east positive. */
export function computeGrahaChart(
  dob: string, time: string, latDeg: number, lonDegEast: number
): GrahaChart {
  const jde = toJulianDay(dob, time || '12:00');
  const grahas = getAllGrahaPositions(jde);
  return { grahas, bhava: buildBhavaChart(jde, latDeg, lonDegEast, grahas), jde };
}
