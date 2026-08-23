# Jyotish Scope & Provenance Decisions

Records architecture-level DOCTRINE verdicts from the gap-closing research
(`GAP_CLOSING_RESEARCH`, 2026-08-23) so future contributors don't re-litigate
them. Confidence markers follow the research file convention.

## EXCLUDE — never implement (Vedic constructs / doctrinal violations)

| Verdict | Topic | Rationale |
|---|---|---|
| GV.1 **EXCLUDE** | Kundali milan / Ashta-kuta matching | No Agamic basis; partner selection is samskara + dharma based |
| GV.3 **EXCLUDE** | Ashtakavarga, Shadbala | Purely Vedic (BPHS); depends on rashi-lord system violating G2-C1 (zero Vedic mixing) |
| GB.2–GB.8 **EXCLUDE** | Bhava sandhi, divisional charts (Hora/Drekkana/Navamsha/Pranapada/Gulika), lagna computation | Vedic house system absent from Jain jyotish; authentic coordinates = janma nakshatra + Ishtakaal + Jain zodiac projection |

## LIMITED INCLUSION / FOOTNOTE ONLY

| Verdict | Topic | Decision |
|---|---|---|
| GV.2 | Prashnavyakarana | Philosophical karma-inquiry text, NOT a horary manual — do not build a "Jain prashna" module; use only as doctrinal source |
| GV.4 | Gemstones | NOT a remedy: himsa to Prthvikaya beings (Mulachara §5, Ratnakaranda Shravakachara). Footnote added in `RemedyTab.tsx`; engine prescribes mantra+tap+daan+bhavana only |
| GP.1 | 27 Nityayogas | Informational at most; must not drive Jain remedies |

## SYNTHESIZED — engine approximations, keep but label

| Verdict | Topic | Location |
|---|---|---|
| GV.5 | 8-karma dasha year ratios 28:15:14:12:10:9:8:4 | `[SYNTHESIZED]` provenance comment in `dashaEngine.ts` (`JAIN_DASHA_YEARS`); hierarchy justified by Sthiti maxima in `data/karmaSthitiMatrix.ts` |
| GK.3/A5 | Karma intensity → gunasthana thresholds | Internally consistent with Sarvarthasiddhi staging; engine approximation |
| GV.6 | 0–100 intensity scale | Anubhaga-bandha has no numeric weights canonically; scale retained as approximation |

## VERIFIED — now encoded

| Topic | Where |
|---|---|
| GD.6 Karma sthiti bounds (Dhavala) | `src/data/karmaSthitiMatrix.ts` |
| GD.7 Four-fold bandha (Tattvarthasutra ch.8, Samayasara §146) | `src/data/karmaSthitiMatrix.ts` (BANDHA_TYPES) |
| GD.8 Udaya/Udirana/Kshaya mechanics (Gommatsar §14/§22) | `src/data/karmaSthitiMatrix.ts` (KARMA_STATE_TRANSITIONS); udirana cited at the nirjara flip in `karmaEngine.ts` |
| GN.3 Navatara cycle + guidance | `src/lib/navataraEngine.ts`, surfaced in Muhurta tab |
| GP.7 Gandant spans (1 ghati each side = 2 ghatis) | `calendarEngine.getGandantStatus()` |
| GP.8/9 Shad-Ghati parva rule + Kshaya/Vriddhi | `calendarEngine.resolveShadGhatiTithi()`; applied in `analysisSynthesizer.getUpcomingVratDates()` |
| GG.5 Abhijit 11:48–12:12, Brahma muhurta −96 min, Durmuhurta note | `muhurtaEngine.getFixedDailyWindows()`, surfaced in Muhurta tab |
| GA.8 Micro-time ladder | PARITY-REPORT ladder retained in `jainCosmology.ts` (research confirms this over the extraction-library ordering) |
| GR.2 Uvasaggaharam / Kalyanmandira / Namokar counts | Documented here; already referenced by `tirthankaras.ts` stotra fields |
| GR.3–GR.8 Six outer + six inner tapas; sadhana timing rules | Reference for future DharmaMarg enrichment |

## OPEN CONFLICTS — [REQUIRES_RESEARCH] before touching data files

1. **Tirthankar birth tithis/nakshatras** — GAP_CLOSING_RESEARCH GV.7 (TP ch.4)
   conflicts with the Shatabdi Panchang extraction on several entries
   (e.g., Rishabhanath Chaitra K-8 vs K-9; Parshvanath Pausha K-10 vs K-11;
   Adinatha's birth nakshatra listed as Abhijit vs repo's nirvana-nakshatra usage).
   `tirthankaras.ts` / `nakshatras.ts` remain UNCHANGED until TP ch.4 Gathas
   522–1280 are OCR-extracted and cross-checked.
2. **Bhaktamar shlokas 25–44 Sanskrit first-lines** — traditional assignments
   captured in `src/data/bhaktamarTraditionalAssignments.ts`
   (`sanskritVersePending: true`). Promote into `BHAKTAMAR_SHLOKAS` only after
   OCR of a print Digambar edition.
3. **GN.4 exact SP-1 muhurta spans per nakshatra** — current values approximate.
4. **GG.1–GG.4 full gochara rules** (Bhadrabahu Samhita OCR pending).
5. **GP.3–GP.6 Baan / Amrit-Siddha yoga tables** (Shatabdi Panchang extraction).
6. **GS.1–GS.3 SP-1 movement tables** — geometric, need translation pass.
