# 姐妹尺码展示模块优化 Spec

## Why
当前姐妹尺码比较器 (Sister Size Comparator) 已具备基础展示能力(空态+5 张姐妹卡+汇总),但仍存在以下不足:
1. **空态吸引力不足**:虽然有 "Preview with 34C" 按钮,但用户首次进入时缺乏引导感,5 张预览卡只是静态文本,没有视觉冲击力
2. **激活态信息密度有限**:每张卡仅显示尺码+体积+底围,缺少与品牌、与用户身材、与购买建议的关联
3. **互动层次单一**:仅"点击切换中心"一种交互,缺少 hover 详情、对比模式、保存/分享等深度交互
4. **缺少度量与可视化**:没有转化漏斗(从空态 → 计算 → 比较 → 切换 → 进入购买引导),无 GA4 事件追踪,无法验证模块的实际效果
5. **响应式仍有提升空间**:541-820px 区间勉强,540px 以下切换为单列后信息密度骤降

本规格在不破坏现有重构成果的基础上,系统化地把这块模块做成"高吸引力 + 高转化"的旗舰模块。

## What Changes
- [ ] 优化空态 (Awaiting) 视觉:5 张预览卡升级为带 SVG 缩略图+浮动动画的微缩姐妹卡,横向更显紧凑
- [ ] 激活态卡片增加:体脂比例参考、品牌建议 emoji(±一档更舒适)、罩杯深度(深/中/浅)、换算成 UK/EU 副标签
- [ ] 新增"对比模式" (Compare Toggle):点击两张姐妹卡,顶部弹出"为什么选 A vs B"对比卡
- [ ] 新增"换算条" (Conversion Ribbon):5 张卡上方一条半透明色带,标出 US→UK→EU→FR→AU 5 个区域尺码
- [ ] 新增"行动召唤" (Action Bar):姐妹卡下方显示"找这款文胸 →"按钮,根据主尺码跳到尺码详情页
- [ ] 修复/精炼:中间卡 (YOU) 顶部加动态指针 (旋转 360° 一次),突出"这是你的尺码"
- [ ] GA4 事件追踪:空态预览点击 / 卡点击切换 / 汇总区查看 / 行动按钮点击,共 4 类事件
- [ ] 响应式:380-540px 区间新增 2×3 网格 + 1 中心卡的优雅降级,小于 380px 才退化为单列
- [ ] 减弱 SVG 大小变化,统一为"宽度按 band 缩放,高度按 cup 缩放"的拟真公式,确保 A-H 杯都看起来成比例
- [ ] 颜色统一:中间卡用 #8b4a3a 主色 + 玫瑰金渐变,姐妹卡用 #c89890 暖驼,扩展卡用 #c8b8a8 浅驼,符合"杂志级"美学

