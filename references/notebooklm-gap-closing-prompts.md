# दिगम्बर जैन ज्योतिष — Gap-Closing Prompt Library

**Purpose:** Close every identified knowledge gap in the Jain Kundali Core Engine — planetary ephemeris depth, complete panchang tables, computational birth-chart methods, dasha/karma quantification, transit systems, remedy vidhis, and scope-arbitration verdicts.

**Companion document to:** `Jain Jyotish NotebookLM Extraction Prompt Library` (Modules M1–M7, 42 prompts). Run those first if not already done; this library covers everything M1–M7 left unanswered.

**Source Texts required in notebook:** तिलोयपण्णत्ती · त्रिलोकसार · सूर्यप्रज्ञप्ति · चन्द्रप्रज्ञप्ति · ज्योतिषकरण्डक · गणितसारसंग्रह · षट्खण्डागम-धवला · भारतीय ज्योतिष (डॉ. नेमिचंद्र शास्त्री) · बृहत् शताब्दी पंचांग

---

## How to Use This Document

| Step | Action | Purpose |
|---|---|---|
| 1 | Open your NotebookLM notebook with all source texts READY | Ensure extraction quality |
| 2 | Copy ONE prompt at a time into chat | NotebookLM works best focused |
| 3 | Click 'Save to note' after each response | Build permanent knowledge base |
| 4 | Work modules in priority order given at bottom | Architecture decisions first |
| 5 | Run the 4 Artifact prompts last | Machine-readable engine data |

> **⚠️ ADD THIS LINE TO EVERY PROMPT:**
> *"Cite the source text, chapter/adhikara/mahadhikara, and gatha/sutra/page number for every point. If a topic is absent from ALL sources, state that absence explicitly rather than inferring or generalizing from Vedic astrology."*

---

## 🪐 G-Astronomy · Planetary Ephemeris & Precision Engine

*Engine component: full graha longitude computation beyond Sun/Moon*

### GA.1 Planetary Longitudes
Extract every mathematical method, table, or constant in any of these sources for computing longitudes of Mars (मंगल), Mercury (बुध), Jupiter (गुरु), Venus (शुक्र), and Saturn (शनि). Include orbital periods (भगण), mandala radii, speeds per path, and any correction factors. Cover Jyotishkarandaka, Ganitasarasangraha, Tiloyapannatti, and Suryaprajnapti separately.

### GA.2 Retrogression & Motion States
What do these texts say about वक्री (retrograde), मार्ग, and अनुवक्रा motion of planets? Any rules for when/how planets reverse direction, and any astrological effects attributed to retrogression?

### GA.3 Planetary Aspects (Drishti)
Do the texts define planetary aspect values — e.g., special 4th/7th/8th-house aspects for Mars/Jupiter/Saturn? Extract any complete drishti framework, including aspect strengths by degree.

### GA.4 Conjunction & Combustion
Rules for युति (conjunction) effects between planet pairs, and अस्त (combustion) — proximity thresholds to the Sun per planet, and effects when combust.

### GA.5 Exaltation–Debilitation
Do the texts define उच्च (exaltation) / नीच (debilitation) degrees or high/low positions for the 9 grahas? Extract exact degrees if present.

### GA.6 Rahu-Ketu Computation
Any mathematical method for tracking Rahu/Ketu positions over time — beyond the eclipse narrative? Cycle lengths, node movement rates, mean-node arithmetic from the yuga system?

### GA.7 Eclipse Prediction
Extract the COMPLETE method for predicting solar/lunar eclipses from the Panchavarshiya Yuga system — including the "Mokshakaal" (eclipse-end) calculation mentioned in Bharatiya Jyotish. All intervals, conditions, and worked steps.

### GA.8 Micro-Time Ladder Arbitration ⚠️ CRITICAL
State the EXACT canonical hierarchy of time units from smallest to largest: समय → आवलि → प्राण/उच्छ्वास → स्तोक → लव → विपल → पल → घटी/नाड़ी → मुहूर्त. Give the multiplication factor between EACH adjacent pair with verse numbers. Two reference documents conflict on whether प्राण > स्तोक > लव or the reverse — resolve this from primary sources only.

