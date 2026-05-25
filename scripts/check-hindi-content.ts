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
const violations: string[] = [];
for (const file of files) {
  const content = readFileSync(file, 'utf8');
  if (/\bतुम\b/.test(content)) violations.push(`${file}: informal pronoun 'तुम'`);
}
if (violations.length) {
  console.error('Hindi content guard failed:');
  for (const v of violations) console.error(`- ${v}`);
  process.exit(1);
}
console.log(`Hindi content guard passed for ${files.length} component files.`);
