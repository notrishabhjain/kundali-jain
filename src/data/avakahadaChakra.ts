// Avakahada Chakra — complete 28-nakshatra quarter database.
//
// Source: blueprint-v3 §1 (Brihat Shatabdi Panchang P-14/P-19) — VERIFIED against
// classical canon: all 108 nama-aksharas, gana and yoni assignments match the
// standard tradition; varna/vashya shift per-quarter exactly at rashi boundaries.
//
// Nadi uses the SERPENTINE (zigzag) matrix, not linear index%3:
//   Adi    : positions 1, 6, 7, 12, 13, 18, 19, 24, 25
//   Madhya : positions 2, 5, 8, 11, 14, 17, 20, 23, 26
//   Antya  : positions 3, 4, 9, 10, 15, 16, 21, 22, 27
// (Abhijit, intercalary position 28, is listed as Antya per the almanac.)

export type NadiKey = 'Adi' | 'Madhya' | 'Antya';
export type GanaKey = 'Deva' | 'Manushya' | 'Rakshasa';
export type VarnaKey = 'Vipra' | 'Kshatriya' | 'Vaishya' | 'Shoodra';
export type VashyaKey = 'Chatushpada' | 'Manav' | 'Jalachar' | 'Vanchar' | 'Keet';

export interface AvakahadaQuarter {
  quarter: 1 | 2 | 3 | 4;
  namaAkshar: string;
  swamiHindi: string;                 // nakshatra lord (graha)
  nadi: NadiKey;
  yoniHindi: string;
  gana: GanaKey;
  varna: VarnaKey;
  vashya: VashyaKey;
}

export interface AvakahadaStar {
  name: string;                       // English key matching nakshatras.ts `name`
  hindiName: string;
  quarters: AvakahadaQuarter[];       // Abhijit carries a single merged row
}

const VARNA_HINDI: Record<VarnaKey, string> = {
  Vipra: 'विप्र', Kshatriya: 'क्षत्रिय', Vaishya: 'वैश्य', Shoodra: 'शूद्र'
};
const VASHYA_HINDI: Record<VashyaKey, string> = {
  Chatushpada: 'चतुष्पाद', Manav: 'मानव', Jalachar: 'जलचर', Vanchar: 'वनचर', Keet: 'कीटक'
};

/** Serpentine nadi for a 1-based nakshatra position. */
export function serpentineNadi(position1to27: number): NadiKey {
  const p = ((position1to27 - 1) % 27) + 1;
  if ([1, 6, 7, 12, 13, 18, 19, 24, 25].includes(p)) return 'Adi';
  if ([2, 5, 8, 11, 14, 17, 20, 23, 26].includes(p)) return 'Madhya';
  return 'Antya'; // {3,4,9,10,15,16,21,22,27}
}

type QSpec = [syllable: string, varna: VarnaKey, vashya: VashyaKey];
let _positionCounter = 0;
function star(
  name: string,
  hindiName: string,
  yoni: string,
  gana: GanaKey,
  swami: string,
  specs: QSpec[],
  nadiOverride?: NadiKey
): AvakahadaStar {
  _positionCounter += 1; // 1-based canonical order (Ashvini=1 … Revati=27)
  const idx = _positionCounter;
  const nadi = nadiOverride ?? serpentineNadi(idx);
  return {
    name,
    hindiName,
    quarters: specs.map(([syl, varna, vashya], i) => ({
      quarter: (i + 1) as 1 | 2 | 3 | 4,
      namaAkshar: syl,
      swamiHindi: swami,
      nadi,
      yoniHindi: yoni,
      gana,
      varna,
      vashya
    }))
  };
}

