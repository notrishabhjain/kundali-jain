// Karma-Sthiti bounds matrix — Shatkhandagama / Dhavala.
//
// Source: GAP_CLOSING_RESEARCH GD.6 (Dhavala commentary vols. 1–6) + A8 schema,
// cross-checked against the extraction library (M5.4 anchors: Ayushya max =
// 33 Sagaropam; Gotra max = 20 Kodakodi Sagar).
//
// Confidence: VERIFIED per GAP_CLOSING_RESEARCH; verse-level OCR from SKD-Dhavala
// still pending for each individual bound ([REQUIRES_RESEARCH] on final citation pass).
//
// Engine role:
//  - Establishes the doctrinal hierarchy behind JAIN_DASHA_YEARS (dashaEngine.ts):
//    Mohaniya has the longest possible STHITI (70 Kodakodi Sagaropama) → highest
//    dasha allocation (28 yrs); Ayushya is most constrained (33 Sagaropama, and in
//    Pancham Kāl capped ~100+ years of human life) → smallest allocation (4 yrs).
//  - Feeds future udaya/ābādha timing features (Gommatsar Karmakanda mechanics).

export type SthitiBound = {
  minHindi: string;
  maxHindi: string;
  /** Canonical unit string, kept verbatim for provenance. */
  maxCanonical: string;
};

export const ANTARMUHURTA_HINDI = 'अंतर्मुहूर्त (< ४८ मिनट)';

export const KARMA_STHITI_BOUNDS: Record<string, SthitiBound> = {
  Gyanavaraniya: {
    minHindi: ANTARMUHURTA_HINDI,
    maxHindi: '३० कोडाकोडी सागरोपम',
    maxCanonical: '30 Kodakodi Sagaropama'
  },
  Darshanavaraniya: {
    minHindi: ANTARMUHURTA_HINDI,
    maxHindi: '३० कोडाकोडी सागरोपम',
    maxCanonical: '30 Kodakodi Sagaropama'
  },
  Vedaniya: {
    minHindi: '१२ मुहूर्त',
    maxHindi: '३० कोडाकोडी सागरोपम',
    maxCanonical: '30 Kodakodi Sagaropama'
  },
  Mohaniya: {
    minHindi: ANTARMUHURTA_HINDI,
    maxHindi: '७० कोडाकोडी सागरोपम',
    maxCanonical: '70 Kodakodi Sagaropama'
  },
  Ayushya: {
    // Deva/Naraka ayu minimum = 10,000 years; Manushya/Tiryanch minimum = antarmuhurta.
    minHindi: 'अंतर्मुहूर्त (मनुष्य/तिर्यंच) — १०,००० वर्ष (देव/नारक)',
    maxHindi: '३३ सागरोपम (देव/नारक)',
    maxCanonical: '33 Sagaropama (Deva/Naraka)'
  },
  Naam: {
    minHindi: '८ मुहूर्त',
    maxHindi: '२० कोडाकोडी सागरोपम',
    maxCanonical: '20 Kodakodi Sagaropama'
  },
  Gotra: {
    minHindi: '८ मुहूर्त',
    maxHindi: '२० कोडाकोडी सागरोपम',
    maxCanonical: '20 Kodakodi Sagaropama'
  },
  Antaraya: {
    minHindi: ANTARMUHURTA_HINDI,
    maxHindi: '३० कोडाकोडी सागरोपम',
    maxCanonical: '30 Kodakodi Sagaropama'
  }
};

// ─── Four-fold bondage (GD.7) ────────────────────────────────────────────────
// Source: Tattvarthasutra ch. 8 + Samayasara §146 ("the quantity [pradesa] is
// proportional to the activity of yoga") — VERIFIED per GAP_CLOSING_RESEARCH.
export const BANDHA_TYPES: { key: string; hindi: string; driverHindi: string }[] = [
  { key: 'prakriti', hindi: 'प्रकृति-बन्ध', driverHindi: 'कषाय/योग का स्वरूप — कौन-सी प्रकृति बँधी (148 उत्तर-प्रकृतियाँ)' },
  { key: 'sthiti',   hindi: 'स्थिति-बन्ध',   driverHindi: 'बन्ध-क्षण की कषाय-तीव्रता — कितने काल तक बँधी' },
  { key: 'anubhaga', hindi: 'अनुभाग-बन्ध',   driverHindi: 'मिथ्यात्व-तीव्रता — कितनी तीव्रता से फलेगी' },
  { key: 'pradesha', hindi: 'प्रदेश-बन्ध',   driverHindi: 'योग (मन-वचन-काय) की प्रबलता — कितना प्रमाण बँधा' }
];

