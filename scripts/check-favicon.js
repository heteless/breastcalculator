// Quick check: is the nav-logo using the favicon image?
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'dist');
const SKIP = new Set(['node_modules', '.git', 'scripts', '.well-known', 'images', 'assets', 'seo', '.github', '.trae', '.reasonix', 'dist']);

let total = 0, withFav = 0, withSvg = 0, withH1 = 0, h1Centered = 0;
function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html')) {
      const c = fs.readFileSync(p, 'utf8');
      // Check nav-logo
      if (/class="nav-logo"/.test(c)) {
        total++;
        if (/nav-logo-img/.test(c)) withFav++;
        const m = c.match(/<a\s+([^>]*class="nav-logo"[^>]*)>([\s\S]*?)<\/a>/i);
        if (m && /<svg[\s\S]*?<\/svg>/.test(m[0])) withSvg++;
      }
      // Check h1 centering
      const h1 = c.match(/<h1\b([^>]*)>/i);
      if (h1) {
        withH1++;
        if (/\btext-center\b/.test(h1[1]) || /\bclassic-h1\b/.test(h1[1])) h1Centered++;
      }
    }
  }
}
walk(ROOT);
walk(DIR);
console.log('Pages with nav-logo:', total, '| favicon img:', withFav, '| old svg inside logo:', withSvg);
console.log('Pages with H1:', withH1, '| H1 has text-center/classic-h1 class:', h1Centered);
