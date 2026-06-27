// Verification script for build output
const fs = require('fs');
const path = require('path');

function countAll(str, needle) {
  let count = 0;
  let idx = str.indexOf(needle);
  while (idx !== -1) { count++; idx = str.indexOf(needle, idx + needle.length); }
  return count;
}

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');

const openCount = countAll(html, '<noscript>');
const closeCount = countAll(html, '</noscript>');
const nested = (html.match(/<noscript>[^<]*<noscript>/g) || []).length;

console.log('=== dist/index.html noscript check ===');
console.log('  <noscript> open count:', openCount);
console.log('  </noscript> close count:', closeCount);
console.log('  nested noscript count:', nested);

// CSS files
const cssFiles = ['main.css', 'assets/bra-calculator.css', 'tools/breast-volume-calculator/breast-volume.css'];
for (const rel of cssFiles) {
  const p = path.join(__dirname, '..', 'dist', rel);
  if (!fs.existsSync(p)) { console.log('\n=== ' + rel + ' MISSING ==='); continue; }
  const src = fs.readFileSync(p, 'utf8');
  const total = src.length;
  const bcTransitions = (src.match(/transition[^}]*border-color[^}]*}/g) || []).length;
  const bcAny = countAll(src, 'border-color');
  console.log('\n=== ' + rel + ' ===');
  console.log('  size:', total, 'bytes');
  console.log('  border-color occurrences (any):', bcAny);
  console.log('  transitions containing border-color:', bcTransitions);
}

// Also verify style.css source has no border-color transitions
const styleSrc = path.join(__dirname, '..', 'style.css');
if (fs.existsSync(styleSrc)) {
  const s = fs.readFileSync(styleSrc, 'utf8');
  const bcTransitions = (s.match(/transition[^}]*border-color[^}]*}/g) || []).length;
  console.log('\n=== source style.css ===');
  console.log('  transitions containing border-color:', bcTransitions);
}
