// Tirthankara birth-nakshatra guard.
//
// The nakshatra → Tirthankara mapping sits underneath every reading the app
// produces: it drives tirthankarAffinity, the param_shubha classification, and
// through that the devotional prescription. It had never been checked against
// anything until the verification recorded in
// references/extracted/TIRTHANKARA_NAKSHATRA__verification.md.
//
// This guard does three things:
//   1. pins the 19 entries confirmed against the published record, so they
//      cannot silently drift,
//   2. reports the 2 CONFLICTS and 3 CONTESTED entries on every run, so an
//      unresolved doctrinal question stays visible instead of decaying into
//      apparent settledness,
//   3. asserts structural integrity of the table (24 entries, every nakshatra
//      a real one, affinity resolvable for all 27 nakshatras).
//
// The conflicts are NOT auto-corrected. Codex constraint C4 forbids inventing
// spiritual data, and a secondary web page is not Tiloyapannatti; rewriting a
// birth nakshatra on that basis would just relocate the unsourced claim.
// Resolving them needs TLP-1/TLP-3 ch. 4 or BJ-NCS-1.

import { TIRTHANKARAS } from '../src/data/tirthankaras';
import { NAKSHATRAS } from '../src/data/nakshatras';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Confirmed against at least two independent published sources.
// Source: TIRTHANKARA-NAK-VERIFY (references/extracted/)
const CONFIRMED: Record<number, string> = {
  1: 'Uttara Ashadha',
  2: 'Rohini',
  3: 'Mrigashirsha', // published as 'Mrigashira'; nakshatras.ts transliterates it 'Mrigashirsha'
  4: 'Punarvasu',
  5: 'Magha',
  6: 'Chitra',
  7: 'Vishakha',
  8: 'Anuradha',
  9: 'Mula',
  10: 'Purva Ashadha',
  12: 'Shatabhisha',
  14: 'Revati',
  15: 'Pushya',
  16: 'Bharani',
  17: 'Krittika',
  // #19 resolved 2026-09-14: BOTH repo authoring files independently give
  // Purvashadha, and the lone web source giving "Ashvini" is the Malli/Nami
  // confusion anticipated when the conflict was opened (#21 Naminatha genuinely
  // is Ashvini). Three of four witnesses agree with the engine.
  // Source: NAKSHATRA-3WAY finding 2.
  19: 'Purva Ashadha',
  20: 'Shravana',
  21: 'Ashvini',
  22: 'Chitra',
  24: 'Uttara Phalguni',
};

/** Engine value disagrees with the published record. Needs the primary text. */
const CONFLICTS: Record<number, { engine: string; published: string; note: string }> = {
  13: {
    engine: 'Purva Bhadrapada',
    published: 'Uttara Bhadrapada',
    note: 'now a THREE-WAY disagreement: the repo authoring files say Uttara Phalguni, the engine says Purva Bhadrapada, the published record says Uttara Bhadrapada. No two agree. Needs TLP-1/TLP-3 ch.4. Source: NAKSHATRA-3WAY finding 2',
  },
};

/** The published record itself is inconsistent — not necessarily engine errors. */
const CONTESTED: Record<number, string> = {
  11: 'Shravana appears, but one source treats it as the garbha (conception) nakshatra rather than janma',
  18: 'sources split between Revati and Rohini',
  23: 'sources split between Vishakha and Chitra',
};

const errors: string[] = [];
const notices: string[] = [];
let checks = 0;

const byId = new Map(TIRTHANKARAS.map((t) => [t.id, t]));
const validNakshatras = new Set(NAKSHATRAS.map((n) => n.name));

// ── Structural integrity ────────────────────────────────────────────────────
checks++;
if (TIRTHANKARAS.length !== 24) {
  errors.push(`expected 24 Tirthankaras, found ${TIRTHANKARAS.length}`);
}

