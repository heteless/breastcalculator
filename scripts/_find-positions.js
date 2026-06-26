const fs = require('fs');
const s = fs.readFileSync('style.css', 'utf8');

// Find the exact desktop nav-categories rule
const i1 = s.indexOf('.nav-categories{display:flex;align-items:stretch;justify-content:center;gap:0;width:100%}}');
console.log('=== desktop nav-categories at', i1, '===');
if (i1 >= 0) console.log(s.substring(i1 - 50, i1 + 200));

// Find tool-hero text-align:center
const i2 = s.indexOf('.tool-hero{background:linear-gradient');
console.log('\n=== .tool-hero block at', i2, '===');
if (i2 >= 0) console.log(s.substring(i2, i2 + 400));

// Find article-hero block
const i3 = s.indexOf('.article-hero{');
console.log('\n=== .article-hero block at', i3, '===');
if (i3 >= 0) console.log(s.substring(i3, i3 + 300));

// Find footnotes-section
const i4 = s.indexOf('.footnotes-section{max-width:780px');
console.log('\n=== .footnotes-section at', i4, '===');
if (i4 >= 0) console.log(s.substring(i4, i4 + 200));

// Find footnotes-list li
const i5 = s.indexOf('.footnotes-list li{');
console.log('\n=== .footnotes-list li at', i5, '===');
if (i5 >= 0) console.log(s.substring(i5, i5 + 300));

// Find end of specials-sub block (to append new rules)
const i6 = s.indexOf('.specials-sub a:hover{color:var(--heading-warm)}');
console.log('\n=== .specials-sub a:hover at', i6, '===');
if (i6 >= 0) console.log(s.substring(i6, i6 + 100));
