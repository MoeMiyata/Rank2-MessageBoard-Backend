# # keybert_server.py
# from flask import Flask, request, jsonify
# from keybert import KeyBERT
# from transformers import AutoModel, AutoTokenizer
# from sentence_transformers import SentenceTransformer

# # 日本語用のモデルを指定（推奨：sonoisa）
# model = SentenceTransformer("sonoisa/sentence-bert-base-ja-mean-tokens")
# kw_model = KeyBERT(model)

# app = Flask(__name__)

# @app.route("/extract-keywords", methods=["POST"])
# def extract_keywords():
#     data = request.json
#     text = data.get("content", "")
#     keywords = kw_model.extract_keywords(
#         text,
#         keyphrase_ngram_range=(1, 2),
#         stop_words=None,  # 日本語では英語のstopwordsは使わない
#         top_n=5
#     )
#     return jsonify([kw[0] for kw in keywords])

# if __name__ == "__main__":
#     app.run(port=5005)

# keyword_extractor.py
import sys
import json
from keybert import KeyBERT

model = KeyBERT()
text = sys.stdin.read()

keywords = model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=5)
# キーワードだけ取り出してJSON形式で出力
print(json.dumps([kw[0] for kw in keywords]))
