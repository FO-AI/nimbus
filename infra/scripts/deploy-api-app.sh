#!/usr/bin/env bash
# Deploy ONLY the API (FastAPI) container app into an existing resource group.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

API_IMAGE=""
ADMIN_GROUP_ID="${ADMIN_GROUP_ID:-}"
FOUNDRY_ENDPOINT="${AZURE_AI_FOUNDRY_ENDPOINT:-}"
FOUNDRY_DEPLOYMENT_NAME="gpt-4o-mini"
FOUNDRY_EMBEDDING_DEPLOYMENT_NAME="text-embedding-3-small"
AI_PROVIDER="foundry"
AUTH_MODE="entra"
SEARCH_ENDPOINT=""
ACR_NAME=""
ENABLE_STORAGE=true
FOUNDRY_PROJECT_NAME="${AZURE_AI_FOUNDRY_PROJECT_NAME:-}"
SEARCH_INDEX="default"
LOG_LEVEL="${LOG_LEVEL:-INFO}"
ENABLE_FOUNDRY_API_KEY=true

usage() {
  cat <<EOF
Deploy the Nimbus API container app (ca-<prefix>-<env>-api).

Requires: identity, observability, registry, storage, postgres, key-vault and
container-apps-env already deployed in the same group (all looked up by name
inside the Bicep template). The image must already be pushed to the ACR — use
a public bootstrap image (mcr.microsoft.com/k8se/quickstart:latest) for the
very first deploy if yours isn't built yet.

Usage: $(basename "$0") -g <resource-group> --api-image <image> [options]

Options:
$(common_options_help)
      --api-image <image>            Container image (required),
                                     e.g. <acr>.azurecr.io/nimbus-api:sha
      --admin-group-id <guid>        Admin Entra group (or set ADMIN_GROUP_ID)
      --foundry-endpoint <url>       Azure AI Foundry endpoint
                                     (or set AZURE_AI_FOUNDRY_ENDPOINT)
      --foundry-deployment <name>    Foundry model deployment (default: gpt-4o-mini)
      --foundry-embedding-deployment <name>
                                     Foundry embedding deployment for RAG
                                     (default: text-embedding-3-small)
      --ai-provider <mock|foundry>   AI provider (default: foundry)
      --auth-mode <entra|disabled>   Auth mode (default: entra; NEVER disable in prod)
      --search-endpoint <url>        AI Search endpoint. Defaults to the saved
                                     output of deploy-search.sh if present,
                                     otherwise empty (search disabled).
      --acr-name <name>              ACR name, if the registry was deployed with
                                     a non-default name. Defaults to the saved
                                     output of deploy-registry.sh if present.
      --no-storage                   Skip the storage account lookup (use if
                                     deploy-storage.sh hasn't been run yet)
      --foundry-project-name <name>  Azure AI Foundry project name
                                     (or set AZURE_AI_FOUNDRY_PROJECT_NAME)
      --search-index <name>          Azure AI Search index name (default: default)
      --log-level <level>            Application log level (or set LOG_LEVEL;
                                     default: INFO)
      --no-foundry-api-key           Skip wiring the foundry-api-key Key Vault
                                     secret (use if deploy-key-vault.sh was run
                                     without --foundry-api-key)

Example:
  $(basename "$0") -g rg-nimbus --api-image myacr.azurecr.io/nimbus-api:latest
EOF
}

SEARCH_ENDPOINT_SET=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --api-image)          API_IMAGE="${2:-}"; shift 2 ;;
    --admin-group-id)     ADMIN_GROUP_ID="${2:-}"; shift 2 ;;
    --foundry-endpoint)   FOUNDRY_ENDPOINT="${2:-}"; shift 2 ;;
    --foundry-deployment) FOUNDRY_DEPLOYMENT_NAME="${2:-}"; shift 2 ;;
    --foundry-embedding-deployment) FOUNDRY_EMBEDDING_DEPLOYMENT_NAME="${2:-}"; shift 2 ;;
    --ai-provider)        AI_PROVIDER="${2:-}"; shift 2 ;;
    --auth-mode)          AUTH_MODE="${2:-}"; shift 2 ;;
    --search-endpoint)    SEARCH_ENDPOINT="${2:-}"; SEARCH_ENDPOINT_SET=true; shift 2 ;;
    --acr-name)           ACR_NAME="${2:-}"; shift 2 ;;
    --no-storage)         ENABLE_STORAGE=false; shift 1 ;;
    --foundry-project-name) FOUNDRY_PROJECT_NAME="${2:-}"; shift 2 ;;
    --search-index)       SEARCH_INDEX="${2:-}"; shift 2 ;;
    --log-level)          LOG_LEVEL="${2:-}"; shift 2 ;;
    --no-foundry-api-key) ENABLE_FOUNDRY_API_KEY=false; shift 1 ;;
    -h|--help) usage; exit 0 ;;
    *) parse_common_arg "$@" || { usage >&2; die "unknown option: $1"; }; shift "$ARG_SHIFT" ;;
  esac
done

[[ -n "$API_IMAGE" ]] || die "--api-image is required"

# If search was deployed via deploy-search.sh, pick its endpoint up from the
# local state file unless explicitly overridden.
if [[ "$SEARCH_ENDPOINT_SET" == false ]]; then
  SEARCH_ENDPOINT="$(state_get search searchEndpoint)"
fi

# Pick up the actual ACR name from deploy-registry.sh's saved outputs.
[[ -n "$ACR_NAME" ]] || ACR_NAME="$(state_get registry registryName)"

run_deployment api-app \
  apiImage="$API_IMAGE" \
  acrName="$ACR_NAME" \
  adminGroupId="$ADMIN_GROUP_ID" \
  aiProvider="$AI_PROVIDER" \
  authMode="$AUTH_MODE" \
  foundryEndpoint="$FOUNDRY_ENDPOINT" \
  foundryDeploymentName="$FOUNDRY_DEPLOYMENT_NAME" \
  foundryEmbeddingDeploymentName="$FOUNDRY_EMBEDDING_DEPLOYMENT_NAME" \
  searchEndpoint="$SEARCH_ENDPOINT" \
  searchIndex="$SEARCH_INDEX" \
  enableStorage="$ENABLE_STORAGE" \
  foundryProjectName="$FOUNDRY_PROJECT_NAME" \
  logLevel="$LOG_LEVEL" \
  enableFoundryApiKey="$ENABLE_FOUNDRY_API_KEY"
