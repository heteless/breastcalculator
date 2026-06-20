const fs = require('fs');
const path = require('path');
const c = fs.readFileSync(path.join(__dirname, '..', 'tools', 'index.html'), 'utf8');
// Find robots meta
const m = c.match(/<meta[^>]*robots[^>]*>/);
console.log('Robots meta:', m ? m[0] : '(none)');
// Find h1
const h1m = c.match(/<h1[\s\S]*?<\/h1>/i);
console.log('H1:', h1m ? h1m[0] : '(none)');
// Find body start
const bm = c.match(/<body[^>]*>/);
console.log('Body tag:', bm ? bm[0] : '(none)');
// Check first 200 chars after body
const bodyStart = c.indexOf('<body');
if (bodyStart >= 0) {
  console.log('After body start:');
  console.log(c.substring(bodyStart, bodyStart + 600));
}
