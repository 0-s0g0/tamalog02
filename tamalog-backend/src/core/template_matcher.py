"""テンプレートマッチングモジュール"""
import cv2
import numpy as np
import os
import json
from .knn_classifier import KNNDigitClassifier


def load_templates(template_folder='temp', template_range=range(1, 45)):
    """テンプレート画像を読み込み"""
    templates = {}
    template_files = [f"tem ({i}).png" for i in template_range]

    for file in template_files:
        template_path = os.path.join(template_folder, file)
        template_image = cv2.imread(template_path, cv2.IMREAD_GRAYSCALE)

        if template_image is None:
            print(f"Warning: Could not load template image: {template_path}")
            continue

        try:
            number = int(file.split('(')[1].split(')')[0])
            templates[number] = template_image
        except ValueError as e:
            print(f"Error extracting number from file name '{file}': {e}")
            continue

    return templates


def is_close(pos1, pos2, threshold=10):
    """2つの位置が近いかどうかを判定"""
    return abs(pos1[0] - pos2[0]) < threshold and abs(pos1[1] - pos2[1]) < threshold


def match_templates(binary_input, templates, threshold=0.8):
    """テンプレートマッチングを実行して位置を検出"""
    detected_positions = []

    for number, template in templates.items():
        if template is None:
            continue

        template_h, template_w = template.shape
        input_h, input_w = binary_input.shape

        if template_h > input_h or template_w > input_w:
            continue

        try:
            result = cv2.matchTemplate(binary_input, template, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, max_loc = cv2.minMaxLoc(result)

            if max_val > threshold:
                # (テンプレート番号, マッチスコア, 位置, サイズ)を保存
                detected_positions.append((number, max_val, max_loc, (template_w, template_h)))
        except cv2.error as e:
            print(f"Template matching error for template {number}: {e}")
            continue

    return detected_positions


def filter_duplicate_positions(detected_positions):
    """重複する位置を除去し、最もスコアが高いものを選択"""
    filtered_positions = []

    for number, max_val, pos, size in detected_positions:
        if not any(is_close(pos, p) for _, _, p, _ in filtered_positions):
            filtered_positions.append((number, max_val, pos, size))
        else:
            # 同じ位置でより高いスコアのテンプレートを選択
            for i, (_, existing_max_val, existing_pos, _) in enumerate(filtered_positions):
                if is_close(pos, existing_pos) and max_val > existing_max_val:
                    filtered_positions[i] = (number, max_val, pos, size)
                    break

    # Y座標順、X座標順にソート
    filtered_positions.sort(key=lambda x: (x[2][1] // 5, x[2][0]))

    return filtered_positions


def classify_digits_with_knn(binary_input, filtered_positions, knn_classifier):
    """
    K-NN分類器を使って検出された数字を分類

    Args:
        binary_input: 二値化画像
        filtered_positions: フィルタ済みの位置情報 [(template_num, score, pos, size), ...]
        knn_classifier: 学習済みKNN分類器

    Returns:
        [(数字, 信頼度, 位置), ...]
    """
    classified_results = []

    for template_num, match_score, pos, size in filtered_positions:
        x, y = pos
        w, h = size

        # 数字領域を切り出し
        digit_roi = binary_input[y:y+h, x:x+w]

        if digit_roi.size == 0:
            continue

        try:
            # K-NNで分類
            predicted_digit, knn_confidence = knn_classifier.predict(digit_roi)

            # テンプレートマッチングスコアとKNN信頼度を組み合わせ
            combined_confidence = (match_score + knn_confidence) / 2.0

            classified_results.append((predicted_digit, combined_confidence, pos))

        except Exception as e:
            print(f"KNN classification error at position {pos}: {e}")
            continue

    return classified_results


def draw_detections(image, filtered_numbers):
    """検出結果を画像に描画"""
    for number, score, pos in filtered_numbers:
        x, y = pos
        # 矩形を描画
        cv2.rectangle(image, (x, y), (x + 40, y + 40), (0, 255, 0), 3)
        # 数字を表示
        cv2.putText(image, str(number), (x + 5, y + 35),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
        # スコアも表示
        cv2.putText(image, f"{score:.2f}", (x, y - 5),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 0, 0), 1)

    return image


def detect_numbers(image_path, use_knn=True):
    """
    数字検出のメイン関数

    Args:
        image_path: 画像パス
        use_knn: K-NN分類を使用するかどうか（デフォルト: True）

    Returns:
        検出された数字のリスト
    """
    # テンプレート読み込み
    templates = load_templates()

    # K-NN分類器の初期化とトレーニング
    knn_classifier = None
    if use_knn:
        knn_classifier = KNNDigitClassifier(k=3)
        # モデルファイルがあれば読み込み、なければトレーニング
        if not knn_classifier.load_model('knn_opencv_model.xml'):
            print("Training KNN classifier...")
            if knn_classifier.train_from_templates():
                knn_classifier.save_model()
            else:
                print("Warning: KNN training failed, falling back to template matching only")
                use_knn = False

    # 入力画像の前処理
    input_image = cv2.imread(image_path)
    if input_image is None:
        print(f"Error: Image file '{image_path}' not found or unable to read.")
        return []

    # グレースケール変換
    gray_input = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)

    # 二値化
    _, binary_input = cv2.threshold(gray_input, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # 左側40%の部分を切り取る
    width = binary_input.shape[1]
    left_width = int(width * 0.4)
    binary_input_left = binary_input[:, :left_width]
    input_image_left = input_image[:, :left_width]

    cv2.imwrite('debug_07_left40percent.jpg', input_image_left)

    # テンプレートマッチングで位置検出
    detected_positions = match_templates(binary_input_left, templates, threshold=0.8)

    # 重複する位置を除去
    filtered_positions = filter_duplicate_positions(detected_positions)

    # K-NNで数字を分類
    if use_knn and knn_classifier:
        print("Classifying digits with KNN...")
        classified_results = classify_digits_with_knn(binary_input_left, filtered_positions, knn_classifier)
    else:
        # K-NN不使用の場合は従来のラベル方式
        labels = [2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5,
                  6, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 1, 1]
        classified_results = []
        for template_num, score, pos, _ in filtered_positions:
            label_number = labels[template_num] if template_num < len(labels) else None
            if label_number is not None:
                classified_results.append((label_number, score, pos))

    # 検出結果をリスト化
    detected_list = []
    for number, confidence, pos in classified_results:
        detected_list.append(number)
        print(f"数字 {number}: 信頼度={confidence:.3f}, 位置={pos}")

    # 検出した数字の位置に矩形を描画し、その数字を表示する
    for number, confidence, pos in classified_results:
        x, y = pos
        cv2.rectangle(input_image_left, (x, y), (x + 40, y + 40), (0, 255, 0), 2)
        cv2.putText(input_image_left, str(number), (x + 5, y + 35), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
        # 信頼度も表示
        cv2.putText(input_image_left, f"{confidence:.2f}", (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 0, 0), 1)

    # 結果を保存
    output_image_path = 'output_with_numbers.jpg'
    cv2.imwrite(output_image_path, input_image_left)
    print(f"Processed image saved as {output_image_path}")
    print(json.dumps(detected_list))
    return detected_list
