"""Tests for the language detection algorithm."""

import pytest
from app.algorithms.language_detector import detect


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def assert_detects(code: str, expected: str, min_confidence: float = 0.1) -> None:
    result = detect(code)
    assert result["language"] == expected, (
        f"Expected '{expected}', got '{result['language']}' "
        f"(confidence={result['confidence']}, scores={result['scores']})"
    )
    assert result["confidence"] >= min_confidence


# ---------------------------------------------------------------------------
# TypeScript
# ---------------------------------------------------------------------------


TS_INTERFACE = """
interface User {
  id: string
  name: string
  age: number
  active: boolean
}
"""

TS_GENERICS = """
async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`)
  return res.json() as Promise<User>
}
"""

TS_TYPE_ALIAS = """
type ApiResponse<T> = {
  data: T
  error: string | null
  status: number
}

export type UserPayload = ApiResponse<User>
"""

TS_ENUM = """
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}
"""

TS_REACT = """
import React, { useState } from 'react'

interface Props {
  title: string
  count: number
}

const Counter: React.FC<Props> = ({ title, count: initialCount }) => {
  const [count, setCount] = useState<number>(initialCount)
  return <div>{title}: {count}</div>
}
"""


def test_typescript_interface():
    assert_detects(TS_INTERFACE, "typescript")


def test_typescript_generics():
    assert_detects(TS_GENERICS, "typescript")


def test_typescript_type_alias():
    assert_detects(TS_TYPE_ALIAS, "typescript")


def test_typescript_enum():
    assert_detects(TS_ENUM, "typescript")


def test_typescript_react_component():
    assert_detects(TS_REACT, "typescript")


# ---------------------------------------------------------------------------
# JavaScript
# ---------------------------------------------------------------------------


JS_COMMONJS = """
const express = require('express')
const app = express()

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello world' })
})

module.exports = app
"""

JS_DOM = """
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('submit-btn')
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('clicked')
  })
})
"""


def test_javascript_commonjs():
    assert_detects(JS_COMMONJS, "javascript")


def test_javascript_dom():
    assert_detects(JS_DOM, "javascript")


# ---------------------------------------------------------------------------
# Python
# ---------------------------------------------------------------------------


PY_CLASS = """
class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.items:
            raise IndexError("pop from empty stack")
        return self.items.pop()

    def __len__(self):
        return len(self.items)
"""

PY_MAIN = """
import os
import sys
from pathlib import Path


def main():
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
    for f in path.iterdir():
        print(f.name)


if __name__ == '__main__':
    main()
"""

PY_DECORATOR = """
from functools import wraps


def retry(times=3):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as exc:
                    if attempt == times - 1:
                        raise
            return None
        return wrapper
    return decorator
"""


def test_python_class():
    assert_detects(PY_CLASS, "python")


def test_python_main_guard():
    assert_detects(PY_MAIN, "python")


def test_python_decorator():
    assert_detects(PY_DECORATOR, "python")


# ---------------------------------------------------------------------------
# CSS
# ---------------------------------------------------------------------------


CSS_BASIC = """
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 8px;
}

.container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
"""

CSS_MEDIA = """
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .main-content {
    width: 100%;
    font-size: 14px;
  }
}
"""


def test_css_basic():
    assert_detects(CSS_BASIC, "css")


def test_css_media_query():
    assert_detects(CSS_MEDIA, "css")


# ---------------------------------------------------------------------------
# HTML
# ---------------------------------------------------------------------------


HTML_DOC = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Hello World</h1>
    <p>Welcome to my page.</p>
    <a href="/about">About</a>
  </div>
</body>
</html>
"""

HTML_FRAGMENT = """
<form action="/submit" method="POST">
  <input type="text" name="username" placeholder="Enter username">
  <input type="password" name="password" placeholder="Enter password">
  <button type="submit">Login</button>
