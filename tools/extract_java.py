"""Extract copy-paste Java from source/*.html into src/*.java."""
from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_HTML = ROOT / "source"
OUT = ROOT / "src"

PRE = re.compile(r'<pre\s+class="code"[^>]*>(.*?)</pre>', re.I | re.S)
TAGS = re.compile(r"<[^>]+>")
CLASS = re.compile(r"public\s+class\s+(\w+)")


def to_java(block: str) -> str:
    text = TAGS.sub("", block)
    text = html.unescape(text)
    text = text.replace("\xa0", " ")
    lines = [ln.rstrip() for ln in text.splitlines()]
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    return "\n".join(lines) + "\n"


def is_java(text: str) -> bool:
    s = text.lstrip()
    if not s:
        return False
    if s.startswith(("<?xml", "<!DOCTYPE", "<html", "<form", "<web-app", "<servlet")):
        return False
    return "public class" in s and ("import " in s or "extends " in s)


def main() -> None:
    OUT.mkdir(exist_ok=True)
    written: dict[str, Path] = {}
    html_files = sorted(SRC_HTML.glob("*.html"))
    # Dedicated source pages last so they overwrite combined dumps.
    html_files.sort(key=lambda p: (p.stem.lower() in {
        "cookie1", "url1", "forwardservlet", "capstonelogin", "httpmethodsservlet",
        "lifecycleservlet", "notesessionlogin",
    }, p.name.lower()))
    for path in html_files:
        raw = path.read_text(encoding="utf-8")
        for block in PRE.findall(raw):
            java = to_java(block)
            if not is_java(java):
                continue
            m = CLASS.search(java)
            if not m:
                continue
            name = m.group(1)
            dest = OUT / f"{name}.java"
            dest.write_text(java, encoding="utf-8", newline="\n")
            written[name] = dest
            print(f"wrote {dest.name} from {path.name}")
    print(f"total {len(written)} classes")


if __name__ == "__main__":
    main()
