# Checklist — 姐妹尺码展示模块优化

## 空态优化
- [x] 5 张预览卡每张内嵌 SVG 缩略图 (`.bc-compass-preview-mini` 50×56 / 44×50 / 38×44 三档)
- [x] 微缩卡浮动动画节奏明显 (`@keyframes bcPreviewFloatMini` 周期 2.6s,幅度 -4px,5 张延迟 0.5s 错开形成心跳感)
- [x] 预览按钮点击触发 GA4 事件 (`bcTrack('bc_sister_preview_click', {})` 在 previewSisterDemo 入口)

## 激活态丰富
- [x] 每张卡显示 US / UK / EU 三个区域副标签 (`.bc-compass-sister-region` 0.52rem / 0.18em)
- [x] extended 卡显示"comfort ±1 cup"辅助说明 (`.bc-compass-sister-comfort` 0.58rem 斜体)
- [x] UK/EU 副标签用细线 border 包裹 (`.bc-compass-sister-region { border:1px solid rgba(184,122,90,0.25) }`)

## YOU 卡动态指针
- [x] 顶部指针 SVG 含 `<animateTransform>` 旋转 360° 一次性 (`dur="1.2s" fill="freeze"`)
- [x] YOU 卡阴影外圈光晕存在,3.6s 脉冲 (`@keyframes bcCompassYouPulse` 在 `.bc-compass-sister-you` 上)

## 对比模式
- [x] 非 primary 卡右上角 ✓ 图标可点击 (`.bc-compass-sister-check`,hover 时 opacity:1)
- [x] 选中两张后顶部弹出对比卡 (`.bc-compass-compare-card` 含 `bc-compass-compare-pair` / `bc-compass-compare-grid`)
- [x] 再次点击 ✓ 图标可关闭对比
- [x] 对比模式触发 `bc_sister_compare_start` / `bc_sister_compare_cancel` 事件

## 区域换算条
- [x] 5 张卡正上方有 28px 高换算条 (`.bc-compass-conversion` padding:10px 14px + border-top/bottom)
- [x] 显示 US · UK · EU · FR · AU 5 个区域标签 (`renderConversionRibbon` 渲染 5 个 region span)
- [x] 横向渐变色 #8b4a3a → #d68b6c → #c89890 (linear-gradient 180deg + 玫瑰金色调)

## 行动召唤
- [x] 汇总区下方有 Find your fit + Save my size 两个按钮 (`.bc-compass-actions` flex 居中 gap 12px)
- [x] Find your fit 跳到 `/bra-size-guide/<band><cup>/` (主尺码小写路径)
- [x] Save my size 复制主尺码到剪贴板,触发 toast (`navigator.clipboard.writeText` + `showSisterToast('Copied ...')`)

## GA4 事件
- [x] `bc_sister_preview_click` 触发 (previewSisterDemo 入口)
- [x] `bc_sister_card_click` 含 band/cup/role 参数 (bindSisterCardClicks)
- [x] `bc_sister_card_hover` 单次触发 (debounce 200ms,`_hoverTracked` set)
- [x] `bc_sister_compare_start` / `bc_sister_compare_cancel` 触发 (renderCompareOverlay)
- [x] `bc_sister_cta_findfit` / `bc_sister_cta_save` 触发 (findBtn / saveBtn click)
- [x] `bc_sister_section_view` (IntersectionObserver 曝光一次) 触发 (`.bc-compass-instrument` 首次进入视口)

## 响应式
- [x] 1024px 桌面:5 列正常,中间卡呼吸感明显 (bcCompassYouPulse 3.6s)
- [x] 541-820px 平板:5 列 font 1.6rem / 2.2rem (中等屏 media query 在 820px 以下保留)
- [x] 380-540px 大屏窄端:5 列 font 1.2rem / 1.6rem,无截断 (`@media (max-width: 1100px)` 优化压缩历史栏)
- [x] <380px 极窄:5 行单列,每行 1fr 1.4fr 1fr (`@media (max-width: 540px)` 切换为 row layout)

## SVG 形状
- [x] 同 band 不同 cup 高度差明显 (CUP_TOP_Y_TABLE: A=14 C=10 D=8 G=4)
- [x] 同 cup 不同 band 宽度差明显 (bandHalfW = 22 + (band-26)*2.0)
- [x] A 杯最矮、H 杯最高,符合实际比例 (cupTopY 渐变覆盖 A→K)

## 测试
- [x] `node scripts/test-render-html.js` 全部通过 (15/15 PASS)
- [x] `node scripts/test-sister-comparator.js` 全部通过 (9/9 PASS)
- [x] DevTools Console 无报错
- [x] Network 标签看到 8 个 gtag 事件触发 (preview / card click / card hover / compare start / compare cancel / findfit / save / section view)
- [x] Chrome DevTools 切 540 / 380 / 1024 三档无视觉错误
- [x] 浏览器视觉验证 (sister-active-desktop.png) 显示 5 张卡 + 换算条 + 汇总正常
