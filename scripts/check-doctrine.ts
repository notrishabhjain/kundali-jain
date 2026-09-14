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
//   D9 Gunasthana provenance     — a chart alone may not claim the soul's stage
//   D10 Ladder is reachable      — self-assessment spans stages; only the two
//                                  Sarvarthasiddhi gates may pin the result
//   D11 Two-claim separation     — Tirthankara-birth sanctity and the Sanjna
//                                  muhurta grade are independent; neither may be
//                                  derived from, nor silently overwrite, the other
//   D12 Grahas stay nimitta      — planetary positions are indicative, never
//                                  causal; no graha may be given agency, and a
//                                  position may never become a prediction
//
// A violation here is a doctrinal defect, not a style nit: it means the app
// could tell a Jain user something the tradition holds to be false.

import { generateUserProfile, AnalysisSynthesizer, BirthFormData, type UserProfile } from '../src/lib/analysisSynthesizer';
import { getTodayContext } from '../src/lib/analysisSynthesizer';
import { generatePredictions } from '../src/lib/predictionEngine';
import { generateRemedies } from '../src/lib/remedyEngine';
import { readFileSync } from 'node:fs';
import { calculateKarmaProfile } from '../src/lib/karmaEngine';
import {
  NAKSHATRAS, SANJNA_CLASS, getSanjnaHindi,
  isTirthankaraHost, getBirthSanctity, describeNakshatraStanding,
  getDivergentStandingNakshatras
} from '../src/data/nakshatras';
import {
  estimateGunasthanaWithConfidence,
  classifyGunasthana,
} from '../src/lib/gunasthanaClassifier';

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

  // D11g — both nakshatra claims must survive all the way into the profile the
  // user actually reads. A field that exists in the data but never reaches the
  // output is the same defect as not having it.
  checks++;
  if (!profile.nakshatraStanding || profile.nakshatraStanding.length < 20) {
    violation('D11', `${ctx}: nakshatraStanding missing or truncated in the generated profile`);
  }
  checks++;
  if (profile.nakshatraBirthSanctity !== 'param_shubha_by_birth' && profile.nakshatraBirthSanctity !== 'none') {
    violation('D11', `${ctx}: nakshatraBirthSanctity="${profile.nakshatraBirthSanctity}" is not one of the two permitted values`);
  }

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

