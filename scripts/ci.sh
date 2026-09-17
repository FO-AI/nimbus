#!/usr/bin/env bash
# Run one named CI check. No cloud access. Part of the FO-AI repository script
# contract (scripts/ci.sh, scripts/publish.sh, scripts/cd.sh); see the
# FO-AI/automation README. Run after the selected check's dependencies are installed.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

frontend() (
  cd apps/web
  npm run lint
  npm run typecheck
  npm run test
  npm run build
)

backend() (
  # Mock AI, in-memory SQLite, auth off: set here rather than in the workflow so the
  # check behaves identically on a laptop and in CI. No Azure credentials involved.
  export AI_PROVIDER=mock AUTH_MODE=disabled
  cd apps/api
  ruff check app
  pytest
  # Deployment orchestration tests run cd.sh against fake az/gh/curl executables.
  python ../../scripts/tests/test_deploy.py
)

case "${1:-}" in
  backend) backend ;;
  frontend) frontend ;;
  *) echo "Usage: bash scripts/ci.sh {backend|frontend}" >&2; exit 2 ;;
esac
