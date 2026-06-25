// Find all low-contrast color usages across the source
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOW_CONTRAST = /#(8b7355|a08882|7a6455|9b8275|b9a899|c4b3a3|d4c5b5|e5d5c5|b8a99a)/gi;

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', '.wrangler'].includes(e.name)) continue;
    if (e.name.startsWith('.') && e.name !== '.well-known') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(css|html)$/i.test(e.name)) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
const hits = {};
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const matches = c.match(LOW_CONTRAST) || [];
  for (const m of matches) {
    hits[m.toLowerCase()] = (hits[m.toLowerCase()] || 0) + 1;
  }
}
console.log('Low-contrast color usage by frequency:');
for (const [color, count] of Object.entries(hits).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${color}: ${count} occurrences`);
}