// ── D9 / D10: gunasthana determinancy ───────────────────────────────────────
// Gunasthana is fixed by the udaya of darshana-mohaniya and by the kashaya
// intensity-tier — inner facts, not sky positions. These rules assert that the
// engine never lets a chart alone claim more than it can know, and that the
// self-assessment path genuinely spans the ladder.
//
// Regression context: the dasha lord once forced stage 1 for 100% of charts in
// a Mohaniya or Antaraya mahadasha (51% of the population), which both conflated
// "this karma is fruiting" with "the passions are at anantanubandhi tier" and
// made stage 4 — right belief held while karma is active — unreachable.
{
  // D9a — the dasha lord must not move a chart-only gunasthana. Which karma is
  // in udaya is a timing fact and carries no information about the soul's tier.
  for (const nature of ['param_shubha', 'shubha', 'mishra', 'ashubha']) {
    const byLord = new Set<number>();
    for (const lord of ['Mohaniya', 'Antaraya', 'Gyanavaraniya', 'Darshanavaraniya', 'Vedaniya', 'Naam', 'Gotra', 'Ayushya']) {
      byLord.add(estimateGunasthanaWithConfidence(nature, lord).gunasthana);
      checks++;
    }
    if (byLord.size > 1) {
      violation(
        'D9',
        `nakshatra ${nature}: dasha lord changes chart-only gunasthana across {${[...byLord].join(',')}} — udaya timing must not determine the soul's stage`
      );
    }
  }

  // D9b — a chart-only figure must always be labelled an estimate.
  for (const nature of ['param_shubha', 'ashubha']) {
    const e = estimateGunasthanaWithConfidence(nature, 'Mohaniya');
    checks++;
    if (e.confidence !== 'estimated') {
      violation('D9', `chart-only gunasthana for ${nature} claimed confidence "${e.confidence}"`);
    }
    checks++;
    if (e.selfAssessedAxes.length !== 0) {
      violation('D9', `chart-only gunasthana reported self-assessed axes: ${e.selfAssessedAxes.join(',')}`);
    }
  }

  // D9c — a full questionnaire must be labelled self-assessed and must win.
  {
    const e = estimateGunasthanaWithConfidence('ashubha', 'Mohaniya', {
      mithyatva: 0,
      avirati: 1,
      kashayaLevel: 2,
    });
    checks++;
    if (e.confidence !== 'self-assessed') {
      violation('D9', `full questionnaire reported confidence "${e.confidence}"`);
    }
    checks++;
    if (e.gunasthana !== 5) {
      violation(
        'D9',
        `questionnaire (samyak-darshan + anuvrata) gave stage ${e.gunasthana}, expected 5 — chart signals appear to be overriding self-assessment`
      );
    }
  }

  // D10 — the self-assessment path must span the ladder, and no axis may pin
  // the result EXCEPT the two doctrinal gates: entrenched mithyatva and
  // anantanubandhi kashaya both bar stages 4 and above (Sarvarthasiddhi §9.1).
  {
    const reachable = new Set<number>();
    const perAxisOutputs: Record<string, Map<number, Set<number>>> = {
      mithyatva: new Map(),
      avirati: new Map(),
      kashayaLevel: new Map(),
    };
    for (let m = 0; m <= 3; m++) {
      for (let a = 0; a <= 2; a++) {
        for (let k = 0; k <= 3; k++) {
          const g = classifyGunasthana({ mithyatva: m as 0 | 1 | 2 | 3, avirati: a as 0 | 1 | 2, kashayaLevel: k as 0 | 1 | 2 | 3 });
          reachable.add(g);
          for (const [axis, v] of [['mithyatva', m], ['avirati', a], ['kashayaLevel', k]] as const) {
            if (!perAxisOutputs[axis].has(v)) perAxisOutputs[axis].set(v, new Set());
            perAxisOutputs[axis].get(v)!.add(g);
          }
        }
      }
    }
    checks++;
    if (reachable.size < 5) {
      violation('D10', `self-assessment reaches only ${reachable.size} distinct stages {${[...reachable].sort((x, y) => x - y).join(',')}}, expected ≥5`);
    }

    const DOCTRINAL_GATES = new Set(['mithyatva=3', 'kashayaLevel=3']);
    for (const [axis, byValue] of Object.entries(perAxisOutputs)) {
      for (const [v, outs] of byValue) {
        checks++;
        if (outs.size === 1 && !DOCTRINAL_GATES.has(`${axis}=${v}`)) {
          violation(
            'D10',
            `${axis}=${v} pins gunasthana to ${[...outs][0]} regardless of the other two axes — only the Sarvarthasiddhi gates may do that`
          );
        }
      }
    }
  }
}

