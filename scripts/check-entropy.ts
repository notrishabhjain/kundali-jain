// Entropy / collision guard — measures whether the engine actually personalises.
//
// A kundali engine can be doctrinally impeccable and still be worthless if
// thousands of different births collapse onto a handful of readings. That
// failure mode needs no scholar to detect: it is measurable as output entropy.
// CLAUDE.md's quality gate "Addresses 'आप' not generic" is quantified here.
//
// Fails only on hard breaks (a field that never varies, an impossible value, a
// single reading swallowing the population). Everything else is reported so
// drift is visible in CI logs over time.

import { generateUserProfile, BirthFormData } from '../src/lib/analysisSynthesizer';

const N = Number(process.env.ENTROPY_N ?? 4000);

// Deterministic LCG — reproducible across runs and machines, no Math.random.
let seed = 20260823;
const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);

const PLACES = [
  { place: 'Delhi',     lat: '28.6139', lng: '77.2090' },
  { place: 'Mumbai',    lat: '19.0760', lng: '72.8777' },
  { place: 'Kolkata',   lat: '22.5726', lng: '88.3639' },
  { place: 'Chennai',   lat: '13.0827', lng: '80.2707' },
  { place: 'Indore',    lat: '22.7196', lng: '75.8577' },
  { place: 'Jaipur',    lat: '26.9124', lng: '75.7873' },
];

function randomBirth(i: number): BirthFormData {
  const p = PLACES[Math.floor(rand() * PLACES.length)];
  const year = 1950 + Math.floor(rand() * 76);          // 1950–2025
  const month = 1 + Math.floor(rand() * 12);
  const day = 1 + Math.floor(rand() * 28);
  const hh = Math.floor(rand() * 24);
  const mm = Math.floor(rand() * 60);
  return {
    fullName: `व्यक्ति${i}`,
    dob: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    time: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
    place: p.place,
    lat: p.lat,
    lng: p.lng,
    gender: rand() > 0.5 ? 'male' : 'female',
  };
}

const tally = <T>(xs: T[]) => {
  const m = new Map<T, number>();
  for (const x of xs) m.set(x, (m.get(x) ?? 0) + 1);
  return m;
};

// Shannon entropy in bits, and how close it is to a perfectly uniform spread.
function entropy(counts: Map<unknown, number>, total: number) {
  let h = 0;
  for (const c of counts.values()) {
    const p = c / total;
    if (p > 0) h -= p * Math.log2(p);
  }
  const max = Math.log2(counts.size || 1);
  return { bits: h, normalised: max > 0 ? h / max : 0 };
}

function report(name: string, counts: Map<string, number>, total: number) {
  const e = entropy(counts, total);
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const [topK, topN] = sorted[0];
  console.log(
    `  ${name.padEnd(16)} ${String(counts.size).padStart(3)} distinct | ` +
      `H=${e.bits.toFixed(2)} bits (${(e.normalised * 100).toFixed(1)}% of uniform) | ` +
      `top: ${topK} ${((topN / total) * 100).toFixed(1)}%`
  );
  return { size: counts.size, top: topK, topShare: topN / total, ...e };
}

// ── Generate population ─────────────────────────────────────────────────────
const profiles = [];
let failures = 0;
for (let i = 0; i < N; i++) {
  try {
    profiles.push(generateUserProfile(randomBirth(i)));
  } catch {
    failures++;
  }
}

console.log(`Entropy guard — ${profiles.length} charts generated (${failures} rejected)\n`);

const errors: string[] = [];

// ── Per-field distributions ─────────────────────────────────────────────────
console.log('Field distributions:');
const nak = report('nakshatra', tally(profiles.map((p) => p.birthNakshatra)) as Map<string, number>, profiles.length);
const karma = report('dominantKarma', tally(profiles.map((p) => p.dominantKarmaEn)) as Map<string, number>, profiles.length);
const tirth = report('tirthankar', tally(profiles.map((p) => p.tirthankarAffinity)) as Map<string, number>, profiles.length);
const guna = report('gunasthana', tally(profiles.map((p) => String(p.gunasthana))) as Map<string, number>, profiles.length);
const dasha = report('dashaLord', tally(profiles.map((p) => p.currentDasha.lord)) as Map<string, number>, profiles.length);
const pada = report('pada', tally(profiles.map((p) => String(p.nakshatraPada))) as Map<string, number>, profiles.length);
const rashi = report('rashi', tally(profiles.map((p) => p.birthRashi)) as Map<string, number>, profiles.length);

