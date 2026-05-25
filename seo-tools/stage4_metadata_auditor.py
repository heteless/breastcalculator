#!/usr/bin/env python3
"""
Stage 4: Metadata Auditor (Open Graph + Title)
Scans all HTML pages for meta tags and reports:
- Missing/Incomplete OG tags (og:title, og:description, og:type, og:image, og:url)
- Title too long (>60 chars per Google's display limit)
- Title too short (<25 chars)
- Missing meta description

Usage:
  pip install beautifulsoup4
  python seo-tools/stage4_metadata_auditor.py [--base-url https://breastcalculator.com] [--local]
"""

import sys
import os
import re
import csv
import json
import io
from datetime import datetime
from urllib.parse import urlparse
from collections import defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

try:
    from bs4 import BeautifulSoup
except ImportError:
    sys.exit("Please install beautifulsoup4: pip install beautifulsoup4")


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

REQUIRED_OG_TAGS = ["og:title", "og:description", "og:type", "og:image", "og:url"]
RECOMMENDED_OG_TAGS = ["og:site_name", "og:locale"]
TITLE_MAX_LENGTH = 60
TITLE_MIN_LENGTH = 25
DESCRIPTION_MAX_LENGTH = 160
DESCRIPTION_MIN_LENGTH = 50


def get_local_html_files(base_dir=None):
    if base_dir is None:
        base_dir = PROJECT_DIR

    files = []
    for root, dirs, d_files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in ("seo-tools", "output", ".git", "node_modules", "__pycache__")]
        for f in d_files:
            if f.endswith((".html", ".htm")):
                full = os.path.join(root, f)
                rel = os.path.relpath(full, base_dir).replace("\\", "/")
                files.append((full, rel))
    return files


def get_page_url(rel_path, base_url):
    parsed = urlparse(base_url)
    if rel_path == "index.html":
        return f"{parsed.scheme}://{parsed.netloc}/"
    if rel_path.endswith("index.html"):
        return f"{parsed.scheme}://{parsed.netloc}/{rel_path[:-10]}"
    return f"{parsed.scheme}://{parsed.netloc}/{rel_path}"


