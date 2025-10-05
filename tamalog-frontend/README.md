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

## セットアップ

```bash
# 依存パッケージインストール
npm install

# 環境変数設定
cp .env.local.example .env.local
# Firebase設定を .env.local に記述

# 開発サーバー起動
npm run dev
```

**いまはdockerいれてるよ！**

## 環境変数

`.env.local` に以下を設定:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:5001
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

### 可視化
- ドーナツグラフ（体組成バランス）
- 折れ線グラフ（推移）
- データテーブル（履歴一覧）
- カレンダー（運動記録）

### レスポンシブ対応
- デスクトップ: 768px以上
- モバイル: 768px未満

## API仕様

### **GET /api/post**
全データ取得

**レスポンス:**
```json
[
  {
    "id": "1",
    "date": "2025-10-05",
    "bodyWater": "5.2",
    "protein": "3.8",
    "minerals": "4.1",
    "bodyFat": "6.7",
    "totalWeight": 60.5,
    "totalMuscle": 45.2
  }
]
```

### **POST /api/post**
新規データ作成

### **PUT /api/post**
データ更新

### **DELETE /api/post**
データ削除

## Firebase構造

### Collections

#### `userProfiles/{userId}`
```typescript
{
  nickname: string;
  icon: string;
  height: string;
  sex: string;
  goalWeight: string;
  goalFat: string;
  goalMuscle: string;
  entryAC: EntryAC[];
}
```

#### `userEntries/{userId}`
```typescript
{
  entries: Entry[];
}
```

#### `userSports/{userId}`
```typescript
{
  entrySports: EntrySports[];
}
```

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

## スクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクション起動
npm run start

# Lint実行
npm run lint
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
