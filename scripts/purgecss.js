// scripts/purgecss.js
//
// Removes unused CSS selectors from style.css (and assets/bra-calculator.css)
// by scanning every HTML / JS file in the project for class names.
//
// Why this exists
// ---------------
// Lighthouse flagged ~12 KiB of unused CSS on the homepage. The existing
// `optimize.js` only minifies whitespace; it never deletes rules. Tailwind's
// JIT (`build-tailwind.js`) already purges its own output, so the bloat lives
// in the hand-written `style.css` where rules accumulated over time and some
// selectors no longer match any markup.
//
// Approach
// --------
//   1. Collect the universe of "used" tokens:
//        - class="..." literals in every .html
//        - className/'class' strings in .js / .common.js
//        - ids referenced via getElementById / querySelector('#x')
//        - tag names that appear in markup
//   2. Parse each CSS file rule-by-rule (simple parser; handles the project's
//      well-formed CSS, including @media blocks and Tailwind-style escaped
//      class selectors like .text-\[\#8b7355\]).
//   3. For every selector, check whether all of its class / id components are
//      present in the used set. If a selector contains at least one unknown
//      token AND no known token, drop it. Conservative: keep rules where we
//      are unsure (e.g. pseudo-elements, ::slotted, keyframe selectors).
//   4. @media / @supports wrappers are preserved; only their inner rules are
//      filtered.
//
// Idempotent. Zero deps. Edits files in place; recoverable via git.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', '.wrangler', '.vscode', 'scripts', 'dist']);

const TARGETS = [
  path.join(ROOT, 'style.css'),
  path.join(ROOT, 'assets', 'bra-calculator.css'),
];

// ---------- 1. Collect used tokens ----------

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    if (e.name.startsWith('.') && e.name !== '.well-known') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile()) out.push(p);
  }
  return out;
}

const usedClasses = new Set();
const usedIds = new Set();
const usedTags = new Set();

const CLASS_RE = /class\s*=\s*["']([^"']+)["']/gi;
const ID_RE = /id\s*=\s*["']([^"']+)["']/gi;
const JS_CLASS_RE = /(?:className|classList(?:\.(?:add|remove|toggle|contains))?|class)\s*[=:]+\s*['"`]([^'"`]+)['"`]/gi;
const JS_ID_RE = /(?:getElementById|querySelector)\(\s*['"`]#([A-Za-z0-9_-]+)['"`]/gi;
const TAG_RE = /<([a-zA-Z][a-zA-Z0-9-]*)/g;

function collectFromFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.html', '.js', '.css', '.md'].includes(ext)) return;
  let src = '';
  try { src = fs.readFileSync(file, 'utf8'); } catch { return; }
  if (ext === '.html') {
    let m;
    while ((m = CLASS_RE.exec(src))) m[1].split(/\s+/).forEach(c => c && usedClasses.add(c));
    while ((m = ID_RE.exec(src))) usedIds.add(m[1]);
    while ((m = TAG_RE.exec(src))) usedTags.add(m[1].toLowerCase());
  } else if (ext === '.js') {
    let m;
    while ((m = JS_CLASS_RE.exec(src))) {
      m[1].split(/\s+/).forEach(c => c && usedClasses.add(c));
    }
    while ((m = JS_ID_RE.exec(src))) usedIds.add(m[1]);
  }
}

for (const f of walk(ROOT)) collectFromFile(f);
console.log(`[purgecss] collected ${usedClasses.size} classes, ${usedIds.size} ids, ${usedTags.size} tags`);

// ---------- 2. CSS parser ----------

