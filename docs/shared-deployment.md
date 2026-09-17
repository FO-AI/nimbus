# Shared dev deployment

Nimbus keeps two workflows: `CI` and `Deploy (dev)`. After main CI succeeds,
`deploy-dev.yml` calls the pinned FO-AI Azure wrapper, which logs in with OIDC and
runs `scripts/deploy.sh` from the tested Nimbus commit.

The script owns the existing ACR builds, Key Vault synchronization, API/web
configuration, revision updates, and health checks. The wrapper owns checkout,
Azure login, the `dev` environment, deployment concurrency, and an initial
current-main check. The script checks main again after building the images.

## Before merging the migration

- Confirm repository/environment target variables: `RESOURCE_GROUP`, `ACR_NAME`,
  `KEY_VAULT_NAME`, `API_APP_NAME`, `WEB_APP_NAME`, `API_URL`, and `AZURE_WEB_URL`.
  Optional `WEB_URL` overrides the web URL used for auth redirects and CORS.
- Keep Azure identity IDs and `API_ENV_FILE` / `WEB_ENV_FILE` in the existing
  GitHub settings. Do not commit their values. Environment variables override
  repository variables when the shared job enters `dev`.
- Restrict the `dev` environment to the `main` branch. Ensure any Azure OIDC policy
  that checks `job_workflow_ref` permits the pinned shared workflow.
- Require the four CI checks. The Backend job also runs 11 deployment tests with
  mocked Azure/GitHub/HTTP commands; those tests never access Azure.

Merging this PR replaces the existing deployment workflow in place. Successful CI
on the resulting main commit triggers a real dev deployment; a PR run does not.

## Verify the first deployment

1. Confirm main CI passes and `Deploy (dev)` follows for that commit.
2. Confirm the run uses the pinned shared `deploy-azure.yml` and Azure login passes.
3. Check the grouped logs for image builds, secret sync, both revision updates,
   and health checks. The deployment summary's image tag must match the CI SHA.
4. In Azure, verify that both apps serve the intended image/revision. URL health
   checks alone cannot identify which revision answered the request.
5. Open the app, sign in, and exercise a normal authenticated flow. Mock CI does
   not test live Entra or Foundry integration.

## Redeploy and recover

Use **Deploy (dev) → Run workflow → main** to redeploy current main. Other branches
and older commit reruns are rejected. Manual redeploy does not require a new CI run.

To back out the workflow migration, revert its PR on main through the normal PR
process. CI then triggers the restored workflow for the new revert commit. Do not
rerun an older successful job: the shared wrapper intentionally refuses old SHAs.

This migration preserves the existing lack of automatic rollback and historical
image recovery. A failed partial rollout may need operator recovery of images and
configuration in Azure; reverting workflow code does not restore secret values.
Temporary runner secret files are removed after both success and failure.

Run the deployment tests locally with `python3 scripts/tests/test_deploy.py`.
