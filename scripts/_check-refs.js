// Quick script to find script references in an HTML file
const fs = require('fs');
const file = process.argv[2];
if (!file) { console.error('usage: node _check-refs.js <htmlfile>'); process.exit(1); }
const c = fs.readFileSync(file, 'utf8');
const re = /<script[^>]*\ssrc=["']([^"']+)["']/g;
let m, count = 0;
while ((m = re.exec(c)) !== null) {
  console.log(m[1]);
  count++;
}
console.log(`--- total: ${count} scripts ---`);
// also find inline scripts count
const inline = (c.match(/<script(?![^>]*\ssrc=)[^>]*>/g) || []).length;
console.log(`--- inline scripts: ${inline} ---`);
