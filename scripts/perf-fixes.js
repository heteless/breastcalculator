// scripts/perf-fixes.js
//
// Applies the Lighthouse-driven HTML optimizations in one idempotent
// pass over every index.html in the source tree:
//
//   1. Dedup the gtag.js loader <script async src="…gtag/js?id=…">
//      Lighthouse flagged the home page as loading it twice. Many
//      pages repeat the same mistake (history of incremental edits).
//      We collapse any run of identical loader tags to a single tag.
//
//   2. Replace the three render-blocking <link rel="stylesheet">
//      (style.css + tailwind-built.css + assets/bra-calculator.css)
//      with one <link rel="preload" … as="style" onload="…"> that
//      swaps to stylesheet after parse. Also add a <noscript> fallback
//      for JS-disabled clients.
//
//   3. Switch the global <script src="/script.js" defer> to
//      <script src="/common.js" defer>. The 45 KB minified bundle
//      is now split: non-calculator pages only pay for common.js
//      (≈33 KB), saving ~12 KB of parse/compile on every page.
//
//   4. Insert <script src="/calculator.js" defer> on the 4 calculator
//      pages (bra-size-calculator, breast-volume, breast-ptosis,
//      breast-expansion, breast-weight, breast-shape). The
//      calculator bundle is 11.7 KB and only loaded where needed.
//
// Idempotent — running twice with the same input is a no-op.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const MAIN_CSS = '/main.css';

// Pages that need the calculator bundle (relative URL paths).
const CALC_PAGES = new Set([
  '/bra-size-calculator/',
  '/breast-volume/',
  '/tools/breast-volume-calculator/',
  '/tools/breast-ptosis-calculator/',
  '/tools/breast-expansion-calculator/',
  '/tools/breast-weight-calculator/',
  '/tools/breast-shape-calculator/',
]);

const GTAG_LOADER_RE = /<script\b[^>]*googletagmanager\.com\/gtag\/js\?id=G-5SB8FNFYDV[^>]*><\/script>/g;
const STYLE_CSS_RE = /<link\b[^>]*href=(["'])\/style\.css(?:\?v=[a-z0-9]+)?\1[^>]*>/gi;
const TAILWIND_RE = /<link\b[^>]*href=(["'])\/tailwind-built\.css(?:\?v=[a-z0-9]+)?\1[^>]*>/gi;
const BRA_CALC_CSS_RE = /<link\b[^>]*href=(["'])\/assets\/bra-calculator\.css(?:\?v=[a-z0-9]+)?\1[^>]*>/gi;
const SCRIPT_JS_RE = /<script\b([^>]*?)\bsrc=(["'])\/script\.js(?:\?v=[a-z0-9]+)?\2([^>]*)>\s*<\/script>/gi;

function isCalcPage(file) {
  // Normalize to forward-slash path and strip /index.html so it matches
  // the canonical URL form (e.g. /bra-size-calculator/).
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  const url = '/' + rel.replace(/\/index\.html$/, '/');
  return CALC_PAGES.has(url);
}

function dedupGtagLoader(html) {
  // Collapse any run of identical gtag loader tags to one.
  return html.replace(
    /(<script\b[^>]*googletagmanager\.com\/gtag\/js\?id=G-5SB8FNFYDV[^>]*><\/script>\s*){2,}/g,
    '$1',
  );
}

function combineCss(html) {
  // Strip the three existing <link rel="stylesheet"> tags.
  let out = html.replace(STYLE_CSS_RE, '');
  out = out.replace(TAILWIND_RE, '');
  out = out.replace(BRA_CALC_CSS_RE, '');

  // Inject the preload + swap pattern just before the first
  // <link rel="stylesheet" …> in the document. If none exists,
  // insert it just after <head>.
  const PRELOAD_TAG =
    `<link rel="preload" href="${MAIN_CSS}" as="style" ` +
    `onload="this.onload=null;this.rel='stylesheet'"/>` +
    `<noscript><link rel="stylesheet" href="${MAIN_CSS}"/></noscript>`;

  if (out.includes('rel="preload" href="/main.css"')) {
    return out; // already converted
  }
  if (out.includes('rel="stylesheet"')) {
    return out.replace(/(<link\b[^>]*rel="stylesheet"[^>]*>)/, `${PRELOAD_TAG}$1`);
  }
  return out.replace(/<head\b[^>]*>/i, (m) => `${m}${PRELOAD_TAG}`);
}

function switchScriptTag(html) {
  // Replace <script src="/script.js" …> with <script src="/common.js" …>.
  // Preserves all other attributes (defer, integrity, crossorigin, etc.).
  return html.replace(SCRIPT_JS_RE, (match, pre, quote, post) => {
    return `<script${pre}src=${quote}/common.js${quote}${post}></script>`;
  });
}

function addCalculatorScript(html) {
  if (html.includes('src="/calculator.js"') || html.includes('src=\'/calculator.js\'')) {
    return html; // already there
  }
  const CALC_TAG = '<script src="/calculator.js" defer></script>';
  // Place immediately after the common.js tag if present, else after <head>.
  if (html.includes('/common.js')) {
    return html.replace(
      /<script\b[^>]*\/common\.js[^>]*><\/script>/,
      (m) => `${m}${CALC_TAG}`,
    );
  }
  return html.replace(/<head\b[^>]*>/i, (m) => `${m}${CALC_TAG}`);
}

function processFile(file) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  const url = '/' + rel.replace(/\/index\.html$/, '/');
  const isCalc = CALC_PAGES.has(url);
  const before = fs.readFileSync(file, 'utf8');

  let after = dedupGtagLoader(before);
  after = combineCss(after);
  after = switchScriptTag(after);
  if (isCalc) after = addCalculatorScript(after);

  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
  }
  return { changed: after !== before, isCalc };
}

function listHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) {
      continue;
    }
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listHtml(p));
    else if (entry.isFile() && entry.name === 'index.html') out.push(p);
  }
  return out;
}

function main() {
  const files = listHtml(ROOT);
  let changed = 0;
  let calcPages = 0;
  for (const f of files) {
    const r = processFile(f);
    if (r.changed) changed++;
    if (r.isCalc) calcPages++;
  }
  console.log(`[perf-fixes] HTML files scanned: ${files.length}`);
  console.log(`[perf-fixes] HTML files written: ${changed}`);
  console.log(`[perf-fixes] Calculator pages:   ${calcPages}`);
  console.log('[perf-fixes] Done.');
}

main();
