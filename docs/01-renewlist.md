# 修正すべきリスト

## 検査結果

- `npm run lint`: 成功
- `npx tsc --noEmit`: 成功
- `npm run build`: 成功
- 実表示確認: `390px` と `1280px` の viewport で主要ページを確認

## 優先度 高

### PC 画面の横スクロールを直す

- 対象: `tamalog-frontend/app/components/PC/page.tsx`
- 関連 CSS:
  - `tamalog-frontend/app/styles/main.module.css`
  - `tamalog-frontend/app/components/Sidebar/RightSidebar.module.css`
  - `tamalog-frontend/app/components/Sidebar/LeftSidebar.module.css`
- 現象:
  - `/components/PC` は `1280px` 幅でも `scrollWidth=1331` になり横スクロールが出る
  - `390px` 幅では `scrollWidth=654` まで広がる
- 主な原因:
  - `margin-left: 230px` と `width: 90%` の組み合わせ
  - 右サイドバーの `position: absolute` と `width: 24vw`
  - 左サイドバーの固定幅 `220px`
- 修正方針:
  - PC レイアウト全体を CSS Grid または flex で組み直す
  - `width + margin` で横幅を作らず、`grid-template-columns` で左・中央・右を管理する
  - 画面幅が狭い時は右サイドバーを下に回すか非表示にする

### 負の `z-index` を削除する

- 対象: `tamalog-frontend/app/styles/main.module.css`
- 現象:
  - `.mainbackContent` と `.mainContent` に `z-index: -10` がある
  - 描画順の崩れ、クリック不能、モーダルやチャート操作の不具合につながる
- 修正方針:
  - `z-index: -10` を削除する
  - 必要な前後関係は親コンテナの通常フローと、モーダルだけ高い `z-index` で管理する

### データ取得元を Firestore に統一する

- 対象:
  - `tamalog-frontend/app/components/PC/page.tsx`
  - `tamalog-frontend/app/mobile-page/page.tsx`
  - `tamalog-frontend/app/api/post/route.ts`
- 現象:
  - `/api/post` と Firestore の両方から `entries` を取得している
  - 先にメモリ API の空配列が入り、その後 Firestore が上書きするため状態が不安定
  - `/api/post` はサーバーメモリなので、再起動や本番環境でデータが消える
- 修正方針:
  - 日々の記録データは Firestore を正とする
  - `/api/post` は削除するか、開発用 mock として明確に分離する
  - `fetchEntries` の重複を共通 hook または helper に寄せる

### 空データ時の `NaN%` 表示を直す

- 対象:
  - `tamalog-frontend/app/components/PC/page.tsx`
  - `tamalog-frontend/app/mobile-page/page.tsx`
  - `tamalog-frontend/app/components/Charts/charts_Dounut.tsx`
- 現象:
  - 記録がない時に体脂肪率が `NaN%` になる
- 主な原因:
  - fallback の `latestEntry` に `totalWeight` がない
  - `calculateBodyFatPercentage` が `undefined` を考慮していない
- 修正方針:
  - fallback の `Entry` を型通りに全項目持たせる
  - `Number.isFinite` で不正値を `0` に丸める
  - 表示側ではデータなしなら `--%` のように出す

## 優先度 中

### モバイルの横スクロールを直す

- 対象:
  - `tamalog-frontend/app/mobile-page/page.tsx`
  - `tamalog-frontend/app/components/Header/Header2.module.css`
  - `tamalog-frontend/app/components/Footer/Footer.module.css`
  - `tamalog-frontend/app/components/Charts/charts_Dounut2.tsx`
- 現象:
  - `/mobile-page` は `390px` 幅で `scrollWidth=393` となり、わずかに横スクロールする
- 主な原因:
  - fixed header/footer の `width: 100vw`
  - body の余白と `100vw` が合わさってはみ出す
  - ドーナツ横のバーが inline style で `200px` 固定
- 修正方針:
  - header/footer は `width: 100%`、`left: 0`、`right: 0` にする
  - ドーナツとバーは CSS module 化し、狭い幅では縦積みにする
  - fixed px 幅ではなく `minmax(0, 1fr)` や `max-width: 100%` を使う

### 画面分岐をルート分割からレスポンシブ設計へ寄せる

- 対象: `tamalog-frontend/app/page.tsx`
- 現象:
  - ログイン後に `window.innerWidth` で `/mobile-page` または `/components/PC` へ遷移している
  - リサイズ、タブレット幅、ブラウザ幅変更に弱い
- 修正方針:
  - 可能ならメイン画面を 1 つに統合する
  - CSS media query で PC/mobile の配置だけ切り替える
  - どうしてもルート分割するなら、共通ロジックは hook に集約する

### Chart.js の Filler plugin 警告を直す