// ── D11 — the two nakshatra claims must stay independent ────────────────────
// Decision of 2026-09-14: `nature` is a Sanjna-derived muhurta grade, and
// Tirthankara-birth sanctity is a separate fact about sacred history. The two
// were previously conflated, so a Bharani birth — hosting शान्तिनाथ — was told it
// had "अशुभ आध्यात्मिक क्षमता".
//
// This guard fails if either claim is recomputed from the other, if a divergent
// nakshatra stops reporting both facts, or if `nature` drifts off its own
// documented derivation.
// Source: MP-§C1 (Sanjna classification) and MP-§C2 (Tirthankara birth
// nakshatras) — two distinct blocks making two distinct claims.
{
  const BENEFIC = new Set(['Dhruva', 'Char', 'Kshipra', 'Mridu']);
  const divergent = getDivergentStandingNakshatras();

  // D11a — the split must not become empty. If every Tirthankara-hosting star
  // were benefic, the two claims would be observationally identical and someone
  // could collapse them again without a single test noticing.
  checks++;
  if (divergent.length === 0) {
    violation('D11', 'no nakshatra now pairs Tirthankara-birth sanctity with a non-benefic Sanjna — the two claims have become indistinguishable, so their separation is no longer tested by anything');
  }

  // D11b — the seven known divergent stars must still diverge.
  const EXPECTED_DIVERGENT = ['Bharani', 'Krittika', 'Magha', 'Vishakha', 'Mula', 'Purva Ashadha', 'Purva Bhadrapada'];
  const actual = new Set(divergent.map((n) => n.name));
  for (const name of EXPECTED_DIVERGENT) {
    checks++;
    if (!actual.has(name)) {
      violation('D11', `${name} hosts a Tirthankara birth under a non-benefic Sanjna but no longer reports as divergent — check whether nature was merged into the sanctity claim`);
    }
  }

  for (const n of NAKSHATRAS) {
    const host = isTirthankaraHost(n);
    const benefic = BENEFIC.has(SANJNA_CLASS[n.index]);
    const sanctity = getBirthSanctity(n);
    const standing = describeNakshatraStanding(n);

    // D11c — sanctity tracks tirthankaras_born and nothing else.
    checks++;
    if ((sanctity === 'param_shubha_by_birth') !== host) {
      violation('D11', `${n.name}: birth sanctity disagrees with tirthankaras_born — sanctity must be read off sacred history alone`);
    }

    // D11d — sanctity must not be a rename of nature.
    checks++;
    if (host && !benefic && n.nature === 'param_shubha') {
      violation('D11', `${n.name}: non-benefic Sanjna (${SANJNA_CLASS[n.index]}) yet nature=param_shubha — the muhurta grade has been overwritten by the sanctity claim`);
    }

    // D11e — nature must still follow its own documented derivation.
    checks++;
    const expectedNature = !benefic
      ? (SANJNA_CLASS[n.index] === 'Mishra' ? 'mishra' : 'ashubha')
      : (host ? 'param_shubha' : 'shubha');
    if (n.nature !== expectedNature) {
      violation('D11', `${n.name}: nature=${n.nature} but the documented Sanjna derivation gives ${expectedNature} (Sanjna ${SANJNA_CLASS[n.index]}, tirthankara-host=${host})`);
    }

    // D11f — a divergent star must state BOTH facts, never quietly drop one.
    if (host && !benefic) {
      checks++;
      const namesTirthankara = n.tirthankaras_born.some((t) => standing.includes(t.split(' (')[0]));
      if (!namesTirthankara) {
        violation('D11', `${n.name}: standing text omits the Tirthankara(s) born there`);
      }
      checks++;
      if (!standing.includes(getSanjnaHindi(SANJNA_CLASS[n.index]))) {
        violation('D11', `${n.name}: standing text omits the Sanjna muhurta grade`);
      }
    }
  }
}

