// Inspect diff between 5bbf66b and HEAD for a file.
const { execSync } = require('child_process');
const file = process.argv[2] || 'sports-bra-guide/index.html';
const diff = execSync(`git diff 5bbf66b HEAD -- ${file}`, { encoding: 'utf8' });
const lines = diff.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('@@')) {
    console.log('HUNK:', lines[i]);
    let j = i + 1;
    while (j < lines.length && !lines[j].startsWith('@@')) {
      if (lines[j].startsWith('-')) console.log('  -', lines[j].substring(1, 400));
      if (lines[j].startsWith('+')) console.log('  +', lines[j].substring(1, 400));
      j++;
    }
    console.log('---');
  }
}
