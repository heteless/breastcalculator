#!/usr/bin/env node
/**
 * Pretty-print every HTML file under the project root (4-space indent).
 *
 * Strategy:
 *  1. Extract raw blocks that must be preserved verbatim (script/style/pre/textarea),
 *     HTML comments, and DOCTYPE, replacing each with a unique placeholder.
 *  2. Tokenize the remainder into tags, text, and CDATA.
 *  3. Render the token stream with 4-space indent, putting every block-level
 *     tag on its own line, keeping inline-only elements (`<a>`, `<span>`, etc.)
 *     on the same line as their text content, and treating void elements
 *     (`<meta>`, `<img>`, ...) as self-contained single-line tags.
 *  4. Restore placeholders back into the final output.
 *
 * Non-destructive by default. Pass `--write` to persist changes.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'dist-dryrun', '.wrangler', '.tmp-gen']);
const SKIP_FILES = new Set(['header.html', 'footer.html', 'header-wellness-popup.html']);

const INLINE_TAGS = new Set([
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'dfn', 'em', 'i', 'img',
  'input', 'kbd', 'label', 'mark', 'q', 's', 'small', 'span', 'strong', 'sub',
  'sup', 'time', 'title', 'u', 'var', 'wbr'
]);
const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr'
]);

// -------- helpers --------

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.html') && !SKIP_FILES.has(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/** Tokenize an HTML string into a stream of tokens. */
function tokenize(html) {
  const tokens = [];
  let i = 0;
  const n = html.length;
  while (i < n) {
    const lt = html.indexOf('<', i);
    if (lt === -1) {
      const rest = html.slice(i);
      if (rest.trim()) tokens.push({ type: 'text', value: rest.trim() });
      break;
    }
    if (lt > i) {
      const chunk = html.slice(i, lt);
      const trimmed = chunk.replace(/\s+/g, ' ').trim();
      if (trimmed) tokens.push({ type: 'text', value: trimmed });
    }
    // Comment
    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt + 4);
      const stop = end === -1 ? n : end + 3;
      tokens.push({ type: 'comment', value: html.slice(lt, stop) });
      i = stop;
      continue;
    }
    // Doctype
    if (html.startsWith('<!', lt)) {
      const end = html.indexOf('>', lt);
      const stop = end === -1 ? n : end + 1;
      tokens.push({ type: 'raw', value: html.slice(lt, stop) });
      i = stop;
      continue;
    }
    // Tag (open, close, or self-closing)
    const end = html.indexOf('>', lt);
    if (end === -1) {
      // Malformed — emit the rest as raw and stop.
      tokens.push({ type: 'text', value: html.slice(lt).trim() });
      break;
    }
    const raw = html.slice(lt, end + 1);
    const inner = raw.slice(1, -1).trim();
    if (inner.startsWith('/')) {
      tokens.push({ type: 'close', name: inner.slice(1).split(/[\s>]/)[0].toLowerCase(), value: raw });
    } else {
      const selfClose = inner.endsWith('/');
      const m = inner.replace(/\/$/, '').match(/^([a-zA-Z][\w-]*)/);
      const name = (m ? m[1] : '').toLowerCase();
      tokens.push({
        type: 'open',
        name,
        selfClose: selfClose || VOID_TAGS.has(name),
        value: raw,
      });
    }
    i = end + 1;
  }
  return tokens;
}

