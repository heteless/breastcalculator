const fs = require('fs');

// Simulate browser environment
global.window = global;
global.console = console;
global.setTimeout = setTimeout;
global.setInterval = setInterval;
global.clearTimeout = clearTimeout;
global.localStorage = {
  _data: {},
  getItem(k) { return this._data[k] || null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; }
};
global.sessionStorage = global.localStorage;

// Mock document
const mockEl = function() {
  return new Proxy({
    children: [],
    classList: { add(){}, remove(){}, contains(){return false;} },
    style: {},
    dataset: {},
    attributes: {},
    hidden: false,
    disabled: false,
    value: '',
    textContent: '',
    innerHTML: '',
    parentElement: null,
    appendChild(c) { this.children.push(c); c.parentElement = this; return c; },
    insertBefore(c) { this.children.push(c); c.parentElement = this; return c; },
    addEventListener(){},
    removeEventListener(){},
    setAttribute(k,v){ this.attributes[k]=v; },
    getAttribute(k){ return this.attributes[k]; },
    querySelector(){ return null; },
    querySelectorAll(){ return []; },
    closest(){ return null; },
    scrollIntoView(){},
    focus(){},
    getBoundingClientRect(){ return {top:0,left:0,width:100,height:100}; },
    contains(){ return false; },
    dispatchEvent(){},
    click(){},
    matches(){ return false; }
  }, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (prop === 'tagName') return 'DIV';
      if (prop === 'id') return 'mock';
      if (prop === 'type') return 'text';
      if (prop === 'nodeType') return 1;
      return target[prop];
    }
  });
};

const mockForm = mockEl();
mockForm.id = 'size-form';
mockForm.className = 'calc-form';
mockForm.querySelector = (sel) => {
  if (sel === 'button[type="submit"]') return mockEl();
  if (sel === '#underbust' || sel.includes('underbust')) return Object.assign(mockEl(), {value: '32', id: 'underbust'});
  if (sel === '#bust' || sel.includes('bust')) return Object.assign(mockEl(), {value: '36', id: 'bust'});
  if (sel === '#unit' || sel.includes('unit')) return Object.assign(mockEl(), {value: 'inches', id: 'unit'});
  return null;
};
mockForm.querySelectorAll = () => [];
mockForm.parentElement = Object.assign(mockEl(), {
  querySelector(sel) {
    if (sel === '#size-result' || sel === '.calc-result') {
      return Object.assign(mockEl(), {id: 'size-result'});
    }
    if (sel === '[data-sister-sizes]') return Object.assign(mockEl(), {});
    if (sel === '[data-brand-result]') return null;
    return null;
  },
  appendChild() {},
  insertBefore() {}
});

global.document = {
  readyState: 'complete',
  addEventListener(){},
  querySelector(sel) {
    if (sel === '#size-form') return mockForm;
    return null;
  },
  querySelectorAll(sel) {
    if (sel.includes('size-form')) return [mockForm];
    return [];
  },
  getElementById(id) { return null; },
  createElement() { return mockEl(); }
};

// Load bra-calculator.js
try {
  const bc = fs.readFileSync('assets/bra-calculator.js', 'utf8');
  eval(bc);
  console.log('BraCalculator loaded:', typeof global.BraCalculator);
  console.log('Has calculateBraSize:', typeof global.BraCalculator.calculateBraSize);
} catch (e) {
  console.error('Error loading bra-calculator.js:', e.message);
}

// Load bra-calculator-enhance.js
try {
  const bce = fs.readFileSync('assets/bra-calculator-enhance.js', 'utf8');
  eval(bce);
  console.log('bra-calculator-enhance.js loaded OK');
} catch (e) {
  console.error('Error in enhance.js:', e.message);
  console.error('Stack:', e.stack);
}
