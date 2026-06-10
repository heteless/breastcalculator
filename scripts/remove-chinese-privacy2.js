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

// 匹配包含中文隐私文本的 span 标签及其内容
const chinesePrivacyRegex = /<span class="psb-privacy-zh"[^>]*>[\s\S]*?<\/span>/g;

filesToProcess.forEach(relativePath => {
  const filePath = path.join(toolsDir, relativePath);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalLength = content.length;
  
  content = content.replace(chinesePrivacyRegex, '');
  const newLength = content.length;
  
  if (originalLength !== newLength) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Removed Chinese privacy text from: ${relativePath}`);
    console.log(`  Characters removed: ${originalLength - newLength}`);
  } else {
    console.log(`No Chinese privacy text found in: ${relativePath}`);
  }
});

console.log('\nProcessing complete!');
