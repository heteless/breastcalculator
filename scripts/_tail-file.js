const fs = require('fs');
const file = process.argv[2];
const tail = parseInt(process.argv[3] || '50', 10);
if (!file) { console.error('usage: node _tail-file.js <file> [lines]'); process.exit(1); }
const c = fs.readFileSync(file, 'utf8').split('\n');
const start = Math.max(0, c.length - tail);
console.log(`--- ${file} (last ${tail} of ${c.length} lines) ---`);
for (let i = start; i < c.length; i++) {
  console.log(`${i + 1}: ${c[i]}`);
}
