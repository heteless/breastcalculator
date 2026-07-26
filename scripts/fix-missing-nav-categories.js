// fix-missing-nav-categories.js
// 找出所有缺少 .nav-categories 的 HTML 页面，报告文件列表
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE = new Set(['node_modules', 'dist', 'dist-dryrun', 'scripts', '.git', '.github', '.well-known', 'images']);

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

let total = 0, missing = 0;
const missingList = [];

for (const file of listHtml(ROOT)) {
  total++;
  const html = fs.readFileSync(file, 'utf8');
  const hasNavbar = /class="navbar/.test(html);
  const hasNavCategories = /class="nav-categories"/.test(html);
  if (hasNavbar && !hasNavCategories) {
    missing++;
    missingList.push(path.relative(ROOT, file));
  }
}

console.log('Total HTML files: ' + total);
console.log('Missing nav-categories: ' + missing);
missingList.forEach(f => console.log('  - ' + f));
