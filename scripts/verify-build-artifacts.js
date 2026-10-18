// verify-build-artifacts.js
//
// Regression test for the dist/ build output. Ensures the Cloudflare
// Workers assets directory never ships stale or sensitive files.
//
// What this script does
// ---------------------
//   1. Walks dist/ recursively and flags any file matching these
//      "should never ship" patterns:
//        - *.bak            (backup files, e.g. sitemap.xml.bak)
//        - *.tmp / *.temp   (incomplete writes)
//        - *~               (editor backups)
//        - *.log            (build/debug logs)
//        - *.{ps1,sh,bat}   (scripts that should not be served as web
//                            assets; PowerShell is a Windows-only
//                            side-effect of how the project was
//                            generated, not a deployable asset)
//        - .DS_Store / Thumbs.db / desktop.ini
//        - *.md             (except intentional .well-known/ resources)
//        - development configs, servers, test output and temporary CSS
//      Markdown under .well-known/ and allow-listed agent scripts are
//      explicitly intentional for AI agent discovery.
//
//   2. Cross-checks dist/ HTML files against the allow-list in
//      build-dist.js EXCLUDE_DIRS, to make sure the walker hasn't
//      started shipping node_modules/ or scripts/ by accident.
//
// Idempotent. Operates only on dist/ — never on the source tree.
// Exits 1 on any violation so it can be wired into CI.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Files under these well-known paths are intentional AI-agent
// resources, not "stale build leftovers". The shell scripts in
// agent-skills/dns-aid/ are meant to be fetched and executed by
// agents, so they ARE deployable web assets.
const ALLOWLISTED_PATHS = [
  /^\.well-known\/agent-skills\/.+\.(sh|ps1|bat)$/i,
  /^\.well-known\/.+\.md$/i,
];

const FORBIDDEN_PATTERNS = [
  { re: /\.bak$/i, label: 'backup file (*.bak)' },
  { re: /\.tmp$/i, label: 'temp file (*.tmp)' },
  { re: /\.temp$/i, label: 'temp file (*.temp)' },
  { re: /~$/, label: 'editor backup (*~)' },
  { re: /\.log$/i, label: 'log file (*.log)' },
  { re: /\.(ps1|sh|bat|cmd)$/i, label: 'shell script (not a web asset)' },
  { re: /^(\.DS_Store|Thumbs\.db|desktop\.ini)$/i, label: 'OS metadata file' },
  { re: /\.md$/i, label: 'Markdown document (not a web asset)' },
  { re: /^(tailwind\.config\.js|tailwind-input\.css|purgecss\.config\.cjs|package.*\.json)$/i, label: 'development configuration' },
  { re: /^dev-server\.js$/i, label: 'development server' },
  { re: /^test-output\./i, label: 'test output' },
  { re: /^(_tmp\.css|temp_section29_30\.css)$/i, label: 'temporary CSS' },
  { re: /(^|\/)_dbg\//i, label: 'debug directory' },
];

const FORBIDDEN_PATHS = new Set([
  'bing_index_status.json', 'skills-lock.json', 'footer.html', 'header-wellness-popup.html',
  'assets/bra-calculator-enhance.js', 'assets/section27.css',
]);

const FORBIDDEN_DIRS = new Set([
  'node_modules',
  'scripts',
  '.git',
  'reports',
  'test',
  'tests',
  '__tests__',
  'dist-dryrun',
  '.wrangler',
  '_dbg',
]);

function walk(dir, relBase = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = relBase ? `${relBase}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full, rel));
    } else if (entry.isFile()) {
      out.push({ rel, full, size: entry.size });
    }
  }
  return out;
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error(`[verify-build-artifacts] dist/ does not exist at ${DIST}`);
    console.error('                          Run `npm run build:dist` first.');
    process.exit(1);
  }

  const files = walk(DIST);
  const violations = [];
  const seenDirs = new Set();

  for (const f of files) {
    // Record top-level dirs we landed in
    const top = f.rel.split('/')[0];
    seenDirs.add(top);

    // Skip paths that are explicitly allow-listed (e.g. AI agent
    // skill bundles under .well-known/).
    if (ALLOWLISTED_PATHS.some((re) => re.test(f.rel))) continue;

    if (FORBIDDEN_PATHS.has(f.rel)) {
      violations.push({ rel: f.rel, label: 'excluded source or local input', size: f.size });
      continue;
    }

    for (const { re, label } of FORBIDDEN_PATTERNS) {
      if (re.test(f.rel) || re.test(path.basename(f.rel))) {
        violations.push({ rel: f.rel, label, size: f.size });
        break;
      }
    }
  }

  // Flag any top-level dir that is in the forbidden set
  const dirViolations = [...seenDirs].filter((d) => FORBIDDEN_DIRS.has(d));

  let exitCode = 0;

  console.log(`[verify-build-artifacts] dist/ scanned: ${files.length} files`);

  if (violations.length === 0 && dirViolations.length === 0) {
    console.log('[verify-build-artifacts] ✓ No stale or sensitive files in dist/.');
    console.log('[verify-build-artifacts] ✓ No forbidden top-level directories.');
  } else {
    exitCode = 1;
    if (violations.length > 0) {
      console.error(`[verify-build-artifacts] ✗ ${violations.length} forbidden file(s) in dist/:`);
      for (const v of violations) {
        console.error(`    ${v.rel}  (${v.label}, ${(v.size / 1024).toFixed(1)} KB)`);
      }
    }
    if (dirViolations.length > 0) {
      console.error(`[verify-build-artifacts] ✗ ${dirViolations.length} forbidden top-level dir(s):`);
      for (const d of dirViolations) console.error(`    ${d}/`);
    }
  }

  console.log('[verify-build-artifacts] Done.');
  process.exit(exitCode);
}

main();
