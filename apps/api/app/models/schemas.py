"""Pydantic request/response schemas for all CodePulse API endpoints."""

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Shared
# ---------------------------------------------------------------------------


class SnippetInput(BaseModel):
    """A snippet with text fields used for search and clustering."""

    id: str
    title: str = ""
    code: str = ""
    description: str = ""
    tags: list[str] = Field(default_factory=list)


class SummarizeSnippetInput(BaseModel):
    """A snippet used as input for summarization."""

    id: str
    description: str = ""
    notes: str = ""


class ExistingSnippetCode(BaseModel):
    """A snippet with only id and code used for duplicate checking."""

    id: str
    code: str


# ---------------------------------------------------------------------------
# POST /api/review/schedule
# ---------------------------------------------------------------------------


class ReviewScheduleRequest(BaseModel):
    snippet_id: str
    rating: int = Field(..., ge=0, le=5)
    current_ease: float = Field(..., ge=1.3)
    current_interval: int = Field(..., ge=1)
    current_reps: int = Field(..., ge=0)


class ReviewScheduleResponse(BaseModel):
    snippet_id: str
    next_review: str  # ISO date string "YYYY-MM-DD"
    interval_days: int
    ease_factor: float
    repetitions: int


# ---------------------------------------------------------------------------
# POST /api/search
# ---------------------------------------------------------------------------


class SearchRequest(BaseModel):
    query: str
    snippets: list[SnippetInput]


class SearchResult(BaseModel):
    snippet_id: str
    similarity_score: float


class SearchResponse(BaseModel):
    results: list[SearchResult]


# ---------------------------------------------------------------------------
# POST /api/clusters
# ---------------------------------------------------------------------------


class ClustersRequest(BaseModel):
    snippets: list[SnippetInput]


class ClusterItem(BaseModel):
    label: str
    top_terms: list[str]
    snippet_ids: list[str]


class ClustersResponse(BaseModel):
    clusters: list[ClusterItem]


# ---------------------------------------------------------------------------
# POST /api/snippets/check-duplicate
# ---------------------------------------------------------------------------


class DuplicateCheckRequest(BaseModel):
    new_code: str
    existing_snippets: list[ExistingSnippetCode]


class DuplicateMatch(BaseModel):
    id: str
    similarity: float


class DuplicateCheckResponse(BaseModel):
    is_duplicate: bool
    matches: list[DuplicateMatch]


# ---------------------------------------------------------------------------
# POST /api/summarize
# ---------------------------------------------------------------------------


class SummarizeRequest(BaseModel):
    snippets: list[SummarizeSnippetInput]


class ThreadPoint(BaseModel):
    point: str
    source_snippet_id: str


class SummarizeResponse(BaseModel):
    thread_draft: list[ThreadPoint]
