// High-precision astronomy — the single source of truth for solar and lunar
// position in this engine.
//
// WHY THIS MODULE EXISTS
// Two divergent implementations previously existed (calendarEngine.ts with 10
// lunar terms, analysisSynthesizer.ts with 16). Measured over 3,000 births they
// disagreed by up to 8.8 arcmin, which flipped the nakshatra for 0.30% of charts
// and the pada for 1.10%. Since nakshatra determines tirthankar affinity and the
// dasha starting lord, the same birth could read differently on two tabs. Both
// call sites now delegate here.
//
// PRECISION
// Lunar longitude uses the full 60-term truncation of ELP-2000/82 given in
// Meeus, Astronomical Algorithms 2nd ed., Table 47.A, including the eccentricity
// correction E for solar-anomaly terms and the A1/A2/A3 additive terms. Stated
// accuracy ~10 arcsec in longitude, against ~0.5° for a 10-term truncation.
// That matters here: a pada spans 3°20' = 200 arcmin, so a 0.5° (30 arcmin)
// error is 15% of a pada and misclassifies births near boundaries.
//
// CONVENTIONS
// - All longitudes are APPARENT (nutation and, for the Sun, aberration applied),
//   because the Lahiri ayanamsa is defined against apparent positions.
// - Sidereal (nirayana) = apparent tropical − Lahiri ayanamsa.
// - Julian Day arguments are JDE (TT). The offset from UT is under 1.5 min for
//   the 1950–2050 range this app targets and is neglected.

const RAD = Math.PI / 180;
const toRad = (d: number) => d * RAD;
export const normDeg = (d: number) => ((d % 360) + 360) % 360;

/** Julian Day from an IST (UTC+5:30) civil date and time. */
export function toJulianDay(dateStr: string, timeStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hh, mm] = (timeStr || '00:00').split(':').map(Number);
  return julianDayFromUTC(year, month, day, hh + mm / 60 - 5.5);
}

/** Julian Day from a UTC calendar date and fractional hour. */
export function julianDayFromUTC(
  year: number,
  month: number,
  day: number,
  utcHour: number
): number {
  let Y = year;
  let M = month;
  // Carry a negative or >24 hour offset into the day number.
  let d = day + utcHour / 24;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5;
}

const julianCentury = (jde: number) => (jde - 2451545.0) / 36525;

// ── Nutation in longitude (Meeus ch. 22, principal terms) ───────────────────
// Δψ to about 0.5 arcsec, which is far below our lunar-theory error floor.
export function nutationInLongitude(jde: number): number {
  const T = julianCentury(jde);
  const omega = 125.04452 - 1934.136261 * T;
  const Ls = 280.4665 + 36000.7698 * T;
  const Lm = 218.3165 + 481267.8813 * T;
  const arcsec =
    -17.2 * Math.sin(toRad(omega)) -
    1.32 * Math.sin(toRad(2 * Ls)) -
    0.23 * Math.sin(toRad(2 * Lm)) +
    0.21 * Math.sin(toRad(2 * omega));
  return arcsec / 3600;
}

// ── Solar longitude (Meeus ch. 25) ──────────────────────────────────────────
/** Apparent geocentric solar longitude, degrees. */
export function getSunLongitude(jde: number): number {
  const T = julianCentury(jde);
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = normDeg(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(toRad(M)) +
    (0.019993 - 0.000101 * T) * Math.sin(toRad(2 * M)) +
    0.000289 * Math.sin(toRad(3 * M));
  const trueLong = L0 + C;
  // Apparent = true − aberration − nutation, via Meeus (25.10).
  const omega = 125.04 - 1934.136 * T;
  return normDeg(trueLong - 0.00569 - 0.00478 * Math.sin(toRad(omega)));
}

// ── Lunar longitude (Meeus ch. 47, Table 47.A — all 60 terms) ───────────────
// Columns: D, M, M', F, coefficient for Σl (units of 1e-6 degree).
const LUNAR_TERMS: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314],
  [0, 0, 2, 0, 213618], [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332],
  [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066], [2, 0, 1, 0, 53322],
  [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528],
  [0, 0, 1, -2, 10980], [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034],
  [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888], [2, 1, 0, 0, -6766],
  [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665],
  [0, 1, -2, 0, -2689], [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390],
  [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236], [0, 1, 2, 0, -2120],
  [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048], [2, 0, 1, -2, -1773],
  [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110],
  [3, 0, -1, 0, -892], [2, 1, 1, 0, -810], [4, -1, -2, 0, 759],
  [0, 2, -1, 0, -713], [2, 2, -1, 0, -700], [2, 1, -2, 0, 691],
  [2, -1, 0, -2, 596], [4, 0, 1, 0, 549], [0, 0, 4, 0, 537],
  [4, -1, 0, 0, 520], [1, 0, -2, 0, -487], [2, 1, 0, -2, -399],
  [0, 0, 2, -2, -381], [1, 1, 1, 0, 351], [3, 0, -2, 0, -340],
  [4, 0, -3, 0, 330], [2, -1, 2, 0, 327], [0, 2, 1, 0, -323],
  [1, 1, -1, 0, 299], [2, 0, 3, 0, 294], [2, 0, -1, -2, 0],
];

