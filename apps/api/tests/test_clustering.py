"""Tests for K-Means clustering over TF-IDF vectors."""

import json
import os

import pytest

from app.algorithms.clustering import KMeansClusterer, auto_k, _mean_vector
from app.algorithms.tfidf import TFIDFEngine


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_engine_and_vecs(docs: list[str]) -> tuple[TFIDFEngine, list[dict]]:
    engine = TFIDFEngine()
    engine.fit(docs)
    return engine, engine.vectorize_corpus()


def _load_snippets() -> list[dict]:
    fixture_path = os.path.join(os.path.dirname(__file__), "fixtures", "sample_snippets.json")
    with open(fixture_path) as f:
        return json.load(f)


def _snippet_to_doc(snippet: dict) -> str:
    tags = " ".join(snippet.get("tags", []))
    return " ".join([
        snippet.get("title", ""),
        snippet.get("description", ""),
        snippet.get("language", ""),
        tags,
        snippet.get("code", ""),
    ])


# ---------------------------------------------------------------------------
# _mean_vector
# ---------------------------------------------------------------------------

def test_mean_vector_empty_list():
    assert _mean_vector([]) == {}


def test_mean_vector_single():
    vec = {"a": 0.5, "b": 1.0}
    result = _mean_vector([vec])
    assert result == pytest.approx({"a": 0.5, "b": 1.0})


def test_mean_vector_averages_correctly():
    vecs = [{"x": 2.0, "y": 4.0}, {"x": 4.0, "y": 0.0}]
    result = _mean_vector(vecs)
    assert result["x"] == pytest.approx(3.0)
    assert result["y"] == pytest.approx(2.0)


# ---------------------------------------------------------------------------
# auto_k
# ---------------------------------------------------------------------------

def test_auto_k_minimum_is_3():
    assert auto_k(0) == 3
    assert auto_k(1) == 3
    assert auto_k(10) == 3
    assert auto_k(23) == 3


def test_auto_k_scales_with_snippets():
    assert auto_k(24) == 3
    assert auto_k(50) == 6
    assert auto_k(80) == 10


# ---------------------------------------------------------------------------
# KMeansClusterer.fit — basic contract
# ---------------------------------------------------------------------------

def test_fit_returns_one_assignment_per_vector():
    docs = ["python loop", "react hook", "typescript type", "python dict", "react state"]
    _, vecs = _make_engine_and_vecs(docs)
    clusterer = KMeansClusterer(random_seed=0)
    assignments = clusterer.fit(vecs, k=2)
    assert len(assignments) == len(vecs)


def test_fit_assignment_indices_within_range():
    docs = ["alpha beta gamma", "delta epsilon zeta", "eta theta iota"]
    _, vecs = _make_engine_and_vecs(docs)
    k = 2
    clusterer = KMeansClusterer(random_seed=0)
    assignments = clusterer.fit(vecs, k=k)
    assert all(0 <= a < k for a in assignments)


def test_fit_single_snippet_does_not_crash():
    docs = ["const x = useState(null);"]
    _, vecs = _make_engine_and_vecs(docs)
    clusterer = KMeansClusterer(random_seed=0)
    assignments = clusterer.fit(vecs, k=3)  # k > n — should clamp to 1
    assert assignments == [0]


def test_fit_k_clamped_to_num_vectors():
    docs = ["alpha", "beta"]
    _, vecs = _make_engine_and_vecs(docs)
    clusterer = KMeansClusterer(random_seed=0)
    assignments = clusterer.fit(vecs, k=100)
    assert len(clusterer.centroids) == 2  # clamped to n=2


def test_fit_empty_vectors_returns_empty():
    clusterer = KMeansClusterer(random_seed=0)
    assignments = clusterer.fit([], k=3)
    assert assignments == []


# ---------------------------------------------------------------------------
# 3 obvious groups cluster correctly
# ---------------------------------------------------------------------------

