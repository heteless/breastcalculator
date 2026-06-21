// scripts/audit-seo-tags.js
// Verify each page has: self-referencing canonical, hreflang en + x-default,
// meta description 120-155 chars, meta title 50-60 chars (per current audit).
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
  let r = abs.replace(/\\/g, '/').replace(/^d:\/DevProject\/breastcalculator\//i, '').replace(/^.*\/breastcalculator\//, '');
  if (r === 'index.html') return '/';
  if (r.endsWith('/index.html')) return '/' + r.slice(0, -('/index.html'.length)) + '/';
  return '/' + r;
}

const files = walk(ROOT);
const issues = { noCanonical: [], badCanonical: [], noHreflangEn: [], noHreflangXDefault: [], badHreflang: [], titleShort: [], titleLong: [], descShort: [], descLong: [] };

for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const url = relUrl(f);
  const expected = BASE + url;

  // Canonical
  const canon = (c.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || '';
  if (!canon) issues.noCanonical.push(url);
  else if (canon !== expected) issues.badCanonical.push(`${url} -> ${canon} (expected ${expected})`);

  // Hreflang en
  const hreflangEn = (c.match(/<link rel="alternate" hreflang="en" href="([^"]+)"/) || [])[1] || '';
  if (!hreflangEn) issues.noHreflangEn.push(url);
  else if (hreflangEn !== expected) issues.badHreflang.push(`en: ${url} -> ${hreflangEn} (expected ${expected})`);

  // Hreflang x-default
  const hreflangX = (c.match(/<link rel="alternate" hreflang="x-default" href="([^"]+)"/) || [])[1] || '';
  if (!hreflangX) issues.noHreflangXDefault.push(url);
  else if (hreflangX !== expected) issues.badHreflang.push(`x-default: ${url} -> ${hreflangX} (expected ${expected})`);

  // Title length
  const title = (c.match(/<title>([^<]+)<\/title>/) || [])[1] || '';
  if (title.length > 0 && title.length < 50) issues.titleShort.push(`${url} (${title.length} chars)`);
  if (title.length > 60) issues.titleLong.push(`${url} (${title.length} chars)`);

  // Description length (target 120-155)
  const desc = (c.match(/<meta name="description" content="([^"]+)"/) || [])[1] || '';
  if (desc.length > 0 && desc.length < 120) issues.descShort.push(`${url} (${desc.length} chars)`);
  if (desc.length > 155) issues.descLong.push(`${url} (${desc.length} chars)`);
}

const report = ['=== CANONICAL & HREFLANG AUDIT ===\n'];
report.push(`Files audited: ${files.length}\n`);

for (const [k, arr] of Object.entries(issues)) {
  report.push(`\n[${k}] ${arr.length}`);
  for (const u of arr.slice(0, 30)) report.push(`    ${u}`);
  if (arr.length > 30) report.push(`    ... and ${arr.length - 30} more`);
}

const text = report.join('\n');
console.log(text);
fs.writeFileSync('.seo-tags-audit.txt', text, 'utf8');
