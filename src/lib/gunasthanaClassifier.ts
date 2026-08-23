// Sarvarthasiddhi-based Gunasthana classifier.
// Source: PARITY-REPORT-2026 §"GunasthanaClassifier (Sarvarthasiddhi Criteria)"
//
// Replaces the 4-branch nakshatra-bucket heuristic in analysisSynthesizer.ts.
// The 3 axes are set either from:
//   (a) user self-assessment questionnaire (preferred), OR
//   (b) inference from birth nakshatra + active dasha (fallback).
//
// Axis definitions (Sarvarthasiddhi §1.1-1.8):
//   mithyatva   : 0=samyak-darshan established, 1=wavering/mishra, 2=mild false belief, 3=strong false belief
//   avirati     : 0=mahavrata, 1=anuvrata (deshavirati), 2=no vows
//   kashayaLevel: 0=only sanjvalana-lobha, 1=sanjvalana, 2=pratyakhyana/apratyakhyana, 3=anantanubandhi

export interface GunasthanaInput {
  mithyatva: 0 | 1 | 2 | 3;
  avirati: 0 | 1 | 2;
  kashayaLevel: 0 | 1 | 2 | 3;
}

/**
 * Classify gunasthana from the 3 Sarvarthasiddhi axes.
 * Returns 1–14; in Pancham Kāl the practical ceiling is 5.
 * Source: PARITY-REPORT-2026 §"GunasthanaClassifier".
 */
export function classifyGunasthana(input: GunasthanaInput): number {
  const { mithyatva, avirati, kashayaLevel } = input;

  // Gunasthana 1 — Mithyādrshti: strong false belief or anantanubandhi active
  if (mithyatva === 3 || kashayaLevel === 3) return 1;

  // Gunasthana 3 — Mishrādrshti: wavering / mixed state
  if (mithyatva === 1) return 3;

  // Gunasthana 2 — Sāsādana: mild false belief (samyak-darshan once had, now fallen)
  if (mithyatva === 2) return 2;

  // At this point mithyatva === 0 (samyak-darshan present)

  // Gunasthana 4 — Avirāti Samyagdrshti: right belief, no vows, strong passion
  if (avirati === 2) return 4;

  // Gunasthana 5 — Deshavirati: partial vows taken (anuvrata), passion at pratyakhyana level
  if (avirati === 1 && kashayaLevel >= 2) return 5;

  // Gunasthana 6/7 — Full monk (avirati=0) with remaining passions
  if (avirati === 0 && kashayaLevel === 2) return 6;
  if (avirati === 0 && kashayaLevel === 1) return 7;

  // Gunasthana 10 — Sūkshma Sāmparāya: only subtle lobha
  if (avirati === 0 && kashayaLevel === 0) return 10;

  return 4; // safe fallback: right-faith with some restraint
}

/**
 * Infer the 3 axes from available birth-chart signals when no questionnaire
 * data is present. This is a best-effort approximation — the questionnaire
 * path is always preferred.
 * Source: PARITY-REPORT-2026 §"Fallback Inference from Nakshatra+Dasha".
 */
export function inferGunasthanaInputs(
  nakshatraNature: string,
  dashaLord: string
): GunasthanaInput {
  // Mithyatva: param_shubha nakshatra suggests greater receptivity to samyak-darshan
  let mithyatva: GunasthanaInput['mithyatva'] = 2;
  if (nakshatraNature === 'param_shubha') mithyatva = 0;
  else if (nakshatraNature === 'shubha')  mithyatva = 1;
  else if (nakshatraNature === 'mishra')  mithyatva = 2;
  else                                     mithyatva = 3;

  // Avirati: most people in Pancham Kal hold no formal vows (avirati=2).
  // A param_shubha nakshatra hints at the householder vow stage (avirati=1).
  const avirati: GunasthanaInput['avirati'] =
    nakshatraNature === 'param_shubha' ? 1 : 2;

  // Kashaya: destructive dasha lords escalate the kashaya estimate.
  let kashayaLevel: GunasthanaInput['kashayaLevel'] = 2;
  if (dashaLord === 'Mohaniya' || dashaLord === 'Antaraya') {
    kashayaLevel = 3;
  } else if (dashaLord === 'Gyanavaraniya' || dashaLord === 'Darshanavaraniya') {
    kashayaLevel = 2;
  } else if (nakshatraNature === 'param_shubha') {
    kashayaLevel = 1;
  }

  return { mithyatva, avirati, kashayaLevel };
}

/**
 * Full pipeline: infer inputs from chart signals and return gunasthana estimate.
 * Call with optional questionnaire overrides when available.
 */
