"""POST /api/summarize — Extractive summarization with MMR for thread draft generation."""

from fastapi import APIRouter

from app.algorithms.summarizer import extractive_summarize
from app.models.schemas import SummarizeRequest, SummarizeResponse, ThreadPoint

router = APIRouter()


@router.post("/api/summarize", response_model=SummarizeResponse)
def summarize_cluster(body: SummarizeRequest) -> SummarizeResponse:
    """Generate an X thread draft from a cluster of related snippets using MMR.

    Args:
        body: List of snippets (id, description, notes).

    Returns:
        Ordered thread points, each linked to a source snippet ID.
    """
    snippets_dicts = [
        {"id": s.id, "description": s.description, "notes": s.notes}
        for s in body.snippets
    ]
    points = extractive_summarize(snippets_dicts)

    return SummarizeResponse(
        thread_draft=[
            ThreadPoint(point=p["point"], source_snippet_id=p["source_snippet_id"])
            for p in points
        ]
    )
