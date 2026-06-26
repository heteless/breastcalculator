// Look at the full hub-cards HTML context and check other pages for inline max-width issues.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

console.log('=== Hub-cards section full context ===');
const hubStart = home.indexOf('<section class="hub-cards"');
const hubEnd = home.indexOf('</section>', hubStart);
// Find matching close (nested sections)
let depth = 1;
let idx = hubStart + 1;
while (depth > 0 && idx < home.length) {
  const nextOpen = home.indexOf('<section', idx);
  const nextClose = home.indexOf('</section>', idx);
  if (nextClose === -1) break;
  if (nextOpen !== -1 && nextOpen < nextClose) {
    depth++;
    idx = nextOpen + 1;
  } else {
    depth--;
    idx = nextClose + 1;
  }
}
console.log(home.substring(hubStart, idx + 10));

console.log('\n=== ALL inline max-width >= 1000px in homepage ===');
const inlineMaxW = [...home.matchAll(/max-width:\s*(\d{3,})px/g)];
inlineMaxW.forEach(m => {
  const start = Math.max(0, m.index - 60);
  const ctx = home.substring(start, m.index + m[0].length + 20);
  console.log('  ' + m[0] + '  <- ' + ctx.replace(/\s+/g, ' ').trim().substring(0, 100));
});

console.log('\n=== Check all HTML files for inline max-width >= 1000px ===');
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}
const htmls = walk(ROOT);
let count = 0;
for (const f of htmls) {
  const s = fs.readFileSync(f, 'utf8');
  const matches = [...s.matchAll(/max-width:\s*(\d{3,})px/g)];
  const big = matches.filter(m => parseInt(m[1]) >= 1000);
  if (big.length > 0) {
    const rel = path.relative(ROOT, f);
    big.forEach(m => console.log('  ' + rel + ': ' + m[0]));
    count += big.length;
  }
}
console.log('Total inline max-width >= 1000px occurrences:', count);
