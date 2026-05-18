"""POST /api/detect-language — keyword frequency scoring language detector."""

from fastapi import APIRouter

from app.algorithms.language_detector import detect
from app.models.schemas import LanguageDetectRequest, LanguageDetectResponse

router = APIRouter()


@router.post("/api/detect-language", response_model=LanguageDetectResponse)
def detect_language(body: LanguageDetectRequest) -> LanguageDetectResponse:
    """Detect the programming language of a code snippet.

    Args:
        body: Raw code string to analyse.

    Returns:
        Detected language, confidence score in [0, 1], and per-language scores.
    """
    result = detect(body.code)
    return LanguageDetectResponse(
        language=str(result["language"]),
        confidence=float(result["confidence"]),
        scores={k: float(v) for k, v in result["scores"].items()},  # type: ignore[union-attr]
    )
