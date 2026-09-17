#!/usr/bin/env bash
# Promote the images scripts/publish.sh pushed for $IMAGE_TAG, by digest, then verify.
# Runs inside the shared FO-AI deploy-azure wrapper, which has already checked out the
# commit, rejected a stale main, and signed in to Azure. Never builds.
#
# Part of the FO-AI repository script contract (scripts/ci.sh, scripts/publish.sh,
# scripts/cd.sh); see the FO-AI/automation README.
#
# From the wrapper: DEPLOY_SHA, IMAGE_TAG, GH_TOKEN, DEPLOYMENT_VARS_JSON,
#                   API_ENV_FILE, WEB_ENV_FILE.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

: "${RUNNER_TEMP:?RUNNER_TEMP is required}"
: "${GITHUB_STEP_SUMMARY:?GITHUB_STEP_SUMMARY is required}"
: "${IMAGE_TAG:?IMAGE_TAG must be the source commit selected by the shared workflow}"
: "${DEPLOY_SHA:?DEPLOY_SHA is required}"
: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
: "${GH_TOKEN:?GH_TOKEN is required for the final main-branch check}"
if [[ ! "$IMAGE_TAG" =~ ^[0-9a-f]{40}$ ]]; then
  echo '::error::IMAGE_TAG must be a full commit SHA; publish.sh tags images by it'
  exit 1
fi
# The shared job resolves vars after entering dev, so environment variables can
# override repository variables. Explicit command environment overrides win.
for name in RESOURCE_GROUP ACR_NAME KEY_VAULT_NAME API_APP_NAME WEB_APP_NAME API_URL AZURE_WEB_URL WEB_URL; do
  if [[ -z "${!name:-}" ]]; then
    value="$(python3 - "$name" <<'PY'
import json
import os
import sys

value = json.loads(os.environ.get("DEPLOYMENT_VARS_JSON") or "{}").get(sys.argv[1], "")
if not isinstance(value, str):
    raise ValueError(f"Deployment variable {sys.argv[1]} must be a string")
print(value)
PY
)"
    export "$name=$value"
  fi
done
for name in RESOURCE_GROUP ACR_NAME KEY_VAULT_NAME API_APP_NAME WEB_APP_NAME API_URL AZURE_WEB_URL; do
  if [[ -z "${!name:-}" ]]; then
    printf '::error::Set repository or dev environment variable %s before enabling deployment.\n' "$name"
    exit 1
  fi
done
export WEB_URL="${WEB_URL:-$AZURE_WEB_URL}"

# Keep source files private and remove all temporary secrets on success or failure.
cleanup() {
  rm -f "$RUNNER_TEMP/nimbus-api.env" "$RUNNER_TEMP/nimbus-web.env" \
    "$RUNNER_TEMP/database-url" "$RUNNER_TEMP/foundry-api-key"
}
trap cleanup EXIT
[[ -n "${API_ENV_FILE:-}" ]] || { echo "::error::Missing dev secret API_ENV_FILE"; exit 1; }
[[ -n "${WEB_ENV_FILE:-}" ]] || { echo "::error::Missing dev secret WEB_ENV_FILE"; exit 1; }
umask 077
printf '%s\n' "$API_ENV_FILE" > "$RUNNER_TEMP/nimbus-api.env"
printf '%s\n' "$WEB_ENV_FILE" > "$RUNNER_TEMP/nimbus-web.env"
unset API_ENV_FILE WEB_ENV_FILE

# Subshells preserve the original workflow's separate-step environment scope.

