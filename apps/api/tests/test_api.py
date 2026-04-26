"""Integration tests for all 5 CodePulse API endpoints using FastAPI TestClient."""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

SNIPPETS = [
    {
        "id": "s1",
        "title": "useEffect hook",
        "code": "useEffect(() => { fetchData(); }, [id]);",
        "description": "Fetch data when component mounts or id changes.",
        "tags": ["react", "hooks"],
    },
    {
        "id": "s2",
        "title": "useState hook",
        "code": "const [count, setCount] = useState(0);",
        "description": "Manage local component state with useState.",
        "tags": ["react", "hooks", "state"],
    },
    {
        "id": "s3",
        "title": "Python list comprehension",
        "code": "evens = [x for x in range(10) if x % 2 == 0]",
        "description": "Filter even numbers using list comprehension.",
        "tags": ["python", "list"],
    },
    {
        "id": "s4",
        "title": "TypeScript interface",
        "code": "interface User { id: string; name: string; }",
        "description": "Define a User shape with TypeScript interface.",
        "tags": ["typescript", "types"],
    },
    {
        "id": "s5",
        "title": "CSS flexbox center",
        "code": "display: flex; justify-content: center; align-items: center;",
        "description": "Center an element with CSS flexbox.",
        "tags": ["css", "flexbox", "layout"],
    },
]


# ---------------------------------------------------------------------------
# GET /api/health
# ---------------------------------------------------------------------------


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert "version" in body


# ---------------------------------------------------------------------------
# POST /api/review/schedule
# ---------------------------------------------------------------------------


