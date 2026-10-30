/* ---------------------------------------------------------------------------
   The catalogue, in one place.

   index.html renders the catalogue from this, and every per-app page renders
   its hero from the same entry — so a name, a link or a one-liner is written
   once.

   THE ORDER OF THIS ARRAY IS THE ORDER ON THE PAGE, and that is the one
   editorial decision this file carries: most readers of an ad look at the
   first block and maybe the second. The strongest game goes first, not the
   newest and not the oldest.

   `feature: true` puts a game in the full-width blocks. Six is about the limit
   before the page stops being read and starts being scrolled past.
   The rule is the same one LevelData.cpp lives under: two hand-maintained
   copies is one copy that goes stale.

   Store links are verified, not guessed: a Play listing that is not there answers
   404, and App Store ids come from Apple's lookup. Re-check after a release (last
   2026-10-30); a dead link on a page you paid to advertise costs money per click.

   What a game says about itself comes from its store listing and its own code.
   Three sentences written here from memory turned out to be false — no clock in
   Catch Catch, a formation shooter in Invader Z, fire-while-held in Space Fighter.
--------------------------------------------------------------------------- */

const STUDIO = {
  name: 'Energy Potion',
  // The hero's own sentences are not here: they live in index.html, so the top of
  // the page can paint from the first response without waiting for this file.
  mail: 'humor.essence@gmail.com',
  privacy: 'https://energypotion-legal.web.app/privacy',
  support: 'https://energypotion-legal.web.app/support',
};

