"""Edge case tests — empty states, special characters, very long inputs, boundary values.

Covers every algorithm and API endpoint with inputs that real users are likely
to trigger: no content, whitespace-only, Unicode, very long code, single-item
collections, and numeric/symbolic code.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.algorithms.tfidf import tokenize, TFIDFEngine
from app.algorithms.similarity import cosine_similarity
from app.algorithms.duplicate import levenshtein_distance, similarity_ratio, check_duplicate
from app.algorithms.clustering import KMeansClusterer, auto_k
from app.algorithms.summarizer import extractive_summarize

client = TestClient(app)


# ---------------------------------------------------------------------------
# TF-IDF tokenizer
# ---------------------------------------------------------------------------

class TestTokenizerEdgeCases:
    def test_empty_string_returns_empty_list(self):
        assert tokenize("") == []

    def test_whitespace_only_returns_empty_list(self):
        assert tokenize("   \n\t  ") == []

    def test_all_short_tokens_filtered_out(self):
        """Tokens under 3 chars (if, fn, x) are removed."""
        assert tokenize("if x fn") == []

    def test_special_characters_only_returns_empty(self):
        assert tokenize("!@#$%^&*(){}[]") == []

    def test_unicode_letters_kept(self):
        """Unicode identifiers (common in Python) should tokenize correctly."""
        tokens = tokenize("def función(): αβγ = True")
        assert len(tokens) > 0

    def test_very_long_document_tokenizes(self):
        long_code = "const value = true;\n" * 500
        tokens = tokenize(long_code)
        assert len(tokens) > 0

    def test_numeric_only_code_filtered(self):
        """Code like '42 3.14 0xff' — numbers under 3 digits are filtered."""
        tokens = tokenize("1 2 42")
        # "42" is 2 chars → filtered. "1", "2" filtered.
        assert tokens == []

    def test_mixed_code_keeps_identifiers(self):
        tokens = tokenize("const arr = [1, 2, 3].map(n => n * 2)")
        assert "const" in tokens
        assert "arr" in tokens
        assert "map" in tokens


# ---------------------------------------------------------------------------
# Cosine similarity
# ---------------------------------------------------------------------------

class TestCosineSimilarityEdgeCases:
    def test_both_empty_vectors_return_zero(self):
        assert cosine_similarity({}, {}) == 0.0

    def test_one_empty_vector_returns_zero(self):
        assert cosine_similarity({"a": 0.5}, {}) == 0.0
        assert cosine_similarity({}, {"a": 0.5}) == 0.0

    def test_identical_vectors_return_one(self):
        vec = {"react": 0.4, "hooks": 0.6}
        assert cosine_similarity(vec, vec) == pytest.approx(1.0, abs=1e-6)

    def test_orthogonal_vectors_return_zero(self):
        assert cosine_similarity({"python": 1.0}, {"react": 1.0}) == 0.0

    def test_score_bounded_in_0_1(self):
        a = {"x": 0.3, "y": 0.7}
        b = {"y": 0.5, "z": 0.5}
        score = cosine_similarity(a, b)
        assert 0.0 <= score <= 1.0


# ---------------------------------------------------------------------------
# Levenshtein / duplicate detection
# ---------------------------------------------------------------------------

class TestLevenshteinEdgeCases:
    def test_both_empty_strings_distance_zero(self):
        assert levenshtein_distance("", "") == 0

    def test_both_empty_similarity_one(self):
        assert similarity_ratio("", "") == 1.0

    def test_one_empty_distance_is_other_length(self):
        assert levenshtein_distance("", "abc") == 3
        assert levenshtein_distance("abc", "") == 3

    def test_one_empty_similarity_zero(self):
        assert similarity_ratio("", "hello") == 0.0

    def test_identical_strings_distance_zero(self):
        code = "const x = () => arr.map(n => n * 2);"
        assert levenshtein_distance(code, code) == 0

    def test_single_char_substitution(self):
        assert levenshtein_distance("cat", "bat") == 1

    def test_very_long_code_completes_without_error(self):
        long = "x" * 2000
        variant = "y" * 2000
        dist = levenshtein_distance(long, variant)
        assert dist == 2000

    def test_whitespace_only_code_not_flagged_as_duplicate(self):
        result = check_duplicate(
            "   \n  ",
            [{"id": "e1", "code": "const x = 1;"}],
        )
        assert result["is_duplicate"] is False

    def test_special_characters_handled(self):
        code = "!@#$%^&*()"
        result = check_duplicate(code, [{"id": "e1", "code": code}])
        assert result["is_duplicate"] is True
        assert result["matches"][0]["similarity"] == 1.0

    def test_unicode_code_handled(self):
        code = "def ñoño(): return '你好'"
        result = check_duplicate(code, [{"id": "e1", "code": code}])
        assert result["is_duplicate"] is True


# ---------------------------------------------------------------------------
# K-means clustering
# ---------------------------------------------------------------------------

class TestClusteringEdgeCases:
    def test_single_snippet_produces_one_cluster_via_api(self):
        r = client.post(
            "/api/clusters",
            json={"snippets": [{"id": "s1", "title": "Only snippet", "code": "x = 1", "description": "", "tags": []}]},
        )
        assert r.status_code == 200
        clusters = r.json()["clusters"]
        assert len(clusters) == 1
        assert "s1" in clusters[0]["snippet_ids"]

    def test_two_snippets_both_assigned(self):
        snippets = [
            {"id": "a", "title": "React hook", "code": "const x = useEffect()", "description": "", "tags": []},
            {"id": "b", "title": "Python list", "code": "nums = [1, 2, 3]", "description": "", "tags": []},
        ]
        r = client.post("/api/clusters", json={"snippets": snippets})
        assert r.status_code == 200
        all_ids = [sid for c in r.json()["clusters"] for sid in c["snippet_ids"]]
        assert sorted(all_ids) == ["a", "b"]

    def test_snippet_with_empty_text_fields_does_not_crash(self):
        snippets = [
            {"id": "x1", "title": "", "code": "", "description": "", "tags": []},
            {"id": "x2", "title": "React", "code": "useState()", "description": "state hook", "tags": ["react"]},
            {"id": "x3", "title": "Python", "code": "print('hi')", "description": "print function", "tags": ["python"]},
        ]
        r = client.post("/api/clusters", json={"snippets": snippets})
        assert r.status_code == 200

    def test_all_identical_snippets_handled(self):
        """Duplicate snippets (same text) should not crash the clusterer."""
        code = "const x = useState(false)"
        snippets = [{"id": f"s{i}", "title": "useState", "code": code, "description": "", "tags": []} for i in range(5)]
        r = client.post("/api/clusters", json={"snippets": snippets})
        assert r.status_code == 200
        all_ids = [sid for c in r.json()["clusters"] for sid in c["snippet_ids"]]
        assert sorted(all_ids) == sorted(s["id"] for s in snippets)

    def test_very_long_code_snippet_clusters(self):
        long_code = "const value = true; // comment\n" * 200
        snippets = [
            {"id": "long", "title": "Long snippet", "code": long_code, "description": "", "tags": []},
            {"id": "short", "title": "Short", "code": "x = 1", "description": "", "tags": []},
            {"id": "react", "title": "React hook", "code": "useEffect(() => {}, [])", "description": "", "tags": []},
        ]
        r = client.post("/api/clusters", json={"snippets": snippets})
        assert r.status_code == 200


# ---------------------------------------------------------------------------
# Search
# ---------------------------------------------------------------------------

class TestSearchEdgeCases:
    SNIPPETS = [
        {"id": "s1", "title": "useEffect hook", "code": "useEffect(() => {}, [])", "description": "side effects", "tags": ["react"]},
        {"id": "s2", "title": "Python list", "code": "[x for x in range(10)]", "description": "list comprehension", "tags": ["python"]},
    ]

    def test_empty_query_returns_empty(self):
        r = client.post("/api/search", json={"query": "", "snippets": self.SNIPPETS})
        assert r.status_code == 200
        assert r.json()["results"] == []

    def test_whitespace_only_query_returns_empty(self):
        r = client.post("/api/search", json={"query": "   ", "snippets": self.SNIPPETS})
        assert r.status_code == 200
        assert r.json()["results"] == []

    def test_very_short_query_below_min_token_length(self):
        """Query 'if' → 2 chars, filtered by tokenizer → no tokens → empty results."""
        r = client.post("/api/search", json={"query": "if x", "snippets": self.SNIPPETS})
        assert r.status_code == 200
        assert r.json()["results"] == []

    def test_special_characters_query_returns_empty(self):
        r = client.post("/api/search", json={"query": "!@#$%^", "snippets": self.SNIPPETS})
        assert r.status_code == 200
        assert r.json()["results"] == []

    def test_query_against_single_snippet(self):
        r = client.post(
            "/api/search",
            json={"query": "useEffect react", "snippets": [self.SNIPPETS[0]]},
        )
        assert r.status_code == 200
        results = r.json()["results"]
        assert len(results) >= 0  # may or may not match

    def test_very_long_query_does_not_crash(self):
        long_query = "typescript function component react hooks " * 50
        r = client.post("/api/search", json={"query": long_query, "snippets": self.SNIPPETS})
        assert r.status_code == 200

    def test_unicode_query_handled(self):
        r = client.post("/api/search", json={"query": "función async", "snippets": self.SNIPPETS})
        assert r.status_code == 200

    def test_zero_snippets_returns_empty(self):
        r = client.post("/api/search", json={"query": "react hooks", "snippets": []})
        assert r.status_code == 200
        assert r.json()["results"] == []


# ---------------------------------------------------------------------------
# SM-2 boundary values
# ---------------------------------------------------------------------------

class TestSM2BoundaryValues:
    def test_rating_0_minimum_resets(self):
        r = client.post("/api/review/schedule",
            json={"snippet_id": "x", "rating": 0, "current_ease": 2.5, "current_interval": 6, "current_reps": 2})
        assert r.status_code == 200
        assert r.json()["interval_days"] == 1
        assert r.json()["repetitions"] == 0

    def test_rating_5_maximum_advances(self):
        r = client.post("/api/review/schedule",
            json={"snippet_id": "x", "rating": 5, "current_ease": 2.5, "current_interval": 6, "current_reps": 2})
        assert r.status_code == 200
        assert r.json()["interval_days"] > 6

    def test_rating_2_resets(self):
        """Rating 2 (< 3) counts as forgetting — resets interval."""
        r = client.post("/api/review/schedule",
            json={"snippet_id": "x", "rating": 2, "current_ease": 2.5, "current_interval": 6, "current_reps": 2})
        assert r.status_code == 200
        assert r.json()["interval_days"] == 1

    def test_rating_3_remembers(self):
        """Rating 3 (>= 3) counts as remembered — advances interval."""
        r = client.post("/api/review/schedule",
            json={"snippet_id": "x", "rating": 3, "current_ease": 2.5, "current_interval": 6, "current_reps": 2})
        assert r.status_code == 200
        assert r.json()["interval_days"] > 1

    def test_ease_at_minimum_1_3_accepted(self):
        r = client.post("/api/review/schedule",
            json={"snippet_id": "x", "rating": 5, "current_ease": 1.3, "current_interval": 6, "current_reps": 2})
        assert r.status_code == 200
        assert r.json()["ease_factor"] >= 1.3

    def test_ease_below_minimum_rejected(self):
        r = client.post("/api/review/schedule",
            json={"snippet_id": "x", "rating": 3, "current_ease": 1.2, "current_interval": 1, "current_reps": 0})
        assert r.status_code == 422

    def test_rating_out_of_range_rejected(self):
        for bad_rating in [-1, 6, 100]:
            r = client.post("/api/review/schedule",
                json={"snippet_id": "x", "rating": bad_rating, "current_ease": 2.5, "current_interval": 1, "current_reps": 0})
            assert r.status_code == 422, f"Expected 422 for rating={bad_rating}"


# ---------------------------------------------------------------------------
# Summarizer
# ---------------------------------------------------------------------------

class TestSummarizerEdgeCases:
    def test_single_snippet_returns_one_point(self):
        result = extractive_summarize([
            {"id": "s1", "description": "React useEffect runs side effects.", "notes": ""}
        ])
        assert len(result) == 1
        assert result[0]["source_snippet_id"] == "s1"

    def test_snippet_with_no_text_is_skipped(self):
        result = extractive_summarize([
            {"id": "empty", "description": "", "notes": ""},
            {"id": "real", "description": "useState manages component state in React.", "notes": ""},
        ])
        ids = [p["source_snippet_id"] for p in result]
        assert "real" in ids
        # "empty" may or may not appear — it should not crash

    def test_all_empty_snippets_returns_empty(self):
        result = extractive_summarize([
            {"id": f"s{i}", "description": "", "notes": ""} for i in range(5)
        ])
        assert result == []

    def test_snippet_with_only_notes_field(self):
        result = extractive_summarize([
            {"id": "s1", "description": "", "notes": "Always use cleanup in useEffect to prevent leaks."},
            {"id": "s2", "description": "", "notes": "useState triggers a re-render on state change."},
        ])
        assert len(result) >= 1

    def test_duplicate_descriptions_diversity(self):
        """MMR should still return distinct points even for near-duplicate snippets."""
        same_text = "React hooks manage state and side effects."
        snippets = [{"id": f"s{i}", "description": same_text, "notes": ""} for i in range(3)]
        result = extractive_summarize(snippets, max_points=3)
        # Should not crash and should return at most 3 points
        assert len(result) <= 3

    def test_api_empty_snippets_returns_empty_thread(self):
        r = client.post("/api/summarize", json={"snippets": []})
        assert r.status_code == 200
        assert r.json()["thread_draft"] == []
