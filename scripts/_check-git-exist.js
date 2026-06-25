// Check which corrupted files existed at commit 7f997be.
const { execSync } = require('child_process');
const files = [
  'best-comfort-bras/index.html',
  'bra-size-calculator/index.html',
  'breast-volume/index.html',
  'how-to-measure-bra-size/index.html',
  'bra-buying-guide/index.html',
  'best-wireless-bras/index.html',
  'tools/breast-ptosis-calculator/index.html',
  'tools/breast-expansion-calculator/index.html',
  'tools/breast-volume-calculator/index.html',
  'sports-bra-guide/index.html',
  'tools/breast-weight-calculator/index.html',
  'tools/length-converter/index.html',
  'tools/breast-shape-calculator/index.html',
  'tools/weight-converter/index.html',
];
for (const f of files) {
  try {
    const out = execSync(`git cat-file -e 7f997be:${f} 2>&1 && echo EXISTS`, { encoding: 'utf8' });
    console.log(out.trim() ? 'YES' : 'NO ', f);
  } catch {
    console.log('NO ', f);
  }
}
