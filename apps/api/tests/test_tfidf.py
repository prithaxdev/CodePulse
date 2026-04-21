"""Tests for TF-IDF vectorizer and cosine similarity."""

import json
import math
from pathlib import Path

import pytest

from app.algorithms.tfidf import (
    TFIDFEngine,
    compute_idf,
    compute_tf,
    tfidf_vector,
    tokenize,
)
from app.algorithms.similarity import cosine_similarity, rank_by_similarity

FIXTURES_PATH = Path(__file__).parent / "fixtures" / "sample_snippets.json"


# ---------------------------------------------------------------------------
# Tokenizer
# ---------------------------------------------------------------------------


class TestTokenize:
    def test_lowercases_input(self):
        tokens = tokenize("Hello World")
        assert all(t == t.lower() for t in tokens)

    def test_removes_short_tokens(self):
        tokens = tokenize("a ab abc abcd")
        assert "a" not in tokens
        assert "ab" not in tokens
        assert "abc" in tokens
        assert "abcd" in tokens

    def test_splits_on_punctuation(self):
        tokens = tokenize("foo.bar,baz:qux")
        assert "foo" in tokens
        assert "bar" in tokens
        assert "baz" in tokens
        assert "qux" in tokens

    def test_empty_string(self):
        assert tokenize("") == []

    def test_only_short_tokens(self):
        assert tokenize("a b c") == []


# ---------------------------------------------------------------------------
# TF
# ---------------------------------------------------------------------------


class TestComputeTF:
    def test_proportional_frequency(self):
        tokens = ["foo", "foo", "bar"]
        tf = compute_tf(tokens)
        assert pytest.approx(tf["foo"]) == 2 / 3
        assert pytest.approx(tf["bar"]) == 1 / 3

    def test_sums_to_one(self):
        tokens = ["apple", "banana", "cherry", "apple"]
        tf = compute_tf(tokens)
        assert pytest.approx(sum(tf.values())) == 1.0

    def test_empty_tokens(self):
        assert compute_tf([]) == {}


# ---------------------------------------------------------------------------
# IDF
# ---------------------------------------------------------------------------


class TestComputeIDF:
    def test_rare_term_higher_idf(self):
        docs = [["python", "code"], ["python", "script"], ["javascript", "code"]]
        idf = compute_idf(docs)
        # "javascript" appears in 1/3 docs, "python" in 2/3 → javascript has higher IDF
        assert idf["javascript"] > idf["python"]

    def test_term_in_all_docs_idf_zero(self):
        docs = [["common", "foo"], ["common", "bar"], ["common", "baz"]]
        idf = compute_idf(docs)
        assert idf["common"] == 0.0

    def test_empty_corpus(self):
        assert compute_idf([]) == {}


# ---------------------------------------------------------------------------
# TF-IDF vector
# ---------------------------------------------------------------------------


class TestTFIDFVector:
    def test_rare_term_weighted_higher(self):
        corpus = [
            ["python", "hook", "react"],
            ["python", "hook", "javascript"],
            ["python", "typescript", "interface"],
        ]
        idf = compute_idf(corpus)
        tf = compute_tf(corpus[0])
        vec = tfidf_vector(tf, idf)
        # "react" appears in 1 doc → higher weight than "python" (3 docs)
        assert vec["react"] > vec["python"]

    def test_common_term_zero_weight(self):
        corpus = [["common", "rare"], ["common", "unique"], ["common", "special"]]
        idf = compute_idf(corpus)
        tf = compute_tf(corpus[0])
        vec = tfidf_vector(tf, idf)
        assert vec.get("common", 0.0) == 0.0


# ---------------------------------------------------------------------------
# TFIDFEngine
# ---------------------------------------------------------------------------


class TestTFIDFEngine:
    def setup_method(self):
        self.docs = [
            "useState hook React state management",
            "useEffect hook React side effects lifecycle",
            "TypeScript interface type annotation",
        ]
        self.engine = TFIDFEngine()
        self.engine.fit(self.docs)

    def test_vectorize_returns_dict(self):
        vec = self.engine.vectorize("React hooks")
        assert isinstance(vec, dict)

    def test_vectorize_corpus_length(self):
        vecs = self.engine.vectorize_corpus()
        assert len(vecs) == len(self.docs)

    def test_rare_term_higher_weight(self):
        # "typescript" appears in 1 doc; "hook" appears in 2 docs
        # vectorizing the third doc: typescript should outweigh hook (hook not in doc 2, but let's use a direct test)
        engine = TFIDFEngine()
        engine.fit([
            "hook react component",
            "hook react function",
            "typescript interface type",
        ])
        vec = engine.vectorize("hook react typescript")
        # typescript is in 1/3 docs → higher IDF → higher TF-IDF
        assert vec.get("typescript", 0) > vec.get("hook", 0)


