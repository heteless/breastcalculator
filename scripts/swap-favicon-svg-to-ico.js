// scripts/swap-favicon-svg-to-ico.js
// Replace /favicon.svg logo references with /favicon.ico across all HTML files.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', 'scripts', '.well-known']);

const htmlFiles = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(f.name)) continue;
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html')) htmlFiles.push(p);
  }
}
walk(ROOT);
walk(path.join(ROOT, 'dist'));

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function withRetry(fn, tries = 8, delay = 400) {
  let last;
  for (let i = 0; i < tries; i++) {
    try { return await fn(); }
    catch (e) { last = e; await sleep(delay); }
  }
  throw last;
}

(async () => {
  let touched = 0, skipped = 0;
  const remaining = [];
  for (const file of htmlFiles) {
    let c;
    try { c = await withRetry(() => fs.promises.readFile(file, 'utf8')); }
    catch (e) { skipped++; remaining.push(file); continue; }
    if (!c.includes('class="nav-logo-img"')) continue;
    if (!c.includes('src="/favicon.svg"')) continue;
    const newC = c.replace(/src="\/favicon\.svg"/g, 'src="/favicon.ico"');
    if (newC === c) continue;
    try {
      await withRetry(() => fs.promises.writeFile(file, newC, 'utf8'));
      touched++;
    } catch (e) {
      skipped++;
      remaining.push(file);
    }
  }
  console.log(`[swap-favicon] touched ${touched} file(s), skipped ${skipped}.`);
  if (remaining.length) {
    console.log('[swap-favicon] Still locked:');
    remaining.forEach(f => console.log('  -', f));
  }
})();