export function estimateGunasthana(
  nakshatraNature: string,
  dashaLord: string,
  questionnaireInput?: Partial<GunasthanaInput>,
  activeMohaniyaSubtypes?: string[]
): number {
  const inferred = inferGunasthanaInputs(nakshatraNature, dashaLord);
  const merged: GunasthanaInput = {
    mithyatva:    questionnaireInput?.mithyatva    ?? inferred.mithyatva,
    avirati:      questionnaireInput?.avirati      ?? inferred.avirati,
    kashayaLevel: questionnaireInput?.kashayaLevel ?? inferred.kashayaLevel,
  };
  const base = classifyGunasthana(merged);
  // Blueprint §B.3 — cap the estimate by the active Mohaniya sub-types.
  if (activeMohaniyaSubtypes && activeMohaniyaSubtypes.length > 0) {
    return capGunasthanaByMohaniya(base, activeMohaniyaSubtypes);
  }
  return base;
}

// ─── Mohaniya sub-type → Gunasthana blocking matrix (B.3) ─────────────────────
// Source: blueprint §B.3 (Sarvarthasiddhi + Gommatsar staging) — each active
// deluding sub-type caps the maximum reachable gunasthana.
export interface GunasthanaBlockRule {
  karmaSubtype: string;
  maxGunasthanaAllowed: number;
}

export const MOHANIYA_GUNASTHANA_MATRIX: GunasthanaBlockRule[] = [
  { karmaSubtype: 'Mithyatva',                          maxGunasthanaAllowed: 1 },
  { karmaSubtype: 'Samyaktva-Mithyatva',                maxGunasthanaAllowed: 2 },
  { karmaSubtype: 'Samyaktva',                          maxGunasthanaAllowed: 3 },
  { karmaSubtype: 'Anantanubandhi Krodha',              maxGunasthanaAllowed: 3 },
  { karmaSubtype: 'Anantanubandhi Mana',                maxGunasthanaAllowed: 3 },
  { karmaSubtype: 'Anantanubandhi Maya',                maxGunasthanaAllowed: 3 },
  { karmaSubtype: 'Anantanubandhi Lobha',               maxGunasthanaAllowed: 3 },
  { karmaSubtype: 'Apratyakhyana Krodha',               maxGunasthanaAllowed: 4 },
  { karmaSubtype: 'Apratyakhyana Mana',                 maxGunasthanaAllowed: 4 },
  { karmaSubtype: 'Apratyakhyana Maya',                 maxGunasthanaAllowed: 4 },
  { karmaSubtype: 'Apratyakhyana Lobha',                maxGunasthanaAllowed: 4 },
  { karmaSubtype: 'Pratyakhyana Krodha',                maxGunasthanaAllowed: 5 },
  { karmaSubtype: 'Pratyakhyana Mana',                  maxGunasthanaAllowed: 5 },
  { karmaSubtype: 'Pratyakhyana Maya',                  maxGunasthanaAllowed: 5 },
  { karmaSubtype: 'Pratyakhyana Lobha',                 maxGunasthanaAllowed: 5 },
  { karmaSubtype: 'Sanjvalana Krodha',                  maxGunasthanaAllowed: 9 },
  { karmaSubtype: 'Sanjvalana Mana',                    maxGunasthanaAllowed: 9 },
  { karmaSubtype: 'Sanjvalana Maya',                    maxGunasthanaAllowed: 9 },
  { karmaSubtype: 'Sanjvalana Lobha',                   maxGunasthanaAllowed: 10 }
];

/**
 * Cap a classified gunasthana by every ACTIVE Mohaniya sub-type's ceiling
 * (blueprint §B.3). The soul cannot reside above the block of any passion
 * still operating in it.
 */
export function capGunasthanaByMohaniya(
  classifiedGsn: number,
  activeSubtypes: string[]
): number {
  let cap = 14;
  for (const raw of activeSubtypes) {
    const key = raw.trim().toLowerCase();
    const rule = MOHANIYA_GUNASTHANA_MATRIX.find(r =>
      r.karmaSubtype.toLowerCase() === key ||
      key.startsWith(r.karmaSubtype.toLowerCase())
    );
    if (rule) cap = Math.min(cap, rule.maxGunasthanaAllowed);
  }
  return Math.min(classifiedGsn, cap);
}

// ─────────────────────────────────────────────────────────────────────────────
// Interactive questionnaire-driven classifier
// Source: Master Engineering Specification §4 "Interactive Gunasthana Classifier"
// Based on Sarvarthasiddhi and Shatkhandagama.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Input from the three-axis self-assessment questionnaire.
 * Source: Master Engineering Specification §4.2
 */
export interface AssessmentInput {
  mithyatvaAxisScore: number;    // 0 = body-identified, 3 = unwavering inner conviction
  aviratiAxisScore: number;      // 0 = no vows, 1 = partial, 2 = rigorous commitment
  kashayaIntensityScore: number; // 0 = fleeting flash, 3 = months of resentment
}

