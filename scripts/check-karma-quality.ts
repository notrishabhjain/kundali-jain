import { calculateKarmaProfile } from '../src/lib/karmaEngine';

const sample = calculateKarmaProfile('Mohaniya', 'Mohaniya', 2);
const errors: string[] = [];

for (const karma of sample) {
  if (!karma.insight.karmaNameDevanagari?.trim()) errors.push(`${karma.karmaEn}: karmaNameDevanagari missing`);
  if (!karma.insight.dailyManifestation?.trim()) errors.push(`${karma.karmaEn}: dailyManifestation missing`);
  if (!karma.insight.sadhanaName?.trim()) errors.push(`${karma.karmaEn}: sadhanaName missing`);
  if (!(karma.insight.count > 0)) errors.push(`${karma.karmaEn}: count invalid`);
  if (!karma.insight.timing?.trim()) errors.push(`${karma.karmaEn}: timing missing`);
  if (!karma.insight.whyThisReducesKarma?.trim()) errors.push(`${karma.karmaEn}: whyThisReducesKarma missing`);
}

if (errors.length) {
  console.error('Karma quality guard failed:');
  errors.forEach((e) => console.error(`- ${e}`));
  process.exit(1);
}

console.log(`Karma quality guard passed for ${sample.length} karmas.`);
