// Ephemeris conformance guard — the external-oracle layer.
//
// The metamorphic guard asserts how output CHANGES with input, which by
// construction cannot detect a uniform error: shift every longitude by 7° and
// every metamorphic relation still holds. Only comparison against externally
// known astronomy catches that class of bug, and it is the worst class, because
// it corrupts every chart silently.
//
// The anchors below are physical events whose times are published and were not
// derived from this codebase:
//
//   Equinox      — apparent tropical solar longitude is 0° at the March equinox.
//                  Tests the solar series and, indirectly, nutation/aberration.
//   Syzygy       — at a solar eclipse the Moon-Sun elongation is 0°; at a lunar
//                  eclipse it is 180°. Tests the lunar series against the solar
//                  one at the tightest possible constraint.
//   Conjunction  — published new-moon instants, tested through the engine's own
//                  conjunction solver (which drives lunar-month naming).
//   Sankranti    — sidereal solar ingress into Capricorn is observed as Makar
//                  Sankranti on 14-15 January in the modern era. This is the
//                  only anchor that tests the AYANAMSA: a wrong ayanamsa moves
//                  the date while leaving every tropical quantity intact.
//
// IMPORTANT — what the eclipse anchors do NOT prove.
// Eclipses are a BIASED sample of lunar positions: they occur only at syzygy
// near a node, which is exactly where several large periodic terms are at an
// extremum and partly cancel. Measured here, truncating the lunar series from
// 60 terms to 4 still satisfies every syzygy bound below. Eclipse anchors
// therefore verify the solar series, the ayanamsa, and the solver — but they do
// NOT verify the completeness of the lunar series.
//
// That is what the Meeus Example 47.a anchor is for: an arbitrary epoch, away
// from syzygy, with a longitude published to six decimal places. A truncated
// series misses it by tens of arcminutes and fails immediately.

import {
  julianDayFromUTC,
  getSunLongitude,
  getMoonTropicalLongitude,
  getElongation,
  getSunSiderealLongitude,
  getMoonSiderealLongitude,
  getLahiriAyanamsa,
  lastNewMoonBefore,
  normDeg,
  toJulianDay as toJulianDayIST,
  toJulianDay,
} from '../src/lib/astronomy';
import { getAllGrahaPositions, getLagna, type GrahaKey } from '../src/lib/planets';

const errors: string[] = [];
const notes: string[] = [];
let checks = 0;

/** Absolute angular difference in arcminutes, wrapped across 0/360. */
function arcmin(a: number, b: number): number {
  const d = Math.abs(((a - b + 180 + 360) % 360) - 180);
  return d * 60;
}

function expect(label: string, actualArcmin: number, boundArcmin: number) {
  checks++;
  const ok = actualArcmin <= boundArcmin;
  const line = `  ${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(46)} ${actualArcmin.toFixed(2)}' (bound ${boundArcmin}')`;
  notes.push(line);
  if (!ok) errors.push(`${label} — off by ${actualArcmin.toFixed(2)} arcmin, bound ${boundArcmin}'`);
}

// ── 0. Lunar series completeness — Meeus worked example ─────────────────────
// Meeus, Astronomical Algorithms 2nd ed., Example 47.a: 1992 April 12.0 TD
// (JDE 2448724.5) gives apparent geocentric longitude 133.167265°. This is an
// arbitrary epoch away from syzygy, so unlike the eclipse anchors it is
// sensitive to every term in the series. It is the guard's tightest bound and
// the only one that detects an incomplete lunar theory.
{
  const got = getMoonTropicalLongitude(2448724.5);
  const errArcsec = Math.abs(got - 133.167265) * 3600;
  checks++;
  const ok = errArcsec <= 30; // 0.5 arcmin
  notes.push(
    `  ${ok ? 'ok  ' : 'FAIL'} ${'Meeus Ex.47.a lunar longitude'.padEnd(46)} ${errArcsec.toFixed(2)}" (bound 30")`
  );
  if (!ok) {
    errors.push(
      `Meeus Ex.47.a — lunar longitude off by ${errArcsec.toFixed(2)}", expected ≤30"; lunar series likely incomplete`
    );
  }
}

