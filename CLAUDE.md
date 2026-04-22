# CLAUDE.md — CodePulse Project Intelligence

## Role

Act as a senior full-stack developer and project manager building CodePulse — a developer learning retention platform with spaced repetition. You are working with Pritha (Syntax), a BCA 8th-semester student and frontend developer whose core stack is React, TypeScript, Next.js, Tailwind CSS, and Shadcn/UI.

**Project start date:** Thursday, April 16, 2026
**Target completion:** Mid-June 2026 (~70 working days)
**Defense dates:** Proposal defense ~Week 3 (early May), Midterm defense ~Week 9 (mid-June), Final defense ~Week 14 (July)

You must:
- Follow the day-by-day task plan below exactly
- Write clean, production-grade, type-safe code
- Implement all algorithms from scratch in Python (no scikit-learn, no NLTK classifiers, only numpy for matrix math)
- After every completed task, commit to GitHub with a clean commit message (see Git Conventions below)
- Update task status in this file after each completion (change `[ ]` to `[x]`)
- Never skip tests — every algorithm must have pytest tests, every component must work before moving on
- Keep the codebase organized following the folder structure below
- Read relevant installed skills (from .claude/skills/) before starting frontend or backend work

## Agent Skills Setup

Before starting the project, install these skills from https://skills.sh for better code quality:

```bash
# Install essential skills for this project
npx skills add vercel-labs/agent-skills --skill frontend-design -a claude-code
npx skills add vercel-labs/agent-skills --skill skill-creator -a claude-code

# List installed skills to verify
npx skills list
```

**When to use skills:**
- Before building any frontend page/component → read the `frontend-design` skill
- Before writing Python algorithms → follow the code style rules in this CLAUDE.md
- Before creating any new skill for this project → use `skill-creator`

Skills are loaded automatically when relevant. You do not need to manually invoke them every time.

## Project Overview

**CodePulse** is a web-based SaaS application that helps developers retain coding knowledge using spaced repetition. Developers save code snippets as they learn, and the SM-2 algorithm schedules reviews at optimal intervals. The system also provides semantic search, auto-organization, and duplicate detection.

**One-liner:** Save code snippets → get reminded before you forget → your knowledge auto-organizes into topics.

**Target users:** Developers and CS students who learn daily and want to stop re-Googling the same solutions.

## Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.x (strict mode)
- **Styling:** Tailwind CSS v4
- **Data fetching:** TanStack Query v5
- **UI components:** Shadcn/UI
- **Code editor:** CodeMirror or Monaco Editor (for snippet input)
- **Syntax highlighting:** Shiki (for displaying code in review cards)
- **Charts:** Recharts (for dashboard analytics)
- **Forms:** React Hook Form + Zod validation

### Backend — Data Layer
- **BaaS:** Supabase (free tier)
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Clerk with Google OAuth
- **File storage:** Supabase Storage (for code screenshot exports)
- **Email:** Resend (free 3,000 emails/month) for daily review reminders

### Backend — Algorithm Engine
- **Language:** Python 3.12+
- **Framework:** FastAPI
- **Math:** numpy (matrix operations only)
- **HTTP client:** httpx (for any external API calls)
- **Validation:** pydantic
- **Testing:** pytest + pytest-asyncio
- **IMPORTANT:** All 5 algorithms implemented FROM SCRATCH. No scikit-learn, no NLTK, no pre-built ML libraries.

### Deployment
- **Frontend:** Vercel (free tier)
- **Algorithm API:** Railway (starter plan, free $5/month)
- **Database:** Supabase Cloud (free tier)
- **Domain:** codepulse.pritha.me (or similar)

## Folder Structure

