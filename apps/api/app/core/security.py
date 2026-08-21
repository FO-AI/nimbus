"""Local validation for Microsoft Entra ID access tokens.

The frontend requests an access token scoped to Nimbus API. Because this API
owns the token's audience, the backend validates its signature, issuer,
audience, and expiry locally using Microsoft Entra ID's published signing
keys. Identity, role, and group information is then read from the verified
JWT claims. Group-overage claims are logged but not resolved; group-based
authorization therefore fails closed when direct group claims are unavailable.

`AUTH_MODE=disabled` (LOCAL/TEST ONLY) bypasses validation entirely and
returns a fake dev principal. It logs a warning on every request so it can
never be mistaken for a secure configuration.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from functools import lru_cache

import jwt
from jwt import PyJWKClient
from jwt.exceptions import (
    ExpiredSignatureError,
    InvalidTokenError,
    PyJWKClientConnectionError,
    PyJWKClientError,
    PyJWKSetError,
)

from app.core.config import Settings
from app.core.errors import UnauthorizedError, UpstreamServiceError
from app.core.logging import get_logger

logger = get_logger(__name__)


@lru_cache(maxsize=8)
def _jwk_client(jwks_uri: str) -> PyJWKClient:
    return PyJWKClient(jwks_uri, cache_keys=True, timeout=5.0)


@dataclass
class Principal:
    """The authenticated caller, normalized from verified JWT claims."""

    subject: str
    name: str
    email: str
    roles: list[str] = field(default_factory=list)
    groups: list[str] = field(default_factory=list)
    is_dev_principal: bool = False

    def has_role(self, role: str) -> bool:
        return role in self.roles

    def in_group(self, group_id: str) -> bool:
        return bool(group_id) and group_id in self.groups


def _dev_principal() -> Principal:
    logger.warning(
        "AUTH_MODE=disabled: returning a FAKE development principal. "
        "This is UNSAFE and must never be used outside local development."
    )
    return Principal(
        subject="dev-user",
        name="Local Developer",
        email="dev@localhost",
        roles=["user", "admin"],
        groups=["local-dev-admins"],
        is_dev_principal=True,
    )


def _principal_from_claims(claims: dict) -> Principal:
    claim_names = claims.get("_claim_names")
    if isinstance(claim_names, dict) and "groups" in claim_names:
        logger.warning(
            "Access token contains a group-overage claim; group authorization "
            "will fail closed because overage resolution is not configured"
        )

    return Principal(
        subject=claims.get("oid") or claims.get("sub", "unknown"),
        name=claims.get("name", ""),
        email=(claims.get("preferred_username") or claims.get("upn") or claims.get("email", "")),
        roles=claims.get("roles", []) or [],
        groups=claims.get("groups", []) or [],
    )


def validate_token(token: str, settings: Settings) -> Principal:
    """Validate a bearer token and return the caller principal.

    Raises `UnauthorizedError` on any validation failure.
    """
    if settings.auth_disabled:
        return _dev_principal()

    if not settings.azure_tenant_id:
        raise UnauthorizedError("Auth is enabled but AZURE_TENANT_ID is not configured")

    audiences = [
        audience
        for audience in (
            settings.entra_backend_client_id,
            settings.entra_backend_app_id_uri,
        )
        if audience
    ]
    if not audiences:
        raise UnauthorizedError("Auth is enabled but no API audience is configured")

    if not token:
        raise UnauthorizedError("Missing bearer token")

    try:
        signing_key = _jwk_client(settings.entra_jwks_uri).get_signing_key_from_jwt(token)
    except PyJWKClientConnectionError as exc:
        logger.warning("Microsoft Entra ID unreachable during token validation: %s", exc)
        raise UpstreamServiceError("Could not reach Microsoft Entra ID to verify token") from exc
    except PyJWKSetError as exc:
        logger.warning("Microsoft Entra ID returned an unusable JWKS: %s", exc)
        raise UpstreamServiceError("Could not verify token with Microsoft Entra ID") from exc
    except PyJWKClientError as exc:
        logger.info("Token signing-key validation failed: %s", type(exc).__name__)
        raise UnauthorizedError("Invalid access token") from exc

    try:
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=audiences,
            issuer=settings.entra_issuer,
            leeway=settings.jwt_leeway_seconds,
            options={"require": ["exp", "iss", "aud"]},
        )
    except ExpiredSignatureError as exc:
        logger.info("Token validation failed: %s", type(exc).__name__)
        raise UnauthorizedError("Access token has expired") from exc
    except InvalidTokenError as exc:
        logger.info("Token validation failed: %s", type(exc).__name__)
        raise UnauthorizedError("Invalid access token") from exc

    return _principal_from_claims(claims)
