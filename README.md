# たまlog

体組成管理アプリ

## プロジェクト概要

InBody画像から体組成データを自動抽出し、その情報を表示するアプリケーション



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



### Docker起動

```bash
# コンテナ停止
docker-compose down

# ビルド＆起動
docker-compose up --build
```
実行ディレクトリはここ！

### アクセス
- **フロントエンド**: http://localhost:
- **バックエンドAPI**: http://localhost:5001
