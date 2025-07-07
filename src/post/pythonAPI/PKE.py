import pke
import json
import sys
from nltk.corpus import stopwords

import logging
logging.getLogger().setLevel(logging.ERROR) # 警告出さないように

# 入力テキスト取得
text = sys.stdin.read()

# Extractorの選択（TextRankが比較的安定）
extractor = pke.unsupervised.TextRank()

# 対象ファイルを読み込み（日本語なので language='ja'）
extractor.load_document(input=text, language='ja', normalization=None)

# 品詞フィルタ（名詞、形容詞、動詞などを残す）
pos = {'NOUN', 'PROPN', 'ADJ'}
extractor.candidate_selection(pos=pos)

# 重み付け（TextRankアルゴリズムを実行）
extractor.candidate_weighting(window=2, pos=pos)

# 上位10個のキーフレーズを抽出
keyphrases = extractor.get_n_best(n=10)

# 結果を表示（JSON形式）
print(json.dumps([kp[0].replace(" ", "") for kp in keyphrases], ensure_ascii=False))
