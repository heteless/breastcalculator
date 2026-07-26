// scripts/fix-logo-favicon.js
// Replace nav-logo block to use /favicon.svg image in every HTML file.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'scripts', '.well-known', 'images',
  'assets', 'seo', '.github', '.trae', '.reasonix'
]);

const htmlFiles = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(f.name)) continue;
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html') || f.name.endsWith('.htm')) htmlFiles.push(p);
  }
}
walk(ROOT);
walk(path.join(ROOT, 'dist'));

// Match <a class="nav-logo" ...>...content...</a> non-greedily
const NAV_LOGO_BLOCK_RE = /<a\s+([^>]*class="nav-logo"[^>]*)>([\s\S]*?)<\/a>/i;
const IMG_TAG = '<img src="/favicon.svg" alt="" class="nav-logo-img" width="28" height="28" />';

let touched = 0;
for (const file of htmlFiles) {
  let c = fs.readFileSync(file, 'utf8');
  if (!c.includes('class="nav-logo"')) continue;
  c = c.replace(NAV_LOGO_BLOCK_RE, (full, attrs, inner) => {
    // Remove any existing <svg>...</svg> inside the logo
    inner = inner.replace(/<svg[\s\S]*?<\/svg>/gi, '').trim();
    // If there's already a <img ...> keep it, otherwise prepend one
    if (!/<img\b/i.test(inner)) {
      // Drop leading whitespace and prepend the favicon
      inner = '\n            ' + IMG_TAG + '\n            ' + inner + '\n          ';
    }
    return '<a ' + attrs + '>' + inner + '</a>';
  });
  fs.writeFileSync(file, c, 'utf8');
  touched++;
}
console.log(`[fix-logo-favicon] touched ${touched} file(s).`);

// Append CSS rules for .nav-logo-img to classic-system.css
const CSS = path.join(ROOT, 'assets', 'classic-system.css');
let css = fs.readFileSync(CSS, 'utf8');
const IMG_RULE = `
/* ── nav-logo favicon image (auto-injected by fix-logo-favicon.js) ── */
.classic-navbar .nav-logo img.nav-logo-img,
.classic-navbar .nav-logo .nav-logo-img,
.navbar .nav-logo img.nav-logo-img,
.navbar .nav-logo .nav-logo-img {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: block;
  border-radius: 6px;
  object-fit: contain;
  background: transparent;
}
`;
if (!css.includes('nav-logo-img')) {
  css = css.replace(/\s*$/, '\n') + IMG_RULE;
  fs.writeFileSync(CSS, css, 'utf8');
  console.log('[fix-logo-favicon] appended .nav-logo-img CSS to classic-system.css');
}
