#!/usr/bin/env node
/**
 * fix-css-preload.js
 * Replace the async `<link rel="preload" href="/main.css" as="style" onload=...>`
 * pattern with a synchronous `<link rel="stylesheet" href="/main.css">`.
 *
 * This eliminates the FOUT / CLS flash where the browser paints raw unstyled
 * HTML before main.css finishes downloading.
 *
 * Scans every *.html under ROOT and ROOT/dist.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Match the two-tag block. onload="..." is double-quoted, so we only need
// to exclude `"` inside the attribute value (single quotes appear as part of
// the JS code `this.rel='stylesheet'`).
const PRELOAD_RE = new RegExp(
  [
    /<link\s+rel=["']preload["']\s+href=["']\/main\.css["']\s+as=["']style["']\s+onload=["']this\.onload=null;this\.rel=['"]stylesheet['"]["']\s*\/>/,
    /\s*<noscript>\s*<link\s+rel=["']stylesheet["']\s+href=["']\/main\.css["']\s*\/>\s*<\/noscript>/,
  ].map(r => r.source).join(''),
  'g',
);

// Tolerant fallback: same two tags in any order/whitespace, but tolerant of
// extra attributes or different attribute order on the preload link.
const TAG_FALLBACK = new RegExp(
  [
    /<link\s[^>]*rel=["']preload["'][^>]*href=["']\/main\.css["'][^>]*\/?>/,
    /\s*<noscript>\s*<link\s[^>]*rel=["']stylesheet["'][^>]*href=["']\/main\.css["'][^>]*\/?>\s*<\/noscript>/,
  ].map(r => r.source).join(''),
  'gi',
);

const REPLACEMENT = '<link rel="stylesheet" href="/main.css">';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function fixFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  let out = src.replace(PRELOAD_RE, REPLACEMENT);
  if (out === src) {
    out = src.replace(TAG_FALLBACK, REPLACEMENT);
  }
  if (out !== src) {
    fs.writeFileSync(file, out, 'utf8');
    return true;
  }
  return false;
}

function main() {
  const targets = [
    ...walk(ROOT),
    ...walk(path.join(ROOT, 'dist')),
  ];
  // Dedupe (dist trees sometimes mirror source).
  const unique = [...new Set(targets)];
  let changed = 0;
  for (const f of unique) {
    if (fixFile(f)) {
      changed++;
      console.log('  fixed:', path.relative(ROOT, f));
    }
  }
  console.log(`\nDone. Scanned ${unique.length} HTML files, patched ${changed}.`);
}

main();
