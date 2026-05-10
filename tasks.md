# TASKS — Jain Kundali App Generation

## Phase 1 — Foundation (Complete First)
- [ ] Read all reference documents listed in CLAUDE.md
- [ ] Analyze existing codebase — list what works vs what needs depth
- [ ] Create KundaliContext.tsx with complete state shape
- [ ] Verify BirthDataForm.tsx has all 5 fields and works

## Phase 2 — Data Layer
- [ ] Populate sadhanaData.ts from sadhana_complete_data.md
- [ ] Populate tirthankaras.ts from tirthankaras_complete_data.ts
- [ ] Populate aras.ts from aras_complete_data.ts
- [ ] Populate nakshatras.ts with Jain mappings (not Vedic deities)
- [ ] Verify no [REQUIRES_RESEARCH] remains in data files

## Phase 3 — Engine Layer
- [x] analysisSynthesizer.ts — narrative text generator
- [x] dashaEngine.ts — 3-layer Jain dasha (NOT Vimshottari)
- [x] karmaEngine.ts — 8 karma udaya/satta/nirjara status
- [x] predictionEngine.ts — 7 life domain predictions
- [x] remedyEngine.ts — dasha-aware + karma-aware recommendations

## Phase 4 — Components (Existing — Add Depth)
- [x] VartamanTab.tsx — Today's Message + Dasha narrative + Karma mandala
- [x] KarmaAshtadal.tsx — 8-petal lotus with interactive panels
- [x] BirthChart tab — Nakshatra portrait (narrative, not list)
- [x] Graha Avastha — narrative per graha, not table

## Phase 5 — New Components
- [x] JaapSadhana.tsx — Full mantra cards with complete Devanagari texts
- [x] YantraSadhana.tsx — Siddhachakra full guide + other yantras
- [x] ViseshPujas.tsx — Panch Kalyanak + Solah Kaaran + Jinabhishek
- [x] TantraSadhana.tsx — 108-day Navkar schedule + intensives
- [x] DharmaMarg.tsx — Mentorship style, 12 vratas, 12-month roadmap
- [x] TirthaYatra.tsx — Digambar pilgrimage planner
- [x] MuhurtaCalculator.tsx — Event-based auspicious timing
- [x] SadhanaDashboard.tsx — Personal practice tracker

## Phase 6 — Integration
- [x] All 7 tabs present in Kundali.tsx
- [x] Priority banner on every tab (today's most important action)
- [x] PrintReport.tsx updated with all sections
- [x] Full navigation flow tested end-to-end

## Quality Gate (Every Phase)
Before marking any task done, verify:
- Addresses 'आप' not generic
- Every karma statement has daily-life manifestation
- Every remedy has count + timing + karma connection
- All Devanagari text is complete
- Nothing from existing codebase was removed