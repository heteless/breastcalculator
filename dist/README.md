# 🩺 Breast Calculator
<div align="center">
A lightweight static website for breast analysis & bra size calculation — 100% static assets https://breastcalculator.com


[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Static Site](https://img.shields.io/badge/Type-Static%20Site-blue)](#)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Sitemap](https://img.shields.io/badge/Sitemap-94%20URLs-orange)](sitemap.xml)

> Calculate breast weight, volume, shape and match your ideal bra size. Zero backend, zero tracking, zero database required.

[🌐 Live Demo](https://breastcalculator.com) · [📑 Sitemap](https://breastcalculator.com/sitemap.xml) · [🐛 Submit Issues](https://github.com/yourname/breastcalculator/issues)
</div>

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Core Features](#-core-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Development Commands](#-development-commands)
- [Build Pipeline](#-build-pipeline)
- [Deploy to Cloudflare](#-deploy-to-cloudflare)
- [SEO Optimization](#-seo-optimization)
- [IndexNow Integration](#-indexnow-integration)
- [Audit Tools](#-audit-tools)
- [Performance Tuning](#-performance-tuning)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Project Overview
**Breast Calculator** is a women’s health-focused static informational site that provides standardized bra size conversion, breast volume estimation and breast shape analysis tools. The entire site is powered by AI-generated content and automated build scripts, with core highlights:
- ✅ **Backend-Free Architecture** — Pure static HTML/CSS/JS with ultra-low hosting costs
- ✅ **Privacy-First Design** — No user data collection, no persistent cookie tracking
- ✅ Complete SEO Tooling — 94 indexable pages, canonical tags, hreflang markup & IndexNow support
- ✅ Blazing-Fast Performance — Minified HTML/CSS/JS + Tailwind CSS tree-shaking
- ✅ Cloudflare Native Deployment — Global CDN, auto HTTPS, built-in cache rules

---

## ✨ Core Features
### 🧮 7 Calculation Tools
| Tool | Route | Description |
|------|-------|-------------|
| Bra Size Calculator | [`/bra-size-calculator/`](bra-size-calculator/) | International bra size conversion & fitting guide |
| Breast Weight Calculator | [`/tools/breast-weight-calculator/`](tools/breast-weight-calculator/) | Estimate total breast tissue weight |
| Breast Volume Calculator | [`/tools/breast-volume-calculator/`](tools/breast-volume-calculator/) | Calculate single breast volume in cc (cubic centimeters) |
| Breast Shape Analyzer | [`/tools/breast-shape-calculator/`](tools/breast-shape-calculator/) | Classify breasts into 6 common shape categories |
| Breast Ptosis Grade Calculator | [`/tools/breast-ptosis-calculator/`](tools/breast-ptosis-calculator/) | Measure sagging severity with standardized grading |
| Length Unit Converter | [`/tools/length-converter/`](tools/length-converter/) | Metric ↔ Imperial unit conversion for measurements |
| Weight Unit Converter | [`/tools/weight-converter/`](tools/weight-converter/) | Convert grams, ounces & pounds instantly |

### 📚 Content Library (5 Core Sections)
- **Bra Size Guides**: 19 dedicated size pages + 12 side-by-side comparison pages
- **Health Articles**: 15 wellness guides covering post-surgery care & proper bra wearing habits
- **General Blog**: 14 professional articles about sizing, breast shapes & recovery tips
- **In-Depth Special Topics**: 7 deep-dive guides (sports bra biomechanics, breast augmentation reference data, etc.)
- **Shopping Guides**: 5 comparison & product recommendation pages

### 🩹 Bra Size Database
Covers **19 common sizes ranging from 32A to 40DD**, plus **6 side-by-side cup comparison sets**:
- B vs C Cup
- C vs D Cup
- D vs DD Cup
- DD vs DDD Cup
- Underwire vs Wire-Free Fit
- 38C vs 40B Cross-Size Comparison

---

## 🛠️ Tech Stack
| Category | Tools & Libraries |
|----------|-------------------|
| Frontend Core | Native HTML5 / CSS3 / Vanilla JavaScript (Zero frontend frameworks) |
| Styling | Tailwind CSS v3.4 + Custom global `style.css` |
| Build System | Node.js 18+ custom scripting (No Webpack / Vite bundlers) |
| CSS Optimization | PurgeCSS to strip unused CSS classes |
| Hosting & Deployment | Cloudflare Workers Static Assets |
| SEO Markup | Self-referential canonical tags, hreflang, XML Sitemap, robots.txt |
| Search Indexing | IndexNow API integration for instant page submission |
| Analytics | Google Analytics 4 with anonymized IP tracking |

