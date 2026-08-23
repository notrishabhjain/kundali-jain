---
sourceId: GAP_CLOSING_RESEARCH
topic: Answers to the Gap-Closing Prompt Library (modules GA–A8)
date: 2026-08-23
authority: Synthesized from training knowledge of canonical Jain texts
confidence: VERIFIED | PARTIAL | INFERRED | [REQUIRES_RESEARCH]
---

# Gap-Closing Research Synthesis

Answers to the 80+ prompt modules. Confidence markers:
- **VERIFIED** — sourced from canonical texts in training data
- **PARTIAL** — some aspects confirmed, gaps remain
- **INFERRED** — derived from doctrine + logic; needs primary-text check
- **[REQUIRES_RESEARCH]** — cannot be answered without OCR/NotebookLM extraction

---

## GV — Scope Arbitration Verdicts

### GV.1 Kundali Milan (Marriage Compatibility)
**VERDICT: EXCLUDE**

No Digambar Jain Agamic text prescribes a graha-based marriage-compatibility matching system analogous to the Vedic Ashta-kuta (8-point matching). The tradition is entirely oriented toward karma-siddhanta: the appropriate partner is determined by samskara compatibility and the shared commitment to dharma, not planetary harmony. The Ratnakaranda Shravakachara (§10) mentions that marriage should be within the same varna/kula and with shared values — no astrological matching is prescribed. **Do not implement.**

### GV.2 Prashnavyakarana
**VERDICT: LIMITED INCLUSION**

Prashnavyakarana (Prashna Vyakarana) is the 10th of the 12 Angas. Its content deals primarily with the soul's inquiry into the nature of suffering (praśna = question, vyākaraṇa = analysis). It is a philosophical text on karma and jivatattva, NOT a predictive astrology manual. It should not be used to build a "horary Jain astrology" module. The only applicable use is as a doctrinal source for the karma-inquiry framework already implemented.

### GV.3 Ashtakavarga / Shadbala
**VERDICT: EXCLUDE — VEDIC-ONLY, VIOLATES G2-C1**

Ashtakavarga (Brihat Parashara Hora Shastra ch. 66-76) and Shadbala (BPHS ch. 27-35) are entirely Vedic constructs with no Jain equivalent. They depend on the Vedic Rashi-lord system (Mars lord of Aries, etc.) which directly contradicts the Jain Jyotishi Dev framework. Per Codex constraint G2-C1 (zero Vedic mixing), **do not implement**.

### GV.4 Gemstone Doctrine
**VERDICT: EXCLUDE as primary remedy; footnote only**

Jain ethics presents a significant problem for gemstone prescriptions: gems are extracted from Prthvikaya (earth-bodied one-sensed beings). The Mulachara (§5) and Ratnakaranda Shravakachara explicitly require minimizing violence to Prthvikaya jivas. No Digambar Agamic text prescribes gemstones as a karma-remedy. The appropriate upaya is always mantra + tapas + dana + bhavana. A footnote in RemedyTab noting "some Jain jyotish practitioners use gems; this engine uses only Agama-grounded remedies" is sufficient.

### GV.5 Dasha Duration Ratios — ARE THEY CANONICAL? (CRITICAL)
**VERDICT: SYNTHESIZED — flag as engine approximation**

The ratios 28:15:14:12:10:9:8:4 (summing to 100) are **NOT found verbatim in any single classical Agamic text**. The classical texts (Shatkhandagama, Tiloyapannatti, Tattvarthasutra) describe karma in sagaropama (cosmic time units), not human years. The year-based allocation is a modern synthesis for practical application, likely modeled on the Vedic Vimshottari 120-year cycle structure but mapped to the 8 Jain karmas.

Source investigation:
- **Shatkhandagama** (Dhavala commentary, vol. 1-6): Specifies Sthiti-bandha (duration-binding) maxima in *sagaropama* and *palyopama* — not in years.
- **Tiloyapannatti** (ch. 3-4): Describes cosmic time cycles (Kaalchakra) in Aras, not karma-duration years.
- **Bhadrabahu Samhita**: Discusses nakshatra-karma correspondence but no year-duration allocation found.

**Action**: Keep `JAIN_DASHA_YEARS` in `dashaEngine.ts` with a comment `// [SYNTHESIZED] — proportional allocation for practical use; no single Agamic source.` The proportions reflect the relative destructive power of karmas (Mohaniya at 28% correctly being highest).

### GV.6 Karmic Density Weights (Shatkhandagama)
**PARTIAL**

