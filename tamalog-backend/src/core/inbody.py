"""
InBody画像処理メインモジュール

画像から数字を検出するメイン処理を提供します。
- 前処理: image_preprocessing.py
- テンプレートマッチング: template_matcher.py
"""

from .image_preprocessing import extract_largest_contour_region
from .template_matcher import detect_numbers

__all__ = ['extract_largest_contour_region', 'detect_numbers']
