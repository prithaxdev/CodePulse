"""Tests for Levenshtein edit distance and duplicate detection."""

import pytest

from app.algorithms.duplicate import check_duplicate, levenshtein_distance, similarity_ratio


# ---------------------------------------------------------------------------
# levenshtein_distance
# ---------------------------------------------------------------------------


def test_identical_strings_distance_zero():
    assert levenshtein_distance("hello", "hello") == 0


def test_empty_strings_distance_zero():
    assert levenshtein_distance("", "") == 0


def test_one_empty_string():
    assert levenshtein_distance("abc", "") == 3
    assert levenshtein_distance("", "abc") == 3


def test_single_insertion():
    assert levenshtein_distance("cat", "cats") == 1


def test_single_deletion():
    assert levenshtein_distance("cats", "cat") == 1


def test_single_replacement():
    assert levenshtein_distance("cat", "bat") == 1


def test_known_distance():
    # "kitten" → "sitting" is the classic example (distance = 3)
    assert levenshtein_distance("kitten", "sitting") == 3


def test_completely_different_strings():
    a = "abcdef"
    b = "uvwxyz"
    assert levenshtein_distance(a, b) == 6


# ---------------------------------------------------------------------------
# similarity_ratio
# ---------------------------------------------------------------------------


def test_identical_code_similarity_one():
    code = "const x = 1;"
    assert similarity_ratio(code, code) == 1.0


def test_empty_strings_similarity_one():
    assert similarity_ratio("", "") == 1.0


def test_completely_different_low_similarity():
    a = "def bubble_sort(arr):\n    pass"
    b = "SELECT * FROM users WHERE id = 1;"
    score = similarity_ratio(a, b)
    assert score < 0.4, f"Expected < 0.4, got {score}"


def test_renamed_variable_high_similarity():
    original = "const userId = getUserId();\nconsole.log(userId);"
    renamed = "const uid = getUserId();\nconsole.log(uid);"
    score = similarity_ratio(original, renamed)
    assert score >= 0.75, f"Expected >= 0.75, got {score}"


def test_small_diff_very_high_similarity():
    base = "function add(a, b) {\n  return a + b;\n}"
    tweaked = "function add(a, b) {\n  return a + b; // sum\n}"
    score = similarity_ratio(base, tweaked)
    assert score >= 0.80, f"Expected >= 0.80, got {score}"


# ---------------------------------------------------------------------------
# check_duplicate
# ---------------------------------------------------------------------------

EXISTING = [
    {"id": "snippet-1", "code": "const x = 1;\nconsole.log(x);"},
    {"id": "snippet-2", "code": "function greet(name) {\n  return `Hello, ${name}!`;\n}"},
    {"id": "snippet-3", "code": "SELECT id, email FROM users WHERE active = true;"},
]


def test_identical_code_is_flagged():
    new_code = EXISTING[0]["code"]
    result = check_duplicate(new_code, EXISTING)
    assert result["is_duplicate"] is True
    assert any(m["id"] == "snippet-1" for m in result["matches"])
    assert any(m["similarity"] == 1.0 for m in result["matches"])


def test_completely_different_code_not_flagged():
    new_code = "import numpy as np\narr = np.array([1, 2, 3])"
    result = check_duplicate(new_code, EXISTING)
    assert result["is_duplicate"] is False
    assert result["matches"] == []


def test_renamed_variable_caught():
    # Same logic as snippet-1 but variable renamed
    new_code = "const y = 1;\nconsole.log(y);"
    result = check_duplicate(new_code, EXISTING)
    assert result["is_duplicate"] is True
    assert result["matches"][0]["id"] == "snippet-1"


def test_matches_sorted_descending():
    # Two near-identical snippets; matches should be descending by similarity
    existing = [
        {"id": "a", "code": "hello world foo bar baz"},
        {"id": "b", "code": "hello world foo bar"},
    ]
    new_code = "hello world foo bar baz"
    result = check_duplicate(new_code, existing, threshold=0.7)
    similarities = [m["similarity"] for m in result["matches"]]
    assert similarities == sorted(similarities, reverse=True)


def test_custom_threshold_respected():
    new_code = "const x = 1;\nconsole.log(x);"
    # With a threshold of 1.0 only exact matches pass
    result = check_duplicate(new_code, EXISTING, threshold=1.0)
    for m in result["matches"]:
        assert m["similarity"] == 1.0


def test_empty_existing_snippets():
    result = check_duplicate("some code", [])
    assert result["is_duplicate"] is False
    assert result["matches"] == []


def test_empty_new_code_against_nonempty():
    result = check_duplicate("", EXISTING, threshold=0.85)
    # Empty string vs multi-line code should be well below threshold
    assert result["is_duplicate"] is False
