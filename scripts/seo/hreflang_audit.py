#!/usr/bin/env python3
"""
Hreflang Auditor for breastcalculator.com
=========================================
Implements Ahrefs Site Audit Prompt 1: detects hreflang conflicts,
missing reciprocal (return) tags, and dead/redirecting href URLs.

Checks performed:
  1. Conflict     — same hreflang code on a page pointing to multiple URLs.
  2. Reciprocal    — A declares B as alt-language, but B does not declare A back.
  3. Validity      — HTTP status of every href URL (3XX / 4XX / 5XX flagged).

Inputs (mutually exclusive):
  --source DIR     Local HTML folder to scan (default: project root, excludes dist/).
  --urls FILE      Plain-text file with one URL per line to fetch online.
  --sitemap FILE   sitemap.xml whose <loc> entries should be fetched online.

Output:
  reports/hreflang_errors.csv  with columns:
    source_url, source_path, issue_type, hreflang, href_url, detail

Usage:
  python scripts/seo/hreflang_audit.py
  python scripts/seo/hreflang_audit.py --source d:/DevProject/breastcalculator
  python scripts/seo/hreflang_audit.py --sitemap https://breastcalculator.com/sitemap.xml
  python scripts/seo/hreflang_audit.py --urls url-list.txt --no-http

Performance:
  All HTTP checks are async (aiohttp) with bounded concurrency.
  Add --no-http to skip network probes (faster, conflict/reciprocal only).
"""

from __future__ import annotations

import argparse
import asyncio
import csv
import os
import re
import sys
from collections import defaultdict
from pathlib import Path
from typing import Iterable
from urllib.parse import urlparse, urljoin

try:
    from bs4 import BeautifulSoup
except ImportError:
    sys.exit("Missing dependency: beautifulsoup4. Install: pip install beautifulsoup4 aiohttp")

try:
    import aiohttp
except ImportError:
    aiohttp = None  # allowed when --no-http is used

# ─── Project defaults ────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE = PROJECT_ROOT
DEFAULT_SITEMAP = PROJECT_ROOT / "sitemap.xml"
REPORTS_DIR = PROJECT_ROOT / "reports"
OUTPUT_CSV = REPORTS_DIR / "hreflang_errors.csv"

EXCLUDE_DIRS = {"dist", "node_modules", ".git", ".backup", "reports", "scripts"}
HTML_GLOBS = ("*.html", "*.htm")

USER_AGENT = (
    "Mozilla/5.0 (compatible; BreastCalculator-HreflangBot/1.0; "
    "+https://breastcalculator.com/)"
)
HTTP_TIMEOUT = aiohttp.ClientTimeout(total=15) if aiohttp else None
CONCURRENCY = 12
HREFLANG_RE = re.compile(
    r'<link[^>]*\brel\s*=\s*["\']alternate["\'][^>]*>'
    r'|<link[^>]*\bhreflang\s*=\s*["\'][^"\']+["\'][^>]*>',
    re.IGNORECASE,
)


# ─── Discovery: collect pages to audit ────────────────────────────────────
def discover_local_html(root: Path) -> list[tuple[str, Path]]:
    """Return list of (source_url_guess, path) for every local HTML file."""
    pages: list[tuple[str, Path]] = []
    root = root.resolve()
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in (".html", ".htm"):
            continue
        if any(part in EXCLUDE_DIRS for part in path.relative_to(root).parts):
            continue
        # Guess canonical URL from path
        rel = path.relative_to(root).as_posix()
        if rel in ("index.html",):
            url = "https://breastcalculator.com/"
        else:
            slug = rel[:-len("/index.html")] if rel.endswith("/index.html") else (
                rel[:-5] if rel.endswith(".html") else rel[:-4]
            )
            url = f"https://breastcalculator.com/{slug}/"
        pages.append((url, path))
    return pages


def read_urls_from_file(file_path: Path) -> list[str]:
    urls = []
    for raw in file_path.read_text(encoding="utf-8", errors="ignore").splitlines():
        u = raw.strip()
        if u and not u.startswith("#"):
            urls.append(u)
    return urls


def read_urls_from_sitemap(sitemap_path: Path) -> list[str]:
    import xml.etree.ElementTree as ET
    tree = ET.parse(sitemap_path)
    root = tree.getroot()
    # Strip namespace
    ns = ""
    if root.tag.startswith("{"):
        ns = root.tag.split("}")[0] + "}"
    locs = [el.text.strip() for el in root.iter(f"{ns}loc") if el.text]
    return locs


