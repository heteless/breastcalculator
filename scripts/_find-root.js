// Find :root rules in style.css
const fs = require('fs');
const c = fs.readFileSync('style.css', 'utf8');

// Find all :root blocks
const rootRe = /:root\s*\{([^}]*)\}/g;
let m;
let i = 0;
while ((m = rootRe.exec(c)) !== null) {
  i++;
  console.log(`\n=== :root block #${i} @ ${m.index} ===`);
  console.log(m[1].trim());
}

// Also find @media (prefers-color-scheme: dark) blocks
const darkRe = /@media\s*\(\s*prefers-color-scheme:\s*dark\s*\)\s*\{[^}]*\}/g;
console.log('\n--- dark mode blocks ---');
let dm;
while ((dm = darkRe.exec(c)) !== null) {
  console.log(`@ ${dm.index}: ${dm[0].slice(0, 200)}`);
}

// Check .dark class
const darkClassRe = /\.dark\s*\{([^}]*)\}/g;
console.log('\n--- .dark class blocks ---');
let dc;
while ((dc = darkClassRe.exec(c)) !== null) {
  console.log(`@ ${dc.index}: .dark {${dc[1].trim().slice(0, 200)}}`);
}
