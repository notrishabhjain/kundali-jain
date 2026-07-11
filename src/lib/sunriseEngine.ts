// Apparent sunrise/sunset engine — Meeus Chapter 15 method.
//
// Source: PARITY-REPORT-2026 §"Jean Meeus Chapter 15 Sunrise and Sunset Calculation"
// (primary). Replaces the deprecated cosine seasonal approximation.
//
// The apparent sunrise is the moment the Sun's centre reaches altitude
//   h = −0.8333° − 0.0293° × √H   (H = observer elevation in metres)
// accounting for atmospheric refraction, the solar semi-diameter, and
// height-induced horizon dip.

function toRad(d: number): number { return (d * Math.PI) / 180; }
function toDeg(r: number): number { return (r * 180) / Math.PI; }
function norm360(d: number): number { return ((d % 360) + 360) % 360; }

export interface ApparentSunTimes {
  sunriseLocalHours: number;   // decimal hours, local clock
  sunsetLocalHours: number;
  sunriseHHMM: string;
  sunsetHHMM: string;
  polarDay: boolean;           // Sun never sets (cos H0 < −1)
  polarNight: boolean;         // Sun never rises (cos H0 > 1)
}

function jdAtUTCMidnight(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  let Y = year, M = month;
  if (M <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + B - 1524.5;
}

function fmtHHMM(hours: number): string {
  const h24 = ((hours % 24) + 24) % 24;
  const hh = Math.floor(h24);
  const mm = Math.round((h24 - hh) * 60);
  const hAdj = mm === 60 ? hh + 1 : hh;
  const mAdj = mm === 60 ? 0 : mm;
  return `${String(hAdj % 24).padStart(2, '0')}:${String(mAdj).padStart(2, '0')}`;
}

/**
 * Apparent sunrise and sunset for a calendar date at given coordinates.
 * Source: PARITY-REPORT-2026 Meeus Ch. 15 steps 1–7.
 *
 * @param dateStr        Calendar date YYYY-MM-DD (local date of the birth/event)
 * @param latitude       Degrees, positive north
 * @param longitude      Degrees, positive EAST (converted internally to the
 *                       west-positive convention the algorithm uses)
 * @param elevationM     Observer elevation in metres (horizon-dip correction)
 * @param utcOffsetHours Local clock offset from UTC (default IST +5.5)
 */
export function calculateApparentSunTimes(
  dateStr: string,
  latitude: number,
  longitude: number,
  elevationM: number = 0,
  utcOffsetHours: number = 5.5
): ApparentSunTimes {
  const phi = latitude;
  const lw = -longitude; // west-positive per the algorithm's convention

  const jdMidnight = jdAtUTCMidnight(dateStr);

  // Mean solar noon cycle number since J2000 for this location.
  const n = Math.round(jdMidnight - 2451545.0009 - lw / 360.0);
  const jStar = 2451545.0009 + lw / 360.0 + n;

  // Step 2: Earth's mean anomaly. Source: PARITY-REPORT-2026 (M formula).
  const M = norm360(357.5291 + 0.98560028 * (jStar - 2451545.0));

  // Step 3: equation of the center.
  const C = 1.9148 * Math.sin(toRad(M)) + 0.0200 * Math.sin(toRad(2 * M)) + 0.0003 * Math.sin(toRad(3 * M));

  // Step 4: Sun's ecliptic longitude.
  const lambda = norm360(M + C + 180.0 + 102.9372);

  // Solar transit (local true noon), with equation-of-time corrections.
  const jTransit = jStar + 0.0053 * Math.sin(toRad(M)) - 0.0069 * Math.sin(toRad(2 * lambda));

  // Step 5: mean obliquity of the ecliptic (with report's secular drift term).
  const epsilon = 23.4393 - 0.00000036 * (jTransit - 2451545.0);

  // Step 6: Sun's declination.
  const delta = toDeg(Math.asin(Math.sin(toRad(lambda)) * Math.sin(toRad(epsilon))));

  // Step 7: hour angle at the adjusted altitude boundary.
  // h = −0.8333° − 0.0293°·√H (refraction + semi-diameter + horizon dip).
  const h = -0.8333 - 0.0293 * Math.sqrt(Math.max(0, elevationM));
  const cosH0 =
    (Math.sin(toRad(h)) - Math.sin(toRad(phi)) * Math.sin(toRad(delta))) /
    (Math.cos(toRad(phi)) * Math.cos(toRad(delta)));

  if (cosH0 > 1) {
    // Polar night — Sun permanently below horizon.
    return { sunriseLocalHours: NaN, sunsetLocalHours: NaN, sunriseHHMM: '--:--', sunsetHHMM: '--:--', polarDay: false, polarNight: true };
  }
  if (cosH0 < -1) {
    // Polar day — Sun permanently above horizon.
    return { sunriseLocalHours: NaN, sunsetLocalHours: NaN, sunriseHHMM: '--:--', sunsetHHMM: '--:--', polarDay: true, polarNight: false };
  }

  const H0 = toDeg(Math.acos(cosH0));
  const jRise = jTransit - H0 / 360.0;
  const jSet = jTransit + H0 / 360.0;

  // JD → local decimal hours ((JD + 0.5) fraction is time since UTC midnight).
  const toLocalHours = (jd: number) => (((jd + 0.5) % 1) * 24 + utcOffsetHours + 24) % 24;

  const sunriseLocalHours = toLocalHours(jRise);
  const sunsetLocalHours = toLocalHours(jSet);

  return {
    sunriseLocalHours,
    sunsetLocalHours,
    sunriseHHMM: fmtHHMM(sunriseLocalHours),
    sunsetHHMM: fmtHHMM(sunsetLocalHours),
    polarDay: false,
    polarNight: false
  };
}
