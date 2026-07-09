---
source_id: RESEARCH-REPORT-2025
title: "Computational Specification and Architectural Core of a Jain Kundali Application"
author: "User research compilation"
date_extracted: "2026-07-09"
topics:
  - panch_samvay
  - graha_karma_mapping
  - ishtakaal
  - jain_sidereal_geometry
  - bhadrabahu_samhita_transits
  - netrarogi_yogas
  - bhaktamar_stotra_matrix
engine_coverage:
  - src/data/jainCosmology.ts
  - src/data/sadhana.ts (BHAKTAMAR_SHLOKAS)
  - src/lib/remedyEngine.ts
  - src/lib/analysisSynthesizer.ts (ishtakaal, jainZodiacProjection)
  - android/.../data/JainCosmologyData.kt
  - android/.../engine/RemedyEngine.kt
status: "implemented"
---

# Computational Specification and Architectural Core of a Jain Kundali Application

## Philosophical Paradigm and Karmic Logic Engine

The computation of a Jain horoscope (Kundali) requires a fundamental departure from
the deterministic assumptions of classical Vedic astrology. In the Jain metaphysical
framework, celestial bodies do not act as causal agents — instead, the system is
constructed on the doctrine of **Nimitta Gyana** (indicative science), positioning
planetary configurations as a passive cosmic mirror reflecting the transmigrating
soul's accumulated past karma.

## Panch Samvay (Five-fold Causality Matrix)

All worldly occurrences are governed by the interaction of five distinct vectors:

1. **Kaal** — The chronological dimension (current Ara, tithi, nakshatra, dasha)
2. **Swabhav** — Intrinsic disposition and natural capacity of substances (nakshatra nature, gunasthana)
3. **Purakrit** — Specific feedback loops from past karmic acquisitions (8 karmas in Udaya/Satta/Nirjara)
4. **Niyati** — Inevitable progression of cosmological and material laws (planetary positions, dasha)
5. **Pursharth** — Conscious human exertion and free will (sadhana, remedies — the dynamic interface)

The engine treats the first four as fixed coordinate system; **Pursharth** is the open
interface where spiritual remedies are applied. [Implemented in PANCH_SAMVAY in jainCosmology.ts]

## Planetary → Karma Mapping (Karma-Graha Table)

| Karma Class | Karma Name | Metaphysical Function | Astrological Indicator |
|-------------|------------|----------------------|------------------------|
| Ghati | Jnanavaraniya | Obscures infinite knowledge | Mercury + Jupiter afflictions |
| Ghati | Darshanavaraniya | Obscures infinite perception | Sun + Moon (luminaries of consciousness) |
| Ghati | Mohaniya | Obscures right belief and conduct | Venus + Mars (emotional/relational/physical drives) |
| Ghati | Antaraya | Obscures infinite energy | Saturn (constraint and delay) |
| Aghati | Vedaniya | Generates sensory pleasure/pain | Moon (transit and natal) |
| Aghati | Nama | Determines physical form | Ascendant (Lagna) + Ascendant Lord |
| Aghati | Gotra | Dictates family lineage and social status | Sun relationship to 9th and 10th houses |
| Aghati | Ayushya | Defines life span | Saturn's placement + longevity parameters |

[Implemented in GRAHA_KARMA_MAPPINGS in jainCosmology.ts]

## High-Precision Temporal Coordinate Subsystem

### Ishtakaal Calculation
- Mathematical anchor: precise moment of **umbilical cord severance**
- Formula: Ishtakaal in Ghatis = ΔT × 2.5 (where ΔT = hours elapsed since sunrise)
- Pala: fractional remainder × 60
- Time units: Samaya → Avali → Ucchvasa → Stoka → Lava → Ghati → Muhurta → Ahoratra
- 1 Muhurta = 48 minutes; 1 Ghati = 24 minutes; 30 Muhurtas = 1 Ahoratra

[Implemented in calculateIshtakaal() in jainCosmology.ts]

## Sidereal Geometry and Zodiacal Graduation Engine

Source texts: Surya Prajnapti + Jambudvipa Prajnapti