# Three clearly distinct topic groups — no overlap in vocabulary.
PYTHON_DOCS = [
    "python list comprehension loop iterate",
    "python dictionary hash map get keys",
    "python function def lambda return args",
    "python class object init self inherit",
]
REACT_DOCS = [
    "react useState hook component state",
    "react useEffect lifecycle mount side effect",
    "react props children render component tree",
    "react context provider consumer global state",
]
SQL_DOCS = [
    "sql select from where join table",
    "sql insert update delete row record",
    "sql index primary key foreign constraint",
    "sql aggregate group having count sum",
]


def _majority_cluster(assignments: list[int]) -> int:
    """Return the most common cluster id in a list of assignments."""
    return max(set(assignments), key=assignments.count)


def test_three_obvious_groups_cluster_correctly():
    """Each clearly-distinct topic group should land mostly in one cluster.

    K-means with random init can occasionally misplace one doc, so we use
    majority voting: at least 3 of 4 docs in each group must share a cluster,
    and the three majority clusters must all be distinct.
    """
    docs = PYTHON_DOCS + REACT_DOCS + SQL_DOCS
    engine = TFIDFEngine()
    engine.fit(docs)
    vecs = engine.vectorize_corpus()

    # seed=0 gives perfect separation on these docs (verified manually)
    clusterer = KMeansClusterer(random_seed=0)
    assignments = clusterer.fit(vecs, k=3)

    # Indices 0-3 → Python, 4-7 → React, 8-11 → SQL
    python_a = assignments[0:4]
    react_a = assignments[4:8]
    sql_a = assignments[8:12]

    python_majority = _majority_cluster(python_a)
    react_majority = _majority_cluster(react_a)
    sql_majority = _majority_cluster(sql_a)

    # At least 3 of 4 docs per group must agree on the same cluster
    assert python_a.count(python_majority) >= 3, f"Python split badly: {python_a}"
    assert react_a.count(react_majority) >= 3, f"React split badly: {react_a}"
    assert sql_a.count(sql_majority) >= 3, f"SQL split badly: {sql_a}"

    # The three majority clusters must all be distinct
    majority_set = {python_majority, react_majority, sql_majority}
    assert len(majority_set) == 3, f"Groups share clusters — majorities: {majority_set}"


def test_labels_contain_relevant_terms():
    docs = PYTHON_DOCS + REACT_DOCS + SQL_DOCS
    engine = TFIDFEngine()
    engine.fit(docs)
    vecs = engine.vectorize_corpus()

    clusterer = KMeansClusterer(random_seed=0)
    assignments = clusterer.fit(vecs, k=3)
    labels = clusterer.get_cluster_labels(top_n_terms=3)

    # Flatten all label terms per group and check relevant tokens appear
    python_cluster_id = assignments[0]
    react_cluster_id = assignments[4]
    sql_cluster_id = assignments[8]

    python_terms = set(labels[python_cluster_id])
    react_terms = set(labels[react_cluster_id])
    sql_terms = set(labels[sql_cluster_id])

    assert python_terms & {"python", "list", "dict", "loop", "function", "class", "lambda"}
    assert react_terms & {"react", "hook", "state", "component", "usestate", "useeffect"}
    assert sql_terms & {"sql", "select", "table", "index", "insert", "aggregate", "join"}


# ---------------------------------------------------------------------------
# Convergence
# ---------------------------------------------------------------------------

def test_converges_within_100_iterations():
    docs = PYTHON_DOCS + REACT_DOCS + SQL_DOCS
    _, vecs = _make_engine_and_vecs(docs)
    clusterer = KMeansClusterer(max_iterations=100, random_seed=7)
    clusterer.fit(vecs, k=3)
    assert clusterer.iterations_run <= 100


def test_converges_quickly_on_clear_groups():
    """Well-separated data should converge in far fewer than 100 iterations."""
    docs = PYTHON_DOCS + REACT_DOCS + SQL_DOCS
    _, vecs = _make_engine_and_vecs(docs)
    clusterer = KMeansClusterer(random_seed=42)
    clusterer.fit(vecs, k=3)
    assert clusterer.iterations_run < 30


