// simplify-tool-pages.js — batch-apply layout changes to all tool/*/index.html
// Changes: remove Google Fonts, nav-categories, duplicate drawer, related-guides,
// all-calculators, related-reading sections, simplify footer
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const TOOL_PAGES = [
  'tools/breast-volume-calculator/index.html',
  'tools/breast-expansion-calculator/index.html',
  'tools/breast-ptosis-calculator/index.html',
  'tools/breast-weight-calculator/index.html',
  'tools/breast-shape-calculator/index.html',
  'tools/length-converter/index.html',
  'tools/weight-converter/index.html',
  'tools/index.html',
];

const SIMPLE_FOOTER = `      <footer style="background:#fdf8f5;border-top:1px solid #e8ddd0;text-align:center;padding:48px 20px 32px;color:#5d4a3a;font-size:0.9rem;line-height:1.7">
        <div style="max-width:960px;margin:0 auto">
          <div style="font-size:1.2rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:6px;color:#4a3a2e">BREAST CALCULATOR</div>
          <p style="margin:0 auto 16px;max-width:400px;color:#6b5544">Free science-based bra fitting tools and breast health education.</p>
          <p style="margin:0 0 4px"><a href="mailto:contact@breastcalculator.com" style="color:#6b5544;text-decoration:underline">contact@breastcalculator.com</a></p>
          <p style="margin:0 0 16px;font-size:0.82rem;color:#8b7355">We typically respond within 1–2 business days.</p>
          <nav style="display:flex;justify-content:center;gap:24px;font-size:0.82rem;margin-bottom:20px;flex-wrap:wrap">
            <a href="/about/" style="color:#6b5544;text-decoration:underline">About</a>
            <a href="/contact/" style="color:#6b5544;text-decoration:underline">Contact</a>
            <a href="/privacy/" style="color:#6b5544;text-decoration:underline">Privacy Policy</a>
            <a href="/terms/" style="color:#6b5544;text-decoration:underline">Terms of Use</a>
          </nav>
          <p style="margin:0;font-size:0.78rem;color:#8b7355">&copy; 2026 Breast Calculator. This website is for informational purposes only and does not provide medical advice.</p>
        </div>
      </footer>`;

let total = 0;
let errors = [];

