const fs = require('fs');
const c = fs.readFileSync('D:/DevProject/breastcalculator/main.css', 'utf8');
const terms = ['calc-field:nth-child', 'bcGlowPulse', '20. 首页'];
for (const t of terms) {
  const idx = c.indexOf(t);
  console.log('[' + t + ']: ' + idx);
}
console.log('Total length:', c.length);
