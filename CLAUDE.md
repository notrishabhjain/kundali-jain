# Digambar Jain Jyotish Kundali — CLAUDE.md

## Project Purpose
A production-quality Digambar Jain spiritual kundali app. No generic horoscope — every output is grounded in Jain Agam, karma-siddhanta, and the user's actual birth data.

## Stack
- React 19 + TypeScript + Tailwind CSS v4 + Vite
- No backend, no API calls in production (Gemini key exists but not used)
- State: React Context (KundaliContext) + localStorage persistence
- PDF: jsPDF + html-to-image
- Animations: motion/react (Framer Motion v12)

## Reference Data Files (in Downloads/)
- `tirthankar_data.md` → `src/data/tirthankaras.ts`
- `aras.md` → `src/data/aras.ts`
- `graha.md` → `src/data/grahas.ts`
- `JAIN NAKSHATRA RULING FRAMEWORK.md` → `src/data/nakshatras.ts`
- `jain_sadhana_complete_data.md` → `src/data/sadhana.ts` (Phase 2)

## Canonical doctrinal sources (`references/`)

**`references/sources.md`** is the source-of-truth manifest cataloguing every Digambar
Jain primary text used to ground this engine — Tiloyapannatti, Trilokasara,
Shatkhandagama, Chandra/Surya Pragnapati, Ganita Sara Sangraha, Bharatiya Jyotish,
Shatabdi Panchang 1950-2050, and the Codex Master Prompt distillation.

**Rules for using references in code:**
- Any doctrinal assertion (karma rule, nakshatra-tirthankar mapping, dasha law,
  remedy prescription, mantra text) in `src/engine/*` or
  `android/.../domain/engine/*` MUST carry a citation comment of the form
  `// Source: <source-id> §<section>` (e.g. `// Source: MP-§F1` or
  `// Source: TLP-1 ch. 7`).
- If a required doctrinal point is **not yet** in any catalogued source, mark the
  code with `// [REQUIRES_RESEARCH] <what is missing>` and surface it in the PR
  description. Never invent spiritual data (Codex Master Prompt constraint C4).
- When a new extraction is produced (OCR'd chapter, NotebookLM-saved note,
  pasted Q&A), save it under `references/extracted/<source-id>__<topic>.md`
  with the YAML front-matter shown in `references/sources.md`, then update the
  citation in `sources.md` so it's discoverable.

## Architecture
```
src/
  context/KundaliContext.tsx   — shared state (profile + panchang)
  lib/analysisSynthesizer.ts   — Moon calc, dasha calc, narrative gen
  data/
    nakshatras.ts              — 27+1 nakshatras with Jain framework
    tirthankaras.ts            — 24 tirthankaras, full data
    aras.ts                    — 6 aras of time cycle
    grahas.ts                  — 9 grahas with Jain descriptions
  components/
    BirthDataForm.tsx          — 5 fields: name, dob, time, place, gender
    Kundali.tsx                — 7 tabs container
    VartamanTab.tsx            — Today's message + dasha + karma mandala
    BirthChart.tsx             — Nakshatra portrait
    KarmaAshtadal.tsx          — 8-petal lotus (works well, keep)
    KarmaProfile.tsx           — Karma status dashboard
    RemedyTab.tsx              — 5 sub-tabs of remedies
    DharmaMarg.tsx             — 12 vratas + dharma path
    VratCalendar.tsx           — Panchang calendar
    PrintReport.tsx            — PDF export wrapper
    FullPrintableReport.tsx    — PDF content
```

## Jain Jyotish Rules (NOT Vedic)
1. **No Vedic devas** — nakshatras are governed by Jyotishi Devs, not Vedic devas
2. **8 Karmas** — Gyanavaraniya, Darshanavaraniya, Vedaniya, Mohaniya, Ayushya, Naam, Gotra, Antaraya
3. **Pancham Kaal** — We are in 5th Ara (Dusham). NO MOKSHA POSSIBLE. But Samyak Darshan, punya bandh, and Dev-gati ARE possible.
4. **Two independent nakshatra claims — never merge them.**
   - `nature` is a **muhurta grade** derived from the classical 7-Sanjna
     classification: `ashubha ← Ugra ∪ Tikshna`, `mishra ← Mishra`,
     `param_shubha ← (tirthankara-birth host) ∧ benefic Sanjna {Dhruva, Char,
     Kshipra, Mridu}`, `shubha ← remaining benefic-Sanjna stars`. It answers
     "what does this star favour?" Ordering: param_shubha > shubha > mishra > ashubha.
   - **Tirthankara-birth sanctity** is a separate fact about sacred history,
     exposed by `getBirthSanctity()` / `isTirthankaraHost()`. It answers "was a
     Tirthankara born under this star?" It is read off `tirthankaras_born` alone.

   Seven nakshatras carry Tirthankara-birth sanctity under a non-benefic Sanjna —
   Bharani, Krittika, Magha, Vishakha, Mula, Purva Ashadha, Purva Bhadrapada. Both
   facts are true of them at once, and both must be shown. Collapsing them into one
   enum forces a false choice and loses whichever fact loses the argument; it once
   made the app tell a Bharani birth it had "अशुभ आध्यात्मिक क्षमता" despite the star
   hosting शान्तिनाथ. Enforced by `check-doctrine` D11.
5. **Dasha** — Use Vimshottari (placeholder) in Phase 1; replace with Jain 3-layer dasha in Phase 3
6. **Language** — All UI text in Hindi (Devanagari). Address user as 'आप', never 'तुम'

## Karma Manifestation Rule
Every karma statement MUST include:
- What it is (karma name in Devanagari)
- How it manifests in daily life (specific, not abstract)
- What sadhana reduces it (count + timing)

## Quality Gate (before marking any task done)
- [ ] Addresses 'आप' not generic
- [ ] Every karma statement has daily-life manifestation
- [ ] Every remedy has count + timing + karma connection
- [ ] All Devanagari text is complete (no English placeholders)
- [ ] Nothing from existing codebase was removed

## Key Constants
- Lahiri Ayanamsa: 23.85° (approximate for current epoch)
- Nakshatra span: 13°20' (360°/27)
- Vimshottari cycle: 120 years (Ketu 7, Shukra 20, Surya 6, Chandra 10, Mangal 7, Rahu 18, Guru 16, Shani 19, Budha 17)
- Pancham Kaal began: ~525 BCE; ends ~20,476 CE
