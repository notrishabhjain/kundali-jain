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
    note: 'two independent sources; adjacent nakshatras, the shape of a transcription slip',
  },
  19: {
    engine: 'Purva Ashadha',
    published: 'Ashvini',
    note: 'one source, at Mithilapuri; note #21 Naminatha is independently confirmed as Ashvini, so a Malli/Nami confusion in the source cannot be excluded',
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
      `CLAUDE.md states "Tirthankar nakshatras = param_shubha", but ${violating.length} of ${hosting.length} ` +
        `nakshatras hosting a Tirthankara birth are classified otherwise: ` +
        violating.map((n) => `${n.name}=${n.nature}`).join(', ')
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
