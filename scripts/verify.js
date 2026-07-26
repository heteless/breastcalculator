const fs = require('fs');
const path = require('path');
// Use process.cwd() and absolute path
const c = fs.readFileSync(path.join(process.cwd(), 'main.css'), 'utf8');
console.log('Path:', path.join(process.cwd(), 'main.css'));
console.log('File size:', c.length);
const terms = ['calc-field:nth-child', 'bcGlowPulse', '20. \u9996\u9875', 'global-layout.css'];
for (const t of terms) {
  const idx = c.indexOf(t);
  console.log('[' + t + ']: ' + idx);
}
// Show last 2000 chars
console.log('---Last 2000 chars---');
console.log(c.slice(-2000));