---

## 📅 G-Panchang · Completing the Calendar Engine

*Engine components: calendarEngine.ts — yoga, karana, baan, dosha detection*

### GP.1 Yoga Master Table
List ALL 27 Yogas with: ruling deity (स्वामी), shubh/ashubh status, specific phala/result, and remedies if ashubh. Complete table, no omissions, no samples.

### GP.2 Karana Master Table
All 11 Karanas — qualities, suitable/unsuitable activities, deity, phala. For the 4 Sthira Karanas (शकुनि, चतुष्पद, नाग, किंतुघ्न): the exact tithi-half positions where each occurs.

### GP.3 Dagdha/Visha/Hutashan Matrices
Give the COMPLETE vara×tithi combination tables for दग्ध Yoga, विष Yoga, and हुताशन Yoga — every affected weekday-tithi pair listed explicitly as a matrix.

### GP.4 Siddha Tithi-Vara Combos
Complete list of सिद्ध combinations (Nanda on which vara, Bhadra on which, Jaya/Rikta/Purna similarly) with their stated benefits.

### GP.5 Amavasya Types
Exact determination criteria for सिनीवाली vs दर्श vs कुहू amavasya — timing conditions relative to sunrise/sunset/conjunction moment.

### GP.6 Panchak Rules
Precise start/end conditions of पंचक (which tithi/nakshatra transitions begin/end it), duration rules, cremation pacification rites, and distinct effects of death during each of the 5 Panchak nakshatras (धनिष्ठा through रेवती).

### GP.7 Gandant Spans
Define गंडांत mathematically — how many ghatis/vipalas constitute the junction period? Difference between संध्या-गंड and रात्रि-गंड? Exact boundary portions (last X ghatis of Ashlesha/Jyeshtha/Revati; first X ghatis of Magha/Mula/Ashvini).

### GP.8 Kshaya/Vriddhi Tithi Handling
How are skipped (क्षय) and duplicated (वृद्धि) tithis detected and handled for vrat/festival date determination? Provide worked examples for each case.

### GP.9 6-Ghati Rule Edge Cases
For the Jain rule that a tithi must prevail ≥6 ghatis after sunrise for parva observance: what happens when (a) tithi begins before sunrise but expires before 6 ghatis after, (b) it prevails exactly 6 ghatis, (c) two festivals' tithis overlap? Cite the source verses establishing the rule itself.

### GP.10 Baan Systems
Extract complete computation methods for मृत्यु बाण, चौर बाण, and अग्नि बाण — the formula (tithi/vara/nakshatra inputs), which activities each prohibits, and prescribed remedy if violated.

### GP.11 Yuti Dosha & Graha Vedh
Definitions and calculation rules for युति दोष (Moon sharing a nakshatra with a malefic) and क्रूर ग्रह वेध — which planets count as krur, what "piercing/vedh" means mathematically, and severity grading.

### GP.12 Sankranti Rules
Rules for मकर संक्रांति and monthly मासिक संक्रांति — sidereal entry criteria, punya-kaal windows before/after entry, prohibited periods, and how these are computed without the rashi system in early texts.

---

## ⭐ G-Nakshatra · Deep Layer

*Engine component: nakshatras.ts enrichment + BirthChart analysis*

### GN.1 Kula Assignments
Complete listing of which nakshatras belong to कुल, उपकुल, and कुलोपकुल families (all 28 assigned) from Prashnavyakarana — with the karmic/predictive effect of each family membership.

### GN.2 Avakahada Chakra
Full 28-row table: nakshatra → गण (Deva/Manushya/Rakshasa), योनि animal, नाड़ी (Aadi/Madhya/Antya), वर्ण, तत्त्व — plus any compatibility rules based on these attributes.

