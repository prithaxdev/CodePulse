# CodePulse — Development Guide

Developer learning retention platform using spaced repetition (SM-2), TF-IDF search, K-means clustering, and Levenshtein duplicate detection.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4, Shadcn/UI |
| Auth | Clerk (Google OAuth) |
| Database | Supabase (PostgreSQL) |
| Algorithm API | FastAPI (Python 3.12) |
| Package manager | pnpm (workspace monorepo) |
| Deployment | Vercel (frontend) · Railway (API) |

---

## Prerequisites

- Node.js 20+
- Python 3.12+
- pnpm — `npm install -g pnpm`
- Supabase CLI — `brew install supabase/tap/supabase`

---

## Running Locally

### 1. Clone and install

```bash
git clone git@github.com:prithaxdev/CodePulse.git
cd CodePulse
pnpm install
```

### 2. Set up environment variables

Create `apps/web/.env.local`:

```bash
# Supabase — get from supabase.com → your project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk — get from clerk.com → your app → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# FastAPI — local dev URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Create `apps/api/.env`:

```bash
# Supabase (same values as above)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_key

# CORS — allow local Next.js dev server
CORS_ORIGINS=http://localhost:3000
```

### 3. Set up the database

Link Supabase CLI to your project:

```bash
supabase login
supabase link --project-ref your-project-ref
```

Run the schema (creates users, snippets, review_logs tables):

```bash
supabase db query "$(cat supabase/schema.sql)" --linked
```

> If `supabase/schema.sql` doesn't exist yet, copy the SQL from the Database Schema section below and paste it into the Supabase SQL editor at supabase.com.

### 4. Start the FastAPI backend

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
uvicorn app.main:app --reload --port 8000
```

API docs available at: **http://localhost:8000/docs**

### 5. Start the Next.js frontend

In a new terminal:

```bash
cd apps/web
pnpm dev
```

App runs at: **http://localhost:3000**

---

## Clerk Webhook (local dev)

The Clerk webhook syncs new users to Supabase. For local testing, use the Clerk CLI to tunnel events to localhost:

```bash
npx @clerk/cli@latest webhooks listen \
  --webhook-secret whsec_your_secret \
  http://localhost:3000/api/webhooks/clerk
```

---

## Project Structure

```
CodePulse/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── app/
│   │   │   ├── (app)/          # Authenticated routes (dashboard, review, search…)
│   │   │   ├── (auth)/         # Sign-in / sign-up pages
│   │   │   └── api/webhooks/   # Clerk webhook endpoint
│   │   ├── components/         # UI components (sidebar, due-badge…)
│   │   ├── hooks/              # TanStack Query hooks
│   │   ├── lib/                # Supabase clients, API client
│   │   └── types/              # TypeScript types
│   │
│   └── api/                    # FastAPI algorithm engine
│       ├── app/
│       │   ├── algorithms/     # SM-2, TF-IDF, K-means, Levenshtein, summarizer
│       │   ├── routes/         # FastAPI route handlers
│       │   └── models/         # Pydantic schemas
│       └── tests/              # pytest test suite
│
├── package.json                # Workspace root
└── pnpm-workspace.yaml         # pnpm monorepo config
```

---

## Available Commands

### Frontend

```bash
pnpm --filter web dev           # Start dev server
pnpm --filter web build         # Production build
pnpm --filter web typecheck     # TypeScript check
pnpm --filter web lint          # ESLint
```

### Backend

```bash
cd apps/api
pytest -v                       # Run all tests
pytest tests/test_sm2.py -v     # Run specific test file
uvicorn app.main:app --reload   # Start dev server
```

### Database

```bash
supabase db query "SELECT * FROM users;" --linked      # Run SQL
supabase db pull --linked                              # Pull remote schema
```

---

## Database Schema

```sql
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

CREATE TABLE snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  code TEXT,
  description TEXT,
  language TEXT DEFAULT 'typescript',
  tags TEXT[] DEFAULT '{}',
  ease_factor FLOAT DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE review_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 5),
  ease_factor_after FLOAT NOT NULL,
  interval_after INTEGER NOT NULL,
  reviewed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_snippets_next_review ON snippets(user_id, next_review);
CREATE INDEX idx_snippets_user ON snippets(user_id);
CREATE INDEX idx_snippets_tags ON snippets USING GIN(tags);
CREATE INDEX idx_review_logs_snippet ON review_logs(snippet_id);
CREATE INDEX idx_review_logs_user ON review_logs(user_id, reviewed_at);
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/review/schedule` | SM-2 spaced repetition scheduling |
| POST | `/api/search` | TF-IDF semantic search |
| POST | `/api/clusters` | K-means topic clustering |
| POST | `/api/snippets/check-duplicate` | Levenshtein duplicate detection |
| POST | `/api/summarize` | Extractive text summarization (MMR) |

---

## Production

### Frontend — Vercel

The frontend auto-deploys from the `dev` branch on every push.

**Manual deploy:**
```bash
cd apps/web
npx vercel deploy --prod --yes
```

**Environment variables** are managed in the Vercel dashboard or via:
```bash
npx vercel env ls
npx vercel env add KEY production
```

### Backend — Railway

Coming in Day 19. The FastAPI app deploys from `apps/api/Dockerfile`.

**After Railway setup**, update `NEXT_PUBLIC_API_URL` in Vercel:
```bash
printf "https://your-app.railway.app" | npx vercel env add NEXT_PUBLIC_API_URL production --force
npx vercel deploy --prod --yes
```

### Production URLs

| Service | URL |
|---------|-----|
| Frontend | https://web-two-beta-49.vercel.app |
| Backend API | TBD (Railway — Day 19) |
| Database | https://supabase.com/dashboard/project/dkbsdgsuqqegjvvojfks |

---

## Branching Strategy

```
main          ← stable, tagged releases (v0.1.0, v0.2.0…)
  └── dev     ← integration branch, all features merge here
        ├── sprint-2/feat-clerk-auth
        ├── sprint-2/feat-api-hooks
        └── sprint-2/feat-app-layout
```

Never commit directly to `main` or `dev`. Always work on a `sprint-N/type-description` branch.