const APPS = [
  {
    // The one the page is waiting for: nothing is shared until this is live.
    // App Store Connect id 6804225701, so ios becomes
    // 'https://apps.apple.com/app/id6804225701' the day it is approved.
    // Play has nothing uploaded yet.
    slug: 'catch-catch', id: 'cc', name: 'Catch Catch', accent: '#ffd45c',
    ready: true, feature: true,
    tag:  { en: 'Spot the difference', ko: '틀린 그림 찾기', ja: '間違い探し' },
    line: {
      en: 'The two pictures should be the same. Look again: there is a bear in the bush.',
      ko: '분명 똑같은 그림이었는데, 다시 보니 덤불 뒤에 곰이 숨어 있습니다.',
      ja: '同じ絵のはずが、よく見るとしげみの陰にクマがいます。',
    },
    points: [
      { en: '25 theme packs, 125 pictures, five differences in each. Find them before time runs out.',
        ko: '테마 팩 25개, 그림 125장, 그림마다 차이 5개. 시간이 끝나기 전에 찾으세요.',
        ja: 'テーマパック25種、絵125枚、1枚に違いが5つ。時間切れの前に見つけましょう。' },
      { en: 'Stuck? The pencil finds one, the magnifier marks two, the clock adds ten seconds.',
        ko: '막히면 연필이 하나를 찾아 주고, 돋보기가 둘을 표시하고, 시계가 10초를 더해 줍니다.',
        ja: '困ったら、えんぴつが1つ見つけ、虫めがねが2つ示し、時計が10秒足してくれます。' },
      { en: 'No account, no login. Open it and start, then try for this month\'s leaderboard.',
        ko: '가입도 로그인도 없습니다. 켜면 바로 시작하고, 이번 달 랭킹에 이름을 올려 보세요.',
        ja: '登録もログインも不要。開いてすぐ始められ、今月のランキングも狙えます。' },
    ],
    facts: [
      { k: { en: 'Content', ko: '분량', ja: 'ボリューム' },
        v: { en: '25 packs, 125 pictures', ko: '25개 팩, 그림 125장', ja: '25パック・絵125枚' } },
      { k: { en: 'A round', ko: '한 판', ja: '1プレイ' },
        v: { en: 'Up to five pictures on one timer of 60 seconds at most',
             ko: '그림 최대 5장, 타이머 하나로 최대 60초',
             ja: '絵は最大5枚、タイマーは共通で最大60秒' } },
      { k: { en: 'Hearts', ko: '하트', ja: 'ハート' },
        v: { en: 'One per round. You start with three, and they refill every eight hours.',
             ko: '한 판에 하나. 세 개로 시작하고 8시간마다 다시 찹니다.',
             ja: '1プレイに1つ。3つから始まり、8時間ごとに補充されます。' } },
      { k: { en: 'Ads', ko: '광고', ja: '広告' },
        v: { en: 'Rewarded only, for an extra heart or item. It asks first, and no is fine.',
             ko: '하트나 아이템을 더 받을 때만 나오는 보상형. 먼저 물어보고, 거절해도 됩니다.',
             ja: 'ハートやアイテムを追加でもらうときだけの報酬型。先に確認があり、断れます。' } },
      { k: { en: 'Network', ko: '인터넷', ja: 'ネット' },
        v: { en: 'For the leaderboard and ads. The puzzles work without it.',
             ko: '랭킹과 광고에만 필요합니다. 퍼즐은 없어도 됩니다.',
             ja: 'ランキングと広告にだけ必要です。パズルはなくても遊べます。' } },
      { k: { en: 'Languages', ko: '언어', ja: '言語' },
        v: { en: 'English / 한국어 / 日本語', ko: '한국어 / English / 日本語', ja: '日本語 / English / 한국어' } },
    ],
    android: null, ios: null,
  },
  {
    slug: 'echo-step', id: 'es', name: 'Echo Step', accent: '#7ad0aa',
    ready: true, feature: true,
    tag:  { en: 'Turn-based puzzle', ko: '턴제 퍼즐', ja: 'ターン制パズル' },
    line: {
      en: 'A path you cannot turn back on. Find the exit with an echo that copies your every move.',
      ko: '뒤돌아설 수 없는 길. 나를 흉내 내는 에코와 함께 출구를 찾으세요.',
      ja: '引き返せない道。あなたをまねる「エコー」と一緒に出口を探します。',
    },
    points: [
      { en: 'White falls the moment you leave it, gold holds, and leaving one red takes the whole seam.',
        ko: '화이트는 지나치면 무너지고, 골드는 안전하고, 레드는 하나를 떠나면 전부 무너집니다.',
        ja: '白は離れた瞬間に崩れ、金は安全で、赤は1つ離れると全部崩れます。' },
      { en: 'The echo wears the path away with you. Trap it, or use it.',
        ko: '에코는 함께 움직이며 길을 지웁니다. 가둘 수도, 이용할 수도 있습니다.',
        ja: 'エコーも一緒に動いて道を消します。閉じ込めることも、利用することもできます。' },
      { en: 'All four characters walk the same 200 stages. The ability is what changes the problem.',
        ko: '네 캐릭터가 같은 200 스테이지를 걷습니다. 판이 아니라 능력이 문제를 바꿉니다.',
        ja: '4キャラとも同じ200ステージ。盤ではなく能力が問題を変えます。' },
    ],
    facts: [
      { k: { en: 'Stages', ko: '스테이지', ja: 'ステージ' },
        v: { en: '200, every one with a verified solution',
             ko: '200개, 전부 풀이를 검증했습니다',
             ja: '200、すべて解けることを検証済み' } },
      { k: { en: 'Ads', ko: '광고', ja: '広告' },
        v: { en: 'Rewarded only, for more hints, abilities or retries once the free ones are used. No banners.',
             ko: '무료분을 다 쓴 힌트·능력·재도전을 더 쓸 때만 나오는 보상형. 배너는 없습니다.',
             ja: '無料分を使い切ったヒント・能力・リトライを追加するときだけの報酬型。バナーはありません。' } },
      { k: { en: 'Network', ko: '인터넷', ja: 'ネット' },
        v: { en: 'For the leaderboard and ads. Fully playable offline.',
             ko: '랭킹과 광고에만 씁니다. 오프라인으로 끝까지 플레이할 수 있습니다.',
             ja: 'ランキングと広告にだけ使用。オフラインで最後まで遊べます。' } },
      { k: { en: 'Languages', ko: '언어', ja: '言語' },
        v: { en: 'English / 한국어 / 日本語', ko: '한국어 / English / 日本語', ja: '日本語 / English / 한국어' } },
    ],
    android: 'https://play.google.com/store/apps/details?id=me.energypotion.es',
    ios: 'https://apps.apple.com/app/id6800201050',
  },
  {
    slug: 'prism-dash', id: 'pd', name: 'Prism Dash', accent: '#7ad8ff',
    ready: true, feature: true,
    tag:  { en: 'Area capture', ko: '영역 확보', ja: '陣取り' },
    line: {
      en: 'A gallery sunk in darkness. Draw a line, cut the dark away, and the painting underneath is yours.',
      ko: '어둠에 잠긴 미술관. 선을 그어 어둠을 잘라내면 덮여 있던 명화가 드러납니다.',
      ja: '闇に沈んだ美術館。線を引いて闇を切り取ると、隠れていた名画が現れます。',
    },
    points: [
      { en: 'Wall off an area the monster cannot reach and the ground is yours.',
        ko: '괴물이 닿지 않는 영역을 격리하면 내 땅이 됩니다.',
        ja: 'モンスターの届かない領域を囲めば、自分の陣地になります。' },
      { en: 'You are defenceless while you draw. If the monster touches the line, you die.',
        ko: '선을 긋는 동안은 무방비입니다. 괴물이 선에 닿으면 죽습니다.',
        ja: '線を引いている間は無防備です。モンスターが線に触れるとやられます。' },
      { en: '48 public-domain masterpieces, and six bosses that speed up with every loop.',
        ko: '퍼블릭 도메인 명화 48점, 그리고 루프마다 빨라지는 보스 6종.',
        ja: 'パブリックドメインの名画48点と、周回ごとに速くなるボス6種。' },
    ],
    facts: [
      { k: { en: 'Content', ko: '분량', ja: 'ボリューム' },
        v: { en: '48 paintings, six bosses', ko: '명화 48점, 보스 6종', ja: '名画48点、ボス6種' } },
      { k: { en: 'Ads', ko: '광고', ja: '広告' },
        v: { en: 'Two rewarded ones, both optional: continue after game over, and re-spin the bonus.',
             ko: '원할 때만 보는 보상형 두 가지: 게임 오버 후 이어하기와 보너스 다시 돌리기.',
             ja: '見たいときだけの報酬型2種: ゲームオーバー後のコンティニューとボーナスの回し直し。' } },
      { k: { en: 'Languages', ko: '언어', ja: '言語' },
        v: { en: 'English / 한국어 / 日本語', ko: '한국어 / English / 日本語', ja: '日本語 / English / 한국어' } },
    ],
    android: 'https://play.google.com/store/apps/details?id=me.energypotion.pd',
    ios: 'https://apps.apple.com/app/id6804239811',
  },
  {
    slug: 'skydiver', id: 'sd', name: 'Skydiver', accent: '#6fb7e8',
    ready: true, feature: true,
    tag:  { en: 'Endless descent', ko: '엔들리스 낙하', ja: 'エンドレス降下' },
    line: {
      en: 'Take off, jump, and fall as far as you can down the canyon.',
      ko: '경비행기에서 뛰어내려, 협곡 아래로 갈 수 있는 데까지 떨어집니다.',
      ja: '軽飛行機から飛び降り、峡谷をどこまでも落ちていきます。',
    },
    points: [
      { en: 'Hold to spread and steer, release to fold up and dive, double tap for a flare.',
        ko: '누르면 팔을 펼쳐 조종하고, 떼면 몸을 접어 내리꽂고, 두 번 누르면 조명탄을 던집니다.',
        ja: '押して腕を広げて操作、離して急降下、ダブルタップで照明弾。' },
      { en: 'Distance is the score. Five health pips are the clock.',
        ko: '거리가 점수입니다. 체력 다섯 칸이 시계 역할을 합니다.',
        ja: '距離がスコア。体力5つが時計の代わりです。' },
      { en: 'Portrait, one hand. No account, no sign-up.',
        ko: '세로 화면, 한 손 조종. 계정도 가입도 없습니다.',
        ja: '縦画面、片手で操作。アカウントも登録も不要です。' },
    ],
    facts: [
      { k: { en: 'Scoring', ko: '점수', ja: 'スコア' },
        v: { en: 'Distance fallen; five health pips instead of a timer',
             ko: '떨어진 거리. 타이머 대신 체력 다섯 칸',
             ja: '落下距離。タイマーではなく体力5つ' } },
      { k: { en: 'Ads', ko: '광고', ja: '広告' },
        v: { en: 'Rewarded only. Jumps refill with time, and an ad tops them up if you do not want to wait.',
             ko: '보상형만. 점프는 시간이 지나면 다시 차고, 기다리기 싫으면 광고로 채울 수 있습니다.',
             ja: '報酬型のみ。ジャンプは時間で回復し、待ちたくなければ広告で補充できます。' } },
      { k: { en: 'Languages', ko: '언어', ja: '言語' },
        v: { en: 'English / 한국어 / 日本語', ko: '한국어 / English / 日本語', ja: '日本語 / English / 한국어' } },
    ],
    android: 'https://play.google.com/store/apps/details?id=me.energypotion.sd',
    ios: 'https://apps.apple.com/app/id6800593167',
  },
  {
    slug: 'invader-z', id: 'iz', name: 'Invader Z', accent: '#8ef07a',
    ready: true, feature: true,
    tag:  { en: 'Zombie arcade', ko: '좀비 아케이드', ja: 'ゾンビアーケード' },
    line: {
      en: 'Pick up the bow. The zombies are already coming for the house.',
      ko: '활을 듭니다. 좀비들이 이미 집으로 몰려오고 있습니다.',
      ja: '弓を取る。ゾンビはもう家に向かって押し寄せています。',
    },
    points: [
      { en: 'Some come on foot. Some drift in hanging from balloons.',
        ko: '걸어오는 놈이 있고, 풍선에 매달려 오는 놈이 있습니다.',
        ja: '歩いてくる者もいれば、風船にぶら下がって来る者もいます。' },
      { en: 'Then the bosses arrive, and they are a good deal bigger.',
        ko: '그러다 훨씬 커다란 보스가 나타납니다.',
        ja: 'やがて、ずっと大きなボスが現れます。' },
      { en: 'Your score goes on the ranking.',
        ko: '점수는 랭킹에 올라갑니다.',
        ja: 'スコアはランキングに載ります。' },
    ],
    facts: [
      { k: { en: 'Ads', ko: '광고', ja: '広告' },
        v: { en: 'Rewarded only, to continue a run. It asks first, and no is fine.',
             ko: '이어하기를 할 때만 나오는 보상형. 먼저 물어보고, 거절해도 됩니다.',
             ja: 'コンティニューのときだけの報酬型。先に確認があり、断れます。' } },
      { k: { en: 'Languages', ko: '언어', ja: '言語' },
        v: { en: 'English / 한국어 / 日本語', ko: '한국어 / English / 日本語', ja: '日本語 / English / 한국어' } },
    ],
    android: 'https://play.google.com/store/apps/details?id=me.energypotion.iz',
    ios: 'https://apps.apple.com/app/id1438003963',
  },
  {
    slug: 'space-fighter', id: 'sf', name: 'Space Fighter', accent: '#ff9c5c',
    ready: true, feature: true,
    tag:  { en: 'Vertical shmup', ko: '종스크롤 슈팅', ja: '縦スクロールSTG' },
    line: {
      en: 'The last fighter left, against an alien fleet that keeps on coming.',
      ko: '홀로 남은 전투기로, 끝없이 밀려오는 외계 침략군에 맞섭니다.',
      ja: 'ただ一機残った戦闘機で、押し寄せる異星の侵略軍に立ち向かいます。',
    },
    points: [
      { en: 'One hand: drag to move, lift to fire the beam, double tap for a bomb.',
        ko: '한 손 조작. 끌어서 움직이고, 손을 떼면 빔을 쏘고, 두 번 누르면 폭탄을 떨어뜨립니다.',
        ja: '片手で操作。ドラッグで移動、指を離すとビーム、ダブルタップでボム。' },
      { en: 'Power-ups turn a single shot into a multi-way spread.',
        ko: '무기 파워업을 모으면 단발이 다방향 확산탄으로 바뀝니다.',
        ja: 'パワーアップを集めると、単発が多方向の拡散弾に変わります。' },
      { en: 'A boss at the end of every stage, and a high score to chase.',
        ko: '스테이지 끝마다 보스전이 있고, 높은 점수에 도전할 수 있습니다.',
        ja: 'ステージの最後には必ずボス戦。ハイスコアにも挑めます。' },
    ],
    facts: [
      { k: { en: 'Ads', ko: '광고', ja: '広告' },
        // Said plainly because it is the one ad in the catalogue nobody presses
        // to start. See the hero's line in index.html, written around this.
        v: { en: 'Rewarded only: a continue after you die, and a refill at stage clear. The refill plays by itself after a five-second countdown; NO THANKS stays on screen the whole time.',
             ko: '보상형만: 죽은 뒤 이어하기, 스테이지 클리어 때 충전. 충전 광고는 5초 카운트다운 뒤 자동으로 재생되며, 그동안 NO THANKS로 거절할 수 있습니다.',
             ja: '報酬型のみ: 死亡後のコンティニューと、ステージクリア時の補充。補充の広告は5秒のカウントダウン後に自動で流れ、その間ずっと NO THANKS で断れます。' } },
      { k: { en: 'Languages', ko: '언어', ja: '言語' },
        v: { en: 'English (per the store listing)', ko: 'English (스토어 표기 기준)', ja: 'English（ストア表記）' } },
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