### GN.3 Navatara Operation
Exact counting method (inclusive/exclusive of janma star), how taras apply to transit AND dasha contexts, and prescribed remedies/mitigations for विपत्कर, प्रत्यारि, and निधन tara periods.

### GN.4 Abhijit Specifics
Exact span of Abhijit in degrees/gatakis, its ruling deity and planetary lord (or explicit statement of no lord), when it is used vs ignored in calculations, and its relationship to the Revati-end/Ashvini-start junction.

### GN.5 Nakshatra Pada System
Do the sources define padas (quarters)? If yes: pada boundaries, distinct results per pada, and connection to syllables/navamsha. If absent, state explicitly.

---

## 🔮 G-Birth Chart · Computational Framework

*Engine component: lagna/bhava/divisional computation*

### GB.1 Charakhanda
Extract the ascensional-difference (चरखण्ड) tables or formulas used to convert equatorial rising times to oblique-sphere rising times for lagna calculation — full latitude table or formula.

### GB.2 Dasham Bhava Method
The complete step-by-step मध्य लग्न / Dasham Bhava calculation from Sun position and local sidereal time (संपातिक काल), with one fully worked example.

### GB.3 Bhava Sandhi
The full cusp-calculation method ("adding one-sixth of the difference between 1st and 10th houses") with a worked numeric example producing all 12 cusp degrees.

### GB.4 Chalit Chakra
Rules determining when a planet shifts house in the चलित चक्र vs the sign chart (Lagna Kundali), and how predictions reconcile the two charts.

### GB.5 Divisional Chart Computations
Exact mathematical construction of होरा (½), द्रेष्काण (⅓), नवांश (⅑), दशमांश, त्रिंशांश, and षष्ट्यंश (1/60) — division constants, sign-ownership rules per division, and the life-domain each governs.

### GB.6 Pranapada-Gulika Verification
The full लग्न शुद्धि procedure using प्राणपद and गुलिक — formulas, acceptable error tolerance, and the time-correction method when verification fails.

### GB.7 Ishtakaal→Lagna Worked Example
One complete worked example from the texts: given sunrise time, birth time, and latitude → Ishtakaal in ghati-pala → resulting lagna degree/rashi.

### GB.8 Sampaatik Kaal
Definition and computation of local sidereal time in these texts — reference point, units, and conversion from civil time.

---

## ⏳ G-Dasha & Timing

*Engine components: dashaEngine.ts, karmaEngine.ts timing logic*

### GD.1 Vimshottari Balance Formula
The exact भयात्/भोग formula → balance-of-dasha calculation, with one fully worked example converting elapsed nakshatra fraction into remaining years/months/days of the first mahadasha.

### GD.2 Sub-Period Formulas
Confirm the antardasha/pratyantardasha formulas (Mahadasha-years × Antardasha-years ÷ 120 = months?) and give sookshma/prana levels if present. Include the antardasha lord sequence within each mahadasha.

### GD.3 Yogini & Ashtottari Dasha
Any details on these named dasha systems — cycles, lords, durations, and when they are preferred over Vimshottari.

### GD.4 Arishta Age Table
Compile EVERY age-specific affliction rule in Bharatiya Jyotish into ONE table: planetary condition at birth → danger age → severity category (अरिष्ट / बालारिष्ट / death). Do not truncate the age list.

### GD.5 Ayurdaya Methods
Any systematic lifespan-computation method (पिण्डायु / नैसर्गिक-type) in these texts? If only अल्पायु/मध्यमायु/दीर्घायु classification exists, extract every classification rule completely.

### GD.6 Karma Sthiti Bounds
From Shatkhandagama/Dhavala — for EACH of the 8 mula karmas: उत्कृष्ट (maximum) and जघन्य (minimum) स्थिति, plus bandh-abādha values. Build the complete table (known anchors: Ayushya max = 33 Sagaropam; Gotra max = 20 Kodakodi Sagar; dormancy = 100 yr per 1 Kodakodi Sagar bound).

