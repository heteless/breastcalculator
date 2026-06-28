#!/usr/bin/env python3
"""
Dead-Link Fixer for breastcalculator.com
=========================================
Implements Ahrefs Site Audit Prompt 3: reads an Ahrefs CSV report of broken /
redirecting internal links and patches the local source files.

Modes (per CSV row):
  • 3XX redirect   → replace the old Link URL with the final 200 URL in every
                     source file. Final URL is taken from the CSV's `final_url`
                     column if present, otherwise resolved live via HTTP probe.
  • 404 / 4XX      → either replace the href with `javascript:void(0);`,
                     strip the surrounding <a> tag (keep inner text),
                     or just report file:line for manual review (default).

Supported source extensions: .html .htm .js .vue .md .css

Safety:
  • Every modified file is backed up to .backup/<timestamp>/<relative-path>.
  • Original files are only written after a successful backup.
  • All replacements are tracked in reports/dead_links_changes.csv.

CSV format expected (Ahrefs "Internal links" export):
    Source URL, Link URL, HTTP Code, [Final URL], [Anchor Text]
The script is tolerant of header variations (case-insensitive substring match).

Usage:
  python scripts/seo/fix_dead_links.py --report ahrefs_links_report.csv
  python scripts/seo/fix_dead_links.py --report ahrefs.csv --mode strip
  python scripts/seo/fix_dead_links.py --report ahrefs.csv --mode mark
  python scripts/seo/fix_dead_links.py --report ahrefs.csv --resolve-redirects
"""

from __future__ import annotations

import argparse
import asyncio
import csv
import re
import shutil
import sys
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable

try:
    from bs4 import BeautifulSoup
except ImportError:
    BeautifulSoup = None  # only required for --mode strip

try:
    import aiohttp
except ImportError:
    aiohttp = None

# ─── Project defaults ────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE_ROOT = PROJECT_ROOT
DEFAULT_BACKUP_ROOT = PROJECT_ROOT / ".backup"
REPORTS_DIR = PROJECT_ROOT / "reports"
CHANGES_CSV = REPORTS_DIR / "dead_links_changes.csv"

EXTENSIONS = (".html", ".htm", ".js", ".vue", ".md", ".css")
EXCLUDE_DIRS = {"dist", "node_modules", ".git", ".backup", "reports", "scripts"}

USER_AGENT = (
    "Mozilla/5.0 (compatible; BreastCalculator-DeadLinkBot/1.0; "
    "+https://breastcalculator.com/)"
)
HTTP_TIMEOUT = aiohttp.ClientTimeout(total=15) if aiohttp else None
CONCURRENCY = 8

# Ahrefs columns we look for (case-insensitive substring match)
COL_SOURCE = "source"
COL_LINK = "link"
COL_CODE = "code"
COL_FINAL = "final"
COL_ANCHOR = "anchor"


@dataclass
class LinkIssue:
    source_url: str
    link_url: str
    http_code: int | None
    final_url: str | None
    anchor_text: str | None


# ─── CSV ingestion ────────────────────────────────────────────────────────
def read_ahrefs_csv(csv_path: Path) -> list[LinkIssue]:
    if not csv_path.exists():
        sys.exit(f"[error] CSV not found: {csv_path}")

    with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.reader(f)
        try:
            header = next(reader)
        except StopIteration:
            sys.exit("[error] CSV is empty")

        idx = {name: i for i, name in enumerate(header)}
        src_i = next((i for n, i in idx.items() if COL_SOURCE in n.lower()), None)
        link_i = next((i for n, i in idx.items() if COL_LINK in n.lower() and "link" in n.lower()), None)
        code_i = next((i for n, i in idx.items() if COL_CODE in n.lower()), None)
        final_i = next((i for n, i in idx.items() if COL_FINAL in n.lower()), None)
        anchor_i = next((i for n, i in idx.items() if COL_ANCHOR in n.lower()), None)

        if src_i is None or link_i is None:
            sys.exit(
                f"[error] CSV must contain 'Source URL' and 'Link URL' columns. Found: {header}"
            )

        issues: list[LinkIssue] = []
        for row in reader:
            if not row or len(row) <= max(src_i, link_i):
                continue
            link_url = (row[link_i] or "").strip()
            if not link_url:
                continue
            code = None
            if code_i is not None and code_i < len(row):
                m = re.search(r"\d+", row[code_i] or "")
                code = int(m.group(0)) if m else None
            final = (row[final_i].strip() if final_i is not None and final_i < len(row) and row[final_i] else None)
            anchor = (row[anchor_i].strip() if anchor_i is not None and anchor_i < len(row) and row[anchor_i] else None)
            issues.append(LinkIssue(
                source_url=(row[src_i] or "").strip(),
                link_url=link_url,
                http_code=code,
                final_url=final,
                anchor_text=anchor,
            ))
    return issues