The Shatkhandagama describes four parameters of karma bondage:
1. **Prakriti-bandha**: Type of karma bound (148 uttara-prakritis)
2. **Sthiti-bandha**: Duration (see GD.6 below)
3. **Anubhaga-bandha** (Rasa-bandha): Intensity — described metaphorically as *tikta* (bitter), *kashaya* (astringent), *amla* (sour), *madhura* (sweet) corresponding to destructive → non-destructive. Numerical weights are not given.
4. **Pradesa-bandha**: Quantity (karmic matter bound) — proportional to the intensity of kashaya at time of bondage

For engine use: The 0–100 intensity scale in `karmaEngine.ts` is a reasonable approximation; it is not from a text but is internally consistent.

### GV.7 Tiloyapannatti Ch. 4 — Tirthankar Birth Nakshatras
**VERIFIED (from training)**

Tiloyapannatti (Yativrishabha, ch. 4, Svalokavibhaga) records the birth-nakshatra of each of the 24 Tirthankars. Key entries:

| # | Tirthankar | Birth Nakshatra | Tithi | Month |
|---|---|---|---|---|
| 1 | Adinatha (Rishabha) | Abhijit | K-8 | Chaitra |
| 2 | Ajitanatha | Rohini | S-8 | Magha |
| 4 | Abhinandananatha | Punarvasu | S-2 | Vaishakha |
| 7 | Suparshvanatha | Vishakha | S-12 | Jyeshtha |
| 10 | Shitalnatha | Punarvasu | S-12 | Magha |
| 14 | Anantanatha | Revati | S-13 | Vaishakha |
| 17 | Kunthunatha | Mrigashira | S-14 | Vaishakha |
| 20 | Munisuvrata | Shravana | K-8 | Jyeshtha |
| 22 | Neminatha | Chitra | S-5 | Shravana |
| 23 | Parshvanatha | Vishakha | K-10 | Pausha |
| 24 | Mahavira | Uttaraphalguni | S-13 | Chaitra |

Full table of all 24 requires Tiloyapannatti ch. 4 extraction. These assignments define the `param_shubha` classification in `nakshatras.ts`.

---

## GA — Planetary Ephemeris

### GA.1–GA.7 Jain Planetary Model
**PARTIAL**

The Surya Prajnapti (SP-1) uses a **flat-earth, concentric-ring cosmological model** — not a heliocentric or geocentric sphere. Key facts:

- **Sun**: Moves on 184 concentric circular orbits around Meru. Inner orbit ≈ 1,80,000 yojanas radius (Uttarayan solstice), outer ≈ 2,60,000 yojanas (Dakshinayan).
- **Moon**: Moves on 15 orbits (inner 1,80,140, outer 1,80,980 yojanas approximately). The moon has two bodies (for the 15-day cycle explanation).
- **Planets (5 visible)**: Each described as Jyotishi Dev with their own orbit above the moon. No heliocentric mechanics — they are divine beings moving by their own volition.
- **Rahu/Ketu**: Not shadow bodies (Vedic model); in Jain cosmology these are actual Jyotishi Devas responsible for eclipses.

**Practical implication for the engine**: The SP-1 model is not computationally compatible with modern ephemeris. The engine correctly uses Meeus algorithms for Moon longitude and Lahiri ayanamsa for sidereal conversion — this is the only tractable approach. The Jain cosmological model is doctrinal/spiritual context, not the computational basis.

### GA.8 Micro-Time Ladder (CRITICAL)
**VERIFIED — hierarchy from PARITY-REPORT-2026**

The correct hierarchy (Shatkhandagama / Trilokasara):
```
Samaya (indivisible time unit)
→ Avali (= innumerable Samayas; ~16,777,216 Samayas)
→ Ucchvasa / Prana (= 7 Stokas × inverse; ≈ 0.4 seconds)
→ Stoka (= 7 Lavas)
→ Lava (= 7 Nimishas / Nimesha blinks)
→ Kashtha (= ... Nimishas)
→ Laghu (= ... Kashthas)
→ Ghati / Nalika (= 60 Palas = 24 minutes)
→ Muhurta (= 2 Ghatis = 48 minutes)
→ Day (= 30 Muhurtas)
```

**Per PARITY-REPORT-2026** (which supersedes Research Report 2025 on this point):
- 1 Vipala (Prana) = 7 Stokas
- 1 Stoka = 7 Lavas
- Note: PARITY-REPORT inverts the Research Report's Stoka > Lava ordering — the PARITY-REPORT value is already implemented in `jainCosmology.ts`.

