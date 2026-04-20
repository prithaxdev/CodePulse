"""TF-IDF Vectorizer — implemented from scratch.

Reference: Salton, G. & Buckley, C. (1988). Term-weighting approaches in
automatic text retrieval. Information Processing & Management, 24(5), 513–523.
"""

import math
import re
from collections import Counter


def tokenize(text: str) -> list[str]:
    """Lowercase, split on whitespace/punctuation, remove tokens shorter than 3 chars.

    Args:
        text: Raw input string (title + code + description + tags).

    Returns:
        List of cleaned tokens.
    """
    tokens = re.split(r"[\s\W]+", text.lower())
    return [t for t in tokens if len(t) >= 3]


def compute_tf(tokens: list[str]) -> dict[str, float]:
    """Compute term frequency for a list of tokens.

    TF(term, doc) = count(term in doc) / total_terms_in_doc

    Args:
        tokens: List of tokens from a single document.

    Returns:
        Dict mapping term → TF score.
    """
    if not tokens:
        return {}
    counts = Counter(tokens)
    total = len(tokens)
    return {term: count / total for term, count in counts.items()}


def compute_idf(documents: list[list[str]]) -> dict[str, float]:
    """Compute inverse document frequency across a corpus.

    IDF(term) = log(total_docs / docs_containing_term)

    Args:
        documents: List of token lists, one per document.

    Returns:
        Dict mapping term → IDF score.
    """
    total_docs = len(documents)
    if total_docs == 0:
        return {}

    doc_freq: dict[str, int] = {}
    for tokens in documents:
        for term in set(tokens):
            doc_freq[term] = doc_freq.get(term, 0) + 1

    return {
        term: math.log(total_docs / freq)
        for term, freq in doc_freq.items()
    }


def tfidf_vector(tf: dict[str, float], idf: dict[str, float]) -> dict[str, float]:
    """Combine TF and IDF into a TF-IDF vector for one document.

    TF-IDF(term, doc) = TF(term, doc) × IDF(term)

    Args:
        tf: Term frequency dict for a single document.
        idf: Inverse document frequency dict for the corpus.

    Returns:
        Sparse dict mapping term → TF-IDF weight (only non-zero entries).
    """
    return {
        term: tf_score * idf[term]
        for term, tf_score in tf.items()
        if term in idf
    }


class TFIDFEngine:
    """Fits an IDF table on a corpus and vectorizes documents.

    Usage:
        engine = TFIDFEngine()
        engine.fit(documents)
        vector = engine.vectorize("some text here")
    """

    def __init__(self) -> None:
        self._idf: dict[str, float] = {}
        self._corpus_tokens: list[list[str]] = []

    def fit(self, documents: list[str]) -> None:
        """Compute IDF from a corpus of raw document strings.

        Args:
            documents: List of raw text strings.
        """
        self._corpus_tokens = [tokenize(doc) for doc in documents]
        self._idf = compute_idf(self._corpus_tokens)

    def vectorize(self, text: str) -> dict[str, float]:
        """Produce a TF-IDF vector for a single document using the fitted IDF.

        Args:
            text: Raw text string to vectorize.

        Returns:
            Sparse TF-IDF vector as a dict.
        """
        tokens = tokenize(text)
        tf = compute_tf(tokens)
        return tfidf_vector(tf, self._idf)

    def vectorize_corpus(self) -> list[dict[str, float]]:
        """Return TF-IDF vectors for every document in the fitted corpus.

        Returns:
            List of sparse TF-IDF vectors in corpus order.
        """
        result = []
        for tokens in self._corpus_tokens:
            tf = compute_tf(tokens)
            result.append(tfidf_vector(tf, self._idf))
        return result
