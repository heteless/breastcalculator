// Compare ASCII skeletons after removing CJK chars AND following '?'.
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

const CJK = /[\u4e00-\u9fff]/;

let allOk = true;
for (const f of files) {
  const clean = execSync(`git show 7f997be:${f}`, { encoding: 'utf8' });
  const curr = fs.readFileSync(path.join(process.cwd(), f), 'utf8');

  // Clean: strip all non-ASCII
  const cleanAscii = clean.replace(/[^\x00-\x7f]/g, '');

  // Current: strip CJK chars, AND strip a '?' that immediately follows a CJK char
  // (the '?' is the GBK replacement for the 3rd byte)
  let currStripped = '';
  for (let i = 0; i < curr.length; i++) {
    if (CJK.test(curr[i])) {
      // skip CJK char, and also skip following '?' if present
      if (curr[i + 1] === '?') i++;
      continue;
    }
    currStripped += curr[i];
  }

  const match = cleanAscii === currStripped;
  if (!match) allOk = false;
  if (!match) {
    // Show first difference
    let dpos = 0;
    while (dpos < cleanAscii.length && dpos < currStripped.length && cleanAscii[dpos] === currStripped[dpos]) dpos++;
    console.log(`DIFF ${f}: first diff @ ${dpos}`);
    console.log(`     clean:  ${JSON.stringify(cleanAscii.substring(Math.max(0, dpos - 30), dpos + 30))}`);
    console.log(`     curr:   ${JSON.stringify(currStripped.substring(Math.max(0, dpos - 30), dpos + 30))}`);
  } else {
    console.log(`OK   ${f}`);
  }
}
console.log(allOk ? '\nAll match — can restore non-ASCII from clean.' : '\nSome differ — need merge.');
