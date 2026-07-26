# Tasks

- [x] Task 1: 优化空态预览 (Awaiting)
  - [x] SubTask 1.1: 在 `index.html` 中,5 张预览卡每张内嵌 60×70px SVG 缩略图(简化版 bra line)
  - [x] SubTask 1.2: 在 `assets/global-layout.css` 中,微缩卡新增 `.bc-compass-preview-mini` 样式 + 浮动动画 `@keyframes bcPreviewFloatMini` (周期 2.6s,幅度 -4px)
  - [x] SubTask 1.3: 在 `assets/bra-calculator-main.js` 中,`previewSisterDemo` 调用前先打 GA4 事件 `bc_sister_preview_click`
  - [x] SubTask 1.4: 验证:加载首页 → 看空态 5 张卡每张都带缩略图 → 浮动节奏明显

- [x] Task 2: 丰富激活态卡片内容
  - [x] SubTask 2.1: 在 `assets/bra-calculator.js` 中,新增 `getSisterSizeConversion(band, cup)` 返回 `{us, uk, eu, fr, au}` 5 个区域
  - [x] SubTask 2.2: 在 `assets/bra-calculator-main.js` 中,`buildSisterCardHtml` 接收 5 区域副标签,US/UK/EU 三个用细线 border 包裹
  - [x] SubTask 2.3: 在 `assets/global-layout.css` 中,新增 `.bc-compass-sister-conversion` / `.bc-compass-sister-region` 样式,字号 0.52rem,字距 0.18em
  - [x] SubTask 2.4: extended 卡新增"comfort ±1 cup"辅助文字 `.bc-compass-sister-comfort` 字号 0.58rem 斜体
  - [x] SubTask 2.5: 验证:点击 Preview → 5 张卡每张都有 US/UK/EU 三个副标签

- [x] Task 3: YOU 卡动态指针
  - [x] SubTask 3.1: 在 `makeBraLineSvg` 中,role==='you' 时,顶部指针新增 `<animateTransform>` 旋转 360° 一次性
  - [x] SubTask 3.2: 在 `assets/global-layout.css` 中,`.bc-compass-sister-you` 已有 `bcCompassYouPulse 3.6s` 保留并增强外圈光晕 (`box-shadow` 第二个值)
  - [x] SubTask 3.3: 验证:切换到不同主尺码,中间卡顶部指针旋转一次,1.2s 内完成

- [x] Task 4: 对比模式 (Compare)
  - [x] SubTask 4.1: 在 `buildSisterCardHtml` 中,非 primary 卡右上角新增 `<span class="bc-compass-sister-check" aria-label="Add to compare">` ✓ 图标
  - [x] SubTask 4.2: 在 `assets/global-layout.css` 中,`.bc-compass-sister-check` 默认 hidden,`.bc-compass-sister-checked .bc-compass-sister-check` 显示
  - [x] SubTask 4.3: 在 `bindSisterCardClicks` 中,绑定 click 切换 `.bc-compass-sister-checked` class,最多 2 张
  - [x] SubTask 4.4: 新增 `renderCompareOverlay()`,在 #bc-compass-instrument 顶部插入 `<div class="bc-compass-compare">`,显示 Band diff / Volume diff / Recommendation
  - [x] SubTask 4.5: 验证:点击两张 sister 卡 → 顶部弹出对比卡;再次点击 → 关闭

- [x] Task 5: 区域换算条 (Conversion Ribbon)
  - [x] SubTask 5.1: 在 `index.html` 中,#bc-compass-instrument 内新增 `<div class="bc-compass-conversion" id="bc-compass-conversion">` 容器
  - [x] SubTask 5.2: 在 `renderSisterComparator` 中,`renderConversionRibbon(sisters)` 渲染 5 个区域标签
  - [x] SubTask 5.3: 在 `assets/global-layout.css` 中,`.bc-compass-conversion` 横向 28px 高 + 渐变背景 + 5 个 `<span class="bc-compass-conversion-region">` 字号 0.55rem 字距 0.32em
  - [x] SubTask 5.4: 验证:5 张卡正上方有一条横向换算条,显示 US · UK · EU · FR · AU

- [x] Task 6: 行动召唤 (Action Bar)
  - [x] SubTask 6.1: 在 `renderSisterSummary` 中,汇总卡下方新增 `<div class="bc-compass-actions">` 包含 Find your fit + Save my size 两个按钮
  - [x] SubTask 6.2: 在 `assets/global-layout.css` 中,`.bc-compass-actions` flex 居中 gap 12px,主按钮用渐变背景同 Preview,副按钮用 outline 风格
  - [x] SubTask 6.3: 主按钮 onclick 跳 `/bra-size-guide/<bandlower><cuplower>/`,副按钮 onclick 复制主尺码到剪贴板
  - [x] SubTask 6.4: 验证:点击 Find your fit 跳转正确;点击 Save my size 复制成功

- [x] Task 7: GA4 事件追踪
  - [x] SubTask 7.1: 在 `assets/bra-calculator-main.js` 中,新增 `function bcTrack(eventName, params)` 包装 gtag
  - [x] SubTask 7.2: 在 5 个交互点(预览点击 / 卡点击 / 卡 hover debounce / 对比开启 / 对比关闭 / CTA findfit / CTA save)各打 1 个事件
  - [x] SubTask 7.3: 新增 IntersectionObserver 监听 #bc-compass-instrument,首次曝光打 `bc_sister_section_view`
  - [x] SubTask 7.4: 验证:DevTools Network → 看 gtag 请求,事件名 + 参数正确

- [x] Task 8: 响应式降级
  - [x] SubTask 8.1: 在 `assets/global-layout.css` 中,`@media (max-width: 540px)` 改为 grid-template-columns 1fr 1.2fr 1.2fr 1.2fr 1fr,保持 5 列但缩小 gap
  - [x] SubTask 8.2: 在 `assets/global-layout.css` 中,`@media (max-width: 380px)` 维持单列降级
  - [x] SubTask 8.3: 验证:Chrome DevTools 切 540 / 380 / 1024 三档,5 张卡保持可读,无截断

- [x] Task 9: SVG 形状公式优化
  - [x] SubTask 9.1: 在 `makeBraLineSvg` 中,`bandHalfW = 22 + (band - 26) * 2.0`(原 2.5,缩小避免过宽)
  - [x] SubTask 9.2: `cupTopY` 表新增更细分: A=12 B=14 C=14 D=18 DD=14 DDD=10 G=6 H=4(原值偏粗糙)
  - [x] SubTask 9.3: 验证:同一 band 不同 cup 高度差明显;同一 cup 不同 band 宽度差明显

# Task Dependencies
- [Task 2] depends on [Task 1] (空态 SVG 与激活态 SVG 共用 `makeBraLineSvg` 公式)
- [Task 3] depends on [Task 9] (指针位置依赖 cupTopY)
- [Task 4] depends on [Task 2] (对比卡需要 conversion 数据)
- [Task 5] depends on [Task 2] (换算条文本需要 conversion 数据)
- [Task 6] depends on [Task 2] (CTA 跳转路径需要 band/cup 字符串)
- [Task 7] depends on [Task 1, Task 2, Task 4, Task 6] (事件要打到所有交互点)
- [Task 8] depends on [Task 2, Task 3] (响应式调整涉及卡片 + YOU 指针)
