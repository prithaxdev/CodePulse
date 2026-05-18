"""Language detection via weighted keyword + regex pattern scoring — from scratch.

Assigns a confidence score to each candidate language by:
  1. Counting how many language-specific *keywords* appear in the code.
  2. Counting how many language-specific *regex patterns* match.
  3. Normalising each count to [0, 1] and multiplying by a tuned weight.
  4. Returning the language with the highest combined score.

No external ML libraries are used — only the Python standard library.
"""

import re

# ---------------------------------------------------------------------------
# Signatures
# ---------------------------------------------------------------------------
# Each entry defines:
#   keywords        — substrings unique (or highly indicative) of this language.
#                     Checked as case-sensitive substring unless noted.
#   patterns        — compiled regex patterns.  MULTILINE | IGNORECASE applied
#                     per language via the `flags` key (default: MULTILINE).
#   keyword_weight  — contribution of keyword hits to the total score.
#   pattern_weight  — contribution of pattern hits to the total score.
#
# Score for one language =
#   (unique_keyword_hits / total_keywords) * keyword_weight
#   + (unique_pattern_hits / total_patterns) * pattern_weight
#
# Max possible score = keyword_weight + pattern_weight (all keywords/patterns hit).
# Confidence = score / max_possible_score   ∈ [0, 1]
# ---------------------------------------------------------------------------

LANGUAGE_SIGNATURES: dict[str, dict] = {
    # ------------------------------------------------------------------
    # TypeScript — checked BEFORE JavaScript because TS is a JS superset.
    # TS-specific keywords and type-annotation patterns are strong signals.
    # ------------------------------------------------------------------
    "typescript": {
        "keywords": [
            "interface ",
            "readonly ",
            "enum ",
            "namespace ",
            "declare ",
            "abstract ",
            "implements ",
            "as const",
            "satisfies ",
            "infer ",
            "keyof ",
            "Partial<",
            "Record<",
            "never",
            "unknown",
            "React.FC",
            "React.ReactNode",
            "useState<",
            "useRef<",
        ],
        "patterns": [
            r":\s*(string|number|boolean|void|any|never|unknown)\b",
            r"\bexport\s+type\b",
            r"\bimport\s+type\b",
            r"<[A-Z][A-Za-z]+(?:<[^>]+>)?>",   # generic type e.g. Promise<User>
            r"\benum\s+[A-Z]\w*\s*\{",          # enum Direction { ...
        ],
        "keyword_weight": 2.5,
        "pattern_weight": 4.0,
        "flags": re.MULTILINE,
    },
    # ------------------------------------------------------------------
    # JavaScript — common module-system and DOM idioms unique to plain JS.
    # Shared keywords (const/let/function) are intentionally excluded here;
    # their absence keeps JS from falsely outscoring TypeScript.
    # ------------------------------------------------------------------
    "javascript": {
        "keywords": [
            "require(",
            "module.exports",
            "prototype.",
            "document.",
            "window.",
            "arguments",
            "__proto__",
            "console.log(",
            "console.error(",
        ],
        "patterns": [
            r"\brequire\s*\(['\"]",
            r"\bmodule\.exports\b",
            r"=>\s*[\({]",
            r"\bawait\s+\w+\s*\(",
        ],
        "keyword_weight": 2.0,
        "pattern_weight": 2.5,
        "flags": re.MULTILINE,
    },
    # ------------------------------------------------------------------
    # Python
    # ------------------------------------------------------------------
    "python": {
        "keywords": [
            "def ",
            "elif ",
            "lambda ",
            "yield ",
            "__init__",
            "__name__",
            "self.",
            "cls.",
            "None",
            "True",
            "False",
            "print(",
            "pass",
            "raise ",
            "except ",
            "with ",
        ],
        "patterns": [
            r"def\s+\w+\s*\(",
            r"if\s+__name__\s*==\s*['\"]__main__['\"]",
            r"^\s*#[^!]",                          # comment (not shebang)
            r"\bself\b",
        ],
        "keyword_weight": 2.0,
        "pattern_weight": 2.5,
        "flags": re.MULTILINE,
    },
    # ------------------------------------------------------------------
    # CSS / SCSS
    # ------------------------------------------------------------------
    "css": {
        "keywords": [
            "background-color",
            "font-size",
            "font-weight",
            "font-family",
            "border-radius",
            "@media",
            "@keyframes",
            "@import",
            ":hover",
            ":focus",
            ":root",
            "!important",
        ],
        "patterns": [
            r"[\w.#*\[\]:-]+\s*\{[^}]*;[^}]*\}",  # selector { prop: val; }
            r":\s*[\d.]+\s*(px|em|rem|vh|vw|%)\b", # length value
            r"@media\s*\(",
            r"rgba?\s*\(",
        ],
        "keyword_weight": 2.0,
        "pattern_weight": 3.0,
        "flags": re.MULTILINE | re.IGNORECASE,
    },
    # ------------------------------------------------------------------
    # HTML
    # ------------------------------------------------------------------
    "html": {
        "keywords": [
            "<!DOCTYPE",
            "<html",
            "<head>",
            "<body>",
            "<div",
            "<span",
            "<p>",
            "<a ",
            "<img",
            "<script",
            "<style",
            "<link",
            "<meta",
            "</div>",
            "</body>",
            "</html>",
            "<form",
            "<input",
            "<button",
        ],
        "patterns": [
            r"<[a-zA-Z][a-zA-Z0-9]*[^>]*>",
            r"</[a-zA-Z][a-zA-Z0-9]*>",
            r'\bclass\s*=\s*"',
            r'\bhref\s*=\s*"',
        ],
        "keyword_weight": 3.0,
        "pattern_weight": 2.0,
        "flags": re.MULTILINE | re.IGNORECASE,
    },
    # ------------------------------------------------------------------
    # JSON — purely pattern-based (no keywords in JSON itself)
    # ------------------------------------------------------------------
    "json": {
        "keywords": [],
        "patterns": [
            r'^\s*[\[{]',
            r'"[^"]+"\s*:\s*"[^"]*"',
            r'"[^"]+"\s*:\s*(true|false|null|\d+)',
            r'"[^"]+"\s*:\s*[\[{]',
        ],
        "keyword_weight": 0.0,
        "pattern_weight": 4.0,
        "flags": re.MULTILINE,
    },
    # ------------------------------------------------------------------
    # Markdown — purely pattern-based
    # ------------------------------------------------------------------
    "markdown": {
        "keywords": [],
        "patterns": [
            r"^#{1,6}\s+\w",
            r"\[.+\]\(.+\)",
            r"^>\s+",
            r"^[-*+]\s+",
            r"```\w*",
            r"^\d+\.\s+\w",
        ],
        "keyword_weight": 0.0,
        "pattern_weight": 4.0,
        "flags": re.MULTILINE,
    },
    # ------------------------------------------------------------------
    # Bash / Shell
    # ------------------------------------------------------------------
    "bash": {
        "keywords": [
            "#!/bin/bash",
            "#!/bin/sh",
            "#!/usr/bin/env bash",
            "echo ",
            "export ",
            "source ",
            "grep ",
            "sed ",
            "awk ",
            "chmod ",
            "sudo ",
            "mkdir ",
            "$PATH",
            "$HOME",
        ],
        "patterns": [
            r"^#!/",
            r"\$\{[\w]+\}",
            r"\$\([\w\s/.-]+\)",
            r"\becho\s+",
            r"\[\s*[^]]+\s*\]",
        ],
        "keyword_weight": 2.0,
        "pattern_weight": 3.0,
        "flags": re.MULTILINE,
    },
    # ------------------------------------------------------------------
    # SQL
    # ------------------------------------------------------------------
    "sql": {
        "keywords": [
            "SELECT ",
            "FROM ",
            "WHERE ",
            "JOIN ",
            "INNER JOIN",
            "LEFT JOIN",
            "GROUP BY",
            "ORDER BY",
            "HAVING ",
            "INSERT INTO",
            "UPDATE ",
            "DELETE ",
            "CREATE TABLE",
            "ALTER TABLE",
            "DROP TABLE",
            "PRIMARY KEY",
            "FOREIGN KEY",
            "NOT NULL",
        ],
        "patterns": [
            r"\bSELECT\b",
            r"\bFROM\s+\w+\b",
            r"\bWHERE\s+\w+",
            r"\bJOIN\s+\w+",
            r"\bCREATE\s+TABLE\b",
        ],
        "keyword_weight": 2.5,
        "pattern_weight": 3.0,
        "flags": re.MULTILINE | re.IGNORECASE,
    },
}

