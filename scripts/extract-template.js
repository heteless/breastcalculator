// extract-template.js — extract all shared layout chunks from reference wellness page
const fs = require('fs');
const path = require('path');
const REF = path.join(__dirname, '..', 'wellness', 'prosthetic-bras-guide', 'index.html');
const OUT = path.join(__dirname, '_layout-template.js');

const html = fs.readFileSync(REF, 'utf8');

function between(startMarker, endMarker, fromIndex = 0) {
  const start = html.indexOf(startMarker, fromIndex);
  if (start < 0) throw new Error('Start not found: ' + startMarker);
  const end = html.indexOf(endMarker, start);
  if (end < 0) throw new Error('End not found: ' + endMarker);
  return html.substring(start, end + endMarker.length);
}

// 1. NAV
const NAV = between('<nav class="navbar"', '</nav>');

// 2. PRE-HERO CHROME: drawer-overlay + back-to-top button (no article-hero, no drawer)
//    The article-hero is generated dynamically per page so we skip it here.
const navEnd = html.indexOf('</nav>') + 6;
// Drawer overlay
const drawerOverlayStart = html.indexOf('<div class="drawer-overlay"', navEnd);
const drawerOverlayEnd = html.indexOf('</div>', drawerOverlayStart) + '</div>'.length;
const DRAWER_OVERLAY = html.substring(drawerOverlayStart, drawerOverlayEnd);
// Back-to-top button — start at <button id="footerBackToTop" and end at </button>
const backToTopStart = html.indexOf('<button id="footerBackToTop"', drawerOverlayEnd);
const backToTopEnd = html.indexOf('</button>', backToTopStart) + '</button>'.length;
let BACK_TO_TOP = html.substring(backToTopStart, backToTopEnd);
// Strip the misplaced <link rel="stylesheet" ...> that lives inside the SVG
BACK_TO_TOP = BACK_TO_TOP.replace(/<link rel="stylesheet"[^>]*\/>/g, '');

// 3. DRAWER — the mobile menu drawer (after the back-to-top button)
const DRAWER_START = html.indexOf('<div class="drawer"', backToTopEnd);
const DRAWER_END = html.indexOf('</div>', DRAWER_START);
// Find the matching closing </div> for the drawer (drawer has nested divs, so find the one that closes the drawer)
// We use a manual balance scan since the drawer contains nested divs
function findMatchingCloseDiv(html, openIdx) {
  let depth = 0;
  let i = openIdx;
  const openTag = '<div';
  const closeTag = '</div>';
  while (i < html.length) {
    const nextOpen = html.indexOf(openTag, i);
    const nextClose = html.indexOf(closeTag, i);
    if (nextClose < 0) return -1;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + openTag.length;
    } else {
      depth--;
      if (depth === 0) return nextClose + closeTag.length;
      i = nextClose + closeTag.length;
    }
  }
  return -1;
}
const drawerRealEnd = findMatchingCloseDiv(html, DRAWER_START);
const DRAWER = html.substring(DRAWER_START, drawerRealEnd);

// 4. Combined CHROME: drawer-overlay + back-to-top + drawer (no hero, no link inside button)
const CHROME = DRAWER_OVERLAY + BACK_TO_TOP + DRAWER;

// 5. FOOTER
const FOOTER = between('<footer class="bg-[#fdf8f5]', '</footer>');

// 6. SCRIPTS — extract the two inline scripts after the footer
const footerEndIdx = html.lastIndexOf('</footer>');
let SCRIPTS = between('<script>', '</script>', footerEndIdx);
// Also pull in the second script if present
const secondScriptStart = html.indexOf('<script>', footerEndIdx + 50);
if (secondScriptStart > 0 && secondScriptStart < html.indexOf('</body>')) {
  const secondScript = between('<script>', '</script>', secondScriptStart);
  SCRIPTS = SCRIPTS + secondScript;
}

// Print what we got
console.log('NAV length:', NAV.length);
console.log('CHROME length:', CHROME.length);
console.log('FOOTER length:', FOOTER.length);
console.log('SCRIPTS length:', SCRIPTS.length);

// Save the template
const template = `// _layout-template.js — extracted shared layout chunks from prosthetic-bras-guide
// CHROME = drawer-overlay + back-to-top button + mobile drawer (no article-hero)
// HERO is generated dynamically per page
module.exports = {
  NAV: ${JSON.stringify(NAV)},
  CHROME: ${JSON.stringify(CHROME)},
  FOOTER: ${JSON.stringify(FOOTER)},
  SCRIPTS: ${JSON.stringify(SCRIPTS)}
};
`;
fs.writeFileSync(OUT, template, 'utf8');
console.log('Wrote', OUT);
