"""Exercise deployment orchestration with fake Azure/GitHub/curl executables only."""

import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "cd.sh"
SHA = "a" * 40
DIGEST = "sha256:" + "c" * 64
MOCK = r'''#!PYTHON
import json, os, pathlib, stat, sys
name = pathlib.Path(sys.argv[0]).name
args = sys.argv[1:]
record = {"name": name, "args": args}
if name == "az" and args[:3] == ["keyvault", "secret", "set"]:
    secret_path = pathlib.Path(args[args.index("--file") + 1])
    record["file_mode"] = stat.S_IMODE(secret_path.stat().st_mode)
    record["file_exists"] = secret_path.is_file()
with open(os.environ["MOCK_LOG"], "a") as log:
    log.write(json.dumps(record) + "\n")
if os.environ.get("MOCK_FAIL") and os.environ["MOCK_FAIL"] in " ".join([name] + args):
    sys.exit(22)
if name == "gh":
    print(os.environ.get("MOCK_MAIN_SHA", os.environ["DEPLOY_SHA"]))
if name == "az" and args[:3] == ["acr", "repository", "show"]:
    # The digest cd.sh promotes comes from here and nowhere else.
    print(os.environ["MOCK_DIGEST"])
'''


class DeploymentTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.bin = self.root / "bin"
        self.bin.mkdir()
        self.runner = self.root / "runner"
        self.runner.mkdir()
        self.log = self.root / "commands.jsonl"
        self.summary = self.root / "summary.md"
        for name in ("az", "gh", "curl"):
            path = self.bin / name
            path.write_text(MOCK.replace("PYTHON", sys.executable))
            path.chmod(0o755)
        self.env = {
            **os.environ,
            "PATH": f"{self.bin}:{os.environ['PATH']}",
            "RUNNER_TEMP": str(self.runner),
            "GITHUB_STEP_SUMMARY": str(self.summary),
            "MOCK_LOG": str(self.log),
            "MOCK_FAIL": "",
            "MOCK_MAIN_SHA": SHA,
            "MOCK_DIGEST": DIGEST,
            "DEPLOYMENT_VARS_JSON": "{}",
            "IMAGE_TAG": SHA,
            "DEPLOY_SHA": SHA,
            "GITHUB_REPOSITORY": "FO-AI/nimbus",
            "GH_TOKEN": "fake-test-token",
            "RESOURCE_GROUP": "test-rg",
            "ACR_NAME": "testregistry",
            "KEY_VAULT_NAME": "test-vault",
            "API_APP_NAME": "test-api",
            "WEB_APP_NAME": "test-web",
            "API_URL": "https://api.example.test",
            "AZURE_WEB_URL": "https://web.example.test",
            "WEB_URL": "https://custom.example.test",
            "API_ENV_FILE": "\n".join([
                "AUTH_MODE=entra", "AZURE_TENANT_ID=test-tenant",
                "ENTRA_BACKEND_CLIENT_ID=test-backend",
                "ENTRA_BACKEND_APP_ID_URI=api://test-backend",
                "DEV_DATABASE_URL=postgresql://example.test/db",
                "AZURE_AI_FOUNDRY_API_KEY=fake-test-key",
            ]),
            "WEB_ENV_FILE": "\n".join([
                "NEXT_PUBLIC_ENTRA_CLIENT_ID=test-frontend",
                "NEXT_PUBLIC_ENTRA_TENANT_ID=test-tenant",
                "NEXT_PUBLIC_ENTRA_API_SCOPE=api://test-backend/access",
            ]),
        }

    def run_script(self, **overrides):
        result = subprocess.run(
            ["bash", str(SCRIPT)], env={**self.env, **overrides},
            cwd=self.root, text=True, capture_output=True,
        )
        commands = [json.loads(line) for line in self.log.read_text().splitlines()] if self.log.exists() else []
        self.assertEqual(list(self.runner.iterdir()), [], "temporary secrets must be removed")
        return result, commands

    @staticmethod
    def updates(commands):
        return [c["args"] for c in commands if c["name"] == "az" and c["args"][:2] == ["containerapp", "update"]]

    def test_success_promotes_published_digests_and_preserves_runtime_configuration(self):
        result, commands = self.run_script()
        self.assertEqual(result.returncode, 0, result.stderr)
        az = [c["args"] for c in commands if c["name"] == "az"]
        self.assertEqual([a[:2] for a in az[:5]], [
            ["group", "show"], ["acr", "show"], ["keyvault", "show"],
            ["containerapp", "show"], ["containerapp", "show"],
        ])
        lookups = [a for a in az if a[:3] == ["acr", "repository", "show"]]
        self.assertEqual(
            [a[a.index("--image") + 1] for a in lookups],
            [f"nimbus-api:{SHA}", f"nimbus-web:{SHA}"],
        )
        self.assertFalse(any(a[:2] == ["acr", "build"] for a in az), "cd.sh must never build")
        checks = [c for c in commands if c["name"] == "gh"]
        self.assertEqual([c["args"] for c in checks], [[
            "api", "repos/FO-AI/nimbus/git/ref/heads/main", "--jq", ".object.sha",
        ]])
        # Read-only work first; the main recheck sits immediately before the first mutation.
        check_index = commands.index(checks[0])
        self.assertEqual(commands[check_index - 1]["args"], lookups[1])
        self.assertEqual(commands[check_index + 1]["args"][:3], ["keyvault", "secret", "set"])
        secrets = [c for c in commands if c["args"][:3] == ["keyvault", "secret", "set"]]
        self.assertEqual(len(secrets), 2)
        self.assertTrue(all(c["file_exists"] and c["file_mode"] == 0o600 for c in secrets))
        updates = self.updates(commands)
        self.assertEqual(len(updates), 2)
        self.assertIn(f"testregistry.azurecr.io/nimbus-api@{DIGEST}", updates[0])
        self.assertIn("AUTH_MODE=entra", updates[0])
        self.assertIn("CORS_ALLOW_ORIGINS=https://custom.example.test,https://web.example.test", updates[0])
        self.assertIn("AZURE_AI_FOUNDRY_DEPLOYMENT_NAME=gpt-4o-mini", updates[0])
        self.assertIn(f"testregistry.azurecr.io/nimbus-web@{DIGEST}", updates[1])
        self.assertIn("NEXT_PUBLIC_AUTH_DISABLED=false", updates[1])
        self.assertIn("NEXT_PUBLIC_ENTRA_REDIRECT_URI=https://custom.example.test", updates[1])
        self.assertFalse(any(f":{SHA}" in arg for update in updates for arg in update), "promote by digest, not tag")
        curls = [c["args"] for c in commands if c["name"] == "curl"]
        self.assertEqual([a[-1] for a in curls], [
            "https://api.example.test/health/ready", "https://web.example.test",
        ])
        self.assertEqual([a[a.index("--retry") + 1] for a in curls], ["30", "12"])
        summary = self.summary.read_text()
        self.assertIn(SHA, summary)
        self.assertIn(DIGEST, summary)

    def test_custom_domain_is_optional(self):
        result, commands = self.run_script(WEB_URL="")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("NEXT_PUBLIC_ENTRA_REDIRECT_URI=https://web.example.test", self.updates(commands)[1])

    def test_environment_variables_are_loaded_after_entering_dev(self):
        names = ["RESOURCE_GROUP", "ACR_NAME", "KEY_VAULT_NAME", "API_APP_NAME", "WEB_APP_NAME", "API_URL", "AZURE_WEB_URL", "WEB_URL"]
        variables = {name: self.env[name] for name in names}
        variables["WEB_URL"] = "https://environment.example.test"
        result, commands = self.run_script(**{name: "" for name in names}, DEPLOYMENT_VARS_JSON=json.dumps(variables))
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("NEXT_PUBLIC_ENTRA_REDIRECT_URI=https://environment.example.test", self.updates(commands)[1])

    def test_missing_target_variable_stops_before_azure(self):
        result, commands = self.run_script(ACR_NAME="")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("ACR_NAME", result.stdout)
        self.assertEqual(commands, [])

    def test_malformed_image_tag_stops_before_azure(self):
        result, commands = self.run_script(IMAGE_TAG="latest")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("IMAGE_TAG", result.stdout)
        self.assertEqual(commands, [])

    def test_disabled_auth_fails_before_any_azure_command(self):
        result, commands = self.run_script(API_ENV_FILE=self.env["API_ENV_FILE"].replace("AUTH_MODE=entra", "AUTH_MODE=disabled"))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("AUTH_MODE must be entra", result.stdout)
        self.assertEqual(commands, [])

    def test_local_database_fails_before_any_azure_command(self):
        result, commands = self.run_script(API_ENV_FILE=self.env["API_ENV_FILE"].replace("example.test/db", "localhost/db"))
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(commands, [])

    def test_missing_secret_fails_before_any_azure_command(self):
        result, commands = self.run_script(WEB_ENV_FILE="")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(commands, [])

    def test_unpublished_image_stops_before_any_change(self):
        result, commands = self.run_script(MOCK_FAIL="acr repository show")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("publish must succeed before deploy", result.stdout)
        self.assertFalse(any(c["name"] == "gh" for c in commands))
        self.assertFalse(any(c["args"][:3] == ["keyvault", "secret", "set"] for c in commands))
        self.assertEqual(self.updates(commands), [])
        self.assertFalse(self.summary.exists())

    def test_malformed_digest_stops_before_any_change(self):
        result, commands = self.run_script(MOCK_DIGEST="latest")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("did not resolve to a sha256 digest", result.stdout)
        self.assertFalse(any(c["args"][:3] == ["keyvault", "secret", "set"] for c in commands))
        self.assertEqual(self.updates(commands), [])
        self.assertFalse(self.summary.exists())

    def test_newer_main_stops_before_secrets_or_app_updates(self):
        result, commands = self.run_script(MOCK_MAIN_SHA="b" * 40)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Refusing stale deployment", result.stdout)
        self.assertEqual(commands[-1]["name"], "gh")
        self.assertFalse(any(c["args"][:3] == ["keyvault", "secret", "set"] for c in commands))
        self.assertEqual(self.updates(commands), [])
        self.assertFalse(self.summary.exists())

    def test_main_lookup_failure_stops_before_secrets_or_app_updates(self):
        result, commands = self.run_script(MOCK_FAIL="gh api")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(commands[-1]["name"], "gh")
        self.assertFalse(any(c["args"][:3] == ["keyvault", "secret", "set"] for c in commands))
        self.assertEqual(self.updates(commands), [])
        self.assertFalse(self.summary.exists())

    def test_key_vault_failure_cleans_plaintext_and_stops_deployment(self):
        result, commands = self.run_script(MOCK_FAIL="--name foundry-api-key")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.updates(commands), [])
        self.assertFalse(self.summary.exists())

    def test_failed_health_check_fails_run_without_success_summary(self):
        result, commands = self.run_script(MOCK_FAIL="https://api.example.test/health/ready")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(sum(c["name"] == "curl" for c in commands), 1)
        self.assertFalse(self.summary.exists())


if __name__ == "__main__":
    unittest.main()