```
codepulse/
├── apps/
│   ├── web/                              # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── page.tsx              # Landing page
│   │   │   │   ├── layout.tsx            # Root layout with Clerk provider
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   │   │   ├── (app)/               # Authenticated app routes
│   │   │   │   │   ├── layout.tsx        # App layout with sidebar nav
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   └── page.tsx      # Dashboard: stats + clusters + heatmap
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx      # Save new snippet
│   │   │   │   │   ├── review/
│   │   │   │   │   │   └── page.tsx      # Flashcard review session
│   │   │   │   │   ├── search/
│   │   │   │   │   │   └── page.tsx      # Semantic search
│   │   │   │   │   ├── snippets/
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.tsx  # Single snippet detail/edit
│   │   │   │   │   └── settings/
│   │   │   │   │       └── page.tsx      # User preferences
│   │   │   │   └── onboarding/
│   │   │   │       └── page.tsx          # First-time user setup
│   │   │   ├── components/
│   │   │   │   ├── ui/                   # Shadcn/UI components
│   │   │   │   ├── snippet-editor.tsx    # Code editor + title + tags form
│   │   │   │   ├── review-card.tsx       # Flashcard with show/hide + rating
│   │   │   │   ├── cluster-view.tsx      # Topic cluster grid
│   │   │   │   ├── search-results.tsx    # Ranked search result list
│   │   │   │   ├── stats-cards.tsx       # Dashboard metric cards
│   │   │   │   ├── review-heatmap.tsx    # GitHub-style activity heatmap
│   │   │   │   ├── due-badge.tsx         # Nav bar "5 due" badge
│   │   │   │   ├── duplicate-warning.tsx # Yellow banner for similar snippets
│   │   │   │   ├── thread-draft.tsx      # X thread generator panel
│   │   │   │   └── code-display.tsx      # Syntax-highlighted code block (Shiki)
│   │   │   ├── hooks/
│   │   │   │   ├── use-snippets.ts       # CRUD operations for snippets
│   │   │   │   ├── use-review.ts         # Review session + SM-2 API calls
│   │   │   │   ├── use-search.ts         # Search API hook
│   │   │   │   ├── use-clusters.ts       # Cluster data hook
│   │   │   │   └── use-stats.ts          # Dashboard statistics hook
│   │   │   ├── lib/
│   │   │   │   ├── supabase.ts           # Supabase client config
│   │   │   │   ├── api.ts                # FastAPI client (axios or fetch wrapper)
│   │   │   │   └── utils.ts              # Shared utilities
│   │   │   └── types/
│   │   │       ├── snippet.ts            # Snippet, ReviewLog types
│   │   │       └── api.ts                # API request/response types
│   │   ├── public/
│   │   ├── tailwind.config.ts
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                              # Python FastAPI
│       ├── app/
│       │   ├── main.py                   # FastAPI app, CORS, route registration
│       │   ├── config.py                 # Environment variables, settings
│       │   ├── algorithms/
│       │   │   ├── __init__.py
│       │   │   ├── sm2.py                # SM-2 spaced repetition scheduler
│       │   │   ├── tfidf.py              # TF-IDF vectorizer (from scratch)
│       │   │   ├── similarity.py         # Cosine similarity (from scratch)
│       │   │   ├── clustering.py         # K-means clustering (from scratch)
│       │   │   ├── duplicate.py          # Levenshtein edit distance (from scratch)
│       │   │   └── summarizer.py         # Extractive text summarization (from scratch)
│       │   ├── routes/
│       │   │   ├── __init__.py
│       │   │   ├── review.py             # POST /api/review/schedule
│       │   │   ├── search.py             # POST /api/search
│       │   │   ├── clusters.py           # GET /api/clusters/{user_id}
│       │   │   ├── duplicate.py          # POST /api/snippets/check-duplicate
│       │   │   └── summarize.py          # POST /api/summarize
│       │   └── models/
│       │       ├── __init__.py
│       │       └── schemas.py            # Pydantic request/response models
│       ├── tests/
│       │   ├── __init__.py
│       │   ├── test_sm2.py               # SM-2 scheduling tests
│       │   ├── test_tfidf.py             # TF-IDF + cosine similarity tests
│       │   ├── test_clustering.py        # K-means tests
│       │   ├── test_duplicate.py         # Levenshtein tests
│       │   ├── test_summarizer.py        # Extractive summarization tests
│       │   └── fixtures/
│       │       └── sample_snippets.json  # 50+ test snippets
│       ├── pyproject.toml
│       ├── Dockerfile
│       └── .env.example
│
├── .github/
│   └── workflows/
│       └── ci.yml                        # GitHub Actions: lint + test on push
├── .gitignore
├── README.md
├── CLAUDE.md                             # This file
└── turbo.json                            # (optional: if using Turborepo)
```

## Database Schema

```sql
-- Users (synced from Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT,
  preferred_languages TEXT[] DEFAULT '{typescript,javascript}',
  review_reminder_time TIME DEFAULT '09:00',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Snippets (the core data)
CREATE TABLE snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  code TEXT,
  description TEXT,
  language TEXT DEFAULT 'typescript',
  tags TEXT[] DEFAULT '{}',

  -- SM-2 scheduling state
  ease_factor FLOAT DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review DATE DEFAULT CURRENT_DATE,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Review logs (history of every review event)
CREATE TABLE review_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 5),
  ease_factor_after FLOAT NOT NULL,
  interval_after INTEGER NOT NULL,
  reviewed_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_snippets_next_review ON snippets(user_id, next_review);
CREATE INDEX idx_snippets_user ON snippets(user_id);
CREATE INDEX idx_snippets_tags ON snippets USING GIN(tags);
CREATE INDEX idx_review_logs_snippet ON review_logs(snippet_id);
CREATE INDEX idx_review_logs_user ON review_logs(user_id, reviewed_at);
```

## Algorithm Specifications

### 1. SM-2 Spaced Repetition (sm2.py)
- **Purpose:** Calculate when to show each snippet for review next
- **Input:** quality rating (0-5), current repetitions, current ease_factor, current interval
- **Output:** new_interval, new_repetitions, new_ease_factor
- **Logic:**
  - If quality < 3 (forgot): reset interval to 1, repetitions to 0, decrease ease_factor
  - If quality >= 3 (remembered): interval grows exponentially (interval × ease_factor)
  - ease_factor adjusts based on quality: EF' = EF + (0.1 - (5-q) × (0.08 + (5-q) × 0.02))
  - ease_factor minimum: 1.3
  - First review: interval = 1 day. Second review: interval = 6 days. After that: interval × ease_factor
