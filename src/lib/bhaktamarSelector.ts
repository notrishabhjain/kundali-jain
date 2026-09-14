// Bhaktamar shloka selection, driven by the birth nakshatra.
//
// ─── What is attested, and what is this engine's own allotment ───────────────
// Three questions have to be kept apart here, because only two of them have a
// source behind them.
//
//   1. Which shlokas address which karma?
//      ATTESTED. The remedial matrix of the Manatunga tradition assigns each
//      shloka a target karma and affliction.
//      Source: BKT-1 (Manatunga Acharya, ~7th c. CE) via GAP_CLOSING_RESEARCH GR.1.
//      NOT Agamic — devotional tradition, and labelled as such.
//
//   2. Which karma dominates for a given nakshatra?
//      ATTESTED. Source: MP-§C1 (nakshatra ↔ karma-type mapping).
//
//   3. Which single shloka of the eligible set is THIS birth's primary?
//      NOT ATTESTED. No catalogued source assigns shlokas to nakshatras or to
//      Tirthankaras, and two rounds of searching found none. So step 3 is this
//      engine's own deterministic allotment and is labelled `sankalita`
//      everywhere it surfaces. It is never presented as tradition.
//
// ─── Why there is no Tirthankara → shloka mapping here ───────────────────────
// A 2-verses-per-Tirthankara allotment across 48 verses and 24 Tirthankaras is
// arithmetically tempting and doctrinally wrong: the Bhaktamar Stotra is a hymn
// to Rishabhanatha alone. Verse 17 does not belong to Kunthunatha in any sense.
// Building that mapping would have manufactured a devotional claim the tradition
// does not make, which Codex constraint C4 forbids. The birth nakshatra reaches
// the shloka through its karma-type instead — both links sourced.
//
// ─── The defect this replaces ────────────────────────────────────────────────
// remedyEngine previously called getBhaktamarForKarma(karma) and took [0],
// discarding every other eligible shloka. Across all 27 nakshatras that surfaced
// 8 distinct shlokas out of 48. The eligible sets were already computed; they
// were simply thrown away.

import { NAKSHATRAS, type Nakshatra } from '../data/nakshatras';
import {
  BHAKTAMAR_SHLOKAS,
  KARMA_TO_BHAKTAMAR,
  getBhaktamarShloka,
  type BhaktamarShloka,
} from '../data/sadhana';
import {
  BHAKTAMAR_TRADITIONAL_ASSIGNMENTS,
  type TraditionalBhaktamarAssignment,
} from '../data/bhaktamarTraditionalAssignments';

/** A shloka eligible for a birth, in either of the two catalogue shapes. */
export interface BhaktamarCandidate {
  shlokaNumber: number;
  name: string;
  targetAffliction: string;
  repetitionShloka: number;
  direction: string;
  timeWindow: string;
  /** 'full' rows carry verse text, riddhi mantra and an anusthana protocol. */
  detail: 'full' | 'traditional';
  /** true while the Sanskrit first line is still awaiting OCR from a print edition. */
  versePending: boolean;
  // Full catalogue rows are attached to the PRIMARY only. Alternates are
  // rendered as a summary (number, name, affliction, count, direction, timing),
  // so shipping the whole row with them would put text into the payload that no
  // surface renders — including `sanskritVerse`, one of which is a known
  // misattribution flagged [REQUIRES_RESEARCH] in sadhana.ts. Keeping the
  // payload to what is actually displayed is what lets check-doctrine's D5 scan
  // mean something: everything it sees is something a user could read.
  full?: BhaktamarShloka;
  traditional?: TraditionalBhaktamarAssignment;
}

/** Strip the full catalogue row, leaving the fields the alternates list renders. */
function asSummary(c: BhaktamarCandidate): BhaktamarCandidate {
  const { full: _f, traditional: _t, ...summary } = c;
  return summary;
}

export interface BhaktamarPrescription {
  /** The one allotted to this birth. Allotment is sankalita; eligibility is not. */
  primary?: BhaktamarCandidate;
  /** Every other eligible shloka for this karma. Previously discarded entirely. */
  alternates: BhaktamarCandidate[];
  /** Karma that determined eligibility. */
  karma: string;
  /** Hindi provenance line shown beside the prescription. */
  provenanceHindi: string;
}

function fromFull(s: BhaktamarShloka): BhaktamarCandidate {
  return {
    shlokaNumber: s.shlokaNumber,
    name: s.name,
    targetAffliction: s.targetAffliction,
    repetitionShloka: s.repetitionShloka,
    direction: s.direction,
    timeWindow: s.timeWindow,
    detail: 'full',
    versePending: false,
    full: s,
  };
}

