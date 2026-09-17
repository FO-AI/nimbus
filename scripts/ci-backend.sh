#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/../apps/api"

ruff check app
pytest
python ../../scripts/tests/test_deploy.py
