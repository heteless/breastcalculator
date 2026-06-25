// Verify the corruption pattern: every non-ASCII char in clean version
// became "�?" (U+FFFD + literal '?') in current version.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const file = 'sports-bra-guide/index.html';
const clean = execSync(`git show 7f997be:${file}`, { encoding: 'utf8' });
const current = fs.readFileSync(path.join(ROOT, file), 'utf8');

// Count non-ASCII chars in clean (codepoint > 127).
let nonAscii = 0;
const cleanNonAscii = [];
for (let i = 0; i < clean.length; i++) {
  const cp = clean.codePointAt(i);
  if (cp > 127) {
    nonAscii++;
    cleanNonAscii.push({ pos: i, char: clean[i], cp: cp.toString(16) });
  }
}

// Count "�?" sequences in current.
const fffdQ = (current.match(/\uFFFD\?/g) || []).length;
const fffdTotal = (current.match(/\uFFFD/g) || []).length;

console.log('File:', file);
console.log('Clean non-ASCII chars:', nonAscii);
console.log('Current "�?" sequences:', fffdQ);
console.log('Current "�" total (incl. without ?):', fffdTotal);
console.log('--- First 20 non-ASCII chars in clean ---');
for (const x of cleanNonAscii.slice(0, 20)) {
  console.log(`  pos ${x.pos}: U+${x.cp} = ${JSON.stringify(x.char)}`);
}