### GD.7 Four-Fold Bandha
Numeric/mechanical definitions of प्रकृति-बन्ध, स्थिति-बन्ध, अनुभाग-बन्ध, प्रदेश-बन्ध — how quantity, duration, intensity, and spatial extent are programmed into karmic matter at bondage.

### GD.8 Udaya vs Satta vs Udirana vs Kshaya
Definitions and operational differences between उदय, सत्ता, उदीरण, and क्षय of karma — with timing rules for each state transition.

---

## 🔭 G-Gochara & Muhurta

*Engine components: muhurtaEngine.ts, future VenusTransitAlerts*

### GG.1 Transit Framework
Any gochara rules — counting transits from janma nakshatra or janma rashi, favorable/unfavorable houses per planet, and वेध (obstruction) points between transiting and natal bodies?

### GG.2 Saturn-Shravana Transit
The full context of Saturn transiting Shravana nakshatra (referenced in engineering documents) — source text, effects, duration, and remedies.

### GG.3 Venus Mandalas & Veethis
Complete definition of the 6 Venus मण्डलs — names, degree boundaries, effects during transit, entry/exit conditions. Same treatment for the 9 वीथिs.

### GG.4 Muhurta Composition Hierarchy
What constitutes a complete muhurta selection — Nakshatrodaya-lagna type, tithi, vara, karana weighting? Is there a stated hierarchy among limbs when they conflict?

### GG.5 Intra-Day Hour Systems
Any hour-classification schemes — muhurta-by-muhurta auspiciousness within a single day (e.g., अभिजीत मुहूर्त, ब्रह्म मुहूर्त, राहु काल equivalent)?

### GG.6 Eclipse-Window Varjit Rules
Exact Varjit Kaal boundaries around eclipses — hours/days before and after, partial vs total differences, and exactly which activities resume when.

### GG.7 Rohini Vrat Adjustment
The full वृद्धि/क्षय adjustment rule for Rohini vrat dating — when the nakshatra duration varies, which day is chosen and why?

---

## ⚖ G-Karma ↔ Gunasthana Quantification

*Engine components: karmaEngine.ts, gunasthanaClassifier.ts*

### GK.1 Sarvarthasiddhi Axis Verses
The exact verses defining which mohaniya sub-types block which gunasthana transitions — मिथ्यात्व/अनन्तानुबन्धी → GS1–4 boundary, अप्रत्याख्यानावरण → GS5, प्रत्याख्यानावरण → GS6+, संज्वलन → GS10–12. Map sub-type → blocking stage precisely.

### GK.2 Gunasthana Duration Limits
Any stated minimum/maximum residence times per gunasthana (मूर्त/स्पर्श measurements), and fall/re-ascent rules between adjacent stages — which transitions are irreversible?

### GK.3 Leshya Ranges
Which leshya corresponds to which gunasthana range, and how leshya shifts with kashaya activity — the canonical mapping table.

### GK.4 Kashaya Durations
Stated duration bounds for each of the 16 kashaya intensities (e.g., sanjvalana vanishing within less than a muhurta). Confirm and complete the full set of bounds.

### GK.5 Ayushya Binding Conditions
At which gunasthanas can each of the 4 ayu types (deva/manushya/tiryanch/naraka) be bound? Can naraka-ayu bind above GS1? Produce the complete condition matrix from Shatkhandagama.

### GK.6 Tirthankara-Nama Prerequisites
The causes/conditions (भाव) required to bind तीर्थंकर नाम कर्म — since this defines the engine's ceiling concept for spiritual predictions.

---

## 🙏 G-Remedies, Rituals & Stotras

*Engine components: sadhana.ts, JaapSadhana, TantraSadhana*

### GR.1 Bhaktamar Shlokas 25–48
Healing target, riddhi key, mantra trigger, repetition counts, direction, time window, and somatic protocol for shlokas 25 through 48. (Only 1–24 were catalogued previously.)

