const path = require('path');
const fs = require('fs');
const ROOT = 'd:/DevProject/breastcalculator';
const p = path.join(ROOT, '404', 'index.html');
console.log('p:', p);
console.log('rel:', path.relative(ROOT, p));
console.log('rel normalized:', path.relative(ROOT, p).replace(/\\/g, '/'));
console.log('exists:', fs.existsSync(p));