- **Reference:** Wozniak, P.A. (1990). SuperMemo 2 algorithm

### 2. TF-IDF Vectorization (tfidf.py)
- **Purpose:** Convert snippet text into numerical vectors for search and clustering
- **Input:** list of documents (snippet text = title + code + description + tags)
- **Output:** TF-IDF vector (dict of term → weight) for each document
- **Logic:**
  - Tokenize: lowercase, split on whitespace/punctuation, remove words < 3 chars
  - TF(term, doc) = count(term in doc) / total_terms_in_doc
  - IDF(term) = log(total_docs / docs_containing_term)
  - TF-IDF(term, doc) = TF × IDF
- **Reference:** Salton, G. & Buckley, C. (1988). Term-weighting approaches in automatic text retrieval

### 3. Cosine Similarity (similarity.py)
- **Purpose:** Measure how similar two text vectors are (for search ranking)
- **Input:** two TF-IDF vectors (sparse dicts)
- **Output:** similarity score (0.0 to 1.0)
- **Logic:** dot_product(A, B) / (magnitude(A) × magnitude(B))

### 4. K-Means Clustering (clustering.py)
- **Purpose:** Auto-group snippets into topic clusters
- **Input:** list of TF-IDF vectors + number of clusters K
- **Output:** cluster assignments + centroid terms (for labeling)
- **Logic:**
  - Initialize K centroids randomly from data points
  - Repeat until convergence (or max 100 iterations):
    - Assign each point to nearest centroid (cosine distance)
    - Recalculate centroids as mean of assigned points
  - Label clusters by top 3 TF-IDF terms nearest to centroid
- **Auto-K:** Use elbow method or set K = max(3, num_snippets / 8)
- **Reference:** MacQueen, J. (1967). Some methods for classification and analysis of multivariate observations

### 5. Levenshtein Edit Distance (duplicate.py)
- **Purpose:** Detect near-duplicate code snippets on save
- **Input:** new code string + existing code strings
- **Output:** similarity percentage + matching snippet IDs if above 85% threshold
- **Logic:**
  - Build (m+1) × (n+1) matrix
  - Fill: cost of insert/delete/replace operations
  - Distance = matrix[m][n]
  - Similarity = 1 - (distance / max(len(a), len(b)))
- **Reference:** Levenshtein, V.I. (1966). Binary codes capable of correcting deletions, insertions, and reversals

### 6. Extractive Text Summarization (summarizer.py)
- **Purpose:** Generate X thread draft from a cluster of related snippets
- **Input:** list of snippet descriptions/notes from one cluster
- **Output:** ordered list of key sentences (one per snippet, diverse)
- **Logic:**
  - Score each sentence by sum of its TF-IDF weights
  - Select top sentence from first snippet
  - For each remaining snippet: select sentence that maximizes (TF-IDF score × (1 - max_similarity_to_already_selected))
  - This is Maximal Marginal Relevance (MMR) — ensures diversity

## API Endpoints

```
POST /api/review/schedule
  Body: { snippet_id: str, rating: int (0-5), current_ease: float, current_interval: int, current_reps: int }
  Returns: { next_review: str (date), interval_days: int, ease_factor: float, repetitions: int }

POST /api/search
  Body: { query: str, snippets: list[{id, title, code, description, tags}] }
  Returns: { results: list[{snippet_id, similarity_score}] }

POST /api/clusters
  Body: { snippets: list[{id, title, code, description, tags}] }
  Returns: { clusters: list[{label, top_terms, snippet_ids}] }

POST /api/snippets/check-duplicate
  Body: { new_code: str, existing_snippets: list[{id, code}] }
  Returns: { is_duplicate: bool, matches: list[{id, similarity}] }

POST /api/summarize
  Body: { snippets: list[{id, description, notes}] }
  Returns: { thread_draft: list[{point, source_snippet_id}] }

GET /api/health
  Returns: { status: "ok", version: "1.0.0" }
```

## Development Methodology: Agile (Scrum)

CodePulse follows **Agile Scrum methodology** with 2-week sprints. Each sprint has a clear goal, a set of user stories/tasks, and ends with a working increment that is merged to `main`.

### Sprint Structure
- **Sprint duration:** 2 weeks (12 working days, Sundays off)
- **Sprint planning:** First day of each sprint — review backlog, pick tasks, create feature branches
- **Daily standup (self):** Before coding each day, check CLAUDE.md status, identify today's task
- **Sprint review:** Last day — merge all feature branches to `dev`, test, then merge `dev` to `main`
- **Sprint retrospective:** Note what went well, what to improve, update CLAUDE.md

### Sprint Overview

| Sprint | Dates | Goal | Deliverable |
|--------|-------|------|-------------|
| Sprint 1 | Apr 16 – Apr 30 | All 5 algorithms working + API ready | FastAPI with all endpoints tested |
| Sprint 2 | May 1 – May 15 | Frontend scaffold + Save + Review features | Users can save snippets and do reviews |
| Sprint 3 | May 17 – May 31 | Search + Dashboard + Email + Landing | Feature-complete application |
| Sprint 4 | Jun 1 – Jun 14 | Testing + Daily usage + Result analysis | Bug-free app with real usage data |
| Sprint 5 | Jun 15 – Jun 28 | Report writing + Documentation | Complete CACS452 report |
| Sprint 6 | Jun 29 – Jul 5 | Defense preparation + Final submission | Bound copies + presentation ready |

