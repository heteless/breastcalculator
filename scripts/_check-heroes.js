const fs = require('fs');
const files = [
  'specials/expansion-evidence/index.html',
  'specials/ptosis-prevention-evidence/index.html',
  'specials/buying-guide/index.html',
  'specials/sports-bra-science/index.html',
  'specials/why-d-cup-support/index.html',
  'specials/accessory-breast-guide/index.html',
];
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  const h1 = s.indexOf('<h1');
  const heroIdx = s.indexOf('class="tool-hero"');
  const articleHeroIdx = s.indexOf('class="article-hero"');
  const heroType = heroIdx >= 0 ? 'tool-hero' : (articleHeroIdx >= 0 ? 'article-hero' : 'none');
  console.log(`${f.split('/')[1]}: hero=${heroType}, h1 context: ${s.substring(h1-30, h1+60).replace(/\n/g,' ')}`);
}
