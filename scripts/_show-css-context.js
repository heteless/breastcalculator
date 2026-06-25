// Show context around the special-sub and footnotes-section rules with byte offsets.
const fs = require('fs');
const path = require('path');

const s = fs.readFileSync(path.join(process.cwd(), 'style.css'), 'utf8');

const searches = [
  '.special-sub{',
  '.footnotes-section,main',
  '.specials-sub sup.ref a:hover',
];

for (const search of searches) {
  const idx = s.indexOf(search);
  if (idx >= 0) {
    const start = Math.max(0, idx - 30);
    const end = Math.min(s.length, idx + 400);
    console.log(`\n=== Found "${search}" at offset ${idx} ===`);
    console.log(JSON.stringify(s.substring(start, end)));
  } else {
    console.log(`\n=== NOT FOUND: "${search}" ===`);
  }
}
