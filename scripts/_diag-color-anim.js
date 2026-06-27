import fs from 'node:fs';
const c = fs.readFileSync('style.css', 'utf8');

console.log('=== #8b7355 usage ===');
const matches = [...c.matchAll(/#8b7355/gi)];
matches.forEach(m => {
  // 找到包围这个颜色的规则
  const start = m.index;
  // 向前找最近的 {
  const brace = c.lastIndexOf('{', start);
  // 向后找最近的 }
  const close = c.indexOf('}', start);
  const selStart = c.lastIndexOf('}', brace);
  const rule = c.substring(Math.max(0, selStart + 1), brace).trim();
  const body = c.substring(brace + 1, close).trim();
  console.log('  Selector:', rule);
  console.log('  Body:', body);
  console.log('');
});

console.log('=== script.js forced reflow ===');
const j = fs.readFileSync('script.js', 'utf8');
// 找到 offsetWidth 上下文
const offIdx = j.indexOf('offsetWidth');
if (offIdx !== -1) {
  console.log('--- offsetWidth context ---');
  console.log(j.substring(Math.max(0, offIdx - 300), offIdx + 300));
}
const scrollIdx = j.indexOf('scrollTop');
if (scrollIdx !== -1) {
  console.log('\n--- scrollTop context ---');
  console.log(j.substring(Math.max(0, scrollIdx - 300), scrollIdx + 300));
}

// .style. writes 上下文
console.log('\n=== .style. write contexts ===');
const styleMatches = [...j.matchAll(/\.style\.[a-zA-Z]+=[^;\n]+/g)];
styleMatches.slice(0, 20).forEach((m, i) => {
  console.log(`[${i+1}]`, m[0]);
});
