// 判断：移除 Tailwind Play CDN 后，站点是否会丢失样式？
// 方法：把全站 HTML/JS 里用到的 class 与构建产物 CSS 里定义的 class 做覆盖率比对。
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP = /(^|[\\/])(node_modules|_dbg|dist|dist-dryrun|\.git|\.backup|\.next-dev-server|reports|screenshots)([\\/]|$)/;

function walk(dir, ext, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.test(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, ext, acc);
    else if (ext.some((x) => e.name.endsWith(x))) acc.push(p);
  }
  return acc;
}

// 1) 构建产物 CSS 中已定义的 class
const cssFiles = walk(ROOT, ['.css']).filter((f) => !SKIP.test(f));
const defined = new Set();
for (const f of cssFiles) {
  const css = fs.readFileSync(f, 'utf8');
  for (const m of css.matchAll(/\.((?:[a-zA-Z_][\w-]*|\\.)+)/g)) {
    defined.add(m[1].replace(/\\/g, ''));
  }
}
console.log(`[css] 扫描 ${cssFiles.length} 个 CSS 文件，定义 class ${defined.size} 个`);

// 2) 收集 HTML / JS 中使用的 class token
function tokensFrom(text) {
  const out = [];
  const push = (s) => String(s || '').split(/[\s"'`]+/).forEach((t) => t && out.push(t));
  for (const m of text.matchAll(/class\s*=\s*["'`]([^"'`]*)["'`]/g)) push(m[1]);
  for (const m of text.matchAll(/className\s*[:=]\s*["'`]([^"'`]*)["'`]/g)) push(m[1]);
  for (const m of text.matchAll(/classList\.(?:add|remove|toggle|contains)\(([^)]*)\)/g)) push(m[1].replace(/["'`]/g, ' '));
  for (const m of text.matchAll(/class:\s*["'`]([^"'`]*)["'`]/g)) push(m[1]);
  return out;
}

const htmlFiles = walk(ROOT, ['.html']).filter((f) => !SKIP.test(f));
const jsFiles = walk(ROOT, ['.js']).filter((f) => !SKIP.test(f));

const TAILWINDISH = /^(?:[a-z-]+:)*[a-z][\w-]*(?:-\[[^\]]+\]|-[\w./]+)?$/;
const looksTailwind = (t) =>
  TAILWINDISH.test(t) &&
  /(?:^|:)(?:flex|grid|block|inline|hidden|absolute|relative|fixed|sticky|static|container|sr-only|w-|h-|min-|max-|p[xytblr]?-|m[xytblr]?-|gap-|space-|text-|font-|leading-|tracking-|bg-|border|rounded|shadow|opacity|z-|top-|right-|bottom-|left-|inset-|overflow|object-|order-|items-|justify-|self-|content-|col-|row-|place-|aspect-|cursor-|select-|pointer-|transition|duration-|ease-|delay-|animate-|transform|scale-|rotate-|translate-|skew-|origin-|ring|divide-|from-|via-|to-|fill-|stroke-|whitespace-|break-|truncate|uppercase|lowercase|capitalize|italic|underline|line-|decoration-|antialiased|list-|align-|table|float-|clear-|isolate|mix-|blur|brightness|contrast|grayscale|invert|saturate|sepia|backdrop|will-change|snap-|touch-|resize|appearance|outline|accent-)/;

function report(label, files) {
  const used = new Set();
  for (const f of files) for (const t of tokensFrom(fs.readFileSync(f, 'utf8'))) used.add(t);
  const missing = [...used].filter((t) => !defined.has(t) && looksTailwind(t));
  console.log(`\n[${label}] 文件 ${files.length} 个，使用 class token ${used.size} 个`);
  console.log(`[${label}] 未在构建 CSS 中定义的（疑似 Tailwind 工具类）: ${missing.length}`);
  missing.sort().slice(0, 60).forEach((t) => console.log('    - ' + t));
  return { used, missing };
}

const h = report('HTML', htmlFiles);
const j = report('JS', jsFiles);

// 3) 交叉：JS 中用到但 HTML 中没有的 class —— 这些是构建时扫描不到的高风险项
const htmlUsed = h.used;
const jsOnly = j.missing.filter((t) => !htmlUsed.has(t));
console.log(`\n=== 仅出现在 JS 中且构建 CSS 未定义（CDN 移除后必定丢失）: ${jsOnly.length} ===`);
jsOnly.slice(0, 80).forEach((t) => console.log('    * ' + t));
