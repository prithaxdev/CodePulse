"""Tests for extractive text summarization with MMR."""

import pytest

from app.algorithms.summarizer import extractive_summarize, _split_sentences


# ---------------------------------------------------------------------------
# _split_sentences
# ---------------------------------------------------------------------------

def test_split_sentences_basic():
    text = "First sentence. Second sentence. Third sentence."
    parts = _split_sentences(text)
    assert len(parts) == 3
    assert parts[0] == "First sentence."


def test_split_sentences_newlines():
    text = "Line one\nLine two\nLine three"
    parts = _split_sentences(text)
    assert len(parts) == 3


def test_split_sentences_empty_string():
    assert _split_sentences("") == []


def test_split_sentences_ignores_blank_parts():
    text = "Hello.\n\n\nWorld."
    parts = _split_sentences(text)
    assert "" not in parts


# ---------------------------------------------------------------------------
# extractive_summarize — edge cases
# ---------------------------------------------------------------------------

def test_empty_snippets_returns_empty():
    assert extractive_summarize([]) == []


def test_single_snippet_returns_one_point():
    snippets = [{"id": "a1", "description": "React hooks simplify state. Use useState for local state management."}]
    result = extractive_summarize(snippets, max_points=5)
    assert len(result) == 1
    assert result[0]["source_snippet_id"] == "a1"
    assert isinstance(result[0]["point"], str)
    assert len(result[0]["point"]) > 0


def test_snippet_with_no_description_is_skipped():
    snippets = [
        {"id": "x1", "description": ""},
        {"id": "x2", "description": "Python list comprehensions are concise and fast."},
    ]
    result = extractive_summarize(snippets, max_points=5)
    # Only the non-empty snippet should produce a point
    ids = [r["source_snippet_id"] for r in result]
    assert "x2" in ids


def test_max_points_is_respected():
    snippets = [
        {"id": str(i), "description": f"Snippet {i} talks about topic {i} in detail."}
        for i in range(10)
    ]
    result = extractive_summarize(snippets, max_points=3)
    assert len(result) <= 3


def test_result_structure_has_required_keys():
    snippets = [{"id": "s1", "description": "TypeScript generics enable reusable typed functions."}]
    result = extractive_summarize(snippets)
    assert "point" in result[0]
    assert "source_snippet_id" in result[0]


def test_notes_field_used_when_description_missing():
    snippets = [{"id": "n1", "notes": "Tailwind utility classes reduce custom CSS overhead."}]
    result = extractive_summarize(snippets, max_points=5)
    assert len(result) == 1
    assert result[0]["source_snippet_id"] == "n1"


def test_both_description_and_notes_combined():
    snippets = [{
        "id": "b1",
        "description": "useEffect runs after render.",
        "notes": "Cleanup function prevents memory leaks.",
    }]
    result = extractive_summarize(snippets, max_points=5)
    assert len(result) == 1


# ---------------------------------------------------------------------------
# MMR diversity — selected points should not be identical
# ---------------------------------------------------------------------------

def test_selected_points_are_diverse():
    """Three snippets with different topics should yield 3 different sentences."""
    snippets = [
        {"id": "r1", "description": "React useState hook manages component state. Call it at top level only."},
        {"id": "p1", "description": "Python generators use yield keyword. They are memory efficient for large data."},
        {"id": "s1", "description": "SQL JOIN merges rows from two tables. Use ON clause to specify condition."},
    ]
    result = extractive_summarize(snippets, max_points=5)
    points = [r["point"] for r in result]
    # All three selected sentences should be distinct
    assert len(set(points)) == len(points)


def test_source_ids_map_correctly():
    """Each result point must trace back to the snippet it came from."""
    snippets = [
        {"id": "alpha", "description": "Git rebase rewrites commit history cleanly."},
        {"id": "beta", "description": "Docker containers isolate application environments."},
    ]
    result = extractive_summarize(snippets, max_points=5)
    ids = {r["source_snippet_id"] for r in result}
    assert ids == {"alpha", "beta"}


# ---------------------------------------------------------------------------
# MMR lambda boundary values
# ---------------------------------------------------------------------------

def test_mmr_lambda_zero_still_runs():
    """lambda=0.0 is purely diversity-based — should not crash."""
    snippets = [
        {"id": "1", "description": "TypeScript interfaces define object shapes."},
        {"id": "2", "description": "TypeScript generics allow reusable typed code."},
    ]
    result = extractive_summarize(snippets, max_points=5, mmr_lambda=0.0)
    assert len(result) >= 1


def test_mmr_lambda_one_still_runs():
    """lambda=1.0 is purely relevance-based — should not crash."""
    snippets = [
        {"id": "1", "description": "Next.js app router uses file-based routing."},
        {"id": "2", "description": "Next.js server components reduce client bundle size."},
    ]
    result = extractive_summarize(snippets, max_points=5, mmr_lambda=1.0)
    assert len(result) >= 1


# ---------------------------------------------------------------------------
# Real-world-like cluster: 5 related React snippets
# ---------------------------------------------------------------------------

REACT_SNIPPETS = [
    {
        "id": "rc1",
        "description": (
            "useState returns a state value and a setter. "
            "Calling the setter triggers a re-render with the new value."
        ),
    },
    {
        "id": "rc2",
        "description": (
            "useEffect runs after every render by default. "
            "Pass a dependency array to control when it fires."
        ),
    },
    {
        "id": "rc3",
        "description": (
            "useContext provides global state without prop drilling. "
            "Wrap your tree in a Provider to supply the value."
        ),
    },
    {
        "id": "rc4",
        "description": (
            "useReducer is better than useState for complex state logic. "
            "Dispatch actions to a reducer function instead of calling setters."
        ),
    },
    {
        "id": "rc5",
        "description": (
            "useMemo caches expensive computed values between renders. "
            "Only recomputes when its dependency array changes."
        ),
    },
]


def test_react_cluster_returns_one_point_per_snippet():
    result = extractive_summarize(REACT_SNIPPETS, max_points=5)
    assert len(result) == 5


def test_react_cluster_all_source_ids_present():
    result = extractive_summarize(REACT_SNIPPETS, max_points=5)
    ids = {r["source_snippet_id"] for r in result}
    expected = {"rc1", "rc2", "rc3", "rc4", "rc5"}
    assert ids == expected


def test_react_cluster_points_are_non_empty_strings():
    result = extractive_summarize(REACT_SNIPPETS, max_points=5)
    for item in result:
        assert isinstance(item["point"], str)
        assert len(item["point"]) > 0
