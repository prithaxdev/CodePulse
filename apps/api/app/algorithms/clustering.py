"""K-Means clustering for TF-IDF vectors — implemented from scratch.

Uses cosine distance (1 - cosine similarity) as the distance metric, which
is more appropriate for sparse high-dimensional text vectors than Euclidean.

Reference: MacQueen, J. (1967). Some methods for classification and analysis
of multivariate observations. Proceedings of the 5th Berkeley Symposium on
Mathematical Statistics and Probability, 1, 281–297.
"""

import random
from typing import Optional

from app.algorithms.similarity import cosine_similarity


def _cosine_distance(vec_a: dict[str, float], vec_b: dict[str, float]) -> float:
    """Cosine distance between two sparse vectors.

    Args:
        vec_a: Sparse vector as a dict mapping term → weight.
        vec_b: Sparse vector as a dict mapping term → weight.

    Returns:
        Distance in [0.0, 1.0]. 0.0 means identical, 1.0 means orthogonal.
    """
    return 1.0 - cosine_similarity(vec_a, vec_b)


def _mean_vector(vectors: list[dict[str, float]]) -> dict[str, float]:
    """Compute the element-wise mean of a list of sparse vectors.

    Args:
        vectors: List of sparse TF-IDF vectors.

    Returns:
        Centroid vector as a sparse dict. Empty dict if no vectors given.
    """
    if not vectors:
        return {}

    n = len(vectors)
    centroid: dict[str, float] = {}

    for vec in vectors:
        for term, weight in vec.items():
            centroid[term] = centroid.get(term, 0.0) + weight

    return {term: total / n for term, total in centroid.items()}


def _nearest_centroid(
    vector: dict[str, float],
    centroids: list[dict[str, float]],
) -> int:
    """Find the index of the nearest centroid by cosine distance.

    Args:
        vector: Sparse TF-IDF vector to assign.
        centroids: List of centroid vectors.

    Returns:
        Index of the nearest centroid.
    """
    best_idx = 0
    best_dist = float("inf")

    for idx, centroid in enumerate(centroids):
        dist = _cosine_distance(vector, centroid)
        if dist < best_dist:
            best_dist = dist
            best_idx = idx

    return best_idx


class KMeansClusterer:
    """K-Means clustering over sparse TF-IDF vectors using cosine distance.

    Usage:
        clusterer = KMeansClusterer()
        assignments = clusterer.fit(vectors, k=5)
        cluster_idx = clusterer.predict(new_vector)
        labels = clusterer.get_cluster_labels(top_n_terms=3)
    """

    def __init__(self, max_iterations: int = 100, random_seed: Optional[int] = None) -> None:
        """Initialise the clusterer.

        Args:
            max_iterations: Maximum number of Lloyd's algorithm iterations.
            random_seed: Optional seed for reproducible random initialisation.
        """
        self._max_iterations = max_iterations
        self._random_seed = random_seed
        self._centroids: list[dict[str, float]] = []
        self._assignments: list[int] = []
        self._iterations_run: int = 0

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def fit(self, vectors: list[dict[str, float]], k: int) -> list[int]:
        """Cluster vectors into k groups using Lloyd's algorithm.

        Centroids are initialised by sampling k distinct data points at random.
        Iteration stops when assignments no longer change or max_iterations
        is reached.

        Args:
            vectors: List of sparse TF-IDF vectors to cluster.
            k: Number of clusters. Clamped to len(vectors) if k > len(vectors).

        Returns:
            List of cluster indices (one per input vector, same order).
        """
        n = len(vectors)
        if n == 0:
            self._centroids = []
            self._assignments = []
            return []

        # Clamp k so it never exceeds the number of points
        k = min(k, n)

        rng = random.Random(self._random_seed)
        seed_indices = rng.sample(range(n), k)
        self._centroids = [dict(vectors[i]) for i in seed_indices]

        self._assignments = [0] * n
        self._iterations_run = 0

        for iteration in range(self._max_iterations):
            # Assignment step
            new_assignments = [
                _nearest_centroid(vec, self._centroids) for vec in vectors
            ]

            converged = new_assignments == self._assignments
            self._assignments = new_assignments
            self._iterations_run = iteration + 1

            if converged and iteration > 0:
                break

            # Update step — recalculate each centroid as mean of its members
            cluster_members: list[list[dict[str, float]]] = [[] for _ in range(k)]
            for vec, cluster_idx in zip(vectors, self._assignments):
                cluster_members[cluster_idx].append(vec)

            for cluster_idx in range(k):
                if cluster_members[cluster_idx]:
                    self._centroids[cluster_idx] = _mean_vector(
                        cluster_members[cluster_idx]
                    )
                # If a centroid has no members (empty cluster), keep the old
                # centroid rather than producing a zero vector.

        return list(self._assignments)

    def predict(self, vector: dict[str, float]) -> int:
        """Assign a new vector to the nearest fitted centroid.

        Args:
            vector: Sparse TF-IDF vector to classify.

        Returns:
            Index of the nearest centroid.

        Raises:
            RuntimeError: If fit() has not been called yet.
        """
        if not self._centroids:
            raise RuntimeError("Call fit() before predict().")
        return _nearest_centroid(vector, self._centroids)

    def get_cluster_labels(self, top_n_terms: int = 3) -> list[list[str]]:
        """Return the top N terms for each cluster centroid.

        Terms are ranked by their weight in the centroid vector, which
        reflects both how common a term is in the cluster and how
        discriminative it is across the whole corpus (via TF-IDF).

        Args:
            top_n_terms: Number of label terms to return per cluster.

        Returns:
            List of term lists, one list per cluster, in cluster-index order.

        Raises:
            RuntimeError: If fit() has not been called yet.
        """
        if not self._centroids:
            raise RuntimeError("Call fit() before get_cluster_labels().")

        labels: list[list[str]] = []
        for centroid in self._centroids:
            sorted_terms = sorted(centroid.items(), key=lambda x: x[1], reverse=True)
            labels.append([term for term, _ in sorted_terms[:top_n_terms]])

        return labels

    # ------------------------------------------------------------------
    # Introspection helpers
    # ------------------------------------------------------------------

    @property
    def centroids(self) -> list[dict[str, float]]:
        """Fitted centroid vectors, one per cluster."""
        return self._centroids

    @property
    def iterations_run(self) -> int:
        """Number of Lloyd's iterations executed during the last fit()."""
        return self._iterations_run


def auto_k(num_snippets: int) -> int:
    """Recommend a cluster count using the project's heuristic.

    K = max(3, num_snippets // 8)

    Args:
        num_snippets: Total number of snippets to cluster.

    Returns:
        Recommended number of clusters.
    """
    return max(3, num_snippets // 8)
