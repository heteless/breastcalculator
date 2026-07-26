const fs = require('fs');
const c = fs.readFileSync('D:/DevProject/breastcalculator/assets/bra-calculator.css', 'utf8');
const re = /bc-result-card|bc-result-grid|bc-result-cell|bc-result-title|bc-result-recommendation|bc-result-label|bc-result-value|bc-result-cell-primary|bc-flash-success/g;
let m, count = 0;
while ((m = re.exec(c)) !== null && count < 3) {
  console.log('--- @' + m.index + ' "' + m[0] + '" ---');
  console.log(c.slice(m.index, Math.min(c.length, m.index + 700)));
  console.log();
  count++;
}
console.log('Total:', count);
