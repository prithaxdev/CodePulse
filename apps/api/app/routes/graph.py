"""POST /api/graph/build — build knowledge dependency graph from user snippets."""

from fastapi import APIRouter

from app.algorithms.graph import build_dependency_graph
from app.models.schemas import GraphBuildRequest, GraphBuildResponse, DependencyEdge

router = APIRouter()


@router.post("/api/graph/build", response_model=GraphBuildResponse)
def build_graph(body: GraphBuildRequest) -> GraphBuildResponse:
    """Return directed dependency edges between related snippets.

    Edges point from earlier-saved prerequisite snippets to later-saved
    dependent snippets, filtered by cosine similarity threshold.

    Args:
        body: List of snippets and optional similarity threshold.

    Returns:
        List of dependency edges sorted by confidence descending.
    """
    if len(body.snippets) < 2:
        return GraphBuildResponse(edges=[])

    snippets_data = [s.model_dump() for s in body.snippets]
    raw_edges = build_dependency_graph(snippets_data, body.similarity_threshold)

    return GraphBuildResponse(
        edges=[DependencyEdge(**e) for e in raw_edges]
    )