// ── Joint signature: how many genuinely distinct readings exist? ────────────
const signature = (p: (typeof profiles)[number]) =>
  [
    p.birthNakshatra,
    p.nakshatraPada,
    p.dominantKarmaEn,
    p.currentDasha.lord,
    p.currentDasha.antardashaInfo.lord,
    p.gunasthana,
  ].join('|');

const sigs = tally(profiles.map(signature)) as Map<string, number>;
const sigE = entropy(sigs, profiles.length);
const biggest = [...sigs.entries()].sort((a, b) => b[1] - a[1])[0];

console.log('\nJoint reading signature:');
console.log(`  distinct readings   ${sigs.size} / ${profiles.length} charts`);
console.log(`  uniqueness ratio    ${((sigs.size / profiles.length) * 100).toFixed(1)}%`);
console.log(`  entropy             ${sigE.bits.toFixed(2)} bits`);
console.log(`  largest cluster     ${((biggest[1] / profiles.length) * 100).toFixed(2)}% of population`);

// ── Hard failure conditions ─────────────────────────────────────────────────
// These are genuine breakage, not taste.

if (nak.size < 20) errors.push(`only ${nak.size}/27 nakshatras ever produced — lookup likely broken`);
if (pada.size !== 4) errors.push(`pada took ${pada.size} distinct values, expected exactly 4`);
if (karma.size < 3) errors.push(`only ${karma.size} distinct dominant karmas — karma mapping collapsed`);
if (dasha.size < 4) errors.push(`only ${dasha.size} distinct dasha lords across ${profiles.length} charts`);

// No single reading may swallow the population.
if (biggest[1] / profiles.length > 0.10) {
  errors.push(
    `one reading covers ${((biggest[1] / profiles.length) * 100).toFixed(1)}% of charts (>10%): ${biggest[0]}`
  );
}
// A field pinned to one value is a dead field.
for (const [label, r] of [['nakshatra', nak], ['dominantKarma', karma], ['dashaLord', dasha], ['rashi', rashi]] as const) {
  if (r.topShare > 0.60) errors.push(`${label} is ${(r.topShare * 100).toFixed(0)}% "${r.top}" — field is near-constant`);
}
// Pancham Kaal ceiling across the whole population.
for (const g of guna ? [...tally(profiles.map((p) => p.gunasthana)).keys()] : []) {
  if ((g as number) < 1 || (g as number) > 5) errors.push(`gunasthana ${g} outside Pancham Kaal range 1–5`);
}
if (failures / N > 0.02) errors.push(`${failures}/${N} charts failed to generate (>2%)`);

// ── Notices — surfaced, never fatal ─────────────────────────────────────────
// These are shape observations that may be correct by doctrine or may indicate
// an over-coupled heuristic. They are reported so the trend stays visible in
// CI logs; deciding whether each is intended is a doctrinal call, not a test's.
const notices: string[] = [];

// Single-factor domination: does one input pin an output regardless of others?
const destructive = new Set(['Mohaniya', 'Antaraya']);
const inDest = profiles.filter((p) => destructive.has(p.currentDasha.lord));
if (inDest.length > 50) {
  const pinned = inDest.filter((p) => p.gunasthana === 1).length / inDest.length;
  if (pinned > 0.95) {
    notices.push(
      `gunasthana is 1 for ${(pinned * 100).toFixed(0)}% of charts in Mohaniya/Antaraya dasha ` +
        `(${inDest.length} charts) — dasha lord appears to override the other two axes`
    );
  }
}
const ashubha = profiles.filter((p) => p.nakshatraNature === 'ashubha');
if (ashubha.length > 50) {
  const pinned = ashubha.filter((p) => p.gunasthana === 1).length / ashubha.length;
  if (pinned > 0.95) {
    notices.push(
      `gunasthana is 1 for ${(pinned * 100).toFixed(0)}% of ashubha-nakshatra charts ` +
        `(${ashubha.length} charts) — nakshatra nature appears to override the other two axes`
    );
  }
}
if (guna.topShare > 0.5) {
  notices.push(
    `gunasthana ${guna.top} covers ${(guna.topShare * 100).toFixed(0)}% of the population — ` +
      `check this is intended before shipping it as personal guidance`
  );
}

if (notices.length) {
  console.log('\nNotices (not failures):');
  notices.forEach((n) => console.log(`  ! ${n}`));
}

if (errors.length) {
  console.error('\nEntropy guard FAILED:');
  errors.forEach((e) => console.error(`- ${e}`));
  process.exit(1);
}

console.log('\nEntropy guard passed.');
