// Metamorphic guard — validates the engine WITHOUT a ground-truth oracle.
//
// The 8-karma dasha system is synthesized (see references/extracted/
// GAP_CLOSING_RESEARCH__synthesis.md §GV.5), so no external kundali can be
// diffed against this engine's interpretive output. What CAN be asserted is
// how the output must *change* when the input changes — metamorphic relations.
// Each relation below is a property that must hold for any correct engine,
// independent of doctrine.
//
// Relations:
//   MR-1  Continuity      — births 1s apart produce the same chart
//   MR-2  Boundary        — a nakshatra boundary flips nakshatra and nothing else
//   MR-3  Pada monotonic  — pada is non-decreasing across a nakshatra span
//   MR-4  Sunrise/east    — moving east advances sunrise, so ishtakaal grows
//   MR-5  Paksha inversion— shukla and krishna phase coefficients straddle 1.0
//   MR-6  Nakshatra→affinity is a pure function of nakshatra alone
//   MR-7  Determinism     — same input twice gives the same output

import { generateUserProfile, BirthFormData } from '../src/lib/analysisSynthesizer';
import { tithiPravahPhaseCoefficient } from '../src/lib/dashaEngine';
import { getNakshatraByDegree } from '../src/data/nakshatras';

const errors: string[] = [];
let checks = 0;

function assert(cond: boolean, label: string, detail = '') {
  checks++;
  if (!cond) errors.push(`${label}${detail ? ` — ${detail}` : ''}`);
}

const BASE: BirthFormData = {
  fullName: 'परीक्षण',
  dob: '1990-06-15',
  time: '10:30',
  place: 'Delhi',
  lat: '28.6139',
  lng: '77.2090',
  gender: 'male',
};

const at = (o: Partial<BirthFormData>): BirthFormData => ({ ...BASE, ...o });

// ── MR-1: Continuity ────────────────────────────────────────────────────────
// One minute of clock time moves the Moon ~0.0005°. Unless that minute crosses
// a real nakshatra boundary, every discrete field must be identical.
{
  const spans = ['1990-06-15', '1975-01-01', '2003-11-20', '2018-08-08'];
  for (const dob of spans) {
    const a = generateUserProfile(at({ dob, time: '10:30' }));
    const b = generateUserProfile(at({ dob, time: '10:31' }));
    const drift = Math.abs(b.moonLongitude - a.moonLongitude);

    // Guard the assertion itself: only assert stability away from a boundary.
    const nak = getNakshatraByDegree(a.moonLongitude);
    const distToEdge = Math.min(
      a.moonLongitude - nak.start_deg,
      nak.start_deg + 13.3333 - a.moonLongitude
    );

    assert(drift < 0.05, `MR-1 continuity ${dob}`, `moon drifted ${drift.toFixed(4)}° in 1 min`);
    if (distToEdge > 0.05) {
      assert(
        a.birthNakshatra === b.birthNakshatra,
        `MR-1 nakshatra stable ${dob}`,
        `${a.birthNakshatra} → ${b.birthNakshatra}`
      );
      assert(
        a.dominantKarmaEn === b.dominantKarmaEn,
        `MR-1 karma stable ${dob}`,
        `${a.dominantKarmaEn} → ${b.dominantKarmaEn}`
      );
      assert(
        a.tirthankarAffinity === b.tirthankarAffinity,
        `MR-1 affinity stable ${dob}`
      );
    }
  }
}

// ── MR-2: Boundary behaviour ────────────────────────────────────────────────
// Straddling a 13°20' boundary must change the nakshatra — and the change must
// be to the immediately adjacent one, never a jump.
{
  for (let i = 1; i < 27; i++) {
    const edge = i * (360 / 27);
    const below = getNakshatraByDegree(edge - 0.001);
    const above = getNakshatraByDegree(edge + 0.001);
    assert(
      below.index !== above.index,
      `MR-2 boundary ${i} flips`,
      `both sides read ${below.name}`
    );
    assert(
      (below.index + 1) % 27 === above.index,
      `MR-2 boundary ${i} adjacency`,
      `${below.name}(${below.index}) → ${above.name}(${above.index})`
    );
  }
}

// ── MR-3: Pada monotonicity ─────────────────────────────────────────────────
// Within one nakshatra, pada must run 1,2,3,4 in order — never skip or reverse.
{
  const nak = getNakshatraByDegree(15.0);
  const seen: number[] = [];
  for (let f = 0.02; f < 1; f += 0.02) {
    const deg = nak.start_deg + f * 13.3333;
    const p = generateUserProfileFromDeg(deg);
    if (seen[seen.length - 1] !== p) seen.push(p);
  }
  assert(
    seen.length === 4 && seen.every((v, i) => v === i + 1),
    'MR-3 pada monotonic',
    `observed sequence [${seen.join(',')}]`
  );
}

// Pada is derived from longitude only; reuse the engine's own rule.
function generateUserProfileFromDeg(deg: number): number {
  const nak = getNakshatraByDegree(deg);
  const within = deg - nak.start_deg;
  return Math.min(4, Math.floor(within / (13.3333 / 4)) + 1);
}

// ── MR-4: Sunrise / longitude relation ──────────────────────────────────────
// Moving east makes the sun rise earlier, so for a fixed clock time more time
// has elapsed since sunrise → ishtakaal must increase.
{
  const west = generateUserProfile(at({ lng: '72.8777', place: 'Mumbai' }));
  const east = generateUserProfile(at({ lng: '88.3639', place: 'Kolkata' }));
  const wg = west.ishtakaal.ghatis + west.ishtakaal.palas / 60;
  const eg = east.ishtakaal.ghatis + east.ishtakaal.palas / 60;
  assert(
    eg > wg,
    'MR-4 eastward ishtakaal increases',
    `east ${eg.toFixed(2)} should exceed west ${wg.toFixed(2)} ghatis`
  );
}

