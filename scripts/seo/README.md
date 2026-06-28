# SEO Audit Scripts

Three Python scripts that fix the technical SEO issues surfaced by the
Ahrefs Site Audit (health score 82 → target 95+). Each script maps 1:1 to a
prompt in the audit playbook.

## Setup

```bash
pip install -r scripts/seo/requirements.txt
```

Requires Python 3.10+ (tested on 3.12.10).

## Scripts

### 1. `hreflang_audit.py` — hreflang conflict & reciprocity audit

Scans local HTML (or remote URLs / sitemap) and reports:

- **duplicate_hreflang_code** — same `hreflang` code pointing to multiple URLs on one page
- **missing_return_tag** — A→B declared but B does not declare A back
- **redirect_target / broken_target / noindex_target** — HTTP issues on the href URL
- **fetch_failed** — network error

```bash
# Scan local source HTML (default — scans project root, excludes dist/)
python scripts/seo/hreflang_audit.py

# Skip HTTP probes for a fast structural pass
python scripts/seo/hreflang_audit.py --no-http

# Audit remote URLs from sitemap
python scripts/seo/hreflang_audit.py --sitemap https://breastcalculator.com/sitemap.xml
```

Output: `reports/hreflang_errors.csv`

### 2. `sitemap_cleaner.py` — sitemap.xml cleanup

Removes 4XX/5XX dead links and noindex pages; rewrites 3XX redirects to their
final 200 URL.

```bash
# Dry-run: probe every URL, print summary, write report only
python scripts/seo/sitemap_cleaner.py --dry-run

# Safe output to sitemap_fixed.xml (review, then promote)
python scripts/seo/sitemap_cleaner.py

# In-place: overwrite sitemap.xml (creates sitemap.xml.bak first)
python scripts/seo/sitemap_cleaner.py --in-place
```

Outputs: `sitemap_fixed.xml`, `reports/sitemap_cleaner_report.txt`

### 3. `fix_dead_links.py` — patch broken internal links in source

Reads the Ahrefs "Internal links" CSV export and patches local source files
(`.html`, `.js`, `.vue`, `.md`, `.css`).

Modes for 404 dead links:
- `mark` (default) — report file:line for manual review, no modification
- `void` — replace `href` with `javascript:void(0);`
- `strip` — remove the surrounding `<a>` tag, keeping inner text

For 3XX redirects, the link URL is always replaced with the final 200 URL
(taken from the CSV `final_url` column, or live-resolved with
`--resolve-redirects`).

```bash
# Default — mark dead links for manual review
python scripts/seo/fix_dead_links.py --report ahrefs_links_report.csv

# Replace 3XX with final URLs (live-resolve missing final_url)
python scripts/seo/fix_dead_links.py --report ahrefs.csv --resolve-redirects

# Strip 404 <a> tags, keeping inner text
python scripts/seo/fix_dead_links.py --report ahrefs.csv --mode strip
```

Outputs:
- Backups: `.backup/<timestamp>/<relative-path>`
- Change log: `reports/dead_links_changes.csv`

## Recommended workflow

1. Run `sitemap_cleaner.py --dry-run` first to preview the sitemap health.
2. Run `hreflang_audit.py` to get the per-page hreflang issue list.
3. Export the Ahrefs "Internal links" CSV, then run `fix_dead_links.py --mode mark`.
4. Review `reports/*.csv`, decide which `void` / `strip` actions to apply.
5. Re-run `sitemap_cleaner.py --in-place` once 3XX/4XX are resolved.
6. Re-crawl in Ahrefs to verify health score.

## npm shortcuts

```bash
npm run seo:hreflang         # local scan, with HTTP probes
npm run seo:hreflang:fast    # local scan, --no-http
npm run seo:sitemap:dry      # dry-run probe
npm run seo:sitemap:fix      # write sitemap_fixed.xml
npm run seo:deadlinks        # --mode mark (safe default)
```

Pass extra args with `--`:

```bash
npm run seo:deadlinks -- --report path/to/ahrefs.csv --mode strip
```