</form>
"""


def test_html_full_document():
    assert_detects(HTML_DOC, "html")


def test_html_fragment():
    assert_detects(HTML_FRAGMENT, "html")


# ---------------------------------------------------------------------------
# JSON
# ---------------------------------------------------------------------------


JSON_OBJECT = """
{
  "name": "codepulse",
  "version": "1.0.0",
  "description": "Spaced repetition for developers",
  "keywords": ["spaced-repetition", "learning", "typescript"],
  "author": "Pritha",
  "license": "MIT"
}
"""

JSON_ARRAY = """
[
  { "id": 1, "title": "useEffect cleanup", "language": "typescript" },
  { "id": 2, "title": "SQL joins", "language": "sql" },
  { "id": 3, "title": "Python generators", "language": "python" }
]
"""


def test_json_object():
    assert_detects(JSON_OBJECT, "json")


def test_json_array():
    assert_detects(JSON_ARRAY, "json")


# ---------------------------------------------------------------------------
# Markdown
# ---------------------------------------------------------------------------


MD_ARTICLE = """
# Getting Started with CodePulse

CodePulse helps you retain code snippets using spaced repetition.

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

## Features

- [x] SM-2 spaced repetition
- [x] Semantic search
- [ ] Mobile app

> **Note**: This project is in active development.
"""


def test_markdown_article():
    assert_detects(MD_ARTICLE, "markdown")


# ---------------------------------------------------------------------------
# Bash
# ---------------------------------------------------------------------------


BASH_SCRIPT = """
#!/bin/bash

set -euo pipefail

PROJECT_DIR="${HOME}/projects/codepulse"
BACKUP_DIR="${HOME}/backups"

echo "Starting backup..."
mkdir -p "$BACKUP_DIR"

if [ -d "$PROJECT_DIR" ]; then
  cp -r "$PROJECT_DIR" "$BACKUP_DIR/$(date +%Y%m%d)"
  echo "Backup complete."
else
  echo "Project directory not found." >&2
  exit 1
fi
"""

BASH_COMMANDS = """
#!/bin/sh
export PATH="$HOME/.local/bin:$PATH"

sudo apt-get update
sudo apt-get install -y git curl wget

source ~/.bashrc
echo "Setup complete: $PATH"
"""


def test_bash_script():
    assert_detects(BASH_SCRIPT, "bash")


def test_bash_commands():
    assert_detects(BASH_COMMANDS, "bash")


# ---------------------------------------------------------------------------
# SQL
# ---------------------------------------------------------------------------


SQL_SELECT = """
SELECT u.id, u.email, COUNT(s.id) AS snippet_count
FROM users u
LEFT JOIN snippets s ON s.user_id = u.id
WHERE u.created_at > '2026-01-01'
GROUP BY u.id, u.email
ORDER BY snippet_count DESC
HAVING COUNT(s.id) > 5;
"""

SQL_DDL = """
CREATE TABLE review_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 5),
  ease_factor_after FLOAT NOT NULL,
  interval_after INTEGER NOT NULL,
  reviewed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_review_logs_user ON review_logs(user_id, reviewed_at);
"""


def test_sql_select():
    assert_detects(SQL_SELECT, "sql")


def test_sql_ddl():
    assert_detects(SQL_DDL, "sql")


# ---------------------------------------------------------------------------
# Edge cases
# ---------------------------------------------------------------------------


def test_empty_code_returns_other():
    result = detect("")
    assert result["language"] == "other"
    assert result["confidence"] == 0.0


def test_very_short_code_returns_other():
    result = detect("x = 1")
    assert result["language"] == "other"


def test_result_has_all_keys():
    result = detect(PY_CLASS)
    assert "language" in result
    assert "confidence" in result
    assert "scores" in result


def test_confidence_is_between_0_and_1():
    for code in [TS_INTERFACE, JS_COMMONJS, PY_CLASS, CSS_BASIC, SQL_SELECT]:
        result = detect(code)
        assert 0.0 <= result["confidence"] <= 1.0


def test_all_languages_present_in_scores():
    result = detect(TS_INTERFACE)
    expected_langs = {
        "typescript", "javascript", "python", "css", "html",
        "json", "markdown", "bash", "sql",
    }
    assert expected_langs.issubset(set(result["scores"].keys()))


def test_typescript_beats_javascript_for_typed_code():
    result = detect(TS_INTERFACE)
    scores = result["scores"]
    assert scores["typescript"] > scores["javascript"], (
        f"Expected TS > JS, got TS={scores['typescript']} JS={scores['javascript']}"
    )


def test_javascript_beats_typescript_for_commonjs():
    result = detect(JS_COMMONJS)
    scores = result["scores"]
    assert scores["javascript"] > scores["typescript"], (
        f"Expected JS > TS, got JS={scores['javascript']} TS={scores['typescript']}"
    )
