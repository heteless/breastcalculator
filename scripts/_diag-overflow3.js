// Check for 100vw usage (common overflow cause) and look at homepage structure.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const css = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');

console.log('=== 100vw usage (common horizontal overflow cause) ===');
const vwMatches = [...css.matchAll(/(?:width|max-width|min-width):\s*100vw/g)];
console.log('100vw width rules:', vwMatches.length);
vwMatches.forEach(m => {
  const idx = m.index;
  const before = css.lastIndexOf('{', idx);
  const selStart = css.lastIndexOf('}', before);
  const sel = css.substring(selStart + 1, before).trim();
  console.log('  ' + sel + ' { ' + m[0] + ' }');
});

console.log('\n=== position:fixed elements (escape body overflow) ===');
const fixedMatches = [...css.matchAll(/([^{}]+)\{[^}]*position:fixed[^}]*\}/g)];
fixedMatches.forEach(m => {
  const sel = m[1].trim().split('\n').pop().trim();
  console.log('  ' + sel);
});

console.log('\n=== Homepage structure (main content sections) ===');
const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
// Find the main content area and hub section
const mainStart = home.indexOf('<main');
const mainEnd = home.indexOf('</main>');
if (mainStart >= 0 && mainEnd > mainStart) {
  const main = home.substring(mainStart, mainEnd + 7);
  // Show top-level structure (first 2000 chars)
  console.log(main.substring(0, 2500));
}

console.log('\n=== "Explore" / "Hub" section search ===');
const hubIdx = home.toLowerCase().indexOf('hub');
if (hubIdx >= 0) {
  console.log('Found "hub" at index ' + hubIdx);
  console.log(home.substring(Math.max(0, hubIdx - 100), hubIdx + 400));
}

console.log('\n=== card-grid usage in homepage ===');
const cardGridIdx = home.indexOf('card-grid');
if (cardGridIdx >= 0) {
  console.log(home.substring(Math.max(0, cardGridIdx - 200), cardGridIdx + 600));
}
