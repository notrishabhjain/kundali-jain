// JAIN NAKSHATRA RULING FRAMEWORK
// Replace [REQUIRES_RESEARCH Vedic deity] with this Jain system:
// In Jain Jyotish, nakshatras are governed by JYOTISHI DEVS (celestial beings)
// NOT by Vedic devas. The classification system is by KARMA TYPE and TIRTHANKARA.

// For each nakshatra, replace ruling_deity field with:
{
  // Instead of Vedic deity:
  ruling_jyotishi_dev: "Chandra Dev",   // Moon governs it in Jain system
  jain_classification: "Shubha",        // or "Ashubha" or "Mishra"
  associated_tirthankara: "Mahavira",   // which Tirthankara was born under it
  karma_lord: "Gyanavaraniya",          // dominant karma type
  
  // Source note to display in UI:
  deity_note: "जैन ज्योतिष में वैदिक देवता नहीं होते। " +
    "इस नक्षत्र के अधिपति ज्योतिषी देव हैं। " +
    "तीर्थंकर संबंध: [associated_tirthankara]"
}

// SPECIFIC MAPPINGS based on Tirthankara birth nakshatras:
// (Nakshatras where Tirthankaras were born are automatically PARAM SHUBHA)

const JAIN_NAKSHATRA_CLASSIFICATIONS = {
  "Ashvini":           { nature: "shubha", tirthankara_born: ["Kunthunatha (17)", "Naminatha (21)"], karma_type: "Gyanavaraniya" },
  "Bharani":           { nature: "mishra", tirthankara_born: ["Shantinatha (16)"], karma_type: "Vedaniya" },
  "Krittika":          { nature: "mishra", tirthankara_born: ["Sumatinatha (5)"], karma_type: "Naam" },
  "Rohini":            { nature: "param_shubha", tirthankara_born: ["Ajitanatha (2)"], karma_type: "Gyanavaraniya" },
  "Mrigashirsha":      { nature: "shubha", tirthankara_born: ["Sambhavanatha (3)"], karma_type: "Mohaniya" },
  "Ardra":             { nature: "ashubha", tirthankara_born: [], karma_type: "Mohaniya" },
  "Punarvasu":         { nature: "shubha", tirthankara_born: ["Abhinandananatha (4)"], karma_type: "Naam" },
  "Pushya":            { nature: "shubha", tirthankara_born: [], karma_type: "Gyanavaraniya" },
  "Ashlesha":          { nature: "ashubha", tirthankara_born: [], karma_type: "Mohaniya" },
  "Magha":             { nature: "mishra", tirthankara_born: [], karma_type: "Gotra" },
  "Purva Phalguni":    { nature: "mishra", tirthankara_born: [], karma_type: "Vedaniya" },
  "Uttara Phalguni":   { nature: "param_shubha", tirthankara_born: ["Mahavira (24)", "Vimalanatha (13)"], karma_type: "Gyanavaraniya" },
  "Hasta":             { nature: "shubha", tirthankara_born: [], karma_type: "Antaraya" },
  "Chitra":            { nature: "shubha", tirthankara_born: ["Padmaprabhu (6)", "Neminatha (22)"], karma_type: "Naam" },
  "Swati":             { nature: "shubha", tirthankara_born: [], karma_type: "Darshanavaraniya" },
  "Vishakha":          { nature: "param_shubha", tirthankara_born: ["Suparshvanatha (7)", "Shitalanatha (10)", "Parshvanatha (23)"], karma_type: "Charitra Mohaniya" },
  "Anuradha":          { nature: "shubha", tirthankara_born: ["Chandraprabhu (8)"], karma_type: "Darshanavaraniya" },
  "Jyeshtha":          { nature: "ashubha", tirthankara_born: [], karma_type: "Antaraya" },
  "Mula":              { nature: "ashubha", tirthankara_born: ["Suvidhinatha (9)"], karma_type: "Mohaniya" },
  "Purva Ashadha":     { nature: "mishra", tirthankara_born: ["Mallinatha (19)"], karma_type: "Gotra" },
  "Uttara Ashadha":    { nature: "param_shubha", tirthankara_born: ["Rishabhanatha (1)", "Aranatha (18)"], karma_type: "Gyanavaraniya" },
  "Shravana":          { nature: "shubha", tirthankara_born: ["Shreyansanatha (11)", "Munisuvrata (20)"], karma_type: "Gyanavaraniya" },
  "Dhanishtha":        { nature: "mishra", tirthankara_born: [], karma_type: "Naam" },
  "Shatabhisha":       { nature: "mishra", tirthankara_born: ["Vasupujya (12)"], karma_type: "Vedaniya" },
  "Purva Bhadrapada":  { nature: "ashubha", tirthankara_born: [], karma_type: "Mohaniya" },
  "Uttara Bhadrapada": { nature: "shubha", tirthankara_born: ["Dharmanatha (15)"], karma_type: "Charitra Mohaniya" },
  "Revati":            { nature: "shubha", tirthankara_born: ["Anantanatha (14)"], karma_type: "Mohaniya" },
  "Abhijit":           { nature: "param_shubha", tirthankara_born: ["Rishabhanatha (Nirvana)"], karma_type: "Sarva karma kshay — Moksha nakshatra" }
};