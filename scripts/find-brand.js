const fs = require('fs');
const c = fs.readFileSync('D:/DevProject/breastcalculator/dist/main.css', 'utf8');
// Try multiple search terms
const terms = ['calc-field:nth-child', 'nth-child(3)', 'bcGlowPulse', 'section 20', '首页', 'grid-column:1/-1', 'grid-column: 1 / -1'];
for (const t of terms) {
  const idx = c.indexOf(t);
  console.log(`"${t}": ${idx}`);
}
// Look for "20." section
const m = c.match(/\/\*\s*=+\s*\n\s*20\.[^]*?(?=\*\/)/g);
if (m) console.log('Section 20 found:', m[0].slice(0, 500));
