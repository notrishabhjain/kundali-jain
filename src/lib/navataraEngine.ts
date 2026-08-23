// Navatara (नवतारा) — 9-star karmic cycle counted from the birth nakshatra.
//
// Source: GAP_CLOSING_RESEARCH GN.3 — VERIFIED. Counting is inclusive of the
// birth star: position n = ((current − birth) mod 27) + 1; the tara category is
// ((n − 1) mod 9) + 1.
//
// Canonical application (extraction library M2.3/M4.4 + GN.3):
//  - Vipat (3rd), Pratyari/Vadha-class (5th, 7th) positions → avoid new
//    undertakings; extra mantra recitation recommended.
//  - Param Mitra (9th) → most auspicious; begin new vratas / initiations.
//  - Janma (1st) → physical vulnerability; avoid surgery/long travel.

export type NavataraKey =
  | 'janma' | 'sampat' | 'vipat' | 'kshema' | 'pratyari'
  | 'sadhana' | 'vadha' | 'mitra' | 'paramMitra';

export interface NavataraAssessment {
  /** 1-based position of today's star from the birth star (1–27) */
  position: number;
  key: NavataraKey;
  hindi: string;
  natureHindi: string;
  guidance: string; // Devanagari, addresses 'आप'
}

const ORDER: { key: NavataraKey; hindi: string; natureHindi: string; guidance: string }[] = [
  { key: 'janma',      hindi: 'जन्म तारा',       natureHindi: 'सावधानी',
    guidance: 'आज आपकी शारीरिक संवेदनशीलता बढ़ी हुई है — शल्य-क्रिया और दूर-यात्रा टालें, अधिक मंत्र-जाप करें।' },
  { key: 'sampat',     hindi: 'सम्पत्ति तारा',   natureHindi: 'शुभ',
    guidance: 'आज धन-संचय और सांसारिक प्रयत्नों के लिए अनुकूल समय है।' },
  { key: 'vipat',      hindi: 'विपत्कर तारा',    natureHindi: 'अशुभ',
    guidance: 'आज आप नया कार्य आरंभ न करें; नमोकार जाप की संख्या बढ़ाएँ।' },
  { key: 'kshema',     hindi: 'क्षेम तारा',      natureHindi: 'शुभ',
    guidance: 'आज सुरक्षा और स्थैत्य का समय है — चल रहे कार्यों को सुदृढ़ करें।' },
  { key: 'pratyari',   hindi: 'प्रत्यारि तारा',  natureHindi: 'अशुभ',
    guidance: 'आज बाधा-उपसर्ग संभव हैं — नवारंभ टालें, प्रतिक्रमण करें।' },
  { key: 'sadhana',    hindi: 'साधन तारा',       natureHindi: 'शुभ',
    guidance: 'आज आपके साधना-प्रयत्न फलदायी होंगे — इच्छित कार्य प्रारंभ करें।' },
  { key: 'vadha',      hindi: 'वध तारा',         natureHindi: 'अति अशुभ',
    guidance: 'आज किसी भी नवारंभ से बचें — यह सबसे सावधानी का दिन है; केवल निर्जरा-साधना करें।' },
  { key: 'mitra',      hindi: 'मित्र तारा',      natureHindi: 'शुभ',
    guidance: 'आज सहयोग और उपकार के अवसर बनेंगे।' },
  { key: 'paramMitra', hindi: 'परम मित्र तारा',  natureHindi: 'अति शुभ',
    guidance: 'आज नया व्रत, संकल्प या दीक्षा-सदृश उपारंभ के लिए सर्वोत्तम दिन है।' }
];

export function getNavatara(birthNakshatraIndex: number, currentNakshatraIndex: number): NavataraAssessment {
  const b = ((birthNakshatraIndex % 27) + 27) % 27;
  const c = ((currentNakshatraIndex % 27) + 27) % 27;
  const position = ((c - b + 27) % 27) + 1;
  const idx = (position - 1) % 9;
  const base = ORDER[idx];
  return {
    position,
    key: base.key,
    hindi: base.hindi,
    natureHindi: base.natureHindi,
    guidance: base.guidance
  };
}
