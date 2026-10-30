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
  howItWorks:{en: 'How it works', ko: '어떤 게임인가', ja: 'どんなゲームか' },
  shots:    { en: 'Screens',    ko: '화면',       ja: '画面' },
  facts:    { en: 'The details',ko: '알아둘 것',  ja: '詳細' },
};

const LANGS = ['en', 'ko', 'ja'];
const LANG_NAME = { en: 'English', ko: '한국어', ja: '日本語' };

// Chosen by the inline script in each page's head, before the first paint.
let LANG = window.EP_LANG || 'en';

function setLang(l) {
  LANG = l;
  try { localStorage.setItem('ep.lang', l); } catch (e) {}
  document.documentElement.lang = l;   // CSS swaps the hero's words from this
  const hero = document.getElementById('hero-shot');
  if (hero) hero.src = shotSrc(hero.dataset.slug, 1);
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

// The language's own screenshots where the store has them, English otherwise.
function shotSrc(slug, n) {
  const langs = SHOTS[slug].langs;
  return `assets/shots/${slug}-${langs.includes(LANG) ? LANG : langs[0]}-${n}.jpg`;
}

// Top first. Nothing below the hero starts downloading until the hero has arrived, or
// 2.5 s have gone by on a connection that is taking too long about it.
const heroArrived = new Promise((ok) => {
  const hero = document.getElementById('hero-shot');
  if (!hero || hero.complete) return ok();
  hero.addEventListener('load', ok, { once: true });
  hero.addEventListener('error', ok, { once: true });
  setTimeout(ok, 2500);
});

function wakeImages() {
  heroArrived.then(() => document.querySelectorAll('img[data-src]').forEach((img) => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  }));
}

// Everything below the first screen goes through here. width and height reserve the
// picture's room before it arrives, so nothing the reader is looking at moves; lazy
// leaves it unrequested until they scroll near it.
function shotImg(slug, n, alt) {
  const [w, h] = SHOTS[slug].dims[n - 1];
  return `<img data-src="${shotSrc(slug, n)}" width="${w}" height="${h}" alt="${alt || ''}"`
       + ` loading="lazy" decoding="async"${w > h ? ' class="wide"' : ''}>`;
}

function iconOf(app) {
  // A coloured tile with the initials sits under the icon, so a missing file never
  // renders as a broken image.
  const initials = app.name.split(' ').map((w) => w[0]).join('').slice(0, 2);
  return `<span class="icon" style="--accent:${app.accent}">
            <img data-src="assets/icons/${app.slug}.jpg" width="112" height="112" alt="" decoding="async" onerror="this.remove()">
            <b>${initials}</b>
          </span>`;
}

/* A block is a whole small landing page: a screen, a sentence, and the two
   buttons. It has to work for a reader who scrolled to it and will not scroll
   any further — which is why the buttons are in every block and not once at
   the foot of the page. */
function renderBlock(app) {
  const points = (app.points || []).slice(0, 2).map((p) => `<li>${t(p)}</li>`).join('');
  const pics = SHOTS[app.slug].block.filter((n) => SHOTS[app.slug].dims[n - 1])
    .map((n, i) => shotImg(app.slug, n, i ? '' : app.name)).join('');
  return `
    <article class="app" id="${app.slug}" style="--accent:${app.accent}">
      <div class="app-media">${pics}</div>
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

function renderCatalogue(el) {
  const featured = APPS.filter((a) => a.feature);
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
      ${iconOf(app)}
      <span><b>${app.name}</b><i>${out ? t(app.tag) : ui('soon')}</i></span>
    </a>`;
  }).join('');
}

function renderGrid(el, list) {
  el.innerHTML = (list || APPS).map((app) => `
    <a class="card" href="${app.slug}.html${REF ? '?c=' + encodeURIComponent(REF) : ''}"
       style="--accent:${app.accent}">
      ${iconOf(app)}
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
  // The screens strip: everything the game has but the picture already at the top.
  const shotsBox = document.querySelector('[data-app-shots]');
  if (shotsBox) {
    const n = SHOTS[app.slug].dims.length;
    shotsBox.innerHTML = Array.from({ length: n - 1 }, (_, i) => shotImg(app.slug, i + 2)).join('');
    shotsBox.closest('section').hidden = n < 2;
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
  wakeImages();
}

document.addEventListener('DOMContentLoaded', () => {
  render();
  // Sticky CTA appears once the hero's own buttons have scrolled away.
  const hero = document.querySelector('[data-app-stores]');
  const bar  = document.querySelector('[data-sticky]');
  if (hero && bar && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => bar.classList.toggle('show', !e.isIntersecting),
                             { rootMargin: '-8px' }).observe(hero);
  }
});
