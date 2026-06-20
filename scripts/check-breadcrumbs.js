// Check BreadcrumbList coverage across pages
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['.git', 'node_modules', 'dist', 'dist-dryrun', '.wrangler', '.vscode', '.tmp-gen']);
const SKIP_FILES = new Set(['footer.html', 'header.html', '404.html']);

function walk(dir, base = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    const rel = base ? path.join(base, e.name) : e.name;
    if (e.isDirectory()) out.push(...walk(p, rel));
    else if (e.isFile() && e.name.endsWith('.html')) {
      if (SKIP_FILES.has(rel.replace(/\\/g, '/'))) continue;
      out.push({ abs: p, rel: rel.replace(/\\/g, '/') });
    }
  }
  return out;
}

const files = walk(ROOT);
const without = [];
const withBL = [];
for (const { abs, rel } of files) {
  const c = fs.readFileSync(abs, 'utf8');
  const hasBL = c.includes('"@type":"BreadcrumbList"') || c.includes('"@type": "BreadcrumbList"');
  if (hasBL) withBL.push(rel);
  else without.push(rel);
}

console.log(`Total: ${files.length}`);
console.log(`With BreadcrumbList: ${withBL.length}`);
console.log(`Without BreadcrumbList: ${without.length}`);
console.log('\n=== Pages WITHOUT BreadcrumbList ===');
without.forEach(p => console.log('  ' + p));
