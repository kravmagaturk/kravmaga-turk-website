#!/usr/bin/env python3
"""Publish 2026-11-23 approved three-class graphic, changing one homepage image tag."""
from pathlib import Path
import re
from PIL import Image

src = Path("assets/home/kmt-egitim-source-20261123.png")
assert src.is_file(), "Approved artwork missing"
with Image.open(src) as original:
    assert original.size == (1670, 942), f"Unexpected original size: {original.size}"
    rgb = original.convert("RGB")
    for width, quality in [(750, 78), (1370, 80), (1670, 83)]:
        height = round(942 * width / 1670)
        dest = Path(f"assets/home/kmt-egitim-bulent-ogrenci-20261123-{width}.webp")
        resized = rgb.resize((width, height), Image.Resampling.LANCZOS)
        resized.save(dest, "WEBP", quality=quality, method=6)
        data = dest.read_bytes()
        assert data[:4] == b"RIFF" and data[8:12] == b"WEBP"
        assert len(data) < 300_000, (str(dest), len(data))
        print(f"Verified {dest}: {width}x{height}, {len(data)} bytes")

page = Path("index.html")
html = page.read_text(encoding="utf-8")
pattern = r'<img src="assets/home/kmt-egitim-son-onay-20261122-1670\.webp"[^>]*>'
matches = list(re.finditer(pattern, html))
if len(matches) != 1:
    raise RuntimeError(f"Expected exactly one education triptych, found {len(matches)}")
old = matches[0].group(0)
if old.count("kmt-egitim-son-onay-20261122") != 4:
    raise RuntimeError("Unexpected source/srcset image references")
tag = old
for width in (750, 1370, 1670):
    tag = tag.replace(
        f"kmt-egitim-son-onay-20261122-{width}.webp",
        f"kmt-egitim-bulent-ogrenci-20261123-{width}.webp")
if 'width="1670" height="941"' not in tag:
    raise RuntimeError("Unexpected image dimensions in existing HTML")
tag = tag.replace('width="1670" height="941"', 'width="1670" height="942"')
updated = html[:matches[0].start()] + tag + html[matches[0].end():]
for href in ('href="/krav-maga"', 'href="/ozel-dersler"', 'href="/cocuk-krav-maga"'):
    if html.count(href) < 1 or html.count(href) != updated.count(href):
        raise RuntimeError(f"Link unexpectedly changed: {href}")
if any(x not in tag for x in ('loading="lazy"', 'decoding="async"', 'fetchpriority="low"', '750w', '1370w', '1670w')):
    raise RuntimeError("Responsive image or performance attributes changed")
assert updated != html
page.write_text(updated, encoding="utf-8")
print("Education section image switched; existing overlays, headings, links, hero and SEO unchanged")
