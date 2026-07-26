// inject-classic-ui.js
// 一次性脚本：批量向所有 HTML 页面注入古典 UI 增强
// 1) 在 <body> 开头插入 skip-to-content 链接
// 2) 注入 <script src="/assets/classic-ui.js" defer></script>
// 3) 移除 Google Fonts <link> 与 preconnect
// 4) 移除主内容中的链接式 emoji 图标 (不影响文本中的 emoji)
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE = new Set(['node_modules', 'dist', 'dist-dryrun', 'scripts', '.git', '.github', '.well-known', 'images', 'articles', 'best-wireless-bras', 'best-comfort-bras', 'specials', 'bra-buying-guide', 'bra-size-guide', 'bra-size-guide-compare', 'how-to-measure-bra-size', 'sports-bra-guide', 'wellness']);

const SKIP_LINK = '<a class="skip-to-content" href="#main-content">Skip to main content</a>';
const CLASSIC_UI = '<script src="/assets/classic-ui.js?v=20260721" defer></script>';

const GOOGLE_FONTS_RE = /<link[^>]*fonts\.googleapis\.com[^>]*>\s*/g;
const GOOGLE_FONTS_PRE = /<link[^>]*fonts\.gstatic\.com[^>]*>\s*/g;

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

let touched = 0;
let skipIn = 0, scriptIn = 0, fontsRemoved = 0;
const errors = [];

for (const file of listHtml(ROOT)) {
  let html;
  try {
    html = fs.readFileSync(file, 'utf8');
  } catch (e) {
    errors.push(file + ': ' + e.message);
    continue;
  }
  const orig = html;
  let changed = false;

  // 1) Skip link at the very start of <body>
  if (!/class="skip-to-content"/.test(html)) {
    if (/<body[^>]*>/.test(html)) {
      html = html.replace(/<body([^>]*)>/, '<body$1>\n' + SKIP_LINK);
      skipIn++;
      changed = true;
    }
  }

  // 2) classic-ui.js before </body>
  if (!/classic-ui\.js/.test(html)) {
    if (/<\/body>/.test(html)) {
      html = html.replace('</body>', '  ' + CLASSIC_UI + '\n</body>');
      scriptIn++;
      changed = true;
    }
  }

  // 3) Remove Google Fonts links + preconnects (only the ones that point to fonts)
  const before = html;
  html = html.replace(GOOGLE_FONTS_RE, '');
  html = html.replace(GOOGLE_FONTS_PRE, '');
  if (html !== before) {
    fontsRemoved++;
    changed = true;
  }

  if (changed && html !== orig) {
    try {
      fs.writeFileSync(file, html, 'utf8');
      touched++;
    } catch (e) {
      errors.push(file + ': ' + e.message);
    }
  }
}

console.log('Files modified: ' + touched);
console.log('Skip links added: ' + skipIn);
console.log('classic-ui.js added: ' + scriptIn);
console.log('Google Fonts removed (files): ' + fontsRemoved);
if (errors.length) {
  console.log('Errors:');
  errors.forEach(e => console.log('  ' + e));
}
