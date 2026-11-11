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
    elif kind == "zinsontleding":
        for i, tok in enumerate(task["tokens"]):
            page.locator(f'[data-action="plab"][data-value="{tok["r"]}"]').click()
            page.locator(f'[data-action="pslot"][data-value="{i}"]').click()
    else:
        raise AssertionError(f"Onbekend opdrachttype: {kind}")
    page.locator('[data-action="check"]').click()


def test_parse_drag_and_fast(page, base_url):
    page.set_viewport_size({"width": 390, "height": 844})
    page.goto(f"{base_url}?les=8", wait_until="domcontentloaded")
    page.wait_for_selector('[data-action="parse-train"]', timeout=10000)
    page.locator('[data-action="parse-train"]').click()
    tasks = page.evaluate("window.GrammarLabEngine.tasks()")
    assert len(tasks) == 10 and all(t["type"] == "zinsontleding" for t in tasks), "Verwacht 10 zinsontleding-vragen"

    chips_text = " ".join(page.locator(".gd-plab").all_inner_texts())
    for expected in ("moebtada", "khabar"):
        assert expected in chips_text, f"Fonetische term ontbreekt: {expected}"

    # Drag-and-drop via pointer events (.gd-plab -> .gd-pslot)
    first_tok = tasks[0]["tokens"][0]
    chip_box = page.locator(f'.gd-plab[data-value="{first_tok["r"]}"]').bounding_box()
    slot_box = page.locator('.gd-pslot[data-drop="0"]').bounding_box()
    cx, cy = chip_box["x"] + chip_box["width"] / 2, chip_box["y"] + chip_box["height"] / 2
    sx, sy = slot_box["x"] + slot_box["width"] / 2, slot_box["y"] + slot_box["height"] / 2
    page.mouse.move(cx, cy)
    page.mouse.down()
    page.mouse.move(sx, sy, steps=8)
    page.mouse.up()
    assert page.locator('.gd-pslot[data-drop="0"] .gd-pdrop').inner_text() != "sleep hierheen"
    assert page.locator(".gd-ptip strong").inner_text() != ""

    # Snelle modus aan + resterende woorden -> direct feedback + automatisch naar opdracht 2
    page.locator('[data-action="fast"]').click()
    assert page.evaluate("window.GrammarLabParse.fastOn()") is True
    for i, tok in enumerate(tasks[0]["tokens"]):
        if i == 0:
            continue
        page.locator(f'[data-action="plab"][data-value="{tok["r"]}"]').click()
        page.locator(f'[data-action="pslot"][data-value="{i}"]').click()
    assert page.locator(".gd-feedback.good").count() == 1, "Snelle modus moet direct nakijken"
    page.wait_for_function(
        "() => document.querySelector('.gd-stage-tag')?.textContent?.includes('Oefening 2 / 10')",
        timeout=3000,
    )
    for vw in (320, 1440):
        assert_layout(page, vw)
    print("OK: zinsontleding drag-and-drop, fonetische termen, snelle modus en 10-zinnentraining werken.")


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
            test_parse_drag_and_fast(page, base)
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
