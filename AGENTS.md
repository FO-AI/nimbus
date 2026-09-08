# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Nimbus is an internal AI enablement hub for Finance & Operations staff: a browsable library of
guides and reusable prompts, an AI project inventory fed by a lightweight intake workflow, a
retrieval-grounded assistant with citations, and leadership usage metrics. Stack: **Next.js**
(App Router, TS) frontend, **FastAPI** (Python 3.11) backend, **Microsoft Entra ID** auth,
**Azure AI Foundry** for AI, **Azure PostgreSQL** (SQLAlchemy + Alembic, pgvector for retrieval),
deployed to **Azure Container Apps**. Generated from the `ai-tool-starter` template.

| Surface | Route(s) | Backed by |
| --- | --- | --- |
| Home (browse-first) | `/` | featured `content_items` |
| Guides / prompt library | `/guides`, `/prompts` (+ `[slug]`) | `GET /api/v1/content` |
| Project inventory | `/projects` (+ `inventory`, `[id]`) | `GET/POST/PATCH /api/v1/projects` |
| Propose an AI use case (intake) | `/propose` | `POST /api/v1/projects/intake` |
| Ask (RAG with citations) | `/ask` | `POST /api/v1/ask` + pgvector `content_chunks` |
| Insights (usage metrics) | `/insights` | `GET /api/v1/insights/summary` |

## Architecture

```
Browser ──(MSAL login)──> Microsoft Entra ID
   │  access token (JWT)
   ▼
Next.js frontend  ──HTTPS + Bearer token──>  FastAPI backend
                                               │  validates JWT (issuer/aud/keys)
                                               │  extracts roles/groups
                                               ├─> Azure AI Foundry (via provider)
                                               ├─> Azure PostgreSQL (SQLAlchemy)
                                               ├─> Azure Blob Storage
                                               └─> Azure Key Vault / Managed Identity
```

The frontend **never** calls Azure AI Foundry or any privileged Azure service directly — all
privileged calls go through the backend (`docs/architecture.md`,
`docs/adr/0002-backend-only-ai-access.md`).

**Backend request flow** (`apps/api/app/main.py`): `create_app()` registers
`CorrelationIdMiddleware` → CORS → error handlers, mounts an unauthenticated `health` router and
`api_router` (aggregated in `app/api/v1/router.py`) under the API prefix. There is no global auth
middleware — auth is dependency-injected per route via `Depends(get_current_user)` /
`Depends(require_admin)` (`app/services/identity/current_user.py`). A startup-only lifespan hook
runs content sync then RAG reindexing, both best-effort/non-fatal (skipped when
`environment=="test"`).

**Auth**: `app/core/security.py` validates Entra ID JWTs locally via a cached `PyJWKClient`
(issuer/audience/exp). `AUTH_MODE=disabled` short-circuits to a hardcoded dev principal with
`roles=["user","admin"]` and logs a warning on every request — local/dev only, must never run in
a deployed environment. `require_admin` passes if the user has the `admin` role **or** is in the
Entra group `ADMIN_GROUP_ID`; overage group claims (`_claim_names.groups`) are detected and logged
but not resolved, so group auth fails closed in that case. Admin gating covers triage and project
create/edit/archive/delete; project intake and content reads are open.

**AI provider abstraction**: `app/services/ai/base.py` defines an abstract `AIProvider`
(`chat`, `embed`); `app/services/ai/factory.py` selects `MockAIProvider` vs `AzureFoundryProvider`
based on `AI_PROVIDER` (`mock` | `foundry`), result `lru_cache`d, with the Foundry module
lazy-imported so the mock path has zero Azure SDK dependency. Review
`app/services/ai/foundry_provider.py` and pin the Azure AI SDK version before using it for real.

**Content is git-first**: markdown + YAML frontmatter under `apps/api/content/{guidance,
playbooks, prompts, tools}/` (subdirectories are convention only — sync reads the `kind`
frontmatter field) is upserted into `content_items` by slug/sha256 at API startup and via
`make content-sync` (`app/services/content_sync.py`). Content lives under `apps/api/` specifically
because the API's Docker build context is `apps/api`, so files get baked into the image.

Most of the library is imported rather than written here, so every file may carry a top-level
**`source` block** recording provenance — `mode: link | import | practice | original` plus URL,
publisher, and (for imports) licence and attribution. It is a **closed schema**: an unknown key
fails the sync, because a silently dropped key is a dropped attribution. Validation lives in
`_parse_source` (`content_sync.py`), the shape is documented in `apps/api/content/README.md`, and
the reasoning is in `docs/adr/0004-content-source-provenance.md`. `app/tests/test_content_library.py`
lints the shipped library on every test run — cross-file link integrity, attribution completeness,
and per-kind required attributes.

**Retrieval (`/ask`)** uses **pgvector on the existing Postgres** — Azure AI Search stays off.
`app/services/rag/indexer.py` chunks published content and active projects into `content_chunks`,
incrementally by checksum, and is a Postgres/pgvector-only operation (no-ops on SQLite).
`app/services/rag/retriever.py` uses pgvector on Postgres but falls back to a deterministic
keyword search on SQLite/tests.

**API contract duplication (known issue, not yet resolved)**: the API contract is manually
mirrored in three places — Pydantic schemas (`apps/api/app/schemas/`) →
`packages/api-client/` → `apps/web/src/types/index.ts` + `apps/web/src/lib/api/client.ts`.
`packages/api-client` is meant to be the canonical shared client but is **not** wired as a build
dependency or via OpenAPI codegen; the frontend currently uses its own hand-copied types and a
`client.ts` factory (`getToken` injected, wired to MSAL via the `useApiClient` hook) instead of
importing the package. When changing an API schema, update all three by hand until this is fixed.

