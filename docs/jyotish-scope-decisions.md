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
| B.1 Ābādha-kāl (100 yr/Sagaropama) + Niṣeka front-loaded decay curve `[INFERRED]` shape | `karmaSthitiMatrix.abadhaKaalYears()` / `nisekaUdayaWeight()` |
| GN.3 Navatara cycle + guidance | `src/lib/navataraEngine.ts`, surfaced in Muhurta tab |
| GP.7 Gandant spans (1 ghati each side = 2 ghatis) | `calendarEngine.getGandantStatus()` |
| GP.8/9 Shad-Ghati parva rule + Kshaya/Vriddhi | `calendarEngine.resolveShadGhatiTithi()`; applied in `analysisSynthesizer.getUpcomingVratDates()` |
| GG.5 Abhijit 11:48–12:12, Brahma muhurta −96 min | `muhurtaEngine.getFixedDailyWindows()`, surfaced in Muhurta tab |
| A.6 Gulika/Durmuhurta via Dinamaan ÷ 8 khandas, lords from Varadipati | `muhurtaEngine.findLordKhanda()` — Saturn khanda = Gulika, Mars khanda = Durmuhurta |
| GA.8 Micro-time ladder | PARITY ladder retained in `jainCosmology.ts` |
| GR.2 Uvasaggaharam / Kalyanmandira / Namokar counts | Documented here; referenced by `tirthankaras.ts` stotra fields |
| GR.3–GR.8 Six outer + six inner tapas; sadhana timing rules | Reference for future DharmaMarg enrichment |
| **GN.4** SP-1 unequal muhurta spans — exact four-class allocation (Mahat 6×45 / Sama 15×30 / Kanishtha 6×15 / Abhijit 9·27/67); **total corrected to 819 + 27/67** | `jainCosmology.JAIN_NAKSHATRAS_ORDERED` + `JAIN_ZODIAC_TOTAL_MUHURTAS` |
| **GN.1** Prashnavyakarana Kula families (12/12/4, Prakrit verse recovered) | `nakshatras.NAKSHATRA_KULA_ASSIGNMENTS` + `getNakshatraKula()` |
| **GP.2** Karana half-tithis incl. Vishti(Bhadra) varjit flag | `calendarEngine.calculateKarana()`; emitted in `JainPanchang`, shown in BirthDataForm live preview |
| **GP.3** Dagdha/Visha/Hutashan vara×tithi matrices | `calendarEngine.VARJIT_YOGAS` + `getVarjitYogas()`; surfaced in BirthDataForm preview |
| **GP.4** Siddha weekday-tithi combos | `calendarEngine.SIDDHA_COMBOS` + `isSiddhaCombo()`; surfaced in BirthDataForm preview |
| **GP.5** Sinivali/Darsha/Kuhu classifier | `calendarEngine.classifyAmavasya()` |
| **GP.6** Panchak zone (latter half of Dhanishtha → Revati end) + prohibitions | `calendarEngine.getPanchakStatus()` |
| **GS.5** Jyotish-Loka belt (790–900 yojanas), body heights, Vimana diameters (Sun 48/61, Moon 56/61 yojana), solstice day-lengths (18/15/12 muhurtas) | `jainCosmology.JYOTISH_LOKA_BELT`, `VIMANA_DIAMETERS_YOJANA`, `SOLSTICE_DAY_NIGHT_MUHURTAS` |

## ARBITRATIONS RECORDED (latest input supersedes earlier research)

