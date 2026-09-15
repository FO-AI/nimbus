"""Shared test fixtures.

Configures a safe, dependency-free environment BEFORE the app is imported:
mock AI, disabled auth, and an in-memory SQLite database. No Azure credentials
or network access are required to run the suite.
"""
from __future__ import annotations

import os

# Must be set before any app module reads settings.
os.environ.setdefault("ENVIRONMENT", "test")
os.environ.setdefault("AI_PROVIDER", "mock")
os.environ.setdefault("AUTH_MODE", "disabled")
os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("ADMIN_GROUP_ID", "local-dev-admins")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.models  # noqa: F401  register models on metadata
from app.db.base import Base
from app.db.session import get_db
from app.main import app


@pytest.fixture
def _engine():
    # One in-memory database per test. It was shared for the whole session,
    # which made every test that writes a row a possible cause of a failure
    # somewhere else — test_insights asserts exact totals, so /ask's audit
    # rows silently inflated its counts.
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    return engine


@pytest.fixture
def db_session(_engine):
    TestingSession = sessionmaker(bind=_engine, autoflush=False, expire_on_commit=False)
    session = TestingSession()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(_engine):
    TestingSession = sessionmaker(bind=_engine, autoflush=False, expire_on_commit=False)

    def _override_get_db():
        session = TestingSession()
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
