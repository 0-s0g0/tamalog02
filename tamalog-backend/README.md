# Tamalog Backend 

## ディレクトリ構造

```
tamalog-backend/
├── src/
│   ├── core/                    # コア処理モジュール
│   │   ├── __init__.py
│   │   ├── inbody.py           # メインエントリ
│   │   ├── image_preprocessing.py  # 前処理（射影変換、ノイズ除去、CLAHE）
│   │   ├── template_matcher.py     # テンプレートマッチング
│   │   └── classical_detector.py   # 高速古典的検出（輪郭ベース）
│   └── __init__.py
├── temp/                        # テンプレート画像（44枚-対象物を255値）
├── uploads/                     # アップロード画像保存先(ignoreしてる)
├── data/
│   ├── output/                  # 処理結果画像(ignoreしてる)
│   └── debug/                   # デバッグ画像(ignoreしてる)
├── upload.py                    # Flask API
├── requirements.txt
└── README.md

```


## 処理フロー（古典的画像処理をメインにしてるよ）

```
1. 画像アップロード
   ↓
2. 前処理（image_preprocessing.py）
   - ノイズ除去（ガウシアンブラー）
   - コントラスト強化（CLAHE）
   - 輪郭検出 → 最大領域抽出
   - 射影変換で歪み補正
   ↓
3. テンプレートマッチング（template_matcher.py）
   - 左40%領域を切り出し
   - テンプレートマッチング（44種類）
   - 重複除去（距離30px以内）
   - Y座標→X座標順にソート
   ↓
4. 結果返却

```



## パラメータメモ

### `template_matcher.py`

```python
# 検出閾値（0.0-1.0）
threshold=0.7  

# 重複判定距離（ピクセル）
threshold=30  
```

### `image_preprocessing.py`

```python
# ノイズ除去カーネル
kernel_size=(5, 5)  # 大きい = 強力

# CLAHE クリップリミット
clip_limit=2.0      # 大きい = 強力
```

## 依存パッケージ

```
Flask
Flask-Cors
gunicorn
opencv-python-headless
numpy
```


