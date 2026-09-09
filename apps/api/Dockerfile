# Nimbus backend image.
FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install dependencies first for better layer caching.
COPY pyproject.toml ./
COPY alembic.ini ./
COPY app ./app
RUN pip install --upgrade pip && pip install ".[postgres,foundry]"

# Git-authored content, synced into the DB at startup (services/content_sync.py).
COPY content ./content

EXPOSE 8000

# Migrate, seed, then serve. The content sync and the RAG reindex also run in
# the app's lifespan hook, which fires once per uvicorn worker — with several
# workers they race, and the losers log a swallowed IntegrityError after having
# already paid for a full pass of embeddings. Running both once here means one
# embedding pass on a cold database; each worker's hook then finds everything
# unchanged and no-ops. The hook stays in place for `make dev` and for workers
# that start later.
#
# Migrations are fail-closed: serving on the wrong schema is worse than not
# serving. The two seed steps are not — they stay best-effort, as the lifespan
# hook is, so one malformed content file cannot keep the API from booting. If
# either fails here the per-worker hooks still try, exactly as they do today.
#
# 4 workers is a reasonable default for Container Apps; tune per workload.
CMD ["/bin/bash", "-lc", "alembic upgrade head && { python -m app.services.content_sync || echo 'pre-start content sync failed; workers will retry'; } && { python -m app.services.rag.indexer || echo 'pre-start reindex failed; workers will retry'; } && uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4"]
