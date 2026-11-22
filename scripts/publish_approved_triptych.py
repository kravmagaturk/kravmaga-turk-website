#!/usr/bin/env python3
"""Install only the two approved KMT triptych assets and change only their homepage img tag.
Old images, CSS, other pages, navigation, scripts, and SEO stay untouched.
"""
from __future__ import annotations
import base64
import json
import os
from pathlib import Path
import re
import subprocess
import urllib.request

REPO = "kravmagaturk/kravmaga-turk-website"
BLOBS = {
    "assets/home/kmt-egitim-uc-panel-20261122-750.webp": "edb9f53e47163cf58518f5a407a565ee4a8bc3b1",
    "assets/home/kmt-egitim-uc-panel-20261122-1370.webp": "7ab3a984d46d5d85726878586d74f590c8b8e0ed",
}

def github_blob(sha):
    req = urllib.request.Request(
        f"https://api.github.com/repos/{REPO}/git/blobs/{sha}",
        headers={
            "Authorization": f"Bearer {os.environ['GH_TOKEN']}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
    )
    with urllib.request.urlopen(req, timeout=25) as response:
        obj=json.load(response)
    if obj.get("encoding") != "base64":
        raise RuntimeError(f"Unexpected GitHub blob encoding for {sha}")
    raw=base64.b64decode(obj["content"])
    actual=subprocess.run(["git", "hash-object", "--stdin"],input=raw,
                          stdout=subprocess.PIPE,check=True).stdout.decode().strip()
    if actual != sha:
        raise ValueError("Blob SHA verification failed")
    if not (raw[:4]==b"RIFF" and raw[8:12]==b"WEBP"):
        raise ValueError("Not a WebP file")
    return raw

def main():
    for name,sha in BLOBS.items():
        data=github_blob(sha)
        dest=Path(name)
        dest.parent.mkdir(exist_ok=True,parents=True)
        dest.write_bytes(data)
        print(f"Image verified and installed: {name} ({len(data)} bytes)")
    p=Path("index.html")
    html=p.read_text(encoding="utf-8")
    # Find only the approved home education image; preserve all three overlay links.
    pattern=(r'<img\s+src="assets/home/egitim-secenekleri-20261006-1370\.webp"'
             r'[^>]*alt="Krav Maga İstanbul genel ders, özel ders ve çocuk Krav Maga eğitimleri"[^>]*>')
    found=list(re.finditer(pattern,html,re.S))
    if len(found)!=1:
        raise ValueError(f"Expected one previous homepage triptych image, found {len(found)}")
    old=found[0].group(0)
    tag=old.replace(
        'assets/home/egitim-secenekleri-20261006-1370.webp',
        'assets/home/kmt-egitim-uc-panel-20261122-1370.webp'
    ).replace(
        'assets/home/egitim-secenekleri-20261006-750.webp',
        'assets/home/kmt-egitim-uc-panel-20261122-750.webp'
    ).replace('height="769"','height="771"')
    if 'height="771"' not in tag or '750.webp 750w' not in tag:
        raise ValueError("Image dimensions or responsive references not set")
    updated=html[:found[0].start()]+tag+html[found[0].end():]
    for link in ['href="/krav-maga"','href="/ozel-dersler"','href="/cocuk-krav-maga"']:
        if link not in updated or updated.count(link)!=html.count(link):
            raise ValueError(f"Card navigation unexpectedly changed: {link}")
    if updated==html:
        raise ValueError("No HTML update")
    p.write_text(updated,encoding="utf-8")
    print("Updated only education triptych img tag; card links and SEO preserved")

if __name__=="__main__":
    main()