def dedupe_issues(issues: list[LinkIssue]) -> list[LinkIssue]:
    """Collapse (link_url, final_url) duplicates so we scan each file once."""
    seen: dict[tuple[str, str], LinkIssue] = {}
    for issue in issues:
        key = (issue.link_url, issue.final_url or "")
        if key not in seen:
            seen[key] = issue
    return list(seen.values())


# ─── Resolve final URLs for 3XX rows that lack a final_url ────────────────
async def resolve_final_urls(issues: list[LinkIssue]) -> None:
    """Mutate issues in-place: fill final_url for 3XX rows missing it."""
    if aiohttp is None:
        print("[warn] aiohttp missing — cannot resolve 3XX final URLs", file=sys.stderr)
        return
    pending = [i for i in issues if i.http_code and 300 <= i.http_code < 400 and not i.final_url]
    if not pending:
        return

    print(f"[info] resolving {len(pending)} redirect final URLs via HTTP HEAD...")
    connector = aiohttp.TCPConnector(limit=CONCURRENCY, ssl=False)
    headers = {"User-Agent": USER_AGENT}
    sem = asyncio.Semaphore(CONCURRENCY)

    async def resolve(issue: LinkIssue) -> None:
        try:
            async with aiohttp.ClientSession(timeout=HTTP_TIMEOUT, connector=connector, headers=headers) as session:
                async with sem, session.get(issue.link_url, allow_redirects=True, max_redirects=5) as resp:
                    if str(resp.url) != issue.link_url:
                        issue.final_url = str(resp.url)
        except Exception as e:
            print(f"  [warn] resolve failed for {issue.link_url}: {type(e).__name__}: {e}", file=sys.stderr)

    await asyncio.gather(*[resolve(i) for i in pending])


# ─── File discovery & in-file replacement ──────────────────────────────────
def find_source_files(root: Path) -> list[Path]:
    files: list[Path] = []
    root = root.resolve()
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in EXTENSIONS:
            continue
        rel = path.relative_to(root)
        if any(part in EXCLUDE_DIRS for part in rel.parts):
            continue
        files.append(path)
    return files


def make_backup(src_file: Path, root: Path, backup_root: Path, ts: str) -> Path:
    rel = src_file.relative_to(root)
    dest = backup_root / ts / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src_file, dest)
    return dest


def replace_in_text(text: str, old_url: str, new_url: str) -> tuple[str, int]:
    """Replace all occurrences of old_url with new_url. Returns (new_text, count)."""
    if old_url == new_url:
        return text, 0
    count = text.count(old_url)
    if count == 0:
        return text, 0
    return text.replace(old_url, new_url), count


# For 404s: strip the surrounding <a> tag, keeping inner text.
def strip_anchor_with_url(html: str, target_url: str) -> tuple[str, int]:
    """Remove every <a href="target_url">...</a>, keeping inner content."""
    if BeautifulSoup is None:
        # Fallback: regex strip — less safe
        pattern = re.compile(
            r'<a\b[^>]*href\s*=\s*["\']' + re.escape(target_url) + r'["\'][^>]*>(.*?)</a>',
            re.IGNORECASE | re.DOTALL,
        )
        new_html, n = pattern.subn(r"\1", html)
        return new_html, n
    soup = BeautifulSoup(html, "html.parser")
    n = 0
    for a in soup.find_all("a", href=target_url):
        a.replace_with_children()
        n += 1
    return str(soup), n


def replace_href_with_void(html: str, target_url: str) -> tuple[str, int]:
    """Change <a href="target_url"> → <a href="javascript:void(0);"> keeping tag."""
    if BeautifulSoup is None:
        pattern = re.compile(
            r'(<a\b[^>]*\bhref\s*=\s*["\'])' + re.escape(target_url) + r'(["\'])',
            re.IGNORECASE,
        )
        new_html, n = pattern.subn(r"\1javascript:void(0);\2", html)
        return new_html, n
    soup = BeautifulSoup(html, "html.parser")
    n = 0
    for a in soup.find_all("a", href=target_url):
        a["href"] = "javascript:void(0);"
        n += 1
    return str(soup), n


