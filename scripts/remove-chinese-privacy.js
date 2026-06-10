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

const chinesePrivacyText = '💕 您的隐私，由您做主。所有测量数据仅在您本地浏览器中计算，绝不存储、绝不上传、绝不分享。关闭页面后，一切却然消失。 您的身体，您的数据，您做主。';

filesToProcess.forEach(relativePath => {
  const filePath = path.join(toolsDir, relativePath);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes(chinesePrivacyText)) {
    const originalLength = content.length;
    content = content.replace(chinesePrivacyText, '');
    const newLength = content.length;
    const removedLength = originalLength - newLength;
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Removed Chinese privacy text from: ${relativePath}`);
    console.log(`  Characters removed: ${removedLength}`);
  } else {
    console.log(`No Chinese privacy text found in: ${relativePath}`);
  }
});

console.log('\nProcessing complete!');
