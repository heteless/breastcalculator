# 计划: 全面补全 `/bra-size-guide/{size}/` 尺码指南页面

## 1. 目标

为计算器(以及 sister-size comparator)输出后用户点击「Find your fit」跳转到的目标页面,补全所有需要的尺码指南文章,确保**任何用户计算结果都能落到一个内容完整、外观一致、可读性强的尺码指南页**。

## 2. 覆盖范围 (用户确认)

- **底围范围**: Bands 28, 30, 32, 34, 36, 38, 40, 42, 44 (9 个)
- **罩杯范围**: AA, A, B, C, D, DD, DDD, G (8 个)
- **总组合**: 9 × 8 = **72 个尺码**
- **现有页面**: 22 个 (32-40 范围的部分 A-DD)
- **需要新建**: **51 个尺码页面**
- **内容深度**: Full article,完全复制 38C 模板结构(7 大段 + FAQ + Schema LD+JSON)
- **额外要求**: 字体格局一致,形式美观,完整度高,可读性强,文章 AI 味不大

### 2.1 待新建 51 个尺码清单

| 底围 | 已存在 | 待新建 |
|------|--------|--------|
| 28 | (无) | 28AA, 28A, 28B, 28C, 28D, 28DD, 28DDD, 28G (8) |
| 30 | (无) | 30AA, 30A, 30B, 30C, 30D, 30DD, 30DDD, 30G (8) |
| 32 | 32A, 32B, 32C, 32D, 32DD | 32AA, 32DDD, 32G (3) |
| 34 | 34A, 34B, 34C, 34D, 34DD | 34AA, 34DDD, 34G (3) |
| 36 | 36A, 36B, 36C, 36D, 36DD | 36AA, 36DDD, 36G (3) |
| 38 | 38B, 38C, 38D, 38DD | 38AA, 38A, 38DDD, 38G (4) |
| 40 | 40C, 40D | 40AA, 40A, 40B, 40DD, 40DDD, 40G (6) |
| 42 | (无) | 42AA, 42A, 42B, 42C, 42D, 42DD, 42DDD, 42G (8) |
| 44 | (无) | 44AA, 44A, 44B, 44C, 44D, 44DD, 44DDD, 44G (8) |

合计: 8+8+3+3+3+4+6+8+8 = **51 个新页面**

## 3. 当前状态分析

### 3.1 现有页面结构 (以 38C 为蓝本)

每页 7 大段:
1. **Size Guide Header** — H1 + 简介
2. **At a Glance** — Measurements 表 + Sister Sizes 表
3. **What Does It Look Like** — Image placeholder + 视觉描述
4. **Best Bra Styles** — 3 style 卡 + 3 Editor-Tested 品牌卡
5. **Tips for Wearing** — 6 条使用建议
6. **Compare with Other Sizes** — 4 张对比卡
7. **Related Resources** — 资源卡

附加:
- 3 条 FAQ
- FAQPage JSON-LD Schema
- BreadcrumbList JSON-LD Schema
- Article JSON-LD Schema
- 完整 nav + drawer + footer

### 3.2 关键技术约束 (来自 project memory)

- GA4 必带 (Measurement ID `G-5SB8FNFYDV`) + Consent Mode v2
- 所有 `<table>` 必须包 `<div class="table-wrap">`
- `body > main` 必带 `max-w-4xl mx-auto px-4 md:px-6 w-full overflow-hidden`
- HTML/body `overflow-x: hidden`
- main.css 版本号需更新
- 目录路径必须以 `/` 开头,带尾斜杠
- 站内链接必须用绝对路径
- 每页要保持与 `38c/index.html` 完全一致的 layout/nav/footer/Schema

### 3.3 计算器尺寸公式 (`bra-calculator.js`)

- 底围公式: `band = round(ub) → 偶数`,clamp 到 28-72
- 罩杯公式: `cup = diff = bust - band` (差 1=A, 2=B, 3=C, 4=D, 5=DD, 6=DDD, 7=G, ...)
- 体积数据: `CUP_VOLUME_ML[cup]` (AA=110, A=175, B=270, C=380, D=510, DD=660, DDD=820, G=990)
- URL 模式: `/bra-size-guide/{band}{cup}/` (cup 小写, e.g. `38c/`, `40ddd/`)

### 3.4 现有 `_redirects` Section 8 规则需要清理

当前:
- 28a, 28b, 28c, 28d, 28dd → 32a/b/c/d/dd
- 30a, 30b, 30c, 30d, 30dd → 32a/b/c/d/dd
- 38a → 38b
- 40a → 40c, 40b → 40c
- 40dd → 40d, 40ddd → 40d

