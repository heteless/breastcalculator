// scripts/format-html.js
//
// Pretty-prints all source HTML files so they are human-readable.
// Splits minified single-line HTML into properly indented multi-line
// output. Preserves <script>, <style>, <pre>, and <textarea> content.
// Formats JSON-LD blocks with indentation.
//
// Why this exists
// ---------------
// optimize.js previously minified source HTML in place, collapsing
// every file to one unreadable line. optimize.js now only targets
// dist/, so source files can stay readable. This script restores
// readability for existing files.
//
// Idempotent — running it on already-formatted HTML is a no-op
// (output is stable).

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'scripts', '.wrangler', '.vscode', 'dist', 'dist-dryrun']);

// HTML void elements — never have children, don't increase indent.
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

// Elements whose content should be preserved verbatim.
const RAW_ELEMENTS = new Set(['script', 'style', 'pre', 'textarea']);

// Inline elements that can stay on the same line as surrounding text.
// We still split them onto their own lines for consistency, but we
// merge empty inline elements (`<span></span>` → one line).
const INLINE_ELEMENTS = new Set([
  'a', 'abbr', 'b', 'bdi', 'bdo', 'cite', 'code', 'data', 'dfn',
  'em', 'i', 'kbd', 'mark', 'q', 'rp', 'rt', 'ruby', 's', 'samp',
  'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var',
  'wbr',
]);

function formatHTML(html) {
  // ---- Step 1: Extract raw blocks (script/style/pre/textarea) ----
  const rawBlocks = [];
  const placeholder = (block) => {
    const idx = rawBlocks.length;
    rawBlocks.push(block);
    return `\x00RAW${idx}\x00`;
  };

  // Match <script ...>...</script>, <style>...</style>, etc.
  // Non-greedy content match; handles empty content too.
  html = html.replace(
    /<(script|style|pre|textarea)\b([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag, attrs, content) => placeholder({ tag: tag.toLowerCase(), attrs, content })
  );

  // ---- Step 2: Split into tokens (tags, text, comments, placeholders) ----
  // Split on tags while keeping them.
  const tokens = html.split(/(<[^>]+>|\x00RAW\d+\x00)/g).filter(Boolean);

  // ---- Step 3: Build indented output ----
  const lines = [];
  let indent = 0;

  const pushLine = (text) => {
    lines.push('  '.repeat(Math.max(0, indent)) + text);
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();
    if (!token) continue;

    // Raw block placeholder
    const rawMatch = token.match(/^\x00RAW(\d+)\x00$/);
    if (rawMatch) {
      const block = rawBlocks[parseInt(rawMatch[1])];
      const openTag = `<${block.tag}${block.attrs}>`;
      const closeTag = `</${block.tag}>`;
      const content = block.content.trim();

      if (!content) {
        // Empty: <script></script> on one line
        pushLine(openTag + closeTag);
        continue;
      }

      pushLine(openTag);

      // Format JSON-LD content
      if (block.tag === 'script' && /^\s*\{[\s\S]*\}\s*$/.test(content)) {
        try {
          const parsed = JSON.parse(content);
          const formatted = JSON.stringify(parsed, null, 2);
          for (const cl of formatted.split('\n')) {
            lines.push('  '.repeat(Math.max(0, indent + 1)) + cl);
          }
        } catch {
          lines.push('  '.repeat(Math.max(0, indent + 1)) + content);
        }
      } else if (block.tag === 'style') {
        // Lightly format CSS: each rule on its own line
        const css = content
          .replace(/\s*\{\s*/g, ' { ')
          .replace(/\s*\}\s*/g, ' } ')
          .replace(/\s*;\s*/g, '; ')
          .replace(/;\s+\}/g, ' }')
          .trim();
        // Split rules onto separate lines
        const cssParts = css.split('}').filter(s => s.trim()).map(s => s.trim() + ' }');
        for (const cl of cssParts) {
          lines.push('  '.repeat(Math.max(0, indent + 1)) + cl);
        }
      } else {
        // Preserve other raw content (pre, textarea, inline JS)
        for (const cl of content.split('\n')) {
          const trimmed = cl.trim();
          if (trimmed) {
            lines.push('  '.repeat(Math.max(0, indent + 1)) + trimmed);
          }
        }
      }

      pushLine(closeTag);
      continue;
    }

    // Comment
    if (token.startsWith('<!--')) {
      pushLine(token);
      continue;
    }

    // DOCTYPE or XML declaration
    if (token.startsWith('<!')) {
      pushLine(token);
      continue;
    }

    // Closing tag
    if (token.startsWith('</')) {
      const tagName = token.match(/^<\/(\w+)/);
      if (tagName) {
        const name = tagName[1].toLowerCase();
        if (!VOID_ELEMENTS.has(name)) {
          indent = Math.max(0, indent - 1);
        }
      }
      pushLine(token);
      continue;
    }

    // Opening tag or self-closing tag
    const tagMatch = token.match(/^<(\w+)/);
    if (tagMatch) {
      const tagName = tagMatch[1].toLowerCase();
      const isSelfClosing = token.endsWith('/>') || VOID_ELEMENTS.has(tagName);

      // Check if next meaningful token is the matching closing tag
      // (empty element like <div></div> or <p></p>)
      const nextToken = (tokens[i + 1] || '').trim();
      const closeTag = `</${tagName}>`;
      if (!isSelfClosing && nextToken === closeTag) {
        pushLine(token + closeTag);
        i++; // skip the closing tag
        continue;
      }

      pushLine(token);
      if (!isSelfClosing) {
        indent++;
      }
      continue;
    }

    // Text content
    if (token) {
      pushLine(token);
    }
  }

  return lines.join('\n') + '\n';
}

// ---------- File scanning ----------

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    if (entry.name.startsWith('.') && entry.name !== '.well-known') continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

// ---------- Main ----------

const files = walk(ROOT);
let touched = 0;
let skipped = 0;

for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  const after = formatHTML(before);
  if (after === before) {
    skipped++;
    continue;
  }
  fs.writeFileSync(file, after, 'utf8');
  touched++;
  console.log(`[format-html] ${path.relative(ROOT, file)}`);
}

console.log(`[format-html] ${touched} file(s) formatted, ${skipped} skipped (already readable)`);
console.log('[format-html] Done.');
