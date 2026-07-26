const fs = require('fs');
const src = fs.readFileSync('assets/bra-calculator-enhance.js', 'utf8');
const idx = src.indexOf("form.addEventListener('submit'");
const slice = src.slice(idx, idx + 3500);
// Print every 100 chars with position
for (let i = 0; i < slice.length; i += 80) {
  console.log(String(i).padStart(5) + ': ' + slice.slice(i, i + 80));
}
