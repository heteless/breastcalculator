// coverage-full.js — accurate check: which utility classes used in
// the HTML are missing from style.css + tailwind-built.css combined?
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function listHtml(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (['node_modules', '.git', 'scripts', 'dist', 'dist-dryrun'].includes(e.name)) continue;
      out.push(...listHtml(path.join(dir, e.name)));
    } else if (e.isFile() && e.name === 'index.html') {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

const htmlFiles = listHtml(ROOT);
const styleCss = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');
const tw = fs.readFileSync(path.join(ROOT, 'tailwind-built.css'), 'utf8');
const combined = styleCss + '\n' + tw;

const used = new Set();
const re = /class="([^"]+)"/g;
for (const f of htmlFiles) {
  const c = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = re.exec(c)) !== null) {
    m[1].split(/\s+/).forEach((cls) => { if (cls) used.add(cls); });
  }
}

// Characters that Tailwind escapes in emitted CSS selectors. The dot is in
// the list because arbitrary values like `gap-1.5` get `.` escaped to `\.`.
const ESCAPED = new Set([':', '[', ']', '#', '.', '/', '(', ')', '%',
                         ',', '!', '?', '+', '=', '*', '$', '^', '{', '}',
                         '|', '<', '>', '&', '~', ';', '"', "'", '\\']);
function classToSelector(cls) {
  let s = '';
  for (const ch of cls) {
    if (ESCAPED.has(ch)) s += '\\' + ch;   // emit \X (1 backslash + char)
    else s += ch;
  }
  return '.' + s;
}

const missingFromBoth = [];
const missingFromTwOnly = [];
for (const cls of used) {
  if (cls.startsWith('data-')) continue;
  const selector = classToSelector(cls);
  if (!combined.includes(selector)) missingFromBoth.push(cls);
  if (!tw.includes(selector)) missingFromTwOnly.push(cls);
}

console.log(`Total utility classes used: ${used.size}`);
console.log(`Missing from BOTH files:    ${missingFromBoth.length}`);
console.log(`Missing from tailwind-built only: ${missingFromTwOnly.length}`);
console.log('\nMissing from BOTH (likely cause of layout break):');
missingFromBoth.slice(0, 80).forEach((c) => console.log('  ' + c));
