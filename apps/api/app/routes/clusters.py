"""POST /api/clusters — K-means clustering of snippets into topic groups."""

from fastapi import APIRouter

from app.algorithms.tfidf import TFIDFEngine
from app.algorithms.clustering import KMeansClusterer, auto_k
from app.models.schemas import ClustersRequest, ClustersResponse, ClusterItem

router = APIRouter()


def _snippet_text(snippet) -> str:
    """Concatenate all text fields of a snippet into a single document string."""
    parts = [
        snippet.title,
        snippet.code,
        snippet.description,
        " ".join(snippet.tags),
    ]
    return " ".join(p for p in parts if p)


@router.post("/api/clusters", response_model=ClustersResponse)
def cluster_snippets(body: ClustersRequest) -> ClustersResponse:
    """Auto-group snippets into topic clusters using K-means over TF-IDF vectors.

    Args:
        body: List of snippets to cluster.

    Returns:
        Clusters with label (top terms joined), top_terms list, and snippet IDs.
    """
    if not body.snippets:
        return ClustersResponse(clusters=[])

    documents = [_snippet_text(s) for s in body.snippets]
    snippet_ids = [s.id for s in body.snippets]

    engine = TFIDFEngine()
    engine.fit(documents)
    vectors = engine.vectorize_corpus()

    k = auto_k(len(body.snippets))
    clusterer = KMeansClusterer(random_seed=42)
    assignments = clusterer.fit(vectors, k=k)
    cluster_labels = clusterer.get_cluster_labels(top_n_terms=3)

    # Group snippet IDs by cluster index
    cluster_groups: dict[int, list[str]] = {}
    for snippet_id, cluster_idx in zip(snippet_ids, assignments):
        cluster_groups.setdefault(cluster_idx, []).append(snippet_id)

    clusters = []
    for cluster_idx, terms in enumerate(cluster_labels):
        ids = cluster_groups.get(cluster_idx, [])
        if not ids:
            continue
        clusters.append(
            ClusterItem(
                label=" / ".join(terms),
                top_terms=terms,
                snippet_ids=ids,
            )
        )

    return ClustersResponse(clusters=clusters)
