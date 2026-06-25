// _inspect-articles.js — print structural outline of article pages
const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2).map(f => path.resolve(f));
const RE = /<(section|article|div|footer|main|h[1-3]|ul|ol|table)\b[^>]*>/g;

for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  console.log('\n=== ' + path.relative(process.cwd(), f) + ' (len ' + s.length + ') ===');
  const m = [...s.matchAll(RE)];
  m.slice(0, 80).forEach((x, i) => {
    const tag = x[0].replace(/\s+/g, ' ').slice(0, 110);
    console.log(String(i).padStart(3), tag);
  });
}
