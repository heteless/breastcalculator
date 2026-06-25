// Fix GBK-misdecoded characters by restoring non-ASCII chars from clean git version.
//
// Corruption process:
//   1. UTF-8 multi-byte chars were read as GBK, producing CJK characters.
//   2. For 3-byte UTF-8 chars (em-dash, en-dash, arrows, etc.):
//      - Bytes 1-2 (E2 80) decode to CJK char 鈥 (U+9225).
//      - Byte 3 (9X) is invalid as GBK lead byte → U+FFFD.
//      - U+FFFD + the NEXT byte (the char following the original) get replaced by '?'.
//      Result: 鈥? + remaining text (1 char swallowed by '?').
//   3. For en-dash (E2 80 93) + ASCII letter (40-7E range):
//      - Bytes 1-2 → 鈥. Bytes 3-4 (93 XX) decode to a CJK char.
//      Result: 鈥 + CJK (letter swallowed, no '?').
//   4. For 2-byte UTF-8 chars (×, ©, ·):
//      - Both bytes decode to a single CJK char.
//      Result: CJK (no '?', no swallowing).
//
// Fingerprint matching accounts for the swallowed char:
//   - Pattern A (鈥?): current after = char + 1 swallowed. Clean after must skip char + 1.
//   - Pattern B (鈥+CJK): current after = char + 1 swallowed. Clean after must skip char + 1.
//   - Pattern C (single CJK): current after = char. Clean after = char.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CLEAN_REF = '7f997be';
const ROOT = process.cwd();
const CJK = /[\u4e00-\u9fff]/;

// Auto-discover affected files by scanning for CJK chars in content files.
function findFiles() {
  const out = [];
  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (['node_modules', 'dist', '.git', 'scripts'].includes(e.name)) continue;
        walk(p);
      } else if (e.name.endsWith('.html') || e.name.endsWith('.js') || e.name.endsWith('.css')) {
        out.push(p);
      }
    }
  }
  walk(ROOT);
  return out.filter(abs => {
    const s = fs.readFileSync(abs, 'utf8');
    let hasCJK = false;
    for (let i = 0; i < s.length; i++) {
      if (CJK.test(s[i])) { hasCJK = true; break; }
    }
    if (!hasCJK) return false;
    const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
    try {
      execSync(`git cat-file -e ${CLEAN_REF}:${rel} 2>&1`, { stdio: 'pipe' });
    } catch {
      console.log(`SKIP (not in ${CLEAN_REF}): ${rel}`);
      return false;
    }
    return true;
  }).map(abs => path.relative(ROOT, abs).replace(/\\/g, '/'));
}

const FILES = findFiles();

// GBK byte mapping for CJK chars that are part of en-dash sequences.
// en-dash (E2 80 93) + ASCII letter: 93 XX → CJK char.
const EN_DASH_CJK = {
  '\u63c7': 'D',  // 揇 ← 93 44
  '\u63cb': 'G',  // 揋 ← 93 47
  '\u63c3': 'B',  // 揃 ← 93 42
  '\u63c5': 'C',  // 揅 ← 93 43
};

// Build two fingerprint indexes from clean version:
//   idxSkip1: after skips char + 1 char (for patterns A and B where 1 char is swallowed)
//             value = [char, swallowedChar] so we can restore the swallowed char
//   idxNoSkip: after starts right after char (for pattern C with no swallowing)
function buildIndex(clean) {
  const idxSkip1 = new Map();
  const idxNoSkip = new Map();
  for (let j = 0; j < clean.length; j++) {
    const cp = clean.codePointAt(j);
    if (cp <= 127) continue;
    const ch = String.fromCodePoint(cp);
    const chLen = ch.length;
    if (cp >= 0x10000) j += chLen - 1;

    // idxNoSkip: after starts right after the char
    for (const WIN of [30, 24, 18, 14, 10, 8, 6, 4, 3, 2]) {
      const before = clean.substring(Math.max(0, j - WIN), j);
      const after = clean.substring(j + chLen, j + chLen + WIN);
      if (/[^\x00-\x7f]/.test(before) || /[^\x00-\x7f]/.test(after)) continue;
      const key = before + '\u0001' + after;
      if (!idxNoSkip.has(key)) idxNoSkip.set(key, ch);
    }

    // idxSkip1: after skips char + 1 more char (the swallowed one)
    // Store [char, swallowedChar] so we can restore the swallowed char
    const skipStart = j + chLen + 1;
    if (skipStart <= clean.length) {
      const swallowed = clean.substring(j + chLen, j + chLen + 1);
      for (const WIN of [30, 24, 18, 14, 10, 8, 6, 4, 3, 2]) {
        const before = clean.substring(Math.max(0, j - WIN), j);
        const after = clean.substring(skipStart, skipStart + WIN);
        if (/[^\x00-\x7f]/.test(before) || /[^\x00-\x7f]/.test(after)) continue;
        const key = before + '\u0001' + after;
        if (!idxSkip1.has(key)) idxSkip1.set(key, [ch, swallowed]);
      }
    }
  }
  return { idxSkip1, idxNoSkip };
}

