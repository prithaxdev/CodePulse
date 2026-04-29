FROM python:3.12-slim

WORKDIR /app

# Install deps first (better layer caching)
COPY pyproject.toml .
RUN pip install --no-cache-dir -e .

COPY . .

# PORT is injected by Railway at runtime
EXPOSE 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
