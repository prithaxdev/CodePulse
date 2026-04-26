"""POST /api/review/schedule — SM-2 spaced repetition scheduling."""

from datetime import date, timedelta

from fastapi import APIRouter, HTTPException

from app.algorithms.sm2 import sm2_schedule
from app.models.schemas import ReviewScheduleRequest, ReviewScheduleResponse

router = APIRouter()


@router.post("/api/review/schedule", response_model=ReviewScheduleResponse)
def schedule_review(body: ReviewScheduleRequest) -> ReviewScheduleResponse:
    """Calculate the next review date for a snippet using SM-2.

    Args:
        body: Rating, current SM-2 state.

    Returns:
        Updated SM-2 state and the ISO next-review date.
    """
    try:
        new_interval, new_reps, new_ease = sm2_schedule(
            quality=body.rating,
            repetitions=body.current_reps,
            ease_factor=body.current_ease,
            interval=body.current_interval,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    next_review = (date.today() + timedelta(days=new_interval)).isoformat()

    return ReviewScheduleResponse(
        snippet_id=body.snippet_id,
        next_review=next_review,
        interval_days=new_interval,
        ease_factor=new_ease,
        repetitions=new_reps,
    )
