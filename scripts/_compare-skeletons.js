// Compare file sizes between 7f997be (clean) and HEAD (corrupted) for all
// GBK-affected files. If sizes match closely, the diff is encoding-only.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const files = [
  'article/bra-sister-sizes-explained/index.html',
  'article/breast-volume-guide/index.html',
  'article/breast-ptosis-causes-and-solutions/index.html',
  'article/how-to-tell-if-bra-fits/index.html',
  'article/how-to-measure-bra-size-at-home/index.html',
  'article/us-vs-uk-bra-sizes/index.html',
  'bra-size-guide/index.html',
  'bra-size-guide/h-cup/index.html',
  'bra-size-guide/32a/index.html',
  'bra-size-guide/32b/index.html',
  'bra-size-guide/32c/index.html',
  'bra-size-guide/32d/index.html',
  'bra-size-guide/32dd/index.html',
  'bra-size-guide/34a/index.html',
  'bra-size-guide/34b/index.html',
  'bra-size-guide/34c/index.html',
  'bra-size-guide/34d/index.html',
  'bra-size-guide/34dd/index.html',
  'bra-size-guide/36a/index.html',
  'bra-size-guide/36b/index.html',
  'bra-size-guide/36c/index.html',
  'bra-size-guide/36d/index.html',
  'bra-size-guide/36dd/index.html',
  'bra-size-guide/38b/index.html',
  'bra-size-guide/38c/index.html',
  'bra-size-guide/38d/index.html',
  'bra-size-guide/38dd/index.html',
  'bra-size-guide/40c/index.html',
  'bra-size-guide/40d/index.html',
  'bra-size-guide/compare/wireless-vs-wired-bra/index.html',
  'bra-size-guide/compare/dd-cup-vs-ddd-cup/index.html',
  'bra-size-guide/compare/d-cup-vs-dd-cup/index.html',
  'bra-size-guide/compare/c-cup-vs-d-cup/index.html',
  'bra-size-guide/compare/b-cup-vs-c-cup/index.html',
  'bra-size-guide/compare/breast-size-chart/index.html',
  'bra-size-guide/compare/38c-vs-40b/index.html',
  'bra-size-guide/compare/36b-vs-34c/index.html',
  'bra-size-guide/compare/34dd-vs-36d/index.html',
  'bra-size-guide/compare/34b-vs-36c/index.html',
  'bra-size-guide/compare/32d-vs-34c/index.html',
  'specials/accessory-breast-guide/index.html',
  'wellness/compression-vs-support-bras/index.html',
];

let allOk = true;
for (const f of files) {
  const clean = execSync(`git show 7f997be:${f}`, { encoding: 'utf8' });
  const curr = fs.readFileSync(path.join(process.cwd(), f), 'utf8');
  // Strip all non-ASCII from both, compare the ASCII skeleton
  const cleanAscii = clean.replace(/[^\x00-\x7f]/g, '');
  const currAscii = curr.replace(/[^\x00-\x7f]/g, '');
  const match = cleanAscii === currAscii;
  if (!match) allOk = false;
  console.log(`${match ? 'OK  ' : 'DIFF'} ${f.padEnd(55)} clean=${clean.length} curr=${curr.length} ascii-match=${match}`);
}
console.log(allOk ? '\nAll ASCII skeletons match — safe to restore from clean.' : '\nSome ASCII skeletons differ — need careful merge.');