// ── 0b. Pre-dawn births land on the correct UTC day ─────────────────────────
// REGRESSION GUARD. IST is UTC+5:30, so a birth before 05:30 IST belongs to the
// PREVIOUS UTC day. The original toJulianDay computed
//     utcHour = ((h + m/60 - 5.5) + 24) % 24
// and then added it to an UNDECREMENTED day number, so the modulo wrapped a
// negative offset up to ~19.9 hours and every birth between 00:00 and 05:29 IST
// was computed a full day late. The Moon moves ~13.2°/day, so those charts came
// out ~11.85° wrong — normally a different nakshatra, which changes tirthankar
// affinity, dominant karma and the dasha starting lord.
//
// That is roughly 23% of all births (5.5 of 24 hours). Confirmed against a real
// chart: 1993-09-05 01:25 IST gave Moon 11.05° (Ashvini) under the old form; the
// correct value is 359.20° (Revati).
//
// No metamorphic relation catches this: a one-minute delta shifts both samples
// equally, so continuity still holds on a uniformly wrong day. It needs an
// absolute anchor, which is why it lives here.
{
  // Midnight-to-dawn and post-dawn births on the same civil date must differ by
  // only the elapsed hours of Moon motion, never by a whole day.
  const moonAt = (t: string) => getMoonSiderealLongitude(toJulianDayIST('1993-09-05', t));
  const preDawn = moonAt('01:25');
  const postDawn = moonAt('08:00');
  // 6h35m of Moon motion ≈ 3.6°; a day-shift would show ~11.8°.
  // Wrap the difference: this pair straddles 0°, so a raw subtraction reads
  // ~357° instead of ~3°.
  const gap = Math.abs(((postDawn - preDawn + 180 + 360) % 360) - 180);
  checks++;
  const ok = gap < 6;
  notes.push(
    `  ${ok ? 'ok  ' : 'FAIL'} ${'pre-dawn birth stays on the same day'.padEnd(46)} 01:25 vs 08:00 differ by ${gap.toFixed(2)}° (bound 6°)`
  );
  if (!ok) {
    errors.push(
      `pre-dawn date handling — Moon at 01:25 and 08:00 on the same date differ by ${gap.toFixed(2)}°, ` +
        `which is a whole-day shift, not ~3.6° of real motion. The IST offset is being wrapped ` +
        `instead of carried into the day number.`
    );
  }

  // The specific real chart that exposed it.
  const m = moonAt('01:25');
  checks++;
  const inRevati = m >= 346.6667 && m < 360;
  notes.push(
    `  ${inRevati ? 'ok  ' : 'FAIL'} ${'1993-09-05 01:25 IST is Revati, not Ashvini'.padEnd(46)} moon=${m.toFixed(2)}°`
  );
  if (!inRevati) {
    errors.push(
      `1993-09-05 01:25 IST gives Moon ${m.toFixed(2)}°; verified correct value is 359.20° (Revati pada 4). ` +
        `A value near 11° means the pre-dawn day-shift bug has returned.`
    );
  }
}

// ── 1. March equinoxes: apparent solar longitude = 0° ───────────────────────
// Published instants (UTC).
const EQUINOXES: [string, number, number, number, number][] = [
  ['equinox 2000-03-20 07:35Z', 2000, 3, 20, 7 + 35 / 60],
  ['equinox 2010-03-20 17:32Z', 2010, 3, 20, 17 + 32 / 60],
  ['equinox 2020-03-20 03:50Z', 2020, 3, 20, 3 + 50 / 60],
  ['equinox 2024-03-20 03:06Z', 2024, 3, 20, 3 + 6 / 60],
];
for (const [label, Y, M, D, h] of EQUINOXES) {
  expect(label, arcmin(getSunLongitude(julianDayFromUTC(Y, M, D, h)), 0), 2);
}

