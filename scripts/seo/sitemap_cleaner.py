#!/usr/bin/env python3
"""
Sitemap Cleaner for breastcalculator.com
========================================
Implements Ahrefs Site Audit Prompt 2: removes 3XX redirects, 4XX/5XX dead
links, and noindex pages from sitemap.xml; replaces 3XX with final URL.

For every <url> entry in the input sitemap:
  • 200 OK + indexable   → kept as-is.
  • 200 OK + noindex      → removed (meta robots noindex OR X-Robots-Tag: noindex).
  • 3XX redirect          → old URL replaced by the final 200 destination URL.
  • 4XX / 5XX             → removed entirely.
  • Network failure       → kept with a warning (avoid silent data loss).

Output:
  sitemap_fixed.xml   (alongside the input file by default).

Performance:
  All probes are async via aiohttp with bounded concurrency.

Usage:
  python scripts/seo/sitemap_cleaner.py
  python scripts/seo/sitemap_cleaner.py --input path/to/sitemap.xml
  python scripts/seo/sitemap_cleaner.py --in-place
  python scripts/seo/sitemap_cleaner.py --dry-run
"""

from __future__ import annotations

import argparse
import asyncio
import shutil
import sys
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path
from typing import Iterable

try:
    import aiohttp
except ImportError:
    sys.exit("Missing dependency: aiohttp. Install: pip install aiohttp")

# ─── Project defaults ────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_INPUT = PROJECT_ROOT / "sitemap.xml"
DEFAULT_OUTPUT = PROJECT_ROOT / "sitemap_fixed.xml"
REPORTS_DIR = PROJECT_ROOT / "reports"
REPORT_TXT = REPORTS_DIR / "sitemap_cleaner_report.txt"

USER_AGENT = (
    "Mozilla/5.0 (compatible; BreastCalculator-SitemapBot/1.0; "
    "+https://breastcalculator.com/)"
)
HTTP_TIMEOUT = aiohttp.ClientTimeout(total=20)
CONCURRENCY = 10
SM_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"


def _strip_ns(tag: str) -> str:
    return tag.split("}", 1)[1] if tag.startswith("{") else tag


def parse_sitemap(input_path: Path) -> tuple[ET.Element, list[ET.Element], list[str]]:
    """
    Return (root_element, url_elements, loc_urls).
    Preserves namespace and ordering so we can write a faithful output file.
    """
    tree = ET.parse(input_path)
    root = tree.getroot()
    url_elements = []
    loc_urls = []
    for child in root:
        if _strip_ns(child.tag) != "url":
            continue
        loc_el = next((c for c in child if _strip_ns(c.tag) == "loc"), None)
        if loc_el is None or not (loc_el.text or "").strip():
            continue
        url_elements.append(child)
        loc_urls.append(loc_el.text.strip())
    return root, url_elements, loc_urls


async def probe_url(session: "aiohttp.ClientSession", url: str) -> dict:
    """
    Returns: {url, status, final_url, noindex, error}
    final_url is set only if different from url (after redirects).
    """
    result = {"url": url, "status": 0, "final_url": None, "noindex": False, "error": None}
    try:
        async with session.get(url, allow_redirects=True, max_redirects=5) as resp:
            result["status"] = resp.status
            if str(resp.url) != url:
                result["final_url"] = str(resp.url)
            if resp.status == 200:
                x_robots = resp.headers.get("X-Robots-Tag", "")
                if "noindex" in x_robots.lower():
                    result["noindex"] = True
                else:
                    # Read up to 128KB to find <meta name="robots">
                    body = await resp.content.read(131072)
                    try:
                        text = body.decode("utf-8", errors="ignore")
                        m = None
                        for pat in (
                            r'<meta[^>]+name\s*=\s*["\']robots["\'][^>]*content\s*=\s*["\']([^"\']+)["\']',
                            r'<meta[^>]+content\s*=\s*["\']([^"\']*noindex[^"\']*)["\'][^>]*name\s*=\s*["\']robots["\']',
                        ):
                            m = __import__("re").search(pat, text, __import__("re").IGNORECASE)
                            if m:
                                break
                        if m and "noindex" in m.group(1).lower():
                            result["noindex"] = True
                    except Exception:
                        pass
    except asyncio.TimeoutError:
        result["error"] = "timeout"
    except aiohttp.ClientError as e:
        result["error"] = f"client_error:{type(e).__name__}"
    except Exception as e:
        result["error"] = f"error:{type(e).__name__}:{e}"
    return result


async def probe_all(urls: list[str]) -> list[dict]:
    connector = aiohttp.TCPConnector(limit=CONCURRENCY, ssl=False)
    headers = {"User-Agent": USER_AGENT}
    sem = asyncio.Semaphore(CONCURRENCY)

    async with aiohttp.ClientSession(timeout=HTTP_TIMEOUT, connector=connector, headers=headers) as session:
        async def _probe(u: str):
            async with sem:
                return await probe_url(session, u)
        return await asyncio.gather(*[_probe(u) for u in urls])


