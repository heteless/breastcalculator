#!/usr/bin/env python3
"""
Hreflang Duplicate Remover for breastcalculator.com
====================================================
Consumes reports/hreflang_errors.csv (produced by hreflang_audit.py) and
surgically removes ONLY the wrong duplicate `<link rel="alternate" hreflang=...>`
tags — preserving the correct self-referencing tag.

Which tag is "wrong"?
  For every duplicate_hreflang_code row, the CSV records every unique href URL
  involved. We compare each href_url to the page's canonical source_url:
    • href_url == source_url  → keep (the correct self-referencing tag)
    • href_url != source_url  → remove (the stray duplicate pointing elsewhere)

Why regex instead of BeautifulSoup?
  str(soup) re-serializes the entire document and can flatten whitespace,
  reorder attributes, or mangle inline scripts. This codebase has strict
  formatting rules, so we surgically remove only the offending `<link>` line.

Safety:
  • Per-file backup to .backup/hreflang/<timestamp>/<relative-path>
  • Change log -> reports/hreflang_changes.csv
  • Source files are written only after a successful backup
  • dist/ is excluded (rebuild via `npm run build` after fixing source)

Usage:
  python scripts/seo/fix_hreflang.py
  python scripts/seo/fix_hreflang.py --dry-run
  python scripts/seo/fix_hreflang.py --report reports/hreflang_errors.csv
"""

from __future__ import annotations

import argparse
import csv
import re
import shutil
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Iterable

# ─── Project defaults ────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_REPORT = PROJECT_ROOT / "reports" / "hreflang_errors.csv"
DEFAULT_BACKUP_ROOT = PROJECT_ROOT / ".backup" / "hreflang"
REPORTS_DIR = PROJECT_ROOT / "reports"
CHANGES_CSV = REPORTS_DIR / "hreflang_changes.csv"


def _normalize_url(u: str) -> str:
    """Normalize for comparison: strip trailing slash, lowercase scheme/host."""
    if not u:
        return ""
    u = u.strip().rstrip("/")
    # lowercase scheme and host only
    if "://" in u:
        scheme, rest = u.split("://", 1)
        if "/" in rest:
            host, path = rest.split("/", 1)
            u = f"{scheme.lower()}://{host.lower()}/{path}"
        else:
            u = f"{scheme.lower()}://{rest.lower()}"
    return u


def load_targets(report_path: Path) -> dict[Path, set[str]]:
    """
    Return {source_path: set_of_bad_href_urls_to_remove}.
    Only duplicate_hreflang_code rows are considered; for each row, the
    href_url is "bad" if it differs from the source_url (canonical).
    """
    if not report_path.exists():
        sys.exit(f"[error] report not found: {report_path}. Run `npm run seo:hreflang` first.")

    targets: dict[Path, set[str]] = defaultdict(set)
    with report_path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("issue_type") != "duplicate_hreflang_code":
                continue
            source_path_str = row.get("source_path", "")
            source_url = row.get("source_url", "")
            href_url = row.get("href_url", "")
            if not source_path_str or not href_url:
                continue
            if _normalize_url(href_url) == _normalize_url(source_url):
                continue  # this is the correct self-referencing tag, keep it
            targets[Path(source_path_str)].add(href_url)
    return dict(targets)


def build_pattern(bad_href: str) -> re.Pattern:
    """
    Match a <link> tag whose attributes include BOTH:
      • rel="alternate"   (any order, single or double quotes)
      • href="<bad_href>" (exact URL match)
    Captures the entire line including leading whitespace and trailing newline.
    """
    href_escaped = re.escape(bad_href)
    # Using lookaheads so attribute order does not matter
    return re.compile(
        r'^[ \t]*<link\b'
        r'(?=[^>]*\brel\s*=\s*["\']alternate["\'])'
        r'(?=[^>]*\bhref\s*=\s*["\'])'
        r'(?=[^>]*\bhref\s*=\s*["\'])'  # ensure href exists
        # The actual href value check is done by a tighter sub-pattern below
        r'[^>]*\bhref\s*=\s*["\']' + href_escaped + r'["\'][^>]*/?>'
        r'[ \t]*\r?\n',
        re.MULTILINE,
    )


