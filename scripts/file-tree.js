// Generate a complete file tree of the project (excluding .git, node_modules, dist)
const fs = require('fs');
const path = require('path');

const ROOT = 'd:/DevProject/breastcalculator';
const SKIP = new Set(['.git', 'node_modules', 'dist', 'dist-dryrun', '.wrangler', '.vscode', '.tmp-gen', '.cloudflare', '.DS_Store']);

function tree(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => !SKIP.has(e.name))
    .sort((a, b) => a.isDirectory() === b.isDirectory() ? a.name.localeCompare(b.name) : a.isDirectory() ? -1 : 1);
  const lines = [];
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const last = i === entries.length - 1;
    const branch = last ? '└── ' : '├── ';
    const size = e.isFile() ? (() => { try { return fs.statSync(path.join(dir, e.name)).size; } catch { return 0; } })() : 0;
    const ext = e.isFile() ? path.extname(e.name).slice(1) : '';
    const sz = e.isFile() ? `  [${size.toLocaleString().padStart(8)}B ${ext.padEnd(4)}]` : '';
    lines.push(`${prefix}${branch}${e.name}${e.isDirectory() ? '/' : sz}`);
    if (e.isDirectory()) {
      lines.push(...tree(path.join(dir, e.name), prefix + (last ? '    ' : '│   ')));
    }
  }
  return lines;
}

const t = tree(ROOT);
const out = ['breastcalculator/  (project root)', ...t, '', `Total entries: ${t.length}`].join('\n');
fs.writeFileSync('.file-tree.txt', out, 'utf8');
console.log(out);
console.log(`\nWrote .file-tree.txt  (${out.length} bytes)`);
