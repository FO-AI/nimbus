# Shared CI/CD

Nimbus follows the FO-AI repository script contract: three scripts, each with one job,
driven by two thin caller workflows that are the same shape in every FO-AI repo. The
contract itself is written down once, in the
[FO-AI/automation README](https://github.com/FO-AI/automation#repository-script-contract);
this page covers only what is Nimbus-specific.

| Script | Job | Runs in |
| --- | --- | --- |
| `scripts/ci.sh <backend\|frontend>` | One named check. No cloud access; sets its own test-only env (`AI_PROVIDER=mock`, `AUTH_MODE=disabled`). | `CI` → `checks`, and on any laptop |
| `scripts/publish.sh` | `az acr build` both images as `nimbus-<service>:$IMAGE_TAG`, then confirm both tags resolve to digests. Never deploys. | `CI` → `publish`, push to `main` only |
| `scripts/cd.sh` | Resolve the digests published for `$IMAGE_TAG`, sync Key Vault, update both Container Apps **by digest**, verify health. Never builds. | `CD` → `deploy`, inside the shared `deploy-azure` wrapper |

`CI` (`.github/workflows/ci.yml`) makes one call to the shared `ci.yml` with two check
entries plus two PR-time container builds, aggregates them in `verify` (the one status
check to require), and on a `main` push runs `publish`. `CD` (`.github/workflows/cd.yml`)
fires on a successful `CI` run for `main` and calls the shared wrapper, which checks out
the tested commit, rejects a stale main, enters the `dev` environment, signs in with OIDC,
and runs `scripts/cd.sh`. The script rechecks main once more immediately before its first
change to Azure.

## Settings

**Repository variables** (readable by `publish`, which declares no environment):
`ACR_NAME`, `AZURE_CLIENT_ID`, `AZURE_SUBSCRIPTION_ID` (`AZURE_TENANT_ID` is an org
variable), and the five values Next.js inlines into the web image at build time:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_ENTRA_CLIENT_ID`
- `NEXT_PUBLIC_ENTRA_TENANT_ID`
- `NEXT_PUBLIC_ENTRA_REDIRECT_URI`
- `NEXT_PUBLIC_ENTRA_API_SCOPE`

None of the five is a secret (client/tenant IDs and URLs). They must exist **before the
first publish**; `publish.sh` fails naming the missing one and pushes nothing. They live at
repository level because a job outside the `dev` environment cannot read `WEB_ENV_FILE`.

**Repository or `dev` environment variables** (read by `cd.sh` through
`DEPLOYMENT_VARS_JSON`): `RESOURCE_GROUP`, `KEY_VAULT_NAME`, `API_APP_NAME`,
`WEB_APP_NAME`, `API_URL`, `AZURE_WEB_URL`, and optional `WEB_URL` for the custom domain
used in redirects and CORS. Environment values override repository values.

**`dev` environment secrets**: `API_ENV_FILE`, `WEB_ENV_FILE`. Do not commit their values.

Two federated credentials are required because the OIDC subject differs per job:

| job | subject |
| --- | --- |
| `CI` → `publish` | `repo:FO-AI@<org-id>/nimbus@<repo-id>:ref:refs/heads/main` |
| `CD` → `deploy` | `repo:FO-AI@<org-id>/nimbus@<repo-id>:environment:dev` |

Restrict the `dev` environment to `main`. Any Azure OIDC policy that checks
`job_workflow_ref` must permit the shared workflows at `FO-AI/automation@v1`.

## Verify a change

1. **Laptop**: `bash scripts/ci.sh backend` and `bash scripts/ci.sh frontend` pass with no
   environment set beforehand.
2. **PR**: `checks / backend`, `checks / frontend`, `checks / Build api`,
   `checks / Build web`, and `verify` are green; `publish` and `CD` are skipped.
3. **Push to main**: `publish` runs; `az acr repository show-tags --name <acr> --repository
   nimbus-api` lists the commit SHA, and likewise for `nimbus-web`.
4. **CD**: the step summary shows both images as `@sha256:…` digests, `/health/ready`
   answers, and each Container App revision's image string is a digest. URL health checks
   cannot identify which revision answered, so confirm in Azure as well.
5. Sign in and exercise a normal authenticated flow. Mock CI does not test live Entra or
   Foundry integration.

`checks / backend` also runs `scripts/tests/test_deploy.py`: 14 scenarios that drive
`cd.sh` against fake `az`/`gh`/`curl` executables, covering validation order, digest
resolution, the stale-main recheck, secret cleanup, and health gating. Run it locally
with `python3 scripts/tests/test_deploy.py`.

## Redeploy and recover

**CD → Run workflow → main** redeploys current `main` without a new CI run. Other branches
and older commits are rejected by the wrapper.

To back out a pipeline change, revert its PR on `main` through the normal PR process; CI
then publishes and CD deploys the revert commit. Do not rerun an older successful job: the
wrapper intentionally refuses stale SHAs.

There is still no automatic rollback or historical-image recovery, no semantic health
check beyond `/health/ready`, and the env files are still `source`d in `cd.sh`. Those are
tracked as a separate hardening ticket; this layout changes where things live, not how
strict they are.