function fromTraditional(t: TraditionalBhaktamarAssignment): BhaktamarCandidate {
  return {
    shlokaNumber: t.shlokaNumber,
    name: t.name,
    targetAffliction: t.targetAffliction,
    repetitionShloka: t.repetitionShloka,
    direction: t.direction,
    timeWindow: t.timeWindow,
    detail: 'traditional',
    versePending: t.sanskritVersePending,
    traditional: t,
  };
}

/**
 * Every shloka the tradition assigns to a karma, from BOTH catalogues.
 *
 * KARMA_TO_BHAKTAMAR covers shlokas 1–24, 45 and 48. The 22 traditional
 * assignments for 25–47 carry their own `targetKarma` from the same GR.1
 * extraction but were never added to that table, so nothing could reach them.
 * Both are consulted here; the union is the eligible set.
 */
export function getEligibleShlokas(karmaEn: string): BhaktamarCandidate[] {
  const seen = new Set<number>();
  const out: BhaktamarCandidate[] = [];

  for (const n of KARMA_TO_BHAKTAMAR[karmaEn] ?? []) {
    const s = getBhaktamarShloka(n);
    if (s && !seen.has(n)) { seen.add(n); out.push(fromFull(s)); }
  }
  for (const s of BHAKTAMAR_SHLOKAS) {
    if (!seen.has(s.shlokaNumber) && s.targetKarma?.includes(karmaEn)) {
      seen.add(s.shlokaNumber); out.push(fromFull(s));
    }
  }
  for (const t of BHAKTAMAR_TRADITIONAL_ASSIGNMENTS) {
    if (!seen.has(t.shlokaNumber) && t.targetKarma?.includes(karmaEn)) {
      seen.add(t.shlokaNumber); out.push(fromTraditional(t));
    }
  }

  return out.sort((a, b) => a.shlokaNumber - b.shlokaNumber);
}

/**
 * Allot one shloka of the eligible set to a birth nakshatra.
 *
 * SANKALITA. The rotation by nakshatra index is this engine's own rule, chosen
 * because it is deterministic, total, and spreads births across the eligible set
 * instead of collapsing them onto its first element. It carries no doctrinal
 * claim that a given star "owns" a given verse, and the UI says so.
 *
 * Deterministic in the strict sense: the same nakshatra always yields the same
 * shloka, so two readings of one birth never disagree.
 */
export function allotShloka(
  nakshatraIndex: number,
  eligible: BhaktamarCandidate[],
): BhaktamarCandidate | undefined {
  if (eligible.length === 0) return undefined;
  return eligible[((nakshatraIndex % eligible.length) + eligible.length) % eligible.length];
}

const KARMA_HINDI: Record<string, string> = {
  'Gyanavaraniya': 'ज्ञानावरणीय', 'Darshanavaraniya': 'दर्शनावरणीय', 'Vedaniya': 'वेदनीय',
  'Mohaniya': 'मोहनीय', 'Ayushya': 'आयुष्य', 'Naam': 'नाम', 'Gotra': 'गोत्र',
  'Antaraya': 'अंतराय', 'Charitra Mohaniya': 'चारित्र मोहनीय',
  'Sarva karma kshay': 'सर्व कर्म क्षय'
};

export function selectBhaktamarForBirth(
  nakshatra: Nakshatra,
  dominantKarmaEn: string,
): BhaktamarPrescription {
  const karma = dominantKarmaEn || nakshatra.karma_type;
  const eligible = getEligibleShlokas(karma);
  const primary = allotShloka(nakshatra.index, eligible);
  const alternates = eligible
    .filter((c) => c.shlokaNumber !== primary?.shlokaNumber)
    .map(asSummary);

  return {
    primary,
    alternates,
    karma,
    provenanceHindi:
      `पात्रता (कौन-से श्लोक इस कर्म हेतु हैं) मानतुंगाचार्य की परम्परागत भक्तामर ` +
      `चिकित्सा-सूची से है। किन्तु इनमें से कौन-सा श्लोक आपका प्रमुख है — यह इस ` +
      `संगणक का अपना संकलित नियम है, किसी शास्त्र का विधान नहीं। ` +
      `शेष ${alternates.length} श्लोक भी आपके ${KARMA_HINDI[karma] ?? karma} कर्म हेतु समान रूप से विहित हैं।`,
  };
}

/** Distinct shlokas any birth can be allotted — used by the reachability guard. */
export function measureBhaktamarReach(): { primaries: Set<number>; eligible: Set<number> } {
  const primaries = new Set<number>();
  const eligible = new Set<number>();
  for (const n of NAKSHATRAS) {
    const e = getEligibleShlokas(n.karma_type);
    e.forEach((c) => eligible.add(c.shlokaNumber));
    const p = allotShloka(n.index, e);
    if (p) primaries.add(p.shlokaNumber);
  }
  return { primaries, eligible };
}
