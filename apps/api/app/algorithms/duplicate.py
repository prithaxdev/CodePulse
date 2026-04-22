"""Levenshtein edit distance for near-duplicate code snippet detection — from scratch.

Reference: Levenshtein, V.I. (1966). Binary codes capable of correcting deletions,
insertions, and reversals. Soviet Physics Doklady, 10(8), 707–710.
"""


def levenshtein_distance(str_a: str, str_b: str) -> int:
    """Compute the Levenshtein edit distance between two strings using a DP matrix.

    Args:
        str_a: First string.
        str_b: Second string.

    Returns:
        Minimum number of single-character edits (insert, delete, replace) to
        transform str_a into str_b.
    """
    m, n = len(str_a), len(str_b)

    # Build (m+1) × (n+1) matrix
    dp = list(range(n + 1))

    for i in range(1, m + 1):
        prev = dp[0]
        dp[0] = i
        for j in range(1, n + 1):
            temp = dp[j]
            if str_a[i - 1] == str_b[j - 1]:
                dp[j] = prev
            else:
                dp[j] = 1 + min(prev, dp[j], dp[j - 1])
            prev = temp

    return dp[n]


def similarity_ratio(str_a: str, str_b: str) -> float:
    """Compute similarity as 1 - (edit_distance / max_length).

    Args:
        str_a: First string.
        str_b: Second string.

    Returns:
        Similarity score in [0.0, 1.0]. Returns 1.0 for two empty strings.
    """
    max_len = max(len(str_a), len(str_b))
    if max_len == 0:
        return 1.0
    return 1.0 - levenshtein_distance(str_a, str_b) / max_len


def check_duplicate(
    new_code: str,
    existing_snippets: list[dict],
    threshold: float = 0.85,
) -> dict:
    """Check whether a new code snippet is a near-duplicate of any existing snippet.

    Args:
        new_code: The code string of the snippet being saved.
        existing_snippets: List of dicts with keys ``id`` (str) and ``code`` (str).
        threshold: Similarity ratio above which a snippet is flagged as duplicate.
            Defaults to 0.85.

    Returns:
        Dict with:
            - ``is_duplicate`` (bool): True if any match exceeds the threshold.
            - ``matches`` (list[dict]): Each entry has ``id`` (str) and
              ``similarity`` (float), sorted descending. Only entries at or above
              the threshold are included.
    """
    matches = []
    for snippet in existing_snippets:
        score = similarity_ratio(new_code, snippet["code"])
        if score >= threshold:
            matches.append({"id": snippet["id"], "similarity": round(score, 4)})

    matches.sort(key=lambda x: x["similarity"], reverse=True)
    return {"is_duplicate": len(matches) > 0, "matches": matches}
