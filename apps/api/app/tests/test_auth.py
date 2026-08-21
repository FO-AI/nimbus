"""Auth utility tests using local RSA signing keys."""

from datetime import UTC, datetime, timedelta
from types import SimpleNamespace

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import rsa
from jwt.exceptions import PyJWKClientConnectionError, PyJWKClientError, PyJWKSetError
from pydantic import ValidationError

from app.core import security
from app.core.config import AuthMode, Settings
from app.core.errors import ForbiddenError, UnauthorizedError, UpstreamServiceError
from app.core.security import Principal, _principal_from_claims, validate_token
from app.services.identity.current_user import require_admin


@pytest.fixture(scope="module")
def rsa_keypair():
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    return private_key, private_key.public_key()


class StubJWKClient:
    def __init__(self, key=None, error=None):
        self.key = key
        self.error = error

    def get_signing_key_from_jwt(self, token):
        if self.error:
            raise self.error
        return SimpleNamespace(key=self.key)


def _entra_settings(**overrides) -> Settings:
    values = {
        "auth_mode": AuthMode.entra,
        "azure_tenant_id": "tenant-1",
        "entra_backend_client_id": "api-client-id",
        "entra_backend_app_id_uri": "api://api-client-id",
        "jwt_leeway_seconds": 60,
    }
    values.update(overrides)
    return Settings(**values)


def _encode_token(private_key, settings: Settings, **overrides) -> str:
    claims = {
        "iss": settings.entra_issuer,
        "aud": settings.entra_backend_client_id,
        "exp": datetime.now(UTC) + timedelta(minutes=5),
        "oid": "u1",
        "name": "User One",
        "preferred_username": "u1@contoso.com",
        "roles": ["user"],
        "groups": ["group-1"],
    }
    claims.update(overrides)
    return jwt.encode(claims, private_key, algorithm="RS256")


def _stub_jwk_client(monkeypatch, *, key=None, error=None):
    client = StubJWKClient(key=key, error=error)
    monkeypatch.setattr(security, "_jwk_client", lambda _uri: client)
    return client


def test_disabled_mode_returns_dev_admin_principal():
    settings = Settings(auth_mode=AuthMode.disabled)
    principal = validate_token("", settings)
    assert principal.is_dev_principal is True
    assert principal.has_role("admin")


def test_principal_from_claims_maps_oid_and_preferred_username():
    principal = _principal_from_claims(
        {
            "oid": "abc-123",
            "name": "Ada Lovelace",
            "preferred_username": "ada@contoso.com",
        }
    )
    assert principal.subject == "abc-123"
    assert principal.name == "Ada Lovelace"
    assert principal.email == "ada@contoso.com"


def test_principal_from_claims_falls_back_to_sub_and_upn():
    principal = _principal_from_claims(
        {"sub": "pairwise-subject", "name": "Ada", "upn": "ada@contoso.com"}
    )
    assert principal.subject == "pairwise-subject"
    assert principal.email == "ada@contoso.com"


def test_principal_from_claims_maps_roles_and_groups():
    principal = _principal_from_claims(
        {
            "oid": "abc-123",
            "roles": ["admin", "user"],
            "groups": ["group-1", "group-2"],
        }
    )
    assert principal.roles == ["admin", "user"]
    assert principal.groups == ["group-1", "group-2"]


def test_principal_from_claims_warns_and_fails_closed_on_group_overage(caplog):
    principal = _principal_from_claims(
        {
            "oid": "abc-123",
            "_claim_names": {"groups": "src1"},
        }
    )

    assert principal.groups == []
    assert principal.in_group("group-1") is False
    assert "group-overage claim" in caplog.text


def test_enabled_mode_without_tenant_is_unauthorized():
    settings = Settings(auth_mode=AuthMode.entra, azure_tenant_id="")
    with pytest.raises(UnauthorizedError):
        validate_token("some.token", settings)


def test_enabled_mode_without_audience_configured_is_unauthorized():
    settings = _entra_settings(
        entra_backend_client_id="",
        entra_backend_app_id_uri="",
    )
    with pytest.raises(
        UnauthorizedError,
        match="Auth is enabled but no API audience is configured",
    ):
        validate_token("some.token", settings)


@pytest.mark.parametrize("audience", ["api-client-id", "api://api-client-id"])
def test_enabled_mode_accepts_valid_jwt(
    monkeypatch,
    rsa_keypair,
    audience,
):
    private_key, public_key = rsa_keypair
    settings = _entra_settings()
    token = _encode_token(private_key, settings, aud=audience)
    _stub_jwk_client(monkeypatch, key=public_key)

    principal = validate_token(token, settings)

    assert principal.subject == "u1"
    assert principal.name == "User One"
    assert principal.email == "u1@contoso.com"
    assert principal.roles == ["user"]
    assert principal.groups == ["group-1"]


