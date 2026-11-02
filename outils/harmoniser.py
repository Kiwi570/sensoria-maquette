#!/usr/bin/env python3
"""Harmonisation chaude légère des vraies photos du client, avant outils/images.py.

Usage, depuis la racine du projet :
  python3 outils/harmoniser.py recu/site recu/harmonise

Réglage volontairement discret (la photo reste fidèle) : une pointe de chaleur dans les tons moyens,
un léger relèvement des noirs, une saturation à peine relevée. Les logos et les images Grok ne passent pas ici.
"""
import sys
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps


def harmoniser(img):
    img = ImageOps.exif_transpose(img).convert("RGB")
    r, g, b = img.split()
    r = r.point(lambda v: min(255, round(v * 1.035 + 3)))
    g = g.point(lambda v: min(255, round(v * 1.01 + 2)))
    b = b.point(lambda v: round(v * 0.955 + 4))
    img = Image.merge("RGB", (r, g, b))
    img = ImageEnhance.Color(img).enhance(1.04)
    img = ImageEnhance.Contrast(img).enhance(0.98)
    return img


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    for p in sorted(src.rglob("*.jp*g")):
        if "logo" in p.parts or "partenaires" in p.parts:
            continue
        sortie = dst / p.relative_to(src).with_suffix(".jpg")
        sortie.parent.mkdir(parents=True, exist_ok=True)
        harmoniser(Image.open(p)).save(sortie, "JPEG", quality=93)
        print("OK", sortie)