- 対象:
  - `tamalog-frontend/app/components/Charts/charts.tsx`
  - `tamalog-frontend/app/components/Charts/charts_Line.tsx`
- 現象:
  - `fill: true` を使っているが Filler plugin が未登録
- 修正方針:
  - `chart.js` から `Filler` を import して `ChartJS.register(...)` に追加する
  - または `fill: true` をやめる

### プロフィール保存形式を統一する

- 対象: `tamalog-frontend/firebase/saveDataFunctions.tsx`
- 現象:
  - `saveUserInfoToFirestore` は flat な user profile を保存
  - `saveEntryACToFirestore` は `entryAC` 配列に保存
  - 取得側は `data.entryAC` 前提
- 修正方針:
  - 最新プロフィールだけ必要なら `userProfiles/{uid}` に flat 保存する
  - 履歴が必要なら `userProfiles/{uid}/history/{id}` のような subcollection にする
  - 画面側の `entryAC[entryAC.length - 1]` をやめ、型を揃える

### `arrayUnion` / `arrayRemove` 依存を見直す

- 対象: `tamalog-frontend/firebase/saveDataFunctions.tsx`
- 現象:
  - `arrayRemove(entryToDelete)` はオブジェクト完全一致でないと削除できない
  - 項目追加や数値丸めで削除失敗しやすい
  - 配列全体を 1 document に持つと記録が増えた時に document サイズ制限に近づく
- 修正方針:
  - `userEntries/{uid}/entries/{entryId}` の subcollection にする
  - 追加・更新・削除は `addDoc` / `setDoc` / `deleteDoc` で ID 単位にする
  - 一覧は `orderBy('date')` で取得する

## 優先度 低

### 画像の LCP / aspect ratio 警告を直す

- 対象:
  - `tamalog-frontend/app/page.tsx`
  - `tamalog-frontend/app/mobile-page/page.tsx`
  - `tamalog-frontend/app/components/PC/page.tsx`
  - 各 `Image` 利用箇所
- 現象:
  - above the fold の画像に `priority` 推奨警告が出る
  - CSS で width または height の片方だけ変えている画像がある
- 修正方針:
  - 最初に見える主要画像だけ `priority` を付ける
  - CSS でサイズを変える場合は `width: auto` または `height: auto` を併用する

### 依存関係のバージョン不整合を直す

- 対象: `tamalog-frontend/package.json`
- 現象:
  - `next@15.0.3` に対して `eslint-config-next@14.2.4`
- 修正方針:
  - `eslint-config-next` を Next と同系統に揃える
  - 更新後に `npm install`、`npm run lint`、`npm run build` を確認する

### テストログイン情報の直書きをやめる

- 対象: `tamalog-frontend/app/page.tsx`
- 現象:
  - おためしログインのメールアドレスとパスワードがフロントコードに直書き
- 修正方針:
  - 公開前に削除する
  - 必要なら Firebase Auth の匿名ログイン、または `.env.local` 経由にする

### 未使用 state / import / 重複処理を整理する

- 対象:
  - `tamalog-frontend/app/components/PC/page.tsx`
  - `tamalog-frontend/app/mobile-page/page.tsx`
  - `tamalog-frontend/firebase/saveDataFunctions.tsx`
- 現象:
  - `isLoggedIn`、`count`、一部 import が使われていない
  - PC と mobile で同じ取得・削除・計算処理が重複している
- 修正方針:
  - 共通 hook `useEntries`、`useProfile`、`useSportsEntries` に切り出す
  - UI 差分だけコンポーネントとして分ける

### 文言と UI の細かい不備を直す

- 対象: `tamalog-frontend/app/components/Modal/TextInput_UI.tsx`
- 現象:
  - `Body Waterasasasa:` という入力ラベルが残っている
- 修正方針:
  - 表示文言を整理する
  - `alert` 中心のエラー表示を画面内メッセージや toast に置き換える

## 良い点

- TypeScript の `strict: true` で型チェックが通っている
- `npm run lint` が通っている
- `npm run build` が通っている
- CSS Modules を使っていて、画面ごとの CSS の影響範囲を追いやすい
- Firebase 操作の一部が `saveDataFunctions.tsx` にまとまっている
- PC / mobile の UI 意図が分かれているため、統合前の比較材料がある

## 推奨リファクタ順

1. PC 画面の横スクロールと `z-index: -10` を直す
2. モバイルの `100vw` と固定幅パーツを直す
3. `/api/post` をやめて Firestore 取得に統一する
4. 空データ時の `NaN%` と Chart.js 警告を直す
5. プロフィール・記録データの Firestore 構造を整理する
6. PC/mobile の重複ロジックを hook 化する
7. 画像警告、依存関係、文言、未使用コードを掃除する