**新建 51 页后**: 这些 redirect 规则要相应移除(否则会盖掉新页面),只保留那些没有真实页面的边界尺码 (如 28aaaa, 44G 等超出 28-44 范围的)。

## 4. 实施方案

### 4.1 核心: 创建生成器脚本 `scripts/gen-size-page.js`

**输入参数**: `band` (int), `cup` (str, e.g. "AA"/"A"/"DDD"/"G")
**输出**: `bra-size-guide/{band}{cup_toLower()}/index.html`

**生成逻辑**:
1. 读取 `bra-size-guide/38c/index.html` 作为模板
2. 替换所有 size-specific 占位符:
   - `{BAND}` → 28, 30, 32, ..., 44
   - `{CUPUP}` → "AA"/"A"/"B"/"C"/"D"/"DD"/"DDD"/"G" (大写, 用于显示)
   - `{CUPLOW}` → "aa"/"a"/"b"/"c"/"d"/"dd"/"ddd"/"g" (小写, 用于 URL)
   - `{SLUG}` → "28aa"/"30a"/"32b"/.../"44g" (URL 段)
3. 替换所有需要按 size 计算的字段:
   - Underbust: `{band}" ({band*2.54} cm)`
   - Bust: `{band + cup_diff}"`
   - Cup Volume: `CUP_VOLUME_ML[cup] mL`
   - Category: 基于 band+cup 查表 (petite/slim/average/curvy/full-bust/plus-size)
   - Sister Sizes: 自动计算 (`band±2` × `cup_index±1`)

### 4.2 数据驱动的内容生成 (避免 AI 味)

为每个 size 生成**独特的** (而非机械套模板) 内容,使用 lookup tables:

| 字段 | 来源 |
|------|------|
| **At a Glance 描述** | 10 种模板,按 band-cup 区域分布 |
| **"What does it look like" 视觉描述** | 按 cup volume 分段 (small < 300ml, medium 300-500, large 500-800, full 800+) |
| **最佳 bra styles** | 按 size category 选 3 种 (T-shirt / Plunge / Wireless / Full-coverage / Push-up / Sports / Bralette / etc.) |
| **Editor-Tested 推荐品牌** | 按 size 类别 (petite → Aerie/True&Co; standard → ThirdLove/VS; full-bust → Elomi/Goddess/Curvy Kate; plus-size → Lane Bryant/Goddess; etc.) |
| **Tips 6 条** | 从 30 条 tip pool 按 size 抽 6 条,排序后输出 |
| **FAQ 3 条** | 通用 FAQ + 2 条 size-specific 变体 |
| **Compare 链接** | 自动选 4 个最相关比较 (上/下一个 cup, 上/下一个 band) |

### 4.3 视觉/排版一致性

- 复用 38C 的所有 CSS class (`size-guide-header`, `guide-section`, `guide-grid`, `guide-card`, `rec-card`, `card-grid`, `placeholder-img`, `data-table`, `table-wrap`)
- 复用 38C 的所有 HTML 语义结构
- 字体、字号、颜色 (CSS variables `--font-serif`, `--font-sans`) 由 `main.css` 全局控制 — 不在页面内硬编码
- 所有图片占位符用 `[Image Placeholder: ...]` 文本,与 38C 一致
- 不在 HTML 内嵌入 `<style>`,只使用 main.css 全局类

### 4.4 关键生成函数

```js
// 数据表 (统一管理,保证一致性)
const SIZE_CATEGORY = {
  '28AA': 'petite', '28A': 'petite', ...
  '34B': 'average', '34C': 'average', ...
  '40DDD': 'plus-size', '40G': 'plus-size', ...
};

const VISUAL_DESC = {
  'small':    'Subtle, natural. The bust blends smoothly...',
  'medium':   'Noticeable but balanced. The bust adds visible...',
  'large':    'Full and present. The bust projects noticeably...',
  'full':     'Generous projection. Wide-set wires recommended...',
  'very-full':'Maximum volume. Full-coverage engineering required...'
};

const BRA_STYLES = {
  'petite':    ['T-Shirt Bra', 'Bralette', 'Wireless Bra'],
  'average':   ['T-Shirt Bra', 'Plunge Bra', 'Wireless Bra'],
  'curvy':     ['T-Shirt Bra', 'Plunge Bra', 'Full-Coverage'],
  'full-bust': ['Full-Coverage', 'Side-Support', 'Underwire'],
  'plus-size': ['Full-Coverage', 'Wireless Support', 'Posture Bra']
};

const BRAND_RECOS = {
  'petite':    ['Aerie Sunnie Wireless', 'True & Co Lift Scoop', 'Negative Underwear'],
  'average':   ['ThirdLove Form Fit', 'Natori Feathers', 'Wacoal Basic Contour'],
  'curvy':     ['Elomi Cate', 'Panache Envy', 'Curvy Kate Daily Boost'],
  'full-bust': ['Elomi Cate Full-Coverage', 'Goddess Keira', 'Freya Starlight'],
  'plus-size': ['Lane Bryant Bliss', 'Goddess Adelaide', 'Elomi Amelia']
};

const TIPS_POOL = [
  'Get professionally fitted at least once a year...',
  'If you are between sizes, choose the option that feels most comfortable...',
  'Replace bras every 6–12 months...',
  ...
];  // 30 条,按 hash(size) 选 6 条
```

