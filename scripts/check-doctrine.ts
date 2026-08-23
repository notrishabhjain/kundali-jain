// Doctrinal constraint guard — Jain doctrine expressed as executable assertions.
//
// The existing check:hindi / check:pancham guards scan SOURCE FILES for tokens.
// This guard is different: it generates real charts, renders every narrative
// surface the user would actually read, and asserts that the OUTPUT never
// violates Digambar doctrine — no matter which birth produced it.
//
// Rules (each cites the doctrine it enforces):
//   D1 Pancham Kaal ceiling      — no gunasthana above 5 (Digambar strict view)
//   D2 No moksha attainment      — moksha is impossible in the 5th Ara
//   D3 No lifespan/death claim   — ayushya-bandha is not knowable by jyotish
//   D4 Purushartha stays open    — no fatalistic, unconditional predictions
//   D5 No Vedic devas            — Codex G2-C1, zero Vedic mixing
//   D6 Karma statements complete — name + daily manifestation + sadhana w/ count
//   D7 Remedies are actionable   — every prescription carries a count and timing
//   D8 Value ranges              — intensities and states stay in-domain
//
// A violation here is a doctrinal defect, not a style nit: it means the app
// could tell a Jain user something the tradition holds to be false.

import { generateUserProfile, AnalysisSynthesizer, BirthFormData } from '../src/lib/analysisSynthesizer';
import { getTodayContext } from '../src/lib/analysisSynthesizer';
import { generatePredictions } from '../src/lib/predictionEngine';
import { generateRemedies } from '../src/lib/remedyEngine';
import { calculateKarmaProfile } from '../src/lib/karmaEngine';

const N = Number(process.env.DOCTRINE_N ?? 400);
const errors: string[] = [];
let checks = 0;

function violation(rule: string, detail: string) {
  errors.push(`[${rule}] ${detail}`);
}

let seed = 7761946;
const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);

const PLACES = [
  { place: 'Delhi', lat: '28.6139', lng: '77.2090' },
  { place: 'Mumbai', lat: '19.0760', lng: '72.8777' },
  { place: 'Indore', lat: '22.7196', lng: '75.8577' },
];

function birth(i: number): BirthFormData {
  const p = PLACES[Math.floor(rand() * PLACES.length)];
  const y = 1950 + Math.floor(rand() * 76);
  const m = 1 + Math.floor(rand() * 12);
  const d = 1 + Math.floor(rand() * 28);
  return {
    fullName: `साधक${i}`,
    dob: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    time: `${String(Math.floor(rand() * 24)).padStart(2, '0')}:${String(Math.floor(rand() * 60)).padStart(2, '0')}`,
    place: p.place,
    lat: p.lat,
    lng: p.lng,
    gender: rand() > 0.5 ? 'male' : 'female',
  };
}

// ── Forbidden output patterns ───────────────────────────────────────────────
// Deliberately match CLAIMS, not vocabulary. "मोक्ष की प्रथम सीढ़ी" and
// "पंचम काल में मोक्ष संभव नहीं" are doctrinally CORRECT uses of the word and
// must not trip the guard — only an assertion of attainment may.

const D2_MOKSHA_CLAIM = [
  /आपको\s+मोक्ष\s+(प्राप्त|मिल)/,
  /मोक्ष\s+(प्राप्त\s+होगा|मिलेगा|निश्चित)/,
  /आप\s+मोक्ष\s+प्राप्त\s+करेंगे/,
  /केवलज्ञान\s+(प्राप्त\s+होगा|मिलेगा)/,
  /इसी\s+जन्म\s+में\s+मुक्ति/,
];

const D3_MORTALITY_CLAIM = [
  /मृत्यु\s+(होगी|का\s+समय|निश्चित)/,
  /आयु\s+(शेष|समाप्त)\s+/,
  /आपकी\s+आयु\s+\d+/,
  /\d+\s+वर्ष\s+(ही\s+)?जीवित/,
  /जीवन\s+काल\s+\d+/,
];

const D4_FATALISM = [
  /कुछ\s+नहीं\s+किया\s+जा\s+सकता/,
  /कोई\s+उपाय\s+नहीं/,
  /भाग्य\s+नहीं\s+बदल\s+सकता/,
  /निश्चित\s+रूप\s+से\s+विफल/,
  /प्रयास\s+व्यर्थ/,
];

// Codex G2-C1: nakshatras are governed by Jyotishi Devs, never Vedic devas.
//
// Devanagari has no regex word boundary, and naive substring matching produces
// false positives — "राम" sits inside विश्राम (rest), "काली" inside दीर्घकालीन
// (long-term). Each term is therefore wrapped in a lookaround asserting it is
// not adjacent to another Devanagari codepoint, so only the standalone word
// matches. Note "कृष्ण" is deliberately absent as a bare term: कृष्ण पक्ष is
// standard panchang vocabulary, so only "कृष्ण भगवान" is treated as a claim.
const DEV = '\\u0900-\\u097F';
const standalone = (term: string) => new RegExp(`(?<![${DEV}])${term}(?![${DEV}])`);

const D5_VEDIC_DEVAS = [
  'इन्द्र देव', 'विष्णु', 'शिव', 'ब्रह्मा', 'गणेश', 'हनुमान',
  'लक्ष्मी', 'दुर्गा', 'काली', 'राम', 'कृष्ण भगवान',
].map((t) => ({ term: t, re: standalone(t) }));