def remove_bad_links_from_text(text: str, bad_hrefs: set[str]) -> tuple[str, list[str]]:
    """
    Remove every `<link rel="alternate" hreflang=... href="BAD_URL"/>` line
    where BAD_URL is in bad_hrefs. Returns (new_text, list_of_removed_urls).
    """
    removed: list[str] = []
    new_text = text
    for bad_href in bad_hrefs:
        pattern = build_pattern(bad_href)
        matches = pattern.findall(new_text)
        if matches:
            removed.extend([bad_href] * len(matches))
            new_text = pattern.sub("", new_text)
    return new_text, removed


def make_backup(src_file: Path, root: Path, backup_root: Path, ts: str) -> Path:
    rel = src_file.relative_to(root)
    dest = backup_root / ts / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src_file, dest)
    return dest


def write_changes_csv(changes: list[dict], out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = ["file", "removed_url", "backup"]
    with out.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(changes)
    print(f"[done] {len(changes)} change(s) -> {out}")


def main(argv: Iterable[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Remove duplicate hreflang <link> tags flagged by hreflang_audit.py")
    p.add_argument("--report", type=Path, default=DEFAULT_REPORT,
                   help=f"hreflang_errors.csv path (default: {DEFAULT_REPORT})")
    p.add_argument("--backup-root", type=Path, default=DEFAULT_BACKUP_ROOT,
                   help=f"Backup directory (default: {DEFAULT_BACKUP_ROOT})")
    p.add_argument("--dry-run", action="store_true",
                   help="Show what would change without modifying files")
    args = p.parse_args(argv)

    targets = load_targets(args.report)
    if not targets:
        print("[ok] no duplicate hreflang tags to remove")
        return 0

    print(f"[info] {len(targets)} file(s) with duplicate hreflang tags")
    total_links = sum(len(urls) for urls in targets.values())
    print(f"[info] {total_links} bad <link> tag(s) targeted for removal")

    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    changes: list[dict] = []
    modified_count = 0

    for src_file, bad_hrefs in targets.items():
        if not src_file.exists():
            print(f"[warn] file missing, skipped: {src_file}", file=sys.stderr)
            continue

        try:
            text = src_file.read_text(encoding="utf-8", errors="ignore")
        except OSError as e:
            print(f"[warn] read failed {src_file}: {e}", file=sys.stderr)
            continue

        new_text, removed = remove_bad_links_from_text(text, bad_hrefs)
        if not removed:
            print(f"[skip] {src_file} — no matching tag found (already fixed?)")
            continue

        rel = src_file.relative_to(PROJECT_ROOT)
        if args.dry_run:
            for url in removed:
                changes.append({"file": str(rel), "removed_url": url, "backup": "(dry-run)"})
            print(f"[dry-run] would remove {len(removed)} tag(s) from {rel}: {removed}")
            continue

        backup_path = make_backup(src_file, PROJECT_ROOT, args.backup_root, ts)
        src_file.write_text(new_text, encoding="utf-8")
        modified_count += 1
        for url in removed:
            changes.append({
                "file": str(rel),
                "removed_url": url,
                "backup": str(backup_path.relative_to(PROJECT_ROOT)),
            })
        print(f"[fix] {rel} — removed {len(removed)} tag(s), backup: {backup_path.name}")

    if not args.dry_run:
        write_changes_csv(changes, CHANGES_CSV)
        print(f"\n[done] modified {modified_count} file(s), removed {len(changes)} tag(s)")
        print(f"[next] verify with: npm run seo:hreflang:fast")
    else:
        print(f"\n[dry-run] would modify {len(set(c['file'] for c in changes))} file(s), remove {len(changes)} tag(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
