#!/usr/bin/env python3
"""Inline the css and js of one page into a single self-contained file.

Only for previewing (an Artifact, a paste into a chat, a file mailed to a
phone). The site itself ships the separate files — one stylesheet cached
across eight pages beats eight copies of it.

    python3 tools/inline.py echo-step.html /tmp/preview.html
"""
import re, sys, pathlib

src = pathlib.Path(sys.argv[1]); out = pathlib.Path(sys.argv[2])
root = src.parent
html = src.read_text()

def css(m):
    f = root / m.group(1)
    return '<style>\n' + f.read_text() + '\n</style>' if f.exists() else m.group(0)

def js(m):
    f = root / m.group(1)
    return '<script>\n' + f.read_text() + '\n</script>' if f.exists() else m.group(0)

html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css, html)
html = re.sub(r'<script src="([^"]+)"></script>', js, html)
out.write_text(html)
print(out)
