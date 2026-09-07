/* ---------------------------------------------------------------------------
   Three jobs, and nothing else:

   1. language      — ?lang= beats a stored choice beats the browser. Same
                      order as ECHO_LANG > es.lang > handset, deliberately.
   2. store buttons — the phone in the reader's hand goes first, and the ad's
                      ?ref= is carried into the store link so it is possible to
                      tell which community actually converted.
   3. rendering     — the catalogue grid and each app hero, from data.js.

   No tracker, no cookie banner, no font that is not already in the game.
--------------------------------------------------------------------------- */

const UI = {
  games:    { en: 'Games',      ko: '게임',       ja: 'ゲーム' },
  // 'Get', not 'Get it free'. The big word on the button is the action — that
  // much was worth taking from the critique, because "App Store" answers a
  // question nobody arriving from a community post is asking. The price is not
  // the button's job: the hero says it and the details table says it, and a
  // third telling, twelve times over, stops reading as information and starts
  // reading as a pitch — on a page whose whole credibility comes from stating
  // the conditions plainly rather than selling them.
  getIt:    { en: 'Get',        ko: '받기',        ja: '入手' },
  soon:     { en: 'Not out yet', ko: '출시 준비 중', ja: 'リリース準備中' },
  appStore: { en: 'App Store',  ko: 'App Store',  ja: 'App Store' },
  play:     { en: 'Google Play',ko: 'Google Play',ja: 'Google Play' },
  free:     { en: 'Free',       ko: '무료',       ja: '無料' },
  privacy:  { en: 'Privacy',    ko: '개인정보처리방침', ja: 'プライバシー' },
  support:  { en: 'Support',    ko: '문의',       ja: 'お問い合わせ' },
  allGames: { en: 'All games',  ko: '게임 전체',  ja: 'ゲーム一覧' },
  more:     { en: 'More',       ko: '자세히',     ja: '詳しく' },
  alsoBy:   { en: 'Also by us', ko: '이 밖에',    ja: 'ほかにも' },
  whyFree:  { en: 'Why free',   ko: '왜 무료인가', ja: 'なぜ無料か' },
  whyFreeBody: {
    en: 'One person makes these. There is no purchase to sell you, so the only '
      + 'money here is a rewarded video — and it plays when you press it, never '
      + 'on its own. This page carries no tracker either; a link with ?c= '
      + 'tells us which community it came from, and nothing else.',
    ko: '혼자 만듭니다. 팔 물건이 없으니 수익은 보상형 광고 하나뿐이고, 그것도 '
      + '직접 눌러야 나옵니다. 이 페이지에는 추적기도 없습니다 — 링크에 붙은 '
      + '?c= 가 어느 커뮤니티에서 왔는지 알려줄 뿐입니다.',
    ja: 'ひとりで作っています。売るものがないので収益は報酬型広告だけで、それも'
      + '自分で押したときにだけ流れます。このページに計測タグはありません。'
      + 'リンクの ?c= がどのコミュニティ由来かを伝えるだけです。',
  },
  howItWorks:{en: 'How it works', ko: '어떤 게임인가', ja: 'どんなゲームか' },
  shots:    { en: 'Screens',    ko: '화면',       ja: '画面' },
  facts:    { en: 'The details',ko: '알아둘 것',  ja: '詳細' },
};

const LANGS = ['en', 'ko', 'ja'];
const LANG_NAME = { en: 'English', ko: '한국어', ja: '日本語' };

function pickLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(q)) return q;
  try {
    const saved = localStorage.getItem('ep.lang');
    if (LANGS.includes(saved)) return saved;
  } catch (e) { /* private mode: fall through */ }
  const nav = (navigator.language || 'en').slice(0, 2);
  return LANGS.includes(nav) ? nav : 'en';
}

let LANG = pickLang();

function setLang(l) {
  LANG = l;
  try { localStorage.setItem('ep.lang', l); } catch (e) {}
  document.documentElement.lang = l;
  render();
}

const t   = (obj) => (obj && (obj[LANG] || obj.en)) || '';
const ui  = (key) => t(UI[key]);

/* --- where the click came from ------------------------------------------ */

