#!/usr/bin/env python3
"""Build the link-preview cards — one per page, 1200x630.

The card is what a community feed shows before anybody sees the page, so it is
made of the same two things the page is made of: the game's own screenshot, and
the studio's neutral ground. Nothing here is invented — the name, the genre and
the sentence all come out of assets/data.js, so a card cannot drift from the
page it belongs to.

    python3 tools/make_og.py          # writes assets/og/*.png

Fonts come from ProjectV's Resources (Montserrat for the name, Pretendard for
the Korean sentence) — the same faces the games use. Montserrat has no Hangul,
and ProjectV keeps Pretendard in Regular only, so a Korean name (the studio
card's headline) is set in Apple SD Gothic Neo ExtraBold: what site.css falls
back to for Hangul on Apple devices, at the hero's weight 800.
"""
import json, pathlib, re, subprocess, textwrap
from PIL import Image, ImageDraw, ImageFont

ROOT   = pathlib.Path(__file__).resolve().parent.parent
SHOTS  = ROOT / 'assets/shots'
OUT    = ROOT / 'assets/og'
FONTS  = pathlib.Path('/Volumes/ROG-ESD-S1C/Projects/ProjectV/Resources/fonts')
HANGUL = '/System/Library/Fonts/AppleSDGothicNeo.ttc'     # face 14 is ExtraBold

BG, INK, DIM = (17, 20, 23), (240, 243, 244), (153, 162, 168)
W, H = 1200, 630

def first_shot(slug):
    # CatchCatch's first is landscape and would be cropped; its second is the same
    # screen, standing up.
    if slug == 'catch-catch':
        return SHOTS / 'catch-catch-ko-2.jpg'
    return next(p for p in (SHOTS / f'{slug}-{l}-1.jpg' for l in ('ko', 'en')) if p.exists())

def apps():
    """Read data.js by asking node for it — one source of truth, no re-typing."""
    js = (ROOT / 'assets/data.js').read_text()
    out = subprocess.run(['node', '-e', js + '\nconsole.log(JSON.stringify({APPS}))'],
                         capture_output=True, text=True, check=True)
    return json.loads(out.stdout)

def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)

def has_glyphs(f, text):
    """A face draws a letter it lacks as its .notdef box — the same box it draws
    for U+FFFF, which no face maps."""
    def ink(s):
        im = Image.new('L', (2 * f.size, 2 * f.size))
        ImageDraw.Draw(im).text((0, 0), s, font=f, fill=255)
        return im.tobytes()
    box = ink('\uffff')
    return all(c.isspace() or ink(c) != box for c in set(text))

def name_font(title):
    # Checked rather than assumed: a missing letter comes out as a box, and a box
    # in a card is only seen once the card is already in somebody's feed.
    for f in (font('Montserrat-ExtraBold.ttf', 76), ImageFont.truetype(HANGUL, 76, index=14)):
        if has_glyphs(f, title): return f
    raise SystemExit(f'no face has every letter of {title!r}')

def wrap(draw, text, f, width):
    lines = []
    for part in text.split('\n'):           # a <br> in the page's copy stays a break
        line = ''
        for word in part.split():
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

    name_f = name_font(title)
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
    html = (ROOT / 'index.html').read_text()
    head, line = re.findall(r'<span data-l="ko">(.*?)</span>', html)[:2]
    # The headline keeps the page's own break. Filled to the column instead, the
    # Korean one leaves "0원." alone on its second line.
    card(OUT / 'studio.png', head.replace('<br>', '\n'), line, SHOTS / 'catch-catch-ko-2.jpg')
    for a in data['APPS']:
        if not a.get('feature'): continue
        card(OUT / (a['slug'] + '.png'), a['name'], a['line']['ko'],
             first_shot(a['slug']), a['accent'])

main()
