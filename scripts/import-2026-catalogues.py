#!/usr/bin/env python3
"""Pull product photos from the 2026 catalogues into the shop data."""

from __future__ import annotations

import json
import re
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images" / "catalog" / "2026"
DATA = ROOT / "src" / "data.js"
MANIFEST = ROOT / "scripts" / "catalog-2026.json"

DOWNLOADS = Path("/Users/dhanashreenawale/Downloads")
SOURCES = [
    ("corp", DOWNLOADS / "Corporate_Gifting_Catalogue_2026.pdf", "corporate", "Corporate"),
    ("diwali", DOWNLOADS / "Diwali_Gift_Collection_2026.pdf", "diwali", "Diwali"),
    ("all", DOWNLOADS / "All Product E-Catalogue-2026-27 New (1).pdf", "corporate", "All Product"),
]

MIN_W = 140
MIN_H = 120


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def js_string(text: str) -> str:
    return json.dumps(text, ensure_ascii=False)


def title_case_heading(text: str) -> str:
    text = clean(text)
    letters = [c for c in text if c.isalpha()]
    if letters and sum(c.isupper() for c in letters) / len(letters) > 0.8:
        small = {"a", "an", "and", "or", "the", "of", "in", "with", "for", "to"}
        words = []
        for i, word in enumerate(text.lower().split()):
            words.append(word if i and word in small else word.capitalize())
        return " ".join(words)
    return text


def text_blocks(page) -> list[dict]:
    blocks = []
    for block in page.get_text("dict")["blocks"]:
        if block.get("type") != 0:
            continue
        parts = []
        for line in block["lines"]:
            line_text = clean("".join(span["text"] for span in line["spans"]))
            if line_text:
                parts.append(line_text)
        text = clean(" ".join(parts))
        if not text:
            continue
        x0, y0, x1, y1 = block["bbox"]
        blocks.append({"text": text, "lines": parts, "bbox": (x0, y0, x1, y1)})
    return blocks


def image_boxes(page) -> list[tuple[float, float, float, float]]:
    boxes = []
    for block in page.get_text("dict")["blocks"]:
        if block.get("type") != 1:
            continue
        x0, y0, x1, y1 = block["bbox"]
        w, h = x1 - x0, y1 - y0
        if w < MIN_W or h < MIN_H:
            continue
        if w > page.rect.width * 0.92 and h > page.rect.height * 0.92:
            continue
        boxes.append((x0, y0, x1, y1))
    boxes.sort(key=lambda b: (round(b[1], 0), round(b[0], 0)))
    kept = []
    for box in boxes:
        if any(overlap(box, prev) > 0.72 for prev in kept):
            continue
        kept.append(box)
    return kept


def overlap(a, b) -> float:
    ix0, iy0 = max(a[0], b[0]), max(a[1], b[1])
    ix1, iy1 = min(a[2], b[2]), min(a[3], b[3])
    iw, ih = max(0, ix1 - ix0), max(0, iy1 - iy0)
    inter = iw * ih
    if inter <= 0:
        return 0
    area_a = (a[2] - a[0]) * (a[3] - a[1])
    area_b = (b[2] - b[0]) * (b[3] - b[1])
    return inter / min(area_a, area_b)


def is_noise(text: str) -> bool:
    low = text.lower().replace("’", "'").replace("‘", "'")
    if len(text) < 2 or len(text) > 48:
        return True
    needles = (
        "catalogue",
        "representative",
        "what's inside",
        "whats inside",
        "see also",
        "diwali gift collection",
        "for your corporate",
    )
    return any(n in low for n in needles) or text.endswith("of 56") or " of " in low and low[:1].isdigit()


def caption_for(box, blocks) -> str | None:
    x0, y0, x1, y1 = box
    best = None
    best_gap = 999
    for block in blocks:
        bx0, by0, bx1, by1 = block["bbox"]
        gap = by0 - y1
        if gap < -8 or gap > 28:
            continue
        if bx0 > x1 - 12 or bx1 < x0 + 12:
            continue
        text = block["text"]
        if is_noise(text) or "·" in text or text.startswith("*"):
            continue
        if gap < best_gap:
            best = text
            best_gap = gap
    return best


def section_label(blocks, page_h: float) -> str:
    lines = []
    for block in blocks:
        if block["bbox"][1] > 120:
            continue
        lines.extend(block.get("lines") or [block["text"]])
    useful = []
    for line in lines:
        letters = [c for c in line if c.isalpha()]
        if not letters:
            continue
        words = line.split()
        spaced = len(words) > 4 and sum(len(w) == 1 for w in words) / len(words) > 0.55
        if spaced:
            continue
        low = line.lower()
        if "catalogue" in low or "collection 2026" in low or re.search(r"\d+\s*[–-]\s*\d+\s+of\s+\d+", low):
            continue
        useful.append(title_case_heading(line))
    if not useful:
        return "Gift"
    heading = useful[0]
    if len(useful) > 1 and len(useful[1]) < 42 and useful[1].lower() not in heading.lower():
        heading = f"{heading} — {useful[1]}"
    return heading[:72]


def save_clip(page, box, dest: Path) -> None:
    pad = 4
    rect = pymupdf.Rect(box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad) & page.rect
    pix = page.get_pixmap(matrix=pymupdf.Matrix(1.7, 1.7), clip=rect, alpha=False)
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(".raw.jpg")
    pix.save(str(tmp), jpg_quality=80)
    img = Image.open(tmp).convert("RGB")
    img.thumbnail((1000, 1000))
    img.save(dest, "JPEG", quality=82, optimize=True)
    tmp.unlink(missing_ok=True)


