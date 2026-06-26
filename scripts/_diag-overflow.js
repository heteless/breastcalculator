// Diagnose potential horizontal overflow sources on desktop.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const css = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');

console.log('=== 1. Existing overflow / max-width defenses ===');
const checks = [
  ['body overflow-x:hidden', /body\{[^}]*overflow-x:hidden/],
  ['html overflow-x:hidden', /html\{[^}]*overflow-x:hidden/],
  ['main overflow-x:hidden', /main\{[^}]*overflow-x:hidden/],
  ['main max-width:100%', /main\{[^}]*max-width:100%/],
  ['img max-width:100%', /img\{[^}]*max-width:100%/],
  ['img,svg...max-width:100%', /img,svg,video,canvas,iframe,embed,object\{[^}]*max-width:100%/],
  ['--max-w variable', /--max-w:[^;]+;/],
  ['.container max-width', /\.container\{[^}]*max-width:var\(--max-w\)/],
];

for (const [label, re] of checks) {
  const m = css.match(re);
  console.log((m ? 'OK   ' : 'MISS ') + label);
  if (m) console.log('       -> ' + m[0].substring(0, 120));
}

console.log('\n=== 2. Potential overflow sources (fixed widths, large paddings, wide grids) ===');
// Look for fixed pixel widths that might exceed viewport
const fixedWidths = [...css.matchAll(/(?:width|min-width|max-width):\s*(\d{3,})px/g)];
console.log('Fixed widths >= 100px:');
fixedWidths.slice(0, 30).forEach(m => {
  // Get surrounding selector context
  const idx = m.index;
  const before = css.lastIndexOf('{', idx);
  const selStart = css.lastIndexOf('}', before);
  const sel = css.substring(selStart + 1, before).trim();
  console.log('  ' + sel + ' { ' + m[0] + ' }');
});

console.log('\n=== 3. Elements with min-width that may force overflow ===');
const minWidths = [...css.matchAll(/min-width:\s*(\d+)px/g)];
console.log('min-width rules (' + minWidths.length + ' total):');
minWidths.slice(0, 20).forEach(m => {
  const idx = m.index;
  const before = css.lastIndexOf('{', idx);
  const selStart = css.lastIndexOf('}', before);
  const sel = css.substring(selStart + 1, before).trim();
  console.log('  ' + sel + ' { ' + m[0] + ' }');
});

console.log('\n=== 4. Grid layouts that may overflow at high res ===');
const grids = [...css.matchAll(/grid-template-columns:\s*([^;}]+)/g)];
console.log('Grid template rules:');
grids.slice(0, 15).forEach(m => {
  const idx = m.index;
  const before = css.lastIndexOf('{', idx);
  const selStart = css.lastIndexOf('}', before);
  const sel = css.substring(selStart + 1, before).trim();
  console.log('  ' + sel + ' -> ' + m[1].trim());
});

console.log('\n=== 5. dropdown-menu min-width (potential nav overflow) ===');
const ddMatch = css.match(/\.dropdown-menu\{[^}]+\}/);
if (ddMatch) console.log(ddMatch[0]);

console.log('\n=== 6. Large box-shadows that may extend visually (not cause scroll) ===');
const shadows = [...css.matchAll(/box-shadow:[^;}]+/g)];
console.log('Total box-shadow rules:', shadows.length);
