/* ---------------------------------------------------------------------------
   The catalogue, in one place.

   index.html renders the catalogue from this, and every per-app page renders
   its hero from the same entry — so a name, a link or a one-liner is written
   once.

   THE ORDER OF THIS ARRAY IS THE ORDER ON THE PAGE, and that is the one
   editorial decision this file carries: most readers of an ad look at the
   first block and maybe the second. The strongest game goes first, not the
   newest and not the oldest.

   `feature: true` puts a game in the full-width blocks. Everything else drops
   to the small row at the foot. Six blocks is about the limit before the page
   stops being read and starts being scrolled past.
   The rule is the same one LevelData.cpp lives under: two hand-maintained
   copies is one copy that goes stale.

   The store links below were verified rather than guessed, on 2026-09-06:
   every Play URL was fetched (a listing that is not there answers 404 — Catch
   Catch and Space Sweeper do), and every App Store id came from Apple's own
   lookup by bundle id. Re-check the same way after a release; a dead link on a
   page you paid to advertise is the one failure that costs money per click.
--------------------------------------------------------------------------- */

const STUDIO = {
  name: 'Energy Potion',
  // The hero. Gemini was asked for candidates and this is its fifth, kept
  // because its reasoning was the right one for where these links are going:
  // what a community reader is most suspicious of is the *condition* attached
  // to "free". Answering that before they ask is worth more than a slogan.
  //
  // Both claims were checked against the code rather than assumed, and they
  // have to be re-checked if that changes:
  //   no in-app purchases — StoreKit is imported in two projects and never
  //   used; there is no SKPaymentQueue call and no BillingClient anywhere.
  //   there ARE ads, and every one of them is rewarded — the six link the
  //   Google Mobile Ads SDK and call showRewarded() and nothing else. No
  //   GADBannerView, no unprompted interstitial, in any of the six.
  // Saying so on the page is the point. One of Gemini's other candidates
  // offered '광고 없이 무료로', which is simply false here, and false in the one
  // place a community reader will check first.
  //
  // What this replaced: 'Small games, made whole. Eight of them, on two
  // stores.' — written to fill the space. It counted eight while the page
  // shows six, and a number in the copy is a promise that has to hold on the
  // day the link is shared; 'made whole' was the studio praising itself.
  head: {
    en: 'Free to download.\nNo in-app purchases.',
    ko: '무료 다운로드.\n인앱 결제 0원.',
    ja: '無料ダウンロード。\nアプリ内課金 0 円。',
  },
  line: {
    en: 'Ads play when you ask for a hint or a continue — never on their own.',
    ko: '광고는 힌트나 이어하기가 필요할 때, 직접 누를 때만 나옵니다.',
    ja: '広告はヒントやコンティニューを自分で押したときだけ流れます。',
  },
  mail: 'humor.essence@gmail.com',
  privacy: 'https://energypotion-legal.web.app/privacy',
  support: 'https://energypotion-legal.web.app/support',
};

/* Each app:
   slug     the page filename and the ad link's last segment  → /echo-step
   accent   the app's own colour, taken from its own palette
   tag      what it is, in three or four words (shown under the name)
   line     one sentence. What the player does, not how it feels.
   points   three bullets — only on the app's own page
   facts    the spec table on the app's own page
   ios/android  store URLs. null = button renders disabled, not broken.        */