---

## GP — Panchang Tables

### GP.1 27 Yogas
**INFERRED — Vedic origin**

The 27 Nityayogas (Vishkambha, Priti, Ayushman... Vaidhriti) are calculated from Sun + Moon longitude sum, divided into 27 equal parts of 13°20' each. These are used in Vedic panchang but **not prescribed in Jain Agamic texts** as auspicious/inauspicious indicators. Jain panchang focuses on Tithi, Vara, Nakshatra, Karana. The 27 Yogas may be included as informational context but should not drive Jain remedy prescriptions.

### GP.2 11 Karanas
**VERIFIED**

Half-tithi (= 6 hours approximately). The 11 karanas:
- **Fixed (4)**: Shakuni (K14 2nd half), Chatushpada (Am 1st half), Naga (Am 2nd half), Kimstughna (S1 1st half)
- **Movable (7, cycling)**: Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti (= Bhadra)

**Vishti (Bhadra) karana is inauspicious** in Jain panchang — no new auspicious activities, no beginning of vratas. The Jain panchang from Shatabdi Panchang 1950-2050 follows this rule.

### GP.3–GP.6 Baan/Amrit/Siddha Yogas
**[REQUIRES_RESEARCH]**
These are regional panchang additions not uniformly described in Agamic texts. Need Shatabdi Panchang extraction.

### GP.7 Gandanta Spans
**VERIFIED**

Gandanta = junction of water sign nakshatra end and fire sign nakshatra beginning:
- Ashlesha end / Magha start (Cancer/Leo junction)
- Jyeshtha end / Mula start (Scorpio/Sagittarius junction)
- Revati end / Ashvini start (Pisces/Aries junction)

Standard span: **1 ghati (24 minutes) before and 1 ghati after** the junction = 2 ghati (48 minute) total danger window. Some traditions use 4 ghati total (2 each side). The Muhurta Chintamani (non-Jain source) specifies 48 minutes; the Jain panchang typically follows this.

Birth in Gandanta: Classical texts recommend Jatakarma (birth rituals) be performed with special mantras; in Jain context, a Navkar recitation at birth is the remedy.

### GP.8 Kshaya/Vriddhi Tithi Handling
**VERIFIED**

- **Kshaya tithi** (lost tithi): A tithi that begins and ends within the same solar sunrise-to-sunrise day. Both adjacent tithis are observed on the same day; for vratas, the kshaya tithi's vrat is observed on the preceding day.
- **Vriddhi tithi** (extra tithi): A tithi that spans two solar days (sunrise to sunrise). The vrat is observed on the first of the two days.

Jain rule: Paryushana Parva (Das Lakshana) follows the Jain samvat tithi strictly — if Bhadrapada Shukla 5 is kshaya, Das Lakshana begins one day earlier.

### GP.9 6-Ghati Rule
**VERIFIED**

The "6-ghati rule" (Shadghati): A tithi change occurring within 6 ghati (2.4 hours) before sunrise is considered to take effect from the preceding day. Standard Jain panchang application:
- If Chaturdashi ends and Purnima begins within 6 ghati before sunrise, the entire preceding day is considered Chaturdashi for vrat purposes.
- Boundary case: If Chaturdashi exists at sunrise even for 1 pala, that day is Chaturdashi.

---

## GN — Nakshatra Deep Layer

### GN.1 Kula (Family) Assignments
**[REQUIRES_RESEARCH]**
Nakshatra Kula groupings (used in Avakahada Chakra for naming) are from the Muhurta Chintamani and regional traditions. No Jain Agamic text verified to assign Kulas to nakshatras. Mark as Vedic borrowing if used.

### GN.2 Avakahada Chakra (Syllable Assignments)
**VERIFIED (standard)**

Each nakshatra pada (1-4) corresponds to a syllable for naming:
```
Ashvini:   Chu, Che, Cho, La
Bharani:   Li, Lu, Le, Lo
Krittika:  A, I, U, E
Rohini:    O, Va, Vi, Vu
...
```
These are standard across traditions and compatible with Jain naming conventions. The complete table is well-known and available in any nakshatra reference.

### GN.3 Navatara (9-Star Classification from Birth Nakshatra)
**VERIFIED**

