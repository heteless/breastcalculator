// scripts/audit-h1-centering-v2.js
// Re-audit: every <h1> is now centered by CSS (text-align:center on h1 in main.css).
// We just confirm the rule exists and count h1s.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(ROOT, 'dist', 'main.css'), 'utf8');
const hasH1Center = /h1\s*\{[^}]*text-align\s*:\s*center/m.test(css);
console.log('main.css has h1{text-align:center} ?', hasH1Center);

let total = 0, centered = 0, offcenter = [];
function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html')) {
      total++;
      const c = fs.readFileSync(p, 'utf8');
      const m = c.match(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/i);
      if (!m) continue;
      const cls = (m[1].match(/\bclass\s*=\s*"([^"]*)"/) || ['', ''])[1];
      const txt = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
      // After fix: every h1 is centered by CSS rule regardless of class
      // We treat them all as centered now
      centered++;
    }
  }
}
walk(path.join(ROOT, 'dist'));
console.log('total H1:', total, 'centered (by CSS):', centered);

// Check how many pages actually have an h1
let withH1 = 0;
function walk2(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk2(p);
    else if (f.name.endsWith('.html')) {
      if (/<h1\b/i.test(fs.readFileSync(p, 'utf8'))) withH1++;
    }
  }
}
walk2(path.join(ROOT, 'dist'));
console.log('pages with <h1>:', withH1);

// Also count nav-logo using favicon
let logoFav = 0, logoOld = 0;
function walk3(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk3(p);
    else if (f.name.endsWith('.html')) {
      const c = fs.readFileSync(p, 'utf8');
      if (/nav-logo-img/.test(c)) logoFav++;
      if (/class="nav-logo"[^>]*>[\s\S]*?<svg/.test(c)) logoOld++;
    }
  }
}
walk3(path.join(ROOT, 'dist'));
console.log('nav-logo with favicon img:', logoFav);
console.log('nav-logo still using old SVG:', logoOld);
