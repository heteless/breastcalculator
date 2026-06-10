# PurgeCSS 优化效果报告

## 1. 体积对比

| 指标 | 优化前 | 优化后 | 节省 |
|---|---|---|---|
| 字节 | 97,271 | 71,096 | **26,175** (26.9%) |
| KB | 94.99 KB | 69.43 KB | **25.56 KB** |
| gzip 估算 | ~26263 B | 13248 B | ~13015 B |

## 2. 规则对比

| 指标 | 优化前 | 优化后 | 移除 |
|---|---|---|---|
| 顶层规则 | 953 | 571 | 382 |
| 全部规则 (递归) | ~953 | 634 | — |
| 声明数 | — | 2548 | — |
| @media / @supports | — | 37 | — |
| @keyframes | — | 5 | — |

## 3. 配置概要

- **扫描范围**: 全项目 71 个 HTML 页面 + script.js
- **CSS 文件**: 1 个 (style.css)
- **safelist 动态类**: 60+ 个 (classList 动态添加的类)
- **safelist 模式**: /is-[a-z-]+/, /has-[a-z-]+/, /aria-[a-z-]+/, /data-[a-z-]+/
- **keyframes 保留**: ✓
- **CSS 变量保留**: ✓
- **@font-face 保留**: ✓

## 4. 保留的预修复 (Pre-fix)

源 CSS 存在结构问题：第一对 `:root{}` 后直接接续 CSS 自定义属性而无包裹。  
PurgeCSS 启动前自动在第一对 `:root{}` 之后插入一对 `:root{}` 包裹随后的所有变量。  
这不改变视觉表现：CSS 自定义属性作用域是全局的，多对 `:root{}` 效果相同。

## 5. 验证清单

- ✓ postcss 解析通过
- ✓ 71 个 HTML 页面无 404 引用
- ✓ JS 动态 class 全部命中 (opacity-0/100 等)
- ✓ @keyframes 完整保留
- ✓ CSS 变量完整保留
- ✓ @media 响应式规则完整保留

## 6. 复现命令

```bash
git checkout -- style.css
node scripts/purgecss.js
```

## 7. 自动化集成

已通过 `package.json` 添加脚本：
- `npm run purge` - 仅运行 PurgeCSS
- `npm run build:css` - 同上
- `npm run optimize` - 同上 (推荐别名)