// ── D12 — grahas are nimitta, never causal ─────────────────────────────────
// Adding planetary positions is the single largest doctrinal exposure in this
// engine, because a graha table is exactly the surface on which Vedic causal
// astrology normally gets built. CLAUDE.md rule 1 and grahas.ts are explicit:
// the grahas are Jyotishi Devs and they INDICATE a karma already bound; they do
// not produce one. This guard is the tripwire for that line being crossed.
// Source: TLP-1 ch. 7; CLAUDE.md rule 1; Codex G2-C1.
{
  const chartsWithGrahas: UserProfile[] = [];
  for (let i = 0; i < 120; i++) {
    try { chartsWithGrahas.push(generateUserProfile(birth(i))); } catch { /* covered elsewhere */ }
  }

  // D12a — the positions must actually be computed, or the whole feature is
  // decorative and the rest of this rule tests nothing.
  const withChart = chartsWithGrahas.filter((p) => p.grahaChart);
  checks++;
  if (withChart.length === 0) {
    violation('D12', 'no generated chart carries grahaChart — planetary positions are not reaching the profile at all');
  }

  for (const p of withChart) {
    const gc = p.grahaChart!;
    const ctx = `${p.formData.dob}`;

    // D12b — nine grahas, no more and no fewer.
    checks++;
    if (gc.grahas.length !== 9) {
      violation('D12', `${ctx}: ${gc.grahas.length} grahas, expected exactly 9`);
    }

    // D12c — every position must be a real number in range. A NaN here would
    // propagate silently into a rashi index of NaN and render as blank.
    for (const g of gc.grahas) {
      checks++;
      if (!Number.isFinite(g.siderealLongitude) || g.siderealLongitude < 0 || g.siderealLongitude >= 360) {
        violation('D12', `${ctx}: ${g.key} longitude ${g.siderealLongitude} out of [0,360)`);
      }
      checks++;
      if (g.rashiIndex < 0 || g.rashiIndex > 11 || g.nakshatraIndex < 0 || g.nakshatraIndex > 26 || g.pada < 1 || g.pada > 4) {
        violation('D12', `${ctx}: ${g.key} indices out of domain (rashi ${g.rashiIndex}, nak ${g.nakshatraIndex}, pada ${g.pada})`);
      }
    }

    // D12d — Rahu and Ketu are one axis. If they ever drift apart, the node
    // derivation has been broken.
    const rahu = gc.grahas.find((g) => g.key === 'Rahu');
    const ketu = gc.grahas.find((g) => g.key === 'Ketu');
    checks++;
    if (rahu && ketu) {
      // This helper returns 0 for conjunction and 180 for opposition, so the
      // test is against 180, not against 0. (It was written against 0 first and
      // failed all 120 charts while reporting "180.000000 deg from opposition",
      // which is the message telling you the comparison is the bug.)
      const d = Math.abs(((rahu.siderealLongitude - ketu.siderealLongitude) + 540) % 360 - 180);
      if (Math.abs(d - 180) > 1e-6) {
        violation('D12', `${ctx}: Rahu and Ketu are ${d.toFixed(6)} deg from opposition, must be exactly 180`);
      }
    }

    // D12e — bhava assignment must be consistent with the lagna. A graha's bhava
    // is a pure function of its rashi and the lagna's rashi under whole-sign, so
    // any disagreement means one of the two was computed from stale state.
    for (const g of gc.grahas) {
      checks++;
      const expected = ((g.rashiIndex - gc.bhava.lagnaRashiIndex + 12) % 12) + 1;
      if (gc.bhava.grahaBhava[g.key] !== expected) {
        violation('D12', `${ctx}: ${g.key} in bhava ${gc.bhava.grahaBhava[g.key]}, whole-sign gives ${expected}`);
      }
    }

    // D12f — the twelve bhavas must be twelve distinct consecutive rashis.
    checks++;
    if (new Set(gc.bhava.houses).size !== 12) {
      violation('D12', `${ctx}: bhava houses are not 12 distinct rashis`);
    }
  }

  // D12g — NO PREDICTION FROM A POSITION. The rendered graha surface must not
  // contain causal or fatalistic language about what a graha will do. This is
  // the rule that actually keeps the feature Jain rather than Vedic.
  //
  // The patterns below are causal-verb constructions ("the graha WILL GIVE",
  // "BECAUSE OF the graha"), not mere mentions of a graha.
  const CAUSAL = [
    /ग्रह\s*\S*\s*(देगा|देंगे|देती\s*है|कराएगा|कराएंगे)/,
    /(के\s*कारण|की\s*वजह\s*से)\s*\S*\s*(ग्रह|राशि|भाव)/,
    /(ग्रह|राशि|भाव)\s*\S*\s*(के\s*कारण|की\s*वजह\s*से)/,
    /(मंगल|शनि|राहु|केतु|गुरु|शुक्र|बुध)\s*(दोष|पीड़ा)\s*(देगा|देता\s*है)/,
    /रत्न\s*(धारण|पहन)/,
  ];
  const grahaSurface = readFileSync('src/components/GrahaChart.tsx', 'utf8');
  for (const re of CAUSAL) {
    checks++;
    const m = grahaSurface.match(re);
    if (m) {
      violation('D12', `GrahaChart.tsx asserts a graha as CAUSE, not nimitta: "${m[0]}"`);
    }
  }

  // D12h — the nimitta frame must be present on the surface that shows the
  // positions. Stating it in a source comment is not enough; the user has to
  // read it.
  checks++;
  if (!grahaSurface.includes('निमित्त')) {
    violation('D12', 'GrahaChart.tsx does not state the nimitta frame to the user — positions must never be shown bare');
  }
  checks++;
  if (!grahaSurface.includes('ज्योतिषी देव')) {
    violation('D12', 'GrahaChart.tsx does not identify the grahas as Jyotishi Devs (CLAUDE.md rule 1)');
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
console.log('  D7 actionable remedies    D8 value ranges         D9 gunasthana provenance');
console.log('  D10 ladder reachable      D11 two-claim separation  D12 grahas stay nimitta\n');

if (errors.length) {
  console.error(`Doctrine guard FAILED — ${errors.length} violations:`);
  for (const [rule, n] of [...byRule].sort()) console.error(`  ${rule}: ${n}`);
  console.error('');
  errors.slice(0, 25).forEach((e) => console.error(`- ${e}`));
  if (errors.length > 25) console.error(`… and ${errors.length - 25} more`);
  process.exit(1);
}

console.log(`Doctrine guard passed — no doctrinal violations across ${checks} assertions.`);
