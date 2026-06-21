// scripts/fix-canonical-hreflang.js
// One-time fixer: rewrite canonical and hreflang tags to be self-referencing
// on every HTML page in the site. The site uses trailing-slash URLs as canonical.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP = new Set(['.git', 'node_modules', 'dist', 'dist-dryrun', '.wrangler', '.vscode', '.tmp-gen']);
const SKIP_FILES = new Set(['footer.html', 'header.html', '404.html', '404/index.html', 'header-wellness-popup.html']);
const BASE = 'https://breastcalculator.com';

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile() && e.name.endsWith('.html')) {
      const rel = path.relative(ROOT, p).replace(/\\/g, '/');
      if (SKIP_FILES.has(rel)) continue;
      out.push(p);
    }
  }
  return out;
}

function relUrl(abs) {
  let r = abs.replace(/\\/g, '/').replace(/^.*\/breastcalculator\//i, '');
  if (r === 'index.html') return '/';
  if (r.endsWith('/index.html')) return '/' + r.slice(0, -('/index.html'.length)) + '/';
  return '/' + r;
}

let fixed = 0;
const log = [];

for (const f of walk(ROOT)) {
  let c = fs.readFileSync(f, 'utf8');
  const url = relUrl(f);
  const expected = BASE + url;

  const before = c;
  // Replace canonical
  c = c.replace(
    /<link rel="canonical" href="[^"]+"\s*\/>/,
    `<link rel="canonical" href="${expected}"/>`
  );
  // Replace hreflang en
  c = c.replace(
    /<link rel="alternate" hreflang="en" href="[^"]+"\s*\/>/,
    `<link rel="alternate" hreflang="en" href="${expected}"/>`
  );
  // Replace hreflang x-default
  c = c.replace(
    /<link rel="alternate" hreflang="x-default" href="[^"]+"\s*\/>/,
    `<link rel="alternate" hreflang="x-default" href="${expected}"/>`
  );

  if (c !== before) {
    fs.writeFileSync(f, c, 'utf8');
    fixed++;
    log.push(`[OK] ${url}`);
  }
}

console.log(log.join('\n'));
console.log(`\nTotal files updated: ${fixed}`);
