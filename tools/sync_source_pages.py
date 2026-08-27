"""Rewrite the Java block on every source/*.html from the real src/*.java.

src/*.java is the truth: it is what compile.bat compiles and what Tomcat runs.
The Source page a student copies from must therefore be generated from it, not
maintained by hand, or the two drift apart.

Run from the project root:  python tools/sync_source_pages.py
"""
from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
PAGES = ROOT / "source"

KEYWORDS = {
    "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
    "class", "const", "continue", "default", "do", "double", "else", "enum",
    "extends", "false", "final", "finally", "float", "for", "goto", "if",
    "implements", "import", "instanceof", "int", "interface", "long", "native",
    "new", "null", "package", "private", "protected", "public", "record",
    "return", "short", "static", "strictfp", "super", "switch", "synchronized",
    "this", "throw", "throws", "transient", "true", "try", "void", "volatile",
    "while",
}

TOKEN = re.compile(
    r"""
    (?P<block>/\*.*?\*/)
  | (?P<line>//[^\n]*)
  | (?P<str>"(?:\\.|[^"\\])*")
  | (?P<chr>'(?:\\.|[^'\\])*')
  | (?P<ann>@[A-Za-z_]\w*)
  | (?P<num>\b\d[\w.]*\b)
  | (?P<word>\b[A-Za-z_]\w*\b)
    """,
    re.S | re.X,
)


def highlight(java: str) -> str:
    out: list[str] = []
    pos = 0
    for m in TOKEN.finditer(java):
        out.append(html.escape(java[pos:m.start()], quote=True))
        pos = m.end()
        text = m.group(0)
        safe = html.escape(text, quote=True)
        kind = m.lastgroup
        if kind in ("block", "line"):
            out.append(f'<span class="cmt">{safe}</span>')
        elif kind in ("str", "chr"):
            out.append(f'<span class="str">{safe}</span>')
        elif kind == "ann":
            out.append(f'<span class="ann">{safe}</span>')
        elif kind == "num":
            out.append(f'<span class="num">{safe}</span>')
        elif text in KEYWORDS:
            out.append(f'<span class="kw">{safe}</span>')
        elif text[0].isupper():
            out.append(f'<span class="cls">{safe}</span>')
        elif java[m.end():m.end() + 1] == "(":
            out.append(f'<span class="mtd">{safe}</span>')
        else:
            out.append(safe)
    out.append(html.escape(java[pos:], quote=True))
    return "".join(out).replace("'", "&#x27;")


PRE = re.compile(r'<pre class="code">(.*?)</pre>', re.S)


def main() -> None:
    synced: list[str] = []
    skipped: list[str] = []
    for page in sorted(PAGES.glob("*.html")):
        name = page.stem
        text = page.read_text(encoding="utf-8")
        original = text

        java_file = SRC / f"{name}.java"
        if java_file.exists():
            java = java_file.read_text(encoding="utf-8").rstrip("\n")
            marker = re.compile(rf"\bclass\s+{re.escape(name)}\b")
            done = False

            def swap(m: re.Match[str]) -> str:
                nonlocal done
                body = html.unescape(re.sub(r"<[^>]+>", "", m.group(1)))
                if done or not marker.search(body):
                    return m.group(0)
                done = True
                return f'<pre class="code">{highlight(java)}\n</pre>'

            text = PRE.sub(swap, text)
            if done:
                synced.append(name)
            else:
                skipped.append(f"{name} (no matching <pre> block)")

        if text != original:
            page.write_text(text, encoding="utf-8", newline="\n")

    print(f"synced Java on {len(synced)} source pages")
    for name in synced:
        print("  " + name)
    if skipped:
        print("NOT synced:")
        for name in skipped:
            print("  " + name)


if __name__ == "__main__":
    main()
