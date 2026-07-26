// scripts/verify-step2-logic.js — verify Step 2 history functions via VM eval
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const store = new Map();
const ctx = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  },
  window: { showToast: () => {} },
  document: { readyState: 'complete', addEventListener() {}, querySelectorAll: () => [], getElementById: () => null },
  location: { pathname: '/' },
  Date, Math, JSON, String, Number, Array, Object, RegExp, console, setTimeout,
  confirm: () => true,
};
vm.createContext(ctx);

const src = fs.readFileSync(path.resolve(__dirname, '..', 'common.js'), 'utf8');

function extractFn(name) {
  const re = new RegExp('function\\s+' + name + '\\s*\\(');
  const m = re.exec(src);
  if (!m) throw new Error('not found: ' + name);
  let i = src.indexOf('{', m.index);
  if (i === -1) throw new Error('no body: ' + name);
  let depth = 1, j = i + 1, mode = 'code';
  while (j < src.length && depth > 0) {
    const c = src[j], n = src[j + 1];
    if (mode === 'sq') {
      if (c === '\\') { j += 2; continue; }
      if (c === "'") mode = 'code';
    } else if (mode === 'dq') {
      if (c === '\\') { j += 2; continue; }
      if (c === '"') mode = 'code';
    } else if (mode === 'regex') {
      if (c === '\\') { j += 2; continue; }
      if (c === '/') mode = 'code';
    } else if (mode === 'line') {
      if (c === '\n') mode = 'code';
    } else if (mode === 'block') {
      if (c === '*' && n === '/') { mode = 'code'; j++; }
    } else {
      if (c === '/' && n === '/') { mode = 'line'; j++; }
      else if (c === '/' && n === '*') { mode = 'block'; j++; }
      else if (c === "'") mode = 'sq';
      else if (c === '"') mode = 'dq';
      else if (c === '/' && /[=({,;:!&|?+\-*%^~<>]/.test(src[j - 1] || ' ')) mode = 'regex';
      else if (c === '{') depth++;
      else if (c === '}') depth--;
    }
    j++;
  }
  if (depth !== 0) throw new Error('unbalanced: ' + name);
  return src.slice(m.index, j);
}

const fnNames = [
  'bcGetHistory', 'bcSetHistory', 'bcFormatHistoryDate', 'bcEscapeHtml',
  'bcRenderHistory', 'bcDeleteHistoryEntry', 'bcClearAllHistory',
  'bcSaveToHistory', 'bcRestoreHistoryEntry', 'bcWireHistory',
  'bcMarkSaved', 'bcInitSaveButton',
];

let scriptBody = '';
for (const name of fnNames) {
  // Keep the function's own name so internal references resolve via the
  // function expression's name binding rather than via a missing outer var.
  scriptBody += 'globalThis.' + name + ' = ' + extractFn(name) + ';\n';
}
vm.runInContext(scriptBody, ctx);

const api = {};
for (const name of fnNames) api[name] = ctx[name];

function makeForm(ub, b, unit) {
  const refs = {
    'input[name="underbust"],#underbust': { value: ub },
    'input[name="bust"],#bust': { value: b },
    '#unit,[name="unit"]': { value: unit },
  };
  return {
    __lastResult: { bandSize: 32, cupLetter: 'C', us: '32C', uk: '32C', eu: '70C', fr: '85C', au: '10C', india: '32C', cupDiff: '2.0' },
    parentElement: { querySelector: () => ({ querySelector: () => null, addEventListener() {}, classList: { add() {}, remove() {} } }) },
    querySelector: (sel) => refs[sel] || null,
    scrollIntoView() {},
    dataset: {},
  };
}

let pass = 0, fail = 0;
function assert(name, cond, extra) {
  if (cond) { pass++; console.log('[OK]', name); }
  else { fail++; console.log('[FAIL]', name, extra ? JSON.stringify(extra) : ''); }
}

store.clear();
const f1 = makeForm('28', '30', 'inches');
api.bcSaveToHistory(f1, f1.__lastResult);
const f2 = makeForm('30', '32', 'inches');
f2.__lastResult = { ...f1.__lastResult, bandSize: 30, cupLetter: 'B', us: '30B' };
api.bcSaveToHistory(f2, f2.__lastResult);
const f3 = makeForm('32', '34', 'centimeters');
f3.__lastResult = { ...f1.__lastResult, bandSize: 32, cupLetter: 'A', us: '32A' };
api.bcSaveToHistory(f3, f3.__lastResult);

let items = api.bcGetHistory();
assert('three entries saved', items.length === 3, { actual: items.length });
assert('newest is 32A (unshift)', items[0].us === '32A', { actual: items[0].us });
assert('unit stored', items[0].unit === 'centimeters', { actual: items[0].unit });

api.bcSaveToHistory(f3, f3.__lastResult);
items = api.bcGetHistory();
assert('duplicate does not add new entry', items.length === 3, { actual: items.length });

const safe = api.bcEscapeHtml('<script>alert("x")</script>');
assert('html escaped', safe.indexOf('<script>') === -1, { safe });

const ago = api.bcFormatHistoryDate(Date.now() - 5 * 60 * 1000);
assert('format returns "Xm ago"', /\dm ago/.test(ago), { got: ago });
const justNow = api.bcFormatHistoryDate(Date.now() - 1000);
assert('format returns "just now" for <1m', justNow === 'just now', { got: justNow });

const restoreRefs = { ub: { value: '' }, b: { value: '' }, unit: { value: 'inches' } };
const restoreForm = {
  querySelector: (sel) => {
    if (sel === 'input[name="underbust"],#underbust') return restoreRefs.ub;
    if (sel === 'input[name="bust"],#bust') return restoreRefs.b;
    if (sel === '#unit,[name="unit"]') return restoreRefs.unit;
    return null;
  },
  scrollIntoView() {},
  parentElement: { querySelector: () => null },
};
const target = items[1];
api.bcRestoreHistoryEntry(target.id, restoreForm);
assert('restored ub', restoreRefs.ub.value === target.ub, { expected: target.ub, actual: restoreRefs.ub.value });
assert('restored b', restoreRefs.b.value === target.b, { expected: target.b, actual: restoreRefs.b.value });
assert('restored unit', restoreRefs.unit.value === (target.unit === 'inch' ? 'inches' : (target.unit === 'cm' ? 'centimeters' : target.unit)),
  { expected: target.unit, actual: restoreRefs.unit.value });

api.bcDeleteHistoryEntry(items[0].id);
items = api.bcGetHistory();
assert('delete removes one', items.length === 2, { actual: items.length });

const sorted = api.bcGetHistory().sort((a, b) => b.ts - a.ts);
assert('sort: newest first', sorted[0].ts >= sorted[1].ts, { ts: sorted.map(x => x.ts) });

const listEl = { innerHTML: '', querySelector: () => null };
const containerEl = {
  querySelector: (s) => (s === '#bc-history-list' ? listEl : null),
  addEventListener() {}, removeEventListener() {},
};
api.bcRenderHistory(containerEl, makeForm('', '', 'inches'));
const itemCount = (listEl.innerHTML.match(/<li class="bc-history-item"/g) || []).length;
assert('render produces 2 list items', itemCount === 2, { count: itemCount });
assert('render includes Restore button', listEl.innerHTML.indexOf('Restore') !== -1);
assert('render includes Delete button', listEl.innerHTML.indexOf('Delete') !== -1);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
