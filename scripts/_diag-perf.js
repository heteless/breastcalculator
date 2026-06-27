import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'node:fs'; // fallback if needed

// 使用简单的递归 glob 实现
function walk(dir, ext) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, ext));
    else if (e.name.endsWith(ext)) out.push(p);
  }
  return out;
}

const htmlFiles = walk('.', '.html').filter(f => !f.startsWith('dist') && !f.startsWith('node_modules') && !f.startsWith('.git'));
console.log('=== HTML files count:', htmlFiles.length, '===');

// CSS 加载模式分析
const cssPatterns = new Map();
const scriptPatterns = new Map();
for (const f of htmlFiles) {
  const h = fs.readFileSync(f, 'utf8');
  // <link ... stylesheet ...>
  const cssMatches = h.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/g) || [];
  for (const m of cssMatches) {
    const key = m.replace(/href=[^>\s]*/, 'href=...');
    cssPatterns.set(key, (cssPatterns.get(key) || 0) + 1);
  }
  // <script src=...>
  const scriptMatches = h.match(/<script[^>]*src=[^>]*>/g) || [];
  for (const m of scriptMatches) {
    scriptPatterns.set(m, (scriptPatterns.get(m) || 0) + 1);
  }
}

console.log('\n=== CSS <link> patterns ===');
for (const [k, v] of cssPatterns) console.log(v.toString().padStart(4), k);

console.log('\n=== <script src> patterns ===');
for (const [k, v] of scriptPatterns) console.log(v.toString().padStart(4), k);

// script.js forced reflow 检查
console.log('\n=== script.js analysis ===');
const jsFiles = ['script.js', 'assets/js/script.js'];
for (const jf of jsFiles) {
  try {
    const j = fs.readFileSync(jf, 'utf8');
    const sizeKB = (j.length / 1024).toFixed(1);
    console.log(jf, '(' + sizeKB + ' KB)');
    // 查询几何属性的代码
    const geomProps = ['offsetWidth', 'offsetHeight', 'clientWidth', 'clientHeight', 'getBoundingClientRect', 'scrollTop', 'scrollLeft', 'scrollWidth', 'scrollHeight'];
    for (const g of geomProps) {
      const count = (j.match(new RegExp(g, 'g')) || []).length;
      if (count > 0) console.log('  ' + g + ':', count);
    }
    // 循环中的样式修改
    const styleWrites = (j.match(/\.style\./g) || []).length;
    console.log('  .style. writes:', styleWrites);
    // requestAnimationFrame 使用情况
    const raf = (j.match(/requestAnimationFrame/g) || []).length;
    console.log('  requestAnimationFrame:', raf);
  } catch (e) {
    console.log(jf, 'NOT FOUND');
  }
}