# ---------------------------------------------------------------------------
# predict
# ---------------------------------------------------------------------------

def test_predict_before_fit_raises():
    clusterer = KMeansClusterer()
    with pytest.raises(RuntimeError):
        clusterer.predict({"some": 1.0})


def test_predict_new_vector_lands_in_correct_cluster():
    docs = PYTHON_DOCS + REACT_DOCS + SQL_DOCS
    engine = TFIDFEngine()
    engine.fit(docs)
    vecs = engine.vectorize_corpus()

    clusterer = KMeansClusterer(random_seed=42)
    assignments = clusterer.fit(vecs, k=3)

    react_cluster_id = assignments[4]  # first React doc's cluster

    new_vec = engine.vectorize("react useState component hook render")
    predicted = clusterer.predict(new_vec)
    assert predicted == react_cluster_id


# ---------------------------------------------------------------------------
# get_cluster_labels
# ---------------------------------------------------------------------------

def test_get_cluster_labels_before_fit_raises():
    clusterer = KMeansClusterer()
    with pytest.raises(RuntimeError):
        clusterer.get_cluster_labels()


def test_get_cluster_labels_returns_correct_count():
    docs = PYTHON_DOCS + REACT_DOCS + SQL_DOCS
    _, vecs = _make_engine_and_vecs(docs)
    clusterer = KMeansClusterer(random_seed=42)
    clusterer.fit(vecs, k=3)
    labels = clusterer.get_cluster_labels(top_n_terms=5)
    assert len(labels) == 3
    for cluster_labels in labels:
        assert len(cluster_labels) <= 5  # could be < 5 if centroid has few terms


# ---------------------------------------------------------------------------
# Full 50-snippet seed dataset
# ---------------------------------------------------------------------------

def test_full_seed_dataset_does_not_crash():
    snippets = _load_snippets()
    docs = [_snippet_to_doc(s) for s in snippets]
    engine = TFIDFEngine()
    engine.fit(docs)
    vecs = engine.vectorize_corpus()

    k = auto_k(len(snippets))
    clusterer = KMeansClusterer(random_seed=0)
    assignments = clusterer.fit(vecs, k=k)

    assert len(assignments) == len(snippets)
    assert all(0 <= a < k for a in assignments)


def test_full_seed_dataset_labels_are_non_empty():
    snippets = _load_snippets()
    docs = [_snippet_to_doc(s) for s in snippets]
    engine = TFIDFEngine()
    engine.fit(docs)
    vecs = engine.vectorize_corpus()

    k = auto_k(len(snippets))
    clusterer = KMeansClusterer(random_seed=0)
    clusterer.fit(vecs, k=k)
    labels = clusterer.get_cluster_labels(top_n_terms=3)

    assert len(labels) == k
    for cluster_labels in labels:
        assert len(cluster_labels) > 0


def test_full_seed_dataset_converges_within_100_iterations():
    snippets = _load_snippets()
    docs = [_snippet_to_doc(s) for s in snippets]
    _, vecs = _make_engine_and_vecs(docs)

    k = auto_k(len(snippets))
    clusterer = KMeansClusterer(max_iterations=100, random_seed=0)
    clusterer.fit(vecs, k=k)

    assert clusterer.iterations_run <= 100


def test_full_seed_dataset_produces_multiple_non_empty_clusters():
    snippets = _load_snippets()
    docs = [_snippet_to_doc(s) for s in snippets]
    _, vecs = _make_engine_and_vecs(docs)

    k = auto_k(len(snippets))
    clusterer = KMeansClusterer(random_seed=0)
    assignments = clusterer.fit(vecs, k=k)

    # Every cluster id 0..k-1 should have at least one member
    occupied = set(assignments)
    assert len(occupied) == k, f"Only {len(occupied)} of {k} clusters are non-empty"
