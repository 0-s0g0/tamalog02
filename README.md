# たまlog

体組成データ管理・可視化アプリケーション

## プロジェクト概要

InBody画像から体組成データを自動抽出し、Firebase上で管理・可視化するWebアプリケーション。

### 主な機能
- 📸 InBody画像からの数値自動抽出（画像処理）
- 📊 体組成データの可視化（グラフ・チャート）
- 🎯 目標管理と達成度表示
- 📅 運動記録のカレンダー管理
- 📱 レスポンシブデザイン（PC/モバイル対応）

## プロジェクト構成

```
tamalog2/
├── tamalog-frontend/        # Next.js フロントエンド
│   ├── app/                # ページ・コンポーネント
│   ├── firebase/           # Firebase設定
│   └── README.md          # フロントエンド詳細
├── tamalog-backend/        # Flask バックエンド（画像処理API）
│   ├── src/               # 画像処理モジュール
│   ├── temp/              # テンプレート画像
│   └── README.md          # バックエンド詳細
├── docker-compose.yml     # Docker設定
└── README.md             # このファイル
```

## 技術スタック

### フロントエンド
- **Framework**: Next.js 15.0.3 (React 18.3.1)
- **Language**: TypeScript 5
- **Database**: Firebase (Firestore, Authentication)
- **UI**: TailwindCSS, Chart.js
- **主要ライブラリ**: React Calendar, Tanstack Table

### バックエンド
- **Framework**: Flask
- **Language**: Python
- **画像処理**: OpenCV
- **処理方式**: テンプレートマッチング + 古典的画像処理

## セットアップ

### 前提条件
- Docker & Docker Compose
- Node.js 18+ (ローカル開発時)
- Python 3.9+ (ローカル開発時)

### 環境変数設定

#### フロントエンド (`.env.local`)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Docker起動

```bash
# コンテナ停止
docker-compose down

# ビルド＆起動
docker-compose up --build
```

### アクセス
- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:5001

## ローカル開発（Docker不使用）

### フロントエンド
```bash
cd tamalog-frontend
npm install
npm run dev
```

### バックエンド
```bash
cd tamalog-backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python upload.py
```

## 主な処理フロー

```
1. ユーザーがInBody画像をアップロード
   ↓
2. バックエンド（Flask）で画像処理
   - 射影変換で歪み補正
   - テンプレートマッチングで数値抽出
   ↓
3. フロントエンドで結果受信
   ↓
4. Firestoreに保存
   ↓
5. グラフ・チャートで可視化
```

## データ構造

### Entry（体組成データ）
```typescript
{
  id: string;
  date: string;
  bodyWater: string;    // 体水分量
  protein: string;      // タンパク質
  minerals: string;     // ミネラル
  bodyFat: string;      // 体脂肪
  totalWeight: number;  // 総体重
  totalMuscle: number;  // 筋肉量
}
```

### EntryAC（目標データ）
```typescript
{
  goalWeight: string;
  goalFat: string;
  goalMuscle: string;
}
```

### EntrySports（運動記録）
```typescript
{
  date: string;
  sportsType: string;
  duration: number;
}
```

## API仕様

### バックエンドAPI
- **POST /backend/upload**: InBody画像アップロード → 数値配列返却

### フロントエンドAPI Routes
- **GET /api/post**: 全データ取得
- **POST /api/post**: 新規作成
- **PUT /api/post**: 更新
- **DELETE /api/post**: 削除

## デプロイ

### Vercel（フロントエンド）
```bash
cd tamalog-frontend
vercel --prod
```

### Railway/Render（バックエンド）
- Dockerfileベースでデプロイ
- ポート: 5001

## トラブルシューティング

### 初回アクセス時にNaN表示される
→ データ取得完了前のレンダリング。リロードで解決（修正済み: ローディング状態追加）

### 画像認識精度が低い
→ `tamalog-backend/README.md` のパラメータ調整セクション参照

### Firebase接続エラー
→ `.env.local` の環境変数を確認

## 開発メンバー
- フロントエンド: Next.js + Firebase
- バックエンド: Flask + OpenCV

## ライセンス
Private2025年 10月 6日 月曜日 00時14分19秒 JST
