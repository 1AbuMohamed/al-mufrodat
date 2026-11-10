#!/usr/bin/env python3
"""Genereer de originele, per les gebundelde woordenlijsten als PDF.
Bron: GRAMMATICA in lessons_v2.js; laat de bronbestanden ongemoeid.
Gebruik: python scripts/generate_wordlists.py
Vereist: pip install weasyprint
"""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

from weasyprint import HTML

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "lessons_v2.js"
OUT = ROOT / "pdf"
GLOSSARY = re.compile(r"^\s*Woordenlijst van les\b", re.I)


def extract_glossaries():
    source = SOURCE.read_text(encoding="utf-8")
    match = re.search(r"window\.GRAMMATICA\s*=\s*", source)
    if not match:
        raise ValueError("GRAMMATICA ontbreekt in lessons_v2.js")
    decoder = json.JSONDecoder()
    lessons, _ = decoder.raw_decode(source[match.end():].lstrip())
    glossaries = {}
    for lesson_number, lesson in lessons.items():
        items = lesson.get("inhoud", [])
        lists = []
        for i, item in enumerate(items):
            if item.get("type") != "tekst" or not GLOSSARY.match(item.get("tekst", "")):
                continue
            if i + 1 >= len(items) or items[i + 1].get("type") != "tabel":
                raise ValueError(f"Woordenlijst van les {lesson_number} mist een tabel")
            table = items[i + 1]
            notes = []
            for subsequent in items[i + 2:]:
                if subsequent.get("type") == "regel" and re.match(r"^\s*\*", subsequent.get("tekst", "")):
                    notes.append(subsequent["tekst"])
                else:
                    break
            lists.append({
                "title": item["tekst"],
                "headers": table.get("kop", ["Arabisch", "Nederlands"]),
                "rows": table.get("rijen", []),
                "notes": notes,
            })
        if lists:
            glossaries[int(lesson_number)] = lists
    return glossaries


def make_html(lesson_number, lists):
    def e(value):
        return html.escape(str(value or ""), quote=True)

    parts = []
    for data in lists:
        headers = "".join(f"<th>{e(x)}</th>" for x in data["headers"][:2])
        rows = []
        for row in data["rows"]:
            if len(row) < 2:
                continue
            rows.append(
                '<tr><td class="arabic" lang="ar" dir="rtl">'
                + e(row[0])
                + '</td><td>'
                + e(row[1])
                + "</td></tr>"
            )
        notes = "".join(f"<p class='note'>{e(x)}</p>" for x in data["notes"])
        parts.append(
            f"<section><h2>{e(data['title'])}</h2>"
            f"<table><thead><tr>{headers}</tr></thead>"
            f"<tbody>{''.join(rows)}</tbody></table>{notes}</section>"
        )

    return f"""<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<title>Al-Mufrodat - Woordenlijst les {lesson_number}</title>
<style>
@page {{ size: A4; margin: 19mm 18mm 19mm; 
  @bottom-center {{ content: "Al-Mufrodat · Les {lesson_number} · pagina " counter(page); color:#657777; font-size:9px; }}
}}
@font-face {{ font-family: "Amiri-local"; src: url("fonts/amiri-regular-ar.woff2") format("woff2"); font-weight:400; }}
@font-face {{ font-family: "Amiri-local"; src: url("fonts/amiri-bold-ar.woff2") format("woff2"); font-weight:700; }}
body {{ color:#173235; font: 11pt/1.55 "DejaVu Sans", sans-serif; }}
.header {{ border-bottom:3px solid #c49a45; padding-bottom:12px; margin-bottom:22px; }}
.brand {{ font-size:13px; font-weight:700; letter-spacing:.04em; color:#14605a; }}
h1 {{ font-size:23px; margin:6px 0 0; color:#12383b; }}
.sub {{ color:#647675; font-size:10px; margin:3px 0 0; }}
h2 {{ font-size:15px; color:#12383b; margin:20px 0 9px; break-after:avoid; }}
section {{ break-inside:auto; }}
table {{ width:100%; border-collapse:collapse; table-layout:fixed; margin-bottom:16px; }}
thead {{ display:table-header-group; }}
tr {{ break-inside:avoid; }}
th {{ text-align:left; background:#12383b; color:white; font-size:10.5px; padding:8px 12px; }}
th:first-child {{ text-align:right; }}
td {{ vertical-align:middle; padding:7px 12px; border-bottom:1px solid #dce5df; overflow-wrap:break-word; }}
tbody tr:nth-child(2n) td {{ background:#f4f7f5; }}
td.arabic {{ text-align:right; font: 18pt/1.45 "Amiri-local", "Noto Naskh Arabic", serif; overflow-wrap:normal; }}
.note {{ color:#566667; font-size:9.5px; margin:4px 0 8px; }}
</style>
</head>
<body>
<div class="header"><div class="brand">AL-MUFRODAT · MEDINA ARABISCH</div>
<h1>Woordenlijst · Les {lesson_number}</h1>
<p class="sub">Arabisch – Nederlands · Medina-methode · Deel 1</p></div>
{''.join(parts)}
</body></html>"""


def main():
    glossaries = extract_glossaries()
    if not glossaries:
        raise RuntimeError("Geen woordenlijsten gevonden; er zijn geen PDF's gegenereerd")
    OUT.mkdir(exist_ok=True)
    for file in OUT.glob("woordenlijst-les-*.pdf"):
        if int(file.stem.rsplit("-", 1)[-1]) not in glossaries:
            file.unlink()
    for number, lists in sorted(glossaries.items()):
        destination = OUT / f"woordenlijst-les-{number:02d}.pdf"
        HTML(string=make_html(number, lists), base_url=ROOT.as_uri() + "/").write_pdf(destination)
        amount = sum(len(section["rows"]) for section in lists)
        print(f"{destination.relative_to(ROOT)} : {len(lists)} lijst(en), {amount} woorden")
    print(f"Klaar: {len(glossaries)} PDF's, {sum(map(len, glossaries.values()))} originele lijsten")


if __name__ == "__main__":
    main()
