// remove-cdn.js — drop the Tailwind Play CDN <script> and the inline
// `tailwind.config = {...}` bootstrap from every source HTML page.
// The build already emits an equivalent, complete tailwind-built.css.
const fs = require('fs');
const path = require('path');

const ROOT = 'd:/DevProject/breastcalculator';
const SKIP = /(^|[\\/])(node_modules|_dbg|dist|dist-dryrun|\.git|\.wrangler|\.backup|reports|screenshots)([\\/]|$)/;

const RE_CDN = /[ \t]*<script[^>]*cdn\.tailwindcss\.com[^>]*>\s*<\/script>[ \t]*\r?\n/;
const RE_CFG = /[ \t]*<script>[^<]*tailwind\.config\s*=[^<]*<\/script>[ \t]*\r?\n/;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (SKIP.test(p)) continue;
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let changed = 0;
for (const f of walk(ROOT)) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  s = s.replace(RE_CDN, '').replace(RE_CFG, '');
  if (s !== before) {
    fs.writeFileSync(f, s);
    changed++;
    console.log('  -', path.relative(ROOT, f).replace(/\\/g, '/'));
  }
}
console.log('files cleaned:', changed);
