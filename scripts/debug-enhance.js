const fs = require('fs');
const src = fs.readFileSync('assets/bra-calculator-enhance.js', 'utf8');
const idx = src.indexOf("form.addEventListener('submit'");
console.log('submit listener at idx:', idx);
if (idx >= 0) {
  console.log('snippet 0-2000 chars after:');
  console.log(src.slice(idx, idx + 2000));
}
const idx2 = src.indexOf('function enhance(form)');
console.log('\nenhance() at idx:', idx2);
console.log('init() at idx:', src.indexOf('function init()'));
const idx3 = src.indexOf('var BC = window.BraCalculator');
console.log('BC reference at idx:', idx3);
const idx4 = src.indexOf('window.__bcEnhanceLoaded');
console.log('__bcEnhanceLoaded at idx:', idx4);
console.log('end of file:', src.length);
console.log('last 200 chars:', src.slice(-200));