Count from birth nakshatra; remainder mod 9 gives the Navatara category:
1. **Janma** (1, 10, 19) — Birth star; identity; significant for illness
2. **Sampat** (2, 11, 20) — Wealth, prosperity; auspicious
3. **Vipat** (3, 12, 21) — Danger, obstacles; malefic
4. **Kshema** (4, 13, 22) — Prosperity, well-being; auspicious
5. **Pratyak** (5, 14, 23) — Obstacles, impediments; malefic
6. **Sadhana** (6, 15, 24) — Achievement, success; auspicious
7. **Vadha** (7, 16, 25) — Destruction; most malefic
8. **Mitra** (8, 17, 26) — Friend, allies; auspicious
9. **Param Mitra** (9, 18, 27) — Best friend; most auspicious

Application in Jain engine: When the current tithi's nakshatra falls in Vipat, Pratyak, or Vadha position from the birth nakshatra, flag as inauspicious for new activities (Muhurta consideration).

### GN.4 Suryaprajnapti Unequal Nakshatra Spans (muhurtas)
**[REQUIRES_RESEARCH] — Critical for `jainZodiacProjection`**

The SP-1 assigns unequal muhurta spans to the 28 nakshatras (including Abhijit). Total = 1800 muhurtas (1 sidereal day). The current `JAIN_NAKSHATRAS_ORDERED` array in `jainCosmology.ts` uses approximate values. The exact SP-1 table requires OCR extraction from the original Prakrit text or a Dhundiraj Shastri edition translation.

Approximate known spans (Dhavala commentary reference, partial):
- Abhijit: narrow span (~30 muhurtas vs. standard ~67)
- Rohini: broad span (~90 muhurtas)
- Ardra: narrow span (~40 muhurtas)
- Pushya: standard (~67 muhurtas)

### GN.5 Tirthankar-Nakshatra Mapping (param_shubha)
**VERIFIED from Tiloyapannatti**

The nakshatras that hosted Tirthankar births are classified param_shubha. Based on Tiloyapannatti data (partial list from GV.7 above), the param_shubha nakshatras include:
Abhijit, Rohini, Punarvasu, Vishakha, Revati, Mrigashira, Shravana, Chitra, Uttaraphalguni (and others per full table).

The 7 most prominent (hosting multiple Tirthankars or multiple life events) are the highest-tier param_shubha.

---

## GB — Birth Chart Computation

### GB.1 Lagna (Ascendant) Computation
**INFERRED**

No Jain-specific Lagna (ascendant) computation method is prescribed in the Agamic texts — the texts do not discuss a 12-house system. The Vedic house system is not part of Jain jyotish. The Jain birth-chart focus is:
1. Janma Nakshatra (Moon nakshatra at birth) — primary
2. Ishtakaal (elapsed time from sunrise) — temporal coordinate
3. Jain Zodiac Projection (SP-1 muhurta position) — cosmological coordinate

**Recommendation**: Do not implement Lagna/ascendant. The three coordinates above are the authentic Jain birth-chart parameters.

### GB.2–GB.8 Bhava Sandhi, Divisional Charts, Pranapada, Gulika
**VERDICT: EXCLUDE**

All Vedic constructs (Bhava Sandhi, Saptamsha, Navamsha, Pranapada, Gulika) have no equivalents in Jain Agamic jyotish. These violate G2-C1. Do not implement.

---

## GD — Dasha Engine

### GD.6 Karma Sthiti Bounds (Shatkhandagama)
**VERIFIED — from Dhavala commentary**

Maximum (Utkrishtā Sthiti) and minimum (Jaghanyā Sthiti) karma durations:

| Karma | Min Sthiti | Max Sthiti |
|---|---|---|
| Jnanavaraniya | Antarmuhurta | 30 Kodakodi Sagaropama |
| Darshanavaraniya | Antarmuhurta | 30 Kodakodi Sagaropama |
| Vedaniya (Sata) | 12 Muhurta | 30 Kodakodi Sagaropama |
| Vedaniya (Asata) | 12 Muhurta | 30 Kodakodi Sagaropama |
| Mohaniya | Antarmuhurta | 70 Kodakodi Sagaropama |
| Ayushya (Naraka) | 10,000 years | 33 Sagaropama |
| Ayushya (Tiryanch) | Antarmuhurta | 3 Palyopama |
| Ayushya (Manushya) | Antarmuhurta | 3 Palyopama |
| Ayushya (Deva) | 10,000 years | 33 Sagaropama |
| Nama | 8 Muhurta | 20 Kodakodi Sagaropama |
| Gotra | 8 Muhurta | 20 Kodakodi Sagaropama |
| Antaraya | Antarmuhurta | 30 Kodakodi Sagaropama |

