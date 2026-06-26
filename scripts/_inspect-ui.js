const fs = require('fs');
const path = require('path');

// Check nav structure - look at a specials page
const exp = fs.readFileSync('specials/expansion-evidence/index.html', 'utf8');
console.log('=== NAV STRUCTURE (expansion-evidence) ===');
const navStart = exp.indexOf('<nav class="navbar"');
const navEnd = exp.indexOf('</nav>', navStart);
const nav = exp.substring(navStart, navEnd + 6);
// Look for separators
const dotMatches = nav.match(/·|&middot;|•|&#183;/g);
console.log('separator chars in nav:', dotMatches);
// Look for nav-categories structure
const catStart = nav.indexOf('nav-categories');
console.log('nav-categories snippet:');
console.log(nav.substring(catStart - 10, catStart + 400));

console.log('\n=== HERO HEADER ===');
const heroStart = exp.indexOf('article-hero');
if (heroStart >= 0) {
  console.log(exp.substring(heroStart - 20, heroStart + 400));
} else {
  // search for hero gradient
  const g = exp.indexOf('linear-gradient(135deg,var(--cream)');
  console.log('gradient at:', g);
  if (g >= 0) console.log(exp.substring(g - 100, g + 300));
}

console.log('\n=== THANK YOU BOX ===');
const ty = exp.indexOf('Thank you');
console.log('Thank you at:', ty);
if (ty >= 0) {
  console.log(exp.substring(ty - 200, ty + 400));
} else {
  console.log('NO "Thank you" found');
}

console.log('\n=== REFERENCES SECTION ===');
const ref = exp.indexOf('References');
console.log('References at:', ref);
if (ref >= 0) {
  console.log(exp.substring(ref - 200, ref + 400));
}

console.log('\n=== footnotes-section CSS ===');
const css = fs.readFileSync('style.css', 'utf8');
const fn = css.indexOf('.footnotes-section{');
console.log(css.substring(fn, fn + 300));
const fnList = css.indexOf('.footnotes-list{');
console.log('--- .footnotes-list ---');
console.log(css.substring(fnList, fnList + 300));
