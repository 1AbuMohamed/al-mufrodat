"""Controleer de échte grammaticaweergave in een mobiele Chromium-browser.

Run: pip install playwright && python -m playwright install chromium
     python scripts/test_mobile_layout.py
"""
from __future__ import annotations

import os
from pathlib import Path
import shutil
import threading
import time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def inspect(page, width: int):
    page.set_viewport_size({"width": width, "height": 844})
    page.wait_for_timeout(90)
    data = page.evaluate("""() => {
      const rect = selector => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};
      };
      return {
        viewport:document.documentElement.clientWidth,
        scrollWidth:document.documentElement.scrollWidth,
        prev:rect('.gram-lesson-header .gram-pager-prev a'),
        next:rect('.gram-lesson-header .gram-pager-next a'),
        counter:rect('.gram-lesson-header .gram-pager-count'),
        header:rect('.gram-lesson-header'),
        title:rect('.gram-lesson-header .gram-lesson-title'),
        tools:rect('.gram-reading-tools'),
        label:rect('.gram-reading-label'),
        toggle:rect('.gram-trans-control'),
        root:rect('.gram-lesson-wrap')
      };
    }""")
    assert data["prev"] and data["next"], f"Lesknoppen ontbreken bij {width}px: {data}"
    assert data["tools"] and data["title"], f"Leskop ontbreekt bij {width}px: {data}"
    assert data["scrollWidth"] <= data["viewport"] + 2, f"Horizontale pagina-overflow bij {width}px: {data}"
    assert abs(data["prev"]["y"] - data["next"]["y"]) < 3, f"Lesknoppen op verschillende regels bij {width}px: {data}"
    for key in ("prev", "next", "tools", "toggle"):
        r = data[key]
        assert r["x"] >= -1 and r["right"] <= data["viewport"] + 2, f"{key} valt uit beeld bij {width}px: {r}"
    assert data["tools"]["height"] <= 75, f"Vertaaloptie is te hoog bij {width}px: {data['tools']}"
    assert data["label"]["right"] <= data["toggle"]["x"] + 2, f"Vertaaloptie overlapt bij {width}px"
    assert data["title"]["y"] < data["prev"]["y"] < data["tools"]["y"], f"Verkeerde volgorde bij {width}px"
    print(f"OK {width}px: vorige/volgende op één rij; vertaalbalk {data['tools']['height']:.0f}px; geen overflow")


def main():
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    chrome = (shutil.which("google-chrome") or shutil.which("chromium") or
              shutil.which("chromium-browser"))
    try:
        with sync_playwright() as p:
            opts = {"headless": True, "args": ["--no-sandbox"]}
            if chrome:
                opts["executable_path"] = chrome
            browser = p.chromium.launch(**opts)
            page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1, is_mobile=True, has_touch=True)
            url = f"http://127.0.0.1:{server.server_port}/#/grammatica/5"
            page.goto(url, wait_until="domcontentloaded", timeout=25000)
            page.wait_for_selector(".gram-lesson-header .gram-lesson-title", timeout=20000)
            assert page.locator(".gram-lesson-title").inner_text().strip() == "Les 5"
            for width in (320, 355, 375, 390, 430, 768):
                inspect(page, width)
            page.locator("#gram-trans-toggle").uncheck()
            assert page.locator(".gram-trans-off").count() == 1
            assert page.locator(".gram-trans-caption").inner_text() == "Uit"
            page.locator("#gram-trans-toggle").check()
            assert page.locator(".gram-trans-off").count() == 0
            assert page.locator(".gram-trans-caption").inner_text() == "Aan"
            page.locator(".gram-lesson-header .gram-pager-next a").click()
            page.wait_for_function("document.querySelector('.gram-lesson-title')?.textContent.trim() === 'Les 6'")
            assert page.locator("#gram-done-cb").count() == 1, "Dubbele afgerond-checkbox"
            # Actief ophalen van de vertaling; oorspronkelijke lesinhoud blijft behouden.
            assert page.locator(".gram-ex-row").count() > 1, "Voorbeelden ontbreken"
            assert page.locator(".gram-next-actions button").count() == 2, "Leerroute ontbreekt"
            first = page.locator(".gram-ex-row").filter(has=page.locator(".gram-reveal-btn")).first
            example_ar = first.locator(".gram-ar").inner_text()
            example_nl = first.locator(".gram-nl").inner_text()
            assert example_ar.strip() and example_nl.strip()
            page.locator("#gram-trans-toggle").uncheck()
            button = first.locator(".gram-reveal-btn")
            assert button.is_visible(), "Zelftest-knop ontbreekt wanneer vertalingen uit staan"
            assert not first.locator(".gram-nl").is_visible(), "Vertaling moet verborgen zijn"
            button.click()
            assert first.locator(".gram-nl").is_visible(), "Enkele vertaling werd niet onthuld"
            assert button.inner_text() == "Vertaling verbergen"
            button.click()
            assert not first.locator(".gram-nl").is_visible()
            page.locator("#gram-trans-toggle").check()
            assert first.locator(".gram-nl").is_visible(), "Globale vertaalinstelling werkt niet"
            assert first.locator(".gram-ar").inner_text() == example_ar, "Arabische inhoud veranderde"
            assert first.locator(".gram-nl").inner_text() == example_nl, "Nederlandse inhoud veranderde"
            print("OK: zelftest per voorbeeld werkt zonder Arabisch of Nederlands te wijzigen")
            page.set_viewport_size({"width": 390, "height": 844})
            page.locator(".gram-next-vocab").click()
            page.wait_for_function("window.state?.view === 'flash'")
            page.locator('.tabbar [data-act="nav"][data-v="vocab"]').click()
            page.wait_for_selector(".duo-lesson-actions .duo-practice-btn")
            assert page.locator(".duo-lesson-actions .duo-practice-btn").count() >= 23
            assert page.locator(".duo-lesson-actions .vocab-pdf-link").count() == 22
            action = page.locator('.duo-practice-btn[data-l="6"]')
            assert action.is_visible()
            action.click()
            page.wait_for_function("window.state?.view === 'learn'")
            print("OK: leerroute grammatica → woordenschat → lesquiz werkt")
            # Controleer ook de afzonderlijke grammaticaoefeningen vanuit de les.
            page.goto(f"http://127.0.0.1:{server.server_port}/#/grammatica/6", wait_until="domcontentloaded")
            page.wait_for_selector(".gram-next-exercise", timeout=20000)
            page.locator(".gram-next-exercise").click()
            page.wait_for_function("window.state?.view === 'ex-lesson'")
            assert page.locator("#app").inner_text().strip(), "Oefenpagina is leeg"
            print("OK: grammatica → oefeningen van dezelfde les werkt")
            print("OK: schakelaar werkt en volgende-lesknop navigeert naar Les 6")
            browser.close()
    finally:
        server.shutdown()


if __name__ == "__main__":
    main()
