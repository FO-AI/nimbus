#!/usr/bin/env bash
# Run from the Nimbus repository root after Azure OIDC login.
set -euo pipefail

: "${RUNNER_TEMP:?RUNNER_TEMP is required}"
: "${GITHUB_STEP_SUMMARY:?GITHUB_STEP_SUMMARY is required}"
: "${IMAGE_TAG:?IMAGE_TAG must be the source commit selected by the shared workflow}"
: "${DEPLOY_SHA:?DEPLOY_SHA is required}"
: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
: "${GH_TOKEN:?GH_TOKEN is required for the final main-branch check}"
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

echo "::group::Build API image in ACR"
(
  az acr build \
    --registry "$ACR_NAME" \
    --image "nimbus-api:$IMAGE_TAG" \
    apps/api
)
echo "::endgroup::"

echo "::group::Build web image in ACR"
(
  set -a
  source "$RUNNER_TEMP/nimbus-web.env"
  set +a

  az acr build \
    --registry "$ACR_NAME" \
    --image "nimbus-web:$IMAGE_TAG" \
    --build-arg "NEXT_PUBLIC_API_BASE_URL=$API_URL" \
    --build-arg "NEXT_PUBLIC_AUTH_DISABLED=false" \
    --build-arg "NEXT_PUBLIC_ENTRA_CLIENT_ID=$NEXT_PUBLIC_ENTRA_CLIENT_ID" \
    --build-arg "NEXT_PUBLIC_ENTRA_TENANT_ID=$NEXT_PUBLIC_ENTRA_TENANT_ID" \
    --build-arg "NEXT_PUBLIC_ENTRA_REDIRECT_URI=$WEB_URL" \
    --build-arg "NEXT_PUBLIC_ENTRA_API_SCOPE=$NEXT_PUBLIC_ENTRA_API_SCOPE" \
    apps/web
)
echo "::endgroup::"

# Main may have advanced while ACR built the images. Recheck before changing
# application secrets or running revisions; an API failure also stops the deploy.
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
    --image "$ACR_NAME.azurecr.io/nimbus-api:$IMAGE_TAG" \
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
    --image "$ACR_NAME.azurecr.io/nimbus-web:$IMAGE_TAG" \
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
    echo "- Image tag: \`$IMAGE_TAG\`"
    echo "- Web: $WEB_URL"
    echo "- API: $API_URL"
  } >> "$GITHUB_STEP_SUMMARY"
)
echo "::endgroup::"
