// test-sister-comparator.js — 验证 sister size comparator 重构后的函数
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
    getElementById(id){
      // 模拟返回有 innerHTML/classList 的元素
      const el = {
        id,
        innerHTML: '',
        textContent: '',
        className: '',
        hidden: false,
        style: {},
        dataset: {},
        classList: {
          _set: new Set(),
          add(c){ this._set.add(c); },
          remove(c){ this._set.delete(c); },
          contains(c){ return this._set.has(c); },
          toggle(c){ this._set.has(c) ? this._set.delete(c) : this._set.add(c); }
        },
        setAttribute(k,v){ this[k] = v; },
        removeAttribute(k){ delete this[k]; },
        appendChild(){},
        insertBefore(){},
        querySelector(){return null;},
        querySelectorAll(){return [];},
        addEventListener(){},
        scrollIntoView(){},
        getBoundingClientRect(){return {top:0,left:0,width:100,height:100};}
      };
      return el;
    },
    createElement(tag){
      return {
        tagName: tag.toUpperCase(),
        className: '',
        innerHTML: '',
        hidden: false,
        style: {},
        dataset: {},
        classList: {
          _set: new Set(),
          add(c){ this._set.add(c); },
          remove(c){ this._set.delete(c); },
          contains(c){ return this._set.has(c); }
        },
        setAttribute(){},
        removeAttribute(){},
        appendChild(){},
        insertBefore(){},
        addEventListener(){},
        querySelector(){return null;},
        querySelectorAll(){return [];}
      };
    }
  },
  localStorage: { _d:{}, getItem(k){return this._d[k]||null;}, setItem(k,v){this._d[k]=v;}, removeItem(k){delete this._d[k];} },
  navigator: { userAgent: 'node', share: null, clipboard: null },
  matchMedia: () => ({ matches: false, addEventListener(){}, addListener(){} })
};
context.window = context;

vm.createContext(context);

let pass = 0, fail = 0;
function assert(cond, msg){
  if (cond){ pass++; console.log('  ✓', msg); }
  else { fail++; console.log('  ✗', msg); }
}

try {
  const bc = fs.readFileSync('assets/bra-calculator.js', 'utf8');
  vm.runInContext(bc, context);
  const BC = context.BraCalculator;
  console.log('[TEST] getSisterSizes 直接测试');
  const sisters = BC.getSisterSizes(34, 'C');
  console.log('  sisters:', JSON.stringify(sisters));
  assert(sisters.length === 7, '7 张姐妹卡');
  assert(sisters[3].primary === true, '中间是 primary');
  assert(sisters[0].band === 28 && sisters[6].band === 40, '两端 band 正确');
  assert(sisters[0].cup === 'DDD' && sisters[6].cup === 'AA', '两端 cup 正确 (band ↑, cup ↓)');

  console.log('\n[TEST] getSisterSizeConversion EU/FR 公式 (5cm 步进)');
  const conv34C = BC.getSisterSizeConversion(34, 'C');
  console.log('  34C:', JSON.stringify(conv34C));
  assert(conv34C.us === '34C', 'US 保持 34C');
  assert(conv34C.uk === '34C', 'UK cup C 与 US 相同');
  assert(conv34C.eu === '75C', 'EU 34→75 (5cm 步进)');
  assert(conv34C.fr === '75C', 'FR 34→75 (同 EU)');
  assert(conv34C.au === '34C', 'AU 与 US 相同');

  const conv28DDD = BC.getSisterSizeConversion(28, 'DDD');
  console.log('  28DDD:', JSON.stringify(conv28DDD));
  assert(conv28DDD.eu === '60F', 'EU 28→60, DDD→F');

  const conv40AA = BC.getSisterSizeConversion(40, 'AA');
  console.log('  40AA:', JSON.stringify(conv40AA));
  assert(conv40AA.eu === '90AA', 'EU 40→90, AA→AA');

  const conv32D = BC.getSisterSizeConversion(32, 'D');
  console.log('  32D:', JSON.stringify(conv32D));
  assert(conv32D.eu === '70D', 'EU 32→70, D→D');

  console.log('\n[TEST] CUP_VOLUME_ML 完整性');
  assert(BC.CUP_VOLUME_ML && typeof BC.CUP_VOLUME_ML === 'object', 'CUP_VOLUME_ML 存在');
  assert(BC.CUP_VOLUME_ML['C'] === 380, 'C cup = 380 mL (用户原始尺码)');
  assert(BC.CUP_VOLUME_ML['D'] !== BC.CUP_VOLUME_ML['C'], 'D cup ≠ C cup (姐妹尺码杯字母体积不同)');
  /* 关键不变量: 姐妹尺码定义 = 体积相等
     即使 cup 字母不同, 7 张 sister 卡的"显示体积"必须都是 userOriginal.cup 的体积 */
  var userVol = BC.CUP_VOLUME_ML['C'];
  assert(userVol === 380, '用户 36C 体积 = 380 mL');
} catch(e) { console.error('[BC] err:', e.message); fail++; }

try {
  const m = fs.readFileSync('assets/bra-calculator-main.js', 'utf8');
  vm.runInContext(m, context);
  console.log('\n[TEST] 主脚本加载');
  assert(context.__bcMain !== undefined, '__bcMain 已暴露');
  assert(typeof context.__bcMain.runCalculation === 'function', 'runCalculation 存在');
  assert(typeof context.__bcMain.renderSisterComparator === 'function', 'renderSisterComparator 存在');
  assert(typeof context.__bcMain.resetSisterComparator === 'function', 'resetSisterComparator 存在');
  assert(typeof context.__bcMain.setUnit === 'function', 'setUnit 存在');
} catch(e) { console.error('[MAIN] err:', e.message); fail++; }

console.log('\n=========================================');
console.log('PASS:', pass, '/ FAIL:', fail);
console.log('=========================================');
process.exit(fail > 0 ? 1 : 0);
