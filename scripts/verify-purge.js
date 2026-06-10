/* Final verification of optimized CSS */
const postcss = require('postcss');
const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

const ROOT = 'd:/DevProject/breastcalculator';
const cssPath = path.join(ROOT, 'style.css');

console.log('=== CSS 文件验证 ===');
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

console.log('\n=== HTML 页面引用验证 ===');
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
console.log('  HTML 文件总数:', htmlFiles.length);
console.log('  CSS 中定义的 class 总数:', cssClasses.size);
console.log('  HTML 中实际使用的 class 总数:', usedInHtml.size);
console.log('  使用但 CSS 中未找到的 class (需检查):', usedButMissingInCss.length);
if (usedButMissingInCss.length > 0) console.log('    例子:', usedButMissingInCss.slice(0, 10).join(', '));
console.log('  CSS 中定义但 HTML 未直接使用的 class:', unusedInCss.length, '(其中部分是 JS 动态添加)');

console.log('\n=== JS 文件 (script.js) 动态 class 引用验证 ===');
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
  console.log('  动态添加的 class 总数:', dynamicSet.size);
  console.log('  动态但 CSS 中未找到的 class (需补 safelist):', missing.length);
  if (missing.length > 0) console.log('    例子:', missing.slice(0, 10).join(', '));
}
