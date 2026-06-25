// Cache-bust script for the breastcalculator static site.
//
// Why this exists
// ---------------
// /main.css, /common.js, and /calculator.js are served with
// `Cache-Control: public, max-age=31536000, immutable` (1 year) so
// browsers re-use them aggressively. The HTML pages reference them by
// path; without a version query string, a browser that has already
// cached the file will not refetch it for a year even if we deploy
// a new copy.
//
// The fix used by the script
// --------------------------
// 1. Compute a short content hash of /main.css, /common.js, and
//    /calculator.js.
// 2. Rewrite every *.html file so their <link href="/main.css"> and
//    <script src="/common.js">/src="/calculator.js"> tags carry
//    `?v=<hash>`. The path stays the same so the _headers rules still
//    match; the query string just changes the cache key.
// 3. Add a meta cache-control tag as a belt-and-suspenders fallback so
//    that browsers revalidate the HTML itself, not just the assets.
//
// Idempotent: running the script twice with the same file contents is a
// no-op (the version parameter already matches the current hash).

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MAIN_CSS_FILE = path.join(ROOT, 'main.css');
const COMMON_JS_FILE = path.join(ROOT, 'common.js');
const CALC_JS_FILE = path.join(ROOT, 'calculator.js');

if (!fs.existsSync(MAIN_CSS_FILE) || !fs.existsSync(COMMON_JS_FILE) || !fs.existsSync(CALC_JS_FILE)) {
  console.error('[cache-bust] main.css, common.js, or calculator.js not found at repo root.');
  process.exit(1);
}

function shortHash(file) {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(file));
  return hash.digest('hex').slice(0, 8);
}

const mainHash = shortHash(MAIN_CSS_FILE);
const commonHash = shortHash(COMMON_JS_FILE);
const calcHash = shortHash(CALC_JS_FILE);
const mainV = `?v=${mainHash}`;
const commonV = `?v=${commonHash}`;
const calcV = `?v=${calcHash}`;
console.log(`[cache-bust] main.css hash:      ${mainHash}`);
console.log(`[cache-bust] common.js hash:     ${commonHash}`);
console.log(`[cache-bust] calculator.js hash: ${calcHash}`);

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
const mainCssRe = /(<link\b[^>]*?href=)(["'])\/main\.css(?:\?v=[a-z0-9]+)?\2([^>]*>)/gi;
const commonJsRe = /(<script\b[^>]*?src=)(["'])\/common\.js(?:\?v=[a-z0-9]+)?\2([^>]*><\/script>)/gi;
const calcJsRe = /(<script\b[^>]*?src=)(["'])\/calculator\.js(?:\?v=[a-z0-9]+)?\2([^>]*><\/script>)/gi;

for (const file of htmlFiles) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;

  after = after.replace(mainCssRe, (match, pre, quote, post) => {
    assetLinksUpdated++;
    return `${pre}${quote}/main.css${mainV}${quote}${post}`;
  });

  after = after.replace(commonJsRe, (match, pre, quote, post) => {
    assetLinksUpdated++;
    return `${pre}${quote}/common.js${commonV}${quote}${post}`;
  });

  after = after.replace(calcJsRe, (match, pre, quote, post) => {
    assetLinksUpdated++;
    return `${pre}${quote}/calculator.js${calcV}${quote}${post}`;
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
