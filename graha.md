// REPLACE [REQUIRES_RESEARCH] fields in grahas.ts

const JAIN_GRAHA_DATA = {
  Mangal: {
    color: "Rakta (Red / रक्त)",
    shape: "Triangular (Trikona / त्रिकोण)",
    speed_description: "Madhyama gati — completes nakshatra cycle in approx. 687 days",
    jyotishi_dev_type: "Taragraha (Planet-star)",
    nature: "Ashubha (inauspicious)",
    loka: "80 yojana above moon's orbit"
  },
  Budha: {
    color: "Harit / Peeta-Harit (Green-Yellow / हरित-पीत)",
    shape: "Mixed / Sammilit — combines all shapes",
    speed_description: "Sheeghra gati — follows sun closely, ~88 day cycle",
    jyotishi_dev_type: "Taragraha",
    nature: "Mishra (mixed — shubha with shubha, ashubha with ashubha)",
    loka: "32 yojana above sun"
  },
  Guru: {
    color: "Peeta / Pitambara (Yellow / पीत)",
    shape: "Vruddha Chaturasra (Square / चतुर्भुज)",
    speed_description: "Manda gati — approx. 12-year cycle through nakshatras",
    jyotishi_dev_type: "Taragraha",
    nature: "Shubha (auspicious)",
    loka: "320 yojana above moon"
  },
  Shukra: {
    color: "Shveta / Dhavala (White / श्वेत)",
    shape: "Vrutta (Circular / वृत्त — circle)",
    speed_description: "Sheeghra gati — follows sun, ~225 day cycle",
    jyotishi_dev_type: "Taragraha",
    nature: "Shubha (auspicious)",
    loka: "Below sun — alternates morning and evening star"
  },
  Shani: {
    color: "Krishna / Nila (Black-Blue / कृष्ण-नील)",
    shape: "Ayata Chaturasra (Rectangular / आयत चतुर्भुज)",
    speed_description: "Ati-Manda gati — slowest, approx. 30-year nakshatra cycle",
    jyotishi_dev_type: "Taragraha",
    nature: "Ashubha (inauspicious)",
    loka: "Highest among Taragrahas — 800 yojana above moon"
  },
  Rahu: {
    color: "Dhoomra / Shyama (Smoky-dark / धूम्र-श्याम)",
    shape: "Invisible / Chaya (Shadow body — no physical form)",
    speed_description: "Retrograde — moves opposite to other planets, 18-year cycle",
    jyotishi_dev_type: "Chaya Graha (shadow body — not a Jyotishi Dev)",
    nature: "Ashubha (strongly inauspicious)",
    jain_description: "In Jain texts (Chandrapragnapti), Rahu causes lunar eclipses by obscuring the moon. It is a massive dark body — not a deity.",
    loka: "Variable — below moon's orbit when causing eclipse"
  },
  Ketu: {
    color: "Dhumra / Pandu (Ashen-white / धूम्र-पांडु)",
    shape: "Dhvaja-akara (Flag or comet-shaped / ध्वजाकार)",
    speed_description: "Paired with Rahu — always 180 degrees opposite",
    jyotishi_dev_type: "Chaya Graha (shadow body)",
    nature: "Ashubha (inauspicious — causes confusion and detachment)",
    jain_description: "In Jain cosmology, Ketu appears as a comet-like body. Not a Jyotishi Dev. Associated with sudden events and past-life karma surfacing.",
    loka: "Always opposite Rahu"
  }
};