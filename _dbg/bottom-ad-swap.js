// bottom-ad-swap.js — 把页尾广告位换到新建的第三个广告单元
//
// 背景:全站 116 个页面此前把同一个单元 4196453734 用了两次
// (正文 .article-middle-ad + 页尾 .article-bottom-ad)。Google 明确不建议
// 同一页面重复使用同一单元代码,重复位常常拿不到好填充。
//
// 现用户在 AdSense 新建了第三个单元「Article Bottom - Responsive」:
//   slot 7091114344(data-ad-format="auto" + data-full-width-responsive="true",
//   与原页尾位配置完全一致,只是换了 slot)。
//
// 只替换 .article-bottom-ad 内部的 slot,正文位 .article-middle-ad 保持
// 4196453734 不变。替换后每个页面为 3789259624 + 4196453734 + 7091114344,
// 三者互不重复。
//
// 幂等:已换过的文件不再匹配,可重复执行。

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const NEW_SLOT = '7091114344';
const OLD_SLOT = '4196453734';

const SKIP = /(^|[\\/])(node_modules|dist|dist-dryrun|_dbg|\.git|\.wrangler|\.backup|reports|screenshots)([\\/]|$)/;

// 只改 .article-bottom-ad 里的那一个 slot
const RE = /(<div class="article-bottom-ad"[\s\S]*?data-ad-slot=")4196453734(")/g;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.well-known') continue;
    const p = path.join(dir, entry.name);
    const rel = path.relative(ROOT, p);
    if (SKIP.test(rel + (entry.isDirectory() ? '/' : ''))) continue;
    if (entry.isDirectory()) walk(p, out);
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
let changed = 0;
let skipped = 0;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  if (src.indexOf('class="article-bottom-ad"') === -1) continue;

  if (!RE.test(src)) {
    if (src.indexOf(NEW_SLOT) >= 0) { skipped++; continue; }
    console.log(`[bottom-swap] ${path.relative(ROOT, file).replace(/\\/g, '/')}  !! bottom ad has unexpected slot`);
    continue;
  }
  RE.lastIndex = 0;

  const out = src.replace(RE, (m, before, after) => before + NEW_SLOT + after);
  fs.writeFileSync(file, out, 'utf8');
  changed++;
}

console.log(`[bottom-swap] ${OLD_SLOT} -> ${NEW_SLOT}`);
console.log(`[bottom-swap] changed: ${changed}, already done: ${skipped}`);