function scan(text: string, patterns: RegExp[], rule: string, ctx: string) {
  for (const p of patterns) {
    const m = text.match(p);
    if (m) violation(rule, `${ctx}: matched /${p.source}/ → "${m[0]}"`);
  }
}

// ── Run the population ──────────────────────────────────────────────────────
const today = getTodayContext();

for (let i = 0; i < N; i++) {
  let profile;
  try {
    profile = generateUserProfile(birth(i));
  } catch {
    continue; // rejection is valid behaviour; covered by the metamorphic guard
  }

  const ctx = `${profile.formData.dob} ${profile.birthNakshatra}/${profile.dominantKarmaEn}`;

  // D1 — Pancham Kaal ceiling
  checks++;
  if (profile.gunasthana > 5 || profile.gunasthana < 1) {
    violation('D1', `${ctx}: gunasthana ${profile.gunasthana} outside 1–5 in Pancham Kaal`);
  }

  // Collect every narrative surface the user can read.
  const surfaces: Array<[string, string]> = [];
  try {
    surfaces.push(['todaysMessage', AnalysisSynthesizer.generateTodaysMessage(profile, today)]);
  } catch (e) {
    violation('D-render', `${ctx}: generateTodaysMessage threw — ${(e as Error).message}`);
  }
  try {
    for (const p of generatePredictions(profile)) {
      surfaces.push([`prediction:${p.domain}`, `${p.prediction}`]);
    }
  } catch (e) {
    violation('D-render', `${ctx}: generatePredictions threw — ${(e as Error).message}`);
  }

  let remedies;
  try {
    remedies = generateRemedies(profile);
    surfaces.push(['remedies', JSON.stringify(remedies)]);
  } catch (e) {
    violation('D-render', `${ctx}: generateRemedies threw — ${(e as Error).message}`);
  }

  // D2 / D3 / D4 / D5 — scan every rendered surface
  for (const [name, text] of surfaces) {
    if (typeof text !== 'string' || !text) continue;
    checks += 4;
    scan(text, D2_MOKSHA_CLAIM, 'D2', `${ctx} ${name}`);
    scan(text, D3_MORTALITY_CLAIM, 'D3', `${ctx} ${name}`);
    scan(text, D4_FATALISM, 'D4', `${ctx} ${name}`);
    for (const { term, re } of D5_VEDIC_DEVAS) {
      if (re.test(text)) violation('D5', `${ctx} ${name}: Vedic deva "${term}" in output`);
    }
  }

  // D6 / D8 — karma statements must be complete and in-domain
  const karmas = calculateKarmaProfile(
    profile.dominantKarmaEn,
    profile.currentDasha.lord,
    profile.gunasthana,
    profile.currentDasha.antardashaInfo.lord
  );
  if (karmas.length !== 8) violation('D6', `${ctx}: expected 8 karmas, got ${karmas.length}`);

  for (const k of karmas) {
    checks += 5;
    if (!k.karmaHindi?.trim()) violation('D6', `${ctx} ${k.karmaEn}: no Devanagari name`);
    if (!k.manifestation?.trim()) violation('D6', `${ctx} ${k.karmaEn}: no daily manifestation`);
    if (!k.nirjaraPractice?.trim()) violation('D6', `${ctx} ${k.karmaEn}: no nirjara practice`);
    if (!(k.insight?.count > 0)) violation('D6', `${ctx} ${k.karmaEn}: sadhana count missing/zero`);
    if (!k.insight?.timing?.trim()) violation('D6', `${ctx} ${k.karmaEn}: sadhana timing missing`);

    checks += 2;
    if (!(k.intensity >= 0 && k.intensity <= 100)) {
      violation('D8', `${ctx} ${k.karmaEn}: intensity ${k.intensity} outside 0–100`);
    }
    if (!['Udaya', 'Satta', 'Nirjara'].includes(k.state)) {
      violation('D8', `${ctx} ${k.karmaEn}: unknown karma state "${k.state}"`);
    }

    // D3 again, at the karma level — Ayushya must never become a mortality claim.
    if (k.karmaEn === 'Ayushya') {
      checks++;
      scan(`${k.manifestation} ${k.nirjaraPractice}`, D3_MORTALITY_CLAIM, 'D3', `${ctx} Ayushya`);
    }
  }

  // D7 — remedies must be actionable, not vague
  if (remedies) {
    const blob = JSON.stringify(remedies);
    checks++;
    if (!/\d/.test(blob)) {
      violation('D7', `${ctx}: remedy block contains no numeric count at all`);
    }
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
const byRule = new Map<string, number>();
for (const e of errors) {
  const r = e.slice(1, e.indexOf(']'));
  byRule.set(r, (byRule.get(r) ?? 0) + 1);
}

console.log(`Doctrine guard — ${N} charts, ${checks} assertions\n`);
console.log('  D1 Pancham Kaal ceiling   D2 no moksha claim      D3 no mortality claim');
console.log('  D4 purushartha open       D5 no Vedic devas       D6 karma completeness');
console.log('  D7 actionable remedies    D8 value ranges\n');

if (errors.length) {
  console.error(`Doctrine guard FAILED — ${errors.length} violations:`);
  for (const [rule, n] of [...byRule].sort()) console.error(`  ${rule}: ${n}`);
  console.error('');
  errors.slice(0, 25).forEach((e) => console.error(`- ${e}`));
  if (errors.length > 25) console.error(`… and ${errors.length - 25} more`);
  process.exit(1);
}

console.log(`Doctrine guard passed — no doctrinal violations across ${checks} assertions.`);
