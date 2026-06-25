// Scan all HTML/JS/CSS files for U+FFFD replacement characters.
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const SKIP = new Set(['node_modules', 'dist', 'dist-dryrun', '.git', '.cache', '.wrangler', 'scripts']);
const EXTS = new Set(['.html', '.js', '.css', '.json', '.md']);

const results = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.isFile() && EXTS.has(path.extname(e.name))) {
      const b = fs.readFileSync(p);
      const s = b.toString('utf8');
      const matches = s.match(/\uFFFD/g);
      if (matches && matches.length) {
        results.push({ file: path.relative(ROOT, p), count: matches.length });
      }
    }
  }
}
walk(ROOT);
results.sort((a, b) => b.count - a.count);
let total = 0;
for (const r of results) {
  total += r.count;
  console.log(r.count.toString().padStart(6), r.file);
}
console.log('---');
console.log('Files with U+FFFD:', results.length);
console.log('Total U+FFFD occurrences:', total);