/** Render tokens into a pretty-printed string with 4-space indent. */
function render(tokens) {
  const INDENT = '    ';
  const lines = [];
  let depth = 0;
  // Inline buffer: text and inline tags that should be flushed together at
  // the current block depth.
  let buf = '';
  let bufDepth = 0; // Indent for the buffer (== current block depth)
  const indentStr = (d) => INDENT.repeat(Math.max(0, d));

  function flush() {
    if (!buf) return;
    lines.push(indentStr(bufDepth) + buf);
    buf = '';
  }

  // Stack of parent elements: { name, isInline, depth }
  const stack = [];

  for (let idx = 0; idx < tokens.length; idx++) {
    const t = tokens[idx];
    if (t.type === 'raw') {
      flush();
      lines.push(t.value);
    } else if (t.type === 'comment') {
      flush();
      lines.push(indentStr(depth) + t.value);
    } else if (t.type === 'text') {
      buf = (buf ? buf + ' ' : '') + t.value;
    } else if (t.type === 'open') {
      const isInline = INLINE_TAGS.has(t.name);
      if (t.selfClose) {
        // Void/self-closing — emit on a new line at current depth.
        flush();
        lines.push(indentStr(depth) + t.value);
      } else if (isInline) {
        // Open inline tag inside the buffer at the current block depth.
        buf = (buf ? buf + ' ' : '') + t.value;
        stack.push({ name: t.name, isInline: true });
      } else {
        // Block-level open.
        flush();
        lines.push(indentStr(depth) + t.value);
        stack.push({ name: t.name, isInline: false });
        depth++;
        bufDepth = depth;
      }
    } else if (t.type === 'close') {
      // Find the matching parent in the stack.
      let isInline = INLINE_TAGS.has(t.name);
      for (let p = stack.length - 1; p >= 0; p--) {
        if (stack[p].name === t.name) {
          isInline = stack[p].isInline;
          stack.splice(p, 1);
          if (!isInline) {
            depth = stack.filter((s) => !s.isInline).length;
            bufDepth = depth;
          }
          break;
        }
      }
      if (isInline) {
        // Close inline tag inside the buffer.
        buf = (buf ? buf : '') + t.value;
      } else {
        // Block-level close.
        flush();
        lines.push(indentStr(depth) + t.value);
      }
    }
  }
  if (buf) {
    lines.push(indentStr(bufDepth) + buf);
  }
  return lines.join('\n') + '\n';
}

/** Pre-extract verbatim blocks (script/style/pre/textarea) and comments. */
function extractVerbatim(input) {
  const store = new Map();
  let counter = 0;
  const place = (raw) => {
    const key = `\u0000V${counter++}\u0000`;
    store.set(key, raw);
    return key;
  };
  let out = input;
  // script
  out = out.replace(/<script\b[\s\S]*?<\/script>/gi, (m) => place(m));
  out = out.replace(/<style\b[\s\S]*?<\/style>/gi, (m) => place(m));
  out = out.replace(/<pre\b[\s\S]*?<\/pre>/gi, (m) => place(m));
  out = out.replace(/<textarea\b[\s\S]*?<\/textarea>/gi, (m) => place(m));
  return { out, store };
}

function restoreVerbatim(output, store) {
  return output.replace(/\u0000V(\d+)\u0000/g, (_, k) => {
    const val = store.get(`\u0000V${k}\u0000`);
    return val == null ? `\u0000V${k}\u0000` : val;
  });
}

function pretty(input) {
  // 1. Extract verbatim blocks. We don't process their content.
  const { out: stripped, store } = extractVerbatim(input);
  // 2. Normalize the rest: ensure one tag per "block" — flatten the inter-tag
  // whitespace run into a single space so the tokenizer doesn't emit empty text.
  const normalized = stripped
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ');
  // 3. Tokenize + render.
  const tokens = tokenize(normalized);
  const rendered = render(tokens);
  // 4. Restore verbatim blocks.
  return restoreVerbatim(rendered, store);
}

// -------- main --------

function main() {
  const args = new Set(process.argv.slice(2));
  const write = args.has('--write') || args.has('-w');
  const dryRun = !write;
  const files = walk(ROOT);
  let changed = 0;
  let skipped = 0;
  for (const f of files) {
    const before = fs.readFileSync(f, 'utf8');
    const after = pretty(before);
    if (after === before) {
      skipped++;
      continue;
    }
    if (dryRun) {
      console.log(`[DRY] ${path.relative(ROOT, f)}  (${before.length} -> ${after.length} bytes)`);
    } else {
      fs.writeFileSync(f, after, 'utf8');
      console.log(`[OK]  ${path.relative(ROOT, f)}  (${before.length} -> ${after.length} bytes)`);
    }
    changed++;
  }
  console.log(`\nFiles scanned: ${files.length}  changed: ${changed}  unchanged: ${skipped}  mode: ${dryRun ? 'dry-run' : 'write'}`);
}

if (require.main === module) main();

module.exports = { pretty, walk, tokenize, render, extractVerbatim, restoreVerbatim };