for (const rel of TOOL_PAGES) {
  const filePath = path.join(ROOT, rel);
  let html;
  try {
    html = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    errors.push(rel + ': ' + e.message);
    continue;
  }

  const orig = html;

  // 1. Remove Google Fonts preconnect/links
  html = html.replace(/<link rel="preconnect" href="https:\/\/fonts\.(googleapis|gstatic)\.com"[^>]*>\n?/g, '');
  html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=[^"]*"[^>]*>\n?/g, '');

  // 2. Remove nav-categories (the 4 dropdown menus)
  html = html.replace(/<ul class="nav-categories">[\s\S]*?<\/ul>\n?/, '');

  // 3. Remove duplicate drawer (second occurrence of id="drawer")
  // Find first drawer, then remove any subsequent ones
  const drawerRegex = /<div class="drawer" id="drawer"[^>]*>[\s\S]*?<\/div>\s*<!-- \/drawer -->?\n?/g;
  let match;
  let drawerCount = 0;
  let result = '';
  let lastIndex = 0;
  while ((match = drawerRegex.exec(html)) !== null) {
    drawerCount++;
    if (drawerCount === 1) {
      // Keep first drawer
      result += html.slice(lastIndex, match.index + match[0].length);
    }
    lastIndex = match.index + match[0].length;
  }
  if (drawerCount > 0) {
    result += html.slice(lastIndex);
    html = result;
  }

  // 4. Remove duplicate drawer if not caught by regex (fallback: remove all but first)
  // Check for any extra div.drawer#drawer
  const firstDrawerEnd = html.indexOf('</div>', html.indexOf('id="drawer"')) + 6;
  const secondDrawer = html.indexOf('id="drawer"', firstDrawerEnd + 100);
  if (secondDrawer !== -1) {
    // Find where this second drawer ends (its matching </div>)
    let depth = 0;
    let inDrawer = false;
    let secondStart = html.lastIndexOf('<div', secondDrawer);
    // Find the actual start of the second drawer div
    let searchFrom = secondDrawer - 200;
    if (searchFrom < 0) searchFrom = 0;
    const secondDivStart = html.lastIndexOf('<div class="drawer"', secondDrawer);
    if (secondDivStart !== -1 && secondDivStart > firstDrawerEnd) {
      // Find closing of this drawer
      let idx = secondDivStart;
      let openCount = 0;
      let started = false;
      while (idx < html.length) {
        if (html.substr(idx, 4) === '<div') { openCount++; started = true; idx += 4; }
        else if (html.substr(idx, 6) === '</div>') { openCount--; idx += 6; if (started && openCount === 0) break; }
        else idx++;
      }
      html = html.slice(0, secondDivStart) + html.slice(idx + 6);
    }
  }

  // 5. Remove second drawer via id="drawerClose" duplication method
  // More robust: find all drawer divs, keep only first
  const parts = html.split('<div class="drawer" id="drawer"');
  if (parts.length > 2) {
    // Reconstruct: keep first occurrence, drop rest
    // But careful: parts[0] + first drawer
    let rebuilt = parts[0] + '<div class="drawer" id="drawer"';
    // Find end of first drawer
    const firstDrawerContent = parts[1];
    let depth = 0;
    let i = 0;
    let inDiv = false;
    for (; i < firstDrawerContent.length; i++) {
      if (firstDrawerContent.substr(i, 4) === '<div') { depth++; inDiv = true; i += 3; }
      else if (firstDrawerContent.substr(i, 6) === '</div>') {
        depth--;
        i += 5;
        if (depth === 0 && inDiv) break;
      }
    }
    rebuilt += firstDrawerContent.slice(0, i + 6);
    // Append everything after all drawer divs
    // Find where the last drawer ends
    let totalDrawerContent = '';
    for (let p = 1; p < parts.length; p++) {
      totalDrawerContent += parts[p];
    }
    // Skip to after the last </div> of the last drawer
    let lastDepth = 0;
    let lastIdx = 0;
    for (let j = 0; j < totalDrawerContent.length; j++) {
      if (totalDrawerContent.substr(j, 4) === '<div') { lastDepth++; j += 3; }
      else if (totalDrawerContent.substr(j, 6) === '</div>') {
        lastDepth--;
        j += 5;
        if (lastDepth === 0) { lastIdx = j + 1; }
      }
    }
    rebuilt += totalDrawerContent.slice(lastIdx);
    html = rebuilt;
  }

  // 6. Remove related-guides.explore-resources section
  html = html.replace(/<section class="related-guides explore-resources"[\s\S]*?<\/section>\n?/g, '');
  // Also handle: section.related-guides without explore-resources
  html = html.replace(/<section class="related-guides[^"]*"[\s\S]*?<\/section>\n?/g, '');

  // 7. Remove all-calculators section
  html = html.replace(/<section class="all-calculators"[\s\S]*?<\/section>\n?/g, '');

  // 8. Remove aside.related-reading
  html = html.replace(/<aside class="related-reading"[\s\S]*?<\/aside>\n?/g, '');

  // 9. Simplify footer
  const footerStart = html.indexOf('<footer class="bg-[');
  if (footerStart !== -1) {
    const footerEnd = html.indexOf('</footer>', footerStart) + 9;
    html = html.slice(0, footerStart) + SIMPLE_FOOTER + html.slice(footerEnd);
  }

  if (html !== orig) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('[OK] ' + rel);
    total++;
  } else {
    console.log('[—] ' + rel + ' (no changes needed)');
  }
}

console.log('\nFiles modified: ' + total);
if (errors.length) {
  console.log('Errors:');
  errors.forEach(e => console.log('  ' + e));
}
