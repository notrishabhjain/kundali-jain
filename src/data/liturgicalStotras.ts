// Liturgical remedy catalog (blueprint §B.6) — Uvasaggaharam, Kalyanmandir,
// Namokar jaap prescriptions. Source: GAP_CLOSING_RESEARCH GR.2 + B.6.

export interface LiturgicalStotra {
  key: 'uvasaggaharam' | 'kalyanmandir' | 'namokar';
  hindiName: string;
  attribution: string;
  application: string;      // vidhi (Devanagari)
  target: string;           // what it addresses
  defaultCount: number;
}

export const LITURGICAL_STOTRAS: LiturgicalStotra[] = [
  {
    key: 'uvasaggaharam',
    hindiName: 'उवसग्गहारं स्तोत्र',
    attribution: 'आचार्य भद्रबाहु',
    application: 'शुद्ध जल पर ठीक १०८ बार पाठ करें; जल रोगी को पिलाएँ।',
    target: 'अशुभ वेदनीय (उपसर्ग/विष) और ग्रह-पीड़ा का शमन',
    defaultCount: 108
  },
  {
    key: 'kalyanmandir',
    hindiName: 'कल्याणमंदिर स्तोत्र (४४ श्लोक)',
    attribution: 'आचार्य कुमुदचंद्र',
    application: 'प्रभात-काल में नित्य पाठ।',
    target: 'अज्ञान-अंधकार दूर, कार्य/विवाह-बाधा निवारण',
    defaultCount: 1
  },
  {
    key: 'namokar',
    hindiName: 'णमोकार महामंत्र',
    attribution: 'अनादि (सर्व-कालिक)',
    application: 'चंदन माला से १०८ बार नित्य जाप।',
    target: 'सर्व-कर्म शमन का मूल उपाय',
    defaultCount: 108
  }
];

// Crisis prescription (blueprint §B.6-C): 12,500 jaap across a 9-day span.
export const NAMOKAR_CRISIS_PRESCRIPTION = {
  totalJap: 12500,
  spanDays: 9,
  dailyJap: Math.ceil(12500 / 9),
  occasionHindi: 'नवरात्रि अथवा दशलक्षण पर्व की ९ दिन',
  purposeHindi: 'गंडांत-जन्य बृहत् ग्रह-संकट का निवारण'
} as const;

export function getCrisisDailySchedule(): { dayHindi: string; jap: number }[] {
  const out: { dayHindi: string; jap: number }[] = [];
  for (let d = 0; d < NAMOKAR_CRISIS_PRESCRIPTION.spanDays; d++) {
    const remaining = NAMOKAR_CRISIS_PRESCRIPTION.totalJap - d * NAMOKAR_CRISIS_PRESCRIPTION.dailyJap;
    const jap = Math.max(0, Math.min(NAMOKAR_CRISIS_PRESCRIPTION.dailyJap, remaining));
    out.push({ dayHindi: `दिन ${d + 1}`, jap });
  }
  return out;
}
