#!/usr/bin/env python3
"""
Stage 3: Broken Image Detector
Scans all HTML pages for <img> tags and verifies each src URL returns 200 with image/* Content-Type.
Works in offline mode (checks against local files) and online mode (HTTP HEAD requests).

Usage:
  pip install requests beautifulsoup4
  python seo-tools/stage3_image_checker.py [--base-url https://breastcalculator.com] [--local]
"""

import sys
import os
import re
import csv
import time
import json
import io
from datetime import datetime
from urllib.parse import urljoin, urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed
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
MAX_WORKERS = 5


def get_local_html_files():
    """Walk project directory and return HTML files."""
    files = []
    for root, dirs, d_files in os.walk(PROJECT_DIR):
        dirs[:] = [d for d in dirs if d not in ("seo-tools", "output", ".git", "node_modules", "__pycache__")]
        for f in d_files:
            if f.endswith((".html", ".htm")):
                full = os.path.join(root, f)
                rel = os.path.relpath(full, PROJECT_DIR).replace("\\", "/")
                files.append((full, rel))
    return files


def get_page_url(rel_path, base_url):
    """Convert relative file path to full URL."""
    parsed = urlparse(base_url)
    if rel_path == "index.html":
        return f"{parsed.scheme}://{parsed.netloc}/"
    if rel_path.endswith("index.html"):
        return f"{parsed.scheme}://{parsed.netloc}/{rel_path[:-10]}"
    return f"{parsed.scheme}://{parsed.netloc}/{rel_path}"


def extract_image_urls(html_content, page_url):
    """Extract all image sources from HTML."""
    soup = BeautifulSoup(html_content, "html.parser")
    images = []
    seen = set()

    for img in soup.find_all("img"):
        src = img.get("src", "").strip()
        if not src:
            continue

        # Data URIs are always valid
        if src.startswith("data:"):
            continue

        # SVG inline
        if src.startswith("<svg"):
            continue

        absolute_url = urljoin(page_url, src)
        if absolute_url not in seen:
            seen.add(absolute_url)
            images.append({
                "src": src,
                "absolute_url": absolute_url,
                "alt": img.get("alt", "").strip() or "(missing alt)",
                "width": img.get("width", ""),
                "height": img.get("height", ""),
            })

    # Also check CSS background images
    style_matches = re.findall(r'background(?:-image)?\s*:\s*url\(["\']?([^"\')\s]+)["\']?\)', html_content, re.IGNORECASE)
    for url in style_matches:
        absolute_url = urljoin(page_url, url)
        if absolute_url not in seen and not absolute_url.startswith("data:"):
            seen.add(absolute_url)
            images.append({
                "src": url,
                "absolute_url": absolute_url,
                "alt": "(CSS background)",
                "width": "",
                "height": "",
            })

    return images


def check_image_url(url, timeout=TIMEOUT):
    """HEAD request to check image status."""
    try:
        resp = requests.head(url, headers={"User-Agent": USER_AGENT}, timeout=timeout, allow_redirects=True)
        content_type = resp.headers.get("Content-Type", "")
        is_image = content_type.startswith("image/")
        return {
            "status_code": resp.status_code,
            "content_type": content_type,
            "is_image": is_image,
            "final_url": resp.url,
            "error": None,
        }
    except requests.exceptions.Timeout:
        return {"status_code": -1, "content_type": "", "is_image": False, "final_url": url, "error": "Timeout"}
    except requests.exceptions.ConnectionError as e:
        return {"status_code": -1, "content_type": "", "is_image": False, "final_url": url, "error": f"Connection error: {e}"}
    except Exception as e:
        return {"status_code": -1, "content_type": "", "is_image": False, "final_url": url, "error": str(e)}


def check_image_local(absolute_url, base_url):
    """In local mode, check if image exists as a local file."""
    parsed = urlparse(absolute_url)
    path = parsed.path.lstrip("/")

    local_path = os.path.join(PROJECT_DIR, path)
    if os.path.exists(local_path):
        ext = os.path.splitext(local_path)[1].lower()
        image_exts = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp", ".ico", ".avif"}
        is_image = ext in image_exts
        return {
            "status_code": 200,
            "content_type": f"image/{ext[1:]}" if is_image else "unknown",
            "is_image": is_image,
            "final_url": absolute_url,
            "error": None,
        }
    else:
        return {
            "status_code": 404,
            "content_type": "",
            "is_image": False,
            "final_url": absolute_url,
            "error": f"File not found: {local_path}",
        }


