// upgrade-header-footer.js
// 一次性脚本：
// 1) 给所有 navbar 加上 .classic-navbar 类
// 2) 在 .nav-logo 内添加极简 SVG 图标
// 3) 把旧式 footer (style="background:#fdf8f5;border-top:1px solid #e8ddd0;...") 替换为 .classic-footer
// 4) 给所有 <main> 加上 id="main-content"
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE = new Set(['node_modules', 'dist', 'dist-dryrun', 'scripts', '.git', '.github', '.well-known', 'images']);

const LOGO_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4z"></path><path d="M8 13c0 4 1.8 7 4 8 2.2-1 4-4 4-8"></path></svg>';
const CLASSIC_FOOTER_HTML = function (siteName, tagline, email) {
  return [
    '<footer class="classic-footer">',
    '  <div class="cf-inner">',
    '    <p class="cf-brand">' + siteName + '</p>',
    '    <p class="cf-tagline">' + tagline + '</p>',
    '    <a class="cf-email" href="mailto:' + email + '">' + email + '</a>',
    '    <nav class="cf-links" aria-label="Footer">',
    '      <a href="/about/">About</a>',
    '      <a href="/contact/">Contact</a>',
    '      <a href="/privacy/">Privacy Policy</a>',
    '      <a href="/terms/">Terms of Use</a>',
    '    </nav>',
    '    <p class="cf-copy">&copy; 2026 Breast Calculator. For informational purposes only — not a substitute for medical advice.</p>',
    '  </div>',
    '</footer>'
  ].join('\n');
};

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
let navUp = 0, logoUp = 0, footerUp = 0, mainUp = 0;
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

  // 1) navbar → classic-navbar (only add, do not duplicate)
  if (!/class="navbar classic-navbar"/.test(html)) {
    if (/class="navbar"/.test(html)) {
      html = html.replace('class="navbar"', 'class="navbar classic-navbar"');
      navUp++;
      changed = true;
    }
  }

  // 2) Add SVG to nav-logo (only if BREAST CALCULATOR text exists and no SVG yet)
  if (/BREAST CALCULATOR/.test(html) && !/class="nav-logo"[\s\S]*?<svg/.test(html)) {
    html = html.replace(
      /<a href="\/" class="nav-logo">\s*BREAST CALCULATOR\s*<\/a>/,
      '<a href="/" class="nav-logo">\n            ' + LOGO_SVG + '\n            <span>BREAST CALCULATOR</span>\n          </a>'
    );
    logoUp++;
    changed = true;
  }

  // 3) Replace old footer style with classic-footer
  //    只替换最常见的两类内联 footer；如果页面用了完整新版 footer 则不动
  if (!/class="classic-footer"/.test(html)) {
    const oldFooterRe = /<footer[^>]*style="background:#fdf8f5;border-top:1px solid #e8ddd0[\s\S]*?<\/footer>/;
    if (oldFooterRe.test(html)) {
      html = html.replace(oldFooterRe, CLASSIC_FOOTER_HTML('Breast Calculator', 'Free science-based bra fitting tools and breast health education.', 'contact@breastcalculator.com'));
      footerUp++;
      changed = true;
    } else {
      // 旧式 Tailwind 渲染的页脚也识别
      const twFooterRe = /<footer class="bg-\[#fdf8f5\] border-t border-\[#e8ddd0\][\s\S]*?<\/footer>/;
      if (twFooterRe.test(html)) {
        html = html.replace(twFooterRe, CLASSIC_FOOTER_HTML('Breast Calculator', 'Free science-based bra fitting tools and breast health education.', 'contact@breastcalculator.com'));
        footerUp++;
        changed = true;
      }
    }
  }

  // 4) <main> → <main id="main-content"> (only add, do not duplicate)
  if (!/<main[^>]*id="main-content"/.test(html)) {
    if (/<main(\s*)>/.test(html)) {
      html = html.replace('<main>', '<main id="main-content">');
      mainUp++;
      changed = true;
    } else if (/<main(\s+[a-z\-]+(="[^"]*")?)*\s*>/.test(html) && !/id="main-content"/.test(html)) {
      html = html.replace(/<main(\s+[^>]*)?>/, function (m) {
        if (/id="main-content"/.test(m)) return m;
        if (m.indexOf('id=') !== -1) return m;
        return m.replace('<main', '<main id="main-content"');
      });
      mainUp++;
      changed = true;
    }
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
console.log('classic-navbar added: ' + navUp);
console.log('Logo SVG inserted: ' + logoUp);
console.log('Footers replaced: ' + footerUp);
console.log('Main id added: ' + mainUp);
if (errors.length) {
  console.log('Errors:');
  errors.forEach(e => console.log('  ' + e));
}
