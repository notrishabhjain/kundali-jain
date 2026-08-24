// Citation audit — every doctrinal assertion must trace to catalogued literature.
//
// CLAUDE.md requires that any doctrinal assertion in src/engine/* carry a
// citation of the form `// Source: <source-id> §<section>`, and that anything
// not yet attested be marked `[REQUIRES_RESEARCH]` rather than invented
// (Codex Master Prompt constraint C4).
//
// This guard makes that rule mechanical. It:
//   1. reads the source-id manifest from references/sources.md,
//   2. extracts every `// Source:` citation under src/,
//   3. fails on any citation naming an id that looks like a manifest id but is
//      not in the manifest — the failure mode that matters, because a citation
//      to a source that does not exist is worse than no citation at all,
//   4. fails if a file carrying doctrinal vocabulary has no citation at all,
//   5. reports coverage and every open [REQUIRES_RESEARCH] marker.
//
// Prose citations ("Tattvarthasutra ch. 8", "Sarvarthasiddhi §1.1-1.8") are
// accepted: much of the canon is cited by title in the tradition and not every
// text has a manifest id yet. What is NOT accepted is an id-shaped token that
// resolves to nothing.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');

// ── 1. Manifest ─────────────────────────────────────────────────────────────
const manifest = readFileSync(join(ROOT, 'references/sources.md'), 'utf8');
const manifestIds = new Set<string>();
for (const m of manifest.matchAll(/^\|\s*([A-Za-z][A-Za-z0-9._-]*)\s*\|/gm)) {
  const id = m[1];
  if (id !== 'Status' && id !== 'Source') manifestIds.add(id);
}
// Extraction documents under references/extracted/ are citable by their stem.
for (const f of readdirSync(join(ROOT, 'references/extracted'))) {
  manifestIds.add(f.replace(/__.*$/, '').replace(/\.(md|txt)$/, ''));
}
// Distilled documents referenced throughout the engine.
for (const extra of [
  'Master Engineering Specification',
  'Research Report',
  'PARITY-REPORT-2026',
  'GAP_CLOSING_RESEARCH',
  'RESEARCH-REPORT-2025',
  'blueprint',
  'MP',
  'Codex Master Prompt',
]) {
  manifestIds.add(extra);
}

// ── 2. Walk src/ ────────────────────────────────────────────────────────────
function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(p)) out.push(p);
  }
  return out;
}
const files = walk(SRC);

// Vocabulary that marks a file as making doctrinal claims. A file containing
// these but citing nothing is asserting Jain doctrine with no provenance.
const DOCTRINAL_MARKERS = [
  'कर्म', 'गुणस्थान', 'तीर्थंकर', 'नक्षत्र', 'कषाय', 'लेश्या', 'भावना',
  'व्रत', 'निर्जरा', 'मिथ्यात्व', 'सम्यग्दर्शन', 'पंचम काल', 'मोहनीय',
];
// Presentation-only files are exempt: they render values computed elsewhere.
const PRESENTATION_ONLY = /\/(components|context)\//;

// An id-shaped token: uppercase-ish with digits/hyphens, e.g. TLP-1, SKD, BDS-1.
const ID_SHAPED = /\b([A-Z][A-Z0-9]{1,}(?:-[A-Za-z0-9]+)*)\b/g;

// Section references are NOT source ids and must not be judged against the
// manifest. Two forms appear: "§D4" (marked) and a bare short token like "A8"
// or "C3" naming a module inside a cited document. A real manifest id either
// carries a hyphen (TLP-1, BDS-1, CP-1950-2050) or is three or more letters
// (SKD, CPS). A single letter plus digits is always a section.
const isSectionRef = (token: string) =>
  /^[A-Z]{1,2}\d+$/.test(token) ||
  // Codex Master Prompt constraint ids, e.g. G2-C1, G2-C3 — rules, not sources.
  /^G\d+-C\d+$/.test(token);
