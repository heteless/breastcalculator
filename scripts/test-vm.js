// Test loading in browser-like env
const fs = require('fs');
const vm = require('vm');

const context = {
  console,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  Promise,
  Math,
  Date,
  JSON,
  Array,
  Object,
  String,
  Number,
  Boolean,
  Error,
  TypeError,
  Map,
  Set,
  Symbol,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  window: null,
  document: {
    readyState: 'complete',
    addEventListener() {},
    removeEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementById() { return null; },
    createElement() {
      return {
        setAttribute() {},
        classList: { add(){}, remove(){}, contains(){return false;} },
        style: {},
        dataset: {},
        appendChild() {},
        insertBefore() {},
        querySelector() { return null; },
        addEventListener() {},
        hidden: false,
        scrollIntoView() {},
        getBoundingClientRect() { return {top:0,left:0,width:100,height:100}; }
      };
    },
    body: { appendChild() {} }
  },
  localStorage: { _d:{}, getItem(k){return this._d[k]||null;}, setItem(k,v){this._d[k]=v;}, removeItem(k){delete this._d[k];} },
  navigator: { userAgent: 'node', share: null, clipboard: null },
  matchMedia: () => ({ matches: false, addEventListener(){}, addListener(){} })
};
context.window = context;
context.localStorage = context.localStorage;
context.navigator = context.navigator;
context.document.body.appendChild = function() {};
context.document.addEventListener = function() {};

vm.createContext(context);

// Load BC
try {
  const bc = fs.readFileSync('assets/bra-calculator.js', 'utf8');
  vm.runInContext(bc, context, {filename: 'bra-calculator.js'});
  console.log('BraCalculator type:', typeof context.BraCalculator);
  if (context.BraCalculator) {
    console.log('Has calculateBraSize:', typeof context.BraCalculator.calculateBraSize);
    // Test it
    const r = context.BraCalculator.calculateBraSize(32, 36);
    console.log('Test calc(32, 36):', JSON.stringify(r));
  }
} catch (e) {
  console.error('BC error:', e.message);
}

// Now load enhance.js
try {
  const bce = fs.readFileSync('assets/bra-calculator-enhance.js', 'utf8');
  vm.runInContext(bce, context, {filename: 'bra-calculator-enhance.js'});
  console.log('enhance.js loaded OK');
} catch (e) {
  console.error('enhance error:', e.message);
  console.error('Stack:', e.stack);
}
