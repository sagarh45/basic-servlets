"""One-off: sample outputs that quoted the wrong web.xml parameter.

ConcatServlet joins init-param part1 with context-param "name", giving a
43-character string, and ServletContextDemo reads context-param "name" (no
city) rather than "collegeName".
"""
import pathlib

CTX_NAME = "Walchand Institute of Technology"
FIXES = [
    ("Length: 44", "Length: 43"),
    ("College name is=" + CTX_NAME + ", Solapur", "College name is=" + CTX_NAME),
]

TARGETS = [
    "concat.html",
    "servletcontext.html",
    "source/ConcatServlet.html",
    "source/ServletContextDemo.html",
]

for name in TARGETS:
    path = pathlib.Path(name)
    text = path.read_text(encoding="utf-8")
    changed = text
    for old, new in FIXES:
        changed = changed.replace(old, new)
    if changed != text:
        path.write_text(changed, encoding="utf-8")
        print("fixed", name)
    else:
        print("no change needed in", name)
