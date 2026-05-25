#!/usr/bin/env python3
"""
Master Runner - executes all 4 SEO audit stages in sequence.
Run with --local to audit local files, or provide --base-url for online mode.

Usage:
  pip install -r seo-tools/requirements.txt
  python seo-tools/run_all.py --local
  python seo-tools/run_all.py --base-url https://breastcalculator.com
"""

import sys
import os
import subprocess
import time
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def run_stage(script_name, extra_args):
    script_path = os.path.join(BASE_DIR, script_name)
    cmd = [sys.executable, script_path] + extra_args
    print("\n" + "=" * 70)
    print(f"RUNNING: {' '.join(cmd)}")
    print("=" * 70)

    start = time.time()
    result = subprocess.run(cmd, cwd=BASE_DIR)
    elapsed = time.time() - start

    if result.returncode == 0:
        print(f"\n✅ {script_name} completed in {elapsed:.1f}s")
    else:
        print(f"\n❌ {script_name} FAILED (code {result.returncode}) in {elapsed:.1f}s")

    return result.returncode


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Run all SEO audit stages")
    parser.add_argument("--local", action="store_true", default=True, help="Audit local files")
    parser.add_argument("--base-url", default="https://breastcalculator.com", help="Base URL for online mode")
    parser.add_argument("--stage", type=int, choices=[1, 2, 3, 4], help="Run a single stage only")
    args = parser.parse_args()

    common_args = ["--local"] if args.local else ["--base-url", args.base_url]

    stages = [
        ("stage1_sitemap_redirects.py", common_args),
        ("stage2_canonical_checker.py", common_args),
        ("stage3_image_checker.py", common_args),
        ("stage4_metadata_auditor.py", common_args),
    ]

    print("=" * 70)
    print("BREAST CALCULATOR - SEO AUDIT SUITE")
    print(f"Mode: {'LOCAL (file check)' if args.local else 'ONLINE (HTTP)'}")
    print(f"Start: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)

    total_start = time.time()
    failures = 0

    for script_name, extra_args in stages:
        stage_num = int(script_name[5])
        if args.stage and args.stage != stage_num:
            continue
        rc = run_stage(script_name, extra_args)
        if rc != 0:
            failures += 1

    total_elapsed = time.time() - total_start

    print("\n" + "=" * 70)
    print(f"ALL STAGES COMPLETED in {total_elapsed:.1f}s")
    print(f"Failures: {failures}/4")
    print(f"Reports: {os.path.join(BASE_DIR, 'output')}")
    print("=" * 70)


if __name__ == "__main__":
    main()
