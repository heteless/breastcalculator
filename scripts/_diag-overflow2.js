// Better diagnostic: properly handle @media queries to avoid false positives.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const css = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');

// Strip @media(...) conditions so we don't match them as properties
// Replace @media(min-width:768px) with @media(~768px) so our regex won't match
const stripped = css.replace(/@media\s*\([^)]*\)/g, '@media(~)');

console.log('=== Real min-width rules (excluding @media conditions) ===');
const minWidths = [...stripped.matchAll(/min-width:\s*(\d+)px/g)];
console.log('Total real min-width rules:', minWidths.length);
minWidths.forEach(m => {
  const idx = m.index;
  const before = stripped.lastIndexOf('{', idx);
  const selStart = stripped.lastIndexOf('}', before);
  const sel = stripped.substring(selStart + 1, before).trim();
  console.log('  ' + sel + ' { ' + m[0] + ' }');
});

console.log('\n=== Real fixed/percentage widths >= 300px ===');
const widths = [...stripped.matchAll(/(?:^|[;\s])(width|max-width):\s*(\d{3,})px/g)];
widths.forEach(m => {
  const idx = m.index;
  const before = stripped.lastIndexOf('{', idx);
  const selStart = stripped.lastIndexOf('}', before);
  const sel = stripped.substring(selStart + 1, before).trim();
  console.log('  ' + sel + ' { ' + m[0].trim() + ' }');
});

console.log('\n=== Negative margins (could cause overflow) ===');
const negMargins = [...stripped.matchAll(/margin-left:\s*-\d+px|margin-right:\s*-\d+px|margin:\s*-\d+px\s+-?\d+/g)];
console.log('Negative margin rules:', negMargins.length);
negMargins.slice(0, 10).forEach(m => {
  const idx = m.index;
  const before = stripped.lastIndexOf('{', idx);
  const selStart = stripped.lastIndexOf('}', before);
  const sel = stripped.substring(selStart + 1, before).trim();
  console.log('  ' + sel + ' { ' + m[0] + ' }');
});

console.log('\n=== position:absolute/fixed elements (can escape containers) ===');
const absPos = [...stripped.matchAll(/position:(absolute|fixed)/g)];
console.log('Absolute/fixed positioned rules:', absPos.length);

// Check html rule
console.log('\n=== html rule ===');
const htmlRule = css.match(/html\{[^}]+\}/);
if (htmlRule) console.log(htmlRule[0]);

// Check footer rule
console.log('\n=== footer .max-w-6xl rule ===');
const footerMax = css.match(/footer\s*\.max-w-6xl\{[^}]+\}/);
if (footerMax) console.log(footerMax[0]);
