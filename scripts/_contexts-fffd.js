// Extract context around every U+FFFD in all affected files.
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const files = [
  'best-comfort-bras/index.html',
  'bra-size-calculator/index.html',
  'breast-volume/index.html',
  'how-to-measure-bra-size/index.html',
  'bra-buying-guide/index.html',
  'best-wireless-bras/index.html',
  'tools/breast-ptosis-calculator/index.html',
  'tools/breast-expansion-calculator/index.html',
  'tools/breast-volume-calculator/index.html',
  'sports-bra-guide/index.html',
  'tools/breast-weight-calculator/index.html',
  'tools/length-converter/index.html',
  'tools/breast-shape-calculator/index.html',
  'tools/weight-converter/index.html',
];

const contexts = new Map(); // pattern -> count
for (const f of files) {
  const p = path.join(ROOT, f);
  const s = fs.readFileSync(p, 'utf8');
  let i = 0;
  while ((i = s.indexOf('\uFFFD', i)) !== -1) {
    // Look at 8 chars before and after.
    const before = s.substring(Math.max(0, i - 12), i);
    const after = s.substring(i + 1, i + 13);
    // Check if next char is '?' (the common pattern)
    const nextChar = s[i + 1];
    const key = (nextChar === '?') ? `${before}|�?|${after.substring(1)}` : `${before}|�|${after}`;
    contexts.set(key, (contexts.get(key) || 0) + 1);
    i += 1;
  }
}

// Sort by count desc.
const sorted = [...contexts.entries()].sort((a, b) => b[1] - a[1]);
console.log('Unique context patterns:', sorted.length);
console.log('---');
for (const [k, c] of sorted) {
  console.log(c.toString().padStart(4), k);
}