**Frontend routing**: `apps/web/src/app/` uses route groups — `(public)/` for the landing page and
`organization/`; `(app)/` for `home`, `ask`, `guides`, `prompts`, `projects`, `propose`,
`insights`, `profile`, each behind its own `layout.tsx`. The root layout wraps everything in
`AuthProvider` (MSAL, `lib/auth/AuthProvider.tsx` + `msalConfig.ts`) plus an
`AuthDisabledBanner` shown when auth is off.

## Project structure

`apps/api/` — FastAPI service: routes in `app/api/v1/routes/`, models/schemas in `app/models/` /
`app/schemas/`, integrations in `app/services/`, Alembic migrations in `app/db/migrations/versions/`
(`NNNN_description.py`, sequential), pytest coverage in `app/tests/`. Git-authored guides and
prompts live in `apps/api/content/`. `apps/web/src/` — App Router pages in `app/`, reusable UI in
`components/`, client utilities in `lib/`, Vitest files beside code in `__tests__/`, Playwright
scenarios in `apps/web/e2e/`. `packages/api-client/` — shared TS API types/client (see duplication
note above). `infra/` — Bicep and deployment scripts (`infra/bicep/modules/` one module per
service, `infra/bicep/deploy/` group-scoped per-service entrypoints, `infra/bicep/main.bicep`
legacy all-in-one used by CI, `infra/scripts/deploy-<service>.sh` wrappers). `docs/` — design notes,
runbooks, and ADRs (`docs/adr/`).

## Build, test, and development commands

- `make dev` (alias `make up`): build and run web, API, and PostgreSQL with Docker — uses
  `AI_PROVIDER=mock` and `AUTH_MODE=disabled`, so no real Azure resources are required.
- `make install-api install-web`: install Python (venv) and Node dependencies.
- `make local-up`: run API (`uvicorn --reload`) and web (`npm run dev`) directly against a running
  db, without rebuilding containers.
- `make test`: run pytest and Vitest suites; `make test-api` / `make test-web` individually;
  `make e2e` for Playwright.
- `make lint typecheck`: frontend linting and strict TypeScript checks.
- `make fmt`: format and auto-fix backend Python with Ruff.
- `cd apps/web && npm run build`: verify a production Next.js build.
- `make migrate`: apply Alembic migrations to the configured database.
- `make content-sync`: sync `apps/api/content/` markdown into the database.
- `make reindex`: rebuild the RAG index (`app/services/rag/indexer.py`).
- `make kill`: force-kill anything left on local dev ports 8000/3000.

Run `make help` for the full command list. Single-test invocations:
`cd apps/api && pytest app/tests/path/to/test_file.py::test_name` and
`cd apps/web && npx vitest run path/to/file.test.tsx`.

## Coding style & naming conventions

Python targets 3.11, four-space indentation, Ruff line-length 100, lint rules `E,F,I,UP,B`,
sorted imports, `snake_case` modules/functions. TypeScript is `strict: true` with
`noUncheckedIndexedAccess: true`; two-space indentation, `PascalCase` React components,
`camelCase` functions, and the `@/` alias (`./src/*`). Keep route-specific code near its App
Router page and shared behavior in `components/` or `lib/`.

## Testing guidelines

Name backend tests `test_*.py` (pytest, `asyncio_mode=auto`, under `app/tests/`), Vitest files
`*.test.ts(x)` (jsdom, excludes `e2e/**`), and Playwright flows `*.spec.ts` (smoke-test only, runs
`npm run dev` with `NEXT_PUBLIC_AUTH_DISABLED=true` so no real Entra config is needed). Backend
tests use the mock AI provider and an in-memory SQLite database — no Azure credentials required.
Add tests for changed behavior and regressions. Before opening a PR, run `make test`,
`make lint typecheck`, and any affected E2E flow.

## Environment variables

Copy `.env.example` to `.env` (backend) and `apps/web/.env.local.example` to
`apps/web/.env.local` (frontend). Key ones: `AI_PROVIDER` (`mock`|`foundry`), `AUTH_MODE`
(`disabled`|`entra` — disabled is local-only and logs a warning per request), `AZURE_TENANT_ID`,
`ENTRA_BACKEND_CLIENT_ID`, `ENTRA_BACKEND_APP_ID_URI`, `DATABASE_URL`, `ADMIN_GROUP_ID`,
`AZURE_AI_FOUNDRY_ENDPOINT`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_ENTRA_CLIENT_ID`,
`NEXT_PUBLIC_ENTRA_TENANT_ID`, `NEXT_PUBLIC_ENTRA_API_SCOPE`.

## Deployment

CI deploys via GitHub Actions using OIDC federation (no stored Azure passwords) and the legacy
all-in-one Bicep template (`.github/workflows/deploy-dev.yml`). Manual deployment is per-service
into a manually created resource group, run in dependency order (identity →
observability/registry/storage/postgres → key-vault → container-apps-env → api/web apps); each
`infra/scripts/deploy-<service>.sh` is idempotent. Full flow: `docs/runbook.md`.

## Commit & pull request guidelines

History favors short, scope-focused subjects such as `project inventory added. RAG working`; keep
the first line concise and describe one logical change. PRs should explain intent and notable
design decisions, link the relevant issue, list verification commands, and include screenshots for
UI changes. Call out migrations, environment-variable changes, or deployment impact explicitly.
Never commit `.env`, `.env.local`, credentials, tokens, or real Azure identifiers.
