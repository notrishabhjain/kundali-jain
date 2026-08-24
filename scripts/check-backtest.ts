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
// Anchoring: each entry declares a vyāpinī rule (see src/lib/tithiAnchor.ts).
// Most parvas are udaya (tithi at real sunrise for the entry's coordinates);
// Dīpāvalī is pradoṣa (just after sunset) and Śarada Pūrṇimā is niśītha
// (midnight). Real sunrise/sunset is computed per entry — no fixed clock time.
// Getting this wrong shifts a festival by exactly one day, which is how the
// first version of this harness mis-scored two rows.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getLunarMonth, MasaScheme } from '../src/lib/calendarEngine';
import { getAnchoredTithi, TithiAnchor } from '../src/lib/tithiAnchor';
import { toJulianDay } from '../src/lib/astronomy';
import { getNakshatraByDegree } from '../src/data/nakshatras';
import { getMoonSiderealLongitude } from '../src/lib/astronomy';

interface Entry {
  id: string;
  gregorian: string;
  label: string;
  source?: string;
  confidence?: string;
  verified?: boolean;
  anchor?: TithiAnchor;
  lat?: number;
  lng?: number;
  scheme?: MasaScheme;
  expect: Partial<{ paksha: string; tithiNum: number; masa: string; nakshatra: string }>;
}

const file = join(process.cwd(), 'references/golden/panchang-backtest.json');
const corpus = JSON.parse(readFileSync(file, 'utf8')) as {
  defaults?: { anchor?: TithiAnchor; lat?: number; lng?: number; utcOffsetHours?: number };
  entries: Entry[];
};

const dflt = corpus.defaults ?? {};
const errors: string[] = [];
const rows: string[] = [];
let verifiedCount = 0;
let verifiedPass = 0;
let unverifiedMatch = 0;

for (const e of corpus.entries) {
  const anchor = e.anchor ?? dflt.anchor ?? 'udaya';
  const lat = e.lat ?? dflt.lat ?? 28.6139;
  const lng = e.lng ?? dflt.lng ?? 77.209;
  const t = getAnchoredTithi(e.gregorian, anchor, lat, lng, dflt.utcOffsetHours ?? 5.5);

  // Month is evaluated at the same anchored instant so a pradoṣa/niśītha entry
  // that rolls past midnight is named from the same moment its tithi came from.
  const wholeDays = Math.floor(t.anchorLocalHour / 24);
  const h = t.anchorLocalHour - wholeDays * 24;
  const jde =
    toJulianDay(
      e.gregorian,
      `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.floor((h % 1) * 60)).padStart(2, '0')}`
    ) + wholeDays;

  const actual: Record<string, string | number> = {
    paksha: t.paksha,
    tithiNum: t.tithiNum,
    masa: getLunarMonth(jde, e.scheme ?? 'purnimanta').name,
    nakshatra: getNakshatraByDegree(getMoonSiderealLongitude(jde)).hindi_name,
  };

  const diffs: string[] = [];
  for (const [k, want] of Object.entries(e.expect)) {
    if (want === undefined || want === null) continue;
    if (actual[k] !== want) diffs.push(`${k}: expected ${want}, got ${actual[k]}`);
  }

  const ok = diffs.length === 0;
  const mark = e.verified ? (ok ? 'PASS' : 'FAIL') : ok ? 'match' : 'DIFF ';
  const hh = Math.floor(t.anchorLocalHour % 24);
  const mm = Math.floor((t.anchorLocalHour % 1) * 60);
  rows.push(
    `  [${mark}] ${e.gregorian}  ${e.label}` +
      `\n           anchor=${anchor} @ ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')} local` +
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

console.log(`Back-test guard — ${corpus.entries.length} entries (per-entry vyāpinī anchor, real sunrise/sunset)\n`);
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
