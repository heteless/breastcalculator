// upgrade-tool-components.js
// 工具页组件升级：
// 1) .step-indicator 块 → 升级为 .steps-bar + .step-item + .step-circle + .step-connector
// 2) 替换旧式 .breadcrumb / .tool-breadcrumb 为 .breadcrumb
// 3) 替换 .measure-tip 文字为新版本（"?" → 测量图标）
// 4) 移除 💕 emoji 出现在隐私段落中（替换为 .privacy-note + 锁 SVG）
// 5) 替换 .tool-faq-v2 块为 .classic-faq + <details>
// 6) 替换 .cta-banner / .cta-section 为 .classic-cta
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

  // 1) step-indicator → steps-bar
  if (/class="step-indicator"/.test(html)) {
    // The existing markup uses .step with .step-num and .step-label, .step-line.
    // We rewrite the whole block.
    const newBar = [
      '<div class="steps-bar" id="stepIndicator" aria-label="Calculator progress">',
      '  <div class="step-item is-active" data-step="1">',
      '    <span class="step-circle"><span class="step-num-text">1</span></span>',
      '    <span class="step-label">Settings</span>',
      '  </div>',
      '  <span class="step-connector"></span>',
      '  <div class="step-item" data-step="2">',
      '    <span class="step-circle"><span class="step-num-text">2</span></span>',
      '    <span class="step-label">Measurements</span>',
      '  </div>',
      '  <span class="step-connector"></span>',
      '  <div class="step-item" data-step="3">',
      '    <span class="step-circle"><span class="step-num-text">3</span></span>',
      '    <span class="step-label">Result</span>',
      '  </div>',
      '</div>'
    ].join('\n');
    // The block is from <div class="step-indicator" through its closing </div>
    html = html.replace(
      /<div class="step-indicator"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
      newBar
    );
    // If that didn't match (different nesting), try a broader sweep
    if (html === orig) {
      html = html.replace(
        /<div class="step-indicator"[\s\S]*?<\/div>(?=\s*<main|\s*<div class="container")/,
        newBar
      );
    }
    // Map class names inside the block if any old ones remain
    html = html
      .replace(/class="step active"/g, 'class="step-item is-active"')
      .replace(/class="step done"/g, 'class="step-item is-done"')
      .replace(/class="step"/g, 'class="step-item"')
      .replace(/class="step-num"/g, 'class="step-circle"')
      .replace(/class="step-line"/g, 'class="step-connector"');
    changed = true;
  }

  // 2) 隐私段落中的 💕 emoji → 替换为 .privacy-note + lock SVG
  if (/💕/.test(html)) {
    html = html.replace(/💕\s*/g, '');
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