// `c`, the same parameter the studio's existing smart links use
// (…github.io/iz/?c=tiktok). One name across every link is what makes the
// numbers add up in one place; `ref` is still read so an older link works.
const params = new URLSearchParams(location.search);
const REF = params.get('c') || params.get('ref') || '';

function storeUrl(app, platform) {
  const raw = platform === 'ios' ? app.ios : app.android;
  if (!raw || !REF) return raw;
  const u = new URL(raw);
  if (platform === 'android') {
    // Play reads one opaque `referrer`, and the Install Referrer API hands it
    // back to the app. utm_source is what the console groups by.
    u.searchParams.set('referrer', 'utm_source=' + REF + '&utm_medium=community');
  } else {
    // App Store campaign token. `pt` (provider) is needed for it to show up in
    // App Analytics; fill it in once, it is the same number for every app.
    u.searchParams.set('ct', REF);
  }
  return u.toString();
}

/* iOS first on an iPhone, Play first on Android, alphabetical on a desktop.
   The reader should not have to find their own platform in a row of two. */
function platformOrder() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return ['ios', 'android'];
  if (/Android/.test(ua))          return ['android', 'ios'];
  return ['ios', 'android'];
}

function storeButtons(app, size) {
  const order = platformOrder();
  return order.map((p) => {
    const href = storeUrl(app, p);
    const shop = p === 'ios' ? ui('appStore') : ui('play');
    const cls = 'store ' + p + (size === 'lg' ? ' store-lg' : '') + (href ? '' : ' store-off');
    // The big word is the action, the small word is the shop. It was the other
    // way round, and a button that says "App Store" answers a question nobody
    // arriving from a community post is asking.
    if (!href) return `<span class="${cls}" aria-disabled="true">${ui('soon')}<em>${shop}</em></span>`;
    return `<a class="${cls}" href="${href}" rel="noopener">${ui('getIt')}<em>${shop}</em></a>`;
  }).join('');
}

/* --- rendering ----------------------------------------------------------- */

function iconOf(app, kind) {
  // The asset if it is there, a coloured tile with the initials if it is not —
  // so a missing file never renders as a broken image. `kind` is 'icon' for the
  // app icon and 'shot' for the first screenshot; the small entries at the foot
  // of the page use the screenshot, because a list of games with no game in it
  // is a list of names.
  const src = kind === 'shot' ? `assets/shots/${app.slug}-1.jpg`
                              : `assets/icons/${app.slug}.png`;
  const initials = app.name.split(' ').map((w) => w[0]).join('').slice(0, 2);
  return `<span class="icon" style="--accent:${app.accent}">
            <img src="${src}" alt="" loading="lazy" onerror="this.remove()">
            <b>${initials}</b>
          </span>`;
}

/* A block is a whole small landing page: a screen, a sentence, and the two
   buttons. It has to work for a reader who scrolled to it and will not scroll
   any further — which is why the buttons are in every block and not once at
   the foot of the page. */
function renderBlock(app) {
  const points = (app.points || []).slice(0, 2).map((p) => `<li>${t(p)}</li>`).join('');
  // jpg, not png: these are screenshots of rendered scenes, and the same
  // frame is 160 KB here against 700 KB as a PNG. Six blocks of that is the
  // whole page's weight, on a page somebody is paying per click to send
  // people to.
  const shot  = `assets/shots/${app.slug}-1.jpg`;
  const shot2 = `assets/shots/${app.slug}-2.jpg`;   // optional; removed if absent
  return `
    <article class="app" id="${app.slug}" style="--accent:${app.accent}">
      <div class="app-media">
        <img src="${shot}" alt="${app.name}" loading="lazy" onerror="shotMissing(this)" onload="fitShot(this)">
        <img src="${shot2}" alt="" loading="lazy" onerror="this.remove()" onload="fitShot(this)">
      </div>
      <div class="app-body">
        <div class="eyebrow">${t(app.tag)}</div>
        <h3>${app.name}</h3>
        <p>${t(app.line)}</p>
        ${points ? `<ul class="mini">${points}</ul>` : ''}
        <div class="stores">${storeButtons(app)}</div>
        <a class="more" href="${app.slug}.html${REF ? '?c=' + encodeURIComponent(REF) : ''}">${ui('more')} &rarr;</a>
      </div>
    </article>`;
}

