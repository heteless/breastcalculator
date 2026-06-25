// Find specific style declarations
const fs = require('fs');
const c = fs.readFileSync('style.css', 'utf8');

// Look for CSS variable definitions
const varRe = /(--[a-z-]+)\s*:\s*(#[0-9a-f]{3,8}|[a-z]+|rgba?\([^)]+\))/gi;
let m;
const vars = {};
while ((m = varRe.exec(c)) !== null) {
  vars[m[1]] = m[2];
}
console.log('CSS Variables:');
for (const [k, v] of Object.entries(vars).sort()) {
  console.log(`  ${k}: ${v}`);
}

// Look for .field-hint rule
console.log('\n--- .field-hint rule ---');
const fh = c.match(/\.field-hint[^}]*\}/);
console.log(fh ? fh[0] : 'NOT FOUND');

// Look for .btn-primary rule
console.log('\n--- .btn-primary rule ---');
const bp = c.match(/\.btn-primary[^{]*\{[^}]*\}/);
console.log(bp ? bp[0] : 'NOT FOUND');
