// diffblob.js — compare two evaluate_script dumps (with/without Tailwind Play CDN).
const fs = require('fs');

const A = 'C:/Users/Hu/AppData/Local/Temp/trae/toolcall-output/2b5000df-0661-4a04-b2c3-909a42131671.txt'; // with CDN
const B = 'C:/Users/Hu/AppData/Local/Temp/trae/toolcall-output/4a481bfa-4e3b-498e-bd04-98e04c4d57bc.txt'; // without CDN

function load(p) {
  const raw = fs.readFileSync(p, 'utf8');
  const outer = JSON.parse(raw.slice(raw.indexOf('[')));
  const text = outer.map(o => o.text || '').join('');
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  const obj = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
  return { docH: obj.docH, rows: obj.blob.split('\n') };
}

const a = load(A), b = load(B);
console.log('with CDN   docH =', a.docH, ' rows =', a.rows.length);
console.log('without CDN docH =', b.docH, ' rows =', b.rows.length);

const PROPS = ['width', 'fontSize', 'lineHeight', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'display', 'maxWidth', 'letterSpacing', 'fontWeight'];

const n = Math.min(a.rows.length, b.rows.length);
let diffs = 0;
for (let i = 0; i < n; i++) {
  if (a.rows[i] === b.rows[i]) continue;
  diffs++;
  const pa = a.rows[i].split('|');
  const pb = b.rows[i].split('|');
  const va = (pa[2] || '').split('~');
  const vb = (pb[2] || '').split('~');
  const changed = [];
  for (let j = 0; j < PROPS.length; j++) {
    if (va[j] !== vb[j]) changed.push(`${PROPS[j]}: ${va[j]} -> ${vb[j]}`);
  }
  console.log(`#${pa[0]} ${pa[1]} (${pb[1]})  ${changed.length ? changed.join(' ; ') : '(no prop diff)'}`);
}
console.log('--- total differing elements:', diffs, 'of', n);
