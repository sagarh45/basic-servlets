"""Check the page links written inside online-lab.js strings.

check_links.py only reads .html files, so links that the simulator prints
(href='lifecycle.html') were never verified. This catches those.
"""
import pathlib
import re

SRC = pathlib.Path("online-lab.js")
text = SRC.read_text(encoding="utf-8")

refs = sorted(set(re.findall(r"href='([^']+)'", text)))
pages = []
missing = []
for ref in refs:
    target = ref.split("#")[0].split("?")[0]
    if not target or target.startswith("http") or not target.endswith(".html"):
        continue
    pages.append(ref)
    if not pathlib.Path(target).exists():
        missing.append(ref)

print("page links inside online-lab.js:", len(pages))
if missing:
    print("MISSING:")
    for m in missing:
        print("  ", m)
else:
    print("all targets exist")