# ---------------------------------------------------------------------------
# Cosine similarity
# ---------------------------------------------------------------------------


class TestCosineSimilarity:
    def test_identical_vectors_return_one(self):
        vec = {"python": 0.5, "hook": 0.3, "react": 0.2}
        assert pytest.approx(cosine_similarity(vec, vec), abs=1e-9) == 1.0

    def test_orthogonal_vectors_return_zero(self):
        vec_a = {"python": 1.0}
        vec_b = {"javascript": 1.0}
        assert cosine_similarity(vec_a, vec_b) == 0.0

    def test_empty_vector_returns_zero(self):
        vec = {"python": 0.5}
        assert cosine_similarity({}, vec) == 0.0
        assert cosine_similarity(vec, {}) == 0.0

    def test_score_between_zero_and_one(self):
        vec_a = {"python": 0.4, "hook": 0.3, "react": 0.3}
        vec_b = {"python": 0.5, "javascript": 0.3, "hook": 0.2}
        score = cosine_similarity(vec_a, vec_b)
        assert 0.0 <= score <= 1.0

    def test_related_texts_higher_than_unrelated(self):
        engine = TFIDFEngine()
        engine.fit([
            "useState hook React state",
            "useEffect hook React effect",
            "binary tree traversal algorithm",
        ])
        query = engine.vectorize("React hook state")
        react_vec = engine.vectorize("useState hook React state")
        algo_vec = engine.vectorize("binary tree traversal algorithm")
        assert cosine_similarity(query, react_vec) > cosine_similarity(query, algo_vec)

    def test_symmetry(self):
        vec_a = {"python": 0.5, "hook": 0.3}
        vec_b = {"python": 0.2, "react": 0.4}
        assert pytest.approx(cosine_similarity(vec_a, vec_b)) == cosine_similarity(vec_b, vec_a)


# ---------------------------------------------------------------------------
# Search (rank_by_similarity)
# ---------------------------------------------------------------------------


class TestSearch:
    def test_search_finds_relevant_snippets(self):
        docs = [
            "useState hook React state management",
            "binary search tree data structure algorithm",
            "TypeScript generic type constraint interface",
            "useCallback memoization React hook performance",
        ]
        engine = TFIDFEngine()
        engine.fit(docs)
        corpus_vecs = engine.vectorize_corpus()
        ids = ["react-state", "binary-tree", "typescript-generics", "react-callback"]

        query_vec = engine.vectorize("React hook")
        results = rank_by_similarity(query_vec, corpus_vecs, ids)

        top_ids = [r[0] for r in results[:2]]
        assert "react-state" in top_ids or "react-callback" in top_ids

    def test_results_sorted_descending(self):
        docs = ["foo bar baz", "hello world", "foo bar"]
        engine = TFIDFEngine()
        engine.fit(docs)
        corpus_vecs = engine.vectorize_corpus()
        ids = ["a", "b", "c"]

        query_vec = engine.vectorize("foo bar baz")
        results = rank_by_similarity(query_vec, corpus_vecs, ids)

        scores = [r[1] for r in results]
        assert scores == sorted(scores, reverse=True)

    def test_search_on_seed_dataset(self):
        """Search the full 50-snippet seed dataset."""
        with open(FIXTURES_PATH) as f:
            snippets = json.load(f)

        docs = [
            f"{s['title']} {s.get('code', '')} {s.get('description', '')} {' '.join(s.get('tags', []))}"
            for s in snippets
        ]
        ids = [s["id"] for s in snippets]

        engine = TFIDFEngine()
        engine.fit(docs)
        corpus_vecs = engine.vectorize_corpus()

        query_vec = engine.vectorize("React useState hook")
        results = rank_by_similarity(query_vec, corpus_vecs, ids)

        # Top result should be a React/hook snippet, not totally unrelated
        top_id = results[0][0]
        top_snippet = next(s for s in snippets if s["id"] == top_id)
        tags = [t.lower() for t in top_snippet.get("tags", [])]
        title = top_snippet["title"].lower()
        assert any(
            kw in tags or kw in title
            for kw in ["react", "hook", "usestate", "state"]
        )
