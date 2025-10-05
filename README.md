# たまlog

体組成管理アプリ
<img width="100" alt="logo2" src="https://github.com/user-attachments/assets/25e65ee7-be0a-41fb-a02c-5b4d632d770a" />

## 概要

「たまlog」は、大学の保健センターなどに設置されている体組成計の結果用紙を写真に撮ってアップロードするだけで、数値を自動で読み取り、記録・管理できるWebアプリケーションです。
ユーザーの手入力の手間をなくすことを目指し、記録したデータはグラフで可視化され、日々の身体の変化を直感的に把握できるよう開発しました。

## 注意
このリポジトリはバージョン02になります。
大幅にディレクトリ構成をアップデートしたためこちらに作成しなおしました。
旧ディレクトリは[こちら](https://github.com/0-s0g0/tamalog)


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