def test_review_schedule_easy_rating():
    """Easy rating (5) should advance the interval and increase ease factor."""
    response = client.post(
        "/api/review/schedule",
        json={
            "snippet_id": "s1",
            "rating": 5,
            "current_ease": 2.5,
            "current_interval": 1,
            "current_reps": 0,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["snippet_id"] == "s1"
    assert body["interval_days"] >= 1
    assert body["ease_factor"] >= 2.5
    assert body["repetitions"] == 1
    # next_review should be a valid ISO date
    assert len(body["next_review"]) == 10
    assert body["next_review"][4] == "-"


def test_review_schedule_forgot_rating():
    """Rating 0 (forgot) should reset interval to 1 and repetitions to 0."""
    response = client.post(
        "/api/review/schedule",
        json={
            "snippet_id": "s2",
            "rating": 0,
            "current_ease": 2.5,
            "current_interval": 6,
            "current_reps": 2,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["interval_days"] == 1
    assert body["repetitions"] == 0


def test_review_schedule_third_review_grows_interval():
    """Third review (reps=2) should multiply interval by ease factor."""
    response = client.post(
        "/api/review/schedule",
        json={
            "snippet_id": "s3",
            "rating": 5,
            "current_ease": 2.5,
            "current_interval": 6,
            "current_reps": 2,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["interval_days"] == round(6 * 2.5)


def test_review_schedule_invalid_rating():
    """Rating outside 0-5 should return 422."""
    response = client.post(
        "/api/review/schedule",
        json={
            "snippet_id": "s1",
            "rating": 6,
            "current_ease": 2.5,
            "current_interval": 1,
            "current_reps": 0,
        },
    )
    assert response.status_code == 422


def test_review_schedule_invalid_ease():
    """ease_factor below 1.3 should return 422."""
    response = client.post(
        "/api/review/schedule",
        json={
            "snippet_id": "s1",
            "rating": 3,
            "current_ease": 1.0,
            "current_interval": 1,
            "current_reps": 0,
        },
    )
    assert response.status_code == 422


# ---------------------------------------------------------------------------
# POST /api/search
# ---------------------------------------------------------------------------


def test_search_returns_results():
    """Searching for 'react hooks' should return React-related snippets first."""
    response = client.post(
        "/api/search",
        json={"query": "react hooks component", "snippets": SNIPPETS},
    )
    assert response.status_code == 200
    body = response.json()
    assert "results" in body
    assert len(body["results"]) > 0
    # React snippets (s1, s2) should appear in results
    result_ids = [r["snippet_id"] for r in body["results"]]
    assert "s1" in result_ids or "s2" in result_ids


def test_search_scores_between_0_and_1():
    """All similarity scores must be in [0.0, 1.0]."""
    response = client.post(
        "/api/search",
        json={"query": "python list", "snippets": SNIPPETS},
    )
    assert response.status_code == 200
    for result in response.json()["results"]:
        assert 0.0 <= result["similarity_score"] <= 1.0


def test_search_empty_snippets():
    """Empty snippet list should return empty results."""
    response = client.post(
        "/api/search",
        json={"query": "react", "snippets": []},
    )
    assert response.status_code == 200
    assert response.json()["results"] == []


def test_search_no_matching_results():
    """A query with no relevant terms should return no results (all scores 0)."""
    response = client.post(
        "/api/search",
        json={"query": "xyzzy foobar", "snippets": SNIPPETS},
    )
    assert response.status_code == 200
    # All scores 0 → results list is empty (we filter out 0-score results)
    assert response.json()["results"] == []


# ---------------------------------------------------------------------------
# POST /api/clusters
# ---------------------------------------------------------------------------


def test_clusters_returns_groups():
    """5 snippets should produce at least 1 cluster."""
    response = client.post("/api/clusters", json={"snippets": SNIPPETS})
    assert response.status_code == 200
    body = response.json()
    assert "clusters" in body
    assert len(body["clusters"]) >= 1


def test_clusters_cover_all_snippets():
    """Every snippet should appear in exactly one cluster."""
    response = client.post("/api/clusters", json={"snippets": SNIPPETS})
    assert response.status_code == 200
    all_ids = []
    for cluster in response.json()["clusters"]:
        assert len(cluster["top_terms"]) > 0
        assert cluster["label"] != ""
        all_ids.extend(cluster["snippet_ids"])
    assert sorted(all_ids) == sorted(s["id"] for s in SNIPPETS)


def test_clusters_empty_snippets():
    """Empty snippet list should return empty clusters."""
    response = client.post("/api/clusters", json={"snippets": []})
    assert response.status_code == 200
    assert response.json()["clusters"] == []


# ---------------------------------------------------------------------------
# POST /api/snippets/check-duplicate
# ---------------------------------------------------------------------------


EXISTING = [
    {"id": "e1", "code": "const x = arr.map(n => n * 2);"},
    {"id": "e2", "code": "function add(a, b) { return a + b; }"},
]


def test_duplicate_detects_identical():
    """Identical code should be flagged as duplicate with similarity 1.0."""
    response = client.post(
        "/api/snippets/check-duplicate",
        json={
            "new_code": "const x = arr.map(n => n * 2);",
            "existing_snippets": EXISTING,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["is_duplicate"] is True
    assert any(m["id"] == "e1" and m["similarity"] == 1.0 for m in body["matches"])


def test_duplicate_misses_unrelated():
    """Completely different code should not be flagged."""
    response = client.post(
        "/api/snippets/check-duplicate",
        json={
            "new_code": "SELECT * FROM users WHERE active = TRUE;",
            "existing_snippets": EXISTING,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["is_duplicate"] is False
    assert body["matches"] == []


def test_duplicate_catches_renamed_variables():
    """Code with only variable names changed should still exceed the 85% threshold."""
    response = client.post(
        "/api/snippets/check-duplicate",
        json={
            "new_code": "const y = arr.map(n => n * 2);",  # x → y
            "existing_snippets": EXISTING,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["is_duplicate"] is True


def test_duplicate_empty_existing():
    """No existing snippets → no duplicates."""
    response = client.post(
        "/api/snippets/check-duplicate",
        json={"new_code": "const x = 1;", "existing_snippets": []},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["is_duplicate"] is False
    assert body["matches"] == []


# ---------------------------------------------------------------------------
# POST /api/summarize
# ---------------------------------------------------------------------------


SUMMARIZE_SNIPPETS = [
    {
        "id": "t1",
        "description": "React useEffect runs side effects after render. It replaces componentDidMount and componentDidUpdate.",
        "notes": "Use cleanup function to avoid memory leaks.",
    },
    {
        "id": "t2",
        "description": "useState returns a state variable and a setter function. React re-renders the component when state changes.",
        "notes": "Always use the setter, never mutate state directly.",
    },
    {
        "id": "t3",
        "description": "useCallback memoizes a callback function. Prevents unnecessary re-renders of child components.",
        "notes": "Wrap handlers passed as props to child components.",
    },
]


def test_summarize_returns_thread_points():
    """Summarizer should return one thread point per snippet."""
    response = client.post("/api/summarize", json={"snippets": SUMMARIZE_SNIPPETS})
    assert response.status_code == 200
    body = response.json()
    assert "thread_draft" in body
    assert len(body["thread_draft"]) == len(SUMMARIZE_SNIPPETS)


def test_summarize_links_source_ids():
    """Each thread point must have a valid source_snippet_id."""
    response = client.post("/api/summarize", json={"snippets": SUMMARIZE_SNIPPETS})
    assert response.status_code == 200
    valid_ids = {s["id"] for s in SUMMARIZE_SNIPPETS}
    for point in response.json()["thread_draft"]:
        assert point["source_snippet_id"] in valid_ids
        assert point["point"] != ""


def test_summarize_empty_snippets():
    """Empty snippet list should return empty thread draft."""
    response = client.post("/api/summarize", json={"snippets": []})
    assert response.status_code == 200
    assert response.json()["thread_draft"] == []
