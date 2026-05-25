#!/usr/bin/env python3
"""
Stage 1: Sitemap Redirect Auditor
Checks all URLs in sitemap.xml for redirect chains, loops, and final status.
Supports BOTH offline mode (local HTML check) and online mode (HTTP requests).

Usage:
  pip install requests beautifulsoup4
  python seo-tools/stage1_sitemap_redirects.py [--base-url https://breastcalculator.com] [--sitemap sitemap.xml] [--local]
"""

import sys
import os
import re
import time
import json
import csv
import io
import xml.etree.ElementTree as ET
from datetime import datetime
from urllib.parse import urljoin, urlparse
from collections import defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

try:
    import requests
except ImportError:
    sys.exit("Please install requests: pip install requests")

try:
    from bs4 import BeautifulSoup
except ImportError:
    BeautifulSoup = None


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

USER_AGENT = "Mozilla/5.0 (compatible; BreastCalculator-SEO-Audit/1.0; +https://breastcalculator.com)"
REQUEST_TIMEOUT = 10
MAX_REDIRECTS = 10
DELAY = 1.0


def load_sitemap(sitemap_path, use_local):
    """Load sitemap from local file or remote URL."""
    if use_local or not sitemap_path.startswith("http"):
        local_path = sitemap_path if os.path.isabs(sitemap_path) else os.path.join(PROJECT_DIR, sitemap_path)
        if not os.path.exists(local_path):
            raise FileNotFoundError(f"Sitemap not found: {local_path}")
        with open(local_path, "r", encoding="utf-8") as f:
            return f.read()
    else:
        resp = requests.get(sitemap_path, headers={"User-Agent": USER_AGENT}, timeout=REQUEST_TIMEOUT, allow_redirects=True)
        resp.raise_for_status()
        return resp.text


def parse_sitemap_urls(xml_content):
    """Extract all <loc> URLs from sitemap XML."""
    try:
        root = ET.fromstring(xml_content)
    except ET.ParseError:
        root = ET.fromstring(re.sub(r' xmlns="[^"]*"', '', xml_content, count=1))

    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = []

    for url_elem in root.findall(".//sm:url/sm:loc", ns) or root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
        urls.append(url_elem.text.strip())

    if not urls:
        for url_elem in root.findall(".//url/loc"):
            if url_elem.text:
                urls.append(url_elem.text.strip())

    return urls


def check_redirect_chain(url, base_url):
    """Follow redirect chain for a URL. Returns (status_codes_list, final_url, final_status, error, is_loop)."""
    visited = set()
    current = url
    chain_statuses = []
    session = requests.Session()
    session.max_redirects = 0
    is_loop = False
    error = None

    for hop in range(MAX_REDIRECTS + 1):
        if current in visited:
            is_loop = True
            break
        visited.add(current)

        try:
            resp = session.get(current, headers={"User-Agent": USER_AGENT}, timeout=REQUEST_TIMEOUT, allow_redirects=False)
            status = resp.status_code
            chain_statuses.append(status)

            if status == 200:
                return chain_statuses, current, 200, None, False
            elif status in (301, 302, 303, 307, 308):
                location = resp.headers.get("Location", "")
                if location:
                    current = urljoin(current, location)
                else:
                    error = f"Redirect without Location header at hop {hop}"
                    break
            elif status == 404:
                return chain_statuses, current, 404, "Not Found", False
            else:
                return chain_statuses, current, status, f"HTTP {status}", False
        except requests.exceptions.Timeout:
            error = f"Timeout after {REQUEST_TIMEOUT}s"
            break
        except requests.exceptions.ConnectionError as e:
            error = f"Connection error: {e}"
            break
        except Exception as e:
            error = str(e)
            break

    if is_loop:
        return chain_statuses, current, -1, "REDIRECT LOOP", True

    return chain_statuses, current, -1, error or "Max redirects exceeded", True