# ─── Extraction: parse hreflang tags from HTML ────────────────────────────
def extract_hreflangs(html: str) -> list[tuple[str, str, int, int]]:
    """
    Return list of (hreflang, href, line_start, line_end) tuples.
    Line numbers are 1-based approximations from the source HTML.
    """
    soup = BeautifulSoup(html, "html.parser")
    results: list[tuple[str, str, int, int]] = []
    for link in soup.find_all("link", attrs={"rel": "alternate"}):
        hreflang = link.get("hreflang", "").strip()
        href = (link.get("href") or "").strip()
        if not hreflang or not href:
            continue
        # Compute approximate line number via sourceline if available
        line = getattr(link, "sourceline", None) or 0
        results.append((hreflang, href, line, line))
    return results


# ─── Check 1: duplicate hreflang codes on the same page ───────────────────
def check_conflicts(
    source_url: str,
    source_path: Path | str,
    hreflangs: list[tuple[str, str, int, int]],
    errors: list[dict],
) -> None:
    by_code: dict[str, list[str]] = defaultdict(list)
    for code, href, _, _ in hreflangs:
        by_code[code].append(href)
    for code, urls in by_code.items():
        unique = set(urls)
        if len(unique) > 1:
            for url in unique:
                errors.append({
                    "source_url": source_url,
                    "source_path": str(source_path),
                    "issue_type": "duplicate_hreflang_code",
                    "hreflang": code,
                    "href_url": url,
                    "detail": f"Code '{code}' declared {len(urls)} times on this page pointing to {len(unique)} unique URLs",
                })


# ─── Check 2: reciprocal (return) tags ────────────────────────────────────
def check_reciprocal(
    pages: dict[str, dict],
    errors: list[dict],
) -> None:
    """
    pages maps normalized source_url -> {path, hreflangs: [(code, href, _, _), ...]}
    For every A -> B(hreflang=code) we expect B to also contain an hreflang
    pointing back to A (the same code or x-default is acceptable).
    """
    for src_url, info in pages.items():
        for code, href, _, _ in info["hreflangs"]:
            if code == "x-default":
                continue  # x-default is exempt from reciprocity
            target = pages.get(href.rstrip("/"))
            if target is None:
                # Will be flagged by validity check; mark reciprocity skip
                continue
            # Look for a return link pointing to src_url
            back_codes = {c for c, h, _, _ in target["hreflangs"]}
            back_urls = {h.rstrip("/") for c, h, _, _ in target["hreflangs"]}
            if src_url.rstrip("/") not in back_urls:
                errors.append({
                    "source_url": src_url,
                    "source_path": str(info["path"]),
                    "issue_type": "missing_return_tag",
                    "hreflang": code,
                    "href_url": href,
                    "detail": f"Target page {href} does not declare {src_url} back via hreflang",
                })


# ─── Check 3: HTTP validity of href URLs ──────────────────────────────────
async def fetch_status(
    session: "aiohttp.ClientSession",
    url: str,
) -> tuple[str, int, str | None, str | None]:
    """
    Returns (url, final_status_code, final_url_if_redirected, error_message).
    A 200 page is further inspected for a noindex meta/X-Robots-Tag.
    """
    try:
        async with session.get(
            url,
            allow_redirects=True,
            max_redirects=5,
        ) as resp:
            final_url = str(resp.url) if str(resp.url) != url else None
            noindex = None
            if resp.status == 200:
                x_robots = resp.headers.get("X-Robots-Tag", "")
                if "noindex" in x_robots.lower():
                    noindex = f"X-Robots-Tag: {x_robots}"
                else:
                    # Inspect only first 64KB for meta robots
                    text = await resp.content.read(65536)
                    try:
                        body = text.decode("utf-8", errors="ignore")
                        meta = re.search(
                            r'<meta[^>]+name\s*=\s*["\']robots["\'][^>]*content\s*=\s*["\']([^"\']+)["\']',
                            body, re.IGNORECASE,
                        )
                        if meta and "noindex" in meta.group(1).lower():
                            noindex = f'<meta name="robots" content="{meta.group(1)}">'
                    except Exception:
                        pass
            return url, resp.status, final_url, noindex
    except asyncio.TimeoutError:
        return url, -1, None, "timeout"
    except aiohttp.ClientError as e:
        return url, -1, None, f"client_error:{type(e).__name__}"
    except Exception as e:
        return url, -1, None, f"error:{type(e).__name__}:{e}"


