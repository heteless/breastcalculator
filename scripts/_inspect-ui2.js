const fs = require('fs');

// Check a page with bullets
const art = fs.readFileSync('article/band-bra-fit-problems/index.html', 'utf8');
console.log('=== ARTICLE NAV (band-bra-fit-problems) ===');
const navStart = art.indexOf('<nav class="navbar"');
const navEnd = art.indexOf('</nav>', navStart);
const nav = art.substring(navStart, navEnd + 6);
// Find bullet context
let i = nav.indexOf('·');
if (i < 0) i = nav.indexOf('&middot;');
if (i < 0) i = nav.indexOf('&#183;');
console.log('bullet at:', i);
if (i >= 0) {
  console.log('context:', nav.substring(i - 80, i + 80));
}
// Show nav-categories structure
const cat = nav.indexOf('nav-categories');
console.log('\nnav-categories block:');
console.log(nav.substring(cat - 5, cat + 500));

// Check tool page Thank You
console.log('\n\n=== TOOL PAGE Thank You (breast-expansion-calculator) ===');
const tool = fs.readFileSync('tools/breast-expansion-calculator/index.html', 'utf8');
const ty = tool.indexOf('Thank you');
console.log('Thank you at:', ty);
if (ty >= 0) {
  console.log(tool.substring(ty - 300, ty + 500));
}

// Check hero on expansion-evidence (the specials page)
console.log('\n\n=== EXPANSION-EVIDENCE HERO ===');
const exp = fs.readFileSync('specials/expansion-evidence/index.html', 'utf8');
// Find the header
const h1 = exp.indexOf('<h1');
console.log('h1 at:', h1);
if (h1 >= 0) {
  console.log(exp.substring(h1 - 200, h1 + 300));
}
// Find the first h2
const h2 = exp.indexOf('<h2');
console.log('\nfirst h2 at:', h2);
if (h2 >= 0) {
  console.log(exp.substring(h2 - 100, h2 + 200));
}