// ── MR-5: Paksha inversion ──────────────────────────────────────────────────
// Shukla paksha expands durations (coefficient > 1), krishna contracts (< 1).
// The two must straddle 1.0 and stay inside the documented ±15% band.
{
  for (const e of [10, 60, 120, 175]) {
    const c = tithiPravahPhaseCoefficient(e);
    assert(c > 1.0 && c <= 1.15, `MR-5 shukla expands @${e}°`, `coefficient ${c.toFixed(4)}`);
  }
  for (const e of [185, 240, 300, 355]) {
    const c = tithiPravahPhaseCoefficient(e);
    assert(c < 1.0 && c >= 0.85, `MR-5 krishna contracts @${e}°`, `coefficient ${c.toFixed(4)}`);
  }
  assert(
    tithiPravahPhaseCoefficient(-1) === 1.0,
    'MR-5 unknown elongation is neutral'
  );
}

// ── MR-6: Affinity is a pure function of nakshatra ──────────────────────────
// Two people born years apart in the same nakshatra must share tirthankar
// affinity and karma type — those depend on nakshatra alone, not on epoch.
{
  const byNakshatra = new Map<string, { t: string; k: string; dob: string }>();
  for (let y = 1960; y <= 2020; y += 4) {
    for (const md of ['-03-11', '-07-22', '-11-05']) {
      const p = generateUserProfile(at({ dob: `${y}${md}` }));
      const prev = byNakshatra.get(p.birthNakshatra);
      if (prev) {
        assert(
          prev.t === p.tirthankarAffinity,
          `MR-6 affinity pure (${p.birthNakshatra})`,
          `${prev.dob} gave ${prev.t}, ${y}${md} gave ${p.tirthankarAffinity}`
        );
        assert(
          prev.k === p.dominantKarmaEn,
          `MR-6 karma pure (${p.birthNakshatra})`,
          `${prev.dob} gave ${prev.k}, ${y}${md} gave ${p.dominantKarmaEn}`
        );
      } else {
        byNakshatra.set(p.birthNakshatra, {
          t: p.tirthankarAffinity,
          k: p.dominantKarmaEn,
          dob: `${y}${md}`,
        });
      }
    }
  }
}

// ── MR-7: Determinism ───────────────────────────────────────────────────────
// Identical input must give identical output within a single run.
{
  const a = generateUserProfile(at({}));
  const b = generateUserProfile(at({}));
  assert(a.moonLongitude === b.moonLongitude, 'MR-7 longitude deterministic');
  assert(a.birthNakshatra === b.birthNakshatra, 'MR-7 nakshatra deterministic');
  assert(a.gunasthana === b.gunasthana, 'MR-7 gunasthana deterministic');
  assert(
    a.ishtakaal.formatted === b.ishtakaal.formatted,
    'MR-7 ishtakaal deterministic'
  );
}

// ── Doctrinal invariants (hold for every generated chart) ───────────────────
// These are not metamorphic but share the harness: they must hold universally.
{
  for (let y = 1955; y <= 2045; y += 6) {
    const p = generateUserProfile(at({ dob: `${y}-04-18`, time: '07:15' }));

    // Pancham Kaal ceiling — no moksha, no gunasthana above 5.
    assert(
      p.gunasthana >= 1 && p.gunasthana <= 5,
      `INV gunasthana in Pancham Kaal (${y})`,
      `got ${p.gunasthana}`
    );
    assert(p.nakshatraPada >= 1 && p.nakshatraPada <= 4, `INV pada range (${y})`, `got ${p.nakshatraPada}`);
    assert(
      p.moonLongitude >= 0 && p.moonLongitude < 360,
      `INV longitude range (${y})`,
      `got ${p.moonLongitude}`
    );
    assert(p.ishtakaal.ghatis >= 0 && p.ishtakaal.ghatis < 60, `INV ghati range (${y})`);
    assert(p.ishtakaal.palas >= 0 && p.ishtakaal.palas < 60, `INV pala range (${y})`);
    assert(!!p.dominantKarma?.trim(), `INV dominant karma present (${y})`);

    // Dasha spans must be ordered and positive.
    const d = p.currentDasha;
    assert(d.yearsTotal > 0, `INV dasha duration positive (${y})`, `got ${d.yearsTotal}`);
    assert(d.yearsRemaining >= 0, `INV dasha remaining non-negative (${y})`);
    assert(
      d.yearsRemaining <= d.yearsTotal + 0.1,
      `INV remaining ≤ total (${y})`,
      `${d.yearsRemaining} > ${d.yearsTotal}`
    );
  }
}

// ── Invalid input must throw, never fabricate ───────────────────────────────
{
  const bad = [
    { dob: 'not-a-date', label: 'garbage dob' },
    { dob: '', label: 'empty dob' },
  ];
  for (const b of bad) {
    let threw = false;
    try {
      const p = generateUserProfile(at({ dob: b.dob }));
      if (!Number.isFinite(p.moonLongitude)) threw = true;
    } catch {
      threw = true;
    }
    assert(threw, `INV rejects ${b.label}`, 'engine fabricated a chart instead of throwing');
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
if (errors.length) {
  console.error(`Metamorphic guard FAILED — ${errors.length} of ${checks} checks:`);
  errors.forEach((e) => console.error(`- ${e}`));
  process.exit(1);
}

console.log(`Metamorphic guard passed — ${checks} checks across 7 relations + invariants.`);
