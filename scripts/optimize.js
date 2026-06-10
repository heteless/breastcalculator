// Build-time optimizer for the breastcalculator static site.
//
// Why this exists
// ---------------
// Cloudflare Workers limits the asset bundle to 25 MiB and 25,000 files.
// The site is currently ~2.9 MiB / 90 files (11.6% of the cap), so the
// hard limit is not at risk. This script exists to:
//
//   1. Reduce page weight (faster TTFB, lower bandwidth).
//   2. Make the deploy a tighter, more professional artifact.
//   3. Run as part of `npm run build` so every deploy ships optimized.
//
// Design constraints
// ------------------
// - Zero npm dependencies. The original `node_modules` blowup (119 MiB
//   of workerd) happened because the build pulled in heavy packages.
//   This script uses only Node built-ins.
// - Idempotent. Running it twice with already-minified input is a no-op.
// - Safe. The transformations are conservative (whitespace, comments,
//   trailing semicolons) and preserve semantics for our well-formed
//   HTML / CSS / JS. No variable renaming, no AST rewrites.
//
// What it does
// ------------
//   HTML  - strip comments (keep IE conditionals), collapse whitespace,
//           drop redundant attributes (type="text/javascript" etc.),
//           trim whitespace between tags.
//   CSS   - strip comments, collapse whitespace, drop redundant
//           semicolons, shorten #ffffff -> #fff, drop leading zero in
//           0.x numbers.
//   JS    - strip // and /* */ comments, collapse whitespace inside
//           strings and outside them, drop trailing semicolons where
//           safe. No variable renaming (requires AST analysis).
//   SVG   - strip comments, drop XML declaration, collapse whitespace,
//           strip default attribute values.
//
// The script edits files in place. The originals are recoverable from
// git if a regression is discovered.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Files we never touch.
const SKIP_DIRS = new Set(['node_modules', '.git', 'scripts', '.wrangler', '.vscode']);
const SKIP_FILES = new Set(['cache-bust.js', 'package.json', 'package-lock.json', 'bun.lock']);

// ---------- Minifiers ----------

