// scripts/fix-h1-centering.js
// Defense-in-depth: ensure every <h1> in every HTML file is centered.
//
// Strategy:
//   1. If the h1 already has a `text-center` or `classic-h1` class → skip
//   2. If the h1 has a `class=` attribute → add `text-center` to it
//   3. If the h1 has no class → add `class="text-center"`
//   4. If the h1 has a `style=` that overrides text-align → leave style but
//      we still add class so the rule takes precedence (CSS !important).
//
// This works in tandem with the global `h1 { text-align: center !important }`
// rule injected into classic-system.css (and therefore main.css).
//
// Idempotent — running it twice has no extra effect.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Skip directories that contain build artifacts / dependencies
const SKIP = new Set([
  'node_modules', '.git', 'scripts', '.well-known', 'images',
  'assets', 'seo', '.github', '.trae', '.reasonix', 'dist', '_analyze-archive'
]);

let touched = 0;
let total = 0;
const RE_H1 = /<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi;

function hasClass(attrs, c) {
  const m = attrs.match(/\bclass\s*=\s*"([^"]*)"/i);
  if (!m) return false;
  return new RegExp('\\b' + c + '\\b', 'i').test(m[1]);
}

function addClass(attrs, c) {
  if (/\bclass\s*=\s*"/i.test(attrs)) {
    return attrs.replace(/\bclass\s*=\s*"([^"]*)"/i, (full, kls) => {
      if (new RegExp('\\b' + c + '\\b', 'i').test(kls)) return full;
      return 'class="' + kls.trim() + ' ' + c + '"';
    });
  }
  return attrs + ' class="' + c + '"';
}

function processFile(file) {
  const c = fs.readFileSync(file, 'utf8');
  if (!/<h1\b/i.test(c)) return;
  const updated = c.replace(RE_H1, (full, attrs, inner) => {
    total++;
    if (hasClass(attrs, 'text-center') || hasClass(attrs, 'classic-h1')) return full;
    const newAttrs = addClass(attrs, 'text-center');
    return '<h1' + newAttrs + '>' + inner + '</h1>';
  });
  if (updated !== c) {
    fs.writeFileSync(file, updated, 'utf8');
    touched++;
  }
}

function walk(d) {
  if (!fs.existsSync(d)) return;
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    if (SKIP.has(f.name)) continue;
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html') || f.name.endsWith('.htm')) processFile(p);
  }
}

walk(ROOT);
walk(DIST);
console.log('[fix-h1-centering] processed H1:', total, '| files touched:', touched);
