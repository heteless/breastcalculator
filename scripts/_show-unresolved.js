// Show current context at each unresolved position.
const fs = require('fs');
const path = require('path');

const cases = [
  { file: 'best-comfort-bras/index.html', pos: 3038 },
  { file: 'best-comfort-bras/index.html', pos: 30044 },
  { file: 'breast-volume/index.html', pos: 23855 },
  { file: 'bra-buying-guide/index.html', pos: 3107 },
  { file: 'tools/breast-ptosis-calculator/index.html', pos: 30377 },
  { file: 'tools/breast-expansion-calculator/index.html', pos: 29749 },
  { file: 'tools/length-converter/index.html', pos: 29236 },
];

for (const c of cases) {
  const s = fs.readFileSync(path.join(process.cwd(), c.file), 'utf8');
  const ctx = s.substring(Math.max(0, c.pos - 40), c.pos + 20);
  console.log(`--- ${c.file} @ ${c.pos} ---`);
  console.log(JSON.stringify(ctx));
}
