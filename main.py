from pathlib import Path
import webview
from backend.app_api import AppApi

def build_html():
    root = Path(__file__).resolve().parent
    base_html = (root / "frontend" / "index.html").read_text(encoding="utf-8")

    pages_dir = root / "frontend" / "pages"
    pages_html = "\n".join(
        p.read_text(encoding="utf-8") for p in sorted(pages_dir.glob("*.html"))
    )

    return base_html.replace("</body>", pages_html + "\n</body>")

if __name__ == "__main__":
    root = Path(__file__).resolve().parent

    # build HTML and write to a real file in the frontend folder
    built_path = root / "frontend" / "_built.html"
    built_path.write_text(build_html(), encoding="utf-8")

    # open as a file URL so relative paths work
    webview.create_window(
        "Kiosk",
        url=built_path.as_uri(),
        js_api=AppApi(),
        fullscreen=True,
        confirm_close=False
    )
    webview.start(debug=True, private_mode=False)