def extract_meta_tags(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    meta = {
        "title": None,
        "title_length": 0,
        "description": None,
        "description_length": 0,
        "og": {},
        "twitter": {},
        "viewport": None,
        "robots": None,
        "canonical": None,
        "hreflang": [],
        "charset": None,
    }

    title_tag = soup.find("title")
    if title_tag and title_tag.string:
        meta["title"] = title_tag.string.strip()
        meta["title_length"] = len(meta["title"])

    for tag in soup.find_all("meta"):
        name = tag.get("name", "").lower()
        prop = tag.get("property", "").lower()
        content = tag.get("content", "").strip()

        if name == "description":
            meta["description"] = content
            meta["description_length"] = len(content)
        elif name == "viewport":
            meta["viewport"] = content
        elif name == "robots":
            meta["robots"] = content

        if prop.startswith("og:"):
            key = prop
            meta["og"][key] = content
        elif prop.startswith("twitter:"):
            meta["og"][prop] = content

    meta["charset"] = soup.find("meta", charset=True) is not None

    canonical_link = soup.find("link", rel="canonical")
    if canonical_link and canonical_link.get("href"):
        meta["canonical"] = canonical_link["href"].strip()

    for link in soup.find_all("link", rel="alternate"):
        hreflang = link.get("hreflang")
        href = link.get("href")
        if hreflang and href:
            meta["hreflang"].append({"lang": hreflang, "href": href})

    return meta


def audit_page(page_url, filepath, base_url):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    meta = extract_meta_tags(content)
    issues = []

    if not meta["title"]:
        issues.append({"type": "MISSING_TITLE", "severity": "HIGH", "detail": "No <title> tag found"})
    elif meta["title_length"] > TITLE_MAX_LENGTH:
        truncated = meta["title"][:TITLE_MAX_LENGTH - 3].rsplit(" ", 1)[0] + "..."
        issues.append({
            "type": "TITLE_TOO_LONG",
            "severity": "MEDIUM",
            "detail": f"Title is {meta['title_length']} chars (max {TITLE_MAX_LENGTH})",
            "current": meta["title"],
            "suggestion": truncated,
        })
    elif meta["title_length"] < TITLE_MIN_LENGTH:
        issues.append({
            "type": "TITLE_TOO_SHORT",
            "severity": "LOW",
            "detail": f"Title is only {meta['title_length']} chars (min {TITLE_MIN_LENGTH})",
            "current": meta["title"],
        })

    if not meta["description"]:
        issues.append({"type": "MISSING_DESCRIPTION", "severity": "HIGH", "detail": "No meta description"})
    elif meta["description_length"] > DESCRIPTION_MAX_LENGTH:
        issues.append({
            "type": "DESCRIPTION_TOO_LONG",
            "severity": "MEDIUM",
            "detail": f"Description is {meta['description_length']} chars (max {DESCRIPTION_MAX_LENGTH})",
            "current": meta["description"],
        })
    elif meta["description_length"] < DESCRIPTION_MIN_LENGTH:
        issues.append({
            "type": "DESCRIPTION_TOO_SHORT",
            "severity": "LOW",
            "detail": f"Description is only {meta['description_length']} chars",
            "current": meta["description"],
        })

    for og_tag in REQUIRED_OG_TAGS:
        if og_tag not in meta["og"]:
            severity = "HIGH" if og_tag in ("og:title", "og:type", "og:image") else "MEDIUM"
            suggestion = ""
            if og_tag == "og:title" and meta["title"]:
                suggestion = f'<meta property="og:title" content="{meta["title"]}">'
            elif og_tag == "og:description" and meta["description"]:
                suggestion = f'<meta property="og:description" content="{meta["description"]}">'
            elif og_tag == "og:type":
                suggestion = '<meta property="og:type" content="website">'
            elif og_tag == "og:image":
                suggestion = '<meta property="og:image" content="https://breastcalculator.com/og-image.jpg"> (create a 1200x630px image)'
            elif og_tag == "og:url":
                suggestion = f'<meta property="og:url" content="{page_url}">'

            issues.append({
                "type": f"MISSING_{og_tag.upper().replace(':','_')}",
                "severity": severity,
                "detail": f"Missing {og_tag}",
                "suggestion": suggestion,
            })

    if meta["og"].get("og:title") and meta["title"]:
        og_title_len = len(meta["og"]["og:title"])
        if abs(og_title_len - meta["title_length"]) > 20:
            issues.append({
                "type": "OG_TITLE_MISMATCH",
                "severity": "LOW",
                "detail": f"og:title ({og_title_len} chars) differs significantly from <title> ({meta['title_length']} chars)",
                "current": f"title: {meta['title']} | og:title: {meta['og']['og:title']}",
            })

    if not meta["viewport"]:
        issues.append({"type": "MISSING_VIEWPORT", "severity": "HIGH", "detail": "No viewport meta tag"})

    if not meta["canonical"]:
        issues.append({"type": "MISSING_CANONICAL", "severity": "HIGH", "detail": "No canonical link tag"})

    return meta, issues


def run(args=None):
    import argparse
    parser = argparse.ArgumentParser(description="Stage 4: Metadata Auditor")
    parser.add_argument("--base-url", default="https://breastcalculator.com", help="Base URL")
    parser.add_argument("--local", action="store_true", default=True, help="Check local files")
    args = parser.parse_args(args)

    print("=" * 60)
    print("STAGE 4: METADATA AUDITOR (OG + Title)")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    html_files = get_local_html_files()
    print(f"\nScanning {len(html_files)} HTML files...\n")

    all_results = []
    all_issues = []
    summary = defaultdict(int)

    for i, (filepath, rel_path) in enumerate(html_files):
        page_url = get_page_url(rel_path, args.base_url)
        meta, issues = audit_page(page_url, filepath, args.base_url)

        result = {
            "page_url": page_url,
            "file": rel_path,
            "title": meta["title"],
            "title_length": meta["title_length"],
            "description": meta["description"],
            "description_length": meta["description_length"],
            "og_tags": meta["og"],
            "canonical": meta["canonical"],
            "issue_count": len(issues),
            "issues": issues,
        }
        all_results.append(result)

        for iss in issues:
            all_issues.append({"page_url": page_url, **iss})
            summary[iss["type"]] += 1

        status = "⚠️" if issues else "✅"
        issue_types = ", ".join(i["type"] for i in issues)
        print(f"[{i+1}/{len(html_files)}] {status} {page_url}")
        if issues:
            print(f"    Title: {meta['title_length']} chars | OG tags: {len(meta['og'])}/{len(REQUIRED_OG_TAGS)} | Issues: {issue_types}")

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    pages_with_issues = sum(1 for r in all_results if r["issue_count"] > 0)
    print(f"  Pages scanned:        {len(html_files)}")
    print(f"  Pages with issues:    {pages_with_issues}")
    print(f"  Total issues:         {len(all_issues)}")
    print()

    if summary:
        print("Issues by type:")
        for issue_type, count in sorted(summary.items(), key=lambda x: -x[1]):
            print(f"  {count:>3}x {issue_type}")

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")

    csv_out = os.path.join(OUTPUT_DIR, f"metadata_audit_{ts}.csv")
    with open(csv_out, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "page_url", "title", "title_length", "description", "description_length",
            "og_image", "og_type", "og_title", "og_description", "og_url",
            "canonical", "issue_count", "issues_summary",
        ])
        writer.writeheader()
        for r in all_results:
            writer.writerow({
                "page_url": r["page_url"],
                "title": r["title"],
                "title_length": r["title_length"],
                "description": r["description"],
                "description_length": r["description_length"],
                "og_image": r["og_tags"].get("og:image", ""),
                "og_type": r["og_tags"].get("og:type", ""),
                "og_title": r["og_tags"].get("og:title", ""),
                "og_description": r["og_tags"].get("og:description", ""),
                "og_url": r["og_tags"].get("og:url", ""),
                "canonical": r["canonical"],
                "issue_count": r["issue_count"],
                "issues_summary": "; ".join(i["type"] for i in r["issues"]),
            })
    print(f"\n📄 Report: {csv_out}")

    issues_csv = os.path.join(OUTPUT_DIR, f"metadata_issues_{ts}.csv")
    with open(issues_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["page_url", "type", "severity", "detail", "suggestion"])
        writer.writeheader()
        for iss in all_issues:
            writer.writerow({
                "page_url": iss.get("page_url", ""),
                "type": iss.get("type", ""),
                "severity": iss.get("severity", ""),
                "detail": iss.get("detail", ""),
                "suggestion": iss.get("suggestion", iss.get("current", "")),
            })
    print(f"📄 Issues detail: {issues_csv}")

    json_out = os.path.join(OUTPUT_DIR, f"metadata_audit_{ts}.json")
    with open(json_out, "w", encoding="utf-8") as f:
        json.dump({
            "summary": {
                "pages_scanned": len(html_files),
                "pages_with_issues": pages_with_issues,
                "total_issues": len(all_issues),
                "by_type": dict(summary),
            },
            "results": [{
                "page_url": r["page_url"],
                "title": r["title"],
                "title_length": r["title_length"],
                "og_tags_present": list(r["og_tags"].keys()),
                "issues": r["issues"],
            } for r in all_results if r["issue_count"] > 0],
        }, f, indent=2)
    print(f"📄 JSON report: {json_out}")

    print_general_fixes()
    return all_results


def print_general_fixes():
    print("\n" + "=" * 60)
    print("FIX SUGGESTIONS")
    print("=" * 60)

    print("""
1. OG IMAGE (most common missing tag):
   Create a 1200x630px image and add to every page:
   <meta property="og:image" content="https://breastcalculator.com/og-default.jpg">
   <meta property="og:image:width" content="1200">
   <meta property="og:image:height" content="630">

2. TITLE TOO LONG:
   Shorten titles to 50-60 characters while keeping primary keywords.
   Good pattern: "Primary Keyword - Secondary Keyword | Brand"

3. MISSING OG TAGS TEMPLATE:
   Copy this block into <head> of every page:
   <meta property="og:title" content="[PAGE TITLE]">
   <meta property="og:description" content="[PAGE DESCRIPTION]">
   <meta property="og:type" content="[website|article]">
   <meta property="og:image" content="https://breastcalculator.com/og-default.jpg">
   <meta property="og:url" content="[CANONICAL URL]">
   <meta property="og:site_name" content="Breast Calculator">
""")


if __name__ == "__main__":
    run()