def get_final_url_offline(sitemap_url, base_url):
    """
    Offline mode: map sitemap URLs to local file paths.
    This simulates what the server SHOULD resolve to.
    """
    parsed = urlparse(sitemap_url)
    path = parsed.path.rstrip("/")
    if not path:
        path = "/"

    local_files = {}
    for root, dirs, files in os.walk(PROJECT_DIR):
        for f in files:
            if f.endswith(".html") or f.endswith(".htm"):
                full = os.path.join(root, f)
                rel = os.path.relpath(full, PROJECT_DIR).replace("\\", "/")
                local_files[f"/{rel}"] = full

    # Direct match
    if path in local_files:
        return sitemap_url, 200

    # Root URL maps to index.html
    if path == "/" and "/index.html" in local_files:
        return sitemap_url, 200

    # /index.html maps to /
    if f"{path}/index.html" in local_files or path + "/index.html" in local_files:
        return sitemap_url, 200

    # Try matching without .html
    if path + ".html" in local_files or f"{path}.html" in local_files:
        return sitemap_url, 200

    # Check redirect patterns
    # E.g. /bra-size-calculator.html -> /
    # E.g. /tools.html -> /index.html (tool is on homepage)
    # E.g. /breast-expansion-calculator.html -> /tools/breast-expansion-calculator.html

    redirect_map = {
        "/bra-size-calculator.html": "/",
        "/tools.html": "/",
        "/breast-expansion-calculator.html": "/tools/breast-expansion-calculator.html",
        "/breast-ptosis-calculator.html": "/tools/breast-ptosis-calculator.html",
        "/breast-volume-calculator.html": "/tools/breast-volume-calculator.html",
        "/length-converter.html": "/tools/length-converter.html",
    }

    if path in redirect_map:
        target = redirect_map[path]
        canonical = urlparse(sitemap_url)
        final_url = f"{canonical.scheme}://{canonical.netloc}{target}"
        return final_url, 301

    # Spanish pages: /es/xxx -> no local files exist
    if path.startswith("/es/"):
        return None, 404

    return None, 404