// ── 2. Syzygies at eclipses ─────────────────────────────────────────────────
// Lunar eclipses: greatest eclipse is very close to true opposition, so the
// bound is tight. Solar eclipses: "greatest eclipse" is the instant the shadow
// axis passes closest to Earth's centre, which differs from ecliptic
// conjunction by several minutes of time; the bound allows for that physical
// offset (~0.5°/hr of relative motion) while still catching a bad lunar series.
const LUNAR_ECLIPSES: [string, number, number, number, number][] = [
  ['lunar eclipse 2018-07-27 20:22Z', 2018, 7, 27, 20 + 22 / 60],
  ['lunar eclipse 2022-11-08 10:59Z', 2022, 11, 8, 10 + 59 / 60],
  ['lunar eclipse 2019-01-21 05:12Z', 2019, 1, 21, 5 + 12 / 60],
];
for (const [label, Y, M, D, h] of LUNAR_ECLIPSES) {
  expect(label, arcmin(getElongation(julianDayFromUTC(Y, M, D, h)), 180), 6);
}

const SOLAR_ECLIPSES: [string, number, number, number, number][] = [
  ['solar eclipse 2024-04-08 18:17Z', 2024, 4, 8, 18 + 17 / 60],
  ['solar eclipse 2017-08-21 18:26Z', 2017, 8, 21, 18 + 26 / 60],
  ['solar eclipse 1999-08-11 11:03Z', 1999, 8, 11, 11 + 3 / 60],
];
for (const [label, Y, M, D, h] of SOLAR_ECLIPSES) {
  expect(label, arcmin(getElongation(julianDayFromUTC(Y, M, D, h)), 0), 8);
}

// ── 3. Conjunction solver against published new moons ───────────────────────
// Exercises lastNewMoonBefore, which determines lunar-month naming.
const NEW_MOONS: [string, number, number, number, number][] = [
  ['new moon 2024-04-08 18:21Z', 2024, 4, 8, 18 + 21 / 60],
  ['new moon 2023-03-21 17:23Z', 2023, 3, 21, 17 + 23 / 60],
  ['new moon 2025-03-29 10:58Z', 2025, 3, 29, 10 + 58 / 60],
  ['new moon 2024-10-02 18:49Z', 2024, 10, 2, 18 + 49 / 60],
];
for (const [label, Y, M, D, h] of NEW_MOONS) {
  const published = julianDayFromUTC(Y, M, D, h);
  const solved = lastNewMoonBefore(published + 3);
  const minutes = Math.abs(solved - published) * 24 * 60;
  checks++;
  const ok = minutes <= 10;
  notes.push(
    `  ${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(46)} solver off by ${minutes.toFixed(1)} min (bound 10)`
  );
  if (!ok) errors.push(`${label} — conjunction solver off by ${minutes.toFixed(1)} min`);
}

// ── 4. Ayanamsa via Makar Sankranti ─────────────────────────────────────────
// The ONLY check here that constrains the ayanamsa. Sidereal solar ingress into
// Capricorn (270°) is observed on 14-15 January in the modern era; an ayanamsa
// wrong by 1° moves it by about a day.
const SANKRANTI_YEARS = [1950, 1975, 2000, 2024, 2050];
for (const Y of SANKRANTI_YEARS) {
  let crossingDay = -1;
  for (let d = 12; d <= 17; d++) {
    const before = getSunSiderealLongitude(julianDayFromUTC(Y, 1, d - 1, 0));
    const after = getSunSiderealLongitude(julianDayFromUTC(Y, 1, d, 0));
    if (before < 270 && after >= 270) crossingDay = d;
  }
  checks++;
  const ok = crossingDay === 14 || crossingDay === 15;
  notes.push(
    `  ${ok ? 'ok  ' : 'FAIL'} ${`Makar Sankranti ${Y}`.padEnd(46)} crosses 270° on Jan ${crossingDay} (expect 14-15)`
  );
  if (!ok) {
    errors.push(
      `Makar Sankranti ${Y} — sidereal Sun crosses 270° on Jan ${crossingDay}, expected 14 or 15; ayanamsa suspect`
    );
  }
}

