const fs = require('fs');
const s = fs.readFileSync('style.css', 'utf8');

// Check article-hero
console.log('=== .article-hero ===');
let i = s.indexOf('.article-hero{');
while (i >= 0) {
  console.log('at', i, ':', s.substring(i, i + 200));
  i = s.indexOf('.article-hero{', i + 1);
}

// Check tool-closing
console.log('\n=== .tool-closing ===');
i = s.indexOf('.tool-closing');
console.log('found at:', i);

// Check all 4 tool pages Thank You boxes
console.log('\n=== Thank You boxes across tool pages ===');
const files = [
  'tools/breast-expansion-calculator/index.html',
  'tools/breast-ptosis-calculator/index.html',
  'tools/length-converter/index.html',
  'tools/weight-converter/index.html',
];
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  const ty = t.indexOf('Thank you');
  if (ty >= 0) {
    // Find the wrapping div
    const before = t.substring(ty - 400, ty);
    const divStart = before.lastIndexOf('<div class="tool-closing"');
    const divEnd = t.indexOf('</div>', ty);
    console.log(`\n--- ${f} ---`);
    console.log(t.substring(divStart, divEnd + 6));
  }
}
