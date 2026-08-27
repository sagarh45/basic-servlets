"""Report href/src targets that do not exist on disk.

Servlet URLs (no dot in the last segment) are skipped: those are handled by
web.xml on Tomcat and by online-lab.js on the public site.
"""
from __future__ import annotations

import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
REF = re.compile(r'(?:href|src)\s*=\s*"([^"]+)"', re.I)

bad: list[str] = []
checked = 0

for page in sorted(ROOT.rglob("*.html")):
    if "node_modules" in page.parts:
        continue
    text = page.read_text(encoding="utf-8", errors="replace")
    for raw in REF.findall(text):
        target = raw.strip()
        if not target or target.startswith(("#", "http://", "https://", "mailto:", "data:", "javascript:")):
            continue
        path_part = unquote(urlsplit(target).path)
        if not path_part:
            continue
        last = path_part.rstrip("/").split("/")[-1]
        if "." not in last:
            continue  # servlet mapping, not a file
        checked += 1
        resolved = (page.parent / path_part).resolve()
        if not resolved.exists():
            bad.append(f"{page.relative_to(ROOT)}  ->  {target}")

print(f"checked {checked} file references")
if bad:
    print(f"BROKEN ({len(bad)}):")
    for line in sorted(set(bad)):
        print("  " + line)
else:
    print("no broken file links")
