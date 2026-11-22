#!/usr/bin/env python3
"""One-time, conservative optimization of public, locally served KMT images.

- No source images are deleted.
- No CSS or layout settings are modified.
- Existing HTML width/height, alt, links and social metadata are untouched.
- Skip conversions that do not reduce bytes.
"""
from __future__ import annotations

import re
from pathlib import Path
from PIL import Image, ImageOps, ImageChops

ROOT = Path(__file__).resolve().parents[1]
# Explicit allowlist: only visible local photographs and a blog poster.
IMAGES = {
    "assets/home/ugur-tatar.jpg": ["index.html"],
    "assets/home/burcu-ergulen.jpg": ["index.html"],
    "assets/legionnaire/bulent-cetin-legionnaire-hero-natural-20261004.jpg": ["legionnaire.html"],
    "assets/krav-maga/krav-maga-hero-20261004.jpg": ["krav-maga.html"],
    "assets/press/basin-hero.jpg": ["cocuk-krav-maga.html"],
    "assets/social/blog-1200x630.jpg": ["blog-krav-maga-dunya-gundemi-ekim-2026.html"],
}
# Existing, verified lossless WebP asset; never alter the protected PNG.
EXISTING_WEBP = {
    "assets/okul-guvenligi-ozel-egitimli-guvenlik-personeli.png":
      ("assets/okul-guvenligi-ozel-egitimli-guvenlik-personeli.webp",
       ["blog-okul-guvenligi-ozel-egitimli-guvenlik.html"]),
}
IMG_TAG = re.compile(r"<img\b[^>]*>", re.I | re.S)


def write_webp(image: Image.Image, destination: Path, *, quality: int = 88) -> None:
    save_params = {"format": "WEBP", "method": 6, "quality": quality}
    if image.info.get("icc_profile"):
        save_params["icc_profile"] = image.info["icc_profile"]
    image.save(destination, **save_params)
    with Image.open(destination) as verified:
        if verified.size != image.size:
            raise ValueError(f"Dimensions changed: {destination}")


def replace_visible_images(page: Path, old: str, new: str,
                           variants: list[tuple[int, str]]) -> int:
    original = page.read_text(encoding="utf-8")
    modified = [0]

    def update(match: re.Match) -> str:
        tag = match.group(0)
        # Only local <img src>; don't change og:image, JSON-LD, anchors or scripts.
        pattern = re.compile(
            r'(?P<prefix>\bsrc\s*=\s*["\x27])(?P<slash>/?)'
            + re.escape(old) + r'(?P<query>\?[^"\x27]*|)(?P<suffix>["\x27])',
            re.I,
        )
        if not pattern.search(tag):
            return tag
        tag = pattern.sub(
            lambda m: m.group("prefix") + m.group("slash") + new
            + m.group("query") + m.group("suffix"), tag, count=1
        )
        if variants and not re.search(r'\bsrcset\s*=', tag, re.I):
            # Only picture-bearing images that already declare intrinsic dimensions.
            if re.search(r'\bwidth\s*=', tag, re.I) and re.search(r'\bheight\s*=', tag, re.I):
                srcset = ", ".join(
                    m.group(1) + f" {width}w"
                    for width, path in variants
                    for m in [re.match(r"(.+)", "/" + path if 'src="/' in tag else path)]
                )
                sizes = '(max-width: 760px) 100vw, 100vw'
                tag = tag[:-1] + f' srcset="{srcset}" sizes="{sizes}">'
        modified[0] += 1
        return tag

    updated = IMG_TAG.sub(update, original)
    if updated != original:
        page.write_text(updated, encoding="utf-8")
    return modified[0]


def main() -> None:
    changes = 0
    for old, pages in IMAGES.items():
        source = ROOT / old
        if not source.is_file():
            raise FileNotFoundError(f"Required original image missing: {old}")
        dest_relative = str(Path(old).with_suffix(".webp"))
        dest = ROOT / dest_relative
        with Image.open(source) as opened:
            opened.load()
            im = ImageOps.exif_transpose(opened)
            if im.mode not in ("RGB", "RGBA"):
                im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
            write_webp(im, dest, quality=90 if "assets/social/" in old else 88)
            original_bytes = source.stat().st_size
            webp_bytes = dest.stat().st_size
            if webp_bytes >= original_bytes:
                dest.unlink()
                print(f"KEEP ORIGINAL: {old}, WebP larger ({webp_bytes}/{original_bytes})")
                continue
            variants: list[tuple[int, str]] = []
            if im.width >= 950:
                for width in (720, 1280):
                    if width >= im.width:
                        continue
                    height = max(1, round(im.height * width / im.width))
                    rescaled = im.resize((width, height), Image.Resampling.LANCZOS)
                    relative = str(Path(old).with_suffix("")) + f"-{width}.webp"
                    write_webp(rescaled, ROOT / relative, quality=88)
                    variants.append((width, relative))
                variants.append((im.width, dest_relative))
            for page_name in pages:
                n = replace_visible_images(ROOT / page_name, old, dest_relative, variants)
                if not n:
                    raise ValueError(f"Expected visible image not found in {page_name}: {old}")
                changes += n
            print(f"OPTIMIZED {old} => {dest_relative}: {original_bytes} -> {webp_bytes} bytes; {im.width}x{im.height}")
    for old, (new, pages) in EXISTING_WEBP.items():
        if not (ROOT / new).is_file() or not (ROOT / old).is_file():
            raise FileNotFoundError(f"Protected original or existing WebP missing: {old}")
        with Image.open(ROOT / old) as original, Image.open(ROOT / new) as converted:
            if original.size != converted.size:
                print(f"SKIP existing WebP: dimensions differ for {old}")
                continue
            diff = ImageChops.difference(original.convert("RGBA"), converted.convert("RGBA"))
            if any(channel.getbbox() is not None for channel in diff.split()):
                print(f"SKIP existing WebP: not pixel-identical to {old}")
                continue
        for page_name in pages:
            n = replace_visible_images(ROOT / page_name, old, new, [])
            if not n:
                raise ValueError(f"Original PNG not found in image tag in {page_name}")
            changes += n
        print(f"REUSED EXISTING PIXEL-IDENTICAL WEBP: {new}")
    print(f"Changed visible <img> references: {changes}. Originals retained.")


if __name__ == "__main__":
    main()
