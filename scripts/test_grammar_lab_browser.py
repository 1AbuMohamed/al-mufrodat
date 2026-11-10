"""Controleer het zelfstandige Grammatica Lab in een echte mobiele browser.

Run: pip install playwright && python -m playwright install chromium
     python scripts/test_grammar_lab_browser.py
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
      main: (() => {
        const r = document.querySelector('.gd-card')?.getBoundingClientRect();
        return r && { x: r.x, right: r.right, width: r.width };
      })()
    })""")
    assert info["scroll"] <= info["width"] + 2, f"Hor. overflow bij {width}px: {info}"
    assert info["main"] and info["main"]["x"] >= -1 and info["main"]["right"] <= info["width"] + 2, (
        f"De oefenkaart valt buiten het scherm bij {width}px: {info}")
    print(f"OK: {width}px, geen horizontale overflow")


def complete_lesson(page, n):
    tasks = page.evaluate(f"window.GrammarLabCore.buildTasks({n})")
    assert tasks, "Geen oefenopdrachten voor les 5"
    assert len(tasks) <= 6
    for step, task in enumerate(tasks):
        assert page.locator(".gd-task").count() == 1, f"Oefenvraag {step+1} ontbreekt"
        if task["type"] == "choice":
            answer = task["example"]["nl"].strip()
            index = task["options"].index(answer)
            page.locator(f'[data-action="select"][data-value="{index}"]').click()
            page.locator('[data-action="check"]').click()
        elif task["type"] == "gap":
            index = task["options"].index(task["answer"])
            page.locator(f'[data-action="select"][data-value="{index}"]').click()
            page.locator('[data-action="check"]').click()
        elif task["type"] == "order":
            for i in range(len(task["words"])):
                page.locator(f'[data-action="tile"][data-value="{i}"]').click()
            page.locator('[data-action="check"]').click()
        else:
            page.locator('[data-action="reveal"]').click()
            page.locator('[data-action="rate"][data-value="1"]').click()
        assert page.locator(".gd-feedback.good").count() == 1, f"Feedback ontbreekt bij stap {step+1}"
        assert task["example"]["ar"].strip() in page.locator(".gd-feedback").inner_text()
        assert task["example"]["nl"].strip() in page.locator(".gd-feedback").inner_text()
        page.locator('[data-action="next"]').click()
    assert page.locator(".gd-finish").count() == 1
    assert f"{len(tasks)} van de {len(tasks)}" in page.locator(".gd-finish").inner_text()
    assert page.evaluate("localStorage.getItem('alm_grammar_test_scores_v1')") is not None
    assert page.evaluate("localStorage.getItem('alm_gram_done_v2')") is None
    print(f"OK: {len(tasks)} opdrachten les {n}, originele antwoorden en aparte opslag")


def main():
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", 0), Quiet)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    errors = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--no-sandbox"], channel=os.environ.get("PW_CHANNEL") or None)
            page = browser.new_page(
                viewport={"width": 390, "height": 844},
                device_scale_factor=1,
                is_mobile=True,
                has_touch=True
            )
            page.on("pageerror", lambda error: errors.append(str(error)))
            url = f"http://127.0.0.1:{server.server_port}/grammatica-test.html?les=5"
            page.goto(url, wait_until="domcontentloaded")
            page.wait_for_selector('[data-action="start"]', timeout=15000)
            assert page.locator("h1").inner_text().startswith("Les 5")
            assert page.locator(".gd-source-rule").count() >= 1
            page.locator('[data-action="start"]').click()
            for width in (320, 355, 375, 390, 430, 768):
                assert_layout(page, width)
            page.set_viewport_size({"width": 390, "height": 844})
            complete_lesson(page, 5)
            page.goto(f"http://127.0.0.1:{server.server_port}/grammatica-test.html?les=0")
            page.wait_for_selector(".gd-intro", timeout=10000)
            assert page.locator('[data-action="start"]').count() == 0
            assert "geen afzonderlijke" in page.locator(".gd-intro").inner_text()
            assert page.locator('a[href="index.html#/grammatica/0"]').count() > 0
            page.goto(f"http://127.0.0.1:{server.server_port}/grammatica-test.html")
            page.wait_for_selector('[data-h="tab"][data-v="lessons"]', timeout=10000)
            page.locator('[data-h="tab"][data-v="lessons"]').click()
            page.wait_for_selector(".lh-tile", timeout=10000)
            assert page.locator(".lh-tile").count() == 24
            assert not errors, "Browserfouten: " + ", ".join(errors)
            browser.close()
            print("OK: 24 leskaarten, geen verzonnen opgaven voor les 0, geen JavaScript-fouten.")
    finally:
        server.shutdown()


if __name__ == "__main__":
    main()