## Impact
- Affected specs: 文胸尺码计算器核心 (`BC.getSisterSizes`)、首页仪表板 (`index.html` 中的 #bc-history-frame)
- Affected code:
  - `assets/bra-calculator-main.js` — `renderSisterComparator / buildSisterCardHtml / renderSisterSummary / switchSisterPrimary / previewSisterDemo` 全链路
  - `assets/global-layout.css` — `.bc-compass-*` 全部样式 + 新增的 conversion ribbon / compare overlay / action bar
  - `assets/bra-calculator.js` — 可能新增 `getSisterSizeConversion(band, cup, region)` 用于副标签
  - `index.html` — 模板中 #bc-compass-awaiting / #bc-compass-instrument 结构调整
  - `scripts/test-sister-comparator.js` — 新增对比/换算事件测试用例
  - `scripts/build-dist.js` — 构建脚本无须变更(沿用现有 CSS 合并 + 缓存破坏)

## ADDED Requirements

### Requirement: 增强空态预览
系统 SHALL 在用户未计算前,展示带 5 张浮动微缩姐妹卡的预览面板,每张卡含 SVG 缩略图(按 band 缩放宽度、按 cup 缩放高度)、尺码文本、与中心距离的角色标签 (YOU / SISTER / EXTENDED)。

#### Scenario: 用户首次访问
- **WHEN** 用户进入页面且未触发计算
- **THEN** 显示"Awaiting your US size"标题 + "Preview with 34C"按钮 + 5 张浮动微缩卡(中间最大、两侧渐小)
- **THEN** 5 张卡整体呼吸浮动,周期 3.2s,每张延迟 0.6s,形成"心跳"感

#### Scenario: 用户点击 Preview
- **WHEN** 用户点击 "Preview with 34C" 按钮
- **THEN** 触发 GA4 事件 `bc_sister_preview_click`
- **THEN** 隐藏空态容器,显示带 5 张完整 SVG 姐妹卡的激活态
- **THEN** 自动滚动到比较器中心位置,平滑动效 600ms

### Requirement: 丰富激活态卡片
系统 SHALL 在每张姐妹卡内显示:尺码主标签(34C)、角色 (YOU/SISTER/EXTENDED)、品牌副标签 (32D = 32D US · 32D UK · 75D EU)、体积 (mL)、底围 (cm)、投影 (cm)、微缩 SVG。

#### Scenario: 用户查看 YOU 卡
- **WHEN** 中间卡 (primary=true) 渲染
- **THEN** 顶部显示 360° 旋转一次的指针装饰(动画 1.2s,触发一次)
- **THEN** 尺码字体 3.2rem,渐变 #8b4a3a → #d68b6c → #f5d4b0
- **THEN** 显示 US/UK/EU 三标签,UK/EU 用浅色边框包裹

#### Scenario: 用户查看 SISTER 卡
- **WHEN** 相邻两张 sister 卡渲染
- **THEN** 尺码字体 2.2rem,色 #5a4035
- **THEN** 鼠标悬停时,卡片上浮 3px,边框变 #b87a5a,触发 GA4 事件 `bc_sister_card_hover` (单次,debounce 200ms)

#### Scenario: 用户查看 EXTENDED 卡
- **WHEN** 最外侧两张 extended 卡渲染
- **THEN** 整体 opacity 0.85,字色 #a89588
- **THEN** 标注"comfort: ±1 cup"的辅助说明文字

### Requirement: 对比模式
系统 SHALL 允许用户同时选中 2 张姐妹卡(最多 2 张),激活对比模式,顶部弹出对比卡显示"Band diff / Volume diff / Fit feel / Recommendation"。

#### Scenario: 用户选择 2 张卡对比
- **WHEN** 用户第 1 次点击某张姐妹卡上的 ✓ 标记(或长按 500ms)
- **THEN** 该卡右上角出现 ✓ 标记
- **WHEN** 用户第 2 次选择另一张卡
- **THEN** 触发 GA4 事件 `bc_sister_compare_start`
- **THEN** 顶部弹出对比卡,显示 Band diff / Volume diff / Recommendation 三行

#### Scenario: 用户取消对比
- **WHEN** 用户再次点击 ✓ 标记
- **THEN** 移除 ✓ 标记,对比卡滑出
- **THEN** 触发 GA4 事件 `bc_sister_compare_cancel`

### Requirement: 区域换算条
系统 SHALL 在 5 张姐妹卡正上方显示一条半透明换算条,横向贯穿,标注 5 个区域 (US · UK · EU · FR/BE · AU) 的对应尺码。

#### Scenario: 渲染换算条
- **WHEN** 5 张姐妹卡首次渲染
- **THEN** 上方 28px 高的色带,左→右色阶 #8b4a3a → #d68b6c → #c89890,顶端 1px 渐变线
- **THEN** 色带下方 5 个区域标签,字间距 0.32em,字号 0.55rem,色 #a89588

### Requirement: 行动召唤按钮
系统 SHALL 在汇总区下方显示"Find your fit →"主按钮 + "Save my size"副按钮。

#### Scenario: 用户点击 Find your fit
- **WHEN** 用户点击主按钮
- **THEN** 触发 GA4 事件 `bc_sister_cta_findfit`
- **THEN** 跳转到 `/bra-size-guide/<band><cup>/` (例如 `/bra-size-guide/34c/`)

#### Scenario: 用户点击 Save my size
- **WHEN** 用户点击副按钮
- **THEN** 触发 GA4 事件 `bc_sister_cta_save`
- **THEN** 调用 navigator.clipboard.writeText 复制主尺码
- **THEN** 显示 toast "Copied 34C to clipboard"

### Requirement: GA4 事件追踪
系统 SHALL 通过现有 gtag.js 发送以下事件,确保事件名 / 参数 / 时机一致。

#### Scenario: 事件字典
- `bc_sister_preview_click` — 空态预览按钮点击
- `bc_sister_card_click` — 姐妹卡点击切换中心,参数 `band` + `cup` + `role`
- `bc_sister_card_hover` — 姐妹卡 hover(单次,debounce 200ms),参数同上
- `bc_sister_compare_start` — 对比模式激活
- `bc_sister_compare_cancel` — 对比模式取消
- `bc_sister_cta_findfit` — Find your fit 按钮
- `bc_sister_cta_save` — Save my size 按钮
- `bc_sister_section_view` — 整个模块进入视口(IntersectionObserver,曝光一次)

### Requirement: 响应式降级
系统 SHALL 在不同断点下保持视觉一致与可读性。

#### Scenario: 平板 (541-820px)
- **WHEN** viewport 处于 541-820px
- **THEN** 5 列保持,font-size 1.6rem / 2.2rem (YOU),cup 高度 90px / 115px

#### Scenario: 大屏窄端 (380-540px)
- **WHEN** viewport 处于 380-540px
- **THEN** 5 列保持但 gap 缩到 4px,font 1.2rem / 1.6rem,换算条字号 0.5rem

#### Scenario: 极窄 (<380px)
- **WHEN** viewport < 380px
- **THEN** 退化为 5 行单列,每行 grid-template-columns 1fr 1.4fr 1fr,cup 高度 50px / 60px

## MODIFIED Requirements

### Requirement: 已有 SVG 缩放公式
原 `makeBraLineSvg` 在 `assets/bra-calculator-main.js` 中,band 仅影响宽度、cup 仅影响顶 Y,导致某些组合(如 30DD vs 34C)形状比例不够明显。
**改为**:band → 宽度系数 (0.65-1.0),cup → 高度系数 (0.55-1.25),并按公式 `height = baseH * cupCoef` 渲染,确保 A 杯最矮、H 杯最高。

### Requirement: 已有事件 `bc_sister_card_click`
原 `bc_sister_card_click` 事件已存在但未带参数。
**改为**:参数增加 `role` 字段 (you/sister/extended),`band` 字符串,`cup` 字符串。

### Requirement: 已有 CSS `.bc-compass-sister-you` 阴影
原阴影仅 0 6px 22px -10px,偏静态。
**改为**:增加 `0 0 0 0 rgba(184, 122, 90, 0)` 进入脉冲 `@keyframes bcCompassYouPulse` 3.6s,放大中心卡呼吸感。

## REMOVED Requirements

### Requirement: 旧版 `makeCupSvg`
**Reason**: 老旧 SVG 渲染函数,样式已被 `makeBraLineSvg` 取代,无人调用。
**Migration**: 保留函数定义但标注 `@deprecated`,防止误用;后续清理版本可彻底删除。