# ─── Orchestration ────────────────────────────────────────────────────────
def process_issues(
    issues: list[LinkIssue],
    source_root: Path,
    backup_root: Path,
    mode: str,
    resolve_redirects: bool,
) -> list[dict]:
    """
    Walk source files once and apply all applicable replacements.
    Returns list of change records.
    """
    if resolve_redirects:
        asyncio.run(resolve_final_urls(issues))

    # Group by file by first scanning for any occurrence — this avoids
    # re-reading files multiple times.
    all_files = find_source_files(source_root)
    print(f"[info] scanning {len(all_files)} source files under {source_root}")

    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    changes: list[dict] = []

    # Build a lookup: old_url -> new_url (for 3XX) and old_url -> None (for 404)
    replacements: dict[str, str | None] = {}
    for issue in issues:
        if issue.http_code and 300 <= issue.http_code < 400:
            if issue.final_url and issue.final_url != issue.link_url:
                replacements[issue.link_url] = issue.final_url
        elif issue.http_code and 400 <= issue.http_code < 600:
            # 4XX — mode-dependent
            if mode == "void":
                replacements[issue.link_url] = "__VOID__"
            elif mode == "strip":
                replacements[issue.link_url] = "__STRIP__"
            else:  # mark
                replacements[issue.link_url] = None  # do not modify, just report

    if not replacements:
        print("[info] no actionable replacements to make")
        return []

    for src_file in all_files:
        try:
            text = src_file.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        original = text
        file_changes: list[dict] = []

        for old_url, action in replacements.items():
            if action is None:
                # mark mode: just locate occurrences
                occurrences = [m.start() for m in re.finditer(re.escape(old_url), text)]
                for off in occurrences:
                    line = text.count("\n", 0, off) + 1
                    file_changes.append({
                        "file": str(src_file.relative_to(source_root)),
                        "line": line,
                        "old_url": old_url,
                        "new_url": "",
                        "action": "marked_for_review",
                    })
                continue

            if action == "__VOID__":
                new_text, count = replace_href_with_void(text, old_url)
                action_label = "replaced_with_void"
                new_url = "javascript:void(0);"
            elif action == "__STRIP__":
                new_text, count = strip_anchor_with_url(text, old_url)
                action_label = "stripped_anchor"
                new_url = ""
            else:
                new_text, count = replace_in_text(text, old_url, action)
                action_label = "replaced_redirect"
                new_url = action

            if count == 0:
                continue
            for _ in range(count):
                file_changes.append({
                    "file": str(src_file.relative_to(source_root)),
                    "line": 0,
                    "old_url": old_url,
                    "new_url": new_url,
                    "action": action_label,
                })
            text = new_text

        if text == original:
            continue

        # Backup then write
        backup_path = make_backup(src_file, source_root, backup_root, ts)
        src_file.write_text(text, encoding="utf-8")
        print(f"[fix] {src_file.relative_to(source_root)} (+{len(file_changes)} change(s), backup: {backup_path.name})")
        changes.extend(file_changes)

    return changes


def write_changes_csv(changes: list[dict], out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    if not changes:
        print("[info] no changes to record")
        return
    fieldnames = ["file", "line", "old_url", "new_url", "action"]
    with out.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(changes)
    print(f"[done] {len(changes)} change(s) -> {out}")


def main(argv: Iterable[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Patch dead links and redirects in source files from an Ahrefs CSV.")
    p.add_argument("--report", type=Path, required=True,
                   help="Ahrefs CSV export of broken internal links")
    p.add_argument("--source-root", type=Path, default=DEFAULT_SOURCE_ROOT,
                   help=f"Source folder to patch (default: {DEFAULT_SOURCE_ROOT})")
    p.add_argument("--backup-root", type=Path, default=DEFAULT_BACKUP_ROOT,
                   help=f"Backup folder (default: {DEFAULT_BACKUP_ROOT})")
    p.add_argument("--mode", choices=["void", "strip", "mark"], default="mark",
                   help="Action for 404 dead links: void=replace href with javascript:void(0); "
                        "strip=remove <a> keeping text; mark=report only (default)")
    p.add_argument("--resolve-redirects", action="store_true",
                   help="Live-resolve final URLs for 3XX rows missing final_url in CSV")
    args = p.parse_args(argv)

    issues = read_ahrefs_csv(args.report)
    issues = dedupe_issues(issues)
    redirects = [i for i in issues if i.http_code and 300 <= i.http_code < 400]
    deads = [i for i in issues if i.http_code and 400 <= i.http_code < 600]
    print(f"[info] CSV rows: {len(issues)} unique "
          f"({len(redirects)} redirects, {len(deads)} deadlinks)")

    changes = process_issues(
        issues=issues,
        source_root=args.source_root,
        backup_root=args.backup_root,
        mode=args.mode,
        resolve_redirects=args.resolve_redirects,
    )
    write_changes_csv(changes, CHANGES_CSV)

    print(f"[done] mode={args.mode}  total changes: {len(changes)}")
    return 0 if changes else 1


if __name__ == "__main__":
    sys.exit(main())
