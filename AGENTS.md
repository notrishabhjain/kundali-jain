# Digambar Jain Jyotish Kundali — AGENTS.md

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
4. **Tirthankar nakshatras** = param_shubha. Nakshatra nature: param_shubha > shubha > mishra > ashubha
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
