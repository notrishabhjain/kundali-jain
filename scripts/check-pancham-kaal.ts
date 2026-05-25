import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

const files = walk(join(process.cwd(), 'src/components'));
const requiredTokens = ['पंचम काल', 'मोक्ष', 'सम्यग्दर्शन', 'देव-गति'];

const combined = files.map((f) => readFileSync(f, 'utf8')).join('\n');
const missing = requiredTokens.filter((t) => !combined.includes(t));

if (missing.length > 0) {
  console.error('Pancham Kaal guard failed. Missing required doctrinal tokens:');
  missing.forEach((m) => console.error(`- ${m}`));
  process.exit(1);
}

console.log('Pancham Kaal guard passed. Required doctrinal tokens found.');
