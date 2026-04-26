#!/usr/bin/env python3
from pathlib import Path
from datetime import date
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://www.academymra.com"
EXCLUDE = {"404.html"}
NOINDEX_NAMES = {"account.html"}

def public_html_files():
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT)
        if any(part.startswith(".") for part in rel.parts):
            continue
        if rel.name in EXCLUDE or rel.name in NOINDEX_NAMES:
            continue
        yield rel

def loc_for(rel):
    s = rel.as_posix()
    if s.endswith("index.html"):
        s = s[:-10]
    return f"{BASE_URL}/{s}"

def priority_for(rel):
    name = rel.name
    if name == "index.html" and len(rel.parts) == 1:
        return "1.0"
    if name in {"corsi.html", "seminari.html", "libri.html", "mappa-percorsi.html"}:
        return "0.8"
    if name.startswith(("corso-", "articolo-")):
        return "0.7"
    return "0.6"

def freq_for(rel):
    if rel.name in {"index.html", "corsi.html", "seminari.html", "articoli-pubblici.html"}:
        return "weekly"
    if rel.name.startswith(("articolo-", "corso-")):
        return "monthly"
    return "monthly"

today = date.today().isoformat()
items = []
for rel in public_html_files():
    items.append(
        "  <url>"
        f"<loc>{escape(loc_for(rel))}</loc>"
        f"<lastmod>{today}</lastmod>"
        f"<changefreq>{freq_for(rel)}</changefreq>"
        f"<priority>{priority_for(rel)}</priority>"
        "</url>"
    )

(ROOT / "sitemap.xml").write_text(
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
    + "\n".join(items)
    + "\n</urlset>\n",
    encoding="utf-8",
)
print(f"Generated sitemap.xml with {len(items)} URLs")
