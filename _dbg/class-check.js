// class-check.js — escape-aware coverage check: which classes used in source
// HTML/JS are NOT defined in the built Tailwind CSS.
const fs = require('fs');
const path = require('path');

const ROOT = 'd:/DevProject/breastcalculator';
const CSS_FILES = ['tailwind-built.css', 'style.css', 'assets/bra-calculator.css', 'assets/classic-system.css', 'assets/global-layout.css', 'assets/tool-layout.css', 'assets/section27.css'];
const SKIP = /(^|[\\/])(node_modules|_dbg|dist|dist-dryrun|\.git|\.wrangler|reports|screenshots)([\\/]|$)/;

// ---- collect defined class names from CSS (unescaped) ----
const defined = new Set();
for (const rel of CSS_FILES) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  const css = fs.readFileSync(p, 'utf8');
  for (const m of css.matchAll(/\.((?:\\.|[A-Za-z0-9_-])+)/g)) {
    defined.add(m[1].replace(/\\/g, ''));
  }
}

// ---- collect used class tokens from source ----
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (SKIP.test(p)) continue;
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && /\.(html|js)$/.test(e.name) && !/\.min\.js$/.test(e.name)) out.push(p);
  }
  return out;
}

const TW = /^(?:[a-z-]+:)*(?:bg|text|border|ring|from|via|to|fill|stroke|placeholder|divide|outline|accent|caret|shadow|opacity|scale|rotate|translate|skew|origin|transform|transition|duration|ease|delay|animate|blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow|filter|backdrop|flex|grid|col|row|order|gap|justify|items|content|self|place|space|basis|grow|shrink|table|border-spacing|list|cursor|select|resize|scroll|snap|touch|will-change|isolate|object|overflow|overscroll|aspect|columns|break|box|float|clear|display|container|inset|top|right|bottom|left|z|m|mx|my|mt|mr|mb|ml|p|px|py|pt|pr|pb|pl|w|min-w|max-w|h|min-h|max-h|size|font|leading|tracking|indent|align|whitespace|word|hyphens|visible|invisible|static|fixed|absolute|relative|sticky|hidden|block|inline|sr|not-sr|antialiased|subpixel|ordinal|slashed|lining|oldstyle|proportional|tabular|diagonal|stacked|motion|appearance|pointer|user|isolation|mix-blend|bg-blend)$/;

const uses = new Map(); // token -> [files]
for (const f of walk(ROOT)) {
  const src = fs.readFileSync(f, 'utf8');
  const tokens = new Set();
  let m;
  const re = /\bclass(?:Name)?\s*=\s*["'`]([^"'`]*)["'`]/g;
  while ((m = re.exec(src))) m[1].split(/\s+/).forEach(c => c && tokens.add(c));
  const re2 = /classList\.(?:add|remove|toggle)\(\s*['"`]([^'"`]+)['"`]/g;
  while ((m = re2.exec(src))) m[1].split(/\s+/).forEach(c => c && tokens.add(c));
  for (const t of tokens) {
    if (!TW.test(t)) continue;              // only tailwind-shaped utilities
    if (defined.has(t)) continue;           // already covered
    if (!uses.has(t)) uses.set(t, []);
    uses.get(t).push(path.relative(ROOT, f).replace(/\\/g, '/'));
  }
}

console.log('defined class selectors:', defined.size);
console.log('missing tailwind-shaped classes used in source:', uses.size);
for (const [t, files] of [...uses].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${t}   (${files.length})  e.g. ${files.slice(0, 3).join(', ')}`);
}