def run(args=None):
    import argparse
    parser = argparse.ArgumentParser(description="Stage 3: Broken Image Detector")
    parser.add_argument("--base-url", default="https://breastcalculator.com", help="Base URL")
    parser.add_argument("--local", action="store_true", help="Check against local files")
    parser.add_argument("--delay", type=float, default=0.5, help="Delay between requests")
    args = parser.parse_args(args)

    print("=" * 60)
    print("STAGE 3: BROKEN IMAGE DETECTOR")
    print(f"Mode: {'LOCAL' if args.local else 'ONLINE'}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    html_files = get_local_html_files()
    print(f"\nScanning {len(html_files)} HTML files...\n")

    all_images = []
    broken_images = []
    page_image_map = defaultdict(list)

    for filepath, rel_path in html_files:
        page_url = get_page_url(rel_path, args.base_url)

        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        images = extract_image_urls(content, page_url)
        if not images:
            continue

        page_image_map[page_url] = images
        all_images.extend(images)
        print(f"  {page_url}: {len(images)} image(s)")

    if not all_images:
        print("\n✅ No images found on any page.")
        return

    unique_images = {}
    for img in all_images:
        if img["absolute_url"] not in unique_images:
            unique_images[img["absolute_url"]] = img

    print(f"\nChecking {len(unique_images)} unique image URLs...\n")

    if args.local:
        for i, (img_url, img_info) in enumerate(unique_images.items()):
            print(f"[{i+1}/{len(unique_images)}] {img_url}")
            result = check_image_local(img_url, args.base_url)
            img_info["check_result"] = result

            if result["status_code"] != 200 or not result["is_image"]:
                err_msg = result['error'] or f"Status {result['status_code']}"
                print(f"  BROKEN: {err_msg}")
                # Find source pages
                source_pages = [p for p, imgs in page_image_map.items()
                               if any(i["absolute_url"] == img_url for i in imgs)]
                broken_images.append({
                    "image_url": img_url,
                    "original_src": img_info["src"],
                    "alt": img_info["alt"],
                    "source_pages": ", ".join(source_pages),
                    "status_code": result["status_code"],
                    "error": result["error"],
                })
            else:
                print(f"  ✅ OK")
    else:
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            futures = {executor.submit(check_image_url, url): url for url in unique_images}
            for i, future in enumerate(as_completed(futures)):
                url = futures[future]
                result = future.result()
                img_info = unique_images[url]
                img_info["check_result"] = result

                print(f"[{i+1}/{len(unique_images)}] {url}")
                if result["status_code"] != 200 or not result["is_image"]:
                    source_pages = [p for p, imgs in page_image_map.items()
                                   if any(i["absolute_url"] == url for i in imgs)]
                    broken_images.append({
                        "image_url": url,
                        "original_src": img_info["src"],
                        "alt": img_info["alt"],
                        "source_pages": ", ".join(source_pages),
                        "status_code": result["status_code"],
                        "error": result["error"],
                    })
                    err_msg2 = result['error'] or f"Status {result['status_code']}"
                    print(f"  BROKEN: {err_msg2}")
                else:
                    print(f"  ✅ OK ({result['content_type']})")

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  Total pages scanned:   {len(html_files)}")
    print(f"  Unique image URLs:     {len(unique_images)}")
    print(f"  Broken images:         {len(broken_images)}")

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")

    if broken_images:
        print(f"\n❌ BROKEN IMAGES ({len(broken_images)}):")
        csv_out = os.path.join(OUTPUT_DIR, f"broken_images_{ts}.csv")
        with open(csv_out, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=["image_url", "original_src", "alt", "source_pages", "status_code", "error"])
            writer.writeheader()
            writer.writerows(broken_images)
        print(f"📄 Report: {csv_out}")

        for bi in broken_images:
            print(f"\n  Image: {bi['image_url']}")
            print(f"  Alt:   {bi['alt']}")
            print(f"  Page:  {bi['source_pages']}")
            print(f"  Error: {bi['error']}")
            print(f"  Fix:   Replace src with correct URL or use placeholder image")
    else:
        print("\n✅ No broken images found!")

    json_out = os.path.join(OUTPUT_DIR, f"image_audit_{ts}.json")
    with open(json_out, "w", encoding="utf-8") as f:
        json.dump({
            "summary": {
                "pages_scanned": len(html_files),
                "unique_images": len(unique_images),
                "broken_images": len(broken_images),
            },
            "broken": broken_images,
        }, f, indent=2)
    print(f"\n📄 JSON report: {json_out}")

    return broken_images


if __name__ == "__main__":
    run()
