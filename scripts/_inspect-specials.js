// Show the main content container structure for each specials page.
const fs = require('fs');
const path = require('path');

const files = [
  'specials/expansion-evidence/index.html',
  'specials/ptosis-prevention-evidence/index.html',
  'specials/accessory-breast-guide/index.html',
  'specials/buying-guide/index.html',
  'specials/why-d-cup-support/index.html',
  'specials/sports-bra-science/index.html',
  'specials/index.html',
];

for (const f of files) {
  const s = fs.readFileSync(path.join(process.cwd(), f), 'utf8');
  // Find <main>
  const mainIdx = s.indexOf('<main>');
  // Find first content container after main
  const afterMain = s.substring(mainIdx, mainIdx + 200);
  // Check for inline style block defining special classes
  const styleMatch = s.match(/<style>([\s\S]*?)<\/style>/);
  console.log(`\n=== ${f} ===`);
  console.log(`After <main>: ${JSON.stringify(afterMain)}`);
  if (styleMatch) {
    console.log(`Inline <style>: ${JSON.stringify(styleMatch[1].trim())}`);
  } else {
    console.log(`No inline <style> block`);
  }
}
