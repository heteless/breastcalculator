// Find specific style rules for accessibility-relevant selectors
const fs = require('fs');
const c = fs.readFileSync('style.css', 'utf8');

// Look for specific selector blocks
const selectors = [
  'field-hint', 'btn-primary', 'btn-secondary', 'btn-tool',
  'text-muted', '--text-muted', '--text-light',
  '.text-\\[\\#8b7355\\]', '.text-\\[\\#7a6455\\]',
];

for (const sel of selectors) {
  // Find all occurrences of the selector
  const re = new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  let m;
  while ((m = re.exec(c)) !== null) {
    // Get 200 chars of context
    const start = Math.max(0, m.index - 50);
    const end = Math.min(c.length, m.index + 200);
    console.log(`\n--- ${sel} @ ${m.index} ---`);
    console.log(c.slice(start, end));
  }
}