### Branch Strategy

```
main (production — always deployable)
  │
  └── dev (integration branch — features merge here first)
        │
        ├── sprint-1/feat-sm2-algorithm
        ├── sprint-1/feat-tfidf-vectorizer
        ├── sprint-1/feat-levenshtein-duplicate
        ├── sprint-1/feat-kmeans-clustering
        ├── sprint-1/feat-summarizer
        ├── sprint-1/feat-fastapi-routes
        │
        ├── sprint-2/feat-nextjs-setup
        ├── sprint-2/feat-supabase-schema
        ├── sprint-2/feat-clerk-auth
        ├── sprint-2/feat-snippet-editor
        ├── sprint-2/feat-review-page
        │
        ├── sprint-3/feat-search-page
        ├── sprint-3/feat-dashboard
        ├── sprint-3/feat-email-reminder
        ├── sprint-3/feat-landing-page
        │
        ├── sprint-4/fix-edge-cases
        ├── sprint-4/test-unit-tests
        ├── sprint-4/docs-result-analysis
        │
        └── sprint-5/docs-report-chapters
```

### Branch Rules

1. **Never commit directly to `main` or `dev`** — always work on a feature branch
2. **Branch naming:** `sprint-N/type-short-description`
   - `sprint-1/feat-sm2-algorithm`
   - `sprint-2/feat-review-page`
   - `sprint-3/fix-search-ranking`
   - `sprint-4/test-duplicate-detection`
3. **Daily workflow:**
   ```bash
   # Start of day — make sure you're on the right branch
   git checkout sprint-1/feat-sm2-algorithm

   # Code, test, commit (multiple commits per day is fine)
   git add -A
   git commit -m "feat: implement SM-2 ease factor adjustment"
   git push origin sprint-1/feat-sm2-algorithm

   # End of day — push everything
   git push origin sprint-1/feat-sm2-algorithm
   ```
4. **End of sprint — merge flow:**
   ```bash
   # Merge each completed feature branch into dev
   git checkout dev
   git merge sprint-1/feat-sm2-algorithm
   git merge sprint-1/feat-tfidf-vectorizer
   # ... merge all completed feature branches

   # Test everything on dev
   # If all good, merge dev into main
   git checkout main
   git merge dev
   git tag v0.1.0  # tag each sprint completion
   git push origin main --tags
   ```
5. **Tag each sprint completion:** `v0.1.0` (Sprint 1), `v0.2.0` (Sprint 2), etc.

### Commit Message Format

```
type: description
```

**Types:**
- `feat:` — new feature or functionality
- `fix:` — bug fix
- `test:` — adding or updating tests
- `docs:` — documentation changes
- `chore:` — setup, config, dependencies
- `style:` — formatting, UI polish (no logic change)
- `refactor:` — code restructuring (no feature change)
- `data:` — seed data, fixtures, datasets

**Examples:**
```
feat: implement SM-2 spaced repetition algorithm
feat: build review page with flashcard UI
fix: handle edge case when ease factor drops below 1.3
test: add SM-2 convergence tests
docs: write Chapter 2 background study
chore: setup Supabase database with RLS policies
style: mobile responsive fixes for review page
refactor: extract TF-IDF tokenizer into separate function
data: create seed dataset of 50 code snippets
```

**Rules:**
- Commit after completing each task — never leave uncommitted work
- Push to GitHub after every coding session
- Multiple commits per day is good — shows active development
- Each commit should be atomic — one logical change per commit

## Code Style Rules

### Python (FastAPI)
- Type hints on all function parameters and return types
- Docstrings on all public functions (Google style)
- No global state — pass dependencies through function parameters
- Each algorithm in its own file, no cross-dependencies between algorithms
- All algorithms must work standalone (testable without FastAPI)

### TypeScript (Next.js)
- Strict TypeScript — no `any` types
- All API responses typed with Zod schemas
- Components use named exports, one component per file
- Hooks prefixed with `use` and in the hooks/ directory
- Server components by default, `"use client"` only when needed
- TanStack Query for all API calls — no raw fetch in components

---

## Sprint-by-Sprint Task Plan

> **Note:** Sundays are rest days. Tasks follow a Thu-Sat, Mon-Sat weekly pattern starting April 16, 2026.
> After completing each task, update the checkbox `[ ]` → `[x]` and commit this file too.

### SPRINT 1: Algorithm Core (Apr 16 – Apr 30)
> **Sprint goal:** All 5 algorithms implemented, tested, and wrapped in FastAPI endpoints.
> **Branch prefix:** `sprint-1/`
> **Merge to dev + main at end, tag `v0.1.0`**

#### Week 1 (Apr 16–19): SM-2 + Project Setup

