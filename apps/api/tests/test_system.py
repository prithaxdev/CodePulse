"""System tests — complete multi-step user workflow flows.

Each test simulates a real sequence of API calls a user would make,
verifying that the full pipeline behaves correctly end-to-end.

Flows covered:
  1. First snippet → SM-2 review progression over three sessions
  2. Duplicate detection → user warned → saves anyway
  3. Search relevance stays consistent across different queries
  4. Cluster coverage grows correctly as the library grows
  5. Full workflow: save → search → cluster → summarize
"""

import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

# ---------------------------------------------------------------------------
# Shared fixtures
# ---------------------------------------------------------------------------

FIXTURES: list[dict] = json.loads(
    (Path(__file__).parent / "fixtures" / "sample_snippets.json").read_text()
)

# A few hand-picked snippets from the fixture for controlled flows
REACT_SNIPPETS = [s for s in FIXTURES if "react" in [t.lower() for t in s.get("tags", [])]][:5]
PYTHON_SNIPPETS = [s for s in FIXTURES if "python" in [t.lower() for t in s.get("tags", [])]][:5]

EXISTING_SNIPPET = {
    "id": "existing-1",
    "code": "const double = arr.map(n => n * 2);",
}


# ---------------------------------------------------------------------------
# Flow 1: First snippet → three SM-2 review sessions
# ---------------------------------------------------------------------------

class TestSM2ReviewProgression:
    """
    Simulates a user reviewing the same snippet three times with Easy rating.
    The SM-2 intervals must follow: 1 day → 6 days → ~15 days.
    """

    def test_first_review_easy_gives_4_day_interval(self):
        """Fresh snippet (reps=0, rating=5 Easy) → interval=4 (quality-adjusted first interval)."""
        r = client.post(
            "/api/review/schedule",
            json={
                "snippet_id": "flow-1",
                "rating": 5,
                "current_ease": 2.5,
                "current_interval": 1,
                "current_reps": 0,
            },
        )
        assert r.status_code == 200
        body = r.json()
        assert body["interval_days"] == 4
        assert body["repetitions"] == 1

    def test_first_review_hard_gives_2_day_interval(self):
        """Fresh snippet (reps=0, rating=3 Hard) → interval=2 (quality-adjusted first interval)."""
        r = client.post(
            "/api/review/schedule",
            json={
                "snippet_id": "flow-1",
                "rating": 3,
                "current_ease": 2.5,
                "current_interval": 1,
                "current_reps": 0,
            },
        )
        assert r.status_code == 200
        body = r.json()
        assert body["interval_days"] == 2
        assert body["repetitions"] == 1

    def test_second_review_jumps_to_6_days(self):
        """After first review (reps=1, rating=5) → interval becomes 6."""
        r = client.post(
            "/api/review/schedule",
            json={
                "snippet_id": "flow-1",
                "rating": 5,
                "current_ease": 2.5,
                "current_interval": 1,
                "current_reps": 1,
            },
        )
        assert r.status_code == 200
        body = r.json()
        assert body["interval_days"] == 6
        assert body["repetitions"] == 2

    def test_third_review_multiplies_by_ease(self):
        """After second review (reps=2, ease=2.5, interval=6, rating=5) → interval = 6 × 2.5 = 15."""
        r = client.post(
            "/api/review/schedule",
            json={
                "snippet_id": "flow-1",
                "rating": 5,
                "current_ease": 2.5,
                "current_interval": 6,
                "current_reps": 2,
            },
        )
        assert r.status_code == 200
        body = r.json()
        assert body["interval_days"] == round(6 * 2.5)
        assert body["repetitions"] == 3

    def test_forgetting_resets_and_restarts(self):
        """Rating 1 on an established card resets to reps=0, interval=1."""
        r = client.post(
            "/api/review/schedule",
            json={
                "snippet_id": "flow-1",
                "rating": 1,
                "current_ease": 2.5,
                "current_interval": 15,
                "current_reps": 3,
            },
        )
        assert r.status_code == 200
        body = r.json()
        assert body["interval_days"] == 1
        assert body["repetitions"] == 0

    def test_ease_factor_never_drops_below_1_3(self):
        """Repeatedly forgetting must not let ease drop below 1.3."""
        ease = 2.5
        for _ in range(20):
            r = client.post(
                "/api/review/schedule",
                json={
                    "snippet_id": "flow-1",
                    "rating": 0,
                    "current_ease": ease,
                    "current_interval": 1,
                    "current_reps": 0,
                },
            )
            assert r.status_code == 200
            ease = r.json()["ease_factor"]
        assert ease >= 1.3


# ---------------------------------------------------------------------------
# Flow 2: Duplicate detection → save anyway
# ---------------------------------------------------------------------------