Key differences from standard Vedic model:
1. **28 Nakshatras** (includes Abhijit, α Lyrae)
2. **Unequal muhurta spans** (not equal 13°20' each)
3. **Shravana-first ordering** (epoch ~500 BCE)
4. **Summer solstice epoch** (vs Vedanga Jyotisha winter solstice)
5. **Total circumference: 819 + 11/67 muhurtas ≈ 819.164179 muhurtas**

### Nakshatra Classes
| Class | Nakshatras | Zodiac Stretch | Solar Conj. Duration |
|-------|-----------|----------------|---------------------|
| Abhijit | Abhijit (α Lyrae) | 9 + 11/67 muhurtas | 4 days 6 muhurtas |
| Short Span (6) | Satabhisha, Bharani, Ardra, Aslesha, Svati, Jyestha | 15 muhurtas | 6 days 21 muhurtas |
| Long Span (6) | Uttarabhadrapada, Uttaraphalguni, Uttarashadha, Punarvasu, Rohini, Vishakha | 45 muhurtas | 20 days 3 muhurtas |
| Standard (15) | All others | 30 muhurtas | 13 days 12 muhurtas |

Verification: (1 × 9+11/67) + (6×15) + (6×45) + (15×30) = 819 + 11/67 ✓

[Implemented in JAIN_NAKSHATRAS_ORDERED + calculateJainZodiacProjection() in jainCosmology.ts]

## Bhadrabahu Samhita: Predictive and Mundane Rule Processing Unit

### Saturn in Shravana Transit Rule
- **Trigger**: Saturn within Shravana nakshatra (280°00' to 293°20' sidereal)
- **Indicator**: High-risk states for institutional leaders, prime ministers, chief executives, religious heads
- [REQUIRES_RESEARCH] BDS-1 OCR pending; not yet implemented

### Venus Solar Ingress (6 Mandala System)
Mandalas based on Venus's nakshatra at solar inferior conjunction:
1. **Rakta**: Bharani, Krittika, Rohini, Mrigshira → Ordinary rain and yields
2. **Parush**: Ardra, Punarvasu, Pushya, Ashlesha → Destruction of wealth/water/agriculture
3. **Deeptimaan**: Magha, Purvaphalguni, Uttaraphalguni, Hasta, Chitra → Pathogen outbreaks
4. **Urdhva**: Svati, Vishakha, Anuradha → Excellent productivity and stability
5. **Chanda**: Jyestha, Mula, Poorvashadha, Uttarashadha → Civil unrest, water scarcity
6. **Teekshna**: Abhijit, Shravana, Dhanistha, Satabhisha, Purvabhadrapada, Revati, Ashwini → Highly favorable

[Implemented in VENUS_MANDALAS in jainCosmology.ts; transit tracking requires live ephemeris — Phase 3]

### Venus Veethi (Orbital Lane)
- **Naagveethi**: Ashwini, Bharani, Krittika
- **Gajveethi**: Rohini, Mrigshira, Ardra
- **Airavatveethi**: Punarvasu, Pushya, Ashlesha

[Implemented in VENUS_VEETHIS in jainCosmology.ts]

## Astro-Somatic Diagnostic Engine (Netrarogi Yogas)

Five vision pathology diagnostics (requires house calculation — Phase 3):

1. **Dhanika Va Netrarogi Yoga**: Sun conjunct Moon in 9th house → conjunctivitis, eye inflammation
2. **Pranapada Vyaya Yoga**: Pranapada Lagna in 12th house → progressive vision loss, blindness
3. **Kuja Labe Netrarogi Yoga**: Mars in 11th house (masculine sign) → glaucoma, traumatic injuries
4. **Shani Chakshus Yoga**: Saturn in 2nd house + aspected by Sun → right eye pathology, night blindness
5. **Jaimini Shukra-Rahu Yoga**: Rahu in 2nd/12th from Venus + Sun aspect → cataracts, total blindness

[NOT YET IMPLEMENTED — requires house placement calculation; planned for Phase 3]

## Bhaktamar Stotra Remedial Matrix

The 48-verse hymn by Manatunga Acharya (4 fragments × 14 letters = 2,688 letters total).
Each shloka carries an acoustic vibration (mantra) mapped to specific planetary afflictions:

| Shloka | Target Affliction | Karma | Repetitions |
|--------|------------------|-------|-------------|
| 3 | Eye clarity, Sun/Moon/Rahu affliction | Darshanavaraniya | Shloka 27×, Riddhi 108×, Mantra 108× |
| 5 | Severe eye disease, cataracts | Darshanavaraniya, Vedaniya | Shloka 21×, Riddhi 108×, Mantra 108× |
| 6 | Cognitive enhancement, Mercury/Jupiter | Gyanavaraniya | Shloka 27×, Riddhi 108×, Mantra 108× |
| 12 | Marital harmony, Venus/7th house | Mohaniya | Shloka 12×, Riddhi 108×, Mantra 108× |
| 17 | Gastrointestinal, Jupiter/Saturn | Vedaniya | Shloka 17×, Riddhi 108×, Mantra 108× |
| 18 | Mental blocks, 12th house stress | Mohaniya | Shloka 18×, Riddhi 108×, Mantra 108× |
| 19 | Career progression, 10th house/Sun | Antaraya | Shloka 19×, Riddhi 108×, Mantra 108× |
| 45 | Chronic/life-threatening disease, Saturn/Rahu | Ayushya, Vedaniya | Shloka 45×, Riddhi 108×, Mantra 108× |
| 48 | Material abundance, spiritual liberation | Antaraya, Gotra | Shloka 48×, Riddhi 108×, Mantra 108× |

Shloka 3 execution parameters:
- Direction: North-East (Ishan Kona)
- Time: 4:00–7:00 AM
- Protocol: Place water vessel in front; after chanting apply to eyes and consume daily
- Diet: Salt-free for 21 days; light-colored clothing
- Duration: 21 days

[Implemented in BHAKTAMAR_SHLOKAS + getBhaktamarForKarma() in sadhana.ts and JainCosmologyData.kt]

## Implementation Status vs Research Coverage

| Research Module | Implementation Status |
|----------------|----------------------|
| Panch Samvay framework | ✅ jainCosmology.ts |
| Planetary → Karma mapping | ✅ jainCosmology.ts |
| Ishtakaal calculation | ✅ jainCosmology.ts + analysisSynthesizer.ts |
| Jain sidereal geometry (28 nakshatras, unequal spans) | ✅ jainCosmology.ts |
| Bhaktamar Stotra remedial matrix (9 shlokas) | ✅ sadhana.ts + remedyEngine.ts |
| Venus Mandala system | ✅ Data in jainCosmology.ts; transit tracking Phase 3 |
| Venus Veethi system | ✅ Data in jainCosmology.ts; transit tracking Phase 3 |
| Saturn in Shravana rule | 🔶 Data in jainCosmology.ts; BDS-1 OCR [REQUIRES_RESEARCH] |
| Netrarogi Yogas (5 house-based diagnostics) | ❌ Requires house calculation — Phase 3 |
| Cometary trajectory tracking | ❌ Requires live ephemeris — Phase 3 |
