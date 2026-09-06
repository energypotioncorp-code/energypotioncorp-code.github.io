#!/usr/bin/env python3
"""Build the link-preview cards — one per page, 1200x630.

The card is what a community feed shows before anybody sees the page, so it is
made of the same two things the page is made of: the game's own screenshot, and
the studio's neutral ground. Nothing here is invented — the name, the genre and
the sentence all come out of assets/data.js, so a card cannot drift from the
page it belongs to.

    python3 tools/make_og.py          # writes assets/og/*.png

Fonts come from ProjectV's Resources (Montserrat for the name, Pretendard for
the Korean sentence) — the same faces the games use.
"""
import json, pathlib, re, subprocess, textwrap
from PIL import Image, ImageDraw, ImageFont

ROOT   = pathlib.Path(__file__).resolve().parent.parent
SHOTS  = ROOT / 'assets/shots'
OUT    = ROOT / 'assets/og'
FONTS  = pathlib.Path('/Volumes/ROG-ESD-S1C/Projects/ProjectV/Resources/fonts')

BG, INK, DIM = (17, 20, 23), (240, 243, 244), (153, 162, 168)
W, H = 1200, 630

def apps():
    """Read data.js by asking node for it — one source of truth, no re-typing."""
    js = (ROOT / 'assets/data.js').read_text()
    out = subprocess.run(['node', '-e', js + '\nconsole.log(JSON.stringify({STUDIO, APPS}))'],
                         capture_output=True, text=True, check=True)
    return json.loads(out.stdout)

def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)

def wrap(draw, text, f, width):
    lines, line = [], ''
    for word in text.split():
        trial = (line + ' ' + word).strip()
        if draw.textlength(trial, font=f) <= width:
            line = trial
        else:
            lines.append(line); line = word
    if line: lines.append(line)
    return lines

def card(path, title, subtitle, shot=None, accent='#cfd6da'):
    im = Image.new('RGB', (W, H), BG)
    d  = ImageDraw.Draw(im)

    text_w = W - 96
    if shot and shot.exists():
        s = Image.open(shot).convert('RGB')
        # portrait screens stand tall on the right; a landscape one is laid in
        # the same box on its side, so both leave the text the same column.
        box_h = H - 96
        s = s.resize((int(s.width * box_h / s.height), box_h), Image.LANCZOS)
        if s.width > 520:
            s = s.crop(((s.width - 520) // 2, 0, (s.width + 520) // 2, box_h))
        im.paste(s, (W - 48 - s.width, 48))
        text_w = W - 96 - s.width - 56

    name_f = font('Montserrat-ExtraBold.ttf', 76)
    sub_f  = font('Pretendard-Regular.ttf', 30)
    tag_f  = font('Montserrat-SemiBold.ttf', 22)

    # The block is centred on the card's own height rather than pinned near the
    # top: a two-line name and a one-line name should both sit against the
    # screenshot, not float above a third of empty card.
    name_lines = wrap(d, title, name_f, text_w)
    sub_lines  = wrap(d, subtitle, sub_f, text_w)
    block = 46 + len(name_lines) * 86 + 14 + len(sub_lines) * 44
    y = (H - block) // 2 + 46

    d.text((48, y - 46), 'ENERGY POTION', font=tag_f, fill=accent)
    for line in name_lines:
        d.text((48, y), line, font=name_f, fill=INK); y += 86
    y += 14
    for line in sub_lines:
        d.text((48, y), line, font=sub_f, fill=DIM); y += 44

    OUT.mkdir(parents=True, exist_ok=True)
    im.save(path, optimize=True)
    print(path.name, path.stat().st_size // 1024, 'KB')

def main():
    data = apps()
    hero = next((a for a in data['APPS']
                 if a.get('feature') and (SHOTS / (a['slug'] + '-1.jpg')).exists()), None)
    card(OUT / 'studio.png',
         data['STUDIO']['head']['ko'].replace('\n', ' '),
         data['STUDIO']['line']['ko'],
         SHOTS / (hero['slug'] + '-1.jpg') if hero else None)
    for a in data['APPS']:
        if not a.get('feature'): continue
        card(OUT / (a['slug'] + '.png'), a['name'], a['line']['ko'],
             SHOTS / (a['slug'] + '-1.jpg'), a['accent'])

main()