echo "::group::Validate targets and configuration"
(
  set -a
  source "$RUNNER_TEMP/nimbus-api.env"
  source "$RUNNER_TEMP/nimbus-web.env"
  set +a

  : "${AZURE_TENANT_ID:?AZURE_TENANT_ID is required in API_ENV_FILE}"
  : "${ENTRA_BACKEND_CLIENT_ID:?ENTRA_BACKEND_CLIENT_ID is required in API_ENV_FILE}"
  : "${ENTRA_BACKEND_APP_ID_URI:?ENTRA_BACKEND_APP_ID_URI is required in API_ENV_FILE}"
  : "${NEXT_PUBLIC_ENTRA_CLIENT_ID:?NEXT_PUBLIC_ENTRA_CLIENT_ID is required in WEB_ENV_FILE}"
  : "${NEXT_PUBLIC_ENTRA_TENANT_ID:?NEXT_PUBLIC_ENTRA_TENANT_ID is required in WEB_ENV_FILE}"
  : "${NEXT_PUBLIC_ENTRA_API_SCOPE:?NEXT_PUBLIC_ENTRA_API_SCOPE is required in WEB_ENV_FILE}"
  : "${DEV_DATABASE_URL:?DEV_DATABASE_URL is required in API_ENV_FILE}"
  : "${AZURE_AI_FOUNDRY_API_KEY:?AZURE_AI_FOUNDRY_API_KEY is required in API_ENV_FILE}"

  [[ "${AUTH_MODE:-}" == "entra" ]] || {
    echo "::error::AUTH_MODE must be entra for an Azure deployment"
    exit 1
  }
  [[ "$DEV_DATABASE_URL" != *"localhost"* && "$DEV_DATABASE_URL" != *"127.0.0.1"* ]] || {
    echo "::error::DEV_DATABASE_URL must point to the deployed database"
    exit 1
  }

  az group show --name "$RESOURCE_GROUP" --output none
  az acr show --name "$ACR_NAME" --resource-group "$RESOURCE_GROUP" --output none
  az keyvault show --name "$KEY_VAULT_NAME" --resource-group "$RESOURCE_GROUP" --output none
  az containerapp show --name "$API_APP_NAME" --resource-group "$RESOURCE_GROUP" --output none
  az containerapp show --name "$WEB_APP_NAME" --resource-group "$RESOURCE_GROUP" --output none
)
echo "::endgroup::"

# Resolve the digests publish.sh pushed for this commit. The tag only says which build
# to look up; each revision is created from the digest, so its image string is immutable
# and a later re-push of the same tag cannot change what is running. Always read from
# ACR: nothing in the environment may substitute a digest.
echo "::group::Resolve published image digests"
API_DIGEST=""
WEB_DIGEST=""
for service in api web; do
  if ! digest="$(az acr repository show --name "$ACR_NAME" \
      --image "nimbus-${service}:${IMAGE_TAG}" --query digest -o tsv)"; then
    printf '::error::No image nimbus-%s:%s in %s; publish must succeed before deploy\n' \
      "$service" "$IMAGE_TAG" "$ACR_NAME"
    exit 1
  fi
  if [[ ! "$digest" =~ ^sha256:[0-9a-f]{64}$ ]]; then
    printf '::error::nimbus-%s:%s did not resolve to a sha256 digest (got %q)\n' \
      "$service" "$IMAGE_TAG" "$digest"
    exit 1
  fi
  printf 'nimbus-%s@%s\n' "$service" "$digest"
  if [[ "$service" == api ]]; then API_DIGEST="$digest"; else WEB_DIGEST="$digest"; fi
done
API_IMAGE="$ACR_NAME.azurecr.io/nimbus-api@$API_DIGEST"
WEB_IMAGE="$ACR_NAME.azurecr.io/nimbus-web@$WEB_DIGEST"
echo "::endgroup::"

# Main may have advanced since the wrapper's check while CI published and we validated.
# Recheck immediately before the first change to Azure (the Key Vault sync); a GitHub API
# failure also stops the deploy.
main_sha="$(gh api "repos/${GITHUB_REPOSITORY}/git/ref/heads/main" --jq '.object.sha')"
if [[ "$DEPLOY_SHA" != "$main_sha" ]]; then
  printf '::error::Refusing stale deployment: %s is no longer main (%s).\n' "$DEPLOY_SHA" "$main_sha"
  exit 1
fi

echo "::group::Synchronize application secrets to Key Vault"
(
  set -a
  source "$RUNNER_TEMP/nimbus-api.env"
  set +a

  umask 077
  printf '%s' "$DEV_DATABASE_URL" > "$RUNNER_TEMP/database-url"
  printf '%s' "$AZURE_AI_FOUNDRY_API_KEY" > "$RUNNER_TEMP/foundry-api-key"

  az keyvault secret set \
    --vault-name "$KEY_VAULT_NAME" \
    --name database-url \
    --file "$RUNNER_TEMP/database-url" \
    --output none
  az keyvault secret set \
    --vault-name "$KEY_VAULT_NAME" \
    --name foundry-api-key \
    --file "$RUNNER_TEMP/foundry-api-key" \
    --output none

  rm -f "$RUNNER_TEMP/database-url" "$RUNNER_TEMP/foundry-api-key"
)
echo "::endgroup::"