// Named so the inline onerror above has something to call; the hiding itself
// is done by the timeout, since onerror fires before the last image has tried.
function shotsLeft() {}

// Landscape or portrait is a property of the game, not of the page: Catch
// Catch is played sideways and Echo Step is not. The frame follows the file.
function fitShot(img) {
  if (img.naturalWidth > img.naturalHeight) img.classList.add('wide');
}

function shotMissing(img) {
  const box = document.createElement('div');
  box.className = 'placeholder';
  box.textContent = img.getAttribute('src');
  img.replaceWith(box);
}

// The hero's one picture. Which game it is depends on which shot exists —
// each candidate is tried in turn and a miss moves to the next, so the slot is
// never an empty frame and never has to be edited when a screenshot lands.
function fillHeroShot(list) {
  const box = document.querySelector('[data-hero-shot]');
  if (!box) return;
  const queue = list.slice();
  const tryNext = () => {
    const app = queue.shift();
    if (!app) { box.remove(); return; }
    const img = new Image();
    img.onload = () => {
      box.innerHTML = '';
      img.alt = app.name;
      fitShot(img);
      box.classList.toggle('wide', img.classList.contains('wide'));
      box.appendChild(img);
    };
    img.onerror = tryNext;
    img.src = `assets/shots/${app.slug}-1.jpg`;
  };
  tryNext();
}

function renderCatalogue(el) {
  const featured = APPS.filter((a) => a.feature);
  fillHeroShot(featured);
  el.innerHTML = featured.map(renderBlock).join('');

  const rest = APPS.filter((a) => !a.feature);
  const restEl = document.querySelector('[data-rest]');
  if (restEl) {
    restEl.closest('section').hidden = rest.length === 0;
    renderGrid(restEl, rest);
  }

  // The summary list. It was a single wrapping row of pills once, which broke
  // 5 + 1 on a desktop and read as a leftover rather than a list; two columns
  // hold whatever six, seven or eight entries do. It carries the genre and not
  // the block's own sentence — a summary that repeats what is directly below
  // it is not a summary.
  const sum = document.querySelector('[data-summary]');
  // The genre line doubles as the release state. A reader who scrolls to the
  // fourth block, likes it and finds a dead button has been spent for nothing;
  // saying so in the list costs one word and is the honest order to say it in.
  if (sum) sum.innerHTML = featured.map((app) => {
    const out = app.ios || app.android;
    return `
    <a href="#${app.slug}" style="--accent:${app.accent}">
      ${iconOf(app, 'icon')}
      <span><b>${app.name}</b><i>${out ? t(app.tag) : ui('soon')}</i></span>
    </a>`;
  }).join('');
}

function renderGrid(el, list) {
  el.innerHTML = (list || APPS).map((app) => `
    <a class="card" href="${app.slug}.html${REF ? '?c=' + encodeURIComponent(REF) : ''}"
       style="--accent:${app.accent}">
      ${iconOf(app, 'shot')}
      <span class="card-text">
        <b>${app.name}</b>
        <i>${t(app.tag)}</i>
        <span>${t(app.line)}</span>
      </span>
    </a>`).join('');
}

