// scripts/fix-encoding.js
//
// Repair UTF-8 corruption across HTML/JS source files.
//
// Background
// ----------
// Commit 5bbf66b ("seo renew ga4") dropped <meta charset="utf-8"/> from ~14
// page templates AND corrupted every multi-byte UTF-8 sequence. The exact
// corruption pattern (verified byte-by-byte) is:
//
//   [multi-byte UTF-8 char][1 following byte]  ->  U+FFFD + "?"
//
// i.e. each non-ASCII codepoint PLUS the single byte that followed it was
// collapsed into the 2-char sequence "\uFFFD?". The trailing byte is
// therefore LOST in the corrupted file and must be recovered from the
// clean git revision (7f997be, "index now").
//
// Approach
// --------
// For every "\uFFFD?" in the current file we build a fingerprint:
//
//     before[WIN]  +  "\uFFFD?"  +  after[WIN]
//
// and search the clean revision for:
//
//     before[WIN]  +  [non-ASCII char]  +  [1 ASCII byte]  +  after[WIN]
//
// When a unique match is found, "\uFFFD?" is replaced with the recovered
// 2-char sequence (the original non-ASCII char + the consumed byte). This
// preserves every other change made since 7f997be (layout-normalize,
// cache-bust hashes, etc.) and only restores the lost bytes.
//
// Idempotent: re-running on already-fixed files is a no-op.

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CLEAN_REF = '7f997be';

const FILES = [
  'best-comfort-bras/index.html',
  'bra-size-calculator/index.html',
  'breast-volume/index.html',
  'how-to-measure-bra-size/index.html',
  'bra-buying-guide/index.html',
  'best-wireless-bras/index.html',
  'tools/breast-ptosis-calculator/index.html',
  'tools/breast-expansion-calculator/index.html',
  'tools/breast-volume-calculator/index.html',
  'sports-bra-guide/index.html',
  'tools/breast-weight-calculator/index.html',
  'tools/length-converter/index.html',
  'tools/breast-shape-calculator/index.html',
  'tools/weight-converter/index.html',
];

// Build a lookup from the clean source. Each non-ASCII char at position j
// is indexed by the fingerprint (before[WIN] + sep + after[WIN]) where
// `after` starts at j+2 (skipping the consumed trailing byte). The stored
// value is the 2-char replacement: [non-ASCII char] + [consumed byte].
function buildIndex(clean) {
  const idx = new Map();
  for (let j = 0; j < clean.length; j++) {
    const cp = clean.codePointAt(j);
    if (cp <= 127) continue;
    const ch = String.fromCodePoint(cp);
    const chLen = ch.length; // 1 for BMP, 2 for astral
    if (cp >= 0x10000) j++;
    // The byte consumed by the corruption is the char right after the
    // non-ASCII codepoint. If there is no following char, skip.
    if (j + chLen >= clean.length) continue;
    const consumed = clean[j + chLen];
    const replacement = ch + consumed;
    const afterStart = j + chLen + 1; // skip char + consumed byte
    for (const WIN of [24, 16, 12, 8, 6, 4, 3, 2]) {
      const before = clean.substring(Math.max(0, j - WIN), j);
      const after = clean.substring(afterStart, afterStart + WIN);
      // Require ASCII-only fingerprints on both sides.
      if (/[^\x00-\x7f]/.test(before) || /[^\x00-\x7f]/.test(after)) continue;
      const key = before + '\u0001' + after;
      if (!idx.has(key)) idx.set(key, replacement);
    }
  }
  return idx;
}

function repairFile(rel) {
  const abs = path.join(ROOT, rel);
  const current = fs.readFileSync(abs, 'utf8');
  const clean = execSync(`git show ${CLEAN_REF}:${rel}`, { encoding: 'utf8' });
  const idx = buildIndex(clean);

  let fixed = 0;
  let unresolved = 0;
  const unresolvedContexts = [];

  let out = '';
  let i = 0;
  while (i < current.length) {
    if (current[i] === '\uFFFD' && current[i + 1] === '?') {
      let resolved = null;
      for (const WIN of [24, 16, 12, 8, 6, 4, 3, 2]) {
        const before = current.substring(Math.max(0, i - WIN), i);
        const after = current.substring(i + 2, i + 2 + WIN);
        if (/[^\x00-\x7f]/.test(before) || /[^\x00-\x7f]/.test(after)) continue;
        const key = before + '\u0001' + after;
        if (idx.has(key)) {
          resolved = idx.get(key);
          break;
        }
      }
      // Fallback heuristics for corruption in text added after CLEAN_REF
      // (fingerprint lookup cannot recover these because the clean revision
      // has different wording at the same position). These heuristics only
      // apply to em-dash patterns where the consumed byte is a space —
      // digit-range corruptions are left unresolved because the consumed
      // digit cannot be reliably recovered without the clean source.
      if (resolved === null) {
        const before = current.substring(Math.max(0, i - 6), i);
        const after = current.substring(i + 2, i + 2 + 6);
        // "word/space �? lowercase word" → em-dash + space
        // (e.g. "fits — compare", "tight — that", "2026 — professional")
        if ((/\w\s$/.test(before) || /\s$/.test(before)) && /^[a-z]/.test(after) && !/\d$/.test(before)) {
          resolved = '\u2014 ';
        }
      }
      if (resolved !== null) {
        out += resolved;
        i += 2;
        fixed++;
      } else {
        out += current[i];
        unresolved++;
        if (unresolved <= 5) {
          unresolvedContexts.push(
            `  unresolved @ ${i}: ...${JSON.stringify(current.substring(Math.max(0, i - 20), i + 4))}...`,
          );
        }
        i += 1;
      }
    } else {
      out += current[i];
      i += 1;
    }
  }

  if (out !== current) fs.writeFileSync(abs, out, 'utf8');
  console.log(`${rel}: fixed ${fixed}, unresolved ${unresolved}, ${out !== current ? 'written' : 'no-change'}`);
  for (const c of unresolvedContexts) console.log(c);
  return { fixed, unresolved };
}

let totalFixed = 0;
let totalUnresolved = 0;
for (const f of FILES) {
  const r = repairFile(f);
  totalFixed += r.fixed;
  totalUnresolved += r.unresolved;
}
console.log('---');
console.log(`Total fixed: ${totalFixed}`);
console.log(`Total unresolved: ${totalUnresolved}`);