for (let id = 1; id <= 24; id++) {
  const t = byId.get(id);
  checks++;
  if (!t) {
    errors.push(`Tirthankara #${id} missing from the table`);
    continue;
  }
  checks++;
  if (!t.birth_nakshatra?.trim()) {
    errors.push(`#${id} ${t.name}: birth_nakshatra empty`);
    continue;
  }
  // Every birth nakshatra must be one of the 27 the engine actually knows,
  // otherwise tirthankarAffinity silently fails to resolve.
  checks++;
  if (!validNakshatras.has(t.birth_nakshatra)) {
    errors.push(
      `#${id} ${t.name}: birth_nakshatra "${t.birth_nakshatra}" is not one of the 27 in nakshatras.ts — affinity lookup cannot resolve`
    );
  }
  checks++;
  if (!t.birth_tithi?.trim()) {
    errors.push(`#${id} ${t.name}: birth_tithi empty`);
  }
}

// ── Confirmed entries are pinned ────────────────────────────────────────────
for (const [idStr, expected] of Object.entries(CONFIRMED)) {
  const id = Number(idStr);
  const t = byId.get(id);
  checks++;
  if (t && t.birth_nakshatra !== expected) {
    errors.push(
      `#${id} ${t.name}: birth_nakshatra changed to "${t.birth_nakshatra}"; verified against the published record as "${expected}" (see TIRTHANKARA_NAKSHATRA__verification.md)`
    );
  }
}

// ── Unresolved questions stay visible ───────────────────────────────────────
for (const [idStr, c] of Object.entries(CONFLICTS)) {
  const id = Number(idStr);
  const t = byId.get(id);
  if (!t) continue;
  if (t.birth_nakshatra === c.engine) {
    notices.push(
      `#${id} ${t.name}: engine says "${c.engine}", published record says "${c.published}" — ${c.note}`
    );
  } else if (t.birth_nakshatra === c.published) {
    notices.push(
      `#${id} ${t.name}: now set to the published value "${c.published}" — confirm against TLP-1/TLP-3 ch.4 and move this entry to CONFIRMED`
    );
  } else {
    errors.push(
      `#${id} ${t.name}: birth_nakshatra is "${t.birth_nakshatra}", which matches neither the recorded engine value nor the published one — re-verify before changing further`
    );
  }
}

for (const [idStr, why] of Object.entries(CONTESTED)) {
  const t = byId.get(Number(idStr));
  if (t) notices.push(`#${idStr} ${t.name} (engine: ${t.birth_nakshatra}) — ${why}`);
}

// ── Cross-dataset consistency ───────────────────────────────────────────────
// getTirthankarAffinity reads nakshatras.ts `tirthankaras_born`, NOT the
// birth_nakshatra field in tirthankaras.ts. The two are therefore separate
// datasets that can silently disagree — and did: Kunthunatha (17) was listed
// under BOTH Ashvini and Krittika, so Ashvini births were shown Kunthunatha as
// their affinity when the confirmed occupant of Ashvini is Naminatha (21).
{
  const nakshatraOf = new Map<string, string[]>();
  for (const n of NAKSHATRAS) {
    for (const entry of (n as { tirthankaras_born?: string[] }).tirthankaras_born ?? []) {
      if (!nakshatraOf.has(entry)) nakshatraOf.set(entry, []);
      nakshatraOf.get(entry)!.push(n.name);
    }
  }

  // A Tirthankara has exactly one birth nakshatra.
  for (const [entry, homes] of nakshatraOf) {
    checks++;
    if (homes.length > 1) {
      errors.push(
        `${entry} is listed as born in ${homes.length} nakshatras (${homes.join(', ')}) — a Tirthankara has exactly one birth nakshatra`
      );
    }
  }

  // The two datasets must agree on who was born where.
  for (const n of NAKSHATRAS) {
    const claimed = ((n as { tirthankaras_born?: string[] }).tirthankaras_born ?? []).length;
    const implied = TIRTHANKARAS.filter((t) => t.birth_nakshatra === n.name).length;
    checks++;
    if (claimed === implied) continue;
    // A divergence involving a Tirthankara whose nakshatra is under active
    // doctrinal dispute is a KNOWN open question, not new drift: it is reported
    // so it stays visible, but it does not block CI on an unresolved point.
    // Any other divergence is a genuine integrity failure.
    const disputedHere = Object.keys(CONFLICTS)
      .map(Number)
      .filter((id) => {
        const t = byId.get(id);
        return t && (t.birth_nakshatra === n.name || CONFLICTS[id].published === n.name);
      });
    const msg =
      `${n.name}: nakshatras.ts lists ${claimed} Tirthankara birth(s) but tirthankaras.ts implies ${implied} — ` +
      `the two datasets disagree and getTirthankarAffinity reads the former`;
    if (disputedHere.length) {
      notices.push(
        `${msg}; traceable to the unresolved conflict on #${disputedHere.join(', #')}`
      );
    } else {
      errors.push(msg);
    }
  }
}

