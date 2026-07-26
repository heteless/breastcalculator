// Comprehensive end-to-end test
const fs = require('fs');
const vm = require('vm');

class MockEl {
  constructor() { this.children = []; this.classList = { _set: new Set(), add(c) { this._set.add(c); }, remove(c) { this._set.delete(c); }, contains(c) { return this._set.has(c); } }; this.style = {}; this.dataset = {}; this.attributes = {}; this.listeners = {}; this._textContent = ''; this._innerHTML = ''; this.value = ''; this.hidden = false; this.disabled = false; this.tagName = 'DIV'; this.id = 'mock'; }
  get textContent() { return this._textContent; }
  set textContent(v) { this._textContent = v; }
  get innerHTML() { return this._innerHTML; }
  set innerHTML(v) { this._innerHTML = v; }
  setAttribute(k, v) { this.attributes[k] = v; if (k === 'id') this.id = v; if (k === 'hidden') this.hidden = true; }
  removeAttribute(k) { delete this.attributes[k]; }
  getAttribute(k) { return this.attributes[k]; }
  appendChild(c) { this.children.push(c); c.parentElement = this; return c; }
  insertBefore(c, ref) { const idx = this.children.indexOf(ref); if (idx >= 0) this.children.splice(idx, 0, c); else this.children.push(c); c.parentElement = this; return c; }
  removeChild(c) { this.children = this.children.filter(x => x !== c); }
  addEventListener(evt, fn, capture) { if (!this.listeners[evt]) this.listeners[evt] = []; this.listeners[evt].push({ fn, capture }); }
  removeEventListener(evt, fn) { if (!this.listeners[evt]) return; this.listeners[evt] = this.listeners[evt].filter(l => l.fn !== fn); }
  querySelector(sel) { function matches(el, s) { s = s.trim(); const m = s.match(/^(\w+)?(?:#([\w-]+))?(?:\.([\w-]+))?$/); if (!m) return true; const [, tag, id, cls] = m; if (tag && el.tagName && el.tagName.toLowerCase() !== tag.toLowerCase()) return false; if (id && el.id !== id) return false; if (cls && el.classList && !el.classList.contains(cls)) return false; return true; } function walk(el) { if (matches(el, sel)) return el; for (const c of el.children) { const r = walk(c); if (r) return r; } return null; } return walk(this); }
  querySelectorAll(sel) { const results = []; function matches(el, s) { s = s.trim(); const m = s.match(/^(\w+)?(?:#([\w-]+))?(?:\.([\w-]+))?$/); if (!m) return true; const [, tag, id, cls] = m; if (tag && el.tagName && el.tagName.toLowerCase() !== tag.toLowerCase()) return false; if (id && el.id !== id) return false; if (cls && el.classList && !el.classList.contains(cls)) return false; return true; } function walk(el) { if (matches(el, sel)) results.push(el); for (const c of el.children) walk(c); } walk(this); return results; }
  scrollIntoView() {} focus() {} click() {} closest() { return this; }
  dispatchEvent(evt) { const listeners = this.listeners[evt.type] || []; for (const l of listeners) l.fn(evt); }
}

const context = { console, setTimeout, clearTimeout, setInterval, clearInterval, Promise, Math, Date, JSON, Array, Object, String, Number, Boolean, Error, TypeError, Map, Set, Symbol, RegExp, parseInt, parseFloat, isNaN, isFinite, window: null, document: null, localStorage: { _d:{}, getItem(k){return this._d[k]||null;}, setItem(k,v){this._d[k]=v;}, removeItem(k){delete this._d[k];} }, navigator: { userAgent: 'node', share: null, clipboard: { writeText: () => Promise.resolve() } }, matchMedia: () => ({ matches: false, addEventListener(){}, addListener(){} }) };

const docBody = new MockEl();
docBody.tagName = 'BODY';
const form = new MockEl();
form.tagName = 'FORM';
form.classList.add('calc-form');
form.setAttribute('id', 'size-form');
const ubInput = new MockEl();
ubInput.tagName = 'INPUT';
ubInput.setAttribute('id', 'underbust');
ubInput.value = '32';
const bInput = new MockEl();
bInput.tagName = 'INPUT';
bInput.setAttribute('id', 'bust');
bInput.value = '36';
const uInput = new MockEl();
uInput.tagName = 'SELECT';
uInput.setAttribute('id', 'unit');
uInput.value = 'inches';
form.appendChild(ubInput);
form.appendChild(bInput);
form.appendChild(uInput);
const submitBtn = new MockEl();
submitBtn.tagName = 'BUTTON';
submitBtn.setAttribute('type', 'submit');
form.appendChild(submitBtn);
const sizeResult = new MockEl();
sizeResult.setAttribute('id', 'size-result');
sizeResult.hidden = true;
const sizeUs = new MockEl();
sizeUs.tagName = 'SPAN';
sizeUs.setAttribute('id', 'size-us');
sizeUs._textContent = '—';
sizeResult.appendChild(sizeUs);
const bcHistory = new MockEl();
bcHistory.setAttribute('id', 'bc-history');
bcHistory.hidden = true;
const calcContainer = new MockEl();
calcContainer.tagName = 'DIV';
calcContainer.classList.add('bra-calculator', 'embedded');
calcContainer.appendChild(form);
calcContainer.appendChild(sizeResult);
calcContainer.appendChild(bcHistory);
form.parentElement = calcContainer;
sizeResult.parentElement = calcContainer;

const documentMock = { readyState: 'complete', addEventListener() {}, removeEventListener() {}, querySelector(sel) { return docBody.querySelector(sel); }, querySelectorAll(sel) { return docBody.querySelectorAll(sel); }, getElementById(id) { function walk(el) { if (el.id === id) return el; for (const c of el.children) { const r = walk(c); if (r) return r; } return null; } return walk(docBody); }, createElement(tag) { const el = new MockEl(); el.tagName = tag.toUpperCase(); return el; }, body: docBody, _listeners: {} };
docBody.children.push(calcContainer);
context.document = documentMock;
context.window = context;
context.window.showToast = function(msg) { console.log('TOAST:', msg); };

vm.createContext(context);
const bc = fs.readFileSync('assets/bra-calculator.js', 'utf8');
vm.runInContext(bc, context, {filename: 'bra-calculator.js'});
console.log('1. BC loaded:', typeof context.BraCalculator);
const r = context.BraCalculator.calculateBraSize(32, 36);
console.log('2. calc(32,36):', JSON.stringify(r));
try {
  const m = fs.readFileSync('assets/bra-calculator-main.js', 'utf8');
  vm.runInContext(m, context, {filename: 'bra-calculator-main.js'});
  console.log('3. MAIN loaded');
  console.log('4. __bcMain:', typeof context.__bcMain);
  console.log('5. form listeners submit:', (form.listeners.submit||[]).length);
  const submitEvt = { type: 'submit', preventDefault() { this._prevented = true; }, stopPropagation() {}, stopImmediatePropagation() {}, target: form, currentTarget: form };
  form.dispatchEvent(submitEvt);
  setTimeout(() => {
    console.log('6. After submit:');
    console.log('   sizeUs.textContent:', sizeUs._textContent);
    console.log('   sizeResult.hidden:', sizeResult.hidden);
    console.log('   celebrate added:', !!calcContainer.querySelector('.bc-celebrate'));
  }, 300);
} catch(e) { console.error('MAIN error:', e.message); console.error(e.stack); }
