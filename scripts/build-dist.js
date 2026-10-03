// Copy deployable assets to dist, keeping build inputs and local artifacts out.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const EXCLUDE_DIRS = new Set([
  'node_modules', '.git', '.github', '.vscode', '.idea', 'dist',
  'dist-dryrun', 'scripts', 'test', 'tests', '__tests__', '.wrangler',
  '.cache', '_dbg', 'reports',
]);
const EXCLUDE_FILES = new Set([
  'package.json', 'package-lock.json', 'wrangler.toml', 'wrangler.jsonc',
  'purgecss.config.cjs', 'tailwind.config.js', 'tailwind-input.css',
  'script.js', 'style.css', 'tailwind-built.css', 'dev-server.js',
  '_tmp.css', 'temp_section29_30.css', 'assets/bra-calculator.css',
  'assets/classic-system.css', 'assets/global-layout.css', 'assets/tool-layout.css',
  'bing_index_status.json', 'skills-lock.json', 'footer.html', 'header-wellness-popup.html',
  'assets/bra-calculator-enhance.js', 'assets/section27.css',
]);
const LOCAL_FILE_PATTERNS = [
  /\.(bak|log|tmp|temp)$/i, /~$/, /^test-output\./i,
  /^(Thumbs\.db|desktop\.ini|LICENSE|README)$/i,
];

function shouldSkipFile(name, rel) {
  if (EXCLUDE_FILES.has(rel)) return true;
  if (LOCAL_FILE_PATTERNS.some(re => re.test(name))) return true;
  // Agent discovery bundles may intentionally expose documentation and scripts.
  if (rel.startsWith('.well-known/')) return false;
  return /\.(md|ps1|sh|bat|cmd)$/i.test(name);
}

function walk(srcDir, relBase = '') {
  const out = [];
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.well-known') continue;
    const rel = relBase ? `${relBase}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      out.push(...walk(path.join(srcDir, entry.name), rel));
    } else if (entry.isFile() && !shouldSkipFile(entry.name, rel)) {
      out.push({ src: path.join(srcDir, entry.name), rel });
    }
  }
  return out;
}

console.log('[build-dist] Cleaning dist/ …');
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
const files = walk(ROOT);
let totalBytes = 0;
for (const { src, rel } of files) {
  const dest = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  totalBytes += fs.statSync(src).size;
}
console.log(`[build-dist] Copied ${files.length} files (${(totalBytes / 1024).toFixed(1)} KB) to dist/`);
console.log('[build-dist] Done.');
