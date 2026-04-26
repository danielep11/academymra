#!/usr/bin/env python3
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WIDTHS = (320, 480, 640, 960, 1280)
SKIP_DIRS = {"responsive"}
SUPPORTED = {".jpg", ".jpeg", ".png", ".webp"}

def should_skip(path: Path) -> bool:
    if any(part in SKIP_DIRS for part in path.parts):
        return True
    if path.name.startswith("icon-"):
        return True
    if path.suffix.lower() not in SUPPORTED:
        return True
    return False

created = 0
for src in (ROOT / "assets/images").rglob("*"):
    if should_skip(src):
        continue
    try:
        with Image.open(src) as im:
            im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
            width, height = im.size
            for w in WIDTHS:
                if width <= w:
                    continue
                out = src.with_name(f"{src.stem}-w{w}.webp")
                if out.exists():
                    continue
                ratio = w / width
                resized = im.resize((w, max(1, int(height * ratio))), Image.Resampling.LANCZOS)
                resized.save(out, "WEBP", quality=78, method=6)
                created += 1
    except Exception as exc:
        print(f"Skipping {src}: {exc}")
print(f"Created {created} responsive WebP files")
