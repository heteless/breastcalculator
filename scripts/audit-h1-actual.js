// scripts/audit-h1-actual.js
// Audit whether H1 is centered by checking (1) the h1 CSS rule, (2) the inline
// class, and (3) any parent wrapper that could re-set text-align.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'dist');

let total = 0, centered = 0, off = [];
function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html')) {
      total++;
      const c = fs.readFileSync(p, 'utf8');
      const m = c.match(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/i);
      if (!m) continue;
      const attrs = m[1] || '';
      const cls = (attrs.match(/\bclass\s*=\s*"([^"]*)"/) || ['', ''])[1];
      const style = (attrs.match(/\bstyle\s*=\s*"([^"]*)"/) || ['', ''])[1];
      const txt = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 70);

      // Look at the surrounding 400 chars (the wrapper) to find a parent that
      // sets text-align, and a parent with text-center / classic-h1
      const before = c.slice(Math.max(0, m.index - 600), m.index);
      const parentHasCenter =
        /text-center/.test(cls) ||
        /classic-h1/.test(cls) ||
        /classic-h1/.test(before) ||
        /text-align\s*:\s*center/.test(style) ||
        /text-align\s*:\s*center/.test(before.slice(-200));

      if (parentHasCenter) centered++;
      else off.push({ p: p.replace(/^.+?dist[\\\/]/, '').replace(/[\\\/]/g, '/'), cls, txt, style });
    }
  }
}
walk(DIR);
console.log('total H1:', total, 'centered:', centered, 'off-center:', off.length);
off.forEach(x => console.log(' -', x.p, '| cls:', x.cls || '(none)', '| style:', x.style || '', '|', x.txt));