export const AVAKAHADA_ZODIAC_MATRIX: AvakahadaStar[] = [
  star('Ashvini', 'अश्विनी', 'अश्व', 'Deva', 'केतु', [['चू', 'Kshatriya', 'Chatushpada'], ['चे', 'Kshatriya', 'Chatushpada'], ['चो', 'Kshatriya', 'Chatushpada'], ['ला', 'Kshatriya', 'Chatushpada']]),
  star('Bharani', 'भरणी', 'गज', 'Manushya', 'शुक्र', [['ली', 'Kshatriya', 'Chatushpada'], ['लू', 'Kshatriya', 'Chatushpada'], ['ले', 'Kshatriya', 'Chatushpada'], ['लो', 'Kshatriya', 'Chatushpada']]),
  star('Krittika', 'कृत्तिका', 'मेष', 'Rakshasa', 'सूर्य', [['अ', 'Kshatriya', 'Chatushpada'], ['ई', 'Vaishya', 'Chatushpada'], ['ऊ', 'Vaishya', 'Chatushpada'], ['ए', 'Vaishya', 'Chatushpada']]),
  star('Rohini', 'रोहिणी', 'सर्प', 'Manushya', 'चंद्र', [['ओ', 'Vaishya', 'Chatushpada'], ['वा', 'Vaishya', 'Chatushpada'], ['वी', 'Vaishya', 'Chatushpada'], ['वू', 'Vaishya', 'Chatushpada']]),
  star('Mrigashira', 'मृगशिरा', 'सर्प', 'Deva', 'मंगल', [['वे', 'Vaishya', 'Chatushpada'], ['वो', 'Vaishya', 'Chatushpada'], ['का', 'Shoodra', 'Manav'], ['की', 'Shoodra', 'Manav']]),
  star('Ardra', 'आर्द्रा', 'श्वान', 'Manushya', 'राहु', [['कू', 'Shoodra', 'Manav'], ['घ', 'Shoodra', 'Manav'], ['ङ', 'Shoodra', 'Manav'], ['छ', 'Shoodra', 'Manav']]),
  star('Punarvasu', 'पुनर्वसु', 'मार्जार', 'Deva', 'गुरु', [['के', 'Shoodra', 'Manav'], ['को', 'Shoodra', 'Manav'], ['हा', 'Shoodra', 'Manav'], ['ही', 'Vipra', 'Jalachar']]),
  star('Pushya', 'पुष्य', 'मेष', 'Deva', 'शनि', [['हू', 'Vipra', 'Jalachar'], ['हे', 'Vipra', 'Jalachar'], ['हो', 'Vipra', 'Jalachar'], ['डा', 'Vipra', 'Jalachar']]),
  star('Ashlesha', 'आश्लेषा', 'मार्जार', 'Rakshasa', 'बुध', [['डी', 'Vipra', 'Jalachar'], ['डू', 'Vipra', 'Jalachar'], ['डे', 'Vipra', 'Jalachar'], ['डो', 'Vipra', 'Jalachar']]),
  star('Magha', 'मघा', 'मूषक', 'Rakshasa', 'केतु', [['मा', 'Kshatriya', 'Vanchar'], ['मी', 'Kshatriya', 'Vanchar'], ['मू', 'Kshatriya', 'Vanchar'], ['मे', 'Kshatriya', 'Vanchar']]),
  star('Purva Phalguni', 'पूर्व फाल्गुनी', 'मूषक', 'Manushya', 'शुक्र', [['मो', 'Kshatriya', 'Vanchar'], ['टा', 'Kshatriya', 'Vanchar'], ['टी', 'Kshatriya', 'Vanchar'], ['टू', 'Kshatriya', 'Vanchar']]),
  star('Uttara Phalguni', 'उत्तर फाल्गुनी', 'गौ', 'Manushya', 'सूर्य', [['टे', 'Kshatriya', 'Vanchar'], ['टो', 'Vaishya', 'Manav'], ['पा', 'Vaishya', 'Manav'], ['पी', 'Vaishya', 'Manav']]),
  star('Hasta', 'हस्त', 'महिष', 'Deva', 'चंद्र', [['पू', 'Vaishya', 'Manav'], ['ष', 'Vaishya', 'Manav'], ['ण', 'Vaishya', 'Manav'], ['ठ', 'Vaishya', 'Manav']]),
  star('Chitra', 'चित्रा', 'व्याघ्र', 'Rakshasa', 'मंगल', [['पे', 'Vaishya', 'Manav'], ['पो', 'Vaishya', 'Manav'], ['रा', 'Shoodra', 'Manav'], ['री', 'Shoodra', 'Manav']]),
  star('Swati', 'स्वाति', 'महिष', 'Deva', 'राहु', [['रू', 'Shoodra', 'Manav'], ['रे', 'Shoodra', 'Manav'], ['रो', 'Shoodra', 'Manav'], ['ता', 'Shoodra', 'Manav']]),
  star('Vishakha', 'विशाखा', 'व्याघ्र', 'Rakshasa', 'गुरु', [['ती', 'Shoodra', 'Manav'], ['तू', 'Shoodra', 'Manav'], ['ते', 'Shoodra', 'Manav'], ['तो', 'Vipra', 'Keet']]),
  star('Anuradha', 'अनुराधा', 'मृग', 'Deva', 'शनि', [['ना', 'Vipra', 'Keet'], ['नी', 'Vipra', 'Keet'], ['नू', 'Vipra', 'Keet'], ['ने', 'Vipra', 'Keet']]),
  star('Jyeshtha', 'ज्येष्ठा', 'मृग', 'Rakshasa', 'बुध', [['नो', 'Vipra', 'Keet'], ['या', 'Vipra', 'Keet'], ['यी', 'Vipra', 'Keet'], ['यू', 'Vipra', 'Keet']]),
  star('Mula', 'मूल', 'श्वान', 'Rakshasa', 'केतु', [['ये', 'Kshatriya', 'Manav'], ['यो', 'Kshatriya', 'Manav'], ['भा', 'Kshatriya', 'Manav'], ['भी', 'Kshatriya', 'Manav']]),
  star('Purva Ashadha', 'पूर्वाषाढ़ा', 'वानर', 'Manushya', 'शुक्र', [['भू', 'Kshatriya', 'Manav'], ['धा', 'Kshatriya', 'Manav'], ['फा', 'Kshatriya', 'Manav'], ['ढा', 'Kshatriya', 'Manav']]),
  star('Uttara Ashadha', 'उत्तराषाढ़ा', 'नकुल', 'Manushya', 'सूर्य', [['भे', 'Kshatriya', 'Manav'], ['भो', 'Vaishya', 'Jalachar'], ['जा', 'Vaishya', 'Jalachar'], ['जी', 'Vaishya', 'Jalachar']]),
  {
    name: 'Abhijit',
    hindiName: 'अभिजित',
    quarters: [{
      quarter: 1, // intercalary — single merged row per the almanac
      namaAkshar: '— (अंतःकालिक)',
      swamiHindi: 'सूर्य',
      nadi: 'Antya',
      yoniHindi: 'नकुल',
      gana: 'Manushya',
      varna: 'Vaishya',
      vashya: 'Jalachar'
    }]
  },
  star('Shravana', 'श्रवण', 'वानर', 'Deva', 'चंद्र', [['खी', 'Vaishya', 'Jalachar'], ['खू', 'Vaishya', 'Jalachar'], ['खे', 'Vaishya', 'Jalachar'], ['खो', 'Vaishya', 'Jalachar']]),
  star('Dhanishtha', 'धनिष्ठा', 'सिंह', 'Rakshasa', 'मंगल', [['गा', 'Vaishya', 'Jalachar'], ['गी', 'Vaishya', 'Jalachar'], ['गू', 'Shoodra', 'Manav'], ['गे', 'Shoodra', 'Manav']]),
  star('Shatabhisha', 'शतभिषा', 'अश्व', 'Rakshasa', 'राहु', [['गो', 'Shoodra', 'Manav'], ['सा', 'Shoodra', 'Manav'], ['सी', 'Shoodra', 'Manav'], ['सू', 'Shoodra', 'Manav']]),
  star('Purva Bhadrapada', 'पूर्व भाद्रपद', 'सिंह', 'Manushya', 'गुरु', [['से', 'Shoodra', 'Manav'], ['सो', 'Shoodra', 'Manav'], ['दा', 'Shoodra', 'Manav'], ['दी', 'Vipra', 'Jalachar']]),
  star('Uttara Bhadrapada', 'उत्तर भाद्रपद', 'गौ', 'Manushya', 'शनि', [['दू', 'Vipra', 'Jalachar'], ['थ', 'Vipra', 'Jalachar'], ['झ', 'Vipra', 'Jalachar'], ['ञ', 'Vipra', 'Jalachar']]),
  star('Revati', 'रेवती', 'गज', 'Deva', 'बुध', [['दे', 'Vipra', 'Jalachar'], ['दो', 'Vipra', 'Jalachar'], ['चा', 'Vipra', 'Jalachar'], ['ची', 'Vipra', 'Jalachar']])
];

export function getAvakahada(nakshatraName: string, quarter?: 1 | 2 | 3 | 4): AvakahadaQuarter[] | undefined {
  const s = AVAKAHADA_ZODIAC_MATRIX.find(a =>
    a.name.toLowerCase() === nakshatraName.toLowerCase() || a.hindiName === nakshatraName
  );
  if (!s) return undefined;
  return quarter ? s.quarters.filter(q => q.quarter === quarter) : s.quarters;
}

export const AVAKAHADA_COVERAGE_COMPLETE = true;

export function avakahadaSummaryHindi(nakshatraName: string, quarter: 1 | 2 | 3 | 4): string {
  const rows = getAvakahada(nakshatraName);
  if (!rows) return '';
  const q = rows.find(r => r.quarter === Math.min(quarter, rows[rows.length - 1].quarter)) || rows[0];
  return `${q.namaAkshar} अक्षर · स्वामी ${q.swamiHindi} · ${VARNA_HINDI[q.varna]} वर्ण · ${VASHYA_HINDI[q.vashya]} वश्य · ${q.yoniHindi} योनि · ${q.gana} गण · ${q.nadi} नाड़ी`;
}