def save_page(page, dest: Path) -> None:
    pix = page.get_pixmap(matrix=pymupdf.Matrix(1.35, 1.35), alpha=False)
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(".raw.jpg")
    pix.save(str(tmp), jpg_quality=76)
    img = Image.open(tmp).convert("RGB")
    img.thumbnail((1100, 1400))
    img.save(dest, "JPEG", quality=78, optimize=True)
    tmp.unlink(missing_ok=True)


def skip_page(text: str, kind: str, index: int, page_count: int) -> bool:
    low = text.lower()
    if kind == "diwali" and (index == 0 or index == page_count - 1):
        return True
    if kind == "corp" and index == 0:
        return True
    if "s e c t i o n" in low or "inside this catalogue" in low:
        return True
    if kind == "all" and (index == 0 or len(clean(text)) < 8):
        return True
    return False


def collect() -> list[dict]:
    products = []
    counters: dict[str, int] = {}
    seq: dict[str, int] = {}

    def add(kind, category, tag, name, page, box, blurb_key):
        key = f"{kind}:{name.lower()}"
        counters[key] = counters.get(key, 0) + 1
        label = name if counters[key] == 1 else f"{name} {counters[key]}"
        seq[kind] = seq.get(kind, 0) + 1
        n = seq[kind]
        file_name = f"{kind}-{n:04d}.jpg"
        dest = OUT / file_name
        if box is None:
            save_page(page, dest)
        else:
            save_clip(page, box, dest)
        products.append(
            {
                "id": f"cat26-{kind}-{n:04d}",
                "name": label,
                "category": category,
                "file": f"catalog/2026/{file_name}",
                "blurb": blurb_key,
                "tags": [tag, "2026"],
            }
        )

    for kind, path, category, tag in SOURCES:
        doc = pymupdf.open(path)
        if kind == "all":
            for i, page in enumerate(doc):
                text = page.get_text("text")
                if skip_page(text, kind, i, doc.page_count):
                    continue
                blocks = text_blocks(page)
                heading = section_label(blocks, page.rect.height)
                if heading == "Gift":
                    heading = "Premium Gift Set"
                add(kind, category, tag, heading, page, None, "curated")
            doc.close()
            continue

        section_counts: dict[str, int] = {}
        for i, page in enumerate(doc):
            text = page.get_text("text")
            if skip_page(text, kind, i, doc.page_count):
                continue
            blocks = text_blocks(page)
            boxes = image_boxes(page)
            if not boxes:
                continue
            section = section_label(blocks, page.rect.height)
            for box in boxes:
                caption = caption_for(box, blocks)
                if caption:
                    name = title_case_heading(caption)
                    blurb = "curated"
                else:
                    section_counts[section] = section_counts.get(section, 0) + 1
                    name = f"{section} {section_counts[section]}"
                    blurb = "elegant" if kind == "diwali" else "handcrafted"
                add(kind, category, tag, name, page, box, blurb)
        doc.close()
    return products


def write_data(products: list[dict]) -> None:
    blurbs = {"curated": "COPY.curated", "elegant": "COPY.elegant", "handcrafted": "COPY.handcrafted"}
    lines = []
    for product in products:
        tags = ", ".join(js_string(tag) for tag in product["tags"])
        lines.append(
            "  {\n"
            f"    id: {js_string(product['id'])},\n"
            f"    name: {js_string(product['name'])},\n"
            f"    category: {js_string(product['category'])},\n"
            f"    image: img({js_string(product['file'])}),\n"
            f"    blurb: {blurbs[product['blurb']]},\n"
            f"    tags: [{tags}],\n"
            "  },"
        )
    block = "\n".join(lines)
    text = DATA.read_text()
    text = re.sub(r"\n  \{\n    id: \"cat26-(?:[^{}]|\n)*?\n  \},", "", text)
    if 'id: "diwali"' not in text:
        text = text.replace(
            '  { id: "corporate", label: "Corporate Gift", title: "Corporate Gift", image: img("asset-02.png"), tone: "gold" },\n];',
            '  { id: "corporate", label: "Corporate Gift", title: "Corporate Gift", image: img("asset-02.png"), tone: "gold" },\n'
            '  { id: "diwali", label: "Diwali Gift", title: "Diwali Gift", image: img("catalog/2026/diwali-0001.jpg"), tone: "amber" },\n];',
        )
        text = text.replace(
            '  { label: "Corporate Gift", q: "corporate" },\n];',
            '  { label: "Corporate Gift", q: "corporate" },\n  { label: "Diwali Gift", q: "diwali" },\n];',
        )
    needle = "export const PRODUCTS = [\n"
    if needle not in text:
        raise SystemExit("PRODUCTS array not found")
    text = text.replace(needle, needle + block + "\n", 1)
    DATA.write_text(text)
    MANIFEST.write_text(json.dumps(products, indent=2))


def main() -> None:
    if OUT.exists():
        for old in OUT.glob("*.jpg"):
            old.unlink()
    products = collect()
    write_data(products)
    from collections import Counter
    counts = Counter(p["category"] for p in products)
    print(f"products {len(products)} {dict(counts)}")
    for product in products[:12]:
        print(product["id"], product["name"])
    print("...")
    for product in products[-6:]:
        print(product["id"], product["name"])


if __name__ == "__main__":
    main()
