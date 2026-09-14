// Reachability guard — doctrinal data the app can never actually show.
//
// This engine has repeatedly accumulated carefully-sourced data that nothing
// reads. `ishtakaal` and `jainZodiacProjection` were computed and stored on
// every profile but never rendered; GRAHA_KARMA_MAPPINGS and PANCH_SAMVAY were
// defined and never imported. Each was found by hand, long after it was written.
//
// Dead doctrinal data is worse than absent data: it reads as coverage. A
// reviewer sees 48 Bhaktamar shlokas catalogued and concludes the app can
// prescribe from 48, when the prescription path reaches 8.
//
// This guard makes reachability measurable. It reports, and fails only when a
// dataset is COMPLETELY unreachable — some narrowing is legitimate (a rule that
// genuinely only selects a subset), but a table nothing can reach at all is
// either a wiring bug or data that should not have been written yet.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { generateUserProfile, BirthFormData } from '../src/lib/analysisSynthesizer';
import { generateRemedies } from '../src/lib/remedyEngine';
import { BHAKTAMAR_TRADITIONAL_ASSIGNMENTS } from '../src/data/bhaktamarTraditionalAssignments';

const ROOT = process.cwd();
const errors: string[] = [];
const notices: string[] = [];
let checks = 0;

// ── 1. Exported doctrinal symbols that nothing outside their own file imports ─
{
  function walk(dir: string, out: string[] = []): string[] {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (/\.tsx?$/.test(p)) out.push(p);
    }
    return out;
  }
  const files = walk(join(ROOT, 'src'));
  const contents = new Map(files.map((f) => [f, readFileSync(f, 'utf8')]));

  const dead: string[] = [];
  for (const [file, src] of contents) {
    // Only data modules carry doctrinal tables worth this check.
    if (!/\/src\/data\//.test(file.replace(/\\/g, '/'))) continue;
    for (const m of src.matchAll(/^export (?:const|function) (\w+)/gm)) {
      const sym = m[1];
      // Types and interfaces are structural, not data.
      if (/^[A-Z][a-z]/.test(sym) && !/_/.test(sym)) continue;
      checks++;
      const usedElsewhere = [...contents].some(
        ([f, c]) => f !== file && new RegExp(`\\b${sym}\\b`).test(c)
      );
      if (usedElsewhere) continue;
      // A symbol used inside its own file is NOT dead — it is internal. Count
      // occurrences beyond the single `export const/function` declaration.
      const occurrences = (src.match(new RegExp(`\\b${sym}\\b`, 'g')) ?? []).length;
      if (occurrences > 1) continue;
      dead.push(`${relative(ROOT, file)} :: ${sym}`);
    }
  }
  if (dead.length) {
    notices.push(
      `${dead.length} exported symbol(s) in src/data/ are not imported anywhere else:\n` +
        dead.map((d) => `      ${d}`).join('\n')
    );
  }
}

// ── 2. Bhaktamar prescription reachability ──────────────────────────────────
// The catalogue spans all 48 shlokas across two datasets. What matters is how
// many the personalised path can actually select.
{
  let seed = 424242;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const at = (dob: string): BirthFormData => ({
    fullName: 'x',
    dob,
    time: '10:30',
    place: 'Delhi',
    lat: '28.6139',
    lng: '77.2090',
    gender: 'male',
  });

  const prescribed = new Set<string>();
  const N = 2000;
  for (let i = 0; i < N; i++) {
    const y = 1950 + Math.floor(rand() * 76);
    const mo = 1 + Math.floor(rand() * 12);
    const d = 1 + Math.floor(rand() * 28);
    const dob = `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    try {
      const r = generateRemedies(generateUserProfile(at(dob))) as { bhaktamarShloka?: unknown };
      const v = r.bhaktamarShloka;
      if (typeof v === 'string') {
        const num = v.match(/श्लोक\s*(\d+)/);
        if (num) prescribed.add(num[1]);
      } else if (v && typeof v === 'object') {
        const n = (v as { shlokaNumber?: number }).shlokaNumber;
        if (n !== undefined) prescribed.add(String(n));
      }
    } catch {
      /* rejection is covered by the metamorphic guard */
    }
  }

  checks++;
  if (prescribed.size === 0) {
    errors.push(
      'the remedy engine prescribed no Bhaktamar shloka at all across ' +
        `${N} charts — the prescription path is broken, or this guard's parser is`
    );
  } else {
    notices.push(
      `Bhaktamar: the personalised remedy path reaches ${prescribed.size} of 48 shlokas ` +
        `(${[...prescribed].map(Number).sort((a, b) => a - b).join(', ')}). ` +
        `The remaining ${48 - prescribed.size} are catalogued but cannot be prescribed to anyone.`
    );
  }

  // The traditional-assignment table (shlokas 25-47) was written specifically to
  // fill the gap above 24. If none of its entries can be prescribed, the table
  // is not filling anything.
  checks++;
  const traditionalNums = new Set(BHAKTAMAR_TRADITIONAL_ASSIGNMENTS.map((a) => String(a.shlokaNumber)));
  const traditionalReached = [...prescribed].filter((n) => traditionalNums.has(n));
  if (traditionalReached.length === 0 && prescribed.size > 0) {
    notices.push(
      `Bhaktamar: none of the ${BHAKTAMAR_TRADITIONAL_ASSIGNMENTS.length} traditional assignments ` +
        `(shlokas 25-47) is reachable by the prescription path. The table was added to fill the gap ` +
        `above shloka 24; wiring it in is a doctrinal decision about which shloka answers which karma, ` +
        `so it is reported rather than guessed.`
    );
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
console.log(`Reachability guard — ${checks} checks\n`);
if (notices.length) {
  notices.forEach((n) => console.log(`  ! ${n}`));
}

if (errors.length) {
  console.error(`\nReachability guard FAILED — ${errors.length}:`);
  errors.forEach((e) => console.error(`- ${e}`));
  process.exit(1);
}

console.log('\nReachability guard passed.');
