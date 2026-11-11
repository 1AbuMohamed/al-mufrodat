"""Controleer het Grammatica Lab in een echte mobiele browser (Playwright).

Run: pip install playwright && python -m playwright install chromium
     python scripts/test_grammar_lab_browser.py
Doorloopt les 5 (theoriekaarten, vragen, zinsontleding), controleert de opmaak
op zes schermbreedtes en dat er geen JavaScript-fouten optreden.
"""
from __future__ import annotations

import os
import threading
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def assert_layout(page, width):
    page.set_viewport_size({"width": width, "height": 844})
    page.wait_for_timeout(50)
    info = page.evaluate("""() => ({
      width: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
      card: (() => {
        const r = document.querySelector('.gd-card')?.getBoundingClientRect();
        return r && { x: r.x, right: r.right };
      })()
    })""")
    assert info["scroll"] <= info["width"] + 2, f"Hor. overflow bij {width}px: {info}"
    assert info["card"] and info["card"]["x"] >= -1 and info["card"]["right"] <= info["width"] + 2, (
        f"Kaart valt buiten het scherm bij {width}px: {info}")


def answer(page, task):
    kind = task["type"]
    if kind in ("lab", "ontleed", "theory", "rule", "why", "reverse", "gap"):
        page.locator(f'[data-action="select"][data-value="{task["options"].index(task["answer"])}"]').click()
    elif kind == "choice":
        page.locator(f'[data-action="select"][data-value="{task["options"].index(task["example"]["nl"].strip())}"]').click()
    elif kind == "order":
        for i in range(len(task["words"])):
            page.locator(f'[data-action="tile"][data-value="{i}"]').click()
    elif kind == "find":
        page.locator(f'[data-action="word"][data-value="{task["wordIndex"]}"]').click()
    else:
        raise AssertionError(f"Onbekend opdrachttype: {kind}")
    page.locator('[data-action="check"]').click()


def complete_lesson(page, n):
    steps = 0
    while page.locator(".gd-task").count() == 1 and steps < 40:
        task = page.evaluate("window.GrammarLabCore.current()")
        answer(page, task)
        assert page.locator(".gd-feedback.good").count() == 1, f"Goed antwoord niet herkend ({task['type']})"
        if task["type"] == "ontleed":
            assert page.locator(".gd-parse-table li").count() >= 2, "Volledige ontleding ontbreekt"
        page.locator('[data-action="next"]').click()
        steps += 1
    assert page.locator(".gd-finish").count() == 1, "Eindscherm ontbreekt"
    print(f"OK: les {n}: {steps} opdrachten goed beantwoord")


def main():
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", 0), Quiet)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    errors = []
    base = f"http://127.0.0.1:{server.server_port}/grammatica-test.html"
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--no-sandbox"], channel=os.environ.get("PW_CHANNEL") or None)
            page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1, is_mobile=True, has_touch=True)
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.goto(f"{base}?les=5", wait_until="domcontentloaded")
            page.wait_for_selector(".gd-lab-card", timeout=15000)
            for width in (320, 355, 375, 390, 430, 768):
                assert_layout(page, width)
            page.set_viewport_size({"width": 390, "height": 844})
            cards = 1
            while page.locator('[data-action="theory-next"]').count():
                last = page.locator('[data-action="theory-next"]').inner_text().strip().lower().startswith("start")
                page.locator('[data-action="theory-next"]').click()
                if last:
                    break
                cards += 1
            assert cards >= 3, "Te weinig theoriekaarten"
            page.wait_for_selector(".gd-task", timeout=5000)
            complete_lesson(page, 5)
            page.goto(base, wait_until="domcontentloaded")
            page.wait_for_selector('[data-h="tab"][data-v="lessons"]', timeout=10000)
            page.locator('[data-h="tab"][data-v="lessons"]').click()
            page.wait_for_selector(".lh-tile", timeout=10000)
            assert page.locator(".lh-tile").count() == 24
            assert not errors, "Browserfouten: " + ", ".join(errors)
            browser.close()
            print("OK: 24 leskaarten, geen JavaScript-fouten.")
    finally:
        server.shutdown()


if __name__ == "__main__":
    main()
