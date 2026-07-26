const fs = require('fs');
const c = fs.readFileSync('D:/DevProject/breastcalculator/assets/bra-calculator.css', 'utf8');
// Find the .bc-quick-templates { CSS rule specifically
const re = /(\.bc-quick-(?:templates|btn|label)[\s\S]*?\{[\s\S]*?\}\s*\}|\.bc-quick-(?:templates|btn|label)[\s\S]{0,1200}?\{)/g;
let m;
let count = 0;
while ((m = re.exec(c)) !== null && count < 3) {
  console.log('--- match ---');
  console.log(m[0].slice(0, 1500));
  console.log();
  count++;
}
console.log('Total matches:', count);
