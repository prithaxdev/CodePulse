"""Tests for the knowledge dependency graph algorithm."""

import pytest
from app.algorithms.graph import build_dependency_graph

# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

# Two React performance hooks — share "react", "memoiz", "performance" terms
REACT_CALLBACK = {
    "id": "s1",
    "title": "useCallback memoization hook",
    "code": "const cb = useCallback(() => doSomething(id), [id])",
    "description": "useCallback returns a memoized callback that only changes when dependencies change",
    "tags": ["react", "performance"],
    "created_at": "2024-01-01T00:00:00",
}

REACT_MEMO = {
    "id": "s2",
    "title": "useMemo for expensive computations",
    "code": "const value = useMemo(() => computeExpensive(data), [data])",
    "description": "useMemo memoizes computed values similar to useCallback memoization pattern",
    "tags": ["react", "performance"],
    "created_at": "2024-01-02T00:00:00",
}

# Unrelated snippet — CSS layout, no shared terms with React hooks
CSS_FLEXBOX = {
    "id": "s3",
    "title": "Flexbox centering layout",
    "code": "display: flex; justify-content: center; align-items: center;",
    "description": "Center elements vertically and horizontally using CSS flexbox layout",
    "tags": ["css", "layout"],
    "created_at": "2024-01-03T00:00:00",
}

# ---------------------------------------------------------------------------
# Basic correctness
# ---------------------------------------------------------------------------


def test_empty_list_returns_empty():
    assert build_dependency_graph([]) == []


def test_single_snippet_returns_empty():
    assert build_dependency_graph([REACT_CALLBACK]) == []


def test_related_snippets_have_higher_confidence_than_unrelated():
    """React-React pair should score higher than React-CSS pair."""
    edges = build_dependency_graph(
        [REACT_CALLBACK, REACT_MEMO, CSS_FLEXBOX],
        similarity_threshold=0.0,
    )
    edge_map = {(e["from_id"], e["to_id"]): e["confidence"] for e in edges}
    react_react = edge_map.get(("s1", "s2"), 0.0)
    react_css = max(
        edge_map.get(("s1", "s3"), 0.0),
        edge_map.get(("s2", "s3"), 0.0),
    )
    assert react_react > react_css


def test_threshold_filters_low_confidence_edges():
    """High threshold should produce fewer edges than low threshold."""
    low = build_dependency_graph(
        [REACT_CALLBACK, REACT_MEMO, CSS_FLEXBOX],
        similarity_threshold=0.0,
    )
    high = build_dependency_graph(
        [REACT_CALLBACK, REACT_MEMO, CSS_FLEXBOX],
        similarity_threshold=0.99,
    )
    assert len(low) >= len(high)


# ---------------------------------------------------------------------------
# Temporal ordering
# ---------------------------------------------------------------------------


def test_edge_direction_follows_created_at():
    """Earlier-saved snippet should be from_id (prerequisite)."""
    older = {**REACT_CALLBACK, "id": "old", "created_at": "2024-01-01T00:00:00"}
    newer = {**REACT_MEMO, "id": "new", "created_at": "2024-01-10T00:00:00"}

    edges = build_dependency_graph([newer, older], similarity_threshold=0.0)
    if edges:
        assert edges[0]["from_id"] == "old"
        assert edges[0]["to_id"] == "new"


def test_same_timestamp_no_crash():
    """Snippets with the same created_at should not raise an error."""
    s1 = {**REACT_CALLBACK, "created_at": "2024-01-01T00:00:00"}
    s2 = {**REACT_MEMO, "created_at": "2024-01-01T00:00:00"}
    result = build_dependency_graph([s1, s2], similarity_threshold=0.0)
    assert isinstance(result, list)


# ---------------------------------------------------------------------------
# Output structure
# ---------------------------------------------------------------------------


def test_edges_sorted_by_confidence_descending():
    snippets = [REACT_CALLBACK, REACT_MEMO, CSS_FLEXBOX]
    edges = build_dependency_graph(snippets, similarity_threshold=0.0)
    for i in range(len(edges) - 1):
        assert edges[i]["confidence"] >= edges[i + 1]["confidence"]


def test_edge_confidence_in_valid_range():
    edges = build_dependency_graph(
        [REACT_CALLBACK, REACT_MEMO, CSS_FLEXBOX],
        similarity_threshold=0.0,
    )
    for e in edges:
        assert 0.0 <= e["confidence"] <= 1.0


def test_edge_has_required_keys():
    edges = build_dependency_graph(
        [REACT_CALLBACK, REACT_MEMO],
        similarity_threshold=0.0,
    )
    for e in edges:
        assert "from_id" in e
        assert "to_id" in e
        assert "confidence" in e


def test_no_self_loops():
    edges = build_dependency_graph(
        [REACT_CALLBACK, REACT_MEMO, CSS_FLEXBOX],
        similarity_threshold=0.0,
    )
    for e in edges:
        assert e["from_id"] != e["to_id"]


# ---------------------------------------------------------------------------
# Missing fields graceful handling
# ---------------------------------------------------------------------------


def test_missing_optional_fields_no_crash():
    minimal = [
        {"id": "a", "title": "Python list comprehension", "created_at": "2024-01-01"},
        {"id": "b", "title": "Python dict comprehension", "created_at": "2024-01-02"},
    ]
    result = build_dependency_graph(minimal, similarity_threshold=0.0)
    assert isinstance(result, list)
