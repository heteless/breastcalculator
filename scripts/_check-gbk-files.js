// Check which affected files exist in clean commit 7f997be and whether
// diffs are encoding-only or include other changes.
const { execSync } = require('child_process');

const files = [
  'article/bra-sister-sizes-explained/index.html',
  'article/breast-volume-guide/index.html',
  'article/breast-ptosis-causes-and-solutions/index.html',
  'article/how-to-tell-if-bra-fits/index.html',
  'article/how-to-measure-bra-size-at-home/index.html',
  'article/us-vs-uk-bra-sizes/index.html',
  'bra-size-guide/index.html',
  'bra-size-guide/h-cup/index.html',
  'specials/accessory-breast-guide/index.html',
  'wellness/compression-vs-support-bras/index.html',
];

for (const f of files) {
  let exists = true;
  try {
    execSync(`git cat-file -e 7f997be:${f} 2>&1`, { stdio: 'pipe' });
  } catch {
    exists = false;
  }
  if (!exists) {
    console.log(`NEW (not in 7f997be): ${f}`);
    continue;
  }
  const diff = execSync(`git diff --numstat 7f997be HEAD -- ${f}`, { encoding: 'utf8' }).trim();
  console.log(`${f}: ${diff || 'no-change'}`);
}
