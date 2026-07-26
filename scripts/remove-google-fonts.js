// remove-google-fonts.js — Remove all Google Fonts references from all HTML source files
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE = new Set(['node_modules', 'dist', 'dist-dryrun', '.git', '.github', '.well-known', '.backup', 'images']);

function listHtml(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (EXCLUDE.has(e.name)) continue;
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...listHtml(full));
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

let total = 0;
const files = listHtml(ROOT);
console.log('Scanning ' + files.length + ' HTML files...');

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const orig = html;

  // Remove Google Fonts preconnect
  html = html.replace(/<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>\s*\n?/g, '');
  // Remove Google Fonts stylesheet
  html = html.replace(/<link[^>]*fonts\.googleapis\.com\/css2\?family=[^>]*>\s*\n?/g, '');

  if (html !== orig) {
    fs.writeFileSync(file, html, 'utf8');
    console.log('[OK] ' + path.relative(ROOT, file));
    total++;
  }
}

console.log('\nFiles modified: ' + total);
