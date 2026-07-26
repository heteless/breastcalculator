// scripts/inspect-header.js — use puppeteer-core with chrome from puppeteer cache
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const url = process.argv[2] || 'http://localhost:8766/';
  const out = process.argv[3] || 'd:/DevProject/breastcalculator/_dbg/header.png';
  const w = Number(process.argv[4] || 1280);
  const h = Number(process.argv[5] || 800);

  // Find Chrome from puppeteer cache
  const cachePath = 'C:\\Users\\Hu\\.cache\\puppeteer';
  function findChrome(p) {
    if (!fs.existsSync(p)) return null;
    const entries = fs.readdirSync(p, { withFileTypes: true });
    for (const e of entries) {
      if (e.name === 'chrome' && e.isDirectory()) {
        const inner = path.join(p, e.name);
        const versions = fs.readdirSync(inner);
        for (const v of versions) {
          const exe = path.join(inner, v, 'chrome-win64', 'chrome.exe');
          if (fs.existsSync(exe)) return exe;
        }
      }
    }
    for (const e of entries) {
      if (e.isDirectory()) {
        const found = findChrome(path.join(p, e.name));
        if (found) return found;
      }
    }
    return null;
  }
  const chromePath = findChrome(cachePath);
  if (!chromePath) { console.error('chrome not found'); process.exit(1); }
  console.log('Chrome:', chromePath);

  fs.mkdirSync(path.dirname(out), { recursive: true });

  const tmpProfile = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'puppeteer_inspect_' + Date.now());
  fs.mkdirSync(tmpProfile, { recursive: true });
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    userDataDir: tmpProfile,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  await page.screenshot({ path: out, fullPage: false });
  await page.screenshot({ path: out.replace('.png', '-full.png'), fullPage: true });

  const info = await page.evaluate(() => {
    const nav = document.querySelector('nav.navbar, nav.classic-navbar');
    if (!nav) return { error: 'no nav found' };
    const r = (el) => el ? el.getBoundingClientRect() : null;
    const cs = (el) => el ? getComputedStyle(el) : null;
    const navC = cs(nav);
    const inner = nav.querySelector('.nav-inner');
    const top = nav.querySelector('.nav-top');
    const logo = nav.querySelector('.nav-logo');
    const cats = nav.querySelector('.nav-categories');
    const cta = nav.querySelector('.nav-cta');
    const toggle = nav.querySelector('.nav-toggle');
    const svg = nav.querySelector('svg');
    return {
      bodyWidth: document.body.clientWidth,
      nav: { rect: r(nav), height: navC.height, minHeight: navC.minHeight, padding: navC.padding, position: navC.position, display: navC.display, background: navC.background, classList: nav.className },
      inner: inner ? { rect: r(inner), height: cs(inner).height, minHeight: cs(inner).minHeight, display: cs(inner).display, flexDirection: cs(inner).flexDirection } : null,
      top: top ? { rect: r(top), display: cs(top).display } : null,
      logo: logo ? { rect: r(logo), display: cs(logo).display, text: logo.textContent.trim().slice(0, 30) } : null,
      svg: svg ? { rect: r(svg), display: cs(svg).display, width: cs(svg).width, height: cs(svg).height } : null,
      cats: cats ? { rect: r(cats), display: cs(cats).display } : null,
      cta: cta ? { rect: r(cta), display: cs(cta).display } : null,
      toggle: toggle ? { rect: r(toggle), display: cs(toggle).display } : null,
    };
  });
  console.log(JSON.stringify(info, null, 2));

  await browser.close();
  console.log('Saved:', out);
})().catch((e) => { console.error(e); process.exit(1); });