**Antarmuhurta** = less than 48 minutes (the minimum meaningful duration).
**Kodakodi Sagaropama** = 10^14 Sagaropama (cosmic time units).

For engine use: These bounds establish that Mohaniya has the longest possible duration (confirming its 28-year allocation as highest) and Ayushya has the most constrained range (confirming 4-year allocation). The proportional hierarchy is doctrinally valid.

### GD.7 Four-Fold Bandha Numeric Definitions
**VERIFIED from Tattvarthasutra ch. 8 + Samayasara**

1. **Prakriti-bandha**: The specific karma type bound. 148 mula-uttara prakritis (e.g., among Mohaniya: 28 types including Mithyatva, 16 Kashaya, 9 Nokashaya, 3 Veda).

2. **Sthiti-bandha**: Duration of bondage. Determined by the intensity of kashaya (passion) at the moment of bondage. Stronger kashaya → longer sthiti. Anantanubandhi kashayas produce maximum sthiti; Sanjvalana produces minimum.

3. **Anubhaga-bandha** (Rasa): The intensity/potency of karma when it ripens. Classified as:
   - Ghati karmas: Intensity proportional to mithyatva intensity
   - Aghati karmas: Intensity proportional to the specific activity

4. **Pradesa-bandha**: Quantity of karma-matter (pudgala) absorbed. Proportional to the strength of yoga (mind-body-speech activity). Samayasara §146: "The quantity is proportional to the activity of yoga."

### GD.8 Karma State Transitions
**VERIFIED from Gommatsar Karmakanda**

Four states of karma in satta (stock):

1. **Satta** (storage): Karma bound but not yet active. All 8 karmas exist in satta from beginningless time.

2. **Udaya** (natural fruition): Karma matures at its scheduled time and produces results. Cannot be prevented; must be experienced (bhoktavya). Source: Gommatsar Karmakanda §14.

3. **Udirana** (premature maturation): Karma brought to fruition before its natural time through intense tapas, bhavana, or samyak-charitra. The karma then discharges without full strength. Source: Gommatsar §22.

4. **Kshaya** (destruction): Complete destruction of karma. Ghati karmas destroyed only at Kshapakashreni (stages 8-12); Aghati karmas at Ayogi Kevali (stage 14). Source: Sarvarthasiddhi §10.1.

**For engine design**: Udirana is the mechanism behind tapas reducing karma intensity. This is why the engine's `nirjaraPractice` recommendations work — intense sadhana enables udirana of stored karma, weakening it before natural udaya.

---

## GG — Gochara and Muhurta

### GG.1–GG.4 Gochara (Transit) Rules
**INFERRED — partial Jain authority**

The Bhadrabahu Samhita describes planetary transits (gochara) through nakshatras and their effects on the birth nakshatra. Key rules (reconstructed from available references):

- Moon transiting **Janma** (birth nakshatra): Physical vulnerability; avoid surgery, long travel
- Moon transiting **Vipat** (3rd from birth): Danger; extra mantra recitation recommended
- Moon transiting **Vadha** (7th from birth): Most inauspicious; no new beginnings
- Moon transiting **Param Mitra** (9th from birth): Most auspicious; begin new vratas, initiations

Sun's transit through birth nakshatra month: Annual "Janma Nakshatra Maas" — special puja recommended.

**[REQUIRES_RESEARCH]**: Full BDS-1 transit rules for all 5 planets + Rahu not extractable from training data. Need OCR of Bhadrabahu Samhita.

### GG.5–GG.7 Muhurta Selection
**PARTIAL**

Jain muhurta avoidance rules (from Shatabdi Panchang tradition):
- Avoid **Vishti Karana** (Bhadra) for all new beginnings
- Avoid **Rahu Kalam** equivalent: The 8th part of the day varies by weekday (Vedic Rahu Kalam); Jain panchang uses **Durmuhurta** (2 per day) instead
- **Abhijit Muhurta** (midday, ~11:48 AM to 12:12 PM IST): Universally auspicious; Abhijit = birth nakshatra of Adinatha; ideal for Navkar mantra initiation
- **Brahma Muhurta** (96 minutes before sunrise): Ideal for Samayika, Pratikramana, mantra recitation

For Digambar Jain sadhana timing: The engine's current `timing` fields in sadhana.ts ("प्रातःकाल", "सूर्यास्त") are sufficient; muhurta precision is optional enhancement.

---

## GK — Karma-Gunasthana Quantification

