// Find h2/h3 in index.html
const fs = require('fs');
const path = require('path');
const c = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// Find all h2 and h3 elements
const h2s = [...c.matchAll(/<h2[\s\S]*?<\/h2>/g)].map(m => m[0].substring(0, 150));
const h3s = [...c.matchAll(/<h3[\s\S]*?<\/h3>/g)].map(m => m[0].substring(0, 120));

console.log('=== H2s ===');
h2s.forEach((h, i) => console.log(`${i+1}. ${h}`));
console.log('\n=== H3s ===');
h3s.forEach((h, i) => console.log(`${i+1}. ${h}`));

// Find a good insertion point - look for the closing of the "Explore All Resources" section
const exploreIdx = c.indexOf('Explore All Resources');
console.log('\nExplore Resources position:', exploreIdx);
