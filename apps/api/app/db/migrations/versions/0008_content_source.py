"""content_items.source: provenance for linked and imported material

Revision ID: 0008_content_source
Revises: 0007_project_registry
Create Date: 2026-09-08
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB

revision = "0008_content_source"
down_revision = "0007_project_registry"
branch_labels = None
depends_on = None

_json = sa.JSON().with_variant(JSONB(), "postgresql")


def upgrade() -> None:
    # Every pre-existing row was authored in-house, and an empty dict is how
    # the sync represents `mode: original`, so `{}` is the correct backfill.
    op.add_column(
        "content_items",
        sa.Column("source", _json, nullable=False, server_default="{}"),
    )


def downgrade() -> None:
    op.drop_column("content_items", "source")
