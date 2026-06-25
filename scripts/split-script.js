// scripts/split-script.js
//
// Splits the minified script.js into two IIFE bundles:
//   - common.js     (nav, drawer, validation, FAQ, charts, GA4 consent,
//                    cookie banner, back-to-top, error guard, share-toast …)
//   - calculator.js (unit toggle + 4 calculators: size, volume, ptosis,
//                    expansion — only loaded on calculator pages)
//
// Why this exists
// ---------------
// Lighthouse flagged script.js as a 1.2 s main-thread long task. The file
// is 45 KB minified containing 76 named functions. 15 of those are the
// calculator engines + unit toggle, which only need to load on calculator
// pages.
//
// Strategy
// --------
// 1. Parse script.js with acorn (handles nested FunctionExpressions that a
//    naive brace counter breaks on, and properly skips string/regex/comment
//    content).
// 2. Identify the top-level calculator FunctionDeclarations by name and
//    AST position.
// 3. Identify the 5 calculator init calls inside the DOMContentLoaded
//    handler (initUnitToggle, initSizeCalculator, initVolumeCalculator,
//    initPtosisCalculator, initExpansionCalculator) and remove them from
//    common.js while including them in calculator.js's own boot block.
// 4. Build common.js as the original IIFE with the calc functions and
//    calc init calls removed.
// 5. Build calculator.js as a fresh IIFE that defines the calc functions
//    and runs their init calls when the DOM is ready.
//
// Idempotent — running twice with the same source produces identical output.

const fs = require('fs');
const path = require('path');
const acorn = require('acorn');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'script.js');
const COMMON_OUT = path.join(ROOT, 'common.js');
const CALC_OUT = path.join(ROOT, 'calculator.js');

const CALC_FUNCTIONS = new Set([
  'convertToInches', 'updateUnitUI', 'initUnitToggle', 'getCupLetter',
  'calculateBraSize', 'getBraRecommendation', 'initSizeCalculator',
  'estimateBreastVolume', 'initVolumeCalculator', 'getPtosisLevel',
  'getPtosisRecommendations', 'initPtosisCalculator', 'getExpansionLevel',
  'getExpansionRecommendations', 'initExpansionCalculator',
]);

const CALC_INIT_CALLS = new Set([
  'initUnitToggle', 'initSizeCalculator', 'initVolumeCalculator',
  'initPtosisCalculator', 'initExpansionCalculator',
]);

function wrap(body) {
  return "(function(){'use strict';\n" + body.trim() + "\n})();\n";
}