### GR.2 Other Digambar Stotras
Any mention of उवसग्गहारं Stotra (Parshvanath), कल्याणमंदिर स्तोत्र, नमोकार मंत्र jaap counts/fruits for specific purposes, or other healing stotras — with prescribed counts, problems addressed, and vidhi.

### GR.3 Pratikraman Structure
Full layperson procedure — the six essentials (आवश्यक), sutra sequence, रात्रि/तौसिक timing rules, and conditions that invalidate pratikraman.

### GR.4 Samayik Vidhi
Complete procedure — initialization sutras (करेमि भंते sequence), the 10 अतिचार (faults) of samayik with definitions, and the distraction-correction rule linking to pratikraman.

### GR.5 Paushadh Vidhi
Structure and rules of the 24-hour ascetic-day vow (पौषध) for laypeople — allowed/prohibited actions, hourly schedule if given, pachchakhkan structure.

### GR.6 Navagraha Vidhi Details
For each of the 9 bija-mantra jaaps (Surya 7000 … Ketu 17000): best day/time, direction, asana/materials, donation procedure (to whom, when), gemstone wearing ritual — metal, finger, purification. Everything beyond mantra+count already extracted.

### GR.7 Gandant Shanti (Jain Form)
Beyond the Atharva-Veda Agni mantra — does the Jain tradition prescribe any native pacification for Mula/Ashlesha/Jyeshtha/Revati-gandant births (specific puja, daan, vrata)?

### GR.8 Ashtami-Chaudas Vidhi
Specific observances, prohibitions, and fruits of monthly 8th/14th-day vrats; differences between Shukla-paksha and Krishna-paksha observance.

---

## ☀️ G-Suryaprajnapti · Computational Tables

*Engine component: calendarEngine.ts astronomical layer*

### GS.1 Ten-Solstice Table
The COMPLETE table of all 10 solstices across the 5-year yuga — each with month, paksha, tithi, and the Sun's nakshatra. The text gives the first three; extract all ten.

### GS.2 Day-Length Progression
Day/night lengths path-by-path across the Sun's orbital paths — the muhurta progression table from 18:12 down to 12:18 across the 184 paths.

### GS.3 Naksatrodaya Derivation
Derivation of the 1835 nakshatra-days figure per yuga and the method for computing rising-asterism days.

### GS.4 Moon Revolution Distribution
How the 67 lunar circuits per yuga distribute across the 28 nakshatras; nakshatra-entry (भोग) arithmetic if present.

### GS.5 Unit Conversions
The yojana length used (in krosa/modern units), रज्जु definition and magnitude, प्रमाणांगुल value — everything needed to convert cosmological distances into computable units.

### GS.6 Jyotishi-Dev Vitals
The systematically defined आयु (lifespan), आहार (intake), and उच्छ्वास (breathing) numerical values for Sun, Moon, planets, nakshatras, and stars — stated as "systematically defined"; extract the actual numbers.

### GS.7 Meru Shadow Geometry
Any calculations involving Mount Meru's dimensions or shadow affecting day-night lengths for different regions of Bharata Kshetra (relevant to local-time corrections in the engine).

---

## 🎯 G-Scope Arbitration · Presence/Absence Verdicts

*Run FIRST — these decide architecture. An explicit "absent" is as valuable as content.*

### GV.1 Kundali Milan
Does ANY source contain marriage-matching methodology (varna/gana/yoni/tara/nadi scoring between two charts)? If absent, state absence explicitly — this decides whether our engine builds matching or doctrinally refuses it.

### GV.2 Prashnavyakarana Methodology
Beyond nakshatra-kulas — what is this Agama's actual question-answer/prediction apparatus? Extract its complete predictive mechanism (the sutra literally means "analysis of questions").

### GV.3 Ashtakavarga/Shadbala
Confirm presence or absence of point-based strength systems (भिन्नाष्टकवर्ग, सर्वाष्टकवर्ग, षड्बल) anywhere in the sources.

