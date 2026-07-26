// restore-nav-categories.js
// 给所有缺少 .nav-categories 的页面，在 .nav-top 之后、.nav-cta 之前
// 插入完整的 4 个分类（TOOLS / SPECIALS / WELLNESS / RESOURCES）下拉菜单。
// 同时确保 .navbar 拥有完整的 sticky / 毛玻璃样式 (classic-navbar)。
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const NAV_CATEGORIES = [
  '<ul class="nav-categories">',
  '  <li class="nav-category">',
  '    <span class="nav-label" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false">',
  '      TOOLS',
  '      <span class="arrow">',
  '        ▾',
  '      </span>',
  '    </span>',
  '    <div class="dropdown-menu" role="menu">',
  '      <a href="/bra-size-calculator/" role="menuitem">',
  '        Bra Size Calculator',
  '      </a>',
  '      <a href="/tools/breast-expansion-calculator/" role="menuitem">',
  '        Breast Expansion Calculator',
  '      </a>',
  '      <a href="/tools/breast-ptosis-calculator/" role="menuitem">',
  '        Breast Ptosis Calculator',
  '      </a>',
  '      <a href="/tools/breast-volume-calculator/" role="menuitem">',
  '        Breast Volume Calculator',
  '      </a>',
  '      <a href="/tools/breast-weight-calculator/" role="menuitem">',
  '        Breast Weight Calculator',
  '      </a>',
  '      <a href="/tools/breast-shape-calculator/" role="menuitem">',
  '        Breast Shape Calculator',
  '      </a>',
  '      <a href="/tools/length-converter/" role="menuitem">',
  '        Length Converter',
  '      </a>',
  '    </div>',
  '  </li>',
  '  <li class="nav-category">',
  '    <span class="nav-label" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false">',
  '      SPECIALS',
  '      <span class="arrow">',
  '        ▾',
  '      </span>',
  '    </span>',
  '    <div class="dropdown-menu" role="menu">',
  '      <a href="/specials/why-d-cup-support/" role="menuitem">',
  '        D+ Cup Support Science',
  '      </a>',
  '      <a href="/sports-bra-guide/" role="menuitem">',
  '        Sports Bra Science',
  '      </a>',
  '      <a href="/specials/accessory-breast-guide/" role="menuitem">',
  '        Accessory Breast Guide',
  '      </a>',
  '      <a href="/specials/expansion-evidence/" role="menuitem">',
  '        Expansion Evidence',
  '      </a>',
  '      <a href="/specials/ptosis-prevention-evidence/" role="menuitem">',
  '        Ptosis Prevention',
  '      </a>',
  '      <a href="/bra-buying-guide/" role="menuitem">',
  '        D+ Cup Buying Guide',
  '      </a>',
  '    </div>',
  '  </li>',
  '  <li class="nav-category">',
  '    <span class="nav-label" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false">',
  '      WELLNESS',
  '      <span class="arrow">',
  '        ▾',
  '      </span>',
  '    </span>',
  '    <div class="dropdown-menu" role="menu">',
  '      <a href="/wellness/prosthetic-bras-guide/" role="menuitem">',
  '        Prosthetic Bras Guide',
  '      </a>',
  '      <a href="/wellness/sports-bras-after-surgery/" role="menuitem">',
  '        Sports Bras After Surgery',
  '      </a>',
  '      <a href="/wellness/" role="menuitem">',
  '        Overview',
  '      </a>',
  '    </div>',
  '  </li>',
  '  <li class="nav-category">',
  '    <span class="nav-label" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false">',
  '      RESOURCES',
  '      <span class="arrow">',
  '        ▾',
  '      </span>',
  '    </span>',
  '    <div class="dropdown-menu" role="menu">',
  '      <a href="/articles/" role="menuitem">',
  '        All Articles',
  '      </a>',
  '      <a href="/bra-size-guide/" role="menuitem">',
  '        Bra Size Guides',
  '      </a>',
  '      <a href="/bra-size-guide/compare/" role="menuitem">',
  '        Bra Size Comparisons',
  '      </a>',
  '      <a href="/how-to-measure-bra-size/" role="menuitem">',
  '        How to Measure Bra Size',
  '      </a>',
  '      <a href="/bra-buying-guide/" role="menuitem">',
  '        Bra Buying Guide',
  '      </a>',
  '      <a href="/sports-bra-guide/" role="menuitem">',
  '        Sports Bra Guide',
  '      </a>',
  '      <a href="/best-comfort-bras/" role="menuitem">',
  '        Most Comfortable Bras',
  '      </a>',
  '      <a href="/best-wireless-bras/" role="menuitem">',
  '        Best Wireless Bras',
  '      </a>',
  '    </div>',
  '  </li>',
  '</ul>'
].join('\n');

const TARGETS = [
  'index.html',
  'tools/breast-expansion-calculator/index.html',
  'tools/breast-ptosis-calculator/index.html',
  'tools/breast-shape-calculator/index.html',
  'tools/breast-volume-calculator/index.html',
  'tools/breast-weight-calculator/index.html',
  'tools/length-converter/index.html',
  'tools/weight-converter/index.html'
];

let touched = 0;
const errors = [];

for (const rel of TARGETS) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) {
    errors.push('Missing: ' + file);
    continue;
  }
  let html = fs.readFileSync(file, 'utf8');

  // Skip if already has nav-categories
  if (/class="nav-categories"/.test(html)) {
    console.log('Skip (already has nav-categories): ' + rel);
    continue;
  }

  // Inject nav-categories
  // 1) If both nav-top and nav-cta exist, insert between them.
  // 2) If only nav-top exists (no nav-cta), insert after nav-top closing </div>.
  const NAV_CTA_RE = /(\s*<\/div>\s*)(<div class="nav-cta">)/;
  const NAV_TOP_ONLY_RE = /(\s*<\/div>\s*)<\/div>\s*<\/nav>/;
  if (NAV_CTA_RE.test(html)) {
    html = html.replace(NAV_CTA_RE, function (m, navTopEnd, navCtaStart) {
      return navTopEnd + '\n        ' + NAV_CATEGORIES.replace(/\n/g, '\n        ') + '\n        ' + navCtaStart.trim();
    });
    touched++;
  } else if (NAV_TOP_ONLY_RE.test(html)) {
    html = html.replace(NAV_TOP_ONLY_RE, function (m, navTopEnd) {
      return navTopEnd + '\n        ' + NAV_CATEGORIES.replace(/\n/g, '\n        ') + '\n      </div>\n    </nav>';
    });
    touched++;
  } else {
    errors.push('Pattern not found in ' + rel);
  }

  fs.writeFileSync(file, html, 'utf8');
}

console.log('Files modified: ' + touched);
if (errors.length) {
  console.log('Errors:');
  errors.forEach(e => console.log('  ' + e));
}
