// tool-ad-restructure.js — 工具页广告位重构(一次性迁移脚本)
//
// 目标(用户已确认方案 A「首屏换横幅，in-article 下沉正文」):
//   1. 首屏:  把 in-article 大块(3789259624, AdSense 自适应约 334x299)
//            换成响应式横幅单元(4196453734, data-ad-format="horizontal"),
//            首屏广告变矮,计算器输入框回到首屏内。
//   2. 正文:  把 in-article 单元下沉到结果区之后、psb-bar(分享/收藏条)之前,
//            仍是高可视的正文广告位。
//   3. 页尾:  移除 .article-bottom-ad —— 它在工具页复用的正是 4196453734,
//            同一页面重复使用同一广告单元会拉低填充与单价,故删除。
//
// 结果:每个工具页仍为 2 个广告位(首屏横幅 + 正文 in-article),无重复单元。
//
// 幂等:重复执行不会叠加,已迁移的文件会被跳过。

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TOOLS = path.join(ROOT, 'tools');

const SLOT_BANNER = '4196453734';
const SLOT_IN_ARTICLE = '3789259624';
const CLIENT = 'ca-pub-7388117485013143';

// 首屏横幅(替换原 in-article 大块)
// 关键配置(实测得出):
//   - 不要 data-full-width-responsive="true":它让 AdSense 按【视口宽度】
//     渲染(390px)并给 1:1 的未填充方块,撑破 302px 的容器、越过容器边框,
//     破坏与计算器内容轨道的对齐,还把首个输入框顶到 893px。
//   - 用 data-ad-format="horizontal" 明确要横向 banner,AdSense 才会给矮槽位,
//     未填充时也不会变成大方块。
const BANNER_BLOCK = (indent) => `${indent}<!-- Top Banner Ad (horizontal banner, above the fold) -->
${indent}<div class="article-top-banner-ad">
${indent}  <ins class="adsbygoogle"
${indent}       style="display:block; text-align:center;"
${indent}       data-ad-client="${CLIENT}"
${indent}       data-ad-slot="${SLOT_BANNER}"
${indent}       data-ad-format="horizontal"></ins>
${indent}  <script>
${indent}       (adsbygoogle = window.adsbygoogle || []).push({});
${indent}  </script>
${indent}</div>`;

// 正文 in-article(下沉到 psb-bar 之前)
const MIDDLE_BLOCK = (indent) => `${indent}<!-- In-Article Ad (in-content, after results) -->
${indent}<div class="article-middle-ad" style="margin:36px auto;max-width:min(100%, 600px);padding:16px 20px;text-align:center;clear:both;background:var(--sand-light);border:1px solid var(--border);border-radius:var(--radius);min-height:120px;">
${indent}  <ins class="adsbygoogle"
${indent}       style="display:block; text-align:center;"
${indent}       data-ad-layout="in-article"
${indent}       data-ad-format="fluid"
${indent}       data-ad-client="${CLIENT}"
${indent}       data-ad-slot="${SLOT_IN_ARTICLE}"></ins>
${indent}  <script>
${indent}       (adsbygoogle = window.adsbygoogle || []).push({});
${indent}  </script>
${indent}</div>
`;

// 原首屏 in-article 大块(含注释) —— 整块替换为横幅
const RE_TOP = /[ \t]*<!-- In-Article Ad \(above the fold, above calculator form\) -->\r?\n[ \t]*<div class="article-in-ad"[\s\S]*?<\/script>\s*<\/div>/;

// 原页尾 auto 广告(含注释) —— 整块删除
const RE_BOTTOM = /\r?\n[ \t]*<!-- Bottom Ad \(auto \/ full-width responsive\) -->\r?\n[ \t]*<div class="article-bottom-ad"[\s\S]*?<\/script>\s*<\/div>/;

// psb-bar 之前插入正文 in-article
const RE_PSB = /^([ \t]*)<div class="psb-bar"/m;

const files = [];
for (const entry of fs.readdirSync(TOOLS, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const p = path.join(TOOLS, entry.name, 'index.html');
  if (fs.existsSync(p)) files.push(p);
}

let changed = 0;
let skipped = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  let src = fs.readFileSync(file, 'utf8');
  const before = src;
  const notes = [];

  if (src.indexOf('article-top-banner-ad') >= 0) {
    // 已迁移:只做修复 —— 前两轮配置错误(auto + full-width-responsive)
    const hasBleed = /data-ad-format="auto"\s*data-full-width-responsive="true"/.test(src);
    const hasHorizontal = /data-ad-format="horizontal"/.test(src);
    if (hasBleed) {
      src = src.replace(/data-ad-format="auto"(\s*)data-full-width-responsive="true"/, 'data-ad-format="horizontal"');
      fs.writeFileSync(file, src, 'utf8');
      changed++;
      console.log(`[tool-ads] ${rel.padEnd(46)} repair: auto+full-width -> horizontal`);
    } else if (!hasHorizontal) {
      console.log(`[tool-ads] ${rel.padEnd(46)} !! unexpected banner config`);
    } else {
      skipped++;
    }
    continue;
  }

  // 1) 首屏:in-article 大块 -> 横幅
  const mTop = src.match(RE_TOP);
  if (mTop) {
    const indent = (mTop[0].match(/^([ \t]*)/) || ['', '        '])[1];
    src = src.replace(RE_TOP, BANNER_BLOCK(indent));
    notes.push('top -> banner');
  } else {
    notes.push('!! top block not found');
  }

  // 2) 正文:psb-bar 之前插入 in-article
  const mPsb = src.match(RE_PSB);
  if (mPsb) {
    src = src.replace(RE_PSB, MIDDLE_BLOCK(mPsb[1]) + mPsb[0]);
    notes.push('middle ad inserted');
  } else {
    notes.push('!! psb-bar not found');
  }

  // 3) 页尾:删除 .article-bottom-ad
  if (RE_BOTTOM.test(src)) {
    src = src.replace(RE_BOTTOM, '');
    notes.push('bottom removed');
  } else {
    notes.push('!! bottom block not found');
  }

  if (src !== before) {
    fs.writeFileSync(file, src, 'utf8');
    changed++;
    console.log(`[tool-ads] ${rel.padEnd(46)} ${notes.join(', ')}`);
  }
}

console.log(`\n[tool-ads] changed: ${changed}, skipped (already migrated): ${skipped}`);