export interface GunasthanaResult {
  gunasthana: number;
  title: string;
  description: string;
}

/**
 * Rule-based Gunasthana classifier from §4.2 of Master Engineering Specification.
 * Replaces the legacy nakshatra-bucket heuristic with questionnaire-driven logic.
 */
export class GunasthanaClassifier {
  public evaluateGunasthana(assessment: AssessmentInput): GunasthanaResult {
    const { mithyatvaAxisScore, aviratiAxisScore, kashayaIntensityScore } = assessment;

    // Stage 1: body-identified or month-long anger = Mithyādrshti
    if (mithyatvaAxisScore === 0 || kashayaIntensityScore === 3) {
      return {
        gunasthana: 1,
        title: 'Mithyādṛṣṭi',
        description: 'Wrong Belief: Complete spiritual delusion, confusion of self with body.',
      };
    }

    // Stage 2: intellectual acceptance but doubt descending = Sāsvādana
    if (mithyatvaAxisScore === 1 && kashayaIntensityScore === 2) {
      return {
        gunasthana: 2,
        title: 'Sāsvādana-Samyagdṛṣṭi',
        description: 'Taste of Right Belief: Transient recollection, falling toward Stage 1.',
      };
    }

    // Stage 3: oscillating belief = Miśradṛṣṭi
    if (mithyatvaAxisScore === 2 && kashayaIntensityScore <= 2) {
      return {
        gunasthana: 3,
        title: 'Miśradṛṣṭi',
        description: 'Mixed Belief: Alternating between correct and wrong belief frameworks.',
      };
    }

    // Stage 4: firm faith, no vow commitment = Avirata-Samyagdṛṣṭi
    if (mithyatvaAxisScore === 3 && aviratiAxisScore === 0 && kashayaIntensityScore <= 2) {
      return {
        gunasthana: 4,
        title: 'Avirata-Samyagdṛṣṭi',
        description: 'Right Belief without Control: firm understanding but vows are not implemented.',
      };
    }

    // Stage 5: firm faith with active householder vows = Deśavirata
    if (mithyatvaAxisScore === 3 && aviratiAxisScore >= 1 && kashayaIntensityScore <= 1) {
      return {
        gunasthana: 5,
        title: 'Deśavirata',
        description: 'Partial Self-Control: Observance of layman vows; active spiritual progression.',
      };
    }

    // Safe fallback
    return {
      gunasthana: 1,
      title: 'Mithyādṛṣṭi',
      description: 'Wrong Belief: Default baseline state.',
    };
  }
}

/** Singleton instance for convenience. */
export const gunasthanaClassifier = new GunasthanaClassifier();

// ─────────────────────────────────────────────────────────────────────────────
// Questionnaire specification (JSON-serializable)
// Source: Master Engineering Specification §4.1
// ─────────────────────────────────────────────────────────────────────────────
export const GUNASTHANA_QUESTIONNAIRE = {
  surveyId: 'Jain_Spiritual_State_Assessment',
  dimensions: [
    {
      dimension: 'Shraddha',
      questions: [
        {
          qId: 'S1',
          text: 'Do you identify the eternal self (Ātmā) as fundamentally distinct from the physical body (Pudgala)?',
          options: [
            { text: 'Absolute identification with body and worldly roles', score: 0, axis: 'Mithyatva' },
            { text: 'Intellectual acceptance but frequent emotional doubt', score: 2, axis: 'Mithyatva' },
            { text: 'Unwavering internal realization and conviction', score: 3, axis: 'Mithyatva' },
          ],
        },
      ],
    },
    {
      dimension: 'Conduct',
      questions: [
        {
          qId: 'C1',
          text: 'Identify your level of active commitment to the five householder vows (Anuvratas):',
          options: [
            { text: 'No formal vows; actions guided by personal convenience', score: 0, axis: 'Avirati' },
            { text: 'Partial commitment (e.g., vegetarianism, basic honesty)', score: 1, axis: 'Avirati' },
            { text: 'Rigorous commitment with defined parameters', score: 2, axis: 'Avirati' },
          ],
        },
      ],
    },
    {
      dimension: 'Kashaya',
      questions: [
        {
          qId: 'K1',
          text: 'What is the typical duration and resolution cycle of your anger or resentment?',
          options: [
            { text: 'Resentment persists for months, impacting relationships', score: 3, axis: 'Intensity' },
            { text: 'Anger fades within weeks, allowing for resolution', score: 2, axis: 'Intensity' },
            { text: 'Anger resolves within days through conscious effort', score: 1, axis: 'Intensity' },
            { text: 'Anger arises as a fleeting flash, resolving instantly', score: 0, axis: 'Intensity' },
          ],
        },
      ],
    },
  ],
};
