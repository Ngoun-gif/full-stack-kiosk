# kiosk_main.py
from pathlib import Path
import re
import webview
from backend.app_api import AppApi


def build_kiosk_html(root: Path) -> str:
    base_path = root / "frontend" / "index.html"
    pages_dir = root / "frontend" / "pages"

    base_html = base_path.read_text(encoding="utf-8")

    if not pages_dir.exists():
        raise FileNotFoundError(f"Missing folder: {pages_dir}")

    html_files = sorted(pages_dir.rglob("*.html"))
    templates = []
    ids = []

    for p in html_files:
        rel = p.relative_to(pages_dir).as_posix()      # e.g. menu/category.html
        tpl_id = "tpl-" + rel.replace("/", "-").replace(".html", "")
        ids.append(tpl_id)

        content = p.read_text(encoding="utf-8")
        templates.append(f'\n<template id="{tpl_id}">\n{content}\n</template>\n')

    inject = "\n".join(templates)

    m = re.search(r"</body\s*>", base_html, flags=re.IGNORECASE)
    if not m:
        raise RuntimeError("frontend/index.html must contain a closing </body> tag.")

    built_html = base_html[:m.start()] + inject + "\n" + base_html[m.start():]

    print(f"[kiosk build] found pages: {len(html_files)}")
    print(f"[kiosk build] injected templates: {len(ids)}")
    print(f"[kiosk build] sample ids: {ids[:6]}")

    return built_html


if __name__ == "__main__":
    root = Path(__file__).resolve().parent

    built_path = root / "frontend" / "_built.html"
    built_path.write_text(build_kiosk_html(root), encoding="utf-8")

    webview.create_window(
        "Kiosk",
        url=built_path.as_uri(),
        js_api=AppApi(),
        fullscreen=True,
        confirm_close=False,
        width=1080,
        height=1920,
        resizable=False,
    )
    webview.start(debug=True, private_mode=True)
