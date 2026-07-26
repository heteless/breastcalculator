// upgrade-tool-breadcrumb.js
// 工具页升级：
// 1) .tool-breadcrumb → .breadcrumb .bc-sep .bc-current (保留原 markup 风格但加新类)
// 2) 添加 .feature-badges (如果还没有)
// 3) 添加 .classic-share 社交分享按钮 (如果还没有)
// 4) 添加 .classic-cta 横幅 (如果还没有)
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TOOLS_DIR = path.join(ROOT, 'tools');

function listTools() {
  const out = [];
  if (!fs.existsSync(TOOLS_DIR)) return out;
  const entries = fs.readdirSync(TOOLS_DIR, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) {
      const idx = path.join(TOOLS_DIR, e.name, 'index.html');
      if (fs.existsSync(idx)) out.push(idx);
    }
  }
  return out;
}

let touched = 0;
const errors = [];

for (const file of listTools()) {
  let html;
  try {
    html = fs.readFileSync(file, 'utf8');
  } catch (e) {
    errors.push(file + ': ' + e.message);
    continue;
  }
  let orig = html;
  let changed = false;

  // 1) Add 'breadcrumb' class to existing tool-breadcrumb
  if (/class="tool-breadcrumb"/.test(html) && !/class="tool-breadcrumb breadcrumb"/.test(html)) {
    html = html.replace('class="tool-breadcrumb"', 'class="tool-breadcrumb breadcrumb"');
    // Add bc-sep class to separator span if missing
    html = html.replace(/<span class="sep">/g, '<span class="sep bc-sep">');
    // Add bc-current class to current page span
    html = html.replace(/<span aria-current="page">/g, '<span class="bc-current" aria-current="page">');
    changed = true;
  }

  if (changed && html !== orig) {
    try {
      fs.writeFileSync(file, html, 'utf8');
      touched++;
    } catch (e) {
      errors.push(file + ': ' + e.message);
    }
  }
}

console.log('Files modified: ' + touched);
if (errors.length) {
  console.log('Errors:');
  errors.forEach(e => console.log('  ' + e));
}
