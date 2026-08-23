// Back-test guard — compares computed panchang against independently recorded dates.
//
// Unlike the metamorphic and entropy guards, this one uses REAL ground truth:
// dates whose Jain panchang values were recorded by someone other than this
// engine (biographies of Digambar acharyas, published festival calendars,
// Shatabdi Panchang 1950-2050).
//
// Enforcement rule: an entry fails the build ONLY if a human has marked it
// "verified": true in references/golden/panchang-backtest.json. Unverified
// entries are run and their diffs printed, but cannot fail — an expectation
// nobody checked is not evidence, in either direction.
//
// Convention: a day is named for the tithi prevailing at SUNRISE, so the
// harness samples at sunrise rather than noon. (Verified empirically: sampling
// at noon shifts some festival days by one tithi.)

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getJainPanchang } from '../src/lib/calendarEngine';

interface Entry {
  id: string;
  gregorian: string;
  label: string;
  source?: string;
  confidence?: string;
  verified?: boolean;
  sunriseLocal?: string;
  expect: Partial<{ paksha: string; tithiNum: number; masa: string; nakshatra: string }>;
}

const file = join(process.cwd(), 'references/golden/panchang-backtest.json');
const corpus = JSON.parse(readFileSync(file, 'utf8')) as {
  defaults?: { sunriseLocal?: string };
  entries: Entry[];
};

const defaultSunrise = corpus.defaults?.sunriseLocal ?? '06:00';
const errors: string[] = [];
const rows: string[] = [];
let verifiedCount = 0;
let verifiedPass = 0;
let unverifiedMatch = 0;

for (const e of corpus.entries) {
  const sunrise = e.sunriseLocal ?? defaultSunrise;
  const p = getJainPanchang(new Date(`${e.gregorian}T${sunrise}:00`));

  const actual: Record<string, string | number> = {
    paksha: p.paksha,
    tithiNum: p.tithiNum,
    masa: p.masa,
    nakshatra: p.nakshatra,
  };

  const diffs: string[] = [];
  for (const [k, want] of Object.entries(e.expect)) {
    if (want === undefined || want === null) continue;
    if (actual[k] !== want) diffs.push(`${k}: expected ${want}, got ${actual[k]}`);
  }

  const ok = diffs.length === 0;
  const mark = e.verified ? (ok ? 'PASS' : 'FAIL') : ok ? 'match' : 'DIFF ';
  rows.push(
    `  [${mark}] ${e.gregorian}  ${e.label}` +
      (diffs.length ? `\n           ${diffs.join('; ')}` : '')
  );

  if (e.verified) {
    verifiedCount++;
    if (ok) verifiedPass++;
    else errors.push(`${e.id} (${e.gregorian}, ${e.label}) — ${diffs.join('; ')}`);
  } else if (ok) {
    unverifiedMatch++;
  }
}

const unverifiedCount = corpus.entries.length - verifiedCount;

console.log(`Back-test guard — ${corpus.entries.length} entries (sampled at sunrise ${defaultSunrise})\n`);
rows.forEach((r) => console.log(r));

console.log(
  `\n  verified   : ${verifiedPass}/${verifiedCount} passing (enforced)\n` +
    `  unverified : ${unverifiedMatch}/${unverifiedCount} currently agree (informational only)`
);

if (verifiedCount === 0) {
  console.log(
    '\n  NOTE: no entry is marked "verified": true yet, so nothing is enforced.\n' +
      '  Confirm an entry against CP-1950-2050 (Shatabdi Panchang), then set its\n' +
      '  "verified" flag to true to turn it into a hard gate.'
  );
}

if (errors.length) {
  console.error('\nBack-test guard FAILED on verified entries:');
  errors.forEach((e) => console.error(`- ${e}`));
  process.exit(1);
}

console.log('\nBack-test guard passed.');