/** Apparent geocentric lunar longitude, degrees. Meeus ch. 47. */
export function getMoonTropicalLongitude(jde: number): number {
  const T = julianCentury(jde);
  const T2 = T * T, T3 = T2 * T, T4 = T3 * T;

  // Moon's mean longitude
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000;
  // Mean elongation
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000;
  // Sun's mean anomaly
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000;
  // Moon's mean anomaly
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000;
  // Argument of latitude
  const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000;

  const A1 = 119.75 + 131.849 * T;
  const A2 = 53.09 + 479264.29 * T;
  // Eccentricity correction for terms involving the Sun's anomaly (Meeus 47.6)
  const E = 1 - 0.002516 * T - 0.0000074 * T2;

  let sigmaL = 0;
  for (const [cD, cM, cMp, cF, coeff] of LUNAR_TERMS) {
    if (coeff === 0) continue;
    const arg = cD * D + cM * M + cMp * Mp + cF * F;
    let term = coeff * Math.sin(toRad(arg));
    // E applies once per power of M present in the argument.
    const absM = Math.abs(cM);
    if (absM === 1) term *= E;
    else if (absM === 2) term *= E * E;
    sigmaL += term;
  }

  // Additive terms from Venus, Jupiter, and the flattening of the Earth.
  sigmaL += 3958 * Math.sin(toRad(A1));
  sigmaL += 1962 * Math.sin(toRad(Lp - F));
  sigmaL += 318 * Math.sin(toRad(A2));

  return normDeg(Lp + sigmaL / 1000000 + nutationInLongitude(jde));
}

// ── Ayanamsa ────────────────────────────────────────────────────────────────
// Lahiri (Chitra Paksha). Source: PARITY-REPORT-2026 §"Linear Ayanamsa versus
// Lahiri Formulation".
export function getLahiriAyanamsa(jde: number): number {
  const T = julianCentury(jde);
  return (
    (23 * 3600 + 51 * 60 + 25.532 + 5029.0966 * T + 1.11161 * T * T - 0.000113 * T * T * T) / 3600
  );
}

/** Sidereal (nirayana) lunar longitude — the engine's primary coordinate. */
export function getMoonSiderealLongitude(jde: number): number {
  return normDeg(getMoonTropicalLongitude(jde) - getLahiriAyanamsa(jde));
}

/** Sidereal (nirayana) solar longitude. */
export function getSunSiderealLongitude(jde: number): number {
  return normDeg(getSunLongitude(jde) - getLahiriAyanamsa(jde));
}

/** Moon − Sun elongation in [0,360). Drives tithi and paksha. */
export function getElongation(jde: number): number {
  return normDeg(getMoonTropicalLongitude(jde) - getSunLongitude(jde));
}

// ── Event solvers ───────────────────────────────────────────────────────────
// Panchang needs instants, not just positions: the lunar month is defined by
// conjunctions, and its NAME by a solar ingress. Both are found by bisection on
// a continuous angle difference, which is robust and needs no series inversion.

const SYNODIC_MONTH = 29.530588853;

/** Signed difference a−b wrapped to (−180, 180]. */
function angleDiff(a: number, b: number): number {
  let d = (a - b) % 360;
  if (d > 180) d -= 360;
  if (d <= -180) d += 360;
  return d;
}

