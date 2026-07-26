// scripts/verify-header-fix.js
// Quick sanity check that the classic-navbar header is correctly
// structured and styled in the production dist/ build.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'dist', 'main.css'), 'utf8');

const checks = [
  // HTML structure
  { name: 'classic-navbar present',  test: () => html.includes('class="navbar classic-navbar"') },
  { name: 'nav-top present',          test: () => html.includes('class="nav-top"') },
  { name: 'nav-categories present',   test: () => html.includes('class="nav-categories"') },
  { name: 'nav-cta present',          test: () => html.includes('class="nav-cta"') },
  { name: 'nav-toggle present',       test: () => html.includes('class="nav-toggle"') },
  { name: 'nav-label present',        test: () => html.includes('class="nav-label"') },
  { name: 'dropdown-menu present',    test: () => html.includes('class="dropdown-menu"') },
  { name: 'skip-to-content present',  test: () => html.includes('skip-to-content') },
  { name: 'drawer present',           test: () => html.includes('class="drawer"') },
  { name: 'main-content id present',  test: () => /id=["']main-content["']/.test(html) },

  // Critical CSS rules (the patch)
  { name: '.classic-navbar has min-height: 64px !important',
    test: () => /\.classic-navbar\s*\{[^}]*min-height:\s*64px\s*!important/.test(css) },
  { name: '.classic-navbar has padding-top: 0 !important',
    test: () => /\.classic-navbar\s*\{[^}]*padding-top:\s*0\s*!important/.test(css) },
  { name: '.classic-navbar .nav-inner display: flex !important',
    test: () => /\.classic-navbar \.nav-inner\s*\{[^}]*display:\s*flex\s*!important/.test(css) },
  { name: '.classic-navbar .nav-inner flex-direction: row !important',
    test: () => /\.classic-navbar \.nav-inner\s*\{[^}]*flex-direction:\s*row\s*!important/.test(css) },
  { name: '.classic-navbar .nav-inner height: 64px',
    test: () => /\.classic-navbar \.nav-inner\s*\{[^}]*height:\s*64px/.test(css) },
  { name: '.classic-navbar .nav-categories default display: none',
    test: () => /\.classic-navbar \.nav-categories\s*\{[^}]*display:\s*none/.test(css) },
  { name: '.classic-navbar .nav-toggle default display: flex',
    test: () => /\.classic-navbar \.nav-toggle\s*\{[^}]*display:\s*flex/.test(css) },
  { name: '.dropdown-menu has position: absolute',
    test: () => /\.classic-navbar \.dropdown-menu\s*\{[^}]*position:\s*absolute/.test(css) },
  { name: '@media (min-width: 1024px) shows categories',
    test: () => {
      // Find the @media block (need to handle nested braces)
      const start = css.indexOf('@media (min-width: 1024px)');
      if (start < 0) return false;
      let i = css.indexOf('{', start);
      if (i < 0) return false;
      let depth = 1;
      i++;
      while (i < css.length && depth > 0) {
        if (css[i] === '{') depth++;
        else if (css[i] === '}') depth--;
        i++;
      }
      const body = css.slice(start, i);
      return /\.classic-navbar \.nav-categories\s*\{[^}]*display:\s*flex/.test(body);
    } },
  { name: '@media (min-width: 1024px) hides toggle',
    test: () => {
      const start = css.indexOf('@media (min-width: 1024px)');
      if (start < 0) return false;
      let i = css.indexOf('{', start);
      if (i < 0) return false;
      let depth = 1;
      i++;
      while (i < css.length && depth > 0) {
        if (css[i] === '{') depth++;
        else if (css[i] === '}') depth--;
        i++;
      }
      const body = css.slice(start, i);
      return /\.classic-navbar \.nav-toggle\s*\{[^}]*display:\s*none/.test(body);
    } },
  { name: '@media (max-width: 767.98px) mobile rules',
    test: () => /@media\s*\(max-width:\s*767\.98px\)/.test(css) },
  { name: 'patch marker present', test: () => css.includes('classic-header patch') },
];

let pass = 0, fail = 0;
for (const c of checks) {
  const ok = c.test();
  console.log((ok ? '\u2713' : '\u2717') + ' ' + c.name);
  ok ? pass++ : fail++;
}
console.log('\n' + pass + '/' + (pass + fail) + ' checks passed.');
process.exit(fail ? 1 : 0);
