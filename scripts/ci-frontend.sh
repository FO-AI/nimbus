#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/../apps/web"

npm run lint
npm run typecheck
npm run test
npm run build
