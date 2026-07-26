// scripts/find-remaining-logo.js
const fs = require('fs');
const path = require('path');
function walk(d, acc = []) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p, acc);
    else if (f.name.endsWith('.html')) {
      const c = fs.readFileSync(p, 'utf8');
      if (/class="nav-logo"/.test(c) && !/nav-logo-img/.test(c)) {
        acc.push(p.replace(/^dist[\\\/]/, '').replace(/[\\\/]/g, '/'));
      }
    }
  }
  return acc;
}
const r = walk(path.join(__dirname, '..', 'dist'));
console.log('Remaining without favicon img:', r.length);
r.forEach(x => console.log('  -', x));
