#!/usr/bin/env python3
"""Patch ONLY Bülent Hoca's portrait and original tattoo within the current two-person home hero.
Burcu Hoca, background graphics, central academy logo, mobile/desktop geometry and HTML are preserved.
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image, ImageChops, ImageFilter, ImageDraw, ImageStat
from io import BytesIO
import base64, hashlib
ROOT=Path(__file__).resolve().parents[1]
ORIGINAL=ROOT/"assets/home/kmt-hero-logo-silik-1280-20261123.webp"
APPROVED=ROOT/"assets/home/bulent-approved-appearance-20261123.png"
DESKTOP=ROOT/"assets/home/kmt-hero-bulent-detail-1280-20261123.webp"
MOBILE=ROOT/"assets/home/kmt-hero-bulent-detail-720-20261123.webp"

def apply():
    assert ORIGINAL.is_file() and APPROVED.is_file()
    original=Image.open(ORIGINAL).convert("RGB")
    generated=Image.open(APPROVED).convert("RGB")
    assert original.size==(1280,720),original.size
    assert generated.size==(1448,1086),generated.size
    before=original.copy()

    # The original hero has Bülent on the left and Burcu on the right.
    # Only retouch Bülent's head in its original position; preserve his pose.
    face=generated.crop((525,0,935,450)).resize((210,251),Image.Resampling.LANCZOS)
    # Match the generated portrait's lighting to the existing gym photo without changing the background.
    old_skin=ImageStat.Stat(original.crop((332,176,421,258))).median
    new_skin=ImageStat.Stat(face.crop((78,106,140,172))).median
    # Keep changes modest, to avoid unnatural hair and skin color transitions.
    gain=[max(.74,min(1.08,(old_skin[i]+0.01)/(new_skin[i]+0.01))) for i in range(3)]
    face=face.point(lambda value: value) # explicit no geometry change
    fr,fg,fb=face.split()
    face=Image.merge("RGB",tuple(ch.point(lambda v,g=g:int(min(255,v*g))) for ch,g in zip((fr,fg,fb),gain)))
    # Preserve the existing complete straight hairstyle and silhouette.
    # Blend only face/stubble/skin INSIDE the original head; no foreign background.
    mask=Image.new("L",face.size,0)
    ImageDraw.Draw(mask).ellipse((23,65,190,240),fill=233)
    mask=mask.filter(ImageFilter.GaussianBlur(17))
    original.paste(face,(265,72),mask)

    # Source: exact compact, dark tattoo approved by owner; do not invent a legionary helmet.
    # Extract tattoo ink strength from the orange skin in the source rather than pasting a skin rectangle.
    tattoo=generated.crop((456,709,592,844)).resize((81,81),Image.Resampling.LANCZOS)
    ta=Image.new("L",tattoo.size,0)
    source_px=tattoo.load(); alpha_px=ta.load()
    for y in range(81):
        for x in range(81):
            r,g,b=source_px[x,y]
            brightness=.299*r+.587*g+.114*b
            ink=max(0.,min(.90,(166.0-brightness)/135.0))
            if ink<.14: ink=0.
            alpha_px[x,y]=round(255*ink)
    edge=Image.new("L",tattoo.size,0)
    ImageDraw.Draw(edge).ellipse((1,1,79,79),fill=255)
    edge=edge.filter(ImageFilter.GaussianBlur(5))
    import PIL.ImageChops as Ch
    ta=Ch.multiply(ta,edge)
    darkink=Image.new("RGB",tattoo.size,(43,35,31))
    original.paste(darkink,(177,482),ta)

    diff=ImageChops.difference(before,original)
    bbox=diff.getbbox()
    assert bbox, "No difference"
    # Absolutely nothing is allowed to change in Burcu's half or in the logo/background right side.
    assert bbox[0]>=120 and bbox[1]>=50 and bbox[2]<=505 and bbox[3]<=600,(bbox,"unexpected modification outside Bülent region")
    assert ImageChops.difference(before.crop((520,0,1280,720)),original.crop((520,0,1280,720))).getbbox() is None
    original.save(DESKTOP,format="WEBP",quality=84,method=6)
    original.resize((720,405),Image.Resampling.LANCZOS).save(MOBILE,format="WEBP",quality=85,method=6)
    print("PASS: only Bülent left image altered, Burcu and center/right pixels identical",flush=True)
    print("SAVED",DESKTOP.relative_to(ROOT),DESKTOP.stat().st_size,MOBILE.stat().st_size,"DIFF_BBOX",bbox,"SKIN_GAINS",gain,flush=True)
    thumb=original.resize((960,540),Image.Resampling.LANCZOS)
    out=BytesIO();thumb.save(out,format="JPEG",quality=60,optimize=True)
    print("BEGIN_BULENT_HERO_PREVIEW",flush=True)
    print(base64.b64encode(out.getvalue()).decode("ascii"),flush=True)
    print("END_BULENT_HERO_PREVIEW",flush=True)

if __name__=="__main__":apply()