function build() {
  const src = fs.readFileSync(SRC, 'utf8');
  const ast = acorn.parse(src, { ecmaVersion: 2022, sourceType: 'script' });
  const iifeBody = ast.body[0].expression.callee.body.body;

  // Step 1: collect top-level FunctionDeclarations that are calc functions.
  const calcDeclRanges = []; // sorted by start
  for (const stmt of iifeBody) {
    if (stmt.type === 'FunctionDeclaration' && stmt.id && CALC_FUNCTIONS.has(stmt.id.name)) {
      calcDeclRanges.push({ start: stmt.start, end: stmt.end });
    }
  }
  if (calcDeclRanges.length !== CALC_FUNCTIONS.size) {
    const found = calcDeclRanges.map((r) => '?');
    throw new Error(`Found ${calcDeclRanges.length} calc FunctionDeclarations, expected ${CALC_FUNCTIONS.size}`);
  }

  // Step 2: find calc init calls anywhere in the file (they live inside
  // a DOMContentLoaded handler nested in the IIFE).
  // We collect the AST node ranges so we can also remove the surrounding
  // semicolons/whitespace.
  const calcInitRanges = [];
  function walkForInits(node) {
    if (!node || typeof node !== 'object') return;
    if (
      node.type === 'ExpressionStatement' &&
      node.expression.type === 'CallExpression' &&
      node.expression.callee.type === 'Identifier' &&
      CALC_INIT_CALLS.has(node.expression.callee.name)
    ) {
      calcInitRanges.push({ start: node.start, end: node.end });
      return;
    }
    for (const k in node) {
      if (k === 'parent' || k === 'loc') continue;
      const v = node[k];
      if (Array.isArray(v)) v.forEach(walkForInits);
      else if (v && typeof v === 'object') walkForInits(v);
    }
  }
  walkForInits(ast);
  if (calcInitRanges.length !== CALC_INIT_CALLS.size) {
    throw new Error(`Found ${calcInitRanges.length} calc init calls, expected ${CALC_INIT_CALLS.size}`);
  }

  // Step 3: build common.js. We need to remove:
  //   - each calc FunctionDeclaration (from the top-level)
  //   - each calc init call (from the DOMContentLoaded handler)
  // All other code stays as-is. We construct the output by iterating the
  // IIFE top-level statements verbatim, EXCEPT calc function declarations,
  // and ALSO patching the body of any nested ExpressionStatement that
  // contains calc init calls.
  //
  // Patching nested code: rather than try to surgically rebuild the
  // DOMContentLoaded handler, we just rebuild its body statements.
  // The DOMContentLoaded handler is a CallExpression inside the
  // `document.addEventListener` call. We walk all FunctionExpressions in
  // the AST and if any of their body's statements is a calc init call,
  // we drop those statements from the emitted body.

  // Map of (statement start -> "skip") for calc inits
  const skipStarts = new Set(calcInitRanges.map((r) => r.start));

  // We also build a string-replacement list of ranges to drop. For each
  // calc FunctionDeclaration at the top level, drop it. For each calc
  // init call anywhere, drop it. We sort the drop list by start and
  // concatenate the source minus those ranges.
  const dropRanges = [
    ...calcDeclRanges.map((r) => ({ ...r, kind: 'fn' })),
    ...calcInitRanges.map((r) => ({ ...r, kind: 'init' })),
  ].sort((a, b) => a.start - b.start);

  let commonText = '';
  let cursor = 0;
  for (const r of dropRanges) {
    commonText += src.slice(cursor, r.start);
    // Collapse the dropped range to whitespace (preserving newlines so
    // any source maps remain valid; but we don't ship source maps so this
    // is just cosmetic).
    const dropped = src.slice(r.start, r.end);
    const collapsed = dropped.replace(/[^\n]/g, ' ');
    commonText += collapsed;
    cursor = r.end;
  }
  commonText += src.slice(cursor);

  // Step 4: build calculator.js. It is a fresh IIFE that defines the
  // 15 calc functions in order, and then runs the 5 calc init calls
  // once the DOM is ready.
  const calcDeclText = calcDeclRanges
    .map((r) => src.slice(r.start, r.end))
    .join('\n');
  const calcInitText = [...CALC_INIT_CALLS].join('();\n') + '();';

  const calcOut = wrap(
    calcDeclText + '\n' +
    'function bcBootCalculators(){' + calcInitText + '}' + '\n' +
    "if (document.readyState === 'loading') {" +
    "  document.addEventListener('DOMContentLoaded', bcBootCalculators);" +
    '} else {' +
    '  bcBootCalculators();' +
    '}'
  );
  const commonOut = wrap(commonText);

  fs.writeFileSync(COMMON_OUT, commonOut, 'utf8');
  fs.writeFileSync(CALC_OUT, calcOut, 'utf8');

  console.log(`[split-script] common.js:     ${(commonOut.length / 1024).toFixed(1)} KB`);
  console.log(`[split-script] calculator.js: ${(calcOut.length / 1024).toFixed(1)} KB`);
  console.log(`[split-script] original:      ${(src.length / 1024).toFixed(1)} KB`);
  console.log(`[split-script] dropped:       ${calcDeclRanges.length} functions, ${calcInitRanges.length} init calls`);
}

build();
