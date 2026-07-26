const fs = require('fs');
const vm = require('vm');

const context = {
  console,
  setTimeout, clearTimeout, setInterval, clearInterval,
  Promise, Math, Date, JSON, Array, Object, String, Number, Boolean, Error, TypeError, Map, Set, Symbol,
  parseInt, parseFloat, isNaN, isFinite,
  document: {
    readyState: 'complete',
    addEventListener(){},
    removeEventListener(){},
    querySelector(){return null;},
    querySelectorAll(){return [];},
    getElementById(){return null;},
    createElement(){return {
      setAttribute(){}, classList:{add(){},remove(){},contains(){return false;}},
      style:{}, dataset:{}, appendChild(){}, insertBefore(){},
      querySelector(){return null;}, addEventListener(){},
      hidden:false, scrollIntoView(){}, getBoundingClientRect(){return {top:0,left:0,width:100,height:100};}
    };}
  },
  localStorage: { _d:{}, getItem(k){return this._d[k]||null;}, setItem(k,v){this._d[k]=v;}, removeItem(k){delete this._d[k];} },
  navigator: { userAgent: 'node', share: null, clipboard: null },
  matchMedia: () => ({ matches: false, addEventListener(){}, addListener(){} })
};
context.window = context;

vm.createContext(context);

try {
  const bc = fs.readFileSync('assets/bra-calculator.js', 'utf8');
  vm.runInContext(bc, context);
  console.log('[BC] loaded, calc:', typeof context.BraCalculator.calculateBraSize);
  const r = context.BraCalculator.calculateBraSize(32, 36);
  console.log('[BC] test:', JSON.stringify(r));
} catch(e) { console.error('[BC] err:', e.message); }

try {
  const m = fs.readFileSync('assets/bra-calculator-main.js', 'utf8');
  vm.runInContext(m, context);
  console.log('[MAIN] loaded OK');
  console.log('[MAIN] __bcMain:', typeof context.__bcMain);
} catch(e) { console.error('[MAIN] err:', e.message); console.error(e.stack); }
