const fs = require('fs');
const c = fs.readFileSync('common.js', 'utf8');
const m = c.match(/createPolicy\(['"]([^'"]+)['"]/);
console.log('policy name:', m ? m[1] : 'NOT FOUND');