## 5. 实施步骤

### Step 1: 创建生成器脚本 (核心)
- 新建 `scripts/gen-size-page.js`
- 编写 SIZE_CATEGORY / VISUAL_DESC / BRA_STYLES / BRAND_RECOS / TIPS_POOL 数据
- 编写 51 个尺码的渲染函数
- 测试单个 size (e.g. 28AA),输出比对 38C 的样式/结构一致性

### Step 2: 批量生成 51 个尺码页面
- 循环 9 bands × 8 cups = 72 个,跳过已存在的 22 个
- 输出到 `bra-size-guide/{slug}/index.html`
- 每个文件用 fs.writeFileSync

### Step 3: 清理 _redirects
- 移除那些现在已有真实页面的旧 redirect (e.g. `/bra-size-guide/28a/` 现在有真实页面,删除 redirect)
- 保留 AA, AAA, DDDD, H+ 等超出 28-44/AA-G 范围的 redirect

### Step 4: 更新 hub index
- 检查 `bra-size-guide/index.html` 列表,移除不存在的旧 redirect 目标,确保所有列出的链接都有真实页面
- 添加新页面到 index (如 28AA, 30G, 44DDD)

### Step 5: 更新 sitemap.xml
- 运行 `scripts/generate-sitemap.js`,把 51 个新 URL 纳入

### Step 6: 验证
- 用 dev-server.js 启动本地服务
- 用 Chrome DevTools MCP 访问每个新页面,截图验证:
  - 28AA, 28G (边角小尺寸)
  - 32AAA, 32G (32 范围扩展)
  - 38AA, 38G (38 范围扩展)
  - 44A, 44G (大底围)
- 确认:
  - 字体/排版与 38C 一致
  - 数据正确 (sister sizes, measurements)
  - 内部链接无 404
  - Schema JSON-LD 完整
- 运行 `node scripts/test-render-html.js` 验证渲染

### Step 7: 收尾
- 提交到 Cloudflare Pages 部署
- 通过 IndexNow 推送新 URL
- 更新 project memory (添加新生成的尺码)

## 6. 关键文件

| 路径 | 作用 |
|------|------|
| `scripts/gen-size-page.js` | 新建 — 尺码页面生成器 |
| `bra-size-guide/38c/index.html` | 蓝本,作为模板 |
| `bra-size-guide/{slug}/index.html` | 51 个新页面输出 |
| `_redirects` | 清理 Section 8 中已可被新页面替代的 redirect |
| `bra-size-guide/index.html` | 更新 hub 列表 |
| `sitemap.xml` | 重新生成 |

## 7. 假设与决策

1. **复用 38C 模板**: 不重新设计,确保视觉 100% 一致
2. **数据驱动文案**: 用 lookup tables 避免重复内容,保持"低 AI 味"
3. **CSS 复用**: 不在页面内嵌入任何 style,完全依赖 main.css 全局类
4. **图片占位符**: 沿用 38C 的 `[Image Placeholder: ...]` 文本,后续可批量替换
5. **不修改 hub 现有文案**: 只增删链接列表项
6. **URL 命名沿用现有**: `{band}{cup_toLower()}/` (例如 `40g/`, `38aaa/`, `44ddd/`)
7. **范围之外 (cup H+ / band 46+ / 26 / 24 / AA- / AAA)**: 继续走 `_redirects`,不创建真实页面

## 8. 验证

- `node scripts/test-render-html.js` 通过
- `node scripts/test-sister-comparator.js` 通过 (与现有测试解耦,但确保不影响)
- 51 个新页面 + 22 个旧页面 = 73 个尺码页全部可访问
- 5 个抽样页面 Chrome 截图无视觉异常
- 所有 sister size 内部链接无 404
- Schema JSON-LD 在 Google Rich Results Test 有效
- 部署到 Cloudflare Pages 后,IndexNow 推送成功
