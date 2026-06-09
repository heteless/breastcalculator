// Cache-bust script for the breastcalculator static site.
//
// Why this exists
// ---------------
// /style.css and /script.js are served with `Cache-Control:
// public, max-age=31536000, immutable` (1 year, immutable) so browsers
// re-use them aggressively. The HTML pages reference them by path
// (e.g. <link rel="stylesheet" href="/style.css"/>) — without a version
// query string, a browser that has already cached the file will not
// refetch it for a year even if we deploy a new CSS file.
//
// The fix used by the script
// --------------------------
// 1. Compute a short content hash of /style.css and /script.js.
// 2. Rewrite every *.html file so their <link rel="stylesheet" href="/style.css">
//    and <script src="/script.js"> tags carry `?v=<hash>`. The path stays
//    the same so the _headers rules still match; the query string just
//    changes the cache key.
// 3. Add a meta cache-control tag as a belt-and-suspenders fallback so
//    that browsers revalidate the HTML itself, not just the assets.
//
// Idempotent: running the script twice with the same file contents is a
// no-op (the version parameter already matches the current hash).

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STYLE_FILE = path.join(ROOT, 'style.css');
const SCRIPT_FILE = path.join(ROOT, 'script.js');

if (!fs.existsSync(STYLE_FILE) || !fs.existsSync(SCRIPT_FILE)) {
  console.error('[cache-bust] style.css or script.js not found at repo root.');
  process.exit(1);
}

function shortHash(file) {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(file));
  return hash.digest('hex').slice(0, 8);
}

const styleHash = shortHash(STYLE_FILE);
const scriptHash = shortHash(SCRIPT_FILE);
const styleV = `?v=${styleHash}`;
const scriptV = `?v=${scriptHash}`;
console.log(`[cache-bust] style.css hash: ${styleHash}`);
console.log(`[cache-bust] script.js hash: ${scriptHash}`);

function listHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listHtml(p));
    else if (entry.isFile() && entry.name === 'index.html') out.push(p);
  }
  return out;
}

const htmlFiles = listHtml(ROOT);
let touched = 0;
let metaInserted = 0;
let assetLinksUpdated = 0;

const META_TAG = '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/>';

// Match the link/script tags regardless of attribute order. We accept the
// canonical form the existing files use, but the regex is tolerant of
// double-quoted or single-quoted href/src values.
const styleLinkRe = /<link\b([^>]*?)\bhref=(["'])\/style\.css(?:\?v=[a-z0-9]+)?\2([^>]*)>/gi;
const scriptTagRe = /<script\b([^>]*?)\bsrc=(["'])\/script\.js(?:\?v=[a-z0-9]+)?\2([^>]*)>\s*<\/script>/gi;

for (const file of htmlFiles) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;

  after = after.replace(styleLinkRe, (match, pre, quote, post) => {
    assetLinksUpdated++;
    return `<link${pre}href=${quote}/style.css${styleV}${quote}${post}>`;
  });

  after = after.replace(scriptTagRe, (match, pre, quote, post) => {
    assetLinksUpdated++;
    return `<script${pre}src=${quote}/script.js${scriptV}${quote}${post}></script>`;
  });

  // Insert the meta cache-control tag right after <head> if missing.
  if (!after.includes('http-equiv="Cache-Control"')) {
    after = after.replace(/<head\b[^>]*>/i, (m) => `${m}${META_TAG}`);
    metaInserted++;
  }

  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    touched++;
  }
}

console.log(`[cache-bust] HTML files scanned: ${htmlFiles.length}`);
console.log(`[cache-bust] HTML files written:  ${touched}`);
console.log(`[cache-bust] Meta tags inserted:  ${metaInserted}`);
console.log(`[cache-bust] Asset links updated: ${assetLinksUpdated}`);
console.log('[cache-bust] Done.');
