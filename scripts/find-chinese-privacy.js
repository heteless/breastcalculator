const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const filesToProcess = [
  'index.html',
  'breast-expansion-calculator/index.html',
  'breast-ptosis-calculator/index.html',
  'breast-shape-calculator/index.html',
  'breast-volume-calculator/index.html',
  'breast-weight-calculator/index.html',
  'length-converter/index.html',
  'weight-converter/index.html'
];

const cjkRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\uff00-\uffef]/g;
const heartEmojiRegex = /[\u2764\u2764\u2763]/g;

filesToProcess.forEach(relativePath => {
  const filePath = path.join(toolsDir, relativePath);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  const cjkMatches = content.match(cjkRegex);
  const heartMatches = content.match(heartEmojiRegex);
  
  if (cjkMatches && cjkMatches.length > 0) {
    console.log(`\n=== ${relativePath} ==`);
    console.log(`Found ${cjkMatches.length} CJK characters`);
    
    // Find context around CJK characters
    let lastPos = 0;
    while ((match = cjkRegex.exec(content)) !== null) {
      const start = Math.max(0, match.index - 30);
      const end = Math.min(content.length, match.index + 30);
      const context = content.substring(start, end);
      console.log(`\nContext around position ${match.index}:`);
      console.log(`...${context}...`);
      lastPos = match.index;
      if (match.index - lastPos > 100) break;
    }
  }
  
  if (heartMatches && heartMatches.length > 0) {
    console.log(`\n${relativePath} - Found ${heartMatches.length} heart emojis`);
  }
});

console.log('\nDone!');
