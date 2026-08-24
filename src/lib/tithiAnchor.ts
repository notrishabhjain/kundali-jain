// Tithi anchoring (vyāpinī rules) — which moment of the day decides the tithi
// a parva is observed on.
//
// A tithi is a 12° arc of Moon−Sun elongation, so it starts and ends at
// arbitrary clock times and rarely aligns with a civil day. Panchāng therefore
// fixes an ANCHOR: the tithi running at that moment names the day. Different
// observances use different anchors, and using the wrong one shifts a festival
// by a full day.
//
// Source: GAP_CLOSING_RESEARCH §GP.8/§GP.9 (kṣaya/vṛddhi handling and the
// ṣaḍghaṭī rule); standard Digambar panchāng practice.
//
//   udaya    — the tithi running at SUNRISE. The general rule, and the default
//              for vratas, upavāsa days, and aṣṭamī/caturdaśī parva tithis.
//   pradosha — the tithi running during the ~2.4 ghaṭī after SUNSET. Used for
//              observances performed after dark, such as the Hindu Lakṣmī Pūjā
//              on Dīpāvalī evening.
//   nishitha — the tithi running at local MIDNIGHT. Used for night observances
//              such as Śarada Pūrṇimā moon-viewing.
//   madhyahna— the tithi running at local apparent noon. Used for a few midday
//              observances.
//
// CORRECTION, recorded because the first version of this file got it wrong.
// Mahāvīra Nirvāṇa Kalyāṇaka was initially assigned `pradosha` on the assumption
// that the Jain observance follows the same evening rule as the Lakṣmī Pūjā. It
// does not: Mahāvīra attained nirvāṇa in the early hours before dawn and the
// Nirvāṇa Laḍḍū is offered on the MORNING of Dīpāvalī, so the observance is
// udaya-vyāpinī. The two can therefore fall on different civil days — in 2023
// the Lakṣmī Pūjā evening was 12 November while Nirvāṇa Kalyāṇaka was observed
// on 13 November.
//
// Verified against published tithi windows: for 2023 the Amāvasyā ran 14:46 on
// 12 Nov to 14:58 on 13 Nov, and this engine reproduces both boundaries to
// within minutes; Śarada Pūrṇimā 2024 begins 20:40 on 16 Oct, which is why that
// row needs `nishitha` and resolves one tithi short under a sunrise rule. In
// every case the engine's elongation was already right and the anchor was the
// missing rule.

import { toJulianDay, getElongation } from './astronomy';
import { calculateApparentSunTimes } from './sunriseEngine';

export type TithiAnchor = 'udaya' | 'pradosha' | 'nishitha' | 'madhyahna';

export interface AnchoredTithi {
  /** 1–15 within the paksha */
  tithiNum: number;
  paksha: 'शुक्ल' | 'कृष्ण';
  /** 0–29 across the lunar month */
  tithiIndex: number;
  elongation: number;
  /** local clock hour the anchor resolved to */
  anchorLocalHour: number;
  anchor: TithiAnchor;
}

/** Duration of the pradoṣa window after sunset, in hours (≈ 2.4 ghaṭī). */
const PRADOSHA_HOURS = 0.96;

/**
 * Local clock hour (decimal, may exceed 24 for post-midnight anchors) at which
 * the given anchor falls on `dateStr` at the given coordinates.
 */
export function anchorLocalHour(
  dateStr: string,
  anchor: TithiAnchor,
  lat: number,
  lng: number,
  utcOffsetHours = 5.5
): number {
  const sun = calculateApparentSunTimes(dateStr, lat, lng, 0, utcOffsetHours);

  switch (anchor) {
    case 'udaya':
      // Polar edge cases cannot yield a sunrise; fall back to 06:00 local.
      return sun.polarNight || sun.polarDay ? 6 : sun.sunriseLocalHours;
    case 'pradosha':
      // Middle of the pradoṣa window, so the whole window is represented.
      return (sun.polarNight || sun.polarDay ? 18 : sun.sunsetLocalHours) + PRADOSHA_HOURS / 2;
    case 'nishitha':
      return 24;
    case 'madhyahna':
      // Apparent noon = midpoint of sunrise and sunset, not clock 12:00.
      return sun.polarNight || sun.polarDay
        ? 12
        : (sun.sunriseLocalHours + sun.sunsetLocalHours) / 2;
  }
}

/** The tithi prevailing at the given anchor moment on `dateStr`. */
export function getAnchoredTithi(
  dateStr: string,
  anchor: TithiAnchor = 'udaya',
  lat = 28.6139,
  lng = 77.209,
  utcOffsetHours = 5.5
): AnchoredTithi {
  const hour = anchorLocalHour(dateStr, anchor, lat, lng, utcOffsetHours);
  // Hours past 24 roll into the following civil day; toJulianDay handles the
  // fractional offset directly, so express the time as HH:MM within 0–24 and
  // add whole days to the Julian Day instead.
  const wholeDays = Math.floor(hour / 24);
  const h = hour - wholeDays * 24;
  const hh = String(Math.floor(h)).padStart(2, '0');
  const mm = String(Math.floor((h % 1) * 60)).padStart(2, '0');
  const jde = toJulianDay(dateStr, `${hh}:${mm}`) + wholeDays;

  const elongation = getElongation(jde);
  const tithiIndex = Math.floor(elongation / 12);
  return {
    tithiIndex,
    tithiNum: tithiIndex < 15 ? tithiIndex + 1 : tithiIndex - 14,
    paksha: elongation < 180 ? 'शुक्ल' : 'कृष्ण',
    elongation,
    anchorLocalHour: hour,
    anchor,
  };
}

/**
 * Which anchor a given Jain parva uses. Anything not listed follows the general
 * udaya rule.
 * Source: GAP_CLOSING_RESEARCH §GP.8; standard Digambar observance.
 */
export const PARVA_ANCHORS: Record<string, TithiAnchor> = {
  // Mahāvīra attained nirvāṇa in the early hours before dawn and the Nirvāṇa
  // Laḍḍū is offered on the MORNING of Dīpāvalī, so the Jain observance is
  // udaya-vyāpinī. It does NOT follow the pradoṣa rule that fixes the Hindu
  // Lakṣmī Pūjā, and the two can therefore fall on different civil days —
  // in 2023 the Lakṣmī Pūjā evening was 12 Nov while Nirvāṇa Kalyāṇaka was
  // observed on 13 Nov. Verified against the published Amāvasyā window
  // (14:46 on 12 Nov to 14:58 on 13 Nov 2023).
  'महावीर निर्वाण कल्याणक': 'udaya',
  'दीपावली': 'pradosha', // the Lakṣmī Pūjā evening, distinct from the above
  'शरद पूर्णिमा': 'nishitha',           // midnight moon-viewing
  'महावीर जन्म कल्याणक': 'udaya',
  'दशलक्षण पर्व': 'udaya',
  'श्रुत पंचमी': 'udaya',
  'अष्टान्हिका पर्व': 'udaya',
};

export function getParvaAnchor(parvaName: string): TithiAnchor {
  return PARVA_ANCHORS[parvaName] ?? 'udaya';
}
