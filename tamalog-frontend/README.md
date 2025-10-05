# Tamalog Frontend

## ディレクトリ構造

```
tamalog-frontend/
├── app/
│   ├── components/          # コンポーネント群
│   │   ├── PC/             # PC版メインページ
│   │   ├── Sidebar/        # サイドバー（Left/Right）
│   │   ├── Card/           # カード表示（目標/現在値）
│   │   ├── Charts/         # グラフ表示（Line/Donut）
│   │   ├── Modal/          # モーダル各種
│   │   ├── Datatable/      # データテーブル
│   │   ├── Header/         # ヘッダー
│   │   ├── Footer/         # フッター
│   │   ├── Calender/       # カレンダー
│   │   └── Tip/            # アドバイス表示
│   ├── create-post/        # データ入力ページ
│   │   ├── mobile-prifile/ # プロフィール設定
│   │   └── mobile-carender/# カレンダー入力
│   ├── mobile-page/        # モバイル版メインページ
│   ├── api/                # API Routes
│   │   └── post/          # データCRUD API
│   ├── styles/            # スタイルシート
│   ├── public/            # 静的ファイル（画像等）
│   ├── page.tsx           # ランディングページ
│   └── layout.tsx         # レイアウト
├── firebase/              # Firebase設定
│   ├── firebase.ts        # Firebase初期化
│   └── saveDataFunctions.tsx # Firestore操作関数
├── package.json
├── next.config.mjs
├── tsconfig.json
└── README.md
```


## 主な機能

### 認証機能
- Firebase Authentication
- ログイン/サインアップ
- おためしログイン（テストアカウント）

### データ管理
- **Entry（体組成データ）**: 体水分/タンパク質/ミネラル/体脂肪
- **EntryAC（目標データ）**: 目標体重/体脂肪率/筋肉量
- **EntrySports（運動記録）**: 運動種目/時間


## 技術スタック

```
Next.js 15.0.3
React 18.3.1
TypeScript 5
Firebase 11.0.1
Chart.js 4.4.4
TailwindCSS 3.4.4
React Calendar 5.1.0
Tanstack Table 8.20.5
```


## 主要コンポーネント

### PC版メインページ (`app/components/PC/page.tsx`)
- データ取得・表示の中心
- グラフ・カード・テーブル統合

### モバイル版 (`app/mobile-page/page.tsx`)
- モバイル最適化レイアウト

### データ入力 (`app/components/Modal/TextInput_UI.tsx`)
- InBody画像アップロード
- バックエンドAPIで数値抽出
- Firestore保存

### 運動記録 (`app/components/Modal/CalenderModal.tsx`)
- カレンダーから日付選択
- 運動種目・時間入力