// ─── Karma state transitions (GD.8) ──────────────────────────────────────────
// Source: Gommatsar Karmakanda §14 (udaya), §22 (udirana); Sarvarthasiddhi §10.1
// (kshaya staging) — VERIFIED per GAP_CLOSING_RESEARCH.
export interface KarmaStateTransition {
  key: 'satta' | 'udaya' | 'udirana' | 'kshaya';
  hindi: string;
  definitionHindi: string;
}

export const KARMA_STATE_TRANSITIONS: KarmaStateTransition[] = [
  { key: 'satta',   hindi: 'सत्ता',   definitionHindi: 'कर्म का भंडार में होना — आदि-काल से समस्त आठों कर्म सत्ता में विद्यमान रहते हैं।' },
  { key: 'udaya',   hindi: 'उदय',     definitionHindi: 'निर्धारित काल आने पर कर्म का स्वाभाविक फलना — भोगने को ही बना होता है।' },
  { key: 'udirana', hindi: 'उदीरण',   definitionHindi: 'गहन तप/भावना/सम्यक-चारित्र से कर्म का पूर्वकाल में फलना — पूरी तीव्रता के बिना निःसरण। यही साधना से निर्जरा की क्रियाविधि है।' },
  { key: 'kshaya',  hindi: 'क्षय',    definitionHindi: 'घाती कर्मों का क्षपक-श्रेणी (गुणस्थान 8–12) में और अघाती कर्मों का अयोगी केवली (गुणस्थान 14) में सम्पूर्ण नाश।' }
];

export function getSthitiBound(karmaEn: string): SthitiBound {
  return KARMA_STHITI_BOUNDS[karmaEn];
}

// ─── Ābādha-kāl & Niṣeka-kāl engine hooks (B.1) ──────────────────────────────
// Source: GAP_CLOSING_RESEARCH B.1 — wire into sadhana intensity / dasha feedback.
//
//  - ĀBĀDHA-KĀL (latency before ripening): exactly 100 years per 1 Sagaropama
//    of bondage density (extraction-library M5.2 anchor, confirmed).
//  - NIṢEKA-KĀL (ripening distribution): the karmic payload discharges with a
//    front-loaded decay — maximum intensity at dasha start, tapering toward the
//    end. The exponential shape is [INFERRED] from the spec's qualitative law;
//    no canonical numeric constant exists.
export const ABADHA_KAAL_YEARS_PER_SAGAROPAMA = 100;

export function abadhaKaalYears(bondageDensitySagaropama: number): number {
  return Math.max(0, bondageDensitySagaropama) * ABADHA_KAAL_YEARS_PER_SAGAROPAMA;
}

/**
 * Front-loaded udaya intensity weight across a dasha's progress.
 * @param progress01 elapsed fraction of the dasha (0 → start, 1 → end)
 * @returns multiplier in (0, 1]: ≈1 at the beginning, decaying toward the end.
 */
export function nisekaUdayaWeight(progress01: number): number {
  const p = Math.min(1, Math.max(0, progress01));
  return Math.exp(-3 * p);
}

// Blueprint §B.1-compatible API: discrete 10-segment ripening curve
// (exp(-0.4·i)) for consumers that sample the dasha in equal slices.
export interface KarmaDashaSpec {
  karmaType: string;
  bondageDensitySagaropama: number;
}

export function calculateDashaRipening(spec: KarmaDashaSpec): {
  abadhaDurationYears: number;
  intensityCurve: number[];
} {
  const abadhaDurationYears = spec.bondageDensitySagaropama * ABADHA_KAAL_YEARS_PER_SAGAROPAMA;
  const intensityCurve: number[] = [];
  for (let i = 0; i < 10; i++) intensityCurve.push(Math.exp(-0.4 * i));
  return { abadhaDurationYears, intensityCurve };
}
