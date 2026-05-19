"""Optimize renders/photos for landing page.

Usage:
    python optimize-images.py <src_folder> <dst_folder>

Auto-detects hero vs gallery from filename pattern. Renames to clean slugs.
Output: progressive JPGs <1.3MB each, total typically <8MB for 10 images.
"""
import sys, os
from pathlib import Path
from PIL import Image

# Edit this map for each new launch:
# key   = source filename pattern (case-insensitive)
# value = (clean destination filename, max width in pixels)
RENAMES = {
    'tower-exterior':     ('hero-torre.jpg',         2200),
    'facade':             ('rua-fachada.jpg',        1600),
    'lobby':              ('lobby.jpg',              1600),
    'coworking':          ('coworking.jpg',          1600),
    'pool-rooftop':       ('piscina.jpg',            1600),
    'bbq':                ('gourmet.jpg',            1600),
    'apartment-portrait': ('apto-portrait.jpg',      1400),
    'apartment-landscape':('apto-landscape.jpg',     1600),
    'mini-mercadinho':    ('minimarket.jpg',         1600),
    'yoga':               ('yoga.jpg',               1600),
}

QUALITY = 82  # drop to 78 if total > 8MB

def main():
    if len(sys.argv) != 3:
        sys.exit("usage: python optimize-images.py <src> <dst>")
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    dst.mkdir(parents=True, exist_ok=True)

    files = sorted(src.iterdir())
    total_bytes = 0

    for f in files:
        if f.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp', '.heic'}:
            continue

        # match by substring in filename
        match = next(
            ((dn, mw) for key, (dn, mw) in RENAMES.items() if key in f.stem.lower()),
            None
        )
        if not match:
            print(f"SKIP  {f.name}  (no rename rule)")
            continue
        dst_name, max_w = match

        try:
            im = Image.open(f).convert('RGB')
        except Exception as e:
            print(f"ERR   {f.name}: {e}")
            continue

        w, h = im.size
        if w > max_w:
            new_h = int(h * max_w / w)
            im = im.resize((max_w, new_h), Image.LANCZOS)

        out_path = dst / dst_name
        im.save(out_path, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
        sz_kb = out_path.stat().st_size / 1024
        total_bytes += out_path.stat().st_size
        print(f"OK    {dst_name:24s}  {im.size[0]:4d}x{im.size[1]:4d}  {sz_kb:6.0f}KB")

    print(f"\nTOTAL: {total_bytes/1024/1024:.2f} MB")
    if total_bytes > 8 * 1024 * 1024:
        print("⚠️  Total > 8MB. Considere reduzir QUALITY pra 78 ou usar WebP.")

if __name__ == "__main__":
    main()