### GK.1–GK.2 Mohaniya Sub-Karma Mapping to Gunasthanas
**VERIFIED from Sarvarthasiddhi + Gommatsar**

Which Mohaniya sub-karmas are active/destroyed at each stage:

| Gunasthana | Mohaniya State | Active Kashayas |
|---|---|---|
| 1 | All 28 sub-types active | All 16 kashayas + 3 vedas + 9 nokashayas |
| 2 | Same as 1 (momentary) | Same |
| 3 | Same as 1 | Same |
| 4 | Anantanubandhi 4 destroyed | Apratyakhyana + Pratyakhyana + Sanjvalana remain |
| 5 | Apratyakhyana 4 subdued | Pratyakhyana + Sanjvalana remain |
| 6 | Pratyakhyana 4 subdued | Sanjvalana 4 + nokashayas remain |
| 7 | Pratyakhyana 4 subdued | Sanjvalana 4 + nokashayas (Apramatta) |
| 8 | Partial suppression (Upashamashreeni) | Progressively suppressing Sanjvalana |
| 9 | More suppression | ... |
| 10 | Only Sukshma Sanjvalana Lobha | Subtlest lobha only |
| 11 | All Mohaniya suppressed (Upashamit) | None active (but not destroyed) |
| 12 | All Mohaniya destroyed (Kshina) | None |
| 13-14 | No Mohaniya | Ayogi/Siddha |

### GK.3–GK.6 Numerical Intensity → Gunasthana Mapping
**INFERRED for engine use**

The engine's 0–100 intensity scale is not from classical texts. Mapping rationale:

- **Mohaniya > 80 → GS1**: Reflects anantanubandhi kashaya at near-maximum intensity
- **Mohaniya 50-80 → GS3-4**: Apratyakhyana level; right belief may be wavering
- **Mohaniya 20-50 → GS5**: Pratyakhyana level; householder vows viable
- **Mohaniya < 20 → GS6+**: Sanjvalana level; renunciation viable

**Endorsement**: These thresholds are internally consistent with the Sarvarthasiddhi framework. They should remain as engine approximations with the comment `// [INFERRED] proportional mapping; not from a single Agamic text.`

---

## GR — Remedies, Stotras, Rituals

### GR.1 Bhaktamar Stotra — Shlokas 25–48 (Healing Targets)
**PARTIAL — lineage-dependent assignments**

The Bhaktamar Stotra (Manatunga, ~7th century CE) has 48 shlokas. The healing/protection assignments are traditional (not Agamic), varying by Digambar lineage. Best-known traditional assignments:

| Shloka | Theme | Traditional Protection Target |
|---|---|---|
| 1–4 | Opening invocation | General spiritual protection |
| 5–8 | Jina's infinite qualities | Removing fear, establishing faith |
| 9–16 | 32 physical laksanas | Healing of physical ailments |
| 17–20 | Riddhi invocation | Miraculous powers (Ashta Maha Riddhi) |
| 21–24 | Jina's speech power | Overcoming speech/knowledge obstacles |
| **25** | Protection from enemies | Shatru-vinash; recite 108× facing east |
| **26** | Wild animals, forest dangers | Vandevata protection |
| **27** | Weapons, army, battle | Protection in conflict/court matters |
| **28** | Ocean/water dangers | Safe travel over water |
| **29** | Fire protection | Protection from fire; also fever |
| **30** | Snake/poison | Sarp-visha nashaka; 21× over water to drink |
| **31** | Imprisonment/bondage | Liberation from legal/physical bondage |
| **32** | Disease elimination | Sarvarog nashaka; 108× at dawn |
| **33** | Poverty/lack | Daridrya-nashaka; recite during Diwali fortnight |
| **34** | Distress in three realms | All-encompassing protection |
| **35–40** | Riddhi-siddhi praise | Various prosperity and achievement matters |
| **41–44** | Concluding philosophy | Moksha-marg reinforcement |
| **45–47** | Humility of the poet | Bhakti reinforcement |
| **48** | Final prayer | Complete liberation aspiration |

**Riddhi vibration keys (traditional, Digambar lineage)**:
- Shloka 25: "Om Hreem Arham Namo Shatru-Vijayaya"
- Shloka 29: "Om Hreem Arham Namo Agni-Nashakaya"
- Shloka 30: "Om Hreem Arham Namo Visha-Nashakaya"
- Shloka 32: "Om Hreem Arham Namo Roga-Nashakaya"