def run(args=None):
    import argparse
    parser = argparse.ArgumentParser(description="Stage 1: Sitemap Redirect Auditor")
    parser.add_argument("--base-url", default="https://breastcalculator.com", help="Base URL of the site")
    parser.add_argument("--sitemap", default="sitemap.xml", help="Path or URL to sitemap.xml")
    parser.add_argument("--local", action="store_true", help="Offline mode: check against local file structure")
    parser.add_argument("--delay", type=float, default=DELAY, help="Delay between requests (seconds)")
    args = parser.parse_args(args)

    print("=" * 60)
    print("STAGE 1: SITEMAP REDIRECT AUDITOR")
    print(f"Base URL: {args.base_url}")
    print(f"Sitemap:  {args.sitemap}")
    print(f"Mode:     {'OFFLINE (local file check)' if args.local else 'ONLINE (HTTP requests)'}")
    print(f"Time:     {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    xml_content = load_sitemap(args.sitemap, args.local or not args.sitemap.startswith("http"))
    urls = parse_sitemap_urls(xml_content)
    print(f"\nFound {len(urls)} URLs in sitemap.\n")

    results = []
    redirects_in_sitemap = []
    redirect_loops = []
    final_200_map = {}
    stats = defaultdict(int)

    for i, url in enumerate(urls, 1):
        print(f"[{i}/{len(urls)}] Checking: {url}")

        if args.local:
            final_url, status = get_final_url_offline(url, args.base_url)
            if status == 200:
                chain = [200]
                error = None
                is_loop = False
                final_status = 200
            elif status == 301:
                chain = [301, 200]
                url_with_base = url
                error = None
                is_loop = False
                final_status = 200
            elif status == 404:
                chain = [404]
                error = "Not Found (no local file)"
                is_loop = False
                final_status = 404
            else:
                chain = [status]
                error = f"Unknown status: {status}"
                is_loop = False
                final_status = status
        else:
            chain, final_url, final_status, error, is_loop = check_redirect_chain(url, args.base_url)

        hop_count = len(chain)
        result = {
            "sitemap_url": url,
            "hop_count": hop_count,
            "chain": " -> ".join(str(s) for s in chain),
            "final_url": final_url,
            "final_status": final_status,
            "error": error,
            "is_loop": is_loop,
        }
        results.append(result)

        if is_loop:
            redirect_loops.append(result)
            stats["redirect_loop"] += 1
            print(f"  ❌ REDIRECT LOOP! Chain: {chain}")
        elif final_status == 200 and hop_count > 1:
            redirects_in_sitemap.append(result)
            final_200_map[url] = final_url
            stats["3xx_in_sitemap"] += 1
            print(f"  ⚠️  {hop_count - 1}x redirect -> 200 at {final_url}")
        elif final_status == 200:
            stats["ok"] += 1
            print(f"  ✅ 200 OK")
        else:
            stats["error"] += 1
            print(f"  ❌ Error: {error or f'Status {final_status}'}")

        if not args.local:
            time.sleep(args.delay)

    print_summary(stats, len(urls), redirect_loops, redirects_in_sitemap, final_200_map, args)

    write_reports(results, redirect_loops, redirects_in_sitemap, final_200_map, args)
    return results


def print_summary(stats, total, loops, redirects, url_map, args):
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  ✅ Direct 200:         {stats['ok']}")
    print(f"  ⚠️  3XX in sitemap:     {stats['3xx_in_sitemap']}")
    print(f"  ❌ Redirect loops:     {stats['redirect_loop']}")
    print(f"  ❌ Other errors:       {stats['error']}")
    print(f"  📊 Total:              {total}")

    if loops:
        print(f"\n❌ REDIRECT LOOPS ({len(loops)}):")
        for l in loops:
            print(f"  - {l['sitemap_url']}")

    if redirects:
        print(f"\n⚠️  URL REPLACEMENT MAP (for sitemap update):")
        print(f"  {len(redirects)} URLs to replace in sitemap.xml")
        for old, new in url_map.items():
            print(f"  {old}")
            print(f"  -> {new}")
            print()

    # Specific offline-mode analysis
    if args.local:
        print("\n💡 OFFLINE ANALYSIS:")
        missing = [r for r in redirects if r["sitemap_url"] not in url_map]
        print(f"  Sitemap has flat URLs like /bra-size-calculator.html")
        print(f"  But real files are in subdirectories like /tools/breast-expansion-calculator.html")
        print(f"  Also: /es/ pages ({sum(1 for r in redirects if '/es/' in r['sitemap_url'])}) have no local files")


def write_reports(results, loops, redirects, url_map, args):
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")

    csv_file = os.path.join(OUTPUT_DIR, f"sitemap_audit_{ts}.csv")
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["sitemap_url", "hop_count", "chain", "final_url", "final_status", "error", "is_loop"])
        writer.writeheader()
        writer.writerows(results)
    print(f"\n📄 Full report: {csv_file}")

    if url_map:
        map_file = os.path.join(OUTPUT_DIR, f"sitemap_url_map_{ts}.csv")
        with open(map_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["old_sitemap_url", "new_final_url"])
            for old, new in url_map.items():
                writer.writerow([old, new])
        print(f"📄 URL map: {map_file}")

    json_file = os.path.join(OUTPUT_DIR, f"sitemap_audit_{ts}.json")
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump({
            "summary": {
                "total": len(results),
                "ok_200": sum(1 for r in results if r["final_status"] == 200 and r["hop_count"] == 1),
                "redirect_to_200": sum(1 for r in results if r["final_status"] == 200 and r["hop_count"] > 1),
                "redirect_loops": sum(1 for r in results if r["is_loop"]),
                "errors": sum(1 for r in results if r["final_status"] not in (200,) or r["error"]),
            },
            "results": results,
            "url_replacement_map": {k: v for k, v in url_map.items()},
        }, f, indent=2)
    print(f"📄 JSON report: {json_file}")


if __name__ == "__main__":
    run()