### GV.4 Gemstone Doctrine
The texts prescribe ratnas as worldly remedies — is there ANY statement limiting or endorsing gemstone-wearing within Jain ethics (aparigraha-conflict resolution)?

### GV.5 8-Karma Dasha Grounding ⚠️ CRITICAL
In Shatkhandagama Book 2 / Dhavala, find the Sthiti-Bandha-based allocations producing dasha durations proportional to karmic density. Do the ratios **28 : 15 : 14 : 12 : 10 : 9 : 8 : 4** (Mohaniya : Jnanavaraniya : Antaraya : Naam : Vedaniya : Darshanavaraniya : Gotra : Ayushya) appear in, or derive from, any verse set? If not derivable, state so explicitly — the engine needs to know whether this allocation is canonical or synthesized.

### GV.6 Karmic Density Weights
Extract the Shatkhandagama structural formulas assigning numerical densities/bandha-values to the 8 karmas — the claimed basis for karmaEngine intensity constants (Mohaniya 65, Antaraya 60, etc.).

### GV.7 Tiloyapannatti Ch.4 Birth Data
From Tiloyapannatti Gathas 522–1280, extract each Tirthankara's birth celestial details IF present in your sources — nakshatra, tithi, vara, time, city, parents, complexion, height, lifespan. One consolidated 24-row table. If Chapter 4 excerpts are not loaded, say exactly that.

---

## 📊 Artifact Generation Prompts (run after all modules)

### A5 · Yoga-Karana-Baan Master Table
Generate the complete Yoga + Karana + Baan master data table — all rows, machine-readable columns: `name | type | inputs | condition | effect | varjit-activities | remedy | source`.

### A6 · Arishta Rule Corpus (JSON)
Generate the complete Arishta/Ayur-rule corpus as an if-then JSON schema — every condition→age/outcome rule found in Bharatiya Jyotish, fields: `condition[] | predictedAge | severity | domain`.

### A7 · 28-Nakshatra Master Row
Generate the full 28-nakshatra master row per star: `Prakrit name | Sanskrit | deity | planetary lord | sanjna | gana | yoni | nadi | kula-family | facing-direction | gandant-flag | shubh/ashubh | suited-activities`.

### A8 · Karma-Sthiti Matrix
Generate the complete karma-sthiti matrix: 8 karmas × `{max-sthiti, min-sthiti, abadha-kal, binding-gunasthana-range, udaya-triggers}` from Shatkhandagama/Dhavala with citations.

---

## ✅ Quick Reference — All Prompts at a Glance

