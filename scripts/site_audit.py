#!/usr/bin/env python3
"""Snelle statische controle van de volledige GitHub Pages-site.
Run: python scripts/site_audit.py
"""
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
FILES = {p.relative_to(ROOT).as_posix() for p in ROOT.rglob("*") if p.is_file()}
FILES = {p for p in FILES if not p.startswith(".git/")}
CODE = ["index.html", "app_core.js", "lessons_v2.js", "grammar_v2.js",
        "conv_duo.js", "vocab_duo.js", "exercises_v2.js", "parse_data.js",
        "styles.css", "polish.css"]

class LocalResources(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        url = attrs.get("src") or (attrs.get("href") if tag == "link" else None)
        if not url or url.startswith(("http://","https://","data:","//","#")):
            return
        path = url.split("?", 1)[0].split("#", 1)[0]
        if path:
            self.paths.add(path)

def check():
    missing = set()
    assets = set()
    for file in CODE:
        assert file in FILES, f"Websitebestand ontbreekt: {file}"
        text = (ROOT / file).read_text(encoding="utf-8")
        # Alle statische afbeeldings-, lettertype- en sitepaden moeten bestaan.
        assets.update(re.findall(
            r"(?<![\w/])(?:img|fonts|assets)/[a-zA-Z0-9_./-]+\.(?:jpg|jpeg|png|webp|svg|woff2?)",
            text))
    resources = LocalResources()
    resources.feed((ROOT / "index.html").read_text(encoding="utf-8"))
    assets.update(resources.paths)
    missing = {a for a in assets if a not in FILES}
    assert not missing, "Ontbrekende websitebestanden: " + ", ".join(sorted(missing))

    html = (ROOT / "index.html").read_text(encoding="utf-8")
    assert "lang=\"nl\"" in html and 'meta name="viewport"' in html
    assert 'href="polish.css?' in html
    assert "window.renderConvUnit" in html and "window.renderConv" in html, "Vernieuwde dialoogweergave wordt niet aangeroepen"
    grammar = (ROOT / "grammar_v2.js").read_text(encoding="utf-8")
    assert "gram-trans-toggle" in grammar and "LS_TRANS_KEY" in grammar
    dialog = (ROOT / "conv_duo.js").read_text(encoding="utf-8")
    assert not re.search(r"<img\b|conv-spk-avatar|heroImg", dialog, re.I)
    assert "conv-speaker" in dialog and "line.nl" in dialog and "line.ar" in dialog

    pdfs = sorted((ROOT / "pdf").glob("woordenlijst-les-*.pdf"))
    assert len(pdfs) == 22, f"22 PDF-woordenlijsten verwacht, {len(pdfs)} gevonden"
    for pdf in pdfs:
        assert pdf.read_bytes()[:5] == b"%PDF-", f"Corrupt PDF: {pdf}"
    print(f"OK: {len(CODE)} applicatiebestanden, {len(assets)} lokale verwijzingen, "
          f"{len(pdfs)} PDF's en alle navigatie-resources gecontroleerd.")

if __name__ == "__main__":
    check()
