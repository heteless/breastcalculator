// Inspect clean version context around key patterns.
const { execSync } = require('child_process');
const file = 'sports-bra-guide/index.html';
const clean = execSync(`git show 7f997be:${file}`, { encoding: 'utf8' });

const patterns = ['arrow', 'you own', 'reduces breast movement', 'figure-8 pattern'];
for (const p of patterns) {
  const idx = clean.indexOf(p);
  if (idx >= 0) {
    console.log(`--- "${p}" in clean ---`);
    console.log(JSON.stringify(clean.substring(idx, idx + 80)));
  } else {
    console.log(`--- "${p}" NOT FOUND in clean ---`);
  }
}

// Also check: does clean have the same surrounding structure?
const cur = require('fs').readFileSync(file, 'utf8');
const curArrow = cur.indexOf('class="arrow"');
const cleanArrow = clean.indexOf('class="arrow"');
console.log('\n--- current arrow context ---');
if (curArrow >= 0) console.log(JSON.stringify(cur.substring(curArrow, curArrow + 60)));
console.log('--- clean arrow context ---');
if (cleanArrow >= 0) console.log(JSON.stringify(clean.substring(cleanArrow, cleanArrow + 60)));
