// scripts/audit-h1-centering.js
// Scan every dist/*.html and report whether its <h1> is centered.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'dist');

let total = 0;
let centered = 0;
let offcenter = [];

function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html')) {
      total++;
      const c = fs.readFileSync(p, 'utf8');
      const m = c.match(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/i);
      if (!m) return;
      const attrs = m[1] || '';
      const cls = (attrs.match(/\bclass\s*=\s*"([^"]*)"/) || ['', ''])[1];
      const txt = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);

      // Centered if: has text-center / center class, has .classic-h1 wrapper nearby, or has inline style text-align:center
      const isCentered =
        /\btext-center\b/.test(cls) ||
        /\bclassic-h1\b/.test(cls) ||
        /\bclassic-h1\b/.test(c.slice(Math.max(0, m.index - 200), m.index)) ||
        /text-align\s*:\s*center/.test(attrs);

      if (isCentered) centered++;
      else offcenter.push({ p: p.replace(/^dist[\\\/]/, '').replace(/\\/g, '/'), cls, txt });
    }
  }
}

walk(DIR);
console.log('total H1:', total, 'centered:', centered, 'off-center:', offcenter.length);
offcenter.forEach(x => console.log('  -', x.p, '|', x.cls || '(no class)', '|', x.txt));
