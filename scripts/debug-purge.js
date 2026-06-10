const { PurgeCSS } = require('purgecss');
const path = require('path');
const fs = require('fs');
const ROOT = 'd:/DevProject/breastcalculator';
const toPosix = (p) => p.replace(/\\/g, '/');
const config = require(path.join(ROOT, 'purgecss.config.cjs'));

(async () => {
  const targetCss = path.join(ROOT, config.css[0]);
  let workingContent = fs.readFileSync(targetCss, 'utf8');
  const beforeSize = fs.statSync(targetCss).size;
  console.log('Before size:', beforeSize);

  /* Apply pre-fix */
  const firstRoot = workingContent.match(/^:root\{[^}]*\}/);
  if (firstRoot) {
    const insertPos = firstRoot.index + firstRoot[0].length;
    if (!workingContent.substring(insertPos).startsWith(':root{') && /^\s*--/.test(workingContent.substring(insertPos))) {
      workingContent = workingContent.substring(0, insertPos) + ':root{' + workingContent.substring(insertPos);
      fs.writeFileSync(targetCss, workingContent);
      console.log('Pre-fixed file (size now:', fs.statSync(targetCss).size, ')');
    }
  }

  const cssList = [toPosix(path.join(ROOT, config.css[0]))];
  const contentList = config.content.map((p) => toPosix(path.join(ROOT, p)));

  const purge = new PurgeCSS();
  try {
    const result = await purge.purge({
      content: contentList,
      css: cssList,
      output: toPosix(path.join(ROOT, config.css[0])),
      safelist: config.safelist,
      keyframes: config.keyframes,
      variables: config.variables,
      fontFace: config.fontFace,
    });
    console.log('Result length:', result.length);
    console.log('In-memory result css length:', result[0].css.length);
    const afterSize = fs.statSync(targetCss).size;
    console.log('After size (on disk):', afterSize);
    console.log('Reduction:', beforeSize - afterSize, 'bytes (', (((beforeSize - afterSize) / beforeSize) * 100).toFixed(1), '%)');
  } catch (e) {
    console.log('Error:', e.message);
  }
})();
