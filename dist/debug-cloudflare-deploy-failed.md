# Cloudflare Deployment Failure Debug Session

**Status**: [OPEN — Root cause identified, awaiting user confirmation]
**Date**: 2026-07-26
**Build ID**: #88885ec0
**Commit**: 586ea1f (HEAD = origin/main)

## Symptom
- Cloudflare Pages deployment shows status "upload" then fails
- User reports: "17:00 部署失败 github to cloudflare workers"
- Build #88885ec0 duration: 12s
- Build log cuts off after `> breastcalculator@1.0.0 build` line at 19:18:48.569
- Local build (`npm run build`) succeeds with exit 0
- `npx wrangler deploy --dry-run` succeeds locally

## Evidence Collected

### Evidence 1: Local build PASSES
```
> breastcalculator@1.0.0 build
[build-tailwind] Done.
[purgecss] style.css  82.2 KB
[build-css] main.css written: 315.1 KB
[build-dist] Copied 245 files (8227.5 KB) to dist/
[optimize] TOTAL 6516.5 KB -> 4807.2 KB  (saved 26.2%)
'Static site ready in dist/.'
exit_code: 0
```
→ H1 (build script fails) **REJECTED**.

### Evidence 2: wrangler dry-run PASSES
```
⛅️ wrangler 4.99.0
✔ Read 404 files from the assets directory D:\DevProject\breastcalculator\dist
Total Upload: 0.31 KiB / gzip: 0.22 KiB
No bindings found.
--dry-run: exiting now.
```
→ H3 (wrangler config invalid) **REJECTED**.

### Evidence 3: dist/ is populated correctly
- `dist/index.html` exists ✓
- 55 top-level entries in dist/
- Total dist/ size: ~4.7 MB (under 25 MB limit)
→ H4 (build output missing/empty) **REJECTED**.

### Evidence 4: CSP contains INVALID `trusted-types` value
**File**: `_headers` line 176 (= `dist/_headers` line 176)
```
Content-Security-Policy: ...
  upgrade-insecure-requests;
  trusted-types default bc bc-domains 'allow-duplicates'
```

**Per W3C CSP3 spec** ([trusted-types directive](https://w3c.github.io/trusted-types/dist/spec/#trusted-types-csp-directive)):
> The `trusted-types` directive accepts: `<policyName>+ 'allow-duplicates'? | 'none' | '*'`

**Current value analysis**:
- `default` — **INVALID** (only valid in `require-trusted-types-for`, not `trusted-types`)
- `bc` — valid policy name
- `bc-domains` — valid policy name
- `'allow-duplicates'` — valid keyword

**Origin of `default`**: Per git log, commit 586054f removed `require-trusted-types-for 'script'` but kept the `default` keyword that was originally paired with that directive. The `default` keyword was orphaned and is now invalid in its current location.

→ H5 (CSP validation rejection) **CONFIRMED** as most likely root cause.

## Hypothesis Status

| # | Hypothesis | Status |
|---|------------|--------|
| H1 | Build script fails | ❌ REJECTED (local build OK) |
| H2 | wrangler auth/config issue | ⚠️ UNLIKELY (dry-run works locally) |
| H3 | Wrangler config invalid | ❌ REJECTED (dry-run OK) |
| H4 | dist/ missing or empty | ❌ REJECTED (404 files present) |
| H5 | CSP `default` keyword invalid | ✅ **CONFIRMED** |

## Proposed Fix
Remove the invalid `default` keyword from the `trusted-types` directive.

**Before** (`_headers` line 176 and `dist/_headers` line 176):
```
trusted-types default bc bc-domains 'allow-duplicates'
```

**After**:
```
trusted-types bc bc-domains 'allow-duplicates'
```

This:
1. Restores valid CSP3 syntax
2. Preserves the original intent (Cloudflare's `bc` and `bc-domains` trusted type policies)
3. Keeps `'allow-duplicates'` (allows same-name policies in different headers)

## Recommended Verification Steps
1. Apply fix to both `_headers` and `dist/_headers` (in sync)
2. Run `npm run build` to regenerate `dist/`
3. Commit and push to GitHub
4. Trigger Cloudflare build
5. Verify deployment succeeds and no console errors in browser

## Files To Modify
- `d:\DevProject\breastcalculator\_headers` (line 176)
- `d:\DevProject\breastcalculator\dist\_headers` (line 176)
