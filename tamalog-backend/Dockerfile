# ベースとなるPythonのイメージを指定
FROM python:3.10-slim

# 必要なシステムライブラリをインストール（OpenCV用）
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# アプリケーションの作業ディレクトリを作成
WORKDIR /app

# 依存関係ファイルをコピー
COPY requirements.txt .

# 依存関係をインストール
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのソースコードをコピー
COPY . .

# 必要なディレクトリを作成
RUN mkdir -p /app/uploads /app/data/output /app/data/debug

# アプリケーションが使用するポートを公開
EXPOSE 5000

# アプリケーションを起動するコマンド
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "upload:app"]