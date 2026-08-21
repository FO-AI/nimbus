# Repository Guidelines

## Project Structure & Module Organization

Nimbus is a small monorepo. `apps/api/` contains the FastAPI service: routes live in `app/api/v1/routes/`, domain models and schemas in `app/models/` and `app/schemas/`, integrations in `app/services/`, migrations in `app/db/migrations/`, and pytest coverage in `app/tests/`. Git-authored guides and prompts belong in `apps/api/content/`. The Next.js frontend is under `apps/web/src/`, with App Router pages in `app/`, reusable UI in `components/`, client utilities in `lib/`, Vitest files beside code in `__tests__/`, and Playwright scenarios in `apps/web/e2e/`. Shared TypeScript API types live in `packages/api-client/`; Bicep and deployment scripts live in `infra/`; design notes and runbooks live in `docs/`.

## Build, Test, and Development Commands

- `make dev`: build and run web, API, and PostgreSQL with Docker.
- `make install-api install-web`: install Python and Node dependencies.
- `make test`: run pytest and Vitest suites; use `make e2e` for Playwright.
- `make lint typecheck`: run frontend linting and strict TypeScript checks.
- `make fmt`: format and auto-fix backend Python with Ruff.
- `cd apps/web && npm run build`: verify a production Next.js build.
- `make migrate`: apply Alembic migrations to the configured database.

Run `make help` for the full command list.

## Coding Style & Naming Conventions

Python targets 3.11, uses four-space indentation, a 100-character Ruff line limit, sorted imports, and `snake_case` modules/functions. TypeScript is strict; use two-space indentation, `PascalCase` React components, `camelCase` functions, and the `@/` source alias. Keep route-specific code near its App Router page and shared behavior in `components/` or `lib/`.

## Testing Guidelines

Name backend tests `test_*.py`, Vitest files `*.test.ts(x)`, and Playwright flows `*.spec.ts`. Add tests for changed behavior and regressions. Backend tests use mock AI and in-memory SQLite, so they should not require Azure credentials. Before opening a PR, run `make test`, `make lint typecheck`, and any affected E2E flow.

## Commit & Pull Request Guidelines

History favors short, scope-focused subjects such as `project inventory added. RAG working`; keep the first line concise and describe one logical change. PRs should explain intent and notable design decisions, link the relevant issue, list verification commands, and include screenshots for UI changes. Call out migrations, environment-variable changes, or deployment impact explicitly. Never commit `.env`, `.env.local`, credentials, tokens, or real Azure identifiers.
