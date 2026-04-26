"""POST /api/snippets/check-duplicate — Levenshtein-based near-duplicate detection."""

from fastapi import APIRouter

from app.algorithms.duplicate import check_duplicate
from app.models.schemas import (
    DuplicateCheckRequest,
    DuplicateCheckResponse,
    DuplicateMatch,
)

router = APIRouter()


@router.post("/api/snippets/check-duplicate", response_model=DuplicateCheckResponse)
def check_duplicate_snippet(body: DuplicateCheckRequest) -> DuplicateCheckResponse:
    """Check whether a new code snippet is a near-duplicate of any existing snippet.

    Args:
        body: New code string and list of existing snippets with id + code.

    Returns:
        is_duplicate flag and list of matching snippet IDs with similarity scores.
    """
    existing = [{"id": s.id, "code": s.code} for s in body.existing_snippets]
    result = check_duplicate(body.new_code, existing)

    return DuplicateCheckResponse(
        is_duplicate=result["is_duplicate"],
        matches=[DuplicateMatch(id=m["id"], similarity=m["similarity"]) for m in result["matches"]],
    )
