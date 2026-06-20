// Migrate /compare/* to /bra-size-guide/compare/* with internal link updates and 301 redirects
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const COMPARE_OLD = path.join(ROOT, 'compare');
const COMPARE_NEW = path.join(ROOT, 'bra-size-guide', 'compare');

// Pages to migrate
const pages = [
  'index.html',
  '32d-vs-34c/index.html',
  '34b-vs-36c/index.html',
  '34dd-vs-36d/index.html',
  '36b-vs-34c/index.html',
  '38c-vs-40b/index.html',
  'b-cup-vs-c-cup/index.html',
  'breast-size-chart/index.html',
  'c-cup-vs-d-cup/index.html',
  'd-cup-vs-dd-cup/index.html',
  'dd-cup-vs-ddd-cup/index.html',
  'wireless-vs-wired-bra/index.html',
];

// 1. Create new directory structure
console.log('=== STEP 1: Copying files ===');
for (const page of pages) {
  const oldPath = path.join(COMPARE_OLD, page);
  const newPath = path.join(COMPARE_NEW, page);
  if (!fs.existsSync(oldPath)) {
    console.log(`  [SKIP] Source not found: ${page}`);
    continue;
  }
  fs.mkdirSync(path.dirname(newPath), { recursive: true });
  let content = fs.readFileSync(oldPath, 'utf8');

  // Update canonical URL
  content = content.replace(
    /<link rel="canonical" href="https:\/\/breastcalculator\.com\/compare\/[^"]*"\/?>/g,
    (match) => {
      const url = match.match(/href="([^"]+)"/)[1];
      const newUrl = url.replace('/compare/', '/bra-size-guide/compare/');
      return `<link rel="canonical" href="${newUrl}"/>`;
    }
  );

  // Update og:url
  content = content.replace(
    /<meta property="og:url" content="https:\/\/breastcalculator\.com\/compare\/[^"]*"/g,
    (match) => {
      const url = match.match(/content="([^"]+)"/)[1];
      const newUrl = url.replace('/compare/', '/bra-size-guide/compare/');
      return `<meta property="og:url" content="${newUrl}"`;
    }
  );

  // Update internal links from /compare/X to /bra-size-guide/compare/X
  content = content.replace(/href="\/compare\//g, 'href="/bra-size-guide/compare/');

  fs.writeFileSync(newPath, content, 'utf8');
  console.log(`  [OK] ${page}`);
}

console.log(`\n=== STEP 2: Update all internal references to /compare/ across the site ===`);
function walk(dir, base = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist', 'scripts', '.wrangler', '.vscode', '.tmp-gen', 'compare', 'bra-size-guide'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    const rel = base ? path.join(base, e.name) : e.name;
    if (e.isDirectory()) out.push(...walk(p, rel));
    else if (e.isFile() && e.name.endsWith('.html')) {
      out.push({ abs: p, rel: rel.replace(/\\/g, '/') });
    }
  }
  return out;
}

const files = walk(ROOT);
let updated = 0;
for (const { abs, rel } of files) {
  let c = fs.readFileSync(abs, 'utf8');
  const before = c;

  // Update href="/compare/X" to href="/bra-size-guide/compare/X" (skip if already in bra-size-guide)
  c = c.replace(/href="\/compare\//g, 'href="/bra-size-guide/compare/');

  if (c !== before) {
    fs.writeFileSync(abs, c, 'utf8');
    updated++;
    console.log(`  [OK] ${rel}`);
  }
}
console.log(`\nUpdated ${updated} files with new compare links`);
