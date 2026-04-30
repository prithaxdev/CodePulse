"""SM-2 Spaced Repetition Algorithm.

Reference: Wozniak, P.A. (1990). SuperMemo 2 algorithm.
https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
"""


def sm2_schedule(
    quality: int,
    repetitions: int,
    ease_factor: float,
    interval: int,
) -> tuple[int, int, float]:
    """Calculate the next review schedule using the SM-2 algorithm.

    Args:
        quality: Rating of recall quality from 0 to 5.
                 0-2: complete failure / incorrect response
                 3:   correct response with serious difficulty
                 4:   correct response after hesitation
                 5:   perfect response
        repetitions: Number of times this item has been successfully recalled.
        ease_factor: Difficulty multiplier, minimum 1.3. Default starts at 2.5.
        interval: Current interval in days before the next review.

    Returns:
        A tuple of (new_interval, new_repetitions, new_ease_factor).
    """
    if not (0 <= quality <= 5):
        raise ValueError(f"quality must be between 0 and 5, got {quality}")
    if repetitions < 0:
        raise ValueError(f"repetitions must be >= 0, got {repetitions}")
    if ease_factor < 1.3:
        raise ValueError(f"ease_factor must be >= 1.3, got {ease_factor}")
    if interval < 1:
        raise ValueError(f"interval must be >= 1, got {interval}")

    if quality < 3:
        # Forgot — reset progress
        new_repetitions = 0
        new_interval = 1
    else:
        # Remembered — advance schedule
        new_repetitions = repetitions + 1

        if repetitions == 0:
            # Quality-adjusted first interval: Easy gets 4 days, Hard gets 2 days.
            # Standard SM-2 fixes this at 1, but that makes every first review
            # feel identical regardless of confidence — poor UX.
            new_interval = 4 if quality >= 4 else 2
        elif repetitions == 1:
            new_interval = 6
        else:
            new_interval = round(interval * ease_factor)

    # Adjust ease factor based on quality (applies regardless of pass/fail)
    new_ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    new_ease_factor = max(1.3, round(new_ease_factor, 4))

    return new_interval, new_repetitions, new_ease_factor
