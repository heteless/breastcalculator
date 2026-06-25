// Search clean version for cup-range patterns.
const fs = require('fs');
const path = require('path');

const files = [
  path.join(process.env.TEMP, 'clean-wireless.html'),
  path.join(process.env.TEMP, 'clean-hcup.html'),
];

for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  // Find all en-dash (U+2013) occurrences and show context
  for (let i = 0; i < s.length; i++) {
    if (s.codePointAt(i) === 0x2013) {
      console.log(path.basename(f), '@', i, ':', JSON.stringify(s.substring(Math.max(0, i - 10), i + 10)));
    }
  }
}
