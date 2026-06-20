// Add BreadcrumbList JSON-LD to /tools/ page
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'tools', 'index.html');
let c = fs.readFileSync(file, 'utf8');

if (!c.includes('BreadcrumbList')) {
  const breadcrumb = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://breastcalculator.com/"},{"@type":"ListItem","position":2,"name":"Tools","item":"https://breastcalculator.com/tools/"}]}</script>`;
  c = c.replace('</head>', breadcrumb + '\n</head>');
  fs.writeFileSync(file, c, 'utf8');
  console.log('[OK] Added BreadcrumbList to tools/index.html');
} else {
  console.log('[SKIP] tools/index.html already has BreadcrumbList');
}
