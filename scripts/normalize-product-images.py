#!/usr/bin/env python3
"""Trim baked-in studio background from product photos and write normalized copies."""

from __future__ import annotations

import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "images"
OUT = ROOT / "public" / "images" / "normalized"
DATA = ROOT / "src" / "data.js"

PADDING = 12
THRESHOLD_LIGHT = 42
THRESHOLD_DARK = 28
CARD_BG = (245, 240, 231)


def files_from_data() -> list[str]:
    text = DATA.read_text()
    products = text.split("export const PRODUCTS")[1].split("];")[0]
    names = re.findall(r'(?:n?img)\("([^"]+)"\)', products)
    return sorted(set(names))


def background_color(rgb: np.ndarray) -> np.ndarray:
    h, w, _ = rgb.shape
    p = max(4, min(h, w) // 30)
    patches = [
        rgb[:p, :p],
        rgb[:p, w - p :],
        rgb[h - p :, :p],
        rgb[h - p :, w - p :],
        rgb[:p, w // 2 - p : w // 2 + p],
        rgb[h - p :, w // 2 - p : w // 2 + p],
        rgb[h // 2 - p : h // 2 + p, :p],
        rgb[h // 2 - p : h // 2 + p, w - p :],
    ]
    samples = np.concatenate([patch.reshape(-1, 3) for patch in patches], axis=0)
    return np.median(samples, axis=0)


CARD_BG = (245, 240, 231)


def content_bbox(rgb: np.ndarray, alpha: np.ndarray | None) -> tuple[int, int, int, int] | None:
    step = 4 if min(rgb.shape[:2]) > 200 else 1
    small = rgb[::step, ::step]
    a_small = alpha[::step, ::step] if alpha is not None else None
    transparent = a_small is not None and float(np.median(np.concatenate([
        a_small[:4, :4].ravel(),
        a_small[:4, -4:].ravel(),
        a_small[-4:, :4].ravel(),
        a_small[-4:, -4:].ravel(),
    ]))) < 16

    if transparent:
        mask = a_small > 64
    else:
        bg = background_color(rgb)
        luma = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]
        threshold = THRESHOLD_DARK if luma < 60 else THRESHOLD_LIGHT
        dist = np.sqrt(((small.astype(np.int32) - bg.astype(np.int32)) ** 2).sum(axis=2))
        px_luma = 0.299 * small[:, :, 0] + 0.587 * small[:, :, 1] + 0.114 * small[:, :, 2]
        if luma < 60:
            mask = (px_luma > 26) & (dist > threshold)
        elif luma > 205:
            mask = (px_luma < 235) & (dist > threshold)
        else:
            mask = dist > threshold
        if a_small is not None:
            mask &= a_small > 16

    row_hits = mask.sum(axis=1)
    col_hits = mask.sum(axis=0)
    row_thresh = max(2, int(0.02 * mask.shape[1]))
    col_thresh = max(2, int(0.02 * mask.shape[0]))
    rows = np.where(row_hits >= row_thresh)[0]
    cols = np.where(col_hits >= col_thresh)[0]
    if rows.size == 0 or cols.size == 0:
        return None
    y0, y1 = int(rows[0] * step), int((rows[-1] + 1) * step)
    x0, x1 = int(cols[0] * step), int((cols[-1] + 1) * step)
    h, w = rgb.shape[:2]
    return x0, y0, min(w, x1), min(h, y1)


def flatten_on_card(cropped: Image.Image, rgb: np.ndarray) -> Image.Image:
    rgba = cropped.convert("RGBA")
    bg = Image.new("RGB", rgba.size, CARD_BG)
    bg.paste(rgba, mask=rgba.split()[3])
    arr = np.asarray(bg).copy()
    luma = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
    source_bg = background_color(rgb)
    source_luma = 0.299 * source_bg[0] + 0.587 * source_bg[1] + 0.114 * source_bg[2]
    if source_luma < 60:
        dark = luma < 18
        arr[dark] = CARD_BG
        bg = Image.fromarray(arr)
    return bg


def trim(path: Path, dest: Path) -> str:
    rgba = Image.open(path).convert("RGBA")
    arr = np.asarray(rgba)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]
    box = content_bbox(rgb, alpha)
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not box:
        flatten_on_card(rgba, rgb).save(dest, "JPEG", quality=88, optimize=True)
        return "copy"
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    pad = max(PADDING, int(0.045 * max(bw, bh)))
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(rgb.shape[1], x1 + pad)
    y1 = min(rgb.shape[0], y1 + pad)
    flatten_on_card(rgba.crop((x0, y0, x1, y1)), rgb).save(dest, "JPEG", quality=88, optimize=True)
    before = rgb.shape[0] * rgb.shape[1]
    after = (x1 - x0) * (y1 - y0)
    return f"trim {after / before:.0%}"


def main() -> int:
    names = files_from_data()
    if not names:
        print("No product images found in data.js")
        return 1
    print(f"Normalizing {len(names)} product images → {OUT}")
    for name in names:
        src_name = re.sub(r"\.[^.]+$", lambda m: m.group(0), name)
        src = SRC / src_name
        if not src.exists():
            src = SRC / Path(name).with_suffix(".png")
        if not src.exists():
            src = SRC / Path(name).with_suffix(".jpg")
        dest = OUT / Path(name).with_suffix(".jpg")
        if not src.exists():
            print("missing", name)
            continue
        try:
            print(f"{name}: {trim(src, dest)}")
        except Exception as err:
            print(f"{name}: FAIL {err}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