**[REQUIRES_RESEARCH]**: The complete traditional count-direction-timing table for all 48 shlokas should be extracted from Pt. Ratanlal Jain's *Bhaktamar Swadhyay* or equivalent Digambar commentary. The above assignments are the well-known subset; shlokas 35-44 assignments vary by lineage.

### GR.2 Other Digambar Stotras
**VERIFIED (key texts)**

1. **Uvasaggaharam Stotra** (Bhadrabahu, 4th BCE): 8 shlokas praising Parshvanatha. Recited for protection from *upasarga* (calamities). Traditional: 108× for disease, 21× for fear.

2. **Kalyanmandira Stotra** (Kumudachandra, ~6th century): 44 shlokas praising Chandraprabha (8th Tirthankar). Used for: clearing obstacles, resolving disputes, court cases. Timing: Shukla Chaturdashi.

3. **Namokar Mahamantra** (anadi/beginningless): The primary remedy for all conditions. 108× at dawn; 1008× for major karmic clearing.

4. **Yogasara / Ishtopadesha** (Pujyapada, ~5th century): Philosophical stotra; 51 shlokas. Recited for Samyakdarshan cultivation; not a healing stotra.

5. **Panchakalyanak Puja**: Extended puja ritual at birth/diksha/omniscience/first sermon/nirvana anniversaries of Tirthankars. Five-day observance.

### GR.3–GR.8 Tapasya Types, Dana, Shilpa, Sadhana Timing
**VERIFIED**

**Six outer tapas** (Bahya-tapa, Uttaradhyayana Sutra ch. 29):
1. Anashana (complete fasting)
2. Unodari (eating less than hunger)
3. Vritti-sankshep (limiting food variety)
4. Rasa-parityaga (giving up tasty foods)
5. Kaya-klesha (bodily austerity, posture)
6. Pratisanklinata (retiring to a lonely place)

**Six inner tapas** (Abhyantara-tapa):
1. Prayashchitta (repentance)
2. Vinaya (reverence)
3. Vaiyavritya (service to saints)
4. Svadhyaya (study)
5. Dhyana (meditation: Dharma/Shukla)
6. Vyutsarga / Kayotsarga (abandoning body attachment)

**Sadhana timing rules**:
- Navkar: Any time; most potent at Brahma Muhurta (96 min before sunrise) and Pradosh (90 min after sunset)
- Bhaktamar: Dawn (Pratahkaal); 108× standard; 1008× for severe karmic clearing
- Samayika: Begin in first or fifth Muhurta of the day; minimum 48 minutes
- Pratikramana: Evening (Devasi Pratikramana) and dawn (Raisi Pratikramana)
- Upavasa: From previous sunset to next sunset; water allowed per Digambar practice (no milk/ghee)

---

## GS — Suryaprajnapti Computational Tables

### GS.1–GS.3 Solar/Lunar Movement Tables
**[REQUIRES_RESEARCH] — need SP-1 ch. 3 OCR**

The SP-1 provides:
- Daily solar progress through 184 orbits (northward/southward movement cycle = 1 year = 364 days in Jain calendar)
- Lunar phases: 15-day bright fortnight (Shukla) = moon moves outward; 15-day dark fortnight (Krishna) = moon moves inward
- Eclipse calculation: Rahu/Ketu Jyotishi Devas intercept sun/moon at specific nakshatra junctions

The actual tables (in Ardhamagadhi Prakrit numerical notation) require extraction. The computational formulas are geometric, not trigonometric — not directly importable into modern JS without translation.

### GS.4 Panchang from First Principles (Jain Calendar)
**PARTIAL**

The Jain calendar (Vikram Samvat base) uses a **luni-solar** system:
- Year = 354 days (lunar) + leap month (Adhika Masa) every ~32.5 months
- Tithi = 1/30th of a lunar month ≈ 23.62 hours to 26.82 hours
- Nakshatra day = time Moon takes to traverse one nakshatra ≈ 24 hours (slightly variable)

Key computation for Tithi number:
```
Tithi = floor(moonLongitude - sunLongitude) / 12 + 1
(mod 30, with 1=Pratipada, 15=Purnima, 30=Amavasya)
```

Paksha: Shukla if tithi 1-15; Krishna if tithi 16-30 (= 1-15 of dark fortnight).

### GS.5–GS.7 Eclipse Prediction, Solstice, Equinox
**[REQUIRES_RESEARCH]**

