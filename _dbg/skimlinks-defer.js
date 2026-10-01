#!/usr/bin/env node
/**
 * Add `defer` to the Skimlinks loader across the source tree.
 *
 * Why: the snippet sits right before </body> with no async/defer, so it is a
 * parser-blocking request (~57 KB) on every page. Skimlinks only needs to bind
 * link interception by DOMContentLoaded, so `defer` keeps the same execution
 * timing guarantee while letting the browser download it in parallel.
 *
 * Idempotent: skips files that already carry defer/async on that tag.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set([
  'node_modules', 'dist', 'dist-dryrun', '_dbg', 'scripts',
  '.git', '.wrangler', '.backup', '.cache', 'reports', 'screenshots',
]);
const RE = /(<script\b[^>]*src="https:\/\/s\.skimresources\.com\/js\/[^"]+\.skimlinks\.js")(\s*><\/script>)/g;

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), out);
    } else if (entry.name.endsWith('.html')) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

let changed = 0, skipped = 0;
for (const file of walk(ROOT, [])) {
  const src = fs.readFileSync(file, 'utf8');
  if (!src.includes('skimlinks.js')) { skipped++; continue; }
  let touched = false;
  const out = src.replace(RE, (m, head, tail) => {
    if (/\b(defer|async)\b/.test(head)) return m; // already fine
    touched = true;
    return head + ' defer' + tail;
  });
  if (touched) { fs.writeFileSync(file, out, 'utf8'); changed++; }
}
console.log(`[skimlinks-defer] changed: ${changed}, untouched: ${skipped}`);
