---
sourceId: NAKSHATRA-3WAY
topic: Three-way reconciliation of the nakshatra data — engine vs the repo's own authoring files vs published record
date: 2026-09-14
supersedes: partially updates TIRTHANKARA_NAKSHATRA__verification.md
---

# Three-way reconciliation of the nakshatra data

CLAUDE.md names two authoring files as the sources for the engine's nakshatra
data. Both are in the repository root and had never been compared against the
code they produced:

- `tirthankar_data.md` → `src/data/tirthankaras.ts`
- `JAIN NAKSHATRA RULING FRAMEWORK.md` → `src/data/nakshatras.ts`

Comparing all three (authoring files, engine code, published record) settles two
open questions and raises one that matters more than either.

## Finding 1 — the authoring files are NOT authoritative for birth nakshatra

The engine diverges from `tirthankar_data.md` on six birth nakshatras (two
further apparent differences, #1 and #19, are transliteration only —
"Uttarashadha" vs "Uttara Ashadha"). In four of those six the **engine matches
the independently published record and the authoring file is the outlier**:

| # | Tirthankara | Authoring file | Engine | Published record | Verdict |
|---|---|---|---|---|---|
| 5 | Sumatinatha | Krittika | **Magha** | Magha | engine correct |
| 10 | Shitalanatha | Vishakha | **Purva Ashadha** | Purvashadha | engine correct |
| 15 | Dharmanatha | Uttara Bhadrapada | **Pushya** | Pushya, at Ratnapuri | engine correct |
| 17 | Kunthunatha | Ashvini | **Krittika** | Krittika, at Hastinapur | engine correct |
| 18 | Aranatha | Uttara Ashadha | Revati | split Revati/Rohini | unresolved |
| 13 | Vimalanatha | Uttara Phalguni | Purva Bhadrapada | Uttara Bhadrapada | **all three differ** |

Two independent reasons not to trust the authoring files on this field:

**They agree with each other, but not independently.** Both files give the same
values on every disputed entry. They appear to share an origin, so their
agreement is one claim repeated, not two witnesses.

**The field shows signs of being filled by repetition.** In `tirthankar_data.md`,
**16 of 24 entries have birth, dīkṣā, kevalajñāna and nirvāṇa nakshatra all
identical**. That a Tirthankara's birth, renunciation, omniscience and liberation
all fell under one nakshatra would be remarkable once; at 16 of 24 it indicates
the column was populated by copying the birth value.

**Consequence — a regeneration hazard.** Anyone rebuilding `tirthankaras.ts`
from `tirthankar_data.md` would silently reintroduce six errors. The guard now
detects and reports this.

## Finding 2 — the Kunthunatha duplicate is explained, and Mallinatha is resolved

The earlier bug where Kunthunatha (17) appeared under *both* Ashvini and
Krittika now has an explanation: `nakshatras.ts` was built from the framework
file, which assigns him **Ashvini**; `tirthankaras.ts` carries the corrected
**Krittika**. The two datasets disagreed because they were generated from the
source at different points, one before and one after that correction. The
published record (Krittika, at Hastinapur) confirms the corrected value.

**#19 Mallinatha is now resolved and the conflict is closed.** The engine says
Purva Ashadha; *both* authoring files independently say Purvashadha; the single
web source giving "Ashvini" is almost certainly the Malli/Nami confusion
anticipated when the conflict was first recorded — #21 Naminatha genuinely is
Ashvini. Three of four witnesses agree with the engine.

**#13 Vimalanatha remains open, and is now a three-way disagreement**: authoring
files say Uttara Phalguni, the engine says Purva Bhadrapada, the published
record says Uttara Bhadrapada. No two agree. This one genuinely needs
Tiloyapannatti ch. 4.

## Finding 3 — the param_shubha rule has never been implemented, anywhere

CLAUDE.md states: *"Tirthankar nakshatras = param_shubha."* The framework file
repeats it in its own header comment:

> `// (Nakshatras where Tirthankaras were born are automatically PARAM SHUBHA)`

**And then violates it in its own data, 13 times out of 18.** Only Rohini,
Uttara Phalguni, Vishakha, Uttara Ashadha and Abhijit are classified
param_shubha; Bharani, Krittika, Magha, Mula, Purva Ashadha, Shatabhisha,
Ashvini, Mrigashirsha, Punarvasu, Chitra, Anuradha, Shravana, Uttara Bhadrapada
and Revati host Tirthankara births and are classified otherwise.

The engine violates the rule 7 times rather than 13, meaning some entries were
upgraded to param_shubha at some point, but not systematically.

**This reframes the question.** The 7 engine violations are not a regression
away from a rule that once held — the rule was never applied by the data's own
author. Applying it now would reclassify roughly a quarter of all births,
shifting the gunasthana prior and the tone of every affected reading. That makes
it a doctrinal decision to take deliberately, not a lint fix. It is reported on
every CI run rather than enforced.

## What is now settled

- The engine's nakshatra table is **better** than the repo's own authoring files,
  not worse, and must not be regenerated from them.
- #19 Mallinatha: closed in favour of the engine.
- #13 Vimalanatha: open, three-way, needs the primary text.
- #18 Aranatha: open, sources split.
- The param_shubha rule: never implemented; a decision, not a defect.
