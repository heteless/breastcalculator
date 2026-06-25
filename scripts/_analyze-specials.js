// Check each specials page for content elements (h2, h3, ul, ol, li) inside the main content section.
const fs = require('fs');
const path = require('path');

const files = [
  'specials/expansion-evidence/index.html',
  'specials/ptosis-prevention-evidence/index.html',
  'specials/buying-guide/index.html',
  'specials/why-d-cup-support/index.html',
  'specials/sports-bra-science/index.html',
];

for (const f of files) {
  const s = fs.readFileSync(path.join(process.cwd(), f), 'utf8');
  // Extract main content section
  const mainStart = s.indexOf('<main>');
  const exploreStart = s.indexOf('class="related-guides explore-resources"', mainStart);
  const content = s.substring(mainStart, exploreStart > 0 ? exploreStart : mainStart + 5000);

  const counts = {
    h2: (content.match(/<h2[^>]*>/g) || []).length,
    h3: (content.match(/<h3[^>]*>/g) || []).length,
    ul: (content.match(/<ul[^>]*>/g) || []).length,
    ol: (content.match(/<ol[^>]*>/g) || []).length,
    li: (content.match(/<li[^>]*>/g) || []).length,
    p: (content.match(/<p[^>]*>/g) || []).length,
    table: (content.match(/<table/g) || []).length,
  };

  // Check the main content wrapper class
  const wrapperMatch = content.match(/<main><div class="container"><(section|article) class="([^"]+)"/);
  console.log(`\n=== ${f} ===`);
  console.log(`  Wrapper: ${wrapperMatch ? wrapperMatch[2] : 'NOT FOUND'}`);
  console.log(`  Elements: ${JSON.stringify(counts)}`);

  // Check if there's a footnotes section
  const hasFootnotes = content.includes('footnotes-section') || content.includes('footnotes-list');
  console.log(`  Has footnotes: ${hasFootnotes}`);
}