def test_enabled_mode_rejects_wrong_signature(monkeypatch, rsa_keypair):
    _, public_key = rsa_keypair
    wrong_private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    settings = _entra_settings()
    token = _encode_token(wrong_private_key, settings)
    _stub_jwk_client(monkeypatch, key=public_key)

    with pytest.raises(UnauthorizedError, match="Invalid access token"):
        validate_token(token, settings)


def test_enabled_mode_rejects_wrong_audience(monkeypatch, rsa_keypair):
    private_key, public_key = rsa_keypair
    settings = _entra_settings()
    token = _encode_token(private_key, settings, aud="some-other-api")
    _stub_jwk_client(monkeypatch, key=public_key)

    with pytest.raises(UnauthorizedError, match="Invalid access token"):
        validate_token(token, settings)


def test_enabled_mode_rejects_wrong_issuer(monkeypatch, rsa_keypair):
    private_key, public_key = rsa_keypair
    settings = _entra_settings()
    token = _encode_token(
        private_key,
        settings,
        iss="https://login.microsoftonline.com/wrong-tenant/v2.0",
    )
    _stub_jwk_client(monkeypatch, key=public_key)

    with pytest.raises(UnauthorizedError, match="Invalid access token"):
        validate_token(token, settings)


def test_enabled_mode_rejects_expired_token_beyond_leeway(monkeypatch, rsa_keypair):
    private_key, public_key = rsa_keypair
    settings = _entra_settings(jwt_leeway_seconds=60)
    token = _encode_token(
        private_key,
        settings,
        exp=datetime.now(UTC) - timedelta(minutes=2),
    )
    _stub_jwk_client(monkeypatch, key=public_key)

    with pytest.raises(UnauthorizedError, match="Access token has expired"):
        validate_token(token, settings)


def test_enabled_mode_accepts_token_expired_within_leeway(monkeypatch, rsa_keypair):
    private_key, public_key = rsa_keypair
    settings = _entra_settings(jwt_leeway_seconds=60)
    token = _encode_token(
        private_key,
        settings,
        exp=datetime.now(UTC) - timedelta(seconds=30),
    )
    _stub_jwk_client(monkeypatch, key=public_key)

    principal = validate_token(token, settings)

    assert principal.subject == "u1"


def test_enabled_mode_surfaces_jwks_connection_error(monkeypatch):
    settings = _entra_settings()
    _stub_jwk_client(
        monkeypatch,
        error=PyJWKClientConnectionError("boom"),
    )

    with pytest.raises(
        UpstreamServiceError,
        match="Could not reach Microsoft Entra ID to verify token",
    ):
        validate_token("some-token", settings)


def test_enabled_mode_surfaces_unusable_jwks(monkeypatch):
    settings = _entra_settings()
    _stub_jwk_client(
        monkeypatch,
        error=PyJWKSetError("no usable signing keys"),
    )

    with pytest.raises(
        UpstreamServiceError,
        match="Could not verify token with Microsoft Entra ID",
    ):
        validate_token("some-token", settings)


def test_enabled_mode_rejects_unknown_signing_key(monkeypatch):
    settings = _entra_settings()
    _stub_jwk_client(
        monkeypatch,
        error=PyJWKClientError("unknown kid"),
    )

    with pytest.raises(UnauthorizedError, match="Invalid access token"):
        validate_token("some-token", settings)


def test_disabled_mode_rejected_outside_local_or_test_env():
    with pytest.raises(ValidationError):
        Settings(auth_mode=AuthMode.disabled, environment="prod")


def test_wildcard_cors_rejected_outside_local_or_test_env():
    with pytest.raises(ValidationError):
        Settings(auth_mode=AuthMode.entra, environment="prod", cors_allow_origins="*")


def test_require_admin_rejects_non_admin():
    non_admin = Principal(subject="u1", name="U", email="u@x", roles=["user"], groups=[])
    settings = Settings(admin_group_id="admins")
    with pytest.raises(ForbiddenError):
        require_admin(non_admin, settings)


def test_require_admin_allows_group_member():
    member = Principal(subject="u2", name="U2", email="u2@x", roles=[], groups=["admins"])
    settings = Settings(admin_group_id="admins")
    assert require_admin(member, settings) is member
