"""画像前処理モジュール"""
import cv2
import numpy as np


def order_points(pts):
    """4点を左上、右上、右下、左下の順に並べ替える"""
    rect = np.zeros((4, 2), dtype="float32")

    # 合計値が最小 = 左上、最大 = 右下
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]

    # 差分が最小 = 右上、最大 = 左下
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]

    return rect


def correct_perspective(image, contour):
    """射影変換で歪みを補正"""
    # 輪郭を近似して4点の矩形を取得
    epsilon = 0.02 * cv2.arcLength(contour, True)
    approx = cv2.approxPolyDP(contour, epsilon, True)

    # 4点が取得できない場合はスキップ
    if len(approx) != 4:
        return None

    # 4点を並べ替え
    pts = approx.reshape(4, 2)
    rect = order_points(pts)

    # 変換後のサイズを計算
    (tl, tr, br, bl) = rect
    widthA = np.linalg.norm(br - bl)
    widthB = np.linalg.norm(tr - tl)
    maxWidth = max(int(widthA), int(widthB))

    heightA = np.linalg.norm(tr - br)
    heightB = np.linalg.norm(tl - bl)
    maxHeight = max(int(heightA), int(heightB))

    # 変換後の座標
    dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]
    ], dtype="float32")

    # 射影変換行列を計算
    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))

    return warped


def denoise_image(image, kernel_size=(5, 5)):
    """ノイズ除去（ガウシアンブラー）"""
    return cv2.GaussianBlur(image, kernel_size, 0)


def enhance_contrast(gray_image, clip_limit=2.0, tile_grid_size=(8, 8)):
    """コントラスト強化（CLAHE）"""
    clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)
    return clahe.apply(gray_image)


def extract_largest_contour_region(image_path, output_path='output_image_with_contours.jpg'):
    """最大輪郭領域を抽出し、射影変換で補正"""
    # 画像の読み込み
    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(f"Could not open or find the image: {image_path}")

    # ノイズ除去
    denoised = denoise_image(image)

    # グレースケール変換
    gray_image = cv2.cvtColor(denoised, cv2.COLOR_BGR2GRAY)

    # コントラスト強化
    gray_image = enhance_contrast(gray_image)

    # しきい値処理
    _, binary_image = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # 輪郭検出
    contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # 最大面積の輪郭を見つける
    max_contour = None
    max_area = 0

    for contour in contours:
        area = cv2.contourArea(contour)
        if area > max_area:
            max_area = area
            max_contour = contour

    if max_contour is None:
        raise ValueError("No contours found.")

    # 射影変換で歪み補正を試みる
    warped = correct_perspective(image, max_contour)

    if warped is not None:
        max_region = warped
        print("射影変換による歪み補正を適用しました")
    else:
        # 射影変換が失敗した場合は従来の方法
        x, y, w, h = cv2.boundingRect(max_contour)
        max_region = image[y:y+h, x:x+w]
        print("外接矩形による切り出しを実行しました")

    # デバッグ画像保存
    cv2.imwrite('debug_01_original.jpg', image)
    cv2.imwrite('debug_02_denoised.jpg', denoised)
    cv2.imwrite('debug_03_gray.jpg', gray_image)
    cv2.imwrite('debug_04_binary.jpg', binary_image)

    # 結果を保存
    cv2.imwrite(output_path, max_region)
    print(f"デバッグ画像を保存しました: debug_01~04, {output_path}")

    return output_path
