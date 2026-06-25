// Count what follows each CJK char to confirm mapping completeness.
const fs = require('fs');
const path = require('path');

const CJK = /[\u4e00-\u9fff]/;

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

const afterCounts = {};  // CJK char -> { next char: count }
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  for (let i = 0; i < s.length; i++) {
    if (CJK.test(s[i])) {
      const ch = s[i];
      const next = s[i + 1] || '<EOF>';
      if (!afterCounts[ch]) afterCounts[ch] = {};
      afterCounts[ch][next] = (afterCounts[ch][next] || 0) + 1;
    }
  }
}

for (const [ch, nexts] of Object.entries(afterCounts).sort((a, b) => {
  return Object.values(b[1]).reduce((s, n) => s + n, 0) - Object.values(a[1]).reduce((s, n) => s + n, 0);
})) {
  const total = Object.values(nexts).reduce((s, n) => s + n, 0);
  const nextsStr = Object.entries(nexts).sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([n, c]) => `${JSON.stringify(n)}:${c}`).join(', ');
  console.log(`${ch} (U+${ch.codePointAt(0).toString(16)}, ${total}x): next = ${nextsStr}`);
}