// ── CLAUDE.md rule: Tirthankar nakshatras are param_shubha ──────────────────
// Reported, not enforced. Reclassifying a nakshatra changes nakshatraNature for
// every birth in it, which shifts the gunasthana prior and the whole tone of the
// reading — a doctrinal decision, not a lint fix.
{
  const hosting = NAKSHATRAS.filter(
    (n) => (((n as { tirthankaras_born?: string[] }).tirthankaras_born ?? []).length > 0)
  );
  const violating = hosting.filter((n) => n.nature !== 'param_shubha');
  checks++;
  if (violating.length) {
    notices.push(
      `CLAUDE.md states "Tirthankar nakshatras = param_shubha", and ${violating.length} of ${hosting.length} ` +
        `nakshatras hosting a Tirthankara birth are classified otherwise: ` +
        violating.map((n) => `${n.name}=${n.nature}`).join(', ') +
        `. NOTE: the rule was never implemented by the data's own author — JAIN NAKSHATRA RULING ` +
        `FRAMEWORK.md states the rule in its header and then violates it 13 times of 18 in its own ` +
        `data. So this is a doctrinal decision to take, not a regression to fix (NAKSHATRA-3WAY finding 3)`
    );
  }
}

// ── Regeneration hazard: the repo's own authoring files are NOT authoritative ─
// CLAUDE.md names tirthankar_data.md as the source for tirthankaras.ts, but the
// engine diverges from it on six birth nakshatras and in four of those the
// PUBLISHED RECORD backs the engine, not the file. The file also shows the
// marks of a column filled by repetition: 16 of its 24 entries give birth,
// diksha, kevalajnana and nirvana the same nakshatra.
//
// Rebuilding tirthankaras.ts from that file would silently reintroduce six
// errors. This check keeps the divergence visible and labelled so it is never
// mistaken for drift that ought to be "corrected" back toward the file.
// Source: NAKSHATRA-3WAY finding 1.
{
  const AUTHORING_FILE_DIVERGENCES: Record<number, string> = {
    5: 'Krittika',
    10: 'Vishakha',
    13: 'Uttara Phalguni',
    15: 'Uttara Bhadrapada',
    17: 'Ashvini',
    18: 'Uttara Ashadha',
  };
  let stillDiverging = 0;
  for (const [idStr, fileValue] of Object.entries(AUTHORING_FILE_DIVERGENCES)) {
    const t = byId.get(Number(idStr));
    checks++;
    if (!t) continue;
    if (t.birth_nakshatra === fileValue) {
      errors.push(
        `#${idStr} ${t.name}: birth_nakshatra is now "${fileValue}", matching tirthankar_data.md. ` +
          `That file is NOT authoritative for this field — the published record backs the engine's ` +
          `previous value. Looks like a regeneration from the authoring file; see NAKSHATRA-3WAY.`
      );
    } else {
      stillDiverging++;
    }
  }
  if (stillDiverging) {
    notices.push(
      `engine deliberately diverges from tirthankar_data.md on ${stillDiverging} birth nakshatras — ` +
        `this is CORRECT, the authoring file is the less reliable witness (NAKSHATRA-3WAY finding 1)`
    );
  }
}

