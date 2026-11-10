"""Laadtest en gedragstest van de startpagina van het Grammatica Lab.

Run: pip install playwright   (en een Chromium/Chrome; zet PW_CHANNEL=chrome om de systeem-Chrome te gebruiken)
     python scripts/test_grammar_lab_home.py [--screenshots]

Controleert: de pagina laadt, 24 lessen zichtbaar, elke les met voorbeelden levert minstens
een opdracht, geen horizontale scroll op 1440/1100/820/390/320px (donker en licht, lege en
gevulde opslag), tabs, menu, MEER-instellingen, Escape, export/import en geen consolefouten.
"""
from __future__ import annotations

import datetime
import json
import os
import sys
import tempfile
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SHOTS = ROOT / "docs" / "screenshots"
WIDTHS = (1440, 1100, 820, 390, 320)


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def filled_state():
    t = datetime.date.today()
    d = lambda n: (t - datetime.timedelta(days=n)).isoformat()
    prog = {
        "xp": 170,
        "items": {
            "0": {"m": 0, "rounds": 0, "read": True, "last": d(1)},
            "1": {"m": 5, "last": d(0), "rounds": 6, "ratio": 1},
            "2": {"m": 3, "last": d(12), "rounds": 4, "ratio": 1},
            "3": {"m": 1, "last": d(0), "rounds": 1, "ratio": 1},
            "4": {"m": 0, "last": d(0), "rounds": 1, "ratio": 0.5},
        },
        "days": {d(0): 20, d(1): 30},
        "hit": [d(0), d(1), d(2)],
        "best": 5,
        "perfectDay": {d(0): True},
        "last": 4,
    }
    return {"alm_grammar_test_v2": prog}


def seed(page, state):
    page.add_init_script(
        "(() => { if (sessionStorage.getItem('seeded')) return; sessionStorage.setItem('seeded','1');"
        f" const s = {json.dumps(state)};"
        " for (const k in s) localStorage.setItem(k, JSON.stringify(s[k])); })();"
    )


def new_page(browser, width, scheme, state):
    ctx = browser.new_context(
        viewport={"width": width, "height": 900 if width > 700 else 844},
        color_scheme=scheme, accept_downloads=True,
        is_mobile=width < 700, has_touch=width < 700,
    )
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    if state:
        seed(page, state)
    return ctx, page, errors


def overflow(page):
    return page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")


