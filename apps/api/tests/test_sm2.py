"""Comprehensive tests for the SM-2 spaced repetition algorithm."""

import pytest
from app.algorithms.sm2 import sm2_schedule


# ---------------------------------------------------------------------------
# Basic scheduling progression
# ---------------------------------------------------------------------------

def test_first_review_easy_interval_is_one():
    """First review (repetitions=0) always produces interval=1 regardless of quality."""
    interval, reps, ef = sm2_schedule(quality=5, repetitions=0, ease_factor=2.5, interval=1)
    assert interval == 1
    assert reps == 1


def test_second_review_interval_is_six():
    """Second review (repetitions=1) always produces interval=6."""
    interval, reps, ef = sm2_schedule(quality=5, repetitions=1, ease_factor=2.5, interval=1)
    assert interval == 6
    assert reps == 2


def test_third_review_interval_is_previous_times_ease_factor():
    """Third review (repetitions=2) produces interval = round(prev_interval × ease_factor)."""
    ease_factor = 2.5
    interval, reps, ef = sm2_schedule(quality=5, repetitions=2, ease_factor=ease_factor, interval=6)
    assert interval == round(6 * ease_factor)
    assert reps == 3


# ---------------------------------------------------------------------------
# Forgot resets
# ---------------------------------------------------------------------------

def test_forgot_resets_interval_to_one():
    """Quality < 3 should reset interval to 1."""
    for quality in (0, 1, 2):
        interval, reps, ef = sm2_schedule(
            quality=quality, repetitions=5, ease_factor=2.5, interval=30
        )
        assert interval == 1, f"Expected interval=1 for quality={quality}, got {interval}"


def test_forgot_resets_repetitions_to_zero():
    """Quality < 3 should reset repetitions to 0."""
    for quality in (0, 1, 2):
        interval, reps, ef = sm2_schedule(
            quality=quality, repetitions=5, ease_factor=2.5, interval=30
        )
        assert reps == 0, f"Expected reps=0 for quality={quality}, got {reps}"


# ---------------------------------------------------------------------------
# Ease factor rules
# ---------------------------------------------------------------------------

def test_ease_factor_never_drops_below_1_3():
    """Ease factor must always be >= 1.3, even with repeated quality=0 ratings."""
    ef = 1.3
    for _ in range(20):
        _, _, ef = sm2_schedule(quality=0, repetitions=0, ease_factor=ef, interval=1)
        assert ef >= 1.3, f"ease_factor dropped below 1.3: {ef}"


def test_ease_factor_increases_with_high_quality():
    """Quality=5 should increase the ease factor."""
    _, _, new_ef = sm2_schedule(quality=5, repetitions=1, ease_factor=2.5, interval=1)
    assert new_ef > 2.5


def test_ease_factor_decreases_with_low_quality():
    """Quality=3 (threshold) should slightly decrease the ease factor."""
    _, _, new_ef = sm2_schedule(quality=3, repetitions=1, ease_factor=2.5, interval=1)
    assert new_ef < 2.5


def test_ease_factor_unchanged_at_quality_four():
    """Quality=4 produces no change in ease factor (neutral point of the formula)."""
    _, _, new_ef = sm2_schedule(quality=4, repetitions=1, ease_factor=2.5, interval=1)
    # EF delta at q=4: 0.1 - (1)(0.08 + 0.02) = 0.0 → no change
    assert abs(new_ef - 2.5) < 1e-9


# ---------------------------------------------------------------------------
# 30-day simulation
# ---------------------------------------------------------------------------

def test_simulate_30_days_of_reviews():
    """Simulate consistent Easy (5) reviews for 30 scheduling steps.

    Verifies that:
    - Intervals grow monotonically after the first two steps.
    - Ease factor converges upward and stays bounded.
    - repetitions count increments on every step.
    """
    repetitions = 0
    ease_factor = 2.5
    interval = 1
    prev_interval = 0

    for step in range(30):
        interval, repetitions, ease_factor = sm2_schedule(
            quality=5,
            repetitions=repetitions,
            ease_factor=ease_factor,
            interval=interval,
        )

        assert ease_factor >= 1.3, f"EF below minimum at step {step}"
        assert repetitions == step + 1, f"Unexpected reps at step {step}"

        # After the fixed steps (1 and 6), each interval must grow
        if step >= 2:
            assert interval >= prev_interval, (
                f"Interval did not grow at step {step}: {interval} < {prev_interval}"
            )

        prev_interval = interval


# ---------------------------------------------------------------------------
# Input validation
# ---------------------------------------------------------------------------

def test_invalid_quality_raises():
    with pytest.raises(ValueError):
        sm2_schedule(quality=6, repetitions=0, ease_factor=2.5, interval=1)

    with pytest.raises(ValueError):
        sm2_schedule(quality=-1, repetitions=0, ease_factor=2.5, interval=1)


def test_invalid_ease_factor_raises():
    with pytest.raises(ValueError):
        sm2_schedule(quality=5, repetitions=0, ease_factor=1.0, interval=1)


def test_invalid_repetitions_raises():
    with pytest.raises(ValueError):
        sm2_schedule(quality=5, repetitions=-1, ease_factor=2.5, interval=1)


def test_invalid_interval_raises():
    with pytest.raises(ValueError):
        sm2_schedule(quality=5, repetitions=0, ease_factor=2.5, interval=0)