- [x] **Day 1 — Thu, Apr 16:** Initialize the monorepo. Create `apps/api/` with `pyproject.toml`, install FastAPI, pytest, numpy, pydantic, httpx, uvicorn. Create `apps/api/app/algorithms/` directory. Create `apps/api/tests/` directory. Initialize git repo, create GitHub repo, set up `main` and `dev` branches. Install agent skills: `npx skills add vercel-labs/agent-skills --skill frontend-design -a claude-code`. Create branch `sprint-1/feat-sm2-algorithm`. Commit: `chore: initialize project structure and install agent skills`

- [x] **Day 2 — Fri, Apr 17:** Implement `sm2.py` — the `sm2_schedule()` function. Input: quality (0-5), repetitions, ease_factor, interval. Output: new_interval, new_repetitions, new_ease_factor. Follow the exact SM-2 formula from Wozniak 1990. Commit: `feat: implement SM-2 spaced repetition algorithm`

- [x] **Day 3 — Sat, Apr 18:** Write `test_sm2.py` — comprehensive tests: (1) First review rated Easy → interval becomes 1, (2) Second review → interval becomes 6, (3) Third review → interval = 6 × ease_factor, (4) Rating "Forgot" resets interval to 1, (5) Ease factor never below 1.3, (6) Simulate 30 days of reviews. Commit: `test: add SM-2 scheduling tests with convergence verification`

#### Week 2 (Apr 20–25): TF-IDF + Similarity + Seed Data

- [x] **Day 4 — Mon, Apr 20:** Create `apps/api/tests/fixtures/sample_snippets.json` — manually write 50 real code snippets from your learning history. Include: React hooks, TypeScript patterns, Tailwind tricks, Next.js solutions, CSS fixes, Git commands. Each: title, code, description, language, tags. Commit: `data: create seed dataset of 50 real code snippets`

- [x] **Day 5 — Tue, Apr 21:** Implement `tfidf.py` — `tokenize()`, `compute_tf()`, `compute_idf()`, `tfidf_vector()`. Build `TFIDFEngine` class that computes IDF table and vectorizes documents. Commit: `feat: implement TF-IDF vectorizer from scratch`

- [x] **Day 6 — Wed, Apr 22:** Implement `similarity.py` — `cosine_similarity(vec_a, vec_b)` for sparse dict vectors. Write `test_tfidf.py`: tokenizer works, rare terms weighted higher, identical texts → 1.0, unrelated → ~0.0, search finds relevant snippets. Commit: `feat: implement cosine similarity and TF-IDF search tests`

- [x] **Day 7 — Thu, Apr 23:** Implement `duplicate.py` — `levenshtein_distance(str_a, str_b)` using DP matrix, `check_duplicate()` with 85% threshold. Write `test_duplicate.py`: identical → 1.0, different → low, renamed variables → caught, different code → not flagged. Commit: `feat: implement Levenshtein edit distance for duplicate detection`

- [ ] **Day 8 — Fri, Apr 24:** Implement `clustering.py` — `KMeansClusterer` class: `fit(vectors, k)`, `predict(vector)`, `get_cluster_labels(top_n_terms)`. Cosine distance, random init, max 100 iterations, convergence tracking. Commit: `feat: implement K-means clustering from scratch`

- [ ] **Day 9 — Sat, Apr 25:** Write `test_clustering.py`: 3 obvious groups cluster correctly, labels contain relevant terms, converges within 100 iterations, single snippet doesn't crash, test with full 50-snippet dataset. Commit: `test: add K-means clustering tests with seed dataset`

#### Week 3 (Apr 27 – May 2): Summarizer + FastAPI + Proposal Defense

- [ ] **Day 10 — Mon, Apr 27:** Implement `summarizer.py` — `extractive_summarize(snippets, max_points)` with TF-IDF scoring + MMR diversity selection. Write `test_summarizer.py`. Commit: `feat: implement extractive text summarization with MMR`

- [ ] **Day 11 — Tue, Apr 28:** Create Pydantic models in `models/schemas.py`. Create `routes/` for all 5 endpoints. Wire into `main.py` with CORS. Test with Swagger UI at /docs. Commit: `feat: create FastAPI routes and Pydantic schemas`

- [ ] **Day 12 — Wed, Apr 29:** Integration testing — test all 5 endpoints with pytest + httpx TestClient. Fix bugs. All algorithms must work through the API layer. Commit: `test: add API integration tests for all endpoints`

- [ ] **Day 13 — Thu, Apr 30:** Prepare proposal defense materials. All 5 algorithms working in terminal. Demo-ready. Commit: `docs: prepare proposal defense demo scripts`

- [ ] **Day 13b — Sprint 1 Review:** Merge all `sprint-1/*` branches into `dev`. Test everything on `dev`. Merge `dev` into `main`. Tag `v0.1.0`. Push all tags. Sprint retrospective: note what went well, what was slow, update estimates for Sprint 2.

> **PROPOSAL DEFENSE (~early May) — 10 marks**
> Demo all algorithms running with real seed data.

---

