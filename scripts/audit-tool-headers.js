// scripts/audit-tool-headers.js
// Audit every dist/tools/*/index.html to make sure the classic-navbar
// header has all required parts.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && e.name === 'index.html') out.push(p);
  }
  return out;
}

const files = walk(DIST, []);
let ok = 0, bad = 0;
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const checks = {
    'navbar classic-navbar': html.includes('class="navbar classic-navbar"'),
    'nav-top':               html.includes('class="nav-top"'),
    'nav-categories':        html.includes('class="nav-categories"'),
    'nav-toggle':            html.includes('class="nav-toggle"'),
    'nav-cta':               html.includes('class="nav-cta"'),
    'nav-label':             html.includes('class="nav-label"'),
    'dropdown-menu':         html.includes('class="dropdown-menu"'),
    'skip-to-content':       html.includes('skip-to-content'),
    'drawer':                html.includes('class="drawer"'),
    'id="main-content"':     /id=["']main-content["']/.test(html),
    'main.css link':         /\/main\.css/.test(html),
  };
  const missing = Object.entries(checks).filter(([_, v]) => !v).map(([k]) => k);
  const rel = path.relative(ROOT, f);
  if (missing.length === 0) {
    ok++;
  } else {
    bad++;
    console.log('MISSING in ' + rel + ':');
    for (const m of missing) console.log('  - ' + m);
  }
}
console.log('\n' + ok + ' OK, ' + bad + ' with missing pieces (out of ' + files.length + ')');
process.exit(bad ? 1 : 0);
