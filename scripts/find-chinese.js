/**
 * find-chinese.js — Scan the project for CJK/Chinese characters and FFFD replacement chars.
 * Usage: node scripts/find-chinese.js
 *
 * Detects:
 *   - CJK Unified Ideographs (U+4E00–U+9FFF)
 *   - FFFD replacement characters (�) from encoding corruption
 *   - Full-width forms, CJK punctuation
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLACKLIST = new Set(['node_modules', '.git', 'dist', 'dist-dryrun', '.wrangler', '.next', 'scripts']);

/** Recursively collect all .html, .css, .js, .xml files */
function collectFiles(dir, exts = new Set(['.html', '.css', '.js', '.xml'])) {
  const results = [];
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (BLACKLIST.has(entry.name) || entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...collectFiles(full, exts));
      } else if (exts.has(path.extname(entry.name))) {
        results.push(full);
      }
    }
  } catch (_) {}
  return results;
}

const files = collectFiles(ROOT);
const CJK_RE = /[\u3400-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/g;
const FFFD_RE = /\uFFFD/g;

let totalFFFD = 0;
let totalCJK = 0;
const findings = [];

for (const fp of files) {
  const raw = fs.readFileSync(fp, 'utf8');
  const fffd = (raw.match(FFFD_RE) || []).length;
  const cjk = (raw.match(CJK_RE) || []).length;

  if (fffd > 0 || cjk > 0) {
    totalFFFD += fffd;
    totalCJK += cjk;
    const rel = path.relative(ROOT, fp);
    findings.push({ file: rel, fffd, cjk });
  }
}

console.log(`Scanned ${files.length} files across ${ROOT}\n`);

if (findings.length === 0) {
  console.log('All clear — zero CJK or FFFD characters found.');
} else {
  console.log(`${'File'.padEnd(55)} FFFD  CJK`);
  console.log('-'.repeat(68));
  for (const f of findings) {
    console.log(`${f.file.padEnd(55)} ${String(f.fffd).padStart(4)} ${String(f.cjk).padStart(4)}`);
  }
  console.log('-'.repeat(68));
  console.log(`${'TOTAL'.padEnd(55)} ${String(totalFFFD).padStart(4)} ${String(totalCJK).padStart(4)}`);
}

if (totalFFFD > 0) {
  console.log('\nWARNING: FFFD (�) characters detected — encoding corruption present.');
  process.exit(1);
}

if (totalCJK > 0) {
  console.log('\nINFO: CJK characters found. These may be intentional or encoding corruption.');
}

process.exit(0);
