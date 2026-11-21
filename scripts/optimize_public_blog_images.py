#!/usr/bin/env python3
"""Create pixel-preserving WebP copies of selected public blog images.

The source PNG files remain unchanged, including any sharing/metadata references.
Only <img src="..."> references on the public pages are switched after a
meaningful reduction in actual file size. No admin, diploma or student file
is read or modified.
"""
from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
TARGETS = {
    "assets/blog/kolluk-ozel-guvenlik-krav-maga-20261121.png": (
        "blog.html",
        "blog-kolluk-ozel-guvenlik-krav-maga-egitimi.html",
    ),
    "assets/blog/cocuklarda-yangin-guvenligi-surunme-20261115.png": (
        "blog-cocuklar-icin-yangin-guvenligi.html",
    ),
    "assets/blog/udemy-ogrenci-haritasi-2026-10-30-koyu.png": (
        "blog-online-egitim-27-ulkede.html",
    ),
    "assets/acil-cikis-plani-bulent-burcu-20261027.png": (
        "blog-acil-cikis-plani-kalabalik-ortam.html",
    ),
}
MAX_RATIO = 0.90


def optimize(source_rel: str, page_rels: tuple[str, ...]) -> None:
    source = ROOT / source_rel
    target = source.with_suffix(".webp")
    temp = target.with_suffix(".tmp.webp")
    if not source.is_file():
        raise FileNotFoundError(source)
    with Image.open(source) as original:
        original.load()
        original_rgba = original.convert("RGBA")
        original_rgba.save(temp, format="WEBP", lossless=True, quality=100, method=6, exact=True)

    old_size, new_size = source.stat().st_size, temp.stat().st_size
    with Image.open(temp) as encoded:
        encoded.load()
        if encoded.size != original_rgba.size:
            raise AssertionError(f"Image size changed: {source_rel}")
        diff = ImageChops.difference(original_rgba, encoded.convert("RGBA"))
        if any(channel.getbbox() is not None for channel in diff.split()):
            raise AssertionError(f"Lossless image pixels changed: {source_rel}")

    if new_size > old_size * MAX_RATIO:
        temp.unlink()
        print(f"SKIP {source_rel}: PNG {old_size}, WebP {new_size} (not 10% smaller)")
        return

    replacements = {}
    old_attr = f'src="/{source_rel}"'
    new_attr = f'src="/{target.relative_to(ROOT).as_posix()}"'
    for page_rel in page_rels:
        page = ROOT / page_rel
        html = page.read_text(encoding="utf-8")
        if old_attr in html:
            replacements[page] = html.replace(old_attr, new_attr)
        elif new_attr not in html:
            temp.unlink()
            raise AssertionError(f"Expected public image missing: {page_rel}: {old_attr}")
    temp.replace(target)
    for page, html in replacements.items():
        page.write_text(html, encoding="utf-8")
    saved = 100 * (old_size - new_size) / old_size
    print(f"OK {source_rel} -> {target.name}: {old_size} -> {new_size} bytes, {saved:.1f}% smaller")


if __name__ == "__main__":
    for source_rel, page_rels in TARGETS.items():
        optimize(source_rel, page_rels)