1. **Span-class reclassifications:** Shatabhisha & Jyeshtha short(15)→standard(30); Purva Phalguni & Hasta standard(30)→short(15). Both old and new tables self-close; new adopted. (Blueprint §A.1 confirms identical allocation.)
2. **Abhijit span fraction:** 9 + 27/67 (was 9 + 11/67).
3. **Solstice day-length labeling:** longest day (18 M) anchored to outer-path summer solstice, shortest (12 M) to inner-path winter solstice, equinoxes 15/15 — blueprint §A.6 confirms this reading.
4. **GV.7 FULL 24-row sweep applied** (blueprint §A.2): birth nakshatra/tithi corrections across ids 2,3,4,5,8,9,10,11,13,14,15,17,18,19,20,21,22; parent/place fixes (Dharana, Pratishtha, Surasena/Shrimati, Mitra, Vaprila); lifespan-unit fixes ids 11–15 (Purva-era "लाख वर्ष" → canonical year counts); `Mrigashirsha` spelling normalized to `Mrigashira` for lookup integrity.
5. **Nakshatra host-arrays rebuilt** to match the arbitrated births: Krittika→Kunthunath; Pushya→Dharmanath; Magha→Sumatinath; U.Phalguni→Mahavira only; Vishakha drops Sheetalnath; P.Ashadha→Sheetalnath; U.Ashadha→Rishabhanath only; P.Bhadrapada→Vimalnath; Revati adds Aranath; U.Bhadrapada now empty. **Nature/karma_type fields NOT re-audited in this pass** — param_shubha tiers may need a follow-up review against the new host-set.
6. **Venus Mandalas replaced 6→3** (Abhyantara/Madhyama/Bahya per blueprint §A.4); the six-mandala Research-Report stub is retired. Veethis remain `[REQUIRES_RESEARCH]`.
7. **Gochara base-house table added** (`GOCHARA_AUSPICIOUS_HOUSES`, Moon-sign counted) — first Agamic-grounded transit baseline; vedha rules still pending BDS-1 OCR.
8. **Panchak zone start fixed at 296°40'** (blueprint §A.5.C), superseding the mid-Dhanishtha (313°20') reading.
9. **Gandant window arbitration:** retained the motion-derived ±1 ghati (~0.22°) window from GP.7 research over the blueprint's ±10′ in-sign rule; magnitudes are comparable, and the ghati form integrates with Ishtakaal units. Blueprint's UI-warning semantics adopted via `UserProfile.gandantWarning`.

## FINAL SPEC STATUS (ultimate-blueprint resolution round)

The specification layer is now **complete**. Final-round closures:

1. **Solstice path direction — LOCKED:** Innermost Mandala = Summer solstice (18M); Outermost = Winter (12M); Δ = 2/61 muhurta per daily path over 183-day half-transit. `jainCosmology.MANDALA_PATH_PROGRESSION` + corrected arbitration comment on `SOLSTICE_DAY_NIGHT_MUHURTAS`.
2. **Night khanda lord — LOCKED:** Khanda-1 of the night is ruled by the **NEXT day's Varadipati**; implemented in `muhurtaEngine.findNightLordKhanda` (night Gulika + Durmuhurta windows emitted).
3. **10-Solstice Yuga table** — arithmetic chain verified (+6 tithi steps, Shravan↔Magha alternation, paksha auto-flip). Encoded: `calendarEngine.YUGA_SOLSTICE_TABLE`.
4. **Nakshatrodaya derivation:** 1830 civil days + 5 solar years = 1835 (`NAKSHATRODAYA`).
5. **Moon-revolution/bhabhog parts-of-67** + **Yojana/Pramana/Rajju conversions** + **Jyotishi-Dev vitals** encoded in `jainCosmology.ts`.
6. **Bhaktamar 37/39 truncations resolved**; all first-lines for 25–44 now verified in `BHAKTAMAR_VERIFIED_LINES`; graha-target catalog extended (26/31/33/35/40/41) via `BHAKTAMAR_SADHANA_CATALOG_EXTENDED` + `getBhaktamarForGrahaFull`.
7. **Avakahada Chakra COMPLETE** (28 stars, serpentine-nadi rule, rashi-boundary varna/vashya shifts) — coverage flag true.
8. **Sanjna classes + nature re-audit applied**: Ugra/Tikshna→ashubha, Mishra→mishra, host∧benefic→param_shubha. Net changes: Ashvini/Mrigashira/Punarvasu/Pushya/Chitra/Anuradha/Shravana/Shatabhisha/Revati → param_shubha; Bharani/Magha/P.Phalguni/P.Ashadha → ashubha; Vishakha param→mishra; Dhanishtha mishra→shubha.
9. **Saptashalaka vedha grid (14 pairs), Baan degree triggers (%30 frame), Patadosha Shool window [106°40′–120°], Yuti-dosha helper** encoded in `calendarEngine.ts`.
10. **Panch-Kalyanaka table (incl. Garbha) + tithi lookup** added to `tirthankaras.ts`.

## OPEN CONFLICTS — [REQUIRES_RESEARCH] before touching data files

1. **SP-1 residual micro-data:** Moon-revolution distribution across individual nakshatras beyond class-level bhabhog parts; Jyotishi-dev per-body āyu numbers are given as palyopama ranges only.
2. **Bhaktamar full remedial matrix promotion** into sadhana.ts BHAKTAMAR_SHLOKAS still gated on lineage vidhi table (counts/directions/somatic protocols per shloka beyond the base vidhi line).
3. **Yuti dosha runtime limit:** web engine computes only Sun/Moon natively; Mars/Saturn/Rahu/Ketu longitudes require a node ephemeris before the check is live.
4. **Android parity re-sync** after this TS sweep (DashaEngine.kt / CalendarEngine.kt mirrors).
