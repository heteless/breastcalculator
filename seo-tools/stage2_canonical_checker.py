#!/usr/bin/env python3
"""
Stage 2: Canonical Redirect Checker
For each page URL, extracts <link rel="canonical"> and verifies the canonical target resolves to 200.
Also detects canonical pointing to 3XX redirects.

Usage:
  pip install requests beautifulsoup4
  python seo-tools/stage2_canonical_checker.py [--input urls.csv] [--base-url https://breastcalculator.com] [--local]
"""

import sys
import os
import re
import time
import csv
import json
import io
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
    sys.exit("Please install beautifulsoup4: pip install beautifulsoup4")


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

USER_AGENT = "Mozilla/5.0 (compatible; BreastCalculator-SEO-Audit/1.0; +https://breastcalculator.com)"
TIMEOUT = 10
DELAY = 0.5


def get_local_html_files():
    """Walk project directory and return list of HTML files with their relative URLs."""
    files = []
    for root, dirs, d_files in os.walk(PROJECT_DIR):
        dirs[:] = [d for d in dirs if d not in ("seo-tools", "output", ".git", "node_modules", "__pycache__")]
        for f in d_files:
            if f.endswith((".html", ".htm")):
                full = os.path.join(root, f)
                rel = os.path.relpath(full, PROJECT_DIR).replace("\\", "/")
                files.append((full, rel))
    return files


def get_local_url(rel_path, base_url):
    """Convert a relative file path to a full URL."""
    parsed = urlparse(base_url)
    if rel_path == "index.html":
        return f"{parsed.scheme}://{parsed.netloc}/"
    if rel_path.endswith("/index.html"):
        return f"{parsed.scheme}://{parsed.netloc}/{rel_path[:-10]}"
    return f"{parsed.scheme}://{parsed.netloc}/{rel_path}"


def extract_canonical(html_content, page_url):
    """Extract canonical URL from HTML."""
    soup = BeautifulSoup(html_content, "html.parser")
    canonical_link = soup.find("link", rel="canonical")
    if canonical_link and canonical_link.get("href"):
        href = canonical_link["href"].strip()
        return urljoin(page_url, href)
    return None