function repairFile(rel) {
  const abs = path.join(ROOT, rel);
  const current = fs.readFileSync(abs, 'utf8');
  const clean = execSync(`git show ${CLEAN_REF}:${rel}`, { encoding: 'utf8' });
  const { idxSkip1, idxNoSkip } = buildIndex(clean);

  let fixed = 0;
  let unresolved = 0;
  let out = '';
  let i = 0;
  while (i < current.length) {
    const ch = current[i];
    if (!CJK.test(ch)) {
      out += ch;
      i++;
      continue;
    }

    let consume = 1;
    let nextCh = current[i + 1] || '';
    let useSkip1 = false; // whether to use idxSkip1 (1 char swallowed)

    // Pattern A: CJK + '?' → 3-byte UTF-8 char; '?' swallowed 1 char
    if (nextCh === '?') {
      consume = 2;
      useSkip1 = true;
    }
    // Pattern B: 鈥 + CJK → en-dash + ASCII letter; letter swallowed
    else if (CJK.test(nextCh) && ch === '\u9225') {
      consume = 2;
      useSkip1 = true;
    }

    // Skip CJK that is the second part of an en-dash sequence (handled when first part matched)
    if (EN_DASH_CJK[ch] && i > 0 && current[i - 1] === '\u9225') {
      out += ch;
      i++;
      continue;
    }

    // Build fingerprint and match
    const idx = useSkip1 ? idxSkip1 : idxNoSkip;
    let resolved = null;
    let swallowed = null;
    for (const WIN of [30, 24, 18, 14, 10, 8, 6, 4, 3, 2]) {
      const before = current.substring(Math.max(0, i - WIN), i);
      const afterStart = i + consume;
      const after = current.substring(afterStart, afterStart + WIN);
      if (/[^\x00-\x7f]/.test(before) || /[^\x00-\x7f]/.test(after)) continue;
      const key = before + '\u0001' + after;
      if (idx.has(key)) {
        const val = idx.get(key);
        if (Array.isArray(val)) {
          resolved = val[0];
          swallowed = val[1];
        } else {
          resolved = val;
        }
        break;
      }
    }

    if (resolved !== null) {
      // For Pattern A (鈥?): resolved is the char, swallowed is the char after it
      // For Pattern B (鈥+CJK): resolved is en-dash, swallowed is the ASCII letter
      if (swallowed !== null) {
        out += resolved + swallowed;
      } else {
        out += resolved;
      }
      i += consume;
      fixed++;
    } else {
      // Fallback mappings for unambiguous patterns
      if (nextCh === '?' && ch === '\u9225') {
        // 鈥? without fingerprint match — default to em-dash
        out += '\u2014';
        i += 2;
        fixed++;
      } else if (nextCh === '?' && ch === '\u923b') {
        out += '\u25BE';
        i += 2;
        fixed++;
      } else if (nextCh === '?' && ch === '\u922b') {
        out += '\u2192';
        i += 2;
        fixed++;
      } else if (nextCh === '?' && ch === '\u922d') {
        out += '\u2212';
        i += 2;
        fixed++;
      } else if (consume === 2 && ch === '\u9225' && CJK.test(nextCh)) {
        const letter = EN_DASH_CJK[nextCh] || '?';
        out += '\u2013' + letter;
        i += 2;
        fixed++;
      } else if (consume === 1) {
        if (ch === '\u8133') { out += '\u00D7'; i++; fixed++; }
        else if (ch === '\u6f0f') { out += '\u00A9'; i++; fixed++; }
        else if (ch === '\u8def') { out += '\u00B7'; i++; fixed++; }
        else {
          out += ch;
          i++;
          unresolved++;
        }
      } else {
        out += ch;
        i++;
        unresolved++;
      }
    }
  }

  if (out !== current) fs.writeFileSync(abs, out, 'utf8');
  console.log(`${rel}: fixed ${fixed}, unresolved ${unresolved}, ${out !== current ? 'written' : 'no-change'}`);
  return { fixed, unresolved };
}

let totalFixed = 0;
let totalUnresolved = 0;
for (const rel of FILES) {
  const { fixed, unresolved } = repairFile(rel);
  totalFixed += fixed;
  totalUnresolved += unresolved;
}
console.log(`\nTotal fixed: ${totalFixed}`);
console.log(`Total unresolved: ${totalUnresolved}`);