### SPRINT 2: Frontend + Save + Review (May 1 – May 15)
> **Sprint goal:** Next.js app with auth, database, and the two core features (save + review) working end-to-end.
> **Branch prefix:** `sprint-2/`
> **Merge to dev + main at end, tag `v0.2.0`**

#### Week 4 (May 1–9): Setup + Infrastructure

- [ ] **Day 14 — Mon, May 3 (Baisakh 20):** Initialize Next.js 15 in `apps/web/`. Install TypeScript, Tailwind CSS v4, TanStack Query v5, React Hook Form, Zod. Init Shadcn/UI: `npx shadcn@latest init`. Add components: Button, Input, Card, Badge, Dialog, Textarea. Commit: `feat: initialize Next.js project with core dependencies`

- [ ] **Day 15 — Tue, May 4:** Set up Supabase project. Create tables (users, snippets, review_logs) with the SQL schema. Set up RLS policies. Create `lib/supabase.ts`. Commit: `feat: setup Supabase database with RLS policies`

- [ ] **Day 16 — Wed, May 5:** Set up Clerk auth. Install `@clerk/nextjs`. Create sign-in/sign-up pages. Protected route middleware. Clerk webhook → sync to Supabase users table. Commit: `feat: setup Clerk authentication with Google OAuth`

- [ ] **Day 17 — Thu, May 6:** Create TypeScript types (`types/snippet.ts`, `types/api.ts`). Create API client (`lib/api.ts`). Create TanStack Query hooks: `use-snippets.ts`, `use-review.ts`, `use-search.ts`, `use-clusters.ts`, `use-stats.ts`. Commit: `feat: create TypeScript types, API client, and query hooks`

- [ ] **Day 18 — Fri, May 7:** Build app layout — sidebar nav (Dashboard, New, Review, Search, Settings), due-badge component showing snippets due count. Responsive layout. Commit: `feat: build app layout with sidebar navigation`

- [ ] **Day 19 — Sat, May 8:** Deploy FastAPI to Railway, Next.js to Vercel. Connect via env variable. Verify health endpoint. Commit: `chore: deploy backend to Railway and frontend to Vercel`

#### Week 5 (May 10–15): Save + Review (the two core features)

- [ ] **Day 20 — Mon, May 10:** Build Snippet Editor page (`/new`). Form: title (text input), code (CodeMirror with language detection), description (textarea), language (select), tags (multi-input with autocomplete). React Hook Form + Zod validation. Branch: `sprint-2/feat-snippet-editor`. Commit: `feat: build snippet editor page with CodeMirror`

- [ ] **Day 21 — Tue, May 11:** Connect save flow end-to-end. On save: call `/api/snippets/check-duplicate`, show duplicate warning if match found, save to Supabase with SM-2 defaults (ease=2.5, interval=1, next_review=tomorrow), redirect to dashboard. Commit: `feat: connect snippet save flow with duplicate detection`

- [ ] **Day 22 — Wed, May 12:** Build Review page (`/review`). Query snippets where `next_review <= today`. Show card count. Flashcard UI: title + tags visible, code hidden. "Show answer" reveals code with Shiki syntax highlighting. Commit: `feat: build review page with flashcard UI`

- [ ] **Day 23 — Thu, May 13:** Add rating system. Three buttons: Forgot (1), Hard (3), Easy (5). On click: call `/api/review/schedule`, update Supabase snippet, log to review_logs, show next card. Completion screen after last card. Commit: `feat: implement review rating with SM-2 scheduling`

- [ ] **Day 24 — Fri, May 14:** Build `code-display.tsx` — Shiki syntax highlighting for TypeScript, JavaScript, Python, CSS, HTML, JSON, Bash. Reusable in review cards and detail pages. Commit: `feat: build syntax-highlighted code display component`

- [ ] **Day 25 — Sat, May 15:** End-to-end test: save 5 real snippets, review them, verify SM-2 updates correctly, check review_logs created. Fix bugs. Commit: `fix: end-to-end save and review flow bug fixes`

- [ ] **Day 25b — Sprint 2 Review:** Merge all `sprint-2/*` branches into `dev`. Full test on `dev`. Merge `dev` into `main`. Tag `v0.2.0`. Sprint retrospective.

---

### SPRINT 3: Search + Dashboard + Polish (May 17 – May 31)
> **Sprint goal:** Feature-complete application with search, dashboard, email reminders, and landing page.
> **Branch prefix:** `sprint-3/`
> **Merge to dev + main at end, tag `v0.3.0`**

#### Week 6 (May 17–22): Search + Dashboard

- [ ] **Day 26 — Mon, May 17:** Build Search page (`/search`). Debounced input (300ms). Call `/api/search`. Display ranked results: title, code preview, tags, similarity score, date. Click → `/snippets/[id]`. Commit: `feat: build semantic search page with TF-IDF ranking`

- [ ] **Day 27 — Tue, May 18:** Build Snippet Detail page (`/snippets/[id]`). Full view with syntax highlighting. SM-2 state display. Edit and delete functionality. Commit: `feat: build snippet detail page with edit and delete`

