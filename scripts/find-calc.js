const fs = require('fs');
const c = fs.readFileSync('D:/DevProject/breastcalculator/assets/bra-calculator.js', 'utf8');
const re = /calculateBraSize|validateMeasurement|getSisterSizes|getBraRecommendation|CUP_LETTERS|cupLetter|BAND_OFFSET|US_FACTOR|BAND_ROUNDING|function\s+BC\.|return\s+\{|return\s*\{[^}]*us[^}]*\}/g;
let m, count = 0;
while ((m = re.exec(c)) !== null && count < 10) {
  console.log('--- @' + m.index + ' "' + m[0].slice(0, 60) + '" ---');
  console.log(c.slice(m.index, Math.min(c.length, m.index + 400)));
  console.log();
  count++;
}
console.log('Total:', count);
