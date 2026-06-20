// SEO Audit — walk every HTML file in source tree (excluding .git, dist, etc.)
// Report: title length, description length/presence, canonical, og:title, og:description,
//         twitter:title, json-ld types, h1 count, internal link count, external link count.
const fs = require('fs');
const path = require('path');

const ROOT = 'd:/DevProject/breastcalculator';
const SKIP = new Set(['.git', 'node_modules', 'dist', 'dist-dryrun', '.wrangler', '.vscode', '.tmp-gen']);
// Files that are HTML but not real pages (template fragments, redirects, 404s, etc.)
const SKIP_FILES = new Set([
  'footer.html',   // Tailwind content-source fragment
  'header.html',   // Tailwind content-source fragment
  '404.html',      // 404 page — intentionally no canonical
  '404/index.html',// 404 page — intentionally no canonical
]);

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile() && e.name.endsWith('.html')) {
      // Skip template fragments and intentional 404 pages
      const rel = path.relative(ROOT, p).replace(/\\/g, '/');
      if (SKIP_FILES.has(rel)) continue;
      out.push(p);
    }
  }
  return out;
}

function relUrl(abs) {
  let r = abs.replace(/\\/g, '/').replace(/^d:\/DevProject\/breastcalculator\//, '');
  if (r === 'index.html') return '/';
  if (r.endsWith('/index.html')) return '/' + r.slice(0, -('/index.html'.length)) + '/';
  return '/' + r;
}

const files = walk(ROOT);
console.log('AUDITING', files.length, 'HTML files\n');

const report = [];
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const url = relUrl(f);

  const title = (c.match(/<title>([^<]+)<\/title>/) || [])[1] || '';
  const desc  = (c.match(/<meta name="description" content="([^"]+)"/) || [])[1] || '';
  const canon = (c.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || '';
  const ogT   = (c.match(/<meta property="og:title" content="([^"]+)"/) || [])[1] || '';
  const ogD   = (c.match(/<meta property="og:description" content="([^"]+)"/) || [])[1] || '';
  const twT   = (c.match(/<meta name="twitter:title" content="([^"]+)"/) || [])[1] || '';
  const twD   = (c.match(/<meta name="twitter:description" content="([^"]+)"/) || [])[1] || '';
  // Match the entire H1 element so we count actual H1 occurrences (not nested text)
  const h1s   = (c.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) || []);
  const h1Count = h1s.length;
  const jsonLdTypes = Array.from(c.matchAll(/"@type":"([^"]+)"/g)).map(m => m[1]);
  const uniqTypes = [...new Set(jsonLdTypes)];

  // Internal links — count hrefs that don't start with http
  const hrefs = Array.from(c.matchAll(/href="([^"]+)"/g)).map(m => m[1]);
  const internal = hrefs.filter(h => !/^https?:\/\//i.test(h) && !h.startsWith('mailto:') && !h.startsWith('tel:') && !h.startsWith('#'));
  const external = hrefs.filter(h => /^https?:\/\//i.test(h));

  const issues = [];
  if (!title) issues.push('NO_TITLE');
  else if (title.length < 30) issues.push('TITLE_SHORT');
  else if (title.length > 65) issues.push('TITLE_LONG');
  if (!desc) issues.push('NO_DESC');
  else if (desc.length < 120) issues.push('DESC_SHORT');
  else if (desc.length > 160) issues.push('DESC_LONG');
  if (!canon) issues.push('NO_CANONICAL');
  if (!ogT) issues.push('NO_OG_TITLE');
  if (!ogD) issues.push('NO_OG_DESC');
  if (!twT) issues.push('NO_TW_TITLE');
  if (h1Count === 0) issues.push('NO_H1');
  else if (h1Count > 1) issues.push('MULTI_H1');
  if (uniqTypes.length === 0) issues.push('NO_SCHEMA');
  if (internal.length < 3) issues.push('LOW_INTERNAL_LINKS');

  report.push({
    url,
    titleLen: title.length,
    descLen:  desc.length,
    canonOk:  !!canon,
    h1Count,
    schemas:  uniqTypes.join('+'),
    internal: internal.length,
    external: external.length,
    issues:   issues.join(',') || 'OK'
  });
}

// Summary
const totals = { OK: 0, withIssues: 0 };
const issueCounts = {};
for (const r of report) {
  if (r.issues === 'OK') totals.OK++;
  else { totals.withIssues++; for (const i of r.issues.split(',')) issueCounts[i] = (issueCounts[i]||0)+1; }
}
console.log('=== TOTALS ===');
console.log('OK pages:        ', totals.OK);
console.log('Pages w/ issues: ', totals.withIssues);
console.log('Total:           ', report.length);
console.log('\n=== ISSUE BREAKDOWN ===');
Object.entries(issueCounts).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => console.log('  ', k.padEnd(20), v));

// Write CSV for further analysis
const csv = ['url,titleLen,descLen,canonOk,h1Count,schemas,internalLinks,externalLinks,issues'];
for (const r of report) {
  csv.push([r.url, r.titleLen, r.descLen, r.canonOk, r.h1Count, '"'+r.schemas+'"', r.internal, r.external, r.issues].join(','));
}
fs.writeFileSync('.seo-audit.csv', csv.join('\n'), 'utf8');
console.log('\nWrote .seo-audit.csv  (' + report.length + ' rows)');

// Print top 30 most-broken pages
console.log('\n=== TOP 30 PAGES WITH MOST ISSUES ===');
report.filter(r => r.issues !== 'OK').sort((a,b) => b.issues.split(',').length - a.issues.split(',').length).slice(0, 30).forEach(r => {
  console.log(`  [${r.issues.split(',').length}] ${r.url}`);
  console.log(`       ${r.issues}`);
});
