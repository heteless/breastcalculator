/* Final verification of optimized CSS */
const postcss = require('postcss');
const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

const ROOT = 'd:/DevProject/breastcalculator';
const cssPath = path.join(ROOT, 'style.css');

console.log('=== CSS file verification ===');
const c = fs.readFileSync(cssPath, 'utf8');
try {
  const r = postcss.parse(c);
  console.log('  ✓ postcss parses OK');
  console.log('  - top-level rules:', r.nodes.length);
  let allRules = 0, allDecls = 0, atRules = 0, mediaRules = 0, keyframes = 0;
  r.walkRules(() => allRules++);
  r.walkDecls(() => allDecls++);
  r.walkAtRules((node) => {
    atRules++;
    if (node.name === 'media' || node.name === 'supports') mediaRules++;
    if (node.name === 'keyframes') keyframes++;
  });
  console.log('  - all rules (recursive):', allRules);
  console.log('  - all declarations:', allDecls);
  console.log('  - at-rules:', atRules, '(@media/@supports:', mediaRules, ', @keyframes:', keyframes, ')');
} catch (e) {
  console.log('  ✗ FAIL:', e.message);
}

console.log('\n=== HTML page reference verification ===');
const htmlFiles = glob.sync('**/*.html', { cwd: ROOT, ignore: ['node_modules/**', 'tools/**/node_modules/**'] });
const cssContent = fs.readFileSync(cssPath, 'utf8');
const cssClasses = new Set();
const classRegex = /\.([a-zA-Z_][\w-]*)/g;
let m;
while ((m = classRegex.exec(cssContent)) !== null) {
  cssClasses.add(m[1]);
}
const usedInHtml = new Set();
for (const f of htmlFiles) {
  const c2 = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const htmlClasses = c2.match(/class\s*=\s*['"][^'"]+['"]/g) || [];
  for (const cl of htmlClasses) {
    const list = cl.replace(/^class\s*=\s*['"]/, '').replace(/['"]$/, '').split(/\s+/);
    for (const x of list) if (x) usedInHtml.add(x);
  }
}
const usedButMissingInCss = [...usedInHtml].filter((c) => !cssClasses.has(c));
const unusedInCss = [...cssClasses].filter((c) => !usedInHtml.has(c));
console.log('  HTML pages:', htmlFiles.length);
console.log('  CSS class count:', cssClasses.size);
console.log('  HTML used class count:', usedInHtml.size);
console.log('  Used but not in CSS (check):', usedButMissingInCss.length);
if (usedButMissingInCss.length > 0) console.log('    examples:', usedButMissingInCss.slice(0, 10).join(', '));
console.log('  Unused in CSS:', unusedInCss.length, '(some may be JS dynamic)');

console.log('\n=== JS dynamic class verification ===');
const jsPath = path.join(ROOT, 'script.js');
if (fs.existsSync(jsPath)) {
  const jsContent = fs.readFileSync(jsPath, 'utf8');
  /* Extract class-like tokens from classList/className operations */
  const dynamicSet = new Set();
  const patterns = [
    /classList\.(add|remove|toggle|contains)\s*\(\s*['"`]([^'"`]+)['"`]/g,
    /className\s*=\s*['"`]([^'"`]+)['"`]/g,
    /className\s*=\s*[`][^`]*[${][^}]*class[^}]*[}]/g,
  ];
  for (const re of patterns) {
    let jm;
    while ((jm = re.exec(jsContent)) !== null) {
      const t = (jm[2] || jm[1] || '').split(/\s+/).filter(Boolean);
      for (const x of t) dynamicSet.add(x);
    }
  }
  const missing = [...dynamicSet].filter((c) => !cssClasses.has(c));
  console.log('  Dynamic class count:', dynamicSet.size);
  console.log('  Dynamic but missing from CSS:', missing.length);
  if (missing.length > 0) console.log('    examples:', missing.slice(0, 10).join(', '));
}
