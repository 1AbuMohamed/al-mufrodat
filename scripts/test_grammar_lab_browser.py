"""Controleer alle nieuwe theorielessen en oefenrondes in een mobiele Chromium-browser.

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
SEED = int(0xFFFFFFFF * 0.25)


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def assert_layout(page, width: int):
    page.set_viewport_size({"width": width, "height": 844})
    page.wait_for_timeout(70)
    data = page.evaluate("""() => {
        const card = document.querySelector('.gd-card')?.getBoundingClientRect();
        return {
            width: document.documentElement.clientWidth,
            scroll: document.documentElement.scrollWidth,
            card: card && {left:card.left,right:card.right}
        };
    }""")
    assert data["scroll"] <= data["width"] + 2, f"Horizontale overflow ({width}px): {data}"
    assert data["card"] and data["card"]["left"] >= -1 and data["card"]["right"] <= data["width"] + 2, (
        f"Leskaart valt buiten beeld ({width}px): {data}"
    )
    print(f"OK: mobiel {width}px, geen overflow")


def advance_theory(page, n: int):
    count = page.evaluate(f"window.GrammarLabCore.buildTheoryCards({n}).length")
    assert count >= 1, f"Les {n} heeft geen theorieles"
    for i in range(count):
        assert page.locator("#gd-theory-title").inner_text().strip() == f"Les {n}"
        assert page.locator(".gd-theory-step").inner_text().strip(), "Lege theoretische stap"
        assert page.locator(".gd-theory-counter").inner_text().strip() == f"Stap {i+1} van {count}"
        if i < count - 1:
            page.locator('[data-action="theory-next"]').click()
    assert page.locator('[data-action="start"]').count() == 1, "Theorie eindigt niet in oefenen"
    print(f"OK: Les {n} bevat {count} volledige, opeenvolgende theoriestappen")


def answer_round(page, n: int):
    tasks = page.evaluate(f"window.GrammarLabCore.buildStudyTasks({n}, {SEED})")
    assert tasks, f"Les {n} heeft geen opdrachten"
    grammar_count = sum(task["type"] in ("theory", "parse", "why") for task in tasks)
    if len(tasks) >= 8:
        assert grammar_count >= 6, f"Te weinig grammatica bij Les {n}: {grammar_count}/{len(tasks)}"
    for i, task in enumerate(tasks):
        assert page.locator(".gd-task").count() == 1, f"Vraag {i+1} ontbreekt"
        if task["type"] in ("theory", "parse", "why", "gap", "choice"):
            correct = task["example"]["nl"].strip() if task["type"] == "choice" else task["answer"]
            index = task["options"].index(correct)
            page.locator(f'[data-action="select"][data-value="{index}"]').click()
            page.locator('[data-action="check"]').click()
        elif task["type"] == "order":
            for index in range(len(task["words"])):
                page.locator(f'[data-action="tile"][data-value="{index}"]').click()
            page.locator('[data-action="check"]').click()
        elif task["type"] == "reflect":
            page.locator('[data-action="reveal"]').click()
            page.locator('[data-action="rate"][data-value="1"]').click()
        else:
            raise AssertionError(f"Onbekend vraagtype: {task['type']}")
        assert page.locator(".gd-feedback.good").count() == 1, f"Goed-feedback ontbreekt bij {i+1}"
        if task.get("rule"):
            assert task["rule"] in page.locator(".gd-feedback").inner_text()
        if task.get("example"):
            assert task["example"]["ar"] in page.locator(".gd-feedback").inner_text()
        page.locator('[data-action="next"]').click()
    assert page.locator(".gd-finish").count() == 1
    assert f"{len(tasks)} van de {len(tasks)}" in page.locator(".gd-finish").inner_text()
    assert page.evaluate("localStorage.getItem('alm_grammar_test_scores_v1')") is not None
    assert page.evaluate("localStorage.getItem('alm_gram_done_v2')") is None
    print(f"OK: Les {n} afgerond met {len(tasks)} vragen ({grammar_count} grammatica) zonder gewijzigde brontekst")


def main():
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", 0), Quiet)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    errors = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
            page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1,
                                    is_mobile=True, has_touch=True)
            page.add_init_script("Math.random = () => 0.25")
            page.on("pageerror", lambda error: errors.append(str(error)))
            root = f"http://127.0.0.1:{server.server_port}/grammatica-test.html"
            page.goto(root + "?les=5", wait_until="domcontentloaded")
            page.wait_for_selector("#gd-theory-title", timeout=20000)
            for width in (320, 355, 375, 390, 430, 768):
                assert_layout(page, width)
            page.set_viewport_size({"width": 390, "height": 844})
            assert page.locator('script[src*="sfx.js"]').count() == 0, "Audio mag niet laden"
            advance_theory(page, 5)
            page.locator('[data-action="start"]').click()
            for width in (320, 375, 390, 430):
                assert_layout(page, width)
            page.set_viewport_size({"width": 390, "height": 844})
            answer_round(page, 5)
            page.goto(root + "?les=0")
            page.wait_for_selector("#gd-theory-title", timeout=15000)
            advance_theory(page, 0)
            assert page.evaluate("window.GrammarLabCore.getExamples(0).length") == 0
            page.goto(root)
            page.wait_for_selector('[data-h="tab"][data-v="lessons"]', timeout=12000)
            page.locator('[data-h="tab"][data-v="lessons"]').click()
            assert page.locator(".lh-tile").count() == 24
            overview = page.evaluate("""() => Array.from({length:24},(_,i) => ({
                lesson:i, steps:window.GrammarLabCore.buildTheoryCards(i).length,
                grammar:window.GrammarLabCore.buildStudyTasks(i,919).filter(x=>['theory','parse','why'].includes(x.type)).length,
                tasks:window.GrammarLabCore.buildStudyTasks(i,919).length,
                parse:window.GrammarLabCore.buildParsingTasks(i,919).length
            }))""")
            assert all(item["steps"] >= 1 for item in overview), f"Niet alle lessen hebben theorie: {overview}"
            print("Dekking: " + " | ".join(f"Les {i['lesson']}: {i['grammar']}/{i['tasks']} grammatica, {i['parse']} ontleding" for i in overview))
            assert not errors, "Browserfouten: " + ", ".join(errors)
            browser.close()
            print("OK: 24 theorielessen; geen paginafouten of ontbrekende oorspronkelijke lesdata.")
    finally:
        server.shutdown()


if __name__ == "__main__":
    main()