// ── 5. Ayanamsa magnitude and drift ─────────────────────────────────────────
// Lahiri is ~23°51' at J2000 and precesses ~50.29"/yr. Both are asserted so a
// sign flip or a unit error cannot pass.
{
  const j2000 = julianDayFromUTC(2000, 1, 1, 12);
  const a2000 = getLahiriAyanamsa(j2000);
  checks++;
  if (Math.abs(a2000 - 23.8571) > 0.02) {
    errors.push(`Lahiri ayanamsa at J2000 = ${a2000.toFixed(4)}°, expected ≈23.857°`);
  }
  notes.push(`  ${Math.abs(a2000 - 23.8571) <= 0.02 ? 'ok  ' : 'FAIL'} ${'Lahiri ayanamsa at J2000'.padEnd(46)} ${a2000.toFixed(4)}° (expect 23.857°)`);

  const drift = (getLahiriAyanamsa(julianDayFromUTC(2100, 1, 1, 12)) - a2000) * 3600 / 100;
  checks++;
  const driftOk = Math.abs(drift - 50.29) < 0.5;
  notes.push(`  ${driftOk ? 'ok  ' : 'FAIL'} ${'ayanamsa drift per year'.padEnd(46)} ${drift.toFixed(3)}"/yr (expect 50.29")`);
  if (!driftOk) errors.push(`ayanamsa drift ${drift.toFixed(3)}"/yr, expected ≈50.29"/yr`);
}

// ── 6. Lunar mean motion ────────────────────────────────────────────────────
// The Moon must advance 360° in one sidereal month (27.321661 days) and the
// sidereal longitude must be continuous across that span.
{
  const t0 = julianDayFromUTC(2020, 6, 15, 0);
  const t1 = t0 + 27.321661;
  const advance = normDeg(getMoonSiderealLongitude(t1) - getMoonSiderealLongitude(t0));
  const err = Math.min(advance, 360 - advance) * 60;
  checks++;
  const ok = err < 90; // the true motion wobbles; this catches gross scale errors
  notes.push(`  ${ok ? 'ok  ' : 'FAIL'} ${'Moon returns after one sidereal month'.padEnd(46)} ${err.toFixed(1)}' residual (bound 90')`);
  if (!ok) errors.push(`Moon sidereal-month closure off by ${err.toFixed(1)} arcmin`);
}

// ── 7. Planetary positions against published events ─────────────────────────
// The planetary theory (Standish/JPL Keplerian elements) is new, and unlike the
// Sun and Moon it has no long-standing anchors in this guard. These five events
// are published astronomy this codebase did not produce, and each pins two
// bodies against each other so an error in either one shows up as a gap.
//
// A conjunction is a strong test precisely because it is a coincidence: getting
// the separation right at the right instant is very hard to do by accident.
{
  const sep = (a: number, b: number) => Math.abs(((a - b) + 540) % 360 - 180);
  const posAt = (d: string, t: string) =>
    new Map(getAllGrahaPositions(toJulianDay(d, t)).map((g) => [g.key, g.siderealLongitude]));

  const EVENTS: Array<{ date: string; time: string; a: GrahaKey; b: GrahaKey; expect: number; tol: number; label: string }> = [
    // Jupiter-Saturn great conjunction. Closest approach 0.1 deg.
    { date: '2020-12-21', time: '18:30', a: 'Guru', b: 'Shani', expect: 0.1, tol: 0.25, label: 'Great conjunction 2020: Guru-Shani' },
    // Venus transit of the Sun — the two longitudes coincide by definition.
    { date: '2004-06-08', time: '13:50', a: 'Shukra', b: 'Surya', expect: 0, tol: 0.20, label: 'Venus transit 2004: Shukra on Surya' },
    // Mercury transit of the Sun.
    { date: '2016-05-09', time: '19:30', a: 'Budha', b: 'Surya', expect: 0, tol: 0.20, label: 'Mercury transit 2016: Budha on Surya' },
    // Mars at opposition — exactly 180 deg from the Sun.
    { date: '2018-07-27', time: '10:37', a: 'Mangal', b: 'Surya', expect: 180, tol: 0.20, label: 'Mars opposition 2018: Mangal opposite Surya' },
    // Mercury transit, a second epoch, to catch an error that happens to vanish
    // at one date.
    { date: '2019-11-11', time: '20:20', a: 'Budha', b: 'Surya', expect: 0, tol: 0.20, label: 'Mercury transit 2019: Budha on Surya' },
  ];

  for (const e of EVENTS) {
    const p = posAt(e.date, e.time);
    const got = sep(p.get(e.a)!, p.get(e.b)!);
    const err = Math.abs(got - e.expect);
    checks++;
    const ok = err < e.tol;
    notes.push(`  ${ok ? 'ok  ' : 'FAIL'} ${e.label.padEnd(46)} ${got.toFixed(3)}deg vs ${e.expect}deg (bound ${e.tol})`);
    if (!ok) errors.push(`${e.label}: separation ${got.toFixed(3)}deg, expected ${e.expect}deg +/- ${e.tol}`);
  }

  // The nodes are always 180 deg apart by construction. A cheap invariant, but
  // it catches a sign slip in the Ketu derivation.
  {
    const p = posAt('1993-09-05', '01:25');
    const d = sep(p.get('Rahu' as GrahaKey)!, p.get('Ketu' as GrahaKey)!);
    checks++;
    const ok = Math.abs(d - 180) < 1e-6;
    notes.push(`  ${ok ? 'ok  ' : 'FAIL'} ${'Rahu and Ketu exactly opposed'.padEnd(46)} ${d.toFixed(6)}deg`);
    if (!ok) errors.push(`Rahu/Ketu separation ${d.toFixed(6)}deg, must be 180`);
  }
}