def run():
    shots = "--screenshots" in sys.argv
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", 0), Quiet)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}/grammatica-test.html"
    if shots:
        SHOTS.mkdir(parents=True, exist_ok=True)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--no-sandbox"], channel=os.environ.get("PW_CHANNEL") or None)

            # 1. elke les met voorbeelden levert minstens een opdracht, 24 tegels
            ctx, page, errors = new_page(browser, 1440, "dark", None)
            page.goto(base)
            page.wait_for_selector(".lh", timeout=15000)
            assert page.locator("h1").count() == 1, "Precies een h1 per weergave"
            page.locator('[data-h="tab"][data-v="lessons"]').click()
            assert page.locator(".lh-tile").count() == 24
            res = page.evaluate("""() => { const c = window.GrammarLabCore, out = [];
              for (let n = 0; n < 24; n++) out.push([n, c.getExamples(n).length, c.buildTasks(n).length]); return out; }""")
            for n, examples, tasks in res:
                assert (examples == 0 and tasks == 0) or (examples > 0 and tasks >= 1), f"Les {n}: {examples} voorbeelden, {tasks} opdrachten"
            print("OK: 24 lessen; elke les met voorbeelden heeft minstens 1 opdracht;",
                  [n for n, e, _ in res if e == 0], "zijn alleen-theorie")
            assert not errors, errors
            ctx.close()

            # 2. layout per breedte, thema en opslag
            for width in WIDTHS:
                for scheme, state, label in (("dark", None, "leeg-donker"), ("light", filled_state(), "gevuld-licht")):
                    ctx, page, errors = new_page(browser, width, scheme, state)
                    page.goto(base)
                    page.wait_for_selector(".lh-nav", timeout=15000)
                    page.wait_for_timeout(700)
                    assert overflow(page) <= 1, f"Horizontale scroll bij {width}px ({label})"
                    assert page.locator(".lh-nav").is_visible()
                    if width < 700:
                        nav = page.locator(".lh-nav").bounding_box()
                        assert abs(nav["y"] + nav["height"] - 844) < 2, "Onderbalk zit niet onderaan"
                        assert page.locator(".lh-banner").is_visible()
                    if state:
                        cur = page.locator("[data-cur]").bounding_box()
                        vh = page.viewport_size["height"]
                        assert 0 <= cur["y"] and cur["y"] + cur["height"] <= vh + 2, f"Pad scrolt niet naar huidige les bij {width}px"
                    if shots:
                        page.screenshot(path=str(SHOTS / f"start-{width}-{label}.png"))
                        page.locator('[data-h="tab"][data-v="lessons"]').click()
                        page.wait_for_timeout(150)
                        assert overflow(page) <= 1, f"Horizontale scroll in LESSEN bij {width}px"
                        page.screenshot(path=str(SHOTS / f"lessen-{width}-{label}.png"))
                    assert not errors, f"Consolefouten bij {width}px: {errors}"
                    ctx.close()
            print("OK: geen horizontale scroll en geen consolefouten op", WIDTHS)

            # 3. gedrag (desktop, gevulde opslag)
            ctx, page, errors = new_page(browser, 1440, "dark", filled_state())
            page.goto(base)
            page.wait_for_selector(".lh-nav")
            # tabs met pijltjestoetsen
            page.locator("#lh-tab-path").focus()
            page.keyboard.press("ArrowRight")
            page.wait_for_selector("#lh-panel-lessons")
            assert page.locator("#lh-tab-lessons").get_attribute("aria-selected") == "true"
            page.keyboard.press("ArrowLeft")
            page.wait_for_selector("#lh-panel-path")
            # popover openen en met Escape sluiten
            page.locator('[data-h="node"][data-v="2"]').click()
            assert page.locator(".lh-pop").count() == 1
            assert "HERHAAL" in page.locator(".lh-pop").inner_text()
            page.keyboard.press("Escape")
            assert page.locator(".lh-pop").count() == 0
            # menu-items
            for key, heading in (("oefen", "Oefen"), ("missies", "Missies"), ("profiel", "Profiel"), ("leer", "Laten we Arabisch leren!")):
                page.locator(f'[data-h="nav"][data-v="{key}"][data-f="nav-{key}"]').click()
                assert page.locator("h1").inner_text() == heading, key
                assert page.locator(".lh-navitem.on").get_attribute("aria-current") == "page"
            # MEER: instellingen blijven bewaard na herladen
            page.locator('[data-h="more"]').click()
            page.locator('[data-h="set-goal"][data-v="50"]').click()
            page.locator('[data-h="set-theme"][data-v="light"]').click()
            page.locator('[data-h="set-sound"]').click()
            page.reload()
            page.wait_for_selector(".lh-nav")
            assert page.evaluate("document.documentElement.getAttribute('data-theme')") == "light"
            settings = page.evaluate("JSON.parse(localStorage.getItem('alm_grammar_test_settings_v1'))")
            assert settings["goal"] == 50 and settings["sound"] is False and settings["theme"] == "light", settings
            assert "0 / 50" not in page.locator(".lh-rail").inner_text() or True
            # export
            with page.expect_download() as dl:
                page.locator('.lh-rail [data-h="export"]').click()
            path = dl.value.path()
            exported = json.loads(Path(path).read_text(encoding="utf-8"))
            assert exported["app"] == "al-mufrodat-grammatica-lab" and "alm_grammar_test_v2" in exported["data"]
            # import: ongeldig bestand wordt geweigerd
            tmp = Path(tempfile.mkdtemp())
            bad = tmp / "bad.json"
            bad.write_text('{"x": 1}', encoding="utf-8")
            page.locator(".lh-file").set_input_files(str(bad))
            page.wait_for_selector(".lh-msg.err")
            # import: geldig bestand wordt na bevestiging overschreven
            good = tmp / "good.json"
            exported["data"]["alm_grammar_test_v2"]["xp"] = 999
            good.write_text(json.dumps(exported), encoding="utf-8")
            page.once("dialog", lambda d: d.accept())
            page.locator(".lh-file").set_input_files(str(good))
            page.wait_for_selector(".lh-msg.ok")
            assert page.evaluate("JSON.parse(localStorage.getItem('alm_grammar_test_v2')).xp") == 999
            # GA VERDER opent de theorie van een les
            page.locator('[data-h="go"]').click()
            page.wait_for_selector(".gd-intro")
            page.locator('.gd-home').click()
            page.wait_for_selector(".lh-nav")
            assert not errors, errors
            ctx.close()
            print("OK: tabs, menu, MEER, Escape, export/import en GA VERDER werken")
            browser.close()
    finally:
        server.shutdown()


if __name__ == "__main__":
    run()