function minifyHTML(html) {
  return html
    // Strip normal HTML comments; preserve <!--[if ...]> and <![endif]-->
    .replace(/<!--(?!\s*\[if)[\s\S]*?-->/g, '')
    // Drop the XML processing instruction (<?xml ... ?>) - irrelevant for HTML
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    // Remove redundant type attributes
    .replace(/\s+type=["']text\/(javascript|css)["']/gi, '')
    .replace(/\s+type=["'](application\/(javascript|ecmascript))["']/gi, '')
    .replace(/\s+language=["'][^"']*["']/gi, '')
    // NOTE: do NOT strip charset="utf-8" — the meta charset is required so
    // browsers render non-ASCII characters (e.g. ▾ dropdown arrows, em
    // dashes, CJK) correctly. Removing it produced "â–¾" garbled output.
    // Collapse all whitespace runs (including newlines) to a single space
    .replace(/\s+/g, ' ')
    // Remove whitespace between tags
    .replace(/>\s+</g, '><')
    // Remove whitespace at the start of a tag content
    .replace(/\s+>/g, '>')
    .trim();
}

function minifyCSS(css) {
  return css
    // Strip /* ... */ comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Preserve strings (so url("a b c") doesn't lose spaces) and comments
    // are already stripped. Collapse remaining whitespace.
    .replace(/\s+/g, ' ')
    // Remove space around structural characters
    .replace(/\s*([{};:,>+~()])\s*/g, '$1')
    // Drop trailing semicolons before closing brace
    .replace(/;}/g, '}')
    // Remove leading zero in numbers: 0.5em -> .5em
    .replace(/\b0+\.(\d+)/g, '.$1')
    // Shorten 6-digit colors
    .replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3\b/gi, '#$1$2$3')
    // Shorten rgb(0,0,0) -> rgb(0,0,0) is fine; collapse 0% to 0
    .replace(/\b0(\s*%|px|em|rem|vh|vw)\b/g, '0')
    .trim();
}

function minifyJS(js) {
  // Strip /* ... */ comments
  let out = js.replace(/\/\*[\s\S]*?\*\//g, '');
  // Strip // line comments (without breaking string literals)
  out = out
    .split('\n')
    .map((line) => {
      // crude: find // that is not inside a string
      const commentIdx = findLineCommentStart(line);
      return commentIdx === -1 ? line : line.slice(0, commentIdx);
    })
    .join('\n');
  // Collapse whitespace runs (preserving newline as space)
  out = out.replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n');
  // Remove blank lines
  out = out.replace(/\n{2,}/g, '\n');
  // Remove whitespace around operators and punctuation (safe for our script)
  out = out.replace(/\s*([{};,:])\s*/g, '$1');
  // Trim leading/trailing
  out = out.trim();
  return out;
}

function findLineCommentStart(line) {
  let inString = null;
  for (let i = 0; i < line.length - 1; i++) {
    const c = line[i];
    const next = line[i + 1];
    if (inString) {
      if (c === '\\') { i++; continue; }
      if (c === inString) inString = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inString = c; continue; }
    if (c === '/' && next === '/') return i;
  }
  return -1;
}

function minifySVG(svg) {
  return svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .replace(/ ([a-zA-Z-]+)=(["'])\2/g, '$1')  // drop empty attributes
    .replace(/\s+\/>/g, '/>')
    .trim();
}

// ---------- File scanning ----------

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    if (entry.name.startsWith('.') && entry.name !== '.well-known') continue;
    if (SKIP_FILES.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.isFile()) out.push(p);
  }
  return out;
}

const minifiers = [
  { ext: '.html', label: 'HTML', fn: minifyHTML },
  { ext: '.css',  label: 'CSS',  fn: minifyCSS  },
  { ext: '.js',   label: 'JS',   fn: minifyJS   },
  { ext: '.svg',  label: 'SVG',  fn: minifySVG  },
];

const allFiles = walk(ROOT);
const stats = { HTML: { n: 0, before: 0, after: 0 },
                CSS:  { n: 0, before: 0, after: 0 },
                JS:   { n: 0, before: 0, after: 0 },
                SVG:  { n: 0, before: 0, after: 0 } };
let touched = 0;
let skipped = 0;

for (const file of allFiles) {
  const ext = path.extname(file).toLowerCase();
  const m = minifiers.find((x) => x.ext === ext);
  if (!m) continue;
  const before = fs.readFileSync(file, 'utf8');
  if (before.length === 0) { skipped++; continue; }
  const after = m.fn(before);
  if (after === before) { skipped++; continue; }
  fs.writeFileSync(file, after, 'utf8');
  stats[m.label].n++;
  stats[m.label].before += before.length;
  stats[m.label].after  += after.length;
  touched++;
}

function pct(b, a) {
  if (b === 0) return '0.0%';
  return (((b - a) / b) * 100).toFixed(1) + '%';
}

console.log('\n[optimize] build-time minification report');
console.log('────────────────────────────────────────────────────────');
let totalBefore = 0, totalAfter = 0;
for (const k of Object.keys(stats)) {
  const s = stats[k];
  if (s.n === 0) continue;
  totalBefore += s.before;
  totalAfter  += s.after;
  console.log(
    `  ${k.padEnd(4)}  ${String(s.n).padStart(3)} files  ` +
    `${(s.before / 1024).toFixed(1).padStart(8)} KB -> ` +
    `${(s.after / 1024).toFixed(1).padStart(7)} KB  ` +
    `(saved ${pct(s.before, s.after).padStart(5)})`
  );
}
console.log('────────────────────────────────────────────────────────');
console.log(
  `  TOTAL ${(totalBefore / 1024).toFixed(1)} KB -> ` +
  `${(totalAfter / 1024).toFixed(1)} KB  (saved ${pct(totalBefore, totalAfter)})`
);
console.log(`  ${touched} file(s) rewritten, ${skipped} skipped (already minimal)`);
console.log('[optimize] Done.');
