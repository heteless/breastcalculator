// generate-sitemap.js
// 根据项目文件树自动生成 sitemap.xml
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');
const BASE_URL = 'https://breastcalculator.com';
// Dynamic lastmod: today's date in YYYY-MM-DD (UTC)
const TODAY = new Date().toISOString().slice(0, 10);

// 排除的目录（不进入 sitemap）
const EXCLUDE_DIRS = new Set([
  'node_modules',
  'dist',
  'dist-dryrun',
  'scripts',
  'images',
  '.git',
  '.vscode',
  '404'
]);

// 优先级与更新频率规则（按路径前缀匹配）
const RULES = [
  { test: /^\/$/, priority: '1.0', changefreq: 'weekly' },
  { test: /\/bra-size-calculator\/?$/, priority: '1.0', changefreq: 'weekly' },
  { test: /\/bra-size-guide\/?$/, priority: '0.9', changefreq: 'monthly' },
  { test: /\/bra-size-guide\/\d+[a-z]+\/?$/, priority: '0.7', changefreq: 'monthly' },
  { test: /\/bra-size-guide\/compare\/?$/, priority: '0.9', changefreq: 'monthly' },
  { test: /\/bra-size-guide\/compare\/.+\/?$/, priority: '0.7', changefreq: 'monthly' },
  { test: /\/breast-volume\/?$/, priority: '1.0', changefreq: 'monthly' },
  { test: /\/tools\/?$/, priority: '0.8', changefreq: 'monthly' },
  { test: /\/tools\/.+\/?$/, priority: '0.9', changefreq: 'monthly' },
  { test: /\/article\/.+\/?$/, priority: '0.8', changefreq: 'monthly' },
  { test: /\/articles\/?$/, priority: '0.7', changefreq: 'weekly' },
  { test: /\/specials\/?$/, priority: '0.7', changefreq: 'monthly' },
  { test: /\/specials\/.+\/?$/, priority: '0.7', changefreq: 'monthly' },
  { test: /\/wellness\/?$/, priority: '0.6', changefreq: 'monthly' },
  { test: /\/wellness\/.+\/?$/, priority: '0.6', changefreq: 'monthly' },
  { test: /\/best-comfort-bras\/?$|\/best-wireless-bras\/?$|\/sports-bra-guide\/?$|\/bra-buying-guide\/?$|\/how-to-measure-bra-size\/?$/, priority: '0.7', changefreq: 'monthly' },
  { test: /\/guide\/.+\/?$/, priority: '0.6', changefreq: 'monthly' },
  { test: /\/about\/?$/, priority: '0.5', changefreq: 'yearly' },
  { test: /\/privacy\/?$/, priority: '0.3', changefreq: 'yearly' },
  { test: /\/terms\/?$/, priority: '0.3', changefreq: 'yearly' }
];

function getRule(urlPath) {
  for (const rule of RULES) {
    if (rule.test.test(urlPath)) return rule;
  }
  return { priority: '0.5', changefreq: 'monthly' };
}

// 收集所有 index.html 路径
function collectPages(dir, relParts = []) {
  const pages = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return pages;
  }
  for (const entry of entries) {
    if (EXCLUDE_DIRS.has(entry.name)) continue;
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const indexFile = path.join(full, 'index.html');
      if (fs.existsSync(indexFile)) {
        const urlPath = '/' + [...relParts, entry.name, ''].join('/');
        pages.push(urlPath);
      }
      pages.push(...collectPages(full, [...relParts, entry.name]));
    }
  }
  return pages;
}

const allPages = collectPages(ROOT);

const pages = [];
const rootIndex = path.join(ROOT, 'index.html');
if (fs.existsSync(rootIndex)) {
  pages.push('/');
}
pages.push(...allPages);

const unique = [...new Set(pages)].sort();

console.log(`Found ${unique.length} pages`);

const lines = [];
lines.push('<?xml version="1.0" encoding="UTF-8"?>');
lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

for (const p of unique) {
  const url = BASE_URL + p;
  const rule = getRule(p);
  lines.push('  <url>');
  lines.push(`    <loc>${url}</loc>`);
  lines.push(`    <lastmod>${TODAY}</lastmod>`);
  lines.push(`    <changefreq>${rule.changefreq}</changefreq>`);
  lines.push(`    <priority>${rule.priority}</priority>`);
  lines.push('  </url>');
}

lines.push('</urlset>');
lines.push('');

const xml = lines.join('\n');
fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
console.log(`Written: ${SITEMAP_PATH}`);
console.log(`Total URLs: ${unique.length}`);
