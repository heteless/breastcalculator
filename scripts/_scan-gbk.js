// Scan all files for GBK-misdecoded characters and show their context.
const fs = require('fs');
const path = require('path');

// Common GBK-misdecode patterns when UTF-8 source was read as GBK:
const PATTERNS = [
  { ch: '鈥', name: 'em-dash (—)', orig: '\u2014' },
  { ch: '路', name: 'middle dot (·)', orig: '\u00B7' },
  { ch: '芒', name: 'â-prefix', orig: null },
  { ch: '锛', name: 'arrow/right', orig: null },
  { ch: '鈩', name: 'trademark (™)', orig: '\u2122' },
  { ch: '搂', name: 'section (§)', orig: '\u00A7' },
  { ch: '閿', name: 'times (×) or other', orig: null },
  { ch: '鈽', name: 'star (★/☆)', orig: null },
  { ch: '鈥', name: 'left/right quote', orig: null },
  { ch: '绂', name: 'exclamation (!)', orig: null },
  { ch: '鈺', name: 'arrow block', orig: null },
];

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', 'dist', '.git', 'scripts'].includes(e.name)) continue;
      walk(p, out);
    } else if (e.name.endsWith('.html') || e.name.endsWith('.js') || e.name.endsWith('.css')) {
      out.push(p);
    }
  }
}

const files = [];
walk(process.cwd(), files);

const counts = {};
const examples = {};
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  for (let i = 0; i < s.length; i++) {
    const cp = s.codePointAt(i);
    if (cp >= 0x4E00 && cp <= 0x9FFF) {
      // CJK Unified Ideograph — suspicious in English content
      const ch = s[i];
      counts[ch] = (counts[ch] || 0) + 1;
      if (!examples[ch]) {
        examples[ch] = { file: path.relative(process.cwd(), f), ctx: s.substring(Math.max(0, i - 20), i + 20) };
      }
    }
  }
}

const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
console.log('CJK chars found in English content (top 20):');
for (const [ch, n] of sorted.slice(0, 20)) {
  console.log(`  ${ch} (U+${ch.codePointAt(0).toString(16)}): ${n} times  example: ${JSON.stringify(examples[ch].file)}  ${JSON.stringify(examples[ch].ctx)}`);
}
console.log(`\nTotal distinct CJK chars: ${sorted.length}`);
console.log(`Total occurrences: ${sorted.reduce((a, [, n]) => a + n, 0)}`);
