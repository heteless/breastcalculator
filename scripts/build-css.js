// scripts/build-css.js
//
// Combines the three CSS files (style.css, tailwind-built.css,
// assets/bra-calculator.css) into a single main.css so the browser
// can fetch one resource instead of three, eliminating the
// render-blocking CSS waterfall that Lighthouse flagged.
//
// Why this exists
// ---------------
// - Old: 3 separate <link rel="stylesheet"> tags → 3 RTTs of render
//   blocking and 3 separate gzipped downloads.
// - New: 1 <link> + 1 preload swap → 1 critical-path CSS request, with
//   the rest loaded asynchronously so the browser can paint the
//   above-the-fold hero before the full stylesheet is parsed.
//
// Idempotent — re-running with the same inputs produces the same output.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const SOURCES = [
  path.join(ROOT, 'tailwind-built.css'),
  path.join(ROOT, 'style.css'),
  path.join(ROOT, 'assets', 'bra-calculator.css'),
];

const OUT = path.join(ROOT, 'main.css');

const BANNER = `/*!
 * main.css — combined stylesheet for breastcalculator.com
 *   ├── tailwind-built.css  (Tailwind utilities, purged)
 *   ├── style.css           (site chrome, components, theme)
 *   └── assets/bra-calculator.css  (calculator page styles)
 * Loaded once via preload + onload swap; see header partial for the
 * <link> pattern.
 */
`;

// Post-process combined CSS to eliminate non-composited border-color animations.
// - Removes `,border-color` from `transition-property:` lists (Tailwind's `*` and `.transition-colors`).
// - Neutralizes Tailwind's `.hover\:border-\[\#6b5344\]:hover` rule (overridden by style.css box-shadow rule).
function removeBorderColorAnimations(css) {
  let out = css;
  let removed = 0;

  // 1) Remove `,border-color` and `border-color,` from transition-property declarations.
  //    Allow optional spaces for both minified and unminified CSS.
  out = out.replace(/transition-property:\s*([^;}]*),\s*border-color\s*([^;}]*)([;}])/g, (m, before, after, term) => {
    removed++;
    return `transition-property:${before}${after}${term}`;
  });
  out = out.replace(/transition-property:\s*border-color\s*,\s*([^;}]*)([;}])/g, (m, rest, term) => {
    removed++;
    return `transition-property:${rest}${term}`;
  });

  // 2) Neutralize Tailwind hover:border-[#6b5344]:hover rule (sets border-color, overridden by style.css)
  //    Replace the border-color declaration with transparent so the rule is harmless.
  out = out.replace(
    /border-color:\s*rgb\(\s*107\s+83\s+68\s*\/\s*var\(--tw-border-opacity,\s*1\)\s*\)/g,
    (m) => { removed++; return 'border-color:transparent'; }
  );

  console.log(`[build-css] border-color animations neutralized: ${removed}`);
  return out;
}

function build() {
  let total = 0;
  const parts = [BANNER];
  for (const p of SOURCES) {
    if (!fs.existsSync(p)) {
      console.warn(`[build-css] missing source: ${p}`);
      continue;
    }
    const content = fs.readFileSync(p, 'utf8');
    parts.push(`\n/* ─── ${path.basename(p)} (${content.length} B) ─── */\n`);
    parts.push(content);
    parts.push('\n');
    total += content.length;
    console.log(`[build-css] + ${path.relative(ROOT, p).padEnd(38)} ${(content.length / 1024).toFixed(1).padStart(6)} KB`);
  }
  let out = parts.join('');
  out = removeBorderColorAnimations(out);
  fs.writeFileSync(OUT, out, 'utf8');
  console.log(`[build-css] main.css written: ${(out.length / 1024).toFixed(1)} KB (${(total / 1024).toFixed(1)} KB combined sources)`);
}

build();
