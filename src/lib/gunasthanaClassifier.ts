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
  questionnaireInput?: Partial<GunasthanaInput>
): number {
  const inferred = inferGunasthanaInputs(nakshatraNature, dashaLord);
  const merged: GunasthanaInput = {
    mithyatva:    questionnaireInput?.mithyatva    ?? inferred.mithyatva,
    avirati:      questionnaireInput?.avirati      ?? inferred.avirati,
    kashayaLevel: questionnaireInput?.kashayaLevel ?? inferred.kashayaLevel,
  };
  return classifyGunasthana(merged);
}
