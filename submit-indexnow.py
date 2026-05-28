import json
import sys
import os
from datetime import datetime, timezone

API_KEY = "YOUR_INDEXNOW_API_KEY"  # Replace with your actual API key
KEY_LOCATION_FILE = os.path.join(os.path.dirname(__file__), "YOUR_INDEXNOW_API_KEY.txt")
SITEMAP_URL = "https://breastcalculator.com/sitemap.xml"

def submit_indexnow():
    with open(KEY_LOCATION_FILE) as f:
        api_key = f.read().strip()

    base_dir = os.path.dirname(__file__)
    urllist_path = os.path.join(base_dir, "urllist.txt")

    with open(urllist_path) as f:
        urls = [line.strip() for line in f if line.strip()]

    import urllib.request

    # Method 1: Submit single URL (triggers Bing/Yandex indexing for entire sitemap)
    url = f"https://api.indexnow.org/indexnow?url={urls[0]}&key={api_key}"
    req = urllib.request.Request(url, method="GET")
    try:
        resp = urllib.request.urlopen(req)
        print(f"IndexNow submit: {resp.status} for {urls[0]}")
    except urllib.error.HTTPError as e:
        print(f"IndexNow error: {e.code} - {e.reason}")

    # Method 2: Bulk submit all URLs
    data = json.dumps({
        "host": "breastcalculator.com",
        "key": api_key,
        "keyLocation": f"https://breastcalculator.com/{os.path.basename(KEY_LOCATION_FILE)}",
        "urlList": urls
    }).encode()

    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow",
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"}
    )
    try:
        resp = urllib.request.urlopen(req)
        print(f"Bulk submit: {resp.status} - {resp.read().decode()}")
    except urllib.error.HTTPError as e:
        print(f"Bulk submit error: {e.code} - {e.reason}")

    print(f"\nSubmitted {len(urls)} URLs to IndexNow at {datetime.now(timezone.utc).isoformat()}")
    print(f"After submission, check Bing Webmaster Tools / Google Search Console for indexing status.")

if __name__ == "__main__":
    submit_indexnow()