const APPS = [
  {
    // The one the page is waiting for: nothing is shared until this block's
    // buttons are live.
    slug: 'catch-catch', id: 'cc', name: 'Catch Catch', accent: '#ffd45c',
    ready: true, feature: true,
    tag:  { en: 'Spot the difference', ko: '틀린 그림 찾기', ja: '間違い探し' },
    line: {
      en: 'Two pictures, a handful of differences, and no clock breathing down your neck.',
      ko: '두 장의 그림, 그 사이에 숨은 차이. 재촉하는 시계는 없습니다.',
      ja: '2 枚の絵と、その間に隠れた違い。急かす時計はありません。',
    },
    points: [
      { en: '19 themed packs — a post office, an onsen, a night market, a space station.',
        ko: '테마 팩 19개 — 우체국, 온천, 야시장, 우주정거장.',
        ja: 'テーマパック 19 種 — 郵便局、温泉、夜市、宇宙ステーション。' },
      { en: '95 scenes, every one drawn for this game.',
        ko: '장면 95개, 전부 이 게임을 위해 그린 그림입니다.',
        ja: '95 シーン、すべてこのゲームのために描いたもの。' },
      { en: 'Pack names in Korean, English and Japanese.',
        ko: '팩 이름은 한국어·영어·일본어로.',
        ja: 'パック名は韓国語・英語・日本語で。' },
    ],
    facts: [
      { k: { en: 'Content', ko: '분량', ja: 'ボリューム' },
        v: { en: '19 packs, 95 scenes', ko: '19개 팩, 95개 장면', ja: '19 パック・95 シーン' } },
      { k: { en: 'Ads', ko: '광고', ja: '広告' },
        v: { en: 'Rewarded only, to refill hearts. You press it or you never see one.',
             ko: '하트를 채울 때만 나오는 보상형. 누르지 않으면 한 번도 보지 않습니다.',
             ja: 'ハート補充のときだけの報酬型。押さなければ一度も出ません。' } },
    ],
    android: null, ios: null,   // TODO — 출시 후 콘솔에서
  },
  {
    slug: 'echo-step', id: 'es', name: 'Echo Step', accent: '#7ad0aa',
    ready: true, feature: true,
    tag:  { en: 'Turn-based puzzle', ko: '턴제 퍼즐', ja: 'ターン制パズル' },
    line: {
      en: 'Ground that holds you once. Cross it, and bring your echo with you.',
      ko: '한 번만 버티는 발판. 그 위를 건너면서, 나를 따라오는 그림자까지 데려가야 합니다.',
      ja: '一度しか耐えない足場。渡りきり、あなたを追う影も連れていく。',
    },
    points: [
      { en: 'Every tile you leave crumbles behind you.',
        ko: '지나온 자리는 무너집니다.',
        ja: '通った足場は崩れ落ちます。' },
      { en: 'Your echo copies each move — and can be stranded where it cannot follow.',
        ko: '그림자는 내 움직임을 따라합니다. 따라올 수 없는 곳에 가둘 수도 있습니다.',
        ja: '影はあなたの動きを真似ます。追えない場所に取り残すこともできます。' },
      { en: 'All four characters walk the same 200 stages. The ability is what changes the problem.',
        ko: '네 캐릭터가 같은 200 스테이지를 걷습니다. 판이 아니라 능력이 문제를 바꿉니다.',
        ja: '4 キャラとも同じ 200 ステージ。盤ではなく能力が問題を変えます。' },
    ],
    facts: [
      { k: { en: 'Stages', ko: '스테이지', ja: 'ステージ' },
        v: { en: '200 — the same 200 for every character; the ability is what changes',
             ko: '200개 — 네 캐릭터가 같은 판을 걷고, 능력만 다릅니다',
             ja: '200 — 4 キャラとも同じ盤。違うのは能力だけ' } },
      { k: { en: 'Ads', ko: '광고', ja: '広告' },
        v: { en: 'Rewarded only, behind the hint key. No banners, nothing that interrupts.',
             ko: '힌트 키 뒤의 보상형만. 배너도, 끼어드는 광고도 없습니다.',
             ja: 'ヒントキーの後ろの報酬型のみ。バナーも割り込みもありません。' } },
      { k: { en: 'Network', ko: '인터넷', ja: 'ネット' },
        v: { en: 'Only for the leaderboard. Fully playable offline.',
             ko: '순위표에만 씁니다. 오프라인으로 끝까지 플레이할 수 있습니다.',
             ja: 'ランキングだけに使用。オフラインで最後まで遊べます。' } },
      { k: { en: 'Languages', ko: '언어', ja: '言語' },
        v: { en: 'English / 한국어 / 日本語', ko: '한국어 / English / 日本語', ja: '日本語 / English / 한국어' } },
    ],
    android: 'https://play.google.com/store/apps/details?id=me.energypotion.es',
    ios: null,   // iOS 는 심사 중 — STORE.md
  },
  {
    slug: 'prism-dash', id: 'pd', name: 'Prism Dash', accent: '#7ad8ff',
    ready: true, feature: true,
    tag:  { en: 'Area capture', ko: '영역 확보', ja: '陣取り' },
    line: {
      en: 'Cut off a piece of the field and it is yours — along with whatever was hiding under it.',
      ko: '영역을 잘라내면 그만큼 내 것이 되고, 그 아래 깔려 있던 그림이 드러납니다.',
      ja: 'エリアを切り取れば自分のもの。その下に隠れていた絵が現れます。',
    },
    points: [
      { en: 'Qix-style: draw a line across open space and close it before you are hit.',
        ko: 'Qix 계열 — 빈 공간을 가로질러 선을 긋고, 부딪히기 전에 닫습니다.',
        ja: 'Qix 系 — 空きを横切って線を引き、当たる前に閉じる。' },
      { en: 'A run gives you three continues, and each one is a video you chose to watch.',
        ko: '한 판에 이어하기 세 번, 그리고 그 세 번은 전부 직접 누른 광고입니다.',
        ja: '1 プレイにコンティニュー 3 回。どれも自分で押した広告です。' },
      { en: 'Your score and the ground you took survive a continue — that is what it buys.',
        ko: '이어하면 점수와 확보한 영역이 그대로 남습니다. 광고를 보는 이유가 그것입니다.',
        ja: 'コンティニューしてもスコアと確保した領域はそのまま。それが広告を見る理由です。' },
    ],
    facts: [
      { k: { en: 'Continues', ko: '이어하기', ja: 'コンティニュー' },
        v: { en: 'Three per run, each one a rewarded video you press yourself',
             ko: '한 판에 세 번, 매번 직접 누르는 보상형 광고',
             ja: '1 プレイ 3 回、いずれも自分で押す報酬型広告' } },
      { k: { en: 'Ads', ko: '광고', ja: '広告' },
        v: { en: 'Rewarded only. Decline and the run simply ends.',
             ko: '보상형만. 거절하면 그대로 게임이 끝날 뿐입니다.',
             ja: '報酬型のみ。断ればそのまま終わります。' } },
    ],
    android: 'https://play.google.com/store/apps/details?id=me.energypotion.pd',
    ios: null,   // iOS 는 번들 ID 조회로 안 잡힘 — 콘솔에서 확인
  },
  {
    slug: 'skydiver', id: 'sd', name: 'Skydiver', accent: '#6fb7e8',
    ready: true, feature: true,
    tag:  { en: 'Endless descent', ko: '엔들리스 낙하', ja: 'エンドレス降下' },
    line: {
      en: 'Take off, jump, and fall as far as you can down the canyon.',
      ko: '경비행기에서 뛰어내려, 협곡 아래로 갈 수 있는 데까지 떨어집니다.',
      ja: '軽飛行機から飛び降り、峡谷をどこまでも落ちていく。',
    },
    points: [
      { en: 'Hold to spread and steer, release to dive, double tap for a flare.',
        ko: '누르면 펼쳐 조종하고, 떼면 급강하하고, 두 번 두드리면 플레어를 던집니다.',
        ja: '押して滑空、離して急降下、ダブルタップでフレア。' },
      { en: 'Distance is the score. Five health pips are the clock.',
        ko: '거리가 점수입니다. 체력 다섯 칸이 시계 역할을 합니다.',
        ja: '距離がスコア。体力 5 つが時計の代わりです。' },
      { en: 'Every piece of art in it was drawn for it.',
        ko: '들어간 그림은 전부 이 게임을 위해 그린 것입니다.',
        ja: '使われている絵はすべてこのゲームのために描いたものです。' },
    ],
    facts: [
      { k: { en: 'Scoring', ko: '점수', ja: 'スコア' },
        v: { en: 'Distance fallen; five health pips instead of a timer',
             ko: '떨어진 거리. 타이머 대신 체력 다섯 칸',
             ja: '落下距離。タイマーではなく体力 5 つ' } },
      { k: { en: 'Ads', ko: '광고', ja: '広告' },
        v: { en: 'Rewarded only, and only when you ask for one.',
             ko: '보상형만, 그것도 직접 요청할 때만.',
             ja: '報酬型のみ。自分で求めたときだけ。' } },
    ],
    android: 'https://play.google.com/store/apps/details?id=me.energypotion.sd',
    ios: 'https://apps.apple.com/app/id6800593167',
  },
  {
    slug: 'invader-z', id: 'iz', name: 'Invader Z', accent: '#8ef07a',
    ready: true, feature: true,
    // Rewritten 2026-09-06 against the store listing and its screenshots. What
    // stood here was invented from class names — Balloon, Boss, FireButton —
    // and described a formation shooter. It is a bow.
    tag:  { en: 'Zombie arcade', ko: '좀비 아케이드', ja: 'ゾンビアーケード' },
    line: {
      en: 'Pick up the bow. The zombies are already walking towards the house.',
      ko: '활을 듭니다. 좀비는 이미 집 쪽으로 걸어오고 있습니다.',
      ja: '弓を取る。ゾンビはもう家に向かって歩いてきている。',
    },
    points: [
      { en: 'Aim and loose with one thumb. That is the whole control.',
        ko: '한 손으로 겨누고 쏩니다. 조작은 그것뿐입니다.',
        ja: '片手で狙って放つ。操作はそれだけ。' },
      { en: 'Some of them arrive on foot. Some arrive hanging from balloons.',
        ko: '걸어오는 놈이 있고, 풍선에 매달려 오는 놈이 있습니다.',
        ja: '歩いてくる者もいれば、風船にぶら下がって来る者もいる。' },
      { en: 'Bosses, bonus targets, and a score that goes on the board.',
        ko: '보스와 보너스 타깃, 그리고 순위표에 올라가는 점수.',
        ja: 'ボス、ボーナスターゲット、ランキングに載るスコア。' },
    ],
    facts: [
      { k: { en: 'Ads', ko: '광고', ja: '広告' },
        v: { en: 'Rewarded only, to continue a run you chose to continue.',
             ko: '이어하기를 직접 고를 때만 나오는 보상형.',
             ja: '自分でコンティニューを選んだときだけの報酬型。' } },
    ],
    android: 'https://play.google.com/store/apps/details?id=me.energypotion.iz',
    ios: 'https://apps.apple.com/app/id1438003963',
  },
  {
    slug: 'space-fighter', id: 'sf', name: 'Space Fighter', accent: '#ff9c5c',
    ready: true, feature: true,
    tag:  { en: 'Vertical shmup', ko: '종스크롤 슈팅', ja: '縦スクロールSTG' },
    line: {
      en: 'Drag to fly — the ship fires while you steer it, and stops the moment you let go.',
      ko: '끌어서 움직입니다. 손을 대고 있는 동안만 쏘고, 떼면 멈춥니다.',
      ja: 'ドラッグで移動。触れている間だけ撃ち、離せば止まります。',
    },
    points: [
      { en: 'Three weapon levels, built up from what enemies drop.',
        ko: '적이 떨어뜨린 것을 모아 무기를 3단계까지 올립니다.',
        ja: '敵が落とすものを集めて武器を 3 段階まで。' },
      { en: 'Bombs clear the screen of bullets — and the cleared bullets are score.',
        ko: '폭탄은 화면의 탄을 지우고, 지운 탄은 점수가 됩니다.',
        ja: 'ボムは画面の弾を消し、消した弾はスコアになります。' },
      { en: 'Die and the game eases off for a while. It is not trying to bleed you.',
        ko: '죽으면 잠깐 난이도가 내려갑니다. 뽑아먹으려고 만든 게임이 아닙니다.',
        ja: '死ぬとしばらく難度が下がります。搾り取るための作りではありません。' },
    ],
    facts: [
      { k: { en: 'Ads', ko: '광고', ja: '広告' },
        v: { en: 'Rewarded only — watch to continue, or to refill energy between stages.',
             ko: '보상형만 — 이어하기, 또는 스테이지 사이 에너지 충전.',
             ja: '報酬型のみ — コンティニュー、またはステージ間のエネルギー補充。' } },
    ],
    android: 'https://play.google.com/store/apps/details?id=me.energypotion.sf',
    ios: 'https://apps.apple.com/app/id6789585845',
  },
  {
    slug: 'dig-and-find', id: 'df', name: 'Dig and Find', accent: '#e0a45c',
    ready: true,
    tag:  { en: 'Turn-based puzzle', ko: '턴제 퍼즐', ja: 'ターン制パズル' },
    line: {
      en: 'Cut one continuous tunnel through the seam — without ever crossing your own workings.',
      ko: '광맥을 한 붓으로 파냅니다. 단, 내가 파놓은 길을 다시 지날 수는 없습니다.',
      ja: '鉱脈を一筆で掘り抜く。ただし自分の掘った跡を横切ってはいけません。',
    },
    points: [
      { en: 'One miner, one hundred stages.', ko: '광부 한 명, 100 스테이지.', ja: '坑夫ひとり、100 ステージ。' },
      { en: 'Every stage is generated and certified solvable before it ships.',
        ko: '모든 스테이지는 출시 전에 풀린다는 것까지 검증합니다.',
        ja: '全ステージ、出荷前に解けることを検証済み。' },
    ],
    facts: [],
    android: 'https://play.google.com/store/apps/details?id=me.energypotion.df',
    ios: null,
  },
];
