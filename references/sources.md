# Jain Jyotish Source Manifest

This directory is the **single source of truth** for the Digambar Jain doctrinal data
that grounds the Kundali Engine. Every rule, constant, narrative line, and prediction
in `src/engine/*` and `android/.../domain/engine/*` must trace back to a citation here.

## How to use this manifest

- When writing engine logic that asserts a Jain doctrinal point, **add a comment with
  the source row id from the table below** (e.g. `// Source: TLP-1 §...`).
- If the doctrine you need isn't in any source here yet, mark the code with
  `// [REQUIRES_RESEARCH] <what's missing>` per the Codex Master Prompt's C4 rule —
  never invent.
- Every source PDF lives in the shared Drive folder
  [Kundali reference](https://drive.google.com/drive/folders/1G_isWlwv0THph069_M2Tpo305BCaOwco).
  Use the Drive ID column to fetch a specific file.

## OCR status legend

| Status | Meaning |
| :-: | --- |
| `ocr` | PDF has a usable text layer; readable directly. |
| `scanned` | Scanned PDF with no OCR layer; needs OCR run before citation. |
| `partial` | OCR present but unreliable (Gujarati/Hindi script with low fidelity). |
| `unknown` | Not yet probed. |

## Catalog

### Primary canonical texts (Digambar Agam + classical works)

| Source id | Title | Drive id | Size | OCR | Feeds engine modules |
| :-: | --- | --- | :-: | :-: | --- |
| TLP-1 | Tiloyapannatti (तिलोयपण्णत्ती) — Vol 1 | `1w6cDJt_DoGUgPimjYxYNBgCh_qVKOpk_` | 15 MB | scanned | cosmology, jyotishi-dev counts, dvipa-lokas, planetary system |
| TLP-2 | Tiloyapannatti Part 2 | `1oYAyEc28Nm26w6MSPxPIM5rX1D-KGdj1` | 35 MB | scanned | cosmology continued |
| TLP-3 | Tiloyapannatti Vol 3 (AC7132) | `1HZ6_DB6fvHvE-ciIALiuj1ptFQjsSsLJ` | 33 MB | scanned | cosmology, time-cycle (aras) |
| TLP-T | Tiloyapannatti — text ed. (486682) | `1qGtmOmH2RxSyRU3yqvF4k10yAAgy5uk2` | 59 MB | scanned | full text, all parts |
| TLP-1943 | Tiloyapannatti Part-i No-1 (1943) | `1DHzfqAB6-YFfV3CjJqVYO9nWFUw5E8xq` | 59 MB | scanned | older edition of vol 1 |
| TRK | Trilokasara (त्रिलोकसार) | `1-2kPaQvuYUZUJcYYFRZ_2gVB6sqBiksI` | 33 MB | scanned | cosmology, time-cycle, jiva-types |
| SKD | Shatkhandagama (षट्खण्डागम) | `1y7QrlApeXMv35hNbvbI4uhqHSrRVmY8o` | 61 MB | scanned | **8-karma theory (foundation)**, karma siddhanta, udaya/satta/nirjara |
| CPS | Chandra Pragnapati + Surya Pragnapati (Agam 16+17) | `1KBbLomzN0JHCt1nVyAKwnTxusvpbPvBe` | 19 MB | scanned | sun/moon motion, tithi/nakshatra calculation, panchang |
| GSS-1 | Ganita Sara Sangraha — Mahaviracharya — Hindi tr. | `1Pkj1AvT5pSIrtQusUtFli1l3GSdjVs1v` | 42 MB | scanned | Jain mathematics, planetary arithmetic |
| GSS-2 | Ganita Sara Sangraha — alt. high-res ed. | `1teXN0zXRfpCjlRTlYyu3yc4eR_a71_fH` | 35 MB | scanned | same |

### Survey & commentary works

| Source id | Title | Drive id | Size | OCR | Feeds engine modules |
| :-: | --- | --- | :-: | :-: | --- |
| JJSD | Jain Jyotish Sahitya: Ek Drushti | `1hN020yqNmnEKLOT9FFDw3aBulIhvdA7V` | 0.7 MB | scanned | survey of Jain jyotish literature |
| JJPP | Jain Jyotish: Pragati aur Parampara | `127GOAH0K64WS7Q-0Nd1IzLZ6i8iaw8MO` | 1.7 MB | scanned | doctrinal frame of Jain jyotish tradition |
| JSS | Jyotish Sar Sangrah (Manuscript, Ram Narayan Paliyar) | `1mk9NH07yIFCdOK0KpfRP5kZkZFuP9U72` | 110 MB | scanned | classical jyotish synthesis |
| BJ-NCS-1 | Bharatiya Jyotish — Nemi Chandra Shastri (33 MB ed.) | `1GvUo4QOmSRPzyMgNVeoxAbTrUZZSipyb` | 33 MB | scanned | tirthankar nakshatras, kalyanak data, jain calendar |
| BJ-NCS-2 | Bharatiya Jyotish — Nemi Chandra Shastri (46 MB ed.) | `1nMrD9hoaX-Acd2KCnrBh-_jhb0XlG1NJ` | 46 MB | scanned | same, alt. edition |

### Calendar / almanac

| Source id | Title | Drive id | Size | OCR | Feeds engine modules |
| :-: | --- | --- | :-: | :-: | --- |
| CP-1950-2050 | Shatabdi Panchang 1950-2050 (शताब्दी पंचांग) | `1oSEoun2Uc7N-MLlhW4FN1U-JJyytFq_o` | 147 MB | scanned | **tithi/nakshatra ground-truth for any date 1950-2050** — use to validate computed panchang |

### User research compilations

> **Precedence rule (user directive, 2026-07-10):** where a user research report
> contradicts pre-existing app code or the Codex Master Prompt distillation, the
> **report is primary** and the code must follow the report. PARITY-REPORT-2026 is
> the most recent and takes precedence over RESEARCH-REPORT-2025 where they conflict
> (e.g. the Stoka/Lava micro-unit hierarchy).

| Source id | Title | Location | OCR | Feeds engine modules |
| :-: | --- | --- | :-: | --- |
| PARITY-REPORT-2026 | System Architecture and Doctrinal Integration Blueprint for the Unified Jain Kundali Engine | `references/extracted/PARITY-REPORT-2026__unified_engine_blueprint.txt` | ocr | **PRIMARY for:** dasha year allotments (Gyan 15, Darshan 9, Vedaniya 10, Mohaniya 28, Ayushya 4, Naam 12, Gotra 8, Antaraya 14); Tithi Pravāh phase coefficient (Layer 2); Pancham Kāla 1.4× duration modifier on Mohaniya/Antaraya (Layer 3); Meeus Ch. 15 sunrise; true tithi boundary resolution (Kshaya/Vriddhi); Ishtakaal unit hierarchy (Ghati→Pala→Vipala/Prāna→7 Stokas→7 Lavas); rikta-tithi muhurta exclusion + karma scoring; 14 gunasthanas; 12 vratas; 16 kashayas; 6 leshyas; 12 bhavanas; 148 uttara-prakritis; Gunasthana classifier (Sarvarthasiddhi axes); Bhaktamar shlokas 1–24 riddhi/mantra catalog; structured festival schema; enhancer activation; AST narrative composer |
| RESEARCH-REPORT-2025 | Computational Specification and Architectural Core of a Jain Kundali Application | `references/extracted/Research_Report__computational_specification.md` | ocr | Panch Samvay, graha→karma mapping, Ishtakaal formula, Jain sidereal geometry (28 nakshatras, unequal muhurta spans from SP-1), Venus Mandala (6) + Veethi (3) from Bhadrabahu Samhita, Netrarogi Yogas (5), Bhaktamar Stotra remedial matrix (9 shlokas with execution parameters) |
| BKT-1 | Bhaktamar Stotra — Manatunga Acharya (48 shlokas) | Referenced via RESEARCH-REPORT-2025 | partial | `BHAKTAMAR_SHLOKAS` in sadhana.ts + JainCosmologyData.kt. [REQUIRES_RESEARCH] Full verse OCR from canonical printed edition for Sanskrit verification. |
| BDS-1 | Bhadrabahu Samhita | Referenced via RESEARCH-REPORT-2025 | unknown | Venus Mandala system, Saturn-in-Shravana rule, cometary tracking. [REQUIRES_RESEARCH] OCR from printed edition before citation-level implementation. |
| SP-1 | Surya Prajnapti (सूर्य प्रज्ञप्ति) | Referenced via CPS + RESEARCH-REPORT-2025 | scanned | Jain sidereal geometry: 28 nakshatras, Shravana-first ordering, unequal muhurta spans, summer solstice epoch. |
| JP-1 | Jambudvipa Prajnapti (जम्बूद्वीप प्रज्ञप्ति) | Referenced via CPS + RESEARCH-REPORT-2025 | scanned | Jain terrestrial cosmology: Jambudvipa geography, Meru-centred concentric model underlying the sidereal projection; cited alongside SP-1 in `src/data/jainCosmology.ts`. |

### Compendia & misc

| Source id | Title | Drive id | Size | OCR | Notes |
| :-: | --- | --- | :-: | :-: | --- |
| C-7173 | Large compendium 7173.pdf | `1GFmTQUAlh4dO5is3tqJ_W0h25LuGL7k2` | 315 MB | scanned | exact contents unverified |
| C-7173c | Same, compressed | `1Z71Ohdt3QK2jlrSwYHfPIisaolN30wj6` | 159 MB | scanned | same |
| JSM | Jain Samudrika ke Panch Granth | `1hEien9iQDyHVa0rMHMVZcOcDJ63VDkW1` | 8.2 MB | partial | Gujarati OCR; palmistry/body-sign — limited jyotish relevance |
| JEB-2316 | jainebooks.org 2316 | `1sVLxEE3e7PehF2aKL5o1OyUM9N_m9cMl` | 6.7 MB | scanned | needs probe |

## OCR workflow (when needed)

The scanned PDFs above need OCR before any citation can be drawn from them. Recommended:

1. Run `ocrmypdf --language san+hin+eng <input>.pdf <output>.pdf` for Sanskrit + Hindi + English.
2. Extract sections with `pdftotext -layout <output>.pdf <output>.txt`.
3. Save the relevant chapter/verse range as `references/extracted/<source-id>__<topic>.md`
   with a YAML front-matter:
   ```yaml
   ---
   source_id: TLP-1
   title: Tiloyapannatti Vol 1
   pages: 142-158
   topic: jyotishi-dev counts in jambudvipa
   ---
   ```
4. Reference that extracted file from the engine code as
   `// Source: references/extracted/<file>`.

## Doctrinal rules already cited (from the Codex Master Prompt)

The Codex Master Prompt
(`Jain_Kundali_Codex_Master_Prompt`, owner=rjnegd@gmail.com) is itself a curated
distillation of the 131-page knowledge base. Until the canonical books are OCR'd,
that master prompt is the working source for:

- The 4 quality tests (Pandit / Generic / Action / Depth).
- The 5 absolute constraints (Digambar-only, no-false-promises, Pancham-Kaal honesty,
  source-fidelity, extend-not-replace).
- Namokar mantra full Prakrit text + 5-pada → karma mapping.
- Uvasaggaharam Stotra all 5 gathas with karma mapping.
- Siddhachakra (Navadevata) yantra structure + Pratishtha + Navpad Oli.
- Panch Kalyanak Puja arghya mantras (5 templates).
- 6 Aras of Avasarpini (Pancham Kaal = 5th, max 125 yrs lifespan).
- 108-day Navkar Sadhana phase plan.

When citing the master prompt itself, use id `MP-§<section>`
(e.g. `MP-§F1` for the Namokar block).
