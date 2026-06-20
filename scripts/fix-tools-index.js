// Add description and H1 to /tools/ page
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'tools', 'index.html');
let c = fs.readFileSync(file, 'utf8');
let changed = false;

// 1. Add description before robots meta
if (!c.includes('name="description"')) {
  const robotsRe = /<meta name="robots" content="[^"]*"[^>]*>/i;
  if (robotsRe.test(c)) {
    c = c.replace(robotsRe, '<meta name="description" content="Free breast calculator tools: volume, weight, shape, expansion, and ptosis calculators. Science-based, mobile-friendly, no registration."/>' + '\n$&');
    changed = true;
    console.log('  + description added');
  }
}

// 2. Add H1 at start of body content
if (!/<h1[\s\S]*?<\/h1>/i.test(c)) {
  // Try a simpler approach: insert H1 after the first <p class= that mentions Redirecting
  const redirectRe = /(<body[^>]*>[\s\S]*?)(<p class="text-\[#7a6455\] mb-4">)/;
  if (redirectRe.test(c)) {
    c = c.replace(redirectRe, '$1<h1>Breast Health Tools &amp; Calculators</h1>\n$2');
    changed = true;
    console.log('  + H1 added');
  } else {
    // Try simpler: insert after body
    const bodyRe = /(<body[^>]*>)(?!<h1)/;
    if (bodyRe.test(c)) {
      c = c.replace(bodyRe, '$1<h1>Breast Health Tools &amp; Calculators</h1>');
      changed = true;
      console.log('  + H1 added (after body)');
    }
  }
}

if (changed) {
  fs.writeFileSync(file, c, 'utf8');
  console.log('[OK] tools/index.html updated');
} else {
  console.log('[NOOP] tools/index.html no changes needed');
}

// Verify
const updated = fs.readFileSync(file, 'utf8');
console.log('  has description:', updated.includes('name="description"'));
console.log('  has H1:', /<h1[\s\S]*?<\/h1>/i.test(updated));
