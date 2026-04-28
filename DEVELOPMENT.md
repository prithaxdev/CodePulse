# Running CodePulse Locally

## 1. Install dependencies

```bash
pnpm install
```

## 2. Start the frontend

```bash
cd apps/web
pnpm dev
```

Opens at **http://localhost:3000**

## 3. Start the backend (algorithm API)

```bash
cd apps/api
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

API docs at **http://localhost:8000/docs**

## 4. Run backend tests

```bash
cd apps/api
source .venv/bin/activate
pytest -v
```

---

# Production

| What | URL |
|------|-----|
| Frontend | https://web-two-beta-49.vercel.app |
| Database | https://supabase.com/dashboard/project/dkbsdgsuqqegjvvojfks |
| API | TBD — Railway (Day 19) |

## Deploy frontend

```bash
cd apps/web
npx vercel deploy --prod --yes
```

## Query the database

```bash
supabase db query "SELECT * FROM users;" --linked
supabase db query "SELECT * FROM snippets;" --linked
supabase db query "SELECT * FROM review_logs;" --linked
```
