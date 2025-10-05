"""K-NN近傍法による数字分類モジュール"""
import cv2
import numpy as np
import os
import pickle


class KNNDigitClassifier:
    """K-NN法を使った数字認識器"""

    def __init__(self, k=3):
        """
        Args:
            k: 近傍数
        """
        self.k = k
        self.knn = cv2.ml.KNearest_create()
        self.is_trained = False
        self.feature_size = (20, 20)  # 特徴量のサイズ

    def extract_features(self, image):
        """
        画像から特徴量を抽出

        Args:
            image: グレースケール画像

        Returns:
            特徴ベクトル
        """
        # リサイズして正規化
        resized = cv2.resize(image, self.feature_size)
        # 二値化
        _, binary = cv2.threshold(resized, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        # 1次元ベクトルに変換して正規化
        features = binary.flatten().astype(np.float32) / 255.0
        return features

    def train_from_templates(self, template_folder='temp', template_range=range(1, 45)):
        """
        テンプレート画像からトレーニング

        Args:
            template_folder: テンプレートフォルダ
            template_range: テンプレート番号の範囲
        """
        # ラベル定義（テンプレート番号→実際の数字）
        labels_map = [2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5,
                      6, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 9, 0, 0, 1, 1]

        training_data = []
        training_labels = []

        template_files = [f"tem ({i}).png" for i in template_range]

        for idx, file in enumerate(template_files):
            template_path = os.path.join(template_folder, file)
            template_image = cv2.imread(template_path, cv2.IMREAD_GRAYSCALE)

            if template_image is None:
                continue

            # 特徴量抽出
            features = self.extract_features(template_image)
            training_data.append(features)

            # ラベル取得
            template_num = idx  # 0-indexed
            if template_num < len(labels_map):
                label = labels_map[template_num]
                training_labels.append(label)

        if len(training_data) == 0:
            print("Error: No training data found")
            return False

        # NumPy配列に変換
        training_data = np.array(training_data, dtype=np.float32)
        training_labels = np.array(training_labels, dtype=np.int32)

        # KNNモデルをトレーニング
        self.knn.train(training_data, cv2.ml.ROW_SAMPLE, training_labels)
        self.is_trained = True

        print(f"KNN trained with {len(training_data)} samples")
        return True

    def predict(self, image):
        """
        数字を予測

        Args:
            image: グレースケール画像

        Returns:
            (予測された数字, 信頼度)
        """
        if not self.is_trained:
            raise RuntimeError("KNN model is not trained yet")

        # 特徴量抽出
        features = self.extract_features(image)
        features = features.reshape(1, -1)

        # 予測
        ret, results, neighbours, dist = self.knn.findNearest(features, self.k)

        predicted_digit = int(results[0][0])

        # 信頼度を距離から計算（距離が小さいほど信頼度が高い）
        avg_distance = np.mean(dist[0])
        confidence = 1.0 / (1.0 + avg_distance)  # 0-1の範囲に正規化

        return predicted_digit, confidence

    def save_model(self, filepath='knn_model.pkl'):
        """モデルを保存"""
        if not self.is_trained:
            print("Warning: Model is not trained yet")
            return False

        # OpenCVのKNNモデルは直接pickleできないため、トレーニングデータを保存
        self.knn.save('knn_opencv_model.xml')
        print(f"Model saved to knn_opencv_model.xml")
        return True

    def load_model(self, filepath='knn_opencv_model.xml'):
        """モデルを読み込み"""
        if os.path.exists(filepath):
            self.knn = cv2.ml.KNearest_load(filepath)
            self.is_trained = True
            print(f"Model loaded from {filepath}")
            return True
        else:
            print(f"Model file not found: {filepath}")
            return False