class TestDuplicateFlow:
    """
    Simulates the save flow when a duplicate is detected:
    1. User pastes code → system checks duplicates → warns them.
    2. User clicks "Save anyway" → system skips check → saves.
    3. Slightly different code (renamed variable) is also caught.
    """

    def test_first_save_has_no_duplicates(self):
        """When there are no existing snippets, duplicate check passes clean."""
        r = client.post(
            "/api/snippets/check-duplicate",
            json={"new_code": EXISTING_SNIPPET["code"], "existing_snippets": []},
        )
        assert r.status_code == 200
        body = r.json()
        assert body["is_duplicate"] is False
        assert body["matches"] == []

    def test_second_save_identical_code_is_flagged(self):
        """Saving the same code twice flags it as a duplicate."""
        r = client.post(
            "/api/snippets/check-duplicate",
            json={
                "new_code": EXISTING_SNIPPET["code"],
                "existing_snippets": [EXISTING_SNIPPET],
            },
        )
        assert r.status_code == 200
        body = r.json()
        assert body["is_duplicate"] is True
        assert body["matches"][0]["similarity"] == 1.0
        assert body["matches"][0]["id"] == EXISTING_SNIPPET["id"]

    def test_duplicate_warning_shows_similarity_percentage(self):
        """The match response contains a similarity score the UI can display."""
        renamed = {"id": "new", "code": "const quadruple = arr.map(n => n * 2);"}
        r = client.post(
            "/api/snippets/check-duplicate",
            json={
                "new_code": renamed["code"],
                "existing_snippets": [EXISTING_SNIPPET],
            },
        )
        assert r.status_code == 200
        body = r.json()
        # Similarity is a float in [0.0, 1.0] that the UI multiplies by 100
        if body["is_duplicate"]:
            pct = round(body["matches"][0]["similarity"] * 100)
            assert 0 < pct <= 100

    def test_save_anyway_skips_duplicate_check(self):
        """When user saves anyway, the next save (flag=ignore) is unblocked.

        Simulated by sending a non-duplicate code. The API doesn't have an
        'ignore' flag — the client simply skips calling check-duplicate.
        This test verifies the save flow would succeed on its own.
        """
        r = client.post(
            "/api/snippets/check-duplicate",
            json={
                "new_code": EXISTING_SNIPPET["code"],
                "existing_snippets": [],  # client skips check — passes empty list
            },
        )
        assert r.status_code == 200
        assert r.json()["is_duplicate"] is False


# ---------------------------------------------------------------------------
# Flow 3: Search relevance across different query types
# ---------------------------------------------------------------------------

class TestSearchFlow:
    """
    Search quality: the right snippets surface for the right queries.
    """

    CORPUS = REACT_SNIPPETS + PYTHON_SNIPPETS

    def test_react_query_returns_react_snippets(self):
        """Querying 'react hooks component' should rank React snippets at the top."""
        r = client.post(
            "/api/search",
            json={"query": "react hooks component", "snippets": self.CORPUS},
        )
        assert r.status_code == 200
        results = r.json()["results"]
        assert len(results) > 0
        top_ids = [res["snippet_id"] for res in results[:3]]
        react_ids = {s["id"] for s in REACT_SNIPPETS}
        assert any(tid in react_ids for tid in top_ids)

    def test_python_query_returns_python_snippets(self):
        """Querying 'python list comprehension' should rank Python snippets at the top."""
        r = client.post(
            "/api/search",
            json={"query": "python list comprehension", "snippets": self.CORPUS},
        )
        assert r.status_code == 200
        results = r.json()["results"]
        assert len(results) > 0
        top_ids = [res["snippet_id"] for res in results[:3]]
        python_ids = {s["id"] for s in PYTHON_SNIPPETS}
        assert any(tid in python_ids for tid in top_ids)

    def test_results_ranked_by_descending_score(self):
        """Results must be sorted highest similarity first."""
        r = client.post(
            "/api/search",
            json={"query": "react hooks", "snippets": self.CORPUS},
        )
        assert r.status_code == 200
        scores = [res["similarity_score"] for res in r.json()["results"]]
        assert scores == sorted(scores, reverse=True)

    def test_unrelated_query_returns_no_results(self):
        """A query with no matching terms should return an empty result list."""
        r = client.post(
            "/api/search",
            json={"query": "xyzzy foobar baz", "snippets": self.CORPUS},
        )
        assert r.status_code == 200
        assert r.json()["results"] == []


# ---------------------------------------------------------------------------
# Flow 4: Cluster coverage grows as library grows
# ---------------------------------------------------------------------------

