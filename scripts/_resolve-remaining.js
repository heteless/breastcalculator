// Find the clean-version context for unresolved corruption points.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const cases = [
  { file: 'best-comfort-bras/index.html', search: 'bras of 2026' },
  { file: 'best-comfort-bras/index.html', search: 'Sizes 32' },
  { file: 'breast-volume/index.html', search: 'within ' },
  { file: 'bra-buying-guide/index.html', search: 'bra that fits' },
  { file: 'tools/breast-ptosis-calculator/index.html', search: 'not too tight' },
  { file: 'tools/breast-expansion-calculator/index.html', search: 'not too tight' },
  { file: 'tools/length-converter/index.html', search: 'not too tight' },
];

for (const c of cases) {
  const clean = execSync(`git show 7f997be:${c.file}`, { encoding: 'utf8' });
  const idx = clean.indexOf(c.search);
  if (idx >= 0) {
    console.log(`--- ${c.file}: "${c.search}" ---`);
    console.log(JSON.stringify(clean.substring(idx, idx + 80)));
  } else {
    console.log(`--- ${c.file}: "${c.search}" NOT FOUND ---`);
  }
}
