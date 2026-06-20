// Fix the 2 new articles whose meta description is over 160 chars
// Then re-run the gen-page.js (no-op) and verify
const fs = require('fs');
const path = require('path');

const ROOT = 'd:/DevProject/breastcalculator';

const FIXES = [
  {
    file: 'article/us-vs-uk-bra-sizes/index.html',
    newDesc: 'US and UK bra cup sizes differ after D. See the full conversion chart for DD, DDD, E, F and use the calculator to convert any measurement to US, UK, EU sizing.'
  },
  {
    file: 'article/why-80-percent-wrong-bra-size/index.html',
    newDesc: 'Studies show 70-80% of women wear the wrong bra size. See the symptoms, the science, and the 5-minute fix using our free bra size calculator at home.'
  }
];

for (const f of FIXES) {
  const p = path.join(ROOT, f.file);
  let c = fs.readFileSync(p, 'utf8');
  const before = c;
  c = c.replace(
    /<meta name="description" content="[^"]+"\/>/,
    `<meta name="description" content="${f.newDesc}"/>`
  );
  c = c.replace(
    /<meta property="og:description" content="[^"]+"\/>/,
    `<meta property="og:description" content="${f.newDesc.replace(/&/g, '&amp;')}"/>`
  );
  c = c.replace(
    /<meta name="twitter:description" content="[^"]+"\/>/,
    `<meta name="twitter:description" content="${f.newDesc.replace(/&/g, '&amp;')}"/>`
  );
  if (c !== before) {
    fs.writeFileSync(p, c, 'utf8');
    console.log(`OK    ${f.file}  (${f.newDesc.length} chars)`);
  } else {
    console.log(`NOOP  ${f.file}`);
  }
}