- [ ] **Day 28 — Wed, May 19:** Build Dashboard — stat cards: total snippets, review streak, due today, retention rate. Commit: `feat: build dashboard stat cards`

- [ ] **Day 29 — Thu, May 20:** Build Dashboard — cluster section. Call `/api/clusters`. Clickable cluster cards with label, count, snippet previews. Expand on click. Commit: `feat: build dashboard cluster view with K-means`

- [ ] **Day 30 — Fri, May 21:** Build Dashboard — review heatmap. GitHub-style activity graph from review_logs grouped by date. Last 12 weeks. Commit: `feat: build review activity heatmap`

- [ ] **Day 31 — Sat, May 22:** Build onboarding page (`/onboarding`). Language preferences. First-login only. "Save your first snippet" CTA. Commit: `feat: build onboarding page for new users`

#### Week 7 (May 24–29): Email + Thread Generator + Landing + Polish

- [ ] **Day 32 — Mon, May 24:** Set up Resend email. Daily cron (Supabase Edge Function or FastAPI scheduled task) at 9 AM. Query users with due snippets. Send email with "Review now" button linking to /review. Commit: `feat: implement daily email review reminder`

- [ ] **Day 33 — Tue, May 25:** Build Thread Draft feature. "Generate thread" button on cluster view. Call `/api/summarize`. Editable thread points with copy-all and copy-individual. Commit: `feat: build X thread draft generator`

- [ ] **Day 34 — Wed, May 26:** Build Landing page (`/`). Hero, how-it-works (3 steps), features section, footer. Clean professional design. Commit: `feat: build landing page`

- [ ] **Day 35 — Thu, May 27:** Build Settings page (`/settings`). Preferences: languages, reminder time, email on/off. Export data as JSON. Delete account. Commit: `feat: build settings page`

- [ ] **Day 36 — Fri, May 28:** Mobile responsive polish. Test all pages at 375px. Sidebar → hamburger. Cards stack. Code scrolls horizontally. Commit: `style: mobile responsive fixes`

- [ ] **Day 37 — Sat, May 29:** Full end-to-end test of every feature. Save 10 snippets, review, search, clusters, thread draft, email. Fix all bugs. Commit: `fix: comprehensive end-to-end testing and fixes`

- [ ] **Day 37b — Sprint 3 Review:** Merge all `sprint-3/*` branches into `dev`. Full test. Merge `dev` into `main`. Tag `v0.3.0`. App is now feature-complete. Sprint retrospective.

---

### SPRINT 4: Testing + Real Usage + Result Analysis (Jun 1 – Jun 14)
> **Sprint goal:** Bug-free application with 2+ weeks of real daily usage data for result analysis.
> **Branch prefix:** `sprint-4/`
> **Merge to dev + main at end, tag `v0.4.0`**

#### Week 8 (May 31 – Jun 5): Testing

- [ ] **Day 38 — Mon, May 31:** Write unit tests for frontend components using Vitest. Test: snippet editor form validation, review card state transitions, search result rendering, stat card calculations. Commit: `test: add frontend component unit tests`

- [ ] **Day 39 — Tue, Jun 1:** Write system tests — complete user flows: sign up → onboarding → first snippet → first review, save duplicate → warning, search finds results, clusters update after saving. Commit: `test: add system integration tests`

- [ ] **Day 40 — Wed, Jun 2:** Edge case testing: empty states (no snippets, no reviews, no clusters), very long code, special characters, 0 due snippets, single snippet clustering, search with no results. Commit: `fix: handle edge cases and empty states`

- [ ] **Day 41-50 (ongoing, Jun 3–14):** USE CODEPULSE DAILY. Save 2-3 real snippets per day from actual coding work at Panoptic/Zap. Morning reviews every day. Log bugs. This generates your real dataset.

#### Week 9 (Jun 7–12): Result Analysis

- [ ] **Day 44 — Sat, Jun 7:** Export SM-2 data. Plot ease_factor and interval over time per snippet from review_logs. Create convergence charts. Commit: `docs: export SM-2 convergence data for result analysis`

- [ ] **Day 45 — Mon, Jun 9:** Evaluate search quality. Create 20 test queries, check top result relevance. Calculate Precision@1, Precision@5. Document. Commit: `docs: evaluate TF-IDF search precision`

- [ ] **Day 46 — Tue, Jun 10:** Evaluate cluster quality. Manual verification of auto-generated groups. Calculate accuracy: correctly clustered / total. Commit: `docs: evaluate K-means cluster quality`

- [ ] **Day 47 — Wed, Jun 11:** Evaluate duplicate detection. Create 10 similar snippets (same logic, different vars). Test Levenshtein catches them. True/false positive rates. Commit: `docs: evaluate duplicate detection accuracy`

- [ ] **Day 48 — Thu, Jun 12:** Performance benchmarks. API response time for search, clustering, duplicate detection at 50, 100, 200 snippets. Create charts. Commit: `docs: performance benchmark results`

- [ ] **Day 49 — Fri, Jun 13:** Compile all result analysis. Screenshots, charts, metrics tables, observations. This feeds Chapter 4. Commit: `docs: compile complete result analysis summary`