// g(t) is the signed elongation about conjunction: small negative just before a
// new moon, small positive just after. Bisecting its sign change is stable, and
// unlike a raw 360→0 wrap it has no discontinuity at the root.
const conjunctionResidual = (t: number) => angleDiff(getElongation(t), 0);

/** Refine a conjunction known to lie within ±`half` days of `guess`. */
function refineConjunction(guess: number, half = 2): number {
  let lo = guess - half;
  let hi = guess + half;
  // The bracket must satisfy g(lo) < 0 < g(hi); nudge it if the guess is off.
  let guard = 0;
  while (conjunctionResidual(lo) > 0 && guard++ < 12) lo -= 0.5;
  guard = 0;
  while (conjunctionResidual(hi) < 0 && guard++ < 12) hi += 0.5;
  if (!(conjunctionResidual(lo) < 0 && conjunctionResidual(hi) > 0)) return guess;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (conjunctionResidual(mid) < 0) lo = mid;
    else hi = mid;
    if (hi - lo < 1e-6) break;
  }
  return (lo + hi) / 2;
}

/**
 * Instant of the last lunar conjunction (new moon) at or before `jde`.
 *
 * The elongation at `jde` says directly how far into the lunation we are, which
 * gives a first estimate good to a few hours; bisection then refines it to well
 * under a second. An earlier bracket-walking implementation returned the
 * PREVIOUS lunation for dates late in a lunar month, which named 4 of 9
 * back-test months one month behind.
 */
export function lastNewMoonBefore(jde: number): number {
  const elapsedFraction = getElongation(jde) / 360;
  const estimate = jde - elapsedFraction * SYNODIC_MONTH;
  let t = refineConjunction(estimate);
  // Guarantee the result is not after `jde` (possible when jde sits within
  // minutes of a conjunction).
  if (t > jde) t = refineConjunction(t - SYNODIC_MONTH);
  return t;
}

/**
 * Instant of the next lunar conjunction strictly after `jde`.
 *
 * Estimated from the elongation REMAINING in the current lunation rather than by
 * round-tripping through lastNewMoonBefore. That round trip was unstable when
 * `jde` was itself a conjunction: elongation there reads either ~0.001° or
 * ~359.999°, and in the latter case the estimate fell back a whole lunation, so
 * the "next" new moon came out equal to the input and every lunar month looked
 * empty of a sankranti (i.e. intercalary).
 */
export function nextNewMoonAfter(jde: number): number {
  const remainingFraction = (360 - getElongation(jde)) / 360;
  let t = refineConjunction(jde + remainingFraction * SYNODIC_MONTH);
  let guard = 0;
  // Require strict advancement of at least an hour to rule out returning `jde`.
  while (t <= jde + 1 / 24 && guard++ < 3) t = refineConjunction(t + SYNODIC_MONTH);
  return t;
}

/**
 * Whether the Sun crosses a sidereal 30° boundary (a sankranti) in (t0, t1],
 * and which sign it enters. Returns null if no ingress occurs — the condition
 * that defines an adhika (intercalary) lunar month.
 */
export function sankrantiInInterval(t0: number, t1: number): { rashi: number; jde: number } | null {
  const s0 = getSunSiderealLongitude(t0);
  const s1 = getSunSiderealLongitude(t1);
  const r0 = Math.floor(s0 / 30);
  const r1 = Math.floor(s1 / 30);
  if (r0 === r1 && s1 >= s0) return null; // no boundary crossed
  const target = ((r0 + 1) % 12) * 30;
  // Bisect on the crossing of `target`.
  let lo = t0;
  let hi = t1;
  const g = (t: number) => angleDiff(getSunSiderealLongitude(t), target);
  if (!(g(lo) < 0 && g(hi) >= 0)) {
    // Scan for the bracket if the simple orientation does not hold.
    let prev = t0;
    let found = false;
    for (let t = t0; t <= t1; t += 0.25) {
      if (g(prev) < 0 && g(t) >= 0) {
        lo = prev;
        hi = t;
        found = true;
        break;
      }
      prev = t;
    }
    if (!found) return null;
  }
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (g(lo) < 0 && g(mid) >= 0) hi = mid;
    else lo = mid;
    if (hi - lo < 1e-5) break;
  }
  return { rashi: (r0 + 1) % 12, jde: (lo + hi) / 2 };
}