async def check_validity(
    href_urls: set[str],
    errors: list[dict],
    pages: dict[str, dict],
) -> None:
    if aiohttp is None:
        print("[warn] aiohttp missing — skipping HTTP validity check", file=sys.stderr)
        return
    if not href_urls:
        return

    connector = aiohttp.TCPConnector(limit=CONCURRENCY, ssl=False)
    headers = {"User-Agent": USER_AGENT}
    async with aiohttp.ClientSession(timeout=HTTP_TIMEOUT, connector=connector, headers=headers) as session:
        sem = asyncio.Semaphore(CONCURRENCY)

        async def probe(url: str):
            async with sem:
                return await fetch_status(session, url)

        results = await asyncio.gather(*[probe(u) for u in href_urls])

    # Build reverse lookup: which (source, code) referenced each href
    href_sources: dict[str, list[tuple[str, str, str, Path]]] = defaultdict(list)
    for src_url, info in pages.items():
        for code, href, _, _ in info["hreflangs"]:
            href_sources[href].append((src_url, code, href, info["path"]))

    for url, status, final_url, noindex in results:
        for src_url, code, href, path in href_sources.get(url, []):
            if status == -1:
                errors.append({
                    "source_url": src_url,
                    "source_path": str(path),
                    "issue_type": "fetch_failed",
                    "hreflang": code,
                    "href_url": href,
                    "detail": f"Network error: {noindex or 'unknown'}",
                })
            elif 300 <= status < 400 and final_url:
                errors.append({
                    "source_url": src_url,
                    "source_path": str(path),
                    "issue_type": "redirect_target",
                    "hreflang": code,
                    "href_url": href,
                    "detail": f"HTTP {status} -> {final_url}",
                })
            elif 400 <= status < 600:
                errors.append({
                    "source_url": src_url,
                    "source_path": str(path),
                    "issue_type": "broken_target",
                    "hreflang": code,
                    "href_url": href,
                    "detail": f"HTTP {status}",
                })
            elif status == 200 and noindex:
                errors.append({
                    "source_url": src_url,
                    "source_path": str(path),
                    "issue_type": "noindex_target",
                    "hreflang": code,
                    "href_url": href,
                    "detail": noindex,
                })


# ─── Orchestration ────────────────────────────────────────────────────────
def audit_local(source_dir: Path, do_http: bool) -> list[dict]:
    pages_list = discover_local_html(source_dir)
    if not pages_list:
        print(f"[warn] no HTML found under {source_dir}", file=sys.stderr)
        return []
    print(f"[info] scanning {len(pages_list)} local HTML files...")

    pages: dict[str, dict] = {}
    errors: list[dict] = []
    all_href_urls: set[str] = set()

    for url, path in pages_list:
        try:
            html = path.read_text(encoding="utf-8", errors="ignore")
        except OSError as e:
            errors.append({
                "source_url": url,
                "source_path": str(path),
                "issue_type": "read_failed",
                "hreflang": "",
                "href_url": "",
                "detail": str(e),
            })
            continue
        hreflangs = extract_hreflangs(html)
        # Normalize key as trailing-slash-stripped URL
        pages[url.rstrip("/")] = {"path": path, "hreflangs": hreflangs}
        check_conflicts(url, path, hreflangs, errors)
        for code, href, _, _ in hreflangs:
            if href.startswith(("http://", "https://")):
                all_href_urls.add(href)

    check_reciprocal(pages, errors)

    if do_http and all_href_urls:
        print(f"[info] probing {len(all_href_urls)} unique href URLs...")
        # Run async check in a fresh event loop
        asyncio.run(check_validity(all_href_urls, errors, pages))

    return errors


