"""Knowledge Dependency Graph — builds directed edges between related snippets.

Reuses existing TF-IDF + cosine similarity. The novelty is the graph layer:
edges point from earlier-saved (prerequisite) to later-saved (dependent).
"""

from .tfidf import TFIDFEngine
from .similarity import cosine_similarity


def _snippet_text(snippet: dict) -> str:
    parts = [
        snippet.get("title", "") or "",
        snippet.get("code", "") or "",
        snippet.get("description", "") or "",
        " ".join(snippet.get("tags", [])),
    ]
    return " ".join(p for p in parts if p)


def build_dependency_graph(
    snippets: list[dict],
    similarity_threshold: float = 0.08,
) -> list[dict]:
    """Build a knowledge dependency graph from a list of snippets.

    Edges are directed: from_id is a prerequisite of to_id.
    Direction is determined by created_at timestamp (earlier = prerequisite).
    Only pairs whose cosine similarity exceeds the threshold get an edge.

    Args:
        snippets: List of dicts with keys: id, title, code, description, tags, created_at.
        similarity_threshold: Minimum cosine similarity to create an edge (default 0.25).

    Returns:
        List of edge dicts [{from_id, to_id, confidence}] sorted by confidence descending.
    """
    if len(snippets) < 2:
        return []

    sorted_snippets = sorted(snippets, key=lambda s: s.get("created_at", ""))

    documents = [_snippet_text(s) for s in sorted_snippets]

    engine = TFIDFEngine()
    engine.fit(documents)
    vectors = engine.vectorize_corpus()

    edges: list[dict] = []
    n = len(sorted_snippets)
    for i in range(n):
        for j in range(i + 1, n):
            sim = cosine_similarity(vectors[i], vectors[j])
            if sim >= similarity_threshold:
                edges.append({
                    "from_id": sorted_snippets[i]["id"],
                    "to_id": sorted_snippets[j]["id"],
                    "confidence": round(sim, 4),
                })

    return sorted(edges, key=lambda e: e["confidence"], reverse=True)
