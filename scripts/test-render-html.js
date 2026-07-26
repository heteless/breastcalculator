// test-render-html.js — 验证 sister card HTML 输出
const fs = require('fs');
const vm = require('vm');

const elements = new Map();

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
    getElementById(id){
      if (!elements.has(id)) elements.set(id, createMockEl(id));
      return elements.get(id);
    },
    createElement(tag){ return createMockEl(tag); }
  },
  localStorage: { _d:{}, getItem(k){return this._d[k]||null;}, setItem(k,v){this._d[k]=v;}, removeItem(k){delete this._d[k];} },
  navigator: { userAgent: 'node', share: null, clipboard: null },
  matchMedia: () => ({ matches: false, addEventListener(){}, addListener(){} })
};
context.window = context;

function createMockEl(id){
  const el = {
    id,
    innerHTML: '',
    textContent: '',
    className: '',
    hidden: false,
    style: {},
    dataset: {},
    children: [],
    classList: {
      _set: new Set(),
      add(c){ this._set.add(c); },
      remove(c){ this._set.delete(c); },
      contains(c){ return this._set.has(c); }
    },
    setAttribute(k,v){ this[k] = v; },
    removeAttribute(k){ delete this[k]; },
    appendChild(c){ this.children.push(c); },
    insertBefore(c){ this.children.push(c); },
    querySelector(sel){
      // 模拟简单查找
      if (sel.startsWith('.')){
        const cls = sel.slice(1).split('.')[0];
        return { classList: { contains: () => this.innerHTML && this.innerHTML.includes('"' + cls + '"') }, addEventListener: () => {} };
      }
      return null;
    },
    querySelectorAll(sel){
      // 模拟姐妹卡点击事件 - 假装是 .bc-compass-sister-clickable
      if (sel.includes('clickable')){
        return [
          { getAttribute: (k) => k === 'data-band' ? '32' : 'D', addEventListener: () => {} },
          { getAttribute: (k) => k === 'data-band' ? '36' : 'B', addEventListener: () => {} }
        ];
      }
      return [];
    },
    addEventListener(){},
    scrollIntoView(){},
    getBoundingClientRect(){return {top:0,left:0,width:100,height:100};}
  };
  return el;
}

vm.createContext(context);

let pass = 0, fail = 0;
function assert(cond, msg){
  if (cond){ pass++; console.log('  ✓', msg); }
  else { fail++; console.log('  ✗', msg); }
}

try {
  const bc = fs.readFileSync('assets/bra-calculator.js', 'utf8');
  vm.runInContext(bc, context);
  const m = fs.readFileSync('assets/bra-calculator-main.js', 'utf8');
  vm.runInContext(m, context);
  const BC = context.BraCalculator;

  console.log('[TEST] renderSisterComparator 完整流程');
  // 模拟 34C 结果
  const result = { bandSize: 34, cupLetter: 'C', cupIndex: 2, us: '34C' };
  // 调用 __bcMain.renderSisterComparator
  if (context.__bcMain && context.__bcMain.renderSisterComparator){
    context.__bcMain.renderSisterComparator(result);
    // 检查 sisters 容器是否被填充
    const sistersEl = elements.get('bc-compass-sisters');
    const summaryEl = elements.get('bc-compass-summary');
    assert(sistersEl && sistersEl.innerHTML.length > 100, '姐妹卡 HTML 已生成');
    assert(summaryEl && summaryEl.innerHTML.length > 50, '汇总 HTML 已生成');
    // 验证内容
    if (sistersEl){
      const html = sistersEl.innerHTML;
      assert(html.includes('bc-compass-sister-you'), '包含 YOU 角色');
      assert(html.includes('bc-compass-sister-sister'), '包含 SISTER 角色');
      assert(html.includes('bc-compass-sister-extended'), '包含 EXTENDED 角色');
      assert(html.includes('bc-compass-sister-clickable'), '包含可点击元素');
      assert(html.includes('34'), '包含 band 数字 34');
      assert(html.includes('bc-compass-sister-size-cup'), '包含 cup 容器');
      assert(html.includes('bc-compass-sister-volume'), '包含体积显示');
      assert(html.includes('bc-compass-sister-band'), '包含底围显示');
      // 7 张卡
      const cardCount = (html.match(/class="bc-compass-sister /g) || []).length;
      assert(cardCount === 7, '7 张姐妹卡 (' + cardCount + ')');
    }
    if (summaryEl){
      const html = summaryEl.innerHTML;
      assert(html.includes('bc-compass-summary-equal'), '包含体积汇总');
      assert(html.includes('bc-compass-summary-range'), '包含范围显示');
      assert(html.includes('bc-compass-summary-tip'), '包含提示文本');
      assert(html.includes('380'), '包含体积数值 380mL (C cup)');
    }
  }
} catch(e) { console.error('[TEST] err:', e.message); console.error(e.stack); fail++; }

console.log('\n=========================================');
console.log('PASS:', pass, '/ FAIL:', fail);
console.log('=========================================');
process.exit(fail > 0 ? 1 : 0);