echo "::group::Deploy API revision"
(
  set -a
  source "$RUNNER_TEMP/nimbus-api.env"
  set +a

  api_env=(
    "ENVIRONMENT=dev"
    "DB_MODE=dev"
    "LOG_LEVEL=${LOG_LEVEL:-INFO}"
    "AI_PROVIDER=${AI_PROVIDER:-foundry}"
    "AUTH_MODE=$AUTH_MODE"
    "AZURE_TENANT_ID=$AZURE_TENANT_ID"
    "ENTRA_BACKEND_CLIENT_ID=$ENTRA_BACKEND_CLIENT_ID"
    "ENTRA_BACKEND_APP_ID_URI=$ENTRA_BACKEND_APP_ID_URI"
    "ADMIN_GROUP_ID=${ADMIN_GROUP_ID:-}"
    "CORS_ALLOW_ORIGINS=$WEB_URL,$AZURE_WEB_URL"
    "AZURE_AI_FOUNDRY_ENDPOINT=${AZURE_AI_FOUNDRY_ENDPOINT:-}"
    "AZURE_AI_FOUNDRY_PROJECT_NAME=${AZURE_AI_FOUNDRY_PROJECT_NAME:-}"
    "AZURE_AI_FOUNDRY_DEPLOYMENT_NAME=${AZURE_AI_FOUNDRY_CHAT_DEPLOYMENT_NAME:-gpt-4o-mini}"
    "AZURE_AI_FOUNDRY_EMBEDDING_DEPLOYMENT_NAME=${AZURE_AI_FOUNDRY_EMBEDDING_DEPLOYMENT_NAME:-text-embedding-3-small}"
    "AZURE_AI_FOUNDRY_API_VERSION=${AZURE_AI_FOUNDRY_API_VERSION:-2024-08-01-preview}"
    "AZURE_STORAGE_ACCOUNT_URL=${AZURE_STORAGE_ACCOUNT_URL:-}"
    "AZURE_STORAGE_CONTAINER=${AZURE_STORAGE_CONTAINER:-uploads}"
    "AZURE_SEARCH_ENDPOINT=${AZURE_SEARCH_ENDPOINT:-}"
    "AZURE_SEARCH_INDEX=${AZURE_SEARCH_INDEX:-default}"
  )

  az containerapp update \
    --name "$API_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --image "$API_IMAGE" \
    --set-env-vars "${api_env[@]}" \
    --output none
)
echo "::endgroup::"

echo "::group::Deploy web revision"
(
  set -a
  source "$RUNNER_TEMP/nimbus-web.env"
  set +a

  web_env=(
    "NEXT_PUBLIC_API_BASE_URL=$API_URL"
    "NEXT_PUBLIC_AUTH_DISABLED=false"
    "NEXT_PUBLIC_ENTRA_CLIENT_ID=$NEXT_PUBLIC_ENTRA_CLIENT_ID"
    "NEXT_PUBLIC_ENTRA_TENANT_ID=$NEXT_PUBLIC_ENTRA_TENANT_ID"
    "NEXT_PUBLIC_ENTRA_REDIRECT_URI=$WEB_URL"
    "NEXT_PUBLIC_ENTRA_API_SCOPE=$NEXT_PUBLIC_ENTRA_API_SCOPE"
  )

  az containerapp update \
    --name "$WEB_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --image "$WEB_IMAGE" \
    --set-env-vars "${web_env[@]}" \
    --output none
)
echo "::endgroup::"

echo "::group::Verify deployment"
(
  # The API seeds itself before it binds: migrate, sync the content
  # library, then embed it. On a cold index that is one Foundry call per
  # content item, so a deploy that adds a lot of content can take a few
  # minutes to answer — far longer than the web container, which starts
  # straight away. Budget 5 minutes here so a slow first boot reads as
  # slow rather than as a failed deploy.
  curl --fail --silent --show-error \
    --retry 30 --retry-delay 10 --retry-all-errors \
    "$API_URL/health/ready" > /dev/null
  # Web has no such startup work; keep its budget short so a genuine
  # failure surfaces quickly.
  curl --fail --silent --show-error \
    --retry 12 --retry-delay 10 --retry-all-errors \
    "$AZURE_WEB_URL" > /dev/null
)
echo "::endgroup::"

echo "::group::Deployment summary"
(
  {
    echo "### Nimbus dev deployed"
    echo "- Commit: \`$DEPLOY_SHA\`"
    echo "- API image: \`$API_IMAGE\`"
    echo "- Web image: \`$WEB_IMAGE\`"
    echo "- Web: $WEB_URL"
    echo "- API: $API_URL"
  } >> "$GITHUB_STEP_SUMMARY"
)
echo "::endgroup::"