# Minimum code length (characters) to attempt detection.
_MIN_LENGTH = 20

# Confidence below this threshold → language reported as "other".
_MIN_CONFIDENCE = 0.08


def detect(code: str) -> dict[str, object]:
    """Detect the programming language of a code snippet.

    Scores each candidate language by counting keyword hits and regex pattern
    matches, then normalises to produce a confidence in [0, 1].

    Args:
        code: Raw code string to analyse.

    Returns:
        Dict with:
            ``language`` (str)   — detected language value, or ``"other"``.
            ``confidence`` (float) — normalised score in [0.0, 1.0].
            ``scores`` (dict)    — raw score for every candidate language.
    """
    if len(code.strip()) < _MIN_LENGTH:
        return {"language": "other", "confidence": 0.0, "scores": {}}

    scores: dict[str, float] = {}

    for lang, sig in LANGUAGE_SIGNATURES.items():
        flags = sig.get("flags", re.MULTILINE)
        keyword_weight: float = sig["keyword_weight"]
        pattern_weight: float = sig["pattern_weight"]
        keywords: list[str] = sig["keywords"]
        patterns: list[str] = sig["patterns"]

        score = 0.0

        # Keyword scoring — unique hits normalised by total keywords.
        if keywords and keyword_weight > 0:
            hits = sum(1 for kw in keywords if kw in code)
            score += (hits / len(keywords)) * keyword_weight

        # Pattern scoring — unique pattern hits normalised by total patterns.
        if patterns and pattern_weight > 0:
            hits = sum(
                1 for pat in patterns if re.search(pat, code, flags)
            )
            score += (hits / len(patterns)) * pattern_weight

        scores[lang] = round(score, 4)

    if not scores:
        return {"language": "other", "confidence": 0.0, "scores": scores}

    best_lang = max(scores, key=lambda k: scores[k])
    best_score = scores[best_lang]

    # Normalise to [0, 1] using the theoretical max for that language.
    sig = LANGUAGE_SIGNATURES[best_lang]
    max_possible = sig["keyword_weight"] + sig["pattern_weight"]
    confidence = round(best_score / max_possible, 4) if max_possible > 0 else 0.0

    return {
        "language": best_lang if confidence >= _MIN_CONFIDENCE else "other",
        "confidence": confidence,
        "scores": scores,
    }
