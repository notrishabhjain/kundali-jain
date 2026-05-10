// Jain Panchang Engine
// Calculates Tithi, Masa, Paksha, and Jain specific Vrat/Festivals

function toRad(deg: number): number { return (deg * Math.PI) / 180; }
function normDeg(d: number): number { return ((d % 360) + 360) % 360; }

export function toJulianDay(dateStr: string, timeStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);
  const utcHour = (hh + mm / 60 - 5.5 + 24) % 24;

  let Y = year, M = month;
  if (M <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + utcHour / 24 + B - 1524.5;
}

export function getSunLongitude(jde: number): number {
  const T = (jde - 2451545) / 36525;
  return normDeg(280.46646 + 36000.76983 * T);
}

export function getMoonTropicalLongitude(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  let L = 218.3164477 + 481267.88123421 * T;
  const M = normDeg(357.5291092 + 35999.0502909 * T);
  const Mm = normDeg(134.9633964 + 477198.8675055 * T);
  const D = normDeg(297.8501921 + 445267.1114034 * T);
  const F = normDeg(93.2720950 + 483202.0175233 * T);

  const sigma =
    6.288774 * Math.sin(toRad(Mm)) +
    1.274027 * Math.sin(toRad(2 * D - Mm)) +
    0.658314 * Math.sin(toRad(2 * D)) +
    0.213618 * Math.sin(toRad(2 * Mm)) -
    0.185116 * Math.sin(toRad(M)) -
    0.114332 * Math.sin(toRad(2 * F)) +
    0.058793 * Math.sin(toRad(2 * D - 2 * Mm)) +
    0.057066 * Math.sin(toRad(2 * D - M - Mm)) +
    0.053322 * Math.sin(toRad(2 * D + Mm)) +
    0.045758 * Math.sin(toRad(2 * D - M));

  return normDeg(L + sigma);
}

export function getLahiriAyanamsa(jde: number): number {
  const T = (jde - 2451545.0) / 36525;
  return 23.85 + 1.397 * T;
}

export function getSiderealLongitude(jde: number): number {
  const tropical = getMoonTropicalLongitude(jde);
  const ayanamsa = getLahiriAyanamsa(jde);
  return normDeg(tropical - ayanamsa);
}

export interface JainPanchang {
  tithi: string;
  vara: string;
  nakshatra: string;
  paksha: string;
  masa: string;
  jainFestival: string | null;
}

const VARAS = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const TITHI_NAMES = ['', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा/अमावस्या'];
const MASAS = ['चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद', 'आश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन'];

export function getJainPanchang(date: Date): JainPanchang {
  const jde = toJulianDay(
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  );

  const sunLong = getSunLongitude(jde);
  const moonLong = getMoonTropicalLongitude(jde);
  const elongation = normDeg(moonLong - sunLong);
  
  const tithiRaw = Math.floor(elongation / 12);
  const paksha = elongation < 180 ? 'शुक्ल' : 'कृष्ण';
  const tithiNum = tithiRaw < 15 ? tithiRaw + 1 : tithiRaw - 14;
  
  let tithiName = tithiRaw === 29 ? 'अमावस्या' : (tithiRaw === 14 ? 'पूर्णिमा' : TITHI_NAMES[tithiNum]);
  const masaIndex = Math.floor(sunLong / 30); // simplified solar masa mapping to lunar
  const masa = MASAS[masaIndex % 12];

  // Jain Festivals & Vrats
  let jainFestival = null;
  if ((masa === 'चैत्र' || masa === 'आषाढ़' || masa === 'कार्तिक') && paksha === 'शुक्ल' && tithiNum >= 8 && tithiNum <= 15) {
    jainFestival = 'अष्टान्हिका महापर्व (सिद्धचक्र विधान)';
  } else if ((masa === 'चैत्र' || masa === 'भाद्रपद' || masa === 'माघ') && paksha === 'शुक्ल' && tithiNum >= 5 && tithiNum <= 14) {
    jainFestival = 'दशलक्षण महापर्व';
  } else if (paksha === 'शुक्ल' && tithiNum === 11) {
    jainFestival = 'निर्वाण/मोक्ष कल्याणक (अनेक तीर्थंकरों का)';
  }

  return {
    tithi: `${paksha} ${tithiName}`,
    vara: VARAS[date.getDay()],
    nakshatra: 'नक्षत्र', // We'll compute this elsewhere or map index
    paksha,
    masa,
    jainFestival
  };
}
