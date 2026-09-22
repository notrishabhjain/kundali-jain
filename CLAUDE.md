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
  lib/astronomy.ts             — single source of astronomical truth (Meeus)
  lib/planets.ts               — 9 grahas (Standish/JPL) + lagna + bhavas
  lib/bhaktamarSelector.ts     — nakshatra-driven shloka selection
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
    GrahaChart.tsx             — 9 grahas + lagna + whole-sign bhavas (positions only)
    PrintReport.tsx            — PDF export wrapper
    FullPrintableReport.tsx    — PDF content
```

## Jain Jyotish Rules (NOT Vedic)
1. **No Vedic devas** — nakshatras are governed by Jyotishi Devs, not Vedic devas.
   **Grahas and lagna are computed** (decision of 2026-09-14). Computing where a
   planet was is astronomy, not Vedic practice, and Jain cosmology has its own
   tradition of it (Surya Prajnapti, Tiloyapannatti ch. 7, Ganita Sara Sangraha).
   What G2-C1 rules out is the interpretive apparatus built on top: Vedic
   deities, planetary causal agency, aspects, yogas, gemstone remedies. So the
   engine reports positions and stops. The grahas are Jyotishi Devs and
   **nimitta** — indicative, never causal: a graha does not cause a karma, it
   marks one already bound. Enforced by `check-doctrine` D12, which fails the
   build if a graha is given agency, if a position becomes a prediction, or if
   the nimitta frame disappears from the surface the user reads.
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

## What this engine may NOT assert (external audit, 15 Sep 2026)

An independent reviewer recomputed a generated chart with Swiss Ephemeris and
audited every claim for a disclosed formula. The astronomy held up; four of the
interpretive outputs did not. These are now permanent constraints:

1. **No karma percentage.** Nothing may render a measured quantity of karma.
   The weights in `karmaEngine.ts` are this engine's own and are marked
   `[REQUIRES_RESEARCH]`; sthiti-bandha is described in sagaropama, never in
   percent. The UI shows a three-value band (प्रमुख / गौण / पृष्ठभूमि) and bar
   widths derive from the band, not the key. Enforced by D13.
2. **Udaya, sattā and nirjarā are not bands of one quantity.** Sattā is the
   condition of being bound — true of all eight, always. Udaya is present
   fruition. Nirjarā is shedding, and is **never** derived from a chart: it is
   what sādhana produces. Enforced by D14.
3. **No gunasthāna from a chart.** Chart-only inference reached nothing but
   stages 2 and 3 — sāsādana and miśra, both transient downfalls from right
   faith. The stage is withheld unless the person self-assesses all three
   Sarvārthasiddhi axes. Enforced by D15.
4. **No guaranteed outcome.** The general doctrine that deva-gati bandha is
   possible in Pancham Kāl is canonical and stays (rule 3). A claim about *this
   person's* gati does not — āyuṣya-karma binds at one moment from the bhāvas of
   that moment, and no calculation reaches it. The same applies to health,
   wealth, career and family: conditional framing only, never the future tense.
   Enforced by D16.

Every constructed layer carries its label: the 8-karma dasha is `sankalita` with
boundary dates marked approximate, and graha/Tirthankara correspondences are
marked प्रयुक्त व्याख्या (applied interpretation), not āgama.

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