def audit_remote(urls: list[str], do_http: bool) -> list[dict]:
    if not aiohttp:
        sys.exit("[error] aiohttp is required for remote audit. pip install aiohttp")
    if not do_http:
        sys.exit("[error] --no-http cannot be combined with remote audit")

    async def run() -> list[dict]:
        pages: dict[str, dict] = {}
        errors: list[dict] = []
        all_href_urls: set[str] = set()

        connector = aiohttp.TCPConnector(limit=CONCURRENCY, ssl=False)
        headers = {"User-Agent": USER_AGENT}
        async with aiohttp.ClientSession(timeout=HTTP_TIMEOUT, connector=connector, headers=headers) as session:
            sem = asyncio.Semaphore(CONCURRENCY)

            async def fetch_html(url: str) -> tuple[str, int, str]:
                try:
                    async with sem, session.get(url, allow_redirects=True, max_redirects=5) as resp:
                        text = await resp.text(errors="ignore")
                        return url, resp.status, text
                except Exception as e:
                    return url, -1, f"<err>{type(e).__name__}:{e}</err>"

            results = await asyncio.gather(*[fetch_html(u) for u in urls])

        for url, status, html in results:
            if status == -1:
                errors.append({
                    "source_url": url,
                    "source_path": "",
                    "issue_type": "fetch_failed",
                    "hreflang": "",
                    "href_url": "",
                    "detail": html,
                })
                continue
            if status != 200:
                errors.append({
                    "source_url": url,
                    "source_path": "",
                    "issue_type": "source_unreachable",
                    "hreflang": "",
                    "href_url": "",
                    "detail": f"HTTP {status}",
                })
                continue
            hreflangs = extract_hreflangs(html)
            pages[url.rstrip("/")] = {"path": Path(""), "hreflangs": hreflangs}
            check_conflicts(url, "", hreflangs, errors)
            for code, href, _, _ in hreflangs:
                if href.startswith(("http://", "https://")):
                    all_href_urls.add(href)

        check_reciprocal(pages, errors)
        await check_validity(all_href_urls, errors, pages)
        return errors

    return asyncio.run(run())


def write_csv(errors: list[dict], out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = ["source_url", "source_path", "issue_type", "hreflang", "href_url", "detail"]
    with out_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in errors:
            writer.writerow(row)
    print(f"[done] {len(errors)} issues -> {out_path}")


def main(argv: Iterable[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Audit hreflang tags for conflicts, reciprocity, and validity.")
    src = p.add_mutually_exclusive_group()
    src.add_argument("--source", type=Path, default=DEFAULT_SOURCE,
                     help=f"Local HTML folder to scan (default: {DEFAULT_SOURCE})")
    src.add_argument("--urls", type=Path, help="Plain-text file with one URL per line")
    src.add_argument("--sitemap", type=Path, default=None,
                     help="Local sitemap.xml path OR remote URL (default: project sitemap)")
    p.add_argument("--no-http", action="store_true", help="Skip HTTP validity probes")
    p.add_argument("--output", type=Path, default=OUTPUT_CSV,
                   help=f"Output CSV path (default: {OUTPUT_CSV})")
    args = p.parse_args(argv)

    if args.urls:
        urls = read_urls_from_file(args.urls)
        errors = audit_remote(urls, do_http=not args.no_http)
    elif args.sitemap:
        sitemap_arg = str(args.sitemap)
        if sitemap_arg.startswith(("http://", "https://")):
            # Remote sitemap — fall back to downloading it first
            if not aiohttp:
                sys.exit("aiohttp required for remote sitemap. pip install aiohttp")
            text = asyncio.run(_download_text(sitemap_arg))
            tmp = PROJECT_ROOT / ".tmp-sitemap.xml"
            tmp.write_text(text, encoding="utf-8")
            try:
                urls = read_urls_from_sitemap(tmp)
            finally:
                tmp.unlink(missing_ok=True)
        else:
            urls = read_urls_from_sitemap(args.sitemap)
        errors = audit_remote(urls, do_http=not args.no_http)
    else:
        errors = audit_local(args.source, do_http=not args.no_http)

    write_csv(errors, args.output)

    # Console summary
    if errors:
        print("\n── Summary ────────────────────────────────────")
        tally: dict[str, int] = defaultdict(int)
        for e in errors:
            tally[e["issue_type"]] += 1
        for issue, count in sorted(tally.items(), key=lambda x: -x[1]):
            print(f"  {count:>4}  {issue}")
    else:
        print("[ok] no hreflang issues detected")
    return 0 if not errors else 1


async def _download_text(url: str) -> str:
    if not aiohttp:
        sys.exit("aiohttp required")
    async with aiohttp.ClientSession(timeout=HTTP_TIMEOUT) as session:
        async with session.get(url) as resp:
            return await resp.text()


if __name__ == "__main__":
    sys.exit(main())
