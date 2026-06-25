// scripts/reflow-fix.js
//
// Lighthouse "Forced Reflow" warning comes from setVh() reading
// `window.innerHeight` synchronously and then writing the
// `--vh` custom property. The fix:
//
//   1. Don't call setVh() at script-parse time (DOM isn't ready).
//      Wait for DOMContentLoaded instead.
//   2. Wrap the innerHeight read in requestAnimationFrame so the
//      browser batches the layout query with the next paint cycle.
//   3. Debounce resize events with rAF (rAF naturally coalesces
//      many resize events into one callback per frame).
//   4. The orientationchange path was already debounced with
//      setTimeout; we keep that but layer rAF on top.
//
// Idempotent.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COMMON = path.join(ROOT, 'common.js');

// Original pattern that ships from split-script.js (pre-fix):
//   function setVh(){const vh = window.innerHeight * 0.01;
//                     document.documentElement.style.setProperty('--vh',vh + 'px');}
//   setVh();
//   window.addEventListener('resize',setVh,{passive:true});
//   window.addEventListener('orientationchange',() => setTimeout(setVh,100),{passive:true});
//   if (window.visualViewport){window.visualViewport.addEventListener('resize',setVh,{passive:true});}
const OLD = `function setVh(){const vh = window.innerHeight * 0.01;document.documentElement.style.setProperty('--vh',vh + 'px');}setVh();window.addEventListener('resize',setVh,{passive:true});window.addEventListener('orientationchange',() => setTimeout(setVh,100),{passive:true});if (window.visualViewport){window.visualViewport.addEventListener('resize',setVh,{passive:true});}`;

const NEW = `function setVh(){var raf=requestAnimationFrame||function(cb){return setTimeout(cb,16);};if(setVh._raf)cancelAnimationFrame(setVh._raf);setVh._raf=raf(function(){var vh=window.innerHeight*0.01;document.documentElement.style.setProperty('--vh',vh+'px');});}function _setVhBoot(){setVh();window.addEventListener('resize',setVh,{passive:true});window.addEventListener('orientationchange',function(){setTimeout(setVh,150);},{passive:true});if(window.visualViewport){window.visualViewport.addEventListener('resize',setVh,{passive:true});}window.removeEventListener('DOMContentLoaded',_setVhBoot);}if(document.readyState==='loading'){window.addEventListener('DOMContentLoaded',_setVhBoot,{once:true});}else{_setVhBoot();}`;

function main() {
  const src = fs.readFileSync(COMMON, 'utf8');
  if (!src.includes(OLD)) {
    console.log('[reflow-fix] No setVh pattern found in common.js — skipping.');
    console.log('[reflow-fix] (If you regenerated common.js, run split-script.js first.)');
    return;
  }
  if (src.includes('setVh._raf')) {
    console.log('[reflow-fix] setVh already reflow-fixed — skipping.');
    return;
  }
  const out = src.replace(OLD, NEW);
  fs.writeFileSync(COMMON, out, 'utf8');
  console.log('[reflow-fix] common.js patched: setVh wrapped in rAF, boot deferred to DOMContentLoaded.');
  console.log('[reflow-fix] size:', out.length, 'bytes');
}

main();
