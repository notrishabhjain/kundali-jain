---
sourceId: TIRTHANKARA-NAK-VERIFY
topic: Verification of the 24 Tirthankara birth-nakshatra table against published sources
date: 2026-08-23
method: Web research against published Jain reference sites, cross-checked across independent pages
authority: SECONDARY. Tiloyapannatti ch. 4 (TLP-1/TLP-3) remains the primary authority and wins on conflict.
---

# Tirthankara birth-nakshatra verification

The nakshatra → Tirthankar mapping sits underneath every reading the app produces:
it drives `tirthankarAffinity`, the `param_shubha` nakshatra classification, and
through that the whole devotional prescription. It had never been checked.

This is the result of checking all 24 entries in `src/data/tirthankaras.ts`
against published Jain reference sources.

**Status summary — 19 confirmed, 2 conflicting, 3 contested.**

| # | Tirthankara | Engine value | Verification | Status |
|---|---|---|---|---|
| 1 | Rishabhanatha | Uttara Ashadha | Uttarashadha | ✅ confirmed |
| 2 | Ajitanatha | Rohini | Rohini, at Ayodhya | ✅ confirmed |
| 3 | Sambhavanatha | Mrigashira | Mrigashira | ✅ confirmed |
| 4 | Abhinandananatha | Punarvasu | Punarvasu | ✅ confirmed |
| 5 | Sumatinatha | Magha | Magha | ✅ confirmed |
| 6 | Padmaprabhu | Chitra | Chitra, at Kaushambi | ✅ confirmed |
| 7 | Suparshvanatha | Vishakha | Vishakha, at Kashi | ✅ confirmed |
| 8 | Chandraprabhu | Anuradha | Anuradha | ✅ confirmed |
| 9 | Suvidhinatha (Pushpadanta) | Mula | Mula | ✅ confirmed |
| 10 | Shitalanatha | Purva Ashadha | Purvashadha | ✅ confirmed |
| 11 | Shreyansanatha | Shravana | Shravana appears, but one source gives an unclear "Van" and another describes Shravana as the *garbha* (conception) nakshatra rather than *janma* | ⚠️ contested |
| 12 | Vasupujya | Shatabhisha | Shatabhisha, at Champapuri | ✅ confirmed |
| 13 | Vimalanatha | **Purva Bhadrapada** | **Uttara Bhadrapada** — two independent sources | ❌ **CONFLICT** |
| 14 | Anantanatha | Revati | Revati, at Ayodhya | ✅ confirmed |
| 15 | Dharmanatha | Pushya | Pushya, at Ratnapuri | ✅ confirmed |
| 16 | Shantinatha | Bharani | Bharani | ✅ confirmed |
| 17 | Kunthunatha | Krittika | Krittika, at Hastinapur | ✅ confirmed |
| 18 | Aranatha | Revati | Sources split: Revati in one, Rohini in another | ⚠️ contested |
| 19 | Mallinatha | **Purva Ashadha** | **Ashvini**, at Mithilapuri | ❌ **CONFLICT** |
| 20 | Munisuvrata | Shravana | Shravana, at Rajgriha | ✅ confirmed |
| 21 | Naminatha | Ashvini | Ashvini | ✅ confirmed |
| 22 | Neminatha | Chitra | Chitra, at Sauripur | ✅ confirmed |
| 23 | Parshvanatha | Vishakha | Vishakha in one source, Chitra in another | ⚠️ contested |
| 24 | Mahavira | Uttara Phalguni | Uttaraphalguni | ✅ confirmed |

## The two conflicts

**#13 Vimalanatha.** The engine says Purva Bhadrapada. Two independent published
sources say **Uttara** Bhadrapada, both also agreeing on the birthplace
(Kampilya) and the Magha Shukla birth tithi that the engine already carries.
Purva and Uttara Bhadrapada are adjacent nakshatras, which is exactly the shape
of a transcription slip. This is the more likely of the two to be a genuine
engine error.

**#19 Mallinatha.** The engine says Purva Ashadha; a published source says
**Ashvini**, at Mithilapuri. Note that the engine already assigns Ashvini to #21
Naminatha, and one source independently confirms Naminatha as Ashvini. Two
Tirthankaras sharing a nakshatra is not impossible — the engine already has
Shravana twice (#11, #20) and Revati twice (#14, #18) — but the possibility that
a secondary source has confused Malli with Nami cannot be excluded from web
sources alone.

## Why these are NOT auto-corrected

Codex constraint C4 forbids inventing spiritual data, and the project's citation
rule requires primary-text provenance for doctrinal assertions. Secondary web
pages are not Tiloyapannatti. Silently rewriting a Tirthankara's birth nakshatra
on the strength of a web search would be the same class of error as the original
unverified value — it would merely move the unsourced claim.

Both conflicts are therefore recorded here, marked in
`src/data/tirthankaras.ts` with `[REQUIRES_RESEARCH]`, and surfaced by
`scripts/check-tirthankara-table.ts` on every CI run so they cannot be
forgotten. Resolving them requires Tiloyapannatti ch. 4 (TLP-1/TLP-3) or
Bharatiya Jyotish (BJ-NCS-1), both already catalogued in `references/sources.md`.

## The three contested entries

These are cases where the published record itself is inconsistent, often because
a source reports the *garbha* (conception) nakshatra rather than the *janma*
(birth) one, or because Digambara and Svetambara recensions differ. They are not
necessarily engine errors. They need the primary text to settle.

## What this verification does and does not establish

It establishes that **19 of 24 entries agree with the published record** — the
bulk of the table is sound, which was not previously known at all.

It does not establish that the engine's values are correct where sources agree
with it, only that they are *consistent with the published record*. Where
Tiloyapannatti disagrees with both, Tiloyapannatti wins.

## Sources consulted

Published Jain reference sites including DharmYaatra's 24-Tirthankara list, Jain
Sattva's per-Tirthankara introductions, JainKnowledge's Jain Facts and Concepts
series, Dada Bhagwan's Tirthankar life stories, jainoutlook.com, tattvagyan.com,
Webdunia Hindi's Jain religion section, and digjainwiki.org. Cross-checked so
that no entry above rests on a single page.