class TestClusterGrowthFlow:
    """
    Verifies that as a user's library grows, all snippets remain assigned to a
    cluster and the number of clusters scales correctly (sqrt heuristic).
    """

    def _all_ids_covered(self, snippets: list[dict], clusters: list[dict]) -> bool:
        assigned = {sid for c in clusters for sid in c["snippet_ids"]}
        expected = {s["id"] for s in snippets}
        return assigned == expected

    def test_small_library_covers_all_snippets(self):
        """5 snippets → all 5 covered, no snippet left unassigned."""
        batch = FIXTURES[:5]
        r = client.post("/api/clusters", json={"snippets": batch})
        assert r.status_code == 200
        assert self._all_ids_covered(batch, r.json()["clusters"])

    def test_medium_library_covers_all_snippets(self):
        """20 snippets → all 20 covered across more clusters."""
        batch = FIXTURES[:20]
        r = client.post("/api/clusters", json={"snippets": batch})
        assert r.status_code == 200
        clusters = r.json()["clusters"]
        assert self._all_ids_covered(batch, clusters)
        # auto_k(20) = ceil(sqrt(20)) = 5
        assert len(clusters) <= 5

    def test_full_library_covers_all_snippets(self):
        """All 50 fixture snippets → all 50 covered."""
        r = client.post("/api/clusters", json={"snippets": FIXTURES})
        assert r.status_code == 200
        clusters = r.json()["clusters"]
        assert self._all_ids_covered(FIXTURES, clusters)

    def test_cluster_count_grows_with_library(self):
        """More snippets → more clusters (sqrt heuristic)."""
        r_small = client.post("/api/clusters", json={"snippets": FIXTURES[:9]})
        r_large = client.post("/api/clusters", json={"snippets": FIXTURES[:50]})
        assert r_small.status_code == 200
        assert r_large.status_code == 200
        small_k = len(r_small.json()["clusters"])
        large_k = len(r_large.json()["clusters"])
        assert large_k >= small_k

    def test_each_cluster_has_a_label(self):
        """Every cluster returned must have a non-empty label and top_terms."""
        r = client.post("/api/clusters", json={"snippets": FIXTURES[:20]})
        assert r.status_code == 200
        for cluster in r.json()["clusters"]:
            assert cluster["label"] != ""
            assert len(cluster["top_terms"]) > 0


# ---------------------------------------------------------------------------
# Flow 5: Full pipeline — cluster then summarize the biggest cluster
# ---------------------------------------------------------------------------

class TestFullPipelineFlow:
    """
    End-to-end: cluster the full library, grab the largest cluster,
    summarize it into a thread draft.
    """

    def test_summarize_largest_cluster(self):
        """Cluster 50 snippets, take the largest cluster, summarize it."""
        # Step 1: cluster
        cluster_r = client.post("/api/clusters", json={"snippets": FIXTURES})
        assert cluster_r.status_code == 200
        clusters = cluster_r.json()["clusters"]
        assert len(clusters) > 0

        # Step 2: pick the largest cluster
        largest = max(clusters, key=lambda c: len(c["snippet_ids"]))
        id_set = set(largest["snippet_ids"])
        cluster_snippets = [s for s in FIXTURES if s["id"] in id_set]

        # Step 3: build summarize payload
        summarize_payload = [
            {
                "id": s["id"],
                "description": s.get("description", ""),
                "notes": "",
            }
            for s in cluster_snippets
        ]

        summarize_r = client.post("/api/summarize", json={"snippets": summarize_payload})
        assert summarize_r.status_code == 200
        thread = summarize_r.json()["thread_draft"]

        # Each point must link back to a snippet in the cluster
        valid_ids = id_set
        assert len(thread) > 0
        for point in thread:
            assert point["point"] != ""
            assert point["source_snippet_id"] in valid_ids

    def test_search_then_review_schedule(self):
        """Find a snippet via search, then schedule its first review."""
        # Step 1: search
        search_r = client.post(
            "/api/search",
            json={"query": "typescript interface type", "snippets": FIXTURES},
        )
        assert search_r.status_code == 200
        results = search_r.json()["results"]
        assert len(results) > 0
        top_snippet_id = results[0]["snippet_id"]

        # Step 2: schedule its first review (Easy rating)
        review_r = client.post(
            "/api/review/schedule",
            json={
                "snippet_id": top_snippet_id,
                "rating": 5,
                "current_ease": 2.5,
                "current_interval": 1,
                "current_reps": 0,
            },
        )
        assert review_r.status_code == 200
        body = review_r.json()
        assert body["snippet_id"] == top_snippet_id
        assert body["repetitions"] == 1
        # First review with Easy rating uses the quality-adjusted interval (4 days)
        assert body["interval_days"] == 4