// ── 8. Lagna: the Sun sits on the ascendant at sunrise ──────────────────────
// An oracle-free identity, and a strict one. If the ascendant formula has a
// quadrant error, a sign slip, an obliquity mistake or the wrong sidereal time,
// the instant at which the Sun coincides with the ascendant moves away from
// actual sunrise and the gap opens up. Tested across latitudes because the
// tan(phi) term is where such formulas usually break.
{
  const CASES: Array<[string, string, number, number, string]> = [
    ['1993-09-05', 'Meerut', 28.98, 77.70, '06:03'],
    ['2000-03-20', 'Delhi', 28.61, 77.21, '06:29'],
    ['1975-12-22', 'Chennai', 13.08, 80.27, '06:30'],
    ['2015-06-21', 'Leh', 34.16, 77.58, '05:13'],
  ];
  for (const [dob, place, lat, lon, expectIST] of CASES) {
    let best = 1e9, bestT = '';
    for (let m = 0; m < 24 * 60; m++) {
      const hh = String(Math.floor(m / 60)).padStart(2, '0');
      const mm = String(m % 60).padStart(2, '0');
      const jd = toJulianDay(dob, `${hh}:${mm}`);
      const d = Math.abs(((getLagna(jd, lat, lon) - getSunSiderealLongitude(jd)) + 540) % 360 - 180);
      if (d < best) { best = d; bestT = `${hh}:${mm}`; }
    }
    checks++;
    const ok = best < 0.25 && bestT === expectIST;
    notes.push(`  ${ok ? 'ok  ' : 'FAIL'} ${`Lagna = Sun at sunrise, ${place}`.padEnd(46)} ${bestT} IST, gap ${best.toFixed(3)}deg`);
    if (!ok) errors.push(`${place} ${dob}: Sun coincides with lagna at ${bestT} (expected ${expectIST}), gap ${best.toFixed(3)}deg`);
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
console.log(`Ephemeris conformance guard — ${checks} checks against published astronomy\n`);
notes.forEach((n) => console.log(n));

if (errors.length) {
  console.error(`\nEphemeris guard FAILED — ${errors.length} of ${checks}:`);
  errors.forEach((e) => console.error(`- ${e}`));
  process.exit(1);
}

console.log(`\nEphemeris guard passed — all ${checks} anchors within tolerance.`);
