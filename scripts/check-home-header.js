// Quick homepage header audit
const fs = require('fs');
const h = fs.readFileSync('dist/index.html', 'utf8');
const checks = {
  'navbar classic-navbar': h.includes('class="navbar classic-navbar"'),
  'nav-top': h.includes('class="nav-top"'),
  'nav-categories': h.includes('class="nav-categories"'),
  'nav-toggle': h.includes('class="nav-toggle"'),
  'nav-cta': h.includes('class="nav-cta"'),
  'nav-label': h.includes('class="nav-label"'),
  'dropdown-menu': h.includes('class="dropdown-menu"'),
  'skip-to-content': h.includes('skip-to-content'),
  'drawer': h.includes('class="drawer"'),
  'id="main-content"': /id=["']main-content["']/.test(h),
  'main.css link': /\/main\.css/.test(h)
};
for (const k in checks) {
  console.log((checks[k] ? '✓' : '✗') + ' ' + k);
}

// Check CSS rules
const css = fs.readFileSync('dist/main.css', 'utf8');
const cssChecks = {
  '.classic-navbar height: 64px': /\.classic-navbar\s*\{[^}]*height:\s*64px/m.test(css),
  '.classic-navbar .nav-inner flex-row': /\.classic-navbar \.nav-inner\s*\{[^}]*flex-direction:\s*row/m.test(css),
  'media (min-width: 1024px) shows categories': /@media \(min-width: 1024px\)\s*\{[^}]*\.nav-categories[^}]*display:\s*flex/m.test(css),
  'no corrupted CSS': !css.includes('but in a single'),
  'no img display:none!important': !/img\s*\{\s*display:\s*none\s*!important/.test(css),
};
console.log('\nCSS:');
for (const k in cssChecks) {
  console.log((cssChecks[k] ? '✓' : '✗') + ' ' + k);
}