- [ ] **Day 49b — Sprint 4 Review:** Merge all `sprint-4/*` branches into `dev`. Merge `dev` into `main`. Tag `v0.4.0`. Sprint retrospective.

> **MIDTERM DEFENSE (~mid-June) — 70 marks**
> Full working app + 3-4 weeks of real usage data + progress report.

---

### SPRINT 5: Documentation + Report (Jun 15 – Jun 28)
> **Sprint goal:** Complete CACS452 report with all chapters, UML diagrams, and IEEE references.
> **Branch prefix:** `sprint-5/`
> **Merge to dev + main at end, tag `v0.5.0`**

#### Week 10-11 (Jun 15–26): Report Writing

- [ ] **Day 50-52 (Jun 15–17):** Write Chapter 1 — Introduction: problem statement, objectives (4-5 clear ones), scope and limitations, development methodology (Agile), report organization. Commit: `docs: write Chapter 1 Introduction`

- [ ] **Day 53-55 (Jun 18–20):** Write Chapter 2 — Background Study and Literature Review: spaced repetition theory (Ebbinghaus 1885, Wozniak 1990), TF-IDF (Salton 1988), K-means (MacQueen 1967), Levenshtein (1966), existing tools comparison. IEEE refs. Commit: `docs: write Chapter 2 Background and Literature Review`

- [ ] **Day 56-59 (Jun 21–25):** Write Chapter 3 — System Analysis and Design: requirement analysis (functional + non-functional), feasibility study (technical, operational, economic, schedule), all UML diagrams (use case, class, sequence, activity, state, component, deployment). Commit: `docs: write Chapter 3 System Analysis and Design`

- [ ] **Day 60-62 (Jun 26–28):** Write Chapter 4 — Implementation and Testing: tools used, module details with pseudocode, test case tables (unit + system), result analysis with all charts and metrics. Commit: `docs: write Chapter 4 Implementation and Testing`

- [ ] **Day 63 (Jun 29):** Write Chapter 5 — Conclusion and Future Recommendations: summary, future work (mobile app, browser extension, VS Code extension, PWA, community snippets, AI card creation). Commit: `docs: write Chapter 5 Conclusion`

- [ ] **Day 63b — Sprint 5 Review:** Merge all `sprint-5/*` branches into `dev`. Merge `dev` into `main`. Tag `v0.5.0`.

---

### SPRINT 6: Final Defense Preparation (Jun 29 – Jul 5)
> **Sprint goal:** Formatted report, presentation slides, bound copies, defense-ready.
> **Branch prefix:** `sprint-6/`
> **Final merge, tag `v1.0.0`**

- [ ] **Day 64 (Jun 30):** Compile front matter: cover, certificate, acknowledgment, abstract, TOC, list of figures/tables/abbreviations. Back matter: references (IEEE), appendices (key source code, screenshots). Commit: `docs: compile front and back matter`

- [ ] **Day 65 (Jul 1):** Format entire document: Times New Roman 12pt, 1.5 spacing, A4, margins (1"/1"/1"/1.25"), page numbers (roman front matter, arabic from Ch1), heading sizes (16/14/12pt bold). Figures centered below caption, tables centered above. Commit: `docs: format report to CACS452 standards`

- [ ] **Day 66 (Jul 2):** Prepare defense presentation — 15-20 slides: problem → solution → demo → architecture → algorithms → results → conclusion. Commit: `docs: prepare defense presentation slides`

- [ ] **Day 67 (Jul 3):** Practice demo flow: save snippet live → review card → search → show clusters → generate thread. Prepare viva answers: "Why SM-2?", "Compare with Anki", "Scalability?", "AI era relevance?", "Why not pre-trained model?". Commit: `docs: prepare viva question answers`

- [ ] **Day 68 (Jul 4):** Final review of everything. Print and bind 3 copies (golden embossing, black binding). Submit to department. Commit: `docs: final submission preparation`

- [ ] **Day 68b — Sprint 6 Review:** Final merge to `main`. Tag `v1.0.0`. This is the release version.

> **FINAL DEFENSE (~first week of July) — 20 marks**
> Presentation + live demo + viva. The app you've used daily for 6+ weeks IS the demo.
> GitHub history shows 6 sprints, 60+ commits, proper branching — evaluators will see real engineering process.

---

## Quick Reference Commands

```bash
# Start FastAPI dev server
cd apps/api && uvicorn app.main:app --reload --port 8000

# Start Next.js dev server
cd apps/web && npm run dev

# Run Python tests
cd apps/api && pytest -v

# Run frontend tests
cd apps/web && npm run test

# Git workflow
git add -A && git commit -m "type(scope): description" && git push origin dev
```

## Environment Variables

```bash
# apps/api/.env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_key
CORS_ORIGINS=http://localhost:3000,https://codepulse.vercel.app

# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Status

**Current Phase:** Phase 1 — Algorithm Core
**Current Day:** Day 8 (Fri, Apr 24, 2026)
**Last Updated:** Thu, Apr 23, 2026
**Total Progress:** 7/68 tasks completed
**Next milestone:** Proposal Defense (~early May 2026)
