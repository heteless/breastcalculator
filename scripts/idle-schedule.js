// scripts/idle-schedule.js
//
// Splits the monolithic DOMContentLoaded init() chain in common.js into
// two priority bands so the main thread yields between them. Lighthouse
// "Long Task" warning was caused by 12+ init functions running back-to-back
// on DOMContentLoaded, blocking first-paint interaction by ~400ms.
//
// Approach
// --------
//   - Critical (run immediately on DOMContentLoaded):
//       initNavToggle, initDrawer, initBackToTop, initCookieConsent,
//       initInputValidation, initPrivacyPolicyLinks, initToolsNav,
//       initBackButton, initBraCalcClear
//     These bind to user-visible controls and need to be ready before the
//     first interaction.
//
//   - Deferred (run via requestIdleCallback with setTimeout fallback):
//       initChartTabs, initFaqAccordions, initFooterCollapse,
//       injectHomeTools
//     These enhance below-the-fold content; safe to delay until the
//     browser is idle.
//
// Idempotent — running it twice with an already-patched common.js is a
// no-op. Only edits common.js.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COMMON = path.join(ROOT, 'common.js');

// The original DOMContentLoaded block (post-split-script, post-reflow-fix).
// We match on a flexible pattern rather than the exact string so the script
// survives minor whitespace / ordering drift.
const BOOT_RE =
  /document\.addEventListener\('DOMContentLoaded',function\(\)\{[^}]*initNavToggle\(\);[^}]*\}\);/;

function main() {
  const src = fs.readFileSync(COMMON, 'utf8');

  if (src.includes('__bcIdleScheduled')) {
    console.log('[idle-schedule] common.js already idle-scheduled — skipping.');
    return;
  }

  // Locate the DOMContentLoaded block. We scan for the pattern manually
  // because the body contains nested braces.
  const startMarker = "document.addEventListener('DOMContentLoaded',function(){";
  const startIdx = src.indexOf(startMarker);
  if (startIdx === -1) {
    console.log('[idle-schedule] No DOMContentLoaded boot block found — skipping.');
    return;
  }
  // Find the matching closing brace by tracking depth.
  let depth = 0;
  let i = startIdx + startMarker.length;
  // We're already inside the function body; the "{" is part of `function(){`
  // so depth starts at 1 conceptually, but easier: walk forward and count
  // { and } until we return to the level of the outer scope.
  // Start counting from the `{` after `function()`
  const bodyStart = startIdx + startMarker.length;
  depth = 1; // we just entered the function body
  let bodyEnd = -1;
  for (let j = bodyStart; j < src.length; j++) {
    const c = src[j];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) { bodyEnd = j; break; }
    }
  }
  if (bodyEnd === -1) {
    console.log('[idle-schedule] Could not find end of DOMContentLoaded block — skipping.');
    return;
  }
  const body = src.slice(bodyStart, bodyEnd);

  // The original block ends with `);` after the closing brace.
  const endMarker = bodyEnd + 1; // index just past `}`
  const fullEnd = src.indexOf(');', endMarker);
  if (fullEnd === -1) {
    console.log('[idle-schedule] Could not find `);` after block — skipping.');
    return;
  }
  const oldBlock = src.slice(startIdx, fullEnd + 2);

  // Build the new boot block.
  // Critical inits run synchronously on DOMContentLoaded.
  // Deferred inits run via requestIdleCallback (or setTimeout fallback).
  const newBlock =
    "document.addEventListener('DOMContentLoaded',function(){" +
    "var __bcIdleScheduled=true;" +
    // Critical (run immediately)
    "initNavToggle();initDrawer();initBackToTop();initCookieConsent();" +
    "initInputValidation();initPrivacyPolicyLinks();initToolsNav();" +
    "initBackButton();initBraCalcClear();" +
    // Scheduler: requestIdleCallback with setTimeout fallback and a hard
    // timeout so deferred work runs even if the browser never idles
    // (e.g. background tabs).
    "var scheduleIdle=function(cb,delay){" +
    "if('requestIdleCallback' in window){" +
    "window.requestIdleCallback(cb,{timeout:delay||1000});" +
    "}else{setTimeout(cb,delay||50);}};" +
    // Deferred (below-the-fold enhancers)
    "scheduleIdle(function(){initChartTabs();initFaqAccordions();initFooterCollapse();});" +
    "scheduleIdle(function(){" +
    "injectHomeTools&&injectHomeTools();" +
    "[50,250,800,1500,3000].forEach(function(t){setTimeout(initInputValidation,t);});" +
    "},100);" +
    "});";

  const out = src.slice(0, startIdx) + newBlock + src.slice(fullEnd + 2);
  fs.writeFileSync(COMMON, out, 'utf8');
  console.log('[idle-schedule] common.js patched: deferred non-critical inits to idle callback.');
  console.log('[idle-schedule] size:', src.length, '->', out.length, 'bytes');
}

main();
