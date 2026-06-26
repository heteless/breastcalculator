const fs = require('fs');
const s = fs.readFileSync('style.css', 'utf8');
// Find :root variables
const root = s.indexOf(':root{');
if (root >= 0) {
  const end = s.indexOf('}', root);
  const vars = s.substring(root, end + 1);
  // Extract relevant vars
  const muted = vars.match(/--text-muted:[^;]+/);
  const light = vars.match(/--text-light:[^;]+/);
  const sand = vars.match(/--sand:[^;]+/);
  const sandLight = vars.match(/--sand-light:[^;]+/);
  const border = vars.match(/--border:[^;]+/);
  console.log('vars:', {muted, light, sand, sandLight, border});
}