function unescapeClass(token) {
  // .text-\[\#8b7355\]  ->  text-[#8b7355]
  return token.replace(/\\([#!\[\]()])/g, '$1').replace(/\\(.)/g, '$1');
}

function extractSelectorTokens(selector) {
  // Split selector into compound parts by combinator
  const compounds = selector.split(/\s*[>+~]\s*|\s+/).filter(Boolean);
  const tokens = [];
  for (const c of compounds) {
    // Class: \.([A-Za-z0-9_-]+(?:\\.[A-Za-z0-9_-]+)*)
    const classRe = /\.((?:\\[^\s.>,+~()]|[^.>,+~()\s\\])+)/g;
    const idRe = /#([A-Za-z0-9_-]+)/g;
    const tagRe = /^[a-zA-Z][a-zA-Z0-9-]*/;
    let m;
    while ((m = classRe.exec(c))) tokens.push({ type: 'class', value: unescapeClass(m[1]) });
    while ((m = idRe.exec(c))) tokens.push({ type: 'id', value: m[1] });
    const tm = c.match(tagRe);
    if (tm) tokens.push({ type: 'tag', value: tm[0].toLowerCase() });
  }
  return tokens;
}

function selectorIsUsed(selector) {
  // Keep pseudo-only selectors, keyframe names, @-rules, etc.
  if (/^@/.test(selector) || selector.startsWith(':') || /^\d+%$/.test(selector.trim())) return true;
  // Strip pseudo-elements / pseudo-classes for token analysis
  const stripped = selector.replace(/::?[A-Za-z-]+(\([^)]*\))?/g, '').trim();
  if (!stripped) return true;
  const tokens = extractSelectorTokens(stripped);
  if (tokens.length === 0) {
    // No class/id/tag — could be '*' or attribute selector. Keep.
    return true;
  }
  // A selector is "used" if AT LEAST ONE of its compound token sets
  // has a recognizable used class/id/tag. This is conservative — we
  // keep a rule if any branch is potentially live.
  // We split on commas (multiple selectors).
  return true; // handled at comma level below
}

const KNOWN_TAGS = new Set([
  'html','body','head','main','header','footer','nav','section','article','aside',
  'form','img','a','p','ul','ol','li','table','tr','td','th','input','button',
  'select','label','h1','h2','h3','h4','h5','h6','span','div','small','strong',
  'b','em','i','svg','path','g','circle','rect','line','polyline','polygon',
  'title','desc','use','symbol','defs','br','hr','pre','code','blockquote',
  'figure','figcaption','details','summary','dialog','picture','source','video',
  'audio','canvas','iframe','object','embed','map','area','time','mark','ruby',
  'rt','rp','bdi','bdo','wbr','kbd','samp','var','cite','q','abbr','address',
  'dl','dt','dd','caption','thead','tbody','tfoot','colgroup','col','fieldset',
  'legend','optgroup','option','textarea','output','progress','meter','datalist',
  'keygen','style','script','link','meta','base','title',
]);

function checkSingleSelector(sel) {
  if (/^@/.test(sel) || sel.startsWith(':') || /^\d+%$/.test(sel.trim())) return true;
  const stripped = sel.replace(/::?[A-Za-z-]+(\([^)]*\))?/g, '').trim();
  if (!stripped) return true;
  const tokens = extractSelectorTokens(stripped);
  if (tokens.length === 0) return true;
  // Require: every class token must be used OR there is at least one
  // "anchor" (used class/id/tag). Conservative: keep if unsure.
  // We require at least one recognizable used token; otherwise drop.
  const used = tokens.filter(t =>
    (t.type === 'class' && usedClasses.has(t.value)) ||
    (t.type === 'id' && usedIds.has(t.value)) ||
    (t.type === 'tag' && (usedTags.has(t.value) || KNOWN_TAGS.has(t.value)))
  );
  if (used.length === 0) {
    // No anchor at all — likely dead
    return false;
  }
  return true;
}

function filterRuleList(body) {
  // Split top-level selectors by comma, preserving nested parens
  const kept = [];
  const parts = [];
  let depth = 0, buf = '';
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === '(' || c === '[') depth++;
    else if (c === ')' || c === ']') depth--;
    if (c === ',' && depth === 0) { parts.push(buf); buf = ''; }
    else buf += c;
  }
  if (buf.trim()) parts.push(buf);
  for (const p of parts) {
    const trimmed = p.trim();
    if (!trimmed) continue;
    if (checkSingleSelector(trimmed)) kept.push(trimmed);
  }
  return kept.join(',');
}

function processCSS(css) {
  // Walk the top-level structure: rules, @media, @supports, @keyframes
  let out = '';
  let i = 0;
  const n = css.length;
  while (i < n) {
    // Skip whitespace
    if (/\s/.test(css[i])) { out += css[i]; i++; continue; }
    // Comment?
    if (css[i] === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      if (end === -1) { out += css.slice(i); break; }
      i = end + 2;
      continue;
    }
    // @-rule?
    if (css[i] === '@') {
      // Read until { or ; at depth 0
      let header = '';
      let j = i;
      while (j < n && css[j] !== '{' && css[j] !== ';') header += css[j++];
      if (css[j] === ';') { out += header + ';'; i = j + 1; continue; }
      // Block @-rule (e.g. @media, @supports, @keyframes)
      // Find matching close brace
      let depth = 1; j++; // skip {
      let bodyStart = j;
      while (j < n && depth > 0) {
        if (css[j] === '{') depth++;
        else if (css[j] === '}') depth--;
        if (depth > 0) j++;
      }
      const body = css.slice(bodyStart, j);
      // Is this @keyframes? Keep body verbatim
      if (/@keyframes/i.test(header) || /@font-face/i.test(header) || /@-webkit-keyframes/i.test(header)) {
        out += header + '{' + body + '}';
      } else {
        // @media / @supports: recurse into body
        const inner = processCSS(body);
        // Only keep wrapper if inner has any rule (not empty)
        if (inner.trim() && /[{]/.test(inner)) {
          out += header + '{' + inner + '}';
        }
      }
      i = j + 1;
      continue;
    }
    // Normal rule: selector { body }
    let header = '';
    let j = i;
    while (j < n && css[j] !== '{') header += css[j++];
    if (j >= n) { out += header; break; }
    let depth = 1; j++;
    let bodyStart = j;
    while (j < n && depth > 0) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
      if (depth > 0) j++;
    }
    const body = css.slice(bodyStart, j);
    const newSel = filterRuleList(header);
    if (newSel) {
      out += newSel + '{' + body + '}';
    }
    i = j + 1;
  }
  return out;
}

// ---------- 3. Run ----------

let totalSaved = 0;
for (const target of TARGETS) {
  if (!fs.existsSync(target)) {
    console.warn(`[purgecss] skip missing: ${target}`);
    continue;
  }
  const before = fs.readFileSync(target, 'utf8');
  const beforeSize = before.length;
  const after = processCSS(before);
  const afterSize = after.length;
  fs.writeFileSync(target, after, 'utf8');
  const saved = beforeSize - afterSize;
  totalSaved += saved;
  console.log(
    `[purgecss] ${path.relative(ROOT, target).padEnd(30)}  ` +
    `${(beforeSize / 1024).toFixed(1).padStart(6)} KB -> ` +
    `${(afterSize / 1024).toFixed(1).padStart(6)} KB  ` +
    `(saved ${(saved / 1024).toFixed(1).padStart(5)} KB)`
  );
}
console.log(`[purgecss] Total saved: ${(totalSaved / 1024).toFixed(1)} KB`);
