// build-dist.js — copy the optimized source tree to ./dist, excluding
// node_modules, .git, scripts, build configs, and reports.
//
// Why this exists
// ---------------
// Cloudflare Workers Static Assets uploads whatever lives in the
// configured assets directory. If the deploy points at the project
// root, wrangler also tries to upload node_modules/ (which contains
// 85+ MiB Windows workerd binaries) and trips the 25 MiB asset
// limit. Copying the deployable source files to ./dist and pointing
// wrangler at that directory is the standard, durable solution.
//
// Idempotent: wipes dist/ on each run, then re-creates it.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const EXCLUDE_DIRS = new Set([
  'node_modules',
  '.git',
  '.github',
  '.vscode',
  '.idea',
  'dist',
  'dist-dryrun',
  'scripts',
  'test',
  'tests',
  '__tests__',
  '.wrangler',
  '.cache',
]);

const EXCLUDE_FILES = new Set([
  'package.json',
  'package-lock.json',
  'wrangler.toml',
  'wrangler.jsonc',
  '.pagesignore',
  '.wranglerignore',
  '.gitignore',
  '.npmrc',
  '.eslintrc.json',
  '.eslintrc.js',
  '.prettierrc',
  '.prettierrc.json',
  'purgecss.config.cjs',
  // Source artifacts no longer referenced after the script.js →
  // common.js/calculator.js split. Keep on disk for the build pipeline
  // (split-script.js reads script.js) but never ship to production.
  'script.js',
  'style.css',
  'tailwind-built.css',
  // Replaced by main.css in the consolidated stylesheet.
  'assets/bra-calculator.css',
]);

const SKIP_PATTERNS = [
  /^dist-dryrun\//,
  /^purgecss-report-.+\.md$/,
  /^[A-Z_-]+$/, // LICENSE, README, etc.
];

function shouldSkipDir(name, rel) {
  if (EXCLUDE_DIRS.has(name)) return true;
  return SKIP_PATTERNS.some((re) => re.test(rel + '/'));
}

function shouldSkipFile(name, rel) {
  if (EXCLUDE_FILES.has(name)) return true;
  if (rel.startsWith('dist-dryrun/')) return true;
  if (/^purgecss-report-.+\.md$/.test(name)) return true;
  return false;
}

function walk(srcDir, relBase = '') {
  const out = [];
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.well-known') continue;
    const rel = relBase ? `${relBase}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name, rel)) continue;
      out.push(...walk(path.join(srcDir, entry.name), rel));
    } else if (entry.isFile()) {
      if (shouldSkipFile(entry.name, rel)) continue;
      out.push({ src: path.join(srcDir, entry.name), rel });
    }
  }
  return out;
}

function rimraf(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

console.log('[build-dist] Cleaning dist/ …');
rimraf(DIST);
fs.mkdirSync(DIST, { recursive: true });

console.log('[build-dist] Scanning source tree …');
const files = walk(ROOT);
let totalBytes = 0;
for (const { src, rel } of files) {
  const dest = path.join(DIST, rel);
  copyFile(src, dest);
  totalBytes += fs.statSync(src).size;
}

console.log(`[build-dist] Copied ${files.length} files (${(totalBytes / 1024).toFixed(1)} KB) to dist/`);
console.log('[build-dist] Done.');