const stripSections = (text: string) => text.replace(/§\s*[A-Za-z0-9._-]+/g, ' ');
// Words that are id-shaped but are ordinary prose or code vocabulary.
const ID_ALLOWLIST = new Set([
  'UI', 'PDF', 'JSON', 'TS', 'API', 'AST', 'ID', 'UTC', 'TT', 'JDE', 'IST',
  'NOT', 'AND', 'OR', 'THE', 'A', 'I', 'II', 'III', 'IV', 'V', 'VI',
  'C4', 'G2-C1', 'L2', 'L3', 'ELP-2000', 'CE', 'BCE', 'HH', 'MM',
]);

interface Citation {
  file: string;
  line: number;
  text: string;
}

const citations: Citation[] = [];
const requiresResearch: Citation[] = [];
const uncited: string[] = [];
const unknownIds: string[] = [];

for (const file of files) {
  const rel = relative(ROOT, file);
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');

  let fileHasCitation = false;
  lines.forEach((line, i) => {
    // Match "Source:" anywhere inside a // comment, not only immediately after
    // the slashes — provenance is often appended to a sentence, e.g.
    // "// intensified in the 5th Ara. Source: PARITY-REPORT-2026 ...".
    const cite = line.match(/\/\/.*?Sources?:\s*(.+)$/);
    if (cite) {
      fileHasCitation = true;
      const text = cite[1].trim();
      citations.push({ file: rel, line: i + 1, text });

      for (const m of stripSections(text).matchAll(ID_SHAPED)) {
        const token = m[1];
        if (ID_ALLOWLIST.has(token)) continue;
        if (isSectionRef(token)) continue;
        // Judge only tokens shaped like a manifest id: hyphenated, or three or
        // more letters carrying a digit. Bare prose words are not ids.
        const idShaped = token.includes('-') || (/^[A-Z]{3,}/.test(token) && /\d/.test(token));
        if (!idShaped) continue;
        if (!manifestIds.has(token)) {
          unknownIds.push(`${rel}:${i + 1} cites "${token}" — not in references/sources.md`);
        }
      }
    }
    if (line.includes('[REQUIRES_RESEARCH]')) {
      requiresResearch.push({ file: rel, line: i + 1, text: line.trim().slice(0, 120) });
    }
  });

  if (!fileHasCitation && !PRESENTATION_ONLY.test(`/${rel}`)) {
    const markerHits = DOCTRINAL_MARKERS.filter((m) => content.includes(m));
    if (markerHits.length >= 3) {
      uncited.push(`${rel} — doctrinal vocabulary (${markerHits.slice(0, 4).join(', ')}) but no // Source: citation`);
    }
  }
}

// ── 3. Report ───────────────────────────────────────────────────────────────
const engineFiles = files.filter((f) => !PRESENTATION_ONLY.test(`/${relative(ROOT, f)}`));
const citedFiles = new Set(citations.map((c) => c.file));
const engineCited = engineFiles.filter((f) => citedFiles.has(relative(ROOT, f))).length;

console.log('Citation audit — doctrinal provenance under src/\n');
console.log(`  manifest source ids     ${manifestIds.size}`);
console.log(`  citations found         ${citations.length}`);
console.log(`  engine files cited      ${engineCited}/${engineFiles.length} (${((100 * engineCited) / engineFiles.length).toFixed(0)}%)`);
console.log(`  open [REQUIRES_RESEARCH] ${requiresResearch.length}`);

if (requiresResearch.length) {
  console.log('\n  Open research gaps (declared, not invented — this is correct behaviour):');
  for (const r of requiresResearch.slice(0, 15)) {
    console.log(`    ${r.file}:${r.line}`);
  }
  if (requiresResearch.length > 15) console.log(`    … and ${requiresResearch.length - 15} more`);
}

const errors: string[] = [];
if (unknownIds.length) {
  errors.push(...unknownIds.map((u) => `unresolvable citation — ${u}`));
}
if (uncited.length) {
  errors.push(...uncited.map((u) => `uncited doctrinal file — ${u}`));
}

if (errors.length) {
  console.error(`\nCitation audit FAILED — ${errors.length} issues:`);
  errors.slice(0, 30).forEach((e) => console.error(`- ${e}`));
  if (errors.length > 30) console.error(`… and ${errors.length - 30} more`);
  process.exit(1);
}

console.log('\nCitation audit passed — every id-shaped citation resolves, no uncited doctrinal file.');