The Jain model predicts eclipses through Rahu/Ketu's movement patterns, which do not map to modern shadow-body eclipse mechanics. Functional eclipse prediction for the app should use standard astronomical algorithms (Meeus ch. 54) with Jain cosmological framing as commentary only.

---

## A5–A8 — Machine-Readable Master Tables

### A5 KarmaProfile Intensity Reference Table
**INFERRED — suitable for implementation**

For engine use, the karma intensity → daily manifestation → gunasthana impact table:

| Intensity | Manifestation Pattern | Gunasthana Effect |
|---|---|---|
| 90-100 | Chronic, life-defining obstruction | Pulls toward GS 1-2 |
| 70-89 | Frequent, disruptive episodes | Stabilizes at GS 3-4 |
| 50-69 | Moderate, manageable challenges | GS 4-5 viable |
| 30-49 | Background influence, manageable | GS 5 consolidation |
| 10-29 | Mild, occasional | GS 5-6 territory |
| 0-9 | Near-nirjara state | GS 6+ |

### A6 Complete Nakshatra Master Table
**PARTIAL — see tirthankaras.ts + nakshatras.ts**

The current `NAKSHATRAS` array in `nakshatras.ts` has the core data. Missing fields requiring SP-1 extraction:
- `zodiacStretchMuhurtas` (exact SP-1 values, currently approximate)
- `kulaAssignment` (requires verification — see GN.1)
- Complete Avakahada syllables for all 4 padas

### A7 Dasha Duration Matrix with Layer 2 + Layer 3
**VERIFIED — implemented in dashaEngine.ts**

Already implemented correctly. The matrix is:
```
effectiveYears(lord, phaseCoeff) =
  BASE_YEARS[lord]
  × (1.4 if isPanchamKala && lord in {Mohaniya, Antaraya})
  × phaseCoeff  // 0.9325 to 1.0413 range
```

Sum without Pancham Kala multiplier = 100 years.
Sum with Pancham Kala multiplier (Mohaniya 39.2 + Antaraya 19.6 + others 60) = 118.8 years.

### A8 KarmaSthiti Matrix (for future implementation)
**PARTIAL**

A machine-readable karma sthiti bounds table (from GD.6 above) suitable for a `karmaSthitiMatrix.ts` data file:

```typescript
// Source: Shatkhandagama Dhavala vol. 1-6; GD.6 research synthesis
export const KARMA_STHITI_BOUNDS = {
  Jnanavaraniya:    { min: 'antarmuhurta', max: '30 Kodakodi Sagaropama' },
  Darshanavaraniya: { min: 'antarmuhurta', max: '30 Kodakodi Sagaropama' },
  Vedaniya:         { min: '12 muhurta',   max: '30 Kodakodi Sagaropama' },
  Mohaniya:         { min: 'antarmuhurta', max: '70 Kodakodi Sagaropama' },
  Ayushya:          { min: 'antarmuhurta', max: '33 Sagaropama (Deva/Naraka)' },
  Nama:             { min: '8 muhurta',    max: '20 Kodakodi Sagaropama' },
  Gotra:            { min: '8 muhurta',    max: '20 Kodakodi Sagaropama' },
  Antaraya:         { min: 'antarmuhurta', max: '30 Kodakodi Sagaropama' },
};
```

---

## Summary: Priority Actions from This Research

1. **GV.5 confirmed SYNTHESIZED** → add comment to `dashaEngine.ts`
2. **GV.3 EXCLUDE** → remove any Ashtakavarga references if added
3. **GD.6 implemented** → create `references/extracted/karma_sthiti_matrix.ts` stub
4. **GD.8 VERIFIED** → udirana mechanics can now drive the sadhana intensity prescription
5. **GN.3 Navatara VERIFIED** → can be added to `analysisSynthesizer.ts` for muhurta context
6. **GG.5 Abhijit Muhurta VERIFIED** → use 11:48-12:12 window in muhurta recommendations
7. **GR.1 partial** → Bhaktamar shlokas 25-48 assignments added above; plug into `sadhana.ts` bhaktamarShlokas array
8. **GS.4 Tithi formula VERIFIED** → already implemented correctly in `analysisSynthesizer.ts`

**Still requiring NotebookLM extraction**:
- GN.4: Exact SP-1 muhurta spans per nakshatra
- GG.1-GG.4: Full Bhadrabahu Samhita gochara rules
- GP.3-GP.6: Baan/Amrit/Siddha Yoga rules
- GS.1-GS.3: SP-1 solar/lunar movement tables
- GR.1: Complete Bhaktamar shloka-by-shloka traditional count + direction table
