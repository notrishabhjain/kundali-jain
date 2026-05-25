import { readFileSync } from 'node:fs';

const printable = readFileSync('src/components/FullPrintableReport.tsx', 'utf8');
const mainTabs = readFileSync('src/components/Kundali.tsx', 'utf8');

const groups: Array<{ ui: string; pdf: string }> = [
  { ui: 'वर्तमान', pdf: 'वर्तमान' },
  { ui: 'कुण्डली', pdf: 'जन्म-नक्षत्र विश्लेषण' },
  { ui: 'कर्म', pdf: 'कर्म मण्डला' },
  { ui: 'उपाय', pdf: 'दैनिक चर्या एवं जाप' },
  { ui: 'धर्म मार्ग', pdf: 'धर्ममार्ग भाग १' },
  { ui: 'कैलेंडर', pdf: 'पाक्षिक व्रत' },
  { ui: 'तीर्थ यात्रा', pdf: 'तीर्थ यात्रा भाग १' },
  { ui: 'मुहूर्त', pdf: 'मुहूर्त' },
  { ui: 'रिपोर्ट', pdf: 'निष्कर्ष' },
];

const missing = groups.filter((g) => !mainTabs.includes(g.ui) || !printable.includes(g.pdf));
if (missing.length) {
  console.error('PDF parity guard failed. Missing mapped labels:');
  missing.forEach((m) => console.error(`- UI:${m.ui} <-> PDF:${m.pdf}`));
  process.exit(1);
}
console.log('PDF parity guard passed. UI tabs and printable sections are mapped.');
