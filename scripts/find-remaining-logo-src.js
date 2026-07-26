// scripts/find-remaining-logo-src.js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', 'scripts', '.well-known', 'images', 'assets', 'seo', '.github', '.trae', '.reasonix', 'dist']);
function walk(d, acc = []) {
  if (!fs.existsSync(d)) return acc;
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    if (SKIP.has(f.name)) continue;
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p, acc);
    else if (f.name.endsWith('.html')) {
      const c = fs.readFileSync(p, 'utf8');
      if (/class="nav-logo"/.test(c) && !/nav-logo-img/.test(c)) {
        acc.push(p.replace(/^.*[\\\/]breastcalculator[\\\/]/, '').replace(/[\\\/]/g, '/'));
      }
    }
  }
  return acc;
}
const r = walk(ROOT);
console.log('Source remaining without favicon img:', r.length);
r.forEach(x => console.log('  -', x));
