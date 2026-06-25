// _audit-articles.js — report which articles use which container
const fs = require('fs');
const path = require('path');

const dirs = ['article', 'tools', 'wellness', 'specials', 'compare'];
const ROOT = process.cwd();
const stats = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') stats.push(p);
  }
}
for (const d of dirs) walk(d);

for (const f of stats) {
  const s = fs.readFileSync(f, 'utf8');
  const articleMatch = s.match(/<article\s+class="article"/);
  const heroMatch = s.match(/<section\s+class="hero"/);
  const containerMatch = s.match(/class="container"/);
  const max4xlMatch = s.match(/max-w-4xl/);
  const refH2 = /<h2[^>]*>\s*(References|Related Tools|Sources|Citations)\b/i.test(s);
  const ulStyle = (s.match(/<ul[^>]*style="padding-left:1\.25rem"/g) || []).length;
  const ulClass = (s.match(/<ul[^>]*class="/g) || []).length;
  const olCount = (s.match(/<ol\b/g) || []).length;
  console.log(
    f.padEnd(70),
    'art:', articleMatch ? 'Y' : '-',
    'hero:', heroMatch ? 'Y' : '-',
    'cont:', containerMatch ? 'Y' : '-',
    '4xl:', max4xlMatch ? 'Y' : '-',
    'refs:', refH2 ? 'Y' : '-',
    'ul-style:', ulStyle,
    'ul-class:', ulClass,
    'ol:', olCount
  );
}
