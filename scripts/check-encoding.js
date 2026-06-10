const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../tools/breast-weight-calculator/index.html');
const content = fs.readFileSync(filePath, 'utf8');

// 检查乱码字符的上下文
const cjkRegex = /[\u4e00-\u9fff]/g;
let match;
let count = 0;

while ((match = cjkRegex.exec(content)) !== null && count < 5) {
  const start = Math.max(0, match.index - 30);
  const end = Math.min(content.length, match.index + 30);
  const context = content.substring(start, end);
  console.log(`\nPosition ${match.index}:`);
  console.log(`Context: "${context}"`);
  console.log(`Character: "${match[0]}" (code: ${match[0].charCodeAt(0).toString(16)})`);
  count++;
}

console.log(`\nTotal CJK characters found: ${content.match(cjkRegex)?.length || 0}`);