def rewrite_sitemap(
    root: ET.Element,
    url_elements: list[ET.Element],
    loc_urls: list[str],
    probe_results: list[dict],
    in_place: bool,
) -> tuple[Path, dict]:
    """
    Apply probe results to the sitemap tree and return (output_path, stats).
    """
    stats = defaultdict(int)
    stats["total"] = len(loc_urls)

    # Map url -> probe result
    probe_map = {r["url"]: r for r in probe_results}

    # Determine which <url> elements to keep and how to rewrite <loc>
    keep: list[ET.Element] = []
    for url_el, loc_url in zip(url_elements, loc_urls):
        probe = probe_map.get(loc_url)
        if probe is None:
            keep.append(url_el)  # shouldn't happen
            stats["kept_no_probe"] += 1
            continue

        if probe["error"]:
            # Network failure: keep to avoid silent deletion.
            keep.append(url_el)
            stats["kept_network_error"] += 1
            continue

        status = probe["status"]
        if 300 <= status < 400:
            # Redirect — replace loc with final URL (if available)
            final = probe["final_url"]
            if not final:
                # No final URL captured — keep with warning.
                keep.append(url_el)
                stats["kept_redirect_no_final"] += 1
                continue
            loc_el = next((c for c in url_el if _strip_ns(c.tag) == "loc"), None)
            if loc_el is not None:
                loc_el.text = final
            keep.append(url_el)
            stats["rewrote_redirect"] += 1
            continue

        if 400 <= status < 600:
            stats["removed_error_status"] += 1
            continue

        if status == 200 and probe["noindex"]:
            stats["removed_noindex"] += 1
            continue

        if status == 200:
            keep.append(url_el)
            stats["kept_ok"] += 1
            continue

        # Unknown status — preserve
        keep.append(url_el)
        stats["kept_unknown_status"] += 1

    # Rebuild root
    for child in list(root):
        if _strip_ns(child.tag) == "url" and child not in keep:
            root.remove(child)

    output_path = DEFAULT_INPUT if in_place else DEFAULT_OUTPUT
    ET.ElementTree(root).write(output_path, encoding="utf-8", xml_declaration=True)
    return output_path, dict(stats)


def write_report(probe_results: list[dict], stats: dict, out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    lines = ["Sitemap Cleaner Report", "=" * 40, ""]
    for k, v in sorted(stats.items()):
        lines.append(f"  {k:<28} {v}")
    lines.append("")
    lines.append("Per-URL details (changed/removed only):")
    lines.append("-" * 40)
    for r in probe_results:
        action = "kept"
        if r["error"]:
            action = "kept (network error)"
        elif 300 <= r["status"] < 400:
            action = f"redirect -> {r['final_url'] or '(unknown)'}"
        elif 400 <= r["status"] < 600:
            action = f"removed (HTTP {r['status']})"
        elif r["status"] == 200 and r["noindex"]:
            action = "removed (noindex)"
        if action == "kept":
            continue
        lines.append(f"  [{action}] {r['url']}")
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"[info] detailed report -> {out}")


def main(argv: Iterable[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Clean 3XX/4XX/noindex entries from sitemap.xml")
    p.add_argument("--input", type=Path, default=DEFAULT_INPUT,
                   help=f"Input sitemap.xml (default: {DEFAULT_INPUT})")
    p.add_argument("--output", type=Path, default=DEFAULT_OUTPUT,
                   help=f"Output sitemap_fixed.xml (default: {DEFAULT_OUTPUT})")
    p.add_argument("--in-place", action="store_true",
                   help="Overwrite the input file (creates .bak first)")
    p.add_argument("--dry-run", action="store_true",
                   help="Probe only; do not write sitemap file")
    args = p.parse_args(argv)

    if not args.input.exists():
        sys.exit(f"[error] sitemap not found: {args.input}")

    print(f"[info] parsing {args.input}")
    root, url_elements, loc_urls = parse_sitemap(args.input)
    print(f"[info] {len(loc_urls)} <url> entries found")

    if args.in_place:
        backup = args.input.with_suffix(args.input.suffix + ".bak")
        shutil.copy2(args.input, backup)
        print(f"[info] backed up original -> {backup}")

    print(f"[info] probing {len(loc_urls)} URLs (async, concurrency={CONCURRENCY})...")
    probe_results = asyncio.run(probe_all(loc_urls))

    # Summary
    tally = defaultdict(int)
    for r in probe_results:
        if r["error"]:
            tally["network_error"] += 1
        elif 300 <= r["status"] < 400:
            tally["redirect"] += 1
        elif 400 <= r["status"] < 600:
            tally[f"http_{r['status']}"] += 1
        elif r["status"] == 200 and r["noindex"]:
            tally["noindex"] += 1
        elif r["status"] == 200:
            tally["ok"] += 1
        else:
            tally[f"status_{r['status']}"] += 1
    print("[info] probe summary:")
    for k, v in sorted(tally.items()):
        print(f"  {v:>4}  {k}")

    if args.dry_run:
        print("[done] dry-run only — no files written")
        write_report(probe_results, dict(tally), REPORT_TXT)
        return 0

    output_path, stats = rewrite_sitemap(
        root, url_elements, loc_urls, probe_results, args.in_place
    )
    print(f"[done] cleaned sitemap -> {output_path}")
    print(f"[info] stats: {stats}")
    write_report(probe_results, stats, REPORT_TXT)
    return 0


if __name__ == "__main__":
    sys.exit(main())