| ID | Module | Topic |
|---|---|---|
| GA.1 | Astronomy | Planetary longitudes |
| GA.2 | Astronomy | Retrogression |
| GA.3 | Astronomy | Drishti |
| GA.4 | Astronomy | Conjunction/combustion |
| GA.5 | Astronomy | Uccha-nicha |
| GA.6 | Astronomy | Rahu-Ketu computation |
| GA.7 | Astronomy | Eclipse prediction |
| GA.8 | Astronomy | Micro-time ladder ⚠️ |
| GP.1 | Panchang | 27 Yogas table |
| GP.2 | Panchang | 11 Karanas table |
| GP.3 | Panchang | Dagdha/Vish/Hutashan |
| GP.4 | Panchang | Siddha combos |
| GP.5 | Panchang | Amavasya types |
| GP.6 | Panchang | Panchak |
| GP.7 | Panchang | Gandant spans |
| GP.8 | Panchang | Kshaya/Vriddhi tithi |
| GP.9 | Panchang | 6-Ghati edge cases |
| GP.10 | Panchang | Baan systems |
| GP.11 | Panchang | Yuti dosha/Vedh |
| GP.12 | Panchang | Sankranti |
| GN.1 | Nakshatra | Kula assignments |
| GN.2 | Nakshatra | Avakahada chakra |
| GN.3 | Nakshatra | Navatara operation |
| GN.4 | Nakshatra | Abhijit specifics |
| GN.5 | Nakshatra | Pada system |
| GB.1 | Birth chart | Charakhanda |
| GB.2 | Birth chart | Dasham bhava |
| GB.3 | Birth chart | Bhava sandhi |
| GB.4 | Birth chart | Chalit chakra |
| GB.5 | Birth chart | Divisional charts |
| GB.6 | Birth chart | Pranapada-Gulika |
| GB.7 | Birth chart | Ishtakaal→Lagna example |
| GB.8 | Birth chart | Sampaatik kaal |
| GD.1 | Dasha | Balance formula |
| GD.2 | Dasha | Sub-period formulas |
| GD.3 | Dasha | Yogini/Ashtottari |
| GD.4 | Dasha | Arishta age table |
| GD.5 | Dasha | Ayurdaya |
| GD.6 | Dasha | Karma sthiti bounds |
| GD.7 | Dasha | Four-fold bandha |
| GD.8 | Dasha | Udaya/satta/udirana |
| GG.1 | Gochara | Transit framework |
| GG.2 | Gochara | Saturn-Shravana |
| GG.3 | Gochara | Venus mandalas/veethis |
| GG.4 | Gochara | Muhurta hierarchy |
| GG.5 | Gochara | Hour systems |
| GG.6 | Gochara | Eclipse varjit rules |
| GG.7 | Gochara | Rohini vrat adjustment |
| GK.1 | Karma | Mohaniya→GS blockers |
| GK.2 | Karma | GS duration limits |
| GK.3 | Karma | Leshya ranges |
| GK.4 | Karma | Kashaya durations |
| GK.5 | Karma | Ayushya binding matrix |
| GK.6 | Karma | Tirthankar-nama bhavs |
| GR.1 | Remedies | Bhaktamar 25–48 |
| GR.2 | Remedies | Uvasaggaharam etc. |
| GR.3 | Remedies | Pratikraman |
| GR.4 | Remedies | Samayik + aticharas |
| GR.5 | Remedies | Paushadh |
| GR.6 | Remedies | Navagraha vidhi |
| GR.7 | Remedies | Gandant shanti |
| GR.8 | Remedies | Ashtami-Chaudas |
| GS.1 | Suryaprajnapti | 10 solstice table |
| GS.2 | Suryaprajnapti | Day-length progression |
| GS.3 | Suryaprajnapti | Naksatrodaya |
| GS.4 | Suryaprajnapti | Moon revolutions |
| GS.5 | Suryaprajnapti | Unit conversions |
| GS.6 | Suryaprajnapti | Jyotishi-dev vitals |
| GS.7 | Suryaprajnapti | Meru geometry |
| GV.1 | Scope | Kundali milan |
| GV.2 | Scope | Prashnavyakarana method |
| GV.3 | Scope | Ashtakavarga/Shadbala |
| GV.4 | Scope | Gemstone doctrine |
| GV.5 | Scope | 8-karma dasha grounding ⚠️ |
| GV.6 | Scope | Density weights |
| GV.7 | Scope | TP Ch.4 birth data |
| A5 | Artifact | Yoga/Karana/Baan table |
| A6 | Artifact | Arishta JSON corpus |
| A7 | Artifact | 28-nakshatra master row |
| A8 | Artifact | Karma-sthiti matrix |

---

## Recommended Execution Order

1. **GV.1 – GV.7 first** — scope verdicts may change architecture decisions
2. **GA.8, GP.7, GP.8, GP.9** — unblocks calendar correctness (`calendarEngine`)
3. **GD.6, GD.7, GV.5, GV.6** — validates/refutes current dasha & karma engine constants
4. **GR.1, GR.2** — completes the stotra catalog to full 48-shloka coverage
5. **GB.1 – GB.8** — enables true lagna/bhava computation
6. Remaining modules in any order

॥ जैन ज्योतिष — सत्य की खोज में ॥