function renderApp(slug) {
  const app = APPS.find((a) => a.slug === slug);
  if (!app) return;
  document.documentElement.style.setProperty('--accent', app.accent);

  // querySelectorAll, not querySelector: the store row is on the page three
  // times — hero, foot and the sticky bar — and only the first was filled.
  const set = (sel, html) => document.querySelectorAll(sel).forEach((n) => { n.innerHTML = html; });

  set('[data-app-name]', app.name);
  set('[data-app-tag]',  t(app.tag));
  set('[data-app-line]', t(app.line));
  set('[data-app-stores]', storeButtons(app, 'lg'));
  set('[data-app-stores-foot]', storeButtons(app, 'lg'));
  set('[data-app-points]', (app.points || []).map((p) => `<li>${t(p)}</li>`).join(''));

  // The details table comes from data.js as well. It was written into each
  // page's markup once, and six pages each holding their own copy of "what the
  // ads are" is six chances for one of them to still be saying last month's
  // answer — the same reason the name and the store link live in one place.
  // Two rows are true of all six and are added here rather than repeated in
  // every entry: the price, and the ad length. The second is hedged on
  // purpose — under 30 seconds is a console setting (high-engagement formats
  // only) and what actually serves is the network's call, so "always under
  // 30 s" is a promise this page cannot keep.
  const COMMON_TOP = {
    k: { en: 'Price', ko: '가격', ja: '価格' },
    v: { en: 'Free. No in-app purchases.',
         ko: '무료. 인앱 결제 없음.',
         ja: '無料。アプリ内課金なし。' },
  };
  const COMMON_END = {
    k: { en: 'Ad length', ko: '광고 길이', ja: '広告の長さ' },
    v: { en: 'Set to high-engagement formats, so what serves is normally under 30 seconds.',
         ko: '참여율 높은 유형으로 설정해 두어, 나오는 광고는 보통 30초 미만입니다.',
         ja: 'エンゲージメントの高い形式に設定しているため、通常は 30 秒未満です。' },
  };
  const rows = (app.facts && app.facts.length)
    ? [COMMON_TOP, ...app.facts, COMMON_END] : [];
  const facts = rows.map((row) =>
    `<tr><td>${t(row.k)}</td><td>${t(row.v)}</td></tr>`).join('');
  // The screens strip. Four slots, each removed if its file is not there —
  // so a game with two screenshots shows two, and a game with none loses the
  // section instead of showing four empty frames with a heading over them.
  const shotsBox = document.querySelector('[data-app-shots]');
  if (shotsBox) {
    shotsBox.innerHTML = [1, 2, 3, 4].map((i) =>
      `<img src="assets/shots/${app.slug}-s${i}.jpg" alt="" loading="lazy"
            onerror="this.remove();shotsLeft(this)">`).join('');
    // A section that ends up empty hides itself; done on the next frame,
    // after every onerror has had its say.
    setTimeout(() => { shotsBox.closest('section').hidden = !shotsBox.children.length; }, 0);
  }

  const factsBox = document.querySelector('[data-app-facts]');
  if (factsBox) {
    factsBox.innerHTML = facts;
    // A game with nothing worth tabling yet loses the section rather than
    // showing an empty frame with a heading over it.
    factsBox.closest('section').hidden = !facts;
  }

  document.querySelectorAll('[data-ui]').forEach((n) => { n.textContent = ui(n.dataset.ui); });
}

function renderChrome() {
  document.querySelectorAll('[data-ui]').forEach((n) => { n.textContent = ui(n.dataset.ui); });
  document.querySelectorAll('[data-studio-line]').forEach((n) => { n.textContent = t(STUDIO.line); });
  // The headline was English in the markup while the sentence under it was
  // translated, so switching to 한국어 half-translated the hero. It comes from
  // the same place as everything else now; \n in the string is the line break.
  document.querySelectorAll('[data-studio-head]').forEach((n) => {
    n.innerHTML = t(STUDIO.head).split('\n')
      .map((s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])))
      .join('<br>');
  });
  const sw = document.querySelector('[data-lang]');
  if (sw) sw.innerHTML = LANGS.map((l) =>
    `<button type="button" class="${l === LANG ? 'on' : ''}" onclick="setLang('${l}')">${LANG_NAME[l]}</button>`
  ).join('');
  document.querySelectorAll('[data-privacy]').forEach((n) => { n.href = STUDIO.privacy; });
  document.querySelectorAll('[data-support]').forEach((n) => { n.href = STUDIO.support; });
}

function render() {
  renderChrome();
  const cat = document.querySelector('[data-catalogue]');
  if (cat) renderCatalogue(cat);
  const grid = document.querySelector('[data-grid]');
  if (grid) renderGrid(grid);
  const page = document.body.dataset.app;
  if (page) renderApp(page);
}

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.lang = LANG;
  render();
  // Sticky CTA appears once the hero's own buttons have scrolled away.
  const hero = document.querySelector('[data-app-stores]');
  const bar  = document.querySelector('[data-sticky]');
  if (hero && bar && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => bar.classList.toggle('show', !e.isIntersecting),
                             { rootMargin: '-8px' }).observe(hero);
  }
});
