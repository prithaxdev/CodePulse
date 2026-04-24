"""Extractive text summarization with Maximal Marginal Relevance (MMR).

Scores sentences by TF-IDF weight, then selects diverse points using MMR
to avoid redundancy across the generated thread draft.

Reference: Carbonell, J. & Goldstein, J. (1998). The use of MMR, diversity-based
reranking for reordering documents and producing summaries. SIGIR '98.
"""

from .similarity import cosine_similarity
from .tfidf import TFIDFEngine, tokenize, compute_tf, tfidf_vector


def _sentence_tfidf_score(sentence: str, idf: dict[str, float]) -> float:
    """Score a sentence by summing its TF-IDF weights.

    Args:
        sentence: Raw sentence string.
        idf: Fitted IDF table from the corpus.

    Returns:
        Sum of TF-IDF weights for all terms in the sentence.
    """
    tokens = tokenize(sentence)
    if not tokens:
        return 0.0
    tf = compute_tf(tokens)
    vec = tfidf_vector(tf, idf)
    return sum(vec.values())


def _sentence_vector(sentence: str, idf: dict[str, float]) -> dict[str, float]:
    """Produce a TF-IDF vector for a single sentence.

    Args:
        sentence: Raw sentence string.
        idf: Fitted IDF table.

    Returns:
        Sparse TF-IDF vector.
    """
    tokens = tokenize(sentence)
    if not tokens:
        return {}
    tf = compute_tf(tokens)
    return tfidf_vector(tf, idf)


def _split_sentences(text: str) -> list[str]:
    """Split text into sentences on period, newline, or semicolon boundaries.

    Args:
        text: Raw input text.

    Returns:
        List of non-empty sentence strings.
    """
    import re
    parts = re.split(r"(?<=[.!?])\s+|\n+|;\s*", text)
    return [s.strip() for s in parts if s.strip()]


def extractive_summarize(
    snippets: list[dict],
    max_points: int = 5,
    mmr_lambda: float = 0.6,
) -> list[dict]:
    """Summarize a cluster of snippets using TF-IDF scoring + MMR diversity.

    For each snippet, picks the highest-scoring sentence that is least similar
    to already-selected sentences (Maximal Marginal Relevance).

    Args:
        snippets: List of snippet dicts, each with at least a 'description'
            or 'notes' key and an 'id' key. Example:
            [{"id": "abc", "description": "...", "notes": "..."}]
        max_points: Maximum number of thread points to return.
        mmr_lambda: Trade-off between relevance (1.0) and diversity (0.0).
            Higher → more relevant, lower → more diverse.

    Returns:
        Ordered list of dicts: [{"point": str, "source_snippet_id": str}]
        Returns empty list if snippets is empty.
    """
    if not snippets:
        return []

    # Build corpus: one document per snippet (description + notes combined)
    def _snippet_text(s: dict) -> str:
        parts = [s.get("description", ""), s.get("notes", "")]
        return " ".join(p for p in parts if p)

    corpus_texts = [_snippet_text(s) for s in snippets]

    # Fit IDF on the full cluster corpus
    engine = TFIDFEngine()
    engine.fit(corpus_texts)
    idf = engine._idf

    selected: list[dict] = []        # final thread points
    selected_vecs: list[dict[str, float]] = []

    for snippet in snippets:
        if len(selected) >= max_points:
            break

        text = _snippet_text(snippet)
        sentences = _split_sentences(text)

        if not sentences:
            continue

        # Score each sentence in this snippet using MMR
        best_sentence: str | None = None
        best_mmr: float = -1.0

        for sent in sentences:
            relevance = _sentence_tfidf_score(sent, idf)

            if not selected_vecs:
                # First selection — pick purely by relevance
                mmr_score = relevance
            else:
                sent_vec = _sentence_vector(sent, idf)
                max_sim = max(
                    cosine_similarity(sent_vec, sv) for sv in selected_vecs
                )
                mmr_score = mmr_lambda * relevance - (1 - mmr_lambda) * max_sim

            if mmr_score > best_mmr:
                best_mmr = mmr_score
                best_sentence = sent

        if best_sentence:
            selected.append({
                "point": best_sentence,
                "source_snippet_id": snippet["id"],
            })
            selected_vecs.append(_sentence_vector(best_sentence, idf))

    return selected
