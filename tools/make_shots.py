#!/usr/bin/env python3
"""Every screenshot and icon on the site, from what the stores actually carry.

Catch Catch is not out yet, so it comes from ProjectH/store/screenshots — LISTING.md
there records that those files match App Store Connect by MD5. The others come from
Apple's public lookup, per storefront, so a page in Japanese shows the Japanese
listing rather than whatever was on disk.

Writes assets/shots/<slug>-<lang>-<n>.jpg, assets/icons/<slug>.jpg and assets/shots.js.
The sizes in shots.js are what let the page reserve each image's room before it has
loaded: the lower blocks arrive later without moving anything the reader is looking at.

    /usr/bin/python3 tools/make_shots.py      # the python that has Pillow
"""
import io, json, pathlib, re, urllib.request
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT, ICONS = ROOT / 'assets/shots', ROOT / 'assets/icons'
PROJH = ROOT.parent / 'ProjectH'
LANGS = {'ko': 'kr', 'ja': 'jp', 'en': 'us'}

# pick: store order, 1-based. Space Fighter's first two are its opening crawl —
# black at thumbnail size. block: which two stand in the game's block on the first
# page; Catch Catch's first is the hero directly above it, so it starts one later.
GAMES = {
    'catch-catch':   {'block': [2, 3]},
    'echo-step':     {'id': 6800201050},
    'prism-dash':    {'id': 6804239811},
    'skydiver':      {'id': 6800593167},
    'invader-z':     {'id': 1438003963, 'langs': ['en']},   # one set for every storefront
    'space-fighter': {'id': 6789585845, 'langs': ['en'], 'pick': [3, 4]},
}

def fetch(url):
    return urllib.request.urlopen(url, timeout=40).read()

def save(im, path):
    im = im.convert('RGB')
    box = (1200, 1200) if im.width > im.height else (840, 840)
    im.thumbnail(box, Image.LANCZOS)
    im.save(path, quality=82, optimize=True, progressive=True)
    return [im.width, im.height]

def lookup(app_id, country):
    d = json.loads(fetch(f'https://itunes.apple.com/lookup?id={app_id}&country={country}'))
    return d['results'][0]

def main():
    OUT.mkdir(parents=True, exist_ok=True); ICONS.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob('*.jpg'):
        old.unlink()
    manifest = {}
    for slug, cfg in GAMES.items():
        langs, dims = cfg.get('langs', list(LANGS)), []
        for lang in langs:
            if slug == 'catch-catch':
                sources = [Image.open(p) for p in
                           sorted((PROJH / 'store/screenshots/ios63' / lang).glob('*.png'))]
            else:
                urls = lookup(cfg['id'], LANGS[lang])['screenshotUrls']
                pick = cfg.get('pick', range(1, len(urls) + 1))
                sources = [Image.open(io.BytesIO(fetch(re.sub(r'/[^/]+$', '/1600x0w.jpg', urls[i - 1]))))
                           for i in pick]
            if slug == 'catch-catch':
                # The phone is wider than the game: the first frame has a blank band down
                # each side. As the hero those bands only make the picture smaller.
                w, h = sources[0].size
                sources[0] = sources[0].crop((int(w * .152), 0, int(w * .848), h))
            sizes = [save(im, OUT / f'{slug}-{lang}-{n}.jpg') for n, im in enumerate(sources, 1)]
            dims = dims or sizes
            assert sizes == dims, (slug, lang, 'storefronts disagree on shape', sizes, dims)
        manifest[slug] = {'langs': langs, 'block': cfg.get('block', [1, 2]), 'dims': dims}

        if slug == 'catch-catch':
            icon = Image.open(PROJH / 'CatchCatch/Resources/Assets.xcassets/AppIcon.appiconset/Icon-1024.png')
        else:
            icon = Image.open(io.BytesIO(fetch(lookup(cfg['id'], 'kr')['artworkUrl512'])))
        icon.convert('RGB').resize((112, 112), Image.LANCZOS).save(ICONS / f'{slug}.jpg', quality=85, optimize=True)
        print(slug, langs, dims)

    (ROOT / 'assets/shots.js').write_text(
        '/* Written by tools/make_shots.py. Do not edit. */\nconst SHOTS = '
        + json.dumps(manifest, separators=(',', ':')) + ';\n')

main()
