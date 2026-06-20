// Helper: extract meta descriptions for fixing
const fs = require('fs');
const path = require('path');

const targets = [
  'index.html',
  'bra-size-calculator/index.html',
  'bra-size-guide/index.html',
  'tools/weight-converter/index.html',
  'tools/index.html',
  'specials/index.html',
  'wellness/index.html',
  'articles/index.html',
  'specials/accessory-breast-guide/index.html',
  'specials/buying-guide/index.html',
  'specials/expansion-evidence/index.html',
  'wellness/prosthetic-bras-guide/index.html',
  'wellness/sports-bras-after-surgery/index.html',
  'article/band-bra-fit-problems/index.html',
  'article/special-bra-fit-problems/index.html',
  'article/underwire-gore-bra-fit-problems/index.html',
];

for (const p of targets) {
  const c = fs.readFileSync(p, 'utf8');
  const titleM = c.match(/<title>([^<]+)<\/title>/);
  const descM = c.match(/<meta name="description" content="([^"]+)"/);
  const canonM = c.match(/<link rel="canonical" href="([^"]+)"/);
  const ogTM = c.match(/<meta property="og:title" content="([^"]+)"/);
  const ogDM = c.match(/<meta property="og:description" content="([^"]+)"/);
  const twTM = c.match(/<meta name="twitter:title" content="([^"]+)"/);
  console.log('===', p, '===');
  console.log('  title :', titleM ? `${titleM[1].length}|${titleM[1]}` : 'NONE');
  console.log('  desc  :', descM ? `${descM[1].length}|${descM[1]}` : 'NONE');
  console.log('  canon :', canonM ? canonM[1] : 'NONE');
  console.log('  og:t  :', ogTM ? `${ogTM[1].length}|${ogTM[1]}` : 'NONE');
  console.log('  og:d  :', ogDM ? `${ogDM[1].length}|${ogDM[1]}` : 'NONE');
  console.log('  tw:t  :', twTM ? `${twTM[1].length}|${twTM[1]}` : 'NONE');
}
