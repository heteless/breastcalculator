const fs = require('fs');
const s = fs.readFileSync('style.css', 'utf8');

// Find base .nav-categories rule (not in media query)
let i = 0;
const positions = [];
while ((i = s.indexOf('.nav-categories', i)) >= 0) {
  positions.push(i);
  i += 1;
}
console.log('=== All .nav-categories positions ===');
positions.forEach(p => {
  // Check if inside media query by looking backwards
  const before = s.substring(Math.max(0, p - 200), p);
  const inMedia = before.includes('@media');
  console.log(`at ${p}, inMedia:${inMedia}, ctx: ${s.substring(p, p + 120)}`);
  console.log('---');
});

// Find nav-label and nav-inner styles
console.log('\n=== .nav-inner ===');
let ni = s.indexOf('.nav-inner{');
if (ni >= 0) console.log(s.substring(ni, ni + 300));

console.log('\n=== .nav-label base ===');
let nl = s.indexOf('.nav-label{');
if (nl >= 0) console.log(s.substring(nl, nl + 300));

// Check homepage nav
console.log('\n=== HOMEPAGE nav ===');
const home = fs.readFileSync('index.html', 'utf8');
const ns = home.indexOf('<nav class="navbar"');
const ne = home.indexOf('</nav>', ns);
console.log(home.substring(ns, ne + 6).substring(0, 600));
