"""POST /api/search — TF-IDF semantic search over a snippet corpus."""

from fastapi import APIRouter

from app.algorithms.tfidf import TFIDFEngine
from app.algorithms.similarity import rank_by_similarity
from app.models.schemas import SearchRequest, SearchResponse, SearchResult

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


@router.post("/api/search", response_model=SearchResponse)
def search_snippets(body: SearchRequest) -> SearchResponse:
    """Rank snippets by TF-IDF cosine similarity to the query.

    Args:
        body: Query string and list of snippets to search.

    Returns:
        Ranked list of snippet IDs with similarity scores.
    """
    if not body.snippets:
        return SearchResponse(results=[])

    documents = [_snippet_text(s) for s in body.snippets]
    snippet_ids = [s.id for s in body.snippets]

    engine = TFIDFEngine()
    engine.fit(documents)

    corpus_vecs = engine.vectorize_corpus()
    query_vec = engine.vectorize(body.query)

    ranked = rank_by_similarity(query_vec, corpus_vecs, snippet_ids)

    return SearchResponse(
        results=[
            SearchResult(snippet_id=sid, similarity_score=round(score, 4))
            for sid, score in ranked
            if score > 0.0
        ]
    )