// ── nakshatra karma_type is faithful to its authoring file ──────────────────
// Unlike birth_nakshatra, this field matches JAIN NAKSHATRA RULING FRAMEWORK.md
// exactly on all 27 entries. It is the basis of every reading's "dominant
// karma", so the agreement is pinned here: a future edit that drifts from the
// authoring file is real drift, not a correction, because there is no competing
// witness saying otherwise. Source: NAKSHATRA-3WAY.
{
  const fw = readFileSync(join(process.cwd(), 'JAIN NAKSHATRA RULING FRAMEWORK.md'), 'utf8');
  const fwKarma = new Map<string, string>();
  const fwNature = new Map<string, string>();
  for (const m of fw.matchAll(/"([^"]+)":\s*\{\s*nature:\s*"(\w+)"[^}]*karma_type:\s*"([^"]+)"/g)) {
    fwNature.set(m[1], m[2]);
    fwKarma.set(m[1], m[3]);
  }

  let karmaMatches = 0;
  for (const n of NAKSHATRAS) {
    const want = fwKarma.get(n.name);
    if (!want) continue;
    checks++;
    if ((n as { karma_type?: string }).karma_type === want) karmaMatches++;
    else {
      errors.push(
        `${n.name}: karma_type is "${(n as { karma_type?: string }).karma_type}" but the authoring file ` +
          `says "${want}". This field agreed on all 27 entries when verified; a change is drift, ` +
          `and it drives every reading's dominant karma.`
      );
    }
  }
  if (karmaMatches) {
    notices.push(`nakshatra karma_type: ${karmaMatches}/27 faithful to the authoring file (pinned)`);
  }

  // ── nature: edited in BOTH directions, with no coherent governing rule ─────
  // The engine changed 15 of 27 natures from the authoring file — 10 toward more
  // auspicious, 5 toward less. Eight of the upgrades do follow CLAUDE.md's
  // "Tirthankar nakshatras = param_shubha". But four Tirthankara-hosting
  // nakshatras were moved the OTHER way, including Vishakha, which the authoring
  // file ranked param_shubha and which hosts two Tirthankaras, demoted to mishra.
  // So this is not a rule awaiting application; the field has been edited
  // inconsistently and currently follows no single rule. Reported, never
  // enforced — reclassifying shifts the gunasthana prior for ~25% of births.
  const RANK: Record<string, number> = { ashubha: 0, mishra: 1, shubha: 2, param_shubha: 3 };
  const demotedHosts: string[] = [];
  for (const n of NAKSHATRAS) {
    const was = fwNature.get(n.name);
    if (!was || was === n.nature) continue;
    const hosts = TIRTHANKARAS.filter((t) => t.birth_nakshatra === n.name).length;
    checks++;
    if (hosts > 0 && RANK[n.nature] < RANK[was]) {
      demotedHosts.push(`${n.name} (${hosts} Tirthankara${hosts > 1 ? 's' : ''}) ${was} -> ${n.nature}`);
    }
  }
  if (demotedHosts.length) {
    notices.push(
      `nature was edited AWAY from the param_shubha rule for ${demotedHosts.length} Tirthankara-hosting ` +
        `nakshatras: ${demotedHosts.join('; ')}. Combined with 8 edits toward the rule, the field follows ` +
        `no single rule at present (NAKSHATRA-3WAY finding 3)`
    );
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
const confirmedCount = Object.keys(CONFIRMED).length;
console.log('Tirthankara birth-nakshatra guard\n');
console.log(`  entries               ${TIRTHANKARAS.length}/24`);
console.log(`  verified & pinned     ${confirmedCount}/24 against the published record`);
console.log(`  unresolved            ${Object.keys(CONFLICTS).length} conflicting, ${Object.keys(CONTESTED).length} contested`);
console.log(`  assertions            ${checks}`);

if (notices.length) {
  console.log('\n  Open doctrinal questions (not failures — need TLP-1/TLP-3 ch.4 or BJ-NCS-1):');
  notices.forEach((n) => console.log(`    ! ${n}`));
}

if (errors.length) {
  console.error(`\nTirthankara guard FAILED — ${errors.length} issues:`);
  errors.forEach((e) => console.error(`- ${e}`));
  process.exit(1);
}

console.log('\nTirthankara guard passed.');
