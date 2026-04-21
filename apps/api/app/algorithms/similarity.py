"""Cosine similarity for sparse TF-IDF vectors — implemented from scratch.

Reference: Salton, G. & Buckley, C. (1988). Term-weighting approaches in
automatic text retrieval. Information Processing & Management, 24(5), 513–523.
"""

import math


def cosine_similarity(vec_a: dict[str, float], vec_b: dict[str, float]) -> float:
    """Compute cosine similarity between two sparse TF-IDF vectors.

    similarity = dot_product(A, B) / (magnitude(A) × magnitude(B))

    Args:
        vec_a: Sparse TF-IDF vector as a dict mapping term → weight.
        vec_b: Sparse TF-IDF vector as a dict mapping term → weight.

    Returns:
        Similarity score in [0.0, 1.0]. Returns 0.0 if either vector is empty.
    """
    if not vec_a or not vec_b:
        return 0.0

    # Dot product — only iterate over the smaller vector's terms
    dot = sum(vec_a[term] * vec_b[term] for term in vec_a if term in vec_b)

    if dot == 0.0:
        return 0.0

    mag_a = math.sqrt(sum(w * w for w in vec_a.values()))
    mag_b = math.sqrt(sum(w * w for w in vec_b.values()))

    if mag_a == 0.0 or mag_b == 0.0:
        return 0.0

    return dot / (mag_a * mag_b)


def rank_by_similarity(
    query_vec: dict[str, float],
    corpus_vecs: list[dict[str, float]],
    snippet_ids: list[str],
) -> list[tuple[str, float]]:
    """Rank corpus documents by similarity to a query vector.

    Args:
        query_vec: TF-IDF vector for the search query.
        corpus_vecs: TF-IDF vectors for each document in the corpus.
        snippet_ids: IDs corresponding to each corpus vector (same order).

    Returns:
        List of (snippet_id, score) tuples sorted descending by similarity.
    """
    scores = [
        (snippet_id, cosine_similarity(query_vec, doc_vec))
        for snippet_id, doc_vec in zip(snippet_ids, corpus_vecs)
    ]
    return sorted(scores, key=lambda x: x[1], reverse=True)
