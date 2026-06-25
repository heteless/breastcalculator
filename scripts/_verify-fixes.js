// Verify the encoding fixes at known positions.
const fs = require('fs');
const path = require('path');

const checks = [
  { file: 'sports-bra-guide/index.html', search: 'you own', expect: 'you own \u2014 and' },
  { file: 'sports-bra-guide/index.html', search: 'reduces breast movement', expect: 'by 60\u201383%' },
  { file: 'sports-bra-guide/index.html', search: 'figure-8 pattern', expect: 'exercise \u2014 up-and-down' },
  { file: 'sports-bra-guide/index.html', search: 'class="arrow"', expect: 'arrow"> \u25be<' },
  { file: 'best-comfort-bras/index.html', search: 'bras of 2026', expect: '2026 \u2014 professional' },
  { file: 'best-comfort-bras/index.html', search: 'Sizes 32', expect: '32\u201344' },
  { file: 'breast-volume/index.html', search: 'within', expect: '\u00b115\u201320%' },
  { file: 'bra-buying-guide/index.html', search: 'bra that fits', expect: 'fits \u2014 compare' },
  { file: 'tools/breast-ptosis-calculator/index.html', search: 'not too tight', expect: 'tight \u2014 that' },
  { file: 'tools/breast-expansion-calculator/index.html', search: 'not too tight', expect: 'tight \u2014 that' },
  { file: 'tools/length-converter/index.html', search: 'not too tight', expect: 'tight \u2014 that' },
];

let allOk = true;
for (const c of checks) {
  const s = fs.readFileSync(path.join(process.cwd(), c.file), 'utf8');
  const idx = s.indexOf(c.search);
  if (idx < 0) {
    console.log('FAIL (not found):', c.file, c.search);
    allOk = false;
    continue;
  }
  const ctx = s.substring(idx, idx + c.expect.length + 10);
  const ok = ctx.startsWith(c.expect);
  console.log(ok ? 'OK  ' : 'FAIL', c.file.padEnd(45), JSON.stringify(ctx.substring(0, 60)));
  if (!ok) {
    console.log('     expected prefix:', JSON.stringify(c.expect));
    allOk = false;
  }
}
console.log(allOk ? '\nAll checks passed.' : '\nSome checks FAILED.');
