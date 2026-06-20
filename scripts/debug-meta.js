const fs = require('fs');
const c = fs.readFileSync('specials/index.html', 'utf8');
const idx = c.indexOf('description');
console.log('Has description:', c.includes('description'));
console.log('Context around description:');
console.log(idx >= 0 ? c.substring(Math.max(0, idx - 50), idx + 200) : '(none)');
const m = c.match(/<meta[^>]*name=['"]description['"][^>]*>/);
console.log('Regex match:', m ? m[0] : '(none)');
