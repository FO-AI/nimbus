#!/usr/bin/env bash
# Build every Nimbus image for $IMAGE_TAG in ACR as nimbus-<service>:$IMAGE_TAG and prove
# both pushed. Publishes only; it never touches a container app. Promotion is scripts/cd.sh.
#
# Part of the FO-AI repository script contract (scripts/ci.sh, scripts/publish.sh,
# scripts/cd.sh); see the FO-AI/automation README.
#
# Needs: az signed in (OIDC in CI, `az login` on a laptop) with build rights on ACR_NAME,
#        ACR_NAME, IMAGE_TAG (a full commit SHA), and the five NEXT_PUBLIC_* values below.
#        Next.js inlines NEXT_PUBLIC_* at `next build`, so they must be baked into the web
#        image. None is a secret (client/tenant IDs and URLs); in CI they are repository
#        variables, because this job runs outside the dev environment and cannot read
#        WEB_ENV_FILE. Builds run in ACR Tasks, so no local Docker is required.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

for name in ACR_NAME IMAGE_TAG \
    NEXT_PUBLIC_API_BASE_URL NEXT_PUBLIC_ENTRA_CLIENT_ID NEXT_PUBLIC_ENTRA_TENANT_ID \
    NEXT_PUBLIC_ENTRA_REDIRECT_URI NEXT_PUBLIC_ENTRA_API_SCOPE; do
  if [[ -z "${!name:-}" ]]; then
    printf '::error::Missing publish setting: %s (set it as a repository variable)\n' "$name"
    exit 1
  fi
done
if [[ ! "$IMAGE_TAG" =~ ^[0-9a-f]{40}$ ]]; then
  echo '::error::IMAGE_TAG must be a full commit SHA; cd.sh looks images up by that tag'
  exit 1
fi

echo "::group::Build nimbus-api:${IMAGE_TAG} in ACR"
az acr build \
  --registry "$ACR_NAME" \
  --image "nimbus-api:${IMAGE_TAG}" \
  apps/api
echo "::endgroup::"

echo "::group::Build nimbus-web:${IMAGE_TAG} in ACR"
az acr build \
  --registry "$ACR_NAME" \
  --image "nimbus-web:${IMAGE_TAG}" \
  --build-arg "NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}" \
  --build-arg "NEXT_PUBLIC_AUTH_DISABLED=false" \
  --build-arg "NEXT_PUBLIC_ENTRA_CLIENT_ID=${NEXT_PUBLIC_ENTRA_CLIENT_ID}" \
  --build-arg "NEXT_PUBLIC_ENTRA_TENANT_ID=${NEXT_PUBLIC_ENTRA_TENANT_ID}" \
  --build-arg "NEXT_PUBLIC_ENTRA_REDIRECT_URI=${NEXT_PUBLIC_ENTRA_REDIRECT_URI}" \
  --build-arg "NEXT_PUBLIC_ENTRA_API_SCOPE=${NEXT_PUBLIC_ENTRA_API_SCOPE}" \
  apps/web
echo "::endgroup::"

# `az acr build` leaves nothing on this machine to run, so the smoke test is the
# registry's word that both tags exist and resolve to real digests, which is exactly
# what cd.sh will ask for.
echo "::group::Confirm both images are in the registry"
API_DIGEST=""
WEB_DIGEST=""
for service in api web; do
  digest="$(az acr repository show --name "$ACR_NAME" \
    --image "nimbus-${service}:${IMAGE_TAG}" --query digest -o tsv)"
  if [[ ! "$digest" =~ ^sha256:[0-9a-f]{64}$ ]]; then
    printf '::error::nimbus-%s:%s did not resolve to a sha256 digest (got %q)\n' \
      "$service" "$IMAGE_TAG" "$digest"
    exit 1
  fi
  printf 'nimbus-%s@%s\n' "$service" "$digest"
  if [[ "$service" == api ]]; then API_DIGEST="$digest"; else WEB_DIGEST="$digest"; fi
done
echo "::endgroup::"

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  {
    printf '### Published images\n\n| | |\n|---|---|\n'
    printf '| tag | `%s` |\n| api | `%s.azurecr.io/nimbus-api@%s` |\n| web | `%s.azurecr.io/nimbus-web@%s` |\n' \
      "$IMAGE_TAG" "$ACR_NAME" "$API_DIGEST" "$ACR_NAME" "$WEB_DIGEST"
  } >> "$GITHUB_STEP_SUMMARY"
fi
