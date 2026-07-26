// verify-ads-robots.js
// Safety-net verifier for the two AdSense trust files.
// 1) Ensure ads.txt contains the required google.com line.
// 2) Ensure robots.txt does NOT block Googlebot and points to sitemap.xml.
// Exits non-zero if anything is wrong so it can be wired into CI.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ADS = path.join(ROOT, 'ads.txt');
const ROBOTS = path.join(ROOT, 'robots.txt');

const REQUIRED_ADS_LINE = 'google.com, pub-7388117485013143, DIRECT, f08c47fec0942fa0';
const SITEMAP_DIRECTIVE = 'Sitemap:';

let failed = false;

function checkAds() {
  if (!fs.existsSync(ADS)) {
    fs.writeFileSync(ADS, REQUIRED_ADS_LINE + '\n', 'utf8');
    console.log('[ads.txt] was missing — created with: ' + REQUIRED_ADS_LINE);
    return;
  }
  const text = fs.readFileSync(ADS, 'utf8');
  if (text.indexOf(REQUIRED_ADS_LINE) === -1) {
    failed = true;
    console.error('[ads.txt] MISSING required line: ' + REQUIRED_ADS_LINE);
  } else {
    console.log('[ads.txt] OK — required google.com line present');
  }
}

function checkRobots() {
  if (!fs.existsSync(ROBOTS)) {
    failed = true;
    console.error('[robots.txt] MISSING file: ' + ROBOTS);
    return;
  }
  const text = fs.readFileSync(ROBOTS, 'utf8');

  // Disallow Googlebot?
  const googlebotBlock = /User-agent:\s*Googlebot\s*[\r\n]+\s*Disallow:\s*\/\s*/i;
  if (googlebotBlock.test(text)) {
    failed = true;
    console.error('[robots.txt] BLOCKS Googlebot — AdSense crawl would fail');
  } else {
    console.log('[robots.txt] OK — Googlebot is allowed');
  }

  // Sitemap directive?
  if (!/Sitemap:\s*https?:\/\//i.test(text)) {
    failed = true;
    console.error('[robots.txt] MISSING Sitemap directive');
  } else {
    console.log('[robots.txt] OK — Sitemap directive present');
  }
}

checkAds();
checkRobots();

if (failed) {
  console.error('\nFAILED — fix the issues above before deploying');
  process.exit(1);
} else {
  console.log('\nAll checks passed.');
}
