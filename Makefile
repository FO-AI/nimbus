# Nimbus — developer shortcuts.
# Run `make help` to list targets.

.DEFAULT_GOAL := help
SHELL := /bin/bash
PYTHON ?= python3.11

.PHONY: help dev up down logs api web install-api install-web \
        test test-api test-web e2e lint typecheck fmt migrate content-sync reindex kill local-up

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

dev: up ## Alias for `up` (full local stack)

up: ## Start frontend + backend + db locally (mock AI, disabled auth)
	docker compose up --build

down: ## Stop and remove the local stack
	docker compose down -v
local-up: ## Start frontend + backend + docker db
# 	docker compose up -d db
	@trap 'echo; echo "Stopping..."; kill 0' INT TERM EXIT; \
	(cd apps/api && . .venv/bin/activate && exec uvicorn app.main:app --reload) & \
	(cd apps/web && exec npm run dev) & \
	wait

kill: ## Force-kill anything left on the local dev ports (api:8000, web:3000)
	@lsof -ti :8000 -sTCP:LISTEN | xargs kill -9 2>/dev/null || true
	@lsof -ti :3000 -sTCP:LISTEN | xargs kill -9 2>/dev/null || true
	@pkill -f "uvicorn app.main:app" 2>/dev/null || true
	@pkill -f "next dev" 2>/dev/null || true
	@echo "Killed anything on ports 8000/3000 and matching uvicorn/next processes."

logs: ## Tail logs from the local stack
	docker compose logs -f

install-api: ## Install backend dependencies into a venv
	cd apps/api && $(PYTHON) -m venv .venv && . .venv/bin/activate && pip install -e ".[dev, foundry]"

install-web: ## Install frontend dependencies
	cd apps/web && npm install

api: ## Run the backend with autoreload (needs a reachable DB)
	cd apps/api && . .venv/bin/activate && uvicorn app.main:app --reload

web: ## Run the frontend dev server
	cd apps/web && npm run dev

migrate: ## Apply database migrations
	cd apps/api && . .venv/bin/activate && alembic upgrade head

content-sync: ## Sync apps/api/content markdown into the database
	cd apps/api && . .venv/bin/activate && python -m app.services.content_sync

test: test-api test-web ## Run all unit/component tests

test-api: ## Run backend tests (mock AI, in-memory DB)
	cd apps/api && . .venv/bin/activate && pytest

test-web: ## Run frontend unit/component tests
	cd apps/web && npm run test

e2e: ## Run Playwright smoke tests
	cd apps/web && npm run test:e2e

lint: ## Lint frontend
	cd apps/web && npm run lint

typecheck: ## Type-check frontend
	cd apps/web && npm run typecheck

fmt: ## Format backend (ruff)
	cd apps/api && . .venv/bin/activate && ruff format app && ruff check --fix app

reindex: ## Reindex the retrieval index
	cd apps/api && . .venv/bin/activate && python -m app.services.rag.indexer