def extract_canonical_local(filepath, base_url):
    """Extract canonical from local HTML file."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)["\']', content, re.IGNORECASE)
    if not match:
        match = re.search(r'<link\s+href=["\']([^"\']+)["\']\s+rel=["\']canonical["\']', content, re.IGNORECASE)

    if match:
        href = match.group(1)
        return urljoin(base_url, href)

    match = re.search(r'<link[^>]*canonical[^>]*href=["\']([^"\']+)["\']', content, re.IGNORECASE)
    if match:
        return urljoin(base_url, match.group(1))

    return None


def check_url_status(url, timeout=TIMEOUT):
    """Check if URL returns 200 or follows redirects."""
    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=timeout, allow_redirects=True)
        redirect_count = len(resp.history)
        return {
            "final_url": resp.url,
            "final_status": resp.status_code,
            "redirect_count": redirect_count,
            "redirect_chain": [r.status_code for r in resp.history] + [resp.status_code],
            "error": None,
        }
    except Exception as e:
        return {
            "final_url": url,
            "final_status": -1,
            "redirect_count": 0,
            "redirect_chain": [],
            "error": str(e),
        }


def run(args=None):
    import argparse
    parser = argparse.ArgumentParser(description="Stage 2: Canonical Redirect Checker")
    parser.add_argument("--input", help="CSV file with URLs to check (first column = URL)")
    parser.add_argument("--base-url", default="https://breastcalculator.com", help="Base URL")
    parser.add_argument("--local", action="store_true", help="Check local HTML files instead of HTTP requests")
    parser.add_argument("--delay", type=float, default=DELAY, help="Delay between requests")
    args = parser.parse_args(args)

    print("=" * 60)
    print("STAGE 2: CANONICAL REDIRECT CHECKER")
    print(f"Mode: {'LOCAL' if args.local else 'ONLINE'}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    results = []
    stats = defaultdict(int)

    if args.local:
        html_files = get_local_html_files()
        print(f"\nFound {len(html_files)} local HTML files.\n")

        for i, (filepath, rel_path) in enumerate(html_files):
            page_url = get_local_url(rel_path, args.base_url)
            print(f"[{i+1}/{len(html_files)}] {page_url}")

            canonical = extract_canonical_local(filepath, args.base_url)
            if not canonical:
                stats["no_canonical"] += 1
                results.append({
                    "page_url": page_url,
                    "canonical_url": None,
                    "canonical_final_url": None,
                    "canonical_status": None,
                    "redirect_count": 0,
                    "needs_fix": "MISSING",
                    "suggestion": "Add <link rel=\"canonical\" href=\"...\"> to <head>",
                })
                print(f"  ⚠️  No canonical tag found")
                continue

            print(f"  Canonical: {canonical}")

            if args.local:
                # In local mode, verify canonical matches expected file structure
                parsed = urlparse(canonical)
                c_path = parsed.path.rstrip("/") or "/"
                expected = page_url.rstrip("/") or "/"
                c_expected = urlparse(expected).path.rstrip("/") or "/"

                if c_path == c_expected or canonical.rstrip("/") == page_url.rstrip("/"):
                    stats["ok"] += 1
                    results.append({
                        "page_url": page_url,
                        "canonical_url": canonical,
                        "canonical_final_url": canonical,
                        "canonical_status": 200,
                        "redirect_count": 0,
                        "needs_fix": "OK",
                        "suggestion": "",
                    })
                    print(f"  ✅ Canonical OK")
                else:
                    stats["mismatch"] += 1
                    results.append({
                        "page_url": page_url,
                        "canonical_url": canonical,
                        "canonical_final_url": canonical,
                        "canonical_status": "MISMATCH",
                        "redirect_count": 0,
                        "needs_fix": "MISMATCH",
                        "suggestion": f"Canonical ({canonical}) does not match page URL ({page_url})",
                    })
                    print(f"  ⚠️  Mismatch: canonical ({c_path}) != page ({c_expected})")
    else:
        # Online mode: read URLs from input CSV or sitemap
        urls = []
        if args.input and os.path.exists(args.input):
            with open(args.input, "r", encoding="utf-8") as f:
                reader = csv.reader(f)
                for row in reader:
                    if row and row[0].strip():
                        urls.append(row[0].strip())
        else:
            print("Error: --input CSV required in online mode, or use --local")
            return

        print(f"\nChecking {len(urls)} URLs...\n")
        for i, page_url in enumerate(urls):
            print(f"[{i+1}/{len(urls)}] {page_url}")

            try:
                resp = requests.get(page_url, headers={"User-Agent": USER_AGENT}, timeout=TIMEOUT, allow_redirects=True)
                soup = BeautifulSoup(resp.text, "html.parser")
                canonical_link = soup.find("link", rel="canonical")
                canonical = canonical_link["href"].strip() if canonical_link and canonical_link.get("href") else None
                if canonical:
                    canonical = urljoin(page_url, canonical)
            except Exception as e:
                results.append({
                    "page_url": page_url, "canonical_url": None, "canonical_final_url": None,
                    "canonical_status": -1, "redirect_count": 0, "needs_fix": "FETCH_ERROR", "suggestion": str(e),
                })
                stats["fetch_error"] += 1
                print(f"  ❌ Fetch error: {e}")
                continue

            if not canonical:
                stats["no_canonical"] += 1
                results.append({
                    "page_url": page_url, "canonical_url": None, "canonical_final_url": None,
                    "canonical_status": None, "redirect_count": 0, "needs_fix": "MISSING",
                    "suggestion": "Add canonical tag",
                })
                continue

            canonical_check = check_url_status(canonical)
            needs_fix = "OK"
            suggestion = ""

            if canonical_check["final_status"] != 200:
                needs_fix = "BROKEN"
                suggestion = f"Canonical returns {canonical_check['final_status']}"
            elif canonical_check["redirect_count"] > 0:
                needs_fix = "REDIRECT"
                suggestion = f"Canonical redirects ({canonical_check['redirect_count']} hops) to {canonical_check['final_url']}. Update to final URL."
                stats["canonical_redirects"] += 1
            else:
                stats["ok"] += 1

            result = {
                "page_url": page_url,
                "canonical_url": canonical,
                "canonical_final_url": canonical_check["final_url"],
                "canonical_status": canonical_check["final_status"],
                "redirect_count": canonical_check["redirect_count"],
                "needs_fix": needs_fix,
                "suggestion": suggestion,
            }
            results.append(result)

            if needs_fix == "OK":
                print(f"  ✅ Canonical: {canonical}")
            else:
                print(f"  ⚠️  {needs_fix}: {suggestion}")

            time.sleep(args.delay)

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    for key, val in stats.items():
        print(f"  {key}: {val}")
    print(f"  Pages needing fix: {sum(1 for r in results if r['needs_fix'] != 'OK')}")

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_out = os.path.join(OUTPUT_DIR, f"canonical_audit_{ts}.csv")
    with open(csv_out, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["page_url", "canonical_url", "canonical_final_url", "canonical_status", "redirect_count", "needs_fix", "suggestion"])
        writer.writeheader()
        writer.writerows(results)
    print(f"\n📄 Report: {csv_out}")

    return results


if __name__ == "__main__":
    run()
